'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredEscalationAcknowledgmentFields,
  buildObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationRequestPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationRequest
} = require('../../../runtime/level1/build-prog-126-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-request.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-126-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-request.json';
const mdPath = 'docs/launch/level1/prog-126-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-request.md';
const runtimePath = 'runtime/level1/build-prog-126-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-request.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-126-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ESCALATION_REQUEST');
assert.equal(doc.issue_id, 'PROG-126');
assert.equal(doc.level1_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_status, STATUS);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationRequest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationRequestPayload(source);
const esc = doc.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request;

assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_payload_digest, sha256Digest(expectedPayload));
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_status, 'ISSUED_PENDING_ESCALATION_ACKNOWLEDGMENT');
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_result, 'ESCALATION_REQUIRED_RETRY_COMPLETION_GATE_BLOCKED');

assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_ready, true);
assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_required, true);
assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_passed, false);
assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked, true);
assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received, false);
assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated, false);
assert.equal(esc.imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending, true);

assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_item_count, 4);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_items.length, 4);
assert.equal(esc.all_retry_completion_gate_items_have_escalation_request_items, true);
assert.equal(esc.all_escalation_request_items_required, true);
assert.equal(esc.all_escalation_request_items_defined, true);
assert.equal(esc.all_escalation_request_items_ready, true);
assert.equal(esc.all_escalation_request_items_evaluated, true);
assert.equal(esc.all_escalation_request_items_issued, true);
assert.equal(esc.all_escalation_request_items_pending_acknowledgment, true);
assert.equal(esc.all_escalation_request_items_acknowledgment_required, true);
assert.equal(esc.all_escalation_request_items_acknowledgment_not_received, true);
assert.equal(esc.all_escalation_request_items_acknowledgment_not_validated, true);
assert.equal(esc.all_escalation_request_items_acknowledgment_pending, true);
assert.equal(esc.all_escalation_request_items_acknowledgment_missing, true);
assert.equal(esc.all_escalation_request_items_source_gate_blocked, true);
assert.equal(esc.all_escalation_request_items_source_gate_not_passed, true);
assert.equal(esc.all_escalation_request_items_source_retry_acknowledgment_not_received, true);
assert.equal(esc.all_escalation_request_items_source_retry_acknowledgment_not_validated, true);
assert.equal(esc.all_escalation_request_items_human_remediation_not_acknowledged, true);
assert.equal(esc.all_escalation_request_items_human_remediation_not_completed, true);
assert.equal(esc.all_escalation_request_items_human_action_not_completed, true);
assert.equal(esc.all_escalation_request_items_bundle_request_not_issued, true);
assert.equal(esc.all_escalation_request_items_bundle_not_submitted, true);
assert.equal(esc.all_escalation_request_items_operator_inputs_not_collected, true);
assert.equal(esc.all_escalation_request_items_operator_inputs_not_submitted, true);
assert.equal(esc.all_escalation_request_items_operator_inputs_not_verified, true);
assert.equal(esc.all_escalation_request_items_public_surface_not_observed, true);
assert.equal(esc.all_escalation_request_items_public_surface_observation_not_ready, true);

