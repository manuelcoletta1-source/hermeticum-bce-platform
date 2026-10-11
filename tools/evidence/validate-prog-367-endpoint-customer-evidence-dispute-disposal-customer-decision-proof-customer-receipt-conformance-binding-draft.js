#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const parentFile = "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT_v001.json";
const referenceFile = "evidence/authorization/20261007_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_EXECUTION_RECEIPT_CONFORMANCE_BINDING_DRAFT_v001.json";
const file = "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_BINDING_DRAFT_v001.json";

const parent = JSON.parse(fs.readFileSync(parentFile, "utf8"));
const reference = JSON.parse(fs.readFileSync(referenceFile, "utf8"));
const d = JSON.parse(fs.readFileSync(file, "utf8"));

let ok = true;

function sha256(path) {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

function check(name, actual, expected) {
  if (actual !== expected) {
    console.log(`PROG_367_CUSTOMER_RECEIPT_MISMATCH ${name}: expected=${expected} actual=${actual}`);
    ok = false;
  }
}

function requireArray(name, expectedLength) {
  if (!Array.isArray(d[name])) {
    console.log(`PROG_367_CUSTOMER_RECEIPT_ARRAY_MISSING ${name}`);
    ok = false;
    return [];
  }

  if (d[name].length !== expectedLength) {
    console.log(`PROG_367_CUSTOMER_RECEIPT_ARRAY_LENGTH_MISMATCH ${name}: expected=${expectedLength} actual=${d[name].length}`);
    ok = false;
  }

  return d[name];
}

function unique(items) {
  return Array.from(new Set(items));
}

function requireIncludes(source, text, fragment) {
  if (!String(text || "").includes(fragment)) {
    console.log(`PROG_367_CUSTOMER_RECEIPT_FRAGMENT_MISSING ${source}: ${fragment}`);
    ok = false;
  }
}

const parentStem = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT";
const stem = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_BINDING_DRAFT";

check("parent.object_id", parent.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-DELIVERY-CONFORMANCE-BINDING-DRAFT-V001");
check("parent.marker", parent.marker, parentStem + "=PASS");
check("parent.result", parent.result, "PASS_" + parentStem);
check("parent.final_audit_marker", parent.final_audit_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("parent.source_chain_entry_count", parent.source_chain_entry_count, 84);
check("parent.required_non_claim_count", parent.required_non_claim_count, 8585);
check("parent.required_no_execution_boundary_count", parent.required_no_execution_boundary_count, 8585);
check("parent.false_claim_property_count", parent.false_claim_property_count, 8072);
check("parent.customer_delivery_ready", parent.customer_delivery_ready, false);
check("parent.customer_ready", parent.customer_ready, false);
check("parent.production_ready", parent.production_ready, false);

if (
  !String(reference.object_id || "").includes("EXECUTION-RECEIPT-CONFORMANCE-BINDING-DRAFT") &&
  !String(reference.object_id || "").includes("RECEIPT-CONFORMANCE-BINDING-DRAFT")
) {
  console.log("PROG_367_REFERENCE_RECEIPT_CONTRACT_INVALID");
  ok = false;
}

check("object_id", d.object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-RECEIPT-CONFORMANCE-BINDING-DRAFT-V001");
check("artifact_type", d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofCustomerReceiptConformanceBindingDraft");
check("classification", d.classification, "R_AND_D_" + stem + "_ONLY");
check("status", d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_BINDING_DRAFT");
check("version", d.version, "v001");
check("program", d.program, "PROG-367");
check("marker", d.marker, stem + "=PASS");
check("result", d.result, "PASS_" + stem);

check("basis_marker", d.basis_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_DELIVERY_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
check("basis_main_commit", d.basis_main_commit, "06c0dc82ffb17e2dd82bb823d34616be390e0a53");
check("parent_object_id", d.parent_object_id, parent.object_id);
check("parent_marker", d.parent_marker, parent.marker);
check("parent_commit", d.parent_commit, "06c0dc82ffb17e2dd82bb823d34616be390e0a53");

check("source_chain_model", d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
check("parent_source_chain_entry_count", d.parent_source_chain_entry_count, 84);
check("source_chain_entry_count", d.source_chain_entry_count, 85);

check("binding_scope", d.binding_scope, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_BINDING");
check("binding_mode", d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
check("state", d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");

check("customer_receipt_scope", d.customer_receipt_scope, "CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_ONLY");
check("customer_receipt_conformance_scope", d.customer_receipt_conformance_scope, "DEFINE_CUSTOMER_RECEIPT_BOUNDARIES_WITHOUT_RECEIPT_EXECUTION_ACKNOWLEDGMENT_ACCEPTANCE_CLOSURE_CUSTOMER_RELIANCE_LEGAL_CERTIFICATION_OR_EXTERNAL_RELIANCE");
check("customer_receipt_record_class", d.customer_receipt_record_class, "CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_DRAFT_RECORD");

check("reference_receipt_contract_path", d.reference_receipt_contract_path, referenceFile);
check("reference_receipt_contract_object_id", d.reference_receipt_contract_object_id, reference.object_id || "UNKNOWN_REFERENCE_OBJECT_ID");
check("reference_receipt_contract_sha256", d.reference_receipt_contract_sha256, sha256(referenceFile));
check("parent_manifest_sha256", d.parent_manifest_sha256, sha256(parentFile));

check("required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_receipt_conformance_field_count", d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_receipt_conformance_field_count, 111);
check("binding_rule_count", d.binding_rule_count, 111);
check("future_resolution_requirement_count", d.future_resolution_requirement_count, 179);
check("required_non_claim_count", d.required_non_claim_count, 8764);
check("required_no_execution_boundary_count", d.required_no_execution_boundary_count, 8764);
check("false_claim_property_count", d.false_claim_property_count, 8263);
check("future_customer_decision_proof_customer_receipt_false_key_count", d.future_customer_decision_proof_customer_receipt_false_key_count, 179);
check("all_customer_decision_proof_customer_receipt_false_key_count", d.all_customer_decision_proof_customer_receipt_false_key_count, 179);
check("inherited_customer_decision_proof_customer_receipt_false_key_count", d.inherited_customer_decision_proof_customer_receipt_false_key_count, 0);
check("inherited_customer_decision_proof_customer_receipt_false_keys_length", d.inherited_customer_decision_proof_customer_receipt_false_keys_length, 0);
check("missing_future_customer_decision_proof_customer_receipt_false_key_count", d.missing_future_customer_decision_proof_customer_receipt_false_key_count, 0);
check("overlap_non_claim_count", d.overlap_non_claim_count, 0);
check("overlap_no_execution_boundary_count", d.overlap_no_execution_boundary_count, 0);

for (const key of [
  "customer_receipt_created",
  "customer_receipt_started",
  "customer_receipt_completed",
  "customer_receipt_effective",
  "customer_receipt_verified",
  "customer_receipt_approved",
  "customer_receipt_binding",
  "customer_receipt_ready",
  "customer_acknowledgment_created",
  "customer_acknowledgment_completed",
  "customer_acknowledgment_ready",
  "customer_acceptance_ready",
  "customer_closure_ready",
  "customer_ready",
  "customer_use_ready",
  "customer_access_ready",
  "customer_reliance_ready",
  "commercial_ready",
  "production_ready",
  "deployment_ready",
  "runtime_ready",
  "operational_ready",
  "external_reliance_allowed",
  "commercial_reliance_allowed",
  "customer_reliance_allowed",
  "legal_reliance_allowed"
]) {
  check(key, d[key], false);
}

const fields = requireArray("required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_receipt_conformance_fields", 111);
const bindingRules = requireArray("binding_rules", 111);
const futureRequirements = requireArray("future_resolution_requirements", 179);
const explicitNonClaims = requireArray("explicit_non_claims", 8764);
const noExecutionBoundary = requireArray("no_execution_boundary", 8764);
const receiptFalseKeys = requireArray("all_customer_decision_proof_customer_receipt_false_keys", 179);
const inheritedFalseKeys = requireArray("inherited_customer_decision_proof_customer_receipt_false_keys", 0);
const missingFutureFalseKeysRecorded = requireArray("missing_future_customer_decision_proof_customer_receipt_false_keys", 0);

check("fields.unique", unique(fields).length, 111);
check("binding_rules.unique", unique(bindingRules).length, 111);
check("future_requirements.unique", unique(futureRequirements).length, 179);
check("explicit_non_claims.unique", unique(explicitNonClaims).length, 8764);
check("no_execution_boundary.unique", unique(noExecutionBoundary).length, 8764);
check("receipt_false_keys.unique", unique(receiptFalseKeys).length, 179);
check("inherited_false_keys.length", inheritedFalseKeys.length, 0);
check("missing_future_false_keys_recorded.length", missingFutureFalseKeysRecorded.length, 0);

for (const field of fields) {
  const expectedRule = `bind_${field}_within_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_receipt_conformance_only`;

  if (!bindingRules.includes(expectedRule)) {
    console.log(`PROG_367_CUSTOMER_RECEIPT_BINDING_RULE_MISSING ${expectedRule}`);
    ok = false;
  }
}

const receiptPrefix = "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_receipt_";

const futureFalseKeys = futureRequirements
  .filter(item => item.startsWith(`define_future_resolution_for_${receiptPrefix}`))
  .map(item => item.replace("define_future_resolution_for_", ""))
  .sort();

const futureFalseKeySet = new Set(futureFalseKeys);

const allReceiptFalseKeysDynamic = Object.keys(d)
  .filter(key => key.startsWith(receiptPrefix) && d[key] === false)
  .sort();

const inheritedReceiptFalseKeysDynamic = allReceiptFalseKeysDynamic
  .filter(key => !futureFalseKeySet.has(key) && parent[key] === false)
  .sort();

const missingFutureFalseKeys = futureFalseKeys
  .filter(key => d[key] !== false)
  .sort();

const falseClaimCount = Object.keys(d).filter(key => d[key] === false).length;

check("false_claim_property_count_dynamic", falseClaimCount, 8263);
check("future_false_key_count_dynamic", futureFalseKeys.length, 179);
check("all_receipt_false_key_count_dynamic", allReceiptFalseKeysDynamic.length, 179);
check("inherited_receipt_false_key_count_dynamic", inheritedReceiptFalseKeysDynamic.length, 0);
check("missing_future_false_key_count_dynamic", missingFutureFalseKeys.length, 0);

if (d.required_non_claim_count !== d.parent_non_claim_unique_count + 179 - d.overlap_non_claim_count) {
  console.log("PROG_367_CUSTOMER_RECEIPT_NON_CLAIM_ARITHMETIC_INVALID");
  ok = false;
}

if (d.required_no_execution_boundary_count !== d.parent_no_execution_boundary_unique_count + 179 - d.overlap_no_execution_boundary_count) {
  console.log("PROG_367_CUSTOMER_RECEIPT_NO_EXECUTION_BOUNDARY_ARITHMETIC_INVALID");
  ok = false;
}

for (const key of receiptFalseKeys) {
  check(key, d[key], false);
}

const boundaryText = [
  d.source_document_boundary_statement || "",
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_receipt_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

for (const fragment of [
  "Customer Delivery Conformance draft does not imply Customer Receipt",
  "Customer Receipt Conformance draft does not imply actual receipt",
  "Customer Receipt Conformance draft does not imply acknowledgment",
  "Customer Receipt Conformance draft does not imply acceptance",
  "Delivery does not imply receipt",
  "Receipt does not imply acknowledgment",
  "Acknowledgment does not imply acceptance",
  "Acceptance does not imply closure",
  "Closure does not imply legal finality",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE"
]) {
  requireIncludes("manifest_boundary", boundaryText, fragment);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  marker: d.marker,
  status: d.status,
  result: ok
    ? "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_BINDING_DRAFT"
    : "FAIL_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_BINDING_DRAFT",
  source_chain_entry_count: d.source_chain_entry_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  customer_receipt_ready: d.customer_receipt_ready,
  customer_acknowledgment_ready: d.customer_acknowledgment_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready
}, null, 2));

if (ok) {
  console.log("ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_BINDING_DRAFT=PASS");
  console.log("HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_RECEIPT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");
} else {
  process.exitCode = 1;
}
