#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT_v001.json";

let ok = true;
let d = null;

function fail(message) {
  console.log(message);
  ok = false;
}

function check(name, actual, expected) {
  if (actual !== expected) {
    fail(`MISMATCH ${name}: expected=${expected} actual=${actual}`);
  }
}

try {
  d = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (err) {
  fail(`JSON_READ_OR_PARSE_FAIL ${err.message}`);
  d = {};
}

const exact = {
  object_id: "HBCE-ENDPOINT-OPC-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEEndpointOpcEventConformanceBindingDraft",
  classification: "R_AND_D_ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_ENDPOINT_AUDIT_EVENT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "1d867b085d8ff67e18a151cd1e965bcd199a7e1e",
  recommended_next_program: "PROG-322",
  recommended_next_object_id: "HBCE-ENDPOINT-EVIDENCE-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  check(key, d[key], expected);
}

const counts = {
  source_chain_entry_count: 39,
  required_endpoint_opc_event_conformance_field_count: 91,
  binding_rule_count: 91,
  future_resolution_requirement_count: 88,
  required_non_claim_count: 1111,
  required_no_execution_boundary_count: 1111
};

for (const [key, expected] of Object.entries(counts)) {
  check(key, d[key], expected);
}

const arrays = {
  basis: 33,
  required_endpoint_opc_event_conformance_fields: 91,
  binding_rules: 91,
  future_resolution_requirements: 88,
  explicit_non_claims: 1111,
  no_execution_boundary: 1111
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
  "HBCE-ENDPOINT-AUDIT-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-DECISION-LOGGING-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-POLICY-ENFORCEMENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHORIZATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHENTICATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ALLOW-STATE-TEST-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-DENY-STATE-TEST-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ACCESS-STATUS-ENDPOINTS-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-PLATFORM-CORE-SERVER-TO-SERVER-INTEGRATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-IPR-ONBOARDING-APP-CONFORMANCE-BINDING-DRAFT-V001",
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
  "endpoint_opc_event_conformance_id",
  "endpoint_opc_event_conformance_version",
  "endpoint_audit_event_conformance_ref",
  "endpoint_opc_event_ref",
  "opc_event_record_schema_ref",
  "opc_event_id_binding_ref",
  "opc_event_time_binding_ref",
  "opc_event_type_binding_ref",
  "opc_event_category_binding_ref",
  "opc_event_severity_binding_ref",
  "opc_event_actor_binding_ref",
  "opc_event_subject_binding_ref",
  "opc_event_action_binding_ref",
  "opc_event_resource_binding_ref",
  "opc_event_tenant_binding_ref",
  "opc_event_decision_id_binding_ref",
  "opc_event_audit_event_id_binding_ref",
  "opc_event_policy_hash_binding_ref",
  "opc_event_request_hash_binding_ref",
  "opc_event_response_hash_binding_ref",
  "opc_event_result_binding_ref",
  "opc_event_reason_code_binding_ref",
  "opc_event_correlation_id_binding_ref",
  "opc_event_trace_id_binding_ref",
  "opc_event_session_id_binding_ref",
  "opc_event_channel_ref",
  "opc_event_topic_ref",
  "opc_event_publisher_ref",
  "opc_event_subscriber_ref",
  "opc_event_delivery_mode_ref",
  "opc_event_acknowledgement_boundary_ref",
  "opc_event_retry_boundary_ref",
  "opc_event_ordering_boundary_ref",
  "opc_event_deduplication_boundary_ref",
  "opc_event_replay_detection_boundary_ref",
  "opc_event_tamper_detection_boundary_ref",
  "opc_event_integrity_hash_binding_ref",
  "opc_event_canonicalization_boundary_ref",
  "opc_event_signature_boundary_ref",
  "opc_event_timestamp_boundary_ref",
  "opc_event_retention_boundary_ref",
  "opc_event_redaction_boundary_ref",
  "opc_event_privacy_boundary_ref",
  "opc_event_access_control_boundary_ref",
  "opc_event_query_boundary_ref",
  "opc_event_export_boundary_ref",
  "opc_event_evidence_bridge_ref",
  "opc_event_matrix_effective_state_update_ref",
  "source_document_boundary_statement",
  "endpoint_opc_event_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_endpoint_opc_event_conformance_fields) || !d.required_endpoint_opc_event_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const opcFalseClaims = [
  "endpoint_opc_event_created",
  "endpoint_opc_event_validated",
  "endpoint_opc_event_finalized",
  "endpoint_opc_event_record_schema_validated",
  "endpoint_opc_event_id_binding_validated",
  "endpoint_opc_event_time_binding_validated",
  "endpoint_opc_event_type_binding_validated",
  "endpoint_opc_event_category_binding_validated",
  "endpoint_opc_event_severity_binding_validated",
  "endpoint_opc_event_actor_binding_validated",
  "endpoint_opc_event_subject_binding_validated",
  "endpoint_opc_event_action_binding_validated",
  "endpoint_opc_event_resource_binding_validated",
  "endpoint_opc_event_tenant_binding_validated",
  "endpoint_opc_event_decision_id_binding_validated",
  "endpoint_opc_event_audit_event_id_binding_validated",
  "endpoint_opc_event_policy_hash_binding_validated",
  "endpoint_opc_event_request_hash_binding_validated",
  "endpoint_opc_event_response_hash_binding_validated",
  "endpoint_opc_event_result_binding_validated",
  "endpoint_opc_event_reason_code_binding_validated",
  "endpoint_opc_event_correlation_id_binding_validated",
  "endpoint_opc_event_trace_id_binding_validated",
  "endpoint_opc_event_session_id_binding_validated",
  "endpoint_opc_event_channel_validated",
  "endpoint_opc_event_topic_validated",
  "endpoint_opc_event_publisher_validated",
  "endpoint_opc_event_subscriber_validated",
  "endpoint_opc_event_delivery_mode_validated",
  "endpoint_opc_event_acknowledgement_boundary_validated",
  "endpoint_opc_event_retry_boundary_validated",
  "endpoint_opc_event_ordering_boundary_validated",
  "endpoint_opc_event_deduplication_boundary_validated",
  "endpoint_opc_event_replay_detection_boundary_validated",
  "endpoint_opc_event_tamper_detection_boundary_validated",
  "endpoint_opc_event_integrity_hash_binding_validated",
  "endpoint_opc_event_canonicalization_boundary_validated",
  "endpoint_opc_event_signature_boundary_validated",
  "endpoint_opc_event_timestamp_boundary_validated",
  "endpoint_opc_event_retention_boundary_validated",
  "endpoint_opc_event_redaction_boundary_validated",
  "endpoint_opc_event_privacy_boundary_validated",
  "endpoint_opc_event_access_control_boundary_validated",
  "endpoint_opc_event_query_boundary_validated",
  "endpoint_opc_event_export_boundary_validated",
  "endpoint_opc_event_evidence_bridge_validated",
  "endpoint_opc_event_matrix_effective_state_update_validated",
  "endpoint_opc_event_fixture_boundary_validated",
  "endpoint_opc_event_mock_boundary_validated",
  "endpoint_opc_event_adapter_boundary_validated",
  "endpoint_opc_event_runtime_boundary_validated",
  "endpoint_opc_event_production_boundary_validated",
  "endpoint_opc_event_customer_access_boundary_validated",
  "endpoint_opc_event_legal_certification_boundary_validated",
  "endpoint_opc_event_positive_test_passed",
  "endpoint_opc_event_negative_test_passed",
  "endpoint_opc_event_created_test_passed",
  "endpoint_opc_event_schema_validation_test_passed",
  "endpoint_opc_event_correlation_test_passed",
  "endpoint_opc_event_channel_test_passed",
  "endpoint_opc_event_topic_test_passed",
  "endpoint_opc_event_publish_test_passed",
  "endpoint_opc_event_subscribe_test_passed",
  "endpoint_opc_event_acknowledgement_test_passed",
  "endpoint_opc_event_retry_test_passed",
  "endpoint_opc_event_ordering_test_passed",
  "endpoint_opc_event_deduplication_test_passed",
  "endpoint_opc_event_replay_detection_test_passed",
  "endpoint_opc_event_tamper_detection_test_passed",
  "endpoint_opc_event_signature_test_passed",
  "endpoint_opc_event_timestamp_test_passed",
  "endpoint_opc_event_export_test_passed",
  "endpoint_opc_event_emitted",
  "endpoint_opc_event_published",
  "endpoint_opc_event_delivered",
  "endpoint_opc_event_acknowledged",
  "endpoint_opc_event_persisted",
  "endpoint_opc_event_hash_bound",
  "endpoint_opc_event_signed",
  "endpoint_opc_event_timestamped",
  "endpoint_opc_event_exported",
  "endpoint_opc_event_evidence_bridge_emitted",
  "endpoint_opc_event_matrix_effective_state_updated",
  "endpoint_opc_event_ready",
  "endpoint_opc_event_success",
  "endpoint_opc_event_production_ready",
  "endpoint_opc_event_customer_ready",
  "endpoint_opc_event_legal_certification_created"
];

for (const key of opcFalseClaims) {
  check(key, d[key], false);
}

const inheritedCriticalFalseClaims = [
  "endpoint_audit_event_validated",
  "endpoint_audit_event_emitted",
  "endpoint_audit_event_persisted",
  "endpoint_audit_event_hash_bound",
  "endpoint_audit_event_signed",
  "endpoint_audit_event_timestamped",
  "endpoint_audit_event_opc_bridge_emitted",
  "endpoint_audit_event_evidence_bridge_emitted",
  "endpoint_decision_logging_validated",
  "endpoint_decision_logging_decision_logged",
  "endpoint_decision_logging_log_persisted",
  "endpoint_decision_logging_log_hash_chained",
  "endpoint_decision_logging_log_signed",
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
  check(key, d[key], false);
}

const requiredNonClaimEntries = [
  "no_endpoint_opc_event_created_claim",
  "no_endpoint_opc_event_validated_claim",
  "no_endpoint_opc_event_record_schema_validated_claim",
  "no_endpoint_opc_event_id_binding_validated_claim",
  "no_endpoint_opc_event_channel_validated_claim",
  "no_endpoint_opc_event_topic_validated_claim",
  "no_endpoint_opc_event_emitted_claim",
  "no_endpoint_opc_event_published_claim",
  "no_endpoint_opc_event_delivered_claim",
  "no_endpoint_opc_event_acknowledged_claim",
  "no_endpoint_opc_event_persisted_claim",
  "no_endpoint_opc_event_hash_bound_claim",
  "no_endpoint_opc_event_signed_claim",
  "no_endpoint_opc_event_ready_claim",
  "no_endpoint_opc_event_success_claim",
  "no_endpoint_opc_event_production_ready_claim",
  "no_endpoint_opc_event_customer_ready_claim",
  "no_endpoint_opc_event_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "endpoint_opc_event_created_false",
  "endpoint_opc_event_validated_false",
  "endpoint_opc_event_record_schema_validated_false",
  "endpoint_opc_event_id_binding_validated_false",
  "endpoint_opc_event_channel_validated_false",
  "endpoint_opc_event_topic_validated_false",
  "endpoint_opc_event_emitted_false",
  "endpoint_opc_event_published_false",
  "endpoint_opc_event_delivered_false",
  "endpoint_opc_event_acknowledged_false",
  "endpoint_opc_event_persisted_false",
  "endpoint_opc_event_hash_bound_false",
  "endpoint_opc_event_signed_false",
  "endpoint_opc_event_ready_false",
  "endpoint_opc_event_success_false",
  "endpoint_opc_event_production_ready_false",
  "endpoint_opc_event_customer_ready_false",
  "endpoint_opc_event_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
check("false_claim_property_count", falseClaimCount, 1111);

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_opc_event_conformance_field_count: d.required_endpoint_opc_event_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_opc_event_created: d.endpoint_opc_event_created,
  endpoint_opc_event_validated: d.endpoint_opc_event_validated,
  endpoint_opc_event_emitted: d.endpoint_opc_event_emitted,
  endpoint_opc_event_published: d.endpoint_opc_event_published,
  endpoint_opc_event_delivered: d.endpoint_opc_event_delivered,
  endpoint_opc_event_acknowledged: d.endpoint_opc_event_acknowledged,
  endpoint_opc_event_persisted: d.endpoint_opc_event_persisted,
  endpoint_opc_event_hash_bound: d.endpoint_opc_event_hash_bound,
  endpoint_opc_event_signed: d.endpoint_opc_event_signed,
  endpoint_opc_event_ready: d.endpoint_opc_event_ready,
  endpoint_opc_event_success: d.endpoint_opc_event_success,
  endpoint_opc_event_production_ready: d.endpoint_opc_event_production_ready,
  endpoint_opc_event_customer_ready: d.endpoint_opc_event_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_321_ENDPOINT_OPC_EVENT_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
