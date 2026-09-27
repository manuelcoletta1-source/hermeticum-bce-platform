'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  CONTRACT_STATUS,
  REQUIRED_FIELDS,
  ACTION_CLASSES,
  VALIDATOR_CODES,
  buildPhysicalActionEnvelopeContract
} = require('../../../runtime/level3/build-prog-059-physical-action-envelope-contract.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level3/v0-1-c1/prog-059-physical-action-envelope-contract.json';
const mdPath = 'docs/launch/level3/v0-1-c1/prog-059-physical-action-envelope-contract.md';
const runtimePath = 'runtime/level3/build-prog-059-physical-action-envelope-contract.js';
const sourcePath = 'docs/launch/level3/v0-1-c1/prog-058-level3-pilot-intake-pack.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-L3-PROG-059-PHYSICAL-ACTION-ENVELOPE-CONTRACT-v1');
assert.equal(doc.kind, 'HBCE_LEVEL3_PHYSICAL_ACTION_ENVELOPE_CONTRACT');
assert.equal(doc.issue_id, 'PROG-059');
assert.equal(doc.priority, 'LEVEL3-PHYSICAL-ACTION-ENVELOPE-CONTRACT');
assert.equal(doc.source_level3_pilot_intake_pack_revision_hash, source.revision_hash);
assert.equal(doc.source_level3_pilot_intake_pack_revision_hash_valid, true);

const regenerated = buildPhysicalActionEnvelopeContract({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_intake_boundary.intake_status, 'LEVEL3_PILOT_INTAKE_PACK_CREATED_NOT_PILOT_READY');
assert.equal(doc.inherited_intake_boundary.simulation_first, true);
assert.equal(doc.inherited_intake_boundary.observer_mode_first, true);
assert.equal(doc.inherited_intake_boundary.no_uncontrolled_physical_actuation, true);
assert.equal(doc.inherited_intake_boundary.controlled_actuation_requires_new_evidence, true);
assert.equal(doc.inherited_intake_boundary.pilot_ready_by_source, false);
assert.equal(doc.inherited_intake_boundary.physical_deployment_ready_by_source, false);

assert.equal(doc.contract_status, CONTRACT_STATUS);
assert.deepEqual(doc.required_fields, REQUIRED_FIELDS);
assert.deepEqual(doc.action_classes, ACTION_CLASSES);
assert.deepEqual(doc.validator_codes, VALIDATOR_CODES);

assert.equal(doc.physical_action_envelope_contract.action_is_instruction_not_authority, true);
assert.equal(doc.physical_action_envelope_contract.model_may_describe_action, true);
assert.equal(doc.physical_action_envelope_contract.model_may_not_authorize_action, true);
assert.equal(doc.physical_action_envelope_contract.human_authorization_required, true);
assert.equal(doc.physical_action_envelope_contract.controller_receipt_required_before_effect_claim, true);
assert.equal(doc.physical_action_envelope_contract.physical_safety_envelope_required, true);
assert.equal(doc.physical_action_envelope_contract.evidence_capture_plan_required, true);
assert.equal(doc.physical_action_envelope_contract.fail_closed_if_missing_required_field, true);
assert.equal(doc.physical_action_envelope_contract.fail_closed_if_uncontrolled_actuation_requested, true);
assert.equal(doc.physical_action_envelope_contract.fail_closed_if_model_is_authority, true);
assert.equal(doc.physical_action_envelope_contract.fail_closed_if_safety_envelope_missing, true);

assert.equal(doc.allowed_without_new_evidence.simulated_motion, true);
assert.equal(doc.allowed_without_new_evidence.simulated_state_change, true);
assert.equal(doc.allowed_without_new_evidence.observer_mode_request, true);
assert.equal(doc.allowed_without_new_evidence.dry_run_no_actuation, true);
assert.equal(doc.allowed_without_new_evidence.controlled_actuation, false);
assert.equal(doc.allowed_without_new_evidence.uncontrolled_physical_actuation, false);

assert.equal(doc.minimal_valid_envelope_example.action_class, 'SIMULATED_MOTION');
assert.equal(doc.minimal_valid_envelope_example.environment_ref, 'ENV::SIMULATION_ONLY');
assert.equal(doc.minimal_valid_envelope_example.evidence_capture_plan.controller_receipt_required, true);
assert.equal(doc.minimal_valid_envelope_example.evidence_capture_plan.sensor_evidence_required, true);
assert.ok(doc.minimal_valid_envelope_example.forbidden_effects.includes('live_physical_motion'));
assert.ok(doc.minimal_valid_envelope_example.forbidden_effects.includes('safety_critical_control'));

const vectorIds = new Set(doc.validation_vectors.map((v) => v.id));
assert.equal(vectorIds.has('L3-PAE-T01'), true);
assert.equal(vectorIds.has('L3-PAE-T02'), true);
assert.equal(vectorIds.has('L3-PAE-T03'), true);
assert.equal(vectorIds.has('L3-PAE-T04'), true);
assert.equal(vectorIds.has('L3-PAE-POS-001'), true);

assert.equal(doc.readiness_state.physical_action_envelope_contract_created, true);
assert.equal(doc.readiness_state.physical_action_envelope_contract_evaluated, true);
assert.equal(doc.readiness_state.representation_ready, true);
assert.equal(doc.readiness_state.simulation_action_representable, true);
assert.equal(doc.readiness_state.observer_mode_action_representable, true);
assert.equal(doc.readiness_state.dry_run_no_actuation_representable, true);
assert.equal(doc.readiness_state.controlled_actuation_ready, false);
assert.equal(doc.readiness_state.uncontrolled_actuation_allowed, false);
assert.equal(doc.readiness_state.pilot_ready, false);
assert.equal(doc.readiness_state.physical_deployment_ready, false);
assert.equal(doc.readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-060-HBCE-LEVEL3-PHYSICAL-SAFETY-ENVELOPE-CONTRACT');

assert.equal(doc.non_claims.physical_actuation_permitted, false);
assert.equal(doc.non_claims.controlled_actuation_ready, false);
assert.equal(doc.non_claims.uncontrolled_physical_actuation_allowed, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.autonomous_physical_control, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL3_PHYSICAL_ACTION_ENVELOPE_CONTRACT_CREATED_NOT_ACTUATION_READY/);
assert.match(md, /It does not permit physical actuation/);
assert.match(md, /AI models may not authorize an action/);
assert.match(md, /Human and governed authority remain required/);
assert.match(md, /PROG-060-HBCE-LEVEL3-PHYSICAL-SAFETY-ENVELOPE-CONTRACT/);

console.log('PASS PROG-059-PHYSICAL-ACTION-ENVELOPE-DOCS-EXIST');
console.log('PASS PROG-059-PHYSICAL-ACTION-ENVELOPE-HASH-STABLE');
console.log('PASS PROG-059-BUILDER-STABLE');
console.log('PASS PROG-059-SOURCE-PROG-058-INTEGRITY-VALID');
console.log('PASS PROG-059-ACTION-IS-INSTRUCTION-NOT-AUTHORITY');
console.log('PASS PROG-059-MODEL-MAY-NOT-AUTHORIZE-ACTION');
console.log('PASS PROG-059-NO-PHYSICAL-ACTUATION-PERMITTED');
console.log('PASS PROG-059-CONTROLLED-ACTUATION-REQUIRES-NEW-EVIDENCE');
console.log('PASS PROG-059-NEXT-PROG-060-RECORDED');
console.log('PASS PROG-059-NO-UNSUPPORTED-READINESS-CLAIMS');
