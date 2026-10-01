"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const contractRuntime = require("./hbce-internal-pilot-human-acceptance-response-contract.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const INTAKE_GATE_VERSION = "HBCE-INTERNAL-PILOT-HUMAN-RESPONSE-INTAKE-GATE-V0.1";

const ALLOWED_HUMAN_ACTOR_ROLES = [
  "AUTHORIZED_HUMAN_OWNER",
  "DESIGNATED_HUMAN_REVIEWER"
];

const PROHIBITED_TRUE_CANDIDATE_FLAGS = [
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

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function createHumanResponseIntakeGate({
  contractPath,
  generated_at = "2026-09-30T23:45:00+02:00"
}) {
  const contractVerification = contractRuntime.verifyHumanAcceptanceResponseContract(contractPath);
  const contract = fileExists(contractPath) ? readJson(contractPath) : null;

  const contractReady =
    contractVerification.verified === true &&
    contract &&
    contract.contract_state === "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_DEFINED_PENDING_RESPONSE" &&
    contract.current_state &&
    contract.current_state.human_response_received === false &&
    contract.current_state.human_decision_recorded === false &&
    contract.current_state.readiness_unlock_allowed === false &&
    contract.current_state.dispatch_performed === false;

  const gate = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_HumanResponseIntakeGate_v001",
    artifact_type: "HumanResponseIntakeGate",
    schema_version: INTAKE_GATE_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-217",
    source_refs: [
      "PROG-216"
    ],
    generated_at,
    input_artifacts: {
      human_acceptance_response_contract_path: contractPath,
      human_acceptance_response_contract_sha256: fileExists(contractPath) ? baseline.contentSha256(contractPath) : null,
      human_acceptance_response_contract_verified: contractVerification.verified === true,
      bound_request_id: contract && contract.input_artifacts ? contract.input_artifacts.bound_request_id : null,
      bound_request_sha256: contract && contract.input_artifacts ? contract.input_artifacts.human_acceptance_request_sha256 : null
    },
    intake_gate_state: contractReady
      ? "HUMAN_RESPONSE_INTAKE_READY_PENDING_EXPLICIT_RESPONSE"
      : "HUMAN_RESPONSE_INTAKE_BLOCKED_INVALID_CONTRACT",
    intake_scope: "INTERNAL_STRUCTURAL_NO_EXECUTION_CHAIN_REVIEW",
    accepted_response_record_type: "HumanAcceptanceResponseRecord",
    allowed_decision_values: contract ? contract.allowed_decision_values : contractRuntime.ALLOWED_DECISION_VALUES,
    allowed_human_actor_roles: ALLOWED_HUMAN_ACTOR_ROLES,
    required_response_fields: contract ? contract.required_response_fields : [],
    validation_capabilities: {
      can_validate_candidate_response: contractReady,
      can_persist_response: false,
      can_create_human_decision_record: false,
      can_pass_owner_gate: false,
      can_unlock_readiness: false,
      can_authorize_dispatch: false,
      can_perform_dispatch: false,
      can_create_effect_evidence: false,
      can_claim_external_validation: false,
      can_claim_legal_review: false,
      can_claim_certification: false,
      can_claim_commercial_authorization: false,
      can_claim_level4: false
    },
    current_state: {
      human_response_received: false,
      candidate_response_validated: false,
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
      ...(contractReady ? [] : ["HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_NOT_READY"]),
      "HUMAN_RESPONSE_NOT_RECEIVED",
      "HUMAN_RESPONSE_NOT_VALIDATED",
      "HUMAN_DECISION_RECORD_NOT_CREATED",
      "OWNER_GATE_NOT_PASSED",
      "READINESS_UNLOCK_NOT_ALLOWED",
      "OPERATIONAL_TRANSITION_NOT_ALLOWED",
      "CUSTOMER_EXECUTION_GATE_NOT_OPEN",
      "EXTERNAL_VALIDATION_NOT_PERFORMED",
      "LEGAL_REVIEW_NOT_CLAIMED"
    ],
    maximum_supported_claim: contractReady
      ? "HUMAN_RESPONSE_INTAKE_GATE_READY_NO_RESPONSE_RECORDED"
      : "HUMAN_RESPONSE_INTAKE_GATE_NOT_READY",
    prohibited_claims: [
      "human_response_received",
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
      intake_gate_ready: contractReady,
      intake_gate_only: true,
      human_response_not_received: true,
      candidate_response_not_persisted: true,
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
    status: contractReady
      ? "INTAKE_READY_PENDING_EXPLICIT_HUMAN_RESPONSE_NO_EXECUTION"
      : "INTAKE_BLOCKED_INVALID_RESPONSE_CONTRACT",
    content_sha256: null
  };

  gate.content_sha256 = sha256Record({ ...gate, content_sha256: null });
  return gate;
}

function verifyHumanResponseIntakeGate(gatePath) {
  const errors = [];

  if (!fileExists(gatePath)) {
    const missing = {
      record_type: "HumanResponseIntakeGateVerificationRecord",
      gate_path: gatePath,
      verified: false,
      error_count: 1,
      errors: [{ code: "HUMAN_RESPONSE_INTAKE_GATE_MISSING", path: gatePath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const gate = readJson(gatePath);

  if (gate.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: gate.pilot_id });
  }

  if (gate.schema_version !== INTAKE_GATE_VERSION) {
    errors.push({ code: "INTAKE_GATE_VERSION_MISMATCH", observed: gate.schema_version });
  }

  if (gate.intake_gate_state !== "HUMAN_RESPONSE_INTAKE_READY_PENDING_EXPLICIT_RESPONSE") {
    errors.push({ code: "INTAKE_GATE_STATE_INVALID", observed: gate.intake_gate_state });
  }

  if (!gate.input_artifacts || gate.input_artifacts.human_acceptance_response_contract_verified !== true) {
    errors.push({ code: "BOUND_RESPONSE_CONTRACT_NOT_VERIFIED" });
  }

  if (!gate.input_artifacts || !isSha256(gate.input_artifacts.human_acceptance_response_contract_sha256)) {
    errors.push({ code: "BOUND_RESPONSE_CONTRACT_SHA256_INVALID" });
  }

  for (const decision of contractRuntime.ALLOWED_DECISION_VALUES) {
    if (!Array.isArray(gate.allowed_decision_values) || !gate.allowed_decision_values.includes(decision)) {
      errors.push({ code: "ALLOWED_DECISION_VALUE_MISSING", decision });
    }
  }

  for (const role of ALLOWED_HUMAN_ACTOR_ROLES) {
    if (!Array.isArray(gate.allowed_human_actor_roles) || !gate.allowed_human_actor_roles.includes(role)) {
      errors.push({ code: "ALLOWED_HUMAN_ROLE_MISSING", role });
    }
  }

  if (!gate.validation_capabilities || gate.validation_capabilities.can_validate_candidate_response !== true) {
    errors.push({ code: "CANDIDATE_VALIDATION_NOT_ENABLED" });
  }

  for (const key of [
    "can_persist_response",
    "can_create_human_decision_record",
    "can_pass_owner_gate",
    "can_unlock_readiness",
    "can_authorize_dispatch",
    "can_perform_dispatch",
    "can_create_effect_evidence",
    "can_claim_external_validation",
    "can_claim_legal_review",
    "can_claim_certification",
    "can_claim_commercial_authorization",
    "can_claim_level4"
  ]) {
    if (!gate.validation_capabilities || gate.validation_capabilities[key] !== false) {
      errors.push({ code: "INTAKE_CAPABILITY_OVERCLAIM", key, observed: gate.validation_capabilities ? gate.validation_capabilities[key] : undefined });
    }
  }

  for (const key of [
    "human_response_received",
    "candidate_response_validated",
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
    if (!gate.current_state || gate.current_state[key] !== false) {
      errors.push({ code: "HUMAN_RESPONSE_INTAKE_GATE_OVERCLAIM", key, observed: gate.current_state ? gate.current_state[key] : undefined });
    }
  }

  for (const blocker of [
    "HUMAN_RESPONSE_NOT_RECEIVED",
    "HUMAN_RESPONSE_NOT_VALIDATED",
    "HUMAN_DECISION_RECORD_NOT_CREATED",
    "OWNER_GATE_NOT_PASSED",
    "READINESS_UNLOCK_NOT_ALLOWED",
    "OPERATIONAL_TRANSITION_NOT_ALLOWED",
    "CUSTOMER_EXECUTION_GATE_NOT_OPEN"
  ]) {
    if (!Array.isArray(gate.blockers) || !gate.blockers.includes(blocker)) {
      errors.push({ code: "REQUIRED_BLOCKER_MISSING", blocker });
    }
  }

  for (const boundary of [
    "intake_gate_ready",
    "intake_gate_only",
    "human_response_not_received",
    "candidate_response_not_persisted",
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
    if (!gate.claim_boundary || gate.claim_boundary[boundary] !== true) {
      errors.push({ code: "CLAIM_BOUNDARY_MISSING", boundary });
    }
  }

  const expectedHash = sha256Record({ ...gate, content_sha256: null });
  if (gate.content_sha256 !== expectedHash) {
    errors.push({
      code: "HUMAN_RESPONSE_INTAKE_GATE_HASH_MISMATCH",
      expected: expectedHash,
      observed: gate.content_sha256
    });
  }

  const verification = {
    record_type: "HumanResponseIntakeGateVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-HUMAN-RESPONSE-INTAKE-GATE-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    gate_path: gatePath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    intake_gate_state: gate.intake_gate_state,
    intake_scope: gate.intake_scope,
    current_state: gate.current_state,
    validation_capabilities: gate.validation_capabilities,
    gate_sha256: baseline.contentSha256(gatePath),
    claim_boundary: {
      intake_gate_only: true,
      human_response_not_received: true,
      candidate_response_not_persisted: true,
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

function validateCandidateHumanAcceptanceResponse({ candidate, gatePath }) {
  const errors = [];
  const gateVerification = verifyHumanResponseIntakeGate(gatePath);
  const gate = fileExists(gatePath) ? readJson(gatePath) : null;

  if (gateVerification.verified !== true || !gate) {
    errors.push({ code: "INTAKE_GATE_NOT_VERIFIED" });
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
    if (!candidate || !(field in candidate)) {
      errors.push({ code: "CANDIDATE_RESPONSE_FIELD_MISSING", field });
    }
  }

  if (candidate && candidate.pilot_id !== PILOT_ID) {
    errors.push({ code: "CANDIDATE_PILOT_ID_MISMATCH", observed: candidate.pilot_id });
  }

  if (gate && candidate && candidate.source_request_id !== gate.input_artifacts.bound_request_id) {
    errors.push({ code: "CANDIDATE_SOURCE_REQUEST_ID_MISMATCH", observed: candidate.source_request_id });
  }

  if (gate && candidate && candidate.source_request_sha256 !== gate.input_artifacts.bound_request_sha256) {
    errors.push({ code: "CANDIDATE_SOURCE_REQUEST_SHA256_MISMATCH", observed: candidate.source_request_sha256 });
  }

  if (!candidate || !ALLOWED_HUMAN_ACTOR_ROLES.includes(candidate.human_actor_role)) {
    errors.push({ code: "CANDIDATE_HUMAN_ACTOR_ROLE_INVALID", observed: candidate ? candidate.human_actor_role : undefined });
  }

  if (!candidate || !isNonEmptyString(candidate.human_actor_ref) || candidate.human_actor_ref === "PENDING_BINDING") {
    errors.push({ code: "CANDIDATE_HUMAN_ACTOR_REF_INVALID", observed: candidate ? candidate.human_actor_ref : undefined });
  }

  if (candidate && /^(AI|JOKER|JOKER-C2|AUTOMATED|SYSTEM)$/i.test(candidate.human_actor_ref)) {
    errors.push({ code: "CANDIDATE_AI_ACTOR_DISALLOWED", observed: candidate.human_actor_ref });
  }

  if (!candidate || !contractRuntime.ALLOWED_DECISION_VALUES.includes(candidate.decision_value)) {
    errors.push({ code: "CANDIDATE_DECISION_VALUE_INVALID", observed: candidate ? candidate.decision_value : undefined });
  }

  if (!candidate || !isNonEmptyString(candidate.decision_statement)) {
    errors.push({ code: "CANDIDATE_DECISION_STATEMENT_MISSING" });
  }

  if (!candidate || !isSha256(candidate.decision_statement_sha256)) {
    errors.push({ code: "CANDIDATE_DECISION_STATEMENT_SHA256_INVALID", observed: candidate ? candidate.decision_statement_sha256 : undefined });
  } else if (candidate.decision_statement_sha256 !== sha256Record(candidate.decision_statement)) {
    errors.push({ code: "CANDIDATE_DECISION_STATEMENT_SHA256_MISMATCH" });
  }

  if (!candidate || candidate.scope_confirmation !== "INTERNAL_STRUCTURAL_NO_EXECUTION_CHAIN_REVIEW") {
    errors.push({ code: "CANDIDATE_SCOPE_CONFIRMATION_INVALID", observed: candidate ? candidate.scope_confirmation : undefined });
  }

  if (!candidate || candidate.no_execution_boundary_acknowledged !== true) {
    errors.push({ code: "CANDIDATE_NO_EXECUTION_BOUNDARY_NOT_ACKNOWLEDGED" });
  }

  for (const key of PROHIBITED_TRUE_CANDIDATE_FLAGS) {
    if (candidate && candidate[key] === true) {
      errors.push({ code: "CANDIDATE_RESPONSE_OVERCLAIM", key });
    }
  }

  const validation = {
    record_type: "CandidateHumanAcceptanceResponseValidationRecord",
    validator_version: "HBCE-INTERNAL-PILOT-HUMAN-RESPONSE-INTAKE-GATE-CANDIDATE-VALIDATOR-V0.1",
    pilot_id: PILOT_ID,
    candidate_structurally_valid: errors.length === 0,
    error_count: errors.length,
    errors,
    candidate_decision_value: candidate ? candidate.decision_value : null,
    persistence_authorized: false,
    human_decision_record_created: false,
    owner_gate_passed: false,
    readiness_unlock_allowed: false,
    dispatch_performed: false,
    effect_evidence_created: false,
    maximum_supported_claim: errors.length === 0
      ? "CANDIDATE_HUMAN_RESPONSE_STRUCTURALLY_VALID_NOT_RECORDED"
      : "CANDIDATE_HUMAN_RESPONSE_INVALID_NOT_RECORDED",
    record_sha256: null
  };

  validation.record_sha256 = sha256Record({ ...validation, record_sha256: null });
  return validation;
}

module.exports = {
  PILOT_ID,
  INTAKE_GATE_VERSION,
  ALLOWED_HUMAN_ACTOR_ROLES,
  PROHIBITED_TRUE_CANDIDATE_FLAGS,
  sha256Record,
  readJson,
  fileExists,
  createHumanResponseIntakeGate,
  verifyHumanResponseIntakeGate,
  validateCandidateHumanAcceptanceResponse
};
