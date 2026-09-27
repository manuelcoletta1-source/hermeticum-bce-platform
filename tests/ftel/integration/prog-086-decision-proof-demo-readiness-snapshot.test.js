'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  SNAPSHOT_REQUIREMENTS,
  buildSnapshotPayload,
  buildDecisionProofDemoReadinessSnapshot
} = require('../../../runtime/level1/build-prog-086-decision-proof-demo-readiness-snapshot.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-086-decision-proof-demo-readiness-snapshot.json';
const mdPath = 'docs/launch/level1/prog-086-decision-proof-demo-readiness-snapshot.md';
const runtimePath = 'runtime/level1/build-prog-086-decision-proof-demo-readiness-snapshot.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-086-DECISION-PROOF-DEMO-READINESS-SNAPSHOT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_DEMO_READINESS_SNAPSHOT');
assert.equal(doc.issue_id, 'PROG-086');
assert.equal(doc.decision_proof_demo_readiness_snapshot_status, STATUS);
assert.equal(doc.source_demo_acceptance_closure_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_demo_acceptance_closure_gate_revision_hash_valid, true);

const regenerated = buildDecisionProofDemoReadinessSnapshot({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_closure_gate_boundary.closure_result, 'PASS_SYNTHETIC_DEMO_ACCEPTANCE_CLOSED');
assert.equal(doc.inherited_closure_gate_boundary.verifier_replay_result, 'PASS');
assert.equal(doc.inherited_closure_gate_boundary.verifier_replay_passed, true);
assert.equal(doc.inherited_closure_gate_boundary.synthetic_chain_closed, true);
assert.equal(doc.inherited_closure_gate_boundary.human_acceptance_completed, true);
assert.equal(doc.inherited_closure_gate_boundary.demo_acceptance_closure_gate_passed, true);
assert.equal(doc.inherited_closure_gate_boundary.decision_proof_demo_accepted, true);
assert.equal(doc.inherited_closure_gate_boundary.decision_proof_demo_ready, true);
assert.equal(doc.inherited_closure_gate_boundary.prior_level1_launch_ready, false);
assert.equal(doc.inherited_closure_gate_boundary.prior_level1_client_pack_ready, false);
assert.equal(doc.inherited_closure_gate_boundary.prior_production_ready, false);

const expectedPayload = buildSnapshotPayload(source);
const snapshot = doc.demo_readiness_snapshot;

assert.equal(snapshot.snapshot_payload_digest, sha256Digest(expectedPayload));
assert.equal(snapshot.snapshot_id, 'DEMO-READINESS-SNAPSHOT::HBCE-L1-DEMO-0001');
assert.equal(snapshot.snapshot_subject_ref, source.closure_gate.closure_gate_id);
assert.equal(snapshot.snapshot_subject_digest, source.closure_gate.closure_payload_digest);
assert.equal(snapshot.snapshot_scope, 'SYNTHETIC_LEVEL1_DECISION_PROOF_DEMO_ONLY');
assert.equal(snapshot.snapshot_result, 'DEMO_READY_SYNTHETIC_ONLY');
assert.equal(snapshot.verifier_replay_result, 'PASS');
assert.equal(snapshot.verifier_replay_passed, true);
assert.equal(snapshot.synthetic_chain_closed, true);
assert.equal(snapshot.human_acceptance_completed, true);
assert.equal(snapshot.demo_acceptance_closure_gate_passed, true);
assert.equal(snapshot.decision_proof_demo_accepted, true);
assert.equal(snapshot.decision_proof_demo_ready, true);
assert.equal(snapshot.level1_launch_ready, false);
assert.equal(snapshot.level1_client_pack_ready, false);
assert.equal(snapshot.production_ready, false);
assert.equal(snapshot.public_surface_ready, false);
assert.equal(snapshot.external_customer_ready, false);
assert.equal(snapshot.banking_pack_ready, false);
assert.equal(snapshot.ai_snapshot_authority_allowed, false);
assert.deepEqual(snapshot.snapshot_requirements, SNAPSHOT_REQUIREMENTS);

assert.equal(snapshot.demonstration_boundary.synthetic_demo_only, true);
assert.equal(snapshot.demonstration_boundary.deterministic_fixture_based, true);
assert.equal(snapshot.demonstration_boundary.no_customer_data, true);
assert.equal(snapshot.demonstration_boundary.no_live_system_control, true);
assert.equal(snapshot.demonstration_boundary.no_external_effect_claim, true);
assert.equal(snapshot.demonstration_boundary.no_legal_validity_claim, true);
assert.equal(snapshot.demonstration_boundary.no_ai_authority_claim, true);

assert.equal(snapshot.demonstrable_artifacts.includes('authority_boundary_record'), true);
assert.equal(snapshot.demonstrable_artifacts.includes('policy_evaluation_record'), true);
assert.equal(snapshot.demonstrable_artifacts.includes('evidence_export_manifest'), true);
assert.equal(snapshot.demonstrable_artifacts.includes('verifier_replay_result'), true);
assert.equal(snapshot.demonstrable_artifacts.includes('human_acceptance_attestation'), true);
assert.equal(snapshot.demonstrable_artifacts.includes('demo_acceptance_closure_gate'), true);

assert.equal(snapshot.snapshot_checklist.source_closure_gate_hash_valid, true);
assert.equal(snapshot.snapshot_checklist.demo_acceptance_closure_gate_passed, true);
assert.equal(snapshot.snapshot_checklist.verifier_replay_pass_confirmed, true);
assert.equal(snapshot.snapshot_checklist.synthetic_chain_closed_confirmed, true);
assert.equal(snapshot.snapshot_checklist.human_acceptance_completed_confirmed, true);
assert.equal(snapshot.snapshot_checklist.demo_ready_confirmed_synthetic_only, true);
assert.equal(snapshot.snapshot_checklist.launch_readiness_excluded, true);
assert.equal(snapshot.snapshot_checklist.client_pack_readiness_excluded, true);
assert.equal(snapshot.snapshot_checklist.production_readiness_excluded, true);
assert.equal(snapshot.snapshot_checklist.ai_authority_absence_confirmed, true);

assert.equal(snapshot.snapshot_passed, true);
assert.equal(snapshot.snapshot_is_synthetic_only, true);
assert.equal(snapshot.snapshot_is_not_legal_validity, true);
assert.equal(snapshot.snapshot_is_not_public_accreditation, true);
assert.equal(snapshot.snapshot_is_not_procurement_eligibility, true);
assert.equal(snapshot.snapshot_is_not_external_effect_proof, true);
assert.equal(snapshot.snapshot_is_not_business_success, true);
assert.equal(snapshot.snapshot_is_not_launch_readiness, true);
assert.equal(snapshot.snapshot_is_not_client_pack_readiness, true);
assert.equal(snapshot.snapshot_is_not_production_readiness, true);

for (const code of ['DEMO_READINESS_SNAPSHOT_MISSING', 'SOURCE_DEMO_ACCEPTANCE_CLOSURE_GATE_HASH_INVALID', 'DEMO_ACCEPTANCE_CLOSURE_GATE_NOT_PASSED', 'VERIFIER_REPLAY_NOT_PASS', 'SYNTHETIC_CHAIN_NOT_CLOSED', 'HUMAN_ACCEPTANCE_NOT_COMPLETED', 'DEMO_READY_NOT_CONFIRMED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_SNAPSHOT_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.demo_readiness_snapshot_defined, true);
assert.equal(doc.readiness_state.demo_readiness_snapshot_passed, true);
assert.equal(doc.readiness_state.source_demo_acceptance_closure_gate_bound, true);
assert.equal(doc.readiness_state.verifier_replay_completed, true);
assert.equal(doc.readiness_state.verifier_replay_passed, true);
assert.equal(doc.readiness_state.synthetic_chain_closed, true);
assert.equal(doc.readiness_state.human_acceptance_completed, true);
assert.equal(doc.readiness_state.decision_proof_demo_accepted, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, true);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.public_surface_ready, false);
assert.equal(doc.readiness_state.external_customer_ready, false);
assert.equal(doc.readiness_state.banking_pack_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-087-HBCE-LEVEL1-CLIENT-DEMO-PACK-SCOPE-LOCK');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.level1_client_pack_ready, false);
assert.equal(doc.non_claims.public_surface_ready, false);
assert.equal(doc.non_claims.external_customer_ready, false);
assert.equal(doc.non_claims.banking_pack_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_DEMO_READINESS_SNAPSHOT_DEFINED_SYNTHETIC_ONLY/);
assert.match(md, /The Decision Proof demo is ready for synthetic demonstration/);
assert.match(md, /Level 1 launch is not ready/);
assert.match(md, /The Level 1 client pack is not ready/);
assert.match(md, /The public surface is not ready/);
assert.match(md, /External customer readiness is not ready/);
assert.match(md, /The banking pack is not ready/);
assert.match(md, /The snapshot is synthetic-only/);
assert.match(md, /The snapshot uses no customer data/);
assert.match(md, /The snapshot controls no live system/);
assert.match(md, /The snapshot does not make production ready/);
assert.match(md, /PROG-087-HBCE-LEVEL1-CLIENT-DEMO-PACK-SCOPE-LOCK/);

console.log('PASS PROG-086-DEMO-READINESS-SNAPSHOT-DOCS-EXIST');
console.log('PASS PROG-086-DEMO-READINESS-SNAPSHOT-HASH-STABLE');
console.log('PASS PROG-086-BUILDER-STABLE');
console.log('PASS PROG-086-SOURCE-PROG-085-INTEGRITY-VALID');
console.log('PASS PROG-086-DEMO-READY-SNAPSHOT-SYNTHETIC-ONLY');
console.log('PASS PROG-086-DEMONSTRABLE-ARTIFACTS-DEFINED');
console.log('PASS PROG-086-NOT-LAUNCH-OR-CLIENT-PACK-READY');
console.log('PASS PROG-086-AI-SNAPSHOT-AUTHORITY-DISALLOWED');
console.log('PASS PROG-086-NEXT-PROG-087-RECORDED');
console.log('PASS PROG-086-NO-UNSUPPORTED-READINESS-CLAIMS');
