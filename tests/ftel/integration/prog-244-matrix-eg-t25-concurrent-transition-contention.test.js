"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t25-concurrent-transition-contention.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T25_ConcurrentTransitionContention_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T25_PROG-244-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT25ConcurrentTransitionContentionRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "At most one authoritative ALLOW; competitor rejected as STALE_PREDECESSOR or READ_SET_CHANGED");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.concurrent_same_predecessor_detected, true);
  assert.equal(artifact.same_predecessor_state_version_detected, true);
  assert.equal(artifact.same_predecessor_state_hash_detected, true);
  assert.equal(artifact.at_most_one_authoritative_allow, true);
  assert.equal(artifact.authoritative_allow_count, 1);
  assert.equal(artifact.competitor_rejected, true);
  assert.equal(artifact.competitor_rejection_code, "READ_SET_CHANGED");
  assert.equal(artifact.competitor_rejected_as_stale_or_read_set_changed, true);
  assert.equal(artifact.second_authoritative_allow_created, false);
  assert.equal(artifact.second_transition_event_created, false);
  assert.equal(artifact.second_effect_evidence_created, false);
  assert.equal(artifact.predecessor_consumed_once, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.concurrent_transition_requests.length, 2);
  assert.equal(artifact.transition_results.filter((result) => result.decision === "ALLOW").length, 1);
  assert.equal(artifact.transition_results.filter((result) => result.decision === "REJECT").length, 1);
  assert.equal(artifact.winner_result.decision, "ALLOW");
  assert.equal(artifact.winner_result.authoritative_event_created, true);
  assert.equal(artifact.winner_result.projection_updated, true);
  assert.equal(artifact.competitor_result.decision, "REJECT");
  assert.equal(["STALE_PREDECESSOR", "READ_SET_CHANGED"].includes(artifact.competitor_result.rejection_code), true);
  assert.equal(artifact.competitor_result.authoritative_event_created, false);
  assert.equal(artifact.competitor_result.projection_updated, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_same_predecessor_detection",
    "require_at_most_one_authoritative_allow",
    "require_competitor_reject_stale_or_read_set_changed",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.contention_gate[key], true, key);
  }

  for (const key of [
    "allow_second_authoritative_allow",
    "allow_second_transition_event",
    "allow_second_projection_update",
    "allow_second_effect_evidence",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation"
  ]) {
    assert.equal(artifact.contention_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT25ConcurrentTransitionContention(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT25ConcurrentTransitionContentionVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.at_most_one_authoritative_allow, true);
  assert.equal(verification.authoritative_allow_count, 1);
  assert.equal(verification.competitor_rejection_code, "READ_SET_CHANGED");
  assert.equal(verification.predecessor_consumed_once, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpTwoAllows = "/tmp/hbce-matrix-eg-t25-two-allows-overclaim.json";
  const twoAllows = {
    ...artifact,
    at_most_one_authoritative_allow: false,
    authoritative_allow_count: 2,
    competitor_rejected: false,
    competitor_rejected_as_stale_or_read_set_changed: false,
    second_authoritative_allow_created: true,
    second_transition_event_created: true,
    contention_record: {
      ...artifact.contention_record,
      allow_count: 2,
      second_authoritative_allow_created: true,
      competitor_rejection_code: null
    },
    competitor_result: {
      ...artifact.competitor_result,
      decision: "ALLOW",
      rejection_code: null,
      authoritative_event_created: true,
      projection_updated: true
    },
    transition_results: [
      artifact.winner_result,
      {
        ...artifact.competitor_result,
        decision: "ALLOW",
        rejection_code: null,
        authoritative_event_created: true,
        projection_updated: true
      }
    ]
  };
  twoAllows.content_sha256 = runtime.sha256Record({ ...twoAllows, content_sha256: null });
  fs.writeFileSync(tmpTwoAllows, JSON.stringify(twoAllows, null, 2));

  const twoAllowsVerification = runtime.verifyEGT25ConcurrentTransitionContention(tmpTwoAllows);
  assert.equal(twoAllowsVerification.verified, false);
  assert.ok(twoAllowsVerification.errors.some((error) => [
    "EG_T25_FIELD_INVALID",
    "EG_T25_ALLOW_COUNT_INVALID",
    "EG_T25_COMPETITOR_REJECT_MISSING",
    "EG_T25_COMPETITOR_REJECTION_CODE_INVALID",
    "EG_T25_COMPETITOR_EFFECT_OVERCLAIM",
    "EG_T25_CONTENTION_ALLOW_COUNT_INVALID",
    "EG_T25_CONTENTION_COMPETITOR_CODE_INVALID",
    "EG_T25_CONTENTION_SECOND_ALLOW_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t25-execution-overclaim.json";
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

  const executionVerification = runtime.verifyEGT25ConcurrentTransitionContention(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => error.code === "EG_T25_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.concurrent_same_predecessor_detected, true);
  assert.equal(evidence.at_most_one_authoritative_allow, true);
  assert.equal(evidence.authoritative_allow_count, 1);
  assert.equal(evidence.competitor_rejected, true);
  assert.equal(evidence.competitor_rejection_code, "READ_SET_CHANGED");
  assert.equal(evidence.second_authoritative_allow_created, false);
  assert.equal(evidence.second_effect_evidence_created, false);
  assert.equal(evidence.eg_t25_runtime_artifact_created, true);

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

console.log("PROG_244_MATRIX_EG_T25_CONCURRENT_TRANSITION_CONTENTION_TEST=PASS");
