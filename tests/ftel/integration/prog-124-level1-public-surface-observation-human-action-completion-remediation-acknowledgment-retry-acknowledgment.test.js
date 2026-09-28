'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredRetryAcknowledgmentFields,
  buildObservationHumanActionCompletionRemediationAcknowledgmentRetryAcknowledgmentPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryAcknowledgment
} = require('../../../runtime/level1/build-prog-124-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-acknowledgment.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-124-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-acknowledgment.json';
const mdPath = 'docs/launch/level1/prog-124-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-acknowledgment.md';
const runtimePath = 'runtime/level1/build-prog-124-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-acknowledgment.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-124-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ACKNOWLEDGMENT');
assert.equal(doc.issue_id, 'PROG-124');
assert.equal(doc.level1_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_status, STATUS);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryAcknowledgment({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationHumanActionCompletionRemediationAcknowledgmentRetryAcknowledgmentPayload(source);
const ack = doc.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment;

assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_payload_digest, sha256Digest(expectedPayload));
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_status, 'DEFINED_PENDING_ACKNOWLEDGMENT');
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_result, 'RETRY_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED');

assert.equal(ack.imported_human_action_completion_remediation_acknowledgment_retry_request_status, 'ISSUED_PENDING_ACKNOWLEDGMENT');
assert.equal(ack.imported_human_action_completion_remediation_acknowledgment_retry_request_ready, true);
assert.equal(ack.imported_human_action_completion_remediation_acknowledgment_retry_request_issued, true);
assert.equal(ack.imported_human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment, true);
assert.equal(ack.imported_human_action_completion_remediation_acknowledgment_retry_request_acknowledgment_received, false);
assert.equal(ack.imported_human_action_completion_remediation_acknowledgment_retry_request_acknowledgment_validated, false);

assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_item_count, 4);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_items.length, 4);
assert.equal(ack.all_retry_request_items_have_retry_acknowledgment_items, true);
assert.equal(ack.all_retry_acknowledgment_items_required, true);
assert.equal(ack.all_retry_acknowledgment_items_defined, true);
assert.equal(ack.all_retry_acknowledgment_items_ready, true);
assert.equal(ack.all_retry_acknowledgment_items_evaluated, true);
assert.equal(ack.all_retry_acknowledgment_items_not_received, true);
assert.equal(ack.all_retry_acknowledgment_items_not_validated, true);
assert.equal(ack.all_retry_acknowledgment_items_pending, true);
assert.equal(ack.all_retry_acknowledgment_items_missing, true);
assert.equal(ack.all_retry_acknowledgment_items_source_retry_request_issued, true);
assert.equal(ack.all_retry_acknowledgment_items_source_retry_request_pending, true);
assert.equal(ack.all_retry_acknowledgment_items_source_retry_acknowledgment_not_received, true);
assert.equal(ack.all_retry_acknowledgment_items_source_retry_acknowledgment_not_validated, true);
assert.equal(ack.all_retry_acknowledgment_items_human_remediation_not_acknowledged, true);
assert.equal(ack.all_retry_acknowledgment_items_human_remediation_not_completed, true);
assert.equal(ack.all_retry_acknowledgment_items_human_action_not_completed, true);
assert.equal(ack.all_retry_acknowledgment_items_bundle_request_not_issued, true);
assert.equal(ack.all_retry_acknowledgment_items_bundle_not_submitted, true);
assert.equal(ack.all_retry_acknowledgment_items_operator_inputs_not_collected, true);
assert.equal(ack.all_retry_acknowledgment_items_operator_inputs_not_submitted, true);
assert.equal(ack.all_retry_acknowledgment_items_operator_inputs_not_verified, true);
assert.equal(ack.all_retry_acknowledgment_items_public_surface_not_observed, true);
assert.equal(ack.all_retry_acknowledgment_items_public_surface_observation_not_ready, true);

