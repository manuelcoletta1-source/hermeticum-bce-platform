"use strict";

const fs = require("fs");

const GATE_SEMANTICS = new Set([
  "lint_only",
  "static_analysis",
  "schema_validation",
  "build_only",
  "structural_validation",
  "execution_observed",
  "consequence_observed",
  "externally_correlated"
]);

const EVIDENCE_CLASS = new Set([
  "DESIGN",
  "IMPLEMENTED",
  "STRUCTURALLY_VALIDATED",
  "EXECUTION_OBSERVED",
  "CONSEQUENCE_OBSERVED",
  "EXTERNALLY_CORROBORATED"
]);

const RESULT = new Set([
  "NOT_STARTED",
  "IMPLEMENTED",
  "PASS",
  "FAIL",
  "INCOMPLETE",
  "DEVIATED"
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasNonEmptyString(record, key, errors) {
  if (typeof record[key] !== "string" || record[key].trim() === "") {
    errors.push(`${key}: required non-empty string`);
  }
}

function hasBoolean(record, key, errors) {
  if (typeof record[key] !== "boolean") {
    errors.push(`${key}: required boolean`);
  }
}

function hasArray(record, key, errors) {
  if (!Array.isArray(record[key]) || record[key].length === 0) {
    errors.push(`${key}: required non-empty array`);
  }
}

function validateTraceabilityRecord(record) {
  const errors = [];

  if (!isObject(record)) {
    return {
      ok: false,
      reason_codes: ["TRACEABILITY_RECORD_NOT_OBJECT"],
      errors: ["record: required object"]
    };
  }

  [
    "record_id",
    "directive_ref",
    "program_id",
    "profile",
    "requirement_id",
    "risk_id",
    "threat_id",
    "gate_id",
    "gate_semantics",
    "evidence_class",
    "result",
    "pass_criterion",
    "owner",
    "approver",
    "residual_risk",
    "status"
  ].forEach((key) => hasNonEmptyString(record, key, errors));

  if (!Number.isInteger(record.program_number) || record.program_number <= 0) {
    errors.push("program_number: required positive integer");
  }

  if (!GATE_SEMANTICS.has(record.gate_semantics)) {
    errors.push(`gate_semantics: unsupported value ${record.gate_semantics}`);
  }

  if (!EVIDENCE_CLASS.has(record.evidence_class)) {
    errors.push(`evidence_class: unsupported value ${record.evidence_class}`);
  }

  if (!RESULT.has(record.result)) {
    errors.push(`result: unsupported value ${record.result}`);
  }

  [
    "launch_class_applicability",
    "changed_object_ref",
    "coverage_binding_ref",
    "evidence_ref"
  ].forEach((key) => hasArray(record, key, errors));

  [
    "execution_claimed",
    "execution_trace_required",
    "consequence_claimed",
    "consequence_trace_required"
  ].forEach((key) => hasBoolean(record, key, errors));

  if (!isObject(record.overclaim_check)) {
    errors.push("overclaim_check: required object");
  } else {
    [
      "required",
      "performed",
      "result_does_not_exceed_evidence_class",
      "non_execution_gate_not_promoted_to_execution_evidence",
      "semantic_overclaim_rejected"
    ].forEach((key) => hasBoolean(record.overclaim_check, key, errors));
  }

  if (!isObject(record.claim_ceiling)) {
    errors.push("claim_ceiling: required object");
  } else {
    [
      "not_execution_evidence",
      "not_readiness_gate_pass",
      "not_product_readiness",
      "not_certification",
      "not_legal_validity",
      "not_procurement_eligibility"
    ].forEach((key) => hasBoolean(record.claim_ceiling, key, errors));
  }

  const executionSemantics = new Set([
    "execution_observed",
    "consequence_observed",
    "externally_correlated"
  ]);

  const consequenceSemantics = new Set([
    "consequence_observed",
    "externally_correlated"
  ]);

  if (record.execution_claimed === true) {
    if (record.execution_trace_required !== true) {
      errors.push("execution_trace_required: must be true when execution_claimed is true");
    }
    if (typeof record.execution_trace_ref !== "string" || record.execution_trace_ref.trim() === "") {
      errors.push("execution_trace_ref: required non-empty string when execution_claimed is true");
    }
    if (!executionSemantics.has(record.gate_semantics)) {
      errors.push("gate_semantics: execution claim requires execution_observed/consequence_observed/externally_correlated");
    }
    if (!["EXECUTION_OBSERVED", "CONSEQUENCE_OBSERVED", "EXTERNALLY_CORROBORATED"].includes(record.evidence_class)) {
      errors.push("evidence_class: execution claim requires EXECUTION_OBSERVED or stronger");
    }
  }

  if (record.execution_claimed === false && record.execution_trace_required === true) {
    errors.push("execution_trace_required: cannot be true when execution_claimed is false");
  }

  if (record.execution_claimed === false && record.execution_trace_ref !== null) {
    errors.push("execution_trace_ref: must be null when execution_claimed is false");
  }

  if (record.consequence_claimed === true) {
    if (record.consequence_trace_required !== true) {
      errors.push("consequence_trace_required: must be true when consequence_claimed is true");
    }
    const hasConsequenceRef = typeof record.consequence_trace_ref === "string" && record.consequence_trace_ref.trim() !== "";
    const hasTargetReceipt = typeof record.target_receipt_ref === "string" && record.target_receipt_ref.trim() !== "";
    const hasObserver = typeof record.observer_ref === "string" && record.observer_ref.trim() !== "";
    if (!hasConsequenceRef && !hasTargetReceipt && !hasObserver) {
      errors.push("consequence_trace_ref/target_receipt_ref/observer_ref: one is required when consequence_claimed is true");
    }
    if (!consequenceSemantics.has(record.gate_semantics)) {
      errors.push("gate_semantics: consequence claim requires consequence_observed or externally_correlated");
    }
    if (!["CONSEQUENCE_OBSERVED", "EXTERNALLY_CORROBORATED"].includes(record.evidence_class)) {
      errors.push("evidence_class: consequence claim requires CONSEQUENCE_OBSERVED or stronger");
    }
  }

  if (record.consequence_claimed === false && record.consequence_trace_required === true) {
    errors.push("consequence_trace_required: cannot be true when consequence_claimed is false");
  }

  const nonExecutionGate = [
    "lint_only",
    "static_analysis",
    "schema_validation",
    "build_only",
    "structural_validation"
  ].includes(record.gate_semantics);

  if (nonExecutionGate && record.execution_claimed === true) {
    errors.push("non-execution gate cannot claim execution");
  }

  if (record.result === "PASS" && isObject(record.overclaim_check)) {
    if (record.overclaim_check.required !== true) {
      errors.push("overclaim_check.required: must be true for PASS");
    }
    if (record.overclaim_check.performed !== true) {
      errors.push("overclaim_check.performed: must be true for PASS");
    }
    if (record.overclaim_check.result_does_not_exceed_evidence_class !== true) {
      errors.push("overclaim_check.result_does_not_exceed_evidence_class: must be true for PASS");
    }
    if (record.overclaim_check.semantic_overclaim_rejected !== true) {
      errors.push("overclaim_check.semantic_overclaim_rejected: must be true for PASS");
    }
  }

  return {
    ok: errors.length === 0,
    reason_codes: errors.length === 0 ? ["TRACEABILITY_RECORD_VALID"] : ["TRACEABILITY_RECORD_INVALID"],
    errors
  };
}

function validateTraceabilityRecordFile(filePath) {
  const record = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return validateTraceabilityRecord(record);
}

if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("usage: node runtime/traceability/validate-v1-2-traceability-record.js <traceability-record.json>");
    process.exitCode = 2;
  } else {
    const result = validateTraceabilityRecordFile(filePath);
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) {
      process.exitCode = 1;
    }
  }
}

module.exports = {
  validateTraceabilityRecord,
  validateTraceabilityRecordFile,
  GATE_SEMANTICS,
  EVIDENCE_CLASS,
  RESULT
};
