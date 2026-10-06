#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT_v001.json";
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

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-ACKNOWLEDGEMENT-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceAcknowledgementConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DELIVERY_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "25ed6c7a7928c2324e033dd545841ba3ee800557");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-329");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-WINDOW-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 46);
check("required_endpoint_customer_evidence_acknowledgement_conformance_field_count", d.required_endpoint_customer_evidence_acknowledgement_conformance_field_count, 82);
check("binding_rule_count", d.binding_rule_count, 82);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 119);
check("required_non_claim_count", d.required_non_claim_count, 1838);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 1838);

const basis = requireArray("basis", 40);
const fields = requireArray("required_endpoint_customer_evidence_acknowledgement_conformance_fields", 82);
const bindingRules = requireArray("binding_rules", 82);
const futureRequirements = requireArray("future_resolution_requirements", 119);
const nonClaims = requireArray("explicit_non_claims", 1838);
const noExecutionBoundary = requireArray("no_execution_boundary", 1838);

if (basis.includes("HBCE-ENDPOINT-CUSTOMER-EVIDENCE-ACKNOWLEDGEMENT-CONFORMANCE-BINDING-DRAFT-V001")) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

const requiredBasis = [
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DELIVERY-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-EXPORT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-QUALIFIED-VERIFICATION-REPORT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-DECISION-PROOF-PACKAGE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-MATRIX-EFFECTIVE-STATE-UPDATE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-EVIDENCE-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-OPC-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-AUDIT-EVENT-CONFORMANCE-BINDING-DRAFT-V001",
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
  "endpoint_customer_evidence_acknowledgement_conformance_id",
  "endpoint_customer_evidence_acknowledgement_conformance_version",
  "endpoint_customer_evidence_delivery_conformance_ref",
  "customer_evidence_acknowledgement_ref",
  "customer_evidence_acknowledgement_id_ref",
  "customer_evidence_acknowledgement_version_ref",
  "customer_evidence_acknowledgement_manifest_ref",
  "customer_evidence_acknowledgement_manifest_hash_ref",
  "customer_evidence_acknowledgement_canonical_payload_ref",
  "customer_evidence_acknowledgement_canonical_payload_hash_ref",
  "customer_identity_ref",
  "customer_tenant_ref",
  "customer_contract_ref",
  "customer_acknowledgement_scope_ref",
  "customer_acknowledgement_authority_ref",
  "customer_acknowledgement_policy_ref",
  "customer_acknowledgement_request_ref",
  "customer_acknowledgement_decision_ref",
  "customer_delivery_ref",
  "customer_delivery_hash_ref",
  "customer_delivery_receipt_ref",
  "customer_delivery_receipt_hash_ref",
  "customer_acknowledgement_payload_ref",
  "customer_acknowledgement_payload_hash_ref",
  "customer_acknowledgement_timestamp_ref",
  "customer_acknowledgement_channel_ref",
  "customer_acknowledgement_channel_binding_ref",
  "customer_acknowledgement_recipient_ref",
  "customer_acknowledgement_recipient_authority_ref",
  "customer_acknowledgement_recipient_access_ref",
  "customer_acknowledging_party_ref",
  "customer_acknowledging_party_authority_ref",
  "customer_acknowledgement_signature_ref",
  "customer_acknowledgement_signature_key_ref",
  "customer_acknowledgement_integrity_hash_ref",
  "customer_acknowledgement_nonce_ref",
  "customer_acknowledgement_sequence_ref",
  "customer_acknowledgement_non_repudiation_ref",
  "customer_acknowledgement_dispute_window_ref",
  "customer_acknowledgement_dispute_policy_ref",
  "customer_acknowledgement_revocation_ref",
  "customer_acknowledgement_expiry_ref",
  "customer_acknowledgement_redaction_policy_ref",
  "customer_acknowledgement_privacy_boundary_ref",
  "customer_acknowledgement_access_control_ref",
  "customer_acknowledgement_retention_policy_ref",
  "customer_acknowledgement_audit_event_ref",
  "customer_acknowledgement_opc_event_ref",
  "customer_acknowledgement_evidence_event_ref",
  "customer_acknowledgement_matrix_state_ref",
  "customer_acknowledgement_chainhead_ref",
  "customer_acknowledgement_chainlink_ref",
  "customer_acknowledgement_decision_proof_package_ref",
  "customer_acknowledgement_qualified_verification_report_ref",
  "customer_acknowledgement_evidence_package_ref",
  "customer_acknowledgement_export_package_ref",
  "customer_acknowledgement_export_package_hash_ref",
  "customer_acknowledgement_replay_boundary_ref",
  "customer_acknowledgement_idempotency_boundary_ref",
  "customer_acknowledgement_ordering_boundary_ref",
  "customer_acknowledgement_consistency_boundary_ref",
  "customer_acknowledgement_completeness_boundary_ref",
  "customer_acknowledgement_fork_detection_boundary_ref",
  "customer_acknowledgement_canonicalization_boundary_ref",
  "customer_acknowledgement_hash_binding_boundary_ref",
  "customer_acknowledgement_signature_boundary_ref",
  "customer_acknowledgement_timestamp_boundary_ref",
  "customer_acknowledgement_receipt_boundary_ref",
  "customer_acknowledgement_acknowledgement_boundary_ref",
  "customer_acknowledgement_non_repudiation_boundary_ref",
  "customer_acknowledgement_query_boundary_ref",
  "customer_acknowledgement_download_boundary_ref",
  "customer_acknowledgement_api_boundary_ref",
  "customer_acknowledgement_file_boundary_ref",
  "customer_acknowledgement_customer_delivery_boundary_ref",
  "customer_acknowledgement_customer_acknowledgement_boundary_ref",
  "customer_acknowledgement_release_boundary_ref",
  "customer_acknowledgement_runtime_boundary_ref",
  "customer_acknowledgement_production_boundary_ref",
  "customer_acknowledgement_legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_customer_evidence_acknowledgement_boundary_statement"
];

