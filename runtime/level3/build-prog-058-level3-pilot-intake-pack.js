'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const INTAKE_STATUS = 'LEVEL3_PILOT_INTAKE_PACK_CREATED_NOT_PILOT_READY';

const REQUIRED_INTAKE_ARTIFACTS = Object.freeze([
  'pilot_request_dossier',
  'use_case_boundary_statement',
  'simulation_environment_manifest',
  'controller_interface_manifest',
  'physical_action_envelope',
  'physical_safety_envelope',
  'safe_hold_plan',
  'emergency_stop_plan',
  'sensor_evidence_plan',
  'human_authorization_boundary',
  'no_uncontrolled_physical_actuation_acknowledgement'
]);

const ALLOWED_INTAKE_PHASES = Object.freeze([
  'INTAKE_ONLY',
  'SCOPE_SCREENING',
  'SIMULATION_ONLY',
  'OBSERVER_MODE',
  'DRY_RUN_NO_ACTUATION',
  'CONTROLLED_ACTUATION_REQUIRES_NEW_EVIDENCE'
]);

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

function buildLevel3PilotIntakePack(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);

  const sourcePath = 'docs/launch/portfolio/prog-057-tri-level-launch-readiness-map.json';
  const source = readJson(rootDir, sourcePath);

  const level3 = Array.isArray(source.levels)
    ? source.levels.find((entry) => entry.level === 'LEVEL_3')
    : null;

  const doc = {
    proto: 'HBCE-L3-PROG-058-PILOT-INTAKE-PACK-v1',
    kind: 'HBCE_LEVEL3_PILOT_INTAKE_PACK',
    document_code: 'HBCE-L3-C1-PILOT-INTAKE-2027-PROG-058',
    issue_id: 'PROG-058',
    priority: 'LEVEL3-PILOT-INTAKE-PACK',
    repository_baseline_commit: repositoryCommit,

    source_tri_level_launch_readiness_map_ref: sourcePath,
    source_tri_level_launch_readiness_map_revision_hash: source.revision_hash,
    source_tri_level_launch_readiness_map_revision_hash_valid: validHash(source),

    inherited_level3_position: {
      source_level_present: level3 !== null,
      source_role: level3?.role || 'UNKNOWN',
      source_operational_status: level3?.operational_status || 'UNKNOWN',
      source_required_pack: level3?.required_pack || 'UNKNOWN',
      source_pilot_ready_claim_allowed: level3?.pilot_ready_claim_allowed === true,
      source_physical_deployment_ready_claim_allowed: level3?.physical_deployment_ready_claim_allowed === true
    },

    intake_status: INTAKE_STATUS,
    required_intake_artifacts: REQUIRED_INTAKE_ARTIFACTS,
    allowed_intake_phases: ALLOWED_INTAKE_PHASES,

    intake_pack: {
      purpose: 'Prepare controlled response path for Level 3 cyber-physical pilot requests without claiming pilot readiness or physical deployment readiness.',
      allowed_current_phase: 'INTAKE_ONLY',
      maximum_current_phase_without_new_evidence: 'DRY_RUN_NO_ACTUATION',
      controlled_actuation_requires_new_evidence: true,
      pilot_ready_by_this_pack: false,
      physical_deployment_ready_by_this_pack: false,
      simulation_first: true,
      observer_mode_first: true,
      no_uncontrolled_physical_actuation: true
    },

    request_screening: {
      supported_request_classes_for_intake_only: [
        'robotics_simulation',
        'warehouse_or_factory_digital_twin',
        'controller_receipt_observation',
        'sensor_evidence_chain_design',
        'safe_hold_and_estop_design',
        'human_authorized_action_flow_design'
      ],
      rejected_without_new_evidence: [
        'uncontrolled_physical_actuation',
        'public_infrastructure_live_control',
        'safety_critical_live_control',
        'military_live_control',
        'medical_live_control',
        'autonomous_force_or_motion_without_human_authorization'
      ],
      screening_rule: 'fail_closed_if_scope_exceeds_simulation_observer_or_dry_run_no_actuation'
    },

    minimum_intake_contracts: {
      physical_action_envelope_required: true,
      physical_safety_envelope_required: true,
      controller_interface_manifest_required: true,
      sensor_evidence_plan_required: true,
      safe_hold_plan_required: true,
      emergency_stop_plan_required: true,
      human_authorization_boundary_required: true,
      model_authority_disallowed: true,
      authority_must_be_external_and_governed: true
    },

    phase_gate_matrix: [
      {
        phase: 'INTAKE_ONLY',
        permitted_now: true,
        requires_new_evidence: false,
        physical_actuation_allowed: false
      },
      {
        phase: 'SCOPE_SCREENING',
        permitted_now: true,
        requires_new_evidence: false,
        physical_actuation_allowed: false
      },
      {
        phase: 'SIMULATION_ONLY',
        permitted_now: true,
        requires_new_evidence: false,
        physical_actuation_allowed: false
      },
      {
        phase: 'OBSERVER_MODE',
        permitted_now: true,
        requires_new_evidence: false,
        physical_actuation_allowed: false
      },
      {
        phase: 'DRY_RUN_NO_ACTUATION',
        permitted_now: true,
        requires_new_evidence: false,
        physical_actuation_allowed: false
      },
      {
        phase: 'CONTROLLED_ACTUATION_REQUIRES_NEW_EVIDENCE',
        permitted_now: false,
        requires_new_evidence: true,
        physical_actuation_allowed: false
      }
    ],

    intake_readiness_state: {
      level3_pilot_intake_pack_created: true,
      level3_pilot_intake_pack_evaluated: true,
      level3_intake_status: INTAKE_STATUS,
      simulation_first_ready_to_scope: true,
      observer_mode_ready_to_scope: true,
      dry_run_no_actuation_ready_to_scope: true,
      controlled_actuation_ready: false,
      pilot_ready: false,
      physical_deployment_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-059-HBCE-LEVEL3-PHYSICAL-ACTION-ENVELOPE-CONTRACT',

    non_claims: {
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      controlled_actuation_ready: false,
      production_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      public_authority_created: false,
      autonomous_physical_control: false,
      automatic_pilot_promotion: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeLevel3PilotIntakePack(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildLevel3PilotIntakePack({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level3/v0-1-c1/prog-058-level3-pilot-intake-pack.json';
  const doc = writeLevel3PilotIntakePack(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_058_LEVEL3_PILOT_INTAKE_PACK_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  INTAKE_STATUS,
  REQUIRED_INTAKE_ARTIFACTS,
  ALLOWED_INTAKE_PHASES,
  buildLevel3PilotIntakePack,
  writeLevel3PilotIntakePack
};
