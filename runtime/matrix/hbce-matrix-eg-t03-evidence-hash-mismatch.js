"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-220";
const TEST_ID = "EG-T03";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T03-EVIDENCE-HASH-MISMATCH-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createControlStateProjection({
  control_id = "C01",
  control_state = "PENDING",
  validation_state = "UNVERIFIED",
  state_version = 1
} = {}) {
  const projection = {
    record_type: "ControlStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    control_id,
    namespace: "CONTROL_SATISFACTION_STATE",
    control_state,
    validation_state,
    state_version,
    updated_at: "2026-10-01T17:15:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createEvidenceHashMismatchAttempt({
  control_id = "C01"
} = {}) {
  const canonicalEvidencePayload = {
    evidence_id: "eg-t03-control-c01-evidence-v001",
    evidence_type: "VERIFIER_RECORD_REF",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    control_id,
    result: "PASS_CLAIMED_BY_SOURCE",
    produced_at: "2026-10-01T17:16:00+02:00"
  };

  const expectedEvidenceSha256 = sha256Record(canonicalEvidencePayload);
  const suppliedEvidencePayload = {
    ...canonicalEvidencePayload,
    result: "PASS_CLAIMED_BY_SOURCE_TAMPERED_AFTER_BINDING"
  };
  const suppliedEvidenceSha256 = sha256Record(suppliedEvidencePayload);

  const attempt = {
    attempt_id: "eg-t03-evidence-hash-mismatch-attempt-v001",
    attempt_type: "EVIDENCE_HASH_BINDING_VALIDATION",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    control_id,
    namespace: "CONTROL_SATISFACTION_STATE",
    expected_evidence_payload: canonicalEvidencePayload,
    supplied_evidence_payload: suppliedEvidencePayload,
    expected_evidence_sha256: expectedEvidenceSha256,
    supplied_evidence_sha256: suppliedEvidenceSha256,
    hash_match: expectedEvidenceSha256 === suppliedEvidenceSha256,
    attempted_validation_result: "PASS",
    attempted_control_state: "PASS",
    attempted_by: "HASH_MISMATCH_EVIDENCE_BINDING",
    verifier_record_ref: null,
    decision_record_ref: null,
    transition_event_ref: null,
    attempted_at: "2026-10-01T17:17:00+02:00",
    attempt_sha256: null
  };

  attempt.attempt_sha256 = sha256Record({ ...attempt, attempt_sha256: null });
  return attempt;
}

