'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  CURRENT_DATE,
  LAUNCH_DATE,
  DAYS_TO_LAUNCH,
  INCLUSIVE_CALENDAR_WINDOW_DAYS,
  WEEKDAY_CAPACITY_DAYS,
  buildTriLevelLaunchReadinessMap
} = require('../../../runtime/portfolio/build-prog-057-tri-level-launch-readiness-map.js');

const root = path.resolve(__dirname, '../../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const exists = (p) => fs.existsSync(path.join(root, p));

const docPath = 'docs/launch/portfolio/prog-057-tri-level-launch-readiness-map.json';
const mdPath = 'docs/launch/portfolio/prog-057-tri-level-launch-readiness-map.md';
const runtimePath = 'runtime/portfolio/build-prog-057-tri-level-launch-readiness-map.js';
const level2FreezePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-status-freeze.json';

for (const p of [docPath, mdPath, runtimePath, level2FreezePath]) assert.equal(exists(p), true, `${p} must exist`);

const doc = json(docPath);
const md = read(mdPath);
const level2Freeze = json(level2FreezePath);

assert.equal(doc.proto, 'HBCE-PORTFOLIO-PROG-057-TRI-LEVEL-LAUNCH-READINESS-MAP-v1');
assert.equal(doc.kind, 'HBCE_PORTFOLIO_TRI_LEVEL_LAUNCH_READINESS_MAP');
assert.equal(doc.issue_id, 'PROG-057');
assert.equal(doc.priority, 'TRI-LEVEL-LAUNCH-READINESS-MAP');

const regenerated = buildTriLevelLaunchReadinessMap({ rootDir: root, repositoryCommit: doc.repository_baseline_commit });
assert.deepEqual(regenerated, doc);

const body = { ...doc };
delete body.revision_hash;
assert.equal(doc.revision_hash, sha256Digest(body));

assert.equal(doc.planning_window.current_date, CURRENT_DATE);
assert.equal(doc.planning_window.launch_date, LAUNCH_DATE);
assert.equal(doc.planning_window.calendar_days_to_launch_exclusive_start, DAYS_TO_LAUNCH);
assert.equal(doc.planning_window.inclusive_calendar_window_days, INCLUSIVE_CALENDAR_WINDOW_DAYS);
assert.equal(doc.planning_window.weeks_to_launch, '16w2d');
assert.equal(doc.planning_window.approximate_weekday_capacity_days, WEEKDAY_CAPACITY_DAYS);
assert.equal(doc.planning_window.planning_assessment, 'IN_TIME_IF_SCOPE_CONTROLLED');

assert.equal(doc.hbce_identity_statement.hbce_is_not_an_ai_system, true);
assert.equal(doc.hbce_identity_statement.hbce_is_governance_and_evidence_infrastructure, true);
assert.equal(doc.hbce_identity_statement.ai_models_are_replaceable_human_facing_interfaces, true);
assert.equal(doc.hbce_identity_statement.ai_models_do_not_create_authority, true);

assert.equal(doc.levels.length, 3);

const byLevel = Object.fromEntries(doc.levels.map((level) => [level.level, level]));

assert.equal(byLevel.LEVEL_1.role, 'PRIMARY_LAUNCH_PRODUCT');
assert.equal(byLevel.LEVEL_1.operational_status, 'LAUNCH_PREPARATION_REQUIRED');
assert.equal(byLevel.LEVEL_1.launch_target, '2027-01-19');
assert.equal(byLevel.LEVEL_1.required_pack, 'LEVEL1_LAUNCH_PACK');

assert.equal(byLevel.LEVEL_2.role, 'FROZEN_EVIDENCE_BOUND_TRACK');
assert.equal(byLevel.LEVEL_2.operational_status, 'LEVEL2_STATUS_FROZEN_BLOCKED_NOT_PILOT_READY');
assert.equal(byLevel.LEVEL_2.source_revision_hash, level2Freeze.revision_hash);
assert.equal(byLevel.LEVEL_2.source_revision_hash_valid, true);
assert.equal(byLevel.LEVEL_2.reopened_by_this_program, false);
assert.equal(byLevel.LEVEL_2.pilot_ready_claim_allowed, false);
assert.equal(byLevel.LEVEL_2.next_program_rule, 'NO_NEW_LEVEL2_PROGRAM_WITHOUT_EVIDENCE_TRIGGER');

assert.equal(byLevel.LEVEL_3.role, 'PILOT_INTAKE_SHADOW_TRACK');
assert.equal(byLevel.LEVEL_3.operational_status, 'PILOT_INTAKE_PACK_REQUIRED');
assert.equal(byLevel.LEVEL_3.pilot_ready_claim_allowed, false);
assert.equal(byLevel.LEVEL_3.physical_deployment_ready_claim_allowed, false);
assert.equal(byLevel.LEVEL_3.required_pack, 'LEVEL3_PILOT_INTAKE_PACK');
assert.equal(byLevel.LEVEL_3.intake_boundary.simulation_first, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.observer_mode_first, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.no_uncontrolled_physical_actuation, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.physical_action_envelope_required, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.physical_safety_envelope_required, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.safe_hold_required, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.emergency_stop_required, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.controller_receipt_required, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.sensor_evidence_required, true);
assert.equal(byLevel.LEVEL_3.intake_boundary.human_authorization_boundary_required, true);

assert.equal(doc.sequencing_policy.primary_launch_focus, 'LEVEL_1');
assert.equal(doc.sequencing_policy.level2_policy, 'PRESERVE_FREEZE_DO_NOT_REOPEN_WITHOUT_EVIDENCE');
assert.equal(doc.sequencing_policy.level3_policy, 'PREPARE_PILOT_INTAKE_WITHOUT_DEPLOYMENT_CLAIM');
assert.equal(doc.sequencing_policy.no_level_can_inherit_readiness_from_another_level, true);
assert.equal(doc.sequencing_policy.readiness_must_be_level_specific_and_evidence_bound, true);

assert.equal(doc.launch_readiness_matrix.level1.prepared_for_launch_execution, false);
assert.equal(doc.launch_readiness_matrix.level1.must_be_completed_before_launch, true);
assert.equal(doc.launch_readiness_matrix.level2.frozen_blocked_not_pilot_ready, true);
assert.equal(doc.launch_readiness_matrix.level2.may_be_sold_as_pilot_ready, false);
assert.equal(doc.launch_readiness_matrix.level3.pilot_intake_preparable_before_launch, true);
assert.equal(doc.launch_readiness_matrix.level3.physical_deployment_ready, false);
assert.equal(doc.launch_readiness_matrix.level3.may_be_presented_as_controlled_intake_track, true);

assert.equal(doc.next_required_program, 'PROG-058-HBCE-LEVEL3-PILOT-INTAKE-PACK');

assert.equal(doc.non_claims.level1_production_ready, false);
assert.equal(doc.non_claims.level2_reopened, false);
assert.equal(doc.non_claims.level2_pilot_ready, false);
assert.equal(doc.non_claims.level2_b2g_candidate_ready, false);
assert.equal(doc.non_claims.level3_pilot_ready, false);
assert.equal(doc.non_claims.level3_physical_deployment_ready, false);
assert.equal(doc.non_claims.public_accreditation, false);
assert.equal(doc.non_claims.procurement_eligibility, false);
assert.equal(doc.non_claims.legal_validity, false);
assert.equal(doc.non_claims.government_endorsement, false);
assert.equal(doc.non_claims.automatic_pilot_promotion, false);

assert.match(md, /Calendar days to launch: 114/);
assert.match(md, /Level 1 is the primary launch product track/);
assert.match(md, /LEVEL2_STATUS_FROZEN_BLOCKED_NOT_PILOT_READY/);
assert.match(md, /PILOT_INTAKE_PACK_REQUIRED/);
assert.match(md, /HBCE is not an AI system/);
assert.match(md, /PROG-058-HBCE-LEVEL3-PILOT-INTAKE-PACK/);

console.log('PASS PROG-057-TRI-LEVEL-LAUNCH-READINESS-MAP-DOCS-EXIST');
console.log('PASS PROG-057-TRI-LEVEL-LAUNCH-READINESS-MAP-HASH-STABLE');
console.log('PASS PROG-057-BUILDER-STABLE');
console.log('PASS PROG-057-COUNTDOWN-114-DAYS-16W2D');
console.log('PASS PROG-057-LEVEL1-PRIMARY-LAUNCH-TRACK');
console.log('PASS PROG-057-LEVEL2-FREEZE-PRESERVED');
console.log('PASS PROG-057-LEVEL3-PILOT-INTAKE-NOT-DEPLOYMENT');
console.log('PASS PROG-057-HBCE-NOT-AI-IDENTITY-PRESERVED');
console.log('PASS PROG-057-NEXT-PROG-058-RECORDED');
console.log('PASS PROG-057-NO-UNSUPPORTED-READINESS-CLAIMS');
