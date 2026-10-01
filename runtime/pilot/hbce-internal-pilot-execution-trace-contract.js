"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const policyBinding = require("./hbce-internal-pilot-policy-runtime-binding.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const CONTRACT_VERSION = "HBCE-INTERNAL-PILOT-EXECUTION-TRACE-CONTRACT-V0.1";

const REQUIRED_TRACE_FIELDS = [
  "request_id",
  "authorization_evaluation_id",
  "action_digest",
  "dispatch_id",
  "attempt_id",
  "target_receipt_id",
  "execution_trace_ref",
  "effect_evidence_ref"
];

const REQUIRED_STATES = [
  "NOT_DISPATCHED",
  "DISPATCH_PREPARED",
  "DISPATCHED",
  "TARGET_ACKNOWLEDGED",
  "EXECUTION_OBSERVED",
  "EXECUTION_UNKNOWN",
  "EFFECT_OBSERVED",
  "FAILED"
];

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createExecutionTraceContract({
  bindingPath,
  created_at = "2026-09-30T21:30:00+02:00"
}) {
  const bindingVerification = policyBinding.verifyPolicyRuntimeBinding(bindingPath);
  const binding = fileExists(bindingPath) ? readJson(bindingPath) : null;

  const contract = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_ExecutionTraceContract_v001",
    artifact_type: "ExecutionTraceContract",
    schema_version: CONTRACT_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-208",
    source_refs: [
      "PROG-204",
      "PROG-205",
      "PROG-206",
      "PROG-207"
    ],
    created_at,
    input_artifacts: {
      policy_runtime_binding_path: bindingPath,
      policy_runtime_binding_sha256: fileExists(bindingPath) ? baseline.contentSha256(bindingPath) : null,
      policy_runtime_binding_verified: bindingVerification.verified === true
    },
    trace_contract_state: bindingVerification.verified === true ? "DEFINED_STRUCTURALLY_VALIDATED" : "BLOCKED_BY_POLICY_BINDING",
    execution_trace_bound: false,
    operational_allowed: false,
    customer_external_execution_allowed: false,
    required_trace_fields: REQUIRED_TRACE_FIELDS,
    required_states: REQUIRED_STATES,
    required_correlation_chain: [
      "request_id",
      "authorization_evaluation_id",
      "action_digest",
      "dispatch_id",
      "attempt_id",
      "target_receipt_id",
      "execution_trace_ref",
      "effect_evidence_ref"
    ],
    separation_rules: {
      authorization_evaluation_is_not_execution: true,
      dispatch_record_is_not_target_effect: true,
      target_receipt_is_not_physical_effect: true,
      execution_trace_is_not_legal_validity: true,
      effect_evidence_is_not_universal_truth: true
    },
    fail_closed_rules: {
      missing_request_id: "INVALID_TRACE",
      missing_authorization_evaluation_id: "INVALID_TRACE",
      missing_action_digest: "INVALID_TRACE",
      missing_dispatch_id: "INVALID_TRACE",
      missing_attempt_id: "INVALID_TRACE",
      missing_target_receipt_id: "INVALID_TRACE",
      missing_execution_trace_ref: "EXECUTION_NOT_OBSERVED",
      missing_effect_evidence_ref: "EFFECT_NOT_OBSERVED",
      connector_timeout: "EXECUTION_UNKNOWN",
      duplicate_attempt_without_idempotency: "BLOCKED",
      target_receipt_without_effect_evidence: "CONSEQUENCE_UNVERIFIED"
    },
    maximum_supported_claim: "TRACE_CONTRACT_DEFINED_STRUCTURALLY_VALIDATED",
    prohibited_claims: [
      "execution_observed",
      "effect_observed",
      "customer_execution_allowed",
      "externally_validated",
      "legal_reviewed",
      "commercially_authorized",
      "level4_eligible"
    ],
    inherited_blockers: {
      m1_owner_gate: binding && binding.observed_gates ? binding.observed_gates.m1_owner_gate : "UNKNOWN",
      policy_gate: binding && binding.observed_gates ? binding.observed_gates.policy_gate : "UNKNOWN",
      execution_trace_not_bound: true,
      c16_not_performed: true,
      legal_review_not_claimed: true,
      human_go_not_bound: true
    },
    claim_boundary: {
      trace_contract_defined: true,
      structural_validation_only: true,
      execution_trace_not_created: true,
      dispatch_not_performed: true,
      target_receipt_not_created: true,
      effect_evidence_not_created: true,
      customer_execution_not_enabled: true,
      external_validation_not_inferred: true,
      legal_review_not_inferred: true,
      level4_not_inferred: true
    },
    status: "TRACE_CONTRACT_DEFINED_WITH_FAIL_CLOSED_OPERATIONAL_GATE",
    content_sha256: null
  };

  contract.content_sha256 = sha256Record({ ...contract, content_sha256: null });
  return contract;
}

