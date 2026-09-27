'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  CLIENT_DEMO_ALLOWED_CONTENT,
  CLIENT_DEMO_EXCLUDED_CONTENT,
  buildScopeLockPayload,
  buildLevel1ClientDemoPackScopeLock
} = require('../../../runtime/level1/build-prog-087-level1-client-demo-pack-scope-lock.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-087-level1-client-demo-pack-scope-lock.json';
const mdPath = 'docs/launch/level1/prog-087-level1-client-demo-pack-scope-lock.md';
const runtimePath = 'runtime/level1/build-prog-087-level1-client-demo-pack-scope-lock.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-087-CLIENT-DEMO-PACK-SCOPE-LOCK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_CLIENT_DEMO_PACK_SCOPE_LOCK');
assert.equal(doc.issue_id, 'PROG-087');
assert.equal(doc.level1_client_demo_pack_scope_lock_status, STATUS);
assert.equal(doc.source_demo_readiness_snapshot_revision_hash, source.revision_hash);
assert.equal(doc.source_demo_readiness_snapshot_revision_hash_valid, true);

const regenerated = buildLevel1ClientDemoPackScopeLock({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_demo_readiness_boundary.snapshot_result, 'DEMO_READY_SYNTHETIC_ONLY');
assert.equal(doc.inherited_demo_readiness_boundary.verifier_replay_result, 'PASS');
assert.equal(doc.inherited_demo_readiness_boundary.verifier_replay_passed, true);
assert.equal(doc.inherited_demo_readiness_boundary.synthetic_chain_closed, true);
assert.equal(doc.inherited_demo_readiness_boundary.human_acceptance_completed, true);
assert.equal(doc.inherited_demo_readiness_boundary.decision_proof_demo_ready, true);
assert.equal(doc.inherited_demo_readiness_boundary.prior_level1_launch_ready, false);
assert.equal(doc.inherited_demo_readiness_boundary.prior_level1_client_pack_ready, false);
assert.equal(doc.inherited_demo_readiness_boundary.prior_public_surface_ready, false);
assert.equal(doc.inherited_demo_readiness_boundary.prior_external_customer_ready, false);
assert.equal(doc.inherited_demo_readiness_boundary.prior_banking_pack_ready, false);
assert.equal(doc.inherited_demo_readiness_boundary.prior_production_ready, false);

const expectedPayload = buildScopeLockPayload(source);
const scope = doc.client_demo_pack_scope_lock;

assert.equal(scope.scope_lock_payload_digest, sha256Digest(expectedPayload));
assert.equal(scope.client_demo_pack_scope_lock_id, 'CLIENT-DEMO-PACK-SCOPE::HBCE-L1-DECISION-PROOF-0001');
assert.equal(scope.pack_scope, 'LEVEL1_DECISION_PROOF_CLIENT_DEMO_PACK');
assert.equal(scope.pack_status, 'SCOPE_LOCKED_NOT_CLIENT_READY');
assert.equal(scope.demo_mode, 'SYNTHETIC_DECISION_PROOF_DEMO_ONLY');
assert.deepEqual(scope.allowed_content, CLIENT_DEMO_ALLOWED_CONTENT);
assert.deepEqual(scope.excluded_content, CLIENT_DEMO_EXCLUDED_CONTENT);
assert.equal(scope.target_audience.includes('banking_risk'), true);
assert.equal(scope.target_audience.includes('banking_compliance'), true);
assert.equal(scope.target_audience.includes('banking_audit'), true);
assert.equal(scope.required_pack_sections.includes('evidence_artifact_index'), true);
assert.equal(scope.required_pack_sections.includes('client_questions_boundary'), true);
assert.equal(scope.required_next_artifacts.includes('client_demo_pack_evidence_index'), true);
assert.equal(scope.required_next_artifacts.includes('client_demo_pack_readiness_gate'), true);
assert.equal(scope.public_surface_required, true);
assert.equal(scope.public_surface_ready, false);
assert.equal(scope.external_customer_ready, false);
assert.equal(scope.banking_pack_ready, false);
assert.equal(scope.level1_client_pack_ready, false);
assert.equal(scope.level1_launch_ready, false);
assert.equal(scope.production_ready, false);
assert.equal(scope.ai_scope_authority_allowed, false);

assert.equal(scope.scope_checklist.source_demo_readiness_snapshot_hash_valid, true);
assert.equal(scope.scope_checklist.demo_readiness_snapshot_passed, true);
assert.equal(scope.scope_checklist.decision_proof_demo_ready_confirmed, true);
assert.equal(scope.scope_checklist.synthetic_only_boundary_confirmed, true);
assert.equal(scope.scope_checklist.demonstrable_artifacts_defined, true);
assert.equal(scope.scope_checklist.launch_readiness_excluded, true);
assert.equal(scope.scope_checklist.client_pack_readiness_excluded, true);
assert.equal(scope.scope_checklist.production_readiness_excluded, true);
assert.equal(scope.scope_checklist.no_customer_data_confirmed, true);
assert.equal(scope.scope_checklist.no_live_system_control_confirmed, true);
assert.equal(scope.scope_checklist.ai_authority_absence_confirmed, true);

assert.equal(scope.scope_locked, true);
assert.equal(scope.scope_lock_is_not_client_pack_readiness, true);
assert.equal(scope.scope_lock_is_not_launch_readiness, true);
assert.equal(scope.scope_lock_is_not_public_surface_readiness, true);
assert.equal(scope.scope_lock_is_not_external_customer_readiness, true);
assert.equal(scope.scope_lock_is_not_banking_pack_readiness, true);
assert.equal(scope.scope_lock_is_not_production_readiness, true);
assert.equal(scope.scope_lock_is_not_legal_validity, true);
assert.equal(scope.scope_lock_is_not_security_certification, true);

for (const code of ['CLIENT_DEMO_PACK_SCOPE_LOCK_MISSING', 'SOURCE_DEMO_READINESS_SNAPSHOT_HASH_INVALID', 'DEMO_READINESS_SNAPSHOT_NOT_PASSED', 'DEMO_NOT_READY', 'SYNTHETIC_ONLY_BOUNDARY_NOT_CONFIRMED', 'DEMONSTRABLE_ARTIFACTS_MISSING', 'CUSTOMER_DATA_CLAIM_BLOCKED', 'LIVE_SYSTEM_CONTROL_CLAIM_BLOCKED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_SCOPE_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.client_demo_pack_scope_lock_defined, true);
assert.equal(doc.readiness_state.client_demo_pack_scope_locked, true);
assert.equal(doc.readiness_state.source_demo_readiness_snapshot_bound, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, true);
assert.equal(doc.readiness_state.synthetic_only_boundary_confirmed, true);
assert.equal(doc.readiness_state.demonstrable_artifacts_defined, true);
assert.equal(doc.readiness_state.client_demo_allowed_content_defined, true);
assert.equal(doc.readiness_state.client_demo_excluded_content_defined, true);
assert.equal(doc.readiness_state.client_demo_required_sections_defined, true);
assert.equal(doc.readiness_state.buyer_personas_defined, true);
assert.equal(doc.readiness_state.public_surface_required, true);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-088-HBCE-LEVEL1-CLIENT-DEMO-PACK-EVIDENCE-INDEX');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.client_pack_ready, false);
assert.equal(doc.non_claims.public_surface_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_CLIENT_DEMO_PACK_SCOPE_LOCK_DEFINED_NOT_CLIENT_READY/);
assert.match(md, /The client demo pack scope is locked/);
assert.match(md, /The client demo pack is not ready/);
assert.match(md, /The public surface is required but not ready/);
assert.match(md, /The banking pack is not ready/);
assert.match(md, /customer_data/);
assert.match(md, /live_system_control/);
assert.match(md, /pricing_commitment/);
assert.match(md, /The scope lock does not make production ready/);
assert.match(md, /PROG-088-HBCE-LEVEL1-CLIENT-DEMO-PACK-EVIDENCE-INDEX/);

console.log('PASS PROG-087-CLIENT-DEMO-PACK-SCOPE-LOCK-DOCS-EXIST');
console.log('PASS PROG-087-CLIENT-DEMO-PACK-SCOPE-LOCK-HASH-STABLE');
console.log('PASS PROG-087-BUILDER-STABLE');
console.log('PASS PROG-087-SOURCE-PROG-086-INTEGRITY-VALID');
console.log('PASS PROG-087-CLIENT-DEMO-SCOPE-LOCKED');
console.log('PASS PROG-087-ALLOWED-AND-EXCLUDED-CONTENT-DEFINED');
console.log('PASS PROG-087-NOT-CLIENT-PACK-READY');
console.log('PASS PROG-087-AI-SCOPE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-087-NEXT-PROG-088-RECORDED');
console.log('PASS PROG-087-NO-UNSUPPORTED-READINESS-CLAIMS');
