"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const requestRuntime = require("./hbce-internal-pilot-dispatch-block-chain-human-acceptance-request.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const CONTRACT_VERSION = "HBCE-INTERNAL-PILOT-HUMAN-ACCEPTANCE-RESPONSE-CONTRACT-V0.1";

const ALLOWED_DECISION_VALUES = [
  "ACCEPT_INTERNAL_NO_EXECUTION_REVIEW_GATE",
  "REJECT_INTERNAL_NO_EXECUTION_REVIEW_GATE"
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

function isSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function createHumanAcceptanceResponseContract({
  requestPath,
  generated_at = "2026-09-30T23:30:00+02:00"
}) {
  const requestVerification = requestRuntime.verifyDispatchBlockChainHumanAcceptanceRequest(requestPath);
  const request = fileExists(requestPath) ? readJson(requestPath) : null;

  const requestReady =
    requestVerification.verified === true &&
    request &&
    request.request_state === "HUMAN_ACCEPTANCE_REQUEST_CREATED_PENDING_RESPONSE" &&
    request.request_type === "HUMAN_ACCEPTANCE_REQUEST_ONLY" &&
    request.human_acceptance_received === false &&
    request.human_response_received === false &&
    request.human_decision_recorded === false &&
    request.readiness_unlock_allowed === false &&
    request.dispatch_performed === false;

  const contract = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_HumanAcceptanceResponseContract_v001",
    artifact_type: "HumanAcceptanceResponseContract",
    schema_version: CONTRACT_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-216",
    source_refs: [
      "PROG-215"
    ],
    generated_at,
    input_artifacts: {
      human_acceptance_request_path: requestPath,
      human_acceptance_request_sha256: fileExists(requestPath) ? baseline.contentSha256(requestPath) : null,
      human_acceptance_request_verified: requestVerification.verified === true,
      bound_request_id: request ? request.request_id : null
    },
    contract_state: requestReady
      ? "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_DEFINED_PENDING_RESPONSE"
      : "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_BLOCKED_INVALID_REQUEST",
    response_record_type: "HumanAcceptanceResponseRecord",
    response_contract_scope: "INTERNAL_STRUCTURAL_NO_EXECUTION_CHAIN_REVIEW",
    allowed_decision_values: ALLOWED_DECISION_VALUES,
    required_response_fields: [
      "response_record_id",
      "pilot_id",
      "source_request_id",
      "source_request_sha256",
      "human_actor_ref",
      "human_actor_role",
      "decision_value",
      "decision_statement",
      "decision_statement_sha256",
      "decision_recorded_at",
      "response_channel",
      "scope_confirmation",
      "no_execution_boundary_acknowledged"
    ],
    required_actor_constraints: {
      human_actor_ref_must_not_be_pending: true,
      human_actor_role_allowed: [
        "AUTHORIZED_HUMAN_OWNER",
        "DESIGNATED_HUMAN_REVIEWER"
      ],
      ai_actor_may_not_decide: true,
      automated_decision_disallowed: true
    },
    required_decision_constraints: {
      decision_value_must_be_one_of_allowed_values: true,
      decision_statement_required: true,
      decision_statement_sha256_required: true,
      source_request_binding_required: true,
      scope_confirmation_required: true,
      no_execution_boundary_acknowledgment_required: true
    },
    future_response_effects: {
      may_record_human_acceptance: true,
      may_record_human_rejection: true,
      may_create_human_decision_record: true,
      may_pass_owner_gate: false,
      may_unlock_readiness: false,
      may_authorize_dispatch: false,
      may_perform_dispatch: false,
      may_create_external_effect_evidence: false,
      may_create_legal_review: false,
      may_create_level4_eligibility: false
    },
    current_state: {
      human_response_received: false,
      human_acceptance_received: false,
      human_rejection_received: false,
      human_decision_recorded: false,
      human_decision_record_ref: null,
      owner_gate_passed: false,
      readiness_unlock_allowed: false,
      operational_transition_allowed: false,
      dispatch_execution_authorized: false,
      dispatch_command_emitted: false,
      dispatch_performed: false,
      external_connector_called: false,
      target_system_contacted: false,
      target_receipt_created: false,
      execution_trace_bound: false,
      effect_evidence_created: false,
      customer_external_execution_allowed: false,
      external_validation_claimed: false,
      legal_review_claimed: false,
      certification_claimed: false,
      commercial_release_authorization_claimed: false,
      level4_claimed: false
    },
    blockers: [
      ...(requestReady ? [] : ["HUMAN_ACCEPTANCE_REQUEST_NOT_READY"]),
      "HUMAN_RESPONSE_NOT_RECEIVED",
      "HUMAN_DECISION_RECORD_NOT_CREATED",
      "OWNER_GATE_NOT_PASSED",
      "READINESS_UNLOCK_NOT_ALLOWED",
      "OPERATIONAL_TRANSITION_NOT_ALLOWED",
      "CUSTOMER_EXECUTION_GATE_NOT_OPEN",
      "EXTERNAL_VALIDATION_NOT_PERFORMED",
      "LEGAL_REVIEW_NOT_CLAIMED"
    ],
    maximum_supported_claim: requestReady
      ? "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_DEFINED_NO_RESPONSE_RECORDED"
      : "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_NOT_READY",
    prohibited_claims: [
      "human_accepted",
      "human_rejected",
      "human_decision_recorded",
      "owner_gate_passed",
      "readiness_unlocked",
      "operational_transition_allowed",
      "dispatch_authorized",
      "dispatch_performed",
      "external_connector_called",
      "target_system_contacted",
      "target_receipt_created",
      "execution_observed",
      "effect_observed",
      "customer_execution_allowed",
      "externally_validated",
      "legal_reviewed",
      "certified",
      "commercially_authorized",
      "level4_eligible"
    ],
    claim_boundary: {
      response_contract_defined: requestReady,
      response_contract_only: true,
      human_response_not_received: true,
      human_acceptance_not_recorded: true,
      human_rejection_not_recorded: true,
      human_decision_record_not_created: true,
      owner_gate_not_passed: true,
      readiness_not_unlocked: true,
      operational_transition_not_allowed: true,
      no_execution_chain_preserved: true,
      dispatch_authorization_not_granted: true,
      dispatch_command_not_emitted: true,
      dispatch_not_performed: true,
      external_connector_not_called: true,
      target_system_not_contacted: true,
      target_receipt_not_created: true,
      execution_trace_not_created: true,
      effect_evidence_not_created: true,
      customer_execution_not_enabled: true,
      external_validation_not_inferred: true,
      legal_review_not_inferred: true,
      certification_not_inferred: true,
      commercial_authorization_not_inferred: true,
      level4_not_inferred: true
    },
    status: requestReady
      ? "CONTRACT_DEFINED_PENDING_HUMAN_RESPONSE_NO_EXECUTION"
      : "CONTRACT_BLOCKED_INVALID_HUMAN_ACCEPTANCE_REQUEST",
    content_sha256: null
  };

  contract.content_sha256 = sha256Record({ ...contract, content_sha256: null });
  return contract;
}

