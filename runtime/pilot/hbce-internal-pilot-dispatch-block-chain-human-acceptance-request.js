"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const reviewGateRuntime = require("./hbce-internal-pilot-dispatch-block-chain-review-gate.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const REQUEST_VERSION = "HBCE-INTERNAL-PILOT-DISPATCH-BLOCK-CHAIN-HUMAN-ACCEPTANCE-REQUEST-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createRequestId(input) {
  return `human-acceptance-request-${sha256Record(input).slice(0, 24)}`;
}

function createDispatchBlockChainHumanAcceptanceRequest({
  reviewGatePath,
  requested_at = "2026-09-30T23:15:00+02:00"
}) {
  const gateVerification = reviewGateRuntime.verifyDispatchBlockChainReviewGate(reviewGatePath);
  const gate = fileExists(reviewGatePath) ? readJson(reviewGatePath) : null;

  const reviewGateReady =
    gateVerification.verified === true &&
    gate &&
    gate.review_gate_state === "NO_EXECUTION_BUNDLE_REVIEW_READY_PENDING_HUMAN_ACCEPTANCE" &&
    gate.human_acceptance_required === true &&
    gate.human_acceptance_received === false &&
    gate.readiness_unlock_allowed === false &&
    gate.dispatch_performed === false;

  const requestSeed = {
    pilot_id: PILOT_ID,
    review_gate_sha256: fileExists(reviewGatePath) ? baseline.contentSha256(reviewGatePath) : null,
    review_gate_state: gate ? gate.review_gate_state : "UNKNOWN",
    human_acceptance_state: gate ? gate.human_acceptance_state : "UNKNOWN"
  };

  const request = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchBlockChainHumanAcceptanceRequest_v001",
    artifact_type: "DispatchBlockChainHumanAcceptanceRequest",
    schema_version: REQUEST_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-215",
    source_refs: [
      "PROG-214"
    ],
    requested_at,
    input_artifacts: {
      dispatch_block_chain_review_gate_path: reviewGatePath,
      dispatch_block_chain_review_gate_sha256: fileExists(reviewGatePath) ? baseline.contentSha256(reviewGatePath) : null,
      dispatch_block_chain_review_gate_verified: gateVerification.verified === true
    },
    request_id: createRequestId(requestSeed),
    request_state: reviewGateReady
      ? "HUMAN_ACCEPTANCE_REQUEST_CREATED_PENDING_RESPONSE"
      : "HUMAN_ACCEPTANCE_REQUEST_BLOCKED_INVALID_REVIEW_GATE",
    request_type: "HUMAN_ACCEPTANCE_REQUEST_ONLY",
    requested_decision: "ACCEPT_OR_REJECT_INTERNAL_NO_EXECUTION_REVIEW_GATE",
    requested_decision_scope: "INTERNAL_STRUCTURAL_NO_EXECUTION_CHAIN_REVIEW",
    requested_human_role: "AUTHORIZED_HUMAN_OWNER_OR_DESIGNATED_REVIEWER",
    requested_human_ref: "PENDING_BINDING",
    delivery_channel: "MANUAL_OUT_OF_BAND",
    response_expected: true,
    human_acceptance_required: true,
    human_acceptance_state: "PENDING",
    human_acceptance_received: false,
    human_response_received: false,
    human_decision_recorded: false,
    human_decision_value: null,
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
    level4_claimed: false,
    bound_review_gate: {
      review_gate_state: gate ? gate.review_gate_state : "UNKNOWN",
      technical_review_result: gate ? gate.technical_review_result : "UNKNOWN",
      human_acceptance_state: gate ? gate.human_acceptance_state : "UNKNOWN",
      readiness_unlock_allowed: gate ? gate.readiness_unlock_allowed : null,
      dispatch_performed: gate ? gate.dispatch_performed : null
    },
    blockers: [
      ...(reviewGateReady ? [] : ["DISPATCH_BLOCK_CHAIN_REVIEW_GATE_NOT_READY"]),
      "HUMAN_RESPONSE_NOT_RECEIVED",
      "HUMAN_ACCEPTANCE_NOT_RECORDED",
      "HUMAN_DECISION_RECORD_NOT_CREATED",
      "OWNER_GATE_NOT_PASSED",
      "READINESS_UNLOCK_NOT_ALLOWED",
      "OPERATIONAL_TRANSITION_NOT_ALLOWED",
      "CUSTOMER_EXECUTION_GATE_NOT_OPEN",
      "EXTERNAL_VALIDATION_NOT_PERFORMED",
      "LEGAL_REVIEW_NOT_CLAIMED"
    ],
    maximum_supported_claim: reviewGateReady
      ? "HUMAN_ACCEPTANCE_REQUEST_CREATED_PENDING_RESPONSE"
      : "HUMAN_ACCEPTANCE_REQUEST_NOT_READY",
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
      human_acceptance_request_created: reviewGateReady,
      request_only: true,
      human_response_not_received: true,
      human_acceptance_not_recorded: true,
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
    status: reviewGateReady
      ? "REQUEST_CREATED_PENDING_HUMAN_RESPONSE_NO_EXECUTION"
      : "REQUEST_BLOCKED_INVALID_REVIEW_GATE",
    content_sha256: null
  };

  request.content_sha256 = sha256Record({ ...request, content_sha256: null });
  return request;
}

