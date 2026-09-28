'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_COMPLETION_GATE_BLOCKED_PENDING_ACKNOWLEDGMENT';
const SOURCE_REF = 'docs/launch/level1/prog-133-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-acknowledgment.json';

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

function humanDecisionCompletionGateCriteria() {
  return [
    'SOURCE_HUMAN_DECISION_ACKNOWLEDGMENT_DEFINED',
    'SOURCE_HUMAN_DECISION_ACKNOWLEDGMENT_REQUIRED',
    'SOURCE_HUMAN_DECISION_ACKNOWLEDGMENT_PENDING',
    'SOURCE_HUMAN_DECISION_ACKNOWLEDGMENT_NOT_RECEIVED',
    'SOURCE_HUMAN_DECISION_ACKNOWLEDGMENT_NOT_VALIDATED',
    'SOURCE_HUMAN_DECISION_RESPONSE_NOT_RECEIVED',
    'SOURCE_HUMAN_DECISION_RESPONSE_NOT_VALIDATED',
    'SOURCE_HUMAN_DECISION_NOT_RECORDED',
    'SOURCE_RECOVERY_DECISION_NOT_RECORDED',
    'SOURCE_RECOVERY_EXECUTION_NOT_ALLOWED',
    'SOURCE_FAIL_CLOSED_REMAINS_ACTIVE',
    'SOURCE_READINESS_UNLOCK_BLOCKED'
  ];
}

