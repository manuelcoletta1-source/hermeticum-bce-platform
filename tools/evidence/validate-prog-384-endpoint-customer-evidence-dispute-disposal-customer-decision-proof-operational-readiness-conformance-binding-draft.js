#!/usr/bin/env node
"use strict";

const fs = require("fs");
const assert = require("assert");

const manifestPath =
  process.argv[2] ||
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_OPERATIONAL_READINESS_CONFORMANCE_BINDING_DRAFT_v001.json";

const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-OPERATIONAL-READINESS-CONFORMANCE-BINDING-DRAFT-V001";
const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_OPERATIONAL_READINESS_CONFORMANCE_BINDING_DRAFT";
const FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_OPERATIONAL_READINESS_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-384");
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

assert.strictEqual(d.parent_program, "PROG-383");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-PRODUCTION-READINESS-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "bddff33ef9c7bcbb323fe680024a3c17f718dd38");
assert.strictEqual(d.basis_main_commit, "bddff33ef9c7bcbb323fe680024a3c17f718dd38");
assert.strictEqual(d.parent_manifest_sha256, "e4f04f30301c89fa4d1be8d2c7e580424ded5c032c4cc491037da87339cfbc9a");
assert.strictEqual(d.parent_validator_sha256, "5285308806d72adcd95bce86540c94e5e03a2063c86e50bf6cd7fec9d4b5f150");

assert.strictEqual(d.parent_source_chain_entry_count, 101);
assert.strictEqual(d.source_chain_entry_count, 102);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_384_OPERATIONAL_READINESS_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_operational_readiness_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.operational_readiness_boundary_rule_count, 29);
assert.strictEqual(d.future_resolution_requirement_count, 987);
assert.strictEqual(d.required_non_claim_count, 24276);
assert.strictEqual(d.required_no_execution_boundary_count, 21574);
assert.strictEqual(d.false_claim_property_count, 10027);
assert.strictEqual(d.future_customer_decision_proof_operational_readiness_false_key_count, 309);
assert.strictEqual(d.all_customer_decision_proof_operational_readiness_false_key_count, 309);

assert(Array.isArray(d.required_operational_readiness_fields), "required_operational_readiness_fields must be array");
assert(Array.isArray(d.required_non_claim_properties), "required_non_claim_properties must be array");
assert(Array.isArray(d.required_no_execution_boundary_properties), "required_no_execution_boundary_properties must be array");
assert(Array.isArray(d.false_claim_properties), "false_claim_properties must be array");
assert(Array.isArray(d.future_resolution_requirements), "future_resolution_requirements must be array");
assert(Array.isArray(d.future_customer_decision_proof_operational_readiness_false_keys), "future_customer_decision_proof_operational_readiness_false_keys must be array");
assert(Array.isArray(d.operational_readiness_boundary_rules), "operational_readiness_boundary_rules must be array");

assert.strictEqual(d.required_operational_readiness_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, d.required_non_claim_count);
assert.strictEqual(d.required_no_execution_boundary_properties.length, d.required_no_execution_boundary_count);
assert.strictEqual(d.false_claim_properties.length, d.false_claim_property_count);
assert.strictEqual(d.future_resolution_requirements.length, d.future_resolution_requirement_count);
assert.strictEqual(d.future_customer_decision_proof_operational_readiness_false_keys.length, d.future_customer_decision_proof_operational_readiness_false_key_count);
assert.strictEqual(d.operational_readiness_boundary_rules.length, d.operational_readiness_boundary_rule_count);

assert.strictEqual(d.operationalReadiness, false);
assert.strictEqual(d.operational_readiness_conformance_only, true);
assert.strictEqual(d.draft_not_execution, true);

for (const key of [
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
  "operational_readiness_registered",
  "operational_readiness_signed",
  "operational_readiness_approved",
  "operational_readiness_completed",
  "operational_readiness_final",
  "operational_readiness_legally_effective",
  "operational_readiness_operationally_effective",

  "runtime_ready",
  "runtime_readiness_ready",
  "runtime_readiness_created",
  "runtime_readiness_executed",
  "runtime_readiness_completed",
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
  "matrix_operational_readiness_created",
  "matrix_runtime_readiness_created",
  "matrix_deployment_authorization_created",

  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_operational_readiness_allow",
  "opc_runtime_readiness_allow",

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

for (const key of d.future_customer_decision_proof_operational_readiness_false_keys) {
  assert.strictEqual(d[key], false, `OPERATIONAL_READINESS_FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_operational_readiness_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.operational_readiness_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "PROG-384 must bind Operational Readiness Conformance as a successor to PROG-383 Production Readiness Conformance",
  "Production Readiness Conformance draft does not imply Operational Readiness Conformance",
  "Production readiness does not imply operational readiness",
  "Operational Readiness Conformance draft does not imply runtime readiness",
  "Operational Readiness Conformance draft does not authorize deployment authorization",
  "Operational Readiness Conformance draft does not execute deployment",
  "Operational Readiness Conformance draft does not authorize OPC ALLOW",
  "Operational Readiness Conformance draft does not mutate Matrix effective state",
  "Operational Readiness Conformance draft does not execute runtime deletion",
  "Operational Readiness Conformance draft does not execute runtime destruction",
  "Operational Readiness Conformance draft does not execute data destruction",
  "Operational Readiness Conformance draft does not execute data erasure",
  "Operational Readiness does not imply runtime readiness",
  "Operational Readiness does not imply deployment authorization",
  "Operational Readiness does not imply deployment execution",
  "Operational Readiness does not imply OPC ALLOW",
  "Operational Readiness does not imply Matrix effective state mutation",
  "Operational Readiness does not imply runtime deletion or runtime destruction",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "Existing PROG-383 Production Readiness Conformance is not recreated by PROG-384",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over operational readiness claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_OPERATIONAL_READINESS_CLAIMS",
  "PRODUCTION_READINESS_CONFORMANCE_DOES_NOT_CREATE_OPERATIONAL_READINESS",
  "OPERATIONAL_READINESS_CONFORMANCE_DOES_NOT_CREATE_RUNTIME_READINESS"
]) {
  assert(boundary.includes(fragment), `OPERATIONAL_READINESS_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_operational_readiness_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  operational_readiness_false_key_count: d.future_customer_decision_proof_operational_readiness_false_key_count,
  production_ready: d.production_ready,
  production_readiness_ready: d.production_readiness_ready,
  production_readiness_created: d.production_readiness_created,
  production_readiness_final: d.production_readiness_final,
  operational_ready: d.operational_ready,
  operational_readiness_ready: d.operational_readiness_ready,
  operational_readiness_created: d.operational_readiness_created,
  operational_readiness_final: d.operational_readiness_final,
  runtime_ready: d.runtime_ready,
  deployment_authorized: d.deployment_authorized,
  deployment_executed: d.deployment_executed,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (d.status === `ACTIVE_${STEM}`) {
  console.log(FINAL_AUDIT_MARKER);
}
