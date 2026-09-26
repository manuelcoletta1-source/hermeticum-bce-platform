'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  sampleExternalValidationPackage
} = require('../../../runtime/b2g/build-v3-5-r1-level2-external-validation-control.js');
const {
  RESULT_STATUSES,
  REVIEW_OUTCOMES,
  REQUIRED_RESULT_SECTIONS,
  sampleExternalValidationResult,
  validateExternalValidationResult,
  buildIngestion
} = require('../../../runtime/b2g/build-v3-5-r1-level2-external-validation-results-ingestion.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-results-ingestion.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-results-ingestion.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-level2-external-validation-results-ingestion.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-control.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_RESULTS_INGESTION');
assert.equal(doc.issue_id, 'PROG-051');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION');
assert.equal(doc.source_external_validation_control_revision_hash, source.revision_hash);
assert.equal(doc.source_external_validation_control_revision_hash_valid, true);

const regenerated = buildIngestion({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.deepEqual(doc.allowed_result_statuses, RESULT_STATUSES);
assert.deepEqual(doc.allowed_review_outcomes, REVIEW_OUTCOMES);
assert.deepEqual(doc.required_result_sections, REQUIRED_RESULT_SECTIONS);

assert.equal(doc.ingestion_semantics.result_ingestion_is_not_external_validation_completion, true);
assert.equal(doc.ingestion_semantics.result_ingestion_is_not_b2g_candidate_readiness, true);
assert.equal(doc.ingestion_semantics.pass_with_limitations_requires_followup_gate, true);
assert.equal(doc.ingestion_semantics.pass_result_does_not_create_public_accreditation, true);
assert.equal(doc.ingestion_semantics.pass_result_does_not_create_procurement_eligibility, true);
assert.equal(doc.ingestion_semantics.pass_result_does_not_create_legal_validity, true);
assert.equal(doc.ingestion_semantics.government_endorsement_must_not_be_inferred, true);

const byId = Object.fromEntries(doc.runtime_guard_vectors.map((v) => [v.vector_id, v]));
assert.equal(byId['B2G-EXTVAL-RESULT-T01'].result.code, 'EXTERNAL_VALIDATION_RESULT_MISSING');
assert.equal(byId['B2G-EXTVAL-RESULT-T02'].result.code, 'RESULT_PACKAGE_BINDING_INVALID');
assert.equal(byId['B2G-EXTVAL-RESULT-T03'].result.code, 'RESULT_REVIEWER_BINDING_INVALID');
assert.equal(byId['B2G-EXTVAL-RESULT-T04'].result.code, 'RESULT_SCOPE_INCOMPLETE');
assert.equal(byId['B2G-EXTVAL-RESULT-T05'].result.code, 'RESULT_SECTIONS_INCOMPLETE');
assert.equal(byId['B2G-EXTVAL-RESULT-T06'].result.code, 'EXTERNAL_VALIDATION_COMPLETION_CLAIM_UNSUPPORTED');
assert.equal(byId['B2G-EXTVAL-RESULT-POS-001'].result.code, 'EXTERNAL_VALIDATION_RESULT_INGESTED_FOR_ASSESSMENT');
assert.equal(byId['B2G-EXTVAL-RESULT-POS-001'].result.valid, true);
assert.equal(byId['B2G-EXTVAL-RESULT-POS-001'].result.external_validation_complete, false);
assert.equal(byId['B2G-EXTVAL-RESULT-POS-001'].result.b2g_candidate_ready, false);
assert.equal(byId['B2G-EXTVAL-RESULT-POS-001'].result.public_sector_production_ready, false);

const pkg = sampleExternalValidationPackage();
assert.equal(validateExternalValidationResult(pkg, null).code, 'EXTERNAL_VALIDATION_RESULT_MISSING');
assert.equal(validateExternalValidationResult(pkg, sampleExternalValidationResult()).valid, true);
assert.equal(validateExternalValidationResult(pkg, sampleExternalValidationResult({ reviewer_ref: 'VALIDATOR::OTHER' })).code, 'RESULT_REVIEWER_BINDING_INVALID');
assert.equal(validateExternalValidationResult(pkg, sampleExternalValidationResult({ claims_government_endorsement: true })).code, 'GOVERNMENT_ENDORSEMENT_CLAIM_UNSUPPORTED');

assert.equal(doc.readiness_state.external_validation_results_ingestion_created, true);
assert.equal(doc.readiness_state.external_validation_result_contract_created, true);
assert.equal(doc.readiness_state.external_validation_result_validator_created, true);
assert.equal(doc.readiness_state.external_validation_result_ingested_for_assessment, true);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.source_external_validation_control_present, true);

assert.equal(doc.next_required_program, 'PROG-052-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /Result ingestion does not mean external validation complete/);
assert.match(md, /Result ingestion does not mean B2G_CANDIDATE readiness/);
assert.match(md, /pass with limitations does not create public accreditation/i);
assert.match(md, /PROG-052-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CLOSURE-GATE/);

console.log('PASS PROG-051-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION-DOCS-EXIST');
console.log('PASS PROG-051-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION-HASH-STABLE');
console.log('PASS PROG-051-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-051-V3-5-R1-SOURCE-CONTROL-INTEGRITY-VALID');
console.log('PASS PROG-051-V3-5-R1-VALIDATOR-FAILS-CLOSED');
console.log('PASS PROG-051-V3-5-R1-RESULT-BOUND-TO-PACKAGE-AND-REVIEWER');
console.log('PASS PROG-051-V3-5-R1-INGESTED-FOR-ASSESSMENT-ONLY');
console.log('PASS PROG-051-V3-5-R1-NO-PUBLIC-ACCREDITATION-LEGAL-OR-PROCUREMENT-INFERENCE');
console.log('PASS PROG-051-V3-5-R1-NEXT-PROG-052-RECORDED');
console.log('PASS PROG-051-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
