'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  completionGateCriteria,
  buildObservationHumanActionCompletionRemediationCompletionGatePayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationCompletionGate
} = require('../../../runtime/level1/build-prog-122-level1-public-surface-observation-human-action-completion-remediation-completion-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-122-level1-public-surface-observation-human-action-completion-remediation-completion-gate.json';
const mdPath = 'docs/launch/level1/prog-122-level1-public-surface-observation-human-action-completion-remediation-completion-gate.md';
const runtimePath = 'runtime/level1/build-prog-122-level1-public-surface-observation-human-action-completion-remediation-completion-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-122-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_COMPLETION_GATE');
assert.equal(doc.issue_id, 'PROG-122');
assert.equal(doc.level1_public_surface_observation_human_action_completion_remediation_completion_gate_status, STATUS);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationCompletionGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationHumanActionCompletionRemediationCompletionGatePayload(source);
const gate = doc.public_surface_observation_human_action_completion_remediation_completion_gate;

assert.equal(gate.human_action_completion_remediation_completion_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.human_action_completion_remediation_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
assert.equal(gate.human_action_completion_remediation_completion_gate_result, 'HUMAN_ACTION_COMPLETION_REMEDIATION_NOT_COMPLETED');

assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_status, 'DEFINED_PENDING_ACKNOWLEDGMENT');
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_ready, true);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_required, true);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_received, false);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_validated, false);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_pending, true);
assert.equal(gate.imported_human_remediation_action_requested, true);
assert.equal(gate.imported_human_remediation_action_acknowledged, false);
assert.equal(gate.imported_human_remediation_action_completed, false);
assert.equal(gate.imported_human_action_completed, false);
assert.equal(gate.imported_operator_input_bundle_submission_request_issued, false);
assert.equal(gate.imported_operator_input_bundle_submitted, false);
assert.equal(gate.imported_operator_inputs_collected, false);
assert.equal(gate.imported_operator_inputs_submitted, false);
assert.equal(gate.imported_operator_inputs_verified, false);

assert.equal(gate.human_action_completion_remediation_completion_gate_item_count, 4);
assert.equal(gate.human_action_completion_remediation_completion_gate_items.length, 4);
assert.equal(gate.all_acknowledgment_items_have_completion_gate_items, true);
assert.equal(gate.all_completion_gate_items_required, true);
assert.equal(gate.all_completion_gate_items_defined, true);
assert.equal(gate.all_completion_gate_items_ready, true);
assert.equal(gate.all_completion_gate_items_evaluated, true);
assert.equal(gate.all_completion_gate_items_not_passed, true);
assert.equal(gate.all_completion_gate_items_blocked, true);
assert.equal(gate.all_completion_gate_items_blocked_pending_acknowledgment, true);
assert.equal(gate.all_completion_gate_items_blocked_pending_human_remediation_completion, true);
assert.equal(gate.all_completion_gate_items_source_acknowledgment_not_received, true);
assert.equal(gate.all_completion_gate_items_source_acknowledgment_not_validated, true);
assert.equal(gate.all_completion_gate_items_source_acknowledgment_missing, true);
assert.equal(gate.all_completion_gate_items_human_remediation_not_acknowledged, true);
assert.equal(gate.all_completion_gate_items_human_remediation_not_completed, true);
assert.equal(gate.all_completion_gate_items_human_action_not_completed, true);
assert.equal(gate.all_completion_gate_items_bundle_request_not_issued, true);
assert.equal(gate.all_completion_gate_items_bundle_not_submitted, true);
assert.equal(gate.all_completion_gate_items_operator_inputs_not_collected, true);
assert.equal(gate.all_completion_gate_items_operator_inputs_not_submitted, true);
assert.equal(gate.all_completion_gate_items_operator_inputs_not_verified, true);
assert.equal(gate.all_completion_gate_items_public_surface_not_observed, true);
assert.equal(gate.all_completion_gate_items_public_surface_observation_not_ready, true);

