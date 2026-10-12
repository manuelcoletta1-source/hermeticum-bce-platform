#!/usr/bin/env node
"use strict";

const fs = require("fs");
const assert = require("assert");

const manifestPath =
  process.argv[2] ||
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_v001.json";

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRODUCTION-READINESS-CONFORMANCE-BINDING-DRAFT-V001";
const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT";
const FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_PRODUCTION_READINESS_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-383");
assert.strictEqual(d.object_id, OBJECT_ID);

const allowedStates = new Set([
  "DRAFT_PENDING_VALIDATION",
  `ACTIVE_${STEM}`
]);

assert(allowedStates.has(d.status), `INVALID_STATUS: ${d.status}`);

if (d.status === "DRAFT_PENDING_VALIDATION") {
  assert.strictEqual(d.marker, `${STEM}=PENDING_VALIDATION`);
  assert.strictEqual(d.result, "PENDING_VALIDATION");
  assert.strictEqual(d.final_audit_marker, undefined);
}

if (d.status === `ACTIVE_${STEM}`) {
  assert.strictEqual(d.marker, `${STEM}=PASS`);
  assert.strictEqual(d.result, `PASS_${STEM}`);
  assert.strictEqual(d.final_audit_marker, FINAL_AUDIT_MARKER);
}

assert.strictEqual(d.parent_program, "PROG-382");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-READINESS-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "27ff0831d6b14a6d25e6d6294a6a948dfdcad341");
assert.strictEqual(d.basis_main_commit, "27ff0831d6b14a6d25e6d6294a6a948dfdcad341");
assert.strictEqual(d.parent_manifest_sha256, "f00d1c312267f8f5844f52dbe3c9612384eef57dd6a1842c451571d1782e493a");
assert.strictEqual(d.parent_validator_sha256, "9bdd0c4e3f547293ebc1e91fbd3f6c436c0ee8998313b9b4e5d2f9321db7df88");

assert.strictEqual(d.parent_source_chain_entry_count, 100);
assert.strictEqual(d.source_chain_entry_count, 101);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_383_PRODUCTION_READINESS_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 958);
assert.strictEqual(d.required_non_claim_count, 23320);
assert.strictEqual(d.required_no_execution_boundary_count, 21236);
assert.strictEqual(d.false_claim_property_count, 9718);
assert.strictEqual(d.future_customer_decision_proof_production_readiness_false_key_count, 303);
assert.strictEqual(d.all_customer_decision_proof_production_readiness_false_key_count, 303);

assert(Array.isArray(d.required_production_readiness_fields), "required_production_readiness_fields must be array");
assert(Array.isArray(d.required_non_claim_properties), "required_non_claim_properties must be array");
assert(Array.isArray(d.required_no_execution_boundary_properties), "required_no_execution_boundary_properties must be array");
assert(Array.isArray(d.false_claim_properties), "false_claim_properties must be array");
assert(Array.isArray(d.future_resolution_requirements), "future_resolution_requirements must be array");
assert(Array.isArray(d.future_customer_decision_proof_production_readiness_false_keys), "future_customer_decision_proof_production_readiness_false_keys must be array");

assert.strictEqual(d.required_production_readiness_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, d.required_non_claim_count);
assert.strictEqual(d.required_no_execution_boundary_properties.length, d.required_no_execution_boundary_count);
assert.strictEqual(d.false_claim_properties.length, d.false_claim_property_count);
assert.strictEqual(d.future_resolution_requirements.length, d.future_resolution_requirement_count);
assert.strictEqual(d.future_customer_decision_proof_production_readiness_false_keys.length, d.future_customer_decision_proof_production_readiness_false_key_count);

assert.strictEqual(d.productionReadiness, false);
assert.strictEqual(d.draft_not_execution, true);
assert.strictEqual(d.production_readiness_conformance_only, true);

