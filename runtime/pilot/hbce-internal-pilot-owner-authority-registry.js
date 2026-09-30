"use strict";

const fs = require("fs");
const path = require("path");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const REGISTRY_VERSION = "HBCE-INTERNAL-PILOT-OWNER-AUTHORITY-REGISTRY-V0.1";

const REQUIRED_OWNER_ROLES = [
  "Program Owner",
  "Engineering Owner",
  "Evidence Owner",
  "Security Owner",
  "Operations Owner",
  "Legal Readiness Owner",
  "Privacy Owner",
  "Commercial/Pilot Owner",
  "Human GO Authority",
  "Corporate Signatory",
  "External Validator Sourcing Owner"
];

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createOwnerRecord(role, overrides = {}) {
  const assigned = overrides.assigned === true;

  const record = {
    record_type: "OwnerRecord",
    schema_version: REGISTRY_VERSION,
    pilot_id: PILOT_ID,
    role,
    owner_ref: assigned ? overrides.owner_ref : null,
    owner_status: assigned ? "ASSIGNED" : "UNASSIGNED",
    authority_namespace: overrides.authority_namespace || authorityNamespaceForRole(role),
    authority_verified: assigned ? overrides.authority_verified === true : false,
    can_create_technical_pass: false,
    can_create_legal_review: role === "Legal Readiness Owner" ? false : false,
    can_bind_company: role === "Corporate Signatory" && assigned && overrides.corporate_signing_power_verified === true,
    can_create_external_validation: false,
    can_self_award_c16: false,
    can_self_award_level4: false,
    required_for_m1: true,
    gate_effect: assigned && (role !== "Corporate Signatory" || overrides.corporate_signing_power_verified === true)
      ? "AVAILABLE_FOR_REVIEW"
      : "BLOCKED_UNTIL_OWNER_RECORD_ASSIGNED_AND_VERIFIED",
    source_refs: [
      "HBCE-PILOT-PROG-2027-0001/4.1",
      "PROG-204"
    ],
    created_at: overrides.created_at || "2026-09-30T20:45:00+02:00",
    record_sha256: null
  };

  record.record_sha256 = sha256Record({ ...record, record_sha256: null });
  return record;
}

function authorityNamespaceForRole(role) {
  if (role === "Human GO Authority") return "DECISION";
  if (role === "Corporate Signatory") return "CORPORATE_SIGNATORY";
  if (role === "Legal Readiness Owner") return "LEGAL";
  if (role === "External Validator Sourcing Owner") return "EXTERNAL_VALIDATOR_SOURCING";
  if (role === "Security Owner") return "SECURITY";
  if (role === "Privacy Owner") return "PRIVACY";
  if (role === "Commercial/Pilot Owner") return "COMMERCIAL_PILOT";
  return "INTERNAL_PROGRAM";
}

function createOwnerAuthorityRegistry({
  created_at = "2026-09-30T20:45:00+02:00",
  assignments = {}
} = {}) {
  const owner_records = REQUIRED_OWNER_ROLES.map((role) => createOwnerRecord(role, {
    created_at,
    ...(assignments[role] || {})
  }));

  const missing_roles = owner_records
    .filter((record) => record.owner_status !== "ASSIGNED" || record.authority_verified !== true)
    .map((record) => record.role);

  const corporate = owner_records.find((record) => record.role === "Corporate Signatory");

  const registry = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_OwnerAuthorityRegistry_v001",
    artifact_type: "OwnerAuthorityRegistry",
    schema_version: REGISTRY_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "JOKER-C2_ASSISTED_PROGRAMMING_HANDOFF",
    source_refs: [
      "HBCE-PILOT-PROG-2027-0001/4.1",
      "HBCE-PILOT-PROG-2027-0001/32.3",
      "PROG-204"
    ],
    created_at,
    owner_records,
    required_owner_count: REQUIRED_OWNER_ROLES.length,
    assigned_verified_owner_count: owner_records.length - missing_roles.length,
    missing_or_unverified_roles: missing_roles,
    m1_owner_gate: missing_roles.length === 0 ? "PASS" : "BLOCKED",
    corporate_signatory_verified: corporate ? corporate.can_bind_company === true : false,
    corporate_binding_authority_status: corporate && corporate.can_bind_company === true ? "VERIFIED" : "UNVERIFIED",
    customer_external_execution: false,
    external_validation_claimed: false,
    legal_validity_claimed: false,
    certification_claimed: false,
    commercial_release_authorization_claimed: false,
    level4_claimed: false,
    claim_boundary: {
      owner_records_exist: true,
      missing_owner_roles_are_explicit: true,
      unassigned_roles_do_not_imply_authority: true,
      corporate_signing_power_not_inferred: true,
      legal_review_not_inferred: true,
      external_validation_not_inferred: true,
      level4_not_inferred: true
    },
    status: missing_roles.length === 0 ? "OWNER_REGISTRY_COMPLETE_PENDING_REVIEW" : "OWNER_REGISTRY_CREATED_WITH_BLOCKED_M1_GATE",
    content_sha256: null
  };

  registry.content_sha256 = sha256Record({ ...registry, content_sha256: null });
  return registry;
}