for (const item of gate.human_action_completion_remediation_completion_gate_items) {
  assert.match(item.human_action_completion_remediation_completion_gate_item_id, /^PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE::HBCE-L1::/);
  assert.equal(item.completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.completion_gate_result, 'HUMAN_ACTION_COMPLETION_REMEDIATION_NOT_COMPLETED');
  assert.equal(item.source_acknowledgment_status, 'PENDING_HUMAN_REMEDIATION_ACKNOWLEDGMENT');
  assert.equal(item.source_acknowledgment_received, false);
  assert.equal(item.source_acknowledgment_validated, false);
  assert.equal(item.source_acknowledgment_missing, true);
  assert.equal(item.completion_gate_required, true);
  assert.equal(item.completion_gate_defined, true);
  assert.equal(item.completion_gate_ready, true);
  assert.equal(item.completion_gate_evaluated, true);
  assert.equal(item.completion_gate_passed, false);
  assert.equal(item.completion_gate_blocked, true);
  assert.equal(item.completion_gate_blocked_pending_acknowledgment, true);
  assert.equal(item.completion_gate_blocked_pending_human_remediation_completion, true);

  for (const criterion of completionGateCriteria()) {
    assert.equal(item.completion_gate_blocking_criteria.includes(criterion), true);
  }

  assert.equal(item.human_remediation_action_requested, true);
  assert.equal(item.human_remediation_action_acknowledged, false);
  assert.equal(item.human_remediation_action_completed, false);
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

assert.equal(gate.human_action_completion_remediation_completion_gate_defined, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_ready, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_evaluated, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_required, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_passed, false);
assert.equal(gate.human_action_completion_remediation_completion_gate_blocked, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_completion_allowed, false);
assert.equal(gate.human_action_completion_remediation_completion_gate_completion_ready, false);
assert.equal(gate.human_action_completion_remediation_completion_gate_completion_performed, false);
assert.equal(gate.human_action_completion_remediation_acknowledgment_received, false);
assert.equal(gate.human_action_completion_remediation_acknowledgment_validated, false);
assert.equal(gate.human_action_completion_remediation_acknowledgment_pending, true);
assert.equal(gate.human_remediation_action_requested, true);
assert.equal(gate.human_remediation_action_acknowledged, false);
assert.equal(gate.human_remediation_action_completed, false);
assert.equal(gate.human_action_completed, false);
assert.equal(gate.operator_input_bundle_submission_request_issued, false);
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
assert.equal(gate.ai_human_action_completion_remediation_completion_gate_authority_allowed, false);

assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.controlled_information_surface_only, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.completion_gate_evaluation_only, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.completion_gate_blocked_pending_acknowledgment, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_remediation_acknowledgment_received, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_remediation_acknowledgment_validated, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_human_remediation_action_completed, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_human_action_completed, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_operator_input_bundle_submission_request_issued, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_operator_input_bundle_submitted, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_operator_inputs_collected, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_operator_inputs_submitted, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_operator_inputs_verified, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_public_observation_recorded, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_boundary.no_ai_authority_claim, true);

assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.source_public_surface_observation_human_action_completion_remediation_acknowledgment_hash_valid, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.source_acknowledgment_defined, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.source_acknowledgment_ready, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.source_acknowledgment_received, false);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.source_acknowledgment_validated, false);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.source_acknowledgment_pending, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.completion_gate_defined, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.completion_gate_ready, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.completion_gate_passed, false);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.completion_gate_blocked, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.completion_gate_blocked_pending_acknowledgment, true);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.human_remediation_action_completed, false);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.operator_inputs_verified, false);
assert.equal(gate.human_action_completion_remediation_completion_gate_checklist.ai_authority_absence_confirmed, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_completion_gate_blocked_pending_human_remediation_completion, true);
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

assert.equal(doc.next_required_program, 'PROG-123-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_COMPLETION_GATE_BLOCKED_PENDING_ACKNOWLEDGMENT/);
assert.match(md, /The human action completion remediation completion gate did not pass/);
assert.match(md, /The human action completion remediation acknowledgment is not received/);
assert.match(md, /Human remediation action is not completed/);
assert.match(md, /The operator input bundle submission request is not issued/);
assert.match(md, /Operator inputs are not verified/);
assert.match(md, /PROG-123-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-REQUEST/);

console.log('PASS PROG-122-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-DOCS-EXIST');
console.log('PASS PROG-122-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-HASH-STABLE');
console.log('PASS PROG-122-BUILDER-STABLE');
console.log('PASS PROG-122-SOURCE-PROG-121-INTEGRITY-VALID');
console.log('PASS PROG-122-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-ITEMS-DEFINED');
console.log('PASS PROG-122-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-READY');
console.log('PASS PROG-122-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-EVALUATED');
console.log('PASS PROG-122-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-BLOCKED');
console.log('PASS PROG-122-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-NOT-PASSED');
console.log('PASS PROG-122-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-NOT-RECEIVED');
console.log('PASS PROG-122-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-NOT-VALIDATED');
console.log('PASS PROG-122-HUMAN-REMEDIATION-ACTION-NOT-COMPLETED');
console.log('PASS PROG-122-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-122-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-NOT-ISSUED');
console.log('PASS PROG-122-OPERATOR-INPUT-BUNDLE-NOT-SUBMITTED');
console.log('PASS PROG-122-OPERATOR-INPUTS-NOT-COLLECTED');
console.log('PASS PROG-122-OPERATOR-INPUTS-NOT-SUBMITTED');
console.log('PASS PROG-122-OPERATOR-INPUTS-NOT-VERIFIED');
console.log('PASS PROG-122-AI-HUMAN-ACTION-COMPLETION-REMEDIATION-COMPLETION-GATE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-122-NEXT-PROG-123-RECORDED');
console.log('PASS PROG-122-NO-UNSUPPORTED-READINESS-CLAIMS');
