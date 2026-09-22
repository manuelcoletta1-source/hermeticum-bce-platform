'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_ENVELOPE_STATE,
  SUBMISSION_DISPATCH_ENVELOPE_PROTO,
  SUBMISSION_DISPATCH_ENVELOPE_KIND,
  createExternalReviewCandidateSubmissionDispatchEnvelope
} = require('./create-external-review-candidate-submission-dispatch-envelope');

const SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-v1';
const SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE';

const SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE: true,
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

const SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-001',
    record_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-002',
    record_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-003',
    record_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-004',
    record_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-005',
    record_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-006',
    record_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-007',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-008',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-009',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-010',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-011',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-012',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-013',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CANDIDATE-RECORD-014',
    record_name: 'Boundary State',
    ref_field: 'submission_dispatch_envelope_boundary_state'
  })
]);

function result(state, reason, submissionDispatchReceiptCandidate) {
  if (submissionDispatchReceiptCandidate) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_candidate: submissionDispatchReceiptCandidate });
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

function isSubmissionDispatchEnvelopeBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_ENVELOPE_PROTO &&
    value.kind === SUBMISSION_DISPATCH_ENVELOPE_KIND &&
    isNonEmptyString(value.submission_dispatch_envelope_id) &&
    isNonEmptyString(value.submission_dispatch_envelope_sha256)
  );
}

function resolveSubmissionDispatchEnvelope(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_ENVELOPE_STATE.RECORDED &&
    isSubmissionDispatchEnvelopeBody(source.submission_dispatch_envelope)
  ) {
    return source.submission_dispatch_envelope;
  }

  if (isSubmissionDispatchEnvelopeBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchEnvelopeResult = createExternalReviewCandidateSubmissionDispatchEnvelope(
    source,
    isPlainObject(context.submission_dispatch_envelope_context)
      ? context.submission_dispatch_envelope_context
      : {}
  );

  if (
    submissionDispatchEnvelopeResult.state !== SUBMISSION_DISPATCH_ENVELOPE_STATE.RECORDED ||
    !isSubmissionDispatchEnvelopeBody(submissionDispatchEnvelopeResult.submission_dispatch_envelope)
  ) {
    return null;
  }

  return submissionDispatchEnvelopeResult.submission_dispatch_envelope;
}

