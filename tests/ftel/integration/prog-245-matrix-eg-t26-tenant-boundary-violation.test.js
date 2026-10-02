"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");

const runtime = require(path.join(process.cwd(), "runtime/matrix/hbce-matrix-eg-t26-tenant-boundary-violation.js"));

const artifactPath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T26_TenantBoundaryViolation_v001.json";
const evidencePath = "matrix/eg001/evidence/20261001_HBCE-MATRIX-EG-T26_PROG-245-evidence_v001.json";

{
  assert.equal(runtime.fileExists(artifactPath), true);
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.artifact_type, "MatrixEGT26TenantBoundaryViolationRuntimeEvidence");
  assert.equal(artifact.schema_version, runtime.RUNTIME_VERSION);
  assert.equal(artifact.program_id, runtime.PROGRAM_ID);
  assert.equal(artifact.test_id, runtime.TEST_ID);
  assert.equal(artifact.required_result, "REJECT + TENANT_BOUNDARY_VIOLATION + security evidence event");
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.equal(artifact.tenant_mismatch_detected, true);
  assert.equal(artifact.cross_tenant_object_access_detected, true);
  assert.equal(artifact.cross_tenant_evidence_access_detected, true);
  assert.equal(artifact.cross_tenant_reference_access_detected, true);
  assert.equal(artifact.rejection_result, "REJECT");
  assert.equal(artifact.rejection_code, "TENANT_BOUNDARY_VIOLATION");
  assert.equal(artifact.security_evidence_event_emitted, true);
  assert.equal(artifact.foreign_object_disclosed, false);
  assert.equal(artifact.foreign_object_loaded, false);
  assert.equal(artifact.foreign_evidence_loaded, false);
  assert.equal(artifact.foreign_reference_resolved, false);
  assert.equal(artifact.access_granted, false);
  assert.equal(artifact.authorization_created, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  assert.notEqual(artifact.access_request.requester_tenant_id, artifact.tenant_scoped_object.owner_tenant_id);
  assert.equal(artifact.access_request.requested_object_tenant_id, artifact.tenant_scoped_object.tenant_id);
  assert.equal(artifact.security_evidence_event.event_class, "SECURITY_EVIDENCE_EVENT");
  assert.equal(artifact.security_evidence_event.violation_type, "TENANT_BOUNDARY_VIOLATION");
  assert.equal(artifact.security_evidence_event.rejection_code, "TENANT_BOUNDARY_VIOLATION");
  assert.equal(artifact.security_evidence_event.foreign_object_disclosed, false);
  assert.equal(artifact.security_evidence_event.foreign_evidence_loaded, false);
  assert.equal(artifact.security_evidence_event.foreign_reference_resolved, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  for (const key of [
    "require_tenant_match_for_object_access",
    "require_reject_tenant_boundary_violation",
    "require_security_evidence_event",
    "require_no_foreign_object_disclosure",
    "require_no_second_effect"
  ]) {
    assert.equal(artifact.tenant_boundary_gate[key], true, key);
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
    assert.equal(artifact.tenant_boundary_gate[key], false, key);
  }
}

{
  const verification = runtime.verifyEGT26TenantBoundaryViolation(artifactPath);

  assert.equal(verification.record_type, "MatrixEGT26TenantBoundaryViolationVerificationRecord");
  assert.equal(verification.verified, true);
  assert.equal(verification.error_count, 0);
  assert.deepEqual(verification.errors, []);
  assert.equal(verification.tenant_mismatch_detected, true);
  assert.equal(verification.rejection_code, "TENANT_BOUNDARY_VIOLATION");
  assert.equal(verification.security_evidence_event_emitted, true);
  assert.equal(verification.foreign_object_disclosed, false);
  assert.equal(verification.access_granted, false);
}

{
  const artifact = runtime.readJson(artifactPath);

  const tmpAccess = "/tmp/hbce-matrix-eg-t26-access-overclaim.json";
  const accessOverclaim = {
    ...artifact,
    rejection_result: "ALLOW",
    rejection_code: null,
    access_granted: true,
    authorization_created: true,
    foreign_object_disclosed: true,
    foreign_object_loaded: true,
    tenant_boundary_gate: {
      ...artifact.tenant_boundary_gate,
      allow_cross_tenant_object_access: true,
      allow_authorization_creation: true
    },
    security_evidence_event: {
      ...artifact.security_evidence_event,
      rejection_code: null,
      foreign_object_disclosed: true
    }
  };
  accessOverclaim.content_sha256 = runtime.sha256Record({ ...accessOverclaim, content_sha256: null });
  fs.writeFileSync(tmpAccess, JSON.stringify(accessOverclaim, null, 2));

  const accessVerification = runtime.verifyEGT26TenantBoundaryViolation(tmpAccess);
  assert.equal(accessVerification.verified, false);
  assert.ok(accessVerification.errors.some((error) => [
    "EG_T26_FIELD_INVALID",
    "EG_T26_SECURITY_EVENT_REJECTION_CODE_INVALID",
    "EG_T26_SECURITY_EVENT_OVERCLAIM",
    "EG_T26_GATE_OVERCLAIM"
  ].includes(error.code)));

  const tmpExecution = "/tmp/hbce-matrix-eg-t26-execution-overclaim.json";
  const executionOverclaim = {
    ...artifact,
    no_execution_boundary: {
      ...artifact.no_execution_boundary,
      dispatch_performed: true,
      external_connector_called: true,
      effect_evidence_created: true
    }
  };
  executionOverclaim.content_sha256 = runtime.sha256Record({ ...executionOverclaim, content_sha256: null });
  fs.writeFileSync(tmpExecution, JSON.stringify(executionOverclaim, null, 2));

  const executionVerification = runtime.verifyEGT26TenantBoundaryViolation(tmpExecution);
  assert.equal(executionVerification.verified, false);
  assert.ok(executionVerification.errors.some((error) => error.code === "EG_T26_EXECUTION_BOUNDARY_OVERCLAIM"));
}

{
  const artifact = runtime.readJson(artifactPath);
  const evidence = runtime.readJson(evidencePath);

  assert.equal(evidence.program, runtime.PROGRAM_ID);
  assert.equal(evidence.test_id, runtime.TEST_ID);
  assert.equal(evidence.tenant_mismatch_detected, true);
  assert.equal(evidence.cross_tenant_object_access_detected, true);
  assert.equal(evidence.cross_tenant_evidence_access_detected, true);
  assert.equal(evidence.cross_tenant_reference_access_detected, true);
  assert.equal(evidence.rejection_code, "TENANT_BOUNDARY_VIOLATION");
  assert.equal(evidence.security_evidence_event_emitted, true);
  assert.equal(evidence.foreign_object_disclosed, false);
  assert.equal(evidence.access_granted, false);
  assert.equal(evidence.eg_t26_runtime_artifact_created, true);

  for (const key of [
    "matrix_implemented",
    "matrix_l1_pilot_ready",
    "release_clean_eligible_effective",
    "c16_external_validation_completed",
    "external_validation_accepted",
    "legal_review_claimed",
    "commercial_release_authorized",
    "level4_eligible",
    "pilot_execution_started",
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
    assert.equal(evidence[key], false, key);
  }

  assert.equal(artifact.no_execution_boundary.dispatch_performed, false);
  assert.equal(artifact.no_execution_boundary.external_connector_called, false);
  assert.equal(artifact.no_execution_boundary.effect_evidence_created, false);
}

console.log("PROG_245_MATRIX_EG_T26_TENANT_BOUNDARY_VIOLATION_TEST=PASS");
