"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");
const owners = require("./hbce-internal-pilot-owner-authority-registry.js");
const policies = require("./hbce-internal-pilot-policy-registry.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const BINDING_VERSION = "HBCE-INTERNAL-PILOT-POLICY-RUNTIME-BINDING-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function safeVerification(fn, input) {
  try {
    return fn(input);
  } catch (error) {
    return {
      verified: false,
      error_count: 1,
      errors: [{ code: "VERIFIER_EXCEPTION", message: String(error && error.message ? error.message : error) }]
    };
  }
}

function createPolicyRuntimeBinding({
  baselineManifestPath,
  ownerRegistryPath,
  policyRegistryPath,
  created_at = "2026-09-30T21:15:00+02:00"
}) {
  const baselineRoot = "pilot/HBCE-PILOT-INTERNAL-2027-0001";
  const artifactIndexPath = "pilot/HBCE-PILOT-INTERNAL-2027-0001/artifact-index.json";

  const baselineVerification = safeVerification(
    (args) => baseline.verifyBaselineManifest(args),
    {
      root: baselineRoot,
      manifestPath: baselineManifestPath,
      indexPath: artifactIndexPath
    }
  );

  const ownerVerification = safeVerification(
    (registryPath) => owners.verifyOwnerAuthorityRegistry(registryPath),
    ownerRegistryPath
  );

  const policyVerification = safeVerification(
    (registryPath) => policies.verifyPolicyRegistry(registryPath),
    policyRegistryPath
  );

  const baselineManifest = fileExists(baselineManifestPath) ? readJson(baselineManifestPath) : null;
  const ownerRegistry = fileExists(ownerRegistryPath) ? readJson(ownerRegistryPath) : null;
  const policyRegistry = fileExists(policyRegistryPath) ? readJson(policyRegistryPath) : null;

  const m1OwnerGate = ownerRegistry ? ownerRegistry.m1_owner_gate : "MISSING";
  const policyGate = policyRegistry ? policyRegistry.policy_gate : "MISSING";
  const baselineInitialClass = baselineManifest ? baselineManifest.initial_class : "MISSING";

  const bindingReady =
    baselineVerification.verified === true &&
    ownerVerification.verified === true &&
    policyVerification.verified === true &&
    baselineInitialClass === "LC-C/A1_INTERNAL_CONTROLLED" &&
    policyGate === "DEFINED_PENDING_RUNTIME_BINDING";

  const ownerBlocked = m1OwnerGate !== "PASS";
  const executionClaimAllowed = false;
  const customerExternalExecutionAllowed = false;

  const record = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_PolicyRuntimeBinding_v001",
    artifact_type: "PolicyRuntimeBinding",
    schema_version: BINDING_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-207",
    source_refs: [
      "PROG-204",
      "PROG-205",
      "PROG-206"
    ],
    created_at,
    input_artifacts: {
      baseline_manifest_path: baselineManifestPath,
      baseline_manifest_sha256: fileExists(baselineManifestPath) ? baseline.contentSha256(baselineManifestPath) : null,
      owner_registry_path: ownerRegistryPath,
      owner_registry_sha256: fileExists(ownerRegistryPath) ? baseline.contentSha256(ownerRegistryPath) : null,
      policy_registry_path: policyRegistryPath,
      policy_registry_sha256: fileExists(policyRegistryPath) ? baseline.contentSha256(policyRegistryPath) : null
    },
    verifier_results: {
      baseline_verified: baselineVerification.verified === true,
      owner_registry_verified: ownerVerification.verified === true,
      policy_registry_verified: policyVerification.verified === true
    },
    observed_gates: {
      initial_class: baselineInitialClass,
      m1_owner_gate: m1OwnerGate,
      policy_gate: policyGate,
      owner_blocked: ownerBlocked
    },
    runtime_binding_state: bindingReady ? "BOUND_STRUCTURALLY_VALIDATED" : "BINDING_BLOCKED",
    operational_allowed: false,
    execution_claim_allowed: executionClaimAllowed,
    customer_external_execution_allowed: customerExternalExecutionAllowed,
    c16_external_validation_performed: false,
    legal_review_claimed: false,
    certification_claimed: false,
    external_validation_claimed: false,
    commercial_release_authorization_claimed: false,
    level4_claimed: false,
    fail_closed_reasons: [
      ...(baselineVerification.verified === true ? [] : ["BASELINE_NOT_VERIFIED"]),
      ...(ownerVerification.verified === true ? [] : ["OWNER_REGISTRY_NOT_VERIFIED"]),
      ...(policyVerification.verified === true ? [] : ["POLICY_REGISTRY_NOT_VERIFIED"]),
      ...(ownerBlocked ? ["M1_OWNER_GATE_BLOCKED"] : []),
      "EXECUTION_TRACE_NOT_BOUND",
      "CUSTOMER_EXECUTION_GATE_NOT_OPEN",
      "C16_NOT_PERFORMED",
      "LEGAL_REVIEW_NOT_CLAIMED",
      "HUMAN_GO_NOT_BOUND"
    ],
    claim_boundary: {
      runtime_policy_binding_created: bindingReady,
      structural_validation_only: true,
      execution_evidence_not_created: true,
      owner_gate_not_overridden: true,
      customer_execution_not_enabled: true,
      legal_review_not_inferred: true,
      external_validation_not_inferred: true,
      level4_not_inferred: true
    },
    status: bindingReady ? "POLICY_RUNTIME_BINDING_CREATED_WITH_FAIL_CLOSED_OPERATIONAL_GATE" : "POLICY_RUNTIME_BINDING_BLOCKED",
    content_sha256: null
  };

  record.content_sha256 = sha256Record({ ...record, content_sha256: null });
  return record;
}

