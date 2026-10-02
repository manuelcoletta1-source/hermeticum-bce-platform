"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-251";
const TEST_ID = "EG-T32";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T32-DEMOTION-TRIGGER-MISSING-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createCurrentState() {
  const state = {
    record_type: "MatrixSubjectEffectiveState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    effective_state_id: "eg-t32-effective-state-before-v001",
    level_state: "LEVEL_4_ACCEPTED",
    commercial_class: "LC_B",
    release_state: "RELEASE_CLEAN_ELIGIBLE",
    validation_state: "INTERNAL_VALIDATED",
    evidence_closure_state: "CLOSED",
    projection_version: 32,
    authoritative_event_head_hash: "eg-t32-authoritative-head-before",
    state_hash: null
  };

  state.state_hash = sha256Record({ ...state, state_hash: null });
  return state;
}

function createDemotionRequest({ currentState = createCurrentState() } = {}) {
  const request = {
    record_type: "MatrixDemotionRequest",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_id: "eg-t32-demotion-request-v001",
    decision_scope: "LEVEL_DEMOTION",
    requested_transition: {
      from_level_state: currentState.level_state,
      to_level_state: "LEVEL_4_SUSPENDED",
      from_commercial_class: currentState.commercial_class,
      to_commercial_class: "LC_C"
    },
    demotion_requested: true,
    demotion_trigger_present: false,
    demotion_trigger_ref: null,
    demotion_trigger_evidence_present: false,
    demotion_trigger_evidence_hash: null,
    requester_actor_class: "GOVERNANCE_ENGINE",
    request_payload_digest: "eg-t32-demotion-request-payload-v001",
    request_hash: null
  };

  request.request_hash = sha256Record({ ...request, request_hash: null });
  return request;
}

