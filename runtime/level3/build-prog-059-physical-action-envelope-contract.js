'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const CONTRACT_STATUS = 'LEVEL3_PHYSICAL_ACTION_ENVELOPE_CONTRACT_CREATED_NOT_ACTUATION_READY';

const REQUIRED_FIELDS = Object.freeze([
  'physical_action_id',
  'action_class',
  'target_system_ref',
  'controller_interface_ref',
  'authority_ref',
  'human_authorization_ref',
  'physical_safety_envelope_ref',
  'requested_effect',
  'permitted_bounds',
  'forbidden_effects',
  'time_window',
  'environment_ref',
  'evidence_capture_plan',
  'fail_closed_rule'
]);

const ACTION_CLASSES = Object.freeze([
  'SIMULATED_MOTION',
  'SIMULATED_STATE_CHANGE',
  'OBSERVER_MODE_REQUEST',
  'DRY_RUN_NO_ACTUATION',
  'CONTROLLED_ACTUATION_REQUIRES_NEW_EVIDENCE'
]);

const VALIDATOR_CODES = Object.freeze([
  'PHYSICAL_ACTION_ENVELOPE_MISSING',
  'PHYSICAL_ACTION_ID_INVALID',
  'ACTION_CLASS_INVALID',
  'TARGET_SYSTEM_REF_INVALID',
  'CONTROLLER_INTERFACE_REF_INVALID',
  'AUTHORITY_REF_INVALID',
  'HUMAN_AUTHORIZATION_REF_INVALID',
  'PHYSICAL_SAFETY_ENVELOPE_REF_INVALID',
  'REQUESTED_EFFECT_INVALID',
  'PERMITTED_BOUNDS_INVALID',
  'FORBIDDEN_EFFECTS_MISSING',
  'TIME_WINDOW_INVALID',
  'ENVIRONMENT_REF_INVALID',
  'EVIDENCE_CAPTURE_PLAN_INVALID',
  'FAIL_CLOSED_RULE_MISSING',
  'UNCONTROLLED_PHYSICAL_ACTUATION_BLOCKED',
  'MODEL_AUTHORITY_BLOCKED',
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

function buildPhysicalActionEnvelopeContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);

  const sourcePath = 'docs/launch/level3/v0-1-c1/prog-058-level3-pilot-intake-pack.json';
  const source = readJson(rootDir, sourcePath);

  const doc = {
    proto: 'HBCE-L3-PROG-059-PHYSICAL-ACTION-ENVELOPE-CONTRACT-v1',
    kind: 'HBCE_LEVEL3_PHYSICAL_ACTION_ENVELOPE_CONTRACT',
    document_code: 'HBCE-L3-C1-PAE-2027-PROG-059',
    issue_id: 'PROG-059',
    priority: 'LEVEL3-PHYSICAL-ACTION-ENVELOPE-CONTRACT',
    repository_baseline_commit: repositoryCommit,

    source_level3_pilot_intake_pack_ref: sourcePath,
    source_level3_pilot_intake_pack_revision_hash: source.revision_hash,
    source_level3_pilot_intake_pack_revision_hash_valid: validHash(source),

    inherited_intake_boundary: {
      intake_status: source.intake_status,
      simulation_first: source.intake_pack.simulation_first,
      observer_mode_first: source.intake_pack.observer_mode_first,
      no_uncontrolled_physical_actuation: source.intake_pack.no_uncontrolled_physical_actuation,
      controlled_actuation_requires_new_evidence: source.intake_pack.controlled_actuation_requires_new_evidence,
      pilot_ready_by_source: source.intake_pack.pilot_ready_by_this_pack,
      physical_deployment_ready_by_source: source.intake_pack.physical_deployment_ready_by_this_pack
    },

    contract_status: CONTRACT_STATUS,
    required_fields: REQUIRED_FIELDS,
    action_classes: ACTION_CLASSES,
    validator_codes: VALIDATOR_CODES,

    physical_action_envelope_contract: {
      purpose: 'Represent a proposed cyber-physical action boundary before simulation, observation or dry-run execution.',
      action_is_instruction_not_authority: true,
      model_may_describe_action: true,
      model_may_not_authorize_action: true,
      human_authorization_required: true,
      controller_receipt_required_before_effect_claim: true,
      physical_safety_envelope_required: true,
      evidence_capture_plan_required: true,
      fail_closed_if_missing_required_field: true,
      fail_closed_if_uncontrolled_actuation_requested: true,
      fail_closed_if_model_is_authority: true,
      fail_closed_if_safety_envelope_missing: true,
      fail_closed_if_bounds_missing: true,
      fail_closed_if_forbidden_effects_missing: true
    },

    allowed_without_new_evidence: {
      simulated_motion: true,
      simulated_state_change: true,
      observer_mode_request: true,
      dry_run_no_actuation: true,
      controlled_actuation: false,
      uncontrolled_physical_actuation: false
    },

    minimal_valid_envelope_example: {
      physical_action_id: 'PAE-EXAMPLE-0001',
      action_class: 'SIMULATED_MOTION',
      target_system_ref: 'TARGET::SIMULATED_DIFFERENTIAL_ROBOT',
      controller_interface_ref: 'CONTROLLER::SIMULATION_ADAPTER',
      authority_ref: 'AUTHORITY::HUMAN_OPERATOR',
      human_authorization_ref: 'HUMAN_AUTH::PENDING_OR_BOUND',
      physical_safety_envelope_ref: 'PSE::REQUIRED_BEFORE_EXECUTION',
      requested_effect: {
        effect_type: 'SIMULATED_DISPLACEMENT',
        value: 0.25,
        unit: 'meter'
      },
      permitted_bounds: {
        max_displacement_meter: 0.30,
        max_velocity_meter_per_second: 0.20,
        workspace_ref: 'WORKSPACE::SIMULATION_ONLY'
      },
      forbidden_effects: [
        'live_physical_motion',
        'force_application',
        'public_infrastructure_control',
        'safety_critical_control'
      ],
      time_window: {
        not_before: '2027-01-19T00:00:00Z',
        not_after: '2027-01-19T23:59:59Z'
      },
      environment_ref: 'ENV::SIMULATION_ONLY',
      evidence_capture_plan: {
        controller_receipt_required: true,
        sensor_evidence_required: true,
        audit_event_required: true
      },
      fail_closed_rule: 'BLOCK_IF_ANY_REQUIRED_FIELD_OR_BOUNDARY_IS_MISSING'
    },

    validation_vectors: [
      {
        id: 'L3-PAE-T01',
        name: 'missing physical action envelope fails closed',
        expected: 'PHYSICAL_ACTION_ENVELOPE_MISSING'
      },
      {
        id: 'L3-PAE-T02',
        name: 'model authority claim fails closed',
        expected: 'MODEL_AUTHORITY_BLOCKED'
      },
      {
        id: 'L3-PAE-T03',
        name: 'uncontrolled physical actuation fails closed',
        expected: 'UNCONTROLLED_PHYSICAL_ACTUATION_BLOCKED'
      },
      {
        id: 'L3-PAE-T04',
        name: 'controlled actuation requires new evidence',
        expected: 'CONTROLLED_ACTUATION_REQUIRES_NEW_EVIDENCE'
      },
      {
        id: 'L3-PAE-POS-001',
        name: 'simulation-only envelope is representable but not actuation-ready',
        expected: 'PASS_REPRESENTATION_ONLY'
      }
    ],

    readiness_state: {
      physical_action_envelope_contract_created: true,
      physical_action_envelope_contract_evaluated: true,
      representation_ready: true,
      simulation_action_representable: true,
      observer_mode_action_representable: true,
      dry_run_no_actuation_representable: true,
      controlled_actuation_ready: false,
      uncontrolled_actuation_allowed: false,
      pilot_ready: false,
      physical_deployment_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-060-HBCE-LEVEL3-PHYSICAL-SAFETY-ENVELOPE-CONTRACT',

    non_claims: {
      physical_actuation_permitted: false,
      controlled_actuation_ready: false,
      uncontrolled_physical_actuation_allowed: false,
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

function writePhysicalActionEnvelopeContract(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildPhysicalActionEnvelopeContract({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level3/v0-1-c1/prog-059-physical-action-envelope-contract.json';
  const doc = writePhysicalActionEnvelopeContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_059_PHYSICAL_ACTION_ENVELOPE_CONTRACT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  CONTRACT_STATUS,
  REQUIRED_FIELDS,
  ACTION_CLASSES,
  VALIDATOR_CODES,
  buildPhysicalActionEnvelopeContract,
  writePhysicalActionEnvelopeContract
};
