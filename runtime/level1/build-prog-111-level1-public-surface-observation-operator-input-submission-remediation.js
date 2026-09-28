'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_DEFINED_PENDING_INPUTS';
const SOURCE_REF = 'docs/launch/level1/prog-110-level1-public-surface-observation-operator-input-submission-verification.json';

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

function buildRemediationItems(source) {
  const verification = source.public_surface_observation_operator_input_submission_verification;

  return verification.verification_items.map((item) => ({
    operator_input_submission_remediation_item_id: item.operator_input_submission_verification_item_id.replace('PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-VERIFICATION::', 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION::'),
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
    source_operator_input_submission_verification_ref: SOURCE_REF,
    remediation_status: 'PENDING_OPERATOR_INPUT_REMEDIATION',
    remediation_required: true,
    source_verification_status: item.verification_status,
    missing_operator_inputs: [
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
    ],
    remediation_actions: [
      'collect_submitter_ref',
      'collect_submitted_at',
      'collect_submission_channel',
      'collect_public_url',
      'collect_observer_ref',
      'collect_observed_content_digest',
      'collect_scope_match_result',
      'collect_non_claims_presence_result',
      'collect_evidence_reference_presence_result',
      'collect_customer_data_absence_declaration',
      'collect_forbidden_claims_absence_declaration',
      'rerun_operator_input_submission_verification'
    ],
    submitter_ref_required: true,
    submitted_at_required: true,
    submission_channel_required: true,
    public_url_required: true,
    observer_ref_required: true,
    observed_content_digest_required: true,
    scope_match_result_required: true,
    non_claims_presence_result_required: true,
    evidence_reference_presence_result_required: true,
    customer_data_absence_declaration_required: true,
    forbidden_claims_absence_declaration_required: true,
    verification_rerun_required: true,
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
    verification_rerun_completed: false,
    verification_rerun_passed: false,
    remediation_complete: false,
    ready_for_operator_input_collection: true,
    ready_for_submission_verification_rerun: false,
    ready_for_remediation_execution_update: false,
    ready_for_input_collection_execution: false,
    ready_for_retry_gate_rerun: false,
    remediation_comment: 'Remediation is defined but pending operator-supplied observation inputs.'
  }));
}

function buildPayload(source) {
  const verification = source.public_surface_observation_operator_input_submission_verification;
  const items = buildRemediationItems(source);

  return {
    operator_input_submission_remediation_id: 'PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION::HBCE-L1-DECISION-PROOF-0001',
    operator_input_submission_remediation_key: 'hbce.level1.public_surface.observation_operator_input_submission_remediation.controlled_information.0001',
    source_public_surface_observation_operator_input_submission_verification_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_submission_verification_digest: verification.operator_input_submission_verification_payload_digest,
    operator_input_submission_remediation_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    operator_input_submission_remediation_status: 'DEFINED_PENDING_OPERATOR_INPUT_REMEDIATION',
    operator_input_submission_remediation_result: 'OPERATOR_INPUT_REMEDIATION_NOT_COMPLETED',
    operator_input_submission_remediation_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION',
    defined_at: '2027-01-19T17:55:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,

    imported_operator_input_submission_verification_status: verification.operator_input_submission_verification_status,
    imported_operator_input_submission_verification_result: verification.operator_input_submission_verification_result,
    imported_operator_input_submission_verification_evaluated: verification.operator_input_submission_verification_evaluated,
    imported_operator_input_submission_verification_performed: verification.operator_input_submission_verification_performed,
    imported_operator_input_submission_verification_passed: verification.operator_input_submission_verification_passed,
    imported_operator_input_submission_verification_blocked: verification.operator_input_submission_verification_blocked,
    imported_operator_input_submission_incomplete: verification.operator_input_submission_incomplete,
    imported_operator_inputs_verified: verification.operator_inputs_verified,
    imported_remediation_execution_update_ready: verification.remediation_execution_update_ready,
    imported_input_collection_execution_ready: verification.input_collection_execution_ready,
    imported_input_verification_ready: verification.input_verification_ready,
    imported_retry_gate_rerun_ready: verification.retry_gate_rerun_ready,

    remediation_items: items,
    remediation_item_count: items.length,
    all_verification_items_have_remediation_items: verification.verification_items.every((item) =>
      items.some((remediationItem) => remediationItem.operator_input_submission_verification_item_id === item.operator_input_submission_verification_item_id)
    ),
    all_remediation_items_pending: items.every((item) => item.remediation_status === 'PENDING_OPERATOR_INPUT_REMEDIATION'),
    all_remediation_items_require_submitter_ref: items.every((item) => item.submitter_ref_required === true),
    all_remediation_items_require_submitted_at: items.every((item) => item.submitted_at_required === true),
    all_remediation_items_require_submission_channel: items.every((item) => item.submission_channel_required === true),
    all_remediation_items_require_public_url: items.every((item) => item.public_url_required === true),
    all_remediation_items_require_observer_ref: items.every((item) => item.observer_ref_required === true),
    all_remediation_items_require_observed_content_digest: items.every((item) => item.observed_content_digest_required === true),
    all_remediation_items_require_scope_match_result: items.every((item) => item.scope_match_result_required === true),
    all_remediation_items_require_non_claims_presence_result: items.every((item) => item.non_claims_presence_result_required === true),
    all_remediation_items_require_evidence_reference_presence_result: items.every((item) => item.evidence_reference_presence_result_required === true),
    all_remediation_items_require_customer_data_absence_declaration: items.every((item) => item.customer_data_absence_declaration_required === true),
    all_remediation_items_require_forbidden_claims_absence_declaration: items.every((item) => item.forbidden_claims_absence_declaration_required === true),
    all_remediation_items_require_verification_rerun: items.every((item) => item.verification_rerun_required === true),
    all_remediation_items_not_complete: items.every((item) => item.remediation_complete === false),
    all_remediation_items_ready_for_operator_input_collection: items.every((item) => item.ready_for_operator_input_collection === true),
    all_remediation_items_not_ready_for_submission_verification_rerun: items.every((item) => item.ready_for_submission_verification_rerun === false),
    all_remediation_items_not_ready_for_remediation_execution_update: items.every((item) => item.ready_for_remediation_execution_update === false),
    all_remediation_items_not_ready_for_input_collection_execution: items.every((item) => item.ready_for_input_collection_execution === false),
    all_remediation_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),

    operator_input_submission_remediation_defined: true,
    operator_input_submission_remediation_artifact_ready: true,
    operator_input_submission_remediation_completed: false,
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

    operator_input_submission_remediation_controls: [
      'define_missing_operator_input_remediation_items',
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
      'require_operator_input_submission_verification_rerun',
      'do_not_mark_remediation_complete_without_all_inputs',
      'do_not_mark_operator_inputs_verified_without_verification_pass',
      'do_not_mark_remediation_execution_update_ready_without_verified_inputs',
      'do_not_mark_input_collection_execution_ready_without_verified_inputs',
      'do_not_rerun_retry_gate_without_input_verification_pass',
      'do_not_infer_public_observation_from_operator_input_remediation',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_until_operator_inputs_are_collected_and_verified'
    ],

    operator_input_submission_remediation_boundary: {
      controlled_information_surface_only: true,
      remediation_definition_only: true,
      operator_input_remediation_pending: true,
      no_operator_inputs_recorded: true,
      no_operator_inputs_verified: true,
      no_remediation_execution_update_recorded: true,
      no_input_collection_execution_recorded: true,
      no_input_verification_recorded: true,
      no_retry_gate_rerun_recorded: true,
      no_public_observation_recorded: true,
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

    source_operator_input_submission_verification_ready: source.readiness_state.public_surface_observation_operator_input_submission_verification_ready === true,
    source_operator_input_submission_verification_evaluated: source.readiness_state.public_surface_observation_operator_input_submission_verification_evaluated === true,
    source_operator_input_submission_verification_passed: source.readiness_state.public_surface_observation_operator_input_submission_verification_passed === true,
    source_operator_input_submission_verification_blocked: source.readiness_state.public_surface_observation_operator_input_submission_verification_blocked === true,
    source_operator_input_submission_incomplete: source.readiness_state.operator_input_submission_incomplete === true,
    source_operator_inputs_submitted: source.readiness_state.operator_inputs_submitted === true,
    source_operator_inputs_verified: source.readiness_state.operator_inputs_verified === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    ai_operator_input_submission_remediation_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediation(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPayload(source);

  const checklist = {
    source_public_surface_observation_operator_input_submission_verification_hash_valid: validHash(source),
    source_operator_input_submission_verification_ready: source.readiness_state.public_surface_observation_operator_input_submission_verification_ready === true,
    source_operator_input_submission_verification_evaluated: source.readiness_state.public_surface_observation_operator_input_submission_verification_evaluated === true,
    source_operator_input_submission_verification_passed: source.readiness_state.public_surface_observation_operator_input_submission_verification_passed === true,
    source_operator_input_submission_verification_blocked: source.readiness_state.public_surface_observation_operator_input_submission_verification_blocked === true,
    source_operator_input_submission_incomplete: source.readiness_state.operator_input_submission_incomplete === true,
    operator_input_submission_remediation_defined: payload.operator_input_submission_remediation_defined,
    operator_input_submission_remediation_completed: payload.operator_input_submission_remediation_completed,
    all_verification_items_have_remediation_items: payload.all_verification_items_have_remediation_items,
    all_remediation_items_pending: payload.all_remediation_items_pending,
    all_remediation_items_ready_for_operator_input_collection: payload.all_remediation_items_ready_for_operator_input_collection,
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
    ai_authority_absence_confirmed: payload.ai_operator_input_submission_remediation_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-111-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-2027-PROG-111',
    issue_id: 'PROG-111',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_operator_input_submission_verification_ref: SOURCE_REF,
    source_public_surface_observation_operator_input_submission_verification_revision_hash: source.revision_hash,
    source_public_surface_observation_operator_input_submission_verification_revision_hash_valid: validHash(source),

    level1_public_surface_observation_operator_input_submission_remediation_status: STATUS,

    inherited_public_surface_observation_operator_input_submission_verification: {
      operator_input_submission_verification_status: source.level1_public_surface_observation_operator_input_submission_verification_status,
      public_surface_observation_operator_input_submission_verification_ready: source.readiness_state.public_surface_observation_operator_input_submission_verification_ready,
      public_surface_observation_operator_input_submission_verification_evaluated: source.readiness_state.public_surface_observation_operator_input_submission_verification_evaluated,
      public_surface_observation_operator_input_submission_verification_performed: source.readiness_state.public_surface_observation_operator_input_submission_verification_performed,
      public_surface_observation_operator_input_submission_verification_passed: source.readiness_state.public_surface_observation_operator_input_submission_verification_passed,
      public_surface_observation_operator_input_submission_verification_blocked: source.readiness_state.public_surface_observation_operator_input_submission_verification_blocked,
      operator_input_submission_incomplete: source.readiness_state.operator_input_submission_incomplete,
      operator_inputs_submitted: source.readiness_state.operator_inputs_submitted,
      operator_inputs_verified: source.readiness_state.operator_inputs_verified,
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

    public_surface_observation_operator_input_submission_remediation: {
      ...payload,
      operator_input_submission_remediation_payload_digest: sha256Digest(payload),
      operator_input_submission_remediation_checklist: checklist,
      operator_input_submission_remediation_is_defined: true,
      operator_input_submission_remediation_is_pending_inputs: true,
      operator_input_submission_remediation_is_not_completed: true,
      operator_input_submission_remediation_is_not_operator_inputs_collected: true,
      operator_input_submission_remediation_is_not_operator_inputs_verified: true,
      operator_input_submission_remediation_is_not_submission_verification_rerun: true,
      operator_input_submission_remediation_is_not_remediation_execution_update: true,
      operator_input_submission_remediation_is_not_input_collection_execution: true,
      operator_input_submission_remediation_is_not_input_verification: true,
      operator_input_submission_remediation_is_not_retry_gate_rerun: true,
      operator_input_submission_remediation_is_not_observation_evidence: true,
      operator_input_submission_remediation_is_not_public_observation_ready: true,
      operator_input_submission_remediation_is_not_external_customer_readiness: true,
      operator_input_submission_remediation_is_not_banking_pack_readiness: true,
      operator_input_submission_remediation_is_not_launch_readiness: true,
      operator_input_submission_remediation_is_not_production_readiness: true,
      operator_input_submission_remediation_is_not_legal_validity: true,
      operator_input_submission_remediation_is_not_security_certification: true,
      operator_input_submission_remediation_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_VERIFICATION_NOT_READY',
      'OPERATOR_INPUT_SUBMISSION_VERIFICATION_NOT_BLOCKED',
      'OPERATOR_INPUT_SUBMISSION_REMEDIATION_ITEM_MISSING',
      'SUBMITTER_REF_REMEDIATION_MISSING',
      'SUBMITTED_AT_REMEDIATION_MISSING',
      'SUBMISSION_CHANNEL_REMEDIATION_MISSING',
      'PUBLIC_URL_REMEDIATION_MISSING',
      'OBSERVER_REF_REMEDIATION_MISSING',
      'OBSERVED_CONTENT_DIGEST_REMEDIATION_MISSING',
      'SCOPE_MATCH_RESULT_REMEDIATION_MISSING',
      'NON_CLAIMS_RESULT_REMEDIATION_MISSING',
      'EVIDENCE_REFERENCE_RESULT_REMEDIATION_MISSING',
      'CUSTOMER_DATA_ABSENCE_DECLARATION_REMEDIATION_MISSING',
      'FORBIDDEN_CLAIMS_ABSENCE_DECLARATION_REMEDIATION_MISSING',
      'OPERATOR_INPUT_SUBMISSION_REMEDIATION_NOT_COMPLETED',
      'OPERATOR_INPUTS_NOT_COLLECTED',
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
      'AI_OPERATOR_INPUT_SUBMISSION_REMEDIATION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_operator_input_submission_remediation_defined: true,
      public_surface_observation_operator_input_submission_remediation_ready: true,
      public_surface_observation_operator_input_submission_remediation_completed: false,
      source_public_surface_observation_operator_input_submission_verification_bound: true,
      public_surface_observation_operator_input_submission_verification_ready: true,
      public_surface_observation_operator_input_submission_verification_evaluated: true,
      public_surface_observation_operator_input_submission_verification_blocked: true,
      operator_input_submission_incomplete: true,
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

    next_required_program: 'PROG-112-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-OPERATOR-INPUT-SUBMISSION-REMEDIATION-EXECUTION',

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

function writeLevel1PublicSurfaceObservationOperatorInputSubmissionRemediation(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediation({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-111-level1-public-surface-observation-operator-input-submission-remediation.json';
  const doc = writeLevel1PublicSurfaceObservationOperatorInputSubmissionRemediation(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_111_LEVEL1_PUBLIC_SURFACE_OBSERVATION_OPERATOR_INPUT_SUBMISSION_REMEDIATION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildRemediationItems,
  buildObservationOperatorInputSubmissionRemediationPayload: buildPayload,
  buildLevel1PublicSurfaceObservationOperatorInputSubmissionRemediation,
  writeLevel1PublicSurfaceObservationOperatorInputSubmissionRemediation
};
