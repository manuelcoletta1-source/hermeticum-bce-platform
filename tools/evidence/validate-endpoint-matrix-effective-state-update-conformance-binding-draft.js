#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT_v001.json";

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
  object_id: "HBCE-ENDPOINT-MATRIX-EFFECTIVE-STATE-UPDATE-CONFORMANCE-BINDING-DRAFT-V001",
  artifact_type: "HBCEEndpointMatrixEffectiveStateUpdateConformanceBindingDraft",
  classification: "R_AND_D_ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT_ONLY",
  status: "ACTIVE_ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT",
  binding_scope: "ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING",
  binding_mode: "RECORD_ONLY_NOT_EXECUTABLE",
  state: "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME",
  marker: "ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT=PASS",
  basis_marker: "HBCE_ENDPOINT_EVIDENCE_EVENT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1",
  basis_main_commit: "a1ac51dfdd6697a032263967ee4661bea6425745",
  recommended_next_program: "PROG-324",
  recommended_next_object_id: "HBCE-ENDPOINT-DECISION-PROOF-PACKAGE-CONFORMANCE-BINDING-DRAFT-V001",
  result: "PASS_ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT"
};

for (const [key, expected] of Object.entries(exact)) {
  check(key, d[key], expected);
}

const counts = {
  source_chain_entry_count: 41,
  required_endpoint_matrix_effective_state_update_conformance_field_count: 84,
  binding_rule_count: 84,
  future_resolution_requirement_count: 104,
  required_non_claim_count: 1315,
  required_no_execution_boundary_count: 1315
};

for (const [key, expected] of Object.entries(counts)) {
  check(key, d[key], expected);
}

