'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_BLOCKED_UNVERIFIED_INPUTS';
const SOURCE_REF = 'docs/launch/level1/prog-105-level1-public-surface-observation-input-verification.json';

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

function buildRetryTargets(source) {
  const verification = source.public_surface_observation_input_verification;

  return verification.verification_items.map((item) => ({
    retry_target_id: item.verification_item_id.replace('PUBLIC-SURFACE-OBSERVATION-VERIFICATION::', 'PUBLIC-SURFACE-OBSERVATION-RETRY::'),
    verification_item_id: item.verification_item_id,
    collection_item_id: item.collection_item_id,
    input_target_id: item.input_target_id,
    observation_target_id: item.observation_target_id,
    surface_type: item.surface_type,
    source_input_verification_ref: SOURCE_REF,
    retry_status: 'BLOCKED_INPUT_VERIFICATION_NOT_PASSED',
    retry_required: true,
    input_values_available: item.input_values_available === true,
    verification_complete: item.verification_complete === true,
    verification_passed: item.verification_passed === true,
    public_url_present: item.public_url_present === true,
    observer_ref_present: item.observer_ref_present === true,
    observed_content_digest_present: item.observed_content_digest_present === true,
    scope_match_result_present: item.observed_scope_match_result_present === true,
    non_claims_result_present: item.observed_non_claims_presence_result_present === true,
    evidence_reference_result_present: item.observed_evidence_reference_presence_result_present === true,
    ready_for_observation_retry: false,
    retry_allowed: false,
    retry_performed: false,
    retry_comment: 'Retry is blocked because input verification did not pass.'
  }));
}

