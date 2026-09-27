'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_DEFINED_CONTROLLED_INFORMATION_ONLY';
const SOURCE_REF = 'docs/launch/level1/prog-097-level1-public-surface-readiness-gate.json';

const REQUIRED_PUBLICATION_SOURCE_REFS = Object.freeze([
  'docs/launch/level1/prog-093-level1-public-surface-scope-lock.json',
  'docs/launch/level1/prog-094-level1-public-surface-content-model.json',
  'docs/launch/level1/prog-095-level1-public-surface-copy-pack.json',
  'docs/launch/level1/prog-096-level1-public-surface-evidence-index.json',
  'docs/launch/level1/prog-097-level1-public-surface-readiness-gate.json'
]);

const SURFACE_LABELS = Object.freeze({
  public_website: 'Public Website',
  public_one_pager: 'Public One-Pager',
  public_intro_deck: 'Public Intro Deck',
  public_contact_or_intake_page: 'Public Contact or Intake Page'
});

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

function buildPublicationSourceItems(rootDir) {
  return REQUIRED_PUBLICATION_SOURCE_REFS.map((ref, index) => {
    const doc = readJson(rootDir, ref);
    return {
      source_index: index + 1,
      source_ref: ref,
      issue_id: doc.issue_id,
      kind: doc.kind,
      document_code: doc.document_code,
      revision_hash: doc.revision_hash,
      revision_hash_valid: validHash(doc),
      required_for_publication_snapshot: true,
      public_surface_safe: true,
      customer_data_included: false,
      publication_authorization_expands_scope: false
    };
  });
}

function buildSurfaceSnapshots(source) {
  const gate = source.public_surface_readiness_gate;
  const authorization = gate.publication_authorization;

  return authorization.authorized_surface_types.map((surfaceType, index) => ({
    surface_index: index + 1,
    surface_type: surfaceType,
    surface_label: SURFACE_LABELS[surfaceType] || surfaceType,
    publication_authorized: authorization.authorized === true,
    authorization_scope: authorization.authorization_scope,
    source_readiness_gate_ref: SOURCE_REF,
    required_scope_lock_ref: 'docs/launch/level1/prog-093-level1-public-surface-scope-lock.json',
    required_content_model_ref: 'docs/launch/level1/prog-094-level1-public-surface-content-model.json',
    required_copy_pack_ref: 'docs/launch/level1/prog-095-level1-public-surface-copy-pack.json',
    required_evidence_index_ref: 'docs/launch/level1/prog-096-level1-public-surface-evidence-index.json',
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
    ready_for_controlled_publication: authorization.authorized === true && authorization.authorization_scope === 'controlled_public_information_surface_only'
  }));
}

