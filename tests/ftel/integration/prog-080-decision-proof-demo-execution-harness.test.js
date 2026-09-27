'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  HARNESS_STEPS,
  HARNESS_OUTPUTS,
  buildDecisionProofDemoExecutionHarness
} = require('../../../runtime/level1/build-prog-080-decision-proof-demo-execution-harness.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-080-decision-proof-demo-execution-harness.json';
const mdPath = 'docs/launch/level1/prog-080-decision-proof-demo-execution-harness.md';
const runtimePath = 'runtime/level1/build-prog-080-decision-proof-demo-execution-harness.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-080-DECISION-PROOF-DEMO-EXECUTION-HARNESS-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_DEMO_EXECUTION_HARNESS');
assert.equal(doc.issue_id, 'PROG-080');
assert.equal(doc.decision_proof_demo_execution_harness_status, STATUS);
assert.equal(doc.source_demo_fixture_revision_hash, source.revision_hash);
assert.equal(doc.source_demo_fixture_revision_hash_valid, true);

const regenerated = buildDecisionProofDemoExecutionHarness({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_fixture_boundary.deterministic_fixture_payload_defined, true);
assert.equal(doc.inherited_fixture_boundary.fixture_payload_digest_bound, true);
assert.equal(doc.inherited_fixture_boundary.runbook_executed, false);
assert.equal(doc.inherited_fixture_boundary.verifier_replay_executed, false);
assert.equal(doc.inherited_fixture_boundary.verifier_replay_passed, false);
assert.equal(doc.inherited_fixture_boundary.decision_proof_chain_closed, false);
assert.equal(doc.inherited_fixture_boundary.ai_model_demo_authority_allowed, false);

assert.deepEqual(doc.execution_harness.harness_steps, HARNESS_STEPS);
assert.deepEqual(doc.execution_harness.harness_outputs, HARNESS_OUTPUTS);
assert.equal(doc.execution_harness.source_fixture_required, true);
assert.equal(doc.execution_harness.source_fixture_revision_hash_required, true);
assert.equal(doc.execution_harness.fixture_payload_digest_required, true);
assert.equal(doc.execution_harness.synthetic_demo_only_required, true);
assert.equal(doc.execution_harness.ordered_execution_required, true);
assert.equal(doc.execution_harness.idempotent_execution_required, true);
assert.equal(doc.execution_harness.correlation_id_required, true);
assert.equal(doc.execution_harness.manual_human_acceptance_required, true);
assert.equal(doc.execution_harness.fail_closed_on_first_blocker, true);
assert.equal(doc.execution_harness.verifier_replay_required, true);
assert.equal(doc.execution_harness.closure_gate_reevaluation_required, true);
assert.equal(doc.execution_harness.execution_harness_is_not_execution_result, true);
assert.equal(doc.execution_harness.execution_harness_is_not_verifier_replay_pass, true);
assert.equal(doc.execution_harness.execution_harness_is_not_chain_closure, true);
assert.equal(doc.execution_harness.execution_harness_is_not_effect_proof, true);
assert.equal(doc.execution_harness.execution_harness_is_not_legal_validity, true);
assert.equal(doc.execution_harness.ai_model_execution_authority_allowed, false);

assert.equal(doc.deterministic_execution_plan.length, HARNESS_STEPS.length);
for (const step of HARNESS_STEPS) {
  assert.equal(doc.deterministic_execution_plan.some((item) => item.step === step), true, `${step} plan must exist`);
}

for (const code of ['EXECUTION_HARNESS_MISSING', 'SOURCE_DEMO_FIXTURE_HASH_INVALID', 'REAL_CUSTOMER_DATA_PRESENT', 'EXTERNAL_EFFECT_CLAIM_BLOCKED', 'POLICY_RESULT_NOT_ALLOW', 'VERIFIER_REPLAY_NOT_EXECUTED', 'VERIFIER_REPLAY_NOT_PASSED', 'CLOSURE_GATE_NOT_RERUN', 'AI_EXECUTION_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.decision_proof_demo_execution_harness_defined, true);
assert.equal(doc.readiness_state.decision_proof_demo_execution_harness_ready, false);
assert.equal(doc.readiness_state.source_fixture_bound, true);
assert.equal(doc.readiness_state.fixture_payload_digest_bound, true);
assert.equal(doc.readiness_state.harness_executed, false);
assert.equal(doc.readiness_state.authority_boundary_record_created, false);
assert.equal(doc.readiness_state.policy_evaluation_record_created, false);
assert.equal(doc.readiness_state.action_request_record_created, false);
assert.equal(doc.readiness_state.action_receipt_record_created, false);
assert.equal(doc.readiness_state.audit_event_record_created, false);
assert.equal(doc.readiness_state.evidence_export_manifest_created, false);
assert.equal(doc.readiness_state.verifier_replay_executed, false);
assert.equal(doc.readiness_state.verifier_replay_passed, false);
assert.equal(doc.readiness_state.closure_gate_rerun, false);
assert.equal(doc.readiness_state.decision_proof_chain_closed, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-081-HBCE-LEVEL1-DECISION-PROOF-DEMO-EXECUTION-RESULT');

assert.equal(doc.non_claims.harness_executed, false);
assert.equal(doc.non_claims.concrete_demo_execution_completed, false);
assert.equal(doc.non_claims.verifier_replay_completed, false);
assert.equal(doc.non_claims.verifier_replay_passed, false);
assert.equal(doc.non_claims.decision_proof_chain_closed, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_DEMO_EXECUTION_HARNESS_DEFINED_NOT_EXECUTED/);
assert.match(md, /The harness is not executed/);
assert.match(md, /The concrete demo execution is not completed/);
assert.match(md, /The verifier replay is not completed/);
assert.match(md, /The harness is not chain closure/);
assert.match(md, /AI execution authority claims fail closed/);
assert.match(md, /PROG-081-HBCE-LEVEL1-DECISION-PROOF-DEMO-EXECUTION-RESULT/);

console.log('PASS PROG-080-DEMO-EXECUTION-HARNESS-DOCS-EXIST');
console.log('PASS PROG-080-DEMO-EXECUTION-HARNESS-HASH-STABLE');
console.log('PASS PROG-080-BUILDER-STABLE');
console.log('PASS PROG-080-SOURCE-PROG-079-INTEGRITY-VALID');
console.log('PASS PROG-080-HARNESS-STEPS-DEFINED');
console.log('PASS PROG-080-DETERMINISTIC-EXECUTION-PLAN-DEFINED');
console.log('PASS PROG-080-FAIL-CLOSED-FIRST-BLOCKER-DEFINED');
console.log('PASS PROG-080-AI-EXECUTION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-080-NEXT-PROG-081-RECORDED');
console.log('PASS PROG-080-NO-UNSUPPORTED-READINESS-CLAIMS');
