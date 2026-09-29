const fs = require("fs");
const assert = require("assert/strict");

const a = JSON.parse(fs.readFileSync("docs/launch/level1/prog-176-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-external-effect-evidence.json", "utf8"));

assert.equal(a.program_number, 176);
assert.equal(a.status, "LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_RECEIVED_PENDING_VALIDATION");

assert.equal(a.level3_axis.principle, "remediation_execution_external_effect_evidence_received_is_not_validation_physical_effect_or_readiness");
assert.equal(a.level3_axis.remediation_execution_receipt_validated, true);
assert.equal(a.level3_axis.remediation_execution_external_effect_evidence_received, true);
assert.equal(a.level3_axis.remediation_execution_external_effect_evidence_validated, false);
assert.equal(a.level3_axis.remediation_execution_external_effect_proven, false);
assert.equal(a.level3_axis.remediation_execution_physical_effect_evidence_received, false);
assert.equal(a.level3_axis.remediation_execution_physical_effect_evidence_validated, false);
assert.equal(a.level3_axis.remediation_execution_physical_effect_proven, false);
assert.equal(a.level3_axis.readiness_gate_passed, false);
assert.equal(a.level3_axis.launch_readiness_unlocked, false);
assert.equal(a.level3_axis.legal_or_certification_effect, false);

assert.equal(a.readiness_remediation_execution_external_effect_evidence.required, true);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.received, true);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.validated, false);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.proven, false);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.validation_required, true);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.validation_performed, false);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.does_not_prove_external_effect, true);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.does_not_prove_physical_effect, true);
assert.equal(a.readiness_remediation_execution_external_effect_evidence.does_not_unlock_readiness, true);

assert.equal(a.readiness_remediation_execution_external_effect_evidence_validation.required, true);
assert.equal(a.readiness_remediation_execution_external_effect_evidence_validation.performed, false);
assert.equal(a.readiness_remediation_execution_external_effect_evidence_validation.validated, false);

assert.equal(a.readiness_remediation_execution.external_effect_evidence_received, true);
assert.equal(a.readiness_remediation_execution.external_effect_evidence_validated, false);
assert.equal(a.readiness_remediation_execution.external_effect_proven, false);
assert.equal(a.readiness_remediation_execution.physical_effect_evidence_received, false);
assert.equal(a.readiness_remediation_execution.physical_effect_evidence_validated, false);
assert.equal(a.readiness_remediation_execution.physical_effect_proven, false);
assert.equal(a.readiness_remediation_execution.execution_status, "EXTERNAL_EFFECT_EVIDENCE_RECEIVED_PENDING_VALIDATION");

assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_evidence_received, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_evidence_validation_required, true);
assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_evidence_validated, false);
assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_proven, false);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_evidence_received, false);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_evidence_validated, false);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_proven, false);
assert.equal(a.recovery_execution.readiness_gate_passed, false);
assert.equal(a.recovery_execution.pending, "READINESS_REMEDIATION_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_VALIDATION");

assert.equal(a.readiness.external_customer_ready, false);
assert.equal(a.readiness.banking_pack_ready, false);
assert.equal(a.readiness.level1_launch_ready, false);
assert.equal(a.readiness.production_ready, false);

assert.equal(a.authority.ai_authority_allowed, false);
assert.equal(a.authority.legal_validity_claimed, false);
assert.equal(a.authority.accreditation_claimed, false);
assert.equal(a.authority.procurement_eligibility_claimed, false);

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
assert.equal(a.constraints.no_remediation_execution_external_effect_validation_claim, true);
assert.equal(a.constraints.no_remediation_execution_external_effect_proof_claim, true);
assert.equal(a.constraints.no_remediation_execution_physical_effect_claim, true);

assert.equal(a.previous_program, "PROG-175");
assert.equal(a.next_required_program, "PROG-177-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-EXTERNAL-EFFECT-EVIDENCE-VALIDATION");

console.log("PROG_176_TEST=PASS");
