'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE_BLOCKED_MISSING_OPERATOR_INPUTS';
const SOURCE_REF = 'docs/launch/level1/prog-114-level1-public-surface-observation-operator-input-collection-execution.json';

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

function buildRetryGateItems(source) {
  const execution = source.public_surface_observation_operator_input_collection_execution;

  return execution.collection_execution_items.map((item) => ({
    operator_input_collection_retry_gate_item_id: item.operator_input_collection_execution_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-EXECUTION::',
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE::'
    ),
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
    source_operator_input_collection_execution_ref: SOURCE_REF,
    retry_gate_status: 'BLOCKED_MISSING_OPERATOR_INPUTS',
    retry_gate_result: 'COLLECTION_RETRY_NOT_READY',
    source_collection_execution_status: item.collection_execution_status,
    source_collection_execution_evaluated: item.collection_execution_evaluated,
    source_collection_execution_attempted: item.collection_execution_attempted,
    source_collection_execution_completed: item.collection_execution_completed,
    source_collection_execution_blocked_missing_operator_inputs: item.collection_execution_blocked_missing_operator_inputs,
    retry_gate_evaluated: true,
    retry_gate_passed: false,
    retry_gate_blocked: true,
    retry_allowed: false,
    retry_ready: false,
    retry_performed: false,
    blocking_criteria: [
      'operator_inputs_collected',
      'operator_inputs_submitted',
      'operator_inputs_verified',
      'collection_execution_completed',
      'source_missing_inputs_absent'
    ],
    required_operator_inputs: requiredInputs(),
    missing_operator_inputs: requiredInputs(),
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
    collection_execution_completed: false,
    submission_verification_rerun_ready: false,
    remediation_execution_update_ready: false,
    input_collection_execution_ready: false,
    input_verification_ready: false,
    retry_gate_rerun_ready: false,
    public_surface_observation_ready: false,
    retry_gate_comment: 'Retry gate is blocked because operator input collection execution has missing operator inputs.'
  }));
}

