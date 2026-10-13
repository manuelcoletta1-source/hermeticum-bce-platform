#!/usr/bin/env node
"use strict";

const fs = require("fs");
const crypto = require("crypto");
const assert = require("assert");

const manifestPath = process.argv[2];

if (!manifestPath) {
  console.error("Usage: validate-prog-398-...js <manifest.json>");
  process.exitCode = 2;
} else {
  const EXPECTED_OBJECT_ID =
    "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CUSTOMER-ACCEPTANCE-REGULATORY-ACCEPTANCE-REGULATORY-APPROVAL-CONFORMANCE-BINDING-DRAFT-V001";

  const EXPECTED_STEM =
    "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_BINDING_DRAFT";

  const EXPECTED_ACTIVE_SHA =
    "5e824b9af9feec3b1bbaf0925f96fa468e4857355f09e4e07a3a3f30a8b67347";

  const EXPECTED_PARENT_COMMIT =
    "fab4cb2f991558c04a6374644306bec612f14c2f";

  const EXPECTED_PARENT_MANIFEST_SHA =
    "8448cb7685bbbf1105ef00bf09d49e7f48bfd51eea695bc184a393dee7e0b929";

  const EXPECTED_PARENT_VALIDATOR_SHA =
    "823b58440a6e940b000210a917607b9599be9698ef4035ba300dc44ffe74e5c5";

  const raw = fs.readFileSync(manifestPath);
  const sha = crypto.createHash("sha256").update(raw).digest("hex");
  const d = JSON.parse(raw.toString("utf8"));

  const stemLower = EXPECTED_STEM.toLowerCase();

  const fieldCountName = `required_${stemLower}_field_count`;
  const fieldsName = `required_${stemLower}_fields`;

  const boundaryName =
    "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_boundary_rules";
  const boundaryCountName =
    "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_boundary_rule_count";

  const falseKeysName =
    "future_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_false_keys";
  const falseKeyCountName =
    "future_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_false_key_count";

  const newFalseKeysName =
    "new_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_false_keys";
  const newFalseKeyCountName =
    "new_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_false_key_count";

  const requiredApprovalFieldsName =
    "required_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_fields";
  const requiredApprovalFieldCountName =
    "required_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_field_count";

  const boundaryStatementName =
    "endpoint_customer_evidence_dispute_disposal_customer_decision_proof_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_boundary_statement";

  assert.strictEqual(sha, EXPECTED_ACTIVE_SHA);
  assert.strictEqual(d.schema, "HBCE_AUTHORIZATION_EVIDENCE_MANIFEST_V1");
  assert.strictEqual(d.program, "PROG-398");
  assert.strictEqual(d.object_id, EXPECTED_OBJECT_ID);
  assert.strictEqual(d.stem, EXPECTED_STEM);
  assert.strictEqual(d.status, `ACTIVE_${EXPECTED_STEM}`);
  assert.strictEqual(d.marker, `${EXPECTED_STEM}=PASS`);
  assert.strictEqual(d.result, `PASS_${EXPECTED_STEM}`);
  assert.strictEqual(d.result_assertion, "PASS_PROG_398_STEP_4_PROMOTE_TO_PASS");
  assert.strictEqual(d.final_audit_marker, `HBCE_${EXPECTED_STEM}_FINAL_AUDIT=1`);

  assert.strictEqual(d.parent_program, "PROG-397");
  assert.strictEqual(d.parent_commit, EXPECTED_PARENT_COMMIT);
  assert.strictEqual(d.basis_main_commit, EXPECTED_PARENT_COMMIT);
  assert.strictEqual(d.parent_manifest_sha256, EXPECTED_PARENT_MANIFEST_SHA);
  assert.strictEqual(d.parent_validator_sha256, EXPECTED_PARENT_VALIDATOR_SHA);

  assert.strictEqual(d.selected_axis, "REGULATORY_APPROVAL");
  assert.strictEqual(
    d.selected_source_false_key,
    "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_created"
  );
  assert.strictEqual(d.selected_source_false_key_role, "EXISTING_PARENT_FALSE_KEY_NOT_NEW_FALSE_KEY");
  assert.strictEqual(d.selected_boundary, "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != REGULATORY_APPROVAL.");

  assert.strictEqual(d.parent_source_chain_entry_count, 115);
  assert.strictEqual(d.source_chain_entry_count, 116);
  assert(Array.isArray(d.source_chain_entries));
  assert.strictEqual(d.source_chain_entries.length, 116);

  const lastEntry = d.source_chain_entries[d.source_chain_entries.length - 1];
  assert.strictEqual(lastEntry.program, "PROG-398");
  assert.strictEqual(lastEntry.object_id, EXPECTED_OBJECT_ID);
  assert.strictEqual(lastEntry.axis, "REGULATORY_APPROVAL");
  assert.strictEqual(lastEntry.source_false_key, d.selected_source_false_key);
  assert.strictEqual(lastEntry.source_false_key_role, "EXISTING_PARENT_FALSE_KEY_NOT_NEW_FALSE_KEY");
  assert.strictEqual(lastEntry.parent_program, "PROG-397");
  assert.strictEqual(lastEntry.parent_commit, EXPECTED_PARENT_COMMIT);
  assert.strictEqual(lastEntry.status, `ACTIVE_${EXPECTED_STEM}`);
  assert.strictEqual(lastEntry.marker, `${EXPECTED_STEM}=PASS`);
  assert.strictEqual(lastEntry.result, `PASS_${EXPECTED_STEM}`);

  assert.strictEqual(d[fieldCountName], 152);
  assert.strictEqual(d.field_count, 152);
  assert(Array.isArray(d[fieldsName]));
  assert.strictEqual(d[fieldsName].length, 152);

  assert.strictEqual(d.binding_rule_count, 152);
  assert(Array.isArray(d.binding_rules));
  assert.strictEqual(d.binding_rules.length, 152);

  assert.strictEqual(d[boundaryCountName], 105);
  assert(Array.isArray(d[boundaryName]));
  assert.strictEqual(d[boundaryName].length, 105);

  assert.strictEqual(d.future_resolution_requirement_count, 1483);
  assert(Array.isArray(d.future_resolution_requirements));
  assert.strictEqual(d.future_resolution_requirements.length, 1483);

  assert.strictEqual(d.required_non_claim_count, 36633);
  assert(Array.isArray(d.required_non_claim_properties));
  assert.strictEqual(d.required_non_claim_properties.length, 36633);

  assert.strictEqual(d.required_no_execution_boundary_count, 25881);
  assert(Array.isArray(d.required_no_execution_boundary_properties));
  assert.strictEqual(d.required_no_execution_boundary_properties.length, 25881);

  assert.strictEqual(d.false_claim_property_count, 14167);
  assert(Array.isArray(d.false_claim_properties));
  assert.strictEqual(d.false_claim_properties.length, 14167);

  assert.strictEqual(d[falseKeyCountName], 561);
  assert(Array.isArray(d[falseKeysName]));
  assert.strictEqual(d[falseKeysName].length, 561);

  assert.strictEqual(d[newFalseKeyCountName], 18);
  assert(Array.isArray(d[newFalseKeysName]));
  assert.strictEqual(d[newFalseKeysName].length, 18);

  assert.strictEqual(d[requiredApprovalFieldCountName], 24);
  assert(Array.isArray(d[requiredApprovalFieldsName]));
  assert.strictEqual(d[requiredApprovalFieldsName].length, 24);

  assert(!d[newFalseKeysName].includes(d.selected_source_false_key));

  for (const key of d[falseKeysName]) {
    assert.strictEqual(d[key], false, `FALSE_KEY_NOT_FALSE: ${key}`);
  }

  for (const field of d[requiredApprovalFieldsName]) {
    assert.strictEqual(d[field], null, `REQUIRED_APPROVAL_FIELD_NOT_NULL: ${field}`);
  }

  for (const key of [
    "regulatory_approval_conformance_ready",
    "regulatory_approval_conformance_created",
    "regulatory_approval_conformance_registered",
    "regulatory_approval_conformance_effective",
    "regulatory_approval_conformance_final",
    "regulatory_approval_created",
    "regulatory_approval_registered",
    "regulatory_approval_effective",
    "regulatory_clearance_created",
    "regulatory_signoff_created",
    "regulatory_filing_acceptance_created",
    "supervisory_non_objection_created",
    "customer_acceptance_created",
    "customer_approval_created",
    "customer_legal_acceptance_created",
    "regulator_authority_verified",
    "opc_allow",
    "matrix_effective_state_updated",
    "runtime_deletion_executed",
    "runtime_destruction_executed",
    "data_destruction_executed",
    "data_erasure_executed"
  ]) {
    assert.strictEqual(d[key], false, `FLAG_NOT_FALSE: ${key}`);
  }

  assert.strictEqual(
    d[boundaryStatementName],
    "Regulatory approval conformance binding draft is an authorization evidence boundary only. It does not create regulatory approval, regulatory clearance, regulatory signoff, customer approval, OPC ALLOW, Matrix effective state update, runtime deletion, runtime destruction, data destruction, or data erasure."
  );

  const boundaryText = [
    d[boundaryStatementName],
    ...(d[boundaryName] || [])
  ].filter(Boolean).join("\n");

  for (const fragment of [
    "Regulatory approval conformance draft does not imply actual regulatory approval.",
    "Regulatory approval conformance draft does not imply regulatory clearance, regulatory signoff, filing acceptance, supervisory non-objection, or regulator endorsement.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != REGULATORY_APPROVAL.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != REGULATORY_CLEARANCE.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != REGULATORY_SIGNOFF.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != CUSTOMER_ACCEPTANCE.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != CUSTOMER_APPROVAL.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != OPC_ALLOW.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != MATRIX_EFFECTIVE_STATE_UPDATE.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != RUNTIME_DELETION.",
    "REGULATORY_APPROVAL_CONFORMANCE_DRAFT != DATA_ERASURE.",
    "UNKNOWN_OR_INSUFFICIENT_EVIDENCE_PRECEDES_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CLAIMS."
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
    parent_commit: d.parent_commit,
    selected_axis: d.selected_axis,
    selected_source_false_key: d.selected_source_false_key,
    selected_source_false_key_role: d.selected_source_false_key_role,
    selected_boundary: d.selected_boundary,
    source_chain_entry_count: d.source_chain_entry_count,
    field_count: d[fieldCountName],
    binding_rule_count: d.binding_rule_count,
    deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_boundary_rule_count: d[boundaryCountName],
    future_resolution_requirement_count: d.future_resolution_requirement_count,
    required_non_claim_count: d.required_non_claim_count,
    required_no_execution_boundary_count: d.required_no_execution_boundary_count,
    false_claim_property_count: d.false_claim_property_count,
    deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_false_key_count: d[falseKeyCountName],
    new_false_key_count: d[newFalseKeyCountName],
    required_regulatory_approval_field_count: d[requiredApprovalFieldCountName],
    regulatory_approval_conformance_ready: d.regulatory_approval_conformance_ready,
    regulatory_approval_created: d.regulatory_approval_created,
    regulatory_clearance_created: d.regulatory_clearance_created,
    customer_acceptance_created: d.customer_acceptance_created,
    customer_approval_created: d.customer_approval_created,
    opc_allow: d.opc_allow,
    matrix_effective_state_updated: d.matrix_effective_state_updated,
    runtime_deletion_executed: d.runtime_deletion_executed,
    data_erasure_executed: d.data_erasure_executed,
    manifest_sha256: sha,
    result_assertion: "PASS_PROG_398_VALIDATOR_ACTIVE_MANIFEST"
  }, null, 2));

  console.log("PROG_398_REGULATORY_APPROVAL_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS");
}
