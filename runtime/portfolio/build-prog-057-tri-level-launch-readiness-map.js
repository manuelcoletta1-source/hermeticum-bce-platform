'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const CURRENT_DATE = '2026-09-27';
const LAUNCH_DATE = '2027-01-19';
const DAYS_TO_LAUNCH = 114;
const INCLUSIVE_CALENDAR_WINDOW_DAYS = 115;
const WEEKDAY_CAPACITY_DAYS = 82;

function readJson(rootDir, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

function gitHead(rootDir) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (_error) {
    return 'UNKNOWN';
  }
}

function validHash(doc) {
  if (!doc || typeof doc !== 'object' || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

function buildTriLevelLaunchReadinessMap(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);

  const level2FreezePath = 'docs/launch/level2/v3-5-r1/v3-5-r1-level2-status-freeze.json';
  const level2Freeze = readJson(rootDir, level2FreezePath);

  const doc = {
    proto: 'HBCE-PORTFOLIO-PROG-057-TRI-LEVEL-LAUNCH-READINESS-MAP-v1',
    kind: 'HBCE_PORTFOLIO_TRI_LEVEL_LAUNCH_READINESS_MAP',
    document_code: 'HBCE-PORTFOLIO-LAUNCH-2027-PROG-057',
    issue_id: 'PROG-057',
    priority: 'TRI-LEVEL-LAUNCH-READINESS-MAP',
    repository_baseline_commit: repositoryCommit,

    planning_window: {
      current_date: CURRENT_DATE,
      launch_date: LAUNCH_DATE,
      calendar_days_to_launch_exclusive_start: DAYS_TO_LAUNCH,
      inclusive_calendar_window_days: INCLUSIVE_CALENDAR_WINDOW_DAYS,
      weeks_to_launch: '16w2d',
      approximate_weekday_capacity_days: WEEKDAY_CAPACITY_DAYS,
      planning_assessment: 'IN_TIME_IF_SCOPE_CONTROLLED'
    },

    hbce_identity_statement: {
      hbce_is_not_an_ai_system: true,
      hbce_is_governance_and_evidence_infrastructure: true,
      ai_models_are_replaceable_human_facing_interfaces: true,
      ai_models_do_not_create_authority: true,
      human_and_governed_authority_boundary_required: true
    },

    levels: [
      {
        level: 'LEVEL_1',
        name: 'Digital Decision Proof Launch Track',
        role: 'PRIMARY_LAUNCH_PRODUCT',
        operational_status: 'LAUNCH_PREPARATION_REQUIRED',
        launch_target: LAUNCH_DATE,
        launch_claim_allowed: true,
        pilot_ready_claim_allowed: false,
        production_ready_claim_allowed_by_this_map: false,
        purpose: 'governed digital decision proof and evidence-bound action accountability',
        required_pack: 'LEVEL1_LAUNCH_PACK',
        next_actions: [
          'recover_or_rebuild_market_ingression_snapshot',
          'define customer-facing demo scope',
          'freeze launch evidence pack',
          'prepare buyer narrative and technical one-pager'
        ]
      },
      {
        level: 'LEVEL_2',
        name: 'B2G Forensic Evidence Qualification Track',
        role: 'FROZEN_EVIDENCE_BOUND_TRACK',
        operational_status: level2Freeze.freeze.freeze_status,
        source_ref: level2FreezePath,
        source_revision_hash: level2Freeze.revision_hash,
        source_revision_hash_valid: validHash(level2Freeze),
        reopened_by_this_program: false,
        launch_claim_allowed: false,
        pilot_ready_claim_allowed: false,
        production_ready_claim_allowed_by_this_map: false,
        next_program_rule: level2Freeze.terminal_or_reopen_rule.next_program,
        purpose: 'forensic and institutional evidence qualification track, preserved as blocked and not pilot-ready',
        next_actions: [
          'do_not_reopen_without_new_evidence',
          'prepare readable frozen evidence pack',
          'use as maturity proof without pilot-ready claim'
        ]
      },
      {
        level: 'LEVEL_3',
        name: 'Cyber-Physical Pilot Intake Track',
        role: 'PILOT_INTAKE_SHADOW_TRACK',
        operational_status: 'PILOT_INTAKE_PACK_REQUIRED',
        launch_claim_allowed: false,
        pilot_ready_claim_allowed: false,
        physical_deployment_ready_claim_allowed: false,
        production_ready_claim_allowed_by_this_map: false,
        purpose: 'prepare controlled intake for cyber-physical pilot requests without claiming physical deployment readiness',
        required_pack: 'LEVEL3_PILOT_INTAKE_PACK',
        intake_boundary: {
          simulation_first: true,
          observer_mode_first: true,
          no_uncontrolled_physical_actuation: true,
          physical_action_envelope_required: true,
          physical_safety_envelope_required: true,
          safe_hold_required: true,
          emergency_stop_required: true,
          controller_receipt_required: true,
          sensor_evidence_required: true,
          human_authorization_boundary_required: true
        },
        next_actions: [
          'create level3 pilot intake pack',
          'define simulation-only intake flow',
          'define physical action and safety envelope contracts',
          'define no-physical-actuation claim boundary'
        ]
      }
    ],

    sequencing_policy: {
      primary_launch_focus: 'LEVEL_1',
      level2_policy: 'PRESERVE_FREEZE_DO_NOT_REOPEN_WITHOUT_EVIDENCE',
      level3_policy: 'PREPARE_PILOT_INTAKE_WITHOUT_DEPLOYMENT_CLAIM',
      no_level_can_inherit_readiness_from_another_level: true,
      readiness_must_be_level_specific_and_evidence_bound: true
    },

    launch_readiness_matrix: {
      level1: {
        prepared_for_launch_execution: false,
        must_be_completed_before_launch: true,
        customer_material_required: true
      },
      level2: {
        frozen_blocked_not_pilot_ready: true,
        may_be_used_as_maturity_evidence: true,
        may_be_sold_as_pilot_ready: false
      },
      level3: {
        pilot_intake_preparable_before_launch: true,
        physical_deployment_ready: false,
        may_be_presented_as_controlled_intake_track: true
      }
    },

    next_required_program: 'PROG-058-HBCE-LEVEL3-PILOT-INTAKE-PACK',

    non_claims: {
      level1_production_ready: false,
      level2_reopened: false,
      level2_pilot_ready: false,
      level2_b2g_candidate_ready: false,
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      automatic_pilot_promotion: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeTriLevelLaunchReadinessMap(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildTriLevelLaunchReadinessMap({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/portfolio/prog-057-tri-level-launch-readiness-map.json';
  const doc = writeTriLevelLaunchReadinessMap(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_057_TRI_LEVEL_LAUNCH_READINESS_MAP_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  CURRENT_DATE,
  LAUNCH_DATE,
  DAYS_TO_LAUNCH,
  INCLUSIVE_CALENDAR_WINDOW_DAYS,
  WEEKDAY_CAPACITY_DAYS,
  buildTriLevelLaunchReadinessMap,
  writeTriLevelLaunchReadinessMap
};
