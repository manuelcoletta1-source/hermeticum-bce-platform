'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  recoveryDecisionOptions,
  requiredRecoveryDecisionFields,
  buildRecoveryDecisionPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecision
} = require('../../../runtime/level1/build-prog-130-level1-public-surface-observation-human-action-completion-recovery-decision.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-130-level1-public-surface-observation-human-action-completion-recovery-decision.json';
const mdPath = 'docs/launch/level1/prog-130-level1-public-surface-observation-human-action-completion-recovery-decision.md';
const runtimePath = 'runtime/level1/build-prog-130-level1-public-surface-observation-human-action-completion-recovery-decision.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-130-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION');
assert.equal(doc.issue_id, 'PROG-130');
assert.equal(doc.level1_public_surface_observation_human_action_completion_recovery_decision_status, STATUS);
assert.equal(doc.source_fail_closed_snapshot_revision_hash, source.revision_hash);
assert.equal(doc.source_fail_closed_snapshot_revision_hash_valid, true);

const regenerated = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecision({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const expectedPayload = buildRecoveryDecisionPayload(source);
const decision = doc.public_surface_observation_human_action_completion_recovery_decision;

assert.equal(decision.recovery_decision_payload_digest, sha256Digest(expectedPayload));
assert.equal(decision.recovery_decision_status, 'DEFINED_PENDING_HUMAN_DECISION');
assert.equal(decision.recovery_decision_result, 'RECOVERY_DECISION_REQUIRED_NOT_RECORDED');

assert.equal(decision.imported_fail_closed_snapshot_status, 'RECORDED');
assert.equal(decision.imported_fail_closed_snapshot_result, 'FAIL_CLOSED_CONFIRMED');
assert.equal(decision.imported_fail_closed_required, true);
assert.equal(decision.imported_fail_closed_recorded, true);
assert.equal(decision.imported_fail_closed_active, true);
assert.equal(decision.imported_escalation_completion_gate_passed, false);
assert.equal(decision.imported_escalation_completion_gate_blocked, true);
assert.equal(decision.imported_escalation_acknowledgment_received, false);
assert.equal(decision.imported_escalation_acknowledgment_validated, false);
assert.equal(decision.imported_retry_acknowledgment_received, false);
assert.equal(decision.imported_retry_acknowledgment_validated, false);
assert.equal(decision.imported_human_remediation_action_completed, false);
assert.equal(decision.imported_human_action_completed, false);
assert.equal(decision.imported_operator_input_bundle_submission_request_issued, false);
assert.equal(decision.imported_operator_input_bundle_submitted, false);
assert.equal(decision.imported_operator_inputs_verified, false);
assert.equal(decision.imported_public_surface_observed, false);
assert.equal(decision.imported_public_surface_observation_ready, false);
assert.equal(decision.imported_external_customer_ready, false);
assert.equal(decision.imported_banking_pack_ready, false);
assert.equal(decision.imported_level1_launch_ready, false);
assert.equal(decision.imported_production_ready, false);

assert.deepEqual(decision.recovery_decision_options, recoveryDecisionOptions());
assert.deepEqual(decision.recovery_decision_required_fields, requiredRecoveryDecisionFields());
assert.deepEqual(decision.recovery_decision_missing_fields, requiredRecoveryDecisionFields());
assert.equal(decision.recovery_decision_option_count, recoveryDecisionOptions().length);

assert.equal(decision.recovery_decision_defined, true);
assert.equal(decision.recovery_decision_ready, true);
assert.equal(decision.recovery_decision_evaluated, true);
assert.equal(decision.recovery_decision_required, true);
assert.equal(decision.recovery_decision_recorded, false);
assert.equal(decision.recovery_decision_validated, false);
assert.equal(decision.recovery_decision_pending_human_decision, true);
assert.equal(decision.recovery_decision_selected, false);
assert.equal(decision.recovery_decision_approved, false);
assert.equal(decision.recovery_decision_rejected, false);
assert.equal(decision.recovery_decision_execution_allowed, false);
assert.equal(decision.recovery_decision_execution_ready, false);
assert.equal(decision.recovery_decision_execution_performed, false);

assert.equal(decision.recovery_decision_owner_ref, null);
assert.equal(decision.selected_recovery_decision_option, null);
assert.equal(decision.recovery_decided_at, null);
assert.equal(decision.recovery_decision_channel, null);
assert.equal(decision.recovery_decision_statement, null);
assert.equal(decision.recovery_decision_signature_ref, null);

assert.equal(decision.fail_closed_snapshot_recorded, true);
assert.equal(decision.fail_closed_snapshot_active, true);
assert.equal(decision.fail_closed_remains_active, true);
assert.equal(decision.no_state_unlock, true);
assert.equal(decision.escalation_completion_gate_passed, false);
assert.equal(decision.escalation_completion_gate_blocked, true);
assert.equal(decision.escalation_acknowledgment_received, false);
assert.equal(decision.escalation_acknowledgment_validated, false);
assert.equal(decision.retry_acknowledgment_received, false);
assert.equal(decision.retry_acknowledgment_validated, false);
assert.equal(decision.human_remediation_action_completed, false);
assert.equal(decision.human_action_completed, false);
assert.equal(decision.operator_input_bundle_submission_request_issued, false);
assert.equal(decision.operator_input_bundle_submitted, false);
assert.equal(decision.operator_inputs_verified, false);
assert.equal(decision.public_surface_observed, false);
assert.equal(decision.public_surface_observation_ready, false);
assert.equal(decision.external_customer_ready, false);
assert.equal(decision.banking_pack_ready, false);
assert.equal(decision.level1_launch_ready, false);
assert.equal(decision.production_ready, false);
assert.equal(decision.ai_authority_allowed, false);

assert.equal(decision.recovery_decision_boundary.recovery_decision_definition_only, true);
assert.equal(decision.recovery_decision_boundary.pending_human_decision, true);
assert.equal(decision.recovery_decision_boundary.no_recovery_option_selected, true);
assert.equal(decision.recovery_decision_boundary.no_recovery_decision_recorded, true);
assert.equal(decision.recovery_decision_boundary.no_recovery_decision_validated, true);
assert.equal(decision.recovery_decision_boundary.no_recovery_execution_allowed, true);
assert.equal(decision.recovery_decision_boundary.no_state_unlock, true);
assert.equal(decision.recovery_decision_boundary.no_ai_authority_claim, true);

assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_defined, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_ready, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_evaluated, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_required, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_recorded, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_validated, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_pending_human_decision, true);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_execution_allowed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_recovery_decision_execution_performed, false);
assert.equal(doc.readiness_state.public_surface_observation_human_action_completion_fail_closed_snapshot_recorded, true);
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

