"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-human-response-intake-gate.js"));

const gatePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_HumanResponseIntakeGate_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-217-evidence_v001.json";

function validCandidate() {
  const gate = runtime.readJson(gatePath);
  const statement = "I explicitly accept the internal no-execution review gate only.";
  return {
    response_record_id: "human-response-candidate-001",
    pilot_id: runtime.PILOT_ID,
    source_request_id: gate.input_artifacts.bound_request_id,
    source_request_sha256: gate.input_artifacts.bound_request_sha256,
    human_actor_ref: "MANUEL_COLETTA",
    human_actor_role: "AUTHORIZED_HUMAN_OWNER",
    decision_value: "ACCEPT_INTERNAL_NO_EXECUTION_REVIEW_GATE",
    decision_statement: statement,
    decision_statement_sha256: runtime.sha256Record(statement),
    decision_recorded_at: "2026-09-30T23:50:00+02:00",
    response_channel: "MANUAL_LOCAL_CONSOLE",
    scope_confirmation: "INTERNAL_STRUCTURAL_NO_EXECUTION_CHAIN_REVIEW",
    no_execution_boundary_acknowledged: true
  };
}

// PILOT217-T01 gate exists and loads.
{
  assert.equal(runtime.fileExists(gatePath), true);
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.artifact_type, "HumanResponseIntakeGate");
  assert.equal(gate.pilot_id, runtime.PILOT_ID);
  assert.equal(gate.schema_version, runtime.INTAKE_GATE_VERSION);
}

// PILOT217-T02 response contract input is digest-bound.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.input_artifacts.human_acceptance_response_contract_verified, true);
  assert.equal(typeof gate.input_artifacts.human_acceptance_response_contract_sha256, "string");
  assert.equal(gate.input_artifacts.human_acceptance_response_contract_sha256.length, 64);
  assert.ok(gate.input_artifacts.bound_request_id.startsWith("human-acceptance-request-"));
  assert.equal(gate.input_artifacts.bound_request_sha256.length, 64);
}

// PILOT217-T03 intake gate is ready but pending explicit response.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.intake_gate_state, "HUMAN_RESPONSE_INTAKE_READY_PENDING_EXPLICIT_RESPONSE");
  assert.equal(gate.intake_scope, "INTERNAL_STRUCTURAL_NO_EXECUTION_CHAIN_REVIEW");
  assert.equal(gate.validation_capabilities.can_validate_candidate_response, true);
  assert.equal(gate.validation_capabilities.can_persist_response, false);
  assert.equal(gate.current_state.human_response_received, false);
  assert.equal(gate.current_state.human_decision_recorded, false);
}

// PILOT217-T04 structurally valid candidate validates but is not persisted.
{
  const validation = runtime.validateCandidateHumanAcceptanceResponse({
    candidate: validCandidate(),
    gatePath
  });

  assert.equal(validation.candidate_structurally_valid, true);
  assert.equal(validation.error_count, 0);
  assert.equal(validation.persistence_authorized, false);
  assert.equal(validation.human_decision_record_created, false);
  assert.equal(validation.readiness_unlock_allowed, false);
  assert.equal(validation.dispatch_performed, false);
  assert.equal(validation.effect_evidence_created, false);
}

// PILOT217-T05 invalid decision is rejected.
{
  const candidate = validCandidate();
  candidate.decision_value = "MAKE_IT_READY_BECAUSE_HUMANS_ARE_IMPATIENT";

  const validation = runtime.validateCandidateHumanAcceptanceResponse({
    candidate,
    gatePath
  });

  assert.equal(validation.candidate_structurally_valid, false);
  assert.ok(validation.errors.some((error) => error.code === "CANDIDATE_DECISION_VALUE_INVALID"));
}

// PILOT217-T06 AI actor is rejected.
{
  const candidate = validCandidate();
  candidate.human_actor_ref = "JOKER-C2";

  const validation = runtime.validateCandidateHumanAcceptanceResponse({
    candidate,
    gatePath
  });

  assert.equal(validation.candidate_structurally_valid, false);
  assert.ok(validation.errors.some((error) => error.code === "CANDIDATE_AI_ACTOR_DISALLOWED"));
}

// PILOT217-T07 missing no-execution acknowledgment is rejected.
{
  const candidate = validCandidate();
  candidate.no_execution_boundary_acknowledged = false;

  const validation = runtime.validateCandidateHumanAcceptanceResponse({
    candidate,
    gatePath
  });

  assert.equal(validation.candidate_structurally_valid, false);
  assert.ok(validation.errors.some((error) => error.code === "CANDIDATE_NO_EXECUTION_BOUNDARY_NOT_ACKNOWLEDGED"));
}

// PILOT217-T08 no execution boundary remains closed.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.current_state.dispatch_execution_authorized, false);
  assert.equal(gate.current_state.dispatch_command_emitted, false);
  assert.equal(gate.current_state.dispatch_performed, false);
  assert.equal(gate.current_state.external_connector_called, false);
  assert.equal(gate.current_state.target_system_contacted, false);
  assert.equal(gate.current_state.target_receipt_created, false);
  assert.equal(gate.current_state.execution_trace_bound, false);
  assert.equal(gate.current_state.effect_evidence_created, false);
}

// PILOT217-T09 verifier accepts canonical gate and detects overclaim.
{
  const verification = runtime.verifyHumanResponseIntakeGate(gatePath);

  assert.equal(verification.record_type, "HumanResponseIntakeGateVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.equal(verification.current_state.human_response_received, false);
  assert.equal(verification.current_state.human_decision_recorded, false);
  assert.equal(verification.current_state.readiness_unlock_allowed, false);
  assert.equal(verification.current_state.dispatch_performed, false);
  assert.equal(verification.current_state.effect_evidence_created, false);

  const tmp = "/tmp/hbce-prog-217-response-overclaim.json";
  const gate = runtime.readJson(gatePath);
  const tampered = {
    ...gate,
    current_state: {
      ...gate.current_state,
      human_response_received: true
    }
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });
  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));

  const tamperedVerification = runtime.verifyHumanResponseIntakeGate(tmp);
  assert.equal(tamperedVerification.verified, false);
  assert.ok(tamperedVerification.errors.some((error) => error.code === "HUMAN_RESPONSE_INTAKE_GATE_OVERCLAIM" && error.key === "human_response_received"));
}

// PILOT217-T10 evidence preserves intake-only boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-217");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.intake_gate_state, "HUMAN_RESPONSE_INTAKE_READY_PENDING_EXPLICIT_RESPONSE");
  assert.equal(evidence.can_validate_candidate_response, true);
  assert.equal(evidence.can_persist_response, false);
  assert.equal(evidence.human_response_received, false);
  assert.equal(evidence.candidate_response_validated, false);
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

console.log("PROG_217_HBCE_INTERNAL_PILOT_HUMAN_RESPONSE_INTAKE_GATE_TEST=PASS");
