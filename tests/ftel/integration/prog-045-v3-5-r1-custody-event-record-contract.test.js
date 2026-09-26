'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  EVENT_TYPES,
  TIME_ASSURANCE,
  VERIFICATION_STATUS,
  sampleCustodyEvent,
  validateCustodyEventRecord,
  buildContract
} = require('../../../runtime/b2g/build-v3-5-r1-custody-event-record-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-custody-event-record-contract.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-custody-event-record-contract.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-custody-event-record-contract.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-verifier-qualification-record-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-CUSTODY-EVENT-RECORD-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_CUSTODY_EVENT_RECORD_CONTRACT');
assert.equal(doc.issue_id, 'PROG-045');
assert.equal(doc.priority, 'V3.5-R1-CUSTODY-EVENT-RECORD-CONTRACT');
assert.equal(doc.source_verifier_qualification_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_verifier_qualification_contract_revision_hash_valid, true);

const regenerated = buildContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.governing_producer, 'PRODUCER::EVIDENCE_CUSTODY');
assert.deepEqual(doc.allowed_event_types, EVENT_TYPES);
assert.deepEqual(doc.allowed_time_assurance, TIME_ASSURANCE);
assert.deepEqual(doc.allowed_verification_status, VERIFICATION_STATUS);

assert.equal(doc.invariant.event_hash_binds_event_body, true);
assert.equal(doc.invariant.previous_event_hash_binds_append_only_sequence, true);
assert.equal(doc.invariant.hash_does_not_prove_identity, true);
assert.equal(doc.invariant.hash_does_not_prove_trusted_time, true);
assert.equal(doc.invariant.hash_does_not_prove_legal_authenticity, true);
assert.equal(doc.invariant.custody_event_does_not_emit_evidentiary_status, true);

const byId = Object.fromEntries(doc.runtime_guard_vectors.map((v) => [v.vector_id, v]));
assert.equal(byId['B2G-T32'].result.code, 'CHAIN_OF_CUSTODY_BROKEN');
assert.equal(byId['B2G-T33'].result.code, 'TIME_PROVENANCE_INCOMPLETE');
assert.equal(byId['B2G-T34'].result.code, 'SIGNATURE_OR_SEAL_CLAIM_UNSUPPORTED');
assert.equal(byId['B2G-T35'].result.code, 'EVIDENCE_SEAL_INVALID');
assert.equal(byId['B2G-POS-002'].result.code, 'CUSTODY_EVENT_VALID');
assert.equal(byId['B2G-POS-002'].result.valid, true);
assert.equal(byId['B2G-POS-002'].result.evidentiary_promotion_permitted, false);
assert.equal(byId['B2G-POS-002'].result.proves_identity, false);
assert.equal(byId['B2G-POS-002'].result.proves_trusted_time, false);

assert.equal(validateCustodyEventRecord(sampleCustodyEvent()).valid, true);
assert.equal(validateCustodyEventRecord(sampleCustodyEvent({ event_type: 'MAGIC' })).code, 'CUSTODY_EVENT_TYPE_INVALID');
assert.equal(validateCustodyEventRecord(sampleCustodyEvent({ time_assurance: 'TRUST_ME' })).code, 'TIME_ASSURANCE_INVALID');

const tampered = sampleCustodyEvent();
tampered.custodian_ref = 'PRODUCER::TAMPERED';
assert.equal(validateCustodyEventRecord(tampered).code, 'EVIDENCE_INTEGRITY_INVALID');

assert.equal(doc.closed_gap.gap_id, 'L2-GAP-003');
assert.equal(doc.closed_gap.status, 'CLOSED_CONTRACT_AND_VALIDATOR_BASELINE');
assert.equal(doc.closed_gap.custody_runtime_integration_complete, false);
assert.deepEqual(doc.remaining_open_gaps, ['L2-GAP-004', 'L2-GAP-005', 'L2-GAP-006']);

assert.equal(doc.readiness_state.custody_event_contract_created, true);
assert.equal(doc.readiness_state.custody_event_validator_created, true);
assert.equal(doc.readiness_state.custody_runtime_integration_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.next_required_program, 'PROG-046-V3-5-R1-HUMAN-DECISION-PROFILE-CONTRACT');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.trusted_time_certification, false);
assert.equal(doc.non_claims.legal_chain_of_custody, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);

assert.match(md, /A hash does not prove identity, trusted time or legal authenticity/);
assert.match(md, /Broken custody does not erase the artifact/);
assert.match(md, /B2G-T32 through B2G-T35/);
assert.match(md, /PROG-046-V3-5-R1-HUMAN-DECISION-PROFILE-CONTRACT/);

console.log('PASS PROG-045-V3-5-R1-CUSTODY-EVENT-DOCS-EXIST');
console.log('PASS PROG-045-V3-5-R1-CUSTODY-EVENT-HASH-STABLE');
console.log('PASS PROG-045-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-045-V3-5-R1-SOURCE-QUALIFICATION-INTEGRITY-VALID');
console.log('PASS PROG-045-V3-5-R1-B2G-T32-T35-GUARDS-RECORDED');
console.log('PASS PROG-045-V3-5-R1-VALIDATOR-FAILS-CLOSED');
console.log('PASS PROG-045-V3-5-R1-HASH-NOT-IDENTITY-TIME-OR-LEGAL-AUTHENTICITY');
console.log('PASS PROG-045-V3-5-R1-L2-GAP-003-CLOSED-CONTRACT-ONLY');
console.log('PASS PROG-045-V3-5-R1-NEXT-PROG-046-RECORDED');
console.log('PASS PROG-045-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
