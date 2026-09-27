'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_CHAIN_CLOSURE_GATE_BLOCKED';
const SOURCE_REF = 'docs/launch/level1/prog-076-verifier-replay-result.json';

const REQUIRED_CHAIN_NODES = Object.freeze([
  'PROG-070-HBCE-LEVEL1-AUTHORITY-BOUNDARY-STATEMENT',
  'PROG-071-HBCE-LEVEL1-POLICY-EVALUATION-RECORD',
  'PROG-072-HBCE-LEVEL1-ACTION-REQUEST-RECORD',
  'PROG-073-HBCE-LEVEL1-ACTION-RECEIPT-RECORD',
  'PROG-074-HBCE-LEVEL1-AUDIT-EVENT-RECORD',
  'PROG-075-HBCE-LEVEL1-EVIDENCE-EXPORT-MANIFEST',
  'PROG-076-HBCE-LEVEL1-VERIFIER-REPLAY-RESULT'
]);

const BLOCKING_REASONS = Object.freeze([
  'CONCRETE_AUTHORITY_BOUNDARY_NOT_BOUND',
  'CONCRETE_POLICY_EVALUATION_NOT_BOUND',
  'CONCRETE_ACTION_REQUEST_NOT_BOUND',
  'CONCRETE_ACTION_RECEIPT_NOT_BOUND',
  'CONCRETE_AUDIT_EVENT_NOT_BOUND',
  'CONCRETE_EVIDENCE_EXPORT_NOT_BOUND',
  'VERIFIER_REPLAY_NOT_EXECUTED',
  'VERIFIER_REPLAY_NOT_PASSED',
  'CHAIN_NODE_DIGESTS_NOT_BOUND',
  'DECISION_PROOF_DEMO_NOT_READY'
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

function buildDecisionProofChainClosureGate(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-077-DECISION-PROOF-CHAIN-CLOSURE-GATE-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_CHAIN_CLOSURE_GATE',
    document_code: 'HBCE-L1-DECISION-PROOF-CHAIN-CLOSURE-GATE-2027-PROG-077',
    issue_id: 'PROG-077',
    priority: 'LEVEL1-DECISION-PROOF-CHAIN-CLOSURE-GATE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_verifier_replay_result_ref: SOURCE_REF,
    source_verifier_replay_result_revision_hash: source.revision_hash,
    source_verifier_replay_result_revision_hash_valid: validHash(source),

    decision_proof_chain_closure_gate_status: STATUS,

    inherited_verifier_boundary: {
      verifier_replay_result_status: source.verifier_replay_result_status,
      verifier_replay_result_ready: source.readiness_state.verifier_replay_result_ready,
      verifier_replay_executed: source.readiness_state.verifier_replay_executed,
      verifier_replay_passed: source.readiness_state.verifier_replay_passed,
      verifier_replay_result_is_not_effect_proof: source.verifier_replay_result.verifier_replay_result_is_not_effect_proof,
      verifier_replay_result_is_not_legal_validity: source.verifier_replay_result.verifier_replay_result_is_not_legal_validity,
      ai_model_verifier_authority_allowed: source.verifier_replay_result.ai_model_verifier_authority_allowed
    },

    closure_gate: {
      purpose: 'Evaluate whether the Level 1 Decision Proof chain can be considered closed for a concrete demo case.',
      required_chain_nodes: REQUIRED_CHAIN_NODES,
      gate_result: 'BLOCKED',
      structural_chain_defined: true,
      concrete_chain_closed: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      production_ready: false,
      blocking_reasons: BLOCKING_REASONS,
      authority_boundary_required: true,
      policy_evaluation_required: true,
      action_request_required: true,
      action_receipt_required: true,
      audit_event_required: true,
      evidence_export_manifest_required: true,
      verifier_replay_result_required: true,
      concrete_bindings_required: true,
      digest_bindings_required: true,
      verifier_replay_execution_required: true,
      verifier_replay_pass_required: true,
      fail_dominates_unknown_and_pass: true,
      unknown_dominates_pass: true,
      not_run_blocks_closure: true,
      closure_gate_is_not_effect_proof: true,
      closure_gate_is_not_business_success: true,
      closure_gate_is_not_legal_validity: true,
      closure_gate_is_not_production_readiness: true,
      ai_model_closure_authority_allowed: false
    },

    closure_requirements: {
      all_required_nodes_defined: true,
      all_required_nodes_concretely_bound: false,
      all_required_node_digests_bound: false,
      chain_order_verified: false,
      replay_input_bound: false,
      verifier_replay_executed: false,
      verifier_replay_passed: false,
      mismatch_report_bound: false,
      export_manifest_bound: false,
      audit_event_bound: false,
      action_receipt_bound: false,
      action_request_bound: false,
      policy_evaluation_bound: false,
      authority_boundary_bound: false
    },

    fail_closed_codes: [
      'DECISION_PROOF_CHAIN_CLOSURE_GATE_MISSING',
      'REQUIRED_CHAIN_NODE_MISSING',
      'REQUIRED_CHAIN_NODE_DIGEST_MISSING',
      'CONCRETE_CHAIN_BINDING_MISSING',
      'CHAIN_ORDER_NOT_VERIFIED',
      'VERIFIER_REPLAY_NOT_EXECUTED',
      'VERIFIER_REPLAY_NOT_PASSED',
      'VERIFIER_REPLAY_UNKNOWN',
      'VERIFIER_REPLAY_FAILED',
      'MISMATCH_REPORT_MISSING',
      'AI_CLOSURE_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      decision_proof_chain_closure_gate_defined: true,
      structural_chain_defined: true,
      decision_proof_chain_closed: false,
      concrete_demo_case_bound: false,
      all_required_nodes_bound: false,
      all_required_digests_bound: false,
      verifier_replay_executed: false,
      verifier_replay_passed: false,
      mismatch_report_bound: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-078-HBCE-LEVEL1-DECISION-PROOF-DEMO-RUNBOOK',

    non_claims: {
      decision_proof_chain_closed: false,
      concrete_demo_case_bound: false,
      verifier_replay_completed: false,
      verifier_replay_passed: false,
      decision_proof_demo_ready: false,
      effect_proven: false,
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

function writeDecisionProofChainClosureGate(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofChainClosureGate({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-077-decision-proof-chain-closure-gate.json';
  const doc = writeDecisionProofChainClosureGate(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_077_DECISION_PROOF_CHAIN_CLOSURE_GATE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  REQUIRED_CHAIN_NODES,
  BLOCKING_REASONS,
  buildDecisionProofChainClosureGate,
  writeDecisionProofChainClosureGate
};
