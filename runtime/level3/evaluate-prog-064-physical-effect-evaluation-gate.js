'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const GATE_RESULT = 'LEVEL3_PHYSICAL_EFFECT_EVALUATION_GATE_BLOCKED';
const BLOCKING_REASONS = Object.freeze([
  'SENSOR_EVIDENCE_NOT_PHYSICAL_EFFECT_PROOF',
  'CONTROLLER_RECEIPT_NOT_EFFECT_PROOF',
  'LIVE_EFFECT_CLAIM_NOT_ALLOWED',
  'PHYSICAL_ACTUATION_NOT_PERMITTED',
  'LIVE_SENSOR_EFFECT_PROOF_NOT_READY',
  'LEVEL3_PILOT_NOT_READY',
  'PHYSICAL_DEPLOYMENT_NOT_READY',
  'PRODUCTION_NOT_READY'
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

function evaluatePhysicalEffectGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level3/v0-1-c1/prog-063-sensor-evidence-contract.json';
  const source = readJson(rootDir, sourcePath);

  const conditions = {
    source_sensor_contract_valid: validHash(source),
    sensor_evidence_contract_created: source.readiness_state.sensor_evidence_contract_created === true,
    sensor_evidence_is_effect_proof: source.readiness_state.sensor_evidence_is_effect_proof === true,
    live_sensor_effect_proof_ready: source.readiness_state.live_sensor_effect_proof_ready === true,
    live_effect_claim_allowed: source.readiness_state.live_effect_claim_allowed === true,
    physical_actuation_permitted: source.readiness_state.physical_actuation_permitted === true,
    level3_pilot_ready: source.readiness_state.pilot_ready === true,
    physical_deployment_ready: source.readiness_state.physical_deployment_ready === true,
    production_ready: source.readiness_state.production_ready === true
  };

  const doc = {
    proto: 'HBCE-L3-PROG-064-PHYSICAL-EFFECT-EVALUATION-GATE-v1',
    kind: 'HBCE_LEVEL3_PHYSICAL_EFFECT_EVALUATION_GATE',
    document_code: 'HBCE-L3-C1-PHYSICAL-EFFECT-GATE-2027-PROG-064',
    issue_id: 'PROG-064',
    priority: 'LEVEL3-PHYSICAL-EFFECT-EVALUATION-GATE',
    repository_baseline_commit: repositoryCommit,

    source_sensor_evidence_contract_ref: sourcePath,
    source_sensor_evidence_contract_revision_hash: source.revision_hash,
    source_sensor_evidence_contract_revision_hash_valid: validHash(source),

    gate_result: GATE_RESULT,
    blocking_reasons: BLOCKING_REASONS,

    inherited_sensor_boundary: {
      contract_status: source.contract_status,
      sensor_evidence_is_observation_not_effect_proof: source.sensor_evidence_contract.sensor_evidence_is_observation_not_effect_proof,
      live_sensor_requires_new_evidence: source.sensor_evidence_contract.live_sensor_requires_new_evidence,
      missing_sensor_evidence_blocks_effect_claim: source.sensor_evidence_contract.missing_sensor_evidence_blocks_effect_claim,
      sensor_evidence_as_physical_effect_proof: source.non_claims.sensor_evidence_as_physical_effect_proof,
      live_effect_claim_allowed_by_source: source.readiness_state.live_effect_claim_allowed,
      physical_actuation_permitted_by_source: source.readiness_state.physical_actuation_permitted
    },

    evaluation_conditions: conditions,

    gate_semantics: {
      sensor_evidence_is_required_but_not_sufficient: true,
      controller_receipt_is_required_but_not_sufficient: true,
      physical_action_envelope_is_required_but_not_sufficient: true,
      physical_safety_envelope_is_required_but_not_sufficient: true,
      safe_hold_estop_contract_is_required_but_not_sufficient: true,
      live_effect_claim_requires_new_evidence: true,
      physical_effect_proof_requires_separate_positive_evaluation: true,
      blocked_gate_does_not_invalidate_intake_pack: true,
      blocked_gate_prevents_pilot_ready_promotion: true
    },

    required_for_future_positive_gate: [
      'qualified_controller_receipt_with_effect_boundary',
      'qualified_sensor_evidence_with_live_effect_scope',
      'physical_action_envelope_bound_to_effect_claim',
      'physical_safety_envelope_bound_to_effect_claim',
      'safe_hold_estop_state_clearance_with_human_authorization',
      'separate_effect_evaluation_record',
      'human_authorized_scope_transition',
      'new_evidence_trigger'
    ],

    readiness_state: {
      physical_effect_evaluation_gate_created: true,
      physical_effect_evaluation_gate_evaluated: true,
      physical_effect_evaluation_gate_result: GATE_RESULT,
      physical_effect_proven: false,
      live_effect_claim_allowed: false,
      physical_actuation_permitted: false,
      controlled_actuation_ready: false,
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-065-HBCE-LEVEL3-C1-READINESS-SNAPSHOT',

    non_claims: {
      physical_effect_proven: false,
      live_effect_claim_allowed: false,
      physical_actuation_permitted: false,
      controlled_actuation_ready: false,
      level3_pilot_ready: false,
      level3_physical_deployment_ready: false,
      production_ready: false,
      autonomous_physical_control: false,
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

function writePhysicalEffectGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = evaluatePhysicalEffectGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level3/v0-1-c1/prog-064-physical-effect-evaluation-gate.json';
  const doc = writePhysicalEffectGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_064_PHYSICAL_EFFECT_EVALUATION_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  GATE_RESULT,
  BLOCKING_REASONS,
  evaluatePhysicalEffectGate,
  writePhysicalEffectGate
};
