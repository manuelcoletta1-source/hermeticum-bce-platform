'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { buildLevel2TrackBaseline } = require('../../../runtime/b2g/build-v3-5-r1-level2-track-baseline.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-track-baseline.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-track-baseline.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-level2-track-baseline.js';

for (const p of [docPath, mdPath, runtimePath]) {
  assert.equal(exists(p), true, `${p} must exist`);
}

const doc = json(docPath);
const md = read(mdPath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-TRACK-BASELINE-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_TRACK_BASELINE');
assert.equal(doc.issue_id, 'PROG-042');
assert.equal(doc.source_document.status, 'CONTROLLED_CORRECTIVE_REVISION_INTERNAL_LEVEL_2_ARCHITECTURE_PRE_MARKET');

const regenerated = buildLevel2TrackBaseline({
  rootDir: root,
  repositoryCommit: doc.repository_baseline_commit
});
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.level1_relationship.level1_b2b_remains_core_operational_target, true);
assert.equal(doc.level1_relationship.level1_target_date, '2027-01-19');
assert.equal(doc.level1_relationship.level2_is_distinct_b2g_readiness_track, true);
assert.equal(doc.level1_relationship.level2_does_not_replace_level1, true);
assert.equal(doc.level1_relationship.level2_does_not_modify_level1_release_target, true);

assert.equal(doc.canonical_level2_claim.joker_c2_public_authority, false);
assert.equal(doc.inherited_level1_invariants.includes('no_model_authority'), true);
assert.equal(doc.inherited_level1_invariants.includes('producer_binding'), true);

assert.deepEqual(doc.level2_programming_priorities, [
  'VerifierQualificationRecord',
  'CustodyEventRecord',
  'HumanDecisionProfile',
  'AdapterProvenanceProfile',
  'B2G_T26_T43_runtime_harness'
]);

assert.equal(doc.initial_gap_register.length, 6);
for (const gap of doc.initial_gap_register) {
  assert.equal(gap.status, 'OPEN');
}

assert.equal(doc.readiness_state.level2_track_created, true);
assert.equal(doc.readiness_state.level2_runtime_implemented, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.public_accreditation_available, false);
assert.equal(doc.readiness_state.procurement_eligibility_claimed, false);
assert.equal(doc.readiness_state.external_public_endorsement_claimed, false);
assert.equal(doc.readiness_state.classified_defence_scope_included, false);

assert.equal(doc.next_required_program, 'PROG-043-V3-5-R1-LEVEL2-PRODUCER-REGISTRY-BASELINE');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.classified_defence_readiness, false);
assert.equal(doc.non_claims.external_validation_complete, false);

assert.match(md, /does not replace the Level 1 B2B core/);
assert.match(md, /does not claim B2G candidate readiness/);
assert.match(md, /VerifierQualificationRecord/);
assert.match(md, /CustodyEventRecord/);
assert.match(md, /HumanDecisionProfile/);
assert.match(md, /AdapterProvenanceProfile/);
assert.match(md, /PROG-043-V3-5-R1-LEVEL2-PRODUCER-REGISTRY-BASELINE/);

console.log('PASS PROG-042-V3-5-R1-LEVEL2-BASELINE-DOCS-EXIST');
console.log('PASS PROG-042-V3-5-R1-LEVEL2-BASELINE-HASH-STABLE');
console.log('PASS PROG-042-V3-5-R1-LEVEL2-BASELINE-BUILDER-STABLE');
console.log('PASS PROG-042-V3-5-R1-LEVEL1-TARGET-PRESERVED');
console.log('PASS PROG-042-V3-5-R1-LEVEL2-DISTINCT-TRACK');
console.log('PASS PROG-042-V3-5-R1-SIX-INITIAL-GAPS-OPEN');
console.log('PASS PROG-042-V3-5-R1-PRIORITIES-RECORDED');
console.log('PASS PROG-042-V3-5-R1-NEXT-PROG-043-RECORDED');
console.log('PASS PROG-042-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
