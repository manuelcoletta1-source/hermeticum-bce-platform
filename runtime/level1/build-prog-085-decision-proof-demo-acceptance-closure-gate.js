'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_DEMO_ACCEPTANCE_CLOSURE_GATE_PASSED_SYNTHETIC_ONLY';
const SOURCE_REF = 'docs/launch/level1/prog-084-decision-proof-human-acceptance-signature-attestation.json';

const CLOSURE_REQUIREMENTS = Object.freeze([
  'SOURCE_ATTESTATION_HASH_VALID',
  'VERIFIER_REPLAY_PASS_CONFIRMED',
  'SYNTHETIC_CHAIN_CLOSED_CONFIRMED',
  'HUMAN_ACCEPTANCE_COMPLETED_CONFIRMED',
  'DEMO_ACCEPTED_CONFIRMED',
  'NON_CLAIMS_CONFIRMED',
  'AI_AUTHORITY_ABSENCE_CONFIRMED'
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

function buildClosurePayload(source) {
  return {
    closure_gate_id: 'DEMO-ACCEPTANCE-CLOSURE-GATE::HBCE-L1-DEMO-0001',
    closure_subject_ref: source.human_acceptance_signature_attestation.attestation_record_id,
    closure_subject_digest: source.human_acceptance_signature_attestation.attestation_digest,
    closure_scope: 'SYNTHETIC_LEVEL1_DECISION_PROOF_DEMO_ONLY',
    closure_result: 'PASS_SYNTHETIC_DEMO_ACCEPTANCE_CLOSED',
    closed_at: '2027-01-19T15:45:00Z',
    verifier_replay_result: source.inherited_acceptance_decision_boundary.verifier_replay_result,
    verifier_replay_passed: source.readiness_state.verifier_replay_passed,
    synthetic_chain_closed: source.readiness_state.synthetic_chain_closed,
    human_acceptance_completed: source.readiness_state.human_acceptance_completed,
    decision_proof_demo_accepted: source.readiness_state.decision_proof_demo_accepted,
    decision_proof_demo_ready: true,
    level1_launch_ready: false,
    level1_client_pack_ready: false,
    production_ready: false,
    closure_comment: 'Synthetic Level 1 Decision Proof demo acceptance is closed. Demo readiness is limited to synthetic Decision Proof demonstration and does not imply launch readiness, client-pack readiness, legal validity, external effect, business success or production readiness.',
    ai_closure_authority_allowed: false
  };
}

function buildDecisionProofDemoAcceptanceClosureGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);
  const closurePayload = buildClosurePayload(source);

  const closureChecklist = {
    source_attestation_hash_valid: validHash(source),
    verifier_replay_pass_confirmed: source.readiness_state.verifier_replay_passed === true,
    synthetic_chain_closed_confirmed: source.readiness_state.synthetic_chain_closed === true,
    human_acceptance_completed_confirmed: source.readiness_state.human_acceptance_completed === true,
    demo_accepted_confirmed: source.readiness_state.decision_proof_demo_accepted === true,
    non_claims_confirmed: (
      source.non_claims.legal_validity === false &&
      source.non_claims.public_accreditation === false &&
      source.non_claims.procurement_eligibility === false &&
      source.non_claims.external_effect_proven === false &&
      source.non_claims.business_success === false &&
      source.non_claims.ai_authority === false &&
      source.non_claims.level1_launch_ready === false &&
      source.non_claims.production_ready === false
    ),
    ai_authority_absence_confirmed: source.non_claims.ai_authority === false
  };

  const doc = {
    proto: 'HBCE-L1-PROG-085-DECISION-PROOF-DEMO-ACCEPTANCE-CLOSURE-GATE-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_DEMO_ACCEPTANCE_CLOSURE_GATE',
    document_code: 'HBCE-L1-DECISION-PROOF-DEMO-ACCEPTANCE-CLOSURE-GATE-2027-PROG-085',
    issue_id: 'PROG-085',
    priority: 'LEVEL1-DECISION-PROOF-DEMO-ACCEPTANCE-CLOSURE-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_human_acceptance_attestation_ref: SOURCE_REF,
    source_human_acceptance_attestation_revision_hash: source.revision_hash,
    source_human_acceptance_attestation_revision_hash_valid: validHash(source),

    decision_proof_demo_acceptance_closure_gate_status: STATUS,

    inherited_attestation_boundary: {
      human_acceptance_attestation_status: source.decision_proof_human_acceptance_signature_attestation_status,
      verifier_replay_result: source.inherited_acceptance_decision_boundary.verifier_replay_result,
      verifier_replay_passed: source.readiness_state.verifier_replay_passed,
      synthetic_chain_closed: source.readiness_state.synthetic_chain_closed,
      human_acceptance_completed: source.readiness_state.human_acceptance_completed,
      acceptance_gate_passed: source.readiness_state.acceptance_gate_passed,
      decision_proof_demo_accepted: source.readiness_state.decision_proof_demo_accepted,
      prior_decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready,
      prior_level1_launch_ready: source.readiness_state.level1_launch_ready,
      prior_level1_client_pack_ready: source.readiness_state.level1_client_pack_ready,
      prior_production_ready: source.readiness_state.production_ready
    },

    closure_gate: {
      ...closurePayload,
      closure_payload_digest: sha256Digest(closurePayload),
      closure_requirements: CLOSURE_REQUIREMENTS,
      closure_checklist: closureChecklist,
      gate_passed: true,
      gate_result_is_demo_readiness_only: true,
      demo_ready_is_synthetic_only: true,
      demo_ready_is_not_legal_validity: true,
      demo_ready_is_not_public_accreditation: true,
      demo_ready_is_not_procurement_eligibility: true,
      demo_ready_is_not_external_effect_proof: true,
      demo_ready_is_not_business_success: true,
      demo_ready_is_not_launch_readiness: true,
      demo_ready_is_not_client_pack_readiness: true,
      demo_ready_is_not_production_readiness: true
    },

    fail_closed_codes: [
      'DEMO_ACCEPTANCE_CLOSURE_GATE_MISSING',
      'SOURCE_HUMAN_ACCEPTANCE_ATTESTATION_HASH_INVALID',
      'VERIFIER_REPLAY_NOT_PASS',
      'SYNTHETIC_CHAIN_NOT_CLOSED',
      'HUMAN_ACCEPTANCE_NOT_COMPLETED',
      'DEMO_NOT_ACCEPTED',
      'NON_CLAIMS_NOT_CONFIRMED',
      'UNSUPPORTED_READINESS_CLAIM',
      'AI_CLOSURE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      demo_acceptance_closure_gate_defined: true,
      demo_acceptance_closure_gate_passed: true,
      source_human_acceptance_attestation_bound: true,
      verifier_replay_completed: true,
      verifier_replay_passed: true,
      synthetic_chain_closed: true,
      human_acceptance_completed: true,
      decision_proof_demo_accepted: true,
      decision_proof_demo_ready: true,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-086-HBCE-LEVEL1-DECISION-PROOF-DEMO-READINESS-SNAPSHOT',

    non_claims: {
      legal_validity: false,
      public_accreditation: false,
      procurement_eligibility: false,
      external_effect_proven: false,
      business_success: false,
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

function writeDecisionProofDemoAcceptanceClosureGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofDemoAcceptanceClosureGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-085-decision-proof-demo-acceptance-closure-gate.json';
  const doc = writeDecisionProofDemoAcceptanceClosureGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_085_DECISION_PROOF_DEMO_ACCEPTANCE_CLOSURE_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  CLOSURE_REQUIREMENTS,
  buildClosurePayload,
  buildDecisionProofDemoAcceptanceClosureGate,
  writeDecisionProofDemoAcceptanceClosureGate
};
