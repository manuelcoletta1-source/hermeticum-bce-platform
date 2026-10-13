#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const manifestPath = process.argv[2] || "evidence/authorization/20261013_HBCE_PROG_401_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_v001.json";
const raw = fs.readFileSync(manifestPath);
const sha = crypto.createHash("sha256").update(raw).digest("hex");
const d = JSON.parse(raw.toString("utf8"));

const expectedManifestSha256 = "a7a348b13ede2c3273ebb528221c529d8620c5f69348379f0dcc94b1d7e4cedc";
const parentManifestSha256 = "f9d6f05448f647d15d48c2a4d19e43be7663c36919c0ef3258f3469a522e70dd";
const parentCommit = "b69bd0da308f354e978abdcbdbc3b9f19892214d";

const sourceFalseKey = "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready";
const fieldPrefix = "regulatory_approval_conformance_ready_conformance_ready_conformance_ready";
const targetStem = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT";
const objectId = `HBCE-${targetStem.replaceAll("_", "-")}-V001`;

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

const boundary = "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY.";

const boundaryRules = [
  "Regulatory Approval Conformance Ready Conformance Ready Conformance draft does not imply Regulatory Approval Conformance Ready Conformance Ready Conformance Ready Conformance.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready evidence does not imply readiness creation.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply actual regulatory approval readiness.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply regulatory approval, regulatory clearance, regulatory signoff, filing acceptance, supervisory non-objection, or regulator endorsement.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply customer approval or customer legal acceptance.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply authority scope verification.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply readiness record finality.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply OPC ALLOW.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply Matrix effective state update.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply runtime deletion execution.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply runtime destruction execution.",
  "Regulatory approval conformance-ready-conformance-ready-conformance-ready conformance draft does not imply data destruction or data erasure execution.",
  boundary,
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_CLEARANCE.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != CUSTOMER_ACCEPTANCE.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != CUSTOMER_APPROVAL.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != OPC_ALLOW.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != MATRIX_EFFECTIVE_STATE_UPDATE.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != DATA_ERASURE.",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CLAIMS."
];

const requiredFields = [
  `${fieldPrefix}_readiness_record_id`,
  `${fieldPrefix}_readiness_record_hash`,
  `${fieldPrefix}_readiness_record_timestamp`,
  `${fieldPrefix}_readiness_record_actor`,
  `${fieldPrefix}_readiness_receipt_id`,
  `${fieldPrefix}_readiness_receipt_hash`,
  `${fieldPrefix}_readiness_signature_id`,
  `${fieldPrefix}_readiness_signature_hash`,
  `${fieldPrefix}_readiness_timestamp_id`,
  `${fieldPrefix}_readiness_timestamp_hash`,
  `${fieldPrefix}_approval_basis_id`,
  `${fieldPrefix}_approval_basis_hash`,
  `${fieldPrefix}_regulatory_scope_id`,
  `${fieldPrefix}_regulatory_scope_hash`,
  `${fieldPrefix}_evidence_package_id`,
  `${fieldPrefix}_evidence_package_hash`,
  `${fieldPrefix}_authority_terms_id`,
  `${fieldPrefix}_authority_terms_hash`,
  `${fieldPrefix}_supervisory_boundary_id`,
  `${fieldPrefix}_supervisory_boundary_hash`,
  `${fieldPrefix}_custody_ref`,
  `${fieldPrefix}_reviewer_ref`,
  `${fieldPrefix}_decision_ref`,
  `${fieldPrefix}_human_acceptance_ref`
];

assert.strictEqual(sha, expectedManifestSha256);
assert.strictEqual(d.object_id, objectId);
assert.strictEqual(d.program, "PROG-401");
assert.strictEqual(d.status, `ACTIVE_${targetStem}`);
assert.strictEqual(d.marker, `${targetStem}=PASS`);
assert.strictEqual(d.result, `PASS_${targetStem}`);
assert.strictEqual(d.parent_program, "PROG-400");
assert.strictEqual(d.parent_commit, parentCommit);
assert.strictEqual(d.parent_manifest, "evidence/authorization/20261012_HBCE_PROG_400_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_v001.json");
assert.strictEqual(d.parent_manifest_sha256, parentManifestSha256);
assert.strictEqual(d.selected_axis, "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY");
assert.strictEqual(d.selected_source_false_key, sourceFalseKey);
assert.strictEqual(d.selected_source_false_key_role, "EXISTING_PARENT_FALSE_KEY_NOT_NEW_FALSE_KEY");
assert.strictEqual(d.selected_boundary, boundary);

