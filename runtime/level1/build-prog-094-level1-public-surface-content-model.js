'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_CONTENT_MODEL_DEFINED_NOT_PUBLIC_READY';
const SOURCE_REF = 'docs/launch/level1/prog-093-level1-public-surface-scope-lock.json';

const PUBLIC_SURFACE_SECTIONS = Object.freeze([
  'HERO_IDENTITY',
  'PROBLEM_STATEMENT',
  'DECISION_PROOF_DESCRIPTION',
  'CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK',
  'EVIDENCE_CHAIN_SUMMARY',
  'AUTHORITY_BOUNDARY_SUMMARY',
  'SYNTHETIC_BOUNDARY_AND_NON_CLAIMS',
  'CONTROLLED_PILOT_INTAKE',
  'CONTACT_CHANNEL'
]);

const REQUIRED_NON_CLAIM_ANCHORS = Object.freeze([
  'not_public_surface_ready',
  'not_external_customer_delivery_ready',
  'not_banking_pack_ready',
  'not_level1_launch_ready',
  'not_production_ready',
  'not_legal_validity',
  'not_public_accreditation',
  'not_procurement_eligibility',
  'not_security_certification',
  'not_ai_authority'
]);

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

function buildContentSections(source) {
  const scope = source.public_surface_scope_lock;
  const allowed = scope.allowed_public_content;

  return [
    {
      section_id: 'HERO_IDENTITY',
      section_order: 1,
      content_role: 'identify_hbce_and_surface_scope',
      allowed_content_refs: ['company_identity', 'level1_problem_statement'],
      required_claim_binding: null,
      required_non_claim_refs: [],
      excluded_content_refs: [],
      publication_ready: false
    },
    {
      section_id: 'PROBLEM_STATEMENT',
      section_order: 2,
      content_role: 'state_decision_proof_problem_without_market_overclaim',
      allowed_content_refs: ['level1_problem_statement'],
      required_claim_binding: null,
      required_non_claim_refs: [],
      excluded_content_refs: [],
      publication_ready: false
    },
    {
      section_id: 'DECISION_PROOF_DESCRIPTION',
      section_order: 3,
      content_role: 'describe_human_governed_decision_proof',
      allowed_content_refs: ['human_governed_decision_proof_description', 'decision_proof_evidence_chain_summary'],
      required_claim_binding: scope.source_client_demo_pack_readiness_gate_ref,
      required_non_claim_refs: ['not_ai_authority'],
      excluded_content_refs: [],
      publication_ready: false
    },
    {
      section_id: 'CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK',
      section_order: 4,
      content_role: 'state_controlled_synthetic_client_demo_pack_readiness',
      allowed_content_refs: ['controlled_synthetic_client_demo_pack_ready_statement'],
      required_claim_binding: scope.source_client_demo_pack_readiness_gate_ref,
      required_non_claim_refs: [
        'not_public_surface_ready',
        'not_external_customer_delivery_ready',
        'not_banking_pack_ready',
        'not_level1_launch_ready',
        'not_production_ready'
      ],
      excluded_content_refs: [],
      publication_ready: false
    },
    {
      section_id: 'EVIDENCE_CHAIN_SUMMARY',
      section_order: 5,
      content_role: 'summarize_evidence_chain_without_revealing_customer_or_live_data',
      allowed_content_refs: ['decision_proof_evidence_chain_summary'],
      required_claim_binding: scope.source_client_demo_pack_readiness_gate_ref,
      required_non_claim_refs: ['not_external_effect_proven', 'not_customer_data'],
      excluded_content_refs: [],
      publication_ready: false
    },
    {
      section_id: 'AUTHORITY_BOUNDARY_SUMMARY',
      section_order: 6,
      content_role: 'state_human_governance_and_ai_non_authority',
      allowed_content_refs: ['authority_boundary_summary'],
      required_claim_binding: scope.source_client_demo_pack_readiness_gate_ref,
      required_non_claim_refs: ['not_ai_authority', 'not_autonomous_execution'],
      excluded_content_refs: [],
      publication_ready: false
    },
    {
      section_id: 'SYNTHETIC_BOUNDARY_AND_NON_CLAIMS',
      section_order: 7,
      content_role: 'place_non_claims_near_positive_claims',
      allowed_content_refs: ['synthetic_demo_boundary_summary', 'non_claims_summary'],
      required_claim_binding: scope.source_client_demo_pack_readiness_gate_ref,
      required_non_claim_refs: REQUIRED_NON_CLAIM_ANCHORS,
      excluded_content_refs: [],
      publication_ready: false
    },
    {
      section_id: 'CONTROLLED_PILOT_INTAKE',
      section_order: 8,
      content_role: 'invite_controlled_pilot_intake_without_procurement_or_pricing_commitment',
      allowed_content_refs: ['controlled_pilot_intake_statement'],
      required_claim_binding: null,
      required_non_claim_refs: ['not_pricing_commitment', 'not_sla_commitment', 'not_procurement_eligibility'],
      excluded_content_refs: [],
      publication_ready: false
    },
    {
      section_id: 'CONTACT_CHANNEL',
      section_order: 9,
      content_role: 'provide_contact_or_intake_channel',
      allowed_content_refs: ['contact_or_intake_channel'],
      required_claim_binding: null,
      required_non_claim_refs: [],
      excluded_content_refs: [],
      publication_ready: false
    }
  ].map((section) => ({
    ...section,
    allowed_content_refs_are_scope_allowed: section.allowed_content_refs.every((ref) => allowed.includes(ref)),
    excluded_content_refs_are_empty: section.excluded_content_refs.length === 0
  }));
}

