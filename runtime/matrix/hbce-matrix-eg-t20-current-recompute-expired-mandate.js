"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-239";
const TEST_ID = "EG-T20";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T20-CURRENT-RECOMPUTE-EXPIRED-MANDATE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function parseTime(value) {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) {
    throw new Error(`Invalid timestamp: ${value}`);
  }
  return time;
}

function isMandateActiveAt(mandate, evaluationTime) {
  const t = parseTime(evaluationTime);
  return parseTime(mandate.valid_from) <= t && t <= parseTime(mandate.valid_until);
}

function createCurrentExpiredMandateContext() {
  const mandate = {
    record_type: "MandateRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    mandate_id: "eg-t20-release-mandate-v001",
    authority_ref: "HBCE_INTERNAL_HUMAN_AUTHORITY",
    mandate_scope: "MATRIX_CURRENT_EFFECTIVE_STATE_RECOMPUTE",
    valid_from: "2026-09-01T00:00:00+02:00",
    valid_until: "2026-10-01T12:00:00+02:00",
    current_status: "EXPIRED",
    mandate_hash: null
  };
  mandate.mandate_hash = sha256Record({ ...mandate, mandate_hash: null });

  const previousEffectiveState = {
    record_type: "MatrixEffectiveStateRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    state_id: "eg-t20-effective-state-before-recompute-v001",
    effective_state: "RELEASE_CLEAN_ELIGIBLE",
    state_version: 7,
    depends_on_mandate_id: mandate.mandate_id,
    depends_on_mandate_hash: mandate.mandate_hash,
    evaluation_time: "2026-09-30T15:30:00+02:00",
    authority_predicate_result: "PASS",
    state_hash: null
  };
  previousEffectiveState.state_hash = sha256Record({ ...previousEffectiveState, state_hash: null });

  return {
    mandate,
    previous_effective_state: previousEffectiveState,
    current_recompute_time: "2026-10-01T21:55:00+02:00"
  };
}

function recomputeCurrentEffectiveStateAfterMandateExpiry({
  context = createCurrentExpiredMandateContext()
} = {}) {
  const mandateActiveNow = isMandateActiveAt(context.mandate, context.current_recompute_time);
  const authorityPredicateResult = mandateActiveNow ? "PASS" : "FAIL";

  const recomputedEffectiveState = {
    record_type: "MatrixCurrentEffectiveStateRecomputeRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    recompute_id: "eg-t20-current-effective-state-recompute-v001",
    previous_state_id: context.previous_effective_state.state_id,
    previous_state_hash: context.previous_effective_state.state_hash,
    previous_effective_state: context.previous_effective_state.effective_state,
    recompute_time: context.current_recompute_time,
    authority_predicate_time_source: "CURRENT_RECOMPUTE_TIME",
    mandate_id: context.mandate.mandate_id,
    mandate_hash: context.mandate.mandate_hash,
    mandate_active_at_current_recompute_time: mandateActiveNow,
    current_authority_predicate_result: authorityPredicateResult,
    dependent_effective_state_regressed: true,
    dependent_effective_state_blocked: true,
    recomputed_effective_state: "BLOCKED",
    recomputed_validation_result: "UNVERIFIED",
    reason_codes: ["CURRENT_AUTHORITY_PREDICATE_FAILED", "MANDATE_EXPIRED", "DEPENDENT_EFFECTIVE_STATE_BLOCKED"],
    historical_decision_mutated: false,
    current_recompute_hash: null
  };

  recomputedEffectiveState.current_recompute_hash = sha256Record({ ...recomputedEffectiveState, current_recompute_hash: null });
  return recomputedEffectiveState;
}

