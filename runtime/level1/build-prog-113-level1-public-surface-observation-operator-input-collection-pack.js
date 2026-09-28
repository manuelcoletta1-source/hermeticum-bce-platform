'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_PACK_DEFINED_PENDING_OPERATOR_INPUTS';
const SOURCE_REF = 'docs/launch/level1/prog-112-level1-public-surface-observation-operator-input-submission-remediation-execution.json';

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

function buildCollectionItems(source) {
  const execution = source.public_surface_observation_operator_input_submission_remediation_execution;

  return execution.execution_items.map((item) => ({
    operator_input_collection_item_id: item.operator_input_submission_remediation_execution_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION::',
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION::'
    ),
    operator_input_submission_remediation_execution_item_id: item.operator_input_submission_remediation_execution_item_id,
    operator_input_submission_remediation_item_id: item.operator_input_submission_remediation_item_id,
    operator_input_submission_verification_item_id: item.operator_input_submission_verification_item_id,
    operator_input_submission_item_id: item.operator_input_submission_item_id,
    execution_item_id: item.execution_item_id,
    remediation_item_id: item.remediation_item_id,
    retry_target_id: item.retry_target_id,
    verification_item_id: item.verification_item_id,
    collection_item_id: item.collection_item_id,
    input_target_id: item.input_target_id,
    observation_target_id: item.observation_target_id,
    surface_type: item.surface_type,
    source_operator_input_submission_remediation_execution_ref: SOURCE_REF,
    collection_status: 'PENDING_OPERATOR_INPUT_COLLECTION',
    collection_required: true,
    source_execution_status: item.execution_status,
    source_execution_blocked_missing_operator_inputs: item.execution_status === 'BLOCKED_MISSING_OPERATOR_INPUTS',
    required_operator_inputs: requiredInputs(),
    input_capture_contract: {
      submitter_ref: {
        required: true,
        expected_type: 'string',
        submitted: false,
        value: null
      },
      submitted_at: {
        required: true,
        expected_type: 'iso8601_utc_timestamp',
        submitted: false,
        value: null
      },
      submission_channel: {
        required: true,
        expected_type: 'controlled_channel_ref',
        submitted: false,
        value: null
      },
      public_url: {
        required: true,
        expected_type: 'public_https_url',
        submitted: false,
        value: null
      },
      observer_ref: {
        required: true,
        expected_type: 'observer_identity_ref',
        submitted: false,
        value: null
      },
      observed_content_digest: {
        required: true,
        expected_type: 'sha256_digest',
        submitted: false,
        value: null
      },
      scope_match_result: {
        required: true,
        expected_type: 'boolean',
        submitted: false,
        value: null
      },
      non_claims_presence_result: {
        required: true,
        expected_type: 'boolean',
        submitted: false,
        value: null
      },
      evidence_reference_presence_result: {
        required: true,
        expected_type: 'boolean',
        submitted: false,
        value: null
      },
      customer_data_absence_declaration: {
        required: true,
        expected_type: 'boolean',
        submitted: false,
        value: null
      },
      forbidden_claims_absence_declaration: {
        required: true,
        expected_type: 'boolean',
        submitted: false,
        value: null
      }
    },
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
    operator_input_collection_attempted: false,
    operator_input_collection_completed: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    ready_for_submission_verification_rerun: false,
    ready_for_remediation_execution_update: false,
    ready_for_input_collection_execution: false,
    ready_for_input_verification: false,
    ready_for_retry_gate_rerun: false,
    collection_comment: 'Collection pack item is defined but operator inputs are pending.'
  }));
}

