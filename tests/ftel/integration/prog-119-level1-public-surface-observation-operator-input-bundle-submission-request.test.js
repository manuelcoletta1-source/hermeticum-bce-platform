'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredBundleFields,
  requiredSubmissionPrerequisites,
  buildObservationOperatorInputBundleSubmissionRequestPayload,
  buildLevel1PublicSurfaceObservationOperatorInputBundleSubmissionRequest
} = require('../../../runtime/level1/build-prog-119-level1-public-surface-observation-operator-input-bundle-submission-request.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-119-level1-public-surface-observation-operator-input-bundle-submission-request.json';
const mdPath = 'docs/launch/level1/prog-119-level1-public-surface-observation-operator-input-bundle-submission-request.md';
const runtimePath = 'runtime/level1/build-prog-119-level1-public-surface-observation-operator-input-bundle-submission-request.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-119-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST');
assert.equal(doc.issue_id, 'PROG-119');
assert.equal(doc.level1_public_surface_observation_operator_input_bundle_submission_request_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_collection_human_action_completion_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_collection_human_action_completion_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationOperatorInputBundleSubmissionRequest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationOperatorInputBundleSubmissionRequestPayload(source);
const request = doc.public_surface_observation_operator_input_bundle_submission_request;

assert.equal(request.operator_input_bundle_submission_request_payload_digest, sha256Digest(expectedPayload));
assert.equal(request.operator_input_bundle_submission_request_status, 'BLOCKED_PENDING_HUMAN_ACTION_COMPLETION');
assert.equal(request.operator_input_bundle_submission_request_result, 'SUBMISSION_REQUEST_NOT_READY');

assert.equal(request.imported_human_action_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
assert.equal(request.imported_human_action_completion_gate_ready, true);
assert.equal(request.imported_human_action_completion_gate_evaluated, true);
assert.equal(request.imported_human_action_completion_gate_passed, false);
assert.equal(request.imported_human_action_completion_gate_blocked, true);
assert.equal(request.imported_human_action_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(request.imported_human_action_acknowledgment_received, false);
assert.equal(request.imported_human_action_acknowledgment_validated, false);
assert.equal(request.imported_human_action_acknowledged, false);
assert.equal(request.imported_human_action_completed, false);
assert.equal(request.imported_human_action_completion_allowed, false);
assert.equal(request.imported_human_action_completion_ready, false);
assert.equal(request.imported_human_action_completion_performed, false);
assert.equal(request.imported_operator_input_bundle_submitted, false);
assert.equal(request.imported_operator_inputs_collected, false);
assert.equal(request.imported_operator_inputs_submitted, false);
assert.equal(request.imported_operator_inputs_verified, false);

assert.equal(request.operator_input_bundle_submission_request_item_count, 4);
assert.equal(request.operator_input_bundle_submission_request_items.length, 4);
assert.equal(request.all_completion_gate_items_have_submission_request_items, true);
assert.equal(request.all_submission_request_items_required, true);
assert.equal(request.all_submission_request_items_defined, true);
assert.equal(request.all_submission_request_items_not_ready, true);
assert.equal(request.all_submission_request_items_blocked, true);
assert.equal(request.all_submission_request_items_blocked_pending_human_action_completion, true);
assert.equal(request.all_submission_request_items_not_issued, true);
assert.equal(request.all_submission_request_items_submission_not_allowed, true);
assert.equal(request.all_submission_request_items_bundle_not_submitted, true);
assert.equal(request.all_submission_request_items_source_completion_gate_blocked, true);
assert.equal(request.all_submission_request_items_source_completion_gate_not_passed, true);
assert.equal(request.all_submission_request_items_source_completion_blocked_pending_acknowledgment, true);
assert.equal(request.all_submission_request_items_source_acknowledgment_not_received, true);
assert.equal(request.all_submission_request_items_source_acknowledgment_not_validated, true);
assert.equal(request.all_submission_request_items_source_human_action_not_completed, true);
assert.equal(request.all_submission_request_items_completion_not_allowed, true);
assert.equal(request.all_submission_request_items_completion_not_ready, true);
assert.equal(request.all_submission_request_items_operator_inputs_not_collected, true);
assert.equal(request.all_submission_request_items_operator_inputs_not_submitted, true);
assert.equal(request.all_submission_request_items_operator_inputs_not_verified, true);
assert.equal(request.all_submission_request_items_not_ready_for_operator_input_submission, true);
assert.equal(request.all_submission_request_items_not_ready_for_input_verification, true);
assert.equal(request.all_submission_request_items_not_ready_for_retry_gate_rerun, true);

for (const item of request.operator_input_bundle_submission_request_items) {
  assert.match(item.operator_input_bundle_submission_request_item_id, /^PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST::HBCE-L1::/);
  assert.equal(item.bundle_submission_request_status, 'BLOCKED_PENDING_HUMAN_ACTION_COMPLETION');
  assert.equal(item.bundle_submission_request_result, 'SUBMISSION_REQUEST_NOT_READY');
  assert.equal(item.source_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.source_completion_gate_passed, false);
  assert.equal(item.source_completion_gate_blocked, true);
  assert.equal(item.source_completion_gate_blocked_pending_acknowledgment, true);
  assert.equal(item.source_human_action_completion_allowed, false);
  assert.equal(item.source_human_action_completion_ready, false);
  assert.equal(item.source_human_action_completed, false);
  assert.equal(item.source_acknowledgment_received, false);
  assert.equal(item.source_acknowledgment_validated, false);
  assert.equal(item.bundle_submission_request_required, true);
  assert.equal(item.bundle_submission_request_defined, true);
  assert.equal(item.bundle_submission_request_ready, false);
  assert.equal(item.bundle_submission_request_blocked, true);
  assert.equal(item.bundle_submission_request_blocked_pending_human_action_completion, true);
  assert.equal(item.bundle_submission_request_issued, false);
  assert.equal(item.operator_input_bundle_submission_allowed, false);
  assert.equal(item.operator_input_bundle_submitted, false);

  for (const field of requiredBundleFields()) {
    assert.equal(item.required_bundle_fields.includes(field), true);
    assert.equal(item.missing_bundle_fields.includes(field), true);
  }

  for (const prereq of requiredSubmissionPrerequisites()) {
    assert.equal(item.required_submission_prerequisites.includes(prereq), true);
    assert.equal(item.missing_submission_prerequisites.includes(prereq), true);
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
  assert.equal(item.human_action_acknowledgment_received, false);
  assert.equal(item.human_action_acknowledgment_validated, false);
  assert.equal(item.human_action_acknowledged, false);
  assert.equal(item.human_action_completed, false);
  assert.equal(item.human_action_completion_gate_passed, false);
  assert.equal(item.human_action_completion_allowed, false);
  assert.equal(item.human_action_completion_ready, false);
  assert.equal(item.human_action_completion_performed, false);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.ready_for_operator_input_submission, false);
  assert.equal(item.ready_for_submission_verification_rerun, false);
  assert.equal(item.ready_for_input_collection_execution, false);
  assert.equal(item.ready_for_input_verification, false);
  assert.equal(item.ready_for_retry_gate_rerun, false);
}

assert.equal(request.operator_input_bundle_submission_request_defined, true);
assert.equal(request.operator_input_bundle_submission_request_evaluated, true);
assert.equal(request.operator_input_bundle_submission_request_required, true);
assert.equal(request.operator_input_bundle_submission_request_ready, false);
assert.equal(request.operator_input_bundle_submission_request_blocked, true);
assert.equal(request.operator_input_bundle_submission_request_blocked_pending_human_action_completion, true);
assert.equal(request.operator_input_bundle_submission_request_issued, false);
assert.equal(request.operator_input_bundle_submission_allowed, false);
assert.equal(request.operator_input_bundle_required, true);
assert.equal(request.operator_input_bundle_submitted, false);
assert.equal(request.human_action_acknowledgment_received, false);
assert.equal(request.human_action_acknowledgment_validated, false);
assert.equal(request.human_action_acknowledged, false);
assert.equal(request.human_action_completed, false);
assert.equal(request.human_action_completion_gate_passed, false);
assert.equal(request.human_action_completion_allowed, false);
assert.equal(request.human_action_completion_ready, false);
assert.equal(request.human_action_completion_performed, false);
assert.equal(request.operator_inputs_collected, false);
assert.equal(request.operator_inputs_submitted, false);
assert.equal(request.operator_inputs_verified, false);
assert.equal(request.public_surface_observed, false);
assert.equal(request.public_surface_observation_ready, false);
assert.equal(request.external_customer_ready, false);
assert.equal(request.banking_pack_ready, false);
assert.equal(request.level1_launch_ready, false);
assert.equal(request.production_ready, false);
assert.equal(request.ai_operator_input_bundle_submission_request_authority_allowed, false);

assert.equal(request.operator_input_bundle_submission_request_boundary.controlled_information_surface_only, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.submission_request_evaluation_only, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.submission_request_blocked_pending_human_action_completion, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_submission_request_issued, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_operator_input_bundle_submitted, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_operator_inputs_recorded, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_operator_inputs_collected, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_operator_inputs_submitted, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_operator_inputs_verified, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_human_action_completed, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_public_observation_recorded, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_customer_data, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_live_system_control, true);
assert.equal(request.operator_input_bundle_submission_request_boundary.no_ai_authority_claim, true);

assert.equal(request.operator_input_bundle_submission_request_checklist.source_public_surface_observation_operator_input_collection_human_action_completion_gate_hash_valid, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.source_human_action_completion_gate_ready, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.source_human_action_completion_gate_evaluated, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.source_human_action_completion_gate_passed, false);
assert.equal(request.operator_input_bundle_submission_request_checklist.source_human_action_completion_gate_blocked, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.source_human_action_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_input_bundle_submission_request_defined, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_input_bundle_submission_request_evaluated, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_input_bundle_submission_request_required, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_input_bundle_submission_request_ready, false);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_input_bundle_submission_request_blocked, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_input_bundle_submission_request_blocked_pending_human_action_completion, true);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_input_bundle_submission_request_issued, false);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_input_bundle_submitted, false);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_inputs_collected, false);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_inputs_submitted, false);
assert.equal(request.operator_input_bundle_submission_request_checklist.operator_inputs_verified, false);
assert.equal(request.operator_input_bundle_submission_request_checklist.ai_authority_absence_confirmed, true);

