'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_OBSERVATION_RECORD_DEFINED_NOT_OBSERVED';
const SOURCE_REF = 'docs/launch/level1/prog-100-level1-public-surface-release-manifest.json';

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

function buildObservationTargets(source) {
  const manifest = source.public_surface_release_manifest;

  return manifest.release_surfaces.map((surface) => ({
    observation_target_id: surface.release_surface_id.replace('PUBLIC-SURFACE-RELEASE::', 'PUBLIC-SURFACE-OBSERVATION-TARGET::'),
    release_surface_id: surface.release_surface_id,
    registry_surface_id: surface.registry_surface_id,
    surface_type: surface.surface_type,
    surface_label: surface.surface_label,
    source_release_manifest_ref: SOURCE_REF,
    observation_required: true,
    observation_status: 'NOT_OBSERVED',
    public_url: null,
    observed_at: null,
    observer_ref: null,
    observation_method: null,
    observed_content_digest: null,
    observed_headers_digest: null,
    observed_status_code: null,
    observed_surface_available: false,
    observed_scope_matches_manifest: false,
    observed_non_claims_present: false,
    observed_evidence_references_present: false,
    customer_data_observed: false,
    customer_logo_observed_without_authorization: false,
    legal_validity_claim_observed: false,
    public_accreditation_claim_observed: false,
    procurement_eligibility_claim_observed: false,
    security_certification_claim_observed: false,
    ai_authority_claim_observed: false,
    external_customer_delivery_claim_observed: false,
    banking_pack_claim_observed: false,
    level1_launch_claim_observed: false,
    production_claim_observed: false
  }));
}

