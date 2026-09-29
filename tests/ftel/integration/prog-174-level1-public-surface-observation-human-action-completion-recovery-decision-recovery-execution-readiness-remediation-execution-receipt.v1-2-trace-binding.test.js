const fs = require("fs");
const assert = require("assert/strict");

const trace = JSON.parse(fs.readFileSync("docs/launch/traceability/prog-174-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-receipt.v1-2-trace-binding.json", "utf8"));
const prog = JSON.parse(fs.readFileSync("docs/launch/level1/prog-174-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-receipt.json", "utf8"));

assert.equal(trace.directive_ref, "HBCE-RD-MASTER-2027-0003-V1.2-EXECUTION-TRACE-BINDING-PATCH");
assert.equal(trace.program_number, 174);
assert.equal(trace.program_id, prog.program_id);
assert.equal(trace.profile, "L1-CRITICAL");
assert.equal(trace.risk_id, "R-21-FALSE-GREEN-FROM-NON-EXECUTION-GATE");

assert.equal(trace.gate_semantics, "structural_validation");
assert.equal(trace.evidence_class, "STRUCTURALLY_VALIDATED");
assert.equal(trace.result, "PASS");

assert.equal(trace.execution_claimed, false);
assert.equal(trace.execution_trace_required, false);
assert.equal(trace.execution_trace_ref, null);

assert.equal(trace.consequence_claimed, false);
assert.equal(trace.consequence_trace_required, false);
assert.equal(trace.consequence_trace_ref, null);
assert.equal(trace.target_receipt_ref, null);
assert.equal(trace.observer_ref, null);

assert.equal(trace.overclaim_check.required, true);
assert.equal(trace.overclaim_check.performed, true);
assert.equal(trace.overclaim_check.result_does_not_exceed_evidence_class, true);
assert.equal(trace.overclaim_check.non_execution_gate_not_promoted_to_execution_evidence, true);
assert.equal(trace.overclaim_check.missing_execution_trace_ref_is_allowed_only_because_execution_claimed_is_false, true);
assert.equal(trace.overclaim_check.semantic_overclaim_rejected, true);

assert.equal(trace.claim_ceiling.not_execution_evidence, true);
assert.equal(trace.claim_ceiling.not_receipt_validation, true);
assert.equal(trace.claim_ceiling.not_external_effect_evidence, true);
assert.equal(trace.claim_ceiling.not_physical_effect_evidence, true);
assert.equal(trace.claim_ceiling.not_readiness_gate_pass, true);
assert.equal(trace.claim_ceiling.not_product_readiness, true);
assert.equal(trace.claim_ceiling.not_certification, true);
assert.equal(trace.claim_ceiling.not_legal_validity, true);
assert.equal(trace.claim_ceiling.not_procurement_eligibility, true);

assert.equal(prog.readiness_remediation_execution_receipt.received, true);
assert.equal(prog.readiness_remediation_execution_receipt.validated, false);
assert.equal(prog.readiness_remediation_execution.external_effect_proven, false);
assert.equal(prog.readiness_remediation_execution.physical_effect_proven, false);
assert.equal(prog.recovery_execution.readiness_gate_passed, false);
assert.equal(prog.readiness.production_ready, false);
assert.equal(prog.authority.ai_authority_allowed, false);

console.log("PROG_174_V1_2_TRACE_BINDING_TEST=PASS");
