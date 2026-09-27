'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_DEFINED_NOT_VERIFIED';
const SOURCE_REF = 'docs/launch/level1/prog-104-level1-public-surface-observation-input-collection.json';

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
  const collection = source.public_surface_observation_input_collection;

  return collection.collection_items.map((item) => ({
    verification_item_id: item.collection_item_id.replace('PUBLIC-SURFACE-OBSERVATION-COLLECTION::', 'PUBLIC-SURFACE-OBSERVATION-VERIFICATION::'),
    collection_item_id: item.collection_item_id,
    input_target_id: item.input_target_id,
    observation_target_id: item.observation_target_id,
    surface_type: item.surface_type,
    source_input_collection_ref: SOURCE_REF,
    verification_status: 'BLOCKED_NOT_COLLECTED',
    verification_required: true,
    required_checks: [
      'collection_complete',
      'public_url_present',
      'observer_ref_present',
      'observed_content_digest_present',
      'observed_scope_match_result_present',
      'observed_non_claims_presence_result_present',
      'observed_evidence_reference_presence_result_present',
      'customer_data_absence_declared',
      'forbidden_claims_absence_declared'
    ],
    collection_complete: item.collection_complete === true,
    collection_verified: item.collection_verified === true,
    public_url_present: item.public_url !== null,
    observer_ref_present: item.observer_ref !== null,
    observed_content_digest_present: item.observed_content_digest !== null,
    observed_scope_match_result_present: item.observed_scope_match_result !== null,
    observed_non_claims_presence_result_present: item.observed_non_claims_presence_result !== null,
    observed_evidence_reference_presence_result_present: item.observed_evidence_reference_presence_result !== null,
    customer_data_absence_declared: item.customer_data_declared_absent === true,
    forbidden_claims_absence_declared: item.forbidden_claims_declared_absent === true,
    input_values_available: false,
    verification_complete: false,
    verification_passed: false,
    ready_for_observation_gate_retry: false,
    verification_comment: 'Verification is blocked because no collected observation input values are present.'
  }));
}

