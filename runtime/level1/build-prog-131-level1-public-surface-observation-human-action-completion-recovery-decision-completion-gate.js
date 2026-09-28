'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_COMPLETION_GATE_BLOCKED_PENDING_HUMAN_DECISION';
const SOURCE_REF = 'docs/launch/level1/prog-130-level1-public-surface-observation-human-action-completion-recovery-decision.json';

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

function recoveryCompletionGateCriteria() {
  return [
    'SOURCE_RECOVERY_DECISION_DEFINED',
    'SOURCE_RECOVERY_DECISION_REQUIRED',
    'SOURCE_RECOVERY_DECISION_PENDING_HUMAN_DECISION',
    'SOURCE_RECOVERY_DECISION_NOT_RECORDED',
    'SOURCE_RECOVERY_DECISION_NOT_VALIDATED',
    'SOURCE_RECOVERY_OPTION_NOT_SELECTED',
    'SOURCE_RECOVERY_EXECUTION_NOT_ALLOWED',
    'SOURCE_RECOVERY_EXECUTION_NOT_PERFORMED',
    'SOURCE_FAIL_CLOSED_REMAINS_ACTIVE',
    'SOURCE_READINESS_UNLOCK_BLOCKED'
  ];
}

function buildRecoveryDecisionCompletionGatePayload(source) {
  const decision = source.public_surface_observation_human_action_completion_recovery_decision;

  return {
    recovery_decision_completion_gate_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-COMPLETION-GATE::HBCE-L1-DECISION-PROOF-0001',
    source_recovery_decision_ref: SOURCE_REF,
    source_recovery_decision_digest: decision.recovery_decision_payload_digest,
    recovery_decision_completion_gate_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    recovery_decision_completion_gate_status: 'BLOCKED_PENDING_HUMAN_DECISION',
    recovery_decision_completion_gate_result: 'RECOVERY_DECISION_REQUIRED_NOT_RECORDED',
    evaluated_at: '2027-01-19T19:35:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_recovery_decision_status: decision.recovery_decision_status,
    imported_recovery_decision_result: decision.recovery_decision_result,
    imported_recovery_decision_defined: decision.recovery_decision_defined,
    imported_recovery_decision_ready: decision.recovery_decision_ready,
    imported_recovery_decision_evaluated: decision.recovery_decision_evaluated,
    imported_recovery_decision_required: decision.recovery_decision_required,
    imported_recovery_decision_recorded: decision.recovery_decision_recorded,
    imported_recovery_decision_validated: decision.recovery_decision_validated,
    imported_recovery_decision_pending_human_decision: decision.recovery_decision_pending_human_decision,
    imported_recovery_decision_selected: decision.recovery_decision_selected,
    imported_recovery_decision_approved: decision.recovery_decision_approved,
    imported_recovery_decision_rejected: decision.recovery_decision_rejected,
    imported_recovery_decision_execution_allowed: decision.recovery_decision_execution_allowed,
    imported_recovery_decision_execution_ready: decision.recovery_decision_execution_ready,
    imported_recovery_decision_execution_performed: decision.recovery_decision_execution_performed,

    imported_recovery_decision_owner_ref: decision.recovery_decision_owner_ref,
    imported_selected_recovery_decision_option: decision.selected_recovery_decision_option,
    imported_recovery_decided_at: decision.recovery_decided_at,
    imported_recovery_decision_channel: decision.recovery_decision_channel,
    imported_recovery_decision_statement: decision.recovery_decision_statement,
    imported_recovery_decision_signature_ref: decision.recovery_decision_signature_ref,

    imported_fail_closed_snapshot_recorded: decision.fail_closed_snapshot_recorded,
    imported_fail_closed_snapshot_active: decision.fail_closed_snapshot_active,
    imported_fail_closed_remains_active: decision.fail_closed_remains_active,
    imported_no_state_unlock: decision.no_state_unlock,

    imported_escalation_completion_gate_passed: decision.escalation_completion_gate_passed,
    imported_escalation_completion_gate_blocked: decision.escalation_completion_gate_blocked,
    imported_escalation_acknowledgment_received: decision.escalation_acknowledgment_received,
    imported_escalation_acknowledgment_validated: decision.escalation_acknowledgment_validated,
    imported_retry_acknowledgment_received: decision.retry_acknowledgment_received,
    imported_retry_acknowledgment_validated: decision.retry_acknowledgment_validated,
    imported_human_remediation_action_completed: decision.human_remediation_action_completed,
    imported_human_action_completed: decision.human_action_completed,
    imported_operator_input_bundle_submission_request_issued: decision.operator_input_bundle_submission_request_issued,
    imported_operator_input_bundle_submitted: decision.operator_input_bundle_submitted,
    imported_operator_inputs_verified: decision.operator_inputs_verified,
    imported_public_surface_observed: decision.public_surface_observed,
    imported_public_surface_observation_ready: decision.public_surface_observation_ready,
    imported_external_customer_ready: decision.external_customer_ready,
    imported_banking_pack_ready: decision.banking_pack_ready,
    imported_level1_launch_ready: decision.level1_launch_ready,
    imported_production_ready: decision.production_ready,

    recovery_decision_completion_gate_defined: true,
    recovery_decision_completion_gate_ready: true,
    recovery_decision_completion_gate_evaluated: true,
    recovery_decision_completion_gate_required: true,
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

    recovery_decision_completion_gate_blocking_criteria: recoveryCompletionGateCriteria(),

    recovery_decision_completion_gate_boundary: {
      controlled_information_surface_only: true,
      completion_gate_only: true,
      pending_human_decision: true,
      no_recovery_decision_recorded: true,
      no_recovery_decision_validated: true,
      no_recovery_option_selected: true,
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

function buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionCompletionGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildRecoveryDecisionCompletionGatePayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-131-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-COMPLETION-GATE-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_COMPLETION_GATE',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-COMPLETION-GATE-2027-PROG-131',
    issue_id: 'PROG-131',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-COMPLETION-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_recovery_decision_ref: SOURCE_REF,
    source_recovery_decision_revision_hash: source.revision_hash,
    source_recovery_decision_revision_hash_valid: validHash(source),

    level1_public_surface_observation_human_action_completion_recovery_decision_completion_gate_status: STATUS,

    public_surface_observation_human_action_completion_recovery_decision_completion_gate: {
      ...payload,
      recovery_decision_completion_gate_payload_digest: sha256Digest(payload),
      recovery_decision_completion_gate_is_defined: true,
      recovery_decision_completion_gate_is_ready: true,
      recovery_decision_completion_gate_is_evaluated: true,
      recovery_decision_completion_gate_is_required: true,
      recovery_decision_completion_gate_is_blocked: true,
      recovery_decision_completion_gate_is_blocked_pending_human_decision: true,
      recovery_decision_completion_gate_did_not_pass: true,
      recovery_decision_completion_gate_does_not_unlock_readiness: true,
      recovery_decision_completion_gate_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'SOURCE_RECOVERY_DECISION_NOT_RECORDED',
      'SOURCE_RECOVERY_DECISION_NOT_VALIDATED',
      'SOURCE_RECOVERY_DECISION_OPTION_NOT_SELECTED',
      'SOURCE_RECOVERY_DECISION_EXECUTION_NOT_ALLOWED',
      'SOURCE_RECOVERY_DECISION_EXECUTION_NOT_PERFORMED',
      'FAIL_CLOSED_REMAINS_ACTIVE',
      'READINESS_UNLOCK_BLOCKED',
      'AI_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_defined: true,
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_ready: true,
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_evaluated: true,
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_required: true,
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_passed: false,
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_blocked: true,
      public_surface_observation_human_action_completion_recovery_decision_completion_gate_blocked_pending_human_decision: true,
      source_recovery_decision_bound: true,
      public_surface_observation_human_action_completion_recovery_decision_defined: true,
      public_surface_observation_human_action_completion_recovery_decision_recorded: false,
      public_surface_observation_human_action_completion_recovery_decision_validated: false,
      public_surface_observation_human_action_completion_recovery_decision_pending_human_decision: true,
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

    next_required_program: 'PROG-132-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION-HUMAN-DECISION-REQUEST',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      recovery_decision_completion_gate_passed: false,
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

function writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionCompletionGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionCompletionGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-131-level1-public-surface-observation-human-action-completion-recovery-decision-completion-gate.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionCompletionGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_131_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_RECOVERY_DECISION_COMPLETION_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  recoveryCompletionGateCriteria,
  buildRecoveryDecisionCompletionGatePayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionCompletionGate,
  writeLevel1PublicSurfaceObservationHumanActionCompletionRecoveryDecisionCompletionGate
};
