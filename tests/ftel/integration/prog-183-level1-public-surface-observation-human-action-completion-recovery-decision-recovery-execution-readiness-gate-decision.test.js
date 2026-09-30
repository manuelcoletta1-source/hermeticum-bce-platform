const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-183-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision.json", "utf8"));

assert.equal(a.program_number, 183);
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_GATE_DECISION_RECORDED_PENDING_VALIDATION");

assert.equal(a.readiness_remediation_execution.readiness_gate_requested, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_request_validated, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_required, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_recorded, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_validated, false);
assert.equal(a.readiness_remediation_execution.readiness_gate_passed, false);

assert.equal(a.readiness_gate_request.requested, true);
assert.equal(a.readiness_gate_request.validated, true);
assert.equal(a.readiness_gate_request.decision_required, true);
assert.equal(a.readiness_gate_request.decision_recorded, true);
assert.equal(a.readiness_gate_request.decision_validated, false);
assert.equal(a.readiness_gate_request.passed, false);
assert.equal(a.readiness_gate_request.does_not_unlock_readiness, true);

assert.equal(a.readiness_gate_decision.required, true);
assert.equal(a.readiness_gate_decision.recorded, true);
assert.equal(a.readiness_gate_decision.validated, false);
assert.equal(a.readiness_gate_decision.candidate_outcome, "PASS_CANDIDATE_PENDING_VALIDATION");
assert.equal(a.readiness_gate_decision.final_outcome, null);
assert.equal(a.readiness_gate_decision.passed, false);
assert.equal(a.readiness_gate_decision.status, "RECORDED_PENDING_VALIDATION");
assert.equal(a.readiness_gate_decision.validation_required, true);
assert.equal(a.readiness_gate_decision.validation_performed, false);
assert.equal(a.readiness_gate_decision.does_not_unlock_readiness, true);

assert.equal(a.recovery_execution.readiness_gate_requested, true);
assert.equal(a.recovery_execution.readiness_gate_request_validated, true);
assert.equal(a.recovery_execution.readiness_gate_decision_required, true);
assert.equal(a.recovery_execution.readiness_gate_decision_recorded, true);
assert.equal(a.recovery_execution.readiness_gate_decision_validated, false);
assert.equal(a.recovery_execution.readiness_gate_passed, false);
assert.equal(a.recovery_execution.pending, "READINESS_GATE_DECISION_VALIDATION");

assert.equal(a.readiness.external_customer_ready, false);
assert.equal(a.readiness.banking_pack_ready, false);
assert.equal(a.readiness.level1_launch_ready, false);
assert.equal(a.readiness.production_ready, false);

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.constraints.no_readiness_unlock, true);
assert.equal(a.constraints.no_readiness_gate_decision_validation_claim, true);
assert.equal(a.constraints.no_readiness_gate_pass_claim, true);
assert.equal(a.constraints.no_production_readiness_claim, true);

assert.equal(a.previous_program, "PROG-182");
assert.equal(a.next_required_program, "PROG-184-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-DECISION-VALIDATION");

console.log("PROG_183_TEST=PASS");
