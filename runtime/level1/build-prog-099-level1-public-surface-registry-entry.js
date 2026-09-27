'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_REGISTRY_ENTRY_DEFINED_CONTROLLED_INFORMATION_ONLY';
const SOURCE_REF = 'docs/launch/level1/prog-098-level1-public-surface-publication-snapshot.json';

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

function registrySurfaceId(surfaceType) {
  return `PUBLIC-SURFACE::HBCE-L1::${surfaceType.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}`;
}

function buildRegisteredSurfaces(source) {
  const snapshot = source.public_surface_publication_snapshot;

  return snapshot.surface_snapshots.map((surface) => ({
    registry_surface_id: registrySurfaceId(surface.surface_type),
    surface_type: surface.surface_type,
    surface_label: surface.surface_label,
    source_publication_snapshot_ref: SOURCE_REF,
    source_surface_index: surface.surface_index,
    publication_authorized: surface.publication_authorized,
    authorization_scope: surface.authorization_scope,
    ready_for_controlled_publication: surface.ready_for_controlled_publication,
    required_scope_lock_ref: surface.required_scope_lock_ref,
    required_content_model_ref: surface.required_content_model_ref,
    required_copy_pack_ref: surface.required_copy_pack_ref,
    required_evidence_index_ref: surface.required_evidence_index_ref,
    required_readiness_gate_ref: SOURCE_REF.replace('prog-098-level1-public-surface-publication-snapshot.json', 'prog-097-level1-public-surface-readiness-gate.json'),
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
    production_claim_allowed: false,
    registry_entry_expands_publication_scope: false
  }));
}

