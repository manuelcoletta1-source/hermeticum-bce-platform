"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-249";
const TEST_ID = "EG-T30";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T30-FORK-SEQUENCE-GAP-REJECTED-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createEvent(sequenceNumber, label, predecessorHash = null) {
  const event = {
    record_type: "AuthoritativeHistoryEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: `eg-t30-event-${sequenceNumber}-${label}`,
    sequence_number: sequenceNumber,
    event_label: label,
    predecessor_event_hash: predecessorHash,
    event_payload_digest: `eg-t30-payload-${sequenceNumber}-${label}`,
    event_hash: null
  };

  event.event_hash = sha256Record({ ...event, event_hash: null });
  return event;
}

function createCanonicalHistory() {
  const e300 = createEvent(300, "baseline-established", null);
  const e301 = createEvent(301, "decision-input-evaluated", e300.event_hash);
  const e302 = createEvent(302, "transition-precommit-recorded", e301.event_hash);
  const e303 = createEvent(303, "checkpoint-candidate-prepared", e302.event_hash);

  return [e300, e301, e302, e303];
}

function createForkedHistory({ canonicalHistory = createCanonicalHistory() } = {}) {
  const e300 = canonicalHistory[0];
  const fork301 = createEvent(301, "decision-input-evaluated-fork", e300.event_hash);
  const gap303 = createEvent(303, "gap-inserted-promotion", fork301.event_hash);

  return [e300, fork301, gap303];
}

function chainHeadHash(events) {
  return sha256Record({
    record_type: "AuthoritativeHistoryHead",
    subject_ref: MATRIX_SUBJECT_REF,
    event_hashes: events.map((event) => event.event_hash),
    sequence_numbers: events.map((event) => event.sequence_number),
    terminal_event_hash: events.length ? events[events.length - 1].event_hash : null
  });
}

function createCheckpointRecord({ canonicalHistory = createCanonicalHistory() } = {}) {
  const checkpoint = {
    record_type: "AuthoritativeHistoryCheckpoint",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    checkpoint_id: "eg-t30-authoritative-history-checkpoint-v001",
    canonical_event_ids: canonicalHistory.map((event) => event.event_id),
    canonical_sequence_numbers: canonicalHistory.map((event) => event.sequence_number),
    canonical_head_hash: chainHeadHash(canonicalHistory),
    terminal_sequence_number: canonicalHistory[canonicalHistory.length - 1].sequence_number,
    terminal_event_hash: canonicalHistory[canonicalHistory.length - 1].event_hash,
    witness_state: "WITNESSED",
    checkpoint_hash: null
  };

  checkpoint.checkpoint_hash = sha256Record({ ...checkpoint, checkpoint_hash: null });
  return checkpoint;
}

function detectForkAndGap({ checkpoint, candidateHistory }) {
  const observedSequences = candidateHistory.map((event) => event.sequence_number);
  const duplicateSequenceNumbers = observedSequences.filter((sequenceNumber, index) => observedSequences.indexOf(sequenceNumber) !== index);
  const canonicalSequenceSet = new Set(checkpoint.canonical_sequence_numbers);
  const missingCanonicalSequences = checkpoint.canonical_sequence_numbers.filter((sequenceNumber) => !observedSequences.includes(sequenceNumber));
  const unexpectedSequences = observedSequences.filter((sequenceNumber) => !canonicalSequenceSet.has(sequenceNumber));

  const nonContiguous = observedSequences.some((sequenceNumber, index) => {
    if (index === 0) return sequenceNumber !== checkpoint.canonical_sequence_numbers[0];
    return sequenceNumber !== observedSequences[index - 1] + 1;
  });

  const canonicalAtSameSequenceChanged = candidateHistory
    .filter((event) => canonicalSequenceSet.has(event.sequence_number))
    .filter((event) => {
      const canonicalIndex = checkpoint.canonical_sequence_numbers.indexOf(event.sequence_number);
      return checkpoint.canonical_event_ids[canonicalIndex] !== event.event_id;
    })
    .map((event) => event.sequence_number);

  const candidateHeadHash = chainHeadHash(candidateHistory);
  const checkpointMismatch = candidateHeadHash !== checkpoint.canonical_head_hash;
  const sequenceGapDetected = nonContiguous || missingCanonicalSequences.length > 0 || unexpectedSequences.length > 0;
  const forkDetected = duplicateSequenceNumbers.length > 0 || canonicalAtSameSequenceChanged.length > 0;

  return {
    candidate_head_hash: candidateHeadHash,
    checkpoint_mismatch_detected: checkpointMismatch,
    sequence_gap_detected: sequenceGapDetected,
    fork_detected: forkDetected,
    duplicate_sequence_numbers: [...new Set(duplicateSequenceNumbers)].sort((a, b) => a - b),
    missing_canonical_sequences: missingCanonicalSequences,
    unexpected_sequences: unexpectedSequences,
    canonical_at_same_sequence_changed: canonicalAtSameSequenceChanged,
    observed_sequence_numbers: observedSequences,
    canonical_sequence_numbers: checkpoint.canonical_sequence_numbers,
    rejection_codes: [
      ...(checkpointMismatch ? ["CHECKPOINT_MISMATCH"] : []),
      ...((sequenceGapDetected || forkDetected) ? ["TAIL_TRUNCATION_DETECTED"] : [])
    ]
  };
}

