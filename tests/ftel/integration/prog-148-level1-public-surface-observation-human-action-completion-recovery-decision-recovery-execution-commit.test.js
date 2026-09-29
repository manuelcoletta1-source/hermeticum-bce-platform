const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-148-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-commit.json","utf8"));

assert.equal(a.program_number,148);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_COMMITTED_PENDING_EXECUTION_RECEIPT");

assert.equal(a.level3_axis.principle,"recovery_execution_commit_is_not_execution_receipt_or_physical_effect_proof");
assert.equal(a.level3_axis.execution_commit_requires_receipt,true);
assert.equal(a.level3_axis.commit_does_not_prove_external_effect,true);
assert.equal(a.level3_axis.external_action_effect_claimed,false);

assert.equal(a.human_decision_response.received,true);
assert.equal(a.human_decision_response.validated,true);
assert.equal(a.human_decision_response.authorization_effect,false);

assert.equal(a.human_decision_record.recorded,true);
assert.equal(a.human_decision_record.validated,true);

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
assert.equal(a.recovery_execution_commit.commit_status,"COMMITTED_PENDING_EXECUTION_RECEIPT");
assert.equal(a.recovery_execution_commit.commit_effect,"CONTROLLED_RECOVERY_EXECUTION_COMMIT_NO_RECEIPT_YET");
assert.equal(a.recovery_execution_commit.does_not_prove_external_effect,true);
assert.equal(a.recovery_execution_commit.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_receipt.required,true);
assert.equal(a.recovery_execution_receipt.received,false);
assert.equal(a.recovery_execution_receipt.validated,false);

assert.equal(a.recovery_execution.allowed,true);
assert.equal(a.recovery_execution.performed,true);
assert.equal(a.recovery_execution.performed_as,"CONTROLLED_COMMIT_ONLY");
assert.equal(a.recovery_execution.receipt_received,false);
assert.equal(a.recovery_execution.external_effect_proven,false);
assert.equal(a.recovery_execution.physical_effect_proven,false);
assert.equal(a.recovery_execution.pending,"RECOVERY_EXECUTION_RECEIPT");

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

assert.equal(a.previous_program,"PROG-147");
assert.equal(a.next_required_program,"PROG-149-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-RECEIPT");

console.log("PROG_148_TEST=PASS");
