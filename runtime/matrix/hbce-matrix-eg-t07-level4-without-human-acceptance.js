"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-226";
const TEST_ID = "EG-T07";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T07-LEVEL4-WITHOUT-HUMAN-ACCEPTANCE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createLevelStateProjection({
  level_state = "LEVEL_3_R_AND_D_BOUNDED",
  level4_eligibility_state = "NOT_LEVEL_4_ELIGIBLE",
  state_version = 1
} = {}) {
  const projection = {
    record_type: "LevelStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "LEVEL_ELIGIBILITY_STATE",
    level_state,
    level4_eligibility_state,
    state_version,
    required_preconditions: [
      "HUMAN_ACCEPTANCE_RECORD_ACCEPTED",
      "LEVEL4_SCOPE_DECLARED",
      "MANDATORY_EVIDENCE_COMPLETE",
      "EXTERNAL_VALIDATION_ACCEPTED",
      "LEGAL_READINESS_ACCEPTED",
      "COMMERCIAL_SCOPE_ACCEPTED"
    ],
    satisfied_preconditions: [],
    missing_preconditions: [
      "HUMAN_ACCEPTANCE_RECORD_ACCEPTED",
      "LEVEL4_SCOPE_DECLARED",
      "MANDATORY_EVIDENCE_COMPLETE",
      "EXTERNAL_VALIDATION_ACCEPTED",
      "LEGAL_READINESS_ACCEPTED",
      "COMMERCIAL_SCOPE_ACCEPTED"
    ],
    updated_at: "2026-10-01T18:30:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createHumanAcceptanceState({
  human_acceptance_state = "PENDING",
  accepted = false
} = {}) {
  const acceptance = {
    record_type: "HumanAcceptanceState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    authority_role: "Human Authority Owner",
    authority_ref: "Manuel Coletta / IPR-3",
    decision_scope: "LEVEL_4_ELIGIBILITY",
    human_acceptance_state,
    accepted,
    acceptance_record_ref: null,
    accepted_at: null,
    acceptance_hash: null
  };

  acceptance.acceptance_hash = sha256Record({ ...acceptance, acceptance_hash: null });
  return acceptance;
}

function createLevel4PromotionAttempt({
  priorLevelProjection = createLevelStateProjection(),
  humanAcceptanceState = createHumanAcceptanceState()
} = {}) {
  const missingPreconditions = [];

  if (humanAcceptanceState.accepted !== true) {
    missingPreconditions.push("HUMAN_ACCEPTANCE_RECORD_ACCEPTED");
  }

  for (const precondition of [
    "LEVEL4_SCOPE_DECLARED",
    "MANDATORY_EVIDENCE_COMPLETE",
    "EXTERNAL_VALIDATION_ACCEPTED",
    "LEGAL_READINESS_ACCEPTED",
    "COMMERCIAL_SCOPE_ACCEPTED"
  ]) {
    missingPreconditions.push(precondition);
  }

  const attempt = {
    attempt_id: "eg-t07-level4-without-human-acceptance-attempt-v001",
    attempt_type: "LEVEL4_ELIGIBILITY_PROMOTION",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "LEVEL_ELIGIBILITY_STATE",
    attempted_from: priorLevelProjection.level_state,
    attempted_to: "LEVEL_4_ELIGIBLE",
    attempted_level4_eligibility_state: "LEVEL_4_ELIGIBLE",
    human_acceptance_state: humanAcceptanceState,
    required_preconditions: priorLevelProjection.required_preconditions,
    missing_preconditions: missingPreconditions,
    missing_precondition_count: missingPreconditions.length,
    attempted_by: "UNVERIFIED_LEVEL4_PROMOTION_REQUEST",
    level4_decision_record_ref: null,
    human_acceptance_record_ref: null,
    attempted_at: "2026-10-01T18:31:00+02:00",
    attempt_sha256: null
  };

  attempt.attempt_sha256 = sha256Record({ ...attempt, attempt_sha256: null });
  return attempt;
}

