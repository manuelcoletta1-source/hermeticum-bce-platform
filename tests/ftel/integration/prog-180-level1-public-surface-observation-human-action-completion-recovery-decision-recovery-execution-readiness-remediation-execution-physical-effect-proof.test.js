const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-180-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-physical-effect-proof.json", "utf8"));

assert.equal(a.program_number, 180);
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_PHYSICAL_EFFECT_PROVEN_PENDING_READINESS_GATE_REQUEST");

assert.equal(a.readiness_remediation_execution_physical_effect_evidence.required, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.received, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.validated, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.proven, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.proof_required, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.proof_performed, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.does_not_unlock_readiness, true);

assert.equal(a.readiness_remediation_execution.physical_effect_evidence_received, true);
assert.equal(a.readiness_remediation_execution.physical_effect_evidence_validated, true);
assert.equal(a.readiness_remediation_execution.physical_effect_proven, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_required, true);
assert.equal(a.readiness_remediation_execution.readiness_gate_requested, false);
assert.equal(a.readiness_remediation_execution.readiness_gate_passed, false);

assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_evidence_received, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_evidence_validated, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_proven, true);
assert.equal(a.recovery_execution.readiness_gate_required, true);
assert.equal(a.recovery_execution.readiness_gate_requested, false);
assert.equal(a.recovery_execution.readiness_gate_passed, false);
assert.equal(a.recovery_execution.pending, "READINESS_GATE_REQUEST");

assert.equal(a.readiness.external_customer_ready, false);
assert.equal(a.readiness.banking_pack_ready, false);
assert.equal(a.readiness.level1_launch_ready, false);
assert.equal(a.readiness.production_ready, false);

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);
assert.equal(a.authority.certification_claimed, false);

assert.equal(a.constraints.no_readiness_unlock, true);
assert.equal(a.constraints.no_ai_authority, true);
assert.equal(a.constraints.no_legal_validity, true);
assert.equal(a.constraints.no_accreditation, true);
assert.equal(a.constraints.no_procurement_eligibility, true);
assert.equal(a.constraints.no_certification_claim, true);
assert.equal(a.constraints.no_product_claim, true);
assert.equal(a.constraints.no_launch_claim, true);
assert.equal(a.constraints.no_readiness_gate_pass_claim, true);
assert.equal(a.constraints.no_production_readiness_claim, true);

assert.equal(a.previous_program, "PROG-179");
assert.equal(a.next_required_program, "PROG-181-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-GATE-REQUEST");

console.log("PROG_180_TEST=PASS");
