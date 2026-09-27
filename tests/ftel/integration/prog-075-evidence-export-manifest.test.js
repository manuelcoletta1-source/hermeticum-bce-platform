'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, REQUIRED_FIELDS, EXPORT_FORMATS, buildEvidenceExportManifest } = require('../../../runtime/level1/build-prog-075-evidence-export-manifest.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-075-evidence-export-manifest.json';
const mdPath = 'docs/launch/level1/prog-075-evidence-export-manifest.md';
const runtimePath = 'runtime/level1/build-prog-075-evidence-export-manifest.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-075-EVIDENCE-EXPORT-MANIFEST-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_EVIDENCE_EXPORT_MANIFEST');
assert.equal(doc.issue_id, 'PROG-075');
assert.equal(doc.evidence_export_manifest_status, STATUS);
assert.equal(doc.source_audit_event_record_revision_hash, source.revision_hash);
assert.equal(doc.source_audit_event_record_revision_hash_valid, true);

const regenerated = buildEvidenceExportManifest({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_audit_boundary.audit_event_is_not_effect_proof, true);
assert.equal(doc.inherited_audit_boundary.audit_event_is_not_business_success, true);
assert.equal(doc.inherited_audit_boundary.audit_event_is_not_legal_validity, true);
assert.equal(doc.inherited_audit_boundary.ai_model_audit_authority_allowed, false);

assert.deepEqual(doc.evidence_export_manifest.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.evidence_export_manifest.export_formats_allowed, EXPORT_FORMATS);
assert.equal(doc.evidence_export_manifest.canonical_json_required, true);
assert.equal(doc.evidence_export_manifest.sha256_digest_required, true);
assert.equal(doc.evidence_export_manifest.authority_boundary_digest_required, true);
assert.equal(doc.evidence_export_manifest.policy_evaluation_digest_required, true);
assert.equal(doc.evidence_export_manifest.action_request_digest_required, true);
assert.equal(doc.evidence_export_manifest.action_receipt_digest_required, true);
assert.equal(doc.evidence_export_manifest.audit_event_digest_required, true);
assert.equal(doc.evidence_export_manifest.export_manifest_digest_required, true);
assert.equal(doc.evidence_export_manifest.verifier_replay_input_ref_required, true);
assert.equal(doc.evidence_export_manifest.export_manifest_is_not_verifier_replay_result, true);
assert.equal(doc.evidence_export_manifest.export_manifest_is_not_effect_proof, true);
assert.equal(doc.evidence_export_manifest.export_manifest_is_not_business_success, true);
assert.equal(doc.evidence_export_manifest.export_manifest_is_not_legal_validity, true);
assert.equal(doc.evidence_export_manifest.ai_model_export_authority_allowed, false);
assert.equal(doc.evidence_export_manifest.broken_export_manifest_fails_closed, true);

assert.equal(doc.minimal_record_template.export_format, 'HBCE_DECISION_PROOF_EXPORT_JSON');
assert.equal(doc.minimal_record_template.canonicalization_profile, 'RFC8785-JCS');
assert.equal(doc.minimal_record_template.digest_algorithm, 'SHA-256');
assert.equal(doc.minimal_record_template.non_claims.verifier_replay_completed, false);
assert.equal(doc.minimal_record_template.non_claims.effect_proven, false);
assert.equal(doc.minimal_record_template.non_claims.ai_authority, false);

for (const code of ['EVIDENCE_EXPORT_MANIFEST_MISSING', 'EXPORT_FORMAT_INVALID', 'AUDIT_EVENT_DIGEST_MISSING', 'EXPORT_MANIFEST_DIGEST_MISSING', 'VERIFIER_REPLAY_INPUT_REF_MISSING', 'BROKEN_EXPORT_MANIFEST', 'AI_EXPORT_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.evidence_export_manifest_defined, true);
assert.equal(doc.readiness_state.evidence_export_manifest_ready, false);
assert.equal(doc.readiness_state.concrete_export_bound, false);
assert.equal(doc.readiness_state.audit_event_digest_bound, false);
assert.equal(doc.readiness_state.export_manifest_digest_bound, false);
assert.equal(doc.readiness_state.verifier_replay_input_ready, false);
assert.equal(doc.readiness_state.evidence_chain_node_complete, false);
assert.equal(doc.readiness_state.verifier_replay_ready, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-076-HBCE-LEVEL1-VERIFIER-REPLAY-RESULT');

assert.equal(doc.non_claims.concrete_export_bound, false);
assert.equal(doc.non_claims.verifier_replay_completed, false);
assert.equal(doc.non_claims.effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_EVIDENCE_EXPORT_MANIFEST_DEFINED_NOT_READY/);
assert.match(md, /does not complete verifier replay/);
assert.match(md, /does not prove an effect/);
assert.match(md, /does not create legal validity/);
assert.match(md, /does not allow AI model authority/);
assert.match(md, /The export manifest is not a verifier replay result/);
assert.match(md, /Broken export manifest fails closed/);
assert.match(md, /PROG-076-HBCE-LEVEL1-VERIFIER-REPLAY-RESULT/);

console.log('PASS PROG-075-EVIDENCE-EXPORT-DOCS-EXIST');
console.log('PASS PROG-075-EVIDENCE-EXPORT-HASH-STABLE');
console.log('PASS PROG-075-BUILDER-STABLE');
console.log('PASS PROG-075-SOURCE-PROG-074-INTEGRITY-VALID');
console.log('PASS PROG-075-EXPORT-FORMATS-DEFINED');
console.log('PASS PROG-075-EXPORT-MANIFEST-IS-NOT-REPLAY-RESULT');
console.log('PASS PROG-075-AI-EXPORT-AUTHORITY-DISALLOWED');
console.log('PASS PROG-075-FAIL-CLOSED-RULES-DEFINED');
console.log('PASS PROG-075-NEXT-PROG-076-RECORDED');
console.log('PASS PROG-075-NO-UNSUPPORTED-READINESS-CLAIMS');
