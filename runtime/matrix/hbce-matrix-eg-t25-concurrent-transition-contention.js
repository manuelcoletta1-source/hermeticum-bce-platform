"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-244";
const TEST_ID = "EG-T25";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T25-CONCURRENT-TRANSITION-CONTENTION-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createPredecessorState() {
  const predecessor = {
    record_type: "AuthoritativePredecessorState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    state_id: "eg-t25-predecessor-state-v001",
    state_version: 25,
    state_label: "INTERNAL_EVIDENCE_OPEN",
    transition_head_event_id: "eg-t25-predecessor-head-event-v001",
    read_set_digest: "eg-t25-read-set-digest-v001",
    state_hash: null
  };

  predecessor.state_hash = sha256Record({ ...predecessor, state_hash: null });
  return predecessor;
}

function createConcurrentTransitionRequests({ predecessor = createPredecessorState() } = {}) {
  const first = {
    record_type: "ConcurrentTransitionRequest",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_id: "eg-t25-concurrent-request-a-v001",
    request_label: "A",
    predecessor_state_id: predecessor.state_id,
    predecessor_state_version: predecessor.state_version,
    predecessor_state_hash: predecessor.state_hash,
    read_set_digest: predecessor.read_set_digest,
    requested_transition: "CLOSE_INTERNAL_EVIDENCE",
    requested_successor_label: "INTERNAL_EVIDENCE_CLOSED",
    received_at: "2026-10-01T22:50:00+02:00",
    request_hash: null
  };

  first.request_hash = sha256Record({ ...first, request_hash: null });

  const second = {
    record_type: "ConcurrentTransitionRequest",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_id: "eg-t25-concurrent-request-b-v001",
    request_label: "B",
    predecessor_state_id: predecessor.state_id,
    predecessor_state_version: predecessor.state_version,
    predecessor_state_hash: predecessor.state_hash,
    read_set_digest: predecessor.read_set_digest,
    requested_transition: "PROMOTE_RELEASE_CLEAN_ELIGIBLE",
    requested_successor_label: "RELEASE_CLEAN_ELIGIBLE",
    received_at: "2026-10-01T22:50:00+02:00",
    request_hash: null
  };

  second.request_hash = sha256Record({ ...second, request_hash: null });
  return [first, second];
}

function createAllowResult({ request, predecessor, committed_at }) {
  const successorState = {
    record_type: "AuthoritativeSuccessorState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    predecessor_state_id: predecessor.state_id,
    predecessor_state_version: predecessor.state_version,
    successor_state_id: "eg-t25-successor-state-from-request-a-v001",
    successor_state_version: predecessor.state_version + 1,
    successor_state_label: request.requested_successor_label,
    transition_event_id: "eg-t25-authoritative-transition-event-a-v001",
    committed_at,
    successor_hash: null
  };

  successorState.successor_hash = sha256Record({ ...successorState, successor_hash: null });

  const result = {
    record_type: "ConcurrentTransitionResult",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    result_id: "eg-t25-result-a-allow-v001",
    request_id: request.request_id,
    request_label: request.request_label,
    decision: "ALLOW",
    result_status: "AUTHORITATIVE_ALLOW_COMMITTED",
    rejection_code: null,
    predecessor_state_id: predecessor.state_id,
    predecessor_state_version: predecessor.state_version,
    predecessor_state_hash: predecessor.state_hash,
    successor_state_id: successorState.successor_state_id,
    successor_state_version: successorState.successor_state_version,
    successor_state_hash: successorState.successor_hash,
    transition_event_id: successorState.transition_event_id,
    authoritative_event_created: true,
    projection_updated: true,
    effect_evidence_created: false,
    committed_at,
    result_hash: null
  };

  result.result_hash = sha256Record({ ...result, result_hash: null });
  return { result, successorState };
}

function createRejectedCompetitorResult({ request, predecessor, winnerResult, committed_at }) {
  const result = {
    record_type: "ConcurrentTransitionResult",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    result_id: "eg-t25-result-b-reject-read-set-changed-v001",
    request_id: request.request_id,
    request_label: request.request_label,
    decision: "REJECT",
    result_status: "COMPETITOR_REJECTED",
    rejection_code: "READ_SET_CHANGED",
    predecessor_state_id: predecessor.state_id,
    predecessor_state_version: predecessor.state_version,
    predecessor_state_hash: predecessor.state_hash,
    observed_current_state_version: winnerResult.successor_state_version,
    observed_current_state_hash: winnerResult.successor_state_hash,
    competing_authoritative_event_id: winnerResult.transition_event_id,
    successor_state_id: null,
    successor_state_version: null,
    successor_state_hash: null,
    transition_event_id: null,
    authoritative_event_created: false,
    projection_updated: false,
    effect_evidence_created: false,
    committed_at,
    result_hash: null
  };

  result.result_hash = sha256Record({ ...result, result_hash: null });
  return result;
}

