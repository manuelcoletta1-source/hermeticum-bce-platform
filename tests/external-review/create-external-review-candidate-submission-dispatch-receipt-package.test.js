'use strict';

const assert = require('node:assert/strict');
const {
  REQUIRED_STRING_FIELDS,
  HASH_FIELDS,
  BOUNDARY_FALSE_FIELDS
} = require('../../runtime/external-review/validate-external-review-candidate');
const {
  createExternalReviewCandidateSubmissionDispatchReceiptCandidate
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-receipt-candidate');
const {
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_KIND,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDS,
  createExternalReviewCandidateSubmissionDispatchReceiptPackage
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-receipt-package');

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

function submissionDispatchPacketContext() {
  return {
    submission_dispatch_packet_id: 'submission:rpecrc:dispatch-packet:001',
    submission_dispatch_packet_version: '1.0',
    generated_at: '2026-09-22T14:15:00Z',
    submission_dispatch_packet_ref: 'submission:dispatch-packet:internal:001',
    submission_dispatch_packet_method: 'INTERNAL_TECHNICAL_PACKET_ASSEMBLY_ONLY',
    submission_dispatch_packet_material_state: 'INTERNAL_HASHED_DISPATCH_CANDIDATE_REFERENCES_ONLY',
    submission_dispatch_route_state: 'NOT_SELECTED',
    submission_dispatch_authorization_state: 'NOT_AUTHORIZED',
    submission_channel_state: 'NOT_SELECTED',
    submission_authorization_state: 'NOT_AUTHORIZED',
    submission_dispatch_candidate_context: submissionDispatchCandidateContext()
  };
}

function submissionDispatchEnvelopeContext() {
  return {
    submission_dispatch_envelope_id: 'submission:rpecrc:dispatch-envelope:001',
    submission_dispatch_envelope_version: '1.0',
    generated_at: '2026-09-22T14:20:00Z',
    submission_dispatch_envelope_ref: 'submission:dispatch-envelope:internal:001',
    submission_dispatch_envelope_method: 'INTERNAL_TECHNICAL_ENVELOPE_ASSEMBLY_ONLY',
    submission_dispatch_envelope_material_state: 'INTERNAL_HASHED_DISPATCH_PACKET_REFERENCES_ONLY',
    submission_dispatch_route_state: 'NOT_SELECTED',
    submission_dispatch_authorization_state: 'NOT_AUTHORIZED',
    submission_channel_state: 'NOT_SELECTED',
    submission_authorization_state: 'NOT_AUTHORIZED',
    submission_dispatch_packet_context: submissionDispatchPacketContext()
  };
}

function submissionDispatchReceiptCandidateContext() {
  return {
    submission_dispatch_receipt_candidate_id: 'submission:rpecrc:dispatch-receipt-candidate:001',
    submission_dispatch_receipt_candidate_version: '1.0',
    generated_at: '2026-09-22T14:25:00Z',
    submission_dispatch_receipt_candidate_ref: 'submission:dispatch-receipt-candidate:internal:001',
    submission_dispatch_receipt_candidate_method: 'INTERNAL_TECHNICAL_RECEIPT_CANDIDATE_ONLY',
    submission_dispatch_receipt_candidate_material_state: 'INTERNAL_HASHED_DISPATCH_ENVELOPE_REFERENCES_ONLY',
    submission_dispatch_receipt_channel_state: 'NOT_SELECTED',
    submission_dispatch_receipt_authorization_state: 'NOT_AUTHORIZED',
    submission_dispatch_receipt_acceptance_state: 'NOT_CREATED',
    submission_dispatch_receipt_acknowledgement_state: 'NOT_CREATED',
    submission_dispatch_route_state: 'NOT_SELECTED',
    submission_dispatch_authorization_state: 'NOT_AUTHORIZED',
    submission_channel_state: 'NOT_SELECTED',
    submission_authorization_state: 'NOT_AUTHORIZED',
    submission_dispatch_envelope_context: submissionDispatchEnvelopeContext()
  };
}

function submissionDispatchReceiptPackageContext() {
  return {
    submission_dispatch_receipt_package_id: 'submission:rpecrc:dispatch-receipt-package:001',
    submission_dispatch_receipt_package_version: '1.0',
    generated_at: '2026-09-22T14:30:00Z',
    submission_dispatch_receipt_package_ref: 'submission:dispatch-receipt-package:internal:001',
    submission_dispatch_receipt_package_method: 'INTERNAL_TECHNICAL_RECEIPT_PACKAGING_ONLY',
    submission_dispatch_receipt_package_material_state: 'INTERNAL_HASHED_RECEIPT_CANDIDATE_REFERENCES_ONLY',
    submission_dispatch_receipt_candidate_context: submissionDispatchReceiptCandidateContext()
  };
}

{
  const submissionDispatchReceiptCandidate = createExternalReviewCandidateSubmissionDispatchReceiptCandidate(
    baseCandidate(),
    submissionDispatchReceiptCandidateContext()
  );
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(
    submissionDispatchReceiptCandidate,
    submissionDispatchReceiptPackageContext()
  );

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDED');
  assert.equal(actual.submission_dispatch_receipt_package.proto, SUBMISSION_DISPATCH_RECEIPT_PACKAGE_PROTO);
  assert.equal(actual.submission_dispatch_receipt_package.kind, SUBMISSION_DISPATCH_RECEIPT_PACKAGE_KIND);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_id, 'submission:rpecrc:dispatch-receipt-package:001');
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_ref, 'submission:dispatch-receipt-package:internal:001');
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_candidate_id, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.submission_dispatch_receipt_candidate_id);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_candidate_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.submission_dispatch_receipt_candidate_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_envelope_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.submission_dispatch_envelope_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_packet_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.submission_dispatch_packet_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_candidate_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.submission_dispatch_candidate_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.submission_manifest_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.submission_manifest_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.submission_package_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.submission_package_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.submission_candidate_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.submission_candidate_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.reviewer_selection_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.reviewer_selection_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.review_package_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.review_package_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.audit_index_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.audit_index_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.audit_manifest_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.audit_manifest_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.audit_package_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.audit_package_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.matrix_binding_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.matrix_binding_sha256);
  assert.equal(actual.submission_dispatch_receipt_package.evidence_sha256, submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate.evidence_sha256);
  assert.match(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(actual.submission_dispatch_receipt_package.validation_state, 'VALID');
  assert.equal(actual.submission_dispatch_receipt_package.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_records_satisfied, true);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_boundary_state, 'PRESERVED');
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_receipt_created, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDED_FROM_RECEIPT_CANDIDATE');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(baseCandidate(), submissionDispatchReceiptPackageContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.RECORDED);
  assert.equal(actual.submission_dispatch_receipt_package.validation_state, 'VALID');
  assert.equal(actual.submission_dispatch_receipt_package.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDED_FROM_CANDIDATE');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(candidate, submissionDispatchReceiptPackageContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.RECORDED);
  assert.equal(actual.submission_dispatch_receipt_package.validation_state, 'INVALID');
  assert.equal(actual.submission_dispatch_receipt_package.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.submission_dispatch_receipt_package.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(candidate, submissionDispatchReceiptPackageContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.RECORDED);
  assert.equal(actual.submission_dispatch_receipt_package.validation_state, 'INVALID');
  assert.equal(actual.submission_dispatch_receipt_package.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_candidate_boundary_state, 'BLOCKED');
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_boundary_state, 'BLOCKED');
  assert.equal(actual.submission_dispatch_receipt_package.claims_not_created.legal_certification, false);
  assert.equal(actual.submission_dispatch_receipt_package.runtime_effects.legal_certification_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.legal_certification_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_review_submission_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_dispatched, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_receipt_created, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_BOUNDARY_BLOCKED_RECORDED');
}

{
  const submissionDispatchReceiptCandidate = createExternalReviewCandidateSubmissionDispatchReceiptCandidate(
    baseCandidate(),
    submissionDispatchReceiptCandidateContext()
  );

  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(submissionDispatchReceiptCandidate, {
    generated_at: '2026-09-22T14:30:00Z'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_ID_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_ID_INVALID');
}

{
  const submissionDispatchReceiptCandidate = createExternalReviewCandidateSubmissionDispatchReceiptCandidate(
    baseCandidate(),
    submissionDispatchReceiptCandidateContext()
  );

  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(submissionDispatchReceiptCandidate, {
    submission_dispatch_receipt_package_id: 'submission:rpecrc:dispatch-receipt-package:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage({ state: 'INVALID' }, submissionDispatchReceiptPackageContext());

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_INVALID');
}

{
  const submissionDispatchReceiptCandidate = createExternalReviewCandidateSubmissionDispatchReceiptCandidate(
    baseCandidate(),
    submissionDispatchReceiptCandidateContext()
  );
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(
    submissionDispatchReceiptCandidate,
    submissionDispatchReceiptPackageContext()
  );

  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_record_count, SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDS.length);
  assert.deepEqual(
    actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_records.map(record => record.record_id),
    [
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-001',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-002',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-003',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-004',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-005',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-006',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-007',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-008',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-009',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-010',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-011',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-012',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-013',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-014',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-015'
    ]
  );
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDS');
}

{
  const submissionDispatchReceiptCandidate = createExternalReviewCandidateSubmissionDispatchReceiptCandidate(
    baseCandidate(),
    submissionDispatchReceiptCandidateContext()
  );
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(
    submissionDispatchReceiptCandidate,
    submissionDispatchReceiptPackageContext()
  );

  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_ONLY, true);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_PACKAGE, true);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEWER_APPOINTMENT, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEW_SUBMISSION, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_DISPATCH, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_TRANSMISSION, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_ACCEPTANCE, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_RECEIPT, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.LEGAL_CERTIFICATION, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.EIDAS_QUALIFICATION, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.OPC_ALLOW, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.DEPLOYMENT_SUCCESS, false);
  assert.equal(actual.submission_dispatch_receipt_package.submission_dispatch_receipt_package_scope.PRODUCTION_DEPLOYMENT, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_SCOPE_FALSE');
}

{
  const submissionDispatchReceiptCandidate = createExternalReviewCandidateSubmissionDispatchReceiptCandidate(
    baseCandidate(),
    submissionDispatchReceiptCandidateContext()
  );
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptPackage(
    submissionDispatchReceiptCandidate,
    submissionDispatchReceiptPackageContext()
  );

  assert.equal(actual.submission_dispatch_receipt_package.external_reviewer_appointed, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_review_execution_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_review_opinion_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_review_report_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_review_submission_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_review_publication_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_dispatched, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_transmitted, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_accepted, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_acknowledged, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_receipt_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_submission_receipt_acknowledged, false);
  assert.equal(actual.submission_dispatch_receipt_package.legal_certification_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.eidas_qualification_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.opc_allow_created, false);
  assert.equal(actual.submission_dispatch_receipt_package.deployment_success_proven, false);
  assert.equal(actual.submission_dispatch_receipt_package.production_deployment_proven, false);
  assert.equal(actual.submission_dispatch_receipt_package.public_registry_mutated, false);
  assert.equal(actual.submission_dispatch_receipt_package.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RUNTIME_EFFECTS_FALSE');
}
