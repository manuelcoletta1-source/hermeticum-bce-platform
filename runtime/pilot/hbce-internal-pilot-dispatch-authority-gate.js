"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const dispatchRuntime = require("./hbce-internal-pilot-dispatch-preparation.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const GATE_VERSION = "HBCE-INTERNAL-PILOT-DISPATCH-AUTHORITY-GATE-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createDispatchAuthorityGate({
  dispatchPreparationPath,
  evaluated_at = "2026-09-30T22:15:00+02:00"
}) {
  const dispatchVerification = dispatchRuntime.verifyDispatchPreparation(dispatchPreparationPath);
  const dispatchPreparation = fileExists(dispatchPreparationPath) ? readJson(dispatchPreparationPath) : null;

  const dispatchPrepared =
    dispatchVerification.verified === true &&
    dispatchPreparation &&
    dispatchPreparation.dispatch_prepared === true &&
    dispatchPreparation.trace_state === "DISPATCH_PREPARED";

  const blockers = [
    ...(dispatchPrepared ? [] : ["DISPATCH_PREPARATION_NOT_VERIFIED"]),
    "M1_OWNER_GATE_BLOCKED",
    "OPERATIONAL_ALLOWED_FALSE",
    "HUMAN_GO_NOT_BOUND",
    "DISPATCH_EXECUTION_AUTHORITY_NOT_GRANTED",
    "EXTERNAL_CONNECTOR_EXECUTION_NOT_AUTHORIZED",
    "CUSTOMER_EXECUTION_GATE_NOT_OPEN",
    "C16_NOT_PERFORMED",
    "LEGAL_REVIEW_NOT_CLAIMED"
  ];

  const gate = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchAuthorityGate_v001",
    artifact_type: "DispatchAuthorityGate",
    schema_version: GATE_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-211",
    source_refs: [
      "PROG-210"
    ],
    evaluated_at,
    input_artifacts: {
      dispatch_preparation_path: dispatchPreparationPath,
      dispatch_preparation_sha256: fileExists(dispatchPreparationPath) ? baseline.contentSha256(dispatchPreparationPath) : null,
      dispatch_preparation_verified: dispatchVerification.verified === true
    },
    dispatch_authority_gate_state: "BLOCKED_FAIL_CLOSED",
    dispatch_execution_authorized: false,
    dispatch_command_may_be_emitted: false,
    external_connector_call_allowed: false,
    target_system_contact_allowed: false,
    customer_external_execution_allowed: false,
    operational_allowed: false,
    observed_dispatch_state: dispatchPreparation ? dispatchPreparation.trace_state : "UNKNOWN",
    observed_dispatch_prepared: dispatchPreparation ? dispatchPreparation.dispatch_prepared : false,
    observed_dispatch_performed: dispatchPreparation ? dispatchPreparation.dispatch_performed : false,
    evaluated_predicates: {
      dispatch_preparation_verified: dispatchVerification.verified === true,
      dispatch_prepared: dispatchPrepared,
      owner_gate_passed: false,
      human_go_bound: false,
      operational_allowed: false,
      external_connector_authorized: false,
      customer_execution_gate_open: false,
      legal_review_claimed: false,
      c16_external_validation_performed: false
    },
    blockers,
    maximum_supported_claim: "DISPATCH_AUTHORITY_EVALUATED_BLOCKED",
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
    claim_boundary: {
      authority_gate_evaluated: true,
      fail_closed_block_active: true,
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
    status: "DISPATCH_AUTHORITY_BLOCKED_FAIL_CLOSED",
    content_sha256: null
  };

  gate.content_sha256 = sha256Record({ ...gate, content_sha256: null });
  return gate;
}

