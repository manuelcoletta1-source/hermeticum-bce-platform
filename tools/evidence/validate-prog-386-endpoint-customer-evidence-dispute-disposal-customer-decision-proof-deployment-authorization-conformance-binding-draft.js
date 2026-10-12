#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(
  ROOT,
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_AUTHORIZATION_CONFORMANCE_BINDING_DRAFT_v001.json"
);

const EXPECTED_SHA256 = "ad7cb6cae277a46537d9abccd6c57061788e1d622c4df07e52eac66020534e94";
const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_AUTHORIZATION_CONFORMANCE_BINDING_DRAFT";
const OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-AUTHORIZATION-CONFORMANCE-BINDING-DRAFT-V001";

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

const manifestSha = sha256File(MANIFEST_PATH);
assert.strictEqual(manifestSha, EXPECTED_SHA256);

const d = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-386");
assert.strictEqual(d.object_id, OBJECT_ID);
assert.strictEqual(d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_AUTHORIZATION_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.marker, `${STEM}=PASS`);
assert.strictEqual(d.result, `PASS_${STEM}`);
assert.strictEqual(d.final_audit_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_AUTHORIZATION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");

assert.strictEqual(d.parent_program, "PROG-385");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-RUNTIME-READINESS-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "7b726811ce206f8e9b572bbd3dcc8d3881f7625f");
assert.strictEqual(d.basis_main_commit, "7b726811ce206f8e9b572bbd3dcc8d3881f7625f");
assert.strictEqual(d.parent_manifest_sha256, "f47bb3edebd435781029716ae3b6c8f94415751e8deccbf9256dbdfad84ee9d7");
assert.strictEqual(d.parent_validator_sha256, "afaa48352a7a14415c174e03e485608a26e76de51f4ad2b4a295a4c87b4b3f2f");

assert.strictEqual(d.parent_source_chain_entry_count, 103);
assert.strictEqual(d.source_chain_entry_count, 104);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_authorization_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.deployment_authorization_boundary_rule_count, 29);
assert.strictEqual(d.future_resolution_requirement_count, 1045);
assert.strictEqual(d.required_non_claim_count, 26350);
assert.strictEqual(d.required_no_execution_boundary_count, 22304);
assert.strictEqual(d.false_claim_property_count, 10699);
assert.strictEqual(d.future_customer_decision_proof_deployment_authorization_false_key_count, 345);
assert.strictEqual(d.all_customer_decision_proof_deployment_authorization_false_key_count, 345);

assert.strictEqual(d.required_deployment_authorization_fields.length, 24);
assert.strictEqual(d.deployment_authorization_boundary_rules.length, 29);
assert.strictEqual(d.future_resolution_requirements.length, d.future_resolution_requirement_count);
assert.strictEqual(d.required_non_claim_properties.length, d.required_non_claim_count);
assert.strictEqual(d.required_no_execution_boundary_properties.length, d.required_no_execution_boundary_count);
assert.strictEqual(d.false_claim_properties.length, d.false_claim_property_count);
assert.strictEqual(
  d.future_customer_decision_proof_deployment_authorization_false_keys.length,
  d.future_customer_decision_proof_deployment_authorization_false_key_count
);

assert.strictEqual(d.deploymentAuthorization, false);
assert.strictEqual(d.deployment_authorization_conformance_only, true);
assert.strictEqual(d.draft_not_execution, true);

for (const key of d.future_customer_decision_proof_deployment_authorization_false_keys) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_AUTHORIZATION_FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of [
  "runtime_ready",
  "runtime_readiness_ready",
  "runtime_readiness_created",
  "runtime_readiness_final",

  "deployment_authorized",
  "deployment_authorization_ready",
  "deployment_authorization_created",
  "deployment_authorization_executed",
  "deployment_authorization_registered",
  "deployment_authorization_signed",
  "deployment_authorization_approved",
  "deployment_authorization_completed",
  "deployment_authorization_final",
  "deployment_authorization_legally_effective",
  "deployment_authorization_operationally_effective",

  "deployment_ready",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",

  "deployment_execution_ready",
  "deployment_execution_created",
  "deployment_execution_executed",
  "deployment_execution_completed",
  "deployment_execution_final",

  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_runtime_readiness_allow",
  "opc_deployment_authorization_allow",

  "matrix_effective_state_updated",
  "matrix_deployment_authorization_created",
  "matrix_deployment_execution_created",

  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_destruction_execution",
  "data_erasure_executed",
  "data_erasure_execution"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_authorization_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.deployment_authorization_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Runtime Readiness Conformance does not imply Deployment Authorization Conformance",
  "Runtime readiness does not imply deployment authorization",
  "Deployment Authorization Conformance does not imply deployment execution",
  "Deployment Authorization Conformance does not imply OPC ALLOW",
  "Deployment Authorization Conformance does not imply Matrix effective state mutation",
  "Deployment Authorization Conformance does not imply runtime deletion",
  "Deployment Authorization Conformance does not imply runtime destruction",
  "Deployment Authorization Conformance does not imply data destruction",
  "Deployment Authorization Conformance does not imply data erasure",
  "Deployment Authorization Conformance draft does not execute deployment",
  "Deployment Authorization Conformance draft does not authorize OPC ALLOW",
  "Deployment Authorization Conformance draft does not mutate Matrix effective state",
  "Deployment Authorization Conformance draft does not execute runtime deletion",
  "Deployment Authorization Conformance draft does not execute runtime destruction",
  "Deployment Authorization Conformance draft does not execute data destruction",
  "Deployment Authorization Conformance draft does not execute data erasure",
  "Deployment Authorization does not imply deployment execution",
  "Deployment Authorization does not imply OPC ALLOW",
  "Deployment Authorization does not imply Matrix effective state mutation",
  "Existing PROG-385 Runtime Readiness Conformance is not recreated by PROG-386",
  "UNKNOWN or INSUFFICIENT_EVIDENCE prevails over deployment authorization claims",
  "RUNTIME_READINESS_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_AUTHORIZATION",
  "DEPLOYMENT_AUTHORIZATION_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_EXECUTION",
  "DEPLOYMENT_AUTHORIZATION_CONFORMANCE_DOES_NOT_CREATE_OPC_ALLOW",
  "DEPLOYMENT_AUTHORIZATION_CONFORMANCE_DOES_NOT_CREATE_MATRIX_EFFECTIVE_STATE_MUTATION",
  "DEPLOYMENT_AUTHORIZATION_CONFORMANCE_DOES_NOT_CREATE_RUNTIME_OR_DATA_DESTRUCTION"
]) {
  assert(boundary.includes(fragment), `DEPLOYMENT_AUTHORIZATION_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_authorization_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  deployment_authorization_boundary_rule_count: d.deployment_authorization_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_authorization_false_key_count: d.future_customer_decision_proof_deployment_authorization_false_key_count,
  runtime_ready: d.runtime_ready,
  deployment_authorized: d.deployment_authorized,
  deployment_authorization_ready: d.deployment_authorization_ready,
  deployment_authorization_created: d.deployment_authorization_created,
  deployment_authorization_final: d.deployment_authorization_final,
  deployment_executed: d.deployment_executed,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_erasure_executed: d.data_erasure_executed,
  result_assertion: "PASS_PROG_386_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_386_DEPLOYMENT_AUTHORIZATION_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