for (const item of ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_items) {
  assert.match(item.human_action_completion_remediation_acknowledgment_retry_acknowledgment_item_id, /^PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT::HBCE-L1::/);
  assert.equal(item.retry_acknowledgment_status, 'PENDING_RETRY_ACKNOWLEDGMENT');
  assert.equal(item.retry_acknowledgment_result, 'RETRY_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED');
  assert.equal(item.source_retry_request_status, 'ISSUED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.source_retry_request_issued, true);
  assert.equal(item.source_retry_request_pending_acknowledgment, true);
  assert.equal(item.source_retry_acknowledgment_received, false);
  assert.equal(item.source_retry_acknowledgment_validated, false);
  assert.equal(item.source_retry_acknowledgment_missing, true);
  assert.equal(item.retry_acknowledgment_required, true);
  assert.equal(item.retry_acknowledgment_defined, true);
  assert.equal(item.retry_acknowledgment_ready, true);
  assert.equal(item.retry_acknowledgment_evaluated, true);
  assert.equal(item.retry_acknowledgment_received, false);
  assert.equal(item.retry_acknowledgment_validated, false);
  assert.equal(item.retry_acknowledgment_pending, true);
  assert.equal(item.retry_acknowledgment_missing, true);

  for (const field of requiredRetryAcknowledgmentFields()) {
    assert.equal(item.required_retry_acknowledgment_fields.includes(field), true);
    assert.equal(item.missing_retry_acknowledgment_fields.includes(field), true);
  }

  assert.equal(item.human_operator_ref, null);
  assert.equal(item.retry_acknowledged_at, null);
  assert.equal(item.retry_acknowledgment_channel, null);
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

assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_defined, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_ready, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_evaluated, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_required, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_received, false);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated, false);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_request_issued, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_request_acknowledgment_received, false);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_request_acknowledgment_validated, false);
assert.equal(ack.human_remediation_action_requested, true);
assert.equal(ack.human_remediation_action_acknowledged, false);
assert.equal(ack.human_remediation_action_completed, false);
assert.equal(ack.human_action_completed, false);
assert.equal(ack.operator_input_bundle_submission_request_issued, false);
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
assert.equal(ack.ai_human_action_completion_remediation_acknowledgment_retry_acknowledgment_authority_allowed, false);

assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.controlled_information_surface_only, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.retry_acknowledgment_definition_only, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.retry_acknowledgment_pending, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_retry_acknowledgment_received, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_retry_acknowledgment_validated, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_human_remediation_action_completed, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_human_action_completed, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_operator_input_bundle_submission_request_issued, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_operator_input_bundle_submitted, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_operator_inputs_collected, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_operator_inputs_submitted, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_operator_inputs_verified, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_public_observation_recorded, true);
assert.equal(ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_issued, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment, true);
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

assert.equal(doc.next_required_program, 'PROG-125-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-COMPLETION-GATE');

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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ACKNOWLEDGMENT_DEFINED_PENDING_ACKNOWLEDGMENT/);
assert.match(md, /The retry acknowledgment is defined/);
assert.match(md, /The retry acknowledgment is not received/);
assert.match(md, /Human remediation action is not completed/);
assert.match(md, /The operator input bundle submission request is not issued/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-125-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-COMPLETION-GATE/);

console.log('PASS PROG-124-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT-DOCS-EXIST');
console.log('PASS PROG-124-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT-HASH-STABLE');
console.log('PASS PROG-124-BUILDER-STABLE');
console.log('PASS PROG-124-SOURCE-PROG-123-INTEGRITY-VALID');
console.log('PASS PROG-124-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT-ITEMS-DEFINED');
console.log('PASS PROG-124-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT-READY');
console.log('PASS PROG-124-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT-PENDING');
console.log('PASS PROG-124-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-NOT-RECEIVED');
console.log('PASS PROG-124-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-NOT-VALIDATED');
console.log('PASS PROG-124-HUMAN-REMEDIATION-ACTION-NOT-COMPLETED');
console.log('PASS PROG-124-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-124-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-NOT-ISSUED');
console.log('PASS PROG-124-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-124-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-124-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-124-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-124-AI-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT-AUTHORITY-DISALLOWED');
console.log('PASS PROG-124-NEXT-PROG-125-RECORDED');
console.log('PASS PROG-124-NO-UNSUPPORTED-READINESS-CLAIMS');
