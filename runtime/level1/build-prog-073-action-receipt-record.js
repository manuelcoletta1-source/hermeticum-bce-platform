'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_ACTION_RECEIPT_RECORD_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-072-action-request-record.json';

const RECEIPT_STATUSES = Object.freeze([
  'RECEIVED',
  'ACCEPTED_FOR_PROCESSING',
  'REJECTED',
  'BLOCKED',
  'UNKNOWN'
]);

const REQUIRED_FIELDS = Object.freeze([
  'action_receipt_id',
  'action_request_ref',
  'action_request_digest',
  'target_ref',
  'target_digest',
  'receipt_status',
  'receipt_code',
  'received_at',
  'target_actor_ref',
  'target_actor_digest',
  'response_payload_ref',
  'response_payload_digest',
  'correlation_id',
  'idempotency_key',
  'evidence_chain_ref',
  'non_claims'
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

function buildActionReceiptRecord(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-073-ACTION-RECEIPT-RECORD-v1',
    kind: 'HBCE_LEVEL1_ACTION_RECEIPT_RECORD',
    document_code: 'HBCE-L1-ACTION-RECEIPT-RECORD-2027-PROG-073',
    issue_id: 'PROG-073',
    priority: 'LEVEL1-ACTION-RECEIPT-RECORD',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_action_request_record_ref: SOURCE_REF,
    source_action_request_record_revision_hash: source.revision_hash,
    source_action_request_record_revision_hash_valid: validHash(source),

    action_receipt_record_status: STATUS,

    inherited_action_request_boundary: {
      action_request_record_status: source.action_request_record_status,
      action_request_record_ready: source.readiness_state.action_request_record_ready,
      action_request_is_not_execution: source.action_request_record.action_request_is_not_execution,
      action_request_is_not_receipt: source.action_request_record.action_request_is_not_receipt,
      action_request_is_not_effect_proof: source.action_request_record.action_request_is_not_effect_proof,
      ai_model_action_authority_allowed: source.action_request_record.ai_model_action_authority_allowed
    },

    action_receipt_record: {
      purpose: 'Define the Level 1 action receipt record required after an action request, before audit event recording.',
      required_fields: REQUIRED_FIELDS,
      receipt_statuses_allowed: RECEIPT_STATUSES,
      action_request_ref_required: true,
      action_request_digest_required: true,
      target_ref_required: true,
      target_digest_required: true,
      receipt_status_required: true,
      receipt_code_required: true,
      received_at_required: true,
      target_actor_ref_required: true,
      response_payload_digest_required: true,
      correlation_id_required: true,
      idempotency_key_required: true,
      evidence_chain_ref_required: true,
      receipt_is_not_effect_proof: true,
      receipt_is_not_business_success: true,
      receipt_is_not_legal_validity: true,
      receipt_is_not_production_readiness: true,
      ai_model_receipt_authority_allowed: false,
      rejected_or_blocked_receipt_blocks_success_claim: true,
      unknown_receipt_blocks_success_claim: true,
      missing_action_request_fails_closed: true,
      missing_receipt_status_fails_closed: true,
      missing_digest_fails_closed: true,
      missing_correlation_fails_closed: true
    },

    minimal_record_template: {
      action_receipt_id: 'ACTION-RECEIPT-TEMPLATE-0001',
      action_request_ref: 'PROG-072-HBCE-LEVEL1-ACTION-REQUEST-RECORD',
      action_request_digest: 'sha256:TO_BE_BOUND',
      target_ref: 'TARGET::TO_BE_BOUND',
      target_digest: 'sha256:TO_BE_BOUND',
      receipt_status: 'UNKNOWN',
      receipt_code: 'RECEIPT_NOT_RECORDED',
      received_at: 'TO_BE_BOUND',
      target_actor_ref: 'TARGET-ACTOR::TO_BE_BOUND',
      target_actor_digest: 'sha256:TO_BE_BOUND',
      response_payload_ref: 'RESPONSE-PAYLOAD::TO_BE_BOUND',
      response_payload_digest: 'sha256:TO_BE_BOUND',
      correlation_id: 'CORRELATION::TO_BE_BOUND',
      idempotency_key: 'IDEMPOTENCY::TO_BE_BOUND',
      evidence_chain_ref: 'PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST',
      non_claims: {
        effect_proven: false,
        business_success: false,
        legal_validity: false,
        ai_authority: false,
        autonomous_authority: false,
        production_ready: false
      }
    },

    fail_closed_codes: [
      'ACTION_RECEIPT_RECORD_MISSING',
      'ACTION_REQUEST_REF_MISSING',
      'ACTION_REQUEST_DIGEST_MISSING',
      'TARGET_REF_MISSING',
      'TARGET_DIGEST_MISSING',
      'RECEIPT_STATUS_MISSING',
      'RECEIPT_STATUS_INVALID',
      'RECEIPT_UNKNOWN_BLOCKS_SUCCESS_CLAIM',
      'RECEIPT_REJECTED_BLOCKS_SUCCESS_CLAIM',
      'RECEIPT_BLOCKED_BLOCKS_SUCCESS_CLAIM',
      'RESPONSE_PAYLOAD_DIGEST_MISSING',
      'CORRELATION_ID_MISSING',
      'IDEMPOTENCY_KEY_MISSING',
      'AI_RECEIPT_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      action_receipt_record_defined: true,
      action_receipt_record_ready: false,
      concrete_receipt_bound: false,
      action_request_ref_bound: false,
      action_request_digest_bound: false,
      receipt_status_bound: false,
      response_payload_digest_bound: false,
      correlation_id_bound: false,
      idempotency_key_bound: false,
      evidence_chain_node_complete: false,
      audit_event_ready: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-074-HBCE-LEVEL1-AUDIT-EVENT-RECORD',

    non_claims: {
      concrete_receipt_bound: false,
      action_executed: false,
      effect_proven: false,
      business_success: false,
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

function writeActionReceiptRecord(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildActionReceiptRecord({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-073-action-receipt-record.json';
  const doc = writeActionReceiptRecord(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_073_ACTION_RECEIPT_RECORD_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, REQUIRED_FIELDS, RECEIPT_STATUSES, buildActionReceiptRecord, writeActionReceiptRecord };
