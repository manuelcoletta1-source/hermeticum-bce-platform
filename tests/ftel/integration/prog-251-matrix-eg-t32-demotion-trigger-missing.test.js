"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t32-demotion-trigger-missing.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T32_DemotionTriggerMissing_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T32_PROG-251-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT32DemotionTriggerMissingRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "REJECT + DEMOTION_TRIGGER_MISSING; state preserved");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.demotion_requested, true);
  assert.equal(artifact.demotion_trigger_present, false);
  assert.equal(artifact.demotion_trigger_evidence_present, false);
  assert.equal(artifact.decision_result, "REJECT");
  assert.equal(artifact.rejection_code, "DEMOTION_TRIGGER_MISSING");
  assert.equal(artifact.state_preserved, true);
  assert.equal(artifact.previous_state_hash, artifact.resulting_state_hash);
  assert.equal(artifact.demotion_applied, false);
  assert.equal(artifact.authoritative_transition_emitted, false);
  assert.equal(artifact.projection_changed, false);
  assert.equal(artifact.release_state_before, artifact.release_state_after);
  assert.equal(artifact.level_state_before, artifact.level_state_after);
  assert.equal(artifact.commercial_class_before, artifact.commercial_class_after);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.demotion_request.demotion_trigger_present, false);
  assert.equal(artifact.demotion_request.demotion_trigger_evidence_present, false);
  assert.equal(artifact.demotion_request.demotion_trigger_ref, null);
  assert.equal(artifact.demotion_request.demotion_trigger_evidence_hash, null);

  assert.equal(artifact.rejection_event.rejection_code, "DEMOTION_TRIGGER_MISSING");
  assert.equal(artifact.rejection_event.state_preserved, true);
  assert.equal(artifact.rejection_event.demotion_applied, false);
  assert.equal(artifact.rejection_event.authoritative_transition_emitted, false);
  assert.equal(artifact.rejection_event.projection_changed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_demotion_trigger_for_regression",
    "require_trigger_evidence_for_demotion",
    "require_reject_without_demotion_trigger",
    "require_state_preserved_on_reject",
    "require_no_authoritative_transition_on_reject",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.demotion_trigger_gate[key], true, key);
  }

  for (const key of [
    "allow_demotion_without_trigger",
    "allow_demotion_without_trigger_evidence",
    "allow_projection_change_on_reject",
    "allow_authoritative_transition_on_reject",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.demotion_trigger_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT32DemotionTriggerMissing(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT32DemotionTriggerMissingVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.rejection_code, "DEMOTION_TRIGGER_MISSING");
  assert.equal(verification.state_preserved, true);
  assert.equal(verification.demotion_applied, false);
  assert.equal(verification.authoritative_transition_emitted, false);
  assert.equal(verification.projection_changed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpDemotionOverclaim = "/tmp/hbce-matrix-eg-t32-demotion-overclaim.json";
  const demotionOverclaim = {
    ...artifact,
    demotion_trigger_present: true,
    demotion_trigger_evidence_present: true,
    decision_result: "ALLOW",
    rejection_code: null,
    state_preserved: false,
    resulting_state_hash: "changed-state-hash",
    demotion_applied: true,
    authoritative_transition_emitted: true,
    projection_changed: true,
    release_state_after: "BLOCKED",
    level_state_after: "LEVEL_4_SUSPENDED",
    commercial_class_after: "LC_C",
    demotion_request: {
      ...artifact.demotion_request,
      demotion_trigger_present: true,
      demotion_trigger_ref: "fake-trigger",
      demotion_trigger_evidence_present: true,
      demotion_trigger_evidence_hash: "fake-trigger-evidence"
    },
    rejection_event: {
      ...artifact.rejection_event,
      rejection_code: null,
      state_preserved: false,
      demotion_applied: true,
      authoritative_transition_emitted: true,
      projection_changed: true
    },
    demotion_trigger_gate: {
      ...artifact.demotion_trigger_gate,
      allow_demotion_without_trigger: true,
      allow_demotion_without_trigger_evidence: true,
      allow_projection_change_on_reject: true,
      allow_authoritative_transition_on_reject: true
    }
  };
  demotionOverclaim.content_sha256 = runtime.sha256Record({ ...demotionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpDemotionOverclaim, JSON.stringify(demotionOverclaim, null, 2));

  const demotionVerification = runtime.verifyEGT32DemotionTriggerMissing(tmpDemotionOverclaim);
  assert.equal(demotionVerification.verified, false);
  assert.ok(demotionVerification.errors.some((error) => [
    "EG_T32_FIELD_INVALID",
    "EG_T32_STATE_NOT_PRESERVED",
    "EG_T32_STATE_FIELD_CHANGED_ON_REJECT",
    "EG_T32_REQUEST_TRIGGER_OVERCLAIM",
    "EG_T32_REJECTION_EVENT_CODE_INVALID",
    "EG_T32_REJECTION_EVENT_STATE_NOT_PRESERVED",
    "EG_T32_REJECTION_EVENT_OVERCLAIM",
    "EG_T32_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpBoundaryOverclaim = "/tmp/hbce-matrix-eg-t32-boundary-overclaim.json";
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

  const boundaryVerification = runtime.verifyEGT32DemotionTriggerMissing(tmpBoundaryOverclaim);
  assert.equal(boundaryVerification.verified, false);
  assert.ok(boundaryVerification.errors.some((error) => error.code === "EG_T32_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.demotion_requested, true);
  assert.equal(evidence.demotion_trigger_present, false);
  assert.equal(evidence.demotion_trigger_evidence_present, false);
  assert.equal(evidence.decision_result, "REJECT");
  assert.equal(evidence.rejection_code, "DEMOTION_TRIGGER_MISSING");
  assert.equal(evidence.state_preserved, true);
  assert.equal(evidence.demotion_applied, false);
  assert.equal(evidence.authoritative_transition_emitted, false);
  assert.equal(evidence.projection_changed, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.eg_t32_runtime_artifact_created, true);

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

console.log("PROG_251_MATRIX_EG_T32_DEMOTION_TRIGGER_MISSING_TEST=PASS");
