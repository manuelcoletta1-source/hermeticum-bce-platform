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
  createExternalReviewCandidateReviewPackage
} = require('../../runtime/external-review/create-external-review-candidate-review-package');
const {
  REVIEWER_SELECTION_STATE,
  REVIEWER_SELECTION_PROTO,
  REVIEWER_SELECTION_KIND,
  REVIEWER_SELECTION_RECORDS,
  createExternalReviewCandidateReviewerSelection
} = require('../../runtime/external-review/create-external-review-candidate-reviewer-selection');

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
    generated_at: '2026-09-22T13:45:00Z',
    audit_index_context: auditIndexContext()
  };
}

function reviewerSelectionContext() {
  return {
    reviewer_selection_id: 'reviewer:rpecrc:selection:001',
    reviewer_selection_version: '1.0',
    generated_at: '2026-09-22T13:50:00Z',
    reviewer_candidate_ref: 'reviewer:candidate:internal:001',
    reviewer_selection_method: 'INTERNAL_TECHNICAL_PRESELECTION',
    reviewer_independence_basis: 'INTERNAL_PRECHECK_ONLY',
    reviewer_conflict_check_state: 'NO_CONFLICT_ASSERTION_CREATED'
  };
}

{
  const auditPackage = createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext());
  const auditManifest = createExternalReviewCandidateAuditManifest(auditPackage, auditManifestContext());
  const auditIndex = createExternalReviewCandidateAuditIndex(auditManifest, auditIndexContext());
  const reviewPackage = createExternalReviewCandidateReviewPackage(auditIndex, reviewPackageContext());
  const actual = createExternalReviewCandidateReviewerSelection(reviewPackage, reviewerSelectionContext());

  assert.equal(actual.state, REVIEWER_SELECTION_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_REVIEWER_SELECTION_RECORDED');
  assert.equal(actual.reviewer_selection.proto, REVIEWER_SELECTION_PROTO);
  assert.equal(actual.reviewer_selection.kind, REVIEWER_SELECTION_KIND);
  assert.equal(actual.reviewer_selection.reviewer_selection_id, 'reviewer:rpecrc:selection:001');
  assert.equal(actual.reviewer_selection.reviewer_candidate_ref, 'reviewer:candidate:internal:001');
  assert.equal(actual.reviewer_selection.review_package_id, reviewPackage.review_package.review_package_id);
  assert.equal(actual.reviewer_selection.review_package_sha256, reviewPackage.review_package.review_package_sha256);
  assert.equal(actual.reviewer_selection.audit_index_sha256, reviewPackage.review_package.audit_index_sha256);
  assert.equal(actual.reviewer_selection.audit_manifest_sha256, reviewPackage.review_package.audit_manifest_sha256);
  assert.equal(actual.reviewer_selection.audit_package_sha256, reviewPackage.review_package.audit_package_sha256);
  assert.equal(actual.reviewer_selection.matrix_binding_sha256, reviewPackage.review_package.matrix_binding_sha256);
  assert.match(actual.reviewer_selection.reviewer_selection_sha256, /^[a-f0-9]{64}$/);
  assert.equal(actual.reviewer_selection.validation_state, 'VALID');
  assert.equal(actual.reviewer_selection.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.reviewer_selection.reviewer_selection_records_satisfied, true);
  assert.equal(actual.reviewer_selection.reviewer_selection_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_REVIEWER_SELECTION_RECORDED_FROM_REVIEW_PACKAGE');
}

{
  const actual = createExternalReviewCandidateReviewerSelection(baseCandidate(), {
    ...reviewerSelectionContext(),
    review_package_context: reviewPackageContext()
  });

  assert.equal(actual.state, REVIEWER_SELECTION_STATE.RECORDED);
  assert.equal(actual.reviewer_selection.validation_state, 'VALID');
  assert.equal(actual.reviewer_selection.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.reviewer_selection.reviewer_selection_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_REVIEWER_SELECTION_RECORDED_FROM_CANDIDATE');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const actual = createExternalReviewCandidateReviewerSelection(candidate, {
    ...reviewerSelectionContext(),
    review_package_context: reviewPackageContext()
  });

  assert.equal(actual.state, REVIEWER_SELECTION_STATE.RECORDED);
  assert.equal(actual.reviewer_selection.validation_state, 'INVALID');
  assert.equal(actual.reviewer_selection.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.reviewer_selection.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.reviewer_selection.reviewer_selection_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_REVIEWER_SELECTION_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const actual = createExternalReviewCandidateReviewerSelection(candidate, {
    ...reviewerSelectionContext(),
    review_package_context: reviewPackageContext()
  });

  assert.equal(actual.state, REVIEWER_SELECTION_STATE.RECORDED);
  assert.equal(actual.reviewer_selection.validation_state, 'INVALID');
  assert.equal(actual.reviewer_selection.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.reviewer_selection.review_package_boundary_state, 'BLOCKED');
  assert.equal(actual.reviewer_selection.reviewer_selection_boundary_state, 'BLOCKED');
  assert.equal(actual.reviewer_selection.claims_not_created.legal_certification, false);
  assert.equal(actual.reviewer_selection.runtime_effects.legal_certification_created, false);
  console.log('PASS RPECRC_REVIEWER_SELECTION_BOUNDARY_BLOCKED_RECORDED');
}

{
  const reviewPackage = createExternalReviewCandidateReviewPackage(
    createExternalReviewCandidateAuditIndex(
      createExternalReviewCandidateAuditManifest(
        createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
        auditManifestContext()
      ),
      auditIndexContext()
    ),
    reviewPackageContext()
  );

  const actual = createExternalReviewCandidateReviewerSelection(reviewPackage, {
    generated_at: '2026-09-22T13:50:00Z'
  });

  assert.deepEqual(actual, {
    state: REVIEWER_SELECTION_STATE.INVALID,
    reason: 'RPECRC_REVIEWER_SELECTION_ID_INVALID'
  });
  console.log('PASS RPECRC_REVIEWER_SELECTION_ID_INVALID');
}

{
  const reviewPackage = createExternalReviewCandidateReviewPackage(
    createExternalReviewCandidateAuditIndex(
      createExternalReviewCandidateAuditManifest(
        createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
        auditManifestContext()
      ),
      auditIndexContext()
    ),
    reviewPackageContext()
  );

  const actual = createExternalReviewCandidateReviewerSelection(reviewPackage, {
    reviewer_selection_id: 'reviewer:rpecrc:selection:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: REVIEWER_SELECTION_STATE.INVALID,
    reason: 'RPECRC_REVIEWER_SELECTION_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_REVIEWER_SELECTION_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateReviewerSelection({ state: 'INVALID' }, reviewerSelectionContext());

  assert.deepEqual(actual, {
    state: REVIEWER_SELECTION_STATE.INVALID,
    reason: 'RPECRC_REVIEWER_SELECTION_REVIEW_PACKAGE_INVALID'
  });
  console.log('PASS RPECRC_REVIEWER_SELECTION_REVIEW_PACKAGE_INVALID');
}

{
  const reviewPackage = createExternalReviewCandidateReviewPackage(
    createExternalReviewCandidateAuditIndex(
      createExternalReviewCandidateAuditManifest(
        createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
        auditManifestContext()
      ),
      auditIndexContext()
    ),
    reviewPackageContext()
  );
  const actual = createExternalReviewCandidateReviewerSelection(reviewPackage, reviewerSelectionContext());

  assert.equal(actual.reviewer_selection.reviewer_selection_record_count, REVIEWER_SELECTION_RECORDS.length);
  assert.deepEqual(
    actual.reviewer_selection.reviewer_selection_records.map(record => record.record_id),
    [
      'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-001',
      'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-002',
      'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-003',
      'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-004',
      'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-005',
      'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-006',
      'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-007'
    ]
  );
  console.log('PASS RPECRC_REVIEWER_SELECTION_RECORDS');
}

{
  const reviewPackage = createExternalReviewCandidateReviewPackage(
    createExternalReviewCandidateAuditIndex(
      createExternalReviewCandidateAuditManifest(
        createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
        auditManifestContext()
      ),
      auditIndexContext()
    ),
    reviewPackageContext()
  );
  const actual = createExternalReviewCandidateReviewerSelection(reviewPackage, reviewerSelectionContext());

  assert.equal(actual.reviewer_selection.reviewer_selection_scope.INTERNAL_TECHNICAL_SELECTION_ONLY, true);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.INTERNAL_REVIEWER_SELECTION_CANDIDATE, true);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.EXTERNAL_REVIEWER_APPOINTMENT, false);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.EXTERNAL_REVIEW_SUBMISSION, false);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.LEGAL_CERTIFICATION, false);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.EIDAS_QUALIFICATION, false);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.OPC_ALLOW, false);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.DEPLOYMENT_SUCCESS, false);
  assert.equal(actual.reviewer_selection.reviewer_selection_scope.PRODUCTION_DEPLOYMENT, false);
  console.log('PASS RPECRC_REVIEWER_SELECTION_SCOPE_FALSE');
}

