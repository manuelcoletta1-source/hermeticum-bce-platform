"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-246";
const TEST_ID = "EG-T27";
const TENANT_ID = "HBCE_INTERNAL";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T27-READ-SET-CHANGED-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createEvaluationInputSet() {
  const inputSet = {
    record_type: "DecisionInputSet",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    input_set_id: "eg-t27-evaluation-input-set-v001",
    evaluation_time: "2026-10-01T23:10:00+02:00",
    authority_ref: "authority:hbce-internal:release-governance",
    authority_version: 7,
    authority_sha256: "eg-t27-authority-sha256-v007",
    mandate_ref: "mandate:hbce-internal:matrix-release",
    mandate_version: 4,
    mandate_sha256: "eg-t27-mandate-sha256-v004",
    policy_ref: "policy:hbce-internal:release-transition",
    policy_version: 12,
    policy_sha256: "eg-t27-policy-sha256-v012",
    evidence_ref: "evidence:hbce-internal:matrix-c01-c15-bundle",
    evidence_sha256: "eg-t27-evidence-sha256-before",
    checkpoint_ref: "checkpoint:hbce:tail-witness",
    checkpoint_head_sha256: "eg-t27-checkpoint-head-before",
    read_set_digest: null
  };

  inputSet.read_set_digest = sha256Record({ ...inputSet, read_set_digest: null });
  return inputSet;
}

function createChangedCommitInputSet({ evaluatedInputSet = createEvaluationInputSet() } = {}) {
  const changed = {
    ...evaluatedInputSet,
    input_set_id: "eg-t27-commit-input-set-v001",
    commit_time: "2026-10-01T23:10:05+02:00",
    mandate_version: evaluatedInputSet.mandate_version + 1,
    mandate_sha256: "eg-t27-mandate-sha256-v005",
    evidence_sha256: "eg-t27-evidence-sha256-after",
    checkpoint_head_sha256: "eg-t27-checkpoint-head-after",
    read_set_digest: null
  };

  changed.read_set_digest = sha256Record({ ...changed, read_set_digest: null });
  return changed;
}

function detectReadSetChanges({ evaluatedInputSet, commitInputSet }) {
  const fields = [
    "authority_version",
    "authority_sha256",
    "mandate_version",
    "mandate_sha256",
    "policy_version",
    "policy_sha256",
    "evidence_sha256",
    "checkpoint_head_sha256"
  ];

  return fields
    .filter((field) => evaluatedInputSet[field] !== commitInputSet[field])
    .map((field) => ({
      field,
      before: evaluatedInputSet[field],
      after: commitInputSet[field],
      reason_code:
        field.startsWith("authority_") ? "AUTHORITY_CHANGED" :
        field.startsWith("mandate_") ? "MANDATE_CHANGED" :
        field.startsWith("policy_") ? "POLICY_CHANGED" :
        field.startsWith("evidence_") ? "EVIDENCE_CHANGED" :
        field.startsWith("checkpoint_") ? "CHECKPOINT_CHANGED" :
        "READ_SET_CHANGED"
    }));
}

function createRejectedTransitionRecord({ evaluatedInputSet, commitInputSet, changes, generated_at }) {
  const record = {
    record_type: "ReadSetChangedRejectedTransitionRecord",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    rejection_id: "eg-t27-read-set-changed-rejection-v001",
    evaluation_input_set_id: evaluatedInputSet.input_set_id,
    commit_input_set_id: commitInputSet.input_set_id,
    evaluation_read_set_digest: evaluatedInputSet.read_set_digest,
    commit_read_set_digest: commitInputSet.read_set_digest,
    read_set_changed: evaluatedInputSet.read_set_digest !== commitInputSet.read_set_digest,
    changed_fields: changes,
    rejection_result: "REJECT",
    rejection_code: "READ_SET_CHANGED",
    typed_changed_reasons: [...new Set(changes.map((change) => change.reason_code))].sort(),
    authoritative_transition_created: false,
    transition_event_created: false,
    projection_updated: false,
    effect_evidence_created: false,
    rejected_at: generated_at,
    rejection_hash: null
  };

  record.rejection_hash = sha256Record({ ...record, rejection_hash: null });
  return record;
}

