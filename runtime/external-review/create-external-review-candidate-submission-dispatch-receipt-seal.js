'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_KIND,
  createExternalReviewCandidateSubmissionDispatchReceiptLedger
} = require('./create-external-review-candidate-submission-dispatch-receipt-ledger');

const SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE = Object.freeze({
  SEALED: 'SEALED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_SEAL_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-SEAL-v1';
const SUBMISSION_DISPATCH_RECEIPT_SEAL_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_SEAL';

const SUBMISSION_DISPATCH_RECEIPT_SEAL_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_SEAL_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_SEAL: true,
  INTERNAL_HASH_SEAL: true,
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

const SUBMISSION_DISPATCH_RECEIPT_SEAL_COMPONENTS = Object.freeze([
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-001',
    seal_component_name: 'Internal Submission Dispatch Receipt Ledger',
    ref_field: 'submission_dispatch_receipt_ledger_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-002',
    seal_component_name: 'Internal Submission Dispatch Receipt Register',
    ref_field: 'submission_dispatch_receipt_register_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-003',
    seal_component_name: 'Internal Submission Dispatch Receipt Index',
    ref_field: 'submission_dispatch_receipt_index_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-004',
    seal_component_name: 'Internal Submission Dispatch Receipt Manifest',
    ref_field: 'submission_dispatch_receipt_manifest_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-005',
    seal_component_name: 'Internal Submission Dispatch Receipt Package',
    ref_field: 'submission_dispatch_receipt_package_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-006',
    seal_component_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-007',
    seal_component_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-008',
    seal_component_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-009',
    seal_component_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-010',
    seal_component_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-011',
    seal_component_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-012',
    seal_component_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-013',
    seal_component_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-014',
    seal_component_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-015',
    seal_component_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-016',
    seal_component_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-017',
    seal_component_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-018',
    seal_component_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-019',
    seal_component_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-020',
    seal_component_name: 'Receipt Ledger Boundary State',
    ref_field: 'submission_dispatch_receipt_ledger_boundary_state'
  })
]);

const PRESERVED_FIELDS = Object.freeze([
  'submission_dispatch_receipt_ledger_id',
  'submission_dispatch_receipt_ledger_sha256',
  'submission_dispatch_receipt_ledger_ref',
  'submission_dispatch_receipt_ledger_material_state',
  'submission_dispatch_receipt_register_id',
  'submission_dispatch_receipt_register_sha256',
  'submission_dispatch_receipt_register_ref',
  'submission_dispatch_receipt_register_material_state',
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
  'submission_dispatch_receipt_register_record_count',
  'submission_dispatch_receipt_ledger_entry_count',
  'validator_test_count',
  'evidence_test_count',
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
  'submission_dispatch_receipt_register_boundary_state',
  'submission_dispatch_receipt_ledger_boundary_state',
  'claims_not_created',
  'runtime_effects'
]);

function result(state, reason, submissionDispatchReceiptSeal) {
  if (submissionDispatchReceiptSeal) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_seal: submissionDispatchReceiptSeal });
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

function isSubmissionDispatchReceiptLedgerBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_LEDGER_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_LEDGER_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_ledger_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_ledger_sha256)
  );
}

function resolveSubmissionDispatchReceiptLedger(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.RECORDED &&
    isSubmissionDispatchReceiptLedgerBody(source.submission_dispatch_receipt_ledger)
  ) {
    return source.submission_dispatch_receipt_ledger;
  }

  if (isSubmissionDispatchReceiptLedgerBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptLedgerResult = createExternalReviewCandidateSubmissionDispatchReceiptLedger(
    source,
    isPlainObject(context.submission_dispatch_receipt_ledger_context)
      ? context.submission_dispatch_receipt_ledger_context
      : {}
  );

  if (
    submissionDispatchReceiptLedgerResult.state !== SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.RECORDED ||
    !isSubmissionDispatchReceiptLedgerBody(submissionDispatchReceiptLedgerResult.submission_dispatch_receipt_ledger)
  ) {
    return null;
  }

  return submissionDispatchReceiptLedgerResult.submission_dispatch_receipt_ledger;
}

