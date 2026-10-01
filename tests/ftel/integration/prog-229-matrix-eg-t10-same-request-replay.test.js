"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t10-same-request-replay.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T10_SameRequestReplay_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T10_PROG-229-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT10SameRequestReplayRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.replay_request.replay_request_digest, artifact.original_authoritative_result.original_request_digest);
  assert.equal(artifact.replay_digest_matches_original, true);
  assert.equal(artifact.replay_result, "RETURN_ORIGINAL_AUTHORITATIVE_RESULT");
  assert.equal(artifact.decision_result, "RETURN_ORIGINAL_AUTHORITATIVE_RESULT");
  assert.equal(artifact.validation_result, "IDEMPOTENT_REPLAY");
  assert.equal(artifact.reason_code, "IDEMPOTENT_REPLAY_SAME_DIGEST");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.returned_authoritative_result_sha256, artifact.original_authoritative_result.authoritative_result_sha256);
  assert.equal(artifact.original_authoritative_result_sha256, artifact.original_authoritative_result.authoritative_result_sha256);
  assert.equal(artifact.returned_authoritative_result.decision_result, artifact.original_authoritative_result.decision_result);
  assert.equal(artifact.returned_authoritative_result.reason_code, artifact.original_authoritative_result.reason_code);
  assert.equal(artifact.returned_authoritative_result.authoritative_event_id, artifact.original_authoritative_result.authoritative_event_id);
  assert.equal(artifact.original_decision_result_preserved, true);
  assert.equal(artifact.original_reason_code_preserved, true);
  assert.equal(artifact.original_state_preserved, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.new_decision_record_created, false);
  assert.equal(artifact.new_authoritative_transition_event_created, false);
  assert.equal(artifact.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.duplicate_authoritative_effect_created, false);
  assert.equal(artifact.duplicate_effect_evidence_created, false);
  assert.equal(artifact.duplicate_target_receipt_created, false);
  assert.equal(artifact.authoritative_event_count_delta, 0);
  assert.equal(artifact.effect_evidence_count_delta, 0);
  assert.equal(artifact.target_receipt_count_delta, 0);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.replay_observed_event_emitted, true);
  assert.equal(artifact.replay_observed_event.event_type, "IdempotentReplayObservedEvent");
  assert.equal(artifact.replay_observed_event.reason_code, "IDEMPOTENT_REPLAY_SAME_DIGEST");
  assert.equal(artifact.replay_observed_event.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.replay_observed_event.duplicate_effect_evidence_created, false);
  assert.equal(artifact.replay_observed_event.duplicate_target_receipt_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.state, "BLOCKED");
  assert.equal(artifact.state_version, 4);
  assert.equal(artifact.state_changed, false);
  assert.equal(artifact.state_version_changed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "create_new_authoritative_result_on_replay_allowed",
    "create_duplicate_authoritative_event_allowed",
    "create_duplicate_effect_evidence_allowed",
    "create_duplicate_target_receipt_allowed",
    "model_replay_rewrite_authoritative",
    "ui_manual_replay_override_authoritative",
    "admin_override_duplicate_allowed"
  ]) {
    assert.equal(artifact.idempotency_gate[key], false, key);
  }

  assert.equal(artifact.idempotency_gate.same_digest_required, true);
  assert.equal(artifact.idempotency_gate.return_original_result_on_same_digest, true);
}

{
  const verification = runtime.verifyEGT10SameRequestReplay(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT10SameRequestReplayVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.replay_digest_matches_original, true);
  assert.equal(verification.replay_result, "RETURN_ORIGINAL_AUTHORITATIVE_RESULT");
  assert.equal(verification.reason_code, "IDEMPOTENT_REPLAY_SAME_DIGEST");
  assert.equal(verification.duplicate_authoritative_event_emitted, false);
  assert.equal(verification.duplicate_effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpDuplicate = "/tmp/hbce-matrix-eg-t10-duplicate-overclaim.json";
  const duplicate = {
    ...artifact,
    new_decision_record_created: true,
    new_authoritative_transition_event_created: true,
    duplicate_authoritative_event_emitted: true,
    duplicate_effect_evidence_created: true,
    duplicate_target_receipt_created: true,
    authoritative_event_count_delta: 1,
    effect_evidence_count_delta: 1,
    target_receipt_count_delta: 1
  };
  duplicate.content_sha256 = runtime.sha256Record({ ...duplicate, content_sha256: null });
  fs.writeFileSync(tmpDuplicate, JSON.stringify(duplicate, null, 2));

  const duplicateVerification = runtime.verifyEGT10SameRequestReplay(tmpDuplicate);
  assert.equal(duplicateVerification.verified, false);
  assert.ok(duplicateVerification.errors.some((error) => [
    "EG_T10_FIELD_INVALID",
    "EG_T10_AUTHORITATIVE_EVENT_COUNT_CHANGED",
    "EG_T10_EFFECT_EVIDENCE_COUNT_CHANGED",
    "EG_T10_TARGET_RECEIPT_COUNT_CHANGED"
  ].includes(error.code)));

  const tmpRuntime = "/tmp/hbce-matrix-eg-t10-runtime-overclaim.json";
  const runtimeOverclaim = {
    ...artifact,
    runtime_claims: {
      ...artifact.runtime_claims,
      duplicate_authoritative_event_created: true,
      duplicate_effect_evidence_created: true
    }
  };
  runtimeOverclaim.content_sha256 = runtime.sha256Record({ ...runtimeOverclaim, content_sha256: null });
  fs.writeFileSync(tmpRuntime, JSON.stringify(runtimeOverclaim, null, 2));

  const runtimeVerification = runtime.verifyEGT10SameRequestReplay(tmpRuntime);
  assert.equal(runtimeVerification.verified, false);
  assert.ok(runtimeVerification.errors.some((error) => error.code === "EG_T10_RUNTIME_CLAIM_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.replay_digest_matches_original, true);
  assert.equal(evidence.replay_result, "RETURN_ORIGINAL_AUTHORITATIVE_RESULT");
  assert.equal(evidence.reason_code, "IDEMPOTENT_REPLAY_SAME_DIGEST");
  assert.equal(evidence.duplicate_authoritative_event_emitted, false);
  assert.equal(evidence.duplicate_effect_evidence_created, false);
  assert.equal(evidence.duplicate_target_receipt_created, false);
  assert.equal(evidence.authoritative_event_count_delta, 0);
  assert.equal(evidence.effect_evidence_count_delta, 0);
  assert.equal(evidence.target_receipt_count_delta, 0);
  assert.equal(evidence.eg_t10_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "new_authoritative_decision_created",
    "duplicate_authoritative_event_created",
    "transition_accepted",
    "authoritative_projection_updated",
    "release_clean_eligible",
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

console.log("PROG_229_MATRIX_EG_T10_SAME_REQUEST_REPLAY_TEST=PASS");
