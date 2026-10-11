#!/usr/bin/env node
const fs = require("fs");
const assert = require("assert");

const manifestPath =
  process.argv[2] ||
  "evidence/authorization/20261011_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_v001.json";

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const stem =
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT";

const finalAuditMarker =
  "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

const fieldArrayName =
  "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_acceptance_conformance_fields";

function assertUniqueArray(name, expectedLength) {
  assert(Array.isArray(d[name]), `${name}_NOT_ARRAY`);
  assert.strictEqual(d[name].length, expectedLength, `${name}_LENGTH_INVALID`);
  assert.strictEqual(new Set(d[name]).size, expectedLength, `${name}_DUPLICATE_VALUES`);
}

assert.strictEqual(d.program, "PROG-369");
assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.artifact_type, "HBCEEndpointCustomerEvidenceDisputeDisposalCustomerDecisionProofCustomerAcceptanceConformanceBindingDraft");
assert.strictEqual(d.classification, "R_AND_D_" + stem + "_ONLY");
assert.strictEqual(d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.version, "v001");
assert.strictEqual(d.marker, "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT=PASS");
assert.strictEqual(d.result, "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.final_audit_marker, finalAuditMarker);

assert.strictEqual(
  d.basis_marker,
  "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACKNOWLEDGMENT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1"
);
assert.strictEqual(d.basis_main_commit, "a12d48fe67c39ca2f2983e9547ec486e12077ce8");
assert.strictEqual(d.parent_commit, "a12d48fe67c39ca2f2983e9547ec486e12077ce8");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-ACKNOWLEDGMENT-CONFORMANCE-BINDING-DRAFT-V001"
);

assert.strictEqual(d.source_chain_model, "COMPRESSED_PARENT_COUNT_PLUS_CURRENT_ENTRY");
assert.strictEqual(d.parent_source_chain_entry_count, 86);
assert.strictEqual(d.source_chain_entry_count, 87);

assert.strictEqual(
  d.binding_scope,
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING"
);
assert.strictEqual(d.binding_mode, "RECORD_ONLY_NOT_EXECUTABLE");
assert.strictEqual(d.state, "NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME");

assert.strictEqual(d.customer_acceptance_scope, "CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_ONLY");
assert.strictEqual(
  d.customer_acceptance_conformance_scope,
  "DEFINE_CUSTOMER_ACCEPTANCE_BOUNDARIES_WITHOUT_ACCEPTANCE_EXECUTION_CLOSURE_LEGAL_FINALITY_CUSTOMER_RELIANCE_LEGAL_CERTIFICATION_OR_EXTERNAL_RELIANCE"
);
assert.strictEqual(d.customer_acceptance_record_class, "CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_DRAFT_RECORD");

assertUniqueArray(fieldArrayName, 111);
assert.strictEqual(
  d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_acceptance_conformance_field_count,
  111
);

assertUniqueArray("binding_rules", 111);
assert.strictEqual(d.binding_rule_count, 111);

assertUniqueArray("future_resolution_requirements", 179);
assert.strictEqual(d.future_resolution_requirement_count, 179);

assertUniqueArray("all_customer_decision_proof_customer_acceptance_false_keys", 179);
assert.strictEqual(d.future_customer_decision_proof_customer_acceptance_false_key_count, 179);
assert.strictEqual(d.all_customer_decision_proof_customer_acceptance_false_key_count, 179);
assert(Array.isArray(d.inherited_customer_decision_proof_customer_acceptance_false_keys));
assert.strictEqual(d.inherited_customer_decision_proof_customer_acceptance_false_keys.length, 0);
assert.strictEqual(d.inherited_customer_decision_proof_customer_acceptance_false_key_count, 0);
assert.strictEqual(d.inherited_customer_decision_proof_customer_acceptance_false_keys_length, 0);
assert(Array.isArray(d.missing_future_customer_decision_proof_customer_acceptance_false_keys));
assert.strictEqual(d.missing_future_customer_decision_proof_customer_acceptance_false_keys.length, 0);
assert.strictEqual(d.missing_future_customer_decision_proof_customer_acceptance_false_key_count, 0);

