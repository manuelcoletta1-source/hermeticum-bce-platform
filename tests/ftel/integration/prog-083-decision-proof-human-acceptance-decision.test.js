'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildDecisionPayload,
  buildDecisionProofHumanAcceptanceDecision
} = require('../../../runtime/level1/build-prog-083-decision-proof-human-acceptance-decision.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-083-decision-proof-human-acceptance-decision.json';
const mdPath = 'docs/launch/level1/prog-083-decision-proof-human-acceptance-decision.md';
const runtimePath = 'runtime/level1/build-prog-083-decision-proof-human-acceptance-decision.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-083-DECISION-PROOF-HUMAN-ACCEPTANCE-DECISION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_DECISION');
assert.equal(doc.issue_id, 'PROG-083');
assert.equal(doc.decision_proof_human_acceptance_decision_status, STATUS);
assert.equal(doc.source_human_acceptance_record_revision_hash, source.revision_hash);
assert.equal(doc.source_human_acceptance_record_revision_hash_valid, true);

const regenerated = buildDecisionProofHumanAcceptanceDecision({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_acceptance_record_boundary.synthetic_demo_only, true);
assert.equal(doc.inherited_acceptance_record_boundary.verifier_replay_completed, true);
assert.equal(doc.inherited_acceptance_record_boundary.verifier_replay_result, 'PASS');
assert.equal(doc.inherited_acceptance_record_boundary.verifier_replay_passed, true);
assert.equal(doc.inherited_acceptance_record_boundary.synthetic_chain_closed, true);
assert.equal(doc.inherited_acceptance_record_boundary.acceptance_status, 'PENDING');
assert.equal(doc.inherited_acceptance_record_boundary.prior_acceptance_decision_recorded, false);
assert.equal(doc.inherited_acceptance_record_boundary.prior_acceptance_record_signed, false);
assert.equal(doc.inherited_acceptance_record_boundary.prior_acceptance_gate_result, 'BLOCKED_PENDING_HUMAN_ACCEPTANCE_DECISION');

const expectedPayload = buildDecisionPayload(source);
assert.equal(doc.human_acceptance_decision.decision_digest, sha256Digest(expectedPayload));
assert.equal(doc.human_acceptance_decision.decision_record_id, 'HUMAN-ACCEPTANCE-DECISION::HBCE-L1-DEMO-0001');
assert.equal(doc.human_acceptance_decision.decision_maker_ref, 'IPR-3::MANUEL-COLETTA');
assert.equal(doc.human_acceptance_decision.decision, 'ACCEPTED_SYNTHETIC_DEMO_ONLY');
assert.equal(doc.human_acceptance_decision.decision_recorded, true);
assert.equal(doc.human_acceptance_decision.decision_scope, 'SYNTHETIC_DEMO_ONLY');
assert.equal(doc.human_acceptance_decision.decision_comment_required, true);
assert.equal(doc.human_acceptance_decision.decision_comment_present, true);
assert.equal(doc.human_acceptance_decision.signature_required, true);
assert.equal(doc.human_acceptance_decision.signature_status, 'PENDING_SIGNATURE');
assert.equal(doc.human_acceptance_decision.acceptance_record_signed, false);
assert.equal(doc.human_acceptance_decision.cryptographic_signature_present, false);
assert.equal(doc.human_acceptance_decision.manual_attestation_present, false);
assert.equal(doc.human_acceptance_decision.ai_acceptance_authority_allowed, false);
assert.equal(doc.human_acceptance_decision.decision_is_not_signature, true);
assert.equal(doc.human_acceptance_decision.decision_is_not_legal_validity, true);
assert.equal(doc.human_acceptance_decision.decision_is_not_launch_readiness, true);
assert.equal(doc.human_acceptance_decision.decision_is_not_production_readiness, true);

assert.equal(doc.acceptance_gate_after_decision.gate_result, 'BLOCKED_PENDING_ACCEPTANCE_SIGNATURE');
assert.equal(doc.acceptance_gate_after_decision.gate_passed, false);
assert.equal(doc.acceptance_gate_after_decision.decision_requirement_satisfied, true);
assert.equal(doc.acceptance_gate_after_decision.comment_requirement_satisfied, true);
assert.equal(doc.acceptance_gate_after_decision.signature_requirement_satisfied, false);
assert.equal(doc.acceptance_gate_after_decision.manual_attestation_requirement_satisfied, false);
assert.equal(doc.acceptance_gate_after_decision.blocked_by.includes('HUMAN_ACCEPTANCE_RECORD_NOT_SIGNED'), true);
assert.equal(doc.acceptance_gate_after_decision.blocked_by.includes('HUMAN_ACCEPTANCE_SIGNATURE_OR_ATTESTATION_NOT_RECORDED'), true);

for (const code of ['HUMAN_ACCEPTANCE_DECISION_MISSING', 'SOURCE_HUMAN_ACCEPTANCE_RECORD_HASH_INVALID', 'ACCEPTANCE_COMMENT_MISSING', 'HUMAN_ACCEPTANCE_RECORD_NOT_SIGNED', 'HUMAN_ACCEPTANCE_SIGNATURE_OR_ATTESTATION_NOT_RECORDED', 'UNSUPPORTED_READINESS_CLAIM', 'AI_ACCEPTANCE_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.human_acceptance_decision_record_defined, true);
assert.equal(doc.readiness_state.human_acceptance_decision_recorded, true);
assert.equal(doc.readiness_state.human_acceptance_comment_present, true);
assert.equal(doc.readiness_state.human_acceptance_record_signed, false);
assert.equal(doc.readiness_state.human_acceptance_signature_or_attestation_recorded, false);
assert.equal(doc.readiness_state.human_acceptance_completed, false);
assert.equal(doc.readiness_state.source_human_acceptance_record_bound, true);
assert.equal(doc.readiness_state.verifier_replay_completed, true);
assert.equal(doc.readiness_state.verifier_replay_passed, true);
assert.equal(doc.readiness_state.synthetic_chain_closed, true);
assert.equal(doc.readiness_state.acceptance_gate_passed, false);
assert.equal(doc.readiness_state.decision_proof_demo_accepted_by_decision, true);
assert.equal(doc.readiness_state.decision_proof_demo_accepted, false);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-084-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION');

assert.equal(doc.non_claims.human_acceptance_completed, false);
assert.equal(doc.non_claims.acceptance_record_signed, false);
assert.equal(doc.non_claims.signature_or_attestation_recorded, false);
assert.equal(doc.non_claims.decision_proof_demo_accepted, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_DECISION_RECORDED_PENDING_SIGNATURE/);
assert.match(md, /The decision is recorded as ACCEPTED_SYNTHETIC_DEMO_ONLY/);
assert.match(md, /The acceptance record is not signed/);
assert.match(md, /Human acceptance is not completed/);
assert.match(md, /BLOCKED_PENDING_ACCEPTANCE_SIGNATURE/);
assert.match(md, /The signature requirement is not satisfied/);
assert.match(md, /PROG-084-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION/);

console.log('PASS PROG-083-HUMAN-ACCEPTANCE-DECISION-DOCS-EXIST');
console.log('PASS PROG-083-HUMAN-ACCEPTANCE-DECISION-HASH-STABLE');
console.log('PASS PROG-083-BUILDER-STABLE');
console.log('PASS PROG-083-SOURCE-PROG-082-INTEGRITY-VALID');
console.log('PASS PROG-083-DECISION-RECORDED-SYNTHETIC-ONLY');
console.log('PASS PROG-083-COMMENT-PRESENT');
console.log('PASS PROG-083-SIGNATURE-PENDING-BLOCKS-ACCEPTANCE');
console.log('PASS PROG-083-AI-ACCEPTANCE-AUTHORITY-DISALLOWED');
console.log('PASS PROG-083-NEXT-PROG-084-RECORDED');
console.log('PASS PROG-083-NO-UNSUPPORTED-READINESS-CLAIMS');
