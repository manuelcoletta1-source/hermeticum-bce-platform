'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const repoRoot = path.resolve(__dirname, '../../..');

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function assertPathExists(relativePath) {
  assert.equal(existsRelative(relativePath), true, `${relativePath} must exist`);
}

const profilePath = 'docs/launch/level1/v2-055-pilot-slice-profile.json';
const matrixPath = 'docs/launch/level1/v2-055-matrix-registry.json';
const mdPath = 'docs/launch/level1/v2-055-pilot-slice-matrix-registry.md';

assertPathExists(profilePath);
assertPathExists(matrixPath);
assertPathExists(mdPath);

const profile = readJson(profilePath);
const matrix = readJson(matrixPath);
const md = readText(mdPath);

assert.equal(profile.proto, 'HBCE-P0-V2-055-PILOT-SLICE-PROFILE-v1');
assert.equal(profile.kind, 'HBCE_P0_V2_055_PILOT_SLICE_PROFILE');
assert.equal(profile.specification_baseline, 'V2.8 - 25 September 2026');
assert.equal(profile.issue_id, 'V2-055');
assert.equal(profile.priority, 'P0');
assert.equal(profile.status, 'INITIALIZED_NOT_READY');
assert.equal(profile.readiness_status, 'BLOCKED');

assert.equal(matrix.proto, 'HBCE-P0-V2-055-MATRIX-REGISTRY-v1');
assert.equal(matrix.kind, 'HBCE_P0_V2_055_MATRIX_REGISTRY');
assert.equal(matrix.specification_baseline, 'V2.8 - 25 September 2026');
assert.equal(matrix.issue_id, 'V2-055');
assert.equal(matrix.priority, 'P0');
assert.equal(matrix.status, 'INITIALIZED_BLOCKED');
assert.equal(matrix.readiness_status, 'BLOCKED');

const matrixBody = { ...matrix };
delete matrixBody.registry_hash;
assert.equal(matrix.registry_hash, sha256Digest(matrixBody));

const profileBody = { ...profile };
delete profileBody.profile_hash;
assert.equal(profile.profile_hash, sha256Digest(profileBody));
assert.equal(profile.matrix_registry_hash, matrix.registry_hash);

assert.equal(Array.isArray(matrix.mandatory_tests), true);
assert.equal(matrix.mandatory_tests.length, 28);
assert.equal(matrix.mandatory_tests[0], 'T113');
assert.equal(matrix.mandatory_tests[27], 'T140');

assert.equal(Array.isArray(profile.minimum_pilot_slice), true);
assert.equal(profile.minimum_pilot_slice.length >= 11, true);

for (const capability of [
  'JOKER activation + alias',
  'PRE_AUTH boundary + authentication transition',
  'Turn commitments',
  'Proposal + ConfirmationView + human confirmation',
  'Core authority/policy/precommit/dispatch/evidence',
  'Offline verifier',
  'One controlled target + one mutable action',
  'Witness W1/W2'
]) {
  assert.equal(
    profile.minimum_pilot_slice.some((item) => item.capability === capability),
    true,
    `${capability} must be in minimum pilot slice`
  );
}

assert.equal(Array.isArray(matrix.claim_rows), true);
assert.equal(matrix.claim_rows.length >= 10, true);

for (const row of matrix.claim_rows) {
  assert.equal(typeof row.matrix_row_id, 'string');
  assert.equal(typeof row.claim_id, 'string');
  assert.equal(typeof row.claim_text, 'string');
  assert.equal(Array.isArray(row.requirement_refs), true);
  assert.equal(row.requirement_refs.length > 0, true);
  assert.equal(typeof row.gate, 'string');
  assert.equal(Array.isArray(row.test_refs), true);
  assert.equal(row.test_refs.length > 0, true);
  assert.equal(typeof row.owner_ref, 'string');
  assert.equal(typeof row.owner_status, 'string');
  assert.equal(Array.isArray(row.evidence_refs), true);
  assert.equal(Array.isArray(row.blockers), true);
  assert.equal(typeof row.fallback_descope, 'string');
  assert.equal(typeof row.status, 'string');
}

