'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, REQUIRED_FIELDS, RECEIPT_STATUSES, buildActionReceiptRecord } = require('../../../runtime/level1/build-prog-073-action-receipt-record.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-073-action-receipt-record.json';
const mdPath = 'docs/launch/level1/prog-073-action-receipt-record.md';
const runtimePath = 'runtime/level1/build-prog-073-action-receipt-record.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-073-ACTION-RECEIPT-RECORD-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_ACTION_RECEIPT_RECORD');
assert.equal(doc.issue_id, 'PROG-073');
assert.equal(doc.action_receipt_record_status, STATUS);
assert.equal(doc.source_action_request_record_revision_hash, source.revision_hash);
assert.equal(doc.source_action_request_record_revision_hash_valid, true);

const regenerated = buildActionReceiptRecord({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_action_request_boundary.action_request_is_not_execution, true);
assert.equal(doc.inherited_action_request_boundary.action_request_is_not_receipt, true);
assert.equal(doc.inherited_action_request_boundary.action_request_is_not_effect_proof, true);
assert.equal(doc.inherited_action_request_boundary.ai_model_action_authority_allowed, false);

assert.deepEqual(doc.action_receipt_record.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.action_receipt_record.receipt_statuses_allowed, RECEIPT_STATUSES);
assert.equal(doc.action_receipt_record.action_request_ref_required, true);
assert.equal(doc.action_receipt_record.action_request_digest_required, true);
assert.equal(doc.action_receipt_record.target_ref_required, true);
assert.equal(doc.action_receipt_record.target_digest_required, true);
assert.equal(doc.action_receipt_record.receipt_status_required, true);
assert.equal(doc.action_receipt_record.response_payload_digest_required, true);
assert.equal(doc.action_receipt_record.correlation_id_required, true);
assert.equal(doc.action_receipt_record.idempotency_key_required, true);
assert.equal(doc.action_receipt_record.receipt_is_not_effect_proof, true);
assert.equal(doc.action_receipt_record.receipt_is_not_business_success, true);
assert.equal(doc.action_receipt_record.receipt_is_not_legal_validity, true);
assert.equal(doc.action_receipt_record.ai_model_receipt_authority_allowed, false);
assert.equal(doc.action_receipt_record.rejected_or_blocked_receipt_blocks_success_claim, true);
assert.equal(doc.action_receipt_record.unknown_receipt_blocks_success_claim, true);
assert.equal(doc.action_receipt_record.missing_action_request_fails_closed, true);
assert.equal(doc.action_receipt_record.missing_receipt_status_fails_closed, true);
assert.equal(doc.action_receipt_record.missing_digest_fails_closed, true);
assert.equal(doc.action_receipt_record.missing_correlation_fails_closed, true);

assert.equal(doc.minimal_record_template.receipt_status, 'UNKNOWN');
assert.equal(doc.minimal_record_template.non_claims.effect_proven, false);
assert.equal(doc.minimal_record_template.non_claims.business_success, false);
assert.equal(doc.minimal_record_template.non_claims.ai_authority, false);

for (const code of ['ACTION_RECEIPT_RECORD_MISSING', 'ACTION_REQUEST_REF_MISSING', 'RECEIPT_STATUS_INVALID', 'RECEIPT_UNKNOWN_BLOCKS_SUCCESS_CLAIM', 'RECEIPT_REJECTED_BLOCKS_SUCCESS_CLAIM', 'AI_RECEIPT_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.action_receipt_record_defined, true);
assert.equal(doc.readiness_state.action_receipt_record_ready, false);
assert.equal(doc.readiness_state.concrete_receipt_bound, false);
assert.equal(doc.readiness_state.action_request_ref_bound, false);
assert.equal(doc.readiness_state.action_request_digest_bound, false);
assert.equal(doc.readiness_state.receipt_status_bound, false);
assert.equal(doc.readiness_state.response_payload_digest_bound, false);
assert.equal(doc.readiness_state.correlation_id_bound, false);
assert.equal(doc.readiness_state.idempotency_key_bound, false);
assert.equal(doc.readiness_state.evidence_chain_node_complete, false);
assert.equal(doc.readiness_state.audit_event_ready, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-074-HBCE-LEVEL1-AUDIT-EVENT-RECORD');

assert.equal(doc.non_claims.concrete_receipt_bound, false);
assert.equal(doc.non_claims.action_executed, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_ACTION_RECEIPT_RECORD_DEFINED_NOT_READY/);
assert.match(md, /does not prove an effect/);
assert.match(md, /does not prove business success/);
assert.match(md, /does not create legal validity/);
assert.match(md, /does not allow AI model authority/);
assert.match(md, /A receipt is not effect proof/);
assert.match(md, /UNKNOWN blocks success claims/);
assert.match(md, /PROG-074-HBCE-LEVEL1-AUDIT-EVENT-RECORD/);

console.log('PASS PROG-073-ACTION-RECEIPT-DOCS-EXIST');
console.log('PASS PROG-073-ACTION-RECEIPT-HASH-STABLE');
console.log('PASS PROG-073-BUILDER-STABLE');
console.log('PASS PROG-073-SOURCE-PROG-072-INTEGRITY-VALID');
console.log('PASS PROG-073-RECEIPT-STATUSES-DEFINED');
console.log('PASS PROG-073-RECEIPT-IS-NOT-EFFECT-PROOF');
console.log('PASS PROG-073-AI-RECEIPT-AUTHORITY-DISALLOWED');
console.log('PASS PROG-073-FAIL-CLOSED-RULES-DEFINED');
console.log('PASS PROG-073-NEXT-PROG-074-RECORDED');
console.log('PASS PROG-073-NO-UNSUPPORTED-READINESS-CLAIMS');
