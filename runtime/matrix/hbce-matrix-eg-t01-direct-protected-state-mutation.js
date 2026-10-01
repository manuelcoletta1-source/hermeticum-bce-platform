"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-218";
const TEST_ID = "EG-T01";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T01-DIRECT-PROTECTED-STATE-MUTATION-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createStateProjectionRecord({
  effective_state = "BLOCKED",
  state_version = 1,
  head_event_ref = "transition-event-matrix-release-initial-blocked-v001"
} = {}) {
  const projection = {
    record_type: "StateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    effective_state,
    state_version,
    head_event_ref,
    head_event_hash: sha256Record({
      event_id: head_event_ref,
      tenant_id: TENANT_ID,
      subject_ref: MATRIX_SUBJECT_REF,
      namespace: "RELEASE_STATE",
      effective_state
    }),
    updated_at: "2026-10-01T16:45:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createDirectMutationAttempt({
  attempted_to = "ACCEPTED",
  attempted_by = "UNAUTHORIZED_DIRECT_STORAGE_WRITE"
} = {}) {
  const attempt = {
    attempt_id: "eg-t01-direct-protected-state-mutation-attempt-v001",
    attempt_type: "DIRECT_PROTECTED_STATE_MUTATION",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    attempted_from: "BLOCKED",
    attempted_to,
    attempted_by,
    actor_class: "UNAUTHORIZED_DIRECT_WRITE",
    write_path: "DIRECT_PROJECTION_STORE_MUTATION",
    governed_transition_request_ref: null,
    decision_record_ref: null,
    transition_event_ref: null,
    policy_ref: null,
    authority_ref: null,
    mandate_ref: null,
    evidence_refs: [],
    expected_parent_state_hash: null,
    attempted_at: "2026-10-01T16:46:00+02:00",
    attempt_sha256: null
  };

  attempt.attempt_sha256 = sha256Record({ ...attempt, attempt_sha256: null });
  return attempt;
}

