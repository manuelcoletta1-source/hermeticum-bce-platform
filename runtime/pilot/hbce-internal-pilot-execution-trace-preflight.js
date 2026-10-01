"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const traceContract = require("./hbce-internal-pilot-execution-trace-contract.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const PREFLIGHT_VERSION = "HBCE-INTERNAL-PILOT-EXECUTION-TRACE-PREFLIGHT-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createPreflightId(input) {
  return `preflight-${sha256Record(input).slice(0, 24)}`;
}

function createExecutionTracePreflight({
  contractPath,
  request_id = "HBCE-PILOT-INTERNAL-REQ-0001",
  authorization_evaluation_id = "HBCE-PILOT-INTERNAL-AUTHZ-EVAL-0001",
  action_digest = "sha256:0000000000000000000000000000000000000000000000000000000000000000",
  created_at = "2026-09-30T21:45:00+02:00"
}) {
  const contractVerification = traceContract.verifyExecutionTraceContract(contractPath);
  const contract = fileExists(contractPath) ? readJson(contractPath) : null;

  const seed = {
    pilot_id: PILOT_ID,
    request_id,
    authorization_evaluation_id,
    action_digest,
    contract_sha256: fileExists(contractPath) ? baseline.contentSha256(contractPath) : null
  };

  const dispatch_id = null;
  const attempt_id = null;
  const target_receipt_id = null;
  const execution_trace_ref = null;
  const effect_evidence_ref = null;

  const preflight = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_ExecutionTracePreflight_v001",
    artifact_type: "ExecutionTracePreflight",
    schema_version: PREFLIGHT_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-209",
    source_refs: [
      "PROG-208"
    ],
    created_at,
    input_artifacts: {
      execution_trace_contract_path: contractPath,
      execution_trace_contract_sha256: seed.contract_sha256,
      execution_trace_contract_verified: contractVerification.verified === true
    },
    preflight_id: createPreflightId(seed),
    preflight_state: contractVerification.verified === true ? "TRACE_PREFLIGHT_DEFINED" : "TRACE_PREFLIGHT_BLOCKED_BY_CONTRACT",
    trace_state: "NOT_DISPATCHED",
    correlation_chain: {
      request_id,
      authorization_evaluation_id,
      action_digest,
      dispatch_id,
      attempt_id,
      target_receipt_id,
      execution_trace_ref,
      effect_evidence_ref
    },
    required_contract_fields_observed: {
      request_id_present: typeof request_id === "string" && request_id.length > 0,
      authorization_evaluation_id_present: typeof authorization_evaluation_id === "string" && authorization_evaluation_id.length > 0,
      action_digest_present: typeof action_digest === "string" && action_digest.length > 0,
      dispatch_id_present: false,
      attempt_id_present: false,
      target_receipt_id_present: false,
      execution_trace_ref_present: false,
      effect_evidence_ref_present: false
    },
    dispatch_prepared: false,
    dispatch_performed: false,
    target_acknowledged: false,
    target_receipt_created: false,
    execution_trace_bound: false,
    effect_evidence_created: false,
    operational_allowed: false,
    customer_external_execution_allowed: false,
    maximum_supported_claim: "TRACE_PREFLIGHT_DEFINED_NOT_DISPATCHED",
    inherited_contract_state: contract ? contract.trace_contract_state : "UNKNOWN",
    fail_closed_reasons: [
      "DISPATCH_NOT_PREPARED",
      "DISPATCH_NOT_PERFORMED",
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
      preflight_record_created: true,
      contract_bound: contractVerification.verified === true,
      structural_validation_only: true,
      dispatch_not_performed: true,
      target_receipt_not_created: true,
      execution_trace_not_created: true,
      effect_evidence_not_created: true,
      customer_execution_not_enabled: true,
      external_validation_not_inferred: true,
      legal_review_not_inferred: true,
      level4_not_inferred: true
    },
    status: "TRACE_PREFLIGHT_CREATED_WITH_NO_DISPATCH",
    content_sha256: null
  };

  preflight.content_sha256 = sha256Record({ ...preflight, content_sha256: null });
  return preflight;
}

