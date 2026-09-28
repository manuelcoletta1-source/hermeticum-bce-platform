'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ESCALATION_COMPLETION_GATE_BLOCKED_PENDING_ACKNOWLEDGMENT';
const SOURCE_REF = 'docs/launch/level1/prog-127-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-acknowledgment.json';

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

function escalationCompletionGateCriteria() {
  return [
    'escalation_acknowledgment_received',
    'escalation_acknowledgment_validated',
    'retry_acknowledgment_received',
    'retry_acknowledgment_validated',
    'human_remediation_action_acknowledged',
    'human_remediation_action_completed',
    'human_action_completed',
    'operator_input_bundle_submission_request_issued'
  ];
}

function buildEscalationCompletionGateItems(source) {
  const ack = source.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment;

  return ack.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_items.map((item) => ({
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_item_id: item.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-ACKNOWLEDGMENT::',
      'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-COMPLETION-GATE::'
    ),
    human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_item_id: item.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_item_id,
    human_action_completion_remediation_acknowledgment_retry_escalation_request_item_id: item.human_action_completion_remediation_acknowledgment_retry_escalation_request_item_id,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_item_id: item.human_action_completion_remediation_acknowledgment_retry_completion_gate_item_id,
    human_action_completion_remediation_acknowledgment_retry_acknowledgment_item_id: item.human_action_completion_remediation_acknowledgment_retry_acknowledgment_item_id,
    human_action_completion_remediation_acknowledgment_retry_request_item_id: item.human_action_completion_remediation_acknowledgment_retry_request_item_id,
    human_action_completion_remediation_completion_gate_item_id: item.human_action_completion_remediation_completion_gate_item_id,
    human_action_completion_remediation_acknowledgment_item_id: item.human_action_completion_remediation_acknowledgment_item_id,
    human_action_completion_remediation_request_item_id: item.human_action_completion_remediation_request_item_id,
    operator_input_bundle_submission_request_item_id: item.operator_input_bundle_submission_request_item_id,
    human_action_completion_gate_item_id: item.human_action_completion_gate_item_id,
    human_action_acknowledgment_item_id: item.human_action_acknowledgment_item_id,
    human_action_request_item_id: item.human_action_request_item_id,
    input_target_id: item.input_target_id,
    observation_target_id: item.observation_target_id,
    surface_type: item.surface_type,

    escalation_completion_gate_status: 'BLOCKED_PENDING_ACKNOWLEDGMENT',
    escalation_completion_gate_result: 'ESCALATION_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED',
    escalation_completion_gate_required: true,
    escalation_completion_gate_defined: true,
    escalation_completion_gate_ready: true,
    escalation_completion_gate_evaluated: true,
    escalation_completion_gate_passed: false,
    escalation_completion_gate_blocked: true,
    escalation_completion_gate_blocked_pending_acknowledgment: true,
    escalation_completion_gate_blocking_criteria: escalationCompletionGateCriteria(),

    source_escalation_acknowledgment_status: item.escalation_acknowledgment_status,
    source_escalation_acknowledgment_result: item.escalation_acknowledgment_result,
    source_escalation_acknowledgment_required: item.escalation_acknowledgment_required,
    source_escalation_acknowledgment_defined: item.escalation_acknowledgment_defined,
    source_escalation_acknowledgment_ready: item.escalation_acknowledgment_ready,
    source_escalation_acknowledgment_evaluated: item.escalation_acknowledgment_evaluated,
    source_escalation_acknowledgment_received: item.escalation_acknowledgment_received,
    source_escalation_acknowledgment_validated: item.escalation_acknowledgment_validated,
    source_escalation_acknowledgment_pending: item.escalation_acknowledgment_pending,
    source_escalation_acknowledgment_missing: item.escalation_acknowledgment_missing,
    source_retry_acknowledgment_received: item.source_retry_acknowledgment_received,
    source_retry_acknowledgment_validated: item.source_retry_acknowledgment_validated,
    source_retry_completion_gate_blocked: item.source_retry_completion_gate_blocked,
    source_retry_completion_gate_passed: item.source_retry_completion_gate_passed,

    human_remediation_action_requested: true,
    human_remediation_action_acknowledged: false,
    human_remediation_action_completed: false,
    human_action_completed: false,
    operator_input_bundle_submission_request_issued: false,
    operator_input_bundle_submitted: false,
    operator_inputs_collected: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    public_surface_observed: false,
    public_surface_observation_ready: false,
    escalation_completion_gate_comment: 'Escalation completion gate remains blocked until escalation acknowledgment is received and validated.'
  }));
}

