'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_EXECUTION_BLOCKED_MISSING_OPERATOR_INPUTS';
const SOURCE_REF = 'docs/launch/level1/prog-111-level1-public-surface-observation-operator-input-submission-remediation.json';

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

function buildExecutionItems(source) {
  const remediation = source.public_surface_observation_operator_input_submission_remediation;

  return remediation.remediation_items.map((item) => ({
    operator_input_submission_remediation_execution_item_id: item.operator_input_submission_remediation_item_id.replace(
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION::',
      'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION::'
    ),
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
    source_operator_input_submission_remediation_ref: SOURCE_REF,
    execution_status: 'BLOCKED_MISSING_OPERATOR_INPUTS',
    execution_required: true,
    source_remediation_status: item.remediation_status,
    missing_operator_inputs: item.missing_operator_inputs.slice(),
    required_execution_actions: item.remediation_actions.slice(),
    operator_inputs_required: true,
    operator_inputs_present: false,
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
    remediation_execution_attempted: false,
    remediation_execution_completed: false,
    operator_inputs_collected: false,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
    submission_verification_rerun_ready: false,
    submission_verification_rerun_completed: false,
    submission_verification_rerun_passed: false,
    ready_for_remediation_execution_update: false,
    ready_for_input_collection_execution: false,
    ready_for_input_verification: false,
    ready_for_retry_gate_rerun: false,
    remediation_execution_comment: 'Execution is blocked because required operator inputs are missing.'
  }));
}

