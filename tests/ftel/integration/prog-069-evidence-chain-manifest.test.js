'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, CHAIN_NODES, REQUIRED_BINDINGS, buildEvidenceChainManifest } = require('../../../runtime/level1/build-prog-069-evidence-chain-manifest.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-069-evidence-chain-manifest.json';
const mdPath = 'docs/launch/level1/prog-069-evidence-chain-manifest.md';
const runtimePath = 'runtime/level1/build-prog-069-evidence-chain-manifest.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-069-EVIDENCE-CHAIN-MANIFEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_EVIDENCE_CHAIN_MANIFEST');
assert.equal(doc.issue_id, 'PROG-069');
assert.equal(doc.evidence_chain_manifest_status, STATUS);
assert.equal(doc.source_decision_proof_demo_path_revision_hash, source.revision_hash);
assert.equal(doc.source_decision_proof_demo_path_revision_hash_valid, true);

const regenerated = buildEvidenceChainManifest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_demo_boundary.decision_proof_demo_path_ready, false);
assert.equal(doc.inherited_demo_boundary.ai_authority_allowed, false);
assert.equal(doc.inherited_demo_boundary.human_or_organizational_authority_required, true);

assert.deepEqual(doc.evidence_chain_manifest.chain_nodes, CHAIN_NODES);
assert.deepEqual(doc.evidence_chain_manifest.required_bindings, REQUIRED_BINDINGS);
assert.equal(doc.evidence_chain_manifest.ordering_required, true);
assert.equal(doc.evidence_chain_manifest.canonical_json_required, true);
assert.equal(doc.evidence_chain_manifest.sha256_digest_required, true);
assert.equal(doc.evidence_chain_manifest.parent_child_linking_required, true);
assert.equal(doc.evidence_chain_manifest.verifier_replay_required, true);
assert.equal(doc.evidence_chain_manifest.missing_node_fails_closed, true);
assert.equal(doc.evidence_chain_manifest.missing_digest_fails_closed, true);
assert.equal(doc.evidence_chain_manifest.broken_chain_link_fails_closed, true);
assert.equal(doc.evidence_chain_manifest.ai_authority_claim_fails_closed, true);

assert.equal(doc.chain_node_requirements.length, 7);
assert.equal(doc.chain_node_requirements[0].node, 'AUTHORITY_BOUNDARY_STATEMENT');
assert.equal(doc.chain_node_requirements[0].required_parent, null);
assert.equal(doc.chain_node_requirements[6].node, 'VERIFIER_REPLAY_RESULT');
assert.equal(doc.chain_node_requirements[6].required_parent, 'EVIDENCE_EXPORT_MANIFEST');

for (const code of [
  'EVIDENCE_CHAIN_NODE_MISSING',
  'EVIDENCE_CHAIN_NODE_DIGEST_MISSING',
  'EVIDENCE_CHAIN_PARENT_LINK_INVALID',
  'VERIFIER_REPLAY_RESULT_MISSING',
  'AI_AUTHORITY_CLAIM_BLOCKED'
]) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.evidence_chain_manifest_defined, true);
assert.equal(doc.readiness_state.evidence_chain_manifest_ready, false);
assert.equal(doc.readiness_state.chain_nodes_complete, false);
assert.equal(doc.readiness_state.chain_digests_complete, false);
assert.equal(doc.readiness_state.parent_child_links_complete, false);
assert.equal(doc.readiness_state.verifier_replay_ready, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.level1_release_candidate_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-070-HBCE-LEVEL1-AUTHORITY-BOUNDARY-STATEMENT');

assert.equal(doc.non_claims.evidence_chain_complete, false);
assert.equal(doc.non_claims.verifier_replay_ready, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);

assert.match(md, /LEVEL1_EVIDENCE_CHAIN_MANIFEST_DEFINED_NOT_READY/);
assert.match(md, /does not complete the evidence chain/);
assert.match(md, /does not certify launch readiness/);
assert.match(md, /AI authority claims fail closed/);
assert.match(md, /PROG-070-HBCE-LEVEL1-AUTHORITY-BOUNDARY-STATEMENT/);

console.log('PASS PROG-069-EVIDENCE-CHAIN-MANIFEST-DOCS-EXIST');
console.log('PASS PROG-069-EVIDENCE-CHAIN-MANIFEST-HASH-STABLE');
console.log('PASS PROG-069-BUILDER-STABLE');
console.log('PASS PROG-069-SOURCE-PROG-068-INTEGRITY-VALID');
console.log('PASS PROG-069-CHAIN-NODES-DEFINED');
console.log('PASS PROG-069-BINDINGS-DEFINED');
console.log('PASS PROG-069-PARENT-CHILD-LINKING-REQUIRED');
console.log('PASS PROG-069-NOT-CHAIN-COMPLETE');
console.log('PASS PROG-069-NEXT-PROG-070-RECORDED');
console.log('PASS PROG-069-NO-UNSUPPORTED-READINESS-CLAIMS');
