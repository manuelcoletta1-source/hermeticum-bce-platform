"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-dispatch-preparation.js"));

const preparationPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchPreparation_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-210-evidence_v001.json";

// PILOT210-T01 preparation exists and loads.
{
  assert.equal(runtime.fileExists(preparationPath), true);
  const preparation = runtime.readJson(preparationPath);

  assert.equal(preparation.artifact_type, "DispatchPreparation");
  assert.equal(preparation.pilot_id, runtime.PILOT_ID);
  assert.equal(preparation.schema_version, runtime.DISPATCH_PREPARATION_VERSION);
}

// PILOT210-T02 preflight input is digest-bound.
{
  const preparation = runtime.readJson(preparationPath);

  assert.equal(preparation.input_artifacts.execution_trace_preflight_verified, true);
  assert.equal(typeof preparation.input_artifacts.execution_trace_preflight_sha256, "string");
  assert.equal(preparation.input_artifacts.execution_trace_preflight_sha256.length, 64);
}

// PILOT210-T03 dispatch and attempt identifiers are allocated.
{
  const preparation = runtime.readJson(preparationPath);

  assert.equal(typeof preparation.correlation_chain.dispatch_id, "string");
  assert.ok(preparation.correlation_chain.dispatch_id.startsWith("dispatch-"));
  assert.equal(typeof preparation.correlation_chain.attempt_id, "string");
  assert.ok(preparation.correlation_chain.attempt_id.startsWith("attempt-"));
}

// PILOT210-T04 post-dispatch fields remain null.
{
  const preparation = runtime.readJson(preparationPath);

  assert.equal(preparation.correlation_chain.target_receipt_id, null);
  assert.equal(preparation.correlation_chain.execution_trace_ref, null);
  assert.equal(preparation.correlation_chain.effect_evidence_ref, null);
}

// PILOT210-T05 state is prepared but not performed.
{
  const preparation = runtime.readJson(preparationPath);

  assert.equal(preparation.dispatch_preparation_state, "DISPATCH_PREPARED_STRUCTURALLY");
  assert.equal(preparation.trace_state, "DISPATCH_PREPARED");
  assert.equal(preparation.dispatch_prepared, true);
  assert.equal(preparation.dispatch_performed, false);
  assert.equal(preparation.maximum_supported_claim, "DISPATCH_PREPARED_NOT_PERFORMED");
}

// PILOT210-T06 no external system contact is claimed.
{
  const preparation = runtime.readJson(preparationPath);

  assert.equal(preparation.dispatch_boundary.dispatch_command_emitted, false);
  assert.equal(preparation.dispatch_boundary.external_connector_called, false);
  assert.equal(preparation.dispatch_boundary.target_system_contacted, false);
  assert.equal(preparation.dispatch_boundary.target_receipt_created, false);
  assert.equal(preparation.dispatch_boundary.execution_trace_created, false);
  assert.equal(preparation.dispatch_boundary.effect_evidence_created, false);
}

// PILOT210-T07 no execution/effect/customer boundary is crossed.
{
  const preparation = runtime.readJson(preparationPath);

  assert.equal(preparation.target_acknowledged, false);
  assert.equal(preparation.target_receipt_created, false);
  assert.equal(preparation.execution_trace_bound, false);
  assert.equal(preparation.effect_evidence_created, false);
  assert.equal(preparation.operational_allowed, false);
  assert.equal(preparation.customer_external_execution_allowed, false);
}

// PILOT210-T08 verifier accepts canonical preparation.
{
  const verification = runtime.verifyDispatchPreparation(preparationPath);

  assert.equal(verification.record_type, "DispatchPreparationVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.trace_state, "DISPATCH_PREPARED");
  assert.equal(verification.dispatch_prepared, true);
  assert.equal(verification.dispatch_performed, false);
  assert.equal(verification.target_receipt_created, false);
  assert.equal(verification.execution_trace_bound, false);
  assert.equal(verification.effect_evidence_created, false);
  assert.equal(verification.operational_allowed, false);
}

// PILOT210-T09 verifier detects dispatch performed overclaim.
{
  const tmp = "/tmp/hbce-prog-210-dispatch-performed-overclaim.json";
  const preparation = runtime.readJson(preparationPath);
  const tampered = {
    ...preparation,
    dispatch_performed: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyDispatchPreparation(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "DISPATCH_PREPARATION_OVERCLAIM" && error.key === "dispatch_performed"));
}

// PILOT210-T10 evidence preserves no-external-call boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-210");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.dispatch_preparation_state, "DISPATCH_PREPARED_STRUCTURALLY");
  assert.equal(evidence.trace_state, "DISPATCH_PREPARED");
  assert.equal(evidence.dispatch_prepared, true);
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

console.log("PROG_210_HBCE_INTERNAL_PILOT_DISPATCH_PREPARATION_TEST=PASS");
