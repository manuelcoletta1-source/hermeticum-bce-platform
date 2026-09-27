'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { STATUS, SOURCE_REF, REQUIRED_FIELDS, AUTHORITY_TYPES, buildAuthorityBoundaryStatement } = require('../../../runtime/level1/build-prog-070-authority-boundary-statement.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-070-authority-boundary-statement.json';
const mdPath = 'docs/launch/level1/prog-070-authority-boundary-statement.md';
const runtimePath = 'runtime/level1/build-prog-070-authority-boundary-statement.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-070-AUTHORITY-BOUNDARY-STATEMENT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_AUTHORITY_BOUNDARY_STATEMENT');
assert.equal(doc.issue_id, 'PROG-070');
assert.equal(doc.authority_boundary_status, STATUS);
assert.equal(doc.source_evidence_chain_manifest_revision_hash, source.revision_hash);
assert.equal(doc.source_evidence_chain_manifest_revision_hash_valid, true);

const regenerated = buildAuthorityBoundaryStatement({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_evidence_boundary.ai_authority_claim_fails_closed, true);
assert.equal(doc.inherited_evidence_boundary.evidence_chain_manifest_ready, false);
assert.equal(doc.inherited_evidence_boundary.verifier_replay_ready, false);

assert.deepEqual(doc.authority_boundary_statement.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.authority_boundary_statement.authority_types_allowed, AUTHORITY_TYPES);
assert.equal(doc.authority_boundary_statement.human_or_organizational_authority_required, true);
assert.equal(doc.authority_boundary_statement.ai_model_authority_allowed, false);
assert.equal(doc.authority_boundary_statement.model_output_is_not_authority, true);
assert.equal(doc.authority_boundary_statement.missing_authority_boundary_fails_closed, true);
assert.equal(doc.authority_boundary_statement.missing_scope_fails_closed, true);
assert.equal(doc.authority_boundary_statement.missing_policy_ref_fails_closed, true);
assert.equal(doc.authority_boundary_statement.expired_validity_window_fails_closed, true);
assert.equal(doc.authority_boundary_statement.revoked_authority_fails_closed, true);

assert.equal(doc.minimal_boundary_template.authority_type, 'HUMAN');
assert.equal(doc.minimal_boundary_template.non_claims.ai_authority, false);
assert.equal(doc.minimal_boundary_template.non_claims.autonomous_authority, false);

for (const code of ['AUTHORITY_BOUNDARY_MISSING', 'AUTHORITY_EXPIRED', 'AUTHORITY_REVOKED', 'AI_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.authority_boundary_statement_defined, true);
assert.equal(doc.readiness_state.authority_boundary_statement_ready, false);
assert.equal(doc.readiness_state.authority_boundary_template_ready, true);
assert.equal(doc.readiness_state.concrete_authority_bound, false);
assert.equal(doc.readiness_state.policy_ref_bound, false);
assert.equal(doc.readiness_state.validity_window_bound, false);
assert.equal(doc.readiness_state.revocation_check_ready, false);
assert.equal(doc.readiness_state.evidence_chain_node_complete, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-071-HBCE-LEVEL1-POLICY-EVALUATION-RECORD');

assert.equal(doc.non_claims.concrete_authority_bound, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.autonomous_authority, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_AUTHORITY_BOUNDARY_STATEMENT_DEFINED_NOT_READY/);
assert.match(md, /does not bind a concrete authority yet/);
assert.match(md, /does not allow AI model authority/);
assert.match(md, /AI model output is not authority/);
assert.match(md, /PROG-071-HBCE-LEVEL1-POLICY-EVALUATION-RECORD/);

console.log('PASS PROG-070-AUTHORITY-BOUNDARY-DOCS-EXIST');
console.log('PASS PROG-070-AUTHORITY-BOUNDARY-HASH-STABLE');
console.log('PASS PROG-070-BUILDER-STABLE');
console.log('PASS PROG-070-SOURCE-PROG-069-INTEGRITY-VALID');
console.log('PASS PROG-070-HUMAN-OR-ORGANIZATIONAL-AUTHORITY-REQUIRED');
console.log('PASS PROG-070-AI-AUTHORITY-DISALLOWED');
console.log('PASS PROG-070-FAIL-CLOSED-RULES-DEFINED');
console.log('PASS PROG-070-NOT-CONCRETE-AUTHORITY-BOUND');
console.log('PASS PROG-070-NEXT-PROG-071-RECORDED');
console.log('PASS PROG-070-NO-UNSUPPORTED-READINESS-CLAIMS');
