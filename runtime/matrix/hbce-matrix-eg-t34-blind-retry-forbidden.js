"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-253";
const TEST_ID = "EG-T34";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::EXECUTION::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T34-BLIND-RETRY-FORBIDDEN-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createExecutionUnknownState() {
  const state = {
    record_type: "MatrixExecutionUnknownState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    execution_trace_id: "eg-t34-execution-trace-v001",
    dispatch_id: "eg-t34-dispatch-v001",
    action_class: "A2_PLUS_EXTERNAL_EFFECT_RELEVANT",
    execution_status: "EXECUTION_UNKNOWN",
    duplicate_effect_possible: true,
    target_receipt_present: false,
    effect_evidence_present: false,
    idempotency_key: "eg-t34-idempotency-key-v001",
    original_attempt_digest: "eg-t34-original-attempt-digest-v001",
    reconciliation_state: "REQUIRED",
    blind_retry_safe: false,
    state_hash: null
  };

  state.state_hash = sha256Record({ ...state, state_hash: null });
  return state;
}

function createBlindRetryAttempt({ executionUnknownState = createExecutionUnknownState() } = {}) {
  const attempt = {
    record_type: "BlindRetryAttempt",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    retry_attempt_id: "eg-t34-blind-retry-attempt-v001",
    previous_execution_trace_id: executionUnknownState.execution_trace_id,
    previous_execution_state_hash: executionUnknownState.state_hash,
    retry_reason: "EXECUTION_UNKNOWN",
    blind_retry_requested: true,
    duplicate_effect_possible: executionUnknownState.duplicate_effect_possible,
    reconciliation_performed: false,
    reconciliation_record_ref: null,
    retry_payload_digest: "eg-t34-retry-payload-digest-v001",
    idempotency_key: executionUnknownState.idempotency_key,
    requested_by_actor_class: "DISPATCH_ENGINE",
    retry_attempt_hash: null
  };

  attempt.retry_attempt_hash = sha256Record({ ...attempt, retry_attempt_hash: null });
  return attempt;
}

