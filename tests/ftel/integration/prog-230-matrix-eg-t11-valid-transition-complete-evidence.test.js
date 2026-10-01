"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t11-valid-transition-complete-evidence.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T11_ValidTransitionCompleteEvidence_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T11_PROG-230-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT11ValidTransitionCompleteEvidenceRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "ALLOW + DecisionRecord + TransitionEvent + projection update");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "ALLOW");
  assert.equal(artifact.validation_result, "VERIFIED");
  assert.equal(artifact.reason_code, "COMPLETE_GUARDS_AND_EVIDENCE");
  assert.equal(artifact.mandatory_evidence_complete, true);
  assert.equal(artifact.mandatory_controls_pass, true);
  assert.equal(artifact.evidence_hashes_valid, true);
  assert.equal(artifact.predecessor_valid, true);
  assert.equal(artifact.decision_scope_valid, true);
  assert.equal(artifact.transition_allowed_by_policy, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_record.record_type, "DecisionRecord");
  assert.equal(artifact.decision_record.decision_result, "ALLOW");
  assert.equal(artifact.decision_record.validation_result, "VERIFIED");
  assert.equal(artifact.decision_record.reason_code, "COMPLETE_GUARDS_AND_EVIDENCE");
  assert.equal(typeof artifact.decision_record.decision_record_sha256, "string");
  assert.equal(artifact.decision_record.decision_record_sha256.length, 64);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.transition_event.event_type, "TransitionEvent");
  assert.equal(artifact.transition_event.from_state, "BLOCKED");
  assert.equal(artifact.transition_event.to_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.transition_event.from_state_version, 4);
  assert.equal(artifact.transition_event.to_state_version, 5);
  assert.equal(artifact.transition_event.decision_record_sha256, artifact.decision_record.decision_record_sha256);
  assert.equal(typeof artifact.transition_event.event_hash, "string");
  assert.equal(artifact.transition_event.event_hash.length, 64);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.prior_state_projection.state, "BLOCKED");
  assert.equal(artifact.prior_state_projection.state_version, 4);
  assert.equal(artifact.resulting_state_projection.state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.resulting_state_projection.state_version, 5);
  assert.equal(artifact.resulting_state_projection.predecessor_event_sha256, artifact.transition_event.event_hash);
  assert.equal(artifact.projection_updated, true);
  assert.equal(artifact.state_changed, true);
  assert.equal(artifact.state_version_changed, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_record_created, true);
  assert.equal(artifact.transition_event_created, true);
  assert.equal(artifact.authoritative_transition_event_emitted, true);
  assert.equal(artifact.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.duplicate_effect_evidence_created, false);
  assert.equal(artifact.target_receipt_created, false);
  assert.equal(artifact.execution_effect_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_complete_evidence",
    "require_valid_predecessor",
    "require_valid_decision_scope",
    "require_policy_allow",
    "allow_projection_update"
  ]) {
    assert.equal(artifact.transition_gate[key], true, key);
  }

  for (const key of [
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.transition_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT11ValidTransitionCompleteEvidence(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT11ValidTransitionCompleteEvidenceVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "ALLOW");
  assert.equal(verification.validation_result, "VERIFIED");
  assert.equal(verification.reason_code, "COMPLETE_GUARDS_AND_EVIDENCE");
  assert.equal(verification.decision_record_created, true);
  assert.equal(verification.transition_event_created, true);
  assert.equal(verification.projection_updated, true);
  assert.equal(verification.previous_state, "BLOCKED");
  assert.equal(verification.resulting_state, "RELEASE_CLEAN_ELIGIBLE");
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpMissing = "/tmp/hbce-matrix-eg-t11-missing-record-overclaim.json";
  const missing = {
    ...artifact,
    decision_record_created: false,
    transition_event_created: false,
    projection_updated: false
  };
  missing.content_sha256 = runtime.sha256Record({ ...missing, content_sha256: null });
  fs.writeFileSync(tmpMissing, JSON.stringify(missing, null, 2));

  const missingVerification = runtime.verifyEGT11ValidTransitionCompleteEvidence(tmpMissing);
  assert.equal(missingVerification.verified, false);
  assert.ok(missingVerification.errors.some((error) => error.code === "EG_T11_FIELD_INVALID"));

  const tmpExecution = "/tmp/hbce-matrix-eg-t11-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    transition_gate: {
      ...artifact.transition_gate,
      allow_dispatch_execution: true
    },
    no_execution_boundary: {
      ...artifact.no_execution_boundary,
      dispatch_performed: true
    }
  };
  executionOverclaim.content_sha256 = runtime.sha256Record({ ...executionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpExecution, JSON.stringify(executionOverclaim, null, 2));

  const executionVerification = runtime.verifyEGT11ValidTransitionCompleteEvidence(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T11_EXECUTION_GATE_OVERCLAIM",
    "EG_T11_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "ALLOW");
  assert.equal(evidence.validation_result, "VERIFIED");
  assert.equal(evidence.reason_code, "COMPLETE_GUARDS_AND_EVIDENCE");
  assert.equal(evidence.decision_record_created, true);
  assert.equal(evidence.transition_event_created, true);
  assert.equal(evidence.projection_updated, true);
  assert.equal(evidence.previous_state, "BLOCKED");
  assert.equal(evidence.resulting_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(evidence.previous_state_version, 4);
  assert.equal(evidence.resulting_state_version, 5);
  assert.equal(evidence.transition_accepted, true);
  assert.equal(evidence.authoritative_projection_updated, true);
  assert.equal(evidence.release_clean_eligible, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
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

console.log("PROG_230_MATRIX_EG_T11_VALID_TRANSITION_COMPLETE_EVIDENCE_TEST=PASS");
