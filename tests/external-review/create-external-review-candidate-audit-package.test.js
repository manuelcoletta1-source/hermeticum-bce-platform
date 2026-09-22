'use strict';

const assert = require('node:assert/strict');
const {
  REQUIRED_STRING_FIELDS,
  HASH_FIELDS,
  BOUNDARY_FALSE_FIELDS
} = require('../../runtime/external-review/validate-external-review-candidate');
const {
  createExternalReviewCandidateMatrixBinding
} = require('../../runtime/external-review/create-external-review-candidate-matrix-binding');
const {
  AUDIT_PACKAGE_STATE,
  AUDIT_PACKAGE_PROTO,
  AUDIT_PACKAGE_KIND,
  AUDIT_SECTIONS,
  createExternalReviewCandidateAuditPackage
} = require('../../runtime/external-review/create-external-review-candidate-audit-package');

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
    generated_at: '2026-09-22T13:00:00Z'
  };
}

function matrixBindingContext() {
  return {
    binding_id: 'matrix:rpecrc:binding:001',
    binding_version: '1.0',
    generated_at: '2026-09-22T13:05:00Z',
    evidence_context: evidenceContext()
  };
}

function auditPackageContext() {
  return {
    audit_package_id: 'audit:rpecrc:package:001',
    audit_package_version: '1.0',
    generated_at: '2026-09-22T13:10:00Z'
  };
}

