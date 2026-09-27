'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_DEFINED_NOT_COLLECTED';
const SOURCE_REF = 'docs/launch/level1/prog-103-level1-public-surface-observation-input-pack.json';

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

function buildCollectionItems(source) {
  const pack = source.public_surface_observation_input_pack;

  return pack.input_targets.map((target) => ({
    collection_item_id: target.input_target_id.replace('PUBLIC-SURFACE-OBSERVATION-INPUT::', 'PUBLIC-SURFACE-OBSERVATION-COLLECTION::'),
    input_target_id: target.input_target_id,
    observation_target_id: target.observation_target_id,
    surface_type: target.surface_type,
    source_input_pack_ref: SOURCE_REF,
    collection_status: 'NOT_COLLECTED',
    collection_required: true,
    collection_channel_required: true,
    collected_by: null,
    collected_at: null,
    collection_method: null,
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
    customer_data_declared_absent: null,
    customer_logo_authorization_declared: null,
    forbidden_claims_declared_absent: null,
    collection_complete: false,
    collection_verified: false,
    ready_for_input_verification: false,
    ready_for_observation_gate_retry: false
  }));
}

function buildObservationInputCollectionPayload(source) {
  const pack = source.public_surface_observation_input_pack;
  const items = buildCollectionItems(source);

  return {
    public_surface_observation_input_collection_id: 'PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION::HBCE-L1-DECISION-PROOF-0001',
    input_collection_key: 'hbce.level1.public_surface.observation_input_collection.controlled_information.0001',
    source_public_surface_observation_input_pack_ref: SOURCE_REF,
    source_public_surface_observation_input_pack_digest: pack.public_surface_observation_input_pack_payload_digest,
    input_collection_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    input_collection_status: 'DEFINED_NOT_COLLECTED',
    input_collection_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_INPUT_COLLECTION',
    defined_at: '2027-01-19T17:20:00Z',
    publication_authorization_scope: source.readiness_state.publication_authorization_scope,
    collection_items: items,
    collection_item_count: items.length,
    required_inputs: pack.required_inputs,
    required_input_count: pack.required_input_count,
    all_input_targets_have_collection_items: pack.input_targets.every((target) =>
      items.some((item) => item.input_target_id === target.input_target_id)
    ),
    all_collection_items_not_collected: items.every((item) => item.collection_status === 'NOT_COLLECTED'),
    all_collection_items_without_public_url: items.every((item) => item.public_url === null),
    all_collection_items_without_observer_ref: items.every((item) => item.observer_ref === null),
    all_collection_items_without_observed_content_digest: items.every((item) => item.observed_content_digest === null),
    all_collection_items_incomplete: items.every((item) => item.collection_complete === false),
    all_collection_items_unverified: items.every((item) => item.collection_verified === false),
    all_collection_items_not_ready_for_input_verification: items.every((item) => item.ready_for_input_verification === false),
    all_collection_items_not_ready_for_gate_retry: items.every((item) => item.ready_for_observation_gate_retry === false),
    observation_inputs_collected: false,
    observation_inputs_verified: false,
    input_verification_ready: false,
    observation_gate_retry_ready: false,
    input_collection_controls: [
      'define_collection_items_for_each_input_target',
      'require_operator_submission_for_collection',
      'require_public_url_value_before_collection_complete',
      'require_observer_ref_value_before_collection_complete',
      'require_observed_content_digest_before_collection_complete',
      'require_scope_match_result_before_collection_complete',
      'require_non_claims_presence_result_before_collection_complete',
      'require_evidence_reference_presence_result_before_collection_complete',
      'do_not_supply_placeholder_public_url',
      'do_not_supply_placeholder_observer_ref',
      'do_not_supply_placeholder_content_digest',
      'do_not_infer_collection_from_input_pack_definition',
      'do_not_infer_public_observation_from_collection_definition',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_missing_collection_values'
    ],
    input_collection_boundary: {
      controlled_information_surface_only: true,
      input_collection_definition_only: true,
      no_public_observation_recorded: true,
      no_observation_input_values_collected: true,
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
    source_public_surface_observation_input_pack_ready: source.readiness_state.public_surface_observation_input_pack_ready === true,
    source_observation_inputs_collected: source.readiness_state.public_surface_observation_inputs_collected === true,
    source_observation_inputs_verified: source.readiness_state.public_surface_observation_inputs_verified === true,
    source_observation_gate_retry_ready: source.readiness_state.public_surface_observation_gate_retry_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_observation_input_collection_defined: true,
    public_surface_observation_input_collection_ready: true,
    public_surface_observation_inputs_collected: false,
    public_surface_observation_inputs_verified: false,
    public_surface_observation_input_verification_ready: false,
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
    input_collection_comment: 'The collection artifact defines how public observation input values must be collected from a human or operator, but records no collected values. Public observation remains unavailable until concrete values are collected and verified.',
    ai_input_collection_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationInputCollection(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildObservationInputCollectionPayload(source);

  const checklist = {
    source_public_surface_observation_input_pack_hash_valid: validHash(source),
    source_public_surface_observation_input_pack_ready: source.readiness_state.public_surface_observation_input_pack_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    all_input_targets_have_collection_items: payload.all_input_targets_have_collection_items,
    all_collection_items_not_collected: payload.all_collection_items_not_collected,
    all_collection_items_without_public_url: payload.all_collection_items_without_public_url,
    all_collection_items_without_observer_ref: payload.all_collection_items_without_observer_ref,
    all_collection_items_without_observed_content_digest: payload.all_collection_items_without_observed_content_digest,
    all_collection_items_incomplete: payload.all_collection_items_incomplete,
    all_collection_items_unverified: payload.all_collection_items_unverified,
    all_collection_items_not_ready_for_input_verification: payload.all_collection_items_not_ready_for_input_verification,
    all_collection_items_not_ready_for_gate_retry: payload.all_collection_items_not_ready_for_gate_retry,
    observation_inputs_collected: payload.observation_inputs_collected,
    observation_inputs_verified: payload.observation_inputs_verified,
    input_verification_ready: payload.input_verification_ready,
    observation_gate_retry_ready: payload.observation_gate_retry_ready,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_input_collection_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-104-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION-2027-PROG-104',
    issue_id: 'PROG-104',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-COLLECTION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_observation_input_pack_ref: SOURCE_REF,
    source_public_surface_observation_input_pack_revision_hash: source.revision_hash,
    source_public_surface_observation_input_pack_revision_hash_valid: validHash(source),

    level1_public_surface_observation_input_collection_status: STATUS,

    inherited_public_surface_observation_input_pack: {
      input_pack_status: source.level1_public_surface_observation_input_pack_status,
      input_pack_scope: source.public_surface_observation_input_pack.input_pack_scope,
      input_pack_mode: source.public_surface_observation_input_pack.input_pack_mode,
      public_surface_observation_input_pack_ready: source.readiness_state.public_surface_observation_input_pack_ready,
      public_surface_observation_inputs_collected: source.readiness_state.public_surface_observation_inputs_collected,
      public_surface_observation_inputs_verified: source.readiness_state.public_surface_observation_inputs_verified,
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

    public_surface_observation_input_collection: {
      ...payload,
      public_surface_observation_input_collection_payload_digest: sha256Digest(payload),
      observation_input_collection_checklist: checklist,
      public_surface_observation_input_collection_is_defined: true,
      public_surface_observation_input_collection_is_not_collected: true,
      public_surface_observation_input_collection_is_not_verified: true,
      public_surface_observation_input_collection_is_not_observation_evidence: true,
      public_surface_observation_input_collection_is_not_public_observation_ready: true,
      public_surface_observation_input_collection_is_not_external_customer_readiness: true,
      public_surface_observation_input_collection_is_not_banking_pack_readiness: true,
      public_surface_observation_input_collection_is_not_launch_readiness: true,
      public_surface_observation_input_collection_is_not_production_readiness: true,
      public_surface_observation_input_collection_is_not_legal_validity: true,
      public_surface_observation_input_collection_is_not_security_certification: true,
      public_surface_observation_input_collection_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_MISSING',
      'SOURCE_PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_HASH_INVALID',
      'PUBLIC_SURFACE_OBSERVATION_INPUT_PACK_NOT_READY',
      'OBSERVATION_COLLECTION_ITEM_MISSING',
      'PUBLIC_URL_NOT_COLLECTED',
      'OBSERVER_REF_NOT_COLLECTED',
      'OBSERVED_CONTENT_DIGEST_NOT_COLLECTED',
      'OBSERVATION_INPUTS_NOT_COLLECTED',
      'OBSERVATION_INPUTS_NOT_VERIFIED',
      'INPUT_VERIFICATION_NOT_READY',
      'OBSERVATION_GATE_RETRY_NOT_READY',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_INPUT_COLLECTION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_input_collection_defined: true,
      public_surface_observation_input_collection_ready: true,
      source_public_surface_observation_input_pack_bound: true,
      public_surface_observation_input_pack_ready: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      all_input_targets_have_collection_items: payload.all_input_targets_have_collection_items,
      all_collection_items_not_collected: payload.all_collection_items_not_collected,
      all_collection_items_without_public_url: payload.all_collection_items_without_public_url,
      all_collection_items_without_observer_ref: payload.all_collection_items_without_observer_ref,
      all_collection_items_without_observed_content_digest: payload.all_collection_items_without_observed_content_digest,
      public_surface_observation_inputs_collected: false,
      public_surface_observation_inputs_verified: false,
      public_surface_observation_input_verification_ready: false,
      public_surface_observation_gate_retry_ready: false,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-105-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-INPUT-VERIFICATION',

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

function writeLevel1PublicSurfaceObservationInputCollection(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationInputCollection({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-104-level1-public-surface-observation-input-collection.json';
  const doc = writeLevel1PublicSurfaceObservationInputCollection(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_104_LEVEL1_PUBLIC_SURFACE_OBSERVATION_INPUT_COLLECTION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildCollectionItems,
  buildObservationInputCollectionPayload,
  buildLevel1PublicSurfaceObservationInputCollection,
  writeLevel1PublicSurfaceObservationInputCollection
};
