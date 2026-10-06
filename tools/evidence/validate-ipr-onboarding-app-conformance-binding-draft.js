#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-IPR-ONBOARDING-APP-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEIPROnboardingAppConformanceBindingDraft",
  classification: "R_AND_D_IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "IPR_ONBOARDING_APP_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_IPR_DOCUMENTO_INQUADRAMENTO_TECNICO_IMPRENDITORIALE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "65aa5bca850661dd62972e61acd8f134a799aeae",
  recommended_next_program: "PROG-312",
  recommended_next_object_id: "HBCE-PLATFORM-CORE-SERVER-TO-SERVER-INTEGRATION-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 29,
  required_ipr_onboarding_app_conformance_field_count: 61,
  binding_rule_count: 61,
  future_resolution_requirement_count: 56,
  required_non_claim_count: 418,
  required_no_execution_boundary_count: 418
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 23,
  required_ipr_onboarding_app_conformance_fields: 61,
  binding_rules: 61,
  future_resolution_requirements: 56,
  explicit_non_claims: 418,
  no_execution_boundary: 418
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
  "ipr_onboarding_app_conformance_id",
  "ipr_onboarding_app_conformance_version",
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
  "onboarding_app_ref",
  "repository_ref",
  "deployment_ref",
  "identity_ingress_ref",
  "platform_core_integration_ref",
  "server_to_server_binding_ref",
  "access_joker_c2_endpoint_ref",
  "certificate_status_endpoint_ref",
  "ipr_card_status_endpoint_ref",
  "ipr_verify_endpoint_ref",
  "onboarding_start_endpoint_ref",
  "onboarding_review_endpoint_ref",
  "opc_proof_endpoint_ref",
  "revocation_endpoint_ref",
  "events_endpoint_ref",
  "ipr_status_model_ref",
  "ipr_card_status_model_ref",
  "certificate_status_model_ref",
  "deny_state_test_matrix_ref",
  "allow_state_test_matrix_ref",
  "status_transition_model_ref",
  "audit_event_model_ref",
  "opc_proof_model_ref",
  "revocation_model_ref",
  "error_contract_ref",
  "idempotency_contract_ref",
  "privacy_boundary_ref",
  "security_boundary_ref",
  "data_retention_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "app_release_boundary_ref",
  "customer_access_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "ipr_onboarding_app_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_ipr_onboarding_app_conformance_fields) || !d.required_ipr_onboarding_app_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const onboardingFalseClaims = [
  "ipr_onboarding_app_created",
  "ipr_onboarding_app_validated",
  "ipr_onboarding_app_finalized",
  "ipr_onboarding_app_repository_validated",
  "ipr_onboarding_app_deployment_validated",
  "ipr_onboarding_app_identity_ingress_validated",
  "ipr_onboarding_app_platform_core_integration_validated",
  "ipr_onboarding_app_server_to_server_binding_validated",
  "ipr_onboarding_app_access_joker_c2_endpoint_validated",
  "ipr_onboarding_app_certificate_status_endpoint_validated",
  "ipr_onboarding_app_ipr_card_status_endpoint_validated",
  "ipr_onboarding_app_ipr_verify_endpoint_validated",
  "ipr_onboarding_app_onboarding_start_endpoint_validated",
  "ipr_onboarding_app_onboarding_review_endpoint_validated",
  "ipr_onboarding_app_opc_proof_endpoint_validated",
  "ipr_onboarding_app_revocation_endpoint_validated",
  "ipr_onboarding_app_events_endpoint_validated",
  "ipr_onboarding_app_ipr_status_model_validated",
  "ipr_onboarding_app_ipr_card_status_model_validated",
  "ipr_onboarding_app_certificate_status_model_validated",
  "ipr_onboarding_app_deny_state_test_matrix_completed",
  "ipr_onboarding_app_allow_state_test_matrix_completed",
  "ipr_onboarding_app_status_transition_model_validated",
  "ipr_onboarding_app_audit_event_model_validated",
  "ipr_onboarding_app_opc_proof_model_validated",
  "ipr_onboarding_app_revocation_model_validated",
  "ipr_onboarding_app_error_contract_validated",
  "ipr_onboarding_app_idempotency_contract_validated",
  "ipr_onboarding_app_privacy_boundary_validated",
  "ipr_onboarding_app_security_boundary_validated",
  "ipr_onboarding_app_data_retention_boundary_validated",
  "ipr_onboarding_app_runtime_boundary_validated",
  "ipr_onboarding_app_production_boundary_validated",
  "ipr_onboarding_app_release_boundary_validated",
  "ipr_onboarding_app_customer_access_boundary_validated",
  "ipr_onboarding_app_legal_certification_boundary_validated",
  "ipr_onboarding_app_verified_status_enforced",
  "ipr_onboarding_app_pending_status_denied",
  "ipr_onboarding_app_rejected_status_denied",
  "ipr_onboarding_app_revoked_status_denied",
  "ipr_onboarding_app_suspended_status_denied",
  "ipr_onboarding_app_expired_status_denied",
  "ipr_onboarding_app_ipr_card_issued_enforced",
  "ipr_onboarding_app_certificate_active_enforced",
  "ipr_onboarding_app_access_granted",
  "ipr_onboarding_app_access_denied_validated",
  "ipr_onboarding_app_opc_event_emitted",
  "ipr_onboarding_app_audit_trace_created",
  "ipr_onboarding_app_evidence_package_created",
  "ipr_onboarding_app_integration_test_passed",
  "ipr_onboarding_app_regression_test_passed",
  "ipr_onboarding_app_ready",
  "ipr_onboarding_app_success",
  "ipr_onboarding_app_production_ready",
  "ipr_onboarding_app_customer_ready",
  "ipr_onboarding_app_legal_certification_created"
];