function verifyExecutionTracePreflight(preflightPath) {
  const errors = [];

  if (!fileExists(preflightPath)) {
    const missing = {
      record_type: "ExecutionTracePreflightVerificationRecord",
      preflight_path: preflightPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EXECUTION_TRACE_PREFLIGHT_MISSING", path: preflightPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const preflight = readJson(preflightPath);

  if (preflight.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: preflight.pilot_id });
  }

  if (preflight.schema_version !== PREFLIGHT_VERSION) {
    errors.push({ code: "PREFLIGHT_VERSION_MISMATCH", observed: preflight.schema_version });
  }

  if (preflight.preflight_state !== "TRACE_PREFLIGHT_DEFINED") {
    errors.push({ code: "PREFLIGHT_NOT_DEFINED", observed: preflight.preflight_state });
  }

  if (preflight.trace_state !== "NOT_DISPATCHED") {
    errors.push({ code: "TRACE_STATE_NOT_NOT_DISPATCHED", observed: preflight.trace_state });
  }

  for (const key of [
    "dispatch_prepared",
    "dispatch_performed",
    "target_acknowledged",
    "target_receipt_created",
    "execution_trace_bound",
    "effect_evidence_created",
    "operational_allowed",
    "customer_external_execution_allowed"
  ]) {
    if (preflight[key] !== false) {
      errors.push({ code: "PREFLIGHT_OVERCLAIM", key, observed: preflight[key] });
    }
  }

  if (!preflight.correlation_chain || typeof preflight.correlation_chain.request_id !== "string") {
    errors.push({ code: "REQUEST_ID_MISSING" });
  }

  if (!preflight.correlation_chain || typeof preflight.correlation_chain.authorization_evaluation_id !== "string") {
    errors.push({ code: "AUTHORIZATION_EVALUATION_ID_MISSING" });
  }

  if (!preflight.correlation_chain || typeof preflight.correlation_chain.action_digest !== "string") {
    errors.push({ code: "ACTION_DIGEST_MISSING" });
  }

  for (const nullableField of [
    "dispatch_id",
    "attempt_id",
    "target_receipt_id",
    "execution_trace_ref",
    "effect_evidence_ref"
  ]) {
    if (!preflight.correlation_chain || preflight.correlation_chain[nullableField] !== null) {
      errors.push({ code: "PREFLIGHT_FIELD_MUST_BE_NULL", field: nullableField, observed: preflight.correlation_chain ? preflight.correlation_chain[nullableField] : undefined });
    }
  }

  for (const reason of [
    "DISPATCH_NOT_PERFORMED",
    "TARGET_RECEIPT_NOT_CREATED",
    "EXECUTION_TRACE_NOT_BOUND",
    "EFFECT_EVIDENCE_NOT_CREATED"
  ]) {
    if (!Array.isArray(preflight.fail_closed_reasons) || !preflight.fail_closed_reasons.includes(reason)) {
      errors.push({ code: "FAIL_CLOSED_REASON_MISSING", reason });
    }
  }

  if (!preflight.claim_boundary || preflight.claim_boundary.dispatch_not_performed !== true) {
    errors.push({ code: "DISPATCH_BOUNDARY_MISSING" });
  }

  if (!preflight.claim_boundary || preflight.claim_boundary.execution_trace_not_created !== true) {
    errors.push({ code: "EXECUTION_TRACE_BOUNDARY_MISSING" });
  }

  if (!preflight.claim_boundary || preflight.claim_boundary.effect_evidence_not_created !== true) {
    errors.push({ code: "EFFECT_EVIDENCE_BOUNDARY_MISSING" });
  }

  const expectedHash = sha256Record({ ...preflight, content_sha256: null });
  if (preflight.content_sha256 !== expectedHash) {
    errors.push({
      code: "EXECUTION_TRACE_PREFLIGHT_HASH_MISMATCH",
      expected: expectedHash,
      observed: preflight.content_sha256
    });
  }

  const verification = {
    record_type: "ExecutionTracePreflightVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-EXECUTION-TRACE-PREFLIGHT-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    preflight_path: preflightPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    preflight_state: preflight.preflight_state,
    trace_state: preflight.trace_state,
    dispatch_performed: preflight.dispatch_performed,
    execution_trace_bound: preflight.execution_trace_bound,
    effect_evidence_created: preflight.effect_evidence_created,
    operational_allowed: preflight.operational_allowed,
    preflight_sha256: baseline.contentSha256(preflightPath),
    claim_boundary: {
      structural_validation_only: true,
      dispatch_not_performed: true,
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
  PREFLIGHT_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createPreflightId,
  createExecutionTracePreflight,
  verifyExecutionTracePreflight
};
