#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const manifestPath = process.argv[2] || "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT_v001.json";

const OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-VERIFIED-REALIZED-BENEFIT-CONFORMANCE-BINDING-DRAFT-V001";
const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT";
const EXPECTED_PENDING_SHA = "2fbc624c4bcf739b5a4fb5df7a2a86ca322d09bffb4a0e12cc4317712982c09a";
const FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

const raw = fs.readFileSync(manifestPath);
const d = JSON.parse(raw);
const sha = crypto.createHash("sha256").update(raw).digest("hex");

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-394");
assert.strictEqual(d.object_id, OBJECT_ID);
assert.strictEqual(d.stem, STEM);
assert.strictEqual(d.title, "PROG-394 Deployment Verified Realized Benefit Conformance Binding Draft v001");

assert.strictEqual(d.parent_program, "PROG-393");
assert.strictEqual(d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-REALIZED-BENEFIT-CONFORMANCE-BINDING-DRAFT-V001");
assert.strictEqual(d.parent_status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.parent_commit, "fe4fc6b7f0cb4ca668b66bc2ef5110d9dcd07b48");
assert.strictEqual(d.basis_main_commit, "fe4fc6b7f0cb4ca668b66bc2ef5110d9dcd07b48");
assert.strictEqual(d.parent_manifest_sha256, "3b8f25eb4124fb5f4c10cbe44f5f210114308d308bf53507fc11faf50e35b1e1");
assert.strictEqual(d.parent_validator_sha256, "6d5eaf6ad6670a0a1d6c30894975c051f2dbc6418f4998a5bb46ec3e688141d2");

assert.strictEqual(d.parent_source_chain_entry_count, 111);
assert.strictEqual(d.source_chain_entry_count, 112);
assert(Array.isArray(d.source_chain_entries));
assert.strictEqual(d.source_chain_entries.length, 112);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_verified_realized_benefit_conformance_field_count, 152);
assert(Array.isArray(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_verified_realized_benefit_conformance_fields));
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_verified_realized_benefit_conformance_fields.length, 152);

assert.strictEqual(d.binding_rule_count, 152);
assert(Array.isArray(d.binding_rules));
assert.strictEqual(d.binding_rules.length, 152);

assert.strictEqual(d.deployment_verified_realized_benefit_boundary_rule_count, 38);
assert(Array.isArray(d.deployment_verified_realized_benefit_boundary_rules));
assert.strictEqual(d.deployment_verified_realized_benefit_boundary_rules.length, 38);

assert(Array.isArray(d.required_deployment_verified_realized_benefit_fields));
assert.strictEqual(d.required_deployment_verified_realized_benefit_fields.length, 24);

assert.strictEqual(d.future_resolution_requirement_count, 1318);
assert(Array.isArray(d.future_resolution_requirements));
assert.strictEqual(d.future_resolution_requirements.length, 1318);

assert.strictEqual(d.required_non_claim_count, 35294);
assert(Array.isArray(d.required_non_claim_properties));
assert.strictEqual(d.required_non_claim_properties.length, 35294);

assert.strictEqual(d.required_no_execution_boundary_count, 25440);
assert(Array.isArray(d.required_no_execution_boundary_properties));
assert.strictEqual(d.required_no_execution_boundary_properties.length, 25440);

assert.strictEqual(d.false_claim_property_count, 13603);
assert(Array.isArray(d.false_claim_properties));
assert.strictEqual(d.false_claim_properties.length, 13603);

assert.strictEqual(d.future_customer_decision_proof_deployment_verified_realized_benefit_false_key_count, 489);
assert.strictEqual(d.all_customer_decision_proof_deployment_verified_realized_benefit_false_key_count, 489);
assert(Array.isArray(d.future_customer_decision_proof_deployment_verified_realized_benefit_false_keys));
assert.strictEqual(d.future_customer_decision_proof_deployment_verified_realized_benefit_false_keys.length, 489);

assert.strictEqual(d.new_deployment_verified_realized_benefit_false_key_count, 18);
assert(Array.isArray(d.new_deployment_verified_realized_benefit_false_keys));
assert.strictEqual(d.new_deployment_verified_realized_benefit_false_keys.length, 18);

