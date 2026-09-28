'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  requiredHumanDecisionAcknowledgmentFields,
  buildHumanDecisionAcknowledgmentPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionAcknowledgment
} = require('../../../runtime/level1/build-prog-133-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-133-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment.json';
const mdPath = 'docs/launch/level1/prog-133-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment.md';
const runtimePath = 'runtime/level1/build-prog-133-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-133-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_ACKNOWLEDGMENT');
assert.equal(doc.issue_id, 'PROG-133');
assert.equal(doc.level1_public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_status, STATUS);
assert.equal(doc.source_human_decision_request_revision_hash, source.revision_hash);
assert.equal(doc.source_human_decision_request_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionAcknowledgment({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildHumanDecisionAcknowledgmentPayload(source);
const ack = doc.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment;

assert.equal(ack.human_decision_acknowledgment_payload_digest, sha256Digest(expectedPayload));
assert.equal(ack.human_decision_acknowledgment_status, 'DEFINED_PENDING_ACKNOWLEDGMENT');
assert.equal(ack.human_decision_acknowledgment_result, 'HUMAN_DECISION_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED');

assert.equal(ack.imported_human_decision_request_status, 'ISSUED_PENDING_HUMAN_DECISION');
assert.equal(ack.imported_human_decision_request_defined, true);
assert.equal(ack.imported_human_decision_request_ready, true);
assert.equal(ack.imported_human_decision_request_evaluated, true);
assert.equal(ack.imported_human_decision_request_required, true);
assert.equal(ack.imported_human_decision_request_issued, true);
assert.equal(ack.imported_human_decision_request_delivered, false);
assert.equal(ack.imported_human_decision_request_acknowledged, false);
assert.equal(ack.imported_human_decision_request_pending_human_decision, true);
assert.equal(ack.imported_human_decision_response_received, false);
assert.equal(ack.imported_human_decision_response_validated, false);
assert.equal(ack.imported_human_decision_recorded, false);
assert.equal(ack.imported_human_decision_validated, false);

assert.equal(ack.human_decision_acknowledgment_defined, true);
assert.equal(ack.human_decision_acknowledgment_ready, true);
assert.equal(ack.human_decision_acknowledgment_evaluated, true);
assert.equal(ack.human_decision_acknowledgment_required, true);
assert.equal(ack.human_decision_acknowledgment_received, false);
assert.equal(ack.human_decision_acknowledgment_validated, false);
assert.equal(ack.human_decision_acknowledgment_pending, true);

assert.deepEqual(ack.required_human_decision_acknowledgment_fields, requiredHumanDecisionAcknowledgmentFields());
assert.deepEqual(ack.missing_human_decision_acknowledgment_fields, requiredHumanDecisionAcknowledgmentFields());

assert.equal(ack.human_decision_acknowledgment_owner_ref, null);
assert.equal(ack.human_decision_acknowledged_at, null);
assert.equal(ack.human_decision_acknowledgment_channel, null);
assert.equal(ack.human_decision_acknowledgment_statement, null);
assert.equal(ack.human_decision_acknowledgment_signature_ref, null);

assert.equal(ack.human_decision_request_issued, true);
assert.equal(ack.human_decision_request_delivered, false);
assert.equal(ack.human_decision_request_acknowledged, false);
assert.equal(ack.human_decision_response_received, false);
assert.equal(ack.human_decision_response_validated, false);
assert.equal(ack.human_decision_recorded, false);
assert.equal(ack.human_decision_validated, false);
assert.equal(ack.selected_recovery_decision_option, null);

assert.equal(ack.recovery_decision_recorded, false);
assert.equal(ack.recovery_decision_validated, false);
assert.equal(ack.recovery_decision_pending_human_decision, true);
assert.equal(ack.recovery_decision_execution_allowed, false);
assert.equal(ack.recovery_decision_execution_performed, false);
assert.equal(ack.fail_closed_snapshot_active, true);
assert.equal(ack.fail_closed_remains_active, true);
assert.equal(ack.no_state_unlock, true);
assert.equal(ack.human_remediation_action_completed, false);
assert.equal(ack.human_action_completed, false);
assert.equal(ack.operator_input_bundle_submission_request_issued, false);
assert.equal(ack.operator_input_bundle_submitted, false);
assert.equal(ack.operator_inputs_verified, false);
assert.equal(ack.public_surface_observed, false);
assert.equal(ack.public_surface_observation_ready, false);
assert.equal(ack.external_customer_ready, false);
assert.equal(ack.banking_pack_ready, false);
assert.equal(ack.level1_launch_ready, false);
assert.equal(ack.production_ready, false);
assert.equal(ack.ai_authority_allowed, false);

assert.equal(ack.human_decision_acknowledgment_controls.includes('do_not_record_human_decision_from_acknowledgment_definition'), true);
assert.equal(ack.human_decision_acknowledgment_controls.includes('do_not_unlock_readiness_from_acknowledgment_definition'), true);
assert.equal(ack.human_decision_acknowledgment_controls.includes('do_not_authorize_ai_authority'), true);

assert.equal(ack.human_decision_acknowledgment_boundary.acknowledgment_definition_only, true);
assert.equal(ack.human_decision_acknowledgment_boundary.pending_acknowledgment, true);
assert.equal(ack.human_decision_acknowledgment_boundary.no_human_decision_acknowledgment_received, true);
assert.equal(ack.human_decision_acknowledgment_boundary.no_human_decision_acknowledgment_validated, true);
assert.equal(ack.human_decision_acknowledgment_boundary.no_human_decision_response_received, true);
assert.equal(ack.human_decision_acknowledgment_boundary.no_human_decision_recorded, true);
assert.equal(ack.human_decision_acknowledgment_boundary.no_recovery_execution_allowed, true);
assert.equal(ack.human_decision_acknowledgment_boundary.fail_closed_remains_active, true);
assert.equal(ack.human_decision_acknowledgment_boundary.no_state_unlock, true);
assert.equal(ack.human_decision_acknowledgment_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_received, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_pending, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_human_decision_request_issued, true);
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

assert.equal(doc.next_required_program, 'PROG-134-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-COMPLETION-GATE');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.ai_authority, false);
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

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_ACKNOWLEDGMENT_DEFINED_PENDING_ACKNOWLEDGMENT/);
assert.match(md, /The human decision acknowledgment is defined/);
assert.match(md, /The human decision acknowledgment is not received/);
assert.match(md, /The human decision response is not received/);
assert.match(md, /No human decision is recorded/);
assert.match(md, /No recovery execution is allowed/);
assert.match(md, /The fail-closed snapshot remains active/);
assert.match(md, /The human decision acknowledgment does not unlock readiness/);
assert.match(md, /The human decision acknowledgment does not authorize AI authority/);
assert.match(md, /PROG-134-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-COMPLETION-GATE/);

console.log('PASS PROG-133-HUMAN-DECISION-ACKNOWLEDGMENT-DOCS-EXIST');
console.log('PASS PROG-133-HASH-STABLE');
console.log('PASS PROG-133-BUILDER-STABLE');
console.log('PASS PROG-133-SOURCE-PROG-132-INTEGRITY-VALID');
console.log('PASS PROG-133-HUMAN-DECISION-ACKNOWLEDGMENT-DEFINED');
console.log('PASS PROG-133-HUMAN-DECISION-ACKNOWLEDGMENT-READY');
console.log('PASS PROG-133-HUMAN-DECISION-ACKNOWLEDGMENT-PENDING');
console.log('PASS PROG-133-HUMAN-DECISION-ACKNOWLEDGMENT-NOT-RECEIVED');
console.log('PASS PROG-133-HUMAN-DECISION-ACKNOWLEDGMENT-NOT-VALIDATED');
console.log('PASS PROG-133-HUMAN-DECISION-RESPONSE-NOT-RECEIVED');
console.log('PASS PROG-133-HUMAN-DECISION-NOT-RECORDED');
console.log('PASS PROG-133-RECOVERY-EXECUTION-NOT-ALLOWED');
console.log('PASS PROG-133-FAIL-CLOSED-REMAINS-ACTIVE');
console.log('PASS PROG-133-NO-READINESS-UNLOCK');
console.log('PASS PROG-133-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-133-NEXT-PROG-134-RECORDED');
console.log('PASS PROG-133-NO-UNSUPPORTED-READINESS-CLAIMS');
