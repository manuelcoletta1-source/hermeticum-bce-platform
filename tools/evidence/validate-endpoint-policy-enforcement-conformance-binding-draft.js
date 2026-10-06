#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-ENDPOINT-POLICY-ENFORCEMENT-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEEndpointPolicyEnforcementConformanceBindingDraft",
  classification: "R_AND_D_ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_ENDPOINT_AUTHORIZATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "555d5abd85612a2fc50b4fc0a36eee2000957b8f",
  recommended_next_program: "PROG-319",
  recommended_next_object_id: "HBCE-ENDPOINT-DECISION-LOGGING-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  if (d[key] !== expected) {
    fail(`MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const counts = {
  source_chain_entry_count: 36,
  required_endpoint_policy_enforcement_conformance_field_count: 76,
  binding_rule_count: 76,
  future_resolution_requirement_count: 70,
  required_non_claim_count: 858,
  required_no_execution_boundary_count: 858
};

for (const [key, expected] of Object.entries(counts)) {
  if (d[key] !== expected) {
    fail(`COUNT_MISMATCH ${key}: expected=${expected} actual=${d[key]}`);
  }
}

const arrays = {
  basis: 30,
  required_endpoint_policy_enforcement_conformance_fields: 76,
  binding_rules: 76,
  future_resolution_requirements: 70,
  explicit_non_claims: 858,
  no_execution_boundary: 858
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
  "endpoint_policy_enforcement_conformance_id",
  "endpoint_policy_enforcement_conformance_version",
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
  "endpoint_policy_enforcement_ref",
  "policy_decision_point_ref",
  "policy_enforcement_point_ref",
  "policy_bundle_ref",
  "policy_version_ref",
  "policy_hash_ref",
  "policy_input_schema_ref",
  "policy_output_schema_ref",
  "subject_context_binding_ref",
  "action_context_binding_ref",
  "resource_context_binding_ref",
  "environment_context_binding_ref",
  "tenant_context_binding_ref",
  "scope_context_binding_ref",
  "mandate_context_binding_ref",
  "delegation_context_binding_ref",
  "consent_context_binding_ref",
  "revocation_context_binding_ref",
  "decision_id_binding_ref",
  "decision_time_binding_ref",
  "decision_freshness_policy_ref",
  "deny_precedence_rule_ref",
  "unknown_precedence_rule_ref",
  "obligation_binding_ref",
  "constraint_binding_ref",
  "side_effect_boundary_ref",
  "cache_boundary_ref",
  "policy_reload_boundary_ref",
  "policy_drift_boundary_ref",
  "fallback_policy_boundary_ref",
  "error_contract_ref",
  "audit_event_ref",
  "opc_event_ref",
  "evidence_event_ref",
  "policy_enforcement_matrix_effective_state_update_ref",
  "fixture_boundary_ref",
  "mock_boundary_ref",
  "adapter_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "customer_access_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_policy_enforcement_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_endpoint_policy_enforcement_conformance_fields) || !d.required_endpoint_policy_enforcement_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const policyFalseClaims = [
  "endpoint_policy_enforcement_created",
  "endpoint_policy_enforcement_validated",
  "endpoint_policy_enforcement_finalized",
  "endpoint_policy_enforcement_policy_decision_point_validated",
  "endpoint_policy_enforcement_policy_enforcement_point_validated",
  "endpoint_policy_enforcement_policy_bundle_validated",
  "endpoint_policy_enforcement_policy_version_validated",
  "endpoint_policy_enforcement_policy_hash_validated",
  "endpoint_policy_enforcement_policy_input_schema_validated",
  "endpoint_policy_enforcement_policy_output_schema_validated",
  "endpoint_policy_enforcement_subject_context_binding_validated",
  "endpoint_policy_enforcement_action_context_binding_validated",
  "endpoint_policy_enforcement_resource_context_binding_validated",
  "endpoint_policy_enforcement_environment_context_binding_validated",
  "endpoint_policy_enforcement_tenant_context_binding_validated",
  "endpoint_policy_enforcement_scope_context_binding_validated",
  "endpoint_policy_enforcement_mandate_context_binding_validated",
  "endpoint_policy_enforcement_delegation_context_binding_validated",
  "endpoint_policy_enforcement_consent_context_binding_validated",
  "endpoint_policy_enforcement_revocation_context_binding_validated",
  "endpoint_policy_enforcement_decision_id_binding_validated",
  "endpoint_policy_enforcement_decision_time_binding_validated",
  "endpoint_policy_enforcement_decision_freshness_policy_validated",
  "endpoint_policy_enforcement_deny_precedence_rule_validated",
  "endpoint_policy_enforcement_unknown_precedence_rule_validated",
  "endpoint_policy_enforcement_obligation_binding_validated",
  "endpoint_policy_enforcement_constraint_binding_validated",
  "endpoint_policy_enforcement_side_effect_boundary_validated",
  "endpoint_policy_enforcement_cache_boundary_validated",
  "endpoint_policy_enforcement_policy_reload_boundary_validated",
  "endpoint_policy_enforcement_policy_drift_boundary_validated",
  "endpoint_policy_enforcement_fallback_policy_boundary_validated",
  "endpoint_policy_enforcement_error_contract_validated",
  "endpoint_policy_enforcement_audit_event_model_validated",
  "endpoint_policy_enforcement_opc_event_model_validated",
  "endpoint_policy_enforcement_evidence_event_model_validated",
  "endpoint_policy_enforcement_matrix_effective_state_update_validated",
  "endpoint_policy_enforcement_fixture_boundary_validated",
  "endpoint_policy_enforcement_mock_boundary_validated",
  "endpoint_policy_enforcement_adapter_boundary_validated",
  "endpoint_policy_enforcement_runtime_boundary_validated",
  "endpoint_policy_enforcement_production_boundary_validated",
  "endpoint_policy_enforcement_customer_access_boundary_validated",
  "endpoint_policy_enforcement_legal_certification_boundary_validated",
  "endpoint_policy_enforcement_positive_test_passed",
  "endpoint_policy_enforcement_negative_test_passed",
  "endpoint_policy_enforcement_allow_policy_enforced_test_passed",
  "endpoint_policy_enforcement_deny_policy_enforced_test_passed",
  "endpoint_policy_enforcement_unknown_policy_denied_test_passed",
  "endpoint_policy_enforcement_obligation_required_test_passed",
  "endpoint_policy_enforcement_constraint_violation_denied_test_passed",
  "endpoint_policy_enforcement_policy_hash_mismatch_denied_test_passed",
  "endpoint_policy_enforcement_policy_version_mismatch_denied_test_passed",
  "endpoint_policy_enforcement_policy_reload_test_passed",
  "endpoint_policy_enforcement_cache_stale_denied_test_passed",
  "endpoint_policy_enforcement_side_effect_blocked_test_passed",
  "endpoint_policy_enforcement_decision_allow_enforced",
  "endpoint_policy_enforcement_decision_deny_enforced",
  "endpoint_policy_enforcement_decision_unknown_enforced",
  "endpoint_policy_enforcement_obligation_enforced",
  "endpoint_policy_enforcement_constraint_enforced",
  "endpoint_policy_enforcement_decision_logged",
  "endpoint_policy_enforcement_opc_event_emitted",
  "endpoint_policy_enforcement_audit_event_created",
  "endpoint_policy_enforcement_evidence_event_created",
  "endpoint_policy_enforcement_ready",
  "endpoint_policy_enforcement_success",
  "endpoint_policy_enforcement_production_ready",
  "endpoint_policy_enforcement_customer_ready",
  "endpoint_policy_enforcement_legal_certification_created"
];

for (const key of policyFalseClaims) {
  if (d[key] !== false) {
    fail(`POLICY_ENFORCEMENT_BOUNDARY_MISMATCH ${key}: expected=false actual=${d[key]}`);
  }
}

const inheritedCriticalFalseClaims = [
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
  "no_endpoint_policy_enforcement_created_claim",
  "no_endpoint_policy_enforcement_validated_claim",
  "no_endpoint_policy_enforcement_policy_decision_point_validated_claim",
  "no_endpoint_policy_enforcement_policy_enforcement_point_validated_claim",
  "no_endpoint_policy_enforcement_allow_policy_enforced_test_passed_claim",
  "no_endpoint_policy_enforcement_deny_policy_enforced_test_passed_claim",
  "no_endpoint_policy_enforcement_decision_allow_enforced_claim",
  "no_endpoint_policy_enforcement_decision_deny_enforced_claim",
  "no_endpoint_policy_enforcement_decision_logged_claim",
  "no_endpoint_policy_enforcement_ready_claim",
  "no_endpoint_policy_enforcement_success_claim",
  "no_endpoint_policy_enforcement_production_ready_claim",
  "no_endpoint_policy_enforcement_customer_ready_claim",
  "no_endpoint_policy_enforcement_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "endpoint_policy_enforcement_created_false",
  "endpoint_policy_enforcement_validated_false",
  "endpoint_policy_enforcement_policy_decision_point_validated_false",
  "endpoint_policy_enforcement_policy_enforcement_point_validated_false",
  "endpoint_policy_enforcement_allow_policy_enforced_test_passed_false",
  "endpoint_policy_enforcement_deny_policy_enforced_test_passed_false",
  "endpoint_policy_enforcement_decision_allow_enforced_false",
  "endpoint_policy_enforcement_decision_deny_enforced_false",
  "endpoint_policy_enforcement_decision_logged_false",
  "endpoint_policy_enforcement_ready_false",
  "endpoint_policy_enforcement_success_false",
  "endpoint_policy_enforcement_production_ready_false",
  "endpoint_policy_enforcement_customer_ready_false",
  "endpoint_policy_enforcement_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

if (falseClaimCount !== 858) {
  fail(`FALSE_CLAIM_COUNT_MISMATCH expected=858 actual=${falseClaimCount}`);
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_policy_enforcement_conformance_field_count: d.required_endpoint_policy_enforcement_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_policy_enforcement_created: d.endpoint_policy_enforcement_created,
  endpoint_policy_enforcement_validated: d.endpoint_policy_enforcement_validated,
  endpoint_policy_enforcement_decision_allow_enforced: d.endpoint_policy_enforcement_decision_allow_enforced,
  endpoint_policy_enforcement_decision_deny_enforced: d.endpoint_policy_enforcement_decision_deny_enforced,
  endpoint_policy_enforcement_decision_logged: d.endpoint_policy_enforcement_decision_logged,
  endpoint_policy_enforcement_ready: d.endpoint_policy_enforcement_ready,
  endpoint_policy_enforcement_success: d.endpoint_policy_enforcement_success,
  endpoint_policy_enforcement_production_ready: d.endpoint_policy_enforcement_production_ready,
  endpoint_policy_enforcement_customer_ready: d.endpoint_policy_enforcement_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_318_ENDPOINT_POLICY_ENFORCEMENT_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
