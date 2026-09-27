'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_PACK_DEFINED_PENDING_REMEDIATION';
const SOURCE_REF = 'docs/launch/level1/prog-106-level1-public-surface-observation-retry-gate.json';

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
  const gate = source.public_surface_observation_retry_gate;

  return gate.retry_targets.map((target) => ({
    remediation_item_id: target.retry_target_id.replace('PUBLIC-SURFACE-OBSERVATION-RETRY::', 'PUBLIC-SURFACE-OBSERVATION-REMEDIATION::'),
    retry_target_id: target.retry_target_id,
    verification_item_id: target.verification_item_id,
    collection_item_id: target.collection_item_id,
    input_target_id: target.input_target_id,
    observation_target_id: target.observation_target_id,
    surface_type: target.surface_type,
    source_retry_gate_ref: SOURCE_REF,
    remediation_status: 'PENDING_REMEDIATION',
    remediation_required: true,
    remediation_actions: [
      'collect_public_url',
      'collect_observer_ref',
      'collect_observed_content_digest',
      'collect_scope_match_result',
      'collect_non_claims_presence_result',
      'collect_evidence_reference_presence_result',
      'declare_customer_data_absence',
      'declare_forbidden_claims_absence',
      'verify_collected_inputs',
      'rerun_observation_retry_gate'
    ],
    public_url_collection_required: true,
    observer_ref_collection_required: true,
    observed_content_digest_collection_required: true,
    scope_match_result_collection_required: true,
    non_claims_result_collection_required: true,
    evidence_reference_result_collection_required: true,
    customer_data_absence_declaration_required: true,
    forbidden_claims_absence_declaration_required: true,
    input_verification_required: true,
    retry_gate_rerun_required: true,
    public_url_collected: false,
    observer_ref_collected: false,
    observed_content_digest_collected: false,
    scope_match_result_collected: false,
    non_claims_result_collected: false,
    evidence_reference_result_collected: false,
    customer_data_absence_declared: false,
    forbidden_claims_absence_declared: false,
    input_verification_completed: false,
    input_verification_passed: false,
    retry_gate_rerun_completed: false,
    retry_gate_rerun_passed: false,
    remediation_complete: false,
    ready_for_input_collection: true,
    ready_for_input_verification: false,
    ready_for_retry_gate_rerun: false,
    remediation_comment: 'Remediation is pending because the retry gate is blocked by unverified observation inputs.'
  }));
}