function buildPublicSurfaceRegistryEntryPayload(source) {
  const snapshot = source.public_surface_publication_snapshot;
  const registeredSurfaces = buildRegisteredSurfaces(source);

  return {
    public_surface_registry_entry_id: 'PUBLIC-SURFACE-REGISTRY-ENTRY::HBCE-L1-DECISION-PROOF-0001',
    registry_key: 'hbce.level1.public_surface.controlled_information.0001',
    source_public_surface_publication_snapshot_ref: SOURCE_REF,
    source_public_surface_publication_snapshot_digest: snapshot.public_surface_publication_snapshot_payload_digest,
    registry_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    registry_status: 'REGISTRY_ENTRY_DEFINED_CONTROLLED_INFORMATION_ONLY',
    registry_mode: 'PUBLIC_INFORMATION_SURFACE_REGISTRY_ENTRY',
    registered_at: '2027-01-19T16:55:00Z',
    publication_authorization_scope: snapshot.publication_authorization_scope,
    registered_surface_types: snapshot.authorized_surface_types,
    registered_surface_count: registeredSurfaces.length,
    registered_surfaces: registeredSurfaces,
    required_publication_source_refs: snapshot.publication_source_refs,
    required_publication_source_count: snapshot.publication_source_refs.length,
    required_publication_source_hashes_valid: snapshot.all_publication_source_hashes_valid,
    publication_snapshot_ready: snapshot.public_surface_publication_snapshot_ready,
    public_surface_ready_at_source: snapshot.public_surface_ready,
    publication_authorized_at_source: snapshot.publication_authorized,
    publication_authorization_scope_limited_at_source: snapshot.publication_authorization_scope_limited,
    all_authorized_surfaces_registered: snapshot.authorized_surface_types.every((surfaceType) =>
      registeredSurfaces.some((surface) => surface.surface_type === surfaceType)
    ),
    all_registered_surfaces_authorized: registeredSurfaces.every((surface) => surface.publication_authorized === true),
    all_registered_surfaces_ready_for_controlled_publication: registeredSurfaces.every((surface) => surface.ready_for_controlled_publication === true),
    all_registered_surface_boundaries_preserved: registeredSurfaces.every((surface) =>
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
      surface.production_claim_allowed === false &&
      surface.registry_entry_expands_publication_scope === false
    ),
    approved_public_surface_claims_registry: snapshot.approved_public_surface_claims_snapshot,
    blocked_claims_registry: snapshot.blocked_claims_snapshot,
    registry_controls: [
      'register_only_authorized_surface_types',
      'preserve_controlled_public_information_scope',
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
      'fail_closed_on_registry_delta'
    ],
    registry_boundary: {
      controlled_information_surface_only: true,
      registry_entry_only: true,
      source_publication_snapshot_required: true,
      source_readiness_gate_required: true,
      source_evidence_index_required: true,
      source_copy_pack_required: true,
      source_content_model_required: true,
      source_scope_lock_required: true,
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
    source_public_surface_publication_snapshot_ready: source.readiness_state.public_surface_publication_snapshot_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_registry_entry_ready: true,
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    public_surface_release_manifest_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    registry_entry_comment: 'The registry entry records the controlled public information surface authorized by PROG-097 and snapshotted by PROG-098. It does not expand the publication boundary and does not create external customer delivery readiness, banking readiness, Level 1 launch readiness, production readiness, legal validity, procurement eligibility, security certification or AI authority.',
    ai_registry_entry_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceRegistryEntry(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPublicSurfaceRegistryEntryPayload(source);

  const checklist = {
    source_public_surface_publication_snapshot_hash_valid: validHash(source),
    source_public_surface_publication_snapshot_ready: source.readiness_state.public_surface_publication_snapshot_ready === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    all_authorized_surfaces_registered: payload.all_authorized_surfaces_registered,
    all_registered_surfaces_authorized: payload.all_registered_surfaces_authorized,
    all_registered_surfaces_ready_for_controlled_publication: payload.all_registered_surfaces_ready_for_controlled_publication,
    all_registered_surface_boundaries_preserved: payload.all_registered_surface_boundaries_preserved,
    required_publication_source_hashes_valid: payload.required_publication_source_hashes_valid,
    blocked_claims_preserved: Object.values(payload.blocked_claims_registry).every((value) => value === true),
    release_manifest_not_ready: payload.public_surface_release_manifest_ready === false,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_registry_entry_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-099-PUBLIC-SURFACE-REGISTRY-ENTRY-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_REGISTRY_ENTRY',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-REGISTRY-ENTRY-2027-PROG-099',
    issue_id: 'PROG-099',
    priority: 'LEVEL1-PUBLIC-SURFACE-REGISTRY-ENTRY',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_publication_snapshot_ref: SOURCE_REF,
    source_public_surface_publication_snapshot_revision_hash: source.revision_hash,
    source_public_surface_publication_snapshot_revision_hash_valid: validHash(source),

    level1_public_surface_registry_entry_status: STATUS,

    inherited_public_surface_publication_snapshot: {
      publication_snapshot_status: source.level1_public_surface_publication_snapshot_status,
      snapshot_scope: source.public_surface_publication_snapshot.snapshot_scope,
      snapshot_status: source.public_surface_publication_snapshot.snapshot_status,
      public_surface_publication_snapshot_ready: source.readiness_state.public_surface_publication_snapshot_ready,
      public_surface_ready: source.readiness_state.public_surface_ready,
      publication_authorized: source.readiness_state.publication_authorized,
      publication_authorization_scope: source.readiness_state.publication_authorization_scope,
      prior_public_surface_registry_entry_ready: source.readiness_state.public_surface_registry_entry_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_registry_entry: {
      ...payload,
      public_surface_registry_entry_payload_digest: sha256Digest(payload),
      registry_entry_checklist: checklist,
      public_surface_registry_entry_defined: true,
      public_surface_registry_entry_is_controlled_information_only: true,
      public_surface_registry_entry_is_not_release_manifest: true,
      public_surface_registry_entry_is_not_external_customer_readiness: true,
      public_surface_registry_entry_is_not_banking_pack_readiness: true,
      public_surface_registry_entry_is_not_launch_readiness: true,
      public_surface_registry_entry_is_not_production_readiness: true,
      public_surface_registry_entry_is_not_legal_validity: true,
      public_surface_registry_entry_is_not_security_certification: true,
      public_surface_registry_entry_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_REGISTRY_ENTRY_MISSING',
      'SOURCE_PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_HASH_INVALID',
      'PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_NOT_READY',
      'PUBLICATION_NOT_AUTHORIZED',
      'PUBLICATION_AUTHORIZATION_SCOPE_NOT_LIMITED',
      'AUTHORIZED_SURFACE_NOT_REGISTERED',
      'REGISTERED_SURFACE_NOT_AUTHORIZED',
      'REGISTERED_SURFACE_BOUNDARY_NOT_PRESERVED',
      'PUBLICATION_SOURCE_HASH_INVALID',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_REGISTRY_ENTRY_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_registry_entry_defined: true,
      public_surface_registry_entry_ready: true,
      source_public_surface_publication_snapshot_bound: true,
      public_surface_publication_snapshot_ready: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      all_authorized_surfaces_registered: payload.all_authorized_surfaces_registered,
      all_registered_surfaces_authorized: payload.all_registered_surfaces_authorized,
      all_registered_surfaces_ready_for_controlled_publication: payload.all_registered_surfaces_ready_for_controlled_publication,
      all_registered_surface_boundaries_preserved: payload.all_registered_surface_boundaries_preserved,
      required_publication_source_hashes_valid: payload.required_publication_source_hashes_valid,
      public_surface_release_manifest_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-100-HBCE-LEVEL1-PUBLIC-SURFACE-RELEASE-MANIFEST',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      public_surface_release_manifest_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1PublicSurfaceRegistryEntry(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceRegistryEntry({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-099-level1-public-surface-registry-entry.json';
  const doc = writeLevel1PublicSurfaceRegistryEntry(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_099_LEVEL1_PUBLIC_SURFACE_REGISTRY_ENTRY_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  registrySurfaceId,
  buildRegisteredSurfaces,
  buildPublicSurfaceRegistryEntryPayload,
  buildLevel1PublicSurfaceRegistryEntry,
  writeLevel1PublicSurfaceRegistryEntry
};
