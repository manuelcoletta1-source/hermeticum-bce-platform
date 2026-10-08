#!/usr/bin/env node

const fs = require("fs");

const parentFile = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT_v001.json";

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

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-EXECUTION-VERIFICATION-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalExecutionVerificationConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT");
check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "a8078b878532e85d71647fc965df452102213dc5");
check("parent_object_id", d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-EXECUTION-CUSTODY-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker", d.parent_marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_CUSTODY_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_commit", d.parent_commit, "a8078b878532e85d71647fc965df452102213dc5");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-343");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-MATRIX-EFFECTIVE-STATE-CONFORMANCE-BINDING-DRAFT-V001");

check("source_chain_entry_count", d.source_chain_entry_count, 60);
check("required_endpoint_customer_evidence_dispute_disposal_execution_verification_conformance_field_count", d.required_endpoint_customer_evidence_dispute_disposal_execution_verification_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 4300);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 4300);

const fields = requireArray("required_endpoint_customer_evidence_dispute_disposal_execution_verification_conformance_fields", 111);
const bindingRules = requireArray("binding_rules", 111);
const futureRequirements = requireArray("future_resolution_requirements", 179);
const nonClaims = requireArray("explicit_non_claims", 4300);
const noExecutionBoundary = requireArray("no_execution_boundary", 4300);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_execution_verification_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;
const prefix = "endpoint_customer_evidence_dispute_disposal_execution_verification_";

const futureVerificationFalseKeys = futureRequirements
  .filter((item) => item.startsWith(`define_future_resolution_for_${prefix}`))
  .map((item) => item.replace("define_future_resolution_for_", ""))
  .sort();

const allVerificationFalseKeys = Object.keys(d)
  .filter((key) => key.startsWith(prefix) && d[key] === false)
  .sort();

const futureVerificationSet = new Set(futureVerificationFalseKeys);

const missingFutureVerificationFalseKeys = futureVerificationFalseKeys
  .filter((key) => d[key] !== false)
  .sort();

const inheritedVerificationFalseKeys = allVerificationFalseKeys
  .filter((key) => !futureVerificationSet.has(key) && parent[key] === false)
  .sort();

const expectedInheritedVerificationFalseKeys = [
  "endpoint_customer_evidence_dispute_disposal_execution_verification_input_created",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_input_validated",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_output_created",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_output_validated",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_report_created"
];

check("false_claim_property_count", d.false_claim_property_count, falseClaimCount);
check("false_claim_property_count_value", falseClaimCount, 4299);
check("future_verification_false_key_count", d.future_verification_false_key_count, 179);
check("future_verification_false_key_count_value", futureVerificationFalseKeys.length, 179);
check("all_verification_false_key_count", d.all_verification_false_key_count, allVerificationFalseKeys.length);
check("all_verification_false_key_count_value", allVerificationFalseKeys.length, 184);
check("inherited_verification_false_key_count", d.inherited_verification_false_key_count, inheritedVerificationFalseKeys.length);
check("inherited_verification_false_key_count_value", inheritedVerificationFalseKeys.length, 5);
check("missing_future_verification_false_key_count", missingFutureVerificationFalseKeys.length, 0);

for (let i = 0; i < expectedInheritedVerificationFalseKeys.length; i += 1) {
  check(`inherited_verification_false_key_${i}`, inheritedVerificationFalseKeys[i], expectedInheritedVerificationFalseKeys[i]);
}

if (Object.prototype.hasOwnProperty.call(d, `${prefix}verification_operationally_accepted`)) {
  console.log("VALIDATOR_REMOVED_FALSE_KEY_STILL_PRESENT endpoint_customer_evidence_dispute_disposal_execution_verification_verification_operationally_accepted");
  ok = false;
}

