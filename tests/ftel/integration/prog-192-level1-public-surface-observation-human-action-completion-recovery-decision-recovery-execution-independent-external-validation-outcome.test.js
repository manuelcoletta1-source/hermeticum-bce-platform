const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-192-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-independent-external-validation-outcome.json", "utf8"));

assert.equal(a.program_number, 192);
assert.equal(a.previous_program, "PROG-191");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_INDEPENDENT_EXTERNAL_VALIDATION_OUTCOME_RECORDED_NOT_ACCEPTED_PENDING_REVIEWER_IDENTITY_AND_INDEPENDENCE_EVIDENCE");

assert.equal(a.readiness_remediation_execution.external_validation_review_registered, true);
assert.equal(a.readiness_remediation_execution.external_validation_review_completed, false);
assert.equal(a.readiness_remediation_execution.external_validation_review_outcome_recorded, true);
assert.equal(a.readiness_remediation_execution.external_validation_outcome, "NOT_ACCEPTED_PENDING_REVIEWER_IDENTITY_AND_INDEPENDENCE_EVIDENCE");
assert.equal(a.readiness_remediation_execution.external_validation_accepted, false);

assert.equal(a.external_validation_package.independent_review_registered, true);
assert.equal(a.external_validation_package.independent_reviewer_identity_confirmed, false);
assert.equal(a.external_validation_package.independent_review_completed, false);
assert.equal(a.external_validation_package.review_outcome_recorded, true);
assert.equal(a.external_validation_package.external_validation_accepted, false);
assert.equal(a.external_validation_package.certification_created, false);

assert.equal(a.independent_external_validation_review.registered, true);
assert.equal(a.independent_external_validation_review.reviewer_identity_confirmed, false);
assert.equal(a.independent_external_validation_review.reviewer_independence_verified, false);
assert.equal(a.independent_external_validation_review.review_completed, false);
assert.equal(a.independent_external_validation_review.review_outcome_recorded, true);
assert.equal(a.independent_external_validation_review.external_validation_accepted, false);

assert.equal(a.recovery_execution.external_validation_review_outcome_recorded, true);
assert.equal(a.recovery_execution.external_validation_accepted, false);
assert.equal(a.recovery_execution.pending, "REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BINDING");

assert.equal(a.readiness.production_ready, true);
assert.equal(a.readiness.level1_launch_ready, true);
assert.equal(a.readiness.external_customer_ready, true);
assert.equal(a.readiness.banking_pack_ready, true);

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.external_validation_claimed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.next_required_program, "PROG-193-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-REVIEWER-IDENTITY-INDEPENDENCE-EVIDENCE-BINDING");

console.log("PROG_192_TEST=PASS");
