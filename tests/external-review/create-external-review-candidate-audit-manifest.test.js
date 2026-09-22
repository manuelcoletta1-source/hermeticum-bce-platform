'use strict';

const assert = require('node:assert/strict');
const {
  REQUIRED_STRING_FIELDS,
  HASH_FIELDS,
  BOUNDARY_FALSE_FIELDS
} = require('../../runtime/external-review/validate-external-review-candidate');
const {
  createExternalReviewCandidateAuditPackage
} = require('../../runtime/external-review/create-external-review-candidate-audit-package');
const {
  AUDIT_MANIFEST_STATE,
  AUDIT_MANIFEST_PROTO,
  AUDIT_MANIFEST_KIND,
  MANIFEST_ENTRIES,
  createExternalReviewCandidateAuditManifest
} = require('../../runtime/external-review/create-external-review-candidate-audit-manifest');

const HASH_A = 'a'.repeat(64);

function boundaryFlags() {
  const flags = {};
  for (const field of BOUNDARY_FALSE_FIELDS) {
    flags[field] = false;
  }
  return flags;
}

function baseCandidate() {
  const candidate = {};

  for (const field of REQUIRED_STRING_FIELDS) {
    candidate[field] = `${field}:demo`;
  }

  for (const field of HASH_FIELDS) {
    candidate[field] = HASH_A;
  }

  candidate.request_id = 'rpecrc-request-001';
  candidate.release_candidate_id = 'HBCE-RC-2027-0001';
  candidate.external_review_candidate_ref = 'rpecrc:external-review-candidate:001';
  candidate.production_readiness_execution_control_certification_candidate_ref = 'rpecrc:certification-candidate:001';
  candidate.production_readiness_execution_control_external_review_candidate_status = 'EXTERNAL_REVIEW_CANDIDATE_READY';
  candidate.production_readiness_execution_control_external_review_candidate_result = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_READY';
  candidate.production_readiness_execution_control_certification_candidate_result = 'PRODUCTION_READINESS_EXECUTION_CONTROL_CERTIFICATION_CANDIDATE_READY';
  candidate.production_readiness_execution_control_attestation_result = 'ATTESTED';
  candidate.production_readiness_execution_control_seal_result = 'SEALED';
  candidate.human_execution_control_external_review_candidate_state = 'READY';
  candidate.human_acceptance_state = 'ACCEPTED';
  candidate.lifecycle_state = 'EXTERNAL_REVIEW_CANDIDATE_READY';
  candidate.external_review_candidate_reason_code = 'RPECRC_VALID';
  candidate.external_review_candidate_reason_text = 'Valid external review candidate fixture';
  candidate.boundary_flags = boundaryFlags();

  return candidate;
}

function evidenceContext() {
  return {
    evidence_id: 'evidence:rpecrc:validation:001',
    evidence_version: '1.0',
    generated_at: '2026-09-22T13:20:00Z'
  };
}

function matrixBindingContext() {
  return {
    binding_id: 'matrix:rpecrc:binding:001',
    binding_version: '1.0',
    generated_at: '2026-09-22T13:25:00Z',
    evidence_context: evidenceContext()
  };
}

function auditPackageContext() {
  return {
    audit_package_id: 'audit:rpecrc:package:001',
    audit_package_version: '1.0',
    generated_at: '2026-09-22T13:30:00Z',
    matrix_binding_context: matrixBindingContext()
  };
}

