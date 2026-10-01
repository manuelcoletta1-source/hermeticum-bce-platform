"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t17-checkpoint-store-rewrite.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T17_CheckpointStoreRewrite_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T17_PROG-236-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT17CheckpointStoreRewriteRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "WITNESS_RECEIPT_MISMATCH; external receipt wins over local rewrite");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.checkpoint_store_rewrite_detected, true);
  assert.equal(artifact.witness_receipt_mismatch_detected, true);
  assert.equal(artifact.violation_evidence_emitted, true);
  assert.equal(artifact.external_witness_receipt_wins, true);
  assert.equal(artifact.rewritten_checkpoint_store_trusted, false);
  assert.equal(artifact.rewritten_checkpoint_trusted, false);
  assert.equal(artifact.local_rewrite_accepted, false);
  assert.equal(artifact.checkpoint_store_rewrite_accepted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.notEqual(artifact.rewritten_checkpoint_store.current_checkpoint_hash, artifact.witness_receipt.witnessed_checkpoint_hash);
  assert.notEqual(artifact.rewritten_checkpoint_store.store_hash, artifact.witness_receipt.witnessed_checkpoint_store_hash);
  assert.equal(artifact.witness_receipt.witnessed_checkpoint_hash, artifact.original_checkpoint.checkpoint_hash);
  assert.equal(artifact.witness_receipt.witnessed_checkpoint_store_hash, artifact.original_checkpoint_store.store_hash);
  assert.equal(artifact.violation_evidence.reason_code, "WITNESS_RECEIPT_MISMATCH");
  assert.equal(artifact.violation_evidence.external_witness_receipt_wins, true);
  assert.equal(artifact.violation_evidence.rewritten_checkpoint_store_trusted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_witness_receipt_mismatch",
    "require_violation_evidence_emitted",
    "require_external_receipt_wins"
  ]) {
    assert.equal(artifact.witness_gate[key], true, key);
  }

  for (const key of [
    "accept_rewritten_checkpoint_store_allowed",
    "accept_rewritten_checkpoint_allowed",
    "rewrite_witness_receipt_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.witness_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT17CheckpointStoreRewrite(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT17CheckpointStoreRewriteVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.checkpoint_store_rewrite_detected, true);
  assert.equal(verification.witness_receipt_mismatch_detected, true);
  assert.equal(verification.violation_evidence_emitted, true);
  assert.equal(verification.external_witness_receipt_wins, true);
  assert.equal(verification.rewritten_checkpoint_store_trusted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t17-rewrite-accepted-overclaim.json";
  const accepted = {
    ...artifact,
    rewritten_checkpoint_store_trusted: true,
    rewritten_checkpoint_trusted: true,
    checkpoint_store_rewrite_accepted: true
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT17CheckpointStoreRewrite(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => error.code === "EG_T17_FIELD_INVALID"));

  const tmpExecution = "/tmp/hbce-matrix-eg-t17-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    witness_gate: {
      ...artifact.witness_gate,
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

  const executionVerification = runtime.verifyEGT17CheckpointStoreRewrite(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T17_GATE_OVERCLAIM",
    "EG_T17_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.checkpoint_store_rewrite_detected, true);
  assert.equal(evidence.witness_receipt_mismatch_detected, true);
  assert.equal(evidence.violation_evidence_emitted, true);
  assert.equal(evidence.external_witness_receipt_wins, true);
  assert.equal(evidence.rewritten_checkpoint_store_trusted, false);
  assert.equal(evidence.rewritten_checkpoint_trusted, false);
  assert.equal(evidence.eg_t17_runtime_artifact_created, true);

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

console.log("PROG_236_MATRIX_EG_T17_CHECKPOINT_STORE_REWRITE_TEST=PASS");
