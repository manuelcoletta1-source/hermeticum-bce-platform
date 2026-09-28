'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_REQUEST_ISSUED_PENDING_HUMAN_REMEDIATION';
const SOURCE_REF = 'docs/launch/level1/prog-119-level1-public-surface-observation-operator-input-bundle-submission-request.json';

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

function requiredRemediationActionFields() {
  return [
    'human_operator_ref',
    'remediation_acknowledged_at',
    'remediation_channel',
    'remediation_acknowledgment_statement',
    'human_action_completion_statement',
    'human_action_completion_evidence_ref',
    'human_action_completion_signature_ref'
  ];
}

function requiredRemediationPrerequisites() {
  return [
    'source_bundle_submission_request_blocked',
    'source_bundle_submission_request_blocked_pending_human_action_completion',
    'human_action_acknowledgment_received',
    'human_action_acknowledgment_validated',
    'human_action_acknowledged',
    'human_action_completed',
    'human_action_completion_gate_passed'
  ];
}

function buildRemediationRequestItems(source) {
  const sourceRequest = source.public_surface_observation_operator_input_bundle_submission_request;

  return sourceRequest.operator_input_bundle_submission_request_items.map((item) => ({
    human_action_completion_remediation_request_item_id: item.operator_input_bundle_submission_request_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST::',
      'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST::'
    ),
    operator_input_bundle_submission_request_item_id: item.operator_input_bundle_submission_request_item_id,
    human_action_completion_gate_item_id: item.human_action_completion_gate_item_id,
    human_action_acknowledgment_item_id: item.human_action_acknowledgment_item_id,
    human_action_request_item_id: item.human_action_request_item_id,
    operator_input_collection_retry_gate_item_id: item.operator_input_collection_retry_gate_item_id,
    operator_input_collection_execution_item_id: item.operator_input_collection_execution_item_id,
    operator_input_collection_item_id: item.operator_input_collection_item_id,
    operator_input_submission_remediation_execution_item_id: item.operator_input_submission_remediation_execution_item_id,
    operator_input_submission_remediation_item_id: item.operator_input_submission_remediation_item_id,
    operator_input_submission_verification_item_id: item.operator_input_submission_verification_item_id,
    operator_input_submission_item_id: item.operator_input_submission_item_id,
    execution_item_id: item.execution_item_id,
    remediation_item_id: item.remediation_item_id,
    retry_target_id: item.retry_target_id,
    verification_item_id: item.verification_item_id,
    source_collection_item_id: item.source_collection_item_id,
    input_target_id: item.input_target_id,
    observation_target_id: item.observation_target_id,
    surface_type: item.surface_type,
    source_operator_input_bundle_submission_request_ref: SOURCE_REF,

    remediation_request_status: 'ISSUED_PENDING_HUMAN_REMEDIATION',
    remediation_request_result: 'HUMAN_ACTION_COMPLETION_REMEDIATION_REQUIRED',
    source_bundle_submission_request_status: item.bundle_submission_request_status,
    source_bundle_submission_request_result: item.bundle_submission_request_result,
    source_bundle_submission_request_ready: item.bundle_submission_request_ready,
    source_bundle_submission_request_blocked: item.bundle_submission_request_blocked,
    source_bundle_submission_request_blocked_pending_human_action_completion: item.bundle_submission_request_blocked_pending_human_action_completion,
    source_bundle_submission_request_issued: item.bundle_submission_request_issued,
    source_operator_input_bundle_submission_allowed: item.operator_input_bundle_submission_allowed,
    source_operator_input_bundle_submitted: item.operator_input_bundle_submitted,

    remediation_request_required: true,
    remediation_request_defined: true,
    remediation_request_ready: true,
    remediation_request_evaluated: true,
    remediation_request_issued: true,
    remediation_request_pending_human_remediation: true,
    human_remediation_action_required: true,
    human_remediation_action_requested: true,
    human_remediation_action_acknowledgment_required: true,
    human_remediation_action_acknowledgment_received: false,
    human_remediation_action_acknowledgment_validated: false,
    human_remediation_action_completed: false,

    required_remediation_action_fields: requiredRemediationActionFields(),
    missing_remediation_action_fields: requiredRemediationActionFields(),
    required_remediation_prerequisites: requiredRemediationPrerequisites(),
    missing_remediation_prerequisites: requiredRemediationPrerequisites(),

    human_operator_ref: null,
    remediation_acknowledged_at: null,
    remediation_channel: null,
    remediation_acknowledgment_statement: null,
    human_action_completion_statement: null,
    human_action_completion_evidence_ref: null,
    human_action_completion_signature_ref: null,

    human_action_acknowledgment_received: false,
    human_action_acknowledgment_validated: false,
    human_action_acknowledged: false,
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
    ready_for_operator_input_submission: false,
    ready_for_submission_verification_rerun: false,
    ready_for_input_collection_execution: false,
    ready_for_input_verification: false,
    ready_for_retry_gate_rerun: false,
    remediation_request_comment: 'Human action completion remediation request is issued because the bundle submission request is blocked pending human action completion.'
  }));
}

