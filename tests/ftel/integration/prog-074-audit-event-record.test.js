'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, REQUIRED_FIELDS, EVENT_TYPES, EVENT_RESULTS, buildAuditEventRecord } = require('../../../runtime/level1/build-prog-074-audit-event-record.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-074-audit-event-record.json';
const mdPath = 'docs/launch/level1/prog-074-audit-event-record.md';
const runtimePath = 'runtime/level1/build-prog-074-audit-event-record.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-074-AUDIT-EVENT-RECORD-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_AUDIT_EVENT_RECORD');
assert.equal(doc.issue_id, 'PROG-074');
assert.equal(doc.audit_event_record_status, STATUS);
assert.equal(doc.source_action_receipt_record_revision_hash, source.revision_hash);
assert.equal(doc.source_action_receipt_record_revision_hash_valid, true);

const regenerated = buildAuditEventRecord({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_action_receipt_boundary.receipt_is_not_effect_proof, true);
assert.equal(doc.inherited_action_receipt_boundary.receipt_is_not_business_success, true);
assert.equal(doc.inherited_action_receipt_boundary.receipt_is_not_legal_validity, true);
assert.equal(doc.inherited_action_receipt_boundary.ai_model_receipt_authority_allowed, false);

assert.deepEqual(doc.audit_event_record.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.audit_event_record.event_types_allowed, EVENT_TYPES);
assert.deepEqual(doc.audit_event_record.event_results_allowed, EVENT_RESULTS);
assert.equal(doc.audit_event_record.authority_boundary_ref_required, true);
assert.equal(doc.audit_event_record.policy_evaluation_ref_required, true);
assert.equal(doc.audit_event_record.action_request_ref_required, true);
assert.equal(doc.audit_event_record.action_receipt_ref_required, true);
assert.equal(doc.audit_event_record.correlation_id_required, true);
assert.equal(doc.audit_event_record.idempotency_key_required, true);
assert.equal(doc.audit_event_record.previous_chain_digest_required, true);
assert.equal(doc.audit_event_record.input_digests_required, true);
assert.equal(doc.audit_event_record.output_digests_required, true);
assert.equal(doc.audit_event_record.audit_event_digest_required, true);
assert.equal(doc.audit_event_record.audit_event_is_not_effect_proof, true);
assert.equal(doc.audit_event_record.audit_event_is_not_business_success, true);
assert.equal(doc.audit_event_record.audit_event_is_not_legal_validity, true);
assert.equal(doc.audit_event_record.ai_model_audit_authority_allowed, false);
assert.equal(doc.audit_event_record.broken_audit_chain_fails_closed, true);

assert.equal(doc.minimal_record_template.event_type, 'DECISION_PROOF_AUDIT_EVENT');
assert.equal(doc.minimal_record_template.event_result, 'UNKNOWN');
assert.equal(doc.minimal_record_template.non_claims.effect_proven, false);
assert.equal(doc.minimal_record_template.non_claims.ai_authority, false);

for (const code of ['AUDIT_EVENT_RECORD_MISSING', 'ACTION_RECEIPT_REF_MISSING', 'PREVIOUS_CHAIN_DIGEST_MISSING', 'AUDIT_EVENT_DIGEST_MISSING', 'BROKEN_AUDIT_CHAIN', 'AI_AUDIT_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.audit_event_record_defined, true);
assert.equal(doc.readiness_state.audit_event_record_ready, false);
assert.equal(doc.readiness_state.concrete_audit_event_bound, false);
assert.equal(doc.readiness_state.action_receipt_ref_bound, false);
assert.equal(doc.readiness_state.previous_chain_digest_bound, false);
assert.equal(doc.readiness_state.audit_event_digest_bound, false);
assert.equal(doc.readiness_state.evidence_chain_node_complete, false);
assert.equal(doc.readiness_state.evidence_export_manifest_ready, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-075-HBCE-LEVEL1-EVIDENCE-EXPORT-MANIFEST');

assert.equal(doc.non_claims.concrete_audit_event_bound, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_AUDIT_EVENT_RECORD_DEFINED_NOT_READY/);
assert.match(md, /does not prove an effect/);
assert.match(md, /does not prove business success/);
assert.match(md, /does not create legal validity/);
assert.match(md, /does not allow AI model authority/);
assert.match(md, /Broken audit chain fails closed/);
assert.match(md, /PROG-075-HBCE-LEVEL1-EVIDENCE-EXPORT-MANIFEST/);

console.log('PASS PROG-074-AUDIT-EVENT-DOCS-EXIST');
console.log('PASS PROG-074-AUDIT-EVENT-HASH-STABLE');
console.log('PASS PROG-074-BUILDER-STABLE');
console.log('PASS PROG-074-SOURCE-PROG-073-INTEGRITY-VALID');
console.log('PASS PROG-074-EVENT-TYPES-AND-RESULTS-DEFINED');
console.log('PASS PROG-074-AUDIT-EVENT-IS-NOT-EFFECT-PROOF');
console.log('PASS PROG-074-AI-AUDIT-AUTHORITY-DISALLOWED');
console.log('PASS PROG-074-FAIL-CLOSED-RULES-DEFINED');
console.log('PASS PROG-074-NEXT-PROG-075-RECORDED');
console.log('PASS PROG-074-NO-UNSUPPORTED-READINESS-CLAIMS');
