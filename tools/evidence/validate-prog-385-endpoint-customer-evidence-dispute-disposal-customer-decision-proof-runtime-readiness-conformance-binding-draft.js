#!/usr/bin/env node
const fs = require("fs");
const assert = require("assert");
const crypto = require("crypto");
const path = require("path");

const MANIFEST =
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RUNTIME_READINESS_CONFORMANCE_BINDING_DRAFT_v001.json";

const EXPECTED_SHA256 =
  "f47bb3edebd435781029716ae3b6c8f94415751e8deccbf9256dbdfad84ee9d7";

const STEM =
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RUNTIME_READINESS_CONFORMANCE_BINDING_DRAFT";

const OBJECT_ID =
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-RUNTIME-READINESS-CONFORMANCE-BINDING-DRAFT-V001";

const EXPECTED_PARENT_MANIFEST_SHA =
  "c43f40d990d5b6ce310e59576bcd628e31191d82649d40c0dd24cb81bca2da9f";

const EXPECTED_PARENT_VALIDATOR_SHA =
  "7a4e2f15b9bec7237aed35ec60f6c30a7b0045a08c20ada7f7dfd7c70c638e84";

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function assertFalse(d, key) {
  assert.strictEqual(d[key], false, `EXPECTED_FALSE: ${key}`);
}