function buildObservationRecordPayload(source) {
  const manifest = source.public_surface_release_manifest;
  const targets = buildObservationTargets(source);

  return {
    public_surface_observation_record_id: 'PUBLIC-SURFACE-OBSERVATION-RECORD::HBCE-L1-DECISION-PROOF-0001',
    observation_record_key: 'hbce.level1.public_surface.observation_record.controlled_information.0001',
    source_public_surface_release_manifest_ref: SOURCE_REF,
    source_public_surface_release_manifest_digest: manifest.public_surface_release_manifest_payload_digest,
    observation_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    observation_status: 'DEFINED_NOT_OBSERVED',
    observation_mode: 'PUBLIC_INFORMATION_SURFACE_OBSERVATION_RECORD',
    defined_at: '2027-01-19T17:05:00Z',
    publication_authorization_scope: manifest.publication_authorization_scope,
    observation_targets: targets,
    observation_target_count: targets.length,
    required_observation_surface_types: manifest.released_surface_types,
    required_observation_surface_count: manifest.released_surface_count,
    public_observation_inputs_required: [
      'public_url',
      'observed_at',
      'observer_ref',
      'observation_method',
      'observed_content_digest',
      'observed_scope_match_result',
      'observed_non_claims_presence_result',
      'observed_evidence_reference_presence_result'
    ],
    public_observation_inputs_present: false,
    all_release_surfaces_have_observation_targets: manifest.released_surface_types.every((surfaceType) =>
      targets.some((target) => target.surface_type === surfaceType)
    ),
    all_observation_targets_unobserved: targets.every((target) => target.observation_status === 'NOT_OBSERVED'),
    all_observation_targets_without_public_url: targets.every((target) => target.public_url === null),
    all_observation_targets_without_content_digest: targets.every((target) => target.observed_content_digest === null),
    all_observation_claims_absent: targets.every((target) =>
      target.observed_surface_available === false &&
      target.observed_scope_matches_manifest === false &&
      target.observed_non_claims_present === false &&
      target.observed_evidence_references_present === false
    ),
    all_forbidden_claims_absent_from_record: targets.every((target) =>
      target.customer_data_observed === false &&
      target.customer_logo_observed_without_authorization === false &&
      target.legal_validity_claim_observed === false &&
      target.public_accreditation_claim_observed === false &&
      target.procurement_eligibility_claim_observed === false &&
      target.security_certification_claim_observed === false &&
      target.ai_authority_claim_observed === false &&
      target.external_customer_delivery_claim_observed === false &&
      target.banking_pack_claim_observed === false &&
      target.level1_launch_claim_observed === false &&
      target.production_claim_observed === false
    ),
    approved_public_surface_claims_observation_record: manifest.approved_public_surface_claims_release_manifest,
    blocked_claims_observation_record: manifest.blocked_claims_release_manifest,
    observation_record_controls: [
      'define_observation_targets_only',
      'require_public_url_before_observation',
      'require_observer_ref_before_observation',
      'require_observed_content_digest_before_observation',
      'require_scope_match_before_public_observation_ready',
      'require_non_claims_presence_before_public_observation_ready',
      'require_evidence_references_before_public_observation_ready',
      'do_not_infer_public_observation_from_release_manifest',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_missing_observation_input'
    ],
    observation_record_boundary: {
      controlled_information_surface_only: true,
      observation_record_definition_only: true,
      no_public_observation_recorded: true,
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
    source_public_surface_release_manifest_ready: source.readiness_state.public_surface_release_manifest_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_observation_record_defined: true,
    public_surface_observation_record_ready: true,
    public_surface_observed: false,
    public_surface_observation_ready: false,
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    observation_record_comment: 'The observation record defines the public observation targets derived from PROG-100 but does not record an actual public observation. A future observation gate must supply public URL, observer reference, observed content digest and scope/non-claim/evidence-reference checks before public observation readiness can become true.',
    ai_observation_record_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceObservationRecord(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildObservationRecordPayload(source);

  const checklist = {
    source_public_surface_release_manifest_hash_valid: validHash(source),
    source_public_surface_release_manifest_ready: source.readiness_state.public_surface_release_manifest_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    all_release_surfaces_have_observation_targets: payload.all_release_surfaces_have_observation_targets,
    all_observation_targets_unobserved: payload.all_observation_targets_unobserved,
    all_observation_targets_without_public_url: payload.all_observation_targets_without_public_url,
    all_observation_targets_without_content_digest: payload.all_observation_targets_without_content_digest,
    all_observation_claims_absent: payload.all_observation_claims_absent,
    all_forbidden_claims_absent_from_record: payload.all_forbidden_claims_absent_from_record,
    public_observation_inputs_required: true,
    public_observation_inputs_present: payload.public_observation_inputs_present,
    public_surface_observed: payload.public_surface_observed,
    public_observation_ready: payload.public_surface_observation_ready,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_observation_record_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-101-PUBLIC-SURFACE-OBSERVATION-RECORD-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_OBSERVATION_RECORD',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-OBSERVATION-RECORD-2027-PROG-101',
    issue_id: 'PROG-101',
    priority: 'LEVEL1-PUBLIC-SURFACE-OBSERVATION-RECORD',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_release_manifest_ref: SOURCE_REF,
    source_public_surface_release_manifest_revision_hash: source.revision_hash,
    source_public_surface_release_manifest_revision_hash_valid: validHash(source),

    level1_public_surface_observation_record_status: STATUS,

    inherited_public_surface_release_manifest: {
      release_manifest_status: source.level1_public_surface_release_manifest_status,
      release_scope: source.public_surface_release_manifest.release_scope,
      release_status: source.public_surface_release_manifest.release_status,
      public_surface_release_manifest_ready: source.readiness_state.public_surface_release_manifest_ready,
      public_surface_ready: source.readiness_state.public_surface_ready,
      publication_authorized: source.readiness_state.publication_authorized,
      publication_authorization_scope: source.readiness_state.publication_authorization_scope,
      prior_public_surface_observation_ready: source.readiness_state.public_surface_observation_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_observation_record: {
      ...payload,
      public_surface_observation_record_payload_digest: sha256Digest(payload),
      observation_record_checklist: checklist,
      public_surface_observation_record_is_defined: true,
      public_surface_observation_record_is_not_observation_evidence: true,
      public_surface_observation_record_is_not_public_observation_ready: true,
      public_surface_observation_record_is_not_external_customer_readiness: true,
      public_surface_observation_record_is_not_banking_pack_readiness: true,
      public_surface_observation_record_is_not_launch_readiness: true,
      public_surface_observation_record_is_not_production_readiness: true,
      public_surface_observation_record_is_not_legal_validity: true,
      public_surface_observation_record_is_not_security_certification: true,
      public_surface_observation_record_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_OBSERVATION_RECORD_MISSING',
      'SOURCE_PUBLIC_SURFACE_RELEASE_MANIFEST_HASH_INVALID',
      'PUBLIC_SURFACE_RELEASE_MANIFEST_NOT_READY',
      'OBSERVATION_TARGET_MISSING',
      'PUBLIC_URL_MISSING',
      'OBSERVER_REF_MISSING',
      'OBSERVED_CONTENT_DIGEST_MISSING',
      'OBSERVED_SCOPE_MATCH_MISSING',
      'OBSERVED_NON_CLAIMS_PRESENCE_MISSING',
      'OBSERVED_EVIDENCE_REFERENCES_MISSING',
      'UNSUPPORTED_PUBLIC_OBSERVATION_READY_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_OBSERVATION_RECORD_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_observation_record_defined: true,
      public_surface_observation_record_ready: true,
      source_public_surface_release_manifest_bound: true,
      public_surface_release_manifest_ready: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      all_release_surfaces_have_observation_targets: payload.all_release_surfaces_have_observation_targets,
      all_observation_targets_unobserved: payload.all_observation_targets_unobserved,
      all_observation_targets_without_public_url: payload.all_observation_targets_without_public_url,
      all_observation_targets_without_content_digest: payload.all_observation_targets_without_content_digest,
      all_observation_claims_absent: payload.all_observation_claims_absent,
      all_forbidden_claims_absent_from_record: payload.all_forbidden_claims_absent_from_record,
      public_surface_observed: false,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-102-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-GATE',

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

function writeLevel1PublicSurfaceObservationRecord(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceObservationRecord({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-101-level1-public-surface-observation-record.json';
  const doc = writeLevel1PublicSurfaceObservationRecord(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_101_LEVEL1_PUBLIC_SURFACE_OBSERVATION_RECORD_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildObservationTargets,
  buildObservationRecordPayload,
  buildLevel1PublicSurfaceObservationRecord,
  writeLevel1PublicSurfaceObservationRecord
};
