"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-dispatch-authority-block-receipt.js"));

const receiptPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchAuthorityBlockReceipt_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-212-evidence_v001.json";

// PILOT212-T01 receipt exists and loads.
{
  assert.equal(runtime.fileExists(receiptPath), true);
  const receipt = runtime.readJson(receiptPath);

  assert.equal(receipt.artifact_type, "DispatchAuthorityBlockReceipt");
  assert.equal(receipt.pilot_id, runtime.PILOT_ID);
  assert.equal(receipt.schema_version, runtime.BLOCK_RECEIPT_VERSION);
}

// PILOT212-T02 gate input is digest-bound.
{
  const receipt = runtime.readJson(receiptPath);

  assert.equal(receipt.input_artifacts.dispatch_authority_gate_verified, true);
  assert.equal(typeof receipt.input_artifacts.dispatch_authority_gate_sha256, "string");
  assert.equal(receipt.input_artifacts.dispatch_authority_gate_sha256.length, 64);
}

// PILOT212-T03 block receipt records fail-closed gate.
{
  const receipt = runtime.readJson(receiptPath);

  assert.equal(receipt.receipt_state, "AUTHORITY_BLOCK_RECEIPT_RECORDED");
  assert.equal(receipt.bound_gate_state, "BLOCKED_FAIL_CLOSED");
  assert.equal(receipt.maximum_supported_claim, "AUTHORITY_BLOCK_RECORDED_NO_EXECUTION");
}

// PILOT212-T04 no execution authority or command is claimed.
{
  const receipt = runtime.readJson(receiptPath);

  assert.equal(receipt.dispatch_execution_authorized, false);
  assert.equal(receipt.dispatch_command_emitted, false);
  assert.equal(receipt.external_connector_called, false);
  assert.equal(receipt.target_system_contacted, false);
  assert.equal(receipt.operational_allowed, false);
}

// PILOT212-T05 no receipt/effect boundary is crossed.
{
  const receipt = runtime.readJson(receiptPath);

  assert.equal(receipt.target_receipt_created, false);
  assert.equal(receipt.execution_trace_bound, false);
  assert.equal(receipt.effect_evidence_created, false);
  assert.equal(receipt.customer_external_execution_allowed, false);
}

// PILOT212-T06 receipt type boundary is explicit.
{
  const receipt = runtime.readJson(receiptPath);

  assert.equal(receipt.receipt_boundary.internal_authority_block_receipt, true);
  assert.equal(receipt.receipt_boundary.target_receipt, false);
  assert.equal(receipt.receipt_boundary.execution_receipt, false);
  assert.equal(receipt.receipt_boundary.external_effect_receipt, false);
  assert.equal(receipt.receipt_boundary.legal_receipt, false);
  assert.equal(receipt.receipt_boundary.certification_receipt, false);
  assert.equal(receipt.receipt_boundary.commercial_release_receipt, false);
}

// PILOT212-T07 block reasons are inherited.
{
  const receipt = runtime.readJson(receiptPath);

  assert.ok(receipt.block_reasons.includes("M1_OWNER_GATE_BLOCKED"));
  assert.ok(receipt.block_reasons.includes("OPERATIONAL_ALLOWED_FALSE"));
  assert.ok(receipt.block_reasons.includes("HUMAN_GO_NOT_BOUND"));
  assert.ok(receipt.block_reasons.includes("DISPATCH_EXECUTION_AUTHORITY_NOT_GRANTED"));
  assert.ok(receipt.block_reasons.includes("EXTERNAL_CONNECTOR_EXECUTION_NOT_AUTHORIZED"));
}

// PILOT212-T08 verifier accepts canonical receipt.
{
  const verification = runtime.verifyDispatchAuthorityBlockReceipt(receiptPath);

  assert.equal(verification.record_type, "DispatchAuthorityBlockReceiptVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.receipt_state, "AUTHORITY_BLOCK_RECEIPT_RECORDED");
  assert.equal(verification.bound_gate_state, "BLOCKED_FAIL_CLOSED");
  assert.equal(verification.dispatch_execution_authorized, false);
  assert.equal(verification.dispatch_command_emitted, false);
  assert.equal(verification.external_connector_called, false);
  assert.equal(verification.target_system_contacted, false);
  assert.equal(verification.target_receipt_created, false);
  assert.equal(verification.execution_trace_bound, false);
  assert.equal(verification.effect_evidence_created, false);
  assert.equal(verification.operational_allowed, false);
}

// PILOT212-T09 verifier detects execution overclaim.
{
  const tmp = "/tmp/hbce-prog-212-execution-overclaim.json";
  const receipt = runtime.readJson(receiptPath);
  const tampered = {
    ...receipt,
    dispatch_execution_authorized: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyDispatchAuthorityBlockReceipt(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "AUTHORITY_BLOCK_RECEIPT_OVERCLAIM" && error.key === "dispatch_execution_authorized"));
}

// PILOT212-T10 evidence preserves no-execution boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-212");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.receipt_state, "AUTHORITY_BLOCK_RECEIPT_RECORDED");
  assert.equal(evidence.bound_gate_state, "BLOCKED_FAIL_CLOSED");
  assert.equal(evidence.dispatch_execution_authorized, false);
  assert.equal(evidence.dispatch_command_emitted, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.target_system_contacted, false);
  assert.equal(evidence.target_receipt_created, false);
  assert.equal(evidence.execution_trace_bound, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.operational_allowed, false);
  assert.equal(evidence.customer_external_execution_allowed, false);
  assert.equal(evidence.external_validation_claimed, false);
  assert.equal(evidence.legal_review_claimed, false);
  assert.equal(evidence.certification_claimed, false);
  assert.equal(evidence.commercial_release_authorization_claimed, false);
  assert.equal(evidence.level4_claimed, false);
}

console.log("PROG_212_HBCE_INTERNAL_PILOT_DISPATCH_AUTHORITY_BLOCK_RECEIPT_TEST=PASS");
