const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-165-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-execution-request.json","utf8"));

assert.equal(a.program_number,165);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_EXECUTION_REQUEST_CREATED_PENDING_REMEDIATION_EXECUTION_REQUEST_VALIDATION");

assert.equal(a.level3_axis.principle,"readiness_remediation_execution_request_created_is_not_validated_request_or_remediation_execution");
assert.equal(a.level3_axis.execution_closure_proven,true);
assert.equal(a.level3_axis.evidence_bundle_validated,true);
assert.equal(a.level3_axis.readiness_gate_decision_validated,true);
assert.equal(a.level3_axis.readiness_gate_decision_outcome,"NO_GO_VALIDATED");
assert.equal(a.level3_axis.readiness_gate_passed,false);
assert.equal(a.level3_axis.readiness_remediation_plan_validated,true);
assert.equal(a.level3_axis.readiness_remediation_execution_request_required,true);
assert.equal(a.level3_axis.readiness_remediation_execution_request_created,true);
assert.equal(a.level3_axis.readiness_remediation_execution_request_validated,false);
assert.equal(a.level3_axis.readiness_remediation_execution_performed,false);
assert.equal(a.level3_axis.launch_readiness_unlocked,false);
assert.equal(a.level3_axis.readiness_unlock_allowed,false);
assert.equal(a.level3_axis.legal_or_certification_effect,false);

assert.equal(a.human_decision_response.received,true);
assert.equal(a.human_decision_response.validated,true);
assert.equal(a.human_decision_response.authorization_effect,false);

assert.equal(a.human_decision_record.recorded,true);
assert.equal(a.human_decision_record.validated,true);
assert.equal(a.human_decision_record.record_effect,"READINESS_REMEDIATION_EXECUTION_REQUEST_CREATED_PENDING_VALIDATION");

assert.equal(a.human_decision.recorded,true);
assert.equal(a.human_decision.validated,true);
assert.equal(a.human_decision.selected_recovery_decision_option,"RECOVERY_DECISION_READINESS_REMEDIATION_EXECUTION_REQUEST_CREATED_PENDING_VALIDATION");

assert.equal(a.recovery_execution_authority_binding_gate.required,true);
assert.equal(a.recovery_execution_authority_binding_gate.passed,true);
assert.equal(a.recovery_execution_authority_binding.completed,true);

assert.equal(a.recovery_execution_precommit_gate.required,true);
assert.equal(a.recovery_execution_precommit_gate.passed,true);
assert.equal(a.recovery_execution_precommit.committed,true);
assert.equal(a.recovery_execution_precommit.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution_commit.required,true);
assert.equal(a.recovery_execution_commit.committed,true);
assert.equal(a.recovery_execution_commit.commit_status,"COMMITTED_REMEDIATION_EXECUTION_REQUEST_CREATED_PENDING_VALIDATION");
assert.equal(a.recovery_execution_commit.commit_effect,"CONTROLLED_RECOVERY_EXECUTION_COMMIT_WITH_REMEDIATION_EXECUTION_REQUEST");
assert.equal(a.recovery_execution_commit.does_not_execute_remediation,true);
assert.equal(a.recovery_execution_commit.does_not_unlock_readiness,true);

assert.equal(a.readiness_gate_decision.validated,true);
assert.equal(a.readiness_gate_decision.passed,false);
assert.equal(a.readiness_gate_decision.decision_outcome,"NO_GO_VALIDATED");
assert.equal(a.readiness_gate_decision.decision_effect,"VALIDATED_NO_GO_READINESS_GATE_DECISION_NO_READINESS_UNLOCK");

assert.equal(a.readiness_remediation_plan.required,true);
assert.equal(a.readiness_remediation_plan.created,true);
assert.equal(a.readiness_remediation_plan.validated,true);
assert.equal(a.readiness_remediation_plan.plan_status,"VALIDATED");
assert.equal(a.readiness_remediation_plan.plan_effect,"VALIDATED_READINESS_REMEDIATION_PLAN_NO_READINESS_UNLOCK");
assert.equal(a.readiness_remediation_plan.requires_remediation_execution_request,true);
assert.equal(a.readiness_remediation_plan.does_not_unlock_readiness,true);

assert.equal(a.readiness_remediation_plan_validation.required,true);
assert.equal(a.readiness_remediation_plan_validation.performed,true);
assert.equal(a.readiness_remediation_plan_validation.validated,true);
assert.equal(a.readiness_remediation_plan_validation.passed,true);
assert.equal(a.readiness_remediation_plan_validation.validation_status,"VALIDATED");
assert.equal(a.readiness_remediation_plan_validation.validation_effect,"READINESS_REMEDIATION_PLAN_VALIDATED_NO_READINESS_UNLOCK");

