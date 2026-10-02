"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t27-read-set-changed.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T27_ReadSetChanged_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T27_PROG-246-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT27ReadSetChangedRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "REJECT + READ_SET_CHANGED; no authoritative transition");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.read_set_changed_detected, true);
  assert.equal(artifact.rejection_result, "REJECT");
  assert.equal(artifact.rejection_code, "READ_SET_CHANGED");
  assert.equal(artifact.mandate_changed, true);
  assert.equal(artifact.evidence_changed, true);
  assert.equal(artifact.checkpoint_changed, true);
  assert.equal(artifact.authoritative_transition_created, false);
  assert.equal(artifact.transition_event_created, false);
  assert.equal(artifact.projection_updated, false);
  assert.equal(artifact.effect_evidence_created, false);
  assert.equal(artifact.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.duplicate_effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);
  const changes = runtime.detectReadSetChanges({
    evaluatedInputSet: artifact.evaluated_input_set,
    commitInputSet: artifact.commit_input_set
  });

  assert.notEqual(artifact.evaluated_input_set.read_set_digest, artifact.commit_input_set.read_set_digest);
  assert.equal(changes.length, artifact.changed_field_count);
  assert.ok(changes.some((change) => change.reason_code === "MANDATE_CHANGED"));
  assert.ok(changes.some((change) => change.reason_code === "EVIDENCE_CHANGED"));
  assert.ok(changes.some((change) => change.reason_code === "CHECKPOINT_CHANGED"));
  assert.equal(artifact.rejected_transition_record.rejection_code, "READ_SET_CHANGED");
  assert.equal(artifact.rejected_transition_record.authoritative_transition_created, false);
  assert.equal(artifact.rejected_transition_record.transition_event_created, false);
  assert.equal(artifact.rejected_transition_record.projection_updated, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_commit_read_set_equal_evaluation_read_set",
    "require_reject_changed_read_set",
    "require_no_authoritative_transition",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.read_set_gate[key], true, key);
  }

  for (const key of [
    "allow_commit_after_read_set_change",
    "allow_authoritative_transition_creation",
    "allow_transition_event_creation",
    "allow_projection_update",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.read_set_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT27ReadSetChanged(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT27ReadSetChangedVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.read_set_changed_detected, true);
  assert.equal(verification.rejection_code, "READ_SET_CHANGED");
  assert.equal(verification.authoritative_transition_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpCommit = "/tmp/hbce-matrix-eg-t27-commit-overclaim.json";
  const commitOverclaim = {
    ...artifact,
    rejection_result: "ALLOW",
    rejection_code: null,
    authoritative_transition_created: true,
    transition_event_created: true,
    projection_updated: true,
    read_set_gate: {
      ...artifact.read_set_gate,
      allow_commit_after_read_set_change: true,
      allow_authoritative_transition_creation: true,
      allow_transition_event_creation: true,
      allow_projection_update: true
    },
    rejected_transition_record: {
      ...artifact.rejected_transition_record,
      rejection_code: null,
      authoritative_transition_created: true,
      transition_event_created: true,
      projection_updated: true
    }
  };
  commitOverclaim.content_sha256 = runtime.sha256Record({ ...commitOverclaim, content_sha256: null });
  fs.writeFileSync(tmpCommit, JSON.stringify(commitOverclaim, null, 2));

  const commitVerification = runtime.verifyEGT27ReadSetChanged(tmpCommit);
  assert.equal(commitVerification.verified, false);
  assert.ok(commitVerification.errors.some((error) => [
    "EG_T27_FIELD_INVALID",
    "EG_T27_REJECTION_CODE_INVALID",
    "EG_T27_REJECTED_RECORD_EFFECT_OVERCLAIM",
    "EG_T27_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t27-execution-overclaim.json";
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

  const executionVerification = runtime.verifyEGT27ReadSetChanged(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => error.code === "EG_T27_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.read_set_changed_detected, true);
  assert.equal(evidence.rejection_code, "READ_SET_CHANGED");
  assert.equal(evidence.mandate_changed, true);
  assert.equal(evidence.evidence_changed, true);
  assert.equal(evidence.checkpoint_changed, true);
  assert.equal(evidence.authoritative_transition_created, false);
  assert.equal(evidence.transition_event_created, false);
  assert.equal(evidence.projection_updated, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.eg_t27_runtime_artifact_created, true);

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

console.log("PROG_246_MATRIX_EG_T27_READ_SET_CHANGED_TEST=PASS");
