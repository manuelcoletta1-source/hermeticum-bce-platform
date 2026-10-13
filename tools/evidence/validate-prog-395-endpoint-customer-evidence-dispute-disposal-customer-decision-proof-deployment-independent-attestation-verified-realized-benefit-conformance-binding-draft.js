#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const manifestPath = process.argv[2] || "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT_v001.json";

const EXPECTED_PENDING_SHA = "2705200c6874a8e3e5a87070646a94d189bf55390735d3fded97ab47aafebe3c";
const OBJECT_ID = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CONFORMANCE-BINDING-DRAFT-V001";
const STEM = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT";
const FINAL_AUDIT_MARKER = "HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT_FINAL_AUDIT=1";

const FIELD_COUNT_NAME = "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_conformance_field_count";
const FIELDS_NAME = "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_conformance_fields";

const raw = fs.readFileSync(manifestPath);
const d = JSON.parse(raw.toString("utf8"));
const sha = crypto.createHash("sha256").update(raw).digest("hex");

function reqArray(name, count) {
  assert(Array.isArray(d[name]), `${name}_NOT_ARRAY`);
  assert.strictEqual(d[name].length, count, `${name}_COUNT`);
}

assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-395");
assert.strictEqual(d.object_id, OBJECT_ID);
assert.strictEqual(d.stem, STEM);
assert.strictEqual(d.title, "PROG-395 Deployment Independent Attestation Verified Realized Benefit Conformance Binding Draft v001");

assert.strictEqual(d.parent_program, "PROG-394");
assert.strictEqual(d.parent_object_id, "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-VERIFIED-REALIZED-BENEFIT-CONFORMANCE-BINDING-DRAFT-V001");
assert.strictEqual(d.parent_status, "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT");
assert.strictEqual(d.parent_commit, "b00bb709addfc6b52458e25239271aac633f15ad");
assert.strictEqual(d.basis_main_commit, "b00bb709addfc6b52458e25239271aac633f15ad");
assert.strictEqual(d.parent_manifest_sha256, "efaff2d7be54df935b30b0706646d0f5ead0e88f7de054cde7f843827bfc597c");
assert.strictEqual(d.parent_validator_sha256, "670bdaa15856af6efd08c501cc02ed6d2ae9437bc36fc4cea78dc634bc405ff4");

assert.strictEqual(d.parent_source_chain_entry_count, 112);
assert.strictEqual(d.source_chain_entry_count, 113);
reqArray("source_chain_entries", 113);

assert.strictEqual(d[FIELD_COUNT_NAME], 152);
reqArray(FIELDS_NAME, 152);
assert.strictEqual(d.binding_rule_count, 152);
reqArray("binding_rules", 152);

assert.strictEqual(d.deployment_independent_attestation_verified_realized_benefit_boundary_rule_count, 39);
reqArray("deployment_independent_attestation_verified_realized_benefit_boundary_rules", 39);

reqArray("required_deployment_independent_attestation_verified_realized_benefit_fields", 24);
assert.strictEqual(d.future_resolution_requirement_count, 1357);
reqArray("future_resolution_requirements", 1357);
assert.strictEqual(d.required_non_claim_count, 36441);
reqArray("required_non_claim_properties", 36441);
assert.strictEqual(d.required_no_execution_boundary_count, 25842);
reqArray("required_no_execution_boundary_properties", 25842);
assert.strictEqual(d.false_claim_property_count, 13975);
reqArray("false_claim_properties", 13975);

assert.strictEqual(d.future_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_false_key_count, 507);
assert.strictEqual(d.all_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_false_key_count, 507);
reqArray("future_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_false_keys", 507);
assert.strictEqual(d.new_deployment_independent_attestation_verified_realized_benefit_false_key_count, 18);
reqArray("new_deployment_independent_attestation_verified_realized_benefit_false_keys", 18);

for (const key of d.future_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_false_keys) {
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of [
  "deployment_independent_attestation_verified_realized_benefit_ready",
  "deployment_independent_attestation_verified_realized_benefit_created",
  "deployment_independent_attestation_verified_realized_benefit_registered",
  "deployment_independent_attestation_verified_realized_benefit_effective",
  "deployment_independent_attestation_verified_realized_benefit_final",
  "deployment_independent_attestation_verified_realized_benefit_independent_attestation_created",
  "deployment_independent_attestation_verified_realized_benefit_independent_attestation_registered",
  "deployment_independent_attestation_verified_realized_benefit_independent_attestation_effective",
  "deployment_independent_attestation_verified_realized_benefit_matrix_state_updated",
  "deployment_independent_attestation_verified_realized_benefit_opc_allow",
  "deployment_independent_attestation_verified_realized_benefit_runtime_deletion_executed",
  "deployment_independent_attestation_verified_realized_benefit_runtime_destruction_executed",
  "deployment_independent_attestation_verified_realized_benefit_data_destruction_executed",
  "deployment_independent_attestation_verified_realized_benefit_data_erasure_executed",
  "opc_allow",
  "opc_deployment_independent_attestation_verified_realized_benefit_allow",
  "matrix_effective_state_updated",
  "matrix_deployment_independent_attestation_verified_realized_benefit_created",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_erasure_executed",
  "independent_attestation_verified_realized_benefit_customer_acceptance_created",
  "independent_attestation_verified_realized_benefit_regulatory_acceptance_created"
]) {
  assert.strictEqual(d[key], false, `REQUIRED_FALSE_FLAG_NOT_FALSE: ${key}`);
}