assert.equal(a.readiness_remediation_execution_request.required,true);
assert.equal(a.readiness_remediation_execution_request.created,true);
assert.equal(a.readiness_remediation_execution_request.validated,false);
assert.equal(a.readiness_remediation_execution_request.authorized,false);
assert.equal(a.readiness_remediation_execution_request.request_status,"CREATED_PENDING_REMEDIATION_EXECUTION_REQUEST_VALIDATION");
assert.equal(a.readiness_remediation_execution_request.request_scope,"execute_validated_readiness_remediation_plan_without_unlocking_readiness");
assert.equal(a.readiness_remediation_execution_request.request_effect,"REMEDIATION_EXECUTION_REQUEST_CREATED_NO_REMEDIATION_EXECUTION_NO_READINESS_UNLOCK");
assert.equal(a.readiness_remediation_execution_request.references_validated_remediation_plan,true);
assert.equal(a.readiness_remediation_execution_request.references_validated_no_go_decision,true);
assert.equal(a.readiness_remediation_execution_request.references_readiness_gate_validation,true);
assert.equal(a.readiness_remediation_execution_request.references_evidence_bundle,true);
assert.equal(a.readiness_remediation_execution_request.references_execution_closure,true);
assert.equal(a.readiness_remediation_execution_request.contains_human_authority_requirement,true);
assert.equal(a.readiness_remediation_execution_request.contains_no_readiness_unlock_constraint,true);
assert.equal(a.readiness_remediation_execution_request.contains_no_product_claim_constraint,true);
assert.equal(a.readiness_remediation_execution_request.contains_no_launch_claim_constraint,true);
assert.equal(a.readiness_remediation_execution_request.requires_request_validation,true);
assert.equal(a.readiness_remediation_execution_request.requires_execution_authority_binding,true);
assert.equal(a.readiness_remediation_execution_request.does_not_execute_remediation,true);
assert.equal(a.readiness_remediation_execution_request.does_not_unlock_readiness,true);

assert.equal(a.readiness_remediation_execution_request_validation.required,true);
assert.equal(a.readiness_remediation_execution_request_validation.performed,false);
assert.equal(a.readiness_remediation_execution_request_validation.validated,false);
assert.equal(a.readiness_remediation_execution_request_validation.authorized,false);
assert.equal(a.readiness_remediation_execution_request_validation.validation_status,"PENDING_REMEDIATION_EXECUTION_REQUEST_VALIDATION");

assert.equal(a.readiness_remediation_execution.required,true);
assert.equal(a.readiness_remediation_execution.requested,true);
assert.equal(a.readiness_remediation_execution.request_validated,false);
assert.equal(a.readiness_remediation_execution.authorized,false);
assert.equal(a.readiness_remediation_execution.performed,false);
assert.equal(a.readiness_remediation_execution.receipt_received,false);
assert.equal(a.readiness_remediation_execution.execution_status,"PENDING_REMEDIATION_EXECUTION_REQUEST_VALIDATION");
assert.equal(a.readiness_remediation_execution.does_not_unlock_readiness,true);

assert.equal(a.recovery_execution.allowed,true);
assert.equal(a.recovery_execution.performed,true);
assert.equal(a.recovery_execution.performed_as,"CONTROLLED_COMMIT_WITH_REMEDIATION_EXECUTION_REQUEST_PENDING_VALIDATION");
assert.equal(a.recovery_execution.receipt_validated,true);
assert.equal(a.recovery_execution.external_effect_proven,true);
assert.equal(a.recovery_execution.physical_effect_proven,true);
assert.equal(a.recovery_execution.completion_record_validated,true);
assert.equal(a.recovery_execution.execution_closure_proven,true);
assert.equal(a.recovery_execution.evidence_bundle_validated,true);
assert.equal(a.recovery_execution.readiness_gate_decision_validated,true);
assert.equal(a.recovery_execution.readiness_gate_passed,false);
assert.equal(a.recovery_execution.readiness_remediation_plan_validated,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_requested,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_request_validated,false);
assert.equal(a.recovery_execution.readiness_remediation_execution_performed,false);
assert.equal(a.recovery_execution.pending,"READINESS_REMEDIATION_EXECUTION_REQUEST_VALIDATION");

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
assert.equal(a.constraints.no_validated_remediation_execution_request_claim,true);

assert.equal(a.previous_program,"PROG-164");
assert.equal(a.next_required_program,"PROG-166-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-REQUEST-VALIDATION");

console.log("PROG_165_TEST=PASS");
