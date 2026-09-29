const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-149-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-receipt.json","utf8"));

assert.equal(a.program_number,149);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_RECEIPT_RECEIVED_PENDING_RECEIPT_VALIDATION");

assert.equal(a.level3_axis.principle,"execution_receipt_is_not_validated_receipt_or_physical_effect_proof");
assert.equal(a.level3_axis.receipt_received_requires_validation,true);
assert.equal(a.level3_axis.unvalidated_receipt_does_not_prove_external_effect,true);
assert.equal(a.level3_axis.physical_effect_claimed,false);

assert.equal(a.human_decision_response.received,true);
assert.equal(a.human_decision_response.validated,true);
assert.equal(a.human_decision_response.authorization_effect,false);

assert.equal(a.human_decision_record.recorded,true);
assert.equal(a.human_decision_record.validated,true);
assert.equal(a.human_decision_record.record_effect,"CONTROLLED_EXECUTION_COMMIT_WITH_RECEIPT_PENDING_VALIDATION");

assert.equal(a.human_decision.recorded,true);
assert.equal(a.human_decision.validated,true);

assert.equal(a.recovery_execution_authority_binding_gate.required,true);
assert.equal(a.recovery_execution_authority_binding_gate.defined,true);
assert.equal(a.recovery_execution_authority_binding_gate.evaluated,true);
assert.equal(a.recovery_execution_authority_binding_gate.passed,true);
assert.equal(a.recovery_execution_authority_binding_gate.blocked,false);

assert.equal(a.recovery_execution_authority_binding.required,true);
assert.equal(a.recovery_execution_authority_binding.validated,true);
assert.equal(a.recovery_execution_authority_binding.bound,true);
assert.equal(a.recovery_execution_authority_binding.completed,true);

assert.equal(a.recovery_execution_precommit_gate.required,true);
assert.equal(a.recovery_execution_precommit_gate.defined,true);
assert.equal(a.recovery_execution_precommit_gate.evaluated,true);
assert.equal(a.recovery_execution_precommit_gate.passed,true);
assert.equal(a.recovery_execution_precommit_gate.blocked,false);

assert.equal(a.recovery_execution_precommit.prepared,true);
assert.equal(a.recovery_execution_precommit.committed,true);
assert.equal(a.recovery_execution_precommit.does_not_prove_external_effect,true);
assert.equal(a.recovery_execution_precommit.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_commit.required,true);
assert.equal(a.recovery_execution_commit.defined,true);
assert.equal(a.recovery_execution_commit.evaluated,true);
assert.equal(a.recovery_execution_commit.committed,true);
assert.equal(a.recovery_execution_commit.commit_status,"COMMITTED_RECEIPT_RECEIVED_PENDING_VALIDATION");
assert.equal(a.recovery_execution_commit.commit_effect,"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_UNVALIDATED_RECEIPT");
assert.equal(a.recovery_execution_commit.does_not_prove_external_effect,true);
assert.equal(a.recovery_execution_commit.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_receipt.required,true);
assert.equal(a.recovery_execution_receipt.received,true);
assert.equal(a.recovery_execution_receipt.validated,false);
assert.equal(a.recovery_execution_receipt.validation_required,true);
assert.equal(a.recovery_execution_receipt.receipt_status,"RECEIVED_PENDING_VALIDATION");
assert.equal(a.recovery_execution_receipt.receipt_scope,"execution_receipt_presence_only");
assert.equal(a.recovery_execution_receipt.receipt_effect,"NO_EXTERNAL_EFFECT_PROOF");
assert.equal(a.recovery_execution_receipt.does_not_prove_external_effect,true);
assert.equal(a.recovery_execution_receipt.does_not_prove_physical_effect,true);
assert.equal(a.recovery_execution_receipt.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution.allowed,true);
assert.equal(a.recovery_execution.performed,true);
assert.equal(a.recovery_execution.performed_as,"CONTROLLED_COMMIT_WITH_RECEIPT_PENDING_VALIDATION");
assert.equal(a.recovery_execution.receipt_received,true);
assert.equal(a.recovery_execution.receipt_validated,false);
assert.equal(a.recovery_execution.external_effect_proven,false);
assert.equal(a.recovery_execution.physical_effect_proven,false);
assert.equal(a.recovery_execution.pending,"RECOVERY_EXECUTION_RECEIPT_VALIDATION");

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

assert.equal(a.previous_program,"PROG-148");
assert.equal(a.next_required_program,"PROG-150-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-RECEIPT-VALIDATION");

console.log("PROG_149_TEST=PASS");
