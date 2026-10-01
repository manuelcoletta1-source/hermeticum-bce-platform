"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t06-externally-validated-without-c16.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T06_ExternallyValidatedWithoutC16_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T06_PROG-223-evidence_v001.json";

// MATRIX223-T01 artifact exists and loads.
{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT06ExternallyValidatedWithoutC16RuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

// MATRIX223-T02 prior validation state is not externally validated.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.prior_validation_projection.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.prior_validation_projection.validation_state, "NOT_EXTERNALLY_VALIDATED");
  assert.equal(artifact.prior_validation_projection.release_state, "BLOCKED");
  assert.equal(artifact.prior_validation_projection.state_version, 1);
}

// MATRIX223-T03 attempted promotion targets EXTERNALLY_VALIDATED without C16.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.promotion_attempt.attempt_type, "EXTERNAL_VALIDATION_STATE_PROMOTION");
  assert.equal(artifact.promotion_attempt.attempted_from, "NOT_EXTERNALLY_VALIDATED");
  assert.equal(artifact.promotion_attempt.attempted_to, "EXTERNALLY_VALIDATED");
  assert.equal(artifact.promotion_attempt.c16_external_validation_state.c16_state, "NOT_PERFORMED");
  assert.equal(artifact.promotion_attempt.c16_external_validation_state.external_validation_accepted, false);
  assert.ok(artifact.promotion_attempt.missing_preconditions.includes("C16_EXTERNAL_VALIDATION_ACCEPTED"));
}

// MATRIX223-T04 promotion is blocked.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "BLOCK");
  assert.equal(artifact.validation_result, "UNVERIFIED");
  assert.equal(artifact.reason_code, "C16_EXTERNAL_VALIDATION_NOT_PERFORMED");
  assert.equal(artifact.external_validation_promotion_accepted, false);
  assert.equal(artifact.external_validation_authoritative, false);
}

// MATRIX223-T05 validation state does not advance.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.validation_state, "NOT_EXTERNALLY_VALIDATED");
  assert.equal(artifact.externally_validated, false);
  assert.equal(artifact.previous_validation_state_preserved, true);
  assert.equal(artifact.validation_state_changed, false);
  assert.equal(artifact.release_state_changed, false);
  assert.equal(artifact.state_version_changed, false);
  assert.equal(
    artifact.resulting_validation_projection.projection_hash,
    artifact.prior_validation_projection.projection_hash
  );
  assert.equal(artifact.resulting_validation_projection.validation_state, "NOT_EXTERNALLY_VALIDATED");
  assert.equal(artifact.resulting_validation_projection.release_state, "BLOCKED");
}

// MATRIX223-T06 rejected validation event is emitted.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_validation_event_emitted, true);
  assert.equal(artifact.rejected_validation_event.event_type, "RejectedExternalValidationPromotionEvent");
  assert.equal(artifact.rejected_validation_event.reason_code, "C16_EXTERNAL_VALIDATION_NOT_PERFORMED");
  assert.ok(artifact.rejected_validation_event.missing_preconditions.includes("C16_EXTERNAL_VALIDATION_ACCEPTED"));
  assert.equal(artifact.rejected_validation_event.preserved_state_ref, artifact.prior_validation_projection.projection_hash);
}

// MATRIX223-T07 validation gate remains closed.
{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "promote_without_c16_allowed",
    "promote_without_external_validator_allowed",
    "promote_without_validator_independence_allowed",
    "promote_without_report_hash_allowed",
    "model_generated_external_validation_authoritative",
    "ui_manual_external_validation_authoritative",
    "admin_override_external_validation_authoritative"
  ]) {
    assert.equal(artifact.validation_gate[key], false, key);
  }
}

// MATRIX223-T08 verifier accepts canonical artifact.
{
  const verification = runtime.verifyEGT06ExternallyValidatedWithoutC16(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT06ExternallyValidatedWithoutC16VerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "BLOCK");
  assert.equal(verification.validation_result, "UNVERIFIED");
  assert.equal(verification.reason_code, "C16_EXTERNAL_VALIDATION_NOT_PERFORMED");
  assert.equal(verification.validation_state, "NOT_EXTERNALLY_VALIDATED");
  assert.equal(verification.attempted_validation_state, "EXTERNALLY_VALIDATED");
  assert.equal(verification.external_validation_promotion_accepted, false);
  assert.equal(verification.previous_validation_state_preserved, true);
  assert.equal(verification.c16_performed, false);
  assert.equal(verification.resulting_validation_state, "NOT_EXTERNALLY_VALIDATED");
  assert.equal(verification.resulting_release_state, "BLOCKED");
}

// MATRIX223-T09 verifier detects overclaim/tamper.
{
  const artifact = runtime.readJson(artifactPath);

  const tmpValidated = "/tmp/hbce-matrix-eg-t06-overclaim-externally-validated.json";
  const validated = {
    ...artifact,
    validation_state: "EXTERNALLY_VALIDATED",
    externally_validated: true,
    external_validation_promotion_accepted: true
  };
  validated.content_sha256 = runtime.sha256Record({ ...validated, content_sha256: null });
  fs.writeFileSync(tmpValidated, JSON.stringify(validated, null, 2));

  const validatedVerification = runtime.verifyEGT06ExternallyValidatedWithoutC16(tmpValidated);
  assert.equal(validatedVerification.verified, false);
  assert.ok(validatedVerification.errors.some((error) => [
    "EG_T06_VALIDATION_STATE_INVALID",
    "EG_T06_EXTERNALLY_VALIDATED_OVERCLAIM",
    "EG_T06_EXTERNAL_VALIDATION_PROMOTION_ACCEPTED_OVERCLAIM"
  ].includes(error.code)));

  const tmpC16Performed = "/tmp/hbce-matrix-eg-t06-overclaim-c16-performed.json";
  const c16Performed = {
    ...artifact,
    c16_performed: true,
    c16_external_validation_accepted: true
  };
  c16Performed.content_sha256 = runtime.sha256Record({ ...c16Performed, content_sha256: null });
  fs.writeFileSync(tmpC16Performed, JSON.stringify(c16Performed, null, 2));

  const c16Verification = runtime.verifyEGT06ExternallyValidatedWithoutC16(tmpC16Performed);
  assert.equal(c16Verification.verified, false);
  assert.ok(c16Verification.errors.some((error) => [
    "EG_T06_C16_PERFORMED_OVERCLAIM",
    "EG_T06_C16_ACCEPTED_OVERCLAIM"
  ].includes(error.code)));
}

// MATRIX223-T10 evidence preserves no-readiness/no-execution boundary.
{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "BLOCK");
  assert.equal(evidence.validation_result, "UNVERIFIED");
  assert.equal(evidence.reason_code, "C16_EXTERNAL_VALIDATION_NOT_PERFORMED");
  assert.equal(evidence.validation_state, "NOT_EXTERNALLY_VALIDATED");
  assert.equal(evidence.attempted_validation_state, "EXTERNALLY_VALIDATED");
  assert.equal(evidence.external_validation_promotion_accepted, false);
  assert.equal(evidence.previous_validation_state_preserved, true);
  assert.equal(evidence.c16_performed, false);
  assert.equal(evidence.externally_validated, false);
  assert.equal(evidence.eg_t06_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "c16_external_validation_completed",
    "validation_state_externally_validated",
    "release_clean_eligible",
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

console.log("PROG_223_MATRIX_EG_T06_EXTERNALLY_VALIDATED_WITHOUT_C16_TEST=PASS");