function buildPayload(source) {
  const sourceRequest = source.public_surface_observation_operator_input_bundle_submission_request;
  const items = buildRemediationRequestItems(source);

  return {
    human_action_completion_remediation_request_id: 'PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST::HBCE-L1-DECISION-PROOF-0001',
    human_action_completion_remediation_request_key: 'hbce.level1.public_surface.observation_human_action_completion_remediation_request.controlled_information.0001',
    source_public_surface_observation_operator_input_bundle_submission_request_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_bundle_submission_request_digest: sourceRequest.operator_input_bundle_submission_request_payload_digest,
    human_action_completion_remediation_request_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    human_action_completion_remediation_request_status: 'ISSUED_PENDING_HUMAN_REMEDIATION',
    human_action_completion_remediation_request_result: 'HUMAN_ACTION_COMPLETION_REMEDIATION_REQUIRED',
    human_action_completion_remediation_request_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_REQUEST',
    evaluated_at: '2027-01-19T18:40:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_operator_input_bundle_submission_request_status: sourceRequest.operator_input_bundle_submission_request_status,
    imported_operator_input_bundle_submission_request_result: sourceRequest.operator_input_bundle_submission_request_result,
    imported_operator_input_bundle_submission_request_defined: sourceRequest.operator_input_bundle_submission_request_defined,
    imported_operator_input_bundle_submission_request_evaluated: sourceRequest.operator_input_bundle_submission_request_evaluated,
    imported_operator_input_bundle_submission_request_required: sourceRequest.operator_input_bundle_submission_request_required,
    imported_operator_input_bundle_submission_request_ready: sourceRequest.operator_input_bundle_submission_request_ready,
    imported_operator_input_bundle_submission_request_blocked: sourceRequest.operator_input_bundle_submission_request_blocked,
    imported_operator_input_bundle_submission_request_blocked_pending_human_action_completion: sourceRequest.operator_input_bundle_submission_request_blocked_pending_human_action_completion,
    imported_operator_input_bundle_submission_request_issued: sourceRequest.operator_input_bundle_submission_request_issued,
    imported_operator_input_bundle_submission_allowed: sourceRequest.operator_input_bundle_submission_allowed,
    imported_operator_input_bundle_submitted: sourceRequest.operator_input_bundle_submitted,
    imported_human_action_acknowledgment_received: sourceRequest.human_action_acknowledgment_received,
    imported_human_action_acknowledgment_validated: sourceRequest.human_action_acknowledgment_validated,
    imported_human_action_acknowledged: sourceRequest.human_action_acknowledged,
    imported_human_action_completed: sourceRequest.human_action_completed,
    imported_human_action_completion_gate_passed: sourceRequest.human_action_completion_gate_passed,
    imported_human_action_completion_allowed: sourceRequest.human_action_completion_allowed,
    imported_human_action_completion_ready: sourceRequest.human_action_completion_ready,
    imported_human_action_completion_performed: sourceRequest.human_action_completion_performed,
    imported_operator_inputs_collected: sourceRequest.operator_inputs_collected,
    imported_operator_inputs_submitted: sourceRequest.operator_inputs_submitted,
    imported_operator_inputs_verified: sourceRequest.operator_inputs_verified,
    imported_public_surface_observed: sourceRequest.public_surface_observed,
    imported_public_surface_observation_ready: sourceRequest.public_surface_observation_ready,

    human_action_completion_remediation_request_items: items,
    human_action_completion_remediation_request_item_count: items.length,
    all_bundle_submission_request_items_have_remediation_request_items: sourceRequest.operator_input_bundle_submission_request_items.every((item) =>
      items.some((requestItem) => requestItem.operator_input_bundle_submission_request_item_id === item.operator_input_bundle_submission_request_item_id)
    ),
    all_remediation_request_items_required: items.every((item) => item.remediation_request_required === true),
    all_remediation_request_items_defined: items.every((item) => item.remediation_request_defined === true),
    all_remediation_request_items_ready: items.every((item) => item.remediation_request_ready === true),
    all_remediation_request_items_evaluated: items.every((item) => item.remediation_request_evaluated === true),
    all_remediation_request_items_issued: items.every((item) => item.remediation_request_issued === true),
    all_remediation_request_items_pending_human_remediation: items.every((item) => item.remediation_request_pending_human_remediation === true),
    all_remediation_request_items_human_action_required: items.every((item) => item.human_remediation_action_required === true),
    all_remediation_request_items_human_action_requested: items.every((item) => item.human_remediation_action_requested === true),
    all_remediation_request_items_acknowledgment_not_received: items.every((item) => item.human_remediation_action_acknowledgment_received === false),
    all_remediation_request_items_acknowledgment_not_validated: items.every((item) => item.human_remediation_action_acknowledgment_validated === false),
    all_remediation_request_items_action_not_completed: items.every((item) => item.human_remediation_action_completed === false),
    all_remediation_request_items_source_bundle_request_blocked: items.every((item) => item.source_bundle_submission_request_blocked === true),
    all_remediation_request_items_source_bundle_request_not_ready: items.every((item) => item.source_bundle_submission_request_ready === false),
    all_remediation_request_items_source_bundle_request_not_issued: items.every((item) => item.source_bundle_submission_request_issued === false),
    all_remediation_request_items_source_bundle_not_submitted: items.every((item) => item.source_operator_input_bundle_submitted === false),
    all_remediation_request_items_human_action_not_completed: items.every((item) => item.human_action_completed === false),
    all_remediation_request_items_completion_gate_not_passed: items.every((item) => item.human_action_completion_gate_passed === false),
    all_remediation_request_items_operator_bundle_not_submitted: items.every((item) => item.operator_input_bundle_submitted === false),
    all_remediation_request_items_operator_inputs_not_collected: items.every((item) => item.operator_inputs_collected === false),
    all_remediation_request_items_operator_inputs_not_submitted: items.every((item) => item.operator_inputs_submitted === false),
    all_remediation_request_items_operator_inputs_not_verified: items.every((item) => item.operator_inputs_verified === false),
    all_remediation_request_items_public_surface_not_observed: items.every((item) => item.public_surface_observed === false),
    all_remediation_request_items_public_surface_observation_not_ready: items.every((item) => item.public_surface_observation_ready === false),
    all_remediation_request_items_not_ready_for_operator_input_submission: items.every((item) => item.ready_for_operator_input_submission === false),
    all_remediation_request_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_remediation_request_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),

    human_action_completion_remediation_request_defined: true,
    human_action_completion_remediation_request_evaluated: true,
    human_action_completion_remediation_request_required: true,
    human_action_completion_remediation_request_ready: true,
    human_action_completion_remediation_request_issued: true,
    human_action_completion_remediation_request_pending_human_remediation: true,
    human_remediation_action_required: true,
    human_remediation_action_requested: true,
    human_remediation_action_acknowledgment_required: true,
    human_remediation_action_acknowledgment_received: false,
    human_remediation_action_acknowledgment_validated: false,
    human_remediation_action_completed: false,

    operator_input_bundle_submission_request_ready: false,
    operator_input_bundle_submission_request_blocked: true,
    operator_input_bundle_submission_request_issued: false,
    operator_input_bundle_submission_allowed: false,
    operator_input_bundle_required: true,
    operator_input_bundle_submitted: false,
    human_action_acknowledgment_received: false,
    human_action_acknowledgment_validated: false,
    human_action_acknowledged: false,
    human_action_completed: false,
    human_action_completion_gate_passed: false,
    human_action_completion_allowed: false,
    human_action_completion_ready: false,
    human_action_completion_performed: false,
    operator_input_collection_retry_allowed: false,
    operator_input_collection_retry_ready: false,
    operator_input_collection_retry_performed: false,
    operator_input_collection_execution_completed: false,
    operator_input_submission_ready: false,
    operator_input_submission_completed: false,
    operator_inputs_collected: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    submission_verification_rerun_ready: false,
    submission_verification_rerun_completed: false,
    submission_verification_rerun_passed: false,
    remediation_execution_update_ready: false,
    input_collection_execution_ready: false,
    input_verification_ready: false,
    input_verification_passed: false,
    retry_gate_rerun_ready: false,
    retry_gate_rerun_executed: false,
    retry_gate_rerun_passed: false,
    public_surface_observation_remediation_completed: false,
    observation_inputs_collected: false,
    observation_inputs_verified: false,
    observation_retry_allowed: false,
    observation_retry_performed: false,
    observation_retry_ready: false,
    public_surface_observed: false,
    public_surface_observation_ready: false,
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,

    human_action_completion_remediation_request_controls: [
      'require_source_operator_input_bundle_submission_request_hash_valid',
      'require_source_operator_input_bundle_submission_request_blocked',
      'require_source_operator_input_bundle_submission_request_blocked_pending_human_action_completion',
      'issue_human_action_completion_remediation_request_when_bundle_submission_is_blocked',
      'require_human_operator_ref_before_remediation_acknowledgment',
      'require_remediation_acknowledged_at_before_remediation_acknowledgment',
      'require_remediation_channel_before_remediation_acknowledgment',
      'require_human_action_completion_statement_before_human_action_completion',
      'require_human_action_completion_evidence_ref_before_human_action_completion',
      'require_human_action_completion_signature_ref_before_human_action_completion',
      'do_not_mark_human_action_completed_from_remediation_request_alone',
      'do_not_issue_operator_input_bundle_submission_from_remediation_request_alone',
      'do_not_mark_operator_input_bundle_submitted_without_bundle_submission',
      'do_not_mark_operator_inputs_collected_without_submitted_bundle',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_infer_public_observation_from_remediation_request',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_until_human_remediation_action_is_completed_and_verified'
    ],

    human_action_completion_remediation_request_boundary: {
      controlled_information_surface_only: true,
      remediation_request_only: true,
      remediation_request_issued_pending_human_remediation: true,
      no_human_remediation_action_acknowledged: true,
      no_human_remediation_action_validated: true,
      no_human_remediation_action_completed: true,
      no_human_action_completed: true,
      no_operator_input_bundle_submission_request_issued: true,
      no_operator_input_bundle_submitted: true,
      no_operator_inputs_recorded: true,
      no_operator_inputs_collected: true,
      no_operator_inputs_submitted: true,
      no_operator_inputs_verified: true,
      no_collection_retry_performed: true,
      no_submission_verification_rerun_recorded: true,
      no_input_collection_execution_recorded: true,
      no_input_verification_recorded: true,
      no_retry_gate_rerun_recorded: true,
      no_public_observation_recorded: true,
      source_operator_input_bundle_submission_request_required: true,
      source_human_action_completion_gate_required: true,
      source_human_action_acknowledgment_required: true,
      source_human_action_request_required: true,
      no_customer_data: true,
      no_live_system_control: true,
      no_production_integration: true,
      no_legal_validity_claim: true,
      no_public_accreditation_claim: true,
      no_procurement_eligibility_claim: true,
      no_external_effect_claim: true,
      no_business_success_claim: true,
      no_ai_authority_claim: true,
      no_pricing_commitment: true,
      no_sla_commitment: true,
      no_security_certification_claim: true,
      no_customer_logo_without_authorization: true
    },

    source_bundle_submission_request_defined: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_defined === true,
    source_bundle_submission_request_evaluated: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_evaluated === true,
    source_bundle_submission_request_required: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_required === true,
    source_bundle_submission_request_ready: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_ready === true,
    source_bundle_submission_request_blocked: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_blocked === true,
    source_bundle_submission_request_blocked_pending_human_action_completion: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_blocked_pending_human_action_completion === true,
    source_bundle_submission_request_issued: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_issued === true,
    source_human_action_completed: source.readiness_state.human_action_completed === true,
    source_human_action_completion_allowed: source.readiness_state.human_action_completion_allowed === true,
    source_human_action_completion_ready: source.readiness_state.human_action_completion_ready === true,
    source_operator_input_bundle_submitted: source.readiness_state.operator_input_bundle_submitted === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_human_action_completion_remediation_request_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationRequest(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_bundle_submission_request_hash_valid: validHash(source),
    source_bundle_submission_request_defined: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_defined === true,
    source_bundle_submission_request_evaluated: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_evaluated === true,
    source_bundle_submission_request_required: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_required === true,
    source_bundle_submission_request_ready: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_ready === true,
    source_bundle_submission_request_blocked: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_blocked === true,
    source_bundle_submission_request_blocked_pending_human_action_completion: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_blocked_pending_human_action_completion === true,
    source_bundle_submission_request_issued: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_issued === true,
    source_human_action_completed: source.readiness_state.human_action_completed === true,
    human_action_completion_remediation_request_defined: payload.human_action_completion_remediation_request_defined,
    human_action_completion_remediation_request_evaluated: payload.human_action_completion_remediation_request_evaluated,
    human_action_completion_remediation_request_required: payload.human_action_completion_remediation_request_required,
    human_action_completion_remediation_request_ready: payload.human_action_completion_remediation_request_ready,
    human_action_completion_remediation_request_issued: payload.human_action_completion_remediation_request_issued,
    human_action_completion_remediation_request_pending_human_remediation: payload.human_action_completion_remediation_request_pending_human_remediation,
    human_remediation_action_requested: payload.human_remediation_action_requested,
    human_remediation_action_completed: payload.human_remediation_action_completed,
    operator_input_bundle_submitted: payload.operator_input_bundle_submitted,
    operator_inputs_collected: payload.operator_inputs_collected,
    operator_inputs_submitted: payload.operator_inputs_submitted,
    operator_inputs_verified: payload.operator_inputs_verified,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_human_action_completion_remediation_request_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-120-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_REQUEST',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST-2027-PROG-120',
    issue_id: 'PROG-120',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_bundle_submission_request_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_bundle_submission_request_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_bundle_submission_request_revision_hash_valid: validHash(source),

    level1_public_surface_observation_human_action_completion_remediation_request_status: STATUS,

    inherited_public_surface_observation_operator_input_bundle_submission_request: {
      operator_input_bundle_submission_request_status: source.level1_public_surface_observation_operator_input_bundle_submission_request_status,
      public_surface_observation_operator_input_bundle_submission_request_defined: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_defined,
      public_surface_observation_operator_input_bundle_submission_request_evaluated: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_evaluated,
      public_surface_observation_operator_input_bundle_submission_request_required: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_required,
      public_surface_observation_operator_input_bundle_submission_request_ready: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_ready,
      public_surface_observation_operator_input_bundle_submission_request_blocked: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_blocked,
      public_surface_observation_operator_input_bundle_submission_request_blocked_pending_human_action_completion: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_blocked_pending_human_action_completion,
      public_surface_observation_operator_input_bundle_submission_request_issued: source.readiness_state.public_surface_observation_operator_input_bundle_submission_request_issued,
      human_action_completed: source.readiness_state.human_action_completed,
      human_action_completion_allowed: source.readiness_state.human_action_completion_allowed,
      human_action_completion_ready: source.readiness_state.human_action_completion_ready,
      operator_input_bundle_submission_allowed: source.readiness_state.operator_input_bundle_submission_allowed,
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

    public_surface_observation_human_action_completion_remediation_request: {
      ...payload,
      human_action_completion_remediation_request_payload_digest: sha256Digest(payload),
      human_action_completion_remediation_request_checklist: checklist,
      human_action_completion_remediation_request_is_defined: true,
      human_action_completion_remediation_request_is_evaluated: true,
      human_action_completion_remediation_request_is_required: true,
      human_action_completion_remediation_request_is_ready: true,
      human_action_completion_remediation_request_is_issued: true,
      human_action_completion_remediation_request_is_pending_human_remediation: true,
      human_action_completion_remediation_request_is_not_human_remediation_completed: true,
      human_action_completion_remediation_request_is_not_human_action_completed: true,
      human_action_completion_remediation_request_is_not_bundle_submission_request_issued: true,
      human_action_completion_remediation_request_is_not_bundle_submitted: true,
      human_action_completion_remediation_request_is_not_operator_inputs_collected: true,
      human_action_completion_remediation_request_is_not_operator_inputs_submitted: true,
      human_action_completion_remediation_request_is_not_operator_inputs_verified: true,
      human_action_completion_remediation_request_is_not_public_observation_ready: true,
      human_action_completion_remediation_request_is_not_external_customer_readiness: true,
      human_action_completion_remediation_request_is_not_banking_pack_readiness: true,
      human_action_completion_remediation_request_is_not_launch_readiness: true,
      human_action_completion_remediation_request_is_not_production_readiness: true,
      human_action_completion_remediation_request_is_not_legal_validity: true,
      human_action_completion_remediation_request_is_not_security_certification: true,
      human_action_completion_remediation_request_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_REQUEST_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_HASH_INVALID',
      'OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_NOT_BLOCKED',
      'HUMAN_ACTION_COMPLETION_REMEDIATION_ACTION_MISSING',
      'HUMAN_REMEDIATION_ACTION_ACKNOWLEDGMENT_NOT_RECEIVED',
      'HUMAN_REMEDIATION_ACTION_ACKNOWLEDGMENT_NOT_VALIDATED',
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
      'AI_HUMAN_ACTION_COMPLETION_REMEDIATION_REQUEST_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_human_action_completion_remediation_request_defined: true,
      public_surface_observation_human_action_completion_remediation_request_evaluated: true,
      public_surface_observation_human_action_completion_remediation_request_required: true,
      public_surface_observation_human_action_completion_remediation_request_ready: true,
      public_surface_observation_human_action_completion_remediation_request_issued: true,
      public_surface_observation_human_action_completion_remediation_request_pending_human_remediation: true,
      source_public_surface_observation_operator_input_bundle_submission_request_bound: true,
      public_surface_observation_operator_input_bundle_submission_request_ready: false,
      public_surface_observation_operator_input_bundle_submission_request_blocked: true,
      public_surface_observation_operator_input_bundle_submission_request_blocked_pending_human_action_completion: true,
      public_surface_observation_operator_input_bundle_submission_request_issued: false,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      human_remediation_action_required: true,
      human_remediation_action_requested: true,
      human_remediation_action_acknowledgment_required: true,
      human_remediation_action_acknowledgment_received: false,
      human_remediation_action_acknowledgment_validated: false,
      human_remediation_action_completed: false,
      human_action_acknowledgment_received: false,
      human_action_acknowledgment_validated: false,
      human_action_acknowledged: false,
      human_action_completed: false,
      human_action_completion_gate_passed: false,
      human_action_completion_allowed: false,
      human_action_completion_ready: false,
      human_action_completion_performed: false,
      operator_input_bundle_required: true,
      operator_input_bundle_submission_allowed: false,
      operator_input_bundle_submitted: false,
      operator_input_collection_retry_allowed: false,
      operator_input_collection_retry_ready: false,
      operator_input_collection_retry_performed: false,
      operator_input_collection_execution_completed: false,
      operator_input_submission_ready: false,
      operator_input_submission_completed: false,
      operator_inputs_collected: false,
      operator_inputs_submitted: false,
      operator_inputs_verified: false,
      submission_verification_rerun_ready: false,
      submission_verification_rerun_completed: false,
      submission_verification_rerun_passed: false,
      remediation_execution_update_ready: false,
      input_collection_execution_ready: false,
      input_verification_ready: false,
      input_verification_passed: false,
      retry_gate_rerun_ready: false,
      retry_gate_rerun_executed: false,
      retry_gate_rerun_passed: false,
      public_surface_observation_remediation_completed: false,
      observation_inputs_collected: false,
      observation_inputs_verified: false,
      observation_retry_allowed: false,
      observation_retry_performed: false,
      observation_retry_ready: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-121-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-ACKNOWLEDGMENT',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
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

function writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationRequest(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationRequest({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-120-level1-public-surface-observation-human-action-completion-remediation-request.json';
  const doc = writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationRequest(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_120_LEVEL1_PUBLIC_SURFACE_OBSERVATION_HUMAN_ACTION_COMPLETION_REMEDIATION_REQUEST_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  requiredRemediationActionFields,
  requiredRemediationPrerequisites,
  buildRemediationRequestItems,
  buildObservationHumanActionCompletionRemediationRequestPayload: buildPayload,
  buildLevel1PublicSurfaceObservationHumanActionCompletionRemediationRequest,
  writeLevel1PublicSurfaceObservationHumanActionCompletionRemediationRequest
};