function buildHumanDecisionCompletionGatePayload(source) {
  const ack = source.public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment;

  return {
    human_decision_completion_gate_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-COMPLETION-GATE::HBCE-L1-DECISION-PROOF-0001',
    source_human_decision_acknowledgment_ref: SOURCE_REF,
    source_human_decision_acknowledgment_digest: ack.human_decision_acknowledgment_payload_digest,
    human_decision_completion_gate_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    human_decision_completion_gate_status: 'BLOCKED_PENDING_ACKNOWLEDGMENT',
    human_decision_completion_gate_result: 'HUMAN_DECISION_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED',
    evaluated_at: '2027-01-19T19:50:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_human_decision_acknowledgment_status: ack.human_decision_acknowledgment_status,
    imported_human_decision_acknowledgment_result: ack.human_decision_acknowledgment_result,
    imported_human_decision_acknowledgment_defined: ack.human_decision_acknowledgment_defined,
    imported_human_decision_acknowledgment_ready: ack.human_decision_acknowledgment_ready,
    imported_human_decision_acknowledgment_evaluated: ack.human_decision_acknowledgment_evaluated,
    imported_human_decision_acknowledgment_required: ack.human_decision_acknowledgment_required,
    imported_human_decision_acknowledgment_received: ack.human_decision_acknowledgment_received,
    imported_human_decision_acknowledgment_validated: ack.human_decision_acknowledgment_validated,
    imported_human_decision_acknowledgment_pending: ack.human_decision_acknowledgment_pending,

    imported_human_decision_request_issued: ack.human_decision_request_issued,
    imported_human_decision_request_delivered: ack.human_decision_request_delivered,
    imported_human_decision_request_acknowledged: ack.human_decision_request_acknowledged,
    imported_human_decision_response_received: ack.human_decision_response_received,
    imported_human_decision_response_validated: ack.human_decision_response_validated,
    imported_human_decision_recorded: ack.human_decision_recorded,
    imported_human_decision_validated: ack.human_decision_validated,
    imported_selected_recovery_decision_option: ack.selected_recovery_decision_option,

    imported_recovery_decision_recorded: ack.recovery_decision_recorded,
    imported_recovery_decision_validated: ack.recovery_decision_validated,
    imported_recovery_decision_pending_human_decision: ack.recovery_decision_pending_human_decision,
    imported_recovery_decision_execution_allowed: ack.recovery_decision_execution_allowed,
    imported_recovery_decision_execution_performed: ack.recovery_decision_execution_performed,

    imported_fail_closed_snapshot_active: ack.fail_closed_snapshot_active,
    imported_fail_closed_remains_active: ack.fail_closed_remains_active,
    imported_no_state_unlock: ack.no_state_unlock,

    human_decision_completion_gate_defined: true,
    human_decision_completion_gate_ready: true,
    human_decision_completion_gate_evaluated: true,
    human_decision_completion_gate_required: true,
    human_decision_completion_gate_passed: false,
    human_decision_completion_gate_blocked: true,
    human_decision_completion_gate_blocked_pending_acknowledgment: true,

    human_decision_acknowledgment_received: false,
    human_decision_acknowledgment_validated: false,
    human_decision_acknowledgment_pending: true,
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

    human_decision_completion_gate_blocking_criteria: humanDecisionCompletionGateCriteria(),

    human_decision_completion_gate_controls: [
      'require_source_human_decision_acknowledgment_hash_valid',
      'require_source_human_decision_acknowledgment_defined',
      'require_source_human_decision_acknowledgment_pending',
      'block_completion_when_acknowledgment_not_received',
      'block_completion_when_acknowledgment_not_validated',
      'block_human_decision_recording_until_acknowledgment_validated',
      'block_recovery_execution_until_human_decision_validated',
      'do_not_unlock_readiness_from_blocked_completion_gate',
      'do_not_authorize_ai_authority'
    ],

    human_decision_completion_gate_boundary: {
      controlled_information_surface_only: true,
      completion_gate_only: true,
      blocked_pending_acknowledgment: true,
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

function buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionCompletionGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildHumanDecisionCompletionGatePayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-134-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-COMPLETION-GATE-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_COMPLETION_GATE',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-COMPLETION-GATE-2027-PROG-134',
    issue_id: 'PROG-134',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-COMPLETION-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_human_decision_acknowledgment_ref: SOURCE_REF,
    source_human_decision_acknowledgment_revision_hash: source.revision_hash,
    source_human_decision_acknowledgment_revision_hash_valid: validHash(source),

    level1_public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_status: STATUS,

    public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate: {
      ...payload,
      human_decision_completion_gate_payload_digest: sha256Digest(payload),
      human_decision_completion_gate_is_defined: true,
      human_decision_completion_gate_is_ready: true,
      human_decision_completion_gate_is_evaluated: true,
      human_decision_completion_gate_is_required: true,
      human_decision_completion_gate_is_blocked: true,
      human_decision_completion_gate_is_blocked_pending_acknowledgment: true,
      human_decision_completion_gate_did_not_pass: true,
      human_decision_completion_gate_does_not_record_human_decision: true,
      human_decision_completion_gate_does_not_unlock_readiness: true,
      human_decision_completion_gate_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'SOURCE_HUMAN_DECISION_ACKNOWLEDGMENT_PENDING',
      'HUMAN_DECISION_ACKNOWLEDGMENT_NOT_RECEIVED',
      'HUMAN_DECISION_ACKNOWLEDGMENT_NOT_VALIDATED',
      'HUMAN_DECISION_COMPLETION_GATE_BLOCKED',
      'HUMAN_DECISION_RESPONSE_NOT_RECEIVED',
      'HUMAN_DECISION_NOT_RECORDED',
      'RECOVERY_DECISION_NOT_RECORDED',
      'RECOVERY_EXECUTION_NOT_ALLOWED',
      'FAIL_CLOSED_REMAINS_ACTIVE',
      'READINESS_UNLOCK_BLOCKED',
      'AI_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_defined: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_ready: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_evaluated: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_required: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_passed: false,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_blocked: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_completion_gate_blocked_pending_acknowledgment: true,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_received: false,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_validated: false,
      public_surface_observation_human_action_completion_recovery_decision_human_decision_acknowledgment_pending: true,
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

    next_required_program: 'PROG-135-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-ACKNOWLEDGMENT-RETRY-REQUEST',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      human_decision_completion_gate_passed: false,
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

function writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionCompletionGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionCompletionGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-134-level1-public-surface-observation-human-action-completion-recovery-decision-human-decision-completion-gate.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionCompletionGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_134_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_HUMAN_DECISION_COMPLETION_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  humanDecisionCompletionGateCriteria,
  buildHumanDecisionCompletionGatePayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionCompletionGate,
  writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionHumanDecisionCompletionGate
};
