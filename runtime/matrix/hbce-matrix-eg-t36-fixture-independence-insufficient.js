"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-255";
const TEST_ID = "EG-T36";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::VALIDATION::C09-ADVERSE-FIXTURES";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T36-FIXTURE-INDEPENDENCE-INSUFFICIENT-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createC09AdverseFixtureSet() {
  const fixtureSet = {
    record_type: "C09AdverseFixtureSet",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    fixture_set_id: "eg-t36-c09-adverse-fixture-set-v001",
    selected_profile: "A2_EFFECT_RELEVANT_CHECKPOINT",
    fixture_class: "C09_ADVERSE_FIXTURES",
    adverse_fixture_count: 4,
    required_independence_minimum: 3,
    observed_independent_fixture_count: 1,
    independence_minimum_met: false,
    dependency_clusters: [
      {
        cluster_id: "cluster-c09-shared-generator-v001",
        fixture_refs: [
          "C09-FIXTURE-001",
          "C09-FIXTURE-002",
          "C09-FIXTURE-003"
        ],
        dependency_reason: "shared_generator_and_same_source_assumption"
      },
      {
        cluster_id: "cluster-c09-independent-v001",
        fixture_refs: [
          "C09-FIXTURE-004"
        ],
        dependency_reason: "independent_source"
      }
    ],
    fixture_independence_status: "BELOW_SELECTED_PROFILE_MINIMUM",
    evidence_closure_state: "OPEN",
    fixture_set_hash: null
  };

  fixtureSet.fixture_set_hash = sha256Record({ ...fixtureSet, fixture_set_hash: null });
  return fixtureSet;
}

function createValidationRequest({ fixtureSet = createC09AdverseFixtureSet() } = {}) {
  const request = {
    record_type: "FixtureValidationRequest",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_id: "eg-t36-fixture-validation-request-v001",
    decision_scope: "C09_ADVERSE_FIXTURE_VALIDATION",
    selected_profile: fixtureSet.selected_profile,
    fixture_set_id: fixtureSet.fixture_set_id,
    required_independence_minimum: fixtureSet.required_independence_minimum,
    observed_independent_fixture_count: fixtureSet.observed_independent_fixture_count,
    independence_minimum_met: fixtureSet.independence_minimum_met,
    requested_validation_state: "VERIFIED",
    request_payload_digest: "eg-t36-fixture-validation-request-payload-v001",
    request_hash: null
  };

  request.request_hash = sha256Record({ ...request, request_hash: null });
  return request;
}

