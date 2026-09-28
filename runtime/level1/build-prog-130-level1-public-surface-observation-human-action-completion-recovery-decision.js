'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_DEFINED_PENDING_HUMAN_DECISION';
const SOURCE_REF = 'docs/launch/level1/prog-129-level1-public-surface-observation-human-action-completion-fail-closed-snapshot.json';

function readJson(rootDir, rel) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, rel), 'utf8'));
}

function gitHead(rootDir) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (_err) {
    return 'UNKNOWN';
  }
}

function validHash(doc) {
  if (!doc || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

function recoveryDecisionOptions() {
  return [
    'WAIT_FOR_ESCALATION_ACKNOWLEDGMENT',
    'REISSUE_ESCALATION_ACKNOWLEDGMENT_REQUEST',
    'REQUEST_HUMAN_REMEDIATION_COMPLETION',
    'REQUEST_OPERATOR_INPUT_BUNDLE_SUBMISSION',
    'CLOSE_PUBLIC_SURFACE_OBSERVATION_AS_BLOCKED'
  ];
}

function requiredRecoveryDecisionFields() {
  return [
    'recovery_decision_owner_ref',
    'selected_recovery_decision_option',
    'recovery_decided_at',
    'recovery_decision_channel',
    'recovery_decision_statement',
    'recovery_decision_signature_ref'
  ];
}

function buildRecoveryDecisionPayload(source) {
  const snap = source.public_surface_observation_human_action_completion_fail_closed_snapshot;

  return {
    recovery_decision_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION::HBCE-L1-DECISION-PROOF-0001',
    source_fail_closed_snapshot_ref: SOURCE_REF,
    source_fail_closed_snapshot_digest: snap.fail_closed_snapshot_payload_digest,
    recovery_decision_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    recovery_decision_status: 'DEFINED_PENDING_HUMAN_DECISION',
    recovery_decision_result: 'RECOVERY_DECISION_REQUIRED_NOT_RECORDED',
    evaluated_at: '2027-01-19T19:30:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_fail_closed_snapshot_status: snap.fail_closed_snapshot_status,
    imported_fail_closed_snapshot_result: snap.fail_closed_snapshot_result,
    imported_fail_closed_required: snap.fail_closed_required,
    imported_fail_closed_recorded: snap.fail_closed_recorded,
    imported_fail_closed_active: snap.fail_closed_active,
    imported_fail_closed_reasons: snap.fail_closed_reasons,
    imported_fail_closed_reason_count: snap.fail_closed_reason_count,

    imported_escalation_completion_gate_passed: snap.escalation_completion_gate_passed,
    imported_escalation_completion_gate_blocked: snap.escalation_completion_gate_blocked,
    imported_escalation_completion_gate_blocked_pending_acknowledgment: snap.escalation_completion_gate_blocked_pending_acknowledgment,
    imported_escalation_acknowledgment_received: snap.escalation_acknowledgment_received,
    imported_escalation_acknowledgment_validated: snap.escalation_acknowledgment_validated,
    imported_retry_acknowledgment_received: snap.retry_acknowledgment_received,
    imported_retry_acknowledgment_validated: snap.retry_acknowledgment_validated,
    imported_human_remediation_action_completed: snap.human_remediation_action_completed,
    imported_human_action_completed: snap.human_action_completed,
    imported_operator_input_bundle_submission_request_issued: snap.operator_input_bundle_submission_request_issued,
    imported_operator_input_bundle_submitted: snap.operator_input_bundle_submitted,
    imported_operator_inputs_verified: snap.operator_inputs_verified,
    imported_public_surface_observed: snap.public_surface_observed,
    imported_public_surface_observation_ready: snap.public_surface_observation_ready,
    imported_external_customer_ready: snap.external_customer_ready,
    imported_banking_pack_ready: snap.banking_pack_ready,
    imported_level1_launch_ready: snap.level1_launch_ready,
    imported_production_ready: snap.production_ready,

    recovery_decision_options: recoveryDecisionOptions(),
    recovery_decision_option_count: recoveryDecisionOptions().length,
    recovery_decision_required_fields: requiredRecoveryDecisionFields(),
    recovery_decision_missing_fields: requiredRecoveryDecisionFields(),

    recovery_decision_defined: true,
    recovery_decision_ready: true,
    recovery_decision_evaluated: true,
    recovery_decision_required: true,
    recovery_decision_recorded: false,
    recovery_decision_validated: false,
    recovery_decision_pending_human_decision: true,
    recovery_decision_selected: false,
    recovery_decision_approved: false,
    recovery_decision_rejected: false,
    recovery_decision_execution_allowed: false,
    recovery_decision_execution_ready: false,
    recovery_decision_execution_performed: false,

    recovery_decision_owner_ref: null,
    selected_recovery_decision_option: null,
    recovery_decided_at: null,
    recovery_decision_channel: null,
    recovery_decision_statement: null,
    recovery_decision_signature_ref: null,

    fail_closed_snapshot_recorded: true,
    fail_closed_snapshot_active: true,
    fail_closed_remains_active: true,
    no_state_unlock: true,

    escalation_completion_gate_passed: false,
    escalation_completion_gate_blocked: true,
    escalation_acknowledgment_received: false,
    escalation_acknowledgment_validated: false,
    retry_acknowledgment_received: false,
    retry_acknowledgment_validated: false,
    human_remediation_action_completed: false,
    human_action_completed: false,
    operator_input_bundle_submission_request_issued: false,
    operator_input_bundle_submitted: false,
    operator_inputs_verified: false,
    public_surface_observed: false,
    public_surface_observation_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    ai_authority_allowed: false,

    recovery_decision_controls: [
      'require_source_fail_closed_snapshot_hash_valid',
      'require_source_fail_closed_snapshot_recorded',
      'require_source_fail_closed_snapshot_active',
      'require_recovery_decision_owner_ref_before_decision_recorded',
      'require_selected_recovery_decision_option_before_decision_recorded',
      'require_recovery_decided_at_before_decision_recorded',
      'require_recovery_decision_channel_before_decision_recorded',
      'require_recovery_decision_statement_before_decision_validated',
      'require_recovery_decision_signature_ref_before_decision_validated',
      'do_not_unlock_readiness_from_recovery_decision_definition',
      'do_not_execute_recovery_without_recorded_human_decision',
      'do_not_mark_escalation_acknowledgment_received_from_recovery_decision_definition',
      'do_not_mark_escalation_acknowledgment_validated_from_recovery_decision_definition',
      'do_not_mark_human_remediation_completed_from_recovery_decision_definition',
      'do_not_mark_human_action_completed_from_recovery_decision_definition',
      'do_not_issue_operator_input_bundle_submission_request_from_recovery_decision_definition',
      'do_not_mark_public_surface_observed_from_recovery_decision_definition',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_authorize_ai_authority'
    ],

    recovery_decision_boundary: {
      controlled_information_surface_only: true,
      recovery_decision_definition_only: true,
      pending_human_decision: true,
      no_recovery_option_selected: true,
      no_recovery_decision_recorded: true,
      no_recovery_decision_validated: true,
      no_recovery_execution_allowed: true,
      no_recovery_execution_performed: true,
      fail_closed_remains_active: true,
      no_state_unlock: true,
      no_escalation_acknowledgment_received: true,
      no_escalation_acknowledgment_validated: true,
      no_retry_acknowledgment_received: true,
      no_retry_acknowledgment_validated: true,
      no_human_remediation_action_completed: true,
      no_human_action_completed: true,
      no_operator_input_bundle_submission_request_issued: true,
      no_operator_input_bundle_submitted: true,
      no_operator_inputs_verified: true,
      no_public_observation_recorded: true,
      no_external_customer_readiness_created: true,
      no_banking_pack_readiness_created: true,
      no_level1_launch_readiness_created: true,
      no_production_readiness_created: true,
      no_legal_validity_claim: true,
      no_public_accreditation_claim: true,
      no_procurement_eligibility_claim: true,
      no_ai_authority_claim: true
    }
  };
}

function buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecision(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildRecoveryDecisionPayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-130-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-2027-PROG-130',
    issue_id: 'PROG-130',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_fail_closed_snapshot_ref: SOURCE_REF,
    source_fail_closed_snapshot_revision_hash: source.revision_hash,
    source_fail_closed_snapshot_revision_hash_valid: validHash(source),

    level1_public_surface_observation_human_action_completion_recovery_decision_status: STATUS,

    public_surface_observation_human_action_completion_recovery_decision: {
      ...payload,
      recovery_decision_payload_digest: sha256Digest(payload),
      recovery_decision_is_defined: true,
      recovery_decision_is_ready: true,
      recovery_decision_is_evaluated: true,
      recovery_decision_is_required: true,
      recovery_decision_is_pending_human_decision: true,
      recovery_decision_is_not_recorded: true,
      recovery_decision_is_not_validated: true,
      recovery_decision_does_not_unlock_readiness: true,
      recovery_decision_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'SOURCE_FAIL_CLOSED_SNAPSHOT_NOT_VALID',
      'RECOVERY_DECISION_NOT_RECORDED',
      'RECOVERY_DECISION_NOT_VALIDATED',
      'RECOVERY_DECISION_OPTION_NOT_SELECTED',
      'RECOVERY_DECISION_OWNER_MISSING',
      'RECOVERY_DECISION_SIGNATURE_MISSING',
      'FAIL_CLOSED_REMAINS_ACTIVE',
      'READINESS_UNLOCK_BLOCKED',
      'AI_RECOVERY_DECISION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_human_action_completion_recovery_decision_defined: true,
      public_surface_observation_human_action_completion_recovery_decision_ready: true,
      public_surface_observation_human_action_completion_recovery_decision_evaluated: true,
      public_surface_observation_human_action_completion_recovery_decision_required: true,
      public_surface_observation_human_action_completion_recovery_decision_recorded: false,
      public_surface_observation_human_action_completion_recovery_decision_validated: false,
      public_surface_observation_human_action_completion_recovery_decision_pending_human_decision: true,
      public_surface_observation_human_action_completion_recovery_decision_execution_allowed: false,
      public_surface_observation_human_action_completion_recovery_decision_execution_performed: false,
      source_fail_closed_snapshot_bound: true,
      public_surface_observation_human_action_completion_fail_closed_snapshot_recorded: true,
      public_surface_observation_human_action_completion_fail_closed_snapshot_active: true,
      public_surface_observation_human_action_completion_fail_closed_snapshot_fail_closed: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_passed: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated: false,
      human_remediation_action_completed: false,
      human_action_completed: false,
      operator_input_bundle_submission_request_issued: false,
      operator_input_bundle_submitted: false,
      operator_inputs_verified: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-131-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-COMPLETION-GATE',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      recovery_decision_recorded: false,
      recovery_decision_validated: false,
      recovery_execution_allowed: false,
      recovery_execution_performed: false,
      readiness_unlocked: false,
      escalation_acknowledgment_received: false,
      escalation_acknowledgment_validated: false,
      retry_acknowledgment_received: false,
      retry_acknowledgment_validated: false,
      human_remediation_action_completed: false,
      human_action_completed: false,
      operator_input_bundle_submission_request_issued: false,
      operator_input_bundle_submitted: false,
      operator_inputs_verified: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecision(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecision({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-130-level1-public-surface-observation-human-action-completion-recovery-decision.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecision(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_130_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  recoveryDecisionOptions,
  requiredRecoveryDecisionFields,
  buildRecoveryDecisionPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecision,
  writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecision
};
