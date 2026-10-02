"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t23-idempotency-key-conflict.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T23_IdempotencyKeyConflict_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T23_PROG-242-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT23IdempotencyKeyConflictRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "REJECT + IDEMPOTENCY_KEY_CONFLICT");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.same_idempotency_key_detected, true);
  assert.equal(artifact.different_payload_digest_detected, true);
  assert.equal(artifact.idempotency_key_conflict_detected, true);
  assert.equal(artifact.rejection_result, "REJECT");
  assert.equal(artifact.rejection_code, "IDEMPOTENCY_KEY_CONFLICT");
  assert.equal(artifact.replay_decision, "REJECT_IDEMPOTENCY_KEY_CONFLICT");
  assert.equal(artifact.original_authoritative_result_preserved, true);
  assert.equal(artifact.original_result_returned_as_success, false);
  assert.equal(artifact.second_authoritative_result_created, false);
  assert.equal(artifact.second_transition_event_created, false);
  assert.equal(artifact.second_effect_evidence_created, false);
  assert.equal(artifact.replay_rejected_without_reexecution, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.replay_request.idempotency_key, artifact.original_authoritative_result.idempotency_key);
  assert.notEqual(artifact.replay_request.payload_digest, artifact.original_authoritative_result.payload_digest);
  assert.equal(artifact.conflict_record.rejection_code, "IDEMPOTENCY_KEY_CONFLICT");
  assert.equal(artifact.conflict_record.replay_decision, "REJECT_IDEMPOTENCY_KEY_CONFLICT");
  assert.equal(artifact.conflict_record.second_effect_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_same_idempotency_key",
    "require_different_payload_digest",
    "require_reject_idempotency_key_conflict",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.idempotency_gate[key], true, key);
  }

  for (const key of [
    "allow_original_success_return_for_conflict",
    "allow_second_authoritative_result",
    "allow_second_transition_event",
    "allow_second_dispatch",
    "allow_second_target_receipt",
    "allow_second_effect_evidence",
    "allow_external_connector_call"
  ]) {
    assert.equal(artifact.idempotency_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT23IdempotencyKeyConflict(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT23IdempotencyKeyConflictVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.idempotency_key_conflict_detected, true);
  assert.equal(verification.rejection_code, "IDEMPOTENCY_KEY_CONFLICT");
  assert.equal(verification.replay_rejected_without_reexecution, true);
  assert.equal(verification.second_effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpAllow = "/tmp/hbce-matrix-eg-t23-conflict-allow-overclaim.json";
  const allow = {
    ...artifact,
    rejection_result: "ALLOW",
    rejection_code: null,
    original_result_returned_as_success: true,
    idempotency_key_conflict_detected: false,
    idempotency_gate: {
      ...artifact.idempotency_gate,
      allow_original_success_return_for_conflict: true
    },
    conflict_record: {
      ...artifact.conflict_record,
      rejection_code: null,
      replay_decision: "RETURN_ORIGINAL_AUTHORITATIVE_RESULT"
    }
  };
  allow.content_sha256 = runtime.sha256Record({ ...allow, content_sha256: null });
  fs.writeFileSync(tmpAllow, JSON.stringify(allow, null, 2));

  const allowVerification = runtime.verifyEGT23IdempotencyKeyConflict(tmpAllow);
  assert.equal(allowVerification.verified, false);
  assert.ok(allowVerification.errors.some((error) => [
    "EG_T23_FIELD_INVALID",
    "EG_T23_CONFLICT_CODE_INVALID",
    "EG_T23_REPLAY_DECISION_INVALID",
    "EG_T23_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t23-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    second_effect_evidence_created: true,
    no_execution_boundary: {
      ...artifact.no_execution_boundary,
      dispatch_performed: true,
      external_connector_called: true,
      effect_evidence_created: true
    }
  };
  executionOverclaim.content_sha256 = runtime.sha256Record({ ...executionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpExecution, JSON.stringify(executionOverclaim, null, 2));

  const executionVerification = runtime.verifyEGT23IdempotencyKeyConflict(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T23_FIELD_INVALID",
    "EG_T23_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.same_idempotency_key_detected, true);
  assert.equal(evidence.different_payload_digest_detected, true);
  assert.equal(evidence.idempotency_key_conflict_detected, true);
  assert.equal(evidence.rejection_code, "IDEMPOTENCY_KEY_CONFLICT");
  assert.equal(evidence.second_effect_evidence_created, false);
  assert.equal(evidence.replay_rejected_without_reexecution, true);
  assert.equal(evidence.eg_t23_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible_effective",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
    "pilot_execution_started",
    "dispatch_execution_authorized",
    "dispatch_command_emitted",
    "dispatch_performed",
    "external_connector_called",
    "target_system_contacted",
    "target_receipt_created",
    "execution_trace_bound",
    "effect_evidence_created",
    "customer_external_execution_allowed"
  ]) {
    assert.equal(evidence[key], false, key);
  }

  assert.equal(artifact.no_execution_boundary.dispatch_performed, false);
  assert.equal(artifact.no_execution_boundary.external_connector_called, false);
  assert.equal(artifact.no_execution_boundary.effect_evidence_created, false);
}

console.log("PROG_242_MATRIX_EG_T23_IDEMPOTENCY_KEY_CONFLICT_TEST=PASS");