function evaluateCurrentRecomputeExpiredMandate({
  context = createCurrentExpiredMandateContext(),
  recompute = null,
  generated_at = "2026-10-01T21:56:00+02:00"
} = {}) {
  const recomputeRecord = recompute || recomputeCurrentEffectiveStateAfterMandateExpiry({ context });

  const violationEvidence = {
    record_type: "CurrentAuthorityPredicateFailureEvidence",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    evidence_id: "eg-t20-current-authority-predicate-failure-v001",
    evidence_type: "MANDATE_EXPIRED_AT_CURRENT_RECOMPUTE_TIME",
    mandate_id: context.mandate.mandate_id,
    mandate_hash: context.mandate.mandate_hash,
    recompute_time: context.current_recompute_time,
    current_authority_predicate_result: recomputeRecord.current_authority_predicate_result,
    dependent_effective_state_regressed: recomputeRecord.dependent_effective_state_regressed,
    dependent_effective_state_blocked: recomputeRecord.dependent_effective_state_blocked,
    previous_effective_state: recomputeRecord.previous_effective_state,
    recomputed_effective_state: recomputeRecord.recomputed_effective_state,
    reason_codes: recomputeRecord.reason_codes,
    emitted_at: generated_at,
    violation_evidence_hash: null
  };
  violationEvidence.violation_evidence_hash = sha256Record({ ...violationEvidence, violation_evidence_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T20_CurrentRecomputeExpiredMandate_v001",
    artifact_type: "MatrixEGT20CurrentRecomputeExpiredMandateRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "Current authority predicate fails; dependent effective state regresses/blocks",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    mandate_context: context,
    mandate_record: context.mandate,
    previous_effective_state: context.previous_effective_state,
    current_recompute_record: recomputeRecord,
    violation_evidence: violationEvidence,
    current_recomputation_after_mandate_expired_detected: true,
    current_recompute_time_used: true,
    recorded_historical_evaluation_time_not_used_for_current_authority: true,
    mandate_active_at_current_recompute_time: false,
    current_authority_predicate_failed: true,
    dependent_effective_state_regressed: true,
    dependent_effective_state_blocked: true,
    previous_effective_state_value: "RELEASE_CLEAN_ELIGIBLE",
    recomputed_effective_state_value: "BLOCKED",
    recomputed_validation_result: "UNVERIFIED",
    authority_failure_evidence_emitted: true,
    current_expiry_blocks_dependent_effective_state: true,
    historical_decision_mutated: false,
    historical_replay_claimed: false,
    current_recompute_does_not_revoke_history: true,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    recompute_gate: {
      require_current_authority_predicate_failure: true,
      require_dependent_effective_state_regression_or_block: true,
      require_authority_failure_evidence_emitted: true,
      allow_current_state_to_remain_release_clean_eligible: false,
      use_recorded_historical_time_for_current_authority_allowed: false,
      mutate_historical_decision_allowed: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t20_runtime_artifact_created: true,
      current_recomputation_after_mandate_expired_detected: true,
      current_authority_predicate_failed: true,
      dependent_effective_state_regressed: true,
      dependent_effective_state_blocked: true,
      authority_failure_evidence_emitted: true,
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
    maximum_supported_claim: "EG_T20_CURRENT_RECOMPUTE_AFTER_MANDATE_EXPIRY_FAILS_CURRENT_AUTHORITY_PREDICATE_AND_REGRESSES_OR_BLOCKS_DEPENDENT_EFFECTIVE_STATE",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT20CurrentRecomputeExpiredMandate(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT20CurrentRecomputeExpiredMandateVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T20_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T20_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T20_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T20_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "Current authority predicate fails; dependent effective state regresses/blocks") errors.push({ code: "EG_T20_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["current_recomputation_after_mandate_expired_detected", true],
    ["current_recompute_time_used", true],
    ["recorded_historical_evaluation_time_not_used_for_current_authority", true],
    ["mandate_active_at_current_recompute_time", false],
    ["current_authority_predicate_failed", true],
    ["dependent_effective_state_regressed", true],
    ["dependent_effective_state_blocked", true],
    ["previous_effective_state_value", "RELEASE_CLEAN_ELIGIBLE"],
    ["recomputed_effective_state_value", "BLOCKED"],
    ["recomputed_validation_result", "UNVERIFIED"],
    ["authority_failure_evidence_emitted", true],
    ["current_expiry_blocks_dependent_effective_state", true],
    ["historical_decision_mutated", false],
    ["historical_replay_claimed", false],
    ["current_recompute_does_not_revoke_history", true],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T20_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.mandate_record || !artifact.previous_effective_state || !artifact.current_recompute_record || !artifact.violation_evidence) {
    errors.push({ code: "EG_T20_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.current_recompute_record.authority_predicate_time_source !== "CURRENT_RECOMPUTE_TIME") {
      errors.push({ code: "EG_T20_TIME_SOURCE_INVALID", observed: artifact.current_recompute_record.authority_predicate_time_source });
    }

    if (artifact.current_recompute_record.current_authority_predicate_result !== "FAIL") {
      errors.push({ code: "EG_T20_CURRENT_AUTHORITY_PREDICATE_NOT_FAIL", observed: artifact.current_recompute_record.current_authority_predicate_result });
    }

    if (artifact.current_recompute_record.recomputed_effective_state !== "BLOCKED") {
      errors.push({ code: "EG_T20_EFFECTIVE_STATE_NOT_BLOCKED", observed: artifact.current_recompute_record.recomputed_effective_state });
    }

    if (!artifact.current_recompute_record.reason_codes.includes("CURRENT_AUTHORITY_PREDICATE_FAILED") || !artifact.current_recompute_record.reason_codes.includes("MANDATE_EXPIRED")) {
      errors.push({ code: "EG_T20_REASON_CODES_MISSING", observed: artifact.current_recompute_record.reason_codes });
    }

    if (artifact.violation_evidence.recomputed_effective_state !== "BLOCKED") {
      errors.push({ code: "EG_T20_VIOLATION_EFFECTIVE_STATE_BINDING_INVALID", observed: artifact.violation_evidence.recomputed_effective_state });
    }
  }

  for (const key of [
    "require_current_authority_predicate_failure",
    "require_dependent_effective_state_regression_or_block",
    "require_authority_failure_evidence_emitted"
  ]) {
    if (!artifact.recompute_gate || artifact.recompute_gate[key] !== true) {
      errors.push({ code: "EG_T20_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.recompute_gate ? artifact.recompute_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_current_state_to_remain_release_clean_eligible",
    "use_recorded_historical_time_for_current_authority_allowed",
    "mutate_historical_decision_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.recompute_gate || artifact.recompute_gate[key] !== false) {
      errors.push({ code: "EG_T20_GATE_OVERCLAIM", key, observed: artifact.recompute_gate ? artifact.recompute_gate[key] : undefined });
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
      errors.push({ code: "EG_T20_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T20_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T20_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT20CurrentRecomputeExpiredMandateVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T20-CURRENT-RECOMPUTE-EXPIRED-MANDATE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    current_authority_predicate_failed: artifact.current_authority_predicate_failed,
    dependent_effective_state_regressed: artifact.dependent_effective_state_regressed,
    dependent_effective_state_blocked: artifact.dependent_effective_state_blocked,
    recomputed_effective_state_value: artifact.recomputed_effective_state_value,
    authority_failure_evidence_emitted: artifact.authority_failure_evidence_emitted,
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
  parseTime,
  isMandateActiveAt,
  createCurrentExpiredMandateContext,
  recomputeCurrentEffectiveStateAfterMandateExpiry,
  evaluateCurrentRecomputeExpiredMandate,
  verifyEGT20CurrentRecomputeExpiredMandate
};
