'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, REQUIRED_FIELDS, EVALUATION_RESULTS, buildPolicyEvaluationRecord } = require('../../../runtime/level1/build-prog-071-policy-evaluation-record.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-071-policy-evaluation-record.json';
const mdPath = 'docs/launch/level1/prog-071-policy-evaluation-record.md';
const runtimePath = 'runtime/level1/build-prog-071-policy-evaluation-record.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-071-POLICY-EVALUATION-RECORD-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_POLICY_EVALUATION_RECORD');
assert.equal(doc.issue_id, 'PROG-071');
assert.equal(doc.policy_evaluation_record_status, STATUS);
assert.equal(doc.source_authority_boundary_revision_hash, source.revision_hash);
assert.equal(doc.source_authority_boundary_revision_hash_valid, true);

const regenerated = buildPolicyEvaluationRecord({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_authority_boundary.human_or_organizational_authority_required, true);
assert.equal(doc.inherited_authority_boundary.ai_model_authority_allowed, false);
assert.equal(doc.inherited_authority_boundary.model_output_is_not_authority, true);

assert.deepEqual(doc.policy_evaluation_record.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.policy_evaluation_record.evaluation_results_allowed, EVALUATION_RESULTS);
assert.equal(doc.policy_evaluation_record.authority_boundary_ref_required, true);
assert.equal(doc.policy_evaluation_record.policy_ref_required, true);
assert.equal(doc.policy_evaluation_record.policy_digest_required, true);
assert.equal(doc.policy_evaluation_record.input_digest_required, true);
assert.equal(doc.policy_evaluation_record.action_class_required, true);
assert.equal(doc.policy_evaluation_record.target_ref_required, true);
assert.equal(doc.policy_evaluation_record.evaluator_ref_required, true);
assert.equal(doc.policy_evaluation_record.evidence_chain_ref_required, true);
assert.equal(doc.policy_evaluation_record.ai_model_evaluation_authority_allowed, false);
assert.equal(doc.policy_evaluation_record.model_output_may_support_explanation_only, true);
assert.equal(doc.policy_evaluation_record.block_dominates_unknown_and_allow, true);
assert.equal(doc.policy_evaluation_record.unknown_dominates_allow, true);
assert.equal(doc.policy_evaluation_record.allow_requires_positive_policy_match, true);
assert.equal(doc.policy_evaluation_record.missing_policy_fails_closed, true);
assert.equal(doc.policy_evaluation_record.missing_authority_boundary_fails_closed, true);
assert.equal(doc.policy_evaluation_record.missing_digest_fails_closed, true);

assert.equal(doc.minimal_record_template.evaluation_result, 'UNKNOWN');
assert.equal(doc.minimal_record_template.non_claims.ai_authority, false);
assert.equal(doc.minimal_record_template.non_claims.autonomous_authority, false);

for (const code of ['POLICY_EVALUATION_RECORD_MISSING', 'AUTHORITY_BOUNDARY_REF_MISSING', 'POLICY_REF_MISSING', 'POLICY_DIGEST_MISSING', 'INPUT_DIGEST_MISSING', 'AI_POLICY_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.policy_evaluation_record_defined, true);
assert.equal(doc.readiness_state.policy_evaluation_record_ready, false);
assert.equal(doc.readiness_state.concrete_policy_bound, false);
assert.equal(doc.readiness_state.authority_boundary_ref_bound, false);
assert.equal(doc.readiness_state.policy_digest_bound, false);
assert.equal(doc.readiness_state.input_digest_bound, false);
assert.equal(doc.readiness_state.evaluator_ref_bound, false);
assert.equal(doc.readiness_state.positive_allow_ready, false);
assert.equal(doc.readiness_state.evidence_chain_node_complete, false);
assert.equal(doc.readiness_state.action_request_ready, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-072-HBCE-LEVEL1-ACTION-REQUEST-RECORD');

assert.equal(doc.non_claims.concrete_policy_bound, false);
assert.equal(doc.non_claims.positive_policy_evaluation_completed, false);
assert.equal(doc.non_claims.action_authorized, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_POLICY_EVALUATION_RECORD_DEFINED_NOT_READY/);
assert.match(md, /does not complete a concrete policy evaluation/);
assert.match(md, /does not authorize an action/);
assert.match(md, /does not allow AI model authority/);
assert.match(md, /BLOCK dominates UNKNOWN and ALLOW/);
assert.match(md, /ALLOW requires a positive policy match/);
assert.match(md, /PROG-072-HBCE-LEVEL1-ACTION-REQUEST-RECORD/);

console.log('PASS PROG-071-POLICY-EVALUATION-DOCS-EXIST');
console.log('PASS PROG-071-POLICY-EVALUATION-HASH-STABLE');
console.log('PASS PROG-071-BUILDER-STABLE');
console.log('PASS PROG-071-SOURCE-PROG-070-INTEGRITY-VALID');
console.log('PASS PROG-071-EVALUATION-RESULTS-DEFINED');
console.log('PASS PROG-071-AI-POLICY-AUTHORITY-DISALLOWED');
console.log('PASS PROG-071-FAIL-CLOSED-RULES-DEFINED');
console.log('PASS PROG-071-NOT-CONCRETE-POLICY-BOUND');
console.log('PASS PROG-071-NEXT-PROG-072-RECORDED');
console.log('PASS PROG-071-NO-UNSUPPORTED-READINESS-CLAIMS');
