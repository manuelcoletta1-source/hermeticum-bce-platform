'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredRemediationActionFields,
  requiredRemediationPrerequisites,
  buildObservationHumanActionCompletionRemediationRequestPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationRequest
} = require('../../../runtime/level1/build-prog-120-level1-public-surface-observation-human-action-completion-remediation-request.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-120-level1-public-surface-observation-human-action-completion-remediation-request.json';
const mdPath = 'docs/launch/level1/prog-120-level1-public-surface-observation-human-action-completion-remediation-request.md';
const runtimePath = 'runtime/level1/build-prog-120-level1-public-surface-observation-human-action-completion-remediation-request.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-120-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_REQUEST');
assert.equal(doc.issue_id, 'PROG-120');
assert.equal(doc.level1_public_surface_observation_human_action_completion_remediation_request_status, STATUS);
assert.equal(doc.source_public_surface_observation_operator_input_bundle_submission_request_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_operator_input_bundle_submission_request_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationRequest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationHumanActionCompletionRemediationRequestPayload(source);
const request = doc.public_surface_observation_human_action_completion_remediation_request;

assert.equal(request.human_action_completion_remediation_request_payload_digest, sha256Digest(expectedPayload));
assert.equal(request.human_action_completion_remediation_request_status, 'ISSUED_PENDING_HUMAN_REMEDIATION');
assert.equal(request.human_action_completion_remediation_request_result, 'HUMAN_ACTION_COMPLETION_REMEDIATION_REQUIRED');

assert.equal(request.imported_operator_input_bundle_submission_request_status, 'BLOCKED_PENDING_HUMAN_ACTION_COMPLETION');
assert.equal(request.imported_operator_input_bundle_submission_request_defined, true);
assert.equal(request.imported_operator_input_bundle_submission_request_evaluated, true);
assert.equal(request.imported_operator_input_bundle_submission_request_required, true);
assert.equal(request.imported_operator_input_bundle_submission_request_ready, false);
assert.equal(request.imported_operator_input_bundle_submission_request_blocked, true);
assert.equal(request.imported_operator_input_bundle_submission_request_blocked_pending_human_action_completion, true);
assert.equal(request.imported_operator_input_bundle_submission_request_issued, false);
assert.equal(request.imported_operator_input_bundle_submission_allowed, false);
assert.equal(request.imported_operator_input_bundle_submitted, false);
assert.equal(request.imported_human_action_completed, false);
assert.equal(request.imported_human_action_completion_gate_passed, false);
assert.equal(request.imported_human_action_completion_allowed, false);
assert.equal(request.imported_human_action_completion_ready, false);
assert.equal(request.imported_operator_inputs_collected, false);
assert.equal(request.imported_operator_inputs_submitted, false);
assert.equal(request.imported_operator_inputs_verified, false);

assert.equal(request.human_action_completion_remediation_request_item_count, 4);
assert.equal(request.human_action_completion_remediation_request_items.length, 4);
assert.equal(request.all_bundle_submission_request_items_have_remediation_request_items, true);
assert.equal(request.all_remediation_request_items_required, true);
assert.equal(request.all_remediation_request_items_defined, true);
assert.equal(request.all_remediation_request_items_ready, true);
assert.equal(request.all_remediation_request_items_evaluated, true);
assert.equal(request.all_remediation_request_items_issued, true);
assert.equal(request.all_remediation_request_items_pending_human_remediation, true);
assert.equal(request.all_remediation_request_items_human_action_required, true);
assert.equal(request.all_remediation_request_items_human_action_requested, true);
assert.equal(request.all_remediation_request_items_acknowledgment_not_received, true);
assert.equal(request.all_remediation_request_items_acknowledgment_not_validated, true);
assert.equal(request.all_remediation_request_items_action_not_completed, true);
assert.equal(request.all_remediation_request_items_source_bundle_request_blocked, true);
assert.equal(request.all_remediation_request_items_source_bundle_request_not_ready, true);
assert.equal(request.all_remediation_request_items_source_bundle_request_not_issued, true);
assert.equal(request.all_remediation_request_items_source_bundle_not_submitted, true);
assert.equal(request.all_remediation_request_items_human_action_not_completed, true);
assert.equal(request.all_remediation_request_items_completion_gate_not_passed, true);
assert.equal(request.all_remediation_request_items_operator_bundle_not_submitted, true);
assert.equal(request.all_remediation_request_items_operator_inputs_not_collected, true);
assert.equal(request.all_remediation_request_items_operator_inputs_not_submitted, true);
assert.equal(request.all_remediation_request_items_operator_inputs_not_verified, true);
assert.equal(request.all_remediation_request_items_public_surface_not_observed, true);
assert.equal(request.all_remediation_request_items_public_surface_observation_not_ready, true);
assert.equal(request.all_remediation_request_items_not_ready_for_operator_input_submission, true);
assert.equal(request.all_remediation_request_items_not_ready_for_input_verification, true);
assert.equal(request.all_remediation_request_items_not_ready_for_retry_gate_rerun, true);

for (const item of request.human_action_completion_remediation_request_items) {
  assert.match(item.human_action_completion_remediation_request_item_id, /^PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST::HBCE-L1::/);
  assert.equal(item.remediation_request_status, 'ISSUED_PENDING_HUMAN_REMEDIATION');
  assert.equal(item.remediation_request_result, 'HUMAN_ACTION_COMPLETION_REMEDIATION_REQUIRED');
  assert.equal(item.source_bundle_submission_request_status, 'BLOCKED_PENDING_HUMAN_ACTION_COMPLETION');
  assert.equal(item.source_bundle_submission_request_ready, false);
  assert.equal(item.source_bundle_submission_request_blocked, true);
  assert.equal(item.source_bundle_submission_request_blocked_pending_human_action_completion, true);
  assert.equal(item.source_bundle_submission_request_issued, false);
  assert.equal(item.source_operator_input_bundle_submitted, false);
  assert.equal(item.remediation_request_required, true);
  assert.equal(item.remediation_request_defined, true);
  assert.equal(item.remediation_request_ready, true);
  assert.equal(item.remediation_request_evaluated, true);
  assert.equal(item.remediation_request_issued, true);
  assert.equal(item.remediation_request_pending_human_remediation, true);
  assert.equal(item.human_remediation_action_required, true);
  assert.equal(item.human_remediation_action_requested, true);
  assert.equal(item.human_remediation_action_acknowledgment_required, true);
  assert.equal(item.human_remediation_action_acknowledgment_received, false);
  assert.equal(item.human_remediation_action_acknowledgment_validated, false);
  assert.equal(item.human_remediation_action_completed, false);

  for (const field of requiredRemediationActionFields()) {
    assert.equal(item.required_remediation_action_fields.includes(field), true);
    assert.equal(item.missing_remediation_action_fields.includes(field), true);
  }

  for (const prereq of requiredRemediationPrerequisites()) {
    assert.equal(item.required_remediation_prerequisites.includes(prereq), true);
    assert.equal(item.missing_remediation_prerequisites.includes(prereq), true);
  }

  assert.equal(item.human_operator_ref, null);
  assert.equal(item.remediation_acknowledged_at, null);
  assert.equal(item.remediation_channel, null);
  assert.equal(item.remediation_acknowledgment_statement, null);
  assert.equal(item.human_action_completion_statement, null);
  assert.equal(item.human_action_completion_evidence_ref, null);
  assert.equal(item.human_action_completion_signature_ref, null);
  assert.equal(item.human_action_completed, false);
  assert.equal(item.human_action_completion_gate_passed, false);
  assert.equal(item.operator_input_bundle_submission_request_issued, false);
  assert.equal(item.operator_input_bundle_submitted, false);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.public_surface_observed, false);
  assert.equal(item.public_surface_observation_ready, false);
}

