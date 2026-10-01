"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-231";
const TEST_ID = "EG-T12";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const TENANT_ID = "HBCE_INTERNAL";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T12-EVIDENCE-INVALIDATED-AFTER-PASS-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createHistoricalPassRecord() {
  const record = {
    record_type: "HistoricalPassDecisionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    decision_record_id: "decision-eg-t12-historical-pass-v001",
    decision_scope: "INTERNAL_RELEASE_CLEAN_ELIGIBILITY_TRANSITION",
    decision_result: "PASS",
    validation_result: "VERIFIED",
    reason_code: "COMPLETE_GUARDS_AND_EVIDENCE",
    evidence_bundle_ref: "eg-t12-required-evidence-bundle-v001",
    evidence_bundle_sha256: "b".repeat(64),
    resulting_state: "RELEASE_CLEAN_ELIGIBLE",
    resulting_state_version: 5,
    decided_at: "2026-10-01T19:45:00+02:00",
    historical_pass_sha256: null
  };

  record.historical_pass_sha256 = sha256Record({ ...record, historical_pass_sha256: null });
  return record;
}

function createPriorEffectiveProjection({ historicalPass = createHistoricalPassRecord() } = {}) {
  const projection = {
    record_type: "MatrixEffectiveStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    state: historicalPass.resulting_state,
    state_version: historicalPass.resulting_state_version,
    effective_from_decision_record_id: historicalPass.decision_record_id,
    effective_from_decision_record_sha256: historicalPass.historical_pass_sha256,
    effective_status: "PASS_EFFECTIVE",
    projection_generated_at: "2026-10-01T19:46:00+02:00",
    projection_hash: null
  };

  projection.projection_hash = sha256Record({ ...projection, projection_hash: null });
  return projection;
}

function createEvidenceInvalidationRecord({ historicalPass = createHistoricalPassRecord() } = {}) {
  const invalidation = {
    record_type: "RequiredEvidenceInvalidationRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    invalidation_id: "eg-t12-required-evidence-invalidation-v001",
    invalidated_evidence_bundle_ref: historicalPass.evidence_bundle_ref,
    invalidated_evidence_bundle_sha256: historicalPass.evidence_bundle_sha256,
    invalidated_control_ids: [
      "C05_EVIDENCE_PRESENT",
      "C06_HASHES_VALID"
    ],
    invalidation_reason_code: "REQUIRED_EVIDENCE_INVALIDATED_AFTER_PASS",
    invalidation_source: "INTERNAL_CONTROLLED_REVIEW",
    invalidation_effect: "EFFECTIVE_STATE_MUST_BE_RECOMPUTED",
    historical_record_mutation_allowed: false,
    detected_at: "2026-10-01T19:47:00+02:00",
    invalidation_sha256: null
  };

  invalidation.invalidation_sha256 = sha256Record({ ...invalidation, invalidation_sha256: null });
  return invalidation;
}

