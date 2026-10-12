#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const manifestPath = process.argv[2] || "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_BENEFIT_CONFORMANCE_BINDING_DRAFT_v001.json";
const fallbackManifestPath = "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_BENEFIT_CONFORMANCE_BINDING_DRAFT_v001.json";
const actualManifestPath = fs.existsSync(manifestPath) ? manifestPath : fallbackManifestPath;

const raw = fs.readFileSync(actualManifestPath);
const manifest = JSON.parse(raw);
const sha = crypto.createHash("sha256").update(raw).digest("hex");

const OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-BENEFIT-CONFORMANCE-BINDING-DRAFT-V001";
const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_BENEFIT_CONFORMANCE_BINDING_DRAFT";
const EXPECTED_PENDING_SHA = "272d6bd983d30ee0c64d6a37ce67f4f49e65f4c197589f3e2b67e7a850071472";

const PENDING = {
  status: "DRAFT_PENDING_VALIDATION",
  marker: `${STEM}=PENDING_VALIDATION`,
  result: "PENDING_VALIDATION",
  result_assertion: "PASS_PROG_392_MANIFEST_CREATION_DEPLOYMENT_BENEFIT"
};

const ACTIVE = {
  status: `ACTIVE_${STEM}`,
  marker: `${STEM}=PASS`,
  result: `PASS_${STEM}`,
  result_assertion: "PASS_PROG_392_STEP_4_PROMOTE_TO_PASS"
};

