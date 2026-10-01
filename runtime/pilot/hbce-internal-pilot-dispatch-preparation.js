"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const preflightRuntime = require("./hbce-internal-pilot-execution-trace-preflight.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const DISPATCH_PREPARATION_VERSION = "HBCE-INTERNAL-PILOT-DISPATCH-PREPARATION-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createId(prefix, input) {
  return `${prefix}-${sha256Record(input).slice(0, 24)}`;
}

function createDispatchPreparation({
  preflightPath,
  prepared_at = "2026-09-30T22:00:00+02:00"
}) {
  const preflightVerification = preflightRuntime.verifyExecutionTracePreflight(preflightPath);
  const preflight = fileExists(preflightPath) ? readJson(preflightPath) : null;

  const request_id = preflight && preflight.correlation_chain ? preflight.correlation_chain.request_id : null;
  const authorization_evaluation_id = preflight && preflight.correlation_chain ? preflight.correlation_chain.authorization_evaluation_id : null;
  const action_digest = preflight && preflight.correlation_chain ? preflight.correlation_chain.action_digest : null;

  const seed = {
    pilot_id: PILOT_ID,
    request_id,
    authorization_evaluation_id,
    action_digest,
    preflight_sha256: fileExists(preflightPath) ? baseline.contentSha256(preflightPath) : null
  };

  const dispatch_id = createId("dispatch", seed);
  const attempt_id = createId("attempt", { ...seed, dispatch_id });

  const preparation = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchPreparation_v001",
    artifact_type: "DispatchPreparation",
    schema_version: DISPATCH_PREPARATION_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-210",
    source_refs: [
      "PROG-209"
    ],
    prepared_at,
    input_artifacts: {
      execution_trace_preflight_path: preflightPath,
      execution_trace_preflight_sha256: seed.preflight_sha256,
      execution_trace_preflight_verified: preflightVerification.verified === true
    },
    dispatch_preparation_state: preflightVerification.verified === true ? "DISPATCH_PREPARED_STRUCTURALLY" : "DISPATCH_PREPARATION_BLOCKED_BY_PREFLIGHT",
    trace_state: "DISPATCH_PREPARED",
    correlation_chain: {
      request_id,
      authorization_evaluation_id,
      action_digest,
      dispatch_id,
      attempt_id,
      target_receipt_id: null,
      execution_trace_ref: null,
      effect_evidence_ref: null
    },
    dispatch_prepared: preflightVerification.verified === true,
    dispatch_performed: false,
    target_acknowledged: false,
    target_receipt_created: false,
    execution_trace_bound: false,
    effect_evidence_created: false,
    operational_allowed: false,
    customer_external_execution_allowed: false,
    maximum_supported_claim: "DISPATCH_PREPARED_NOT_PERFORMED",
    inherited_preflight_state: preflight ? preflight.preflight_state : "UNKNOWN",
    inherited_trace_state: preflight ? preflight.trace_state : "UNKNOWN",
    dispatch_boundary: {
      preparation_record_created: true,
      dispatch_id_allocated: true,
      attempt_id_allocated: true,
      dispatch_command_emitted: false,
      external_connector_called: false,
      target_system_contacted: false,
      target_receipt_created: false,
      execution_trace_created: false,
      effect_evidence_created: false
    },
    fail_closed_reasons: [
      "DISPATCH_COMMAND_NOT_EMITTED",
      "EXTERNAL_CONNECTOR_NOT_CALLED",
      "TARGET_SYSTEM_NOT_CONTACTED",
      "TARGET_RECEIPT_NOT_CREATED",
      "EXECUTION_TRACE_NOT_BOUND",
      "EFFECT_EVIDENCE_NOT_CREATED",
      "CUSTOMER_EXECUTION_GATE_NOT_OPEN",
      "C16_NOT_PERFORMED",
      "LEGAL_REVIEW_NOT_CLAIMED",
      "HUMAN_GO_NOT_BOUND"
    ],
    prohibited_claims: [
      "dispatch_performed",
      "external_connector_called",
      "target_system_contacted",
      "target_receipt_created",
      "execution_observed",
      "effect_observed",
      "customer_execution_allowed",
      "externally_validated",
      "legal_reviewed",
      "commercially_authorized",
      "level4_eligible"
    ],
    claim_boundary: {
      dispatch_preparation_created: true,
      preflight_bound: preflightVerification.verified === true,
      structural_validation_only: true,
      dispatch_not_performed: true,
      external_connector_not_called: true,
      target_system_not_contacted: true,
      target_receipt_not_created: true,
      execution_trace_not_created: true,
      effect_evidence_not_created: true,
      customer_execution_not_enabled: true,
      external_validation_not_inferred: true,
      legal_review_not_inferred: true,
      level4_not_inferred: true
    },
    status: "DISPATCH_PREPARATION_CREATED_WITH_NO_EXTERNAL_CALL",
    content_sha256: null
  };

  preparation.content_sha256 = sha256Record({ ...preparation, content_sha256: null });
  return preparation;
}

