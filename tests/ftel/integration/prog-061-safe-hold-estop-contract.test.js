'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  CONTRACT_STATUS,
  TRIGGERS,
  STATES,
  VALIDATOR_CODES,
  buildSafeHoldEstopContract
} = require('../../../runtime/level3/build-prog-061-safe-hold-estop-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level3/v0-1-c1/prog-061-safe-hold-estop-contract.json';
const mdPath = 'docs/launch/level3/v0-1-c1/prog-061-safe-hold-estop-contract.md';
const runtimePath = 'runtime/level3/build-prog-061-safe-hold-estop-contract.js';
const sourcePath = 'docs/launch/level3/v0-1-c1/prog-060-physical-safety-envelope-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-L3-PROG-061-SAFE-HOLD-ESTOP-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL3_SAFE_HOLD_ESTOP_CONTRACT');
assert.equal(doc.issue_id, 'PROG-061');
assert.equal(doc.priority, 'LEVEL3-SAFE-HOLD-AND-ESTOP-CONTRACT');
assert.equal(doc.source_physical_safety_envelope_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_physical_safety_envelope_contract_revision_hash_valid, true);

const regenerated = buildSafeHoldEstopContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.contract_status, CONTRACT_STATUS);
assert.deepEqual(doc.trigger_set, TRIGGERS);
assert.deepEqual(doc.states, STATES);
assert.deepEqual(doc.validator_codes, VALIDATOR_CODES);

assert.equal(doc.inherited_safety_boundary.contract_status, 'LEVEL3_PHYSICAL_SAFETY_ENVELOPE_CONTRACT_CREATED_NOT_SAFETY_CERTIFIED');
assert.equal(doc.inherited_safety_boundary.safe_hold_required, true);
assert.equal(doc.inherited_safety_boundary.emergency_stop_required, true);
assert.equal(doc.inherited_safety_boundary.safety_certified_by_source, false);
assert.equal(doc.inherited_safety_boundary.live_control_ready_by_source, false);

assert.equal(doc.safe_hold_estop_contract.safe_hold_is_required_on_boundary_uncertainty, true);
assert.equal(doc.safe_hold_estop_contract.estop_is_required_on_manual_or_system_stop_request, true);
assert.equal(doc.safe_hold_estop_contract.estop_dominates_safe_hold, true);
assert.equal(doc.safe_hold_estop_contract.reset_requires_human_authorization, true);
assert.equal(doc.safe_hold_estop_contract.return_to_scope_requires_new_evaluation, true);
assert.equal(doc.safe_hold_estop_contract.autonomous_reset_disallowed, true);
assert.equal(doc.safe_hold_estop_contract.live_control_not_authorized, true);
assert.equal(doc.safe_hold_estop_contract.physical_actuation_not_permitted, true);
assert.equal(doc.safe_hold_estop_contract.model_may_report_state, true);
assert.equal(doc.safe_hold_estop_contract.model_may_not_clear_safe_hold, true);
assert.equal(doc.safe_hold_estop_contract.model_may_not_clear_estop, true);

const blocked = doc.transition_rules.filter((rule) => rule.permitted === false);
assert.ok(blocked.some((rule) => rule.fail_code === 'AUTONOMOUS_RESET_BLOCKED'));
assert.ok(blocked.some((rule) => rule.fail_code === 'RESET_AUTHORIZATION_MISSING'));

const vectorIds = new Set(doc.validation_vectors.map((v) => v.id));
assert.equal(vectorIds.has('L3-SHE-T01'), true);
assert.equal(vectorIds.has('L3-SHE-T02'), true);
assert.equal(vectorIds.has('L3-SHE-T03'), true);
assert.equal(vectorIds.has('L3-SHE-T04'), true);
assert.equal(vectorIds.has('L3-SHE-POS-001'), true);

assert.equal(doc.readiness_state.safe_hold_estop_contract_created, true);
assert.equal(doc.readiness_state.safe_hold_estop_contract_evaluated, true);
assert.equal(doc.readiness_state.safe_hold_representable, true);
assert.equal(doc.readiness_state.emergency_stop_representable, true);
assert.equal(doc.readiness_state.reset_requires_human_authorization, true);
assert.equal(doc.readiness_state.return_to_scope_requires_new_evaluation, true);
assert.equal(doc.readiness_state.live_control_ready, false);
assert.equal(doc.readiness_state.physical_actuation_permitted, false);
assert.equal(doc.readiness_state.safety_certified, false);
assert.equal(doc.readiness_state.pilot_ready, false);
assert.equal(doc.readiness_state.physical_deployment_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-062-HBCE-LEVEL3-CONTROLLER-RECEIPT-CONTRACT');

assert.equal(doc.non_claims.live_control_ready, false);
assert.equal(doc.non_claims.physical_actuation_permitted, false);
assert.equal(doc.non_claims.safety_certification, false);
assert.equal(doc.non_claims.autonomous_reset_allowed, false);
assert.equal(doc.non_claims.autonomous_physical_control, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL3_SAFE_HOLD_ESTOP_CONTRACT_CREATED_NOT_LIVE_CONTROL_READY/);
assert.match(md, /Emergency Stop dominates Safe Hold/);
assert.match(md, /AI models may not clear Safe Hold/);
assert.match(md, /AI models may not clear Emergency Stop/);
assert.match(md, /PROG-062-HBCE-LEVEL3-CONTROLLER-RECEIPT-CONTRACT/);

console.log('PASS PROG-061-SAFE-HOLD-ESTOP-DOCS-EXIST');
console.log('PASS PROG-061-SAFE-HOLD-ESTOP-HASH-STABLE');
console.log('PASS PROG-061-BUILDER-STABLE');
console.log('PASS PROG-061-SOURCE-PROG-060-INTEGRITY-VALID');
console.log('PASS PROG-061-ESTOP-DOMINATES-SAFE-HOLD');
console.log('PASS PROG-061-RESET-REQUIRES-HUMAN-AUTHORIZATION');
console.log('PASS PROG-061-MODEL-CANNOT-CLEAR-SAFE-HOLD-OR-ESTOP');
console.log('PASS PROG-061-NO-LIVE-CONTROL-OR-PHYSICAL-ACTUATION');
console.log('PASS PROG-061-NEXT-PROG-062-RECORDED');
console.log('PASS PROG-061-NO-UNSUPPORTED-READINESS-CLAIMS');
