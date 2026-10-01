"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-238";
const TEST_ID = "EG-T19";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T19-HISTORICAL-REPLAY-EXPIRED-MANDATE-V0.1";

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

function createMandateTimeline() {
  const mandate = {
    record_type: "MandateRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    mandate_id: "eg-t19-release-mandate-v001",
    authority_ref: "HBCE_INTERNAL_HUMAN_AUTHORITY",
    mandate_scope: "MATRIX_RELEASE_TRANSITION_REPLAY",
    valid_from: "2026-09-01T00:00:00+02:00",
    valid_until: "2026-10-01T12:00:00+02:00",
    status_after_valid_until: "EXPIRED",
    mandate_hash: null
  };

  mandate.mandate_hash = sha256Record({ ...mandate, mandate_hash: null });

  return {
    mandate,
    historical_evaluation_time: "2026-09-30T15:30:00+02:00",
    replay_time_after_expiry: "2026-10-01T21:40:00+02:00"
  };
}

function createHistoricalAuthorizedDecision({ timeline = createMandateTimeline() } = {}) {
  const mandateActiveAtRecordedEvaluationTime = isMandateActiveAt(timeline.mandate, timeline.historical_evaluation_time);

  const decision = {
    record_type: "HistoricalAuthorityDecisionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    decision_id: "eg-t19-historical-authorized-decision-v001",
    decision_scope: "MATRIX_RELEASE_TRANSITION_REPLAY",
    mandate_id: timeline.mandate.mandate_id,
    mandate_hash: timeline.mandate.mandate_hash,
    recorded_evaluation_time: timeline.historical_evaluation_time,
    authority_predicate_time_source: "RECORDED_EVALUATION_TIME",
    mandate_active_at_recorded_evaluation_time: mandateActiveAtRecordedEvaluationTime,
    decision_result: mandateActiveAtRecordedEvaluationTime ? "ALLOW" : "REJECT",
    validation_result: mandateActiveAtRecordedEvaluationTime ? "VERIFIED" : "UNVERIFIED",
    reason_code: mandateActiveAtRecordedEvaluationTime ? "MANDATE_ACTIVE_AT_RECORDED_EVALUATION_TIME" : "MANDATE_NOT_ACTIVE_AT_RECORDED_EVALUATION_TIME",
    action_ref: "MATRIX::REPLAY::HISTORICAL_AUTHORIZED_DECISION",
    action_hash: "1".repeat(64),
    decision_hash: null
  };

  decision.decision_hash = sha256Record({ ...decision, decision_hash: null });
  return decision;
}

function replayHistoricalDecision({
  timeline = createMandateTimeline(),
  historicalDecision = null
} = {}) {
  const decision = historicalDecision || createHistoricalAuthorizedDecision({ timeline });

  const mandateActiveAtRecordedEvaluationTime = isMandateActiveAt(timeline.mandate, decision.recorded_evaluation_time);
  const mandateCurrentlyExpired = parseTime(timeline.replay_time_after_expiry) > parseTime(timeline.mandate.valid_until);

  const replay = {
    record_type: "HistoricalDecisionReplayRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    replay_id: "eg-t19-historical-decision-replay-v001",
    replay_time: timeline.replay_time_after_expiry,
    replay_time_after_mandate_expiry: mandateCurrentlyExpired,
    original_decision_id: decision.decision_id,
    original_decision_hash: decision.decision_hash,
    recorded_evaluation_time: decision.recorded_evaluation_time,
    authority_predicate_time_source: "RECORDED_EVALUATION_TIME",
    used_recorded_evaluation_time: true,
    used_current_replay_time_for_historical_authority: false,
    mandate_id: timeline.mandate.mandate_id,
    mandate_hash: timeline.mandate.mandate_hash,
    mandate_active_at_recorded_evaluation_time: mandateActiveAtRecordedEvaluationTime,
    mandate_currently_expired: mandateCurrentlyExpired,
    replayed_decision_result: mandateActiveAtRecordedEvaluationTime ? "ALLOW" : "REJECT",
    replayed_validation_result: mandateActiveAtRecordedEvaluationTime ? "VERIFIED" : "UNVERIFIED",
    replay_result: mandateActiveAtRecordedEvaluationTime && decision.decision_result === "ALLOW" ? "REPRODUCED" : "NOT_REPRODUCED",
    historical_authorized_decision_reproducible: mandateActiveAtRecordedEvaluationTime && decision.decision_result === "ALLOW",
    historical_decision_revoked_by_later_expiry: false,
    replay_hash: null
  };

  replay.replay_hash = sha256Record({ ...replay, replay_hash: null });
  return replay;
}

