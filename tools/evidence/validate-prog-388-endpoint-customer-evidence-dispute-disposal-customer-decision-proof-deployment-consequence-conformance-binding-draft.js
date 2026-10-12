#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");

const MANIFEST_PATH = path.resolve(__dirname, "../../evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_CONSEQUENCE_CONFORMANCE_BINDING_DRAFT_v001.json");

const EXPECTED_MANIFEST_SHA256 = "7857c71a2a7e7aa227540bdabf4811f2b680bae7cd3a5c8175e2e7dde306078f";
const EXPECTED_OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-CONSEQUENCE-CONFORMANCE-BINDING-DRAFT-V001";
const EXPECTED_STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_CONSEQUENCE_CONFORMANCE_BINDING_DRAFT";

const EXPECTED_STATUS = `ACTIVE_${EXPECTED_STEM}`;
const EXPECTED_MARKER = `${EXPECTED_STEM}=PASS`;
const EXPECTED_RESULT = `PASS_${EXPECTED_STEM}`;
const EXPECTED_RESULT_ASSERTION = "PASS_PROG_388_STEP_4_PROMOTE_TO_PASS";
const EXPECTED_FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_CONSEQUENCE_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

const EXPECTED_PARENT_PROGRAM = "PROG-387";
const EXPECTED_PARENT_OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-EXECUTION-CONFORMANCE-BINDING-DRAFT-V001";
const EXPECTED_PARENT_COMMIT = "a246945e4e686fbe381574b983c4c9c65a3bb586";
const EXPECTED_PARENT_MANIFEST_SHA256 = "fd940e81fff7f78f97d308e31632e373e8d9e0afd464ee1d30161e71764fc9ac";
const EXPECTED_PARENT_VALIDATOR_SHA256 = "03957cdb865ab9831e63546ac6b34521d10966722d449a1e52442e45a8bcd4ab";

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

const manifestSha = sha256File(MANIFEST_PATH);
assert.strictEqual(manifestSha, EXPECTED_MANIFEST_SHA256, "MANIFEST_SHA256_MISMATCH");

const d = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-388");
assert.strictEqual(d.object_id, EXPECTED_OBJECT_ID);
assert.strictEqual(d.status, EXPECTED_STATUS);
assert.strictEqual(d.marker, EXPECTED_MARKER);
assert.strictEqual(d.result, EXPECTED_RESULT);
assert.strictEqual(d.result_assertion, EXPECTED_RESULT_ASSERTION);
assert.strictEqual(d.final_audit_marker, EXPECTED_FINAL_AUDIT_MARKER);

assert.strictEqual(d.parent_program, EXPECTED_PARENT_PROGRAM);
assert.strictEqual(d.parent_object_id, EXPECTED_PARENT_OBJECT_ID);
assert.strictEqual(d.parent_commit, EXPECTED_PARENT_COMMIT);
assert.strictEqual(d.basis_main_commit, EXPECTED_PARENT_COMMIT);
assert.strictEqual(d.parent_manifest_sha256, EXPECTED_PARENT_MANIFEST_SHA256);
assert.strictEqual(d.parent_validator_sha256, EXPECTED_PARENT_VALIDATOR_SHA256);

assert.strictEqual(d.parent_source_chain_entry_count, 105);
assert.strictEqual(d.source_chain_entry_count, 106);
assert.strictEqual(d.source_chain_entries.length, 106);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_consequence_conformance_field_count, 152);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_consequence_conformance_fields.length, 152);

assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.binding_rules.length, 152);

assert.strictEqual(d.deployment_consequence_boundary_rule_count, 31);
assert.strictEqual(d.deployment_consequence_boundary_rules.length, 31);

assert.strictEqual(d.required_deployment_consequence_fields.length, 24);

assert.strictEqual(d.future_resolution_requirement_count, 1105);
assert.strictEqual(d.future_resolution_requirements.length, 1105);

assert.strictEqual(d.required_non_claim_count, 28586);
assert.strictEqual(d.required_non_claim_properties.length, 28586);

assert.strictEqual(d.required_no_execution_boundary_count, 23088);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 23088);

assert.strictEqual(d.false_claim_property_count, 11425);
assert.strictEqual(d.false_claim_properties.length, 11425);

assert.strictEqual(d.future_customer_decision_proof_deployment_consequence_false_key_count, 381);
assert.strictEqual(d.all_customer_decision_proof_deployment_consequence_false_key_count, 381);
assert.strictEqual(d.future_customer_decision_proof_deployment_consequence_false_keys.length, 381);

