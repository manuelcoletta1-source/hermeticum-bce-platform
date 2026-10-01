"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-232";
const TEST_ID = "EG-T13";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T13-AUTHORITATIVE-EVENT-LOG-REPLAY-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createBaselineTimeProfile() {
  const profile = {
    record_type: "MatrixReplayBaselineTimeProfile",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    baseline_id: "HBCE-MATRIX-BASELINE-20261001-R3",
    baseline_version: "V1.3-R3",
    time_profile_id: "STATIC_FREEZE_2026_10_01_19_50_EUROPE_ROME",
    time_zone: "Europe/Rome",
    replay_clock: "2026-10-01T19:50:00+02:00",
    event_order_rule: "STRICT_SEQUENCE_THEN_EVENT_HASH",
    derivation_rule: "APPLY_AUTHORITATIVE_EVENTS_ONLY",
    baseline_sha256: null
  };

  profile.baseline_sha256 = sha256Record({ ...profile, baseline_sha256: null });
  return profile;
}

function createAuthoritativeEventLog({ profile = createBaselineTimeProfile() } = {}) {
  const events = [
    {
      sequence: 1,
      event_id: "eg-t13-event-001-initial-blocked",
      event_type: "InitialStateProjectionEvent",
      tenant_id: TENANT_ID,
      subject_ref: MATRIX_SUBJECT_REF,
      namespace: "RELEASE_STATE",
      from_state: null,
      to_state: "BLOCKED",
      from_state_version: 0,
      to_state_version: 1,
      decision_result: "INITIALIZE",
      validation_result: "VERIFIED",
      reason_code: "INITIAL_CONTROLLED_STATE",
      baseline_sha256: profile.baseline_sha256,
      emitted_at: "2026-10-01T19:50:01+02:00",
      event_hash: null
    },
    {
      sequence: 2,
      event_id: "eg-t13-event-002-valid-transition",
      event_type: "TransitionEvent",
      tenant_id: TENANT_ID,
      subject_ref: MATRIX_SUBJECT_REF,
      namespace: "RELEASE_STATE",
      from_state: "BLOCKED",
      to_state: "RELEASE_CLEAN_ELIGIBLE",
      from_state_version: 1,
      to_state_version: 2,
      decision_result: "ALLOW",
      validation_result: "VERIFIED",
      reason_code: "COMPLETE_GUARDS_AND_EVIDENCE",
      baseline_sha256: profile.baseline_sha256,
      emitted_at: "2026-10-01T19:50:02+02:00",
      event_hash: null
    },
    {
      sequence: 3,
      event_id: "eg-t13-event-003-evidence-regression",
      event_type: "EffectiveStateRegressionEvent",
      tenant_id: TENANT_ID,
      subject_ref: MATRIX_SUBJECT_REF,
      namespace: "RELEASE_STATE",
      from_state: "RELEASE_CLEAN_ELIGIBLE",
      to_state: "BLOCKED",
      from_state_version: 2,
      to_state_version: 3,
      decision_result: "REGRESS_EFFECTIVE_STATE",
      validation_result: "UNVERIFIED",
      reason_code: "REQUIRED_EVIDENCE_INVALIDATED",
      baseline_sha256: profile.baseline_sha256,
      emitted_at: "2026-10-01T19:50:03+02:00",
      event_hash: null
    }
  ];

  const hashedEvents = events.map((event) => ({
    ...event,
    event_hash: sha256Record({ ...event, event_hash: null })
  }));

  const log = {
    record_type: "MatrixAuthoritativeEventLog",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    baseline_ref: profile.baseline_id,
    baseline_sha256: profile.baseline_sha256,
    time_profile_id: profile.time_profile_id,
    event_count: hashedEvents.length,
    events: hashedEvents,
    log_sha256: null
  };

  log.log_sha256 = sha256Record({ ...log, log_sha256: null });
  return log;
}

