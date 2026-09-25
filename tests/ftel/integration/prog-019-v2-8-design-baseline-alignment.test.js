'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');

const repoRoot = path.resolve(__dirname, '../../..');

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function assertPathExists(relativePath) {
  assert.equal(existsRelative(relativePath), true, `${relativePath} must exist`);
}

const mdPath = 'docs/launch/level1/v2-8-design-baseline-alignment.md';
const jsonPath = 'docs/launch/level1/v2-8-design-baseline-alignment.json';

assertPathExists(mdPath);
assertPathExists(jsonPath);

const md = readText(mdPath);
const record = readJson(jsonPath);

assert.equal(record.proto, 'HBCE-P0-V2-8-DESIGN-BASELINE-ALIGNMENT-v1');
assert.equal(record.kind, 'HBCE_P0_V2_8_DESIGN_BASELINE_ALIGNMENT');
assert.equal(record.document_code, 'HBCE-B2B-L1-JC2-MATRIX-PROG-2027-0001');
assert.equal(record.specification_baseline, 'V2.8 - 25 September 2026');
assert.equal(record.design_baseline, true);
assert.equal(record.execution_hardening_release, true);
assert.equal(record.source_sha256, 'c8d281ad6d397d5a1f48cfb8ef99c23d7a61e6844951cfac341f519b4c8b111e');
assert.equal(record.status, 'IN_PROGRESS');
assert.equal(record.gate_claimed, false);
assert.equal(record.pilot_ready_claimed, false);
assert.equal(record.g0_ready, false);
assert.equal(record.g1_ready, false);
assert.equal(record.g2_ready, false);
assert.equal(record.g5_ready, false);
assert.equal(record.pdf_attests_gate, false);

const bodyForHash = { ...record };
delete bodyForHash.record_hash;
assert.equal(record.record_hash, sha256Digest(bodyForHash));

assert.equal(record.agent_boundary.joker_c2, 'AI_AGENT_GOVERNED');
assert.equal(record.agent_boundary.joker_c2_is_authority, false);
assert.equal(record.agent_boundary.personalization_changes_trust, false);
assert.deepEqual(record.agent_boundary.hbce_core_retains, ['authority', 'policy', 'dispatch', 'evidence']);

for (const invariant of [
  'NO_AUTHENTICATED_PRINCIPAL_NO_OPERATIONAL_PROPOSAL',
  'NO_ELIGIBLE_REVIEWER_NO_REAL_PILOT',
  'NO_REQUIRED_WITNESS_NO_DISPATCH'
]) {
  assert.equal(record.critical_invariants.includes(invariant), true, `${invariant} must be recorded`);
}

for (const objectName of [
  'PreAuthSessionPolicy',
  'SessionAuthenticationTransition',
  'WitnessRequirementPolicy',
  'PilotSliceProfile',
  'ReviewerReadinessRecord',
  'NormativeDependencyEntry',
  'NonIdempotentRecoveryPolicy',
  'MatrixRow'
]) {
  assert.equal(record.execution_hardening_objects.includes(objectName), true, `${objectName} must be recorded`);
}

const adrIds = record.v2_8_adr_register.map((adr) => adr.id);
for (const adrId of ['ADR-039', 'ADR-040', 'ADR-041', 'ADR-042', 'ADR-043', 'ADR-044']) {
  assert.equal(adrIds.includes(adrId), true, `${adrId} must be recorded`);
}

const backlogIds = record.v2_8_backlog.map((item) => item.id);
for (const backlogId of ['V2-055', 'V2-056', 'V2-057', 'V2-058', 'V2-059', 'V2-060', 'V2-061']) {
  assert.equal(backlogIds.includes(backlogId), true, `${backlogId} must be recorded`);
}

assert.equal(record.v2_8_backlog.some((item) => item.scope === 'PreAuthSessionPolicy'), true);
assert.equal(record.v2_8_backlog.some((item) => item.scope === 'WitnessRequirementPolicy'), true);
assert.equal(record.v2_8_backlog.some((item) => item.scope === 'Reviewer Critical Path'), true);
assert.equal(record.v2_8_backlog.some((item) => item.scope === 'Normative Dependency Matrix'), true);
assert.equal(record.v2_8_backlog.some((item) => item.scope === 'NonIdempotentRecoveryPolicy'), true);
assert.equal(record.v2_8_backlog.some((item) => item.scope === 'Matrix completeness verifier'), true);

