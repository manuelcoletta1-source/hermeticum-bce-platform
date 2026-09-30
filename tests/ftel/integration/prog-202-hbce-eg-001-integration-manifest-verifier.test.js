"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const verifier = require(path.join(process.cwd(), "runtime/shared-core/hbce-eg-001-integration-manifest-verifier.js"));
const manifestPath = "docs/shared-core/hbce-eg-001-integration-manifest.json";

// INT-T01 manifest loads and identifies HBCE-EG-001.
{
  const manifest = verifier.readJson(manifestPath);

  assert.equal(manifest.manifest_id, "HBCE-EG-001-INTEGRATION-MANIFEST");
  assert.equal(manifest.control_id, "HBCE-EG-001");
  assert.equal(manifest.program, "PROG-202");
  assert.equal(manifest.claim_ceiling, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED_INTERNAL_R_AND_D_ONLY");
}

// INT-T02 manifest covers PROG-197..PROG-201 in order.
{
  const manifest = verifier.readJson(manifestPath);

  assert.deepEqual(manifest.depends_on_programs, [
    "PROG-197",
    "PROG-198",
    "PROG-199",
    "PROG-200",
    "PROG-201"
  ]);
}

// INT-T03 all runtime modules exist.
{
  const manifest = verifier.readJson(manifestPath);

  for (const filePath of manifest.runtime_modules) {
    assert.equal(verifier.fileExists(filePath), true, filePath);
  }
}

// INT-T04 all tests/evidence/docs exist.
{
  const manifest = verifier.readJson(manifestPath);

  for (const filePath of [...manifest.test_files, ...manifest.evidence_files, ...manifest.documents]) {
    assert.equal(verifier.fileExists(filePath), true, filePath);
  }
}

// INT-T05 all evidence files preserve false authority flags.
{
  const manifest = verifier.readJson(manifestPath);

  for (const evidencePath of manifest.evidence_files) {
    const evidence = verifier.readJson(evidencePath);
    const errors = verifier.validateFalseBoundaryFlags(evidence, manifest.required_boundary_flags);

    assert.deepEqual(errors, [], evidencePath);
    assert.equal(evidence.control_id, "HBCE-EG-001");
    assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  }
}

// INT-T06 verifier produces verified digest-bound record.
{
  const record = verifier.verifyIntegrationManifest(manifestPath);

  assert.equal(record.record_type, "HBCEEG001IntegrationManifestVerificationRecord");
  assert.equal(record.control_id, "HBCE-EG-001");
  assert.equal(record.verified, true);
  assert.equal(record.error_count, 0);
  assert.equal(record.errors.length, 0);
  assert.ok(record.artifact_count >= 20);
  assert.equal(typeof record.record_sha256, "string");
  assert.equal(record.record_sha256.length, 64);
}

// INT-T07 verifier detects tampered boundary flag.
{
  const tmp = "/tmp/hbce-eg-001-integration-manifest-tampered.json";
  const manifest = verifier.readJson(manifestPath);
  const originalEvidencePath = manifest.evidence_files[0];
  const tmpEvidence = "/tmp/hbce-eg-001-evidence-tampered.json";
  const evidence = verifier.readJson(originalEvidencePath);

  fs.writeFileSync(tmpEvidence, JSON.stringify({
    ...evidence,
    external_validation_claimed: true
  }, null, 2));

  fs.writeFileSync(tmp, JSON.stringify({
    ...manifest,
    evidence_files: [tmpEvidence]
  }, null, 2));

  const record = verifier.verifyIntegrationManifest(tmp);

  assert.equal(record.verified, false);
  assert.ok(record.errors.some((error) => error.code === "BOUNDARY_FLAG_MISMATCH" && error.key === "external_validation_claimed"));
}

// INT-T08 verifier detects missing artifact.
{
  const tmp = "/tmp/hbce-eg-001-integration-manifest-missing-artifact.json";
  const manifest = verifier.readJson(manifestPath);

  fs.writeFileSync(tmp, JSON.stringify({
    ...manifest,
    runtime_modules: manifest.runtime_modules.concat("runtime/shared-core/does-not-exist.js")
  }, null, 2));

  const record = verifier.verifyIntegrationManifest(tmp);

  assert.equal(record.verified, false);
  assert.ok(record.errors.some((error) => error.code === "MISSING_ARTIFACT"));
}

// INT-T09 protected states are aligned with runtime registry.
{
  const manifest = verifier.readJson(manifestPath);
  const record = verifier.verifyIntegrationManifest(manifestPath);

  assert.deepEqual(manifest.protected_states, [
    "PASS",
    "CLOSED",
    "RELEASE_CLEAN_ELIGIBLE",
    "EXTERNALLY_VALIDATED",
    "LEVEL_4_ELIGIBLE"
  ]);
  assert.equal(record.errors.some((error) => error.code === "PROTECTED_STATE_REGISTRY_MISMATCH"), false);
}

// INT-T10 integration boundary refuses authority inflation.
{
  const boundary = verifier.integrationBoundaryRecord();

  assert.equal(boundary.creates_external_validation, false);
  assert.equal(boundary.creates_legal_validity, false);
  assert.equal(boundary.creates_certification, false);
  assert.equal(boundary.creates_procurement_eligibility, false);
  assert.equal(boundary.creates_level4, false);
  assert.equal(boundary.ai_authority_allowed, false);
}

console.log("PROG_202_HBCE_EG_001_INTEGRATION_MANIFEST_VERIFIER_TEST=PASS");