function evaluateDirectProtectedStateMutation({
  priorProjection = createStateProjectionRecord(),
  mutationAttempt = createDirectMutationAttempt(),
  evaluated_at = "2026-10-01T16:47:00+02:00"
} = {}) {
  const rejectedTransitionEvent = {
    event_id: "rejected-transition-eg-t01-direct-protected-state-mutation-v001",
    event_type: "RejectedTransitionEvent",
    request_ref: mutationAttempt.attempt_id,
    tenant_id: mutationAttempt.tenant_id,
    subject_ref: mutationAttempt.subject_ref,
    namespace: mutationAttempt.namespace,
    attempted_from: mutationAttempt.attempted_from,
    attempted_to: mutationAttempt.attempted_to,
    reason_code: "DIRECT_PROTECTED_STATE_MUTATION",
    decision_ref: null,
    preserved_state_ref: priorProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedTransitionEvent.event_hash = sha256Record({ ...rejectedTransitionEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T01_DirectProtectedStateMutation_v001",
    artifact_type: "MatrixEGT01DirectProtectedStateMutationRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "REJECT + DIRECT_PROTECTED_STATE_MUTATION; previous authoritative state preserved",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    prior_authoritative_projection: priorProjection,
    mutation_attempt: mutationAttempt,
    decision_result: "REJECT",
    reason_code: "DIRECT_PROTECTED_STATE_MUTATION",
    protected_state_write_accepted: false,
    direct_mutation_authoritative: false,
    rejected_transition_event_emitted: true,
    rejected_transition_event: rejectedTransitionEvent,
    previous_authoritative_state_preserved: true,
    resulting_authoritative_projection: priorProjection,
    projection_changed: false,
    state_version_changed: false,
    head_event_changed: false,
    non_authoritative_mutation_detected: true,
    anomaly_evidence_emitted: true,
    governed_transition_required: true,
    bypass_prevention: {
      ui_manual_field_edit_allowed: false,
      generic_api_patch_allowed: false,
      direct_sql_projection_write_authoritative: false,
      admin_override_allowed: false,
      model_output_authoritative: false,
      imported_status_authoritative_without_governed_transition: false
    },
    runtime_claims: {
      matrix_implemented: false,
      eg_t01_runtime_artifact_created: true,
      matrix_l1_pilot_ready: false,
      release_state_accepted: false,
      evidence_closure_closed: false,
      validation_state_externally_validated: false,
      level4_eligible: false,
      legal_review_claimed: false,
      commercial_release_authorized: false,
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
    maximum_supported_claim: "EG_T01_DIRECT_PROTECTED_STATE_MUTATION_REJECTED_PREVIOUS_STATE_PRESERVED",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT01DirectProtectedStateMutation(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT01DirectProtectedStateMutationVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T01_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) {
    errors.push({ code: "EG_T01_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  }

  if (artifact.program_id !== PROGRAM_ID) {
    errors.push({ code: "EG_T01_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  }

  if (artifact.test_id !== TEST_ID) {
    errors.push({ code: "EG_T01_TEST_ID_MISMATCH", observed: artifact.test_id });
  }

  if (artifact.decision_result !== "REJECT") {
    errors.push({ code: "EG_T01_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  }

  if (artifact.reason_code !== "DIRECT_PROTECTED_STATE_MUTATION") {
    errors.push({ code: "EG_T01_REASON_CODE_INVALID", observed: artifact.reason_code });
  }

  if (artifact.protected_state_write_accepted !== false) {
    errors.push({ code: "EG_T01_PROTECTED_STATE_WRITE_ACCEPTED_OVERCLAIM", observed: artifact.protected_state_write_accepted });
  }

  if (artifact.direct_mutation_authoritative !== false) {
    errors.push({ code: "EG_T01_DIRECT_MUTATION_AUTHORITY_OVERCLAIM", observed: artifact.direct_mutation_authoritative });
  }

  if (artifact.rejected_transition_event_emitted !== true) {
    errors.push({ code: "EG_T01_REJECTED_TRANSITION_EVENT_NOT_EMITTED" });
  }

  if (artifact.previous_authoritative_state_preserved !== true) {
    errors.push({ code: "EG_T01_PREVIOUS_STATE_NOT_PRESERVED" });
  }

  if (artifact.projection_changed !== false) {
    errors.push({ code: "EG_T01_PROJECTION_CHANGED", observed: artifact.projection_changed });
  }

  if (artifact.state_version_changed !== false) {
    errors.push({ code: "EG_T01_STATE_VERSION_CHANGED", observed: artifact.state_version_changed });
  }

  if (artifact.head_event_changed !== false) {
    errors.push({ code: "EG_T01_HEAD_EVENT_CHANGED", observed: artifact.head_event_changed });
  }

  if (!artifact.prior_authoritative_projection || !artifact.resulting_authoritative_projection) {
    errors.push({ code: "EG_T01_PROJECTION_PAIR_MISSING" });
  } else {
    if (artifact.prior_authoritative_projection.projection_hash !== artifact.resulting_authoritative_projection.projection_hash) {
      errors.push({
        code: "EG_T01_RESULTING_PROJECTION_HASH_CHANGED",
        prior: artifact.prior_authoritative_projection.projection_hash,
        resulting: artifact.resulting_authoritative_projection.projection_hash
      });
    }

    if (artifact.prior_authoritative_projection.effective_state !== "BLOCKED") {
      errors.push({ code: "EG_T01_PRIOR_STATE_INVALID", observed: artifact.prior_authoritative_projection.effective_state });
    }

    if (artifact.resulting_authoritative_projection.effective_state !== "BLOCKED") {
      errors.push({ code: "EG_T01_RESULTING_STATE_INVALID", observed: artifact.resulting_authoritative_projection.effective_state });
    }
  }

  if (!artifact.rejected_transition_event || artifact.rejected_transition_event.reason_code !== "DIRECT_PROTECTED_STATE_MUTATION") {
    errors.push({ code: "EG_T01_REJECTED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "ui_manual_field_edit_allowed",
    "generic_api_patch_allowed",
    "direct_sql_projection_write_authoritative",
    "admin_override_allowed",
    "model_output_authoritative",
    "imported_status_authoritative_without_governed_transition"
  ]) {
    if (!artifact.bypass_prevention || artifact.bypass_prevention[key] !== false) {
      errors.push({ code: "EG_T01_BYPASS_PREVENTION_OVERCLAIM", key, observed: artifact.bypass_prevention ? artifact.bypass_prevention[key] : undefined });
    }
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_state_accepted",
    "evidence_closure_closed",
    "validation_state_externally_validated",
    "level4_eligible",
    "legal_review_claimed",
    "commercial_release_authorized",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T01_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t01_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T01_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
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
      errors.push({ code: "EG_T01_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({
      code: "EG_T01_CONTENT_HASH_MISMATCH",
      expected: expectedHash,
      observed: artifact.content_sha256
    });
  }

  const verification = {
    record_type: "MatrixEGT01DirectProtectedStateMutationVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T01-DIRECT-PROTECTED-STATE-MUTATION-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    reason_code: artifact.reason_code,
    protected_state_write_accepted: artifact.protected_state_write_accepted,
    previous_authoritative_state_preserved: artifact.previous_authoritative_state_preserved,
    resulting_effective_state: artifact.resulting_authoritative_projection ? artifact.resulting_authoritative_projection.effective_state : null,
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
  createStateProjectionRecord,
  createDirectMutationAttempt,
  evaluateDirectProtectedStateMutation,
  verifyEGT01DirectProtectedStateMutation
};
