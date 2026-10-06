#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-ACCESS-STATUS-ENDPOINTS-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEAccessStatusEndpointsConformanceBindingDraft",
  classification: "R_AND_D_ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_PLATFORM_CORE_SERVER_TO_SERVER_INTEGRATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "27e2bc415d1b98f3b9eba31ae67d2b3a87e365ae",
  recommended_next_program: "PROG-314",
  recommended_next_object_id: "HBCE-DENY-STATE-TEST-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 31,
  required_access_status_endpoints_conformance_field_count: 68,
  binding_rule_count: 68,
  future_resolution_requirement_count: 63,
  required_non_claim_count: 546,
  required_no_execution_boundary_count: 546
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 25,
  required_access_status_endpoints_conformance_fields: 68,
  binding_rules: 68,
  future_resolution_requirements: 63,
  explicit_non_claims: 546,
  no_execution_boundary: 546
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
  "access_status_endpoints_conformance_id",
  "access_status_endpoints_conformance_version",
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
  "access_status_endpoints_ref",
  "access_joker_c2_endpoint_ref",
  "certificate_status_endpoint_ref",
  "ipr_card_status_endpoint_ref",
  "ipr_verify_endpoint_ref",
  "access_request_schema_ref",
  "access_response_schema_ref",
  "certificate_status_response_schema_ref",
  "ipr_card_status_response_schema_ref",
  "ipr_verify_response_schema_ref",
  "ipr_status_model_ref",
  "ipr_card_status_model_ref",
  "certificate_status_model_ref",
  "verified_status_rule_ref",
  "pending_status_rule_ref",
  "rejected_status_rule_ref",
  "revoked_status_rule_ref",
  "suspended_status_rule_ref",
  "expired_status_rule_ref",
  "card_issued_rule_ref",
  "certificate_active_rule_ref",
  "deny_state_rule_ref",
  "allow_state_rule_ref",
  "endpoint_authentication_ref",
  "endpoint_authorization_ref",
  "request_signature_ref",
  "response_signature_ref",
  "error_contract_ref",
  "audit_event_ref",
  "opc_event_ref",
  "rate_limit_ref",
  "privacy_boundary_ref",
  "security_boundary_ref",
  "data_minimization_boundary_ref",
  "retention_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "customer_access_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "access_status_endpoints_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_access_status_endpoints_conformance_fields) || !d.required_access_status_endpoints_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const endpointFalseClaims = [
  "access_status_endpoints_created",
  "access_status_endpoints_validated",
  "access_status_endpoints_finalized",
  "access_status_endpoints_access_joker_c2_endpoint_validated",
  "access_status_endpoints_certificate_status_endpoint_validated",
  "access_status_endpoints_ipr_card_status_endpoint_validated",
  "access_status_endpoints_ipr_verify_endpoint_validated",
  "access_status_endpoints_access_request_schema_validated",
  "access_status_endpoints_access_response_schema_validated",
  "access_status_endpoints_certificate_status_response_schema_validated",
  "access_status_endpoints_ipr_card_status_response_schema_validated",
  "access_status_endpoints_ipr_verify_response_schema_validated",
  "access_status_endpoints_ipr_status_model_validated",
  "access_status_endpoints_ipr_card_status_model_validated",
  "access_status_endpoints_certificate_status_model_validated",
  "access_status_endpoints_verified_status_rule_validated",
  "access_status_endpoints_pending_status_rule_validated",
  "access_status_endpoints_rejected_status_rule_validated",
  "access_status_endpoints_revoked_status_rule_validated",
  "access_status_endpoints_suspended_status_rule_validated",
  "access_status_endpoints_expired_status_rule_validated",
  "access_status_endpoints_card_issued_rule_validated",
  "access_status_endpoints_certificate_active_rule_validated",
  "access_status_endpoints_deny_state_rule_validated",
  "access_status_endpoints_allow_state_rule_validated",
  "access_status_endpoints_endpoint_authentication_validated",
  "access_status_endpoints_endpoint_authorization_validated",
  "access_status_endpoints_request_signature_validated",
  "access_status_endpoints_response_signature_validated",
  "access_status_endpoints_error_contract_validated",
  "access_status_endpoints_audit_event_model_validated",
  "access_status_endpoints_opc_event_model_validated",
  "access_status_endpoints_rate_limit_validated",
  "access_status_endpoints_privacy_boundary_validated",
  "access_status_endpoints_security_boundary_validated",
  "access_status_endpoints_data_minimization_boundary_validated",
  "access_status_endpoints_retention_boundary_validated",
  "access_status_endpoints_runtime_boundary_validated",
  "access_status_endpoints_production_boundary_validated",
  "access_status_endpoints_customer_access_boundary_validated",
  "access_status_endpoints_legal_certification_boundary_validated",
  "access_status_endpoints_access_joker_c2_endpoint_test_passed",
  "access_status_endpoints_certificate_status_endpoint_test_passed",
  "access_status_endpoints_ipr_card_status_endpoint_test_passed",
  "access_status_endpoints_ipr_verify_endpoint_test_passed",
  "access_status_endpoints_verified_status_enforced",
  "access_status_endpoints_pending_status_denied",
  "access_status_endpoints_rejected_status_denied",
  "access_status_endpoints_revoked_status_denied",
  "access_status_endpoints_suspended_status_denied",
  "access_status_endpoints_expired_status_denied",
  "access_status_endpoints_card_issued_required",
  "access_status_endpoints_certificate_active_required",
  "access_status_endpoints_access_granted",
  "access_status_endpoints_access_denied_validated",
  "access_status_endpoints_opc_event_emitted",
  "access_status_endpoints_audit_event_created",
  "access_status_endpoints_evidence_event_created",
  "access_status_endpoints_ready",
  "access_status_endpoints_success",
  "access_status_endpoints_production_ready",
  "access_status_endpoints_customer_ready",
  "access_status_endpoints_legal_certification_created"
];