function buildPayload(source) {
  const execution = source.public_surface_observation_operator_input_submission_remediation_execution;
  const items = buildCollectionItems(source);

  return {
    operator_input_collection_pack_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK::HBCE-L1-DECISION-PROOF-0001',
    operator_input_collection_pack_key: 'hbce.level1.public_surface.observation_operator_input_collection_pack.controlled_information.0001',
    source_public_surface_observation_operator_input_submission_remediation_execution_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_submission_remediation_execution_digest: execution.operator_input_submission_remediation_execution_payload_digest,
    operator_input_collection_pack_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    operator_input_collection_pack_status: 'DEFINED_PENDING_OPERATOR_INPUTS',
    operator_input_collection_pack_result: 'OPERATOR_INPUT_COLLECTION_NOT_COMPLETED',
    operator_input_collection_pack_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_PACK',
    defined_at: '2027-01-19T18:05:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_operator_input_submission_remediation_execution_status: execution.operator_input_submission_remediation_execution_status,
    imported_operator_input_submission_remediation_execution_result: execution.operator_input_submission_remediation_execution_result,
    imported_operator_input_submission_remediation_execution_defined: execution.operator_input_submission_remediation_execution_defined,
    imported_operator_input_submission_remediation_execution_evaluated: execution.operator_input_submission_remediation_execution_evaluated,
    imported_operator_input_submission_remediation_execution_attempted: execution.operator_input_submission_remediation_execution_attempted,
    imported_operator_input_submission_remediation_execution_completed: execution.operator_input_submission_remediation_execution_completed,
    imported_operator_input_submission_remediation_execution_blocked_missing_operator_inputs: execution.operator_input_submission_remediation_execution_blocked_missing_operator_inputs,
    imported_operator_input_collection_ready: execution.operator_input_collection_ready,
    imported_operator_inputs_collected: execution.operator_inputs_collected,
    imported_operator_inputs_submitted: execution.operator_inputs_submitted,
    imported_operator_inputs_verified: execution.operator_inputs_verified,
    imported_submission_verification_rerun_ready: execution.submission_verification_rerun_ready,
    imported_remediation_execution_update_ready: execution.remediation_execution_update_ready,
    imported_input_collection_execution_ready: execution.input_collection_execution_ready,
    imported_input_verification_ready: execution.input_verification_ready,
    imported_retry_gate_rerun_ready: execution.retry_gate_rerun_ready,

    collection_items: items,
    collection_item_count: items.length,
    all_execution_items_have_collection_items: execution.execution_items.every((item) =>
      items.some((collectionItem) => collectionItem.operator_input_submission_remediation_execution_item_id === item.operator_input_submission_remediation_execution_item_id)
    ),
    all_collection_items_pending: items.every((item) => item.collection_status === 'PENDING_OPERATOR_INPUT_COLLECTION'),
    all_collection_items_source_blocked_missing_operator_inputs: items.every((item) => item.source_execution_blocked_missing_operator_inputs === true),
    all_collection_items_have_capture_contract: items.every((item) => item.input_capture_contract && typeof item.input_capture_contract === 'object'),
    all_collection_items_require_submitter_ref: items.every((item) => item.required_operator_inputs.includes('submitter_ref')),
    all_collection_items_require_submitted_at: items.every((item) => item.required_operator_inputs.includes('submitted_at')),
    all_collection_items_require_submission_channel: items.every((item) => item.required_operator_inputs.includes('submission_channel')),
    all_collection_items_require_public_url: items.every((item) => item.required_operator_inputs.includes('public_url')),
    all_collection_items_require_observer_ref: items.every((item) => item.required_operator_inputs.includes('observer_ref')),
    all_collection_items_require_observed_content_digest: items.every((item) => item.required_operator_inputs.includes('observed_content_digest')),
    all_collection_items_require_scope_match_result: items.every((item) => item.required_operator_inputs.includes('scope_match_result')),
    all_collection_items_require_non_claims_presence_result: items.every((item) => item.required_operator_inputs.includes('non_claims_presence_result')),
    all_collection_items_require_evidence_reference_presence_result: items.every((item) => item.required_operator_inputs.includes('evidence_reference_presence_result')),
    all_collection_items_require_customer_data_absence_declaration: items.every((item) => item.required_operator_inputs.includes('customer_data_absence_declaration')),
    all_collection_items_require_forbidden_claims_absence_declaration: items.every((item) => item.required_operator_inputs.includes('forbidden_claims_absence_declaration')),
    all_collection_items_without_submitter_ref: items.every((item) => item.submitter_ref === null && item.submitter_ref_collected === false),
    all_collection_items_without_submitted_at: items.every((item) => item.submitted_at === null && item.submitted_at_collected === false),
    all_collection_items_without_submission_channel: items.every((item) => item.submission_channel === null && item.submission_channel_collected === false),
    all_collection_items_without_public_url: items.every((item) => item.public_url === null && item.public_url_collected === false),
    all_collection_items_without_observer_ref: items.every((item) => item.observer_ref === null && item.observer_ref_collected === false),
    all_collection_items_without_observed_content_digest: items.every((item) => item.observed_content_digest === null && item.observed_content_digest_collected === false),
    all_collection_items_without_scope_match_result: items.every((item) => item.scope_match_result === null && item.scope_match_result_collected === false),
    all_collection_items_without_non_claims_result: items.every((item) => item.non_claims_presence_result === null && item.non_claims_presence_result_collected === false),
    all_collection_items_without_evidence_reference_result: items.every((item) => item.evidence_reference_presence_result === null && item.evidence_reference_presence_result_collected === false),
    all_collection_items_without_customer_data_absence_declaration: items.every((item) => item.customer_data_absence_declaration === null && item.customer_data_absence_declaration_collected === false),
    all_collection_items_without_forbidden_claims_absence_declaration: items.every((item) => item.forbidden_claims_absence_declaration === null && item.forbidden_claims_absence_declaration_collected === false),
    all_collection_items_not_attempted: items.every((item) => item.operator_input_collection_attempted === false),
    all_collection_items_not_completed: items.every((item) => item.operator_input_collection_completed === false),
    all_collection_items_not_ready_for_submission_verification_rerun: items.every((item) => item.ready_for_submission_verification_rerun === false),
    all_collection_items_not_ready_for_remediation_execution_update: items.every((item) => item.ready_for_remediation_execution_update === false),
    all_collection_items_not_ready_for_input_collection_execution: items.every((item) => item.ready_for_input_collection_execution === false),
    all_collection_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_collection_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),

    operator_input_collection_pack_defined: true,
    operator_input_collection_pack_ready: true,
    operator_input_collection_pack_completed: false,
    operator_input_collection_execution_ready: true,
    operator_input_collection_attempted: false,
    operator_input_collection_completed: false,
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

    operator_input_collection_pack_controls: [
      'define_operator_input_collection_items',
      'define_input_capture_contract',
      'require_submitter_ref_collection',
      'require_submitted_at_collection',
      'require_submission_channel_collection',
      'require_public_url_collection',
      'require_observer_ref_collection',
      'require_observed_content_digest_collection',
      'require_scope_match_result_collection',
      'require_non_claims_presence_result_collection',
      'require_evidence_reference_presence_result_collection',
      'require_customer_data_absence_declaration_collection',
      'require_forbidden_claims_absence_declaration_collection',
      'do_not_mark_collection_complete_without_all_required_inputs',
      'do_not_mark_operator_inputs_submitted_without_complete_collection',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_mark_submission_verification_rerun_ready_without_collected_inputs',
      'do_not_mark_remediation_execution_update_ready_without_verified_inputs',
      'do_not_mark_input_collection_execution_ready_without_verified_inputs',
      'do_not_rerun_retry_gate_without_input_verification_pass',
      'do_not_infer_public_observation_from_collection_pack',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_until_operator_inputs_are_supplied'
    ],

    operator_input_collection_pack_boundary: {
      controlled_information_surface_only: true,
      collection_pack_definition_only: true,
      no_operator_inputs_recorded: true,
      no_operator_inputs_collected: true,
      no_operator_inputs_submitted: true,
      no_operator_inputs_verified: true,
      no_submission_verification_rerun_recorded: true,
      no_remediation_execution_update_recorded: true,
      no_input_collection_execution_recorded: true,
      no_input_verification_recorded: true,
      no_retry_gate_rerun_recorded: true,
      no_public_observation_recorded: true,
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

    source_operator_input_submission_remediation_execution_ready: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_ready === true,
    source_operator_input_submission_remediation_execution_evaluated: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_evaluated === true,
    source_operator_input_submission_remediation_execution_completed: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_completed === true,
    source_operator_input_submission_remediation_execution_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_blocked_missing_operator_inputs === true,
    source_operator_input_collection_ready: source.readiness_state.operator_input_collection_ready === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_operator_input_collection_pack_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputCollectionPack(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_submission_remediation_execution_hash_valid: validHash(source),
    source_operator_input_submission_remediation_execution_ready: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_ready === true,
    source_operator_input_submission_remediation_execution_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_blocked_missing_operator_inputs === true,
    source_operator_input_collection_ready: source.readiness_state.operator_input_collection_ready === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    operator_input_collection_pack_defined: payload.operator_input_collection_pack_defined,
    operator_input_collection_pack_ready: payload.operator_input_collection_pack_ready,
    operator_input_collection_pack_completed: payload.operator_input_collection_pack_completed,
    operator_input_collection_execution_ready: payload.operator_input_collection_execution_ready,
    all_execution_items_have_collection_items: payload.all_execution_items_have_collection_items,
    all_collection_items_pending: payload.all_collection_items_pending,
    all_collection_items_have_capture_contract: payload.all_collection_items_have_capture_contract,
    all_collection_items_without_public_url: payload.all_collection_items_without_public_url,
    all_collection_items_without_observer_ref: payload.all_collection_items_without_observer_ref,
    all_collection_items_without_observed_content_digest: payload.all_collection_items_without_observed_content_digest,
    operator_inputs_collected: payload.operator_inputs_collected,
    operator_inputs_submitted: payload.operator_inputs_submitted,
    operator_inputs_verified: payload.operator_inputs_verified,
    submission_verification_rerun_ready: payload.submission_verification_rerun_ready,
    remediation_execution_update_ready: payload.remediation_execution_update_ready,
    input_collection_execution_ready: payload.input_collection_execution_ready,
    input_verification_ready: payload.input_verification_ready,
    retry_gate_rerun_ready: payload.retry_gate_rerun_ready,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_operator_input_collection_pack_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-113-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_PACK',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK-2027-PROG-113',
    issue_id: 'PROG-113',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_submission_remediation_execution_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_submission_remediation_execution_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_submission_remediation_execution_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_collection_pack_status: STATUS,

    inherited_public_surface_observation_operator_input_submission_remediation_execution: {
      operator_input_submission_remediation_execution_status: source.level1_public_surface_observation_operator_input_submission_remediation_execution_status,
      public_surface_observation_operator_input_submission_remediation_execution_ready: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_ready,
      public_surface_observation_operator_input_submission_remediation_execution_evaluated: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_evaluated,
      public_surface_observation_operator_input_submission_remediation_execution_attempted: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_attempted,
      public_surface_observation_operator_input_submission_remediation_execution_completed: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_completed,
      public_surface_observation_operator_input_submission_remediation_execution_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_submission_remediation_execution_blocked_missing_operator_inputs,
      operator_input_collection_ready: source.readiness_state.operator_input_collection_ready,
      operator_inputs_collected: source.readiness_state.operator_inputs_collected,
      operator_inputs_submitted: source.readiness_state.operator_inputs_submitted,
      operator_inputs_verified: source.readiness_state.operator_inputs_verified,
      submission_verification_rerun_ready: source.readiness_state.submission_verification_rerun_ready,
      remediation_execution_update_ready: source.readiness_state.remediation_execution_update_ready,
      input_collection_execution_ready: source.readiness_state.input_collection_execution_ready,
      input_verification_ready: source.readiness_state.input_verification_ready,
      retry_gate_rerun_ready: source.readiness_state.retry_gate_rerun_ready,
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

    public_surface_observation_operator_input_collection_pack: {
      ...payload,
      operator_input_collection_pack_payload_digest: sha256Digest(payload),
      operator_input_collection_pack_checklist: checklist,
      operator_input_collection_pack_is_defined: true,
      operator_input_collection_pack_is_ready: true,
      operator_input_collection_pack_is_pending_inputs: true,
      operator_input_collection_pack_is_not_completed: true,
      operator_input_collection_pack_is_not_operator_inputs_collected: true,
      operator_input_collection_pack_is_not_operator_inputs_submitted: true,
      operator_input_collection_pack_is_not_operator_inputs_verified: true,
      operator_input_collection_pack_is_not_submission_verification_rerun: true,
      operator_input_collection_pack_is_not_remediation_execution_update: true,
      operator_input_collection_pack_is_not_input_collection_execution: true,
      operator_input_collection_pack_is_not_input_verification: true,
      operator_input_collection_pack_is_not_retry_gate_rerun: true,
      operator_input_collection_pack_is_not_observation_evidence: true,
      operator_input_collection_pack_is_not_public_observation_ready: true,
      operator_input_collection_pack_is_not_external_customer_readiness: true,
      operator_input_collection_pack_is_not_banking_pack_readiness: true,
      operator_input_collection_pack_is_not_launch_readiness: true,
      operator_input_collection_pack_is_not_production_readiness: true,
      operator_input_collection_pack_is_not_legal_validity: true,
      operator_input_collection_pack_is_not_security_certification: true,
      operator_input_collection_pack_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_PACK_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_REMEDIATION_EXECUTION_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_REMEDIATION_EXECUTION_NOT_READY',
      'OPERATOR_INPUT_COLLECTION_ITEM_MISSING',
      'INPUT_CAPTURE_CONTRACT_MISSING',
      'SUBMITTER_REF_COLLECTION_MISSING',
      'SUBMITTED_AT_COLLECTION_MISSING',
      'SUBMISSION_CHANNEL_COLLECTION_MISSING',
      'PUBLIC_URL_COLLECTION_MISSING',
      'OBSERVER_REF_COLLECTION_MISSING',
      'OBSERVED_CONTENT_DIGEST_COLLECTION_MISSING',
      'SCOPE_MATCH_RESULT_COLLECTION_MISSING',
      'NON_CLAIMS_RESULT_COLLECTION_MISSING',
      'EVIDENCE_REFERENCE_RESULT_COLLECTION_MISSING',
      'CUSTOMER_DATA_ABSENCE_DECLARATION_COLLECTION_MISSING',
      'FORBIDDEN_CLAIMS_ABSENCE_DECLARATION_COLLECTION_MISSING',
      'OPERATOR_INPUT_COLLECTION_NOT_COMPLETED',
      'OPERATOR_INPUTS_NOT_COLLECTED',
      'OPERATOR_INPUTS_NOT_SUBMITTED',
      'OPERATOR_INPUTS_NOT_VERIFIED',
      'SUBMISSION_VERIFICATION_RERUN_NOT_READY',
      'REMEDIATION_EXECUTION_UPDATE_NOT_READY',
      'INPUT_COLLECTION_EXECUTION_NOT_READY',
      'INPUT_VERIFICATION_NOT_READY',
      'RETRY_GATE_RERUN_NOT_READY',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_OPERATOR_INPUT_COLLECTION_PACK_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_collection_pack_defined: true,
      public_surface_observation_operator_input_collection_pack_ready: true,
      public_surface_observation_operator_input_collection_pack_completed: false,
      source_public_surface_observation_operator_input_submission_remediation_execution_bound: true,
      public_surface_observation_operator_input_submission_remediation_execution_ready: true,
      public_surface_observation_operator_input_submission_remediation_execution_blocked_missing_operator_inputs: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      operator_input_collection_pack_ready: true,
      operator_input_collection_execution_ready: true,
      operator_input_collection_attempted: false,
      operator_input_collection_completed: false,
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

    next_required_program: 'PROG-114-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-EXECUTION',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
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

function writeLevel1PublicSurfaceObservationOperatorInputCollectionPack(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputCollectionPack({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-113-level1-public-surface-observation-operator-input-collection-pack.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputCollectionPack(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_113_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_PACK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  requiredInputs,
  buildCollectionItems,
  buildObservationOperatorInputCollectionPackPayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionPack,
  writeLevel1PublicSurfaceObservationOperatorInputCollectionPack
};