function verifyHumanAcceptanceResponseContract(contractPath) {
  const errors = [];

  if (!fileExists(contractPath)) {
    const missing = {
      record_type: "HumanAcceptanceResponseContractVerificationRecord",
      contract_path: contractPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_MISSING", path: contractPath }],
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

  if (contract.contract_state !== "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_DEFINED_PENDING_RESPONSE") {
    errors.push({ code: "CONTRACT_STATE_INVALID", observed: contract.contract_state });
  }

  if (!contract.input_artifacts || contract.input_artifacts.human_acceptance_request_verified !== true) {
    errors.push({ code: "BOUND_HUMAN_ACCEPTANCE_REQUEST_NOT_VERIFIED" });
  }

  if (!contract.input_artifacts || !isSha256(contract.input_artifacts.human_acceptance_request_sha256)) {
    errors.push({ code: "BOUND_HUMAN_ACCEPTANCE_REQUEST_SHA256_INVALID" });
  }

  for (const decision of ALLOWED_DECISION_VALUES) {
    if (!Array.isArray(contract.allowed_decision_values) || !contract.allowed_decision_values.includes(decision)) {
      errors.push({ code: "ALLOWED_DECISION_VALUE_MISSING", decision });
    }
  }

  for (const field of [
    "response_record_id",
    "pilot_id",
    "source_request_id",
    "source_request_sha256",
    "human_actor_ref",
    "human_actor_role",
    "decision_value",
    "decision_statement",
    "decision_statement_sha256",
    "decision_recorded_at",
    "response_channel",
    "scope_confirmation",
    "no_execution_boundary_acknowledged"
  ]) {
    if (!Array.isArray(contract.required_response_fields) || !contract.required_response_fields.includes(field)) {
      errors.push({ code: "REQUIRED_RESPONSE_FIELD_MISSING", field });
    }
  }

  for (const key of [
    "human_response_received",
    "human_acceptance_received",
    "human_rejection_received",
    "human_decision_recorded",
    "owner_gate_passed",
    "readiness_unlock_allowed",
    "operational_transition_allowed",
    "dispatch_execution_authorized",
    "dispatch_command_emitted",
    "dispatch_performed",
    "external_connector_called",
    "target_system_contacted",
    "target_receipt_created",
    "execution_trace_bound",
    "effect_evidence_created",
    "customer_external_execution_allowed",
    "external_validation_claimed",
    "legal_review_claimed",
    "certification_claimed",
    "commercial_release_authorization_claimed",
    "level4_claimed"
  ]) {
    if (!contract.current_state || contract.current_state[key] !== false) {
      errors.push({ code: "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_OVERCLAIM", key, observed: contract.current_state ? contract.current_state[key] : undefined });
    }
  }

  for (const blocker of [
    "HUMAN_RESPONSE_NOT_RECEIVED",
    "HUMAN_DECISION_RECORD_NOT_CREATED",
    "OWNER_GATE_NOT_PASSED",
    "READINESS_UNLOCK_NOT_ALLOWED",
    "OPERATIONAL_TRANSITION_NOT_ALLOWED",
    "CUSTOMER_EXECUTION_GATE_NOT_OPEN"
  ]) {
    if (!Array.isArray(contract.blockers) || !contract.blockers.includes(blocker)) {
      errors.push({ code: "REQUIRED_BLOCKER_MISSING", blocker });
    }
  }

  for (const boundary of [
    "response_contract_defined",
    "response_contract_only",
    "human_response_not_received",
    "human_acceptance_not_recorded",
    "human_rejection_not_recorded",
    "human_decision_record_not_created",
    "owner_gate_not_passed",
    "readiness_not_unlocked",
    "operational_transition_not_allowed",
    "no_execution_chain_preserved",
    "dispatch_authorization_not_granted",
    "dispatch_command_not_emitted",
    "dispatch_not_performed",
    "external_connector_not_called",
    "target_system_not_contacted",
    "target_receipt_not_created",
    "execution_trace_not_created",
    "effect_evidence_not_created",
    "customer_execution_not_enabled",
    "external_validation_not_inferred",
    "legal_review_not_inferred",
    "certification_not_inferred",
    "commercial_authorization_not_inferred",
    "level4_not_inferred"
  ]) {
    if (!contract.claim_boundary || contract.claim_boundary[boundary] !== true) {
      errors.push({ code: "CLAIM_BOUNDARY_MISSING", boundary });
    }
  }

  const expectedHash = sha256Record({ ...contract, content_sha256: null });
  if (contract.content_sha256 !== expectedHash) {
    errors.push({
      code: "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_HASH_MISMATCH",
      expected: expectedHash,
      observed: contract.content_sha256
    });
  }

  const verification = {
    record_type: "HumanAcceptanceResponseContractVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-HUMAN-ACCEPTANCE-RESPONSE-CONTRACT-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    contract_path: contractPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    contract_state: contract.contract_state,
    response_contract_scope: contract.response_contract_scope,
    allowed_decision_values: contract.allowed_decision_values,
    current_state: contract.current_state,
    contract_sha256: baseline.contentSha256(contractPath),
    claim_boundary: {
      response_contract_only: true,
      human_response_not_received: true,
      human_decision_record_not_created: true,
      readiness_not_unlocked: true,
      no_execution_chain_preserved: true,
      dispatch_not_performed: true,
      external_connector_not_called: true,
      target_receipt_not_created: true,
      effect_evidence_not_created: true,
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
  ALLOWED_DECISION_VALUES,
  sha256Record,
  readJson,
  fileExists,
  createHumanAcceptanceResponseContract,
  verifyHumanAcceptanceResponseContract
};