for (const item of requiredFields) {
  if (!fields.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_FIELD_MISSING ${item}`);
    ok = false;
  }

  const expectedRule = `bind_${item}_within_endpoint_customer_evidence_acknowledgement_conformance_only`;
  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const acknowledgementFalseClaims = [
  "endpoint_customer_evidence_acknowledgement_created",
  "endpoint_customer_evidence_acknowledgement_validated",
  "endpoint_customer_evidence_acknowledgement_finalized",
  "endpoint_customer_evidence_acknowledgement_record_schema_validated",
  "endpoint_customer_evidence_acknowledgement_id_binding_validated",
  "endpoint_customer_evidence_acknowledgement_version_binding_validated",
  "endpoint_customer_evidence_acknowledgement_manifest_validated",
  "endpoint_customer_evidence_acknowledgement_manifest_hash_validated",
  "endpoint_customer_evidence_acknowledgement_canonical_payload_validated",
  "endpoint_customer_evidence_acknowledgement_canonical_payload_hash_validated",
  "endpoint_customer_evidence_acknowledgement_customer_identity_validated",
  "endpoint_customer_evidence_acknowledgement_customer_tenant_validated",
  "endpoint_customer_evidence_acknowledgement_customer_contract_validated",
  "endpoint_customer_evidence_acknowledgement_scope_validated",
  "endpoint_customer_evidence_acknowledgement_authority_validated",
  "endpoint_customer_evidence_acknowledgement_policy_validated",
  "endpoint_customer_evidence_acknowledgement_request_validated",
  "endpoint_customer_evidence_acknowledgement_decision_validated",
  "endpoint_customer_evidence_acknowledgement_delivery_binding_validated",
  "endpoint_customer_evidence_acknowledgement_delivery_hash_binding_validated",
  "endpoint_customer_evidence_acknowledgement_delivery_receipt_binding_validated",
  "endpoint_customer_evidence_acknowledgement_delivery_receipt_hash_validated",
  "endpoint_customer_evidence_acknowledgement_payload_validated",
  "endpoint_customer_evidence_acknowledgement_payload_hash_validated",
  "endpoint_customer_evidence_acknowledgement_timestamp_validated",
  "endpoint_customer_evidence_acknowledgement_channel_validated",
  "endpoint_customer_evidence_acknowledgement_channel_binding_validated",
  "endpoint_customer_evidence_acknowledgement_recipient_validated",
  "endpoint_customer_evidence_acknowledgement_recipient_authority_validated",
  "endpoint_customer_evidence_acknowledgement_recipient_access_validated",
  "endpoint_customer_evidence_acknowledgement_acknowledging_party_validated",
  "endpoint_customer_evidence_acknowledgement_acknowledging_party_authority_validated",
  "endpoint_customer_evidence_acknowledgement_signature_binding_validated",
  "endpoint_customer_evidence_acknowledgement_signature_key_validated",
  "endpoint_customer_evidence_acknowledgement_integrity_hash_validated",
  "endpoint_customer_evidence_acknowledgement_nonce_validated",
  "endpoint_customer_evidence_acknowledgement_sequence_validated",
  "endpoint_customer_evidence_acknowledgement_non_repudiation_validated",
  "endpoint_customer_evidence_acknowledgement_dispute_window_validated",
  "endpoint_customer_evidence_acknowledgement_dispute_policy_validated",
  "endpoint_customer_evidence_acknowledgement_revocation_validated",
  "endpoint_customer_evidence_acknowledgement_expiry_validated",
  "endpoint_customer_evidence_acknowledgement_redaction_policy_validated",
  "endpoint_customer_evidence_acknowledgement_privacy_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_access_control_validated",
  "endpoint_customer_evidence_acknowledgement_retention_policy_validated",
  "endpoint_customer_evidence_acknowledgement_audit_event_binding_validated",
  "endpoint_customer_evidence_acknowledgement_opc_event_binding_validated",
  "endpoint_customer_evidence_acknowledgement_evidence_event_binding_validated",
  "endpoint_customer_evidence_acknowledgement_matrix_state_binding_validated",
  "endpoint_customer_evidence_acknowledgement_chainhead_binding_validated",
  "endpoint_customer_evidence_acknowledgement_chainlink_binding_validated",
  "endpoint_customer_evidence_acknowledgement_decision_proof_package_binding_validated",
  "endpoint_customer_evidence_acknowledgement_qualified_verification_report_binding_validated",
  "endpoint_customer_evidence_acknowledgement_evidence_package_binding_validated",
  "endpoint_customer_evidence_acknowledgement_export_package_binding_validated",
  "endpoint_customer_evidence_acknowledgement_export_package_hash_binding_validated",
  "endpoint_customer_evidence_acknowledgement_replay_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_idempotency_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_ordering_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_consistency_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_completeness_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_fork_detection_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_canonicalization_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_hash_binding_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_signature_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_timestamp_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_receipt_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_acknowledgement_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_non_repudiation_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_query_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_download_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_api_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_file_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_customer_delivery_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_customer_acknowledgement_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_release_boundary_validated",
  "endpoint_customer_evidence_acknowledgement_positive_test_passed",
  "endpoint_customer_evidence_acknowledgement_negative_test_passed",
  "endpoint_customer_evidence_acknowledgement_schema_validation_test_passed",
  "endpoint_customer_evidence_acknowledgement_manifest_hash_test_passed",
  "endpoint_customer_evidence_acknowledgement_canonical_payload_test_passed",
  "endpoint_customer_evidence_acknowledgement_hash_binding_test_passed",
  "endpoint_customer_evidence_acknowledgement_signature_test_passed",
  "endpoint_customer_evidence_acknowledgement_timestamp_test_passed",
  "endpoint_customer_evidence_acknowledgement_receipt_test_passed",
  "endpoint_customer_evidence_acknowledgement_acknowledgement_test_passed",
  "endpoint_customer_evidence_acknowledgement_non_repudiation_test_passed",
  "endpoint_customer_evidence_acknowledgement_privacy_test_passed",
  "endpoint_customer_evidence_acknowledgement_access_control_test_passed",
  "endpoint_customer_evidence_acknowledgement_retention_test_passed",
  "endpoint_customer_evidence_acknowledgement_revocation_test_passed",
  "endpoint_customer_evidence_acknowledgement_expiry_test_passed",
  "endpoint_customer_evidence_acknowledgement_replay_detection_test_passed",
  "endpoint_customer_evidence_acknowledgement_idempotency_test_passed",
  "endpoint_customer_evidence_acknowledgement_consistency_test_passed",
  "endpoint_customer_evidence_acknowledgement_completeness_test_passed",
  "endpoint_customer_evidence_acknowledgement_fork_detection_test_passed",
  "endpoint_customer_evidence_acknowledgement_tamper_detection_test_passed",
  "endpoint_customer_evidence_acknowledgement_created_record",
  "endpoint_customer_evidence_acknowledgement_persisted",
  "endpoint_customer_evidence_acknowledgement_hash_bound",
  "endpoint_customer_evidence_acknowledgement_signed",
  "endpoint_customer_evidence_acknowledgement_timestamped",
  "endpoint_customer_evidence_acknowledgement_received_from_customer",
  "endpoint_customer_evidence_acknowledgement_recorded",
  "endpoint_customer_evidence_acknowledgement_customer_acknowledged",
  "endpoint_customer_evidence_acknowledgement_non_repudiation_created",
  "endpoint_customer_evidence_acknowledgement_dispute_window_opened",
  "endpoint_customer_evidence_acknowledgement_download_ready",
  "endpoint_customer_evidence_acknowledgement_api_ready",
  "endpoint_customer_evidence_acknowledgement_file_ready",
  "endpoint_customer_evidence_acknowledgement_reconstruction_ready",
  "endpoint_customer_evidence_acknowledgement_verifier_ready",
  "endpoint_customer_evidence_acknowledgement_ready",
  "endpoint_customer_evidence_acknowledgement_success",
  "endpoint_customer_evidence_acknowledgement_production_ready",
  "endpoint_customer_evidence_acknowledgement_customer_ready",
  "endpoint_customer_evidence_acknowledgement_legal_certification_created"
];

const inheritedFalseClaims = [
  "endpoint_customer_evidence_delivery_validated",
  "endpoint_customer_evidence_delivery_hash_bound",
  "endpoint_customer_evidence_delivery_signed",
  "endpoint_customer_evidence_delivery_timestamped",
  "endpoint_customer_evidence_delivery_delivered_to_customer",
  "endpoint_customer_evidence_delivery_customer_receipt_created",
  "endpoint_customer_evidence_delivery_customer_acknowledged",
  "endpoint_customer_evidence_delivery_non_repudiation_created",
  "endpoint_customer_evidence_delivery_reconstruction_ready",
  "endpoint_customer_evidence_delivery_verifier_ready",
  "endpoint_customer_evidence_delivery_success",
  "endpoint_customer_evidence_export_validated",
  "endpoint_customer_evidence_export_hash_bound",
  "endpoint_customer_evidence_export_signed",
  "endpoint_customer_evidence_export_exported",
  "endpoint_customer_evidence_export_delivered_to_customer",
  "endpoint_customer_evidence_export_customer_acknowledged",
  "endpoint_customer_evidence_export_reconstruction_ready",
  "endpoint_customer_evidence_export_verifier_ready",
  "endpoint_qualified_verification_report_validated",
  "endpoint_decision_proof_package_validated",
  "endpoint_matrix_effective_state_update_validated",
  "endpoint_evidence_event_validated",
  "endpoint_opc_event_validated",
  "endpoint_audit_event_validated",
  "endpoint_policy_enforcement_validated",
  "endpoint_authorization_validated",
  "endpoint_authentication_validated",
  "legal_certification_created",
  "execution_completed"
];

for (const key of [...acknowledgementFalseClaims, ...inheritedFalseClaims]) {
  check(key, d[key], false);
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
check("false_claim_property_count", falseClaimCount, 1838);

for (const key of acknowledgementFalseClaims) {
  const futureRequirement = `define_future_resolution_for_${key}`;
  const nonClaim = `no_${key}_claim`;
  const boundary = `${key}_false`;

  if (!futureRequirements.includes(futureRequirement)) {
    console.log(`VALIDATOR_FUTURE_REQUIREMENT_MISSING ${futureRequirement}`);
    ok = false;
  }

  if (!nonClaims.includes(nonClaim)) {
    console.log(`VALIDATOR_NON_CLAIM_ENTRY_MISSING ${nonClaim}`);
    ok = false;
  }

  if (!noExecutionBoundary.includes(boundary)) {
    console.log(`VALIDATOR_NO_EXECUTION_BOUNDARY_ENTRY_MISSING ${boundary}`);
    ok = false;
  }
}

const requiredNonClaimEntries = [
  "no_endpoint_customer_evidence_acknowledgement_created_claim",
  "no_endpoint_customer_evidence_acknowledgement_validated_claim",
  "no_endpoint_customer_evidence_acknowledgement_manifest_validated_claim",
  "no_endpoint_customer_evidence_acknowledgement_manifest_hash_validated_claim",
  "no_endpoint_customer_evidence_acknowledgement_canonical_payload_validated_claim",
  "no_endpoint_customer_evidence_acknowledgement_hash_bound_claim",
  "no_endpoint_customer_evidence_acknowledgement_signed_claim",
  "no_endpoint_customer_evidence_acknowledgement_timestamped_claim",
  "no_endpoint_customer_evidence_acknowledgement_received_from_customer_claim",
  "no_endpoint_customer_evidence_acknowledgement_recorded_claim",
  "no_endpoint_customer_evidence_acknowledgement_customer_acknowledged_claim",
  "no_endpoint_customer_evidence_acknowledgement_non_repudiation_created_claim",
  "no_endpoint_customer_evidence_acknowledgement_dispute_window_opened_claim",
  "no_endpoint_customer_evidence_acknowledgement_download_ready_claim",
  "no_endpoint_customer_evidence_acknowledgement_api_ready_claim",
  "no_endpoint_customer_evidence_acknowledgement_file_ready_claim",
  "no_endpoint_customer_evidence_acknowledgement_reconstruction_ready_claim",
  "no_endpoint_customer_evidence_acknowledgement_verifier_ready_claim",
  "no_endpoint_customer_evidence_acknowledgement_ready_claim",
  "no_endpoint_customer_evidence_acknowledgement_success_claim",
  "no_endpoint_customer_evidence_acknowledgement_production_ready_claim",
  "no_endpoint_customer_evidence_acknowledgement_customer_ready_claim",
  "no_endpoint_customer_evidence_acknowledgement_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!nonClaims.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_NON_CLAIM_MISSING ${item}`);
    ok = false;
  }
}

