'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE,
  SUBMISSION_DISPATCH_RECEIPT_INDEX_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_INDEX_KIND,
  createExternalReviewCandidateSubmissionDispatchReceiptIndex
} = require('./create-external-review-candidate-submission-dispatch-receipt-index');

const SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_REGISTER_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-REGISTER-v1';
const SUBMISSION_DISPATCH_RECEIPT_REGISTER_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_REGISTER';

const SUBMISSION_DISPATCH_RECEIPT_REGISTER_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_REGISTER_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_REGISTER: true,
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

const SUBMISSION_DISPATCH_RECEIPT_REGISTER_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-001',
    record_name: 'Internal Submission Dispatch Receipt Index',
    ref_field: 'submission_dispatch_receipt_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-002',
    record_name: 'Internal Submission Dispatch Receipt Manifest',
    ref_field: 'submission_dispatch_receipt_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-003',
    record_name: 'Internal Submission Dispatch Receipt Package',
    ref_field: 'submission_dispatch_receipt_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-004',
    record_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-005',
    record_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-006',
    record_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-007',
    record_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-008',
    record_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-009',
    record_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-010',
    record_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-011',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-012',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-013',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-014',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-015',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-016',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-017',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-REGISTER-RECORD-018',
    record_name: 'Receipt Index Boundary State',
    ref_field: 'submission_dispatch_receipt_index_boundary_state'
  })
]);

const PRESERVED_FIELDS = Object.freeze([
  'submission_dispatch_receipt_index_id',
  'submission_dispatch_receipt_index_sha256',
  'submission_dispatch_receipt_index_ref',
  'submission_dispatch_receipt_index_material_state',
  'submission_dispatch_receipt_manifest_id',
  'submission_dispatch_receipt_manifest_sha256',
  'submission_dispatch_receipt_manifest_ref',
  'submission_dispatch_receipt_manifest_material_state',
  'submission_dispatch_receipt_package_id',
  'submission_dispatch_receipt_package_sha256',
  'submission_dispatch_receipt_package_ref',
  'submission_dispatch_receipt_package_material_state',
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
  'submission_dispatch_receipt_package_record_count',
  'submission_dispatch_receipt_manifest_entry_count',
  'submission_dispatch_receipt_index_entry_count',
  'validator_test_count',
  'evidence_test_count',
  'submission_dispatch_receipt_index_entries_satisfied',
  'submission_dispatch_receipt_manifest_entries_satisfied',
  'submission_dispatch_receipt_package_records_satisfied',
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
  'submission_dispatch_receipt_package_boundary_state',
  'submission_dispatch_receipt_manifest_boundary_state',
  'submission_dispatch_receipt_index_boundary_state',
  'claims_not_created',
  'runtime_effects'
]);

function result(state, reason, submissionDispatchReceiptRegister) {
  if (submissionDispatchReceiptRegister) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_register: submissionDispatchReceiptRegister });
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

function isSubmissionDispatchReceiptIndexBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_INDEX_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_INDEX_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_index_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_index_sha256)
  );
}

function resolveSubmissionDispatchReceiptIndex(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE.RECORDED &&
    isSubmissionDispatchReceiptIndexBody(source.submission_dispatch_receipt_index)
  ) {
    return source.submission_dispatch_receipt_index;
  }

  if (isSubmissionDispatchReceiptIndexBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptIndexResult = createExternalReviewCandidateSubmissionDispatchReceiptIndex(
    source,
    isPlainObject(context.submission_dispatch_receipt_index_context)
      ? context.submission_dispatch_receipt_index_context
      : {}
  );

  if (
    submissionDispatchReceiptIndexResult.state !== SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE.RECORDED ||
    !isSubmissionDispatchReceiptIndexBody(submissionDispatchReceiptIndexResult.submission_dispatch_receipt_index)
  ) {
    return null;
  }

  return submissionDispatchReceiptIndexResult.submission_dispatch_receipt_index;
}

