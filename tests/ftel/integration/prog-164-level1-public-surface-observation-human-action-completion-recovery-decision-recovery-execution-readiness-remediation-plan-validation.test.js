const fs=require("fs"),assert=require("assert/strict");
const a=JSON.parse(fs.readFileSync("docs/launch/level1/prog-164-level1-public-surface-observation-human-action-completion-recovery-decision-recovery-execution-readiness-remediation-plan-validation.json","utf8"));

assert.equal(a.program_number,164);
assert.equal(a.status,"LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_RECOVERY_EXECUTION_READINESS_REMEDIATION_PLAN_VALIDATED_PENDING_REMEDIATION_EXECUTION_REQUEST");

assert.equal(a.level3_axis.principle,"validated_readiness_remediation_plan_is_not_remediation_execution_or_readiness_gate_pass");
assert.equal(a.level3_axis.execution_closure_proven,true);
assert.equal(a.level3_axis.evidence_bundle_validated,true);
assert.equal(a.level3_axis.readiness_gate_validated,true);
assert.equal(a.level3_axis.readiness_gate_decision_validated,true);
assert.equal(a.level3_axis.readiness_gate_decision_outcome,"NO_GO_VALIDATED");
assert.equal(a.level3_axis.readiness_gate_passed,false);
assert.equal(a.level3_axis.readiness_remediation_plan_required,true);
assert.equal(a.level3_axis.readiness_remediation_plan_created,true);
assert.equal(a.level3_axis.readiness_remediation_plan_validation_performed,true);
assert.equal(a.level3_axis.readiness_remediation_plan_validated,true);
assert.equal(a.level3_axis.readiness_remediation_execution_request_required,true);
assert.equal(a.level3_axis.readiness_remediation_execution_requested,false);
assert.equal(a.level3_axis.launch_readiness_unlocked,false);
assert.equal(a.level3_axis.readiness_unlock_allowed,false);
assert.equal(a.level3_axis.legal_or_certification_effect,false);

assert.equal(a.human_decision_response.received,true);
assert.equal(a.human_decision_response.validated,true);
assert.equal(a.human_decision_response.authorization_effect,false);

assert.equal(a.human_decision_record.recorded,true);
assert.equal(a.human_decision_record.validated,true);
assert.equal(a.human_decision_record.record_effect,"READINESS_REMEDIATION_PLAN_VALIDATED_PENDING_REMEDIATION_EXECUTION_REQUEST");

assert.equal(a.human_decision.recorded,true);
assert.equal(a.human_decision.validated,true);
assert.equal(a.human_decision.selected_recovery_decision_option,"RECOVERY_DECISION_READINESS_REMEDIATION_PLAN_VALIDATED_PENDING_EXECUTION_REQUEST");

assert.equal(a.readiness_gate_decision.validated,true);
assert.equal(a.readiness_gate_decision.passed,false);
assert.equal(a.readiness_gate_decision.decision_outcome,"NO_GO_VALIDATED");
assert.equal(a.readiness_gate_decision.decision_effect,"VALIDATED_NO_GO_READINESS_GATE_DECISION_NO_READINESS_UNLOCK");

assert.equal(a.readiness_gate_decision_validation.performed,true);
assert.equal(a.readiness_gate_decision_validation.validated,true);
assert.equal(a.readiness_gate_decision_validation.passed,false);
assert.equal(a.readiness_gate_decision_validation.validation_effect,"READINESS_GATE_DECISION_VALIDATED_NO_GO_NO_READINESS_UNLOCK");

assert.equal(a.readiness_remediation_plan.required,true);
assert.equal(a.readiness_remediation_plan.created,true);
assert.equal(a.readiness_remediation_plan.validated,true);
assert.equal(a.readiness_remediation_plan.plan_status,"VALIDATED_PENDING_REMEDIATION_EXECUTION_REQUEST");
assert.equal(a.readiness_remediation_plan.plan_scope,"remediate_validated_no_go_readiness_gate_decision_without_unlocking_readiness");
assert.equal(a.readiness_remediation_plan.plan_effect,"VALIDATED_READINESS_REMEDIATION_PLAN_NO_READINESS_UNLOCK");
assert.equal(a.readiness_remediation_plan.references_validated_no_go_decision,true);
assert.equal(a.readiness_remediation_plan.references_readiness_gate_validation,true);
assert.equal(a.readiness_remediation_plan.references_evidence_bundle,true);
assert.equal(a.readiness_remediation_plan.references_execution_closure,true);
assert.equal(a.readiness_remediation_plan.contains_required_corrective_actions,true);
assert.equal(a.readiness_remediation_plan.contains_required_validation_evidence,true);
assert.equal(a.readiness_remediation_plan.contains_no_readiness_unlock_constraint,true);
assert.equal(a.readiness_remediation_plan.contains_no_product_claim_constraint,true);
assert.equal(a.readiness_remediation_plan.contains_no_launch_claim_constraint,true);
assert.equal(a.readiness_remediation_plan.requires_remediation_execution_request,true);
assert.equal(a.readiness_remediation_plan.does_not_unlock_readiness,true);