function verifyOwnerAuthorityRegistry(registryPath) {
  const errors = [];

  if (!fileExists(registryPath)) {
    const record = {
      record_type: "OwnerAuthorityRegistryVerificationRecord",
      registry_path: registryPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "OWNER_REGISTRY_MISSING", path: registryPath }],
      record_sha256: null
    };
    record.record_sha256 = sha256Record({ ...record, record_sha256: null });
    return record;
  }

  const registry = readJson(registryPath);

  if (registry.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: registry.pilot_id });
  }

  if (registry.schema_version !== REGISTRY_VERSION) {
    errors.push({ code: "REGISTRY_VERSION_MISMATCH", observed: registry.schema_version });
  }

  const roles = Array.isArray(registry.owner_records) ? registry.owner_records.map((record) => record.role) : [];
  for (const role of REQUIRED_OWNER_ROLES) {
    if (!roles.includes(role)) {
      errors.push({ code: "REQUIRED_OWNER_ROLE_MISSING", role });
    }
  }

  for (const record of registry.owner_records || []) {
    const expectedHash = sha256Record({ ...record, record_sha256: null });
    if (record.record_sha256 !== expectedHash) {
      errors.push({ code: "OWNER_RECORD_HASH_MISMATCH", role: record.role });
    }

    if (record.owner_status === "UNASSIGNED") {
      if (record.owner_ref !== null) {
        errors.push({ code: "UNASSIGNED_ROLE_HAS_OWNER_REF", role: record.role });
      }
      if (record.authority_verified !== false) {
        errors.push({ code: "UNASSIGNED_ROLE_AUTHORITY_VERIFIED", role: record.role });
      }
      if (record.gate_effect !== "BLOCKED_UNTIL_OWNER_RECORD_ASSIGNED_AND_VERIFIED") {
        errors.push({ code: "UNASSIGNED_ROLE_NOT_BLOCKED", role: record.role });
      }
    }

    if (record.role === "Corporate Signatory" && record.can_bind_company === true && record.authority_verified !== true) {
      errors.push({ code: "CORPORATE_SIGNATORY_BINDING_WITHOUT_VERIFIED_AUTHORITY" });
    }

    if (record.can_self_award_c16 !== false || record.can_self_award_level4 !== false) {
      errors.push({ code: "OWNER_SELF_AWARD_BOUNDARY_VIOLATION", role: record.role });
    }
  }

  if (registry.corporate_signatory_verified !== true && registry.corporate_binding_authority_status !== "UNVERIFIED") {
    errors.push({ code: "CORPORATE_AUTHORITY_STATUS_MISMATCH" });
  }

  for (const key of [
    "customer_external_execution",
    "external_validation_claimed",
    "legal_validity_claimed",
    "certification_claimed",
    "commercial_release_authorization_claimed",
    "level4_claimed"
  ]) {
    if (registry[key] !== false) {
      errors.push({ code: "REGISTRY_OVERCLAIM", key, observed: registry[key] });
    }
  }

  const expectedRegistryHash = sha256Record({ ...registry, content_sha256: null });
  if (registry.content_sha256 !== expectedRegistryHash) {
    errors.push({
      code: "OWNER_REGISTRY_HASH_MISMATCH",
      expected: expectedRegistryHash,
      observed: registry.content_sha256
    });
  }

  const verification = {
    record_type: "OwnerAuthorityRegistryVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-OWNER-AUTHORITY-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    registry_path: registryPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    required_owner_count: REQUIRED_OWNER_ROLES.length,
    registry_m1_owner_gate: registry.m1_owner_gate,
    corporate_binding_authority_status: registry.corporate_binding_authority_status,
    registry_sha256: baseline.contentSha256(registryPath),
    claim_boundary: {
      legal_review_not_inferred: true,
      corporate_signing_power_not_inferred: true,
      external_validation_not_inferred: true,
      level4_not_inferred: true
    },
    record_sha256: null
  };

  verification.record_sha256 = sha256Record({ ...verification, record_sha256: null });
  return verification;
}

module.exports = {
  PILOT_ID,
  REGISTRY_VERSION,
  REQUIRED_OWNER_ROLES,
  sha256Record,
  readJson,
  fileExists,
  createOwnerRecord,
  createOwnerAuthorityRegistry,
  verifyOwnerAuthorityRegistry,
  authorityNamespaceForRole
};
