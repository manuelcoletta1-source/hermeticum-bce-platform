'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_EVIDENCE_CHAIN_MANIFEST_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-068-decision-proof-demo-path.json';

const CHAIN_NODES = Object.freeze([
  'AUTHORITY_BOUNDARY_STATEMENT',
  'POLICY_EVALUATION_RECORD',
  'ACTION_REQUEST_RECORD',
  'ACTION_RECEIPT_RECORD',
  'AUDIT_EVENT_RECORD',
  'EVIDENCE_EXPORT_MANIFEST',
  'VERIFIER_REPLAY_RESULT'
]);

const REQUIRED_BINDINGS = Object.freeze([
  'canonical_json_binding',
  'sha256_digest_binding',
  'authority_ref_binding',
  'policy_evaluation_ref_binding',
  'action_request_ref_binding',
  'action_receipt_ref_binding',
  'audit_event_ref_binding',
  'export_manifest_ref_binding',
  'verifier_replay_ref_binding',
  'non_claims_binding'
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

function buildEvidenceChainManifest(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-069-EVIDENCE-CHAIN-MANIFEST-v1',
    kind: 'HBCE_LEVEL1_EVIDENCE_CHAIN_MANIFEST',
    document_code: 'HBCE-L1-EVIDENCE-CHAIN-MANIFEST-2027-PROG-069',
    issue_id: 'PROG-069',
    priority: 'LEVEL1-EVIDENCE-CHAIN-MANIFEST',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_decision_proof_demo_path_ref: SOURCE_REF,
    source_decision_proof_demo_path_revision_hash: source.revision_hash,
    source_decision_proof_demo_path_revision_hash_valid: validHash(source),

    evidence_chain_manifest_status: STATUS,

    inherited_demo_boundary: {
      demo_path_status: source.demo_path_status,
      decision_proof_demo_path_ready: source.readiness_state.decision_proof_demo_path_ready,
      ai_authority_allowed: source.decision_proof_demo_path.authority_model.ai_model_authority_allowed,
      human_or_organizational_authority_required: source.decision_proof_demo_path.authority_model.human_or_organizational_authority_required
    },

    evidence_chain_manifest: {
      purpose: 'Define the ordered Level 1 evidence chain required by the Decision Proof demo path.',
      chain_nodes: CHAIN_NODES,
      required_bindings: REQUIRED_BINDINGS,
      ordering_required: true,
      canonical_json_required: true,
      sha256_digest_required: true,
      parent_child_linking_required: true,
      verifier_replay_required: true,
      missing_node_fails_closed: true,
      missing_digest_fails_closed: true,
      broken_chain_link_fails_closed: true,
      ai_authority_claim_fails_closed: true
    },

    chain_node_requirements: [
      { order: 1, node: 'AUTHORITY_BOUNDARY_STATEMENT', required_digest: true, required_parent: null },
      { order: 2, node: 'POLICY_EVALUATION_RECORD', required_digest: true, required_parent: 'AUTHORITY_BOUNDARY_STATEMENT' },
      { order: 3, node: 'ACTION_REQUEST_RECORD', required_digest: true, required_parent: 'POLICY_EVALUATION_RECORD' },
      { order: 4, node: 'ACTION_RECEIPT_RECORD', required_digest: true, required_parent: 'ACTION_REQUEST_RECORD' },
      { order: 5, node: 'AUDIT_EVENT_RECORD', required_digest: true, required_parent: 'ACTION_RECEIPT_RECORD' },
      { order: 6, node: 'EVIDENCE_EXPORT_MANIFEST', required_digest: true, required_parent: 'AUDIT_EVENT_RECORD' },
      { order: 7, node: 'VERIFIER_REPLAY_RESULT', required_digest: true, required_parent: 'EVIDENCE_EXPORT_MANIFEST' }
    ],

    fail_closed_codes: [
      'EVIDENCE_CHAIN_MANIFEST_MISSING',
      'EVIDENCE_CHAIN_NODE_MISSING',
      'EVIDENCE_CHAIN_NODE_ORDER_INVALID',
      'EVIDENCE_CHAIN_NODE_DIGEST_MISSING',
      'EVIDENCE_CHAIN_PARENT_LINK_MISSING',
      'EVIDENCE_CHAIN_PARENT_LINK_INVALID',
      'VERIFIER_REPLAY_RESULT_MISSING',
      'AI_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      evidence_chain_manifest_defined: true,
      evidence_chain_manifest_ready: false,
      chain_nodes_complete: false,
      chain_digests_complete: false,
      parent_child_links_complete: false,
      verifier_replay_ready: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_release_candidate_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-070-HBCE-LEVEL1-AUTHORITY-BOUNDARY-STATEMENT',

    non_claims: {
      evidence_chain_complete: false,
      verifier_replay_ready: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_release_candidate_ready: false,
      level1_client_pack_ready: false,
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      production_ready: false,
      ai_authority: false,
      autonomous_authority: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeEvidenceChainManifest(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildEvidenceChainManifest({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-069-evidence-chain-manifest.json';
  const doc = writeEvidenceChainManifest(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_069_EVIDENCE_CHAIN_MANIFEST_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, CHAIN_NODES, REQUIRED_BINDINGS, buildEvidenceChainManifest, writeEvidenceChainManifest };
