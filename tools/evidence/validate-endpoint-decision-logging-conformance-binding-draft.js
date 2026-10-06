#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT_v001.json";

let ok = true;
let d = null;

function fail(message) {
  console.log(message);
  ok = false;
}

try {
  d = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (err) {
  fail(`JSON_READ_OR_PARSE_FAIL ${err.message}`);
  d = {};
}

const exact = {
  object_id: "HBCE-ENDPOINT-DECISION-LOGGING-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEEndpointDecisionLoggingConformanceBindingDraft",
  classification: "R_AND_D_ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "8ea82658133155ef54a57ae560637e55d580aa1b",
  recommended_next_program: "PROG-320",
  recommended_next_object_id: "HBCE-ENDPOINT-AUDIT-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 37,
  required_endpoint_decision_logging_conformance_field_count: 86,
  binding_rule_count: 86,
  future_resolution_requirement_count: 79,
  required_non_claim_count: 937,
  required_no_execution_boundary_count: 937
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 31,
  required_endpoint_decision_logging_conformance_fields: 86,
  binding_rules: 86,
  future_resolution_requirements: 79,
  explicit_non_claims: 937,
  no_execution_boundary: 937
};

for (const [key, expectedLength] of Object.entries(arrays)) {
  if (!Array.isArray(d[key])) {
    fail(`ARRAY_MISSING ${key}`);
    continue;
  }

  if (d[key].length !== expectedLength) {
    fail(`ARRAY_LENGTH_MISMATCH ${key}: expected=${expectedLength} actual=${d[key].length}`);
  }
}

const requiredBasis = [
  "HBCE-ENDPOINT-POLICY-ENFORCEMENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHORIZATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHENTICATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ALLOW-STATE-TEST-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-DENY-STATE-TEST-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ACCESS-STATUS-ENDPOINTS-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-PLATFORM-CORE-SERVER-TO-SERVER-INTEGRATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-IPR-ONBOARDING-APP-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-IPR-DOCUMENTO-INQUADRAMENTO-TECNICO-IMPRENDITORIALE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-B2B-LEVEL1-JOKER-C2-LAYER-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-B2G-LEVEL2-FORENSIC-EVIDENCE-VERIFIER-QUALIFICATION-HARDENING-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-L3-EVR-IOSPACE-EXECUTION-BOUNDARY-REFACTOR-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-RD-MASTER-THREE-LEVEL-GOVERNANCE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-CORPORATE-LEGAL-TECHNICAL-MASTER-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-MATRIX-OPERATING-PROGRAMMING-MASTER-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-INTERNAL-PILOT-PROGRAMMING-HANDOFF-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-PRODUCT-REALIGNMENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-GLOBAL-TARGET-MAP-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-GOLDEN-FLOW-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-MATRIX-EFFECTIVE-STATE-BINDING-DRAFT-V001",
  "HBCE-INDEPENDENT-RECONSTRUCTION-QUALIFIED-VERIFICATION-BINDING-DRAFT-V001",
  "HBCE-EVIDENCE-PROVENANCE-CUSTODY-BINDING-DRAFT-V001",
  "HBCE-CONSEQUENCE-TARGET-OUTCOME-BINDING-DRAFT-V001",
  "HBCE-EXECUTION-TRACE-BINDING-DRAFT-V001",
  "HBCE-CONTROLLED-DISPATCH-BINDING-DRAFT-V001",
  "HBCE-DECISION-APPROVAL-OVERRIDE-BINDING-DRAFT-V001",
  "HBCE-POINT-OF-USE-AUTHORIZATION-BINDING-DRAFT-V001",
  "HBCE-AUTHORIZATION-SCOPE-BINDING-DRAFT-V001",
  "HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001",
  "HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001",
  "HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001"
];

for (const item of requiredBasis) {
  if (!Array.isArray(d.basis) || !d.basis.includes(item)) {
    fail(`BASIS_MISSING ${item}`);
  }
}

const requiredFields = [
  "endpoint_decision_logging_conformance_id",
  "endpoint_decision_logging_conformance_version",
  "request_ref",
  "authority_ref",
  "policy_evaluation_ref",
  "authorization_scope_ref",
  "point_of_use_authorization_ref",
  "decision_approval_override_ref",
  "controlled_dispatch_ref",
  "execution_trace_ref",
  "consequence_target_outcome_ref",
  "evidence_provenance_custody_ref",
  "independent_reconstruction_qualified_verification_ref",
  "matrix_effective_state_ref",
  "golden_flow_conformance_ref",
  "global_target_map_conformance_ref",
  "product_realignment_conformance_ref",
  "internal_pilot_programming_handoff_conformance_ref",
  "matrix_operating_programming_master_conformance_ref",
  "corporate_legal_technical_master_conformance_ref",
  "rd_master_three_level_governance_conformance_ref",
  "l3_evr_iospace_execution_boundary_refactor_conformance_ref",
  "b2g_level2_forensic_evidence_verifier_qualification_hardening_conformance_ref",
  "b2b_level1_joker_c2_layer_matrix_conformance_ref",
  "ipr_documento_inquadramento_tecnico_imprenditoriale_conformance_ref",
  "ipr_onboarding_app_conformance_ref",
  "platform_core_server_to_server_integration_conformance_ref",
  "access_status_endpoints_conformance_ref",
  "deny_state_test_matrix_conformance_ref",
  "allow_state_test_matrix_conformance_ref",
  "endpoint_authentication_conformance_ref",
  "endpoint_authorization_conformance_ref",
  "endpoint_policy_enforcement_conformance_ref",
  "endpoint_decision_logging_ref",
  "decision_log_record_schema_ref",
  "decision_id_binding_ref",
  "decision_time_binding_ref",
  "decision_actor_binding_ref",
  "decision_subject_binding_ref",
  "decision_action_binding_ref",
  "decision_resource_binding_ref",
  "decision_tenant_binding_ref",
  "decision_policy_version_binding_ref",
  "decision_policy_hash_binding_ref",
  "decision_input_hash_binding_ref",
  "decision_output_hash_binding_ref",
  "decision_result_binding_ref",
  "decision_reason_code_binding_ref",
  "decision_denial_reason_binding_ref",
  "decision_allow_reason_binding_ref",
  "decision_unknown_reason_binding_ref",
  "decision_obligation_binding_ref",
  "decision_constraint_binding_ref",
  "decision_correlation_id_binding_ref",
  "request_correlation_id_binding_ref",
  "trace_correlation_id_binding_ref",
  "opc_correlation_id_binding_ref",
  "audit_correlation_id_binding_ref",
  "evidence_correlation_id_binding_ref",
  "log_append_only_boundary_ref",
  "log_canonicalization_boundary_ref",
  "log_hash_chain_boundary_ref",
  "log_signature_boundary_ref",
  "log_timestamp_boundary_ref",
  "log_redaction_boundary_ref",
  "log_retention_boundary_ref",
  "log_replay_detection_boundary_ref",
  "log_tamper_detection_boundary_ref",
  "log_query_boundary_ref",
  "log_export_boundary_ref",
  "log_privacy_boundary_ref",
  "log_access_control_boundary_ref",
  "error_contract_ref",
  "audit_event_ref",
  "opc_event_ref",
  "evidence_event_ref",
  "decision_logging_matrix_effective_state_update_ref",
  "fixture_boundary_ref",
  "mock_boundary_ref",
  "adapter_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "customer_access_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_decision_logging_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_endpoint_decision_logging_conformance_fields) || !d.required_endpoint_decision_logging_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const loggingFalseClaims = [
  "endpoint_decision_logging_created",
  "endpoint_decision_logging_validated",
  "endpoint_decision_logging_finalized",
  "endpoint_decision_logging_record_schema_validated",
  "endpoint_decision_logging_decision_id_binding_validated",
  "endpoint_decision_logging_decision_time_binding_validated",
  "endpoint_decision_logging_decision_actor_binding_validated",
  "endpoint_decision_logging_decision_subject_binding_validated",
  "endpoint_decision_logging_decision_action_binding_validated",
  "endpoint_decision_logging_decision_resource_binding_validated",
  "endpoint_decision_logging_decision_tenant_binding_validated",
  "endpoint_decision_logging_policy_version_binding_validated",
  "endpoint_decision_logging_policy_hash_binding_validated",
  "endpoint_decision_logging_input_hash_binding_validated",
  "endpoint_decision_logging_output_hash_binding_validated",
  "endpoint_decision_logging_result_binding_validated",
  "endpoint_decision_logging_reason_code_binding_validated",
  "endpoint_decision_logging_denial_reason_binding_validated",
  "endpoint_decision_logging_allow_reason_binding_validated",
  "endpoint_decision_logging_unknown_reason_binding_validated",
  "endpoint_decision_logging_obligation_binding_validated",
  "endpoint_decision_logging_constraint_binding_validated",
  "endpoint_decision_logging_decision_correlation_id_binding_validated",
  "endpoint_decision_logging_request_correlation_id_binding_validated",
  "endpoint_decision_logging_trace_correlation_id_binding_validated",
  "endpoint_decision_logging_opc_correlation_id_binding_validated",
  "endpoint_decision_logging_audit_correlation_id_binding_validated",
  "endpoint_decision_logging_evidence_correlation_id_binding_validated",
  "endpoint_decision_logging_append_only_boundary_validated",
  "endpoint_decision_logging_canonicalization_boundary_validated",
  "endpoint_decision_logging_hash_chain_boundary_validated",
  "endpoint_decision_logging_signature_boundary_validated",
  "endpoint_decision_logging_timestamp_boundary_validated",
  "endpoint_decision_logging_redaction_boundary_validated",
  "endpoint_decision_logging_retention_boundary_validated",
  "endpoint_decision_logging_replay_detection_boundary_validated",
  "endpoint_decision_logging_tamper_detection_boundary_validated",
  "endpoint_decision_logging_query_boundary_validated",
  "endpoint_decision_logging_export_boundary_validated",
  "endpoint_decision_logging_privacy_boundary_validated",
  "endpoint_decision_logging_access_control_boundary_validated",
  "endpoint_decision_logging_error_contract_validated",
  "endpoint_decision_logging_audit_event_model_validated",
  "endpoint_decision_logging_opc_event_model_validated",
  "endpoint_decision_logging_evidence_event_model_validated",
  "endpoint_decision_logging_matrix_effective_state_update_validated",
  "endpoint_decision_logging_fixture_boundary_validated",
  "endpoint_decision_logging_mock_boundary_validated",
  "endpoint_decision_logging_adapter_boundary_validated",
  "endpoint_decision_logging_runtime_boundary_validated",
  "endpoint_decision_logging_production_boundary_validated",
  "endpoint_decision_logging_customer_access_boundary_validated",
  "endpoint_decision_logging_legal_certification_boundary_validated",
  "endpoint_decision_logging_positive_test_passed",
  "endpoint_decision_logging_negative_test_passed",
  "endpoint_decision_logging_log_created_test_passed",
  "endpoint_decision_logging_append_only_test_passed",
  "endpoint_decision_logging_hash_chain_test_passed",
  "endpoint_decision_logging_signature_test_passed",
  "endpoint_decision_logging_timestamp_test_passed",
  "endpoint_decision_logging_redaction_test_passed",
  "endpoint_decision_logging_retention_test_passed",
  "endpoint_decision_logging_replay_detection_test_passed",
  "endpoint_decision_logging_tamper_detection_test_passed",
  "endpoint_decision_logging_correlation_complete_test_passed",
  "endpoint_decision_logging_decision_logged",
  "endpoint_decision_logging_log_persisted",
  "endpoint_decision_logging_log_hash_chained",
  "endpoint_decision_logging_log_signed",
  "endpoint_decision_logging_log_timestamped",
  "endpoint_decision_logging_log_exported",
  "endpoint_decision_logging_opc_event_emitted",
  "endpoint_decision_logging_audit_event_created",
  "endpoint_decision_logging_evidence_event_created",
  "endpoint_decision_logging_ready",
  "endpoint_decision_logging_success",
  "endpoint_decision_logging_production_ready",
  "endpoint_decision_logging_customer_ready",
  "endpoint_decision_logging_legal_certification_created"
];

for (const key of loggingFalseClaims) {
  if (d[key] !== false) {
    fail(`DECISION_LOGGING_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "endpoint_policy_enforcement_validated",
  "endpoint_policy_enforcement_decision_allow_enforced",
  "endpoint_policy_enforcement_decision_deny_enforced",
  "endpoint_policy_enforcement_decision_logged",
  "endpoint_authorization_validated",
  "endpoint_authorization_access_allow_enforced",
  "endpoint_authorization_access_deny_enforced",
  "endpoint_authentication_validated",
  "endpoint_authentication_success_enforced",
  "allow_state_test_matrix_validated",
  "allow_state_access_granted_enforced",
  "deny_state_test_matrix_validated",
  "deny_state_access_denied_enforced",
  "access_status_endpoints_validated",
  "access_status_endpoints_access_granted",
  "platform_core_s2s_integration_validated",
  "ipr_onboarding_app_validated",
  "legal_certification_created",
  "execution_completed"
];

for (const key of inheritedCriticalFalseClaims) {
  if (d[key] !== false) {
    fail(`INHERITED_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const requiredNonClaimEntries = [
  "no_endpoint_decision_logging_created_claim",
  "no_endpoint_decision_logging_validated_claim",
  "no_endpoint_decision_logging_record_schema_validated_claim",
  "no_endpoint_decision_logging_decision_id_binding_validated_claim",
  "no_endpoint_decision_logging_hash_chain_boundary_validated_claim",
  "no_endpoint_decision_logging_signature_boundary_validated_claim",
  "no_endpoint_decision_logging_decision_logged_claim",
  "no_endpoint_decision_logging_log_persisted_claim",
  "no_endpoint_decision_logging_log_hash_chained_claim",
  "no_endpoint_decision_logging_log_signed_claim",
  "no_endpoint_decision_logging_ready_claim",
  "no_endpoint_decision_logging_success_claim",
  "no_endpoint_decision_logging_production_ready_claim",
  "no_endpoint_decision_logging_customer_ready_claim",
  "no_endpoint_decision_logging_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "endpoint_decision_logging_created_false",
  "endpoint_decision_logging_validated_false",
  "endpoint_decision_logging_record_schema_validated_false",
  "endpoint_decision_logging_decision_id_binding_validated_false",
  "endpoint_decision_logging_hash_chain_boundary_validated_false",
  "endpoint_decision_logging_signature_boundary_validated_false",
  "endpoint_decision_logging_decision_logged_false",
  "endpoint_decision_logging_log_persisted_false",
  "endpoint_decision_logging_log_hash_chained_false",
  "endpoint_decision_logging_log_signed_false",
  "endpoint_decision_logging_ready_false",
  "endpoint_decision_logging_success_false",
  "endpoint_decision_logging_production_ready_false",
  "endpoint_decision_logging_customer_ready_false",
  "endpoint_decision_logging_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

if (falseClaimCount !== 937) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=937 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_decision_logging_conformance_field_count: d.required_endpoint_decision_logging_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_decision_logging_created: d.endpoint_decision_logging_created,
  endpoint_decision_logging_validated: d.endpoint_decision_logging_validated,
  endpoint_decision_logging_decision_logged: d.endpoint_decision_logging_decision_logged,
  endpoint_decision_logging_log_persisted: d.endpoint_decision_logging_log_persisted,
  endpoint_decision_logging_log_hash_chained: d.endpoint_decision_logging_log_hash_chained,
  endpoint_decision_logging_log_signed: d.endpoint_decision_logging_log_signed,
  endpoint_decision_logging_ready: d.endpoint_decision_logging_ready,
  endpoint_decision_logging_success: d.endpoint_decision_logging_success,
  endpoint_decision_logging_production_ready: d.endpoint_decision_logging_production_ready,
  endpoint_decision_logging_customer_ready: d.endpoint_decision_logging_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_319_ENDPOINT_DECISION_LOGGING_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