function buildPayload(source) {
  const execution = source.public_surface_observation_operator_input_collection_execution;
  const items = buildRetryGateItems(source);

  return {
    operator_input_collection_retry_gate_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE::HBCE-L1-DECISION-PROOF-0001',
    operator_input_collection_retry_gate_key: 'hbce.level1.public_surface.observation_operator_input_collection_retry_gate.controlled_information.0001',
    source_public_surface_observation_operator_input_collection_execution_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_collection_execution_digest: execution.operator_input_collection_execution_payload_digest,
    operator_input_collection_retry_gate_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    operator_input_collection_retry_gate_status: 'BLOCKED_MISSING_OPERATOR_INPUTS',
    operator_input_collection_retry_gate_result: 'OPERATOR_INPUT_COLLECTION_RETRY_NOT_READY',
    operator_input_collection_retry_gate_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE',
    evaluated_at: '2027-01-19T18:15:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_operator_input_collection_execution_status: execution.operator_input_collection_execution_status,
    imported_operator_input_collection_execution_result: execution.operator_input_collection_execution_result,
    imported_operator_input_collection_execution_defined: execution.operator_input_collection_execution_defined,
    imported_operator_input_collection_execution_ready: execution.operator_input_collection_execution_ready,
    imported_operator_input_collection_execution_evaluated: execution.operator_input_collection_execution_evaluated,
    imported_operator_input_collection_execution_attempted: execution.operator_input_collection_execution_attempted,
    imported_operator_input_collection_execution_completed: execution.operator_input_collection_execution_completed,
    imported_operator_input_collection_execution_blocked_missing_operator_inputs: execution.operator_input_collection_execution_blocked_missing_operator_inputs,
    imported_operator_inputs_collected: execution.operator_inputs_collected,
    imported_operator_inputs_submitted: execution.operator_inputs_submitted,
    imported_operator_inputs_verified: execution.operator_inputs_verified,
    imported_submission_verification_rerun_ready: execution.submission_verification_rerun_ready,
    imported_remediation_execution_update_ready: execution.remediation_execution_update_ready,
    imported_input_collection_execution_ready: execution.input_collection_execution_ready,
    imported_input_verification_ready: execution.input_verification_ready,
    imported_retry_gate_rerun_ready: execution.retry_gate_rerun_ready,

    retry_gate_items: items,
    retry_gate_item_count: items.length,
    all_collection_execution_items_have_retry_gate_items: execution.collection_execution_items.every((item) =>
      items.some((gateItem) => gateItem.operator_input_collection_execution_item_id === item.operator_input_collection_execution_item_id)
    ),
    all_retry_gate_items_evaluated: items.every((item) => item.retry_gate_evaluated === true),
    all_retry_gate_items_blocked_missing_operator_inputs: items.every((item) => item.retry_gate_status === 'BLOCKED_MISSING_OPERATOR_INPUTS'),
    all_retry_gate_items_not_passed: items.every((item) => item.retry_gate_passed === false),
    all_retry_gate_items_retry_not_allowed: items.every((item) => item.retry_allowed === false),
    all_retry_gate_items_retry_not_ready: items.every((item) => item.retry_ready === false),
    all_retry_gate_items_retry_not_performed: items.every((item) => item.retry_performed === false),
    all_retry_gate_items_block_on_operator_inputs_collected: items.every((item) => item.blocking_criteria.includes('operator_inputs_collected')),
    all_retry_gate_items_block_on_operator_inputs_submitted: items.every((item) => item.blocking_criteria.includes('operator_inputs_submitted')),
    all_retry_gate_items_block_on_operator_inputs_verified: items.every((item) => item.blocking_criteria.includes('operator_inputs_verified')),
    all_retry_gate_items_block_on_collection_execution_completed: items.every((item) => item.blocking_criteria.includes('collection_execution_completed')),
    all_retry_gate_items_require_submitter_ref: items.every((item) => item.required_operator_inputs.includes('submitter_ref')),
    all_retry_gate_items_require_submitted_at: items.every((item) => item.required_operator_inputs.includes('submitted_at')),
    all_retry_gate_items_require_submission_channel: items.every((item) => item.required_operator_inputs.includes('submission_channel')),
    all_retry_gate_items_require_public_url: items.every((item) => item.required_operator_inputs.includes('public_url')),
    all_retry_gate_items_require_observer_ref: items.every((item) => item.required_operator_inputs.includes('observer_ref')),
    all_retry_gate_items_require_observed_content_digest: items.every((item) => item.required_operator_inputs.includes('observed_content_digest')),
    all_retry_gate_items_require_scope_match_result: items.every((item) => item.required_operator_inputs.includes('scope_match_result')),
    all_retry_gate_items_require_non_claims_presence_result: items.every((item) => item.required_operator_inputs.includes('non_claims_presence_result')),
    all_retry_gate_items_require_evidence_reference_presence_result: items.every((item) => item.required_operator_inputs.includes('evidence_reference_presence_result')),
    all_retry_gate_items_require_customer_data_absence_declaration: items.every((item) => item.required_operator_inputs.includes('customer_data_absence_declaration')),
    all_retry_gate_items_require_forbidden_claims_absence_declaration: items.every((item) => item.required_operator_inputs.includes('forbidden_claims_absence_declaration')),
    all_retry_gate_items_operator_inputs_not_collected: items.every((item) => item.operator_inputs_collected === false),
    all_retry_gate_items_operator_inputs_not_submitted: items.every((item) => item.operator_inputs_submitted === false),
    all_retry_gate_items_operator_inputs_not_verified: items.every((item) => item.operator_inputs_verified === false),
    all_retry_gate_items_collection_execution_not_completed: items.every((item) => item.collection_execution_completed === false),
    all_retry_gate_items_not_ready_for_submission_verification_rerun: items.every((item) => item.submission_verification_rerun_ready === false),
    all_retry_gate_items_not_ready_for_remediation_execution_update: items.every((item) => item.remediation_execution_update_ready === false),
    all_retry_gate_items_not_ready_for_input_collection_execution: items.every((item) => item.input_collection_execution_ready === false),
    all_retry_gate_items_not_ready_for_input_verification: items.every((item) => item.input_verification_ready === false),
    all_retry_gate_items_not_ready_for_retry_gate_rerun: items.every((item) => item.retry_gate_rerun_ready === false),

    operator_input_collection_retry_gate_defined: true,
    operator_input_collection_retry_gate_ready: true,
    operator_input_collection_retry_gate_evaluated: true,
    operator_input_collection_retry_gate_passed: false,
    operator_input_collection_retry_gate_blocked: true,
    operator_input_collection_retry_gate_blocked_missing_operator_inputs: true,
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

    operator_input_collection_retry_gate_controls: [
      'require_source_operator_input_collection_execution_hash_valid',
      'require_collection_execution_completed_before_retry',
      'require_operator_inputs_collected_before_retry',
      'require_operator_inputs_submitted_before_retry',
      'require_operator_inputs_verified_before_retry',
      'require_submitter_ref_before_retry',
      'require_submitted_at_before_retry',
      'require_submission_channel_before_retry',
      'require_public_url_before_retry',
      'require_observer_ref_before_retry',
      'require_observed_content_digest_before_retry',
      'require_scope_match_result_before_retry',
      'require_non_claims_presence_result_before_retry',
      'require_evidence_reference_presence_result_before_retry',
      'require_customer_data_absence_declaration_before_retry',
      'require_forbidden_claims_absence_declaration_before_retry',
      'do_not_allow_retry_with_missing_operator_inputs',
      'do_not_mark_collection_retry_ready_without_verified_inputs',
      'do_not_mark_submission_verification_rerun_ready_without_collected_inputs',
      'do_not_mark_input_verification_ready_without_operator_inputs',
      'do_not_infer_public_observation_from_retry_gate',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_missing_operator_inputs'
    ],

    operator_input_collection_retry_gate_boundary: {
      controlled_information_surface_only: true,
      retry_gate_evaluation_only: true,
      retry_gate_blocked_missing_operator_inputs: true,
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

    source_operator_input_collection_execution_ready: source.readiness_state.public_surface_observation_operator_input_collection_execution_ready === true,
    source_operator_input_collection_execution_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_execution_evaluated === true,
    source_operator_input_collection_execution_completed: source.readiness_state.public_surface_observation_operator_input_collection_execution_completed === true,
    source_operator_input_collection_execution_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_collection_execution_blocked_missing_operator_inputs === true,
    source_operator_input_collection_execution_ready_flag: source.readiness_state.operator_input_collection_execution_ready === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_operator_input_collection_retry_gate_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputCollectionRetryGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_collection_execution_hash_valid: validHash(source),
    source_operator_input_collection_execution_ready: source.readiness_state.public_surface_observation_operator_input_collection_execution_ready === true,
    source_operator_input_collection_execution_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_execution_evaluated === true,
    source_operator_input_collection_execution_completed: source.readiness_state.public_surface_observation_operator_input_collection_execution_completed === true,
    source_operator_input_collection_execution_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_collection_execution_blocked_missing_operator_inputs === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    operator_input_collection_retry_gate_defined: payload.operator_input_collection_retry_gate_defined,
    operator_input_collection_retry_gate_ready: payload.operator_input_collection_retry_gate_ready,
    operator_input_collection_retry_gate_evaluated: payload.operator_input_collection_retry_gate_evaluated,
    operator_input_collection_retry_gate_passed: payload.operator_input_collection_retry_gate_passed,
    operator_input_collection_retry_gate_blocked: payload.operator_input_collection_retry_gate_blocked,
    operator_input_collection_retry_gate_blocked_missing_operator_inputs: payload.operator_input_collection_retry_gate_blocked_missing_operator_inputs,
    all_collection_execution_items_have_retry_gate_items: payload.all_collection_execution_items_have_retry_gate_items,
    all_retry_gate_items_evaluated: payload.all_retry_gate_items_evaluated,
    all_retry_gate_items_blocked_missing_operator_inputs: payload.all_retry_gate_items_blocked_missing_operator_inputs,
    all_retry_gate_items_retry_not_allowed: payload.all_retry_gate_items_retry_not_allowed,
    all_retry_gate_items_retry_not_ready: payload.all_retry_gate_items_retry_not_ready,
    operator_input_collection_retry_allowed: payload.operator_input_collection_retry_allowed,
    operator_input_collection_retry_ready: payload.operator_input_collection_retry_ready,
    operator_inputs_collected: payload.operator_inputs_collected,
    operator_inputs_submitted: payload.operator_inputs_submitted,
    operator_inputs_verified: payload.operator_inputs_verified,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_operator_input_collection_retry_gate_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-115-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE-2027-PROG-115',
    issue_id: 'PROG-115',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-RETRY-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_collection_execution_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_collection_execution_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_collection_execution_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_collection_retry_gate_status: STATUS,

    inherited_public_surface_observation_operator_input_collection_execution: {
      operator_input_collection_execution_status: source.level1_public_surface_observation_operator_input_collection_execution_status,
      public_surface_observation_operator_input_collection_execution_ready: source.readiness_state.public_surface_observation_operator_input_collection_execution_ready,
      public_surface_observation_operator_input_collection_execution_evaluated: source.readiness_state.public_surface_observation_operator_input_collection_execution_evaluated,
      public_surface_observation_operator_input_collection_execution_attempted: source.readiness_state.public_surface_observation_operator_input_collection_execution_attempted,
      public_surface_observation_operator_input_collection_execution_completed: source.readiness_state.public_surface_observation_operator_input_collection_execution_completed,
      public_surface_observation_operator_input_collection_execution_blocked_missing_operator_inputs: source.readiness_state.public_surface_observation_operator_input_collection_execution_blocked_missing_operator_inputs,
      operator_input_collection_execution_ready: source.readiness_state.operator_input_collection_execution_ready,
      operator_input_collection_attempted: source.readiness_state.operator_input_collection_attempted,
      operator_input_collection_completed: source.readiness_state.operator_input_collection_completed,
      operator_input_submission_ready: source.readiness_state.operator_input_submission_ready,
      operator_input_submission_completed: source.readiness_state.operator_input_submission_completed,
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

    public_surface_observation_operator_input_collection_retry_gate: {
      ...payload,
      operator_input_collection_retry_gate_payload_digest: sha256Digest(payload),
      operator_input_collection_retry_gate_checklist: checklist,
      operator_input_collection_retry_gate_is_defined: true,
      operator_input_collection_retry_gate_is_ready: true,
      operator_input_collection_retry_gate_is_evaluated: true,
      operator_input_collection_retry_gate_is_blocked_missing_operator_inputs: true,
      operator_input_collection_retry_gate_is_not_passed: true,
      operator_input_collection_retry_gate_is_not_retry_allowed: true,
      operator_input_collection_retry_gate_is_not_retry_ready: true,
      operator_input_collection_retry_gate_is_not_retry_performed: true,
      operator_input_collection_retry_gate_is_not_operator_inputs_collected: true,
      operator_input_collection_retry_gate_is_not_operator_inputs_submitted: true,
      operator_input_collection_retry_gate_is_not_operator_inputs_verified: true,
      operator_input_collection_retry_gate_is_not_submission_verification_rerun: true,
      operator_input_collection_retry_gate_is_not_remediation_execution_update: true,
      operator_input_collection_retry_gate_is_not_input_collection_execution: true,
      operator_input_collection_retry_gate_is_not_input_verification: true,
      operator_input_collection_retry_gate_is_not_retry_gate_rerun: true,
      operator_input_collection_retry_gate_is_not_observation_evidence: true,
      operator_input_collection_retry_gate_is_not_public_observation_ready: true,
      operator_input_collection_retry_gate_is_not_external_customer_readiness: true,
      operator_input_collection_retry_gate_is_not_banking_pack_readiness: true,
      operator_input_collection_retry_gate_is_not_launch_readiness: true,
      operator_input_collection_retry_gate_is_not_production_readiness: true,
      operator_input_collection_retry_gate_is_not_legal_validity: true,
      operator_input_collection_retry_gate_is_not_security_certification: true,
      operator_input_collection_retry_gate_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_EXECUTION_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_EXECUTION_NOT_READY',
      'OPERATOR_INPUT_COLLECTION_RETRY_GATE_ITEM_MISSING',
      'OPERATOR_INPUT_COLLECTION_RETRY_BLOCKED_MISSING_OPERATOR_INPUTS',
      'OPERATOR_INPUTS_NOT_COLLECTED',
      'OPERATOR_INPUTS_NOT_SUBMITTED',
      'OPERATOR_INPUTS_NOT_VERIFIED',
      'COLLECTION_EXECUTION_NOT_COMPLETED',
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
      'AI_OPERATOR_INPUT_COLLECTION_RETRY_GATE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_collection_retry_gate_defined: true,
      public_surface_observation_operator_input_collection_retry_gate_ready: true,
      public_surface_observation_operator_input_collection_retry_gate_evaluated: true,
      public_surface_observation_operator_input_collection_retry_gate_passed: false,
      public_surface_observation_operator_input_collection_retry_gate_blocked: true,
      public_surface_observation_operator_input_collection_retry_gate_blocked_missing_operator_inputs: true,
      source_public_surface_observation_operator_input_collection_execution_bound: true,
      public_surface_observation_operator_input_collection_execution_ready: true,
      public_surface_observation_operator_input_collection_execution_evaluated: true,
      public_surface_observation_operator_input_collection_execution_completed: false,
      public_surface_observation_operator_input_collection_execution_blocked_missing_operator_inputs: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
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

    next_required_program: 'PROG-116-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-HUMAN-ACTION-REQUEST',

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

function writeLevel1PublicSurfaceObservationOperatorInputCollectionRetryGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputCollectionRetryGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-115-level1-public-surface-observation-operator-input-collection-retry-gate.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputCollectionRetryGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_115_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_COLLECTION_RETRY_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  requiredInputs,
  buildRetryGateItems,
  buildObservationOperatorInputCollectionRetryGatePayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputCollectionRetryGate,
  writeLevel1PublicSurfaceObservationOperatorInputCollectionRetryGate
};
