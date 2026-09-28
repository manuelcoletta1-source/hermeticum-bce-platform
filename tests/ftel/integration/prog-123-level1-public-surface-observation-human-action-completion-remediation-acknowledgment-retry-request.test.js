'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredRetryAcknowledgmentFields,
  buildObservationHumanActionCompletionRemediationAcknowledgmentRetryRequestPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryRequest
} = require('../../../runtime/level1/build-prog-123-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-request.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-123-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-request.json';
const mdPath = 'docs/launch/level1/prog-123-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-request.md';
const runtimePath = 'runtime/level1/build-prog-123-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-request.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-123-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_REQUEST');
assert.equal(doc.issue_id, 'PROG-123');
assert.equal(doc.level1_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_status, STATUS);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_completion_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_completion_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryRequest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationHumanActionCompletionRemediationAcknowledgmentRetryRequestPayload(source);
const retry = doc.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request;

assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_payload_digest, sha256Digest(expectedPayload));
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_status, 'ISSUED_PENDING_ACKNOWLEDGMENT');
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_result, 'ACKNOWLEDGMENT_RETRY_REQUIRED_NOT_RECEIVED');

assert.equal(retry.imported_human_action_completion_remediation_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
assert.equal(retry.imported_human_action_completion_remediation_completion_gate_ready, true);
assert.equal(retry.imported_human_action_completion_remediation_completion_gate_required, true);
assert.equal(retry.imported_human_action_completion_remediation_completion_gate_passed, false);
assert.equal(retry.imported_human_action_completion_remediation_completion_gate_blocked, true);
assert.equal(retry.imported_human_action_completion_remediation_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(retry.imported_human_action_completion_remediation_acknowledgment_received, false);
assert.equal(retry.imported_human_action_completion_remediation_acknowledgment_validated, false);
assert.equal(retry.imported_human_action_completion_remediation_acknowledgment_pending, true);
assert.equal(retry.imported_human_remediation_action_requested, true);
assert.equal(retry.imported_human_remediation_action_acknowledged, false);
assert.equal(retry.imported_human_remediation_action_completed, false);
assert.equal(retry.imported_human_action_completed, false);
assert.equal(retry.imported_operator_input_bundle_submission_request_issued, false);
assert.equal(retry.imported_operator_input_bundle_submitted, false);
assert.equal(retry.imported_operator_inputs_collected, false);
assert.equal(retry.imported_operator_inputs_submitted, false);
assert.equal(retry.imported_operator_inputs_verified, false);

assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_item_count, 4);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_items.length, 4);
assert.equal(retry.all_completion_gate_items_have_retry_request_items, true);
assert.equal(retry.all_retry_request_items_required, true);
assert.equal(retry.all_retry_request_items_defined, true);
assert.equal(retry.all_retry_request_items_ready, true);
assert.equal(retry.all_retry_request_items_evaluated, true);
assert.equal(retry.all_retry_request_items_issued, true);
assert.equal(retry.all_retry_request_items_pending_acknowledgment, true);
assert.equal(retry.all_retry_request_items_retry_acknowledgment_required, true);
assert.equal(retry.all_retry_request_items_retry_acknowledgment_not_received, true);
assert.equal(retry.all_retry_request_items_retry_acknowledgment_not_validated, true);
assert.equal(retry.all_retry_request_items_retry_acknowledgment_missing, true);
assert.equal(retry.all_retry_request_items_source_gate_blocked, true);
assert.equal(retry.all_retry_request_items_source_gate_not_passed, true);
assert.equal(retry.all_retry_request_items_source_acknowledgment_not_received, true);
assert.equal(retry.all_retry_request_items_source_acknowledgment_not_validated, true);
assert.equal(retry.all_retry_request_items_human_remediation_not_acknowledged, true);
assert.equal(retry.all_retry_request_items_human_remediation_not_completed, true);
assert.equal(retry.all_retry_request_items_human_action_not_completed, true);
assert.equal(retry.all_retry_request_items_bundle_request_not_issued, true);
assert.equal(retry.all_retry_request_items_bundle_not_submitted, true);
assert.equal(retry.all_retry_request_items_operator_inputs_not_collected, true);
assert.equal(retry.all_retry_request_items_operator_inputs_not_submitted, true);
assert.equal(retry.all_retry_request_items_operator_inputs_not_verified, true);
assert.equal(retry.all_retry_request_items_public_surface_not_observed, true);
assert.equal(retry.all_retry_request_items_public_surface_observation_not_ready, true);