assert.equal(request.operator_input_bundle_submission_request_is_defined, true);
assert.equal(request.operator_input_bundle_submission_request_is_evaluated, true);
assert.equal(request.operator_input_bundle_submission_request_is_required, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_ready, true);
assert.equal(request.operator_input_bundle_submission_request_is_blocked, true);
assert.equal(request.operator_input_bundle_submission_request_is_blocked_pending_human_action_completion, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_issued, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_allowed, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_bundle_submitted, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_operator_inputs_collected, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_operator_inputs_submitted, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_operator_inputs_verified, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_public_observation_ready, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_external_customer_readiness, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_banking_pack_readiness, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_launch_readiness, true);
assert.equal(request.operator_input_bundle_submission_request_is_not_production_readiness, true);
assert.equal(request.operator_input_bundle_submission_request_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_operator_input_bundle_submission_request_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_bundle_submission_request_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_bundle_submission_request_required, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_bundle_submission_request_ready, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_bundle_submission_request_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_bundle_submission_request_blocked_pending_human_action_completion, true);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_bundle_submission_request_issued, false);
assert.equal(doc.readiness_state.human_action_acknowledgment_received, false);
assert.equal(doc.readiness_state.human_action_acknowledgment_validated, false);
assert.equal(doc.readiness_state.human_action_acknowledged, false);
assert.equal(doc.readiness_state.human_action_completed, false);
assert.equal(doc.readiness_state.human_action_completion_allowed, false);
assert.equal(doc.readiness_state.human_action_completion_ready, false);
assert.equal(doc.readiness_state.human_action_completion_performed, false);
assert.equal(doc.readiness_state.operator_input_bundle_submission_allowed, false);
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

