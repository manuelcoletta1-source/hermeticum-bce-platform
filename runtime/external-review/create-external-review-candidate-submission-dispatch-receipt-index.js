'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE,
  SUBMISSION_DISPATCH_RECEIPT_MANIFEST_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_MANIFEST_KIND,
  createExternalReviewCandidateSubmissionDispatchReceiptManifest
} = require('./create-external-review-candidate-submission-dispatch-receipt-manifest');

const SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_INDEX_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-INDEX-v1';
const SUBMISSION_DISPATCH_RECEIPT_INDEX_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_INDEX';

const SUBMISSION_DISPATCH_RECEIPT_INDEX_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_INDEX_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_INDEX: true,
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

const SUBMISSION_DISPATCH_RECEIPT_INDEX_ENTRIES = Object.freeze([
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-001',
    entry_name: 'Internal Submission Dispatch Receipt Manifest',
    ref_field: 'submission_dispatch_receipt_manifest_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-002',
    entry_name: 'Internal Submission Dispatch Receipt Package',
    ref_field: 'submission_dispatch_receipt_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-003',
    entry_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-004',
    entry_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-005',
    entry_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-006',
    entry_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-007',
    entry_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-008',
    entry_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-009',
    entry_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-010',
    entry_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-011',
    entry_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-012',
    entry_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-013',
    entry_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-014',
    entry_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-015',
    entry_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-016',
    entry_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-INDEX-ENTRY-017',
    entry_name: 'Receipt Manifest Boundary State',
    ref_field: 'submission_dispatch_receipt_manifest_boundary_state'
  })
]);

const PRESERVED_FIELDS = Object.freeze([
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
  'validator_test_count',
  'evidence_test_count',
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
  'claims_not_created',
  'runtime_effects'
]);

function result(state, reason, submissionDispatchReceiptIndex) {
  if (submissionDispatchReceiptIndex) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_index: submissionDispatchReceiptIndex });
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

function isSubmissionDispatchReceiptManifestBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_MANIFEST_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_MANIFEST_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_manifest_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_manifest_sha256)
  );
}

function resolveSubmissionDispatchReceiptManifest(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE.RECORDED &&
    isSubmissionDispatchReceiptManifestBody(source.submission_dispatch_receipt_manifest)
  ) {
    return source.submission_dispatch_receipt_manifest;
  }

  if (isSubmissionDispatchReceiptManifestBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptManifestResult = createExternalReviewCandidateSubmissionDispatchReceiptManifest(
    source,
    isPlainObject(context.submission_dispatch_receipt_manifest_context)
      ? context.submission_dispatch_receipt_manifest_context
      : {}
  );

  if (
    submissionDispatchReceiptManifestResult.state !== SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE.RECORDED ||
    !isSubmissionDispatchReceiptManifestBody(submissionDispatchReceiptManifestResult.submission_dispatch_receipt_manifest)
  ) {
    return null;
  }

  return submissionDispatchReceiptManifestResult.submission_dispatch_receipt_manifest;
}

