"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-219";
const TEST_ID = "EG-T02";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T02-PROTECTED-PASS-MISSING-REQUIRED-EVIDENCE-V0.1";

const REQUIRED_EVIDENCE_TYPES = [
  "CONTROL_SPEC_REF",
  "EXECUTION_TRACE_REF",
  "VERIFIER_RECORD_REF",
  "EVIDENCE_HASH_REF",
  "HUMAN_ACCEPTANCE_REF"
];

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
    required_evidence_types: REQUIRED_EVIDENCE_TYPES,
    satisfied_evidence_refs: [],
    missing_required_evidence_types: REQUIRED_EVIDENCE_TYPES,
    updated_at: "2026-10-01T17:00:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createProtectedPassAttempt({
  control_id = "C01",
  attempted_to = "PASS",
  provided_evidence_refs = []
} = {}) {
  const attempt = {
    attempt_id: "eg-t02-protected-pass-missing-required-evidence-attempt-v001",
    attempt_type: "PROTECTED_PASS_ASSERTION",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    control_id,
    namespace: "CONTROL_SATISFACTION_STATE",
    attempted_from: "PENDING",
    attempted_to,
    attempted_by: "UNVERIFIED_PASS_ASSERTION",
    actor_class: "UNVERIFIED_ASSERTION",
    provided_evidence_refs,
    required_evidence_types: REQUIRED_EVIDENCE_TYPES,
    missing_required_evidence_types: REQUIRED_EVIDENCE_TYPES.filter((requiredType) => {
      return !provided_evidence_refs.some((ref) => ref && ref.evidence_type === requiredType);
    }),
    decision_record_ref: null,
    verifier_record_ref: null,
    transition_event_ref: null,
    attempted_at: "2026-10-01T17:01:00+02:00",
    attempt_sha256: null
  };

  attempt.attempt_sha256 = sha256Record({ ...attempt, attempt_sha256: null });
  return attempt;
}