assert.equal(doc.next_required_program, 'PROG-131-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-COMPLETION-GATE');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.recovery_decision_recorded, false);
assert.equal(doc.non_claims.recovery_decision_validated, false);
assert.equal(doc.non_claims.recovery_execution_allowed, false);
assert.equal(doc.non_claims.recovery_execution_performed, false);
assert.equal(doc.non_claims.readiness_unlocked, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_DEFINED_PENDING_HUMAN_DECISION/);
assert.match(md, /The recovery decision is pending human decision/);
assert.match(md, /The recovery decision is not recorded/);
assert.match(md, /No recovery option is selected/);
assert.match(md, /No recovery execution is allowed/);
assert.match(md, /The recovery decision does not unlock readiness/);
assert.match(md, /The recovery decision does not authorize AI authority/);
assert.match(md, /PROG-131-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-COMPLETION-GATE/);

console.log('PASS PROG-130-RECOVERY-DECISION-DOCS-EXIST');
console.log('PASS PROG-130-HASH-STABLE');
console.log('PASS PROG-130-BUILDER-STABLE');
console.log('PASS PROG-130-SOURCE-PROG-129-INTEGRITY-VALID');
console.log('PASS PROG-130-RECOVERY-DECISION-DEFINED');
console.log('PASS PROG-130-RECOVERY-DECISION-READY');
console.log('PASS PROG-130-RECOVERY-DECISION-PENDING-HUMAN-DECISION');
console.log('PASS PROG-130-RECOVERY-DECISION-NOT-RECORDED');
console.log('PASS PROG-130-RECOVERY-DECISION-NOT-VALIDATED');
console.log('PASS PROG-130-RECOVERY-OPTION-NOT-SELECTED');
console.log('PASS PROG-130-RECOVERY-EXECUTION-NOT-ALLOWED');
console.log('PASS PROG-130-FAIL-CLOSED-REMAINS-ACTIVE');
console.log('PASS PROG-130-NO-READINESS-UNLOCK');
console.log('PASS PROG-130-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-130-NEXT-PROG-131-RECORDED');
console.log('PASS PROG-130-NO-UNSUPPORTED-READINESS-CLAIMS');