assert.strictEqual(manifest.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(manifest.program, "PROG-392");
assert.strictEqual(manifest.object_id, OBJECT_ID);
assert.strictEqual(manifest.stem, STEM);

assert.strictEqual(manifest.parent_program, "PROG-391");
assert.strictEqual(manifest.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-VALUE-CONFORMANCE-BINDING-DRAFT-V001");
assert.strictEqual(manifest.parent_status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_VALUE_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(manifest.parent_commit, "1a2193d50215af16d2c6132e11b9516855e89cd8");
assert.strictEqual(manifest.basis_main_commit, "1a2193d50215af16d2c6132e11b9516855e89cd8");
assert.strictEqual(manifest.parent_manifest_sha256, "0f074456bcc94ac65b937af63c5e08f387b309d9c6ab68aab2ff62014a0c23ad");
assert.strictEqual(manifest.parent_validator_sha256, "d0dd704ef635b7603fd80c7a8de0dca674a7510a113410a02c4632ba69ac7478");

assert.strictEqual(manifest.parent_source_chain_entry_count, 109);
assert.strictEqual(manifest.source_chain_entry_count, 110);
assert.strictEqual(manifest.source_chain_entries.length, 110);

assert.strictEqual(manifest.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_benefit_conformance_field_count, 152);
assert.strictEqual(manifest.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_benefit_conformance_fields.length, 152);

assert.strictEqual(manifest.binding_rule_count, 152);
assert.strictEqual(manifest.binding_rules.length, 152);

assert.strictEqual(manifest.deployment_benefit_boundary_rule_count, 36);
assert.strictEqual(manifest.deployment_benefit_boundary_rules.length, 36);

assert.strictEqual(manifest.required_deployment_benefit_fields.length, 24);

assert.strictEqual(manifest.future_resolution_requirement_count, 1243);
assert.strictEqual(manifest.future_resolution_requirements.length, 1243);

assert.strictEqual(manifest.required_non_claim_count, 33058);
assert.strictEqual(manifest.required_non_claim_properties.length, 33058);

assert.strictEqual(manifest.required_no_execution_boundary_count, 24656);
assert.strictEqual(manifest.required_no_execution_boundary_properties.length, 24656);

assert.strictEqual(manifest.false_claim_property_count, 12877);
assert.strictEqual(manifest.false_claim_properties.length, 12877);

assert.strictEqual(manifest.future_customer_decision_proof_deployment_benefit_false_key_count, 453);
assert.strictEqual(manifest.all_customer_decision_proof_deployment_benefit_false_key_count, 453);
assert.strictEqual(manifest.future_customer_decision_proof_deployment_benefit_false_keys.length, 453);

const allowedState =
  manifest.status === PENDING.status &&
  manifest.marker === PENDING.marker &&
  manifest.result === PENDING.result &&
  manifest.result_assertion === PENDING.result_assertion
    ? "PENDING"
    : manifest.status === ACTIVE.status &&
      manifest.marker === ACTIVE.marker &&
      manifest.result === ACTIVE.result &&
      manifest.result_assertion === ACTIVE.result_assertion
        ? "ACTIVE"
        : null;

assert(allowedState, "PROG_392_STATUS_MARKER_RESULT_ASSERTION_INVALID");

if (allowedState === "PENDING") {
  assert.strictEqual(sha, EXPECTED_PENDING_SHA);
}

for (const key of manifest.future_customer_decision_proof_deployment_benefit_false_keys) {
  assert.strictEqual(manifest[key], false, `DEPLOYMENT_BENEFIT_FALSE_KEY_NOT_FALSE: ${key}`);
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
  "opc_allow",
  "opc_deployment_benefit_allow",
  "matrix_effective_state_updated",
  "matrix_deployment_benefit_created",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_erasure_executed"
]) {
  assert.strictEqual(manifest[key], false, `DEPLOYMENT_BENEFIT_REQUIRED_FALSE_FLAG_NOT_FALSE: ${key}`);
}

const boundary = [
  manifest.source_document_boundary_statement,
  manifest.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_benefit_boundary_statement,
  manifest.non_inference_rule,
  manifest.unknown_precedence_rule,
  ...(manifest.deployment_benefit_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Deployment Value Conformance draft does not imply Deployment Benefit Conformance",
  "Deployment value does not imply deployment benefit",
  "Deployment benefit does not imply realized benefit",
  "Deployment benefit does not imply financial return",
  "VALUE != BENEFIT",
  "BENEFIT != REALIZED_BENEFIT",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_BENEFIT_CLAIMS",
  "DEPLOYMENT_VALUE_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_BENEFIT",
  "DEPLOYMENT_BENEFIT_CONFORMANCE_DOES_NOT_CREATE_REALIZED_BENEFIT",
  "DEPLOYMENT_BENEFIT_CONFORMANCE_DOES_NOT_CREATE_OPC_ALLOW",
  "DEPLOYMENT_BENEFIT_CONFORMANCE_DOES_NOT_CREATE_MATRIX_OR_RUNTIME_OR_DATA_DESTRUCTION"
]) {
  assert(boundary.includes(fragment), `DEPLOYMENT_BENEFIT_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

console.log(JSON.stringify({
  object_id: manifest.object_id,
  program: manifest.program,
  status: manifest.status,
  marker: manifest.marker,
  result: manifest.result,
  parent_program: manifest.parent_program,
  parent_source_chain_entry_count: manifest.parent_source_chain_entry_count,
  source_chain_entry_count: manifest.source_chain_entry_count,
  field_count: manifest.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_benefit_conformance_field_count,
  binding_rule_count: manifest.binding_rule_count,
  deployment_benefit_boundary_rule_count: manifest.deployment_benefit_boundary_rule_count,
  future_resolution_requirement_count: manifest.future_resolution_requirement_count,
  required_non_claim_count: manifest.required_non_claim_count,
  required_no_execution_boundary_count: manifest.required_no_execution_boundary_count,
  false_claim_property_count: manifest.false_claim_property_count,
  deployment_benefit_false_key_count: manifest.future_customer_decision_proof_deployment_benefit_false_key_count,
  deployment_benefit_ready: manifest.deployment_benefit_ready,
  deployment_benefit_created: manifest.deployment_benefit_created,
  deployment_benefit_registered: manifest.deployment_benefit_registered,
  deployment_benefit_effective: manifest.deployment_benefit_effective,
  deployment_benefit_final: manifest.deployment_benefit_final,
  deployment_benefit_realized_created: manifest.deployment_benefit_realized_created,
  deployment_benefit_realized_registered: manifest.deployment_benefit_realized_registered,
  deployment_benefit_realized_effective: manifest.deployment_benefit_realized_effective,
  opc_allow: manifest.opc_allow,
  matrix_effective_state_updated: manifest.matrix_effective_state_updated,
  runtime_deletion_executed: manifest.runtime_deletion_executed,
  runtime_destruction_executed: manifest.runtime_destruction_executed,
  data_destruction_executed: manifest.data_destruction_executed,
  data_erasure_executed: manifest.data_erasure_executed,
  manifest_sha256: sha,
  result_assertion: allowedState === "PENDING"
    ? "PASS_PROG_392_VALIDATOR_PENDING_MANIFEST"
    : "PASS_PROG_392_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_392_DEPLOYMENT_BENEFIT_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
