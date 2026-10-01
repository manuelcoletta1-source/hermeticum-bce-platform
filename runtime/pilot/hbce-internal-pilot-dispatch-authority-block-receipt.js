"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const gateRuntime = require("./hbce-internal-pilot-dispatch-authority-gate.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const BLOCK_RECEIPT_VERSION = "HBCE-INTERNAL-PILOT-DISPATCH-AUTHORITY-BLOCK-RECEIPT-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createBlockReceiptId(input) {
  return `authority-block-${sha256Record(input).slice(0, 24)}`;
}

function createDispatchAuthorityBlockReceipt({
  gatePath,
  recorded_at = "2026-09-30T22:30:00+02:00"
}) {
  const gateVerification = gateRuntime.verifyDispatchAuthorityGate(gatePath);
  const gate = fileExists(gatePath) ? readJson(gatePath) : null;

  const seed = {
    pilot_id: PILOT_ID,
    gate_sha256: fileExists(gatePath) ? baseline.contentSha256(gatePath) : null,
    gate_state: gate ? gate.dispatch_authority_gate_state : "UNKNOWN",
    dispatch_execution_authorized: gate ? gate.dispatch_execution_authorized : null
  };

  const receipt = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchAuthorityBlockReceipt_v001",
    artifact_type: "DispatchAuthorityBlockReceipt",
    schema_version: BLOCK_RECEIPT_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-212",
    source_refs: [
      "PROG-211"
    ],
    recorded_at,
    input_artifacts: {
      dispatch_authority_gate_path: gatePath,
      dispatch_authority_gate_sha256: seed.gate_sha256,
      dispatch_authority_gate_verified: gateVerification.verified === true
    },
    block_receipt_id: createBlockReceiptId(seed),
    receipt_state: gateVerification.verified === true ? "AUTHORITY_BLOCK_RECEIPT_RECORDED" : "AUTHORITY_BLOCK_RECEIPT_INVALID_INPUT",
    bound_gate_state: gate ? gate.dispatch_authority_gate_state : "UNKNOWN",
    dispatch_execution_authorized: false,
    dispatch_command_emitted: false,
    external_connector_called: false,
    target_system_contacted: false,
    target_receipt_created: false,
    execution_trace_bound: false,
    effect_evidence_created: false,
    operational_allowed: false,
    customer_external_execution_allowed: false,
    maximum_supported_claim: "AUTHORITY_BLOCK_RECORDED_NO_EXECUTION",
    block_reasons: gate && Array.isArray(gate.blockers) ? gate.blockers.slice() : [
      "DISPATCH_AUTHORITY_GATE_NOT_VERIFIED"
    ],
    receipt_boundary: {
      internal_authority_block_receipt: true,
      target_receipt: false,
      execution_receipt: false,
      external_effect_receipt: false,
      legal_receipt: false,
      certification_receipt: false,
      commercial_release_receipt: false
    },
    claim_boundary: {
      block_recorded: true,
      gate_bound: gateVerification.verified === true,
      fail_closed_block_active: true,
      dispatch_authorization_not_granted: true,
      dispatch_command_not_emitted: true,
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
    prohibited_claims: [
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
      "commercially_authorized",
      "level4_eligible"
    ],
    status: "AUTHORITY_BLOCK_RECORDED_FAIL_CLOSED",
    content_sha256: null
  };

  receipt.content_sha256 = sha256Record({ ...receipt, content_sha256: null });
  return receipt;
}

