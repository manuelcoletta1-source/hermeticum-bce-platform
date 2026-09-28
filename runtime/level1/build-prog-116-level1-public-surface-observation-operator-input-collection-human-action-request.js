'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST_DEFINED_PENDING_HUMAN_ACTION';
const SOURCE_REF = 'docs/launch/level1/prog-115-level1-public-surface-observation-operator-input-collection-retry-gate.json';

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

function requiredInputs() {
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

function requiredHumanActions() {
  return [
    'identify_human_submitter',
    'record_submission_timestamp',
    'record_submission_channel',
    'provide_public_url',
    'provide_observer_ref',
    'provide_observed_content_digest',
    'provide_scope_match_result',
    'provide_non_claims_presence_result',
    'provide_evidence_reference_presence_result',
    'provide_customer_data_absence_declaration',
    'provide_forbidden_claims_absence_declaration',
    'submit_operator_input_bundle_for_verification'
  ];
}

function buildHumanActionRequestItems(source) {
  const gate = source.public_surface_observation_operator_input_collection_retry_gate;

  return gate.retry_gate_items.map((item) => ({
    human_action_request_item_id: item.operator_input_collection_retry_gate_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE::',
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST::'
    ),
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
    source_operator_input_collection_retry_gate_ref: SOURCE_REF,
    human_action_request_status: 'PENDING_HUMAN_OPERATOR_ACTION',
    human_action_request_result: 'HUMAN_ACTION_REQUIRED_NOT_COMPLETED',
    source_retry_gate_status: item.retry_gate_status,
    source_retry_gate_result: item.retry_gate_result,
    source_retry_gate_blocked: item.retry_gate_blocked,
    source_retry_gate_blocked_missing_operator_inputs: item.retry_gate_status === 'BLOCKED_MISSING_OPERATOR_INPUTS',
    human_action_required: true,
    human_action_requested: true,
    human_action_acknowledgment_required: true,
    human_action_acknowledged: false,
    human_action_completed: false,
    operator_input_bundle_required: true,
    operator_input_bundle_submitted: false,
    required_operator_inputs: requiredInputs(),
    missing_operator_inputs: requiredInputs(),
    required_human_actions: requiredHumanActions(),
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
    submitter_ref_collected: false,
    submitted_at_collected: false,
    submission_channel_collected: false,
    public_url_collected: false,
    observer_ref_collected: false,
    observed_content_digest_collected: false,
    scope_match_result_collected: false,
    non_claims_presence_result_collected: false,
    evidence_reference_presence_result_collected: false,
    customer_data_absence_declaration_collected: false,
    forbidden_claims_absence_declaration_collected: false,
    all_required_operator_inputs_collected: false,
    operator_inputs_collected: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    ready_for_human_acknowledgment: true,
    ready_for_operator_input_submission: false,
    ready_for_submission_verification_rerun: false,
    ready_for_remediation_execution_update: false,
    ready_for_input_collection_execution: false,
    ready_for_input_verification: false,
    ready_for_retry_gate_rerun: false,
    human_action_request_comment: 'Human action request is defined because retry is blocked by missing operator inputs.'
  }));
}

