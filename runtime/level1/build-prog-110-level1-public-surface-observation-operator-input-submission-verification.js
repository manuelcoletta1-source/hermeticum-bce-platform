'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION_BLOCKED_INCOMPLETE_SUBMISSION';
const SOURCE_REF = 'docs/launch/level1/prog-109-level1-public-surface-observation-operator-input-submission.json';

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

function buildVerificationItems(source) {
  const submission = source.public_surface_observation_operator_input_submission;

  return submission.submission_items.map((item) => ({
    operator_input_submission_verification_item_id: item.operator_input_submission_item_id.replace('PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION::', 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION::'),
    operator_input_submission_item_id: item.operator_input_submission_item_id,
    execution_item_id: item.execution_item_id,
    remediation_item_id: item.remediation_item_id,
    retry_target_id: item.retry_target_id,
    verification_item_id: item.verification_item_id,
    collection_item_id: item.collection_item_id,
    input_target_id: item.input_target_id,
    observation_target_id: item.observation_target_id,
    surface_type: item.surface_type,
    source_operator_input_submission_ref: SOURCE_REF,
    verification_status: 'BLOCKED_INCOMPLETE_SUBMISSION',
    verification_required: true,
    source_submission_status: item.submission_status,
    submitter_ref_present: item.submitter_ref !== null,
    submitted_at_present: item.submitted_at !== null,
    submission_channel_present: item.submission_channel !== null,
    public_url_present: item.public_url !== null && item.public_url_submitted === true,
    observer_ref_present: item.observer_ref !== null && item.observer_ref_submitted === true,
    observed_content_digest_present: item.observed_content_digest !== null && item.observed_content_digest_submitted === true,
    scope_match_result_present: item.scope_match_result !== null && item.scope_match_result_submitted === true,
    non_claims_presence_result_present: item.non_claims_presence_result !== null && item.non_claims_presence_result_submitted === true,
    evidence_reference_presence_result_present: item.evidence_reference_presence_result !== null && item.evidence_reference_presence_result_submitted === true,
    customer_data_absence_declaration_present: item.customer_data_absence_declaration !== null && item.customer_data_absence_declared === true,
    forbidden_claims_absence_declaration_present: item.forbidden_claims_absence_declaration !== null && item.forbidden_claims_absence_declared === true,
    all_required_operator_inputs_submitted: item.all_required_operator_inputs_submitted === true,
    source_operator_input_submission_complete: item.operator_input_submission_complete === true,
    verification_performed: false,
    verification_passed: false,
    verification_failed: false,
    verification_blocked: true,
    remediation_execution_update_ready: false,
    input_collection_execution_ready: false,
    input_verification_ready: false,
    retry_gate_rerun_ready: false,
    verification_comment: 'Verification is blocked because the operator input submission is incomplete.'
  }));
}

function buildPayload(source) {
  const submission = source.public_surface_observation_operator_input_submission;
  const items = buildVerificationItems(source);

  return {
    operator_input_submission_verification_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION::HBCE-L1-DECISION-PROOF-0001',
    operator_input_submission_verification_key: 'hbce.level1.public_surface.observation_operator_input_submission_verification.controlled_information.0001',
    source_public_surface_observation_operator_input_submission_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_submission_digest: submission.operator_input_submission_payload_digest,
    operator_input_submission_verification_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    operator_input_submission_verification_status: 'BLOCKED_INCOMPLETE_OPERATOR_INPUT_SUBMISSION',
    operator_input_submission_verification_result: 'OPERATOR_INPUT_SUBMISSION_NOT_VERIFIED',
    operator_input_submission_verification_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION',
    evaluated_at: '2027-01-19T17:50:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_operator_input_submission_status: submission.operator_input_submission_status,
    imported_operator_input_submission_result: submission.operator_input_submission_result,
    imported_operator_input_submission_defined: submission.operator_input_submission_defined,
    imported_operator_input_submission_completed: submission.operator_input_submission_completed,
    imported_operator_inputs_submitted: submission.operator_inputs_submitted,
    imported_remediation_execution_update_ready: submission.remediation_execution_update_ready,
    imported_input_collection_execution_ready: submission.input_collection_execution_ready,
    imported_input_verification_ready: submission.input_verification_ready,
    imported_retry_gate_rerun_ready: submission.retry_gate_rerun_ready,

    verification_items: items,
    verification_item_count: items.length,
    all_submission_items_have_verification_items: submission.submission_items.every((item) =>
      items.some((verificationItem) => verificationItem.operator_input_submission_item_id === item.operator_input_submission_item_id)
    ),
    all_verification_items_blocked_incomplete_submission: items.every((item) => item.verification_status === 'BLOCKED_INCOMPLETE_SUBMISSION'),
    all_verification_items_without_submitter_ref: items.every((item) => item.submitter_ref_present === false),
    all_verification_items_without_submitted_at: items.every((item) => item.submitted_at_present === false),
    all_verification_items_without_submission_channel: items.every((item) => item.submission_channel_present === false),
    all_verification_items_without_public_url: items.every((item) => item.public_url_present === false),
    all_verification_items_without_observer_ref: items.every((item) => item.observer_ref_present === false),
    all_verification_items_without_observed_content_digest: items.every((item) => item.observed_content_digest_present === false),
    all_verification_items_without_scope_match_result: items.every((item) => item.scope_match_result_present === false),
    all_verification_items_without_non_claims_result: items.every((item) => item.non_claims_presence_result_present === false),
    all_verification_items_without_evidence_reference_result: items.every((item) => item.evidence_reference_presence_result_present === false),
    all_verification_items_without_customer_data_absence_declaration: items.every((item) => item.customer_data_absence_declaration_present === false),
    all_verification_items_without_forbidden_claims_absence_declaration: items.every((item) => item.forbidden_claims_absence_declaration_present === false),
    all_verification_items_not_performed: items.every((item) => item.verification_performed === false),
    all_verification_items_not_passed: items.every((item) => item.verification_passed === false),
    all_verification_items_blocked: items.every((item) => item.verification_blocked === true),

    operator_input_submission_verification_defined: true,
    operator_input_submission_verification_evaluated: true,
    operator_input_submission_verification_performed: false,
    operator_input_submission_verification_passed: false,
    operator_input_submission_verification_blocked: true,
    operator_input_submission_incomplete: true,
    operator_inputs_submitted: false,
    operator_inputs_verified: false,
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

    operator_input_submission_verification_controls: [
      'require_source_operator_input_submission_hash_valid',
      'require_complete_operator_input_submission_before_verification',
      'require_submitter_ref_before_verification',
      'require_submitted_at_before_verification',
      'require_public_url_before_verification',
      'require_observer_ref_before_verification',
      'require_observed_content_digest_before_verification',
      'require_scope_match_result_before_verification',
      'require_non_claims_presence_result_before_verification',
      'require_evidence_reference_presence_result_before_verification',
      'require_customer_data_absence_declaration_before_verification',
      'require_forbidden_claims_absence_declaration_before_verification',
      'do_not_verify_incomplete_operator_input_submission',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_mark_remediation_execution_update_ready_without_verified_inputs',
      'do_not_mark_input_collection_execution_ready_without_verified_inputs',
      'do_not_mark_input_verification_ready_without_collection_execution',
      'do_not_rerun_retry_gate_without_input_verification_pass',
      'do_not_infer_public_observation_from_operator_input_submission_verification',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_incomplete_operator_input_submission'
    ],

    operator_input_submission_verification_boundary: {
      controlled_information_surface_only: true,
      verification_evaluation_only: true,
      verification_blocked: true,
      incomplete_submission: true,
      no_operator_inputs_verified: true,
      no_remediation_execution_update_recorded: true,
      no_input_collection_execution_recorded: true,
      no_input_verification_recorded: true,
      no_retry_gate_rerun_recorded: true,
      no_public_observation_recorded: true,
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

    source_operator_input_submission_ready: source.readiness_state.public_surface_observation_operator_input_submission_ready === true,
    source_operator_input_submission_completed: source.readiness_state.public_surface_observation_operator_input_submission_completed === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    source_operator_inputs_collected: source.readiness_state.operator_inputs_collected === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_operator_input_submission_verification_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputSubmissionVerification(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_submission_hash_valid: validHash(source),
    source_operator_input_submission_ready: source.readiness_state.public_surface_observation_operator_input_submission_ready === true,
    source_operator_input_submission_completed: source.readiness_state.public_surface_observation_operator_input_submission_completed === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    operator_input_submission_verification_defined: payload.operator_input_submission_verification_defined,
    operator_input_submission_verification_evaluated: payload.operator_input_submission_verification_evaluated,
    operator_input_submission_verification_performed: payload.operator_input_submission_verification_performed,
    operator_input_submission_verification_passed: payload.operator_input_submission_verification_passed,
    operator_input_submission_verification_blocked: payload.operator_input_submission_verification_blocked,
    all_submission_items_have_verification_items: payload.all_submission_items_have_verification_items,
    all_verification_items_blocked_incomplete_submission: payload.all_verification_items_blocked_incomplete_submission,
    all_verification_items_not_performed: payload.all_verification_items_not_performed,
    all_verification_items_not_passed: payload.all_verification_items_not_passed,
    operator_inputs_verified: payload.operator_inputs_verified,
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
    ai_authority_absence_confirmed: payload.ai_operator_input_submission_verification_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-110-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION-2027-PROG-110',
    issue_id: 'PROG-110',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_submission_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_submission_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_submission_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_submission_verification_status: STATUS,

    inherited_public_surface_observation_operator_input_submission: {
      operator_input_submission_status: source.level1_public_surface_observation_operator_input_submission_status,
      public_surface_observation_operator_input_submission_ready: source.readiness_state.public_surface_observation_operator_input_submission_ready,
      public_surface_observation_operator_input_submission_completed: source.readiness_state.public_surface_observation_operator_input_submission_completed,
      operator_inputs_submitted: source.readiness_state.operator_inputs_submitted,
      operator_inputs_collected: source.readiness_state.operator_inputs_collected,
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

    public_surface_observation_operator_input_submission_verification: {
      ...payload,
      operator_input_submission_verification_payload_digest: sha256Digest(payload),
      operator_input_submission_verification_checklist: checklist,
      operator_input_submission_verification_is_defined: true,
      operator_input_submission_verification_is_evaluated: true,
      operator_input_submission_verification_is_blocked_incomplete_submission: true,
      operator_input_submission_verification_is_not_performed: true,
      operator_input_submission_verification_is_not_passed: true,
      operator_input_submission_verification_is_not_operator_inputs_verified: true,
      operator_input_submission_verification_is_not_remediation_execution_update: true,
      operator_input_submission_verification_is_not_input_collection_execution: true,
      operator_input_submission_verification_is_not_input_verification: true,
      operator_input_submission_verification_is_not_retry_gate_rerun: true,
      operator_input_submission_verification_is_not_observation_evidence: true,
      operator_input_submission_verification_is_not_public_observation_ready: true,
      operator_input_submission_verification_is_not_external_customer_readiness: true,
      operator_input_submission_verification_is_not_banking_pack_readiness: true,
      operator_input_submission_verification_is_not_launch_readiness: true,
      operator_input_submission_verification_is_not_production_readiness: true,
      operator_input_submission_verification_is_not_legal_validity: true,
      operator_input_submission_verification_is_not_security_certification: true,
      operator_input_submission_verification_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_NOT_READY',
      'OPERATOR_INPUT_SUBMISSION_NOT_COMPLETED',
      'OPERATOR_INPUT_VERIFICATION_ITEM_MISSING',
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
      'OPERATOR_INPUT_SUBMISSION_VERIFICATION_NOT_PERFORMED',
      'OPERATOR_INPUT_SUBMISSION_VERIFICATION_NOT_PASSED',
      'OPERATOR_INPUTS_NOT_VERIFIED',
      'REMEDIATION_EXECUTION_UPDATE_NOT_READY',
      'INPUT_COLLECTION_EXECUTION_NOT_READY',
      'INPUT_VERIFICATION_NOT_READY',
      'RETRY_GATE_RERUN_NOT_READY',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_OPERATOR_INPUT_SUBMISSION_VERIFICATION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_submission_verification_defined: true,
      public_surface_observation_operator_input_submission_verification_ready: true,
      public_surface_observation_operator_input_submission_verification_evaluated: true,
      public_surface_observation_operator_input_submission_verification_performed: false,
      public_surface_observation_operator_input_submission_verification_passed: false,
      public_surface_observation_operator_input_submission_verification_blocked: true,
      source_public_surface_observation_operator_input_submission_bound: true,
      public_surface_observation_operator_input_submission_ready: true,
      public_surface_observation_operator_input_submission_completed: false,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      operator_input_submission_incomplete: true,
      operator_inputs_submitted: false,
      operator_inputs_collected: false,
      operator_inputs_verified: false,
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

    next_required_program: 'PROG-111-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
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

function writeLevel1PublicSurfaceObservationOperatorInputSubmissionVerification(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputSubmissionVerification({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-110-level1-public-surface-observation-operator-input-submission-verification.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputSubmissionVerification(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_110_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildVerificationItems,
  buildObservationOperatorInputSubmissionVerificationPayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputSubmissionVerification,
  writeLevel1PublicSurfaceObservationOperatorInputSubmissionVerification
};
