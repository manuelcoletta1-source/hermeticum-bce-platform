#!/usr/bin/env node
"use strict";

const fs = require("fs");

const parentFile = "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261009_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT_v001.json";

const parent = JSON.parse(fs.readFileSync(parentFile, "utf8"));
const d = JSON.parse(fs.readFileSync(file, "utf8"));

let ok = true;

function check(name, actual, expected) {
  if (actual !== expected) {
    console.log(`VALIDATOR_MISMATCH ${name}: expected=${expected} actual=${actual}`);
    ok = false;
  }
}

function requireArrayFromDoc(doc, name, expectedLength) {
  if (!Array.isArray(doc[name])) {
    console.log(`VALIDATOR_ARRAY_MISSING ${name}`);
    ok = false;
    return [];
  }

  if (doc[name].length !== expectedLength) {
    console.log(`VALIDATOR_ARRAY_LENGTH_MISMATCH ${name}: expected=${expectedLength} actual=${doc[name].length}`);
    ok = false;
  }

  return doc[name];
}

function unique(items) {
  return Array.from(new Set(items));
}

function requireIncludes(name, text, fragment) {
  if (!String(text || "").includes(fragment)) {
    console.log(`VALIDATOR_FRAGMENT_MISSING ${name}: ${fragment}`);
    ok = false;
  }
}

