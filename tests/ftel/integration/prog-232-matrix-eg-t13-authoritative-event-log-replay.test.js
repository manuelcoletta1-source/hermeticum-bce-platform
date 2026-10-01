"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t13-authoritative-event-log-replay.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T13_AuthoritativeEventLogReplay_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T13_PROG-232-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT13AuthoritativeEventLogReplayRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "Same derived state under same baseline/time profile");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.same_baseline, true);
  assert.equal(artifact.same_time_profile, true);
  assert.equal(artifact.same_event_log, true);
  assert.equal(artifact.same_derived_state, true);
  assert.equal(artifact.original_derived_state, "BLOCKED");
  assert.equal(artifact.replay_derived_state, "BLOCKED");
  assert.equal(artifact.original_derived_state_version, 3);
  assert.equal(artifact.replay_derived_state_version, 3);
  assert.equal(artifact.original_applied_event_count, 3);
  assert.equal(artifact.replay_applied_event_count, 3);
  assert.equal(artifact.deterministic_derivation_confirmed, true);
  assert.equal(artifact.derivation_without_errors, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.authoritative_event_log.event_count, 3);
  assert.equal(artifact.authoritative_event_log.baseline_sha256, artifact.baseline_time_profile.baseline_sha256);
  assert.equal(artifact.authoritative_event_log.time_profile_id, artifact.baseline_time_profile.time_profile_id);
  assert.equal(artifact.original_derivation.derived_without_errors, true);
  assert.equal(artifact.replay_derivation.derived_without_errors, true);
  assert.deepEqual(artifact.original_derivation.applied_event_ids, artifact.replay_derivation.applied_event_ids);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.replay_observation.same_derived_state, true);
  assert.equal(artifact.replay_observation.same_baseline, true);
  assert.equal(artifact.replay_observation.same_time_profile, true);
  assert.equal(artifact.replay_observation.new_authoritative_event_created, false);
  assert.equal(artifact.replay_observation.projection_mutated_during_replay, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.replay_created_new_authoritative_event, false);
  assert.equal(artifact.projection_mutated_during_replay, false);
  assert.equal(artifact.event_log_rewritten, false);
  assert.equal(artifact.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.duplicate_effect_evidence_created, false);
  assert.equal(artifact.target_receipt_created, false);
  assert.equal(artifact.execution_effect_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_same_baseline",
    "require_same_time_profile",
    "require_same_event_log_hash",
    "require_same_derived_state"
  ]) {
    assert.equal(artifact.replay_gate[key], true, key);
  }

  for (const key of [
    "allow_event_log_rewrite",
    "allow_projection_mutation_during_replay",
    "allow_new_authoritative_event_creation",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.replay_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT13AuthoritativeEventLogReplay(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT13AuthoritativeEventLogReplayVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.same_baseline, true);
  assert.equal(verification.same_time_profile, true);
  assert.equal(verification.same_event_log, true);
  assert.equal(verification.same_derived_state, true);
  assert.equal(verification.original_derived_state, "BLOCKED");
  assert.equal(verification.replay_derived_state, "BLOCKED");
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpMismatch = "/tmp/hbce-matrix-eg-t13-derived-state-mismatch.json";
  const mismatch = {
    ...artifact,
    same_derived_state: false,
    deterministic_derivation_confirmed: false,
    replay_derived_state: "RELEASE_CLEAN_ELIGIBLE"
  };
  mismatch.content_sha256 = runtime.sha256Record({ ...mismatch, content_sha256: null });
  fs.writeFileSync(tmpMismatch, JSON.stringify(mismatch, null, 2));

  const mismatchVerification = runtime.verifyEGT13AuthoritativeEventLogReplay(tmpMismatch);
  assert.equal(mismatchVerification.verified, false);
  assert.ok(mismatchVerification.errors.some((error) => error.code === "EG_T13_FIELD_INVALID"));

  const tmpRewrite = "/tmp/hbce-matrix-eg-t13-rewrite-overclaim.json";
  const rewrite = {
    ...artifact,
    event_log_rewritten: true,
    replay_created_new_authoritative_event: true,
    projection_mutated_during_replay: true
  };
  rewrite.content_sha256 = runtime.sha256Record({ ...rewrite, content_sha256: null });
  fs.writeFileSync(tmpRewrite, JSON.stringify(rewrite, null, 2));

  const rewriteVerification = runtime.verifyEGT13AuthoritativeEventLogReplay(tmpRewrite);
  assert.equal(rewriteVerification.verified, false);
  assert.ok(rewriteVerification.errors.some((error) => error.code === "EG_T13_FIELD_INVALID"));
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpExecution = "/tmp/hbce-matrix-eg-t13-execution-overclaim.json";
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

  const executionVerification = runtime.verifyEGT13AuthoritativeEventLogReplay(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T13_GATE_OVERCLAIM",
    "EG_T13_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.same_baseline, true);
  assert.equal(evidence.same_time_profile, true);
  assert.equal(evidence.same_event_log, true);
  assert.equal(evidence.same_derived_state, true);
  assert.equal(evidence.original_derived_state, "BLOCKED");
  assert.equal(evidence.replay_derived_state, "BLOCKED");
  assert.equal(evidence.deterministic_derivation_confirmed, true);
  assert.equal(evidence.derivation_without_errors, true);
  assert.equal(evidence.authoritative_event_log_replayed, true);
  assert.equal(evidence.eg_t13_runtime_artifact_created, true);

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

console.log("PROG_232_MATRIX_EG_T13_AUTHORITATIVE_EVENT_LOG_REPLAY_TEST=PASS");
