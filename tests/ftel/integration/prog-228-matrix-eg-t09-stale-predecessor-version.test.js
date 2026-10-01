"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t09-stale-predecessor-version.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T09_StalePredecessorVersion_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T09_PROG-228-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT09StalePredecessorVersionRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.current_state_projection.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.current_state_projection.namespace, "RELEASE_STATE");
  assert.equal(artifact.current_state_projection.state, "BLOCKED");
  assert.equal(artifact.current_state_projection.state_version, 4);
  assert.equal(typeof artifact.current_state_projection.projection_hash, "string");
  assert.equal(artifact.current_state_projection.projection_hash.length, 64);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.transition_request.request_type, "MATRIX_STATE_TRANSITION_REQUEST");
  assert.equal(artifact.transition_request.requested_transition, "PROMOTE_RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.transition_request.requested_from_state, "BLOCKED");
  assert.equal(artifact.transition_request.requested_to_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.transition_request.declared_predecessor_state_version, 3);
  assert.equal(artifact.transition_request.observed_current_state_version, 4);
  assert.equal(artifact.transition_request.predecessor_version_matches_current, false);
  assert.equal(artifact.transition_request.predecessor_hash_matches_current, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "REJECT");
  assert.equal(artifact.validation_result, "UNVERIFIED");
  assert.equal(artifact.reason_code, "STALE_PREDECESSOR");
  assert.equal(artifact.stale_predecessor_detected, true);
  assert.equal(artifact.predecessor_version_matches_current, false);
  assert.equal(artifact.predecessor_hash_matches_current, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.state, "BLOCKED");
  assert.equal(artifact.attempted_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.previous_authoritative_state_preserved, true);
  assert.equal(artifact.state_changed, false);
  assert.equal(artifact.state_version_changed, false);
  assert.equal(artifact.authoritative_event_emitted, false);
  assert.equal(artifact.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.stale_request_accepted, false);
  assert.equal(artifact.transition_authoritative, false);
  assert.equal(
    artifact.resulting_state_projection.projection_hash,
    artifact.current_state_projection.projection_hash
  );
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_transition_event_emitted, true);
  assert.equal(artifact.rejected_transition_event.event_type, "RejectedStalePredecessorTransitionEvent");
  assert.equal(artifact.rejected_transition_event.reason_code, "STALE_PREDECESSOR");
  assert.equal(artifact.rejected_transition_event.declared_predecessor_state_version, 3);
  assert.equal(artifact.rejected_transition_event.observed_current_state_version, 4);
  assert.equal(artifact.rejected_transition_event.preserved_state_ref, artifact.current_state_projection.projection_hash);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "accept_stale_predecessor_allowed",
    "accept_stale_version_allowed",
    "accept_stale_projection_hash_allowed",
    "repair_stale_predecessor_by_model_allowed",
    "ui_manual_acceptance_authoritative",
    "admin_override_authoritative"
  ]) {
    assert.equal(artifact.stale_predecessor_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT09StalePredecessorVersion(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT09StalePredecessorVersionVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "REJECT");
  assert.equal(verification.validation_result, "UNVERIFIED");
  assert.equal(verification.reason_code, "STALE_PREDECESSOR");
  assert.equal(verification.stale_predecessor_detected, true);
  assert.equal(verification.state, "BLOCKED");
  assert.equal(verification.attempted_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(verification.current_state_version, 4);
  assert.equal(verification.declared_predecessor_state_version, 3);
  assert.equal(verification.previous_authoritative_state_preserved, true);
  assert.equal(verification.transition_authoritative, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t09-overclaim-accepted.json";
  const accepted = {
    ...artifact,
    stale_predecessor_detected: false,
    predecessor_version_matches_current: true,
    predecessor_hash_matches_current: true,
    stale_request_accepted: true,
    transition_authoritative: true,
    authoritative_event_emitted: true
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT09StalePredecessorVersion(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => [
    "EG_T09_STALE_PREDECESSOR_NOT_DETECTED",
    "EG_T09_PREDECESSOR_VERSION_MATCH_OVERCLAIM",
    "EG_T09_PREDECESSOR_HASH_MATCH_OVERCLAIM",
    "EG_T09_STALE_REQUEST_ACCEPTED_OVERCLAIM",
    "EG_T09_TRANSITION_AUTHORITY_OVERCLAIM",
    "EG_T09_AUTHORITATIVE_EVENT_OVERCLAIM"
  ].includes(error.code)));

  const tmpRuntime = "/tmp/hbce-matrix-eg-t09-runtime-overclaim.json";
  const runtimeOverclaim = {
    ...artifact,
    runtime_claims: {
      ...artifact.runtime_claims,
      transition_accepted: true,
      authoritative_projection_updated: true
    }
  };
  runtimeOverclaim.content_sha256 = runtime.sha256Record({ ...runtimeOverclaim, content_sha256: null });
  fs.writeFileSync(tmpRuntime, JSON.stringify(runtimeOverclaim, null, 2));

  const runtimeVerification = runtime.verifyEGT09StalePredecessorVersion(tmpRuntime);
  assert.equal(runtimeVerification.verified, false);
  assert.ok(runtimeVerification.errors.some((error) => error.code === "EG_T09_RUNTIME_CLAIM_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "REJECT");
  assert.equal(evidence.validation_result, "UNVERIFIED");
  assert.equal(evidence.reason_code, "STALE_PREDECESSOR");
  assert.equal(evidence.stale_predecessor_detected, true);
  assert.equal(evidence.predecessor_version_matches_current, false);
  assert.equal(evidence.predecessor_hash_matches_current, false);
  assert.equal(evidence.previous_authoritative_state_preserved, true);
  assert.equal(evidence.state, "BLOCKED");
  assert.equal(evidence.attempted_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(evidence.state_changed, false);
  assert.equal(evidence.state_version_changed, false);
  assert.equal(evidence.authoritative_event_emitted, false);
  assert.equal(evidence.duplicate_authoritative_event_emitted, false);
  assert.equal(evidence.stale_request_accepted, false);
  assert.equal(evidence.transition_authoritative, false);
  assert.equal(evidence.eg_t09_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "transition_accepted",
    "authoritative_projection_updated",
    "release_clean_eligible",
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

console.log("PROG_228_MATRIX_EG_T09_STALE_PREDECESSOR_VERSION_TEST=PASS");
