#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261006_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT_v001.json";
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

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeClosureConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RESOLUTION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "f9e926ebf1f555ddb668c591cf5d46bf845b3133");
check("parent_object_id", d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-RESOLUTION-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker", d.parent_marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RESOLUTION_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_commit", d.parent_commit, "f9e926ebf1f555ddb668c591cf5d46bf845b3133");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-332");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-ARCHIVE-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 49);
check("required_endpoint_customer_evidence_dispute_closure_conformance_field_count", d.required_endpoint_customer_evidence_dispute_closure_conformance_field_count, 95);
check("binding_rule_count", d.binding_rule_count, 95);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 150);
check("required_non_claim_count", d.required_non_claim_count, 2264);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 2264);

const basis = requireArray("basis", 43);
const fields = requireArray("required_endpoint_customer_evidence_dispute_closure_conformance_fields", 95);
const bindingRules = requireArray("binding_rules", 95);
const futureRequirements = requireArray("future_resolution_requirements", 150);
const nonClaims = requireArray("explicit_non_claims", 2264);
const noExecutionBoundary = requireArray("no_execution_boundary", 2264);

if (basis.includes("HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001")) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

const requiredBasis = [
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-RESOLUTION-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-WINDOW-CONFORMANCE-BINDING-DRAFT-V001",
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
  "endpoint_customer_evidence_dispute_closure_conformance_id",
  "endpoint_customer_evidence_dispute_closure_conformance_version",
  "endpoint_customer_evidence_dispute_resolution_conformance_ref",
  "customer_evidence_dispute_closure_ref",
  "customer_evidence_dispute_closure_id_ref",
  "customer_evidence_dispute_closure_manifest_ref",
  "customer_evidence_dispute_closure_manifest_hash_ref",
  "customer_evidence_dispute_closure_canonical_payload_ref",
  "customer_evidence_dispute_closure_canonical_payload_hash_ref",
  "customer_identity_ref",
  "customer_tenant_ref",
  "customer_contract_ref",
  "customer_evidence_delivery_ref",
  "customer_evidence_acknowledgement_ref",
  "customer_evidence_dispute_window_ref",
  "customer_evidence_dispute_resolution_ref",
  "customer_evidence_dispute_resolution_hash_ref",
  "dispute_closure_policy_ref",
  "dispute_closure_authority_ref",
  "dispute_closure_actor_ref",
  "dispute_closure_actor_authority_ref",
  "dispute_closure_start_ref",
  "dispute_closure_deadline_ref",
  "dispute_closure_end_ref",
  "dispute_closure_timezone_ref",
  "dispute_closure_clock_source_ref",
  "dispute_closure_status_ref",
  "dispute_closure_status_reason_ref",
  "dispute_closure_final_decision_ref",
  "dispute_closure_final_decision_hash_ref",
  "dispute_closure_final_outcome_ref",
  "dispute_closure_final_reasoning_ref",
  "dispute_closure_resolution_binding_ref",
  "dispute_closure_resolution_hash_ref",
  "dispute_closure_customer_notification_ref",
  "dispute_closure_customer_notification_hash_ref",
  "dispute_closure_platform_notification_ref",
  "dispute_closure_platform_notification_hash_ref",
  "dispute_closure_acknowledgement_ref",
  "dispute_closure_acknowledgement_hash_ref",
  "dispute_closure_receipt_ref",
  "dispute_closure_receipt_hash_ref",
  "dispute_closure_signature_ref",
  "dispute_closure_timestamp_ref",
  "dispute_closure_non_repudiation_ref",
  "dispute_closure_evidence_hold_release_ref",
  "dispute_closure_retention_ref",
  "dispute_closure_archive_ref",
  "dispute_closure_archive_hash_ref",
  "dispute_closure_reopen_policy_ref",
  "dispute_closure_reopen_boundary_ref",
  "dispute_closure_appeal_boundary_ref",
  "dispute_closure_exception_boundary_ref",
  "dispute_closure_remediation_completion_ref",
  "dispute_closure_reversal_completion_ref",
  "dispute_closure_amendment_completion_ref",
  "dispute_closure_correction_completion_ref",
  "dispute_closure_sla_ref",
  "dispute_closure_sla_hash_ref",
  "dispute_closure_audit_event_ref",
  "dispute_closure_opc_event_ref",
  "dispute_closure_evidence_event_ref",
  "dispute_closure_decision_proof_package_ref",
  "dispute_closure_qualified_verification_report_ref",
  "dispute_closure_matrix_state_ref",
  "dispute_closure_chainhead_ref",
  "dispute_closure_chainlink_ref",
  "dispute_closure_export_package_ref",
  "dispute_closure_redaction_policy_ref",
  "dispute_closure_privacy_boundary_ref",
  "dispute_closure_access_control_ref",
  "dispute_closure_retention_policy_ref",
  "dispute_closure_revocation_ref",
  "dispute_closure_expiry_ref",
  "dispute_closure_replay_boundary_ref",
  "dispute_closure_idempotency_boundary_ref",
  "dispute_closure_ordering_boundary_ref",
  "dispute_closure_consistency_boundary_ref",
  "dispute_closure_completeness_boundary_ref",
  "dispute_closure_fork_detection_boundary_ref",
  "dispute_closure_canonicalization_boundary_ref",
  "dispute_closure_hash_binding_boundary_ref",
  "dispute_closure_signature_boundary_ref",
  "dispute_closure_timestamp_boundary_ref",
  "dispute_closure_non_repudiation_boundary_ref",
  "dispute_closure_query_boundary_ref",
  "dispute_closure_download_boundary_ref",
  "dispute_closure_api_boundary_ref",
  "dispute_closure_file_boundary_ref",
  "dispute_closure_release_boundary_ref",
  "dispute_closure_runtime_boundary_ref",
  "dispute_closure_production_boundary_ref",
  "dispute_closure_legal_certification_boundary_ref",
  "source_document_boundary_statement",
  "endpoint_customer_evidence_dispute_closure_boundary_statement"
];