const arrays = {
  basis: 35,
  required_endpoint_matrix_effective_state_update_conformance_fields: 84,
  binding_rules: 84,
  future_resolution_requirements: 104,
  explicit_non_claims: 1315,
  no_execution_boundary: 1315
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

if (Array.isArray(d.basis) && d.basis.includes("HBCE-ENDPOINT-MATRIX-EFFECTIVE-STATE-UPDATE-CONFORMANCE-BINDING-DRAFT-V001")) {
  fail("SELF_BASIS_REFERENCE_PRESENT");
}

const requiredBasis = [
  "HBCE-ENDPOINT-EVIDENCE-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-OPC-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUDIT-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-DECISION-LOGGING-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-POLICY-ENFORCEMENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHORIZATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHENTICATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-GOLDEN-FLOW-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-GLOBAL-TARGET-MAP-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-MATRIX-EFFECTIVE-STATE-BINDING-DRAFT-V001",
  "HBCE-INDEPENDENT-RECONSTRUCTION-QUALIFIED-VERIFICATION-BINDING-DRAFT-V001",
  "HBCE-EVIDENCE-PROVENANCE-CUSTODY-BINDING-DRAFT-V001",
  "HBCE-CONSEQUENCE-TARGET-OUTCOME-BINDING-DRAFT-V001",
  "HBCE-EXECUTION-TRACE-BINDING-DRAFT-V001",
  "HBCE-CONTROLLED-DISPATCH-BINDING-DRAFT-V001",
  "HBCE-DECISION-APPROVAL-OVERRIDE-BINDING-DRAFT-V001",
  "HBCE-POINT-OF-USE-AUTHORIZATION-BINDING-DRAFT-V001"
];

for (const item of requiredBasis) {
  if (!Array.isArray(d.basis) || !d.basis.includes(item)) {
    fail(`BASIS_MISSING ${item}`);
  }
}

const requiredFields = [
  "endpoint_matrix_effective_state_update_conformance_id",
  "endpoint_matrix_effective_state_update_conformance_version",
  "endpoint_evidence_event_conformance_ref",
  "endpoint_matrix_effective_state_update_ref",
  "matrix_state_before_ref",
  "matrix_state_after_ref",
  "matrix_delta_ref",
  "matrix_transition_id_ref",
  "matrix_transition_type_ref",
  "matrix_effective_at_ref",
  "matrix_record_id_ref",
  "matrix_subject_ref",
  "matrix_scope_ref",
  "matrix_tenant_ref",
  "matrix_policy_result_ref",
  "matrix_authorization_result_ref",
  "matrix_decision_result_ref",
  "matrix_dispatch_result_ref",
  "matrix_execution_result_ref",
  "matrix_consequence_result_ref",
  "matrix_evidence_result_ref",
  "matrix_verification_result_ref",
  "matrix_status_precedence_ref",
  "matrix_unknown_state_ref",
  "matrix_insufficient_evidence_state_ref",
  "matrix_fail_state_ref",
  "matrix_pass_state_ref",
  "matrix_conflict_state_ref",
  "matrix_replay_boundary_ref",
  "matrix_idempotency_boundary_ref",
  "matrix_ordering_boundary_ref",
  "matrix_consistency_boundary_ref",
  "matrix_completeness_boundary_ref",
  "matrix_fork_detection_boundary_ref",
  "matrix_chainhead_binding_ref",
  "matrix_chainlink_binding_ref",
  "matrix_parent_hash_binding_ref",
  "matrix_manifest_hash_binding_ref",
  "matrix_evidence_package_hash_binding_ref",
  "matrix_integrity_hash_binding_ref",
  "matrix_canonicalization_boundary_ref",
  "matrix_signature_boundary_ref",
  "matrix_timestamp_boundary_ref",
  "matrix_retention_boundary_ref",
  "matrix_redaction_boundary_ref",
  "matrix_privacy_boundary_ref",
  "matrix_access_control_boundary_ref",
  "matrix_query_boundary_ref",
  "matrix_export_boundary_ref",
  "matrix_reconstruction_boundary_ref",
  "matrix_verifier_boundary_ref",
  "matrix_opc_bridge_boundary_ref",
  "matrix_audit_bridge_boundary_ref",
  "matrix_evidence_bridge_boundary_ref",
  "matrix_release_boundary_ref",
  "fixture_boundary_ref",
  "mock_boundary_ref",
  "adapter_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "customer_access_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_matrix_effective_state_update_boundary_statement"
];

for (const item of requiredFields) {
  if (!Array.isArray(d.required_endpoint_matrix_effective_state_update_conformance_fields) || !d.required_endpoint_matrix_effective_state_update_conformance_fields.includes(item)) {
    fail(`REQUIRED_FIELD_MISSING ${item}`);
  }
}

const matrixFalseClaims = [
  "endpoint_matrix_effective_state_update_created",
  "endpoint_matrix_effective_state_update_validated",
  "endpoint_matrix_effective_state_update_finalized",
  "endpoint_matrix_effective_state_update_record_schema_validated",
  "endpoint_matrix_effective_state_update_id_binding_validated",
  "endpoint_matrix_effective_state_update_time_binding_validated",
  "endpoint_matrix_effective_state_update_transition_id_binding_validated",
  "endpoint_matrix_effective_state_update_transition_type_binding_validated",
  "endpoint_matrix_effective_state_update_state_before_validated",
  "endpoint_matrix_effective_state_update_state_after_validated",
  "endpoint_matrix_effective_state_update_state_delta_validated",
  "endpoint_matrix_effective_state_update_effective_at_validated",
  "endpoint_matrix_effective_state_update_subject_binding_validated",
  "endpoint_matrix_effective_state_update_scope_binding_validated",
  "endpoint_matrix_effective_state_update_tenant_binding_validated",
  "endpoint_matrix_effective_state_update_policy_result_binding_validated",
  "endpoint_matrix_effective_state_update_authorization_result_binding_validated",
  "endpoint_matrix_effective_state_update_decision_result_binding_validated",
  "endpoint_matrix_effective_state_update_dispatch_result_binding_validated",
  "endpoint_matrix_effective_state_update_execution_result_binding_validated",
  "endpoint_matrix_effective_state_update_consequence_result_binding_validated",
  "endpoint_matrix_effective_state_update_evidence_result_binding_validated",
  "endpoint_matrix_effective_state_update_verification_result_binding_validated",
  "endpoint_matrix_effective_state_update_status_precedence_validated",
  "endpoint_matrix_effective_state_update_unknown_state_validated",
  "endpoint_matrix_effective_state_update_insufficient_evidence_state_validated",
  "endpoint_matrix_effective_state_update_fail_state_validated",
  "endpoint_matrix_effective_state_update_pass_state_validated",
  "endpoint_matrix_effective_state_update_conflict_state_validated",
  "endpoint_matrix_effective_state_update_replay_boundary_validated",
  "endpoint_matrix_effective_state_update_idempotency_boundary_validated",
  "endpoint_matrix_effective_state_update_ordering_boundary_validated",
  "endpoint_matrix_effective_state_update_consistency_boundary_validated",
  "endpoint_matrix_effective_state_update_completeness_boundary_validated",
  "endpoint_matrix_effective_state_update_fork_detection_boundary_validated",
  "endpoint_matrix_effective_state_update_chainhead_binding_validated",
  "endpoint_matrix_effective_state_update_chainlink_binding_validated",
  "endpoint_matrix_effective_state_update_parent_hash_binding_validated",
  "endpoint_matrix_effective_state_update_manifest_hash_binding_validated",
  "endpoint_matrix_effective_state_update_evidence_package_hash_binding_validated",
  "endpoint_matrix_effective_state_update_integrity_hash_binding_validated",
  "endpoint_matrix_effective_state_update_canonicalization_boundary_validated",
  "endpoint_matrix_effective_state_update_signature_boundary_validated",
  "endpoint_matrix_effective_state_update_timestamp_boundary_validated",
  "endpoint_matrix_effective_state_update_retention_boundary_validated",
  "endpoint_matrix_effective_state_update_redaction_boundary_validated",
  "endpoint_matrix_effective_state_update_privacy_boundary_validated",
  "endpoint_matrix_effective_state_update_access_control_boundary_validated",
  "endpoint_matrix_effective_state_update_query_boundary_validated",
  "endpoint_matrix_effective_state_update_export_boundary_validated",
  "endpoint_matrix_effective_state_update_reconstruction_boundary_validated",
  "endpoint_matrix_effective_state_update_verifier_boundary_validated",
  "endpoint_matrix_effective_state_update_opc_bridge_boundary_validated",
  "endpoint_matrix_effective_state_update_audit_bridge_boundary_validated",
  "endpoint_matrix_effective_state_update_evidence_bridge_boundary_validated",
  "endpoint_matrix_effective_state_update_release_boundary_validated",
  "endpoint_matrix_effective_state_update_positive_test_passed",
  "endpoint_matrix_effective_state_update_negative_test_passed",
  "endpoint_matrix_effective_state_update_schema_validation_test_passed",
  "endpoint_matrix_effective_state_update_transition_test_passed",
  "endpoint_matrix_effective_state_update_status_precedence_test_passed",
  "endpoint_matrix_effective_state_update_unknown_precedence_test_passed",
  "endpoint_matrix_effective_state_update_insufficient_evidence_test_passed",
  "endpoint_matrix_effective_state_update_fail_precedence_test_passed",
  "endpoint_matrix_effective_state_update_conflict_detection_test_passed",
  "endpoint_matrix_effective_state_update_completeness_test_passed",
  "endpoint_matrix_effective_state_update_consistency_test_passed",
  "endpoint_matrix_effective_state_update_fork_detection_test_passed",
  "endpoint_matrix_effective_state_update_replay_detection_test_passed",
  "endpoint_matrix_effective_state_update_tamper_detection_test_passed",
  "endpoint_matrix_effective_state_update_chainhead_test_passed",
  "endpoint_matrix_effective_state_update_chainlink_test_passed",
  "endpoint_matrix_effective_state_update_parent_hash_test_passed",
  "endpoint_matrix_effective_state_update_manifest_hash_test_passed",
  "endpoint_matrix_effective_state_update_evidence_package_hash_test_passed",
  "endpoint_matrix_effective_state_update_canonicalization_test_passed",
  "endpoint_matrix_effective_state_update_signature_test_passed",
  "endpoint_matrix_effective_state_update_timestamp_test_passed",
  "endpoint_matrix_effective_state_update_retention_test_passed",
  "endpoint_matrix_effective_state_update_redaction_test_passed",
  "endpoint_matrix_effective_state_update_privacy_test_passed",
  "endpoint_matrix_effective_state_update_access_control_test_passed",
  "endpoint_matrix_effective_state_update_query_test_passed",
  "endpoint_matrix_effective_state_update_export_test_passed",
  "endpoint_matrix_effective_state_update_reconstruction_test_passed",
  "endpoint_matrix_effective_state_update_emitted",
  "endpoint_matrix_effective_state_update_persisted",
  "endpoint_matrix_effective_state_update_hash_bound",
  "endpoint_matrix_effective_state_update_signed",
  "endpoint_matrix_effective_state_update_timestamped",
  "endpoint_matrix_effective_state_update_exported",
  "endpoint_matrix_effective_state_update_matrix_state_before_read",
  "endpoint_matrix_effective_state_update_matrix_state_after_written",
  "endpoint_matrix_effective_state_update_matrix_delta_applied",
  "endpoint_matrix_effective_state_update_matrix_transition_recorded",
  "endpoint_matrix_effective_state_update_matrix_chainhead_updated",
  "endpoint_matrix_effective_state_update_matrix_effective_state_updated",
  "endpoint_matrix_effective_state_update_matrix_effective_state_reconstructable",
  "endpoint_matrix_effective_state_update_matrix_effective_state_verifier_ready",
  "endpoint_matrix_effective_state_update_ready",
  "endpoint_matrix_effective_state_update_success",
  "endpoint_matrix_effective_state_update_production_ready",
  "endpoint_matrix_effective_state_update_customer_ready",
  "endpoint_matrix_effective_state_update_legal_certification_created"
];

for (const key of matrixFalseClaims) {
  check(key, d[key], false);
}

const inheritedCriticalFalseClaims = [
  "endpoint_evidence_event_validated",
  "endpoint_evidence_event_emitted",
  "endpoint_evidence_event_persisted",
  "endpoint_evidence_event_hash_bound",
  "endpoint_evidence_event_signed",
  "endpoint_evidence_event_reconstruction_ready",
  "endpoint_evidence_event_chainlink_created",
  "endpoint_opc_event_validated",
  "endpoint_opc_event_emitted",
  "endpoint_opc_event_published",
  "endpoint_opc_event_delivered",
  "endpoint_opc_event_acknowledged",
  "endpoint_opc_event_persisted",
  "endpoint_opc_event_hash_bound",
  "endpoint_opc_event_signed",
  "endpoint_audit_event_validated",
  "endpoint_audit_event_emitted",
  "endpoint_audit_event_persisted",
  "endpoint_decision_logging_validated",
  "endpoint_decision_logging_decision_logged",
  "endpoint_policy_enforcement_validated",
  "endpoint_authorization_validated",
  "endpoint_authentication_validated",
  "legal_certification_created",
  "execution_completed"
];

for (const key of inheritedCriticalFalseClaims) {
  check(key, d[key], false);
}

const requiredNonClaimEntries = [
  "no_endpoint_matrix_effective_state_update_created_claim",
  "no_endpoint_matrix_effective_state_update_validated_claim",
  "no_endpoint_matrix_effective_state_update_record_schema_validated_claim",
  "no_endpoint_matrix_effective_state_update_state_before_validated_claim",
  "no_endpoint_matrix_effective_state_update_state_after_validated_claim",
  "no_endpoint_matrix_effective_state_update_matrix_state_before_read_claim",
  "no_endpoint_matrix_effective_state_update_matrix_state_after_written_claim",
  "no_endpoint_matrix_effective_state_update_matrix_delta_applied_claim",
  "no_endpoint_matrix_effective_state_update_matrix_chainhead_updated_claim",
  "no_endpoint_matrix_effective_state_update_matrix_effective_state_updated_claim",
  "no_endpoint_matrix_effective_state_update_ready_claim",
  "no_endpoint_matrix_effective_state_update_success_claim",
  "no_endpoint_matrix_effective_state_update_production_ready_claim",
  "no_endpoint_matrix_effective_state_update_customer_ready_claim",
  "no_endpoint_matrix_effective_state_update_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!Array.isArray(d.explicit_non_claims) || !d.explicit_non_claims.includes(item)) {
    fail(`NON_CLAIM_ENTRY_MISSING ${item}`);
  }
}

