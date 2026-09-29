const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-172-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-precommit.json","utf8"));

assert.equal(a.program_number,172);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_PRECOMMITTED_PENDING_REMEDIATION_EXECUTION_COMMIT");

assert.equal(a.level3_axis.principle,"remediation_execution_precommit_is_not_execution_commit_or_remediation_execution");
assert.equal(a.level3_axis.readiness_gate_passed,false);
assert.equal(a.level3_axis.remediation_execution_authority_binding_completed,true);
assert.equal(a.level3_axis.remediation_execution_precommit_gate_passed,true);
assert.equal(a.level3_axis.remediation_execution_precommit_required,true);
assert.equal(a.level3_axis.remediation_execution_precommit_prepared,true);
assert.equal(a.level3_axis.remediation_execution_precommit_committed,true);
assert.equal(a.level3_axis.remediation_execution_commit_required,true);
assert.equal(a.level3_axis.remediation_execution_commit_performed,false);
assert.equal(a.level3_axis.readiness_remediation_execution_authorized,false);
assert.equal(a.level3_axis.readiness_remediation_execution_performed,false);
assert.equal(a.level3_axis.launch_readiness_unlocked,false);
assert.equal(a.level3_axis.readiness_unlock_allowed,false);
assert.equal(a.level3_axis.legal_or_certification_effect,false);

assert.equal(a.human_decision_response.validated,true);
assert.equal(a.human_decision_response.authorization_effect,false);
assert.equal(a.human_decision_record.record_effect,"REMEDIATION_EXECUTION_PRECOMMITTED_PENDING_EXECUTION_COMMIT");

assert.equal(a.readiness_remediation_execution_authority_binding.completed,true);
assert.equal(a.readiness_remediation_execution_authority_binding.precommit_gate_passed,true);
assert.equal(a.readiness_remediation_execution_authority_binding.precommit_committed,true);
assert.equal(a.readiness_remediation_execution_authority_binding.requires_execution_commit,true);
assert.equal(a.readiness_remediation_execution_authority_binding.does_not_commit_execution,true);
assert.equal(a.readiness_remediation_execution_authority_binding.does_not_authorize_execution,true);
assert.equal(a.readiness_remediation_execution_authority_binding.does_not_execute_remediation,true);

assert.equal(a.readiness_remediation_execution_precommit_gate.required,true);
assert.equal(a.readiness_remediation_execution_precommit_gate.evaluated,true);
assert.equal(a.readiness_remediation_execution_precommit_gate.passed,true);
assert.equal(a.readiness_remediation_execution_precommit_gate.gate_status,"PASSED");

assert.equal(a.readiness_remediation_execution_precommit.required,true);
assert.equal(a.readiness_remediation_execution_precommit.prepared,true);
assert.equal(a.readiness_remediation_execution_precommit.committed,true);
assert.equal(a.readiness_remediation_execution_precommit.precommit_status,"COMMITTED_PENDING_REMEDIATION_EXECUTION_COMMIT");
assert.equal(a.readiness_remediation_execution_precommit.binds_validated_remediation_execution_request,true);
assert.equal(a.readiness_remediation_execution_precommit.binds_completed_authority_binding,true);
assert.equal(a.readiness_remediation_execution_precommit.binds_passed_precommit_gate,true);
assert.equal(a.readiness_remediation_execution_precommit.requires_execution_commit,true);
assert.equal(a.readiness_remediation_execution_precommit.does_not_commit_execution,true);
assert.equal(a.readiness_remediation_execution_precommit.does_not_authorize_execution,true);
assert.equal(a.readiness_remediation_execution_precommit.does_not_execute_remediation,true);
assert.equal(a.readiness_remediation_execution_precommit.does_not_unlock_readiness,true);

assert.equal(a.readiness_remediation_execution_commit.required,true);
assert.equal(a.readiness_remediation_execution_commit.committed,false);
assert.equal(a.readiness_remediation_execution_commit.commit_status,"PENDING_REMEDIATION_EXECUTION_COMMIT");

assert.equal(a.readiness_remediation_execution.required,true);
assert.equal(a.readiness_remediation_execution.requested,true);
assert.equal(a.readiness_remediation_execution.request_validated,true);
assert.equal(a.readiness_remediation_execution.authority_binding_completed,true);
assert.equal(a.readiness_remediation_execution.precommit_gate_passed,true);
assert.equal(a.readiness_remediation_execution.precommit_required,true);
assert.equal(a.readiness_remediation_execution.precommit_prepared,true);
assert.equal(a.readiness_remediation_execution.precommit_committed,true);
assert.equal(a.readiness_remediation_execution.commit_required,true);
assert.equal(a.readiness_remediation_execution.commit_performed,false);
assert.equal(a.readiness_remediation_execution.authorized,false);
assert.equal(a.readiness_remediation_execution.performed,false);
assert.equal(a.readiness_remediation_execution.execution_status,"PENDING_REMEDIATION_EXECUTION_COMMIT");

assert.equal(a.recovery_execution.readiness_remediation_execution_requested,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_request_validated,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_authority_binding_completed,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_precommit_gate_passed,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_precommit_required,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_precommit_prepared,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_precommit_committed,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_commit_required,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_commit_performed,false);
assert.equal(a.recovery_execution.readiness_remediation_execution_authorized,false);
assert.equal(a.recovery_execution.readiness_remediation_execution_performed,false);
assert.equal(a.recovery_execution.readiness_gate_passed,false);
assert.equal(a.recovery_execution.pending,"READINESS_REMEDIATION_EXECUTION_COMMIT");

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
assert.equal(a.constraints.no_remediation_execution_claim,true);
assert.equal(a.constraints.no_remediation_execution_commit_claim,true);
assert.equal(a.constraints.no_remediation_execution_authorization_claim,true);

assert.equal(a.previous_program,"PROG-171");
assert.equal(a.next_required_program,"PROG-173-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-COMMIT");

console.log("PROG_172_TEST=PASS");
