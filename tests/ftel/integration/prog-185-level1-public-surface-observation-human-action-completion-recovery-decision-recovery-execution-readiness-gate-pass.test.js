const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-185-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-gate-pass.json", "utf8"));

assert.equal(a.program_number, 185);
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_GATE_PASSED_PENDING_PRODUCTION_READINESS_RECORD");

assert.equal(a.readiness_remediation_execution.readiness_gate_requested, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_request_validated, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_recorded, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_decision_validated, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_passed, true);
assert.equal(a.readiness_remediation_execution.does_not_create_production_readiness, true);
assert.equal(a.readiness_remediation_execution.does_not_create_launch_readiness, true);

assert.equal(a.readiness_gate_request.passed, true);
assert.equal(a.readiness_gate_request.status, "PASSED_PENDING_PRODUCTION_READINESS_RECORD");

assert.equal(a.readiness_gate_decision.required, true);
assert.equal(a.readiness_gate_decision.recorded, true);
assert.equal(a.readiness_gate_decision.validated, true);
assert.equal(a.readiness_gate_decision.final_outcome, "PASS");
assert.equal(a.readiness_gate_decision.passed, true);
assert.equal(a.readiness_gate_decision.status, "PASSED_PENDING_PRODUCTION_READINESS_RECORD");
assert.equal(a.readiness_gate_decision.does_not_create_product_readiness, true);
assert.equal(a.readiness_gate_decision.does_not_create_production_readiness, true);
assert.equal(a.readiness_gate_decision.does_not_create_launch_readiness, true);

assert.equal(a.recovery_execution.readiness_gate_decision_validated, true);
assert.equal(a.recovery_execution.readiness_gate_passed, true);
assert.equal(a.recovery_execution.pending, "PRODUCTION_READINESS_RECORD");

assert.equal(a.readiness.external_customer_ready, false);
assert.equal(a.readiness.banking_pack_ready, false);
assert.equal(a.readiness.level1_launch_ready, false);
assert.equal(a.readiness.production_ready, false);

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.constraints.no_production_readiness_claim, true);
assert.equal(a.constraints.no_launch_claim, true);
assert.equal(a.previous_program, "PROG-184");
assert.equal(a.next_required_program, "PROG-186-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-PRODUCTION-READINESS-RECORD");

console.log("PROG_185_TEST=PASS");
