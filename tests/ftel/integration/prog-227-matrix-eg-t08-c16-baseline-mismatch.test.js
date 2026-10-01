"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t08-c16-baseline-mismatch.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T08_C16BaselineMismatch_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T08_PROG-227-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT08C16BaselineMismatchRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.current_baseline.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.current_baseline.baseline_id, "MATRIX-BASELINE-CURRENT-2026-10-01-R3");
  assert.equal(artifact.current_baseline.baseline_version, "V1.3-R3");
  assert.equal(typeof artifact.current_baseline.baseline_sha256, "string");
  assert.equal(artifact.current_baseline.baseline_sha256.length, 64);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.c16_baseline_claim.validation_scope, "C16_EXTERNAL_VALIDATION");
  assert.equal(artifact.c16_baseline_claim.claimed_baseline_id, "MATRIX-BASELINE-C16-OBSERVED-2026-09-30-R2");
  assert.equal(artifact.c16_baseline_claim.claimed_baseline_version, "V1.2-R2");
  assert.equal(typeof artifact.c16_baseline_claim.claimed_baseline_sha256, "string");
  assert.equal(artifact.c16_baseline_claim.claimed_baseline_sha256.length, 64);
  assert.notEqual(
    artifact.current_baseline.baseline_sha256,
    artifact.c16_baseline_claim.claimed_baseline_sha256
  );
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.c16_validation_attempt.attempt_type, "C16_EXTERNAL_VALIDATION_BASELINE_BINDING");
  assert.equal(artifact.c16_validation_attempt.attempted_from, "INTERNAL_ONLY");
  assert.equal(artifact.c16_validation_attempt.attempted_to, "EXTERNALLY_VALIDATED");
  assert.equal(artifact.c16_validation_attempt.baseline_match, false);
  assert.equal(artifact.baseline_match, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "REJECT");
  assert.equal(artifact.validation_result, "UNVERIFIED");
  assert.equal(artifact.reason_code, "BASELINE_MISMATCH");
  assert.equal(artifact.c16_evidence_accepted, false);
  assert.equal(artifact.c16_authoritative, false);
  assert.equal(artifact.c16_external_validation_completed, false);
  assert.equal(artifact.external_validation_accepted, false);
  assert.equal(artifact.externally_validated, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.validation_state, "INTERNAL_ONLY");
  assert.equal(artifact.attempted_validation_state, "EXTERNALLY_VALIDATED");
  assert.equal(artifact.c16_state, "NOT_ACCEPTED");
  assert.equal(artifact.previous_validation_state_preserved, true);
  assert.equal(artifact.validation_state_changed, false);
  assert.equal(artifact.c16_state_changed, false);
  assert.equal(artifact.state_version_changed, false);
  assert.equal(
    artifact.resulting_validation_projection.projection_hash,
    artifact.prior_validation_projection.projection_hash
  );
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_validation_event_emitted, true);
  assert.equal(artifact.rejected_validation_event.event_type, "RejectedC16BaselineValidationEvent");
  assert.equal(artifact.rejected_validation_event.reason_code, "BASELINE_MISMATCH");
  assert.equal(artifact.rejected_validation_event.preserved_state_ref, artifact.prior_validation_projection.projection_hash);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "accept_c16_with_baseline_mismatch_allowed",
    "promote_externally_validated_with_mismatch_allowed",
    "verifier_override_baseline_mismatch_allowed",
    "model_repair_baseline_mismatch_authoritative",
    "ui_manual_acceptance_authoritative",
    "admin_override_authoritative"
  ]) {
    assert.equal(artifact.baseline_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT08C16BaselineMismatch(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT08C16BaselineMismatchVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "REJECT");
  assert.equal(verification.validation_result, "UNVERIFIED");
  assert.equal(verification.reason_code, "BASELINE_MISMATCH");
  assert.equal(verification.baseline_match, false);
  assert.equal(verification.c16_evidence_accepted, false);
  assert.equal(verification.externally_validated, false);
  assert.equal(verification.previous_validation_state_preserved, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t08-overclaim-accepted.json";
  const accepted = {
    ...artifact,
    baseline_match: true,
    c16_evidence_accepted: true,
    external_validation_accepted: true,
    externally_validated: true
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT08C16BaselineMismatch(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => [
    "EG_T08_BASELINE_MATCH_OVERCLAIM",
    "EG_T08_C16_EVIDENCE_ACCEPTED_OVERCLAIM",
    "EG_T08_EXTERNAL_VALIDATION_ACCEPTED_OVERCLAIM",
    "EG_T08_EXTERNALLY_VALIDATED_OVERCLAIM"
  ].includes(error.code)));

  const tmpRuntime = "/tmp/hbce-matrix-eg-t08-overclaim-runtime.json";
  const runtimeOverclaim = {
    ...artifact,
    runtime_claims: {
      ...artifact.runtime_claims,
      externally_validated: true,
      c16_external_validation_completed: true
    }
  };
  runtimeOverclaim.content_sha256 = runtime.sha256Record({ ...runtimeOverclaim, content_sha256: null });
  fs.writeFileSync(tmpRuntime, JSON.stringify(runtimeOverclaim, null, 2));

  const runtimeVerification = runtime.verifyEGT08C16BaselineMismatch(tmpRuntime);
  assert.equal(runtimeVerification.verified, false);
  assert.ok(runtimeVerification.errors.some((error) => error.code === "EG_T08_RUNTIME_CLAIM_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "REJECT");
  assert.equal(evidence.validation_result, "UNVERIFIED");
  assert.equal(evidence.reason_code, "BASELINE_MISMATCH");
  assert.equal(evidence.baseline_match, false);
  assert.equal(evidence.c16_evidence_accepted, false);
  assert.equal(evidence.c16_authoritative, false);
  assert.equal(evidence.c16_external_validation_completed, false);
  assert.equal(evidence.external_validation_accepted, false);
  assert.equal(evidence.externally_validated, false);
  assert.equal(evidence.previous_validation_state_preserved, true);
  assert.equal(evidence.eg_t08_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
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

console.log("PROG_227_MATRIX_EG_T08_C16_BASELINE_MISMATCH_TEST=PASS");
