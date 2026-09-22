'use strict';

const assert = require('node:assert/strict');
const {
  REQUIRED_STRING_FIELDS,
  HASH_FIELDS,
  BOUNDARY_FALSE_FIELDS
} = require('../../runtime/external-review/validate-external-review-candidate');
const {
  createExternalReviewCandidateSubmissionManifest
} = require('../../runtime/external-review/create-external-review-candidate-submission-manifest');
const {
  SUBMISSION_DISPATCH_CANDIDATE_STATE,
  SUBMISSION_DISPATCH_CANDIDATE_PROTO,
  SUBMISSION_DISPATCH_CANDIDATE_KIND,
  SUBMISSION_DISPATCH_CANDIDATE_RECORDS,
  createExternalReviewCandidateSubmissionDispatchCandidate
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-candidate');

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
  candidate.external_submission_candidate_ref = 'rpecrc:external-submission-candidate:001';
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
    reviewer_conflict_check_state: 'NO_CONFLICT_ASSERTION_CREATED',
    review_package_context: reviewPackageContext()
  };
}

function submissionCandidateContext() {
  return {
    submission_candidate_id: 'submission:rpecrc:candidate:001',
    submission_candidate_version: '1.0',
    generated_at: '2026-09-22T13:55:00Z',
    submission_candidate_ref: 'submission:candidate:internal:001',
    submission_candidate_method: 'INTERNAL_TECHNICAL_PREPARATION_ONLY',
    submission_channel_state: 'NOT_SELECTED',
    submission_authorization_state: 'NOT_AUTHORIZED',
    reviewer_selection_context: reviewerSelectionContext()
  };
}

function submissionPackageContext() {
  return {
    submission_package_id: 'submission:rpecrc:package:001',
    submission_package_version: '1.0',
    generated_at: '2026-09-22T14:00:00Z',
    submission_package_ref: 'submission:package:internal:001',
    submission_package_method: 'INTERNAL_TECHNICAL_PACKAGING_ONLY',
    submission_channel_state: 'NOT_SELECTED',
    submission_authorization_state: 'NOT_AUTHORIZED',
    submission_candidate_context: submissionCandidateContext()
  };
}

function submissionManifestContext() {
  return {
    submission_manifest_id: 'submission:rpecrc:manifest:001',
    submission_manifest_version: '1.0',
    generated_at: '2026-09-22T14:05:00Z',
    submission_manifest_ref: 'submission:manifest:internal:001',
    submission_manifest_method: 'INTERNAL_TECHNICAL_MANIFESTING_ONLY',
    submission_manifest_material_state: 'INTERNAL_HASHED_PACKAGE_REFERENCES_ONLY',
    submission_channel_state: 'NOT_SELECTED',
    submission_authorization_state: 'NOT_AUTHORIZED',
    submission_package_context: submissionPackageContext()
  };
}

function submissionDispatchCandidateContext() {
  return {
    submission_dispatch_candidate_id: 'submission:rpecrc:dispatch-candidate:001',
    submission_dispatch_candidate_version: '1.0',
    generated_at: '2026-09-22T14:10:00Z',
    submission_dispatch_candidate_ref: 'submission:dispatch-candidate:internal:001',
    submission_dispatch_candidate_method: 'INTERNAL_TECHNICAL_DISPATCH_CANDIDATE_ONLY',
    submission_dispatch_route_state: 'NOT_SELECTED',
    submission_dispatch_authorization_state: 'NOT_AUTHORIZED',
    submission_channel_state: 'NOT_SELECTED',
    submission_authorization_state: 'NOT_AUTHORIZED',
    submission_manifest_context: submissionManifestContext()
  };
}

