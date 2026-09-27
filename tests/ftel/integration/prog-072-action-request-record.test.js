'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, REQUIRED_FIELDS, ACTION_CLASSES, buildActionRequestRecord } = require('../../../runtime/level1/build-prog-072-action-request-record.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-072-action-request-record.json';
const mdPath = 'docs/launch/level1/prog-072-action-request-record.md';
const runtimePath = 'runtime/level1/build-prog-072-action-request-record.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-072-ACTION-REQUEST-RECORD-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_ACTION_REQUEST_RECORD');
assert.equal(doc.issue_id, 'PROG-072');
assert.equal(doc.action_request_record_status, STATUS);
assert.equal(doc.source_policy_evaluation_record_revision_hash, source.revision_hash);
assert.equal(doc.source_policy_evaluation_record_revision_hash_valid, true);

const regenerated = buildActionRequestRecord({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_policy_boundary.positive_allow_ready, false);
assert.equal(doc.inherited_policy_boundary.block_dominates_unknown_and_allow, true);
assert.equal(doc.inherited_policy_boundary.unknown_dominates_allow, true);
assert.equal(doc.inherited_policy_boundary.ai_model_evaluation_authority_allowed, false);

assert.deepEqual(doc.action_request_record.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.action_request_record.action_classes_allowed, ACTION_CLASSES);
assert.equal(doc.action_request_record.authority_boundary_ref_required, true);
assert.equal(doc.action_request_record.policy_evaluation_ref_required, true);
assert.equal(doc.action_request_record.policy_evaluation_allow_required, true);
assert.equal(doc.action_request_record.target_ref_required, true);
assert.equal(doc.action_request_record.target_digest_required, true);
assert.equal(doc.action_request_record.request_payload_digest_required, true);
assert.equal(doc.action_request_record.idempotency_key_required, true);
assert.equal(doc.action_request_record.expected_receipt_ref_required, true);
assert.equal(doc.action_request_record.action_request_is_not_execution, true);
assert.equal(doc.action_request_record.action_request_is_not_receipt, true);
assert.equal(doc.action_request_record.action_request_is_not_effect_proof, true);
assert.equal(doc.action_request_record.ai_model_action_authority_allowed, false);
assert.equal(doc.action_request_record.block_result_blocks_action_request, true);
assert.equal(doc.action_request_record.unknown_result_blocks_action_request, true);
assert.equal(doc.action_request_record.missing_authority_boundary_fails_closed, true);
assert.equal(doc.action_request_record.missing_policy_evaluation_fails_closed, true);
assert.equal(doc.action_request_record.missing_digest_fails_closed, true);
assert.equal(doc.action_request_record.missing_idempotency_key_fails_closed, true);

assert.equal(doc.minimal_record_template.action_class, 'DEMO_ONLY_DIGITAL_ACTION');
assert.equal(doc.minimal_record_template.policy_evaluation_result, 'ALLOW_REQUIRED_TO_PROCEED');
assert.equal(doc.minimal_record_template.non_claims.action_executed, false);
assert.equal(doc.minimal_record_template.non_claims.action_receipted, false);
assert.equal(doc.minimal_record_template.non_claims.ai_authority, false);

for (const code of ['ACTION_REQUEST_RECORD_MISSING', 'POLICY_EVALUATION_ALLOW_REQUIRED', 'POLICY_EVALUATION_BLOCKED', 'POLICY_EVALUATION_UNKNOWN', 'IDEMPOTENCY_KEY_MISSING', 'AI_ACTION_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.action_request_record_defined, true);
assert.equal(doc.readiness_state.action_request_record_ready, false);
assert.equal(doc.readiness_state.concrete_action_bound, false);
assert.equal(doc.readiness_state.policy_allow_bound, false);
assert.equal(doc.readiness_state.idempotency_key_bound, false);
assert.equal(doc.readiness_state.expected_receipt_ref_bound, false);
assert.equal(doc.readiness_state.evidence_chain_node_complete, false);
assert.equal(doc.readiness_state.action_receipt_ready, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-073-HBCE-LEVEL1-ACTION-RECEIPT-RECORD');

assert.equal(doc.non_claims.concrete_action_bound, false);
assert.equal(doc.non_claims.action_authorized_for_execution, false);
assert.equal(doc.non_claims.action_executed, false);
assert.equal(doc.non_claims.action_receipted, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_ACTION_REQUEST_RECORD_DEFINED_NOT_READY/);
assert.match(md, /does not execute an action/);
assert.match(md, /does not record a receipt/);
assert.match(md, /does not prove an effect/);
assert.match(md, /does not allow AI model authority/);
assert.match(md, /BLOCK blocks the action request/);
assert.match(md, /UNKNOWN blocks the action request/);
assert.match(md, /PROG-073-HBCE-LEVEL1-ACTION-RECEIPT-RECORD/);

console.log('PASS PROG-072-ACTION-REQUEST-DOCS-EXIST');
console.log('PASS PROG-072-ACTION-REQUEST-HASH-STABLE');
console.log('PASS PROG-072-BUILDER-STABLE');
console.log('PASS PROG-072-SOURCE-PROG-071-INTEGRITY-VALID');
console.log('PASS PROG-072-ACTION-REQUEST-REQUIRES-ALLOW');
console.log('PASS PROG-072-AI-ACTION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-072-NOT-EXECUTION-NOT-RECEIPT');
console.log('PASS PROG-072-FAIL-CLOSED-RULES-DEFINED');
console.log('PASS PROG-072-NEXT-PROG-073-RECORDED');
console.log('PASS PROG-072-NO-UNSUPPORTED-READINESS-CLAIMS');
