'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_DEMO_PATH_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-067-level1-launch-pack-scope-lock.json';

const STAGES = Object.freeze([
  'HUMAN_OR_ORGANIZATIONAL_AUTHORITY_INPUT',
  'POLICY_EVALUATION_RECORD',
  'ACTION_REQUEST_BINDING',
  'ACTION_RECEIPT_RECORD',
  'AUDIT_EVENT_RECORD',
  'EVIDENCE_EXPORT_PACKAGE',
  'VERIFIER_REPLAY_CHECK'
]);

const REQUIRED = Object.freeze([
  'authority_boundary_statement',
  'policy_evaluation_record',
  'action_request_record',
  'action_receipt_record',
  'audit_event_record',
  'evidence_export_manifest',
  'verifier_replay_result',
  'non_claims_statement'
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

function buildDecisionProofDemoPath(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-068-DECISION-PROOF-DEMO-PATH-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_DEMO_PATH',
    document_code: 'HBCE-L1-DECISION-PROOF-DEMO-PATH-2027-PROG-068',
    issue_id: 'PROG-068',
    priority: 'LEVEL1-DECISION-PROOF-DEMO-PATH',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_scope_lock_ref: SOURCE_REF,
    source_scope_lock_revision_hash: source.revision_hash,
    source_scope_lock_revision_hash_valid: validHash(source),

    demo_path_status: STATUS,

    inherited_scope_lock: {
      scope_lock_status: source.scope_lock_status,
      primary_launch_object: source.launch_pack_scope_statement.primary_launch_object,
      hbce_level1_is_not_an_ai_system: source.product_identity_lock.hbce_level1_is_not_an_ai_system,
      ai_models_do_not_create_authority: source.product_identity_lock.ai_models_do_not_create_authority,
      level1_launch_ready: source.readiness_state.level1_launch_ready
    },

    decision_proof_demo_path: {
      purpose: 'Demonstrate how a governed digital action is authorized, evaluated, requested, receipted, audited, exported and replay-checked.',
      demo_stages: STAGES,
      required_artifacts: REQUIRED,
      authority_model: {
        human_or_organizational_authority_required: true,
        ai_model_authority_allowed: false,
        ai_model_may_explain_or_assist: true,
        ai_model_may_not_approve_or_execute_authority: true
      },
      evidence_model: {
        policy_evaluation_required: true,
        action_request_required: true,
        action_receipt_required: true,
        audit_event_required: true,
        export_manifest_required: true,
        verifier_replay_required: true
      },
      fail_closed_rules: [
        'MISSING_AUTHORITY_BOUNDARY_BLOCKS_DEMO',
        'MISSING_POLICY_EVALUATION_BLOCKS_DEMO',
        'MISSING_ACTION_REQUEST_BLOCKS_DEMO',
        'MISSING_ACTION_RECEIPT_BLOCKS_DEMO',
        'MISSING_AUDIT_EVENT_BLOCKS_DEMO',
        'MISSING_EXPORT_MANIFEST_BLOCKS_DEMO',
        'FAILED_VERIFIER_REPLAY_BLOCKS_DEMO',
        'AI_AUTHORITY_CLAIM_BLOCKS_DEMO'
      ]
    },

    minimal_demo_sequence: [
      { order: 1, stage: 'HUMAN_OR_ORGANIZATIONAL_AUTHORITY_INPUT', output: 'authority_boundary_statement' },
      { order: 2, stage: 'POLICY_EVALUATION_RECORD', output: 'policy_evaluation_record' },
      { order: 3, stage: 'ACTION_REQUEST_BINDING', output: 'action_request_record' },
      { order: 4, stage: 'ACTION_RECEIPT_RECORD', output: 'action_receipt_record' },
      { order: 5, stage: 'AUDIT_EVENT_RECORD', output: 'audit_event_record' },
      { order: 6, stage: 'EVIDENCE_EXPORT_PACKAGE', output: 'evidence_export_manifest' },
      { order: 7, stage: 'VERIFIER_REPLAY_CHECK', output: 'verifier_replay_result' }
    ],

    readiness_state: {
      decision_proof_demo_path_defined: true,
      decision_proof_demo_path_ready: false,
      required_artifacts_complete: false,
      verifier_replay_ready: false,
      client_demo_ready: false,
      level1_launch_ready: false,
      level1_release_candidate_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST',

    non_claims: {
      demo_ready: false,
      level1_launch_ready: false,
      level1_release_candidate_ready: false,
      level1_client_pack_ready: false,
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      production_ready: false,
      ai_authority: false,
      autonomous_authority: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeDecisionProofDemoPath(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofDemoPath({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-068-decision-proof-demo-path.json';
  const doc = writeDecisionProofDemoPath(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_068_DECISION_PROOF_DEMO_PATH_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, STAGES, REQUIRED, buildDecisionProofDemoPath, writeDecisionProofDemoPath };