function evaluateEvidenceHashMismatch({
  priorProjection = createControlStateProjection(),
  hashAttempt = createEvidenceHashMismatchAttempt(),
  evaluated_at = "2026-10-01T17:18:00+02:00"
} = {}) {
  const mismatchDetected = hashAttempt.expected_evidence_sha256 !== hashAttempt.supplied_evidence_sha256;

  const rejectedValidationEvent = {
    event_id: "rejected-validation-eg-t03-evidence-hash-mismatch-v001",
    event_type: "RejectedValidationEvent",
    request_ref: hashAttempt.attempt_id,
    tenant_id: hashAttempt.tenant_id,
    subject_ref: hashAttempt.subject_ref,
    control_id: hashAttempt.control_id,
    namespace: hashAttempt.namespace,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "EVIDENCE_HASH_MISMATCH",
    expected_evidence_sha256: hashAttempt.expected_evidence_sha256,
    supplied_evidence_sha256: hashAttempt.supplied_evidence_sha256,
    preserved_state_ref: priorProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedValidationEvent.event_hash = sha256Record({ ...rejectedValidationEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T03_EvidenceHashMismatch_v001",
    artifact_type: "MatrixEGT03EvidenceHashMismatchRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "REJECT + EVIDENCE_HASH_MISMATCH",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    prior_control_projection: priorProjection,
    hash_attempt: hashAttempt,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "EVIDENCE_HASH_MISMATCH",
    expected_evidence_sha256: hashAttempt.expected_evidence_sha256,
    supplied_evidence_sha256: hashAttempt.supplied_evidence_sha256,
    evidence_hash_match: false,
    evidence_integrity_verified: false,
    evidence_accepted: false,
    evidence_authoritative: false,
    rejected_validation_event_emitted: true,
    rejected_validation_event: rejectedValidationEvent,
    previous_control_state_preserved: true,
    resulting_control_projection: priorProjection,
    control_state_changed: false,
    validation_state_changed: false,
    state_version_changed: false,
    hash_mismatch_detected: mismatchDetected,
    mismatch_classification: "EVIDENCE_HASH_MISMATCH",
    integrity_gate: {
      accept_mismatched_hash_allowed: false,
      accept_unbound_evidence_allowed: false,
      accept_tampered_payload_allowed: false,
      verifier_override_allowed: false,
      model_repair_of_hash_allowed: false,
      ui_manual_hash_acceptance_allowed: false,
      admin_override_hash_acceptance_allowed: false
    },
    runtime_claims: {
      eg_t03_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      control_c01_satisfied: false,
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
    maximum_supported_claim: "EG_T03_EVIDENCE_HASH_MISMATCH_REJECTED_PREVIOUS_STATE_PRESERVED",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT03EvidenceHashMismatch(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT03EvidenceHashMismatchVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T03_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) {
    errors.push({ code: "EG_T03_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  }

  if (artifact.program_id !== PROGRAM_ID) {
    errors.push({ code: "EG_T03_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  }

  if (artifact.test_id !== TEST_ID) {
    errors.push({ code: "EG_T03_TEST_ID_MISMATCH", observed: artifact.test_id });
  }

  if (artifact.decision_result !== "REJECT") {
    errors.push({ code: "EG_T03_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  }

  if (artifact.reason_code !== "EVIDENCE_HASH_MISMATCH") {
    errors.push({ code: "EG_T03_REASON_CODE_INVALID", observed: artifact.reason_code });
  }

  if (artifact.validation_result !== "UNVERIFIED") {
    errors.push({ code: "EG_T03_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  }

  if (artifact.evidence_hash_match !== false) {
    errors.push({ code: "EG_T03_HASH_MATCH_OVERCLAIM", observed: artifact.evidence_hash_match });
  }

  if (artifact.evidence_integrity_verified !== false) {
    errors.push({ code: "EG_T03_EVIDENCE_INTEGRITY_OVERCLAIM", observed: artifact.evidence_integrity_verified });
  }

  if (artifact.evidence_accepted !== false) {
    errors.push({ code: "EG_T03_EVIDENCE_ACCEPTED_OVERCLAIM", observed: artifact.evidence_accepted });
  }

  if (artifact.evidence_authoritative !== false) {
    errors.push({ code: "EG_T03_EVIDENCE_AUTHORITY_OVERCLAIM", observed: artifact.evidence_authoritative });
  }

  if (artifact.expected_evidence_sha256 === artifact.supplied_evidence_sha256) {
    errors.push({ code: "EG_T03_HASH_MISMATCH_NOT_PRESENT" });
  }

  if (artifact.hash_mismatch_detected !== true) {
    errors.push({ code: "EG_T03_HASH_MISMATCH_NOT_DETECTED" });
  }

  if (artifact.mismatch_classification !== "EVIDENCE_HASH_MISMATCH") {
    errors.push({ code: "EG_T03_MISMATCH_CLASSIFICATION_INVALID", observed: artifact.mismatch_classification });
  }

  if (artifact.rejected_validation_event_emitted !== true) {
    errors.push({ code: "EG_T03_REJECTED_VALIDATION_EVENT_NOT_EMITTED" });
  }

  if (!artifact.rejected_validation_event || artifact.rejected_validation_event.reason_code !== "EVIDENCE_HASH_MISMATCH") {
    errors.push({ code: "EG_T03_REJECTED_EVENT_REASON_INVALID" });
  }

  if (artifact.previous_control_state_preserved !== true) {
    errors.push({ code: "EG_T03_PREVIOUS_CONTROL_STATE_NOT_PRESERVED" });
  }

  if (artifact.control_state_changed !== false) {
    errors.push({ code: "EG_T03_CONTROL_STATE_CHANGED", observed: artifact.control_state_changed });
  }

  if (artifact.validation_state_changed !== false) {
    errors.push({ code: "EG_T03_VALIDATION_STATE_CHANGED", observed: artifact.validation_state_changed });
  }

  if (artifact.state_version_changed !== false) {
    errors.push({ code: "EG_T03_STATE_VERSION_CHANGED", observed: artifact.state_version_changed });
  }

  if (!artifact.prior_control_projection || !artifact.resulting_control_projection) {
    errors.push({ code: "EG_T03_CONTROL_PROJECTION_PAIR_MISSING" });
  } else {
    if (artifact.prior_control_projection.projection_hash !== artifact.resulting_control_projection.projection_hash) {
      errors.push({
        code: "EG_T03_RESULTING_CONTROL_PROJECTION_HASH_CHANGED",
        prior: artifact.prior_control_projection.projection_hash,
        resulting: artifact.resulting_control_projection.projection_hash
      });
    }

    if (artifact.resulting_control_projection.control_state !== "PENDING") {
      errors.push({ code: "EG_T03_RESULTING_CONTROL_STATE_INVALID", observed: artifact.resulting_control_projection.control_state });
    }

    if (artifact.resulting_control_projection.validation_state !== "UNVERIFIED") {
      errors.push({ code: "EG_T03_RESULTING_VALIDATION_STATE_INVALID", observed: artifact.resulting_control_projection.validation_state });
    }
  }

  for (const key of [
    "accept_mismatched_hash_allowed",
    "accept_unbound_evidence_allowed",
    "accept_tampered_payload_allowed",
    "verifier_override_allowed",
    "model_repair_of_hash_allowed",
    "ui_manual_hash_acceptance_allowed",
    "admin_override_hash_acceptance_allowed"
  ]) {
    if (!artifact.integrity_gate || artifact.integrity_gate[key] !== false) {
      errors.push({ code: "EG_T03_INTEGRITY_GATE_OVERCLAIM", key, observed: artifact.integrity_gate ? artifact.integrity_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t03_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T03_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "control_c01_satisfied",
    "evidence_closure_closed",
    "validation_state_externally_validated",
    "level4_eligible",
    "legal_review_claimed",
    "commercial_release_authorized",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T03_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T03_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({
      code: "EG_T03_CONTENT_HASH_MISMATCH",
      expected: expectedHash,
      observed: artifact.content_sha256
    });
  }

  const verification = {
    record_type: "MatrixEGT03EvidenceHashMismatchVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T03-EVIDENCE-HASH-MISMATCH-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    evidence_hash_match: artifact.evidence_hash_match,
    evidence_integrity_verified: artifact.evidence_integrity_verified,
    evidence_accepted: artifact.evidence_accepted,
    previous_control_state_preserved: artifact.previous_control_state_preserved,
    resulting_control_state: artifact.resulting_control_projection ? artifact.resulting_control_projection.control_state : null,
    resulting_validation_state: artifact.resulting_control_projection ? artifact.resulting_control_projection.validation_state : null,
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
  createControlStateProjection,
  createEvidenceHashMismatchAttempt,
  evaluateEvidenceHashMismatch,
  verifyEGT03EvidenceHashMismatch
};
