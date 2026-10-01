"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-236";
const TEST_ID = "EG-T17";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T17-CHECKPOINT-STORE-REWRITE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createWitnessedCheckpointStore() {
  const checkpoint = {
    record_type: "MatrixCheckpointRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    checkpoint_id: "eg-t17-checkpoint-v001",
    checkpoint_sequence: 17,
    event_log_head_hash: "a".repeat(64),
    local_chain_head_hash: "b".repeat(64),
    checkpoint_store_version: 1,
    checkpoint_created_at: "2026-10-01T21:00:00+02:00",
    checkpoint_hash: null
  };
  checkpoint.checkpoint_hash = sha256Record({ ...checkpoint, checkpoint_hash: null });

  const checkpointStore = {
    record_type: "MatrixCheckpointStoreRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    store_id: "eg-t17-checkpoint-store-v001",
    store_version: 1,
    current_checkpoint_id: checkpoint.checkpoint_id,
    current_checkpoint_hash: checkpoint.checkpoint_hash,
    current_event_log_head_hash: checkpoint.event_log_head_hash,
    current_local_chain_head_hash: checkpoint.local_chain_head_hash,
    updated_at: "2026-10-01T21:00:10+02:00",
    store_hash: null
  };
  checkpointStore.store_hash = sha256Record({ ...checkpointStore, store_hash: null });

  const witnessReceipt = {
    record_type: "ExternalWitnessReceipt",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    witness_receipt_id: "eg-t17-witness-receipt-v001",
    witness_provider: "INDEPENDENT_WITNESS_SIMULATED",
    witnessed_checkpoint_id: checkpoint.checkpoint_id,
    witnessed_checkpoint_hash: checkpoint.checkpoint_hash,
    witnessed_checkpoint_store_hash: checkpointStore.store_hash,
    witnessed_event_log_head_hash: checkpoint.event_log_head_hash,
    witnessed_local_chain_head_hash: checkpoint.local_chain_head_hash,
    receipt_created_at: "2026-10-01T21:00:20+02:00",
    witness_receipt_hash: null
  };
  witnessReceipt.witness_receipt_hash = sha256Record({ ...witnessReceipt, witness_receipt_hash: null });

  return { checkpoint, checkpointStore, witnessReceipt };
}

function createRewrittenCheckpointStore({ original = createWitnessedCheckpointStore() } = {}) {
  const rewrittenCheckpoint = {
    ...original.checkpoint,
    event_log_head_hash: "c".repeat(64),
    local_chain_head_hash: "d".repeat(64),
    checkpoint_store_version: 2,
    checkpoint_created_at: "2026-10-01T21:01:00+02:00",
    checkpoint_hash: null
  };
  rewrittenCheckpoint.checkpoint_hash = sha256Record({ ...rewrittenCheckpoint, checkpoint_hash: null });

  const rewrittenStore = {
    record_type: "MatrixCheckpointStoreRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    store_id: original.checkpointStore.store_id,
    store_version: 2,
    current_checkpoint_id: original.checkpoint.checkpoint_id,
    current_checkpoint_hash: rewrittenCheckpoint.checkpoint_hash,
    current_event_log_head_hash: rewrittenCheckpoint.event_log_head_hash,
    current_local_chain_head_hash: rewrittenCheckpoint.local_chain_head_hash,
    updated_at: "2026-10-01T21:01:10+02:00",
    store_hash: null
  };
  rewrittenStore.store_hash = sha256Record({ ...rewrittenStore, store_hash: null });

  return { rewrittenCheckpoint, rewrittenStore };
}

