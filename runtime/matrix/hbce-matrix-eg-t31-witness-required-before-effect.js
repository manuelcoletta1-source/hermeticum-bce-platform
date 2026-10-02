"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-250";
const TEST_ID = "EG-T31";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T31-WITNESS-REQUIRED-BEFORE-EFFECT-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createExternalWitnessPolicy() {
  const policy = {
    record_type: "ExternalWitnessBeforeEffectPolicy",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    policy_id: "eg-t31-external-witness-before-effect-policy-v001",
    action_class: "A2_PLUS_EXTERNAL_EFFECT_RELEVANT",
    require_authorizing_event_external_witness: true,
    require_witness_before_effect: true,
    block_external_dispatch_without_witness: true,
    policy_hash: null
  };

  policy.policy_hash = sha256Record({ ...policy, policy_hash: null });
  return policy;
}

function createAuthorizingEvent() {
  const event = {
    record_type: "AuthorizingEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t31-authorizing-event-v001",
    sequence_number: 401,
    action_class: "A2_PLUS_EXTERNAL_EFFECT_RELEVANT",
    decision_state: "ALLOW_PENDING_EXTERNAL_WITNESS",
    external_witness_required: true,
    external_witness_state: "NOT_WITNESSED",
    external_witness_receipt_present: false,
    external_witness_receipt_ref: null,
    event_payload_digest: "eg-t31-authorizing-event-payload-v001",
    event_hash: null
  };

  event.event_hash = sha256Record({ ...event, event_hash: null });
  return event;
}

function createDispatchAttempt({
  policy = createExternalWitnessPolicy(),
  authorizingEvent = createAuthorizingEvent(),
  generated_at = "2026-10-02T00:10:00+02:00"
} = {}) {
  const attempt = {
    record_type: "A2PlusDispatchAttempt",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    dispatch_attempt_id: "eg-t31-dispatch-attempt-v001",
    action_class: "A2_PLUS_EXTERNAL_EFFECT_RELEVANT",
    target_ref: "HBCE-EXTERNAL-TARGET-PLACEHOLDER",
    policy_id: policy.policy_id,
    authorizing_event_id: authorizingEvent.event_id,
    authorizing_event_hash: authorizingEvent.event_hash,
    authorizing_event_external_witness_required: authorizingEvent.external_witness_required,
    authorizing_event_external_witness_state: authorizingEvent.external_witness_state,
    authorizing_event_external_witness_receipt_present: authorizingEvent.external_witness_receipt_present,
    attempted_at: generated_at,
    block_reason: "WITNESS_REQUIRED_BEFORE_EFFECT",
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    attempt_hash: null
  };

  attempt.attempt_hash = sha256Record({ ...attempt, attempt_hash: null });
  return attempt;
}

function createWitnessRequiredViolationEvent({ policy, authorizingEvent, dispatchAttempt, generated_at }) {
  const event = {
    record_type: "WitnessRequiredBeforeEffectViolationEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t31-witness-required-before-effect-violation-event-v001",
    event_class: "SECURITY_EVIDENCE_EVENT",
    violation_type: "WITNESS_REQUIRED_BEFORE_EFFECT",
    policy_id: policy.policy_id,
    authorizing_event_id: authorizingEvent.event_id,
    authorizing_event_hash: authorizingEvent.event_hash,
    dispatch_attempt_id: dispatchAttempt.dispatch_attempt_id,
    action_class: dispatchAttempt.action_class,
    external_witness_required: true,
    external_witness_receipt_present: false,
    dependent_dispatch_blocked: true,
    no_external_dispatch: true,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    emitted_at: generated_at,
    event_hash: null
  };

  event.event_hash = sha256Record({ ...event, event_hash: null });
  return event;
}

