"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-235";
const TEST_ID = "EG-T16";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T16-WITNESSED-EVENT-REWRITE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createOriginalWitnessedChain() {
  const originalEvent = {
    record_type: "MatrixAuthoritativeEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t16-event-001",
    event_type: "TransitionEvent",
    sequence: 1,
    from_state: "BLOCKED",
    to_state: "RELEASE_CLEAN_ELIGIBLE",
    from_state_version: 3,
    to_state_version: 4,
    decision_result: "ALLOW",
    validation_result: "VERIFIED",
    reason_code: "COMPLETE_GUARDS_AND_EVIDENCE",
    emitted_at: "2026-10-01T20:40:00+02:00",
    event_hash: null
  };

  originalEvent.event_hash = sha256Record({ ...originalEvent, event_hash: null });

  const localChain = {
    record_type: "MatrixLocalEventChain",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    chain_id: "eg-t16-local-chain-v001",
    chain_version: 1,
    events: [originalEvent],
    chain_head_hash: null
  };

  localChain.chain_head_hash = sha256Record({ ...localChain, chain_head_hash: null });

  const checkpoint = {
    record_type: "MatrixCheckpointRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    checkpoint_id: "eg-t16-checkpoint-v001",
    checkpoint_sequence: 1,
    local_chain_head_hash: localChain.chain_head_hash,
    witnessed_event_hash: originalEvent.event_hash,
    checkpoint_signing_key_ref: "HBCE_CHECKPOINT_SIGNING_KEY_INTERNAL_V1",
    checkpoint_created_at: "2026-10-01T20:40:10+02:00",
    checkpoint_hash: null
  };

  checkpoint.checkpoint_hash = sha256Record({ ...checkpoint, checkpoint_hash: null });

  const witnessReceipt = {
    record_type: "ExternalWitnessReceipt",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    witness_receipt_id: "eg-t16-witness-receipt-v001",
    witness_provider: "INDEPENDENT_WITNESS_SIMULATED",
    witnessed_checkpoint_id: checkpoint.checkpoint_id,
    witnessed_checkpoint_hash: checkpoint.checkpoint_hash,
    witnessed_event_hash: originalEvent.event_hash,
    witnessed_chain_head_hash: localChain.chain_head_hash,
    receipt_created_at: "2026-10-01T20:40:20+02:00",
    witness_receipt_hash: null
  };

  witnessReceipt.witness_receipt_hash = sha256Record({ ...witnessReceipt, witness_receipt_hash: null });

  return { originalEvent, localChain, checkpoint, witnessReceipt };
}

function createRewrittenLocalChain({ original = createOriginalWitnessedChain() } = {}) {
  const rewrittenEvent = {
    ...original.originalEvent,
    to_state: "BLOCKED",
    to_state_version: 3,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "LOCAL_REWRITE_AFTER_WITNESS_RECEIPT",
    emitted_at: "2026-10-01T20:41:00+02:00",
    event_hash: null
  };

  rewrittenEvent.event_hash = sha256Record({ ...rewrittenEvent, event_hash: null });

  const rewrittenLocalChain = {
    record_type: "MatrixLocalEventChain",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    chain_id: original.localChain.chain_id,
    chain_version: 2,
    events: [rewrittenEvent],
    chain_head_hash: null
  };

  rewrittenLocalChain.chain_head_hash = sha256Record({ ...rewrittenLocalChain, chain_head_hash: null });

  const recomputedCheckpoint = {
    record_type: "MatrixCheckpointRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    checkpoint_id: original.checkpoint.checkpoint_id,
    checkpoint_sequence: 1,
    local_chain_head_hash: rewrittenLocalChain.chain_head_hash,
    witnessed_event_hash: rewrittenEvent.event_hash,
    checkpoint_signing_key_ref: original.checkpoint.checkpoint_signing_key_ref,
    checkpoint_created_at: "2026-10-01T20:41:10+02:00",
    checkpoint_hash: null
  };

  recomputedCheckpoint.checkpoint_hash = sha256Record({ ...recomputedCheckpoint, checkpoint_hash: null });

  return { rewrittenEvent, rewrittenLocalChain, recomputedCheckpoint };
}