assert.equal(a.readiness_remediation_plan_validation.required,true);
assert.equal(a.readiness_remediation_plan_validation.performed,true);
assert.equal(a.readiness_remediation_plan_validation.validated,true);
assert.equal(a.readiness_remediation_plan_validation.passed,true);
assert.equal(a.readiness_remediation_plan_validation.plan_identity_validated,true);
assert.equal(a.readiness_remediation_plan_validation.plan_integrity_validated,true);
assert.equal(a.readiness_remediation_plan_validation.validated_no_go_decision_reference_validated,true);
assert.equal(a.readiness_remediation_plan_validation.readiness_gate_validation_reference_validated,true);
assert.equal(a.readiness_remediation_plan_validation.evidence_bundle_reference_validated,true);
assert.equal(a.readiness_remediation_plan_validation.execution_closure_reference_validated,true);
assert.equal(a.readiness_remediation_plan_validation.corrective_actions_present,true);
assert.equal(a.readiness_remediation_plan_validation.validation_evidence_requirements_present,true);
assert.equal(a.readiness_remediation_plan_validation.no_readiness_unlock_constraint_validated,true);
assert.equal(a.readiness_remediation_plan_validation.no_product_claim_constraint_validated,true);
assert.equal(a.readiness_remediation_plan_validation.no_launch_claim_constraint_validated,true);
assert.equal(a.readiness_remediation_plan_validation.validation_status,"VALIDATED_PENDING_REMEDIATION_EXECUTION_REQUEST");
assert.equal(a.readiness_remediation_plan_validation.validation_effect,"READINESS_REMEDIATION_PLAN_VALIDATED_NO_READINESS_UNLOCK");
assert.equal(a.readiness_remediation_plan_validation.does_not_unlock_readiness,true);

assert.equal(a.readiness_remediation_execution_request.required,true);
assert.equal(a.readiness_remediation_execution_request.created,false);
assert.equal(a.readiness_remediation_execution_request.validated,false);
assert.equal(a.readiness_remediation_execution_request.request_status,"PENDING_REMEDIATION_EXECUTION_REQUEST");

assert.equal(a.recovery_execution.allowed,true);
assert.equal(a.recovery_execution.performed,true);
assert.equal(a.recovery_execution.performed_as,"CONTROLLED_COMMIT_WITH_VALIDATED_READINESS_REMEDIATION_PLAN_PENDING_EXECUTION_REQUEST");
assert.equal(a.recovery_execution.receipt_validated,true);
assert.equal(a.recovery_execution.external_effect_proven,true);
assert.equal(a.recovery_execution.physical_effect_proven,true);
assert.equal(a.recovery_execution.completion_record_validated,true);
assert.equal(a.recovery_execution.execution_closure_proven,true);
assert.equal(a.recovery_execution.evidence_bundle_validated,true);
assert.equal(a.recovery_execution.readiness_gate_decision_validated,true);
assert.equal(a.recovery_execution.readiness_gate_passed,false);
assert.equal(a.recovery_execution.readiness_remediation_plan_created,true);
assert.equal(a.recovery_execution.readiness_remediation_plan_validated,true);
assert.equal(a.recovery_execution.readiness_remediation_execution_requested,false);
assert.equal(a.recovery_execution.pending,"READINESS_REMEDIATION_EXECUTION_REQUEST");

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

assert.equal(a.previous_program,"PROG-163");
assert.equal(a.next_required_program,"PROG-165-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-RECOVERY-EXECUTION-READINESS-REMEDIATION-EXECUTION-REQUEST");

console.log("PROG_164_TEST=PASS");
