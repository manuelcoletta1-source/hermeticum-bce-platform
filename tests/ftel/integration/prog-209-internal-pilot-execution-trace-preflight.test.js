"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-execution-trace-preflight.js"));

const preflightPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_ExecutionTracePreflight_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-209-evidence_v001.json";

// PILOT209-T01 preflight exists and loads.
{
  assert.equal(runtime.fileExists(preflightPath), true);
  const preflight = runtime.readJson(preflightPath);

  assert.equal(preflight.artifact_type, "ExecutionTracePreflight");
  assert.equal(preflight.pilot_id, runtime.PILOT_ID);
  assert.equal(preflight.schema_version, runtime.PREFLIGHT_VERSION);
}

// PILOT209-T02 contract input is digest-bound.
{
  const preflight = runtime.readJson(preflightPath);

  assert.equal(preflight.input_artifacts.execution_trace_contract_verified, true);
  assert.equal(typeof preflight.input_artifacts.execution_trace_contract_sha256, "string");
  assert.equal(preflight.input_artifacts.execution_trace_contract_sha256.length, 64);
}

// PILOT209-T03 preflight has initial correlation fields only.
{
  const preflight = runtime.readJson(preflightPath);

  assert.equal(typeof preflight.correlation_chain.request_id, "string");
  assert.equal(typeof preflight.correlation_chain.authorization_evaluation_id, "string");
  assert.equal(typeof preflight.correlation_chain.action_digest, "string");

  assert.equal(preflight.correlation_chain.dispatch_id, null);
  assert.equal(preflight.correlation_chain.attempt_id, null);
  assert.equal(preflight.correlation_chain.target_receipt_id, null);
  assert.equal(preflight.correlation_chain.execution_trace_ref, null);
  assert.equal(preflight.correlation_chain.effect_evidence_ref, null);
}

// PILOT209-T04 trace state remains NOT_DISPATCHED.
{
  const preflight = runtime.readJson(preflightPath);

  assert.equal(preflight.preflight_state, "TRACE_PREFLIGHT_DEFINED");
  assert.equal(preflight.trace_state, "NOT_DISPATCHED");
  assert.equal(preflight.maximum_supported_claim, "TRACE_PREFLIGHT_DEFINED_NOT_DISPATCHED");
}

// PILOT209-T05 no dispatch/execution/effect is claimed.
{
  const preflight = runtime.readJson(preflightPath);

  assert.equal(preflight.dispatch_prepared, false);
  assert.equal(preflight.dispatch_performed, false);
  assert.equal(preflight.target_acknowledged, false);
  assert.equal(preflight.target_receipt_created, false);
  assert.equal(preflight.execution_trace_bound, false);
  assert.equal(preflight.effect_evidence_created, false);
  assert.equal(preflight.operational_allowed, false);
  assert.equal(preflight.customer_external_execution_allowed, false);
}

// PILOT209-T06 fail-closed reasons are explicit.
{
  const preflight = runtime.readJson(preflightPath);

  assert.ok(preflight.fail_closed_reasons.includes("DISPATCH_NOT_PERFORMED"));
  assert.ok(preflight.fail_closed_reasons.includes("TARGET_RECEIPT_NOT_CREATED"));
  assert.ok(preflight.fail_closed_reasons.includes("EXECUTION_TRACE_NOT_BOUND"));
  assert.ok(preflight.fail_closed_reasons.includes("EFFECT_EVIDENCE_NOT_CREATED"));
}

// PILOT209-T07 preflight hash is stable.
{
  const preflight = runtime.readJson(preflightPath);
  const expected = runtime.sha256Record({ ...preflight, content_sha256: null });

  assert.equal(preflight.content_sha256, expected);
  assert.equal(preflight.content_sha256.length, 64);
}

// PILOT209-T08 verifier accepts canonical preflight.
{
  const verification = runtime.verifyExecutionTracePreflight(preflightPath);

  assert.equal(verification.record_type, "ExecutionTracePreflightVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.preflight_state, "TRACE_PREFLIGHT_DEFINED");
  assert.equal(verification.trace_state, "NOT_DISPATCHED");
  assert.equal(verification.dispatch_performed, false);
  assert.equal(verification.execution_trace_bound, false);
  assert.equal(verification.effect_evidence_created, false);
  assert.equal(verification.operational_allowed, false);
}

// PILOT209-T09 verifier detects dispatch overclaim.
{
  const tmp = "/tmp/hbce-prog-209-preflight-dispatch-overclaim.json";
  const preflight = runtime.readJson(preflightPath);
  const tampered = {
    ...preflight,
    dispatch_performed: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyExecutionTracePreflight(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "PREFLIGHT_OVERCLAIM" && error.key === "dispatch_performed"));
}

// PILOT209-T10 evidence preserves no-dispatch boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-209");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.preflight_state, "TRACE_PREFLIGHT_DEFINED");
  assert.equal(evidence.trace_state, "NOT_DISPATCHED");
  assert.equal(evidence.dispatch_prepared, false);
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

console.log("PROG_209_HBCE_INTERNAL_PILOT_EXECUTION_TRACE_PREFLIGHT_TEST=PASS");
