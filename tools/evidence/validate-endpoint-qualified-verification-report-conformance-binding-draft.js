#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT_v001.json";
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

check("object_id", d.object_id, "HBCE-ENDPOINT-QUALIFIED-VERIFICATION-REPORT-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointQualifiedVerificationReportConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_DECISION_PROOF_PACKAGE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "b30c4b517c9feb82d8339e4128e13fa069f3d310");
check("result", d.result, "PASS_ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-326");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-EXPORT-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 43);
check("required_endpoint_qualified_verification_report_conformance_field_count", d.required_endpoint_qualified_verification_report_conformance_field_count, 73);
check("binding_rule_count", d.binding_rule_count, 73);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 106);
check("required_non_claim_count", d.required_non_claim_count, 1523);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 1523);

const basis = requireArray("basis", 37);
const fields = requireArray("required_endpoint_qualified_verification_report_conformance_fields", 73);
const bindingRules = requireArray("binding_rules", 73);
const futureRequirements = requireArray("future_resolution_requirements", 106);
const nonClaims = requireArray("explicit_non_claims", 1523);
const noExecutionBoundary = requireArray("no_execution_boundary", 1523);

if (basis.includes("HBCE-ENDPOINT-QUALIFIED-VERIFICATION-REPORT-CONFORMANCE-BINDING-DRAFT-V001")) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

const requiredBasis = [
  "HBCE-ENDPOINT-DECISION-PROOF-PACKAGE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-MATRIX-EFFECTIVE-STATE-UPDATE-CONFORMANCE-BINDING-DRAFT-V001",
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
  if (!basis.includes(item)) {
    console.log(`VALIDATOR_BASIS_MISSING ${item}`);
    ok = false;
  }
}

