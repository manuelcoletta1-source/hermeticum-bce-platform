'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  failClosedReasons,
  buildFailClosedSnapshotPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionFailClosedSnapshot
} = require('../../../runtime/level1/build-prog-129-level1-public-surface-observation-human-action-completion-fail-closed-snapshot.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-129-level1-public-surface-observation-human-action-completion-fail-closed-snapshot.json';
const mdPath = 'docs/launch/level1/prog-129-level1-public-surface-observation-human-action-completion-fail-closed-snapshot.md';
const runtimePath = 'runtime/level1/build-prog-129-level1-public-surface-observation-human-action-completion-fail-closed-snapshot.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-129-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-FAIL-CLOSED-SNAPSHOT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_FAIL_CLOSED_SNAPSHOT');
assert.equal(doc.issue_id, 'PROG-129');
assert.equal(doc.level1_public_surface_observation_human_action_completion_fail_closed_snapshot_status, STATUS);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionFailClosedSnapshot({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildFailClosedSnapshotPayload(source);
const snap = doc.public_surface_observation_human_action_completion_fail_closed_snapshot;

assert.equal(snap.fail_closed_snapshot_payload_digest, sha256Digest(expectedPayload));
assert.equal(snap.fail_closed_snapshot_status, 'RECORDED');
assert.equal(snap.fail_closed_snapshot_result, 'FAIL_CLOSED_CONFIRMED');
assert.equal(snap.fail_closed_required, true);
assert.equal(snap.fail_closed_recorded, true);
assert.equal(snap.fail_closed_active, true);
assert.deepEqual(snap.fail_closed_reasons, failClosedReasons());
assert.equal(snap.fail_closed_reason_count, failClosedReasons().length);

assert.equal(snap.imported_escalation_completion_gate_status, 'BLOCKED_PENDING_ACKNOWLEDGMENT');
assert.equal(snap.imported_escalation_completion_gate_passed, false);
assert.equal(snap.imported_escalation_completion_gate_blocked, true);
assert.equal(snap.imported_escalation_completion_gate_blocked_pending_acknowledgment, true);
assert.equal(snap.imported_escalation_acknowledgment_received, false);
assert.equal(snap.imported_escalation_acknowledgment_validated, false);
assert.equal(snap.imported_retry_acknowledgment_received, false);
assert.equal(snap.imported_retry_acknowledgment_validated, false);
assert.equal(snap.imported_human_remediation_action_completed, false);
assert.equal(snap.imported_human_action_completed, false);
assert.equal(snap.imported_operator_input_bundle_submission_request_issued, false);
assert.equal(snap.imported_operator_input_bundle_submitted, false);
assert.equal(snap.imported_operator_inputs_verified, false);
assert.equal(snap.imported_public_surface_observed, false);
assert.equal(snap.imported_public_surface_observation_ready, false);
assert.equal(snap.imported_external_customer_ready, false);
assert.equal(snap.imported_banking_pack_ready, false);
assert.equal(snap.imported_level1_launch_ready, false);
assert.equal(snap.imported_production_ready, false);

assert.equal(snap.fail_closed_due_to_blocked_escalation_completion_gate, true);
assert.equal(snap.fail_closed_due_to_missing_escalation_acknowledgment, true);
assert.equal(snap.fail_closed_due_to_missing_retry_acknowledgment, true);
assert.equal(snap.fail_closed_due_to_incomplete_human_remediation, true);
assert.equal(snap.fail_closed_due_to_incomplete_human_action, true);
assert.equal(snap.fail_closed_due_to_missing_operator_input_bundle_submission_request, true);
assert.equal(snap.fail_closed_due_to_missing_operator_input_bundle, true);
assert.equal(snap.fail_closed_due_to_missing_operator_input_verification, true);
assert.equal(snap.fail_closed_due_to_missing_public_observation, true);

assert.equal(snap.escalation_completion_gate_passed, false);
assert.equal(snap.escalation_completion_gate_blocked, true);
assert.equal(snap.escalation_acknowledgment_received, false);
assert.equal(snap.escalation_acknowledgment_validated, false);
assert.equal(snap.retry_acknowledgment_received, false);
assert.equal(snap.retry_acknowledgment_validated, false);
assert.equal(snap.human_remediation_action_completed, false);
assert.equal(snap.human_action_completed, false);
assert.equal(snap.operator_input_bundle_submission_request_issued, false);
assert.equal(snap.operator_input_bundle_submitted, false);
assert.equal(snap.operator_inputs_verified, false);
assert.equal(snap.public_surface_observed, false);
assert.equal(snap.public_surface_observation_ready, false);
assert.equal(snap.external_customer_ready, false);
assert.equal(snap.banking_pack_ready, false);
assert.equal(snap.level1_launch_ready, false);
assert.equal(snap.production_ready, false);
assert.equal(snap.ai_authority_allowed, false);

assert.equal(snap.snapshot_boundary.snapshot_only, true);
assert.equal(snap.snapshot_boundary.no_state_unlock, true);
assert.equal(snap.snapshot_boundary.no_external_customer_readiness_created, true);
assert.equal(snap.snapshot_boundary.no_banking_pack_readiness_created, true);
assert.equal(snap.snapshot_boundary.no_level1_launch_readiness_created, true);
assert.equal(snap.snapshot_boundary.no_production_readiness_created, true);
assert.equal(snap.snapshot_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_fail_closed_snapshot_recorded, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_fail_closed_snapshot_active, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_fail_closed_snapshot_fail_closed, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_passed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated, false);
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

assert.equal(doc.next_required_program, 'PROG-130-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.escalation_completion_gate_passed, false);
assert.equal(doc.non_claims.escalation_acknowledgment_received, false);
assert.equal(doc.non_claims.escalation_acknowledgment_validated, false);
assert.equal(doc.non_claims.retry_acknowledgment_received, false);
assert.equal(doc.non_claims.retry_acknowledgment_validated, false);
assert.equal(doc.non_claims.human_remediation_action_completed, false);
assert.equal(doc.non_claims.human_action_completed, false);
assert.equal(doc.non_claims.operator_input_bundle_submission_request_issued, false);
assert.equal(doc.non_claims.operator_input_bundle_submitted, false);
assert.equal(doc.non_claims.operator_inputs_verified, false);
assert.equal(doc.non_claims.public_surface_observed, false);
assert.equal(doc.non_claims.public_surface_observation_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_FAIL_CLOSED_SNAPSHOT_RECORDED/);
assert.match(md, /The fail-closed snapshot is recorded/);
assert.match(md, /The fail-closed snapshot does not unlock readiness/);
assert.match(md, /The fail-closed snapshot does not authorize AI authority/);
assert.match(md, /PROG-130-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION/);

console.log('PASS PROG-129-FAIL-CLOSED-SNAPSHOT-DOCS-EXIST');
console.log('PASS PROG-129-HASH-STABLE');
console.log('PASS PROG-129-BUILDER-STABLE');
console.log('PASS PROG-129-SOURCE-PROG-128-INTEGRITY-VALID');
console.log('PASS PROG-129-FAIL-CLOSED-SNAPSHOT-RECORDED');
console.log('PASS PROG-129-FAIL-CLOSED-SNAPSHOT-ACTIVE');
console.log('PASS PROG-129-ESCALATION-COMPLETION-GATE-BLOCKED');
console.log('PASS PROG-129-ESCALATION-COMPLETION-GATE-NOT-PASSED');
console.log('PASS PROG-129-ESCALATION-ACKNOWLEDGMENT-NOT-RECEIVED');
console.log('PASS PROG-129-ESCALATION-ACKNOWLEDGMENT-NOT-VALIDATED');
console.log('PASS PROG-129-HUMAN-REMEDIATION-ACTION-NOT-COMPLETED');
console.log('PASS PROG-129-HUMAN-ACTION-NOT-COMPLETED');
console.log('PASS PROG-129-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-NOT-ISSUED');
console.log('PASS PROG-129-NO-READINESS-UNLOCK');
console.log('PASS PROG-129-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-129-NEXT-PROG-130-RECORDED');
console.log('PASS PROG-129-NO-UNSUPPORTED-READINESS-CLAIMS');
