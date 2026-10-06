#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261005_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT_v001.json";
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

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-WINDOW-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeWindowConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_ACKNOWLEDGEMENT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "46b4aee258cb55591d24d47b832dcaa4582204ef");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-330");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-RESOLUTION-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 47);
check("required_endpoint_customer_evidence_dispute_window_conformance_field_count", d.required_endpoint_customer_evidence_dispute_window_conformance_field_count, 86);
check("binding_rule_count", d.binding_rule_count, 86);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 128);
check("required_non_claim_count", d.required_non_claim_count, 1966);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 1966);

const basis = requireArray("basis", 41);
const fields = requireArray("required_endpoint_customer_evidence_dispute_window_conformance_fields", 86);
const bindingRules = requireArray("binding_rules", 86);
const futureRequirements = requireArray("future_resolution_requirements", 128);
const nonClaims = requireArray("explicit_non_claims", 1966);
const noExecutionBoundary = requireArray("no_execution_boundary", 1966);

if (basis.includes("HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-WINDOW-CONFORMANCE-BINDING-DRAFT-V001")) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

const requiredBasis = [
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-ACKNOWLEDGEMENT-CONFORMANCE-BINDING-DRAFT-V001",
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
  "endpoint_customer_evidence_dispute_window_conformance_id",
  "endpoint_customer_evidence_dispute_window_conformance_version",
  "endpoint_customer_evidence_acknowledgement_conformance_ref",
  "customer_evidence_dispute_window_ref",
  "customer_evidence_dispute_window_id_ref",
  "customer_evidence_dispute_window_manifest_ref",
  "customer_evidence_dispute_window_manifest_hash_ref",
  "customer_evidence_dispute_window_canonical_payload_ref",
  "customer_evidence_dispute_window_canonical_payload_hash_ref",
  "customer_identity_ref",
  "customer_tenant_ref",
  "customer_contract_ref",
  "customer_evidence_delivery_ref",
  "customer_evidence_delivery_hash_ref",
  "customer_evidence_delivery_receipt_ref",
  "customer_evidence_acknowledgement_ref",
  "customer_evidence_acknowledgement_hash_ref",
  "customer_acknowledgement_timestamp_ref",
  "dispute_window_start_ref",
  "dispute_window_end_ref",
  "dispute_window_duration_ref",
  "dispute_window_timezone_ref",
  "dispute_window_clock_source_ref",
  "dispute_window_policy_ref",
  "dispute_window_authority_ref",
  "dispute_window_trigger_ref",
  "dispute_window_opening_event_ref",
  "dispute_window_closing_event_ref",
  "dispute_submission_channel_ref",
  "dispute_submission_deadline_ref",
  "dispute_submission_actor_ref",
  "dispute_submission_actor_authority_ref",
  "dispute_submission_payload_ref",
  "dispute_submission_payload_hash_ref",
  "dispute_submission_signature_ref",
  "dispute_submission_timestamp_ref",
  "dispute_acceptance_criteria_ref",
  "dispute_rejection_criteria_ref",
  "dispute_exception_criteria_ref",
  "dispute_status_ref",
  "dispute_status_reason_ref",
  "dispute_resolution_ref",
  "dispute_resolution_deadline_ref",
  "dispute_evidence_hold_ref",
  "dispute_evidence_hold_hash_ref",
  "dispute_evidence_package_ref",
  "dispute_export_package_ref",
  "dispute_decision_proof_package_ref",
  "dispute_qualified_verification_report_ref",
  "dispute_matrix_state_ref",
  "dispute_chainhead_ref",
  "dispute_chainlink_ref",
  "dispute_audit_event_ref",
  "dispute_opc_event_ref",
  "dispute_evidence_event_ref",
  "dispute_redaction_policy_ref",
  "dispute_privacy_boundary_ref",
  "dispute_access_control_ref",
  "dispute_retention_policy_ref",
  "dispute_revocation_ref",
  "dispute_expiry_ref",
  "dispute_replay_boundary_ref",
  "dispute_idempotency_boundary_ref",
  "dispute_ordering_boundary_ref",
  "dispute_consistency_boundary_ref",
  "dispute_completeness_boundary_ref",
  "dispute_fork_detection_boundary_ref",
  "dispute_canonicalization_boundary_ref",
  "dispute_hash_binding_boundary_ref",
  "dispute_signature_boundary_ref",
  "dispute_timestamp_boundary_ref",
  "dispute_non_repudiation_boundary_ref",
  "dispute_query_boundary_ref",
  "dispute_download_boundary_ref",
  "dispute_api_boundary_ref",
  "dispute_file_boundary_ref",
  "dispute_customer_delivery_boundary_ref",
  "dispute_customer_acknowledgement_boundary_ref",
  "dispute_dispute_window_boundary_ref",
  "dispute_release_boundary_ref",
  "dispute_runtime_boundary_ref",
  "dispute_production_boundary_ref",
  "dispute_legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_customer_evidence_dispute_window_boundary_statement"
];

