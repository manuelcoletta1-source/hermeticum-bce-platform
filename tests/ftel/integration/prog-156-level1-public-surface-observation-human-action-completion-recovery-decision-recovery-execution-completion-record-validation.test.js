const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-156-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-completion-record-validation.json","utf8"));

assert.equal(a.program_number,156);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE");

assert.equal(a.level3_axis.principle,"validated_completion_record_proves_execution_closure_but_does_not_unlock_readiness");
assert.equal(a.level3_axis.completion_record_created,true);
assert.equal(a.level3_axis.completion_record_validation_performed,true);
assert.equal(a.level3_axis.completion_record_validated,true);
assert.equal(a.level3_axis.execution_closure_proven,true);
assert.equal(a.level3_axis.evidence_bundle_required,true);
assert.equal(a.level3_axis.readiness_unlock_allowed,false);
assert.equal(a.level3_axis.legal_or_certification_effect,false);

assert.equal(a.human_decision_response.received,true);
assert.equal(a.human_decision_response.validated,true);
assert.equal(a.human_decision_response.authorization_effect,false);

assert.equal(a.human_decision_record.recorded,true);
assert.equal(a.human_decision_record.validated,true);
assert.equal(a.human_decision_record.record_effect,"CONTROLLED_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE");

assert.equal(a.human_decision.recorded,true);
assert.equal(a.human_decision.validated,true);
assert.equal(a.human_decision.selected_recovery_decision_option,"RECOVERY_DECISION_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE");

assert.equal(a.recovery_execution_authority_binding_gate.required,true);
assert.equal(a.recovery_execution_authority_binding_gate.passed,true);
assert.equal(a.recovery_execution_authority_binding.completed,true);

assert.equal(a.recovery_execution_precommit_gate.required,true);
assert.equal(a.recovery_execution_precommit_gate.passed,true);
assert.equal(a.recovery_execution_precommit.committed,true);
assert.equal(a.recovery_execution_precommit.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_commit.required,true);
assert.equal(a.recovery_execution_commit.committed,true);
assert.equal(a.recovery_execution_commit.commit_status,"COMMITTED_EXECUTION_CLOSURE_PROVEN_PENDING_EVIDENCE_BUNDLE");
assert.equal(a.recovery_execution_commit.commit_effect,"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_VALIDATED_COMPLETION_RECORD");
assert.equal(a.recovery_execution_commit.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_receipt.received,true);
assert.equal(a.recovery_execution_receipt.validated,true);
assert.equal(a.recovery_execution_receipt.validation_performed,true);
assert.equal(a.recovery_execution_receipt.receipt_effect,"VALID_RECEIPT");

assert.equal(a.recovery_execution_external_effect_evidence.received,true);
assert.equal(a.recovery_execution_external_effect_evidence.validated,true);
assert.equal(a.recovery_execution_external_effect_evidence.validation_performed,true);
assert.equal(a.recovery_execution_external_effect_evidence.evidence_effect,"VALIDATED_EXTERNAL_EFFECT");