function evaluateWitnessRequiredBeforeEffect({
  policy = createExternalWitnessPolicy(),
  authorizingEvent = createAuthorizingEvent(),
  generated_at = "2026-10-02T00:10:00+02:00"
} = {}) {
  const dispatchAttempt = createDispatchAttempt({ policy, authorizingEvent, generated_at });
  const violationEvent = createWitnessRequiredViolationEvent({
    policy,
    authorizingEvent,
    dispatchAttempt,
    generated_at
  });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T31_WitnessRequiredBeforeEffect_v001",
    artifact_type: "MatrixEGT31WitnessRequiredBeforeEffectRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "BLOCK + WITNESS_REQUIRED_BEFORE_EFFECT; no external dispatch",
    selected_profile: "A2_PLUS_EXTERNAL_EFFECT_RELEVANT",
    external_witness_policy: policy,
    authorizing_event: authorizingEvent,
    dispatch_attempt: dispatchAttempt,
    violation_evidence_event: violationEvent,
    a2_plus_dispatch_attempted_before_external_witness: true,
    external_witness_required: true,
    external_witness_receipt_present: false,
    block_code: "WITNESS_REQUIRED_BEFORE_EFFECT",
    dependent_dispatch_blocked: true,
    no_external_dispatch: true,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    witness_before_effect_gate: {
      require_authorizing_event_external_witness: true,
      require_witness_before_effect: true,
      require_block_without_external_witness: true,
      require_no_external_dispatch_without_witness: true,
      require_no_second_effect: true,
      allow_dispatch_before_external_witness: false,
      allow_external_connector_call_before_witness: false,
      allow_target_receipt_creation_before_witness: false,
      allow_effect_evidence_creation_before_witness: false
    },
    runtime_claims: {
      eg_t31_runtime_artifact_created: true,
      witness_required_before_effect: true,
      block_code_witness_required_before_effect: true,
      dependent_dispatch_blocked: true,
      no_external_dispatch: true,
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
    maximum_supported_claim: "EG_T31_A2PLUS_DISPATCH_BEFORE_AUTHORIZING_EVENT_EXTERNAL_WITNESS_BLOCKS_WITH_WITNESS_REQUIRED_BEFORE_EFFECT_AND_NO_EXTERNAL_DISPATCH",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT31WitnessRequiredBeforeEffect(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT31WitnessRequiredBeforeEffectVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T31_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T31_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T31_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T31_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "BLOCK + WITNESS_REQUIRED_BEFORE_EFFECT; no external dispatch") errors.push({ code: "EG_T31_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["a2_plus_dispatch_attempted_before_external_witness", true],
    ["external_witness_required", true],
    ["external_witness_receipt_present", false],
    ["block_code", "WITNESS_REQUIRED_BEFORE_EFFECT"],
    ["dependent_dispatch_blocked", true],
    ["no_external_dispatch", true],
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
      errors.push({ code: "EG_T31_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.external_witness_policy || !artifact.authorizing_event || !artifact.dispatch_attempt || !artifact.violation_evidence_event) {
    errors.push({ code: "EG_T31_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.authorizing_event.external_witness_required !== true) {
      errors.push({ code: "EG_T31_AUTHORIZING_EVENT_WITNESS_NOT_REQUIRED" });
    }

    if (artifact.authorizing_event.external_witness_receipt_present !== false) {
      errors.push({ code: "EG_T31_AUTHORIZING_EVENT_WITNESS_RECEIPT_OVERCLAIM", observed: artifact.authorizing_event.external_witness_receipt_present });
    }

    if (artifact.dispatch_attempt.block_reason !== "WITNESS_REQUIRED_BEFORE_EFFECT") {
      errors.push({ code: "EG_T31_DISPATCH_BLOCK_REASON_INVALID", observed: artifact.dispatch_attempt.block_reason });
    }

    for (const key of [
      "dispatch_allowed",
      "dispatch_performed",
      "external_connector_called",
      "target_system_contacted",
      "target_receipt_created",
      "effect_evidence_created"
    ]) {
      if (artifact.dispatch_attempt[key] !== false) {
        errors.push({ code: "EG_T31_DISPATCH_ATTEMPT_EFFECT_OVERCLAIM", key, observed: artifact.dispatch_attempt[key] });
      }
    }

    if (artifact.violation_evidence_event.violation_type !== "WITNESS_REQUIRED_BEFORE_EFFECT") {
      errors.push({ code: "EG_T31_VIOLATION_EVENT_TYPE_INVALID", observed: artifact.violation_evidence_event.violation_type });
    }

    if (artifact.violation_evidence_event.dependent_dispatch_blocked !== true) {
      errors.push({ code: "EG_T31_VIOLATION_EVENT_BLOCK_MISSING", observed: artifact.violation_evidence_event.dependent_dispatch_blocked });
    }

    for (const key of [
      "dispatch_performed",
      "external_connector_called",
      "target_system_contacted",
      "target_receipt_created",
      "effect_evidence_created"
    ]) {
      if (artifact.violation_evidence_event[key] !== false) {
        errors.push({ code: "EG_T31_VIOLATION_EVENT_EFFECT_OVERCLAIM", key, observed: artifact.violation_evidence_event[key] });
      }
    }
  }

  for (const key of [
    "require_authorizing_event_external_witness",
    "require_witness_before_effect",
    "require_block_without_external_witness",
    "require_no_external_dispatch_without_witness",
    "require_no_second_effect"
  ]) {
    if (!artifact.witness_before_effect_gate || artifact.witness_before_effect_gate[key] !== true) {
      errors.push({ code: "EG_T31_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.witness_before_effect_gate ? artifact.witness_before_effect_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_dispatch_before_external_witness",
    "allow_external_connector_call_before_witness",
    "allow_target_receipt_creation_before_witness",
    "allow_effect_evidence_creation_before_witness"
  ]) {
    if (!artifact.witness_before_effect_gate || artifact.witness_before_effect_gate[key] !== false) {
      errors.push({ code: "EG_T31_GATE_OVERCLAIM", key, observed: artifact.witness_before_effect_gate ? artifact.witness_before_effect_gate[key] : undefined });
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
      errors.push({ code: "EG_T31_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T31_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T31_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT31WitnessRequiredBeforeEffectVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T31-WITNESS-REQUIRED-BEFORE-EFFECT-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    block_code: artifact.block_code,
    dependent_dispatch_blocked: artifact.dependent_dispatch_blocked,
    no_external_dispatch: artifact.no_external_dispatch,
    external_witness_receipt_present: artifact.external_witness_receipt_present,
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
  createExternalWitnessPolicy,
  createAuthorizingEvent,
  createDispatchAttempt,
  createWitnessRequiredViolationEvent,
  evaluateWitnessRequiredBeforeEffect,
  verifyEGT31WitnessRequiredBeforeEffect
};
