'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-build-assurance-closure-snapshot.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-build-assurance-closure-snapshot.md';

const sourcePaths = [
  'docs/launch/level1/v3-4-r1/v3-4-r1-producer-registry-baseline.json',
  'docs/launch/level1/v3-4-r1/v3-4-r1-t217-producer-binding-enforcement.json',
  'docs/launch/level1/v3-4-r1/v3-4-r1-t218-t222-recovery-coverage-harness.json',
  'docs/launch/level1/v3-4-r1/v3-4-r1-t223-t225-meta-contract-consistency.json'
];

const runtimePaths = [
  'runtime/producer/validate-producer-binding.js',
  'runtime/recovery/validate-recovery-lineage.js',
  'runtime/schema/validate-meta-type-consistency.js'
];

for (const p of [docPath, mdPath, ...sourcePaths, ...runtimePaths]) {
  assert.equal(exists(p), true, `${p} must exist`);
}

const doc = json(docPath);
const md = read(mdPath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-BUILD-ASSURANCE-CLOSURE-SNAPSHOT-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_BUILD_ASSURANCE_CLOSURE_SNAPSHOT');
assert.equal(doc.issue_id, 'PROG-036');

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.source_artifacts.length, 4);
assert.deepEqual(
  doc.source_artifacts.map((s) => s.issue_id),
  ['PROG-032', 'PROG-033', 'PROG-034', 'PROG-035']
);

for (const source of doc.source_artifacts) {
  const sourceDoc = json(source.path);
  assert.equal(sourceDoc.issue_id, source.issue_id);
  assert.equal(sourceDoc.revision_hash, source.revision_hash);
}

assert.deepEqual(
  doc.acceptance_chain.map((x) => x.test_id),
  ['T217', 'T218', 'T219', 'T220', 'T221', 'T222', 'T223', 'T224', 'T225']
);

for (const entry of doc.acceptance_chain) {
  assert.equal(exists(entry.runtime_module_path), true, `${entry.runtime_module_path} must exist`);
}

for (const t of doc.verification_tests) {
  assert.equal(exists(t), true, `${t} must exist`);
}

assert.equal(doc.closure_status.producer_registry_baseline_present, true);
assert.equal(doc.closure_status.t217_producer_binding_enforcement_present, true);
assert.equal(doc.closure_status.t218_t222_recovery_coverage_present, true);
assert.equal(doc.closure_status.t223_t225_meta_contract_consistency_present, true);
assert.equal(doc.closure_status.t217_t225_acceptance_chain_present, true);
assert.equal(doc.closure_status.first_v3_4_r1_schema_hardening_block_closed, true);
assert.equal(doc.closure_status.downstream_e2e_evidence_required, true);
assert.equal(doc.closure_status.release_candidate_gate_still_required, true);

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.pilot_access_available, false);
assert.equal(doc.non_claims.customer_acceptance, false);
assert.equal(doc.non_claims.full_runtime_authorization_complete, false);
assert.equal(doc.non_claims.full_recovery_program_complete, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.v3_5_required_for_schema_refinement, false);

assert.match(md, /first V3\.4-R1 build-assurance block/);
assert.match(md, /complete T217-T225 acceptance chain/);
assert.match(md, /downstream E2E evidence and release-candidate gates open/);

console.log('PASS PROG-036-V3-4-R1-CLOSURE-DOCS-EXIST');
console.log('PASS PROG-036-V3-4-R1-CLOSURE-HASH-STABLE');
console.log('PASS PROG-036-V3-4-R1-SOURCE-ARTIFACTS-BOUND');
console.log('PASS PROG-036-V3-4-R1-T217-T225-ACCEPTANCE-CHAIN');
console.log('PASS PROG-036-V3-4-R1-RUNTIME-MODULES-BOUND');
console.log('PASS PROG-036-V3-4-R1-VERIFICATION-TESTS-BOUND');
console.log('PASS PROG-036-V3-4-R1-FIRST-SCHEMA-HARDENING-BLOCK-CLOSED');
console.log('PASS PROG-036-V3-4-R1-DOWNSTREAM-E2E-STILL-REQUIRED');
console.log('PASS PROG-036-V3-4-R1-NO-RC-OR-PRODUCTION-CLAIM');
