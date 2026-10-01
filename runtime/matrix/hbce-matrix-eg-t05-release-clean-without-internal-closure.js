"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-222";
const TEST_ID = "EG-T05";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T05-RELEASE-CLEAN-WITHOUT-INTERNAL-CLOSURE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createReleaseStateProjection({
  release_state = "BLOCKED",
  validation_state = "UNVERIFIED",
  state_version = 1
} = {}) {
  const projection = {
    record_type: "ReleaseStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    release_state,
    validation_state,
    state_version,
    required_preconditions: [
      "INTERNAL_EVIDENCE_CLOSURE_CLOSED",
      "ALL_MANDATORY_C_CONTROLS_SATISFIED",
      "RELEASE_DECISION_RECORD_PRESENT",
      "RELEASE_VERIFIER_RECORD_PRESENT"
    ],
    satisfied_preconditions: [],
    missing_preconditions: [
      "INTERNAL_EVIDENCE_CLOSURE_CLOSED",
      "ALL_MANDATORY_C_CONTROLS_SATISFIED",
      "RELEASE_DECISION_RECORD_PRESENT",
      "RELEASE_VERIFIER_RECORD_PRESENT"
    ],
    updated_at: "2026-10-01T17:45:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createInternalClosureState({
  closure_state = "OPEN",
  validation_state = "UNVERIFIED"
} = {}) {
  const closure = {
    record_type: "InternalEvidenceClosureState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    closure_state,
    validation_state,
    required_c_controls: ["C01", "C02", "C03"],
    satisfied_c_controls: ["C01", "C02"],
    unsatisfied_c_controls: ["C03"],
    evidence_closure_closed: false,
    closure_record_ref: null,
    verifier_record_ref: null,
    state_hash: null
  };

  closure.state_hash = sha256Record({ ...closure, state_hash: null });
  return closure;
}

function createReleaseCleanPromotionAttempt({
  priorReleaseProjection = createReleaseStateProjection(),
  internalClosureState = createInternalClosureState()
} = {}) {
  const missingPreconditions = [];

  if (internalClosureState.closure_state !== "CLOSED") {
    missingPreconditions.push("INTERNAL_EVIDENCE_CLOSURE_CLOSED");
  }

  if (Array.isArray(internalClosureState.unsatisfied_c_controls) && internalClosureState.unsatisfied_c_controls.length > 0) {
    missingPreconditions.push("ALL_MANDATORY_C_CONTROLS_SATISFIED");
  }

  missingPreconditions.push("RELEASE_DECISION_RECORD_PRESENT");
  missingPreconditions.push("RELEASE_VERIFIER_RECORD_PRESENT");

  const attempt = {
    attempt_id: "eg-t05-release-clean-without-internal-closure-attempt-v001",
    attempt_type: "RELEASE_STATE_PROMOTION",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    attempted_from: priorReleaseProjection.release_state,
    attempted_to: "RELEASE_CLEAN_ELIGIBLE",
    attempted_validation_state: "VERIFIED",
    internal_closure_state: internalClosureState,
    required_preconditions: priorReleaseProjection.required_preconditions,
    missing_preconditions: missingPreconditions,
    missing_precondition_count: missingPreconditions.length,
    attempted_by: "UNVERIFIED_RELEASE_PROMOTION_REQUEST",
    release_decision_record_ref: null,
    release_verifier_record_ref: null,
    transition_event_ref: null,
    attempted_at: "2026-10-01T17:46:00+02:00",
    attempt_sha256: null
  };

  attempt.attempt_sha256 = sha256Record({ ...attempt, attempt_sha256: null });
  return attempt;
}

