'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  buildRuntimeVectors,
  buildPositiveIntegrationVector,
  buildHarness
} = require('../../../runtime/b2g/build-v3-5-r1-b2g-t26-t43-runtime-harness.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-b2g-t26-t43-runtime-harness.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-b2g-t26-t43-runtime-harness.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-b2g-t26-t43-runtime-harness.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-adapter-provenance-profile-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-B2G-T26-T43-RUNTIME-HARNESS-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_B2G_T26_T43_RUNTIME_HARNESS');
assert.equal(doc.issue_id, 'PROG-048');
assert.equal(doc.priority, 'V3.5-R1-B2G-T26-T43-RUNTIME-HARNESS');
assert.equal(doc.source_adapter_provenance_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_adapter_provenance_contract_revision_hash_valid, true);

const regenerated = buildHarness({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.deepEqual(doc.integrated_contracts, [
  'PROG-044-VERIFIER-QUALIFICATION-RECORD-CONTRACT',
  'PROG-045-CUSTODY-EVENT-RECORD-CONTRACT',
  'PROG-046-HUMAN-DECISION-PROFILE-CONTRACT',
  'PROG-047-ADAPTER-PROVENANCE-PROFILE-CONTRACT'
]);

assert.equal(doc.harness_scope.first_vector, 'B2G-T26');
assert.equal(doc.harness_scope.last_vector, 'B2G-T43');
assert.equal(doc.harness_scope.vector_count, 18);
assert.equal(doc.harness_scope.expected_vector_count, 18);
assert.equal(doc.harness_scope.all_required_vectors_present, true);
assert.equal(doc.harness_scope.all_required_vectors_passed, true);

const vectors = buildRuntimeVectors();
assert.equal(vectors.length, 18);
assert.equal(vectors[0].vector_id, 'B2G-T26');
assert.equal(vectors[17].vector_id, 'B2G-T43');
assert.equal(vectors.every((v) => v.passed === true), true);
assert.deepEqual(vectors, doc.runtime_guard_vectors);

const expectedCodes = {
  'B2G-T26': 'VERIFIER_NOT_QUALIFIED',
  'B2G-T27': 'QUALIFICATION_SCOPE_MISMATCH',
  'B2G-T28': 'QUALIFICATION_EXPIRED',
  'B2G-T29': 'QUALIFICATION_REVOKED',
  'B2G-T30': 'QUALIFICATION_INDEPENDENCE_INVALID',
  'B2G-T31': 'ACCREDITATION_CLAIM_UNSUPPORTED',
  'B2G-T32': 'CHAIN_OF_CUSTODY_BROKEN',
  'B2G-T33': 'TIME_PROVENANCE_INCOMPLETE',
  'B2G-T34': 'SIGNATURE_OR_SEAL_CLAIM_UNSUPPORTED',
  'B2G-T35': 'EVIDENCE_SEAL_INVALID',
  'B2G-T36': 'HUMAN_DECISION_MISSING',
  'B2G-T37': 'HUMAN_DECISION_NOT_APPROVED',
  'B2G-T38': 'MATERIAL_CHANGE_REQUIRES_NEW_DECISION',
  'B2G-T39': 'ACTION_BINDING_INVALID',
  'B2G-T40': 'ADAPTER_SOURCE_TARGET_INVALID',
  'B2G-T41': 'ADAPTER_PROVENANCE_INCOMPLETE',
  'B2G-T42': 'ADAPTER_TRANSFORMATION_NOT_ALLOWED',
  'B2G-T43': 'SOURCE_OF_TRUTH_REPLACEMENT_DENIED'
};

for (const vector of doc.runtime_guard_vectors) {
  assert.equal(vector.expected_code, expectedCodes[vector.vector_id], `${vector.vector_id} expected code`);
  assert.equal(vector.result.code, expectedCodes[vector.vector_id], `${vector.vector_id} actual code`);
  assert.equal(vector.result.valid, false, `${vector.vector_id} must fail closed`);
  assert.equal(vector.passed, true, `${vector.vector_id} must pass harness assertion`);
}

const positive = buildPositiveIntegrationVector();
assert.deepEqual(positive, doc.positive_integration_vector);
assert.equal(positive.passed, true);
assert.equal(positive.creates_b2g_candidate_readiness, false);
assert.equal(positive.creates_public_authority, false);
assert.equal(positive.creates_legal_validity, false);
assert.equal(positive.creates_production_readiness, false);

assert.equal(doc.integrated_invariants.verifier_not_qualified_blocks_assurance_transition, true);
assert.equal(doc.integrated_invariants.custody_break_limits_evidentiary_claim, true);
assert.equal(doc.integrated_invariants.stale_or_replayed_human_decision_blocks_authorization, true);
assert.equal(doc.integrated_invariants.adapter_without_provenance_cannot_mutate_or_export_claims, true);
assert.equal(doc.integrated_invariants.no_contract_can_create_public_authority_by_inference, true);

assert.equal(doc.closed_gap.gap_id, 'L2-GAP-006');
assert.equal(doc.closed_gap.status, 'CLOSED_RUNTIME_HARNESS_BASELINE');
assert.equal(doc.closed_gap.b2g_t26_t43_harness_complete, true);
assert.deepEqual(doc.remaining_open_gaps, []);

assert.equal(doc.readiness_state.b2g_t26_t43_harness_complete, true);
assert.equal(doc.readiness_state.level2_contract_gap_set_closed, true);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.pilot_readiness_gate_complete, false);
assert.equal(doc.next_required_program, 'PROG-049-V3-5-R1-LEVEL2-READINESS-GATE-EVALUATION');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.public_authority_created, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /B2G-T26 through B2G-T43/);
assert.match(md, /positive integration vector proves only/);
assert.match(md, /closes L2-GAP-006/);
assert.match(md, /PROG-049-V3-5-R1-LEVEL2-READINESS-GATE-EVALUATION/);

console.log('PASS PROG-048-V3-5-R1-B2G-T26-T43-HARNESS-DOCS-EXIST');
console.log('PASS PROG-048-V3-5-R1-B2G-T26-T43-HARNESS-HASH-STABLE');
console.log('PASS PROG-048-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-048-V3-5-R1-SOURCE-ADAPTER-INTEGRITY-VALID');
console.log('PASS PROG-048-V3-5-R1-ALL-T26-T43-VECTORS-PRESENT');
console.log('PASS PROG-048-V3-5-R1-ALL-T26-T43-VECTORS-FAIL-CLOSED-AS-EXPECTED');
console.log('PASS PROG-048-V3-5-R1-POSITIVE-INTEGRATION-LOCAL-VALIDATORS-ONLY');
console.log('PASS PROG-048-V3-5-R1-L2-GAP-006-CLOSED-RUNTIME-HARNESS-BASELINE');
console.log('PASS PROG-048-V3-5-R1-NEXT-PROG-049-RECORDED');
console.log('PASS PROG-048-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