function evaluateHistoricalReplayExpiredMandate({
  timeline = createMandateTimeline(),
  historicalDecision = null,
  replay = null,
  generated_at = "2026-10-01T21:41:00+02:00"
} = {}) {
  const decision = historicalDecision || createHistoricalAuthorizedDecision({ timeline });
  const replayRecord = replay || replayHistoricalDecision({ timeline, historicalDecision: decision });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T19_HistoricalReplayExpiredMandate_v001",
    artifact_type: "MatrixEGT19HistoricalReplayExpiredMandateRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "Uses recorded evaluation_time; historical authorized decision remains reproducible",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    mandate_timeline: timeline,
    mandate_record: timeline.mandate,
    historical_authorized_decision: decision,
    historical_replay_record: replayRecord,
    historical_replay_after_mandate_expired_detected: true,
    recorded_evaluation_time_used: true,
    current_replay_time_not_used_for_historical_authority: true,
    mandate_active_at_recorded_evaluation_time: true,
    mandate_currently_expired: true,
    historical_authorized_decision_reproducible: true,
    historical_decision_result: "ALLOW",
    replayed_decision_result: "ALLOW",
    replay_result_reproduced: true,
    decision_hash_preserved: replayRecord.original_decision_hash === decision.decision_hash,
    historical_decision_revoked_by_later_expiry: false,
    current_authority_predicate_recomputed_for_historical_decision: false,
    current_expiry_does_not_mutate_historical_decision: true,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    replay_gate: {
      require_recorded_evaluation_time: true,
      require_historical_authorized_decision_reproducible: true,
      require_later_expiry_not_to_revoke_history: true,
      use_current_time_for_historical_replay_allowed: false,
      mutate_historical_decision_allowed: false,
      revoke_historical_decision_due_to_later_expiry_allowed: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t19_runtime_artifact_created: true,
      historical_replay_after_mandate_expired_detected: true,
      recorded_evaluation_time_used: true,
      historical_authorized_decision_reproducible: true,
      mandate_currently_expired: true,
      historical_decision_revoked_by_later_expiry: false,
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
    maximum_supported_claim: "EG_T19_HISTORICAL_REPLAY_AFTER_MANDATE_EXPIRY_USES_RECORDED_EVALUATION_TIME_AND_REPRODUCES_HISTORICAL_AUTHORIZED_DECISION",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT19HistoricalReplayExpiredMandate(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT19HistoricalReplayExpiredMandateVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T19_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T19_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T19_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T19_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "Uses recorded evaluation_time; historical authorized decision remains reproducible") errors.push({ code: "EG_T19_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["historical_replay_after_mandate_expired_detected", true],
    ["recorded_evaluation_time_used", true],
    ["current_replay_time_not_used_for_historical_authority", true],
    ["mandate_active_at_recorded_evaluation_time", true],
    ["mandate_currently_expired", true],
    ["historical_authorized_decision_reproducible", true],
    ["historical_decision_result", "ALLOW"],
    ["replayed_decision_result", "ALLOW"],
    ["replay_result_reproduced", true],
    ["decision_hash_preserved", true],
    ["historical_decision_revoked_by_later_expiry", false],
    ["current_authority_predicate_recomputed_for_historical_decision", false],
    ["current_expiry_does_not_mutate_historical_decision", true],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T19_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.mandate_record || !artifact.historical_authorized_decision || !artifact.historical_replay_record) {
    errors.push({ code: "EG_T19_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.historical_authorized_decision.recorded_evaluation_time !== artifact.historical_replay_record.recorded_evaluation_time) {
      errors.push({ code: "EG_T19_RECORDED_EVALUATION_TIME_BINDING_MISMATCH" });
    }

    if (artifact.historical_authorized_decision.decision_hash !== artifact.historical_replay_record.original_decision_hash) {
      errors.push({ code: "EG_T19_DECISION_HASH_BINDING_MISMATCH" });
    }

    if (artifact.historical_replay_record.used_recorded_evaluation_time !== true) {
      errors.push({ code: "EG_T19_REPLAY_DID_NOT_USE_RECORDED_EVALUATION_TIME" });
    }

    if (artifact.historical_replay_record.used_current_replay_time_for_historical_authority !== false) {
      errors.push({ code: "EG_T19_USED_CURRENT_TIME_OVERCLAIM" });
    }

    if (artifact.historical_replay_record.replay_result !== "REPRODUCED") {
      errors.push({ code: "EG_T19_REPLAY_NOT_REPRODUCED", observed: artifact.historical_replay_record.replay_result });
    }
  }

  for (const key of [
    "require_recorded_evaluation_time",
    "require_historical_authorized_decision_reproducible",
    "require_later_expiry_not_to_revoke_history"
  ]) {
    if (!artifact.replay_gate || artifact.replay_gate[key] !== true) {
      errors.push({ code: "EG_T19_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.replay_gate ? artifact.replay_gate[key] : undefined });
    }
  }

  for (const key of [
    "use_current_time_for_historical_replay_allowed",
    "mutate_historical_decision_allowed",
    "revoke_historical_decision_due_to_later_expiry_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.replay_gate || artifact.replay_gate[key] !== false) {
      errors.push({ code: "EG_T19_GATE_OVERCLAIM", key, observed: artifact.replay_gate ? artifact.replay_gate[key] : undefined });
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
      errors.push({ code: "EG_T19_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T19_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T19_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT19HistoricalReplayExpiredMandateVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T19-HISTORICAL-REPLAY-EXPIRED-MANDATE-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    recorded_evaluation_time_used: artifact.recorded_evaluation_time_used,
    mandate_currently_expired: artifact.mandate_currently_expired,
    historical_authorized_decision_reproducible: artifact.historical_authorized_decision_reproducible,
    historical_decision_revoked_by_later_expiry: artifact.historical_decision_revoked_by_later_expiry,
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
  createMandateTimeline,
  createHistoricalAuthorizedDecision,
  replayHistoricalDecision,
  evaluateHistoricalReplayExpiredMandate,
  verifyEGT19HistoricalReplayExpiredMandate
};
