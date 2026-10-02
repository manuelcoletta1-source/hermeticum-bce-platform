"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t30-fork-sequence-gap-rejected.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T30_ForkSequenceGapRejected_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T30_PROG-249-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT30ForkSequenceGapRejectedRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "CHECKPOINT_MISMATCH/TAIL_TRUNCATION_DETECTED; fork not accepted as canonical history");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.fork_or_sequence_gap_inserted, true);
  assert.equal(artifact.checkpoint_mismatch_detected, true);
  assert.equal(artifact.tail_truncation_detected, true);
  assert.equal(artifact.sequence_gap_detected, true);
  assert.equal(artifact.fork_detected, true);
  assert.ok(artifact.rejection_codes.includes("CHECKPOINT_MISMATCH"));
  assert.ok(artifact.rejection_codes.includes("TAIL_TRUNCATION_DETECTED"));
  assert.equal(artifact.fork_accepted_as_canonical_history, false);
  assert.equal(artifact.canonical_history_preserved, true);
  assert.equal(artifact.candidate_history_rejected, true);
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
  const detection = runtime.detectForkAndGap({
    checkpoint: artifact.checkpoint_record,
    candidateHistory: artifact.candidate_fork_gap_history_events
  });

  assert.equal(detection.checkpoint_mismatch_detected, true);
  assert.equal(detection.sequence_gap_detected, true);
  assert.equal(detection.fork_detected, true);
  assert.deepEqual(detection.missing_canonical_sequences, [302]);
  assert.ok(detection.canonical_at_same_sequence_changed.includes(301));
  assert.notEqual(detection.candidate_head_hash, artifact.checkpoint_record.canonical_head_hash);

  assert.equal(artifact.violation_evidence_event.violation_type, "CHECKPOINT_MISMATCH_AND_TAIL_TRUNCATION_DETECTED");
  assert.equal(artifact.violation_evidence_event.fork_accepted_as_canonical_history, false);
  assert.equal(artifact.violation_evidence_event.affected_promotion_blocked, true);
  assert.equal(artifact.violation_evidence_event.affected_dispatch_blocked, true);
  assert.equal(artifact.violation_evidence_event.dispatch_performed, false);
  assert.equal(artifact.violation_evidence_event.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_checkpoint_head_match",
    "require_no_sequence_gap",
    "require_no_fork_at_same_sequence",
    "require_reject_noncanonical_fork_history",
    "require_affected_promotion_block",
    "require_affected_dispatch_block",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.history_integrity_gate[key], true, key);
  }

  for (const key of [
    "allow_fork_as_canonical_history",
    "allow_sequence_gap_as_canonical_history",
    "allow_promotion_after_checkpoint_mismatch",
    "allow_dispatch_after_checkpoint_mismatch",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.history_integrity_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT30ForkSequenceGapRejected(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT30ForkSequenceGapRejectedVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.checkpoint_mismatch_detected, true);
  assert.equal(verification.tail_truncation_detected, true);
  assert.equal(verification.sequence_gap_detected, true);
  assert.equal(verification.fork_detected, true);
  assert.equal(verification.fork_accepted_as_canonical_history, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpFork = "/tmp/hbce-matrix-eg-t30-fork-overclaim.json";
  const forkOverclaim = {
    ...artifact,
    checkpoint_mismatch_detected: false,
    tail_truncation_detected: false,
    sequence_gap_detected: false,
    fork_detected: false,
    fork_accepted_as_canonical_history: true,
    candidate_history_rejected: false,
    promotion_allowed: true,
    dispatch_allowed: true,
    history_integrity_gate: {
      ...artifact.history_integrity_gate,
      allow_fork_as_canonical_history: true,
      allow_sequence_gap_as_canonical_history: true,
      allow_promotion_after_checkpoint_mismatch: true,
      allow_dispatch_after_checkpoint_mismatch: true
    },
    violation_evidence_event: {
      ...artifact.violation_evidence_event,
      violation_type: null,
      fork_accepted_as_canonical_history: true,
      affected_promotion_blocked: false,
      affected_dispatch_blocked: false
    }
  };
  forkOverclaim.content_sha256 = runtime.sha256Record({ ...forkOverclaim, content_sha256: null });
  fs.writeFileSync(tmpFork, JSON.stringify(forkOverclaim, null, 2));

  const forkVerification = runtime.verifyEGT30ForkSequenceGapRejected(tmpFork);
  assert.equal(forkVerification.verified, false);
  assert.ok(forkVerification.errors.some((error) => [
    "EG_T30_FIELD_INVALID",
    "EG_T30_VIOLATION_EVENT_TYPE_INVALID",
    "EG_T30_FORK_ACCEPTED_OVERCLAIM",
    "EG_T30_VIOLATION_EVENT_BLOCK_MISSING",
    "EG_T30_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t30-execution-overclaim.json";
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

  const executionVerification = runtime.verifyEGT30ForkSequenceGapRejected(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => error.code === "EG_T30_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.fork_or_sequence_gap_inserted, true);
  assert.equal(evidence.checkpoint_mismatch_detected, true);
  assert.equal(evidence.tail_truncation_detected, true);
  assert.equal(evidence.sequence_gap_detected, true);
  assert.equal(evidence.fork_detected, true);
  assert.ok(evidence.rejection_codes.includes("CHECKPOINT_MISMATCH"));
  assert.ok(evidence.rejection_codes.includes("TAIL_TRUNCATION_DETECTED"));
  assert.equal(evidence.fork_accepted_as_canonical_history, false);
  assert.equal(evidence.canonical_history_preserved, true);
  assert.equal(evidence.candidate_history_rejected, true);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.eg_t30_runtime_artifact_created, true);

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

console.log("PROG_249_MATRIX_EG_T30_FORK_SEQUENCE_GAP_REJECTED_TEST=PASS");
