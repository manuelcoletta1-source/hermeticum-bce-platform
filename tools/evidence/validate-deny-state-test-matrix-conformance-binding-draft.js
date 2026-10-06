#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-DENY-STATE-TEST-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEDenyStateTestMatrixConformanceBindingDraft",
  classification: "R_AND_D_DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_ACCESS_STATUS_ENDPOINTS_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "d10080174a9366710d657313bc9b11bee952d19f",
  recommended_next_program: "PROG-315",
  recommended_next_object_id: "HBCE-ALLOW-STATE-TEST-MATRIX-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 32,
  required_deny_state_test_matrix_conformance_field_count: 67,
  binding_rule_count: 67,
  future_resolution_requirement_count: 68,
  required_non_claim_count: 614,
  required_no_execution_boundary_count: 614
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 26,
  required_deny_state_test_matrix_conformance_fields: 67,
  binding_rules: 67,
  future_resolution_requirements: 68,
  explicit_non_claims: 614,
  no_execution_boundary: 614
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
  "deny_state_test_matrix_conformance_id",
  "deny_state_test_matrix_conformance_version",
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
  "deny_state_test_matrix_ref",
  "pending_status_deny_case_ref",
  "rejected_status_deny_case_ref",
  "revoked_status_deny_case_ref",
  "suspended_status_deny_case_ref",
  "expired_status_deny_case_ref",
  "missing_ipr_status_deny_case_ref",
  "unknown_ipr_status_deny_case_ref",
  "missing_ipr_card_status_deny_case_ref",
  "revoked_ipr_card_status_deny_case_ref",
  "expired_ipr_card_status_deny_case_ref",
  "not_issued_ipr_card_status_deny_case_ref",
  "missing_certificate_status_deny_case_ref",
  "pending_certificate_status_deny_case_ref",
  "revoked_certificate_status_deny_case_ref",
  "expired_certificate_status_deny_case_ref",
  "not_created_certificate_status_deny_case_ref",
  "mismatched_identity_deny_case_ref",
  "missing_authority_deny_case_ref",
  "missing_scope_deny_case_ref",
  "missing_policy_evaluation_deny_case_ref",
  "missing_point_of_use_authorization_deny_case_ref",
  "deny_verdict_schema_ref",
  "deny_reason_code_schema_ref",
  "deny_error_contract_ref",
  "deny_audit_event_ref",
  "deny_opc_event_ref",
  "deny_evidence_event_ref",
  "deny_matrix_effective_state_update_ref",
  "negative_test_execution_boundary_ref",
  "fixture_boundary_ref",
  "mock_boundary_ref",
  "adapter_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "customer_access_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "deny_state_test_matrix_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_deny_state_test_matrix_conformance_fields) || !d.required_deny_state_test_matrix_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const denyFalseClaims = [
  "deny_state_test_matrix_created",
  "deny_state_test_matrix_validated",
  "deny_state_test_matrix_finalized",
  "deny_state_pending_status_case_validated",
  "deny_state_rejected_status_case_validated",
  "deny_state_revoked_status_case_validated",
  "deny_state_suspended_status_case_validated",
  "deny_state_expired_status_case_validated",
  "deny_state_missing_ipr_status_case_validated",
  "deny_state_unknown_ipr_status_case_validated",
  "deny_state_missing_ipr_card_status_case_validated",
  "deny_state_revoked_ipr_card_status_case_validated",
  "deny_state_expired_ipr_card_status_case_validated",
  "deny_state_not_issued_ipr_card_status_case_validated",
  "deny_state_missing_certificate_status_case_validated",
  "deny_state_pending_certificate_status_case_validated",
  "deny_state_revoked_certificate_status_case_validated",
  "deny_state_expired_certificate_status_case_validated",
  "deny_state_not_created_certificate_status_case_validated",
  "deny_state_mismatched_identity_case_validated",
  "deny_state_missing_authority_case_validated",
  "deny_state_missing_scope_case_validated",
  "deny_state_missing_policy_evaluation_case_validated",
  "deny_state_missing_point_of_use_authorization_case_validated",
  "deny_state_verdict_schema_validated",
  "deny_state_reason_code_schema_validated",
  "deny_state_error_contract_validated",
  "deny_state_audit_event_model_validated",
  "deny_state_opc_event_model_validated",
  "deny_state_evidence_event_model_validated",
  "deny_state_matrix_effective_state_update_validated",
  "deny_state_negative_test_execution_validated",
  "deny_state_fixture_boundary_validated",
  "deny_state_mock_boundary_validated",
  "deny_state_adapter_boundary_validated",
  "deny_state_runtime_boundary_validated",
  "deny_state_production_boundary_validated",
  "deny_state_customer_access_boundary_validated",
  "deny_state_legal_certification_boundary_validated",
  "deny_state_pending_status_test_passed",
  "deny_state_rejected_status_test_passed",
  "deny_state_revoked_status_test_passed",
  "deny_state_suspended_status_test_passed",
  "deny_state_expired_status_test_passed",
  "deny_state_missing_status_test_passed",
  "deny_state_unknown_status_test_passed",
  "deny_state_card_revoked_test_passed",
  "deny_state_card_expired_test_passed",
  "deny_state_card_not_issued_test_passed",
  "deny_state_certificate_pending_test_passed",
  "deny_state_certificate_revoked_test_passed",
  "deny_state_certificate_expired_test_passed",
  "deny_state_certificate_not_created_test_passed",
  "deny_state_mismatched_identity_test_passed",
  "deny_state_missing_authority_test_passed",
  "deny_state_missing_scope_test_passed",
  "deny_state_missing_policy_test_passed",
  "deny_state_missing_point_of_use_authorization_test_passed",
  "deny_state_access_denied_enforced",
  "deny_state_access_grant_blocked",
  "deny_state_opc_event_emitted",
  "deny_state_audit_event_created",
  "deny_state_evidence_event_created",
  "deny_state_ready",
  "deny_state_success",
  "deny_state_production_ready",
  "deny_state_customer_ready",
  "deny_state_legal_certification_created"
];

