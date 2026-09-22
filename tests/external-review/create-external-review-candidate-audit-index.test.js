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
  createExternalReviewCandidateAuditManifest
} = require('../../runtime/external-review/create-external-review-candidate-audit-manifest');
const {
  AUDIT_INDEX_STATE,
  AUDIT_INDEX_PROTO,
  AUDIT_INDEX_KIND,
  INDEX_ENTRIES,
  createExternalReviewCandidateAuditIndex
} = require('../../runtime/external-review/create-external-review-candidate-audit-index');

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
    generated_at: '2026-09-22T13:35:00Z',
    audit_package_context: auditPackageContext()
  };
}

function auditIndexContext() {
  return {
    audit_index_id: 'audit:rpecrc:index:001',
    audit_index_version: '1.0',
    generated_at: '2026-09-22T13:40:00Z'
  };
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const auditManifest = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());
  const actual = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());

  assert.equal(actual.state, AUDIT_INDEX_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_AUDIT_INDEX_RECORDED');
  assert.equal(actual.index.proto, AUDIT_INDEX_PROTO);
  assert.equal(actual.index.kind, AUDIT_INDEX_KIND);
  assert.equal(actual.index.audit_index_id, 'audit:rpecrc:index:001');
  assert.equal(actual.index.audit_manifest_id, auditManifest.manifest.audit_manifest_id);
  assert.equal(actual.index.audit_manifest_sha256, auditManifest.manifest.audit_manifest_sha256);
  assert.equal(actual.index.audit_package_sha256, auditManifest.manifest.audit_package_sha256);
  assert.equal(actual.index.matrix_binding_sha256, auditManifest.manifest.matrix_binding_sha256);
  assert.match(actual.index.audit_index_sha256, /^[a-f0-9]{64}$/);
  assert.equal(actual.index.validation_state, 'VALID');
  assert.equal(actual.index.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.index.index_entries_satisfied, true);
  assert.equal(actual.index.index_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_INDEX_RECORDED_FROM_AUDIT_MANIFEST');
}

{
  const actual = createExternalReviewCandidateAuditIndex(baseCandidate(), {
    ...auditIndexContext(),
    audit_manifest_context: auditManifestContext()
  });

  assert.equal(actual.state, AUDIT_INDEX_STATE.RECORDED);
  assert.equal(actual.index.validation_state, 'VALID');
  assert.equal(actual.index.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.index.index_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_INDEX_RECORDED_FROM_CANDIDATE');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const actual = createExternalReviewCandidateAuditIndex(candidate, {
    ...auditIndexContext(),
    audit_manifest_context: auditManifestContext()
  });

  assert.equal(actual.state, AUDIT_INDEX_STATE.RECORDED);
  assert.equal(actual.index.validation_state, 'INVALID');
  assert.equal(actual.index.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.index.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.index.index_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_INDEX_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const actual = createExternalReviewCandidateAuditIndex(candidate, {
    ...auditIndexContext(),
    audit_manifest_context: auditManifestContext()
  });

  assert.equal(actual.state, AUDIT_INDEX_STATE.RECORDED);
  assert.equal(actual.index.validation_state, 'INVALID');
  assert.equal(actual.index.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.index.audit_boundary_state, 'BLOCKED');
  assert.equal(actual.index.manifest_boundary_state, 'BLOCKED');
  assert.equal(actual.index.index_boundary_state, 'BLOCKED');
  assert.equal(actual.index.claims_not_created.legal_certification, false);
  assert.equal(actual.index.runtime_effects.legal_certification_created, false);
  console.log('PASS RPECRC_AUDIT_INDEX_BOUNDARY_BLOCKED_RECORDED');
}

{
  const auditManifest = createExternalReviewCandidateAuditManifest(
    createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
    auditManifestContext()
  );

  const actual = createExternalReviewCandidateAuditIndex(auditManifest, {
    generated_at: '2026-09-22T13:40:00Z'
  });

  assert.deepEqual(actual, {
    state: AUDIT_INDEX_STATE.INVALID,
    reason: 'RPECRC_AUDIT_INDEX_ID_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_INDEX_ID_INVALID');
}

{
  const auditManifest = createExternalReviewCandidateAuditManifest(
    createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
    auditManifestContext()
  );

  const actual = createExternalReviewCandidateAuditIndex(auditManifest, {
    audit_index_id: 'audit:rpecrc:index:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: AUDIT_INDEX_STATE.INVALID,
    reason: 'RPECRC_AUDIT_INDEX_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_INDEX_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateAuditIndex({ state: 'INVALID' }, auditIndexContext());

  assert.deepEqual(actual, {
    state: AUDIT_INDEX_STATE.INVALID,
    reason: 'RPECRC_AUDIT_INDEX_AUDIT_MANIFEST_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_INDEX_AUDIT_MANIFEST_INVALID');
}

{
  const auditManifest = createExternalReviewCandidateAuditManifest(
    createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
    auditManifestContext()
  );
  const actual = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());

  assert.equal(actual.index.index_entry_count, INDEX_ENTRIES.length);
  assert.deepEqual(
    actual.index.index_entries.map(entry => entry.entry_id),
    [
      'HBCE-RPECRC-INDEX-ENTRY-001',
      'HBCE-RPECRC-INDEX-ENTRY-002',
      'HBCE-RPECRC-INDEX-ENTRY-003',
      'HBCE-RPECRC-INDEX-ENTRY-004',
      'HBCE-RPECRC-INDEX-ENTRY-005',
      'HBCE-RPECRC-INDEX-ENTRY-006',
      'HBCE-RPECRC-INDEX-ENTRY-007'
    ]
  );
  console.log('PASS RPECRC_AUDIT_INDEX_ENTRIES');
}

{
  const auditManifest = createExternalReviewCandidateAuditManifest(
    createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
    auditManifestContext()
  );
  const actual = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());

  assert.equal(actual.index.index_scope.INTERNAL_TECHNICAL_INDEX_ONLY, true);
  assert.equal(actual.index.index_scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(actual.index.index_scope.LEGAL_CERTIFICATION, false);
  assert.equal(actual.index.index_scope.EIDAS_QUALIFICATION, false);
  assert.equal(actual.index.index_scope.OPC_ALLOW, false);
  assert.equal(actual.index.index_scope.DEPLOYMENT_SUCCESS, false);
  assert.equal(actual.index.index_scope.PRODUCTION_DEPLOYMENT, false);
  console.log('PASS RPECRC_AUDIT_INDEX_SCOPE_FALSE');
}

{
  const auditManifest = createExternalReviewCandidateAuditManifest(
    createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
    auditManifestContext()
  );
  const actual = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());

  assert.equal(actual.index.external_review_execution_created, false);
  assert.equal(actual.index.external_review_opinion_created, false);
  assert.equal(actual.index.external_review_report_created, false);
  assert.equal(actual.index.legal_certification_created, false);
  assert.equal(actual.index.eidas_qualification_created, false);
  assert.equal(actual.index.opc_allow_created, false);
  assert.equal(actual.index.deployment_success_proven, false);
  assert.equal(actual.index.production_deployment_proven, false);
  assert.equal(actual.index.public_registry_mutated, false);
  assert.equal(actual.index.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_AUDIT_INDEX_RUNTIME_EFFECTS_FALSE');
}