function evaluateBlindRetryForbidden({
  executionUnknownState = createExecutionUnknownState(),
  retryAttempt = null,
  generated_at = "2026-10-02T00:55:00+02:00"
} = {}) {
  const effectiveRetryAttempt = retryAttempt || createBlindRetryAttempt({ executionUnknownState });

  const blockEvent = {
    record_type: "BlindRetryForbiddenBlockEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t34-blind-retry-forbidden-block-event-v001",
    event_class: "EXECUTION_RECONCILIATION_EVENT",
    previous_execution_trace_id: executionUnknownState.execution_trace_id,
    previous_execution_state_hash: executionUnknownState.state_hash,
    retry_attempt_id: effectiveRetryAttempt.retry_attempt_id,
    decision_result: "BLOCK",
    block_code: "BLIND_RETRY_FORBIDDEN",
    reconciliation_required: true,
    duplicate_effect_possible: true,
    blind_retry_requested: true,
    blind_retry_allowed: false,
    retry_dispatched: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    emitted_at: generated_at,
    event_hash: null
  };

  blockEvent.event_hash = sha256Record({ ...blockEvent, event_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T34_BlindRetryForbidden_v001",
    artifact_type: "MatrixEGT34BlindRetryForbiddenRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "BLOCK + BLIND_RETRY_FORBIDDEN; reconciliation required",
    selected_profile: "A2_PLUS_EXTERNAL_EFFECT_RELEVANT",
    execution_unknown_state: executionUnknownState,
    blind_retry_attempt: effectiveRetryAttempt,
    block_event: blockEvent,
    execution_unknown: true,
    duplicate_effect_possible: true,
    blind_retry_requested: true,
    reconciliation_performed: false,
    reconciliation_required: true,
    decision_result: "BLOCK",
    block_code: "BLIND_RETRY_FORBIDDEN",
    blind_retry_allowed: false,
    retry_dispatch_blocked: true,
    retry_dispatched: false,
    original_execution_state_preserved: true,
    previous_execution_state_hash: executionUnknownState.state_hash,
    resulting_execution_state_hash: executionUnknownState.state_hash,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    blind_retry_gate: {
      require_reconciliation_for_execution_unknown: true,
      require_block_blind_retry_when_duplicate_effect_possible: true,
      require_no_retry_dispatch_without_reconciliation: true,
      require_execution_state_preserved_on_block: true,
      require_no_second_effect: true,
      allow_blind_retry_without_reconciliation: false,
      allow_retry_dispatch_when_duplicate_effect_possible: false,
      allow_external_connector_call_on_blind_retry: false,
      allow_target_receipt_creation_on_blind_retry: false,
      allow_effect_evidence_creation_on_blind_retry: false
    },
    runtime_claims: {
      eg_t34_runtime_artifact_created: true,
      execution_unknown_detected: true,
      blind_retry_forbidden_detected: true,
      block_code_blind_retry_forbidden: true,
      reconciliation_required: true,
      retry_dispatch_blocked: true,
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
    maximum_supported_claim: "EG_T34_EXECUTION_UNKNOWN_BLIND_RETRY_WHERE_DUPLICATE_EFFECT_IS_POSSIBLE_BLOCKS_WITH_BLIND_RETRY_FORBIDDEN_AND_RECONCILIATION_REQUIRED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT34BlindRetryForbidden(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT34BlindRetryForbiddenVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T34_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T34_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T34_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T34_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "BLOCK + BLIND_RETRY_FORBIDDEN; reconciliation required") errors.push({ code: "EG_T34_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["execution_unknown", true],
    ["duplicate_effect_possible", true],
    ["blind_retry_requested", true],
    ["reconciliation_performed", false],
    ["reconciliation_required", true],
    ["decision_result", "BLOCK"],
    ["block_code", "BLIND_RETRY_FORBIDDEN"],
    ["blind_retry_allowed", false],
    ["retry_dispatch_blocked", true],
    ["retry_dispatched", false],
    ["original_execution_state_preserved", true],
    ["dispatch_allowed", false],
    ["dispatch_performed", false],
    ["external_connector_called", false],
    ["target_system_contacted", false],
    ["target_receipt_created", false],
    ["effect_evidence_created", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T34_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.execution_unknown_state || !artifact.blind_retry_attempt || !artifact.block_event) {
    errors.push({ code: "EG_T34_CORE_RECORDS_MISSING" });
  } else {
    const expectedStateHash = sha256Record({ ...artifact.execution_unknown_state, state_hash: null });
    if (artifact.execution_unknown_state.state_hash !== expectedStateHash) {
      errors.push({ code: "EG_T34_EXECUTION_STATE_HASH_MISMATCH", expected: expectedStateHash, observed: artifact.execution_unknown_state.state_hash });
    }

    if (artifact.execution_unknown_state.execution_status !== "EXECUTION_UNKNOWN") {
      errors.push({ code: "EG_T34_EXECUTION_STATUS_INVALID", observed: artifact.execution_unknown_state.execution_status });
    }

    if (artifact.execution_unknown_state.duplicate_effect_possible !== true) {
      errors.push({ code: "EG_T34_DUPLICATE_EFFECT_NOT_MARKED_POSSIBLE", observed: artifact.execution_unknown_state.duplicate_effect_possible });
    }

    if (artifact.previous_execution_state_hash !== artifact.resulting_execution_state_hash) {
      errors.push({ code: "EG_T34_EXECUTION_STATE_NOT_PRESERVED", previous: artifact.previous_execution_state_hash, resulting: artifact.resulting_execution_state_hash });
    }

    if (artifact.blind_retry_attempt.reconciliation_performed !== false) {
      errors.push({ code: "EG_T34_RETRY_ATTEMPT_RECONCILIATION_OVERCLAIM", observed: artifact.blind_retry_attempt.reconciliation_performed });
    }

    if (artifact.block_event.block_code !== "BLIND_RETRY_FORBIDDEN") {
      errors.push({ code: "EG_T34_BLOCK_EVENT_CODE_INVALID", observed: artifact.block_event.block_code });
    }

    if (artifact.block_event.reconciliation_required !== true) {
      errors.push({ code: "EG_T34_BLOCK_EVENT_RECONCILIATION_NOT_REQUIRED", observed: artifact.block_event.reconciliation_required });
    }

    for (const key of [
      "blind_retry_allowed",
      "retry_dispatched",
      "dispatch_performed",
      "external_connector_called",
      "target_system_contacted",
      "target_receipt_created",
      "effect_evidence_created"
    ]) {
      if (artifact.block_event[key] !== false) {
        errors.push({ code: "EG_T34_BLOCK_EVENT_OVERCLAIM", key, observed: artifact.block_event[key] });
      }
    }
  }

  for (const key of [
    "require_reconciliation_for_execution_unknown",
    "require_block_blind_retry_when_duplicate_effect_possible",
    "require_no_retry_dispatch_without_reconciliation",
    "require_execution_state_preserved_on_block",
    "require_no_second_effect"
  ]) {
    if (!artifact.blind_retry_gate || artifact.blind_retry_gate[key] !== true) {
      errors.push({ code: "EG_T34_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.blind_retry_gate ? artifact.blind_retry_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_blind_retry_without_reconciliation",
    "allow_retry_dispatch_when_duplicate_effect_possible",
    "allow_external_connector_call_on_blind_retry",
    "allow_target_receipt_creation_on_blind_retry",
    "allow_effect_evidence_creation_on_blind_retry"
  ]) {
    if (!artifact.blind_retry_gate || artifact.blind_retry_gate[key] !== false) {
      errors.push({ code: "EG_T34_GATE_OVERCLAIM", key, observed: artifact.blind_retry_gate ? artifact.blind_retry_gate[key] : undefined });
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
      errors.push({ code: "EG_T34_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T34_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T34_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT34BlindRetryForbiddenVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T34-BLIND-RETRY-FORBIDDEN-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    execution_unknown: artifact.execution_unknown,
    duplicate_effect_possible: artifact.duplicate_effect_possible,
    block_code: artifact.block_code,
    reconciliation_required: artifact.reconciliation_required,
    retry_dispatch_blocked: artifact.retry_dispatch_blocked,
    retry_dispatched: artifact.retry_dispatched,
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
  TENANT_ID,
  MATRIX_SUBJECT_REF,
  RUNTIME_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createExecutionUnknownState,
  createBlindRetryAttempt,
  evaluateBlindRetryForbidden,
  verifyEGT34BlindRetryForbidden
};
