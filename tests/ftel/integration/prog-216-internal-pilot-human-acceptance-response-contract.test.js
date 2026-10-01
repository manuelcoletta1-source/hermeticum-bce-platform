"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-human-acceptance-response-contract.js"));

const contractPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_HumanAcceptanceResponseContract_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-216-evidence_v001.json";

// PILOT216-T01 contract exists and loads.
{
  assert.equal(runtime.fileExists(contractPath), true);
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.artifact_type, "HumanAcceptanceResponseContract");
  assert.equal(contract.pilot_id, runtime.PILOT_ID);
  assert.equal(contract.schema_version, runtime.CONTRACT_VERSION);
}

// PILOT216-T02 request input is digest-bound.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.input_artifacts.human_acceptance_request_verified, true);
  assert.equal(typeof contract.input_artifacts.human_acceptance_request_sha256, "string");
  assert.equal(contract.input_artifacts.human_acceptance_request_sha256.length, 64);
  assert.ok(contract.input_artifacts.bound_request_id.startsWith("human-acceptance-request-"));
}

// PILOT216-T03 allowed decisions are explicit.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.contract_state, "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_DEFINED_PENDING_RESPONSE");
  assert.ok(contract.allowed_decision_values.includes("ACCEPT_INTERNAL_NO_EXECUTION_REVIEW_GATE"));
  assert.ok(contract.allowed_decision_values.includes("REJECT_INTERNAL_NO_EXECUTION_REVIEW_GATE"));
}

// PILOT216-T04 required response fields are explicit.
{
  const contract = runtime.readJson(contractPath);

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
    assert.ok(contract.required_response_fields.includes(field), field);
  }
}

// PILOT216-T05 current state records no response.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.current_state.human_response_received, false);
  assert.equal(contract.current_state.human_acceptance_received, false);
  assert.equal(contract.current_state.human_rejection_received, false);
  assert.equal(contract.current_state.human_decision_recorded, false);
  assert.equal(contract.current_state.owner_gate_passed, false);
  assert.equal(contract.current_state.readiness_unlock_allowed, false);
}

// PILOT216-T06 no execution boundary remains closed.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.current_state.dispatch_execution_authorized, false);
  assert.equal(contract.current_state.dispatch_command_emitted, false);
  assert.equal(contract.current_state.dispatch_performed, false);
  assert.equal(contract.current_state.external_connector_called, false);
  assert.equal(contract.current_state.target_system_contacted, false);
  assert.equal(contract.current_state.target_receipt_created, false);
  assert.equal(contract.current_state.execution_trace_bound, false);
  assert.equal(contract.current_state.effect_evidence_created, false);
}

// PILOT216-T07 claim boundary prevents overclaim.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.claim_boundary.response_contract_defined, true);
  assert.equal(contract.claim_boundary.response_contract_only, true);
  assert.equal(contract.claim_boundary.human_response_not_received, true);
  assert.equal(contract.claim_boundary.human_acceptance_not_recorded, true);
  assert.equal(contract.claim_boundary.human_rejection_not_recorded, true);
  assert.equal(contract.claim_boundary.human_decision_record_not_created, true);
  assert.equal(contract.claim_boundary.readiness_not_unlocked, true);
  assert.equal(contract.claim_boundary.dispatch_not_performed, true);
  assert.equal(contract.claim_boundary.effect_evidence_not_created, true);
  assert.equal(contract.claim_boundary.level4_not_inferred, true);
}

// PILOT216-T08 verifier accepts canonical contract.
{
  const verification = runtime.verifyHumanAcceptanceResponseContract(contractPath);

  assert.equal(verification.record_type, "HumanAcceptanceResponseContractVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.contract_state, "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_DEFINED_PENDING_RESPONSE");
  assert.equal(verification.current_state.human_response_received, false);
  assert.equal(verification.current_state.human_decision_recorded, false);
  assert.equal(verification.current_state.readiness_unlock_allowed, false);
  assert.equal(verification.current_state.dispatch_performed, false);
  assert.equal(verification.current_state.effect_evidence_created, false);
}

// PILOT216-T09 verifier detects response overclaim.
{
  const tmp = "/tmp/hbce-prog-216-response-overclaim.json";
  const contract = runtime.readJson(contractPath);
  const tampered = {
    ...contract,
    current_state: {
      ...contract.current_state,
      human_response_received: true
    }
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyHumanAcceptanceResponseContract(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_OVERCLAIM" && error.key === "human_response_received"));
}

// PILOT216-T10 evidence preserves contract-only boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-216");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.contract_state, "HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_DEFINED_PENDING_RESPONSE");
  assert.equal(evidence.response_contract_scope, "INTERNAL_STRUCTURAL_NO_EXECUTION_CHAIN_REVIEW");
  assert.equal(evidence.human_response_received, false);
  assert.equal(evidence.human_acceptance_received, false);
  assert.equal(evidence.human_rejection_received, false);
  assert.equal(evidence.human_decision_recorded, false);
  assert.equal(evidence.owner_gate_passed, false);
  assert.equal(evidence.readiness_unlock_allowed, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.external_connector_called, false);
  assert.equal(evidence.target_receipt_created, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.level4_claimed, false);
}

console.log("PROG_216_HBCE_INTERNAL_PILOT_HUMAN_ACCEPTANCE_RESPONSE_CONTRACT_TEST=PASS");