function submissionDispatchReceiptRegisterRecordsSatisfied(submissionDispatchReceiptIndex) {
  for (const record of SUBMISSION_DISPATCH_RECEIPT_REGISTER_RECORDS) {
    if (!isNonEmptyString(submissionDispatchReceiptIndex[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptIndex) {
  return (
    isPlainObject(submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope) &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_INDEX_ONLY === true &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_INDEX === true &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptIndex) {
  return (
    submissionDispatchReceiptIndex.external_reviewer_appointed === false &&
    submissionDispatchReceiptIndex.external_review_execution_created === false &&
    submissionDispatchReceiptIndex.external_review_opinion_created === false &&
    submissionDispatchReceiptIndex.external_review_report_created === false &&
    submissionDispatchReceiptIndex.external_review_submission_created === false &&
    submissionDispatchReceiptIndex.external_review_publication_created === false &&
    submissionDispatchReceiptIndex.external_submission_dispatched === false &&
    submissionDispatchReceiptIndex.external_submission_transmitted === false &&
    submissionDispatchReceiptIndex.external_submission_accepted === false &&
    submissionDispatchReceiptIndex.external_submission_acknowledged === false &&
    submissionDispatchReceiptIndex.external_submission_receipt_created === false &&
    submissionDispatchReceiptIndex.external_submission_receipt_acknowledged === false &&
    submissionDispatchReceiptIndex.legal_certification_created === false &&
    submissionDispatchReceiptIndex.eidas_qualification_created === false &&
    submissionDispatchReceiptIndex.opc_allow_created === false &&
    submissionDispatchReceiptIndex.deployment_success_proven === false &&
    submissionDispatchReceiptIndex.production_deployment_proven === false &&
    submissionDispatchReceiptIndex.public_registry_mutated === false &&
    submissionDispatchReceiptIndex.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchReceiptRegister(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_register_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_REGISTER_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_REGISTER_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptIndex = resolveSubmissionDispatchReceiptIndex(source, context);

  if (!submissionDispatchReceiptIndex) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_REGISTER_SUBMISSION_DISPATCH_RECEIPT_INDEX_INVALID'
    );
  }

  const recordsSatisfied = submissionDispatchReceiptRegisterRecordsSatisfied(submissionDispatchReceiptIndex);
  const preservedScope = scopePreserved(submissionDispatchReceiptIndex);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptIndex);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_entries_satisfied === true &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_manifest_entries_satisfied === true &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_package_records_satisfied === true &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_candidate_records_satisfied === true &&
    submissionDispatchReceiptIndex.submission_dispatch_envelope_records_satisfied === true &&
    submissionDispatchReceiptIndex.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchReceiptIndex.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchReceiptIndex.submission_manifest_records_satisfied === true &&
    submissionDispatchReceiptIndex.submission_package_records_satisfied === true &&
    submissionDispatchReceiptIndex.submission_candidate_records_satisfied === true &&
    submissionDispatchReceiptIndex.reviewer_selection_records_satisfied === true &&
    submissionDispatchReceiptIndex.review_package_sections_satisfied === true &&
    submissionDispatchReceiptIndex.index_entries_satisfied === true &&
    submissionDispatchReceiptIndex.manifest_entries_satisfied === true &&
    submissionDispatchReceiptIndex.audit_sections_satisfied === true &&
    submissionDispatchReceiptIndex.claims_not_created_preserved === true &&
    submissionDispatchReceiptIndex.runtime_effects_preserved === true &&
    submissionDispatchReceiptIndex.submission_dispatch_receipt_index_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptRegisterBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_REGISTER_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_REGISTER_KIND,
    submission_dispatch_receipt_register_id: context.submission_dispatch_receipt_register_id,
    submission_dispatch_receipt_register_version: defaultString(context.submission_dispatch_receipt_register_version, '1.0'),
    submission_dispatch_receipt_register_state: SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_register_scope: SUBMISSION_DISPATCH_RECEIPT_REGISTER_SCOPE,
    submission_dispatch_receipt_register_ref: defaultString(context.submission_dispatch_receipt_register_ref, 'internal-submission-dispatch-receipt-register:pending'),
    submission_dispatch_receipt_register_method: defaultString(context.submission_dispatch_receipt_register_method, 'INTERNAL_TECHNICAL_RECEIPT_REGISTRATION_ONLY'),
    submission_dispatch_receipt_register_material_state: defaultString(context.submission_dispatch_receipt_register_material_state, 'INTERNAL_HASHED_RECEIPT_INDEX_REFERENCES_ONLY')
  };

  for (const field of PRESERVED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(submissionDispatchReceiptIndex, field)) {
      submissionDispatchReceiptRegisterBody[field] = submissionDispatchReceiptIndex[field];
    }
  }

  submissionDispatchReceiptRegisterBody.submission_dispatch_receipt_index_proto = submissionDispatchReceiptIndex.proto;
  submissionDispatchReceiptRegisterBody.submission_dispatch_receipt_index_kind = submissionDispatchReceiptIndex.kind;
  submissionDispatchReceiptRegisterBody.submission_dispatch_receipt_register_records = SUBMISSION_DISPATCH_RECEIPT_REGISTER_RECORDS;
  submissionDispatchReceiptRegisterBody.submission_dispatch_receipt_register_record_count = SUBMISSION_DISPATCH_RECEIPT_REGISTER_RECORDS.length;
  submissionDispatchReceiptRegisterBody.submission_dispatch_receipt_register_records_satisfied = recordsSatisfied;
  submissionDispatchReceiptRegisterBody.submission_dispatch_receipt_register_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';
  submissionDispatchReceiptRegisterBody.external_reviewer_appointed = false;
  submissionDispatchReceiptRegisterBody.external_review_execution_created = false;
  submissionDispatchReceiptRegisterBody.external_review_opinion_created = false;
  submissionDispatchReceiptRegisterBody.external_review_report_created = false;
  submissionDispatchReceiptRegisterBody.external_review_submission_created = false;
  submissionDispatchReceiptRegisterBody.external_review_publication_created = false;
  submissionDispatchReceiptRegisterBody.external_submission_dispatched = false;
  submissionDispatchReceiptRegisterBody.external_submission_transmitted = false;
  submissionDispatchReceiptRegisterBody.external_submission_accepted = false;
  submissionDispatchReceiptRegisterBody.external_submission_acknowledged = false;
  submissionDispatchReceiptRegisterBody.external_submission_receipt_created = false;
  submissionDispatchReceiptRegisterBody.external_submission_receipt_acknowledged = false;
  submissionDispatchReceiptRegisterBody.legal_certification_created = false;
  submissionDispatchReceiptRegisterBody.eidas_qualification_created = false;
  submissionDispatchReceiptRegisterBody.opc_allow_created = false;
  submissionDispatchReceiptRegisterBody.deployment_success_proven = false;
  submissionDispatchReceiptRegisterBody.production_deployment_proven = false;
  submissionDispatchReceiptRegisterBody.public_registry_mutated = false;
  submissionDispatchReceiptRegisterBody.external_trust_registry_mutated = false;
  submissionDispatchReceiptRegisterBody.submission_dispatch_receipt_register_sha256 = sha256Canonical(submissionDispatchReceiptRegisterBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_REGISTER_RECORDED',
    deepFreeze(submissionDispatchReceiptRegisterBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_REGISTER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_REGISTER_KIND,
  SUBMISSION_DISPATCH_RECEIPT_REGISTER_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_REGISTER_RECORDS,
  createExternalReviewCandidateSubmissionDispatchReceiptRegister
});
