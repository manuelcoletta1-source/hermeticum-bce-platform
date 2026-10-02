"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-242";
const TEST_ID = "EG-T23";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T23-IDEMPOTENCY-KEY-CONFLICT-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createOriginalAuthoritativeResult() {
  const payload = {
    request_id: "eg-t23-original-request-v001",
    idempotency_key: "eg-t23-idempotency-key-0001",
    action_ref: "MATRIX::AUTHORITATIVE::TRANSITION::REQUEST",
    subject_ref: MATRIX_SUBJECT_REF,
    requested_transition: "ORIGINAL_AUTHORITY_TRANSITION",
    evidence_bundle_ref: "EG-T23-ORIGINAL-EVIDENCE-BUNDLE"
  };

  const payloadDigest = sha256Record(payload);

  const original = {
    record_type: "OriginalAuthoritativeResultRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    result_id: "eg-t23-original-authoritative-result-v001",
    idempotency_key: payload.idempotency_key,
    payload_digest: payloadDigest,
    payload,
    authoritative_result: "ALLOW",
    result_status: "AUTHORITATIVE_RESULT_RECORDED",
    transition_event_id: "eg-t23-original-authoritative-transition-event-v001",
    dispatch_performed: false,
    external_connector_called: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    result_hash: null
  };

  original.result_hash = sha256Record({ ...original, result_hash: null });
  return original;
}

function createDifferentPayloadReplayRequest({ original = createOriginalAuthoritativeResult() } = {}) {
  const differentPayload = {
    request_id: "eg-t23-replay-request-different-payload-v001",
    idempotency_key: original.idempotency_key,
    action_ref: "MATRIX::AUTHORITATIVE::TRANSITION::REQUEST",
    subject_ref: MATRIX_SUBJECT_REF,
    requested_transition: "DIFFERENT_AUTHORITY_TRANSITION",
    evidence_bundle_ref: "EG-T23-DIFFERENT-EVIDENCE-BUNDLE"
  };

  const replay = {
    record_type: "ReplayRequestRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    replay_request_id: "eg-t23-replay-request-different-payload-v001",
    idempotency_key: original.idempotency_key,
    payload_digest: sha256Record(differentPayload),
    payload: differentPayload,
    replay_received_at: "2026-10-01T22:30:00+02:00",
    replay_hash: null
  };

  replay.replay_hash = sha256Record({ ...replay, replay_hash: null });
  return replay;
}

