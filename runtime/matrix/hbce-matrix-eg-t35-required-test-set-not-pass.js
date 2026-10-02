"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-254";
const TEST_ID = "EG-T35";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T35-REQUIRED-TEST-SET-NOT-PASS-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createCommercialClassState() {
  const state = {
    record_type: "MatrixCommercialClassState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    commercial_class: "LC_C",
    selected_profile: "A2_EFFECT_RELEVANT_CHECKPOINT",
    required_test_set_id: "MATRIX_L1_PILOT_V2",
    required_test_set_status: "INCOMPLETE",
    required_test_set_pass: false,
    failed_or_missing_tests: [
      "EG-T35",
      "EG-T36",
      "EG-T37"
    ],
    evidence_closure_state: "OPEN",
    pilot_execution: "NOT_STARTED",
    state_hash: null
  };

  state.state_hash = sha256Record({ ...state, state_hash: null });
  return state;
}

function createPromotionRequest({ currentState = createCommercialClassState() } = {}) {
  const request = {
    record_type: "CommercialClassPromotionRequest",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_id: "eg-t35-lc-c-to-lc-b-promotion-request-v001",
    decision_scope: "D0_COMMERCIAL_OPENING",
    from_commercial_class: currentState.commercial_class,
    to_commercial_class: "LC_B",
    required_test_set_id: currentState.required_test_set_id,
    required_test_set_pass: currentState.required_test_set_pass,
    required_test_set_status: currentState.required_test_set_status,
    requested_by_actor_class: "LAUNCH_CLASS_ENGINE",
    request_payload_digest: "eg-t35-promotion-request-payload-v001",
    request_hash: null
  };

  request.request_hash = sha256Record({ ...request, request_hash: null });
  return request;
}

