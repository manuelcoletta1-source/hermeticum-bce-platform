#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const manifestPath = process.argv[2];

if (!manifestPath) {
  throw new Error("USAGE: validate-prog-399-regulatory-approval-conformance-ready-conformance-binding-draft.js <manifest.json>");
}

const text = fs.readFileSync(manifestPath, "utf8");
const d = JSON.parse(text);
const manifestSha256 = crypto.createHash("sha256").update(text).digest("hex");

const objectId = "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CUSTOMER-ACCEPTANCE-REGULATORY-ACCEPTANCE-REGULATORY-APPROVAL-CONFORMANCE-READY-CONFORMANCE-BINDING-DRAFT-V001";
const stem = "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT";
const lowerStem = "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready";
const sourceFalseKey = "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready";

const boundaryRulesName = `${lowerStem}_boundary_rules`;
const falseKeysName = `future_customer_decision_proof_${lowerStem}_false_keys`;
const newFalseKeysName = `new_${lowerStem}_false_keys`;
const requiredFieldsName = `required_${lowerStem}_fields`;

const expectedNewFalseKeys = [
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

const requiredFields = [
  "regulatory_approval_conformance_ready_evidence_ref",
  "regulatory_approval_conformance_ready_evidence_sha256",
  "regulatory_approval_conformance_ready_actor_ref",
  "regulatory_approval_conformance_ready_actor_authority_ref",
  "regulatory_approval_conformance_ready_actor_authority_sha256",
  "regulatory_approval_conformance_ready_intent_ref",
  "regulatory_approval_conformance_ready_intent_sha256",
  "regulatory_approval_conformance_ready_scope_ref",
  "regulatory_approval_conformance_ready_scope_sha256",
  "regulatory_approval_conformance_ready_terms_ref",
  "regulatory_approval_conformance_ready_terms_sha256",
  "regulatory_approval_conformance_ready_receipt_ref",
  "regulatory_approval_conformance_ready_receipt_sha256",
  "regulatory_approval_conformance_ready_signature_ref",
  "regulatory_approval_conformance_ready_signature_sha256",
  "regulatory_approval_conformance_ready_timestamp_ref",
  "regulatory_approval_conformance_ready_timestamp_sha256",
  "regulatory_approval_conformance_ready_revocation_policy_ref",
  "regulatory_approval_conformance_ready_revocation_policy_sha256",
  "regulatory_approval_conformance_ready_dispute_policy_ref",
  "regulatory_approval_conformance_ready_dispute_policy_sha256",
  "regulatory_approval_conformance_ready_conformance_record_ref",
  "regulatory_approval_conformance_ready_conformance_record_sha256",
  "regulatory_approval_conformance_ready_audit_record_sha256"
];

const expectedBoundaryInclusions = [
  "Regulatory Approval Conformance draft does not imply Regulatory Approval Conformance Ready Conformance.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_DRAFT != OPC_ALLOW.",
  "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_DRAFT != DATA_ERASURE.",
  "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CLAIMS."
];

assert.strictEqual(d.object_id, objectId);
assert.strictEqual(d.program, "PROG-399");
assert.strictEqual(d.status, `ACTIVE_${stem}`);
assert.strictEqual(d.marker, `${stem}=PASS`);
assert.strictEqual(d.result, `PASS_${stem}`);
assert.strictEqual(d.result_assertion, "PASS_PROG_399_STEP_5_PROMOTE_ACTIVE_MANIFEST_SHORT_NAME");
assert.strictEqual(d.parent_program, "PROG-398");
assert.strictEqual(d.parent_commit, "03bce3bc97a073781280375ee86a3443d647c079");
assert.strictEqual(d.parent_manifest_sha256, "5e824b9af9feec3b1bbaf0925f96fa468e4857355f09e4e07a3a3f30a8b67347");
assert.strictEqual(d.parent_validator_sha256, "09ea3a442734d5b6da7bc586894bf1ead1af2c050549318909bea5ea84706a39");
assert.strictEqual(d.selected_axis, "REGULATORY_APPROVAL_CONFORMANCE_READY");
assert.strictEqual(d.selected_source_false_key, sourceFalseKey);
assert.strictEqual(d.selected_source_false_key_role, "EXISTING_PARENT_FALSE_KEY_NOT_NEW_FALSE_KEY");
assert.strictEqual(d.selected_boundary, "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY.");

assert.strictEqual(d.parent_source_chain_entry_count, 116);
assert.strictEqual(d.source_chain_entry_count, 117);
assert.strictEqual(d.field_count, 152);
assert.strictEqual(d.binding_rule_count, 152);
assert.strictEqual(d[`${lowerStem}_boundary_rule_count`], 127);
assert.strictEqual(d.future_resolution_requirement_count, 1525);
assert.strictEqual(d.required_non_claim_count, 36697);
assert.strictEqual(d.required_no_execution_boundary_count, 25894);
assert.strictEqual(d.false_claim_property_count, 14231);
assert.strictEqual(d[`future_customer_decision_proof_${lowerStem}_false_key_count`], 579);
assert.strictEqual(d[`${lowerStem}_false_key_count`], 579);
assert.strictEqual(d[`new_${lowerStem}_false_key_count`], 18);
assert.strictEqual(d[`required_${lowerStem}_field_count`], 24);
assert.strictEqual(d.required_regulatory_approval_conformance_ready_field_count, 24);
assert.strictEqual(d.new_false_key_count, 18);

assert(Array.isArray(d[boundaryRulesName]));
assert(Array.isArray(d[falseKeysName]));
assert(Array.isArray(d[newFalseKeysName]));
assert(Array.isArray(d[requiredFieldsName]));
assert.strictEqual(d[boundaryRulesName].length, 127);
assert.strictEqual(d[falseKeysName].length, 579);
assert.strictEqual(d[newFalseKeysName].length, 18);
assert.strictEqual(d[requiredFieldsName].length, 24);

for (const key of expectedNewFalseKeys) {
  assert(d[newFalseKeysName].includes(key), `MISSING_NEW_FALSE_KEY: ${key}`);
  assert(d[falseKeysName].includes(key), `MISSING_FALSE_KEY: ${key}`);
  assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
}

for (const field of requiredFields) {
  assert(d[requiredFieldsName].includes(field), `MISSING_REQUIRED_FIELD: ${field}`);
  assert.strictEqual(d[field], null, `REQUIRED_FIELD_NOT_NULL: ${field}`);
}

for (const boundary of expectedBoundaryInclusions) {
  assert(d[boundaryRulesName].includes(boundary), `MISSING_BOUNDARY: ${boundary}`);
}

assert.strictEqual(d.regulatory_approval_conformance_ready, false);
assert.strictEqual(d.regulatory_approval_conformance_ready_conformance_ready, false);
assert.strictEqual(d.regulatory_approval_conformance_ready_conformance_created, false);
assert.strictEqual(d.regulatory_approval_created, false);
assert.strictEqual(d.regulatory_clearance_created, false);
assert.strictEqual(d.customer_acceptance_created, false);
assert.strictEqual(d.customer_approval_created, false);
assert.strictEqual(d.opc_allow, false);
assert.strictEqual(d.matrix_effective_state_updated, false);
assert.strictEqual(d.runtime_deletion_executed, false);
assert.strictEqual(d.data_erasure_executed, false);

assert.strictEqual(d.manifest_path, "evidence/authorization/20261012_HBCE_PROG_399_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_v001.json");

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
  boundary_rule_count: d[`${lowerStem}_boundary_rule_count`],
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  false_key_count: d[`future_customer_decision_proof_${lowerStem}_false_key_count`],
  new_false_key_count: d[`new_${lowerStem}_false_key_count`],
  required_regulatory_approval_conformance_ready_field_count: d.required_regulatory_approval_conformance_ready_field_count,
  manifest_path: d.manifest_path,
  manifest_sha256: manifestSha256,
  result_assertion: "PASS_PROG_399_VALIDATOR_ACTIVE_MANIFEST"
}, null, 2));
console.log("PROG_399_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