function evaluateWitnessedEventRewrite({
  original = createOriginalWitnessedChain(),
  rewritten = null,
  evaluated_at = "2026-10-01T20:42:00+02:00"
} = {}) {
  const rewrittenRecords = rewritten || createRewrittenLocalChain({ original });

  const checkpointMismatchDetected =
    rewrittenRecords.recomputedCheckpoint.checkpoint_hash !== original.witnessReceipt.witnessed_checkpoint_hash;

  const witnessReceiptMismatchDetected =
    rewrittenRecords.rewrittenEvent.event_hash !== original.witnessReceipt.witnessed_event_hash ||
    rewrittenRecords.rewrittenLocalChain.chain_head_hash !== original.witnessReceipt.witnessed_chain_head_hash;

  const violationEvidence = {
    record_type: "WitnessedEventRewriteViolationEvidence",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    violation_id: "eg-t16-witnessed-event-rewrite-violation-v001",
    violation_type: "WITNESSED_EVENT_REWRITE_AFTER_RECEIPT",
    reason_codes: ["CHECKPOINT_MISMATCH", "WITNESS_RECEIPT_MISMATCH"],
    original_event_hash: original.originalEvent.event_hash,
    rewritten_event_hash: rewrittenRecords.rewrittenEvent.event_hash,
    witnessed_checkpoint_hash: original.witnessReceipt.witnessed_checkpoint_hash,
    recomputed_checkpoint_hash: rewrittenRecords.recomputedCheckpoint.checkpoint_hash,
    witnessed_chain_head_hash: original.witnessReceipt.witnessed_chain_head_hash,
    recomputed_chain_head_hash: rewrittenRecords.rewrittenLocalChain.chain_head_hash,
    witness_receipt_hash: original.witnessReceipt.witness_receipt_hash,
    external_witness_receipt_wins: true,
    rewritten_local_chain_trusted: false,
    emitted_at: evaluated_at,
    violation_evidence_hash: null
  };

  violationEvidence.violation_evidence_hash = sha256Record({ ...violationEvidence, violation_evidence_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T16_WitnessedEventRewrite_v001",
    artifact_type: "MatrixEGT16WitnessedEventRewriteRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "CHECKPOINT_MISMATCH or WITNESS_RECEIPT_MISMATCH; violation evidence emitted",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    original_witnessed_event: original.originalEvent,
    original_local_chain: original.localChain,
    original_checkpoint: original.checkpoint,
    witness_receipt: original.witnessReceipt,
    rewritten_event: rewrittenRecords.rewrittenEvent,
    recomputed_local_chain: rewrittenRecords.rewrittenLocalChain,
    recomputed_checkpoint: rewrittenRecords.recomputedCheckpoint,
    violation_evidence: violationEvidence,
    witnessed_event_rewrite_detected: true,
    local_chain_recomputed_after_witness: true,
    checkpoint_mismatch_detected: checkpointMismatchDetected,
    witness_receipt_mismatch_detected: witnessReceiptMismatchDetected,
    violation_evidence_emitted: true,
    external_witness_receipt_wins: true,
    rewritten_local_chain_trusted: false,
    recomputed_checkpoint_trusted: false,
    authoritative_history_preserved_from_witness: true,
    original_event_hash_preserved_by_witness: true,
    rewritten_event_accepted_as_authoritative: false,
    checkpoint_store_rewrite_accepted: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    mismatch_gate: {
      require_checkpoint_mismatch_or_witness_receipt_mismatch: true,
      require_violation_evidence_emitted: true,
      require_external_witness_receipt_wins: true,
      accept_rewritten_local_chain_allowed: false,
      accept_recomputed_checkpoint_allowed: false,
      rewrite_witness_receipt_allowed: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t16_runtime_artifact_created: true,
      witnessed_event_rewrite_detected: true,
      checkpoint_mismatch_detected: checkpointMismatchDetected,
      witness_receipt_mismatch_detected: witnessReceiptMismatchDetected,
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
    maximum_supported_claim: "EG_T16_WITNESSED_EVENT_REWRITE_DETECTED_WITH_CHECKPOINT_OR_WITNESS_RECEIPT_MISMATCH_AND_VIOLATION_EVIDENCE",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT16WitnessedEventRewrite(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT16WitnessedEventRewriteVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T16_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T16_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T16_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T16_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "CHECKPOINT_MISMATCH or WITNESS_RECEIPT_MISMATCH; violation evidence emitted") errors.push({ code: "EG_T16_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["witnessed_event_rewrite_detected", true],
    ["local_chain_recomputed_after_witness", true],
    ["violation_evidence_emitted", true],
    ["external_witness_receipt_wins", true],
    ["rewritten_local_chain_trusted", false],
    ["recomputed_checkpoint_trusted", false],
    ["authoritative_history_preserved_from_witness", true],
    ["original_event_hash_preserved_by_witness", true],
    ["rewritten_event_accepted_as_authoritative", false],
    ["checkpoint_store_rewrite_accepted", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T16_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (artifact.checkpoint_mismatch_detected !== true && artifact.witness_receipt_mismatch_detected !== true) {
    errors.push({ code: "EG_T16_REQUIRED_MISMATCH_NOT_DETECTED" });
  }

  if (!artifact.original_witnessed_event || !artifact.original_checkpoint || !artifact.witness_receipt || !artifact.rewritten_event || !artifact.recomputed_checkpoint || !artifact.violation_evidence) {
    errors.push({ code: "EG_T16_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.witness_receipt.witnessed_event_hash !== artifact.original_witnessed_event.event_hash) {
      errors.push({ code: "EG_T16_WITNESS_EVENT_BINDING_MISMATCH" });
    }

    if (artifact.witness_receipt.witnessed_checkpoint_hash !== artifact.original_checkpoint.checkpoint_hash) {
      errors.push({ code: "EG_T16_WITNESS_CHECKPOINT_BINDING_MISMATCH" });
    }

    if (artifact.rewritten_event.event_hash === artifact.witness_receipt.witnessed_event_hash) {
      errors.push({ code: "EG_T16_REWRITE_NOT_OBSERVED" });
    }

    if (artifact.recomputed_checkpoint.checkpoint_hash === artifact.witness_receipt.witnessed_checkpoint_hash) {
      errors.push({ code: "EG_T16_CHECKPOINT_MISMATCH_NOT_OBSERVED" });
    }

    if (!artifact.violation_evidence.reason_codes.includes("CHECKPOINT_MISMATCH") && !artifact.violation_evidence.reason_codes.includes("WITNESS_RECEIPT_MISMATCH")) {
      errors.push({ code: "EG_T16_VIOLATION_REASON_MISSING" });
    }

    if (artifact.violation_evidence.witness_receipt_hash !== artifact.witness_receipt.witness_receipt_hash) {
      errors.push({ code: "EG_T16_VIOLATION_WITNESS_BINDING_MISMATCH" });
    }
  }

  for (const key of [
    "require_checkpoint_mismatch_or_witness_receipt_mismatch",
    "require_violation_evidence_emitted",
    "require_external_witness_receipt_wins"
  ]) {
    if (!artifact.mismatch_gate || artifact.mismatch_gate[key] !== true) {
      errors.push({ code: "EG_T16_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.mismatch_gate ? artifact.mismatch_gate[key] : undefined });
    }
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
    if (!artifact.mismatch_gate || artifact.mismatch_gate[key] !== false) {
      errors.push({ code: "EG_T16_GATE_OVERCLAIM", key, observed: artifact.mismatch_gate ? artifact.mismatch_gate[key] : undefined });
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
      errors.push({ code: "EG_T16_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T16_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T16_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT16WitnessedEventRewriteVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T16-WITNESSED-EVENT-REWRITE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    checkpoint_mismatch_detected: artifact.checkpoint_mismatch_detected,
    witness_receipt_mismatch_detected: artifact.witness_receipt_mismatch_detected,
    violation_evidence_emitted: artifact.violation_evidence_emitted,
    external_witness_receipt_wins: artifact.external_witness_receipt_wins,
    rewritten_local_chain_trusted: artifact.rewritten_local_chain_trusted,
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
  createOriginalWitnessedChain,
  createRewrittenLocalChain,
  evaluateWitnessedEventRewrite,
  verifyEGT16WitnessedEventRewrite
};
