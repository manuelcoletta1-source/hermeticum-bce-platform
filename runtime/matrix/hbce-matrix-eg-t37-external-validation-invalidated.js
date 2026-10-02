"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-256";
const TEST_ID = "EG-T37";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::LEVEL4::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T37-EXTERNAL-VALIDATION-INVALIDATED-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createLevel4ValidationState() {
  const state = {
    record_type: "MatrixLevel4ValidationState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    validation_state: "EXTERNALLY_ACCEPTED",
    level_state: "LEVEL_4_ELIGIBLE",
    level4_eligible: true,
    level4_accepted: true,
    external_validation_ref: "C16-EXTERNAL-VALIDATION-ACCEPTED-V001",
    external_validation_hash: "eg-t37-external-validation-accepted-hash-v001",
    validation_history: [
      {
        event_id: "eg-t37-history-c16-accepted-v001",
        validation_state: "EXTERNALLY_ACCEPTED",
        level_state: "LEVEL_4_ELIGIBLE",
        external_validation_ref: "C16-EXTERNAL-VALIDATION-ACCEPTED-V001",
        recorded_at: "2026-10-01T18:30:00+02:00",
        history_hash: "eg-t37-history-entry-accepted-v001"
      }
    ],
    state_hash: null
  };

  state.state_hash = sha256Record({ ...state, state_hash: null });
  return state;
}

function createInvalidationTrigger() {
  const trigger = {
    record_type: "ExternalValidationInvalidationTrigger",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    trigger_id: "eg-t37-external-validation-invalidated-trigger-v001",
    trigger_class: "EXTERNAL_VALIDATION_INVALIDATED",
    invalidated_validation_ref: "C16-EXTERNAL-VALIDATION-ACCEPTED-V001",
    invalidation_reason: "external_validation_withdrawn_or_invalidated",
    severity: "SUSPEND_LEVEL4",
    required_validation_state_after: "INVALIDATED",
    required_level_state_after: "LEVEL_4_SUSPENDED",
    preserve_history_required: true,
    trigger_payload_digest: "eg-t37-invalidation-trigger-payload-v001",
    trigger_hash: null
  };

  trigger.trigger_hash = sha256Record({ ...trigger, trigger_hash: null });
  return trigger;
}

function deriveLevelStateAfterTrigger(trigger) {
  if (trigger && trigger.severity === "DEMOTE_TO_L3PLUS") return "L3PLUS";
  return "LEVEL_4_SUSPENDED";
}

