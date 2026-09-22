'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_CLOSURE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_CLOSURE_KIND,
  createExternalReviewCandidateSubmissionDispatchReceiptClosure
} = require('./create-external-review-candidate-submission-dispatch-receipt-closure');

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE = Object.freeze({
  ARCHIVED: 'ARCHIVED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-v1';
const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE';

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE: true,
  INTERNAL_RECEIPT_CHAIN_ARCHIVE: true,
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

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_COMPONENTS = Object.freeze([
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-001',
    archive_component_name: 'Internal Submission Dispatch Receipt Closure',
    ref_field: 'submission_dispatch_receipt_closure_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-002',
    archive_component_name: 'Internal Submission Dispatch Receipt Seal',
    ref_field: 'submission_dispatch_receipt_seal_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-003',
    archive_component_name: 'Internal Submission Dispatch Receipt Ledger',
    ref_field: 'submission_dispatch_receipt_ledger_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-004',
    archive_component_name: 'Internal Submission Dispatch Receipt Register',
    ref_field: 'submission_dispatch_receipt_register_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-005',
    archive_component_name: 'Internal Submission Dispatch Receipt Index',
    ref_field: 'submission_dispatch_receipt_index_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-006',
    archive_component_name: 'Internal Submission Dispatch Receipt Manifest',
    ref_field: 'submission_dispatch_receipt_manifest_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-007',
    archive_component_name: 'Internal Submission Dispatch Receipt Package',
    ref_field: 'submission_dispatch_receipt_package_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-008',
    archive_component_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-009',
    archive_component_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-010',
    archive_component_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-011',
    archive_component_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-012',
    archive_component_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-013',
    archive_component_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-014',
    archive_component_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-015',
    archive_component_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-016',
    archive_component_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-017',
    archive_component_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-018',
    archive_component_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-019',
    archive_component_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-020',
    archive_component_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-021',
    archive_component_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    archive_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-COMPONENT-022',
    archive_component_name: 'Receipt Closure Boundary State',
    ref_field: 'submission_dispatch_receipt_closure_boundary_state'
  })
]);

const FALSE_RUNTIME_FIELDS = Object.freeze([
  'external_reviewer_appointed',
  'external_review_execution_created',
  'external_review_opinion_created',
  'external_review_report_created',
  'external_review_submission_created',
  'external_review_publication_created',
  'external_submission_dispatched',
  'external_submission_transmitted',
  'external_submission_accepted',
  'external_submission_acknowledged',
  'external_submission_receipt_created',
  'external_submission_receipt_acknowledged',
  'legal_certification_created',
  'eidas_qualification_created',
  'opc_allow_created',
  'deployment_success_proven',
  'production_deployment_proven',
  'public_registry_mutated',
  'external_trust_registry_mutated'
]);

const REQUIRED_SATISFIED_FIELDS = Object.freeze([
  'submission_dispatch_receipt_closure_components_satisfied',
  'submission_dispatch_receipt_seal_components_satisfied',
  'submission_dispatch_receipt_ledger_entries_satisfied',
  'submission_dispatch_receipt_register_records_satisfied',
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
  'runtime_effects_preserved'
]);

function result(state, reason, submissionDispatchReceiptArchive) {
  if (submissionDispatchReceiptArchive) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_archive: submissionDispatchReceiptArchive });
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

function isSubmissionDispatchReceiptClosureBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_CLOSURE_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_CLOSURE_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_closure_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_closure_sha256)
  );
}

function resolveSubmissionDispatchReceiptClosure(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE.CLOSED &&
    isSubmissionDispatchReceiptClosureBody(source.submission_dispatch_receipt_closure)
  ) {
    return source.submission_dispatch_receipt_closure;
  }

  if (isSubmissionDispatchReceiptClosureBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptClosureResult = createExternalReviewCandidateSubmissionDispatchReceiptClosure(
    source,
    isPlainObject(context.submission_dispatch_receipt_closure_context)
      ? context.submission_dispatch_receipt_closure_context
      : {}
  );

  if (
    submissionDispatchReceiptClosureResult.state !== SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE.CLOSED ||
    !isSubmissionDispatchReceiptClosureBody(submissionDispatchReceiptClosureResult.submission_dispatch_receipt_closure)
  ) {
    return null;
  }

  return submissionDispatchReceiptClosureResult.submission_dispatch_receipt_closure;
}

