'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_EVIDENCE_EXPORT_MANIFEST_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-074-audit-event-record.json';

const EXPORT_FORMATS = Object.freeze([
  'HBCE_DECISION_PROOF_EXPORT_JSON',
  'HBCE_AUDIT_TRACE_EXPORT_JSON',
  'HBCE_VERIFIER_REPLAY_INPUT_JSON'
]);

const REQUIRED_FIELDS = Object.freeze([
  'evidence_export_id',
  'export_format',
  'export_scope',
  'canonicalization_profile',
  'digest_algorithm',
  'authority_boundary_ref',
  'authority_boundary_digest',
  'policy_evaluation_ref',
  'policy_evaluation_digest',
  'action_request_ref',
  'action_request_digest',
  'action_receipt_ref',
  'action_receipt_digest',
  'audit_event_ref',
  'audit_event_digest',
  'export_manifest_digest',
  'generated_at',
  'exporter_ref',
  'verifier_replay_input_ref',
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

function buildEvidenceExportManifest(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-075-EVIDENCE-EXPORT-MANIFEST-v1',
    kind: 'HBCE_LEVEL1_EVIDENCE_EXPORT_MANIFEST',
    document_code: 'HBCE-L1-EVIDENCE-EXPORT-MANIFEST-2027-PROG-075',
    issue_id: 'PROG-075',
    priority: 'LEVEL1-EVIDENCE-EXPORT-MANIFEST',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_audit_event_record_ref: SOURCE_REF,
    source_audit_event_record_revision_hash: source.revision_hash,
    source_audit_event_record_revision_hash_valid: validHash(source),

    evidence_export_manifest_status: STATUS,

    inherited_audit_boundary: {
      audit_event_record_status: source.audit_event_record_status,
      audit_event_record_ready: source.readiness_state.audit_event_record_ready,
      audit_event_is_not_effect_proof: source.audit_event_record.audit_event_is_not_effect_proof,
      audit_event_is_not_business_success: source.audit_event_record.audit_event_is_not_business_success,
      audit_event_is_not_legal_validity: source.audit_event_record.audit_event_is_not_legal_validity,
      ai_model_audit_authority_allowed: source.audit_event_record.ai_model_audit_authority_allowed
    },

    evidence_export_manifest: {
      purpose: 'Define the Level 1 evidence export manifest required after audit event recording and before verifier replay.',
      required_fields: REQUIRED_FIELDS,
      export_formats_allowed: EXPORT_FORMATS,
      canonical_json_required: true,
      sha256_digest_required: true,
      authority_boundary_digest_required: true,
      policy_evaluation_digest_required: true,
      action_request_digest_required: true,
      action_receipt_digest_required: true,
      audit_event_digest_required: true,
      export_manifest_digest_required: true,
      verifier_replay_input_ref_required: true,
      evidence_chain_ref_required: true,
      export_manifest_is_not_verifier_replay_result: true,
      export_manifest_is_not_effect_proof: true,
      export_manifest_is_not_business_success: true,
      export_manifest_is_not_legal_validity: true,
      export_manifest_is_not_production_readiness: true,
      ai_model_export_authority_allowed: false,
      missing_chain_node_digest_fails_closed: true,
      missing_export_manifest_digest_fails_closed: true,
      missing_verifier_replay_input_fails_closed: true,
      unsupported_export_format_fails_closed: true,
      broken_export_manifest_fails_closed: true
    },

    minimal_record_template: {
      evidence_export_id: 'EVIDENCE-EXPORT-TEMPLATE-0001',
      export_format: 'HBCE_DECISION_PROOF_EXPORT_JSON',
      export_scope: 'LEVEL1_DECISION_PROOF_DEMO_CHAIN',
      canonicalization_profile: 'RFC8785-JCS',
      digest_algorithm: 'SHA-256',
      authority_boundary_ref: 'PROG-070-HBCE-LEVEL1-AUTHORITY-BOUNDARY-STATEMENT',
      authority_boundary_digest: 'sha256:TO_BE_BOUND',
      policy_evaluation_ref: 'PROG-071-HBCE-LEVEL1-POLICY-EVALUATION-RECORD',
      policy_evaluation_digest: 'sha256:TO_BE_BOUND',
      action_request_ref: 'PROG-072-HBCE-LEVEL1-ACTION-REQUEST-RECORD',
      action_request_digest: 'sha256:TO_BE_BOUND',
      action_receipt_ref: 'PROG-073-HBCE-LEVEL1-ACTION-RECEIPT-RECORD',
      action_receipt_digest: 'sha256:TO_BE_BOUND',
      audit_event_ref: 'PROG-074-HBCE-LEVEL1-AUDIT-EVENT-RECORD',
      audit_event_digest: 'sha256:TO_BE_BOUND',
      export_manifest_digest: 'sha256:TO_BE_BOUND',
      generated_at: 'TO_BE_BOUND',
      exporter_ref: 'EXPORTER::TO_BE_BOUND',
      verifier_replay_input_ref: 'VERIFIER-REPLAY-INPUT::TO_BE_BOUND',
      evidence_chain_ref: 'PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST',
      non_claims: {
        verifier_replay_completed: false,
        effect_proven: false,
        business_success: false,
        legal_validity: false,
        ai_authority: false,
        autonomous_authority: false,
        production_ready: false
      }
    },

    fail_closed_codes: [
      'EVIDENCE_EXPORT_MANIFEST_MISSING',
      'EXPORT_FORMAT_INVALID',
      'CANONICALIZATION_PROFILE_MISSING',
      'DIGEST_ALGORITHM_MISSING',
      'AUTHORITY_BOUNDARY_DIGEST_MISSING',
      'POLICY_EVALUATION_DIGEST_MISSING',
      'ACTION_REQUEST_DIGEST_MISSING',
      'ACTION_RECEIPT_DIGEST_MISSING',
      'AUDIT_EVENT_DIGEST_MISSING',
      'EXPORT_MANIFEST_DIGEST_MISSING',
      'VERIFIER_REPLAY_INPUT_REF_MISSING',
      'BROKEN_EXPORT_MANIFEST',
      'AI_EXPORT_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      evidence_export_manifest_defined: true,
      evidence_export_manifest_ready: false,
      concrete_export_bound: false,
      authority_boundary_digest_bound: false,
      policy_evaluation_digest_bound: false,
      action_request_digest_bound: false,
      action_receipt_digest_bound: false,
      audit_event_digest_bound: false,
      export_manifest_digest_bound: false,
      verifier_replay_input_ready: false,
      evidence_chain_node_complete: false,
      verifier_replay_ready: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-076-HBCE-LEVEL1-VERIFIER-REPLAY-RESULT',

    non_claims: {
      concrete_export_bound: false,
      verifier_replay_completed: false,
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

function writeEvidenceExportManifest(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildEvidenceExportManifest({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-075-evidence-export-manifest.json';
  const doc = writeEvidenceExportManifest(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_075_EVIDENCE_EXPORT_MANIFEST_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, REQUIRED_FIELDS, EXPORT_FORMATS, buildEvidenceExportManifest, writeEvidenceExportManifest };
