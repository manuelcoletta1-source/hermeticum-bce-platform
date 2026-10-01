"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t12-evidence-invalidated-after-pass.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T12_EvidenceInvalidatedAfterPass_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T12_PROG-231-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT12EvidenceInvalidatedAfterPassRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "Effective state recomputed/regressed; historical PASS preserved");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.historical_decision_result, "PASS");
  assert.equal(artifact.historical_validation_result, "VERIFIED");
  assert.equal(artifact.historical_reason_code, "COMPLETE_GUARDS_AND_EVIDENCE");
  assert.equal(artifact.historical_pass_preserved, true);
  assert.equal(artifact.historical_pass_mutated, false);
  assert.equal(artifact.historical_event_log_rewritten, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.evidence_invalidation_detected, true);
  assert.equal(artifact.required_evidence_invalidated, true);
  assert.equal(artifact.evidence_invalidation_record.invalidation_reason_code, "REQUIRED_EVIDENCE_INVALIDATED_AFTER_PASS");
  assert.equal(artifact.evidence_invalidation_record.invalidation_effect, "EFFECTIVE_STATE_MUST_BE_RECOMPUTED");
  assert.equal(artifact.evidence_invalidation_record.historical_record_mutation_allowed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.effective_state_recomputed, true);
  assert.equal(artifact.effective_state_regressed, true);
  assert.equal(artifact.effective_decision_result, "REGRESS_EFFECTIVE_STATE");
  assert.equal(artifact.effective_validation_result, "UNVERIFIED");
  assert.equal(artifact.effective_reason_code, "REQUIRED_EVIDENCE_INVALIDATED");
  assert.equal(artifact.previous_effective_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.resulting_effective_state, "BLOCKED");
  assert.equal(artifact.previous_effective_state_version, 5);
  assert.equal(artifact.resulting_effective_state_version, 6);
  assert.equal(artifact.effective_state_changed, true);
  assert.equal(artifact.effective_state_version_changed, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.regression_event_emitted, true);
  assert.equal(artifact.regression_event.event_type, "EffectiveStateRegressionEvent");
  assert.equal(artifact.regression_event.reason_code, "REQUIRED_EVIDENCE_INVALIDATED");
  assert.equal(artifact.regression_event.historical_pass_sha256, artifact.historical_pass_record.historical_pass_sha256);
  assert.equal(artifact.regression_event.invalidation_sha256, artifact.evidence_invalidation_record.invalidation_sha256);
  assert.equal(artifact.resulting_effective_state_projection.predecessor_event_sha256, artifact.regression_event.event_hash);
  assert.equal(artifact.resulting_effective_state_projection.state, "BLOCKED");
  assert.equal(artifact.resulting_effective_state_projection.state_version, 6);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "preserve_historical_pass_required",
    "recompute_effective_state_required",
    "regress_effective_state_on_required_evidence_invalidation"
  ]) {
    assert.equal(artifact.invalidation_gate[key], true, key);
  }

  for (const key of [
    "mutate_historical_pass_allowed",
    "rewrite_historical_event_log_allowed",
    "keep_effective_pass_after_required_evidence_invalidation_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.invalidation_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT12EvidenceInvalidatedAfterPass(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT12EvidenceInvalidatedAfterPassVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.historical_decision_result, "PASS");
  assert.equal(verification.historical_pass_preserved, true);
  assert.equal(verification.evidence_invalidation_detected, true);
  assert.equal(verification.effective_state_recomputed, true);
  assert.equal(verification.effective_state_regressed, true);
  assert.equal(verification.previous_effective_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(verification.resulting_effective_state, "BLOCKED");
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpMutation = "/tmp/hbce-matrix-eg-t12-historical-mutation-overclaim.json";
  const mutation = {
    ...artifact,
    historical_pass_preserved: false,
    historical_pass_mutated: true,
    historical_event_log_rewritten: true
  };
  mutation.content_sha256 = runtime.sha256Record({ ...mutation, content_sha256: null });
  fs.writeFileSync(tmpMutation, JSON.stringify(mutation, null, 2));

  const mutationVerification = runtime.verifyEGT12EvidenceInvalidatedAfterPass(tmpMutation);
  assert.equal(mutationVerification.verified, false);
  assert.ok(mutationVerification.errors.some((error) => error.code === "EG_T12_FIELD_INVALID"));

  const tmpNoRegression = "/tmp/hbce-matrix-eg-t12-no-regression-overclaim.json";
  const noRegression = {
    ...artifact,
    effective_state_recomputed: false,
    effective_state_regressed: false,
    resulting_effective_state: "RELEASE_CLEAN_ELIGIBLE",
    effective_state_changed: false
  };
  noRegression.content_sha256 = runtime.sha256Record({ ...noRegression, content_sha256: null });
  fs.writeFileSync(tmpNoRegression, JSON.stringify(noRegression, null, 2));

  const noRegressionVerification = runtime.verifyEGT12EvidenceInvalidatedAfterPass(tmpNoRegression);
  assert.equal(noRegressionVerification.verified, false);
  assert.ok(noRegressionVerification.errors.some((error) => error.code === "EG_T12_FIELD_INVALID"));
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpExecution = "/tmp/hbce-matrix-eg-t12-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    invalidation_gate: {
      ...artifact.invalidation_gate,
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

  const executionVerification = runtime.verifyEGT12EvidenceInvalidatedAfterPass(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T12_GATE_OVERCLAIM",
    "EG_T12_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.historical_decision_result, "PASS");
  assert.equal(evidence.historical_pass_preserved, true);
  assert.equal(evidence.historical_pass_mutated, false);
  assert.equal(evidence.historical_event_log_rewritten, false);
  assert.equal(evidence.evidence_invalidation_detected, true);
  assert.equal(evidence.required_evidence_invalidated, true);
  assert.equal(evidence.effective_state_recomputed, true);
  assert.equal(evidence.effective_state_regressed, true);
  assert.equal(evidence.previous_effective_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(evidence.resulting_effective_state, "BLOCKED");
  assert.equal(evidence.eg_t12_runtime_artifact_created, true);

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

console.log("PROG_231_MATRIX_EG_T12_EVIDENCE_INVALIDATED_AFTER_PASS_TEST=PASS");
