'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const CONTRACT_STATUS = 'LEVEL3_SAFE_HOLD_ESTOP_CONTRACT_CREATED_NOT_LIVE_CONTROL_READY';

const TRIGGERS = Object.freeze([
  'BOUNDARY_UNCERTAINTY',
  'MISSING_SENSOR_EVIDENCE',
  'HUMAN_SUPERVISION_LOST',
  'CONTROLLER_RECEIPT_MISSING',
  'SAFETY_ENVELOPE_MISMATCH',
  'ACTION_ENVELOPE_MISMATCH',
  'TIME_WINDOW_EXPIRED',
  'MANUAL_ESTOP_REQUEST',
  'SYSTEM_ESTOP_REQUEST'
]);

const STATES = Object.freeze([
  'NORMAL_REPRESENTATION',
  'SAFE_HOLD_REQUIRED',
  'SAFE_HOLD_ACTIVE',
  'ESTOP_REQUIRED',
  'ESTOP_ACTIVE',
  'RESET_REQUIRES_HUMAN_AUTHORIZATION',
  'RETURN_TO_SCOPE_REQUIRES_NEW_EVALUATION'
]);

const VALIDATOR_CODES = Object.freeze([
  'SAFE_HOLD_ESTOP_CONTRACT_MISSING',
  'SAFE_HOLD_RULE_MISSING',
  'ESTOP_RULE_MISSING',
  'TRIGGER_SET_INVALID',
  'STATE_TRANSITION_INVALID',
  'RESET_AUTHORIZATION_MISSING',
  'RETURN_TO_SCOPE_WITHOUT_EVALUATION_BLOCKED',
  'LIVE_CONTROL_CLAIM_BLOCKED',
  'PHYSICAL_ACTUATION_CLAIM_BLOCKED',
  'AUTONOMOUS_RESET_BLOCKED'
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

function buildSafeHoldEstopContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);

  const sourcePath = 'docs/launch/level3/v0-1-c1/prog-060-physical-safety-envelope-contract.json';
  const source = readJson(rootDir, sourcePath);

  const doc = {
    proto: 'HBCE-L3-PROG-061-SAFE-HOLD-ESTOP-CONTRACT-v1',
    kind: 'HBCE_LEVEL3_SAFE_HOLD_ESTOP_CONTRACT',
    document_code: 'HBCE-L3-C1-SAFE-HOLD-ESTOP-2027-PROG-061',
    issue_id: 'PROG-061',
    priority: 'LEVEL3-SAFE-HOLD-AND-ESTOP-CONTRACT',
    repository_baseline_commit: repositoryCommit,

    source_physical_safety_envelope_contract_ref: sourcePath,
    source_physical_safety_envelope_contract_revision_hash: source.revision_hash,
    source_physical_safety_envelope_contract_revision_hash_valid: validHash(source),

    inherited_safety_boundary: {
      contract_status: source.contract_status,
      safety_envelope_is_constraint_not_certification: source.physical_safety_envelope_contract.safety_envelope_is_constraint_not_certification,
      does_not_authorize_live_control: source.physical_safety_envelope_contract.safety_envelope_does_not_authorize_live_control,
      safe_hold_required: source.physical_safety_envelope_contract.fail_closed_if_safe_hold_missing,
      emergency_stop_required: source.physical_safety_envelope_contract.fail_closed_if_emergency_stop_missing,
      safety_certified_by_source: source.readiness_state.safety_certified,
      live_control_ready_by_source: source.readiness_state.live_control_ready
    },

    contract_status: CONTRACT_STATUS,
    trigger_set: TRIGGERS,
    states: STATES,
    validator_codes: VALIDATOR_CODES,

    safe_hold_estop_contract: {
      purpose: 'Define fail-closed Safe Hold and Emergency Stop semantics for Level 3 representation, simulation, observer mode and dry-run-no-actuation phases.',
      safe_hold_is_required_on_boundary_uncertainty: true,
      estop_is_required_on_manual_or_system_stop_request: true,
      estop_dominates_safe_hold: true,
      reset_requires_human_authorization: true,
      return_to_scope_requires_new_evaluation: true,
      autonomous_reset_disallowed: true,
      live_control_not_authorized: true,
      physical_actuation_not_permitted: true,
      model_may_report_state: true,
      model_may_not_clear_safe_hold: true,
      model_may_not_clear_estop: true,
      missing_trigger_mapping_fails_closed: true,
      missing_reset_authorization_fails_closed: true
    },

    transition_rules: [
      {
        from: 'NORMAL_REPRESENTATION',
        trigger: 'BOUNDARY_UNCERTAINTY',
        to: 'SAFE_HOLD_REQUIRED',
        permitted: true
      },
      {
        from: 'SAFE_HOLD_REQUIRED',
        trigger: 'SYSTEM_ESTOP_REQUEST',
        to: 'ESTOP_REQUIRED',
        permitted: true
      },
      {
        from: 'SAFE_HOLD_ACTIVE',
        trigger: 'MANUAL_ESTOP_REQUEST',
        to: 'ESTOP_ACTIVE',
        permitted: true
      },
      {
        from: 'ESTOP_ACTIVE',
        trigger: 'RESET_AUTHORIZED_BY_MODEL_ONLY',
        to: 'NORMAL_REPRESENTATION',
        permitted: false,
        fail_code: 'AUTONOMOUS_RESET_BLOCKED'
      },
      {
        from: 'ESTOP_ACTIVE',
        trigger: 'HUMAN_RESET_AUTHORIZATION_MISSING',
        to: 'NORMAL_REPRESENTATION',
        permitted: false,
        fail_code: 'RESET_AUTHORIZATION_MISSING'
      }
    ],

    minimal_valid_contract_example: {
      safe_hold_rule: 'ENTER_SAFE_HOLD_ON_BOUNDARY_UNCERTAINTY_OR_MISSING_EVIDENCE',
      emergency_stop_rule: 'ENTER_ESTOP_ON_MANUAL_OR_SYSTEM_STOP_REQUEST',
      dominance_rule: 'ESTOP_DOMINATES_SAFE_HOLD',
      reset_rule: 'RESET_REQUIRES_HUMAN_AUTHORIZATION_AND_NEW_EVALUATION',
      model_authority_rule: 'MODEL_MAY_REPORT_STATE_BUT_MAY_NOT_CLEAR_SAFE_HOLD_OR_ESTOP',
      live_control_rule: 'LIVE_CONTROL_NOT_AUTHORIZED_BY_THIS_CONTRACT',
      fail_closed_rule: 'BLOCK_RETURN_TO_SCOPE_IF_RESET_OR_REEVALUATION_IS_MISSING'
    },

    validation_vectors: [
      { id: 'L3-SHE-T01', name: 'missing safe hold rule fails closed', expected: 'SAFE_HOLD_RULE_MISSING' },
      { id: 'L3-SHE-T02', name: 'missing emergency stop rule fails closed', expected: 'ESTOP_RULE_MISSING' },
      { id: 'L3-SHE-T03', name: 'model-only reset fails closed', expected: 'AUTONOMOUS_RESET_BLOCKED' },
      { id: 'L3-SHE-T04', name: 'return to scope without evaluation fails closed', expected: 'RETURN_TO_SCOPE_WITHOUT_EVALUATION_BLOCKED' },
      { id: 'L3-SHE-POS-001', name: 'safe hold and estop rules are representable but not live-control-ready', expected: 'PASS_REPRESENTATION_ONLY' }
    ],

    readiness_state: {
      safe_hold_estop_contract_created: true,
      safe_hold_estop_contract_evaluated: true,
      safe_hold_representable: true,
      emergency_stop_representable: true,
      reset_requires_human_authorization: true,
      return_to_scope_requires_new_evaluation: true,
      live_control_ready: false,
      physical_actuation_permitted: false,
      safety_certified: false,
      pilot_ready: false,
      physical_deployment_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-062-HBCE-LEVEL3-CONTROLLER-RECEIPT-CONTRACT',

    non_claims: {
      live_control_ready: false,
      physical_actuation_permitted: false,
      safety_certification: false,
      autonomous_reset_allowed: false,
      autonomous_physical_control: false,
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      production_ready: false,
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

function writeSafeHoldEstopContract(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildSafeHoldEstopContract({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level3/v0-1-c1/prog-061-safe-hold-estop-contract.json';
  const doc = writeSafeHoldEstopContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_061_SAFE_HOLD_ESTOP_CONTRACT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  CONTRACT_STATUS,
  TRIGGERS,
  STATES,
  VALIDATOR_CODES,
  buildSafeHoldEstopContract,
  writeSafeHoldEstopContract
};
