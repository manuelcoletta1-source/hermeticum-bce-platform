#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-ENDPOINT-AUTHENTICATION-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEEndpointAuthenticationConformanceBindingDraft",
  classification: "R_AND_D_ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_ALLOW_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "d8d926d0d3a896a33148f1374845c0badd97aa6d",
  recommended_next_program: "PROG-317",
  recommended_next_object_id: "HBCE-ENDPOINT-AUTHORIZATION-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 34,
  required_endpoint_authentication_conformance_field_count: 65,
  binding_rule_count: 65,
  future_resolution_requirement_count: 59,
  required_non_claim_count: 721,
  required_no_execution_boundary_count: 721
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 28,
  required_endpoint_authentication_conformance_fields: 65,
  binding_rules: 65,
  future_resolution_requirements: 59,
  explicit_non_claims: 721,
  no_execution_boundary: 721
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
  "endpoint_authentication_conformance_id",
  "endpoint_authentication_conformance_version",
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
  "endpoint_authentication_ref",
  "authentication_request_schema_ref",
  "authentication_response_schema_ref",
  "credential_binding_ref",
  "identity_binding_ref",
  "token_binding_ref",
  "session_binding_ref",
  "request_signature_verification_ref",
  "response_signature_binding_ref",
  "nonce_ref",
  "timestamp_ref",
  "replay_protection_ref",
  "clock_skew_policy_ref",
  "issuer_trust_ref",
  "audience_binding_ref",
  "scope_binding_ref",
  "key_rotation_ref",
  "credential_revocation_check_ref",
  "mfa_boundary_ref",
  "service_to_service_auth_boundary_ref",
  "human_session_auth_boundary_ref",
  "error_contract_ref",
  "audit_event_ref",
  "opc_event_ref",
  "evidence_event_ref",
  "authentication_matrix_effective_state_update_ref",
  "fixture_boundary_ref",
  "mock_boundary_ref",
  "adapter_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "customer_access_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_authentication_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_endpoint_authentication_conformance_fields) || !d.required_endpoint_authentication_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const authFalseClaims = [
  "endpoint_authentication_created",
  "endpoint_authentication_validated",
  "endpoint_authentication_finalized",
  "endpoint_authentication_request_schema_validated",
  "endpoint_authentication_response_schema_validated",
  "endpoint_authentication_credential_binding_validated",
  "endpoint_authentication_identity_binding_validated",
  "endpoint_authentication_token_binding_validated",
  "endpoint_authentication_session_binding_validated",
  "endpoint_authentication_request_signature_verification_validated",
  "endpoint_authentication_response_signature_binding_validated",
  "endpoint_authentication_nonce_validated",
  "endpoint_authentication_timestamp_validated",
  "endpoint_authentication_replay_protection_validated",
  "endpoint_authentication_clock_skew_policy_validated",
  "endpoint_authentication_issuer_trust_validated",
  "endpoint_authentication_audience_binding_validated",
  "endpoint_authentication_scope_binding_validated",
  "endpoint_authentication_key_rotation_validated",
  "endpoint_authentication_credential_revocation_check_validated",
  "endpoint_authentication_mfa_boundary_validated",
  "endpoint_authentication_service_to_service_auth_boundary_validated",
  "endpoint_authentication_human_session_auth_boundary_validated",
  "endpoint_authentication_error_contract_validated",
  "endpoint_authentication_audit_event_model_validated",
  "endpoint_authentication_opc_event_model_validated",
  "endpoint_authentication_evidence_event_model_validated",
  "endpoint_authentication_matrix_effective_state_update_validated",
  "endpoint_authentication_fixture_boundary_validated",
  "endpoint_authentication_mock_boundary_validated",
  "endpoint_authentication_adapter_boundary_validated",
  "endpoint_authentication_runtime_boundary_validated",
  "endpoint_authentication_production_boundary_validated",
  "endpoint_authentication_customer_access_boundary_validated",
  "endpoint_authentication_legal_certification_boundary_validated",
  "endpoint_authentication_positive_test_passed",
  "endpoint_authentication_negative_test_passed",
  "endpoint_authentication_valid_credential_accepted_test_passed",
  "endpoint_authentication_invalid_credential_denied_test_passed",
  "endpoint_authentication_expired_credential_denied_test_passed",
  "endpoint_authentication_revoked_credential_denied_test_passed",
  "endpoint_authentication_missing_credential_denied_test_passed",
  "endpoint_authentication_mismatched_identity_denied_test_passed",
  "endpoint_authentication_invalid_signature_denied_test_passed",
  "endpoint_authentication_replay_attempt_denied_test_passed",
  "endpoint_authentication_wrong_audience_denied_test_passed",
  "endpoint_authentication_insufficient_scope_denied_test_passed",
  "endpoint_authentication_success_enforced",
  "endpoint_authentication_failure_enforced",
  "endpoint_authentication_access_grant_after_authentication_enforced",
  "endpoint_authentication_access_denial_after_authentication_enforced",
  "endpoint_authentication_opc_event_emitted",
  "endpoint_authentication_audit_event_created",
  "endpoint_authentication_evidence_event_created",
  "endpoint_authentication_ready",
  "endpoint_authentication_success",
  "endpoint_authentication_production_ready",
  "endpoint_authentication_customer_ready",
  "endpoint_authentication_legal_certification_created"
];