assert.strictEqual(d.source_chain_entry_count, 119);
assert.strictEqual(d.field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d.boundary_rule_count, 172);
assert.strictEqual(d.future_resolution_requirement_count, 1609);
assert.strictEqual(d.required_non_claim_count, 36825);
assert.strictEqual(d.required_no_execution_boundary_count, 25920);
assert.strictEqual(d.false_claim_property_count, 14359);
assert.strictEqual(d.false_key_count, 615);
assert.strictEqual(d.new_false_key_count, 18);
assert.strictEqual(d.required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_field_count, 24);

assert.strictEqual(d.manifest_path, manifestPath);
assert.strictEqual(d.validator_path, "tools/evidence/validate-prog-401-regulatory-approval-conformance-ready-conformance-ready-conformance-ready-conformance-binding-draft.js");
assert.strictEqual(d.target_branch, "prog/401-regulatory-approval-conformance-ready-conformance-ready-conformance-ready-conformance-binding-draft");
assert.strictEqual(d.release_tag, "hbce-prog-401-regulatory-approval-conformance-ready-conformance-ready-conformance-ready-conformance-binding-draft-v001");
assert.strictEqual(d.release_title, "PROG-401 Deployment Independent Attestation Verified Realized Benefit Customer Acceptance Regulatory Acceptance Regulatory Approval Conformance Ready Conformance Ready Conformance Ready Conformance Binding Draft v001");
assert.strictEqual(d.release_url, "https://github.com/manuelcoletta1-source/hermeticum-bce-platform/releases/tag/hbce-prog-401-regulatory-approval-conformance-ready-conformance-ready-conformance-ready-conformance-binding-draft-v001");

assert.deepStrictEqual(d[`new_${sourceFalseKey}_false_keys`], newFalseKeys);
assert.deepStrictEqual(d[`future_customer_decision_proof_${sourceFalseKey}_false_keys`], newFalseKeys);
assert.deepStrictEqual(d[`${fieldPrefix}_boundary_rules`], boundaryRules);
assert.deepStrictEqual(d[`required_${fieldPrefix}_fields`], requiredFields);

assert.strictEqual(d[sourceFalseKey], false);
assert.strictEqual(d[`${fieldPrefix}_conformance_ready`], false);
assert.strictEqual(d[`${fieldPrefix}_created`], false);
assert.strictEqual(d[`${fieldPrefix}_final`], false);
assert.strictEqual(d.regulatory_approval_created, false);
assert.strictEqual(d.regulatory_clearance_created, false);
assert.strictEqual(d.customer_acceptance_created, false);
assert.strictEqual(d.customer_approval_created, false);
assert.strictEqual(d.opc_allow, false);
assert.strictEqual(d.matrix_effective_state_updated, false);
assert.strictEqual(d.runtime_deletion_executed, false);
assert.strictEqual(d.data_erasure_executed, false);

for (const key of newFalseKeys) {
  assert.strictEqual(d[key], false);
}

for (const key of requiredFields) {
  assert.strictEqual(d[key], null);
}

assert.strictEqual(d.result_assertion, "PASS_PROG_401_MANIFEST_PENDING_VALIDATOR");

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
  required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_field_count: d.required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_field_count,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready: d[`${fieldPrefix}_conformance_ready`],
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_created: d[`${fieldPrefix}_created`],
  regulatory_approval_created: d.regulatory_approval_created,
  regulatory_clearance_created: d.regulatory_clearance_created,
  customer_acceptance_created: d.customer_acceptance_created,
  customer_approval_created: d.customer_approval_created,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  data_erasure_executed: d.data_erasure_executed,
  manifest_sha256: sha,
  result_assertion: "PASS_PROG_401_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));

console.log("PROG_401_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
