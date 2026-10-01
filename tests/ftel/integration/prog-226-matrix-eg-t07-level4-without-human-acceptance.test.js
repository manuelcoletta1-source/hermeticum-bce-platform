"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t07-level4-without-human-acceptance.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T07_Level4WithoutHumanAcceptance_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T07_PROG-226-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT07Level4WithoutHumanAcceptanceRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.prior_level_projection.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.prior_level_projection.level_state, "LEVEL_3_R_AND_D_BOUNDED");
  assert.equal(artifact.prior_level_projection.level4_eligibility_state, "NOT_LEVEL_4_ELIGIBLE");
  assert.equal(artifact.prior_level_projection.state_version, 1);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.promotion_attempt.attempt_type, "LEVEL4_ELIGIBILITY_PROMOTION");
  assert.equal(artifact.promotion_attempt.attempted_from, "LEVEL_3_R_AND_D_BOUNDED");
  assert.equal(artifact.promotion_attempt.attempted_to, "LEVEL_4_ELIGIBLE");
  assert.equal(artifact.promotion_attempt.human_acceptance_state.human_acceptance_state, "PENDING");
  assert.equal(artifact.promotion_attempt.human_acceptance_state.accepted, false);
  assert.ok(artifact.promotion_attempt.missing_preconditions.includes("HUMAN_ACCEPTANCE_RECORD_ACCEPTED"));
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "BLOCK");
  assert.equal(artifact.validation_result, "UNVERIFIED");
  assert.equal(artifact.reason_code, "HUMAN_ACCEPTANCE_REQUIRED");
  assert.equal(artifact.level4_promotion_accepted, false);
  assert.equal(artifact.level4_authoritative, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.level_state, "LEVEL_3_R_AND_D_BOUNDED");
  assert.equal(artifact.level4_eligibility_state, "NOT_LEVEL_4_ELIGIBLE");
  assert.equal(artifact.level4_eligible, false);
  assert.equal(artifact.previous_level_state_preserved, true);
  assert.equal(artifact.level_state_changed, false);
  assert.equal(artifact.level4_eligibility_state_changed, false);
  assert.equal(artifact.state_version_changed, false);
  assert.equal(
    artifact.resulting_level_projection.projection_hash,
    artifact.prior_level_projection.projection_hash
  );
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_level_event_emitted, true);
  assert.equal(artifact.rejected_level_event.event_type, "RejectedLevel4EligibilityPromotionEvent");
  assert.equal(artifact.rejected_level_event.reason_code, "HUMAN_ACCEPTANCE_REQUIRED");
  assert.ok(artifact.rejected_level_event.missing_preconditions.includes("HUMAN_ACCEPTANCE_RECORD_ACCEPTED"));
  assert.equal(artifact.rejected_level_event.preserved_state_ref, artifact.prior_level_projection.projection_hash);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "promote_without_human_acceptance_allowed",
    "promote_without_level4_scope_allowed",
    "promote_without_mandatory_evidence_allowed",
    "promote_without_external_validation_allowed",
    "promote_without_legal_readiness_allowed",
    "promote_without_commercial_scope_allowed",
    "model_generated_level4_go_authoritative",
    "ui_manual_level4_go_authoritative",
    "admin_override_level4_go_authoritative"
  ]) {
    assert.equal(artifact.level4_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT07Level4WithoutHumanAcceptance(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT07Level4WithoutHumanAcceptanceVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "BLOCK");
  assert.equal(verification.validation_result, "UNVERIFIED");
  assert.equal(verification.reason_code, "HUMAN_ACCEPTANCE_REQUIRED");
  assert.equal(verification.level_state, "LEVEL_3_R_AND_D_BOUNDED");
  assert.equal(verification.attempted_level_state, "LEVEL_4_ELIGIBLE");
  assert.equal(verification.level4_promotion_accepted, false);
  assert.equal(verification.previous_level_state_preserved, true);
  assert.equal(verification.human_acceptance_accepted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpLevel4 = "/tmp/hbce-matrix-eg-t07-overclaim-level4.json";
  const level4 = {
    ...artifact,
    level_state: "LEVEL_4_ELIGIBLE",
    level4_eligibility_state: "LEVEL_4_ELIGIBLE",
    level4_eligible: true,
    level4_promotion_accepted: true
  };
  level4.content_sha256 = runtime.sha256Record({ ...level4, content_sha256: null });
  fs.writeFileSync(tmpLevel4, JSON.stringify(level4, null, 2));

  const level4Verification = runtime.verifyEGT07Level4WithoutHumanAcceptance(tmpLevel4);
  assert.equal(level4Verification.verified, false);
  assert.ok(level4Verification.errors.some((error) => [
    "EG_T07_LEVEL_STATE_INVALID",
    "EG_T07_LEVEL4_ELIGIBILITY_STATE_INVALID",
    "EG_T07_LEVEL4_ELIGIBLE_OVERCLAIM",
    "EG_T07_LEVEL4_PROMOTION_ACCEPTED_OVERCLAIM"
  ].includes(error.code)));

  const tmpHumanAccepted = "/tmp/hbce-matrix-eg-t07-overclaim-human-accepted.json";
  const humanAccepted = {
    ...artifact,
    human_acceptance_record_present: true,
    human_acceptance_accepted: true
  };
  humanAccepted.content_sha256 = runtime.sha256Record({ ...humanAccepted, content_sha256: null });
  fs.writeFileSync(tmpHumanAccepted, JSON.stringify(humanAccepted, null, 2));

  const humanAcceptedVerification = runtime.verifyEGT07Level4WithoutHumanAcceptance(tmpHumanAccepted);
  assert.equal(humanAcceptedVerification.verified, false);
  assert.ok(humanAcceptedVerification.errors.some((error) => [
    "EG_T07_HUMAN_ACCEPTANCE_RECORD_PRESENT_OVERCLAIM",
    "EG_T07_HUMAN_ACCEPTANCE_ACCEPTED_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "BLOCK");
  assert.equal(evidence.validation_result, "UNVERIFIED");
  assert.equal(evidence.reason_code, "HUMAN_ACCEPTANCE_REQUIRED");
  assert.equal(evidence.level_state, "LEVEL_3_R_AND_D_BOUNDED");
  assert.equal(evidence.attempted_level_state, "LEVEL_4_ELIGIBLE");
  assert.equal(evidence.level4_promotion_accepted, false);
  assert.equal(evidence.previous_level_state_preserved, true);
  assert.equal(evidence.human_acceptance_required, true);
  assert.equal(evidence.human_acceptance_record_present, false);
  assert.equal(evidence.human_acceptance_accepted, false);
  assert.equal(evidence.level4_eligible, false);
  assert.equal(evidence.eg_t07_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "human_acceptance_completed",
    "external_validation_accepted",
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

console.log("PROG_226_MATRIX_EG_T07_LEVEL4_WITHOUT_HUMAN_ACCEPTANCE_TEST=PASS");
