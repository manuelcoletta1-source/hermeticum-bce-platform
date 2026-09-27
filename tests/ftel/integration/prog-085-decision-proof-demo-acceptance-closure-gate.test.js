'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  CLOSURE_REQUIREMENTS,
  buildClosurePayload,
  buildDecisionProofDemoAcceptanceClosureGate
} = require('../../../runtime/level1/build-prog-085-decision-proof-demo-acceptance-closure-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-085-decision-proof-demo-acceptance-closure-gate.json';
const mdPath = 'docs/launch/level1/prog-085-decision-proof-demo-acceptance-closure-gate.md';
const runtimePath = 'runtime/level1/build-prog-085-decision-proof-demo-acceptance-closure-gate.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-085-DECISION-PROOF-DEMO-ACCEPTANCE-CLOSURE-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_DEMO_ACCEPTANCE_CLOSURE_GATE');
assert.equal(doc.issue_id, 'PROG-085');
assert.equal(doc.decision_proof_demo_acceptance_closure_gate_status, STATUS);
assert.equal(doc.source_human_acceptance_attestation_revision_hash, source.revision_hash);
assert.equal(doc.source_human_acceptance_attestation_revision_hash_valid, true);

const regenerated = buildDecisionProofDemoAcceptanceClosureGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_attestation_boundary.verifier_replay_result, 'PASS');
assert.equal(doc.inherited_attestation_boundary.verifier_replay_passed, true);
assert.equal(doc.inherited_attestation_boundary.synthetic_chain_closed, true);
assert.equal(doc.inherited_attestation_boundary.human_acceptance_completed, true);
assert.equal(doc.inherited_attestation_boundary.acceptance_gate_passed, true);
assert.equal(doc.inherited_attestation_boundary.decision_proof_demo_accepted, true);
assert.equal(doc.inherited_attestation_boundary.prior_decision_proof_demo_ready, false);
assert.equal(doc.inherited_attestation_boundary.prior_level1_launch_ready, false);
assert.equal(doc.inherited_attestation_boundary.prior_production_ready, false);

const expectedPayload = buildClosurePayload(source);
const gate = doc.closure_gate;

assert.equal(gate.closure_payload_digest, sha256Digest(expectedPayload));
assert.equal(gate.closure_gate_id, 'DEMO-ACCEPTANCE-CLOSURE-GATE::HBCE-L1-DEMO-0001');
assert.equal(gate.closure_subject_ref, source.human_acceptance_signature_attestation.attestation_record_id);
assert.equal(gate.closure_subject_digest, source.human_acceptance_signature_attestation.attestation_digest);
assert.equal(gate.closure_scope, 'SYNTHETIC_LEVEL1_DECISION_PROOF_DEMO_ONLY');
assert.equal(gate.closure_result, 'PASS_SYNTHETIC_DEMO_ACCEPTANCE_CLOSED');
assert.equal(gate.verifier_replay_result, 'PASS');
assert.equal(gate.verifier_replay_passed, true);
assert.equal(gate.synthetic_chain_closed, true);
assert.equal(gate.human_acceptance_completed, true);
assert.equal(gate.decision_proof_demo_accepted, true);
assert.equal(gate.decision_proof_demo_ready, true);
assert.equal(gate.level1_launch_ready, false);
assert.equal(gate.level1_client_pack_ready, false);
assert.equal(gate.production_ready, false);
assert.equal(gate.ai_closure_authority_allowed, false);
assert.deepEqual(gate.closure_requirements, CLOSURE_REQUIREMENTS);

assert.equal(gate.closure_checklist.source_attestation_hash_valid, true);
assert.equal(gate.closure_checklist.verifier_replay_pass_confirmed, true);
assert.equal(gate.closure_checklist.synthetic_chain_closed_confirmed, true);
assert.equal(gate.closure_checklist.human_acceptance_completed_confirmed, true);
assert.equal(gate.closure_checklist.demo_accepted_confirmed, true);
assert.equal(gate.closure_checklist.non_claims_confirmed, true);
assert.equal(gate.closure_checklist.ai_authority_absence_confirmed, true);

assert.equal(gate.gate_passed, true);
assert.equal(gate.gate_result_is_demo_readiness_only, true);
assert.equal(gate.demo_ready_is_synthetic_only, true);
assert.equal(gate.demo_ready_is_not_legal_validity, true);
assert.equal(gate.demo_ready_is_not_public_accreditation, true);
assert.equal(gate.demo_ready_is_not_procurement_eligibility, true);
assert.equal(gate.demo_ready_is_not_external_effect_proof, true);
assert.equal(gate.demo_ready_is_not_business_success, true);
assert.equal(gate.demo_ready_is_not_launch_readiness, true);
assert.equal(gate.demo_ready_is_not_client_pack_readiness, true);
assert.equal(gate.demo_ready_is_not_production_readiness, true);

for (const code of ['DEMO_ACCEPTANCE_CLOSURE_GATE_MISSING', 'SOURCE_HUMAN_ACCEPTANCE_ATTESTATION_HASH_INVALID', 'VERIFIER_REPLAY_NOT_PASS', 'SYNTHETIC_CHAIN_NOT_CLOSED', 'HUMAN_ACCEPTANCE_NOT_COMPLETED', 'DEMO_NOT_ACCEPTED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_CLOSURE_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.demo_acceptance_closure_gate_defined, true);
assert.equal(doc.readiness_state.demo_acceptance_closure_gate_passed, true);
assert.equal(doc.readiness_state.source_human_acceptance_attestation_bound, true);
assert.equal(doc.readiness_state.verifier_replay_completed, true);
assert.equal(doc.readiness_state.verifier_replay_passed, true);
assert.equal(doc.readiness_state.synthetic_chain_closed, true);
assert.equal(doc.readiness_state.human_acceptance_completed, true);
assert.equal(doc.readiness_state.decision_proof_demo_accepted, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, true);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-086-HBCE-LEVEL1-DECISION-PROOF-DEMO-READINESS-SNAPSHOT');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.level1_client_pack_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_DEMO_ACCEPTANCE_CLOSURE_GATE_PASSED_SYNTHETIC_ONLY/);
assert.match(md, /The Decision Proof demo is ready for synthetic demonstration/);
assert.match(md, /Level 1 launch is not ready/);
assert.match(md, /The Level 1 client pack is not ready/);
assert.match(md, /Demo readiness is synthetic-only/);
assert.match(md, /Demo readiness does not create legal validity/);
assert.match(md, /Demo readiness does not make production ready/);
assert.match(md, /PROG-086-HBCE-LEVEL1-DECISION-PROOF-DEMO-READINESS-SNAPSHOT/);

console.log('PASS PROG-085-DEMO-ACCEPTANCE-CLOSURE-GATE-DOCS-EXIST');
console.log('PASS PROG-085-DEMO-ACCEPTANCE-CLOSURE-GATE-HASH-STABLE');
console.log('PASS PROG-085-BUILDER-STABLE');
console.log('PASS PROG-085-SOURCE-PROG-084-INTEGRITY-VALID');
console.log('PASS PROG-085-CLOSURE-REQUIREMENTS-CONFIRMED');
console.log('PASS PROG-085-DEMO-READY-SYNTHETIC-ONLY');
console.log('PASS PROG-085-DEMO-READY-NOT-LAUNCH-READY');
console.log('PASS PROG-085-AI-CLOSURE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-085-NEXT-PROG-086-RECORDED');
console.log('PASS PROG-085-NO-UNSUPPORTED-READINESS-CLAIMS');