{
  const matrix = createExternalReviewCandidateMatrixBinding(baseCandidate(), matrixBindingContext());
  const actual = createExternalReviewCandidateAuditPackage(matrix, auditPackageContext());

  assert.equal(actual.state, AUDIT_PACKAGE_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_AUDIT_PACKAGE_RECORDED');
  assert.equal(actual.audit_package.proto, AUDIT_PACKAGE_PROTO);
  assert.equal(actual.audit_package.kind, AUDIT_PACKAGE_KIND);
  assert.equal(actual.audit_package.audit_package_id, 'audit:rpecrc:package:001');
  assert.equal(actual.audit_package.matrix_binding_id, matrix.binding.binding_id);
  assert.match(actual.audit_package.matrix_binding_sha256, /^[a-f0-9]{64}$/);
  assert.match(actual.audit_package.audit_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(actual.audit_package.validation_state, 'VALID');
  assert.equal(actual.audit_package.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.audit_package.audit_sections_satisfied, true);
  assert.equal(actual.audit_package.audit_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_PACKAGE_RECORDED_FROM_MATRIX_BINDING');
}

{
  const actual = createExternalReviewCandidateAuditPackage(baseCandidate(), {
    ...auditPackageContext(),
    matrix_binding_context: matrixBindingContext()
  });

  assert.equal(actual.state, AUDIT_PACKAGE_STATE.RECORDED);
  assert.equal(actual.audit_package.validation_state, 'VALID');
  assert.equal(actual.audit_package.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.audit_package.audit_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_PACKAGE_RECORDED_FROM_CANDIDATE');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const actual = createExternalReviewCandidateAuditPackage(candidate, {
    ...auditPackageContext(),
    matrix_binding_context: matrixBindingContext()
  });

  assert.equal(actual.state, AUDIT_PACKAGE_STATE.RECORDED);
  assert.equal(actual.audit_package.validation_state, 'INVALID');
  assert.equal(actual.audit_package.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.audit_package.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.audit_package.audit_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_AUDIT_PACKAGE_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const actual = createExternalReviewCandidateAuditPackage(candidate, {
    ...auditPackageContext(),
    matrix_binding_context: matrixBindingContext()
  });

  assert.equal(actual.state, AUDIT_PACKAGE_STATE.RECORDED);
  assert.equal(actual.audit_package.validation_state, 'INVALID');
  assert.equal(actual.audit_package.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.audit_package.boundary_flags_preserved, false);
  assert.equal(actual.audit_package.matrix_boundary_state, 'BLOCKED');
  assert.equal(actual.audit_package.audit_boundary_state, 'BLOCKED');
  assert.equal(actual.audit_package.claims_not_created.legal_certification, false);
  assert.equal(actual.audit_package.runtime_effects.legal_certification_created, false);
  console.log('PASS RPECRC_AUDIT_PACKAGE_BOUNDARY_BLOCKED_RECORDED');
}

{
  const actual = createExternalReviewCandidateAuditPackage(
    createExternalReviewCandidateMatrixBinding(baseCandidate(), matrixBindingContext()),
    { generated_at: '2026-09-22T13:10:00Z' }
  );

  assert.deepEqual(actual, {
    state: AUDIT_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_AUDIT_PACKAGE_ID_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_PACKAGE_ID_INVALID');
}

{
  const actual = createExternalReviewCandidateAuditPackage(
    createExternalReviewCandidateMatrixBinding(baseCandidate(), matrixBindingContext()),
    {
      audit_package_id: 'audit:rpecrc:package:001',
      generated_at: 'not-a-date'
    }
  );

  assert.deepEqual(actual, {
    state: AUDIT_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_AUDIT_PACKAGE_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_PACKAGE_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateAuditPackage({ state: 'INVALID' }, auditPackageContext());

  assert.deepEqual(actual, {
    state: AUDIT_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_AUDIT_PACKAGE_MATRIX_BINDING_INVALID'
  });
  console.log('PASS RPECRC_AUDIT_PACKAGE_MATRIX_BINDING_INVALID');
}

{
  const matrix = createExternalReviewCandidateMatrixBinding(baseCandidate(), matrixBindingContext());
  const actual = createExternalReviewCandidateAuditPackage(matrix, auditPackageContext());

  assert.equal(actual.audit_package.audit_section_count, AUDIT_SECTIONS.length);
  assert.deepEqual(
    actual.audit_package.audit_sections.map(section => section.section_id),
    [
      'HBCE-RPECRC-AUDIT-SECTION-001',
      'HBCE-RPECRC-AUDIT-SECTION-002',
      'HBCE-RPECRC-AUDIT-SECTION-003',
      'HBCE-RPECRC-AUDIT-SECTION-004',
      'HBCE-RPECRC-AUDIT-SECTION-005',
      'HBCE-RPECRC-AUDIT-SECTION-006'
    ]
  );
  console.log('PASS RPECRC_AUDIT_PACKAGE_SECTIONS');
}

{
  const matrix = createExternalReviewCandidateMatrixBinding(baseCandidate(), matrixBindingContext());
  const actual = createExternalReviewCandidateAuditPackage(matrix, auditPackageContext());

  assert.equal(actual.audit_package.audit_scope.INTERNAL_TECHNICAL_REVIEW_ONLY, true);
  assert.equal(actual.audit_package.audit_scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(actual.audit_package.audit_scope.LEGAL_CERTIFICATION, false);
  assert.equal(actual.audit_package.audit_scope.EIDAS_QUALIFICATION, false);
  assert.equal(actual.audit_package.audit_scope.OPC_ALLOW, false);
  assert.equal(actual.audit_package.audit_scope.DEPLOYMENT_SUCCESS, false);
  assert.equal(actual.audit_package.audit_scope.PRODUCTION_DEPLOYMENT, false);
  console.log('PASS RPECRC_AUDIT_PACKAGE_SCOPE_FALSE');
}

{
  const matrix = createExternalReviewCandidateMatrixBinding(baseCandidate(), matrixBindingContext());
  const actual = createExternalReviewCandidateAuditPackage(matrix, auditPackageContext());

  assert.equal(actual.audit_package.external_review_execution_created, false);
  assert.equal(actual.audit_package.external_review_opinion_created, false);
  assert.equal(actual.audit_package.external_review_report_created, false);
  assert.equal(actual.audit_package.legal_certification_created, false);
  assert.equal(actual.audit_package.eidas_qualification_created, false);
  assert.equal(actual.audit_package.opc_allow_created, false);
  assert.equal(actual.audit_package.deployment_success_proven, false);
  assert.equal(actual.audit_package.production_deployment_proven, false);
  assert.equal(actual.audit_package.public_registry_mutated, false);
  assert.equal(actual.audit_package.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_AUDIT_PACKAGE_RUNTIME_EFFECTS_FALSE');
}
