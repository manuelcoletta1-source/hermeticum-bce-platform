"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");
const baseline = require("./hbce-internal-pilot-baseline-manifest.js");

const PILOT_ID = "HBCE-PILOT-INTERNAL-2027-0001";
const BUNDLE_VERSION = "HBCE-INTERNAL-PILOT-DISPATCH-BLOCK-CHAIN-EVIDENCE-BUNDLE-V0.1";

const INPUT_PATHS = {
  execution_trace_contract: "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_ExecutionTraceContract_v001.json",
  execution_trace_preflight: "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_ExecutionTracePreflight_v001.json",
  dispatch_preparation: "pilot/HBCE-PILOT-INTERNAL-2027-0001/05_runtime_traces/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchPreparation_v001.json",
  dispatch_authority_gate: "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchAuthorityGate_v001.json",
  dispatch_authority_block_receipt: "pilot/HBCE-PILOT-INTERNAL-2027-0001/04_gates/20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchAuthorityBlockReceipt_v001.json"
};

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function safeRead(filePath) {
  return fileExists(filePath) ? readJson(filePath) : null;
}

function artifactSha256(filePath) {
  return fileExists(filePath) ? baseline.contentSha256(filePath) : null;
}

function isString64(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function inputSummary(role, program, filePath, checkFn) {
  const record = safeRead(filePath);
  const sha256 = artifactSha256(filePath);
  const check = record ? checkFn(record) : { verified: false, observed_state: "MISSING", reason: "INPUT_MISSING" };

  return {
    role,
    program,
    path: filePath,
    sha256,
    exists: record !== null,
    verified: check.verified === true,
    observed_state: check.observed_state,
    no_execution_boundary_preserved: check.no_execution_boundary_preserved === true,
    reason: check.reason || null
  };
}

function createDispatchBlockChainEvidenceBundle({
  generated_at = "2026-09-30T22:45:00+02:00"
} = {}) {
  const contract = inputSummary(
    "execution_trace_contract",
    "PROG-208",
    INPUT_PATHS.execution_trace_contract,
    (record) => ({
      verified: record.pilot_id === PILOT_ID && record.artifact_type === "ExecutionTraceContract",
      observed_state: record.artifact_type || "UNKNOWN",
      no_execution_boundary_preserved: true
    })
  );

  const preflight = inputSummary(
    "execution_trace_preflight",
    "PROG-209",
    INPUT_PATHS.execution_trace_preflight,
    (record) => ({
      verified:
        record.pilot_id === PILOT_ID &&
        record.artifact_type === "ExecutionTracePreflight" &&
        record.preflight_state === "TRACE_PREFLIGHT_DEFINED" &&
        record.trace_state === "NOT_DISPATCHED" &&
        record.dispatch_performed === false &&
        record.execution_trace_bound === false &&
        record.effect_evidence_created === false,
      observed_state: `${record.preflight_state || "UNKNOWN"}:${record.trace_state || "UNKNOWN"}`,
      no_execution_boundary_preserved:
        record.dispatch_performed === false &&
        record.execution_trace_bound === false &&
        record.effect_evidence_created === false
    })
  );

  const preparation = inputSummary(
    "dispatch_preparation",
    "PROG-210",
    INPUT_PATHS.dispatch_preparation,
    (record) => ({
      verified:
        record.pilot_id === PILOT_ID &&
        record.artifact_type === "DispatchPreparation" &&
        record.dispatch_preparation_state === "DISPATCH_PREPARED_STRUCTURALLY" &&
        record.trace_state === "DISPATCH_PREPARED" &&
        record.dispatch_prepared === true &&
        record.dispatch_performed === false &&
        record.external_connector_called !== true &&
        record.target_receipt_created === false &&
        record.execution_trace_bound === false &&
        record.effect_evidence_created === false,
      observed_state: `${record.dispatch_preparation_state || "UNKNOWN"}:${record.trace_state || "UNKNOWN"}`,
      no_execution_boundary_preserved:
        record.dispatch_performed === false &&
        record.target_receipt_created === false &&
        record.execution_trace_bound === false &&
        record.effect_evidence_created === false
    })
  );

  const gate = inputSummary(
    "dispatch_authority_gate",
    "PROG-211",
    INPUT_PATHS.dispatch_authority_gate,
    (record) => ({
      verified:
        record.pilot_id === PILOT_ID &&
        record.artifact_type === "DispatchAuthorityGate" &&
        record.dispatch_authority_gate_state === "BLOCKED_FAIL_CLOSED" &&
        record.dispatch_execution_authorized === false &&
        record.dispatch_command_may_be_emitted === false &&
        record.external_connector_call_allowed === false &&
        record.target_system_contact_allowed === false &&
        record.operational_allowed === false,
      observed_state: record.dispatch_authority_gate_state || "UNKNOWN",
      no_execution_boundary_preserved:
        record.dispatch_execution_authorized === false &&
        record.dispatch_command_may_be_emitted === false &&
        record.external_connector_call_allowed === false &&
        record.target_system_contact_allowed === false
    })
  );

  const blockReceipt = inputSummary(
    "dispatch_authority_block_receipt",
    "PROG-212",
    INPUT_PATHS.dispatch_authority_block_receipt,
    (record) => ({
      verified:
        record.pilot_id === PILOT_ID &&
        record.artifact_type === "DispatchAuthorityBlockReceipt" &&
        record.receipt_state === "AUTHORITY_BLOCK_RECEIPT_RECORDED" &&
        record.bound_gate_state === "BLOCKED_FAIL_CLOSED" &&
        record.dispatch_execution_authorized === false &&
        record.dispatch_command_emitted === false &&
        record.external_connector_called === false &&
        record.target_system_contacted === false &&
        record.target_receipt_created === false &&
        record.execution_trace_bound === false &&
        record.effect_evidence_created === false,
      observed_state: `${record.receipt_state || "UNKNOWN"}:${record.bound_gate_state || "UNKNOWN"}`,
      no_execution_boundary_preserved:
        record.dispatch_execution_authorized === false &&
        record.dispatch_command_emitted === false &&
        record.external_connector_called === false &&
        record.target_system_contacted === false &&
        record.target_receipt_created === false &&
        record.execution_trace_bound === false &&
        record.effect_evidence_created === false
    })
  );

  const inputs = [contract, preflight, preparation, gate, blockReceipt];
  const allInputsVerified = inputs.every((input) => input.verified === true);
  const allHashesBound = inputs.every((input) => isString64(input.sha256));
  const noExecutionBoundaryPreserved = inputs.every((input) => input.no_execution_boundary_preserved === true);

  const bundle = {
    artifact_id: "20260930_HBCE-PILOT-INTERNAL-2027-0001_DispatchBlockChainEvidenceBundle_v001",
    artifact_type: "DispatchBlockChainEvidenceBundle",
    schema_version: BUNDLE_VERSION,
    pilot_id: PILOT_ID,
    subject_ref: "HERMETICUM_INTERNAL_RELEASE_EVIDENCE_WORKFLOW",
    producer_ref: "PROG-213",
    source_refs: [
      "PROG-208",
      "PROG-209",
      "PROG-210",
      "PROG-211",
      "PROG-212"
    ],
    generated_at,
    bundle_state: allInputsVerified && allHashesBound && noExecutionBoundaryPreserved
      ? "DISPATCH_BLOCK_CHAIN_BUNDLED"
      : "DISPATCH_BLOCK_CHAIN_BUNDLE_INCOMPLETE",
    chain_closure_state: "CLOSED_AT_AUTHORITY_BLOCK_NO_EXECUTION",
    execution_state: "NOT_EXECUTED",
    evidence_scope: "INTERNAL_STRUCTURAL_EVIDENCE_ONLY",
    inputs,
    chain_assertions: {
      execution_trace_contract_defined: contract.verified,
      execution_trace_preflight_defined_not_dispatched: preflight.verified,
      dispatch_prepared_structurally: preparation.verified,
      dispatch_authority_blocked_fail_closed: gate.verified,
      authority_block_receipt_recorded: blockReceipt.verified,
      all_inputs_digest_bound: allHashesBound,
      all_inputs_structurally_verified: allInputsVerified,
      no_execution_boundary_preserved: noExecutionBoundaryPreserved
    },
    no_execution_flags: {
      dispatch_execution_authorized: false,
      dispatch_command_emitted: false,
      dispatch_performed: false,
      external_connector_called: false,
      target_system_contacted: false,
      target_receipt_created: false,
      execution_trace_bound: false,
      effect_evidence_created: false,
      operational_allowed: false,
      customer_external_execution_allowed: false
    },
    maximum_supported_claim: "INTERNAL_DISPATCH_BLOCK_CHAIN_STRUCTURALLY_BUNDLED_NO_EXECUTION",
    prohibited_claims: [
      "dispatch_authorized",
      "dispatch_performed",
      "external_connector_called",
      "target_system_contacted",
      "target_receipt_created",
      "execution_observed",
      "effect_observed",
      "customer_execution_allowed",
      "externally_validated",
      "legal_reviewed",
      "certified",
      "commercially_authorized",
      "level4_eligible"
    ],
    claim_boundary: {
      internal_bundle_created: true,
      structural_evidence_only: true,
      no_execution_chain_closed: true,
      dispatch_authorization_not_granted: true,
      dispatch_command_not_emitted: true,
      dispatch_not_performed: true,
      external_connector_not_called: true,
      target_system_not_contacted: true,
      target_receipt_not_created: true,
      execution_trace_not_created: true,
      effect_evidence_not_created: true,
      customer_execution_not_enabled: true,
      external_validation_not_inferred: true,
      legal_review_not_inferred: true,
      certification_not_inferred: true,
      commercial_authorization_not_inferred: true,
      level4_not_inferred: true
    },
    status: "INTERNAL_DISPATCH_BLOCK_CHAIN_BUNDLED_NO_EXECUTION",
    content_sha256: null
  };

  bundle.content_sha256 = sha256Record({ ...bundle, content_sha256: null });
  return bundle;
}

function verifyDispatchBlockChainEvidenceBundle(bundlePath) {
  const errors = [];

  if (!fileExists(bundlePath)) {
    const missing = {
      record_type: "DispatchBlockChainEvidenceBundleVerificationRecord",
      bundle_path: bundlePath,
      verified: false,
      error_count: 1,
      errors: [{ code: "DISPATCH_BLOCK_CHAIN_EVIDENCE_BUNDLE_MISSING", path: bundlePath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const bundle = readJson(bundlePath);

  if (bundle.pilot_id !== PILOT_ID) {
    errors.push({ code: "PILOT_ID_MISMATCH", observed: bundle.pilot_id });
  }

  if (bundle.schema_version !== BUNDLE_VERSION) {
    errors.push({ code: "BUNDLE_VERSION_MISMATCH", observed: bundle.schema_version });
  }

  if (bundle.bundle_state !== "DISPATCH_BLOCK_CHAIN_BUNDLED") {
    errors.push({ code: "BUNDLE_STATE_NOT_COMPLETE", observed: bundle.bundle_state });
  }

  if (bundle.chain_closure_state !== "CLOSED_AT_AUTHORITY_BLOCK_NO_EXECUTION") {
    errors.push({ code: "CHAIN_CLOSURE_STATE_INVALID", observed: bundle.chain_closure_state });
  }

  if (bundle.execution_state !== "NOT_EXECUTED") {
    errors.push({ code: "EXECUTION_STATE_OVERCLAIM", observed: bundle.execution_state });
  }

  const requiredRoles = Object.keys(INPUT_PATHS);
  const inputs = Array.isArray(bundle.inputs) ? bundle.inputs : [];

  for (const role of requiredRoles) {
    const input = inputs.find((candidate) => candidate.role === role);
    if (!input) {
      errors.push({ code: "REQUIRED_INPUT_MISSING", role });
      continue;
    }

    if (input.exists !== true) {
      errors.push({ code: "INPUT_NOT_EXISTING", role });
    }

    if (input.verified !== true) {
      errors.push({ code: "INPUT_NOT_VERIFIED", role, observed_state: input.observed_state });
    }

    if (!isString64(input.sha256)) {
      errors.push({ code: "INPUT_SHA256_INVALID", role, observed: input.sha256 });
    }

    if (input.no_execution_boundary_preserved !== true) {
      errors.push({ code: "INPUT_EXECUTION_BOUNDARY_BROKEN", role });
    }
  }

  if (!bundle.chain_assertions || bundle.chain_assertions.all_inputs_digest_bound !== true) {
    errors.push({ code: "CHAIN_DIGEST_BINDING_MISSING" });
  }

  if (!bundle.chain_assertions || bundle.chain_assertions.all_inputs_structurally_verified !== true) {
    errors.push({ code: "CHAIN_STRUCTURAL_VERIFICATION_MISSING" });
  }

  if (!bundle.chain_assertions || bundle.chain_assertions.no_execution_boundary_preserved !== true) {
    errors.push({ code: "CHAIN_NO_EXECUTION_BOUNDARY_MISSING" });
  }

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
    if (!bundle.no_execution_flags || bundle.no_execution_flags[key] !== false) {
      errors.push({
        code: "DISPATCH_BLOCK_CHAIN_OVERCLAIM",
        key,
        observed: bundle.no_execution_flags ? bundle.no_execution_flags[key] : undefined
      });
    }
  }

  for (const boundary of [
    "internal_bundle_created",
    "structural_evidence_only",
    "no_execution_chain_closed",
    "dispatch_authorization_not_granted",
    "dispatch_command_not_emitted",
    "dispatch_not_performed",
    "external_connector_not_called",
    "target_system_not_contacted",
    "target_receipt_not_created",
    "execution_trace_not_created",
    "effect_evidence_not_created",
    "customer_execution_not_enabled",
    "external_validation_not_inferred",
    "legal_review_not_inferred",
    "certification_not_inferred",
    "commercial_authorization_not_inferred",
    "level4_not_inferred"
  ]) {
    if (!bundle.claim_boundary || bundle.claim_boundary[boundary] !== true) {
      errors.push({ code: "CLAIM_BOUNDARY_MISSING", boundary });
    }
  }

  const expectedHash = sha256Record({ ...bundle, content_sha256: null });
  if (bundle.content_sha256 !== expectedHash) {
    errors.push({
      code: "DISPATCH_BLOCK_CHAIN_BUNDLE_HASH_MISMATCH",
      expected: expectedHash,
      observed: bundle.content_sha256
    });
  }

  const verification = {
    record_type: "DispatchBlockChainEvidenceBundleVerificationRecord",
    verifier_version: "HBCE-INTERNAL-PILOT-DISPATCH-BLOCK-CHAIN-EVIDENCE-BUNDLE-VERIFIER-V0.1",
    pilot_id: PILOT_ID,
    bundle_path: bundlePath,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    bundle_state: bundle.bundle_state,
    chain_closure_state: bundle.chain_closure_state,
    execution_state: bundle.execution_state,
    evidence_scope: bundle.evidence_scope,
    input_count: inputs.length,
    no_execution_flags: bundle.no_execution_flags,
    bundle_sha256: baseline.contentSha256(bundlePath),
    claim_boundary: {
      structural_evidence_only: true,
      no_execution_chain_closed: true,
      dispatch_authorization_not_granted: true,
      dispatch_command_not_emitted: true,
      dispatch_not_performed: true,
      external_connector_not_called: true,
      target_system_not_contacted: true,
      target_receipt_not_created: true,
      execution_trace_not_created: true,
      effect_evidence_not_created: true,
      external_validation_not_inferred: true,
      legal_review_not_inferred: true,
      level4_not_inferred: true
    },
    record_sha256: null
  };

  verification.record_sha256 = sha256Record({ ...verification, record_sha256: null });
  return verification;
}

module.exports = {
  PILOT_ID,
  BUNDLE_VERSION,
  INPUT_PATHS,
  sha256Record,
  readJson,
  fileExists,
  createDispatchBlockChainEvidenceBundle,
  verifyDispatchBlockChainEvidenceBundle
};