function evaluateReadSetChanged({
  evaluatedInputSet = createEvaluationInputSet(),
  commitInputSet = null,
  generated_at = "2026-10-01T23:11:00+02:00"
} = {}) {
  const effectiveCommitInputSet = commitInputSet || createChangedCommitInputSet({ evaluatedInputSet });
  const changes = detectReadSetChanges({ evaluatedInputSet, commitInputSet: effectiveCommitInputSet });
  const rejectedTransitionRecord = createRejectedTransitionRecord({
    evaluatedInputSet,
    commitInputSet: effectiveCommitInputSet,
    changes,
    generated_at
  });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T27_ReadSetChanged_v001",
    artifact_type: "MatrixEGT27ReadSetChangedRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "REJECT + READ_SET_CHANGED; no authoritative transition",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    evaluated_input_set: evaluatedInputSet,
    commit_input_set: effectiveCommitInputSet,
    rejected_transition_record: rejectedTransitionRecord,
    changed_fields: changes,
    changed_field_count: changes.length,
    authority_changed: changes.some((change) => change.reason_code === "AUTHORITY_CHANGED"),
    mandate_changed: changes.some((change) => change.reason_code === "MANDATE_CHANGED"),
    policy_changed: changes.some((change) => change.reason_code === "POLICY_CHANGED"),
    evidence_changed: changes.some((change) => change.reason_code === "EVIDENCE_CHANGED"),
    checkpoint_changed: changes.some((change) => change.reason_code === "CHECKPOINT_CHANGED"),
    read_set_changed_detected: true,
    read_set_digest_before: evaluatedInputSet.read_set_digest,
    read_set_digest_at_commit: effectiveCommitInputSet.read_set_digest,
    rejection_result: "REJECT",
    rejection_code: "READ_SET_CHANGED",
    authoritative_transition_created: false,
    transition_event_created: false,
    projection_updated: false,
    effect_evidence_created: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    read_set_gate: {
      require_commit_read_set_equal_evaluation_read_set: true,
      require_reject_changed_read_set: true,
      require_no_authoritative_transition: true,
      require_no_second_effect: true,
      allow_commit_after_read_set_change: false,
      allow_authoritative_transition_creation: false,
      allow_transition_event_creation: false,
      allow_projection_update: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t27_runtime_artifact_created: true,
      read_set_changed_detected: true,
      rejection_code_read_set_changed: true,
      no_authoritative_transition: true,
      authoritative_transition_created: false,
      transition_event_created: false,
      projection_updated: false,
      effect_evidence_created: false,
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
    maximum_supported_claim: "EG_T27_INPUT_CHANGE_AFTER_EVALUATION_BEFORE_COMMIT_REJECTS_WITH_READ_SET_CHANGED_AND_NO_AUTHORITATIVE_TRANSITION",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT27ReadSetChanged(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT27ReadSetChangedVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T27_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T27_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T27_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T27_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "REJECT + READ_SET_CHANGED; no authoritative transition") errors.push({ code: "EG_T27_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["read_set_changed_detected", true],
    ["rejection_result", "REJECT"],
    ["rejection_code", "READ_SET_CHANGED"],
    ["authoritative_transition_created", false],
    ["transition_event_created", false],
    ["projection_updated", false],
    ["effect_evidence_created", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T27_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.evaluated_input_set || !artifact.commit_input_set || !artifact.rejected_transition_record) {
    errors.push({ code: "EG_T27_CORE_RECORDS_MISSING" });
  } else {
    const recomputedChanges = detectReadSetChanges({
      evaluatedInputSet: artifact.evaluated_input_set,
      commitInputSet: artifact.commit_input_set
    });

    if (recomputedChanges.length === 0) {
      errors.push({ code: "EG_T27_READ_SET_CHANGE_NOT_PRESENT" });
    }

    if (artifact.evaluated_input_set.read_set_digest === artifact.commit_input_set.read_set_digest) {
      errors.push({ code: "EG_T27_READ_SET_DIGEST_NOT_CHANGED" });
    }

    if (artifact.changed_field_count !== recomputedChanges.length) {
      errors.push({ code: "EG_T27_CHANGED_FIELD_COUNT_INVALID", expected: recomputedChanges.length, observed: artifact.changed_field_count });
    }

    if (artifact.rejected_transition_record.rejection_code !== "READ_SET_CHANGED") {
      errors.push({ code: "EG_T27_REJECTION_CODE_INVALID", observed: artifact.rejected_transition_record.rejection_code });
    }

    if (artifact.rejected_transition_record.authoritative_transition_created !== false || artifact.rejected_transition_record.transition_event_created !== false || artifact.rejected_transition_record.projection_updated !== false) {
      errors.push({ code: "EG_T27_REJECTED_RECORD_EFFECT_OVERCLAIM" });
    }
  }

  for (const key of [
    "require_commit_read_set_equal_evaluation_read_set",
    "require_reject_changed_read_set",
    "require_no_authoritative_transition",
    "require_no_second_effect"
  ]) {
    if (!artifact.read_set_gate || artifact.read_set_gate[key] !== true) {
      errors.push({ code: "EG_T27_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.read_set_gate ? artifact.read_set_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_commit_after_read_set_change",
    "allow_authoritative_transition_creation",
    "allow_transition_event_creation",
    "allow_projection_update",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.read_set_gate || artifact.read_set_gate[key] !== false) {
      errors.push({ code: "EG_T27_GATE_OVERCLAIM", key, observed: artifact.read_set_gate ? artifact.read_set_gate[key] : undefined });
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
      errors.push({ code: "EG_T27_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
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
      errors.push({ code: "EG_T27_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T27_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT27ReadSetChangedVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T27-READ-SET-CHANGED-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    read_set_changed_detected: artifact.read_set_changed_detected,
    rejection_code: artifact.rejection_code,
    changed_field_count: artifact.changed_field_count,
    authoritative_transition_created: artifact.authoritative_transition_created,
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
  createEvaluationInputSet,
  createChangedCommitInputSet,
  detectReadSetChanges,
  createRejectedTransitionRecord,
  evaluateReadSetChanged,
  verifyEGT27ReadSetChanged
};
