#!/usr/bin/env node

const fs = require("fs");

const parentFile = "evidence/authorization/20261007_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_RECEIPT_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT_v001.json";

const parent = JSON.parse(fs.readFileSync(parentFile, "utf8"));
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

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-EXECUTION-CUSTODY-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalExecutionCustodyConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_RECEIPT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "34e34878d1ca6ff0e9a488f6e7611551b27a8600");
check("parent_object_id", d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-EXECUTION-RECEIPT-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker", d.parent_marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_RECEIPT_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_commit", d.parent_commit, "34e34878d1ca6ff0e9a488f6e7611551b27a8600");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-342");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-EXECUTION-VERIFICATION-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 59);
check("required_endpoint_customer_evidence_dispute_disposal_execution_custody_conformance_field_count", d.required_endpoint_customer_evidence_dispute_disposal_execution_custody_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 4121);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 4121);

const basis = requireArray("basis", 53);
const fields = requireArray("required_endpoint_customer_evidence_dispute_disposal_execution_custody_conformance_fields", 111);
const bindingRules = requireArray("binding_rules", 111);
const futureRequirements = requireArray("future_resolution_requirements", 179);
const nonClaims = requireArray("explicit_non_claims", 4121);
const noExecutionBoundary = requireArray("no_execution_boundary", 4121);

if (basis.includes(d.object_id)) {
  console.log("VALIDATOR_SELF_BASIS_REFERENCE_PRESENT");
  ok = false;
}

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_execution_custody_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

const allCustodyFalseKeys = Object.keys(d)
  .filter((key) => key.startsWith("endpoint_customer_evidence_dispute_disposal_execution_custody_") && d[key] === false)
  .sort();

const futureCustodyFalseKeys = futureRequirements
  .filter((item) => item.startsWith("define_future_resolution_for_endpoint_customer_evidence_dispute_disposal_execution_custody_"))
  .map((item) => item.replace("define_future_resolution_for_", ""))
  .sort();

const parentCustodyFalseKeys = Object.keys(parent)
  .filter((key) => key.startsWith("endpoint_customer_evidence_dispute_disposal_execution_custody_") && parent[key] === false)
  .sort();

const futureCustodySet = new Set(futureCustodyFalseKeys);
const parentCustodySet = new Set(parentCustodyFalseKeys);

const inheritedCustodyFalseKeys = allCustodyFalseKeys
  .filter((key) => !futureCustodySet.has(key) && parentCustodySet.has(key))
  .sort();

const custodyFutureMissingFromFalseClaims = futureCustodyFalseKeys
  .filter((key) => d[key] !== false)
  .sort();

check("false_claim_property_count", falseClaimCount, 4120);
check("future_custody_false_key_count", futureCustodyFalseKeys.length, 179);
check("all_custody_false_key_count", allCustodyFalseKeys.length, 180);
check("inherited_custody_false_key_count", inheritedCustodyFalseKeys.length, 1);
check("inherited_custody_false_key", inheritedCustodyFalseKeys[0], "endpoint_customer_evidence_dispute_disposal_execution_custody_record_created");
check("custody_future_missing_from_false_claims_count", custodyFutureMissingFromFalseClaims.length, 0);

for (const key of futureCustodyFalseKeys) {
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
  "endpoint_customer_evidence_dispute_disposal_execution_custody_created",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_validated",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_finalized",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_custody_record_created",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_custody_chain_created",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_custody_chainhead_updated",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_custody_chainlink_created",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_custody_verified",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_execution_completion_confirmed",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_disposal_completion_confirmed",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_target_mutation_confirmed",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_ready",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_success",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_production_ready",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_customer_ready",
  "endpoint_customer_evidence_dispute_disposal_execution_custody_legal_certification_created",
  "endpoint_customer_evidence_dispute_disposal_execution_receipt_receipt_verified",
  "endpoint_customer_evidence_dispute_disposal_execution_execution_completed",
  "endpoint_customer_evidence_dispute_disposal_execution_disposal_completed",
  "endpoint_customer_evidence_dispute_disposal_execution_target_mutated",
  "legal_certification_created",
  "execution_completed"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const result = ok
  ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT"
  : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT";

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  basis_main_commit: d.basis_main_commit,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_customer_evidence_dispute_disposal_execution_custody_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_execution_custody_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: falseClaimCount,
  future_custody_false_key_count: futureCustodyFalseKeys.length,
  all_custody_false_key_count: allCustodyFalseKeys.length,
  inherited_custody_false_key_count: inheritedCustodyFalseKeys.length,
  inherited_custody_false_keys: inheritedCustodyFalseKeys,
  custody_future_missing_from_false_claims: custodyFutureMissingFromFalseClaims,
  endpoint_customer_evidence_dispute_disposal_execution_custody_created: d.endpoint_customer_evidence_dispute_disposal_execution_custody_created,
  endpoint_customer_evidence_dispute_disposal_execution_custody_validated: d.endpoint_customer_evidence_dispute_disposal_execution_custody_validated,
  endpoint_customer_evidence_dispute_disposal_execution_custody_finalized: d.endpoint_customer_evidence_dispute_disposal_execution_custody_finalized,
  endpoint_customer_evidence_dispute_disposal_execution_custody_custody_record_created: d.endpoint_customer_evidence_dispute_disposal_execution_custody_custody_record_created,
  endpoint_customer_evidence_dispute_disposal_execution_custody_custody_verified: d.endpoint_customer_evidence_dispute_disposal_execution_custody_custody_verified,
  endpoint_customer_evidence_dispute_disposal_execution_custody_execution_completion_confirmed: d.endpoint_customer_evidence_dispute_disposal_execution_custody_execution_completion_confirmed,
  endpoint_customer_evidence_dispute_disposal_execution_custody_disposal_completion_confirmed: d.endpoint_customer_evidence_dispute_disposal_execution_custody_disposal_completion_confirmed,
  endpoint_customer_evidence_dispute_disposal_execution_custody_target_mutation_confirmed: d.endpoint_customer_evidence_dispute_disposal_execution_custody_target_mutation_confirmed,
  endpoint_customer_evidence_dispute_disposal_execution_custody_ready: d.endpoint_customer_evidence_dispute_disposal_execution_custody_ready,
  endpoint_customer_evidence_dispute_disposal_execution_custody_success: d.endpoint_customer_evidence_dispute_disposal_execution_custody_success,
  endpoint_customer_evidence_dispute_disposal_execution_custody_production_ready: d.endpoint_customer_evidence_dispute_disposal_execution_custody_production_ready,
  endpoint_customer_evidence_dispute_disposal_execution_custody_customer_ready: d.endpoint_customer_evidence_dispute_disposal_execution_custody_customer_ready,
  legal_certification_created: d.legal_certification_created,
  result
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_341_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
