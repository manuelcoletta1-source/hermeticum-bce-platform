'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  RESULTS,
  validateCombinationClassification,
  validateCanonicalStateTokenShape,
  validateContractProducer
} = require('../../../runtime/schema/validate-meta-type-consistency.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const registryPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-producer-registry-baseline.json';
const t217Path = 'docs/launch/level1/v3-4-r1/v3-4-r1-t217-producer-binding-enforcement.json';
const t218T222Path = 'docs/launch/level1/v3-4-r1/v3-4-r1-t218-t222-recovery-coverage-harness.json';
const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-t223-t225-meta-contract-consistency.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-t223-t225-meta-contract-consistency.md';
const runtimePath = 'runtime/schema/validate-meta-type-consistency.js';

for (const p of [registryPath, t217Path, t218T222Path, docPath, mdPath, runtimePath]) {
  assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);
}

const registry = json(registryPath);
const t217 = json(t217Path);
const t218T222 = json(t218T222Path);
const doc = json(docPath);
const md = read(mdPath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-T223-T225-META-CONTRACT-CONSISTENCY-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_T223_T225_META_CONTRACT_CONSISTENCY');
assert.equal(doc.issue_id, 'PROG-035');
assert.deepEqual(doc.acceptance_tests, ['T223', 'T224', 'T225']);
assert.equal(doc.source_producer_registry_revision_hash, registry.revision_hash);
assert.equal(doc.source_t217_enforcement_revision_hash, t217.revision_hash);
assert.equal(doc.source_t218_t222_recovery_revision_hash, t218T222.revision_hash);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(
  validateCombinationClassification({
    registry,
    producer_id: 'PRODUCER::SCHEMA_REGISTRY',
    classification: 'COMBINATION::VALID'
  }).result,
  RESULTS.SCHEMA_CLASSIFICATION_VALID
);

assert.equal(
  validateCombinationClassification({
    registry,
    producer_id: 'PRODUCER::SCHEMA_REGISTRY',
    classification: 'VALID'
  }).result,
  RESULTS.SCHEMA_CLASSIFICATION_INVALID
);

assert.equal(
  validateCombinationClassification({
    registry,
    producer_id: 'PRODUCER::SCHEMA_REGISTRY',
    classification: 'COMBINATION::MAGIC'
  }).result,
  RESULTS.TYPE_MISMATCH
);

assert.equal(
  validateCombinationClassification({
    registry,
    producer_id: 'PRODUCER::HBCE_CORE',
    classification: 'COMBINATION::VALID'
  }).result,
  RESULTS.PRODUCER_BINDING_DENIED
);

assert.equal(
  validateCanonicalStateTokenShape({
    token: 'NEW_EVALUATION::OPERATIONAL::ALLOWED'
  }).result,
  RESULTS.TOKEN_SHAPE_INVALID
);

assert.equal(
  validateCanonicalStateTokenShape({
    token: 'OPERATIONAL::ALLOWED',
    evaluation_id: 'eval-new-001',
    prior_evaluation_ref: 'eval-old-001'
  }).result,
  RESULTS.TOKEN_SHAPE_VALID
);

assert.equal(
  validateCanonicalStateTokenShape({
    token: 'OPERATIONAL::ALLOWED',
    prior_evaluation_ref: 'eval-old-001'
  }).result,
  RESULTS.TOKEN_SHAPE_INVALID
);

assert.equal(
  validateContractProducer({
    registry,
    producer_id: 'PRODUCER::CONTRACT_CONTROL',
    mutation: 'CONTRACT::RELEASED'
  }).result,
  RESULTS.CONTRACT_TRANSITION_ALLOWED
);

assert.equal(
  validateContractProducer({
    registry,
    producer_id: 'PRODUCER::HBCE_CORE',
    mutation: 'CONTRACT::RELEASED'
  }).result,
  RESULTS.CONTRACT_PRODUCER_INVALID
);

assert.equal(
  validateContractProducer({
    registry,
    producer_id: 'PRODUCER::CONTRACT_CONTROL',
    mutation: 'CONTRACT::IMPLEMENTED'
  }).result,
  RESULTS.TRANSITION_DENIED
);

assert.equal(doc.consistency_coverage.length, 3);
assert.equal(doc.consistency_vectors.length, 8);
assert.equal(doc.consistency_vectors.some((v) => v.classification === 'COMBINATION::VALID'), true);
assert.equal(doc.consistency_vectors.some((v) => v.token === 'NEW_EVALUATION::OPERATIONAL::ALLOWED'), true);
assert.equal(doc.consistency_vectors.some((v) => v.mutation === 'CONTRACT::RELEASED'), true);
assert.equal(doc.consistency_vectors.some((v) => v.mutation === 'CONTRACT::IMPLEMENTED'), true);
assert.equal(doc.enforcement_scope.validates_combination_namespace, true);
assert.equal(doc.enforcement_scope.validates_combination_registry_value, true);
assert.equal(doc.enforcement_scope.blocks_nested_state_tokens, true);
assert.equal(doc.enforcement_scope.separates_state_token_from_evaluation_identity, true);
assert.equal(doc.enforcement_scope.enforces_contract_control_producer, true);
assert.equal(doc.enforcement_scope.uses_t217_producer_binding, true);
assert.equal(doc.enforcement_scope.closes_v3_4_r1_schema_hardening_first_block, true);

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.full_runtime_authorization_complete, false);
assert.equal(doc.non_claims.full_recovery_program_complete, false);
assert.equal(doc.non_claims.pilot_access_available, false);
assert.equal(doc.non_claims.customer_acceptance, false);
assert.equal(doc.non_claims.v3_5_required_for_schema_refinement, false);

assert.match(md, /T223-T225 meta-type and CONTRACT producer consistency/);
assert.match(md, /prevents untyped Combination classifications/);
assert.match(md, /nested state tokens/);
assert.match(md, /CONTRACT lifecycle mutations produced by the wrong producer/);

console.log('PASS PROG-035-V3-4-R1-T223-T225-DOCS-EXIST');
console.log('PASS PROG-035-V3-4-R1-T223-T225-HASH-STABLE');
console.log('PASS PROG-035-V3-4-R1-META-RUNTIME-MODULE-EXISTS');
console.log('PASS PROG-035-V3-4-R1-T223-COMBINATION-NAMESPACE-VALIDATED');
console.log('PASS PROG-035-V3-4-R1-T223-COMBINATION-REGISTRY-VALUE-VALIDATED');
console.log('PASS PROG-035-V3-4-R1-T224-NESTED-TOKEN-BLOCKED');
console.log('PASS PROG-035-V3-4-R1-T224-EVALUATION-ID-FIELDS-REQUIRED');
console.log('PASS PROG-035-V3-4-R1-T225-CONTRACT-CONTROL-REQUIRED');
console.log('PASS PROG-035-V3-4-R1-T225-CONTRACT-MUTATION-VALIDATED');
console.log('PASS PROG-035-V3-4-R1-NO-V3-5-SCHEMA-REFINEMENT-CLAIM');
