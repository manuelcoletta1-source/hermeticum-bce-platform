'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredInputs,
  requiredHumanActions,
  buildObservationOperatorInputCollectionHumanActionRequestPayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionRequest
} = require('../../../runtime/level1/build-prog-116-level1-public-surface-observation-operator-input-collection-human-action-request.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-116-level1-public-surface-observation-operator-input-collection-human-action-request.json';
const mdPath = 'docs/launch/level1/prog-116-level1-public-surface-observation-operator-input-collection-human-action-request.md';
const runtimePath = 'runtime/level1/build-prog-116-level1-public-surface-observation-operator-input-collection-human-action-request.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-116-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST');
assert.equal(doc.issue_id, 'PROG-116');
assert.equal(doc.level1_public_surface_observation_operator_input_collection_human_action_request_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_collection_retry_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_collection_retry_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionRequest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationOperatorInputCollectionHumanActionRequestPayload(source);
const request = doc.public_surface_observation_operator_input_collection_human_action_request;

assert.equal(request.human_action_request_payload_digest, sha256Digest(expectedPayload));
assert.equal(request.human_action_request_status, 'DEFINED_PENDING_HUMAN_ACTION');
assert.equal(request.human_action_request_result, 'HUMAN_ACTION_REQUIRED_NOT_COMPLETED');

assert.equal(request.imported_operator_input_collection_retry_gate_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
assert.equal(request.imported_operator_input_collection_retry_gate_ready, true);
assert.equal(request.imported_operator_input_collection_retry_gate_evaluated, true);
assert.equal(request.imported_operator_input_collection_retry_gate_passed, false);
assert.equal(request.imported_operator_input_collection_retry_gate_blocked, true);
assert.equal(request.imported_operator_input_collection_retry_gate_blocked_missing_operator_inputs, true);
assert.equal(request.imported_operator_input_collection_retry_allowed, false);
assert.equal(request.imported_operator_input_collection_retry_ready, false);
assert.equal(request.imported_operator_input_collection_retry_performed, false);
assert.equal(request.imported_operator_inputs_collected, false);
assert.equal(request.imported_operator_inputs_submitted, false);
assert.equal(request.imported_operator_inputs_verified, false);

assert.equal(request.human_action_request_item_count, 4);
assert.equal(request.human_action_request_items.length, 4);
assert.equal(request.all_retry_gate_items_have_human_action_request_items, true);
assert.equal(request.all_human_action_request_items_pending, true);
assert.equal(request.all_human_action_request_items_required, true);
assert.equal(request.all_human_action_request_items_requested, true);
assert.equal(request.all_human_action_request_items_not_acknowledged, true);
assert.equal(request.all_human_action_request_items_not_completed, true);
assert.equal(request.all_human_action_request_items_source_retry_gate_blocked, true);
assert.equal(request.all_human_action_request_items_source_retry_gate_blocked_missing_operator_inputs, true);
assert.equal(request.all_human_action_request_items_operator_inputs_not_collected, true);
assert.equal(request.all_human_action_request_items_operator_inputs_not_submitted, true);
assert.equal(request.all_human_action_request_items_operator_inputs_not_verified, true);
assert.equal(request.all_human_action_request_items_ready_for_acknowledgment, true);
assert.equal(request.all_human_action_request_items_not_ready_for_operator_input_submission, true);
assert.equal(request.all_human_action_request_items_not_ready_for_submission_verification_rerun, true);
assert.equal(request.all_human_action_request_items_not_ready_for_input_verification, true);
assert.equal(request.all_human_action_request_items_not_ready_for_retry_gate_rerun, true);

for (const item of request.human_action_request_items) {
  assert.match(item.human_action_request_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST::HBCE-L1::/);
  assert.equal(item.human_action_request_status, 'PENDING_HUMAN_OPERATOR_ACTION');
  assert.equal(item.human_action_request_result, 'HUMAN_ACTION_REQUIRED_NOT_COMPLETED');
  assert.equal(item.source_retry_gate_status, 'BLOCKED_MISSING_OPERATOR_INPUTS');
  assert.equal(item.source_retry_gate_blocked, true);
  assert.equal(item.source_retry_gate_blocked_missing_operator_inputs, true);
  assert.equal(item.human_action_required, true);
  assert.equal(item.human_action_requested, true);
  assert.equal(item.human_action_acknowledgment_required, true);
  assert.equal(item.human_action_acknowledged, false);
  assert.equal(item.human_action_completed, false);
  assert.equal(item.operator_input_bundle_required, true);
  assert.equal(item.operator_input_bundle_submitted, false);

  for (const input of requiredInputs()) {
    assert.equal(item.required_operator_inputs.includes(input), true);
    assert.equal(item.missing_operator_inputs.includes(input), true);
  }

  for (const action of requiredHumanActions()) {
    assert.equal(item.required_human_actions.includes(action), true);
  }

  assert.equal(item.submitter_ref, null);
  assert.equal(item.submitted_at, null);
  assert.equal(item.submission_channel, null);
  assert.equal(item.public_url, null);
  assert.equal(item.observer_ref, null);
  assert.equal(item.observed_content_digest, null);
  assert.equal(item.scope_match_result, null);
  assert.equal(item.non_claims_presence_result, null);
  assert.equal(item.evidence_reference_presence_result, null);
  assert.equal(item.customer_data_absence_declaration, null);
  assert.equal(item.forbidden_claims_absence_declaration, null);
  assert.equal(item.all_required_operator_inputs_collected, false);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.ready_for_human_acknowledgment, true);
  assert.equal(item.ready_for_operator_input_submission, false);
  assert.equal(item.ready_for_submission_verification_rerun, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(request.human_action_request_defined, true);
assert.equal(request.human_action_request_ready, true);
assert.equal(request.human_action_request_prepared, true);
assert.equal(request.human_action_required, true);
assert.equal(request.human_action_requested, true);
assert.equal(request.human_action_acknowledgment_required, true);
assert.equal(request.human_action_acknowledgment_ready, true);
assert.equal(request.human_action_acknowledged, false);
assert.equal(request.human_action_completed, false);
assert.equal(request.operator_input_bundle_required, true);
assert.equal(request.operator_input_bundle_submitted, false);
assert.equal(request.operator_input_collection_retry_allowed, false);
assert.equal(request.operator_input_collection_retry_ready, false);
assert.equal(request.operator_input_collection_retry_performed, false);
assert.equal(request.operator_inputs_collected, false);
assert.equal(request.operator_inputs_submitted, false);
assert.equal(request.operator_inputs_verified, false);
assert.equal(request.public_surface_observed, false);
assert.equal(request.public_surface_observation_ready, false);
assert.equal(request.external_customer_ready, false);
assert.equal(request.banking_pack_ready, false);
assert.equal(request.level1_launch_ready, false);
assert.equal(request.production_ready, false);
assert.equal(request.ai_human_action_request_authority_allowed, false);

assert.equal(request.human_action_request_boundary.controlled_information_surface_only, true);
assert.equal(request.human_action_request_boundary.human_action_request_definition_only, true);
assert.equal(request.human_action_request_boundary.human_action_required_but_not_completed, true);
assert.equal(request.human_action_request_boundary.no_operator_inputs_recorded, true);
assert.equal(request.human_action_request_boundary.no_operator_inputs_collected, true);
assert.equal(request.human_action_request_boundary.no_operator_inputs_submitted, true);
assert.equal(request.human_action_request_boundary.no_operator_inputs_verified, true);
assert.equal(request.human_action_request_boundary.no_collection_retry_performed, true);
assert.equal(request.human_action_request_boundary.no_public_observation_recorded, true);
assert.equal(request.human_action_request_boundary.no_customer_data, true);
assert.equal(request.human_action_request_boundary.no_live_system_control, true);
assert.equal(request.human_action_request_boundary.no_ai_authority_claim, true);

assert.equal(request.human_action_request_checklist.source_public_surface_observation_operator_input_collection_retry_gate_hash_valid, true);
assert.equal(request.human_action_request_checklist.source_operator_input_collection_retry_gate_ready, true);
assert.equal(request.human_action_request_checklist.source_operator_input_collection_retry_gate_evaluated, true);
assert.equal(request.human_action_request_checklist.source_operator_input_collection_retry_gate_passed, false);
assert.equal(request.human_action_request_checklist.source_operator_input_collection_retry_gate_blocked, true);
assert.equal(request.human_action_request_checklist.source_operator_input_collection_retry_gate_blocked_missing_operator_inputs, true);
assert.equal(request.human_action_request_checklist.human_action_request_defined, true);
assert.equal(request.human_action_request_checklist.human_action_request_ready, true);
assert.equal(request.human_action_request_checklist.human_action_request_prepared, true);
assert.equal(request.human_action_request_checklist.human_action_required, true);
assert.equal(request.human_action_request_checklist.human_action_requested, true);
assert.equal(request.human_action_request_checklist.human_action_acknowledged, false);
assert.equal(request.human_action_request_checklist.human_action_completed, false);
assert.equal(request.human_action_request_checklist.operator_inputs_collected, false);
assert.equal(request.human_action_request_checklist.operator_inputs_submitted, false);
assert.equal(request.human_action_request_checklist.operator_inputs_verified, false);
assert.equal(request.human_action_request_checklist.public_surface_observed, false);
assert.equal(request.human_action_request_checklist.public_observation_ready, false);
assert.equal(request.human_action_request_checklist.ai_authority_absence_confirmed, true);

assert.equal(request.human_action_request_is_defined, true);
assert.equal(request.human_action_request_is_ready, true);
assert.equal(request.human_action_request_is_prepared, true);
assert.equal(request.human_action_request_is_pending_human_action, true);
assert.equal(request.human_action_request_is_not_acknowledged, true);
assert.equal(request.human_action_request_is_not_completed, true);
assert.equal(request.human_action_request_is_not_operator_inputs_collected, true);
assert.equal(request.human_action_request_is_not_operator_inputs_submitted, true);
assert.equal(request.human_action_request_is_not_operator_inputs_verified, true);
assert.equal(request.human_action_request_is_not_retry_allowed, true);
assert.equal(request.human_action_request_is_not_public_observation_ready, true);
assert.equal(request.human_action_request_is_not_external_customer_readiness, true);
assert.equal(request.human_action_request_is_not_banking_pack_readiness, true);
assert.equal(request.human_action_request_is_not_launch_readiness, true);
assert.equal(request.human_action_request_is_not_production_readiness, true);
assert.equal(request.human_action_request_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_request_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_request_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_request_prepared, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_request_pending_human_action, true);
assert.equal(doc.readiness_state.human_action_required, true);
assert.equal(doc.readiness_state.human_action_requested, true);
assert.equal(doc.readiness_state.human_action_acknowledgment_required, true);
assert.equal(doc.readiness_state.human_action_acknowledgment_ready, true);
assert.equal(doc.readiness_state.human_action_acknowledged, false);
assert.equal(doc.readiness_state.human_action_completed, false);
assert.equal(doc.readiness_state.operator_input_bundle_required, true);
assert.equal(doc.readiness_state.operator_input_bundle_submitted, false);
assert.equal(doc.readiness_state.operator_input_collection_retry_allowed, false);
assert.equal(doc.readiness_state.operator_inputs_collected, false);
assert.equal(doc.readiness_state.operator_inputs_submitted, false);
assert.equal(doc.readiness_state.operator_inputs_verified, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-117-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.human_action_completed, false);
assert.equal(doc.non_claims.operator_inputs_collected, false);
assert.equal(doc.non_claims.operator_inputs_submitted, false);
assert.equal(doc.non_claims.operator_inputs_verified, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST_DEFINED_PENDING_HUMAN_ACTION/);
assert.match(md, /Human action is required/);
assert.match(md, /Human action is not acknowledged/);
assert.match(md, /The operator input bundle is not submitted/);
assert.match(md, /Public URL is not collected/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-117-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT/);

console.log('PASS PROG-116-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST-DOCS-EXIST');
console.log('PASS PROG-116-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST-HASH-STABLE');
console.log('PASS PROG-116-BUILDER-STABLE');
console.log('PASS PROG-116-SOURCE-PROG-115-INTEGRITY-VALID');
console.log('PASS PROG-116-HUMAN-ACTION-REQUEST-ITEMS-DEFINED');
console.log('PASS PROG-116-HUMAN-ACTION-REQUEST-READY');
console.log('PASS PROG-116-HUMAN-ACTION-REQUIRED');
console.log('PASS PROG-116-HUMAN-ACTION-NOT-ACKNOWLEDGED');
console.log('PASS PROG-116-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-116-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-116-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-116-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-116-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-116-AI-HUMAN-ACTION-REQUEST-AUTHORITY-DISALLOWED');
console.log('PASS PROG-116-NEXT-PROG-117-RECORDED');
console.log('PASS PROG-116-NO-UNSUPPORTED-READINESS-CLAIMS');