for (const key of d.future_customer_decision_proof_deployment_verified_realized_benefit_false_keys) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of [
  "deployment_verified_realized_benefit_ready",
  "deployment_verified_realized_benefit_created",
  "deployment_verified_realized_benefit_registered",
  "deployment_verified_realized_benefit_effective",
  "deployment_verified_realized_benefit_final",
  "deployment_verified_realized_benefit_independent_attestation_created",
  "deployment_verified_realized_benefit_independent_attestation_registered",
  "deployment_verified_realized_benefit_independent_attestation_effective",
  "deployment_verified_realized_benefit_matrix_state_updated",
  "deployment_verified_realized_benefit_opc_allow",
  "deployment_verified_realized_benefit_runtime_deletion_executed",
  "deployment_verified_realized_benefit_runtime_destruction_executed",
  "deployment_verified_realized_benefit_data_destruction_executed",
  "deployment_verified_realized_benefit_data_erasure_executed",
  "opc_allow",
  "opc_deployment_verified_realized_benefit_allow",
  "matrix_effective_state_updated",
  "matrix_deployment_verified_realized_benefit_created",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_erasure_executed",
  "verified_realized_benefit_customer_acceptance_created",
  "verified_realized_benefit_regulatory_acceptance_created"
]) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_REQUIRED_FALSE_FLAG_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_verified_realized_benefit_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.deployment_verified_realized_benefit_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Deployment Realized Benefit Conformance draft does not imply Deployment Verified Realized Benefit Conformance",
  "Realized benefit does not imply verified realized benefit",
  "Verified realized benefit does not imply independent third-party attestation",
  "Verified realized benefit does not imply financial return",
  "Verified realized benefit does not imply customer success",
  "Verified realized benefit does not imply regulatory acceptance",
  "Verified realized benefit does not imply OPC ALLOW",
  "Verified realized benefit does not imply Matrix effective state update",
  "VERIFIED_REALIZED_BENEFIT != INDEPENDENT_ATTESTATION",
  "VERIFIED_REALIZED_BENEFIT != CUSTOMER_ACCEPTANCE",
  "VERIFIED_REALIZED_BENEFIT != REGULATORY_ACCEPTANCE",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_CLAIMS",
  "DEPLOYMENT_REALIZED_BENEFIT_CONFORMANCE_DOES_NOT_CREATE_VERIFIED_REALIZED_BENEFIT",
  "DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_DOES_NOT_CREATE_RUNTIME_OR_DATA_EXECUTION"
]) {
  assert(boundary.includes(fragment), `DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

let validatorResultAssertion;
if (d.status === "DRAFT_PENDING_VALIDATION") {
  assert.strictEqual(sha, EXPECTED_PENDING_SHA);
  assert.strictEqual(d.marker, `${STEM}=PENDING_VALIDATION`);
  assert.strictEqual(d.result, "PENDING_VALIDATION");
  assert.strictEqual(d.result_assertion, "PASS_PROG_394_MANIFEST_CREATION_DEPLOYMENT_VERIFIED_REALIZED_BENEFIT");
  assert.strictEqual(d.final_audit_marker, undefined);
  validatorResultAssertion = "PASS_PROG_394_VALIDATOR_PENDING_MANIFEST";
} else {
  assert.strictEqual(d.status, `ACTIVE_${STEM}`);
  assert.strictEqual(d.marker, `${STEM}=PASS`);
  assert.strictEqual(d.result, `PASS_${STEM}`);
  assert.strictEqual(d.result_assertion, "PASS_PROG_394_STEP_4_PROMOTE_TO_PASS");
  assert.strictEqual(d.final_audit_marker, FINAL_AUDIT_MARKER);
  validatorResultAssertion = "PASS_PROG_394_VALIDATOR_ACTIVE_MANIFEST";
}

console.log(JSON.stringify({
  object_id: d.object_id,
  program: d.program,
  status: d.status,
  marker: d.marker,
  result: d.result,
  parent_program: d.parent_program,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_verified_realized_benefit_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  deployment_verified_realized_benefit_boundary_rule_count: d.deployment_verified_realized_benefit_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_verified_realized_benefit_false_key_count: d.future_customer_decision_proof_deployment_verified_realized_benefit_false_key_count,
  deployment_verified_realized_benefit_ready: d.deployment_verified_realized_benefit_ready,
  deployment_verified_realized_benefit_created: d.deployment_verified_realized_benefit_created,
  deployment_verified_realized_benefit_registered: d.deployment_verified_realized_benefit_registered,
  deployment_verified_realized_benefit_effective: d.deployment_verified_realized_benefit_effective,
  deployment_verified_realized_benefit_final: d.deployment_verified_realized_benefit_final,
  deployment_verified_realized_benefit_independent_attestation_created: d.deployment_verified_realized_benefit_independent_attestation_created,
  deployment_verified_realized_benefit_independent_attestation_registered: d.deployment_verified_realized_benefit_independent_attestation_registered,
  deployment_verified_realized_benefit_independent_attestation_effective: d.deployment_verified_realized_benefit_independent_attestation_effective,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_erasure_executed: d.data_erasure_executed,
  manifest_sha256: sha,
  result_assertion: validatorResultAssertion
}, null, 2));

console.log("PROG_394_DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
