const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-147-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-precommit-gate.json","utf8"));

assert.equal(a.program_number,147);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_PRECOMMIT_GATE_PASSED_PENDING_RECOVERY_EXECUTION_COMMIT");

assert.equal(a.level3_axis.principle,"passed_precommit_gate_is_not_recovery_execution");
assert.equal(a.level3_axis.passed_precommit_gate_does_not_execute_recovery,true);
assert.equal(a.level3_axis.passed_precommit_gate_requires_execution_commit,true);
assert.equal(a.level3_axis.external_action_effect_allowed,false);

assert.equal(a.human_decision_response.received,true);
assert.equal(a.human_decision_response.validated,true);
assert.equal(a.human_decision_response.authorization_effect,false);

assert.equal(a.human_decision_record.recorded,true);
assert.equal(a.human_decision_record.validated,true);
assert.equal(a.human_decision_record.record_effect,"NO_EXECUTION_AUTHORIZATION");

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
assert.equal(a.recovery_execution_precommit_gate.pass_reason,"AUTHORITY_BINDING_COMPLETED_AND_PRECOMMIT_CONSTRAINTS_SATISFIED");
assert.equal(a.recovery_execution_precommit_gate.gate_effect,"NO_EXTERNAL_ACTION_EFFECT");

assert.equal(a.recovery_execution_precommit.prepared,true);
assert.equal(a.recovery_execution_precommit.committed,false);
assert.equal(a.recovery_execution_precommit.commit_required,true);
assert.equal(a.recovery_execution_precommit.precommit_effect,"NO_EXECUTION_AUTHORIZATION");
assert.equal(a.recovery_execution_precommit.does_not_execute_recovery,true);
assert.equal(a.recovery_execution_precommit.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_commit.required,true);
assert.equal(a.recovery_execution_commit.defined,false);
assert.equal(a.recovery_execution_commit.evaluated,false);
assert.equal(a.recovery_execution_commit.committed,false);
assert.equal(a.recovery_execution_commit.commit_effect,"NO_EXTERNAL_ACTION_EFFECT");

assert.equal(a.recovery_execution.allowed,false);
assert.equal(a.recovery_execution.performed,false);
assert.equal(a.recovery_execution.blocked_by,"RECOVERY_EXECUTION_COMMIT_NOT_PERFORMED");

assert.equal(a.fail_closed.fail_closed_snapshot_active,true);
assert.equal(a.fail_closed.fail_closed_remains_active,true);
assert.equal(a.fail_closed.no_state_unlock,true);

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

assert.equal(a.previous_program,"PROG-146");
assert.equal(a.next_required_program,"PROG-148-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-COMMIT");

console.log("PROG_147_TEST=PASS");