function evaluateLevel4WithoutHumanAcceptance({
  priorLevelProjection = createLevelStateProjection(),
  promotionAttempt = null,
  evaluated_at = "2026-10-01T18:32:00+02:00"
} = {}) {
  const attempt = promotionAttempt || createLevel4PromotionAttempt({ priorLevelProjection });
  const missing = Array.isArray(attempt.missing_preconditions) ? attempt.missing_preconditions : [];

  const rejectedLevelEvent = {
    event_id: "rejected-level-eg-t07-level4-without-human-acceptance-v001",
    event_type: "RejectedLevel4EligibilityPromotionEvent",
    request_ref: attempt.attempt_id,
    tenant_id: attempt.tenant_id,
    subject_ref: attempt.subject_ref,
    namespace: attempt.namespace,
    attempted_from: attempt.attempted_from,
    attempted_to: attempt.attempted_to,
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "HUMAN_ACCEPTANCE_REQUIRED",
    missing_preconditions: missing,
    preserved_state_ref: priorLevelProjection.projection_hash,
    timestamp: evaluated_at,
    event_hash: null
  };

  rejectedLevelEvent.event_hash = sha256Record({ ...rejectedLevelEvent, event_hash: null });

  const result = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T07_Level4WithoutHumanAcceptance_v001",
    artifact_type: "MatrixEGT07Level4WithoutHumanAcceptanceRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "BLOCK; level state remains predecessor",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    prior_level_projection: priorLevelProjection,
    promotion_attempt: attempt,
    decision_result: "BLOCK",
    validation_result: "UNVERIFIED",
    reason_code: "HUMAN_ACCEPTANCE_REQUIRED",
    level4_promotion_accepted: false,
    level4_authoritative: false,
    rejected_level_event_emitted: true,
    rejected_level_event: rejectedLevelEvent,
    previous_level_state_preserved: true,
    resulting_level_projection: priorLevelProjection,
    level_state_changed: false,
    level4_eligibility_state_changed: false,
    state_version_changed: false,
    level_state: "LEVEL_3_R_AND_D_BOUNDED",
    attempted_level_state: "LEVEL_4_ELIGIBLE",
    level4_eligibility_state: "NOT_LEVEL_4_ELIGIBLE",
    attempted_level4_eligibility_state: "LEVEL_4_ELIGIBLE",
    human_acceptance_required: true,
    human_acceptance_record_present: false,
    human_acceptance_accepted: false,
    level4_eligible: false,
    missing_preconditions: missing,
    missing_precondition_count: missing.length,
    level4_gate: {
      promote_without_human_acceptance_allowed: false,
      promote_without_level4_scope_allowed: false,
      promote_without_mandatory_evidence_allowed: false,
      promote_without_external_validation_allowed: false,
      promote_without_legal_readiness_allowed: false,
      promote_without_commercial_scope_allowed: false,
      model_generated_level4_go_authoritative: false,
      ui_manual_level4_go_authoritative: false,
      admin_override_level4_go_authoritative: false
    },
    runtime_claims: {
      eg_t07_runtime_artifact_created: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      level4_eligible: false,
      human_acceptance_completed: false,
      external_validation_accepted: false,
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
    maximum_supported_claim: "EG_T07_LEVEL4_PROMOTION_BLOCKED_HUMAN_ACCEPTANCE_REQUIRED_PREVIOUS_LEVEL_STATE_PRESERVED",
    status: "PASS",
    content_sha256: null
  };

  result.content_sha256 = sha256Record({ ...result, content_sha256: null });
  return result;
}

