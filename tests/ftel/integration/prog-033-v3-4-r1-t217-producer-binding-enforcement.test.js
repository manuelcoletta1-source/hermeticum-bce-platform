'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const { RESULTS, validateProducerBinding } = require('../../../runtime/producer/validate-producer-binding.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const registryPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-producer-registry-baseline.json';
const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-t217-producer-binding-enforcement.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-t217-producer-binding-enforcement.md';
const runtimePath = 'runtime/producer/validate-producer-binding.js';

for (const p of [registryPath, docPath, mdPath, runtimePath]) {
  assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);
}

const registry = json(registryPath);
const doc = json(docPath);
const md = read(mdPath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-T217-PRODUCER-BINDING-ENFORCEMENT-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_T217_PRODUCER_BINDING_ENFORCEMENT');
assert.equal(doc.issue_id, 'PROG-033');
assert.equal(doc.acceptance_test, 'T217');
assert.equal(doc.source_producer_registry_revision_hash, registry.revision_hash);
assert.equal(doc.source_producer_registry_version, registry.producer_registry_version);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.enforcement_scope.validates_registered_producer_id, true);
assert.equal(doc.enforcement_scope.validates_registry_version_presence, true);
assert.equal(doc.enforcement_scope.validates_namespace_authorization, true);
assert.equal(doc.enforcement_scope.validates_allowed_mutation, true);
assert.equal(doc.enforcement_scope.denies_unregistered_producer, true);
assert.equal(doc.enforcement_scope.denies_unauthorized_namespace, true);
assert.equal(doc.enforcement_scope.denies_unauthorized_mutation, true);
assert.equal(doc.enforcement_scope.treats_action_request_as_non_mutation_producer, true);

function check(input, expected) {
  const result = validateProducerBinding({ registry, ...input });
  assert.equal(result.result, expected, `${JSON.stringify(input)} expected ${expected}, got ${result.result}`);
  return result;
}

assert.equal(
  check({
    producer_id: 'PRODUCER::HBCE_CORE',
    namespace: 'OPERATIONAL',
    mutation: 'OPERATIONAL::ALLOWED'
  }, RESULTS.ALLOWED).allowed,
  true
);

assert.equal(
  check({
    producer_id: 'PRODUCER::QUALIFIED_VERIFIER',
    namespace: 'ASSURANCE',
    mutation: 'ASSURANCE::PROVEN'
  }, RESULTS.ALLOWED).allowed,
  true
);

assert.equal(
  check({
    producer_id: 'PRODUCER::SCHEMA_REGISTRY',
    namespace: 'COMBINATION',
    mutation: 'COMBINATION::VALID'
  }, RESULTS.ALLOWED).allowed,
  true
);

assert.equal(
  check({
    producer_id: 'PRODUCER::UNREGISTERED',
    namespace: 'OPERATIONAL',
    mutation: 'OPERATIONAL::ALLOWED'
  }, RESULTS.PRODUCER_NOT_REGISTERED).allowed,
  false
);

assert.equal(
  check({
    producer_id: 'PRODUCER::GATE_EVALUATOR',
    namespace: 'OPERATIONAL',
    mutation: 'OPERATIONAL::ALLOWED'
  }, RESULTS.TRANSITION_DENIED).allowed,
  false
);

assert.equal(
  check({
    producer_id: 'PRODUCER::HBCE_CORE',
    namespace: 'ASSURANCE',
    mutation: 'ASSURANCE::PROVEN'
  }, RESULTS.TRANSITION_DENIED).allowed,
  false
);

assert.equal(
  check({
    producer_id: 'PRODUCER::CONTRACT_CONTROL',
    namespace: 'IMPLEMENTATION',
    mutation: 'IMPLEMENTATION::IMPLEMENTED'
  }, RESULTS.TRANSITION_DENIED).allowed,
  false
);

assert.equal(
  check({
    producer_id: 'ACTOR::RECOVERY_REQUESTER',
    namespace: 'OPERATIONAL',
    mutation: 'OPERATIONAL::NOT_EVALUATED'
  }, RESULTS.PRODUCER_NOT_REGISTERED).allowed,
  false
);

assert.equal(
  check({
    producer_id: 'PRODUCER::TARGET_OUTCOME_LOGIC',
    namespace: 'OPERATIONAL',
    mutation: 'OPERATIONAL::ALLOWED'
  }, RESULTS.TRANSITION_DENIED).allowed,
  false
);

assert.equal(validateProducerBinding({ registry, namespace: 'OPERATIONAL' }).result, RESULTS.PRODUCER_ID_REQUIRED);
assert.equal(validateProducerBinding({ registry, producer_id: 'PRODUCER::HBCE_CORE' }).result, RESULTS.NAMESPACE_REQUIRED);
assert.equal(validateProducerBinding({ registry: {}, producer_id: 'PRODUCER::HBCE_CORE', namespace: 'OPERATIONAL' }).result, RESULTS.REGISTRY_MISSING);

assert.equal(doc.t217_vectors.length, 9);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.full_runtime_authorization_complete, false);
assert.equal(doc.non_claims.recovery_harness_complete, false);
assert.equal(doc.non_claims.pilot_access_available, false);

assert.match(md, /T217 producer binding enforcement/);
assert.match(md, /Requesting recovery or requesting an action is not the same as producing a state mutation/);
assert.match(md, /does not claim production readiness/);

console.log('PASS PROG-033-V3-4-R1-T217-DOCS-EXIST');
console.log('PASS PROG-033-V3-4-R1-T217-HASH-STABLE');
console.log('PASS PROG-033-V3-4-R1-RUNTIME-MODULE-EXISTS');
console.log('PASS PROG-033-V3-4-R1-REGISTERED-PRODUCER-ALLOWED');
console.log('PASS PROG-033-V3-4-R1-UNREGISTERED-PRODUCER-BLOCKED');
console.log('PASS PROG-033-V3-4-R1-UNAUTHORIZED-NAMESPACE-BLOCKED');
console.log('PASS PROG-033-V3-4-R1-UNAUTHORIZED-MUTATION-BLOCKED');
console.log('PASS PROG-033-V3-4-R1-ACTION-REQUESTER-NOT-MUTATION-PRODUCER');
console.log('PASS PROG-033-V3-4-R1-NO-RELEASE-OR-RECOVERY-HARNESS-CLAIM');
