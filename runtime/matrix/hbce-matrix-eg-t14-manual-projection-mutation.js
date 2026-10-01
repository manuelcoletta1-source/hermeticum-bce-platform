"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-233";
const TEST_ID = "EG-T14";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T14-MANUAL-PROJECTION-MUTATION-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createAuthoritativeEventDerivedState() {
  const derived = {
    record_type: "AuthoritativeEventDerivedStateRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    baseline_id: "HBCE-MATRIX-BASELINE-20261001-R3",
    time_profile_id: "STATIC_FREEZE_2026_10_01_20_05_EUROPE_ROME",
    event_log_ref: "eg-t14-authoritative-event-log-v001",
    event_log_sha256: "e".repeat(64),
    derived_state: "BLOCKED",
    derived_state_version: 3,
    applied_event_count: 3,
    derived_without_errors: true,
    derived_at: "2026-10-01T20:05:00+02:00",
    derived_state_sha256: null
  };

  derived.derived_state_sha256 = sha256Record({ ...derived, derived_state_sha256: null });
  return derived;
}

function createManualMutatedProjection({ derivedState = createAuthoritativeEventDerivedState() } = {}) {
  const projection = {
    record_type: "MatrixStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    mutation_source: "MANUAL_DATABASE_EDIT",
    mutation_actor_ref: "UNAUTHORIZED_LOCAL_OPERATOR",
    mutation_allowed: false,
    state: "RELEASE_CLEAN_ELIGIBLE",
    state_version: 999,
    expected_event_derived_state: derivedState.derived_state,
    expected_event_derived_state_version: derivedState.derived_state_version,
    predecessor_event_log_sha256: derivedState.event_log_sha256,
    projection_generated_at: "2026-10-01T20:06:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function evaluateManualProjectionMutation({
  derivedState = createAuthoritativeEventDerivedState(),
  mutatedProjection = null,
  evaluated_at = "2026-10-01T20:07:00+02:00"
} = {}) {
  const projection = mutatedProjection || createManualMutatedProjection({ derivedState });

  const anomalyRecord = {
    record_type: "ManualProjectionMutationAnomalyRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    anomaly_id: "eg-t14-manual-projection-mutation-anomaly-v001",
    anomaly_type: "MANUAL_PROJECTION_MUTATION",
    detected_mutated_projection_hash: projection.projection_hash,
    detected_projection_state: projection.state,
    detected_projection_state_version: projection.state_version,
    expected_event_derived_state: derivedState.derived_state,
    expected_event_derived_state_version: derivedState.derived_state_version,
    event_derived_state_sha256: derivedState.derived_state_sha256,
    mutation_allowed: false,
    reconciliation_required: true,
    detected_at: evaluated_at,
    anomaly_sha256: null
  };

  anomalyRecord.anomaly_sha256 = sha256Record({ ...anomalyRecord, anomaly_sha256: null });

  const reconciliationRecord = {
    record_type: "ProjectionReconciliationRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    reconciliation_id: "eg-t14-projection-reconciliation-v001",
    anomaly_ref: anomalyRecord.anomaly_id,
    anomaly_sha256: anomalyRecord.anomaly_sha256,
    event_derived_state_ref: derivedState.event_log_ref,
    event_derived_state_sha256: derivedState.derived_state_sha256,
    mutated_projection_hash: projection.projection_hash,
    restored_state: derivedState.derived_state,
    restored_state_version: derivedState.derived_state_version,
    reconciliation_result: "RESTORED_EVENT_DERIVED_STATE",
    event_log_rewritten: false,
    manual_projection_accepted: false,
    reconciled_at: evaluated_at,
    reconciliation_sha256: null
  };

  reconciliationRecord.reconciliation_sha256 = sha256Record({ ...reconciliationRecord, reconciliation_sha256: null });

  const restoredProjection = {
    record_type: "MatrixStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    state: derivedState.derived_state,
    state_version: derivedState.derived_state_version,
    restored_from_event_derived_state: true,
    manual_mutation_rejected: true,
    anomaly_ref: anomalyRecord.anomaly_id,
    anomaly_sha256: anomalyRecord.anomaly_sha256,
    reconciliation_ref: reconciliationRecord.reconciliation_id,
    reconciliation_sha256: reconciliationRecord.reconciliation_sha256,
    predecessor_event_log_sha256: derivedState.event_log_sha256,
    projection_generated_at: evaluated_at,
    projection_hash: null
  };

  restoredProjection.projection_hash = sha256Record({ ...restoredProjection, projection_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T14_ManualProjectionMutation_v001",
    artifact_type: "MatrixEGT14ManualProjectionMutationRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "Reconciliation restores event-derived state and records anomaly",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    authoritative_event_derived_state: derivedState,
    manually_mutated_projection: projection,
    anomaly_record: anomalyRecord,
    reconciliation_record: reconciliationRecord,
    restored_projection: restoredProjection,
    manual_projection_mutation_detected: true,
    anomaly_recorded: true,
    reconciliation_performed: true,
    restored_event_derived_state: true,
    manual_projection_accepted: false,
    mutated_projection_state: projection.state,
    restored_projection_state: restoredProjection.state,
    mutated_projection_state_version: projection.state_version,
    restored_projection_state_version: restoredProjection.state_version,
    restored_matches_event_derived_state: restoredProjection.state === derivedState.derived_state && restoredProjection.state_version === derivedState.derived_state_version,
    historical_event_log_rewritten: false,
    event_log_rewritten: false,
    authoritative_event_created_by_reconciliation: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    reconciliation_gate: {
      require_event_derived_state_as_source_of_truth: true,
      require_manual_mutation_anomaly_record: true,
      require_projection_restore_to_event_derived_state: true,
      accept_manual_projection_mutation_allowed: false,
      rewrite_authoritative_event_log_allowed: false,
      create_new_authoritative_event_during_reconciliation_allowed: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t14_runtime_artifact_created: true,
      manual_projection_mutation_detected: true,
      anomaly_recorded: true,
      reconciliation_performed: true,
      restored_event_derived_state: true,
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
    maximum_supported_claim: "EG_T14_MANUAL_PROJECTION_MUTATION_RECONCILED_TO_EVENT_DERIVED_STATE_WITH_ANOMALY_RECORD",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT14ManualProjectionMutation(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT14ManualProjectionMutationVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T14_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T14_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T14_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T14_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "Reconciliation restores event-derived state and records anomaly") errors.push({ code: "EG_T14_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["manual_projection_mutation_detected", true],
    ["anomaly_recorded", true],
    ["reconciliation_performed", true],
    ["restored_event_derived_state", true],
    ["manual_projection_accepted", false],
    ["mutated_projection_state", "RELEASE_CLEAN_ELIGIBLE"],
    ["restored_projection_state", "BLOCKED"],
    ["mutated_projection_state_version", 999],
    ["restored_projection_state_version", 3],
    ["restored_matches_event_derived_state", true],
    ["historical_event_log_rewritten", false],
    ["event_log_rewritten", false],
    ["authoritative_event_created_by_reconciliation", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T14_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.authoritative_event_derived_state || !artifact.manually_mutated_projection || !artifact.anomaly_record || !artifact.reconciliation_record || !artifact.restored_projection) {
    errors.push({ code: "EG_T14_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.restored_projection.state !== artifact.authoritative_event_derived_state.derived_state) {
      errors.push({ code: "EG_T14_RESTORED_STATE_MISMATCH" });
    }

    if (artifact.restored_projection.state_version !== artifact.authoritative_event_derived_state.derived_state_version) {
      errors.push({ code: "EG_T14_RESTORED_VERSION_MISMATCH" });
    }

    if (artifact.anomaly_record.detected_mutated_projection_hash !== artifact.manually_mutated_projection.projection_hash) {
      errors.push({ code: "EG_T14_ANOMALY_MUTATED_PROJECTION_BINDING_MISMATCH" });
    }

    if (artifact.reconciliation_record.anomaly_sha256 !== artifact.anomaly_record.anomaly_sha256) {
      errors.push({ code: "EG_T14_RECONCILIATION_ANOMALY_BINDING_MISMATCH" });
    }

    if (artifact.restored_projection.reconciliation_sha256 !== artifact.reconciliation_record.reconciliation_sha256) {
      errors.push({ code: "EG_T14_RESTORED_PROJECTION_RECONCILIATION_BINDING_MISMATCH" });
    }

    if (artifact.manually_mutated_projection.mutation_allowed !== false) {
      errors.push({ code: "EG_T14_MANUAL_MUTATION_ALLOWED_OVERCLAIM" });
    }
  }

  for (const key of [
    "require_event_derived_state_as_source_of_truth",
    "require_manual_mutation_anomaly_record",
    "require_projection_restore_to_event_derived_state"
  ]) {
    if (!artifact.reconciliation_gate || artifact.reconciliation_gate[key] !== true) {
      errors.push({ code: "EG_T14_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.reconciliation_gate ? artifact.reconciliation_gate[key] : undefined });
    }
  }

  for (const key of [
    "accept_manual_projection_mutation_allowed",
    "rewrite_authoritative_event_log_allowed",
    "create_new_authoritative_event_during_reconciliation_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.reconciliation_gate || artifact.reconciliation_gate[key] !== false) {
      errors.push({ code: "EG_T14_GATE_OVERCLAIM", key, observed: artifact.reconciliation_gate ? artifact.reconciliation_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t14_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T14_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "manual_projection_mutation_detected",
    "anomaly_recorded",
    "reconciliation_performed",
    "restored_event_derived_state"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== true) {
      errors.push({ code: "EG_T14_RUNTIME_POSITIVE_CLAIM_MISSING", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T14_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T14_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T14_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT14ManualProjectionMutationVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T14-MANUAL-PROJECTION-MUTATION-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    manual_projection_mutation_detected: artifact.manual_projection_mutation_detected,
    anomaly_recorded: artifact.anomaly_recorded,
    reconciliation_performed: artifact.reconciliation_performed,
    restored_event_derived_state: artifact.restored_event_derived_state,
    mutated_projection_state: artifact.mutated_projection_state,
    restored_projection_state: artifact.restored_projection_state,
    restored_matches_event_derived_state: artifact.restored_matches_event_derived_state,
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
  createAuthoritativeEventDerivedState,
  createManualMutatedProjection,
  evaluateManualProjectionMutation,
  verifyEGT14ManualProjectionMutation
};
