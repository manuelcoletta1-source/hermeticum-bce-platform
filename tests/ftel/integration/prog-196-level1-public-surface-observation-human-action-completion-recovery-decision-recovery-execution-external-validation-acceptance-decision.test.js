const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-196-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-external-validation-acceptance-decision.json", "utf8"));

assert.equal(a.program_number, 196);
assert.equal(a.previous_program, "PROG-195");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_EXTERNAL_VALIDATION_ACCEPTANCE_DECISION_RECORDED_ACCEPTED_PENDING_EXTERNAL_VALIDATION_CLAIM_RECORD");

assert.equal(a.readiness_remediation_execution.external_validation_acceptance_decision_recorded, true);
assert.equal(a.readiness_remediation_execution.external_validation_accepted, true);
assert.equal(a.readiness_remediation_execution.external_validation_claim_record_required, true);
assert.equal(a.readiness_remediation_execution.external_validation_claim_recorded, false);
assert.equal(a.readiness_remediation_execution.does_not_create_external_validation_claim, true);

assert.equal(a.external_validation_acceptance_decision.required, true);
assert.equal(a.external_validation_acceptance_decision.recorded, true);
assert.equal(a.external_validation_acceptance_decision.accepted, true);
assert.equal(a.external_validation_acceptance_decision.rejected, false);
assert.equal(a.external_validation_acceptance_decision.external_validation_claim_recorded, false);
assert.equal(a.external_validation_acceptance_decision.certification_created, false);
assert.equal(a.external_validation_acceptance_decision.legal_validity_created, false);
assert.equal(a.external_validation_acceptance_decision.procurement_eligibility_created, false);

assert.equal(a.external_validation_package.external_validation_acceptance_decision_recorded, true);
assert.equal(a.external_validation_package.external_validation_accepted, true);
assert.equal(a.external_validation_package.external_validation_claim_recorded, false);
assert.equal(a.external_validation_package.certification_created, false);
assert.equal(a.external_validation_package.legal_validity_created, false);
assert.equal(a.external_validation_package.procurement_eligibility_created, false);

assert.equal(a.recovery_execution.external_validation_acceptance_decision_recorded, true);
assert.equal(a.recovery_execution.external_validation_accepted, true);
assert.equal(a.recovery_execution.external_validation_claim_recorded, false);
assert.equal(a.recovery_execution.pending, "EXTERNAL_VALIDATION_CLAIM_RECORD");

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.external_validation_claimed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.next_required_program, "PROG-197-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-EXTERNAL-VALIDATION-CLAIM-RECORD");

console.log("PROG_196_TEST=PASS");
