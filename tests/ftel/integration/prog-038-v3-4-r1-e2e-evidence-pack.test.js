'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { buildEvidencePack } = require('../../../runtime/evidence/build-v3-4-r1-e2e-evidence-pack.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-pack.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-pack.md';
const runtimePath = 'runtime/evidence/build-v3-4-r1-e2e-evidence-pack.js';
const closurePath = 'docs/launch/level1/v3-4-r1/v3-4-r1-build-assurance-closure-snapshot.json';
const gapRegisterPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-gap-register.json';

for (const p of [docPath, mdPath, runtimePath, closurePath, gapRegisterPath]) {
  assert.equal(exists(p), true, `${p} must exist`);
}

const doc = json(docPath);
const md = read(mdPath);
const closure = json(closurePath);
const gapRegister = json(gapRegisterPath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-E2E-EVIDENCE-PACK-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_E2E_EVIDENCE_PACK');
assert.equal(doc.issue_id, 'PROG-038');
assert.equal(doc.status, 'E2E_EVIDENCE_PACK_CREATED_REVIEW_REQUIRED');
assert.equal(doc.source_closure_snapshot_revision_hash, closure.revision_hash);
assert.equal(doc.source_e2e_gap_register_revision_hash, gapRegister.revision_hash);

const regenerated = buildEvidencePack({
  rootDir: root,
  repositoryCommit: doc.repository_baseline_commit
});
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.evidence_traces.length, 4);
assert.equal(doc.gap_coverage.length, 7);

const byGap = Object.fromEntries(doc.gap_coverage.map((g) => [g.gap_id, g]));
assert.equal(byGap['E2E-GAP-001'].coverage_status, 'EVIDENCE_ATTACHED');
assert.equal(byGap['E2E-GAP-002'].coverage_status, 'FAIL_CLOSED_EVIDENCE_ATTACHED');
assert.equal(byGap['E2E-GAP-003'].coverage_status, 'EVIDENCE_ATTACHED');
assert.equal(byGap['E2E-GAP-004'].coverage_status, 'EVIDENCE_ATTACHED');
assert.equal(byGap['E2E-GAP-005'].coverage_status, 'INTEGRITY_SNAPSHOT_ATTACHED');
assert.equal(byGap['E2E-GAP-006'].coverage_status, 'BOUNDARY_RECORDED_EXTERNAL_VALIDATION_NOT_COMPLETE');
assert.equal(byGap['E2E-GAP-007'].coverage_status, 'BOUNDARY_RECORDED_PILOT_ACCESS_BLOCKED');

const traces = Object.fromEntries(doc.evidence_traces.map((t) => [t.gap_id, t]));
assert.equal(traces['E2E-GAP-001'].producer_binding_result, 'PRODUCER_BINDING_ALLOWED');
assert.equal(traces['E2E-GAP-001'].allowed, true);
assert.equal(traces['E2E-GAP-002'].producer_binding_result, 'PRODUCER_NOT_REGISTERED');
assert.equal(traces['E2E-GAP-002'].allowed, false);
assert.equal(traces['E2E-GAP-003'].recovery_result, 'NEW_RUN_ACCEPTED');
assert.equal(traces['E2E-GAP-003'].recovery_invariant, 'PRIOR_FAILED_PRESERVED');
assert.equal(traces['E2E-GAP-004'].contract_result, 'CONTRACT_TRANSITION_ALLOWED');

assert.equal(doc.schema_consistency_evidence.combination_result, 'SCHEMA_CLASSIFICATION_VALID');
assert.equal(doc.schema_consistency_evidence.nested_token_result, 'TOKEN_SHAPE_INVALID');
assert.equal(doc.schema_consistency_evidence.canonical_token_result, 'TOKEN_SHAPE_VALID');

assert.equal(doc.integrity_snapshot.trace_count, 4);
assert.equal(doc.integrity_snapshot.gap_coverage_count, 7);
assert.equal(doc.integrity_snapshot.hash_algorithm, 'sha256-canonical-json');

assert.equal(doc.readiness_interpretation.evidence_pack_created, true);
assert.equal(doc.readiness_interpretation.build_assurance_block_closed, true);
assert.equal(doc.readiness_interpretation.e2e_evidence_review_required, true);
assert.equal(doc.readiness_interpretation.external_validation_complete, false);
assert.equal(doc.readiness_interpretation.pilot_access_available, false);
assert.equal(doc.readiness_interpretation.release_candidate_ready, false);
assert.equal(doc.readiness_interpretation.production_ready, false);
assert.equal(doc.readiness_interpretation.customer_acceptance_available, false);
assert.equal(doc.readiness_interpretation.next_required_program, 'PROG-039-RC-GATE-EVALUATION');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.pilot_access_available, false);
assert.equal(doc.non_claims.customer_acceptance, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.commercial_claim_complete, false);
assert.equal(doc.non_claims.automatic_release_authorization, false);

assert.match(md, /governed-operation, fail-closed, recovery-continuation and contract-control traces/);
assert.match(md, /does not claim release candidate readiness/);
assert.match(md, /PROG-039-RC-GATE-EVALUATION/);

console.log('PASS PROG-038-V3-4-R1-E2E-PACK-DOCS-EXIST');
console.log('PASS PROG-038-V3-4-R1-E2E-PACK-HASH-STABLE');
console.log('PASS PROG-038-V3-4-R1-E2E-PACK-BUILDER-STABLE');
console.log('PASS PROG-038-V3-4-R1-GOVERNED-OPERATION-TRACE');
console.log('PASS PROG-038-V3-4-R1-FAIL-CLOSED-NEGATIVE-TRACE');
console.log('PASS PROG-038-V3-4-R1-RECOVERY-CONTINUATION-TRACE');
console.log('PASS PROG-038-V3-4-R1-CONTRACT-CONTROL-TRACE');
console.log('PASS PROG-038-V3-4-R1-INTEGRITY-SNAPSHOT');
console.log('PASS PROG-038-V3-4-R1-EXTERNAL-VALIDATION-BOUNDARY');
console.log('PASS PROG-038-V3-4-R1-PILOT-ACCESS-BOUNDARY');
console.log('PASS PROG-038-V3-4-R1-NEXT-PROG-039-RECORDED');
console.log('PASS PROG-038-V3-4-R1-NO-RC-OR-PRODUCTION-CLAIM');
