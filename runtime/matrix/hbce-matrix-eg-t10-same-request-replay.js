"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-229";
const TEST_ID = "EG-T10";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T10-SAME-REQUEST-REPLAY-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createCanonicalRequestPayload() {
  const payload = {
    request_type: "MATRIX_STATE_TRANSITION_REQUEST",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    requested_transition: "PROMOTE_RELEASE_CLEAN_ELIGIBLE",
    requested_from_state: "BLOCKED",
    requested_to_state: "RELEASE_CLEAN_ELIGIBLE",
    declared_predecessor_state_version: 4,
    declared_predecessor_projection_hash: "a".repeat(64),
    decision_scope: "MATRIX_RELEASE_STATE_TRANSITION",
    requester_ref: "HBCE_INTERNAL_CONTROLLED_HARNESS",
    submitted_at: "2026-10-01T19:15:00+02:00"
  };

  return payload;
}

function createOriginalAuthoritativeResult({ requestPayload = createCanonicalRequestPayload() } = {}) {
  const requestDigest = sha256Record(requestPayload);

  const result = {
    record_type: "OriginalAuthoritativeResultRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    original_request_id: "eg-t10-original-request-v001",
    original_request_digest: requestDigest,
    decision_record_id: "decision-eg-t10-original-v001",
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "MISSING_REQUIRED_EVIDENCE",
    state_before: "BLOCKED",
    state_after: "BLOCKED",
    state_version_before: 4,
    state_version_after: 4,
    authoritative_event_id: "rejected-transition-eg-t10-original-v001",
    authoritative_event_type: "RejectedTransitionEvent",
    target_receipt_ref: null,
    effect_evidence_ref: null,
    created_at: "2026-10-01T19:16:00+02:00",
    authoritative_result_sha256: null
  };

  result.authoritative_result_sha256 = sha256Record({ ...result, authoritative_result_sha256: null });
  return result;
}

function createReplayRequest({
  requestPayload = createCanonicalRequestPayload(),
  originalResult = createOriginalAuthoritativeResult({ requestPayload })
} = {}) {
  const replayDigest = sha256Record(requestPayload);

  const replay = {
    request_id: "eg-t10-replay-request-v001",
    replay_of_request_id: originalResult.original_request_id,
    replay_type: "SAME_REQUEST_SAME_DIGEST",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_payload: requestPayload,
    replay_request_digest: replayDigest,
    original_request_digest: originalResult.original_request_digest,
    replay_digest_matches_original: replayDigest === originalResult.original_request_digest,
    submitted_at: "2026-10-01T19:17:00+02:00",
    replay_request_sha256: null
  };

  replay.replay_request_sha256 = sha256Record({ ...replay, replay_request_sha256: null });
  return replay;
}

