'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_KIND,
  createExternalReviewCandidateSubmissionDispatchReceiptCandidate
} = require('./create-external-review-candidate-submission-dispatch-receipt-candidate');

const SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_PACKAGE_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-v1';
const SUBMISSION_DISPATCH_RECEIPT_PACKAGE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_PACKAGE';

const SUBMISSION_DISPATCH_RECEIPT_PACKAGE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_PACKAGE: true,
  EXTERNAL_REVIEWER_APPOINTMENT: false,
  EXTERNAL_REVIEW_EXECUTION: false,
  EXTERNAL_REVIEW_OPINION: false,
  EXTERNAL_REVIEW_REPORT: false,
  EXTERNAL_REVIEW_SUBMISSION: false,
  EXTERNAL_REVIEW_PUBLICATION: false,
  EXTERNAL_SUBMISSION_DISPATCH: false,
  EXTERNAL_SUBMISSION_TRANSMISSION: false,
  EXTERNAL_SUBMISSION_ACCEPTANCE: false,
  EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT: false,
  EXTERNAL_SUBMISSION_RECEIPT: false,
  LEGAL_CERTIFICATION: false,
  EIDAS_QUALIFICATION: false,
  OPC_ALLOW: false,
  DEPLOYMENT_SUCCESS: false,
  PRODUCTION_DEPLOYMENT: false,
  PUBLIC_REGISTRY_MUTATION: false,
  EXTERNAL_TRUST_REGISTRY_MUTATION: false
});

const SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-001',
    record_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-002',
    record_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-003',
    record_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-004',
    record_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-005',
    record_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-006',
    record_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-007',
    record_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-008',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-009',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-010',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-011',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-012',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-013',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-014',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-PACKAGE-RECORD-015',
    record_name: 'Boundary State',
    ref_field: 'submission_dispatch_receipt_candidate_boundary_state'
  })
]);

const PRESERVED_FIELDS = Object.freeze([
  'submission_dispatch_receipt_candidate_id',
  'submission_dispatch_receipt_candidate_sha256',
  'submission_dispatch_receipt_candidate_ref',
  'submission_dispatch_receipt_candidate_material_state',
  'submission_dispatch_receipt_channel_state',
  'submission_dispatch_receipt_authorization_state',
  'submission_dispatch_receipt_acceptance_state',
  'submission_dispatch_receipt_acknowledgement_state',
  'submission_dispatch_route_state',
  'submission_dispatch_authorization_state',
  'submission_channel_state',
  'submission_authorization_state',
  'submission_dispatch_envelope_id',
  'submission_dispatch_envelope_sha256',
  'submission_dispatch_envelope_ref',
  'submission_dispatch_envelope_proto',
  'submission_dispatch_envelope_kind',
  'submission_dispatch_envelope_material_state',
  'submission_dispatch_packet_id',
  'submission_dispatch_packet_sha256',
  'submission_dispatch_packet_ref',
  'submission_dispatch_candidate_id',
  'submission_dispatch_candidate_sha256',
  'submission_dispatch_candidate_ref',
  'submission_manifest_id',
  'submission_manifest_sha256',
  'submission_manifest_ref',
  'submission_package_id',
  'submission_package_sha256',
  'submission_package_ref',
  'submission_candidate_id',
  'submission_candidate_sha256',
  'submission_candidate_ref',
  'reviewer_selection_id',
  'reviewer_selection_sha256',
  'reviewer_selection_ref',
  'reviewer_candidate_ref',
  'reviewer_selection_method',
  'reviewer_independence_basis',
  'reviewer_conflict_check_state',
  'review_package_id',
  'review_package_sha256',
  'review_package_ref',
  'audit_index_id',
  'audit_index_sha256',
  'audit_index_ref',
  'audit_manifest_id',
  'audit_manifest_sha256',
  'audit_manifest_ref',
  'audit_package_id',
  'audit_package_sha256',
  'audit_package_ref',
  'matrix_binding_id',
  'matrix_binding_sha256',
  'evidence_id',
  'evidence_sha256',
  'candidate_input_sha256',
  'validation_output_sha256',
  'validation_state',
  'validation_reason',
  'human_execution_control_external_review_candidate_state',
  'lifecycle_state',
  'requirement_binding_count',
  'audit_section_count',
  'manifest_entry_count',
  'index_entry_count',
  'review_package_section_count',
  'reviewer_selection_record_count',
  'submission_candidate_record_count',
  'submission_package_record_count',
  'submission_manifest_record_count',
  'submission_dispatch_candidate_record_count',
  'submission_dispatch_packet_record_count',
  'submission_dispatch_envelope_record_count',
  'submission_dispatch_receipt_candidate_record_count',
  'validator_test_count',
  'evidence_test_count',
  'submission_dispatch_receipt_candidate_records_satisfied',
  'submission_dispatch_envelope_records_satisfied',
  'submission_dispatch_packet_records_satisfied',
  'submission_dispatch_candidate_records_satisfied',
  'submission_manifest_records_satisfied',
  'submission_package_records_satisfied',
  'submission_candidate_records_satisfied',
  'reviewer_selection_records_satisfied',
  'review_package_sections_satisfied',
  'index_entries_satisfied',
  'manifest_entries_satisfied',
  'audit_sections_satisfied',
  'claims_not_created_preserved',
  'runtime_effects_preserved',
  'boundary_flags_preserved',
  'boundary_guard_state',
  'matrix_boundary_state',
  'audit_boundary_state',
  'manifest_boundary_state',
  'index_boundary_state',
  'review_package_boundary_state',
  'reviewer_selection_boundary_state',
  'submission_candidate_boundary_state',
  'submission_package_boundary_state',
  'submission_manifest_boundary_state',
  'submission_dispatch_candidate_boundary_state',
  'submission_dispatch_packet_boundary_state',
  'submission_dispatch_envelope_boundary_state',
  'submission_dispatch_receipt_candidate_boundary_state',
  'claims_not_created',
  'runtime_effects'
]);