function buildObservationRetryGatePayload(source) {
  const verification = source.public_surface_observation_input_verification;
  const retryTargets = buildRetryTargets(source);

  const gateCriteria = {
    source_public_surface_observation_input_verification_hash_valid: validHash(source),
    source_public_surface_observation_input_verification_artifact_ready: source.readiness_state.public_surface_observation_input_verification_artifact_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    observation_inputs_collected: source.readiness_state.public_surface_observation_inputs_collected === true,
    observation_inputs_verified: source.readiness_state.public_surface_observation_inputs_verified === true,
    input_verification_performed: source.readiness_state.public_surface_observation_input_verification_performed === true,
    input_verification_passed: source.readiness_state.public_surface_observation_input_verification_passed === true,
    prior_observation_gate_retry_ready: source.readiness_state.public_surface_observation_gate_retry_ready === true,
    all_verification_items_available: retryTargets.every((target) => target.verification_item_id),
    all_retry_targets_defined: retryTargets.length === verification.verification_items.length,
    all_retry_targets_blocked_unverified: retryTargets.every((target) => target.retry_status === 'BLOCKED_INPUT_VERIFICATION_NOT_PASSED'),
    all_retry_targets_not_allowed: retryTargets.every((target) => target.retry_allowed === false),
    all_retry_targets_not_performed: retryTargets.every((target) => target.retry_performed === false),
    all_retry_targets_not_ready: retryTargets.every((target) => target.ready_for_observation_retry === false),
    external_customer_readiness_excluded: true,
    banking_pack_readiness_excluded: true,
    launch_readiness_excluded: true,
    production_readiness_excluded: true,
    legal_validity_excluded: true,
    security_certification_excluded: true,
    ai_authority_excluded: true
  };

  const blockingCriteria = [
    'observation_inputs_collected',
    'observation_inputs_verified',
    'input_verification_performed',
    'input_verification_passed',
    'prior_observation_gate_retry_ready'
  ].filter((key) => gateCriteria[key] !== true);

  const retryGatePassed = false;

  return {
    public_surface_observation_retry_gate_id: 'PUBLIC-SURFACE-OBSERVATION-RETRY-GATE::HBCE-L1-DECISION-PROOF-0001',
    retry_gate_key: 'hbce.level1.public_surface.observation_retry_gate.controlled_information.0001',
    source_public_surface_observation_input_verification_ref: SOURCE_REF,
    source_public_surface_observation_input_verification_digest: verification.public_surface_observation_input_verification_payload_digest,
    retry_gate_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    retry_gate_status: 'BLOCKED_UNVERIFIED_OBSERVATION_INPUTS',
    retry_gate_result: 'OBSERVATION_RETRY_NOT_READY',
    retry_gate_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_RETRY_GATE',
    evaluated_at: '2027-01-19T17:30:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,
    retry_targets: retryTargets,
    retry_target_count: retryTargets.length,
    gate_criteria: gateCriteria,
    blocking_criteria: blockingCriteria,
    all_gate_criteria_passed: retryGatePassed,
    public_surface_observation_retry_gate_evaluated: true,
    public_surface_observation_retry_gate_passed: retryGatePassed,
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
    approved_claims_after_retry_gate: {
      public_surface_ready_controlled_information_only: true,
      publication_authorized_for_controlled_public_information_surface: true,
      input_verification_artifact_defined: true,
      public_surface_observation_retry_gate_evaluated: true,
      public_surface_observation_retry_gate_passed: false,
      observation_retry_allowed: false,
      observation_retry_performed: false,
      public_surface_observed: false,
      public_surface_observation_ready: false
    },
    blocked_claims_after_retry_gate: {
      public_surface_observation_retry_gate_passed: true,
      observation_retry_allowed: true,
      observation_retry_performed: true,
      public_surface_observed: true,
      public_surface_observation_ready: true,
      external_customer_delivery_ready: true,
      banking_pack_ready: true,
      level1_launch_ready: true,
      production_ready: true,
      legal_validity: true,
      public_accreditation: true,
      procurement_eligibility: true,
      security_certification: true,
      ai_authority: true
    },
    retry_gate_controls: [
      'require_verified_inputs_before_retry',
      'require_input_verification_passed_before_retry',
      'require_public_url_present_before_retry',
      'require_observer_ref_present_before_retry',
      'require_observed_content_digest_present_before_retry',
      'require_scope_match_result_before_retry',
      'require_non_claims_result_before_retry',
      'require_evidence_reference_result_before_retry',
      'do_not_retry_observation_with_unverified_inputs',
      'do_not_infer_observation_from_retry_gate_definition',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_unverified_inputs'
    ],
    retry_gate_boundary: {
      controlled_information_surface_only: true,
      retry_gate_evaluation_only: true,
      retry_gate_blocked: true,
      no_public_observation_recorded: true,
      no_observation_retry_performed: true,
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
    source_public_surface_observation_input_verification_artifact_ready: source.readiness_state.public_surface_observation_input_verification_artifact_ready === true,
    source_observation_inputs_collected: source.readiness_state.public_surface_observation_inputs_collected === true,
    source_observation_inputs_verified: source.readiness_state.public_surface_observation_inputs_verified === true,
    source_input_verification_performed: source.readiness_state.public_surface_observation_input_verification_performed === true,
    source_input_verification_passed: source.readiness_state.public_surface_observation_input_verification_passed === true,
    source_observation_gate_retry_ready: source.readiness_state.public_surface_observation_gate_retry_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    retry_gate_comment: 'The retry gate is evaluated and remains blocked because observation inputs were not collected, not verified, and did not pass input verification.',
    ai_retry_gate_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationRetryGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildObservationRetryGatePayload(source);

  const checklist = {
    source_public_surface_observation_input_verification_hash_valid: validHash(source),
    source_public_surface_observation_input_verification_artifact_ready: source.readiness_state.public_surface_observation_input_verification_artifact_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    retry_gate_evaluated: payload.public_surface_observation_retry_gate_evaluated,
    retry_gate_passed: payload.public_surface_observation_retry_gate_passed,
    retry_gate_blocked_unverified_inputs: payload.retry_gate_status === 'BLOCKED_UNVERIFIED_OBSERVATION_INPUTS',
    blocking_criteria_present: payload.blocking_criteria.length > 0,
    observation_inputs_collected: payload.source_observation_inputs_collected,
    observation_inputs_verified: payload.source_observation_inputs_verified,
    input_verification_performed: payload.source_input_verification_performed,
    input_verification_passed: payload.source_input_verification_passed,
    observation_retry_allowed: payload.observation_retry_allowed,
    observation_retry_performed: payload.observation_retry_performed,
    observation_retry_ready: payload.observation_retry_ready,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_retry_gate_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-106-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_RETRY_GATE',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE-2027-PROG-106',
    issue_id: 'PROG-106',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-RETRY-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_input_verification_ref: SOURCE_REF,
    source_public_surface_observation_input_verification_revision_hash: source.revision_hash,
    source_public_surface_observation_input_verification_revision_hash_valid: validHash(source),

    level1_public_surface_observation_retry_gate_status: STATUS,

    inherited_public_surface_observation_input_verification: {
      input_verification_status: source.level1_public_surface_observation_input_verification_status,
      input_verification_scope: source.public_surface_observation_input_verification.input_verification_scope,
      input_verification_mode: source.public_surface_observation_input_verification.input_verification_mode,
      public_surface_observation_input_verification_artifact_ready: source.readiness_state.public_surface_observation_input_verification_artifact_ready,
      public_surface_observation_inputs_collected: source.readiness_state.public_surface_observation_inputs_collected,
      public_surface_observation_inputs_verified: source.readiness_state.public_surface_observation_inputs_verified,
      public_surface_observation_input_verification_performed: source.readiness_state.public_surface_observation_input_verification_performed,
      public_surface_observation_input_verification_passed: source.readiness_state.public_surface_observation_input_verification_passed,
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

    public_surface_observation_retry_gate: {
      ...payload,
      public_surface_observation_retry_gate_payload_digest: sha256Digest(payload),
      observation_retry_gate_checklist: checklist,
      public_surface_observation_retry_gate_is_defined: true,
      public_surface_observation_retry_gate_is_evaluated: true,
      public_surface_observation_retry_gate_is_blocked_unverified_inputs: true,
      public_surface_observation_retry_gate_is_not_observation_evidence: true,
      public_surface_observation_retry_gate_is_not_public_observation_ready: true,
      public_surface_observation_retry_gate_is_not_external_customer_readiness: true,
      public_surface_observation_retry_gate_is_not_banking_pack_readiness: true,
      public_surface_observation_retry_gate_is_not_launch_readiness: true,
      public_surface_observation_retry_gate_is_not_production_readiness: true,
      public_surface_observation_retry_gate_is_not_legal_validity: true,
      public_surface_observation_retry_gate_is_not_security_certification: true,
      public_surface_observation_retry_gate_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_INPUT_VERIFICATION_ARTIFACT_NOT_READY',
      'OBSERVATION_INPUTS_NOT_COLLECTED',
      'OBSERVATION_INPUTS_NOT_VERIFIED',
      'INPUT_VERIFICATION_NOT_PERFORMED',
      'INPUT_VERIFICATION_NOT_PASSED',
      'OBSERVATION_RETRY_NOT_ALLOWED',
      'OBSERVATION_RETRY_NOT_READY',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_RETRY_GATE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_retry_gate_defined: true,
      public_surface_observation_retry_gate_evaluated: true,
      public_surface_observation_retry_gate_passed: false,
      source_public_surface_observation_input_verification_bound: true,
      public_surface_observation_input_verification_artifact_ready: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      retry_gate_blocked_unverified_inputs: true,
      blocking_criteria_present: true,
      observation_inputs_collected: false,
      observation_inputs_verified: false,
      input_verification_performed: false,
      input_verification_passed: false,
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

    next_required_program: 'PROG-107-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK',

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

function writeLevel1PublicSurfaceObservationRetryGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationRetryGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-106-level1-public-surface-observation-retry-gate.json';
  const doc = writeLevel1PublicSurfaceObservationRetryGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_106_LEVEL1_PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildRetryTargets,
  buildObservationRetryGatePayload,
  buildLevel1PublicSurfaceObservationRetryGate,
  writeLevel1PublicSurfaceObservationRetryGate
};
