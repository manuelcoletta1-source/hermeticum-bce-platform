'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_COMPLETION_GATE_BLOCKED_PENDING_ACKNOWLEDGMENT';
const SOURCE_REF = 'docs/launch/level1/prog-124-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-acknowledgment.json';

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

function retryCompletionGateCriteria() {
  return [
    'retry_acknowledgment_received',
    'retry_acknowledgment_validated',
    'human_remediation_action_acknowledged',
    'human_remediation_action_completed',
    'human_action_completed',
    'operator_input_bundle_submission_request_issued'
  ];
}

function buildRetryCompletionGateItems(source) {
  const ack = source.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment;

  return ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_items.map((item) => ({
    human_action_completion_remediation_acknowledgment_retry_completion_gate_item_id: item.human_action_completion_remediation_acknowledgment_retry_acknowledgment_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ACKNOWLEDGMENT::',
      'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-COMPLETION-GATE::'
    ),
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
    source_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ref: SOURCE_REF,

    retry_completion_gate_status: 'BLOCKED_PENDING_ACKNOWLEDGMENT',
    retry_completion_gate_result: 'RETRY_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED',
    source_retry_acknowledgment_status: item.retry_acknowledgment_status,
    source_retry_acknowledgment_result: item.retry_acknowledgment_result,
    source_retry_acknowledgment_required: item.retry_acknowledgment_required,
    source_retry_acknowledgment_defined: item.retry_acknowledgment_defined,
    source_retry_acknowledgment_ready: item.retry_acknowledgment_ready,
    source_retry_acknowledgment_evaluated: item.retry_acknowledgment_evaluated,
    source_retry_acknowledgment_received: item.retry_acknowledgment_received,
    source_retry_acknowledgment_validated: item.retry_acknowledgment_validated,
    source_retry_acknowledgment_pending: item.retry_acknowledgment_pending,
    source_retry_acknowledgment_missing: item.retry_acknowledgment_missing,

    retry_completion_gate_required: true,
    retry_completion_gate_defined: true,
    retry_completion_gate_ready: true,
    retry_completion_gate_evaluated: true,
    retry_completion_gate_passed: false,
    retry_completion_gate_blocked: true,
    retry_completion_gate_blocked_pending_acknowledgment: true,
    retry_completion_gate_blocking_criteria: retryCompletionGateCriteria(),

    human_remediation_action_required: true,
    human_remediation_action_requested: true,
    human_remediation_action_acknowledged: false,
    human_remediation_action_completed: false,
    human_action_completed: false,
    human_action_completion_gate_passed: false,
    human_action_completion_allowed: false,
    human_action_completion_ready: false,
    human_action_completion_performed: false,

    operator_input_bundle_submission_request_issued: false,
    operator_input_bundle_submission_allowed: false,
    operator_input_bundle_submitted: false,
    operator_inputs_collected: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    public_surface_observed: false,
    public_surface_observation_ready: false,
    retry_completion_gate_comment: 'Retry completion gate is blocked because retry acknowledgment has not been received or validated.'
  }));
}

