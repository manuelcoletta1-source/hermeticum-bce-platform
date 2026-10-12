#!/usr/bin/env node
const fs = require("fs");
const assert = require("assert");
const crypto = require("crypto");

const manifestPath = process.argv[2] || "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_IMPACT_CONFORMANCE_BINDING_DRAFT_v001.json".replace("DISPUTAL", "DISPUTE_DISPOSAL");
const d = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-IMPACT-CONFORMANCE-BINDING-DRAFT-V001";
const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_IMPACT_CONFORMANCE_BINDING_DRAFT";

const allowedStatuses = new Set([
  "DRAFT_PENDING_VALIDATION",
  `ACTIVE_${STEM}`
]);

const allowedMarkers = new Set([
  `${STEM}=PENDING_VALIDATION`,
  `${STEM}=PASS`
]);

const allowedResults = new Set([
  "PENDING_VALIDATION",
  `PASS_${STEM}`
]);

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-390");
assert.strictEqual(d.object_id, OBJECT_ID);
assert.strictEqual(d.stem, STEM);
assert(allowedStatuses.has(d.status), `STATUS_INVALID: ${d.status}`);
assert(allowedMarkers.has(d.marker), `MARKER_INVALID: ${d.marker}`);
assert(allowedResults.has(d.result), `RESULT_INVALID: ${d.result}`);
assert(["PASS_PROG_390_MANIFEST_CREATION_DEPLOYMENT_IMPACT", "PASS_PROG_390_STEP_4_PROMOTE_TO_PASS"].includes(d.result_assertion), `RESULT_ASSERTION_INVALID: ${d.result_assertion}`);

assert.strictEqual(d.parent_program, "PROG-389");
assert.strictEqual(d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-OUTCOME-CONFORMANCE-BINDING-DRAFT-V001");
assert.strictEqual(d.parent_status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_OUTCOME_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.parent_commit, "08879525d07650ac2777d28c7e6baa97db0e8077");
assert.strictEqual(d.basis_main_commit, "08879525d07650ac2777d28c7e6baa97db0e8077");
assert.strictEqual(d.parent_manifest_sha256, "21053cb51030f9175c638fc388e8bdef649751d7d073c7ff2e3d65ce42d4a732");
assert.strictEqual(d.parent_validator_sha256, "d95aadfdf3cd37ed9d55ca271f5a2b7252972041c1ee1ea3a43f85110fe4f7b9");

assert.strictEqual(d.parent_source_chain_entry_count, 107);
assert.strictEqual(d.source_chain_entry_count, 108);
assert.strictEqual(d.source_chain_entries.length, 108);

assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_impact_conformance_field_count, 152);
assert.strictEqual(d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_impact_conformance_fields.length, 152);

assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.binding_rules.length, 152);

assert.strictEqual(d.deployment_impact_boundary_rule_count, 34);
assert.strictEqual(d.deployment_impact_boundary_rules.length, 34);

assert.strictEqual(d.required_deployment_impact_fields.length, 24);

assert.strictEqual(d.future_resolution_requirement_count, 1172);
assert.strictEqual(d.future_resolution_requirements.length, 1172);

assert.strictEqual(d.required_non_claim_count, 30822);
assert.strictEqual(d.required_non_claim_properties.length, 30822);

assert.strictEqual(d.required_no_execution_boundary_count, 23872);
assert.strictEqual(d.required_no_execution_boundary_properties.length, 23872);

assert.strictEqual(d.false_claim_property_count, 12151);
assert.strictEqual(d.false_claim_properties.length, 12151);

assert.strictEqual(d.future_customer_decision_proof_deployment_impact_false_key_count, 417);
assert.strictEqual(d.all_customer_decision_proof_deployment_impact_false_key_count, 417);
assert.strictEqual(d.future_customer_decision_proof_deployment_impact_false_keys.length, 417);

for (const key of d.future_customer_decision_proof_deployment_impact_false_keys) {
  assert.strictEqual(d[key], false, `DEPLOYMENT_IMPACT_FALSE_KEY_NOT_FALSE: ${key}`);
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
  "deployment_impact_matrix_state_updated",
  "deployment_impact_opc_allow",
  "deployment_impact_runtime_deletion_executed",
  "deployment_impact_runtime_destruction_executed",
  "deployment_impact_data_destruction_executed",
  "deployment_impact_data_erasure_executed",
  "opc_allow",
  "opc_deployment_impact_allow",
  "matrix_effective_state_updated",
  "matrix_deployment_impact_created",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_erasure_executed"
]) {
  assert.strictEqual(d[key], false, `BOUNDARY_FLAG_NOT_FALSE: ${key}`);
}

