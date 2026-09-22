'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_PACKAGE_KIND,
  createExternalReviewCandidateSubmissionDispatchReceiptPackage
} = require('./create-external-review-candidate-submission-dispatch-receipt-package');

const SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_MANIFEST_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-v1';
const SUBMISSION_DISPATCH_RECEIPT_MANIFEST_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_MANIFEST';

const SUBMISSION_DISPATCH_RECEIPT_MANIFEST_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_MANIFEST_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_MANIFEST: true,
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

const SUBMISSION_DISPATCH_RECEIPT_MANIFEST_ENTRIES = Object.freeze([
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-001',
    entry_name: 'Internal Submission Dispatch Receipt Package',
    ref_field: 'submission_dispatch_receipt_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-002',
    entry_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-003',
    entry_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-004',
    entry_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-005',
    entry_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-006',
    entry_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-007',
    entry_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-008',
    entry_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-009',
    entry_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-010',
    entry_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-011',
    entry_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-012',
    entry_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-013',
    entry_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-014',
    entry_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-015',
    entry_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-MANIFEST-ENTRY-016',
    entry_name: 'Boundary State',
    ref_field: 'submission_dispatch_receipt_package_boundary_state'
  })
]);

const PRESERVED_FIELDS = Object.freeze([
  'submission_dispatch_receipt_package_id',
  'submission_dispatch_receipt_package_sha256',
  'submission_dispatch_receipt_package_ref',
  'submission_dispatch_receipt_package_method',
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
  'validator_test_count',
  'evidence_test_count',
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
  'claims_not_created',
  'runtime_effects'
]);

function result(state, reason, submissionDispatchReceiptManifest) {
  if (submissionDispatchReceiptManifest) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_manifest: submissionDispatchReceiptManifest });
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

function isSubmissionDispatchReceiptPackageBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_PACKAGE_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_PACKAGE_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_package_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_package_sha256)
  );
}

function resolveSubmissionDispatchReceiptPackage(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.RECORDED &&
    isSubmissionDispatchReceiptPackageBody(source.submission_dispatch_receipt_package)
  ) {
    return source.submission_dispatch_receipt_package;
  }

  if (isSubmissionDispatchReceiptPackageBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptPackageResult = createExternalReviewCandidateSubmissionDispatchReceiptPackage(
    source,
    isPlainObject(context.submission_dispatch_receipt_package_context)
      ? context.submission_dispatch_receipt_package_context
      : {}
  );

  if (
    submissionDispatchReceiptPackageResult.state !== SUBMISSION_DISPATCH_RECEIPT_PACKAGE_STATE.RECORDED ||
    !isSubmissionDispatchReceiptPackageBody(submissionDispatchReceiptPackageResult.submission_dispatch_receipt_package)
  ) {
    return null;
  }

  return submissionDispatchReceiptPackageResult.submission_dispatch_receipt_package;
}

