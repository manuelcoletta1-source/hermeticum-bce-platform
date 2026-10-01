"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t14-manual-projection-mutation.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T14_ManualProjectionMutation_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T14_PROG-233-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT14ManualProjectionMutationRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "Reconciliation restores event-derived state and records anomaly");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.manual_projection_mutation_detected, true);
  assert.equal(artifact.anomaly_recorded, true);
  assert.equal(artifact.reconciliation_performed, true);
  assert.equal(artifact.restored_event_derived_state, true);
  assert.equal(artifact.manual_projection_accepted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.mutated_projection_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(artifact.restored_projection_state, "BLOCKED");
  assert.equal(artifact.mutated_projection_state_version, 999);
  assert.equal(artifact.restored_projection_state_version, 3);
  assert.equal(artifact.restored_matches_event_derived_state, true);
  assert.equal(artifact.restored_projection.state, artifact.authoritative_event_derived_state.derived_state);
  assert.equal(artifact.restored_projection.state_version, artifact.authoritative_event_derived_state.derived_state_version);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.anomaly_record.anomaly_type, "MANUAL_PROJECTION_MUTATION");
  assert.equal(artifact.anomaly_record.detected_mutated_projection_hash, artifact.manually_mutated_projection.projection_hash);
  assert.equal(artifact.anomaly_record.mutation_allowed, false);
  assert.equal(artifact.anomaly_record.reconciliation_required, true);
  assert.equal(artifact.reconciliation_record.anomaly_sha256, artifact.anomaly_record.anomaly_sha256);
  assert.equal(artifact.reconciliation_record.reconciliation_result, "RESTORED_EVENT_DERIVED_STATE");
  assert.equal(artifact.restored_projection.reconciliation_sha256, artifact.reconciliation_record.reconciliation_sha256);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.historical_event_log_rewritten, false);
  assert.equal(artifact.event_log_rewritten, false);
  assert.equal(artifact.authoritative_event_created_by_reconciliation, false);
  assert.equal(artifact.duplicate_authoritative_event_emitted, false);
  assert.equal(artifact.duplicate_effect_evidence_created, false);
  assert.equal(artifact.target_receipt_created, false);
  assert.equal(artifact.execution_effect_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_event_derived_state_as_source_of_truth",
    "require_manual_mutation_anomaly_record",
    "require_projection_restore_to_event_derived_state"
  ]) {
    assert.equal(artifact.reconciliation_gate[key], true, key);
  }

  for (const key of [
    "accept_manual_projection_mutation_allowed",
    "rewrite_authoritative_event_log_allowed",
    "create_new_authoritative_event_during_reconciliation_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.reconciliation_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT14ManualProjectionMutation(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT14ManualProjectionMutationVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.manual_projection_mutation_detected, true);
  assert.equal(verification.anomaly_recorded, true);
  assert.equal(verification.reconciliation_performed, true);
  assert.equal(verification.restored_event_derived_state, true);
  assert.equal(verification.mutated_projection_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(verification.restored_projection_state, "BLOCKED");
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t14-manual-mutation-accepted-overclaim.json";
  const accepted = {
    ...artifact,
    manual_projection_accepted: true,
    restored_event_derived_state: false,
    restored_matches_event_derived_state: false
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT14ManualProjectionMutation(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => error.code === "EG_T14_FIELD_INVALID"));

  const tmpRewrite = "/tmp/hbce-matrix-eg-t14-event-log-rewrite-overclaim.json";
  const rewrite = {
    ...artifact,
    event_log_rewritten: true,
    historical_event_log_rewritten: true,
    authoritative_event_created_by_reconciliation: true
  };
  rewrite.content_sha256 = runtime.sha256Record({ ...rewrite, content_sha256: null });
  fs.writeFileSync(tmpRewrite, JSON.stringify(rewrite, null, 2));

  const rewriteVerification = runtime.verifyEGT14ManualProjectionMutation(tmpRewrite);
  assert.equal(rewriteVerification.verified, false);
  assert.ok(rewriteVerification.errors.some((error) => error.code === "EG_T14_FIELD_INVALID"));
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpExecution = "/tmp/hbce-matrix-eg-t14-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    reconciliation_gate: {
      ...artifact.reconciliation_gate,
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

  const executionVerification = runtime.verifyEGT14ManualProjectionMutation(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T14_GATE_OVERCLAIM",
    "EG_T14_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.manual_projection_mutation_detected, true);
  assert.equal(evidence.anomaly_recorded, true);
  assert.equal(evidence.reconciliation_performed, true);
  assert.equal(evidence.restored_event_derived_state, true);
  assert.equal(evidence.manual_projection_accepted, false);
  assert.equal(evidence.mutated_projection_state, "RELEASE_CLEAN_ELIGIBLE");
  assert.equal(evidence.restored_projection_state, "BLOCKED");
  assert.equal(evidence.restored_matches_event_derived_state, true);
  assert.equal(evidence.eg_t14_runtime_artifact_created, true);

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

console.log("PROG_233_MATRIX_EG_T14_MANUAL_PROJECTION_MUTATION_TEST=PASS");
