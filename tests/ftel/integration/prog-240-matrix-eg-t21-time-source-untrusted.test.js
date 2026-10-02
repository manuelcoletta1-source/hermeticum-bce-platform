"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t21-time-source-untrusted.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T21_TimeSourceUntrusted_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T21_PROG-240-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT21TimeSourceUntrustedRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "TIME_SOURCE_UNTRUSTED; time-dependent guard becomes UNVERIFIED");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.clock_drift_or_rollback_exceeds_profile_detected, true);
  assert.equal(artifact.clock_drift_exceeds_profile, true);
  assert.equal(artifact.clock_rollback_detected, true);
  assert.equal(artifact.rollback_exceeds_profile, true);
  assert.equal(artifact.monotonic_sequence_regressed, true);
  assert.equal(artifact.time_source_untrusted, true);
  assert.equal(artifact.time_dependent_guard_unverified, true);
  assert.equal(artifact.time_dependent_guard_passed, false);
  assert.equal(artifact.time_dependent_guard_failed_closed, true);
  assert.equal(artifact.authority_predicate_trusted, false);
  assert.equal(artifact.dependent_effective_state_blocked, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.ok(artifact.time_source_observation.observed_drift_seconds > artifact.time_trust_profile.max_clock_drift_seconds);
  assert.equal(artifact.time_source_observation.rollback_detected, true);
  assert.equal(artifact.time_source_observation.monotonic_sequence_regressed, true);
  assert.equal(artifact.time_guard_evaluation.guard_result, "UNVERIFIED");
  assert.equal(artifact.time_guard_evaluation.time_source_trusted, false);
  assert.equal(artifact.time_guard_evaluation.reason_codes.includes("TIME_SOURCE_UNTRUSTED"), true);
  assert.equal(artifact.violation_evidence.time_dependent_guard_result, "UNVERIFIED");
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_time_source_untrusted",
    "require_time_dependent_guard_unverified",
    "require_fail_closed_without_effect"
  ]) {
    assert.equal(artifact.time_guard[key], true, key);
  }

  for (const key of [
    "allow_time_dependent_guard_pass",
    "allow_authority_predicate_trusted",
    "allow_current_effective_state_trusted",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.time_guard[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT21TimeSourceUntrusted(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT21TimeSourceUntrustedVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.time_source_untrusted, true);
  assert.equal(verification.time_dependent_guard_unverified, true);
  assert.equal(verification.dependent_effective_state_blocked, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpTrusted = "/tmp/hbce-matrix-eg-t21-time-trusted-overclaim.json";
  const trusted = {
    ...artifact,
    time_source_untrusted: false,
    time_dependent_guard_unverified: false,
    time_dependent_guard_passed: true,
    authority_predicate_trusted: true,
    time_guard_evaluation: {
      ...artifact.time_guard_evaluation,
      time_source_trusted: true,
      guard_result: "PASS"
    }
  };
  trusted.content_sha256 = runtime.sha256Record({ ...trusted, content_sha256: null });
  fs.writeFileSync(tmpTrusted, JSON.stringify(trusted, null, 2));

  const trustedVerification = runtime.verifyEGT21TimeSourceUntrusted(tmpTrusted);
  assert.equal(trustedVerification.verified, false);
  assert.ok(trustedVerification.errors.some((error) => [
    "EG_T21_FIELD_INVALID",
    "EG_T21_GUARD_NOT_UNVERIFIED",
    "EG_T21_TIME_SOURCE_TRUST_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t21-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    time_guard: {
      ...artifact.time_guard,
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

  const executionVerification = runtime.verifyEGT21TimeSourceUntrusted(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T21_GATE_OVERCLAIM",
    "EG_T21_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.time_source_untrusted, true);
  assert.equal(evidence.time_dependent_guard_unverified, true);
  assert.equal(evidence.time_dependent_guard_passed, false);
  assert.equal(evidence.dependent_effective_state_blocked, true);
  assert.equal(evidence.eg_t21_runtime_artifact_created, true);

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

console.log("PROG_240_MATRIX_EG_T21_TIME_SOURCE_UNTRUSTED_TEST=PASS");
