#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "../..");
const MANIFEST_PATH = path.join(ROOT, "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_OUTCOME_CONFORMANCE_BINDING_DRAFT_v001.json");

const EXPECTED_OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-OUTCOME-CONFORMANCE-BINDING-DRAFT-V001";
const EXPECTED_STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_OUTCOME_CONFORMANCE_BINDING_DRAFT";
const EXPECTED_MANIFEST_SHA256 = "21053cb51030f9175c638fc388e8bdef649751d7d073c7ff2e3d65ce42d4a732";

const EXPECTED_STATUS = `ACTIVE_${EXPECTED_STEM}`;
const EXPECTED_MARKER = `${EXPECTED_STEM}=PASS`;
const EXPECTED_RESULT = `PASS_${EXPECTED_STEM}`;
const EXPECTED_RESULT_ASSERTION = "PASS_PROG_389_STEP_4_PROMOTE_TO_PASS";

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function requireIncludes(haystack, fragment) {
  assert(haystack.includes(fragment), `DEPLOYMENT_OUTCOME_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

assert(fs.existsSync(MANIFEST_PATH), `MANIFEST_MISSING: ${MANIFEST_PATH}`);
assert.strictEqual(sha256File(MANIFEST_PATH), EXPECTED_MANIFEST_SHA256, "MANIFEST_SHA256_MISMATCH");

const d = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-389");
assert.strictEqual(d.object_id, EXPECTED_OBJECT_ID);
assert.strictEqual(d.stem, EXPECTED_STEM);
assert.strictEqual(d.status, EXPECTED_STATUS);
assert.strictEqual(d.marker, EXPECTED_MARKER);
assert.strictEqual(d.result, EXPECTED_RESULT);
assert.strictEqual(d.result_assertion, EXPECTED_RESULT_ASSERTION);

assert.strictEqual(d.parent_program, "PROG-388");
assert.strictEqual(d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-CONSEQUENCE-CONFORMANCE-BINDING-DRAFT-V001");
assert.strictEqual(d.parent_status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_CONSEQUENCE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.parent_commit, "1e71035fe337224f53ab5c3ac585de604e4abaad");
assert.strictEqual(d.basis_main_commit, "1e71035fe337224f53ab5c3ac585de604e4abaad");
assert.strictEqual(d.parent_manifest_sha256, "7857c71a2a7e7aa227540bdabf4811f2b680bae7cd3a5c8175e2e7dde306078f");
assert.strictEqual(d.parent_validator_sha256, "5bc4fe0c07e041246e32149712527cd89fe2997b697e1d8a24f7809f1d31e16a");

assert.strictEqual(d.parent_source_chain_entry_count, 106);
assert.strictEqual(d.source_chain_entry_count, 107);
assert.strictEqual(d.source_chain_entries.length, 107);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_outcome_conformance_field_count, 152);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_outcome_conformance_fields.length, 152);

assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.binding_rules.length, 152);

assert.strictEqual(d.deployment_outcome_boundary_rule_count, 33);
assert.strictEqual(d.deployment_outcome_boundary_rules.length, 33);

assert.strictEqual(d.required_deployment_outcome_fields.length, 24);

assert.strictEqual(d.future_resolution_requirement_count, 1138);
assert.strictEqual(d.future_resolution_requirements.length, 1138);

assert.strictEqual(d.required_non_claim_count, 29704);
assert.strictEqual(d.required_non_claim_properties.length, 29704);

assert.strictEqual(d.required_no_execution_boundary_count, 23480);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 23480);

assert.strictEqual(d.false_claim_property_count, 11788);
assert.strictEqual(d.false_claim_properties.length, 11788);

assert.strictEqual(d.future_customer_decision_proof_deployment_outcome_false_key_count, 399);
assert.strictEqual(d.all_customer_decision_proof_deployment_outcome_false_key_count, 399);
assert.strictEqual(d.future_customer_decision_proof_deployment_outcome_false_keys.length, 399);

for (const key of d.future_customer_decision_proof_deployment_outcome_false_keys) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_OUTCOME_FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of [
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
  "deployment_outcome_matrix_state_updated",
  "deployment_outcome_opc_allow",
  "deployment_outcome_runtime_deletion_executed",
  "deployment_outcome_runtime_destruction_executed",
  "deployment_outcome_data_destruction_executed",
  "deployment_outcome_data_erasure_executed",
  "opc_allow",
  "opc_deployment_outcome_allow",
  "matrix_effective_state_updated",
  "matrix_deployment_outcome_created",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_erasure_executed"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_outcome_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.deployment_outcome_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Deployment Consequence Conformance draft does not imply Deployment Outcome Conformance",
  "Deployment consequence does not imply deployment outcome",
  "Deployment outcome does not imply deployment impact",
  "Deployment Outcome Conformance draft does not create deployment outcome",
  "Deployment Outcome Conformance draft does not create deployment impact",
  "Deployment Outcome Conformance draft does not execute deployment",
  "Deployment Outcome Conformance draft does not authorize OPC ALLOW",
  "Deployment Outcome Conformance draft does not mutate Matrix effective state",
  "Deployment Outcome Conformance draft does not execute runtime deletion",
  "Deployment Outcome Conformance draft does not execute runtime destruction",
  "Deployment Outcome Conformance draft does not execute data destruction",
  "Deployment Outcome Conformance draft does not execute data erasure",
  "Deployment Outcome Conformance does not imply OPC ALLOW",
  "Deployment Outcome Conformance does not imply Matrix effective state mutation",
  "Deployment Outcome Conformance does not imply runtime deletion or runtime destruction",
  "Deployment Outcome Conformance does not imply data destruction or data erasure",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "CONSEQUENCE != OUTCOME",
  "OUTCOME != IMPACT",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "Existing PROG-388 Deployment Consequence Conformance is not recreated by PROG-389",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_OUTCOME_CLAIMS",
  "DEPLOYMENT_CONSEQUENCE_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_OUTCOME",
  "DEPLOYMENT_OUTCOME_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_IMPACT",
  "DEPLOYMENT_OUTCOME_CONFORMANCE_DOES_NOT_CREATE_OPC_ALLOW",
  "DEPLOYMENT_OUTCOME_CONFORMANCE_DOES_NOT_CREATE_MATRIX_EFFECTIVE_STATE_MUTATION",
  "DEPLOYMENT_OUTCOME_CONFORMANCE_DOES_NOT_CREATE_RUNTIME_OR_DATA_DESTRUCTION"
]) {
  requireIncludes(boundary, fragment);
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
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_outcome_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  deployment_outcome_boundary_rule_count: d.deployment_outcome_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_outcome_false_key_count: d.future_customer_decision_proof_deployment_outcome_false_key_count,
  deployment_outcome_ready: d.deployment_outcome_ready,
  deployment_outcome_created: d.deployment_outcome_created,
  deployment_outcome_registered: d.deployment_outcome_registered,
  deployment_outcome_effective: d.deployment_outcome_effective,
  deployment_outcome_final: d.deployment_outcome_final,
  deployment_outcome_impact_created: d.deployment_outcome_impact_created,
  deployment_outcome_impact_registered: d.deployment_outcome_impact_registered,
  deployment_outcome_impact_effective: d.deployment_outcome_impact_effective,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_erasure_executed: d.data_erasure_executed,
  result_assertion: "PASS_PROG_389_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_389_DEPLOYMENT_OUTCOME_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