function buildPublicSurfaceContentModelPayload(source) {
  const scope = source.public_surface_scope_lock;
  const sections = buildContentSections(source);
  const allSectionsDefined = PUBLIC_SURFACE_SECTIONS.every((sectionId) => sections.some((section) => section.section_id === sectionId));
  const allSectionsScopeAllowed = sections.every((section) => section.allowed_content_refs_are_scope_allowed === true);
  const allExcludedContentAbsent = sections.every((section) => section.excluded_content_refs_are_empty === true);
  const positiveClaimsBound = sections
    .filter((section) => section.required_claim_binding)
    .every((section) => section.required_claim_binding === scope.source_client_demo_pack_readiness_gate_ref);
  const nonClaimAnchorsCovered = REQUIRED_NON_CLAIM_ANCHORS.every((anchor) =>
    sections.some((section) => section.required_non_claim_refs.includes(anchor))
  );

  return {
    public_surface_content_model_id: 'PUBLIC-SURFACE-CONTENT-MODEL::HBCE-L1-DECISION-PROOF-0001',
    source_public_surface_scope_lock_ref: SOURCE_REF,
    source_public_surface_scope_lock_digest: scope.public_surface_scope_payload_digest,
    surface_scope: scope.surface_scope,
    surface_status: 'CONTENT_MODEL_DEFINED_NOT_PUBLIC_READY',
    content_model_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY',
    content_model_mode: 'PUBLIC_INFORMATION_SURFACE_CONTENT_MODEL',
    defined_at: '2027-01-19T16:30:00Z',
    intended_public_surfaces: scope.intended_public_surfaces,
    intended_audiences: scope.intended_audiences,
    content_sections: sections,
    section_count: sections.length,
    required_sections: PUBLIC_SURFACE_SECTIONS,
    required_non_claim_anchors: REQUIRED_NON_CLAIM_ANCHORS,
    all_required_sections_defined: allSectionsDefined,
    all_sections_use_scope_allowed_content: allSectionsScopeAllowed,
    all_excluded_content_absent_from_sections: allExcludedContentAbsent,
    positive_claims_bound_to_prog_092: positiveClaimsBound,
    required_non_claim_anchors_covered: nonClaimAnchorsCovered,
    content_model_controls: [
      'use_only_scope_allowed_public_content',
      'exclude_all_scope_excluded_public_content',
      'bind_positive_readiness_claims_to_prog_092',
      'place_non_claims_near_positive_claims',
      'mark_all_sections_publication_ready_false_until_copy_pack',
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
    content_model_boundary: {
      synthetic_demo_only: true,
      source_scope_lock_required: true,
      source_client_demo_pack_readiness_gate_required: true,
      content_model_only: true,
      no_final_copy: true,
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
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    public_surface_content_model_ready: true,
    public_surface_copy_ready: false,
    public_surface_evidence_index_ready: false,
    public_surface_readiness_gate_passed: false,
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    content_model_comment: 'The public surface content model defines the section structure and claim/non-claim adjacency for a future Level 1 public information surface. It does not create final public copy, public readiness, external customer delivery readiness, banking readiness, launch readiness, production readiness, legal validity, security certification or AI authority.',
    ai_content_model_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceContentModel(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const contentPayload = buildPublicSurfaceContentModelPayload(source);

  const contentChecklist = {
    source_public_surface_scope_lock_hash_valid: validHash(source),
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    all_required_sections_defined: contentPayload.all_required_sections_defined,
    all_sections_use_scope_allowed_content: contentPayload.all_sections_use_scope_allowed_content,
    all_excluded_content_absent_from_sections: contentPayload.all_excluded_content_absent_from_sections,
    positive_claims_bound_to_prog_092: contentPayload.positive_claims_bound_to_prog_092,
    required_non_claim_anchors_covered: contentPayload.required_non_claim_anchors_covered,
    public_surface_readiness_excluded: source.readiness_state.public_surface_ready === false,
    external_customer_readiness_excluded: source.readiness_state.external_customer_ready === false,
    banking_pack_readiness_excluded: source.readiness_state.banking_pack_ready === false,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-094-PUBLIC-SURFACE-CONTENT-MODEL-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_CONTENT_MODEL',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-CONTENT-MODEL-2027-PROG-094',
    issue_id: 'PROG-094',
    priority: 'LEVEL1-PUBLIC-SURFACE-CONTENT-MODEL',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_scope_lock_ref: SOURCE_REF,
    source_public_surface_scope_lock_revision_hash: source.revision_hash,
    source_public_surface_scope_lock_revision_hash_valid: validHash(source),

    level1_public_surface_content_model_status: STATUS,

    inherited_public_surface_scope_lock: {
      scope_lock_status: source.level1_public_surface_scope_lock_status,
      surface_scope: source.public_surface_scope_lock.surface_scope,
      surface_status: source.public_surface_scope_lock.surface_status,
      public_surface_scope_locked: source.readiness_state.public_surface_scope_locked,
      controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready,
      prior_public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready,
      prior_public_surface_copy_ready: source.readiness_state.public_surface_copy_ready,
      prior_public_surface_evidence_index_ready: source.readiness_state.public_surface_evidence_index_ready,
      prior_public_surface_readiness_gate_passed: source.readiness_state.public_surface_readiness_gate_passed,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_content_model: {
      ...contentPayload,
      public_surface_content_model_payload_digest: sha256Digest(contentPayload),
      content_model_checklist: contentChecklist,
      public_surface_content_model_defined: true,
      public_surface_content_model_is_not_public_surface_readiness: true,
      public_surface_content_model_is_not_external_customer_readiness: true,
      public_surface_content_model_is_not_banking_pack_readiness: true,
      public_surface_content_model_is_not_launch_readiness: true,
      public_surface_content_model_is_not_production_readiness: true,
      public_surface_content_model_is_not_legal_validity: true,
      public_surface_content_model_is_not_security_certification: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_CONTENT_MODEL_MISSING',
      'SOURCE_PUBLIC_SURFACE_SCOPE_LOCK_HASH_INVALID',
      'PUBLIC_SURFACE_SCOPE_NOT_LOCKED',
      'REQUIRED_PUBLIC_SURFACE_SECTION_MISSING',
      'SECTION_USES_SCOPE_EXCLUDED_CONTENT',
      'SECTION_USES_NON_ALLOWED_PUBLIC_CONTENT',
      'POSITIVE_CLAIM_NOT_BOUND_TO_PROG_092',
      'REQUIRED_NON_CLAIM_ANCHOR_MISSING',
      'UNSUPPORTED_PUBLIC_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_CONTENT_MODEL_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_content_model_defined: true,
      public_surface_content_model_ready: true,
      source_public_surface_scope_lock_bound: true,
      public_surface_scope_locked: true,
      controlled_synthetic_client_demo_pack_ready: true,
      all_required_sections_defined: contentPayload.all_required_sections_defined,
      all_sections_use_scope_allowed_content: contentPayload.all_sections_use_scope_allowed_content,
      all_excluded_content_absent_from_sections: contentPayload.all_excluded_content_absent_from_sections,
      positive_claims_bound_to_prog_092: contentPayload.positive_claims_bound_to_prog_092,
      required_non_claim_anchors_covered: contentPayload.required_non_claim_anchors_covered,
      public_surface_copy_ready: false,
      public_surface_evidence_index_ready: false,
      public_surface_readiness_gate_passed: false,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-095-HBCE-LEVEL1-PUBLIC-SURFACE-COPY-PACK',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1PublicSurfaceContentModel(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceContentModel({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-094-level1-public-surface-content-model.json';
  const doc = writeLevel1PublicSurfaceContentModel(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_094_LEVEL1_PUBLIC_SURFACE_CONTENT_MODEL_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  PUBLIC_SURFACE_SECTIONS,
  REQUIRED_NON_CLAIM_ANCHORS,
  buildContentSections,
  buildPublicSurfaceContentModelPayload,
  buildLevel1PublicSurfaceContentModel,
  writeLevel1PublicSurfaceContentModel
};
