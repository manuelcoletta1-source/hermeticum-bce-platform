'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  escalationCompletionGateCriteria,
  buildObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGatePayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGate
} = require('../../../runtime/level1/build-prog-128-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-completion-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-128-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-completion-gate.json';
const mdPath = 'docs/launch/level1/prog-128-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-completion-gate.md';
const runtimePath = 'runtime/level1/build-prog-128-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-completion-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-128-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-COMPLETION-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ESCALATION_COMPLETION_GATE');
assert.equal(doc.issue_id, 'PROG-128');
assert.equal(doc.level1_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_status, STATUS);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGatePayload(source);
const gate = doc.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate;

assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_result, 'ESCALATION_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED');

assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_status, 'DEFINED_PENDING_ACKNOWLEDGMENT');
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_ready, true);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_required, true);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received, false);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated, false);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_pending, true);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received, false);
assert.equal(gate.imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated, false);

assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_item_count, 4);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_items.length, 4);
assert.equal(gate.all_escalation_completion_gate_items_required, true);
assert.equal(gate.all_escalation_completion_gate_items_defined, true);
assert.equal(gate.all_escalation_completion_gate_items_ready, true);
assert.equal(gate.all_escalation_completion_gate_items_evaluated, true);
assert.equal(gate.all_escalation_completion_gate_items_not_passed, true);
assert.equal(gate.all_escalation_completion_gate_items_blocked, true);
assert.equal(gate.all_escalation_completion_gate_items_blocked_pending_acknowledgment, true);
assert.equal(gate.all_escalation_completion_gate_items_source_escalation_acknowledgment_not_received, true);
assert.equal(gate.all_escalation_completion_gate_items_source_escalation_acknowledgment_not_validated, true);
assert.equal(gate.all_escalation_completion_gate_items_source_retry_acknowledgment_not_received, true);
assert.equal(gate.all_escalation_completion_gate_items_source_retry_acknowledgment_not_validated, true);
assert.equal(gate.all_escalation_completion_gate_items_human_remediation_not_completed, true);
assert.equal(gate.all_escalation_completion_gate_items_human_action_not_completed, true);
assert.equal(gate.all_escalation_completion_gate_items_bundle_request_not_issued, true);
assert.equal(gate.all_escalation_completion_gate_items_operator_inputs_not_verified, true);

for (const item of gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_items) {
  assert.match(item.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_item_id, /^PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-COMPLETION-GATE::HBCE-L1::/);
  assert.equal(item.escalation_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
  assert.equal(item.escalation_completion_gate_passed, false);
  assert.equal(item.escalation_completion_gate_blocked, true);
  assert.equal(item.source_escalation_acknowledgment_received, false);
  assert.equal(item.source_escalation_acknowledgment_validated, false);
  assert.equal(item.source_retry_acknowledgment_received, false);
  assert.equal(item.source_retry_acknowledgment_validated, false);
  for (const criterion of escalationCompletionGateCriteria()) {
    assert.equal(item.escalation_completion_gate_blocking_criteria.includes(criterion), true);
  }
}

assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_defined, true);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_ready, true);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_evaluated, true);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_required, true);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_passed, false);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked, true);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received, false);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated, false);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_acknowledgment_received, false);
assert.equal(gate.human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated, false);
assert.equal(gate.human_remediation_action_completed, false);
assert.equal(gate.human_action_completed, false);
assert.equal(gate.operator_input_bundle_submission_request_issued, false);
assert.equal(gate.operator_input_bundle_submitted, false);
assert.equal(gate.operator_inputs_verified, false);
assert.equal(gate.public_surface_observed, false);
assert.equal(gate.public_surface_observation_ready, false);
assert.equal(gate.external_customer_ready, false);
assert.equal(gate.banking_pack_ready, false);
assert.equal(gate.level1_launch_ready, false);
assert.equal(gate.production_ready, false);
assert.equal(gate.ai_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_authority_allowed, false);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(doc.readiness_state.human_remediation_action_completed, false);
assert.equal(doc.readiness_state.human_action_completed, false);
assert.equal(doc.next_required_program, 'PROG-129-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-FAIL-CLOSED-SNAPSHOT');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.escalation_acknowledgment_received, false);
assert.equal(doc.non_claims.escalation_acknowledgment_validated, false);
assert.equal(doc.non_claims.escalation_completion_gate_passed, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ESCALATION_COMPLETION_GATE_BLOCKED_PENDING_ACKNOWLEDGMENT/);
assert.match(md, /The escalation completion gate did not pass/);
assert.match(md, /The escalation acknowledgment is not received/);
assert.match(md, /Human action is not completed/);
assert.match(md, /PROG-129-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-FAIL-CLOSED-SNAPSHOT/);

console.log('PASS PROG-128-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-COMPLETION-GATE-DOCS-EXIST');
console.log('PASS PROG-128-HASH-STABLE');
console.log('PASS PROG-128-BUILDER-STABLE');
console.log('PASS PROG-128-SOURCE-PROG-127-INTEGRITY-VALID');
console.log('PASS PROG-128-ESCALATION-COMPLETION-GATE-ITEMS-DEFINED');
console.log('PASS PROG-128-ESCALATION-COMPLETION-GATE-READY');
console.log('PASS PROG-128-ESCALATION-COMPLETION-GATE-BLOCKED');
console.log('PASS PROG-128-ESCALATION-COMPLETION-GATE-NOT-PASSED');
console.log('PASS PROG-128-ESCALATION-ACKNOWLEDGMENT-NOT-RECEIVED');
console.log('PASS PROG-128-ESCALATION-ACKNOWLEDGMENT-NOT-VALIDATED');
console.log('PASS PROG-128-HUMAN-REMEDIATION-ACTION-NOT-COMPLETED');
console.log('PASS PROG-128-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-128-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-NOT-ISSUED');
console.log('PASS PROG-128-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-128-NEXT-PROG-129-RECORDED');
console.log('PASS PROG-128-NO-UNSUPPORTED-READINESS-CLAIMS');
