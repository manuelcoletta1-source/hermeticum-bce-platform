'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { RESULTS, evaluateRcGate } = require('../../../runtime/gates/evaluate-v3-4-r1-rc-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-rc-gate-evaluation.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-rc-gate-evaluation.md';
const runtimePath = 'runtime/gates/evaluate-v3-4-r1-rc-gate.js';
const closurePath = 'docs/launch/level1/v3-4-r1/v3-4-r1-build-assurance-closure-snapshot.json';
const gapRegisterPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-gap-register.json';
const evidencePackPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-pack.json';

for (const p of [docPath, mdPath, runtimePath, closurePath, gapRegisterPath, evidencePackPath]) {
  assert.equal(exists(p), true, `${p} must exist`);
}

const doc = json(docPath);
const md = read(mdPath);
const closure = json(closurePath);
const gapRegister = json(gapRegisterPath);
const evidencePack = json(evidencePackPath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-RC-GATE-EVALUATION-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_RC_GATE_EVALUATION');
assert.equal(doc.issue_id, 'PROG-039');
assert.equal(doc.result, RESULTS.RC_GATE_BLOCKED);
assert.equal(doc.rc_gate_passed, false);
assert.equal(doc.rc_gate_blocked, true);

assert.equal(doc.source_closure_snapshot_revision_hash, closure.revision_hash);
assert.equal(doc.source_e2e_gap_register_revision_hash, gapRegister.revision_hash);
assert.equal(doc.source_e2e_evidence_pack_revision_hash, evidencePack.revision_hash);

const regenerated = evaluateRcGate({
  rootDir: root,
  repositoryCommit: doc.repository_baseline_commit
});
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.integrity_checks.length, 3);
for (const check of doc.integrity_checks) {
  assert.equal(check.revision_hash_valid, true);
}

assert.equal(doc.evaluated_conditions.build_assurance_block_closed, true);
assert.equal(doc.evaluated_conditions.t217_t225_chain_closed, true);
assert.equal(doc.evaluated_conditions.e2e_evidence_pack_created, true);
assert.equal(doc.evaluated_conditions.e2e_evidence_review_required, true);
assert.equal(doc.evaluated_conditions.external_validation_complete, false);
assert.equal(doc.evaluated_conditions.pilot_access_available, false);
assert.equal(doc.evaluated_conditions.release_candidate_ready, false);
assert.equal(doc.evaluated_conditions.production_ready, false);

assert.equal(doc.blocking_reasons.some((r) => r.reason === 'E2E_EVIDENCE_REVIEW_REQUIRED'), true);
assert.equal(doc.blocking_reasons.some((r) => r.reason === 'EXTERNAL_VALIDATION_NOT_COMPLETE'), true);
assert.equal(doc.blocking_reasons.some((r) => r.reason === 'PILOT_CUSTOMER_ACCESS_BLOCKED'), true);
assert.equal(doc.blocking_reasons.some((r) => r.reason === 'EXTERNAL_VALIDATION_BOUNDARY_NOT_BLOCKING'), false);
assert.equal(doc.blocking_reasons.some((r) => r.reason === 'PILOT_CUSTOMER_BOUNDARY_NOT_BLOCKING'), false);
assert.equal(doc.blocking_reasons.some((r) => r.reason === 'E2E_REVIEW_REQUIREMENT_MISSING'), false);

assert.equal(doc.blocking_reasons.some((r) => r.reason === 'E2E_PACK_STATUS_INVALID'), false);
assert.equal(doc.next_required_program, 'PROG-040-EVIDENCE-REVIEW-AND-EXTERNAL-VALIDATION');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.pilot_access_available, false);
assert.equal(doc.non_claims.customer_acceptance, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.automatic_release_authorization, false);

assert.match(md, /Result: RC_GATE_BLOCKED/);
assert.match(md, /evidence review, external validation and pilot\/customer access boundaries remain unresolved/);
assert.match(md, /does not claim release candidate readiness/);
assert.match(md, /PROG-040-EVIDENCE-REVIEW-AND-EXTERNAL-VALIDATION/);

console.log('PASS PROG-039-V3-4-R1-RC-GATE-DOCS-EXIST');
console.log('PASS PROG-039-V3-4-R1-RC-GATE-HASH-STABLE');
console.log('PASS PROG-039-V3-4-R1-RC-GATE-BUILDER-STABLE');
console.log('PASS PROG-039-V3-4-R1-SOURCE-INTEGRITY-VALID');
console.log('PASS PROG-039-V3-4-R1-BUILD-ASSURANCE-CLOSED');
console.log('PASS PROG-039-V3-4-R1-E2E-PACK-PRESENT');
console.log('PASS PROG-039-V3-4-R1-RC-GATE-BLOCKED');
console.log('PASS PROG-039-V3-4-R1-EXTERNAL-VALIDATION-NOT-COMPLETE');
console.log('PASS PROG-039-V3-4-R1-PILOT-ACCESS-NOT-AVAILABLE');
console.log('PASS PROG-039-V3-4-R1-NEXT-PROG-040-RECORDED');
console.log('PASS PROG-039-V3-4-R1-NO-RC-OR-PRODUCTION-CLAIM');