function evaluateReleaseCleanWithoutInternalClosure({
  priorReleaseProjection = createReleaseStateProjection(),
  promotionAttempt = null,
  evaluated_at = "2026-10-01T17:47:00+02:00"
} = {}) {
  const attempt = promotionAttempt || createReleaseCleanPromotionAttempt({ priorReleaseProjection });
  const missing = Array.isArray(attempt.missing_preconditions) ? attempt.missing_preconditions : [];

  const rejectedReleaseEvent = {
    event_id: "rejected-release-eg-t05-release-clean-without-internal-closure-v001",
    event_type: "RejectedReleasePromotionEvent",
    request_ref: attempt.attempt_id,
    tenant_id: attempt.tenant_id,
    subject_ref: attempt.subject_ref,
    namespace: attempt.namespace,
    attempted_from: attempt.attempted_from,
    attempted_to: attempt.attempted_to,
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "INTERNAL_EVIDENCE_CLOSURE_NOT_CLOSED",
    missing_preconditions: missing,
    preserved_state_ref: priorReleaseProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedReleaseEvent.event_hash = sha256Record({ ...rejectedReleaseEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T05_ReleaseCleanWithoutInternalClosure_v001",
    artifact_type: "MatrixEGT05ReleaseCleanWithoutInternalClosureRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "BLOCK; RELEASE_STATE remains BLOCKED",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    prior_release_projection: priorReleaseProjection,
    promotion_attempt: attempt,
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "INTERNAL_EVIDENCE_CLOSURE_NOT_CLOSED",
    release_promotion_accepted: false,
    release_promotion_authoritative: false,
    rejected_release_event_emitted: true,
    rejected_release_event: rejectedReleaseEvent,
    previous_release_state_preserved: true,
    resulting_release_projection: priorReleaseProjection,
    release_state_changed: false,
    validation_state_changed: false,
    state_version_changed: false,
    release_state: "BLOCKED",
    attempted_release_state: "RELEASE_CLEAN_ELIGIBLE",
    internal_evidence_closure_required: true,
    internal_evidence_closure_closed: false,
    release_clean_eligible: false,
    missing_preconditions: missing,
    missing_precondition_count: missing.length,
    release_gate: {
      promote_without_internal_closure_allowed: false,
      promote_with_unsatisfied_c_controls_allowed: false,
      promote_without_release_decision_record_allowed: false,
      promote_without_release_verifier_record_allowed: false,
      model_generated_release_promotion_authoritative: false,
      ui_manual_release_promotion_authoritative: false,
      admin_override_release_promotion_authoritative: false
    },
    runtime_claims: {
      eg_t05_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      release_clean_eligible: false,
      release_state_accepted: false,
      internal_evidence_closed: false,
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
    maximum_supported_claim: "EG_T05_RELEASE_CLEAN_PROMOTION_BLOCKED_RELEASE_STATE_REMAINS_BLOCKED",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT05ReleaseCleanWithoutInternalClosure(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT05ReleaseCleanWithoutInternalClosureVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T05_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) {
    errors.push({ code: "EG_T05_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  }

  if (artifact.program_id !== PROGRAM_ID) {
    errors.push({ code: "EG_T05_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  }

  if (artifact.test_id !== TEST_ID) {
    errors.push({ code: "EG_T05_TEST_ID_MISMATCH", observed: artifact.test_id });
  }

  if (artifact.decision_result !== "BLOCK") {
    errors.push({ code: "EG_T05_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  }

  if (artifact.validation_result !== "UNVERIFIED") {
    errors.push({ code: "EG_T05_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  }

  if (artifact.reason_code !== "INTERNAL_EVIDENCE_CLOSURE_NOT_CLOSED") {
    errors.push({ code: "EG_T05_REASON_CODE_INVALID", observed: artifact.reason_code });
  }

  if (artifact.release_state !== "BLOCKED") {
    errors.push({ code: "EG_T05_RELEASE_STATE_INVALID", observed: artifact.release_state });
  }

  if (artifact.attempted_release_state !== "RELEASE_CLEAN_ELIGIBLE") {
    errors.push({ code: "EG_T05_ATTEMPTED_RELEASE_STATE_INVALID", observed: artifact.attempted_release_state });
  }

  if (artifact.release_promotion_accepted !== false) {
    errors.push({ code: "EG_T05_RELEASE_PROMOTION_ACCEPTED_OVERCLAIM", observed: artifact.release_promotion_accepted });
  }

  if (artifact.release_promotion_authoritative !== false) {
    errors.push({ code: "EG_T05_RELEASE_PROMOTION_AUTHORITY_OVERCLAIM", observed: artifact.release_promotion_authoritative });
  }

  if (artifact.rejected_release_event_emitted !== true) {
    errors.push({ code: "EG_T05_REJECTED_RELEASE_EVENT_NOT_EMITTED" });
  }

  if (artifact.previous_release_state_preserved !== true) {
    errors.push({ code: "EG_T05_PREVIOUS_RELEASE_STATE_NOT_PRESERVED" });
  }

  if (artifact.release_state_changed !== false) {
    errors.push({ code: "EG_T05_RELEASE_STATE_CHANGED", observed: artifact.release_state_changed });
  }

  if (artifact.validation_state_changed !== false) {
    errors.push({ code: "EG_T05_VALIDATION_STATE_CHANGED", observed: artifact.validation_state_changed });
  }

  if (artifact.state_version_changed !== false) {
    errors.push({ code: "EG_T05_STATE_VERSION_CHANGED", observed: artifact.state_version_changed });
  }

  if (artifact.internal_evidence_closure_required !== true) {
    errors.push({ code: "EG_T05_INTERNAL_CLOSURE_NOT_REQUIRED" });
  }

  if (artifact.internal_evidence_closure_closed !== false) {
    errors.push({ code: "EG_T05_INTERNAL_CLOSURE_CLOSED_OVERCLAIM", observed: artifact.internal_evidence_closure_closed });
  }

  if (artifact.release_clean_eligible !== false) {
    errors.push({ code: "EG_T05_RELEASE_CLEAN_ELIGIBLE_OVERCLAIM", observed: artifact.release_clean_eligible });
  }

  if (!Array.isArray(artifact.missing_preconditions) || !artifact.missing_preconditions.includes("INTERNAL_EVIDENCE_CLOSURE_CLOSED")) {
    errors.push({ code: "EG_T05_INTERNAL_CLOSURE_MISSING_PRECONDITION_NOT_RECORDED" });
  }

  if (!artifact.prior_release_projection || !artifact.resulting_release_projection) {
    errors.push({ code: "EG_T05_RELEASE_PROJECTION_PAIR_MISSING" });
  } else {
    if (artifact.prior_release_projection.projection_hash !== artifact.resulting_release_projection.projection_hash) {
      errors.push({
        code: "EG_T05_RESULTING_RELEASE_PROJECTION_HASH_CHANGED",
        prior: artifact.prior_release_projection.projection_hash,
        resulting: artifact.resulting_release_projection.projection_hash
      });
    }

    if (artifact.resulting_release_projection.release_state !== "BLOCKED") {
      errors.push({ code: "EG_T05_RESULTING_RELEASE_STATE_INVALID", observed: artifact.resulting_release_projection.release_state });
    }

    if (artifact.resulting_release_projection.validation_state !== "UNVERIFIED") {
      errors.push({ code: "EG_T05_RESULTING_VALIDATION_STATE_INVALID", observed: artifact.resulting_release_projection.validation_state });
    }
  }

  if (!artifact.rejected_release_event || artifact.rejected_release_event.reason_code !== "INTERNAL_EVIDENCE_CLOSURE_NOT_CLOSED") {
    errors.push({ code: "EG_T05_REJECTED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "promote_without_internal_closure_allowed",
    "promote_with_unsatisfied_c_controls_allowed",
    "promote_without_release_decision_record_allowed",
    "promote_without_release_verifier_record_allowed",
    "model_generated_release_promotion_authoritative",
    "ui_manual_release_promotion_authoritative",
    "admin_override_release_promotion_authoritative"
  ]) {
    if (!artifact.release_gate || artifact.release_gate[key] !== false) {
      errors.push({ code: "EG_T05_RELEASE_GATE_OVERCLAIM", key, observed: artifact.release_gate ? artifact.release_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t05_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T05_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible",
    "release_state_accepted",
    "internal_evidence_closed",
    "evidence_closure_closed",
    "validation_state_externally_validated",
    "level4_eligible",
    "legal_review_claimed",
    "commercial_release_authorized",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T05_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T05_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({
      code: "EG_T05_CONTENT_HASH_MISMATCH",
      expected: expectedHash,
      observed: artifact.content_sha256
    });
  }

  const verification = {
    record_type: "MatrixEGT05ReleaseCleanWithoutInternalClosureVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T05-RELEASE-CLEAN-WITHOUT-INTERNAL-CLOSURE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    release_state: artifact.release_state,
    attempted_release_state: artifact.attempted_release_state,
    release_promotion_accepted: artifact.release_promotion_accepted,
    previous_release_state_preserved: artifact.previous_release_state_preserved,
    internal_evidence_closure_closed: artifact.internal_evidence_closure_closed,
    resulting_release_state: artifact.resulting_release_projection ? artifact.resulting_release_projection.release_state : null,
    resulting_validation_state: artifact.resulting_release_projection ? artifact.resulting_release_projection.validation_state : null,
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
  createReleaseStateProjection,
  createInternalClosureState,
  createReleaseCleanPromotionAttempt,
  evaluateReleaseCleanWithoutInternalClosure,
  verifyEGT05ReleaseCleanWithoutInternalClosure
};
