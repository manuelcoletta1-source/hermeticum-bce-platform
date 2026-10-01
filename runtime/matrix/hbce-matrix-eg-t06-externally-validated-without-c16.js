"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-223";
const TEST_ID = "EG-T06";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T06-EXTERNALLY-VALIDATED-WITHOUT-C16-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createValidationStateProjection({
  validation_state = "NOT_EXTERNALLY_VALIDATED",
  release_state = "BLOCKED",
  state_version = 1
} = {}) {
  const projection = {
    record_type: "ValidationStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "EXTERNAL_VALIDATION_STATE",
    validation_state,
    release_state,
    state_version,
    required_preconditions: [
      "C16_EXTERNAL_VALIDATION_ACCEPTED",
      "C16_VALIDATOR_RECORD_PRESENT",
      "C16_VALIDATOR_INDEPENDENCE_ATTESTED",
      "EXTERNAL_VALIDATION_REPORT_HASH_BOUND"
    ],
    satisfied_preconditions: [],
    missing_preconditions: [
      "C16_EXTERNAL_VALIDATION_ACCEPTED",
      "C16_VALIDATOR_RECORD_PRESENT",
      "C16_VALIDATOR_INDEPENDENCE_ATTESTED",
      "EXTERNAL_VALIDATION_REPORT_HASH_BOUND"
    ],
    updated_at: "2026-10-01T18:00:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createC16ExternalValidationState({
  c16_state = "NOT_PERFORMED",
  validation_state = "UNVERIFIED"
} = {}) {
  const c16 = {
    record_type: "C16ExternalValidationState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    control_id: "C16",
    control_name: "External Validation",
    c16_state,
    validation_state,
    external_validator_ref: null,
    external_validation_report_ref: null,
    external_validation_report_sha256: null,
    validator_independence_attested: false,
    external_validation_accepted: false,
    performed_at: null,
    state_hash: null
  };

  c16.state_hash = sha256Record({ ...c16, state_hash: null });
  return c16;
}

function createExternallyValidatedPromotionAttempt({
  priorValidationProjection = createValidationStateProjection(),
  c16State = createC16ExternalValidationState()
} = {}) {
  const missingPreconditions = [];

  if (c16State.external_validation_accepted !== true) {
    missingPreconditions.push("C16_EXTERNAL_VALIDATION_ACCEPTED");
  }

  if (!c16State.external_validator_ref) {
    missingPreconditions.push("C16_VALIDATOR_RECORD_PRESENT");
  }

  if (c16State.validator_independence_attested !== true) {
    missingPreconditions.push("C16_VALIDATOR_INDEPENDENCE_ATTESTED");
  }

  if (!c16State.external_validation_report_sha256) {
    missingPreconditions.push("EXTERNAL_VALIDATION_REPORT_HASH_BOUND");
  }

  const attempt = {
    attempt_id: "eg-t06-externally-validated-without-c16-attempt-v001",
    attempt_type: "EXTERNAL_VALIDATION_STATE_PROMOTION",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "EXTERNAL_VALIDATION_STATE",
    attempted_from: priorValidationProjection.validation_state,
    attempted_to: "EXTERNALLY_VALIDATED",
    attempted_release_state: "EXTERNALLY_VALIDATED",
    c16_external_validation_state: c16State,
    required_preconditions: priorValidationProjection.required_preconditions,
    missing_preconditions: missingPreconditions,
    missing_precondition_count: missingPreconditions.length,
    attempted_by: "UNVERIFIED_EXTERNAL_VALIDATION_PROMOTION_REQUEST",
    c16_validator_record_ref: null,
    external_validation_decision_record_ref: null,
    external_validation_event_ref: null,
    attempted_at: "2026-10-01T18:01:00+02:00",
    attempt_sha256: null
  };

  attempt.attempt_sha256 = sha256Record({ ...attempt, attempt_sha256: null });
  return attempt;
}