function verifyDispatchPreparation(preparationPath) {
  const errors = [];

  if (!fileExists(preparationPath)) {
    const missing = {
      record_type: "DispatchPreparationVerificationRecord",
      preparation_path: preparationPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "DISPATCH_PREPARATION_MISSING", path: preparationPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const preparation = readJson(preparationPath);

  if (preparation.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: preparation.pilot_id });
  }

  if (preparation.schema_version !== DISPATCH_PREPARATION_VERSION) {
    errors.push({ code: "DISPATCH_PREPARATION_VERSION_MISMATCH", observed: preparation.schema_version });
  }

  if (preparation.dispatch_preparation_state !== "DISPATCH_PREPARED_STRUCTURALLY") {
    errors.push({ code: "DISPATCH_PREPARATION_NOT_STRUCTURAL", observed: preparation.dispatch_preparation_state });
  }

  if (preparation.trace_state !== "DISPATCH_PREPARED") {
    errors.push({ code: "TRACE_STATE_NOT_DISPATCH_PREPARED", observed: preparation.trace_state });
  }

  if (preparation.dispatch_prepared !== true) {
    errors.push({ code: "DISPATCH_PREPARED_FLAG_MISSING", observed: preparation.dispatch_prepared });
  }

  for (const key of [
    "dispatch_performed",
    "target_acknowledged",
    "target_receipt_created",
    "execution_trace_bound",
    "effect_evidence_created",
    "operational_allowed",
    "customer_external_execution_allowed"
  ]) {
    if (preparation[key] !== false) {
      errors.push({ code: "DISPATCH_PREPARATION_OVERCLAIM", key, observed: preparation[key] });
    }
  }

  if (!preparation.correlation_chain || typeof preparation.correlation_chain.dispatch_id !== "string") {
    errors.push({ code: "DISPATCH_ID_MISSING" });
  }

  if (!preparation.correlation_chain || typeof preparation.correlation_chain.attempt_id !== "string") {
    errors.push({ code: "ATTEMPT_ID_MISSING" });
  }

  for (const nullableField of [
    "target_receipt_id",
    "execution_trace_ref",
    "effect_evidence_ref"
  ]) {
    if (!preparation.correlation_chain || preparation.correlation_chain[nullableField] !== null) {
      errors.push({
        code: "POST_DISPATCH_FIELD_MUST_BE_NULL",
        field: nullableField,
        observed: preparation.correlation_chain ? preparation.correlation_chain[nullableField] : undefined
      });
    }
  }

  if (!preparation.dispatch_boundary || preparation.dispatch_boundary.external_connector_called !== false) {
    errors.push({ code: "EXTERNAL_CONNECTOR_BOUNDARY_BROKEN" });
  }

  if (!preparation.dispatch_boundary || preparation.dispatch_boundary.target_system_contacted !== false) {
    errors.push({ code: "TARGET_SYSTEM_BOUNDARY_BROKEN" });
  }

  if (!preparation.claim_boundary || preparation.claim_boundary.dispatch_not_performed !== true) {
    errors.push({ code: "DISPATCH_NOT_PERFORMED_BOUNDARY_MISSING" });
  }

  if (!preparation.claim_boundary || preparation.claim_boundary.external_connector_not_called !== true) {
    errors.push({ code: "EXTERNAL_CONNECTOR_BOUNDARY_MISSING" });
  }

  if (!preparation.claim_boundary || preparation.claim_boundary.effect_evidence_not_created !== true) {
    errors.push({ code: "EFFECT_EVIDENCE_BOUNDARY_MISSING" });
  }

  const expectedHash = sha256Record({ ...preparation, content_sha256: null });
  if (preparation.content_sha256 !== expectedHash) {
    errors.push({
      code: "DISPATCH_PREPARATION_HASH_MISMATCH",
      expected: expectedHash,
      observed: preparation.content_sha256
    });
  }

  const verification = {
    record_type: "DispatchPreparationVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-DISPATCH-PREPARATION-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    preparation_path: preparationPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    dispatch_preparation_state: preparation.dispatch_preparation_state,
    trace_state: preparation.trace_state,
    dispatch_prepared: preparation.dispatch_prepared,
    dispatch_performed: preparation.dispatch_performed,
    target_receipt_created: preparation.target_receipt_created,
    execution_trace_bound: preparation.execution_trace_bound,
    effect_evidence_created: preparation.effect_evidence_created,
    operational_allowed: preparation.operational_allowed,
    preparation_sha256: baseline.contentSha256(preparationPath),
    claim_boundary: {
      structural_validation_only: true,
      dispatch_not_performed: true,
      external_connector_not_called: true,
      target_system_not_contacted: true,
      target_receipt_not_created: true,
      execution_trace_not_created: true,
      effect_evidence_not_created: true,
      external_validation_not_inferred: true,
      legal_review_not_inferred: true,
      level4_not_inferred: true
    },
    record_sha256: null
  };

  verification.record_sha256 = sha256Record({ ...verification, record_sha256: null });
  return verification;
}

module.exports = {
  PILOT_ID,
  DISPATCH_PREPARATION_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createId,
  createDispatchPreparation,
  verifyDispatchPreparation
};