function buildPayload(source) {
  const ack = source.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment;
  const items = buildRetryCompletionGateItems(source);

  return {
    human_action_completion_remediation_acknowledgment_retry_completion_gate_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-COMPLETION-GATE::HBCE-L1-DECISION-PROOF-0001',
    human_action_completion_remediation_acknowledgment_retry_completion_gate_key: 'hbce.level1.public_surface.observation_human_action_completion_remediation_acknowledgment_retry_completion_gate.controlled_information.0001',
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ref: SOURCE_REF,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_digest: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_payload_digest,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    human_action_completion_remediation_acknowledgment_retry_completion_gate_status: 'BLOCKED_PENDING_ACKNOWLEDGMENT',
    human_action_completion_remediation_acknowledgment_retry_completion_gate_result: 'RETRY_ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED',
    evaluated_at: '2027-01-19T19:05:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_status: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_status,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_result: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_result,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_defined: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_defined,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ready: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_ready,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_evaluated: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_evaluated,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_required: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_required,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_received,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated,
    imported_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending,
    imported_human_action_completion_remediation_acknowledgment_retry_request_issued: ack.human_action_completion_remediation_acknowledgment_retry_request_issued,
    imported_human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment: ack.human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment,
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

    human_action_completion_remediation_acknowledgment_retry_completion_gate_items: items,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_item_count: items.length,
    all_retry_acknowledgment_items_have_retry_completion_gate_items: ack.human_action_completion_remediation_acknowledgment_retry_acknowledgment_items.every((item) =>
      items.some((gateItem) => gateItem.human_action_completion_remediation_acknowledgment_retry_acknowledgment_item_id === item.human_action_completion_remediation_acknowledgment_retry_acknowledgment_item_id)
    ),
    all_retry_completion_gate_items_required: items.every((item) => item.retry_completion_gate_required === true),
    all_retry_completion_gate_items_defined: items.every((item) => item.retry_completion_gate_defined === true),
    all_retry_completion_gate_items_ready: items.every((item) => item.retry_completion_gate_ready === true),
    all_retry_completion_gate_items_evaluated: items.every((item) => item.retry_completion_gate_evaluated === true),
    all_retry_completion_gate_items_not_passed: items.every((item) => item.retry_completion_gate_passed === false),
    all_retry_completion_gate_items_blocked: items.every((item) => item.retry_completion_gate_blocked === true),
    all_retry_completion_gate_items_blocked_pending_acknowledgment: items.every((item) => item.retry_completion_gate_blocked_pending_acknowledgment === true),
    all_retry_completion_gate_items_source_retry_acknowledgment_not_received: items.every((item) => item.source_retry_acknowledgment_received === false),
    all_retry_completion_gate_items_source_retry_acknowledgment_not_validated: items.every((item) => item.source_retry_acknowledgment_validated === false),
    all_retry_completion_gate_items_source_retry_acknowledgment_missing: items.every((item) => item.source_retry_acknowledgment_missing === true),
    all_retry_completion_gate_items_human_remediation_not_acknowledged: items.every((item) => item.human_remediation_action_acknowledged === false),
    all_retry_completion_gate_items_human_remediation_not_completed: items.every((item) => item.human_remediation_action_completed === false),
    all_retry_completion_gate_items_human_action_not_completed: items.every((item) => item.human_action_completed === false),
    all_retry_completion_gate_items_bundle_request_not_issued: items.every((item) => item.operator_input_bundle_submission_request_issued === false),
    all_retry_completion_gate_items_bundle_not_submitted: items.every((item) => item.operator_input_bundle_submitted === false),
    all_retry_completion_gate_items_operator_inputs_not_collected: items.every((item) => item.operator_inputs_collected === false),
    all_retry_completion_gate_items_operator_inputs_not_submitted: items.every((item) => item.operator_inputs_submitted === false),
    all_retry_completion_gate_items_operator_inputs_not_verified: items.every((item) => item.operator_inputs_verified === false),
    all_retry_completion_gate_items_public_surface_not_observed: items.every((item) => item.public_surface_observed === false),
    all_retry_completion_gate_items_public_surface_observation_not_ready: items.every((item) => item.public_surface_observation_ready === false),

    human_action_completion_remediation_acknowledgment_retry_completion_gate_defined: true,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_ready: true,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_evaluated: true,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_required: true,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_passed: false,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked: true,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment: true,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_completion_allowed: false,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_completion_ready: false,
    human_action_completion_remediation_acknowledgment_retry_completion_gate_completion_performed: false,

    human_action_completion_remediation_acknowledgment_retry_acknowledgment_received: false,
    human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated: false,
    human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending: true,
    human_action_completion_remediation_acknowledgment_retry_request_issued: true,
    human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment: true,
    human_remediation_action_required: true,
    human_remediation_action_requested: true,
    human_remediation_action_acknowledged: false,
    human_remediation_action_completed: false,
    human_action_completed: false,
    human_action_completion_gate_passed: false,
    human_action_completion_allowed: false,
    human_action_completion_ready: false,
    human_action_completion_performed: false,
    operator_input_bundle_submission_request_issued: false,
    operator_input_bundle_submission_allowed: false,
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

    human_action_completion_remediation_acknowledgment_retry_completion_gate_controls: [
      'require_source_human_action_completion_remediation_acknowledgment_retry_acknowledgment_hash_valid',
      'require_source_retry_acknowledgment_defined',
      'require_source_retry_acknowledgment_ready',
      'require_source_retry_acknowledgment_evaluated',
      'require_source_retry_acknowledgment_received',
      'require_source_retry_acknowledgment_validated',
      'require_human_remediation_action_acknowledged',
      'require_human_remediation_action_completed',
      'require_human_action_completed',
      'do_not_pass_retry_completion_gate_without_received_retry_acknowledgment',
      'do_not_pass_retry_completion_gate_without_validated_retry_acknowledgment',
      'do_not_mark_human_remediation_completed_from_retry_completion_gate',
      'do_not_mark_human_action_completed_from_retry_completion_gate',
      'do_not_issue_operator_input_bundle_submission_request_from_blocked_retry_completion_gate',
      'do_not_mark_operator_input_bundle_submitted_without_bundle_submission',
      'do_not_mark_operator_inputs_collected_without_submitted_bundle',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_infer_public_observation_from_retry_completion_gate',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_until_retry_acknowledgment_and_completion_are_verified'
    ],

    human_action_completion_remediation_acknowledgment_retry_completion_gate_boundary: {
      controlled_information_surface_only: true,
      retry_completion_gate_evaluation_only: true,
      retry_completion_gate_blocked_pending_acknowledgment: true,
      no_retry_acknowledgment_received: true,
      no_retry_acknowledgment_validated: true,
      no_human_remediation_action_acknowledged: true,
      no_human_remediation_action_completed: true,
      no_human_action_completed: true,
      no_operator_input_bundle_submission_request_issued: true,
      no_operator_input_bundle_submitted: true,
      no_operator_inputs_recorded: true,
      no_operator_inputs_collected: true,
      no_operator_inputs_submitted: true,
      no_operator_inputs_verified: true,
      no_public_observation_recorded: true,
      no_customer_data: true,
      no_live_system_control: true,
      no_production_integration: true,
      no_legal_validity_claim: true,
      no_public_accreditation_claim: true,
      no_procurement_eligibility_claim: true,
      no_external_effect_claim: true,
      no_business_success_claim: true,
      no_ai_authority_claim: true,
      no_security_certification_claim: true,
      no_customer_logo_without_authorization: true
    },

    source_retry_acknowledgment_defined: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_defined === true,
    source_retry_acknowledgment_ready: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ready === true,
    source_retry_acknowledgment_evaluated: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_evaluated === true,
    source_retry_acknowledgment_required: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_required === true,
    source_retry_acknowledgment_received: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received === true,
    source_retry_acknowledgment_validated: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated === true,
    source_retry_acknowledgment_pending: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending === true,
    source_retry_request_issued: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_issued === true,
    source_retry_request_pending_acknowledgment: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment === true,
    source_human_remediation_action_requested: source.readiness_state.human_remediation_action_requested === true,
    source_human_remediation_action_acknowledged: source.readiness_state.human_remediation_action_acknowledged === true,
    source_human_remediation_action_completed: source.readiness_state.human_remediation_action_completed === true,
    source_human_action_completed: source.readiness_state.human_action_completed === true,
    ai_human_action_completion_remediation_acknowledgment_retry_completion_gate_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryCompletionGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_hash_valid: validHash(source),
    source_retry_acknowledgment_defined: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_defined === true,
    source_retry_acknowledgment_ready: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ready === true,
    source_retry_acknowledgment_evaluated: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_evaluated === true,
    source_retry_acknowledgment_received: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received === true,
    source_retry_acknowledgment_validated: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated === true,
    source_retry_acknowledgment_pending: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending === true,
    retry_completion_gate_defined: payload.human_action_completion_remediation_acknowledgment_retry_completion_gate_defined,
    retry_completion_gate_ready: payload.human_action_completion_remediation_acknowledgment_retry_completion_gate_ready,
    retry_completion_gate_evaluated: payload.human_action_completion_remediation_acknowledgment_retry_completion_gate_evaluated,
    retry_completion_gate_required: payload.human_action_completion_remediation_acknowledgment_retry_completion_gate_required,
    retry_completion_gate_passed: payload.human_action_completion_remediation_acknowledgment_retry_completion_gate_passed,
    retry_completion_gate_blocked: payload.human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked,
    retry_completion_gate_blocked_pending_acknowledgment: payload.human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment,
    human_remediation_action_requested: payload.human_remediation_action_requested,
    human_remediation_action_completed: payload.human_remediation_action_completed,
    human_action_completed: payload.human_action_completed,
    operator_input_bundle_submitted: payload.operator_input_bundle_submitted,
    operator_inputs_verified: payload.operator_inputs_verified,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_human_action_completion_remediation_acknowledgment_retry_completion_gate_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-125-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-COMPLETION-GATE-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_COMPLETION_GATE',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-COMPLETION-GATE-2027-PROG-125',
    issue_id: 'PROG-125',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-COMPLETION-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ref: SOURCE_REF,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_revision_hash: source.revision_hash,
    source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_revision_hash_valid: validHash(source),

    level1_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_status: STATUS,

    inherited_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment: {
      human_action_completion_remediation_acknowledgment_retry_acknowledgment_status: source.level1_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_status,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ready: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_ready,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending: source.readiness_state.public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending,
      human_remediation_action_requested: source.readiness_state.human_remediation_action_requested,
      human_remediation_action_acknowledged: source.readiness_state.human_remediation_action_acknowledged,
      human_remediation_action_completed: source.readiness_state.human_remediation_action_completed,
      human_action_completed: source.readiness_state.human_action_completed,
      operator_input_bundle_submission_request_issued: source.readiness_state.operator_input_bundle_submission_request_issued,
      operator_input_bundle_submitted: source.readiness_state.operator_input_bundle_submitted,
      operator_inputs_collected: source.readiness_state.operator_inputs_collected,
      operator_inputs_submitted: source.readiness_state.operator_inputs_submitted,
      operator_inputs_verified: source.readiness_state.operator_inputs_verified,
      public_surface_observed: source.readiness_state.public_surface_observed,
      public_surface_observation_ready: source.readiness_state.public_surface_observation_ready,
      public_surface_ready: source.readiness_state.public_surface_ready,
      publication_authorized: source.readiness_state.publication_authorized,
      publication_authorization_scope: source.readiness_state.publication_authorization_scope,
      external_customer_ready: source.readiness_state.external_customer_ready,
      banking_pack_ready: source.readiness_state.banking_pack_ready,
      level1_launch_ready: source.readiness_state.level1_launch_ready,
      production_ready: source.readiness_state.production_ready
    },

    public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate: {
      ...payload,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_payload_digest: sha256Digest(payload),
      human_action_completion_remediation_acknowledgment_retry_completion_gate_checklist: checklist,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_defined: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_ready: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_evaluated: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_required: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_blocked: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_blocked_pending_acknowledgment: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_not_passed: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_not_completion_allowed: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_not_human_remediation_completed: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_is_not_human_action_completed: true,
      human_action_completion_remediation_acknowledgment_retry_completion_gate_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_COMPLETION_GATE_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_ACKNOWLEDGMENT_HASH_INVALID',
      'SOURCE_RETRY_ACKNOWLEDGMENT_NOT_RECEIVED',
      'SOURCE_RETRY_ACKNOWLEDGMENT_NOT_VALIDATED',
      'RETRY_COMPLETION_GATE_BLOCKED',
      'HUMAN_REMEDIATION_ACTION_NOT_COMPLETED',
      'HUMAN_ACTION_NOT_COMPLETED',
      'OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_NOT_ISSUED',
      'OPERATOR_INPUT_BUNDLE_NOT_SUBMITTED',
      'OPERATOR_INPUTS_NOT_COLLECTED',
      'OPERATOR_INPUTS_NOT_SUBMITTED',
      'OPERATOR_INPUTS_NOT_VERIFIED',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_COMPLETION_GATE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_defined: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_ready: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_evaluated: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_required: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_passed: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_completion_gate_blocked_pending_acknowledgment: true,
      source_public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_bound: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_received: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_validated: false,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_acknowledgment_pending: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_issued: true,
      public_surface_observation_human_action_completion_remediation_acknowledgment_retry_request_pending_acknowledgment: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      human_remediation_action_required: true,
      human_remediation_action_requested: true,
      human_remediation_action_acknowledged: false,
      human_remediation_action_completed: false,
      human_action_completed: false,
      human_action_completion_gate_passed: false,
      human_action_completion_allowed: false,
      human_action_completion_ready: false,
      human_action_completion_performed: false,
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

    next_required_program: 'PROG-126-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT-RETRY-ESCALATION-REQUEST',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      retry_acknowledgment_received: false,
      retry_acknowledgment_validated: false,
      retry_completion_gate_passed: false,
      human_remediation_acknowledgment_received: false,
      human_remediation_acknowledgment_validated: false,
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

function writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryCompletionGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryCompletionGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-125-level1-public-surface-observation-human-action-completion-remediation-acknowledgment-retry-completion-gate.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryCompletionGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_125_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_ACKNOWLEDGMENT_RETRY_COMPLETION_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  retryCompletionGateCriteria,
  buildRetryCompletionGateItems,
  buildObservationHumanActionCompletionRemediationAcknowledgmentRetryCompletionGatePayload: buildPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryCompletionGate,
  writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationAcknowledgmentRetryCompletionGate
};