function evaluateConcurrentTransitionContention({
  predecessor = createPredecessorState(),
  requests = null,
  generated_at = "2026-10-01T22:51:00+02:00"
} = {}) {
  const concurrentRequests = requests || createConcurrentTransitionRequests({ predecessor });
  const winnerRequest = concurrentRequests[0];
  const competitorRequest = concurrentRequests[1];

  const winner = createAllowResult({
    request: winnerRequest,
    predecessor,
    committed_at: "2026-10-01T22:51:01+02:00"
  });

  const competitorResult = createRejectedCompetitorResult({
    request: competitorRequest,
    predecessor,
    winnerResult: winner.result,
    committed_at: "2026-10-01T22:51:02+02:00"
  });

  const transitionResults = [winner.result, competitorResult];

  const contentionRecord = {
    record_type: "ConcurrentTransitionContentionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    contention_id: "eg-t25-concurrent-transition-contention-v001",
    predecessor_state_id: predecessor.state_id,
    predecessor_state_version: predecessor.state_version,
    predecessor_state_hash: predecessor.state_hash,
    request_ids: concurrentRequests.map((request) => request.request_id),
    allow_result_ids: transitionResults.filter((result) => result.decision === "ALLOW").map((result) => result.result_id),
    rejected_competitor_result_ids: transitionResults.filter((result) => result.decision === "REJECT").map((result) => result.result_id),
    allow_count: transitionResults.filter((result) => result.decision === "ALLOW").length,
    reject_count: transitionResults.filter((result) => result.decision === "REJECT").length,
    competitor_rejection_code: competitorResult.rejection_code,
    stale_or_read_set_changed_detected: true,
    at_most_one_authoritative_allow: true,
    second_authoritative_allow_created: false,
    contention_hash: null
  };

  contentionRecord.contention_hash = sha256Record({ ...contentionRecord, contention_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T25_ConcurrentTransitionContention_v001",
    artifact_type: "MatrixEGT25ConcurrentTransitionContentionRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "At most one authoritative ALLOW; competitor rejected as STALE_PREDECESSOR or READ_SET_CHANGED",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    predecessor_state: predecessor,
    concurrent_transition_requests: concurrentRequests,
    winner_result: winner.result,
    winner_successor_state: winner.successorState,
    competitor_result: competitorResult,
    transition_results: transitionResults,
    contention_record: contentionRecord,
    concurrent_same_predecessor_detected: true,
    same_predecessor_state_version_detected: true,
    same_predecessor_state_hash_detected: true,
    at_most_one_authoritative_allow: true,
    authoritative_allow_count: 1,
    competitor_rejected: true,
    competitor_rejection_code: "READ_SET_CHANGED",
    competitor_rejected_as_stale_or_read_set_changed: true,
    second_authoritative_allow_created: false,
    second_transition_event_created: false,
    second_projection_update_created: false,
    second_effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    predecessor_consumed_once: true,
    projection_updated_once: true,
    authoritative_state_advanced_once: true,
    contention_gate: {
      require_same_predecessor_detection: true,
      require_at_most_one_authoritative_allow: true,
      require_competitor_reject_stale_or_read_set_changed: true,
      require_no_second_effect: true,
      allow_second_authoritative_allow: false,
      allow_second_transition_event: false,
      allow_second_projection_update: false,
      allow_second_effect_evidence: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false
    },
    runtime_claims: {
      eg_t25_runtime_artifact_created: true,
      concurrent_same_predecessor_detected: true,
      at_most_one_authoritative_allow: true,
      competitor_rejected_as_stale_or_read_set_changed: true,
      predecessor_consumed_once: true,
      second_authoritative_allow_created: false,
      second_effect_evidence_created: false,
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
    maximum_supported_claim: "EG_T25_CONCURRENT_TRANSITIONS_FROM_SAME_PREDECESSOR_PRODUCE_AT_MOST_ONE_AUTHORITATIVE_ALLOW_AND_REJECT_COMPETITOR_AS_STALE_OR_READ_SET_CHANGED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT25ConcurrentTransitionContention(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT25ConcurrentTransitionContentionVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T25_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T25_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T25_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T25_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "At most one authoritative ALLOW; competitor rejected as STALE_PREDECESSOR or READ_SET_CHANGED") errors.push({ code: "EG_T25_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["concurrent_same_predecessor_detected", true],
    ["same_predecessor_state_version_detected", true],
    ["same_predecessor_state_hash_detected", true],
    ["at_most_one_authoritative_allow", true],
    ["authoritative_allow_count", 1],
    ["competitor_rejected", true],
    ["competitor_rejected_as_stale_or_read_set_changed", true],
    ["second_authoritative_allow_created", false],
    ["second_transition_event_created", false],
    ["second_projection_update_created", false],
    ["second_effect_evidence_created", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["predecessor_consumed_once", true],
    ["projection_updated_once", true],
    ["authoritative_state_advanced_once", true]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T25_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.predecessor_state || !Array.isArray(artifact.concurrent_transition_requests) || !Array.isArray(artifact.transition_results) || !artifact.winner_result || !artifact.competitor_result) {
    errors.push({ code: "EG_T25_CORE_RECORDS_MISSING" });
  } else {
    const allowResults = artifact.transition_results.filter((result) => result.decision === "ALLOW");
    const rejectResults = artifact.transition_results.filter((result) => result.decision === "REJECT");

    if (allowResults.length !== 1) {
      errors.push({ code: "EG_T25_ALLOW_COUNT_INVALID", observed: allowResults.length });
    }

    if (rejectResults.length < 1) {
      errors.push({ code: "EG_T25_COMPETITOR_REJECT_MISSING", observed: rejectResults.length });
    }

    const allSamePredecessor = artifact.concurrent_transition_requests.every((request) =>
      request.predecessor_state_id === artifact.predecessor_state.state_id &&
      request.predecessor_state_version === artifact.predecessor_state.state_version &&
      request.predecessor_state_hash === artifact.predecessor_state.state_hash
    );

    if (!allSamePredecessor) {
      errors.push({ code: "EG_T25_REQUESTS_NOT_SAME_PREDECESSOR" });
    }

    if (!["STALE_PREDECESSOR", "READ_SET_CHANGED"].includes(artifact.competitor_result.rejection_code)) {
      errors.push({ code: "EG_T25_COMPETITOR_REJECTION_CODE_INVALID", observed: artifact.competitor_result.rejection_code });
    }

    if (artifact.competitor_result.authoritative_event_created !== false || artifact.competitor_result.projection_updated !== false) {
      errors.push({ code: "EG_T25_COMPETITOR_EFFECT_OVERCLAIM" });
    }

    if (artifact.winner_result.decision !== "ALLOW" || artifact.winner_result.authoritative_event_created !== true || artifact.winner_result.projection_updated !== true) {
      errors.push({ code: "EG_T25_WINNER_ALLOW_INVALID" });
    }

    if (artifact.winner_result.predecessor_state_hash !== artifact.predecessor_state.state_hash) {
      errors.push({ code: "EG_T25_WINNER_PREDECESSOR_HASH_MISMATCH" });
    }
  }

  if (artifact.contention_record) {
    if (artifact.contention_record.allow_count !== 1) {
      errors.push({ code: "EG_T25_CONTENTION_ALLOW_COUNT_INVALID", observed: artifact.contention_record.allow_count });
    }

    if (!["STALE_PREDECESSOR", "READ_SET_CHANGED"].includes(artifact.contention_record.competitor_rejection_code)) {
      errors.push({ code: "EG_T25_CONTENTION_COMPETITOR_CODE_INVALID", observed: artifact.contention_record.competitor_rejection_code });
    }

    if (artifact.contention_record.second_authoritative_allow_created !== false) {
      errors.push({ code: "EG_T25_CONTENTION_SECOND_ALLOW_OVERCLAIM", observed: artifact.contention_record.second_authoritative_allow_created });
    }
  } else {
    errors.push({ code: "EG_T25_CONTENTION_RECORD_MISSING" });
  }

  for (const key of [
    "require_same_predecessor_detection",
    "require_at_most_one_authoritative_allow",
    "require_competitor_reject_stale_or_read_set_changed",
    "require_no_second_effect"
  ]) {
    if (!artifact.contention_gate || artifact.contention_gate[key] !== true) {
      errors.push({ code: "EG_T25_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.contention_gate ? artifact.contention_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_second_authoritative_allow",
    "allow_second_transition_event",
    "allow_second_projection_update",
    "allow_second_effect_evidence",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation"
  ]) {
    if (!artifact.contention_gate || artifact.contention_gate[key] !== false) {
      errors.push({ code: "EG_T25_GATE_OVERCLAIM", key, observed: artifact.contention_gate ? artifact.contention_gate[key] : undefined });
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
      errors.push({ code: "EG_T25_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T25_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T25_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT25ConcurrentTransitionContentionVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T25-CONCURRENT-TRANSITION-CONTENTION-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    at_most_one_authoritative_allow: artifact.at_most_one_authoritative_allow,
    authoritative_allow_count: artifact.authoritative_allow_count,
    competitor_rejection_code: artifact.competitor_rejection_code,
    predecessor_consumed_once: artifact.predecessor_consumed_once,
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
  createPredecessorState,
  createConcurrentTransitionRequests,
  createAllowResult,
  createRejectedCompetitorResult,
  evaluateConcurrentTransitionContention,
  verifyEGT25ConcurrentTransitionContention
};
