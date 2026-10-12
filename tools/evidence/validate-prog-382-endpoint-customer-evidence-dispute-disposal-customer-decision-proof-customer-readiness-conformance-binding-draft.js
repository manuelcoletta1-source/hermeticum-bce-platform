#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");

const repoRoot = path.resolve(__dirname, "../..");

const manifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentManifestPath = path.join(
  repoRoot,
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const parentValidatorPath = path.join(
  repoRoot,
  "tools/evidence/validate-prog-381-endpoint-customer-evidence-dispute-disposal-customer-decision-proof-customer-acceptance-conformance-binding-draft.js"
);

const sha256 = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const d = readJson(manifestPath);
const p = readJson(parentManifestPath);

assert.strictEqual(sha256(parentManifestPath), "b4bc95b7fbd3c43e07b8e8bd6b306ee1d39952ff3c4b187a3e92e85836905c43");
assert.strictEqual(sha256(parentValidatorPath), "d9eee9af8706ddcb824a661add61f51893beeca7ff62506fe74c7c25d3b1b3e6");

assert.strictEqual(p.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(p.program, "PROG-381");
assert.strictEqual(
  p.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(p.source_chain_entry_count, 99);
assert.strictEqual(p.required_non_claim_count, 21558);
assert.strictEqual(p.required_no_execution_boundary_count, 20613);
assert.strictEqual(p.false_claim_property_count, 9568);
assert.strictEqual(p.future_resolution_requirement_count, 900);
assert.strictEqual(p.future_customer_decision_proof_customer_acceptance_false_key_count, 228);
assert.strictEqual(p.customer_ready, false);
assert.strictEqual(p.customer_readiness_ready, false);
assert.strictEqual(p.customer_readiness_created, false);
assert.strictEqual(p.customer_readiness_final, false);
assert.strictEqual(p.customer_accepted, false);
assert.strictEqual(p.customer_acceptance_ready, false);
assert.strictEqual(p.customer_acceptance_created, false);
assert.strictEqual(p.customer_acceptance_final, false);
assert.strictEqual(p.production_ready, false);
assert.strictEqual(p.operational_ready, false);
assert.strictEqual(p.runtime_ready, false);
assert.strictEqual(p.deployment_authorized, false);
assert.strictEqual(p.deployment_executed, false);
assert.strictEqual(p.opc_allow, false);
assert.strictEqual(p.matrix_effective_state_updated, false);

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-382");
assert.strictEqual(
  d.object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-CUSTOMER-READINESS-CONFORMANCE-BINDING-DRAFT-V001"
);

const allowedStatuses = new Set([
  "DRAFT_PENDING_VALIDATION",
  "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT"
]);

const allowedMarkers = new Set([
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION",
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT=PASS"
]);

const allowedResults = new Set([
  "PENDING_VALIDATION",
  "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT"
]);

assert(allowedStatuses.has(d.status), `INVALID_STATUS: ${d.status}`);
assert(allowedMarkers.has(d.marker), `INVALID_MARKER: ${d.marker}`);
assert(allowedResults.has(d.result), `INVALID_RESULT: ${d.result}`);

if (d.status === "DRAFT_PENDING_VALIDATION") {
  assert.strictEqual(
    d.marker,
    "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT=PENDING_VALIDATION"
  );
  assert.strictEqual(d.result, "PENDING_VALIDATION");
}

if (d.status === "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT") {
  assert.strictEqual(
    d.marker,
    "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT=PASS"
  );
  assert.strictEqual(
    d.result,
    "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT"
  );
  assert.strictEqual(
    d.final_audit_marker,
    "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_CUSTOMER_READINESS_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1"
  );
}

assert.strictEqual(d.parent_program, "PROG-381");
assert.strictEqual(d.parent_object_id, p.object_id);
assert.strictEqual(d.parent_commit, "bfc74703f1634fa7ab7f54d98a20084d182bc8e5");
assert.strictEqual(d.basis_main_commit, "bfc74703f1634fa7ab7f54d98a20084d182bc8e5");
assert.strictEqual(d.parent_manifest_sha256, "b4bc95b7fbd3c43e07b8e8bd6b306ee1d39952ff3c4b187a3e92e85836905c43");
assert.strictEqual(d.parent_validator_sha256, "d9eee9af8706ddcb824a661add61f51893beeca7ff62506fe74c7c25d3b1b3e6");

assert.strictEqual(d.parent_source_chain_entry_count, 99);
assert.strictEqual(d.source_chain_entry_count, 100);
assert.strictEqual(d.source_chain_model, "COUNT_ONLY_PARENT_CHAIN_REFERENCE_PLUS_PROG_382_CUSTOMER_READINESS_ENTRY");
assert.strictEqual(d.source_chain_storage, "COUNT_ONLY_NO_EMBEDDED_PARENT_SOURCE_CHAIN_ARRAY");
assert.strictEqual(Array.isArray(d.source_chain), false);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.future_resolution_requirement_count, 929);
assert.strictEqual(d.required_non_claim_count, 22382);
assert.strictEqual(d.required_no_execution_boundary_count, 20790);
assert.strictEqual(d.false_claim_property_count, 9642);
assert.strictEqual(d.future_customer_decision_proof_customer_readiness_false_key_count, 265);
assert.strictEqual(d.all_customer_decision_proof_customer_readiness_false_key_count, 265);

assert.strictEqual(Array.isArray(d.required_customer_readiness_fields), true);
assert.strictEqual(Array.isArray(d.required_non_claim_properties), true);
assert.strictEqual(Array.isArray(d.required_no_execution_boundary_properties), true);
assert.strictEqual(Array.isArray(d.false_claim_properties), true);
assert.strictEqual(Array.isArray(d.future_resolution_requirements), true);
assert.strictEqual(Array.isArray(d.future_customer_decision_proof_customer_readiness_false_keys), true);

assert.strictEqual(d.required_customer_readiness_fields.length, 24);
assert.strictEqual(d.required_non_claim_properties.length, 22382);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 20790);
assert.strictEqual(d.false_claim_properties.length, 9642);
assert.strictEqual(d.future_resolution_requirements.length, 929);
assert.strictEqual(d.future_customer_decision_proof_customer_readiness_false_keys.length, 265);

for (const key of [
  "legal_certification_ready",
  "legal_certification_created",
  "legal_certification_final",
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
  "customer_decision_proof_customer_ready",
  "customer_decision_proof_customer_readiness_ready",
  "customer_decision_proof_customer_readiness_created",
  "customer_decision_proof_customer_readiness_executed",
  "customer_decision_proof_customer_readiness_completed",
  "customer_decision_proof_customer_readiness_final",
  "production_ready",
  "production_readiness_ready",
  "production_readiness_created",
  "production_readiness_executed",
  "production_readiness_final",
  "operational_ready",
  "operational_readiness_ready",
  "operational_readiness_created",
  "operational_readiness_executed",
  "operational_readiness_final",
  "runtime_ready",
  "runtime_readiness_ready",
  "runtime_readiness_created",
  "runtime_readiness_executed",
  "runtime_readiness_final",
  "deployment_ready",
  "deployment_authorized",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",
  "matrix_effective_state_updated",
  "matrix_customer_readiness_created",
  "matrix_production_readiness_created",
  "matrix_operational_readiness_created",
  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_customer_readiness_allow",
  "opc_production_readiness_allow",
  "opc_operational_readiness_allow",
  "runtime_customer_readiness_executed",
  "runtime_production_readiness_executed",
  "runtime_operational_readiness_executed",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

for (const key of d.future_customer_decision_proof_customer_readiness_false_keys) {
  assert.strictEqual(d[key], false, `CUSTOMER_READINESS_FALSE_KEY_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule
].filter(Boolean).join("\n");

for (const fragment of [
  "Customer Acceptance Conformance draft does not imply Customer Readiness Conformance",
  "Customer acceptance does not imply customer readiness",
  "Customer Readiness Conformance draft does not imply production readiness",
  "Customer Readiness Conformance draft does not imply operational readiness",
  "Customer Readiness Conformance draft does not authorize OPC ALLOW",
  "Customer Readiness Conformance draft does not mutate Matrix effective state",
  "Customer Readiness Conformance draft does not execute deployment",
  "Customer Readiness Conformance draft does not execute runtime deletion",
  "Customer Readiness Conformance draft does not execute runtime destruction",
  "Customer Readiness Conformance draft does not execute data destruction",
  "Customer Readiness Conformance draft does not execute data erasure",
  "Customer Readiness does not imply production readiness",
  "Customer Readiness does not imply operational readiness",
  "Customer Readiness does not imply deployment authorization",
  "Customer Readiness does not imply deployment execution",
  "Customer Readiness does not imply runtime readiness",
  "Customer Readiness does not imply OPC ALLOW",
  "Customer Readiness does not imply Matrix effective state mutation",
  "Existing PROG-381 Customer Acceptance Conformance is not recreated by PROG-382",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over customer readiness claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_CUSTOMER_READINESS_CLAIMS",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DOES_NOT_CREATE_CUSTOMER_READINESS"
]) {
  assert(boundary.includes(fragment), `CUSTOMER_READINESS_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_customer_readiness_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  customer_readiness_false_key_count: d.future_customer_decision_proof_customer_readiness_false_key_count,
  customer_ready: d.customer_ready,
  customer_readiness_ready: d.customer_readiness_ready,
  customer_readiness_created: d.customer_readiness_created,
  customer_readiness_final: d.customer_readiness_final,
  customer_accepted: d.customer_accepted,
  customer_acceptance_ready: d.customer_acceptance_ready,
  customer_acceptance_final: d.customer_acceptance_final,
  production_ready: d.production_ready,
  operational_ready: d.operational_ready,
  runtime_ready: d.runtime_ready,
  deployment_authorized: d.deployment_authorized,
  deployment_executed: d.deployment_executed,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated
}, null, 2));

if (d.final_audit_marker) {
  console.log(d.final_audit_marker);
}
