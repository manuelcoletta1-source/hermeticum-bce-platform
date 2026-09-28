'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  recoveryHumanDecisionOptions,
  requiredHumanDecisionResponseFields,
  buildHumanDecisionRequestPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionRequest
} = require('../../../runtime/level1/build-prog-132-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-request.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-132-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-request.json';
const mdPath = 'docs/launch/level1/prog-132-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-request.md';
const runtimePath = 'runtime/level1/build-prog-132-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-request.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-132-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-REQUEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_REQUEST');
assert.equal(doc.issue_id, 'PROG-132');
assert.equal(doc.level1_public_surface_observation_human_action_completion_recovery_decision_human_decision_request_status, STATUS);
assert.equal(doc.source_recovery_decision_completion_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_recovery_decision_completion_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionRequest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildHumanDecisionRequestPayload(source);
const request = doc.public_surface_observation_human_action_completion_recovery_decision_human_decision_request;

assert.equal(request.human_decision_request_payload_digest, sha256Digest(expectedPayload));
assert.equal(request.human_decision_request_status, 'ISSUED_PENDING_HUMAN_DECISION');
assert.equal(request.human_decision_request_result, 'HUMAN_DECISION_REQUIRED_NOT_RECEIVED');

assert.equal(request.imported_recovery_decision_completion_gate_status, 'BLOCKED_PENDING_HUMAN_DECISION');
assert.equal(request.imported_recovery_decision_completion_gate_passed, false);
assert.equal(request.imported_recovery_decision_completion_gate_blocked, true);
assert.equal(request.imported_recovery_decision_completion_gate_blocked_pending_human_decision, true);
assert.equal(request.imported_recovery_decision_recorded, false);
assert.equal(request.imported_recovery_decision_validated, false);
assert.equal(request.imported_recovery_decision_pending_human_decision, true);
assert.equal(request.imported_recovery_decision_selected, false);
assert.equal(request.imported_recovery_decision_execution_allowed, false);
assert.equal(request.imported_recovery_decision_execution_performed, false);
assert.equal(request.imported_fail_closed_snapshot_active, true);
assert.equal(request.imported_fail_closed_remains_active, true);
assert.equal(request.imported_no_state_unlock, true);

assert.equal(request.human_decision_request_defined, true);
assert.equal(request.human_decision_request_ready, true);
assert.equal(request.human_decision_request_evaluated, true);
assert.equal(request.human_decision_request_required, true);
assert.equal(request.human_decision_request_issued, true);
assert.equal(request.human_decision_request_delivered, false);
assert.equal(request.human_decision_request_acknowledged, false);
assert.equal(request.human_decision_request_pending_human_decision, true);

assert.equal(request.human_decision_response_required, true);
assert.equal(request.human_decision_response_received, false);
assert.equal(request.human_decision_response_validated, false);
assert.equal(request.human_decision_recorded, false);
assert.equal(request.human_decision_validated, false);
assert.equal(request.human_decision_owner_ref, null);
assert.equal(request.selected_recovery_decision_option, null);
assert.equal(request.human_decision_recorded_at, null);
assert.equal(request.human_decision_channel, null);
assert.equal(request.human_decision_statement, null);
assert.equal(request.human_decision_signature_ref, null);

assert.deepEqual(request.recovery_human_decision_options, recoveryHumanDecisionOptions());
assert.equal(request.recovery_human_decision_option_count, recoveryHumanDecisionOptions().length);
assert.deepEqual(request.required_human_decision_response_fields, requiredHumanDecisionResponseFields());
assert.deepEqual(request.missing_human_decision_response_fields, requiredHumanDecisionResponseFields());

assert.equal(request.recovery_decision_completion_gate_passed, false);
assert.equal(request.recovery_decision_completion_gate_blocked, true);
assert.equal(request.recovery_decision_completion_gate_blocked_pending_human_decision, true);
assert.equal(request.recovery_decision_recorded, false);
assert.equal(request.recovery_decision_validated, false);
assert.equal(request.recovery_decision_pending_human_decision, true);
assert.equal(request.recovery_decision_selected, false);
assert.equal(request.recovery_decision_execution_allowed, false);
assert.equal(request.recovery_decision_execution_performed, false);
assert.equal(request.fail_closed_snapshot_recorded, true);
assert.equal(request.fail_closed_snapshot_active, true);
assert.equal(request.fail_closed_remains_active, true);
assert.equal(request.no_state_unlock, true);
assert.equal(request.human_remediation_action_completed, false);
assert.equal(request.human_action_completed, false);
assert.equal(request.operator_input_bundle_submission_request_issued, false);
assert.equal(request.operator_input_bundle_submitted, false);
assert.equal(request.operator_inputs_verified, false);
assert.equal(request.public_surface_observed, false);
assert.equal(request.public_surface_observation_ready, false);
assert.equal(request.external_customer_ready, false);
assert.equal(request.banking_pack_ready, false);
assert.equal(request.level1_launch_ready, false);
assert.equal(request.production_ready, false);
assert.equal(request.ai_authority_allowed, false);

assert.equal(request.human_decision_request_controls.includes('do_not_unlock_readiness_from_human_decision_request'), true);
assert.equal(request.human_decision_request_controls.includes('do_not_execute_recovery_from_human_decision_request'), true);
assert.equal(request.human_decision_request_controls.includes('do_not_authorize_ai_authority'), true);

assert.equal(request.human_decision_request_boundary.request_only, true);
assert.equal(request.human_decision_request_boundary.pending_human_decision, true);
assert.equal(request.human_decision_request_boundary.no_human_decision_received, true);
assert.equal(request.human_decision_request_boundary.no_human_decision_validated, true);
assert.equal(request.human_decision_request_boundary.no_recovery_option_selected, true);
assert.equal(request.human_decision_request_boundary.no_recovery_decision_recorded, true);
assert.equal(request.human_decision_request_boundary.no_recovery_decision_validated, true);
assert.equal(request.human_decision_request_boundary.no_recovery_execution_allowed, true);
assert.equal(request.human_decision_request_boundary.no_recovery_execution_performed, true);
assert.equal(request.human_decision_request_boundary.fail_closed_remains_active, true);
assert.equal(request.human_decision_request_boundary.no_state_unlock, true);
assert.equal(request.human_decision_request_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_request_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_request_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_request_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_request_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_request_issued, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_request_pending_human_decision, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_response_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_response_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_recorded, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_completion_gate_blocked, true);
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

assert.equal(doc.next_required_program, 'PROG-133-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.human_decision_received, false);
assert.equal(doc.non_claims.human_decision_validated, false);
assert.equal(doc.non_claims.recovery_decision_recorded, false);
assert.equal(doc.non_claims.recovery_decision_validated, false);
assert.equal(doc.non_claims.recovery_execution_allowed, false);
assert.equal(doc.non_claims.recovery_execution_performed, false);
assert.equal(doc.non_claims.readiness_unlocked, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_REQUEST_ISSUED_PENDING_HUMAN_DECISION/);
assert.match(md, /The human decision request is issued/);
assert.match(md, /The human decision response is not received/);
assert.match(md, /No human decision is recorded/);
assert.match(md, /No recovery execution is allowed/);
assert.match(md, /The fail-closed snapshot remains active/);
assert.match(md, /The human decision request does not unlock readiness/);
assert.match(md, /The human decision request does not authorize AI authority/);
assert.match(md, /PROG-133-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT/);

console.log('PASS PROG-132-HUMAN-DECISION-REQUEST-DOCS-EXIST');
console.log('PASS PROG-132-HASH-STABLE');
console.log('PASS PROG-132-BUILDER-STABLE');
console.log('PASS PROG-132-SOURCE-PROG-131-INTEGRITY-VALID');
console.log('PASS PROG-132-HUMAN-DECISION-REQUEST-DEFINED');
console.log('PASS PROG-132-HUMAN-DECISION-REQUEST-READY');
console.log('PASS PROG-132-HUMAN-DECISION-REQUEST-ISSUED');
console.log('PASS PROG-132-HUMAN-DECISION-PENDING');
console.log('PASS PROG-132-HUMAN-DECISION-RESPONSE-NOT-RECEIVED');
console.log('PASS PROG-132-HUMAN-DECISION-RESPONSE-NOT-VALIDATED');
console.log('PASS PROG-132-HUMAN-DECISION-NOT-RECORDED');
console.log('PASS PROG-132-RECOVERY-EXECUTION-NOT-ALLOWED');
console.log('PASS PROG-132-FAIL-CLOSED-REMAINS-ACTIVE');
console.log('PASS PROG-132-NO-READINESS-UNLOCK');
console.log('PASS PROG-132-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-132-NEXT-PROG-133-RECORDED');
console.log('PASS PROG-132-NO-UNSUPPORTED-READINESS-CLAIMS');
