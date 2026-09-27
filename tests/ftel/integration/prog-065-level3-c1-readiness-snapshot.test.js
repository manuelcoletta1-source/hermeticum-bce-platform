'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  SNAPSHOT_STATUS,
  SOURCE_REFS,
  ALLOWED_C1_SCOPE,
  BLOCKED_C1_SCOPE,
  buildLevel3C1ReadinessSnapshot
} = require('../../../runtime/level3/build-prog-065-level3-c1-readiness-snapshot.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level3/v0-1-c1/prog-065-level3-c1-readiness-snapshot.json';
const mdPath = 'docs/launch/level3/v0-1-c1/prog-065-level3-c1-readiness-snapshot.md';
const runtimePath = 'runtime/level3/build-prog-065-level3-c1-readiness-snapshot.js';

for (const p of [docPath, mdPath, runtimePath, ...SOURCE_REFS]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const physicalEffectGate = json('docs/launch/level3/v0-1-c1/prog-064-physical-effect-evaluation-gate.json');

assert.equal(doc.proto, 'HBCE-L3-PROG-065-C1-READINESS-SNAPSHOT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL3_C1_READINESS_SNAPSHOT');
assert.equal(doc.issue_id, 'PROG-065');
assert.equal(doc.priority, 'LEVEL3-C1-READINESS-SNAPSHOT');
assert.equal(doc.snapshot_status, SNAPSHOT_STATUS);

const regenerated = buildLevel3C1ReadinessSnapshot({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.source_inventory.length, 7);
assert.deepEqual(doc.source_inventory.map((entry) => entry.ref), SOURCE_REFS);
assert.equal(doc.source_artifact_chain_complete, true);
assert.equal(doc.source_artifact_hashes_valid, true);
for (const entry of doc.source_inventory) assert.equal(entry.revision_hash_valid, true);

const issues = new Set(doc.source_inventory.map((entry) => entry.issue_id));
for (const issue of ['PROG-058', 'PROG-059', 'PROG-060', 'PROG-061', 'PROG-062', 'PROG-063', 'PROG-064']) {
  assert.equal(issues.has(issue), true, `${issue} must be included`);
}

assert.equal(doc.inherited_physical_effect_gate.gate_result, physicalEffectGate.gate_result);
assert.equal(doc.inherited_physical_effect_gate.gate_result, 'LEVEL3_PHYSICAL_EFFECT_EVALUATION_GATE_BLOCKED');
assert.equal(doc.inherited_physical_effect_gate.physical_effect_proven, false);
assert.equal(doc.inherited_physical_effect_gate.live_effect_claim_allowed, false);
assert.equal(doc.inherited_physical_effect_gate.physical_actuation_permitted, false);
assert.equal(doc.inherited_physical_effect_gate.controlled_actuation_ready, false);
assert.equal(doc.inherited_physical_effect_gate.level3_pilot_ready, false);
assert.equal(doc.inherited_physical_effect_gate.level3_physical_deployment_ready, false);
assert.equal(doc.inherited_physical_effect_gate.production_ready, false);

assert.deepEqual(doc.c1_scope_boundary.allowed_without_new_evidence, ALLOWED_C1_SCOPE);
assert.deepEqual(doc.c1_scope_boundary.blocked_without_new_evidence, BLOCKED_C1_SCOPE);
assert.equal(doc.c1_scope_boundary.maximum_current_operational_scope, 'DRY_RUN_NO_ACTUATION');
assert.equal(doc.c1_scope_boundary.controlled_actuation_requires_new_evidence, true);
assert.equal(doc.c1_scope_boundary.pilot_ready_promotion_requires_new_positive_gate, true);
assert.equal(doc.c1_scope_boundary.physical_effect_claim_requires_new_positive_gate, true);

assert.equal(doc.c1_evidence_chain_summary.pilot_intake_pack_created, true);
assert.equal(doc.c1_evidence_chain_summary.physical_action_envelope_created, true);
assert.equal(doc.c1_evidence_chain_summary.physical_safety_envelope_created, true);
assert.equal(doc.c1_evidence_chain_summary.safe_hold_estop_contract_created, true);
assert.equal(doc.c1_evidence_chain_summary.controller_receipt_contract_created, true);
assert.equal(doc.c1_evidence_chain_summary.sensor_evidence_contract_created, true);
assert.equal(doc.c1_evidence_chain_summary.physical_effect_evaluation_gate_created, true);
assert.equal(doc.c1_evidence_chain_summary.physical_effect_evaluation_gate_result, 'LEVEL3_PHYSICAL_EFFECT_EVALUATION_GATE_BLOCKED');

assert.equal(doc.readiness_state.level3_c1_snapshot_created, true);
assert.equal(doc.readiness_state.level3_c1_snapshot_evaluated, true);
assert.equal(doc.readiness_state.level3_c1_artifact_chain_complete, true);
assert.equal(doc.readiness_state.level3_c1_artifact_hashes_valid, true);
assert.equal(doc.readiness_state.intake_ready, true);
assert.equal(doc.readiness_state.simulation_boundary_representable, true);
assert.equal(doc.readiness_state.observer_mode_boundary_representable, true);
assert.equal(doc.readiness_state.dry_run_no_actuation_boundary_representable, true);
assert.equal(doc.readiness_state.physical_effect_proven, false);
assert.equal(doc.readiness_state.live_effect_claim_allowed, false);
assert.equal(doc.readiness_state.physical_actuation_permitted, false);
assert.equal(doc.readiness_state.controlled_actuation_ready, false);
assert.equal(doc.readiness_state.level3_pilot_ready, false);
assert.equal(doc.readiness_state.level3_physical_deployment_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.operational_conclusion.conclusion, 'LEVEL3_C1_INTAKE_READY_NOT_PILOT_READY');
assert.equal(doc.operational_conclusion.can_be_presented_as_level3_intake_pack, true);
assert.equal(doc.operational_conclusion.can_be_presented_as_simulation_observer_dry_run_boundary, true);
assert.equal(doc.operational_conclusion.can_be_presented_as_live_control_ready, false);
assert.equal(doc.operational_conclusion.can_be_presented_as_physical_effect_proven, false);
assert.equal(doc.operational_conclusion.can_be_presented_as_pilot_ready, false);
assert.equal(doc.operational_conclusion.can_be_presented_as_deployment_ready, false);

assert.equal(doc.next_required_program, 'PROG-066-HBCE-LEVEL1-LAUNCH-REFOCUS-GATE');

assert.equal(doc.non_claims.physical_effect_proven, false);
assert.equal(doc.non_claims.live_effect_claim_allowed, false);
assert.equal(doc.non_claims.physical_actuation_permitted, false);
assert.equal(doc.non_claims.controlled_actuation_ready, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL3_C1_READINESS_SNAPSHOT_CREATED_NOT_PILOT_READY/);
assert.match(md, /LEVEL3_C1_INTAKE_READY_NOT_PILOT_READY/);
assert.match(md, /It is not pilot-ready/);
assert.match(md, /It does not prove physical effect/);
assert.match(md, /PROG-066-HBCE-LEVEL1-LAUNCH-REFOCUS-GATE/);

console.log('PASS PROG-065-LEVEL3-C1-SNAPSHOT-DOCS-EXIST');
console.log('PASS PROG-065-LEVEL3-C1-SNAPSHOT-HASH-STABLE');
console.log('PASS PROG-065-BUILDER-STABLE');
console.log('PASS PROG-065-SOURCE-CHAIN-COMPLETE');
console.log('PASS PROG-065-SOURCE-HASHES-VALID');
console.log('PASS PROG-065-INHERITS-BLOCKED-PHYSICAL-EFFECT-GATE');
console.log('PASS PROG-065-INTAKE-READY-NOT-PILOT-READY');
console.log('PASS PROG-065-DRY-RUN-MAX-SCOPE');
console.log('PASS PROG-065-NEXT-PROG-066-LEVEL1-REFOCUS-RECORDED');
console.log('PASS PROG-065-NO-UNSUPPORTED-READINESS-CLAIMS');