function evaluateExternallyValidatedWithoutC16({
  priorValidationProjection = createValidationStateProjection(),
  promotionAttempt = null,
  evaluated_at = "2026-10-01T18:02:00+02:00"
} = {}) {
  const attempt = promotionAttempt || createExternallyValidatedPromotionAttempt({ priorValidationProjection });
  const missing = Array.isArray(attempt.missing_preconditions) ? attempt.missing_preconditions : [];

  const rejectedValidationEvent = {
    event_id: "rejected-validation-eg-t06-externally-validated-without-c16-v001",
    event_type: "RejectedExternalValidationPromotionEvent",
    request_ref: attempt.attempt_id,
    tenant_id: attempt.tenant_id,
    subject_ref: attempt.subject_ref,
    namespace: attempt.namespace,
    attempted_from: attempt.attempted_from,
    attempted_to: attempt.attempted_to,
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "C16_EXTERNAL_VALIDATION_NOT_PERFORMED",
    missing_preconditions: missing,
    preserved_state_ref: priorValidationProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedValidationEvent.event_hash = sha256Record({ ...rejectedValidationEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T06_ExternallyValidatedWithoutC16_v001",
    artifact_type: "MatrixEGT06ExternallyValidatedWithoutC16RuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "BLOCK; validation state does not advance",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    prior_validation_projection: priorValidationProjection,
    promotion_attempt: attempt,
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "C16_EXTERNAL_VALIDATION_NOT_PERFORMED",
    external_validation_promotion_accepted: false,
    external_validation_authoritative: false,
    rejected_validation_event_emitted: true,
    rejected_validation_event: rejectedValidationEvent,
    previous_validation_state_preserved: true,
    resulting_validation_projection: priorValidationProjection,
    validation_state_changed: false,
    release_state_changed: false,
    state_version_changed: false,
    validation_state: "NOT_EXTERNALLY_VALIDATED",
    attempted_validation_state: "EXTERNALLY_VALIDATED",
    c16_required: true,
    c16_performed: false,
    c16_external_validation_accepted: false,
    externally_validated: false,
    missing_preconditions: missing,
    missing_precondition_count: missing.length,
    validation_gate: {
      promote_without_c16_allowed: false,
      promote_without_external_validator_allowed: false,
      promote_without_validator_independence_allowed: false,
      promote_without_report_hash_allowed: false,
      model_generated_external_validation_authoritative: false,
      ui_manual_external_validation_authoritative: false,
      admin_override_external_validation_authoritative: false
    },
    runtime_claims: {
      eg_t06_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      externally_validated: false,
      c16_external_validation_completed: false,
      validation_state_externally_validated: false,
      release_clean_eligible: false,
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
    maximum_supported_claim: "EG_T06_EXTERNAL_VALIDATION_PROMOTION_BLOCKED_VALIDATION_STATE_NOT_ADVANCED",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT06ExternallyValidatedWithoutC16(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT06ExternallyValidatedWithoutC16VerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T06_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) {
    errors.push({ code: "EG_T06_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  }

  if (artifact.program_id !== PROGRAM_ID) {
    errors.push({ code: "EG_T06_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  }

  if (artifact.test_id !== TEST_ID) {
    errors.push({ code: "EG_T06_TEST_ID_MISMATCH", observed: artifact.test_id });
  }

  if (artifact.decision_result !== "BLOCK") {
    errors.push({ code: "EG_T06_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  }

  if (artifact.validation_result !== "UNVERIFIED") {
    errors.push({ code: "EG_T06_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  }

  if (artifact.reason_code !== "C16_EXTERNAL_VALIDATION_NOT_PERFORMED") {
    errors.push({ code: "EG_T06_REASON_CODE_INVALID", observed: artifact.reason_code });
  }

  if (artifact.validation_state !== "NOT_EXTERNALLY_VALIDATED") {
    errors.push({ code: "EG_T06_VALIDATION_STATE_INVALID", observed: artifact.validation_state });
  }

  if (artifact.attempted_validation_state !== "EXTERNALLY_VALIDATED") {
    errors.push({ code: "EG_T06_ATTEMPTED_VALIDATION_STATE_INVALID", observed: artifact.attempted_validation_state });
  }

  if (artifact.external_validation_promotion_accepted !== false) {
    errors.push({ code: "EG_T06_EXTERNAL_VALIDATION_PROMOTION_ACCEPTED_OVERCLAIM", observed: artifact.external_validation_promotion_accepted });
  }

  if (artifact.external_validation_authoritative !== false) {
    errors.push({ code: "EG_T06_EXTERNAL_VALIDATION_AUTHORITY_OVERCLAIM", observed: artifact.external_validation_authoritative });
  }

  if (artifact.rejected_validation_event_emitted !== true) {
    errors.push({ code: "EG_T06_REJECTED_VALIDATION_EVENT_NOT_EMITTED" });
  }

  if (artifact.previous_validation_state_preserved !== true) {
    errors.push({ code: "EG_T06_PREVIOUS_VALIDATION_STATE_NOT_PRESERVED" });
  }

  if (artifact.validation_state_changed !== false) {
    errors.push({ code: "EG_T06_VALIDATION_STATE_CHANGED", observed: artifact.validation_state_changed });
  }

  if (artifact.release_state_changed !== false) {
    errors.push({ code: "EG_T06_RELEASE_STATE_CHANGED", observed: artifact.release_state_changed });
  }

  if (artifact.state_version_changed !== false) {
    errors.push({ code: "EG_T06_STATE_VERSION_CHANGED", observed: artifact.state_version_changed });
  }

  if (artifact.c16_required !== true) {
    errors.push({ code: "EG_T06_C16_NOT_REQUIRED" });
  }

  if (artifact.c16_performed !== false) {
    errors.push({ code: "EG_T06_C16_PERFORMED_OVERCLAIM", observed: artifact.c16_performed });
  }

  if (artifact.c16_external_validation_accepted !== false) {
    errors.push({ code: "EG_T06_C16_ACCEPTED_OVERCLAIM", observed: artifact.c16_external_validation_accepted });
  }

  if (artifact.externally_validated !== false) {
    errors.push({ code: "EG_T06_EXTERNALLY_VALIDATED_OVERCLAIM", observed: artifact.externally_validated });
  }

  if (!Array.isArray(artifact.missing_preconditions) || !artifact.missing_preconditions.includes("C16_EXTERNAL_VALIDATION_ACCEPTED")) {
    errors.push({ code: "EG_T06_C16_MISSING_PRECONDITION_NOT_RECORDED" });
  }

  if (!artifact.prior_validation_projection || !artifact.resulting_validation_projection) {
    errors.push({ code: "EG_T06_VALIDATION_PROJECTION_PAIR_MISSING" });
  } else {
    if (artifact.prior_validation_projection.projection_hash !== artifact.resulting_validation_projection.projection_hash) {
      errors.push({
        code: "EG_T06_RESULTING_VALIDATION_PROJECTION_HASH_CHANGED",
        prior: artifact.prior_validation_projection.projection_hash,
        resulting: artifact.resulting_validation_projection.projection_hash
      });
    }

    if (artifact.resulting_validation_projection.validation_state !== "NOT_EXTERNALLY_VALIDATED") {
      errors.push({ code: "EG_T06_RESULTING_VALIDATION_STATE_INVALID", observed: artifact.resulting_validation_projection.validation_state });
    }

    if (artifact.resulting_validation_projection.release_state !== "BLOCKED") {
      errors.push({ code: "EG_T06_RESULTING_RELEASE_STATE_INVALID", observed: artifact.resulting_validation_projection.release_state });
    }
  }

  if (!artifact.rejected_validation_event || artifact.rejected_validation_event.reason_code !== "C16_EXTERNAL_VALIDATION_NOT_PERFORMED") {
    errors.push({ code: "EG_T06_REJECTED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "promote_without_c16_allowed",
    "promote_without_external_validator_allowed",
    "promote_without_validator_independence_allowed",
    "promote_without_report_hash_allowed",
    "model_generated_external_validation_authoritative",
    "ui_manual_external_validation_authoritative",
    "admin_override_external_validation_authoritative"
  ]) {
    if (!artifact.validation_gate || artifact.validation_gate[key] !== false) {
      errors.push({ code: "EG_T06_VALIDATION_GATE_OVERCLAIM", key, observed: artifact.validation_gate ? artifact.validation_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t06_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T06_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "externally_validated",
    "c16_external_validation_completed",
    "validation_state_externally_validated",
    "release_clean_eligible",
    "level4_eligible",
    "legal_review_claimed",
    "commercial_release_authorized",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T06_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T06_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({
      code: "EG_T06_CONTENT_HASH_MISMATCH",
      expected: expectedHash,
      observed: artifact.content_sha256
    });
  }

  const verification = {
    record_type: "MatrixEGT06ExternallyValidatedWithoutC16VerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T06-EXTERNALLY-VALIDATED-WITHOUT-C16-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    validation_state: artifact.validation_state,
    attempted_validation_state: artifact.attempted_validation_state,
    external_validation_promotion_accepted: artifact.external_validation_promotion_accepted,
    previous_validation_state_preserved: artifact.previous_validation_state_preserved,
    c16_performed: artifact.c16_performed,
    resulting_validation_state: artifact.resulting_validation_projection ? artifact.resulting_validation_projection.validation_state : null,
    resulting_release_state: artifact.resulting_validation_projection ? artifact.resulting_validation_projection.release_state : null,
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
  createValidationStateProjection,
  createC16ExternalValidationState,
  createExternallyValidatedPromotionAttempt,
  evaluateExternallyValidatedWithoutC16,
  verifyEGT06ExternallyValidatedWithoutC16
};
