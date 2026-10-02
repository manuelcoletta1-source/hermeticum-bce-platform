"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t20-current-recompute-expired-mandate.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T20_CurrentRecomputeExpiredMandate_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T20_PROG-239-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT20CurrentRecomputeExpiredMandateRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "Current authority predicate fails; dependent effective state regresses/blocks");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.current_recomputation_after_mandate_expired_detected, true);
  assert.equal(artifact.current_recompute_time_used, true);
  assert.equal(artifact.recorded_historical_evaluation_time_not_used_for_current_authority, true);
  assert.equal(artifact.mandate_active_at_current_recompute_time, false);
  assert.equal(artifact.current_authority_predicate_failed, true);
  assert.equal(artifact.dependent_effective_state_regressed, true);
  assert.equal(artifact.dependent_effective_state_blocked, true);
  assert.equal(artifact.previous_effective_state_value, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.recomputed_effective_state_value, "BLOCKED");
  assert.equal(artifact.recomputed_validation_result, "UNVERIFIED");
  assert.equal(artifact.authority_failure_evidence_emitted, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.current_recompute_record.authority_predicate_time_source, "CURRENT_RECOMPUTE_TIME");
  assert.equal(artifact.current_recompute_record.current_authority_predicate_result, "FAIL");
  assert.equal(artifact.current_recompute_record.dependent_effective_state_regressed, true);
  assert.equal(artifact.current_recompute_record.dependent_effective_state_blocked, true);
  assert.equal(artifact.current_recompute_record.recomputed_effective_state, "BLOCKED");
  assert.equal(artifact.current_recompute_record.reason_codes.includes("CURRENT_AUTHORITY_PREDICATE_FAILED"), true);
  assert.equal(artifact.current_recompute_record.reason_codes.includes("MANDATE_EXPIRED"), true);
  assert.equal(artifact.current_recompute_record.reason_codes.includes("DEPENDENT_EFFECTIVE_STATE_BLOCKED"), true);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_current_authority_predicate_failure",
    "require_dependent_effective_state_regression_or_block",
    "require_authority_failure_evidence_emitted"
  ]) {
    assert.equal(artifact.recompute_gate[key], true, key);
  }

  for (const key of [
    "allow_current_state_to_remain_release_clean_eligible",
    "use_recorded_historical_time_for_current_authority_allowed",
    "mutate_historical_decision_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.recompute_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT20CurrentRecomputeExpiredMandate(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT20CurrentRecomputeExpiredMandateVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.current_authority_predicate_failed, true);
  assert.equal(verification.dependent_effective_state_regressed, true);
  assert.equal(verification.dependent_effective_state_blocked, true);
  assert.equal(verification.recomputed_effective_state_value, "BLOCKED");
  assert.equal(verification.authority_failure_evidence_emitted, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpReleaseClean = "/tmp/hbce-matrix-eg-t20-release-clean-overclaim.json";
  const releaseClean = {
    ...artifact,
    current_authority_predicate_failed: false,
    dependent_effective_state_regressed: false,
    dependent_effective_state_blocked: false,
    recomputed_effective_state_value: "RELEASE_CLEAN_ELIGIBLE",
    current_recompute_record: {
      ...artifact.current_recompute_record,
      current_authority_predicate_result: "PASS",
      recomputed_effective_state: "RELEASE_CLEAN_ELIGIBLE"
    }
  };
  releaseClean.content_sha256 = runtime.sha256Record({ ...releaseClean, content_sha256: null });
  fs.writeFileSync(tmpReleaseClean, JSON.stringify(releaseClean, null, 2));

  const releaseCleanVerification = runtime.verifyEGT20CurrentRecomputeExpiredMandate(tmpReleaseClean);
  assert.equal(releaseCleanVerification.verified, false);
  assert.ok(releaseCleanVerification.errors.some((error) => [
    "EG_T20_FIELD_INVALID",
    "EG_T20_CURRENT_AUTHORITY_PREDICATE_NOT_FAIL",
    "EG_T20_EFFECTIVE_STATE_NOT_BLOCKED"
  ].includes(error.code)));

  const tmpHistoricalTime = "/tmp/hbce-matrix-eg-t20-historical-time-overclaim.json";
  const historicalTime = {
    ...artifact,
    current_recompute_time_used: false,
    recorded_historical_evaluation_time_not_used_for_current_authority: false,
    recompute_gate: {
      ...artifact.recompute_gate,
      use_recorded_historical_time_for_current_authority_allowed: true
    }
  };
  historicalTime.content_sha256 = runtime.sha256Record({ ...historicalTime, content_sha256: null });
  fs.writeFileSync(tmpHistoricalTime, JSON.stringify(historicalTime, null, 2));

  const historicalTimeVerification = runtime.verifyEGT20CurrentRecomputeExpiredMandate(tmpHistoricalTime);
  assert.equal(historicalTimeVerification.verified, false);
  assert.ok(historicalTimeVerification.errors.some((error) => [
    "EG_T20_FIELD_INVALID",
    "EG_T20_GATE_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpExecution = "/tmp/hbce-matrix-eg-t20-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    recompute_gate: {
      ...artifact.recompute_gate,
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

  const executionVerification = runtime.verifyEGT20CurrentRecomputeExpiredMandate(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T20_GATE_OVERCLAIM",
    "EG_T20_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.current_recomputation_after_mandate_expired_detected, true);
  assert.equal(evidence.current_recompute_time_used, true);
  assert.equal(evidence.current_authority_predicate_failed, true);
  assert.equal(evidence.dependent_effective_state_regressed, true);
  assert.equal(evidence.dependent_effective_state_blocked, true);
  assert.equal(evidence.recomputed_effective_state_value, "BLOCKED");
  assert.equal(evidence.authority_failure_evidence_emitted, true);
  assert.equal(evidence.eg_t20_runtime_artifact_created, true);

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

console.log("PROG_239_MATRIX_EG_T20_CURRENT_RECOMPUTE_EXPIRED_MANDATE_TEST=PASS");
