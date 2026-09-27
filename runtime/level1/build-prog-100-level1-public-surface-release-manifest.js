'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_RELEASE_MANIFEST_DEFINED_CONTROLLED_INFORMATION_ONLY';
const SOURCE_REF = 'docs/launch/level1/prog-099-level1-public-surface-registry-entry.json';

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

function buildManifestSurfaces(source) {
  const entry = source.public_surface_registry_entry;

  return entry.registered_surfaces.map((surface) => ({
    release_surface_id: surface.registry_surface_id.replace('PUBLIC-SURFACE::', 'PUBLIC-SURFACE-RELEASE::'),
    registry_surface_id: surface.registry_surface_id,
    surface_type: surface.surface_type,
    surface_label: surface.surface_label,
    source_registry_entry_ref: SOURCE_REF,
    publication_authorized: surface.publication_authorized,
    authorization_scope: surface.authorization_scope,
    ready_for_controlled_publication: surface.ready_for_controlled_publication,
    included_in_release_manifest: true,
    release_manifest_expands_scope: false,
    customer_data_allowed: false,
    customer_logo_allowed_without_authorization: false,
    legal_validity_claim_allowed: false,
    public_accreditation_claim_allowed: false,
    procurement_eligibility_claim_allowed: false,
    security_certification_claim_allowed: false,
    ai_authority_claim_allowed: false,
    external_customer_delivery_claim_allowed: false,
    banking_pack_claim_allowed: false,
    level1_launch_claim_allowed: false,
    production_claim_allowed: false
  }));
}