for (const item of esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_items) {
  assert.match(item.human_action_completion_remediation_acknowledgment_retry_escalation_request_item_id, /^PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST::HBCE-L1::/);
  assert.equal(item.escalation_request_status, 'ISSUED_PENDING_ESCALATION_ACKNOWLEDGMENT');
  assert.equal(item.escalation_request_result, 'ESCALATION_REQUIRED_RETRY_COMPLETION_GATE_BLOCKED');
  assert.equal(item.escalation_request_reason, 'RETRY_COMPLETION_GATE_BLOCKED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.source_retry_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.source_retry_completion_gate_passed, false);
  assert.equal(item.source_retry_completion_gate_blocked, true);
  assert.equal(item.source_retry_completion_gate_blocked_pending_acknowledgment, true);
  assert.equal(item.source_retry_acknowledgment_received, false);
  assert.equal(item.source_retry_acknowledgment_validated, false);
  assert.equal(item.source_retry_acknowledgment_missing, true);
  assert.equal(item.escalation_request_required, true);
  assert.equal(item.escalation_request_defined, true);
  assert.equal(item.escalation_request_ready, true);
  assert.equal(item.escalation_request_evaluated, true);
  assert.equal(item.escalation_request_issued, true);
  assert.equal(item.escalation_request_pending_acknowledgment, true);
  assert.equal(item.escalation_acknowledgment_required, true);
  assert.equal(item.escalation_acknowledgment_received, false);
  assert.equal(item.escalation_acknowledgment_validated, false);
  assert.equal(item.escalation_acknowledgment_pending, true);
  assert.equal(item.escalation_acknowledgment_missing, true);

  for (const field of requiredEscalationAcknowledgmentFields()) {
    assert.equal(item.required_escalation_acknowledgment_fields.includes(field), true);
    assert.equal(item.missing_escalation_acknowledgment_fields.includes(field), true);
  }

  assert.equal(item.escalation_owner_ref, null);
  assert.equal(item.escalation_requested_at, null);
  assert.equal(item.escalation_channel, null);
  assert.equal(item.escalation_acknowledged_at, null);
  assert.equal(item.escalation_acknowledgment_channel, null);
  assert.equal(item.escalation_acknowledgment_statement, null);
  assert.equal(item.escalation_acknowledgment_signature_ref, null);
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

assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_defined, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_ready, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_evaluated, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_required, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_issued, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_pending_acknowledgment, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received, false);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated, false);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_pending, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_completion_gate_passed, false);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_acknowledgment_received, false);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated, false);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending, true);
assert.equal(esc.human_remediation_action_requested, true);
assert.equal(esc.human_remediation_action_acknowledged, false);
assert.equal(esc.human_remediation_action_completed, false);
assert.equal(esc.human_action_completed, false);
assert.equal(esc.operator_input_bundle_submission_request_issued, false);
assert.equal(esc.operator_input_bundle_submitted, false);
assert.equal(esc.operator_inputs_collected, false);
assert.equal(esc.operator_inputs_submitted, false);
assert.equal(esc.operator_inputs_verified, false);
assert.equal(esc.public_surface_observed, false);
assert.equal(esc.public_surface_observation_ready, false);
assert.equal(esc.external_customer_ready, false);
assert.equal(esc.banking_pack_ready, false);
assert.equal(esc.level1_launch_ready, false);
assert.equal(esc.production_ready, false);
assert.equal(esc.ai_human_action_completion_remediation_acknowledgment_retry_escalation_request_authority_allowed, false);

assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.controlled_information_surface_only, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.escalation_request_only, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.escalation_request_issued_pending_acknowledgment, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_escalation_acknowledgment_received, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_escalation_acknowledgment_validated, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_retry_acknowledgment_received, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_retry_acknowledgment_validated, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_human_remediation_action_completed, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_human_action_completed, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_operator_input_bundle_submission_request_issued, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_operator_input_bundle_submitted, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_operator_inputs_collected, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_operator_inputs_submitted, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_operator_inputs_verified, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_public_observation_recorded, true);
assert.equal(esc.human_action_completion_remediation_acknowledgment_retry_escalation_request_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_issued, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_pending_acknowledgment, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated, false);
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

assert.equal(doc.next_required_program, 'PROG-127-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-ACKNOWLEDGMENT');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.escalation_acknowledgment_received, false);
assert.equal(doc.non_claims.escalation_acknowledgment_validated, false);
assert.equal(doc.non_claims.retry_acknowledgment_received, false);
assert.equal(doc.non_claims.retry_acknowledgment_validated, false);
assert.equal(doc.non_claims.retry_completion_gate_passed, false);
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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ESCALATION_REQUEST_ISSUED_PENDING_ESCALATION_ACKNOWLEDGMENT/);
assert.match(md, /The escalation request is issued/);
assert.match(md, /The escalation acknowledgment is not received/);
assert.match(md, /The retry acknowledgment is not received/);
assert.match(md, /Human remediation action is not completed/);
assert.match(md, /The operator input bundle submission request is not issued/);
assert.match(md, /PROG-127-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-ACKNOWLEDGMENT/);

console.log('PASS PROG-126-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST-DOCS-EXIST');
console.log('PASS PROG-126-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST-HASH-STABLE');
console.log('PASS PROG-126-BUILDER-STABLE');
console.log('PASS PROG-126-SOURCE-PROG-125-INTEGRITY-VALID');
console.log('PASS PROG-126-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST-ITEMS-DEFINED');
console.log('PASS PROG-126-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST-READY');
console.log('PASS PROG-126-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST-ISSUED');
console.log('PASS PROG-126-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST-PENDING');
console.log('PASS PROG-126-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-NOT-RECEIVED');
console.log('PASS PROG-126-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-NOT-VALIDATED');
console.log('PASS PROG-126-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-NOT-RECEIVED');
console.log('PASS PROG-126-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-NOT-VALIDATED');
console.log('PASS PROG-126-HUMAN-REMEDIATION-ACTION-NOT-COMPLETED');
console.log('PASS PROG-126-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-126-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-NOT-ISSUED');
console.log('PASS PROG-126-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-126-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-126-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-126-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-126-AI-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST-AUTHORITY-DISALLOWED');
console.log('PASS PROG-126-NEXT-PROG-127-RECORDED');
console.log('PASS PROG-126-NO-UNSUPPORTED-READINESS-CLAIMS');
