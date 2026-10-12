#!/usr/bin/env node
"use strict";

const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const DEFAULT_MANIFEST = "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT_v001.json";

const manifestPath = process.argv[2] || DEFAULT_MANIFEST;
const raw = fs.readFileSync(manifestPath);
const d = JSON.parse(raw);
const sha = crypto.createHash("sha256").update(raw).digest("hex");

const objectId = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-REALIZED-BENEFIT-CONFORMANCE-BINDING-DRAFT-V001";
const stem = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT";

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-393");
assert.strictEqual(d.object_id, objectId);
assert.strictEqual(d.stem, stem);

const pending = d.status === "DRAFT_PENDING_VALIDATION";
const active = d.status === `ACTIVE_${stem}`;
assert(pending || active, `INVALID_STATUS: ${d.status}`);

if (pending) {
  assert.strictEqual(d.marker, `${stem}=PENDING_VALIDATION`);
  assert.strictEqual(d.result, "PENDING_VALIDATION");
  assert.strictEqual(d.result_assertion, "PASS_PROG_393_MANIFEST_CREATION_DEPLOYMENT_REALIZED_BENEFIT");
} else {
  assert.strictEqual(d.marker, `${stem}=PASS`);
  assert.strictEqual(d.result, `PASS_${stem}`);
  assert.strictEqual(d.result_assertion, "PASS_PROG_393_STEP_4_PROMOTE_TO_PASS");
  assert.strictEqual(d.final_audit_marker, `HBCE_${stem}_FINAL_AUDIT=1`);
}

assert.strictEqual(d.parent_program, "PROG-392");
assert.strictEqual(d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-BENEFIT-CONFORMANCE-BINDING-DRAFT-V001");
assert.strictEqual(d.parent_status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_BENEFIT_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.parent_commit, "5d0edfa7d6b49239b67d99a414905d237b382ab8");
assert.strictEqual(d.basis_main_commit, "5d0edfa7d6b49239b67d99a414905d237b382ab8");
assert.strictEqual(d.parent_manifest_sha256, "6816c2b7bf110a7f5a9c135d353ce6aa115515127cb36d94b2f6dfb5be93d9c4");
assert.strictEqual(d.parent_validator_sha256, "01bdb9169d118da9c80fe6d935daaed477cefb5b0debab9423cd3c9ffc77ce3b");

assert.strictEqual(d.parent_source_chain_entry_count, 110);
assert.strictEqual(d.source_chain_entry_count, 111);
assert.strictEqual(d.source_chain_entries.length, 111);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_realized_benefit_conformance_field_count, 152);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_realized_benefit_conformance_fields.length, 152);

assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.binding_rules.length, 152);

assert.strictEqual(d.deployment_realized_benefit_boundary_rule_count, 37);
assert.strictEqual(d.deployment_realized_benefit_boundary_rules.length, 37);

assert.strictEqual(d.required_deployment_realized_benefit_fields.length, 24);

assert.strictEqual(d.future_resolution_requirement_count, 1280);
assert.strictEqual(d.future_resolution_requirements.length, 1280);

assert.strictEqual(d.required_non_claim_count, 34176);
assert.strictEqual(d.required_non_claim_properties.length, 34176);

assert.strictEqual(d.required_no_execution_boundary_count, 25048);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 25048);

assert.strictEqual(d.false_claim_property_count, 13240);
assert.strictEqual(d.false_claim_properties.length, 13240);

assert.strictEqual(d.future_customer_decision_proof_deployment_realized_benefit_false_key_count, 471);
assert.strictEqual(d.all_customer_decision_proof_deployment_realized_benefit_false_key_count, 471);
assert.strictEqual(d.future_customer_decision_proof_deployment_realized_benefit_false_keys.length, 471);

