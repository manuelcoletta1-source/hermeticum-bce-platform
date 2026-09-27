'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  GENERATED_RECORDS,
  buildDecisionProofDemoExecutionResult
} = require('../../../runtime/level1/build-prog-081-decision-proof-demo-execution-result.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

function verifyRecordDigest(record) {
  const body = { ...record };
  delete body.digest;
  assert.equal(record.digest, sha256Digest(body), `${record.record_type} digest must match`);
}

const docPath = 'docs/launch/level1/prog-081-decision-proof-demo-execution-result.json';
const mdPath = 'docs/launch/level1/prog-081-decision-proof-demo-execution-result.md';
const runtimePath = 'runtime/level1/build-prog-081-decision-proof-demo-execution-result.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const harness = json(SOURCE_REF);
const fixture = json(harness.source_demo_fixture_ref);

assert.equal(doc.proto, 'HBCE-L1-PROG-081-DECISION-PROOF-DEMO-EXECUTION-RESULT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_DEMO_EXECUTION_RESULT');
assert.equal(doc.issue_id, 'PROG-081');
assert.equal(doc.decision_proof_demo_execution_result_status, STATUS);
assert.equal(doc.source_execution_harness_revision_hash, harness.revision_hash);
assert.equal(doc.source_execution_harness_revision_hash_valid, true);
assert.equal(doc.source_demo_fixture_revision_hash, fixture.revision_hash);
assert.equal(doc.source_demo_fixture_revision_hash_valid, true);

const regenerated = buildDecisionProofDemoExecutionResult({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.execution_result_summary.synthetic_demo_only, true);
assert.equal(doc.execution_result_summary.harness_executed, true);
assert.equal(doc.execution_result_summary.concrete_demo_execution_completed, true);
assert.deepEqual(doc.execution_result_summary.generated_records, GENERATED_RECORDS);
assert.equal(doc.execution_result_summary.generated_record_count, GENERATED_RECORDS.length);
assert.equal(doc.execution_result_summary.verifier_replay_completed, true);
assert.equal(doc.execution_result_summary.verifier_replay_result, 'PASS');
assert.equal(doc.execution_result_summary.verifier_replay_passed, true);
assert.equal(doc.execution_result_summary.synthetic_chain_closed, true);
assert.equal(doc.execution_result_summary.manual_human_acceptance_required, true);
assert.equal(doc.execution_result_summary.manual_human_acceptance_status, 'PENDING');
assert.equal(doc.execution_result_summary.decision_proof_demo_ready, false);
assert.equal(doc.execution_result_summary.level1_launch_ready, false);
assert.equal(doc.execution_result_summary.production_ready, false);

for (const name of GENERATED_RECORDS) verifyRecordDigest(doc.execution_records[name]);

assert.equal(doc.execution_records.policy_evaluation_record.evaluation_result, 'ALLOW');
assert.equal(doc.execution_records.action_receipt_record.receipt_status, 'ACCEPTED_FOR_PROCESSING');
assert.equal(doc.execution_records.audit_event_record.event_result, 'RECORDED');
assert.equal(doc.execution_records.verifier_replay_result.replay_result, 'PASS');
assert.equal(doc.execution_records.verifier_replay_result.mismatch_report.mismatch_detected, false);
assert.equal(doc.execution_records.verifier_replay_result.mismatch_report.mismatch_count, 0);
assert.equal(doc.execution_records.closure_gate_result.gate_result, 'PASS_SYNTHETIC_DEMO_ONLY');
assert.equal(doc.execution_records.closure_gate_result.manual_human_acceptance_status, 'PENDING');
assert.equal(doc.execution_records.closure_gate_result.decision_proof_demo_ready, false);

assert.equal(doc.execution_integrity.all_generated_records_have_digest, true);
assert.equal(doc.execution_integrity.verifier_replay_digest_match_count, 6);
assert.equal(doc.execution_integrity.verifier_replay_mismatch_count, 0);
assert.equal(doc.execution_integrity.verifier_replay_ordered_chain_replay_passed, true);
assert.equal(doc.execution_integrity.human_acceptance_pending_blocks_demo_ready, true);

for (const code of ['DEMO_EXECUTION_RESULT_MISSING', 'GENERATED_RECORD_DIGEST_MISSING', 'VERIFIER_REPLAY_NOT_COMPLETED', 'VERIFIER_REPLAY_NOT_PASS', 'HUMAN_ACCEPTANCE_PENDING', 'AI_EXECUTION_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.decision_proof_demo_execution_result_created, true);
assert.equal(doc.readiness_state.synthetic_demo_only, true);
assert.equal(doc.readiness_state.harness_executed, true);
assert.equal(doc.readiness_state.concrete_demo_execution_completed, true);
assert.equal(doc.readiness_state.authority_boundary_record_created, true);
assert.equal(doc.readiness_state.policy_evaluation_record_created, true);
assert.equal(doc.readiness_state.action_request_record_created, true);
assert.equal(doc.readiness_state.action_receipt_record_created, true);
assert.equal(doc.readiness_state.audit_event_record_created, true);
assert.equal(doc.readiness_state.evidence_export_manifest_created, true);
assert.equal(doc.readiness_state.verifier_replay_completed, true);
assert.equal(doc.readiness_state.verifier_replay_passed, true);
assert.equal(doc.readiness_state.synthetic_chain_closed, true);
assert.equal(doc.readiness_state.manual_human_acceptance_required, true);
assert.equal(doc.readiness_state.manual_human_acceptance_completed, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-082-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-RECORD');

assert.equal(doc.non_claims.human_accepted, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_DEMO_EXECUTION_RESULT_CREATED_SYNTHETIC_ONLY/);
assert.match(md, /The execution result is synthetic demo-only/);
assert.match(md, /The verifier replay result is PASS/);
assert.match(md, /Manual human acceptance is PENDING/);
assert.match(md, /The Decision Proof demo is not ready/);
assert.match(md, /does not create legal validity/);
assert.match(md, /Human acceptance is pending and blocks Decision Proof demo readiness/);
assert.match(md, /PROG-082-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-RECORD/);

console.log('PASS PROG-081-DEMO-EXECUTION-RESULT-DOCS-EXIST');
console.log('PASS PROG-081-DEMO-EXECUTION-RESULT-HASH-STABLE');
console.log('PASS PROG-081-BUILDER-STABLE');
console.log('PASS PROG-081-SOURCE-PROG-080-INTEGRITY-VALID');
console.log('PASS PROG-081-GENERATED-RECORD-DIGESTS-BOUND');
console.log('PASS PROG-081-VERIFIER-REPLAY-PASS-SYNTHETIC-ONLY');
console.log('PASS PROG-081-HUMAN-ACCEPTANCE-PENDING-BLOCKS-DEMO-READY');
console.log('PASS PROG-081-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-081-NEXT-PROG-082-RECORDED');
console.log('PASS PROG-081-NO-UNSUPPORTED-READINESS-CLAIMS');