function evaluateDemotionTriggerMissing({
  currentState = createCurrentState(),
  request = null,
  generated_at = "2026-10-02T00:25:00+02:00"
} = {}) {
  const effectiveRequest = request || createDemotionRequest({ currentState });

  const rejectionEvent = {
    record_type: "RejectedDemotionTransitionEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t32-demotion-trigger-missing-rejection-event-v001",
    event_class: "GOVERNANCE_EVIDENCE_EVENT",
    request_id: effectiveRequest.request_id,
    decision_scope: effectiveRequest.decision_scope,
    rejection_code: "DEMOTION_TRIGGER_MISSING",
    demotion_trigger_present: effectiveRequest.demotion_trigger_present,
    demotion_trigger_evidence_present: effectiveRequest.demotion_trigger_evidence_present,
    previous_state_hash: currentState.state_hash,
    resulting_state_hash: currentState.state_hash,
    state_preserved: true,
    demotion_applied: false,
    authoritative_transition_emitted: false,
    projection_changed: false,
    emitted_at: generated_at,
    event_hash: null
  };

  rejectionEvent.event_hash = sha256Record({ ...rejectionEvent, event_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T32_DemotionTriggerMissing_v001",
    artifact_type: "MatrixEGT32DemotionTriggerMissingRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "REJECT + DEMOTION_TRIGGER_MISSING; state preserved",
    selected_profile: "A2_EFFECT_RELEVANT_CHECKPOINT",
    current_state_before_request: currentState,
    demotion_request: effectiveRequest,
    rejection_event: rejectionEvent,
    demotion_requested: true,
    demotion_trigger_present: false,
    demotion_trigger_evidence_present: false,
    decision_result: "REJECT",
    rejection_code: "DEMOTION_TRIGGER_MISSING",
    state_preserved: true,
    previous_state_hash: currentState.state_hash,
    resulting_state_hash: currentState.state_hash,
    demotion_applied: false,
    authoritative_transition_emitted: false,
    projection_changed: false,
    release_state_before: currentState.release_state,
    release_state_after: currentState.release_state,
    level_state_before: currentState.level_state,
    level_state_after: currentState.level_state,
    commercial_class_before: currentState.commercial_class,
    commercial_class_after: currentState.commercial_class,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    demotion_trigger_gate: {
      require_demotion_trigger_for_regression: true,
      require_trigger_evidence_for_demotion: true,
      require_reject_without_demotion_trigger: true,
      require_state_preserved_on_reject: true,
      require_no_authoritative_transition_on_reject: true,
      require_no_second_effect: true,
      allow_demotion_without_trigger: false,
      allow_demotion_without_trigger_evidence: false,
      allow_projection_change_on_reject: false,
      allow_authoritative_transition_on_reject: false,
      allow_external_connector_call: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t32_runtime_artifact_created: true,
      demotion_trigger_missing_detected: true,
      rejection_code_demotion_trigger_missing: true,
      state_preserved: true,
      demotion_applied: false,
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
    maximum_supported_claim: "EG_T32_REGRESSION_DEMOTION_REQUEST_WITHOUT_DEMOTION_TRIGGER_AND_TRIGGER_EVIDENCE_IS_REJECTED_WITH_DEMOTION_TRIGGER_MISSING_AND_STATE_PRESERVED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT32DemotionTriggerMissing(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT32DemotionTriggerMissingVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T32_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T32_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T32_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T32_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "REJECT + DEMOTION_TRIGGER_MISSING; state preserved") errors.push({ code: "EG_T32_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["demotion_requested", true],
    ["demotion_trigger_present", false],
    ["demotion_trigger_evidence_present", false],
    ["decision_result", "REJECT"],
    ["rejection_code", "DEMOTION_TRIGGER_MISSING"],
    ["state_preserved", true],
    ["demotion_applied", false],
    ["authoritative_transition_emitted", false],
    ["projection_changed", false],
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
      errors.push({ code: "EG_T32_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.current_state_before_request || !artifact.demotion_request || !artifact.rejection_event) {
    errors.push({ code: "EG_T32_CORE_RECORDS_MISSING" });
  } else {
    const expectedStateHash = sha256Record({ ...artifact.current_state_before_request, state_hash: null });

    if (artifact.current_state_before_request.state_hash !== expectedStateHash) {
      errors.push({ code: "EG_T32_STATE_HASH_MISMATCH", expected: expectedStateHash, observed: artifact.current_state_before_request.state_hash });
    }

    if (artifact.previous_state_hash !== artifact.resulting_state_hash) {
      errors.push({ code: "EG_T32_STATE_NOT_PRESERVED", previous: artifact.previous_state_hash, resulting: artifact.resulting_state_hash });
    }

    if (artifact.previous_state_hash !== artifact.current_state_before_request.state_hash) {
      errors.push({ code: "EG_T32_PREVIOUS_STATE_HASH_INVALID", expected: artifact.current_state_before_request.state_hash, observed: artifact.previous_state_hash });
    }

    for (const [beforeKey, afterKey] of [
      ["release_state_before", "release_state_after"],
      ["level_state_before", "level_state_after"],
      ["commercial_class_before", "commercial_class_after"]
    ]) {
      if (artifact[beforeKey] !== artifact[afterKey]) {
        errors.push({ code: "EG_T32_STATE_FIELD_CHANGED_ON_REJECT", beforeKey, afterKey, before: artifact[beforeKey], after: artifact[afterKey] });
      }
    }

    if (artifact.demotion_request.demotion_trigger_present !== false || artifact.demotion_request.demotion_trigger_evidence_present !== false) {
      errors.push({ code: "EG_T32_REQUEST_TRIGGER_OVERCLAIM", request: artifact.demotion_request });
    }

    if (artifact.rejection_event.rejection_code !== "DEMOTION_TRIGGER_MISSING") {
      errors.push({ code: "EG_T32_REJECTION_EVENT_CODE_INVALID", observed: artifact.rejection_event.rejection_code });
    }

    if (artifact.rejection_event.state_preserved !== true) {
      errors.push({ code: "EG_T32_REJECTION_EVENT_STATE_NOT_PRESERVED", observed: artifact.rejection_event.state_preserved });
    }

    for (const key of [
      "demotion_applied",
      "authoritative_transition_emitted",
      "projection_changed"
    ]) {
      if (artifact.rejection_event[key] !== false) {
        errors.push({ code: "EG_T32_REJECTION_EVENT_OVERCLAIM", key, observed: artifact.rejection_event[key] });
      }
    }
  }

  for (const key of [
    "require_demotion_trigger_for_regression",
    "require_trigger_evidence_for_demotion",
    "require_reject_without_demotion_trigger",
    "require_state_preserved_on_reject",
    "require_no_authoritative_transition_on_reject",
    "require_no_second_effect"
  ]) {
    if (!artifact.demotion_trigger_gate || artifact.demotion_trigger_gate[key] !== true) {
      errors.push({ code: "EG_T32_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.demotion_trigger_gate ? artifact.demotion_trigger_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_demotion_without_trigger",
    "allow_demotion_without_trigger_evidence",
    "allow_projection_change_on_reject",
    "allow_authoritative_transition_on_reject",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.demotion_trigger_gate || artifact.demotion_trigger_gate[key] !== false) {
      errors.push({ code: "EG_T32_GATE_OVERCLAIM", key, observed: artifact.demotion_trigger_gate ? artifact.demotion_trigger_gate[key] : undefined });
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
      errors.push({ code: "EG_T32_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T32_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T32_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT32DemotionTriggerMissingVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T32-DEMOTION-TRIGGER-MISSING-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    rejection_code: artifact.rejection_code,
    state_preserved: artifact.state_preserved,
    demotion_applied: artifact.demotion_applied,
    authoritative_transition_emitted: artifact.authoritative_transition_emitted,
    projection_changed: artifact.projection_changed,
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
  createCurrentState,
  createDemotionRequest,
  evaluateDemotionTriggerMissing,
  verifyEGT32DemotionTriggerMissing
};
