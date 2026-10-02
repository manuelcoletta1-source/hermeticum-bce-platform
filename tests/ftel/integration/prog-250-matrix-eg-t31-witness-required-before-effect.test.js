"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t31-witness-required-before-effect.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T31_WitnessRequiredBeforeEffect_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T31_PROG-250-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT31WitnessRequiredBeforeEffectRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "BLOCK + WITNESS_REQUIRED_BEFORE_EFFECT; no external dispatch");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.a2_plus_dispatch_attempted_before_external_witness, true);
  assert.equal(artifact.external_witness_required, true);
  assert.equal(artifact.external_witness_receipt_present, false);
  assert.equal(artifact.block_code, "WITNESS_REQUIRED_BEFORE_EFFECT");
  assert.equal(artifact.dependent_dispatch_blocked, true);
  assert.equal(artifact.no_external_dispatch, true);
  assert.equal(artifact.dispatch_allowed, false);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.target_system_contacted, false);
  assert.equal(artifact.target_receipt_created, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.authorizing_event.external_witness_required, true);
  assert.equal(artifact.authorizing_event.external_witness_receipt_present, false);
  assert.equal(artifact.authorizing_event.external_witness_state, "NOT_WITNESSED");
  assert.equal(artifact.dispatch_attempt.block_reason, "WITNESS_REQUIRED_BEFORE_EFFECT");
  assert.equal(artifact.dispatch_attempt.dispatch_allowed, false);
  assert.equal(artifact.dispatch_attempt.dispatch_performed, false);
  assert.equal(artifact.dispatch_attempt.external_connector_called, false);
  assert.equal(artifact.dispatch_attempt.target_system_contacted, false);
  assert.equal(artifact.dispatch_attempt.target_receipt_created, false);
  assert.equal(artifact.dispatch_attempt.effect_evidence_created, false);
  assert.equal(artifact.violation_evidence_event.violation_type, "WITNESS_REQUIRED_BEFORE_EFFECT");
  assert.equal(artifact.violation_evidence_event.dependent_dispatch_blocked, true);
  assert.equal(artifact.violation_evidence_event.no_external_dispatch, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_authorizing_event_external_witness",
    "require_witness_before_effect",
    "require_block_without_external_witness",
    "require_no_external_dispatch_without_witness",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.witness_before_effect_gate[key], true, key);
  }

  for (const key of [
    "allow_dispatch_before_external_witness",
    "allow_external_connector_call_before_witness",
    "allow_target_receipt_creation_before_witness",
    "allow_effect_evidence_creation_before_witness"
  ]) {
    assert.equal(artifact.witness_before_effect_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT31WitnessRequiredBeforeEffect(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT31WitnessRequiredBeforeEffectVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.block_code, "WITNESS_REQUIRED_BEFORE_EFFECT");
  assert.equal(verification.dependent_dispatch_blocked, true);
  assert.equal(verification.no_external_dispatch, true);
  assert.equal(verification.external_witness_receipt_present, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpWitnessOverclaim = "/tmp/hbce-matrix-eg-t31-witness-overclaim.json";
  const witnessOverclaim = {
    ...artifact,
    external_witness_receipt_present: true,
    block_code: null,
    dependent_dispatch_blocked: false,
    no_external_dispatch: false,
    dispatch_allowed: true,
    dispatch_performed: true,
    external_connector_called: true,
    target_receipt_created: true,
    effect_evidence_created: true,
    authorizing_event: {
      ...artifact.authorizing_event,
      external_witness_state: "WITNESSED",
      external_witness_receipt_present: true,
      external_witness_receipt_ref: "fake-receipt"
    },
    dispatch_attempt: {
      ...artifact.dispatch_attempt,
      block_reason: null,
      dispatch_allowed: true,
      dispatch_performed: true,
      external_connector_called: true,
      target_system_contacted: true,
      target_receipt_created: true,
      effect_evidence_created: true
    },
    witness_before_effect_gate: {
      ...artifact.witness_before_effect_gate,
      allow_dispatch_before_external_witness: true,
      allow_external_connector_call_before_witness: true,
      allow_target_receipt_creation_before_witness: true,
      allow_effect_evidence_creation_before_witness: true
    }
  };
  witnessOverclaim.content_sha256 = runtime.sha256Record({ ...witnessOverclaim, content_sha256: null });
  fs.writeFileSync(tmpWitnessOverclaim, JSON.stringify(witnessOverclaim, null, 2));

  const witnessVerification = runtime.verifyEGT31WitnessRequiredBeforeEffect(tmpWitnessOverclaim);
  assert.equal(witnessVerification.verified, false);
  assert.ok(witnessVerification.errors.some((error) => [
    "EG_T31_FIELD_INVALID",
    "EG_T31_AUTHORIZING_EVENT_WITNESS_RECEIPT_OVERCLAIM",
    "EG_T31_DISPATCH_BLOCK_REASON_INVALID",
    "EG_T31_DISPATCH_ATTEMPT_EFFECT_OVERCLAIM",
    "EG_T31_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpBoundaryOverclaim = "/tmp/hbce-matrix-eg-t31-boundary-overclaim.json";
  const boundaryOverclaim = {
    ...artifact,
    no_execution_boundary: {
      ...artifact.no_execution_boundary,
      dispatch_performed: true,
      external_connector_called: true,
      effect_evidence_created: true
    }
  };
  boundaryOverclaim.content_sha256 = runtime.sha256Record({ ...boundaryOverclaim, content_sha256: null });
  fs.writeFileSync(tmpBoundaryOverclaim, JSON.stringify(boundaryOverclaim, null, 2));

  const boundaryVerification = runtime.verifyEGT31WitnessRequiredBeforeEffect(tmpBoundaryOverclaim);
  assert.equal(boundaryVerification.verified, false);
  assert.ok(boundaryVerification.errors.some((error) => error.code === "EG_T31_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.a2_plus_dispatch_attempted_before_external_witness, true);
  assert.equal(evidence.external_witness_required, true);
  assert.equal(evidence.external_witness_receipt_present, false);
  assert.equal(evidence.block_code, "WITNESS_REQUIRED_BEFORE_EFFECT");
  assert.equal(evidence.dependent_dispatch_blocked, true);
  assert.equal(evidence.no_external_dispatch, true);
  assert.equal(evidence.dispatch_allowed, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.target_system_contacted, false);
  assert.equal(evidence.target_receipt_created, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.eg_t31_runtime_artifact_created, true);

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
    "execution_trace_bound",
    "customer_external_execution_allowed"
  ]) {
    assert.equal(evidence[key], false, key);
  }

  assert.equal(artifact.no_execution_boundary.dispatch_performed, false);
  assert.equal(artifact.no_execution_boundary.external_connector_called, false);
  assert.equal(artifact.no_execution_boundary.effect_evidence_created, false);
}

console.log("PROG_250_MATRIX_EG_T31_WITNESS_REQUIRED_BEFORE_EFFECT_TEST=PASS");