function buildPayload(source) {
  const ack = source.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment;
  const items = buildEscalationCompletionGateItems(source);

  return {
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-COMPLETION-GATE::HBCE-L1-DECISION-PROOF-0001',
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_ref: SOURCE_REF,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_digest: ack.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_payload_digest,
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_status: 'BLOCKED_PENDING_ACKNOWLEDGMENT',
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_result: 'ESCALATION_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED',
    evaluated_at: '2027-01-19T19:20:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_status: ack.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_status,
    imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_ready: ack.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_ready,
    imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_required: ack.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_required,
    imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received: ack.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received,
    imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated: ack.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated,
    imported_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_pending: ack.human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_pending,
    imported_human_action_completion_remediation_acknowledgment_retry_escalation_request_issued: ack.human_action_completion_remediation_acknowledgment_retry_escalation_request_issued,
    imported_human_action_completion_remediation_acknowledgment_retry_escalation_request_pending_acknowledgment: ack.human_action_completion_remediation_acknowledgment_retry_escalation_request_pending_acknowledgment,
    imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_passed: ack.human_action_completion_remediation_acknowledgment_retry_completion_gate_passed,
    imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked: ack.human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked,
    imported_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment: ack.human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_received,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending,
    imported_human_remediation_action_requested: ack.human_remediation_action_requested,
    imported_human_remediation_action_acknowledged: ack.human_remediation_action_acknowledged,
    imported_human_remediation_action_completed: ack.human_remediation_action_completed,
    imported_human_action_completed: ack.human_action_completed,
    imported_operator_input_bundle_submission_request_issued: ack.operator_input_bundle_submission_request_issued,
    imported_operator_input_bundle_submitted: ack.operator_input_bundle_submitted,
    imported_operator_inputs_collected: ack.operator_inputs_collected,
    imported_operator_inputs_submitted: ack.operator_inputs_submitted,
    imported_operator_inputs_verified: ack.operator_inputs_verified,
    imported_public_surface_observed: ack.public_surface_observed,
    imported_public_surface_observation_ready: ack.public_surface_observation_ready,

    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_items: items,
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_item_count: items.length,
    all_escalation_completion_gate_items_required: items.every((item) => item.escalation_completion_gate_required === true),
    all_escalation_completion_gate_items_defined: items.every((item) => item.escalation_completion_gate_defined === true),
    all_escalation_completion_gate_items_ready: items.every((item) => item.escalation_completion_gate_ready === true),
    all_escalation_completion_gate_items_evaluated: items.every((item) => item.escalation_completion_gate_evaluated === true),
    all_escalation_completion_gate_items_not_passed: items.every((item) => item.escalation_completion_gate_passed === false),
    all_escalation_completion_gate_items_blocked: items.every((item) => item.escalation_completion_gate_blocked === true),
    all_escalation_completion_gate_items_blocked_pending_acknowledgment: items.every((item) => item.escalation_completion_gate_blocked_pending_acknowledgment === true),
    all_escalation_completion_gate_items_source_escalation_acknowledgment_not_received: items.every((item) => item.source_escalation_acknowledgment_received === false),
    all_escalation_completion_gate_items_source_escalation_acknowledgment_not_validated: items.every((item) => item.source_escalation_acknowledgment_validated === false),
    all_escalation_completion_gate_items_source_retry_acknowledgment_not_received: items.every((item) => item.source_retry_acknowledgment_received === false),
    all_escalation_completion_gate_items_source_retry_acknowledgment_not_validated: items.every((item) => item.source_retry_acknowledgment_validated === false),
    all_escalation_completion_gate_items_human_remediation_not_acknowledged: items.every((item) => item.human_remediation_action_acknowledged === false),
    all_escalation_completion_gate_items_human_remediation_not_completed: items.every((item) => item.human_remediation_action_completed === false),
    all_escalation_completion_gate_items_human_action_not_completed: items.every((item) => item.human_action_completed === false),
    all_escalation_completion_gate_items_bundle_request_not_issued: items.every((item) => item.operator_input_bundle_submission_request_issued === false),
    all_escalation_completion_gate_items_bundle_not_submitted: items.every((item) => item.operator_input_bundle_submitted === false),
    all_escalation_completion_gate_items_operator_inputs_not_collected: items.every((item) => item.operator_inputs_collected === false),
    all_escalation_completion_gate_items_operator_inputs_not_submitted: items.every((item) => item.operator_inputs_submitted === false),
    all_escalation_completion_gate_items_operator_inputs_not_verified: items.every((item) => item.operator_inputs_verified === false),
    all_escalation_completion_gate_items_public_surface_not_observed: items.every((item) => item.public_surface_observed === false),
    all_escalation_completion_gate_items_public_surface_observation_not_ready: items.every((item) => item.public_surface_observation_ready === false),

    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_defined: true,
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_ready: true,
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_evaluated: true,
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_required: true,
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_passed: false,
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked: true,
    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked_pending_acknowledgment: true,

    human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received: false,
    human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated: false,
    human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_pending: true,
    human_action_completion_remediation_acknowledgment_retry_escalation_request_issued: true,
    human_action_completion_remediation_acknowledgment_retry_escalation_request_pending_acknowledgment: true,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_passed: false,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked: true,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment: true,
    human_action_completion_remediation_acknowledgment_retry_acknowledgment_received: false,
    human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated: false,
    human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending: true,
    human_remediation_action_requested: true,
    human_remediation_action_acknowledged: false,
    human_remediation_action_completed: false,
    human_action_completed: false,
    operator_input_bundle_submission_request_issued: false,
    operator_input_bundle_submitted: false,
    operator_inputs_collected: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    public_surface_observed: false,
    public_surface_observation_ready: false,
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    ai_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_authority_allowed: false,

    human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_boundary: {
      controlled_information_surface_only: true,
      escalation_completion_gate_evaluation_only: true,
      escalation_completion_gate_blocked_pending_acknowledgment: true,
      no_escalation_acknowledgment_received: true,
      no_escalation_acknowledgment_validated: true,
      no_retry_acknowledgment_received: true,
      no_retry_acknowledgment_validated: true,
      no_human_remediation_action_acknowledged: true,
      no_human_remediation_action_completed: true,
      no_human_action_completed: true,
      no_operator_input_bundle_submission_request_issued: true,
      no_operator_input_bundle_submitted: true,
      no_operator_inputs_collected: true,
      no_operator_inputs_submitted: true,
      no_operator_inputs_verified: true,
      no_public_observation_recorded: true,
      no_ai_authority_claim: true
    }
  };
}

function buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-128-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-COMPLETION-GATE-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ESCALATION_COMPLETION_GATE',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-COMPLETION-GATE-2027-PROG-128',
    issue_id: 'PROG-128',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-COMPLETION-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_ref: SOURCE_REF,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_revision_hash: source.revision_hash,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_revision_hash_valid: validHash(source),
    level1_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_status: STATUS,
    public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate: {
      ...payload,
      human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_payload_digest: sha256Digest(payload),
      human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_is_defined: true,
      human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_is_ready: true,
      human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_is_evaluated: true,
      human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_is_required: true,
      human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_is_blocked: true,
      human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_is_not_passed: true,
      human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_does_not_authorize_ai_authority: true
    },
    fail_closed_codes: [
      'SOURCE_ESCALATION_ACKNOWLEDGMENT_NOT_RECEIVED',
      'SOURCE_ESCALATION_ACKNOWLEDGMENT_NOT_VALIDATED',
      'SOURCE_RETRY_ACKNOWLEDGMENT_NOT_RECEIVED',
      'SOURCE_RETRY_ACKNOWLEDGMENT_NOT_VALIDATED',
      'ESCALATION_COMPLETION_GATE_BLOCKED',
      'HUMAN_REMEDIATION_ACTION_NOT_COMPLETED',
      'HUMAN_ACTION_NOT_COMPLETED',
      'OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_NOT_ISSUED',
      'OPERATOR_INPUTS_NOT_VERIFIED',
      'AI_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ESCALATION_COMPLETION_GATE_AUTHORITY_CLAIM_BLOCKED'
    ],
    readiness_state: {
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_defined: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_ready: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_evaluated: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_required: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_passed: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_completion_gate_blocked_pending_acknowledgment: true,
      source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_bound: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_received: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_validated: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_acknowledgment_pending: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_issued: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_escalation_request_pending_acknowledgment: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_passed: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      human_remediation_action_required: true,
      human_remediation_action_requested: true,
      human_remediation_action_acknowledged: false,
      human_remediation_action_completed: false,
      human_action_completed: false,
      operator_input_bundle_required: true,
      operator_input_bundle_submission_allowed: false,
      operator_input_bundle_submitted: false,
      operator_input_bundle_submission_request_issued: false,
      operator_inputs_collected: false,
      operator_inputs_submitted: false,
      operator_inputs_verified: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },
    next_required_program: 'PROG-129-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-FAIL-CLOSED-SNAPSHOT',
    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      escalation_acknowledgment_received: false,
      escalation_acknowledgment_validated: false,
      retry_acknowledgment_received: false,
      retry_acknowledgment_validated: false,
      escalation_completion_gate_passed: false,
      human_remediation_action_completed: false,
      human_action_completed: false,
      operator_input_bundle_submission_request_issued: false,
      operator_input_bundle_submitted: false,
      operator_inputs_collected: false,
      operator_inputs_submitted: false,
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

function writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-128-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-escalation-completion-gate.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_128_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ESCALATION_COMPLETION_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  escalationCompletionGateCriteria,
  buildEscalationCompletionGateItems,
  buildObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGatePayload: buildPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGate,
  writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryEscalationCompletionGate
};
