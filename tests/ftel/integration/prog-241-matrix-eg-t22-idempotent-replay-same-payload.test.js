"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t22-idempotent-replay-same-payload.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T22_IdempotentReplaySamePayload_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T22_PROG-241-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT22IdempotentReplaySamePayloadRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "Return original authoritative result; no second effect");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.same_idempotency_key_detected, true);
  assert.equal(artifact.same_payload_digest_detected, true);
  assert.equal(artifact.original_authoritative_result_returned, true);
  assert.equal(artifact.second_authoritative_result_created, false);
  assert.equal(artifact.second_transition_event_created, false);
  assert.equal(artifact.second_dispatch_created, false);
  assert.equal(artifact.second_target_receipt_created, false);
  assert.equal(artifact.second_effect_evidence_created, false);
  assert.equal(artifact.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.duplicate_effect_evidence_created, false);
  assert.equal(artifact.replay_does_not_reexecute_action, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.replay_request.idempotency_key, artifact.original_authoritative_result.idempotency_key);
  assert.equal(artifact.replay_request.payload_digest, artifact.original_authoritative_result.payload_digest);
  assert.equal(artifact.replay_result.returned_result_hash, artifact.original_authoritative_result.result_hash);
  assert.equal(artifact.replay_result.replay_decision, "RETURN_ORIGINAL_AUTHORITATIVE_RESULT");
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_same_idempotency_key",
    "require_same_payload_digest",
    "require_return_original_authoritative_result",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.idempotency_gate[key], true, key);
  }

  for (const key of [
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
  const verification = runtime.verifyEGT22IdempotentReplaySamePayload(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT22IdempotentReplaySamePayloadVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.original_authoritative_result_returned, true);
  assert.equal(verification.second_effect_evidence_created, false);
  assert.equal(verification.replay_does_not_reexecute_action, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpDuplicate = "/tmp/hbce-matrix-eg-t22-duplicate-effect-overclaim.json";
  const duplicate = {
    ...artifact,
    second_authoritative_result_created: true,
    second_transition_event_created: true,
    second_effect_evidence_created: true,
    replay_does_not_reexecute_action: false,
    idempotency_gate: {
      ...artifact.idempotency_gate,
      allow_second_authoritative_result: true,
      allow_second_effect_evidence: true
    }
  };
  duplicate.content_sha256 = runtime.sha256Record({ ...duplicate, content_sha256: null });
  fs.writeFileSync(tmpDuplicate, JSON.stringify(duplicate, null, 2));

  const duplicateVerification = runtime.verifyEGT22IdempotentReplaySamePayload(tmpDuplicate);
  assert.equal(duplicateVerification.verified, false);
  assert.ok(duplicateVerification.errors.some((error) => [
    "EG_T22_FIELD_INVALID",
    "EG_T22_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t22-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    no_execution_boundary: {
      ...artifact.no_execution_boundary,
      dispatch_performed: true,
      external_connector_called: true,
      effect_evidence_created: true
    }
  };
  executionOverclaim.content_sha256 = runtime.sha256Record({ ...executionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpExecution, JSON.stringify(executionOverclaim, null, 2));

  const executionVerification = runtime.verifyEGT22IdempotentReplaySamePayload(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => error.code === "EG_T22_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.same_idempotency_key_detected, true);
  assert.equal(evidence.same_payload_digest_detected, true);
  assert.equal(evidence.original_authoritative_result_returned, true);
  assert.equal(evidence.second_effect_evidence_created, false);
  assert.equal(evidence.replay_does_not_reexecute_action, true);
  assert.equal(evidence.eg_t22_runtime_artifact_created, true);

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

console.log("PROG_241_MATRIX_EG_T22_IDEMPOTENT_REPLAY_SAME_PAYLOAD_TEST=PASS");
