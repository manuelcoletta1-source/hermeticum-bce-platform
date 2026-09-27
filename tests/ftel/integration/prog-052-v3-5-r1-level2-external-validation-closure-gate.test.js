'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  findPositiveIngestionVector,
  evaluateClosure,
  buildClosureGate
} = require('../../../runtime/b2g/evaluate-v3-5-r1-level2-external-validation-closure-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-closure-gate.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-closure-gate.md';
const runtimePath = 'runtime/b2g/evaluate-v3-5-r1-level2-external-validation-closure-gate.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-results-ingestion.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_CLOSURE_GATE');
assert.equal(doc.issue_id, 'PROG-052');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE');
assert.equal(doc.source_external_validation_results_ingestion_revision_hash, source.revision_hash);
assert.equal(doc.source_external_validation_results_ingestion_revision_hash_valid, true);

const regenerated = buildClosureGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

const directGate = evaluateClosure(source);
assert.deepEqual(directGate, doc.gate);

const positive = findPositiveIngestionVector(source);
assert.equal(positive.vector_id, 'B2G-EXTVAL-RESULT-POS-001');
assert.equal(positive.result.code, 'EXTERNAL_VALIDATION_RESULT_INGESTED_FOR_ASSESSMENT');
assert.equal(positive.result.valid, true);
assert.equal(positive.result.external_validation_complete, false);
assert.equal(positive.result.b2g_candidate_ready, false);

assert.equal(doc.gate.gate_result, 'EXTERNAL_VALIDATION_CLOSURE_GATE_BLOCKED');
assert.equal(doc.gate.conditions.source_revision_hash_valid, true);
assert.equal(doc.gate.conditions.source_issue_is_prog_051, true);
assert.equal(doc.gate.conditions.external_validation_results_ingestion_created, true);
assert.equal(doc.gate.conditions.external_validation_result_ingested_for_assessment, true);
assert.equal(doc.gate.conditions.positive_ingestion_vector_present, true);
assert.equal(doc.gate.conditions.positive_ingestion_vector_valid, true);
assert.equal(doc.gate.conditions.positive_ingestion_for_assessment_only, true);
assert.equal(doc.gate.conditions.source_external_validation_complete, false);
assert.equal(doc.gate.conditions.source_b2g_candidate_ready, false);
assert.equal(doc.gate.conditions.source_public_sector_production_ready, false);
assert.equal(doc.gate.conditions.independent_closure_decision_present, false);
assert.equal(doc.gate.conditions.limitations_resolution_record_present, false);
assert.equal(doc.gate.conditions.pilot_readiness_authorization_present, false);

assert.deepEqual(doc.gate.blocking_reasons, [
  'EXTERNAL_VALIDATION_COMPLETION_NOT_SUPPORTED_BY_SOURCE',
  'EXTERNAL_VALIDATION_COMPLETION_CLAIM_BLOCKED_BY_SOURCE',
  'INDEPENDENT_CLOSURE_DECISION_MISSING',
  'LIMITATIONS_RESOLUTION_RECORD_MISSING',
  'PILOT_READINESS_AUTHORIZATION_MISSING',
  'B2G_CANDIDATE_PROMOTION_NOT_ALLOWED',
  'PUBLIC_SECTOR_PRODUCTION_NOT_READY'
]);

assert.equal(doc.gate.external_validation_complete, false);
assert.equal(doc.gate.b2g_candidate_ready, false);
assert.equal(doc.gate.public_sector_production_ready, false);
assert.equal(doc.gate.automatic_pilot_promotion, false);

assert.equal(doc.closure_semantics.ingestion_is_necessary_not_sufficient_for_external_validation_closure, true);
assert.equal(doc.closure_semantics.result_ingested_for_assessment_is_not_external_validation_complete, true);
assert.equal(doc.closure_semantics.pass_with_limitations_requires_resolution_record, true);
assert.equal(doc.closure_semantics.closure_requires_independent_decision_record, true);
assert.equal(doc.closure_semantics.closure_requires_pilot_readiness_authorization_before_candidate_promotion, true);
assert.equal(doc.closure_semantics.public_accreditation_procurement_and_legal_validity_require_separate_authority, true);
assert.equal(doc.closure_semantics.no_automatic_pilot_promotion_from_external_result, true);

assert.deepEqual(doc.required_closure_artifacts, [
  'independent_closure_decision_record',
  'limitations_resolution_record',
  'external_validation_completion_record',
  'pilot_readiness_authorization_record'
]);

assert.equal(doc.readiness_state.external_validation_closure_gate_created, true);
assert.equal(doc.readiness_state.external_validation_closure_gate_evaluated, true);
assert.equal(doc.readiness_state.external_validation_closure_gate_result, 'EXTERNAL_VALIDATION_CLOSURE_GATE_BLOCKED');
assert.equal(doc.readiness_state.external_validation_results_ingestion_present, true);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.pilot_readiness_authorization_present, false);

assert.equal(doc.next_required_program, 'PROG-053-V3-5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /gate remains BLOCKED/);
assert.match(md, /Result ingestion is necessary, not sufficient/);
assert.match(md, /independent closure decision/);
assert.match(md, /PROG-053-V3-5-R1-LEVEL2-VALIDATION-FOLLOWUP-PLAN/);

console.log('PASS PROG-052-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE-DOCS-EXIST');
console.log('PASS PROG-052-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE-HASH-STABLE');
console.log('PASS PROG-052-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-052-V3-5-R1-SOURCE-RESULTS-INGESTION-INTEGRITY-VALID');
console.log('PASS PROG-052-V3-5-R1-POSITIVE-INGESTION-FOR-ASSESSMENT-ONLY');
console.log('PASS PROG-052-V3-5-R1-GATE-BLOCKED-AS-EXPECTED');
console.log('PASS PROG-052-V3-5-R1-CLOSURE-REQUIRES-SEPARATE-ARTIFACTS');
console.log('PASS PROG-052-V3-5-R1-NO-AUTOMATIC-PILOT-PROMOTION');
console.log('PASS PROG-052-V3-5-R1-NEXT-PROG-053-RECORDED');
console.log('PASS PROG-052-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