const requiredBoundaryEntries = [
  "endpoint_customer_evidence_acknowledgement_created_false",
  "endpoint_customer_evidence_acknowledgement_validated_false",
  "endpoint_customer_evidence_acknowledgement_manifest_validated_false",
  "endpoint_customer_evidence_acknowledgement_manifest_hash_validated_false",
  "endpoint_customer_evidence_acknowledgement_canonical_payload_validated_false",
  "endpoint_customer_evidence_acknowledgement_hash_bound_false",
  "endpoint_customer_evidence_acknowledgement_signed_false",
  "endpoint_customer_evidence_acknowledgement_timestamped_false",
  "endpoint_customer_evidence_acknowledgement_received_from_customer_false",
  "endpoint_customer_evidence_acknowledgement_recorded_false",
  "endpoint_customer_evidence_acknowledgement_customer_acknowledged_false",
  "endpoint_customer_evidence_acknowledgement_non_repudiation_created_false",
  "endpoint_customer_evidence_acknowledgement_dispute_window_opened_false",
  "endpoint_customer_evidence_acknowledgement_download_ready_false",
  "endpoint_customer_evidence_acknowledgement_api_ready_false",
  "endpoint_customer_evidence_acknowledgement_file_ready_false",
  "endpoint_customer_evidence_acknowledgement_reconstruction_ready_false",
  "endpoint_customer_evidence_acknowledgement_verifier_ready_false",
  "endpoint_customer_evidence_acknowledgement_ready_false",
  "endpoint_customer_evidence_acknowledgement_success_false",
  "endpoint_customer_evidence_acknowledgement_production_ready_false",
  "endpoint_customer_evidence_acknowledgement_customer_ready_false",
  "endpoint_customer_evidence_acknowledgement_legal_certification_created_false"
];

