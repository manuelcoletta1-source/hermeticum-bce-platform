"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-dispatch-block-chain-review-gate.js"));

const gatePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchBlockChainReviewGate_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-214-evidence_v001.json";

// PILOT214-T01 gate exists and loads.
{
  assert.equal(runtime.fileExists(gatePath), true);
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.artifact_type, "DispatchBlockChainReviewGate");
  assert.equal(gate.pilot_id, runtime.PILOT_ID);
  assert.equal(gate.schema_version, runtime.REVIEW_GATE_VERSION);
}

// PILOT214-T02 bundle input is digest-bound.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.input_artifacts.dispatch_block_chain_bundle_verified, true);
  assert.equal(typeof gate.input_artifacts.dispatch_block_chain_bundle_sha256, "string");
  assert.equal(gate.input_artifacts.dispatch_block_chain_bundle_sha256.length, 64);
}

// PILOT214-T03 review gate is pending human acceptance.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.review_gate_state, "NO_EXECUTION_BUNDLE_REVIEW_READY_PENDING_HUMAN_ACCEPTANCE");
  assert.equal(gate.technical_review_result, "PASS_STRUCTURAL_NO_EXECUTION_CHAIN");
  assert.equal(gate.human_acceptance_required, true);
  assert.equal(gate.human_acceptance_state, "PENDING");
  assert.equal(gate.human_acceptance_received, false);
}

// PILOT214-T04 no readiness or owner approval is inferred.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.human_reviewer_bound, false);
  assert.equal(gate.owner_gate_passed, false);
  assert.equal(gate.operational_transition_allowed, false);
  assert.equal(gate.readiness_unlock_allowed, false);
}

// PILOT214-T05 no execution boundary remains closed.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.dispatch_execution_authorized, false);
  assert.equal(gate.dispatch_command_emitted, false);
  assert.equal(gate.dispatch_performed, false);
  assert.equal(gate.external_connector_called, false);
  assert.equal(gate.target_system_contacted, false);
  assert.equal(gate.target_receipt_created, false);
  assert.equal(gate.execution_trace_bound, false);
  assert.equal(gate.effect_evidence_created, false);
}

// PILOT214-T06 blocker set is explicit.
{
  const gate = runtime.readJson(gatePath);

  assert.ok(gate.blockers.includes("HUMAN_ACCEPTANCE_PENDING"));
  assert.ok(gate.blockers.includes("HUMAN_REVIEWER_NOT_BOUND"));
  assert.ok(gate.blockers.includes("OWNER_GATE_NOT_PASSED"));
  assert.ok(gate.blockers.includes("OPERATIONAL_TRANSITION_NOT_ALLOWED"));
  assert.ok(gate.blockers.includes("READINESS_UNLOCK_NOT_ALLOWED"));
  assert.ok(gate.blockers.includes("CUSTOMER_EXECUTION_GATE_NOT_OPEN"));
}

// PILOT214-T07 claim boundary prevents overclaim.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.claim_boundary.review_gate_created, true);
  assert.equal(gate.claim_boundary.internal_structural_review_only, true);
  assert.equal(gate.claim_boundary.human_acceptance_not_received, true);
  assert.equal(gate.claim_boundary.readiness_not_unlocked, true);
  assert.equal(gate.claim_boundary.no_execution_chain_preserved, true);
  assert.equal(gate.claim_boundary.dispatch_not_performed, true);
  assert.equal(gate.claim_boundary.external_connector_not_called, true);
  assert.equal(gate.claim_boundary.target_receipt_not_created, true);
  assert.equal(gate.claim_boundary.effect_evidence_not_created, true);
  assert.equal(gate.claim_boundary.level4_not_inferred, true);
}

// PILOT214-T08 verifier accepts canonical gate.
{
  const verification = runtime.verifyDispatchBlockChainReviewGate(gatePath);

  assert.equal(verification.record_type, "DispatchBlockChainReviewGateVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.review_gate_state, "NO_EXECUTION_BUNDLE_REVIEW_READY_PENDING_HUMAN_ACCEPTANCE");
  assert.equal(verification.technical_review_result, "PASS_STRUCTURAL_NO_EXECUTION_CHAIN");
  assert.equal(verification.human_acceptance_received, false);
  assert.equal(verification.readiness_unlock_allowed, false);
  assert.equal(verification.dispatch_execution_authorized, false);
  assert.equal(verification.dispatch_performed, false);
}

// PILOT214-T09 verifier detects approval overclaim.
{
  const tmp = "/tmp/hbce-prog-214-approval-overclaim.json";
  const gate = runtime.readJson(gatePath);
  const tampered = {
    ...gate,
    human_acceptance_received: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyDispatchBlockChainReviewGate(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "REVIEW_GATE_OVERCLAIM" && error.key === "human_acceptance_received"));
}

// PILOT214-T10 evidence preserves pending and no-execution boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-214");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.review_gate_state, "NO_EXECUTION_BUNDLE_REVIEW_READY_PENDING_HUMAN_ACCEPTANCE");
  assert.equal(evidence.technical_review_result, "PASS_STRUCTURAL_NO_EXECUTION_CHAIN");
  assert.equal(evidence.human_acceptance_required, true);
  assert.equal(evidence.human_acceptance_state, "PENDING");
  assert.equal(evidence.human_acceptance_received, false);
  assert.equal(evidence.owner_gate_passed, false);
  assert.equal(evidence.readiness_unlock_allowed, false);
  assert.equal(evidence.dispatch_execution_authorized, false);
  assert.equal(evidence.dispatch_command_emitted, false);
  assert.equal(evidence.dispatch_performed, false);
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

console.log("PROG_214_HBCE_INTERNAL_PILOT_DISPATCH_BLOCK_CHAIN_REVIEW_GATE_TEST=PASS");
