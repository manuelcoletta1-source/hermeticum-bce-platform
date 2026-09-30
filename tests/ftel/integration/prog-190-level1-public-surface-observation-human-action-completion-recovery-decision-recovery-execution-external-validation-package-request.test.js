const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-190-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-external-validation-package-request.json", "utf8"));

assert.equal(a.program_number, 190);
assert.equal(a.previous_program, "PROG-189");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_EXTERNAL_VALIDATION_PACKAGE_REQUESTED_PENDING_INDEPENDENT_REVIEW");

assert.equal(a.readiness_remediation_execution.banking_pack_readiness_recorded, true);
assert.equal(a.readiness_remediation_execution.external_validation_package_required, true);
assert.equal(a.readiness_remediation_execution.external_validation_package_requested, true);
assert.equal(a.readiness_remediation_execution.external_validation_review_required, true);
assert.equal(a.readiness_remediation_execution.external_validation_review_completed, false);
assert.equal(a.readiness_remediation_execution.external_validation_accepted, false);

assert.equal(a.external_validation_package.required, true);
assert.equal(a.external_validation_package.requested, true);
assert.equal(a.external_validation_package.request_recorded, true);
assert.equal(a.external_validation_package.independent_review_required, true);
assert.equal(a.external_validation_package.independent_review_completed, false);
assert.equal(a.external_validation_package.external_validation_accepted, false);
assert.equal(a.external_validation_package.certification_created, false);

assert.equal(a.recovery_execution.external_validation_package_requested, true);
assert.equal(a.recovery_execution.external_validation_review_completed, false);
assert.equal(a.recovery_execution.pending, "INDEPENDENT_EXTERNAL_VALIDATION_REVIEW");

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

assert.equal(a.next_required_program, "PROG-191-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-INDEPENDENT-EXTERNAL-VALIDATION-REVIEW");

console.log("PROG_190_TEST=PASS");