function buildPayload(source) {
  const remediation = source.public_surface_observation_operator_input_submission_remediation;
  const items = buildExecutionItems(source);

  return {
    operator_input_submission_remediation_execution_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION::HBCE-L1-DECISION-PROOF-0001',
    operator_input_submission_remediation_execution_key: 'hbce.level1.public_surface.observation_operator_input_submission_remediation_execution.controlled_information.0001',
    source_public_surface_observation_operator_input_submission_remediation_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_submission_remediation_digest: remediation.operator_input_submission_remediation_payload_digest,
    operator_input_submission_remediation_execution_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    operator_input_submission_remediation_execution_status: 'BLOCKED_MISSING_OPERATOR_INPUTS',
    operator_input_submission_remediation_execution_result: 'OPERATOR_INPUT_REMEDIATION_EXECUTION_NOT_COMPLETED',
    operator_input_submission_remediation_execution_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_EXECUTION',
    evaluated_at: '2027-01-19T18:00:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_operator_input_submission_remediation_status: remediation.operator_input_submission_remediation_status,
    imported_operator_input_submission_remediation_result: remediation.operator_input_submission_remediation_result,
    imported_operator_input_submission_remediation_defined: remediation.operator_input_submission_remediation_defined,
    imported_operator_input_submission_remediation_completed: remediation.operator_input_submission_remediation_completed,
    imported_operator_input_collection_ready: remediation.operator_input_collection_ready,
    imported_operator_inputs_collected: remediation.operator_inputs_collected,
    imported_operator_inputs_submitted: remediation.operator_inputs_submitted,
    imported_operator_inputs_verified: remediation.operator_inputs_verified,
    imported_submission_verification_rerun_ready: remediation.submission_verification_rerun_ready,
    imported_remediation_execution_update_ready: remediation.remediation_execution_update_ready,
    imported_input_collection_execution_ready: remediation.input_collection_execution_ready,
    imported_input_verification_ready: remediation.input_verification_ready,
    imported_retry_gate_rerun_ready: remediation.retry_gate_rerun_ready,

    execution_items: items,
    execution_item_count: items.length,
    all_remediation_items_have_execution_items: remediation.remediation_items.every((item) =>
      items.some((executionItem) => executionItem.operator_input_submission_remediation_item_id === item.operator_input_submission_remediation_item_id)
    ),
    all_execution_items_blocked_missing_operator_inputs: items.every((item) => item.execution_status === 'BLOCKED_MISSING_OPERATOR_INPUTS'),
    all_execution_items_without_submitter_ref: items.every((item) => item.submitter_ref === null && item.submitter_ref_collected === false),
    all_execution_items_without_submitted_at: items.every((item) => item.submitted_at === null && item.submitted_at_collected === false),
    all_execution_items_without_submission_channel: items.every((item) => item.submission_channel === null && item.submission_channel_collected === false),
    all_execution_items_without_public_url: items.every((item) => item.public_url === null && item.public_url_collected === false),
    all_execution_items_without_observer_ref: items.every((item) => item.observer_ref === null && item.observer_ref_collected === false),
    all_execution_items_without_observed_content_digest: items.every((item) => item.observed_content_digest === null && item.observed_content_digest_collected === false),
    all_execution_items_without_scope_match_result: items.every((item) => item.scope_match_result === null && item.scope_match_result_collected === false),
    all_execution_items_without_non_claims_result: items.every((item) => item.non_claims_presence_result === null && item.non_claims_presence_result_collected === false),
    all_execution_items_without_evidence_reference_result: items.every((item) => item.evidence_reference_presence_result === null && item.evidence_reference_presence_result_collected === false),
    all_execution_items_without_customer_data_absence_declaration: items.every((item) => item.customer_data_absence_declaration === null && item.customer_data_absence_declaration_collected === false),
    all_execution_items_without_forbidden_claims_absence_declaration: items.every((item) => item.forbidden_claims_absence_declaration === null && item.forbidden_claims_absence_declaration_collected === false),
    all_execution_items_not_attempted: items.every((item) => item.remediation_execution_attempted === false),
    all_execution_items_not_completed: items.every((item) => item.remediation_execution_completed === false),
    all_execution_items_not_ready_for_submission_verification_rerun: items.every((item) => item.submission_verification_rerun_ready === false),
    all_execution_items_not_ready_for_remediation_execution_update: items.every((item) => item.ready_for_remediation_execution_update === false),
    all_execution_items_not_ready_for_input_collection_execution: items.every((item) => item.ready_for_input_collection_execution === false),
    all_execution_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_execution_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),

    operator_input_submission_remediation_execution_defined: true,
    operator_input_submission_remediation_execution_evaluated: true,
    operator_input_submission_remediation_execution_attempted: false,
    operator_input_submission_remediation_execution_completed: false,
    operator_input_submission_remediation_execution_blocked_missing_operator_inputs: true,
    operator_input_collection_ready: true,
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

    operator_input_submission_remediation_execution_controls: [
      'require_source_operator_input_submission_remediation_hash_valid',
      'require_submitter_ref_before_remediation_execution',
      'require_submitted_at_before_remediation_execution',
      'require_submission_channel_before_remediation_execution',
      'require_public_url_before_remediation_execution',
      'require_observer_ref_before_remediation_execution',
      'require_observed_content_digest_before_remediation_execution',
      'require_scope_match_result_before_remediation_execution',
      'require_non_claims_presence_result_before_remediation_execution',
      'require_evidence_reference_presence_result_before_remediation_execution',
      'require_customer_data_absence_declaration_before_remediation_execution',
      'require_forbidden_claims_absence_declaration_before_remediation_execution',
      'do_not_execute_remediation_without_operator_inputs',
      'do_not_mark_operator_inputs_collected_without_complete_inputs',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_mark_submission_verification_rerun_ready_without_collected_inputs',
      'do_not_mark_remediation_execution_update_ready_without_verified_inputs',
      'do_not_mark_input_collection_execution_ready_without_verified_inputs',
      'do_not_rerun_retry_gate_without_input_verification_pass',
      'do_not_infer_public_observation_from_remediation_execution',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_missing_operator_inputs'
    ],

    operator_input_submission_remediation_execution_boundary: {
      controlled_information_surface_only: true,
      remediation_execution_evaluation_only: true,
      remediation_execution_blocked_missing_operator_inputs: true,
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

    source_operator_input_submission_remediation_ready: source.readiness_state.public_surface_observation_operator_input_submission_remediation_ready === true,
    source_operator_input_submission_remediation_completed: source.readiness_state.public_surface_observation_operator_input_submission_remediation_completed === true,
    source_operator_input_collection_ready: source.readiness_state.operator_input_collection_ready === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_operator_input_submission_remediation_execution_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediationExecution(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_submission_remediation_hash_valid: validHash(source),
    source_operator_input_submission_remediation_ready: source.readiness_state.public_surface_observation_operator_input_submission_remediation_ready === true,
    source_operator_input_submission_remediation_completed: source.readiness_state.public_surface_observation_operator_input_submission_remediation_completed === true,
    source_operator_input_collection_ready: source.readiness_state.operator_input_collection_ready === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    operator_input_submission_remediation_execution_defined: payload.operator_input_submission_remediation_execution_defined,
    operator_input_submission_remediation_execution_evaluated: payload.operator_input_submission_remediation_execution_evaluated,
    operator_input_submission_remediation_execution_attempted: payload.operator_input_submission_remediation_execution_attempted,
    operator_input_submission_remediation_execution_completed: payload.operator_input_submission_remediation_execution_completed,
    operator_input_submission_remediation_execution_blocked_missing_operator_inputs: payload.operator_input_submission_remediation_execution_blocked_missing_operator_inputs,
    all_remediation_items_have_execution_items: payload.all_remediation_items_have_execution_items,
    all_execution_items_blocked_missing_operator_inputs: payload.all_execution_items_blocked_missing_operator_inputs,
    all_execution_items_not_attempted: payload.all_execution_items_not_attempted,
    all_execution_items_not_completed: payload.all_execution_items_not_completed,
    operator_inputs_collected: payload.operator_inputs_collected,
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
    ai_authority_absence_confirmed: payload.ai_operator_input_submission_remediation_execution_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-112-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_EXECUTION',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION-2027-PROG-112',
    issue_id: 'PROG-112',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_submission_remediation_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_submission_remediation_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_submission_remediation_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_submission_remediation_execution_status: STATUS,

    inherited_public_surface_observation_operator_input_submission_remediation: {
      operator_input_submission_remediation_status: source.level1_public_surface_observation_operator_input_submission_remediation_status,
      public_surface_observation_operator_input_submission_remediation_ready: source.readiness_state.public_surface_observation_operator_input_submission_remediation_ready,
      public_surface_observation_operator_input_submission_remediation_completed: source.readiness_state.public_surface_observation_operator_input_submission_remediation_completed,
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

    public_surface_observation_operator_input_submission_remediation_execution: {
      ...payload,
      operator_input_submission_remediation_execution_payload_digest: sha256Digest(payload),
      operator_input_submission_remediation_execution_checklist: checklist,
      operator_input_submission_remediation_execution_is_defined: true,
      operator_input_submission_remediation_execution_is_evaluated: true,
      operator_input_submission_remediation_execution_is_blocked_missing_operator_inputs: true,
      operator_input_submission_remediation_execution_is_not_attempted: true,
      operator_input_submission_remediation_execution_is_not_completed: true,
      operator_input_submission_remediation_execution_is_not_operator_inputs_collected: true,
      operator_input_submission_remediation_execution_is_not_operator_inputs_verified: true,
      operator_input_submission_remediation_execution_is_not_submission_verification_rerun: true,
      operator_input_submission_remediation_execution_is_not_remediation_execution_update: true,
      operator_input_submission_remediation_execution_is_not_input_collection_execution: true,
      operator_input_submission_remediation_execution_is_not_input_verification: true,
      operator_input_submission_remediation_execution_is_not_retry_gate_rerun: true,
      operator_input_submission_remediation_execution_is_not_observation_evidence: true,
      operator_input_submission_remediation_execution_is_not_public_observation_ready: true,
      operator_input_submission_remediation_execution_is_not_external_customer_readiness: true,
      operator_input_submission_remediation_execution_is_not_banking_pack_readiness: true,
      operator_input_submission_remediation_execution_is_not_launch_readiness: true,
      operator_input_submission_remediation_execution_is_not_production_readiness: true,
      operator_input_submission_remediation_execution_is_not_legal_validity: true,
      operator_input_submission_remediation_execution_is_not_security_certification: true,
      operator_input_submission_remediation_execution_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_EXECUTION_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_NOT_READY',
      'OPERATOR_INPUT_REMEDIATION_EXECUTION_ITEM_MISSING',
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
      'OPERATOR_INPUT_REMEDIATION_EXECUTION_BLOCKED',
      'OPERATOR_INPUTS_NOT_COLLECTED',
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
      'AI_OPERATOR_INPUT_SUBMISSION_REMEDIATION_EXECUTION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_submission_remediation_execution_defined: true,
      public_surface_observation_operator_input_submission_remediation_execution_ready: true,
      public_surface_observation_operator_input_submission_remediation_execution_evaluated: true,
      public_surface_observation_operator_input_submission_remediation_execution_attempted: false,
      public_surface_observation_operator_input_submission_remediation_execution_completed: false,
      public_surface_observation_operator_input_submission_remediation_execution_blocked_missing_operator_inputs: true,
      source_public_surface_observation_operator_input_submission_remediation_bound: true,
      public_surface_observation_operator_input_submission_remediation_ready: true,
      public_surface_observation_operator_input_submission_remediation_completed: false,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      operator_input_collection_ready: true,
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

    next_required_program: 'PROG-113-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-COLLECTION-PACK',

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

function writeLevel1PublicSurfaceObservationOperatorInputSubmissionRemediationExecution(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediationExecution({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-112-level1-public-surface-observation-operator-input-submission-remediation-execution.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputSubmissionRemediationExecution(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_112_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_EXECUTION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildExecutionItems,
  buildObservationOperatorInputSubmissionRemediationExecutionPayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediationExecution,
  writeLevel1PublicSurfaceObservationOperatorInputSubmissionRemediationExecution
};
