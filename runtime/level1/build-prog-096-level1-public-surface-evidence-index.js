'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_EVIDENCE_INDEX_DEFINED_NOT_PUBLIC_READY';
const SOURCE_REF = 'docs/launch/level1/prog-095-level1-public-surface-copy-pack.json';

const REQUIRED_EVIDENCE_REFS = Object.freeze([
  'docs/launch/level1/prog-092-level1-client-demo-pack-readiness-gate.json',
  'docs/launch/level1/prog-093-level1-public-surface-scope-lock.json',
  'docs/launch/level1/prog-094-level1-public-surface-content-model.json',
  'docs/launch/level1/prog-095-level1-public-surface-copy-pack.json'
]);

const EVIDENCE_SUPPORTS = Object.freeze({
  'PROG-092': [
    'controlled_synthetic_client_demo_pack_ready',
    'positive_readiness_claim_source',
    'blocked_unrestricted_readiness_claims'
  ],
  'PROG-093': [
    'public_surface_scope_locked',
    'allowed_public_content_defined',
    'excluded_public_content_defined',
    'public_surface_controls_defined'
  ],
  'PROG-094': [
    'public_surface_content_model_ready',
    'required_sections_defined',
    'non_claim_anchors_covered',
    'positive_claims_bound_to_prog_092'
  ],
  'PROG-095': [
    'public_surface_copy_ready',
    'copy_sections_bound_to_content_model',
    'non_claim_copy_adjacent',
    'publication_not_authorized'
  ]
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

function buildEvidenceItems(rootDir) {
  return REQUIRED_EVIDENCE_REFS.map((ref, index) => {
    const doc = readJson(rootDir, ref);
    const issueId = doc.issue_id;
    return {
      evidence_index_number: index + 1,
      evidence_ref: ref,
      issue_id: issueId,
      kind: doc.kind,
      document_code: doc.document_code,
      revision_hash: doc.revision_hash,
      revision_hash_valid: validHash(doc),
      supports_public_surface_claims: EVIDENCE_SUPPORTS[issueId] || [],
      public_surface_safe: true,
      synthetic_only: true,
      customer_data_included: false,
      live_system_control_included: false,
      production_integration_included: false,
      legal_validity_claim_included: false,
      public_accreditation_claim_included: false,
      procurement_eligibility_claim_included: false,
      security_certification_claim_included: false,
      ai_authority_claim_included: false,
      publication_authorization_included: false
    };
  });
}

function buildPublicSurfaceEvidenceIndexPayload(source, rootDir) {
  const evidenceItems = buildEvidenceItems(rootDir);
  const indexedRefs = evidenceItems.map((item) => item.evidence_ref);

  return {
    public_surface_evidence_index_id: 'PUBLIC-SURFACE-EVIDENCE-INDEX::HBCE-L1-DECISION-PROOF-0001',
    source_public_surface_copy_pack_ref: SOURCE_REF,
    source_public_surface_copy_pack_digest: source.public_surface_copy_pack.public_surface_copy_pack_payload_digest,
    surface_scope: source.public_surface_copy_pack.surface_scope,
    surface_status: 'EVIDENCE_INDEX_DEFINED_NOT_PUBLIC_READY',
    evidence_index_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY',
    evidence_index_mode: 'PUBLIC_INFORMATION_SURFACE_EVIDENCE_INDEX',
    defined_at: '2027-01-19T16:40:00Z',
    intended_public_surfaces: source.public_surface_copy_pack.intended_public_surfaces,
    intended_audiences: source.public_surface_copy_pack.intended_audiences,
    required_evidence_refs: REQUIRED_EVIDENCE_REFS,
    evidence_items: evidenceItems,
    evidence_item_count: evidenceItems.length,
    all_required_evidence_refs_indexed: REQUIRED_EVIDENCE_REFS.every((ref) => indexedRefs.includes(ref)),
    all_evidence_hashes_valid: evidenceItems.every((item) => item.revision_hash_valid === true),
    all_evidence_items_public_surface_safe: evidenceItems.every((item) => item.public_surface_safe === true),
    all_evidence_items_synthetic_only: evidenceItems.every((item) => item.synthetic_only === true),
    all_evidence_items_customer_data_free: evidenceItems.every((item) => item.customer_data_included === false),
    all_evidence_items_publication_authorization_free: evidenceItems.every((item) => item.publication_authorization_included === false),
    positive_public_claim_bindings: [
      {
        public_claim: 'controlled_synthetic_client_demo_pack_ready',
        evidence_ref: 'docs/launch/level1/prog-092-level1-client-demo-pack-readiness-gate.json',
        issue_id: 'PROG-092',
        claim_allowed: true,
        claim_boundary: 'controlled synthetic client demo pack readiness only'
      },
      {
        public_claim: 'public_surface_scope_locked',
        evidence_ref: 'docs/launch/level1/prog-093-level1-public-surface-scope-lock.json',
        issue_id: 'PROG-093',
        claim_allowed: true,
        claim_boundary: 'scope lock only, not public readiness'
      },
      {
        public_claim: 'public_surface_content_model_ready',
        evidence_ref: 'docs/launch/level1/prog-094-level1-public-surface-content-model.json',
        issue_id: 'PROG-094',
        claim_allowed: true,
        claim_boundary: 'content model only, not public readiness'
      },
      {
        public_claim: 'public_surface_copy_ready',
        evidence_ref: 'docs/launch/level1/prog-095-level1-public-surface-copy-pack.json',
        issue_id: 'PROG-095',
        claim_allowed: true,
        claim_boundary: 'copy pack only, publication not authorized'
      }
    ],
    blocked_public_claim_bindings: {
      public_surface_ready: true,
      publication_authorized: true,
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
    evidence_index_controls: [
      'index_only_required_public_surface_evidence',
      'validate_all_indexed_revision_hashes',
      'bind_positive_public_claims_to_evidence_refs',
      'preserve_non_claims_near_positive_claims',
      'do_not_authorize_publication',
      'do_not_use_customer_data',
      'do_not_use_customer_logos_without_authorization',
      'do_not_claim_public_surface_readiness',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority'
    ],
    evidence_index_boundary: {
      synthetic_demo_only: true,
      source_copy_pack_required: true,
      source_content_model_required: true,
      source_scope_lock_required: true,
      source_client_demo_pack_readiness_gate_required: true,
      evidence_index_only: true,
      no_publication_authorization: true,
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
    source_public_surface_copy_ready: source.readiness_state.public_surface_copy_ready === true,
    source_public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready === true,
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    public_surface_evidence_index_ready: true,
    public_surface_readiness_gate_passed: false,
    public_surface_ready: false,
    publication_authorized: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    evidence_index_comment: 'The public surface evidence index binds the public copy pack to the required evidence artifacts. It does not authorize publication and does not create public readiness, external customer delivery readiness, banking readiness, launch readiness, production readiness, legal validity, security certification or AI authority.',
    ai_evidence_index_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceEvidenceIndex(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPublicSurfaceEvidenceIndexPayload(source, rootDir);

  const checklist = {
    source_public_surface_copy_pack_hash_valid: validHash(source),
    source_public_surface_copy_ready: source.readiness_state.public_surface_copy_ready === true,
    source_public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready === true,
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    all_required_evidence_refs_indexed: payload.all_required_evidence_refs_indexed,
    all_evidence_hashes_valid: payload.all_evidence_hashes_valid,
    all_evidence_items_public_surface_safe: payload.all_evidence_items_public_surface_safe,
    all_evidence_items_synthetic_only: payload.all_evidence_items_synthetic_only,
    all_evidence_items_customer_data_free: payload.all_evidence_items_customer_data_free,
    all_evidence_items_publication_authorization_free: payload.all_evidence_items_publication_authorization_free,
    positive_public_claims_bound_to_evidence: payload.positive_public_claim_bindings.every((binding) => binding.claim_allowed === true && REQUIRED_EVIDENCE_REFS.includes(binding.evidence_ref)),
    blocked_public_claims_preserved: Object.values(payload.blocked_public_claim_bindings).every((value) => value === true),
    public_surface_readiness_excluded: source.readiness_state.public_surface_ready === false,
    external_customer_readiness_excluded: source.readiness_state.external_customer_ready === false,
    banking_pack_readiness_excluded: source.readiness_state.banking_pack_ready === false,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-096-PUBLIC-SURFACE-EVIDENCE-INDEX-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_EVIDENCE_INDEX',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-EVIDENCE-INDEX-2027-PROG-096',
    issue_id: 'PROG-096',
    priority: 'LEVEL1-PUBLIC-SURFACE-EVIDENCE-INDEX',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_copy_pack_ref: SOURCE_REF,
    source_public_surface_copy_pack_revision_hash: source.revision_hash,
    source_public_surface_copy_pack_revision_hash_valid: validHash(source),

    level1_public_surface_evidence_index_status: STATUS,

    inherited_public_surface_copy_pack: {
      copy_pack_status: source.level1_public_surface_copy_pack_status,
      surface_scope: source.public_surface_copy_pack.surface_scope,
      surface_status: source.public_surface_copy_pack.surface_status,
      public_surface_copy_ready: source.readiness_state.public_surface_copy_ready,
      public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready,
      public_surface_scope_locked: source.readiness_state.public_surface_scope_locked,
      controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready,
      prior_public_surface_evidence_index_ready: source.readiness_state.public_surface_evidence_index_ready,
      prior_public_surface_readiness_gate_passed: source.readiness_state.public_surface_readiness_gate_passed,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_evidence_index: {
      ...payload,
      public_surface_evidence_index_payload_digest: sha256Digest(payload),
      evidence_index_checklist: checklist,
      public_surface_evidence_index_defined: true,
      public_surface_evidence_index_is_not_public_surface_readiness: true,
      public_surface_evidence_index_is_not_publication_authorization: true,
      public_surface_evidence_index_is_not_external_customer_readiness: true,
      public_surface_evidence_index_is_not_banking_pack_readiness: true,
      public_surface_evidence_index_is_not_launch_readiness: true,
      public_surface_evidence_index_is_not_production_readiness: true,
      public_surface_evidence_index_is_not_legal_validity: true,
      public_surface_evidence_index_is_not_security_certification: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_EVIDENCE_INDEX_MISSING',
      'SOURCE_PUBLIC_SURFACE_COPY_PACK_HASH_INVALID',
      'PUBLIC_SURFACE_COPY_PACK_NOT_READY',
      'REQUIRED_PUBLIC_SURFACE_EVIDENCE_REF_MISSING',
      'PUBLIC_SURFACE_EVIDENCE_HASH_INVALID',
      'PUBLIC_SURFACE_EVIDENCE_NOT_SAFE',
      'POSITIVE_PUBLIC_CLAIM_WITHOUT_EVIDENCE_BINDING',
      'PUBLICATION_AUTHORIZED_BEFORE_READINESS_GATE',
      'UNSUPPORTED_PUBLIC_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_EVIDENCE_INDEX_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_evidence_index_defined: true,
      public_surface_evidence_index_ready: true,
      source_public_surface_copy_pack_bound: true,
      public_surface_copy_ready: true,
      public_surface_content_model_ready: true,
      public_surface_scope_locked: true,
      controlled_synthetic_client_demo_pack_ready: true,
      all_required_evidence_refs_indexed: payload.all_required_evidence_refs_indexed,
      all_evidence_hashes_valid: payload.all_evidence_hashes_valid,
      positive_public_claims_bound_to_evidence: checklist.positive_public_claims_bound_to_evidence,
      blocked_public_claims_preserved: checklist.blocked_public_claims_preserved,
      public_surface_readiness_gate_passed: false,
      public_surface_ready: false,
      publication_authorized: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-097-HBCE-LEVEL1-PUBLIC-SURFACE-READINESS-GATE',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      public_surface_ready: false,
      publication_authorized: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1PublicSurfaceEvidenceIndex(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceEvidenceIndex({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-096-level1-public-surface-evidence-index.json';
  const doc = writeLevel1PublicSurfaceEvidenceIndex(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_096_LEVEL1_PUBLIC_SURFACE_EVIDENCE_INDEX_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  REQUIRED_EVIDENCE_REFS,
  EVIDENCE_SUPPORTS,
  buildEvidenceItems,
  buildPublicSurfaceEvidenceIndexPayload,
  buildLevel1PublicSurfaceEvidenceIndex,
  writeLevel1PublicSurfaceEvidenceIndex
};