function verifyDispatchAuthorityBlockReceipt(receiptPath) {
  const errors = [];

  if (!fileExists(receiptPath)) {
    const missing = {
      record_type: "DispatchAuthorityBlockReceiptVerificationRecord",
      receipt_path: receiptPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "DISPATCH_AUTHORITY_BLOCK_RECEIPT_MISSING", path: receiptPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const receipt = readJson(receiptPath);

  if (receipt.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: receipt.pilot_id });
  }

  if (receipt.schema_version !== BLOCK_RECEIPT_VERSION) {
    errors.push({ code: "BLOCK_RECEIPT_VERSION_MISMATCH", observed: receipt.schema_version });
  }

  if (receipt.receipt_state !== "AUTHORITY_BLOCK_RECEIPT_RECORDED") {
    errors.push({ code: "BLOCK_RECEIPT_NOT_RECORDED", observed: receipt.receipt_state });
  }

  if (receipt.bound_gate_state !== "BLOCKED_FAIL_CLOSED") {
    errors.push({ code: "BOUND_GATE_NOT_BLOCKED", observed: receipt.bound_gate_state });
  }

  for (const key of [
    "dispatch_execution_authorized",
    "dispatch_command_emitted",
    "external_connector_called",
    "target_system_contacted",
    "target_receipt_created",
    "execution_trace_bound",
    "effect_evidence_created",
    "operational_allowed",
    "customer_external_execution_allowed"
  ]) {
    if (receipt[key] !== false) {
      errors.push({ code: "AUTHORITY_BLOCK_RECEIPT_OVERCLAIM", key, observed: receipt[key] });
    }
  }

  if (!receipt.receipt_boundary || receipt.receipt_boundary.internal_authority_block_receipt !== true) {
    errors.push({ code: "INTERNAL_BLOCK_RECEIPT_BOUNDARY_MISSING" });
  }

  for (const forbiddenReceipt of [
    "target_receipt",
    "execution_receipt",
    "external_effect_receipt",
    "legal_receipt",
    "certification_receipt",
    "commercial_release_receipt"
  ]) {
    if (!receipt.receipt_boundary || receipt.receipt_boundary[forbiddenReceipt] !== false) {
      errors.push({
        code: "RECEIPT_TYPE_OVERCLAIM",
        receipt_type: forbiddenReceipt,
        observed: receipt.receipt_boundary ? receipt.receipt_boundary[forbiddenReceipt] : undefined
      });
    }
  }

  for (const boundary of [
    "fail_closed_block_active",
    "dispatch_authorization_not_granted",
    "dispatch_command_not_emitted",
    "external_connector_not_called",
    "target_system_not_contacted",
    "target_receipt_not_created",
    "execution_trace_not_created",
    "effect_evidence_not_created",
    "level4_not_inferred"
  ]) {
    if (!receipt.claim_boundary || receipt.claim_boundary[boundary] !== true) {
      errors.push({ code: "CLAIM_BOUNDARY_MISSING", boundary });
    }
  }

  for (const reason of [
    "M1_OWNER_GATE_BLOCKED",
    "OPERATIONAL_ALLOWED_FALSE",
    "HUMAN_GO_NOT_BOUND",
    "DISPATCH_EXECUTION_AUTHORITY_NOT_GRANTED",
    "EXTERNAL_CONNECTOR_EXECUTION_NOT_AUTHORIZED"
  ]) {
    if (!Array.isArray(receipt.block_reasons) || !receipt.block_reasons.includes(reason)) {
      errors.push({ code: "BLOCK_REASON_MISSING", reason });
    }
  }

  const expectedHash = sha256Record({ ...receipt, content_sha256: null });
  if (receipt.content_sha256 !== expectedHash) {
    errors.push({
      code: "DISPATCH_AUTHORITY_BLOCK_RECEIPT_HASH_MISMATCH",
      expected: expectedHash,
      observed: receipt.content_sha256
    });
  }

  const verification = {
    record_type: "DispatchAuthorityBlockReceiptVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-DISPATCH-AUTHORITY-BLOCK-RECEIPT-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    receipt_path: receiptPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    receipt_state: receipt.receipt_state,
    bound_gate_state: receipt.bound_gate_state,
    dispatch_execution_authorized: receipt.dispatch_execution_authorized,
    dispatch_command_emitted: receipt.dispatch_command_emitted,
    external_connector_called: receipt.external_connector_called,
    target_system_contacted: receipt.target_system_contacted,
    target_receipt_created: receipt.target_receipt_created,
    execution_trace_bound: receipt.execution_trace_bound,
    effect_evidence_created: receipt.effect_evidence_created,
    operational_allowed: receipt.operational_allowed,
    receipt_sha256: baseline.contentSha256(receiptPath),
    claim_boundary: {
      fail_closed_block_active: true,
      dispatch_authorization_not_granted: true,
      dispatch_command_not_emitted: true,
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
  BLOCK_RECEIPT_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createBlockReceiptId,
  createDispatchAuthorityBlockReceipt,
  verifyDispatchAuthorityBlockReceipt
};
