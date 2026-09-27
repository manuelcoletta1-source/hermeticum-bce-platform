'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_POLICY_EVALUATION_RECORD_DEFINED_NOT_READY';
const SOURCE_REF = 'docs/launch/level1/prog-070-authority-boundary-statement.json';

const REQUIRED_FIELDS = Object.freeze([
  'policy_evaluation_id',
  'authority_boundary_ref',
  'policy_ref',
  'policy_version',
  'policy_digest',
  'input_ref',
  'input_digest',
  'action_class',
  'target_ref',
  'evaluation_result',
  'evaluation_codes',
  'evaluated_at',
  'evaluator_ref',
  'evidence_chain_ref',
  'non_claims'
]);

const EVALUATION_RESULTS = Object.freeze([
  'ALLOW',
  'BLOCK',
  'UNKNOWN'
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

function buildPolicyEvaluationRecord(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-071-POLICY-EVALUATION-RECORD-v1',
    kind: 'HBCE_LEVEL1_POLICY_EVALUATION_RECORD',
    document_code: 'HBCE-L1-POLICY-EVALUATION-RECORD-2027-PROG-071',
    issue_id: 'PROG-071',
    priority: 'LEVEL1-POLICY-EVALUATION-RECORD',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_authority_boundary_ref: SOURCE_REF,
    source_authority_boundary_revision_hash: source.revision_hash,
    source_authority_boundary_revision_hash_valid: validHash(source),

    policy_evaluation_record_status: STATUS,

    inherited_authority_boundary: {
      authority_boundary_status: source.authority_boundary_status,
      authority_boundary_statement_ready: source.readiness_state.authority_boundary_statement_ready,
      concrete_authority_bound: source.readiness_state.concrete_authority_bound,
      human_or_organizational_authority_required: source.authority_boundary_statement.human_or_organizational_authority_required,
      ai_model_authority_allowed: source.authority_boundary_statement.ai_model_authority_allowed,
      model_output_is_not_authority: source.authority_boundary_statement.model_output_is_not_authority
    },

    policy_evaluation_record: {
      purpose: 'Define the Level 1 policy evaluation record required before an action request can enter the Decision Proof evidence chain.',
      required_fields: REQUIRED_FIELDS,
      evaluation_results_allowed: EVALUATION_RESULTS,
      authority_boundary_ref_required: true,
      policy_ref_required: true,
      policy_digest_required: true,
      input_digest_required: true,
      action_class_required: true,
      target_ref_required: true,
      evaluator_ref_required: true,
      evidence_chain_ref_required: true,
      ai_model_evaluation_authority_allowed: false,
      model_output_may_support_explanation_only: true,
      block_dominates_unknown_and_allow: true,
      unknown_dominates_allow: true,
      allow_requires_positive_policy_match: true,
      missing_policy_fails_closed: true,
      missing_authority_boundary_fails_closed: true,
      missing_digest_fails_closed: true
    },

    minimal_record_template: {
      policy_evaluation_id: 'POLICY-EVAL-TEMPLATE-0001',
      authority_boundary_ref: 'PROG-070-HBCE-LEVEL1-AUTHORITY-BOUNDARY-STATEMENT',
      policy_ref: 'POLICY::TO_BE_BOUND',
      policy_version: 'TO_BE_BOUND',
      policy_digest: 'sha256:TO_BE_BOUND',
      input_ref: 'INPUT::TO_BE_BOUND',
      input_digest: 'sha256:TO_BE_BOUND',
      action_class: 'ACTION_CLASS::TO_BE_BOUND',
      target_ref: 'TARGET::TO_BE_BOUND',
      evaluation_result: 'UNKNOWN',
      evaluation_codes: ['POLICY_EVALUATION_NOT_EXECUTED'],
      evaluated_at: 'TO_BE_BOUND',
      evaluator_ref: 'EVALUATOR::TO_BE_BOUND',
      evidence_chain_ref: 'PROG-069-HBCE-LEVEL1-EVIDENCE-CHAIN-MANIFEST',
      non_claims: {
        legal_validity: false,
        ai_authority: false,
        autonomous_authority: false,
        production_ready: false
      }
    },

    fail_closed_codes: [
      'POLICY_EVALUATION_RECORD_MISSING',
      'AUTHORITY_BOUNDARY_REF_MISSING',
      'POLICY_REF_MISSING',
      'POLICY_DIGEST_MISSING',
      'INPUT_DIGEST_MISSING',
      'ACTION_CLASS_MISSING',
      'TARGET_REF_MISSING',
      'EVALUATOR_REF_MISSING',
      'EVALUATION_RESULT_INVALID',
      'AI_POLICY_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      policy_evaluation_record_defined: true,
      policy_evaluation_record_ready: false,
      concrete_policy_bound: false,
      authority_boundary_ref_bound: false,
      policy_digest_bound: false,
      input_digest_bound: false,
      evaluator_ref_bound: false,
      positive_allow_ready: false,
      evidence_chain_node_complete: false,
      action_request_ready: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-072-HBCE-LEVEL1-ACTION-REQUEST-RECORD',

    non_claims: {
      concrete_policy_bound: false,
      positive_policy_evaluation_completed: false,
      action_authorized: false,
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

function writePolicyEvaluationRecord(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildPolicyEvaluationRecord({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-071-policy-evaluation-record.json';
  const doc = writePolicyEvaluationRecord(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_071_POLICY_EVALUATION_RECORD_WRITTEN=${doc.revision_hash}`);
}

module.exports = { STATUS, SOURCE_REF, REQUIRED_FIELDS, EVALUATION_RESULTS, buildPolicyEvaluationRecord, writePolicyEvaluationRecord };
