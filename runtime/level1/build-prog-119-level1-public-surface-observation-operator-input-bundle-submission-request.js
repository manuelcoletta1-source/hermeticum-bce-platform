'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_BLOCKED_PENDING_HUMAN_ACTION_COMPLETION';
const SOURCE_REF = 'docs/launch/level1/prog-118-level1-public-surface-observation-operator-input-collection-human-action-completion-gate.json';

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

function requiredBundleFields() {
  return [
    'submitter_ref',
    'submitted_at',
    'submission_channel',
    'public_url',
    'observer_ref',
    'observed_content_digest',
    'scope_match_result',
    'non_claims_presence_result',
    'evidence_reference_presence_result',
    'customer_data_absence_declaration',
    'forbidden_claims_absence_declaration'
  ];
}

function requiredSubmissionPrerequisites() {
  return [
    'human_action_acknowledgment_received',
    'human_action_acknowledgment_validated',
    'human_action_acknowledged',
    'human_action_completed',
    'human_action_completion_gate_passed',
    'human_action_completion_allowed',
    'human_action_completion_ready'
  ];
}

function buildBundleSubmissionRequestItems(source) {
  const gate = source.public_surface_observation_operator_input_collection_human_action_completion_gate;

  return gate.human_action_completion_gate_items.map((item) => ({
    operator_input_bundle_submission_request_item_id: item.human_action_completion_gate_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-COMPLETION-GATE::',
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST::'
    ),
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
    source_human_action_completion_gate_ref: SOURCE_REF,

    bundle_submission_request_status: 'BLOCKED_PENDING_HUMAN_ACTION_COMPLETION',
    bundle_submission_request_result: 'SUBMISSION_REQUEST_NOT_READY',
    source_completion_gate_status: item.completion_gate_status,
    source_completion_gate_result: item.completion_gate_result,
    source_completion_gate_passed: item.completion_gate_passed,
    source_completion_gate_blocked: item.completion_gate_blocked,
    source_completion_gate_blocked_pending_acknowledgment: item.completion_gate_blocked_pending_acknowledgment,
    source_human_action_completion_allowed: item.human_action_completion_allowed,
    source_human_action_completion_ready: item.human_action_completion_ready,
    source_human_action_completion_performed: item.human_action_completion_performed,
    source_human_action_completed: item.human_action_completed,
    source_acknowledgment_received: item.acknowledgment_received,
    source_acknowledgment_validated: item.acknowledgment_validated,

    bundle_submission_request_required: true,
    bundle_submission_request_defined: true,
    bundle_submission_request_ready: false,
    bundle_submission_request_blocked: true,
    bundle_submission_request_blocked_pending_human_action_completion: true,
    bundle_submission_request_issued: false,
    operator_input_bundle_submission_allowed: false,
    operator_input_bundle_submitted: false,
    required_submission_prerequisites: requiredSubmissionPrerequisites(),
    missing_submission_prerequisites: requiredSubmissionPrerequisites(),
    required_bundle_fields: requiredBundleFields(),
    missing_bundle_fields: requiredBundleFields(),

    submitter_ref: null,
    submitted_at: null,
    submission_channel: null,
    public_url: null,
    observer_ref: null,
    observed_content_digest: null,
    scope_match_result: null,
    non_claims_presence_result: null,
    evidence_reference_presence_result: null,
    customer_data_absence_declaration: null,
    forbidden_claims_absence_declaration: null,

    human_action_acknowledgment_received: false,
    human_action_acknowledgment_validated: false,
    human_action_acknowledged: false,
    human_action_completed: false,
    human_action_completion_gate_passed: false,
    human_action_completion_allowed: false,
    human_action_completion_ready: false,
    human_action_completion_performed: false,

    operator_inputs_collected: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    ready_for_operator_input_submission: false,
    ready_for_submission_verification_rerun: false,
    ready_for_input_collection_execution: false,
    ready_for_input_verification: false,
    ready_for_retry_gate_rerun: false,
    bundle_submission_request_comment: 'Operator input bundle submission request is blocked because human action completion did not pass.'
  }));
}