const requiredFields = [
  "endpoint_qualified_verification_report_conformance_id",
  "endpoint_qualified_verification_report_conformance_version",
  "endpoint_decision_proof_package_conformance_ref",
  "qualified_verification_report_ref",
  "qualified_verification_report_id_ref",
  "qualified_verification_report_version_ref",
  "qualified_verification_report_manifest_ref",
  "qualified_verification_report_manifest_hash_ref",
  "qualified_verification_report_canonical_payload_ref",
  "qualified_verification_report_canonical_payload_hash_ref",
  "qualified_verifier_identity_ref",
  "qualified_verifier_role_ref",
  "qualified_verifier_authority_ref",
  "qualified_verifier_scope_ref",
  "verification_subject_ref",
  "verification_scope_ref",
  "verification_target_ref",
  "verification_time_ref",
  "decision_proof_package_ref",
  "decision_proof_package_hash_ref",
  "request_hash_ref",
  "authority_hash_ref",
  "policy_hash_ref",
  "authorization_hash_ref",
  "decision_hash_ref",
  "dispatch_hash_ref",
  "execution_hash_ref",
  "consequence_hash_ref",
  "evidence_package_hash_ref",
  "matrix_state_hash_ref",
  "reconstruction_hash_ref",
  "audit_event_id_ref",
  "opc_event_id_ref",
  "evidence_event_id_ref",
  "matrix_transition_id_ref",
  "source_chain_ref",
  "basis_chain_ref",
  "verification_method_ref",
  "verification_standard_ref",
  "verification_rule_set_ref",
  "verification_result_ref",
  "verification_status_ref",
  "result_precedence_ref",
  "unknown_state_ref",
  "insufficient_evidence_state_ref",
  "fail_state_ref",
  "pass_state_ref",
  "conflict_state_ref",
  "finding_list_ref",
  "exception_list_ref",
  "limitation_list_ref",
  "non_claim_list_ref",
  "no_execution_boundary_ref",
  "reproducibility_boundary_ref",
  "independence_boundary_ref",
  "custody_boundary_ref",
  "canonicalization_boundary_ref",
  "hash_binding_boundary_ref",
  "signature_boundary_ref",
  "timestamp_boundary_ref",
  "retention_boundary_ref",
  "redaction_boundary_ref",
  "privacy_boundary_ref",
  "access_control_boundary_ref",
  "query_boundary_ref",
  "export_boundary_ref",
  "customer_delivery_boundary_ref",
  "release_boundary_ref",
  "legal_certification_boundary_ref",
  "runtime_boundary_ref",
  "production_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_qualified_verification_report_boundary_statement"
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
  "endpoint_qualified_verification_report_created",
  "endpoint_qualified_verification_report_validated",
  "endpoint_qualified_verification_report_finalized",
  "endpoint_qualified_verification_report_record_schema_validated",
  "endpoint_qualified_verification_report_manifest_validated",
  "endpoint_qualified_verification_report_manifest_hash_validated",
  "endpoint_qualified_verification_report_canonical_payload_validated",
  "endpoint_qualified_verification_report_canonical_payload_hash_validated",
  "endpoint_qualified_verification_report_verifier_identity_validated",
  "endpoint_qualified_verification_report_verifier_role_validated",
  "endpoint_qualified_verification_report_verifier_authority_validated",
  "endpoint_qualified_verification_report_verifier_scope_validated",
  "endpoint_qualified_verification_report_verification_subject_validated",
  "endpoint_qualified_verification_report_verification_scope_validated",
  "endpoint_qualified_verification_report_verification_target_validated",
  "endpoint_qualified_verification_report_verification_time_validated",
  "endpoint_qualified_verification_report_proof_package_binding_validated",
  "endpoint_qualified_verification_report_proof_package_hash_binding_validated",
  "endpoint_qualified_verification_report_request_hash_binding_validated",
  "endpoint_qualified_verification_report_authority_hash_binding_validated",
  "endpoint_qualified_verification_report_policy_hash_binding_validated",
  "endpoint_qualified_verification_report_authorization_hash_binding_validated",
  "endpoint_qualified_verification_report_decision_hash_binding_validated",
  "endpoint_qualified_verification_report_dispatch_hash_binding_validated",
  "endpoint_qualified_verification_report_execution_hash_binding_validated",
  "endpoint_qualified_verification_report_consequence_hash_binding_validated",
  "endpoint_qualified_verification_report_evidence_package_hash_binding_validated",
  "endpoint_qualified_verification_report_matrix_state_hash_binding_validated",
  "endpoint_qualified_verification_report_reconstruction_hash_binding_validated",
  "endpoint_qualified_verification_report_audit_event_id_binding_validated",
  "endpoint_qualified_verification_report_opc_event_id_binding_validated",
  "endpoint_qualified_verification_report_evidence_event_id_binding_validated",
  "endpoint_qualified_verification_report_matrix_transition_id_binding_validated",
  "endpoint_qualified_verification_report_source_chain_binding_validated",
  "endpoint_qualified_verification_report_basis_chain_binding_validated",
  "endpoint_qualified_verification_report_verification_method_validated",
  "endpoint_qualified_verification_report_verification_standard_validated",
  "endpoint_qualified_verification_report_verification_rule_set_validated",
  "endpoint_qualified_verification_report_verification_result_validated",
  "endpoint_qualified_verification_report_verification_status_validated",
  "endpoint_qualified_verification_report_result_precedence_validated",
  "endpoint_qualified_verification_report_unknown_state_validated",
  "endpoint_qualified_verification_report_insufficient_evidence_state_validated",
  "endpoint_qualified_verification_report_fail_state_validated",
  "endpoint_qualified_verification_report_pass_state_validated",
  "endpoint_qualified_verification_report_conflict_state_validated",
  "endpoint_qualified_verification_report_finding_list_validated",
  "endpoint_qualified_verification_report_exception_list_validated",
  "endpoint_qualified_verification_report_limitation_list_validated",
  "endpoint_qualified_verification_report_non_claim_list_validated",
  "endpoint_qualified_verification_report_no_execution_boundary_validated",
  "endpoint_qualified_verification_report_reproducibility_boundary_validated",
  "endpoint_qualified_verification_report_independence_boundary_validated",
  "endpoint_qualified_verification_report_custody_boundary_validated",
  "endpoint_qualified_verification_report_canonicalization_boundary_validated",
  "endpoint_qualified_verification_report_hash_binding_boundary_validated",
  "endpoint_qualified_verification_report_signature_boundary_validated",
  "endpoint_qualified_verification_report_timestamp_boundary_validated",
  "endpoint_qualified_verification_report_retention_boundary_validated",
  "endpoint_qualified_verification_report_redaction_boundary_validated",
  "endpoint_qualified_verification_report_privacy_boundary_validated",
  "endpoint_qualified_verification_report_access_control_boundary_validated",
  "endpoint_qualified_verification_report_query_boundary_validated",
  "endpoint_qualified_verification_report_export_boundary_validated",
  "endpoint_qualified_verification_report_customer_delivery_boundary_validated",
  "endpoint_qualified_verification_report_release_boundary_validated",
  "endpoint_qualified_verification_report_created_record",
  "endpoint_qualified_verification_report_persisted",
  "endpoint_qualified_verification_report_hash_bound",
  "endpoint_qualified_verification_report_signed",
  "endpoint_qualified_verification_report_timestamped",
  "endpoint_qualified_verification_report_exported",
  "endpoint_qualified_verification_report_delivered_to_customer",
  "endpoint_qualified_verification_report_reconstruction_ready",
  "endpoint_qualified_verification_report_verifier_ready",
  "endpoint_qualified_verification_report_qualified_verification_completed",
  "endpoint_qualified_verification_report_ready",
  "endpoint_qualified_verification_report_success",
  "endpoint_qualified_verification_report_production_ready",
  "endpoint_qualified_verification_report_customer_ready",
  "endpoint_qualified_verification_report_legal_certification_created",
  "endpoint_decision_proof_package_validated",
  "endpoint_decision_proof_package_hash_bound",
  "endpoint_decision_proof_package_signed",
  "endpoint_decision_proof_package_exported",
  "endpoint_decision_proof_package_reconstruction_ready",
  "endpoint_decision_proof_package_verifier_ready",
  "endpoint_matrix_effective_state_update_validated",
  "endpoint_matrix_effective_state_update_matrix_effective_state_updated",
  "endpoint_evidence_event_validated",
  "endpoint_evidence_event_emitted",
  "endpoint_opc_event_validated",
  "endpoint_audit_event_validated",
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
check("false_claim_property_count", falseClaimCount, 1523);

const requiredNonClaimEntries = [
  "no_endpoint_qualified_verification_report_created_claim",
  "no_endpoint_qualified_verification_report_validated_claim",
  "no_endpoint_qualified_verification_report_manifest_validated_claim",
  "no_endpoint_qualified_verification_report_manifest_hash_validated_claim",
  "no_endpoint_qualified_verification_report_canonical_payload_validated_claim",
  "no_endpoint_qualified_verification_report_verification_result_validated_claim",
  "no_endpoint_qualified_verification_report_hash_bound_claim",
  "no_endpoint_qualified_verification_report_signed_claim",
  "no_endpoint_qualified_verification_report_timestamped_claim",
  "no_endpoint_qualified_verification_report_exported_claim",
  "no_endpoint_qualified_verification_report_reconstruction_ready_claim",
  "no_endpoint_qualified_verification_report_verifier_ready_claim",
  "no_endpoint_qualified_verification_report_qualified_verification_completed_claim",
  "no_endpoint_qualified_verification_report_ready_claim",
  "no_endpoint_qualified_verification_report_success_claim",
  "no_endpoint_qualified_verification_report_production_ready_claim",
  "no_endpoint_qualified_verification_report_customer_ready_claim",
  "no_endpoint_qualified_verification_report_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!nonClaims.includes(item)) {
    console.log(`VALIDATOR_NON_CLAIM_ENTRY_MISSING ${item}`);
    ok = false;
  }
}

