const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-194-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-verification.json", "utf8"));

assert.equal(a.program_number, 194);
assert.equal(a.previous_program, "PROG-193");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_VERIFIED_PENDING_INDEPENDENT_REVIEW_COMPLETION");

assert.equal(a.readiness_remediation_execution.reviewer_identity_evidence_bound, true);
assert.equal(a.readiness_remediation_execution.reviewer_independence_evidence_bound, true);
assert.equal(a.readiness_remediation_execution.reviewer_identity_confirmed, true);
assert.equal(a.readiness_remediation_execution.reviewer_independence_verified, true);
assert.equal(a.readiness_remediation_execution.reviewer_evidence_verification_completed, true);
assert.equal(a.readiness_remediation_execution.external_validation_accepted, false);
assert.equal(a.readiness_remediation_execution.does_not_create_independent_review_completion, true);

assert.equal(a.reviewer_identity_independence_evidence.binding_recorded, true);
assert.equal(a.reviewer_identity_independence_evidence.evidence_verification_completed, true);
assert.equal(a.reviewer_identity_independence_evidence.reviewer_identity_confirmed, true);
assert.equal(a.reviewer_identity_independence_evidence.reviewer_independence_verified, true);
assert.equal(a.reviewer_identity_independence_evidence.independent_review_completed, false);
assert.equal(a.reviewer_identity_independence_evidence.external_validation_accepted, false);

assert.equal(a.independent_external_validation_review.reviewer_identity_confirmed, true);
assert.equal(a.independent_external_validation_review.reviewer_independence_verified, true);
assert.equal(a.independent_external_validation_review.reviewer_evidence_verification_completed, true);
assert.equal(a.independent_external_validation_review.review_completed, false);
assert.equal(a.independent_external_validation_review.external_validation_accepted, false);

assert.equal(a.recovery_execution.reviewer_identity_confirmed, true);
assert.equal(a.recovery_execution.reviewer_independence_verified, true);
assert.equal(a.recovery_execution.reviewer_evidence_verification_completed, true);
assert.equal(a.recovery_execution.independent_review_completed, false);
assert.equal(a.recovery_execution.pending, "INDEPENDENT_REVIEW_COMPLETION");

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.external_validation_claimed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.next_required_program, "PROG-195-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-INDEPENDENT-REVIEW-COMPLETION");

console.log("PROG_194_TEST=PASS");