{
  const submissionManifest = createExternalReviewCandidateSubmissionManifest(baseCandidate(), submissionManifestContext());
  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(submissionManifest, submissionDispatchCandidateContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_CANDIDATE_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_SUBMISSION_DISPATCH_CANDIDATE_RECORDED');
  assert.equal(actual.submission_dispatch_candidate.proto, SUBMISSION_DISPATCH_CANDIDATE_PROTO);
  assert.equal(actual.submission_dispatch_candidate.kind, SUBMISSION_DISPATCH_CANDIDATE_KIND);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_id, 'submission:rpecrc:dispatch-candidate:001');
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_ref, 'submission:dispatch-candidate:internal:001');
  assert.equal(actual.submission_dispatch_candidate.submission_manifest_id, submissionManifest.submission_manifest.submission_manifest_id);
  assert.equal(actual.submission_dispatch_candidate.submission_manifest_sha256, submissionManifest.submission_manifest.submission_manifest_sha256);
  assert.equal(actual.submission_dispatch_candidate.submission_package_sha256, submissionManifest.submission_manifest.submission_package_sha256);
  assert.equal(actual.submission_dispatch_candidate.submission_candidate_sha256, submissionManifest.submission_manifest.submission_candidate_sha256);
  assert.equal(actual.submission_dispatch_candidate.reviewer_selection_sha256, submissionManifest.submission_manifest.reviewer_selection_sha256);
  assert.equal(actual.submission_dispatch_candidate.review_package_sha256, submissionManifest.submission_manifest.review_package_sha256);
  assert.equal(actual.submission_dispatch_candidate.audit_index_sha256, submissionManifest.submission_manifest.audit_index_sha256);
  assert.equal(actual.submission_dispatch_candidate.audit_manifest_sha256, submissionManifest.submission_manifest.audit_manifest_sha256);
  assert.equal(actual.submission_dispatch_candidate.audit_package_sha256, submissionManifest.submission_manifest.audit_package_sha256);
  assert.equal(actual.submission_dispatch_candidate.matrix_binding_sha256, submissionManifest.submission_manifest.matrix_binding_sha256);
  assert.equal(actual.submission_dispatch_candidate.evidence_sha256, submissionManifest.submission_manifest.evidence_sha256);
  assert.match(actual.submission_dispatch_candidate.submission_dispatch_candidate_sha256, /^[a-f0-9]{64}$/);
  assert.equal(actual.submission_dispatch_candidate.validation_state, 'VALID');
  assert.equal(actual.submission_dispatch_candidate.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_records_satisfied, true);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_RECORDED_FROM_SUBMISSION_MANIFEST');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(baseCandidate(), submissionDispatchCandidateContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_CANDIDATE_STATE.RECORDED);
  assert.equal(actual.submission_dispatch_candidate.validation_state, 'VALID');
  assert.equal(actual.submission_dispatch_candidate.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_RECORDED_FROM_CANDIDATE');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(candidate, submissionDispatchCandidateContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_CANDIDATE_STATE.RECORDED);
  assert.equal(actual.submission_dispatch_candidate.validation_state, 'INVALID');
  assert.equal(actual.submission_dispatch_candidate.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.submission_dispatch_candidate.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(candidate, submissionDispatchCandidateContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_CANDIDATE_STATE.RECORDED);
  assert.equal(actual.submission_dispatch_candidate.validation_state, 'INVALID');
  assert.equal(actual.submission_dispatch_candidate.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.submission_dispatch_candidate.submission_manifest_boundary_state, 'BLOCKED');
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_boundary_state, 'BLOCKED');
  assert.equal(actual.submission_dispatch_candidate.claims_not_created.legal_certification, false);
  assert.equal(actual.submission_dispatch_candidate.runtime_effects.legal_certification_created, false);
  assert.equal(actual.submission_dispatch_candidate.legal_certification_created, false);
  assert.equal(actual.submission_dispatch_candidate.external_review_submission_created, false);
  assert.equal(actual.submission_dispatch_candidate.external_submission_dispatched, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_BOUNDARY_BLOCKED_RECORDED');
}

{
  const submissionManifest = createExternalReviewCandidateSubmissionManifest(baseCandidate(), submissionManifestContext());

  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(submissionManifest, {
    generated_at: '2026-09-22T14:10:00Z'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_CANDIDATE_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_CANDIDATE_ID_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_ID_INVALID');
}

{
  const submissionManifest = createExternalReviewCandidateSubmissionManifest(baseCandidate(), submissionManifestContext());

  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(submissionManifest, {
    submission_dispatch_candidate_id: 'submission:rpecrc:dispatch-candidate:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_CANDIDATE_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_CANDIDATE_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchCandidate({ state: 'INVALID' }, submissionDispatchCandidateContext());

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_CANDIDATE_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_CANDIDATE_SUBMISSION_MANIFEST_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_SUBMISSION_MANIFEST_INVALID');
}

{
  const submissionManifest = createExternalReviewCandidateSubmissionManifest(baseCandidate(), submissionManifestContext());
  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(submissionManifest, submissionDispatchCandidateContext());

  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_record_count, SUBMISSION_DISPATCH_CANDIDATE_RECORDS.length);
  assert.deepEqual(
    actual.submission_dispatch_candidate.submission_dispatch_candidate_records.map(record => record.record_id),
    [
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-001',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-002',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-003',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-004',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-005',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-006',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-007',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-008',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-009',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-010',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-011'
    ]
  );
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_RECORDS');
}

{
  const submissionManifest = createExternalReviewCandidateSubmissionManifest(baseCandidate(), submissionManifestContext());
  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(submissionManifest, submissionDispatchCandidateContext());

  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_CANDIDATE_ONLY, true);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.INTERNAL_SUBMISSION_DISPATCH_CANDIDATE, true);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEWER_APPOINTMENT, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEW_SUBMISSION, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.EXTERNAL_SUBMISSION_DISPATCH, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.EXTERNAL_SUBMISSION_TRANSMISSION, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.EXTERNAL_SUBMISSION_ACCEPTANCE, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.LEGAL_CERTIFICATION, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.EIDAS_QUALIFICATION, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.OPC_ALLOW, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.DEPLOYMENT_SUCCESS, false);
  assert.equal(actual.submission_dispatch_candidate.submission_dispatch_candidate_scope.PRODUCTION_DEPLOYMENT, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_SCOPE_FALSE');
}

{
  const submissionManifest = createExternalReviewCandidateSubmissionManifest(baseCandidate(), submissionManifestContext());
  const actual = createExternalReviewCandidateSubmissionDispatchCandidate(submissionManifest, submissionDispatchCandidateContext());

  assert.equal(actual.submission_dispatch_candidate.external_reviewer_appointed, false);
  assert.equal(actual.submission_dispatch_candidate.external_review_execution_created, false);
  assert.equal(actual.submission_dispatch_candidate.external_review_opinion_created, false);
  assert.equal(actual.submission_dispatch_candidate.external_review_report_created, false);
  assert.equal(actual.submission_dispatch_candidate.external_review_submission_created, false);
  assert.equal(actual.submission_dispatch_candidate.external_review_publication_created, false);
  assert.equal(actual.submission_dispatch_candidate.external_submission_dispatched, false);
  assert.equal(actual.submission_dispatch_candidate.external_submission_transmitted, false);
  assert.equal(actual.submission_dispatch_candidate.external_submission_accepted, false);
  assert.equal(actual.submission_dispatch_candidate.external_submission_acknowledged, false);
  assert.equal(actual.submission_dispatch_candidate.legal_certification_created, false);
  assert.equal(actual.submission_dispatch_candidate.eidas_qualification_created, false);
  assert.equal(actual.submission_dispatch_candidate.opc_allow_created, false);
  assert.equal(actual.submission_dispatch_candidate.deployment_success_proven, false);
  assert.equal(actual.submission_dispatch_candidate.production_deployment_proven, false);
  assert.equal(actual.submission_dispatch_candidate.public_registry_mutated, false);
  assert.equal(actual.submission_dispatch_candidate.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_CANDIDATE_RUNTIME_EFFECTS_FALSE');
}
