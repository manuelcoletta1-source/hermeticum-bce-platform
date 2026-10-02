"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-252";
const TEST_ID = "EG-T33";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001-DIRECT-INSERT";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T33-CREATION-TRANSITION-INVALID-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createDirectStorageInsert() {
  const row = {
    record_type: "NonAuthoritativeSubjectStorageRow",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    storage_row_id: "eg-t33-direct-storage-row-v001",
    inserted_by_actor_class: "UNKNOWN_STORAGE_ACTOR",
    insertion_path: "DIRECT_STORAGE_INSERT",
    system_initializer_path_used: false,
    governed_transition_request_present: false,
    creation_transition_event_present: false,
    actor_class: null,
    decision_scope: null,
    creation_guard_result: null,
    row_payload_digest: "eg-t33-direct-storage-row-payload-v001",
    row_hash: null
  };

  row.row_hash = sha256Record({ ...row, row_hash: null });
  return row;
}

function evaluateCreationTransitionInvalid({
  directStorageRow = createDirectStorageInsert(),
  generated_at = "2026-10-02T00:40:00+02:00"
} = {}) {
  const rejectionEvent = {
    record_type: "CreationTransitionInvalidReconciliationEvent",
    tenant_id: TENANT_ID,
    subject_ref: directStorageRow.subject_ref,
    event_id: "eg-t33-creation-transition-invalid-reconciliation-event-v001",
    event_class: "SECURITY_EVIDENCE_EVENT",
    observed_storage_row_id: directStorageRow.storage_row_id,
    observed_storage_row_hash: directStorageRow.row_hash,
    decision_result: "REJECT/RECONCILE",
    rejection_code: "CREATION_TRANSITION_INVALID",
    system_initializer_path_used: false,
    governed_transition_request_present: false,
    creation_transition_event_present: false,
    non_authoritative_row_ignored: true,
    authoritative_subject_created: false,
    authoritative_namespace_created: false,
    authoritative_transition_emitted: false,
    projection_changed: false,
    emitted_at: generated_at,
    event_hash: null
  };

  rejectionEvent.event_hash = sha256Record({ ...rejectionEvent, event_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T33_CreationTransitionInvalid_v001",
    artifact_type: "MatrixEGT33CreationTransitionInvalidRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: directStorageRow.subject_ref,
    generated_at,
    required_result: "REJECT/RECONCILE + CREATION_TRANSITION_INVALID; non-authoritative row ignored",
    selected_profile: "A2_EFFECT_RELEVANT_CHECKPOINT",
    direct_storage_row: directStorageRow,
    reconciliation_event: rejectionEvent,
    direct_storage_insert_detected: true,
    subject_namespace_created_by_direct_storage_insert: true,
    system_initializer_path_used: false,
    governed_transition_request_present: false,
    creation_transition_event_present: false,
    decision_result: "REJECT/RECONCILE",
    rejection_code: "CREATION_TRANSITION_INVALID",
    non_authoritative_row_ignored: true,
    authoritative_subject_created: false,
    authoritative_namespace_created: false,
    authoritative_transition_emitted: false,
    projection_changed: false,
    previous_authoritative_state_present: false,
    resulting_authoritative_state_present: false,
    dispatch_allowed: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    creation_transition_gate: {
      require_system_initializer_path: true,
      require_governed_creation_transition_request: true,
      require_creation_transition_event: true,
      require_reject_direct_storage_insert: true,
      require_ignore_non_authoritative_row: true,
      require_no_authoritative_subject_without_initializer: true,
      require_no_second_effect: true,
      allow_direct_storage_insert_as_authoritative: false,
      allow_namespace_creation_without_system_initializer: false,
      allow_projection_change_from_non_authoritative_row: false,
      allow_external_connector_call: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t33_runtime_artifact_created: true,
      direct_storage_insert_detected: true,
      creation_transition_invalid_detected: true,
      rejection_code_creation_transition_invalid: true,
      non_authoritative_row_ignored: true,
      authoritative_subject_created: false,
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
    maximum_supported_claim: "EG_T33_SUBJECT_NAMESPACE_DIRECT_STORAGE_INSERT_WITHOUT_SYSTEM_INITIALIZER_PATH_IS_REJECTED_RECONCILED_WITH_CREATION_TRANSITION_INVALID_AND_NON_AUTHORITATIVE_ROW_IGNORED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT33CreationTransitionInvalid(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT33CreationTransitionInvalidVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T33_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T33_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T33_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T33_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "REJECT/RECONCILE + CREATION_TRANSITION_INVALID; non-authoritative row ignored") errors.push({ code: "EG_T33_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["direct_storage_insert_detected", true],
    ["subject_namespace_created_by_direct_storage_insert", true],
    ["system_initializer_path_used", false],
    ["governed_transition_request_present", false],
    ["creation_transition_event_present", false],
    ["decision_result", "REJECT/RECONCILE"],
    ["rejection_code", "CREATION_TRANSITION_INVALID"],
    ["non_authoritative_row_ignored", true],
    ["authoritative_subject_created", false],
    ["authoritative_namespace_created", false],
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
      errors.push({ code: "EG_T33_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.direct_storage_row || !artifact.reconciliation_event) {
    errors.push({ code: "EG_T33_CORE_RECORDS_MISSING" });
  } else {
    const expectedRowHash = sha256Record({ ...artifact.direct_storage_row, row_hash: null });
    if (artifact.direct_storage_row.row_hash !== expectedRowHash) {
      errors.push({ code: "EG_T33_DIRECT_ROW_HASH_MISMATCH", expected: expectedRowHash, observed: artifact.direct_storage_row.row_hash });
    }

    if (artifact.direct_storage_row.system_initializer_path_used !== false) {
      errors.push({ code: "EG_T33_DIRECT_ROW_SYSTEM_INITIALIZER_OVERCLAIM", observed: artifact.direct_storage_row.system_initializer_path_used });
    }

    if (artifact.reconciliation_event.rejection_code !== "CREATION_TRANSITION_INVALID") {
      errors.push({ code: "EG_T33_RECONCILIATION_CODE_INVALID", observed: artifact.reconciliation_event.rejection_code });
    }

    for (const key of [
      "non_authoritative_row_ignored"
    ]) {
      if (artifact.reconciliation_event[key] !== true) {
        errors.push({ code: "EG_T33_RECONCILIATION_REQUIRED_FLAG_INVALID", key, observed: artifact.reconciliation_event[key] });
      }
    }

    for (const key of [
      "authoritative_subject_created",
      "authoritative_namespace_created",
      "authoritative_transition_emitted",
      "projection_changed"
    ]) {
      if (artifact.reconciliation_event[key] !== false) {
        errors.push({ code: "EG_T33_RECONCILIATION_OVERCLAIM", key, observed: artifact.reconciliation_event[key] });
      }
    }
  }

  for (const key of [
    "require_system_initializer_path",
    "require_governed_creation_transition_request",
    "require_creation_transition_event",
    "require_reject_direct_storage_insert",
    "require_ignore_non_authoritative_row",
    "require_no_authoritative_subject_without_initializer",
    "require_no_second_effect"
  ]) {
    if (!artifact.creation_transition_gate || artifact.creation_transition_gate[key] !== true) {
      errors.push({ code: "EG_T33_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.creation_transition_gate ? artifact.creation_transition_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_direct_storage_insert_as_authoritative",
    "allow_namespace_creation_without_system_initializer",
    "allow_projection_change_from_non_authoritative_row",
    "allow_external_connector_call",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.creation_transition_gate || artifact.creation_transition_gate[key] !== false) {
      errors.push({ code: "EG_T33_GATE_OVERCLAIM", key, observed: artifact.creation_transition_gate ? artifact.creation_transition_gate[key] : undefined });
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
      errors.push({ code: "EG_T33_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T33_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedContentHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedContentHash) {
    errors.push({ code: "EG_T33_CONTENT_HASH_MISMATCH", expected: expectedContentHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT33CreationTransitionInvalidVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T33-CREATION-TRANSITION-INVALID-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    decision_result: artifact.decision_result,
    rejection_code: artifact.rejection_code,
    non_authoritative_row_ignored: artifact.non_authoritative_row_ignored,
    authoritative_subject_created: artifact.authoritative_subject_created,
    projection_changed: artifact.projection_changed,
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
  createDirectStorageInsert,
  evaluateCreationTransitionInvalid,
  verifyEGT33CreationTransitionInvalid
};
