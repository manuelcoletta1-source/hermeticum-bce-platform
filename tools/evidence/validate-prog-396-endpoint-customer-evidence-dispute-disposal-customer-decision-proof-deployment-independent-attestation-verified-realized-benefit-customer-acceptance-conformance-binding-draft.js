#!/usr/bin/env node
"use strict";

const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const DEFAULT_MANIFEST =
  "evidence/authorization/20261012_HBCE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_v001.json";

const manifestPath = process.argv[2] || DEFAULT_MANIFEST;
const raw = fs.readFileSync(manifestPath);
const d = JSON.parse(raw.toString("utf8"));
const sha = crypto.createHash("sha256").update(raw).digest("hex");

const objectId =
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CUSTOMER-ACCEPTANCE-CONFORMANCE-BINDING-DRAFT-V001";

const stem =
  "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT";

const expectedSha =
  "79577969e879fde3841b0e670e38501b6bb08e13b1cd3735fcfc40ca68a2096c";

const fieldCountName =
  "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_conformance_field_count";

const fieldsName =
  "required_endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_conformance_fields";

const boundaryName =
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_boundary_rules";

const boundaryCountName =
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_boundary_rule_count";

const falseKeysName =
  "future_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_false_keys";

const falseKeyCountName =
  "future_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_false_key_count";

const allFalseKeyCountName =
  "all_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_false_key_count";

const newFalseKeysName =
  "new_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_false_keys";

const newFalseKeyCountName =
  "new_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_false_key_count";

const requiredCustomerFieldsName =
  "required_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_fields";

const requiredCustomerFieldCountName =
  "required_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_field_count";

assert.strictEqual(sha, expectedSha);
assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
assert.strictEqual(d.program, "PROG-396");
assert.strictEqual(d.object_id, objectId);
assert.strictEqual(d.stem, stem);
assert.strictEqual(
  d.title,
  "PROG-396 Deployment Independent Attestation Verified Realized Benefit Customer Acceptance Conformance Binding Draft v001"
);
assert.strictEqual(d.status, `ACTIVE_${stem}`);
assert.strictEqual(d.marker, `${stem}=PASS`);
assert.strictEqual(d.result, `PASS_${stem}`);
assert.strictEqual(
  d.result_assertion,
  "PASS_PROG_396_STEP_4_PROMOTE_TO_PASS"
);
assert.strictEqual(d.final_audit_marker, `HBCE_${stem}_FINAL_AUDIT=1`);

assert.strictEqual(d.parent_program, "PROG-395");
assert.strictEqual(
  d.parent_object_id,
  "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CONFORMANCE-BINDING-DRAFT-V001"
);
assert.strictEqual(
  d.parent_status,
  "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CONFORMANCE_BINDING_DRAFT"
);
assert.strictEqual(d.parent_commit, "59632e7f2a1a667026abb4be25508f913f7e7a82");
assert.strictEqual(d.basis_main_commit, "59632e7f2a1a667026abb4be25508f913f7e7a82");
assert.strictEqual(
  d.parent_manifest_sha256,
  "973888debf0a75b0234ade4f3e1303a6fa8434e24be869d5cde4c4f428edb974"
);
assert.strictEqual(
  d.parent_validator_sha256,
  "ceb0c86e3b76f3967d1f8b8764b81db27eca51c6af903962c48b65938f2207f6"
);

assert.strictEqual(d.parent_source_chain_entry_count, 113);
assert.strictEqual(d.source_chain_entry_count, 114);
assert(Array.isArray(d.source_chain_entries));
assert.strictEqual(d.source_chain_entries.length, 114);

const lastEntry = d.source_chain_entries[d.source_chain_entries.length - 1];
assert.strictEqual(lastEntry.program, "PROG-396");
assert.strictEqual(lastEntry.object_id, objectId);
assert.strictEqual(lastEntry.status, `ACTIVE_${stem}`);
assert.strictEqual(lastEntry.marker, `${stem}=PASS`);
assert.strictEqual(lastEntry.result, `PASS_${stem}`);

assert.strictEqual(d[fieldCountName], 152);
assert(Array.isArray(d[fieldsName]));
assert.strictEqual(d[fieldsName].length, 152);
assert.strictEqual(d.field_count, 152);

assert.strictEqual(d.binding_rule_count, 152);
assert(Array.isArray(d.binding_rules));
assert.strictEqual(d.binding_rules.length, 152);

assert.strictEqual(d[boundaryCountName], 61);
assert(Array.isArray(d[boundaryName]));
assert.strictEqual(d[boundaryName].length, 61);

assert.strictEqual(d.future_resolution_requirement_count, 1399);
assert(Array.isArray(d.future_resolution_requirements));
assert.strictEqual(d.future_resolution_requirements.length, 1399);

assert.strictEqual(d.required_non_claim_count, 36505);
assert(Array.isArray(d.required_non_claim_properties));
assert.strictEqual(d.required_non_claim_properties.length, 36505);

