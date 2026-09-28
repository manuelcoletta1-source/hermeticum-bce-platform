'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_ACKNOWLEDGMENT_DEFINED_PENDING_ACKNOWLEDGMENT';
const SOURCE_REF = 'docs/launch/level1/prog-116-level1-public-surface-observation-operator-input-collection-human-action-request.json';

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

function requiredAcknowledgmentFields() {
  return [
    'acknowledger_ref',
    'acknowledged_at',
    'acknowledgment_channel',
    'acknowledgment_statement',
    'acknowledgment_signature_ref'
  ];
}

function buildAcknowledgmentItems(source) {
  const request = source.public_surface_observation_operator_input_collection_human_action_request;

  return request.human_action_request_items.map((item) => ({
    human_action_acknowledgment_item_id: item.human_action_request_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST::',
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT::'
    ),
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
    source_human_action_request_ref: SOURCE_REF,
    acknowledgment_status: 'PENDING_HUMAN_ACKNOWLEDGMENT',
    acknowledgment_result: 'ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED',
    source_human_action_request_status: item.human_action_request_status,
    source_human_action_required: item.human_action_required,
    source_human_action_requested: item.human_action_requested,
    source_human_action_acknowledgment_required: item.human_action_acknowledgment_required,
    source_human_action_acknowledged: item.human_action_acknowledged,
    source_human_action_completed: item.human_action_completed,
    acknowledgment_required: true,
    acknowledgment_ready: true,
    acknowledgment_received: false,
    acknowledgment_validated: false,
    acknowledger_ref: null,
    acknowledged_at: null,
    acknowledgment_channel: null,
    acknowledgment_statement: null,
    acknowledgment_signature_ref: null,
    required_acknowledgment_fields: requiredAcknowledgmentFields(),
    missing_acknowledgment_fields: requiredAcknowledgmentFields(),
    required_operator_inputs: item.required_operator_inputs,
    missing_operator_inputs: item.missing_operator_inputs,
    required_human_actions: item.required_human_actions,
    operator_input_bundle_required: true,
    operator_input_bundle_submitted: false,
    human_action_required: true,
    human_action_requested: true,
    human_action_acknowledgment_required: true,
    human_action_acknowledgment_ready: true,
    human_action_acknowledged: false,
    human_action_completed: false,
    operator_inputs_collected: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    ready_for_human_action_completion: false,
    ready_for_operator_input_submission: false,
    ready_for_submission_verification_rerun: false,
    ready_for_input_collection_execution: false,
    ready_for_input_verification: false,
    ready_for_retry_gate_rerun: false,
    acknowledgment_comment: 'Human action acknowledgment is defined and ready, but no human acknowledgment has been received.'
  }));
}

