"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-execution-trace-contract.js"));

const contractPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_ExecutionTraceContract_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-208-evidence_v001.json";

// PILOT208-T01 contract exists and loads.
{
  assert.equal(runtime.fileExists(contractPath), true);
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.artifact_type, "ExecutionTraceContract");
  assert.equal(contract.pilot_id, runtime.PILOT_ID);
  assert.equal(contract.schema_version, runtime.CONTRACT_VERSION);
}

// PILOT208-T02 policy runtime binding input is digest-bound.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(typeof contract.input_artifacts.policy_runtime_binding_sha256, "string");
  assert.equal(contract.input_artifacts.policy_runtime_binding_sha256.length, 64);
  assert.equal(contract.input_artifacts.policy_runtime_binding_verified, true);
}

// PILOT208-T03 required trace fields are represented.
{
  const contract = runtime.readJson(contractPath);

  for (const field of runtime.REQUIRED_TRACE_FIELDS) {
    assert.ok(contract.required_trace_fields.includes(field), field);
    assert.ok(contract.required_correlation_chain.includes(field), field);
  }
}

// PILOT208-T04 required trace states are represented.
{
  const contract = runtime.readJson(contractPath);

  for (const state of runtime.REQUIRED_STATES) {
    assert.ok(contract.required_states.includes(state), state);
  }
}

// PILOT208-T05 contract preserves no-execution boundary.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.trace_contract_state, "DEFINED_STRUCTURALLY_VALIDATED");
  assert.equal(contract.execution_trace_bound, false);
  assert.equal(contract.operational_allowed, false);
  assert.equal(contract.customer_external_execution_allowed, false);
  assert.equal(contract.maximum_supported_claim, "TRACE_CONTRACT_DEFINED_STRUCTURALLY_VALIDATED");
}

// PILOT208-T06 separation rules distinguish dispatch, receipt and effect.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.separation_rules.authorization_evaluation_is_not_execution, true);
  assert.equal(contract.separation_rules.dispatch_record_is_not_target_effect, true);
  assert.equal(contract.separation_rules.target_receipt_is_not_physical_effect, true);
  assert.equal(contract.separation_rules.execution_trace_is_not_legal_validity, true);
  assert.equal(contract.separation_rules.effect_evidence_is_not_universal_truth, true);
}

// PILOT208-T07 fail-closed rules are explicit.
{
  const contract = runtime.readJson(contractPath);

  assert.equal(contract.fail_closed_rules.missing_execution_trace_ref, "EXECUTION_NOT_OBSERVED");
  assert.equal(contract.fail_closed_rules.missing_effect_evidence_ref, "EFFECT_NOT_OBSERVED");
  assert.equal(contract.fail_closed_rules.connector_timeout, "EXECUTION_UNKNOWN");
  assert.equal(contract.fail_closed_rules.duplicate_attempt_without_idempotency, "BLOCKED");
  assert.equal(contract.fail_closed_rules.target_receipt_without_effect_evidence, "CONSEQUENCE_UNVERIFIED");
}

// PILOT208-T08 verifier accepts canonical contract.
{
  const verification = runtime.verifyExecutionTraceContract(contractPath);

  assert.equal(verification.record_type, "ExecutionTraceContractVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.trace_contract_state, "DEFINED_STRUCTURALLY_VALIDATED");
  assert.equal(verification.execution_trace_bound, false);
  assert.equal(verification.operational_allowed, false);
  assert.equal(verification.customer_external_execution_allowed, false);
  assert.equal(typeof verification.record_sha256, "string");
  assert.equal(verification.record_sha256.length, 64);
}

// PILOT208-T09 verifier detects execution overclaim tamper.
{
  const tmp = "/tmp/hbce-prog-208-trace-overclaim.json";
  const contract = runtime.readJson(contractPath);
  const tampered = {
    ...contract,
    execution_trace_bound: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyExecutionTraceContract(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "EXECUTION_TRACE_BOUND_OVERCLAIM"));
}

// PILOT208-T10 evidence preserves contract-only boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-208");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.trace_contract_state, "DEFINED_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.execution_trace_bound, false);
  assert.equal(evidence.dispatch_performed, false);
  assert.equal(evidence.target_receipt_created, false);
  assert.equal(evidence.effect_evidence_created, false);
  assert.equal(evidence.operational_allowed, false);
  assert.equal(evidence.customer_external_execution_allowed, false);
  assert.equal(evidence.external_validation_claimed, false);
  assert.equal(evidence.legal_review_claimed, false);
  assert.equal(evidence.certification_claimed, false);
  assert.equal(evidence.commercial_release_authorization_claimed, false);
  assert.equal(evidence.level4_claimed, false);
}

console.log("PROG_208_HBCE_INTERNAL_PILOT_EXECUTION_TRACE_CONTRACT_TEST=PASS");
