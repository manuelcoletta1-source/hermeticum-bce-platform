"use strict";

const assert = require("assert/strict");
const path = require("path");
const fs = require("fs");

const runtime = require(path.join(process.cwd(), "runtime/pilot/hbce-internal-pilot-baseline-manifest.js"));

const root = "pilot/HBCE-PILOT-INTERNAL-2027-0001";
const manifestPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/00_scope/20260930_HBCE-PILOT-INTERNAL-2027-0001_BaselineManifest_v001.json";
const indexPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/artifact-index.json";
const evidencePath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/03_eg001/20260930_HBCE-PILOT-INTERNAL-2027-0001_PROG-204-evidence_v001.json";

// PILOT204-T01 required pilot root exists.
{
  assert.equal(runtime.directoryExists(root), true);
}

// PILOT204-T02 all required directories exist.
{
  for (const dir of runtime.REQUIRED_DIRECTORIES) {
    assert.equal(runtime.directoryExists(path.join(root, dir)), true, dir);
  }
}

// PILOT204-T03 baseline manifest exists and has canonical LC-C/A1 boundary.
{
  assert.equal(runtime.fileExists(manifestPath), true);
  const manifest = runtime.readJson(manifestPath);

  assert.equal(manifest.pilot_id, runtime.PILOT_ID);
  assert.equal(manifest.initial_class, "LC-C/A1_INTERNAL_CONTROLLED");
  assert.equal(manifest.customer_external_execution, false);
  assert.equal(manifest.level4_blocked, true);
  assert.equal(manifest.c16_external_validation_performed, false);
}

// PILOT204-T04 baseline manifest claim boundary refuses overclaim.
{
  const manifest = runtime.readJson(manifestPath);

  assert.equal(manifest.claim_boundary.product_readiness, false);
  assert.equal(manifest.claim_boundary.compliance_evidence, false);
  assert.equal(manifest.claim_boundary.certification, false);
  assert.equal(manifest.claim_boundary.external_validation, false);
  assert.equal(manifest.claim_boundary.commercial_release_authorization, false);
  assert.equal(manifest.claim_boundary.legal_effect, false);
  assert.equal(manifest.claim_boundary.level4, false);
}

// PILOT204-T05 baseline manifest self content hash is stable.
{
  const manifest = runtime.readJson(manifestPath);
  const expected = runtime.sha256Text(JSON.stringify({ ...manifest, content_sha256: null }));

  assert.equal(manifest.content_sha256, expected);
  assert.equal(manifest.content_sha256.length, 64);
}

// PILOT204-T06 artifact index exists and lists all required directories.
{
  assert.equal(runtime.fileExists(indexPath), true);
  const index = runtime.readJson(indexPath);

  assert.equal(index.pilot_id, runtime.PILOT_ID);
  for (const dir of runtime.REQUIRED_DIRECTORIES) {
    assert.ok(index.directories.includes(path.posix.join(root, dir)), dir);
  }
}

// PILOT204-T07 artifact index boundary refuses overclaim.
{
  const index = runtime.readJson(indexPath);

  assert.equal(index.claim_boundary.product_readiness, false);
  assert.equal(index.claim_boundary.compliance_evidence, false);
  assert.equal(index.claim_boundary.certification, false);
  assert.equal(index.claim_boundary.external_validation, false);
  assert.equal(index.claim_boundary.commercial_release_authorization, false);
  assert.equal(index.claim_boundary.legal_effect, false);
  assert.equal(index.claim_boundary.level4, false);
}

// PILOT204-T08 verifier accepts canonical pilot baseline.
{
  const record = runtime.verifyBaselineManifest({ root, manifestPath, indexPath });

  assert.equal(record.record_type, "HBCEInternalPilotBaselineManifestVerificationRecord");
  assert.equal(record.verified, true);
  assert.equal(record.error_count, 0);
  assert.deepEqual(record.errors, []);
  assert.equal(typeof record.record_sha256, "string");
  assert.equal(record.record_sha256.length, 64);
}

// PILOT204-T09 verifier detects tampered manifest claim boundary.
{
  const tmpRoot = "/tmp/hbce-pilot-204";
  const tmpManifest = "/tmp/hbce-pilot-204-manifest.json";
  const tmpIndex = "/tmp/hbce-pilot-204-index.json";

  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.mkdirSync(tmpRoot, { recursive: true });
  for (const dir of runtime.REQUIRED_DIRECTORIES) {
    fs.mkdirSync(path.join(tmpRoot, dir), { recursive: true });
  }

  const manifest = runtime.createBaselineManifest({ root: tmpRoot });
  manifest.claim_boundary.certification = true;
  manifest.content_sha256 = runtime.sha256Text(JSON.stringify({ ...manifest, content_sha256: null }));
  fs.writeFileSync(tmpManifest, JSON.stringify(manifest, null, 2));

  const index = runtime.createArtifactIndex({ root: tmpRoot });
  fs.writeFileSync(tmpIndex, JSON.stringify(index, null, 2));

  const record = runtime.verifyBaselineManifest({ root: tmpRoot, manifestPath: tmpManifest, indexPath: tmpIndex });

  assert.equal(record.verified, false);
  assert.ok(record.errors.some((error) => error.code === "CLAIM_BOUNDARY_OVERCLAIM" && error.key === "certification"));
}

// PILOT204-T10 evidence record preserves internal-only boundary.
{
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, "PROG-204");
  assert.equal(evidence.pilot_id, runtime.PILOT_ID);
  assert.equal(evidence.evidence_class, "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED");
  assert.equal(evidence.initial_class, "LC-C/A1_INTERNAL_CONTROLLED");
  assert.equal(evidence.customer_external_execution, false);
  assert.equal(evidence.c16_external_validation_performed, false);
  assert.equal(evidence.level4_blocked, true);
  assert.equal(evidence.product_readiness_claimed, false);
  assert.equal(evidence.compliance_evidence_claimed, false);
  assert.equal(evidence.certification_claimed, false);
  assert.equal(evidence.external_validation_claimed, false);
  assert.equal(evidence.commercial_release_authorization_claimed, false);
  assert.equal(evidence.legal_effect_claimed, false);
  assert.equal(evidence.level4_claimed, false);
}

console.log("PROG_204_HBCE_INTERNAL_PILOT_DIRECTORY_BASELINE_MANIFEST_TEST=PASS");
