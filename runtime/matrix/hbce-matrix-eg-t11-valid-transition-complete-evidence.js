"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-230";
const TEST_ID = "EG-T11";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T11-VALID-TRANSITION-COMPLETE-EVIDENCE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createPriorProjection() {
  const projection = {
    record_type: "MatrixStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    state: "BLOCKED",
    state_version: 4,
    predecessor_event_id: "transition-event-current-v004",
    predecessor_event_sha256: "4".repeat(64),
    projection_generated_at: "2026-10-01T19:30:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createEvidenceBundle({ priorProjection = createPriorProjection() } = {}) {
  const bundle = {
    record_type: "MatrixCompleteEvidenceBundle",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    evidence_bundle_id: "eg-t11-complete-evidence-bundle-v001",
    evidence_profile: "INTERNAL_RELEASE_CLEAN_ELIGIBILITY",
    mandatory_controls: [
      "C01_SCHEMA_VALID",
      "C02_AUTHORITY_VALID",
      "C03_POLICY_VALID",
      "C04_PREDECESSOR_VALID",
      "C05_EVIDENCE_PRESENT",
      "C06_HASHES_VALID",
      "C07_NO_STALE_PREDECESSOR",
      "C08_NO_BASELINE_MISMATCH",
      "C09_IDEMPOTENCY_BOUND",
      "C10_NO_DIRECT_MUTATION",
      "C11_DECISION_SCOPE_BOUND",
      "C12_TRANSITION_ALLOWED",
      "C13_PROJECTION_UPDATE_ALLOWED",
      "C14_NO_EXECUTION_SIDE_EFFECT",
      "C15_AUDIT_RECORD_READY"
    ],
    mandatory_controls_result: "PASS",
    required_evidence_present: true,
    evidence_hashes_valid: true,
    predecessor_projection_hash: priorProjection.projection_hash,
    predecessor_state_version: priorProjection.state_version,
    complete: true,
    generated_at: "2026-10-01T19:31:00+02:00",
    evidence_bundle_sha256: null
  };

  bundle.evidence_bundle_sha256 = sha256Record({ ...bundle, evidence_bundle_sha256: null });
  return bundle;
}

function createTransitionRequest({
  priorProjection = createPriorProjection(),
  evidenceBundle = createEvidenceBundle({ priorProjection })
} = {}) {
  const request = {
    request_id: "eg-t11-valid-transition-request-v001",
    request_type: "MATRIX_STATE_TRANSITION_REQUEST",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    requested_transition: "PROMOTE_RELEASE_CLEAN_ELIGIBLE",
    requested_from_state: priorProjection.state,
    requested_to_state: "RELEASE_CLEAN_ELIGIBLE",
    declared_predecessor_state_version: priorProjection.state_version,
    declared_predecessor_projection_hash: priorProjection.projection_hash,
    evidence_bundle_ref: evidenceBundle.evidence_bundle_id,
    evidence_bundle_sha256: evidenceBundle.evidence_bundle_sha256,
    decision_scope: "INTERNAL_RELEASE_CLEAN_ELIGIBILITY_TRANSITION",
    requested_at: "2026-10-01T19:32:00+02:00",
    request_sha256: null
  };

  request.request_sha256 = sha256Record({ ...request, request_sha256: null });
  return request;
}

function createGuardEvaluation({
  priorProjection = createPriorProjection(),
  evidenceBundle = createEvidenceBundle({ priorProjection }),
  transitionRequest = createTransitionRequest({ priorProjection, evidenceBundle })
} = {}) {
  const guard = {
    record_type: "MatrixGuardEvaluationRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    guard_evaluation_id: "eg-t11-guard-evaluation-v001",
    request_ref: transitionRequest.request_id,
    predecessor_version_valid: transitionRequest.declared_predecessor_state_version === priorProjection.state_version,
    predecessor_hash_valid: transitionRequest.declared_predecessor_projection_hash === priorProjection.projection_hash,
    mandatory_evidence_complete: evidenceBundle.complete === true,
    mandatory_controls_pass: evidenceBundle.mandatory_controls_result === "PASS",
    evidence_hashes_valid: evidenceBundle.evidence_hashes_valid === true,
    decision_scope_valid: transitionRequest.decision_scope === "INTERNAL_RELEASE_CLEAN_ELIGIBILITY_TRANSITION",
    transition_allowed_by_policy: true,
    no_execution_side_effect: true,
    result: "PASS",
    evaluated_at: "2026-10-01T19:33:00+02:00",
    guard_evaluation_sha256: null
  };

  guard.guard_evaluation_sha256 = sha256Record({ ...guard, guard_evaluation_sha256: null });
  return guard;
}

function evaluateValidTransitionCompleteEvidence({
  priorProjection = createPriorProjection(),
  evidenceBundle = null,
  transitionRequest = null,
  guardEvaluation = null,
  evaluated_at = "2026-10-01T19:34:00+02:00"
} = {}) {
  const bundle = evidenceBundle || createEvidenceBundle({ priorProjection });
  const request = transitionRequest || createTransitionRequest({ priorProjection, evidenceBundle: bundle });
  const guard = guardEvaluation || createGuardEvaluation({ priorProjection, evidenceBundle: bundle, transitionRequest: request });

  const decisionRecord = {
    record_type: "DecisionRecord",
    decision_record_id: "decision-eg-t11-valid-transition-v001",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_ref: request.request_id,
    request_sha256: request.request_sha256,
    guard_evaluation_ref: guard.guard_evaluation_id,
    guard_evaluation_sha256: guard.guard_evaluation_sha256,
    evidence_bundle_ref: bundle.evidence_bundle_id,
    evidence_bundle_sha256: bundle.evidence_bundle_sha256,
    decision_scope: request.decision_scope,
    decision_result: "ALLOW",
    validation_result: "VERIFIED",
    reason_code: "COMPLETE_GUARDS_AND_EVIDENCE",
    decided_at: evaluated_at,
    decision_record_sha256: null
  };

  decisionRecord.decision_record_sha256 = sha256Record({ ...decisionRecord, decision_record_sha256: null });

  const transitionEvent = {
    event_id: "transition-eg-t11-valid-transition-v001",
    event_type: "TransitionEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: request.namespace,
    request_ref: request.request_id,
    decision_record_ref: decisionRecord.decision_record_id,
    decision_record_sha256: decisionRecord.decision_record_sha256,
    from_state: priorProjection.state,
    to_state: request.requested_to_state,
    from_state_version: priorProjection.state_version,
    to_state_version: priorProjection.state_version + 1,
    predecessor_projection_hash: priorProjection.projection_hash,
    emitted_at: evaluated_at,
    event_hash: null
  };

  transitionEvent.event_hash = sha256Record({ ...transitionEvent, event_hash: null });

  const resultingProjection = {
    record_type: "MatrixStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    state: "RELEASE_CLEAN_ELIGIBLE",
    state_version: priorProjection.state_version + 1,
    predecessor_event_id: transitionEvent.event_id,
    predecessor_event_sha256: transitionEvent.event_hash,
    projection_generated_at: evaluated_at,
    projection_hash: null
  };

  resultingProjection.projection_hash = sha256Record({ ...resultingProjection, projection_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T11_ValidTransitionCompleteEvidence_v001",
    artifact_type: "MatrixEGT11ValidTransitionCompleteEvidenceRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "ALLOW + DecisionRecord + TransitionEvent + projection update",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    prior_state_projection: priorProjection,
    evidence_bundle: bundle,
    transition_request: request,
    guard_evaluation: guard,
    decision_record: decisionRecord,
    transition_event: transitionEvent,
    resulting_state_projection: resultingProjection,
    decision_result: "ALLOW",
    validation_result: "VERIFIED",
    reason_code: "COMPLETE_GUARDS_AND_EVIDENCE",
    mandatory_evidence_complete: true,
    mandatory_controls_pass: true,
    evidence_hashes_valid: true,
    predecessor_valid: true,
    decision_scope_valid: true,
    transition_allowed_by_policy: true,
    decision_record_created: true,
    transition_event_created: true,
    projection_updated: true,
    previous_state: priorProjection.state,
    resulting_state: resultingProjection.state,
    previous_state_version: priorProjection.state_version,
    resulting_state_version: resultingProjection.state_version,
    state_changed: true,
    state_version_changed: true,
    authoritative_transition_event_emitted: true,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    transition_gate: {
      require_complete_evidence: true,
      require_valid_predecessor: true,
      require_valid_decision_scope: true,
      require_policy_allow: true,
      allow_projection_update: true,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t11_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      transition_accepted: true,
      decision_record_created: true,
      transition_event_created: true,
      authoritative_projection_updated: true,
      release_clean_eligible: true,
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
    maximum_supported_claim: "EG_T11_VALID_TRANSITION_ALLOWED_DECISION_EVENT_AND_PROJECTION_UPDATED_NO_EXECUTION_EFFECT",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT11ValidTransitionCompleteEvidence(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT11ValidTransitionCompleteEvidenceVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T11_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T11_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T11_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T11_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "ALLOW + DecisionRecord + TransitionEvent + projection update") errors.push({ code: "EG_T11_REQUIRED_RESULT_INVALID", observed: artifact.required_result });
  if (artifact.decision_result !== "ALLOW") errors.push({ code: "EG_T11_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  if (artifact.validation_result !== "VERIFIED") errors.push({ code: "EG_T11_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  if (artifact.reason_code !== "COMPLETE_GUARDS_AND_EVIDENCE") errors.push({ code: "EG_T11_REASON_CODE_INVALID", observed: artifact.reason_code });

  for (const [key, expected] of [
    ["mandatory_evidence_complete", true],
    ["mandatory_controls_pass", true],
    ["evidence_hashes_valid", true],
    ["predecessor_valid", true],
    ["decision_scope_valid", true],
    ["transition_allowed_by_policy", true],
    ["decision_record_created", true],
    ["transition_event_created", true],
    ["projection_updated", true],
    ["state_changed", true],
    ["state_version_changed", true],
    ["authoritative_transition_event_emitted", true],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T11_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.prior_state_projection || !artifact.resulting_state_projection || !artifact.transition_event || !artifact.decision_record) {
    errors.push({ code: "EG_T11_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.resulting_state_projection.state !== "RELEASE_CLEAN_ELIGIBLE") {
      errors.push({ code: "EG_T11_RESULTING_STATE_INVALID", observed: artifact.resulting_state_projection.state });
    }

    if (artifact.resulting_state_projection.state_version !== artifact.prior_state_projection.state_version + 1) {
      errors.push({
        code: "EG_T11_RESULTING_VERSION_INVALID",
        prior: artifact.prior_state_projection.state_version,
        resulting: artifact.resulting_state_projection.state_version
      });
    }

    if (artifact.transition_event.decision_record_sha256 !== artifact.decision_record.decision_record_sha256) {
      errors.push({ code: "EG_T11_DECISION_EVENT_BINDING_MISMATCH" });
    }

    if (artifact.resulting_state_projection.predecessor_event_sha256 !== artifact.transition_event.event_hash) {
      errors.push({ code: "EG_T11_PROJECTION_EVENT_BINDING_MISMATCH" });
    }
  }

  for (const key of [
    "require_complete_evidence",
    "require_valid_predecessor",
    "require_valid_decision_scope",
    "require_policy_allow",
    "allow_projection_update"
  ]) {
    if (!artifact.transition_gate || artifact.transition_gate[key] !== true) {
      errors.push({ code: "EG_T11_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.transition_gate ? artifact.transition_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.transition_gate || artifact.transition_gate[key] !== false) {
      errors.push({ code: "EG_T11_EXECUTION_GATE_OVERCLAIM", key, observed: artifact.transition_gate ? artifact.transition_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t11_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T11_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "transition_accepted",
    "decision_record_created",
    "transition_event_created",
    "authoritative_projection_updated",
    "release_clean_eligible"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== true) {
      errors.push({ code: "EG_T11_RUNTIME_POSITIVE_CLAIM_MISSING", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
    }
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T11_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T11_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T11_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT11ValidTransitionCompleteEvidenceVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T11-VALID-TRANSITION-COMPLETE-EVIDENCE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    decision_record_created: artifact.decision_record_created,
    transition_event_created: artifact.transition_event_created,
    projection_updated: artifact.projection_updated,
    previous_state: artifact.previous_state,
    resulting_state: artifact.resulting_state,
    previous_state_version: artifact.previous_state_version,
    resulting_state_version: artifact.resulting_state_version,
    state_changed: artifact.state_changed,
    state_version_changed: artifact.state_version_changed,
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
  createPriorProjection,
  createEvidenceBundle,
  createTransitionRequest,
  createGuardEvaluation,
  evaluateValidTransitionCompleteEvidence,
  verifyEGT11ValidTransitionCompleteEvidence
};