for (const item of requiredFields) {
  if (!fields.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_FIELD_MISSING ${item}`);
    ok = false;
  }

  const expectedRule = `bind_${item}_within_endpoint_customer_evidence_dispute_closure_conformance_only`;
  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const closureFalseClaims = Object.keys(d)
  .filter((key) => key.startsWith("endpoint_customer_evidence_dispute_closure_") && d[key] === false)
  .sort();

check("closure_false_claim_count", closureFalseClaims.length, 150);

for (const key of closureFalseClaims) {
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

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
check("false_claim_property_count", falseClaimCount, 2264);

const criticalFalseClaims = [
  "endpoint_customer_evidence_dispute_closure_created",
  "endpoint_customer_evidence_dispute_closure_validated",
  "endpoint_customer_evidence_dispute_closure_finalized",
  "endpoint_customer_evidence_dispute_closure_final_decision_validated",
  "endpoint_customer_evidence_dispute_closure_final_outcome_validated",
  "endpoint_customer_evidence_dispute_closure_final_reasoning_validated",
  "endpoint_customer_evidence_dispute_closure_customer_notification_validated",
  "endpoint_customer_evidence_dispute_closure_platform_notification_validated",
  "endpoint_customer_evidence_dispute_closure_receipt_validated",
  "endpoint_customer_evidence_dispute_closure_evidence_hold_release_validated",
  "endpoint_customer_evidence_dispute_closure_archive_validated",
  "endpoint_customer_evidence_dispute_closure_reopen_boundary_validated",
  "endpoint_customer_evidence_dispute_closure_appeal_boundary_validated",
  "endpoint_customer_evidence_dispute_closure_closed",
  "endpoint_customer_evidence_dispute_closure_closure_completed",
  "endpoint_customer_evidence_dispute_closure_customer_notified",
  "endpoint_customer_evidence_dispute_closure_customer_acknowledged",
  "endpoint_customer_evidence_dispute_closure_receipt_created",
  "endpoint_customer_evidence_dispute_closure_receipt_acknowledged",
  "endpoint_customer_evidence_dispute_closure_non_repudiation_created",
  "endpoint_customer_evidence_dispute_closure_evidence_hold_released",
  "endpoint_customer_evidence_dispute_closure_archive_created",
  "endpoint_customer_evidence_dispute_closure_reopen_available",
  "endpoint_customer_evidence_dispute_closure_appeal_blocked",
  "endpoint_customer_evidence_dispute_closure_ready",
  "endpoint_customer_evidence_dispute_closure_success",
  "endpoint_customer_evidence_dispute_closure_production_ready",
  "endpoint_customer_evidence_dispute_closure_customer_ready",
  "endpoint_customer_evidence_dispute_closure_legal_certification_created",
  "endpoint_customer_evidence_dispute_resolution_decided",
  "endpoint_customer_evidence_dispute_resolution_completed",
  "endpoint_customer_evidence_dispute_resolution_closed",
  "endpoint_customer_evidence_dispute_resolution_non_repudiation_created",
  "endpoint_customer_evidence_dispute_window_closed",
  "legal_certification_created",
  "execution_completed"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const requiredNonClaimEntries = [
  "no_endpoint_customer_evidence_dispute_closure_created_claim",
  "no_endpoint_customer_evidence_dispute_closure_validated_claim",
  "no_endpoint_customer_evidence_dispute_closure_finalized_claim",
  "no_endpoint_customer_evidence_dispute_closure_closed_claim",
  "no_endpoint_customer_evidence_dispute_closure_closure_completed_claim",
  "no_endpoint_customer_evidence_dispute_closure_customer_notified_claim",
  "no_endpoint_customer_evidence_dispute_closure_customer_acknowledged_claim",
  "no_endpoint_customer_evidence_dispute_closure_receipt_created_claim",
  "no_endpoint_customer_evidence_dispute_closure_non_repudiation_created_claim",
  "no_endpoint_customer_evidence_dispute_closure_evidence_hold_released_claim",
  "no_endpoint_customer_evidence_dispute_closure_archive_created_claim",
  "no_endpoint_customer_evidence_dispute_closure_ready_claim",
  "no_endpoint_customer_evidence_dispute_closure_success_claim",
  "no_endpoint_customer_evidence_dispute_closure_production_ready_claim",
  "no_endpoint_customer_evidence_dispute_closure_customer_ready_claim",
  "no_endpoint_customer_evidence_dispute_closure_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!nonClaims.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_NON_CLAIM_MISSING ${item}`);
    ok = false;
  }
}

