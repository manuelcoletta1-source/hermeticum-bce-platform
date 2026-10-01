"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t05-release-clean-without-internal-closure.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T05_ReleaseCleanWithoutInternalClosure_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T05_PROG-222-evidence_v001.json";

// MATRIX222-T01 artifact exists and loads.
{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT05ReleaseCleanWithoutInternalClosureRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

// MATRIX222-T02 prior release state is blocked/unverified.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.prior_release_projection.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.prior_release_projection.release_state, "BLOCKED");
  assert.equal(artifact.prior_release_projection.validation_state, "UNVERIFIED");
  assert.equal(artifact.prior_release_projection.state_version, 1);
}

// MATRIX222-T03 attempted promotion targets RELEASE_CLEAN_ELIGIBLE.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.promotion_attempt.attempt_type, "RELEASE_STATE_PROMOTION");
  assert.equal(artifact.promotion_attempt.attempted_from, "BLOCKED");
  assert.equal(artifact.promotion_attempt.attempted_to, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.promotion_attempt.internal_closure_state.closure_state, "OPEN");
  assert.equal(artifact.promotion_attempt.internal_closure_state.evidence_closure_closed, false);
  assert.ok(artifact.promotion_attempt.missing_preconditions.includes("INTERNAL_EVIDENCE_CLOSURE_CLOSED"));
}

// MATRIX222-T04 promotion is blocked.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "BLOCK");
  assert.equal(artifact.validation_result, "UNVERIFIED");
  assert.equal(artifact.reason_code, "INTERNAL_EVIDENCE_CLOSURE_NOT_CLOSED");
  assert.equal(artifact.release_promotion_accepted, false);
  assert.equal(artifact.release_promotion_authoritative, false);
}

// MATRIX222-T05 release state remains blocked.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.release_state, "BLOCKED");
  assert.equal(artifact.release_clean_eligible, false);
  assert.equal(artifact.previous_release_state_preserved, true);
  assert.equal(artifact.release_state_changed, false);
  assert.equal(artifact.validation_state_changed, false);
  assert.equal(artifact.state_version_changed, false);
  assert.equal(
    artifact.resulting_release_projection.projection_hash,
    artifact.prior_release_projection.projection_hash
  );
  assert.equal(artifact.resulting_release_projection.release_state, "BLOCKED");
  assert.equal(artifact.resulting_release_projection.validation_state, "UNVERIFIED");
}

// MATRIX222-T06 rejected release event is emitted.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_release_event_emitted, true);
  assert.equal(artifact.rejected_release_event.event_type, "RejectedReleasePromotionEvent");
  assert.equal(artifact.rejected_release_event.reason_code, "INTERNAL_EVIDENCE_CLOSURE_NOT_CLOSED");
  assert.ok(artifact.rejected_release_event.missing_preconditions.includes("INTERNAL_EVIDENCE_CLOSURE_CLOSED"));
  assert.equal(artifact.rejected_release_event.preserved_state_ref, artifact.prior_release_projection.projection_hash);
}

// MATRIX222-T07 release gate remains closed.
{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "promote_without_internal_closure_allowed",
    "promote_with_unsatisfied_c_controls_allowed",
    "promote_without_release_decision_record_allowed",
    "promote_without_release_verifier_record_allowed",
    "model_generated_release_promotion_authoritative",
    "ui_manual_release_promotion_authoritative",
    "admin_override_release_promotion_authoritative"
  ]) {
    assert.equal(artifact.release_gate[key], false, key);
  }
}

// MATRIX222-T08 verifier accepts canonical artifact.
{
  const verification = runtime.verifyEGT05ReleaseCleanWithoutInternalClosure(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT05ReleaseCleanWithoutInternalClosureVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "BLOCK");
  assert.equal(verification.validation_result, "UNVERIFIED");
  assert.equal(verification.reason_code, "INTERNAL_EVIDENCE_CLOSURE_NOT_CLOSED");
  assert.equal(verification.release_state, "BLOCKED");
  assert.equal(verification.attempted_release_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(verification.release_promotion_accepted, false);
  assert.equal(verification.previous_release_state_preserved, true);
  assert.equal(verification.internal_evidence_closure_closed, false);
  assert.equal(verification.resulting_release_state, "BLOCKED");
  assert.equal(verification.resulting_validation_state, "UNVERIFIED");
}

// MATRIX222-T09 verifier detects overclaim/tamper.
{
  const artifact = runtime.readJson(artifactPath);

  const tmpEligible = "/tmp/hbce-matrix-eg-t05-overclaim-release-clean.json";
  const eligible = {
    ...artifact,
    release_state: "RELEASE_CLEAN_ELIGIBLE",
    release_clean_eligible: true,
    release_promotion_accepted: true
  };
  eligible.content_sha256 = runtime.sha256Record({ ...eligible, content_sha256: null });
  fs.writeFileSync(tmpEligible, JSON.stringify(eligible, null, 2));

  const eligibleVerification = runtime.verifyEGT05ReleaseCleanWithoutInternalClosure(tmpEligible);
  assert.equal(eligibleVerification.verified, false);
  assert.ok(eligibleVerification.errors.some((error) => [
    "EG_T05_RELEASE_STATE_INVALID",
    "EG_T05_RELEASE_CLEAN_ELIGIBLE_OVERCLAIM",
    "EG_T05_RELEASE_PROMOTION_ACCEPTED_OVERCLAIM"
  ].includes(error.code)));

  const tmpClosureClosed = "/tmp/hbce-matrix-eg-t05-overclaim-internal-closure-closed.json";
  const closureClosed = {
    ...artifact,
    internal_evidence_closure_closed: true
  };
  closureClosed.content_sha256 = runtime.sha256Record({ ...closureClosed, content_sha256: null });
  fs.writeFileSync(tmpClosureClosed, JSON.stringify(closureClosed, null, 2));

  const closureClosedVerification = runtime.verifyEGT05ReleaseCleanWithoutInternalClosure(tmpClosureClosed);
  assert.equal(closureClosedVerification.verified, false);
  assert.ok(closureClosedVerification.errors.some((error) => error.code === "EG_T05_INTERNAL_CLOSURE_CLOSED_OVERCLAIM"));
}

// MATRIX222-T10 evidence preserves no-readiness/no-execution boundary.
{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "BLOCK");
  assert.equal(evidence.validation_result, "UNVERIFIED");
  assert.equal(evidence.reason_code, "INTERNAL_EVIDENCE_CLOSURE_NOT_CLOSED");
  assert.equal(evidence.release_state, "BLOCKED");
  assert.equal(evidence.attempted_release_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(evidence.release_promotion_accepted, false);
  assert.equal(evidence.previous_release_state_preserved, true);
  assert.equal(evidence.internal_evidence_closure_closed, false);
  assert.equal(evidence.release_clean_eligible, false);
  assert.equal(evidence.eg_t05_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_state_accepted",
    "internal_evidence_closed",
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

console.log("PROG_222_MATRIX_EG_T05_RELEASE_CLEAN_WITHOUT_INTERNAL_CLOSURE_TEST=PASS");
