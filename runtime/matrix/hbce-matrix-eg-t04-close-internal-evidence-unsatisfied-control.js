"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-221";
const TEST_ID = "EG-T04";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T04-CLOSE-INTERNAL-EVIDENCE-UNSATISFIED-CONTROL-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createInternalEvidenceClosureProjection({
  closure_state = "OPEN",
  validation_state = "UNVERIFIED",
  closure_version = 1
} = {}) {
  const projection = {
    record_type: "InternalEvidenceClosureProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "INTERNAL_EVIDENCE_CLOSURE_STATE",
    closure_state,
    validation_state,
    closure_version,
    required_c_controls: ["C01", "C02", "C03"],
    satisfied_c_controls: ["C01", "C02"],
    unsatisfied_c_controls: ["C03"],
    updated_at: "2026-10-01T17:30:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createMandatoryCControlSet() {
  const controls = [
    {
      control_id: "C01",
      mandatory: true,
      control_state: "PASS",
      validation_state: "VERIFIED",
      evidence_refs: ["eg-t04-c01-verifier-record-v001"],
      satisfied: true
    },
    {
      control_id: "C02",
      mandatory: true,
      control_state: "PASS",
      validation_state: "VERIFIED",
      evidence_refs: ["eg-t04-c02-verifier-record-v001"],
      satisfied: true
    },
    {
      control_id: "C03",
      mandatory: true,
      control_state: "PENDING",
      validation_state: "UNVERIFIED",
      evidence_refs: [],
      satisfied: false
    }
  ];

  return controls.map((control) => ({
    ...control,
    control_hash: sha256Record(control)
  }));
}

function createInternalEvidenceClosureAttempt({
  controls = createMandatoryCControlSet()
} = {}) {
  const unsatisfied = controls
    .filter((control) => control.mandatory === true && control.satisfied !== true)
    .map((control) => control.control_id);

  const attempt = {
    attempt_id: "eg-t04-close-internal-evidence-unsatisfied-control-attempt-v001",
    attempt_type: "INTERNAL_EVIDENCE_CLOSURE",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "INTERNAL_EVIDENCE_CLOSURE_STATE",
    attempted_from: "OPEN",
    attempted_to: "CLOSED",
    attempted_validation_state: "VERIFIED",
    required_c_controls: controls.map((control) => control.control_id),
    control_set: controls,
    unsatisfied_mandatory_c_controls: unsatisfied,
    unsatisfied_mandatory_c_control_count: unsatisfied.length,
    attempted_by: "UNVERIFIED_INTERNAL_CLOSURE_REQUEST",
    closure_decision_record_ref: null,
    verifier_record_ref: null,
    transition_event_ref: null,
    attempted_at: "2026-10-01T17:31:00+02:00",
    attempt_sha256: null
  };

  attempt.attempt_sha256 = sha256Record({ ...attempt, attempt_sha256: null });
  return attempt;
}

function evaluateCloseInternalEvidenceUnsatisfiedControl({
  priorClosureProjection = createInternalEvidenceClosureProjection(),
  closureAttempt = createInternalEvidenceClosureAttempt(),
  evaluated_at = "2026-10-01T17:32:00+02:00"
} = {}) {
  const unsatisfied = Array.isArray(closureAttempt.unsatisfied_mandatory_c_controls)
    ? closureAttempt.unsatisfied_mandatory_c_controls
    : [];

  const rejectedClosureEvent = {
    event_id: "rejected-closure-eg-t04-unsatisfied-c-control-v001",
    event_type: "RejectedClosureEvent",
    request_ref: closureAttempt.attempt_id,
    tenant_id: closureAttempt.tenant_id,
    subject_ref: closureAttempt.subject_ref,
    namespace: closureAttempt.namespace,
    attempted_from: closureAttempt.attempted_from,
    attempted_to: closureAttempt.attempted_to,
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "MANDATORY_C_CONTROL_UNSATISFIED",
    unsatisfied_mandatory_c_controls: unsatisfied,
    preserved_state_ref: priorClosureProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedClosureEvent.event_hash = sha256Record({ ...rejectedClosureEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T04_CloseInternalEvidenceUnsatisfiedControl_v001",
    artifact_type: "MatrixEGT04CloseInternalEvidenceUnsatisfiedControlRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "BLOCK/UNVERIFIED; closure remains OPEN",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    prior_closure_projection: priorClosureProjection,
    closure_attempt: closureAttempt,
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "MANDATORY_C_CONTROL_UNSATISFIED",
    closure_attempt_accepted: false,
    closure_authoritative: false,
    rejected_closure_event_emitted: true,
    rejected_closure_event: rejectedClosureEvent,
    previous_closure_state_preserved: true,
    resulting_closure_projection: priorClosureProjection,
    closure_state_changed: false,
    validation_state_changed: false,
    closure_version_changed: false,
    internal_closure_state: "OPEN",
    mandatory_c_control_unsatisfied: true,
    unsatisfied_mandatory_c_controls: unsatisfied,
    unsatisfied_mandatory_c_control_count: unsatisfied.length,
    closure_gate: {
      close_with_unsatisfied_mandatory_c_control_allowed: false,
      close_with_unverified_control_allowed: false,
      close_without_verifier_record_allowed: false,
      close_without_decision_record_allowed: false,
      model_generated_closure_authoritative: false,
      ui_manual_closure_authoritative: false,
      admin_override_closure_authoritative: false
    },
    runtime_claims: {
      eg_t04_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      internal_evidence_closed: false,
      all_c_controls_satisfied: false,
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
    maximum_supported_claim: "EG_T04_INTERNAL_EVIDENCE_CLOSURE_BLOCKED_UNVERIFIED_OPEN_UNSATISFIED_C_CONTROL",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT04CloseInternalEvidenceUnsatisfiedControl(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT04CloseInternalEvidenceUnsatisfiedControlVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T04_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) {
    errors.push({ code: "EG_T04_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  }

  if (artifact.program_id !== PROGRAM_ID) {
    errors.push({ code: "EG_T04_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  }

  if (artifact.test_id !== TEST_ID) {
    errors.push({ code: "EG_T04_TEST_ID_MISMATCH", observed: artifact.test_id });
  }

  if (artifact.decision_result !== "BLOCK") {
    errors.push({ code: "EG_T04_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  }

  if (artifact.validation_result !== "UNVERIFIED") {
    errors.push({ code: "EG_T04_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  }

  if (artifact.reason_code !== "MANDATORY_C_CONTROL_UNSATISFIED") {
    errors.push({ code: "EG_T04_REASON_CODE_INVALID", observed: artifact.reason_code });
  }

  if (artifact.internal_closure_state !== "OPEN") {
    errors.push({ code: "EG_T04_INTERNAL_CLOSURE_STATE_INVALID", observed: artifact.internal_closure_state });
  }

  if (artifact.closure_attempt_accepted !== false) {
    errors.push({ code: "EG_T04_CLOSURE_ACCEPTED_OVERCLAIM", observed: artifact.closure_attempt_accepted });
  }

  if (artifact.closure_authoritative !== false) {
    errors.push({ code: "EG_T04_CLOSURE_AUTHORITY_OVERCLAIM", observed: artifact.closure_authoritative });
  }

  if (artifact.rejected_closure_event_emitted !== true) {
    errors.push({ code: "EG_T04_REJECTED_CLOSURE_EVENT_NOT_EMITTED" });
  }

  if (artifact.previous_closure_state_preserved !== true) {
    errors.push({ code: "EG_T04_PREVIOUS_CLOSURE_STATE_NOT_PRESERVED" });
  }

  if (artifact.closure_state_changed !== false) {
    errors.push({ code: "EG_T04_CLOSURE_STATE_CHANGED", observed: artifact.closure_state_changed });
  }

  if (artifact.validation_state_changed !== false) {
    errors.push({ code: "EG_T04_VALIDATION_STATE_CHANGED", observed: artifact.validation_state_changed });
  }

  if (artifact.closure_version_changed !== false) {
    errors.push({ code: "EG_T04_CLOSURE_VERSION_CHANGED", observed: artifact.closure_version_changed });
  }

  if (artifact.mandatory_c_control_unsatisfied !== true) {
    errors.push({ code: "EG_T04_UNSATISFIED_C_CONTROL_NOT_DETECTED" });
  }

  if (!Array.isArray(artifact.unsatisfied_mandatory_c_controls) || !artifact.unsatisfied_mandatory_c_controls.includes("C03")) {
    errors.push({ code: "EG_T04_UNSATISFIED_C_CONTROL_ID_MISSING" });
  }

  if (artifact.unsatisfied_mandatory_c_control_count !== 1) {
    errors.push({ code: "EG_T04_UNSATISFIED_C_CONTROL_COUNT_INVALID", observed: artifact.unsatisfied_mandatory_c_control_count });
  }

  if (!artifact.prior_closure_projection || !artifact.resulting_closure_projection) {
    errors.push({ code: "EG_T04_CLOSURE_PROJECTION_PAIR_MISSING" });
  } else {
    if (artifact.prior_closure_projection.projection_hash !== artifact.resulting_closure_projection.projection_hash) {
      errors.push({
        code: "EG_T04_RESULTING_CLOSURE_PROJECTION_HASH_CHANGED",
        prior: artifact.prior_closure_projection.projection_hash,
        resulting: artifact.resulting_closure_projection.projection_hash
      });
    }

    if (artifact.resulting_closure_projection.closure_state !== "OPEN") {
      errors.push({ code: "EG_T04_RESULTING_CLOSURE_STATE_INVALID", observed: artifact.resulting_closure_projection.closure_state });
    }

    if (artifact.resulting_closure_projection.validation_state !== "UNVERIFIED") {
      errors.push({ code: "EG_T04_RESULTING_VALIDATION_STATE_INVALID", observed: artifact.resulting_closure_projection.validation_state });
    }
  }

  if (!artifact.rejected_closure_event || artifact.rejected_closure_event.reason_code !== "MANDATORY_C_CONTROL_UNSATISFIED") {
    errors.push({ code: "EG_T04_REJECTED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "close_with_unsatisfied_mandatory_c_control_allowed",
    "close_with_unverified_control_allowed",
    "close_without_verifier_record_allowed",
    "close_without_decision_record_allowed",
    "model_generated_closure_authoritative",
    "ui_manual_closure_authoritative",
    "admin_override_closure_authoritative"
  ]) {
    if (!artifact.closure_gate || artifact.closure_gate[key] !== false) {
      errors.push({ code: "EG_T04_CLOSURE_GATE_OVERCLAIM", key, observed: artifact.closure_gate ? artifact.closure_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t04_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T04_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "internal_evidence_closed",
    "all_c_controls_satisfied",
    "evidence_closure_closed",
    "validation_state_externally_validated",
    "level4_eligible",
    "legal_review_claimed",
    "commercial_release_authorized",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T04_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T04_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({
      code: "EG_T04_CONTENT_HASH_MISMATCH",
      expected: expectedHash,
      observed: artifact.content_sha256
    });
  }

  const verification = {
    record_type: "MatrixEGT04CloseInternalEvidenceUnsatisfiedControlVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T04-CLOSE-INTERNAL-EVIDENCE-UNSATISFIED-CONTROL-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    internal_closure_state: artifact.internal_closure_state,
    closure_attempt_accepted: artifact.closure_attempt_accepted,
    previous_closure_state_preserved: artifact.previous_closure_state_preserved,
    unsatisfied_mandatory_c_controls: artifact.unsatisfied_mandatory_c_controls,
    resulting_closure_state: artifact.resulting_closure_projection ? artifact.resulting_closure_projection.closure_state : null,
    resulting_validation_state: artifact.resulting_closure_projection ? artifact.resulting_closure_projection.validation_state : null,
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
  createInternalEvidenceClosureProjection,
  createMandatoryCControlSet,
  createInternalEvidenceClosureAttempt,
  evaluateCloseInternalEvidenceUnsatisfiedControl,
  verifyEGT04CloseInternalEvidenceUnsatisfiedControl
};
