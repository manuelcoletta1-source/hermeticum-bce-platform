'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_FAIL_CLOSED_SNAPSHOT_RECORDED';
const SOURCE_REF = 'docs/launch/level1/prog-128-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-completion-gate.json';

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

function failClosedReasons() {
  return [
    'ESCALATION_COMPLETION_GATE_BLOCKED',
    'ESCALATION_ACKNOWLEDGMENT_NOT_RECEIVED',
    'ESCALATION_ACKNOWLEDGMENT_NOT_VALIDATED',
    'RETRY_ACKNOWLEDGMENT_NOT_RECEIVED',
    'RETRY_ACKNOWLEDGMENT_NOT_VALIDATED',
    'HUMAN_REMEDIATION_ACTION_NOT_COMPLETED',
    'HUMAN_ACTION_NOT_COMPLETED',
    'OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_NOT_ISSUED',
    'OPERATOR_INPUT_BUNDLE_NOT_SUBMITTED',
    'OPERATOR_INPUTS_NOT_VERIFIED',
    'PUBLIC_SURFACE_NOT_OBSERVED',
    'PUBLIC_SURFACE_OBSERVATION_NOT_READY'
  ];
}

function buildFailClosedSnapshotPayload(source) {
  const gate = source.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate;

  return {
    fail_closed_snapshot_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-FAIL-CLOSED-SNAPSHOT::HBCE-L1-DECISION-PROOF-0001',
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_ref: SOURCE_REF,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_digest: gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_payload_digest,
    fail_closed_snapshot_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    fail_closed_snapshot_status: 'RECORDED',
    fail_closed_snapshot_result: 'FAIL_CLOSED_CONFIRMED',
    evaluated_at: '2027-01-19T19:25:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_escalation_completion_gate_status: gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_status,
    imported_escalation_completion_gate_passed: gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_passed,
    imported_escalation_completion_gate_blocked: gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked,
    imported_escalation_completion_gate_blocked_pending_acknowledgment: gate.human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked_pending_acknowledgment,
    imported_escalation_acknowledgment_received: gate.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received,
    imported_escalation_acknowledgment_validated: gate.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated,
    imported_retry_acknowledgment_received: gate.human_action_completion_remediation_acknowledgment_retry_acknowledgment_received,
    imported_retry_acknowledgment_validated: gate.human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated,
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

    fail_closed_reasons: failClosedReasons(),
    fail_closed_reason_count: failClosedReasons().length,
    fail_closed_required: true,
    fail_closed_recorded: true,
    fail_closed_active: true,
    fail_closed_due_to_blocked_escalation_completion_gate: true,
    fail_closed_due_to_missing_escalation_acknowledgment: true,
    fail_closed_due_to_missing_retry_acknowledgment: true,
    fail_closed_due_to_incomplete_human_remediation: true,
    fail_closed_due_to_incomplete_human_action: true,
    fail_closed_due_to_missing_operator_input_bundle_submission_request: true,
    fail_closed_due_to_missing_operator_input_bundle: true,
    fail_closed_due_to_missing_operator_input_verification: true,
    fail_closed_due_to_missing_public_observation: true,

    escalation_completion_gate_passed: false,
    escalation_completion_gate_blocked: true,
    escalation_completion_gate_blocked_pending_acknowledgment: true,
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

    snapshot_boundary: {
      controlled_information_surface_only: true,
      snapshot_only: true,
      no_state_unlock: true,
      no_escalation_acknowledgment_created: true,
      no_retry_acknowledgment_created: true,
      no_human_remediation_completion_created: true,
      no_human_action_completion_created: true,
      no_operator_input_bundle_submission_request_created: true,
      no_operator_input_bundle_created: true,
      no_operator_input_verification_created: true,
      no_public_observation_created: true,
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

function buildLevel1PublicSurfaceObservationHumanActionCompletionFailClosedSnapshot(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildFailClosedSnapshotPayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-129-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-FAIL-CLOSED-SNAPSHOT-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_FAIL_CLOSED_SNAPSHOT',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-FAIL-CLOSED-SNAPSHOT-2027-PROG-129',
    issue_id: 'PROG-129',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-FAIL-CLOSED-SNAPSHOT',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_ref: SOURCE_REF,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_revision_hash: source.revision_hash,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_revision_hash_valid: validHash(source),

    level1_public_surface_observation_human_action_completion_fail_closed_snapshot_status: STATUS,

    public_surface_observation_human_action_completion_fail_closed_snapshot: {
      ...payload,
      fail_closed_snapshot_payload_digest: sha256Digest(payload),
      fail_closed_snapshot_is_recorded: true,
      fail_closed_snapshot_is_active: true,
      fail_closed_snapshot_is_fail_closed: true,
      fail_closed_snapshot_does_not_unlock_readiness: true,
      fail_closed_snapshot_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'SOURCE_ESCALATION_COMPLETION_GATE_BLOCKED',
      'SOURCE_ESCALATION_ACKNOWLEDGMENT_NOT_RECEIVED',
      'SOURCE_ESCALATION_ACKNOWLEDGMENT_NOT_VALIDATED',
      'SOURCE_RETRY_ACKNOWLEDGMENT_NOT_RECEIVED',
      'SOURCE_RETRY_ACKNOWLEDGMENT_NOT_VALIDATED',
      'SOURCE_HUMAN_REMEDIATION_ACTION_NOT_COMPLETED',
      'SOURCE_HUMAN_ACTION_NOT_COMPLETED',
      'SOURCE_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_NOT_ISSUED',
      'SOURCE_OPERATOR_INPUT_BUNDLE_NOT_SUBMITTED',
      'SOURCE_OPERATOR_INPUTS_NOT_VERIFIED',
      'SOURCE_PUBLIC_SURFACE_NOT_OBSERVED',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_NOT_READY',
      'FAIL_CLOSED_SNAPSHOT_RECORDED_WITHOUT_READINESS_UNLOCK'
    ],

    readiness_state: {
      public_surface_observation_human_action_completion_fail_closed_snapshot_recorded: true,
      public_surface_observation_human_action_completion_fail_closed_snapshot_active: true,
      public_surface_observation_human_action_completion_fail_closed_snapshot_fail_closed: true,
      source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_bound: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_passed: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked_pending_acknowledgment: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated: false,
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

    next_required_program: 'PROG-130-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-RECOVERY-DECISION',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      escalation_completion_gate_passed: false,
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

function writeLevel1PublicSurfaceObservationHumanActionCompletionFailClosedSnapshot(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionFailClosedSnapshot({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-129-level1-public-surface-observation-human-action-completion-fail-closed-snapshot.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionFailClosedSnapshot(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_129_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_FAIL_CLOSED_SNAPSHOT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  failClosedReasons,
  buildFailClosedSnapshotPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionFailClosedSnapshot,
  writeLevel1PublicSurfaceObservationHumanActionCompletionFailClosedSnapshot
};
