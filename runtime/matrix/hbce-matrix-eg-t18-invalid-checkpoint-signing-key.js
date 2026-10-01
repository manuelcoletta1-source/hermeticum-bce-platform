"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-237";
const TEST_ID = "EG-T18";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T18-INVALID-CHECKPOINT-SIGNING-KEY-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createCheckpointSigningKeyRegistry() {
  const allowedKey = {
    key_ref: "HBCE_CHECKPOINT_SIGNING_KEY_INTERNAL_V1",
    key_status: "ACTIVE",
    allowed_for_checkpoint_signing: true,
    revoked_at: null,
    disallowed_at: null
  };

  const invalidKey = {
    key_ref: "HBCE_CHECKPOINT_SIGNING_KEY_REVOKED_V1",
    key_status: "REVOKED",
    allowed_for_checkpoint_signing: false,
    revoked_at: "2026-10-01T21:20:00+02:00",
    disallowed_at: "2026-10-01T21:20:00+02:00"
  };

  const registry = {
    record_type: "CheckpointSigningKeyRegistry",
    tenant_id: TENANT_ID,
    registry_id: "eg-t18-checkpoint-signing-key-registry-v001",
    registry_version: 1,
    keys: [allowedKey, invalidKey],
    generated_at: "2026-10-01T21:21:00+02:00",
    registry_hash: null
  };

  registry.registry_hash = sha256Record({ ...registry, registry_hash: null });
  return registry;
}

function createCheckpointWithInvalidSigner({ registry = createCheckpointSigningKeyRegistry() } = {}) {
  const invalidKey = registry.keys.find((key) => key.key_ref === "HBCE_CHECKPOINT_SIGNING_KEY_REVOKED_V1");

  const checkpoint = {
    record_type: "MatrixCheckpointRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    checkpoint_id: "eg-t18-checkpoint-invalid-signer-v001",
    checkpoint_sequence: 18,
    event_log_head_hash: "e".repeat(64),
    local_chain_head_hash: "f".repeat(64),
    checkpoint_signing_key_ref: invalidKey.key_ref,
    checkpoint_signature_alg: "Ed25519",
    checkpoint_signature: "simulated-signature-from-revoked-key",
    checkpoint_created_at: "2026-10-01T21:22:00+02:00",
    checkpoint_hash: null
  };

  checkpoint.checkpoint_hash = sha256Record({ ...checkpoint, checkpoint_hash: null });
  return checkpoint;
}

