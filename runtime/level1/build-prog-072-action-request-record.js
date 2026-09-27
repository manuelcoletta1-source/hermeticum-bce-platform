'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_ACTION_REQUEST_RECORD_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-071-policy-evaluation-record.json';

const REQUIRED_FIELDS = Object.freeze([
  'action_request_id',
  'authority_boundary_ref',
  'policy_evaluation_ref',
  'policy_evaluation_result',
  'action_class',
  'target_ref',
  'target_digest',
  'request_payload_ref',
  'request_payload_digest',
  'requester_ref',
  'requested_at',
  'idempotency_key',
  'expected_receipt_ref',
  'evidence_chain_ref',
  'non_claims'
]);

const ACTION_CLASSES = Object.freeze([
  'DEMO_ONLY_DIGITAL_ACTION',
  'GOVERNED_WORKFLOW_ACTION',
  'ACCESS_DECISION_REQUEST',
  'AUTHORIZATION_REQUEST',
  'AUDIT_EXPORT_REQUEST',
  'EVIDENCE_PACKAGE_REQUEST'
]);

function readJson(rootDir, rel) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, rel), 'utf8'));
}

function gitHead(rootDir) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (_err) {
    return 'UNKNOWN';
  }
}

function validHash(doc) {
  if (!doc || !doc.revision_hash) return false;
  const body = { ...doc };
  delete body.revision_hash;
  return doc.revision_hash === sha256Digest(body);
}

function buildActionRequestRecord(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-072-ACTION-REQUEST-RECORD-v1',
    kind: 'HBCE_LEVEL1_ACTION_REQUEST_RECORD',
    document_code: 'HBCE-L1-ACTION-REQUEST-RECORD-2027-PROG-072',
    issue_id: 'PROG-072',
    priority: 'LEVEL1-ACTION-REQUEST-RECORD',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_policy_evaluation_record_ref: SOURCE_REF,
    source_policy_evaluation_record_revision_hash: source.revision_hash,
    source_policy_evaluation_record_revision_hash_valid: validHash(source),

    action_request_record_status: STATUS,

    inherited_policy_boundary: {
      policy_evaluation_record_status: source.policy_evaluation_record_status,
      policy_evaluation_record_ready: source.readiness_state.policy_evaluation_record_ready,
      positive_allow_ready: source.readiness_state.positive_allow_ready,
      block_dominates_unknown_and_allow: source.policy_evaluation_record.block_dominates_unknown_and_allow,
      unknown_dominates_allow: source.policy_evaluation_record.unknown_dominates_allow,
      ai_model_evaluation_authority_allowed: source.policy_evaluation_record.ai_model_evaluation_authority_allowed
    },

    action_request_record: {
      purpose: 'Define the Level 1 action request record required after authority boundary and policy evaluation, before an action receipt can be recorded.',
      required_fields: REQUIRED_FIELDS,
      action_classes_allowed: ACTION_CLASSES,
      authority_boundary_ref_required: true,
      policy_evaluation_ref_required: true,
      policy_evaluation_allow_required: true,
      action_class_required: true,
      target_ref_required: true,
      target_digest_required: true,
      request_payload_digest_required: true,
      requester_ref_required: true,
      idempotency_key_required: true,
      expected_receipt_ref_required: true,
      evidence_chain_ref_required: true,
      action_request_is_not_execution: true,
      action_request_is_not_receipt: true,
      action_request_is_not_effect_proof: true,
      ai_model_action_authority_allowed: false,
      model_output_may_prepare_request_only: true,
      block_result_blocks_action_request: true,
      unknown_result_blocks_action_request: true,
      missing_authority_boundary_fails_closed: true,
      missing_policy_evaluation_fails_closed: true,
      missing_digest_fails_closed: true,
      missing_idempotency_key_fails_closed: true
    },

    minimal_record_template: {
      action_request_id: 'ACTION-REQ-TEMPLATE-0001',
      authority_boundary_ref: 'PROG-070-HBCE-LEVEL1-AUTHORITY-BOUNDARY-STATEMENT',
      policy_evaluation_ref: 'PROG-071-HBCE-LEVEL1-POLICY-EVALUATION-RECORD',
      policy_evaluation_result: 'ALLOW_REQUIRED_TO_PROCEED',
      action_class: 'DEMO_ONLY_DIGITAL_ACTION',
      target_ref: 'TARGET::TO_BE_BOUND',
      target_digest: 'sha256:TO_BE_BOUND',
      request_payload_ref: 'REQUEST-PAYLOAD::TO_BE_BOUND',
      request_payload_digest: 'sha256:TO_BE_BOUND',
      requester_ref: 'REQUESTER::TO_BE_BOUND',
      requested_at: 'TO_BE_BOUND',
      idempotency_key: 'IDEMPOTENCY::TO_BE_BOUND',
      expected_receipt_ref: 'ACTION-RECEIPT::TO_BE_BOUND',
      evidence_chain_ref: 'PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST',
      non_claims: {
        action_executed: false,
        action_receipted: false,
        effect_proven: false,
        legal_validity: false,
        ai_authority: false,
        autonomous_authority: false,
        production_ready: false
      }
    },

    fail_closed_codes: [
      'ACTION_REQUEST_RECORD_MISSING',
      'AUTHORITY_BOUNDARY_REF_MISSING',
      'POLICY_EVALUATION_REF_MISSING',
      'POLICY_EVALUATION_ALLOW_REQUIRED',
      'POLICY_EVALUATION_BLOCKED',
      'POLICY_EVALUATION_UNKNOWN',
      'ACTION_CLASS_MISSING',
      'TARGET_REF_MISSING',
      'TARGET_DIGEST_MISSING',
      'REQUEST_PAYLOAD_DIGEST_MISSING',
      'IDEMPOTENCY_KEY_MISSING',
      'EXPECTED_RECEIPT_REF_MISSING',
      'AI_ACTION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      action_request_record_defined: true,
      action_request_record_ready: false,
      concrete_action_bound: false,
      authority_boundary_ref_bound: false,
      policy_evaluation_ref_bound: false,
      policy_allow_bound: false,
      target_ref_bound: false,
      target_digest_bound: false,
      request_payload_digest_bound: false,
      idempotency_key_bound: false,
      expected_receipt_ref_bound: false,
      evidence_chain_node_complete: false,
      action_receipt_ready: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-073-HBCE-LEVEL1-ACTION-RECEIPT-RECORD',

    non_claims: {
      concrete_action_bound: false,
      action_authorized_for_execution: false,
      action_executed: false,
      action_receipted: false,
      effect_proven: false,
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      autonomous_authority: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeActionRequestRecord(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildActionRequestRecord({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-072-action-request-record.json';
  const doc = writeActionRequestRecord(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_072_ACTION_REQUEST_RECORD_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, REQUIRED_FIELDS, ACTION_CLASSES, buildActionRequestRecord, writeActionRequestRecord };