check("parent_object_id_source", parent.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRODUCTION-READINESS-CONFORMANCE-BINDING-DRAFT-V001");
check("parent_marker_source", parent.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT=PASS");
check("parent_result_source", parent.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT");
check("parent_program_source", parent.program, "PROG-354");
check("parent_source_chain_entry_count_source", parent.source_chain_entry_count, 72);
check("parent_required_non_claim_count_source", parent.required_non_claim_count, 6437);
check("parent_required_no_execution_boundary_count_source", parent.required_no_execution_boundary_count, 6437);
check("parent_false_claim_property_count_source", parent.false_claim_property_count, 6868);
check("parent_recommended_next_program_source", parent.recommended_next_program, "PROG-355");
check("parent_recommended_next_object_id_source", parent.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-DELIVERY-CONFORMANCE-BINDING-DRAFT-V001");

const parentNonClaims = requireArrayFromDoc(parent, "explicit_non_claims", 6437);
const parentNoExecutionBoundary = requireArrayFromDoc(parent, "no_execution_boundary", 6437);

check("computed_parent_non_claim_unique_count", unique(parentNonClaims).length, 6437);
check("computed_parent_non_claim_internal_duplicate_count", parentNonClaims.length - unique(parentNonClaims).length, 0);
check("computed_parent_no_execution_boundary_unique_count", unique(parentNoExecutionBoundary).length, 6437);
check("computed_parent_no_execution_boundary_internal_duplicate_count", parentNoExecutionBoundary.length - unique(parentNoExecutionBoundary).length, 0);

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-DELIVERY-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofCustomerDeliveryConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT");
check("version", d.version, "v001");
check("program", d.program, "PROG-355");

check("marker", d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT=PASS");
check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "7d4df4c01d200380af86c7f2ecdf8fb8dd58565d");

check("parent_object_id", d.parent_object_id, parent.object_id);
check("parent_marker", d.parent_marker, parent.marker);
check("parent_commit", d.parent_commit, "7d4df4c01d200380af86c7f2ecdf8fb8dd58565d");
check("parent_file", d.parent_file, parentFile);
check("parent_tag", d.parent_tag, "hbce-endpoint-customer-evidence-dispute-disposal-customer-decision-proof-production-readiness-conformance-binding-draft-v001");
check("parent_release_title", d.parent_release_title, "PROG-354 Endpoint Customer Evidence Dispute Disposal Customer Decision Proof Production Readiness Conformance Binding Draft v001");

check("source_chain_model", d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
check("parent_source_chain_entry_count", d.parent_source_chain_entry_count, 72);
check("source_chain_entry_count", d.source_chain_entry_count, 73);

if (!d.source_chain_current_entry || typeof d.source_chain_current_entry !== "object") {
  console.log("VALIDATOR_SOURCE_CHAIN_CURRENT_ENTRY_MISSING");
  ok = false;
} else {
  check("source_chain_current_entry_program", d.source_chain_current_entry.program, "PROG-355");
  check("source_chain_current_entry_object_id", d.source_chain_current_entry.object_id, d.object_id);
  check("source_chain_current_entry_marker", d.source_chain_current_entry.marker, d.marker);
  check("source_chain_current_entry_parent_object_id", d.source_chain_current_entry.parent_object_id, parent.object_id);
  check("source_chain_current_entry_parent_marker", d.source_chain_current_entry.parent_marker, parent.marker);
  check("source_chain_current_entry_parent_commit", d.source_chain_current_entry.parent_commit, "7d4df4c01d200380af86c7f2ecdf8fb8dd58565d");
  check("source_chain_current_entry_basis_main_commit", d.source_chain_current_entry.basis_main_commit, "7d4df4c01d200380af86c7f2ecdf8fb8dd58565d");
}

check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");
check("customer_delivery_scope", d.customer_delivery_scope, "CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_ONLY");
check("customer_delivery_conformance_scope", d.customer_delivery_conformance_scope, "DEFINE_CUSTOMER_DELIVERY_BOUNDARIES_WITHOUT_CUSTOMER_DELIVERY_EXECUTION_CUSTOMER_RECEIPT_CUSTOMER_ACKNOWLEDGEMENT_CUSTOMER_ACCEPTANCE_CUSTOMER_READINESS_OR_EXTERNAL_RELIANCE");
check("customer_delivery_record_class", d.customer_delivery_record_class, "CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_DRAFT_RECORD");

check("parent_non_claim_input_count", d.parent_non_claim_input_count, 6437);
check("parent_non_claim_unique_count", d.parent_non_claim_unique_count, 6437);
check("parent_non_claim_internal_duplicate_count", d.parent_non_claim_internal_duplicate_count, 0);
check("parent_no_execution_boundary_input_count", d.parent_no_execution_boundary_input_count, 6437);
check("parent_no_execution_boundary_unique_count", d.parent_no_execution_boundary_unique_count, 6437);
check("parent_no_execution_boundary_internal_duplicate_count", d.parent_no_execution_boundary_internal_duplicate_count, 0);

check("field_count", d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_delivery_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 6616);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 6616);
check("false_claim_property_count", d.false_claim_property_count, 7074);
check("future_customer_decision_proof_customer_delivery_false_key_count", d.future_customer_decision_proof_customer_delivery_false_key_count, 179);
check("all_customer_decision_proof_customer_delivery_false_key_count", d.all_customer_decision_proof_customer_delivery_false_key_count, 179);
check("inherited_customer_decision_proof_customer_delivery_false_key_count", d.inherited_customer_decision_proof_customer_delivery_false_key_count, 0);
check("missing_future_customer_decision_proof_customer_delivery_false_key_count", d.missing_future_customer_decision_proof_customer_delivery_false_key_count, 0);
check("overlap_non_claim_count", d.overlap_non_claim_count, 0);
check("overlap_no_execution_boundary_count", d.overlap_no_execution_boundary_count, 0);

check("recommended_next_program", d.recommended_next_program, "PROG-356");
check("recommended_next_object_id", d.recommended_next_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001");
check("result", d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT");

const fields = requireArrayFromDoc(d, "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_delivery_conformance_fields", 111);
const bindingRules = requireArrayFromDoc(d, "binding_rules", 111);
const futureRequirements = requireArrayFromDoc(d, "future_resolution_requirements", 179);
const nonClaims = requireArrayFromDoc(d, "explicit_non_claims", 6616);
const noExecutionBoundary = requireArrayFromDoc(d, "no_execution_boundary", 6616);

check("non_claim_unique_count_matches_array", unique(nonClaims).length, 6616);
check("no_execution_boundary_unique_count_matches_array", unique(noExecutionBoundary).length, 6616);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_delivery_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`VALIDATOR_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const prefix = "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_delivery_";

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

check("false_claim_property_count_dynamic", falseClaimCount, 7074);
check("future_customer_delivery_false_key_count_dynamic", futureFalseKeys.length, 179);
check("all_customer_delivery_false_key_count_dynamic", allCustomerDeliveryFalseKeys.length, 179);
check("inherited_customer_delivery_false_key_count_dynamic", inheritedCustomerDeliveryFalseKeys.length, 0);
check("missing_future_customer_delivery_false_key_count_dynamic", missingFutureFalseKeys.length, 0);

if (Array.isArray(d.inherited_customer_decision_proof_customer_delivery_false_keys)) {
  check("declared_inherited_customer_decision_proof_customer_delivery_false_keys_json", JSON.stringify(d.inherited_customer_decision_proof_customer_delivery_false_keys), JSON.stringify([]));
} else {
  console.log("VALIDATOR_INHERITED_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_FALSE_KEYS_ARRAY_MISSING");
  ok = false;
}

if (d.required_non_claim_count !== d.parent_non_claim_unique_count + 179 - d.overlap_non_claim_count) {
  console.log(`VALIDATOR_NON_CLAIM_ARITHMETIC_INVALID actual=${d.required_non_claim_count} parentUnique=${d.parent_non_claim_unique_count} overlap=${d.overlap_non_claim_count}`);
  ok = false;
}

if (d.required_no_execution_boundary_count !== d.parent_no_execution_boundary_unique_count + 179 - d.overlap_no_execution_boundary_count) {
  console.log(`VALIDATOR_NO_EXECUTION_BOUNDARY_ARITHMETIC_INVALID actual=${d.required_no_execution_boundary_count} parentUnique=${d.parent_no_execution_boundary_unique_count} overlap=${d.overlap_no_execution_boundary_count}`);
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
  "customer_decision_proof_customer_delivery_created",
  "customer_decision_proof_customer_delivery_started",
  "customer_decision_proof_customer_delivery_completed",
  "customer_decision_proof_customer_delivery_effective",
  "customer_decision_proof_customer_delivery_verified",
  "customer_decision_proof_customer_delivery_accepted",
  "customer_decision_proof_customer_delivery_approved",
  "customer_decision_proof_delivered",
  "customer_delivery_created",
  "customer_delivery_started",
  "customer_delivery_completed",
  "customer_delivery_effective",
  "customer_delivery_verified",
  "customer_delivery_received",
  "customer_delivery_acknowledged",
  "customer_delivery_accepted",
  "customer_delivery_binding",
  "customer_receipt_created",
  "customer_receipt_completed",
  "customer_receipt_effective",
  "customer_receipt_verified",
  "customer_receipt_signed",
  "customer_acknowledgement_created",
  "customer_acknowledgement_completed",
  "customer_acknowledgement_effective",
  "customer_acknowledgement_verified",
  "customer_acknowledgement_signed",
  "customer_acceptance_created",
  "customer_acceptance_completed",
  "customer_acceptance_effective",
  "customer_acceptance_verified",
  "customer_ready",
  "production_ready",
  "deployment_ready",
  "runtime_ready",
  "operational_ready",
  "legal_certification_created",
  "legal_certification_completed",
  "legal_certification_effective",
  "legal_validity_created",
  "legal_validity_completed",
  "legal_validity_effective",
  "legal_effect_created",
  "legal_effect_effective",
  "enforceability_created",
  "enforceability_effective",
  "external_reliance_allowed",
  "commercial_reliance_allowed",
  "customer_reliance_allowed"
];

for (const key of criticalFalseClaims) {
  check(key, d[key], false);
}

const boundaryText = [
  d.source_document_boundary_statement || "",
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_delivery_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

const requiredBoundaryFragments = [
  "does not create customer delivery",
  "does not create delivery execution",
  "does not create customer receipt",
  "does not create customer acknowledgement",
  "does not create customer acceptance",
  "does not create customer readiness",
  "does not create production readiness",
  "does not create deployment readiness",
  "does not create runtime readiness",
  "does not create operational readiness",
  "does not create legal certification",
  "does not create legal validity",
  "does not create legal effect",
  "does not create enforceability",
  "Customer Decision Proof Production Readiness draft does not imply Customer Decision Proof Customer Delivery",
  "Customer Decision Proof Customer Delivery draft does not imply customer delivery",
  "Production Readiness Conformance draft != Customer Delivery",
  "Customer Delivery Conformance draft != delivered",
  "Customer Delivery Conformance draft != received",
  "Customer Delivery Conformance draft != acknowledged",
  "Customer Delivery Conformance draft != accepted",
  "Customer Delivery Conformance draft != customer ready",
  "UNKNOWN or INSUFFICIENT_EVIDENCE"
];

for (const fragment of requiredBoundaryFragments) {
  requireIncludes("boundary", boundaryText, fragment);
}

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
  parent_non_claim_input_count: d.parent_non_claim_input_count,
  parent_non_claim_unique_count: d.parent_non_claim_unique_count,
  parent_non_claim_internal_duplicate_count: d.parent_non_claim_internal_duplicate_count,
  parent_no_execution_boundary_input_count: d.parent_no_execution_boundary_input_count,
  parent_no_execution_boundary_unique_count: d.parent_no_execution_boundary_unique_count,
  parent_no_execution_boundary_internal_duplicate_count: d.parent_no_execution_boundary_internal_duplicate_count,
  required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_delivery_conformance_field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_delivery_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: falseClaimCount,
  future_customer_decision_proof_customer_delivery_false_key_count: futureFalseKeys.length,
  all_customer_decision_proof_customer_delivery_false_key_count: allCustomerDeliveryFalseKeys.length,
  inherited_customer_decision_proof_customer_delivery_false_key_count: inheritedCustomerDeliveryFalseKeys.length,
  inherited_customer_decision_proof_customer_delivery_false_keys: inheritedCustomerDeliveryFalseKeys,
  missing_future_customer_decision_proof_customer_delivery_false_key_count: missingFutureFalseKeys.length,
  overlap_non_claim_count: d.overlap_non_claim_count,
  overlap_no_execution_boundary_count: d.overlap_no_execution_boundary_count,
  customer_decision_proof_customer_delivery_created: d.customer_decision_proof_customer_delivery_created,
  customer_decision_proof_customer_delivery_completed: d.customer_decision_proof_customer_delivery_completed,
  customer_decision_proof_customer_delivery_effective: d.customer_decision_proof_customer_delivery_effective,
  customer_delivery_created: d.customer_delivery_created,
  customer_delivery_completed: d.customer_delivery_completed,
  customer_delivery_effective: d.customer_delivery_effective,
  customer_delivery_received: d.customer_delivery_received,
  customer_delivery_acknowledged: d.customer_delivery_acknowledged,
  customer_acceptance_created: d.customer_acceptance_created,
  customer_acceptance_completed: d.customer_acceptance_completed,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready,
  recommended_next_program: d.recommended_next_program,
  recommended_next_object_id: d.recommended_next_object_id,
  result: ok ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT" : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT"
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}
