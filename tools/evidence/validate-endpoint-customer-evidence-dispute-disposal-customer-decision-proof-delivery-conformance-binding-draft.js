#!/usr/bin/env node

const fs = require("fs");

const parentFile = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_DECISION_PROOF_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT_v001.json";

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

check("parent_object_id_source", parent.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-DECISION-PROOF-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker_source", parent.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_DECISION_PROOF_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_result_source", parent.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_DECISION_PROOF_CONFORMANCE_BINDING_DRAFT");
check("parent_source_chain_entry_count_source", parent.source_chain_entry_count, 62);
check("parent_required_non_claim_count_source", parent.required_non_claim_count, 4658);
check("parent_required_no_execution_boundary_count_source", parent.required_no_execution_boundary_count, 4658);
check("parent_recommended_next_program_source", parent.recommended_next_program, "PROG-345");

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DELIVERY-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofDeliveryConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT");
check("version", d.version, "v001");
check("program", d.program, "PROG-345");

check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");

check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_DECISION_PROOF_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "bf62d430d25f3076958c1cd4b62ec9775213d568");

check("parent_object_id", d.parent_object_id, parent.object_id);
check("parent_marker", d.parent_marker, parent.marker);
check("parent_commit", d.parent_commit, "bf62d430d25f3076958c1cd4b62ec9775213d568");
check("parent_file", d.parent_file, parentFile);
check("parent_tag", d.parent_tag, "hbce-endpoint-customer-evidence-dispute-disposal-decision-proof-conformance-binding-draft-v001");

check("source_chain_model", d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
check("parent_source_chain_entry_count", d.parent_source_chain_entry_count, 62);
check("parent_source_chain_entry_count_matches_parent", d.parent_source_chain_entry_count, parent.source_chain_entry_count);
check("source_chain_entry_count", d.source_chain_entry_count, 63);

if (!d.source_chain_current_entry || typeof d.source_chain_current_entry !== "object") {
  console.log("VALIDATOR_SOURCE_CHAIN_CURRENT_ENTRY_MISSING");
  ok = false;
} else {
  check("source_chain_current_entry_program", d.source_chain_current_entry.program, "PROG-345");
  check("source_chain_current_entry_object_id", d.source_chain_current_entry.object_id, d.object_id);
  check("source_chain_current_entry_marker", d.source_chain_current_entry.marker, d.marker);
  check("source_chain_current_entry_parent_object_id", d.source_chain_current_entry.parent_object_id, parent.object_id);
  check("source_chain_current_entry_parent_marker", d.source_chain_current_entry.parent_marker, parent.marker);
  check("source_chain_current_entry_parent_commit", d.source_chain_current_entry.parent_commit, "bf62d430d25f3076958c1cd4b62ec9775213d568");
}

check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT");
check("recommended_next_program", d.recommended_next_program, "PROG-346");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001");

check("required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_conformance_field_count", d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 4837);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 4837);

const fields = requireArray("required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_conformance_fields", 111);
const bindingRules = requireArray("binding_rules", 111);
const futureRequirements = requireArray("future_resolution_requirements", 179);
const nonClaims = requireArray("explicit_non_claims", 4837);
const noExecutionBoundary = requireArray("no_execution_boundary", 4837);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const prefix = "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_";

const futureFalseKeys = futureRequirements
  .filter((item) => item.startsWith(`define_future_resolution_for_${prefix}`))
  .map((item) => item.replace("define_future_resolution_for_", ""))
  .sort();

const allCustomerDeliveryFalseKeys = Object.keys(d)
  .filter((key) => key.startsWith(prefix) && d[key] === false)
  .sort();

const futureFalseKeySet = new Set(futureFalseKeys);

const inheritedCustomerDeliveryFalseKeys = allCustomerDeliveryFalseKeys
  .filter((key) => !futureFalseKeySet.has(key) && parent[key] === false)
  .sort();

const missingFutureFalseKeys = futureFalseKeys
  .filter((key) => d[key] !== false)
  .sort();

const falseClaimCount = Object.keys(d).filter((key) => d[key] === false).length;

check("false_claim_property_count", d.false_claim_property_count, falseClaimCount);
check("false_claim_property_count_value", falseClaimCount, 4880);
check("future_customer_decision_proof_delivery_false_key_count", d.future_customer_decision_proof_delivery_false_key_count, 179);
check("future_customer_decision_proof_delivery_false_key_actual_count", futureFalseKeys.length, 179);
check("all_customer_decision_proof_delivery_false_key_count", d.all_customer_decision_proof_delivery_false_key_count, allCustomerDeliveryFalseKeys.length);
check("all_customer_decision_proof_delivery_false_key_count_value", allCustomerDeliveryFalseKeys.length, 179);
check("inherited_customer_decision_proof_delivery_false_key_count", d.inherited_customer_decision_proof_delivery_false_key_count, inheritedCustomerDeliveryFalseKeys.length);
check("inherited_customer_decision_proof_delivery_false_key_count_value", inheritedCustomerDeliveryFalseKeys.length, 0);
check("missing_future_customer_decision_proof_delivery_false_key_count", d.missing_future_customer_decision_proof_delivery_false_key_count, 0);
check("missing_future_customer_decision_proof_delivery_false_key_actual_count", missingFutureFalseKeys.length, 0);
check("overlap_non_claim_count", d.overlap_non_claim_count, 0);
check("overlap_no_execution_boundary_count", d.overlap_no_execution_boundary_count, 0);

