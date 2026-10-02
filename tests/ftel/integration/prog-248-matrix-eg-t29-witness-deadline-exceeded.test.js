"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t29-witness-deadline-exceeded.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T29_WitnessDeadlineExceeded_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T29_PROG-248-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT29WitnessDeadlineExceededRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "TAIL_WITNESS_DEADLINE_EXCEEDED; checkpoint becomes STALE; dependent action/promotion blocks");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.witness_receipt_present, false);
  assert.equal(artifact.witness_deadline_exceeded, true);
  assert.equal(artifact.rejection_code, "TAIL_WITNESS_DEADLINE_EXCEEDED");
  assert.equal(artifact.checkpoint_state_before, "PENDING_WITNESS");
  assert.equal(artifact.checkpoint_state_after, "STALE");
  assert.equal(artifact.checkpoint_fresh, false);
  assert.equal(artifact.checkpoint_stale, true);
  assert.equal(artifact.dependent_action_blocked, true);
  assert.equal(artifact.dependent_promotion_blocked, true);
  assert.equal(artifact.dependent_action_allowed, false);
  assert.equal(artifact.dependent_promotion_allowed, false);
  assert.equal(artifact.promotion_allowed, false);
  assert.equal(artifact.dispatch_allowed, false);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.target_receipt_created, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.checkpoint_attempt.elapsed_seconds_since_tail_event, 185);
  assert.equal(artifact.witness_profile.witness_deadline_seconds, 120);
  assert.ok(artifact.checkpoint_attempt.elapsed_seconds_since_tail_event > artifact.witness_profile.witness_deadline_seconds);
  assert.equal(artifact.checkpoint_attempt.deadline_exceeded, true);
  assert.equal(artifact.checkpoint_attempt.checkpoint_state_after, "STALE");
  assert.equal(artifact.deadline_exceeded_event.violation_type, "TAIL_WITNESS_DEADLINE_EXCEEDED");
  assert.equal(artifact.deadline_exceeded_event.dependent_action_blocked, true);
  assert.equal(artifact.deadline_exceeded_event.dependent_promotion_blocked, true);
  assert.equal(artifact.deadline_exceeded_event.dispatch_performed, false);
  assert.equal(artifact.deadline_exceeded_event.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_tail_witness_within_profile_deadline",
    "require_checkpoint_stale_after_deadline_exceeded",
    "require_dependent_action_block_when_stale",
    "require_dependent_promotion_block_when_stale",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.witness_deadline_gate[key], true, key);
  }

  for (const key of [
    "allow_checkpoint_fresh_after_deadline_exceeded",
    "allow_dependent_action_after_stale_checkpoint",
    "allow_dependent_promotion_after_stale_checkpoint",
    "allow_dispatch_after_stale_checkpoint",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.witness_deadline_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT29WitnessDeadlineExceeded(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT29WitnessDeadlineExceededVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.witness_deadline_exceeded, true);
  assert.equal(verification.rejection_code, "TAIL_WITNESS_DEADLINE_EXCEEDED");
  assert.equal(verification.checkpoint_state_after, "STALE");
  assert.equal(verification.dependent_action_blocked, true);
  assert.equal(verification.dependent_promotion_blocked, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpStale = "/tmp/hbce-matrix-eg-t29-stale-overclaim.json";
  const staleOverclaim = {
    ...artifact,
    witness_deadline_exceeded: false,
    rejection_code: null,
    checkpoint_state_after: "FRESH",
    checkpoint_fresh: true,
    checkpoint_stale: false,
    dependent_action_blocked: false,
    dependent_promotion_blocked: false,
    dependent_action_allowed: true,
    dependent_promotion_allowed: true,
    witness_deadline_gate: {
      ...artifact.witness_deadline_gate,
      allow_checkpoint_fresh_after_deadline_exceeded: true,
      allow_dependent_action_after_stale_checkpoint: true,
      allow_dependent_promotion_after_stale_checkpoint: true
    },
    deadline_exceeded_event: {
      ...artifact.deadline_exceeded_event,
      violation_type: null,
      checkpoint_state_after: "FRESH",
      dependent_action_blocked: false,
      dependent_promotion_blocked: false
    }
  };
  staleOverclaim.content_sha256 = runtime.sha256Record({ ...staleOverclaim, content_sha256: null });
  fs.writeFileSync(tmpStale, JSON.stringify(staleOverclaim, null, 2));

  const staleVerification = runtime.verifyEGT29WitnessDeadlineExceeded(tmpStale);
  assert.equal(staleVerification.verified, false);
  assert.ok(staleVerification.errors.some((error) => [
    "EG_T29_FIELD_INVALID",
    "EG_T29_VIOLATION_EVENT_TYPE_INVALID",
    "EG_T29_VIOLATION_EVENT_BLOCK_MISSING",
    "EG_T29_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t29-execution-overclaim.json";
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

  const executionVerification = runtime.verifyEGT29WitnessDeadlineExceeded(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => error.code === "EG_T29_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.witness_deadline_exceeded, true);
  assert.equal(evidence.rejection_code, "TAIL_WITNESS_DEADLINE_EXCEEDED");
  assert.equal(evidence.checkpoint_state_after, "STALE");
  assert.equal(evidence.checkpoint_fresh, false);
  assert.equal(evidence.checkpoint_stale, true);
  assert.equal(evidence.dependent_action_blocked, true);
  assert.equal(evidence.dependent_promotion_blocked, true);
  assert.equal(evidence.dependent_action_allowed, false);
  assert.equal(evidence.dependent_promotion_allowed, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.eg_t29_runtime_artifact_created, true);

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

console.log("PROG_248_MATRIX_EG_T29_WITNESS_DEADLINE_EXCEEDED_TEST=PASS");
