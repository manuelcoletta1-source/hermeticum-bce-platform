"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t04-close-internal-evidence-unsatisfied-control.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T04_CloseInternalEvidenceUnsatisfiedControl_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T04_PROG-221-evidence_v001.json";

// MATRIX221-T01 artifact exists and loads.
{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT04CloseInternalEvidenceUnsatisfiedControlRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

// MATRIX221-T02 prior closure is open/unverified.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.prior_closure_projection.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.prior_closure_projection.closure_state, "OPEN");
  assert.equal(artifact.prior_closure_projection.validation_state, "UNVERIFIED");
  assert.equal(artifact.prior_closure_projection.closure_version, 1);
}

// MATRIX221-T03 one mandatory C control is unsatisfied.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.mandatory_c_control_unsatisfied, true);
  assert.deepEqual(artifact.unsatisfied_mandatory_c_controls, ["C03"]);
  assert.equal(artifact.unsatisfied_mandatory_c_control_count, 1);
  assert.ok(artifact.closure_attempt.control_set.some((control) => control.control_id === "C03" && control.satisfied === false));
}

// MATRIX221-T04 closure attempt is blocked/unverified.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "BLOCK");
  assert.equal(artifact.validation_result, "UNVERIFIED");
  assert.equal(artifact.reason_code, "MANDATORY_C_CONTROL_UNSATISFIED");
  assert.equal(artifact.closure_attempt_accepted, false);
  assert.equal(artifact.closure_authoritative, false);
}

// MATRIX221-T05 closure remains open and state is preserved.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.internal_closure_state, "OPEN");
  assert.equal(artifact.previous_closure_state_preserved, true);
  assert.equal(artifact.closure_state_changed, false);
  assert.equal(artifact.validation_state_changed, false);
  assert.equal(artifact.closure_version_changed, false);
  assert.equal(
    artifact.resulting_closure_projection.projection_hash,
    artifact.prior_closure_projection.projection_hash
  );
  assert.equal(artifact.resulting_closure_projection.closure_state, "OPEN");
  assert.equal(artifact.resulting_closure_projection.validation_state, "UNVERIFIED");
}

// MATRIX221-T06 rejected closure event is emitted.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_closure_event_emitted, true);
  assert.equal(artifact.rejected_closure_event.event_type, "RejectedClosureEvent");
  assert.equal(artifact.rejected_closure_event.reason_code, "MANDATORY_C_CONTROL_UNSATISFIED");
  assert.deepEqual(artifact.rejected_closure_event.unsatisfied_mandatory_c_controls, ["C03"]);
  assert.equal(artifact.rejected_closure_event.preserved_state_ref, artifact.prior_closure_projection.projection_hash);
}

// MATRIX221-T07 closure gate remains closed.
{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "close_with_unsatisfied_mandatory_c_control_allowed",
    "close_with_unverified_control_allowed",
    "close_without_verifier_record_allowed",
    "close_without_decision_record_allowed",
    "model_generated_closure_authoritative",
    "ui_manual_closure_authoritative",
    "admin_override_closure_authoritative"
  ]) {
    assert.equal(artifact.closure_gate[key], false, key);
  }
}

// MATRIX221-T08 verifier accepts canonical artifact.
{
  const verification = runtime.verifyEGT04CloseInternalEvidenceUnsatisfiedControl(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT04CloseInternalEvidenceUnsatisfiedControlVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "BLOCK");
  assert.equal(verification.validation_result, "UNVERIFIED");
  assert.equal(verification.reason_code, "MANDATORY_C_CONTROL_UNSATISFIED");
  assert.equal(verification.internal_closure_state, "OPEN");
  assert.equal(verification.closure_attempt_accepted, false);
  assert.equal(verification.previous_closure_state_preserved, true);
  assert.deepEqual(verification.unsatisfied_mandatory_c_controls, ["C03"]);
  assert.equal(verification.resulting_closure_state, "OPEN");
  assert.equal(verification.resulting_validation_state, "UNVERIFIED");
}

// MATRIX221-T09 verifier detects overclaim/tamper.
{
  const artifact = runtime.readJson(artifactPath);

  const tmpClosed = "/tmp/hbce-matrix-eg-t04-overclaim-closed.json";
  const closed = {
    ...artifact,
    internal_closure_state: "CLOSED",
    closure_attempt_accepted: true
  };
  closed.content_sha256 = runtime.sha256Record({ ...closed, content_sha256: null });
  fs.writeFileSync(tmpClosed, JSON.stringify(closed, null, 2));

  const closedVerification = runtime.verifyEGT04CloseInternalEvidenceUnsatisfiedControl(tmpClosed);
  assert.equal(closedVerification.verified, false);
  assert.ok(closedVerification.errors.some((error) => error.code === "EG_T04_INTERNAL_CLOSURE_STATE_INVALID" || error.code === "EG_T04_CLOSURE_ACCEPTED_OVERCLAIM"));

  const tmpSatisfied = "/tmp/hbce-matrix-eg-t04-overclaim-all-satisfied.json";
  const satisfied = {
    ...artifact,
    mandatory_c_control_unsatisfied: false,
    unsatisfied_mandatory_c_controls: [],
    unsatisfied_mandatory_c_control_count: 0
  };
  satisfied.content_sha256 = runtime.sha256Record({ ...satisfied, content_sha256: null });
  fs.writeFileSync(tmpSatisfied, JSON.stringify(satisfied, null, 2));

  const satisfiedVerification = runtime.verifyEGT04CloseInternalEvidenceUnsatisfiedControl(tmpSatisfied);
  assert.equal(satisfiedVerification.verified, false);
  assert.ok(satisfiedVerification.errors.some((error) => error.code === "EG_T04_UNSATISFIED_C_CONTROL_NOT_DETECTED" || error.code === "EG_T04_UNSATISFIED_C_CONTROL_ID_MISSING"));
}

// MATRIX221-T10 evidence preserves no-readiness/no-execution boundary.
{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "BLOCK");
  assert.equal(evidence.validation_result, "UNVERIFIED");
  assert.equal(evidence.reason_code, "MANDATORY_C_CONTROL_UNSATISFIED");
  assert.equal(evidence.internal_closure_state, "OPEN");
  assert.equal(evidence.closure_attempt_accepted, false);
  assert.equal(evidence.previous_closure_state_preserved, true);
  assert.equal(evidence.mandatory_c_control_unsatisfied, true);
  assert.deepEqual(evidence.unsatisfied_mandatory_c_controls, ["C03"]);
  assert.equal(evidence.eg_t04_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "internal_evidence_closed",
    "all_c_controls_satisfied",
    "evidence_closure_closed",
    "validation_state_externally_validated",
    "level4_eligible",
    "legal_review_claimed",
    "commercial_release_authorized",
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

console.log("PROG_221_MATRIX_EG_T04_CLOSE_INTERNAL_EVIDENCE_UNSATISFIED_CONTROL_TEST=PASS");
