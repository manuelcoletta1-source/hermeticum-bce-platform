'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_DEFINED_PENDING_INPUTS';
const SOURCE_REF = 'docs/launch/level1/prog-102-level1-public-surface-observation-gate.json';

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

function buildInputTargets(source) {
  const gate = source.public_surface_observation_gate;

  return gate.observation_targets_evaluated.map((target) => ({
    input_target_id: target.observation_target_id.replace('PUBLIC-SURFACE-OBSERVATION-TARGET::', 'PUBLIC-SURFACE-OBSERVATION-INPUT::'),
    observation_target_id: target.observation_target_id,
    surface_type: target.surface_type,
    source_observation_gate_ref: SOURCE_REF,
    input_status: 'PENDING_INPUTS',
    required_inputs: [
      'public_url',
      'observed_at',
      'observer_ref',
      'observation_method',
      'observed_content_digest',
      'observed_scope_match_result',
      'observed_non_claims_presence_result',
      'observed_evidence_reference_presence_result'
    ],
    public_url: null,
    observed_at: null,
    observer_ref: null,
    observation_method: null,
    observed_content_digest: null,
    observed_headers_digest: null,
    observed_status_code: null,
    observed_scope_match_result: null,
    observed_non_claims_presence_result: null,
    observed_evidence_reference_presence_result: null,
    input_complete: false,
    input_verified: false,
    ready_for_observation_gate_retry: false,
    customer_data_declared_absent: null,
    customer_logo_authorization_declared: null,
    forbidden_claims_declared_absent: null
  }));
}

