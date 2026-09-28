'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  completionBlockingCriteria,
  buildObservationOperatorInputCollectionHumanActionCompletionGatePayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionCompletionGate
} = require('../../../runtime/level1/build-prog-118-level1-public-surface-observation-operator-input-collection-human-action-completion-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-118-level1-public-surface-observation-operator-input-collection-human-action-completion-gate.json';
const mdPath = 'docs/launch/level1/prog-118-level1-public-surface-observation-operator-input-collection-human-action-completion-gate.md';
const runtimePath = 'runtime/level1/build-prog-118-level1-public-surface-observation-operator-input-collection-human-action-completion-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-118-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-COMPLETION-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_COMPLETION_GATE');
assert.equal(doc.issue_id, 'PROG-118');
assert.equal(doc.level1_public_surface_observation_operator_input_collection_human_action_completion_gate_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_collection_human_action_acknowledgment_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_collection_human_action_acknowledgment_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionCompletionGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationOperatorInputCollectionHumanActionCompletionGatePayload(source);
const gate = doc.public_surface_observation_operator_input_collection_human_action_completion_gate;

assert.equal(gate.human_action_completion_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.human_action_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
assert.equal(gate.human_action_completion_gate_result, 'HUMAN_ACTION_COMPLETION_NOT_READY');

assert.equal(gate.imported_human_action_acknowledgment_status, 'DEFINED_PENDING_ACKNOWLEDGMENT');
assert.equal(gate.imported_human_action_acknowledgment_defined, true);
assert.equal(gate.imported_human_action_acknowledgment_ready, true);
assert.equal(gate.imported_human_action_acknowledgment_evaluated, true);
assert.equal(gate.imported_human_action_acknowledgment_required, true);
assert.equal(gate.imported_human_action_acknowledgment_received, false);
assert.equal(gate.imported_human_action_acknowledgment_validated, false);
assert.equal(gate.imported_human_action_acknowledged, false);
assert.equal(gate.imported_human_action_completed, false);
assert.equal(gate.imported_human_action_completion_ready, false);
assert.equal(gate.imported_operator_input_bundle_required, true);
assert.equal(gate.imported_operator_input_bundle_submitted, false);
assert.equal(gate.imported_operator_inputs_collected, false);
assert.equal(gate.imported_operator_inputs_submitted, false);
assert.equal(gate.imported_operator_inputs_verified, false);

assert.equal(gate.human_action_completion_gate_item_count, 4);
assert.equal(gate.human_action_completion_gate_items.length, 4);
assert.equal(gate.all_acknowledgment_items_have_completion_gate_items, true);
assert.equal(gate.all_completion_gate_items_required, true);
assert.equal(gate.all_completion_gate_items_ready, true);
assert.equal(gate.all_completion_gate_items_evaluated, true);
assert.equal(gate.all_completion_gate_items_not_passed, true);
assert.equal(gate.all_completion_gate_items_blocked, true);
assert.equal(gate.all_completion_gate_items_blocked_pending_acknowledgment, true);
assert.equal(gate.all_completion_gate_items_source_acknowledgment_ready, true);
assert.equal(gate.all_completion_gate_items_source_acknowledgment_not_received, true);
assert.equal(gate.all_completion_gate_items_source_acknowledgment_not_validated, true);
assert.equal(gate.all_completion_gate_items_source_human_action_not_acknowledged, true);
assert.equal(gate.all_completion_gate_items_source_human_action_not_completed, true);
assert.equal(gate.all_completion_gate_items_completion_not_allowed, true);
assert.equal(gate.all_completion_gate_items_completion_not_ready, true);
assert.equal(gate.all_completion_gate_items_completion_not_performed, true);
assert.equal(gate.all_completion_gate_items_block_on_acknowledgment_received, true);
assert.equal(gate.all_completion_gate_items_block_on_acknowledgment_validated, true);
assert.equal(gate.all_completion_gate_items_block_on_human_action_acknowledged, true);
assert.equal(gate.all_completion_gate_items_block_on_human_action_completion_ready, true);
assert.equal(gate.all_completion_gate_items_block_on_operator_input_bundle_submitted, true);
assert.equal(gate.all_completion_gate_items_operator_input_bundle_not_submitted, true);
assert.equal(gate.all_completion_gate_items_operator_inputs_not_collected, true);
assert.equal(gate.all_completion_gate_items_operator_inputs_not_submitted, true);
assert.equal(gate.all_completion_gate_items_operator_inputs_not_verified, true);
assert.equal(gate.all_completion_gate_items_not_ready_for_operator_input_submission, true);
assert.equal(gate.all_completion_gate_items_not_ready_for_submission_verification_rerun, true);
assert.equal(gate.all_completion_gate_items_not_ready_for_input_verification, true);
assert.equal(gate.all_completion_gate_items_not_ready_for_retry_gate_rerun, true);

for (const item of gate.human_action_completion_gate_items) {
  assert.match(item.human_action_completion_gate_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-COMPLETION-GATE::HBCE-L1::/);
  assert.equal(item.completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.completion_gate_result, 'HUMAN_ACTION_COMPLETION_NOT_READY');
  assert.equal(item.source_acknowledgment_status, 'PENDING_HUMAN_ACKNOWLEDGMENT');
  assert.equal(item.source_acknowledgment_required, true);
  assert.equal(item.source_acknowledgment_ready, true);
  assert.equal(item.source_acknowledgment_received, false);
  assert.equal(item.source_acknowledgment_validated, false);
  assert.equal(item.source_human_action_acknowledged, false);
  assert.equal(item.source_human_action_completed, false);
  assert.equal(item.completion_gate_required, true);
  assert.equal(item.completion_gate_ready, true);
  assert.equal(item.completion_gate_evaluated, true);
  assert.equal(item.completion_gate_passed, false);
  assert.equal(item.completion_gate_blocked, true);
  assert.equal(item.completion_gate_blocked_pending_acknowledgment, true);

  for (const criterion of completionBlockingCriteria()) {
    assert.equal(item.blocking_criteria.includes(criterion), true);
    assert.equal(item.missing_completion_inputs.includes(criterion), true);
  }

  assert.equal(item.acknowledgment_required, true);
  assert.equal(item.acknowledgment_ready, true);
  assert.equal(item.acknowledgment_received, false);
  assert.equal(item.acknowledgment_validated, false);
  assert.equal(item.human_action_acknowledged, false);
  assert.equal(item.human_action_completed, false);
  assert.equal(item.human_action_completion_allowed, false);
  assert.equal(item.human_action_completion_ready, false);
  assert.equal(item.human_action_completion_performed, false);
  assert.equal(item.operator_input_bundle_required, true);
  assert.equal(item.operator_input_bundle_submitted, false);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.ready_for_operator_input_submission, false);
  assert.equal(item.ready_for_submission_verification_rerun, false);
  assert.equal(item.ready_for_input_collection_execution, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(gate.human_action_completion_gate_defined, true);
assert.equal(gate.human_action_completion_gate_ready, true);
assert.equal(gate.human_action_completion_gate_evaluated, true);
assert.equal(gate.human_action_completion_gate_passed, false);
assert.equal(gate.human_action_completion_gate_blocked, true);
assert.equal(gate.human_action_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(gate.human_action_acknowledgment_required, true);
assert.equal(gate.human_action_acknowledgment_ready, true);
assert.equal(gate.human_action_acknowledgment_received, false);
assert.equal(gate.human_action_acknowledgment_validated, false);
assert.equal(gate.human_action_acknowledged, false);
assert.equal(gate.human_action_completed, false);
assert.equal(gate.human_action_completion_allowed, false);
assert.equal(gate.human_action_completion_ready, false);
assert.equal(gate.human_action_completion_performed, false);
assert.equal(gate.operator_input_bundle_required, true);
assert.equal(gate.operator_input_bundle_submitted, false);
assert.equal(gate.operator_inputs_collected, false);
assert.equal(gate.operator_inputs_submitted, false);
assert.equal(gate.operator_inputs_verified, false);
assert.equal(gate.public_surface_observed, false);
assert.equal(gate.public_surface_observation_ready, false);
assert.equal(gate.external_customer_ready, false);
assert.equal(gate.banking_pack_ready, false);
assert.equal(gate.level1_launch_ready, false);
assert.equal(gate.production_ready, false);
assert.equal(gate.ai_human_action_completion_gate_authority_allowed, false);

assert.equal(gate.human_action_completion_gate_boundary.controlled_information_surface_only, true);
assert.equal(gate.human_action_completion_gate_boundary.completion_gate_evaluation_only, true);
assert.equal(gate.human_action_completion_gate_boundary.completion_gate_blocked_pending_acknowledgment, true);
assert.equal(gate.human_action_completion_gate_boundary.no_acknowledgment_recorded, true);
assert.equal(gate.human_action_completion_gate_boundary.no_acknowledgment_validated, true);
assert.equal(gate.human_action_completion_gate_boundary.no_human_action_completed, true);
assert.equal(gate.human_action_completion_gate_boundary.no_operator_input_bundle_submitted, true);
assert.equal(gate.human_action_completion_gate_boundary.no_operator_inputs_recorded, true);
assert.equal(gate.human_action_completion_gate_boundary.no_operator_inputs_collected, true);
assert.equal(gate.human_action_completion_gate_boundary.no_operator_inputs_submitted, true);
assert.equal(gate.human_action_completion_gate_boundary.no_operator_inputs_verified, true);
assert.equal(gate.human_action_completion_gate_boundary.no_public_observation_recorded, true);
assert.equal(gate.human_action_completion_gate_boundary.no_customer_data, true);
assert.equal(gate.human_action_completion_gate_boundary.no_live_system_control, true);
assert.equal(gate.human_action_completion_gate_boundary.no_ai_authority_claim, true);

assert.equal(gate.human_action_completion_gate_checklist.source_public_surface_observation_operator_input_collection_human_action_acknowledgment_hash_valid, true);
assert.equal(gate.human_action_completion_gate_checklist.source_human_action_acknowledgment_ready, true);
assert.equal(gate.human_action_completion_gate_checklist.source_human_action_acknowledgment_evaluated, true);
assert.equal(gate.human_action_completion_gate_checklist.source_human_action_acknowledgment_pending, true);
assert.equal(gate.human_action_completion_gate_checklist.source_human_action_acknowledgment_received, false);
assert.equal(gate.human_action_completion_gate_checklist.source_human_action_acknowledgment_validated, false);
assert.equal(gate.human_action_completion_gate_checklist.source_human_action_acknowledged, false);
assert.equal(gate.human_action_completion_gate_checklist.source_human_action_completed, false);
assert.equal(gate.human_action_completion_gate_checklist.human_action_completion_gate_defined, true);
assert.equal(gate.human_action_completion_gate_checklist.human_action_completion_gate_ready, true);
assert.equal(gate.human_action_completion_gate_checklist.human_action_completion_gate_evaluated, true);
assert.equal(gate.human_action_completion_gate_checklist.human_action_completion_gate_passed, false);
assert.equal(gate.human_action_completion_gate_checklist.human_action_completion_gate_blocked, true);
assert.equal(gate.human_action_completion_gate_checklist.human_action_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(gate.human_action_completion_gate_checklist.human_action_completed, false);
assert.equal(gate.human_action_completion_gate_checklist.operator_inputs_collected, false);
assert.equal(gate.human_action_completion_gate_checklist.operator_inputs_submitted, false);
assert.equal(gate.human_action_completion_gate_checklist.operator_inputs_verified, false);
assert.equal(gate.human_action_completion_gate_checklist.ai_authority_absence_confirmed, true);

assert.equal(gate.human_action_completion_gate_is_defined, true);
assert.equal(gate.human_action_completion_gate_is_ready, true);
assert.equal(gate.human_action_completion_gate_is_evaluated, true);
assert.equal(gate.human_action_completion_gate_is_blocked_pending_acknowledgment, true);
assert.equal(gate.human_action_completion_gate_is_not_passed, true);
assert.equal(gate.human_action_completion_gate_is_not_completion_allowed, true);
assert.equal(gate.human_action_completion_gate_is_not_completion_ready, true);
assert.equal(gate.human_action_completion_gate_is_not_completion_performed, true);
assert.equal(gate.human_action_completion_gate_is_not_acknowledgment_received, true);
assert.equal(gate.human_action_completion_gate_is_not_acknowledgment_validated, true);
assert.equal(gate.human_action_completion_gate_is_not_human_action_completed, true);
assert.equal(gate.human_action_completion_gate_is_not_operator_input_bundle_submitted, true);
assert.equal(gate.human_action_completion_gate_is_not_operator_inputs_collected, true);
assert.equal(gate.human_action_completion_gate_is_not_operator_inputs_submitted, true);
assert.equal(gate.human_action_completion_gate_is_not_operator_inputs_verified, true);
assert.equal(gate.human_action_completion_gate_is_not_public_observation_ready, true);
assert.equal(gate.human_action_completion_gate_is_not_external_customer_readiness, true);
assert.equal(gate.human_action_completion_gate_is_not_banking_pack_readiness, true);
assert.equal(gate.human_action_completion_gate_is_not_launch_readiness, true);
assert.equal(gate.human_action_completion_gate_is_not_production_readiness, true);
assert.equal(gate.human_action_completion_gate_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(doc.readiness_state.human_action_acknowledgment_received, false);
assert.equal(doc.readiness_state.human_action_acknowledgment_validated, false);
assert.equal(doc.readiness_state.human_action_acknowledged, false);
assert.equal(doc.readiness_state.human_action_completed, false);
assert.equal(doc.readiness_state.human_action_completion_allowed, false);
assert.equal(doc.readiness_state.human_action_completion_ready, false);
assert.equal(doc.readiness_state.human_action_completion_performed, false);
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

assert.equal(doc.next_required_program, 'PROG-119-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.human_action_acknowledgment_received, false);
assert.equal(doc.non_claims.human_action_acknowledgment_validated, false);
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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_COMPLETION_GATE_BLOCKED_PENDING_ACKNOWLEDGMENT/);
assert.match(md, /The human action completion gate is blocked pending acknowledgment/);
assert.match(md, /Human action acknowledgment is not received/);
assert.match(md, /Human action is not completed/);
assert.match(md, /The operator input bundle is not submitted/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-119-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST/);

console.log('PASS PROG-118-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-COMPLETION-GATE-DOCS-EXIST');
console.log('PASS PROG-118-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-COMPLETION-GATE-HASH-STABLE');
console.log('PASS PROG-118-BUILDER-STABLE');
console.log('PASS PROG-118-SOURCE-PROG-117-INTEGRITY-VALID');
console.log('PASS PROG-118-HUMAN-ACTION-COMPLETION-GATE-ITEMS-DEFINED');
console.log('PASS PROG-118-HUMAN-ACTION-COMPLETION-GATE-READY');
console.log('PASS PROG-118-HUMAN-ACTION-COMPLETION-GATE-EVALUATED');
console.log('PASS PROG-118-HUMAN-ACTION-COMPLETION-GATE-BLOCKED-PENDING-ACKNOWLEDGMENT');
console.log('PASS PROG-118-HUMAN-ACTION-ACKNOWLEDGMENT-NOT-RECEIVED');
console.log('PASS PROG-118-HUMAN-ACTION-ACKNOWLEDGMENT-NOT-VALIDATED');
console.log('PASS PROG-118-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-118-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-118-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-118-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-118-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-118-AI-HUMAN-ACTION-COMPLETION-GATE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-118-NEXT-PROG-119-RECORDED');
console.log('PASS PROG-118-NO-UNSUPPORTED-READINESS-CLAIMS');
