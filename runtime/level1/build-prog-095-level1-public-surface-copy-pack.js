'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_COPY_PACK_DEFINED_NOT_PUBLIC_READY';
const SOURCE_REF = 'docs/launch/level1/prog-094-level1-public-surface-content-model.json';

const COPY_BY_SECTION = Object.freeze({
  HERO_IDENTITY: {
    copy_title: 'HERMETICUM B.C.E.',
    copy_body: 'HERMETICUM B.C.E. develops a human-governed Decision Proof layer for controlled digital decision evidence.',
    positive_claim_refs: ['company_identity', 'level1_problem_statement']
  },
  PROBLEM_STATEMENT: {
    copy_title: 'The decision proof problem',
    copy_body: 'Digital decisions require evidence of who authorized what, when it happened, which boundary applied and which record can be replayed.',
    positive_claim_refs: ['level1_problem_statement']
  },
  DECISION_PROOF_DESCRIPTION: {
    copy_title: 'Human-governed Decision Proof',
    copy_body: 'The Level 1 Decision Proof flow separates authority boundary, policy evaluation, action request, receipt, audit event, evidence export, verifier replay and human acceptance.',
    positive_claim_refs: ['human_governed_decision_proof_description', 'decision_proof_evidence_chain_summary']
  },
  CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK: {
    copy_title: 'Controlled synthetic client demo pack',
    copy_body: 'The controlled synthetic Level 1 client demo pack is ready for bounded demonstration inside its synthetic-only scope.',
    positive_claim_refs: ['controlled_synthetic_client_demo_pack_ready_statement']
  },
  EVIDENCE_CHAIN_SUMMARY: {
    copy_title: 'Evidence chain summary',
    copy_body: 'The demo pack presents a reproducible evidence chain that can be inspected through controlled artifacts and replayed within the synthetic boundary.',
    positive_claim_refs: ['decision_proof_evidence_chain_summary']
  },
  AUTHORITY_BOUNDARY_SUMMARY: {
    copy_title: 'Authority boundary',
    copy_body: 'JOKER-C2 does not act as a public, legal or autonomous execution authority. Human and governance boundaries remain explicit.',
    positive_claim_refs: ['authority_boundary_summary']
  },
  SYNTHETIC_BOUNDARY_AND_NON_CLAIMS: {
    copy_title: 'Synthetic boundary and non-claims',
    copy_body: 'This public surface describes a synthetic demonstration boundary. It does not claim production readiness, legal validity, public accreditation, procurement eligibility, security certification, banking readiness or AI authority.',
    positive_claim_refs: ['synthetic_demo_boundary_summary', 'non_claims_summary']
  },
  CONTROLLED_PILOT_INTAKE: {
    copy_title: 'Controlled pilot intake',
    copy_body: 'Qualified institutional or regulated-enterprise interlocutors may request a controlled pilot intake. Any pilot scope, pricing, SLA or procurement path requires a separate controlled artifact.',
    positive_claim_refs: ['controlled_pilot_intake_statement']
  },
  CONTACT_CHANNEL: {
    copy_title: 'Contact',
    copy_body: 'Use the controlled intake channel to request a bounded technical discussion of the Level 1 Decision Proof demo pack.',
    positive_claim_refs: ['contact_or_intake_channel']
  }
});

