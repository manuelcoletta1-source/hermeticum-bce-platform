#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT_v001.json";
const d = JSON.parse(fs.readFileSync(file, "utf8"));

let ok = true;

function check(name, actual, expected) {
  if (actual !== expected) {
    console.log(`VALIDATOR_MISMATCH ${name}: expected=${expected} actual=${actual}`);
    ok = false;
  }
}

function requireArray(name, expectedLength) {
  if (!Array.isArray(d[name])) {
    console.log(`VALIDATOR_ARRAY_MISSING ${name}`);
    ok = false;
    return [];
  }

  if (d[name].length !== expectedLength) {
    console.log(`VALIDATOR_ARRAY_LENGTH_MISMATCH ${name}: expected=${expectedLength} actual=${d[name].length}`);
    ok = false;
  }

  return d[name];
}

check("object_id", d.object_id, "HBCE-ENDPOINT-DECISION-PROOF-PACKAGE-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointDecisionProofPackageConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_MATRIX_EFFECTIVE_STATE_UPDATE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "a20f5c0ff267f118352618d97b99f9d602101caa");
check("result", d.result, "PASS_ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-325");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-QUALIFIED-VERIFICATION-REPORT-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 42);
check("required_endpoint_decision_proof_package_conformance_field_count", d.required_endpoint_decision_proof_package_conformance_field_count, 92);
check("binding_rule_count", d.binding_rule_count, 92);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 102);
check("required_non_claim_count", d.required_non_claim_count, 1417);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 1417);

const basis = requireArray("basis", 36);
const fields = requireArray("required_endpoint_decision_proof_package_conformance_fields", 92);
const bindingRules = requireArray("binding_rules", 92);
const futureRequirements = requireArray("future_resolution_requirements", 102);
const nonClaims = requireArray("explicit_non_claims", 1417);
const noExecutionBoundary = requireArray("no_execution_boundary", 1417);

if (basis.includes("HBCE-ENDPOINT-DECISION-PROOF-PACKAGE-CONFORMANCE-BINDING-DRAFT-V001")) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

const requiredBasis = [
  "HBCE-ENDPOINT-MATRIX-EFFECTIVE-STATE-UPDATE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-EVIDENCE-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-OPC-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUDIT-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-DECISION-LOGGING-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-POLICY-ENFORCEMENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHORIZATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHENTICATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-GOLDEN-FLOW-CONFORMANCE-BINDING-DRAFT-V001",
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
  if (!basis.includes(item)) {
    console.log(`VALIDATOR_BASIS_MISSING ${item}`);
    ok = false;
  }
}

