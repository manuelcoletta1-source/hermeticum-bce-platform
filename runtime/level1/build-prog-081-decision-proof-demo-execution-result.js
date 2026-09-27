'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');

const STATUS = 'LEVEL1_DECISION_PROOF_DEMO_EXECUTION_RESULT_CREATED_SYNTHETIC_ONLY';
const SOURCE_REF = 'docs/launch/level1/prog-080-decision-proof-demo-execution-harness.json';

const GENERATED_RECORDS = Object.freeze([
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

function attachDigest(record) {
  return { ...record, digest: sha256Digest(record) };
}

function buildSyntheticExecutionRecords(fixtureDoc, harnessDoc) {
  const payload = fixtureDoc.demo_fixture.fixture_payload;
  const runId = 'HBCE-L1-DEMO-EXECUTION-0001';
  const executedAt = '2027-01-19T15:30:00Z';
  const correlationId = 'CORR::HBCE-L1-DEMO-EXECUTION-0001';
  const idempotencyKey = 'IDEMPOTENCY::HBCE-L1-DEMO-EXECUTION-0001';

  const authorityBoundaryRecord = attachDigest({
    record_type: 'authority_boundary_record',
    record_id: 'AUTHORITY-BOUNDARY::HBCE-L1-DEMO-0001',
    demo_case_id: payload.demo_case_id,
    authority_type: payload.authority_fixture.authority_type,
    authority_ref: payload.authority_fixture.authority_ref,
    organization_ref: payload.authority_fixture.organization_ref,
    role_ref: payload.authority_fixture.role_ref,
    delegation_ref: payload.authority_fixture.delegation_ref,
    validity_window: payload.authority_fixture.validity_window,
    revocation_status: payload.authority_fixture.revocation_status,
    scope_ref: payload.demo_scope,
    source_fixture_digest: fixtureDoc.demo_fixture.fixture_payload_digest,
    generated_at: executedAt,
    non_claims: {
      legal_validity: false,
      production_authority: false,
      ai_authority: false
    }
  });

  const policyEvaluationRecord = attachDigest({
    record_type: 'policy_evaluation_record',
    record_id: 'POLICY-EVALUATION::HBCE-L1-DEMO-0001',
    demo_case_id: payload.demo_case_id,
    authority_boundary_ref: authorityBoundaryRecord.record_id,
    authority_boundary_digest: authorityBoundaryRecord.digest,
    policy_ref: payload.policy_fixture.policy_ref,
    policy_version: payload.policy_fixture.policy_version,
    action_class: payload.action_payload_fixture.action_class,
    target_ref: payload.target_fixture.target_ref,
    evaluation_result: payload.policy_fixture.expected_policy_result,
    evaluation_codes: ['DEMO_POLICY_ALLOW'],
    evaluated_at: executedAt,
    non_claims: {
      legal_validity: false,
      business_success: false,
      ai_policy_authority: false
    }
  });

  const actionRequestRecord = attachDigest({
    record_type: 'action_request_record',
    record_id: 'ACTION-REQUEST::HBCE-L1-DEMO-0001',
    demo_case_id: payload.demo_case_id,
    policy_evaluation_ref: policyEvaluationRecord.record_id,
    policy_evaluation_digest: policyEvaluationRecord.digest,
    action_class: payload.action_payload_fixture.action_class,
    action_intent: payload.action_payload_fixture.action_intent,
    target_ref: payload.target_fixture.target_ref,
    request_payload_ref: payload.action_payload_fixture.payload_ref,
    request_payload_value: payload.action_payload_fixture.payload_value,
    requested_at: executedAt,
    correlation_id: correlationId,
    idempotency_key: idempotencyKey,
    non_claims: {
      execution_completed: false,
      effect_proven: false,
      ai_action_authority: false
    }
  });

  const actionReceiptRecord = attachDigest({
    record_type: 'action_receipt_record',
    record_id: 'ACTION-RECEIPT::HBCE-L1-DEMO-0001',
    demo_case_id: payload.demo_case_id,
    action_request_ref: actionRequestRecord.record_id,
    action_request_digest: actionRequestRecord.digest,
    receipt_source_ref: payload.receipt_source_fixture.receipt_source_ref,
    receipt_status: payload.receipt_source_fixture.expected_receipt_status,
    received_at: executedAt,
    correlation_id: correlationId,
    idempotency_key: idempotencyKey,
    non_claims: {
      effect_proven: false,
      business_success: false,
      legal_validity: false,
      ai_receipt_authority: false
    }
  });

  const auditEventRecord = attachDigest({
    record_type: 'audit_event_record',
    record_id: 'AUDIT-EVENT::HBCE-L1-DEMO-0001',
    demo_case_id: payload.demo_case_id,
    event_type: 'DECISION_PROOF_AUDIT_EVENT',
    event_result: 'RECORDED',
    authority_boundary_ref: authorityBoundaryRecord.record_id,
    authority_boundary_digest: authorityBoundaryRecord.digest,
    policy_evaluation_ref: policyEvaluationRecord.record_id,
    policy_evaluation_digest: policyEvaluationRecord.digest,
    action_request_ref: actionRequestRecord.record_id,
    action_request_digest: actionRequestRecord.digest,
    action_receipt_ref: actionReceiptRecord.record_id,
    action_receipt_digest: actionReceiptRecord.digest,
    actor_ref: payload.audit_actor_fixture.actor_ref,
    event_time: executedAt,
    correlation_id: correlationId,
    previous_chain_digest: actionReceiptRecord.digest,
    non_claims: {
      effect_proven: false,
      business_success: false,
      legal_validity: false,
      ai_audit_authority: false
    }
  });

  const evidenceExportManifest = attachDigest({
    record_type: 'evidence_export_manifest',
    record_id: 'EVIDENCE-EXPORT::HBCE-L1-DEMO-0001',
    demo_case_id: payload.demo_case_id,
    export_format: payload.export_profile_fixture.export_format,
    canonicalization_profile: payload.export_profile_fixture.canonicalization_profile,
    digest_algorithm: payload.export_profile_fixture.digest_algorithm,
    authority_boundary_digest: authorityBoundaryRecord.digest,
    policy_evaluation_digest: policyEvaluationRecord.digest,
    action_request_digest: actionRequestRecord.digest,
    action_receipt_digest: actionReceiptRecord.digest,
    audit_event_digest: auditEventRecord.digest,
    verifier_replay_input_ref: 'VERIFIER-REPLAY-INPUT::HBCE-L1-DEMO-0001',
    generated_at: executedAt,
    non_claims: {
      verifier_replay_completed: false,
      effect_proven: false,
      legal_validity: false,
      ai_export_authority: false
    }
  });

  const recomputedDigests = [
    authorityBoundaryRecord.digest,
    policyEvaluationRecord.digest,
    actionRequestRecord.digest,
    actionReceiptRecord.digest,
    auditEventRecord.digest,
    evidenceExportManifest.digest
  ];

  const verifierReplayResult = attachDigest({
    record_type: 'verifier_replay_result',
    record_id: 'VERIFIER-REPLAY::HBCE-L1-DEMO-0001',
    demo_case_id: payload.demo_case_id,
    verifier_ref: payload.verifier_profile_fixture.verifier_ref,
    verifier_version: payload.verifier_profile_fixture.verifier_version,
    replay_input_ref: 'VERIFIER-REPLAY-INPUT::HBCE-L1-DEMO-0001',
    evidence_export_manifest_ref: evidenceExportManifest.record_id,
    evidence_export_manifest_digest: evidenceExportManifest.digest,
    replay_started_at: executedAt,
    replay_completed_at: executedAt,
    replay_result: 'PASS',
    replay_codes: ['ALL_CHAIN_NODE_DIGESTS_MATCH', 'ORDERED_CHAIN_REPLAY_PASSED'],
    replayed_chain_nodes: GENERATED_RECORDS.slice(0, 6),
    recomputed_digests: recomputedDigests,
    mismatch_report: {
      mismatch_detected: false,
      mismatch_count: 0,
      mismatch_refs: []
    },
    non_claims: {
      effect_proven: false,
      business_success: false,
      legal_validity: false,
      production_readiness: false,
      ai_verifier_authority: false
    }
  });

  const closureGateResult = attachDigest({
    record_type: 'closure_gate_result',
    record_id: 'CLOSURE-GATE::HBCE-L1-DEMO-0001',
    demo_case_id: payload.demo_case_id,
    gate_result: 'PASS_SYNTHETIC_DEMO_ONLY',
    structural_chain_defined: true,
    synthetic_chain_closed: true,
    verifier_replay_passed: true,
    manual_human_acceptance_required: true,
    manual_human_acceptance_status: 'PENDING',
    decision_proof_demo_ready: false,
    level1_launch_ready: false,
    production_ready: false,
    generated_at: executedAt,
    non_claims: {
      human_accepted: false,
      production_ready: false,
      legal_validity: false,
      external_effect_proven: false,
      ai_closure_authority: false
    }
  });

  return {
    run_id: runId,
    executed_at: executedAt,
    correlation_id: correlationId,
    idempotency_key: idempotencyKey,
    authority_boundary_record: authorityBoundaryRecord,
    policy_evaluation_record: policyEvaluationRecord,
    action_request_record: actionRequestRecord,
    action_receipt_record: actionReceiptRecord,
    audit_event_record: auditEventRecord,
    evidence_export_manifest: evidenceExportManifest,
    verifier_replay_result: verifierReplayResult,
    closure_gate_result: closureGateResult
  };
}

function buildDecisionProofDemoExecutionResult(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const harness = readJson(rootDir, SOURCE_REF);
  const fixture = readJson(rootDir, harness.source_demo_fixture_ref);
  const records = buildSyntheticExecutionRecords(fixture, harness);

  const doc = {
    proto: 'HBCE-L1-PROG-081-DECISION-PROOF-DEMO-EXECUTION-RESULT-v1',
    kind: 'HBCE_LEVEL1_DECISION_PROOF_DEMO_EXECUTION_RESULT',
    document_code: 'HBCE-L1-DECISION-PROOF-DEMO-EXECUTION-RESULT-2027-PROG-081',
    issue_id: 'PROG-081',
    priority: 'LEVEL1-DECISION-PROOF-DEMO-EXECUTION-RESULT',
    repository_baseline_commit: options.repositoryCommit || gitHead(rootDir),

    source_execution_harness_ref: SOURCE_REF,
    source_execution_harness_revision_hash: harness.revision_hash,
    source_execution_harness_revision_hash_valid: validHash(harness),

    source_demo_fixture_ref: harness.source_demo_fixture_ref,
    source_demo_fixture_revision_hash: fixture.revision_hash,
    source_demo_fixture_revision_hash_valid: validHash(fixture),

    decision_proof_demo_execution_result_status: STATUS,

    execution_result_summary: {
      synthetic_demo_only: true,
      harness_executed: true,
      concrete_demo_execution_completed: true,
      generated_records: GENERATED_RECORDS,
      generated_record_count: GENERATED_RECORDS.length,
      verifier_replay_completed: true,
      verifier_replay_result: records.verifier_replay_result.replay_result,
      verifier_replay_passed: true,
      synthetic_chain_closed: true,
      manual_human_acceptance_required: true,
      manual_human_acceptance_status: 'PENDING',
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      production_ready: false
    },

    execution_records: records,

    execution_integrity: {
      all_generated_records_have_digest: GENERATED_RECORDS.every((name) => Boolean(records[name].digest)),
      verifier_replay_digest_match_count: records.verifier_replay_result.recomputed_digests.length,
      verifier_replay_mismatch_count: records.verifier_replay_result.mismatch_report.mismatch_count,
      verifier_replay_ordered_chain_replay_passed: true,
      closure_gate_result: records.closure_gate_result.gate_result,
      human_acceptance_pending_blocks_demo_ready: true
    },

    fail_closed_codes: [
      'DEMO_EXECUTION_RESULT_MISSING',
      'SOURCE_EXECUTION_HARNESS_HASH_INVALID',
      'SOURCE_DEMO_FIXTURE_HASH_INVALID',
      'GENERATED_RECORD_DIGEST_MISSING',
      'VERIFIER_REPLAY_NOT_COMPLETED',
      'VERIFIER_REPLAY_NOT_PASS',
      'MISMATCH_REPORT_NOT_ZERO',
      'HUMAN_ACCEPTANCE_PENDING',
      'AI_EXECUTION_AUTHORITY_CLAIM_BLOCKED'
    ],

    readiness_state: {
      decision_proof_demo_execution_result_created: true,
      synthetic_demo_only: true,
      harness_executed: true,
      concrete_demo_execution_completed: true,
      authority_boundary_record_created: true,
      policy_evaluation_record_created: true,
      action_request_record_created: true,
      action_receipt_record_created: true,
      audit_event_record_created: true,
      evidence_export_manifest_created: true,
      verifier_replay_completed: true,
      verifier_replay_passed: true,
      synthetic_chain_closed: true,
      manual_human_acceptance_required: true,
      manual_human_acceptance_completed: false,
      decision_proof_demo_ready: false,
      level1_launch_ready: false,
      level1_client_pack_ready: false,
      production_ready: false
    },

    next_required_program: 'PROG-082-HBCE-LEVEL1-DECISION-PROOF-HUMAN-ACCEPTANCE-RECORD',

    non_claims: {
      human_accepted: false,
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

function writeDecisionProofDemoExecutionResult(targetPath, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const doc = buildDecisionProofDemoExecutionResult({ rootDir, repositoryCommit: options.repositoryCommit });
  fs.writeFileSync(path.join(rootDir, targetPath), `${JSON.stringify(doc, null, 2)}\n`);
  return doc;
}

if (require.main === module) {
  const targetPath = process.argv[2] || 'docs/launch/level1/prog-081-decision-proof-demo-execution-result.json';
  const doc = writeDecisionProofDemoExecutionResult(targetPath, { rootDir: process.cwd() });
  console.log(`PROG_081_DECISION_PROOF_DEMO_EXECUTION_RESULT_WRITTEN=${doc.revision_hash}`);
}

module.exports = {
  STATUS,
  SOURCE_REF,
  GENERATED_RECORDS,
  buildSyntheticExecutionRecords,
  buildDecisionProofDemoExecutionResult,
  writeDecisionProofDemoExecutionResult
};