for (const key of denyFalseClaims) {
  if (d[key] !== false) {
    fail(`DENY_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
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
  "no_deny_state_test_matrix_created_claim",
  "no_deny_state_test_matrix_validated_claim",
  "no_deny_state_pending_status_case_validated_claim",
  "no_deny_state_revoked_status_case_validated_claim",
  "no_deny_state_expired_status_case_validated_claim",
  "no_deny_state_mismatched_identity_case_validated_claim",
  "no_deny_state_missing_authority_case_validated_claim",
  "no_deny_state_missing_scope_case_validated_claim",
  "no_deny_state_access_denied_enforced_claim",
  "no_deny_state_access_grant_blocked_claim",
  "no_deny_state_ready_claim",
  "no_deny_state_success_claim",
  "no_deny_state_production_ready_claim",
  "no_deny_state_customer_ready_claim",
  "no_deny_state_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "deny_state_test_matrix_created_false",
  "deny_state_test_matrix_validated_false",
  "deny_state_pending_status_case_validated_false",
  "deny_state_revoked_status_case_validated_false",
  "deny_state_expired_status_case_validated_false",
  "deny_state_mismatched_identity_case_validated_false",
  "deny_state_missing_authority_case_validated_false",
  "deny_state_missing_scope_case_validated_false",
  "deny_state_access_denied_enforced_false",
  "deny_state_access_grant_blocked_false",
  "deny_state_ready_false",
  "deny_state_success_false",
  "deny_state_production_ready_false",
  "deny_state_customer_ready_false",
  "deny_state_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

if (falseClaimCount !== 614) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=614 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_deny_state_test_matrix_conformance_field_count: d.required_deny_state_test_matrix_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  deny_state_test_matrix_created: d.deny_state_test_matrix_created,
  deny_state_test_matrix_validated: d.deny_state_test_matrix_validated,
  deny_state_pending_status_case_validated: d.deny_state_pending_status_case_validated,
  deny_state_revoked_status_case_validated: d.deny_state_revoked_status_case_validated,
  deny_state_expired_status_case_validated: d.deny_state_expired_status_case_validated,
  deny_state_access_denied_enforced: d.deny_state_access_denied_enforced,
  deny_state_access_grant_blocked: d.deny_state_access_grant_blocked,
  deny_state_ready: d.deny_state_ready,
  deny_state_success: d.deny_state_success,
  deny_state_production_ready: d.deny_state_production_ready,
  deny_state_customer_ready: d.deny_state_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT" : "FAIL_DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_314_DENY_STATE_TEST_MATRIX_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