function buildPayload(source) {
  const gate = source.public_surface_observation_operator_input_collection_retry_gate;
  const items = buildHumanActionRequestItems(source);

  return {
    human_action_request_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST::HBCE-L1-DECISION-PROOF-0001',
    human_action_request_key: 'hbce.level1.public_surface.observation_operator_input_collection_human_action_request.controlled_information.0001',
    source_public_surface_observation_operator_input_collection_retry_gate_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_collection_retry_gate_digest: gate.operator_input_collection_retry_gate_payload_digest,
    human_action_request_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    human_action_request_status: 'DEFINED_PENDING_HUMAN_ACTION',
    human_action_request_result: 'HUMAN_ACTION_REQUIRED_NOT_COMPLETED',
    human_action_request_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST',
    requested_at: '2027-01-19T18:20:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_operator_input_collection_retry_gate_status: gate.operator_input_collection_retry_gate_status,
    imported_operator_input_collection_retry_gate_result: gate.operator_input_collection_retry_gate_result,
    imported_operator_input_collection_retry_gate_defined: gate.operator_input_collection_retry_gate_defined,
    imported_operator_input_collection_retry_gate_ready: gate.operator_input_collection_retry_gate_ready,
    imported_operator_input_collection_retry_gate_evaluated: gate.operator_input_collection_retry_gate_evaluated,
    imported_operator_input_collection_retry_gate_passed: gate.operator_input_collection_retry_gate_passed,
    imported_operator_input_collection_retry_gate_blocked: gate.operator_input_collection_retry_gate_blocked,
    imported_operator_input_collection_retry_gate_blocked_missing_operator_inputs: gate.operator_input_collection_retry_gate_blocked_missing_operator_inputs,
    imported_operator_input_collection_retry_allowed: gate.operator_input_collection_retry_allowed,
    imported_operator_input_collection_retry_ready: gate.operator_input_collection_retry_ready,
    imported_operator_input_collection_retry_performed: gate.operator_input_collection_retry_performed,
    imported_operator_inputs_collected: gate.operator_inputs_collected,
    imported_operator_inputs_submitted: gate.operator_inputs_submitted,
    imported_operator_inputs_verified: gate.operator_inputs_verified,
    imported_public_surface_observed: gate.public_surface_observed,
    imported_public_surface_observation_ready: gate.public_surface_observation_ready,

    human_action_request_items: items,
    human_action_request_item_count: items.length,
    all_retry_gate_items_have_human_action_request_items: gate.retry_gate_items.every((item) =>
      items.some((requestItem) => requestItem.operator_input_collection_retry_gate_item_id === item.operator_input_collection_retry_gate_item_id)
    ),
    all_human_action_request_items_pending: items.every((item) => item.human_action_request_status === 'PENDING_HUMAN_OPERATOR_ACTION'),
    all_human_action_request_items_required: items.every((item) => item.human_action_required === true),
    all_human_action_request_items_requested: items.every((item) => item.human_action_requested === true),
    all_human_action_request_items_not_acknowledged: items.every((item) => item.human_action_acknowledged === false),
    all_human_action_request_items_not_completed: items.every((item) => item.human_action_completed === false),
    all_human_action_request_items_source_retry_gate_blocked: items.every((item) => item.source_retry_gate_blocked === true),
    all_human_action_request_items_source_retry_gate_blocked_missing_operator_inputs: items.every((item) => item.source_retry_gate_blocked_missing_operator_inputs === true),
    all_human_action_request_items_require_submitter_ref: items.every((item) => item.required_operator_inputs.includes('submitter_ref')),
    all_human_action_request_items_require_submitted_at: items.every((item) => item.required_operator_inputs.includes('submitted_at')),
    all_human_action_request_items_require_submission_channel: items.every((item) => item.required_operator_inputs.includes('submission_channel')),
    all_human_action_request_items_require_public_url: items.every((item) => item.required_operator_inputs.includes('public_url')),
    all_human_action_request_items_require_observer_ref: items.every((item) => item.required_operator_inputs.includes('observer_ref')),
    all_human_action_request_items_require_observed_content_digest: items.every((item) => item.required_operator_inputs.includes('observed_content_digest')),
    all_human_action_request_items_require_scope_match_result: items.every((item) => item.required_operator_inputs.includes('scope_match_result')),
    all_human_action_request_items_require_non_claims_presence_result: items.every((item) => item.required_operator_inputs.includes('non_claims_presence_result')),
    all_human_action_request_items_require_evidence_reference_presence_result: items.every((item) => item.required_operator_inputs.includes('evidence_reference_presence_result')),
    all_human_action_request_items_require_customer_data_absence_declaration: items.every((item) => item.required_operator_inputs.includes('customer_data_absence_declaration')),
    all_human_action_request_items_require_forbidden_claims_absence_declaration: items.every((item) => item.required_operator_inputs.includes('forbidden_claims_absence_declaration')),
    all_human_action_request_items_operator_inputs_not_collected: items.every((item) => item.operator_inputs_collected === false),
    all_human_action_request_items_operator_inputs_not_submitted: items.every((item) => item.operator_inputs_submitted === false),
    all_human_action_request_items_operator_inputs_not_verified: items.every((item) => item.operator_inputs_verified === false),
    all_human_action_request_items_ready_for_acknowledgment: items.every((item) => item.ready_for_human_acknowledgment === true),
    all_human_action_request_items_not_ready_for_operator_input_submission: items.every((item) => item.ready_for_operator_input_submission === false),
    all_human_action_request_items_not_ready_for_submission_verification_rerun: items.every((item) => item.ready_for_submission_verification_rerun === false),
    all_human_action_request_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_human_action_request_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),

    human_action_request_defined: true,
    human_action_request_ready: true,
    human_action_request_prepared: true,
    human_action_required: true,
    human_action_requested: true,
    human_action_acknowledgment_required: true,
    human_action_acknowledgment_ready: true,
    human_action_acknowledged: false,
    human_action_completed: false,
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

    human_action_request_controls: [
      'require_source_operator_input_collection_retry_gate_hash_valid',
      'require_retry_gate_blocked_missing_operator_inputs',
      'request_human_submitter_ref',
      'request_submitted_at',
      'request_submission_channel',
      'request_public_url',
      'request_observer_ref',
      'request_observed_content_digest',
      'request_scope_match_result',
      'request_non_claims_presence_result',
      'request_evidence_reference_presence_result',
      'request_customer_data_absence_declaration',
      'request_forbidden_claims_absence_declaration',
      'request_operator_input_bundle_submission',
      'do_not_record_operator_inputs_in_request_artifact',
      'do_not_mark_human_action_completed_without_acknowledgment',
      'do_not_mark_operator_inputs_collected_without_submitted_bundle',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_allow_retry_without_verified_inputs',
      'do_not_infer_public_observation_from_human_action_request',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_until_human_action_is_acknowledged_and_completed'
    ],

    human_action_request_boundary: {
      controlled_information_surface_only: true,
      human_action_request_definition_only: true,
      human_action_required_but_not_completed: true,
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

    source_operator_input_collection_retry_gate_ready: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_ready === true,
    source_operator_input_collection_retry_gate_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_evaluated === true,
    source_operator_input_collection_retry_gate_passed: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_passed === true,
    source_operator_input_collection_retry_gate_blocked: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_blocked === true,
    source_operator_input_collection_retry_gate_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_blocked_missing_operator_inputs === true,
    source_operator_input_collection_retry_allowed: source.readiness_state.operator_input_collection_retry_allowed === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_human_action_request_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionRequest(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_collection_retry_gate_hash_valid: validHash(source),
    source_operator_input_collection_retry_gate_ready: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_ready === true,
    source_operator_input_collection_retry_gate_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_evaluated === true,
    source_operator_input_collection_retry_gate_passed: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_passed === true,
    source_operator_input_collection_retry_gate_blocked: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_blocked === true,
    source_operator_input_collection_retry_gate_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_blocked_missing_operator_inputs === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    human_action_request_defined: payload.human_action_request_defined,
    human_action_request_ready: payload.human_action_request_ready,
    human_action_request_prepared: payload.human_action_request_prepared,
    human_action_required: payload.human_action_required,
    human_action_requested: payload.human_action_requested,
    human_action_acknowledgment_ready: payload.human_action_acknowledgment_ready,
    human_action_acknowledged: payload.human_action_acknowledged,
    human_action_completed: payload.human_action_completed,
    all_retry_gate_items_have_human_action_request_items: payload.all_retry_gate_items_have_human_action_request_items,
    all_human_action_request_items_pending: payload.all_human_action_request_items_pending,
    all_human_action_request_items_required: payload.all_human_action_request_items_required,
    all_human_action_request_items_requested: payload.all_human_action_request_items_requested,
    all_human_action_request_items_not_acknowledged: payload.all_human_action_request_items_not_acknowledged,
    all_human_action_request_items_not_completed: payload.all_human_action_request_items_not_completed,
    operator_inputs_collected: payload.operator_inputs_collected,
    operator_inputs_submitted: payload.operator_inputs_submitted,
    operator_inputs_verified: payload.operator_inputs_verified,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_human_action_request_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-116-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST-2027-PROG-116',
    issue_id: 'PROG-116',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_collection_retry_gate_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_collection_retry_gate_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_collection_retry_gate_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_collection_human_action_request_status: STATUS,

    inherited_public_surface_observation_operator_input_collection_retry_gate: {
      operator_input_collection_retry_gate_status: source.level1_public_surface_observation_operator_input_collection_retry_gate_status,
      public_surface_observation_operator_input_collection_retry_gate_ready: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_ready,
      public_surface_observation_operator_input_collection_retry_gate_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_evaluated,
      public_surface_observation_operator_input_collection_retry_gate_passed: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_passed,
      public_surface_observation_operator_input_collection_retry_gate_blocked: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_blocked,
      public_surface_observation_operator_input_collection_retry_gate_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_collection_retry_gate_blocked_missing_operator_inputs,
      operator_input_collection_retry_allowed: source.readiness_state.operator_input_collection_retry_allowed,
      operator_input_collection_retry_ready: source.readiness_state.operator_input_collection_retry_ready,
      operator_input_collection_retry_performed: source.readiness_state.operator_input_collection_retry_performed,
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

    public_surface_observation_operator_input_collection_human_action_request: {
      ...payload,
      human_action_request_payload_digest: sha256Digest(payload),
      human_action_request_checklist: checklist,
      human_action_request_is_defined: true,
      human_action_request_is_ready: true,
      human_action_request_is_prepared: true,
      human_action_request_is_pending_human_action: true,
      human_action_request_is_not_acknowledged: true,
      human_action_request_is_not_completed: true,
      human_action_request_is_not_operator_inputs_collected: true,
      human_action_request_is_not_operator_inputs_submitted: true,
      human_action_request_is_not_operator_inputs_verified: true,
      human_action_request_is_not_retry_allowed: true,
      human_action_request_is_not_retry_ready: true,
      human_action_request_is_not_retry_performed: true,
      human_action_request_is_not_submission_verification_rerun: true,
      human_action_request_is_not_remediation_execution_update: true,
      human_action_request_is_not_input_collection_execution: true,
      human_action_request_is_not_input_verification: true,
      human_action_request_is_not_retry_gate_rerun: true,
      human_action_request_is_not_observation_evidence: true,
      human_action_request_is_not_public_observation_ready: true,
      human_action_request_is_not_external_customer_readiness: true,
      human_action_request_is_not_banking_pack_readiness: true,
      human_action_request_is_not_launch_readiness: true,
      human_action_request_is_not_production_readiness: true,
      human_action_request_is_not_legal_validity: true,
      human_action_request_is_not_security_certification: true,
      human_action_request_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE_NOT_READY',
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE_NOT_BLOCKED',
      'HUMAN_ACTION_REQUEST_ITEM_MISSING',
      'HUMAN_ACTION_NOT_ACKNOWLEDGED',
      'HUMAN_ACTION_NOT_COMPLETED',
      'OPERATOR_INPUT_BUNDLE_NOT_SUBMITTED',
      'SUBMITTER_REF_MISSING',
      'SUBMITTED_AT_MISSING',
      'SUBMISSION_CHANNEL_MISSING',
      'PUBLIC_URL_MISSING',
      'OBSERVER_REF_MISSING',
      'OBSERVED_CONTENT_DIGEST_MISSING',
      'SCOPE_MATCH_RESULT_MISSING',
      'NON_CLAIMS_RESULT_MISSING',
      'EVIDENCE_REFERENCE_RESULT_MISSING',
      'CUSTOMER_DATA_ABSENCE_DECLARATION_MISSING',
      'FORBIDDEN_CLAIMS_ABSENCE_DECLARATION_MISSING',
      'OPERATOR_INPUTS_NOT_COLLECTED',
      'OPERATOR_INPUTS_NOT_SUBMITTED',
      'OPERATOR_INPUTS_NOT_VERIFIED',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_HUMAN_ACTION_REQUEST_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_collection_human_action_request_defined: true,
      public_surface_observation_operator_input_collection_human_action_request_ready: true,
      public_surface_observation_operator_input_collection_human_action_request_prepared: true,
      public_surface_observation_operator_input_collection_human_action_request_pending_human_action: true,
      source_public_surface_observation_operator_input_collection_retry_gate_bound: true,
      public_surface_observation_operator_input_collection_retry_gate_ready: true,
      public_surface_observation_operator_input_collection_retry_gate_evaluated: true,
      public_surface_observation_operator_input_collection_retry_gate_passed: false,
      public_surface_observation_operator_input_collection_retry_gate_blocked: true,
      public_surface_observation_operator_input_collection_retry_gate_blocked_missing_operator_inputs: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      human_action_required: true,
      human_action_requested: true,
      human_action_acknowledgment_required: true,
      human_action_acknowledgment_ready: true,
      human_action_acknowledged: false,
      human_action_completed: false,
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

    next_required_program: 'PROG-117-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-ACKNOWLEDGMENT',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      human_action_completed: false,
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

function writeLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionRequest(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionRequest({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-116-level1-public-surface-observation-operator-input-collection-human-action-request.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionRequest(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_116_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_HUMAN_ACTION_REQUEST_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  requiredInputs,
  requiredHumanActions,
  buildHumanActionRequestItems,
  buildObservationOperatorInputCollectionHumanActionRequestPayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionRequest,
  writeLevel1PublicSurfaceObservationOperatorInputCollectionHumanActionRequest
};
