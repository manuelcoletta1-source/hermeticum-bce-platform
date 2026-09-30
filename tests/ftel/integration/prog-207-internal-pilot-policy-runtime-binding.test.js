"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-policy-runtime-binding.js"));

const bindingPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/02_policies/20260930_HBCE-PILOT-INTERNAL-2027-0001_PolicyRuntimeBinding_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/02_policies/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-207-evidence_v001.json";

// PILOT207-T01 binding exists and loads.
{
  assert.equal(runtime.fileExists(bindingPath), true);
  const binding = runtime.readJson(bindingPath);

  assert.equal(binding.artifact_type, "PolicyRuntimeBinding");
  assert.equal(binding.pilot_id, runtime.PILOT_ID);
  assert.equal(binding.schema_version, runtime.BINDING_VERSION);
}

// PILOT207-T02 input artifact digests are bound.
{
  const binding = runtime.readJson(bindingPath);

  assert.equal(typeof binding.input_artifacts.baseline_manifest_sha256, "string");
  assert.equal(binding.input_artifacts.baseline_manifest_sha256.length, 64);
  assert.equal(typeof binding.input_artifacts.owner_registry_sha256, "string");
  assert.equal(binding.input_artifacts.owner_registry_sha256.length, 64);
  assert.equal(typeof binding.input_artifacts.policy_registry_sha256, "string");
  assert.equal(binding.input_artifacts.policy_registry_sha256.length, 64);
}

// PILOT207-T03 verifier results are positive for source registries.
{
  const binding = runtime.readJson(bindingPath);

  assert.equal(binding.verifier_results.baseline_verified, true);
  assert.equal(binding.verifier_results.owner_registry_verified, true);
  assert.equal(binding.verifier_results.policy_registry_verified, true);
}

// PILOT207-T04 owner gate remains blocked and operational allowed remains false.
{
  const binding = runtime.readJson(bindingPath);

  assert.equal(binding.observed_gates.initial_class, "LC-C/A1_INTERNAL_CONTROLLED");
  assert.equal(binding.observed_gates.m1_owner_gate, "BLOCKED");
  assert.equal(binding.observed_gates.policy_gate, "DEFINED_PENDING_RUNTIME_BINDING");
  assert.equal(binding.observed_gates.owner_blocked, true);
  assert.equal(binding.operational_allowed, false);
}

// PILOT207-T05 binding refuses execution/customer/legal/external/level4 claims.
{
  const binding = runtime.readJson(bindingPath);

  assert.equal(binding.execution_claim_allowed, false);
  assert.equal(binding.customer_external_execution_allowed, false);
  assert.equal(binding.c16_external_validation_performed, false);
  assert.equal(binding.legal_review_claimed, false);
  assert.equal(binding.certification_claimed, false);
  assert.equal(binding.external_validation_claimed, false);
  assert.equal(binding.commercial_release_authorization_claimed, false);
  assert.equal(binding.level4_claimed, false);
}

// PILOT207-T06 fail-closed reasons are explicit.
{
  const binding = runtime.readJson(bindingPath);

  assert.ok(binding.fail_closed_reasons.includes("M1_OWNER_GATE_BLOCKED"));
  assert.ok(binding.fail_closed_reasons.includes("EXECUTION_TRACE_NOT_BOUND"));
  assert.ok(binding.fail_closed_reasons.includes("CUSTOMER_EXECUTION_GATE_NOT_OPEN"));
  assert.ok(binding.fail_closed_reasons.includes("C16_NOT_PERFORMED"));
  assert.ok(binding.fail_closed_reasons.includes("LEGAL_REVIEW_NOT_CLAIMED"));
  assert.ok(binding.fail_closed_reasons.includes("HUMAN_GO_NOT_BOUND"));
}

// PILOT207-T07 binding hash is stable.
{
  const binding = runtime.readJson(bindingPath);
  const expected = runtime.sha256Record({ ...binding, content_sha256: null });

  assert.equal(binding.content_sha256, expected);
  assert.equal(binding.content_sha256.length, 64);
}

// PILOT207-T08 verifier accepts canonical binding.
{
  const verification = runtime.verifyPolicyRuntimeBinding(bindingPath);

  assert.equal(verification.record_type, "PolicyRuntimeBindingVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.runtime_binding_state, "BOUND_STRUCTURALLY_VALIDATED");
  assert.equal(verification.operational_allowed, false);
  assert.equal(verification.m1_owner_gate, "BLOCKED");
  assert.equal(verification.policy_gate, "DEFINED_PENDING_RUNTIME_BINDING");
  assert.equal(typeof verification.record_sha256, "string");
  assert.equal(verification.record_sha256.length, 64);
}

// PILOT207-T09 verifier detects operational overclaim tamper.
{
  const tmp = "/tmp/hbce-prog-207-binding-operational-overclaim.json";
  const binding = runtime.readJson(bindingPath);
  const tampered = {
    ...binding,
    operational_allowed: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyPolicyRuntimeBinding(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "OPERATIONAL_ALLOWED_OVERCLAIM"));
}

// PILOT207-T10 evidence preserves structural-only boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-207");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.runtime_binding_state, "BOUND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.operational_allowed, false);
  assert.equal(evidence.m1_owner_gate, "BLOCKED");
  assert.equal(evidence.execution_trace_bound, false);
  assert.equal(evidence.customer_external_execution_allowed, false);
  assert.equal(evidence.c16_external_validation_performed, false);
  assert.equal(evidence.legal_review_claimed, false);
  assert.equal(evidence.certification_claimed, false);
  assert.equal(evidence.external_validation_claimed, false);
  assert.equal(evidence.commercial_release_authorization_claimed, false);
  assert.equal(evidence.level4_claimed, false);
}

console.log("PROG_207_HBCE_INTERNAL_PILOT_POLICY_RUNTIME_BINDING_TEST=PASS");
