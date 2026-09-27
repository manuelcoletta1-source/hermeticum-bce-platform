'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  GATE_RESULT,
  LEVEL1_STATUS,
  SOURCE_REFS,
  REQUIRED_LEVEL1_WORKSTREAMS,
  BLOCKED_DISTRACTIONS,
  buildLevel1LaunchRefocusGate
} = require('../../../runtime/level1/build-prog-066-level1-launch-refocus-gate.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level1/prog-066-level1-launch-refocus-gate.json';
const mdPath = 'docs/launch/level1/prog-066-level1-launch-refocus-gate.md';
const runtimePath = 'runtime/level1/build-prog-066-level1-launch-refocus-gate.js';

for (const p of [docPath, mdPath, runtimePath, ...Object.values(SOURCE_REFS)]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);

assert.equal(doc.proto, 'HBCE-L1-PROG-066-LAUNCH-REFOCUS-GATE-v1');
assert.equal(doc.kind, 'HBCE_LEVEL1_LAUNCH_REFOCUS_GATE');
assert.equal(doc.issue_id, 'PROG-066');
assert.equal(doc.priority, 'LEVEL1-LAUNCH-REFOCUS-GATE');
assert.equal(doc.gate_result, GATE_RESULT);
assert.equal(doc.level1_track_status, LEVEL1_STATUS);

const regenerated = buildLevel1LaunchRefocusGate({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.source_inventory.length, 3);
assert.equal(doc.source_artifact_hashes_valid, true);
for (const source of doc.source_inventory) assert.equal(source.revision_hash_valid, true);

assert.equal(doc.inherited_portfolio_boundary.level1_role, 'PRIMARY_LAUNCH_PRODUCT');
assert.equal(doc.inherited_portfolio_boundary.level2_role, 'FROZEN_EVIDENCE_BOUND_TRACK');
assert.equal(doc.inherited_portfolio_boundary.level3_role, 'PILOT_INTAKE_SHADOW_TRACK');
assert.equal(doc.inherited_portfolio_boundary.ai_models_are_interfaces_not_authority, true);
assert.equal(doc.inherited_portfolio_boundary.hbce_is_governance_evidence_infrastructure_not_ai_system, true);

assert.equal(doc.inherited_level2_boundary.level2_frozen, true);
assert.equal(doc.inherited_level2_boundary.level2_not_pilot_ready, true);
assert.equal(doc.inherited_level2_boundary.level2_no_b2g_readiness_claim, true);
assert.equal(doc.inherited_level2_boundary.level2_reopen_requires_new_evidence_and_explicit_program, true);

assert.equal(doc.inherited_level3_boundary.level3_c1_conclusion, 'LEVEL3_C1_INTAKE_READY_NOT_PILOT_READY');
assert.equal(doc.inherited_level3_boundary.level3_intake_ready, true);
assert.equal(doc.inherited_level3_boundary.level3_maximum_scope, 'DRY_RUN_NO_ACTUATION');
assert.equal(doc.inherited_level3_boundary.level3_pilot_ready, false);
assert.equal(doc.inherited_level3_boundary.level3_physical_effect_proven, false);
assert.equal(doc.inherited_level3_boundary.level3_live_control_ready, false);
assert.equal(doc.inherited_level3_boundary.level3_physical_actuation_permitted, false);

assert.equal(doc.refocus_decision.decision, 'REFOCUS_ON_LEVEL1_LAUNCH_PACK');
assert.equal(doc.refocus_decision.level1_is_primary_execution_track, true);
assert.equal(doc.refocus_decision.level2_work_is_blocked_without_new_evidence_trigger, true);
assert.equal(doc.refocus_decision.level3_work_is_blocked_from_pilot_promotion_without_new_positive_gate, true);
assert.equal(doc.refocus_decision.new_scope_expansion_allowed, false);

assert.deepEqual(doc.required_level1_workstreams, REQUIRED_LEVEL1_WORKSTREAMS);
assert.deepEqual(doc.blocked_distractions, BLOCKED_DISTRACTIONS);

assert.equal(doc.readiness_state.level1_refocus_gate_created, true);
assert.equal(doc.readiness_state.level1_refocus_gate_evaluated, true);
assert.equal(doc.readiness_state.level1_launch_track_refocused, true);
assert.equal(doc.readiness_state.level1_launch_ready, false);
assert.equal(doc.readiness_state.level1_release_candidate_ready, false);
assert.equal(doc.readiness_state.level1_client_pack_ready, false);
assert.equal(doc.readiness_state.level2_reopened, false);
assert.equal(doc.readiness_state.level3_promoted_to_pilot_ready, false);
assert.equal(doc.readiness_state.physical_effect_claim_allowed, false);
assert.equal(doc.readiness_state.live_control_claim_allowed, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-067-HBCE-LEVEL1-LAUNCH-PACK-SCOPE-LOCK');

assert.equal(doc.non_claims.level1_launch_ready, false);
assert.equal(doc.non_claims.level1_release_candidate_ready, false);
assert.equal(doc.non_claims.level1_client_pack_ready, false);
assert.equal(doc.non_claims.level2_pilot_ready, false);
assert.equal(doc.non_claims.level2_b2g_ready, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.physical_effect_proven, false);
assert.equal(doc.non_claims.live_control_ready, false);
assert.equal(doc.non_claims.production_ready, false);

assert.match(md, /LEVEL1_PRIMARY_LAUNCH_TRACK_REFOCUSED_NOT_LAUNCH_READY/);
assert.match(md, /LEVEL1_LAUNCH_REFOCUS_GATE_OPEN/);
assert.match(md, /This gate does not certify Level 1 launch readiness/);
assert.match(md, /PROG-067-HBCE-LEVEL1-LAUNCH-PACK-SCOPE-LOCK/);

console.log('PASS PROG-066-LEVEL1-REFOCUS-DOCS-EXIST');
console.log('PASS PROG-066-LEVEL1-REFOCUS-HASH-STABLE');
console.log('PASS PROG-066-BUILDER-STABLE');
console.log('PASS PROG-066-SOURCE-HASHES-VALID');
console.log('PASS PROG-066-INHERITS-LEVEL2-FREEZE');
console.log('PASS PROG-066-INHERITS-LEVEL3-C1-NOT-PILOT-READY');
console.log('PASS PROG-066-REFOCUS-ON-LEVEL1-LAUNCH-PACK');
console.log('PASS PROG-066-NO-SCOPE-EXPANSION');
console.log('PASS PROG-066-NEXT-PROG-067-RECORDED');
console.log('PASS PROG-066-NO-UNSUPPORTED-READINESS-CLAIMS');