const requiredFields = [
  "endpoint_decision_proof_package_conformance_id",
  "endpoint_decision_proof_package_conformance_version",
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
  "endpoint_matrix_effective_state_update_conformance_ref",
  "endpoint_decision_proof_package_ref",
  "decision_proof_package_id_ref",
  "decision_proof_package_version_ref",
  "decision_proof_package_manifest_ref",
  "decision_proof_package_manifest_hash_ref",
  "decision_proof_package_canonical_payload_ref",
  "decision_proof_package_canonical_payload_hash_ref",
  "decision_proof_package_subject_ref",
  "decision_proof_package_scope_ref",
  "decision_proof_package_tenant_ref",
  "decision_proof_package_decision_id_ref",
  "decision_proof_package_authority_id_ref",
  "decision_proof_package_policy_hash_ref",
  "decision_proof_package_request_hash_ref",
  "decision_proof_package_response_hash_ref",
  "decision_proof_package_dispatch_hash_ref",
  "decision_proof_package_execution_hash_ref",
  "decision_proof_package_consequence_hash_ref",
  "decision_proof_package_evidence_package_hash_ref",
  "decision_proof_package_matrix_state_hash_ref",
  "decision_proof_package_verification_hash_ref",
  "decision_proof_package_audit_event_id_ref",
  "decision_proof_package_opc_event_id_ref",
  "decision_proof_package_evidence_event_id_ref",
  "decision_proof_package_matrix_transition_id_ref",
  "decision_proof_package_chainhead_ref",
  "decision_proof_package_chainlink_ref",
  "decision_proof_package_parent_hash_ref",
  "decision_proof_package_integrity_hash_ref",
  "decision_proof_package_signature_ref",
  "decision_proof_package_timestamp_ref",
  "decision_proof_package_export_ref",
  "decision_proof_package_reconstruction_ref",
  "decision_proof_package_verifier_ref",
  "decision_proof_package_status_ref",
  "decision_proof_package_result_precedence_ref",
  "decision_proof_package_unknown_state_ref",
  "decision_proof_package_insufficient_evidence_state_ref",
  "decision_proof_package_fail_state_ref",
  "decision_proof_package_pass_state_ref",
  "decision_proof_package_conflict_state_ref",
  "decision_proof_package_replay_boundary_ref",
  "decision_proof_package_idempotency_boundary_ref",
  "decision_proof_package_ordering_boundary_ref",
  "decision_proof_package_consistency_boundary_ref",
  "decision_proof_package_completeness_boundary_ref",
  "decision_proof_package_fork_detection_boundary_ref",
  "decision_proof_package_canonicalization_boundary_ref",
  "decision_proof_package_hash_binding_boundary_ref",
  "decision_proof_package_signature_boundary_ref",
  "decision_proof_package_timestamp_boundary_ref",
  "decision_proof_package_retention_boundary_ref",
  "decision_proof_package_redaction_boundary_ref",
  "decision_proof_package_privacy_boundary_ref",
  "decision_proof_package_access_control_boundary_ref",
  "decision_proof_package_query_boundary_ref",
  "decision_proof_package_export_boundary_ref",
  "decision_proof_package_customer_delivery_boundary_ref",
  "decision_proof_package_release_boundary_ref",
  "legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_decision_proof_package_boundary_statement"
];

