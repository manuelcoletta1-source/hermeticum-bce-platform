const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-186-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-production-readiness-record.json", "utf8"));

assert.equal(a.program_number, 186);
assert.equal(a.previous_program, "PROG-185");
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_PRODUCTION_READINESS_RECORDED_PENDING_LAUNCH_READINESS");

assert.equal(a.readiness_remediation_execution.readiness_gate_passed, true);
assert.equal(a.readiness_remediation_execution.production_readiness_required, true);
assert.equal(a.readiness_remediation_execution.production_readiness_recorded, true);
assert.equal(a.readiness_remediation_execution.launch_readiness_recorded, false);
assert.equal(a.readiness_remediation_execution.does_not_create_launch_readiness, true);

assert.equal(a.recovery_execution.readiness_gate_passed, true);
assert.equal(a.recovery_execution.production_readiness_recorded, true);
assert.equal(a.recovery_execution.launch_readiness_recorded, false);
assert.equal(a.recovery_execution.pending, "LAUNCH_READINESS_RECORD");

assert.equal(a.readiness.production_ready, true);
assert.equal(a.readiness.level1_launch_ready, false);
assert.equal(a.readiness.external_customer_ready, false);
assert.equal(a.readiness.banking_pack_ready, false);

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.constraints.no_launch_claim, true);
assert.equal(a.constraints.no_certification_claim, true);
assert.equal(a.next_required_program, "PROG-187-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-LAUNCH-READINESS-RECORD");

console.log("PROG_186_TEST=PASS");