const requiredBoundaryEntries = [
  "endpoint_qualified_verification_report_created_false",
  "endpoint_qualified_verification_report_validated_false",
  "endpoint_qualified_verification_report_manifest_validated_false",
  "endpoint_qualified_verification_report_manifest_hash_validated_false",
  "endpoint_qualified_verification_report_canonical_payload_validated_false",
  "endpoint_qualified_verification_report_verification_result_validated_false",
  "endpoint_qualified_verification_report_hash_bound_false",
  "endpoint_qualified_verification_report_signed_false",
  "endpoint_qualified_verification_report_timestamped_false",
  "endpoint_qualified_verification_report_exported_false",
  "endpoint_qualified_verification_report_reconstruction_ready_false",
  "endpoint_qualified_verification_report_verifier_ready_false",
  "endpoint_qualified_verification_report_qualified_verification_completed_false",
  "endpoint_qualified_verification_report_ready_false",
  "endpoint_qualified_verification_report_success_false",
  "endpoint_qualified_verification_report_production_ready_false",
  "endpoint_qualified_verification_report_customer_ready_false",
  "endpoint_qualified_verification_report_legal_certification_created_false"
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
  required_endpoint_qualified_verification_report_conformance_field_count: d.required_endpoint_qualified_verification_report_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_qualified_verification_report_created: d.endpoint_qualified_verification_report_created,
  endpoint_qualified_verification_report_validated: d.endpoint_qualified_verification_report_validated,
  endpoint_qualified_verification_report_hash_bound: d.endpoint_qualified_verification_report_hash_bound,
  endpoint_qualified_verification_report_signed: d.endpoint_qualified_verification_report_signed,
  endpoint_qualified_verification_report_timestamped: d.endpoint_qualified_verification_report_timestamped,
  endpoint_qualified_verification_report_exported: d.endpoint_qualified_verification_report_exported,
  endpoint_qualified_verification_report_reconstruction_ready: d.endpoint_qualified_verification_report_reconstruction_ready,
  endpoint_qualified_verification_report_verifier_ready: d.endpoint_qualified_verification_report_verifier_ready,
  endpoint_qualified_verification_report_qualified_verification_completed: d.endpoint_qualified_verification_report_qualified_verification_completed,
  endpoint_qualified_verification_report_ready: d.endpoint_qualified_verification_report_ready,
  endpoint_qualified_verification_report_success: d.endpoint_qualified_verification_report_success,
  endpoint_qualified_verification_report_production_ready: d.endpoint_qualified_verification_report_production_ready,
  endpoint_qualified_verification_report_customer_ready: d.endpoint_qualified_verification_report_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_325_ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
