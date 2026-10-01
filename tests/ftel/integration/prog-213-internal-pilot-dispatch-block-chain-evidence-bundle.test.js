"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-dispatch-block-chain-evidence-bundle.js"));

const bundlePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/06_evidence_bundles/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchBlockChainEvidenceBundle_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/06_evidence_bundles/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-213-evidence_v001.json";

// PILOT213-T01 bundle exists and loads.
{
  assert.equal(runtime.fileExists(bundlePath), true);
  const bundle = runtime.readJson(bundlePath);

  assert.equal(bundle.artifact_type, "DispatchBlockChainEvidenceBundle");
  assert.equal(bundle.pilot_id, runtime.PILOT_ID);
  assert.equal(bundle.schema_version, runtime.BUNDLE_VERSION);
}

// PILOT213-T02 required input roles are present and digest-bound.
{
  const bundle = runtime.readJson(bundlePath);
  const roles = bundle.inputs.map((input) => input.role);

  for (const role of Object.keys(runtime.INPUT_PATHS)) {
    assert.ok(roles.includes(role), role);
    const input = bundle.inputs.find((candidate) => candidate.role === role);
    assert.equal(input.exists, true);
    assert.equal(input.verified, true);
    assert.equal(typeof input.sha256, "string");
    assert.equal(input.sha256.length, 64);
  }
}

// PILOT213-T03 chain closure is no-execution.
{
  const bundle = runtime.readJson(bundlePath);

  assert.equal(bundle.bundle_state, "DISPATCH_BLOCK_CHAIN_BUNDLED");
  assert.equal(bundle.chain_closure_state, "CLOSED_AT_AUTHORITY_BLOCK_NO_EXECUTION");
  assert.equal(bundle.execution_state, "NOT_EXECUTED");
  assert.equal(bundle.evidence_scope, "INTERNAL_STRUCTURAL_EVIDENCE_ONLY");
}

// PILOT213-T04 chain assertions are complete.
{
  const bundle = runtime.readJson(bundlePath);

  assert.equal(bundle.chain_assertions.execution_trace_contract_defined, true);
  assert.equal(bundle.chain_assertions.execution_trace_preflight_defined_not_dispatched, true);
  assert.equal(bundle.chain_assertions.dispatch_prepared_structurally, true);
  assert.equal(bundle.chain_assertions.dispatch_authority_blocked_fail_closed, true);
  assert.equal(bundle.chain_assertions.authority_block_receipt_recorded, true);
  assert.equal(bundle.chain_assertions.all_inputs_digest_bound, true);
  assert.equal(bundle.chain_assertions.all_inputs_structurally_verified, true);
  assert.equal(bundle.chain_assertions.no_execution_boundary_preserved, true);
}

// PILOT213-T05 no-execution flags remain false.
{
  const bundle = runtime.readJson(bundlePath);

  for (const key of [
    "dispatch_execution_authorized",
    "dispatch_command_emitted",
    "dispatch_performed",
    "external_connector_called",
    "target_system_contacted",
    "target_receipt_created",
    "execution_trace_bound",
    "effect_evidence_created",
    "operational_allowed",
    "customer_external_execution_allowed"
  ]) {
    assert.equal(bundle.no_execution_flags[key], false, key);
  }
}

// PILOT213-T06 claim boundary prevents overclaim.
{
  const bundle = runtime.readJson(bundlePath);

  assert.equal(bundle.claim_boundary.internal_bundle_created, true);
  assert.equal(bundle.claim_boundary.structural_evidence_only, true);
  assert.equal(bundle.claim_boundary.no_execution_chain_closed, true);
  assert.equal(bundle.claim_boundary.dispatch_authorization_not_granted, true);
  assert.equal(bundle.claim_boundary.dispatch_command_not_emitted, true);
  assert.equal(bundle.claim_boundary.dispatch_not_performed, true);
  assert.equal(bundle.claim_boundary.external_connector_not_called, true);
  assert.equal(bundle.claim_boundary.target_system_not_contacted, true);
  assert.equal(bundle.claim_boundary.target_receipt_not_created, true);
  assert.equal(bundle.claim_boundary.execution_trace_not_created, true);
  assert.equal(bundle.claim_boundary.effect_evidence_not_created, true);
  assert.equal(bundle.claim_boundary.level4_not_inferred, true);
}

// PILOT213-T07 verifier accepts canonical bundle.
{
  const verification = runtime.verifyDispatchBlockChainEvidenceBundle(bundlePath);

  assert.equal(verification.record_type, "DispatchBlockChainEvidenceBundleVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.bundle_state, "DISPATCH_BLOCK_CHAIN_BUNDLED");
  assert.equal(verification.chain_closure_state, "CLOSED_AT_AUTHORITY_BLOCK_NO_EXECUTION");
  assert.equal(verification.execution_state, "NOT_EXECUTED");
  assert.equal(verification.input_count, 5);
}

// PILOT213-T08 verifier detects execution overclaim.
{
  const tmp = "/tmp/hbce-prog-213-execution-overclaim.json";
  const bundle = runtime.readJson(bundlePath);
  const tampered = {
    ...bundle,
    no_execution_flags: {
      ...bundle.no_execution_flags,
      dispatch_performed: true
    }
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyDispatchBlockChainEvidenceBundle(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "DISPATCH_BLOCK_CHAIN_OVERCLAIM" && error.key === "dispatch_performed"));
}

// PILOT213-T09 verifier detects missing input role.
{
  const tmp = "/tmp/hbce-prog-213-missing-input-role.json";
  const bundle = runtime.readJson(bundlePath);
  const tampered = {
    ...bundle,
    inputs: bundle.inputs.filter((input) => input.role !== "dispatch_authority_block_receipt")
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyDispatchBlockChainEvidenceBundle(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "REQUIRED_INPUT_MISSING" && error.role === "dispatch_authority_block_receipt"));
}

// PILOT213-T10 evidence preserves internal-only no-execution boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-213");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.bundle_state, "DISPATCH_BLOCK_CHAIN_BUNDLED");
  assert.equal(evidence.chain_closure_state, "CLOSED_AT_AUTHORITY_BLOCK_NO_EXECUTION");
  assert.equal(evidence.execution_state, "NOT_EXECUTED");
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

console.log("PROG_213_HBCE_INTERNAL_PILOT_DISPATCH_BLOCK_CHAIN_EVIDENCE_BUNDLE_TEST=PASS");
