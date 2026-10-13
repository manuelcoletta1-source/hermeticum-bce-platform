#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const manifestPath = process.argv[2] || "evidence/authorization/20261012_HBCE_PROG_400_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_v001.json";
const raw = fs.readFileSync(manifestPath);
const manifestSha256 = crypto.createHash("sha256").update(raw).digest("hex");
const d = JSON.parse(raw.toString("utf8"));

const program = "PROG-400";
const parentProgram = "PROG-399";
const parentCommit = "74fb5be54182258ca6bbc2fe97803470c8cf4880";
const parentManifestSha256 = "3757bd97db1897b4959d0a4c78d2b76b7eaf4d1031e873b93c8c812417587e7c";
const expectedManifestSha256 = "f9d6f05448f647d15d48c2a4d19e43be7663c36919c0ef3258f3469a522e70dd";

const axis = "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY";
const sourceFalseKey = "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready";
const boundary = "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY.";
const targetStem = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT";
const objectId = `HBCE-${targetStem.replaceAll("_", "-")}-V001`;
const status = `ACTIVE_${targetStem}`;
const marker = `${targetStem}=PASS`;
const result = `PASS_${targetStem}`;

const newFalseKeys = [
  `${sourceFalseKey}_conformance_ready`,
  `${sourceFalseKey}_conformance_created`,
  `${sourceFalseKey}_conformance_registered`,
  `${sourceFalseKey}_conformance_effective`,
  `${sourceFalseKey}_conformance_final`,
  `${sourceFalseKey}_readiness_record_ready`,
  `${sourceFalseKey}_readiness_record_created`,
  `${sourceFalseKey}_readiness_record_registered`,
  `${sourceFalseKey}_readiness_record_effective`,
  `${sourceFalseKey}_readiness_record_final`,
  `${sourceFalseKey}_readiness_receipt_created`,
  `${sourceFalseKey}_readiness_signature_created`,
  `${sourceFalseKey}_readiness_timestamp_created`,
  `${sourceFalseKey}_approval_basis_verified`,
  `${sourceFalseKey}_regulatory_scope_verified`,
  `${sourceFalseKey}_evidence_package_complete`,
  `${sourceFalseKey}_authority_terms_verified`,
  `${sourceFalseKey}_supervisory_boundary_confirmed`
];

const boundaryRules = [
  "Regulatory Approval Conformance Ready Conformance draft does not imply Regulatory Approval Conformance Ready Conformance Ready Conformance.",
  "Regulatory approval conformance-ready-conformance-ready evidence does not imply readiness creation.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply actual regulatory approval readiness.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply regulatory approval, regulatory clearance, regulatory signoff, filing acceptance, supervisory non-objection, or regulator endorsement.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply customer approval or customer legal acceptance.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply authority scope verification.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply readiness record finality.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply OPC ALLOW.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply Matrix effective state update.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply runtime deletion execution.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply runtime destruction execution.",
  "Regulatory approval conformance-ready-conformance-ready conformance draft does not imply data destruction or data erasure execution.",
  boundary,
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_CLEARANCE.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != CUSTOMER_ACCEPTANCE.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != CUSTOMER_APPROVAL.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != OPC_ALLOW.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != MATRIX_EFFECTIVE_STATE_UPDATE.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != DATA_ERASURE.",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CLAIMS."
];

const fieldPrefix = "regulatory_approval_conformance_ready_conformance_ready";
const requiredFields = [
  `${fieldPrefix}_evidence_ref`,
  `${fieldPrefix}_evidence_sha256`,
  `${fieldPrefix}_actor_ref`,
  `${fieldPrefix}_actor_authority_ref`,
  `${fieldPrefix}_actor_authority_sha256`,
  `${fieldPrefix}_intent_ref`,
  `${fieldPrefix}_intent_sha256`,
  `${fieldPrefix}_scope_ref`,
  `${fieldPrefix}_scope_sha256`,
  `${fieldPrefix}_terms_ref`,
  `${fieldPrefix}_terms_sha256`,
  `${fieldPrefix}_receipt_ref`,
  `${fieldPrefix}_receipt_sha256`,
  `${fieldPrefix}_signature_ref`,
  `${fieldPrefix}_signature_sha256`,
  `${fieldPrefix}_timestamp_ref`,
  `${fieldPrefix}_timestamp_sha256`,
  `${fieldPrefix}_revocation_policy_ref`,
  `${fieldPrefix}_revocation_policy_sha256`,
  `${fieldPrefix}_dispute_policy_ref`,
  `${fieldPrefix}_dispute_policy_sha256`,
  `${fieldPrefix}_conformance_record_ref`,
  `${fieldPrefix}_conformance_record_sha256`,
  `${fieldPrefix}_audit_record_sha256`
];