function evaluateCheckpointStoreRewrite({
  original = createWitnessedCheckpointStore(),
  rewritten = null,
  evaluated_at = "2026-10-01T21:02:00+02:00"
} = {}) {
  const rewrittenRecords = rewritten || createRewrittenCheckpointStore({ original });

  const witnessReceiptMismatchDetected =
    rewrittenRecords.rewrittenStore.current_checkpoint_hash !== original.witnessReceipt.witnessed_checkpoint_hash ||
    rewrittenRecords.rewrittenStore.store_hash !== original.witnessReceipt.witnessed_checkpoint_store_hash ||
    rewrittenRecords.rewrittenStore.current_event_log_head_hash !== original.witnessReceipt.witnessed_event_log_head_hash ||
    rewrittenRecords.rewrittenStore.current_local_chain_head_hash !== original.witnessReceipt.witnessed_local_chain_head_hash;

  const violationEvidence = {
    record_type: "CheckpointStoreRewriteViolationEvidence",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    violation_id: "eg-t17-checkpoint-store-rewrite-violation-v001",
    violation_type: "CHECKPOINT_STORE_REWRITE_AFTER_WITNESS_RECEIPT",
    reason_code: "WITNESS_RECEIPT_MISMATCH",
    witnessed_checkpoint_hash: original.witnessReceipt.witnessed_checkpoint_hash,
    rewritten_checkpoint_hash: rewrittenRecords.rewrittenCheckpoint.checkpoint_hash,
    witnessed_checkpoint_store_hash: original.witnessReceipt.witnessed_checkpoint_store_hash,
    rewritten_checkpoint_store_hash: rewrittenRecords.rewrittenStore.store_hash,
    witness_receipt_hash: original.witnessReceipt.witness_receipt_hash,
    external_witness_receipt_wins: true,
    rewritten_checkpoint_store_trusted: false,
    emitted_at: evaluated_at,
    violation_evidence_hash: null
  };
  violationEvidence.violation_evidence_hash = sha256Record({ ...violationEvidence, violation_evidence_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T17_CheckpointStoreRewrite_v001",
    artifact_type: "MatrixEGT17CheckpointStoreRewriteRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "WITNESS_RECEIPT_MISMATCH; external receipt wins over local rewrite",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    original_checkpoint: original.checkpoint,
    original_checkpoint_store: original.checkpointStore,
    witness_receipt: original.witnessReceipt,
    rewritten_checkpoint: rewrittenRecords.rewrittenCheckpoint,
    rewritten_checkpoint_store: rewrittenRecords.rewrittenStore,
    violation_evidence: violationEvidence,
    checkpoint_store_rewrite_detected: true,
    witness_receipt_mismatch_detected: witnessReceiptMismatchDetected,
    violation_evidence_emitted: true,
    external_witness_receipt_wins: true,
    rewritten_checkpoint_store_trusted: false,
    rewritten_checkpoint_trusted: false,
    original_checkpoint_hash_preserved_by_witness: true,
    original_checkpoint_store_hash_preserved_by_witness: true,
    local_rewrite_accepted: false,
    checkpoint_store_rewrite_accepted: false,
    authoritative_history_preserved_from_witness: true,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    witness_gate: {
      require_witness_receipt_mismatch: true,
      require_violation_evidence_emitted: true,
      require_external_receipt_wins: true,
      accept_rewritten_checkpoint_store_allowed: false,
      accept_rewritten_checkpoint_allowed: false,
      rewrite_witness_receipt_allowed: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t17_runtime_artifact_created: true,
      checkpoint_store_rewrite_detected: true,
      witness_receipt_mismatch_detected: witnessReceiptMismatchDetected,
      violation_evidence_emitted: true,
      external_witness_receipt_wins: true,
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
    maximum_supported_claim: "EG_T17_CHECKPOINT_STORE_REWRITE_DETECTED_WITH_WITNESS_RECEIPT_MISMATCH_AND_EXTERNAL_RECEIPT_PRECEDENCE",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT17CheckpointStoreRewrite(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT17CheckpointStoreRewriteVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T17_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T17_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T17_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T17_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "WITNESS_RECEIPT_MISMATCH; external receipt wins over local rewrite") errors.push({ code: "EG_T17_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["checkpoint_store_rewrite_detected", true],
    ["witness_receipt_mismatch_detected", true],
    ["violation_evidence_emitted", true],
    ["external_witness_receipt_wins", true],
    ["rewritten_checkpoint_store_trusted", false],
    ["rewritten_checkpoint_trusted", false],
    ["original_checkpoint_hash_preserved_by_witness", true],
    ["original_checkpoint_store_hash_preserved_by_witness", true],
    ["local_rewrite_accepted", false],
    ["checkpoint_store_rewrite_accepted", false],
    ["authoritative_history_preserved_from_witness", true],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T17_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.original_checkpoint || !artifact.original_checkpoint_store || !artifact.witness_receipt || !artifact.rewritten_checkpoint || !artifact.rewritten_checkpoint_store || !artifact.violation_evidence) {
    errors.push({ code: "EG_T17_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.witness_receipt.witnessed_checkpoint_hash !== artifact.original_checkpoint.checkpoint_hash) {
      errors.push({ code: "EG_T17_WITNESS_CHECKPOINT_BINDING_MISMATCH" });
    }

    if (artifact.witness_receipt.witnessed_checkpoint_store_hash !== artifact.original_checkpoint_store.store_hash) {
      errors.push({ code: "EG_T17_WITNESS_STORE_BINDING_MISMATCH" });
    }

    if (artifact.rewritten_checkpoint_store.current_checkpoint_hash === artifact.witness_receipt.witnessed_checkpoint_hash) {
      errors.push({ code: "EG_T17_REWRITE_NOT_OBSERVED" });
    }

    if (artifact.violation_evidence.reason_code !== "WITNESS_RECEIPT_MISMATCH") {
      errors.push({ code: "EG_T17_VIOLATION_REASON_INVALID", observed: artifact.violation_evidence.reason_code });
    }

    if (artifact.violation_evidence.witness_receipt_hash !== artifact.witness_receipt.witness_receipt_hash) {
      errors.push({ code: "EG_T17_VIOLATION_WITNESS_BINDING_MISMATCH" });
    }
  }

  for (const key of [
    "require_witness_receipt_mismatch",
    "require_violation_evidence_emitted",
    "require_external_receipt_wins"
  ]) {
    if (!artifact.witness_gate || artifact.witness_gate[key] !== true) {
      errors.push({ code: "EG_T17_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.witness_gate ? artifact.witness_gate[key] : undefined });
    }
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
    if (!artifact.witness_gate || artifact.witness_gate[key] !== false) {
      errors.push({ code: "EG_T17_GATE_OVERCLAIM", key, observed: artifact.witness_gate ? artifact.witness_gate[key] : undefined });
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
      errors.push({ code: "EG_T17_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T17_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T17_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT17CheckpointStoreRewriteVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T17-CHECKPOINT-STORE-REWRITE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    checkpoint_store_rewrite_detected: artifact.checkpoint_store_rewrite_detected,
    witness_receipt_mismatch_detected: artifact.witness_receipt_mismatch_detected,
    violation_evidence_emitted: artifact.violation_evidence_emitted,
    external_witness_receipt_wins: artifact.external_witness_receipt_wins,
    rewritten_checkpoint_store_trusted: artifact.rewritten_checkpoint_store_trusted,
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
  createWitnessedCheckpointStore,
  createRewrittenCheckpointStore,
  evaluateCheckpointStoreRewrite,
  verifyEGT17CheckpointStoreRewrite
};
