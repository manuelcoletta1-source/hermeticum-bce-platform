'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { LEVEL2_PRODUCERS, buildLevel2ProducerRegistry } = require('../../../runtime/b2g/build-v3-5-r1-level2-producer-registry.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-producer-registry-baseline.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-producer-registry-baseline.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-level2-producer-registry.js';
const baselinePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-track-baseline.json';

for (const p of [docPath, mdPath, runtimePath, baselinePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const baseline = json(baselinePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-PRODUCER-REGISTRY-BASELINE-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_PRODUCER_REGISTRY_BASELINE');
assert.equal(doc.issue_id, 'PROG-043');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-PRODUCER-REGISTRY-BASELINE');
assert.equal(doc.source_level2_track_baseline_revision_hash, baseline.revision_hash);
assert.equal(doc.source_level2_track_baseline_revision_hash_valid, true);

const regenerated = buildLevel2ProducerRegistry({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.producer_binding_rule.no_registered_level2_producer_no_evidentiary_mutation, true);
assert.equal(doc.producer_binding_rule.no_registered_level2_producer_no_export_state_mutation, true);
assert.equal(doc.producer_binding_rule.b2g_table_cannot_bypass_level1_hbce_core, true);
assert.equal(doc.producer_binding_rule.model_output_cannot_create_producer_authority, true);

assert.deepEqual(doc.producers, LEVEL2_PRODUCERS);
assert.equal(doc.registry_summary.registered_producer_count, 9);
assert.equal(doc.registry_summary.inherited_level1_producers_preserved, true);
assert.equal(doc.registry_summary.level2_adds_b2g_specific_producers, true);
assert.equal(doc.registry_summary.level2_does_not_degrade_level1_producer_binding, true);

const ids = doc.producers.map((p) => p.producer_id).sort();
assert.deepEqual(ids, [
  'PRODUCER::EVIDENCE_CUSTODY',
  'PRODUCER::EXPORT_CONTROL',
  'PRODUCER::FORENSIC_REVIEW',
  'PRODUCER::GATE_EVALUATOR',
  'PRODUCER::HBCE_CORE',
  'PRODUCER::QUALIFIED_VERIFIER',
  'PRODUCER::SCHEMA_REGISTRY',
  'PRODUCER::TARGET_OUTCOME_LOGIC',
  'PRODUCER::VERIFIER_QUALIFICATION_CONTROL'
]);

assert.deepEqual(doc.registry_summary.registered_domains, ['ASSURANCE', 'EVIDENCE_CUSTODY', 'EVIDENTIARY', 'EXPORT', 'GATE', 'OPERATIONAL', 'QUALIFICATION', 'SCHEMA']);
assert.equal(doc.closed_gap.gap_id, 'L2-GAP-001');
assert.equal(doc.closed_gap.status, 'CLOSED_BASELINE_ONLY');
assert.equal(doc.closed_gap.runtime_enforcement_implemented, false);
assert.deepEqual(doc.remaining_open_gaps, ['L2-GAP-002', 'L2-GAP-003', 'L2-GAP-004', 'L2-GAP-005', 'L2-GAP-006']);

assert.equal(doc.readiness_state.level2_producer_registry_baseline_created, true);
assert.equal(doc.readiness_state.level2_producer_runtime_enforcement_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.next_required_program, 'PROG-044-V3-5-R1-VERIFIER-QUALIFICATION-RECORD-CONTRACT');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);

assert.match(md, /No registered Level 2 producer, no evidentiary or export-state mutation/);
assert.match(md, /Runtime enforcement remains incomplete/);
assert.match(md, /PRODUCER::FORENSIC_REVIEW/);
assert.match(md, /PRODUCER::VERIFIER_QUALIFICATION_CONTROL/);
assert.match(md, /PRODUCER::EVIDENCE_CUSTODY/);
assert.match(md, /PROG-044-V3-5-R1-VERIFIER-QUALIFICATION-RECORD-CONTRACT/);

console.log('PASS PROG-043-V3-5-R1-LEVEL2-PRODUCER-REGISTRY-DOCS-EXIST');
console.log('PASS PROG-043-V3-5-R1-LEVEL2-PRODUCER-REGISTRY-HASH-STABLE');
console.log('PASS PROG-043-V3-5-R1-LEVEL2-PRODUCER-REGISTRY-BUILDER-STABLE');
console.log('PASS PROG-043-V3-5-R1-SOURCE-BASELINE-INTEGRITY-VALID');
console.log('PASS PROG-043-V3-5-R1-NINE-PRODUCERS-REGISTERED');
console.log('PASS PROG-043-V3-5-R1-EVIDENTIARY-AND-EXPORT-BINDING-RULE-RECORDED');
console.log('PASS PROG-043-V3-5-R1-L2-GAP-001-CLOSED-BASELINE-ONLY');
console.log('PASS PROG-043-V3-5-R1-REMAINING-GAPS-OPEN');
console.log('PASS PROG-043-V3-5-R1-NEXT-PROG-044-RECORDED');
console.log('PASS PROG-043-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
