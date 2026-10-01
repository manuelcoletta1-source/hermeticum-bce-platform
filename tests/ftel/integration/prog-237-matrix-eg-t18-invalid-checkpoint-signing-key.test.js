"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t18-invalid-checkpoint-signing-key.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T18_InvalidCheckpointSigningKey_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T18_PROG-237-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT18InvalidCheckpointSigningKeyRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "CHECKPOINT_INVALID/SIGNER_KEY_NOT_ALLOWED; checkpoint not trusted");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.invalid_checkpoint_signing_key_detected, true);
  assert.equal(artifact.revoked_checkpoint_signing_key_detected, true);
  assert.equal(artifact.signer_key_not_allowed_detected, true);
  assert.equal(artifact.checkpoint_invalid_detected, true);
  assert.equal(artifact.checkpoint_trusted, false);
  assert.equal(artifact.checkpoint_accepted, false);
  assert.equal(artifact.checkpoint_store_updated, false);
  assert.equal(artifact.witness_receipt_created, false);
  assert.equal(artifact.external_witness_called, false);
  assert.equal(artifact.violation_evidence_emitted, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.signer_key_record.key_status, "REVOKED");
  assert.equal(artifact.signer_key_record.allowed_for_checkpoint_signing, false);
  assert.equal(artifact.validation_verdict.validation_result, "REJECT");
  assert.equal(artifact.validation_verdict.checkpoint_trusted, false);
  assert.equal(artifact.validation_verdict.reason_codes.includes("CHECKPOINT_INVALID"), true);
  assert.equal(artifact.validation_verdict.reason_codes.includes("SIGNER_KEY_NOT_ALLOWED"), true);
  assert.equal(artifact.violation_evidence.checkpoint_hash, artifact.checkpoint_under_validation.checkpoint_hash);
  assert.equal(artifact.violation_evidence.checkpoint_trusted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_checkpoint_invalid",
    "require_signer_key_not_allowed",
    "require_checkpoint_not_trusted",
    "require_violation_evidence_emitted"
  ]) {
    assert.equal(artifact.signer_gate[key], true, key);
  }

  for (const key of [
    "accept_invalid_checkpoint_allowed",
    "accept_disallowed_signer_allowed",
    "update_checkpoint_store_allowed",
    "create_witness_receipt_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    assert.equal(artifact.signer_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT18InvalidCheckpointSigningKey(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT18InvalidCheckpointSigningKeyVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.invalid_checkpoint_signing_key_detected, true);
  assert.equal(verification.signer_key_not_allowed_detected, true);
  assert.equal(verification.checkpoint_invalid_detected, true);
  assert.equal(verification.checkpoint_trusted, false);
  assert.equal(verification.violation_evidence_emitted, true);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpTrusted = "/tmp/hbce-matrix-eg-t18-trusted-overclaim.json";
  const trusted = {
    ...artifact,
    checkpoint_trusted: true,
    checkpoint_accepted: true,
    checkpoint_store_updated: true
  };
  trusted.content_sha256 = runtime.sha256Record({ ...trusted, content_sha256: null });
  fs.writeFileSync(tmpTrusted, JSON.stringify(trusted, null, 2));

  const trustedVerification = runtime.verifyEGT18InvalidCheckpointSigningKey(tmpTrusted);
  assert.equal(trustedVerification.verified, false);
  assert.ok(trustedVerification.errors.some((error) => error.code === "EG_T18_FIELD_INVALID"));

  const tmpExecution = "/tmp/hbce-matrix-eg-t18-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    signer_gate: {
      ...artifact.signer_gate,
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

  const executionVerification = runtime.verifyEGT18InvalidCheckpointSigningKey(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => [
    "EG_T18_GATE_OVERCLAIM",
    "EG_T18_EXECUTION_BOUNDARY_OVERCLAIM"
  ].includes(error.code)));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.evidence_class, "RUNTIME_ARTIFACT_CREATED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.invalid_checkpoint_signing_key_detected, true);
  assert.equal(evidence.revoked_checkpoint_signing_key_detected, true);
  assert.equal(evidence.signer_key_not_allowed_detected, true);
  assert.equal(evidence.checkpoint_invalid_detected, true);
  assert.equal(evidence.checkpoint_trusted, false);
  assert.equal(evidence.checkpoint_accepted, false);
  assert.equal(evidence.violation_evidence_emitted, true);
  assert.equal(evidence.eg_t18_runtime_artifact_created, true);

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

console.log("PROG_237_MATRIX_EG_T18_INVALID_CHECKPOINT_SIGNING_KEY_TEST=PASS");
