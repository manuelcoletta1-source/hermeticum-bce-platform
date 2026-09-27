'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const CONTRACT_STATUS = 'LEVEL3_SENSOR_EVIDENCE_CONTRACT_CREATED_NOT_PHYSICAL_EFFECT_PROOF';

const SENSOR_SOURCE_MODES = Object.freeze([
  'SIMULATED_SENSOR',
  'RECORDED_SENSOR',
  'OBSERVER_SIGNED_SENSOR',
  'CONTROLLER_REPORTED_SENSOR',
  'LIVE_SENSOR_REQUIRES_NEW_EVIDENCE'
]);

const REQUIRED_FIELDS = Object.freeze([
  'sensor_evidence_id',
  'sensor_source_ref',
  'sensor_source_mode',
  'controller_receipt_ref',
  'physical_action_envelope_ref',
  'physical_safety_envelope_ref',
  'observed_property',
  'observation_window',
  'measurement_digest',
  'calibration_ref',
  'provenance_ref',
  'limitations',
  'effect_assessment_boundary',
  'fail_closed_rule'
]);

const VALIDATOR_CODES = Object.freeze([
  'SENSOR_EVIDENCE_MISSING',
  'SENSOR_EVIDENCE_ID_INVALID',
  'SENSOR_SOURCE_REF_INVALID',
  'SENSOR_SOURCE_MODE_INVALID',
  'CONTROLLER_RECEIPT_REF_INVALID',
  'PHYSICAL_ACTION_ENVELOPE_REF_INVALID',
  'PHYSICAL_SAFETY_ENVELOPE_REF_INVALID',
  'OBSERVED_PROPERTY_INVALID',
  'OBSERVATION_WINDOW_INVALID',
  'MEASUREMENT_DIGEST_INVALID',
  'CALIBRATION_REF_INVALID',
  'PROVENANCE_REF_INVALID',
  'LIMITATIONS_MISSING',
  'EFFECT_ASSESSMENT_BOUNDARY_MISSING',
  'FAIL_CLOSED_RULE_MISSING',
  'SENSOR_AS_EFFECT_PROOF_BLOCKED',
  'LIVE_SENSOR_REQUIRES_NEW_EVIDENCE'
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

function buildSensorEvidenceContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);
  const sourcePath = 'docs/launch/level3/v0-1-c1/prog-062-controller-receipt-contract.json';
  const source = readJson(rootDir, sourcePath);

  const doc = {
    proto: 'HBCE-L3-PROG-063-SENSOR-EVIDENCE-CONTRACT-v1',
    kind: 'HBCE_LEVEL3_SENSOR_EVIDENCE_CONTRACT',
    document_code: 'HBCE-L3-C1-SENSOR-EVIDENCE-2027-PROG-063',
    issue_id: 'PROG-063',
    priority: 'LEVEL3-SENSOR-EVIDENCE-CONTRACT',
    repository_baseline_commit: repositoryCommit,

    source_controller_receipt_contract_ref: sourcePath,
    source_controller_receipt_contract_revision_hash: source.revision_hash,
    source_controller_receipt_contract_revision_hash_valid: validHash(source),

    inherited_controller_boundary: {
      contract_status: source.contract_status,
      receipt_is_not_effect_proof: source.controller_receipt_contract.receipt_is_not_effect_proof,
      receipt_is_not_live_control_authorization: source.controller_receipt_contract.receipt_is_not_live_control_authorization,
      live_effect_claim_allowed_by_source: source.readiness_state.live_effect_claim_allowed,
      physical_actuation_permitted_by_source: source.readiness_state.physical_actuation_permitted
    },

    contract_status: CONTRACT_STATUS,
    sensor_source_modes: SENSOR_SOURCE_MODES,
    required_fields: REQUIRED_FIELDS,
    validator_codes: VALIDATOR_CODES,

    sensor_evidence_contract: {
      purpose: 'Bind sensor-side observations to Level 3 controller receipt, action envelope and safety envelope references without converting observation into standalone physical effect proof.',
      sensor_evidence_is_observation_not_effect_proof: true,
      sensor_evidence_requires_controller_receipt_ref: true,
      sensor_evidence_requires_action_and_safety_refs: true,
      observation_window_required: true,
      measurement_digest_required: true,
      provenance_required: true,
      calibration_ref_required: true,
      limitations_required: true,
      live_sensor_requires_new_evidence: true,
      missing_sensor_evidence_blocks_effect_claim: true,
      unsupported_effect_claim_fails_closed: true
    },

    allowed_without_new_evidence: {
      simulated_sensor_evidence: true,
      recorded_sensor_evidence: true,
      observer_signed_sensor_evidence: true,
      controller_reported_sensor_evidence: true,
      live_sensor_effect_proof: false,
      standalone_physical_effect_proof: false,
      physical_deployment_proof: false
    },

    minimal_valid_sensor_evidence_example: {
      sensor_evidence_id: 'SENSOR-EVIDENCE-EXAMPLE-0001',
      sensor_source_ref: 'SENSOR::SIMULATION_ODOMETRY',
      sensor_source_mode: 'SIMULATED_SENSOR',
      controller_receipt_ref: 'CTRL-RECEIPT-EXAMPLE-0001',
      physical_action_envelope_ref: 'PAE-EXAMPLE-0001',
      physical_safety_envelope_ref: 'PSE-EXAMPLE-0001',
      observed_property: 'SIMULATED_DISPLACEMENT',
      observation_window: {
        start: '2027-01-19T00:00:00Z',
        end: '2027-01-19T00:00:10Z'
      },
      measurement_digest: 'sha256:sensor-measurement-example',
      calibration_ref: 'CALIBRATION::SIMULATION_MODEL',
      provenance_ref: 'PROVENANCE::SIMULATION_RUN',
      limitations: [
        'simulation_only',
        'not_live_physical_effect',
        'not_safety_certification'
      ],
      effect_assessment_boundary: {
        may_support_simulated_effect_assessment: true,
        proves_live_physical_effect: false,
        requires_separate_effect_evaluation: true
      },
      fail_closed_rule: 'BLOCK_EFFECT_CLAIM_IF_SENSOR_PROVENANCE_OR_LIMITATIONS_ARE_MISSING'
    },

    validation_vectors: [
      { id: 'L3-SE-T01', name: 'missing sensor evidence fails closed', expected: 'SENSOR_EVIDENCE_MISSING' },
      { id: 'L3-SE-T02', name: 'missing provenance fails closed', expected: 'PROVENANCE_REF_INVALID' },
      { id: 'L3-SE-T03', name: 'sensor as standalone effect proof fails closed', expected: 'SENSOR_AS_EFFECT_PROOF_BLOCKED' },
      { id: 'L3-SE-T04', name: 'live sensor requires new evidence', expected: 'LIVE_SENSOR_REQUIRES_NEW_EVIDENCE' },
      { id: 'L3-SE-POS-001', name: 'simulated sensor evidence is valid but not physical effect proof', expected: 'PASS_OBSERVATION_ONLY' }
    ],

    readiness_state: {
      sensor_evidence_contract_created: true,
      sensor_evidence_contract_evaluated: true,
      sensor_evidence_representable: true,
      simulated_sensor_evidence_representable: true,
      recorded_sensor_evidence_representable: true,
      observer_signed_sensor_evidence_representable: true,
      sensor_evidence_is_effect_proof: false,
      live_sensor_effect_proof_ready: false,
      live_effect_claim_allowed: false,
      physical_actuation_permitted: false,
      pilot_ready: false,
      physical_deployment_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-064-HBCE-LEVEL3-PHYSICAL-EFFECT-EVALUATION-GATE',

    non_claims: {
      sensor_evidence_as_physical_effect_proof: false,
      live_sensor_effect_proof_ready: false,
      live_effect_claim_allowed: false,
      physical_actuation_permitted: false,
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

function writeSensorEvidenceContract(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildSensorEvidenceContract({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level3/v0-1-c1/prog-063-sensor-evidence-contract.json';
  const doc = writeSensorEvidenceContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_063_SENSOR_EVIDENCE_CONTRACT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  CONTRACT_STATUS,
  SENSOR_SOURCE_MODES,
  REQUIRED_FIELDS,
  VALIDATOR_CODES,
  buildSensorEvidenceContract,
  writeSensorEvidenceContract
};
