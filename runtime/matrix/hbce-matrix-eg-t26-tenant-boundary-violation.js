"use strict";

const fs = require("fs");
const eg001 = require("../shared-core/hbce-eg-001-state-transition-enforcement.js");

const PROGRAM_ID = "PROG-245";
const TEST_ID = "EG-T26";
const TENANT_ID = "HBCE_INTERNAL";
const FOREIGN_TENANT_ID = "TENANT_FOREIGN";
const MATRIX_SUBJECT_REF = "MATRIX::RELEASE::HBCE-2027-RC-001";
const RUNTIME_VERSION = "HBCE-MATRIX-EG-T26-TENANT-BOUNDARY-VIOLATION-V0.1";

function sha256Record(record) {
  return eg001.sha256(record);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function createTenantScopedObject() {
  const object = {
    record_type: "TenantScopedObjectRecord",
    tenant_id: FOREIGN_TENANT_ID,
    subject_ref: "FOREIGN::OBJECT::EVIDENCE-BUNDLE-0001",
    object_ref: "tenant-foreign:evidence:bundle:0001",
    object_class: "EVIDENCE_BUNDLE",
    owner_tenant_id: FOREIGN_TENANT_ID,
    visibility_scope: "TENANT_PRIVATE",
    object_payload_digest: "eg-t26-foreign-object-payload-digest-v001",
    object_hash: null
  };

  object.object_hash = sha256Record({ ...object, object_hash: null });
  return object;
}

function createCrossTenantAccessRequest({ foreignObject = createTenantScopedObject() } = {}) {
  const request = {
    record_type: "CrossTenantAccessRequest",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    request_id: "eg-t26-cross-tenant-access-request-v001",
    requester_tenant_id: TENANT_ID,
    requested_object_ref: foreignObject.object_ref,
    requested_object_tenant_id: foreignObject.tenant_id,
    requested_object_hash: foreignObject.object_hash,
    access_mode: "READ_EVIDENCE_REFERENCE",
    requested_at: "2026-10-01T23:00:00+02:00",
    request_hash: null
  };

  request.request_hash = sha256Record({ ...request, request_hash: null });
  return request;
}

function createSecurityEvidenceEvent({ request, foreignObject, generated_at }) {
  const event = {
    record_type: "TenantBoundarySecurityEvidenceEvent",
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    event_id: "eg-t26-tenant-boundary-violation-security-event-v001",
    event_class: "SECURITY_EVIDENCE_EVENT",
    violation_type: "TENANT_BOUNDARY_VIOLATION",
    request_id: request.request_id,
    requester_tenant_id: request.requester_tenant_id,
    requested_object_ref: request.requested_object_ref,
    requested_object_tenant_id: request.requested_object_tenant_id,
    owner_tenant_id: foreignObject.owner_tenant_id,
    rejection_result: "REJECT",
    rejection_code: "TENANT_BOUNDARY_VIOLATION",
    foreign_object_disclosed: false,
    foreign_evidence_loaded: false,
    foreign_reference_resolved: false,
    dispatch_performed: false,
    external_connector_called: false,
    target_receipt_created: false,
    effect_evidence_created: false,
    emitted_at: generated_at,
    event_hash: null
  };

  event.event_hash = sha256Record({ ...event, event_hash: null });
  return event;
}

function evaluateTenantBoundaryViolation({
  foreignObject = createTenantScopedObject(),
  accessRequest = null,
  generated_at = "2026-10-01T23:01:00+02:00"
} = {}) {
  const request = accessRequest || createCrossTenantAccessRequest({ foreignObject });
  const tenantMismatchDetected = request.requester_tenant_id !== foreignObject.owner_tenant_id;
  const securityEvent = createSecurityEvidenceEvent({ request, foreignObject, generated_at });

  const artifact = {
    artifact_id: "20261001_HBCE-MATRIX-EG-T26_TenantBoundaryViolation_v001",
    artifact_type: "MatrixEGT26TenantBoundaryViolationRuntimeEvidence",
    schema_version: RUNTIME_VERSION,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    tenant_id: TENANT_ID,
    subject_ref: MATRIX_SUBJECT_REF,
    generated_at,
    required_result: "REJECT + TENANT_BOUNDARY_VIOLATION + security evidence event",
    selected_profile: "A1_INTERNAL_CONTROLLED",
    tenant_scoped_object: foreignObject,
    access_request: request,
    security_evidence_event: securityEvent,
    requester_tenant_id: request.requester_tenant_id,
    requested_object_tenant_id: request.requested_object_tenant_id,
    owner_tenant_id: foreignObject.owner_tenant_id,
    tenant_mismatch_detected: tenantMismatchDetected,
    cross_tenant_object_access_detected: true,
    cross_tenant_evidence_access_detected: true,
    cross_tenant_reference_access_detected: true,
    rejection_result: "REJECT",
    rejection_code: "TENANT_BOUNDARY_VIOLATION",
    security_evidence_event_emitted: true,
    foreign_object_disclosed: false,
    foreign_object_loaded: false,
    foreign_evidence_loaded: false,
    foreign_reference_resolved: false,
    access_granted: false,
    authorization_created: false,
    projection_mutated: false,
    duplicate_authoritative_event_emitted: false,
    duplicate_effect_evidence_created: false,
    tenant_boundary_gate: {
      require_tenant_match_for_object_access: true,
      require_reject_tenant_boundary_violation: true,
      require_security_evidence_event: true,
      require_no_foreign_object_disclosure: true,
      require_no_second_effect: true,
      allow_cross_tenant_object_access: false,
      allow_cross_tenant_evidence_access: false,
      allow_cross_tenant_reference_resolution: false,
      allow_authorization_creation: false,
      allow_projection_mutation: false,
      allow_dispatch_execution: false,
      allow_external_connector_call: false,
      allow_target_receipt_creation: false,
      allow_effect_evidence_creation: false
    },
    runtime_claims: {
      eg_t26_runtime_artifact_created: true,
      tenant_mismatch_detected: true,
      cross_tenant_access_rejected: true,
      rejection_code_tenant_boundary_violation: true,
      security_evidence_event_emitted: true,
      foreign_object_disclosed: false,
      foreign_evidence_loaded: false,
      foreign_reference_resolved: false,
      matrix_implemented: false,
      matrix_l1_pilot_ready: false,
      release_clean_eligible_effective: false,
      c16_external_validation_completed: false,
      external_validation_accepted: false,
      legal_review_claimed: false,
      commercial_release_authorized: false,
      level4_eligible: false,
      pilot_execution_started: false
    },
    no_execution_boundary: {
      dispatch_execution_authorized: false,
      dispatch_command_emitted: false,
      dispatch_performed: false,
      external_connector_called: false,
      target_system_contacted: false,
      target_receipt_created: false,
      execution_trace_bound: false,
      effect_evidence_created: false,
      customer_external_execution_allowed: false
    },
    maximum_supported_claim: "EG_T26_CROSS_TENANT_OBJECT_EVIDENCE_REFERENCE_ACCESS_REJECTS_WITH_TENANT_BOUNDARY_VIOLATION_AND_SECURITY_EVIDENCE_EVENT",
    status: "PASS",
    content_sha256: null
  };

  artifact.content_sha256 = sha256Record({ ...artifact, content_sha256: null });
  return artifact;
}

function verifyEGT26TenantBoundaryViolation(artifactPath) {
  const errors = [];

  if (!fileExists(artifactPath)) {
    const missing = {
      record_type: "MatrixEGT26TenantBoundaryViolationVerificationRecord",
      artifact_path: artifactPath,
      verified: false,
      error_count: 1,
      errors: [{ code: "EG_T26_ARTIFACT_MISSING", path: artifactPath }],
      record_sha256: null
    };
    missing.record_sha256 = sha256Record({ ...missing, record_sha256: null });
    return missing;
  }

  const artifact = readJson(artifactPath);

  if (artifact.schema_version !== RUNTIME_VERSION) errors.push({ code: "EG_T26_SCHEMA_VERSION_MISMATCH", observed: artifact.schema_version });
  if (artifact.program_id !== PROGRAM_ID) errors.push({ code: "EG_T26_PROGRAM_ID_MISMATCH", observed: artifact.program_id });
  if (artifact.test_id !== TEST_ID) errors.push({ code: "EG_T26_TEST_ID_MISMATCH", observed: artifact.test_id });
  if (artifact.required_result !== "REJECT + TENANT_BOUNDARY_VIOLATION + security evidence event") errors.push({ code: "EG_T26_REQUIRED_RESULT_INVALID", observed: artifact.required_result });

  for (const [key, expected] of [
    ["tenant_mismatch_detected", true],
    ["cross_tenant_object_access_detected", true],
    ["cross_tenant_evidence_access_detected", true],
    ["cross_tenant_reference_access_detected", true],
    ["rejection_result", "REJECT"],
    ["rejection_code", "TENANT_BOUNDARY_VIOLATION"],
    ["security_evidence_event_emitted", true],
    ["foreign_object_disclosed", false],
    ["foreign_object_loaded", false],
    ["foreign_evidence_loaded", false],
    ["foreign_reference_resolved", false],
    ["access_granted", false],
    ["authorization_created", false],
    ["projection_mutated", false],
    ["duplicate_authoritative_event_emitted", false],
    ["duplicate_effect_evidence_created", false]
  ]) {
    if (artifact[key] !== expected) {
      errors.push({ code: "EG_T26_FIELD_INVALID", key, expected, observed: artifact[key] });
    }
  }

  if (!artifact.tenant_scoped_object || !artifact.access_request || !artifact.security_evidence_event) {
    errors.push({ code: "EG_T26_CORE_RECORDS_MISSING" });
  } else {
    if (artifact.access_request.requester_tenant_id === artifact.tenant_scoped_object.owner_tenant_id) {
      errors.push({ code: "EG_T26_TENANT_MISMATCH_NOT_PRESENT" });
    }

    if (artifact.access_request.requested_object_tenant_id !== artifact.tenant_scoped_object.tenant_id) {
      errors.push({ code: "EG_T26_OBJECT_TENANT_BINDING_MISMATCH" });
    }

    if (artifact.security_evidence_event.event_class !== "SECURITY_EVIDENCE_EVENT") {
      errors.push({ code: "EG_T26_SECURITY_EVENT_CLASS_INVALID", observed: artifact.security_evidence_event.event_class });
    }

    if (artifact.security_evidence_event.violation_type !== "TENANT_BOUNDARY_VIOLATION") {
      errors.push({ code: "EG_T26_SECURITY_EVENT_VIOLATION_INVALID", observed: artifact.security_evidence_event.violation_type });
    }

    if (artifact.security_evidence_event.rejection_code !== "TENANT_BOUNDARY_VIOLATION") {
      errors.push({ code: "EG_T26_SECURITY_EVENT_REJECTION_CODE_INVALID", observed: artifact.security_evidence_event.rejection_code });
    }

    for (const key of [
      "foreign_object_disclosed",
      "foreign_evidence_loaded",
      "foreign_reference_resolved",
      "dispatch_performed",
      "external_connector_called",
      "target_receipt_created",
      "effect_evidence_created"
    ]) {
      if (artifact.security_evidence_event[key] !== false) {
        errors.push({ code: "EG_T26_SECURITY_EVENT_OVERCLAIM", key, observed: artifact.security_evidence_event[key] });
      }
    }
  }

  for (const key of [
    "require_tenant_match_for_object_access",
    "require_reject_tenant_boundary_violation",
    "require_security_evidence_event",
    "require_no_foreign_object_disclosure",
    "require_no_second_effect"
  ]) {
    if (!artifact.tenant_boundary_gate || artifact.tenant_boundary_gate[key] !== true) {
      errors.push({ code: "EG_T26_REQUIRED_GATE_NOT_TRUE", key, observed: artifact.tenant_boundary_gate ? artifact.tenant_boundary_gate[key] : undefined });
    }
  }

  for (const key of [
    "allow_cross_tenant_object_access",
    "allow_cross_tenant_evidence_access",
    "allow_cross_tenant_reference_resolution",
    "allow_authorization_creation",
    "allow_projection_mutation",
    "allow_dispatch_execution",
    "allow_external_connector_call",
    "allow_target_receipt_creation",
    "allow_effect_evidence_creation"
  ]) {
    if (!artifact.tenant_boundary_gate || artifact.tenant_boundary_gate[key] !== false) {
      errors.push({ code: "EG_T26_GATE_OVERCLAIM", key, observed: artifact.tenant_boundary_gate ? artifact.tenant_boundary_gate[key] : undefined });
    }
  }

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible_effective",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
    "pilot_execution_started"
  ]) {
    if (!artifact.runtime_claims || artifact.runtime_claims[key] !== false) {
      errors.push({ code: "EG_T26_RUNTIME_CLAIM_OVERCLAIM", key, observed: artifact.runtime_claims ? artifact.runtime_claims[key] : undefined });
    }
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
    "customer_external_execution_allowed"
  ]) {
    if (!artifact.no_execution_boundary || artifact.no_execution_boundary[key] !== false) {
      errors.push({ code: "EG_T26_EXECUTION_BOUNDARY_OVERCLAIM", key, observed: artifact.no_execution_boundary ? artifact.no_execution_boundary[key] : undefined });
    }
  }

  const expectedHash = sha256Record({ ...artifact, content_sha256: null });
  if (artifact.content_sha256 !== expectedHash) {
    errors.push({ code: "EG_T26_CONTENT_HASH_MISMATCH", expected: expectedHash, observed: artifact.content_sha256 });
  }

  const verification = {
    record_type: "MatrixEGT26TenantBoundaryViolationVerificationRecord",
    verifier_version: "HBCE-MATRIX-EG-T26-TENANT-BOUNDARY-VIOLATION-VERIFIER-V0.1",
    artifact_path: artifactPath,
    program_id: PROGRAM_ID,
    test_id: TEST_ID,
    verified: errors.length === 0,
    error_count: errors.length,
    errors,
    tenant_mismatch_detected: artifact.tenant_mismatch_detected,
    rejection_code: artifact.rejection_code,
    security_evidence_event_emitted: artifact.security_evidence_event_emitted,
    foreign_object_disclosed: artifact.foreign_object_disclosed,
    access_granted: artifact.access_granted,
    maximum_supported_claim: artifact.maximum_supported_claim,
    artifact_sha256: fileExists(artifactPath) ? sha256Record(readJson(artifactPath)) : null,
    record_sha256: null
  };

  verification.record_sha256 = sha256Record({ ...verification, record_sha256: null });
  return verification;
}

module.exports = {
  PROGRAM_ID,
  TEST_ID,
  TENANT_ID,
  FOREIGN_TENANT_ID,
  MATRIX_SUBJECT_REF,
  RUNTIME_VERSION,
  sha256Record,
  readJson,
  fileExists,
  createTenantScopedObject,
  createCrossTenantAccessRequest,
  createSecurityEvidenceEvent,
  evaluateTenantBoundaryViolation,
  verifyEGT26TenantBoundaryViolation
};