const testRanges = record.mandatory_test_ranges.map((item) => item.range);
assert.equal(testRanges.includes('T113-T140'), true);

assert.equal(record.minimum_pilot_slice.some((item) => item.capability === 'One controlled target + one mutable action'), true);
assert.equal(record.minimum_pilot_slice.some((item) => item.status === 'CONDITIONAL_P0'), true);
assert.equal(record.minimum_pilot_slice.some((item) => item.status === 'OUT_OF_CRITICAL_PATH'), true);

for (const gate of ['g0', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8']) {
  assert.equal(typeof record.gate_extension[gate], 'string');
  assert.equal(record.gate_extension[gate].length > 0, true);
}

for (const status of ['PROVEN', 'NOT_PROVEN', 'BLOCKED', 'DEFERRED', 'DEMO_ONLY']) {
  assert.equal(typeof record.matrix_status_semantics[status], 'string');
}

assert.equal(Array.isArray(record.component_inventory), true);
assert.equal(record.component_inventory.length >= 10, true);

for (const component of record.component_inventory) {
  assert.equal(typeof component.id, 'string');
  assert.equal(typeof component.path, 'string');
  assert.equal(typeof component.status, 'string');
  assert.equal(typeof component.limitation, 'string');
  assertPathExists(component.path);
  assert.equal(component.path.includes('hbce-requests'), false, 'inventory must not reference non-existing hbce-requests package');
}

assert.equal(record.non_claims.g0_spec_capacity_ready, false);
assert.equal(record.non_claims.g1_demo_ready, false);
assert.equal(record.non_claims.g2_pilot_candidate, false);
assert.equal(record.non_claims.g5_pilot_start_ready, false);
assert.equal(record.non_claims.real_pilot, false);
assert.equal(record.non_claims.production_ready, false);
assert.equal(record.non_claims.compliance_certification, false);
assert.equal(record.non_claims.legal_liability_proof, false);
assert.equal(record.non_claims.physical_truth_proof, false);
assert.equal(record.non_claims.independent_review_completed, false);
assert.equal(record.non_claims.required_witness_available, false);
assert.equal(record.non_claims.customer_scope_ready, false);

assert.match(md, /V2\.8 Design Baseline Alignment/);
assert.match(md, /DESIGN BASELINE/);
assert.match(md, /Execution Hardening Release/);
assert.match(md, /No further theory-only refactor/);
assert.match(md, /No authenticated principal, no operational proposal/);
assert.match(md, /No eligible reviewer, no real pilot/);
assert.match(md, /No required witness, no dispatch/);
assert.match(md, /V2-055/);
assert.match(md, /V2-061/);
assert.match(md, /T113-T140/);
assert.match(md, /Minimum Level 1 Pilot Slice/);
assert.match(md, /MATRIX Status Semantics/);
assert.match(md, /G2 PILOT_CANDIDATE/);
assert.match(md, /G5 PILOT_START_READY/);
assert.match(md, /does not claim/);

console.log('PASS PROG-019-V28-DESIGN-BASELINE-DOCS-EXIST');
console.log('PASS PROG-019-V28-DESIGN-BASELINE-HASH-IS-STABLE');
console.log('PASS PROG-019-V28-DESIGN-BASELINE-FREEZE-RULE-RECORDED');
console.log('PASS PROG-019-V28-DESIGN-BASELINE-CRITICAL-INVARIANTS-RECORDED');
console.log('PASS PROG-019-V28-DESIGN-BASELINE-OBJECTS-RECORDED');
console.log('PASS PROG-019-V28-DESIGN-BASELINE-BACKLOG-RECORDED');
console.log('PASS PROG-019-V28-DESIGN-BASELINE-MINIMUM-SLICE-RECORDED');
console.log('PASS PROG-019-V28-DESIGN-BASELINE-GATES-EXTENDED');
console.log('PASS PROG-019-V28-DESIGN-BASELINE-NO-PILOT-CLAIM');
