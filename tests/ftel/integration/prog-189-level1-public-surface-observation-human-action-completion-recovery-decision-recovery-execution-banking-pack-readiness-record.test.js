const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-189-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-banking-pack-readiness-record.json", "utf8"));

assert.equal(a.program_number, 189);
assert.equal(a.previous_program, "PROG-188");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_BANKING_PACK_READINESS_RECORDED_PENDING_EXTERNAL_VALIDATION_PACKAGE");

assert.equal(a.readiness_remediation_execution.external_customer_readiness_recorded, true);
assert.equal(a.readiness_remediation_execution.banking_pack_readiness_required, true);
assert.equal(a.readiness_remediation_execution.banking_pack_readiness_recorded, true);
assert.equal(a.readiness_remediation_execution.external_validation_package_required, true);
assert.equal(a.readiness_remediation_execution.external_validation_package_requested, false);

assert.equal(a.recovery_execution.banking_pack_readiness_recorded, true);
assert.equal(a.recovery_execution.external_validation_package_requested, false);
assert.equal(a.recovery_execution.pending, "EXTERNAL_VALIDATION_PACKAGE_REQUEST");

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

assert.equal(a.next_required_program, "PROG-190-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-EXTERNAL-VALIDATION-PACKAGE-REQUEST");

console.log("PROG_189_TEST=PASS");