function submissionDispatchReceiptCandidateRecordsSatisfied(submissionDispatchEnvelope) {
  for (const record of SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_RECORDS) {
    if (!isNonEmptyString(submissionDispatchEnvelope[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchEnvelope) {
  return (
    isPlainObject(submissionDispatchEnvelope.submission_dispatch_envelope_scope) &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_ENVELOPE_ONLY === true &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.INTERNAL_SUBMISSION_DISPATCH_ENVELOPE === true &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.OPC_ALLOW === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchEnvelope.submission_dispatch_envelope_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchEnvelope) {
  return (
    submissionDispatchEnvelope.external_reviewer_appointed === false &&
    submissionDispatchEnvelope.external_review_execution_created === false &&
    submissionDispatchEnvelope.external_review_opinion_created === false &&
    submissionDispatchEnvelope.external_review_report_created === false &&
    submissionDispatchEnvelope.external_review_submission_created === false &&
    submissionDispatchEnvelope.external_review_publication_created === false &&
    submissionDispatchEnvelope.external_submission_dispatched === false &&
    submissionDispatchEnvelope.external_submission_transmitted === false &&
    submissionDispatchEnvelope.external_submission_accepted === false &&
    submissionDispatchEnvelope.external_submission_acknowledged === false &&
    submissionDispatchEnvelope.legal_certification_created === false &&
    submissionDispatchEnvelope.eidas_qualification_created === false &&
    submissionDispatchEnvelope.opc_allow_created === false &&
    submissionDispatchEnvelope.deployment_success_proven === false &&
    submissionDispatchEnvelope.production_deployment_proven === false &&
    submissionDispatchEnvelope.public_registry_mutated === false &&
    submissionDispatchEnvelope.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchReceiptCandidate(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_candidate_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchEnvelope = resolveSubmissionDispatchEnvelope(source, context);

  if (!submissionDispatchEnvelope) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_SUBMISSION_DISPATCH_ENVELOPE_INVALID'
    );
  }

  const recordsSatisfied = submissionDispatchReceiptCandidateRecordsSatisfied(submissionDispatchEnvelope);
  const preservedScope = scopePreserved(submissionDispatchEnvelope);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchEnvelope);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchEnvelope.submission_dispatch_envelope_records_satisfied === true &&
    submissionDispatchEnvelope.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchEnvelope.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchEnvelope.submission_manifest_records_satisfied === true &&
    submissionDispatchEnvelope.submission_package_records_satisfied === true &&
    submissionDispatchEnvelope.submission_candidate_records_satisfied === true &&
    submissionDispatchEnvelope.reviewer_selection_records_satisfied === true &&
    submissionDispatchEnvelope.review_package_sections_satisfied === true &&
    submissionDispatchEnvelope.index_entries_satisfied === true &&
    submissionDispatchEnvelope.manifest_entries_satisfied === true &&
    submissionDispatchEnvelope.audit_sections_satisfied === true &&
    submissionDispatchEnvelope.claims_not_created_preserved === true &&
    submissionDispatchEnvelope.runtime_effects_preserved === true &&
    submissionDispatchEnvelope.submission_dispatch_envelope_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptCandidateBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_KIND,
    submission_dispatch_receipt_candidate_id: context.submission_dispatch_receipt_candidate_id,
    submission_dispatch_receipt_candidate_version: defaultString(context.submission_dispatch_receipt_candidate_version, '1.0'),
    submission_dispatch_receipt_candidate_state: SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_candidate_scope: SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_SCOPE,
    submission_dispatch_receipt_candidate_ref: defaultString(context.submission_dispatch_receipt_candidate_ref, 'internal-submission-dispatch-receipt-candidate:pending'),
    submission_dispatch_receipt_candidate_method: defaultString(context.submission_dispatch_receipt_candidate_method, 'INTERNAL_TECHNICAL_RECEIPT_CANDIDATE_ONLY'),
    submission_dispatch_receipt_candidate_material_state: defaultString(context.submission_dispatch_receipt_candidate_material_state, 'INTERNAL_HASHED_DISPATCH_ENVELOPE_REFERENCES_ONLY'),
    submission_dispatch_receipt_channel_state: defaultString(context.submission_dispatch_receipt_channel_state, 'NOT_SELECTED'),
    submission_dispatch_receipt_authorization_state: defaultString(context.submission_dispatch_receipt_authorization_state, 'NOT_AUTHORIZED'),
    submission_dispatch_receipt_acceptance_state: defaultString(context.submission_dispatch_receipt_acceptance_state, 'NOT_CREATED'),
    submission_dispatch_receipt_acknowledgement_state: defaultString(context.submission_dispatch_receipt_acknowledgement_state, 'NOT_CREATED'),
    submission_dispatch_route_state: defaultString(context.submission_dispatch_route_state, submissionDispatchEnvelope.submission_dispatch_route_state),
    submission_dispatch_authorization_state: defaultString(context.submission_dispatch_authorization_state, submissionDispatchEnvelope.submission_dispatch_authorization_state),
    submission_channel_state: defaultString(context.submission_channel_state, submissionDispatchEnvelope.submission_channel_state),
    submission_authorization_state: defaultString(context.submission_authorization_state, submissionDispatchEnvelope.submission_authorization_state),
    submission_dispatch_envelope_id: submissionDispatchEnvelope.submission_dispatch_envelope_id,
    submission_dispatch_envelope_sha256: submissionDispatchEnvelope.submission_dispatch_envelope_sha256,
    submission_dispatch_envelope_ref: submissionDispatchEnvelope.submission_dispatch_envelope_ref,
    submission_dispatch_envelope_proto: submissionDispatchEnvelope.proto,
    submission_dispatch_envelope_kind: submissionDispatchEnvelope.kind,
    submission_dispatch_envelope_material_state: submissionDispatchEnvelope.submission_dispatch_envelope_material_state,
    submission_dispatch_packet_id: submissionDispatchEnvelope.submission_dispatch_packet_id,
    submission_dispatch_packet_sha256: submissionDispatchEnvelope.submission_dispatch_packet_sha256,
    submission_dispatch_packet_ref: submissionDispatchEnvelope.submission_dispatch_packet_ref,
    submission_dispatch_candidate_id: submissionDispatchEnvelope.submission_dispatch_candidate_id,
    submission_dispatch_candidate_sha256: submissionDispatchEnvelope.submission_dispatch_candidate_sha256,
    submission_dispatch_candidate_ref: submissionDispatchEnvelope.submission_dispatch_candidate_ref,
    submission_manifest_id: submissionDispatchEnvelope.submission_manifest_id,
    submission_manifest_sha256: submissionDispatchEnvelope.submission_manifest_sha256,
    submission_manifest_ref: submissionDispatchEnvelope.submission_manifest_ref,
    submission_package_id: submissionDispatchEnvelope.submission_package_id,
    submission_package_sha256: submissionDispatchEnvelope.submission_package_sha256,
    submission_package_ref: submissionDispatchEnvelope.submission_package_ref,
    submission_candidate_id: submissionDispatchEnvelope.submission_candidate_id,
    submission_candidate_sha256: submissionDispatchEnvelope.submission_candidate_sha256,
    submission_candidate_ref: submissionDispatchEnvelope.submission_candidate_ref,
    reviewer_selection_id: submissionDispatchEnvelope.reviewer_selection_id,
    reviewer_selection_sha256: submissionDispatchEnvelope.reviewer_selection_sha256,
    reviewer_selection_ref: submissionDispatchEnvelope.reviewer_selection_ref,
    reviewer_candidate_ref: submissionDispatchEnvelope.reviewer_candidate_ref,
    reviewer_selection_method: submissionDispatchEnvelope.reviewer_selection_method,
    reviewer_independence_basis: submissionDispatchEnvelope.reviewer_independence_basis,
    reviewer_conflict_check_state: submissionDispatchEnvelope.reviewer_conflict_check_state,
    review_package_id: submissionDispatchEnvelope.review_package_id,
    review_package_sha256: submissionDispatchEnvelope.review_package_sha256,
    review_package_ref: submissionDispatchEnvelope.review_package_ref,
    audit_index_id: submissionDispatchEnvelope.audit_index_id,
    audit_index_sha256: submissionDispatchEnvelope.audit_index_sha256,
    audit_index_ref: submissionDispatchEnvelope.audit_index_ref,
    audit_manifest_id: submissionDispatchEnvelope.audit_manifest_id,
    audit_manifest_sha256: submissionDispatchEnvelope.audit_manifest_sha256,
    audit_manifest_ref: submissionDispatchEnvelope.audit_manifest_ref,
    audit_package_id: submissionDispatchEnvelope.audit_package_id,
    audit_package_sha256: submissionDispatchEnvelope.audit_package_sha256,
    audit_package_ref: submissionDispatchEnvelope.audit_package_ref,
    matrix_binding_id: submissionDispatchEnvelope.matrix_binding_id,
    matrix_binding_sha256: submissionDispatchEnvelope.matrix_binding_sha256,
    evidence_id: submissionDispatchEnvelope.evidence_id,
    evidence_sha256: submissionDispatchEnvelope.evidence_sha256,
    candidate_input_sha256: submissionDispatchEnvelope.candidate_input_sha256,
    validation_output_sha256: submissionDispatchEnvelope.validation_output_sha256,
    validation_state: submissionDispatchEnvelope.validation_state,
    validation_reason: submissionDispatchEnvelope.validation_reason,
    human_execution_control_external_review_candidate_state: submissionDispatchEnvelope.human_execution_control_external_review_candidate_state,
    lifecycle_state: submissionDispatchEnvelope.lifecycle_state,
    requirement_binding_count: submissionDispatchEnvelope.requirement_binding_count,
    audit_section_count: submissionDispatchEnvelope.audit_section_count,
    manifest_entry_count: submissionDispatchEnvelope.manifest_entry_count,
    index_entry_count: submissionDispatchEnvelope.index_entry_count,
    review_package_section_count: submissionDispatchEnvelope.review_package_section_count,
    reviewer_selection_record_count: submissionDispatchEnvelope.reviewer_selection_record_count,
    submission_candidate_record_count: submissionDispatchEnvelope.submission_candidate_record_count,
    submission_package_record_count: submissionDispatchEnvelope.submission_package_record_count,
    submission_manifest_record_count: submissionDispatchEnvelope.submission_manifest_record_count,
    submission_dispatch_candidate_record_count: submissionDispatchEnvelope.submission_dispatch_candidate_record_count,
    submission_dispatch_packet_record_count: submissionDispatchEnvelope.submission_dispatch_packet_record_count,
    submission_dispatch_envelope_record_count: submissionDispatchEnvelope.submission_dispatch_envelope_record_count,
    validator_test_count: submissionDispatchEnvelope.validator_test_count,
    evidence_test_count: submissionDispatchEnvelope.evidence_test_count,
    submission_dispatch_receipt_candidate_records: SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_RECORDS,
    submission_dispatch_receipt_candidate_record_count: SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_RECORDS.length,
    submission_dispatch_receipt_candidate_records_satisfied: recordsSatisfied,
    submission_dispatch_envelope_records_satisfied: submissionDispatchEnvelope.submission_dispatch_envelope_records_satisfied,
    submission_dispatch_packet_records_satisfied: submissionDispatchEnvelope.submission_dispatch_packet_records_satisfied,
    submission_dispatch_candidate_records_satisfied: submissionDispatchEnvelope.submission_dispatch_candidate_records_satisfied,
    submission_manifest_records_satisfied: submissionDispatchEnvelope.submission_manifest_records_satisfied,
    submission_package_records_satisfied: submissionDispatchEnvelope.submission_package_records_satisfied,
    submission_candidate_records_satisfied: submissionDispatchEnvelope.submission_candidate_records_satisfied,
    reviewer_selection_records_satisfied: submissionDispatchEnvelope.reviewer_selection_records_satisfied,
    review_package_sections_satisfied: submissionDispatchEnvelope.review_package_sections_satisfied,
    index_entries_satisfied: submissionDispatchEnvelope.index_entries_satisfied,
    manifest_entries_satisfied: submissionDispatchEnvelope.manifest_entries_satisfied,
    audit_sections_satisfied: submissionDispatchEnvelope.audit_sections_satisfied,
    claims_not_created_preserved: submissionDispatchEnvelope.claims_not_created_preserved,
    runtime_effects_preserved: submissionDispatchEnvelope.runtime_effects_preserved,
    boundary_flags_preserved: submissionDispatchEnvelope.boundary_flags_preserved,
    boundary_guard_state: submissionDispatchEnvelope.boundary_guard_state,
    matrix_boundary_state: submissionDispatchEnvelope.matrix_boundary_state,
    audit_boundary_state: submissionDispatchEnvelope.audit_boundary_state,
    manifest_boundary_state: submissionDispatchEnvelope.manifest_boundary_state,
    index_boundary_state: submissionDispatchEnvelope.index_boundary_state,
    review_package_boundary_state: submissionDispatchEnvelope.review_package_boundary_state,
    reviewer_selection_boundary_state: submissionDispatchEnvelope.reviewer_selection_boundary_state,
    submission_candidate_boundary_state: submissionDispatchEnvelope.submission_candidate_boundary_state,
    submission_package_boundary_state: submissionDispatchEnvelope.submission_package_boundary_state,
    submission_manifest_boundary_state: submissionDispatchEnvelope.submission_manifest_boundary_state,
    submission_dispatch_candidate_boundary_state: submissionDispatchEnvelope.submission_dispatch_candidate_boundary_state,
    submission_dispatch_packet_boundary_state: submissionDispatchEnvelope.submission_dispatch_packet_boundary_state,
    submission_dispatch_envelope_boundary_state: submissionDispatchEnvelope.submission_dispatch_envelope_boundary_state,
    submission_dispatch_receipt_candidate_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: submissionDispatchEnvelope.claims_not_created,
    runtime_effects: submissionDispatchEnvelope.runtime_effects,
    external_reviewer_appointed: false,
    external_review_execution_created: false,
    external_review_opinion_created: false,
    external_review_report_created: false,
    external_review_submission_created: false,
    external_review_publication_created: false,
    external_submission_dispatched: false,
    external_submission_transmitted: false,
    external_submission_accepted: false,
    external_submission_acknowledged: false,
    external_submission_receipt_created: false,
    external_submission_receipt_acknowledged: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false
  };

  submissionDispatchReceiptCandidateBody.submission_dispatch_receipt_candidate_sha256 = sha256Canonical(submissionDispatchReceiptCandidateBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_RECORDED',
    deepFreeze(submissionDispatchReceiptCandidateBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_KIND,
  SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_CANDIDATE_RECORDS,
  createExternalReviewCandidateSubmissionDispatchReceiptCandidate
});
