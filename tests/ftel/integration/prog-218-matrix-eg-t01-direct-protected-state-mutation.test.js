"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t01-direct-protected-state-mutation.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T01_DirectProtectedStateMutation_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T01_PROG-218-evidence_v001.json";

// MATRIX218-T01 artifact exists and loads.
{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT01DirectProtectedStateMutationRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
}

// MATRIX218-T02 prior authoritative state is BLOCKED.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.prior_authoritative_projection.subject_ref, runtime.MATRIX_SUBJECT_REF);
  assert.equal(artifact.prior_authoritative_projection.namespace, "RELEASE_STATE");
  assert.equal(artifact.prior_authoritative_projection.effective_state, "BLOCKED");
  assert.equal(artifact.prior_authoritative_projection.state_version, 1);
  assert.equal(typeof artifact.prior_authoritative_projection.projection_hash, "string");
  assert.equal(artifact.prior_authoritative_projection.projection_hash.length, 64);
}

// MATRIX218-T03 direct mutation attempt targets ACCEPTED without governed path.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.mutation_attempt.attempt_type, "DIRECT_PROTECTED_STATE_MUTATION");
  assert.equal(artifact.mutation_attempt.attempted_from, "BLOCKED");
  assert.equal(artifact.mutation_attempt.attempted_to, "ACCEPTED");
  assert.equal(artifact.mutation_attempt.governed_transition_request_ref, null);
  assert.equal(artifact.mutation_attempt.decision_record_ref, null);
  assert.equal(artifact.mutation_attempt.transition_event_ref, null);
}

// MATRIX218-T04 mutation is rejected with DIRECT_PROTECTED_STATE_MUTATION.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.decision_result, "REJECT");
  assert.equal(artifact.reason_code, "DIRECT_PROTECTED_STATE_MUTATION");
  assert.equal(artifact.protected_state_write_accepted, false);
  assert.equal(artifact.direct_mutation_authoritative, false);
}

// MATRIX218-T05 previous authoritative state is preserved.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.previous_authoritative_state_preserved, true);
  assert.equal(artifact.projection_changed, false);
  assert.equal(artifact.state_version_changed, false);
  assert.equal(artifact.head_event_changed, false);
  assert.equal(
    artifact.resulting_authoritative_projection.projection_hash,
    artifact.prior_authoritative_projection.projection_hash
  );
  assert.equal(artifact.resulting_authoritative_projection.effective_state, "BLOCKED");
}

// MATRIX218-T06 rejected transition event is emitted.
{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.rejected_transition_event_emitted, true);
  assert.equal(artifact.rejected_transition_event.event_type, "RejectedTransitionEvent");
  assert.equal(artifact.rejected_transition_event.reason_code, "DIRECT_PROTECTED_STATE_MUTATION");
  assert.equal(artifact.rejected_transition_event.preserved_state_ref, artifact.prior_authoritative_projection.projection_hash);
}

// MATRIX218-T07 bypass prevention remains closed.
{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "ui_manual_field_edit_allowed",
    "generic_api_patch_allowed",
    "direct_sql_projection_write_authoritative",
    "admin_override_allowed",
    "model_output_authoritative",
    "imported_status_authoritative_without_governed_transition"
  ]) {
    assert.equal(artifact.bypass_prevention[key], false, key);
  }
}

// MATRIX218-T08 verifier accepts canonical artifact.
{
  const verification = runtime.verifyEGT01DirectProtectedStateMutation(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT01DirectProtectedStateMutationVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "REJECT");
  assert.equal(verification.reason_code, "DIRECT_PROTECTED_STATE_MUTATION");
  assert.equal(verification.protected_state_write_accepted, false);
  assert.equal(verification.previous_authoritative_state_preserved, true);
  assert.equal(verification.resulting_effective_state, "BLOCKED");
}

// MATRIX218-T09 verifier detects overclaim/tamper.
{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t01-overclaim-accepted.json";
  const accepted = {
    ...artifact,
    protected_state_write_accepted: true
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT01DirectProtectedStateMutation(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => error.code === "EG_T01_PROTECTED_STATE_WRITE_ACCEPTED_OVERCLAIM"));

  const tmpChanged = "/tmp/hbce-matrix-eg-t01-overclaim-changed.json";
  const changed = {
    ...artifact,
    resulting_authoritative_projection: {
      ...artifact.resulting_authoritative_projection,
      effective_state: "ACCEPTED"
    }
  };
  changed.content_sha256 = runtime.sha256Record({ ...changed, content_sha256: null });
  fs.writeFileSync(tmpChanged, JSON.stringify(changed, null, 2));

  const changedVerification = runtime.verifyEGT01DirectProtectedStateMutation(tmpChanged);
  assert.equal(changedVerification.verified, false);
  assert.ok(changedVerification.errors.some((error) => error.code === "EG_T01_RESULTING_PROJECTION_HASH_CHANGED" || error.code === "EG_T01_RESULTING_STATE_INVALID"));
}

// MATRIX218-T10 evidence preserves no-readiness/no-execution boundary.
{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.decision_result, "REJECT");
  assert.equal(evidence.reason_code, "DIRECT_PROTECTED_STATE_MUTATION");
  assert.equal(evidence.protected_state_write_accepted, false);
  assert.equal(evidence.previous_authoritative_state_preserved, true);
  assert.equal(evidence.resulting_effective_state, "BLOCKED");
  assert.equal(evidence.eg_t01_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_state_accepted",
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

console.log("PROG_218_MATRIX_EG_T01_DIRECT_PROTECTED_STATE_MUTATION_TEST=PASS");
