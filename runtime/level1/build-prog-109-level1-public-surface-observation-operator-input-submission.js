'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_DEFINED_PENDING_INPUTS';
const SOURCE_REF = 'docs/launch/level1/prog-108-level1-public-surface-observation-remediation-execution.json';

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

function buildSubmissionItems(source) {
  const execution = source.public_surface_observation_remediation_execution;

  return execution.execution_items.map((item) => ({
    operator_input_submission_item_id: item.execution_item_id.replace('PUBLIC-SURFACE-OBSERVATION-REMEDIATION-EXECUTION::', 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION::'),
    execution_item_id: item.execution_item_id,
    remediation_item_id: item.remediation_item_id,
    retry_target_id: item.retry_target_id,
    verification_item_id: item.verification_item_id,
    collection_item_id: item.collection_item_id,
    input_target_id: item.input_target_id,
    observation_target_id: item.observation_target_id,
    surface_type: item.surface_type,
    source_remediation_execution_ref: SOURCE_REF,
    submission_status: 'PENDING_OPERATOR_INPUTS',
    submission_required: true,
    required_operator_inputs: [
      'public_url',
      'observer_ref',
      'observed_content_digest',
      'scope_match_result',
      'non_claims_presence_result',
      'evidence_reference_presence_result',
      'customer_data_absence_declaration',
      'forbidden_claims_absence_declaration'
    ],
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
    public_url_submitted: false,
    observer_ref_submitted: false,
    observed_content_digest_submitted: false,
    scope_match_result_submitted: false,
    non_claims_presence_result_submitted: false,
    evidence_reference_presence_result_submitted: false,
    customer_data_absence_declared: false,
    forbidden_claims_absence_declared: false,
    all_required_operator_inputs_submitted: false,
    operator_input_submission_complete: false,
    ready_for_remediation_execution_update: false,
    ready_for_input_collection_execution: false,
    ready_for_input_verification: false,
    ready_for_retry_gate_rerun: false
  }));
}

function buildPayload(source) {
  const execution = source.public_surface_observation_remediation_execution;
  const items = buildSubmissionItems(source);

  return {
    operator_input_submission_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION::HBCE-L1-DECISION-PROOF-0001',
    operator_input_submission_key: 'hbce.level1.public_surface.observation_operator_input_submission.controlled_information.0001',
    source_public_surface_observation_remediation_execution_ref: SOURCE_REF,
    source_public_surface_observation_remediation_execution_digest: execution.public_surface_observation_remediation_execution_payload_digest,
    operator_input_submission_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    operator_input_submission_status: 'DEFINED_PENDING_OPERATOR_INPUTS',
    operator_input_submission_result: 'OPERATOR_INPUTS_NOT_SUBMITTED',
    operator_input_submission_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION',
    defined_at: '2027-01-19T17:45:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_remediation_execution_status: execution.remediation_execution_status,
    imported_remediation_execution_result: execution.remediation_execution_result,
    imported_remediation_execution_evaluated: execution.remediation_execution_evaluated,
    imported_remediation_execution_attempted: execution.remediation_execution_attempted,
    imported_remediation_execution_completed: execution.remediation_execution_completed,
    imported_operator_inputs_collected: execution.operator_inputs_collected,
    imported_input_verification_remediation_ready: execution.input_verification_remediation_ready,
    imported_retry_gate_rerun_ready: execution.retry_gate_rerun_ready,

    submission_items: items,
    submission_item_count: items.length,
    all_execution_items_have_submission_items: execution.execution_items.every((item) =>
      items.some((submissionItem) => submissionItem.execution_item_id === item.execution_item_id)
    ),
    all_submission_items_pending: items.every((item) => item.submission_status === 'PENDING_OPERATOR_INPUTS'),
    all_submission_items_without_submitter_ref: items.every((item) => item.submitter_ref === null),
    all_submission_items_without_submitted_at: items.every((item) => item.submitted_at === null),
    all_submission_items_without_public_url: items.every((item) => item.public_url === null && item.public_url_submitted === false),
    all_submission_items_without_observer_ref: items.every((item) => item.observer_ref === null && item.observer_ref_submitted === false),
    all_submission_items_without_observed_content_digest: items.every((item) => item.observed_content_digest === null && item.observed_content_digest_submitted === false),
    all_submission_items_without_scope_match_result: items.every((item) => item.scope_match_result === null && item.scope_match_result_submitted === false),
    all_submission_items_without_non_claims_result: items.every((item) => item.non_claims_presence_result === null && item.non_claims_presence_result_submitted === false),
    all_submission_items_without_evidence_reference_result: items.every((item) => item.evidence_reference_presence_result === null && item.evidence_reference_presence_result_submitted === false),
    all_submission_items_without_customer_data_absence_declaration: items.every((item) => item.customer_data_absence_declaration === null && item.customer_data_absence_declared === false),
    all_submission_items_without_forbidden_claims_absence_declaration: items.every((item) => item.forbidden_claims_absence_declaration === null && item.forbidden_claims_absence_declared === false),
    all_submission_items_not_complete: items.every((item) => item.operator_input_submission_complete === false),
    all_submission_items_not_ready_for_remediation_execution_update: items.every((item) => item.ready_for_remediation_execution_update === false),
    all_submission_items_not_ready_for_input_collection_execution: items.every((item) => item.ready_for_input_collection_execution === false),
    all_submission_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_submission_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),

    operator_input_submission_defined: true,
    operator_input_submission_artifact_ready: true,
    operator_inputs_submitted: false,
    operator_input_submission_completed: false,
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

    operator_input_submission_controls: [
      'require_submitter_ref_before_submission_complete',
      'require_submitted_at_before_submission_complete',
      'require_public_url_before_submission_complete',
      'require_observer_ref_before_submission_complete',
      'require_observed_content_digest_before_submission_complete',
      'require_scope_match_result_before_submission_complete',
      'require_non_claims_presence_result_before_submission_complete',
      'require_evidence_reference_presence_result_before_submission_complete',
      'require_customer_data_absence_declaration_before_submission_complete',
      'require_forbidden_claims_absence_declaration_before_submission_complete',
      'do_not_mark_operator_inputs_submitted_without_required_inputs',
      'do_not_mark_remediation_execution_update_ready_without_complete_submission',
      'do_not_mark_input_collection_execution_ready_without_complete_submission',
      'do_not_mark_input_verification_ready_without_collection_execution',
      'do_not_rerun_retry_gate_without_input_verification_pass',
      'do_not_infer_public_observation_from_operator_input_submission_schema',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_missing_operator_inputs'
    ],

    operator_input_submission_boundary: {
      controlled_information_surface_only: true,
      submission_schema_definition_only: true,
      operator_inputs_pending: true,
      no_operator_inputs_recorded: true,
      no_remediation_execution_update_recorded: true,
      no_input_collection_execution_recorded: true,
      no_input_verification_recorded: true,
      no_retry_gate_rerun_recorded: true,
      no_public_observation_recorded: true,
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

    source_public_surface_observation_remediation_execution_ready: source.readiness_state.public_surface_observation_remediation_execution_ready === true,
    source_remediation_execution_evaluated: source.readiness_state.public_surface_observation_remediation_execution_evaluated === true,
    source_remediation_execution_completed: source.readiness_state.public_surface_observation_remediation_execution_completed === true,
    source_remediation_execution_blocked_missing_operator_inputs: source.readiness_state.remediation_execution_blocked_missing_operator_inputs === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_operator_input_submission_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputSubmission(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_remediation_execution_hash_valid: validHash(source),
    source_public_surface_observation_remediation_execution_ready: source.readiness_state.public_surface_observation_remediation_execution_ready === true,
    source_public_surface_observation_remediation_execution_evaluated: source.readiness_state.public_surface_observation_remediation_execution_evaluated === true,
    source_remediation_execution_blocked_missing_operator_inputs: source.readiness_state.remediation_execution_blocked_missing_operator_inputs === true,
    operator_input_submission_defined: payload.operator_input_submission_defined,
    operator_inputs_submitted: payload.operator_inputs_submitted,
    operator_input_submission_completed: payload.operator_input_submission_completed,
    all_execution_items_have_submission_items: payload.all_execution_items_have_submission_items,
    all_submission_items_pending: payload.all_submission_items_pending,
    all_submission_items_without_public_url: payload.all_submission_items_without_public_url,
    all_submission_items_without_observer_ref: payload.all_submission_items_without_observer_ref,
    all_submission_items_without_observed_content_digest: payload.all_submission_items_without_observed_content_digest,
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
    ai_authority_absence_confirmed: payload.ai_operator_input_submission_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-109-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-2027-PROG-109',
    issue_id: 'PROG-109',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_remediation_execution_ref: SOURCE_REF,
    source_public_surface_observation_remediation_execution_revision_hash: source.revision_hash,
    source_public_surface_observation_remediation_execution_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_submission_status: STATUS,

    inherited_public_surface_observation_remediation_execution: {
      remediation_execution_status: source.level1_public_surface_observation_remediation_execution_status,
      public_surface_observation_remediation_execution_ready: source.readiness_state.public_surface_observation_remediation_execution_ready,
      public_surface_observation_remediation_execution_evaluated: source.readiness_state.public_surface_observation_remediation_execution_evaluated,
      public_surface_observation_remediation_execution_completed: source.readiness_state.public_surface_observation_remediation_execution_completed,
      remediation_execution_blocked_missing_operator_inputs: source.readiness_state.remediation_execution_blocked_missing_operator_inputs,
      operator_inputs_collected: source.readiness_state.operator_inputs_collected,
      input_verification_remediation_ready: source.readiness_state.input_verification_remediation_ready,
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

    public_surface_observation_operator_input_submission: {
      ...payload,
      operator_input_submission_payload_digest: sha256Digest(payload),
      operator_input_submission_checklist: checklist,
      operator_input_submission_is_defined: true,
      operator_input_submission_is_pending_inputs: true,
      operator_input_submission_is_not_completed: true,
      operator_input_submission_is_not_remediation_execution_update: true,
      operator_input_submission_is_not_input_collection_execution: true,
      operator_input_submission_is_not_input_verification: true,
      operator_input_submission_is_not_retry_gate_rerun: true,
      operator_input_submission_is_not_observation_evidence: true,
      operator_input_submission_is_not_public_observation_ready: true,
      operator_input_submission_is_not_external_customer_readiness: true,
      operator_input_submission_is_not_banking_pack_readiness: true,
      operator_input_submission_is_not_launch_readiness: true,
      operator_input_submission_is_not_production_readiness: true,
      operator_input_submission_is_not_legal_validity: true,
      operator_input_submission_is_not_security_certification: true,
      operator_input_submission_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_EXECUTION_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_REMEDIATION_EXECUTION_NOT_READY',
      'OPERATOR_INPUT_SUBMISSION_ITEM_MISSING',
      'SUBMITTER_REF_MISSING',
      'SUBMITTED_AT_MISSING',
      'PUBLIC_URL_MISSING',
      'OBSERVER_REF_MISSING',
      'OBSERVED_CONTENT_DIGEST_MISSING',
      'SCOPE_MATCH_RESULT_MISSING',
      'NON_CLAIMS_RESULT_MISSING',
      'EVIDENCE_REFERENCE_RESULT_MISSING',
      'CUSTOMER_DATA_ABSENCE_DECLARATION_MISSING',
      'FORBIDDEN_CLAIMS_ABSENCE_DECLARATION_MISSING',
      'OPERATOR_INPUT_SUBMISSION_NOT_COMPLETED',
      'REMEDIATION_EXECUTION_UPDATE_NOT_READY',
      'INPUT_COLLECTION_EXECUTION_NOT_READY',
      'INPUT_VERIFICATION_NOT_READY',
      'RETRY_GATE_RERUN_NOT_READY',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_OPERATOR_INPUT_SUBMISSION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_submission_defined: true,
      public_surface_observation_operator_input_submission_ready: true,
      public_surface_observation_operator_input_submission_completed: false,
      source_public_surface_observation_remediation_execution_bound: true,
      public_surface_observation_remediation_execution_ready: true,
      public_surface_observation_remediation_execution_evaluated: true,
      remediation_execution_blocked_missing_operator_inputs: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      operator_inputs_submitted: false,
      operator_inputs_collected: false,
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

    next_required_program: 'PROG-110-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      operator_inputs_submitted: false,
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

function writeLevel1PublicSurfaceObservationOperatorInputSubmission(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputSubmission({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-109-level1-public-surface-observation-operator-input-submission.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputSubmission(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_109_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildSubmissionItems,
  buildObservationOperatorInputSubmissionPayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputSubmission,
  writeLevel1PublicSurfaceObservationOperatorInputSubmission
};
