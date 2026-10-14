#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');

const manifestPath = process.argv[2];

const EXPECTED = {
  object_id: 'HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CUSTOMER-ACCEPTANCE-REGULATORY-ACCEPTANCE-REGULATORY-APPROVAL-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-BINDING-DRAFT-V001',
  program: 'PROG-403',
  status: 'ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT',
  marker: 'ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT=PASS',
  result: 'PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT',
  parent_program: 'PROG-402',
  parent_commit: 'a3040b2198363e69d615cb1a12b2f80143c3b2a2',
  selected_axis: 'REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY',
  selected_source_false_key: 'deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready',
  selected_source_false_key_role: 'EXISTING_PARENT_FALSE_KEY_NOT_NEW_FALSE_KEY',
  selected_boundary: 'REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY.',
  source_chain_entry_count: 121,
  field_count: 152,
  binding_rule_count: 152,
  boundary_rule_count: 218,
  future_resolution_requirement_count: 1693,
  required_non_claim_count: 36953,
  required_no_execution_boundary_count: 25946,
  false_claim_property_count: 14487,
  false_key_count: 651,
  new_false_key_count: 18,
  required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count: 24,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready: false,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created: false,
  regulatory_approval_created: false,
  regulatory_clearance_created: false,
  customer_acceptance_created: false,
  customer_approval_created: false,
  opc_allow: false,
  matrix_effective_state_updated: false,
  runtime_deletion_executed: false,
  data_erasure_executed: false,
  result_assertion: 'PASS_PROG_403_VALIDATOR_ACTIVE_MANIFEST'
};

const EXPECTED_MANIFEST_SHA256 = '1c97a516a5631696d097356af5bc656bb99cceccdea3ae9276aeb62f242b3060';

function fail(code, message) {
  console.error(JSON.stringify({ ok: false, code, message }, null, 2));
  process.exit(1);
}

if (!manifestPath) {
  fail('PROG_403_MANIFEST_PATH_MISSING', 'Usage: validate-prog-403 <manifest.json>');
}

if (!fs.existsSync(manifestPath)) {
  fail('PROG_403_MANIFEST_NOT_FOUND', manifestPath);
}

const raw = fs.readFileSync(manifestPath);
const manifestSha256 = crypto.createHash('sha256').update(raw).digest('hex');

if (manifestSha256 !== EXPECTED_MANIFEST_SHA256) {
  fail('PROG_403_MANIFEST_SHA256_INVALID', `Expected ${EXPECTED_MANIFEST_SHA256}, got ${manifestSha256}`);
}

let manifest;
try {
  manifest = JSON.parse(raw.toString('utf8'));
} catch (error) {
  fail('PROG_403_MANIFEST_JSON_INVALID', error.message);
}

for (const [key, expectedValue] of Object.entries(EXPECTED)) {
  if (!Object.prototype.hasOwnProperty.call(manifest, key)) {
    fail('PROG_403_FIELD_MISSING', key);
  }
  if (manifest[key] !== expectedValue) {
    fail('PROG_403_FIELD_INVALID', `${key}: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(manifest[key])}`);
  }
}

if (Object.prototype.hasOwnProperty.call(manifest, 'manifest_sha256')) {
  fail('PROG_403_MANIFEST_SHA256_FIELD_FORBIDDEN', 'manifest_sha256 must be validator-derived, not manifest-embedded');
}

if (Object.prototype.hasOwnProperty.call(manifest, 'manifest_path')) {
  fail('PROG_403_MANIFEST_PATH_FIELD_FORBIDDEN', 'manifest_path must be validator-derived, not manifest-embedded');
}

const forbiddenTruths = [
  'regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready',
  'regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created',
  'regulatory_approval_created',
  'regulatory_clearance_created',
  'customer_acceptance_created',
  'customer_approval_created',
  'opc_allow',
  'matrix_effective_state_updated',
  'runtime_deletion_executed',
  'data_erasure_executed'
];

for (const key of forbiddenTruths) {
  if (manifest[key] !== false) {
    fail('PROG_403_FALSE_CLAIM_PROPERTY_INVALID', `${key} must remain false`);
  }
}

const output = {
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
  required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count: manifest.required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready: manifest.regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created: manifest.regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created,
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
};

console.log(JSON.stringify(output, null, 2));
console.log('PROG_403_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS');
