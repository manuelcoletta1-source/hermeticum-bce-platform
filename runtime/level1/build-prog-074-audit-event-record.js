'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_AUDIT_EVENT_RECORD_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-073-action-receipt-record.json';

const EVENT_TYPES = Object.freeze([
  'AUTHORITY_BOUNDARY_REFERENCED',
  'POLICY_EVALUATION_REFERENCED',
  'ACTION_REQUEST_RECORDED',
  'ACTION_RECEIPT_RECORDED',
  'DECISION_PROOF_AUDIT_EVENT'
]);

const EVENT_RESULTS = Object.freeze([
  'RECORDED',
  'REJECTED',
  'BLOCKED',
  'UNKNOWN'
]);

const REQUIRED_FIELDS = Object.freeze([
  'audit_event_id',
  'event_type',
  'event_result',
  'authority_boundary_ref',
  'policy_evaluation_ref',
  'action_request_ref',
  'action_receipt_ref',
  'actor_ref',
  'target_ref',
  'event_time',
  'correlation_id',
  'idempotency_key',
  'previous_chain_ref',
  'previous_chain_digest',
  'input_digests',
  'output_digests',
  'audit_event_digest',
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

function buildAuditEventRecord(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-074-AUDIT-EVENT-RECORD-v1',
    kind: 'HBCE_LEVEL1_AUDIT_EVENT_RECORD',
    document_code: 'HBCE-L1-AUDIT-EVENT-RECORD-2027-PROG-074',
    issue_id: 'PROG-074',
    priority: 'LEVEL1-AUDIT-EVENT-RECORD',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_action_receipt_record_ref: SOURCE_REF,
    source_action_receipt_record_revision_hash: source.revision_hash,
    source_action_receipt_record_revision_hash_valid: validHash(source),

    audit_event_record_status: STATUS,

    inherited_action_receipt_boundary: {
      action_receipt_record_status: source.action_receipt_record_status,
      action_receipt_record_ready: source.readiness_state.action_receipt_record_ready,
      receipt_is_not_effect_proof: source.action_receipt_record.receipt_is_not_effect_proof,
      receipt_is_not_business_success: source.action_receipt_record.receipt_is_not_business_success,
      receipt_is_not_legal_validity: source.action_receipt_record.receipt_is_not_legal_validity,
      ai_model_receipt_authority_allowed: source.action_receipt_record.ai_model_receipt_authority_allowed
    },

    audit_event_record: {
      purpose: 'Define the Level 1 audit event record that binds authority, policy evaluation, action request and action receipt into a replayable audit trace.',
      required_fields: REQUIRED_FIELDS,
      event_types_allowed: EVENT_TYPES,
      event_results_allowed: EVENT_RESULTS,
      authority_boundary_ref_required: true,
      policy_evaluation_ref_required: true,
      action_request_ref_required: true,
      action_receipt_ref_required: true,
      actor_ref_required: true,
      target_ref_required: true,
      event_time_required: true,
      correlation_id_required: true,
      idempotency_key_required: true,
      previous_chain_digest_required: true,
      input_digests_required: true,
      output_digests_required: true,
      audit_event_digest_required: true,
      evidence_chain_ref_required: true,
      audit_event_is_not_effect_proof: true,
      audit_event_is_not_business_success: true,
      audit_event_is_not_legal_validity: true,
      audit_event_is_not_production_readiness: true,
      ai_model_audit_authority_allowed: false,
      missing_receipt_fails_closed: true,
      missing_previous_chain_digest_fails_closed: true,
      missing_audit_event_digest_fails_closed: true,
      missing_correlation_fails_closed: true,
      broken_audit_chain_fails_closed: true
    },

    minimal_record_template: {
      audit_event_id: 'AUDIT-EVENT-TEMPLATE-0001',
      event_type: 'DECISION_PROOF_AUDIT_EVENT',
      event_result: 'UNKNOWN',
      authority_boundary_ref: 'PROG-070-HBCE-LEVEL1-AUTHORITY-BOUNDARY-STATEMENT',
      policy_evaluation_ref: 'PROG-071-HBCE-LEVEL1-POLICY-EVALUATION-RECORD',
      action_request_ref: 'PROG-072-HBCE-LEVEL1-ACTION-REQUEST-RECORD',
      action_receipt_ref: 'PROG-073-HBCE-LEVEL1-ACTION-RECEIPT-RECORD',
      actor_ref: 'ACTOR::TO_BE_BOUND',
      target_ref: 'TARGET::TO_BE_BOUND',
      event_time: 'TO_BE_BOUND',
      correlation_id: 'CORRELATION::TO_BE_BOUND',
      idempotency_key: 'IDEMPOTENCY::TO_BE_BOUND',
      previous_chain_ref: 'ACTION_RECEIPT_RECORD',
      previous_chain_digest: 'sha256:TO_BE_BOUND',
      input_digests: ['sha256:AUTHORITY_POLICY_REQUEST_RECEIPT_TO_BE_BOUND'],
      output_digests: ['sha256:AUDIT_EVENT_TO_BE_BOUND'],
      audit_event_digest: 'sha256:TO_BE_BOUND',
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
      'AUDIT_EVENT_RECORD_MISSING',
      'AUDIT_EVENT_TYPE_INVALID',
      'AUDIT_EVENT_RESULT_INVALID',
      'AUTHORITY_BOUNDARY_REF_MISSING',
      'POLICY_EVALUATION_REF_MISSING',
      'ACTION_REQUEST_REF_MISSING',
      'ACTION_RECEIPT_REF_MISSING',
      'PREVIOUS_CHAIN_DIGEST_MISSING',
      'AUDIT_EVENT_DIGEST_MISSING',
      'INPUT_DIGESTS_MISSING',
      'OUTPUT_DIGESTS_MISSING',
      'CORRELATION_ID_MISSING',
      'IDEMPOTENCY_KEY_MISSING',
      'BROKEN_AUDIT_CHAIN',
      'AI_AUDIT_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      audit_event_record_defined: true,
      audit_event_record_ready: false,
      concrete_audit_event_bound: false,
      authority_boundary_ref_bound: false,
      policy_evaluation_ref_bound: false,
      action_request_ref_bound: false,
      action_receipt_ref_bound: false,
      previous_chain_digest_bound: false,
      audit_event_digest_bound: false,
      correlation_id_bound: false,
      idempotency_key_bound: false,
      evidence_chain_node_complete: false,
      evidence_export_manifest_ready: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-075-HBCE-LEVEL1-EVIDENCE-EXPORT-MANIFEST',

    non_claims: {
      concrete_audit_event_bound: false,
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

function writeAuditEventRecord(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildAuditEventRecord({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-074-audit-event-record.json';
  const doc = writeAuditEventRecord(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_074_AUDIT_EVENT_RECORD_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, REQUIRED_FIELDS, EVENT_TYPES, EVENT_RESULTS, buildAuditEventRecord, writeAuditEventRecord };
