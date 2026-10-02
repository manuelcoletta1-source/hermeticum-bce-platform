"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t28-tail-truncation-detected.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T28_TailTruncationDetected_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T28_PROG-247-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT28TailTruncationDetectedRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "TAIL_TRUNCATION_DETECTED; head/gap check fails; affected promotion/dispatch blocked");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.unwitnessed_tail_truncated_or_suppressed, true);
  assert.equal(artifact.tail_truncation_detected, true);
  assert.equal(artifact.rejection_code, "TAIL_TRUNCATION_DETECTED");
  assert.equal(artifact.head_check_failed, true);
  assert.equal(artifact.gap_check_failed, true);
  assert.deepEqual(artifact.missing_sequence_numbers, [102]);
  assert.equal(artifact.affected_promotion_blocked, true);
  assert.equal(artifact.affected_dispatch_blocked, true);
  assert.equal(artifact.promotion_allowed, false);
  assert.equal(artifact.dispatch_allowed, false);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.target_receipt_created, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.notEqual(artifact.observed_tail_head_hash, artifact.checkpoint_expectation.expected_tail_head_hash);
  const gapCheck = runtime.detectSequenceGaps({
    checkpoint: artifact.checkpoint_expectation,
    observedTail: artifact.observed_tail_events
  });
  assert.equal(gapCheck.sequence_gap_detected, true);
  assert.deepEqual(gapCheck.missing_sequence_numbers, [102]);
  assert.equal(artifact.violation_evidence_event.violation_type, "TAIL_TRUNCATION_DETECTED");
  assert.equal(artifact.violation_evidence_event.affected_promotion_blocked, true);
  assert.equal(artifact.violation_evidence_event.affected_dispatch_blocked, true);
  assert.equal(artifact.violation_evidence_event.dispatch_performed, false);
  assert.equal(artifact.violation_evidence_event.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_tail_head_match",
    "require_sequence_gap_absent",
    "require_tail_truncation_detection",
    "require_affected_promotion_block",
    "require_affected_dispatch_block",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.tail_integrity_gate[key], true, key);
  }

  for (const key of [
    "allow_promotion_after_tail_truncation",
    "allow_dispatch_after_tail_truncation",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.tail_integrity_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT28TailTruncationDetected(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT28TailTruncationDetectedVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.tail_truncation_detected, true);
  assert.equal(verification.rejection_code, "TAIL_TRUNCATION_DETECTED");
  assert.equal(verification.head_check_failed, true);
  assert.equal(verification.gap_check_failed, true);
  assert.equal(verification.affected_promotion_blocked, true);
  assert.equal(verification.affected_dispatch_blocked, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpPromotion = "/tmp/hbce-matrix-eg-t28-promotion-overclaim.json";
  const promotionOverclaim = {
    ...artifact,
    tail_truncation_detected: false,
    rejection_code: null,
    affected_promotion_blocked: false,
    affected_dispatch_blocked: false,
    promotion_allowed: true,
    dispatch_allowed: true,
    tail_integrity_gate: {
      ...artifact.tail_integrity_gate,
      allow_promotion_after_tail_truncation: true,
      allow_dispatch_after_tail_truncation: true
    },
    violation_evidence_event: {
      ...artifact.violation_evidence_event,
      violation_type: null,
      affected_promotion_blocked: false,
      affected_dispatch_blocked: false
    }
  };
  promotionOverclaim.content_sha256 = runtime.sha256Record({ ...promotionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpPromotion, JSON.stringify(promotionOverclaim, null, 2));

  const promotionVerification = runtime.verifyEGT28TailTruncationDetected(tmpPromotion);
  assert.equal(promotionVerification.verified, false);
  assert.ok(promotionVerification.errors.some((error) => [
    "EG_T28_FIELD_INVALID",
    "EG_T28_VIOLATION_EVENT_TYPE_INVALID",
    "EG_T28_VIOLATION_EVENT_BLOCK_MISSING",
    "EG_T28_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t28-execution-overclaim.json";
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

  const executionVerification = runtime.verifyEGT28TailTruncationDetected(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => error.code === "EG_T28_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.tail_truncation_detected, true);
  assert.equal(evidence.rejection_code, "TAIL_TRUNCATION_DETECTED");
  assert.equal(evidence.head_check_failed, true);
  assert.equal(evidence.gap_check_failed, true);
  assert.deepEqual(evidence.missing_sequence_numbers, [102]);
  assert.equal(evidence.affected_promotion_blocked, true);
  assert.equal(evidence.affected_dispatch_blocked, true);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.eg_t28_runtime_artifact_created, true);

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

console.log("PROG_247_MATRIX_EG_T28_TAIL_TRUNCATION_DETECTED_TEST=PASS");