for (const item of retry.human_action_completion_remediation_acknowledgment_retry_request_items) {
  assert.match(item.human_action_completion_remediation_acknowledgment_retry_request_item_id, /^PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST::HBCE-L1::/);
  assert.equal(item.retry_request_status, 'ISSUED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.retry_request_result, 'ACKNOWLEDGMENT_RETRY_REQUIRED_NOT_RECEIVED');
  assert.equal(item.source_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.source_completion_gate_passed, false);
  assert.equal(item.source_completion_gate_blocked, true);
  assert.equal(item.source_completion_gate_blocked_pending_acknowledgment, true);
  assert.equal(item.source_acknowledgment_received, false);
  assert.equal(item.source_acknowledgment_validated, false);
  assert.equal(item.source_acknowledgment_missing, true);
  assert.equal(item.retry_request_required, true);
  assert.equal(item.retry_request_defined, true);
  assert.equal(item.retry_request_ready, true);
  assert.equal(item.retry_request_evaluated, true);
  assert.equal(item.retry_request_issued, true);
  assert.equal(item.retry_request_pending_acknowledgment, true);
  assert.equal(item.retry_acknowledgment_required, true);
  assert.equal(item.retry_acknowledgment_received, false);
  assert.equal(item.retry_acknowledgment_validated, false);
  assert.equal(item.retry_acknowledgment_missing, true);

  for (const field of requiredRetryAcknowledgmentFields()) {
    assert.equal(item.required_retry_acknowledgment_fields.includes(field), true);
    assert.equal(item.missing_retry_acknowledgment_fields.includes(field), true);
  }

  assert.equal(item.human_operator_ref, null);
  assert.equal(item.retry_requested_at, null);
  assert.equal(item.retry_request_channel, null);
  assert.equal(item.retry_acknowledgment_statement, null);
  assert.equal(item.retry_acknowledgment_signature_ref, null);
  assert.equal(item.human_remediation_action_acknowledged, false);
  assert.equal(item.human_remediation_action_completed, false);
  assert.equal(item.human_action_completed, false);
  assert.equal(item.operator_input_bundle_submission_request_issued, false);
  assert.equal(item.operator_input_bundle_submitted, false);
  assert.equal(item.operator_inputs_collected, false);
  assert.equal(item.operator_inputs_submitted, false);
  assert.equal(item.operator_inputs_verified, false);
  assert.equal(item.public_surface_observed, false);
  assert.equal(item.public_surface_observation_ready, false);
}

assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_defined, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_ready, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_evaluated, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_required, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_issued, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_acknowledgment_received, false);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_acknowledgment_validated, false);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_completion_allowed, false);
assert.equal(retry.human_action_completion_remediation_completion_gate_passed, false);
assert.equal(retry.human_action_completion_remediation_completion_gate_blocked, true);
assert.equal(retry.human_action_completion_remediation_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_received, false);
assert.equal(retry.human_action_completion_remediation_acknowledgment_validated, false);
assert.equal(retry.human_remediation_action_requested, true);
assert.equal(retry.human_remediation_action_acknowledged, false);
assert.equal(retry.human_remediation_action_completed, false);
assert.equal(retry.human_action_completed, false);
assert.equal(retry.operator_input_bundle_submission_request_issued, false);
assert.equal(retry.operator_input_bundle_submitted, false);
assert.equal(retry.operator_inputs_collected, false);
assert.equal(retry.operator_inputs_submitted, false);
assert.equal(retry.operator_inputs_verified, false);
assert.equal(retry.public_surface_observed, false);
assert.equal(retry.public_surface_observation_ready, false);
assert.equal(retry.external_customer_ready, false);
assert.equal(retry.banking_pack_ready, false);
assert.equal(retry.level1_launch_ready, false);
assert.equal(retry.production_ready, false);
assert.equal(retry.ai_human_action_completion_remediation_acknowledgment_retry_request_authority_allowed, false);

assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.controlled_information_surface_only, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.retry_request_only, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.retry_request_issued_pending_acknowledgment, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_retry_acknowledgment_received, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_retry_acknowledgment_validated, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_human_remediation_action_completed, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_human_action_completed, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_operator_input_bundle_submission_request_issued, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_operator_input_bundle_submitted, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_operator_inputs_collected, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_operator_inputs_submitted, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_operator_inputs_verified, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_public_observation_recorded, true);
assert.equal(retry.human_action_completion_remediation_acknowledgment_retry_request_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_issued, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_acknowledgment_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_acknowledgment_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_validated, false);
assert.equal(doc.readiness_state.human_remediation_action_requested, true);
assert.equal(doc.readiness_state.human_remediation_action_acknowledged, false);
assert.equal(doc.readiness_state.human_remediation_action_completed, false);
assert.equal(doc.readiness_state.human_action_completed, false);
assert.equal(doc.readiness_state.operator_input_bundle_submission_request_issued, false);
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

assert.equal(doc.next_required_program, 'PROG-124-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.retry_acknowledgment_received, false);
assert.equal(doc.non_claims.retry_acknowledgment_validated, false);
assert.equal(doc.non_claims.human_remediation_acknowledgment_received, false);
assert.equal(doc.non_claims.human_remediation_acknowledgment_validated, false);
assert.equal(doc.non_claims.human_remediation_action_completed, false);
assert.equal(doc.non_claims.human_action_completed, false);
assert.equal(doc.non_claims.remediation_completion_gate_passed, false);
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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_REQUEST_ISSUED_PENDING_ACKNOWLEDGMENT/);
assert.match(md, /The human action completion remediation acknowledgment retry request is issued/);
assert.match(md, /The retry acknowledgment is not received/);
assert.match(md, /Human remediation action is not completed/);
assert.match(md, /The operator input bundle submission request is not issued/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-124-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT/);

console.log('PASS PROG-123-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST-DOCS-EXIST');
console.log('PASS PROG-123-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST-HASH-STABLE');
console.log('PASS PROG-123-BUILDER-STABLE');
console.log('PASS PROG-123-SOURCE-PROG-122-INTEGRITY-VALID');
console.log('PASS PROG-123-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST-ITEMS-DEFINED');
console.log('PASS PROG-123-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST-READY');
console.log('PASS PROG-123-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST-ISSUED');
console.log('PASS PROG-123-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST-PENDING');
console.log('PASS PROG-123-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-NOT-RECEIVED');
console.log('PASS PROG-123-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-NOT-VALIDATED');
console.log('PASS PROG-123-HUMAN-REMEDIATION-ACTION-NOT-COMPLETED');
console.log('PASS PROG-123-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-123-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-NOT-ISSUED');
console.log('PASS PROG-123-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-123-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-123-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-123-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-123-AI-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST-AUTHORITY-DISALLOWED');
console.log('PASS PROG-123-NEXT-PROG-124-RECORDED');
console.log('PASS PROG-123-NO-UNSUPPORTED-READINESS-CLAIMS');
