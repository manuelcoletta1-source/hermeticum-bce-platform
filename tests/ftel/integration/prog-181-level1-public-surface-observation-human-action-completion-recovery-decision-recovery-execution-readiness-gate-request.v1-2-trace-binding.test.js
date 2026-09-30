const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");

const root = process.cwd();
const { validateTraceabilityRecordFile } = require(path.join(root, "runtime/traceability/validate-v1-2-traceability-record.js"));

const tracePath = path.join(root, "docs/launch/traceability/prog-181-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-request.v1-2-trace-binding.json");
const trace = JSON.parse(fs.readFileSync(tracePath, "utf8"));
const result = validateTraceabilityRecordFile(tracePath);

assert.equal(result.ok, true);
assert.deepEqual(result.reason_codes, ["TRACEABILITY_RECORD_VALID"]);

assert.equal(trace.program_number, 181);
assert.equal(trace.gate_semantics, "structural_validation");
assert.equal(trace.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(trace.result, "PASS");
assert.equal(trace.execution_claimed, false);
assert.equal(trace.execution_trace_required, false);
assert.equal(trace.execution_trace_ref, null);

assert.equal(trace.claim_ceiling.maximum_claim, "STRUCTURALLY_VALIDATED_READINESS_GATE_REQUESTED_STATE");
assert.equal(trace.claim_ceiling.not_execution_evidence, true);
assert.equal(trace.claim_ceiling.not_external_effect_evidence, false);
assert.equal(trace.claim_ceiling.not_physical_effect_evidence, false);
assert.equal(trace.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(trace.claim_ceiling.not_product_readiness, true);
assert.equal(trace.claim_ceiling.not_certification, true);
assert.equal(trace.claim_ceiling.not_legal_validity, true);
assert.equal(trace.claim_ceiling.not_procurement_eligibility, true);

console.log("PROG_181_V1_2_TRACE_BINDING_TEST=PASS");
