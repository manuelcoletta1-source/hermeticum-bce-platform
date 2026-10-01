"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t16-witnessed-event-rewrite.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T16_WitnessedEventRewrite_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T16_PROG-235-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT16WitnessedEventRewriteRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "CHECKPOINT_MISMATCH or WITNESS_RECEIPT_MISMATCH; violation evidence emitted");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.witnessed_event_rewrite_detected, true);
  assert.equal(artifact.local_chain_recomputed_after_witness, true);
  assert.equal(artifact.checkpoint_mismatch_detected, true);
  assert.equal(artifact.witness_receipt_mismatch_detected, true);
  assert.equal(artifact.violation_evidence_emitted, true);
  assert.equal(artifact.external_witness_receipt_wins, true);
  assert.equal(artifact.rewritten_local_chain_trusted, false);
  assert.equal(artifact.recomputed_checkpoint_trusted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.notEqual(artifact.rewritten_event.event_hash, artifact.witness_receipt.witnessed_event_hash);
  assert.notEqual(artifact.recomputed_local_chain.chain_head_hash, artifact.witness_receipt.witnessed_chain_head_hash);
  assert.notEqual(artifact.recomputed_checkpoint.checkpoint_hash, artifact.witness_receipt.witnessed_checkpoint_hash);
  assert.equal(artifact.violation_evidence.reason_codes.includes("CHECKPOINT_MISMATCH"), true);
  assert.equal(artifact.violation_evidence.reason_codes.includes("WITNESS_RECEIPT_MISMATCH"), true);
  assert.equal(artifact.violation_evidence.external_witness_receipt_wins, true);
  assert.equal(artifact.violation_evidence.rewritten_local_chain_trusted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_checkpoint_mismatch_or_witness_receipt_mismatch",
    "require_violation_evidence_emitted",
    "require_external_witness_receipt_wins"
  ]) {
    assert.equal(artifact.mismatch_gate[key], true, key);
  }

  for (const key of [
    "accept_rewritten_local_chain_allowed",
    "accept_recomputed_checkpoint_allowed",
    "rewrite_witness_receipt_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.mismatch_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT16WitnessedEventRewrite(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT16WitnessedEventRewriteVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.checkpoint_mismatch_detected, true);
  assert.equal(verification.witness_receipt_mismatch_detected, true);
  assert.equal(verification.violation_evidence_emitted, true);
  assert.equal(verification.external_witness_receipt_wins, true);
  assert.equal(verification.rewritten_local_chain_trusted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccepted = "/tmp/hbce-matrix-eg-t16-rewrite-accepted-overclaim.json";
  const accepted = {
    ...artifact,
    rewritten_local_chain_trusted: true,
    recomputed_checkpoint_trusted: true,
    rewritten_event_accepted_as_authoritative: true
  };
  accepted.content_sha256 = runtime.sha256Record({ ...accepted, content_sha256: null });
  fs.writeFileSync(tmpAccepted, JSON.stringify(accepted, null, 2));

  const acceptedVerification = runtime.verifyEGT16WitnessedEventRewrite(tmpAccepted);
  assert.equal(acceptedVerification.verified, false);
  assert.ok(acceptedVerification.errors.some((error) => error.code === "EG_T16_FIELD_INVALID"));

  const tmpNoMismatch = "/tmp/hbce-matrix-eg-t16-no-mismatch-overclaim.json";
  const noMismatch = {
    ...artifact,
    checkpoint_mismatch_detected: false,
    witness_receipt_mismatch_detected: false
  };
  noMismatch.content_sha256 = runtime.sha256Record({ ...noMismatch, content_sha256: null });
  fs.writeFileSync(tmpNoMismatch, JSON.stringify(noMismatch, null, 2));

  const noMismatchVerification = runtime.verifyEGT16WitnessedEventRewrite(tmpNoMismatch);
  assert.equal(noMismatchVerification.verified, false);
  assert.ok(noMismatchVerification.errors.some((error) => error.code === "EG_T16_REQUIRED_MISMATCH_NOT_DETECTED"));
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpExecution = "/tmp/hbce-matrix-eg-t16-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    mismatch_gate: {
      ...artifact.mismatch_gate,
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

  const executionVerification = runtime.verifyEGT16WitnessedEventRewrite(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T16_GATE_OVERCLAIM",
    "EG_T16_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.witnessed_event_rewrite_detected, true);
  assert.equal(evidence.local_chain_recomputed_after_witness, true);
  assert.equal(evidence.checkpoint_mismatch_detected, true);
  assert.equal(evidence.witness_receipt_mismatch_detected, true);
  assert.equal(evidence.violation_evidence_emitted, true);
  assert.equal(evidence.external_witness_receipt_wins, true);
  assert.equal(evidence.rewritten_local_chain_trusted, false);
  assert.equal(evidence.recomputed_checkpoint_trusted, false);
  assert.equal(evidence.eg_t16_runtime_artifact_created, true);

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

console.log("PROG_235_MATRIX_EG_T16_WITNESSED_EVENT_REWRITE_TEST=PASS");
