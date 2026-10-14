#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');

const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error(JSON.stringify({
    ok: false,
    code: 'PROG_404_MANIFEST_PATH_MISSING',
    message: 'Usage: validate-prog-404 <manifest.json>'
  }, null, 2));
  process.exit(1);
}

const EXPECTED = {
  object_id: 'HBCE-ENDPOINT-CUSTOMER-EVIDENCE-DISPUTE-DISPOSAL-CUSTOMER-DECISION-PROOF-DEPLOYMENT-INDEPENDENT-ATTESTATION-VERIFIED-REALIZED-BENEFIT-CUSTOMER-ACCEPTANCE-REGULATORY-ACCEPTANCE-REGULATORY-APPROVAL-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-READY-CONFORMANCE-BINDING-DRAFT-V001',
  program: 'PROG-404',
  status: 'ACTIVE_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT',
  marker: 'ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT=PASS',
  result: 'PASS_ENDPOINT_CUSTOMER_EVIDENCE_DISPUTE_DISPOSAL_CUSTOMER_DECISION_PROOF_DEPLOYMENT_INDEPENDENT_ATTESTATION_VERIFIED_REALIZED_BENEFIT_CUSTOMER_ACCEPTANCE_REGULATORY_ACCEPTANCE_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT',
  parent_program: 'PROG-403',
  parent_commit: '64a31b22d2d51071b3beb1a0879c21f9df275957',
  selected_axis: 'REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY',
  selected_source_false_key: 'deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready',
  selected_source_false_key_role: 'NEW_FALSE_KEY_REQUIRED_IN_PROG404',
  selected_boundary: 'REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_DRAFT != REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY.',
  source_chain_entry_count: 122,
  field_count: 152,
  binding_rule_count: 152,
  boundary_rule_count: 241,
  future_resolution_requirement_count: 1735,
  required_non_claim_count: 37017,
  required_no_execution_boundary_count: 25959,
  false_claim_property_count: 14551,
  false_key_count: 669,
  new_false_key_count: 18,
  required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count: 24,
  deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready: false,
  deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created: false,
  regulatory_approval_created: false,
  regulatory_clearance_created: false,
  customer_acceptance_created: false,
  customer_approval_created: false,
  opc_allow: false,
  matrix_effective_state_updated: false,
  runtime_deletion_executed: false,
  data_erasure_executed: false
};

const EXPECTED_MANIFEST_SHA256 = 'c84336ddc388b22e2ba05ce20285f3863efd7f3f2ff3e8e5d99f7df0fb6f01c3';

const raw = fs.readFileSync(manifestPath);
const manifestSha256 = crypto.createHash('sha256').update(raw).digest('hex');
const d = JSON.parse(raw.toString('utf8'));

const errors = [];
for (const [key, expected] of Object.entries(EXPECTED)) {
  const actual = d[key];
  if (actual !== expected) {
    errors.push({
      code: `PROG_404_${key.toUpperCase()}_INVALID`,
      key,
      expected,
      actual
    });
  }
}

if (manifestSha256 !== EXPECTED_MANIFEST_SHA256) {
  errors.push({
    code: 'PROG_404_MANIFEST_SHA256_INVALID',
    expected: EXPECTED_MANIFEST_SHA256,
    actual: manifestSha256
  });
}

if (errors.length > 0) {
  console.error(JSON.stringify({
    ok: false,
    program: 'PROG-404',
    error_count: errors.length,
    errors
  }, null, 2));
  process.exit(1);
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
  field_count: d.field_count,
  binding_rule_count: d.binding_rule_count,
  boundary_rule_count: d.boundary_rule_count,
  future_resolution_requirement_count: d.future_resolution_requirement_count,
  required_non_claim_count: d.required_non_claim_count,
  required_no_execution_boundary_count: d.required_no_execution_boundary_count,
  false_claim_property_count: d.false_claim_property_count,
  false_key_count: d.false_key_count,
  new_false_key_count: d.new_false_key_count,
  required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count: d.required_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_field_count,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready: d.deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready,
  regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created: d.deployment_independent_attestation_verified_realized_benefit_customer_acceptance_regulatory_acceptance_regulatory_approval_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_conformance_ready_created,
  regulatory_approval_created: d.regulatory_approval_created,
  regulatory_clearance_created: d.regulatory_clearance_created,
  customer_acceptance_created: d.customer_acceptance_created,
  customer_approval_created: d.customer_approval_created,
  opc_allow: d.opc_allow,
  matrix_effective_state_updated: d.matrix_effective_state_updated,
  runtime_deletion_executed: d.runtime_deletion_executed,
  data_erasure_executed: d.data_erasure_executed,
  manifest_sha256: manifestSha256,
  result_assertion: 'PASS_PROG_404_VALIDATOR_ACTIVE_MANIFEST'
}, null, 2));

console.log('PROG_404_REGULATORY_APPROVAL_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_READY_CONFORMANCE_BINDING_DRAFT_VALIDATOR=PASS');