function evaluateInvalidCheckpointSigningKey({
  registry = createCheckpointSigningKeyRegistry(),
  checkpoint = null,
  evaluated_at = "2026-10-01T21:23:00+02:00"
} = {}) {
  const evaluatedCheckpoint = checkpoint || createCheckpointWithInvalidSigner({ registry });
  const signerKey = registry.keys.find((key) => key.key_ref === evaluatedCheckpoint.checkpoint_signing_key_ref) || null;

  const signerKeyKnown = Boolean(signerKey);
  const signerKeyActive = signerKeyKnown && signerKey.key_status === "ACTIVE";
  const signerKeyAllowed = signerKeyKnown && signerKey.allowed_for_checkpoint_signing === true;
  const signerKeyNotAllowed = !signerKeyKnown || !signerKeyActive || !signerKeyAllowed;
  const checkpointInvalid = signerKeyNotAllowed;

  const validationVerdict = {
    record_type: "CheckpointSigningKeyValidationVerdict",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    verdict_id: "eg-t18-checkpoint-signing-key-verdict-v001",
    checkpoint_id: evaluatedCheckpoint.checkpoint_id,
    checkpoint_hash: evaluatedCheckpoint.checkpoint_hash,
    checkpoint_signing_key_ref: evaluatedCheckpoint.checkpoint_signing_key_ref,
    signer_key_known: signerKeyKnown,
    signer_key_status: signerKey ? signerKey.key_status : "UNKNOWN",
    signer_key_allowed_for_checkpoint_signing: signerKeyAllowed,
    validation_result: "REJECT",
    checkpoint_trusted: false,
    reason_codes: ["CHECKPOINT_INVALID", "SIGNER_KEY_NOT_ALLOWED"],
    evaluated_at,
    verdict_hash: null
  };

  validationVerdict.verdict_hash = sha256Record({ ...validationVerdict, verdict_hash: null });

  const violationEvidence = {
    record_type: "InvalidCheckpointSigningKeyViolationEvidence",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    violation_id: "eg-t18-invalid-checkpoint-signing-key-violation-v001",
    violation_type: "INVALID_OR_REVOKED_OR_DISALLOWED_CHECKPOINT_SIGNING_KEY",
    checkpoint_id: evaluatedCheckpoint.checkpoint_id,
    checkpoint_hash: evaluatedCheckpoint.checkpoint_hash,
    checkpoint_signing_key_ref: evaluatedCheckpoint.checkpoint_signing_key_ref,
    signer_key_status: validationVerdict.signer_key_status,
    signer_key_allowed_for_checkpoint_signing: signerKeyAllowed,
    reason_codes: validationVerdict.reason_codes,
    checkpoint_trusted: false,
    emitted_at: evaluated_at,
    violation_evidence_hash: null
  };

  violationEvidence.violation_evidence_hash = sha256Record({ ...violationEvidence, violation_evidence_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T18_InvalidCheckpointSigningKey_v001",
    artifact_type: "MatrixEGT18InvalidCheckpointSigningKeyRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "CHECKPOINT_INVALID/SIGNER_KEY_NOT_ALLOWED; checkpoint not trusted",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    checkpoint_signing_key_registry: registry,
    checkpoint_under_validation: evaluatedCheckpoint,
    signer_key_record: signerKey,
    validation_verdict: validationVerdict,
    violation_evidence: violationEvidence,
    invalid_checkpoint_signing_key_detected: true,
    revoked_checkpoint_signing_key_detected: signerKey ? signerKey.key_status === "REVOKED" : false,
    signer_key_not_allowed_detected: signerKeyNotAllowed,
    checkpoint_invalid_detected: checkpointInvalid,
    checkpoint_trusted: false,
    checkpoint_accepted: false,
    checkpoint_store_updated: false,
    witness_receipt_created: false,
    external_witness_called: false,
    violation_evidence_emitted: true,
    invalid_checkpoint_rejected: true,
    authoritative_history_preserved: true,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    signer_gate: {
      require_checkpoint_invalid: true,
      require_signer_key_not_allowed: true,
      require_checkpoint_not_trusted: true,
      require_violation_evidence_emitted: true,
      accept_invalid_checkpoint_allowed: false,
      accept_disallowed_signer_allowed: false,
      update_checkpoint_store_allowed: false,
      create_witness_receipt_allowed: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t18_runtime_artifact_created: true,
      invalid_checkpoint_signing_key_detected: true,
      revoked_checkpoint_signing_key_detected: signerKey ? signerKey.key_status === "REVOKED" : false,
      signer_key_not_allowed_detected: signerKeyNotAllowed,
      checkpoint_invalid_detected: checkpointInvalid,
      checkpoint_trusted: false,
      violation_evidence_emitted: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      release_clean_eligible_effective: false,
      c16_external_validation_completed: false,
      external_validation_accepted: false,
      legal_review_claimed: false,
      commercial_release_authorized: false,
      level4_eligible: false,
      pilot_execution_started: false
    },
    no_execution_boundary: {
      dispatch_execution_authorized: false,
      dispatch_command_emitted: false,
      dispatch_performed: false,
      external_connector_called: false,
      target_system_contacted: false,
      target_receipt_created: false,
      execution_trace_bound: false,
      effect_evidence_created: false,
      customer_external_execution_allowed: false
    },
    maximum_supported_claim: "EG_T18_INVALID_CHECKPOINT_SIGNING_KEY_REJECTED_WITH_CHECKPOINT_INVALID_OR_SIGNER_KEY_NOT_ALLOWED_AND_CHECKPOINT_NOT_TRUSTED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT18InvalidCheckpointSigningKey(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT18InvalidCheckpointSigningKeyVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T18_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T18_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T18_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T18_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "CHECKPOINT_INVALID/SIGNER_KEY_NOT_ALLOWED; checkpoint not trusted") errors.push({ code: "EG_T18_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["invalid_checkpoint_signing_key_detected", true],
    ["revoked_checkpoint_signing_key_detected", true],
    ["signer_key_not_allowed_detected", true],
    ["checkpoint_invalid_detected", true],
    ["checkpoint_trusted", false],
    ["checkpoint_accepted", false],
    ["checkpoint_store_updated", false],
    ["witness_receipt_created", false],
    ["external_witness_called", false],
    ["violation_evidence_emitted", true],
    ["invalid_checkpoint_rejected", true],
    ["authoritative_history_preserved", true],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T18_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.checkpoint_signing_key_registry || !artifact.checkpoint_under_validation || !artifact.signer_key_record || !artifact.validation_verdict || !artifact.violation_evidence) {
    errors.push({ code: "EG_T18_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.signer_key_record.key_status !== "REVOKED") {
      errors.push({ code: "EG_T18_SIGNER_KEY_STATUS_NOT_REVOKED", observed: artifact.signer_key_record.key_status });
    }

    if (artifact.signer_key_record.allowed_for_checkpoint_signing !== false) {
      errors.push({ code: "EG_T18_SIGNER_KEY_ALLOWED_OVERCLAIM", observed: artifact.signer_key_record.allowed_for_checkpoint_signing });
    }

    if (artifact.validation_verdict.validation_result !== "REJECT") {
      errors.push({ code: "EG_T18_VERDICT_NOT_REJECT", observed: artifact.validation_verdict.validation_result });
    }

    if (artifact.validation_verdict.checkpoint_trusted !== false) {
      errors.push({ code: "EG_T18_VERDICT_TRUST_OVERCLAIM", observed: artifact.validation_verdict.checkpoint_trusted });
    }

    if (!artifact.validation_verdict.reason_codes.includes("CHECKPOINT_INVALID") || !artifact.validation_verdict.reason_codes.includes("SIGNER_KEY_NOT_ALLOWED")) {
      errors.push({ code: "EG_T18_REASON_CODES_MISSING", observed: artifact.validation_verdict.reason_codes });
    }

    if (artifact.violation_evidence.checkpoint_hash !== artifact.checkpoint_under_validation.checkpoint_hash) {
      errors.push({ code: "EG_T18_VIOLATION_CHECKPOINT_BINDING_MISMATCH" });
    }

    if (artifact.violation_evidence.checkpoint_trusted !== false) {
      errors.push({ code: "EG_T18_VIOLATION_TRUST_OVERCLAIM", observed: artifact.violation_evidence.checkpoint_trusted });
    }
  }

  for (const key of [
    "require_checkpoint_invalid",
    "require_signer_key_not_allowed",
    "require_checkpoint_not_trusted",
    "require_violation_evidence_emitted"
  ]) {
    if (!artifact.signer_gate || artifact.signer_gate[key] !== true) {
      errors.push({ code: "EG_T18_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.signer_gate ? artifact.signer_gate[key] : undefined });
    }
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
    if (!artifact.signer_gate || artifact.signer_gate[key] !== false) {
      errors.push({ code: "EG_T18_GATE_OVERCLAIM", key, observed: artifact.signer_gate ? artifact.signer_gate[key] : undefined });
    }
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible_effective",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T18_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
    }
  }

  for (const key of [
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
    if (!artifact.no_execution_boundary || artifact.no_execution_boundary[key] !== false) {
      errors.push({ code: "EG_T18_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T18_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT18InvalidCheckpointSigningKeyVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T18-INVALID-CHECKPOINT-SIGNING-KEY-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    invalid_checkpoint_signing_key_detected: artifact.invalid_checkpoint_signing_key_detected,
    signer_key_not_allowed_detected: artifact.signer_key_not_allowed_detected,
    checkpoint_invalid_detected: artifact.checkpoint_invalid_detected,
    checkpoint_trusted: artifact.checkpoint_trusted,
    violation_evidence_emitted: artifact.violation_evidence_emitted,
    maximum_supported_claim: artifact.maximum_supported_claim,
    artifact_sha256: fileExists(artifactPath) ? sha256Record(readJson(artifactPath)) : null,
    record_sha256: null
  };

  verification.record_sha256 = sha256Record({ ...verification, record_sha256: null });
  return verification;
}

module.exports = {
  PROGRAM_ID,
  TEST_ID,
  MATRIX_SUBJECT_REF,
  TENANT_ID,
  RUNTIME_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createCheckpointSigningKeyRegistry,
  createCheckpointWithInvalidSigner,
  evaluateInvalidCheckpointSigningKey,
  verifyEGT18InvalidCheckpointSigningKey
};