function evaluateRequiredTestSetNotPass({
  currentState = createCommercialClassState(),
  promotionRequest = null,
  generated_at = "2026-10-02T01:10:00+02:00"
} = {}) {
  const effectivePromotionRequest = promotionRequest || createPromotionRequest({ currentState });

  const blockEvent = {
    record_type: "RequiredTestSetNotPassBlockEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t35-required-test-set-not-pass-block-event-v001",
    event_class: "COMMERCIAL_CLASS_GOVERNANCE_EVENT",
    request_id: effectivePromotionRequest.request_id,
    decision_scope: effectivePromotionRequest.decision_scope,
    from_commercial_class: "LC_C",
    to_commercial_class_requested: "LC_B",
    decision_result: "BLOCK",
    block_code: "REQUIRED_TEST_SET_NOT_PASS",
    required_test_set_id: currentState.required_test_set_id,
    required_test_set_status: currentState.required_test_set_status,
    required_test_set_pass: false,
    failed_or_missing_tests: currentState.failed_or_missing_tests,
    class_preserved: true,
    commercial_class_after: "LC_C",
    authoritative_transition_emitted: false,
    projection_changed: false,
    emitted_at: generated_at,
    event_hash: null
  };

  blockEvent.event_hash = sha256Record({ ...blockEvent, event_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T35_RequiredTestSetNotPass_v001",
    artifact_type: "MatrixEGT35RequiredTestSetNotPassRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "BLOCK + REQUIRED_TEST_SET_NOT_PASS; class remains LC_C",
    selected_profile: "A2_EFFECT_RELEVANT_CHECKPOINT",
    current_state_before_request: currentState,
    promotion_request: effectivePromotionRequest,
    block_event: blockEvent,
    commercial_class_promotion_requested: true,
    from_commercial_class: "LC_C",
    to_commercial_class_requested: "LC_B",
    required_test_set_id: currentState.required_test_set_id,
    required_test_set_status: currentState.required_test_set_status,
    required_test_set_pass: false,
    failed_or_missing_tests: currentState.failed_or_missing_tests,
    decision_result: "BLOCK",
    block_code: "REQUIRED_TEST_SET_NOT_PASS",
    class_preserved: true,
    commercial_class_before: "LC_C",
    commercial_class_after: "LC_C",
    lc_b_granted: false,
    authoritative_transition_emitted: false,
    projection_changed: false,
    previous_state_hash: currentState.state_hash,
    resulting_state_hash: currentState.state_hash,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    required_test_set_gate: {
      require_required_test_set_pass_for_lc_b: true,
      require_block_when_required_test_set_incomplete: true,
      require_class_preserved_on_block: true,
      require_no_authoritative_transition_on_block: true,
      require_no_second_effect: true,
      allow_lc_b_without_required_test_set_pass: false,
      allow_projection_change_on_block: false,
      allow_external_connector_call: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t35_runtime_artifact_created: true,
      required_test_set_not_pass_detected: true,
      block_code_required_test_set_not_pass: true,
      class_preserved_lc_c: true,
      lc_b_granted: false,
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
    maximum_supported_claim: "EG_T35_LC_C_TO_LC_B_ATTEMPT_WITH_REQUIRED_TEST_SET_INCOMPLETE_BLOCKS_WITH_REQUIRED_TEST_SET_NOT_PASS_AND_CLASS_REMAINS_LC_C",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT35RequiredTestSetNotPass(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT35RequiredTestSetNotPassVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T35_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T35_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T35_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T35_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "BLOCK + REQUIRED_TEST_SET_NOT_PASS; class remains LC_C") errors.push({ code: "EG_T35_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["commercial_class_promotion_requested", true],
    ["from_commercial_class", "LC_C"],
    ["to_commercial_class_requested", "LC_B"],
    ["required_test_set_pass", false],
    ["decision_result", "BLOCK"],
    ["block_code", "REQUIRED_TEST_SET_NOT_PASS"],
    ["class_preserved", true],
    ["commercial_class_before", "LC_C"],
    ["commercial_class_after", "LC_C"],
    ["lc_b_granted", false],
    ["authoritative_transition_emitted", false],
    ["projection_changed", false],
    ["dispatch_allowed", false],
    ["dispatch_performed", false],
    ["external_connector_called", false],
    ["target_system_contacted", false],
    ["target_receipt_created", false],
    ["effect_evidence_created", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T35_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.current_state_before_request || !artifact.promotion_request || !artifact.block_event) {
    errors.push({ code: "EG_T35_CORE_RECORDS_MISSING" });
  } else {
    const expectedStateHash = sha256Record({ ...artifact.current_state_before_request, state_hash: null });
    if (artifact.current_state_before_request.state_hash !== expectedStateHash) {
      errors.push({ code: "EG_T35_STATE_HASH_MISMATCH", expected: expectedStateHash, observed: artifact.current_state_before_request.state_hash });
    }

    if (artifact.previous_state_hash !== artifact.resulting_state_hash) {
      errors.push({ code: "EG_T35_STATE_NOT_PRESERVED", previous: artifact.previous_state_hash, resulting: artifact.resulting_state_hash });
    }

    if (artifact.promotion_request.required_test_set_pass !== false) {
      errors.push({ code: "EG_T35_REQUEST_REQUIRED_TEST_SET_OVERCLAIM", observed: artifact.promotion_request.required_test_set_pass });
    }

    if (!Array.isArray(artifact.failed_or_missing_tests) || artifact.failed_or_missing_tests.length === 0) {
      errors.push({ code: "EG_T35_FAILED_OR_MISSING_TESTS_EMPTY" });
    }

    if (artifact.block_event.block_code !== "REQUIRED_TEST_SET_NOT_PASS") {
      errors.push({ code: "EG_T35_BLOCK_EVENT_CODE_INVALID", observed: artifact.block_event.block_code });
    }

    if (artifact.block_event.commercial_class_after !== "LC_C") {
      errors.push({ code: "EG_T35_BLOCK_EVENT_CLASS_NOT_PRESERVED", observed: artifact.block_event.commercial_class_after });
    }

    for (const key of [
      "authoritative_transition_emitted",
      "projection_changed"
    ]) {
      if (artifact.block_event[key] !== false) {
        errors.push({ code: "EG_T35_BLOCK_EVENT_OVERCLAIM", key, observed: artifact.block_event[key] });
      }
    }
  }

  for (const key of [
    "require_required_test_set_pass_for_lc_b",
    "require_block_when_required_test_set_incomplete",
    "require_class_preserved_on_block",
    "require_no_authoritative_transition_on_block",
    "require_no_second_effect"
  ]) {
    if (!artifact.required_test_set_gate || artifact.required_test_set_gate[key] !== true) {
      errors.push({ code: "EG_T35_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.required_test_set_gate ? artifact.required_test_set_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_lc_b_without_required_test_set_pass",
    "allow_projection_change_on_block",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.required_test_set_gate || artifact.required_test_set_gate[key] !== false) {
      errors.push({ code: "EG_T35_GATE_OVERCLAIM", key, observed: artifact.required_test_set_gate ? artifact.required_test_set_gate[key] : undefined });
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
      errors.push({ code: "EG_T35_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T35_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T35_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT35RequiredTestSetNotPassVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T35-REQUIRED-TEST-SET-NOT-PASS-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    block_code: artifact.block_code,
    required_test_set_pass: artifact.required_test_set_pass,
    class_preserved: artifact.class_preserved,
    commercial_class_after: artifact.commercial_class_after,
    lc_b_granted: artifact.lc_b_granted,
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
  createCommercialClassState,
  createPromotionRequest,
  evaluateRequiredTestSetNotPass,
  verifyEGT35RequiredTestSetNotPass
};
