"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-owner-authority-registry.js"));

const registryPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/01_owners_authority/20260930_HBCE-PILOT-INTERNAL-2027-0001_OwnerAuthorityRegistry_v001.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/01_owners_authority/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-205-evidence_v001.json";

// PILOT205-T01 registry exists and loads.
{
  assert.equal(runtime.fileExists(registryPath), true);
  const registry = runtime.readJson(registryPath);

  assert.equal(registry.artifact_type, "OwnerAuthorityRegistry");
  assert.equal(registry.pilot_id, runtime.PILOT_ID);
  assert.equal(registry.schema_version, runtime.REGISTRY_VERSION);
}

// PILOT205-T02 required owner roles are represented.
{
  const registry = runtime.readJson(registryPath);
  const roles = registry.owner_records.map((record) => record.role);

  for (const role of runtime.REQUIRED_OWNER_ROLES) {
    assert.ok(roles.includes(role), role);
  }

  assert.equal(registry.required_owner_count, runtime.REQUIRED_OWNER_ROLES.length);
}

// PILOT205-T03 unassigned roles are explicit and blocked.
{
  const registry = runtime.readJson(registryPath);

  assert.equal(registry.missing_or_unverified_roles.length, runtime.REQUIRED_OWNER_ROLES.length);
  assert.equal(registry.m1_owner_gate, "BLOCKED");

  for (const record of registry.owner_records) {
    assert.equal(record.owner_status, "UNASSIGNED");
    assert.equal(record.owner_ref, null);
    assert.equal(record.authority_verified, false);
    assert.equal(record.gate_effect, "BLOCKED_UNTIL_OWNER_RECORD_ASSIGNED_AND_VERIFIED");
  }
}

// PILOT205-T04 owner records cannot self-award C16 or Level 4.
{
  const registry = runtime.readJson(registryPath);

  for (const record of registry.owner_records) {
    assert.equal(record.can_self_award_c16, false);
    assert.equal(record.can_self_award_level4, false);
    assert.equal(record.can_create_external_validation, false);
  }
}

// PILOT205-T05 corporate signatory remains unverified.
{
  const registry = runtime.readJson(registryPath);
  const corporate = registry.owner_records.find((record) => record.role === "Corporate Signatory");

  assert.equal(corporate.owner_status, "UNASSIGNED");
  assert.equal(corporate.can_bind_company, false);
  assert.equal(registry.corporate_signatory_verified, false);
  assert.equal(registry.corporate_binding_authority_status, "UNVERIFIED");
}

// PILOT205-T06 registry refuses overclaim.
{
  const registry = runtime.readJson(registryPath);

  assert.equal(registry.customer_external_execution, false);
  assert.equal(registry.external_validation_claimed, false);
  assert.equal(registry.legal_validity_claimed, false);
  assert.equal(registry.certification_claimed, false);
  assert.equal(registry.commercial_release_authorization_claimed, false);
  assert.equal(registry.level4_claimed, false);
}

// PILOT205-T07 registry hash is stable.
{
  const registry = runtime.readJson(registryPath);
  const expected = runtime.sha256Record({ ...registry, content_sha256: null });

  assert.equal(registry.content_sha256, expected);
  assert.equal(registry.content_sha256.length, 64);

  for (const record of registry.owner_records) {
    const expectedRecordHash = runtime.sha256Record({ ...record, record_sha256: null });
    assert.equal(record.record_sha256, expectedRecordHash);
    assert.equal(record.record_sha256.length, 64);
  }
}

// PILOT205-T08 verifier accepts canonical registry.
{
  const verification = runtime.verifyOwnerAuthorityRegistry(registryPath);

  assert.equal(verification.record_type, "OwnerAuthorityRegistryVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.registry_m1_owner_gate, "BLOCKED");
  assert.equal(verification.corporate_binding_authority_status, "UNVERIFIED");
  assert.equal(typeof verification.record_sha256, "string");
  assert.equal(verification.record_sha256.length, 64);
}

// PILOT205-T09 verifier detects tampered unassigned authority.
{
  const tmp = "/tmp/hbce-prog-205-owner-registry-tampered.json";
  const registry = runtime.readJson(registryPath);
  const tamperedRecord = {
    ...registry.owner_records[0],
    authority_verified: true
  };
  tamperedRecord.record_sha256 = runtime.sha256Record({ ...tamperedRecord, record_sha256: null });

  const tampered = {
    ...registry,
    owner_records: [tamperedRecord].concat(registry.owner_records.slice(1))
  };
  tampered.content_sha256 = runtime.sha256Record({ ...tampered, content_sha256: null });

  fs.writeFileSync(tmp, JSON.stringify(tampered, null, 2));
  const verification = runtime.verifyOwnerAuthorityRegistry(tmp);

  assert.equal(verification.verified, false);
  assert.ok(verification.errors.some((error) => error.code === "UNASSIGNED_ROLE_AUTHORITY_VERIFIED"));
}

// PILOT205-T10 evidence preserves blocked/internal boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-205");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.m1_owner_gate, "BLOCKED");
  assert.equal(evidence.unassigned_roles_explicit, true);
  assert.equal(evidence.corporate_signatory_verified, false);
  assert.equal(evidence.corporate_binding_authority_status, "UNVERIFIED");
  assert.equal(evidence.customer_external_execution, false);
  assert.equal(evidence.legal_review_claimed, false);
  assert.equal(evidence.corporate_signing_power_claimed, false);
  assert.equal(evidence.external_validation_claimed, false);
  assert.equal(evidence.certification_claimed, false);
  assert.equal(evidence.commercial_release_authorization_claimed, false);
  assert.equal(evidence.level4_claimed, false);
}

console.log("PROG_205_HBCE_INTERNAL_PILOT_OWNER_AUTHORITY_REGISTRY_TEST=PASS");
