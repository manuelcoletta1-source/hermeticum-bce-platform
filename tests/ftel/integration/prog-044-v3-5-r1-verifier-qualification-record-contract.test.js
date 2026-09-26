'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  QUALIFICATION_CLASSES,
  validateVerifierQualificationRecord,
  sampleRecord,
  buildContract
} = require('../../../runtime/b2g/build-v3-5-r1-verifier-qualification-record-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-verifier-qualification-record-contract.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-verifier-qualification-record-contract.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-verifier-qualification-record-contract.js';
const registryPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-producer-registry-baseline.json';

for (const p of [docPath, mdPath, runtimePath, registryPath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const registry = json(registryPath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-VERIFIER-QUALIFICATION-RECORD-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_VERIFIER_QUALIFICATION_RECORD_CONTRACT');
assert.equal(doc.issue_id, 'PROG-044');
assert.equal(doc.priority, 'V3.5-R1-VERIFIER-QUALIFICATION-RECORD-CONTRACT');
assert.equal(doc.source_level2_producer_registry_revision_hash, registry.revision_hash);
assert.equal(doc.source_level2_producer_registry_revision_hash_valid, true);

const regenerated = buildContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.governing_producer, 'PRODUCER::VERIFIER_QUALIFICATION_CONTROL');
assert.equal(doc.assurance_verdict_producer, 'PRODUCER::QUALIFIED_VERIFIER');
assert.equal(doc.invariant.internal_qualification_is_not_public_accreditation, true);
assert.equal(doc.invariant.qualification_record_does_not_emit_assurance_verdict, true);
assert.equal(doc.invariant.assurance_proven_requires_active_scope_matched_qualification, true);
assert.deepEqual(doc.allowed_qualification_classes, QUALIFICATION_CLASSES);

const vectorById = Object.fromEntries(doc.runtime_guard_vectors.map((v) => [v.vector_id, v]));
assert.equal(vectorById['B2G-T26'].result.code, 'VERIFIER_NOT_QUALIFIED');
assert.equal(vectorById['B2G-T27'].result.code, 'QUALIFICATION_SCOPE_MISMATCH');
assert.equal(vectorById['B2G-T28'].result.code, 'QUALIFICATION_EXPIRED');
assert.equal(vectorById['B2G-T29'].result.code, 'QUALIFICATION_REVOKED');
assert.equal(vectorById['B2G-T30'].result.code, 'QUALIFICATION_INDEPENDENCE_INVALID');
assert.equal(vectorById['B2G-T31'].result.code, 'ACCREDITATION_CLAIM_UNSUPPORTED');
assert.equal(vectorById['B2G-POS-001'].result.code, 'QUALIFICATION_ACTIVE_SCOPE_MATCHED');
assert.equal(vectorById['B2G-POS-001'].result.valid, true);
assert.equal(vectorById['B2G-POS-001'].result.produces_assurance_verdict, false);
assert.equal(vectorById['B2G-POS-001'].result.creates_public_authority, false);

const request = {
  property: 'ASSURANCE::TECHNICAL_PROPERTY',
  evidence_class: 'EVIDENCE::CHAINED_RUNTIME_ARTIFACT',
  ruleset_family: 'HBCE_B2G_V3_5_R1',
  environment: 'NON_CLASSIFIED_DEMONSTRATOR',
  independence_required: true,
  now: '2026-09-26T00:00:00.000Z'
};

assert.equal(validateVerifierQualificationRecord(sampleRecord(), request).valid, true);
assert.equal(validateVerifierQualificationRecord(sampleRecord({ verifier_id: '' }), request).code, 'VERIFIER_IDENTITY_INVALID');
assert.equal(validateVerifierQualificationRecord(sampleRecord({ qualification_class: 'MAGIC' }), request).code, 'QUALIFICATION_CLASS_INVALID');
assert.equal(validateVerifierQualificationRecord(sampleRecord({ qualification_evidence_ref: '' }), request).code, 'VERIFIER_NOT_QUALIFIED');

assert.equal(doc.closed_gap.gap_id, 'L2-GAP-002');
assert.equal(doc.closed_gap.status, 'CLOSED_CONTRACT_AND_VALIDATOR_BASELINE');
assert.equal(doc.closed_gap.assurance_transition_integration_complete, false);
assert.deepEqual(doc.remaining_open_gaps, ['L2-GAP-003', 'L2-GAP-004', 'L2-GAP-005', 'L2-GAP-006']);

assert.equal(doc.readiness_state.verifier_qualification_contract_created, true);
assert.equal(doc.readiness_state.verifier_qualification_validator_created, true);
assert.equal(doc.readiness_state.assurance_transition_integration_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.next_required_program, 'PROG-045-V3-5-R1-CUSTODY-EVENT-RECORD-CONTRACT');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);

assert.match(md, /Qualified means scope-bound/);
assert.match(md, /Internal technical qualification is not external\/public accreditation/);
assert.match(md, /B2G-T26 through B2G-T31/);
assert.match(md, /PROG-045-V3-5-R1-CUSTODY-EVENT-RECORD-CONTRACT/);

console.log('PASS PROG-044-V3-5-R1-VERIFIER-QUALIFICATION-DOCS-EXIST');
console.log('PASS PROG-044-V3-5-R1-VERIFIER-QUALIFICATION-HASH-STABLE');
console.log('PASS PROG-044-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-044-V3-5-R1-SOURCE-REGISTRY-INTEGRITY-VALID');
console.log('PASS PROG-044-V3-5-R1-B2G-T26-T31-GUARDS-RECORDED');
console.log('PASS PROG-044-V3-5-R1-VALIDATOR-FAILS-CLOSED');
console.log('PASS PROG-044-V3-5-R1-INTERNAL-QUALIFICATION-NOT-PUBLIC-ACCREDITATION');
console.log('PASS PROG-044-V3-5-R1-L2-GAP-002-CLOSED-CONTRACT-ONLY');
console.log('PASS PROG-044-V3-5-R1-NEXT-PROG-045-RECORDED');
console.log('PASS PROG-044-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
