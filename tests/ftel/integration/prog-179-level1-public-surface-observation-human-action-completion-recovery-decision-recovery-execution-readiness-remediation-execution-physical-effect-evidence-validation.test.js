const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-179-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-physical-effect-evidence-validation.json", "utf8"));

assert.equal(a.program_number, 179);
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_PHYSICAL_EFFECT_EVIDENCE_VALIDATED_PENDING_PHYSICAL_EFFECT_PROOF");

assert.equal(a.readiness_remediation_execution_physical_effect_evidence.required, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.received, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.validated, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.proven, false);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.validation_required, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.validation_performed, true);
assert.equal(a.readiness_remediation_execution_physical_effect_evidence.does_not_prove_physical_effect, true);

assert.equal(a.readiness_remediation_execution.physical_effect_evidence_received, true);
assert.equal(a.readiness_remediation_execution.physical_effect_evidence_validated, true);
assert.equal(a.readiness_remediation_execution.physical_effect_proven, false);
assert.equal(a.readiness_remediation_execution.execution_status, "PHYSICAL_EFFECT_EVIDENCE_VALIDATED_PENDING_PHYSICAL_EFFECT_PROOF");

assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_evidence_required, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_evidence_received, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_evidence_validation_required, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_evidence_validated, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_proof_required, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_proven, false);
assert.equal(a.recovery_execution.readiness_gate_passed, false);
assert.equal(a.recovery_execution.pending, "READINESS_REMEDIATION_EXECUTION_PHYSICAL_EFFECT_PROOF");

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
assert.equal(a.constraints.no_remediation_execution_physical_effect_proof_claim, true);

assert.equal(a.previous_program, "PROG-178");
assert.equal(a.next_required_program, "PROG-180-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-PHYSICAL-EFFECT-PROOF");

console.log("PROG_179_TEST=PASS");