for (const key of d.future_customer_decision_proof_deployment_consequence_false_keys) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_CONSEQUENCE_FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of [
  "deployment_authorized",
  "deployment_authorization_ready",
  "deployment_authorization_created",
  "deployment_authorization_executed",
  "deployment_authorization_final",
  "deployment_ready",
  "deployment_executed",
  "deployment_completed",
  "deployment_success",
  "deployment_execution_ready",
  "deployment_execution_created",
  "deployment_execution_executed",
  "deployment_execution_completed",
  "deployment_execution_final",
  "deployment_execution_consequence_created",
  "deployment_execution_consequence_registered",
  "deployment_execution_consequence_effective",
  "deployment_consequence_ready",
  "deployment_consequence_created",
  "deployment_consequence_registered",
  "deployment_consequence_effective",
  "deployment_consequence_final",
  "deployment_consequence_outcome_created",
  "deployment_consequence_outcome_registered",
  "deployment_consequence_outcome_effective",
  "deployment_consequence_matrix_state_updated",
  "deployment_consequence_opc_allow",
  "deployment_consequence_runtime_deletion_executed",
  "deployment_consequence_runtime_destruction_executed",
  "deployment_consequence_data_destruction_executed",
  "deployment_consequence_data_erasure_executed",
  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_runtime_readiness_allow",
  "opc_deployment_authorization_allow",
  "opc_deployment_execution_allow",
  "opc_deployment_consequence_allow",
  "matrix_effective_state_updated",
  "matrix_deployment_authorization_created",
  "matrix_deployment_execution_created",
  "matrix_deployment_consequence_created",
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
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_consequence_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.deployment_consequence_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Deployment Execution Conformance draft does not imply Deployment Consequence Conformance",
  "Deployment execution does not imply deployment consequence",
  "Deployment consequence does not imply deployment outcome",
  "Deployment Consequence Conformance draft does not create deployment consequence",
  "Deployment Consequence Conformance draft does not execute deployment",
  "Deployment Consequence Conformance draft does not authorize OPC ALLOW",
  "Deployment Consequence Conformance draft does not mutate Matrix effective state",
  "Deployment Consequence Conformance draft does not execute runtime deletion",
  "Deployment Consequence Conformance draft does not execute runtime destruction",
  "Deployment Consequence Conformance draft does not execute data destruction",
  "Deployment Consequence Conformance draft does not execute data erasure",
  "Deployment Consequence Conformance does not imply OPC ALLOW",
  "Deployment Consequence Conformance does not imply Matrix effective state mutation",
  "Deployment Consequence Conformance does not imply runtime deletion or runtime destruction",
  "Deployment Consequence Conformance does not imply data destruction or data erasure",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "CONSEQUENCE != OUTCOME",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_CONSEQUENCE_CLAIMS",
  "DEPLOYMENT_EXECUTION_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_CONSEQUENCE",
  "DEPLOYMENT_CONSEQUENCE_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_OUTCOME",
  "DEPLOYMENT_CONSEQUENCE_CONFORMANCE_DOES_NOT_CREATE_OPC_ALLOW",
  "DEPLOYMENT_CONSEQUENCE_CONFORMANCE_DOES_NOT_CREATE_MATRIX_EFFECTIVE_STATE_MUTATION",
  "DEPLOYMENT_CONSEQUENCE_CONFORMANCE_DOES_NOT_CREATE_RUNTIME_OR_DATA_DESTRUCTION"
]) {
  assert(boundary.includes(fragment), `DEPLOYMENT_CONSEQUENCE_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_consequence_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  deployment_consequence_boundary_rule_count: d.deployment_consequence_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_consequence_false_key_count: d.future_customer_decision_proof_deployment_consequence_false_key_count,
  deployment_authorized: d.deployment_authorized,
  deployment_executed: d.deployment_executed,
  deployment_execution_ready: d.deployment_execution_ready,
  deployment_execution_created: d.deployment_execution_created,
  deployment_execution_final: d.deployment_execution_final,
  deployment_execution_consequence_created: d.deployment_execution_consequence_created,
  deployment_consequence_ready: d.deployment_consequence_ready,
  deployment_consequence_created: d.deployment_consequence_created,
  deployment_consequence_registered: d.deployment_consequence_registered,
  deployment_consequence_effective: d.deployment_consequence_effective,
  deployment_consequence_final: d.deployment_consequence_final,
  deployment_consequence_outcome_created: d.deployment_consequence_outcome_created,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_erasure_executed: d.data_erasure_executed,
  result_assertion: "PASS_PROG_388_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_388_DEPLOYMENT_CONSEQUENCE_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
