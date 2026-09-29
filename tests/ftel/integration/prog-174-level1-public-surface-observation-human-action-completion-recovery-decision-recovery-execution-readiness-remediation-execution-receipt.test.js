const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-174-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-receipt.json","utf8"));

assert.equal(a.program_number,174);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_RECEIPT_RECEIVED_PENDING_REMEDIATION_EXECUTION_RECEIPT_VALIDATION");

assert.equal(a.level3_axis.principle,"remediation_execution_receipt_received_is_not_receipt_validation_external_effect_physical_effect_or_readiness");
assert.equal(a.level3_axis.readiness_gate_passed,false);
assert.equal(a.level3_axis.remediation_execution_commit_performed,true);
assert.equal(a.level3_axis.remediation_execution_receipt_required,true);
assert.equal(a.level3_axis.remediation_execution_receipt_received,true);
assert.equal(a.level3_axis.remediation_execution_receipt_validated,false);
assert.equal(a.level3_axis.remediation_execution_external_effect_proven,false);
assert.equal(a.level3_axis.remediation_execution_physical_effect_proven,false);
assert.equal(a.level3_axis.readiness_remediation_execution_authorized,true);
assert.equal(a.level3_axis.readiness_remediation_execution_performed,true);
assert.equal(a.level3_axis.launch_readiness_unlocked,false);
assert.equal(a.level3_axis.readiness_unlock_allowed,false);
assert.equal(a.level3_axis.legal_or_certification_effect,false);

assert.equal(a.readiness_remediation_execution_commit.committed,true);
assert.equal(a.readiness_remediation_execution_commit.receipt_received,true);
assert.equal(a.readiness_remediation_execution_commit.receipt_validated,false);
assert.equal(a.readiness_remediation_execution_commit.external_effect_proven,false);
assert.equal(a.readiness_remediation_execution_commit.physical_effect_proven,false);

assert.equal(a.readiness_remediation_execution_receipt.required,true);
assert.equal(a.readiness_remediation_execution_receipt.received,true);
assert.equal(a.readiness_remediation_execution_receipt.validated,false);
assert.equal(a.readiness_remediation_execution_receipt.receipt_status,"RECEIVED_PENDING_REMEDIATION_EXECUTION_RECEIPT_VALIDATION");
assert.equal(a.readiness_remediation_execution_receipt.validation_required,true);
assert.equal(a.readiness_remediation_execution_receipt.validation_performed,false);

assert.equal(a.readiness_remediation_execution_receipt_validation.required,true);
assert.equal(a.readiness_remediation_execution_receipt_validation.performed,false);
assert.equal(a.readiness_remediation_execution_receipt_validation.validated,false);

assert.equal(a.readiness_remediation_execution.commit_performed,true);
assert.equal(a.readiness_remediation_execution.authorized,true);
assert.equal(a.readiness_remediation_execution.performed,true);
assert.equal(a.readiness_remediation_execution.receipt_received,true);
assert.equal(a.readiness_remediation_execution.receipt_validated,false);
assert.equal(a.readiness_remediation_execution.receipt_validation_required,true);
assert.equal(a.readiness_remediation_execution.receipt_validation_performed,false);
assert.equal(a.readiness_remediation_execution.external_effect_proven,false);
assert.equal(a.readiness_remediation_execution.physical_effect_proven,false);
assert.equal(a.readiness_remediation_execution.execution_status,"RECEIPT_RECEIVED_PENDING_REMEDIATION_EXECUTION_RECEIPT_VALIDATION");

assert.equal(a.recovery_execution.readiness_remediation_execution_commit_performed,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_authorized,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_performed,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_receipt_received,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_receipt_validation_required,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_receipt_validated,false);
assert.equal(a.recovery_execution.readiness_remediation_execution_external_effect_proven,false);
assert.equal(a.recovery_execution.readiness_remediation_execution_physical_effect_proven,false);
assert.equal(a.recovery_execution.readiness_gate_passed,false);
assert.equal(a.recovery_execution.pending,"READINESS_REMEDIATION_EXECUTION_RECEIPT_VALIDATION");

assert.equal(a.readiness.external_customer_ready,false);
assert.equal(a.readiness.banking_pack_ready,false);
assert.equal(a.readiness.level1_launch_ready,false);
assert.equal(a.readiness.production_ready,false);

assert.equal(a.authority.ai_authority_allowed,false);
assert.equal(a.authority.legal_validity_claimed,false);
assert.equal(a.authority.accreditation_claimed,false);
assert.equal(a.authority.procurement_eligibility_claimed,false);

assert.equal(a.constraints.no_readiness_unlock,true);
assert.equal(a.constraints.no_ai_authority,true);
assert.equal(a.constraints.no_legal_validity,true);
assert.equal(a.constraints.no_accreditation,true);
assert.equal(a.constraints.no_procurement_eligibility,true);
assert.equal(a.constraints.no_certification_claim,true);
assert.equal(a.constraints.no_product_claim,true);
assert.equal(a.constraints.no_launch_claim,true);
assert.equal(a.constraints.no_readiness_gate_pass_claim,true);
assert.equal(a.constraints.no_production_readiness_claim,true);
assert.equal(a.constraints.no_remediation_execution_receipt_validation_claim,true);
assert.equal(a.constraints.no_remediation_execution_external_effect_claim,true);
assert.equal(a.constraints.no_remediation_execution_physical_effect_claim,true);

assert.equal(a.previous_program,"PROG-173");
assert.equal(a.next_required_program,"PROG-175-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-RECEIPT-VALIDATION");

console.log("PROG_174_TEST=PASS");