const requiredBoundaryEntries = [
  "endpoint_matrix_effective_state_update_created_false",
  "endpoint_matrix_effective_state_update_validated_false",
  "endpoint_matrix_effective_state_update_record_schema_validated_false",
  "endpoint_matrix_effective_state_update_state_before_validated_false",
  "endpoint_matrix_effective_state_update_state_after_validated_false",
  "endpoint_matrix_effective_state_update_matrix_state_before_read_false",
  "endpoint_matrix_effective_state_update_matrix_state_after_written_false",
  "endpoint_matrix_effective_state_update_matrix_delta_applied_false",
  "endpoint_matrix_effective_state_update_matrix_chainhead_updated_false",
  "endpoint_matrix_effective_state_update_matrix_effective_state_updated_false",
  "endpoint_matrix_effective_state_update_ready_false",
  "endpoint_matrix_effective_state_update_success_false",
  "endpoint_matrix_effective_state_update_production_ready_false",
  "endpoint_matrix_effective_state_update_customer_ready_false",
  "endpoint_matrix_effective_state_update_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!Array.isArray(d.no_execution_boundary) || !d.no_execution_boundary.includes(item)) {
    fail(`NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
check("false_claim_property_count", falseClaimCount, 1315);

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_matrix_effective_state_update_conformance_field_count: d.required_endpoint_matrix_effective_state_update_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_matrix_effective_state_update_created: d.endpoint_matrix_effective_state_update_created,
  endpoint_matrix_effective_state_update_validated: d.endpoint_matrix_effective_state_update_validated,
  endpoint_matrix_effective_state_update_matrix_state_before_read: d.endpoint_matrix_effective_state_update_matrix_state_before_read,
  endpoint_matrix_effective_state_update_matrix_state_after_written: d.endpoint_matrix_effective_state_update_matrix_state_after_written,
  endpoint_matrix_effective_state_update_matrix_delta_applied: d.endpoint_matrix_effective_state_update_matrix_delta_applied,
  endpoint_matrix_effective_state_update_matrix_chainhead_updated: d.endpoint_matrix_effective_state_update_matrix_chainhead_updated,
  endpoint_matrix_effective_state_update_matrix_effective_state_updated: d.endpoint_matrix_effective_state_update_matrix_effective_state_updated,
  endpoint_matrix_effective_state_update_ready: d.endpoint_matrix_effective_state_update_ready,
  endpoint_matrix_effective_state_update_success: d.endpoint_matrix_effective_state_update_success,
  endpoint_matrix_effective_state_update_production_ready: d.endpoint_matrix_effective_state_update_production_ready,
  endpoint_matrix_effective_state_update_customer_ready: d.endpoint_matrix_effective_state_update_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_323_ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