function result(state, reason, submissionDispatchReceiptPackage) {
  if (submissionDispatchReceiptPackage) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_package: submissionDispatchReceiptPackage });
  }

  return Object.freeze({ state, reason });
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoDateTime(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

function deepFreeze(value) {
  if (!isPlainObject(value) && !Array.isArray(value)) {
    return value;
  }

  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }

  return Object.freeze(value);
}

function defaultString(value, fallback) {
  return isNonEmptyString(value) ? value : fallback;
}

function isSubmissionDispatchReceiptCandidateBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_candidate_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_candidate_sha256)
  );
}

function resolveSubmissionDispatchReceiptCandidate(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE.RECORDED &&
    isSubmissionDispatchReceiptCandidateBody(source.submission_dispatch_receipt_candidate)
  ) {
    return source.submission_dispatch_receipt_candidate;
  }

  if (isSubmissionDispatchReceiptCandidateBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptCandidateResult = createExternalReviewCandidateSubmissionDispatchReceiptCandidate(
    source,
    isPlainObject(context.submission_dispatch_receipt_candidate_context)
      ? context.submission_dispatch_receipt_candidate_context
      : {}
  );

  if (
    submissionDispatchReceiptCandidateResult.state !== SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE.RECORDED ||
    !isSubmissionDispatchReceiptCandidateBody(submissionDispatchReceiptCandidateResult.submission_dispatch_receipt_candidate)
  ) {
    return null;
  }

  return submissionDispatchReceiptCandidateResult.submission_dispatch_receipt_candidate;
}

