"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-248";
const TEST_ID = "EG-T29";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T29-WITNESS-DEADLINE-EXCEEDED-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function secondsBetween(startIso, endIso) {
  return Math.floor((Date.parse(endIso) - Date.parse(startIso)) / 1000);
}

function createWitnessProfile() {
  const profile = {
    record_type: "TailWitnessProfile",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    profile_id: "eg-t29-tail-witness-profile-v001",
    profile_class: "A2_EFFECT_RELEVANT_CHECKPOINT",
    witness_deadline_seconds: 120,
    require_tail_witness_before_checkpoint_fresh: true,
    require_dependent_action_block_when_stale: true,
    require_dependent_promotion_block_when_stale: true,
    profile_hash: null
  };

  profile.profile_hash = sha256Record({ ...profile, profile_hash: null });
  return profile;
}

function createUnwitnessedTailEvent() {
  const event = {
    record_type: "UnwitnessedTailEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t29-unwitnessed-tail-event-v001",
    sequence_number: 201,
    event_label: "promotion-dependent-tail-event",
    event_created_at: "2026-10-01T23:30:00+02:00",
    witness_receipt_present: false,
    witness_receipt_ref: null,
    event_payload_digest: "eg-t29-tail-payload-digest-v001",
    event_hash: null
  };

  event.event_hash = sha256Record({ ...event, event_hash: null });
  return event;
}

function createCheckpointAttempt({ tailEvent = createUnwitnessedTailEvent(), witnessProfile = createWitnessProfile() } = {}) {
  const attemptedAt = "2026-10-01T23:33:05+02:00";
  const elapsedSeconds = secondsBetween(tailEvent.event_created_at, attemptedAt);

  const attempt = {
    record_type: "TailWitnessCheckpointAttempt",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    checkpoint_attempt_id: "eg-t29-checkpoint-attempt-v001",
    profile_id: witnessProfile.profile_id,
    tail_event_id: tailEvent.event_id,
    tail_event_sequence_number: tailEvent.sequence_number,
    tail_event_created_at: tailEvent.event_created_at,
    checkpoint_attempted_at: attemptedAt,
    elapsed_seconds_since_tail_event: elapsedSeconds,
    witness_deadline_seconds: witnessProfile.witness_deadline_seconds,
    witness_receipt_present: tailEvent.witness_receipt_present,
    deadline_exceeded: elapsedSeconds > witnessProfile.witness_deadline_seconds,
    checkpoint_state_before: "PENDING_WITNESS",
    checkpoint_state_after: "STALE",
    attempt_hash: null
  };

  attempt.attempt_hash = sha256Record({ ...attempt, attempt_hash: null });
  return attempt;
}

function createDeadlineExceededEvent({ tailEvent, witnessProfile, checkpointAttempt, generated_at }) {
  const event = {
    record_type: "TailWitnessDeadlineExceededEvidenceEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t29-tail-witness-deadline-exceeded-event-v001",
    event_class: "SECURITY_EVIDENCE_EVENT",
    violation_type: "TAIL_WITNESS_DEADLINE_EXCEEDED",
    profile_id: witnessProfile.profile_id,
    tail_event_id: tailEvent.event_id,
    checkpoint_attempt_id: checkpointAttempt.checkpoint_attempt_id,
    witness_deadline_seconds: witnessProfile.witness_deadline_seconds,
    elapsed_seconds_since_tail_event: checkpointAttempt.elapsed_seconds_since_tail_event,
    witness_receipt_present: false,
    checkpoint_state_after: "STALE",
    dependent_action_blocked: true,
    dependent_promotion_blocked: true,
    dispatch_performed: false,
    external_connector_called: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    emitted_at: generated_at,
    event_hash: null
  };

  event.event_hash = sha256Record({ ...event, event_hash: null });
  return event;
}

