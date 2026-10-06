#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT_v001.json";
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

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-EXPORT-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceExportConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_QUALIFIED_VERIFICATION_REPORT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "444e1fc2e852f50238e05ad1cf8ca455564faf5b");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-327");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DELIVERY-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 44);
check("required_endpoint_customer_evidence_export_conformance_field_count", d.required_endpoint_customer_evidence_export_conformance_field_count, 60);
check("binding_rule_count", d.binding_rule_count, 60);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 92);
check("required_non_claim_count", d.required_non_claim_count, 1615);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 1615);

const basis = requireArray("basis", 38);
const fields = requireArray("required_endpoint_customer_evidence_export_conformance_fields", 60);
const bindingRules = requireArray("binding_rules", 60);
const futureRequirements = requireArray("future_resolution_requirements", 92);
const nonClaims = requireArray("explicit_non_claims", 1615);
const noExecutionBoundary = requireArray("no_execution_boundary", 1615);

if (basis.includes("HBCE-ENDPOINT-CUSTOMER-EVIDENCE-EXPORT-CONFORMANCE-BINDING-DRAFT-V001")) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

const requiredBasis = [
  "HBCE-ENDPOINT-QUALIFIED-VERIFICATION-REPORT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-DECISION-PROOF-PACKAGE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-MATRIX-EFFECTIVE-STATE-UPDATE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-EVIDENCE-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-OPC-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUDIT-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-DECISION-LOGGING-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-POLICY-ENFORCEMENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHORIZATION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUTHENTICATION-CONFORMANCE-BINDING-DRAFT-V001"
];

for (const item of requiredBasis) {
  if (!basis.includes(item)) {
    console.log(`VALIDATOR_BASIS_MISSING ${item}`);
    ok = false;
  }
}

const requiredFields = [
  "endpoint_customer_evidence_export_conformance_id",
  "endpoint_customer_evidence_export_conformance_version",
  "endpoint_qualified_verification_report_conformance_ref",
  "customer_evidence_export_ref",
  "customer_evidence_export_id_ref",
  "customer_evidence_export_version_ref",
  "customer_evidence_export_manifest_ref",
  "customer_evidence_export_manifest_hash_ref",
  "customer_evidence_export_canonical_payload_ref",
  "customer_evidence_export_canonical_payload_hash_ref",
  "customer_identity_ref",
  "customer_tenant_ref",
  "customer_contract_ref",
  "customer_export_scope_ref",
  "customer_export_authority_ref",
  "customer_export_policy_ref",
  "customer_export_request_ref",
  "customer_export_decision_ref",
  "customer_export_verification_report_ref",
  "customer_export_decision_proof_package_ref",
  "customer_export_evidence_package_ref",
  "customer_export_matrix_state_ref",
  "customer_export_chainhead_ref",
  "customer_export_chainlink_ref",
  "customer_export_integrity_hash_ref",
  "customer_export_signature_ref",
  "customer_export_timestamp_ref",
  "customer_export_format_ref",
  "customer_export_redaction_policy_ref",
  "customer_export_privacy_boundary_ref",
  "customer_export_access_control_ref",
  "customer_export_retention_policy_ref",
  "customer_export_delivery_channel_ref",
  "customer_export_delivery_receipt_ref",
  "customer_export_acknowledgement_ref",
  "customer_export_revocation_ref",
  "customer_export_replay_boundary_ref",
  "customer_export_idempotency_boundary_ref",
  "customer_export_ordering_boundary_ref",
  "customer_export_consistency_boundary_ref",
  "customer_export_completeness_boundary_ref",
  "customer_export_fork_detection_boundary_ref",
  "customer_export_canonicalization_boundary_ref",
  "customer_export_hash_binding_boundary_ref",
  "customer_export_signature_boundary_ref",
  "customer_export_timestamp_boundary_ref",
  "customer_export_redaction_boundary_ref",
  "customer_export_privacy_boundary_statement",
  "customer_export_access_control_boundary_statement",
  "customer_export_query_boundary_ref",
  "customer_export_download_boundary_ref",
  "customer_export_api_boundary_ref",
  "customer_export_file_boundary_ref",
  "customer_export_customer_delivery_boundary_ref",
  "customer_export_release_boundary_ref",
  "customer_export_runtime_boundary_ref",
  "customer_export_production_boundary_ref",
  "customer_export_legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_customer_evidence_export_boundary_statement"
];