function buildObservationInputVerificationPayload(source) {
  const collection = source.public_surface_observation_input_collection;
  const items = buildVerificationItems(source);

  return {
    public_surface_observation_input_verification_id: 'PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION::HBCE-L1-DECISION-PROOF-0001',
    input_verification_key: 'hbce.level1.public_surface.observation_input_verification.controlled_information.0001',
    source_public_surface_observation_input_collection_ref: SOURCE_REF,
    source_public_surface_observation_input_collection_digest: collection.public_surface_observation_input_collection_payload_digest,
    input_verification_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    input_verification_status: 'DEFINED_NOT_VERIFIED',
    input_verification_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_INPUT_VERIFICATION',
    defined_at: '2027-01-19T17:25:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,
    verification_items: items,
    verification_item_count: items.length,
    required_inputs: collection.required_inputs,
    required_input_count: collection.required_input_count,
    all_collection_items_have_verification_items: collection.collection_items.every((item) =>
      items.some((verificationItem) => verificationItem.collection_item_id === item.collection_item_id)
    ),
    all_verification_items_blocked_not_collected: items.every((item) => item.verification_status === 'BLOCKED_NOT_COLLECTED'),
    all_verification_items_without_public_url: items.every((item) => item.public_url_present === false),
    all_verification_items_without_observer_ref: items.every((item) => item.observer_ref_present === false),
    all_verification_items_without_observed_content_digest: items.every((item) => item.observed_content_digest_present === false),
    all_verification_items_without_scope_match_result: items.every((item) => item.observed_scope_match_result_present === false),
    all_verification_items_without_non_claims_result: items.every((item) => item.observed_non_claims_presence_result_present === false),
    all_verification_items_without_evidence_reference_result: items.every((item) => item.observed_evidence_reference_presence_result_present === false),
    all_verification_items_incomplete: items.every((item) => item.verification_complete === false),
    all_verification_items_not_passed: items.every((item) => item.verification_passed === false),
    all_verification_items_not_ready_for_gate_retry: items.every((item) => item.ready_for_observation_gate_retry === false),
    observation_inputs_collected: false,
    observation_inputs_verified: false,
    input_verification_performed: false,
    input_verification_passed: false,
    observation_gate_retry_ready: false,
    input_verification_controls: [
      'define_verification_items_for_each_collection_item',
      'require_collection_complete_before_verification',
      'require_public_url_present_before_verification',
      'require_observer_ref_present_before_verification',
      'require_observed_content_digest_present_before_verification',
      'require_scope_match_result_present_before_verification',
      'require_non_claims_presence_result_present_before_verification',
      'require_evidence_reference_presence_result_present_before_verification',
      'require_customer_data_absence_declaration_before_verification',
      'require_forbidden_claims_absence_declaration_before_verification',
      'do_not_verify_missing_collection_values',
      'do_not_infer_public_observation_from_verification_definition',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_unverified_inputs'
    ],
    input_verification_boundary: {
      controlled_information_surface_only: true,
      input_verification_definition_only: true,
      no_public_observation_recorded: true,
      no_observation_input_values_verified: true,
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
    source_public_surface_observation_input_collection_ready: source.readiness_state.public_surface_observation_input_collection_ready === true,
    source_observation_inputs_collected: source.readiness_state.public_surface_observation_inputs_collected === true,
    source_observation_inputs_verified: source.readiness_state.public_surface_observation_inputs_verified === true,
    source_input_verification_ready: source.readiness_state.public_surface_observation_input_verification_ready === true,
    source_observation_gate_retry_ready: source.readiness_state.public_surface_observation_gate_retry_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_observation_input_verification_defined: true,
    public_surface_observation_input_verification_artifact_ready: true,
    public_surface_observation_inputs_collected: false,
    public_surface_observation_inputs_verified: false,
    public_surface_observation_input_verification_performed: false,
    public_surface_observation_input_verification_passed: false,
    public_surface_observation_gate_retry_ready: false,
    public_surface_observed: false,
    public_surface_observation_ready: false,
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    input_verification_comment: 'The verification artifact defines the checks required for collected observation inputs, but performs no positive verification because no collected observation values are present.',
    ai_input_verification_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationInputVerification(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildObservationInputVerificationPayload(source);

  const checklist = {
    source_public_surface_observation_input_collection_hash_valid: validHash(source),
    source_public_surface_observation_input_collection_ready: source.readiness_state.public_surface_observation_input_collection_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    all_collection_items_have_verification_items: payload.all_collection_items_have_verification_items,
    all_verification_items_blocked_not_collected: payload.all_verification_items_blocked_not_collected,
    all_verification_items_without_public_url: payload.all_verification_items_without_public_url,
    all_verification_items_without_observer_ref: payload.all_verification_items_without_observer_ref,
    all_verification_items_without_observed_content_digest: payload.all_verification_items_without_observed_content_digest,
    all_verification_items_without_scope_match_result: payload.all_verification_items_without_scope_match_result,
    all_verification_items_without_non_claims_result: payload.all_verification_items_without_non_claims_result,
    all_verification_items_without_evidence_reference_result: payload.all_verification_items_without_evidence_reference_result,
    all_verification_items_incomplete: payload.all_verification_items_incomplete,
    all_verification_items_not_passed: payload.all_verification_items_not_passed,
    all_verification_items_not_ready_for_gate_retry: payload.all_verification_items_not_ready_for_gate_retry,
    observation_inputs_collected: payload.observation_inputs_collected,
    observation_inputs_verified: payload.observation_inputs_verified,
    input_verification_performed: payload.input_verification_performed,
    input_verification_passed: payload.input_verification_passed,
    observation_gate_retry_ready: payload.observation_gate_retry_ready,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_input_verification_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-105-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION-2027-PROG-105',
    issue_id: 'PROG-105',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_input_collection_ref: SOURCE_REF,
    source_public_surface_observation_input_collection_revision_hash: source.revision_hash,
    source_public_surface_observation_input_collection_revision_hash_valid: validHash(source),

    level1_public_surface_observation_input_verification_status: STATUS,

    inherited_public_surface_observation_input_collection: {
      input_collection_status: source.level1_public_surface_observation_input_collection_status,
      input_collection_scope: source.public_surface_observation_input_collection.input_collection_scope,
      input_collection_mode: source.public_surface_observation_input_collection.input_collection_mode,
      public_surface_observation_input_collection_ready: source.readiness_state.public_surface_observation_input_collection_ready,
      public_surface_observation_inputs_collected: source.readiness_state.public_surface_observation_inputs_collected,
      public_surface_observation_inputs_verified: source.readiness_state.public_surface_observation_inputs_verified,
      public_surface_observation_input_verification_ready: source.readiness_state.public_surface_observation_input_verification_ready,
      public_surface_observation_gate_retry_ready: source.readiness_state.public_surface_observation_gate_retry_ready,
      public_surface_ready: source.readiness_state.public_surface_ready,
      publication_authorized: source.readiness_state.publication_authorized,
      publication_authorization_scope: source.readiness_state.publication_authorization_scope,
      prior_public_surface_observed: source.readiness_state.public_surface_observed,
      prior_public_surface_observation_ready: source.readiness_state.public_surface_observation_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_observation_input_verification: {
      ...payload,
      public_surface_observation_input_verification_payload_digest: sha256Digest(payload),
      observation_input_verification_checklist: checklist,
      public_surface_observation_input_verification_is_defined: true,
      public_surface_observation_input_verification_is_not_performed: true,
      public_surface_observation_input_verification_is_not_passed: true,
      public_surface_observation_input_verification_is_not_observation_evidence: true,
      public_surface_observation_input_verification_is_not_public_observation_ready: true,
      public_surface_observation_input_verification_is_not_external_customer_readiness: true,
      public_surface_observation_input_verification_is_not_banking_pack_readiness: true,
      public_surface_observation_input_verification_is_not_launch_readiness: true,
      public_surface_observation_input_verification_is_not_production_readiness: true,
      public_surface_observation_input_verification_is_not_legal_validity: true,
      public_surface_observation_input_verification_is_not_security_certification: true,
      public_surface_observation_input_verification_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_NOT_READY',
      'OBSERVATION_VERIFICATION_ITEM_MISSING',
      'OBSERVATION_COLLECTION_NOT_COMPLETE',
      'PUBLIC_URL_NOT_PRESENT',
      'OBSERVER_REF_NOT_PRESENT',
      'OBSERVED_CONTENT_DIGEST_NOT_PRESENT',
      'OBSERVED_SCOPE_MATCH_RESULT_NOT_PRESENT',
      'OBSERVED_NON_CLAIMS_RESULT_NOT_PRESENT',
      'OBSERVED_EVIDENCE_REFERENCE_RESULT_NOT_PRESENT',
      'OBSERVATION_INPUTS_NOT_VERIFIED',
      'OBSERVATION_GATE_RETRY_NOT_READY',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_INPUT_VERIFICATION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_input_verification_defined: true,
      public_surface_observation_input_verification_artifact_ready: true,
      source_public_surface_observation_input_collection_bound: true,
      public_surface_observation_input_collection_ready: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      all_collection_items_have_verification_items: payload.all_collection_items_have_verification_items,
      all_verification_items_blocked_not_collected: payload.all_verification_items_blocked_not_collected,
      all_verification_items_without_public_url: payload.all_verification_items_without_public_url,
      all_verification_items_without_observer_ref: payload.all_verification_items_without_observer_ref,
      all_verification_items_without_observed_content_digest: payload.all_verification_items_without_observed_content_digest,
      public_surface_observation_inputs_collected: false,
      public_surface_observation_inputs_verified: false,
      public_surface_observation_input_verification_performed: false,
      public_surface_observation_input_verification_passed: false,
      public_surface_observation_gate_retry_ready: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-106-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
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

function writeLevel1PublicSurfaceObservationInputVerification(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationInputVerification({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-105-level1-public-surface-observation-input-verification.json';
  const doc = writeLevel1PublicSurfaceObservationInputVerification(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_105_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildVerificationItems,
  buildObservationInputVerificationPayload,
  buildLevel1PublicSurfaceObservationInputVerification,
  writeLevel1PublicSurfaceObservationInputVerification
};