const claimIds = matrix.claim_rows.map((row) => row.claim_id);
for (const requiredClaim of [
  'CLAIM-JC2-ACTIVATION-ALIAS',
  'CLAIM-PREAUTH-BOUNDARY',
  'CLAIM-PROPOSAL-CONFIRMATION',
  'CLAIM-CORE-GOVERNANCE',
  'CLAIM-OFFLINE-VERIFIER',
  'CLAIM-CONTROLLED-TARGET-MUTABLE-ACTION',
  'CLAIM-WITNESS-W1-W2',
  'CLAIM-REVIEWER-CRITICAL-PATH',
  'CLAIM-NORMATIVE-DEPENDENCY-MATRIX',
  'CLAIM-MATRIX-COMPLETENESS'
]) {
  assert.equal(claimIds.includes(requiredClaim), true, `${requiredClaim} must be mapped`);
}

assert.equal(matrix.claim_rows.some((row) => row.test_refs.includes('T113')), true);
assert.equal(matrix.claim_rows.some((row) => row.test_refs.includes('T140')), true);
assert.equal(matrix.claim_rows.some((row) => row.test_refs.includes('T132')), true);
assert.equal(matrix.claim_rows.some((row) => row.test_refs.includes('T124')), true);

const p0Rows = matrix.claim_rows.filter((row) => row.priority.includes('P0'));
assert.equal(p0Rows.length > 0, true);
assert.equal(p0Rows.some((row) => row.status === 'BLOCKED'), true);
assert.equal(p0Rows.every((row) => row.status !== 'PROVEN'), true);

assert.equal(
  matrix.claim_rows.some((row) => row.owner_ref === 'DA_NOMINARE'),
  true
);
assert.equal(
  matrix.claim_rows.some((row) => row.blockers.includes('OWNER_NOT_NOMINATED')),
  true
);
assert.equal(
  matrix.claim_rows.some((row) => row.fallback_descope.includes('DEMO_ONLY')),
  true
);

assert.equal(profile.g0_ready, false);
assert.equal(profile.g1_ready, false);
assert.equal(profile.g2_ready, false);
assert.equal(profile.g5_ready, false);
assert.equal(profile.gate_claimed, false);
assert.equal(profile.non_claims.g2_pilot_candidate, false);
assert.equal(profile.non_claims.g5_pilot_start_ready, false);
assert.equal(profile.non_claims.real_pilot_ready, false);
assert.equal(profile.non_claims.production_ready, false);
assert.equal(profile.non_claims.reviewer_ready, false);
assert.equal(profile.non_claims.witness_ready, false);
assert.equal(profile.non_claims.target_ready, false);

assert.equal(matrix.g0_ready, false);
assert.equal(matrix.g1_ready, false);
assert.equal(matrix.g2_ready, false);
assert.equal(matrix.g5_ready, false);
assert.equal(matrix.gate_claimed, false);
assert.equal(matrix.non_claims.all_matrix_rows_proven, false);

assert.match(md, /V2-055 PilotSliceProfile and MATRIX Registry/);
assert.match(md, /claim -> requirement -> gate -> test -> owner -> evidence -> descope/);
assert.match(md, /INITIALIZED_NOT_READY \/ BLOCKED/);
assert.match(md, /T113-T140/);
assert.match(md, /NOT_IMPLEMENTED/);
assert.match(md, /G2 PILOT_CANDIDATE/);
assert.match(md, /G5 PILOT_START_READY/);
assert.match(md, /real pilot readiness/);
assert.match(md, /Business status does not override technical readiness/);

console.log('PASS PROG-020-V2-055-DOCS-EXIST');
console.log('PASS PROG-020-V2-055-HASHES-STABLE');
console.log('PASS PROG-020-V2-055-MINIMUM-PILOT-SLICE-RECORDED');
console.log('PASS PROG-020-V2-055-MATRIX-ROWS-STRUCTURED');
console.log('PASS PROG-020-V2-055-T113-T140-RECORDED');
console.log('PASS PROG-020-V2-055-BLOCKERS-EXPOSED');
console.log('PASS PROG-020-V2-055-NO-PILOT-CLAIM');
