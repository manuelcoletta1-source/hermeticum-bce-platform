'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const CONTRACT_STATUS = 'LEVEL3_CONTROLLER_RECEIPT_CONTRACT_CREATED_NOT_EFFECT_PROOF';

const RECEIPT_STATUSES = Object.freeze([
  'RECEIVED',
  'REJECTED',
  'ACCEPTED_FOR_SIMULATION',
  'ACCEPTED_FOR_OBSERVER_MODE',
  'ACCEPTED_FOR_DRY_RUN_NO_ACTUATION',
  'BLOCKED_SAFE_HOLD',
  'BLOCKED_ESTOP',
  'BLOCKED_SCOPE_MISMATCH'
]);

const REQUIRED_FIELDS = Object.freeze([
  'controller_receipt_id',
  'controller_interface_ref',
  'physical_action_envelope_ref',
  'physical_safety_envelope_ref',
  'safe_hold_estop_ref',
  'receipt_status',
  'received_at',
  'controller_digest',
  'request_digest',
  'decision_code',
  'effect_claim',
  'evidence_refs',
  'fail_closed_rule'
]);

const VALIDATOR_CODES = Object.freeze([
  'CONTROLLER_RECEIPT_MISSING',
  'CONTROLLER_RECEIPT_ID_INVALID',
  'CONTROLLER_INTERFACE_REF_INVALID',
  'PHYSICAL_ACTION_ENVELOPE_REF_INVALID',
  'PHYSICAL_SAFETY_ENVELOPE_REF_INVALID',
  'SAFE_HOLD_ESTOP_REF_INVALID',
  'RECEIPT_STATUS_INVALID',
  'RECEIVED_AT_INVALID',
  'CONTROLLER_DIGEST_INVALID',
  'REQUEST_DIGEST_INVALID',
  'DECISION_CODE_INVALID',
  'EFFECT_CLAIM_UNSUPPORTED',
  'EVIDENCE_REFS_MISSING',
  'FAIL_CLOSED_RULE_MISSING',
  'LIVE_EFFECT_CLAIM_BLOCKED',
  'RECEIPT_AS_EFFECT_PROOF_BLOCKED'
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

function buildControllerReceiptContract(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const repositoryCommit = options.repositoryCommit || gitHead(rootDir);

  const sourcePath = 'docs/launch/level3/v0-1-c1/prog-061-safe-hold-estop-contract.json';
  const source = readJson(rootDir, sourcePath);

  const doc = {
    proto: 'HBCE-L3-PROG-062-CONTROLLER-RECEIPT-CONTRACT-v1',
    kind: 'HBCE_LEVEL3_CONTROLLER_RECEIPT_CONTRACT',
    document_code: 'HBCE-L3-C1-CONTROLLER-RECEIPT-2027-PROG-062',
    issue_id: 'PROG-062',
    priority: 'LEVEL3-CONTROLLER-RECEIPT-CONTRACT',
    repository_baseline_commit: repositoryCommit,

    source_safe_hold_estop_contract_ref: sourcePath,
    source_safe_hold_estop_contract_revision_hash: source.revision_hash,
    source_safe_hold_estop_contract_revision_hash_valid: validHash(source),

    inherited_stop_boundary: {
      contract_status: source.contract_status,
      estop_dominates_safe_hold: source.safe_hold_estop_contract.estop_dominates_safe_hold,
      reset_requires_human_authorization: source.safe_hold_estop_contract.reset_requires_human_authorization,
      model_may_not_clear_safe_hold: source.safe_hold_estop_contract.model_may_not_clear_safe_hold,
      model_may_not_clear_estop: source.safe_hold_estop_contract.model_may_not_clear_estop,
      live_control_ready_by_source: source.readiness_state.live_control_ready,
      physical_actuation_permitted_by_source: source.readiness_state.physical_actuation_permitted
    },

    contract_status: CONTRACT_STATUS,
    receipt_statuses: RECEIPT_STATUSES,
    required_fields: REQUIRED_FIELDS,
    validator_codes: VALIDATOR_CODES,

    controller_receipt_contract: {
      purpose: 'Bind controller-side receipt, rejection or scoped acceptance to Level 3 action, safety and stop-envelope references.',
      receipt_is_not_effect_proof: true,
      receipt_is_not_live_control_authorization: true,
      controller_may_accept_for_simulation: true,
      controller_may_accept_for_observer_mode: true,
      controller_may_accept_for_dry_run_no_actuation: true,
      controller_may_not_claim_live_effect_without_new_evidence: true,
      controller_receipt_required_before_any_effect_claim: true,
      safe_hold_or_estop_status_blocks_scope_return: true,
      missing_receipt_fails_closed: true,
      missing_digest_fails_closed: true,
      unsupported_effect_claim_fails_closed: true
    },

    allowed_receipt_meaning_without_new_evidence: {
      received_request: true,
      rejected_request: true,
      accepted_for_simulation: true,
      accepted_for_observer_mode: true,
      accepted_for_dry_run_no_actuation: true,
      proof_of_live_effect: false,
      authorization_for_live_control: false,
      proof_of_physical_deployment: false
    },

    minimal_valid_controller_receipt_example: {
      controller_receipt_id: 'CTRL-RECEIPT-EXAMPLE-0001',
      controller_interface_ref: 'CONTROLLER::SIMULATION_ADAPTER',
      physical_action_envelope_ref: 'PAE-EXAMPLE-0001',
      physical_safety_envelope_ref: 'PSE-EXAMPLE-0001',
      safe_hold_estop_ref: 'SHE-EXAMPLE-0001',
      receipt_status: 'ACCEPTED_FOR_SIMULATION',
      received_at: '2027-01-19T00:00:00Z',
      controller_digest: 'sha256:controller-interface-example',
      request_digest: 'sha256:physical-action-request-example',
      decision_code: 'ACCEPTED_FOR_SIMULATION_ONLY',
      effect_claim: {
        live_effect_claimed: false,
        simulated_effect_claimed: false,
        effect_claim_requires_separate_evidence: true
      },
      evidence_refs: [
        'AUDIT::CONTROLLER_RECEIPT_EVENT_REQUIRED',
        'EVIDENCE::SIMULATION_RESULT_REQUIRED_FOR_EFFECT'
      ],
      fail_closed_rule: 'BLOCK_EFFECT_CLAIM_IF_RECEIPT_OR_EVIDENCE_IS_MISSING'
    },

    validation_vectors: [
      { id: 'L3-CR-T01', name: 'missing controller receipt fails closed', expected: 'CONTROLLER_RECEIPT_MISSING' },
      { id: 'L3-CR-T02', name: 'missing request digest fails closed', expected: 'REQUEST_DIGEST_INVALID' },
      { id: 'L3-CR-T03', name: 'live effect claim fails closed', expected: 'LIVE_EFFECT_CLAIM_BLOCKED' },
      { id: 'L3-CR-T04', name: 'receipt as effect proof fails closed', expected: 'RECEIPT_AS_EFFECT_PROOF_BLOCKED' },
      { id: 'L3-CR-POS-001', name: 'simulation receipt is valid but not effect proof', expected: 'PASS_RECEIPT_ONLY' }
    ],

    readiness_state: {
      controller_receipt_contract_created: true,
      controller_receipt_contract_evaluated: true,
      controller_receipt_representable: true,
      simulation_receipt_representable: true,
      observer_mode_receipt_representable: true,
      dry_run_no_actuation_receipt_representable: true,
      receipt_is_effect_proof: false,
      live_effect_claim_allowed: false,
      live_control_ready: false,
      physical_actuation_permitted: false,
      pilot_ready: false,
      physical_deployment_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-063-HBCE-LEVEL3-SENSOR-EVIDENCE-CONTRACT',

    non_claims: {
      controller_receipt_as_effect_proof: false,
      live_effect_claim_allowed: false,
      live_control_ready: false,
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

function writeControllerReceiptContract(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildControllerReceiptContract({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level3/v0-1-c1/prog-062-controller-receipt-contract.json';
  const doc = writeControllerReceiptContract(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_062_CONTROLLER_RECEIPT_CONTRACT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  CONTRACT_STATUS,
  RECEIPT_STATUSES,
  REQUIRED_FIELDS,
  VALIDATOR_CODES,
  buildControllerReceiptContract,
  writeControllerReceiptContract
};
