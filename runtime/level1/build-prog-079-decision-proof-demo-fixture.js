'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_DEMO_FIXTURE_DEFINED_NOT_EXECUTED';
const SOURCE_REF = 'docs/launch/level1/prog-078-decision-proof-demo-runbook.json';

const FIXTURE_INPUTS = Object.freeze([
  'demo_case_id',
  'demo_scope',
  'authority_fixture',
  'policy_fixture',
  'target_fixture',
  'action_payload_fixture',
  'receipt_source_fixture',
  'audit_actor_fixture',
  'export_profile_fixture',
  'verifier_profile_fixture'
]);

const FIXTURE_OUTPUT_TARGETS = Object.freeze([
  'authority_boundary_record',
  'policy_evaluation_record',
  'action_request_record',
  'action_receipt_record',
  'audit_event_record',
  'evidence_export_manifest',
  'verifier_replay_result',
  'closure_gate_result'
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

function buildDecisionProofDemoFixture(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const source = readJson(rootDir, SOURCE_REF);

  const fixturePayload = {
    demo_case_id: 'HBCE-L1-DEMO-FIXTURE-0001',
    demo_scope: 'DEMO_ONLY_DIGITAL_ACTION',
    authority_fixture: {
      authority_type: 'SYNTHETIC_HUMAN_OPERATOR',
      authority_ref: 'DEMO-AUTHORITY::OPERATOR-001',
      organization_ref: 'DEMO-ORG::HERMETICUM-BCE-L1-FIXTURE',
      role_ref: 'DEMO-ROLE::AUTHORIZED_REQUESTER',
      delegation_ref: 'DEMO-DELEGATION::L1-DECISION-PROOF-DEMO',
      validity_window: {
        starts_at: '2027-01-19T00:00:00Z',
        ends_at: '2027-01-19T23:59:59Z'
      },
      revocation_status: 'NOT_REVOKED_SYNTHETIC_FIXTURE'
    },
    policy_fixture: {
      policy_ref: 'DEMO-POLICY::L1-ALLOW-DEMO-ONLY-DIGITAL-ACTION',
      policy_version: '1.0.0',
      expected_policy_result: 'ALLOW',
      blocked_results: ['BLOCK', 'UNKNOWN']
    },
    target_fixture: {
      target_ref: 'DEMO-TARGET::DECISION-PROOF-SINK-001',
      target_kind: 'SYNTHETIC_DIGITAL_TARGET',
      target_effect_claim_allowed: false
    },
    action_payload_fixture: {
      action_class: 'DEMO_ONLY_DIGITAL_ACTION',
      action_intent: 'CREATE_DEMO_DECISION_PROOF_TRACE',
      payload_ref: 'DEMO-PAYLOAD::L1-DECISION-PROOF-0001',
      payload_value: {
        decision_subject: 'synthetic_demo_decision',
        requested_operation: 'record_trace_only',
        amount_or_asset: 'NONE',
        external_effect: 'NONE'
      }
    },
    receipt_source_fixture: {
      receipt_source_ref: 'DEMO-RECEIPT-SOURCE::LOCAL-FIXTURE',
      expected_receipt_status: 'ACCEPTED_FOR_PROCESSING',
      rejected_status_blocks_success: true,
      blocked_status_blocks_success: true,
      unknown_status_blocks_success: true
    },
    audit_actor_fixture: {
      actor_ref: 'DEMO-AUDIT-ACTOR::JOKER-C2-RUNTIME-TRACE',
      actor_is_ai_authority: false,
      actor_role: 'TRACE_PREPARATION_ONLY'
    },
    export_profile_fixture: {
      export_format: 'HBCE_DECISION_PROOF_EXPORT_JSON',
      canonicalization_profile: 'RFC8785-JCS',
      digest_algorithm: 'SHA-256'
    },
    verifier_profile_fixture: {
      verifier_ref: 'DEMO-VERIFIER::L1-LOCAL-REPLAY',
      verifier_version: '0.1.0-fixture',
      expected_replay_result_after_execution: 'PASS',
      pass_requires_all_digest_matches: true,
      pass_requires_ordered_chain_replay: true
    }
  };

  const doc = {
    proto: 'HBCE-L1-PROG-079-DECISION-PROOF-DEMO-FIXTURE-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_DEMO_FIXTURE',
    document_code: 'HBCE-L1-DECISION-PROOF-DEMO-FIXTURE-2027-PROG-079',
    issue_id: 'PROG-079',
    priority: 'LEVEL1-DECISION-PROOF-DEMO-FIXTURE',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_demo_runbook_ref: SOURCE_REF,
    source_demo_runbook_revision_hash: source.revision_hash,
    source_demo_runbook_revision_hash_valid: validHash(source),

    decision_proof_demo_fixture_status: STATUS,

    inherited_runbook_boundary: {
      decision_proof_demo_runbook_status: source.decision_proof_demo_runbook_status,
      decision_proof_demo_runbook_ready: source.readiness_state.decision_proof_demo_runbook_ready,
      runbook_executed: source.readiness_state.runbook_executed,
      concrete_demo_case_bound: source.readiness_state.concrete_demo_case_bound,
      decision_proof_chain_closed: source.readiness_state.decision_proof_chain_closed,
      decision_proof_demo_ready: source.readiness_state.decision_proof_demo_ready,
      level1_launch_ready: source.readiness_state.level1_launch_ready,
      ai_model_demo_authority_allowed: source.demo_runbook.ai_model_demo_authority_allowed
    },

    demo_fixture: {
      purpose: 'Define the deterministic Level 1 Decision Proof demo fixture used as controlled input for the demo runbook.',
      fixture_inputs: FIXTURE_INPUTS,
      fixture_output_targets: FIXTURE_OUTPUT_TARGETS,
      fixture_payload: fixturePayload,
      fixture_payload_digest: sha256Digest(fixturePayload),
      deterministic_fixture_required: true,
      synthetic_demo_only: true,
      real_customer_data_allowed: false,
      external_side_effects_allowed: false,
      production_target_allowed: false,
      live_authority_allowed: false,
      demo_fixture_is_not_runbook_execution: true,
      demo_fixture_is_not_verifier_replay: true,
      demo_fixture_is_not_chain_closure: true,
      demo_fixture_is_not_effect_proof: true,
      demo_fixture_is_not_business_success: true,
      demo_fixture_is_not_legal_validity: true,
      demo_fixture_is_not_production_readiness: true,
      ai_model_demo_authority_allowed: false
    },

    fixture_acceptance_rules: {
      demo_case_id_required: true,
      demo_scope_must_be_demo_only: true,
      authority_fixture_required: true,
      policy_fixture_required: true,
      target_fixture_required: true,
      action_payload_fixture_required: true,
      receipt_source_fixture_required: true,
      audit_actor_fixture_required: true,
      export_profile_fixture_required: true,
      verifier_profile_fixture_required: true,
      fixture_payload_digest_required: true,
      all_fixture_inputs_required_before_runbook_execution: true,
      any_missing_fixture_input_blocks_runbook_execution: true,
      any_external_effect_claim_blocks_fixture: true,
      any_ai_authority_claim_blocks_fixture: true
    },

    fail_closed_codes: [
      'DEMO_FIXTURE_MISSING',
      'DEMO_CASE_ID_MISSING',
      'DEMO_SCOPE_INVALID',
      'AUTHORITY_FIXTURE_MISSING',
      'POLICY_FIXTURE_MISSING',
      'TARGET_FIXTURE_MISSING',
      'ACTION_PAYLOAD_FIXTURE_MISSING',
      'RECEIPT_SOURCE_FIXTURE_MISSING',
      'AUDIT_ACTOR_FIXTURE_MISSING',
      'EXPORT_PROFILE_FIXTURE_MISSING',
      'VERIFIER_PROFILE_FIXTURE_MISSING',
      'FIXTURE_PAYLOAD_DIGEST_MISSING',
      'EXTERNAL_EFFECT_CLAIM_BLOCKED',
      'LIVE_AUTHORITY_CLAIM_BLOCKED',
      'AI_DEMO_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      decision_proof_demo_fixture_defined: true,
      decision_proof_demo_fixture_ready: false,
      deterministic_fixture_payload_defined: true,
      fixture_payload_digest_bound: true,
      runbook_executed: false,
      authority_boundary_record_created: false,
      policy_evaluation_record_created: false,
      action_request_record_created: false,
      action_receipt_record_created: false,
      audit_event_record_created: false,
      evidence_export_manifest_created: false,
      verifier_replay_executed: false,
      verifier_replay_passed: false,
      decision_proof_chain_closed: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-080-HBCE-LEVEL1-DECISION-PROOF-DEMO-EXECUTION-HARNESS',

    non_claims: {
      runbook_executed: false,
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

function writeDecisionProofDemoFixture(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofDemoFixture({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-079-decision-proof-demo-fixture.json';
  const doc = writeDecisionProofDemoFixture(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_079_DECISION_PROOF_DEMO_FIXTURE_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  FIXTURE_INPUTS,
  FIXTURE_OUTPUT_TARGETS,
  buildDecisionProofDemoFixture,
  writeDecisionProofDemoFixture
};
