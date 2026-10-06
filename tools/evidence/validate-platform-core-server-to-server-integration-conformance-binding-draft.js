#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-PLATFORM-CORE-SERVER-TO-SERVER-INTEGRATION-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEPlatformCoreServerToServerIntegrationConformanceBindingDraft",
  classification: "R_AND_D_PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "e0750d6eef767751d00c44d91e7a7eda65f3bfd7",
  recommended_next_program: "PROG-313",
  recommended_next_object_id: "HBCE-ACCESS-STATUS-ENDPOINTS-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 30,
  required_platform_core_server_to_server_integration_conformance_field_count: 68,
  binding_rule_count: 68,
  future_resolution_requirement_count: 65,
  required_non_claim_count: 483,
  required_no_execution_boundary_count: 483
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 24,
  required_platform_core_server_to_server_integration_conformance_fields: 68,
  binding_rules: 68,
  future_resolution_requirements: 65,
  explicit_non_claims: 483,
  no_execution_boundary: 483
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
  "platform_core_server_to_server_integration_conformance_id",
  "platform_core_server_to_server_integration_conformance_version",
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
  "platform_core_ref",
  "server_to_server_integration_ref",
  "onboarding_app_client_ref",
  "platform_core_service_ref",
  "internal_api_contract_ref",
  "service_authentication_ref",
  "service_authorization_ref",
  "token_exchange_ref",
  "mtls_boundary_ref",
  "api_key_boundary_ref",
  "request_signature_ref",
  "replay_protection_ref",
  "idempotency_contract_ref",
  "correlation_id_contract_ref",
  "request_id_contract_ref",
  "trace_id_contract_ref",
  "status_sync_contract_ref",
  "access_decision_contract_ref",
  "certificate_status_sync_ref",
  "ipr_card_status_sync_ref",
  "revocation_sync_ref",
  "opc_event_forwarding_ref",
  "audit_event_forwarding_ref",
  "evidence_event_forwarding_ref",
  "error_mapping_contract_ref",
  "timeout_contract_ref",
  "retry_contract_ref",
  "rate_limit_contract_ref",
  "data_minimization_boundary_ref",
  "privacy_boundary_ref",
  "security_boundary_ref",
  "retention_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "deployment_boundary_ref",
  "environment_boundary_ref",
  "secret_management_boundary_ref",
  "monitoring_boundary_ref",
  "incident_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "platform_core_server_to_server_integration_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_platform_core_server_to_server_integration_conformance_fields) || !d.required_platform_core_server_to_server_integration_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const s2sFalseClaims = [
  "platform_core_s2s_integration_created",
  "platform_core_s2s_integration_validated",
  "platform_core_s2s_integration_finalized",
  "platform_core_s2s_platform_core_ref_validated",
  "platform_core_s2s_onboarding_app_client_validated",
  "platform_core_s2s_platform_core_service_validated",
  "platform_core_s2s_internal_api_contract_validated",
  "platform_core_s2s_service_authentication_validated",
  "platform_core_s2s_service_authorization_validated",
  "platform_core_s2s_token_exchange_validated",
  "platform_core_s2s_mtls_boundary_validated",
  "platform_core_s2s_api_key_boundary_validated",
  "platform_core_s2s_request_signature_validated",
  "platform_core_s2s_replay_protection_validated",
  "platform_core_s2s_idempotency_contract_validated",
  "platform_core_s2s_correlation_id_contract_validated",
  "platform_core_s2s_request_id_contract_validated",
  "platform_core_s2s_trace_id_contract_validated",
  "platform_core_s2s_status_sync_contract_validated",
  "platform_core_s2s_access_decision_contract_validated",
  "platform_core_s2s_certificate_status_sync_validated",
  "platform_core_s2s_ipr_card_status_sync_validated",
  "platform_core_s2s_revocation_sync_validated",
  "platform_core_s2s_opc_event_forwarding_validated",
  "platform_core_s2s_audit_event_forwarding_validated",
  "platform_core_s2s_evidence_event_forwarding_validated",
  "platform_core_s2s_error_mapping_contract_validated",
  "platform_core_s2s_timeout_contract_validated",
  "platform_core_s2s_retry_contract_validated",
  "platform_core_s2s_rate_limit_contract_validated",
  "platform_core_s2s_data_minimization_boundary_validated",
  "platform_core_s2s_privacy_boundary_validated",
  "platform_core_s2s_security_boundary_validated",
  "platform_core_s2s_retention_boundary_validated",
  "platform_core_s2s_runtime_boundary_validated",
  "platform_core_s2s_production_boundary_validated",
  "platform_core_s2s_deployment_boundary_validated",
  "platform_core_s2s_environment_boundary_validated",
  "platform_core_s2s_secret_management_boundary_validated",
  "platform_core_s2s_monitoring_boundary_validated",
  "platform_core_s2s_incident_boundary_validated",
  "platform_core_s2s_legal_certification_boundary_validated",
  "platform_core_s2s_handshake_completed",
  "platform_core_s2s_healthcheck_passed",
  "platform_core_s2s_authentication_passed",
  "platform_core_s2s_authorization_passed",
  "platform_core_s2s_request_signed",
  "platform_core_s2s_response_signed",
  "platform_core_s2s_replay_denied",
  "platform_core_s2s_idempotency_enforced",
  "platform_core_s2s_status_sync_completed",
  "platform_core_s2s_access_decision_completed",
  "platform_core_s2s_revocation_sync_completed",
  "platform_core_s2s_opc_event_forwarded",
  "platform_core_s2s_audit_event_forwarded",
  "platform_core_s2s_evidence_event_forwarded",
  "platform_core_s2s_integration_test_passed",
  "platform_core_s2s_regression_test_passed",
  "platform_core_s2s_security_test_passed",
  "platform_core_s2s_privacy_test_passed",
  "platform_core_s2s_ready",
  "platform_core_s2s_success",
  "platform_core_s2s_production_ready",
  "platform_core_s2s_customer_ready",
  "platform_core_s2s_legal_certification_created"
];

