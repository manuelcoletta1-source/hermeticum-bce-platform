"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-240";
const TEST_ID = "EG-T21";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T21-TIME-SOURCE-UNTRUSTED-V0.1";

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

function secondsBetween(a, b) {
  return Math.abs(parseTime(a) - parseTime(b)) / 1000;
}

function createTimeTrustProfile() {
  const profile = {
    record_type: "TimeTrustProfile",
    tenant_id: TENANT_ID,
    profile_id: "eg-t21-time-trust-profile-v001",
    max_clock_drift_seconds: 300,
    rollback_allowed: false,
    monotonic_sequence_required: true,
    authority_guard_depends_on_trusted_time: true,
    profile_hash: null
  };

  profile.profile_hash = sha256Record({ ...profile, profile_hash: null });
  return profile;
}

function createClockDriftRollbackSample({ profile = createTimeTrustProfile() } = {}) {
  const sample = {
    record_type: "TimeSourceObservation",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    observation_id: "eg-t21-time-source-observation-v001",
    profile_id: profile.profile_id,
    authoritative_time: "2026-10-01T22:10:00+02:00",
    observed_runtime_time: "2026-10-01T21:58:40+02:00",
    previous_observed_runtime_time: "2026-10-01T22:04:20+02:00",
    observed_sequence: 21,
    previous_observed_sequence: 22,
    observed_time_source_ref: "LOCAL_RUNTIME_CLOCK",
    observation_hash: null
  };

  sample.observed_drift_seconds = secondsBetween(sample.authoritative_time, sample.observed_runtime_time);
  sample.rollback_detected = parseTime(sample.observed_runtime_time) < parseTime(sample.previous_observed_runtime_time);
  sample.monotonic_sequence_regressed = sample.observed_sequence < sample.previous_observed_sequence;
  sample.observation_hash = sha256Record({ ...sample, observation_hash: null });
  return sample;
}

