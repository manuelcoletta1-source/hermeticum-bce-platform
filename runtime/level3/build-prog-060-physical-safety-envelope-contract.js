'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const CONTRACT_STATUS = 'LEVEL3_PHYSICAL_SAFETY_ENVELOPE_CONTRACT_CREATED_NOT_SAFETY_CERTIFIED';

const REQUIRED_FIELDS = Object.freeze([
  'physical_safety_envelope_id',
  'target_system_ref',
  'controller_interface_ref',
  'operating_mode',
  'workspace_bounds',
  'prohibited_zones',
  'kinematic_bounds',
  'force_or_energy_bounds',
  'environment_assumptions',
  'sensor_monitoring_plan',
  'safe_hold_rule',
  'emergency_stop_rule',
  'human_supervision_rule',
  'hazard_register_ref',
  'fail_closed_rule'
]);

const OPERATING_MODES = Object.freeze([
  'SIMULATION_ONLY',
  'OBSERVER_MODE',
  'DRY_RUN_NO_ACTUATION',
  'CONTROLLED_ACTUATION_REQUIRES_NEW_EVIDENCE'
]);

const VALIDATOR_CODES = Object.freeze([
  'PHYSICAL_SAFETY_ENVELOPE_MISSING',
  'PHYSICAL_SAFETY_ENVELOPE_ID_INVALID',
  'TARGET_SYSTEM_REF_INVALID',
  'CONTROLLER_INTERFACE_REF_INVALID',
  'OPERATING_MODE_INVALID',
  'WORKSPACE_BOUNDS_INVALID',
  'PROHIBITED_ZONES_MISSING',
  'KINEMATIC_BOUNDS_INVALID',
  'FORCE_OR_ENERGY_BOUNDS_INVALID',
  'ENVIRONMENT_ASSUMPTIONS_INVALID',
  'SENSOR_MONITORING_PLAN_INVALID',
  'SAFE_HOLD_RULE_MISSING',
  'EMERGENCY_STOP_RULE_MISSING',
  'HUMAN_SUPERVISION_RULE_MISSING',
  'HAZARD_REGISTER_REF_INVALID',
  'FAIL_CLOSED_RULE_MISSING',
  'SAFETY_CERTIFICATION_CLAIM_BLOCKED',
  'LIVE_CONTROL_REQUIRES_NEW_EVIDENCE',
  'UNCONTROLLED_PHYSICAL_ACTUATION_BLOCKED'
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

function buildPhysicalSafetyEnvelopeContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);

  const sourcePath = 'docs/launch/level3/v0-1-c1/prog-059-physical-action-envelope-contract.json';
  const source = readJson(rootDir, sourcePath);

  const doc = {
    proto: 'HBCE-L3-PROG-060-PHYSICAL-SAFETY-ENVELOPE-CONTRACT-v1',
    kind: 'HBCE_LEVEL3_PHYSICAL_SAFETY_ENVELOPE_CONTRACT',
    document_code: 'HBCE-L3-C1-PSE-2027-PROG-060',
    issue_id: 'PROG-060',
    priority: 'LEVEL3-PHYSICAL-SAFETY-ENVELOPE-CONTRACT',
    repository_baseline_commit: repositoryCommit,

    source_physical_action_envelope_contract_ref: sourcePath,
    source_physical_action_envelope_contract_revision_hash: source.revision_hash,
    source_physical_action_envelope_contract_revision_hash_valid: validHash(source),

    inherited_action_boundary: {
      contract_status: source.contract_status,
      action_is_instruction_not_authority: source.physical_action_envelope_contract.action_is_instruction_not_authority,
      model_may_not_authorize_action: source.physical_action_envelope_contract.model_may_not_authorize_action,
      human_authorization_required: source.physical_action_envelope_contract.human_authorization_required,
      physical_safety_envelope_required: source.physical_action_envelope_contract.physical_safety_envelope_required,
      controlled_actuation_ready_by_source: source.readiness_state.controlled_actuation_ready,
      physical_deployment_ready_by_source: source.readiness_state.physical_deployment_ready
    },

    contract_status: CONTRACT_STATUS,
    required_fields: REQUIRED_FIELDS,
    operating_modes: OPERATING_MODES,
    validator_codes: VALIDATOR_CODES,

    physical_safety_envelope_contract: {
      purpose: 'Define the minimum safety boundary required before a Level 3 physical action envelope can be simulated, observed or dry-run scoped.',
      safety_envelope_is_constraint_not_certification: true,
      safety_envelope_does_not_certify_machine_safety: true,
      safety_envelope_does_not_authorize_live_control: true,
      fail_closed_if_missing_required_field: true,
      fail_closed_if_workspace_bounds_missing: true,
      fail_closed_if_prohibited_zones_missing: true,
      fail_closed_if_safe_hold_missing: true,
      fail_closed_if_emergency_stop_missing: true,
      fail_closed_if_sensor_monitoring_missing: true,
      fail_closed_if_human_supervision_missing: true,
      fail_closed_if_safety_certification_claimed: true,
      fail_closed_if_live_control_requested_without_new_evidence: true
    },

    allowed_without_new_evidence: {
      simulation_only_safety_boundary: true,
      observer_mode_safety_boundary: true,
      dry_run_no_actuation_safety_boundary: true,
      live_control_safety_certification: false,
      controlled_actuation_safety_clearance: false,
      autonomous_physical_control: false
    },

    minimal_valid_safety_envelope_example: {
      physical_safety_envelope_id: 'PSE-EXAMPLE-0001',
      target_system_ref: 'TARGET::SIMULATED_DIFFERENTIAL_ROBOT',
      controller_interface_ref: 'CONTROLLER::SIMULATION_ADAPTER',
      operating_mode: 'SIMULATION_ONLY',
      workspace_bounds: {
        workspace_ref: 'WORKSPACE::SIMULATION_ONLY',
        max_x_meter: 10,
        max_y_meter: 10,
        min_x_meter: 0,
        min_y_meter: 0
      },
      prohibited_zones: [
        'ZONE::HUMAN_OCCUPANCY',
        'ZONE::PUBLIC_INFRASTRUCTURE',
        'ZONE::UNBOUNDED_ENVIRONMENT'
      ],
      kinematic_bounds: {
        max_velocity_meter_per_second: 0.20,
        max_acceleration_meter_per_second_squared: 0.10
      },
      force_or_energy_bounds: {
        live_force_application_allowed: false,
        max_live_force_newton: 0
      },
      environment_assumptions: [
        'simulation_only',
        'no_live_physical_body',
        'no_public_infrastructure_connection'
      ],
      sensor_monitoring_plan: {
        sensor_evidence_required: true,
        sensor_stream_may_be_simulated: true,
        missing_sensor_evidence_blocks_effect_claim: true
      },
      safe_hold_rule: 'ENTER_SAFE_HOLD_ON_BOUNDARY_UNCERTAINTY',
      emergency_stop_rule: 'E_STOP_REQUIRED_BEFORE_ANY_CONTROLLED_ACTUATION_PROGRAM',
      human_supervision_rule: 'HUMAN_OPERATOR_REQUIRED_FOR_SCOPE_CHANGE',
      hazard_register_ref: 'HAZARD_REGISTER::LEVEL3_C1_REQUIRED',
      fail_closed_rule: 'BLOCK_IF_SAFETY_BOUNDARY_OR_MONITORING_IS_MISSING'
    },

    validation_vectors: [
      {
        id: 'L3-PSE-T01',
        name: 'missing physical safety envelope fails closed',
        expected: 'PHYSICAL_SAFETY_ENVELOPE_MISSING'
      },
      {
        id: 'L3-PSE-T02',
        name: 'missing emergency stop rule fails closed',
        expected: 'EMERGENCY_STOP_RULE_MISSING'
      },
      {
        id: 'L3-PSE-T03',
        name: 'safety certification claim fails closed',
        expected: 'SAFETY_CERTIFICATION_CLAIM_BLOCKED'
      },
      {
        id: 'L3-PSE-T04',
        name: 'live control requires new evidence',
        expected: 'LIVE_CONTROL_REQUIRES_NEW_EVIDENCE'
      },
      {
        id: 'L3-PSE-POS-001',
        name: 'simulation-only safety envelope is representable but not safety certified',
        expected: 'PASS_REPRESENTATION_ONLY'
      }
    ],

    readiness_state: {
      physical_safety_envelope_contract_created: true,
      physical_safety_envelope_contract_evaluated: true,
      safety_boundary_representable: true,
      simulation_safety_boundary_representable: true,
      observer_mode_safety_boundary_representable: true,
      dry_run_no_actuation_safety_boundary_representable: true,
      safety_certified: false,
      live_control_ready: false,
      controlled_actuation_ready: false,
      pilot_ready: false,
      physical_deployment_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-061-HBCE-LEVEL3-SAFE-HOLD-AND-ESTOP-CONTRACT',

    non_claims: {
      safety_certification: false,
      live_control_ready: false,
      controlled_actuation_ready: false,
      physical_actuation_permitted: false,
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      production_ready: false,
      public_accreditation: false,
      procurement_eligibility: false,
      legal_validity: false,
      government_endorsement: false,
      autonomous_physical_control: false,
      automatic_pilot_promotion: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writePhysicalSafetyEnvelopeContract(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildPhysicalSafetyEnvelopeContract({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level3/v0-1-c1/prog-060-physical-safety-envelope-contract.json';
  const doc = writePhysicalSafetyEnvelopeContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_060_PHYSICAL_SAFETY_ENVELOPE_CONTRACT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  CONTRACT_STATUS,
  REQUIRED_FIELDS,
  OPERATING_MODES,
  VALIDATOR_CODES,
  buildPhysicalSafetyEnvelopeContract,
  writePhysicalSafetyEnvelopeContract
};
