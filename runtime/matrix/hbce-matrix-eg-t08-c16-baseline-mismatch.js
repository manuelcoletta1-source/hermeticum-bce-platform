"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-227";
const TEST_ID = "EG-T08";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T08-C16-BASELINE-MISMATCH-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createCurrentBaselineRecord() {
  const record = {
    record_type: "MatrixCurrentBaselineRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    baseline_id: "MATRIX-BASELINE-CURRENT-2026-10-01-R3",
    baseline_scope: "MATRIX_OPERATING_PROGRAMMING_MASTER_R3_STATIC_CONTRACT",
    baseline_version: "V1.3-R3",
    registry_ref: "matrix/index/hbce-canonical-nomenclature-index.json",
    generated_at: "2026-10-01T18:45:00+02:00",
    baseline_sha256: null
  };

  record.baseline_sha256 = sha256Record({ ...record, baseline_sha256: null });
  return record;
}

function createC16BaselineClaim() {
  const record = {
    record_type: "C16ExternalValidationBaselineClaim",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    validation_scope: "C16_EXTERNAL_VALIDATION",
    claimed_baseline_id: "MATRIX-BASELINE-C16-OBSERVED-2026-09-30-R2",
    claimed_baseline_scope: "PRIOR_MATRIX_VALIDATION_BASELINE",
    claimed_baseline_version: "V1.2-R2",
    claimed_at: "2026-10-01T18:46:00+02:00",
    claimed_baseline_sha256: null,
    c16_evidence_ref: "C16-EXTERNAL-VALIDATION-CLAIM-BASELINE-MISMATCH-V001"
  };

  record.claimed_baseline_sha256 = sha256Record({ ...record, claimed_baseline_sha256: null });
  return record;
}

function createValidationStateProjection({
  validation_state = "INTERNAL_ONLY",
  c16_state = "NOT_ACCEPTED",
  state_version = 1
} = {}) {
  const projection = {
    record_type: "ValidationStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "VALIDATION_STATE",
    validation_state,
    c16_state,
    state_version,
    externally_validated: false,
    updated_at: "2026-10-01T18:47:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createC16ValidationAttempt({
  currentBaseline = createCurrentBaselineRecord(),
  c16BaselineClaim = createC16BaselineClaim(),
  priorProjection = createValidationStateProjection()
} = {}) {
  const attempt = {
    attempt_id: "eg-t08-c16-baseline-mismatch-attempt-v001",
    attempt_type: "C16_EXTERNAL_VALIDATION_BASELINE_BINDING",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "VALIDATION_STATE",
    attempted_from: priorProjection.validation_state,
    attempted_to: "EXTERNALLY_VALIDATED",
    current_baseline_id: currentBaseline.baseline_id,
    current_baseline_sha256: currentBaseline.baseline_sha256,
    claimed_c16_baseline_id: c16BaselineClaim.claimed_baseline_id,
    claimed_c16_baseline_sha256: c16BaselineClaim.claimed_baseline_sha256,
    baseline_match: currentBaseline.baseline_sha256 === c16BaselineClaim.claimed_baseline_sha256,
    c16_evidence_ref: c16BaselineClaim.c16_evidence_ref,
    attempted_at: "2026-10-01T18:48:00+02:00",
    attempt_sha256: null
  };

  attempt.attempt_sha256 = sha256Record({ ...attempt, attempt_sha256: null });
  return attempt;
}