for (const item of requiredFields) {
  if (!fields.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_FIELD_MISSING ${item}`);
    ok = false;
  }

  const expectedRule = `bind_${item}_within_endpoint_customer_evidence_dispute_window_conformance_only`;
  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
check("false_claim_property_count", falseClaimCount, 1966);

const disputeFalseClaims = Object.keys(d)
  .filter((key) => key.startsWith("endpoint_customer_evidence_dispute_window_") && d[key] === false)
  .sort();

check("dispute_window_false_claim_count", disputeFalseClaims.length, 128);

for (const key of disputeFalseClaims) {
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

const criticalFalseClaims = [
  "endpoint_customer_evidence_dispute_window_created",
  "endpoint_customer_evidence_dispute_window_validated",
  "endpoint_customer_evidence_dispute_window_finalized",
  "endpoint_customer_evidence_dispute_window_manifest_validated",
  "endpoint_customer_evidence_dispute_window_manifest_hash_validated",
  "endpoint_customer_evidence_dispute_window_canonical_payload_validated",
  "endpoint_customer_evidence_dispute_window_canonical_payload_hash_validated",
  "endpoint_customer_evidence_dispute_window_customer_identity_validated",
  "endpoint_customer_evidence_dispute_window_delivery_binding_validated",
  "endpoint_customer_evidence_dispute_window_acknowledgement_binding_validated",
  "endpoint_customer_evidence_dispute_window_start_validated",
  "endpoint_customer_evidence_dispute_window_end_validated",
  "endpoint_customer_evidence_dispute_window_duration_validated",
  "endpoint_customer_evidence_dispute_window_timezone_validated",
  "endpoint_customer_evidence_dispute_window_clock_source_validated",
  "endpoint_customer_evidence_dispute_window_policy_validated",
  "endpoint_customer_evidence_dispute_window_authority_validated",
  "endpoint_customer_evidence_dispute_window_opening_event_validated",
  "endpoint_customer_evidence_dispute_window_closing_event_validated",
  "endpoint_customer_evidence_dispute_window_submission_channel_validated",
  "endpoint_customer_evidence_dispute_window_submission_deadline_validated",
  "endpoint_customer_evidence_dispute_window_submission_actor_validated",
  "endpoint_customer_evidence_dispute_window_submission_payload_validated",
  "endpoint_customer_evidence_dispute_window_submission_payload_hash_validated",
  "endpoint_customer_evidence_dispute_window_signature_binding_validated",
  "endpoint_customer_evidence_dispute_window_timestamp_validated",
  "endpoint_customer_evidence_dispute_window_acceptance_criteria_validated",
  "endpoint_customer_evidence_dispute_window_rejection_criteria_validated",
  "endpoint_customer_evidence_dispute_window_exception_criteria_validated",
  "endpoint_customer_evidence_dispute_window_status_validated",
  "endpoint_customer_evidence_dispute_window_status_reason_validated",
  "endpoint_customer_evidence_dispute_window_resolution_validated",
  "endpoint_customer_evidence_dispute_window_resolution_deadline_validated",
  "endpoint_customer_evidence_dispute_window_evidence_hold_validated",
  "endpoint_customer_evidence_dispute_window_evidence_hold_hash_validated",
  "endpoint_customer_evidence_dispute_window_non_repudiation_boundary_validated",
  "endpoint_customer_evidence_dispute_window_created_record",
  "endpoint_customer_evidence_dispute_window_persisted",
  "endpoint_customer_evidence_dispute_window_hash_bound",
  "endpoint_customer_evidence_dispute_window_signed",
  "endpoint_customer_evidence_dispute_window_timestamped",
  "endpoint_customer_evidence_dispute_window_opened",
  "endpoint_customer_evidence_dispute_window_closed",
  "endpoint_customer_evidence_dispute_window_active",
  "endpoint_customer_evidence_dispute_window_expired",
  "endpoint_customer_evidence_dispute_window_submission_received",
  "endpoint_customer_evidence_dispute_window_submission_recorded",
  "endpoint_customer_evidence_dispute_window_customer_disputed",
  "endpoint_customer_evidence_dispute_window_customer_no_dispute_recorded",
  "endpoint_customer_evidence_dispute_window_non_repudiation_created",
  "endpoint_customer_evidence_dispute_window_evidence_hold_created",
  "endpoint_customer_evidence_dispute_window_download_ready",
  "endpoint_customer_evidence_dispute_window_api_ready",
  "endpoint_customer_evidence_dispute_window_file_ready",
  "endpoint_customer_evidence_dispute_window_reconstruction_ready",
  "endpoint_customer_evidence_dispute_window_verifier_ready",
  "endpoint_customer_evidence_dispute_window_ready",
  "endpoint_customer_evidence_dispute_window_success",
  "endpoint_customer_evidence_dispute_window_production_ready",
  "endpoint_customer_evidence_dispute_window_customer_ready",
  "endpoint_customer_evidence_dispute_window_legal_certification_created",
  "endpoint_customer_evidence_acknowledgement_validated",
  "endpoint_customer_evidence_acknowledgement_hash_bound",
  "endpoint_customer_evidence_acknowledgement_signed",
  "endpoint_customer_evidence_acknowledgement_timestamped",
  "endpoint_customer_evidence_acknowledgement_received_from_customer",
  "endpoint_customer_evidence_acknowledgement_customer_acknowledged",
  "endpoint_customer_evidence_delivery_delivered_to_customer",
  "endpoint_customer_evidence_export_exported",
  "endpoint_qualified_verification_report_validated",
  "endpoint_decision_proof_package_validated",
  "legal_certification_created",
  "execution_completed"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const requiredNonClaimEntries = [
  "no_endpoint_customer_evidence_dispute_window_created_claim",
  "no_endpoint_customer_evidence_dispute_window_validated_claim",
  "no_endpoint_customer_evidence_dispute_window_opened_claim",
  "no_endpoint_customer_evidence_dispute_window_closed_claim",
  "no_endpoint_customer_evidence_dispute_window_active_claim",
  "no_endpoint_customer_evidence_dispute_window_expired_claim",
  "no_endpoint_customer_evidence_dispute_window_submission_received_claim",
  "no_endpoint_customer_evidence_dispute_window_submission_recorded_claim",
  "no_endpoint_customer_evidence_dispute_window_customer_disputed_claim",
  "no_endpoint_customer_evidence_dispute_window_customer_no_dispute_recorded_claim",
  "no_endpoint_customer_evidence_dispute_window_non_repudiation_created_claim",
  "no_endpoint_customer_evidence_dispute_window_evidence_hold_created_claim",
  "no_endpoint_customer_evidence_dispute_window_reconstruction_ready_claim",
  "no_endpoint_customer_evidence_dispute_window_verifier_ready_claim",
  "no_endpoint_customer_evidence_dispute_window_success_claim",
  "no_endpoint_customer_evidence_dispute_window_production_ready_claim",
  "no_endpoint_customer_evidence_dispute_window_customer_ready_claim",
  "no_endpoint_customer_evidence_dispute_window_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!nonClaims.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_NON_CLAIM_MISSING ${item}`);
    ok = false;
  }
}

