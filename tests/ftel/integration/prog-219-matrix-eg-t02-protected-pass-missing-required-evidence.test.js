"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t02-protected-pass-missing-required-evidence.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T02_ProtectedPassMissingRequiredEvidence_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T02_PROG-219-evidence_v001.json";

// MATRIX219-T01 artifact exists and loads.
{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT02ProtectedPassMissingRequiredEvidenceRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

// MATRIX219-T02 prior control state is pending/unverified.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.prior_control_projection.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.prior_control_projection.control_id, "C01");
  assert.equal(artifact.prior_control_projection.namespace, "CONTROL_SATISFACTION_STATE");
  assert.equal(artifact.prior_control_projection.control_state, "PENDING");
  assert.equal(artifact.prior_control_projection.validation_state, "UNVERIFIED");
  assert.equal(artifact.prior_control_projection.state_version, 1);
}

// MATRIX219-T03 protected PASS attempt lacks mandatory evidence.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.pass_attempt.attempt_type, "PROTECTED_PASS_ASSERTION");
  assert.equal(artifact.pass_attempt.attempted_from, "PENDING");
  assert.equal(artifact.pass_attempt.attempted_to, "PASS");
  assert.deepEqual(artifact.pass_attempt.provided_evidence_refs, []);
  assert.deepEqual(artifact.pass_attempt.missing_required_evidence_types, runtime.REQUIRED_EVIDENCE_TYPES);
}

// MATRIX219-T04 attempt is rejected/unverified with MISSING_REQUIRED_EVIDENCE.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "REJECT");
  assert.equal(artifact.validation_result, "UNVERIFIED");
  assert.equal(artifact.reason_code, "MISSING_REQUIRED_EVIDENCE");
  assert.equal(artifact.protected_pass_accepted, false);
  assert.equal(artifact.pass_authoritative, false);
}

// MATRIX219-T05 previous control state is preserved.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.previous_control_state_preserved, true);
  assert.equal(artifact.control_state_changed, false);
  assert.equal(artifact.validation_state_changed, false);
  assert.equal(artifact.state_version_changed, false);
  assert.equal(
    artifact.resulting_control_projection.projection_hash,
    artifact.prior_control_projection.projection_hash
  );
  assert.equal(artifact.resulting_control_projection.control_state, "PENDING");
  assert.equal(artifact.resulting_control_projection.validation_state, "UNVERIFIED");
}

// MATRIX219-T06 rejected validation event is emitted.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_validation_event_emitted, true);
  assert.equal(artifact.rejected_validation_event.event_type, "RejectedValidationEvent");
  assert.equal(artifact.rejected_validation_event.reason_code, "MISSING_REQUIRED_EVIDENCE");
  assert.equal(artifact.rejected_validation_event.validation_result, "UNVERIFIED");
  assert.equal(artifact.rejected_validation_event.preserved_state_ref, artifact.prior_control_projection.projection_hash);
}

// MATRIX219-T07 evidence gate remains closed.
{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "pass_without_control_spec_allowed",
    "pass_without_execution_trace_allowed",
    "pass_without_verifier_record_allowed",
    "pass_without_evidence_hash_allowed",
    "pass_without_human_acceptance_allowed",
    "model_generated_pass_authoritative",
    "ui_manual_pass_authoritative",
    "admin_override_pass_authoritative"
  ]) {
    assert.equal(artifact.evidence_gate[key], false, key);
  }
}

// MATRIX219-T08 verifier accepts canonical artifact.
{
  const verification = runtime.verifyEGT02ProtectedPassMissingRequiredEvidence(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT02ProtectedPassMissingRequiredEvidenceVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "REJECT");
  assert.equal(verification.validation_result, "UNVERIFIED");
  assert.equal(verification.reason_code, "MISSING_REQUIRED_EVIDENCE");
  assert.equal(verification.protected_pass_accepted, false);
  assert.equal(verification.previous_control_state_preserved, true);
  assert.equal(verification.resulting_control_state, "PENDING");
  assert.equal(verification.resulting_validation_state, "UNVERIFIED");
}

// MATRIX219-T09 verifier detects overclaim/tamper.
{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t02-overclaim-pass-accepted.json";
  const accepted = {
    ...artifact,
    protected_pass_accepted: true
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT02ProtectedPassMissingRequiredEvidence(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => error.code === "EG_T02_PROTECTED_PASS_ACCEPTED_OVERCLAIM"));

  const tmpChanged = "/tmp/hbce-matrix-eg-t02-overclaim-control-pass.json";
  const changed = {
    ...artifact,
    resulting_control_projection: {
      ...artifact.resulting_control_projection,
      control_state: "PASS",
      validation_state: "PASS"
    }
  };
  changed.content_sha256 = runtime.sha256Record({ ...changed, content_sha256: null });
  fs.writeFileSync(tmpChanged, JSON.stringify(changed, null, 2));

  const changedVerification = runtime.verifyEGT02ProtectedPassMissingRequiredEvidence(tmpChanged);
  assert.equal(changedVerification.verified, false);
  assert.ok(changedVerification.errors.some((error) => error.code === "EG_T02_RESULTING_CONTROL_PROJECTION_HASH_CHANGED" || error.code === "EG_T02_RESULTING_CONTROL_STATE_INVALID"));
}

// MATRIX219-T10 evidence preserves no-readiness/no-execution boundary.
{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "REJECT");
  assert.equal(evidence.validation_result, "UNVERIFIED");
  assert.equal(evidence.reason_code, "MISSING_REQUIRED_EVIDENCE");
  assert.equal(evidence.protected_pass_accepted, false);
  assert.equal(evidence.previous_control_state_preserved, true);
  assert.equal(evidence.resulting_control_state, "PENDING");
  assert.equal(evidence.resulting_validation_state, "UNVERIFIED");
  assert.equal(evidence.eg_t02_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "control_c01_satisfied",
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

console.log("PROG_219_MATRIX_EG_T02_PROTECTED_PASS_MISSING_REQUIRED_EVIDENCE_TEST=PASS");
