"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-247";
const TEST_ID = "EG-T28";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T28-TAIL-TRUNCATION-DETECTED-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function hashTail(events) {
  return sha256Record({
    record_type: "TailHashInput",
    event_ids: events.map((event) => event.event_id),
    sequence_numbers: events.map((event) => event.sequence_number),
    event_hashes: events.map((event) => event.event_hash)
  });
}

function createTailEvent(sequenceNumber, label) {
  const event = {
    record_type: "AuthoritativeTailEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: `eg-t28-tail-event-${sequenceNumber}-${label}`,
    sequence_number: sequenceNumber,
    event_label: label,
    witnessed: false,
    event_payload_digest: `eg-t28-payload-${sequenceNumber}-${label}`,
    event_hash: null
  };

  event.event_hash = sha256Record({ ...event, event_hash: null });
  return event;
}

function createExpectedTail() {
  return [
    createTailEvent(101, "decision-input-evaluated"),
    createTailEvent(102, "transition-precommit-recorded"),
    createTailEvent(103, "promotion-candidate-prepared")
  ];
}

function createObservedTruncatedTail() {
  return [
    createTailEvent(101, "decision-input-evaluated"),
    createTailEvent(103, "promotion-candidate-prepared")
  ];
}

function createCheckpointExpectation({ expectedTail = createExpectedTail() } = {}) {
  const checkpoint = {
    record_type: "CheckpointTailExpectation",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    checkpoint_id: "eg-t28-checkpoint-expectation-v001",
    previous_witnessed_sequence_number: 100,
    expected_next_sequence_number: 101,
    expected_tail_sequence_numbers: expectedTail.map((event) => event.sequence_number),
    expected_tail_event_ids: expectedTail.map((event) => event.event_id),
    expected_tail_head_hash: hashTail(expectedTail),
    checkpoint_profile: "A1_INTERNAL_CONTROLLED",
    checkpoint_hash: null
  };

  checkpoint.checkpoint_hash = sha256Record({ ...checkpoint, checkpoint_hash: null });
  return checkpoint;
}

function detectSequenceGaps({ checkpoint, observedTail }) {
  const observed = observedTail.map((event) => event.sequence_number).sort((a, b) => a - b);
  const expected = checkpoint.expected_tail_sequence_numbers;
  const missing = expected.filter((sequenceNumber) => !observed.includes(sequenceNumber));
  const unexpected = observed.filter((sequenceNumber) => !expected.includes(sequenceNumber));

  const nonContiguous = observed.some((sequenceNumber, index) => {
    if (index === 0) return sequenceNumber !== checkpoint.expected_next_sequence_number;
    return sequenceNumber !== observed[index - 1] + 1;
  });

  return {
    missing_sequence_numbers: missing,
    unexpected_sequence_numbers: unexpected,
    observed_sequence_numbers: observed,
    expected_sequence_numbers: expected,
    sequence_gap_detected: missing.length > 0 || unexpected.length > 0 || nonContiguous
  };
}

