'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const docPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-producer-registry-baseline.json';
const mdPath = 'docs/launch/level1/v3-4-r1/v3-4-r1-producer-registry-baseline.md';

assert.equal(fs.existsSync(path.join(root, docPath)), true, `${docPath} must exist`);
assert.equal(fs.existsSync(path.join(root, mdPath)), true, `${mdPath} must exist`);

const doc = json(docPath);
const md = read(mdPath);

assert.equal(doc.proto, 'HBCE-B2B-L1-V3-4-R1-PRODUCER-REGISTRY-BASELINE-v1');
assert.equal(doc.kind, 'HBCE_B2B_L1_V3_4_R1_PRODUCER_REGISTRY_BASELINE');
assert.equal(doc.issue_id, 'PROG-032');
assert.equal(doc.product, 'JOKER-C2 LAYER MATRIX / B2B Level 1');
assert.equal(doc.category, 'Human-Governed AI Agent Infrastructure');

assert.equal(doc.v3_4_r1_scope_boundary.expands_commercial_scope, false);
assert.equal(doc.v3_4_r1_scope_boundary.introduces_new_capability, false);
assert.equal(doc.v3_4_r1_scope_boundary.introduces_pilot_access, false);
assert.equal(doc.v3_4_r1_scope_boundary.corrective_revision_only, true);

assert.equal(doc.producer_binding_rule.rule_id, 'PRODUCER_BINDING_RULE_V3_4_R1');
assert.equal(doc.producer_binding_rule.no_registered_producer_result, 'PRODUCER_NOT_REGISTERED');
assert.equal(doc.producer_binding_rule.unauthorized_transition_result, 'TRANSITION_DENIED');
assert.equal(doc.producer_binding_rule.requesting_action_is_not_state_mutation, true);
assert.equal(doc.producer_binding_rule.transverse_acceptance_test, 'T217');

const expectedProducers = [
  'PRODUCER::HBCE_CORE',
  'PRODUCER::TARGET_OUTCOME_LOGIC',
  'PRODUCER::QUALIFIED_VERIFIER',
  'PRODUCER::GATE_EVALUATOR',
  'PRODUCER::BUILD_CHANGE_CONTROL',
  'PRODUCER::CONTRACT_CONTROL',
  'PRODUCER::SCHEMA_REGISTRY'
];

assert.equal(doc.producer_count, expectedProducers.length);
assert.equal(doc.registered_producers.length, expectedProducers.length);

const producers = new Map(doc.registered_producers.map((p) => [p.producer_id, p]));
for (const producerId of expectedProducers) {
  assert.equal(producers.has(producerId), true, `${producerId} must be registered`);
  assert.equal(doc.trust_boundary_required_producers.includes(producerId), true, `${producerId} must appear in trust boundary`);
}

assert.equal(doc.namespace_owner_map.IMPLEMENTATION, 'PRODUCER::BUILD_CHANGE_CONTROL');
assert.equal(doc.namespace_owner_map.ASSURANCE, 'PRODUCER::QUALIFIED_VERIFIER');
assert.equal(doc.namespace_owner_map.GATE, 'PRODUCER::GATE_EVALUATOR');
assert.equal(doc.namespace_owner_map.CONTRACT, 'PRODUCER::CONTRACT_CONTROL');
assert.equal(doc.namespace_owner_map.COMBINATION, 'PRODUCER::SCHEMA_REGISTRY');
assert.equal(doc.namespace_owner_map.OPERATIONAL.includes('PRODUCER::HBCE_CORE'), true);
assert.equal(doc.namespace_owner_map.OPERATIONAL.includes('PRODUCER::TARGET_OUTCOME_LOGIC'), true);

assert.equal(producers.get('PRODUCER::HBCE_CORE').hard_prohibitions.includes('ASSURANCE::PROVEN'), true);
assert.equal(producers.get('PRODUCER::GATE_EVALUATOR').hard_prohibitions.includes('OPERATIONAL::ALLOWED'), true);
assert.equal(producers.get('PRODUCER::SCHEMA_REGISTRY').hard_prohibitions.includes('runtime_state_mutation'), true);
assert.equal(producers.get('PRODUCER::CONTRACT_CONTROL').hard_prohibitions.includes('implementation_implication'), true);

const fixtures = new Map(doc.negative_transition_fixtures.map((f) => [f.fixture_id, f.expected_result]));
assert.equal(fixtures.get('T217-A'), 'PRODUCER_NOT_REGISTERED');
assert.equal(fixtures.get('T217-B'), 'TRANSITION_DENIED');
assert.equal(fixtures.get('T217-C'), 'TRANSITION_DENIED');
assert.equal(fixtures.get('T217-D'), 'TRANSITION_DENIED');
assert.equal(fixtures.get('T217-E'), 'TRANSITION_DENIED');

assert.equal(doc.next_required_programs.some((p) => p.issue_id === 'PROG-033'), true);
assert.equal(doc.next_required_programs.some((p) => p.issue_id === 'PROG-034'), true);
assert.equal(doc.next_required_programs.some((p) => p.issue_id === 'PROG-035'), true);

assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.release_candidate_ready, false);
assert.equal(doc.non_claims.pilot_access_available, false);
assert.equal(doc.non_claims.producer_enforcement_runtime_complete, false);
assert.equal(doc.non_claims.recovery_harness_complete, false);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.match(md, /Producer Registry baseline/);
assert.match(md, /No registered producer means no controlled mutation/);
assert.match(md, /Requesting an action is not producing a state mutation/);
assert.match(md, /does not claim production readiness/);

console.log('PASS PROG-032-V3-4-R1-PRODUCER-REGISTRY-DOCS-EXIST');
console.log('PASS PROG-032-V3-4-R1-PRODUCER-REGISTRY-HASH-STABLE');
console.log('PASS PROG-032-V3-4-R1-SCOPE-NOT-EXPANDED');
console.log('PASS PROG-032-V3-4-R1-SEVEN-PRODUCERS-REGISTERED');
console.log('PASS PROG-032-V3-4-R1-TRUST-BOUNDARY-COVERAGE');
console.log('PASS PROG-032-V3-4-R1-NAMESPACE-OWNER-MAP');
console.log('PASS PROG-032-V3-4-R1-T217-NEGATIVE-FIXTURES');
console.log('PASS PROG-032-V3-4-R1-NEXT-PROGRAMS-RECORDED');
console.log('PASS PROG-032-V3-4-R1-NO-RUNTIME-COMPLETION-CLAIM');
