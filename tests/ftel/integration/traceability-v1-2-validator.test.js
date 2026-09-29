const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");

const root = process.cwd();

const {
  validateTraceabilityRecord,
  validateTraceabilityRecordFile
} = require(path.join(root, "runtime/traceability/validate-v1-2-traceability-record.js"));

const validFile = path.join(
  root,
  "docs/launch/traceability/prog-174-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-receipt.v1-2-trace-binding.json"
);

const validResult = validateTraceabilityRecordFile(validFile);
assert.equal(validResult.ok, true);
assert.deepEqual(validResult.reason_codes, ["TRACEABILITY_RECORD_VALID"]);

const base = JSON.parse(fs.readFileSync(validFile, "utf8"));

const missingTrace = {
  ...base,
  execution_claimed: true,
  execution_trace_required: true,
  execution_trace_ref: null,
  gate_semantics: "execution_observed",
  evidence_class: "EXECUTION_OBSERVED"
};
const missingTraceResult = validateTraceabilityRecord(missingTrace);
assert.equal(missingTraceResult.ok, false);
assert.ok(missingTraceResult.errors.some((e) => e.includes("execution_trace_ref")));

const structuralOverclaim = {
  ...base,
  execution_claimed: true,
  execution_trace_required: true,
  execution_trace_ref: "trace://fake",
  gate_semantics: "structural_validation",
  evidence_class: "STRUCTURALLY_VALIDATED"
};
const structuralOverclaimResult = validateTraceabilityRecord(structuralOverclaim);
assert.equal(structuralOverclaimResult.ok, false);
assert.ok(
  structuralOverclaimResult.errors.some((e) =>
    e.includes("non-execution gate cannot claim execution") ||
    e.includes("execution claim requires")
  )
);

const weakExecutionEvidence = {
  ...base,
  execution_claimed: true,
  execution_trace_required: true,
  execution_trace_ref: "trace://run-001",
  gate_semantics: "execution_observed",
  evidence_class: "STRUCTURALLY_VALIDATED"
};
const weakExecutionEvidenceResult = validateTraceabilityRecord(weakExecutionEvidence);
assert.equal(weakExecutionEvidenceResult.ok, false);
assert.ok(weakExecutionEvidenceResult.errors.some((e) => e.includes("evidence_class")));

const consequenceMissingRefs = {
  ...base,
  consequence_claimed: true,
  consequence_trace_required: true,
  consequence_trace_ref: null,
  target_receipt_ref: null,
  observer_ref: null,
  gate_semantics: "consequence_observed",
  evidence_class: "CONSEQUENCE_OBSERVED"
};
const consequenceMissingRefsResult = validateTraceabilityRecord(consequenceMissingRefs);
assert.equal(consequenceMissingRefsResult.ok, false);
assert.ok(consequenceMissingRefsResult.errors.some((e) => e.includes("consequence_trace_ref/target_receipt_ref/observer_ref")));

const passWithoutOverclaim = {
  ...base,
  overclaim_check: {
    ...base.overclaim_check,
    result_does_not_exceed_evidence_class: false
  }
};
const passWithoutOverclaimResult = validateTraceabilityRecord(passWithoutOverclaim);
assert.equal(passWithoutOverclaimResult.ok, false);
assert.ok(passWithoutOverclaimResult.errors.some((e) => e.includes("result_does_not_exceed_evidence_class")));

console.log("TRACEABILITY_V1_2_VALIDATOR_TEST=PASS");
