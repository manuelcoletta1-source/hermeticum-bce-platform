"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t03-evidence-hash-mismatch.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T03_EvidenceHashMismatch_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T03_PROG-220-evidence_v001.json";

// MATRIX220-T01 artifact exists and loads.
{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT03EvidenceHashMismatchRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

// MATRIX220-T02 prior control state is pending/unverified.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.prior_control_projection.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.prior_control_projection.control_id, "C01");
  assert.equal(artifact.prior_control_projection.control_state, "PENDING");
  assert.equal(artifact.prior_control_projection.validation_state, "UNVERIFIED");
  assert.equal(artifact.prior_control_projection.state_version, 1);
}

// MATRIX220-T03 evidence hash mismatch is present.
{
  const artifact = runtime.readJson(artifactPath);

  assert.notEqual(artifact.expected_evidence_sha256, artifact.supplied_evidence_sha256);
  assert.equal(artifact.hash_attempt.hash_match, false);
  assert.equal(artifact.hash_mismatch_detected, true);
  assert.equal(artifact.mismatch_classification, "EVIDENCE_HASH_MISMATCH");
}

// MATRIX220-T04 mismatch is rejected with EVIDENCE_HASH_MISMATCH.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "REJECT");
  assert.equal(artifact.validation_result, "UNVERIFIED");
  assert.equal(artifact.reason_code, "EVIDENCE_HASH_MISMATCH");
  assert.equal(artifact.evidence_hash_match, false);
  assert.equal(artifact.evidence_integrity_verified, false);
  assert.equal(artifact.evidence_accepted, false);
  assert.equal(artifact.evidence_authoritative, false);
}

// MATRIX220-T05 previous control state is preserved.
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

// MATRIX220-T06 rejected validation event is emitted.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_validation_event_emitted, true);
  assert.equal(artifact.rejected_validation_event.event_type, "RejectedValidationEvent");
  assert.equal(artifact.rejected_validation_event.reason_code, "EVIDENCE_HASH_MISMATCH");
  assert.equal(artifact.rejected_validation_event.expected_evidence_sha256, artifact.expected_evidence_sha256);
  assert.equal(artifact.rejected_validation_event.supplied_evidence_sha256, artifact.supplied_evidence_sha256);
}

// MATRIX220-T07 integrity gate remains closed.
{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "accept_mismatched_hash_allowed",
    "accept_unbound_evidence_allowed",
    "accept_tampered_payload_allowed",
    "verifier_override_allowed",
    "model_repair_of_hash_allowed",
    "ui_manual_hash_acceptance_allowed",
    "admin_override_hash_acceptance_allowed"
  ]) {
    assert.equal(artifact.integrity_gate[key], false, key);
  }
}

// MATRIX220-T08 verifier accepts canonical artifact.
{
  const verification = runtime.verifyEGT03EvidenceHashMismatch(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT03EvidenceHashMismatchVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "REJECT");
  assert.equal(verification.validation_result, "UNVERIFIED");
  assert.equal(verification.reason_code, "EVIDENCE_HASH_MISMATCH");
  assert.equal(verification.evidence_hash_match, false);
  assert.equal(verification.evidence_integrity_verified, false);
  assert.equal(verification.evidence_accepted, false);
  assert.equal(verification.previous_control_state_preserved, true);
  assert.equal(verification.resulting_control_state, "PENDING");
  assert.equal(verification.resulting_validation_state, "UNVERIFIED");
}

// MATRIX220-T09 verifier detects overclaim/tamper.
{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t03-overclaim-evidence-accepted.json";
  const accepted = {
    ...artifact,
    evidence_accepted: true
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT03EvidenceHashMismatch(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => error.code === "EG_T03_EVIDENCE_ACCEPTED_OVERCLAIM"));

  const tmpHashMatch = "/tmp/hbce-matrix-eg-t03-overclaim-hash-match.json";
  const hashMatch = {
    ...artifact,
    supplied_evidence_sha256: artifact.expected_evidence_sha256,
    evidence_hash_match: true
  };
  hashMatch.content_sha256 = runtime.sha256Record({ ...hashMatch, content_sha256: null });
  fs.writeFileSync(tmpHashMatch, JSON.stringify(hashMatch, null, 2));

  const hashMatchVerification = runtime.verifyEGT03EvidenceHashMismatch(tmpHashMatch);
  assert.equal(hashMatchVerification.verified, false);
  assert.ok(hashMatchVerification.errors.some((error) => error.code === "EG_T03_HASH_MATCH_OVERCLAIM" || error.code === "EG_T03_HASH_MISMATCH_NOT_PRESENT"));
}

// MATRIX220-T10 evidence preserves no-readiness/no-execution boundary.
{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "REJECT");
  assert.equal(evidence.validation_result, "UNVERIFIED");
  assert.equal(evidence.reason_code, "EVIDENCE_HASH_MISMATCH");
  assert.equal(evidence.evidence_hash_match, false);
  assert.equal(evidence.evidence_integrity_verified, false);
  assert.equal(evidence.evidence_accepted, false);
  assert.equal(evidence.previous_control_state_preserved, true);
  assert.equal(evidence.eg_t03_runtime_artifact_created, true);

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

console.log("PROG_220_MATRIX_EG_T03_EVIDENCE_HASH_MISMATCH_TEST=PASS");
