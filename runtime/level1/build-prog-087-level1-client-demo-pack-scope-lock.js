'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_CLIENT_DEMO_PACK_SCOPE_LOCK_DEFINED_NOT_CLIENT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-086-decision-proof-demo-readiness-snapshot.json';

const CLIENT_DEMO_ALLOWED_CONTENT = Object.freeze([
  'executive_context',
  'problem_statement',
  'decision_proof_demo_narrative',
  'synthetic_fixture_description',
  'evidence_chain_walkthrough',
  'authority_boundary_explanation',
  'policy_evaluation_explanation',
  'action_request_receipt_audit_flow',
  'evidence_export_and_verifier_replay_flow',
  'human_acceptance_flow',
  'demo_readiness_snapshot',
  'non_claims_and_boundaries'
]);

const CLIENT_DEMO_EXCLUDED_CONTENT = Object.freeze([
  'customer_data',
  'live_system_control',
  'production_integration',
  'legal_validity_claim',
  'public_accreditation_claim',
  'procurement_eligibility_claim',
  'external_effect_claim',
  'business_success_claim',
  'ai_authority_claim',
  'pricing_commitment',
  'sla_commitment',
  'security_certification_claim'
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

function buildScopeLockPayload(source) {
  return {
    client_demo_pack_scope_lock_id: 'CLIENT-DEMO-PACK-SCOPE::HBCE-L1-DECISION-PROOF-0001',
    source_demo_readiness_snapshot_ref: SOURCE_REF,
    source_demo_readiness_snapshot_digest: source.demo_readiness_snapshot.snapshot_payload_digest,
    pack_scope: 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK',
    pack_status: 'SCOPE_LOCKED_NOT_CLIENT_READY',
    target_audience: [
      'banking_risk',
      'banking_compliance',
      'banking_audit',
      'banking_security',
      'banking_innovation',
      'banking_procurement'
    ],
    demo_mode: 'SYNTHETIC_DECISION_PROOF_DEMO_ONLY',
    allowed_content: CLIENT_DEMO_ALLOWED_CONTENT,
    excluded_content: CLIENT_DEMO_EXCLUDED_CONTENT,
    required_pack_sections: [
      'scope_boundary',
      'demo_storyline',
      'evidence_artifact_index',
      'runbook_reference',
      'replay_reference',
      'human_acceptance_reference',
      'risk_and_non_claims',
      'client_questions_boundary'
    ],
    required_next_artifacts: [
      'client_demo_pack_evidence_index',
      'client_demo_pack_runbook',
      'client_demo_pack_script',
      'client_demo_pack_q_and_a_boundary',
      'client_demo_pack_readiness_gate'
    ],
    public_surface_required: true,
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_client_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    scope_locked_at: '2027-01-19T15:55:00Z',
    scope_lock_comment: 'Client demo pack scope is locked around the synthetic Level 1 Decision Proof demo. The scope lock permits a controlled client-facing demo pack to be built, but does not make the client pack ready, launch-ready, banking-ready or production-ready.',
    ai_scope_authority_allowed: false
  };
}

function buildLevel1ClientDemoPackScopeLock(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const scopePayload = buildScopeLockPayload(source);

  const scopeChecklist = {
    source_demo_readiness_snapshot_hash_valid: validHash(source),
    demo_readiness_snapshot_passed: source.readiness_state.demo_readiness_snapshot_passed === true,
    decision_proof_demo_ready_confirmed: source.readiness_state.decision_proof_demo_ready === true,
    synthetic_only_boundary_confirmed: source.demo_readiness_snapshot.snapshot_is_synthetic_only === true,
    demonstrable_artifacts_defined: Array.isArray(source.demo_readiness_snapshot.demonstrable_artifacts) && source.demo_readiness_snapshot.demonstrable_artifacts.length >= 10,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    client_pack_readiness_excluded: source.readiness_state.level1_client_pack_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    no_customer_data_confirmed: source.demo_readiness_snapshot.demonstration_boundary.no_customer_data === true,
    no_live_system_control_confirmed: source.demo_readiness_snapshot.demonstration_boundary.no_live_system_control === true,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-087-CLIENT-DEMO-PACK-SCOPE-LOCK-v1',
    kind: 'HBCE_LEVEL1_CLIENT_DEMO_PACK_SCOPE_LOCK',
    document_code: 'HBCE-L1-CLIENT-DEMO-PACK-SCOPE-LOCK-2027-PROG-087',
    issue_id: 'PROG-087',
    priority: 'LEVEL1-CLIENT-DEMO-PACK-SCOPE-LOCK',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_demo_readiness_snapshot_ref: SOURCE_REF,
    source_demo_readiness_snapshot_revision_hash: source.revision_hash,
    source_demo_readiness_snapshot_revision_hash_valid: validHash(source),

    level1_client_demo_pack_scope_lock_status: STATUS,

    inherited_demo_readiness_boundary: {
      demo_readiness_snapshot_status: source.decision_proof_demo_readiness_snapshot_status,
      snapshot_result: source.demo_readiness_snapshot.snapshot_result,
      verifier_replay_result: source.inherited_closure_gate_boundary.verifier_replay_result,
      verifier_replay_passed: source.readiness_state.verifier_replay_passed,
      synthetic_chain_closed: source.readiness_state.synthetic_chain_closed,
      human_acceptance_completed: source.readiness_state.human_acceptance_completed,
      decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_level1_client_pack_ready: source.readiness_state.level1_client_pack_ready,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    client_demo_pack_scope_lock: {
      ...scopePayload,
      scope_lock_payload_digest: sha256Digest(scopePayload),
      scope_checklist: scopeChecklist,
      scope_locked: true,
      scope_lock_is_not_client_pack_readiness: true,
      scope_lock_is_not_launch_readiness: true,
      scope_lock_is_not_public_surface_readiness: true,
      scope_lock_is_not_external_customer_readiness: true,
      scope_lock_is_not_banking_pack_readiness: true,
      scope_lock_is_not_production_readiness: true,
      scope_lock_is_not_legal_validity: true,
      scope_lock_is_not_security_certification: true
    },

    fail_closed_codes: [
      'CLIENT_DEMO_PACK_SCOPE_LOCK_MISSING',
      'SOURCE_DEMO_READINESS_SNAPSHOT_HASH_INVALID',
      'DEMO_READINESS_SNAPSHOT_NOT_PASSED',
      'DEMO_NOT_READY',
      'SYNTHETIC_ONLY_BOUNDARY_NOT_CONFIRMED',
      'DEMONSTRABLE_ARTIFACTS_MISSING',
      'CUSTOMER_DATA_CLAIM_BLOCKED',
      'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_SCOPE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      client_demo_pack_scope_lock_defined: true,
      client_demo_pack_scope_locked: true,
      source_demo_readiness_snapshot_bound: true,
      decision_proof_demo_ready: true,
      synthetic_only_boundary_confirmed: true,
      demonstrable_artifacts_defined: true,
      client_demo_allowed_content_defined: true,
      client_demo_excluded_content_defined: true,
      client_demo_required_sections_defined: true,
      buyer_personas_defined: true,
      public_surface_required: true,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_client_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-088-HBCE-LEVEL1-CLIENT-DEMO-PACK-EVIDENCE-INDEX',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
      ai_authority: false,
      autonomous_authority: false,
      client_pack_ready: false,
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

function writeLevel1ClientDemoPackScopeLock(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1ClientDemoPackScopeLock({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-087-level1-client-demo-pack-scope-lock.json';
  const doc = writeLevel1ClientDemoPackScopeLock(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_087_LEVEL1_CLIENT_DEMO_PACK_SCOPE_LOCK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  CLIENT_DEMO_ALLOWED_CONTENT,
  CLIENT_DEMO_EXCLUDED_CONTENT,
  buildScopeLockPayload,
  buildLevel1ClientDemoPackScopeLock,
  writeLevel1ClientDemoPackScopeLock
};