function buildPayload(source) {
  const gate = source.public_surface_observation_operator_input_collection_human_action_completion_gate;
  const items = buildBundleSubmissionRequestItems(source);

  return {
    operator_input_bundle_submission_request_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST::HBCE-L1-DECISION-PROOF-0001',
    operator_input_bundle_submission_request_key: 'hbce.level1.public_surface.observation_operator_input_bundle_submission_request.controlled_information.0001',
    source_public_surface_observation_operator_input_collection_human_action_completion_gate_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_collection_human_action_completion_gate_digest: gate.human_action_completion_gate_payload_digest,
    operator_input_bundle_submission_request_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    operator_input_bundle_submission_request_status: 'BLOCKED_PENDING_HUMAN_ACTION_COMPLETION',
    operator_input_bundle_submission_request_result: 'SUBMISSION_REQUEST_NOT_READY',
    operator_input_bundle_submission_request_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST',
    evaluated_at: '2027-01-19T18:35:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_human_action_completion_gate_status: gate.human_action_completion_gate_status,
    imported_human_action_completion_gate_result: gate.human_action_completion_gate_result,
    imported_human_action_completion_gate_defined: gate.human_action_completion_gate_defined,
    imported_human_action_completion_gate_ready: gate.human_action_completion_gate_ready,
    imported_human_action_completion_gate_evaluated: gate.human_action_completion_gate_evaluated,
    imported_human_action_completion_gate_passed: gate.human_action_completion_gate_passed,
    imported_human_action_completion_gate_blocked: gate.human_action_completion_gate_blocked,
    imported_human_action_completion_gate_blocked_pending_acknowledgment: gate.human_action_completion_gate_blocked_pending_acknowledgment,
    imported_human_action_acknowledgment_received: gate.human_action_acknowledgment_received,
    imported_human_action_acknowledgment_validated: gate.human_action_acknowledgment_validated,
    imported_human_action_acknowledged: gate.human_action_acknowledged,
    imported_human_action_completed: gate.human_action_completed,
    imported_human_action_completion_allowed: gate.human_action_completion_allowed,
    imported_human_action_completion_ready: gate.human_action_completion_ready,
    imported_human_action_completion_performed: gate.human_action_completion_performed,
    imported_operator_input_bundle_required: gate.operator_input_bundle_required,
    imported_operator_input_bundle_submitted: gate.operator_input_bundle_submitted,
    imported_operator_inputs_collected: gate.operator_inputs_collected,
    imported_operator_inputs_submitted: gate.operator_inputs_submitted,
    imported_operator_inputs_verified: gate.operator_inputs_verified,
    imported_public_surface_observed: gate.public_surface_observed,
    imported_public_surface_observation_ready: gate.public_surface_observation_ready,

    operator_input_bundle_submission_request_items: items,
    operator_input_bundle_submission_request_item_count: items.length,
    all_completion_gate_items_have_submission_request_items: gate.human_action_completion_gate_items.every((item) =>
      items.some((requestItem) => requestItem.human_action_completion_gate_item_id === item.human_action_completion_gate_item_id)
    ),
    all_submission_request_items_required: items.every((item) => item.bundle_submission_request_required === true),
    all_submission_request_items_defined: items.every((item) => item.bundle_submission_request_defined === true),
    all_submission_request_items_not_ready: items.every((item) => item.bundle_submission_request_ready === false),
    all_submission_request_items_blocked: items.every((item) => item.bundle_submission_request_blocked === true),
    all_submission_request_items_blocked_pending_human_action_completion: items.every((item) => item.bundle_submission_request_blocked_pending_human_action_completion === true),
    all_submission_request_items_not_issued: items.every((item) => item.bundle_submission_request_issued === false),
    all_submission_request_items_submission_not_allowed: items.every((item) => item.operator_input_bundle_submission_allowed === false),
    all_submission_request_items_bundle_not_submitted: items.every((item) => item.operator_input_bundle_submitted === false),
    all_submission_request_items_source_completion_gate_blocked: items.every((item) => item.source_completion_gate_blocked === true),
    all_submission_request_items_source_completion_gate_not_passed: items.every((item) => item.source_completion_gate_passed === false),
    all_submission_request_items_source_completion_blocked_pending_acknowledgment: items.every((item) => item.source_completion_gate_blocked_pending_acknowledgment === true),
    all_submission_request_items_source_acknowledgment_not_received: items.every((item) => item.source_acknowledgment_received === false),
    all_submission_request_items_source_acknowledgment_not_validated: items.every((item) => item.source_acknowledgment_validated === false),
    all_submission_request_items_source_human_action_not_completed: items.every((item) => item.source_human_action_completed === false),
    all_submission_request_items_human_action_not_completed: items.every((item) => item.human_action_completed === false),
    all_submission_request_items_completion_not_allowed: items.every((item) => item.human_action_completion_allowed === false),
    all_submission_request_items_completion_not_ready: items.every((item) => item.human_action_completion_ready === false),
    all_submission_request_items_operator_inputs_not_collected: items.every((item) => item.operator_inputs_collected === false),
    all_submission_request_items_operator_inputs_not_submitted: items.every((item) => item.operator_inputs_submitted === false),
    all_submission_request_items_operator_inputs_not_verified: items.every((item) => item.operator_inputs_verified === false),
    all_submission_request_items_not_ready_for_operator_input_submission: items.every((item) => item.ready_for_operator_input_submission === false),
    all_submission_request_items_not_ready_for_submission_verification_rerun: items.every((item) => item.ready_for_submission_verification_rerun === false),
    all_submission_request_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_submission_request_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),

    operator_input_bundle_submission_request_defined: true,
    operator_input_bundle_submission_request_evaluated: true,
    operator_input_bundle_submission_request_required: true,
    operator_input_bundle_submission_request_ready: false,
    operator_input_bundle_submission_request_blocked: true,
    operator_input_bundle_submission_request_blocked_pending_human_action_completion: true,
    operator_input_bundle_submission_request_issued: false,
    operator_input_bundle_submission_allowed: false,
    operator_input_bundle_required: true,
    operator_input_bundle_submitted: false,
    human_action_acknowledgment_required: true,
    human_action_acknowledgment_received: false,
    human_action_acknowledgment_validated: false,
    human_action_acknowledged: false,
    human_action_completed: false,
    human_action_completion_gate_passed: false,
    human_action_completion_gate_blocked: true,
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

    operator_input_bundle_submission_request_controls: [
      'require_source_human_action_completion_gate_hash_valid',
      'require_human_action_completion_gate_passed',
      'require_human_action_acknowledgment_received',
      'require_human_action_acknowledgment_validated',
      'require_human_action_acknowledged',
      'require_human_action_completed',
      'require_human_action_completion_allowed',
      'require_human_action_completion_ready',
      'do_not_issue_bundle_submission_request_before_human_action_completion',
      'do_not_allow_operator_input_bundle_submission_before_request_ready',
      'do_not_mark_operator_input_bundle_submitted_without_request_issue',
      'do_not_mark_operator_inputs_collected_without_submitted_bundle',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_allow_retry_without_verified_inputs',
      'do_not_infer_public_observation_from_submission_request',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_until_human_action_completion_gate_passes'
    ],

    operator_input_bundle_submission_request_boundary: {
      controlled_information_surface_only: true,
      submission_request_evaluation_only: true,
      submission_request_blocked_pending_human_action_completion: true,
      no_submission_request_issued: true,
      no_operator_input_bundle_submitted: true,
      no_operator_inputs_recorded: true,
      no_operator_inputs_collected: true,
      no_operator_inputs_submitted: true,
      no_operator_inputs_verified: true,
      no_acknowledgment_recorded: true,
      no_acknowledgment_validated: true,
      no_human_action_completed: true,
      no_collection_retry_performed: true,
      no_submission_verification_rerun_recorded: true,
      no_remediation_execution_update_recorded: true,
      no_input_collection_execution_recorded: true,
      no_input_verification_recorded: true,
      no_retry_gate_rerun_recorded: true,
      no_public_observation_recorded: true,
      source_human_action_completion_gate_required: true,
      source_human_action_acknowledgment_required: true,
      source_human_action_request_required: true,
      source_operator_input_collection_retry_gate_required: true,
      source_operator_input_collection_execution_required: true,
      source_operator_input_collection_pack_required: true,
      source_operator_input_submission_remediation_execution_required: true,
      source_operator_input_submission_remediation_required: true,
      source_operator_input_submission_verification_required: true,
      source_operator_input_submission_required: true,
      source_remediation_execution_required: true,
      source_remediation_pack_required: true,
      source_retry_gate_required: true,
      source_input_verification_required: true,
      source_input_collection_required: true,
      source_input_pack_required: true,
      source_observation_gate_required: true,
      source_observation_record_required: true,
      source_release_manifest_required: true,
      source_registry_entry_required: true,
      source_publication_snapshot_required: true,
      source_readiness_gate_required: true,
      source_evidence_index_required: true,
      source_copy_pack_required: true,
      source_content_model_required: true,
      source_scope_lock_required: true,
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

    source_human_action_completion_gate_ready: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_ready === true,
    source_human_action_completion_gate_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_evaluated === true,
    source_human_action_completion_gate_passed: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_passed === true,
    source_human_action_completion_gate_blocked: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_blocked === true,
    source_human_action_completion_gate_blocked_pending_acknowledgment: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_blocked_pending_acknowledgment === true,
    source_human_action_acknowledgment_received: source.readiness_state.human_action_acknowledgment_received === true,
    source_human_action_acknowledgment_validated: source.readiness_state.human_action_acknowledgment_validated === true,
    source_human_action_acknowledged: source.readiness_state.human_action_acknowledged === true,
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
    ai_operator_input_bundle_submission_request_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputBundleSubmissionRequest(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_collection_human_action_completion_gate_hash_valid: validHash(source),
    source_human_action_completion_gate_ready: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_ready === true,
    source_human_action_completion_gate_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_evaluated === true,
    source_human_action_completion_gate_passed: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_passed === true,
    source_human_action_completion_gate_blocked: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_blocked === true,
    source_human_action_completion_gate_blocked_pending_acknowledgment: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_blocked_pending_acknowledgment === true,
    source_human_action_acknowledgment_received: source.readiness_state.human_action_acknowledgment_received === true,
    source_human_action_acknowledgment_validated: source.readiness_state.human_action_acknowledgment_validated === true,
    source_human_action_acknowledged: source.readiness_state.human_action_acknowledged === true,
    source_human_action_completed: source.readiness_state.human_action_completed === true,
    source_human_action_completion_allowed: source.readiness_state.human_action_completion_allowed === true,
    source_human_action_completion_ready: source.readiness_state.human_action_completion_ready === true,
    source_operator_input_bundle_submitted: source.readiness_state.operator_input_bundle_submitted === true,
    operator_input_bundle_submission_request_defined: payload.operator_input_bundle_submission_request_defined,
    operator_input_bundle_submission_request_evaluated: payload.operator_input_bundle_submission_request_evaluated,
    operator_input_bundle_submission_request_required: payload.operator_input_bundle_submission_request_required,
    operator_input_bundle_submission_request_ready: payload.operator_input_bundle_submission_request_ready,
    operator_input_bundle_submission_request_blocked: payload.operator_input_bundle_submission_request_blocked,
    operator_input_bundle_submission_request_blocked_pending_human_action_completion: payload.operator_input_bundle_submission_request_blocked_pending_human_action_completion,
    operator_input_bundle_submission_request_issued: payload.operator_input_bundle_submission_request_issued,
    operator_input_bundle_submission_allowed: payload.operator_input_bundle_submission_allowed,
    operator_input_bundle_submitted: payload.operator_input_bundle_submitted,
    all_completion_gate_items_have_submission_request_items: payload.all_completion_gate_items_have_submission_request_items,
    all_submission_request_items_defined: payload.all_submission_request_items_defined,
    all_submission_request_items_not_ready: payload.all_submission_request_items_not_ready,
    all_submission_request_items_blocked_pending_human_action_completion: payload.all_submission_request_items_blocked_pending_human_action_completion,
    human_action_completed: payload.human_action_completed,
    operator_inputs_collected: payload.operator_inputs_collected,
    operator_inputs_submitted: payload.operator_inputs_submitted,
    operator_inputs_verified: payload.operator_inputs_verified,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_operator_input_bundle_submission_request_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-119-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST-2027-PROG-119',
    issue_id: 'PROG-119',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-BUNDLE-SUBMISSION-REQUEST',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_collection_human_action_completion_gate_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_collection_human_action_completion_gate_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_collection_human_action_completion_gate_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_bundle_submission_request_status: STATUS,

    inherited_public_surface_observation_operator_input_collection_human_action_completion_gate: {
      human_action_completion_gate_status: source.level1_public_surface_observation_operator_input_collection_human_action_completion_gate_status,
      public_surface_observation_operator_input_collection_human_action_completion_gate_ready: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_ready,
      public_surface_observation_operator_input_collection_human_action_completion_gate_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_evaluated,
      public_surface_observation_operator_input_collection_human_action_completion_gate_passed: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_passed,
      public_surface_observation_operator_input_collection_human_action_completion_gate_blocked: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_blocked,
      public_surface_observation_operator_input_collection_human_action_completion_gate_blocked_pending_acknowledgment: source.readiness_state.public_surface_observation_operator_input_collection_human_action_completion_gate_blocked_pending_acknowledgment,
      human_action_acknowledgment_received: source.readiness_state.human_action_acknowledgment_received,
      human_action_acknowledgment_validated: source.readiness_state.human_action_acknowledgment_validated,
      human_action_acknowledged: source.readiness_state.human_action_acknowledged,
      human_action_completed: source.readiness_state.human_action_completed,
      human_action_completion_allowed: source.readiness_state.human_action_completion_allowed,
      human_action_completion_ready: source.readiness_state.human_action_completion_ready,
      human_action_completion_performed: source.readiness_state.human_action_completion_performed,
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

    public_surface_observation_operator_input_bundle_submission_request: {
      ...payload,
      operator_input_bundle_submission_request_payload_digest: sha256Digest(payload),
      operator_input_bundle_submission_request_checklist: checklist,
      operator_input_bundle_submission_request_is_defined: true,
      operator_input_bundle_submission_request_is_evaluated: true,
      operator_input_bundle_submission_request_is_required: true,
      operator_input_bundle_submission_request_is_not_ready: true,
      operator_input_bundle_submission_request_is_blocked: true,
      operator_input_bundle_submission_request_is_blocked_pending_human_action_completion: true,
      operator_input_bundle_submission_request_is_not_issued: true,
      operator_input_bundle_submission_request_is_not_allowed: true,
      operator_input_bundle_submission_request_is_not_bundle_submitted: true,
      operator_input_bundle_submission_request_is_not_operator_inputs_collected: true,
      operator_input_bundle_submission_request_is_not_operator_inputs_submitted: true,
      operator_input_bundle_submission_request_is_not_operator_inputs_verified: true,
      operator_input_bundle_submission_request_is_not_public_observation_ready: true,
      operator_input_bundle_submission_request_is_not_external_customer_readiness: true,
      operator_input_bundle_submission_request_is_not_banking_pack_readiness: true,
      operator_input_bundle_submission_request_is_not_launch_readiness: true,
      operator_input_bundle_submission_request_is_not_production_readiness: true,
      operator_input_bundle_submission_request_is_not_legal_validity: true,
      operator_input_bundle_submission_request_is_not_security_certification: true,
      operator_input_bundle_submission_request_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_COMPLETION_GATE_HASH_INVALID',
      'HUMAN_ACTION_COMPLETION_GATE_NOT_READY',
      'HUMAN_ACTION_COMPLETION_GATE_NOT_PASSED',
      'OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_BLOCKED_PENDING_HUMAN_ACTION_COMPLETION',
      'HUMAN_ACTION_ACKNOWLEDGMENT_NOT_RECEIVED',
      'HUMAN_ACTION_ACKNOWLEDGMENT_NOT_VALIDATED',
      'HUMAN_ACTION_NOT_ACKNOWLEDGED',
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
      'AI_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_bundle_submission_request_defined: true,
      public_surface_observation_operator_input_bundle_submission_request_evaluated: true,
      public_surface_observation_operator_input_bundle_submission_request_required: true,
      public_surface_observation_operator_input_bundle_submission_request_ready: false,
      public_surface_observation_operator_input_bundle_submission_request_blocked: true,
      public_surface_observation_operator_input_bundle_submission_request_blocked_pending_human_action_completion: true,
      public_surface_observation_operator_input_bundle_submission_request_issued: false,
      source_public_surface_observation_operator_input_collection_human_action_completion_gate_bound: true,
      public_surface_observation_operator_input_collection_human_action_completion_gate_ready: true,
      public_surface_observation_operator_input_collection_human_action_completion_gate_evaluated: true,
      public_surface_observation_operator_input_collection_human_action_completion_gate_passed: false,
      public_surface_observation_operator_input_collection_human_action_completion_gate_blocked: true,
      public_surface_observation_operator_input_collection_human_action_completion_gate_blocked_pending_acknowledgment: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      human_action_acknowledgment_received: false,
      human_action_acknowledgment_validated: false,
      human_action_acknowledged: false,
      human_action_completed: false,
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

    next_required_program: 'PROG-120-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-HUMAN-ACTION-COMPLETION-REMEDIATION-REQUEST',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      human_action_acknowledgment_received: false,
      human_action_acknowledgment_validated: false,
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

function writeLevel1PublicSurfaceObservationOperatorInputBundleSubmissionRequest(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputBundleSubmissionRequest({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-119-level1-public-surface-observation-operator-input-bundle-submission-request.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputBundleSubmissionRequest(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_119_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_BUNDLE_SUBMISSION_REQUEST_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  requiredBundleFields,
  requiredSubmissionPrerequisites,
  buildBundleSubmissionRequestItems,
  buildObservationOperatorInputBundleSubmissionRequestPayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputBundleSubmissionRequest,
  writeLevel1PublicSurfaceObservationOperatorInputBundleSubmissionRequest
};
