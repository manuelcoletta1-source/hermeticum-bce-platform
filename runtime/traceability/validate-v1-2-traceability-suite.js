"use strict";

const fs = require("fs");
const path = require("path");
const { validateTraceabilityRecordFile } = require("./validate-v1-2-traceability-record.js");
const { validateTraceabilityIndex } = require("./validate-v1-2-traceability-index.js");

function listTraceabilityRecordFiles(traceabilityDir = "docs/launch/traceability") {
  return fs.readdirSync(traceabilityDir)
    .filter((file) => file.endsWith(".json") && file !== "index.json")
    .map((file) => path.join(traceabilityDir, file))
    .sort();
}

function validateTraceabilitySuite(options = {}) {
  const indexPath = options.indexPath || "docs/launch/traceability/index.json";
  const traceabilityDir = options.traceabilityDir || path.dirname(indexPath);
  const errors = [];

  const indexResult = validateTraceabilityIndex(indexPath);
  if (!indexResult.ok) {
    errors.push(...indexResult.errors.map((e) => `index: ${e}`));
  }

  let recordFiles = [];
  try {
    recordFiles = listTraceabilityRecordFiles(traceabilityDir);
  } catch (err) {
    errors.push(`records: cannot list ${traceabilityDir}: ${err.message}`);
  }

  if (recordFiles.length === 0) {
    errors.push("records: at least one V1.2 traceability record is required");
  }

  for (const file of recordFiles) {
    const result = validateTraceabilityRecordFile(file);
    if (!result.ok) {
      errors.push(`record ${file}: ${result.errors.join("; ")}`);
    }
  }

  let index;
  try {
    index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  } catch (err) {
    errors.push(`index: cannot read for suite checks: ${err.message}`);
  }

  if (index && Array.isArray(index.records)) {
    for (const record of index.records) {
      if (record.result === "PASS" && record.execution_claimed === true && !record.execution_trace_ref) {
        errors.push(`record ${record.record_id}: execution PASS missing execution_trace_ref`);
      }

      if (record.result === "PASS" && record.consequence_claimed === true) {
        const hasConsequence = typeof record.consequence_trace_ref === "string" && record.consequence_trace_ref.trim() !== "";
        const hasTargetReceipt = typeof record.target_receipt_ref === "string" && record.target_receipt_ref.trim() !== "";
        const hasObserver = typeof record.observer_ref === "string" && record.observer_ref.trim() !== "";

        if (!hasConsequence && !hasTargetReceipt && !hasObserver) {
          errors.push(`record ${record.record_id}: consequence PASS missing consequence_trace_ref/target_receipt_ref/observer_ref`);
        }
      }

      if (record.overclaim_check && record.overclaim_check.semantic_overclaim_rejected !== true) {
        errors.push(`record ${record.record_id}: semantic overclaim check not true`);
      }

      if (record.claim_ceiling) {
        const prohibitedClaims = [
          "not_certification",
          "not_legal_validity",
          "not_procurement_eligibility"
        ];

        for (const claim of prohibitedClaims) {
          if (record.claim_ceiling[claim] !== true) {
            errors.push(`record ${record.record_id}: claim_ceiling.${claim} must be true`);
          }
        }
      }
    }
  }

  return {
    ok: errors.length === 0,
    reason_codes: errors.length === 0 ? ["TRACEABILITY_V1_2_SUITE_VALID"] : ["TRACEABILITY_V1_2_SUITE_INVALID"],
    record_count: recordFiles.length,
    index_path: indexPath,
    traceability_dir: traceabilityDir,
    errors
  };
}

if (require.main === module) {
  const indexPath = process.argv[2] || "docs/launch/traceability/index.json";
  const result = validateTraceabilitySuite({
    indexPath,
    traceabilityDir: path.dirname(indexPath)
  });

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

module.exports = {
  validateTraceabilitySuite,
  listTraceabilityRecordFiles
};