for (const key of endpointFalseClaims) {
  if (d[key] !== false) {
    fail(`ENDPOINT_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "platform_core_s2s_integration_validated",
  "platform_core_s2s_success",
  "ipr_onboarding_app_validated",
  "ipr_onboarding_app_access_granted",
  "legal_certification_created",
  "execution_completed"
];

for (const key of inheritedCriticalFalseClaims) {
  if (d[key] !== false) {
    fail(`INHERITED_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const requiredNonClaimEntries = [
  "no_access_status_endpoints_created_claim",
  "no_access_status_endpoints_validated_claim",
  "no_access_status_endpoints_access_joker_c2_endpoint_validated_claim",
  "no_access_status_endpoints_certificate_status_endpoint_validated_claim",
  "no_access_status_endpoints_ipr_card_status_endpoint_validated_claim",
  "no_access_status_endpoints_ipr_verify_endpoint_validated_claim",
  "no_access_status_endpoints_verified_status_enforced_claim",
  "no_access_status_endpoints_access_granted_claim",
  "no_access_status_endpoints_access_denied_validated_claim",
  "no_access_status_endpoints_ready_claim",
  "no_access_status_endpoints_success_claim",
  "no_access_status_endpoints_production_ready_claim",
  "no_access_status_endpoints_customer_ready_claim",
  "no_access_status_endpoints_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "access_status_endpoints_created_false",
  "access_status_endpoints_validated_false",
  "access_status_endpoints_access_joker_c2_endpoint_validated_false",
  "access_status_endpoints_certificate_status_endpoint_validated_false",
  "access_status_endpoints_ipr_card_status_endpoint_validated_false",
  "access_status_endpoints_ipr_verify_endpoint_validated_false",
  "access_status_endpoints_verified_status_enforced_false",
  "access_status_endpoints_access_granted_false",
  "access_status_endpoints_access_denied_validated_false",
  "access_status_endpoints_ready_false",
  "access_status_endpoints_success_false",
  "access_status_endpoints_production_ready_false",
  "access_status_endpoints_customer_ready_false",
  "access_status_endpoints_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

if (falseClaimCount !== 546) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=546 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_access_status_endpoints_conformance_field_count: d.required_access_status_endpoints_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  access_status_endpoints_created: d.access_status_endpoints_created,
  access_status_endpoints_validated: d.access_status_endpoints_validated,
  access_status_endpoints_access_joker_c2_endpoint_validated: d.access_status_endpoints_access_joker_c2_endpoint_validated,
  access_status_endpoints_certificate_status_endpoint_validated: d.access_status_endpoints_certificate_status_endpoint_validated,
  access_status_endpoints_ipr_card_status_endpoint_validated: d.access_status_endpoints_ipr_card_status_endpoint_validated,
  access_status_endpoints_ipr_verify_endpoint_validated: d.access_status_endpoints_ipr_verify_endpoint_validated,
  access_status_endpoints_verified_status_enforced: d.access_status_endpoints_verified_status_enforced,
  access_status_endpoints_access_granted: d.access_status_endpoints_access_granted,
  access_status_endpoints_ready: d.access_status_endpoints_ready,
  access_status_endpoints_success: d.access_status_endpoints_success,
  access_status_endpoints_production_ready: d.access_status_endpoints_production_ready,
  access_status_endpoints_customer_ready: d.access_status_endpoints_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT" : "FAIL_ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_313_ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
