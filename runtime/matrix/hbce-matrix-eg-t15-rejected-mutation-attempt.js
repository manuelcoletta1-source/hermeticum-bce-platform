"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-234";
const TEST_ID = "EG-T15";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T15-REJECTED-MUTATION-ATTEMPT-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createPreviousAuthoritativeState() {
  const projection = {
    record_type: "MatrixAuthoritativeStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    state: "BLOCKED",
    state_version: 3,
    source: "AUTHORITATIVE_EVENT_LOG",
    predecessor_event_log_sha256: "f".repeat(64),
    projection_generated_at: "2026-10-01T20:20:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createRejectedMutationRequest({ previousState = createPreviousAuthoritativeState() } = {}) {
  const request = {
    record_type: "RejectedMutationAttemptRequest",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_id: "eg-t15-rejected-mutation-request-v001",
    request_class: "PROTECTED_STATE_MUTATION_ATTEMPT",
    mutation_source: "UNAUTHORIZED_DIRECT_WRITE",
    mutation_actor_ref: "UNAUTHORIZED_LOCAL_OPERATOR",
    mutation_allowed: false,
    previous_state: previousState.state,
    previous_state_version: previousState.state_version,
    requested_state: "RELEASE_CLEAN_ELIGIBLE",
    requested_state_version: previousState.state_version + 1,
    requested_projection_update: true,
    requested_authoritative_effect: true,
    submitted_at: "2026-10-01T20:21:00+02:00",
    request_sha256: null
  };

  request.request_sha256 = sha256Record({ ...request, request_sha256: null });
  return request;
}

function evaluateRejectedMutationAttempt({
  previousState = createPreviousAuthoritativeState(),
  mutationRequest = null,
  evaluated_at = "2026-10-01T20:22:00+02:00"
} = {}) {
  const request = mutationRequest || createRejectedMutationRequest({ previousState });

  const rejectionDecisionRecord = {
    record_type: "MutationRejectionDecisionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    decision_record_id: "eg-t15-mutation-rejection-decision-v001",
    request_id: request.request_id,
    request_sha256: request.request_sha256,
    decision_scope: "PROTECTED_STATE_MUTATION_ATTEMPT",
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "REJECTED_MUTATION_ATTEMPT",
    previous_authoritative_state: previousState.state,
    previous_authoritative_state_version: previousState.state_version,
    attempted_state: request.requested_state,
    attempted_state_version: request.requested_state_version,
    previous_state_preserved: true,
    projection_update_allowed: false,
    authoritative_state_mutation_allowed: false,
    decided_at: evaluated_at,
    decision_record_sha256: null
  };

  rejectionDecisionRecord.decision_record_sha256 = sha256Record({ ...rejectionDecisionRecord, decision_record_sha256: null });

  const rejectedTransitionEvent = {
    event_id: "eg-t15-rejected-transition-event-v001",
    event_type: "RejectedTransitionEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    request_id: request.request_id,
    request_sha256: request.request_sha256,
    decision_record_id: rejectionDecisionRecord.decision_record_id,
    decision_record_sha256: rejectionDecisionRecord.decision_record_sha256,
    from_state: previousState.state,
    requested_to_state: request.requested_state,
    resulting_state: previousState.state,
    from_state_version: previousState.state_version,
    requested_to_state_version: request.requested_state_version,
    resulting_state_version: previousState.state_version,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "REJECTED_MUTATION_ATTEMPT",
    previous_authoritative_state_preserved: true,
    projection_updated: false,
    emitted_at: evaluated_at,
    event_hash: null
  };

  rejectedTransitionEvent.event_hash = sha256Record({ ...rejectedTransitionEvent, event_hash: null });

  const preservedAuthoritativeState = {
    record_type: "MatrixAuthoritativeStatePreservationRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    previous_projection_hash: previousState.projection_hash,
    preserved_projection_hash: previousState.projection_hash,
    preserved_state: previousState.state,
    preserved_state_version: previousState.state_version,
    rejected_transition_event_id: rejectedTransitionEvent.event_id,
    rejected_transition_event_hash: rejectedTransitionEvent.event_hash,
    preservation_reason_code: "REJECTED_MUTATION_ATTEMPT",
    projection_update_performed: false,
    authoritative_state_changed: false,
    preserved_at: evaluated_at,
    preservation_record_sha256: null
  };

  preservedAuthoritativeState.preservation_record_sha256 = sha256Record({ ...preservedAuthoritativeState, preservation_record_sha256: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T15_RejectedMutationAttempt_v001",
    artifact_type: "MatrixEGT15RejectedMutationAttemptRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "RejectedTransitionEvent emitted; previous authoritative state preserved",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    previous_authoritative_state_projection: previousState,
    rejected_mutation_request: request,
    rejection_decision_record: rejectionDecisionRecord,
    rejected_transition_event: rejectedTransitionEvent,
    preserved_authoritative_state_record: preservedAuthoritativeState,
    rejected_mutation_attempt_detected: true,
    mutation_rejected: true,
    rejection_decision_record_created: true,
    rejected_transition_event_emitted: true,
    previous_authoritative_state_preserved: true,
    previous_projection_hash_preserved: true,
    projection_updated: false,
    authoritative_state_changed: false,
    state_changed: false,
    state_version_changed: false,
    previous_state: previousState.state,
    attempted_state: request.requested_state,
    resulting_state: previousState.state,
    previous_state_version: previousState.state_version,
    attempted_state_version: request.requested_state_version,
    resulting_state_version: previousState.state_version,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    rejection_gate: {
      require_rejected_transition_event: true,
      require_previous_authoritative_state_preserved: true,
      require_projection_update_blocked: true,
      accept_rejected_mutation_as_state_allowed: false,
      projection_update_allowed: false,
      authoritative_state_mutation_allowed: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t15_runtime_artifact_created: true,
      rejected_mutation_attempt_detected: true,
      mutation_rejected: true,
      rejected_transition_event_emitted: true,
      previous_authoritative_state_preserved: true,
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
    maximum_supported_claim: "EG_T15_REJECTED_MUTATION_ATTEMPT_EMITTED_REJECTED_TRANSITION_EVENT_AND_PRESERVED_PREVIOUS_AUTHORITATIVE_STATE",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT15RejectedMutationAttempt(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT15RejectedMutationAttemptVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T15_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T15_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T15_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T15_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "RejectedTransitionEvent emitted; previous authoritative state preserved") errors.push({ code: "EG_T15_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["rejected_mutation_attempt_detected", true],
    ["mutation_rejected", true],
    ["rejection_decision_record_created", true],
    ["rejected_transition_event_emitted", true],
    ["previous_authoritative_state_preserved", true],
    ["previous_projection_hash_preserved", true],
    ["projection_updated", false],
    ["authoritative_state_changed", false],
    ["state_changed", false],
    ["state_version_changed", false],
    ["previous_state", "BLOCKED"],
    ["attempted_state", "RELEASE_CLEAN_ELIGIBLE"],
    ["resulting_state", "BLOCKED"],
    ["previous_state_version", 3],
    ["attempted_state_version", 4],
    ["resulting_state_version", 3],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T15_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.rejected_mutation_request || !artifact.rejection_decision_record || !artifact.rejected_transition_event || !artifact.preserved_authoritative_state_record || !artifact.previous_authoritative_state_projection) {
    errors.push({ code: "EG_T15_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.rejection_decision_record.request_sha256 !== artifact.rejected_mutation_request.request_sha256) {
      errors.push({ code: "EG_T15_DECISION_REQUEST_BINDING_MISMATCH" });
    }

    if (artifact.rejected_transition_event.decision_record_sha256 !== artifact.rejection_decision_record.decision_record_sha256) {
      errors.push({ code: "EG_T15_EVENT_DECISION_BINDING_MISMATCH" });
    }

    if (artifact.rejected_transition_event.event_type !== "RejectedTransitionEvent") {
      errors.push({ code: "EG_T15_REJECTED_EVENT_TYPE_INVALID", observed: artifact.rejected_transition_event.event_type });
    }

    if (artifact.rejected_transition_event.resulting_state !== artifact.previous_authoritative_state_projection.state) {
      errors.push({ code: "EG_T15_RESULTING_STATE_NOT_PRESERVED" });
    }

    if (artifact.rejected_transition_event.resulting_state_version !== artifact.previous_authoritative_state_projection.state_version) {
      errors.push({ code: "EG_T15_RESULTING_VERSION_NOT_PRESERVED" });
    }

    if (artifact.preserved_authoritative_state_record.preserved_projection_hash !== artifact.previous_authoritative_state_projection.projection_hash) {
      errors.push({ code: "EG_T15_PROJECTION_HASH_NOT_PRESERVED" });
    }

    if (artifact.rejected_mutation_request.mutation_allowed !== false) {
      errors.push({ code: "EG_T15_MUTATION_ALLOWED_OVERCLAIM" });
    }
  }

  for (const key of [
    "require_rejected_transition_event",
    "require_previous_authoritative_state_preserved",
    "require_projection_update_blocked"
  ]) {
    if (!artifact.rejection_gate || artifact.rejection_gate[key] !== true) {
      errors.push({ code: "EG_T15_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.rejection_gate ? artifact.rejection_gate[key] : undefined });
    }
  }

  for (const key of [
    "accept_rejected_mutation_as_state_allowed",
    "projection_update_allowed",
    "authoritative_state_mutation_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.rejection_gate || artifact.rejection_gate[key] !== false) {
      errors.push({ code: "EG_T15_GATE_OVERCLAIM", key, observed: artifact.rejection_gate ? artifact.rejection_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t15_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T15_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "rejected_mutation_attempt_detected",
    "mutation_rejected",
    "rejected_transition_event_emitted",
    "previous_authoritative_state_preserved"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== true) {
      errors.push({ code: "EG_T15_RUNTIME_POSITIVE_CLAIM_MISSING", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T15_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T15_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T15_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT15RejectedMutationAttemptVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T15-REJECTED-MUTATION-ATTEMPT-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    rejected_mutation_attempt_detected: artifact.rejected_mutation_attempt_detected,
    mutation_rejected: artifact.mutation_rejected,
    rejected_transition_event_emitted: artifact.rejected_transition_event_emitted,
    previous_authoritative_state_preserved: artifact.previous_authoritative_state_preserved,
    previous_state: artifact.previous_state,
    attempted_state: artifact.attempted_state,
    resulting_state: artifact.resulting_state,
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
  createPreviousAuthoritativeState,
  createRejectedMutationRequest,
  evaluateRejectedMutationAttempt,
  verifyEGT15RejectedMutationAttempt
};