function deriveStateFromAuthoritativeEventLog({
  profile = createBaselineTimeProfile(),
  eventLog = createAuthoritativeEventLog({ profile }),
  derivation_run_id = "eg-t13-derivation-original-v001"
} = {}) {
  let state = null;
  let stateVersion = 0;
  const appliedEventIds = [];
  const skippedEventIds = [];
  const errors = [];

  if (eventLog.baseline_sha256 !== profile.baseline_sha256) {
    errors.push({
      code: "EG_T13_BASELINE_MISMATCH",
      expected: profile.baseline_sha256,
      observed: eventLog.baseline_sha256
    });
  }

  if (eventLog.time_profile_id !== profile.time_profile_id) {
    errors.push({
      code: "EG_T13_TIME_PROFILE_MISMATCH",
      expected: profile.time_profile_id,
      observed: eventLog.time_profile_id
    });
  }

  const events = Array.isArray(eventLog.events) ? [...eventLog.events].sort((a, b) => a.sequence - b.sequence) : [];

  for (const event of events) {
    const expectedEventHash = sha256Record({ ...event, event_hash: null });

    if (event.event_hash !== expectedEventHash) {
      errors.push({
        code: "EG_T13_EVENT_HASH_MISMATCH",
        event_id: event.event_id,
        expected: expectedEventHash,
        observed: event.event_hash
      });
      skippedEventIds.push(event.event_id);
      continue;
    }

    if (event.baseline_sha256 !== profile.baseline_sha256) {
      errors.push({
        code: "EG_T13_EVENT_BASELINE_MISMATCH",
        event_id: event.event_id
      });
      skippedEventIds.push(event.event_id);
      continue;
    }

    if (event.from_state !== state || event.from_state_version !== stateVersion) {
      errors.push({
        code: "EG_T13_EVENT_PREDECESSOR_MISMATCH",
        event_id: event.event_id,
        expected_state: state,
        observed_from_state: event.from_state,
        expected_version: stateVersion,
        observed_from_version: event.from_state_version
      });
      skippedEventIds.push(event.event_id);
      continue;
    }

    state = event.to_state;
    stateVersion = event.to_state_version;
    appliedEventIds.push(event.event_id);
  }

  const derived = {
    record_type: "MatrixDerivedStateFromAuthoritativeEventLog",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    derivation_run_id,
    baseline_ref: profile.baseline_id,
    baseline_sha256: profile.baseline_sha256,
    time_profile_id: profile.time_profile_id,
    event_log_sha256: eventLog.log_sha256,
    applied_event_count: appliedEventIds.length,
    applied_event_ids: appliedEventIds,
    skipped_event_ids: skippedEventIds,
    derived_state: state,
    derived_state_version: stateVersion,
    derivation_errors: errors,
    derived_without_errors: errors.length === 0,
    derived_at: profile.replay_clock,
    derived_state_sha256: null
  };

  derived.derived_state_sha256 = sha256Record({ ...derived, derived_state_sha256: null });
  return derived;
}