for (const key of futureVerificationFalseKeys) {
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
  "endpoint_customer_evidence_dispute_disposal_execution_verification_created",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_validated",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_finalized",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_independent_reconstruction_completed",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_qualified_verification_completed",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_verdict_created",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_verification_report_created",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_decision_proof_created",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_matrix_effective_state_created",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_execution_completed",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_disposal_completed",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_target_mutated",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_ready",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_success",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_production_ready",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_customer_ready",
  "endpoint_customer_evidence_dispute_disposal_execution_verification_legal_certification_created",
  "legal_certification_created",
  "execution_completed"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const requiredBoundaryTexts = [
  "does not implement runtime verification",
  "does not perform independent reconstruction",
  "does not create a qualified verifier report",
  "does not confirm execution completion",
  "does not confirm disposal completion",
  "does not mutate a target",
  "does not update Matrix effective state",
  "does not create legal certification",
  "Receipt, custody, hash, signature, checkpoint, manifest, release and branch status do not imply verified execution"
];

const combinedBoundaryText = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_execution_verification_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].join("\n");

for (const text of requiredBoundaryTexts) {
  if (!combinedBoundaryText.includes(text)) {
    console.log(`VALIDATOR_BOUNDARY_TEXT_MISSING ${text}`);
    ok = false;
  }
}

const result = ok
  ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT"
  : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT";

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  basis_main_commit: d.basis_main_commit,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_customer_evidence_dispute_disposal_execution_verification_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_execution_verification_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  recommended_next_program: d.recommended_next_program,
  recommended_next_object_id: d.recommended_next_object_id,
  false_claim_property_count: falseClaimCount,
  future_verification_false_key_count: futureVerificationFalseKeys.length,
  all_verification_false_key_count: allVerificationFalseKeys.length,
  inherited_verification_false_key_count: inheritedVerificationFalseKeys.length,
  inherited_verification_false_keys: inheritedVerificationFalseKeys,
  missing_future_verification_false_key_count: missingFutureVerificationFalseKeys.length,
  endpoint_customer_evidence_dispute_disposal_execution_verification_created: d.endpoint_customer_evidence_dispute_disposal_execution_verification_created,
  endpoint_customer_evidence_dispute_disposal_execution_verification_validated: d.endpoint_customer_evidence_dispute_disposal_execution_verification_validated,
  endpoint_customer_evidence_dispute_disposal_execution_verification_finalized: d.endpoint_customer_evidence_dispute_disposal_execution_verification_finalized,
  endpoint_customer_evidence_dispute_disposal_execution_verification_independent_reconstruction_completed: d.endpoint_customer_evidence_dispute_disposal_execution_verification_independent_reconstruction_completed,
  endpoint_customer_evidence_dispute_disposal_execution_verification_qualified_verification_completed: d.endpoint_customer_evidence_dispute_disposal_execution_verification_qualified_verification_completed,
  endpoint_customer_evidence_dispute_disposal_execution_verification_verdict_created: d.endpoint_customer_evidence_dispute_disposal_execution_verification_verdict_created,
  endpoint_customer_evidence_dispute_disposal_execution_verification_verification_report_created: d.endpoint_customer_evidence_dispute_disposal_execution_verification_verification_report_created,
  endpoint_customer_evidence_dispute_disposal_execution_verification_matrix_effective_state_created: d.endpoint_customer_evidence_dispute_disposal_execution_verification_matrix_effective_state_created,
  endpoint_customer_evidence_dispute_disposal_execution_verification_execution_completed: d.endpoint_customer_evidence_dispute_disposal_execution_verification_execution_completed,
  endpoint_customer_evidence_dispute_disposal_execution_verification_disposal_completed: d.endpoint_customer_evidence_dispute_disposal_execution_verification_disposal_completed,
  endpoint_customer_evidence_dispute_disposal_execution_verification_target_mutated: d.endpoint_customer_evidence_dispute_disposal_execution_verification_target_mutated,
  endpoint_customer_evidence_dispute_disposal_execution_verification_ready: d.endpoint_customer_evidence_dispute_disposal_execution_verification_ready,
  endpoint_customer_evidence_dispute_disposal_execution_verification_success: d.endpoint_customer_evidence_dispute_disposal_execution_verification_success,
  endpoint_customer_evidence_dispute_disposal_execution_verification_production_ready: d.endpoint_customer_evidence_dispute_disposal_execution_verification_production_ready,
  endpoint_customer_evidence_dispute_disposal_execution_verification_customer_ready: d.endpoint_customer_evidence_dispute_disposal_execution_verification_customer_ready,
  legal_certification_created: d.legal_certification_created,
  result
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_342_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_VERIFICATION_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