function submissionDispatchReceiptPackageRecordsSatisfied(submissionDispatchReceiptCandidate) {
  for (const record of SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDS) {
    if (!isNonEmptyString(submissionDispatchReceiptCandidate[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptCandidate) {
  return (
    isPlainObject(submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope) &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_ONLY === true &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE === true &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptCandidate) {
  return (
    submissionDispatchReceiptCandidate.external_reviewer_appointed === false &&
    submissionDispatchReceiptCandidate.external_review_execution_created === false &&
    submissionDispatchReceiptCandidate.external_review_opinion_created === false &&
    submissionDispatchReceiptCandidate.external_review_report_created === false &&
    submissionDispatchReceiptCandidate.external_review_submission_created === false &&
    submissionDispatchReceiptCandidate.external_review_publication_created === false &&
    submissionDispatchReceiptCandidate.external_submission_dispatched === false &&
    submissionDispatchReceiptCandidate.external_submission_transmitted === false &&
    submissionDispatchReceiptCandidate.external_submission_accepted === false &&
    submissionDispatchReceiptCandidate.external_submission_acknowledged === false &&
    submissionDispatchReceiptCandidate.external_submission_receipt_created === false &&
    submissionDispatchReceiptCandidate.external_submission_receipt_acknowledged === false &&
    submissionDispatchReceiptCandidate.legal_certification_created === false &&
    submissionDispatchReceiptCandidate.eidas_qualification_created === false &&
    submissionDispatchReceiptCandidate.opc_allow_created === false &&
    submissionDispatchReceiptCandidate.deployment_success_proven === false &&
    submissionDispatchReceiptCandidate.production_deployment_proven === false &&
    submissionDispatchReceiptCandidate.public_registry_mutated === false &&
    submissionDispatchReceiptCandidate.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchReceiptPackage(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_package_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptCandidate = resolveSubmissionDispatchReceiptCandidate(source, context);

  if (!submissionDispatchReceiptCandidate) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_INVALID'
    );
  }

  const recordsSatisfied = submissionDispatchReceiptPackageRecordsSatisfied(submissionDispatchReceiptCandidate);
  const preservedScope = scopePreserved(submissionDispatchReceiptCandidate);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptCandidate);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_records_satisfied === true &&
    submissionDispatchReceiptCandidate.submission_dispatch_envelope_records_satisfied === true &&
    submissionDispatchReceiptCandidate.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchReceiptCandidate.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchReceiptCandidate.submission_manifest_records_satisfied === true &&
    submissionDispatchReceiptCandidate.submission_package_records_satisfied === true &&
    submissionDispatchReceiptCandidate.submission_candidate_records_satisfied === true &&
    submissionDispatchReceiptCandidate.reviewer_selection_records_satisfied === true &&
    submissionDispatchReceiptCandidate.review_package_sections_satisfied === true &&
    submissionDispatchReceiptCandidate.index_entries_satisfied === true &&
    submissionDispatchReceiptCandidate.manifest_entries_satisfied === true &&
    submissionDispatchReceiptCandidate.audit_sections_satisfied === true &&
    submissionDispatchReceiptCandidate.claims_not_created_preserved === true &&
    submissionDispatchReceiptCandidate.runtime_effects_preserved === true &&
    submissionDispatchReceiptCandidate.submission_dispatch_receipt_candidate_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptPackageBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_PACKAGE_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_PACKAGE_KIND,
    submission_dispatch_receipt_package_id: context.submission_dispatch_receipt_package_id,
    submission_dispatch_receipt_package_version: defaultString(context.submission_dispatch_receipt_package_version, '1.0'),
    submission_dispatch_receipt_package_state: SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_package_scope: SUBMISSION_DISPATCH_RECEIPT_PACKAGE_SCOPE,
    submission_dispatch_receipt_package_ref: defaultString(context.submission_dispatch_receipt_package_ref, 'internal-submission-dispatch-receipt-package:pending'),
    submission_dispatch_receipt_package_method: defaultString(context.submission_dispatch_receipt_package_method, 'INTERNAL_TECHNICAL_RECEIPT_PACKAGING_ONLY'),
    submission_dispatch_receipt_package_material_state: defaultString(context.submission_dispatch_receipt_package_material_state, 'INTERNAL_HASHED_RECEIPT_CANDIDATE_REFERENCES_ONLY')
  };

  for (const field of PRESERVED_FIELDS) {
    submissionDispatchReceiptPackageBody[field] = submissionDispatchReceiptCandidate[field];
  }

  submissionDispatchReceiptPackageBody.submission_dispatch_receipt_candidate_proto = submissionDispatchReceiptCandidate.proto;
  submissionDispatchReceiptPackageBody.submission_dispatch_receipt_candidate_kind = submissionDispatchReceiptCandidate.kind;
  submissionDispatchReceiptPackageBody.submission_dispatch_receipt_package_records = SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDS;
  submissionDispatchReceiptPackageBody.submission_dispatch_receipt_package_record_count = SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDS.length;
  submissionDispatchReceiptPackageBody.submission_dispatch_receipt_package_records_satisfied = recordsSatisfied;
  submissionDispatchReceiptPackageBody.submission_dispatch_receipt_package_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';
  submissionDispatchReceiptPackageBody.external_reviewer_appointed = false;
  submissionDispatchReceiptPackageBody.external_review_execution_created = false;
  submissionDispatchReceiptPackageBody.external_review_opinion_created = false;
  submissionDispatchReceiptPackageBody.external_review_report_created = false;
  submissionDispatchReceiptPackageBody.external_review_submission_created = false;
  submissionDispatchReceiptPackageBody.external_review_publication_created = false;
  submissionDispatchReceiptPackageBody.external_submission_dispatched = false;
  submissionDispatchReceiptPackageBody.external_submission_transmitted = false;
  submissionDispatchReceiptPackageBody.external_submission_accepted = false;
  submissionDispatchReceiptPackageBody.external_submission_acknowledged = false;
  submissionDispatchReceiptPackageBody.external_submission_receipt_created = false;
  submissionDispatchReceiptPackageBody.external_submission_receipt_acknowledged = false;
  submissionDispatchReceiptPackageBody.legal_certification_created = false;
  submissionDispatchReceiptPackageBody.eidas_qualification_created = false;
  submissionDispatchReceiptPackageBody.opc_allow_created = false;
  submissionDispatchReceiptPackageBody.deployment_success_proven = false;
  submissionDispatchReceiptPackageBody.production_deployment_proven = false;
  submissionDispatchReceiptPackageBody.public_registry_mutated = false;
  submissionDispatchReceiptPackageBody.external_trust_registry_mutated = false;
  submissionDispatchReceiptPackageBody.submission_dispatch_receipt_package_sha256 = sha256Canonical(submissionDispatchReceiptPackageBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDED',
    deepFreeze(submissionDispatchReceiptPackageBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_KIND,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_RECORDS,
  createExternalReviewCandidateSubmissionDispatchReceiptPackage
});
