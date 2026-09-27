'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, REQUIRED_FIELDS, REPLAY_RESULTS, buildVerifierReplayResult } = require('../../../runtime/level1/build-prog-076-verifier-replay-result.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-076-verifier-replay-result.json';
const mdPath = 'docs/launch/level1/prog-076-verifier-replay-result.md';
const runtimePath = 'runtime/level1/build-prog-076-verifier-replay-result.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-076-VERIFIER-REPLAY-RESULT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_VERIFIER_REPLAY_RESULT');
assert.equal(doc.issue_id, 'PROG-076');
assert.equal(doc.verifier_replay_result_status, STATUS);
assert.equal(doc.source_evidence_export_manifest_revision_hash, source.revision_hash);
assert.equal(doc.source_evidence_export_manifest_revision_hash_valid, true);

const regenerated = buildVerifierReplayResult({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_export_boundary.export_manifest_is_not_verifier_replay_result, true);
assert.equal(doc.inherited_export_boundary.export_manifest_is_not_effect_proof, true);
assert.equal(doc.inherited_export_boundary.export_manifest_is_not_legal_validity, true);
assert.equal(doc.inherited_export_boundary.ai_model_export_authority_allowed, false);

assert.deepEqual(doc.verifier_replay_result.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.verifier_replay_result.replay_results_allowed, REPLAY_RESULTS);
assert.equal(doc.verifier_replay_result.replay_input_ref_required, true);
assert.equal(doc.verifier_replay_result.replay_input_digest_required, true);
assert.equal(doc.verifier_replay_result.evidence_export_manifest_ref_required, true);
assert.equal(doc.verifier_replay_result.evidence_export_manifest_digest_required, true);
assert.equal(doc.verifier_replay_result.recomputed_digests_required, true);
assert.equal(doc.verifier_replay_result.mismatch_report_required, true);
assert.equal(doc.verifier_replay_result.pass_requires_all_chain_nodes_present, true);
assert.equal(doc.verifier_replay_result.pass_requires_all_digest_matches, true);
assert.equal(doc.verifier_replay_result.pass_requires_ordered_chain_replay, true);
assert.equal(doc.verifier_replay_result.fail_dominates_unknown_and_pass, true);
assert.equal(doc.verifier_replay_result.unknown_dominates_pass, true);
assert.equal(doc.verifier_replay_result.not_run_blocks_pass_claim, true);
assert.equal(doc.verifier_replay_result.verifier_replay_result_is_not_effect_proof, true);
assert.equal(doc.verifier_replay_result.verifier_replay_result_is_not_legal_validity, true);
assert.equal(doc.verifier_replay_result.ai_model_verifier_authority_allowed, false);
assert.equal(doc.verifier_replay_result.digest_mismatch_fails_closed, true);
assert.equal(doc.verifier_replay_result.chain_order_mismatch_fails_closed, true);
assert.equal(doc.verifier_replay_result.broken_replay_fails_closed, true);

assert.equal(doc.minimal_record_template.replay_result, 'NOT_RUN');
assert.equal(doc.minimal_record_template.non_claims.replay_passed, false);
assert.equal(doc.minimal_record_template.non_claims.effect_proven, false);
assert.equal(doc.minimal_record_template.non_claims.ai_authority, false);

for (const code of ['VERIFIER_REPLAY_RESULT_MISSING', 'REPLAY_INPUT_DIGEST_MISSING', 'EVIDENCE_EXPORT_MANIFEST_DIGEST_MISSING', 'RECOMPUTED_DIGESTS_MISSING', 'DIGEST_MISMATCH', 'CHAIN_ORDER_MISMATCH', 'AI_VERIFIER_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.verifier_replay_result_defined, true);
assert.equal(doc.readiness_state.verifier_replay_result_ready, false);
assert.equal(doc.readiness_state.verifier_replay_executed, false);
assert.equal(doc.readiness_state.verifier_replay_passed, false);
assert.equal(doc.readiness_state.recomputed_digests_bound, false);
assert.equal(doc.readiness_state.mismatch_report_bound, false);
assert.equal(doc.readiness_state.evidence_chain_node_complete, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.decision_proof_chain_complete, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-077-HBCE-LEVEL1-DECISION-PROOF-CHAIN-CLOSURE-GATE');

assert.equal(doc.non_claims.verifier_replay_completed, false);
assert.equal(doc.non_claims.verifier_replay_passed, false);
assert.equal(doc.non_claims.decision_proof_chain_complete, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_VERIFIER_REPLAY_RESULT_DEFINED_NOT_READY/);
assert.match(md, /does not execute verifier replay yet/);
assert.match(md, /does not prove an effect/);
assert.match(md, /does not create legal validity/);
assert.match(md, /does not allow AI model authority/);
assert.match(md, /PASS requires all digest matches/);
assert.match(md, /NOT_RUN blocks PASS claims/);
assert.match(md, /PROG-077-HBCE-LEVEL1-DECISION-PROOF-CHAIN-CLOSURE-GATE/);

console.log('PASS PROG-076-VERIFIER-REPLAY-DOCS-EXIST');
console.log('PASS PROG-076-VERIFIER-REPLAY-HASH-STABLE');
console.log('PASS PROG-076-BUILDER-STABLE');
console.log('PASS PROG-076-SOURCE-PROG-075-INTEGRITY-VALID');
console.log('PASS PROG-076-REPLAY-RESULTS-DEFINED');
console.log('PASS PROG-076-PASS-REQUIRES-DIGEST-MATCHES');
console.log('PASS PROG-076-AI-VERIFIER-AUTHORITY-DISALLOWED');
console.log('PASS PROG-076-FAIL-CLOSED-RULES-DEFINED');
console.log('PASS PROG-076-NEXT-PROG-077-RECORDED');
console.log('PASS PROG-076-NO-UNSUPPORTED-READINESS-CLAIMS');