function submissionDispatchReceiptManifestEntriesSatisfied(submissionDispatchReceiptPackage) {
  for (const entry of SUBMISSION_DISPATCH_RECEIPT_MANIFEST_ENTRIES) {
    if (!isNonEmptyString(submissionDispatchReceiptPackage[entry.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptPackage) {
  return (
    isPlainObject(submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope) &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_ONLY === true &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_PACKAGE === true &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptPackage) {
  return (
    submissionDispatchReceiptPackage.external_reviewer_appointed === false &&
    submissionDispatchReceiptPackage.external_review_execution_created === false &&
    submissionDispatchReceiptPackage.external_review_opinion_created === false &&
    submissionDispatchReceiptPackage.external_review_report_created === false &&
    submissionDispatchReceiptPackage.external_review_submission_created === false &&
    submissionDispatchReceiptPackage.external_review_publication_created === false &&
    submissionDispatchReceiptPackage.external_submission_dispatched === false &&
    submissionDispatchReceiptPackage.external_submission_transmitted === false &&
    submissionDispatchReceiptPackage.external_submission_accepted === false &&
    submissionDispatchReceiptPackage.external_submission_acknowledged === false &&
    submissionDispatchReceiptPackage.external_submission_receipt_created === false &&
    submissionDispatchReceiptPackage.external_submission_receipt_acknowledged === false &&
    submissionDispatchReceiptPackage.legal_certification_created === false &&
    submissionDispatchReceiptPackage.eidas_qualification_created === false &&
    submissionDispatchReceiptPackage.opc_allow_created === false &&
    submissionDispatchReceiptPackage.deployment_success_proven === false &&
    submissionDispatchReceiptPackage.production_deployment_proven === false &&
    submissionDispatchReceiptPackage.public_registry_mutated === false &&
    submissionDispatchReceiptPackage.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchReceiptManifest(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_manifest_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_MANIFEST_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_MANIFEST_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptPackage = resolveSubmissionDispatchReceiptPackage(source, context);

  if (!submissionDispatchReceiptPackage) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_MANIFEST_SUBMISSION_DISPATCH_RECEIPT_PACKAGE_INVALID'
    );
  }

  const entriesSatisfied = submissionDispatchReceiptManifestEntriesSatisfied(submissionDispatchReceiptPackage);
  const preservedScope = scopePreserved(submissionDispatchReceiptPackage);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptPackage);
  const preservedBoundary = (
    entriesSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_records_satisfied === true &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_candidate_records_satisfied === true &&
    submissionDispatchReceiptPackage.submission_dispatch_envelope_records_satisfied === true &&
    submissionDispatchReceiptPackage.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchReceiptPackage.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchReceiptPackage.submission_manifest_records_satisfied === true &&
    submissionDispatchReceiptPackage.submission_package_records_satisfied === true &&
    submissionDispatchReceiptPackage.submission_candidate_records_satisfied === true &&
    submissionDispatchReceiptPackage.reviewer_selection_records_satisfied === true &&
    submissionDispatchReceiptPackage.review_package_sections_satisfied === true &&
    submissionDispatchReceiptPackage.index_entries_satisfied === true &&
    submissionDispatchReceiptPackage.manifest_entries_satisfied === true &&
    submissionDispatchReceiptPackage.audit_sections_satisfied === true &&
    submissionDispatchReceiptPackage.claims_not_created_preserved === true &&
    submissionDispatchReceiptPackage.runtime_effects_preserved === true &&
    submissionDispatchReceiptPackage.submission_dispatch_receipt_package_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptManifestBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_MANIFEST_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_MANIFEST_KIND,
    submission_dispatch_receipt_manifest_id: context.submission_dispatch_receipt_manifest_id,
    submission_dispatch_receipt_manifest_version: defaultString(context.submission_dispatch_receipt_manifest_version, '1.0'),
    submission_dispatch_receipt_manifest_state: SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_manifest_scope: SUBMISSION_DISPATCH_RECEIPT_MANIFEST_SCOPE,
    submission_dispatch_receipt_manifest_ref: defaultString(context.submission_dispatch_receipt_manifest_ref, 'internal-submission-dispatch-receipt-manifest:pending'),
    submission_dispatch_receipt_manifest_method: defaultString(context.submission_dispatch_receipt_manifest_method, 'INTERNAL_TECHNICAL_RECEIPT_MANIFESTING_ONLY'),
    submission_dispatch_receipt_manifest_material_state: defaultString(context.submission_dispatch_receipt_manifest_material_state, 'INTERNAL_HASHED_RECEIPT_PACKAGE_REFERENCES_ONLY')
  };

  for (const field of PRESERVED_FIELDS) {
    submissionDispatchReceiptManifestBody[field] = submissionDispatchReceiptPackage[field];
  }

  submissionDispatchReceiptManifestBody.submission_dispatch_receipt_package_proto = submissionDispatchReceiptPackage.proto;
  submissionDispatchReceiptManifestBody.submission_dispatch_receipt_package_kind = submissionDispatchReceiptPackage.kind;
  submissionDispatchReceiptManifestBody.submission_dispatch_receipt_manifest_entries = SUBMISSION_DISPATCH_RECEIPT_MANIFEST_ENTRIES;
  submissionDispatchReceiptManifestBody.submission_dispatch_receipt_manifest_entry_count = SUBMISSION_DISPATCH_RECEIPT_MANIFEST_ENTRIES.length;
  submissionDispatchReceiptManifestBody.submission_dispatch_receipt_manifest_entries_satisfied = entriesSatisfied;
  submissionDispatchReceiptManifestBody.submission_dispatch_receipt_manifest_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';
  submissionDispatchReceiptManifestBody.external_reviewer_appointed = false;
  submissionDispatchReceiptManifestBody.external_review_execution_created = false;
  submissionDispatchReceiptManifestBody.external_review_opinion_created = false;
  submissionDispatchReceiptManifestBody.external_review_report_created = false;
  submissionDispatchReceiptManifestBody.external_review_submission_created = false;
  submissionDispatchReceiptManifestBody.external_review_publication_created = false;
  submissionDispatchReceiptManifestBody.external_submission_dispatched = false;
  submissionDispatchReceiptManifestBody.external_submission_transmitted = false;
  submissionDispatchReceiptManifestBody.external_submission_accepted = false;
  submissionDispatchReceiptManifestBody.external_submission_acknowledged = false;
  submissionDispatchReceiptManifestBody.external_submission_receipt_created = false;
  submissionDispatchReceiptManifestBody.external_submission_receipt_acknowledged = false;
  submissionDispatchReceiptManifestBody.legal_certification_created = false;
  submissionDispatchReceiptManifestBody.eidas_qualification_created = false;
  submissionDispatchReceiptManifestBody.opc_allow_created = false;
  submissionDispatchReceiptManifestBody.deployment_success_proven = false;
  submissionDispatchReceiptManifestBody.production_deployment_proven = false;
  submissionDispatchReceiptManifestBody.public_registry_mutated = false;
  submissionDispatchReceiptManifestBody.external_trust_registry_mutated = false;
  submissionDispatchReceiptManifestBody.submission_dispatch_receipt_manifest_sha256 = sha256Canonical(submissionDispatchReceiptManifestBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_MANIFEST_RECORDED',
    deepFreeze(submissionDispatchReceiptManifestBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_MANIFEST_STATE,
  SUBMISSION_DISPATCH_RECEIPT_MANIFEST_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_MANIFEST_KIND,
  SUBMISSION_DISPATCH_RECEIPT_MANIFEST_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_MANIFEST_ENTRIES,
  createExternalReviewCandidateSubmissionDispatchReceiptManifest
});