const boundaryText = [
  d.source_document_boundary_statement,
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_boundary_statement,
  d.non_inference_rule,
  d.unknown_precedence_rule,
  ...(d.deployment_independent_attestation_verified_realized_benefit_boundary_rules || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Deployment Verified Realized Benefit Conformance draft does not imply Deployment Independent Attestation Verified Realized Benefit Conformance",
  "Verified realized benefit does not imply independent attestation",
  "Independent attestation verified realized benefit does not imply attestor independence",
  "Independent attestation verified realized benefit does not imply attestor identity verification",
  "Independent attestation verified realized benefit does not imply attestation scope completeness",
  "Independent attestation verified realized benefit does not imply attestation evidence sufficiency",
  "Independent attestation verified realized benefit does not imply legal certification",
  "Independent attestation verified realized benefit does not imply regulatory approval",
  "Independent attestation verified realized benefit does not imply customer acceptance",
  "Independent attestation verified realized benefit does not imply regulatory notice",
  "Independent attestation verified realized benefit does not imply OPC ALLOW",
  "Independent attestation verified realized benefit does not imply Matrix effective state update",
  "Independent attestation verified realized benefit does not imply runtime deletion execution",
  "Independent attestation verified realized benefit does not imply data erasure execution",
  "Attestation existence is not equivalent to independent attestation verification",
  "Attestor independence must be evidenced, not inferred from label, vendor, role, or document title",
  "VERIFIED_REALIZED_BENEFIT != INDEPENDENT_ATTESTATION",
  "INDEPENDENT_ATTESTATION != CUSTOMER_ACCEPTANCE",
  "INDEPENDENT_ATTESTATION != REGULATORY_ACCEPTANCE",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CLAIMS"
]) {
  assert(boundaryText.includes(fragment), `BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
}

if (d.status === "DRAFT_PENDING_VALIDATION") {
  assert.strictEqual(sha, EXPECTED_PENDING_SHA);
  assert.strictEqual(d.marker, `${STEM}=PENDING_VALIDATION`);
  assert.strictEqual(d.result, "PENDING_VALIDATION");
  assert.strictEqual(d.result_assertion, "PASS_PROG_395_MANIFEST_CREATION_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT");
} else {
  assert.strictEqual(d.status, `ACTIVE_${STEM}`);
  assert.strictEqual(d.marker, `${STEM}=PASS`);
  assert.strictEqual(d.result, `PASS_${STEM}`);
  assert.strictEqual(d.final_audit_marker, FINAL_AUDIT_MARKER);
  assert.strictEqual(d.result_assertion, "PASS_PROG_395_STEP_4_PROMOTE_TO_PASS");
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
  field_count: d[FIELD_COUNT_NAME],
  binding_rule_count: d.binding_rule_count,
  deployment_independent_attestation_verified_realized_benefit_boundary_rule_count: d.deployment_independent_attestation_verified_realized_benefit_boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_independent_attestation_verified_realized_benefit_false_key_count: d.future_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_false_key_count,
  deployment_independent_attestation_verified_realized_benefit_ready: d.deployment_independent_attestation_verified_realized_benefit_ready,
  deployment_independent_attestation_verified_realized_benefit_created: d.deployment_independent_attestation_verified_realized_benefit_created,
  deployment_independent_attestation_verified_realized_benefit_registered: d.deployment_independent_attestation_verified_realized_benefit_registered,
  deployment_independent_attestation_verified_realized_benefit_effective: d.deployment_independent_attestation_verified_realized_benefit_effective,
  deployment_independent_attestation_verified_realized_benefit_final: d.deployment_independent_attestation_verified_realized_benefit_final,
  deployment_independent_attestation_verified_realized_benefit_independent_attestation_created: d.deployment_independent_attestation_verified_realized_benefit_independent_attestation_created,
  deployment_independent_attestation_verified_realized_benefit_independent_attestation_registered: d.deployment_independent_attestation_verified_realized_benefit_independent_attestation_registered,
  deployment_independent_attestation_verified_realized_benefit_independent_attestation_effective: d.deployment_independent_attestation_verified_realized_benefit_independent_attestation_effective,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  runtime_destruction_executed: d.runtime_destruction_executed,
  data_destruction_executed: d.data_destruction_executed,
  data_erasure_executed: d.data_erasure_executed,
  manifest_sha256: sha,
  result_assertion: d.status === "DRAFT_PENDING_VALIDATION"
    ? "PASS_PROG_395_VALIDATOR_PENDING_MANIFEST"
    : "PASS_PROG_395_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_395_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