assert.equal(doc.next_required_program, 'PROG-120-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.human_action_acknowledgment_received, false);
assert.equal(doc.non_claims.human_action_acknowledgment_validated, false);
assert.equal(doc.non_claims.human_action_completed, false);
assert.equal(doc.non_claims.operator_input_bundle_submission_request_issued, false);
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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_BLOCKED_PENDING_HUMAN_ACTION_COMPLETION/);
assert.match(md, /The operator input bundle submission request is blocked pending human action completion/);
assert.match(md, /The operator input bundle submission request is not issued/);
assert.match(md, /Human action is not completed/);
assert.match(md, /The operator input bundle is not submitted/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-120-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST/);

console.log('PASS PROG-119-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-DOCS-EXIST');
console.log('PASS PROG-119-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-HASH-STABLE');
console.log('PASS PROG-119-BUILDER-STABLE');
console.log('PASS PROG-119-SOURCE-PROG-118-INTEGRITY-VALID');
console.log('PASS PROG-119-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-ITEMS-DEFINED');
console.log('PASS PROG-119-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-EVALUATED');
console.log('PASS PROG-119-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-BLOCKED-PENDING-HUMAN-ACTION-COMPLETION');
console.log('PASS PROG-119-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-NOT-ISSUED');
console.log('PASS PROG-119-OPERATOR-INPUT-BUNDLE-SUBMISSION-NOT-ALLOWED');
console.log('PASS PROG-119-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-119-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-119-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-119-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-119-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-119-AI-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-AUTHORITY-DISALLOWED');
console.log('PASS PROG-119-NEXT-PROG-120-RECORDED');
console.log('PASS PROG-119-NO-UNSUPPORTED-READINESS-CLAIMS');