function auditManifestContext() {
  return {
    audit_manifest_id: 'audit:rpecrc:manifest:001',
    audit_manifest_version: '1.0',
    generated_at: '2026-09-22T13:35:00Z'
  };
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const actual = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());

  assert.equal(actual.state, AUDIT_MANIFEST_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_AUDIT_MANIFEST_RECORDED');
  assert.equal(actual.manifest.proto, AUDIT_MANIFEST_PROTO);
  assert.equal(actual.manifest.kind, AUDIT_MANIFEST_KIND);
  assert.equal(actual.manifest.audit_manifest_id, 'audit:rpecrc:manifest:001');
  assert.equal(actual.manifest.audit_package_id, auditPackage.audit_package.audit_package_id);
  assert.equal(actual.manifest.audit_package_sha256, auditPackage.audit_package.audit_package_sha256);
  assert.equal(actual.manifest.matrix_binding_sha256, auditPackage.audit_package.matrix_binding_sha256);
  assert.match(actual.manifest.audit_manifest_sha256, /^[a-f0-9]{64}$/);
  assert.equal(actual.manifest.validation_state, 'VALID');
  assert.equal(actual.manifest.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.manifest.manifest_entries_satisfied, true);
  assert.equal(actual.manifest.manifest_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_MANIFEST_RECORDED_FROM_AUDIT_PACKAGE');
}

{
  const actual = createExternalReviewCandidateAuditManifest(baseCandidate(), {
    ...auditManifestContext(),
    audit_package_context: auditPackageContext()
  });

  assert.equal(actual.state, AUDIT_MANIFEST_STATE.RECORDED);
  assert.equal(actual.manifest.validation_state, 'VALID');
  assert.equal(actual.manifest.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.manifest.manifest_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_MANIFEST_RECORDED_FROM_CANDIDATE');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const actual = createExternalReviewCandidateAuditManifest(candidate, {
    ...auditManifestContext(),
    audit_package_context: auditPackageContext()
  });

  assert.equal(actual.state, AUDIT_MANIFEST_STATE.RECORDED);
  assert.equal(actual.manifest.validation_state, 'INVALID');
  assert.equal(actual.manifest.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.manifest.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.manifest.manifest_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_MANIFEST_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const actual = createExternalReviewCandidateAuditManifest(candidate, {
    ...auditManifestContext(),
    audit_package_context: auditPackageContext()
  });

  assert.equal(actual.state, AUDIT_MANIFEST_STATE.RECORDED);
  assert.equal(actual.manifest.validation_state, 'INVALID');
  assert.equal(actual.manifest.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.manifest.audit_boundary_state, 'BLOCKED');
  assert.equal(actual.manifest.manifest_boundary_state, 'BLOCKED');
  assert.equal(actual.manifest.claims_not_created.legal_certification, false);
  assert.equal(actual.manifest.runtime_effects.legal_certification_created, false);
  console.log('PASS RPECRC_AUDIT_MANIFEST_BOUNDARY_BLOCKED_RECORDED');
}

{
  const actual = createExternalReviewCandidateAuditManifest(
    createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
    { generated_at: '2026-09-22T13:35:00Z' }
  );

  assert.deepEqual(actual, {
    state: AUDIT_MANIFEST_STATE.INVALID,
    reason: 'RPECRC_AUDIT_MANIFEST_ID_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_MANIFEST_ID_INVALID');
}

{
  const actual = createExternalReviewCandidateAuditManifest(
    createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
    {
      audit_manifest_id: 'audit:rpecrc:manifest:001',
      generated_at: 'not-a-date'
    }
  );

  assert.deepEqual(actual, {
    state: AUDIT_MANIFEST_STATE.INVALID,
    reason: 'RPECRC_AUDIT_MANIFEST_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_MANIFEST_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateAuditManifest({ state: 'INVALID' }, auditManifestContext());

  assert.deepEqual(actual, {
    state: AUDIT_MANIFEST_STATE.INVALID,
    reason: 'RPECRC_AUDIT_MANIFEST_AUDIT_PACKAGE_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_MANIFEST_AUDIT_PACKAGE_INVALID');
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const actual = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());

  assert.equal(actual.manifest.manifest_entry_count, MANIFEST_ENTRIES.length);
  assert.deepEqual(
    actual.manifest.manifest_entries.map(entry => entry.entry_id),
    [
      'HBCE-RPECRC-MANIFEST-ENTRY-001',
      'HBCE-RPECRC-MANIFEST-ENTRY-002',
      'HBCE-RPECRC-MANIFEST-ENTRY-003',
      'HBCE-RPECRC-MANIFEST-ENTRY-004',
      'HBCE-RPECRC-MANIFEST-ENTRY-005',
      'HBCE-RPECRC-MANIFEST-ENTRY-006'
    ]
  );
  console.log('PASS RPECRC_AUDIT_MANIFEST_ENTRIES');
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const actual = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());

  assert.equal(actual.manifest.manifest_scope.INTERNAL_TECHNICAL_INDEX_ONLY, true);
  assert.equal(actual.manifest.manifest_scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(actual.manifest.manifest_scope.LEGAL_CERTIFICATION, false);
  assert.equal(actual.manifest.manifest_scope.EIDAS_QUALIFICATION, false);
  assert.equal(actual.manifest.manifest_scope.OPC_ALLOW, false);
  assert.equal(actual.manifest.manifest_scope.DEPLOYMENT_SUCCESS, false);
  assert.equal(actual.manifest.manifest_scope.PRODUCTION_DEPLOYMENT, false);
  console.log('PASS RPECRC_AUDIT_MANIFEST_SCOPE_FALSE');
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const actual = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());

  assert.equal(actual.manifest.external_review_execution_created, false);
  assert.equal(actual.manifest.external_review_opinion_created, false);
  assert.equal(actual.manifest.external_review_report_created, false);
  assert.equal(actual.manifest.legal_certification_created, false);
  assert.equal(actual.manifest.eidas_qualification_created, false);
  assert.equal(actual.manifest.opc_allow_created, false);
  assert.equal(actual.manifest.deployment_success_proven, false);
  assert.equal(actual.manifest.production_deployment_proven, false);
  assert.equal(actual.manifest.public_registry_mutated, false);
  assert.equal(actual.manifest.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_AUDIT_MANIFEST_RUNTIME_EFFECTS_FALSE');
}
