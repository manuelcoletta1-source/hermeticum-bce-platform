'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_ACKNOWLEDGMENT_DEFINED_PENDING_ACKNOWLEDGMENT';
const SOURCE_REF = 'docs/launch/level1/prog-132-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-request.json';

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

function requiredHumanDecisionAcknowledgmentFields() {
  return [
    'human_decision_acknowledgment_owner_ref',
    'human_decision_acknowledged_at',
    'human_decision_acknowledgment_channel',
    'human_decision_acknowledgment_statement',
    'human_decision_acknowledgment_signature_ref'
  ];
}

function buildHumanDecisionAcknowledgmentPayload(source) {
  const request = source.public_surface_observation_human_action_completion_recovery_decision_human_decision_request;

  return {
    human_decision_acknowledgment_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT::HBCE-L1-DECISION-PROOF-0001',
    source_human_decision_request_ref: SOURCE_REF,
    source_human_decision_request_digest: request.human_decision_request_payload_digest,
    human_decision_acknowledgment_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    human_decision_acknowledgment_status: 'DEFINED_PENDING_ACKNOWLEDGMENT',
    human_decision_acknowledgment_result: 'HUMAN_DECISION_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED',
    evaluated_at: '2027-01-19T19:45:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_human_decision_request_status: request.human_decision_request_status,
    imported_human_decision_request_result: request.human_decision_request_result,
    imported_human_decision_request_defined: request.human_decision_request_defined,
    imported_human_decision_request_ready: request.human_decision_request_ready,
    imported_human_decision_request_evaluated: request.human_decision_request_evaluated,
    imported_human_decision_request_required: request.human_decision_request_required,
    imported_human_decision_request_issued: request.human_decision_request_issued,
    imported_human_decision_request_delivered: request.human_decision_request_delivered,
    imported_human_decision_request_acknowledged: request.human_decision_request_acknowledged,
    imported_human_decision_request_pending_human_decision: request.human_decision_request_pending_human_decision,

    imported_human_decision_response_required: request.human_decision_response_required,
    imported_human_decision_response_received: request.human_decision_response_received,
    imported_human_decision_response_validated: request.human_decision_response_validated,
    imported_human_decision_recorded: request.human_decision_recorded,
    imported_human_decision_validated: request.human_decision_validated,

    imported_recovery_decision_recorded: request.recovery_decision_recorded,
    imported_recovery_decision_validated: request.recovery_decision_validated,
    imported_recovery_decision_pending_human_decision: request.recovery_decision_pending_human_decision,
    imported_recovery_decision_selected: request.recovery_decision_selected,
    imported_recovery_decision_execution_allowed: request.recovery_decision_execution_allowed,
    imported_recovery_decision_execution_performed: request.recovery_decision_execution_performed,

    imported_fail_closed_snapshot_active: request.fail_closed_snapshot_active,
    imported_fail_closed_remains_active: request.fail_closed_remains_active,
    imported_no_state_unlock: request.no_state_unlock,

    human_decision_acknowledgment_defined: true,
    human_decision_acknowledgment_ready: true,
    human_decision_acknowledgment_evaluated: true,
    human_decision_acknowledgment_required: true,
    human_decision_acknowledgment_received: false,
    human_decision_acknowledgment_validated: false,
    human_decision_acknowledgment_pending: true,

    required_human_decision_acknowledgment_fields: requiredHumanDecisionAcknowledgmentFields(),
    missing_human_decision_acknowledgment_fields: requiredHumanDecisionAcknowledgmentFields(),

    human_decision_acknowledgment_owner_ref: null,
    human_decision_acknowledged_at: null,
    human_decision_acknowledgment_channel: null,
    human_decision_acknowledgment_statement: null,
    human_decision_acknowledgment_signature_ref: null,

    human_decision_request_issued: true,
    human_decision_request_delivered: false,
    human_decision_request_acknowledged: false,
    human_decision_response_received: false,
    human_decision_response_validated: false,
    human_decision_recorded: false,
    human_decision_validated: false,
    selected_recovery_decision_option: null,

    recovery_decision_recorded: false,
    recovery_decision_validated: false,
    recovery_decision_pending_human_decision: true,
    recovery_decision_execution_allowed: false,
    recovery_decision_execution_performed: false,

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

    human_decision_acknowledgment_controls: [
      'require_source_human_decision_request_hash_valid',
      'require_source_human_decision_request_issued',
      'require_human_decision_acknowledgment_before_human_decision_recorded',
      'require_human_decision_acknowledgment_signature_before_acknowledgment_validated',
      'do_not_record_human_decision_from_acknowledgment_definition',
      'do_not_validate_human_decision_from_acknowledgment_definition',
      'do_not_execute_recovery_from_acknowledgment_definition',
      'do_not_unlock_readiness_from_acknowledgment_definition',
      'do_not_authorize_ai_authority'
    ],

    human_decision_acknowledgment_boundary: {
      controlled_information_surface_only: true,
      acknowledgment_definition_only: true,
      pending_acknowledgment: true,
      no_human_decision_acknowledgment_received: true,
      no_human_decision_acknowledgment_validated: true,
      no_human_decision_response_received: true,
      no_human_decision_response_validated: true,
      no_human_decision_recorded: true,
      no_human_decision_validated: true,
      no_recovery_option_selected: true,
      no_recovery_decision_recorded: true,
      no_recovery_decision_validated: true,
      no_recovery_execution_allowed: true,
      no_recovery_execution_performed: true,
      fail_closed_remains_active: true,
      no_state_unlock: true,
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

function buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionAcknowledgment(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildHumanDecisionAcknowledgmentPayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-133-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_ACKNOWLEDGMENT',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-2027-PROG-133',
    issue_id: 'PROG-133',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_human_decision_request_ref: SOURCE_REF,
    source_human_decision_request_revision_hash: source.revision_hash,
    source_human_decision_request_revision_hash_valid: validHash(source),

    level1_public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_status: STATUS,

    public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment: {
      ...payload,
      human_decision_acknowledgment_payload_digest: sha256Digest(payload),
      human_decision_acknowledgment_is_defined: true,
      human_decision_acknowledgment_is_ready: true,
      human_decision_acknowledgment_is_evaluated: true,
      human_decision_acknowledgment_is_required: true,
      human_decision_acknowledgment_is_pending: true,
      human_decision_acknowledgment_is_not_received: true,
      human_decision_acknowledgment_is_not_validated: true,
      human_decision_acknowledgment_does_not_record_human_decision: true,
      human_decision_acknowledgment_does_not_unlock_readiness: true,
      human_decision_acknowledgment_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'SOURCE_HUMAN_DECISION_REQUEST_ISSUED',
      'HUMAN_DECISION_ACKNOWLEDGMENT_NOT_RECEIVED',
      'HUMAN_DECISION_ACKNOWLEDGMENT_NOT_VALIDATED',
      'HUMAN_DECISION_RESPONSE_NOT_RECEIVED',
      'HUMAN_DECISION_RESPONSE_NOT_VALIDATED',
      'HUMAN_DECISION_NOT_RECORDED',
      'RECOVERY_DECISION_NOT_RECORDED',
      'RECOVERY_EXECUTION_NOT_ALLOWED',
      'FAIL_CLOSED_REMAINS_ACTIVE',
      'READINESS_UNLOCK_BLOCKED',
      'AI_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_defined: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_ready: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_evaluated: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_required: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_received: false,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_validated: false,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_pending: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_request_issued: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_response_received: false,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_response_validated: false,
      public_surface_observation_human_action_completion_recovery_decision_recorded: false,
      public_surface_observation_human_action_completion_recovery_decision_validated: false,
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

    next_required_program: 'PROG-134-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-COMPLETION-GATE',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      human_decision_acknowledgment_received: false,
      human_decision_acknowledgment_validated: false,
      human_decision_received: false,
      human_decision_validated: false,
      recovery_decision_recorded: false,
      recovery_decision_validated: false,
      recovery_execution_allowed: false,
      recovery_execution_performed: false,
      readiness_unlocked: false,
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

function writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionAcknowledgment(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionAcknowledgment({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-133-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionAcknowledgment(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_133_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_ACKNOWLEDGMENT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  requiredHumanDecisionAcknowledgmentFields,
  buildHumanDecisionAcknowledgmentPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionAcknowledgment,
  writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionAcknowledgment
};
