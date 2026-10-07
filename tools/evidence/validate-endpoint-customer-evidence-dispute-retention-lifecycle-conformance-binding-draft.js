#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261007_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT_v001.json";
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

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-RETENTION-LIFECYCLE-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeRetentionLifecycleConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_ARCHIVE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "599c90232fd5cd4b8a88e83e1bc43d4e64e68bb3");
check("parent_object_id", d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-ARCHIVE-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker", d.parent_marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_ARCHIVE_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_commit", d.parent_commit, "599c90232fd5cd4b8a88e83e1bc43d4e64e68bb3");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-334");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DELETION-ELIGIBILITY-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 51);
check("required_endpoint_customer_evidence_dispute_retention_lifecycle_conformance_field_count", d.required_endpoint_customer_evidence_dispute_retention_lifecycle_conformance_field_count, 109);
check("binding_rule_count", d.binding_rule_count, 109);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 186);
check("required_non_claim_count", d.required_non_claim_count, 2612);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 2612);

const basis = requireArray("basis", 45);
const fields = requireArray("required_endpoint_customer_evidence_dispute_retention_lifecycle_conformance_fields", 109);
const bindingRules = requireArray("binding_rules", 109);
const futureRequirements = requireArray("future_resolution_requirements", 186);
const nonClaims = requireArray("explicit_non_claims", 2612);
const noExecutionBoundary = requireArray("no_execution_boundary", 2612);

if (basis.includes("HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-RETENTION-LIFECYCLE-CONFORMANCE-BINDING-DRAFT-V001")) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

const requiredBasis = [
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-ARCHIVE-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001",
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

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_retention_lifecycle_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const retentionFalseClaims = Object.keys(d)
  .filter((key) => key.startsWith("endpoint_customer_evidence_dispute_retention_lifecycle_") && d[key] === false)
  .sort();

check("retention_lifecycle_false_claim_count", retentionFalseClaims.length, 186);

for (const key of retentionFalseClaims) {
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
check("false_claim_property_count", falseClaimCount, 2612);

const criticalFalseClaims = [
  "endpoint_customer_evidence_dispute_retention_lifecycle_created",
  "endpoint_customer_evidence_dispute_retention_lifecycle_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_finalized",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_start_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_end_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_extension_policy_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_suspension_policy_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_legal_hold_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_review_event_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_renewal_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_expiry_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_deletion_eligibility_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_purge_eligibility_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_disposal_eligibility_validated",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_started",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_active",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_suspended",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_resumed",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_extended",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_reviewed",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_renewed",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_expired",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_completed",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_schedule_created",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_start_recorded",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_end_recorded",
  "endpoint_customer_evidence_dispute_retention_lifecycle_legal_hold_created",
  "endpoint_customer_evidence_dispute_retention_lifecycle_legal_hold_active",
  "endpoint_customer_evidence_dispute_retention_lifecycle_legal_hold_released",
  "endpoint_customer_evidence_dispute_retention_lifecycle_deletion_eligible",
  "endpoint_customer_evidence_dispute_retention_lifecycle_purge_eligible",
  "endpoint_customer_evidence_dispute_retention_lifecycle_disposal_eligible",
  "endpoint_customer_evidence_dispute_retention_lifecycle_ready",
  "endpoint_customer_evidence_dispute_retention_lifecycle_success",
  "endpoint_customer_evidence_dispute_retention_lifecycle_production_ready",
  "endpoint_customer_evidence_dispute_retention_lifecycle_customer_ready",
  "endpoint_customer_evidence_dispute_retention_lifecycle_legal_certification_created",
  "endpoint_customer_evidence_dispute_archive_archived",
  "endpoint_customer_evidence_dispute_archive_retention_started",
  "endpoint_customer_evidence_dispute_archive_archive_completed",
  "endpoint_customer_evidence_dispute_closure_closed",
  "legal_certification_created",
  "execution_completed"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const requiredNonClaimEntries = [
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_created_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_validated_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_finalized_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_started_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_active_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_suspended_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_expired_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_deletion_eligible_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_purge_eligible_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_disposal_eligible_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_ready_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_success_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_production_ready_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_customer_ready_claim",
  "no_endpoint_customer_evidence_dispute_retention_lifecycle_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!nonClaims.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_NON_CLAIM_MISSING ${item}`);
    ok = false;
  }
}

const requiredBoundaryEntries = [
  "endpoint_customer_evidence_dispute_retention_lifecycle_created_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_validated_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_finalized_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_started_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_active_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_suspended_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_expired_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_deletion_eligible_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_purge_eligible_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_disposal_eligible_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_ready_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_success_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_production_ready_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_customer_ready_false",
  "endpoint_customer_evidence_dispute_retention_lifecycle_legal_certification_created_false"
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
  required_endpoint_customer_evidence_dispute_retention_lifecycle_conformance_field_count: d.required_endpoint_customer_evidence_dispute_retention_lifecycle_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_customer_evidence_dispute_retention_lifecycle_created: d.endpoint_customer_evidence_dispute_retention_lifecycle_created,
  endpoint_customer_evidence_dispute_retention_lifecycle_validated: d.endpoint_customer_evidence_dispute_retention_lifecycle_validated,
  endpoint_customer_evidence_dispute_retention_lifecycle_finalized: d.endpoint_customer_evidence_dispute_retention_lifecycle_finalized,
  endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_started: d.endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_started,
  endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_active: d.endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_active,
  endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_suspended: d.endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_suspended,
  endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_expired: d.endpoint_customer_evidence_dispute_retention_lifecycle_retention_lifecycle_expired,
  endpoint_customer_evidence_dispute_retention_lifecycle_deletion_eligible: d.endpoint_customer_evidence_dispute_retention_lifecycle_deletion_eligible,
  endpoint_customer_evidence_dispute_retention_lifecycle_purge_eligible: d.endpoint_customer_evidence_dispute_retention_lifecycle_purge_eligible,
  endpoint_customer_evidence_dispute_retention_lifecycle_disposal_eligible: d.endpoint_customer_evidence_dispute_retention_lifecycle_disposal_eligible,
  endpoint_customer_evidence_dispute_retention_lifecycle_ready: d.endpoint_customer_evidence_dispute_retention_lifecycle_ready,
  endpoint_customer_evidence_dispute_retention_lifecycle_success: d.endpoint_customer_evidence_dispute_retention_lifecycle_success,
  endpoint_customer_evidence_dispute_retention_lifecycle_production_ready: d.endpoint_customer_evidence_dispute_retention_lifecycle_production_ready,
  endpoint_customer_evidence_dispute_retention_lifecycle_customer_ready: d.endpoint_customer_evidence_dispute_retention_lifecycle_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_333_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_RETENTION_LIFECYCLE_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