function verifyPolicyRuntimeBinding(bindingPath) {
  const errors = [];

  if (!fileExists(bindingPath)) {
    const missing = {
      record_type: "PolicyRuntimeBindingVerificationRecord",
      binding_path: bindingPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "POLICY_RUNTIME_BINDING_MISSING", path: bindingPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const binding = readJson(bindingPath);

  if (binding.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: binding.pilot_id });
  }

  if (binding.schema_version !== BINDING_VERSION) {
    errors.push({ code: "BINDING_VERSION_MISMATCH", observed: binding.schema_version });
  }

  if (binding.runtime_binding_state !== "BOUND_STRUCTURALLY_VALIDATED") {
    errors.push({ code: "BINDING_NOT_STRUCTURALLY_VALIDATED", observed: binding.runtime_binding_state });
  }

  if (binding.operational_allowed !== false) {
    errors.push({ code: "OPERATIONAL_ALLOWED_OVERCLAIM", observed: binding.operational_allowed });
  }

  for (const key of [
    "execution_claim_allowed",
    "customer_external_execution_allowed",
    "c16_external_validation_performed",
    "legal_review_claimed",
    "certification_claimed",
    "external_validation_claimed",
    "commercial_release_authorization_claimed",
    "level4_claimed"
  ]) {
    if (binding[key] !== false) {
      errors.push({ code: "BINDING_OVERCLAIM", key, observed: binding[key] });
    }
  }

  if (!binding.fail_closed_reasons || !binding.fail_closed_reasons.includes("M1_OWNER_GATE_BLOCKED")) {
    errors.push({ code: "OWNER_GATE_BLOCK_REASON_MISSING" });
  }

  if (!binding.fail_closed_reasons || !binding.fail_closed_reasons.includes("EXECUTION_TRACE_NOT_BOUND")) {
    errors.push({ code: "EXECUTION_TRACE_BLOCK_REASON_MISSING" });
  }

  if (!binding.claim_boundary || binding.claim_boundary.execution_evidence_not_created !== true) {
    errors.push({ code: "EXECUTION_EVIDENCE_BOUNDARY_MISSING" });
  }

  if (!binding.claim_boundary || binding.claim_boundary.owner_gate_not_overridden !== true) {
    errors.push({ code: "OWNER_GATE_BOUNDARY_MISSING" });
  }

  const expectedHash = sha256Record({ ...binding, content_sha256: null });
  if (binding.content_sha256 !== expectedHash) {
    errors.push({
      code: "POLICY_RUNTIME_BINDING_HASH_MISMATCH",
      expected: expectedHash,
      observed: binding.content_sha256
    });
  }

  const verification = {
    record_type: "PolicyRuntimeBindingVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-POLICY-RUNTIME-BINDING-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    binding_path: bindingPath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    runtime_binding_state: binding.runtime_binding_state,
    operational_allowed: binding.operational_allowed,
    m1_owner_gate: binding.observed_gates ? binding.observed_gates.m1_owner_gate : null,
    policy_gate: binding.observed_gates ? binding.observed_gates.policy_gate : null,
    binding_sha256: baseline.contentSha256(bindingPath),
    claim_boundary: {
      structural_validation_only: true,
      execution_evidence_not_created: true,
      customer_execution_not_enabled: true,
      legal_review_not_inferred: true,
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
  BINDING_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createPolicyRuntimeBinding,
  verifyPolicyRuntimeBinding
};
