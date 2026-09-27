'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  ACCEPTANCE_REQUIRED_REVIEW_ITEMS,
  buildDecisionProofHumanAcceptanceRecord
} = require('../../../runtime/level1/build-prog-082-decision-proof-human-acceptance-record.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-082-decision-proof-human-acceptance-record.json';
const mdPath = 'docs/launch/level1/prog-082-decision-proof-human-acceptance-record.md';
const runtimePath = 'runtime/level1/build-prog-082-decision-proof-human-acceptance-record.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-082-DECISION-PROOF-HUMAN-ACCEPTANCE-RECORD-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_RECORD');
assert.equal(doc.issue_id, 'PROG-082');
assert.equal(doc.decision_proof_human_acceptance_record_status, STATUS);
assert.equal(doc.source_execution_result_revision_hash, source.revision_hash);
assert.equal(doc.source_execution_result_revision_hash_valid, true);

const regenerated = buildDecisionProofHumanAcceptanceRecord({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_execution_result_boundary.synthetic_demo_only, true);
assert.equal(doc.inherited_execution_result_boundary.harness_executed, true);
assert.equal(doc.inherited_execution_result_boundary.concrete_demo_execution_completed, true);
assert.equal(doc.inherited_execution_result_boundary.verifier_replay_completed, true);
assert.equal(doc.inherited_execution_result_boundary.verifier_replay_result, 'PASS');
assert.equal(doc.inherited_execution_result_boundary.verifier_replay_passed, true);
assert.equal(doc.inherited_execution_result_boundary.synthetic_chain_closed, true);
assert.equal(doc.inherited_execution_result_boundary.manual_human_acceptance_status, 'PENDING');
assert.equal(doc.inherited_execution_result_boundary.decision_proof_demo_ready, false);

assert.equal(doc.human_acceptance_record.acceptance_record_id, 'HUMAN-ACCEPTANCE::HBCE-L1-DEMO-0001');
assert.equal(doc.human_acceptance_record.acceptance_subject_ref, source.execution_records.closure_gate_result.record_id);
assert.equal(doc.human_acceptance_record.acceptance_subject_digest, source.execution_records.closure_gate_result.digest);
assert.equal(doc.human_acceptance_record.required_human_acceptor_ref, 'IPR-3::MANUEL-COLETTA');
assert.equal(doc.human_acceptance_record.acceptance_status, 'PENDING');
assert.equal(doc.human_acceptance_record.acceptance_decision, null);
assert.equal(doc.human_acceptance_record.acceptance_decision_recorded, false);
assert.equal(doc.human_acceptance_record.acceptance_record_signed, false);
assert.equal(doc.human_acceptance_record.acceptance_comment_required, true);
assert.equal(doc.human_acceptance_record.acceptance_comment, null);
assert.equal(doc.human_acceptance_record.manual_human_acceptance_required, true);
assert.equal(doc.human_acceptance_record.ai_acceptance_authority_allowed, false);
assert.equal(doc.human_acceptance_record.acceptance_record_is_not_acceptance_decision, true);
assert.equal(doc.human_acceptance_record.acceptance_record_is_not_legal_validity, true);
assert.equal(doc.human_acceptance_record.acceptance_record_is_not_launch_readiness, true);
assert.equal(doc.human_acceptance_record.acceptance_record_is_not_production_readiness, true);

assert.deepEqual(doc.acceptance_required_review_items, ACCEPTANCE_REQUIRED_REVIEW_ITEMS);
assert.equal(doc.acceptance_checklist.source_execution_result_hash_valid, true);
assert.equal(doc.acceptance_checklist.synthetic_demo_only_boundary_confirmed, true);
assert.equal(doc.acceptance_checklist.generated_record_digests_present, true);
assert.equal(doc.acceptance_checklist.verifier_replay_pass_confirmed, true);
assert.equal(doc.acceptance_checklist.zero_mismatch_confirmed, true);
assert.equal(doc.acceptance_checklist.synthetic_chain_closure_confirmed, true);
assert.equal(doc.acceptance_checklist.non_claims_confirmed, true);
assert.equal(doc.acceptance_checklist.ai_authority_absence_confirmed, true);
assert.equal(doc.acceptance_checklist.human_acceptance_decision_recorded, false);

assert.equal(doc.acceptance_gate.gate_result, 'BLOCKED_PENDING_HUMAN_ACCEPTANCE_DECISION');
assert.equal(doc.acceptance_gate.blocked_by.includes('HUMAN_ACCEPTANCE_DECISION_NOT_RECORDED'), true);
assert.equal(doc.acceptance_gate.blocked_by.includes('HUMAN_ACCEPTANCE_RECORD_NOT_SIGNED'), true);
assert.equal(doc.acceptance_gate.blocked_by.includes('HUMAN_ACCEPTANCE_COMMENT_MISSING'), true);

for (const code of ['HUMAN_ACCEPTANCE_RECORD_MISSING', 'SOURCE_EXECUTION_RESULT_HASH_INVALID', 'HUMAN_ACCEPTANCE_DECISION_NOT_RECORDED', 'HUMAN_ACCEPTANCE_RECORD_NOT_SIGNED', 'HUMAN_ACCEPTANCE_COMMENT_MISSING', 'VERIFIER_REPLAY_NOT_PASS', 'MISMATCH_DETECTED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_ACCEPTANCE_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.human_acceptance_record_defined, true);
assert.equal(doc.readiness_state.human_acceptance_decision_recorded, false);
assert.equal(doc.readiness_state.human_acceptance_record_signed, false);
assert.equal(doc.readiness_state.human_acceptance_completed, false);
assert.equal(doc.readiness_state.source_execution_result_bound, true);
assert.equal(doc.readiness_state.synthetic_demo_only, true);
assert.equal(doc.readiness_state.verifier_replay_completed, true);
assert.equal(doc.readiness_state.verifier_replay_passed, true);
assert.equal(doc.readiness_state.synthetic_chain_closed, true);
assert.equal(doc.readiness_state.acceptance_gate_passed, false);
assert.equal(doc.readiness_state.decision_proof_demo_accepted, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-083-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-DECISION');

assert.equal(doc.non_claims.human_accepted, false);
assert.equal(doc.non_claims.acceptance_decision_recorded, false);
assert.equal(doc.non_claims.decision_proof_demo_accepted, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_RECORD_DEFINED_PENDING/);
assert.match(md, /The human acceptance decision is not recorded/);
assert.match(md, /The acceptance gate is blocked/);
assert.match(md, /BLOCKED_PENDING_HUMAN_ACCEPTANCE_DECISION/);
assert.match(md, /This record is not an acceptance decision/);
assert.match(md, /AI acceptance authority is not allowed/);
assert.match(md, /PROG-083-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-DECISION/);

console.log('PASS PROG-082-HUMAN-ACCEPTANCE-RECORD-DOCS-EXIST');
console.log('PASS PROG-082-HUMAN-ACCEPTANCE-RECORD-HASH-STABLE');
console.log('PASS PROG-082-BUILDER-STABLE');
console.log('PASS PROG-082-SOURCE-PROG-081-INTEGRITY-VALID');
console.log('PASS PROG-082-ACCEPTANCE-CHECKLIST-DEFINED');
console.log('PASS PROG-082-ACCEPTANCE-GATE-BLOCKED-PENDING-HUMAN-DECISION');
console.log('PASS PROG-082-AI-ACCEPTANCE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-082-NEXT-PROG-083-RECORDED');
console.log('PASS PROG-082-NO-UNSUPPORTED-READINESS-CLAIMS');
