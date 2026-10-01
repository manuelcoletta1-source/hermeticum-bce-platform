"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-dispatch-authority-gate.js"));

const gatePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchAuthorityGate_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-211-evidence_v001.json";

// PILOT211-T01 gate exists and loads.
{
  assert.equal(runtime.fileExists(gatePath), true);
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.artifact_type, "DispatchAuthorityGate");
  assert.equal(gate.pilot_id, runtime.PILOT_ID);
  assert.equal(gate.schema_version, runtime.GATE_VERSION);
}

// PILOT211-T02 dispatch preparation input is digest-bound.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.input_artifacts.dispatch_preparation_verified, true);
  assert.equal(typeof gate.input_artifacts.dispatch_preparation_sha256, "string");
  assert.equal(gate.input_artifacts.dispatch_preparation_sha256.length, 64);
}

// PILOT211-T03 gate is blocked fail-closed.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.dispatch_authority_gate_state, "BLOCKED_FAIL_CLOSED");
  assert.equal(gate.dispatch_execution_authorized, false);
  assert.equal(gate.dispatch_command_may_be_emitted, false);
  assert.equal(gate.maximum_supported_claim, "DISPATCH_AUTHORITY_EVALUATED_BLOCKED");
}

// PILOT211-T04 external execution remains disallowed.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.external_connector_call_allowed, false);
  assert.equal(gate.target_system_contact_allowed, false);
  assert.equal(gate.customer_external_execution_allowed, false);
  assert.equal(gate.operational_allowed, false);
}

// PILOT211-T05 predicates show authority blockers.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.evaluated_predicates.dispatch_preparation_verified, true);
  assert.equal(gate.evaluated_predicates.dispatch_prepared, true);
  assert.equal(gate.evaluated_predicates.owner_gate_passed, false);
  assert.equal(gate.evaluated_predicates.human_go_bound, false);
  assert.equal(gate.evaluated_predicates.operational_allowed, false);
  assert.equal(gate.evaluated_predicates.external_connector_authorized, false);
}

// PILOT211-T06 blockers are explicit.
{
  const gate = runtime.readJson(gatePath);

  assert.ok(gate.blockers.includes("M1_OWNER_GATE_BLOCKED"));
  assert.ok(gate.blockers.includes("OPERATIONAL_ALLOWED_FALSE"));
  assert.ok(gate.blockers.includes("HUMAN_GO_NOT_BOUND"));
  assert.ok(gate.blockers.includes("DISPATCH_EXECUTION_AUTHORITY_NOT_GRANTED"));
  assert.ok(gate.blockers.includes("EXTERNAL_CONNECTOR_EXECUTION_NOT_AUTHORIZED"));
}

// PILOT211-T07 claim boundary preserves no-execution.
{
  const gate = runtime.readJson(gatePath);

  assert.equal(gate.claim_boundary.fail_closed_block_active, true);
  assert.equal(gate.claim_boundary.dispatch_command_not_emitted, true);
  assert.equal(gate.claim_boundary.external_connector_not_called, true);
  assert.equal(gate.claim_boundary.target_system_not_contacted, true);
  assert.equal(gate.claim_boundary.target_receipt_not_created, true);
  assert.equal(gate.claim_boundary.execution_trace_not_created, true);
  assert.equal(gate.claim_boundary.effect_evidence_not_created, true);
  assert.equal(gate.claim_boundary.level4_not_inferred, true);
}

// PILOT211-T08 verifier accepts canonical gate.
{
  const verification = runtime.verifyDispatchAuthorityGate(gatePath);

  assert.equal(verification.record_type, "DispatchAuthorityGateVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.dispatch_authority_gate_state, "BLOCKED_FAIL_CLOSED");
  assert.equal(verification.dispatch_execution_authorized, false);
  assert.equal(verification.dispatch_command_may_be_emitted, false);
  assert.equal(verification.external_connector_call_allowed, false);
  assert.equal(verification.target_system_contact_allowed, false);
  assert.equal(verification.operational_allowed, false);
}

// PILOT211-T09 verifier detects authorization overclaim.
{
  const tmp = "/tmp/hbce-prog-211-authority-overclaim.json";
  const gate = runtime.readJson(gatePath);
  const tampered = {
    ...gate,
    dispatch_execution_authorized: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyDispatchAuthorityGate(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "DISPATCH_AUTHORITY_OVERCLAIM" && error.key === "dispatch_execution_authorized"));
}

// PILOT211-T10 evidence preserves blocked boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-211");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.dispatch_authority_gate_state, "BLOCKED_FAIL_CLOSED");
  assert.equal(evidence.dispatch_execution_authorized, false);
  assert.equal(evidence.dispatch_command_may_be_emitted, false);
  assert.equal(evidence.external_connector_call_allowed, false);
  assert.equal(evidence.target_system_contact_allowed, false);
  assert.equal(evidence.dispatch_performed, false);
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

console.log("PROG_211_HBCE_INTERNAL_PILOT_DISPATCH_AUTHORITY_GATE_TEST=PASS");
