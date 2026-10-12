#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const MANIFEST_PATH = "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_EXECUTION_CONFORMANCE_BINDING_DRAFT_v001.json";

const EXPECTED_MANIFEST_SHA256 = "fd940e81fff7f78f97d308e31632e373e8d9e0afd464ee1d30161e71764fc9ac";
const EXPECTED_STATUS = "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_EXECUTION_CONFORMANCE_BINDING_DRAFT";
const EXPECTED_MARKER = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_EXECUTION_CONFORMANCE_BINDING_DRAFT=PASS";
const EXPECTED_RESULT = "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_EXECUTION_CONFORMANCE_BINDING_DRAFT";
const EXPECTED_FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_EXECUTION_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";
const EXPECTED_RESULT_ASSERTION = "PASS_PROG_387_VALIDATOR_ACTIVE_MANIFEST";

const EXPECTED_OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-EXECUTION-CONFORMANCE-BINDING-DRAFT-V001";
const EXPECTED_PARENT_OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-AUTHORIZATION-CONFORMANCE-BINDING-DRAFT-V001";

const raw = fs.readFileSync(MANIFEST_PATH);
const actualSha = crypto.createHash("sha256").update(raw).digest("hex");
assert.strictEqual(actualSha, EXPECTED_MANIFEST_SHA256, "MANIFEST_SHA256_MISMATCH");

const d = JSON.parse(raw.toString("utf8"));

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-387");
assert.strictEqual(d.object_id, EXPECTED_OBJECT_ID);
assert.strictEqual(d.status, EXPECTED_STATUS);
assert.strictEqual(d.marker, EXPECTED_MARKER);
assert.strictEqual(d.result, EXPECTED_RESULT);

if (EXPECTED_FINAL_AUDIT_MARKER === null) {
  assert.strictEqual(d.final_audit_marker, undefined, "FINAL_AUDIT_MARKER_MUST_BE_ABSENT_FOR_PENDING_MANIFEST");
} else {
  assert.strictEqual(d.final_audit_marker, EXPECTED_FINAL_AUDIT_MARKER);
}

assert.strictEqual(d.parent_program, "PROG-386");
assert.strictEqual(d.parent_object_id, EXPECTED_PARENT_OBJECT_ID);
assert.strictEqual(d.parent_commit, "8c9b0518cc298245c9a723f1ed020ae826542724");
assert.strictEqual(d.basis_main_commit, "8c9b0518cc298245c9a723f1ed020ae826542724");
assert.strictEqual(d.parent_manifest_sha256, "ad7cb6cae277a46537d9abccd6c57061788e1d622c4df07e52eac66020534e94");
assert.strictEqual(d.parent_validator_sha256, "34c85e127074006dc0f5744c8d4e81cab6aa9f730dfd6b3574136bf1f0638575");

assert.strictEqual(d.parent_source_chain_entry_count, 104);
assert.strictEqual(d.source_chain_entry_count, 105);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_execution_conformance_field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.deployment_execution_boundary_rule_count, 29);
assert.strictEqual(d.future_resolution_requirement_count, 1074);
assert.strictEqual(d.required_non_claim_count, 27468);
assert.strictEqual(d.required_no_execution_boundary_count, 22696);
assert.strictEqual(d.false_claim_property_count, 11062);
assert.strictEqual(d.future_customer_decision_proof_deployment_execution_false_key_count, 363);
assert.strictEqual(d.all_customer_decision_proof_deployment_execution_false_key_count, 363);

assert.strictEqual(d.required_deployment_execution_fields.length, 24);
assert.strictEqual(d.deployment_execution_boundary_rules.length, 29);
assert.strictEqual(d.future_resolution_requirements.length, d.future_resolution_requirement_count);
assert.strictEqual(d.required_non_claim_properties.length, d.required_non_claim_count);
assert.strictEqual(d.required_no_execution_boundary_properties.length, d.required_no_execution_boundary_count);
assert.strictEqual(d.false_claim_properties.length, d.false_claim_property_count);
assert.strictEqual(
  d.future_customer_decision_proof_deployment_execution_false_keys.length,
  d.future_customer_decision_proof_deployment_execution_false_key_count
);

assert.strictEqual(d.deploymentExecution, false);
assert.strictEqual(d.deployment_execution_conformance_only, true);
assert.strictEqual(d.draft_not_execution, true);

for (const key of d.future_customer_decision_proof_deployment_execution_false_keys) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_EXECUTION_FALSE_KEY_NOT_FALSE: ${key}`);
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

  "opc_allow",
  "opc_execution_allow",
  "opc_deployment_allow",
  "opc_runtime_readiness_allow",
  "opc_deployment_authorization_allow",
  "opc_deployment_execution_allow",

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
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_execution_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.deployment_execution_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Deployment Authorization Conformance does not imply Deployment Execution Conformance",
  "Deployment authorization does not imply deployment execution",
  "Deployment execution does not imply deployment consequence",
  "Deployment Execution Conformance does not imply OPC ALLOW",
  "Deployment Execution Conformance does not imply Matrix effective state mutation",
  "Deployment Execution Conformance does not imply runtime deletion",
  "Deployment Execution Conformance does not imply runtime destruction",
  "Deployment Execution Conformance does not imply data destruction",
  "Deployment Execution Conformance does not imply data erasure",
  "Deployment Execution Conformance draft does not execute deployment",
  "Deployment Execution Conformance draft does not authorize OPC ALLOW",
  "Deployment Execution Conformance draft does not mutate Matrix effective state",
  "Deployment Execution Conformance draft does not execute runtime deletion",
  "Deployment Execution Conformance draft does not execute runtime destruction",
  "Deployment Execution Conformance draft does not execute data destruction",
  "Deployment Execution Conformance draft does not execute data erasure",
  "Deployment execution does not imply deployment consequence",
  "Existing PROG-386 Deployment Authorization Conformance is not recreated by PROG-387",
  "UNKNOWN or INSUFFICIENT_EVIDENCE prevails over deployment execution claims",
  "DEPLOYMENT_AUTHORIZATION_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_EXECUTION",
  "DEPLOYMENT_EXECUTION_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_CONSEQUENCE",
  "DEPLOYMENT_EXECUTION_CONFORMANCE_DOES_NOT_CREATE_OPC_ALLOW",
  "DEPLOYMENT_EXECUTION_CONFORMANCE_DOES_NOT_CREATE_MATRIX_EFFECTIVE_STATE_MUTATION",
  "DEPLOYMENT_EXECUTION_CONFORMANCE_DOES_NOT_CREATE_RUNTIME_OR_DATA_DESTRUCTION"
]) {
  assert(boundary.includes(fragment), `DEPLOYMENT_EXECUTION_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_execution_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  deployment_execution_boundary_rule_count: d.deployment_execution_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_execution_false_key_count: d.future_customer_decision_proof_deployment_execution_false_key_count,
  deployment_authorized: d.deployment_authorized,
  deployment_executed: d.deployment_executed,
  deployment_execution_ready: d.deployment_execution_ready,
  deployment_execution_created: d.deployment_execution_created,
  deployment_execution_final: d.deployment_execution_final,
  deployment_execution_consequence_created: d.deployment_execution_consequence_created,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_erasure_executed: d.data_erasure_executed,
  result_assertion: EXPECTED_RESULT_ASSERTION
}, null, 2));

console.log("PROG_387_DEPLOYMENT_EXECUTION_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
