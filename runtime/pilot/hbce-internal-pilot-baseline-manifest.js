"use strict";

const fs = require("fs");
const path = require("path");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const BASELINE_MANIFEST_VERSION = "HBCE-INTERNAL-PILOT-BASELINE-MANIFEST-V0.1";

const REQUIRED_DIRECTORIES = [
  "00_scope",
  "01_owners_authority",
  "02_policies",
  "03_eg001",
  "04_tests",
  "05_runtime_traces",
  "06_negative_pack",
  "07_replay_reconciliation",
  "08_recovery",
  "09_c01_c15",
  "10_legal_corporate_refs",
  "11_contracts",
  "12_claims",
  "13_incidents",
  "14_release_candidate",
  "15_human_decisions",
  "16_final_d0"
];

function sha256Text(text) {
  return eg001.sha256(String(text));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function contentSha256(filePath) {
  return sha256Text(fs.readFileSync(filePath, "utf8"));
}

function createBaselineManifest({
  pilot_id = PILOT_ID,
  created_at = "2026-09-30T20:30:00+02:00",
  root = "pilot/HBCE-PILOT-INTERNAL-2027-0001"
} = {}) {
  const manifest = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_BaselineManifest_v001",
    artifact_type: "BaselineManifest",
    schema_version: BASELINE_MANIFEST_VERSION,
    pilot_id,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "JOKER-C2_ASSISTED_PROGRAMMING_HANDOFF",
    source_refs: [
      "HBCE-PILOT-PROG-2027-0001/V1.0-CANDIDATE",
      "HBCE-CORP-LT-MASTER-2027-0001-R1/V1.1-R1",
      "HBCE-RD-MASTER-2027-0004-R1/V1.4-R1",
      "PROG-197",
      "PROG-198",
      "PROG-199",
      "PROG-200",
      "PROG-201",
      "PROG-202",
      "PROG-203"
    ],
    created_at,
    root,
    initial_class: "LC-C/A1_INTERNAL_CONTROLLED",
    customer_external_execution: false,
    level4_blocked: true,
    c16_external_validation_performed: false,
    c01_c15_closure: "PENDING",
    evidence_class: "STRUCTURALLY_VALIDATED",
    maximum_supported_claim: "INTERNAL_PILOT_DIRECTORY_AND_BASELINE_MANIFEST_CREATED",
    claim_boundary: {
      product_readiness: false,
      compliance_evidence: false,
      certification: false,
      external_validation: false,
      commercial_release_authorization: false,
      legal_effect: false,
      level4: false
    },
    required_directories: REQUIRED_DIRECTORIES.map((name) => ({
      name,
      path: path.posix.join(root, name),
      status: "REQUIRED"
    })),
    next_required_work: [
      "bind OwnerRecords",
      "bind policy records",
      "execute EG-T01..EG-T15 with artifact contract",
      "extend Golden Flow to dispatch/execution/outcome traces",
      "create negative/adversarial pack",
      "create recovery/idempotency/reconciliation dry run",
      "bind C01-C15 effective artifacts or explicit pending records"
    ],
    supersedes: null,
    status: "ACTIVE_INTERNAL_PILOT_BASELINE",
    content_sha256: null
  };

  manifest.content_sha256 = sha256Text(JSON.stringify({ ...manifest, content_sha256: null }));
  return manifest;
}

function createArtifactIndex({
  pilot_id = PILOT_ID,
  created_at = "2026-09-30T20:30:00+02:00",
  root = "pilot/HBCE-PILOT-INTERNAL-2027-0001"
} = {}) {
  const index = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_ArtifactIndex_v001",
    artifact_type: "ArtifactIndex",
    schema_version: "HBCE-INTERNAL-PILOT-ARTIFACT-INDEX-V0.1",
    pilot_id,
    created_at,
    root,
    directories: REQUIRED_DIRECTORIES.map((name) => path.posix.join(root, name)),
    canonical_file_naming: "<date>_<pilot_id>_<artifact_type>_<subject_or_test_id>_<version>.<ext>",
    minimum_metadata: [
      "artifact_id",
      "artifact_type",
      "schema_version",
      "pilot_id",
      "subject_ref",
      "producer_ref",
      "source_refs",
      "created_at",
      "content_sha256",
      "claim_boundary",
      "status"
    ],
    claim_boundary: {
      product_readiness: false,
      compliance_evidence: false,
      certification: false,
      external_validation: false,
      commercial_release_authorization: false,
      legal_effect: false,
      level4: false
    },
    content_sha256: null
  };

  index.content_sha256 = sha256Text(JSON.stringify({ ...index, content_sha256: null }));
  return index;
}

