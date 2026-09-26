'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  ADAPTER_CLASSES,
  TRANSFORMATION_CLASSES,
  PROVENANCE_STATUSES,
  EXPORT_BOUNDARY,
  sampleAdapterProfile,
  sampleAdapterEvent,
  validateAdapterProvenanceProfile,
  validateAdapterTransformation,
  buildContract
} = require('../../../runtime/b2g/build-v3-5-r1-adapter-provenance-profile-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-adapter-provenance-profile-contract.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-adapter-provenance-profile-contract.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-adapter-provenance-profile-contract.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-human-decision-profile-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-ADAPTER-PROVENANCE-PROFILE-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_ADAPTER_PROVENANCE_PROFILE_CONTRACT');
assert.equal(doc.issue_id, 'PROG-047');
assert.equal(doc.priority, 'V3.5-R1-ADAPTER-PROVENANCE-PROFILE-CONTRACT');
assert.equal(doc.source_human_decision_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_human_decision_contract_revision_hash_valid, true);

const regenerated = buildContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.governing_producer, 'PRODUCER::EXPORT_CONTROL');
assert.equal(doc.schema_producer, 'PRODUCER::SCHEMA_REGISTRY');
assert.deepEqual(doc.allowed_adapter_classes, ADAPTER_CLASSES);
assert.deepEqual(doc.allowed_transformation_classes, TRANSFORMATION_CLASSES);
assert.deepEqual(doc.allowed_provenance_statuses, PROVENANCE_STATUSES);
assert.deepEqual(doc.allowed_export_boundaries, EXPORT_BOUNDARY);

assert.equal(doc.invariant.adapter_identity_and_version_are_required, true);
assert.equal(doc.invariant.adapter_event_requires_input_and_output_hash_binding, true);
assert.equal(doc.invariant.adapter_event_requires_custody_event_ref, true);
assert.equal(doc.invariant.adapter_cannot_replace_source_of_truth, true);
assert.equal(doc.invariant.adapter_cannot_create_public_authority, true);
assert.equal(doc.invariant.adapter_cannot_emit_assurance_or_evidentiary_verdict, true);
assert.equal(doc.invariant.export_requires_profile_boundary, true);
assert.equal(doc.invariant.redacted_export_requires_redaction_profile, true);

const byId = Object.fromEntries(doc.runtime_guard_vectors.map((v) => [v.vector_id, v]));
assert.equal(byId['B2G-T40'].result.code, 'ADAPTER_SOURCE_TARGET_INVALID');
assert.equal(byId['B2G-T41'].result.code, 'ADAPTER_PROVENANCE_INCOMPLETE');
assert.equal(byId['B2G-T42'].result.code, 'ADAPTER_TRANSFORMATION_NOT_ALLOWED');
assert.equal(byId['B2G-T43'].result.code, 'SOURCE_OF_TRUTH_REPLACEMENT_DENIED');
assert.equal(byId['B2G-POS-004'].result.code, 'ADAPTER_TRANSFORMATION_VALID');
assert.equal(byId['B2G-POS-004'].result.valid, true);
assert.equal(byId['B2G-POS-004'].result.source_of_truth_replacement_permitted, false);
assert.equal(byId['B2G-POS-004'].result.public_authority_created, false);
assert.equal(byId['B2G-POS-004'].result.canonical_mutation_permitted, false);

assert.equal(validateAdapterProvenanceProfile(sampleAdapterProfile()).valid, true);
assert.equal(validateAdapterProvenanceProfile(sampleAdapterProfile({ adapter_class: 'MAGIC' })).code, 'ADAPTER_CLASS_INVALID');
assert.equal(validateAdapterTransformation(sampleAdapterProfile(), sampleAdapterEvent()).code, 'ADAPTER_TRANSFORMATION_VALID');
assert.equal(validateAdapterTransformation(sampleAdapterProfile(), sampleAdapterEvent({ output_hash: '' })).code, 'ADAPTER_EVENT_HASH_BINDING_INCOMPLETE');
assert.equal(validateAdapterTransformation(sampleAdapterProfile({ export_boundary: 'REDACTED_EXPORT' }), sampleAdapterEvent()).code, 'REDACTION_REQUIRED');

assert.equal(doc.closed_gap.gap_id, 'L2-GAP-005');
assert.equal(doc.closed_gap.status, 'CLOSED_CONTRACT_AND_VALIDATOR_BASELINE');
assert.equal(doc.closed_gap.adapter_provenance_runtime_integration_complete, false);
assert.deepEqual(doc.remaining_open_gaps, ['L2-GAP-006']);

assert.equal(doc.readiness_state.adapter_provenance_profile_contract_created, true);
assert.equal(doc.readiness_state.adapter_provenance_validator_created, true);
assert.equal(doc.readiness_state.adapter_provenance_runtime_integration_complete, false);
assert.equal(doc.readiness_state.b2g_t26_t43_harness_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.next_required_program, 'PROG-048-V3-5-R1-B2G-T26-T43-RUNTIME-HARNESS');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.source_of_truth_replacement, false);
assert.equal(doc.non_claims.assurance_verdict_created, false);
assert.equal(doc.non_claims.evidentiary_verdict_created, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);

assert.match(md, /Adapters connect systems/);
assert.match(md, /Adapter events require input hash, output hash/);
assert.match(md, /L2-GAP-005/);
assert.match(md, /PROG-048-V3-5-R1-B2G-T26-T43-RUNTIME-HARNESS/);

console.log('PASS PROG-047-V3-5-R1-ADAPTER-PROVENANCE-DOCS-EXIST');
console.log('PASS PROG-047-V3-5-R1-ADAPTER-PROVENANCE-HASH-STABLE');
console.log('PASS PROG-047-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-047-V3-5-R1-SOURCE-HUMAN-DECISION-INTEGRITY-VALID');
console.log('PASS PROG-047-V3-5-R1-B2G-T40-T43-GUARDS-RECORDED');
console.log('PASS PROG-047-V3-5-R1-VALIDATOR-FAILS-CLOSED');
console.log('PASS PROG-047-V3-5-R1-NO-SOURCE-OF-TRUTH-OR-PUBLIC-AUTHORITY-CLAIM');
console.log('PASS PROG-047-V3-5-R1-L2-GAP-005-CLOSED-CONTRACT-ONLY');
console.log('PASS PROG-047-V3-5-R1-NEXT-PROG-048-RECORDED');
console.log('PASS PROG-047-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
