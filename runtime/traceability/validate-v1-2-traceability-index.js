"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { validateTraceabilityRecord } = require("./validate-v1-2-traceability-record.js");

function sha256(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateTraceabilityIndex(indexPath = "docs/launch/traceability/index.json") {
  const errors = [];
  const root = process.cwd();
  const fullIndexPath = path.isAbsolute(indexPath) ? indexPath : path.join(root, indexPath);

  let index;
  try {
    index = JSON.parse(fs.readFileSync(fullIndexPath, "utf8"));
  } catch (err) {
    return {
      ok: false,
      reason_codes: ["TRACEABILITY_INDEX_UNREADABLE"],
      errors: [`index: ${err.message}`]
    };
  }

  if (!isObject(index)) {
    return {
      ok: false,
      reason_codes: ["TRACEABILITY_INDEX_NOT_OBJECT"],
      errors: ["index: required object"]
    };
  }

  if (index.index_id !== "HBCE-V1-2-LAUNCH-TRACEABILITY-INDEX") {
    errors.push("index_id: invalid or missing");
  }

  if (index.directive_ref !== "HBCE-RD-MASTER-2027-0003-V1.2-EXECUTION-TRACE-BINDING-PATCH") {
    errors.push("directive_ref: invalid or missing");
  }

  if (index.index_semantics !== "navigation_index_not_gate_pass_not_execution_evidence") {
    errors.push("index_semantics: must remain navigation metadata, not gate/evidence");
  }

  if (!Array.isArray(index.records)) {
    errors.push("records: required array");
  }

  if (!Number.isInteger(index.record_count) || index.record_count < 0) {
    errors.push("record_count: required non-negative integer");
  }

  if (Array.isArray(index.records) && index.record_count !== index.records.length) {
    errors.push("record_count: must equal records.length");
  }

  if (!isObject(index.claim_ceiling)) {
    errors.push("claim_ceiling: required object");
  } else {
    [
      "not_execution_evidence",
      "not_receipt_validation",
      "not_external_effect_evidence",
      "not_physical_effect_evidence",
      "not_readiness_gate_pass",
      "not_product_readiness",
      "not_certification",
      "not_legal_validity",
      "not_procurement_eligibility"
    ].forEach((key) => {
      if (index.claim_ceiling[key] !== true) {
        errors.push(`claim_ceiling.${key}: must be true`);
      }
    });
  }

  const traceabilityDir = path.dirname(fullIndexPath);
  const actualRecordFiles = fs.readdirSync(traceabilityDir)
    .filter((file) => file.endsWith(".json") && file !== "index.json")
    .map((file) => path.join("docs/launch/traceability", file))
    .sort();

  const indexedFiles = Array.isArray(index.records)
    ? index.records.map((record) => record.source_file).sort()
    : [];

  for (const actual of actualRecordFiles) {
    if (!indexedFiles.includes(actual)) {
      errors.push(`records: source file not indexed: ${actual}`);
    }
  }

  for (const indexed of indexedFiles) {
    if (!actualRecordFiles.includes(indexed)) {
      errors.push(`records: indexed source file missing on disk: ${indexed}`);
    }
  }

  const seenProgramNumbers = new Set();
  const seenRecordIds = new Set();

  if (Array.isArray(index.records)) {
    for (const record of index.records) {
      if (!isObject(record)) {
        errors.push("records[]: each record must be object");
        continue;
      }

      if (seenProgramNumbers.has(record.program_number)) {
        errors.push(`records: duplicate program_number ${record.program_number}`);
      }
      seenProgramNumbers.add(record.program_number);

      if (seenRecordIds.has(record.record_id)) {
        errors.push(`records: duplicate record_id ${record.record_id}`);
      }
      seenRecordIds.add(record.record_id);

      if (typeof record.source_file !== "string" || record.source_file.trim() === "") {
        errors.push("records[].source_file: required non-empty string");
        continue;
      }

      const sourcePath = path.join(root, record.source_file);
      if (!fs.existsSync(sourcePath)) {
        errors.push(`records[].source_file: missing file ${record.source_file}`);
        continue;
      }

      const raw = fs.readFileSync(sourcePath, "utf8");
      const sourceSha = sha256(raw);

      if (record.source_sha256 !== sourceSha) {
        errors.push(`records[].source_sha256: mismatch for ${record.source_file}`);
      }

      let sourceRecord;
      try {
        sourceRecord = JSON.parse(raw);
      } catch (err) {
        errors.push(`records[].source_file: invalid JSON ${record.source_file}: ${err.message}`);
        continue;
      }

      const validation = validateTraceabilityRecord(sourceRecord);
      if (!validation.ok) {
        errors.push(`records[].source_file: invalid traceability record ${record.source_file}: ${validation.errors.join("; ")}`);
      }

      [
        "record_id",
        "directive_ref",
        "program_id",
        "program_number",
        "profile",
        "requirement_id",
        "risk_id",
        "threat_id",
        "gate_id",
        "gate_semantics",
        "evidence_class",
        "result",
        "execution_claimed",
        "execution_trace_required",
        "execution_trace_ref",
        "consequence_claimed",
        "consequence_trace_required",
        "consequence_trace_ref",
        "target_receipt_ref",
        "observer_ref",
        "owner",
        "approver",
        "residual_risk",
        "status"
      ].forEach((key) => {
        if (record[key] !== sourceRecord[key]) {
          errors.push(`records[].${key}: index/source mismatch for ${record.source_file}`);
        }
      });

      if (!isObject(record.overclaim_check)) {
        errors.push(`records[].overclaim_check: required object for ${record.source_file}`);
      } else {
        [
          "required",
          "performed",
          "result_does_not_exceed_evidence_class",
          "non_execution_gate_not_promoted_to_execution_evidence",
          "semantic_overclaim_rejected"
        ].forEach((key) => {
          if (!sourceRecord.overclaim_check || record.overclaim_check[key] !== sourceRecord.overclaim_check[key]) {
            errors.push(`records[].overclaim_check.${key}: index/source mismatch for ${record.source_file}`);
          }
        });
      }

      if (!isObject(record.claim_ceiling)) {
        errors.push(`records[].claim_ceiling: required object for ${record.source_file}`);
      } else {
        [
          "not_execution_evidence",
          "not_receipt_validation",
          "not_external_effect_evidence",
          "not_physical_effect_evidence",
          "not_readiness_gate_pass",
          "not_product_readiness",
          "not_certification",
          "not_legal_validity",
          "not_procurement_eligibility"
        ].forEach((key) => {
          if (!sourceRecord.claim_ceiling || record.claim_ceiling[key] !== sourceRecord.claim_ceiling[key]) {
            errors.push(`records[].claim_ceiling.${key}: index/source mismatch for ${record.source_file}`);
          }
        });
      }
    }
  }

  return {
    ok: errors.length === 0,
    reason_codes: errors.length === 0 ? ["TRACEABILITY_INDEX_VALID"] : ["TRACEABILITY_INDEX_INVALID"],
    errors
  };
}

if (require.main === module) {
  const indexPath = process.argv[2] || "docs/launch/traceability/index.json";
  const result = validateTraceabilityIndex(indexPath);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    process.exitCode = 1;
  }
}

module.exports = {
  validateTraceabilityIndex
};