function evaluateProtectedPassMissingRequiredEvidence({
  priorProjection = createControlStateProjection(),
  passAttempt = createProtectedPassAttempt(),
  evaluated_at = "2026-10-01T17:02:00+02:00"
} = {}) {
  const missingRequiredEvidence = Array.isArray(passAttempt.missing_required_evidence_types)
    ? passAttempt.missing_required_evidence_types
    : REQUIRED_EVIDENCE_TYPES;

  const rejectedValidationEvent = {
    event_id: "rejected-validation-eg-t02-protected-pass-missing-required-evidence-v001",
    event_type: "RejectedValidationEvent",
    request_ref: passAttempt.attempt_id,
    tenant_id: passAttempt.tenant_id,
    subject_ref: passAttempt.subject_ref,
    control_id: passAttempt.control_id,
    namespace: passAttempt.namespace,
    attempted_from: passAttempt.attempted_from,
    attempted_to: passAttempt.attempted_to,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "MISSING_REQUIRED_EVIDENCE",
    missing_required_evidence_types: missingRequiredEvidence,
    preserved_state_ref: priorProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedValidationEvent.event_hash = sha256Record({ ...rejectedValidationEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T02_ProtectedPassMissingRequiredEvidence_v001",
    artifact_type: "MatrixEGT02ProtectedPassMissingRequiredEvidenceRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "REJECT/UNVERIFIED + MISSING_REQUIRED_EVIDENCE",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    prior_control_projection: priorProjection,
    pass_attempt: passAttempt,
    decision_result: "REJECT",
    validation_result: "UNVERIFIED",
    reason_code: "MISSING_REQUIRED_EVIDENCE",
    protected_pass_accepted: false,
    pass_authoritative: false,
    rejected_validation_event_emitted: true,
    rejected_validation_event: rejectedValidationEvent,
    previous_control_state_preserved: true,
    resulting_control_projection: priorProjection,
    control_state_changed: false,
    validation_state_changed: false,
    state_version_changed: false,
    mandatory_evidence_required: true,
    mandatory_evidence_complete: false,
    missing_required_evidence_types: missingRequiredEvidence,
    evidence_gate: {
      pass_without_control_spec_allowed: false,
      pass_without_execution_trace_allowed: false,
      pass_without_verifier_record_allowed: false,
      pass_without_evidence_hash_allowed: false,
      pass_without_human_acceptance_allowed: false,
      model_generated_pass_authoritative: false,
      ui_manual_pass_authoritative: false,
      admin_override_pass_authoritative: false
    },
    runtime_claims: {
      eg_t02_runtime_artifact_created: true,
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
    maximum_supported_claim: "EG_T02_PROTECTED_PASS_REJECTED_UNVERIFIED_MISSING_REQUIRED_EVIDENCE",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT02ProtectedPassMissingRequiredEvidence(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT02ProtectedPassMissingRequiredEvidenceVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T02_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) {
    errors.push({ code: "EG_T02_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  }

  if (artifact.program_id !== PROGRAM_ID) {
    errors.push({ code: "EG_T02_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  }

  if (artifact.test_id !== TEST_ID) {
    errors.push({ code: "EG_T02_TEST_ID_MISMATCH", observed: artifact.test_id });
  }

  if (artifact.decision_result !== "REJECT") {
    errors.push({ code: "EG_T02_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  }

  if (artifact.validation_result !== "UNVERIFIED") {
    errors.push({ code: "EG_T02_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  }

  if (artifact.reason_code !== "MISSING_REQUIRED_EVIDENCE") {
    errors.push({ code: "EG_T02_REASON_CODE_INVALID", observed: artifact.reason_code });
  }

  if (artifact.protected_pass_accepted !== false) {
    errors.push({ code: "EG_T02_PROTECTED_PASS_ACCEPTED_OVERCLAIM", observed: artifact.protected_pass_accepted });
  }

  if (artifact.pass_authoritative !== false) {
    errors.push({ code: "EG_T02_PASS_AUTHORITY_OVERCLAIM", observed: artifact.pass_authoritative });
  }

  if (artifact.rejected_validation_event_emitted !== true) {
    errors.push({ code: "EG_T02_REJECTED_VALIDATION_EVENT_NOT_EMITTED" });
  }

  if (artifact.previous_control_state_preserved !== true) {
    errors.push({ code: "EG_T02_PREVIOUS_CONTROL_STATE_NOT_PRESERVED" });
  }

  if (artifact.control_state_changed !== false) {
    errors.push({ code: "EG_T02_CONTROL_STATE_CHANGED", observed: artifact.control_state_changed });
  }

  if (artifact.validation_state_changed !== false) {
    errors.push({ code: "EG_T02_VALIDATION_STATE_CHANGED", observed: artifact.validation_state_changed });
  }

  if (artifact.state_version_changed !== false) {
    errors.push({ code: "EG_T02_STATE_VERSION_CHANGED", observed: artifact.state_version_changed });
  }

  if (artifact.mandatory_evidence_required !== true) {
    errors.push({ code: "EG_T02_MANDATORY_EVIDENCE_NOT_REQUIRED" });
  }

  if (artifact.mandatory_evidence_complete !== false) {
    errors.push({ code: "EG_T02_MANDATORY_EVIDENCE_COMPLETENESS_OVERCLAIM", observed: artifact.mandatory_evidence_complete });
  }

  for (const evidenceType of REQUIRED_EVIDENCE_TYPES) {
    if (!Array.isArray(artifact.missing_required_evidence_types) || !artifact.missing_required_evidence_types.includes(evidenceType)) {
      errors.push({ code: "EG_T02_MISSING_REQUIRED_EVIDENCE_TYPE_NOT_RECORDED", evidence_type: evidenceType });
    }
  }

  if (!artifact.prior_control_projection || !artifact.resulting_control_projection) {
    errors.push({ code: "EG_T02_CONTROL_PROJECTION_PAIR_MISSING" });
  } else {
    if (artifact.prior_control_projection.projection_hash !== artifact.resulting_control_projection.projection_hash) {
      errors.push({
        code: "EG_T02_RESULTING_CONTROL_PROJECTION_HASH_CHANGED",
        prior: artifact.prior_control_projection.projection_hash,
        resulting: artifact.resulting_control_projection.projection_hash
      });
    }

    if (artifact.resulting_control_projection.control_state !== "PENDING") {
      errors.push({ code: "EG_T02_RESULTING_CONTROL_STATE_INVALID", observed: artifact.resulting_control_projection.control_state });
    }

    if (artifact.resulting_control_projection.validation_state !== "UNVERIFIED") {
      errors.push({ code: "EG_T02_RESULTING_VALIDATION_STATE_INVALID", observed: artifact.resulting_control_projection.validation_state });
    }
  }

  if (!artifact.rejected_validation_event || artifact.rejected_validation_event.reason_code !== "MISSING_REQUIRED_EVIDENCE") {
    errors.push({ code: "EG_T02_REJECTED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "pass_without_control_spec_allowed",
    "pass_without_execution_trace_allowed",
    "pass_without_verifier_record_allowed",
    "pass_without_evidence_hash_allowed",
    "pass_without_human_acceptance_allowed",
    "model_generated_pass_authoritative",
    "ui_manual_pass_authoritative",
    "admin_override_pass_authoritative"
  ]) {
    if (!artifact.evidence_gate || artifact.evidence_gate[key] !== false) {
      errors.push({ code: "EG_T02_EVIDENCE_GATE_OVERCLAIM", key, observed: artifact.evidence_gate ? artifact.evidence_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t02_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T02_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
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
      errors.push({ code: "EG_T02_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T02_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({
      code: "EG_T02_CONTENT_HASH_MISMATCH",
      expected: expectedHash,
      observed: artifact.content_sha256
    });
  }

  const verification = {
    record_type: "MatrixEGT02ProtectedPassMissingRequiredEvidenceVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T02-PROTECTED-PASS-MISSING-REQUIRED-EVIDENCE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    protected_pass_accepted: artifact.protected_pass_accepted,
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
  REQUIRED_EVIDENCE_TYPES,
  sha256Record,
  readJson,
  fileExists,
  createControlStateProjection,
  createProtectedPassAttempt,
  evaluateProtectedPassMissingRequiredEvidence,
  verifyEGT02ProtectedPassMissingRequiredEvidence
};
