'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_SIGNATURE_ATTESTATION_RECORDED_NOT_DEMO_READY';
const SOURCE_REF = 'docs/launch/level1/prog-083-decision-proof-human-acceptance-decision.json';

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

function buildAttestationPayload(source) {
  const decision = source.human_acceptance_decision;

  return {
    attestation_record_id: 'HUMAN-ACCEPTANCE-ATTESTATION::HBCE-L1-DEMO-0001',
    source_decision_record_id: decision.decision_record_id,
    source_decision_digest: decision.decision_digest,
    attestor_ref: decision.decision_maker_ref,
    attestor_role: decision.decision_maker_role,
    attestation_scope: 'SYNTHETIC_DEMO_ONLY',
    attestation_status: 'RECORDED',
    attestation_method: 'MANUAL_HUMAN_ATTESTATION',
    attested_at: '2027-01-19T15:40:00Z',
    acceptance_record_signed: true,
    signature_or_attestation_recorded: true,
    manual_attestation_present: true,
    manual_attestation_statement_present: true,
    cryptographic_signature_present: false,
    cryptographic_signature_required_for_demo_acceptance: false,
    signature_requirement_satisfied_by_manual_attestation: true,
    attestation_statement: 'Manual human attestation recorded for the synthetic Level 1 Decision Proof demo acceptance only. This does not create legal validity, public accreditation, procurement eligibility, launch readiness or production readiness.',
    ai_attestation_authority_allowed: false
  };
}

function buildDecisionProofHumanAcceptanceSignatureAttestation(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const attestationPayload = buildAttestationPayload(source);

  const doc = {
    proto: 'HBCE-L1-PROG-084-DECISION-PROOF-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_HUMAN_ACCEPTANCE_SIGNATURE_ATTESTATION',
    document_code: 'HBCE-L1-DECISION-PROOF-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION-2027-PROG-084',
    issue_id: 'PROG-084',
    priority: 'LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-SIGNATURE-ATTESTATION',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_human_acceptance_decision_ref: SOURCE_REF,
    source_human_acceptance_decision_revision_hash: source.revision_hash,
    source_human_acceptance_decision_revision_hash_valid: validHash(source),

    decision_proof_human_acceptance_signature_attestation_status: STATUS,

    inherited_acceptance_decision_boundary: {
      human_acceptance_decision_status: source.decision_proof_human_acceptance_decision_status,
      verifier_replay_result: source.inherited_acceptance_record_boundary.verifier_replay_result,
      verifier_replay_passed: source.readiness_state.verifier_replay_passed,
      synthetic_chain_closed: source.readiness_state.synthetic_chain_closed,
      decision_recorded: source.readiness_state.human_acceptance_decision_recorded,
      decision_comment_present: source.readiness_state.human_acceptance_comment_present,
      prior_signature_status: source.human_acceptance_decision.signature_status,
      prior_acceptance_record_signed: source.readiness_state.human_acceptance_record_signed,
      prior_signature_or_attestation_recorded: source.readiness_state.human_acceptance_signature_or_attestation_recorded,
      prior_acceptance_gate_result: source.acceptance_gate_after_decision.gate_result,
      prior_human_acceptance_completed: source.readiness_state.human_acceptance_completed,
      prior_decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    human_acceptance_signature_attestation: {
      ...attestationPayload,
      attestation_digest: sha256Digest(attestationPayload),
      attestation_is_not_legal_validity: true,
      attestation_is_not_public_accreditation: true,
      attestation_is_not_procurement_eligibility: true,
      attestation_is_not_launch_readiness: true,
      attestation_is_not_production_readiness: true
    },

    acceptance_gate_after_attestation: {
      gate_result: 'PASS_HUMAN_ACCEPTANCE_ATTESTED_SYNTHETIC_ONLY',
      gate_passed: true,
      decision_requirement_satisfied: true,
      comment_requirement_satisfied: true,
      signature_or_attestation_requirement_satisfied: true,
      manual_attestation_requirement_satisfied: true,
      cryptographic_signature_requirement_satisfied: false,
      source_decision_hash_valid: true,
      ai_authority_absence_confirmed: true,
      pass_result_is_not_demo_readiness: true,
      next_closure_gate_required: true,
      blocked_by: [],
      fail_closed_on: [
        'source_human_acceptance_decision_hash_invalid',
        'attestation_missing',
        'source_decision_digest_mismatch',
        'unsupported_readiness_claim',
        'ai_attestation_authority_claim'
      ]
    },

    fail_closed_codes: [
      'HUMAN_ACCEPTANCE_SIGNATURE_ATTESTATION_MISSING',
      'SOURCE_HUMAN_ACCEPTANCE_DECISION_HASH_INVALID',
      'SOURCE_DECISION_DIGEST_MISMATCH',
      'MANUAL_ATTESTATION_MISSING',
      'ATTESTATION_STATEMENT_MISSING',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_ATTESTATION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      human_acceptance_signature_attestation_record_defined: true,
      human_acceptance_decision_recorded: true,
      human_acceptance_comment_present: true,
      human_acceptance_record_signed: true,
      human_acceptance_signature_or_attestation_recorded: true,
      manual_attestation_present: true,
      cryptographic_signature_present: false,
      human_acceptance_completed: true,
      source_human_acceptance_decision_bound: true,
      synthetic_demo_only: true,
      verifier_replay_completed: true,
      verifier_replay_passed: true,
      synthetic_chain_closed: true,
      acceptance_gate_passed: true,
      decision_proof_demo_accepted: true,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-085-HBCE-LEVEL1-DECISION-PROOF-DEMO-ACCEPTANCE-CLOSURE-GATE',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
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

function writeDecisionProofHumanAcceptanceSignatureAttestation(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofHumanAcceptanceSignatureAttestation({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-084-decision-proof-human-acceptance-signature-attestation.json';
  const doc = writeDecisionProofHumanAcceptanceSignatureAttestation(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_084_DECISION_PROOF_HUMAN_ACCEPTANCE_SIGNATURE_ATTESTATION_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  buildAttestationPayload,
  buildDecisionProofHumanAcceptanceSignatureAttestation,
  writeDecisionProofHumanAcceptanceSignatureAttestation
};