const requiredBoundaryEntries = [
  "endpoint_customer_evidence_dispute_closure_created_false",
  "endpoint_customer_evidence_dispute_closure_validated_false",
  "endpoint_customer_evidence_dispute_closure_finalized_false",
  "endpoint_customer_evidence_dispute_closure_closed_false",
  "endpoint_customer_evidence_dispute_closure_closure_completed_false",
  "endpoint_customer_evidence_dispute_closure_customer_notified_false",
  "endpoint_customer_evidence_dispute_closure_customer_acknowledged_false",
  "endpoint_customer_evidence_dispute_closure_receipt_created_false",
  "endpoint_customer_evidence_dispute_closure_non_repudiation_created_false",
  "endpoint_customer_evidence_dispute_closure_evidence_hold_released_false",
  "endpoint_customer_evidence_dispute_closure_archive_created_false",
  "endpoint_customer_evidence_dispute_closure_ready_false",
  "endpoint_customer_evidence_dispute_closure_success_false",
  "endpoint_customer_evidence_dispute_closure_production_ready_false",
  "endpoint_customer_evidence_dispute_closure_customer_ready_false",
  "endpoint_customer_evidence_dispute_closure_legal_certification_created_false"
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
  required_endpoint_customer_evidence_dispute_closure_conformance_field_count: d.required_endpoint_customer_evidence_dispute_closure_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_customer_evidence_dispute_closure_created: d.endpoint_customer_evidence_dispute_closure_created,
  endpoint_customer_evidence_dispute_closure_validated: d.endpoint_customer_evidence_dispute_closure_validated,
  endpoint_customer_evidence_dispute_closure_finalized: d.endpoint_customer_evidence_dispute_closure_finalized,
  endpoint_customer_evidence_dispute_closure_closed: d.endpoint_customer_evidence_dispute_closure_closed,
  endpoint_customer_evidence_dispute_closure_closure_completed: d.endpoint_customer_evidence_dispute_closure_closure_completed,
  endpoint_customer_evidence_dispute_closure_customer_notified: d.endpoint_customer_evidence_dispute_closure_customer_notified,
  endpoint_customer_evidence_dispute_closure_customer_acknowledged: d.endpoint_customer_evidence_dispute_closure_customer_acknowledged,
  endpoint_customer_evidence_dispute_closure_receipt_created: d.endpoint_customer_evidence_dispute_closure_receipt_created,
  endpoint_customer_evidence_dispute_closure_non_repudiation_created: d.endpoint_customer_evidence_dispute_closure_non_repudiation_created,
  endpoint_customer_evidence_dispute_closure_evidence_hold_released: d.endpoint_customer_evidence_dispute_closure_evidence_hold_released,
  endpoint_customer_evidence_dispute_closure_archive_created: d.endpoint_customer_evidence_dispute_closure_archive_created,
  endpoint_customer_evidence_dispute_closure_ready: d.endpoint_customer_evidence_dispute_closure_ready,
  endpoint_customer_evidence_dispute_closure_success: d.endpoint_customer_evidence_dispute_closure_success,
  endpoint_customer_evidence_dispute_closure_production_ready: d.endpoint_customer_evidence_dispute_closure_production_ready,
  endpoint_customer_evidence_dispute_closure_customer_ready: d.endpoint_customer_evidence_dispute_closure_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_331_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_CLOSURE_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
