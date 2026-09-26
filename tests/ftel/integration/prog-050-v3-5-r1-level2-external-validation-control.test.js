'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  VALIDATION_PACKAGE_STATUSES,
  VALIDATOR_RELATIONSHIP_TYPES,
  VALIDATION_SCOPE_ITEMS,
  sampleExternalValidationPackage,
  validateExternalValidationPackage,
  buildControl
} = require('../../../runtime/b2g/build-v3-5-r1-level2-external-validation-control.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-control.json';
const mdPath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-external-validation-control.md';
const runtimePath = 'runtime/b2g/build-v3-5-r1-level2-external-validation-control.js';
const sourcePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-readiness-gate-evaluation.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-B2G-L2-JC2-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL-v1');
assert.equal(doc.kind, 'HBCE_B2G_LEVEL2_JOKER_C2_V3_5_R1_LEVEL2_EXTERNAL_VALIDATION_CONTROL');
assert.equal(doc.issue_id, 'PROG-050');
assert.equal(doc.priority, 'V3.5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL');
assert.equal(doc.source_level2_readiness_gate_revision_hash, source.revision_hash);
assert.equal(doc.source_level2_readiness_gate_revision_hash_valid, true);
assert.equal(doc.source_gate_result, 'LEVEL2_READINESS_GATE_BLOCKED');

const regenerated = buildControl({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.deepEqual(doc.allowed_validation_package_statuses, VALIDATION_PACKAGE_STATUSES);
assert.deepEqual(doc.allowed_validator_relationship_types, VALIDATOR_RELATIONSHIP_TYPES);
assert.deepEqual(doc.required_validation_scope_items, VALIDATION_SCOPE_ITEMS);

assert.equal(doc.control_semantics.external_validation_control_is_not_external_validation_completion, true);
assert.equal(doc.control_semantics.accepted_for_review_is_not_b2g_candidate_readiness, true);
assert.equal(doc.control_semantics.customer_accepted_review_is_not_public_accreditation, true);
assert.equal(doc.control_semantics.public_accreditation_reference_must_be_explicit_and_separate, true);
assert.equal(doc.control_semantics.procurement_eligibility_requires_separate_authority, true);
assert.equal(doc.control_semantics.legal_validity_requires_separate_authority, true);
assert.equal(doc.control_semantics.government_endorsement_must_not_be_inferred, true);

const byId = Object.fromEntries(doc.runtime_guard_vectors.map((v) => [v.vector_id, v]));
assert.equal(byId['B2G-EXTVAL-T01'].result.code, 'EXTERNAL_VALIDATION_PACKAGE_MISSING');
assert.equal(byId['B2G-EXTVAL-T02'].result.code, 'INDEPENDENCE_DECLARATION_MISSING');
assert.equal(byId['B2G-EXTVAL-T03'].result.code, 'VALIDATION_SCOPE_INCOMPLETE');
assert.equal(byId['B2G-EXTVAL-T04'].result.code, 'SOURCE_ARTIFACT_REFS_INCOMPLETE');
assert.equal(byId['B2G-EXTVAL-T05'].result.code, 'PROCUREMENT_ELIGIBILITY_CLAIM_UNSUPPORTED');
assert.equal(byId['B2G-EXTVAL-POS-001'].result.code, 'EXTERNAL_VALIDATION_PACKAGE_ACCEPTABLE_FOR_REVIEW');
assert.equal(byId['B2G-EXTVAL-POS-001'].result.valid, true);
assert.equal(byId['B2G-EXTVAL-POS-001'].result.external_validation_complete, false);
assert.equal(byId['B2G-EXTVAL-POS-001'].result.b2g_candidate_ready, false);
assert.equal(byId['B2G-EXTVAL-POS-001'].result.public_sector_production_ready, false);

assert.equal(validateExternalValidationPackage(null).code, 'EXTERNAL_VALIDATION_PACKAGE_MISSING');
assert.equal(validateExternalValidationPackage(sampleExternalValidationPackage()).valid, true);
assert.equal(validateExternalValidationPackage(sampleExternalValidationPackage({ validation_scope: ['B2G_T26_T43_RUNTIME_HARNESS'] })).code, 'VALIDATION_SCOPE_INCOMPLETE');
assert.equal(validateExternalValidationPackage(sampleExternalValidationPackage({ claims_government_endorsement: true })).code, 'GOVERNMENT_ENDORSEMENT_CLAIM_UNSUPPORTED');

assert.equal(doc.readiness_state.external_validation_control_created, true);
assert.equal(doc.readiness_state.external_validation_package_contract_created, true);
assert.equal(doc.readiness_state.external_validation_package_validator_created, true);
assert.equal(doc.readiness_state.external_validation_results_ingestion_complete, false);
assert.equal(doc.readiness_state.external_validation_complete, false);
assert.equal(doc.readiness_state.b2g_candidate_ready, false);
assert.equal(doc.readiness_state.public_sector_production_ready, false);
assert.equal(doc.readiness_state.source_level2_readiness_gate_blocked, true);

assert.equal(doc.next_required_program, 'PROG-051-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION');

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.b2g_candidate_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.external_validation_complete, false);
assert.equal(doc.non_claims.level2_runtime_complete, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /Accepted for review does not mean external validation complete/);
assert.match(md, /Customer accepted review is not public accreditation/);
assert.match(md, /source Level 2 readiness gate remains BLOCKED/i);
assert.match(md, /PROG-051-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-RESULTS-INGESTION/);

console.log('PASS PROG-050-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL-DOCS-EXIST');
console.log('PASS PROG-050-V3-5-R1-LEVEL2-EXTERNAL-VALIDATION-CONTROL-HASH-STABLE');
console.log('PASS PROG-050-V3-5-R1-BUILDER-STABLE');
console.log('PASS PROG-050-V3-5-R1-SOURCE-READINESS-GATE-INTEGRITY-VALID');
console.log('PASS PROG-050-V3-5-R1-SOURCE-GATE-REMAINS-BLOCKED');
console.log('PASS PROG-050-V3-5-R1-VALIDATOR-FAILS-CLOSED');
console.log('PASS PROG-050-V3-5-R1-ACCEPTED-FOR-REVIEW-ONLY');
console.log('PASS PROG-050-V3-5-R1-NO-PUBLIC-ACCREDITATION-INFERENCE');
console.log('PASS PROG-050-V3-5-R1-NEXT-PROG-051-RECORDED');
console.log('PASS PROG-050-V3-5-R1-NO-B2G-CANDIDATE-OR-PRODUCTION-CLAIM');