function evaluateC16BaselineMismatch({
  currentBaseline = createCurrentBaselineRecord(),
  c16BaselineClaim = createC16BaselineClaim(),
  priorProjection = createValidationStateProjection(),
  evaluated_at = "2026-10-01T18:49:00+02:00"
} = {}) {
  const attempt = createC16ValidationAttempt({
    currentBaseline,
    c16BaselineClaim,
    priorProjection
  });

  const rejectedEvent = {
    event_id: "rejected-validation-eg-t08-c16-baseline-mismatch-v001",
    event_type: "RejectedC16BaselineValidationEvent",
    request_ref: attempt.attempt_id,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "VALIDATION_STATE",
    attempted_from: attempt.attempted_from,
    attempted_to: attempt.attempted_to,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "BASELINE_MISMATCH",
    current_baseline_sha256: attempt.current_baseline_sha256,
    claimed_c16_baseline_sha256: attempt.claimed_c16_baseline_sha256,
    preserved_state_ref: priorProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedEvent.event_hash = sha256Record({ ...rejectedEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T08_C16BaselineMismatch_v001",
    artifact_type: "MatrixEGT08C16BaselineMismatchRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "REJECT + BASELINE_MISMATCH",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    current_baseline: currentBaseline,
    c16_baseline_claim: c16BaselineClaim,
    prior_validation_projection: priorProjection,
    c16_validation_attempt: attempt,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "BASELINE_MISMATCH",
    baseline_match: false,
    c16_evidence_accepted: false,
    c16_authoritative: false,
    c16_external_validation_completed: false,
    external_validation_accepted: false,
    externally_validated: false,
    rejected_validation_event_emitted: true,
    rejected_validation_event: rejectedEvent,
    previous_validation_state_preserved: true,
    resulting_validation_projection: priorProjection,
    validation_state: "INTERNAL_ONLY",
    attempted_validation_state: "EXTERNALLY_VALIDATED",
    c16_state: "NOT_ACCEPTED",
    validation_state_changed: false,
    c16_state_changed: false,
    state_version_changed: false,
    baseline_gate: {
      accept_c16_with_baseline_mismatch_allowed: false,
      promote_externally_validated_with_mismatch_allowed: false,
      verifier_override_baseline_mismatch_allowed: false,
      model_repair_baseline_mismatch_authoritative: false,
      ui_manual_acceptance_authoritative: false,
      admin_override_authoritative: false
    },
    runtime_claims: {
      eg_t08_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      c16_external_validation_completed: false,
      external_validation_accepted: false,
      externally_validated: false,
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
    maximum_supported_claim: "EG_T08_C16_BASELINE_MISMATCH_REJECTED_PREVIOUS_VALIDATION_STATE_PRESERVED",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT08C16BaselineMismatch(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT08C16BaselineMismatchVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T08_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T08_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T08_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T08_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.decision_result !== "REJECT") errors.push({ code: "EG_T08_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  if (artifact.validation_result !== "UNVERIFIED") errors.push({ code: "EG_T08_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  if (artifact.reason_code !== "BASELINE_MISMATCH") errors.push({ code: "EG_T08_REASON_CODE_INVALID", observed: artifact.reason_code });
  if (artifact.baseline_match !== false) errors.push({ code: "EG_T08_BASELINE_MATCH_OVERCLAIM", observed: artifact.baseline_match });
  if (artifact.c16_evidence_accepted !== false) errors.push({ code: "EG_T08_C16_EVIDENCE_ACCEPTED_OVERCLAIM", observed: artifact.c16_evidence_accepted });
  if (artifact.c16_authoritative !== false) errors.push({ code: "EG_T08_C16_AUTHORITY_OVERCLAIM", observed: artifact.c16_authoritative });
  if (artifact.c16_external_validation_completed !== false) errors.push({ code: "EG_T08_C16_COMPLETION_OVERCLAIM", observed: artifact.c16_external_validation_completed });
  if (artifact.external_validation_accepted !== false) errors.push({ code: "EG_T08_EXTERNAL_VALIDATION_ACCEPTED_OVERCLAIM", observed: artifact.external_validation_accepted });
  if (artifact.externally_validated !== false) errors.push({ code: "EG_T08_EXTERNALLY_VALIDATED_OVERCLAIM", observed: artifact.externally_validated });
  if (artifact.validation_state !== "INTERNAL_ONLY") errors.push({ code: "EG_T08_VALIDATION_STATE_INVALID", observed: artifact.validation_state });
  if (artifact.attempted_validation_state !== "EXTERNALLY_VALIDATED") errors.push({ code: "EG_T08_ATTEMPTED_VALIDATION_STATE_INVALID", observed: artifact.attempted_validation_state });
  if (artifact.c16_state !== "NOT_ACCEPTED") errors.push({ code: "EG_T08_C16_STATE_INVALID", observed: artifact.c16_state });
  if (artifact.previous_validation_state_preserved !== true) errors.push({ code: "EG_T08_PREVIOUS_VALIDATION_STATE_NOT_PRESERVED" });
  if (artifact.validation_state_changed !== false) errors.push({ code: "EG_T08_VALIDATION_STATE_CHANGED", observed: artifact.validation_state_changed });
  if (artifact.c16_state_changed !== false) errors.push({ code: "EG_T08_C16_STATE_CHANGED", observed: artifact.c16_state_changed });
  if (artifact.state_version_changed !== false) errors.push({ code: "EG_T08_STATE_VERSION_CHANGED", observed: artifact.state_version_changed });

  if (!artifact.current_baseline || !artifact.c16_baseline_claim) {
    errors.push({ code: "EG_T08_BASELINE_RECORDS_MISSING" });
  } else if (artifact.current_baseline.baseline_sha256 === artifact.c16_baseline_claim.claimed_baseline_sha256) {
    errors.push({ code: "EG_T08_BASELINES_DO_NOT_DIFFER" });
  }

  if (!artifact.prior_validation_projection || !artifact.resulting_validation_projection) {
    errors.push({ code: "EG_T08_VALIDATION_PROJECTION_PAIR_MISSING" });
  } else {
    if (artifact.prior_validation_projection.projection_hash !== artifact.resulting_validation_projection.projection_hash) {
      errors.push({
        code: "EG_T08_RESULTING_VALIDATION_PROJECTION_HASH_CHANGED",
        prior: artifact.prior_validation_projection.projection_hash,
        resulting: artifact.resulting_validation_projection.projection_hash
      });
    }

    if (artifact.resulting_validation_projection.validation_state !== "INTERNAL_ONLY") {
      errors.push({ code: "EG_T08_RESULTING_VALIDATION_STATE_INVALID", observed: artifact.resulting_validation_projection.validation_state });
    }

    if (artifact.resulting_validation_projection.c16_state !== "NOT_ACCEPTED") {
      errors.push({ code: "EG_T08_RESULTING_C16_STATE_INVALID", observed: artifact.resulting_validation_projection.c16_state });
    }
  }

  if (!artifact.rejected_validation_event || artifact.rejected_validation_event.reason_code !== "BASELINE_MISMATCH") {
    errors.push({ code: "EG_T08_REJECTED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "accept_c16_with_baseline_mismatch_allowed",
    "promote_externally_validated_with_mismatch_allowed",
    "verifier_override_baseline_mismatch_allowed",
    "model_repair_baseline_mismatch_authoritative",
    "ui_manual_acceptance_authoritative",
    "admin_override_authoritative"
  ]) {
    if (!artifact.baseline_gate || artifact.baseline_gate[key] !== false) {
      errors.push({ code: "EG_T08_BASELINE_GATE_OVERCLAIM", key, observed: artifact.baseline_gate ? artifact.baseline_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t08_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T08_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "externally_validated",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T08_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T08_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T08_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT08C16BaselineMismatchVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T08-C16-BASELINE-MISMATCH-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    baseline_match: artifact.baseline_match,
    validation_state: artifact.validation_state,
    attempted_validation_state: artifact.attempted_validation_state,
    c16_state: artifact.c16_state,
    c16_evidence_accepted: artifact.c16_evidence_accepted,
    externally_validated: artifact.externally_validated,
    previous_validation_state_preserved: artifact.previous_validation_state_preserved,
    resulting_validation_state: artifact.resulting_validation_projection ? artifact.resulting_validation_projection.validation_state : null,
    resulting_c16_state: artifact.resulting_validation_projection ? artifact.resulting_validation_projection.c16_state : null,
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
  createCurrentBaselineRecord,
  createC16BaselineClaim,
  createValidationStateProjection,
  createC16ValidationAttempt,
  evaluateC16BaselineMismatch,
  verifyEGT08C16BaselineMismatch
};