assert.equal(request.human_action_completion_remediation_request_defined, true);
assert.equal(request.human_action_completion_remediation_request_evaluated, true);
assert.equal(request.human_action_completion_remediation_request_required, true);
assert.equal(request.human_action_completion_remediation_request_ready, true);
assert.equal(request.human_action_completion_remediation_request_issued, true);
assert.equal(request.human_action_completion_remediation_request_pending_human_remediation, true);
assert.equal(request.human_remediation_action_required, true);
assert.equal(request.human_remediation_action_requested, true);
assert.equal(request.human_remediation_action_acknowledgment_required, true);
assert.equal(request.human_remediation_action_acknowledgment_received, false);
assert.equal(request.human_remediation_action_acknowledgment_validated, false);
assert.equal(request.human_remediation_action_completed, false);
assert.equal(request.operator_input_bundle_submission_request_ready, false);
assert.equal(request.operator_input_bundle_submission_request_blocked, true);
assert.equal(request.operator_input_bundle_submission_request_issued, false);
assert.equal(request.operator_input_bundle_submission_allowed, false);
assert.equal(request.operator_input_bundle_submitted, false);
assert.equal(request.human_action_completed, false);
assert.equal(request.human_action_completion_gate_passed, false);
assert.equal(request.human_action_completion_allowed, false);
assert.equal(request.human_action_completion_ready, false);
assert.equal(request.operator_inputs_collected, false);
assert.equal(request.operator_inputs_submitted, false);
assert.equal(request.operator_inputs_verified, false);
assert.equal(request.public_surface_observed, false);
assert.equal(request.public_surface_observation_ready, false);
assert.equal(request.external_customer_ready, false);
assert.equal(request.banking_pack_ready, false);
assert.equal(request.level1_launch_ready, false);
assert.equal(request.production_ready, false);
assert.equal(request.ai_human_action_completion_remediation_request_authority_allowed, false);

