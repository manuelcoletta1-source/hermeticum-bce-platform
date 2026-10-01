"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const bundleRuntime = require("./hbce-internal-pilot-dispatch-block-chain-evidence-bundle.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const REVIEW_GATE_VERSION = "HBCE-INTERNAL-PILOT-DISPATCH-BLOCK-CHAIN-REVIEW-GATE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createDispatchBlockChainReviewGate({
  bundlePath,
  evaluated_at = "2026-09-30T23:00:00+02:00"
}) {
  const bundleVerification = bundleRuntime.verifyDispatchBlockChainEvidenceBundle(bundlePath);
  const bundle = fileExists(bundlePath) ? readJson(bundlePath) : null;

  const bundleVerifiedNoExecution =
    bundleVerification.verified === true &&
    bundle &&
    bundle.bundle_state === "DISPATCH_BLOCK_CHAIN_BUNDLED" &&
    bundle.chain_closure_state === "CLOSED_AT_AUTHORITY_BLOCK_NO_EXECUTION" &&
    bundle.execution_state === "NOT_EXECUTED";

  const gate = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchBlockChainReviewGate_v001",
    artifact_type: "DispatchBlockChainReviewGate",
    schema_version: REVIEW_GATE_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-214",
    source_refs: [
      "PROG-213"
    ],
    evaluated_at,
    input_artifacts: {
      dispatch_block_chain_bundle_path: bundlePath,
      dispatch_block_chain_bundle_sha256: fileExists(bundlePath) ? baseline.contentSha256(bundlePath) : null,
      dispatch_block_chain_bundle_verified: bundleVerification.verified === true
    },
    review_gate_state: bundleVerifiedNoExecution
      ? "NO_EXECUTION_BUNDLE_REVIEW_READY_PENDING_HUMAN_ACCEPTANCE"
      : "NO_EXECUTION_BUNDLE_REVIEW_BLOCKED_INVALID_INPUT",
    technical_review_result: bundleVerifiedNoExecution
      ? "PASS_STRUCTURAL_NO_EXECUTION_CHAIN"
      : "FAIL_INVALID_OR_INCOMPLETE_BUNDLE",
    human_acceptance_required: true,
    human_acceptance_state: "PENDING",
    human_acceptance_received: false,
    human_reviewer_bound: false,
    owner_gate_passed: false,
    operational_transition_allowed: false,
    readiness_unlock_allowed: false,
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
    reviewed_chain: {
      bundle_state: bundle ? bundle.bundle_state : "UNKNOWN",
      chain_closure_state: bundle ? bundle.chain_closure_state : "UNKNOWN",
      execution_state: bundle ? bundle.execution_state : "UNKNOWN",
      evidence_scope: bundle ? bundle.evidence_scope : "UNKNOWN",
      source_refs: bundle ? bundle.source_refs : []
    },
    blockers: [
      ...(bundleVerifiedNoExecution ? [] : ["DISPATCH_BLOCK_CHAIN_BUNDLE_NOT_VERIFIED"]),
      "HUMAN_ACCEPTANCE_PENDING",
      "HUMAN_REVIEWER_NOT_BOUND",
      "OWNER_GATE_NOT_PASSED",
      "OPERATIONAL_TRANSITION_NOT_ALLOWED",
      "READINESS_UNLOCK_NOT_ALLOWED",
      "CUSTOMER_EXECUTION_GATE_NOT_OPEN",
      "EXTERNAL_VALIDATION_NOT_PERFORMED",
      "LEGAL_REVIEW_NOT_CLAIMED"
    ],
    maximum_supported_claim: bundleVerifiedNoExecution
      ? "INTERNAL_NO_EXECUTION_BUNDLE_REVIEW_READY_PENDING_HUMAN_ACCEPTANCE"
      : "INTERNAL_NO_EXECUTION_BUNDLE_REVIEW_NOT_READY",
    prohibited_claims: [
      "human_accepted",
      "review_approved",
      "owner_gate_passed",
      "readiness_unlocked",
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
      review_gate_created: true,
      internal_structural_review_only: true,
      human_acceptance_not_received: true,
      human_reviewer_not_bound: true,
      owner_gate_not_passed: true,
      readiness_not_unlocked: true,
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
    status: bundleVerifiedNoExecution
      ? "REVIEW_GATE_READY_PENDING_HUMAN_ACCEPTANCE_NO_EXECUTION"
      : "REVIEW_GATE_BLOCKED_INVALID_INPUT",
    content_sha256: null
  };

  gate.content_sha256 = sha256Record({ ...gate, content_sha256: null });
  return gate;
}