function submissionDispatchReceiptIndexEntriesSatisfied(submissionDispatchReceiptManifest) {
  for (const entry of SUBMISSION_DISPATCH_RECEIPT_INDEX_ENTRIES) {
    if (!isNonEmptyString(submissionDispatchReceiptManifest[entry.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptManifest) {
  return (
    isPlainObject(submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope) &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_MANIFEST_ONLY === true &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_MANIFEST === true &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptManifest) {
  return (
    submissionDispatchReceiptManifest.external_reviewer_appointed === false &&
    submissionDispatchReceiptManifest.external_review_execution_created === false &&
    submissionDispatchReceiptManifest.external_review_opinion_created === false &&
    submissionDispatchReceiptManifest.external_review_report_created === false &&
    submissionDispatchReceiptManifest.external_review_submission_created === false &&
    submissionDispatchReceiptManifest.external_review_publication_created === false &&
    submissionDispatchReceiptManifest.external_submission_dispatched === false &&
    submissionDispatchReceiptManifest.external_submission_transmitted === false &&
    submissionDispatchReceiptManifest.external_submission_accepted === false &&
    submissionDispatchReceiptManifest.external_submission_acknowledged === false &&
    submissionDispatchReceiptManifest.external_submission_receipt_created === false &&
    submissionDispatchReceiptManifest.external_submission_receipt_acknowledged === false &&
    submissionDispatchReceiptManifest.legal_certification_created === false &&
    submissionDispatchReceiptManifest.eidas_qualification_created === false &&
    submissionDispatchReceiptManifest.opc_allow_created === false &&
    submissionDispatchReceiptManifest.deployment_success_proven === false &&
    submissionDispatchReceiptManifest.production_deployment_proven === false &&
    submissionDispatchReceiptManifest.public_registry_mutated === false &&
    submissionDispatchReceiptManifest.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchReceiptIndex(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_index_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_INDEX_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_INDEX_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptManifest = resolveSubmissionDispatchReceiptManifest(source, context);

  if (!submissionDispatchReceiptManifest) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_INDEX_SUBMISSION_DISPATCH_RECEIPT_MANIFEST_INVALID'
    );
  }

  const entriesSatisfied = submissionDispatchReceiptIndexEntriesSatisfied(submissionDispatchReceiptManifest);
  const preservedScope = scopePreserved(submissionDispatchReceiptManifest);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptManifest);
  const preservedBoundary = (
    entriesSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_entries_satisfied === true &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_package_records_satisfied === true &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_candidate_records_satisfied === true &&
    submissionDispatchReceiptManifest.submission_dispatch_envelope_records_satisfied === true &&
    submissionDispatchReceiptManifest.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchReceiptManifest.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchReceiptManifest.submission_manifest_records_satisfied === true &&
    submissionDispatchReceiptManifest.submission_package_records_satisfied === true &&
    submissionDispatchReceiptManifest.submission_candidate_records_satisfied === true &&
    submissionDispatchReceiptManifest.reviewer_selection_records_satisfied === true &&
    submissionDispatchReceiptManifest.review_package_sections_satisfied === true &&
    submissionDispatchReceiptManifest.index_entries_satisfied === true &&
    submissionDispatchReceiptManifest.manifest_entries_satisfied === true &&
    submissionDispatchReceiptManifest.audit_sections_satisfied === true &&
    submissionDispatchReceiptManifest.claims_not_created_preserved === true &&
    submissionDispatchReceiptManifest.runtime_effects_preserved === true &&
    submissionDispatchReceiptManifest.submission_dispatch_receipt_manifest_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptIndexBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_INDEX_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_INDEX_KIND,
    submission_dispatch_receipt_index_id: context.submission_dispatch_receipt_index_id,
    submission_dispatch_receipt_index_version: defaultString(context.submission_dispatch_receipt_index_version, '1.0'),
    submission_dispatch_receipt_index_state: SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_index_scope: SUBMISSION_DISPATCH_RECEIPT_INDEX_SCOPE,
    submission_dispatch_receipt_index_ref: defaultString(context.submission_dispatch_receipt_index_ref, 'internal-submission-dispatch-receipt-index:pending'),
    submission_dispatch_receipt_index_method: defaultString(context.submission_dispatch_receipt_index_method, 'INTERNAL_TECHNICAL_RECEIPT_INDEXING_ONLY'),
    submission_dispatch_receipt_index_material_state: defaultString(context.submission_dispatch_receipt_index_material_state, 'INTERNAL_HASHED_RECEIPT_MANIFEST_REFERENCES_ONLY')
  };

  for (const field of PRESERVED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(submissionDispatchReceiptManifest, field)) {
      submissionDispatchReceiptIndexBody[field] = submissionDispatchReceiptManifest[field];
    }
  }

  submissionDispatchReceiptIndexBody.submission_dispatch_receipt_manifest_proto = submissionDispatchReceiptManifest.proto;
  submissionDispatchReceiptIndexBody.submission_dispatch_receipt_manifest_kind = submissionDispatchReceiptManifest.kind;
  submissionDispatchReceiptIndexBody.submission_dispatch_receipt_index_entries = SUBMISSION_DISPATCH_RECEIPT_INDEX_ENTRIES;
  submissionDispatchReceiptIndexBody.submission_dispatch_receipt_index_entry_count = SUBMISSION_DISPATCH_RECEIPT_INDEX_ENTRIES.length;
  submissionDispatchReceiptIndexBody.submission_dispatch_receipt_index_entries_satisfied = entriesSatisfied;
  submissionDispatchReceiptIndexBody.submission_dispatch_receipt_index_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';
  submissionDispatchReceiptIndexBody.external_reviewer_appointed = false;
  submissionDispatchReceiptIndexBody.external_review_execution_created = false;
  submissionDispatchReceiptIndexBody.external_review_opinion_created = false;
  submissionDispatchReceiptIndexBody.external_review_report_created = false;
  submissionDispatchReceiptIndexBody.external_review_submission_created = false;
  submissionDispatchReceiptIndexBody.external_review_publication_created = false;
  submissionDispatchReceiptIndexBody.external_submission_dispatched = false;
  submissionDispatchReceiptIndexBody.external_submission_transmitted = false;
  submissionDispatchReceiptIndexBody.external_submission_accepted = false;
  submissionDispatchReceiptIndexBody.external_submission_acknowledged = false;
  submissionDispatchReceiptIndexBody.external_submission_receipt_created = false;
  submissionDispatchReceiptIndexBody.external_submission_receipt_acknowledged = false;
  submissionDispatchReceiptIndexBody.legal_certification_created = false;
  submissionDispatchReceiptIndexBody.eidas_qualification_created = false;
  submissionDispatchReceiptIndexBody.opc_allow_created = false;
  submissionDispatchReceiptIndexBody.deployment_success_proven = false;
  submissionDispatchReceiptIndexBody.production_deployment_proven = false;
  submissionDispatchReceiptIndexBody.public_registry_mutated = false;
  submissionDispatchReceiptIndexBody.external_trust_registry_mutated = false;
  submissionDispatchReceiptIndexBody.submission_dispatch_receipt_index_sha256 = sha256Canonical(submissionDispatchReceiptIndexBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_INDEX_RECORDED',
    deepFreeze(submissionDispatchReceiptIndexBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_INDEX_STATE,
  SUBMISSION_DISPATCH_RECEIPT_INDEX_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_INDEX_KIND,
  SUBMISSION_DISPATCH_RECEIPT_INDEX_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_INDEX_ENTRIES,
  createExternalReviewCandidateSubmissionDispatchReceiptIndex
});
