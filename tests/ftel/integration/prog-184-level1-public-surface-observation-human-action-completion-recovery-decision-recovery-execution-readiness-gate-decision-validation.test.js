const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-184-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-decision-validation.json", "utf8"));

assert.equal(a.program_number, 184);
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_GATE_DECISION_VALIDATED_PENDING_GATE_PASS");

assert.equal(a.readiness_remediation_execution.readiness_gate_requested, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_request_validated, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_required, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_recorded, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_validated, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_passed, false);

assert.equal(a.readiness_gate_request.requested, true);
assert.equal(a.readiness_gate_request.validated, true);
assert.equal(a.readiness_gate_request.decision_recorded, true);
assert.equal(a.readiness_gate_request.decision_validated, true);
assert.equal(a.readiness_gate_request.passed, false);

assert.equal(a.readiness_gate_decision.required, true);
assert.equal(a.readiness_gate_decision.recorded, true);
assert.equal(a.readiness_gate_decision.validated, true);
assert.equal(a.readiness_gate_decision.candidate_outcome, "PASS_CANDIDATE_VALIDATED_PENDING_GATE_PASS");
assert.equal(a.readiness_gate_decision.final_outcome, null);
assert.equal(a.readiness_gate_decision.passed, false);
assert.equal(a.readiness_gate_decision.status, "VALIDATED_PENDING_GATE_PASS");
assert.equal(a.readiness_gate_decision.validation_required, true);
assert.equal(a.readiness_gate_decision.validation_performed, true);
assert.equal(a.readiness_gate_decision.does_not_create_gate_pass, true);

assert.equal(a.recovery_execution.readiness_gate_requested, true);
assert.equal(a.recovery_execution.readiness_gate_request_validated, true);
assert.equal(a.recovery_execution.readiness_gate_decision_required, true);
assert.equal(a.recovery_execution.readiness_gate_decision_recorded, true);
assert.equal(a.recovery_execution.readiness_gate_decision_validated, true);
assert.equal(a.recovery_execution.readiness_gate_passed, false);
assert.equal(a.recovery_execution.pending, "READINESS_GATE_PASS");

assert.equal(a.readiness.external_customer_ready, false);
assert.equal(a.readiness.banking_pack_ready, false);
assert.equal(a.readiness.level1_launch_ready, false);
assert.equal(a.readiness.production_ready, false);

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.constraints.no_readiness_gate_pass_claim, true);
assert.equal(a.constraints.no_production_readiness_claim, true);

assert.equal(a.previous_program, "PROG-183");
assert.equal(a.next_required_program, "PROG-185-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-PASS");

console.log("PROG_184_TEST=PASS");
