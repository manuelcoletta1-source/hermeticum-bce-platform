#!/usr/bin/env node

const fs = require("fs");

const file = "evidence/authorization/20261007_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT_v001.json";
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

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-PURGE-ELIGIBILITY-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputePurgeEligibilityConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DELETION_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "060a758cff55fbea97f8ce2e8a4c1b48f2148adf");
check("parent_object_id", d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DELETION-ELIGIBILITY-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker", d.parent_marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DELETION_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_commit", d.parent_commit, "060a758cff55fbea97f8ce2e8a4c1b48f2148adf");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-336");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-ELIGIBILITY-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 53);
check("required_endpoint_customer_evidence_dispute_purge_eligibility_conformance_field_count", d.required_endpoint_customer_evidence_dispute_purge_eligibility_conformance_field_count, 113);
check("binding_rule_count", d.binding_rule_count, 113);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 189);
check("required_non_claim_count", d.required_non_claim_count, 2995);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 2995);

const basis = requireArray("basis", 47);
const fields = requireArray("required_endpoint_customer_evidence_dispute_purge_eligibility_conformance_fields", 113);
const bindingRules = requireArray("binding_rules", 113);
const futureRequirements = requireArray("future_resolution_requirements", 189);
const nonClaims = requireArray("explicit_non_claims", 2995);
const noExecutionBoundary = requireArray("no_execution_boundary", 2995);

if (basis.includes("HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-PURGE-ELIGIBILITY-CONFORMANCE-BINDING-DRAFT-V001")) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

const requiredBasis = [
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-PURGE-ELIGIBILITY-CONFORMANCE-BINDING-DRAFT-V001"
];

for (const forbidden of requiredBasis) {
  if (basis.includes(forbidden)) {
    console.log(`VALIDATOR_FORBIDDEN_SELF_BASIS ${forbidden}`);
    ok = false;
  }
}