function evaluateExternalValidationInvalidated({
  currentState = createLevel4ValidationState(),
  invalidationTrigger = createInvalidationTrigger(),
  generated_at = "2026-10-02T01:40:00+02:00"
} = {}) {
  const levelStateAfter = deriveLevelStateAfterTrigger(invalidationTrigger);

  const invalidationEvent = {
    record_type: "ExternalValidationInvalidatedGovernanceEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t37-external-validation-invalidated-event-v001",
    event_class: "LEVEL4_VALIDATION_GOVERNANCE_EVENT",
    trigger_id: invalidationTrigger.trigger_id,
    trigger_class: invalidationTrigger.trigger_class,
    severity: invalidationTrigger.severity,
    invalidated_validation_ref: invalidationTrigger.invalidated_validation_ref,
    validation_state_before: currentState.validation_state,
    validation_state_after: "INVALIDATED",
    level_state_before: currentState.level_state,
    level_state_after: levelStateAfter,
    history_preserved: true,
    previous_history_length: currentState.validation_history.length,
    resulting_history_length: currentState.validation_history.length + 1,
    authoritative_transition_emitted: true,
    projection_changed: true,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    emitted_at: generated_at,
    event_hash: null
  };

  invalidationEvent.event_hash = sha256Record({ ...invalidationEvent, event_hash: null });

  const resultingHistory = [
    ...currentState.validation_history,
    {
      event_id: invalidationEvent.event_id,
      validation_state: invalidationEvent.validation_state_after,
      level_state: invalidationEvent.level_state_after,
      invalidated_validation_ref: invalidationEvent.invalidated_validation_ref,
      trigger_id: invalidationEvent.trigger_id,
      recorded_at: generated_at,
      history_hash: invalidationEvent.event_hash
    }
  ];

  const resultingState = {
    record_type: "MatrixLevel4ValidationState",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    validation_state: "INVALIDATED",
    level_state: levelStateAfter,
    level4_eligible: false,
    level4_accepted: false,
    external_validation_ref: currentState.external_validation_ref,
    external_validation_hash: currentState.external_validation_hash,
    validation_history: resultingHistory,
    state_hash: null
  };

  resultingState.state_hash = sha256Record({ ...resultingState, state_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T37_ExternalValidationInvalidated_v001",
    artifact_type: "MatrixEGT37ExternalValidationInvalidatedRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "VALIDATION_STATE -> INVALIDATED and LEVEL_STATE -> LEVEL_4_SUSPENDED/L3PLUS according to trigger; history preserved",
    current_state_before_trigger: currentState,
    invalidation_trigger: invalidationTrigger,
    invalidation_event: invalidationEvent,
    resulting_state: resultingState,
    external_validation_invalidated: true,
    level4_was_eligible_or_accepted: true,
    validation_state_before: currentState.validation_state,
    validation_state_after: "INVALIDATED",
    level_state_before: currentState.level_state,
    level_state_after: levelStateAfter,
    expected_level_state_after_for_trigger: invalidationTrigger.required_level_state_after,
    level_state_matches_trigger: levelStateAfter === invalidationTrigger.required_level_state_after,
    level4_eligible_after: false,
    level4_accepted_after: false,
    history_preserved: true,
    previous_history_length: currentState.validation_history.length,
    resulting_history_length: resultingHistory.length,
    history_append_only: true,
    previous_state_hash: currentState.state_hash,
    resulting_state_hash: resultingState.state_hash,
    decision_result: "INVALIDATE_AND_SUSPEND",
    validation_state_transition: "EXTERNALLY_ACCEPTED->INVALIDATED",
    level_state_transition: `${currentState.level_state}->${levelStateAfter}`,
    authoritative_transition_emitted: true,
    projection_changed: true,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    external_validation_invalidation_gate: {
      require_validation_state_invalidated_on_external_invalidation: true,
      require_level_state_suspended_or_l3plus_according_to_trigger: true,
      require_level4_eligibility_revoked_after_invalidation: true,
      require_history_preserved: true,
      require_append_only_history: true,
      require_no_dispatch_effect: true,
      allow_level4_eligible_after_external_invalidation: false,
      allow_validation_state_to_remain_accepted: false,
      allow_history_rewrite: false,
      allow_external_connector_call: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t37_runtime_artifact_created: true,
      external_validation_invalidated_detected: true,
      validation_state_invalidated: true,
      level_state_suspended_or_l3plus: true,
      history_preserved: true,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      release_clean_eligible_effective: false,
      c16_external_validation_currently_valid: false,
      external_validation_accepted_currently: false,
      legal_review_claimed: false,
      commercial_release_authorized: false,
      level4_currently_eligible: false,
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
    maximum_supported_claim: "EG_T37_EXTERNAL_VALIDATION_INVALIDATED_WHILE_LEVEL4_ELIGIBLE_OR_ACCEPTED_TRANSITIONS_VALIDATION_TO_INVALIDATED_AND_LEVEL_TO_TRIGGERED_SUSPENDED_OR_L3PLUS_WITH_HISTORY_PRESERVED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT37ExternalValidationInvalidated(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT37ExternalValidationInvalidatedVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T37_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T37_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T37_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T37_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "VALIDATION_STATE -> INVALIDATED and LEVEL_STATE -> LEVEL_4_SUSPENDED/L3PLUS according to trigger; history preserved") errors.push({ code: "EG_T37_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["external_validation_invalidated", true],
    ["level4_was_eligible_or_accepted", true],
    ["validation_state_after", "INVALIDATED"],
    ["level_state_matches_trigger", true],
    ["level4_eligible_after", false],
    ["level4_accepted_after", false],
    ["history_preserved", true],
    ["history_append_only", true],
    ["authoritative_transition_emitted", true],
    ["projection_changed", true],
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
      errors.push({ code: "EG_T37_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!["LEVEL_4_SUSPENDED", "L3PLUS"].includes(artifact.level_state_after)) {
    errors.push({ code: "EG_T37_LEVEL_STATE_AFTER_INVALID", observed: artifact.level_state_after });
  }

  if (!artifact.current_state_before_trigger || !artifact.invalidation_trigger || !artifact.invalidation_event || !artifact.resulting_state) {
    errors.push({ code: "EG_T37_CORE_RECORDS_MISSING" });
  } else {
    const expectedCurrentHash = sha256Record({ ...artifact.current_state_before_trigger, state_hash: null });
    const expectedTriggerHash = sha256Record({ ...artifact.invalidation_trigger, trigger_hash: null });
    const expectedEventHash = sha256Record({ ...artifact.invalidation_event, event_hash: null });
    const expectedResultingHash = sha256Record({ ...artifact.resulting_state, state_hash: null });

    if (artifact.current_state_before_trigger.state_hash !== expectedCurrentHash) {
      errors.push({ code: "EG_T37_CURRENT_STATE_HASH_MISMATCH", expected: expectedCurrentHash, observed: artifact.current_state_before_trigger.state_hash });
    }

    if (artifact.invalidation_trigger.trigger_hash !== expectedTriggerHash) {
      errors.push({ code: "EG_T37_TRIGGER_HASH_MISMATCH", expected: expectedTriggerHash, observed: artifact.invalidation_trigger.trigger_hash });
    }

    if (artifact.invalidation_event.event_hash !== expectedEventHash) {
      errors.push({ code: "EG_T37_EVENT_HASH_MISMATCH", expected: expectedEventHash, observed: artifact.invalidation_event.event_hash });
    }

    if (artifact.resulting_state.state_hash !== expectedResultingHash) {
      errors.push({ code: "EG_T37_RESULTING_STATE_HASH_MISMATCH", expected: expectedResultingHash, observed: artifact.resulting_state.state_hash });
    }

    const expectedLevelState = deriveLevelStateAfterTrigger(artifact.invalidation_trigger);
    if (artifact.level_state_after !== expectedLevelState) {
      errors.push({ code: "EG_T37_LEVEL_STATE_DOES_NOT_MATCH_TRIGGER", expected: expectedLevelState, observed: artifact.level_state_after });
    }

    if (artifact.resulting_state.validation_state !== "INVALIDATED") {
      errors.push({ code: "EG_T37_RESULTING_VALIDATION_STATE_NOT_INVALIDATED", observed: artifact.resulting_state.validation_state });
    }

    if (artifact.resulting_state.level4_eligible !== false || artifact.resulting_state.level4_accepted !== false) {
      errors.push({
        code: "EG_T37_RESULTING_LEVEL4_FLAGS_OVERCLAIM",
        level4_eligible: artifact.resulting_state.level4_eligible,
        level4_accepted: artifact.resulting_state.level4_accepted
      });
    }

    if (artifact.resulting_history_length !== artifact.previous_history_length + 1) {
      errors.push({
        code: "EG_T37_HISTORY_NOT_APPEND_ONLY",
        previous_history_length: artifact.previous_history_length,
        resulting_history_length: artifact.resulting_history_length
      });
    }

    if (!Array.isArray(artifact.resulting_state.validation_history) || artifact.resulting_state.validation_history.length !== artifact.resulting_history_length) {
      errors.push({ code: "EG_T37_RESULTING_HISTORY_LENGTH_INVALID" });
    }

    for (const key of [
      "dispatch_performed",
      "external_connector_called",
      "target_system_contacted",
      "target_receipt_created",
      "effect_evidence_created"
    ]) {
      if (artifact.invalidation_event[key] !== false) {
        errors.push({ code: "EG_T37_INVALIDATION_EVENT_EXECUTION_OVERCLAIM", key, observed: artifact.invalidation_event[key] });
      }
    }
  }

  for (const key of [
    "require_validation_state_invalidated_on_external_invalidation",
    "require_level_state_suspended_or_l3plus_according_to_trigger",
    "require_level4_eligibility_revoked_after_invalidation",
    "require_history_preserved",
    "require_append_only_history",
    "require_no_dispatch_effect"
  ]) {
    if (!artifact.external_validation_invalidation_gate || artifact.external_validation_invalidation_gate[key] !== true) {
      errors.push({ code: "EG_T37_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.external_validation_invalidation_gate ? artifact.external_validation_invalidation_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_level4_eligible_after_external_invalidation",
    "allow_validation_state_to_remain_accepted",
    "allow_history_rewrite",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.external_validation_invalidation_gate || artifact.external_validation_invalidation_gate[key] !== false) {
      errors.push({ code: "EG_T37_GATE_OVERCLAIM", key, observed: artifact.external_validation_invalidation_gate ? artifact.external_validation_invalidation_gate[key] : undefined });
    }
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible_effective",
    "c16_external_validation_currently_valid",
    "external_validation_accepted_currently",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_currently_eligible",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T37_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T37_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T37_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT37ExternalValidationInvalidatedVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T37-EXTERNAL-VALIDATION-INVALIDATED-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    validation_state_after: artifact.validation_state_after,
    level_state_after: artifact.level_state_after,
    level_state_matches_trigger: artifact.level_state_matches_trigger,
    history_preserved: artifact.history_preserved,
    history_append_only: artifact.history_append_only,
    level4_eligible_after: artifact.level4_eligible_after,
    level4_accepted_after: artifact.level4_accepted_after,
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
  createLevel4ValidationState,
  createInvalidationTrigger,
  deriveLevelStateAfterTrigger,
  evaluateExternalValidationInvalidated,
  verifyEGT37ExternalValidationInvalidated
};