const requiredFalseFlags = [
  "deployment_authorized",
  "deployment_executed",
  "deployment_execution_ready",
  "deployment_execution_created",
  "deployment_execution_final",
  "deployment_execution_consequence_created",
  "deployment_consequence_ready",
  "deployment_consequence_created",
  "deployment_consequence_registered",
  "deployment_consequence_effective",
  "deployment_consequence_final",
  "deployment_consequence_outcome_created",
  "deployment_consequence_outcome_registered",
  "deployment_consequence_outcome_effective",
  "deployment_outcome_ready",
  "deployment_outcome_created",
  "deployment_outcome_registered",
  "deployment_outcome_effective",
  "deployment_outcome_final",
  "deployment_outcome_impact_created",
  "deployment_outcome_impact_registered",
  "deployment_outcome_impact_effective",
  "deployment_impact_ready",
  "deployment_impact_created",
  "deployment_impact_registered",
  "deployment_impact_effective",
  "deployment_impact_final",
  "deployment_impact_value_created",
  "deployment_impact_value_registered",
  "deployment_impact_value_effective",
  "deployment_value_ready",
  "deployment_value_created",
  "deployment_value_registered",
  "deployment_value_effective",
  "deployment_value_final",
  "deployment_value_benefit_created",
  "deployment_value_benefit_registered",
  "deployment_value_benefit_effective",
  "deployment_benefit_ready",
  "deployment_benefit_created",
  "deployment_benefit_registered",
  "deployment_benefit_effective",
  "deployment_benefit_final",
  "deployment_benefit_realized_created",
  "deployment_benefit_realized_registered",
  "deployment_benefit_realized_effective",
  "deployment_benefit_matrix_state_updated",
  "deployment_benefit_opc_allow",
  "deployment_benefit_runtime_deletion_executed",
  "deployment_benefit_runtime_destruction_executed",
  "deployment_benefit_data_destruction_executed",
  "deployment_benefit_data_erasure_executed",
  "deployment_realized_benefit_ready",
  "deployment_realized_benefit_created",
  "deployment_realized_benefit_registered",
  "deployment_realized_benefit_effective",
  "deployment_realized_benefit_final",
  "deployment_realized_benefit_verified_created",
  "deployment_realized_benefit_verified_registered",
  "deployment_realized_benefit_verified_effective",
  "deployment_realized_benefit_matrix_state_updated",
  "deployment_realized_benefit_opc_allow",
  "deployment_realized_benefit_runtime_deletion_executed",
  "deployment_realized_benefit_runtime_destruction_executed",
  "deployment_realized_benefit_data_destruction_executed",
  "deployment_realized_benefit_data_erasure_executed",
  "opc_allow",
  "opc_deployment_benefit_allow",
  "opc_deployment_realized_benefit_allow",
  "matrix_effective_state_updated",
  "matrix_deployment_benefit_created",
  "matrix_deployment_realized_benefit_created",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_erasure_executed"
];

for (const key of d.future_customer_decision_proof_deployment_realized_benefit_false_keys) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_REALIZED_BENEFIT_FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of requiredFalseFlags) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_REALIZED_BENEFIT_REQUIRED_FALSE_FLAG_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_realized_benefit_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.deployment_realized_benefit_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "PROG-393 must bind Deployment Realized Benefit Conformance as a successor to PROG-392 Deployment Benefit Conformance",
  "Deployment Benefit Conformance draft does not imply Deployment Realized Benefit Conformance",
  "Deployment benefit does not imply realized benefit",
  "Realized benefit does not imply verified realized benefit",
  "Realized benefit does not imply financial return",
  "BENEFIT != REALIZED_BENEFIT",
  "REALIZED_BENEFIT != VERIFIED_REALIZED_BENEFIT",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_REALIZED_BENEFIT_CLAIMS",
  "DEPLOYMENT_BENEFIT_CONFORMANCE_DOES_NOT_CREATE_REALIZED_BENEFIT",
  "DEPLOYMENT_REALIZED_BENEFIT_CONFORMANCE_DOES_NOT_CREATE_VERIFIED_REALIZED_BENEFIT"
]) {
  assert(boundary.includes(fragment), `DEPLOYMENT_REALIZED_BENEFIT_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_realized_benefit_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  deployment_realized_benefit_boundary_rule_count: d.deployment_realized_benefit_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_realized_benefit_false_key_count: d.future_customer_decision_proof_deployment_realized_benefit_false_key_count,
  deployment_realized_benefit_ready: d.deployment_realized_benefit_ready,
  deployment_realized_benefit_created: d.deployment_realized_benefit_created,
  deployment_realized_benefit_registered: d.deployment_realized_benefit_registered,
  deployment_realized_benefit_effective: d.deployment_realized_benefit_effective,
  deployment_realized_benefit_final: d.deployment_realized_benefit_final,
  deployment_realized_benefit_verified_created: d.deployment_realized_benefit_verified_created,
  deployment_realized_benefit_verified_registered: d.deployment_realized_benefit_verified_registered,
  deployment_realized_benefit_verified_effective: d.deployment_realized_benefit_verified_effective,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_erasure_executed: d.data_erasure_executed,
  manifest_sha256: sha,
  result_assertion: pending
    ? "PASS_PROG_393_VALIDATOR_PENDING_MANIFEST"
    : "PASS_PROG_393_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_393_DEPLOYMENT_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
