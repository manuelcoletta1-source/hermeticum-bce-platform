'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_DECISION_RECORDED_PENDING_SIGNATURE';
const SOURCE_REF = 'docs/launch/level1/prog-082-decision-proof-human-acceptance-record.json';

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

function buildDecisionPayload(source) {
  return {
    decision_record_id: 'HUMAN-ACCEPTANCE-DECISION::HBCE-L1-DEMO-0001',
    decision_subject_ref: source.human_acceptance_record.acceptance_subject_ref,
    decision_subject_digest: source.human_acceptance_record.acceptance_subject_digest,
    decision_maker_ref: source.human_acceptance_record.required_human_acceptor_ref,
    decision_maker_role: source.human_acceptance_record.required_human_acceptor_role,
    decision: 'ACCEPTED_SYNTHETIC_DEMO_ONLY',
    decision_recorded: true,
    decision_recorded_at: '2027-01-19T15:35:00Z',
    decision_scope: 'SYNTHETIC_DEMO_ONLY',
    decision_comment_required: true,
    decision_comment_present: true,
    decision_comment: 'Accepted only as a synthetic Level 1 Decision Proof demo result. This does not prove legal validity, external effect, business success, launch readiness or production readiness.',
    signature_required: true,
    signature_status: 'PENDING_SIGNATURE',
    acceptance_record_signed: false,
    cryptographic_signature_present: false,
    manual_attestation_present: false,
    ai_acceptance_authority_allowed: false
  };
}

function buildDecisionProofHumanAcceptanceDecision(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const decisionPayload = buildDecisionPayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-083-DECISION-PROOF-HUMAN-ACCEPTANCE-DECISION-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_DECISION',
    document_code: 'HBCE-L1-DECISION-PROOF-HUMAN-ACCEPTANCE-DECISION-2027-PROG-083',
    issue_id: 'PROG-083',
    priority: 'LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-DECISION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_human_acceptance_record_ref: SOURCE_REF,
    source_human_acceptance_record_revision_hash: source.revision_hash,
    source_human_acceptance_record_revision_hash_valid: validHash(source),

    decision_proof_human_acceptance_decision_status: STATUS,

    inherited_acceptance_record_boundary: {
      human_acceptance_record_status: source.decision_proof_human_acceptance_record_status,
      source_execution_result_bound: source.readiness_state.source_execution_result_bound,
      synthetic_demo_only: source.readiness_state.synthetic_demo_only,
      verifier_replay_completed: source.readiness_state.verifier_replay_completed,
      verifier_replay_result: source.inherited_execution_result_boundary.verifier_replay_result,
      verifier_replay_passed: source.readiness_state.verifier_replay_passed,
      synthetic_chain_closed: source.readiness_state.synthetic_chain_closed,
      acceptance_status: source.human_acceptance_record.acceptance_status,
      prior_acceptance_decision_recorded: source.human_acceptance_record.acceptance_decision_recorded,
      prior_acceptance_record_signed: source.human_acceptance_record.acceptance_record_signed,
      prior_acceptance_comment_present: source.human_acceptance_record.acceptance_comment !== null,
      prior_acceptance_gate_result: source.acceptance_gate.gate_result,
      prior_decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    human_acceptance_decision: {
      ...decisionPayload,
      decision_digest: sha256Digest(decisionPayload),
      decision_is_not_signature: true,
      decision_is_not_legal_validity: true,
      decision_is_not_launch_readiness: true,
      decision_is_not_production_readiness: true
    },

    acceptance_gate_after_decision: {
      gate_result: 'BLOCKED_PENDING_ACCEPTANCE_SIGNATURE',
      gate_passed: false,
      decision_requirement_satisfied: true,
      comment_requirement_satisfied: true,
      signature_requirement_satisfied: false,
      cryptographic_signature_requirement_satisfied: false,
      manual_attestation_requirement_satisfied: false,
      blocked_by: [
        'HUMAN_ACCEPTANCE_RECORD_NOT_SIGNED',
        'HUMAN_ACCEPTANCE_SIGNATURE_OR_ATTESTATION_NOT_RECORDED'
      ],
      pass_requires: [
        'acceptance_decision_recorded',
        'acceptance_comment_present',
        'acceptance_record_signed',
        'signature_or_manual_attestation_recorded',
        'source_human_acceptance_record_hash_valid',
        'ai_authority_absence_confirmed'
      ],
      fail_closed_on: [
        'source_human_acceptance_record_hash_invalid',
        'signature_missing',
        'attestation_missing',
        'unsupported_readiness_claim',
        'ai_acceptance_authority_claim'
      ]
    },

    fail_closed_codes: [
      'HUMAN_ACCEPTANCE_DECISION_MISSING',
      'SOURCE_HUMAN_ACCEPTANCE_RECORD_HASH_INVALID',
      'ACCEPTANCE_DECISION_NOT_RECORDED',
      'ACCEPTANCE_COMMENT_MISSING',
      'HUMAN_ACCEPTANCE_RECORD_NOT_SIGNED',
      'HUMAN_ACCEPTANCE_SIGNATURE_OR_ATTESTATION_NOT_RECORDED',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_ACCEPTANCE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      human_acceptance_decision_record_defined: true,
      human_acceptance_decision_recorded: true,
      human_acceptance_comment_present: true,
      human_acceptance_record_signed: false,
      human_acceptance_signature_or_attestation_recorded: false,
      human_acceptance_completed: false,
      source_human_acceptance_record_bound: true,
      synthetic_demo_only: true,
      verifier_replay_completed: true,
      verifier_replay_passed: true,
      synthetic_chain_closed: true,
      acceptance_gate_passed: false,
      decision_proof_demo_accepted_by_decision: true,
      decision_proof_demo_accepted: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-084-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION',

    non_claims: {
      human_acceptance_completed: false,
      acceptance_record_signed: false,
      signature_or_attestation_recorded: false,
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

function writeDecisionProofHumanAcceptanceDecision(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofHumanAcceptanceDecision({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-083-decision-proof-human-acceptance-decision.json';
  const doc = writeDecisionProofHumanAcceptanceDecision(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_083_DECISION_PROOF_HUMAN_ACCEPTANCE_DECISION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildDecisionPayload,
  buildDecisionProofHumanAcceptanceDecision,
  writeDecisionProofHumanAcceptanceDecision
};