function buildPublicationSnapshotPayload(source, rootDir) {
  const gate = source.public_surface_readiness_gate;
  const authorization = gate.publication_authorization;
  const sourceItems = buildPublicationSourceItems(rootDir);
  const surfaceSnapshots = buildSurfaceSnapshots(source);

  return {
    public_surface_publication_snapshot_id: 'PUBLIC-SURFACE-PUBLICATION-SNAPSHOT::HBCE-L1-DECISION-PROOF-0001',
    source_public_surface_readiness_gate_ref: SOURCE_REF,
    source_public_surface_readiness_gate_digest: gate.public_surface_readiness_gate_payload_digest,
    snapshot_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    snapshot_status: 'PUBLICATION_SNAPSHOT_DEFINED_CONTROLLED_INFORMATION_ONLY',
    snapshot_mode: 'PUBLIC_INFORMATION_SURFACE_PUBLICATION_SNAPSHOT',
    captured_at: '2027-01-19T16:50:00Z',
    publication_authorization_scope: authorization.authorization_scope,
    authorized_surface_types: authorization.authorized_surface_types,
    authorized_surface_count: authorization.authorized_surface_types.length,
    publication_source_refs: REQUIRED_PUBLICATION_SOURCE_REFS,
    publication_source_items: sourceItems,
    surface_snapshots: surfaceSnapshots,
    surface_snapshot_count: surfaceSnapshots.length,
    all_required_publication_sources_indexed: REQUIRED_PUBLICATION_SOURCE_REFS.every((ref) => sourceItems.some((item) => item.source_ref === ref)),
    all_publication_source_hashes_valid: sourceItems.every((item) => item.revision_hash_valid === true),
    all_authorized_surfaces_snapshotted: authorization.authorized_surface_types.every((surfaceType) => surfaceSnapshots.some((item) => item.surface_type === surfaceType)),
    all_surfaces_ready_for_controlled_publication: surfaceSnapshots.every((item) => item.ready_for_controlled_publication === true),
    all_surface_boundaries_preserved: surfaceSnapshots.every((item) =>
      item.customer_data_allowed === false &&
      item.customer_logo_allowed_without_authorization === false &&
      item.legal_validity_claim_allowed === false &&
      item.public_accreditation_claim_allowed === false &&
      item.procurement_eligibility_claim_allowed === false &&
      item.security_certification_claim_allowed === false &&
      item.ai_authority_claim_allowed === false &&
      item.external_customer_delivery_claim_allowed === false &&
      item.banking_pack_claim_allowed === false &&
      item.level1_launch_claim_allowed === false &&
      item.production_claim_allowed === false
    ),
    approved_public_surface_claims_snapshot: gate.approved_public_surface_claims,
    blocked_claims_snapshot: gate.blocked_claims_preserved_after_gate,
    required_public_surface_controls_snapshot: gate.required_public_surface_controls,
    publication_snapshot_controls: [
      'publish_only_authorized_surface_types',
      'preserve_controlled_public_information_scope',
      'preserve_readiness_gate_authorization_scope',
      'preserve_evidence_index_references',
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
      'fail_closed_on_public_surface_delta'
    ],
    publication_snapshot_boundary: {
      controlled_information_surface_only: true,
      publication_snapshot_only: true,
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
    source_public_surface_readiness_gate_passed: source.readiness_state.public_surface_readiness_gate_passed === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    public_surface_publication_snapshot_ready: true,
    public_surface_ready: true,
    publication_authorized: true,
    publication_authorization_scope_limited: true,
    public_surface_registry_entry_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    publication_snapshot_comment: 'The publication snapshot records the controlled public information surfaces authorized by PROG-097. It does not expand the publication boundary and does not create external customer delivery readiness, banking readiness, Level 1 launch readiness, production readiness, legal validity, procurement eligibility, security certification or AI authority.',
    ai_publication_snapshot_authority_allowed: false
  };
}

function buildLevel1PublicSurfacePublicationSnapshot(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPublicationSnapshotPayload(source, rootDir);

  const checklist = {
    source_public_surface_readiness_gate_hash_valid: validHash(source),
    source_public_surface_readiness_gate_passed: source.readiness_state.public_surface_readiness_gate_passed === true,
    source_public_surface_ready: source.readiness_state.public_surface_ready === true,
    source_publication_authorized: source.readiness_state.publication_authorized === true,
    source_publication_authorization_scope_limited: source.readiness_state.publication_authorization_scope_limited === true,
    all_required_publication_sources_indexed: payload.all_required_publication_sources_indexed,
    all_publication_source_hashes_valid: payload.all_publication_source_hashes_valid,
    all_authorized_surfaces_snapshotted: payload.all_authorized_surfaces_snapshotted,
    all_surfaces_ready_for_controlled_publication: payload.all_surfaces_ready_for_controlled_publication,
    all_surface_boundaries_preserved: payload.all_surface_boundaries_preserved,
    blocked_claims_preserved: Object.values(payload.blocked_claims_snapshot).every((value) => value === true),
    registry_entry_not_ready: payload.public_surface_registry_entry_ready === false,
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_publication_snapshot_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-098-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_PUBLICATION_SNAPSHOT',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT-2027-PROG-098',
    issue_id: 'PROG-098',
    priority: 'LEVEL1-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_readiness_gate_ref: SOURCE_REF,
    source_public_surface_readiness_gate_revision_hash: source.revision_hash,
    source_public_surface_readiness_gate_revision_hash_valid: validHash(source),

    level1_public_surface_publication_snapshot_status: STATUS,

    inherited_public_surface_readiness_gate: {
      readiness_gate_status: source.level1_public_surface_readiness_gate_status,
      gate_status: source.public_surface_readiness_gate.gate_status,
      gate_result: source.public_surface_readiness_gate.gate_result,
      public_surface_readiness_gate_passed: source.readiness_state.public_surface_readiness_gate_passed,
      public_surface_ready: source.readiness_state.public_surface_ready,
      publication_authorized: source.readiness_state.publication_authorized,
      publication_authorization_scope: source.readiness_state.publication_authorization_scope,
      external_customer_ready: source.readiness_state.external_customer_ready,
      banking_pack_ready: source.readiness_state.banking_pack_ready,
      level1_launch_ready: source.readiness_state.level1_launch_ready,
      production_ready: source.readiness_state.production_ready
    },

    public_surface_publication_snapshot: {
      ...payload,
      public_surface_publication_snapshot_payload_digest: sha256Digest(payload),
      publication_snapshot_checklist: checklist,
      public_surface_publication_snapshot_defined: true,
      public_surface_publication_snapshot_is_controlled_information_only: true,
      public_surface_publication_snapshot_is_not_registry_entry: true,
      public_surface_publication_snapshot_is_not_external_customer_readiness: true,
      public_surface_publication_snapshot_is_not_banking_pack_readiness: true,
      public_surface_publication_snapshot_is_not_launch_readiness: true,
      public_surface_publication_snapshot_is_not_production_readiness: true,
      public_surface_publication_snapshot_is_not_legal_validity: true,
      public_surface_publication_snapshot_is_not_security_certification: true,
      public_surface_publication_snapshot_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_MISSING',
      'SOURCE_PUBLIC_SURFACE_READINESS_GATE_HASH_INVALID',
      'PUBLIC_SURFACE_READINESS_GATE_NOT_PASSED',
      'PUBLICATION_NOT_AUTHORIZED_BY_READINESS_GATE',
      'PUBLICATION_AUTHORIZATION_SCOPE_NOT_LIMITED',
      'REQUIRED_PUBLICATION_SOURCE_REF_MISSING',
      'PUBLICATION_SOURCE_HASH_INVALID',
      'AUTHORIZED_SURFACE_NOT_SNAPSHOTTED',
      'PUBLIC_SURFACE_BOUNDARY_NOT_PRESERVED',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_PUBLICATION_SNAPSHOT_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_publication_snapshot_defined: true,
      public_surface_publication_snapshot_ready: true,
      source_public_surface_readiness_gate_bound: true,
      public_surface_readiness_gate_passed: true,
      public_surface_ready: true,
      publication_authorized: true,
      publication_authorization_scope: 'controlled_public_information_surface_only',
      publication_authorization_scope_limited: true,
      all_required_publication_sources_indexed: payload.all_required_publication_sources_indexed,
      all_publication_source_hashes_valid: payload.all_publication_source_hashes_valid,
      all_authorized_surfaces_snapshotted: payload.all_authorized_surfaces_snapshotted,
      all_surfaces_ready_for_controlled_publication: payload.all_surfaces_ready_for_controlled_publication,
      all_surface_boundaries_preserved: payload.all_surface_boundaries_preserved,
      public_surface_registry_entry_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-099-HBCE-LEVEL1-PUBLIC-SURFACE-REGISTRY-ENTRY',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      public_surface_registry_entry_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1PublicSurfacePublicationSnapshot(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfacePublicationSnapshot({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-098-level1-public-surface-publication-snapshot.json';
  const doc = writeLevel1PublicSurfacePublicationSnapshot(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_098_LEVEL1_PUBLIC_SURFACE_PUBLICATION_SNAPSHOT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  REQUIRED_PUBLICATION_SOURCE_REFS,
  SURFACE_LABELS,
  buildPublicationSourceItems,
  buildSurfaceSnapshots,
  buildPublicationSnapshotPayload,
  buildLevel1PublicSurfacePublicationSnapshot,
  writeLevel1PublicSurfacePublicationSnapshot
};