function evaluateFixtureIndependenceInsufficient({
  fixtureSet = createC09AdverseFixtureSet(),
  validationRequest = null,
  generated_at = "2026-10-02T01:25:00+02:00"
} = {}) {
  const effectiveValidationRequest = validationRequest || createValidationRequest({ fixtureSet });

  const blockEvent = {
    record_type: "FixtureIndependenceInsufficientBlockEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t36-fixture-independence-insufficient-block-event-v001",
    event_class: "VALIDATION_GOVERNANCE_EVENT",
    request_id: effectiveValidationRequest.request_id,
    decision_scope: effectiveValidationRequest.decision_scope,
    selected_profile: fixtureSet.selected_profile,
    fixture_set_id: fixtureSet.fixture_set_id,
    decision_result: "BLOCK/UNVERIFIED",
    block_code: "FIXTURE_INDEPENDENCE_INSUFFICIENT",
    validation_state_before: "UNVERIFIED",
    validation_state_after: "UNVERIFIED",
    required_independence_minimum: fixtureSet.required_independence_minimum,
    observed_independent_fixture_count: fixtureSet.observed_independent_fixture_count,
    independence_minimum_met: false,
    fixture_independence_status: fixtureSet.fixture_independence_status,
    profile_validation_granted: false,
    authoritative_transition_emitted: false,
    projection_changed: false,
    emitted_at: generated_at,
    event_hash: null
  };

  blockEvent.event_hash = sha256Record({ ...blockEvent, event_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T36_FixtureIndependenceInsufficient_v001",
    artifact_type: "MatrixEGT36FixtureIndependenceInsufficientRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "BLOCK/UNVERIFIED + FIXTURE_INDEPENDENCE_INSUFFICIENT",
    selected_profile: fixtureSet.selected_profile,
    fixture_set: fixtureSet,
    validation_request: effectiveValidationRequest,
    block_event: blockEvent,
    c09_adverse_fixtures_present: true,
    fixture_class: "C09_ADVERSE_FIXTURES",
    required_independence_minimum: fixtureSet.required_independence_minimum,
    observed_independent_fixture_count: fixtureSet.observed_independent_fixture_count,
    independence_minimum_met: false,
    fixture_independence_status: "BELOW_SELECTED_PROFILE_MINIMUM",
    decision_result: "BLOCK/UNVERIFIED",
    block_code: "FIXTURE_INDEPENDENCE_INSUFFICIENT",
    validation_state_before: "UNVERIFIED",
    validation_state_after: "UNVERIFIED",
    profile_validation_granted: false,
    authoritative_transition_emitted: false,
    projection_changed: false,
    previous_fixture_set_hash: fixtureSet.fixture_set_hash,
    resulting_fixture_set_hash: fixtureSet.fixture_set_hash,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    fixture_independence_gate: {
      require_selected_profile_independence_minimum: true,
      require_block_when_independence_below_minimum: true,
      require_validation_state_unverified_on_block: true,
      require_no_authoritative_transition_on_block: true,
      require_no_second_effect: true,
      allow_validation_when_independence_below_minimum: false,
      allow_projection_change_on_block: false,
      allow_external_connector_call: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t36_runtime_artifact_created: true,
      c09_adverse_fixture_independence_checked: true,
      fixture_independence_insufficient_detected: true,
      block_code_fixture_independence_insufficient: true,
      validation_state_unverified: true,
      profile_validation_granted: false,
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
    maximum_supported_claim: "EG_T36_C09_ADVERSE_FIXTURES_BELOW_SELECTED_PROFILE_INDEPENDENCE_MINIMUM_BLOCK_UNVERIFIED_WITH_FIXTURE_INDEPENDENCE_INSUFFICIENT",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT36FixtureIndependenceInsufficient(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT36FixtureIndependenceInsufficientVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T36_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T36_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T36_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T36_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "BLOCK/UNVERIFIED + FIXTURE_INDEPENDENCE_INSUFFICIENT") errors.push({ code: "EG_T36_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["c09_adverse_fixtures_present", true],
    ["fixture_class", "C09_ADVERSE_FIXTURES"],
    ["independence_minimum_met", false],
    ["fixture_independence_status", "BELOW_SELECTED_PROFILE_MINIMUM"],
    ["decision_result", "BLOCK/UNVERIFIED"],
    ["block_code", "FIXTURE_INDEPENDENCE_INSUFFICIENT"],
    ["validation_state_before", "UNVERIFIED"],
    ["validation_state_after", "UNVERIFIED"],
    ["profile_validation_granted", false],
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
      errors.push({ code: "EG_T36_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.fixture_set || !artifact.validation_request || !artifact.block_event) {
    errors.push({ code: "EG_T36_CORE_RECORDS_MISSING" });
  } else {
    const expectedFixtureSetHash = sha256Record({ ...artifact.fixture_set, fixture_set_hash: null });
    if (artifact.fixture_set.fixture_set_hash !== expectedFixtureSetHash) {
      errors.push({ code: "EG_T36_FIXTURE_SET_HASH_MISMATCH", expected: expectedFixtureSetHash, observed: artifact.fixture_set.fixture_set_hash });
    }

    if (!(artifact.observed_independent_fixture_count < artifact.required_independence_minimum)) {
      errors.push({
        code: "EG_T36_INDEPENDENCE_NOT_BELOW_MINIMUM",
        observed_independent_fixture_count: artifact.observed_independent_fixture_count,
        required_independence_minimum: artifact.required_independence_minimum
      });
    }

    if (artifact.validation_request.independence_minimum_met !== false) {
      errors.push({ code: "EG_T36_REQUEST_INDEPENDENCE_OVERCLAIM", observed: artifact.validation_request.independence_minimum_met });
    }

    if (artifact.previous_fixture_set_hash !== artifact.resulting_fixture_set_hash) {
      errors.push({ code: "EG_T36_FIXTURE_SET_NOT_PRESERVED", previous: artifact.previous_fixture_set_hash, resulting: artifact.resulting_fixture_set_hash });
    }

    if (artifact.block_event.block_code !== "FIXTURE_INDEPENDENCE_INSUFFICIENT") {
      errors.push({ code: "EG_T36_BLOCK_EVENT_CODE_INVALID", observed: artifact.block_event.block_code });
    }

    if (artifact.block_event.validation_state_after !== "UNVERIFIED") {
      errors.push({ code: "EG_T36_BLOCK_EVENT_VALIDATION_STATE_INVALID", observed: artifact.block_event.validation_state_after });
    }

    for (const key of [
      "profile_validation_granted",
      "authoritative_transition_emitted",
      "projection_changed"
    ]) {
      if (artifact.block_event[key] !== false) {
        errors.push({ code: "EG_T36_BLOCK_EVENT_OVERCLAIM", key, observed: artifact.block_event[key] });
      }
    }
  }

  for (const key of [
    "require_selected_profile_independence_minimum",
    "require_block_when_independence_below_minimum",
    "require_validation_state_unverified_on_block",
    "require_no_authoritative_transition_on_block",
    "require_no_second_effect"
  ]) {
    if (!artifact.fixture_independence_gate || artifact.fixture_independence_gate[key] !== true) {
      errors.push({ code: "EG_T36_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.fixture_independence_gate ? artifact.fixture_independence_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_validation_when_independence_below_minimum",
    "allow_projection_change_on_block",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.fixture_independence_gate || artifact.fixture_independence_gate[key] !== false) {
      errors.push({ code: "EG_T36_GATE_OVERCLAIM", key, observed: artifact.fixture_independence_gate ? artifact.fixture_independence_gate[key] : undefined });
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
      errors.push({ code: "EG_T36_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T36_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T36_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT36FixtureIndependenceInsufficientVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T36-FIXTURE-INDEPENDENCE-INSUFFICIENT-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    block_code: artifact.block_code,
    decision_result: artifact.decision_result,
    required_independence_minimum: artifact.required_independence_minimum,
    observed_independent_fixture_count: artifact.observed_independent_fixture_count,
    independence_minimum_met: artifact.independence_minimum_met,
    validation_state_after: artifact.validation_state_after,
    profile_validation_granted: artifact.profile_validation_granted,
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
  createC09AdverseFixtureSet,
  createValidationRequest,
  evaluateFixtureIndependenceInsufficient,
  verifyEGT36FixtureIndependenceInsufficient
};
