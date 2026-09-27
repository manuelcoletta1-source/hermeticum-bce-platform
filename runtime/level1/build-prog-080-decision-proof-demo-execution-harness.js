'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_DEMO_EXECUTION_HARNESS_DEFINED_NOT_EXECUTED';
const SOURCE_REF = 'docs/launch/level1/prog-079-decision-proof-demo-fixture.json';

const HARNESS_STEPS = Object.freeze([
  'LOAD_DEMO_FIXTURE',
  'VALIDATE_FIXTURE_BOUNDARY',
  'GENERATE_AUTHORITY_BOUNDARY_RECORD',
  'GENERATE_POLICY_EVALUATION_RECORD',
  'GENERATE_ACTION_REQUEST_RECORD',
  'GENERATE_ACTION_RECEIPT_RECORD',
  'GENERATE_AUDIT_EVENT_RECORD',
  'GENERATE_EVIDENCE_EXPORT_MANIFEST',
  'RUN_VERIFIER_REPLAY',
  'REEVALUATE_CLOSURE_GATE'
]);

const HARNESS_OUTPUTS = Object.freeze([
  'authority_boundary_record',
  'policy_evaluation_record',
  'action_request_record',
  'action_receipt_record',
  'audit_event_record',
  'evidence_export_manifest',
  'verifier_replay_result',
  'closure_gate_result',
  'execution_summary'
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

function buildDecisionProofDemoExecutionHarness(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const doc = {
    proto: 'HBCE-L1-PROG-080-DECISION-PROOF-DEMO-EXECUTION-HARNESS-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_DEMO_EXECUTION_HARNESS',
    document_code: 'HBCE-L1-DECISION-PROOF-DEMO-EXECUTION-HARNESS-2027-PROG-080',
    issue_id: 'PROG-080',
    priority: 'LEVEL1-DECISION-PROOF-DEMO-EXECUTION-HARNESS',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_demo_fixture_ref: SOURCE_REF,
    source_demo_fixture_revision_hash: source.revision_hash,
    source_demo_fixture_revision_hash_valid: validHash(source),

    decision_proof_demo_execution_harness_status: STATUS,

    inherited_fixture_boundary: {
      decision_proof_demo_fixture_status: source.decision_proof_demo_fixture_status,
      deterministic_fixture_payload_defined: source.readiness_state.deterministic_fixture_payload_defined,
      fixture_payload_digest_bound: source.readiness_state.fixture_payload_digest_bound,
      runbook_executed: source.readiness_state.runbook_executed,
      verifier_replay_executed: source.readiness_state.verifier_replay_executed,
      verifier_replay_passed: source.readiness_state.verifier_replay_passed,
      decision_proof_chain_closed: source.readiness_state.decision_proof_chain_closed,
      decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready,
      ai_model_demo_authority_allowed: source.demo_fixture.ai_model_demo_authority_allowed
    },

    execution_harness: {
      purpose: 'Define the deterministic Level 1 Decision Proof demo execution harness used to transform the demo fixture into concrete demo records under fail-closed constraints.',
      harness_steps: HARNESS_STEPS,
      harness_outputs: HARNESS_OUTPUTS,
      source_fixture_required: true,
      source_fixture_revision_hash_required: true,
      fixture_payload_digest_required: true,
      synthetic_demo_only_required: true,
      ordered_execution_required: true,
      canonical_json_required: true,
      sha256_digest_required: true,
      idempotent_execution_required: true,
      correlation_id_required: true,
      manual_human_acceptance_required: true,
      fail_closed_on_first_blocker: true,
      verifier_replay_required: true,
      closure_gate_reevaluation_required: true,
      execution_harness_is_not_execution_result: true,
      execution_harness_is_not_verifier_replay_pass: true,
      execution_harness_is_not_chain_closure: true,
      execution_harness_is_not_effect_proof: true,
      execution_harness_is_not_business_success: true,
      execution_harness_is_not_legal_validity: true,
      execution_harness_is_not_production_readiness: true,
      ai_model_execution_authority_allowed: false
    },

    deterministic_execution_plan: [
      {
        step: 'LOAD_DEMO_FIXTURE',
        produces: ['fixture_load_event'],
        pass_requires: ['source_demo_fixture_revision_hash_valid', 'fixture_payload_digest_bound'],
        fail_closed_on: ['missing_fixture', 'fixture_hash_invalid', 'fixture_payload_digest_missing']
      },
      {
        step: 'VALIDATE_FIXTURE_BOUNDARY',
        produces: ['fixture_boundary_validation'],
        pass_requires: ['synthetic_demo_only', 'real_customer_data_absent', 'external_side_effects_absent', 'production_target_absent', 'live_authority_absent'],
        fail_closed_on: ['real_customer_data_present', 'external_effect_claim_present', 'production_target_present', 'live_authority_claim_present', 'ai_authority_claim_present']
      },
      {
        step: 'GENERATE_AUTHORITY_BOUNDARY_RECORD',
        produces: ['authority_boundary_record'],
        pass_requires: ['authority_fixture_present', 'authority_scope_bound', 'revocation_status_checked'],
        fail_closed_on: ['authority_fixture_missing', 'authority_scope_missing', 'authority_revoked_or_unknown']
      },
      {
        step: 'GENERATE_POLICY_EVALUATION_RECORD',
        produces: ['policy_evaluation_record'],
        pass_requires: ['policy_fixture_present', 'policy_digest_bound', 'policy_result_allow'],
        fail_closed_on: ['policy_fixture_missing', 'policy_digest_missing', 'policy_result_block', 'policy_result_unknown']
      },
      {
        step: 'GENERATE_ACTION_REQUEST_RECORD',
        produces: ['action_request_record'],
        pass_requires: ['action_payload_fixture_present', 'policy_result_allow', 'idempotency_key_bound'],
        fail_closed_on: ['action_payload_missing', 'policy_result_not_allow', 'idempotency_key_missing']
      },
      {
        step: 'GENERATE_ACTION_RECEIPT_RECORD',
        produces: ['action_receipt_record'],
        pass_requires: ['receipt_source_fixture_present', 'receipt_status_accepted_for_processing', 'correlation_id_bound'],
        fail_closed_on: ['receipt_source_missing', 'receipt_rejected', 'receipt_blocked', 'receipt_unknown', 'correlation_id_missing']
      },
      {
        step: 'GENERATE_AUDIT_EVENT_RECORD',
        produces: ['audit_event_record'],
        pass_requires: ['audit_actor_fixture_present', 'previous_chain_digest_bound', 'audit_event_digest_bound'],
        fail_closed_on: ['audit_actor_missing', 'previous_chain_digest_missing', 'audit_event_digest_missing', 'broken_audit_chain']
      },
      {
        step: 'GENERATE_EVIDENCE_EXPORT_MANIFEST',
        produces: ['evidence_export_manifest'],
        pass_requires: ['export_profile_fixture_present', 'all_chain_node_digests_bound', 'replay_input_ref_bound'],
        fail_closed_on: ['export_profile_missing', 'chain_node_digest_missing', 'replay_input_ref_missing']
      },
      {
        step: 'RUN_VERIFIER_REPLAY',
        produces: ['verifier_replay_result'],
        pass_requires: ['verifier_profile_fixture_present', 'replay_executed', 'all_digest_matches', 'ordered_chain_replay_passed'],
        fail_closed_on: ['verifier_profile_missing', 'replay_not_run', 'digest_mismatch', 'chain_order_mismatch']
      },
      {
        step: 'REEVALUATE_CLOSURE_GATE',
        produces: ['closure_gate_result', 'execution_summary'],
        pass_requires: ['closure_gate_rerun', 'verifier_replay_passed', 'all_required_nodes_bound', 'all_required_digests_bound'],
        fail_closed_on: ['closure_gate_not_rerun', 'verifier_replay_not_passed', 'required_node_missing', 'required_digest_missing']
      }
    ],

    fail_closed_codes: [
      'EXECUTION_HARNESS_MISSING',
      'SOURCE_DEMO_FIXTURE_MISSING',
      'SOURCE_DEMO_FIXTURE_HASH_INVALID',
      'FIXTURE_PAYLOAD_DIGEST_MISSING',
      'REAL_CUSTOMER_DATA_PRESENT',
      'EXTERNAL_EFFECT_CLAIM_BLOCKED',
      'PRODUCTION_TARGET_CLAIM_BLOCKED',
      'LIVE_AUTHORITY_CLAIM_BLOCKED',
      'POLICY_RESULT_NOT_ALLOW',
      'ACTION_REQUEST_GENERATION_FAILED',
      'ACTION_RECEIPT_GENERATION_FAILED',
      'AUDIT_EVENT_GENERATION_FAILED',
      'EVIDENCE_EXPORT_GENERATION_FAILED',
      'VERIFIER_REPLAY_NOT_EXECUTED',
      'VERIFIER_REPLAY_NOT_PASSED',
      'CLOSURE_GATE_NOT_RERUN',
      'AI_EXECUTION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      decision_proof_demo_execution_harness_defined: true,
      decision_proof_demo_execution_harness_ready: false,
      source_fixture_bound: true,
      fixture_payload_digest_bound: true,
      harness_executed: false,
      authority_boundary_record_created: false,
      policy_evaluation_record_created: false,
      action_request_record_created: false,
      action_receipt_record_created: false,
      audit_event_record_created: false,
      evidence_export_manifest_created: false,
      verifier_replay_executed: false,
      verifier_replay_passed: false,
      closure_gate_rerun: false,
      decision_proof_chain_closed: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-081-HBCE-LEVEL1-DECISION-PROOF-DEMO-EXECUTION-RESULT',

    non_claims: {
      harness_executed: false,
      concrete_demo_execution_completed: false,
      verifier_replay_completed: false,
      verifier_replay_passed: false,
      decision_proof_chain_closed: false,
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

function writeDecisionProofDemoExecutionHarness(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofDemoExecutionHarness({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-080-decision-proof-demo-execution-harness.json';
  const doc = writeDecisionProofDemoExecutionHarness(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_080_DECISION_PROOF_DEMO_EXECUTION_HARNESS_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  HARNESS_STEPS,
  HARNESS_OUTPUTS,
  buildDecisionProofDemoExecutionHarness,
  writeDecisionProofDemoExecutionHarness
};