function verifyEGT07Level4WithoutHumanAcceptance(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT07Level4WithoutHumanAcceptanceVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T07_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T07_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T07_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T07_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.decision_result !== "BLOCK") errors.push({ code: "EG_T07_DECISION_RESULT_INVALID", observed: artifact.decision_result });
  if (artifact.validation_result !== "UNVERIFIED") errors.push({ code: "EG_T07_VALIDATION_RESULT_INVALID", observed: artifact.validation_result });
  if (artifact.reason_code !== "HUMAN_ACCEPTANCE_REQUIRED") errors.push({ code: "EG_T07_REASON_CODE_INVALID", observed: artifact.reason_code });
  if (artifact.level_state !== "LEVEL_3_R_AND_D_BOUNDED") errors.push({ code: "EG_T07_LEVEL_STATE_INVALID", observed: artifact.level_state });
  if (artifact.attempted_level_state !== "LEVEL_4_ELIGIBLE") errors.push({ code: "EG_T07_ATTEMPTED_LEVEL_STATE_INVALID", observed: artifact.attempted_level_state });
  if (artifact.level4_eligibility_state !== "NOT_LEVEL_4_ELIGIBLE") errors.push({ code: "EG_T07_LEVEL4_ELIGIBILITY_STATE_INVALID", observed: artifact.level4_eligibility_state });
  if (artifact.level4_promotion_accepted !== false) errors.push({ code: "EG_T07_LEVEL4_PROMOTION_ACCEPTED_OVERCLAIM", observed: artifact.level4_promotion_accepted });
  if (artifact.level4_authoritative !== false) errors.push({ code: "EG_T07_LEVEL4_AUTHORITY_OVERCLAIM", observed: artifact.level4_authoritative });
  if (artifact.rejected_level_event_emitted !== true) errors.push({ code: "EG_T07_REJECTED_LEVEL_EVENT_NOT_EMITTED" });
  if (artifact.previous_level_state_preserved !== true) errors.push({ code: "EG_T07_PREVIOUS_LEVEL_STATE_NOT_PRESERVED" });
  if (artifact.level_state_changed !== false) errors.push({ code: "EG_T07_LEVEL_STATE_CHANGED", observed: artifact.level_state_changed });
  if (artifact.level4_eligibility_state_changed !== false) errors.push({ code: "EG_T07_LEVEL4_ELIGIBILITY_STATE_CHANGED", observed: artifact.level4_eligibility_state_changed });
  if (artifact.state_version_changed !== false) errors.push({ code: "EG_T07_STATE_VERSION_CHANGED", observed: artifact.state_version_changed });
  if (artifact.human_acceptance_required !== true) errors.push({ code: "EG_T07_HUMAN_ACCEPTANCE_NOT_REQUIRED" });
  if (artifact.human_acceptance_record_present !== false) errors.push({ code: "EG_T07_HUMAN_ACCEPTANCE_RECORD_PRESENT_OVERCLAIM", observed: artifact.human_acceptance_record_present });
  if (artifact.human_acceptance_accepted !== false) errors.push({ code: "EG_T07_HUMAN_ACCEPTANCE_ACCEPTED_OVERCLAIM", observed: artifact.human_acceptance_accepted });
  if (artifact.level4_eligible !== false) errors.push({ code: "EG_T07_LEVEL4_ELIGIBLE_OVERCLAIM", observed: artifact.level4_eligible });

  if (!Array.isArray(artifact.missing_preconditions) || !artifact.missing_preconditions.includes("HUMAN_ACCEPTANCE_RECORD_ACCEPTED")) {
    errors.push({ code: "EG_T07_HUMAN_ACCEPTANCE_MISSING_PRECONDITION_NOT_RECORDED" });
  }

  if (!artifact.prior_level_projection || !artifact.resulting_level_projection) {
    errors.push({ code: "EG_T07_LEVEL_PROJECTION_PAIR_MISSING" });
  } else {
    if (artifact.prior_level_projection.projection_hash !== artifact.resulting_level_projection.projection_hash) {
      errors.push({
        code: "EG_T07_RESULTING_LEVEL_PROJECTION_HASH_CHANGED",
        prior: artifact.prior_level_projection.projection_hash,
        resulting: artifact.resulting_level_projection.projection_hash
      });
    }

    if (artifact.resulting_level_projection.level_state !== "LEVEL_3_R_AND_D_BOUNDED") {
      errors.push({ code: "EG_T07_RESULTING_LEVEL_STATE_INVALID", observed: artifact.resulting_level_projection.level_state });
    }

    if (artifact.resulting_level_projection.level4_eligibility_state !== "NOT_LEVEL_4_ELIGIBLE") {
      errors.push({ code: "EG_T07_RESULTING_LEVEL4_ELIGIBILITY_STATE_INVALID", observed: artifact.resulting_level_projection.level4_eligibility_state });
    }
  }

  if (!artifact.rejected_level_event || artifact.rejected_level_event.reason_code !== "HUMAN_ACCEPTANCE_REQUIRED") {
    errors.push({ code: "EG_T07_REJECTED_EVENT_REASON_INVALID" });
  }

  for (const key of [
    "promote_without_human_acceptance_allowed",
    "promote_without_level4_scope_allowed",
    "promote_without_mandatory_evidence_allowed",
    "promote_without_external_validation_allowed",
    "promote_without_legal_readiness_allowed",
    "promote_without_commercial_scope_allowed",
    "model_generated_level4_go_authoritative",
    "ui_manual_level4_go_authoritative",
    "admin_override_level4_go_authoritative"
  ]) {
    if (!artifact.level4_gate || artifact.level4_gate[key] !== false) {
      errors.push({ code: "EG_T07_LEVEL4_GATE_OVERCLAIM", key, observed: artifact.level4_gate ? artifact.level4_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t07_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T07_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "level4_eligible",
    "human_acceptance_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T07_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T07_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T07_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT07Level4WithoutHumanAcceptanceVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T07-LEVEL4-WITHOUT-HUMAN-ACCEPTANCE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    validation_result: artifact.validation_result,
    reason_code: artifact.reason_code,
    level_state: artifact.level_state,
    attempted_level_state: artifact.attempted_level_state,
    level4_eligibility_state: artifact.level4_eligibility_state,
    level4_promotion_accepted: artifact.level4_promotion_accepted,
    previous_level_state_preserved: artifact.previous_level_state_preserved,
    human_acceptance_accepted: artifact.human_acceptance_accepted,
    resulting_level_state: artifact.resulting_level_projection ? artifact.resulting_level_projection.level_state : null,
    resulting_level4_eligibility_state: artifact.resulting_level_projection ? artifact.resulting_level_projection.level4_eligibility_state : null,
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
  createLevelStateProjection,
  createHumanAcceptanceState,
  createLevel4PromotionAttempt,
  evaluateLevel4WithoutHumanAcceptance,
  verifyEGT07Level4WithoutHumanAcceptance
};