for (const key of authFalseClaims) {
  if (d[key] !== false) {
    fail(`AUTH_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
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
  "no_endpoint_authentication_created_claim",
  "no_endpoint_authentication_validated_claim",
  "no_endpoint_authentication_request_schema_validated_claim",
  "no_endpoint_authentication_response_schema_validated_claim",
  "no_endpoint_authentication_credential_binding_validated_claim",
  "no_endpoint_authentication_identity_binding_validated_claim",
  "no_endpoint_authentication_token_binding_validated_claim",
  "no_endpoint_authentication_session_binding_validated_claim",
  "no_endpoint_authentication_success_enforced_claim",
  "no_endpoint_authentication_failure_enforced_claim",
  "no_endpoint_authentication_access_grant_after_authentication_enforced_claim",
  "no_endpoint_authentication_access_denial_after_authentication_enforced_claim",
  "no_endpoint_authentication_ready_claim",
  "no_endpoint_authentication_success_claim",
  "no_endpoint_authentication_production_ready_claim",
  "no_endpoint_authentication_customer_ready_claim",
  "no_endpoint_authentication_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "endpoint_authentication_created_false",
  "endpoint_authentication_validated_false",
  "endpoint_authentication_request_schema_validated_false",
  "endpoint_authentication_response_schema_validated_false",
  "endpoint_authentication_credential_binding_validated_false",
  "endpoint_authentication_identity_binding_validated_false",
  "endpoint_authentication_token_binding_validated_false",
  "endpoint_authentication_session_binding_validated_false",
  "endpoint_authentication_success_enforced_false",
  "endpoint_authentication_failure_enforced_false",
  "endpoint_authentication_access_grant_after_authentication_enforced_false",
  "endpoint_authentication_access_denial_after_authentication_enforced_false",
  "endpoint_authentication_ready_false",
  "endpoint_authentication_success_false",
  "endpoint_authentication_production_ready_false",
  "endpoint_authentication_customer_ready_false",
  "endpoint_authentication_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

if (falseClaimCount !== 721) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=721 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_authentication_conformance_field_count: d.required_endpoint_authentication_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_authentication_created: d.endpoint_authentication_created,
  endpoint_authentication_validated: d.endpoint_authentication_validated,
  endpoint_authentication_success_enforced: d.endpoint_authentication_success_enforced,
  endpoint_authentication_failure_enforced: d.endpoint_authentication_failure_enforced,
  endpoint_authentication_access_grant_after_authentication_enforced: d.endpoint_authentication_access_grant_after_authentication_enforced,
  endpoint_authentication_access_denial_after_authentication_enforced: d.endpoint_authentication_access_denial_after_authentication_enforced,
  endpoint_authentication_ready: d.endpoint_authentication_ready,
  endpoint_authentication_success: d.endpoint_authentication_success,
  endpoint_authentication_production_ready: d.endpoint_authentication_production_ready,
  endpoint_authentication_customer_ready: d.endpoint_authentication_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_316_ENDPOINT_AUTHENTICATION_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