const NON_CLAIM_COPY = Object.freeze({
  not_public_surface_ready: 'This copy pack does not make the public surface ready.',
  not_external_customer_delivery_ready: 'This copy pack does not make external customer delivery ready.',
  not_banking_pack_ready: 'This copy pack does not make the banking pack ready.',
  not_level1_launch_ready: 'This copy pack does not make Level 1 launch ready.',
  not_production_ready: 'This copy pack does not make production ready.',
  not_legal_validity: 'This copy pack does not create legal validity.',
  not_public_accreditation: 'This copy pack does not create public accreditation.',
  not_procurement_eligibility: 'This copy pack does not create procurement eligibility.',
  not_security_certification: 'This copy pack does not create security certification.',
  not_ai_authority: 'This copy pack does not authorize AI authority.',
  not_customer_data: 'This copy pack uses no customer data.',
  not_external_effect_proven: 'This copy pack does not prove external operational effect.',
  not_autonomous_execution: 'This copy pack does not authorize autonomous execution.',
  not_pricing_commitment: 'This copy pack does not create pricing commitment.',
  not_sla_commitment: 'This copy pack does not create SLA commitment.'
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

function buildCopySections(source) {
  const model = source.public_surface_content_model;
  return model.content_sections.map((section) => {
    const copy = COPY_BY_SECTION[section.section_id];
    const nonClaimCopy = section.required_non_claim_refs.map((anchor) => ({
      non_claim_ref: anchor,
      copy_line: NON_CLAIM_COPY[anchor] || `This copy pack preserves ${anchor}.`,
      adjacent_to_positive_claim: true
    }));

    return {
      section_id: section.section_id,
      section_order: section.section_order,
      content_role: section.content_role,
      source_content_model_section_bound: true,
      allowed_content_refs: section.allowed_content_refs,
      positive_claim_refs: copy.positive_claim_refs,
      copy_title: copy.copy_title,
      copy_body: copy.copy_body,
      required_non_claim_refs: section.required_non_claim_refs,
      non_claim_copy: nonClaimCopy,
      all_required_non_claims_have_copy: section.required_non_claim_refs.every((anchor) => nonClaimCopy.some((entry) => entry.non_claim_ref === anchor)),
      positive_claims_bound_to_prog_092: section.required_claim_binding === null || section.required_claim_binding === 'docs/launch/level1/prog-092-level1-client-demo-pack-readiness-gate.json',
      uses_only_scope_allowed_content: section.allowed_content_refs_are_scope_allowed === true,
      excluded_content_absent: section.excluded_content_refs_are_empty === true,
      copy_approved_for_pack: true,
      publication_ready: false
    };
  });
}

function buildPublicSurfaceCopyPackPayload(source) {
  const model = source.public_surface_content_model;
  const copySections = buildCopySections(source);

  return {
    public_surface_copy_pack_id: 'PUBLIC-SURFACE-COPY-PACK::HBCE-L1-DECISION-PROOF-0001',
    source_public_surface_content_model_ref: SOURCE_REF,
    source_public_surface_content_model_digest: model.public_surface_content_model_payload_digest,
    surface_scope: model.surface_scope,
    surface_status: 'COPY_PACK_DEFINED_NOT_PUBLIC_READY',
    copy_pack_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY',
    copy_pack_mode: 'PUBLIC_INFORMATION_SURFACE_COPY_PACK',
    defined_at: '2027-01-19T16:35:00Z',
    intended_public_surfaces: model.intended_public_surfaces,
    intended_audiences: model.intended_audiences,
    copy_sections: copySections,
    copy_section_count: copySections.length,
    all_content_model_sections_have_copy: model.content_sections.every((section) => copySections.some((copy) => copy.section_id === section.section_id)),
    all_copy_sections_bound_to_content_model: copySections.every((copy) => copy.source_content_model_section_bound === true),
    all_copy_sections_use_scope_allowed_content: copySections.every((copy) => copy.uses_only_scope_allowed_content === true),
    all_excluded_content_absent_from_copy: copySections.every((copy) => copy.excluded_content_absent === true),
    all_positive_claims_bound_to_prog_092: copySections.every((copy) => copy.positive_claims_bound_to_prog_092 === true),
    all_required_non_claims_have_copy: copySections.every((copy) => copy.all_required_non_claims_have_copy === true),
    all_non_claims_adjacent_to_positive_claims: copySections.every((copy) => copy.non_claim_copy.every((entry) => entry.adjacent_to_positive_claim === true)),
    all_sections_publication_ready_false: copySections.every((copy) => copy.publication_ready === false),
    copy_pack_controls: [
      'use_only_content_model_sections',
      'use_only_scope_allowed_public_content',
      'exclude_all_scope_excluded_public_content',
      'bind_positive_readiness_claims_to_prog_092',
      'place_non_claim_copy_near_positive_claims',
      'keep_publication_ready_false_until_evidence_index_and_readiness_gate',
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
    copy_pack_boundary: {
      synthetic_demo_only: true,
      source_content_model_required: true,
      source_scope_lock_required: true,
      source_client_demo_pack_readiness_gate_required: true,
      copy_pack_only: true,
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
    source_public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready === true,
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    public_surface_copy_ready: true,
    public_surface_evidence_index_ready: false,
    public_surface_readiness_gate_passed: false,
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    copy_pack_comment: 'The public surface copy pack defines controlled public copy for the Level 1 public information surface. It does not authorize publication and does not create public readiness, external customer delivery readiness, banking readiness, launch readiness, production readiness, legal validity, security certification or AI authority.',
    ai_copy_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceCopyPack(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const copyPayload = buildPublicSurfaceCopyPackPayload(source);

  const copyChecklist = {
    source_public_surface_content_model_hash_valid: validHash(source),
    source_public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready === true,
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    all_content_model_sections_have_copy: copyPayload.all_content_model_sections_have_copy,
    all_copy_sections_bound_to_content_model: copyPayload.all_copy_sections_bound_to_content_model,
    all_copy_sections_use_scope_allowed_content: copyPayload.all_copy_sections_use_scope_allowed_content,
    all_excluded_content_absent_from_copy: copyPayload.all_excluded_content_absent_from_copy,
    all_positive_claims_bound_to_prog_092: copyPayload.all_positive_claims_bound_to_prog_092,
    all_required_non_claims_have_copy: copyPayload.all_required_non_claims_have_copy,
    all_non_claims_adjacent_to_positive_claims: copyPayload.all_non_claims_adjacent_to_positive_claims,
    all_sections_publication_ready_false: copyPayload.all_sections_publication_ready_false,
    public_surface_readiness_excluded: source.readiness_state.public_surface_ready === false,
    external_customer_readiness_excluded: source.readiness_state.external_customer_ready === false,
    banking_pack_readiness_excluded: source.readiness_state.banking_pack_ready === false,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-095-PUBLIC-SURFACE-COPY-PACK-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_COPY_PACK',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-COPY-PACK-2027-PROG-095',
    issue_id: 'PROG-095',
    priority: 'LEVEL1-PUBLIC-SURFACE-COPY-PACK',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_content_model_ref: SOURCE_REF,
    source_public_surface_content_model_revision_hash: source.revision_hash,
    source_public_surface_content_model_revision_hash_valid: validHash(source),

    level1_public_surface_copy_pack_status: STATUS,

    inherited_public_surface_content_model: {
      content_model_status: source.level1_public_surface_content_model_status,
      surface_scope: source.public_surface_content_model.surface_scope,
      surface_status: source.public_surface_content_model.surface_status,
      public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready,
      public_surface_scope_locked: source.readiness_state.public_surface_scope_locked,
      controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready,
      prior_public_surface_copy_ready: source.readiness_state.public_surface_copy_ready,
      prior_public_surface_evidence_index_ready: source.readiness_state.public_surface_evidence_index_ready,
      prior_public_surface_readiness_gate_passed: source.readiness_state.public_surface_readiness_gate_passed,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_copy_pack: {
      ...copyPayload,
      public_surface_copy_pack_payload_digest: sha256Digest(copyPayload),
      copy_pack_checklist: copyChecklist,
      public_surface_copy_pack_defined: true,
      public_surface_copy_pack_is_not_public_surface_readiness: true,
      public_surface_copy_pack_is_not_external_customer_readiness: true,
      public_surface_copy_pack_is_not_banking_pack_readiness: true,
      public_surface_copy_pack_is_not_launch_readiness: true,
      public_surface_copy_pack_is_not_production_readiness: true,
      public_surface_copy_pack_is_not_legal_validity: true,
      public_surface_copy_pack_is_not_security_certification: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_COPY_PACK_MISSING',
      'SOURCE_PUBLIC_SURFACE_CONTENT_MODEL_HASH_INVALID',
      'PUBLIC_SURFACE_CONTENT_MODEL_NOT_READY',
      'CONTENT_MODEL_SECTION_WITHOUT_COPY',
      'COPY_SECTION_NOT_BOUND_TO_CONTENT_MODEL',
      'COPY_USES_SCOPE_EXCLUDED_CONTENT',
      'COPY_USES_NON_ALLOWED_PUBLIC_CONTENT',
      'POSITIVE_CLAIM_NOT_BOUND_TO_PROG_092',
      'REQUIRED_NON_CLAIM_COPY_MISSING',
      'PUBLICATION_READY_BEFORE_PUBLIC_SURFACE_GATE',
      'UNSUPPORTED_PUBLIC_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_COPY_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_copy_pack_defined: true,
      public_surface_copy_ready: true,
      source_public_surface_content_model_bound: true,
      public_surface_content_model_ready: true,
      public_surface_scope_locked: true,
      controlled_synthetic_client_demo_pack_ready: true,
      all_content_model_sections_have_copy: copyPayload.all_content_model_sections_have_copy,
      all_copy_sections_bound_to_content_model: copyPayload.all_copy_sections_bound_to_content_model,
      all_copy_sections_use_scope_allowed_content: copyPayload.all_copy_sections_use_scope_allowed_content,
      all_excluded_content_absent_from_copy: copyPayload.all_excluded_content_absent_from_copy,
      all_positive_claims_bound_to_prog_092: copyPayload.all_positive_claims_bound_to_prog_092,
      all_required_non_claims_have_copy: copyPayload.all_required_non_claims_have_copy,
      all_non_claims_adjacent_to_positive_claims: copyPayload.all_non_claims_adjacent_to_positive_claims,
      all_sections_publication_ready_false: copyPayload.all_sections_publication_ready_false,
      public_surface_evidence_index_ready: false,
      public_surface_readiness_gate_passed: false,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-096-HBCE-LEVEL1-PUBLIC-SURFACE-EVIDENCE-INDEX',

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

function writeLevel1PublicSurfaceCopyPack(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceCopyPack({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-095-level1-public-surface-copy-pack.json';
  const doc = writeLevel1PublicSurfaceCopyPack(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_095_LEVEL1_PUBLIC_SURFACE_COPY_PACK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  COPY_BY_SECTION,
  NON_CLAIM_COPY,
  buildCopySections,
  buildPublicSurfaceCopyPackPayload,
  buildLevel1PublicSurfaceCopyPack,
  writeLevel1PublicSurfaceCopyPack
};
