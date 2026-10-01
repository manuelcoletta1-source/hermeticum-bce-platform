"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t15-rejected-mutation-attempt.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T15_RejectedMutationAttempt_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T15_PROG-234-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT15RejectedMutationAttemptRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "RejectedTransitionEvent emitted; previous authoritative state preserved");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_mutation_attempt_detected, true);
  assert.equal(artifact.mutation_rejected, true);
  assert.equal(artifact.rejection_decision_record_created, true);
  assert.equal(artifact.rejected_transition_event_emitted, true);
  assert.equal(artifact.previous_authoritative_state_preserved, true);
  assert.equal(artifact.previous_projection_hash_preserved, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.previous_state, "BLOCKED");
  assert.equal(artifact.attempted_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.resulting_state, "BLOCKED");
  assert.equal(artifact.previous_state_version, 3);
  assert.equal(artifact.attempted_state_version, 4);
  assert.equal(artifact.resulting_state_version, 3);
  assert.equal(artifact.projection_updated, false);
  assert.equal(artifact.authoritative_state_changed, false);
  assert.equal(artifact.state_changed, false);
  assert.equal(artifact.state_version_changed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_transition_event.event_type, "RejectedTransitionEvent");
  assert.equal(artifact.rejected_transition_event.decision_result, "REJECT");
  assert.equal(artifact.rejected_transition_event.validation_result, "UNVERIFIED");
  assert.equal(artifact.rejected_transition_event.reason_code, "REJECTED_MUTATION_ATTEMPT");
  assert.equal(artifact.rejected_transition_event.resulting_state, artifact.previous_authoritative_state_projection.state);
  assert.equal(artifact.rejected_transition_event.resulting_state_version, artifact.previous_authoritative_state_projection.state_version);
  assert.equal(artifact.rejected_transition_event.decision_record_sha256, artifact.rejection_decision_record.decision_record_sha256);
  assert.equal(artifact.preserved_authoritative_state_record.preserved_projection_hash, artifact.previous_authoritative_state_projection.projection_hash);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_rejected_transition_event",
    "require_previous_authoritative_state_preserved",
    "require_projection_update_blocked"
  ]) {
    assert.equal(artifact.rejection_gate[key], true, key);
  }

  for (const key of [
    "accept_rejected_mutation_as_state_allowed",
    "projection_update_allowed",
    "authoritative_state_mutation_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.rejection_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT15RejectedMutationAttempt(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT15RejectedMutationAttemptVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.rejected_mutation_attempt_detected, true);
  assert.equal(verification.mutation_rejected, true);
  assert.equal(verification.rejected_transition_event_emitted, true);
  assert.equal(verification.previous_authoritative_state_preserved, true);
  assert.equal(verification.previous_state, "BLOCKED");
  assert.equal(verification.attempted_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(verification.resulting_state, "BLOCKED");
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t15-rejected-mutation-accepted-overclaim.json";
  const accepted = {
    ...artifact,
    mutation_rejected: false,
    previous_authoritative_state_preserved: false,
    resulting_state: "RELEASE_CLEAN_ELIGIBLE",
    state_changed: true
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT15RejectedMutationAttempt(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => error.code === "EG_T15_FIELD_INVALID"));

  const tmpProjectionUpdate = "/tmp/hbce-matrix-eg-t15-projection-update-overclaim.json";
  const projectionUpdate = {
    ...artifact,
    projection_updated: true,
    authoritative_state_changed: true,
    state_version_changed: true
  };
  projectionUpdate.content_sha256 = runtime.sha256Record({ ...projectionUpdate, content_sha256: null });
  fs.writeFileSync(tmpProjectionUpdate, JSON.stringify(projectionUpdate, null, 2));

  const projectionUpdateVerification = runtime.verifyEGT15RejectedMutationAttempt(tmpProjectionUpdate);
  assert.equal(projectionUpdateVerification.verified, false);
  assert.ok(projectionUpdateVerification.errors.some((error) => error.code === "EG_T15_FIELD_INVALID"));
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpExecution = "/tmp/hbce-matrix-eg-t15-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    rejection_gate: {
      ...artifact.rejection_gate,
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

  const executionVerification = runtime.verifyEGT15RejectedMutationAttempt(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T15_GATE_OVERCLAIM",
    "EG_T15_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.rejected_mutation_attempt_detected, true);
  assert.equal(evidence.mutation_rejected, true);
  assert.equal(evidence.rejected_transition_event_emitted, true);
  assert.equal(evidence.previous_authoritative_state_preserved, true);
  assert.equal(evidence.previous_state, "BLOCKED");
  assert.equal(evidence.attempted_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(evidence.resulting_state, "BLOCKED");
  assert.equal(evidence.projection_updated, false);
  assert.equal(evidence.authoritative_state_changed, false);
  assert.equal(evidence.eg_t15_runtime_artifact_created, true);

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

console.log("PROG_234_MATRIX_EG_T15_REJECTED_MUTATION_ATTEMPT_TEST=PASS");
