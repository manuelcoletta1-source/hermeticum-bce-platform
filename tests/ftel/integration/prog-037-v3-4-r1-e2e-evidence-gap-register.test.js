'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-gap-register.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-e2e-evidence-gap-register.md';
const closurePath = 'docs/launch/level1/v3-4-r1/v3-4-r1-build-assurance-closure-snapshot.json';

for (const p of [docPath, mdPath, closurePath]) {
  assert.equal(exists(p), true, `${p} must exist`);
}

const doc = json(docPath);
const md = read(mdPath);
const closure = json(closurePath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-E2E-EVIDENCE-GAP-REGISTER-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_E2E_EVIDENCE_GAP_REGISTER');
assert.equal(doc.issue_id, 'PROG-037');
assert.equal(doc.source_closure_snapshot_revision_hash, closure.revision_hash);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.closed_build_assurance_artifacts.length, 5);
assert.deepEqual(
  doc.closed_build_assurance_artifacts.map((a) => a.issue_id),
  ['PROG-032', 'PROG-033', 'PROG-034', 'PROG-035', 'PROG-036']
);

for (const artifact of doc.closed_build_assurance_artifacts) {
  assert.equal(exists(artifact.path), true, `${artifact.path} must exist`);
  assert.equal(json(artifact.path).revision_hash, artifact.revision_hash);
  assert.equal(artifact.present, true);
}

assert.equal(doc.current_closed_chain.t217_t225_chain_closed, true);
assert.equal(doc.readiness_interpretation.build_assurance_block_closed, true);
assert.equal(doc.readiness_interpretation.e2e_evidence_complete, false);
assert.equal(doc.readiness_interpretation.release_candidate_ready, false);
assert.equal(doc.readiness_interpretation.production_ready, false);
assert.equal(doc.readiness_interpretation.pilot_access_available, false);
assert.equal(doc.readiness_interpretation.customer_acceptance_available, false);
assert.equal(doc.readiness_interpretation.next_required_program, 'PROG-038-E2E-EVIDENCE-PACK');

assert.equal(doc.required_e2e_evidence_before_rc.length, 7);
assert.deepEqual(
  doc.required_e2e_evidence_before_rc.map((g) => g.gap_id),
  ['E2E-GAP-001', 'E2E-GAP-002', 'E2E-GAP-003', 'E2E-GAP-004', 'E2E-GAP-005', 'E2E-GAP-006', 'E2E-GAP-007']
);

for (const gap of doc.required_e2e_evidence_before_rc) {
  assert.equal(gap.blocking, true);
  assert.equal(gap.status, 'OPEN');
}

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.pilot_access_available, false);
assert.equal(doc.non_claims.customer_acceptance, false);
assert.equal(doc.non_claims.full_e2e_evidence_complete, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.commercial_claim_complete, false);

assert.match(md, /T217-T225 build-assurance chain is closed/);
assert.match(md, /Release-candidate readiness remains blocked/);
assert.match(md, /misread as a release candidate/);

console.log('PASS PROG-037-V3-4-R1-E2E-GAP-DOCS-EXIST');
console.log('PASS PROG-037-V3-4-R1-E2E-GAP-HASH-STABLE');
console.log('PASS PROG-037-V3-4-R1-CLOSED-ARTIFACTS-BOUND');
console.log('PASS PROG-037-V3-4-R1-SEVEN-BLOCKING-GAPS-OPEN');
console.log('PASS PROG-037-V3-4-R1-NEXT-PROG-038-RECORDED');
console.log('PASS PROG-037-V3-4-R1-RC-REMAINS-BLOCKED');
console.log('PASS PROG-037-V3-4-R1-NO-PRODUCTION-OR-PILOT-CLAIM');
