'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_CLIENT_DEMO_PACK_EVIDENCE_INDEX_DEFINED_NOT_CLIENT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-087-level1-client-demo-pack-scope-lock.json';

const REQUIRED_INDEX_ISSUES = Object.freeze([
  'PROG-066',
  'PROG-067',
  'PROG-068',
  'PROG-069',
  'PROG-070',
  'PROG-071',
  'PROG-072',
  'PROG-073',
  'PROG-074',
  'PROG-075',
  'PROG-076',
  'PROG-077',
  'PROG-078',
  'PROG-079',
  'PROG-080',
  'PROG-081',
  'PROG-082',
  'PROG-083',
  'PROG-084',
  'PROG-085',
  'PROG-086',
  'PROG-087'
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

function issueNumber(issueId) {
  const m = String(issueId || '').match(/PROG-(\d+)/);
  return m ? Number(m[1]) : 0;
}

function audienceUse(issueId) {
  const n = issueNumber(issueId);
  if (n <= 67) return 'scope_and_launch_boundary';
  if (n <= 70) return 'decision_proof_context_and_authority_boundary';
  if (n <= 76) return 'evidence_chain_core_walkthrough';
  if (n <= 81) return 'demo_execution_and_replay_walkthrough';
  if (n <= 84) return 'human_acceptance_walkthrough';
  if (n <= 86) return 'demo_readiness_walkthrough';
  return 'client_demo_pack_boundary';
}

function discoverEvidenceItems(rootDir) {
  const dirRel = 'docs/launch/level1';
  const dir = path.join(rootDir, dirRel);

  const files = fs.readdirSync(dir)
    .filter((name) => /^prog-0(?:6[6-9]|7[0-9]|8[0-7])-.*\.json$/.test(name))
    .sort();

  return files.map((name) => {
    const rel = `${dirRel}/${name}`;
    const artifact = readJson(rootDir, rel);
    const issue = artifact.issue_id || 'UNKNOWN';

    return {
      issue_id: issue,
      artifact_ref: rel,
      artifact_kind: artifact.kind || 'UNKNOWN',
      artifact_revision_hash: artifact.revision_hash || null,
      artifact_revision_hash_valid: validHash(artifact),
      client_demo_audience_use: audienceUse(issue),
      client_demo_safe: true,
      synthetic_only: true,
      customer_data_allowed: false,
      live_system_control_allowed: false,
      legal_validity_claim_allowed: false,
      ai_authority_claim_allowed: false
    };
  }).sort((a, b) => issueNumber(a.issue_id) - issueNumber(b.issue_id));
}

function buildEvidenceIndexPayload(source, evidenceItems) {
  const indexedIssues = evidenceItems.map((item) => item.issue_id);
  const missingRequiredIssues = REQUIRED_INDEX_ISSUES.filter((issue) => !indexedIssues.includes(issue));

  return {
    evidence_index_id: 'CLIENT-DEMO-PACK-EVIDENCE-INDEX::HBCE-L1-DECISION-PROOF-0001',
    source_client_demo_pack_scope_lock_ref: SOURCE_REF,
    source_client_demo_pack_scope_lock_digest: source.client_demo_pack_scope_lock.scope_lock_payload_digest,
    pack_scope: source.client_demo_pack_scope_lock.pack_scope,
    pack_status: 'EVIDENCE_INDEX_DEFINED_NOT_CLIENT_READY',
    index_scope: 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK_SYNTHETIC_ONLY',
    index_mode: 'SYNTHETIC_DECISION_PROOF_DEMO_ONLY',
    indexed_at: '2027-01-19T16:00:00Z',
    target_audience: source.client_demo_pack_scope_lock.target_audience,
    evidence_items: evidenceItems,
    evidence_item_count: evidenceItems.length,
    required_index_issues: REQUIRED_INDEX_ISSUES,
    indexed_issues: indexedIssues,
    missing_required_issues: missingRequiredIssues,
    all_required_issues_indexed: missingRequiredIssues.length === 0,
    all_indexed_artifacts_exist: evidenceItems.every((item) => item.artifact_ref && item.issue_id !== 'UNKNOWN'),
    all_indexed_hashes_valid: evidenceItems.every((item) => item.artifact_revision_hash_valid === true),
    evidence_index_boundary: {
      synthetic_demo_only: true,
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
      no_security_certification_claim: true
    },
    public_surface_required: true,
    public_surface_ready: false,
    external_customer_ready: false,
    banking_pack_ready: false,
    level1_client_pack_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    index_comment: 'The client demo pack evidence index is defined for the synthetic Level 1 Decision Proof demo. The index makes evidence navigable for a controlled client demo pack, but does not make the client pack ready, launch-ready, banking-ready, public-surface-ready or production-ready.',
    ai_index_authority_allowed: false
  };
}

function buildLevel1ClientDemoPackEvidenceIndex(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const evidenceItems = discoverEvidenceItems(rootDir);
  const indexPayload = buildEvidenceIndexPayload(source, evidenceItems);

  const indexChecklist = {
    source_scope_lock_hash_valid: validHash(source),
    scope_lock_defined: source.readiness_state.client_demo_pack_scope_lock_defined === true,
    scope_locked: source.readiness_state.client_demo_pack_scope_locked === true,
    decision_proof_demo_ready_confirmed: source.readiness_state.decision_proof_demo_ready === true,
    allowed_content_defined: source.readiness_state.client_demo_allowed_content_defined === true,
    excluded_content_defined: source.readiness_state.client_demo_excluded_content_defined === true,
    buyer_personas_defined: source.readiness_state.buyer_personas_defined === true,
    all_required_issues_indexed: indexPayload.all_required_issues_indexed,
    all_indexed_hashes_valid: indexPayload.all_indexed_hashes_valid,
    launch_readiness_excluded: source.readiness_state.level1_launch_ready === false,
    client_pack_readiness_excluded: source.readiness_state.level1_client_pack_ready === false,
    production_readiness_excluded: source.readiness_state.production_ready === false,
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-088-CLIENT-DEMO-PACK-EVIDENCE-INDEX-v1',
    kind: 'HBCE_LEVEL1_CLIENT_DEMO_PACK_EVIDENCE_INDEX',
    document_code: 'HBCE-L1-CLIENT-DEMO-PACK-EVIDENCE-INDEX-2027-PROG-088',
    issue_id: 'PROG-088',
    priority: 'LEVEL1-CLIENT-DEMO-PACK-EVIDENCE-INDEX',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_client_demo_pack_scope_lock_ref: SOURCE_REF,
    source_client_demo_pack_scope_lock_revision_hash: source.revision_hash,
    source_client_demo_pack_scope_lock_revision_hash_valid: validHash(source),

    level1_client_demo_pack_evidence_index_status: STATUS,

    inherited_client_demo_scope_boundary: {
      scope_lock_status: source.level1_client_demo_pack_scope_lock_status,
      pack_scope: source.client_demo_pack_scope_lock.pack_scope,
      pack_status: source.client_demo_pack_scope_lock.pack_status,
      demo_mode: source.client_demo_pack_scope_lock.demo_mode,
      decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready,
      client_demo_pack_scope_locked: source.readiness_state.client_demo_pack_scope_locked,
      prior_public_surface_ready: source.readiness_state.public_surface_ready,
      prior_external_customer_ready: source.readiness_state.external_customer_ready,
      prior_banking_pack_ready: source.readiness_state.banking_pack_ready,
      prior_level1_client_pack_ready: source.readiness_state.level1_client_pack_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    client_demo_pack_evidence_index: {
      ...indexPayload,
      evidence_index_payload_digest: sha256Digest(indexPayload),
      index_checklist: indexChecklist,
      evidence_index_defined: true,
      evidence_index_is_not_client_pack_readiness: true,
      evidence_index_is_not_launch_readiness: true,
      evidence_index_is_not_public_surface_readiness: true,
      evidence_index_is_not_external_customer_readiness: true,
      evidence_index_is_not_banking_pack_readiness: true,
      evidence_index_is_not_production_readiness: true,
      evidence_index_is_not_legal_validity: true,
      evidence_index_is_not_security_certification: true
    },

    fail_closed_codes: [
      'CLIENT_DEMO_PACK_EVIDENCE_INDEX_MISSING',
      'SOURCE_CLIENT_DEMO_PACK_SCOPE_LOCK_HASH_INVALID',
      'CLIENT_DEMO_PACK_SCOPE_NOT_LOCKED',
      'DEMO_NOT_READY',
      'REQUIRED_EVIDENCE_ARTIFACT_MISSING',
      'EVIDENCE_ARTIFACT_HASH_INVALID',
      'CUSTOMER_DATA_CLAIM_BLOCKED',
      'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_INDEX_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      client_demo_pack_evidence_index_defined: true,
      client_demo_pack_evidence_index_ready: true,
      source_client_demo_pack_scope_lock_bound: true,
      client_demo_pack_scope_locked: true,
      decision_proof_demo_ready: true,
      all_required_issues_indexed: indexPayload.all_required_issues_indexed,
      all_indexed_hashes_valid: indexPayload.all_indexed_hashes_valid,
      client_demo_allowed_content_defined: true,
      client_demo_excluded_content_defined: true,
      buyer_personas_defined: true,
      client_demo_pack_runbook_ready: false,
      client_demo_pack_script_ready: false,
      client_demo_pack_q_and_a_boundary_ready: false,
      client_demo_pack_readiness_gate_passed: false,
      public_surface_required: true,
      public_surface_ready: false,
      external_customer_ready: false,
      banking_pack_ready: false,
      level1_client_pack_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-089-HBCE-LEVEL1-CLIENT-DEMO-PACK-RUNBOOK',

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

function writeLevel1ClientDemoPackEvidenceIndex(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel1ClientDemoPackEvidenceIndex({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-088-level1-client-demo-pack-evidence-index.json';
  const doc = writeLevel1ClientDemoPackEvidenceIndex(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_088_LEVEL1_CLIENT_DEMO_PACK_EVIDENCE_INDEX_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  REQUIRED_INDEX_ISSUES,
  discoverEvidenceItems,
  buildEvidenceIndexPayload,
  buildLevel1ClientDemoPackEvidenceIndex,
  writeLevel1ClientDemoPackEvidenceIndex
};
