"use strict";

const fs = require("fs");
const eg001 = require("./hbce-eg-001-state-transition-enforcement.js");

const VERIFIER_VERSION = "HBCE-EG-001-INTEGRATION-MANIFEST-VERIFIER-V0.1";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function sha256File(filePath) {
  return eg001.sha256(fs.readFileSync(filePath, "utf8"));
}

function validateFalseBoundaryFlags(record, flags) {
  const errors = [];

  for (const [key, expected] of Object.entries(flags)) {
    if (record[key] !== expected) {
      errors.push({
        code: "BOUNDARY_FLAG_MISMATCH",
        key,
        expected,
        observed: record[key]
      });
    }
  }

  return errors;
}

function verifyIntegrationManifest(manifestPath) {
  const manifest = readJson(manifestPath);
  const errors = [];
  const artifacts = [];

  if (manifest.control_id !== "HBCE-EG-001") {
    errors.push({ code: "CONTROL_ID_MISMATCH", observed: manifest.control_id });
  }

  if (manifest.claim_ceiling !== "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED_INTERNAL_R_AND_D_ONLY") {
    errors.push({ code: "CLAIM_CEILING_MISMATCH", observed: manifest.claim_ceiling });
  }

  for (const filePath of [
    ...manifest.runtime_modules,
    ...manifest.test_files,
    ...manifest.evidence_files,
    ...manifest.documents
  ]) {
    if (!fileExists(filePath)) {
      errors.push({ code: "MISSING_ARTIFACT", filePath });
      continue;
    }

    artifacts.push({
      filePath,
      sha256: sha256File(filePath)
    });
  }

  for (const evidencePath of manifest.evidence_files) {
    if (!fileExists(evidencePath)) continue;

    const evidence = readJson(evidencePath);
    errors.push(...validateFalseBoundaryFlags(evidence, manifest.required_boundary_flags));

    if (evidence.control_id !== "HBCE-EG-001") {
      errors.push({
        code: "EVIDENCE_CONTROL_ID_MISMATCH",
        filePath: evidencePath,
        observed: evidence.control_id
      });
    }

    if (evidence.evidence_class !== "IMPLEMENTED_AND_STRUCTURALLY_VALIDATED") {
      errors.push({
        code: "EVIDENCE_CLASS_MISMATCH",
        filePath: evidencePath,
        observed: evidence.evidence_class
      });
    }
  }

  const protectedStateErrors = [];
  for (const state of manifest.protected_states) {
    if (!eg001.isProtectedState(state)) {
      protectedStateErrors.push(state);
    }
  }

  if (protectedStateErrors.length > 0) {
    errors.push({
      code: "PROTECTED_STATE_REGISTRY_MISMATCH",
      states: protectedStateErrors
    });
  }

  const record = {
    record_type: "HBCEEG001IntegrationManifestVerificationRecord",
    verifier_version: VERIFIER_VERSION,
    manifest_id: manifest.manifest_id,
    manifest_version: manifest.manifest_version,
    control_id: manifest.control_id,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    artifact_count: artifacts.length,
    artifacts,
    claim_ceiling: manifest.claim_ceiling,
    boundary_flags: manifest.required_boundary_flags,
    record_sha256: null
  };

  record.record_sha256 = eg001.sha256(record);
  return record;
}

function integrationBoundaryRecord() {
  return {
    verifier_version: VERIFIER_VERSION,
    purpose: "Verify the HBCE-EG-001 Shared Core integration manifest and enforce its internal R&D claim ceiling.",
    creates_external_validation: false,
    creates_legal_validity: false,
    creates_certification: false,
    creates_procurement_eligibility: false,
    creates_level4: false,
    ai_authority_allowed: false
  };
}

module.exports = {
  VERIFIER_VERSION,
  readJson,
  fileExists,
  sha256File,
  validateFalseBoundaryFlags,
  verifyIntegrationManifest,
  integrationBoundaryRecord
};
