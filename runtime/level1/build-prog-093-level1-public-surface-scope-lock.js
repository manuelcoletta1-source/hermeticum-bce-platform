'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_PUBLIC_SURFACE_SCOPE_LOCK_DEFINED_NOT_PUBLIC_READY';
const SOURCE_REF = 'docs/launch/level1/prog-092-level1-client-demo-pack-readiness-gate.json';

const ALLOWED_PUBLIC_CONTENT = Object.freeze([
  'company_identity',
  'level1_problem_statement',
  'human_governed_decision_proof_description',
  'controlled_synthetic_client_demo_pack_ready_statement',
  'decision_proof_evidence_chain_summary',
  'authority_boundary_summary',
  'synthetic_demo_boundary_summary',
  'non_claims_summary',
  'controlled_pilot_intake_statement',
  'contact_or_intake_channel'
]);

const EXCLUDED_PUBLIC_CONTENT = Object.freeze([
  'customer_data',
  'live_system_control_claim',
  'production_integration_claim',
  'legal_validity_claim',
  'public_accreditation_claim',
  'procurement_eligibility_claim',
  'security_certification_claim',
  'banking_pack_ready_claim',
  'external_customer_delivery_ready_claim',
  'level1_launch_ready_claim',
  'production_ready_claim',
  'pricing_commitment',
  'sla_commitment',
  'ai_authority_claim',
  'autonomous_execution_claim',
  'unverified_case_study',
  'customer_logo_without_authorization'
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

function buildPublicSurfaceScopePayload(source) {
  return {
    public_surface_scope_id: 'PUBLIC-SURFACE-SCOPE::HBCE-L1-DECISION-PROOF-0001',
    source_client_demo_pack_readiness_gate_ref: SOURCE_REF,
    source_client_demo_pack_readiness_gate_digest: source.client_demo_pack_readiness_gate.readiness_gate_payload_digest,
    surface_scope: 'LEVEL1_DECISION_PROOF_PUBLIC_SURFACE_SYNTHETIC_ONLY',
    surface_status: 'SCOPE_LOCKED_NOT_PUBLIC_READY',
    surface_mode: 'PUBLIC_INFORMATION_SURFACE_SCOPE_LOCK',
    defined_at: '2027-01-19T16:25:00Z',
    intended_public_surfaces: [
      'public_website',
      'public_one_pager',
      'public_intro_deck',
      'public_contact_or_intake_page'
    ],
    intended_audiences: [
      'institutional_interlocutors',
      'regulated_enterprise_interlocutors',
      'banking_risk_compliance_audit_security_innovation_procurement',
      'technical_due_diligence_interlocutors'
    ],
    allowed_public_content: ALLOWED_PUBLIC_CONTENT,
    excluded_public_content: EXCLUDED_PUBLIC_CONTENT,
    public_surface_claims_allowed: {
      company_identity: true,
      level1_problem_statement: true,
      human_governed_decision_proof_description: true,
      controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
      level1_client_pack_ready_inside_synthetic_demo_boundary: source.readiness_state.level1_client_pack_ready === true,
      public_surface_scope_locked: true,
      controlled_pilot_intake_available: true
    },
    public_surface_claims_blocked: {
      public_surface_ready: true,
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
      autonomous_execution: true
    },
    required_surface_controls: [
      'state_synthetic_only_boundary',
      'state_controlled_demo_pack_boundary',
      'bind_claims_to_prog_092_readiness_gate',
      'show_non_claims_near_positive_claims',
      'do_not_use_customer_data',
      'do_not_use_customer_logos_without_authorization',
      'do_not_claim_public_surface_readiness_until_public_surface_gate',
      'do_not_claim_external_customer_delivery_readiness',
      'do_not_claim_banking_pack_readiness',
      'do_not_claim_level1_launch_readiness',
      'do_not_claim_production_readiness',
      'do_not_claim_legal_validity',
      'do_not_claim_security_certification',
      'do_not_authorize_ai_authority'
    ],
    public_surface_boundary: {
      synthetic_demo_only: true,
      client_demo_pack_readiness_gate_required: true,
      public_surface_scope_only: true,
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
    source_client_demo_pack_readiness_gate_passed: source.readiness_state.client_demo_pack_readiness_gate_passed === true,
    controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    public_surface_scope_locked: true,
    public_surface_content_model_ready: false,
    public_surface_copy_ready: false,
    public_surface_evidence_index_ready: false,
    public_surface_readiness_gate_passed: false,
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    public_surface_scope_comment: 'This scope lock defines what may and may not appear on a Level 1 public information surface. It allows public description of the controlled synthetic client demo pack readiness while preserving non-claims and excluding public readiness, external customer delivery readiness, banking readiness, launch readiness, production readiness, legal validity, security certification and AI authority.',
    ai_public_surface_authority_allowed: false
  };
}

function buildLevel1PublicSurfaceScopeLock(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const scopePayload = buildPublicSurfaceScopePayload(source);

  const scopeChecklist = {
    source_client_demo_pack_readiness_gate_hash_valid: validHash(source),
    source_client_demo_pack_readiness_gate_passed: source.readiness_state.client_demo_pack_readiness_gate_passed === true,
    controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready === true,
    allowed_public_content_defined: scopePayload.allowed_public_content.length === ALLOWED_PUBLIC_CONTENT.length,
    excluded_public_content_defined: scopePayload.excluded_public_content.length === EXCLUDED_PUBLIC_CONTENT.length,
    public_surface_controls_defined: scopePayload.required_surface_controls.length >= 10,
    public_surface_positive_claims_bound_to_prog_092: scopePayload.public_surface_claims_allowed.controlled_synthetic_client_demo_pack_ready === true,
    blocked_claims_preserved: Object.values(scopePayload.public_surface_claims_blocked).every((value) => value === true),
    public_surface_readiness_excluded: source.readiness_state.public_surface_ready === false,
    external_customer_readiness_excluded: source.readiness_state.external_customer_ready === false,
    banking_pack_readiness_excluded: source.readiness_state.banking_pack_ready === false,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-093-PUBLIC-SURFACE-SCOPE-LOCK-v1',
    kind: 'HBCE_LEVEL1_PUBLIC_SURFACE_SCOPE_LOCK',
    document_code: 'HBCE-L1-PUBLIC-SURFACE-SCOPE-LOCK-2027-PROG-093',
    issue_id: 'PROG-093',
    priority: 'LEVEL1-PUBLIC-SURFACE-SCOPE-LOCK',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_client_demo_pack_readiness_gate_ref: SOURCE_REF,
    source_client_demo_pack_readiness_gate_revision_hash: source.revision_hash,
    source_client_demo_pack_readiness_gate_revision_hash_valid: validHash(source),

    level1_public_surface_scope_lock_status: STATUS,

    inherited_client_demo_pack_readiness_gate: {
      readiness_gate_status: source.level1_client_demo_pack_readiness_gate_status,
      gate_result: source.client_demo_pack_readiness_gate.gate_result,
      gate_passed: source.client_demo_pack_readiness_gate.gate_passed,
      controlled_synthetic_client_demo_pack_ready: source.readiness_state.controlled_synthetic_client_demo_pack_ready,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    public_surface_scope_lock: {
      ...scopePayload,
      public_surface_scope_payload_digest: sha256Digest(scopePayload),
      scope_checklist: scopeChecklist,
      public_surface_scope_lock_defined: true,
      public_surface_scope_lock_is_not_public_surface_readiness: true,
      public_surface_scope_lock_is_not_external_customer_readiness: true,
      public_surface_scope_lock_is_not_banking_pack_readiness: true,
      public_surface_scope_lock_is_not_launch_readiness: true,
      public_surface_scope_lock_is_not_production_readiness: true,
      public_surface_scope_lock_is_not_legal_validity: true,
      public_surface_scope_lock_is_not_security_certification: true
    },

    fail_closed_codes: [
      'PUBLIC_SURFACE_SCOPE_LOCK_MISSING',
      'SOURCE_CLIENT_DEMO_PACK_READINESS_GATE_HASH_INVALID',
      'CLIENT_DEMO_PACK_READINESS_GATE_NOT_PASSED',
      'ALLOWED_PUBLIC_CONTENT_MISSING',
      'EXCLUDED_PUBLIC_CONTENT_MISSING',
      'PUBLIC_SURFACE_CONTROL_MISSING',
      'PUBLIC_SURFACE_POSITIVE_CLAIM_NOT_BOUND_TO_PROG_092',
      'UNSUPPORTED_PUBLIC_READINESS_CLAIM',
      'UNSUPPORTED_BANKING_READINESS_CLAIM',
      'UNSUPPORTED_PRODUCTION_READINESS_CLAIM',
      'AI_PUBLIC_SURFACE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      public_surface_scope_lock_defined: true,
      public_surface_scope_locked: true,
      source_client_demo_pack_readiness_gate_bound: true,
      client_demo_pack_readiness_gate_passed: true,
      controlled_synthetic_client_demo_pack_ready: true,
      allowed_public_content_defined: true,
      excluded_public_content_defined: true,
      public_surface_controls_defined: true,
      public_surface_content_model_ready: false,
      public_surface_copy_ready: false,
      public_surface_evidence_index_ready: false,
      public_surface_readiness_gate_passed: false,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-094-HBCE-LEVEL1-PUBLIC-SURFACE-CONTENT-MODEL',

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

function writeLevel1PublicSurfaceScopeLock(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1PublicSurfaceScopeLock({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-093-level1-public-surface-scope-lock.json';
  const doc = writeLevel1PublicSurfaceScopeLock(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_093_LEVEL1_PUBLIC_SURFACE_SCOPE_LOCK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  ALLOWED_PUBLIC_CONTENT,
  EXCLUDED_PUBLIC_CONTENT,
  buildPublicSurfaceScopePayload,
  buildLevel1PublicSurfaceScopeLock,
  writeLevel1PublicSurfaceScopeLock
};