const requiredInheritedBasis = [
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DELETION-ELIGIBILITY-CONFORMANCE-BINDING-DRAFT-V001",
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-RETENTION-LIFECYCLE-CONFORMANCE-BINDING-DRAFT-V001",
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

for (const item of requiredInheritedBasis) {
  if (!basis.includes(item)) {
    console.log(`VALIDATOR_BASIS_MISSING ${item}`);
    ok = false;
  }
}

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_purge_eligibility_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const purgeFalseClaims = Object.keys(d)
  .filter((key) => key.startsWith("endpoint_customer_evidence_dispute_purge_eligibility_") && d[key] === false)
  .sort();

check("purge_eligibility_false_claim_count", purgeFalseClaims.length, 189);

for (const key of purgeFalseClaims) {
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
check("false_claim_property_count", falseClaimCount, 2995);

const criticalFalseClaims = [
  "endpoint_customer_evidence_dispute_purge_eligibility_created",
  "endpoint_customer_evidence_dispute_purge_eligibility_validated",
  "endpoint_customer_evidence_dispute_purge_eligibility_finalized",
  "endpoint_customer_evidence_dispute_purge_eligibility_deletion_eligibility_binding_validated",
  "endpoint_customer_evidence_dispute_purge_eligibility_deletion_eligibility_state_validated",
  "endpoint_customer_evidence_dispute_purge_eligibility_deletion_authorization_validated",
  "endpoint_customer_evidence_dispute_purge_eligibility_deletion_completion_validated",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_eligibility_evaluation_started",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_eligibility_evaluation_completed",
  "endpoint_customer_evidence_dispute_purge_eligibility_eligible",
  "endpoint_customer_evidence_dispute_purge_eligibility_not_eligible",
  "endpoint_customer_evidence_dispute_purge_eligibility_blocked",
  "endpoint_customer_evidence_dispute_purge_eligibility_approved",
  "endpoint_customer_evidence_dispute_purge_eligibility_rejected",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_authorized",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_scheduled",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_started",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_completed",
  "endpoint_customer_evidence_dispute_purge_eligibility_deletion_authorized",
  "endpoint_customer_evidence_dispute_purge_eligibility_deletion_scheduled",
  "endpoint_customer_evidence_dispute_purge_eligibility_deletion_started",
  "endpoint_customer_evidence_dispute_purge_eligibility_deletion_completed",
  "endpoint_customer_evidence_dispute_purge_eligibility_disposal_authorized",
  "endpoint_customer_evidence_dispute_purge_eligibility_disposal_scheduled",
  "endpoint_customer_evidence_dispute_purge_eligibility_disposal_started",
  "endpoint_customer_evidence_dispute_purge_eligibility_disposal_completed",
  "endpoint_customer_evidence_dispute_purge_eligibility_ready",
  "endpoint_customer_evidence_dispute_purge_eligibility_success",
  "endpoint_customer_evidence_dispute_purge_eligibility_production_ready",
  "endpoint_customer_evidence_dispute_purge_eligibility_customer_ready",
  "endpoint_customer_evidence_dispute_purge_eligibility_legal_certification_created",
  "endpoint_customer_evidence_dispute_deletion_eligibility_purge_authorized",
  "endpoint_customer_evidence_dispute_deletion_eligibility_purge_scheduled",
  "endpoint_customer_evidence_dispute_deletion_eligibility_purge_completed",
  "endpoint_customer_evidence_dispute_retention_lifecycle_purge_eligible",
  "endpoint_customer_evidence_dispute_archive_archived",
  "legal_certification_created",
  "execution_completed"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const requiredNonClaimEntries = [
  "no_endpoint_customer_evidence_dispute_purge_eligibility_created_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_validated_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_finalized_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_eligible_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_not_eligible_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_blocked_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_purge_authorized_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_purge_scheduled_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_purge_completed_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_disposal_completed_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_ready_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_success_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_production_ready_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_customer_ready_claim",
  "no_endpoint_customer_evidence_dispute_purge_eligibility_legal_certification_created_claim"
];

for (const item of requiredNonClaimEntries) {
  if (!nonClaims.includes(item)) {
    console.log(`VALIDATOR_REQUIRED_NON_CLAIM_MISSING ${item}`);
    ok = false;
  }
}

const requiredBoundaryEntries = [
  "endpoint_customer_evidence_dispute_purge_eligibility_created_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_validated_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_finalized_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_eligible_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_not_eligible_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_blocked_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_authorized_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_scheduled_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_purge_completed_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_disposal_completed_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_ready_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_success_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_production_ready_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_customer_ready_false",
  "endpoint_customer_evidence_dispute_purge_eligibility_legal_certification_created_false"
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
  required_endpoint_customer_evidence_dispute_purge_eligibility_conformance_field_count: d.required_endpoint_customer_evidence_dispute_purge_eligibility_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  endpoint_customer_evidence_dispute_purge_eligibility_created: d.endpoint_customer_evidence_dispute_purge_eligibility_created,
  endpoint_customer_evidence_dispute_purge_eligibility_validated: d.endpoint_customer_evidence_dispute_purge_eligibility_validated,
  endpoint_customer_evidence_dispute_purge_eligibility_finalized: d.endpoint_customer_evidence_dispute_purge_eligibility_finalized,
  endpoint_customer_evidence_dispute_purge_eligibility_purge_eligibility_evaluation_started: d.endpoint_customer_evidence_dispute_purge_eligibility_purge_eligibility_evaluation_started,
  endpoint_customer_evidence_dispute_purge_eligibility_purge_eligibility_evaluation_completed: d.endpoint_customer_evidence_dispute_purge_eligibility_purge_eligibility_evaluation_completed,
  endpoint_customer_evidence_dispute_purge_eligibility_eligible: d.endpoint_customer_evidence_dispute_purge_eligibility_eligible,
  endpoint_customer_evidence_dispute_purge_eligibility_not_eligible: d.endpoint_customer_evidence_dispute_purge_eligibility_not_eligible,
  endpoint_customer_evidence_dispute_purge_eligibility_blocked: d.endpoint_customer_evidence_dispute_purge_eligibility_blocked,
  endpoint_customer_evidence_dispute_purge_eligibility_purge_authorized: d.endpoint_customer_evidence_dispute_purge_eligibility_purge_authorized,
  endpoint_customer_evidence_dispute_purge_eligibility_purge_scheduled: d.endpoint_customer_evidence_dispute_purge_eligibility_purge_scheduled,
  endpoint_customer_evidence_dispute_purge_eligibility_purge_completed: d.endpoint_customer_evidence_dispute_purge_eligibility_purge_completed,
  endpoint_customer_evidence_dispute_purge_eligibility_disposal_completed: d.endpoint_customer_evidence_dispute_purge_eligibility_disposal_completed,
  endpoint_customer_evidence_dispute_purge_eligibility_ready: d.endpoint_customer_evidence_dispute_purge_eligibility_ready,
  endpoint_customer_evidence_dispute_purge_eligibility_success: d.endpoint_customer_evidence_dispute_purge_eligibility_success,
  endpoint_customer_evidence_dispute_purge_eligibility_production_ready: d.endpoint_customer_evidence_dispute_purge_eligibility_production_ready,
  endpoint_customer_evidence_dispute_purge_eligibility_customer_ready: d.endpoint_customer_evidence_dispute_purge_eligibility_customer_ready,
  legal_certification_created: d.legal_certification_created,
  false_claim_property_count: falseClaimCount,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_335_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_PURGE_ELIGIBILITY_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
