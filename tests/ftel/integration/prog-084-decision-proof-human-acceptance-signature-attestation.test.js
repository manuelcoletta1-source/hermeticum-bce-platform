'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  STATUS,
  SOURCE_REF,
  buildAttestationPayload,
  buildDecisionProofHumanAcceptanceSignatureAttestation
} = require('../../../runtime/level1/build-prog-084-decision-proof-human-acceptance-signature-attestation.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-084-decision-proof-human-acceptance-signature-attestation.json';
const mdPath = 'docs/launch/level1/prog-084-decision-proof-human-acceptance-signature-attestation.md';
const runtimePath = 'runtime/level1/build-prog-084-decision-proof-human-acceptance-signature-attestation.js';

for (const p of [docPath, mdPath, runtimePath, SOURCE_REF]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(SOURCE_REF);

assert.equal(doc.proto, 'HBCE-L1-PROG-084-DECISION-PROOF-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_SIGNATURE_ATTESTATION');
assert.equal(doc.issue_id, 'PROG-084');
assert.equal(doc.decision_proof_human_acceptance_signature_attestation_status, STATUS);
assert.equal(doc.source_human_acceptance_decision_revision_hash, source.revision_hash);
assert.equal(doc.source_human_acceptance_decision_revision_hash_valid, true);

const regenerated = buildDecisionProofHumanAcceptanceSignatureAttestation({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_acceptance_decision_boundary.verifier_replay_result, 'PASS');
assert.equal(doc.inherited_acceptance_decision_boundary.verifier_replay_passed, true);
assert.equal(doc.inherited_acceptance_decision_boundary.synthetic_chain_closed, true);
assert.equal(doc.inherited_acceptance_decision_boundary.decision_recorded, true);
assert.equal(doc.inherited_acceptance_decision_boundary.decision_comment_present, true);
assert.equal(doc.inherited_acceptance_decision_boundary.prior_signature_status, 'PENDING_SIGNATURE');
assert.equal(doc.inherited_acceptance_decision_boundary.prior_acceptance_record_signed, false);
assert.equal(doc.inherited_acceptance_decision_boundary.prior_signature_or_attestation_recorded, false);
assert.equal(doc.inherited_acceptance_decision_boundary.prior_acceptance_gate_result, 'BLOCKED_PENDING_ACCEPTANCE_SIGNATURE');

const expectedPayload = buildAttestationPayload(source);
const attestation = doc.human_acceptance_signature_attestation;

assert.equal(attestation.attestation_digest, sha256Digest(expectedPayload));
assert.equal(attestation.attestation_record_id, 'HUMAN-ACCEPTANCE-ATTESTATION::HBCE-L1-DEMO-0001');
assert.equal(attestation.source_decision_record_id, source.human_acceptance_decision.decision_record_id);
assert.equal(attestation.source_decision_digest, source.human_acceptance_decision.decision_digest);
assert.equal(attestation.attestor_ref, 'IPR-3::MANUEL-COLETTA');
assert.equal(attestation.attestation_scope, 'SYNTHETIC_DEMO_ONLY');
assert.equal(attestation.attestation_status, 'RECORDED');
assert.equal(attestation.attestation_method, 'MANUAL_HUMAN_ATTESTATION');
assert.equal(attestation.acceptance_record_signed, true);
assert.equal(attestation.signature_or_attestation_recorded, true);
assert.equal(attestation.manual_attestation_present, true);
assert.equal(attestation.manual_attestation_statement_present, true);
assert.equal(attestation.cryptographic_signature_present, false);
assert.equal(attestation.cryptographic_signature_required_for_demo_acceptance, false);
assert.equal(attestation.signature_requirement_satisfied_by_manual_attestation, true);
assert.equal(attestation.ai_attestation_authority_allowed, false);
assert.equal(attestation.attestation_is_not_legal_validity, true);
assert.equal(attestation.attestation_is_not_launch_readiness, true);
assert.equal(attestation.attestation_is_not_production_readiness, true);

assert.equal(doc.acceptance_gate_after_attestation.gate_result, 'PASS_HUMAN_ACCEPTANCE_ATTESTED_SYNTHETIC_ONLY');
assert.equal(doc.acceptance_gate_after_attestation.gate_passed, true);
assert.equal(doc.acceptance_gate_after_attestation.decision_requirement_satisfied, true);
assert.equal(doc.acceptance_gate_after_attestation.comment_requirement_satisfied, true);
assert.equal(doc.acceptance_gate_after_attestation.signature_or_attestation_requirement_satisfied, true);
assert.equal(doc.acceptance_gate_after_attestation.manual_attestation_requirement_satisfied, true);
assert.equal(doc.acceptance_gate_after_attestation.cryptographic_signature_requirement_satisfied, false);
assert.equal(doc.acceptance_gate_after_attestation.pass_result_is_not_demo_readiness, true);
assert.equal(doc.acceptance_gate_after_attestation.next_closure_gate_required, true);
assert.deepEqual(doc.acceptance_gate_after_attestation.blocked_by, []);

for (const code of ['HUMAN_ACCEPTANCE_SIGNATURE_ATTESTATION_MISSING', 'SOURCE_HUMAN_ACCEPTANCE_DECISION_HASH_INVALID', 'SOURCE_DECISION_DIGEST_MISMATCH', 'MANUAL_ATTESTATION_MISSING', 'ATTESTATION_STATEMENT_MISSING', 'UNSUPPORTED_READINESS_CLAIM', 'AI_ATTESTATION_AUTHORITY_CLAIM_BLOCKED']) {
  assert.equal(doc.fail_closed_codes.includes(code), true, `${code} must be present`);
}

assert.equal(doc.readiness_state.human_acceptance_signature_attestation_record_defined, true);
assert.equal(doc.readiness_state.human_acceptance_decision_recorded, true);
assert.equal(doc.readiness_state.human_acceptance_comment_present, true);
assert.equal(doc.readiness_state.human_acceptance_record_signed, true);
assert.equal(doc.readiness_state.human_acceptance_signature_or_attestation_recorded, true);
assert.equal(doc.readiness_state.manual_attestation_present, true);
assert.equal(doc.readiness_state.cryptographic_signature_present, false);
assert.equal(doc.readiness_state.human_acceptance_completed, true);
assert.equal(doc.readiness_state.verifier_replay_passed, true);
assert.equal(doc.readiness_state.synthetic_chain_closed, true);
assert.equal(doc.readiness_state.acceptance_gate_passed, true);
assert.equal(doc.readiness_state.decision_proof_demo_accepted, true);
assert.equal(doc.readiness_state.decision_proof_demo_ready, false);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-085-HBCE-LEVEL1-DECISION-PROOF-DEMO-ACCEPTANCE-CLOSURE-GATE');

assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.external_effect_proven, false);
assert.equal(doc.non_claims.business_success, false);
assert.equal(doc.non_claims.ai_authority, false);
assert.equal(doc.non_claims.decision_proof_demo_ready, false);
assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_SIGNATURE_ATTESTATION_RECORDED_NOT_DEMO_READY/);
assert.match(md, /Manual human attestation is recorded/);
assert.match(md, /Human acceptance is completed/);
assert.match(md, /The Decision Proof demo is accepted/);
assert.match(md, /The Decision Proof demo is not ready/);
assert.match(md, /PASS_HUMAN_ACCEPTANCE_ATTESTED_SYNTHETIC_ONLY/);
assert.match(md, /A separate demo acceptance closure gate is required/);
assert.match(md, /PROG-085-HBCE-LEVEL1-DECISION-PROOF-DEMO-ACCEPTANCE-CLOSURE-GATE/);

console.log('PASS PROG-084-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION-DOCS-EXIST');
console.log('PASS PROG-084-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION-HASH-STABLE');
console.log('PASS PROG-084-BUILDER-STABLE');
console.log('PASS PROG-084-SOURCE-PROG-083-INTEGRITY-VALID');
console.log('PASS PROG-084-MANUAL-ATTESTATION-RECORDED');
console.log('PASS PROG-084-HUMAN-ACCEPTANCE-COMPLETED');
console.log('PASS PROG-084-DEMO-ACCEPTED-NOT-DEMO-READY');
console.log('PASS PROG-084-AI-ATTESTATION-AUTHORITY-DISALLOWED');
console.log('PASS PROG-084-NEXT-PROG-085-RECORDED');
console.log('PASS PROG-084-NO-UNSUPPORTED-READINESS-CLAIMS');