assert.equal(request.human_action_completion_remediation_request_boundary.controlled_information_surface_only, true);
assert.equal(request.human_action_completion_remediation_request_boundary.remediation_request_only, true);
assert.equal(request.human_action_completion_remediation_request_boundary.remediation_request_issued_pending_human_remediation, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_human_remediation_action_completed, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_human_action_completed, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_operator_input_bundle_submission_request_issued, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_operator_input_bundle_submitted, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_operator_inputs_collected, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_operator_inputs_submitted, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_operator_inputs_verified, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_public_observation_recorded, true);
assert.equal(request.human_action_completion_remediation_request_boundary.no_ai_authority_claim, true);

assert.equal(request.human_action_completion_remediation_request_checklist.source_public_surface_observation_operator_input_bundle_submission_request_hash_valid, true);
assert.equal(request.human_action_completion_remediation_request_checklist.source_bundle_submission_request_defined, true);
assert.equal(request.human_action_completion_remediation_request_checklist.source_bundle_submission_request_evaluated, true);
assert.equal(request.human_action_completion_remediation_request_checklist.source_bundle_submission_request_required, true);
assert.equal(request.human_action_completion_remediation_request_checklist.source_bundle_submission_request_ready, false);
assert.equal(request.human_action_completion_remediation_request_checklist.source_bundle_submission_request_blocked, true);
assert.equal(request.human_action_completion_remediation_request_checklist.source_bundle_submission_request_blocked_pending_human_action_completion, true);
assert.equal(request.human_action_completion_remediation_request_checklist.source_bundle_submission_request_issued, false);
assert.equal(request.human_action_completion_remediation_request_checklist.human_action_completion_remediation_request_defined, true);
assert.equal(request.human_action_completion_remediation_request_checklist.human_action_completion_remediation_request_issued, true);
assert.equal(request.human_action_completion_remediation_request_checklist.human_action_completion_remediation_request_pending_human_remediation, true);
assert.equal(request.human_action_completion_remediation_request_checklist.human_remediation_action_requested, true);
assert.equal(request.human_action_completion_remediation_request_checklist.human_remediation_action_completed, false);
assert.equal(request.human_action_completion_remediation_request_checklist.operator_input_bundle_submitted, false);
assert.equal(request.human_action_completion_remediation_request_checklist.operator_inputs_collected, false);
assert.equal(request.human_action_completion_remediation_request_checklist.operator_inputs_submitted, false);
assert.equal(request.human_action_completion_remediation_request_checklist.operator_inputs_verified, false);
assert.equal(request.human_action_completion_remediation_request_checklist.ai_authority_absence_confirmed, true);

