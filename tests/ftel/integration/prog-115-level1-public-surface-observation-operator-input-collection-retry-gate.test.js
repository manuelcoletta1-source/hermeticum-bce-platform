'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredInputs,
  buildObservationOperatorInputCollectionRetryGatePayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionRetryGate
} = require('../../../runtime/level1/build-prog-115-level1-public-surface-observation-operator-input-collection-retry-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-115-level1-public-surface-observation-operator-input-collection-retry-gate.json';
const mdPath = 'docs/launch/level1/prog-115-level1-public-surface-observation-operator-input-collection-retry-gate.md';
const runtimePath = 'runtime/level1/build-prog-115-level1-public-surface-observation-operator-input-collection-retry-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-115-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE');
assert.equal(doc.issue_id, 'PROG-115');
assert.equal(doc.level1_public_surface_observation_operator_input_collection_retry_gate_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_collection_execution_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_collection_execution_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputCollectionRetryGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationOperatorInputCollectionRetryGatePayload(source);
const gate = doc.public_surface_observation_operator_input_collection_retry_gate;

assert.equal(gate.operator_input_collection_retry_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.operator_input_collection_retry_gate_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(gate.operator_input_collection_retry_gate_result, 'OPERATOR_INPUT_COLLECTION_RETRY_NOT_READY');

assert.equal(gate.imported_operator_input_collection_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(gate.imported_operator_input_collection_execution_defined, true);
assert.equal(gate.imported_operator_input_collection_execution_ready, true);
assert.equal(gate.imported_operator_input_collection_execution_evaluated, true);
assert.equal(gate.imported_operator_input_collection_execution_attempted, false);
assert.equal(gate.imported_operator_input_collection_execution_completed, false);
assert.equal(gate.imported_operator_input_collection_execution_blocked_missing_operator_inputs, true);
assert.equal(gate.imported_operator_inputs_collected, false);
assert.equal(gate.imported_operator_inputs_submitted, false);
assert.equal(gate.imported_operator_inputs_verified, false);

assert.equal(gate.retry_gate_item_count, 4);
assert.equal(gate.retry_gate_items.length, 4);
assert.equal(gate.all_collection_execution_items_have_retry_gate_items, true);
assert.equal(gate.all_retry_gate_items_evaluated, true);
assert.equal(gate.all_retry_gate_items_blocked_missing_operator_inputs, true);
assert.equal(gate.all_retry_gate_items_not_passed, true);
assert.equal(gate.all_retry_gate_items_retry_not_allowed, true);
assert.equal(gate.all_retry_gate_items_retry_not_ready, true);
assert.equal(gate.all_retry_gate_items_retry_not_performed, true);
assert.equal(gate.all_retry_gate_items_block_on_operator_inputs_collected, true);
assert.equal(gate.all_retry_gate_items_block_on_operator_inputs_submitted, true);
assert.equal(gate.all_retry_gate_items_block_on_operator_inputs_verified, true);
assert.equal(gate.all_retry_gate_items_block_on_collection_execution_completed, true);
assert.equal(gate.all_retry_gate_items_require_submitter_ref, true);
assert.equal(gate.all_retry_gate_items_require_submitted_at, true);
assert.equal(gate.all_retry_gate_items_require_submission_channel, true);
assert.equal(gate.all_retry_gate_items_require_public_url, true);
assert.equal(gate.all_retry_gate_items_require_observer_ref, true);
assert.equal(gate.all_retry_gate_items_require_observed_content_digest, true);
assert.equal(gate.all_retry_gate_items_require_scope_match_result, true);
assert.equal(gate.all_retry_gate_items_require_non_claims_presence_result, true);
assert.equal(gate.all_retry_gate_items_require_evidence_reference_presence_result, true);
assert.equal(gate.all_retry_gate_items_require_customer_data_absence_declaration, true);
assert.equal(gate.all_retry_gate_items_require_forbidden_claims_absence_declaration, true);
assert.equal(gate.all_retry_gate_items_operator_inputs_not_collected, true);
assert.equal(gate.all_retry_gate_items_operator_inputs_not_submitted, true);
assert.equal(gate.all_retry_gate_items_operator_inputs_not_verified, true);
assert.equal(gate.all_retry_gate_items_collection_execution_not_completed, true);
assert.equal(gate.all_retry_gate_items_not_ready_for_submission_verification_rerun, true);
assert.equal(gate.all_retry_gate_items_not_ready_for_remediation_execution_update, true);
assert.equal(gate.all_retry_gate_items_not_ready_for_input_collection_execution, true);
assert.equal(gate.all_retry_gate_items_not_ready_for_input_verification, true);
assert.equal(gate.all_retry_gate_items_not_ready_for_retry_gate_rerun, true);

for (const item of gate.retry_gate_items) {
  assert.match(item.operator_input_collection_retry_gate_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE::HBCE-L1::/);
  assert.equal(item.retry_gate_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
  assert.equal(item.retry_gate_result, 'COLLECTION_RETRY_NOT_READY');
  assert.equal(item.source_collection_execution_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
  assert.equal(item.source_collection_execution_evaluated, true);
  assert.equal(item.source_collection_execution_attempted, false);
  assert.equal(item.source_collection_execution_completed, false);
  assert.equal(item.source_collection_execution_blocked_missing_operator_inputs, true);
  assert.equal(item.retry_gate_evaluated, true);
  assert.equal(item.retry_gate_passed, false);
  assert.equal(item.retry_gate_blocked, true);
  assert.equal(item.retry_allowed, false);
  assert.equal(item.retry_ready, false);
  assert.equal(item.retry_performed, false);

  for (const input of requiredInputs()) {
    assert.equal(item.required_operator_inputs.includes(input), true);
    assert.equal(item.missing_operator_inputs.includes(input), true);
  }

  assert.equal(item.submitter_ref_collected, false);
  assert.equal(item.submitted_at_collected, false);
  assert.equal(item.submission_channel_collected, false);
  assert.equal(item.public_url_collected, false);
  assert.equal(item.observer_ref_collected, false);
  assert.equal(item.observed_content_digest_collected, false);
  assert.equal(item.scope_match_result_collected, false);
  assert.equal(item.non_claims_presence_result_collected, false);
  assert.equal(item.evidence_reference_presence_result_collected, false);
  assert.equal(item.customer_data_absence_declaration_collected, false);
  assert.equal(item.forbidden_claims_absence_declaration_collected, false);
  assert.equal(item.all_required_operator_inputs_collected, false);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.collection_execution_completed, false);
  assert.equal(item.submission_verification_rerun_ready, false);
  assert.equal(item.remediation_execution_update_ready, false);
  assert.equal(item.input_collection_execution_ready, false);
  assert.equal(item.input_verification_ready, false);
  assert.equal(item.retry_gate_rerun_ready, false);
  assert.equal(item.public_surface_observation_ready, false);
}

assert.equal(gate.operator_input_collection_retry_gate_defined, true);
assert.equal(gate.operator_input_collection_retry_gate_ready, true);
assert.equal(gate.operator_input_collection_retry_gate_evaluated, true);
assert.equal(gate.operator_input_collection_retry_gate_passed, false);
assert.equal(gate.operator_input_collection_retry_gate_blocked, true);
assert.equal(gate.operator_input_collection_retry_gate_blocked_missing_operator_inputs, true);
assert.equal(gate.operator_input_collection_retry_allowed, false);
assert.equal(gate.operator_input_collection_retry_ready, false);
assert.equal(gate.operator_input_collection_retry_performed, false);
assert.equal(gate.operator_input_collection_execution_completed, false);
assert.equal(gate.operator_input_submission_ready, false);
assert.equal(gate.operator_input_submission_completed, false);
assert.equal(gate.operator_inputs_collected, false);
assert.equal(gate.operator_inputs_submitted, false);
assert.equal(gate.operator_inputs_verified, false);
assert.equal(gate.submission_verification_rerun_ready, false);
assert.equal(gate.remediation_execution_update_ready, false);
assert.equal(gate.input_collection_execution_ready, false);
assert.equal(gate.input_verification_ready, false);
assert.equal(gate.retry_gate_rerun_ready, false);
assert.equal(gate.public_surface_observed, false);
assert.equal(gate.public_surface_observation_ready, false);
assert.equal(gate.external_customer_ready, false);
assert.equal(gate.banking_pack_ready, false);
assert.equal(gate.level1_launch_ready, false);
assert.equal(gate.production_ready, false);
assert.equal(gate.ai_operator_input_collection_retry_gate_authority_allowed, false);

assert.equal(gate.operator_input_collection_retry_gate_boundary.controlled_information_surface_only, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.retry_gate_evaluation_only, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.retry_gate_blocked_missing_operator_inputs, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_operator_inputs_recorded, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_operator_inputs_collected, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_operator_inputs_submitted, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_operator_inputs_verified, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_collection_retry_performed, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_public_observation_recorded, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_customer_data, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_live_system_control, true);
assert.equal(gate.operator_input_collection_retry_gate_boundary.no_ai_authority_claim, true);

assert.equal(gate.operator_input_collection_retry_gate_checklist.source_public_surface_observation_operator_input_collection_execution_hash_valid, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.source_operator_input_collection_execution_ready, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.source_operator_input_collection_execution_evaluated, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.source_operator_input_collection_execution_completed, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.source_operator_input_collection_execution_blocked_missing_operator_inputs, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.source_operator_inputs_collected, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.source_operator_inputs_submitted, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.source_operator_inputs_verified, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_input_collection_retry_gate_defined, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_input_collection_retry_gate_ready, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_input_collection_retry_gate_evaluated, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_input_collection_retry_gate_passed, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_input_collection_retry_gate_blocked, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_input_collection_retry_gate_blocked_missing_operator_inputs, true);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_input_collection_retry_allowed, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_input_collection_retry_ready, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_inputs_collected, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_inputs_submitted, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.operator_inputs_verified, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.public_surface_observed, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.public_observation_ready, false);
assert.equal(gate.operator_input_collection_retry_gate_checklist.ai_authority_absence_confirmed, true);

assert.equal(gate.operator_input_collection_retry_gate_is_defined, true);
assert.equal(gate.operator_input_collection_retry_gate_is_ready, true);
assert.equal(gate.operator_input_collection_retry_gate_is_evaluated, true);
assert.equal(gate.operator_input_collection_retry_gate_is_blocked_missing_operator_inputs, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_passed, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_retry_allowed, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_retry_ready, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_retry_performed, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_operator_inputs_collected, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_operator_inputs_submitted, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_operator_inputs_verified, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_public_observation_ready, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_external_customer_readiness, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_banking_pack_readiness, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_launch_readiness, true);
assert.equal(gate.operator_input_collection_retry_gate_is_not_production_readiness, true);
assert.equal(gate.operator_input_collection_retry_gate_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_retry_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_retry_gate_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_retry_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_retry_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_retry_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_retry_gate_blocked_missing_operator_inputs, true);
assert.equal(doc.readiness_state.operator_input_collection_retry_allowed, false);
assert.equal(doc.readiness_state.operator_input_collection_retry_ready, false);
assert.equal(doc.readiness_state.operator_input_collection_retry_performed, false);
assert.equal(doc.readiness_state.operator_input_collection_execution_completed, false);
assert.equal(doc.readiness_state.operator_input_submission_ready, false);
assert.equal(doc.readiness_state.operator_inputs_collected, false);
assert.equal(doc.readiness_state.operator_inputs_submitted, false);
assert.equal(doc.readiness_state.operator_inputs_verified, false);
assert.equal(doc.readiness_state.submission_verification_rerun_ready, false);
assert.equal(doc.readiness_state.remediation_execution_update_ready, false);
assert.equal(doc.readiness_state.input_collection_execution_ready, false);
assert.equal(doc.readiness_state.input_verification_ready, false);
assert.equal(doc.readiness_state.retry_gate_rerun_ready, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-116-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.operator_inputs_collected, false);
assert.equal(doc.non_claims.operator_inputs_submitted, false);
assert.equal(doc.non_claims.operator_inputs_verified, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE_BLOCKED_MISSING_OPERATOR_INPUTS/);
assert.match(md, /The retry gate is blocked because required operator inputs are missing/);
assert.match(md, /Retry is not allowed/);
assert.match(md, /Retry is not ready/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-116-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST/);

console.log('PASS PROG-115-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE-DOCS-EXIST');
console.log('PASS PROG-115-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE-HASH-STABLE');
console.log('PASS PROG-115-BUILDER-STABLE');
console.log('PASS PROG-115-SOURCE-PROG-114-INTEGRITY-VALID');
console.log('PASS PROG-115-RETRY-GATE-ITEMS-DEFINED');
console.log('PASS PROG-115-RETRY-GATE-EVALUATED');
console.log('PASS PROG-115-RETRY-GATE-BLOCKED-MISSING-OPERATOR-INPUTS');
console.log('PASS PROG-115-RETRY-NOT-ALLOWED');
console.log('PASS PROG-115-RETRY-NOT-READY');
console.log('PASS PROG-115-RETRY-NOT-PERFORMED');
console.log('PASS PROG-115-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-115-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-115-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-115-SUBMISSION-VERIFICATION-RERUN-NOT-READY');
console.log('PASS PROG-115-AI-OPERATOR-INPUT-COLLECTION-RETRY-GATE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-115-NEXT-PROG-116-RECORDED');
console.log('PASS PROG-115-NO-UNSUPPORTED-READINESS-CLAIMS');