assertUniqueArray("explicit_non_claims", 9122);
assert.strictEqual(d.required_non_claim_count, 9122);
assert.strictEqual(d.parent_non_claim_input_count, 8943);
assert.strictEqual(d.parent_non_claim_unique_count, 8943);
assert.strictEqual(d.overlap_non_claim_count, 0);

assertUniqueArray("no_execution_boundary", 9122);
assert.strictEqual(d.required_no_execution_boundary_count, 9122);
assert.strictEqual(d.parent_no_execution_boundary_input_count, 8943);
assert.strictEqual(d.parent_no_execution_boundary_unique_count, 8943);
assert.strictEqual(d.overlap_no_execution_boundary_count, 0);

assert.strictEqual(d.false_claim_property_count, 8638);

for (const key of d.all_customer_decision_proof_customer_acceptance_false_keys) {
  assert.strictEqual(d[key], false, `ACCEPTANCE_FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of [
  "customer_acknowledgment_ready",
  "customer_acceptance_created",
  "customer_acceptance_started",
  "customer_acceptance_completed",
  "customer_acceptance_effective",
  "customer_acceptance_verified",
  "customer_acceptance_approved",
  "customer_acceptance_binding",
  "customer_acceptance_ready",
  "customer_closure_created",
  "customer_closure_completed",
  "customer_closure_ready",
  "legal_finality_ready",
  "legal_validity_ready",
  "legal_certification_ready",
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
  assert.strictEqual(d[key], false, `${key}_MUST_BE_FALSE`);
}

assert.strictEqual(
  d.reference_customer_acceptance_contract_path,
  "evidence/authorization/20261009_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_v001.json"
);
assert.strictEqual(
  d.reference_acceptance_contract_path,
  "evidence/authorization/20261008_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_v001.json"
);
assert.strictEqual(
  d.reference_customer_acceptance_contract_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(
  d.reference_acceptance_contract_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001"
);

assert.strictEqual(d.recommended_next_program, "PROG-370");
assert.strictEqual(
  d.recommended_next_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-CLOSURE-CONFORMANCE-BINDING-DRAFT-V001"
);

const boundary = [
  d.source_document_boundary_statement || "",
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_acceptance_boundary_statement || "",
  d.non_inference_rule || "",
  d.unknown_precedence_rule || ""
].join("\n");

for (const fragment of [
  "Controlled R&D customer acceptance conformance binding draft only",
  "does not create actual customer acceptance",
  "Customer Acknowledgment Conformance draft does not imply Customer Acceptance",
  "Customer Acceptance Conformance draft does not imply actual acceptance",
  "Customer Acceptance Conformance draft does not imply closure",
  "Customer Acceptance Conformance draft does not imply legal finality",
  "Acknowledgment does not imply acceptance",
  "Acceptance does not imply closure",
  "Closure does not imply legal finality",
  "Acceptance does not imply verification",
  "Acknowledgment does not imply verification",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "CUSTOMER_ACKNOWLEDGMENT_CONFORMANCE_DRAFT != CUSTOMER_ACCEPTANCE",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != ACTUAL_CUSTOMER_ACCEPTANCE",
  "ACKNOWLEDGMENT != ACCEPTANCE",
  "ACCEPTANCE != CLOSURE",
  "CLOSURE != LEGAL_FINALITY"
]) {
  assert(boundary.includes(fragment), `BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  marker: d.marker,
  status: d.status,
  result: d.result,
  source_chain_entry_count: d.source_chain_entry_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  customer_acknowledgment_ready: d.customer_acknowledgment_ready,
  customer_acceptance_ready: d.customer_acceptance_ready,
  customer_closure_ready: d.customer_closure_ready,
  customer_ready: d.customer_ready,
  production_ready: d.production_ready
}, null, 2));

console.log(finalAuditMarker);