function verifyExecutionTraceContract(contractPath) {
  const errors = [];

  if (!fileExists(contractPath)) {
    const missing = {
      record_type: "ExecutionTraceContractVerificationRecord",
      contract_path: contractPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EXECUTION_TRACE_CONTRACT_MISSING", path: contractPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const contract = readJson(contractPath);

  if (contract.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: contract.pilot_id });
  }

  if (contract.schema_version !== CONTRACT_VERSION) {
    errors.push({ code: "CONTRACT_VERSION_MISMATCH", observed: contract.schema_version });
  }

  if (contract.trace_contract_state !== "DEFINED_STRUCTURALLY_VALIDATED") {
    errors.push({ code: "TRACE_CONTRACT_NOT_DEFINED", observed: contract.trace_contract_state });
  }

  for (const field of REQUIRED_TRACE_FIELDS) {
    if (!Array.isArray(contract.required_trace_fields) || !contract.required_trace_fields.includes(field)) {
      errors.push({ code: "REQUIRED_TRACE_FIELD_MISSING", field });
    }
  }

  for (const state of REQUIRED_STATES) {
    if (!Array.isArray(contract.required_states) || !contract.required_states.includes(state)) {
      errors.push({ code: "REQUIRED_TRACE_STATE_MISSING", state });
    }
  }

  if (contract.execution_trace_bound !== false) {
    errors.push({ code: "EXECUTION_TRACE_BOUND_OVERCLAIM", observed: contract.execution_trace_bound });
  }

  if (contract.operational_allowed !== false) {
    errors.push({ code: "OPERATIONAL_ALLOWED_OVERCLAIM", observed: contract.operational_allowed });
  }

  if (contract.customer_external_execution_allowed !== false) {
    errors.push({ code: "CUSTOMER_EXECUTION_ALLOWED_OVERCLAIM", observed: contract.customer_external_execution_allowed });
  }

  for (const claim of [
    "execution_observed",
    "effect_observed",
    "customer_execution_allowed",
    "externally_validated",
    "legal_reviewed",
    "commercially_authorized",
    "level4_eligible"
  ]) {
    if (!Array.isArray(contract.prohibited_claims) || !contract.prohibited_claims.includes(claim)) {
      errors.push({ code: "PROHIBITED_CLAIM_MISSING", claim });
    }
  }

  if (!contract.separation_rules || contract.separation_rules.dispatch_record_is_not_target_effect !== true) {
    errors.push({ code: "DISPATCH_EFFECT_SEPARATION_MISSING" });
  }

  if (!contract.separation_rules || contract.separation_rules.target_receipt_is_not_physical_effect !== true) {
    errors.push({ code: "RECEIPT_EFFECT_SEPARATION_MISSING" });
  }

  if (!contract.fail_closed_rules || contract.fail_closed_rules.connector_timeout !== "EXECUTION_UNKNOWN") {
    errors.push({ code: "CONNECTOR_TIMEOUT_FAIL_CLOSED_RULE_MISSING" });
  }

  if (!contract.claim_boundary || contract.claim_boundary.execution_trace_not_created !== true) {
    errors.push({ code: "EXECUTION_TRACE_BOUNDARY_MISSING" });
  }

  if (!contract.claim_boundary || contract.claim_boundary.effect_evidence_not_created !== true) {
    errors.push({ code: "EFFECT_EVIDENCE_BOUNDARY_MISSING" });
  }

  const expectedHash = sha256Record({ ...contract, content_sha256: null });
  if (contract.content_sha256 !== expectedHash) {
    errors.push({
      code: "EXECUTION_TRACE_CONTRACT_HASH_MISMATCH",
      expected: expectedHash,
      observed: contract.content_sha256
    });
  }

  const verification = {
    record_type: "ExecutionTraceContractVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-EXECUTION-TRACE-CONTRACT-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    contract_path: contractPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    trace_contract_state: contract.trace_contract_state,
    execution_trace_bound: contract.execution_trace_bound,
    operational_allowed: contract.operational_allowed,
    customer_external_execution_allowed: contract.customer_external_execution_allowed,
    contract_sha256: baseline.contentSha256(contractPath),
    claim_boundary: {
      structural_validation_only: true,
      execution_trace_not_created: true,
      dispatch_not_performed: true,
      target_receipt_not_created: true,
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
  CONTRACT_VERSION,
  REQUIRED_TRACE_FIELDS,
  REQUIRED_STATES,
  sha256Record,
  readJson,
  fileExists,
  createExecutionTraceContract,
  verifyExecutionTraceContract
};
