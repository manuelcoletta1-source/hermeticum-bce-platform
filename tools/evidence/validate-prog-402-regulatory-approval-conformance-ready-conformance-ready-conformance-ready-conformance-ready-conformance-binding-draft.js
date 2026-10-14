#!/usr/bin/env node
"use strict";

const fs = require("fs");
const crypto = require("crypto");

const manifestPath = process.argv[2] || "evidence/authorization/20261013_HBCE_PROG_402_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_v001.json";

const EXPECTED = {
  object_id: "HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CUSTOMER-ACCEPTANCE-REGULATORY-ACCEPTANCE-REGULATORY-APPROVAL-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-BINDING-DRAFT-V001",
  program: "PROG-402",
  status: "ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT",
  marker: "ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT=PASS",
  result: "PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT",
  parent_program: "PROG-401",
  parent_commit: "22ed159024627506f87d27cfae9304767cf728d1",
  parent_manifest: "evidence/authorization/20261013_HBCE_PROG_401_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_v001.json",
  parent_manifest_sha256: "a7a348b13ede2c3273ebb528221c529d8620c5f69348379f0dcc94b1d7e4cedc",
  selected_axis: "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY",
  selected_source_false_key: "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready",
  selected_source_false_key_role: "EXISTING_PARENT_FALSE_KEY_NOT_NEW_FALSE_KEY",
  selected_boundary: "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY.",
  source_chain_entry_count: 120,
  field_count: 152,
  binding_rule_count: 152,
  boundary_rule_count: 195,
  future_resolution_requirement_count: 1651,
  required_non_claim_count: 36889,
  required_no_execution_boundary_count: 25933,
  false_claim_property_count: 14423,
  false_key_count: 633,
  new_false_key_count: 18,
  required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count: 24,
  manifest_path: "evidence/authorization/20261013_HBCE_PROG_402_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_v001.json",
  source_assertion: "PROG401_PARENT_FALSE_KEY_PRESENT_AND_FALSE",
  boundary_assertion: "REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT_IS_NOT_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY",
  result_assertion: "PASS_PROG_402_VALIDATOR_ACTIVE_MANIFEST"
};

const expectedFalseBooleans = [
  EXPECTED.selected_source_false_key,
  "regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready",
  "regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created",
  "regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready",
  "regulatory_approval_created",
  "regulatory_clearance_created",
  "customer_acceptance_created",
  "customer_approval_created",
  "opc_allow",
  "matrix_effective_state_updated",
  "runtime_deletion_executed",
  "data_erasure_executed"
];

const expectedNewFalseKeys = [
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_approved",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_accepted",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_authorized",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_executed",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_implemented",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_active",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_effective",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_binding",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_certified",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_verified",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_recognized",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_cleared",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_validated",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_deployed",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_released",
  "deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_closed"
];

let failed = false;

function fail(message) {
  console.error(`PROG_402_VALIDATOR_ERROR=${message}`);
  failed = true;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    fail(`${label}: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`);
  }
}

function assertFalse(value, label) {
  if (value !== false) {
    fail(`${label}: expected false got ${JSON.stringify(value)}`);
  }
}

try {
  const text = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(text);
  const manifestSha256 = crypto.createHash("sha256").update(text).digest("hex");

  for (const [key, value] of Object.entries(EXPECTED)) {
    assertEqual(manifest[key], value, key);
  }

  for (const key of expectedFalseBooleans) {
    assertFalse(manifest[key], key);
  }

  const newFalseKeyArrayName = "new_deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_false_keys";
  if (!Array.isArray(manifest[newFalseKeyArrayName])) {
    fail(`${newFalseKeyArrayName}: expected array`);
  } else {
    assertEqual(manifest[newFalseKeyArrayName].length, expectedNewFalseKeys.length, `${newFalseKeyArrayName}.length`);
    for (let i = 0; i < expectedNewFalseKeys.length; i += 1) {
      assertEqual(manifest[newFalseKeyArrayName][i], expectedNewFalseKeys[i], `${newFalseKeyArrayName}[${i}]`);
      assertFalse(manifest[expectedNewFalseKeys[i]], expectedNewFalseKeys[i]);
    }
  }

  if (Array.isArray(manifest.source_chain)) {
    const last = manifest.source_chain[manifest.source_chain.length - 1];
    assertEqual(last.program, "PROG-402", "source_chain.last.program");
    assertEqual(last.parent_program, "PROG-401", "source_chain.last.parent_program");
    assertEqual(last.parent_commit, EXPECTED.parent_commit, "source_chain.last.parent_commit");
    assertEqual(last.selected_axis, EXPECTED.selected_axis, "source_chain.last.selected_axis");
    assertEqual(last.selected_source_false_key, EXPECTED.selected_source_false_key, "source_chain.last.selected_source_false_key");
    assertEqual(last.selected_boundary, EXPECTED.selected_boundary, "source_chain.last.selected_boundary");
  }

  if (!failed) {
    console.log(JSON.stringify({
      object_id: manifest.object_id,
      program: manifest.program,
      status: manifest.status,
      marker: manifest.marker,
      result: manifest.result,
      parent_program: manifest.parent_program,
      parent_commit: manifest.parent_commit,
      selected_axis: manifest.selected_axis,
      selected_source_false_key: manifest.selected_source_false_key,
      selected_source_false_key_role: manifest.selected_source_false_key_role,
      selected_boundary: manifest.selected_boundary,
      source_chain_entry_count: manifest.source_chain_entry_count,
      field_count: manifest.field_count,
      binding_rule_count: manifest.binding_rule_count,
      boundary_rule_count: manifest.boundary_rule_count,
      future_resolution_requirement_count: manifest.future_resolution_requirement_count,
      required_non_claim_count: manifest.required_non_claim_count,
      required_no_execution_boundary_count: manifest.required_no_execution_boundary_count,
      false_claim_property_count: manifest.false_claim_property_count,
      false_key_count: manifest.false_key_count,
      new_false_key_count: manifest.new_false_key_count,
      required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count: manifest.required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count,
      regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready: manifest.regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready,
      regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created: manifest.regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created,
      regulatory_approval_created: manifest.regulatory_approval_created,
      regulatory_clearance_created: manifest.regulatory_clearance_created,
      customer_acceptance_created: manifest.customer_acceptance_created,
      customer_approval_created: manifest.customer_approval_created,
      opc_allow: manifest.opc_allow,
      matrix_effective_state_updated: manifest.matrix_effective_state_updated,
      runtime_deletion_executed: manifest.runtime_deletion_executed,
      data_erasure_executed: manifest.data_erasure_executed,
      manifest_sha256: manifestSha256,
      result_assertion: manifest.result_assertion
    }, null, 2));
  }
} catch (error) {
  fail(error.message);
}

if (failed) {
  process.exitCode = 1;
}
