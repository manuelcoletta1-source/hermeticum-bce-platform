'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_READINESS_GATE_PASSED_CONTROLLED_INFORMATION_ONLY';
const SOURCE_REF = 'docs/launch/level1/prog-096-level1-public-surface-evidence-index.json';

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

function allTrue(values) {
  return values.every((value) => value === true);
}

function buildGateCriteria(source) {
  const index = source.public_surface_evidence_index;

  return {
    source_public_surface_evidence_index_hash_valid: validHash(source),
    source_public_surface_evidence_index_ready: source.readiness_state.public_surface_evidence_index_ready === true,
    source_public_surface_copy_ready: source.readiness_state.public_surface_copy_ready === true,
    source_public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready === true,
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    all_required_evidence_refs_indexed: source.readiness_state.all_required_evidence_refs_indexed === true,
    all_evidence_hashes_valid: source.readiness_state.all_evidence_hashes_valid === true,
    positive_public_claims_bound_to_evidence: source.readiness_state.positive_public_claims_bound_to_evidence === true,
    blocked_public_claims_preserved: source.readiness_state.blocked_public_claims_preserved === true,
    evidence_items_customer_data_free: index.all_evidence_items_customer_data_free === true,
    evidence_items_synthetic_only: index.all_evidence_items_synthetic_only === true,
    evidence_items_public_surface_safe: index.all_evidence_items_public_surface_safe === true,
    publication_not_previously_authorized: source.readiness_state.publication_authorized === false,
    external_customer_readiness_excluded: source.readiness_state.external_customer_ready === false,
    banking_pack_readiness_excluded: source.readiness_state.banking_pack_ready === false,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    legal_validity_excluded: source.non_claims.legal_validity === false,
    public_accreditation_excluded: source.non_claims.public_accreditation === false,
    procurement_eligibility_excluded: source.non_claims.procurement_eligibility === false,
    security_certification_excluded: index.blocked_public_claim_bindings.security_certification === true,
    ai_authority_excluded: source.non_claims.ai_authority === false && index.blocked_public_claim_bindings.ai_authority === true
  };
}

