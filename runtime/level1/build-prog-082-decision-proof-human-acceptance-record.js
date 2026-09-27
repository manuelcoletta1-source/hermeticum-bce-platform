'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_RECORD_DEFINED_PENDING';
const SOURCE_REF = 'docs/launch/level1/prog-081-decision-proof-demo-execution-result.json';

const ACCEPTANCE_REQUIRED_REVIEW_ITEMS = Object.freeze([
  'SOURCE_EXECUTION_RESULT_HASH_VALID',
  'SYNTHETIC_DEMO_ONLY_BOUNDARY_CONFIRMED',
  'GENERATED_RECORD_DIGESTS_PRESENT',
  'VERIFIER_REPLAY_PASS_CONFIRMED',
  'ZERO_MISMATCH_CONFIRMED',
  'SYNTHETIC_CHAIN_CLOSURE_CONFIRMED',
  'NON_CLAIMS_CONFIRMED',
  'AI_AUTHORITY_ABSENCE_CONFIRMED',
  'HUMAN_ACCEPTANCE_DECISION_RECORDED'
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

function buildDecisionProofHumanAcceptanceRecord(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const acceptanceChecklist = {
    source_execution_result_hash_valid: validHash(source),
    synthetic_demo_only_boundary_confirmed: source.execution_result_summary.synthetic_demo_only === true,
    generated_record_digests_present: source.execution_integrity.all_generated_records_have_digest === true,
    verifier_replay_pass_confirmed: source.execution_result_summary.verifier_replay_passed === true,
    zero_mismatch_confirmed: source.execution_integrity.verifier_replay_mismatch_count === 0,
    synthetic_chain_closure_confirmed: source.execution_result_summary.synthetic_chain_closed === true,
    non_claims_confirmed: (
      source.non_claims.effect_proven === false &&
      source.non_claims.business_success === false &&
      source.non_claims.legal_validity === false &&
      source.non_claims.ai_authority === false &&
      source.non_claims.level1_launch_ready === false &&
      source.non_claims.production_ready === false
    ),
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false,
    human_acceptance_decision_recorded: false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-082-DECISION-PROOF-HUMAN-ACCEPTANCE-RECORD-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_RECORD',
    document_code: 'HBCE-L1-DECISION-PROOF-HUMAN-ACCEPTANCE-RECORD-2027-PROG-082',
    issue_id: 'PROG-082',
    priority: 'LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-RECORD',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_execution_result_ref: SOURCE_REF,
    source_execution_result_revision_hash: source.revision_hash,
    source_execution_result_revision_hash_valid: validHash(source),

    decision_proof_human_acceptance_record_status: STATUS,

    inherited_execution_result_boundary: {
      execution_result_status: source.decision_proof_demo_execution_result_status,
      synthetic_demo_only: source.execution_result_summary.synthetic_demo_only,
      harness_executed: source.execution_result_summary.harness_executed,
      concrete_demo_execution_completed: source.execution_result_summary.concrete_demo_execution_completed,
      verifier_replay_completed: source.execution_result_summary.verifier_replay_completed,
      verifier_replay_result: source.execution_result_summary.verifier_replay_result,
      verifier_replay_passed: source.execution_result_summary.verifier_replay_passed,
      synthetic_chain_closed: source.execution_result_summary.synthetic_chain_closed,
      manual_human_acceptance_required: source.execution_result_summary.manual_human_acceptance_required,
      manual_human_acceptance_status: source.execution_result_summary.manual_human_acceptance_status,
      decision_proof_demo_ready: source.execution_result_summary.decision_proof_demo_ready,
      level1_launch_ready: source.execution_result_summary.level1_launch_ready,
      production_ready: source.execution_result_summary.production_ready
    },

    human_acceptance_record: {
      purpose: 'Define the human acceptance record required before the synthetic Decision Proof demo may be marked accepted.',
      acceptance_record_id: 'HUMAN-ACCEPTANCE::HBCE-L1-DEMO-0001',
      acceptance_subject_ref: source.execution_records.closure_gate_result.record_id,
      acceptance_subject_digest: source.execution_records.closure_gate_result.digest,
      required_human_acceptor_ref: 'IPR-3::MANUEL-COLETTA',
      required_human_acceptor_role: 'FOUNDER_AND_HUMAN_AUTHORITY',
      acceptance_status: 'PENDING',
      acceptance_decision: null,
      acceptance_decision_allowed_values: ['ACCEPTED_SYNTHETIC_DEMO_ONLY', 'REJECTED', 'REQUEST_CHANGES'],
      acceptance_decision_recorded: false,
      acceptance_record_signed: false,
      acceptance_signed_at: null,
      acceptance_evidence_ref: null,
      acceptance_comment_required: true,
      acceptance_comment: null,
      manual_human_acceptance_required: true,
      ai_acceptance_authority_allowed: false,
      acceptance_record_is_not_acceptance_decision: true,
      acceptance_record_is_not_legal_validity: true,
      acceptance_record_is_not_launch_readiness: true,
      acceptance_record_is_not_production_readiness: true
    },

    acceptance_required_review_items: ACCEPTANCE_REQUIRED_REVIEW_ITEMS,

    acceptance_checklist: acceptanceChecklist,

    acceptance_gate: {
      gate_result: 'BLOCKED_PENDING_HUMAN_ACCEPTANCE_DECISION',
      pass_requires: [
        'acceptance_decision_recorded',
        'acceptance_record_signed',
        'acceptance_comment_present',
        'source_execution_result_hash_valid',
        'verifier_replay_pass_confirmed',
        'zero_mismatch_confirmed',
        'non_claims_confirmed',
        'ai_authority_absence_confirmed'
      ],
      blocked_by: [
        'HUMAN_ACCEPTANCE_DECISION_NOT_RECORDED',
        'HUMAN_ACCEPTANCE_RECORD_NOT_SIGNED',
        'HUMAN_ACCEPTANCE_COMMENT_MISSING'
      ],
      fail_closed_on: [
        'source_execution_result_hash_invalid',
        'verifier_replay_not_pass',
        'mismatch_detected',
        'unsupported_readiness_claim',
        'ai_acceptance_authority_claim'
      ]
    },

    fail_closed_codes: [
      'HUMAN_ACCEPTANCE_RECORD_MISSING',
      'SOURCE_EXECUTION_RESULT_HASH_INVALID',
      'HUMAN_ACCEPTANCE_DECISION_NOT_RECORDED',
      'HUMAN_ACCEPTANCE_RECORD_NOT_SIGNED',
      'HUMAN_ACCEPTANCE_COMMENT_MISSING',
      'VERIFIER_REPLAY_NOT_PASS',
      'MISMATCH_DETECTED',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_ACCEPTANCE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      human_acceptance_record_defined: true,
      human_acceptance_decision_recorded: false,
      human_acceptance_record_signed: false,
      human_acceptance_completed: false,
      source_execution_result_bound: true,
      synthetic_demo_only: true,
      verifier_replay_completed: true,
      verifier_replay_passed: true,
      synthetic_chain_closed: true,
      acceptance_gate_passed: false,
      decision_proof_demo_accepted: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-083-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-DECISION',

    non_claims: {
      human_accepted: false,
      acceptance_decision_recorded: false,
      decision_proof_demo_accepted: false,
      decision_proof_demo_ready: false,
      effect_proven: false,
      external_side_effect: false,
      business_success: false,
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      ai_authority: false,
      autonomous_authority: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    }
  };

  doc.revision_hash = sha256Digest(doc);
  return doc;
}

function writeDecisionProofHumanAcceptanceRecord(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofHumanAcceptanceRecord({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-082-decision-proof-human-acceptance-record.json';
  const doc = writeDecisionProofHumanAcceptanceRecord(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_082_DECISION_PROOF_HUMAN_ACCEPTANCE_RECORD_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  ACCEPTANCE_REQUIRED_REVIEW_ITEMS,
  buildDecisionProofHumanAcceptanceRecord,
  writeDecisionProofHumanAcceptanceRecord
};