function assertIncludes(text, fragment) {
  assert(text.includes(fragment), `BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

const manifestPath = path.resolve(process.cwd(), MANIFEST);
const manifestSha = sha256File(manifestPath);
const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

assert.strictEqual(manifestSha, EXPECTED_SHA256);
assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-385");
assert.strictEqual(d.object_id, OBJECT_ID);
assert.strictEqual(d.status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RUNTIME_READINESS_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.marker, `${STEM}=PASS`);
assert.strictEqual(d.result, `PASS_${STEM}`);
assert.strictEqual(d.final_audit_marker, "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_RUNTIME_READINESS_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1");

assert.strictEqual(d.parent_program, "PROG-384");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-OPERATIONAL-READINESS-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(d.parent_commit, "7b5a8868c9e9cfbb168d1be5d8b21c57440d4a03");
assert.strictEqual(d.basis_main_commit, "7b5a8868c9e9cfbb168d1be5d8b21c57440d4a03");
assert.strictEqual(d.parent_manifest_sha256, EXPECTED_PARENT_MANIFEST_SHA);
assert.strictEqual(d.parent_validator_sha256, EXPECTED_PARENT_VALIDATOR_SHA);

assert.strictEqual(d.parent_source_chain_entry_count, 102);
assert.strictEqual(d.source_chain_entry_count, 103);
assert.strictEqual(
  d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_runtime_readiness_conformance_field_count,
  152
);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.runtime_readiness_boundary_rule_count, 29);
assert.strictEqual(d.future_resolution_requirement_count, 1016);
assert.strictEqual(d.required_non_claim_count, 25286);
assert.strictEqual(d.required_no_execution_boundary_count, 21930);
assert.strictEqual(d.false_claim_property_count, 10354);
assert.strictEqual(d.future_customer_decision_proof_runtime_readiness_false_key_count, 327);
assert.strictEqual(d.all_customer_decision_proof_runtime_readiness_false_key_count, 327);

assert.strictEqual(d.required_runtime_readiness_fields.length, 24);
assert.strictEqual(d.runtime_readiness_boundary_rules.length, 29);
assert.strictEqual(d.future_resolution_requirements.length, d.future_resolution_requirement_count);
assert.strictEqual(d.required_non_claim_properties.length, d.required_non_claim_count);
assert.strictEqual(d.required_no_execution_boundary_properties.length, d.required_no_execution_boundary_count);
assert.strictEqual(d.false_claim_properties.length, d.false_claim_property_count);
assert.strictEqual(
  d.future_customer_decision_proof_runtime_readiness_false_keys.length,
  d.future_customer_decision_proof_runtime_readiness_false_key_count
);

assert.strictEqual(d.runtimeReadiness, false);
assert.strictEqual(d.runtime_readiness_conformance_only, true);
assert.strictEqual(d.draft_not_execution, true);

for (const key of d.future_customer_decision_proof_runtime_readiness_false_keys) {
  assertFalse(d, key);
}

for (const key of [
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
  "runtime_readiness_registered",
  "runtime_readiness_signed",
  "runtime_readiness_approved",
  "runtime_readiness_completed",
  "runtime_readiness_final",
  "runtime_readiness_legally_effective",
  "runtime_readiness_operationally_effective",

  "runtime_readiness_conformance_ready",
  "runtime_readiness_conformance_created",
  "runtime_readiness_conformance_executed",
  "runtime_readiness_conformance_registered",
  "runtime_readiness_conformance_signed",
  "runtime_readiness_conformance_approved",
  "runtime_readiness_conformance_completed",
  "runtime_readiness_conformance_final",
  "runtime_readiness_conformance_legally_effective",
  "runtime_readiness_conformance_operationally_effective",

  "deployment_ready",
  "deployment_authorized",
  "deployment_authorization_ready",
  "deployment_authorization_created",
  "deployment_authorization_executed",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",

  "deployment_authorization_conformance_ready",
  "deployment_authorization_conformance_created",
  "deployment_authorization_conformance_executed",
  "deployment_authorization_conformance_final",
  "deployment_execution_conformance_ready",
  "deployment_execution_conformance_created",
  "deployment_execution_conformance_executed",
  "deployment_execution_conformance_final",

  "matrix_effective_state_updated",
  "matrix_runtime_readiness_created",
  "matrix_deployment_authorization_created",

  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
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
  assertFalse(d, key);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_runtime_readiness_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.runtime_readiness_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "PROG-385 is a Runtime Readiness Conformance Binding Draft only",
  "Operational Readiness Conformance does not imply Runtime Readiness Conformance",
  "Operational Readiness Conformance draft does not imply Runtime Readiness Conformance",
  "Operational readiness does not imply runtime readiness",
  "Runtime Readiness Conformance does not imply deployment authorization",
  "Runtime Readiness Conformance does not imply deployment execution",
  "Runtime Readiness Conformance does not imply OPC ALLOW",
  "Runtime Readiness Conformance does not imply Matrix effective state mutation",
  "Runtime Readiness Conformance does not imply runtime deletion",
  "Runtime Readiness Conformance does not imply runtime destruction",
  "Runtime Readiness Conformance does not imply data destruction",
  "Runtime Readiness Conformance does not imply data erasure",
  "Runtime Readiness Conformance draft does not authorize deployment authorization",
  "Runtime Readiness Conformance draft does not execute deployment",
  "Runtime Readiness Conformance draft does not authorize OPC ALLOW",
  "Runtime Readiness Conformance draft does not mutate Matrix effective state",
  "Runtime Readiness Conformance draft does not execute runtime deletion",
  "Runtime Readiness Conformance draft does not execute runtime destruction",
  "Runtime Readiness Conformance draft does not execute data destruction",
  "Runtime Readiness Conformance draft does not execute data erasure",
  "Runtime Readiness does not imply deployment authorization",
  "Runtime Readiness does not imply deployment execution",
  "Runtime Readiness does not imply OPC ALLOW",
  "Runtime Readiness does not imply Matrix effective state mutation",
  "Runtime Readiness does not imply runtime deletion or runtime destruction",
  "Runtime Readiness does not imply data destruction or data erasure",
  "Existing PROG-384 Operational Readiness Conformance is not recreated by PROG-385",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN prevails over runtime readiness claims",
  "UNKNOWN or INSUFFICIENT_EVIDENCE prevails over runtime readiness claims",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_RUNTIME_READINESS_CLAIMS",
  "OPERATIONAL_READINESS_CONFORMANCE_DOES_NOT_CREATE_RUNTIME_READINESS",
  "RUNTIME_READINESS_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_AUTHORIZATION",
  "RUNTIME_READINESS_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_EXECUTION"
]) {
  assertIncludes(boundary, fragment);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_runtime_readiness_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  runtime_readiness_boundary_rule_count: d.runtime_readiness_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  runtime_readiness_false_key_count: d.future_customer_decision_proof_runtime_readiness_false_key_count,
  operational_ready: d.operational_ready,
  operational_readiness_ready: d.operational_readiness_ready,
  operational_readiness_created: d.operational_readiness_created,
  operational_readiness_final: d.operational_readiness_final,
  runtime_ready: d.runtime_ready,
  runtime_readiness_ready: d.runtime_readiness_ready,
  runtime_readiness_created: d.runtime_readiness_created,
  runtime_readiness_final: d.runtime_readiness_final,
  deployment_authorized: d.deployment_authorized,
  deployment_executed: d.deployment_executed,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  result_assertion: "PASS_PROG_385_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_385_RUNTIME_READINESS_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