function evaluateWitnessDeadlineExceeded({
  witnessProfile = createWitnessProfile(),
  tailEvent = createUnwitnessedTailEvent(),
  checkpointAttempt = null,
  generated_at = "2026-10-01T23:34:00+02:00"
} = {}) {
  const effectiveCheckpointAttempt = checkpointAttempt || createCheckpointAttempt({ tailEvent, witnessProfile });
  const deadlineExceededEvent = createDeadlineExceededEvent({
    tailEvent,
    witnessProfile,
    checkpointAttempt: effectiveCheckpointAttempt,
    generated_at
  });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T29_WitnessDeadlineExceeded_v001",
    artifact_type: "MatrixEGT29WitnessDeadlineExceededRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "TAIL_WITNESS_DEADLINE_EXCEEDED; checkpoint becomes STALE; dependent action/promotion blocks",
    selected_profile: "A2_EFFECT_RELEVANT_CHECKPOINT",
    witness_profile: witnessProfile,
    unwitnessed_tail_event: tailEvent,
    checkpoint_attempt: effectiveCheckpointAttempt,
    deadline_exceeded_event: deadlineExceededEvent,
    witness_deadline_seconds: witnessProfile.witness_deadline_seconds,
    elapsed_seconds_since_tail_event: effectiveCheckpointAttempt.elapsed_seconds_since_tail_event,
    witness_receipt_present: false,
    witness_deadline_exceeded: true,
    rejection_code: "TAIL_WITNESS_DEADLINE_EXCEEDED",
    checkpoint_state_before: "PENDING_WITNESS",
    checkpoint_state_after: "STALE",
    checkpoint_fresh: false,
    checkpoint_stale: true,
    dependent_action_blocked: true,
    dependent_promotion_blocked: true,
    dependent_action_allowed: false,
    dependent_promotion_allowed: false,
    promotion_allowed: false,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    witness_deadline_gate: {
      require_tail_witness_within_profile_deadline: true,
      require_checkpoint_stale_after_deadline_exceeded: true,
      require_dependent_action_block_when_stale: true,
      require_dependent_promotion_block_when_stale: true,
      require_no_second_effect: true,
      allow_checkpoint_fresh_after_deadline_exceeded: false,
      allow_dependent_action_after_stale_checkpoint: false,
      allow_dependent_promotion_after_stale_checkpoint: false,
      allow_dispatch_after_stale_checkpoint: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t29_runtime_artifact_created: true,
      witness_deadline_exceeded: true,
      rejection_code_tail_witness_deadline_exceeded: true,
      checkpoint_state_stale: true,
      dependent_action_blocked: true,
      dependent_promotion_blocked: true,
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
    maximum_supported_claim: "EG_T29_WITNESS_DEADLINE_EXCEEDED_FOR_PROFILE_MAKES_CHECKPOINT_STALE_AND_BLOCKS_DEPENDENT_ACTION_PROMOTION",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT29WitnessDeadlineExceeded(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT29WitnessDeadlineExceededVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T29_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T29_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T29_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T29_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "TAIL_WITNESS_DEADLINE_EXCEEDED; checkpoint becomes STALE; dependent action/promotion blocks") errors.push({ code: "EG_T29_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["witness_receipt_present", false],
    ["witness_deadline_exceeded", true],
    ["rejection_code", "TAIL_WITNESS_DEADLINE_EXCEEDED"],
    ["checkpoint_state_before", "PENDING_WITNESS"],
    ["checkpoint_state_after", "STALE"],
    ["checkpoint_fresh", false],
    ["checkpoint_stale", true],
    ["dependent_action_blocked", true],
    ["dependent_promotion_blocked", true],
    ["dependent_action_allowed", false],
    ["dependent_promotion_allowed", false],
    ["promotion_allowed", false],
    ["dispatch_allowed", false],
    ["dispatch_performed", false],
    ["external_connector_called", false],
    ["target_receipt_created", false],
    ["effect_evidence_created", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T29_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.witness_profile || !artifact.unwitnessed_tail_event || !artifact.checkpoint_attempt || !artifact.deadline_exceeded_event) {
    errors.push({ code: "EG_T29_CORE_RECORDS_MISSING" });
  } else {
    const recomputedElapsed = secondsBetween(
      artifact.unwitnessed_tail_event.event_created_at,
      artifact.checkpoint_attempt.checkpoint_attempted_at
    );

    if (recomputedElapsed !== artifact.checkpoint_attempt.elapsed_seconds_since_tail_event) {
      errors.push({
        code: "EG_T29_ELAPSED_SECONDS_MISMATCH",
        expected: recomputedElapsed,
        observed: artifact.checkpoint_attempt.elapsed_seconds_since_tail_event
      });
    }

    if (artifact.checkpoint_attempt.elapsed_seconds_since_tail_event <= artifact.witness_profile.witness_deadline_seconds) {
      errors.push({ code: "EG_T29_DEADLINE_NOT_EXCEEDED" });
    }

    if (artifact.checkpoint_attempt.deadline_exceeded !== true) {
      errors.push({ code: "EG_T29_CHECKPOINT_ATTEMPT_DEADLINE_FLAG_INVALID", observed: artifact.checkpoint_attempt.deadline_exceeded });
    }

    if (artifact.checkpoint_attempt.checkpoint_state_after !== "STALE") {
      errors.push({ code: "EG_T29_CHECKPOINT_NOT_STALE", observed: artifact.checkpoint_attempt.checkpoint_state_after });
    }

    if (artifact.deadline_exceeded_event.violation_type !== "TAIL_WITNESS_DEADLINE_EXCEEDED") {
      errors.push({ code: "EG_T29_VIOLATION_EVENT_TYPE_INVALID", observed: artifact.deadline_exceeded_event.violation_type });
    }

    for (const key of ["dependent_action_blocked", "dependent_promotion_blocked"]) {
      if (artifact.deadline_exceeded_event[key] !== true) {
        errors.push({ code: "EG_T29_VIOLATION_EVENT_BLOCK_MISSING", key, observed: artifact.deadline_exceeded_event[key] });
      }
    }

    for (const key of [
      "dispatch_performed",
      "external_connector_called",
      "target_receipt_created",
      "effect_evidence_created"
    ]) {
      if (artifact.deadline_exceeded_event[key] !== false) {
        errors.push({ code: "EG_T29_VIOLATION_EVENT_EFFECT_OVERCLAIM", key, observed: artifact.deadline_exceeded_event[key] });
      }
    }
  }

  for (const key of [
    "require_tail_witness_within_profile_deadline",
    "require_checkpoint_stale_after_deadline_exceeded",
    "require_dependent_action_block_when_stale",
    "require_dependent_promotion_block_when_stale",
    "require_no_second_effect"
  ]) {
    if (!artifact.witness_deadline_gate || artifact.witness_deadline_gate[key] !== true) {
      errors.push({ code: "EG_T29_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.witness_deadline_gate ? artifact.witness_deadline_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_checkpoint_fresh_after_deadline_exceeded",
    "allow_dependent_action_after_stale_checkpoint",
    "allow_dependent_promotion_after_stale_checkpoint",
    "allow_dispatch_after_stale_checkpoint",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.witness_deadline_gate || artifact.witness_deadline_gate[key] !== false) {
      errors.push({ code: "EG_T29_GATE_OVERCLAIM", key, observed: artifact.witness_deadline_gate ? artifact.witness_deadline_gate[key] : undefined });
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
      errors.push({ code: "EG_T29_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T29_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T29_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT29WitnessDeadlineExceededVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T29-WITNESS-DEADLINE-EXCEEDED-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    witness_deadline_exceeded: artifact.witness_deadline_exceeded,
    rejection_code: artifact.rejection_code,
    checkpoint_state_after: artifact.checkpoint_state_after,
    dependent_action_blocked: artifact.dependent_action_blocked,
    dependent_promotion_blocked: artifact.dependent_promotion_blocked,
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
  secondsBetween,
  createWitnessProfile,
  createUnwitnessedTailEvent,
  createCheckpointAttempt,
  createDeadlineExceededEvent,
  evaluateWitnessDeadlineExceeded,
  verifyEGT29WitnessDeadlineExceeded
};