function evaluateIdempotencyKeyConflict({
  original = createOriginalAuthoritativeResult(),
  replay = null,
  generated_at = "2026-10-01T22:31:00+02:00"
} = {}) {
  const replayRequest = replay || createDifferentPayloadReplayRequest({ original });

  const sameIdempotencyKey = replayRequest.idempotency_key === original.idempotency_key;
  const differentPayloadDigest = replayRequest.payload_digest !== original.payload_digest;
  const conflictDetected = sameIdempotencyKey && differentPayloadDigest;

  const conflictRecord = {
    record_type: "IdempotencyKeyConflictRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    conflict_id: "eg-t23-idempotency-key-conflict-v001",
    replay_request_id: replayRequest.replay_request_id,
    original_result_id: original.result_id,
    idempotency_key: replayRequest.idempotency_key,
    original_payload_digest: original.payload_digest,
    replay_payload_digest: replayRequest.payload_digest,
    same_idempotency_key: sameIdempotencyKey,
    different_payload_digest: differentPayloadDigest,
    conflict_detected: conflictDetected,
    rejection_result: "REJECT",
    rejection_code: "IDEMPOTENCY_KEY_CONFLICT",
    replay_decision: "REJECT_IDEMPOTENCY_KEY_CONFLICT",
    original_authoritative_result_preserved: true,
    original_result_returned_as_success: false,
    second_authoritative_result_created: false,
    second_transition_event_created: false,
    second_effect_created: false,
    conflict_hash: null
  };

  conflictRecord.conflict_hash = sha256Record({ ...conflictRecord, conflict_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T23_IdempotencyKeyConflict_v001",
    artifact_type: "MatrixEGT23IdempotencyKeyConflictRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "REJECT + IDEMPOTENCY_KEY_CONFLICT",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    original_authoritative_result: original,
    replay_request: replayRequest,
    conflict_record: conflictRecord,
    same_idempotency_key_detected: true,
    different_payload_digest_detected: true,
    idempotency_key_conflict_detected: true,
    rejection_result: "REJECT",
    rejection_code: "IDEMPOTENCY_KEY_CONFLICT",
    replay_decision: "REJECT_IDEMPOTENCY_KEY_CONFLICT",
    original_authoritative_result_preserved: true,
    original_result_returned_as_success: false,
    second_authoritative_result_created: false,
    second_transition_event_created: false,
    second_dispatch_created: false,
    second_target_receipt_created: false,
    second_effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    original_result_hash_preserved: true,
    original_payload_digest_preserved: true,
    replay_payload_digest_differs_from_original: true,
    replay_rejected_without_reexecution: true,
    idempotency_gate: {
      require_same_idempotency_key: true,
      require_different_payload_digest: true,
      require_reject_idempotency_key_conflict: true,
      require_no_second_effect: true,
      allow_original_success_return_for_conflict: false,
      allow_second_authoritative_result: false,
      allow_second_transition_event: false,
      allow_second_dispatch: false,
      allow_second_target_receipt: false,
      allow_second_effect_evidence: false,
      allow_external_connector_call: false
    },
    runtime_claims: {
      eg_t23_runtime_artifact_created: true,
      same_idempotency_key_detected: true,
      different_payload_digest_detected: true,
      idempotency_key_conflict_detected: true,
      rejection_code_idempotency_key_conflict: true,
      replay_rejected_without_reexecution: true,
      second_effect_evidence_created: false,
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
    maximum_supported_claim: "EG_T23_SAME_IDEMPOTENCY_KEY_AND_DIFFERENT_PAYLOAD_DIGEST_REJECTS_WITH_IDEMPOTENCY_KEY_CONFLICT_AND_NO_SECOND_EFFECT",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT23IdempotencyKeyConflict(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT23IdempotencyKeyConflictVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T23_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T23_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T23_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T23_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "REJECT + IDEMPOTENCY_KEY_CONFLICT") errors.push({ code: "EG_T23_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["same_idempotency_key_detected", true],
    ["different_payload_digest_detected", true],
    ["idempotency_key_conflict_detected", true],
    ["rejection_result", "REJECT"],
    ["rejection_code", "IDEMPOTENCY_KEY_CONFLICT"],
    ["replay_decision", "REJECT_IDEMPOTENCY_KEY_CONFLICT"],
    ["original_authoritative_result_preserved", true],
    ["original_result_returned_as_success", false],
    ["second_authoritative_result_created", false],
    ["second_transition_event_created", false],
    ["second_dispatch_created", false],
    ["second_target_receipt_created", false],
    ["second_effect_evidence_created", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["original_result_hash_preserved", true],
    ["original_payload_digest_preserved", true],
    ["replay_payload_digest_differs_from_original", true],
    ["replay_rejected_without_reexecution", true]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T23_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.original_authoritative_result || !artifact.replay_request || !artifact.conflict_record) {
    errors.push({ code: "EG_T23_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.replay_request.idempotency_key !== artifact.original_authoritative_result.idempotency_key) {
      errors.push({ code: "EG_T23_IDEMPOTENCY_KEY_NOT_SHARED" });
    }

    if (artifact.replay_request.payload_digest === artifact.original_authoritative_result.payload_digest) {
      errors.push({ code: "EG_T23_PAYLOAD_DIGEST_NOT_DIFFERENT" });
    }

    if (artifact.conflict_record.rejection_code !== "IDEMPOTENCY_KEY_CONFLICT") {
      errors.push({ code: "EG_T23_CONFLICT_CODE_INVALID", observed: artifact.conflict_record.rejection_code });
    }

    if (artifact.conflict_record.replay_decision !== "REJECT_IDEMPOTENCY_KEY_CONFLICT") {
      errors.push({ code: "EG_T23_REPLAY_DECISION_INVALID", observed: artifact.conflict_record.replay_decision });
    }

    if (artifact.conflict_record.second_effect_created !== false) {
      errors.push({ code: "EG_T23_SECOND_EFFECT_OVERCLAIM", observed: artifact.conflict_record.second_effect_created });
    }
  }

  for (const key of [
    "require_same_idempotency_key",
    "require_different_payload_digest",
    "require_reject_idempotency_key_conflict",
    "require_no_second_effect"
  ]) {
    if (!artifact.idempotency_gate || artifact.idempotency_gate[key] !== true) {
      errors.push({ code: "EG_T23_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.idempotency_gate ? artifact.idempotency_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_original_success_return_for_conflict",
    "allow_second_authoritative_result",
    "allow_second_transition_event",
    "allow_second_dispatch",
    "allow_second_target_receipt",
    "allow_second_effect_evidence",
    "allow_external_connector_call"
  ]) {
    if (!artifact.idempotency_gate || artifact.idempotency_gate[key] !== false) {
      errors.push({ code: "EG_T23_GATE_OVERCLAIM", key, observed: artifact.idempotency_gate ? artifact.idempotency_gate[key] : undefined });
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
      errors.push({ code: "EG_T23_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T23_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T23_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT23IdempotencyKeyConflictVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T23-IDEMPOTENCY-KEY-CONFLICT-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    idempotency_key_conflict_detected: artifact.idempotency_key_conflict_detected,
    rejection_code: artifact.rejection_code,
    replay_rejected_without_reexecution: artifact.replay_rejected_without_reexecution,
    second_effect_evidence_created: artifact.second_effect_evidence_created,
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
  createOriginalAuthoritativeResult,
  createDifferentPayloadReplayRequest,
  evaluateIdempotencyKeyConflict,
  verifyEGT23IdempotencyKeyConflict
};