assert.strictEqual(manifestSha256, expectedManifestSha256);
assert.strictEqual(d.object_id, objectId);
assert.strictEqual(d.program, program);
assert.strictEqual(d.status, status);
assert.strictEqual(d.marker, marker);
assert.strictEqual(d.result, result);
assert.strictEqual(d.parent_program, parentProgram);
assert.strictEqual(d.parent_commit, parentCommit);
assert.strictEqual(d.parent_manifest_sha256, parentManifestSha256);
assert.strictEqual(d.selected_axis, axis);
assert.strictEqual(d.selected_source_false_key, sourceFalseKey);
assert.strictEqual(d.selected_source_false_key_role, "EXISTING_PARENT_FALSE_KEY_NOT_NEW_FALSE_KEY");
assert.strictEqual(d.selected_boundary, boundary);

assert.strictEqual(d.source_chain_entry_count, 118);
assert.strictEqual(d.field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.boundary_rule_count, 149);
assert.strictEqual(d.future_resolution_requirement_count, 1567);
assert.strictEqual(d.required_non_claim_count, 36761);
assert.strictEqual(d.required_no_execution_boundary_count, 25907);
assert.strictEqual(d.false_claim_property_count, 14295);
assert.strictEqual(d.false_key_count, 597);
assert.strictEqual(d.new_false_key_count, 18);
assert.strictEqual(d.required_regulatory_approval_conformance_ready_conformance_ready_field_count, 24);

assert.strictEqual(d.regulatory_approval_conformance_ready_conformance_ready_conformance_ready, false);
assert.strictEqual(d.regulatory_approval_conformance_ready_conformance_ready_created, false);
assert.strictEqual(d.regulatory_approval_conformance_ready_conformance_ready_final, false);
assert.strictEqual(d.regulatory_approval_created, false);
assert.strictEqual(d.regulatory_clearance_created, false);
assert.strictEqual(d.customer_acceptance_created, false);
assert.strictEqual(d.customer_approval_created, false);
assert.strictEqual(d.opc_allow, false);
assert.strictEqual(d.matrix_effective_state_updated, false);
assert.strictEqual(d.runtime_deletion_executed, false);
assert.strictEqual(d.data_erasure_executed, false);

const newFalseKeysField = `new_${sourceFalseKey}_false_keys`;
const falseKeysField = `future_customer_decision_proof_${sourceFalseKey}_false_keys`;
const boundaryRulesField = `${fieldPrefix}_boundary_rules`;
const requiredFieldsField = `required_${fieldPrefix}_fields`;

assert.deepStrictEqual(d[newFalseKeysField], newFalseKeys);
assert(Array.isArray(d[falseKeysField]));
for (const key of newFalseKeys) {
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE:${key}`);
  assert(d[falseKeysField].includes(key), `FALSE_KEY_NOT_IN_FALSE_KEYS:${key}`);
}
assert.deepStrictEqual(d[boundaryRulesField], boundaryRules);
assert.deepStrictEqual(d[requiredFieldsField], requiredFields);
for (const field of requiredFields) {
  assert(Object.prototype.hasOwnProperty.call(d, field), `REQUIRED_FIELD_MISSING:${field}`);
}

assert.strictEqual(d.manifest_path, manifestPath);
assert.strictEqual(d.validator_path, "tools/evidence/validate-prog-400-regulatory-approval-conformance-ready-conformance-ready-conformance-binding-draft.js");
assert.strictEqual(d.release_tag, "hbce-prog-400-regulatory-approval-conformance-ready-conformance-ready-conformance-binding-draft-v001");
assert.strictEqual(d.result_assertion, "PASS_PROG_400_MANIFEST_PENDING");

console.log(JSON.stringify({
  object_id: d.object_id,
  program: d.program,
  status: d.status,
  marker: d.marker,
  result: d.result,
  parent_program: d.parent_program,
  parent_commit: d.parent_commit,
  selected_axis: d.selected_axis,
  selected_source_false_key: d.selected_source_false_key,
  selected_source_false_key_role: d.selected_source_false_key_role,
  selected_boundary: d.selected_boundary,
  source_chain_entry_count: d.source_chain_entry_count,
  field_count: d.field_count,
  binding_rule_count: d.binding_rule_count,
  boundary_rule_count: d.boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  false_key_count: d.false_key_count,
  new_false_key_count: d.new_false_key_count,
  required_regulatory_approval_conformance_ready_conformance_ready_field_count: d.required_regulatory_approval_conformance_ready_conformance_ready_field_count,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready: d.regulatory_approval_conformance_ready_conformance_ready_conformance_ready,
  regulatory_approval_conformance_ready_conformance_ready_created: d.regulatory_approval_conformance_ready_conformance_ready_created,
  regulatory_approval_created: d.regulatory_approval_created,
  regulatory_clearance_created: d.regulatory_clearance_created,
  customer_acceptance_created: d.customer_acceptance_created,
  customer_approval_created: d.customer_approval_created,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  data_erasure_executed: d.data_erasure_executed,
  manifest_sha256: manifestSha256,
  result_assertion: "PASS_PROG_400_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));
console.log("PROG_400_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