function evaluateTimeSourceUntrusted({
  profile = createTimeTrustProfile(),
  sample = null,
  generated_at = "2026-10-01T22:11:00+02:00"
} = {}) {
  const observed = sample || createClockDriftRollbackSample({ profile });

  const clockDriftExceedsProfile = observed.observed_drift_seconds > profile.max_clock_drift_seconds;
  const rollbackExceedsProfile = profile.rollback_allowed === false && observed.rollback_detected === true;
  const timeSourceUntrusted = clockDriftExceedsProfile || rollbackExceedsProfile || observed.monotonic_sequence_regressed === true;

  const timeGuardEvaluation = {
    record_type: "TimeDependentGuardEvaluation",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    guard_id: "eg-t21-time-dependent-authority-guard-v001",
    guard_kind: "TIME_DEPENDENT_AUTHORITY_GUARD",
    profile_id: profile.profile_id,
    observation_id: observed.observation_id,
    authority_guard_depends_on_trusted_time: true,
    clock_drift_exceeds_profile: clockDriftExceedsProfile,
    rollback_exceeds_profile: rollbackExceedsProfile,
    monotonic_sequence_regressed: observed.monotonic_sequence_regressed,
    time_source_trusted: false,
    guard_result: "UNVERIFIED",
    reason_codes: ["TIME_SOURCE_UNTRUSTED", "CLOCK_DRIFT_EXCEEDS_PROFILE", "CLOCK_ROLLBACK_DETECTED"],
    evaluated_at: generated_at,
    guard_hash: null
  };

  timeGuardEvaluation.guard_hash = sha256Record({ ...timeGuardEvaluation, guard_hash: null });

  const violationEvidence = {
    record_type: "TimeSourceUntrustedViolationEvidence",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    evidence_id: "eg-t21-time-source-untrusted-v001",
    evidence_type: "CLOCK_DRIFT_OR_ROLLBACK_EXCEEDS_PROFILE",
    profile_id: profile.profile_id,
    observation_id: observed.observation_id,
    observed_drift_seconds: observed.observed_drift_seconds,
    max_clock_drift_seconds: profile.max_clock_drift_seconds,
    rollback_detected: observed.rollback_detected,
    monotonic_sequence_regressed: observed.monotonic_sequence_regressed,
    reason_codes: timeGuardEvaluation.reason_codes,
    time_dependent_guard_result: "UNVERIFIED",
    emitted_at: generated_at,
    violation_evidence_hash: null
  };

  violationEvidence.violation_evidence_hash = sha256Record({ ...violationEvidence, violation_evidence_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T21_TimeSourceUntrusted_v001",
    artifact_type: "MatrixEGT21TimeSourceUntrustedRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "TIME_SOURCE_UNTRUSTED; time-dependent guard becomes UNVERIFIED",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    time_trust_profile: profile,
    time_source_observation: observed,
    time_guard_evaluation: timeGuardEvaluation,
    violation_evidence: violationEvidence,
    clock_drift_or_rollback_exceeds_profile_detected: true,
    clock_drift_exceeds_profile: clockDriftExceedsProfile,
    clock_rollback_detected: observed.rollback_detected,
    rollback_exceeds_profile: rollbackExceedsProfile,
    monotonic_sequence_regressed: observed.monotonic_sequence_regressed,
    time_source_untrusted: timeSourceUntrusted,
    time_dependent_guard_unverified: true,
    time_dependent_guard_passed: false,
    time_dependent_guard_failed_closed: true,
    authority_predicate_trusted: false,
    dependent_effective_state_blocked: true,
    previous_effective_state_preserved_as_historical: true,
    current_effective_state_unverified: true,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    time_guard: {
      require_time_source_untrusted: true,
      require_time_dependent_guard_unverified: true,
      require_fail_closed_without_effect: true,
      allow_time_dependent_guard_pass: false,
      allow_authority_predicate_trusted: false,
      allow_current_effective_state_trusted: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t21_runtime_artifact_created: true,
      clock_drift_or_rollback_exceeds_profile_detected: true,
      time_source_untrusted: timeSourceUntrusted,
      time_dependent_guard_unverified: true,
      dependent_effective_state_blocked: true,
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
    maximum_supported_claim: "EG_T21_CLOCK_DRIFT_OR_ROLLBACK_EXCEEDS_PROFILE_PRODUCES_TIME_SOURCE_UNTRUSTED_AND_TIME_DEPENDENT_GUARD_UNVERIFIED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT21TimeSourceUntrusted(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT21TimeSourceUntrustedVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T21_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T21_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T21_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T21_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "TIME_SOURCE_UNTRUSTED; time-dependent guard becomes UNVERIFIED") errors.push({ code: "EG_T21_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["clock_drift_or_rollback_exceeds_profile_detected", true],
    ["clock_drift_exceeds_profile", true],
    ["clock_rollback_detected", true],
    ["rollback_exceeds_profile", true],
    ["monotonic_sequence_regressed", true],
    ["time_source_untrusted", true],
    ["time_dependent_guard_unverified", true],
    ["time_dependent_guard_passed", false],
    ["time_dependent_guard_failed_closed", true],
    ["authority_predicate_trusted", false],
    ["dependent_effective_state_blocked", true],
    ["current_effective_state_unverified", true],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T21_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.time_trust_profile || !artifact.time_source_observation || !artifact.time_guard_evaluation || !artifact.violation_evidence) {
    errors.push({ code: "EG_T21_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.time_source_observation.observed_drift_seconds <= artifact.time_trust_profile.max_clock_drift_seconds) {
      errors.push({ code: "EG_T21_DRIFT_NOT_EXCEEDED", observed: artifact.time_source_observation.observed_drift_seconds });
    }

    if (artifact.time_guard_evaluation.guard_result !== "UNVERIFIED") {
      errors.push({ code: "EG_T21_GUARD_NOT_UNVERIFIED", observed: artifact.time_guard_evaluation.guard_result });
    }

    if (artifact.time_guard_evaluation.time_source_trusted !== false) {
      errors.push({ code: "EG_T21_TIME_SOURCE_TRUST_OVERCLAIM", observed: artifact.time_guard_evaluation.time_source_trusted });
    }

    if (!artifact.time_guard_evaluation.reason_codes.includes("TIME_SOURCE_UNTRUSTED")) {
      errors.push({ code: "EG_T21_REASON_CODES_MISSING", observed: artifact.time_guard_evaluation.reason_codes });
    }

    if (artifact.violation_evidence.time_dependent_guard_result !== "UNVERIFIED") {
      errors.push({ code: "EG_T21_VIOLATION_GUARD_BINDING_INVALID", observed: artifact.violation_evidence.time_dependent_guard_result });
    }
  }

  for (const key of [
    "require_time_source_untrusted",
    "require_time_dependent_guard_unverified",
    "require_fail_closed_without_effect"
  ]) {
    if (!artifact.time_guard || artifact.time_guard[key] !== true) {
      errors.push({ code: "EG_T21_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.time_guard ? artifact.time_guard[key] : undefined });
    }
  }

  for (const key of [
    "allow_time_dependent_guard_pass",
    "allow_authority_predicate_trusted",
    "allow_current_effective_state_trusted",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.time_guard || artifact.time_guard[key] !== false) {
      errors.push({ code: "EG_T21_GATE_OVERCLAIM", key, observed: artifact.time_guard ? artifact.time_guard[key] : undefined });
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
      errors.push({ code: "EG_T21_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T21_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T21_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT21TimeSourceUntrustedVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T21-TIME-SOURCE-UNTRUSTED-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    time_source_untrusted: artifact.time_source_untrusted,
    time_dependent_guard_unverified: artifact.time_dependent_guard_unverified,
    dependent_effective_state_blocked: artifact.dependent_effective_state_blocked,
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
  secondsBetween,
  createTimeTrustProfile,
  createClockDriftRollbackSample,
  evaluateTimeSourceUntrusted,
  verifyEGT21TimeSourceUntrusted
};