function verifyBaselineManifest({ root, manifestPath, indexPath }) {
  const errors = [];

  if (!directoryExists(root)) {
    errors.push({ code: "PILOT_ROOT_MISSING", path: root });
  }

  for (const dir of REQUIRED_DIRECTORIES) {
    const dirPath = path.join(root, dir);
    if (!directoryExists(dirPath)) {
      errors.push({ code: "PILOT_REQUIRED_DIRECTORY_MISSING", path: dirPath });
    }
  }

  if (!fileExists(manifestPath)) {
    errors.push({ code: "BASELINE_MANIFEST_MISSING", path: manifestPath });
  }

  if (!fileExists(indexPath)) {
    errors.push({ code: "ARTIFACT_INDEX_MISSING", path: indexPath });
  }

  let manifest = null;
  if (fileExists(manifestPath)) {
    manifest = readJson(manifestPath);

    if (manifest.pilot_id !== PILOT_ID) {
      errors.push({ code: "PILOT_ID_MISMATCH", observed: manifest.pilot_id });
    }

    if (manifest.initial_class !== "LC-C/A1_INTERNAL_CONTROLLED") {
      errors.push({ code: "INITIAL_CLASS_MISMATCH", observed: manifest.initial_class });
    }

    if (manifest.customer_external_execution !== false) {
      errors.push({ code: "CUSTOMER_EXTERNAL_EXECUTION_NOT_BLOCKED", observed: manifest.customer_external_execution });
    }

    if (manifest.level4_blocked !== true) {
      errors.push({ code: "LEVEL4_NOT_BLOCKED", observed: manifest.level4_blocked });
    }

    if (manifest.c16_external_validation_performed !== false) {
      errors.push({ code: "C16_FALSELY_PERFORMED", observed: manifest.c16_external_validation_performed });
    }

    for (const [key, value] of Object.entries(manifest.claim_boundary || {})) {
      if (value !== false) {
        errors.push({ code: "CLAIM_BOUNDARY_OVERCLAIM", key, observed: value });
      }
    }

    const expectedHash = sha256Text(JSON.stringify({ ...manifest, content_sha256: null }));
    if (manifest.content_sha256 !== expectedHash) {
      errors.push({
        code: "BASELINE_MANIFEST_HASH_MISMATCH",
        expected: expectedHash,
        observed: manifest.content_sha256
      });
    }
  }

  let index = null;
  if (fileExists(indexPath)) {
    index = readJson(indexPath);

    if (index.pilot_id !== PILOT_ID) {
      errors.push({ code: "INDEX_PILOT_ID_MISMATCH", observed: index.pilot_id });
    }

    for (const dir of REQUIRED_DIRECTORIES) {
      const expectedPath = path.posix.join(root.replace(/\\/g, "/"), dir);
      if (!index.directories.includes(expectedPath)) {
        errors.push({ code: "INDEX_DIRECTORY_MISSING", path: expectedPath });
      }
    }

    for (const [key, value] of Object.entries(index.claim_boundary || {})) {
      if (value !== false) {
        errors.push({ code: "INDEX_CLAIM_BOUNDARY_OVERCLAIM", key, observed: value });
      }
    }

    const expectedHash = sha256Text(JSON.stringify({ ...index, content_sha256: null }));
    if (index.content_sha256 !== expectedHash) {
      errors.push({
        code: "ARTIFACT_INDEX_HASH_MISMATCH",
        expected: expectedHash,
        observed: index.content_sha256
      });
    }
  }

  const record = {
    record_type: "HBCEInternalPilotBaselineManifestVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-BASELINE-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    root,
    manifest_path: manifestPath,
    manifest_sha256: fileExists(manifestPath) ? contentSha256(manifestPath) : null,
    index_path: indexPath,
    index_sha256: fileExists(indexPath) ? contentSha256(indexPath) : null,
    claim_boundary: {
      product_readiness: false,
      compliance_evidence: false,
      certification: false,
      external_validation: false,
      commercial_release_authorization: false,
      legal_effect: false,
      level4: false
    },
    record_sha256: null
  };

  record.record_sha256 = sha256Text(JSON.stringify({ ...record, record_sha256: null }));
  return record;
}

module.exports = {
  PILOT_ID,
  BASELINE_MANIFEST_VERSION,
  REQUIRED_DIRECTORIES,
  sha256Text,
  readJson,
  fileExists,
  directoryExists,
  contentSha256,
  createBaselineManifest,
  createArtifactIndex,
  verifyBaselineManifest
};
