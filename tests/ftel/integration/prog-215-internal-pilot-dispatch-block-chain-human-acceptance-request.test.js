"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-dispatch-block-chain-human-acceptance-request.js"));

const requestPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchBlockChainHumanAcceptanceRequest_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-215-evidence_v001.json";

// PILOT215-T01 request exists and loads.
{
  assert.equal(runtime.fileExists(requestPath), true);
  const request = runtime.readJson(requestPath);

  assert.equal(request.artifact_type, "DispatchBlockChainHumanAcceptanceRequest");
  assert.equal(request.pilot_id, runtime.PILOT_ID);
  assert.equal(request.schema_version, runtime.REQUEST_VERSION);
}

// PILOT215-T02 review gate input is digest-bound.
{
  const request = runtime.readJson(requestPath);

  assert.equal(request.input_artifacts.dispatch_block_chain_review_gate_verified, true);
  assert.equal(typeof request.input_artifacts.dispatch_block_chain_review_gate_sha256, "string");
  assert.equal(request.input_artifacts.dispatch_block_chain_review_gate_sha256.length, 64);
}

// PILOT215-T03 request is pending response.
{
  const request = runtime.readJson(requestPath);

  assert.equal(request.request_state, "HUMAN_ACCEPTANCE_REQUEST_CREATED_PENDING_RESPONSE");
  assert.equal(request.request_type, "HUMAN_ACCEPTANCE_REQUEST_ONLY");
  assert.equal(request.human_acceptance_required, true);
  assert.equal(request.human_acceptance_state, "PENDING");
  assert.equal(request.human_acceptance_received, false);
  assert.equal(request.human_response_received, false);
  assert.equal(request.human_decision_recorded, false);
}

// PILOT215-T04 no readiness or owner approval is inferred.
{
  const request = runtime.readJson(requestPath);

  assert.equal(request.owner_gate_passed, false);
  assert.equal(request.readiness_unlock_allowed, false);
  assert.equal(request.operational_transition_allowed, false);
}

// PILOT215-T05 no execution boundary remains closed.
{
  const request = runtime.readJson(requestPath);

  assert.equal(request.dispatch_execution_authorized, false);
  assert.equal(request.dispatch_command_emitted, false);
  assert.equal(request.dispatch_performed, false);
  assert.equal(request.external_connector_called, false);
  assert.equal(request.target_system_contacted, false);
  assert.equal(request.target_receipt_created, false);
  assert.equal(request.execution_trace_bound, false);
  assert.equal(request.effect_evidence_created, false);
}

// PILOT215-T06 blocker set is explicit.
{
  const request = runtime.readJson(requestPath);

  assert.ok(request.blockers.includes("HUMAN_RESPONSE_NOT_RECEIVED"));
  assert.ok(request.blockers.includes("HUMAN_ACCEPTANCE_NOT_RECORDED"));
  assert.ok(request.blockers.includes("HUMAN_DECISION_RECORD_NOT_CREATED"));
  assert.ok(request.blockers.includes("OWNER_GATE_NOT_PASSED"));
  assert.ok(request.blockers.includes("READINESS_UNLOCK_NOT_ALLOWED"));
  assert.ok(request.blockers.includes("CUSTOMER_EXECUTION_GATE_NOT_OPEN"));
}

// PILOT215-T07 claim boundary prevents overclaim.
{
  const request = runtime.readJson(requestPath);

  assert.equal(request.claim_boundary.human_acceptance_request_created, true);
  assert.equal(request.claim_boundary.request_only, true);
  assert.equal(request.claim_boundary.human_response_not_received, true);
  assert.equal(request.claim_boundary.human_acceptance_not_recorded, true);
  assert.equal(request.claim_boundary.human_decision_record_not_created, true);
  assert.equal(request.claim_boundary.readiness_not_unlocked, true);
  assert.equal(request.claim_boundary.dispatch_not_performed, true);
  assert.equal(request.claim_boundary.effect_evidence_not_created, true);
  assert.equal(request.claim_boundary.level4_not_inferred, true);
}

// PILOT215-T08 verifier accepts canonical request.
{
  const verification = runtime.verifyDispatchBlockChainHumanAcceptanceRequest(requestPath);

  assert.equal(verification.record_type, "DispatchBlockChainHumanAcceptanceRequestVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.request_state, "HUMAN_ACCEPTANCE_REQUEST_CREATED_PENDING_RESPONSE");
  assert.equal(verification.request_type, "HUMAN_ACCEPTANCE_REQUEST_ONLY");
  assert.equal(verification.human_response_received, false);
  assert.equal(verification.human_decision_recorded, false);
  assert.equal(verification.readiness_unlock_allowed, false);
  assert.equal(verification.dispatch_performed, false);
  assert.equal(verification.effect_evidence_created, false);
}

// PILOT215-T09 verifier detects acceptance overclaim.
{
  const tmp = "/tmp/hbce-prog-215-acceptance-overclaim.json";
  const request = runtime.readJson(requestPath);
  const tampered = {
    ...request,
    human_acceptance_received: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyDispatchBlockChainHumanAcceptanceRequest(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "HUMAN_ACCEPTANCE_REQUEST_OVERCLAIM" && error.key === "human_acceptance_received"));
}

// PILOT215-T10 evidence preserves request-only boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-215");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.request_state, "HUMAN_ACCEPTANCE_REQUEST_CREATED_PENDING_RESPONSE");
  assert.equal(evidence.request_type, "HUMAN_ACCEPTANCE_REQUEST_ONLY");
  assert.equal(evidence.human_acceptance_required, true);
  assert.equal(evidence.human_acceptance_state, "PENDING");
  assert.equal(evidence.human_acceptance_received, false);
  assert.equal(evidence.human_response_received, false);
  assert.equal(evidence.human_decision_recorded, false);
  assert.equal(evidence.owner_gate_passed, false);
  assert.equal(evidence.readiness_unlock_allowed, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.target_receipt_created, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.level4_claimed, false);
}

console.log("PROG_215_HBCE_INTERNAL_PILOT_DISPATCH_BLOCK_CHAIN_HUMAN_ACCEPTANCE_REQUEST_TEST=PASS");