for (const key of onboardingFalseClaims) {
  if (d[key] !== false) {
    fail(`ONBOARDING_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
  "ipr_documento_inquadramento_tecnico_imprenditoriale_validated",
  "ipr_legal_validity",
  "company_created",
  "b2b_level1_success",
  "product_ready_for_market",
  "legal_certification_created",
  "execution_completed"
];

for (const key of inheritedCriticalFalseClaims) {
  if (d[key] !== false) {
    fail(`INHERITED_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const requiredNonClaimEntries = [
  "no_ipr_onboarding_app_created_claim",
  "no_ipr_onboarding_app_validated_claim",
  "no_ipr_onboarding_app_identity_ingress_validated_claim",
  "no_ipr_onboarding_app_platform_core_integration_validated_claim",
  "no_ipr_onboarding_app_server_to_server_binding_validated_claim",
  "no_ipr_onboarding_app_access_joker_c2_endpoint_validated_claim",
  "no_ipr_onboarding_app_deny_state_test_matrix_completed_claim",
  "no_ipr_onboarding_app_access_granted_claim",
  "no_ipr_onboarding_app_ready_claim",
  "no_ipr_onboarding_app_success_claim",
  "no_ipr_onboarding_app_production_ready_claim",
  "no_ipr_onboarding_app_customer_ready_claim",
  "no_ipr_onboarding_app_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "ipr_onboarding_app_created_false",
  "ipr_onboarding_app_validated_false",
  "ipr_onboarding_app_identity_ingress_validated_false",
  "ipr_onboarding_app_platform_core_integration_validated_false",
  "ipr_onboarding_app_server_to_server_binding_validated_false",
  "ipr_onboarding_app_access_joker_c2_endpoint_validated_false",
  "ipr_onboarding_app_deny_state_test_matrix_completed_false",
  "ipr_onboarding_app_access_granted_false",
  "ipr_onboarding_app_ready_false",
  "ipr_onboarding_app_success_false",
  "ipr_onboarding_app_production_ready_false",
  "ipr_onboarding_app_customer_ready_false",
  "ipr_onboarding_app_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
if (falseClaimCount !== 418) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=418 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_ipr_onboarding_app_conformance_field_count: d.required_ipr_onboarding_app_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  ipr_onboarding_app_created: d.ipr_onboarding_app_created,
  ipr_onboarding_app_validated: d.ipr_onboarding_app_validated,
  ipr_onboarding_app_identity_ingress_validated: d.ipr_onboarding_app_identity_ingress_validated,
  ipr_onboarding_app_platform_core_integration_validated: d.ipr_onboarding_app_platform_core_integration_validated,
  ipr_onboarding_app_server_to_server_binding_validated: d.ipr_onboarding_app_server_to_server_binding_validated,
  ipr_onboarding_app_access_joker_c2_endpoint_validated: d.ipr_onboarding_app_access_joker_c2_endpoint_validated,
  ipr_onboarding_app_deny_state_test_matrix_completed: d.ipr_onboarding_app_deny_state_test_matrix_completed,
  ipr_onboarding_app_access_granted: d.ipr_onboarding_app_access_granted,
  ipr_onboarding_app_ready: d.ipr_onboarding_app_ready,
  ipr_onboarding_app_success: d.ipr_onboarding_app_success,
  ipr_onboarding_app_production_ready: d.ipr_onboarding_app_production_ready,
  ipr_onboarding_app_customer_ready: d.ipr_onboarding_app_customer_ready,
  ipr_onboarding_app_legal_certification_created: d.ipr_onboarding_app_legal_certification_created,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT" : "FAIL_IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_311_IPR_ONBOARDING_APP_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