if (Array.isArray(d.inherited_customer_decision_proof_delivery_false_keys)) {
  check("declared_inherited_customer_decision_proof_delivery_false_keys_json", JSON.stringify(d.inherited_customer_decision_proof_delivery_false_keys), JSON.stringify([]));
} else {
  console.log("VALIDATOR_INHERITED_CUSTOMER_DECISION_PROOF_DELIVERY_FALSE_KEYS_ARRAY_MISSING");
  ok = false;
}

for (const key of futureFalseKeys) {
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
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_created",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_validated",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_finalized",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_ready",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_success",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_customer_ready",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_production_ready",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_legal_certification_created",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_delivery_delivered",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_delivery_received",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_delivery_acknowledged",
  "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_delivery_accepted",
  "customer_decision_proof_delivery_created",
  "customer_decision_proof_delivery_delivered",
  "customer_decision_proof_delivery_received",
  "customer_decision_proof_delivery_acknowledged",
  "customer_decision_proof_delivery_accepted",
  "customer_delivery_receipt_created",
  "customer_delivery_acknowledgement_received",
  "customer_acceptance_created",
  "customer_acceptance_completed",
  "decision_proof_delivered",
  "customer_decision_proof_delivered",
  "customer_decision_proof_accepted",
  "matrix_effective_state_created",
  "qualified_verification_completed",
  "independent_reconstruction_completed",
  "verification_completed",
  "execution_completed",
  "disposal_completed",
  "target_mutated",
  "customer_ready",
  "production_ready",
  "legal_certification_created"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const boundaryText = [
  d.source_document_boundary_statement || "",
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

const requiredBoundaryFragments = [
  "does not deliver a customer decision proof",
  "does not prove customer receipt",
  "does not prove customer acknowledgement",
  "does not prove customer acceptance",
  "does not create a customer-ready state",
  "does not create production readiness",
  "does not create legal validity",
  "does not create legal certification",
  "Decision Proof draft does not imply customer delivery",
  "Customer Decision Proof Delivery draft does not imply customer receipt",
  "UNKNOWN or INSUFFICIENT_EVIDENCE"
];

for (const fragment of requiredBoundaryFragments) {
  if (!boundaryText.includes(fragment)) {
    console.log(`VALIDATOR_BOUNDARY_FRAGMENT_MISSING ${fragment}`);
    ok = false;
  }
}

const result = ok
  ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT"
  : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT";

console.log(JSON.stringify({
  marker: d.marker,
  object_id: d.object_id,
  basis_marker: d.basis_marker,
  basis_main_commit: d.basis_main_commit,
  parent_object_id: d.parent_object_id,
  parent_marker: d.parent_marker,
  parent_commit: d.parent_commit,
  source_chain_model: d.source_chain_model,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_delivery_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: falseClaimCount,
  future_customer_decision_proof_delivery_false_key_count: futureFalseKeys.length,
  all_customer_decision_proof_delivery_false_key_count: allCustomerDeliveryFalseKeys.length,
  inherited_customer_decision_proof_delivery_false_key_count: inheritedCustomerDeliveryFalseKeys.length,
  inherited_customer_decision_proof_delivery_false_keys: inheritedCustomerDeliveryFalseKeys,
  missing_future_customer_decision_proof_delivery_false_key_count: missingFutureFalseKeys.length,
  customer_decision_proof_delivery_created: d.customer_decision_proof_delivery_created,
  customer_decision_proof_delivery_delivered: d.customer_decision_proof_delivery_delivered,
  customer_decision_proof_delivery_received: d.customer_decision_proof_delivery_received,
  customer_decision_proof_delivery_acknowledged: d.customer_decision_proof_delivery_acknowledged,
  customer_decision_proof_delivery_accepted: d.customer_decision_proof_delivery_accepted,
  customer_delivery_receipt_created: d.customer_delivery_receipt_created,
  customer_delivery_acknowledgement_received: d.customer_delivery_acknowledgement_received,
  customer_acceptance_created: d.customer_acceptance_created,
  customer_acceptance_completed: d.customer_acceptance_completed,
  decision_proof_delivered: d.decision_proof_delivered,
  customer_decision_proof_delivered: d.customer_decision_proof_delivered,
  customer_decision_proof_accepted: d.customer_decision_proof_accepted,
  matrix_effective_state_created: d.matrix_effective_state_created,
  qualified_verification_completed: d.qualified_verification_completed,
  independent_reconstruction_completed: d.independent_reconstruction_completed,
  verification_completed: d.verification_completed,
  execution_completed: d.execution_completed,
  disposal_completed: d.disposal_completed,
  target_mutated: d.target_mutated,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  legal_certification_created: d.legal_certification_created,
  recommended_next_program: d.recommended_next_program,
  recommended_next_object_id: d.recommended_next_object_id,
  result
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("PROG_345_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DELIVERY_CONFORMANCE_BINDING_DRAFT_TEST=PASS");
} else {
  process.exitCode = 1;
}