function submissionDispatchReceiptArchiveComponentsSatisfied(submissionDispatchReceiptClosure) {
  for (const component of SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_COMPONENTS) {
    if (!isNonEmptyString(submissionDispatchReceiptClosure[component.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptClosure) {
  return (
    isPlainObject(submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope) &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_CLOSURE_ONLY === true &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_CLOSURE === true &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.INTERNAL_RECEIPT_CHAIN_CLOSURE === true &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptClosure) {
  for (const field of FALSE_RUNTIME_FIELDS) {
    if (submissionDispatchReceiptClosure[field] !== false) {
      return false;
    }
  }

  return true;
}

function requiredSatisfiedFieldsPreserved(submissionDispatchReceiptClosure) {
  for (const field of REQUIRED_SATISFIED_FIELDS) {
    if (submissionDispatchReceiptClosure[field] !== true) {
      return false;
    }
  }

  return true;
}

function copyClosureFields(submissionDispatchReceiptArchiveBody, submissionDispatchReceiptClosure) {
  for (const [key, value] of Object.entries(submissionDispatchReceiptClosure)) {
    if (key === 'proto' || key === 'kind' || key === 'generated_at') {
      continue;
    }

    submissionDispatchReceiptArchiveBody[key] = value;
  }
}

function createExternalReviewCandidateSubmissionDispatchReceiptArchive(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_archive_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptClosure = resolveSubmissionDispatchReceiptClosure(source, context);

  if (!submissionDispatchReceiptClosure) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_SUBMISSION_DISPATCH_RECEIPT_CLOSURE_INVALID'
    );
  }

  const componentsSatisfied = submissionDispatchReceiptArchiveComponentsSatisfied(submissionDispatchReceiptClosure);
  const preservedScope = scopePreserved(submissionDispatchReceiptClosure);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptClosure);
  const preservedSatisfiedFields = requiredSatisfiedFieldsPreserved(submissionDispatchReceiptClosure);
  const preservedBoundary = (
    componentsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    preservedSatisfiedFields &&
    submissionDispatchReceiptClosure.submission_dispatch_receipt_closure_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptArchiveBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_KIND,
    submission_dispatch_receipt_archive_id: context.submission_dispatch_receipt_archive_id,
    submission_dispatch_receipt_archive_version: defaultString(context.submission_dispatch_receipt_archive_version, '1.0'),
    submission_dispatch_receipt_archive_state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE.ARCHIVED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_archive_scope: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_SCOPE,
    submission_dispatch_receipt_archive_ref: defaultString(context.submission_dispatch_receipt_archive_ref, 'internal-submission-dispatch-receipt-archive:pending'),
    submission_dispatch_receipt_archive_method: defaultString(context.submission_dispatch_receipt_archive_method, 'INTERNAL_TECHNICAL_RECEIPT_CHAIN_ARCHIVE_ONLY'),
    submission_dispatch_receipt_archive_material_state: defaultString(context.submission_dispatch_receipt_archive_material_state, 'INTERNAL_ARCHIVED_RECEIPT_CLOSURE_REFERENCES_ONLY')
  };

  copyClosureFields(submissionDispatchReceiptArchiveBody, submissionDispatchReceiptClosure);

  submissionDispatchReceiptArchiveBody.submission_dispatch_receipt_closure_proto = submissionDispatchReceiptClosure.proto;
  submissionDispatchReceiptArchiveBody.submission_dispatch_receipt_closure_kind = submissionDispatchReceiptClosure.kind;
  submissionDispatchReceiptArchiveBody.submission_dispatch_receipt_archive_components = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_COMPONENTS;
  submissionDispatchReceiptArchiveBody.submission_dispatch_receipt_archive_component_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_COMPONENTS.length;
  submissionDispatchReceiptArchiveBody.submission_dispatch_receipt_archive_components_satisfied = componentsSatisfied;
  submissionDispatchReceiptArchiveBody.submission_dispatch_receipt_archive_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';

  for (const field of FALSE_RUNTIME_FIELDS) {
    submissionDispatchReceiptArchiveBody[field] = false;
  }

  submissionDispatchReceiptArchiveBody.submission_dispatch_receipt_archive_sha256 = sha256Canonical(submissionDispatchReceiptArchiveBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE.ARCHIVED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_ARCHIVED',
    deepFreeze(submissionDispatchReceiptArchiveBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchive
});
