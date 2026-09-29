const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-152-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-external-effect-evidence-validation.json","utf8"));

assert.equal(a.program_number,152);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_EXTERNAL_EFFECT_EVIDENCE_VALIDATED_PENDING_PHYSICAL_EFFECT_EVIDENCE");

assert.equal(a.level3_axis.principle,"validated_external_effect_evidence_is_not_physical_effect_proof");
assert.equal(a.level3_axis.external_effect_evidence_validation_performed,true);
assert.equal(a.level3_axis.external_effect_validated,true);
assert.equal(a.level3_axis.physical_effect_evidence_required,true);
assert.equal(a.level3_axis.validated_external_effect_does_not_prove_physical_effect,true);
assert.equal(a.level3_axis.physical_effect_claimed,false);

assert.equal(a.human_decision_response.received,true);
assert.equal(a.human_decision_response.validated,true);
assert.equal(a.human_decision_response.authorization_effect,false);

assert.equal(a.human_decision_record.recorded,true);
assert.equal(a.human_decision_record.validated,true);
assert.equal(a.human_decision_record.record_effect,"CONTROLLED_EXECUTION_COMMIT_WITH_VALIDATED_EXTERNAL_EFFECT_EVIDENCE_PENDING_PHYSICAL_EFFECT_EVIDENCE");

assert.equal(a.human_decision.recorded,true);
assert.equal(a.human_decision.validated,true);
assert.equal(a.human_decision.selected_recovery_decision_option,"RECOVERY_DECISION_EXECUTION_COMMITTED_EXTERNAL_EFFECT_EVIDENCE_VALIDATED_PENDING_PHYSICAL_EFFECT_EVIDENCE");

assert.equal(a.recovery_execution_authority_binding_gate.required,true);
assert.equal(a.recovery_execution_authority_binding_gate.passed,true);
assert.equal(a.recovery_execution_authority_binding.completed,true);

assert.equal(a.recovery_execution_precommit_gate.required,true);
assert.equal(a.recovery_execution_precommit_gate.passed,true);
assert.equal(a.recovery_execution_precommit.committed,true);

assert.equal(a.recovery_execution_commit.required,true);
assert.equal(a.recovery_execution_commit.committed,true);
assert.equal(a.recovery_execution_commit.commit_status,"COMMITTED_EXTERNAL_EFFECT_EVIDENCE_VALIDATED_PENDING_PHYSICAL_EFFECT_EVIDENCE");
assert.equal(a.recovery_execution_commit.commit_effect,"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_VALIDATED_EXTERNAL_EFFECT_EVIDENCE");
assert.equal(a.recovery_execution_commit.does_not_prove_physical_effect,true);
assert.equal(a.recovery_execution_commit.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_receipt.received,true);
assert.equal(a.recovery_execution_receipt.validated,true);
assert.equal(a.recovery_execution_receipt.validation_performed,true);
assert.equal(a.recovery_execution_receipt.does_not_prove_physical_effect,true);

assert.equal(a.recovery_execution_external_effect_evidence.required,true);
assert.equal(a.recovery_execution_external_effect_evidence.received,true);
assert.equal(a.recovery_execution_external_effect_evidence.validated,true);
assert.equal(a.recovery_execution_external_effect_evidence.validation_performed,true);
assert.equal(a.recovery_execution_external_effect_evidence.evidence_status,"VALIDATED_PENDING_PHYSICAL_EFFECT_EVIDENCE");
assert.equal(a.recovery_execution_external_effect_evidence.evidence_scope,"external_effect_evidence_integrity_and_commit_correlation");
assert.equal(a.recovery_execution_external_effect_evidence.evidence_effect,"VALIDATED_EXTERNAL_EFFECT_NO_PHYSICAL_EFFECT_PROOF");
assert.equal(a.recovery_execution_external_effect_evidence.does_not_prove_physical_effect,true);
assert.equal(a.recovery_execution_external_effect_evidence.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_external_effect_evidence_validation.required,true);
assert.equal(a.recovery_execution_external_effect_evidence_validation.performed,true);
assert.equal(a.recovery_execution_external_effect_evidence_validation.validated,true);
assert.equal(a.recovery_execution_external_effect_evidence_validation.validation_scope,"external_effect_evidence_identity_integrity_receipt_commit_correlation");
assert.equal(a.recovery_execution_external_effect_evidence_validation.evidence_identity_validated,true);
assert.equal(a.recovery_execution_external_effect_evidence_validation.evidence_integrity_validated,true);
assert.equal(a.recovery_execution_external_effect_evidence_validation.receipt_correlation_validated,true);
assert.equal(a.recovery_execution_external_effect_evidence_validation.commit_correlation_validated,true);
assert.equal(a.recovery_execution_external_effect_evidence_validation.validation_status,"VALIDATED_PENDING_PHYSICAL_EFFECT_EVIDENCE");
assert.equal(a.recovery_execution_external_effect_evidence_validation.validation_effect,"EXTERNAL_EFFECT_VALIDATED_NO_PHYSICAL_EFFECT_PROOF");
assert.equal(a.recovery_execution_external_effect_evidence_validation.does_not_prove_physical_effect,true);
assert.equal(a.recovery_execution_external_effect_evidence_validation.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_physical_effect_evidence.required,true);
assert.equal(a.recovery_execution_physical_effect_evidence.received,false);
assert.equal(a.recovery_execution_physical_effect_evidence.validated,false);
assert.equal(a.recovery_execution_physical_effect_evidence.evidence_status,"PENDING_PHYSICAL_EFFECT_EVIDENCE");

assert.equal(a.recovery_execution.allowed,true);
assert.equal(a.recovery_execution.performed,true);
assert.equal(a.recovery_execution.performed_as,"CONTROLLED_COMMIT_WITH_VALIDATED_EXTERNAL_EFFECT_EVIDENCE_PENDING_PHYSICAL_EFFECT_EVIDENCE");
assert.equal(a.recovery_execution.receipt_received,true);
assert.equal(a.recovery_execution.receipt_validated,true);
assert.equal(a.recovery_execution.external_effect_evidence_received,true);
assert.equal(a.recovery_execution.external_effect_evidence_validated,true);
assert.equal(a.recovery_execution.external_effect_proven,true);
assert.equal(a.recovery_execution.physical_effect_evidence_received,false);
assert.equal(a.recovery_execution.physical_effect_proven,false);
assert.equal(a.recovery_execution.pending,"RECOVERY_EXECUTION_PHYSICAL_EFFECT_EVIDENCE");

assert.equal(a.fail_closed.fail_closed_snapshot_active,true);
assert.equal(a.fail_closed.fail_closed_remains_active,false);
assert.equal(a.fail_closed.no_state_unlock,false);

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
assert.equal(a.constraints.no_physical_effect_claim,true);

assert.equal(a.previous_program,"PROG-151");
assert.equal(a.next_required_program,"PROG-153-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-PHYSICAL-EFFECT-EVIDENCE");

console.log("PROG_152_TEST=PASS");
