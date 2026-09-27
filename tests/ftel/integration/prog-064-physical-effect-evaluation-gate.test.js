'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  GATE_RESULT,
  BLOCKING_REASONS,
  evaluatePhysicalEffectGate
} = require('../../../runtime/level3/evaluate-prog-064-physical-effect-evaluation-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level3/v0-1-c1/prog-064-physical-effect-evaluation-gate.json';
const mdPath = 'docs/launch/level3/v0-1-c1/prog-064-physical-effect-evaluation-gate.md';
const runtimePath = 'runtime/level3/evaluate-prog-064-physical-effect-evaluation-gate.js';
const sourcePath = 'docs/launch/level3/v0-1-c1/prog-063-sensor-evidence-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-L3-PROG-064-PHYSICAL-EFFECT-EVALUATION-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL3_PHYSICAL_EFFECT_EVALUATION_GATE');
assert.equal(doc.issue_id, 'PROG-064');
assert.equal(doc.priority, 'LEVEL3-PHYSICAL-EFFECT-EVALUATION-GATE');
assert.equal(doc.source_sensor_evidence_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_sensor_evidence_contract_revision_hash_valid, true);

const regenerated = evaluatePhysicalEffectGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.gate_result, GATE_RESULT);
assert.deepEqual(doc.blocking_reasons, BLOCKING_REASONS);

assert.equal(doc.inherited_sensor_boundary.sensor_evidence_is_observation_not_effect_proof, true);
assert.equal(doc.inherited_sensor_boundary.live_sensor_requires_new_evidence, true);
assert.equal(doc.inherited_sensor_boundary.missing_sensor_evidence_blocks_effect_claim, true);
assert.equal(doc.inherited_sensor_boundary.sensor_evidence_as_physical_effect_proof, false);
assert.equal(doc.inherited_sensor_boundary.live_effect_claim_allowed_by_source, false);
assert.equal(doc.inherited_sensor_boundary.physical_actuation_permitted_by_source, false);

assert.equal(doc.evaluation_conditions.source_sensor_contract_valid, true);
assert.equal(doc.evaluation_conditions.sensor_evidence_contract_created, true);
assert.equal(doc.evaluation_conditions.sensor_evidence_is_effect_proof, false);
assert.equal(doc.evaluation_conditions.live_sensor_effect_proof_ready, false);
assert.equal(doc.evaluation_conditions.live_effect_claim_allowed, false);
assert.equal(doc.evaluation_conditions.physical_actuation_permitted, false);
assert.equal(doc.evaluation_conditions.level3_pilot_ready, false);
assert.equal(doc.evaluation_conditions.physical_deployment_ready, false);
assert.equal(doc.evaluation_conditions.production_ready, false);

assert.equal(doc.gate_semantics.sensor_evidence_is_required_but_not_sufficient, true);
assert.equal(doc.gate_semantics.controller_receipt_is_required_but_not_sufficient, true);
assert.equal(doc.gate_semantics.physical_action_envelope_is_required_but_not_sufficient, true);
assert.equal(doc.gate_semantics.physical_safety_envelope_is_required_but_not_sufficient, true);
assert.equal(doc.gate_semantics.safe_hold_estop_contract_is_required_but_not_sufficient, true);
assert.equal(doc.gate_semantics.live_effect_claim_requires_new_evidence, true);
assert.equal(doc.gate_semantics.physical_effect_proof_requires_separate_positive_evaluation, true);
assert.equal(doc.gate_semantics.blocked_gate_does_not_invalidate_intake_pack, true);
assert.equal(doc.gate_semantics.blocked_gate_prevents_pilot_ready_promotion, true);

assert.ok(doc.required_for_future_positive_gate.includes('separate_effect_evaluation_record'));
assert.ok(doc.required_for_future_positive_gate.includes('new_evidence_trigger'));

assert.equal(doc.readiness_state.physical_effect_evaluation_gate_created, true);
assert.equal(doc.readiness_state.physical_effect_evaluation_gate_evaluated, true);
assert.equal(doc.readiness_state.physical_effect_evaluation_gate_result, GATE_RESULT);
assert.equal(doc.readiness_state.physical_effect_proven, false);
assert.equal(doc.readiness_state.live_effect_claim_allowed, false);
assert.equal(doc.readiness_state.physical_actuation_permitted, false);
assert.equal(doc.readiness_state.controlled_actuation_ready, false);
assert.equal(doc.readiness_state.level3_pilot_ready, false);
assert.equal(doc.readiness_state.level3_physical_deployment_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-065-HBCE-LEVEL3-C1-READINESS-SNAPSHOT');

assert.equal(doc.non_claims.physical_effect_proven, false);
assert.equal(doc.non_claims.live_effect_claim_allowed, false);
assert.equal(doc.non_claims.physical_actuation_permitted, false);
assert.equal(doc.non_claims.controlled_actuation_ready, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL3_PHYSICAL_EFFECT_EVALUATION_GATE_BLOCKED/);
assert.match(md, /It does not\./);
assert.match(md, /Sensor evidence is required but not sufficient/);
assert.match(md, /A blocked gate prevents pilot-ready promotion/);
assert.match(md, /PROG-065-HBCE-LEVEL3-C1-READINESS-SNAPSHOT/);

console.log('PASS PROG-064-PHYSICAL-EFFECT-GATE-DOCS-EXIST');
console.log('PASS PROG-064-PHYSICAL-EFFECT-GATE-HASH-STABLE');
console.log('PASS PROG-064-BUILDER-STABLE');
console.log('PASS PROG-064-SOURCE-PROG-063-INTEGRITY-VALID');
console.log('PASS PROG-064-GATE-BLOCKED');
console.log('PASS PROG-064-SENSOR-AND-RECEIPT-NOT-SUFFICIENT');
console.log('PASS PROG-064-NO-PHYSICAL-EFFECT-PROVEN');
console.log('PASS PROG-064-BLOCKED-GATE-PREVENTS-PILOT-PROMOTION');
console.log('PASS PROG-064-NEXT-PROG-065-RECORDED');
console.log('PASS PROG-064-NO-UNSUPPORTED-READINESS-CLAIMS');