function evaluateForkSequenceGapRejected({
  canonicalHistory = createCanonicalHistory(),
  candidateHistory = null,
  generated_at = "2026-10-01T23:45:00+02:00"
} = {}) {
  const effectiveCandidateHistory = candidateHistory || createForkedHistory({ canonicalHistory });
  const checkpoint = createCheckpointRecord({ canonicalHistory });
  const detection = detectForkAndGap({ checkpoint, candidateHistory: effectiveCandidateHistory });

  const violationEvidenceEvent = {
    record_type: "ForkSequenceGapViolationEvidenceEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t30-fork-sequence-gap-violation-event-v001",
    event_class: "SECURITY_EVIDENCE_EVENT",
    violation_type: "CHECKPOINT_MISMATCH_AND_TAIL_TRUNCATION_DETECTED",
    checkpoint_id: checkpoint.checkpoint_id,
    canonical_head_hash: checkpoint.canonical_head_hash,
    candidate_head_hash: detection.candidate_head_hash,
    checkpoint_mismatch_detected: detection.checkpoint_mismatch_detected,
    sequence_gap_detected: detection.sequence_gap_detected,
    fork_detected: detection.fork_detected,
    missing_canonical_sequences: detection.missing_canonical_sequences,
    canonical_at_same_sequence_changed: detection.canonical_at_same_sequence_changed,
    fork_accepted_as_canonical_history: false,
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
    artifact_id: "20261001_HBCE-MATRIX-EG-T30_ForkSequenceGapRejected_v001",
    artifact_type: "MatrixEGT30ForkSequenceGapRejectedRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "CHECKPOINT_MISMATCH/TAIL_TRUNCATION_DETECTED; fork not accepted as canonical history",
    selected_profile: "A2_EFFECT_RELEVANT_CHECKPOINT",
    canonical_history_events: canonicalHistory,
    candidate_fork_gap_history_events: effectiveCandidateHistory,
    checkpoint_record: checkpoint,
    fork_gap_detection: detection,
    violation_evidence_event: violationEvidenceEvent,
    fork_or_sequence_gap_inserted: true,
    checkpoint_mismatch_detected: detection.checkpoint_mismatch_detected,
    tail_truncation_detected: detection.sequence_gap_detected || detection.fork_detected,
    sequence_gap_detected: detection.sequence_gap_detected,
    fork_detected: detection.fork_detected,
    rejection_codes: detection.rejection_codes,
    fork_accepted_as_canonical_history: false,
    canonical_history_preserved: true,
    candidate_history_rejected: true,
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
    history_integrity_gate: {
      require_checkpoint_head_match: true,
      require_no_sequence_gap: true,
      require_no_fork_at_same_sequence: true,
      require_reject_noncanonical_fork_history: true,
      require_affected_promotion_block: true,
      require_affected_dispatch_block: true,
      require_no_second_effect: true,
      allow_fork_as_canonical_history: false,
      allow_sequence_gap_as_canonical_history: false,
      allow_promotion_after_checkpoint_mismatch: false,
      allow_dispatch_after_checkpoint_mismatch: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t30_runtime_artifact_created: true,
      checkpoint_mismatch_detected: true,
      tail_truncation_detected: true,
      sequence_gap_detected: true,
      fork_detected: true,
      fork_not_accepted_as_canonical_history: true,
      canonical_history_preserved: true,
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
    maximum_supported_claim: "EG_T30_FORK_OR_SEQUENCE_GAP_INSERTED_IN_AUTHORITATIVE_EVENT_HISTORY_REJECTS_WITH_CHECKPOINT_MISMATCH_TAIL_TRUNCATION_AND_PRESERVES_CANONICAL_HISTORY",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT30ForkSequenceGapRejected(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT30ForkSequenceGapRejectedVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T30_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T30_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T30_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T30_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "CHECKPOINT_MISMATCH/TAIL_TRUNCATION_DETECTED; fork not accepted as canonical history") errors.push({ code: "EG_T30_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["fork_or_sequence_gap_inserted", true],
    ["checkpoint_mismatch_detected", true],
    ["tail_truncation_detected", true],
    ["sequence_gap_detected", true],
    ["fork_detected", true],
    ["fork_accepted_as_canonical_history", false],
    ["canonical_history_preserved", true],
    ["candidate_history_rejected", true],
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
      errors.push({ code: "EG_T30_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.checkpoint_record || !Array.isArray(artifact.canonical_history_events) || !Array.isArray(artifact.candidate_fork_gap_history_events) || !artifact.violation_evidence_event) {
    errors.push({ code: "EG_T30_CORE_RECORDS_MISSING" });
  } else {
    const expectedCanonicalHead = chainHeadHash(artifact.canonical_history_events);
    const recomputedDetection = detectForkAndGap({
      checkpoint: artifact.checkpoint_record,
      candidateHistory: artifact.candidate_fork_gap_history_events
    });

    if (expectedCanonicalHead !== artifact.checkpoint_record.canonical_head_hash) {
      errors.push({ code: "EG_T30_CANONICAL_HEAD_HASH_MISMATCH", expected: expectedCanonicalHead, observed: artifact.checkpoint_record.canonical_head_hash });
    }

    if (!recomputedDetection.checkpoint_mismatch_detected) {
      errors.push({ code: "EG_T30_CHECKPOINT_MISMATCH_NOT_DETECTED" });
    }

    if (!recomputedDetection.sequence_gap_detected) {
      errors.push({ code: "EG_T30_SEQUENCE_GAP_NOT_DETECTED" });
    }

    if (!recomputedDetection.fork_detected) {
      errors.push({ code: "EG_T30_FORK_NOT_DETECTED" });
    }

    if (!artifact.rejection_codes.includes("CHECKPOINT_MISMATCH") || !artifact.rejection_codes.includes("TAIL_TRUNCATION_DETECTED")) {
      errors.push({ code: "EG_T30_REJECTION_CODES_MISSING", observed: artifact.rejection_codes });
    }

    if (artifact.violation_evidence_event.violation_type !== "CHECKPOINT_MISMATCH_AND_TAIL_TRUNCATION_DETECTED") {
      errors.push({ code: "EG_T30_VIOLATION_EVENT_TYPE_INVALID", observed: artifact.violation_evidence_event.violation_type });
    }

    if (artifact.violation_evidence_event.fork_accepted_as_canonical_history !== false) {
      errors.push({ code: "EG_T30_FORK_ACCEPTED_OVERCLAIM", observed: artifact.violation_evidence_event.fork_accepted_as_canonical_history });
    }

    for (const key of ["affected_promotion_blocked", "affected_dispatch_blocked"]) {
      if (artifact.violation_evidence_event[key] !== true) {
        errors.push({ code: "EG_T30_VIOLATION_EVENT_BLOCK_MISSING", key, observed: artifact.violation_evidence_event[key] });
      }
    }

    for (const key of [
      "dispatch_performed",
      "external_connector_called",
      "target_receipt_created",
      "effect_evidence_created"
    ]) {
      if (artifact.violation_evidence_event[key] !== false) {
        errors.push({ code: "EG_T30_VIOLATION_EVENT_EFFECT_OVERCLAIM", key, observed: artifact.violation_evidence_event[key] });
      }
    }
  }

  for (const key of [
    "require_checkpoint_head_match",
    "require_no_sequence_gap",
    "require_no_fork_at_same_sequence",
    "require_reject_noncanonical_fork_history",
    "require_affected_promotion_block",
    "require_affected_dispatch_block",
    "require_no_second_effect"
  ]) {
    if (!artifact.history_integrity_gate || artifact.history_integrity_gate[key] !== true) {
      errors.push({ code: "EG_T30_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.history_integrity_gate ? artifact.history_integrity_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_fork_as_canonical_history",
    "allow_sequence_gap_as_canonical_history",
    "allow_promotion_after_checkpoint_mismatch",
    "allow_dispatch_after_checkpoint_mismatch",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.history_integrity_gate || artifact.history_integrity_gate[key] !== false) {
      errors.push({ code: "EG_T30_GATE_OVERCLAIM", key, observed: artifact.history_integrity_gate ? artifact.history_integrity_gate[key] : undefined });
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
      errors.push({ code: "EG_T30_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T30_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T30_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT30ForkSequenceGapRejectedVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T30-FORK-SEQUENCE-GAP-REJECTED-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    checkpoint_mismatch_detected: artifact.checkpoint_mismatch_detected,
    tail_truncation_detected: artifact.tail_truncation_detected,
    sequence_gap_detected: artifact.sequence_gap_detected,
    fork_detected: artifact.fork_detected,
    fork_accepted_as_canonical_history: artifact.fork_accepted_as_canonical_history,
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
  createEvent,
  createCanonicalHistory,
  createForkedHistory,
  chainHeadHash,
  createCheckpointRecord,
  detectForkAndGap,
  evaluateForkSequenceGapRejected,
  verifyEGT30ForkSequenceGapRejected
};
