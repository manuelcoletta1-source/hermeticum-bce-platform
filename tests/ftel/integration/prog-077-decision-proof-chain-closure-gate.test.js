'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  REQUIRED_CHAIN_NODES,
  BLOCKING_REASONS,
  buildDecisionProofChainClosureGate
} = require('../../../runtime/level1/build-prog-077-decision-proof-chain-closure-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-077-decision-proof-chain-closure-gate.json';
const mdPath = 'docs/launch/level1/prog-077-decision-proof-chain-closure-gate.md';
const runtimePath = 'runtime/level1/build-prog-077-decision-proof-chain-closure-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-077-DECISION-PROOF-CHAIN-CLOSURE-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_CHAIN_CLOSURE_GATE');
assert.equal(doc.issue_id, 'PROG-077');
assert.equal(doc.decision_proof_chain_closure_gate_status, STATUS);
assert.equal(doc.source_verifier_replay_result_revision_hash, source.revision_hash);
assert.equal(doc.source_verifier_replay_result_revision_hash_valid, true);

const regenerated = buildDecisionProofChainClosureGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_verifier_boundary.verifier_replay_result_ready, false);
assert.equal(doc.inherited_verifier_boundary.verifier_replay_executed, false);
assert.equal(doc.inherited_verifier_boundary.verifier_replay_passed, false);
assert.equal(doc.inherited_verifier_boundary.verifier_replay_result_is_not_effect_proof, true);
assert.equal(doc.inherited_verifier_boundary.verifier_replay_result_is_not_legal_validity, true);
assert.equal(doc.inherited_verifier_boundary.ai_model_verifier_authority_allowed, false);

assert.deepEqual(doc.closure_gate.required_chain_nodes, REQUIRED_CHAIN_NODES);
assert.deepEqual(doc.closure_gate.blocking_reasons, BLOCKING_REASONS);
assert.equal(doc.closure_gate.gate_result, 'BLOCKED');
assert.equal(doc.closure_gate.structural_chain_defined, true);
assert.equal(doc.closure_gate.concrete_chain_closed, false);
assert.equal(doc.closure_gate.decision_proof_demo_ready, false);
assert.equal(doc.closure_gate.level1_launch_ready, false);
assert.equal(doc.closure_gate.production_ready, false);
assert.equal(doc.closure_gate.concrete_bindings_required, true);
assert.equal(doc.closure_gate.digest_bindings_required, true);
assert.equal(doc.closure_gate.verifier_replay_execution_required, true);
assert.equal(doc.closure_gate.verifier_replay_pass_required, true);
assert.equal(doc.closure_gate.not_run_blocks_closure, true);
assert.equal(doc.closure_gate.closure_gate_is_not_effect_proof, true);
assert.equal(doc.closure_gate.closure_gate_is_not_business_success, true);
assert.equal(doc.closure_gate.closure_gate_is_not_legal_validity, true);
assert.equal(doc.closure_gate.ai_model_closure_authority_allowed, false);

assert.equal(doc.closure_requirements.all_required_nodes_defined, true);
assert.equal(doc.closure_requirements.all_required_nodes_concretely_bound, false);
assert.equal(doc.closure_requirements.all_required_node_digests_bound, false);
assert.equal(doc.closure_requirements.chain_order_verified, false);
assert.equal(doc.closure_requirements.verifier_replay_executed, false);
assert.equal(doc.closure_requirements.verifier_replay_passed, false);

for (const code of ['DECISION_PROOF_CHAIN_CLOSURE_GATE_MISSING', 'REQUIRED_CHAIN_NODE_MISSING', 'REQUIRED_CHAIN_NODE_DIGEST_MISSING', 'CONCRETE_CHAIN_BINDING_MISSING', 'VERIFIER_REPLAY_NOT_EXECUTED', 'VERIFIER_REPLAY_NOT_PASSED', 'AI_CLOSURE_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.decision_proof_chain_closure_gate_defined, true);
assert.equal(doc.readiness_state.structural_chain_defined, true);
assert.equal(doc.readiness_state.decision_proof_chain_closed, false);
assert.equal(doc.readiness_state.concrete_demo_case_bound, false);
assert.equal(doc.readiness_state.all_required_nodes_bound, false);
assert.equal(doc.readiness_state.all_required_digests_bound, false);
assert.equal(doc.readiness_state.verifier_replay_executed, false);
assert.equal(doc.readiness_state.verifier_replay_passed, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-078-HBCE-LEVEL1-DECISION-PROOF-DEMO-RUNBOOK');

assert.equal(doc.non_claims.decision_proof_chain_closed, false);
assert.equal(doc.non_claims.concrete_demo_case_bound, false);
assert.equal(doc.non_claims.verifier_replay_completed, false);
assert.equal(doc.non_claims.verifier_replay_passed, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_CHAIN_CLOSURE_GATE_BLOCKED/);
assert.match(md, /The structural chain is defined/);
assert.match(md, /The concrete chain is not closed/);
assert.match(md, /Verifier replay is not executed/);
assert.match(md, /NOT_RUN blocks closure/);
assert.match(md, /does not create legal validity/);
assert.match(md, /AI closure authority claims fail closed/);
assert.match(md, /PROG-078-HBCE-LEVEL1-DECISION-PROOF-DEMO-RUNBOOK/);

console.log('PASS PROG-077-CLOSURE-GATE-DOCS-EXIST');
console.log('PASS PROG-077-CLOSURE-GATE-HASH-STABLE');
console.log('PASS PROG-077-BUILDER-STABLE');
console.log('PASS PROG-077-SOURCE-PROG-076-INTEGRITY-VALID');
console.log('PASS PROG-077-REQUIRED-CHAIN-NODES-DEFINED');
console.log('PASS PROG-077-GATE-BLOCKED-NOT-CLOSED');
console.log('PASS PROG-077-CONCRETE-BINDINGS-REQUIRED');
console.log('PASS PROG-077-AI-CLOSURE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-077-NEXT-PROG-078-RECORDED');
console.log('PASS PROG-077-NO-UNSUPPORTED-READINESS-CLAIMS');