assert.equal(a.recovery_execution_physical_effect_evidence.received,true);
assert.equal(a.recovery_execution_physical_effect_evidence.validated,true);
assert.equal(a.recovery_execution_physical_effect_evidence.validation_performed,true);
assert.equal(a.recovery_execution_physical_effect_evidence.evidence_effect,"VALIDATED_PHYSICAL_EFFECT_PROOF");
assert.equal(a.recovery_execution_physical_effect_evidence.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_completion_record.required,true);
assert.equal(a.recovery_execution_completion_record.created,true);
assert.equal(a.recovery_execution_completion_record.validated,true);
assert.equal(a.recovery_execution_completion_record.validation_required,true);
assert.equal(a.recovery_execution_completion_record.validation_performed,true);
assert.equal(a.recovery_execution_completion_record.record_status,"VALIDATED_PENDING_EVIDENCE_BUNDLE");
assert.equal(a.recovery_execution_completion_record.record_scope,"receipt_external_effect_physical_effect_commit_completion_summary");
assert.equal(a.recovery_execution_completion_record.record_effect,"VALIDATED_COMPLETION_RECORD_PROVES_EXECUTION_CLOSURE");
assert.equal(a.recovery_execution_completion_record.contains_receipt_reference,true);
assert.equal(a.recovery_execution_completion_record.contains_external_effect_reference,true);
assert.equal(a.recovery_execution_completion_record.contains_physical_effect_reference,true);
assert.equal(a.recovery_execution_completion_record.contains_commit_reference,true);
assert.equal(a.recovery_execution_completion_record.contains_authority_binding_reference,true);
assert.equal(a.recovery_execution_completion_record.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_completion_record_validation.required,true);
assert.equal(a.recovery_execution_completion_record_validation.performed,true);
assert.equal(a.recovery_execution_completion_record_validation.validated,true);
assert.equal(a.recovery_execution_completion_record_validation.validation_scope,"completion_record_identity_integrity_receipt_external_effect_physical_effect_commit_authority_correlation");
assert.equal(a.recovery_execution_completion_record_validation.record_identity_validated,true);
assert.equal(a.recovery_execution_completion_record_validation.record_integrity_validated,true);
assert.equal(a.recovery_execution_completion_record_validation.receipt_reference_validated,true);
assert.equal(a.recovery_execution_completion_record_validation.external_effect_reference_validated,true);
assert.equal(a.recovery_execution_completion_record_validation.physical_effect_reference_validated,true);
assert.equal(a.recovery_execution_completion_record_validation.commit_reference_validated,true);
assert.equal(a.recovery_execution_completion_record_validation.authority_binding_reference_validated,true);
assert.equal(a.recovery_execution_completion_record_validation.validation_status,"VALIDATED_PENDING_EVIDENCE_BUNDLE");
assert.equal(a.recovery_execution_completion_record_validation.validation_effect,"EXECUTION_CLOSURE_PROVEN_NO_READINESS_UNLOCK");
assert.equal(a.recovery_execution_completion_record_validation.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_evidence_bundle.required,true);
assert.equal(a.recovery_execution_evidence_bundle.created,false);
assert.equal(a.recovery_execution_evidence_bundle.validated,false);
assert.equal(a.recovery_execution_evidence_bundle.bundle_status,"PENDING_RECOVERY_EXECUTION_EVIDENCE_BUNDLE");

assert.equal(a.recovery_execution.allowed,true);
assert.equal(a.recovery_execution.performed,true);
assert.equal(a.recovery_execution.performed_as,"CONTROLLED_COMMIT_WITH_VALIDATED_COMPLETION_RECORD_PENDING_EVIDENCE_BUNDLE");
assert.equal(a.recovery_execution.receipt_received,true);
assert.equal(a.recovery_execution.receipt_validated,true);
assert.equal(a.recovery_execution.external_effect_evidence_received,true);
assert.equal(a.recovery_execution.external_effect_evidence_validated,true);
assert.equal(a.recovery_execution.external_effect_proven,true);
assert.equal(a.recovery_execution.physical_effect_evidence_received,true);
assert.equal(a.recovery_execution.physical_effect_evidence_validated,true);
assert.equal(a.recovery_execution.physical_effect_proven,true);
assert.equal(a.recovery_execution.completion_record_created,true);
assert.equal(a.recovery_execution.completion_record_validated,true);
assert.equal(a.recovery_execution.execution_closure_proven,true);
assert.equal(a.recovery_execution.evidence_bundle_created,false);
assert.equal(a.recovery_execution.pending,"RECOVERY_EXECUTION_EVIDENCE_BUNDLE");

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
assert.equal(a.constraints.no_certification_claim,true);
assert.equal(a.constraints.no_product_claim,true);

assert.equal(a.previous_program,"PROG-155");
assert.equal(a.next_required_program,"PROG-157-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-EVIDENCE-BUNDLE");

console.log("PROG_156_TEST=PASS");