for (const item of requiredFields) {
  if (!fields.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_FIELD_MISSING ${item}`);
    ok = false;
  }
}

if (bindingRules.length !== fields.length) {
  console.log("VALIDATOR_BINDING_RULE_FIELD_COUNT_MISMATCH");
  ok = false;
}

const criticalFalseClaims = [
  "endpoint_decision_proof_package_created",
  "endpoint_decision_proof_package_validated",
  "endpoint_decision_proof_package_finalized",
  "endpoint_decision_proof_package_record_schema_validated",
  "endpoint_decision_proof_package_manifest_validated",
  "endpoint_decision_proof_package_manifest_hash_validated",
  "endpoint_decision_proof_package_canonical_payload_validated",
  "endpoint_decision_proof_package_canonical_payload_hash_validated",
  "endpoint_decision_proof_package_policy_hash_binding_validated",
  "endpoint_decision_proof_package_request_hash_binding_validated",
  "endpoint_decision_proof_package_response_hash_binding_validated",
  "endpoint_decision_proof_package_dispatch_hash_binding_validated",
  "endpoint_decision_proof_package_execution_hash_binding_validated",
  "endpoint_decision_proof_package_consequence_hash_binding_validated",
  "endpoint_decision_proof_package_evidence_package_hash_binding_validated",
  "endpoint_decision_proof_package_matrix_state_hash_binding_validated",
  "endpoint_decision_proof_package_verification_hash_binding_validated",
  "endpoint_decision_proof_package_audit_event_id_binding_validated",
  "endpoint_decision_proof_package_opc_event_id_binding_validated",
  "endpoint_decision_proof_package_evidence_event_id_binding_validated",
  "endpoint_decision_proof_package_matrix_transition_id_binding_validated",
  "endpoint_decision_proof_package_chainhead_binding_validated",
  "endpoint_decision_proof_package_chainlink_binding_validated",
  "endpoint_decision_proof_package_parent_hash_binding_validated",
  "endpoint_decision_proof_package_integrity_hash_binding_validated",
  "endpoint_decision_proof_package_signature_binding_validated",
  "endpoint_decision_proof_package_timestamp_binding_validated",
  "endpoint_decision_proof_package_export_binding_validated",
  "endpoint_decision_proof_package_reconstruction_binding_validated",
  "endpoint_decision_proof_package_verifier_binding_validated",
  "endpoint_decision_proof_package_status_validated",
  "endpoint_decision_proof_package_result_precedence_validated",
  "endpoint_decision_proof_package_unknown_state_validated",
  "endpoint_decision_proof_package_insufficient_evidence_state_validated",
  "endpoint_decision_proof_package_fail_state_validated",
  "endpoint_decision_proof_package_pass_state_validated",
  "endpoint_decision_proof_package_conflict_state_validated",
  "endpoint_decision_proof_package_replay_boundary_validated",
  "endpoint_decision_proof_package_idempotency_boundary_validated",
  "endpoint_decision_proof_package_ordering_boundary_validated",
  "endpoint_decision_proof_package_consistency_boundary_validated",
  "endpoint_decision_proof_package_completeness_boundary_validated",
  "endpoint_decision_proof_package_fork_detection_boundary_validated",
  "endpoint_decision_proof_package_canonicalization_boundary_validated",
  "endpoint_decision_proof_package_hash_binding_boundary_validated",
  "endpoint_decision_proof_package_signature_boundary_validated",
  "endpoint_decision_proof_package_timestamp_boundary_validated",
  "endpoint_decision_proof_package_retention_boundary_validated",
  "endpoint_decision_proof_package_redaction_boundary_validated",
  "endpoint_decision_proof_package_privacy_boundary_validated",
  "endpoint_decision_proof_package_access_control_boundary_validated",
  "endpoint_decision_proof_package_query_boundary_validated",
  "endpoint_decision_proof_package_export_boundary_validated",
  "endpoint_decision_proof_package_customer_delivery_boundary_validated",
  "endpoint_decision_proof_package_release_boundary_validated",
  "endpoint_decision_proof_package_created_record",
  "endpoint_decision_proof_package_persisted",
  "endpoint_decision_proof_package_hash_bound",
  "endpoint_decision_proof_package_signed",
  "endpoint_decision_proof_package_timestamped",
  "endpoint_decision_proof_package_exported",
  "endpoint_decision_proof_package_delivered_to_customer",
  "endpoint_decision_proof_package_reconstruction_ready",
  "endpoint_decision_proof_package_verifier_ready",
  "endpoint_decision_proof_package_ready",
  "endpoint_decision_proof_package_success",
  "endpoint_decision_proof_package_production_ready",
  "endpoint_decision_proof_package_customer_ready",
  "endpoint_decision_proof_package_legal_certification_created",
  "endpoint_matrix_effective_state_update_validated",
  "endpoint_matrix_effective_state_update_matrix_state_before_read",
  "endpoint_matrix_effective_state_update_matrix_state_after_written",
  "endpoint_matrix_effective_state_update_matrix_delta_applied",
  "endpoint_matrix_effective_state_update_matrix_chainhead_updated",
  "endpoint_matrix_effective_state_update_matrix_effective_state_updated",
  "endpoint_evidence_event_validated",
  "endpoint_evidence_event_emitted",
  "endpoint_evidence_event_persisted",
  "endpoint_evidence_event_hash_bound",
  "endpoint_evidence_event_signed",
  "endpoint_evidence_event_reconstruction_ready",
  "endpoint_evidence_event_chainlink_created",
  "endpoint_opc_event_validated",
  "endpoint_opc_event_emitted",
  "endpoint_opc_event_persisted",
  "endpoint_audit_event_validated",
  "endpoint_decision_logging_validated",
  "endpoint_policy_enforcement_validated",
  "endpoint_authorization_validated",
  "endpoint_authentication_validated",
  "legal_certification_created",
  "execution_completed"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
check("false_claim_property_count", falseClaimCount, 1417);

const requiredNonClaimEntries = [
  "no_endpoint_decision_proof_package_created_claim",
  "no_endpoint_decision_proof_package_validated_claim",
  "no_endpoint_decision_proof_package_manifest_validated_claim",
  "no_endpoint_decision_proof_package_manifest_hash_validated_claim",
  "no_endpoint_decision_proof_package_canonical_payload_validated_claim",
  "no_endpoint_decision_proof_package_hash_bound_claim",
  "no_endpoint_decision_proof_package_signed_claim",
  "no_endpoint_decision_proof_package_timestamped_claim",
  "no_endpoint_decision_proof_package_exported_claim",
  "no_endpoint_decision_proof_package_delivered_to_customer_claim",
  "no_endpoint_decision_proof_package_reconstruction_ready_claim",
  "no_endpoint_decision_proof_package_verifier_ready_claim",
  "no_endpoint_decision_proof_package_ready_claim",
  "no_endpoint_decision_proof_package_success_claim",
  "no_endpoint_decision_proof_package_production_ready_claim",
  "no_endpoint_decision_proof_package_customer_ready_claim",
  "no_endpoint_decision_proof_package_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!nonClaims.includes(item)) {
    console.log(`VALIDATOR_NON_CLAIM_ENTRY_MISSING ${item}`);
    ok = false;
  }
}

const requiredBoundaryEntries = [
  "endpoint_decision_proof_package_created_false",
  "endpoint_decision_proof_package_validated_false",
  "endpoint_decision_proof_package_manifest_validated_false",
  "endpoint_decision_proof_package_manifest_hash_validated_false",
  "endpoint_decision_proof_package_canonical_payload_validated_false",
  "endpoint_decision_proof_package_hash_bound_false",
  "endpoint_decision_proof_package_signed_false",
  "endpoint_decision_proof_package_timestamped_false",
  "endpoint_decision_proof_package_exported_false",
  "endpoint_decision_proof_package_delivered_to_customer_false",
  "endpoint_decision_proof_package_reconstruction_ready_false",
  "endpoint_decision_proof_package_verifier_ready_false",
  "endpoint_decision_proof_package_ready_false",
  "endpoint_decision_proof_package_success_false",
  "endpoint_decision_proof_package_production_ready_false",
  "endpoint_decision_proof_package_customer_ready_false",
  "endpoint_decision_proof_package_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!noExecutionBoundary.includes(item)) {
    console.log(`VALIDATOR_NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${item}`);
    ok = false;
  }
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_decision_proof_package_conformance_field_count: d.required_endpoint_decision_proof_package_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_decision_proof_package_created: d.endpoint_decision_proof_package_created,
  endpoint_decision_proof_package_validated: d.endpoint_decision_proof_package_validated,
  endpoint_decision_proof_package_hash_bound: d.endpoint_decision_proof_package_hash_bound,
  endpoint_decision_proof_package_signed: d.endpoint_decision_proof_package_signed,
  endpoint_decision_proof_package_timestamped: d.endpoint_decision_proof_package_timestamped,
  endpoint_decision_proof_package_exported: d.endpoint_decision_proof_package_exported,
  endpoint_decision_proof_package_reconstruction_ready: d.endpoint_decision_proof_package_reconstruction_ready,
  endpoint_decision_proof_package_verifier_ready: d.endpoint_decision_proof_package_verifier_ready,
  endpoint_decision_proof_package_ready: d.endpoint_decision_proof_package_ready,
  endpoint_decision_proof_package_success: d.endpoint_decision_proof_package_success,
  endpoint_decision_proof_package_production_ready: d.endpoint_decision_proof_package_production_ready,
  endpoint_decision_proof_package_customer_ready: d.endpoint_decision_proof_package_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_324_ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