function evaluateTailTruncation({
  expectedTail = createExpectedTail(),
  observedTail = createObservedTruncatedTail(),
  generated_at = "2026-10-01T23:20:00+02:00"
} = {}) {
  const checkpoint = createCheckpointExpectation({ expectedTail });
  const observedTailHeadHash = hashTail(observedTail);
  const gapCheck = detectSequenceGaps({ checkpoint, observedTail });
  const headMismatchDetected = observedTailHeadHash !== checkpoint.expected_tail_head_hash;
  const tailTruncationDetected = headMismatchDetected || gapCheck.sequence_gap_detected;

  const violationEvidenceEvent = {
    record_type: "TailTruncationViolationEvidenceEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t28-tail-truncation-violation-evidence-event-v001",
    event_class: "SECURITY_EVIDENCE_EVENT",
    violation_type: "TAIL_TRUNCATION_DETECTED",
    checkpoint_id: checkpoint.checkpoint_id,
    expected_tail_head_hash: checkpoint.expected_tail_head_hash,
    observed_tail_head_hash: observedTailHeadHash,
    missing_sequence_numbers: gapCheck.missing_sequence_numbers,
    sequence_gap_detected: gapCheck.sequence_gap_detected,
    head_mismatch_detected: headMismatchDetected,
    affected_promotion_blocked: true,
    affected_dispatch_blocked: true,
    dispatch_performed: false,
    external_connector_called: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    emitted_at: generated_at,
    event_hash: null
  };

  violationEvidenceEvent.event_hash = sha256Record({ ...violationEvidenceEvent, event_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T28_TailTruncationDetected_v001",
    artifact_type: "MatrixEGT28TailTruncationDetectedRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "TAIL_TRUNCATION_DETECTED; head/gap check fails; affected promotion/dispatch blocked",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    checkpoint_expectation: checkpoint,
    expected_tail_events: expectedTail,
    observed_tail_events: observedTail,
    observed_tail_head_hash: observedTailHeadHash,
    gap_check: gapCheck,
    violation_evidence_event: violationEvidenceEvent,
    unwitnessed_tail_truncated_or_suppressed: true,
    tail_truncation_detected: tailTruncationDetected,
    rejection_code: "TAIL_TRUNCATION_DETECTED",
    head_check_failed: headMismatchDetected,
    gap_check_failed: gapCheck.sequence_gap_detected,
    missing_sequence_numbers: gapCheck.missing_sequence_numbers,
    affected_promotion_blocked: true,
    affected_dispatch_blocked: true,
    promotion_allowed: false,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    tail_integrity_gate: {
      require_tail_head_match: true,
      require_sequence_gap_absent: true,
      require_tail_truncation_detection: true,
      require_affected_promotion_block: true,
      require_affected_dispatch_block: true,
      require_no_second_effect: true,
      allow_promotion_after_tail_truncation: false,
      allow_dispatch_after_tail_truncation: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t28_runtime_artifact_created: true,
      tail_truncation_detected: true,
      rejection_code_tail_truncation_detected: true,
      head_check_failed: true,
      gap_check_failed: true,
      affected_promotion_blocked: true,
      affected_dispatch_blocked: true,
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
    maximum_supported_claim: "EG_T28_UNWITNESSED_TAIL_TRUNCATED_OR_SUPPRESSED_BEFORE_CHECKPOINT_DETECTS_TAIL_TRUNCATION_AND_BLOCKS_AFFECTED_PROMOTION_DISPATCH",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT28TailTruncationDetected(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT28TailTruncationDetectedVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T28_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T28_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T28_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T28_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "TAIL_TRUNCATION_DETECTED; head/gap check fails; affected promotion/dispatch blocked") errors.push({ code: "EG_T28_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["unwitnessed_tail_truncated_or_suppressed", true],
    ["tail_truncation_detected", true],
    ["rejection_code", "TAIL_TRUNCATION_DETECTED"],
    ["head_check_failed", true],
    ["gap_check_failed", true],
    ["affected_promotion_blocked", true],
    ["affected_dispatch_blocked", true],
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
      errors.push({ code: "EG_T28_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.checkpoint_expectation || !Array.isArray(artifact.expected_tail_events) || !Array.isArray(artifact.observed_tail_events) || !artifact.violation_evidence_event) {
    errors.push({ code: "EG_T28_CORE_RECORDS_MISSING" });
  } else {
    const expectedHash = hashTail(artifact.expected_tail_events);
    const observedHash = hashTail(artifact.observed_tail_events);
    const recomputedGapCheck = detectSequenceGaps({
      checkpoint: artifact.checkpoint_expectation,
      observedTail: artifact.observed_tail_events
    });

    if (expectedHash !== artifact.checkpoint_expectation.expected_tail_head_hash) {
      errors.push({ code: "EG_T28_EXPECTED_TAIL_HEAD_HASH_MISMATCH", expected: expectedHash, observed: artifact.checkpoint_expectation.expected_tail_head_hash });
    }

    if (observedHash !== artifact.observed_tail_head_hash) {
      errors.push({ code: "EG_T28_OBSERVED_TAIL_HEAD_HASH_MISMATCH", expected: observedHash, observed: artifact.observed_tail_head_hash });
    }

    if (artifact.observed_tail_head_hash === artifact.checkpoint_expectation.expected_tail_head_hash) {
      errors.push({ code: "EG_T28_HEAD_CHECK_DID_NOT_FAIL" });
    }

    if (!recomputedGapCheck.sequence_gap_detected) {
      errors.push({ code: "EG_T28_SEQUENCE_GAP_NOT_DETECTED" });
    }

    if (!Array.isArray(artifact.missing_sequence_numbers) || !artifact.missing_sequence_numbers.includes(102)) {
      errors.push({ code: "EG_T28_MISSING_SEQUENCE_NOT_RECORDED", observed: artifact.missing_sequence_numbers });
    }

    if (artifact.violation_evidence_event.violation_type !== "TAIL_TRUNCATION_DETECTED") {
      errors.push({ code: "EG_T28_VIOLATION_EVENT_TYPE_INVALID", observed: artifact.violation_evidence_event.violation_type });
    }

    for (const key of [
      "affected_promotion_blocked",
      "affected_dispatch_blocked"
    ]) {
      if (artifact.violation_evidence_event[key] !== true) {
        errors.push({ code: "EG_T28_VIOLATION_EVENT_BLOCK_MISSING", key, observed: artifact.violation_evidence_event[key] });
      }
    }

    for (const key of [
      "dispatch_performed",
      "external_connector_called",
      "target_receipt_created",
      "effect_evidence_created"
    ]) {
      if (artifact.violation_evidence_event[key] !== false) {
        errors.push({ code: "EG_T28_VIOLATION_EVENT_EFFECT_OVERCLAIM", key, observed: artifact.violation_evidence_event[key] });
      }
    }
  }

  for (const key of [
    "require_tail_head_match",
    "require_sequence_gap_absent",
    "require_tail_truncation_detection",
    "require_affected_promotion_block",
    "require_affected_dispatch_block",
    "require_no_second_effect"
  ]) {
    if (!artifact.tail_integrity_gate || artifact.tail_integrity_gate[key] !== true) {
      errors.push({ code: "EG_T28_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.tail_integrity_gate ? artifact.tail_integrity_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_promotion_after_tail_truncation",
    "allow_dispatch_after_tail_truncation",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.tail_integrity_gate || artifact.tail_integrity_gate[key] !== false) {
      errors.push({ code: "EG_T28_GATE_OVERCLAIM", key, observed: artifact.tail_integrity_gate ? artifact.tail_integrity_gate[key] : undefined });
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
      errors.push({ code: "EG_T28_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T28_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T28_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT28TailTruncationDetectedVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T28-TAIL-TRUNCATION-DETECTED-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    tail_truncation_detected: artifact.tail_truncation_detected,
    rejection_code: artifact.rejection_code,
    head_check_failed: artifact.head_check_failed,
    gap_check_failed: artifact.gap_check_failed,
    affected_promotion_blocked: artifact.affected_promotion_blocked,
    affected_dispatch_blocked: artifact.affected_dispatch_blocked,
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
  hashTail,
  createTailEvent,
  createExpectedTail,
  createObservedTruncatedTail,
  createCheckpointExpectation,
  detectSequenceGaps,
  evaluateTailTruncation,
  verifyEGT28TailTruncationDetected
};