function verifyDispatchBlockChainReviewGate(gatePath) {
  const errors = [];

  if (!fileExists(gatePath)) {
    const missing = {
      record_type: "DispatchBlockChainReviewGateVerificationRecord",
      gate_path: gatePath,
      verified: false,
      error_count: 1,
      errors: [{ code: "DISPATCH_BLOCK_CHAIN_REVIEW_GATE_MISSING", path: gatePath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const gate = readJson(gatePath);

  if (gate.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: gate.pilot_id });
  }

  if (gate.schema_version !== REVIEW_GATE_VERSION) {
    errors.push({ code: "REVIEW_GATE_VERSION_MISMATCH", observed: gate.schema_version });
  }

  if (gate.review_gate_state !== "NO_EXECUTION_BUNDLE_REVIEW_READY_PENDING_HUMAN_ACCEPTANCE") {
    errors.push({ code: "REVIEW_GATE_STATE_INVALID", observed: gate.review_gate_state });
  }

  if (gate.technical_review_result !== "PASS_STRUCTURAL_NO_EXECUTION_CHAIN") {
    errors.push({ code: "TECHNICAL_REVIEW_RESULT_INVALID", observed: gate.technical_review_result });
  }

  if (!gate.input_artifacts || gate.input_artifacts.dispatch_block_chain_bundle_verified !== true) {
    errors.push({ code: "BOUND_BUNDLE_NOT_VERIFIED" });
  }

  for (const key of [
    "human_acceptance_received",
    "human_reviewer_bound",
    "owner_gate_passed",
    "operational_transition_allowed",
    "readiness_unlock_allowed",
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
    if (gate[key] !== false) {
      errors.push({ code: "REVIEW_GATE_OVERCLAIM", key, observed: gate[key] });
    }
  }

  for (const blocker of [
    "HUMAN_ACCEPTANCE_PENDING",
    "HUMAN_REVIEWER_NOT_BOUND",
    "OWNER_GATE_NOT_PASSED",
    "OPERATIONAL_TRANSITION_NOT_ALLOWED",
    "READINESS_UNLOCK_NOT_ALLOWED",
    "CUSTOMER_EXECUTION_GATE_NOT_OPEN",
    "EXTERNAL_VALIDATION_NOT_PERFORMED",
    "LEGAL_REVIEW_NOT_CLAIMED"
  ]) {
    if (!Array.isArray(gate.blockers) || !gate.blockers.includes(blocker)) {
      errors.push({ code: "REQUIRED_BLOCKER_MISSING", blocker });
    }
  }

  for (const boundary of [
    "review_gate_created",
    "internal_structural_review_only",
    "human_acceptance_not_received",
    "human_reviewer_not_bound",
    "owner_gate_not_passed",
    "readiness_not_unlocked",
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
      code: "DISPATCH_BLOCK_CHAIN_REVIEW_GATE_HASH_MISMATCH",
      expected: expectedHash,
      observed: gate.content_sha256
    });
  }

  const verification = {
    record_type: "DispatchBlockChainReviewGateVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-DISPATCH-BLOCK-CHAIN-REVIEW-GATE-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    gate_path: gatePath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    review_gate_state: gate.review_gate_state,
    technical_review_result: gate.technical_review_result,
    human_acceptance_state: gate.human_acceptance_state,
    human_acceptance_received: gate.human_acceptance_received,
    readiness_unlock_allowed: gate.readiness_unlock_allowed,
    dispatch_execution_authorized: gate.dispatch_execution_authorized,
    dispatch_performed: gate.dispatch_performed,
    external_connector_called: gate.external_connector_called,
    target_receipt_created: gate.target_receipt_created,
    effect_evidence_created: gate.effect_evidence_created,
    gate_sha256: baseline.contentSha256(gatePath),
    claim_boundary: {
      internal_structural_review_only: true,
      human_acceptance_not_received: true,
      readiness_not_unlocked: true,
      no_execution_chain_preserved: true,
      dispatch_authorization_not_granted: true,
      dispatch_not_performed: true,
      external_connector_not_called: true,
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
  REVIEW_GATE_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createDispatchBlockChainReviewGate,
  verifyDispatchBlockChainReviewGate
};