for (const key of s2sFalseClaims) {
  if (d[key] !== false) {
    fail(`S2S_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "ipr_onboarding_app_validated",
  "ipr_onboarding_app_platform_core_integration_validated",
  "ipr_onboarding_app_access_granted",
  "ipr_onboarding_app_success",
  "ipr_onboarding_app_production_ready",
  "legal_certification_created",
  "execution_completed"
];

for (const key of inheritedCriticalFalseClaims) {
  if (d[key] !== false) {
    fail(`INHERITED_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const requiredNonClaimEntries = [
  "no_platform_core_s2s_integration_created_claim",
  "no_platform_core_s2s_integration_validated_claim",
  "no_platform_core_s2s_internal_api_contract_validated_claim",
  "no_platform_core_s2s_service_authentication_validated_claim",
  "no_platform_core_s2s_service_authorization_validated_claim",
  "no_platform_core_s2s_token_exchange_validated_claim",
  "no_platform_core_s2s_request_signature_validated_claim",
  "no_platform_core_s2s_replay_protection_validated_claim",
  "no_platform_core_s2s_status_sync_completed_claim",
  "no_platform_core_s2s_access_decision_completed_claim",
  "no_platform_core_s2s_revocation_sync_completed_claim",
  "no_platform_core_s2s_integration_test_passed_claim",
  "no_platform_core_s2s_ready_claim",
  "no_platform_core_s2s_success_claim",
  "no_platform_core_s2s_production_ready_claim",
  "no_platform_core_s2s_customer_ready_claim",
  "no_platform_core_s2s_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "platform_core_s2s_integration_created_false",
  "platform_core_s2s_integration_validated_false",
  "platform_core_s2s_internal_api_contract_validated_false",
  "platform_core_s2s_service_authentication_validated_false",
  "platform_core_s2s_service_authorization_validated_false",
  "platform_core_s2s_token_exchange_validated_false",
  "platform_core_s2s_request_signature_validated_false",
  "platform_core_s2s_replay_protection_validated_false",
  "platform_core_s2s_status_sync_completed_false",
  "platform_core_s2s_access_decision_completed_false",
  "platform_core_s2s_revocation_sync_completed_false",
  "platform_core_s2s_integration_test_passed_false",
  "platform_core_s2s_ready_false",
  "platform_core_s2s_success_false",
  "platform_core_s2s_production_ready_false",
  "platform_core_s2s_customer_ready_false",
  "platform_core_s2s_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

if (falseClaimCount !== 483) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=483 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_platform_core_server_to_server_integration_conformance_field_count: d.required_platform_core_server_to_server_integration_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  platform_core_s2s_integration_created: d.platform_core_s2s_integration_created,
  platform_core_s2s_integration_validated: d.platform_core_s2s_integration_validated,
  platform_core_s2s_internal_api_contract_validated: d.platform_core_s2s_internal_api_contract_validated,
  platform_core_s2s_service_authentication_validated: d.platform_core_s2s_service_authentication_validated,
  platform_core_s2s_service_authorization_validated: d.platform_core_s2s_service_authorization_validated,
  platform_core_s2s_status_sync_completed: d.platform_core_s2s_status_sync_completed,
  platform_core_s2s_access_decision_completed: d.platform_core_s2s_access_decision_completed,
  platform_core_s2s_integration_test_passed: d.platform_core_s2s_integration_test_passed,
  platform_core_s2s_ready: d.platform_core_s2s_ready,
  platform_core_s2s_success: d.platform_core_s2s_success,
  platform_core_s2s_production_ready: d.platform_core_s2s_production_ready,
  platform_core_s2s_customer_ready: d.platform_core_s2s_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT" : "FAIL_PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_312_PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