const requiredBoundaryEntries = [
  "endpoint_customer_evidence_dispute_window_created_false",
  "endpoint_customer_evidence_dispute_window_validated_false",
  "endpoint_customer_evidence_dispute_window_opened_false",
  "endpoint_customer_evidence_dispute_window_closed_false",
  "endpoint_customer_evidence_dispute_window_active_false",
  "endpoint_customer_evidence_dispute_window_expired_false",
  "endpoint_customer_evidence_dispute_window_submission_received_false",
  "endpoint_customer_evidence_dispute_window_submission_recorded_false",
  "endpoint_customer_evidence_dispute_window_customer_disputed_false",
  "endpoint_customer_evidence_dispute_window_customer_no_dispute_recorded_false",
  "endpoint_customer_evidence_dispute_window_non_repudiation_created_false",
  "endpoint_customer_evidence_dispute_window_evidence_hold_created_false",
  "endpoint_customer_evidence_dispute_window_reconstruction_ready_false",
  "endpoint_customer_evidence_dispute_window_verifier_ready_false",
  "endpoint_customer_evidence_dispute_window_success_false",
  "endpoint_customer_evidence_dispute_window_production_ready_false",
  "endpoint_customer_evidence_dispute_window_customer_ready_false",
  "endpoint_customer_evidence_dispute_window_legal_certification_created_false"
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
  basis_main_commit: d.basis_main_commit,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_customer_evidence_dispute_window_conformance_field_count: d.required_endpoint_customer_evidence_dispute_window_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_customer_evidence_dispute_window_created: d.endpoint_customer_evidence_dispute_window_created,
  endpoint_customer_evidence_dispute_window_validated: d.endpoint_customer_evidence_dispute_window_validated,
  endpoint_customer_evidence_dispute_window_hash_bound: d.endpoint_customer_evidence_dispute_window_hash_bound,
  endpoint_customer_evidence_dispute_window_signed: d.endpoint_customer_evidence_dispute_window_signed,
  endpoint_customer_evidence_dispute_window_timestamped: d.endpoint_customer_evidence_dispute_window_timestamped,
  endpoint_customer_evidence_dispute_window_opened: d.endpoint_customer_evidence_dispute_window_opened,
  endpoint_customer_evidence_dispute_window_closed: d.endpoint_customer_evidence_dispute_window_closed,
  endpoint_customer_evidence_dispute_window_active: d.endpoint_customer_evidence_dispute_window_active,
  endpoint_customer_evidence_dispute_window_expired: d.endpoint_customer_evidence_dispute_window_expired,
  endpoint_customer_evidence_dispute_window_submission_received: d.endpoint_customer_evidence_dispute_window_submission_received,
  endpoint_customer_evidence_dispute_window_submission_recorded: d.endpoint_customer_evidence_dispute_window_submission_recorded,
  endpoint_customer_evidence_dispute_window_customer_disputed: d.endpoint_customer_evidence_dispute_window_customer_disputed,
  endpoint_customer_evidence_dispute_window_customer_no_dispute_recorded: d.endpoint_customer_evidence_dispute_window_customer_no_dispute_recorded,
  endpoint_customer_evidence_dispute_window_non_repudiation_created: d.endpoint_customer_evidence_dispute_window_non_repudiation_created,
  endpoint_customer_evidence_dispute_window_evidence_hold_created: d.endpoint_customer_evidence_dispute_window_evidence_hold_created,
  endpoint_customer_evidence_dispute_window_reconstruction_ready: d.endpoint_customer_evidence_dispute_window_reconstruction_ready,
  endpoint_customer_evidence_dispute_window_verifier_ready: d.endpoint_customer_evidence_dispute_window_verifier_ready,
  endpoint_customer_evidence_dispute_window_ready: d.endpoint_customer_evidence_dispute_window_ready,
  endpoint_customer_evidence_dispute_window_success: d.endpoint_customer_evidence_dispute_window_success,
  endpoint_customer_evidence_dispute_window_production_ready: d.endpoint_customer_evidence_dispute_window_production_ready,
  endpoint_customer_evidence_dispute_window_customer_ready: d.endpoint_customer_evidence_dispute_window_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_329_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_WINDOW_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
