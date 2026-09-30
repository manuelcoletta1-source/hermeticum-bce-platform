const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-195-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-independent-review-completion.json", "utf8"));

assert.equal(a.program_number, 195);
assert.equal(a.previous_program, "PROG-194");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_INDEPENDENT_REVIEW_COMPLETED_PENDING_EXTERNAL_VALIDATION_ACCEPTANCE_DECISION");

assert.equal(a.readiness_remediation_execution.independent_review_completed, true);
assert.equal(a.readiness_remediation_execution.independent_review_completion_recorded, true);
assert.equal(a.readiness_remediation_execution.external_validation_acceptance_decision_required, true);
assert.equal(a.readiness_remediation_execution.external_validation_acceptance_decision_recorded, false);
assert.equal(a.readiness_remediation_execution.external_validation_accepted, false);
assert.equal(a.readiness_remediation_execution.does_not_create_external_validation_acceptance, true);

assert.equal(a.independent_review_completion.required, true);
assert.equal(a.independent_review_completion.completed, true);
assert.equal(a.independent_review_completion.completion_recorded, true);
assert.equal(a.independent_review_completion.external_validation_acceptance_decision_required, true);
assert.equal(a.independent_review_completion.external_validation_acceptance_decision_recorded, false);
assert.equal(a.independent_review_completion.external_validation_accepted, false);

assert.equal(a.independent_external_validation_review.review_completed, true);
assert.equal(a.independent_external_validation_review.review_completion_recorded, true);
assert.equal(a.independent_external_validation_review.external_validation_acceptance_decision_recorded, false);
assert.equal(a.independent_external_validation_review.external_validation_accepted, false);

assert.equal(a.recovery_execution.independent_review_completed, true);
assert.equal(a.recovery_execution.independent_review_completion_recorded, true);
assert.equal(a.recovery_execution.external_validation_acceptance_decision_recorded, false);
assert.equal(a.recovery_execution.external_validation_accepted, false);
assert.equal(a.recovery_execution.pending, "EXTERNAL_VALIDATION_ACCEPTANCE_DECISION");

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.external_validation_claimed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.next_required_program, "PROG-196-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-EXTERNAL-VALIDATION-ACCEPTANCE-DECISION");

console.log("PROG_195_TEST=PASS");