function buildObservationInputPackPayload(source) {
  const gate = source.public_surface_observation_gate;
  const targets = buildInputTargets(source);

  const requiredInputs = [
    'public_url',
    'observed_at',
    'observer_ref',
    'observation_method',
    'observed_content_digest',
    'observed_scope_match_result',
    'observed_non_claims_presence_result',
    'observed_evidence_reference_presence_result'
  ];

  return {
    public_surface_observation_input_pack_id: 'PUBLIC-SURFACE-OBSERVATION-INPUT-PACK::HBCE-L1-DECISION-PROOF-0001',
    input_pack_key: 'hbce.level1.public_surface.observation_input_pack.controlled_information.0001',
    source_public_surface_observation_gate_ref: SOURCE_REF,
    source_public_surface_observation_gate_digest: gate.public_surface_observation_gate_payload_digest,
    input_pack_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    input_pack_status: 'DEFINED_PENDING_INPUTS',
    input_pack_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_INPUT_PACK',
    defined_at: '2027-01-19T17:15:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,
    input_targets: targets,
    input_target_count: targets.length,
    required_inputs: requiredInputs,
    required_input_count: requiredInputs.length,
    all_gate_blocking_criteria_imported: [
      'public_observation_inputs_present',
      'all_targets_have_public_url',
      'all_targets_have_observer_ref',
      'all_targets_have_observed_content_digest',
      'all_targets_scope_matches_manifest',
      'all_targets_non_claims_present',
      'all_targets_evidence_references_present'
    ].every((criteria) => gate.blocking_criteria.includes(criteria)),
    all_input_targets_pending: targets.every((target) => target.input_status === 'PENDING_INPUTS'),
    all_input_targets_without_public_url: targets.every((target) => target.public_url === null),
    all_input_targets_without_observer_ref: targets.every((target) => target.observer_ref === null),
    all_input_targets_without_observed_content_digest: targets.every((target) => target.observed_content_digest === null),
    all_input_targets_incomplete: targets.every((target) => target.input_complete === false),
    all_input_targets_unverified: targets.every((target) => target.input_verified === false),
    all_input_targets_not_ready_for_gate_retry: targets.every((target) => target.ready_for_observation_gate_retry === false),
    observation_inputs_collected: false,
    observation_inputs_verified: false,
    ready_for_observation_gate_retry: false,
    input_pack_controls: [
      'define_required_observation_inputs',
      'bind_inputs_to_observation_targets',
      'do_not_supply_placeholder_public_url',
      'do_not_supply_placeholder_observer_ref',
      'do_not_supply_placeholder_content_digest',
      'require_human_or_operator_input_submission',
      'require_content_digest_before_gate_retry',
      'require_scope_match_result_before_gate_retry',
      'require_non_claims_result_before_gate_retry',
      'require_evidence_reference_result_before_gate_retry',
      'do_not_infer_observation_from_input_pack_definition',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_missing_input_pack_values'
    ],
    input_pack_boundary: {
      controlled_information_surface_only: true,
      input_pack_definition_only: true,
      no_public_observation_recorded: true,
      no_observation_input_values_supplied: true,
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
    source_public_surface_observation_gate_evaluated: source.readiness_state.public_surface_observation_gate_evaluated === true,
    source_public_surface_observation_gate_passed: source.readiness_state.public_surface_observation_gate_passed === true,
    source_observation_gate_blocked_missing_inputs: source.readiness_state.observation_gate_blocked_missing_inputs === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_observation_input_pack_defined: true,
    public_surface_observation_input_pack_ready: true,
    public_surface_observation_inputs_collected: false,
    public_surface_observation_inputs_verified: false,
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
    input_pack_comment: 'The input pack defines the required public observation inputs but intentionally supplies no observation values. Public observation remains unavailable until concrete public URLs, observer references, observed content digests, scope-match results, non-claims results and evidence-reference results are submitted and verified.',
    ai_input_pack_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationInputPack(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildObservationInputPackPayload(source);

  const checklist = {
    source_public_surface_observation_gate_hash_valid: validHash(source),
    source_public_surface_observation_gate_evaluated: source.readiness_state.public_surface_observation_gate_evaluated === true,
    source_public_surface_observation_gate_blocked_missing_inputs: source.readiness_state.observation_gate_blocked_missing_inputs === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    all_gate_blocking_criteria_imported: payload.all_gate_blocking_criteria_imported,
    all_input_targets_pending: payload.all_input_targets_pending,
    all_input_targets_without_public_url: payload.all_input_targets_without_public_url,
    all_input_targets_without_observer_ref: payload.all_input_targets_without_observer_ref,
    all_input_targets_without_observed_content_digest: payload.all_input_targets_without_observed_content_digest,
    all_input_targets_incomplete: payload.all_input_targets_incomplete,
    all_input_targets_unverified: payload.all_input_targets_unverified,
    all_input_targets_not_ready_for_gate_retry: payload.all_input_targets_not_ready_for_gate_retry,
    observation_inputs_collected: payload.observation_inputs_collected,
    observation_inputs_verified: payload.observation_inputs_verified,
    ready_for_observation_gate_retry: payload.ready_for_observation_gate_retry,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_input_pack_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-103-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_PACK',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK-2027-PROG-103',
    issue_id: 'PROG-103',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-PACK',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_gate_ref: SOURCE_REF,
    source_public_surface_observation_gate_revision_hash: source.revision_hash,
    source_public_surface_observation_gate_revision_hash_valid: validHash(source),

    level1_public_surface_observation_input_pack_status: STATUS,

    inherited_public_surface_observation_gate: {
      observation_gate_status: source.level1_public_surface_observation_gate_status,
      gate_scope: source.public_surface_observation_gate.gate_scope,
      gate_status: source.public_surface_observation_gate.gate_status,
      gate_result: source.public_surface_observation_gate.gate_result,
      public_surface_observation_gate_evaluated: source.readiness_state.public_surface_observation_gate_evaluated,
      public_surface_observation_gate_passed: source.readiness_state.public_surface_observation_gate_passed,
      observation_gate_blocked_missing_inputs: source.readiness_state.observation_gate_blocked_missing_inputs,
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

    public_surface_observation_input_pack: {
      ...payload,
      public_surface_observation_input_pack_payload_digest: sha256Digest(payload),
      observation_input_pack_checklist: checklist,
      public_surface_observation_input_pack_is_defined: true,
      public_surface_observation_input_pack_is_pending_inputs: true,
      public_surface_observation_input_pack_is_not_observation_evidence: true,
      public_surface_observation_input_pack_is_not_public_observation_ready: true,
      public_surface_observation_input_pack_is_not_external_customer_readiness: true,
      public_surface_observation_input_pack_is_not_banking_pack_readiness: true,
      public_surface_observation_input_pack_is_not_launch_readiness: true,
      public_surface_observation_input_pack_is_not_production_readiness: true,
      public_surface_observation_input_pack_is_not_legal_validity: true,
      public_surface_observation_input_pack_is_not_security_certification: true,
      public_surface_observation_input_pack_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_GATE_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_GATE_NOT_EVALUATED',
      'PUBLIC_SURFACE_OBSERVATION_GATE_NOT_BLOCKED_AS_EXPECTED',
      'OBSERVATION_INPUT_TARGET_MISSING',
      'PUBLIC_URL_PLACEHOLDER_NOT_ALLOWED',
      'OBSERVER_REF_PLACEHOLDER_NOT_ALLOWED',
      'OBSERVED_CONTENT_DIGEST_PLACEHOLDER_NOT_ALLOWED',
      'OBSERVATION_INPUTS_NOT_COLLECTED',
      'OBSERVATION_INPUTS_NOT_VERIFIED',
      'OBSERVATION_GATE_RETRY_NOT_READY',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_INPUT_PACK_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_input_pack_defined: true,
      public_surface_observation_input_pack_ready: true,
      source_public_surface_observation_gate_bound: true,
      public_surface_observation_gate_evaluated: true,
      public_surface_observation_gate_passed: false,
      observation_gate_blocked_missing_inputs: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      all_gate_blocking_criteria_imported: payload.all_gate_blocking_criteria_imported,
      all_input_targets_pending: payload.all_input_targets_pending,
      all_input_targets_without_public_url: payload.all_input_targets_without_public_url,
      all_input_targets_without_observer_ref: payload.all_input_targets_without_observer_ref,
      all_input_targets_without_observed_content_digest: payload.all_input_targets_without_observed_content_digest,
      public_surface_observation_inputs_collected: false,
      public_surface_observation_inputs_verified: false,
      public_surface_observation_gate_retry_ready: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-104-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION',

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

function writeLevel1PublicSurfaceObservationInputPack(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationInputPack({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-103-level1-public-surface-observation-input-pack.json';
  const doc = writeLevel1PublicSurfaceObservationInputPack(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_103_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildInputTargets,
  buildObservationInputPackPayload,
  buildLevel1PublicSurfaceObservationInputPack,
  writeLevel1PublicSurfaceObservationInputPack
};