function buildReleaseManifestPayload(source) {
  const entry = source.public_surface_registry_entry;
  const manifestSurfaces = buildManifestSurfaces(source);

  return {
    public_surface_release_manifest_id: 'PUBLIC-SURFACE-RELEASE-MANIFEST::HBCE-L1-DECISION-PROOF-0001',
    release_manifest_key: 'hbce.level1.public_surface.release_manifest.controlled_information.0001',
    source_public_surface_registry_entry_ref: SOURCE_REF,
    source_public_surface_registry_entry_digest: entry.public_surface_registry_entry_payload_digest,
    release_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    release_status: 'RELEASE_MANIFEST_DEFINED_CONTROLLED_INFORMATION_ONLY',
    release_mode: 'PUBLIC_INFORMATION_SURFACE_RELEASE_MANIFEST',
    defined_at: '2027-01-19T17:00:00Z',
    publication_authorization_scope: entry.publication_authorization_scope,
    released_surface_types: entry.registered_surface_types,
    released_surface_count: manifestSurfaces.length,
    release_surfaces: manifestSurfaces,
    required_release_source_refs: [
      'docs/launch/level1/prog-093-level1-public-surface-scope-lock.json',
      'docs/launch/level1/prog-094-level1-public-surface-content-model.json',
      'docs/launch/level1/prog-095-level1-public-surface-copy-pack.json',
      'docs/launch/level1/prog-096-level1-public-surface-evidence-index.json',
      'docs/launch/level1/prog-097-level1-public-surface-readiness-gate.json',
      'docs/launch/level1/prog-098-level1-public-surface-publication-snapshot.json',
      'docs/launch/level1/prog-099-level1-public-surface-registry-entry.json'
    ],
    required_release_source_count: 7,
    registry_entry_ready: entry.public_surface_registry_entry_ready,
    public_surface_ready_at_source: entry.public_surface_ready,
    publication_authorized_at_source: entry.publication_authorized,
    publication_authorization_scope_limited_at_source: entry.publication_authorization_scope_limited,
    all_registered_surfaces_in_manifest: entry.registered_surface_types.every((surfaceType) =>
      manifestSurfaces.some((surface) => surface.surface_type === surfaceType)
    ),
    all_manifest_surfaces_authorized: manifestSurfaces.every((surface) => surface.publication_authorized === true),
    all_manifest_surfaces_ready_for_controlled_publication: manifestSurfaces.every((surface) => surface.ready_for_controlled_publication === true),
    all_manifest_surface_boundaries_preserved: manifestSurfaces.every((surface) =>
      surface.release_manifest_expands_scope === false &&
      surface.customer_data_allowed === false &&
      surface.customer_logo_allowed_without_authorization === false &&
      surface.legal_validity_claim_allowed === false &&
      surface.public_accreditation_claim_allowed === false &&
      surface.procurement_eligibility_claim_allowed === false &&
      surface.security_certification_claim_allowed === false &&
      surface.ai_authority_claim_allowed === false &&
      surface.external_customer_delivery_claim_allowed === false &&
      surface.banking_pack_claim_allowed === false &&
      surface.level1_launch_claim_allowed === false &&
      surface.production_claim_allowed === false
    ),
    approved_public_surface_claims_release_manifest: entry.approved_public_surface_claims_registry,
    blocked_claims_release_manifest: entry.blocked_claims_registry,
    release_manifest_controls: [
      'release_only_registered_surface_types',
      'preserve_controlled_public_information_scope',
      'preserve_registry_entry_hash',
      'preserve_publication_snapshot_hash',
      'preserve_publication_source_references',
      'preserve_non_claims_near_positive_claims',
      'do_not_add_customer_data',
      'do_not_add_customer_logos_without_authorization',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_release_manifest_delta'
    ],
    release_manifest_boundary: {
      controlled_information_surface_only: true,
      release_manifest_only: true,
      source_registry_entry_required: true,
      source_publication_snapshot_required: true,
      source_readiness_gate_required: true,
      source_evidence_index_required: true,
      source_copy_pack_required: true,
      source_content_model_required: true,
      source_scope_lock_required: true,
      public_observation_not_recorded: true,
      synthetic_demo_boundary_preserved: true,
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
    source_public_surface_registry_entry_ready: source.readiness_state.public_surface_registry_entry_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_release_manifest_ready: true,
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    public_surface_observation_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    release_manifest_comment: 'The release manifest records the controlled public information surface release set derived from PROG-099. It does not record public observation, external customer delivery readiness, banking readiness, Level 1 launch readiness, production readiness, legal validity, procurement eligibility, security certification or AI authority.',
    ai_release_manifest_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceReleaseManifest(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildReleaseManifestPayload(source);

  const checklist = {
    source_public_surface_registry_entry_hash_valid: validHash(source),
    source_public_surface_registry_entry_ready: source.readiness_state.public_surface_registry_entry_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    all_registered_surfaces_in_manifest: payload.all_registered_surfaces_in_manifest,
    all_manifest_surfaces_authorized: payload.all_manifest_surfaces_authorized,
    all_manifest_surfaces_ready_for_controlled_publication: payload.all_manifest_surfaces_ready_for_controlled_publication,
    all_manifest_surface_boundaries_preserved: payload.all_manifest_surface_boundaries_preserved,
    blocked_claims_preserved: Object.values(payload.blocked_claims_release_manifest).every((value) => value === true),
    public_observation_not_recorded: payload.public_surface_observation_ready === false,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_release_manifest_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-100-PUBLIC-SURFACE-RELEASE-MANIFEST-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_RELEASE_MANIFEST',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-RELEASE-MANIFEST-2027-PROG-100',
    issue_id: 'PROG-100',
    priority: 'LEVEL1-PUBLIC-SURFACE-RELEASE-MANIFEST',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_registry_entry_ref: SOURCE_REF,
    source_public_surface_registry_entry_revision_hash: source.revision_hash,
    source_public_surface_registry_entry_revision_hash_valid: validHash(source),

    level1_public_surface_release_manifest_status: STATUS,

    inherited_public_surface_registry_entry: {
      registry_entry_status: source.level1_public_surface_registry_entry_status,
      registry_scope: source.public_surface_registry_entry.registry_scope,
      registry_status: source.public_surface_registry_entry.registry_status,
      public_surface_registry_entry_ready: source.readiness_state.public_surface_registry_entry_ready,
      public_surface_ready: source.readiness_state.public_surface_ready,
      publication_authorized: source.readiness_state.publication_authorized,
      publication_authorization_scope: source.readiness_state.publication_authorization_scope,
      prior_public_surface_release_manifest_ready: source.readiness_state.public_surface_release_manifest_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_release_manifest: {
      ...payload,
      public_surface_release_manifest_payload_digest: sha256Digest(payload),
      release_manifest_checklist: checklist,
      public_surface_release_manifest_defined: true,
      public_surface_release_manifest_is_controlled_information_only: true,
      public_surface_release_manifest_is_not_public_observation: true,
      public_surface_release_manifest_is_not_external_customer_readiness: true,
      public_surface_release_manifest_is_not_banking_pack_readiness: true,
      public_surface_release_manifest_is_not_launch_readiness: true,
      public_surface_release_manifest_is_not_production_readiness: true,
      public_surface_release_manifest_is_not_legal_validity: true,
      public_surface_release_manifest_is_not_security_certification: true,
      public_surface_release_manifest_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_RELEASE_MANIFEST_MISSING',
      'SOURCE_PUBLIC_SURFACE_REGISTRY_ENTRY_HASH_INVALID',
      'PUBLIC_SURFACE_REGISTRY_ENTRY_NOT_READY',
      'PUBLICATION_NOT_AUTHORIZED',
      'PUBLICATION_AUTHORIZATION_SCOPE_NOT_LIMITED',
      'REGISTERED_SURFACE_NOT_IN_RELEASE_MANIFEST',
      'MANIFEST_SURFACE_NOT_AUTHORIZED',
      'MANIFEST_SURFACE_BOUNDARY_NOT_PRESERVED',
      'UNSUPPORTED_PUBLIC_OBSERVATION_CLAIM',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_RELEASE_MANIFEST_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_release_manifest_defined: true,
      public_surface_release_manifest_ready: true,
      source_public_surface_registry_entry_bound: true,
      public_surface_registry_entry_ready: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      all_registered_surfaces_in_manifest: payload.all_registered_surfaces_in_manifest,
      all_manifest_surfaces_authorized: payload.all_manifest_surfaces_authorized,
      all_manifest_surfaces_ready_for_controlled_publication: payload.all_manifest_surfaces_ready_for_controlled_publication,
      all_manifest_surface_boundaries_preserved: payload.all_manifest_surface_boundaries_preserved,
      public_surface_observation_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-101-HBCE-LEVEL1-PUBLIC-SURFACE-OBSERVATION-RECORD',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
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

function writeLevel1PublicSurfaceReleaseManifest(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceReleaseManifest({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-100-level1-public-surface-release-manifest.json';
  const doc = writeLevel1PublicSurfaceReleaseManifest(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_100_LEVEL1_PUBLIC_SURFACE_RELEASE_MANIFEST_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildManifestSurfaces,
  buildReleaseManifestPayload,
  buildLevel1PublicSurfaceReleaseManifest,
  writeLevel1PublicSurfaceReleaseManifest
};
