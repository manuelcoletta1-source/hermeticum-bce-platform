'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  humanDecisionCompletionGateCriteria,
  buildHumanDecisionCompletionGatePayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionCompletionGate
} = require('../../../runtime/level1/build-prog-134-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-completion-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-134-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-completion-gate.json';
const mdPath = 'docs/launch/level1/prog-134-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-completion-gate.md';
const runtimePath = 'runtime/level1/build-prog-134-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-completion-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-134-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-COMPLETION-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_COMPLETION_GATE');
assert.equal(doc.issue_id, 'PROG-134');
assert.equal(doc.level1_public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_status, STATUS);
assert.equal(doc.source_human_decision_acknowledgment_revision_hash, source.revision_hash);
assert.equal(doc.source_human_decision_acknowledgment_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionCompletionGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildHumanDecisionCompletionGatePayload(source);
const gate = doc.public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate;

assert.equal(gate.human_decision_completion_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.human_decision_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
assert.equal(gate.human_decision_completion_gate_result, 'HUMAN_DECISION_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED');

assert.equal(gate.imported_human_decision_acknowledgment_status, 'DEFINED_PENDING_ACKNOWLEDGMENT');
assert.equal(gate.imported_human_decision_acknowledgment_defined, true);
assert.equal(gate.imported_human_decision_acknowledgment_ready, true);
assert.equal(gate.imported_human_decision_acknowledgment_evaluated, true);
assert.equal(gate.imported_human_decision_acknowledgment_required, true);
assert.equal(gate.imported_human_decision_acknowledgment_received, false);
assert.equal(gate.imported_human_decision_acknowledgment_validated, false);
assert.equal(gate.imported_human_decision_acknowledgment_pending, true);
assert.equal(gate.imported_human_decision_response_received, false);
assert.equal(gate.imported_human_decision_response_validated, false);
assert.equal(gate.imported_human_decision_recorded, false);
assert.equal(gate.imported_human_decision_validated, false);

assert.equal(gate.human_decision_completion_gate_defined, true);
assert.equal(gate.human_decision_completion_gate_ready, true);
assert.equal(gate.human_decision_completion_gate_evaluated, true);
assert.equal(gate.human_decision_completion_gate_required, true);
assert.equal(gate.human_decision_completion_gate_passed, false);
assert.equal(gate.human_decision_completion_gate_blocked, true);
assert.equal(gate.human_decision_completion_gate_blocked_pending_acknowledgment, true);

assert.equal(gate.human_decision_acknowledgment_received, false);
assert.equal(gate.human_decision_acknowledgment_validated, false);
assert.equal(gate.human_decision_acknowledgment_pending, true);
assert.equal(gate.human_decision_response_received, false);
assert.equal(gate.human_decision_response_validated, false);
assert.equal(gate.human_decision_recorded, false);
assert.equal(gate.human_decision_validated, false);
assert.equal(gate.selected_recovery_decision_option, null);

assert.equal(gate.recovery_decision_recorded, false);
assert.equal(gate.recovery_decision_validated, false);
assert.equal(gate.recovery_decision_pending_human_decision, true);
assert.equal(gate.recovery_decision_execution_allowed, false);
assert.equal(gate.recovery_decision_execution_performed, false);

assert.equal(gate.fail_closed_snapshot_active, true);
assert.equal(gate.fail_closed_remains_active, true);
assert.equal(gate.no_state_unlock, true);

assert.equal(gate.escalation_acknowledgment_received, false);
assert.equal(gate.escalation_acknowledgment_validated, false);
assert.equal(gate.retry_acknowledgment_received, false);
assert.equal(gate.retry_acknowledgment_validated, false);
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
assert.equal(gate.ai_authority_allowed, false);

assert.deepEqual(gate.human_decision_completion_gate_blocking_criteria, humanDecisionCompletionGateCriteria());

assert.equal(gate.human_decision_completion_gate_boundary.completion_gate_only, true);
assert.equal(gate.human_decision_completion_gate_boundary.blocked_pending_acknowledgment, true);
assert.equal(gate.human_decision_completion_gate_boundary.no_human_decision_acknowledgment_received, true);
assert.equal(gate.human_decision_completion_gate_boundary.no_human_decision_acknowledgment_validated, true);
assert.equal(gate.human_decision_completion_gate_boundary.no_human_decision_response_received, true);
assert.equal(gate.human_decision_completion_gate_boundary.no_human_decision_recorded, true);
assert.equal(gate.human_decision_completion_gate_boundary.no_recovery_execution_allowed, true);
assert.equal(gate.human_decision_completion_gate_boundary.fail_closed_remains_active, true);
assert.equal(gate.human_decision_completion_gate_boundary.no_state_unlock, true);
assert.equal(gate.human_decision_completion_gate_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_pending, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_response_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_response_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_recorded, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_execution_allowed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_execution_performed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_fail_closed_snapshot_active, true);
assert.equal(doc.readiness_state.human_remediation_action_completed, false);
assert.equal(doc.readiness_state.human_action_completed, false);
assert.equal(doc.readiness_state.operator_input_bundle_submission_request_issued, false);
assert.equal(doc.readiness_state.operator_input_bundle_submitted, false);
assert.equal(doc.readiness_state.operator_inputs_verified, false);
assert.equal(doc.readiness_state.public_surface_observed, false);
assert.equal(doc.readiness_state.public_surface_observation_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-135-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-RETRY-REQUEST');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.human_decision_completion_gate_passed, false);
assert.equal(doc.non_claims.human_decision_acknowledgment_received, false);
assert.equal(doc.non_claims.human_decision_acknowledgment_validated, false);
assert.equal(doc.non_claims.human_decision_received, false);
assert.equal(doc.non_claims.human_decision_validated, false);
assert.equal(doc.non_claims.recovery_decision_recorded, false);
assert.equal(doc.non_claims.recovery_decision_validated, false);
assert.equal(doc.non_claims.recovery_execution_allowed, false);
assert.equal(doc.non_claims.recovery_execution_performed, false);
assert.equal(doc.non_claims.readiness_unlocked, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_COMPLETION_GATE_BLOCKED_PENDING_ACKNOWLEDGMENT/);
assert.match(md, /The human decision completion gate did not pass/);
assert.match(md, /The human decision completion gate is blocked pending acknowledgment/);
assert.match(md, /The human decision acknowledgment is not received/);
assert.match(md, /No human decision is recorded/);
assert.match(md, /No recovery execution is allowed/);
assert.match(md, /The fail-closed snapshot remains active/);
assert.match(md, /The human decision completion gate does not unlock readiness/);
assert.match(md, /The human decision completion gate does not authorize AI authority/);
assert.match(md, /PROG-135-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-RETRY-REQUEST/);

console.log('PASS PROG-134-HUMAN-DECISION-COMPLETION-GATE-DOCS-EXIST');
console.log('PASS PROG-134-HASH-STABLE');
console.log('PASS PROG-134-BUILDER-STABLE');
console.log('PASS PROG-134-SOURCE-PROG-133-INTEGRITY-VALID');
console.log('PASS PROG-134-HUMAN-DECISION-COMPLETION-GATE-DEFINED');
console.log('PASS PROG-134-HUMAN-DECISION-COMPLETION-GATE-READY');
console.log('PASS PROG-134-HUMAN-DECISION-COMPLETION-GATE-BLOCKED');
console.log('PASS PROG-134-HUMAN-DECISION-COMPLETION-GATE-NOT-PASSED');
console.log('PASS PROG-134-HUMAN-DECISION-ACKNOWLEDGMENT-NOT-RECEIVED');
console.log('PASS PROG-134-HUMAN-DECISION-ACKNOWLEDGMENT-NOT-VALIDATED');
console.log('PASS PROG-134-HUMAN-DECISION-NOT-RECORDED');
console.log('PASS PROG-134-RECOVERY-EXECUTION-NOT-ALLOWED');
console.log('PASS PROG-134-FAIL-CLOSED-REMAINS-ACTIVE');
console.log('PASS PROG-134-NO-READINESS-UNLOCK');
console.log('PASS PROG-134-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-134-NEXT-PROG-135-RECORDED');
console.log('PASS PROG-134-NO-UNSUPPORTED-READINESS-CLAIMS');