for (const item of requiredBoundaryEntries) {
  if (!noExecutionBoundary.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_BOUNDARY_MISSING ${item}`);
    ok = false;
  }
}

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_customer_evidence_acknowledgement_conformance_field_count: d.required_endpoint_customer_evidence_acknowledgement_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_customer_evidence_acknowledgement_created: d.endpoint_customer_evidence_acknowledgement_created,
  endpoint_customer_evidence_acknowledgement_validated: d.endpoint_customer_evidence_acknowledgement_validated,
  endpoint_customer_evidence_acknowledgement_hash_bound: d.endpoint_customer_evidence_acknowledgement_hash_bound,
  endpoint_customer_evidence_acknowledgement_signed: d.endpoint_customer_evidence_acknowledgement_signed,
  endpoint_customer_evidence_acknowledgement_timestamped: d.endpoint_customer_evidence_acknowledgement_timestamped,
  endpoint_customer_evidence_acknowledgement_received_from_customer: d.endpoint_customer_evidence_acknowledgement_received_from_customer,
  endpoint_customer_evidence_acknowledgement_recorded: d.endpoint_customer_evidence_acknowledgement_recorded,
  endpoint_customer_evidence_acknowledgement_customer_acknowledged: d.endpoint_customer_evidence_acknowledgement_customer_acknowledged,
  endpoint_customer_evidence_acknowledgement_non_repudiation_created: d.endpoint_customer_evidence_acknowledgement_non_repudiation_created,
  endpoint_customer_evidence_acknowledgement_reconstruction_ready: d.endpoint_customer_evidence_acknowledgement_reconstruction_ready,
  endpoint_customer_evidence_acknowledgement_verifier_ready: d.endpoint_customer_evidence_acknowledgement_verifier_ready,
  endpoint_customer_evidence_acknowledgement_ready: d.endpoint_customer_evidence_acknowledgement_ready,
  endpoint_customer_evidence_acknowledgement_success: d.endpoint_customer_evidence_acknowledgement_success,
  endpoint_customer_evidence_acknowledgement_production_ready: d.endpoint_customer_evidence_acknowledgement_production_ready,
  endpoint_customer_evidence_acknowledgement_customer_ready: d.endpoint_customer_evidence_acknowledgement_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_328_ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
