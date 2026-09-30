const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-193-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-reviewer-identity-independence-evidence-binding.json", "utf8"));

assert.equal(a.program_number, 193);
assert.equal(a.previous_program, "PROG-192");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_BOUND_PENDING_EVIDENCE_VERIFICATION");

assert.equal(a.readiness_remediation_execution.reviewer_identity_evidence_bound, true);
assert.equal(a.readiness_remediation_execution.reviewer_independence_evidence_bound, true);
assert.equal(a.readiness_remediation_execution.reviewer_identity_confirmed, false);
assert.equal(a.readiness_remediation_execution.reviewer_independence_verified, false);
assert.equal(a.readiness_remediation_execution.reviewer_evidence_verification_completed, false);
assert.equal(a.readiness_remediation_execution.external_validation_accepted, false);

assert.equal(a.reviewer_identity_independence_evidence.binding_recorded, true);
assert.equal(a.reviewer_identity_independence_evidence.reviewer_identity_evidence_bound, true);
assert.equal(a.reviewer_identity_independence_evidence.reviewer_independence_evidence_bound, true);
assert.equal(a.reviewer_identity_independence_evidence.reviewer_identity_confirmed, false);
assert.equal(a.reviewer_identity_independence_evidence.reviewer_independence_verified, false);
assert.equal(a.reviewer_identity_independence_evidence.evidence_verification_completed, false);
assert.equal(a.reviewer_identity_independence_evidence.external_validation_accepted, false);

assert.equal(a.independent_external_validation_review.reviewer_identity_evidence_bound, true);
assert.equal(a.independent_external_validation_review.reviewer_independence_evidence_bound, true);
assert.equal(a.independent_external_validation_review.reviewer_identity_confirmed, false);
assert.equal(a.independent_external_validation_review.reviewer_independence_verified, false);
assert.equal(a.independent_external_validation_review.reviewer_evidence_verification_completed, false);
assert.equal(a.independent_external_validation_review.external_validation_accepted, false);

assert.equal(a.recovery_execution.reviewer_identity_evidence_bound, true);
assert.equal(a.recovery_execution.reviewer_independence_evidence_bound, true);
assert.equal(a.recovery_execution.reviewer_identity_confirmed, false);
assert.equal(a.recovery_execution.reviewer_independence_verified, false);
assert.equal(a.recovery_execution.pending, "REVIEWER_IDENTITY_INDEPENDENCE_EVIDENCE_VERIFICATION");

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.external_validation_claimed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.next_required_program, "PROG-194-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-REVIEWER-IDENTITY-INDEPENDENCE-EVIDENCE-VERIFICATION");

console.log("PROG_193_TEST=PASS");
