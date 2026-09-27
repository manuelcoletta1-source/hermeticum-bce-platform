'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  CONTRACT_STATUS,
  REQUIRED_FIELDS,
  OPERATING_MODES,
  VALIDATOR_CODES,
  buildPhysicalSafetyEnvelopeContract
} = require('../../../runtime/level3/build-prog-060-physical-safety-envelope-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level3/v0-1-c1/prog-060-physical-safety-envelope-contract.json';
const mdPath = 'docs/launch/level3/v0-1-c1/prog-060-physical-safety-envelope-contract.md';
const runtimePath = 'runtime/level3/build-prog-060-physical-safety-envelope-contract.js';
const sourcePath = 'docs/launch/level3/v0-1-c1/prog-059-physical-action-envelope-contract.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-L3-PROG-060-PHYSICAL-SAFETY-ENVELOPE-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL3_PHYSICAL_SAFETY_ENVELOPE_CONTRACT');
assert.equal(doc.issue_id, 'PROG-060');
assert.equal(doc.priority, 'LEVEL3-PHYSICAL-SAFETY-ENVELOPE-CONTRACT');
assert.equal(doc.source_physical_action_envelope_contract_revision_hash, source.revision_hash);
assert.equal(doc.source_physical_action_envelope_contract_revision_hash_valid, true);

const regenerated = buildPhysicalSafetyEnvelopeContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_action_boundary.contract_status, 'LEVEL3_PHYSICAL_ACTION_ENVELOPE_CONTRACT_CREATED_NOT_ACTUATION_READY');
assert.equal(doc.inherited_action_boundary.action_is_instruction_not_authority, true);
assert.equal(doc.inherited_action_boundary.model_may_not_authorize_action, true);
assert.equal(doc.inherited_action_boundary.human_authorization_required, true);
assert.equal(doc.inherited_action_boundary.physical_safety_envelope_required, true);
assert.equal(doc.inherited_action_boundary.controlled_actuation_ready_by_source, false);
assert.equal(doc.inherited_action_boundary.physical_deployment_ready_by_source, false);

assert.equal(doc.contract_status, CONTRACT_STATUS);
assert.deepEqual(doc.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.operating_modes, OPERATING_MODES);
assert.deepEqual(doc.validator_codes, VALIDATOR_CODES);

assert.equal(doc.physical_safety_envelope_contract.safety_envelope_is_constraint_not_certification, true);
assert.equal(doc.physical_safety_envelope_contract.safety_envelope_does_not_certify_machine_safety, true);
assert.equal(doc.physical_safety_envelope_contract.safety_envelope_does_not_authorize_live_control, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_missing_required_field, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_workspace_bounds_missing, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_prohibited_zones_missing, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_safe_hold_missing, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_emergency_stop_missing, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_sensor_monitoring_missing, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_human_supervision_missing, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_safety_certification_claimed, true);
assert.equal(doc.physical_safety_envelope_contract.fail_closed_if_live_control_requested_without_new_evidence, true);

assert.equal(doc.allowed_without_new_evidence.simulation_only_safety_boundary, true);
assert.equal(doc.allowed_without_new_evidence.observer_mode_safety_boundary, true);
assert.equal(doc.allowed_without_new_evidence.dry_run_no_actuation_safety_boundary, true);
assert.equal(doc.allowed_without_new_evidence.live_control_safety_certification, false);
assert.equal(doc.allowed_without_new_evidence.controlled_actuation_safety_clearance, false);
assert.equal(doc.allowed_without_new_evidence.autonomous_physical_control, false);

assert.equal(doc.minimal_valid_safety_envelope_example.operating_mode, 'SIMULATION_ONLY');
assert.equal(doc.minimal_valid_safety_envelope_example.sensor_monitoring_plan.sensor_evidence_required, true);
assert.equal(doc.minimal_valid_safety_envelope_example.sensor_monitoring_plan.missing_sensor_evidence_blocks_effect_claim, true);
assert.equal(doc.minimal_valid_safety_envelope_example.force_or_energy_bounds.live_force_application_allowed, false);
assert.ok(doc.minimal_valid_safety_envelope_example.prohibited_zones.includes('ZONE::HUMAN_OCCUPANCY'));
assert.ok(doc.minimal_valid_safety_envelope_example.environment_assumptions.includes('no_live_physical_body'));

const vectorIds = new Set(doc.validation_vectors.map((v) => v.id));
assert.equal(vectorIds.has('L3-PSE-T01'), true);
assert.equal(vectorIds.has('L3-PSE-T02'), true);
assert.equal(vectorIds.has('L3-PSE-T03'), true);
assert.equal(vectorIds.has('L3-PSE-T04'), true);
assert.equal(vectorIds.has('L3-PSE-POS-001'), true);

assert.equal(doc.readiness_state.physical_safety_envelope_contract_created, true);
assert.equal(doc.readiness_state.physical_safety_envelope_contract_evaluated, true);
assert.equal(doc.readiness_state.safety_boundary_representable, true);
assert.equal(doc.readiness_state.simulation_safety_boundary_representable, true);
assert.equal(doc.readiness_state.observer_mode_safety_boundary_representable, true);
assert.equal(doc.readiness_state.dry_run_no_actuation_safety_boundary_representable, true);
assert.equal(doc.readiness_state.safety_certified, false);
assert.equal(doc.readiness_state.live_control_ready, false);
assert.equal(doc.readiness_state.controlled_actuation_ready, false);
assert.equal(doc.readiness_state.pilot_ready, false);
assert.equal(doc.readiness_state.physical_deployment_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-061-HBCE-LEVEL3-SAFE-HOLD-AND-ESTOP-CONTRACT');

assert.equal(doc.non_claims.safety_certification, false);
assert.equal(doc.non_claims.live_control_ready, false);
assert.equal(doc.non_claims.controlled_actuation_ready, false);
assert.equal(doc.non_claims.physical_actuation_permitted, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.autonomous_physical_control, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL3_PHYSICAL_SAFETY_ENVELOPE_CONTRACT_CREATED_NOT_SAFETY_CERTIFIED/);
assert.match(md, /It does not certify machine safety/);
assert.match(md, /It does not authorize live control/);
assert.match(md, /Missing safe hold, missing emergency stop, missing sensor monitoring or missing human supervision fails closed/);
assert.match(md, /PROG-061-HBCE-LEVEL3-SAFE-HOLD-AND-ESTOP-CONTRACT/);

console.log('PASS PROG-060-PHYSICAL-SAFETY-ENVELOPE-DOCS-EXIST');
console.log('PASS PROG-060-PHYSICAL-SAFETY-ENVELOPE-HASH-STABLE');
console.log('PASS PROG-060-BUILDER-STABLE');
console.log('PASS PROG-060-SOURCE-PROG-059-INTEGRITY-VALID');
console.log('PASS PROG-060-SAFETY-ENVELOPE-IS-CONSTRAINT-NOT-CERTIFICATION');
console.log('PASS PROG-060-DOES-NOT-AUTHORIZE-LIVE-CONTROL');
console.log('PASS PROG-060-SAFE-HOLD-ESTOP-SENSOR-HUMAN-FAIL-CLOSED');
console.log('PASS PROG-060-NO-PHYSICAL-ACTUATION-PERMITTED');
console.log('PASS PROG-060-NEXT-PROG-061-RECORDED');
console.log('PASS PROG-060-NO-UNSUPPORTED-READINESS-CLAIMS');