function verifyDispatchAuthorityGate(gatePath) {
  const errors = [];

  if (!fileExists(gatePath)) {
    const missing = {
      record_type: "DispatchAuthorityGateVerificationRecord",
      gate_path: gatePath,
      verified: false,
      error_count: 1,
      errors: [{ code: "DISPATCH_AUTHORITY_GATE_MISSING", path: gatePath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const gate = readJson(gatePath);

  if (gate.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: gate.pilot_id });
  }

  if (gate.schema_version !== GATE_VERSION) {
    errors.push({ code: "GATE_VERSION_MISMATCH", observed: gate.schema_version });
  }

  if (gate.dispatch_authority_gate_state !== "BLOCKED_FAIL_CLOSED") {
    errors.push({ code: "DISPATCH_AUTHORITY_GATE_NOT_BLOCKED", observed: gate.dispatch_authority_gate_state });
  }

  for (const key of [
    "dispatch_execution_authorized",
    "dispatch_command_may_be_emitted",
    "external_connector_call_allowed",
    "target_system_contact_allowed",
    "customer_external_execution_allowed",
    "operational_allowed"
  ]) {
    if (gate[key] !== false) {
      errors.push({ code: "DISPATCH_AUTHORITY_OVERCLAIM", key, observed: gate[key] });
    }
  }

  for (const blocker of [
    "M1_OWNER_GATE_BLOCKED",
    "OPERATIONAL_ALLOWED_FALSE",
    "HUMAN_GO_NOT_BOUND",
    "DISPATCH_EXECUTION_AUTHORITY_NOT_GRANTED",
    "EXTERNAL_CONNECTOR_EXECUTION_NOT_AUTHORIZED"
  ]) {
    if (!Array.isArray(gate.blockers) || !gate.blockers.includes(blocker)) {
      errors.push({ code: "REQUIRED_BLOCKER_MISSING", blocker });
    }
  }

  if (!gate.evaluated_predicates || gate.evaluated_predicates.dispatch_preparation_verified !== true) {
    errors.push({ code: "DISPATCH_PREPARATION_VERIFICATION_PREDICATE_MISSING" });
  }

  if (!gate.evaluated_predicates || gate.evaluated_predicates.owner_gate_passed !== false) {
    errors.push({ code: "OWNER_GATE_PREDICATE_NOT_BLOCKED" });
  }

  if (!gate.claim_boundary || gate.claim_boundary.fail_closed_block_active !== true) {
    errors.push({ code: "FAIL_CLOSED_BOUNDARY_MISSING" });
  }

  if (!gate.claim_boundary || gate.claim_boundary.dispatch_command_not_emitted !== true) {
    errors.push({ code: "DISPATCH_COMMAND_BOUNDARY_MISSING" });
  }

  if (!gate.claim_boundary || gate.claim_boundary.external_connector_not_called !== true) {
    errors.push({ code: "EXTERNAL_CONNECTOR_BOUNDARY_MISSING" });
  }

  if (!gate.claim_boundary || gate.claim_boundary.effect_evidence_not_created !== true) {
    errors.push({ code: "EFFECT_EVIDENCE_BOUNDARY_MISSING" });
  }

  const expectedHash = sha256Record({ ...gate, content_sha256: null });
  if (gate.content_sha256 !== expectedHash) {
    errors.push({
      code: "DISPATCH_AUTHORITY_GATE_HASH_MISMATCH",
      expected: expectedHash,
      observed: gate.content_sha256
    });
  }

  const verification = {
    record_type: "DispatchAuthorityGateVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-DISPATCH-AUTHORITY-GATE-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    gate_path: gatePath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    dispatch_authority_gate_state: gate.dispatch_authority_gate_state,
    dispatch_execution_authorized: gate.dispatch_execution_authorized,
    dispatch_command_may_be_emitted: gate.dispatch_command_may_be_emitted,
    external_connector_call_allowed: gate.external_connector_call_allowed,
    target_system_contact_allowed: gate.target_system_contact_allowed,
    operational_allowed: gate.operational_allowed,
    gate_sha256: baseline.contentSha256(gatePath),
    claim_boundary: {
      fail_closed_block_active: true,
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
  GATE_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createDispatchAuthorityGate,
  verifyDispatchAuthorityGate
};
