"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t19-historical-replay-expired-mandate.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T19_HistoricalReplayExpiredMandate_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T19_PROG-238-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT19HistoricalReplayExpiredMandateRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "Uses recorded evaluation_time; historical authorized decision remains reproducible");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.historical_replay_after_mandate_expired_detected, true);
  assert.equal(artifact.recorded_evaluation_time_used, true);
  assert.equal(artifact.current_replay_time_not_used_for_historical_authority, true);
  assert.equal(artifact.mandate_active_at_recorded_evaluation_time, true);
  assert.equal(artifact.mandate_currently_expired, true);
  assert.equal(artifact.historical_authorized_decision_reproducible, true);
  assert.equal(artifact.historical_decision_result, "ALLOW");
  assert.equal(artifact.replayed_decision_result, "ALLOW");
  assert.equal(artifact.replay_result_reproduced, true);
  assert.equal(artifact.decision_hash_preserved, true);
  assert.equal(artifact.historical_decision_revoked_by_later_expiry, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.historical_authorized_decision.recorded_evaluation_time, artifact.historical_replay_record.recorded_evaluation_time);
  assert.equal(artifact.historical_authorized_decision.decision_hash, artifact.historical_replay_record.original_decision_hash);
  assert.equal(artifact.historical_replay_record.used_recorded_evaluation_time, true);
  assert.equal(artifact.historical_replay_record.used_current_replay_time_for_historical_authority, false);
  assert.equal(artifact.historical_replay_record.replay_result, "REPRODUCED");
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_recorded_evaluation_time",
    "require_historical_authorized_decision_reproducible",
    "require_later_expiry_not_to_revoke_history"
  ]) {
    assert.equal(artifact.replay_gate[key], true, key);
  }

  for (const key of [
    "use_current_time_for_historical_replay_allowed",
    "mutate_historical_decision_allowed",
    "revoke_historical_decision_due_to_later_expiry_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.replay_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT19HistoricalReplayExpiredMandate(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT19HistoricalReplayExpiredMandateVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.recorded_evaluation_time_used, true);
  assert.equal(verification.mandate_currently_expired, true);
  assert.equal(verification.historical_authorized_decision_reproducible, true);
  assert.equal(verification.historical_decision_revoked_by_later_expiry, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpCurrentTime = "/tmp/hbce-matrix-eg-t19-current-time-overclaim.json";
  const currentTime = {
    ...artifact,
    recorded_evaluation_time_used: false,
    current_replay_time_not_used_for_historical_authority: false,
    historical_replay_record: {
      ...artifact.historical_replay_record,
      used_recorded_evaluation_time: false,
      used_current_replay_time_for_historical_authority: true
    }
  };
  currentTime.content_sha256 = runtime.sha256Record({ ...currentTime, content_sha256: null });
  fs.writeFileSync(tmpCurrentTime, JSON.stringify(currentTime, null, 2));

  const currentTimeVerification = runtime.verifyEGT19HistoricalReplayExpiredMandate(tmpCurrentTime);
  assert.equal(currentTimeVerification.verified, false);
  assert.ok(currentTimeVerification.errors.some((error) => [
    "EG_T19_FIELD_INVALID",
    "EG_T19_REPLAY_DID_NOT_USE_RECORDED_EVALUATION_TIME",
    "EG_T19_USED_CURRENT_TIME_OVERCLAIM"
  ].includes(error.code)));

  const tmpRevoked = "/tmp/hbce-matrix-eg-t19-revoked-history-overclaim.json";
  const revoked = {
    ...artifact,
    historical_authorized_decision_reproducible: false,
    historical_decision_revoked_by_later_expiry: true,
    replay_result_reproduced: false
  };
  revoked.content_sha256 = runtime.sha256Record({ ...revoked, content_sha256: null });
  fs.writeFileSync(tmpRevoked, JSON.stringify(revoked, null, 2));

  const revokedVerification = runtime.verifyEGT19HistoricalReplayExpiredMandate(tmpRevoked);
  assert.equal(revokedVerification.verified, false);
  assert.ok(revokedVerification.errors.some((error) => error.code === "EG_T19_FIELD_INVALID"));
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpExecution = "/tmp/hbce-matrix-eg-t19-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    replay_gate: {
      ...artifact.replay_gate,
      allow_dispatch_execution: true
    },
    no_execution_boundary: {
      ...artifact.no_execution_boundary,
      dispatch_performed: true,
      effect_evidence_created: true
    }
  };
  executionOverclaim.content_sha256 = runtime.sha256Record({ ...executionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpExecution, JSON.stringify(executionOverclaim, null, 2));

  const executionVerification = runtime.verifyEGT19HistoricalReplayExpiredMandate(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T19_GATE_OVERCLAIM",
    "EG_T19_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.historical_replay_after_mandate_expired_detected, true);
  assert.equal(evidence.recorded_evaluation_time_used, true);
  assert.equal(evidence.current_replay_time_not_used_for_historical_authority, true);
  assert.equal(evidence.mandate_active_at_recorded_evaluation_time, true);
  assert.equal(evidence.mandate_currently_expired, true);
  assert.equal(evidence.historical_authorized_decision_reproducible, true);
  assert.equal(evidence.historical_decision_revoked_by_later_expiry, false);
  assert.equal(evidence.eg_t19_runtime_artifact_created, true);

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

console.log("PROG_238_MATRIX_EG_T19_HISTORICAL_REPLAY_EXPIRED_MANDATE_TEST=PASS");
