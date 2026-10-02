"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t36-fixture-independence-insufficient.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T36_FixtureIndependenceInsufficient_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T36_PROG-255-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT36FixtureIndependenceInsufficientRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "BLOCK/UNVERIFIED + FIXTURE_INDEPENDENCE_INSUFFICIENT");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.c09_adverse_fixtures_present, true);
  assert.equal(artifact.fixture_class, "C09_ADVERSE_FIXTURES");
  assert.equal(artifact.required_independence_minimum, 3);
  assert.equal(artifact.observed_independent_fixture_count, 1);
  assert.equal(artifact.observed_independent_fixture_count < artifact.required_independence_minimum, true);
  assert.equal(artifact.independence_minimum_met, false);
  assert.equal(artifact.fixture_independence_status, "BELOW_SELECTED_PROFILE_MINIMUM");
  assert.equal(artifact.decision_result, "BLOCK/UNVERIFIED");
  assert.equal(artifact.block_code, "FIXTURE_INDEPENDENCE_INSUFFICIENT");
  assert.equal(artifact.validation_state_before, "UNVERIFIED");
  assert.equal(artifact.validation_state_after, "UNVERIFIED");
  assert.equal(artifact.profile_validation_granted, false);
  assert.equal(artifact.authoritative_transition_emitted, false);
  assert.equal(artifact.projection_changed, false);
  assert.equal(artifact.previous_fixture_set_hash, artifact.resulting_fixture_set_hash);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.fixture_set.selected_profile, "A2_EFFECT_RELEVANT_CHECKPOINT");
  assert.equal(artifact.fixture_set.fixture_class, "C09_ADVERSE_FIXTURES");
  assert.equal(artifact.fixture_set.required_independence_minimum, 3);
  assert.equal(artifact.fixture_set.observed_independent_fixture_count, 1);
  assert.equal(artifact.fixture_set.independence_minimum_met, false);
  assert.equal(artifact.fixture_set.fixture_set_hash, runtime.sha256Record({ ...artifact.fixture_set, fixture_set_hash: null }));

  assert.equal(artifact.validation_request.independence_minimum_met, false);
  assert.equal(artifact.validation_request.requested_validation_state, "VERIFIED");

  assert.equal(artifact.block_event.block_code, "FIXTURE_INDEPENDENCE_INSUFFICIENT");
  assert.equal(artifact.block_event.validation_state_after, "UNVERIFIED");
  assert.equal(artifact.block_event.profile_validation_granted, false);
  assert.equal(artifact.block_event.authoritative_transition_emitted, false);
  assert.equal(artifact.block_event.projection_changed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_selected_profile_independence_minimum",
    "require_block_when_independence_below_minimum",
    "require_validation_state_unverified_on_block",
    "require_no_authoritative_transition_on_block",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.fixture_independence_gate[key], true, key);
  }

  for (const key of [
    "allow_validation_when_independence_below_minimum",
    "allow_projection_change_on_block",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.fixture_independence_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT36FixtureIndependenceInsufficient(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT36FixtureIndependenceInsufficientVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.block_code, "FIXTURE_INDEPENDENCE_INSUFFICIENT");
  assert.equal(verification.decision_result, "BLOCK/UNVERIFIED");
  assert.equal(verification.required_independence_minimum, 3);
  assert.equal(verification.observed_independent_fixture_count, 1);
  assert.equal(verification.independence_minimum_met, false);
  assert.equal(verification.validation_state_after, "UNVERIFIED");
  assert.equal(verification.profile_validation_granted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpFixtureOverclaim = "/tmp/hbce-matrix-eg-t36-fixture-overclaim.json";
  const fixtureOverclaim = {
    ...artifact,
    observed_independent_fixture_count: 3,
    independence_minimum_met: true,
    decision_result: "VERIFIED",
    block_code: null,
    validation_state_after: "VERIFIED",
    profile_validation_granted: true,
    authoritative_transition_emitted: true,
    projection_changed: true,
    validation_request: {
      ...artifact.validation_request,
      observed_independent_fixture_count: 3,
      independence_minimum_met: true
    },
    block_event: {
      ...artifact.block_event,
      block_code: null,
      validation_state_after: "VERIFIED",
      profile_validation_granted: true,
      authoritative_transition_emitted: true,
      projection_changed: true
    },
    fixture_independence_gate: {
      ...artifact.fixture_independence_gate,
      allow_validation_when_independence_below_minimum: true,
      allow_projection_change_on_block: true
    }
  };
  fixtureOverclaim.content_sha256 = runtime.sha256Record({ ...fixtureOverclaim, content_sha256: null });
  fs.writeFileSync(tmpFixtureOverclaim, JSON.stringify(fixtureOverclaim, null, 2));

  const fixtureVerification = runtime.verifyEGT36FixtureIndependenceInsufficient(tmpFixtureOverclaim);
  assert.equal(fixtureVerification.verified, false);
  assert.ok(fixtureVerification.errors.some((error) => [
    "EG_T36_FIELD_INVALID",
    "EG_T36_INDEPENDENCE_NOT_BELOW_MINIMUM",
    "EG_T36_REQUEST_INDEPENDENCE_OVERCLAIM",
    "EG_T36_BLOCK_EVENT_CODE_INVALID",
    "EG_T36_BLOCK_EVENT_VALIDATION_STATE_INVALID",
    "EG_T36_BLOCK_EVENT_OVERCLAIM",
    "EG_T36_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpBoundaryOverclaim = "/tmp/hbce-matrix-eg-t36-boundary-overclaim.json";
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

  const boundaryVerification = runtime.verifyEGT36FixtureIndependenceInsufficient(tmpBoundaryOverclaim);
  assert.equal(boundaryVerification.verified, false);
  assert.ok(boundaryVerification.errors.some((error) => error.code === "EG_T36_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.c09_adverse_fixtures_present, true);
  assert.equal(evidence.fixture_class, "C09_ADVERSE_FIXTURES");
  assert.equal(evidence.required_independence_minimum, 3);
  assert.equal(evidence.observed_independent_fixture_count, 1);
  assert.equal(evidence.independence_minimum_met, false);
  assert.equal(evidence.decision_result, "BLOCK/UNVERIFIED");
  assert.equal(evidence.block_code, "FIXTURE_INDEPENDENCE_INSUFFICIENT");
  assert.equal(evidence.validation_state_after, "UNVERIFIED");
  assert.equal(evidence.profile_validation_granted, false);
  assert.equal(evidence.authoritative_transition_emitted, false);
  assert.equal(evidence.projection_changed, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.eg_t36_runtime_artifact_created, true);

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

console.log("PROG_255_MATRIX_EG_T36_FIXTURE_INDEPENDENCE_INSUFFICIENT_TEST=PASS");