function buildObservationRemediationPackPayload(source) {
  const gate = source.public_surface_observation_retry_gate;
  const items = buildRemediationItems(source);

  return {
    public_surface_observation_remediation_pack_id: 'PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK::HBCE-L1-DECISION-PROOF-0001',
    remediation_pack_key: 'hbce.level1.public_surface.observation_remediation_pack.controlled_information.0001',
    source_public_surface_observation_retry_gate_ref: SOURCE_REF,
    source_public_surface_observation_retry_gate_digest: gate.public_surface_observation_retry_gate_payload_digest,
    remediation_pack_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    remediation_pack_status: 'DEFINED_PENDING_REMEDIATION',
    remediation_pack_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_REMEDIATION_PACK',
    defined_at: '2027-01-19T17:35:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,
    imported_retry_gate_blocking_criteria: gate.blocking_criteria,
    imported_retry_gate_status: gate.retry_gate_status,
    imported_retry_gate_result: gate.retry_gate_result,
    remediation_items: items,
    remediation_item_count: items.length,
    all_retry_targets_have_remediation_items: gate.retry_targets.every((target) =>
      items.some((item) => item.retry_target_id === target.retry_target_id)
    ),
    all_remediation_items_pending: items.every((item) => item.remediation_status === 'PENDING_REMEDIATION'),
    all_remediation_items_require_public_url_collection: items.every((item) => item.public_url_collection_required === true),
    all_remediation_items_require_observer_ref_collection: items.every((item) => item.observer_ref_collection_required === true),
    all_remediation_items_require_observed_content_digest_collection: items.every((item) => item.observed_content_digest_collection_required === true),
    all_remediation_items_require_scope_match_result_collection: items.every((item) => item.scope_match_result_collection_required === true),
    all_remediation_items_require_non_claims_result_collection: items.every((item) => item.non_claims_result_collection_required === true),
    all_remediation_items_require_evidence_reference_result_collection: items.every((item) => item.evidence_reference_result_collection_required === true),
    all_remediation_items_require_input_verification: items.every((item) => item.input_verification_required === true),
    all_remediation_items_require_retry_gate_rerun: items.every((item) => item.retry_gate_rerun_required === true),
    all_remediation_items_not_complete: items.every((item) => item.remediation_complete === false),
    all_remediation_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_remediation_items_not_ready_for_retry_gate_rerun: items.every((item) => item.ready_for_retry_gate_rerun === false),
    remediation_actions_defined: true,
    remediation_actions_completed: false,
    input_collection_remediation_ready: true,
    input_verification_remediation_ready: false,
    retry_gate_rerun_ready: false,
    public_surface_observation_remediation_completed: false,
    observation_inputs_collected: false,
    observation_inputs_verified: false,
    input_verification_passed: false,
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
    remediation_controls: [
      'define_remediation_items_for_each_retry_target',
      'require_public_url_collection',
      'require_observer_ref_collection',
      'require_observed_content_digest_collection',
      'require_scope_match_result_collection',
      'require_non_claims_result_collection',
      'require_evidence_reference_result_collection',
      'require_customer_data_absence_declaration',
      'require_forbidden_claims_absence_declaration',
      'require_input_verification_after_collection',
      'require_retry_gate_rerun_after_verification_pass',
      'do_not_mark_remediation_complete_without_collected_inputs',
      'do_not_mark_verification_ready_without_collection',
      'do_not_rerun_retry_gate_without_verification_pass',
      'do_not_infer_public_observation_from_remediation_pack',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_incomplete_remediation'
    ],
    remediation_boundary: {
      controlled_information_surface_only: true,
      remediation_pack_definition_only: true,
      remediation_pending: true,
      no_public_observation_recorded: true,
      no_observation_retry_performed: true,
      no_remediation_execution_recorded: true,
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
    source_retry_gate_evaluated: source.readiness_state.public_surface_observation_retry_gate_evaluated === true,
    source_retry_gate_passed: source.readiness_state.public_surface_observation_retry_gate_passed === true,
    source_retry_gate_blocked_unverified_inputs: source.readiness_state.retry_gate_blocked_unverified_inputs === true,
    source_observation_inputs_collected: source.readiness_state.observation_inputs_collected === true,
    source_observation_inputs_verified: source.readiness_state.observation_inputs_verified === true,
    source_input_verification_performed: source.readiness_state.input_verification_performed === true,
    source_input_verification_passed: source.readiness_state.input_verification_passed === true,
    source_observation_retry_allowed: source.readiness_state.observation_retry_allowed === true,
    source_observation_retry_performed: source.readiness_state.observation_retry_performed === true,
    source_observation_retry_ready: source.readiness_state.observation_retry_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_observation_remediation_pack_defined: true,
    public_surface_observation_remediation_pack_ready: true,
    remediation_pack_comment: 'The remediation pack defines the required actions to resolve the blocked public surface observation retry gate. It does not execute remediation and does not make public observation ready.',
    ai_remediation_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationRemediationPack(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildObservationRemediationPackPayload(source);

  const checklist = {
    source_public_surface_observation_retry_gate_hash_valid: validHash(source),
    source_public_surface_observation_retry_gate_evaluated: source.readiness_state.public_surface_observation_retry_gate_evaluated === true,
    source_public_surface_observation_retry_gate_blocked: source.readiness_state.retry_gate_blocked_unverified_inputs === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    remediation_actions_defined: payload.remediation_actions_defined,
    remediation_actions_completed: payload.remediation_actions_completed,
    all_retry_targets_have_remediation_items: payload.all_retry_targets_have_remediation_items,
    all_remediation_items_pending: payload.all_remediation_items_pending,
    all_remediation_items_not_complete: payload.all_remediation_items_not_complete,
    input_collection_remediation_ready: payload.input_collection_remediation_ready,
    input_verification_remediation_ready: payload.input_verification_remediation_ready,
    retry_gate_rerun_ready: payload.retry_gate_rerun_ready,
    observation_inputs_collected: payload.observation_inputs_collected,
    observation_inputs_verified: payload.observation_inputs_verified,
    input_verification_passed: payload.input_verification_passed,
    observation_retry_allowed: payload.observation_retry_allowed,
    observation_retry_performed: payload.observation_retry_performed,
    observation_retry_ready: payload.observation_retry_ready,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_remediation_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-107-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_PACK',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK-2027-PROG-107',
    issue_id: 'PROG-107',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-PACK',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_retry_gate_ref: SOURCE_REF,
    source_public_surface_observation_retry_gate_revision_hash: source.revision_hash,
    source_public_surface_observation_retry_gate_revision_hash_valid: validHash(source),

    level1_public_surface_observation_remediation_pack_status: STATUS,

    inherited_public_surface_observation_retry_gate: {
      retry_gate_status: source.level1_public_surface_observation_retry_gate_status,
      retry_gate_scope: source.public_surface_observation_retry_gate.retry_gate_scope,
      retry_gate_result: source.public_surface_observation_retry_gate.retry_gate_result,
      public_surface_observation_retry_gate_evaluated: source.readiness_state.public_surface_observation_retry_gate_evaluated,
      public_surface_observation_retry_gate_passed: source.readiness_state.public_surface_observation_retry_gate_passed,
      retry_gate_blocked_unverified_inputs: source.readiness_state.retry_gate_blocked_unverified_inputs,
      observation_inputs_collected: source.readiness_state.observation_inputs_collected,
      observation_inputs_verified: source.readiness_state.observation_inputs_verified,
      input_verification_performed: source.readiness_state.input_verification_performed,
      input_verification_passed: source.readiness_state.input_verification_passed,
      observation_retry_allowed: source.readiness_state.observation_retry_allowed,
      observation_retry_performed: source.readiness_state.observation_retry_performed,
      observation_retry_ready: source.readiness_state.observation_retry_ready,
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

    public_surface_observation_remediation_pack: {
      ...payload,
      public_surface_observation_remediation_pack_payload_digest: sha256Digest(payload),
      observation_remediation_pack_checklist: checklist,
      public_surface_observation_remediation_pack_is_defined: true,
      public_surface_observation_remediation_pack_is_pending_remediation: true,
      public_surface_observation_remediation_pack_is_not_remediation_execution: true,
      public_surface_observation_remediation_pack_is_not_observation_evidence: true,
      public_surface_observation_remediation_pack_is_not_public_observation_ready: true,
      public_surface_observation_remediation_pack_is_not_external_customer_readiness: true,
      public_surface_observation_remediation_pack_is_not_banking_pack_readiness: true,
      public_surface_observation_remediation_pack_is_not_launch_readiness: true,
      public_surface_observation_remediation_pack_is_not_production_readiness: true,
      public_surface_observation_remediation_pack_is_not_legal_validity: true,
      public_surface_observation_remediation_pack_is_not_security_certification: true,
      public_surface_observation_remediation_pack_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_REMEDIATION_PACK_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_NOT_EVALUATED',
      'PUBLIC_SURFACE_OBSERVATION_RETRY_GATE_NOT_BLOCKED',
      'REMEDIATION_ITEM_MISSING',
      'REMEDIATION_ACTIONS_NOT_DEFINED',
      'REMEDIATION_ACTIONS_NOT_COMPLETED',
      'OBSERVATION_INPUTS_NOT_COLLECTED',
      'OBSERVATION_INPUTS_NOT_VERIFIED',
      'INPUT_VERIFICATION_NOT_PASSED',
      'OBSERVATION_RETRY_NOT_READY',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_REMEDIATION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_remediation_pack_defined: true,
      public_surface_observation_remediation_pack_ready: true,
      source_public_surface_observation_retry_gate_bound: true,
      public_surface_observation_retry_gate_evaluated: true,
      public_surface_observation_retry_gate_passed: false,
      retry_gate_blocked_unverified_inputs: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      remediation_actions_defined: true,
      remediation_actions_completed: false,
      all_retry_targets_have_remediation_items: payload.all_retry_targets_have_remediation_items,
      all_remediation_items_pending: payload.all_remediation_items_pending,
      all_remediation_items_not_complete: payload.all_remediation_items_not_complete,
      input_collection_remediation_ready: true,
      input_verification_remediation_ready: false,
      retry_gate_rerun_ready: false,
      public_surface_observation_remediation_completed: false,
      observation_inputs_collected: false,
      observation_inputs_verified: false,
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

    next_required_program: 'PROG-108-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-REMEDIATION-EXECUTION',

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

function writeLevel1PublicSurfaceObservationRemediationPack(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationRemediationPack({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-107-level1-public-surface-observation-remediation-pack.json';
  const doc = writeLevel1PublicSurfaceObservationRemediationPack(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_107_LEVEL1_PUBLIC_SURFACE_OBSERVATION_REMEDIATION_PACK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildRemediationItems,
  buildObservationRemediationPackPayload,
  buildLevel1PublicSurfaceObservationRemediationPack,
  writeLevel1PublicSurfaceObservationRemediationPack
};