for (const key of [
  "customer_ready",
  "customer_readiness_ready",
  "customer_readiness_created",
  "customer_readiness_executed",
  "customer_readiness_registered",
  "customer_readiness_signed",
  "customer_readiness_approved",
  "customer_readiness_completed",
  "customer_readiness_final",
  "customer_readiness_legally_effective",
  "customer_readiness_operationally_effective",
  "customer_accepted",
  "customer_acceptance_ready",
  "customer_acceptance_created",
  "customer_acceptance_final",

  "production_ready",
  "production_readiness_ready",
  "production_readiness_created",
  "production_readiness_executed",
  "production_readiness_registered",
  "production_readiness_signed",
  "production_readiness_approved",
  "production_readiness_completed",
  "production_readiness_final",
  "production_readiness_legally_effective",
  "production_readiness_operationally_effective",

  "operational_ready",
  "operational_readiness_ready",
  "operational_readiness_created",
  "operational_readiness_executed",
  "operational_readiness_completed",
  "operational_readiness_final",

  "runtime_ready",
  "runtime_readiness_ready",
  "runtime_readiness_created",
  "runtime_readiness_executed",
  "runtime_readiness_final",

  "deployment_ready",
  "deployment_authorized",
  "deployment_authorization_ready",
  "deployment_authorization_created",
  "deployment_authorization_executed",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",

  "matrix_effective_state_updated",
  "matrix_production_readiness_created",
  "matrix_operational_readiness_created",
  "matrix_runtime_readiness_created",
  "matrix_deployment_authorization_created",

  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_production_readiness_allow",
  "opc_operational_readiness_allow",
  "opc_runtime_readiness_allow",

  "runtime_production_readiness_executed",
  "runtime_operational_readiness_executed",
  "runtime_deployment_executed",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

for (const key of d.future_customer_decision_proof_production_readiness_false_keys) {
  assert.strictEqual(d[key], false, `PRODUCTION_READINESS_FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "PROG-383 must bind Production Readiness Conformance as a successor to PROG-382 Customer Readiness Conformance",
  "Customer Readiness Conformance draft does not imply Production Readiness Conformance",
  "Customer readiness does not imply production readiness",
  "Production Readiness Conformance draft does not imply operational readiness",
  "Production Readiness Conformance draft does not authorize deployment authorization",
  "Production Readiness Conformance draft does not execute deployment",
  "Production Readiness Conformance draft does not imply runtime readiness",
  "Production Readiness Conformance draft does not authorize OPC ALLOW",
  "Production Readiness Conformance draft does not mutate Matrix effective state",
  "Production Readiness Conformance draft does not execute runtime deletion",
  "Production Readiness Conformance draft does not execute runtime destruction",
  "Production Readiness Conformance draft does not execute data destruction",
  "Production Readiness Conformance draft does not execute data erasure",
  "Production Readiness does not imply operational readiness",
  "Production Readiness does not imply deployment authorization",
  "Production Readiness does not imply deployment execution",
  "Production Readiness does not imply runtime readiness",
  "Production Readiness does not imply OPC ALLOW",
  "Production Readiness does not imply Matrix effective state mutation",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "Existing PROG-382 Customer Readiness Conformance is not recreated by PROG-383",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over production readiness claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_PRODUCTION_READINESS_CLAIMS",
  "CUSTOMER_READINESS_CONFORMANCE_DOES_NOT_CREATE_PRODUCTION_READINESS"
]) {
  assert(boundary.includes(fragment), `PRODUCTION_READINESS_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

console.log(JSON.stringify({
  object_id: d.object_id,
  program: d.program,
  status: d.status,
  marker: d.marker,
  result: d.result,
  final_audit_marker: d.final_audit_marker || null,
  parent_program: d.parent_program,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_production_readiness_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  production_readiness_false_key_count: d.future_customer_decision_proof_production_readiness_false_key_count,
  customer_ready: d.customer_ready,
  customer_readiness_ready: d.customer_readiness_ready,
  customer_readiness_created: d.customer_readiness_created,
  customer_readiness_final: d.customer_readiness_final,
  production_ready: d.production_ready,
  production_readiness_ready: d.production_readiness_ready,
  production_readiness_created: d.production_readiness_created,
  production_readiness_final: d.production_readiness_final,
  operational_ready: d.operational_ready,
  runtime_ready: d.runtime_ready,
  deployment_authorized: d.deployment_authorized,
  deployment_executed: d.deployment_executed,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (d.status === `ACTIVE_${STEM}`) {
  console.log(FINAL_AUDIT_MARKER);
}