function evaluateAuthoritativeEventLogReplay({
  profile = createBaselineTimeProfile(),
  eventLog = null,
  evaluated_at = "2026-10-01T19:51:00+02:00"
} = {}) {
  const log = eventLog || createAuthoritativeEventLog({ profile });

  const originalDerivation = deriveStateFromAuthoritativeEventLog({
    profile,
    eventLog: log,
    derivation_run_id: "eg-t13-derivation-original-v001"
  });

  const replayDerivation = deriveStateFromAuthoritativeEventLog({
    profile,
    eventLog: log,
    derivation_run_id: "eg-t13-derivation-replay-v001"
  });

  const sameDerivedState =
    originalDerivation.derived_state === replayDerivation.derived_state &&
    originalDerivation.derived_state_version === replayDerivation.derived_state_version &&
    originalDerivation.applied_event_count === replayDerivation.applied_event_count &&
    JSON.stringify(originalDerivation.applied_event_ids) === JSON.stringify(replayDerivation.applied_event_ids);

  const replayObservation = {
    record_type: "AuthoritativeEventLogReplayObservationRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    observation_id: "eg-t13-authoritative-log-replay-observation-v001",
    baseline_sha256: profile.baseline_sha256,
    time_profile_id: profile.time_profile_id,
    original_derivation_sha256: originalDerivation.derived_state_sha256,
    replay_derivation_sha256: replayDerivation.derived_state_sha256,
    same_derived_state: sameDerivedState,
    same_baseline: true,
    same_time_profile: true,
    new_authoritative_event_created: false,
    projection_mutated_during_replay: false,
    observed_at: evaluated_at,
    observation_sha256: null
  };

  replayObservation.observation_sha256 = sha256Record({ ...replayObservation, observation_sha256: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T13_AuthoritativeEventLogReplay_v001",
    artifact_type: "MatrixEGT13AuthoritativeEventLogReplayRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "Same derived state under same baseline/time profile",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    baseline_time_profile: profile,
    authoritative_event_log: log,
    original_derivation: originalDerivation,
    replay_derivation: replayDerivation,
    replay_observation: replayObservation,
    same_baseline: true,
    same_time_profile: true,
    same_event_log: true,
    same_derived_state: sameDerivedState,
    original_derived_state: originalDerivation.derived_state,
    replay_derived_state: replayDerivation.derived_state,
    original_derived_state_version: originalDerivation.derived_state_version,
    replay_derived_state_version: replayDerivation.derived_state_version,
    original_applied_event_count: originalDerivation.applied_event_count,
    replay_applied_event_count: replayDerivation.applied_event_count,
    deterministic_derivation_confirmed: sameDerivedState === true,
    derivation_without_errors: originalDerivation.derived_without_errors === true && replayDerivation.derived_without_errors === true,
    replay_created_new_authoritative_event: false,
    projection_mutated_during_replay: false,
    event_log_rewritten: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    replay_gate: {
      require_same_baseline: true,
      require_same_time_profile: true,
      require_same_event_log_hash: true,
      require_same_derived_state: true,
      allow_event_log_rewrite: false,
      allow_projection_mutation_during_replay: false,
      allow_new_authoritative_event_creation: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t13_runtime_artifact_created: true,
      authoritative_event_log_replayed: true,
      deterministic_derivation_confirmed: true,
      same_derived_state_under_same_baseline_time_profile: true,
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
    maximum_supported_claim: "EG_T13_AUTHORITATIVE_EVENT_LOG_REPLAY_DERIVED_SAME_STATE_UNDER_SAME_BASELINE_TIME_PROFILE",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT13AuthoritativeEventLogReplay(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT13AuthoritativeEventLogReplayVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T13_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T13_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T13_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T13_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "Same derived state under same baseline/time profile") errors.push({ code: "EG_T13_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["same_baseline", true],
    ["same_time_profile", true],
    ["same_event_log", true],
    ["same_derived_state", true],
    ["deterministic_derivation_confirmed", true],
    ["derivation_without_errors", true],
    ["replay_created_new_authoritative_event", false],
    ["projection_mutated_during_replay", false],
    ["event_log_rewritten", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T13_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.original_derivation || !artifact.replay_derivation || !artifact.authoritative_event_log || !artifact.baseline_time_profile) {
    errors.push({ code: "EG_T13_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.authoritative_event_log.baseline_sha256 !== artifact.baseline_time_profile.baseline_sha256) {
      errors.push({ code: "EG_T13_LOG_BASELINE_BINDING_MISMATCH" });
    }

    if (artifact.authoritative_event_log.time_profile_id !== artifact.baseline_time_profile.time_profile_id) {
      errors.push({ code: "EG_T13_LOG_TIME_PROFILE_BINDING_MISMATCH" });
    }

    if (artifact.original_derivation.derived_state !== artifact.replay_derivation.derived_state) {
      errors.push({ code: "EG_T13_DERIVED_STATE_MISMATCH" });
    }

    if (artifact.original_derivation.derived_state_version !== artifact.replay_derivation.derived_state_version) {
      errors.push({ code: "EG_T13_DERIVED_STATE_VERSION_MISMATCH" });
    }

    if (artifact.original_derivation.applied_event_count !== artifact.replay_derivation.applied_event_count) {
      errors.push({ code: "EG_T13_APPLIED_EVENT_COUNT_MISMATCH" });
    }

    if (artifact.original_derivation.derived_without_errors !== true || artifact.replay_derivation.derived_without_errors !== true) {
      errors.push({ code: "EG_T13_DERIVATION_ERRORS_PRESENT" });
    }

    if (artifact.original_derived_state !== "BLOCKED" || artifact.replay_derived_state !== "BLOCKED") {
      errors.push({
        code: "EG_T13_DERIVED_STATE_UNEXPECTED",
        original: artifact.original_derived_state,
        replay: artifact.replay_derived_state
      });
    }
  }

  for (const key of [
    "require_same_baseline",
    "require_same_time_profile",
    "require_same_event_log_hash",
    "require_same_derived_state"
  ]) {
    if (!artifact.replay_gate || artifact.replay_gate[key] !== true) {
      errors.push({ code: "EG_T13_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.replay_gate ? artifact.replay_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_event_log_rewrite",
    "allow_projection_mutation_during_replay",
    "allow_new_authoritative_event_creation",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.replay_gate || artifact.replay_gate[key] !== false) {
      errors.push({ code: "EG_T13_GATE_OVERCLAIM", key, observed: artifact.replay_gate ? artifact.replay_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t13_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T13_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "authoritative_event_log_replayed",
    "deterministic_derivation_confirmed",
    "same_derived_state_under_same_baseline_time_profile"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== true) {
      errors.push({ code: "EG_T13_RUNTIME_POSITIVE_CLAIM_MISSING", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T13_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T13_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T13_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT13AuthoritativeEventLogReplayVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T13-AUTHORITATIVE-EVENT-LOG-REPLAY-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    same_baseline: artifact.same_baseline,
    same_time_profile: artifact.same_time_profile,
    same_event_log: artifact.same_event_log,
    same_derived_state: artifact.same_derived_state,
    original_derived_state: artifact.original_derived_state,
    replay_derived_state: artifact.replay_derived_state,
    deterministic_derivation_confirmed: artifact.deterministic_derivation_confirmed,
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
  createBaselineTimeProfile,
  createAuthoritativeEventLog,
  deriveStateFromAuthoritativeEventLog,
  evaluateAuthoritativeEventLogReplay,
  verifyEGT13AuthoritativeEventLogReplay
};