function buildPayload(source) {
  const request = source.public_surface_observation_operator_input_collection_human_action_request;
  const items = buildAcknowledgmentItems(source);

  return {
    human_action_acknowledgment_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT::HBCE-L1-DECISION-PROOF-0001',
    human_action_acknowledgment_key: 'hbce.level1.public_surface.observation_operator_input_collection_human_action_acknowledgment.controlled_information.0001',
    source_public_surface_observation_operator_input_collection_human_action_request_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_collection_human_action_request_digest: request.human_action_request_payload_digest,
    human_action_acknowledgment_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    human_action_acknowledgment_status: 'DEFINED_PENDING_ACKNOWLEDGMENT',
    human_action_acknowledgment_result: 'ACKNOWLEDGMENT_REQUIRED_NOT_RECEIVED',
    human_action_acknowledgment_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_ACKNOWLEDGMENT',
    evaluated_at: '2027-01-19T18:25:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_human_action_request_status: request.human_action_request_status,
    imported_human_action_request_result: request.human_action_request_result,
    imported_human_action_request_defined: request.human_action_request_defined,
    imported_human_action_request_ready: request.human_action_request_ready,
    imported_human_action_request_prepared: request.human_action_request_prepared,
    imported_human_action_required: request.human_action_required,
    imported_human_action_requested: request.human_action_requested,
    imported_human_action_acknowledgment_required: request.human_action_acknowledgment_required,
    imported_human_action_acknowledgment_ready: request.human_action_acknowledgment_ready,
    imported_human_action_acknowledged: request.human_action_acknowledged,
    imported_human_action_completed: request.human_action_completed,
    imported_operator_input_bundle_required: request.operator_input_bundle_required,
    imported_operator_input_bundle_submitted: request.operator_input_bundle_submitted,
    imported_operator_inputs_collected: request.operator_inputs_collected,
    imported_operator_inputs_submitted: request.operator_inputs_submitted,
    imported_operator_inputs_verified: request.operator_inputs_verified,
    imported_public_surface_observed: request.public_surface_observed,
    imported_public_surface_observation_ready: request.public_surface_observation_ready,

    human_action_acknowledgment_items: items,
    human_action_acknowledgment_item_count: items.length,
    all_human_action_request_items_have_acknowledgment_items: request.human_action_request_items.every((item) =>
      items.some((ackItem) => ackItem.human_action_request_item_id === item.human_action_request_item_id)
    ),
    all_acknowledgment_items_pending: items.every((item) => item.acknowledgment_status === 'PENDING_HUMAN_ACKNOWLEDGMENT'),
    all_acknowledgment_items_required: items.every((item) => item.acknowledgment_required === true),
    all_acknowledgment_items_ready: items.every((item) => item.acknowledgment_ready === true),
    all_acknowledgment_items_not_received: items.every((item) => item.acknowledgment_received === false),
    all_acknowledgment_items_not_validated: items.every((item) => item.acknowledgment_validated === false),
    all_acknowledgment_items_without_acknowledger_ref: items.every((item) => item.acknowledger_ref === null),
    all_acknowledgment_items_without_acknowledged_at: items.every((item) => item.acknowledged_at === null),
    all_acknowledgment_items_without_acknowledgment_channel: items.every((item) => item.acknowledgment_channel === null),
    all_acknowledgment_items_without_acknowledgment_statement: items.every((item) => item.acknowledgment_statement === null),
    all_acknowledgment_items_without_acknowledgment_signature_ref: items.every((item) => item.acknowledgment_signature_ref === null),
    all_acknowledgment_items_source_request_pending: items.every((item) => item.source_human_action_request_status === 'PENDING_HUMAN_OPERATOR_ACTION'),
    all_acknowledgment_items_source_human_action_requested: items.every((item) => item.source_human_action_requested === true),
    all_acknowledgment_items_source_not_acknowledged: items.every((item) => item.source_human_action_acknowledged === false),
    all_acknowledgment_items_source_not_completed: items.every((item) => item.source_human_action_completed === false),
    all_acknowledgment_items_human_action_not_completed: items.every((item) => item.human_action_completed === false),
    all_acknowledgment_items_operator_input_bundle_not_submitted: items.every((item) => item.operator_input_bundle_submitted === false),
    all_acknowledgment_items_operator_inputs_not_collected: items.every((item) => item.operator_inputs_collected === false),
    all_acknowledgment_items_operator_inputs_not_submitted: items.every((item) => item.operator_inputs_submitted === false),
    all_acknowledgment_items_operator_inputs_not_verified: items.every((item) => item.operator_inputs_verified === false),
    all_acknowledgment_items_not_ready_for_human_action_completion: items.every((item) => item.ready_for_human_action_completion === false),
    all_acknowledgment_items_not_ready_for_operator_input_submission: items.every((item) => item.ready_for_operator_input_submission === false),
    all_acknowledgment_items_not_ready_for_submission_verification_rerun: items.every((item) => item.ready_for_submission_verification_rerun === false),
    all_acknowledgment_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_acknowledgment_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),

    human_action_acknowledgment_defined: true,
    human_action_acknowledgment_ready: true,
    human_action_acknowledgment_evaluated: true,
    human_action_acknowledgment_required: true,
    human_action_acknowledgment_received: false,
    human_action_acknowledgment_validated: false,
    human_action_acknowledged: false,
    human_action_completed: false,
    human_action_completion_ready: false,
    operator_input_bundle_required: true,
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
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,

    human_action_acknowledgment_controls: [
      'require_source_human_action_request_hash_valid',
      'require_human_action_request_ready',
      'require_human_action_request_pending_human_action',
      'require_acknowledger_ref_before_acknowledgment_received',
      'require_acknowledged_at_before_acknowledgment_received',
      'require_acknowledgment_channel_before_acknowledgment_received',
      'require_acknowledgment_statement_before_acknowledgment_received',
      'require_acknowledgment_signature_ref_before_acknowledgment_validated',
      'do_not_mark_human_action_acknowledged_without_acknowledgment_fields',
      'do_not_mark_human_action_completed_without_acknowledgment',
      'do_not_mark_operator_input_bundle_submitted_without_human_action_completion',
      'do_not_mark_operator_inputs_collected_without_submitted_bundle',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_allow_retry_without_verified_inputs',
      'do_not_infer_public_observation_from_acknowledgment',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_until_human_action_acknowledgment_is_received_and_validated'
    ],

    human_action_acknowledgment_boundary: {
      controlled_information_surface_only: true,
      acknowledgment_definition_only: true,
      acknowledgment_required_but_not_received: true,
      no_acknowledgment_recorded: true,
      no_acknowledgment_validated: true,
      no_human_action_completed: true,
      no_operator_inputs_recorded: true,
      no_operator_inputs_collected: true,
      no_operator_inputs_submitted: true,
      no_operator_inputs_verified: true,
      no_collection_retry_performed: true,
      no_submission_verification_rerun_recorded: true,
      no_remediation_execution_update_recorded: true,
      no_input_collection_execution_recorded: true,
      no_input_verification_recorded: true,
      no_retry_gate_rerun_recorded: true,
      no_public_observation_recorded: true,
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

    source_human_action_request_ready: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_ready === true,
    source_human_action_request_prepared: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_prepared === true,
    source_human_action_request_pending_human_action: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_pending_human_action === true,
    source_human_action_required: source.readiness_state.human_action_required === true,
    source_human_action_requested: source.readiness_state.human_action_requested === true,
    source_human_action_acknowledgment_required: source.readiness_state.human_action_acknowledgment_required === true,
    source_human_action_acknowledgment_ready: source.readiness_state.human_action_acknowledgment_ready === true,
    source_human_action_acknowledged: source.readiness_state.human_action_acknowledged === true,
    source_human_action_completed: source.readiness_state.human_action_completed === true,
    source_operator_input_bundle_submitted: source.readiness_state.operator_input_bundle_submitted === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_human_action_acknowledgment_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionAcknowledgment(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_collection_human_action_request_hash_valid: validHash(source),
    source_human_action_request_ready: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_ready === true,
    source_human_action_request_prepared: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_prepared === true,
    source_human_action_request_pending_human_action: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_pending_human_action === true,
    source_human_action_required: source.readiness_state.human_action_required === true,
    source_human_action_requested: source.readiness_state.human_action_requested === true,
    source_human_action_acknowledgment_required: source.readiness_state.human_action_acknowledgment_required === true,
    source_human_action_acknowledgment_ready: source.readiness_state.human_action_acknowledgment_ready === true,
    source_human_action_acknowledged: source.readiness_state.human_action_acknowledged === true,
    source_human_action_completed: source.readiness_state.human_action_completed === true,
    source_operator_input_bundle_submitted: source.readiness_state.operator_input_bundle_submitted === true,
    human_action_acknowledgment_defined: payload.human_action_acknowledgment_defined,
    human_action_acknowledgment_ready: payload.human_action_acknowledgment_ready,
    human_action_acknowledgment_evaluated: payload.human_action_acknowledgment_evaluated,
    human_action_acknowledgment_required: payload.human_action_acknowledgment_required,
    human_action_acknowledgment_received: payload.human_action_acknowledgment_received,
    human_action_acknowledgment_validated: payload.human_action_acknowledgment_validated,
    all_human_action_request_items_have_acknowledgment_items: payload.all_human_action_request_items_have_acknowledgment_items,
    all_acknowledgment_items_pending: payload.all_acknowledgment_items_pending,
    all_acknowledgment_items_required: payload.all_acknowledgment_items_required,
    all_acknowledgment_items_ready: payload.all_acknowledgment_items_ready,
    all_acknowledgment_items_not_received: payload.all_acknowledgment_items_not_received,
    all_acknowledgment_items_not_validated: payload.all_acknowledgment_items_not_validated,
    human_action_acknowledged: payload.human_action_acknowledged,
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
    ai_authority_absence_confirmed: payload.ai_human_action_acknowledgment_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-117-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_ACKNOWLEDGMENT',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT-2027-PROG-117',
    issue_id: 'PROG-117',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_collection_human_action_request_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_collection_human_action_request_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_collection_human_action_request_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_collection_human_action_acknowledgment_status: STATUS,

    inherited_public_surface_observation_operator_input_collection_human_action_request: {
      human_action_request_status: source.level1_public_surface_observation_operator_input_collection_human_action_request_status,
      public_surface_observation_operator_input_collection_human_action_request_ready: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_ready,
      public_surface_observation_operator_input_collection_human_action_request_prepared: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_prepared,
      public_surface_observation_operator_input_collection_human_action_request_pending_human_action: source.readiness_state.public_surface_observation_operator_input_collection_human_action_request_pending_human_action,
      human_action_required: source.readiness_state.human_action_required,
      human_action_requested: source.readiness_state.human_action_requested,
      human_action_acknowledgment_required: source.readiness_state.human_action_acknowledgment_required,
      human_action_acknowledgment_ready: source.readiness_state.human_action_acknowledgment_ready,
      human_action_acknowledged: source.readiness_state.human_action_acknowledged,
      human_action_completed: source.readiness_state.human_action_completed,
      operator_input_bundle_required: source.readiness_state.operator_input_bundle_required,
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

    public_surface_observation_operator_input_collection_human_action_acknowledgment: {
      ...payload,
      human_action_acknowledgment_payload_digest: sha256Digest(payload),
      human_action_acknowledgment_checklist: checklist,
      human_action_acknowledgment_is_defined: true,
      human_action_acknowledgment_is_ready: true,
      human_action_acknowledgment_is_evaluated: true,
      human_action_acknowledgment_is_pending_acknowledgment: true,
      human_action_acknowledgment_is_not_received: true,
      human_action_acknowledgment_is_not_validated: true,
      human_action_acknowledgment_is_not_human_action_completed: true,
      human_action_acknowledgment_is_not_operator_inputs_collected: true,
      human_action_acknowledgment_is_not_operator_inputs_submitted: true,
      human_action_acknowledgment_is_not_operator_inputs_verified: true,
      human_action_acknowledgment_is_not_retry_allowed: true,
      human_action_acknowledgment_is_not_retry_ready: true,
      human_action_acknowledgment_is_not_retry_performed: true,
      human_action_acknowledgment_is_not_submission_verification_rerun: true,
      human_action_acknowledgment_is_not_remediation_execution_update: true,
      human_action_acknowledgment_is_not_input_collection_execution: true,
      human_action_acknowledgment_is_not_input_verification: true,
      human_action_acknowledgment_is_not_retry_gate_rerun: true,
      human_action_acknowledgment_is_not_observation_evidence: true,
      human_action_acknowledgment_is_not_public_observation_ready: true,
      human_action_acknowledgment_is_not_external_customer_readiness: true,
      human_action_acknowledgment_is_not_banking_pack_readiness: true,
      human_action_acknowledgment_is_not_launch_readiness: true,
      human_action_acknowledgment_is_not_production_readiness: true,
      human_action_acknowledgment_is_not_legal_validity: true,
      human_action_acknowledgment_is_not_security_certification: true,
      human_action_acknowledgment_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_ACKNOWLEDGMENT_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST_NOT_READY',
      'HUMAN_ACTION_ACKNOWLEDGMENT_ITEM_MISSING',
      'ACKNOWLEDGER_REF_MISSING',
      'ACKNOWLEDGED_AT_MISSING',
      'ACKNOWLEDGMENT_CHANNEL_MISSING',
      'ACKNOWLEDGMENT_STATEMENT_MISSING',
      'ACKNOWLEDGMENT_SIGNATURE_REF_MISSING',
      'HUMAN_ACTION_ACKNOWLEDGMENT_NOT_RECEIVED',
      'HUMAN_ACTION_ACKNOWLEDGMENT_NOT_VALIDATED',
      'HUMAN_ACTION_NOT_COMPLETED',
      'OPERATOR_INPUT_BUNDLE_NOT_SUBMITTED',
      'OPERATOR_INPUTS_NOT_COLLECTED',
      'OPERATOR_INPUTS_NOT_SUBMITTED',
      'OPERATOR_INPUTS_NOT_VERIFIED',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_HUMAN_ACTION_ACKNOWLEDGMENT_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_collection_human_action_acknowledgment_defined: true,
      public_surface_observation_operator_input_collection_human_action_acknowledgment_ready: true,
      public_surface_observation_operator_input_collection_human_action_acknowledgment_evaluated: true,
      public_surface_observation_operator_input_collection_human_action_acknowledgment_pending_acknowledgment: true,
      source_public_surface_observation_operator_input_collection_human_action_request_bound: true,
      public_surface_observation_operator_input_collection_human_action_request_ready: true,
      public_surface_observation_operator_input_collection_human_action_request_prepared: true,
      public_surface_observation_operator_input_collection_human_action_request_pending_human_action: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      human_action_required: true,
      human_action_requested: true,
      human_action_acknowledgment_required: true,
      human_action_acknowledgment_ready: true,
      human_action_acknowledgment_received: false,
      human_action_acknowledgment_validated: false,
      human_action_acknowledged: false,
      human_action_completed: false,
      human_action_completion_ready: false,
      operator_input_bundle_required: true,
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

    next_required_program: 'PROG-118-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-COMPLETION-GATE',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      human_action_acknowledged: false,
      human_action_completed: false,
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

function writeLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionAcknowledgment(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionAcknowledgment({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-117-level1-public-surface-observation-operator-input-collection-human-action-acknowledgment.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionAcknowledgment(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_117_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_ACKNOWLEDGMENT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  requiredAcknowledgmentFields,
  buildAcknowledgmentItems,
  buildObservationOperatorInputCollectionHumanActionAcknowledgmentPayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionAcknowledgment,
  writeLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionAcknowledgment
};