assert.equal(request.human_action_completion_remediation_request_is_defined, true);
assert.equal(request.human_action_completion_remediation_request_is_evaluated, true);
assert.equal(request.human_action_completion_remediation_request_is_required, true);
assert.equal(request.human_action_completion_remediation_request_is_ready, true);
assert.equal(request.human_action_completion_remediation_request_is_issued, true);
assert.equal(request.human_action_completion_remediation_request_is_pending_human_remediation, true);
assert.equal(request.human_action_completion_remediation_request_is_not_human_remediation_completed, true);
assert.equal(request.human_action_completion_remediation_request_is_not_human_action_completed, true);
assert.equal(request.human_action_completion_remediation_request_is_not_bundle_submission_request_issued, true);
assert.equal(request.human_action_completion_remediation_request_is_not_bundle_submitted, true);
assert.equal(request.human_action_completion_remediation_request_is_not_operator_inputs_collected, true);
assert.equal(request.human_action_completion_remediation_request_is_not_operator_inputs_submitted, true);
assert.equal(request.human_action_completion_remediation_request_is_not_operator_inputs_verified, true);
assert.equal(request.human_action_completion_remediation_request_is_not_public_observation_ready, true);
assert.equal(request.human_action_completion_remediation_request_does_not_authorize_ai_authority, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_request_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_request_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_request_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_request_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_request_issued, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_request_pending_human_remediation, true);
assert.equal(doc.readiness_state.human_remediation_action_required, true);
assert.equal(doc.readiness_state.human_remediation_action_requested, true);
assert.equal(doc.readiness_state.human_remediation_action_acknowledgment_received, false);
assert.equal(doc.readiness_state.human_remediation_action_acknowledgment_validated, false);
assert.equal(doc.readiness_state.human_remediation_action_completed, false);
assert.equal(doc.readiness_state.public_surface_observation_operator_input_bundle_submission_request_issued, false);
assert.equal(doc.readiness_state.human_action_completed, false);
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

assert.equal(doc.next_required_program, 'PROG-121-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.human_remediation_action_completed, false);
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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_REQUEST_ISSUED_PENDING_HUMAN_REMEDIATION/);
assert.match(md, /The human action completion remediation request is issued/);
assert.match(md, /Human remediation action is requested/);
assert.match(md, /Human remediation action is not completed/);
assert.match(md, /The operator input bundle submission request remains not issued/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-121-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT/);

console.log('PASS PROG-120-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-DOCS-EXIST');
console.log('PASS PROG-120-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-HASH-STABLE');
console.log('PASS PROG-120-BUILDER-STABLE');
console.log('PASS PROG-120-SOURCE-PROG-119-INTEGRITY-VALID');
console.log('PASS PROG-120-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-ITEMS-DEFINED');
console.log('PASS PROG-120-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-READY');
console.log('PASS PROG-120-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-ISSUED');
console.log('PASS PROG-120-HUMAN-REMEDIATION-ACTION-REQUESTED');
console.log('PASS PROG-120-HUMAN-REMEDIATION-ACTION-NOT-COMPLETED');
console.log('PASS PROG-120-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-120-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-NOT-ISSUED');
console.log('PASS PROG-120-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-120-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-120-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-120-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-120-AI-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-AUTHORITY-DISALLOWED');
console.log('PASS PROG-120-NEXT-PROG-121-RECORDED');
console.log('PASS PROG-120-NO-UNSUPPORTED-READINESS-CLAIMS');
