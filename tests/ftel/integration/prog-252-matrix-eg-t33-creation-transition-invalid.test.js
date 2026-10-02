"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t33-creation-transition-invalid.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T33_CreationTransitionInvalid_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T33_PROG-252-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT33CreationTransitionInvalidRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "REJECT/RECONCILE + CREATION_TRANSITION_INVALID; non-authoritative row ignored");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.direct_storage_insert_detected, true);
  assert.equal(artifact.subject_namespace_created_by_direct_storage_insert, true);
  assert.equal(artifact.system_initializer_path_used, false);
  assert.equal(artifact.governed_transition_request_present, false);
  assert.equal(artifact.creation_transition_event_present, false);
  assert.equal(artifact.decision_result, "REJECT/RECONCILE");
  assert.equal(artifact.rejection_code, "CREATION_TRANSITION_INVALID");
  assert.equal(artifact.non_authoritative_row_ignored, true);
  assert.equal(artifact.authoritative_subject_created, false);
  assert.equal(artifact.authoritative_namespace_created, false);
  assert.equal(artifact.authoritative_transition_emitted, false);
  assert.equal(artifact.projection_changed, false);
  assert.equal(artifact.dispatch_performed, false);
  assert.equal(artifact.external_connector_called, false);
  assert.equal(artifact.effect_evidence_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.direct_storage_row.insertion_path, "DIRECT_STORAGE_INSERT");
  assert.equal(artifact.direct_storage_row.system_initializer_path_used, false);
  assert.equal(artifact.direct_storage_row.governed_transition_request_present, false);
  assert.equal(artifact.direct_storage_row.creation_transition_event_present, false);
  assert.equal(artifact.reconciliation_event.rejection_code, "CREATION_TRANSITION_INVALID");
  assert.equal(artifact.reconciliation_event.non_authoritative_row_ignored, true);
  assert.equal(artifact.reconciliation_event.authoritative_subject_created, false);
  assert.equal(artifact.reconciliation_event.authoritative_namespace_created, false);
  assert.equal(artifact.reconciliation_event.authoritative_transition_emitted, false);
  assert.equal(artifact.reconciliation_event.projection_changed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_system_initializer_path",
    "require_governed_creation_transition_request",
    "require_creation_transition_event",
    "require_reject_direct_storage_insert",
    "require_ignore_non_authoritative_row",
    "require_no_authoritative_subject_without_initializer",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.creation_transition_gate[key], true, key);
  }

  for (const key of [
    "allow_direct_storage_insert_as_authoritative",
    "allow_namespace_creation_without_system_initializer",
    "allow_projection_change_from_non_authoritative_row",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.creation_transition_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT33CreationTransitionInvalid(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT33CreationTransitionInvalidVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.decision_result, "REJECT/RECONCILE");
  assert.equal(verification.rejection_code, "CREATION_TRANSITION_INVALID");
  assert.equal(verification.non_authoritative_row_ignored, true);
  assert.equal(verification.authoritative_subject_created, false);
  assert.equal(verification.projection_changed, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpDirectInsertOverclaim = "/tmp/hbce-matrix-eg-t33-direct-insert-overclaim.json";
  const directInsertOverclaim = {
    ...artifact,
    system_initializer_path_used: true,
    governed_transition_request_present: true,
    creation_transition_event_present: true,
    decision_result: "ALLOW",
    rejection_code: null,
    non_authoritative_row_ignored: false,
    authoritative_subject_created: true,
    authoritative_namespace_created: true,
    authoritative_transition_emitted: true,
    projection_changed: true,
    direct_storage_row: {
      ...artifact.direct_storage_row,
      system_initializer_path_used: true,
      governed_transition_request_present: true,
      creation_transition_event_present: true
    },
    reconciliation_event: {
      ...artifact.reconciliation_event,
      rejection_code: null,
      non_authoritative_row_ignored: false,
      authoritative_subject_created: true,
      authoritative_namespace_created: true,
      authoritative_transition_emitted: true,
      projection_changed: true
    },
    creation_transition_gate: {
      ...artifact.creation_transition_gate,
      allow_direct_storage_insert_as_authoritative: true,
      allow_namespace_creation_without_system_initializer: true,
      allow_projection_change_from_non_authoritative_row: true
    }
  };
  directInsertOverclaim.direct_storage_row.row_hash = runtime.sha256Record({ ...directInsertOverclaim.direct_storage_row, row_hash: null });
  directInsertOverclaim.content_sha256 = runtime.sha256Record({ ...directInsertOverclaim, content_sha256: null });
  fs.writeFileSync(tmpDirectInsertOverclaim, JSON.stringify(directInsertOverclaim, null, 2));

  const directInsertVerification = runtime.verifyEGT33CreationTransitionInvalid(tmpDirectInsertOverclaim);
  assert.equal(directInsertVerification.verified, false);
  assert.ok(directInsertVerification.errors.some((error) => [
    "EG_T33_FIELD_INVALID",
    "EG_T33_DIRECT_ROW_SYSTEM_INITIALIZER_OVERCLAIM",
    "EG_T33_RECONCILIATION_CODE_INVALID",
    "EG_T33_RECONCILIATION_REQUIRED_FLAG_INVALID",
    "EG_T33_RECONCILIATION_OVERCLAIM",
    "EG_T33_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpBoundaryOverclaim = "/tmp/hbce-matrix-eg-t33-boundary-overclaim.json";
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

  const boundaryVerification = runtime.verifyEGT33CreationTransitionInvalid(tmpBoundaryOverclaim);
  assert.equal(boundaryVerification.verified, false);
  assert.ok(boundaryVerification.errors.some((error) => error.code === "EG_T33_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.direct_storage_insert_detected, true);
  assert.equal(evidence.system_initializer_path_used, false);
  assert.equal(evidence.governed_transition_request_present, false);
  assert.equal(evidence.creation_transition_event_present, false);
  assert.equal(evidence.decision_result, "REJECT/RECONCILE");
  assert.equal(evidence.rejection_code, "CREATION_TRANSITION_INVALID");
  assert.equal(evidence.non_authoritative_row_ignored, true);
  assert.equal(evidence.authoritative_subject_created, false);
  assert.equal(evidence.authoritative_namespace_created, false);
  assert.equal(evidence.authoritative_transition_emitted, false);
  assert.equal(evidence.projection_changed, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.eg_t33_runtime_artifact_created, true);

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

console.log("PROG_252_MATRIX_EG_T33_CREATION_TRANSITION_INVALID_TEST=PASS");
