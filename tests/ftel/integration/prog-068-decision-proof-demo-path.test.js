'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, STAGES, REQUIRED, buildDecisionProofDemoPath } = require('../../../runtime/level1/build-prog-068-decision-proof-demo-path.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-068-decision-proof-demo-path.json';
const mdPath = 'docs/launch/level1/prog-068-decision-proof-demo-path.md';
const runtimePath = 'runtime/level1/build-prog-068-decision-proof-demo-path.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-068-DECISION-PROOF-DEMO-PATH-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_DEMO_PATH');
assert.equal(doc.issue_id, 'PROG-068');
assert.equal(doc.demo_path_status, STATUS);
assert.equal(doc.source_scope_lock_revision_hash, source.revision_hash);
assert.equal(doc.source_scope_lock_revision_hash_valid, true);

const regenerated = buildDecisionProofDemoPath({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.deepEqual(doc.decision_proof_demo_path.demo_stages, STAGES);
assert.deepEqual(doc.decision_proof_demo_path.required_artifacts, REQUIRED);
assert.equal(doc.decision_proof_demo_path.authority_model.human_or_organizational_authority_required, true);
assert.equal(doc.decision_proof_demo_path.authority_model.ai_model_authority_allowed, false);
assert.equal(doc.decision_proof_demo_path.authority_model.ai_model_may_explain_or_assist, true);
assert.equal(doc.decision_proof_demo_path.authority_model.ai_model_may_not_approve_or_execute_authority, true);

assert.equal(doc.decision_proof_demo_path.evidence_model.policy_evaluation_required, true);
assert.equal(doc.decision_proof_demo_path.evidence_model.action_request_required, true);
assert.equal(doc.decision_proof_demo_path.evidence_model.action_receipt_required, true);
assert.equal(doc.decision_proof_demo_path.evidence_model.audit_event_required, true);
assert.equal(doc.decision_proof_demo_path.evidence_model.export_manifest_required, true);
assert.equal(doc.decision_proof_demo_path.evidence_model.verifier_replay_required, true);

assert.equal(doc.minimal_demo_sequence.length, 7);
assert.equal(doc.readiness_state.decision_proof_demo_path_defined, true);
assert.equal(doc.readiness_state.decision_proof_demo_path_ready, false);
assert.equal(doc.readiness_state.required_artifacts_complete, false);
assert.equal(doc.readiness_state.verifier_replay_ready, false);
assert.equal(doc.readiness_state.client_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.level1_release_candidate_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST');
assert.equal(doc.non_claims.demo_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);

assert.match(md, /LEVEL1_DECISION_PROOF_DEMO_PATH_DEFINED_NOT_READY/);
assert.match(md, /does not certify launch readiness/);
assert.match(md, /does not allow AI model authority/);
assert.match(md, /PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST/);

console.log('PASS PROG-068-DECISION-PROOF-DEMO-PATH-DOCS-EXIST');
console.log('PASS PROG-068-DECISION-PROOF-DEMO-PATH-HASH-STABLE');
console.log('PASS PROG-068-BUILDER-STABLE');
console.log('PASS PROG-068-SOURCE-PROG-067-INTEGRITY-VALID');
console.log('PASS PROG-068-DEMO-STAGES-DEFINED');
console.log('PASS PROG-068-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-068-EVIDENCE-MODEL-REQUIRED');
console.log('PASS PROG-068-NOT-DEMO-READY');
console.log('PASS PROG-068-NEXT-PROG-069-RECORDED');
console.log('PASS PROG-068-NO-UNSUPPORTED-READINESS-CLAIMS');