{
  const reviewPackage = createExternalReviewCandidateReviewPackage(
    createExternalReviewCandidateAuditIndex(
      createExternalReviewCandidateAuditManifest(
        createExternalReviewCandidateAuditPackage(baseCandidate(), auditPackageContext()),
        auditManifestContext()
      ),
      auditIndexContext()
    ),
    reviewPackageContext()
  );
  const actual = createExternalReviewCandidateReviewerSelection(reviewPackage, reviewerSelectionContext());

  assert.equal(actual.reviewer_selection.external_reviewer_appointed, false);
  assert.equal(actual.reviewer_selection.external_review_execution_created, false);
  assert.equal(actual.reviewer_selection.external_review_opinion_created, false);
  assert.equal(actual.reviewer_selection.external_review_report_created, false);
  assert.equal(actual.reviewer_selection.external_review_submission_created, false);
  assert.equal(actual.reviewer_selection.external_review_publication_created, false);
  assert.equal(actual.reviewer_selection.legal_certification_created, false);
  assert.equal(actual.reviewer_selection.eidas_qualification_created, false);
  assert.equal(actual.reviewer_selection.opc_allow_created, false);
  assert.equal(actual.reviewer_selection.deployment_success_proven, false);
  assert.equal(actual.reviewer_selection.production_deployment_proven, false);
  assert.equal(actual.reviewer_selection.public_registry_mutated, false);
  assert.equal(actual.reviewer_selection.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_REVIEWER_SELECTION_RUNTIME_EFFECTS_FALSE');
}