function evaluateEvidenceInvalidatedAfterPass({
  historicalPass = createHistoricalPassRecord(),
  priorProjection = null,
  invalidationRecord = null,
  evaluated_at = "2026-10-01T19:48:00+02:00"
} = {}) {
  const prior = priorProjection || createPriorEffectiveProjection({ historicalPass });
  const invalidation = invalidationRecord || createEvidenceInvalidationRecord({ historicalPass });

  const recomputationRecord = {
    record_type: "EffectiveStateRecomputationRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    recomputation_id: "eg-t12-effective-state-recomputation-v001",
    historical_pass_ref: historicalPass.decision_record_id,
    historical_pass_sha256: historicalPass.historical_pass_sha256,
    invalidation_ref: invalidation.invalidation_id,
    invalidation_sha256: invalidation.invalidation_sha256,
    previous_effective_state: prior.state,
    recomputed_effective_state: "BLOCKED",
    previous_effective_state_version: prior.state_version,
    recomputed_effective_state_version: prior.state_version + 1,
    recomputation_result: "REGRESSED",
    effective_validation_result: "UNVERIFIED",
    effective_reason_code: "REQUIRED_EVIDENCE_INVALIDATED",
    historical_pass_preserved: true,
    recomputed_at: evaluated_at,
    recomputation_sha256: null
  };

  recomputationRecord.recomputation_sha256 = sha256Record({ ...recomputationRecord, recomputation_sha256: null });

  const regressionEvent = {
    event_id: "effective-state-regression-eg-t12-v001",
    event_type: "EffectiveStateRegressionEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    historical_pass_ref: historicalPass.decision_record_id,
    historical_pass_sha256: historicalPass.historical_pass_sha256,
    invalidation_ref: invalidation.invalidation_id,
    invalidation_sha256: invalidation.invalidation_sha256,
    recomputation_ref: recomputationRecord.recomputation_id,
    recomputation_sha256: recomputationRecord.recomputation_sha256,
    from_effective_state: prior.state,
    to_effective_state: recomputationRecord.recomputed_effective_state,
    from_effective_state_version: prior.state_version,
    to_effective_state_version: prior.state_version + 1,
    decision_result: "REGRESS_EFFECTIVE_STATE",
    validation_result: "UNVERIFIED",
    reason_code: "REQUIRED_EVIDENCE_INVALIDATED",
    emitted_at: evaluated_at,
    event_hash: null
  };

  regressionEvent.event_hash = sha256Record({ ...regressionEvent, event_hash: null });

  const resultingProjection = {
    record_type: "MatrixEffectiveStateProjectionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    namespace: "RELEASE_STATE",
    state: "BLOCKED",
    state_version: prior.state_version + 1,
    effective_from_decision_record_id: historicalPass.decision_record_id,
    effective_from_decision_record_sha256: historicalPass.historical_pass_sha256,
    effective_status: "REGRESSED_AFTER_EVIDENCE_INVALIDATION",
    predecessor_projection_hash: prior.projection_hash,
    predecessor_event_id: regressionEvent.event_id,
    predecessor_event_sha256: regressionEvent.event_hash,
    projection_generated_at: evaluated_at,
    projection_hash: null
  };

  resultingProjection.projection_hash = sha256Record({ ...resultingProjection, projection_hash: null });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T12_EvidenceInvalidatedAfterPass_v001",
    artifact_type: "MatrixEGT12EvidenceInvalidatedAfterPassRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at: evaluated_at,
    required_result: "Effective state recomputed/regressed; historical PASS preserved",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    historical_pass_record: historicalPass,
    prior_effective_state_projection: prior,
    evidence_invalidation_record: invalidation,
    effective_state_recomputation_record: recomputationRecord,
    regression_event: regressionEvent,
    resulting_effective_state_projection: resultingProjection,
    historical_decision_result: "PASS",
    historical_validation_result: "VERIFIED",
    historical_reason_code: "COMPLETE_GUARDS_AND_EVIDENCE",
    historical_pass_preserved: true,
    historical_pass_mutated: false,
    historical_event_log_rewritten: false,
    evidence_invalidation_detected: true,
    required_evidence_invalidated: true,
    effective_state_recomputed: true,
    effective_state_regressed: true,
    effective_decision_result: "REGRESS_EFFECTIVE_STATE",
    effective_validation_result: "UNVERIFIED",
    effective_reason_code: "REQUIRED_EVIDENCE_INVALIDATED",
    previous_effective_state: prior.state,
    resulting_effective_state: resultingProjection.state,
    previous_effective_state_version: prior.state_version,
    resulting_effective_state_version: resultingProjection.state_version,
    effective_state_changed: true,
    effective_state_version_changed: true,
    regression_event_emitted: true,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    target_receipt_created: false,
    execution_effect_created: false,
    invalidation_gate: {
      preserve_historical_pass_required: true,
      recompute_effective_state_required: true,
      regress_effective_state_on_required_evidence_invalidation: true,
      mutate_historical_pass_allowed: false,
      rewrite_historical_event_log_allowed: false,
      keep_effective_pass_after_required_evidence_invalidation_allowed: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t12_runtime_artifact_created: true,
      evidence_invalidation_detected: true,
      required_evidence_invalidated: true,
      effective_state_recomputed: true,
      effective_state_regressed: true,
      historical_pass_preserved: true,
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
    maximum_supported_claim: "EG_T12_REQUIRED_EVIDENCE_INVALIDATION_REGRESSED_EFFECTIVE_STATE_HISTORICAL_PASS_PRESERVED",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT12EvidenceInvalidatedAfterPass(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT12EvidenceInvalidatedAfterPassVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T12_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T12_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T12_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T12_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "Effective state recomputed/regressed; historical PASS preserved") errors.push({ code: "EG_T12_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["historical_decision_result", "PASS"],
    ["historical_validation_result", "VERIFIED"],
    ["historical_pass_preserved", true],
    ["historical_pass_mutated", false],
    ["historical_event_log_rewritten", false],
    ["evidence_invalidation_detected", true],
    ["required_evidence_invalidated", true],
    ["effective_state_recomputed", true],
    ["effective_state_regressed", true],
    ["effective_decision_result", "REGRESS_EFFECTIVE_STATE"],
    ["effective_validation_result", "UNVERIFIED"],
    ["effective_reason_code", "REQUIRED_EVIDENCE_INVALIDATED"],
    ["previous_effective_state", "RELEASE_CLEAN_ELIGIBLE"],
    ["resulting_effective_state", "BLOCKED"],
    ["effective_state_changed", true],
    ["effective_state_version_changed", true],
    ["regression_event_emitted", true],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false],
    ["target_receipt_created", false],
    ["execution_effect_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T12_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.historical_pass_record || !artifact.evidence_invalidation_record || !artifact.effective_state_recomputation_record || !artifact.regression_event || !artifact.resulting_effective_state_projection) {
    errors.push({ code: "EG_T12_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.evidence_invalidation_record.historical_record_mutation_allowed !== false) {
      errors.push({ code: "EG_T12_HISTORICAL_MUTATION_ALLOWED_OVERCLAIM" });
    }

    if (artifact.effective_state_recomputation_record.historical_pass_sha256 !== artifact.historical_pass_record.historical_pass_sha256) {
      errors.push({ code: "EG_T12_RECOMPUTATION_HISTORICAL_PASS_BINDING_MISMATCH" });
    }

    if (artifact.regression_event.invalidation_sha256 !== artifact.evidence_invalidation_record.invalidation_sha256) {
      errors.push({ code: "EG_T12_REGRESSION_EVENT_INVALIDATION_BINDING_MISMATCH" });
    }

    if (artifact.resulting_effective_state_projection.predecessor_event_sha256 !== artifact.regression_event.event_hash) {
      errors.push({ code: "EG_T12_PROJECTION_REGRESSION_EVENT_BINDING_MISMATCH" });
    }

    if (artifact.resulting_effective_state_projection.state !== "BLOCKED") {
      errors.push({ code: "EG_T12_RESULTING_EFFECTIVE_STATE_INVALID", observed: artifact.resulting_effective_state_projection.state });
    }

    if (artifact.resulting_effective_state_projection.state_version !== artifact.prior_effective_state_projection.state_version + 1) {
      errors.push({
        code: "EG_T12_RESULTING_EFFECTIVE_VERSION_INVALID",
        prior: artifact.prior_effective_state_projection.state_version,
        resulting: artifact.resulting_effective_state_projection.state_version
      });
    }
  }

  for (const key of [
    "preserve_historical_pass_required",
    "recompute_effective_state_required",
    "regress_effective_state_on_required_evidence_invalidation"
  ]) {
    if (!artifact.invalidation_gate || artifact.invalidation_gate[key] !== true) {
      errors.push({ code: "EG_T12_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.invalidation_gate ? artifact.invalidation_gate[key] : undefined });
    }
  }

  for (const key of [
    "mutate_historical_pass_allowed",
    "rewrite_historical_event_log_allowed",
    "keep_effective_pass_after_required_evidence_invalidation_allowed",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.invalidation_gate || artifact.invalidation_gate[key] !== false) {
      errors.push({ code: "EG_T12_GATE_OVERCLAIM", key, observed: artifact.invalidation_gate ? artifact.invalidation_gate[key] : undefined });
    }
  }

  if (!artifact.runtime_claims || artifact.runtime_claims.eg_t12_runtime_artifact_created !== true) {
    errors.push({ code: "EG_T12_RUNTIME_ARTIFACT_CREATED_FLAG_MISSING" });
  }

  for (const key of [
    "evidence_invalidation_detected",
    "required_evidence_invalidated",
    "effective_state_recomputed",
    "effective_state_regressed",
    "historical_pass_preserved"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== true) {
      errors.push({ code: "EG_T12_RUNTIME_POSITIVE_CLAIM_MISSING", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T12_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T12_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T12_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT12EvidenceInvalidatedAfterPassVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T12-EVIDENCE-INVALIDATED-AFTER-PASS-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    historical_decision_result: artifact.historical_decision_result,
    historical_pass_preserved: artifact.historical_pass_preserved,
    evidence_invalidation_detected: artifact.evidence_invalidation_detected,
    effective_state_recomputed: artifact.effective_state_recomputed,
    effective_state_regressed: artifact.effective_state_regressed,
    previous_effective_state: artifact.previous_effective_state,
    resulting_effective_state: artifact.resulting_effective_state,
    previous_effective_state_version: artifact.previous_effective_state_version,
    resulting_effective_state_version: artifact.resulting_effective_state_version,
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
  createHistoricalPassRecord,
  createPriorEffectiveProjection,
  createEvidenceInvalidationRecord,
  evaluateEvidenceInvalidatedAfterPass,
  verifyEGT12EvidenceInvalidatedAfterPass
};
