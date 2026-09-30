"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-policy-registry.js"));

const registryPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/02_policies/20260930_HBCE-PILOT-INTERNAL-2027-0001_PolicyRegistry_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/02_policies/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-206-evidence_v001.json";

// PILOT206-T01 registry exists and loads.
{
  assert.equal(runtime.fileExists(registryPath), true);
  const registry = runtime.readJson(registryPath);

  assert.equal(registry.artifact_type, "PolicyRegistry");
  assert.equal(registry.pilot_id, runtime.PILOT_ID);
  assert.equal(registry.schema_version, runtime.POLICY_REGISTRY_VERSION);
}

// PILOT206-T02 required policies are represented.
{
  const registry = runtime.readJson(registryPath);
  const policyIds = registry.policy_records.map((record) => record.policy_id);

  for (const policyId of runtime.REQUIRED_POLICY_IDS) {
    assert.ok(policyIds.includes(policyId), policyId);
  }

  assert.equal(registry.required_policy_count, runtime.REQUIRED_POLICY_IDS.length);
}

// PILOT206-T03 all policies are fail-closed and structurally validated only.
{
  const registry = runtime.readJson(registryPath);

  for (const record of registry.policy_records) {
    assert.equal(record.enforcement_mode, "FAIL_CLOSED");
    assert.equal(record.evidence_class, "STRUCTURALLY_VALIDATED");
    assert.equal(record.policy_scope, "INTERNAL_PILOT_ONLY");
  }
}

// PILOT206-T04 prohibited claims are not allowed by any policy.
{
  const registry = runtime.readJson(registryPath);

  for (const record of registry.policy_records) {
    for (const claim of record.prohibited_claims) {
      assert.equal(record.allowed_claims.includes(claim), false, `${record.policy_id}:${claim}`);
    }
  }
}

// PILOT206-T05 registry refuses external/customer/legal/commercial/level4 claims.
{
  const registry = runtime.readJson(registryPath);

  assert.equal(registry.customer_external_execution, false);
  assert.equal(registry.c16_external_validation_performed, false);
  assert.equal(registry.legal_review_claimed, false);
  assert.equal(registry.certification_claimed, false);
  assert.equal(registry.external_validation_claimed, false);
  assert.equal(registry.commercial_release_authorization_claimed, false);
  assert.equal(registry.level4_claimed, false);
}

// PILOT206-T06 registry hash and policy hashes are stable.
{
  const registry = runtime.readJson(registryPath);
  const expectedRegistryHash = runtime.sha256Record({ ...registry, content_sha256: null });

  assert.equal(registry.content_sha256, expectedRegistryHash);
  assert.equal(registry.content_sha256.length, 64);

  for (const record of registry.policy_records) {
    const expectedPolicyHash = runtime.sha256Record({ ...record, record_sha256: null });
    assert.equal(record.record_sha256, expectedPolicyHash);
    assert.equal(record.record_sha256.length, 64);
  }
}

// PILOT206-T07 verifier accepts canonical registry.
{
  const verification = runtime.verifyPolicyRegistry(registryPath);

  assert.equal(verification.record_type, "PolicyRegistryVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.required_policy_count, runtime.REQUIRED_POLICY_IDS.length);
  assert.equal(verification.observed_policy_count, runtime.REQUIRED_POLICY_IDS.length);
  assert.equal(verification.policy_gate, "DEFINED_PENDING_RUNTIME_BINDING");
  assert.equal(typeof verification.record_sha256, "string");
  assert.equal(verification.record_sha256.length, 64);
}

// PILOT206-T08 verifier detects non-fail-closed tamper.
{
  const tmp = "/tmp/hbce-prog-206-policy-non-fail-closed.json";
  const registry = runtime.readJson(registryPath);
  const tamperedPolicy = {
    ...registry.policy_records[0],
    enforcement_mode: "BEST_EFFORT"
  };
  tamperedPolicy.record_sha256 = runtime.sha256Record({ ...tamperedPolicy, record_sha256: null });

  const tampered = {
    ...registry,
    policy_records: [tamperedPolicy].concat(registry.policy_records.slice(1))
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyPolicyRegistry(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "POLICY_NOT_FAIL_CLOSED"));
}

// PILOT206-T09 verifier detects overclaim tamper.
{
  const tmp = "/tmp/hbce-prog-206-policy-overclaim.json";
  const registry = runtime.readJson(registryPath);
  const tampered = {
    ...registry,
    external_validation_claimed: true
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyPolicyRegistry(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "POLICY_REGISTRY_OVERCLAIM" && error.key === "external_validation_claimed"));
}

// PILOT206-T10 evidence preserves internal-only policy boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-206");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.policy_gate, "DEFINED_PENDING_RUNTIME_BINDING");
  assert.equal(evidence.customer_external_execution, false);
  assert.equal(evidence.c16_external_validation_performed, false);
  assert.equal(evidence.legal_review_claimed, false);
  assert.equal(evidence.certification_claimed, false);
  assert.equal(evidence.external_validation_claimed, false);
  assert.equal(evidence.commercial_release_authorization_claimed, false);
  assert.equal(evidence.level4_claimed, false);
}

console.log("PROG_206_HBCE_INTERNAL_PILOT_POLICY_REGISTRY_TEST=PASS");
