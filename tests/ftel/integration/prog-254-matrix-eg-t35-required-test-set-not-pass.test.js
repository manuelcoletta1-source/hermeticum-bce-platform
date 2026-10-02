"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t35-required-test-set-not-pass.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T35_RequiredTestSetNotPass_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T35_PROG-254-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT35RequiredTestSetNotPassRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "BLOCK + REQUIRED_TEST_SET_NOT_PASS; class remains LC_C");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.commercial_class_promotion_requested, true);
  assert.equal(artifact.from_commercial_class, "LC_C");
  assert.equal(artifact.to_commercial_class_requested, "LC_B");
  assert.equal(artifact.required_test_set_status, "INCOMPLETE");
  assert.equal(artifact.required_test_set_pass, false);
  assert.equal(artifact.decision_result, "BLOCK");
  assert.equal(artifact.block_code, "REQUIRED_TEST_SET_NOT_PASS");
  assert.equal(artifact.class_preserved, true);
  assert.equal(artifact.commercial_class_before, "LC_C");
  assert.equal(artifact.commercial_class_after, "LC_C");
  assert.equal(artifact.lc_b_granted, false);
  assert.equal(artifact.authoritative_transition_emitted, false);
  assert.equal(artifact.projection_changed, false);
  assert.equal(artifact.previous_state_hash, artifact.resulting_state_hash);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.current_state_before_request.commercial_class, "LC_C");
  assert.equal(artifact.current_state_before_request.required_test_set_pass, false);
  assert.equal(artifact.current_state_before_request.required_test_set_status, "INCOMPLETE");
  assert.equal(Array.isArray(artifact.current_state_before_request.failed_or_missing_tests), true);
  assert.ok(artifact.current_state_before_request.failed_or_missing_tests.includes("EG-T35"));

  assert.equal(artifact.promotion_request.from_commercial_class, "LC_C");
  assert.equal(artifact.promotion_request.to_commercial_class, "LC_B");
  assert.equal(artifact.promotion_request.required_test_set_pass, false);

  assert.equal(artifact.block_event.block_code, "REQUIRED_TEST_SET_NOT_PASS");
  assert.equal(artifact.block_event.required_test_set_pass, false);
  assert.equal(artifact.block_event.class_preserved, true);
  assert.equal(artifact.block_event.commercial_class_after, "LC_C");
  assert.equal(artifact.block_event.authoritative_transition_emitted, false);
  assert.equal(artifact.block_event.projection_changed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_required_test_set_pass_for_lc_b",
    "require_block_when_required_test_set_incomplete",
    "require_class_preserved_on_block",
    "require_no_authoritative_transition_on_block",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.required_test_set_gate[key], true, key);
  }

  for (const key of [
    "allow_lc_b_without_required_test_set_pass",
    "allow_projection_change_on_block",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.required_test_set_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT35RequiredTestSetNotPass(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT35RequiredTestSetNotPassVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.block_code, "REQUIRED_TEST_SET_NOT_PASS");
  assert.equal(verification.required_test_set_pass, false);
  assert.equal(verification.class_preserved, true);
  assert.equal(verification.commercial_class_after, "LC_C");
  assert.equal(verification.lc_b_granted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpPromotionOverclaim = "/tmp/hbce-matrix-eg-t35-promotion-overclaim.json";
  const promotionOverclaim = {
    ...artifact,
    required_test_set_status: "PASS",
    required_test_set_pass: true,
    decision_result: "ALLOW",
    block_code: null,
    class_preserved: false,
    commercial_class_after: "LC_B",
    lc_b_granted: true,
    authoritative_transition_emitted: true,
    projection_changed: true,
    promotion_request: {
      ...artifact.promotion_request,
      required_test_set_status: "PASS",
      required_test_set_pass: true
    },
    block_event: {
      ...artifact.block_event,
      block_code: null,
      required_test_set_status: "PASS",
      required_test_set_pass: true,
      class_preserved: false,
      commercial_class_after: "LC_B",
      authoritative_transition_emitted: true,
      projection_changed: true
    },
    required_test_set_gate: {
      ...artifact.required_test_set_gate,
      allow_lc_b_without_required_test_set_pass: true,
      allow_projection_change_on_block: true
    }
  };
  promotionOverclaim.content_sha256 = runtime.sha256Record({ ...promotionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpPromotionOverclaim, JSON.stringify(promotionOverclaim, null, 2));

  const promotionVerification = runtime.verifyEGT35RequiredTestSetNotPass(tmpPromotionOverclaim);
  assert.equal(promotionVerification.verified, false);
  assert.ok(promotionVerification.errors.some((error) => [
    "EG_T35_FIELD_INVALID",
    "EG_T35_REQUEST_REQUIRED_TEST_SET_OVERCLAIM",
    "EG_T35_BLOCK_EVENT_CODE_INVALID",
    "EG_T35_BLOCK_EVENT_CLASS_NOT_PRESERVED",
    "EG_T35_BLOCK_EVENT_OVERCLAIM",
    "EG_T35_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpBoundaryOverclaim = "/tmp/hbce-matrix-eg-t35-boundary-overclaim.json";
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

  const boundaryVerification = runtime.verifyEGT35RequiredTestSetNotPass(tmpBoundaryOverclaim);
  assert.equal(boundaryVerification.verified, false);
  assert.ok(boundaryVerification.errors.some((error) => error.code === "EG_T35_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.from_commercial_class, "LC_C");
  assert.equal(evidence.to_commercial_class_requested, "LC_B");
  assert.equal(evidence.required_test_set_status, "INCOMPLETE");
  assert.equal(evidence.required_test_set_pass, false);
  assert.equal(evidence.decision_result, "BLOCK");
  assert.equal(evidence.block_code, "REQUIRED_TEST_SET_NOT_PASS");
  assert.equal(evidence.class_preserved, true);
  assert.equal(evidence.commercial_class_after, "LC_C");
  assert.equal(evidence.lc_b_granted, false);
  assert.equal(evidence.authoritative_transition_emitted, false);
  assert.equal(evidence.projection_changed, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.eg_t35_runtime_artifact_created, true);

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

console.log("PROG_254_MATRIX_EG_T35_REQUIRED_TEST_SET_NOT_PASS_TEST=PASS");
