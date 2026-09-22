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
  createExternalReviewCandidateAuditIndex
} = require('../../runtime/external-review/create-external-review-candidate-audit-index');
const {
  REVIEW_PACKAGE_STATE,
  REVIEW_PACKAGE_PROTO,
  REVIEW_PACKAGE_KIND,
  REVIEW_PACKAGE_SECTIONS,
  createExternalReviewCandidateReviewPackage
} = require('../../runtime/external-review/create-external-review-candidate-review-package');

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
    generated_at: '2026-09-22T13:40:00Z',
    audit_manifest_context: auditManifestContext()
  };
}

function reviewPackageContext() {
  return {
    review_package_id: 'review:rpecrc:package:001',
    review_package_version: '1.0',
    generated_at: '2026-09-22T13:45:00Z'
  };
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const auditManifest = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());
  const auditIndex = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());
  const actual = createExternalReviewCandidateReviewPackage(auditIndex, reviewPackageContext());

  assert.equal(actual.state, REVIEW_PACKAGE_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_REVIEW_PACKAGE_RECORDED');
  assert.equal(actual.review_package.proto, REVIEW_PACKAGE_PROTO);
  assert.equal(actual.review_package.kind, REVIEW_PACKAGE_KIND);
  assert.equal(actual.review_package.review_package_id, 'review:rpecrc:package:001');
  assert.equal(actual.review_package.audit_index_id, auditIndex.index.audit_index_id);
  assert.equal(actual.review_package.audit_index_sha256, auditIndex.index.audit_index_sha256);
  assert.equal(actual.review_package.audit_manifest_sha256, auditIndex.index.audit_manifest_sha256);
  assert.equal(actual.review_package.audit_package_sha256, auditIndex.index.audit_package_sha256);
  assert.equal(actual.review_package.matrix_binding_sha256, auditIndex.index.matrix_binding_sha256);
  assert.match(actual.review_package.review_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(actual.review_package.validation_state, 'VALID');
  assert.equal(actual.review_package.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.review_package.review_package_sections_satisfied, true);
  assert.equal(actual.review_package.review_package_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_REVIEW_PACKAGE_RECORDED_FROM_AUDIT_INDEX');
}

{
  const actual = createExternalReviewCandidateReviewPackage(baseCandidate(), {
    ...reviewPackageContext(),
    audit_index_context: auditIndexContext()
  });

  assert.equal(actual.state, REVIEW_PACKAGE_STATE.RECORDED);
  assert.equal(actual.review_package.validation_state, 'VALID');
  assert.equal(actual.review_package.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.review_package.review_package_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_REVIEW_PACKAGE_RECORDED_FROM_CANDIDATE');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const actual = createExternalReviewCandidateReviewPackage(candidate, {
    ...reviewPackageContext(),
    audit_index_context: auditIndexContext()
  });

  assert.equal(actual.state, REVIEW_PACKAGE_STATE.RECORDED);
  assert.equal(actual.review_package.validation_state, 'INVALID');
  assert.equal(actual.review_package.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.review_package.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.review_package.review_package_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_REVIEW_PACKAGE_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const actual = createExternalReviewCandidateReviewPackage(candidate, {
    ...reviewPackageContext(),
    audit_index_context: auditIndexContext()
  });

  assert.equal(actual.state, REVIEW_PACKAGE_STATE.RECORDED);
  assert.equal(actual.review_package.validation_state, 'INVALID');
  assert.equal(actual.review_package.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.review_package.index_boundary_state, 'BLOCKED');
  assert.equal(actual.review_package.review_package_boundary_state, 'BLOCKED');
  assert.equal(actual.review_package.claims_not_created.legal_certification, false);
  assert.equal(actual.review_package.runtime_effects.legal_certification_created, false);
  console.log('PASS RPECRC_REVIEW_PACKAGE_BOUNDARY_BLOCKED_RECORDED');
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const auditManifest = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());
  const auditIndex = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());

  const actual = createExternalReviewCandidateReviewPackage(auditIndex, {
    generated_at: '2026-09-22T13:45:00Z'
  });

  assert.deepEqual(actual, {
    state: REVIEW_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_REVIEW_PACKAGE_ID_INVALID'
  });
  console.log('PASS RPECRC_REVIEW_PACKAGE_ID_INVALID');
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const auditManifest = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());
  const auditIndex = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());

  const actual = createExternalReviewCandidateReviewPackage(auditIndex, {
    review_package_id: 'review:rpecrc:package:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: REVIEW_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_REVIEW_PACKAGE_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_REVIEW_PACKAGE_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateReviewPackage({ state: 'INVALID' }, reviewPackageContext());

  assert.deepEqual(actual, {
    state: REVIEW_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_REVIEW_PACKAGE_AUDIT_INDEX_INVALID'
  });
  console.log('PASS RPECRC_REVIEW_PACKAGE_AUDIT_INDEX_INVALID');
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const auditManifest = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());
  const auditIndex = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());
  const actual = createExternalReviewCandidateReviewPackage(auditIndex, reviewPackageContext());

  assert.equal(actual.review_package.review_package_section_count, REVIEW_PACKAGE_SECTIONS.length);
  assert.deepEqual(
    actual.review_package.review_package_sections.map(section => section.section_id),
    [
      'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-001',
      'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-002',
      'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-003',
      'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-004',
      'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-005',
      'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-006',
      'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-007'
    ]
  );
  console.log('PASS RPECRC_REVIEW_PACKAGE_SECTIONS');
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const auditManifest = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());
  const auditIndex = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());
  const actual = createExternalReviewCandidateReviewPackage(auditIndex, reviewPackageContext());

  assert.equal(actual.review_package.review_package_scope.INTERNAL_TECHNICAL_PACKAGE_ONLY, true);
  assert.equal(actual.review_package.review_package_scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(actual.review_package.review_package_scope.EXTERNAL_REVIEW_SUBMISSION, false);
  assert.equal(actual.review_package.review_package_scope.LEGAL_CERTIFICATION, false);
  assert.equal(actual.review_package.review_package_scope.EIDAS_QUALIFICATION, false);
  assert.equal(actual.review_package.review_package_scope.OPC_ALLOW, false);
  assert.equal(actual.review_package.review_package_scope.DEPLOYMENT_SUCCESS, false);
  assert.equal(actual.review_package.review_package_scope.PRODUCTION_DEPLOYMENT, false);
  console.log('PASS RPECRC_REVIEW_PACKAGE_SCOPE_FALSE');
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const auditManifest = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());
  const auditIndex = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());
  const actual = createExternalReviewCandidateReviewPackage(auditIndex, reviewPackageContext());

  assert.equal(actual.review_package.external_review_execution_created, false);
  assert.equal(actual.review_package.external_review_opinion_created, false);
  assert.equal(actual.review_package.external_review_report_created, false);
  assert.equal(actual.review_package.external_review_submission_created, false);
  assert.equal(actual.review_package.external_review_publication_created, false);
  assert.equal(actual.review_package.legal_certification_created, false);
  assert.equal(actual.review_package.eidas_qualification_created, false);
  assert.equal(actual.review_package.opc_allow_created, false);
  assert.equal(actual.review_package.deployment_success_proven, false);
  assert.equal(actual.review_package.production_deployment_proven, false);
  assert.equal(actual.review_package.public_registry_mutated, false);
  assert.equal(actual.review_package.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_REVIEW_PACKAGE_RUNTIME_EFFECTS_FALSE');
}
