'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  INTAKE_STATUS,
  REQUIRED_INTAKE_ARTIFACTS,
  ALLOWED_INTAKE_PHASES,
  buildLevel3PilotIntakePack
} = require('../../../runtime/level3/build-prog-058-level3-pilot-intake-pack.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/level3/v0-1-c1/prog-058-level3-pilot-intake-pack.json';
const mdPath = 'docs/launch/level3/v0-1-c1/prog-058-level3-pilot-intake-pack.md';
const runtimePath = 'runtime/level3/build-prog-058-level3-pilot-intake-pack.js';
const sourcePath = 'docs/launch/portfolio/prog-057-tri-level-launch-readiness-map.json';

for (const p of [docPath, mdPath, runtimePath, sourcePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const source = json(sourcePath);

assert.equal(doc.proto, 'HBCE-L3-PROG-058-PILOT-INTAKE-PACK-v1');
assert.equal(doc.kind, 'HBCE_LEVEL3_PILOT_INTAKE_PACK');
assert.equal(doc.issue_id, 'PROG-058');
assert.equal(doc.priority, 'LEVEL3-PILOT-INTAKE-PACK');
assert.equal(doc.source_tri_level_launch_readiness_map_revision_hash, source.revision_hash);
assert.equal(doc.source_tri_level_launch_readiness_map_revision_hash_valid, true);

const regenerated = buildLevel3PilotIntakePack({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.inherited_level3_position.source_level_present, true);
assert.equal(doc.inherited_level3_position.source_role, 'PILOT_INTAKE_SHADOW_TRACK');
assert.equal(doc.inherited_level3_position.source_operational_status, 'PILOT_INTAKE_PACK_REQUIRED');
assert.equal(doc.inherited_level3_position.source_required_pack, 'LEVEL3_PILOT_INTAKE_PACK');
assert.equal(doc.inherited_level3_position.source_pilot_ready_claim_allowed, false);
assert.equal(doc.inherited_level3_position.source_physical_deployment_ready_claim_allowed, false);

assert.equal(doc.intake_status, INTAKE_STATUS);
assert.deepEqual(doc.required_intake_artifacts, REQUIRED_INTAKE_ARTIFACTS);
assert.deepEqual(doc.allowed_intake_phases, ALLOWED_INTAKE_PHASES);

assert.equal(doc.intake_pack.allowed_current_phase, 'INTAKE_ONLY');
assert.equal(doc.intake_pack.maximum_current_phase_without_new_evidence, 'DRY_RUN_NO_ACTUATION');
assert.equal(doc.intake_pack.controlled_actuation_requires_new_evidence, true);
assert.equal(doc.intake_pack.pilot_ready_by_this_pack, false);
assert.equal(doc.intake_pack.physical_deployment_ready_by_this_pack, false);
assert.equal(doc.intake_pack.simulation_first, true);
assert.equal(doc.intake_pack.observer_mode_first, true);
assert.equal(doc.intake_pack.no_uncontrolled_physical_actuation, true);

assert.ok(doc.request_screening.supported_request_classes_for_intake_only.includes('robotics_simulation'));
assert.ok(doc.request_screening.supported_request_classes_for_intake_only.includes('controller_receipt_observation'));
assert.ok(doc.request_screening.rejected_without_new_evidence.includes('uncontrolled_physical_actuation'));
assert.ok(doc.request_screening.rejected_without_new_evidence.includes('safety_critical_live_control'));
assert.ok(doc.request_screening.rejected_without_new_evidence.includes('autonomous_force_or_motion_without_human_authorization'));
assert.equal(doc.request_screening.screening_rule, 'fail_closed_if_scope_exceeds_simulation_observer_or_dry_run_no_actuation');

assert.equal(doc.minimum_intake_contracts.physical_action_envelope_required, true);
assert.equal(doc.minimum_intake_contracts.physical_safety_envelope_required, true);
assert.equal(doc.minimum_intake_contracts.controller_interface_manifest_required, true);
assert.equal(doc.minimum_intake_contracts.sensor_evidence_plan_required, true);
assert.equal(doc.minimum_intake_contracts.safe_hold_plan_required, true);
assert.equal(doc.minimum_intake_contracts.emergency_stop_plan_required, true);
assert.equal(doc.minimum_intake_contracts.human_authorization_boundary_required, true);
assert.equal(doc.minimum_intake_contracts.model_authority_disallowed, true);
assert.equal(doc.minimum_intake_contracts.authority_must_be_external_and_governed, true);

const byPhase = Object.fromEntries(doc.phase_gate_matrix.map((phase) => [phase.phase, phase]));
assert.equal(byPhase.INTAKE_ONLY.permitted_now, true);
assert.equal(byPhase.SIMULATION_ONLY.permitted_now, true);
assert.equal(byPhase.OBSERVER_MODE.permitted_now, true);
assert.equal(byPhase.DRY_RUN_NO_ACTUATION.permitted_now, true);
assert.equal(byPhase.CONTROLLED_ACTUATION_REQUIRES_NEW_EVIDENCE.permitted_now, false);
assert.equal(byPhase.CONTROLLED_ACTUATION_REQUIRES_NEW_EVIDENCE.requires_new_evidence, true);
assert.equal(Object.values(byPhase).every((phase) => phase.physical_actuation_allowed === false), true);

assert.equal(doc.intake_readiness_state.level3_pilot_intake_pack_created, true);
assert.equal(doc.intake_readiness_state.level3_pilot_intake_pack_evaluated, true);
assert.equal(doc.intake_readiness_state.level3_intake_status, INTAKE_STATUS);
assert.equal(doc.intake_readiness_state.simulation_first_ready_to_scope, true);
assert.equal(doc.intake_readiness_state.observer_mode_ready_to_scope, true);
assert.equal(doc.intake_readiness_state.dry_run_no_actuation_ready_to_scope, true);
assert.equal(doc.intake_readiness_state.controlled_actuation_ready, false);
assert.equal(doc.intake_readiness_state.pilot_ready, false);
assert.equal(doc.intake_readiness_state.physical_deployment_ready, false);
assert.equal(doc.intake_readiness_state.production_ready, false);

assert.equal(doc.next_required_program, 'PROG-059-HBCE-LEVEL3-PHYSICAL-ACTION-ENVELOPE-CONTRACT');

assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.controlled_actuation_ready, false);
assert.equal(doc.non_claims.production_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.public_authority_created, false);
assert.equal(doc.non_claims.autonomous_physical_control, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /LEVEL3_PILOT_INTAKE_PACK_CREATED_NOT_PILOT_READY/);
assert.match(md, /does not declare Level 3 pilot-ready/);
assert.match(md, /does not allow uncontrolled physical actuation/);
assert.match(md, /AI models do not create authority/);
assert.match(md, /PROG-059-HBCE-LEVEL3-PHYSICAL-ACTION-ENVELOPE-CONTRACT/);

console.log('PASS PROG-058-LEVEL3-PILOT-INTAKE-PACK-DOCS-EXIST');
console.log('PASS PROG-058-LEVEL3-PILOT-INTAKE-PACK-HASH-STABLE');
console.log('PASS PROG-058-BUILDER-STABLE');
console.log('PASS PROG-058-SOURCE-PROG-057-INTEGRITY-VALID');
console.log('PASS PROG-058-INTAKE-PACK-NOT-PILOT-READY');
console.log('PASS PROG-058-SIMULATION-FIRST-OBSERVER-FIRST');
console.log('PASS PROG-058-NO-UNCONTROLLED-PHYSICAL-ACTUATION');
console.log('PASS PROG-058-MODEL-AUTHORITY-DISALLOWED');
console.log('PASS PROG-058-NEXT-PROG-059-RECORDED');
console.log('PASS PROG-058-NO-UNSUPPORTED-READINESS-CLAIMS');