for (const item of requiredFields) {
  if (!fields.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_FIELD_MISSING ${item}`);
    ok = false;
  }

  const expectedRule = `bind_${item}_within_endpoint_customer_evidence_export_conformance_only`;
  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const exportFalseClaims = [
  "endpoint_customer_evidence_export_created",
  "endpoint_customer_evidence_export_validated",
  "endpoint_customer_evidence_export_finalized",
  "endpoint_customer_evidence_export_record_schema_validated",
  "endpoint_customer_evidence_export_manifest_validated",
  "endpoint_customer_evidence_export_manifest_hash_validated",
  "endpoint_customer_evidence_export_canonical_payload_validated",
  "endpoint_customer_evidence_export_canonical_payload_hash_validated",
  "endpoint_customer_evidence_export_customer_identity_validated",
  "endpoint_customer_evidence_export_customer_tenant_validated",
  "endpoint_customer_evidence_export_customer_contract_validated",
  "endpoint_customer_evidence_export_scope_validated",
  "endpoint_customer_evidence_export_authority_validated",
  "endpoint_customer_evidence_export_policy_validated",
  "endpoint_customer_evidence_export_request_validated",
  "endpoint_customer_evidence_export_decision_validated",
  "endpoint_customer_evidence_export_verification_report_binding_validated",
  "endpoint_customer_evidence_export_decision_proof_package_binding_validated",
  "endpoint_customer_evidence_export_evidence_package_binding_validated",
  "endpoint_customer_evidence_export_matrix_state_binding_validated",
  "endpoint_customer_evidence_export_chainhead_binding_validated",
  "endpoint_customer_evidence_export_chainlink_binding_validated",
  "endpoint_customer_evidence_export_integrity_hash_binding_validated",
  "endpoint_customer_evidence_export_signature_binding_validated",
  "endpoint_customer_evidence_export_timestamp_binding_validated",
  "endpoint_customer_evidence_export_format_validated",
  "endpoint_customer_evidence_export_redaction_policy_validated",
  "endpoint_customer_evidence_export_privacy_boundary_validated",
  "endpoint_customer_evidence_export_access_control_validated",
  "endpoint_customer_evidence_export_retention_policy_validated",
  "endpoint_customer_evidence_export_delivery_channel_validated",
  "endpoint_customer_evidence_export_delivery_receipt_validated",
  "endpoint_customer_evidence_export_acknowledgement_validated",
  "endpoint_customer_evidence_export_revocation_validated",
  "endpoint_customer_evidence_export_replay_boundary_validated",
  "endpoint_customer_evidence_export_idempotency_boundary_validated",
  "endpoint_customer_evidence_export_ordering_boundary_validated",
  "endpoint_customer_evidence_export_consistency_boundary_validated",
  "endpoint_customer_evidence_export_completeness_boundary_validated",
  "endpoint_customer_evidence_export_fork_detection_boundary_validated",
  "endpoint_customer_evidence_export_canonicalization_boundary_validated",
  "endpoint_customer_evidence_export_hash_binding_boundary_validated",
  "endpoint_customer_evidence_export_signature_boundary_validated",
  "endpoint_customer_evidence_export_timestamp_boundary_validated",
  "endpoint_customer_evidence_export_redaction_boundary_validated",
  "endpoint_customer_evidence_export_query_boundary_validated",
  "endpoint_customer_evidence_export_download_boundary_validated",
  "endpoint_customer_evidence_export_api_boundary_validated",
  "endpoint_customer_evidence_export_file_boundary_validated",
  "endpoint_customer_evidence_export_customer_delivery_boundary_validated",
  "endpoint_customer_evidence_export_release_boundary_validated",
  "endpoint_customer_evidence_export_created_record",
  "endpoint_customer_evidence_export_persisted",
  "endpoint_customer_evidence_export_hash_bound",
  "endpoint_customer_evidence_export_signed",
  "endpoint_customer_evidence_export_timestamped",
  "endpoint_customer_evidence_export_exported",
  "endpoint_customer_evidence_export_delivered_to_customer",
  "endpoint_customer_evidence_export_customer_acknowledged",
  "endpoint_customer_evidence_export_download_ready",
  "endpoint_customer_evidence_export_api_ready",
  "endpoint_customer_evidence_export_file_ready",
  "endpoint_customer_evidence_export_reconstruction_ready",
  "endpoint_customer_evidence_export_verifier_ready",
  "endpoint_customer_evidence_export_ready",
  "endpoint_customer_evidence_export_success",
  "endpoint_customer_evidence_export_production_ready",
  "endpoint_customer_evidence_export_customer_ready",
  "endpoint_customer_evidence_export_legal_certification_created"
];

const inheritedFalseClaims = [
  "endpoint_qualified_verification_report_validated",
  "endpoint_qualified_verification_report_hash_bound",
  "endpoint_qualified_verification_report_signed",
  "endpoint_qualified_verification_report_exported",
  "endpoint_qualified_verification_report_reconstruction_ready",
  "endpoint_qualified_verification_report_verifier_ready",
  "endpoint_qualified_verification_report_qualified_verification_completed",
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

for (const key of [...exportFalseClaims, ...inheritedFalseClaims]) {
  check(key, d[key], false);
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
check("false_claim_property_count", falseClaimCount, 1615);

const requiredNonClaimEntries = [
  "no_endpoint_customer_evidence_export_created_claim",
  "no_endpoint_customer_evidence_export_validated_claim",
  "no_endpoint_customer_evidence_export_manifest_validated_claim",
  "no_endpoint_customer_evidence_export_manifest_hash_validated_claim",
  "no_endpoint_customer_evidence_export_canonical_payload_validated_claim",
  "no_endpoint_customer_evidence_export_hash_bound_claim",
  "no_endpoint_customer_evidence_export_signed_claim",
  "no_endpoint_customer_evidence_export_timestamped_claim",
  "no_endpoint_customer_evidence_export_exported_claim",
  "no_endpoint_customer_evidence_export_delivered_to_customer_claim",
  "no_endpoint_customer_evidence_export_customer_acknowledged_claim",
  "no_endpoint_customer_evidence_export_download_ready_claim",
  "no_endpoint_customer_evidence_export_api_ready_claim",
  "no_endpoint_customer_evidence_export_file_ready_claim",
  "no_endpoint_customer_evidence_export_reconstruction_ready_claim",
  "no_endpoint_customer_evidence_export_verifier_ready_claim",
  "no_endpoint_customer_evidence_export_ready_claim",
  "no_endpoint_customer_evidence_export_success_claim",
  "no_endpoint_customer_evidence_export_production_ready_claim",
  "no_endpoint_customer_evidence_export_customer_ready_claim",
  "no_endpoint_customer_evidence_export_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!nonClaims.includes(item)) {
    console.log(`VALIDATOR_NON_CLAIM_ENTRY_MISSING ${item}`);
    ok = false;
  }
}

const requiredBoundaryEntries = [
  "endpoint_customer_evidence_export_created_false",
  "endpoint_customer_evidence_export_validated_false",
  "endpoint_customer_evidence_export_manifest_validated_false",
  "endpoint_customer_evidence_export_manifest_hash_validated_false",
  "endpoint_customer_evidence_export_canonical_payload_validated_false",
  "endpoint_customer_evidence_export_hash_bound_false",
  "endpoint_customer_evidence_export_signed_false",
  "endpoint_customer_evidence_export_timestamped_false",
  "endpoint_customer_evidence_export_exported_false",
  "endpoint_customer_evidence_export_delivered_to_customer_false",
  "endpoint_customer_evidence_export_customer_acknowledged_false",
  "endpoint_customer_evidence_export_download_ready_false",
  "endpoint_customer_evidence_export_api_ready_false",
  "endpoint_customer_evidence_export_file_ready_false",
  "endpoint_customer_evidence_export_reconstruction_ready_false",
  "endpoint_customer_evidence_export_verifier_ready_false",
  "endpoint_customer_evidence_export_ready_false",
  "endpoint_customer_evidence_export_success_false",
  "endpoint_customer_evidence_export_production_ready_false",
  "endpoint_customer_evidence_export_customer_ready_false",
  "endpoint_customer_evidence_export_legal_certification_created_false"
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
  required_endpoint_customer_evidence_export_conformance_field_count: d.required_endpoint_customer_evidence_export_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_customer_evidence_export_created: d.endpoint_customer_evidence_export_created,
  endpoint_customer_evidence_export_validated: d.endpoint_customer_evidence_export_validated,
  endpoint_customer_evidence_export_hash_bound: d.endpoint_customer_evidence_export_hash_bound,
  endpoint_customer_evidence_export_signed: d.endpoint_customer_evidence_export_signed,
  endpoint_customer_evidence_export_timestamped: d.endpoint_customer_evidence_export_timestamped,
  endpoint_customer_evidence_export_exported: d.endpoint_customer_evidence_export_exported,
  endpoint_customer_evidence_export_delivered_to_customer: d.endpoint_customer_evidence_export_delivered_to_customer,
  endpoint_customer_evidence_export_customer_acknowledged: d.endpoint_customer_evidence_export_customer_acknowledged,
  endpoint_customer_evidence_export_reconstruction_ready: d.endpoint_customer_evidence_export_reconstruction_ready,
  endpoint_customer_evidence_export_verifier_ready: d.endpoint_customer_evidence_export_verifier_ready,
  endpoint_customer_evidence_export_ready: d.endpoint_customer_evidence_export_ready,
  endpoint_customer_evidence_export_success: d.endpoint_customer_evidence_export_success,
  endpoint_customer_evidence_export_production_ready: d.endpoint_customer_evidence_export_production_ready,
  endpoint_customer_evidence_export_customer_ready: d.endpoint_customer_evidence_export_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_326_ENDPOINT_CUSTOMER_EVIDENCE_EXPORT_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