function submissionDispatchReceiptSealComponentsSatisfied(submissionDispatchReceiptLedger) {
  for (const component of SUBMISSION_DISPATCH_RECEIPT_SEAL_COMPONENTS) {
    if (!isNonEmptyString(submissionDispatchReceiptLedger[component.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptLedger) {
  return (
    isPlainObject(submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope) &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER_ONLY === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.APPEND_ONLY_INTERNAL_LEDGER === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptLedger) {
  return (
    submissionDispatchReceiptLedger.external_reviewer_appointed === false &&
    submissionDispatchReceiptLedger.external_review_execution_created === false &&
    submissionDispatchReceiptLedger.external_review_opinion_created === false &&
    submissionDispatchReceiptLedger.external_review_report_created === false &&
    submissionDispatchReceiptLedger.external_review_submission_created === false &&
    submissionDispatchReceiptLedger.external_review_publication_created === false &&
    submissionDispatchReceiptLedger.external_submission_dispatched === false &&
    submissionDispatchReceiptLedger.external_submission_transmitted === false &&
    submissionDispatchReceiptLedger.external_submission_accepted === false &&
    submissionDispatchReceiptLedger.external_submission_acknowledged === false &&
    submissionDispatchReceiptLedger.external_submission_receipt_created === false &&
    submissionDispatchReceiptLedger.external_submission_receipt_acknowledged === false &&
    submissionDispatchReceiptLedger.legal_certification_created === false &&
    submissionDispatchReceiptLedger.eidas_qualification_created === false &&
    submissionDispatchReceiptLedger.opc_allow_created === false &&
    submissionDispatchReceiptLedger.deployment_success_proven === false &&
    submissionDispatchReceiptLedger.production_deployment_proven === false &&
    submissionDispatchReceiptLedger.public_registry_mutated === false &&
    submissionDispatchReceiptLedger.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchReceiptSeal(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_seal_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptLedger = resolveSubmissionDispatchReceiptLedger(source, context);

  if (!submissionDispatchReceiptLedger) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER_INVALID'
    );
  }

  const componentsSatisfied = submissionDispatchReceiptSealComponentsSatisfied(submissionDispatchReceiptLedger);
  const preservedScope = scopePreserved(submissionDispatchReceiptLedger);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptLedger);
  const preservedBoundary = (
    componentsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_entries_satisfied === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_register_records_satisfied === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_index_entries_satisfied === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_manifest_entries_satisfied === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_package_records_satisfied === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_candidate_records_satisfied === true &&
    submissionDispatchReceiptLedger.submission_dispatch_envelope_records_satisfied === true &&
    submissionDispatchReceiptLedger.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchReceiptLedger.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchReceiptLedger.submission_manifest_records_satisfied === true &&
    submissionDispatchReceiptLedger.submission_package_records_satisfied === true &&
    submissionDispatchReceiptLedger.submission_candidate_records_satisfied === true &&
    submissionDispatchReceiptLedger.reviewer_selection_records_satisfied === true &&
    submissionDispatchReceiptLedger.review_package_sections_satisfied === true &&
    submissionDispatchReceiptLedger.index_entries_satisfied === true &&
    submissionDispatchReceiptLedger.manifest_entries_satisfied === true &&
    submissionDispatchReceiptLedger.audit_sections_satisfied === true &&
    submissionDispatchReceiptLedger.claims_not_created_preserved === true &&
    submissionDispatchReceiptLedger.runtime_effects_preserved === true &&
    submissionDispatchReceiptLedger.submission_dispatch_receipt_ledger_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptSealBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_SEAL_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_SEAL_KIND,
    submission_dispatch_receipt_seal_id: context.submission_dispatch_receipt_seal_id,
    submission_dispatch_receipt_seal_version: defaultString(context.submission_dispatch_receipt_seal_version, '1.0'),
    submission_dispatch_receipt_seal_state: SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.SEALED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_seal_scope: SUBMISSION_DISPATCH_RECEIPT_SEAL_SCOPE,
    submission_dispatch_receipt_seal_ref: defaultString(context.submission_dispatch_receipt_seal_ref, 'internal-submission-dispatch-receipt-seal:pending'),
    submission_dispatch_receipt_seal_method: defaultString(context.submission_dispatch_receipt_seal_method, 'INTERNAL_TECHNICAL_RECEIPT_HASH_SEAL_ONLY'),
    submission_dispatch_receipt_seal_material_state: defaultString(context.submission_dispatch_receipt_seal_material_state, 'INTERNAL_HASH_SEALED_RECEIPT_LEDGER_REFERENCES_ONLY')
  };

  for (const field of PRESERVED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(submissionDispatchReceiptLedger, field)) {
      submissionDispatchReceiptSealBody[field] = submissionDispatchReceiptLedger[field];
    }
  }

  submissionDispatchReceiptSealBody.submission_dispatch_receipt_ledger_proto = submissionDispatchReceiptLedger.proto;
  submissionDispatchReceiptSealBody.submission_dispatch_receipt_ledger_kind = submissionDispatchReceiptLedger.kind;
  submissionDispatchReceiptSealBody.submission_dispatch_receipt_seal_components = SUBMISSION_DISPATCH_RECEIPT_SEAL_COMPONENTS;
  submissionDispatchReceiptSealBody.submission_dispatch_receipt_seal_component_count = SUBMISSION_DISPATCH_RECEIPT_SEAL_COMPONENTS.length;
  submissionDispatchReceiptSealBody.submission_dispatch_receipt_seal_components_satisfied = componentsSatisfied;
  submissionDispatchReceiptSealBody.submission_dispatch_receipt_seal_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';
  submissionDispatchReceiptSealBody.external_reviewer_appointed = false;
  submissionDispatchReceiptSealBody.external_review_execution_created = false;
  submissionDispatchReceiptSealBody.external_review_opinion_created = false;
  submissionDispatchReceiptSealBody.external_review_report_created = false;
  submissionDispatchReceiptSealBody.external_review_submission_created = false;
  submissionDispatchReceiptSealBody.external_review_publication_created = false;
  submissionDispatchReceiptSealBody.external_submission_dispatched = false;
  submissionDispatchReceiptSealBody.external_submission_transmitted = false;
  submissionDispatchReceiptSealBody.external_submission_accepted = false;
  submissionDispatchReceiptSealBody.external_submission_acknowledged = false;
  submissionDispatchReceiptSealBody.external_submission_receipt_created = false;
  submissionDispatchReceiptSealBody.external_submission_receipt_acknowledged = false;
  submissionDispatchReceiptSealBody.legal_certification_created = false;
  submissionDispatchReceiptSealBody.eidas_qualification_created = false;
  submissionDispatchReceiptSealBody.opc_allow_created = false;
  submissionDispatchReceiptSealBody.deployment_success_proven = false;
  submissionDispatchReceiptSealBody.production_deployment_proven = false;
  submissionDispatchReceiptSealBody.public_registry_mutated = false;
  submissionDispatchReceiptSealBody.external_trust_registry_mutated = false;
  submissionDispatchReceiptSealBody.submission_dispatch_receipt_seal_sha256 = sha256Canonical(submissionDispatchReceiptSealBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.SEALED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_SEALED',
    deepFreeze(submissionDispatchReceiptSealBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_KIND,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptSeal
});