const requiredDeploymentImpactFields = [
  "deployment_impact_ready",
  "deployment_impact_created",
  "deployment_impact_registered",
  "deployment_impact_effective",
  "deployment_impact_final",
  "deployment_impact_value_created",
  "deployment_impact_value_registered",
  "deployment_impact_value_effective",
  "deployment_impact_matrix_state_updated",
  "deployment_impact_opc_allow",
  "deployment_impact_runtime_deletion_executed",
  "deployment_impact_runtime_destruction_executed",
  "deployment_impact_data_destruction_executed",
  "deployment_impact_data_erasure_executed",
  "future_deployment_impact_evidence",
  "future_deployment_impact_receipt",
  "future_deployment_impact_custody",
  "future_deployment_impact_verification",
  "future_deployment_impact_matrix_update",
  "future_deployment_impact_opc_decision",
  "future_deployment_impact_legal_review",
  "future_deployment_impact_customer_notice",
  "future_deployment_impact_regulatory_notice",
  "future_deployment_impact_final_audit"
];

for (const key of requiredDeploymentImpactFields) {
  assert(d.required_deployment_impact_fields.includes(key), `REQUIRED_DEPLOYMENT_IMPACT_FIELD_MISSING: ${key}`);
}

const boundary = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_impact_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.deployment_impact_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Deployment Outcome Conformance draft does not imply Deployment Impact Conformance",
  "Deployment outcome does not imply deployment impact",
  "Deployment impact does not imply deployment value",
  "Deployment Impact Conformance draft does not create deployment impact",
  "Deployment Impact Conformance draft does not create deployment value",
  "Deployment Impact Conformance draft does not execute deployment",
  "Deployment Impact Conformance draft does not authorize OPC ALLOW",
  "Deployment Impact Conformance draft does not mutate Matrix effective state",
  "Deployment Impact Conformance draft does not execute runtime deletion",
  "Deployment Impact Conformance draft does not execute runtime destruction",
  "Deployment Impact Conformance draft does not execute data destruction",
  "Deployment Impact Conformance draft does not execute data erasure",
  "Deployment Impact Conformance does not imply OPC ALLOW",
  "Deployment Impact Conformance does not imply Matrix effective state mutation",
  "Deployment Impact Conformance does not imply runtime deletion or runtime destruction",
  "Deployment Impact Conformance does not imply data destruction or data erasure",
  "DISPATCHED != EXECUTED",
  "EXECUTED != CONSEQUENCE",
  "CONSEQUENCE != OUTCOME",
  "OUTCOME != IMPACT",
  "IMPACT != VALUE",
  "Receipt does not imply verification",
  "Custody does not imply verification",
  "Verification does not imply Matrix effective state",
  "Existing PROG-389 Deployment Outcome Conformance is not recreated by PROG-390",
  "Missing evidence remains UNKNOWN or INSUFFICIENT_EVIDENCE",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_IMPACT_CLAIMS",
  "DEPLOYMENT_OUTCOME_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_IMPACT",
  "DEPLOYMENT_IMPACT_CONFORMANCE_DOES_NOT_CREATE_DEPLOYMENT_VALUE",
  "DEPLOYMENT_IMPACT_CONFORMANCE_DOES_NOT_CREATE_OPC_ALLOW",
  "DEPLOYMENT_IMPACT_CONFORMANCE_DOES_NOT_CREATE_MATRIX_EFFECTIVE_STATE_MUTATION",
  "DEPLOYMENT_IMPACT_CONFORMANCE_DOES_NOT_CREATE_RUNTIME_OR_DATA_DESTRUCTION"
]) {
  assert(boundary.includes(fragment), `DEPLOYMENT_IMPACT_BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

const manifestSha256 = crypto.createHash("sha256").update(fs.readFileSync(manifestPath)).digest("hex");

console.log(JSON.stringify({
  object_id: d.object_id,
  program: d.program,
  status: d.status,
  marker: d.marker,
  result: d.result,
  parent_program: d.parent_program,
  parent_source_chain_entry_count: d.parent_source_chain_entry_count,
  source_chain_entry_count: d.source_chain_entry_count,
  field_count: d.required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_impact_conformance_field_count,
  binding_rule_count: d.binding_rule_count,
  deployment_impact_boundary_rule_count: d.deployment_impact_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_impact_false_key_count: d.future_customer_decision_proof_deployment_impact_false_key_count,
  deployment_impact_ready: d.deployment_impact_ready,
  deployment_impact_created: d.deployment_impact_created,
  deployment_impact_registered: d.deployment_impact_registered,
  deployment_impact_effective: d.deployment_impact_effective,
  deployment_impact_final: d.deployment_impact_final,
  deployment_impact_value_created: d.deployment_impact_value_created,
  deployment_impact_value_registered: d.deployment_impact_value_registered,
  deployment_impact_value_effective: d.deployment_impact_value_effective,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_erasure_executed: d.data_erasure_executed,
  manifest_sha256: manifestSha256,
  result_assertion: d.status === "DRAFT_PENDING_VALIDATION"
    ? "PASS_PROG_390_VALIDATOR_PENDING_MANIFEST"
    : "PASS_PROG_390_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_390_DEPLOYMENT_IMPACT_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
