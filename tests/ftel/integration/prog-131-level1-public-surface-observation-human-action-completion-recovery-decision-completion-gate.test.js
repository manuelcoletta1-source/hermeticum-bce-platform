'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  recoveryCompletionGateCriteria,
  buildRecoveryDecisionCompletionGatePayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionCompletionGate
} = require('../../../runtime/level1/build-prog-131-level1-public-surface-observation-human-action-completion-recovery-decision-completion-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-131-level1-public-surface-observation-human-action-completion-recovery-decision-completion-gate.json';
const mdPath = 'docs/launch/level1/prog-131-level1-public-surface-observation-human-action-completion-recovery-decision-completion-gate.md';
const runtimePath = 'runtime/level1/build-prog-131-level1-public-surface-observation-human-action-completion-recovery-decision-completion-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-131-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-COMPLETION-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_COMPLETION_GATE');
assert.equal(doc.issue_id, 'PROG-131');
assert.equal(doc.level1_public_surface_observation_human_action_completion_recovery_decision_completion_gate_status, STATUS);
assert.equal(doc.source_recovery_decision_revision_hash, source.revision_hash);
assert.equal(doc.source_recovery_decision_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionCompletionGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildRecoveryDecisionCompletionGatePayload(source);
const gate = doc.public_surface_observation_human_action_completion_recovery_decision_completion_gate;

assert.equal(gate.recovery_decision_completion_gate_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.recovery_decision_completion_gate_status, 'BLOCKED_PENDING_HUMAN_DECISION');
assert.equal(gate.recovery_decision_completion_gate_result, 'RECOVERY_DECISION_REQUIRED_NOT_RECORDED');

assert.equal(gate.imported_recovery_decision_status, 'DEFINED_PENDING_HUMAN_DECISION');
assert.equal(gate.imported_recovery_decision_defined, true);
assert.equal(gate.imported_recovery_decision_ready, true);
assert.equal(gate.imported_recovery_decision_evaluated, true);
assert.equal(gate.imported_recovery_decision_required, true);
assert.equal(gate.imported_recovery_decision_recorded, false);
assert.equal(gate.imported_recovery_decision_validated, false);
assert.equal(gate.imported_recovery_decision_pending_human_decision, true);
assert.equal(gate.imported_recovery_decision_selected, false);
assert.equal(gate.imported_recovery_decision_execution_allowed, false);
assert.equal(gate.imported_recovery_decision_execution_performed, false);

assert.equal(gate.imported_recovery_decision_owner_ref, null);
assert.equal(gate.imported_selected_recovery_decision_option, null);
assert.equal(gate.imported_recovery_decided_at, null);
assert.equal(gate.imported_recovery_decision_channel, null);
assert.equal(gate.imported_recovery_decision_statement, null);
assert.equal(gate.imported_recovery_decision_signature_ref, null);

assert.equal(gate.imported_fail_closed_snapshot_recorded, true);
assert.equal(gate.imported_fail_closed_snapshot_active, true);
assert.equal(gate.imported_fail_closed_remains_active, true);
assert.equal(gate.imported_no_state_unlock, true);

assert.equal(gate.recovery_decision_completion_gate_defined, true);
assert.equal(gate.recovery_decision_completion_gate_ready, true);
assert.equal(gate.recovery_decision_completion_gate_evaluated, true);
assert.equal(gate.recovery_decision_completion_gate_required, true);
assert.equal(gate.recovery_decision_completion_gate_passed, false);
assert.equal(gate.recovery_decision_completion_gate_blocked, true);
assert.equal(gate.recovery_decision_completion_gate_blocked_pending_human_decision, true);

assert.equal(gate.recovery_decision_recorded, false);
assert.equal(gate.recovery_decision_validated, false);
assert.equal(gate.recovery_decision_pending_human_decision, true);
assert.equal(gate.recovery_decision_selected, false);
assert.equal(gate.recovery_decision_execution_allowed, false);
assert.equal(gate.recovery_decision_execution_performed, false);

assert.equal(gate.fail_closed_snapshot_recorded, true);
assert.equal(gate.fail_closed_snapshot_active, true);
assert.equal(gate.fail_closed_remains_active, true);
assert.equal(gate.no_state_unlock, true);

assert.equal(gate.escalation_completion_gate_passed, false);
assert.equal(gate.escalation_completion_gate_blocked, true);
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

assert.deepEqual(gate.recovery_decision_completion_gate_blocking_criteria, recoveryCompletionGateCriteria());

assert.equal(gate.recovery_decision_completion_gate_boundary.completion_gate_only, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.pending_human_decision, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.no_recovery_decision_recorded, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.no_recovery_decision_validated, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.no_recovery_option_selected, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.no_recovery_execution_allowed, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.no_recovery_execution_performed, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.fail_closed_remains_active, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.no_state_unlock, true);
assert.equal(gate.recovery_decision_completion_gate_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_blocked_pending_human_decision, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_recorded, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_pending_human_decision, true);
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

assert.equal(doc.next_required_program, 'PROG-132-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-REQUEST');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.recovery_decision_completion_gate_passed, false);
assert.equal(doc.non_claims.recovery_decision_recorded, false);
assert.equal(doc.non_claims.recovery_decision_validated, false);
assert.equal(doc.non_claims.recovery_execution_allowed, false);
assert.equal(doc.non_claims.recovery_execution_performed, false);
assert.equal(doc.non_claims.readiness_unlocked, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_COMPLETION_GATE_BLOCKED_PENDING_HUMAN_DECISION/);
assert.match(md, /The recovery decision completion gate did not pass/);
assert.match(md, /The recovery decision completion gate is blocked pending human decision/);
assert.match(md, /The fail-closed snapshot remains active/);
assert.match(md, /The recovery decision completion gate does not unlock readiness/);
assert.match(md, /The recovery decision completion gate does not authorize AI authority/);
assert.match(md, /PROG-132-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-REQUEST/);

console.log('PASS PROG-131-RECOVERY-DECISION-COMPLETION-GATE-DOCS-EXIST');
console.log('PASS PROG-131-HASH-STABLE');
console.log('PASS PROG-131-BUILDER-STABLE');
console.log('PASS PROG-131-SOURCE-PROG-130-INTEGRITY-VALID');
console.log('PASS PROG-131-RECOVERY-DECISION-COMPLETION-GATE-DEFINED');
console.log('PASS PROG-131-RECOVERY-DECISION-COMPLETION-GATE-READY');
console.log('PASS PROG-131-RECOVERY-DECISION-COMPLETION-GATE-BLOCKED');
console.log('PASS PROG-131-RECOVERY-DECISION-COMPLETION-GATE-NOT-PASSED');
console.log('PASS PROG-131-RECOVERY-DECISION-PENDING-HUMAN-DECISION');
console.log('PASS PROG-131-RECOVERY-DECISION-NOT-RECORDED');
console.log('PASS PROG-131-RECOVERY-DECISION-NOT-VALIDATED');
console.log('PASS PROG-131-RECOVERY-EXECUTION-NOT-ALLOWED');
console.log('PASS PROG-131-FAIL-CLOSED-REMAINS-ACTIVE');
console.log('PASS PROG-131-NO-READINESS-UNLOCK');
console.log('PASS PROG-131-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-131-NEXT-PROG-132-RECORDED');
console.log('PASS PROG-131-NO-UNSUPPORTED-READINESS-CLAIMS');
