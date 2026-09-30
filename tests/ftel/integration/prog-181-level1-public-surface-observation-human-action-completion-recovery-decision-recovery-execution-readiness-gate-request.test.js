const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-181-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-request.json", "utf8"));

assert.equal(a.program_number, 181);
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_GATE_REQUESTED_PENDING_VALIDATION");

assert.equal(a.readiness_remediation_execution.physical_effect_proven, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_required, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_requested, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_request_validated, false);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_recorded, false);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_validated, false);
assert.equal(a.readiness_remediation_execution.readiness_gate_passed, false);

assert.equal(a.readiness_gate_request.required, true);
assert.equal(a.readiness_gate_request.requested, true);
assert.equal(a.readiness_gate_request.received, true);
assert.equal(a.readiness_gate_request.validated, false);
assert.equal(a.readiness_gate_request.validation_required, true);
assert.equal(a.readiness_gate_request.validation_performed, false);
assert.equal(a.readiness_gate_request.decision_required, true);
assert.equal(a.readiness_gate_request.decision_recorded, false);
assert.equal(a.readiness_gate_request.decision_validated, false);
assert.equal(a.readiness_gate_request.passed, false);
assert.equal(a.readiness_gate_request.does_not_unlock_readiness, true);

assert.equal(a.recovery_execution.readiness_gate_required, true);
assert.equal(a.recovery_execution.readiness_gate_requested, true);
assert.equal(a.recovery_execution.readiness_gate_request_received, true);
assert.equal(a.recovery_execution.readiness_gate_request_validation_required, true);
assert.equal(a.recovery_execution.readiness_gate_request_validated, false);
assert.equal(a.recovery_execution.readiness_gate_decision_required, true);
assert.equal(a.recovery_execution.readiness_gate_decision_recorded, false);
assert.equal(a.recovery_execution.readiness_gate_decision_validated, false);
assert.equal(a.recovery_execution.readiness_gate_passed, false);
assert.equal(a.recovery_execution.pending, "READINESS_GATE_REQUEST_VALIDATION");

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
assert.equal(a.constraints.no_readiness_gate_validation_claim, true);
assert.equal(a.constraints.no_readiness_gate_decision_claim, true);
assert.equal(a.constraints.no_readiness_gate_pass_claim, true);
assert.equal(a.constraints.no_production_readiness_claim, true);

assert.equal(a.previous_program, "PROG-180");
assert.equal(a.next_required_program, "PROG-182-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-REQUEST-VALIDATION");

console.log("PROG_181_TEST=PASS");
