'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredAcknowledgmentFields,
  buildObservationOperatorInputCollectionHumanActionAcknowledgmentPayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionAcknowledgment
} = require('../../../runtime/level1/build-prog-117-level1-public-surface-observation-operator-input-collection-human-action-acknowledgment.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-117-level1-public-surface-observation-operator-input-collection-human-action-acknowledgment.json';
const mdPath = 'docs/launch/level1/prog-117-level1-public-surface-observation-operator-input-collection-human-action-acknowledgment.md';
const runtimePath = 'runtime/level1/build-prog-117-level1-public-surface-observation-operator-input-collection-human-action-acknowledgment.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-117-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_ACKNOWLEDGMENT');
assert.equal(doc.issue_id, 'PROG-117');
assert.equal(doc.level1_public_surface_observation_operator_input_collection_human_action_acknowledgment_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_collection_human_action_request_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_collection_human_action_request_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionAcknowledgment({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationOperatorInputCollectionHumanActionAcknowledgmentPayload(source);
const ack = doc.public_surface_observation_operator_input_collection_human_action_acknowledgment;

assert.equal(ack.human_action_acknowledgment_payload_digest, sha256Digest(expectedPayload));
assert.equal(ack.human_action_acknowledgment_status, 'DEFINED_PENDING_ACKNOWLEDGMENT');
assert.equal(ack.human_action_acknowledgment_result, 'ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED');

assert.equal(ack.imported_human_action_request_status, 'DEFINED_PENDING_HUMAN_ACTION');
assert.equal(ack.imported_human_action_request_defined, true);
assert.equal(ack.imported_human_action_request_ready, true);
assert.equal(ack.imported_human_action_request_prepared, true);
assert.equal(ack.imported_human_action_required, true);
assert.equal(ack.imported_human_action_requested, true);
assert.equal(ack.imported_human_action_acknowledgment_required, true);
assert.equal(ack.imported_human_action_acknowledgment_ready, true);
assert.equal(ack.imported_human_action_acknowledged, false);
assert.equal(ack.imported_human_action_completed, false);
assert.equal(ack.imported_operator_input_bundle_required, true);
assert.equal(ack.imported_operator_input_bundle_submitted, false);
assert.equal(ack.imported_operator_inputs_collected, false);
assert.equal(ack.imported_operator_inputs_submitted, false);
assert.equal(ack.imported_operator_inputs_verified, false);

assert.equal(ack.human_action_acknowledgment_item_count, 4);
assert.equal(ack.human_action_acknowledgment_items.length, 4);
assert.equal(ack.all_human_action_request_items_have_acknowledgment_items, true);
assert.equal(ack.all_acknowledgment_items_pending, true);
assert.equal(ack.all_acknowledgment_items_required, true);
assert.equal(ack.all_acknowledgment_items_ready, true);
assert.equal(ack.all_acknowledgment_items_not_received, true);
assert.equal(ack.all_acknowledgment_items_not_validated, true);
assert.equal(ack.all_acknowledgment_items_without_acknowledger_ref, true);
assert.equal(ack.all_acknowledgment_items_without_acknowledged_at, true);
assert.equal(ack.all_acknowledgment_items_without_acknowledgment_channel, true);
assert.equal(ack.all_acknowledgment_items_without_acknowledgment_statement, true);
assert.equal(ack.all_acknowledgment_items_without_acknowledgment_signature_ref, true);
assert.equal(ack.all_acknowledgment_items_source_request_pending, true);
assert.equal(ack.all_acknowledgment_items_source_human_action_requested, true);
assert.equal(ack.all_acknowledgment_items_source_not_acknowledged, true);
assert.equal(ack.all_acknowledgment_items_source_not_completed, true);
assert.equal(ack.all_acknowledgment_items_human_action_not_completed, true);
assert.equal(ack.all_acknowledgment_items_operator_input_bundle_not_submitted, true);
assert.equal(ack.all_acknowledgment_items_operator_inputs_not_collected, true);
assert.equal(ack.all_acknowledgment_items_operator_inputs_not_submitted, true);
assert.equal(ack.all_acknowledgment_items_operator_inputs_not_verified, true);
assert.equal(ack.all_acknowledgment_items_not_ready_for_human_action_completion, true);
assert.equal(ack.all_acknowledgment_items_not_ready_for_operator_input_submission, true);
assert.equal(ack.all_acknowledgment_items_not_ready_for_input_verification, true);
assert.equal(ack.all_acknowledgment_items_not_ready_for_retry_gate_rerun, true);

for (const item of ack.human_action_acknowledgment_items) {
  assert.match(item.human_action_acknowledgment_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT::HBCE-L1::/);
  assert.equal(item.acknowledgment_status, 'PENDING_HUMAN_ACKNOWLEDGMENT');
  assert.equal(item.acknowledgment_result, 'ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED');
  assert.equal(item.source_human_action_request_status, 'PENDING_HUMAN_OPERATOR_ACTION');
  assert.equal(item.source_human_action_required, true);
  assert.equal(item.source_human_action_requested, true);
  assert.equal(item.source_human_action_acknowledgment_required, true);
  assert.equal(item.source_human_action_acknowledged, false);
  assert.equal(item.source_human_action_completed, false);
  assert.equal(item.acknowledgment_required, true);
  assert.equal(item.acknowledgment_ready, true);
  assert.equal(item.acknowledgment_received, false);
  assert.equal(item.acknowledgment_validated, false);

  for (const field of requiredAcknowledgmentFields()) {
    assert.equal(item.required_acknowledgment_fields.includes(field), true);
    assert.equal(item.missing_acknowledgment_fields.includes(field), true);
  }

  assert.equal(item.acknowledger_ref, null);
  assert.equal(item.acknowledged_at, null);
  assert.equal(item.acknowledgment_channel, null);
  assert.equal(item.acknowledgment_statement, null);
  assert.equal(item.acknowledgment_signature_ref, null);
  assert.equal(item.operator_input_bundle_required, true);
  assert.equal(item.operator_input_bundle_submitted, false);
  assert.equal(item.human_action_required, true);
  assert.equal(item.human_action_requested, true);
  assert.equal(item.human_action_acknowledgment_required, true);
  assert.equal(item.human_action_acknowledgment_ready, true);
  assert.equal(item.human_action_acknowledged, false);
  assert.equal(item.human_action_completed, false);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.ready_for_human_action_completion, false);
  assert.equal(item.ready_for_operator_input_submission, false);
  assert.equal(item.ready_for_submission_verification_rerun, false);
  assert.equal(item.ready_for_input_collection_execution, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(ack.human_action_acknowledgment_defined, true);
assert.equal(ack.human_action_acknowledgment_ready, true);
assert.equal(ack.human_action_acknowledgment_evaluated, true);
assert.equal(ack.human_action_acknowledgment_required, true);
assert.equal(ack.human_action_acknowledgment_received, false);
assert.equal(ack.human_action_acknowledgment_validated, false);
assert.equal(ack.human_action_acknowledged, false);
assert.equal(ack.human_action_completed, false);
assert.equal(ack.human_action_completion_ready, false);
assert.equal(ack.operator_input_bundle_required, true);
assert.equal(ack.operator_input_bundle_submitted, false);
assert.equal(ack.operator_inputs_collected, false);
assert.equal(ack.operator_inputs_submitted, false);
assert.equal(ack.operator_inputs_verified, false);
assert.equal(ack.public_surface_observed, false);
assert.equal(ack.public_surface_observation_ready, false);
assert.equal(ack.external_customer_ready, false);
assert.equal(ack.banking_pack_ready, false);
assert.equal(ack.level1_launch_ready, false);
assert.equal(ack.production_ready, false);
assert.equal(ack.ai_human_action_acknowledgment_authority_allowed, false);

assert.equal(ack.human_action_acknowledgment_boundary.controlled_information_surface_only, true);
assert.equal(ack.human_action_acknowledgment_boundary.acknowledgment_definition_only, true);
assert.equal(ack.human_action_acknowledgment_boundary.acknowledgment_required_but_not_received, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_acknowledgment_recorded, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_acknowledgment_validated, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_human_action_completed, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_operator_inputs_recorded, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_operator_inputs_collected, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_operator_inputs_submitted, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_operator_inputs_verified, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_public_observation_recorded, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_customer_data, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_live_system_control, true);
assert.equal(ack.human_action_acknowledgment_boundary.no_ai_authority_claim, true);

assert.equal(ack.human_action_acknowledgment_checklist.source_public_surface_observation_operator_input_collection_human_action_request_hash_valid, true);
assert.equal(ack.human_action_acknowledgment_checklist.source_human_action_request_ready, true);
assert.equal(ack.human_action_acknowledgment_checklist.source_human_action_request_prepared, true);
assert.equal(ack.human_action_acknowledgment_checklist.source_human_action_required, true);
assert.equal(ack.human_action_acknowledgment_checklist.source_human_action_requested, true);
assert.equal(ack.human_action_acknowledgment_checklist.source_human_action_acknowledgment_required, true);
assert.equal(ack.human_action_acknowledgment_checklist.source_human_action_acknowledgment_ready, true);
assert.equal(ack.human_action_acknowledgment_checklist.source_human_action_acknowledged, false);
assert.equal(ack.human_action_acknowledgment_checklist.source_human_action_completed, false);
assert.equal(ack.human_action_acknowledgment_checklist.human_action_acknowledgment_defined, true);
assert.equal(ack.human_action_acknowledgment_checklist.human_action_acknowledgment_ready, true);
assert.equal(ack.human_action_acknowledgment_checklist.human_action_acknowledgment_required, true);
assert.equal(ack.human_action_acknowledgment_checklist.human_action_acknowledgment_received, false);
assert.equal(ack.human_action_acknowledgment_checklist.human_action_acknowledgment_validated, false);
assert.equal(ack.human_action_acknowledgment_checklist.human_action_acknowledged, false);
assert.equal(ack.human_action_acknowledgment_checklist.human_action_completed, false);
assert.equal(ack.human_action_acknowledgment_checklist.operator_inputs_collected, false);
assert.equal(ack.human_action_acknowledgment_checklist.operator_inputs_submitted, false);
assert.equal(ack.human_action_acknowledgment_checklist.operator_inputs_verified, false);
assert.equal(ack.human_action_acknowledgment_checklist.ai_authority_absence_confirmed, true);

assert.equal(ack.human_action_acknowledgment_is_defined, true);
assert.equal(ack.human_action_acknowledgment_is_ready, true);
assert.equal(ack.human_action_acknowledgment_is_evaluated, true);
assert.equal(ack.human_action_acknowledgment_is_pending_acknowledgment, true);
assert.equal(ack.human_action_acknowledgment_is_not_received, true);
assert.equal(ack.human_action_acknowledgment_is_not_validated, true);
assert.equal(ack.human_action_acknowledgment_is_not_human_action_completed, true);
assert.equal(ack.human_action_acknowledgment_is_not_operator_inputs_collected, true);
assert.equal(ack.human_action_acknowledgment_is_not_operator_inputs_submitted, true);
assert.equal(ack.human_action_acknowledgment_is_not_operator_inputs_verified, true);
assert.equal(ack.human_action_acknowledgment_is_not_public_observation_ready, true);
assert.equal(ack.human_action_acknowledgment_is_not_external_customer_readiness, true);
assert.equal(ack.human_action_acknowledgment_is_not_banking_pack_readiness, true);
assert.equal(ack.human_action_acknowledgment_is_not_launch_readiness, true);
assert.equal(ack.human_action_acknowledgment_is_not_production_readiness, true);
assert.equal(ack.human_action_acknowledgment_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_acknowledgment_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_acknowledgment_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_acknowledgment_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_acknowledgment_pending_acknowledgment, true);
assert.equal(doc.readiness_state.human_action_acknowledgment_received, false);
assert.equal(doc.readiness_state.human_action_acknowledgment_validated, false);
assert.equal(doc.readiness_state.human_action_acknowledged, false);
assert.equal(doc.readiness_state.human_action_completed, false);
assert.equal(doc.readiness_state.human_action_completion_ready, false);
assert.equal(doc.readiness_state.operator_input_bundle_submitted, false);
assert.equal(doc.readiness_state.operator_inputs_collected, false);
assert.equal(doc.readiness_state.operator_inputs_submitted, false);
assert.equal(doc.readiness_state.operator_inputs_verified, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-118-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-COMPLETION-GATE');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.human_action_acknowledged, false);
assert.equal(doc.non_claims.human_action_completed, false);
assert.equal(doc.non_claims.operator_input_bundle_submitted, false);
assert.equal(doc.non_claims.operator_inputs_collected, false);
assert.equal(doc.non_claims.operator_inputs_submitted, false);
assert.equal(doc.non_claims.operator_inputs_verified, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_ACKNOWLEDGMENT_DEFINED_PENDING_ACKNOWLEDGMENT/);
assert.match(md, /Human action acknowledgment is required/);
assert.match(md, /Human action acknowledgment is not received/);
assert.match(md, /Human action is not completed/);
assert.match(md, /The operator input bundle is not submitted/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-118-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-COMPLETION-GATE/);

console.log('PASS PROG-117-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT-DOCS-EXIST');
console.log('PASS PROG-117-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT-HASH-STABLE');
console.log('PASS PROG-117-BUILDER-STABLE');
console.log('PASS PROG-117-SOURCE-PROG-116-INTEGRITY-VALID');
console.log('PASS PROG-117-HUMAN-ACTION-ACKNOWLEDGMENT-ITEMS-DEFINED');
console.log('PASS PROG-117-HUMAN-ACTION-ACKNOWLEDGMENT-READY');
console.log('PASS PROG-117-HUMAN-ACTION-ACKNOWLEDGMENT-REQUIRED');
console.log('PASS PROG-117-HUMAN-ACTION-ACKNOWLEDGMENT-NOT-RECEIVED');
console.log('PASS PROG-117-HUMAN-ACTION-ACKNOWLEDGMENT-NOT-VALIDATED');
console.log('PASS PROG-117-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-117-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-117-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-117-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-117-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-117-AI-HUMAN-ACTION-ACKNOWLEDGMENT-AUTHORITY-DISALLOWED');
console.log('PASS PROG-117-NEXT-PROG-118-RECORDED');
console.log('PASS PROG-117-NO-UNSUPPORTED-READINESS-CLAIMS');
