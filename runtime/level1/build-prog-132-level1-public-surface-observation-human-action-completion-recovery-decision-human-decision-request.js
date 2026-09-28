'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_REQUEST_ISSUED_PENDING_HUMAN_DECISION';
const SOURCE_REF = 'docs/launch/level1/prog-131-level1-public-surface-observation-human-action-completion-recovery-decision-completion-gate.json';

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

function recoveryHumanDecisionOptions() {
  return [
    'WAIT_FOR_ESCALATION_ACKNOWLEDGMENT',
    'REISSUE_ESCALATION_ACKNOWLEDGMENT_REQUEST',
    'REQUEST_HUMAN_REMEDIATION_COMPLETION',
    'REQUEST_OPERATOR_INPUT_BUNDLE_SUBMISSION',
    'CLOSE_PUBLIC_SURFACE_OBSERVATION_AS_BLOCKED'
  ];
}

function requiredHumanDecisionResponseFields() {
  return [
    'human_decision_owner_ref',
    'selected_recovery_decision_option',
    'human_decision_recorded_at',
    'human_decision_channel',
    'human_decision_statement',
    'human_decision_signature_ref'
  ];
}

function buildHumanDecisionRequestPayload(source) {
  const gate = source.public_surface_observation_human_action_completion_recovery_decision_completion_gate;

  return {
    human_decision_request_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-REQUEST::HBCE-L1-DECISION-PROOF-0001',
    source_recovery_decision_completion_gate_ref: SOURCE_REF,
    source_recovery_decision_completion_gate_digest: gate.recovery_decision_completion_gate_payload_digest,
    human_decision_request_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    human_decision_request_status: 'ISSUED_PENDING_HUMAN_DECISION',
    human_decision_request_result: 'HUMAN_DECISION_REQUIRED_NOT_RECEIVED',
    issued_at: '2027-01-19T19:40:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_recovery_decision_completion_gate_status: gate.recovery_decision_completion_gate_status,
    imported_recovery_decision_completion_gate_result: gate.recovery_decision_completion_gate_result,
    imported_recovery_decision_completion_gate_defined: gate.recovery_decision_completion_gate_defined,
    imported_recovery_decision_completion_gate_ready: gate.recovery_decision_completion_gate_ready,
    imported_recovery_decision_completion_gate_evaluated: gate.recovery_decision_completion_gate_evaluated,
    imported_recovery_decision_completion_gate_required: gate.recovery_decision_completion_gate_required,
    imported_recovery_decision_completion_gate_passed: gate.recovery_decision_completion_gate_passed,
    imported_recovery_decision_completion_gate_blocked: gate.recovery_decision_completion_gate_blocked,
    imported_recovery_decision_completion_gate_blocked_pending_human_decision: gate.recovery_decision_completion_gate_blocked_pending_human_decision,

    imported_recovery_decision_recorded: gate.recovery_decision_recorded,
    imported_recovery_decision_validated: gate.recovery_decision_validated,
    imported_recovery_decision_pending_human_decision: gate.recovery_decision_pending_human_decision,
    imported_recovery_decision_selected: gate.recovery_decision_selected,
    imported_recovery_decision_execution_allowed: gate.recovery_decision_execution_allowed,
    imported_recovery_decision_execution_performed: gate.recovery_decision_execution_performed,

    imported_fail_closed_snapshot_recorded: gate.fail_closed_snapshot_recorded,
    imported_fail_closed_snapshot_active: gate.fail_closed_snapshot_active,
    imported_fail_closed_remains_active: gate.fail_closed_remains_active,
    imported_no_state_unlock: gate.no_state_unlock,

    imported_escalation_completion_gate_passed: gate.escalation_completion_gate_passed,
    imported_escalation_completion_gate_blocked: gate.escalation_completion_gate_blocked,
    imported_escalation_acknowledgment_received: gate.escalation_acknowledgment_received,
    imported_escalation_acknowledgment_validated: gate.escalation_acknowledgment_validated,
    imported_retry_acknowledgment_received: gate.retry_acknowledgment_received,
    imported_retry_acknowledgment_validated: gate.retry_acknowledgment_validated,
    imported_human_remediation_action_completed: gate.human_remediation_action_completed,
    imported_human_action_completed: gate.human_action_completed,
    imported_operator_input_bundle_submission_request_issued: gate.operator_input_bundle_submission_request_issued,
    imported_operator_input_bundle_submitted: gate.operator_input_bundle_submitted,
    imported_operator_inputs_verified: gate.operator_inputs_verified,
    imported_public_surface_observed: gate.public_surface_observed,
    imported_public_surface_observation_ready: gate.public_surface_observation_ready,
    imported_external_customer_ready: gate.external_customer_ready,
    imported_banking_pack_ready: gate.banking_pack_ready,
    imported_level1_launch_ready: gate.level1_launch_ready,
    imported_production_ready: gate.production_ready,

    human_decision_request_defined: true,
    human_decision_request_ready: true,
    human_decision_request_evaluated: true,
    human_decision_request_required: true,
    human_decision_request_issued: true,
    human_decision_request_delivered: false,
    human_decision_request_acknowledged: false,
    human_decision_request_pending_human_decision: true,

    human_decision_response_required: true,
    human_decision_response_received: false,
    human_decision_response_validated: false,
    human_decision_recorded: false,
    human_decision_validated: false,
    human_decision_owner_ref: null,
    selected_recovery_decision_option: null,
    human_decision_recorded_at: null,
    human_decision_channel: null,
    human_decision_statement: null,
    human_decision_signature_ref: null,

    recovery_human_decision_options: recoveryHumanDecisionOptions(),
    recovery_human_decision_option_count: recoveryHumanDecisionOptions().length,
    required_human_decision_response_fields: requiredHumanDecisionResponseFields(),
    missing_human_decision_response_fields: requiredHumanDecisionResponseFields(),

    recovery_decision_completion_gate_passed: false,
    recovery_decision_completion_gate_blocked: true,
    recovery_decision_completion_gate_blocked_pending_human_decision: true,
    recovery_decision_recorded: false,
    recovery_decision_validated: false,
    recovery_decision_pending_human_decision: true,
    recovery_decision_selected: false,
    recovery_decision_execution_allowed: false,
    recovery_decision_execution_performed: false,

    fail_closed_snapshot_recorded: true,
    fail_closed_snapshot_active: true,
    fail_closed_remains_active: true,
    no_state_unlock: true,

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

    human_decision_request_controls: [
      'require_source_recovery_decision_completion_gate_hash_valid',
      'require_source_recovery_decision_completion_gate_blocked',
      'require_source_recovery_decision_completion_gate_pending_human_decision',
      'issue_human_decision_request_without_recording_decision',
      'require_human_decision_response_before_recovery_decision_recorded',
      'require_human_decision_signature_before_recovery_decision_validated',
      'do_not_unlock_readiness_from_human_decision_request',
      'do_not_execute_recovery_from_human_decision_request',
      'do_not_mark_recovery_decision_recorded_from_request_issuance',
      'do_not_mark_recovery_decision_validated_from_request_issuance',
      'do_not_authorize_ai_authority'
    ],

    human_decision_request_boundary: {
      controlled_information_surface_only: true,
      request_only: true,
      pending_human_decision: true,
      no_human_decision_received: true,
      no_human_decision_validated: true,
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

function buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionRequest(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildHumanDecisionRequestPayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-132-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-REQUEST-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_REQUEST',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-REQUEST-2027-PROG-132',
    issue_id: 'PROG-132',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-REQUEST',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_recovery_decision_completion_gate_ref: SOURCE_REF,
    source_recovery_decision_completion_gate_revision_hash: source.revision_hash,
    source_recovery_decision_completion_gate_revision_hash_valid: validHash(source),

    level1_public_surface_observation_human_action_completion_recovery_decision_human_decision_request_status: STATUS,

    public_surface_observation_human_action_completion_recovery_decision_human_decision_request: {
      ...payload,
      human_decision_request_payload_digest: sha256Digest(payload),
      human_decision_request_is_defined: true,
      human_decision_request_is_ready: true,
      human_decision_request_is_evaluated: true,
      human_decision_request_is_required: true,
      human_decision_request_is_issued: true,
      human_decision_request_is_pending_human_decision: true,
      human_decision_request_does_not_record_human_decision: true,
      human_decision_request_does_not_validate_human_decision: true,
      human_decision_request_does_not_unlock_readiness: true,
      human_decision_request_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'SOURCE_RECOVERY_DECISION_COMPLETION_GATE_BLOCKED',
      'SOURCE_RECOVERY_DECISION_COMPLETION_GATE_PENDING_HUMAN_DECISION',
      'HUMAN_DECISION_REQUEST_ISSUED',
      'HUMAN_DECISION_RESPONSE_NOT_RECEIVED',
      'HUMAN_DECISION_RESPONSE_NOT_VALIDATED',
      'RECOVERY_DECISION_NOT_RECORDED',
      'RECOVERY_DECISION_NOT_VALIDATED',
      'RECOVERY_EXECUTION_NOT_ALLOWED',
      'FAIL_CLOSED_REMAINS_ACTIVE',
      'READINESS_UNLOCK_BLOCKED',
      'AI_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_human_action_completion_recovery_decision_human_decision_request_defined: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_request_ready: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_request_evaluated: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_request_required: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_request_issued: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_request_pending_human_decision: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_response_received: false,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_response_validated: false,
      public_surface_observation_human_action_completion_recovery_decision_recorded: false,
      public_surface_observation_human_action_completion_recovery_decision_validated: false,
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_passed: false,
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_blocked: true,
      public_surface_observation_human_action_completion_recovery_decision_execution_allowed: false,
      public_surface_observation_human_action_completion_recovery_decision_execution_performed: false,
      public_surface_observation_human_action_completion_fail_closed_snapshot_active: true,
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

    next_required_program: 'PROG-133-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      human_decision_received: false,
      human_decision_validated: false,
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

function writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionRequest(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionRequest({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-132-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-request.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionRequest(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_132_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_REQUEST_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  recoveryHumanDecisionOptions,
  requiredHumanDecisionResponseFields,
  buildHumanDecisionRequestPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionRequest,
  writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionRequest
};