function verifyDispatchBlockChainHumanAcceptanceRequest(requestPath) {
  const errors = [];

  if (!fileExists(requestPath)) {
    const missing = {
      record_type: "DispatchBlockChainHumanAcceptanceRequestVerificationRecord",
      request_path: requestPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "HUMAN_ACCEPTANCE_REQUEST_MISSING", path: requestPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const request = readJson(requestPath);

  if (request.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: request.pilot_id });
  }

  if (request.schema_version !== REQUEST_VERSION) {
    errors.push({ code: "REQUEST_VERSION_MISMATCH", observed: request.schema_version });
  }

  if (request.request_state !== "HUMAN_ACCEPTANCE_REQUEST_CREATED_PENDING_RESPONSE") {
    errors.push({ code: "REQUEST_STATE_INVALID", observed: request.request_state });
  }

  if (request.request_type !== "HUMAN_ACCEPTANCE_REQUEST_ONLY") {
    errors.push({ code: "REQUEST_TYPE_INVALID", observed: request.request_type });
  }

  if (!request.input_artifacts || request.input_artifacts.dispatch_block_chain_review_gate_verified !== true) {
    errors.push({ code: "BOUND_REVIEW_GATE_NOT_VERIFIED" });
  }

  for (const key of [
    "human_acceptance_received",
    "human_response_received",
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
    if (request[key] !== false) {
      errors.push({ code: "HUMAN_ACCEPTANCE_REQUEST_OVERCLAIM", key, observed: request[key] });
    }
  }

  for (const blocker of [
    "HUMAN_RESPONSE_NOT_RECEIVED",
    "HUMAN_ACCEPTANCE_NOT_RECORDED",
    "HUMAN_DECISION_RECORD_NOT_CREATED",
    "OWNER_GATE_NOT_PASSED",
    "READINESS_UNLOCK_NOT_ALLOWED",
    "OPERATIONAL_TRANSITION_NOT_ALLOWED",
    "CUSTOMER_EXECUTION_GATE_NOT_OPEN"
  ]) {
    if (!Array.isArray(request.blockers) || !request.blockers.includes(blocker)) {
      errors.push({ code: "REQUIRED_BLOCKER_MISSING", blocker });
    }
  }

  for (const boundary of [
    "human_acceptance_request_created",
    "request_only",
    "human_response_not_received",
    "human_acceptance_not_recorded",
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
    if (!request.claim_boundary || request.claim_boundary[boundary] !== true) {
      errors.push({ code: "CLAIM_BOUNDARY_MISSING", boundary });
    }
  }

  const expectedHash = sha256Record({ ...request, content_sha256: null });
  if (request.content_sha256 !== expectedHash) {
    errors.push({
      code: "HUMAN_ACCEPTANCE_REQUEST_HASH_MISMATCH",
      expected: expectedHash,
      observed: request.content_sha256
    });
  }

  const verification = {
    record_type: "DispatchBlockChainHumanAcceptanceRequestVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-DISPATCH-BLOCK-CHAIN-HUMAN-ACCEPTANCE-REQUEST-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    request_path: requestPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    request_state: request.request_state,
    request_type: request.request_type,
    human_acceptance_state: request.human_acceptance_state,
    human_response_received: request.human_response_received,
    human_decision_recorded: request.human_decision_recorded,
    readiness_unlock_allowed: request.readiness_unlock_allowed,
    dispatch_performed: request.dispatch_performed,
    effect_evidence_created: request.effect_evidence_created,
    request_sha256: baseline.contentSha256(requestPath),
    claim_boundary: {
      request_only: true,
      human_response_not_received: true,
      human_acceptance_not_recorded: true,
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
  REQUEST_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createRequestId,
  createDispatchBlockChainHumanAcceptanceRequest,
  verifyDispatchBlockChainHumanAcceptanceRequest
};