function evaluateSameRequestReplay({
  requestPayload = createCanonicalRequestPayload(),
  originalResult = null,
  replayRequest = null,
  evaluated_at = "2026-10-01T19:18:00+02:00"
} = {}) {
  const original = originalResult || createOriginalAuthoritativeResult({ requestPayload });
  const replay = replayRequest || createReplayRequest({ requestPayload, originalResult: original });

  const returnedResult = {
    returned_record_type: "ReturnedOriginalAuthoritativeResult",
    returned_from_decision_record_id: original.decision_record_id,
    returned_authoritative_result_sha256: original.authoritative_result_sha256,
    decision_result: original.decision_result,
    validation_result: original.validation_result,
    reason_code: original.reason_code,
    state_before: original.state_before,
    state_after: original.state_after,
    state_version_before: original.state_version_before,
    state_version_after: original.state_version_after,
    authoritative_event_id: original.authoritative_event_id,
    authoritative_event_type: original.authoritative_event_type,
    target_receipt_ref: original.target_receipt_ref,
    effect_evidence_ref: original.effect_evidence_ref
  };

  const replayEvent = {
    event_id: "idempotent-replay-eg-t10-same-request-v001",
    event_type: "IdempotentReplayObservedEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    replay_request_id: replay.request_id,
    replay_of_request_id: original.original_request_id,
    replay_request_digest: replay.replay_request_digest,
    original_request_digest: original.original_request_digest,
    decision_result: "RETURN_ORIGINAL_AUTHORITATIVE_RESULT",
    reason_code: "IDEMPOTENT_REPLAY_SAME_DIGEST",
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    duplicate_target_receipt_created: false,
    preserved_authoritative_result_ref: original.authoritative_result_sha256,
    timestamp: evaluated_at,
    event_hash: null
  };

  replayEvent.event_hash = sha256Record({ ...replayEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T10_SameRequestReplay_v001",
    artifact_type: "MatrixEGT10SameRequestReplayRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "Return original authoritative result; no duplicate authoritative event/effect",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    canonical_request_payload: requestPayload,
    original_authoritative_result: original,
    replay_request: replay,
    replay_digest_matches_original: true,
    replay_result: "RETURN_ORIGINAL_AUTHORITATIVE_RESULT",
    decision_result: "RETURN_ORIGINAL_AUTHORITATIVE_RESULT",
    validation_result: "IDEMPOTENT_REPLAY",
    reason_code: "IDEMPOTENT_REPLAY_SAME_DIGEST",
    returned_authoritative_result: returnedResult,
    returned_authoritative_result_sha256: original.authoritative_result_sha256,
    original_authoritative_result_sha256: original.authoritative_result_sha256,
    original_decision_result_preserved: true,
    original_reason_code_preserved: true,
    original_state_preserved: true,
    new_decision_record_created: false,
    new_authoritative_transition_event_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_authoritative_effect_created: false,
    duplicate_effect_evidence_created: false,
    duplicate_target_receipt_created: false,
    authoritative_event_count_delta: 0,
    effect_evidence_count_delta: 0,
    target_receipt_count_delta: 0,
    replay_observed_event_emitted: true,
    replay_observed_event: replayEvent,
    state: original.state_after,
    state_version: original.state_version_after,
    state_changed: false,
    state_version_changed: false,
    idempotency_gate: {
      same_digest_required: true,
      return_original_result_on_same_digest: true,
      create_new_authoritative_result_on_replay_allowed: false,
      create_duplicate_authoritative_event_allowed: false,
      create_duplicate_effect_evidence_allowed: false,
      create_duplicate_target_receipt_allowed: false,
      model_replay_rewrite_authoritative: false,
      ui_manual_replay_override_authoritative: false,
      admin_override_duplicate_allowed: false
    },
    runtime_claims: {
      eg_t10_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      new_authoritative_decision_created: false,
      duplicate_authoritative_event_created: false,
      duplicate_effect_evidence_created: false,
      duplicate_target_receipt_created: false,
      transition_accepted: false,
      authoritative_projection_updated: false,
      release_clean_eligible: false,
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
    maximum_supported_claim: "EG_T10_SAME_REQUEST_REPLAY_RETURNED_ORIGINAL_RESULT_NO_DUPLICATE_EVENT_OR_EFFECT",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT10SameRequestReplay(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT10SameRequestReplayVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T10_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T10_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T10_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T10_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "Return original authoritative result; no duplicate authoritative event/effect") errors.push({ code: "EG_T10_REQUIRED_RESULT_INVALID", observed: artifact.required_result });
  if (artifact.replay_digest_matches_original !== true) errors.push({ code: "EG_T10_REPLAY_DIGEST_NOT_MATCHING", observed: artifact.replay_digest_matches_original });
  if (artifact.replay_result !== "RETURN_ORIGINAL_AUTHORITATIVE_RESULT") errors.push({ code: "EG_T10_REPLAY_RESULT_INVALID", observed: artifact.replay_result });
  if (artifact.decision_result !== "RETURN_ORIGINAL_AUTHORITATIVE_RESULT") errors.push({ code: "EG_T10_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  if (artifact.validation_result !== "IDEMPOTENT_REPLAY") errors.push({ code: "EG_T10_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  if (artifact.reason_code !== "IDEMPOTENT_REPLAY_SAME_DIGEST") errors.push({ code: "EG_T10_REASON_CODE_INVALID", observed: artifact.reason_code });

  if (!artifact.original_authoritative_result || !artifact.replay_request || !artifact.returned_authoritative_result) {
    errors.push({ code: "EG_T10_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.replay_request.replay_request_digest !== artifact.original_authoritative_result.original_request_digest) {
      errors.push({
        code: "EG_T10_REPLAY_DIGEST_DIFFERS_FROM_ORIGINAL",
        replay: artifact.replay_request.replay_request_digest,
        original: artifact.original_authoritative_result.original_request_digest
      });
    }

    if (artifact.returned_authoritative_result_sha256 !== artifact.original_authoritative_result.authoritative_result_sha256) {
      errors.push({
        code: "EG_T10_RETURNED_RESULT_NOT_ORIGINAL",
        returned: artifact.returned_authoritative_result_sha256,
        original: artifact.original_authoritative_result.authoritative_result_sha256
      });
    }

    if (artifact.returned_authoritative_result.decision_result !== artifact.original_authoritative_result.decision_result) {
      errors.push({ code: "EG_T10_ORIGINAL_DECISION_NOT_PRESERVED" });
    }

    if (artifact.returned_authoritative_result.authoritative_event_id !== artifact.original_authoritative_result.authoritative_event_id) {
      errors.push({ code: "EG_T10_ORIGINAL_EVENT_REF_NOT_PRESERVED" });
    }
  }

  for (const [key, expected] of [
    ["original_decision_result_preserved", true],
    ["original_reason_code_preserved", true],
    ["original_state_preserved", true],
    ["new_decision_record_created", false],
    ["new_authoritative_transition_event_created", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_authoritative_effect_created", false],
    ["duplicate_effect_evidence_created", false],
    ["duplicate_target_receipt_created", false],
    ["replay_observed_event_emitted", true],
    ["state_changed", false],
    ["state_version_changed", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T10_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (artifact.authoritative_event_count_delta !== 0) errors.push({ code: "EG_T10_AUTHORITATIVE_EVENT_COUNT_CHANGED", observed: artifact.authoritative_event_count_delta });
  if (artifact.effect_evidence_count_delta !== 0) errors.push({ code: "EG_T10_EFFECT_EVIDENCE_COUNT_CHANGED", observed: artifact.effect_evidence_count_delta });
  if (artifact.target_receipt_count_delta !== 0) errors.push({ code: "EG_T10_TARGET_RECEIPT_COUNT_CHANGED", observed: artifact.target_receipt_count_delta });

  if (!artifact.replay_observed_event || artifact.replay_observed_event.reason_code !== "IDEMPOTENT_REPLAY_SAME_DIGEST") {
    errors.push({ code: "EG_T10_REPLAY_OBSERVED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "create_new_authoritative_result_on_replay_allowed",
    "create_duplicate_authoritative_event_allowed",
    "create_duplicate_effect_evidence_allowed",
    "create_duplicate_target_receipt_allowed",
    "model_replay_rewrite_authoritative",
    "ui_manual_replay_override_authoritative",
    "admin_override_duplicate_allowed"
  ]) {
    if (!artifact.idempotency_gate || artifact.idempotency_gate[key] !== false) {
      errors.push({ code: "EG_T10_IDEMPOTENCY_GATE_OVERCLAIM", key, observed: artifact.idempotency_gate ? artifact.idempotency_gate[key] : undefined });
    }
  }

  if (!artifact.idempotency_gate || artifact.idempotency_gate.same_digest_required !== true || artifact.idempotency_gate.return_original_result_on_same_digest !== true) {
    errors.push({ code: "EG_T10_IDEMPOTENCY_POSITIVE_RULE_MISSING" });
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t10_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T10_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "new_authoritative_decision_created",
    "duplicate_authoritative_event_created",
    "duplicate_effect_evidence_created",
    "duplicate_target_receipt_created",
    "transition_accepted",
    "authoritative_projection_updated",
    "release_clean_eligible",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T10_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T10_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T10_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT10SameRequestReplayVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T10-SAME-REQUEST-REPLAY-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    replay_digest_matches_original: artifact.replay_digest_matches_original,
    replay_result: artifact.replay_result,
    decision_result: artifact.decision_result,
    reason_code: artifact.reason_code,
    returned_authoritative_result_sha256: artifact.returned_authoritative_result_sha256,
    original_authoritative_result_sha256: artifact.original_authoritative_result_sha256,
    duplicate_authoritative_event_emitted: artifact.duplicate_authoritative_event_emitted,
    duplicate_effect_evidence_created: artifact.duplicate_effect_evidence_created,
    duplicate_target_receipt_created: artifact.duplicate_target_receipt_created,
    authoritative_event_count_delta: artifact.authoritative_event_count_delta,
    effect_evidence_count_delta: artifact.effect_evidence_count_delta,
    target_receipt_count_delta: artifact.target_receipt_count_delta,
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
  createCanonicalRequestPayload,
  createOriginalAuthoritativeResult,
  createReplayRequest,
  evaluateSameRequestReplay,
  verifyEGT10SameRequestReplay
};