assert.strictEqual(d.required_no_execution_boundary_count, 25855);
assert(Array.isArray(d.required_no_execution_boundary_properties));
assert.strictEqual(d.required_no_execution_boundary_properties.length, 25855);

assert.strictEqual(d.false_claim_property_count, 14039);
assert(Array.isArray(d.false_claim_properties));
assert.strictEqual(d.false_claim_properties.length, 14039);

assert.strictEqual(d[falseKeyCountName], 525);
assert.strictEqual(d[allFalseKeyCountName], 525);
assert(Array.isArray(d[falseKeysName]));
assert.strictEqual(d[falseKeysName].length, 525);

assert.strictEqual(d[newFalseKeyCountName], 18);
assert(Array.isArray(d[newFalseKeysName]));
assert.strictEqual(d[newFalseKeysName].length, 18);

assert.strictEqual(d[requiredCustomerFieldCountName], 24);
assert(Array.isArray(d[requiredCustomerFieldsName]));
assert.strictEqual(d[requiredCustomerFieldsName].length, 24);

for (const key of d[falseKeysName]) {
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const key of d[newFalseKeysName]) {
  assert.strictEqual(d[key], false, `NEW_FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const field of d[requiredCustomerFieldsName]) {
  assert(Object.prototype.hasOwnProperty.call(d, field), `MISSING_REQUIRED_CUSTOMER_FIELD: ${field}`);
  assert.strictEqual(d[field], null, `REQUIRED_CUSTOMER_FIELD_NOT_NULL: ${field}`);
}

for (const key of [
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_ready",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_created",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_registered",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_effective",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_final",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_customer_acceptance_created",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_customer_acceptance_registered",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_customer_acceptance_effective",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_created",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_registered",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_effective",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_attestor_independence_verified",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_matrix_state_updated",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_opc_allow",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_runtime_deletion_executed",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_runtime_destruction_executed",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_data_destruction_executed",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_data_erasure_executed",
  "customer_acceptance_conformance_ready",
  "customer_acceptance_created",
  "customer_acceptance_registered",
  "customer_acceptance_effective",
  "customer_acceptance_final",
  "customer_approval_created",
  "customer_signoff_created",
  "customer_legal_acceptance_created",
  "customer_commercial_acceptance_created",
  "regulatory_acceptance_created",
  "regulatory_approval_created",
  "opc_allow",
  "matrix_effective_state_updated",
  "runtime_deletion_executed",
  "runtime_destruction_executed",
  "data_destruction_executed",
  "data_erasure_executed"
]) {
  assert.strictEqual(d[key], false, `REQUIRED_FALSE_FLAG_NOT_FALSE: ${key}`);
}

const boundaryText = [
  d.endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_boundary_statement,
  ...(d[boundaryName] || [])
].filter(Boolean).join("\n");

for (const fragment of [
  "Customer acceptance conformance binding draft is an authorization evidence boundary only.",
  "Customer acceptance conformance draft does not imply actual customer acceptance.",
  "Customer acceptance conformance draft does not imply customer approval",
  "Customer acceptance conformance draft does not imply regulatory acceptance or regulatory approval.",
  "Customer acceptance conformance draft does not imply OPC ALLOW.",
  "Customer acceptance conformance draft does not imply Matrix effective state update.",
  "Customer acceptance conformance draft does not imply runtime deletion execution.",
  "Customer acceptance conformance draft does not imply data erasure execution.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != CUSTOMER_ACCEPTANCE.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != CUSTOMER_APPROVAL.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != CUSTOMER_SIGNOFF.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != REGULATORY_ACCEPTANCE.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != REGULATORY_APPROVAL.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != OPC_ALLOW.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != MATRIX_EFFECTIVE_STATE_UPDATE.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != RUNTIME_DELETION.",
  "CUSTOMER_ACCEPTANCE_CONFORMANCE_DRAFT != DATA_ERASURE.",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_CLAIMS."
]) {
  assert(boundaryText.includes(fragment), `BOUNDARY_FRAGMENT_MISSING: ${fragment}`);
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
  field_count: d[fieldCountName],
  binding_rule_count: d.binding_rule_count,
  deployment_independent_attestation_verified_realized_benefit_customer_acceptance_boundary_rule_count: d[boundaryCountName],
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  deployment_independent_attestation_verified_realized_benefit_customer_acceptance_false_key_count: d[falseKeyCountName],
  new_false_key_count: d[newFalseKeyCountName],
  required_customer_acceptance_field_count: d[requiredCustomerFieldCountName],
  customer_acceptance_conformance_ready: d.customer_acceptance_conformance_ready,
  customer_acceptance_created: d.customer_acceptance_created,
  customer_approval_created: d.customer_approval_created,
  regulatory_acceptance_created: d.regulatory_acceptance_created,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  data_erasure_executed: d.data_erasure_executed,
  manifest_sha256: sha,
  result_assertion: "PASS_PROG_396_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_396_CUSTOMER_ACCEPTANCE_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