function buildPublicSurfaceReadinessGatePayload(source) {
  const criteria = buildGateCriteria(source);
  const gatePassed = allTrue(Object.values(criteria));

  return {
    public_surface_readiness_gate_id: 'PUBLIC-SURFACE-READINESS-GATE::HBCE-L1-DECISION-PROOF-0001',
    source_public_surface_evidence_index_ref: SOURCE_REF,
    source_public_surface_evidence_index_digest: source.public_surface_evidence_index.public_surface_evidence_index_payload_digest,
    gate_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_CONTROLLED_INFORMATION_ONLY',
    gate_status: gatePassed ? 'PASS_CONTROLLED_PUBLIC_INFORMATION_SURFACE_READY' : 'FAIL_PUBLIC_SURFACE_NOT_READY',
    gate_result: gatePassed ? 'PUBLIC_SURFACE_READY_CONTROLLED_INFORMATION_ONLY' : 'PUBLIC_SURFACE_NOT_READY',
    evaluated_at: '2027-01-19T16:45:00Z',
    gate_criteria: criteria,
    all_gate_criteria_passed: gatePassed,
    approved_public_surface_claims: {
      public_surface_ready_controlled_information_only: gatePassed,
      publication_authorized_for_controlled_public_information_surface: gatePassed,
      controlled_synthetic_client_demo_pack_ready: gatePassed,
      public_surface_scope_locked: gatePassed,
      public_surface_content_model_ready: gatePassed,
      public_surface_copy_ready: gatePassed,
      public_surface_evidence_index_ready: gatePassed
    },
    blocked_claims_preserved_after_gate: {
      external_customer_delivery_ready: true,
      banking_pack_ready: true,
      level1_launch_ready: true,
      production_ready: true,
      legal_validity: true,
      public_accreditation: true,
      procurement_eligibility: true,
      security_certification: true,
      pricing_commitment: true,
      sla_commitment: true,
      ai_authority: true,
      autonomous_execution: true,
      external_effect_proven: true,
      business_success: true
    },
    publication_authorization: {
      authorized: gatePassed,
      authorization_scope: gatePassed ? 'controlled_public_information_surface_only' : null,
      authorized_surface_types: gatePassed
        ? ['public_website', 'public_one_pager', 'public_intro_deck', 'public_contact_or_intake_page']
        : [],
      authorization_boundary: 'Publication authorization is limited to the controlled public information surface defined by PROG-093, structured by PROG-094, written by PROG-095 and evidence-bound by PROG-096.',
      customer_data_allowed: false,
      customer_logo_allowed_without_authorization: false,
      legal_validity_claim_allowed: false,
      public_accreditation_claim_allowed: false,
      procurement_eligibility_claim_allowed: false,
      security_certification_claim_allowed: false,
      ai_authority_claim_allowed: false
    },
    required_public_surface_controls: [
      'publish_only_controlled_public_information_surface',
      'keep_non_claims_visible_near_positive_claims',
      'preserve_evidence_index_references',
      'do_not_add_customer_data',
      'do_not_add_customer_logos_without_authorization',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_public_accreditation',
      'do_not_claim_procurement_eligibility',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority',
      'fail_closed_on_unindexed_public_claim'
    ],
    public_surface_boundary_after_gate: {
      controlled_information_surface_only: true,
      synthetic_demo_boundary_preserved: true,
      evidence_index_required: true,
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
    source_public_surface_evidence_index_ready: source.readiness_state.public_surface_evidence_index_ready === true,
    source_public_surface_copy_ready: source.readiness_state.public_surface_copy_ready === true,
    source_public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready === true,
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    public_surface_readiness_gate_passed: gatePassed,
    public_surface_ready: gatePassed,
    publication_authorized: gatePassed,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    readiness_gate_comment: 'The public surface readiness gate authorizes only a controlled public information surface. It does not create external customer delivery readiness, banking readiness, Level 1 launch readiness, production readiness, legal validity, procurement eligibility, security certification or AI authority.',
    ai_readiness_gate_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceReadinessGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const payload = buildPublicSurfaceReadinessGatePayload(source);

  const checklist = {
    source_public_surface_evidence_index_hash_valid: validHash(source),
    source_public_surface_evidence_index_ready: source.readiness_state.public_surface_evidence_index_ready === true,
    source_public_surface_copy_ready: source.readiness_state.public_surface_copy_ready === true,
    source_public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready === true,
    source_public_surface_scope_locked: source.readiness_state.public_surface_scope_locked === true,
    source_controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    all_required_evidence_refs_indexed: source.readiness_state.all_required_evidence_refs_indexed === true,
    all_evidence_hashes_valid: source.readiness_state.all_evidence_hashes_valid === true,
    positive_public_claims_bound_to_evidence: source.readiness_state.positive_public_claims_bound_to_evidence === true,
    blocked_public_claims_preserved: source.readiness_state.blocked_public_claims_preserved === true,
    publication_authorization_scope_limited: payload.publication_authorization.authorization_scope === 'controlled_public_information_surface_only',
    external_customer_readiness_excluded: payload.external_customer_ready === false,
    banking_pack_readiness_excluded: payload.banking_pack_ready === false,
    launch_readiness_excluded: payload.level1_launch_ready === false,
    production_readiness_excluded: payload.production_ready === false,
    ai_authority_absence_confirmed: payload.ai_readiness_gate_authority_allowed === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-097-PUBLIC-SURFACE-READINESS-GATE-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_READINESS_GATE',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-READINESS-GATE-2027-PROG-097',
    issue_id: 'PROG-097',
    priority: 'LEVEL1-PUBLIC-SURFACE-READINESS-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_public_surface_evidence_index_ref: SOURCE_REF,
    source_public_surface_evidence_index_revision_hash: source.revision_hash,
    source_public_surface_evidence_index_revision_hash_valid: validHash(source),

    level1_public_surface_readiness_gate_status: STATUS,

    inherited_public_surface_evidence_index: {
      evidence_index_status: source.level1_public_surface_evidence_index_status,
      surface_scope: source.public_surface_evidence_index.surface_scope,
      surface_status: source.public_surface_evidence_index.surface_status,
      public_surface_evidence_index_ready: source.readiness_state.public_surface_evidence_index_ready,
      public_surface_copy_ready: source.readiness_state.public_surface_copy_ready,
      public_surface_content_model_ready: source.readiness_state.public_surface_content_model_ready,
      public_surface_scope_locked: source.readiness_state.public_surface_scope_locked,
      controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready,
      prior_public_surface_readiness_gate_passed: source.readiness_state.public_surface_readiness_gate_passed,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_publication_authorized: source.readiness_state.publication_authorized,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_readiness_gate: {
      ...payload,
      public_surface_readiness_gate_payload_digest: sha256Digest(payload),
      readiness_gate_checklist: checklist,
      public_surface_readiness_gate_defined: true,
      public_surface_readiness_gate_is_controlled_information_only: true,
      public_surface_readiness_gate_is_not_external_customer_readiness: true,
      public_surface_readiness_gate_is_not_banking_pack_readiness: true,
      public_surface_readiness_gate_is_not_launch_readiness: true,
      public_surface_readiness_gate_is_not_production_readiness: true,
      public_surface_readiness_gate_is_not_legal_validity: true,
      public_surface_readiness_gate_is_not_security_certification: true,
      public_surface_readiness_gate_does_not_authorize_ai_authority: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_READINESS_GATE_MISSING',
      'SOURCE_PUBLIC_SURFACE_EVIDENCE_INDEX_HASH_INVALID',
      'PUBLIC_SURFACE_EVIDENCE_INDEX_NOT_READY',
      'PUBLIC_SURFACE_COPY_NOT_READY',
      'PUBLIC_SURFACE_CONTENT_MODEL_NOT_READY',
      'PUBLIC_SURFACE_SCOPE_NOT_LOCKED',
      'CONTROLLED_SYNTHETIC_CLIENT_DEMO_PACK_NOT_READY',
      'REQUIRED_PUBLIC_SURFACE_EVIDENCE_REF_MISSING',
      'PUBLIC_SURFACE_EVIDENCE_HASH_INVALID',
      'POSITIVE_PUBLIC_CLAIM_WITHOUT_EVIDENCE_BINDING',
      'BLOCKED_PUBLIC_CLAIM_NOT_PRESERVED',
      'UNSUPPORTED_EXTERNAL_CUSTOMER_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_LAUNCH_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_READINESS_GATE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_readiness_gate_defined: true,
      public_surface_readiness_gate_passed: payload.public_surface_readiness_gate_passed,
      public_surface_ready: payload.public_surface_ready,
      publication_authorized: payload.publication_authorized,
      publication_authorization_scope: payload.publication_authorization.authorization_scope,
      source_public_surface_evidence_index_bound: true,
      public_surface_evidence_index_ready: true,
      public_surface_copy_ready: true,
      public_surface_content_model_ready: true,
      public_surface_scope_locked: true,
      controlled_synthetic_client_demo_pack_ready: true,
      all_gate_criteria_passed: payload.all_gate_criteria_passed,
      publication_authorization_scope_limited: checklist.publication_authorization_scope_limited,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-098-HBCE-LEVEL1-PUBLIC-SURFACE-PUBLICATION-SNAPSHOT',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel1PublicSurfaceReadinessGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceReadinessGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-097-level1-public-surface-readiness-gate.json';
  const doc = writeLevel1PublicSurfaceReadinessGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_097_LEVEL1_PUBLIC_SURFACE_READINESS_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildGateCriteria,
  buildPublicSurfaceReadinessGatePayload,
  buildLevel1PublicSurfaceReadinessGate,
  writeLevel1PublicSurfaceReadinessGate
};
