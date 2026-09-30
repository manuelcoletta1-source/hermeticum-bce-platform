const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-188-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-external-customer-readiness-record.json", "utf8"));

assert.equal(a.program_number, 188);
assert.equal(a.previous_program, "PROG-187");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_EXTERNAL_CUSTOMER_READINESS_RECORDED_PENDING_BANKING_PACK_READINESS");

assert.equal(a.readiness_remediation_execution.production_readiness_recorded, true);
assert.equal(a.readiness_remediation_execution.launch_readiness_recorded, true);
assert.equal(a.readiness_remediation_execution.external_customer_readiness_required, true);
assert.equal(a.readiness_remediation_execution.external_customer_readiness_recorded, true);
assert.equal(a.readiness_remediation_execution.banking_pack_readiness_required, true);
assert.equal(a.readiness_remediation_execution.banking_pack_readiness_recorded, false);
assert.equal(a.readiness_remediation_execution.does_not_create_banking_pack_readiness, true);

assert.equal(a.recovery_execution.launch_readiness_recorded, true);
assert.equal(a.recovery_execution.external_customer_readiness_recorded, true);
assert.equal(a.recovery_execution.banking_pack_readiness_recorded, false);
assert.equal(a.recovery_execution.pending, "BANKING_PACK_READINESS_RECORD");

assert.equal(a.readiness.production_ready, true);
assert.equal(a.readiness.level1_launch_ready, true);
assert.equal(a.readiness.external_customer_ready, true);
assert.equal(a.readiness.banking_pack_ready, false);

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.constraints.no_banking_pack_claim, true);
assert.equal(a.constraints.no_certification_claim, true);
assert.equal(a.next_required_program, "PROG-189-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-BANKING-PACK-READINESS-RECORD");

console.log("PROG_188_TEST=PASS");
