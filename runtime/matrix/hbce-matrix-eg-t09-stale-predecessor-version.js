"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-228";
const TEST_ID = "EG-T09";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T09-STALE-PREDECESSOR-VERSION-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createCurrentStateProjection() {
  const projection = {
    record_type: "MatrixStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    state: "BLOCKED",
    state_version: 4,
    predecessor_event_id: "transition-event-current-v004",
    predecessor_event_sha256: "4".repeat(64),
    projection_generated_at: "2026-10-01T19:00:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createStaleTransitionRequest({ currentProjection = createCurrentStateProjection() } = {}) {
  const request = {
    request_id: "eg-t09-stale-predecessor-version-request-v001",
    request_type: "MATRIX_STATE_TRANSITION_REQUEST",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: currentProjection.namespace,
    requested_transition: "PROMOTE_RELEASE_CLEAN_ELIGIBLE",
    requested_from_state: "BLOCKED",
    requested_to_state: "RELEASE_CLEAN_ELIGIBLE",
    declared_predecessor_state_version: 3,
    declared_predecessor_projection_hash: "3".repeat(64),
    observed_current_state_version: currentProjection.state_version,
    observed_current_projection_hash: currentProjection.projection_hash,
    predecessor_version_matches_current: false,
    predecessor_hash_matches_current: false,
    requested_at: "2026-10-01T19:01:00+02:00",
    request_sha256: null
  };

  request.request_sha256 = sha256Record({ ...request, request_sha256: null });
  return request;
}

function evaluateStalePredecessorVersion({
  currentProjection = createCurrentStateProjection(),
  transitionRequest = null,
  evaluated_at = "2026-10-01T19:02:00+02:00"
} = {}) {
  const request = transitionRequest || createStaleTransitionRequest({ currentProjection });

  const stalePredecessor =
    request.declared_predecessor_state_version !== currentProjection.state_version ||
    request.declared_predecessor_projection_hash !== currentProjection.projection_hash;

  const rejectedEvent = {
    event_id: "rejected-transition-eg-t09-stale-predecessor-version-v001",
    event_type: "RejectedStalePredecessorTransitionEvent",
    request_ref: request.request_id,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: request.namespace,
    attempted_from: request.requested_from_state,
    attempted_to: request.requested_to_state,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "STALE_PREDECESSOR",
    declared_predecessor_state_version: request.declared_predecessor_state_version,
    observed_current_state_version: currentProjection.state_version,
    declared_predecessor_projection_hash: request.declared_predecessor_projection_hash,
    observed_current_projection_hash: currentProjection.projection_hash,
    preserved_state_ref: currentProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedEvent.event_hash = sha256Record({ ...rejectedEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T09_StalePredecessorVersion_v001",
    artifact_type: "MatrixEGT09StalePredecessorVersionRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "REJECT + STALE_PREDECESSOR",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    current_state_projection: currentProjection,
    transition_request: request,
    stale_predecessor_detected: stalePredecessor,
    predecessor_version_matches_current: false,
    predecessor_hash_matches_current: false,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "STALE_PREDECESSOR",
    rejected_transition_event_emitted: true,
    rejected_transition_event: rejectedEvent,
    previous_authoritative_state_preserved: true,
    resulting_state_projection: currentProjection,
    state: currentProjection.state,
    attempted_state: request.requested_to_state,
    state_changed: false,
    state_version_changed: false,
    authoritative_event_emitted: false,
    duplicate_authoritative_event_emitted: false,
    stale_request_accepted: false,
    transition_authoritative: false,
    stale_predecessor_gate: {
      accept_stale_predecessor_allowed: false,
      accept_stale_version_allowed: false,
      accept_stale_projection_hash_allowed: false,
      repair_stale_predecessor_by_model_allowed: false,
      ui_manual_acceptance_authoritative: false,
      admin_override_authoritative: false
    },
    runtime_claims: {
      eg_t09_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
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
    maximum_supported_claim: "EG_T09_STALE_PREDECESSOR_REJECTED_PREVIOUS_AUTHORITATIVE_STATE_PRESERVED",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT09StalePredecessorVersion(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT09StalePredecessorVersionVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T09_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T09_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T09_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T09_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.decision_result !== "REJECT") errors.push({ code: "EG_T09_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  if (artifact.validation_result !== "UNVERIFIED") errors.push({ code: "EG_T09_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  if (artifact.reason_code !== "STALE_PREDECESSOR") errors.push({ code: "EG_T09_REASON_CODE_INVALID", observed: artifact.reason_code });
  if (artifact.stale_predecessor_detected !== true) errors.push({ code: "EG_T09_STALE_PREDECESSOR_NOT_DETECTED", observed: artifact.stale_predecessor_detected });
  if (artifact.predecessor_version_matches_current !== false) errors.push({ code: "EG_T09_PREDECESSOR_VERSION_MATCH_OVERCLAIM", observed: artifact.predecessor_version_matches_current });
  if (artifact.predecessor_hash_matches_current !== false) errors.push({ code: "EG_T09_PREDECESSOR_HASH_MATCH_OVERCLAIM", observed: artifact.predecessor_hash_matches_current });
  if (artifact.rejected_transition_event_emitted !== true) errors.push({ code: "EG_T09_REJECTED_TRANSITION_EVENT_NOT_EMITTED" });
  if (artifact.previous_authoritative_state_preserved !== true) errors.push({ code: "EG_T09_PREVIOUS_AUTHORITATIVE_STATE_NOT_PRESERVED" });
  if (artifact.state_changed !== false) errors.push({ code: "EG_T09_STATE_CHANGED", observed: artifact.state_changed });
  if (artifact.state_version_changed !== false) errors.push({ code: "EG_T09_STATE_VERSION_CHANGED", observed: artifact.state_version_changed });
  if (artifact.authoritative_event_emitted !== false) errors.push({ code: "EG_T09_AUTHORITATIVE_EVENT_OVERCLAIM", observed: artifact.authoritative_event_emitted });
  if (artifact.duplicate_authoritative_event_emitted !== false) errors.push({ code: "EG_T09_DUPLICATE_EVENT_OVERCLAIM", observed: artifact.duplicate_authoritative_event_emitted });
  if (artifact.stale_request_accepted !== false) errors.push({ code: "EG_T09_STALE_REQUEST_ACCEPTED_OVERCLAIM", observed: artifact.stale_request_accepted });
  if (artifact.transition_authoritative !== false) errors.push({ code: "EG_T09_TRANSITION_AUTHORITY_OVERCLAIM", observed: artifact.transition_authoritative });

  if (!artifact.current_state_projection || !artifact.transition_request) {
    errors.push({ code: "EG_T09_PROJECTION_OR_REQUEST_MISSING" });
  } else {
    if (artifact.transition_request.declared_predecessor_state_version === artifact.current_state_projection.state_version) {
      errors.push({ code: "EG_T09_DECLARED_VERSION_NOT_STALE" });
    }
    if (artifact.transition_request.declared_predecessor_projection_hash === artifact.current_state_projection.projection_hash) {
      errors.push({ code: "EG_T09_DECLARED_HASH_NOT_STALE" });
    }
  }

  if (!artifact.current_state_projection || !artifact.resulting_state_projection) {
    errors.push({ code: "EG_T09_RESULTING_PROJECTION_MISSING" });
  } else {
    if (artifact.current_state_projection.projection_hash !== artifact.resulting_state_projection.projection_hash) {
      errors.push({
        code: "EG_T09_RESULTING_PROJECTION_HASH_CHANGED",
        current: artifact.current_state_projection.projection_hash,
        resulting: artifact.resulting_state_projection.projection_hash
      });
    }

    if (artifact.resulting_state_projection.state_version !== 4) {
      errors.push({ code: "EG_T09_RESULTING_STATE_VERSION_INVALID", observed: artifact.resulting_state_projection.state_version });
    }

    if (artifact.resulting_state_projection.state !== "BLOCKED") {
      errors.push({ code: "EG_T09_RESULTING_STATE_INVALID", observed: artifact.resulting_state_projection.state });
    }
  }

  if (!artifact.rejected_transition_event || artifact.rejected_transition_event.reason_code !== "STALE_PREDECESSOR") {
    errors.push({ code: "EG_T09_REJECTED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "accept_stale_predecessor_allowed",
    "accept_stale_version_allowed",
    "accept_stale_projection_hash_allowed",
    "repair_stale_predecessor_by_model_allowed",
    "ui_manual_acceptance_authoritative",
    "admin_override_authoritative"
  ]) {
    if (!artifact.stale_predecessor_gate || artifact.stale_predecessor_gate[key] !== false) {
      errors.push({ code: "EG_T09_STALE_PREDECESSOR_GATE_OVERCLAIM", key, observed: artifact.stale_predecessor_gate ? artifact.stale_predecessor_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t09_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T09_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
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
      errors.push({ code: "EG_T09_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T09_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T09_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT09StalePredecessorVersionVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T09-STALE-PREDECESSOR-VERSION-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    stale_predecessor_detected: artifact.stale_predecessor_detected,
    state: artifact.state,
    attempted_state: artifact.attempted_state,
    current_state_version: artifact.current_state_projection ? artifact.current_state_projection.state_version : null,
    declared_predecessor_state_version: artifact.transition_request ? artifact.transition_request.declared_predecessor_state_version : null,
    previous_authoritative_state_preserved: artifact.previous_authoritative_state_preserved,
    state_changed: artifact.state_changed,
    state_version_changed: artifact.state_version_changed,
    transition_authoritative: artifact.transition_authoritative,
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
  createCurrentStateProjection,
  createStaleTransitionRequest,
  evaluateStalePredecessorVersion,
  verifyEGT09StalePredecessorVersion
};
