'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_REGISTER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_REGISTER_KIND,
  createExternalReviewCandidateSubmissionDispatchReceiptRegister
} = require('./create-external-review-candidate-submission-dispatch-receipt-register');

const SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_LEDGER_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-LEDGER-v1';
const SUBMISSION_DISPATCH_RECEIPT_LEDGER_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER';

const SUBMISSION_DISPATCH_RECEIPT_LEDGER_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER: true,
  APPEND_ONLY_INTERNAL_LEDGER: true,
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

const SUBMISSION_DISPATCH_RECEIPT_LEDGER_ENTRIES = Object.freeze([
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-001',
    ledger_entry_name: 'Internal Submission Dispatch Receipt Register',
    ref_field: 'submission_dispatch_receipt_register_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-002',
    ledger_entry_name: 'Internal Submission Dispatch Receipt Index',
    ref_field: 'submission_dispatch_receipt_index_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-003',
    ledger_entry_name: 'Internal Submission Dispatch Receipt Manifest',
    ref_field: 'submission_dispatch_receipt_manifest_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-004',
    ledger_entry_name: 'Internal Submission Dispatch Receipt Package',
    ref_field: 'submission_dispatch_receipt_package_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-005',
    ledger_entry_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-006',
    ledger_entry_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-007',
    ledger_entry_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-008',
    ledger_entry_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-009',
    ledger_entry_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-010',
    ledger_entry_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-011',
    ledger_entry_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-012',
    ledger_entry_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-013',
    ledger_entry_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-014',
    ledger_entry_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-015',
    ledger_entry_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-016',
    ledger_entry_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-017',
    ledger_entry_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-018',
    ledger_entry_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    ledger_entry_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-LEDGER-ENTRY-019',
    ledger_entry_name: 'Receipt Register Boundary State',
    ref_field: 'submission_dispatch_receipt_register_boundary_state'
  })
]);

const PRESERVED_FIELDS = Object.freeze([
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
  'validator_test_count',
  'evidence_test_count',
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
  'claims_not_created',
  'runtime_effects'
]);

function result(state, reason, submissionDispatchReceiptLedger) {
  if (submissionDispatchReceiptLedger) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_ledger: submissionDispatchReceiptLedger });
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

function isSubmissionDispatchReceiptRegisterBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_REGISTER_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_REGISTER_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_register_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_register_sha256)
  );
}

function resolveSubmissionDispatchReceiptRegister(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE.RECORDED &&
    isSubmissionDispatchReceiptRegisterBody(source.submission_dispatch_receipt_register)
  ) {
    return source.submission_dispatch_receipt_register;
  }

  if (isSubmissionDispatchReceiptRegisterBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptRegisterResult = createExternalReviewCandidateSubmissionDispatchReceiptRegister(
    source,
    isPlainObject(context.submission_dispatch_receipt_register_context)
      ? context.submission_dispatch_receipt_register_context
      : {}
  );

  if (
    submissionDispatchReceiptRegisterResult.state !== SUBMISSION_DISPATCH_RECEIPT_REGISTER_STATE.RECORDED ||
    !isSubmissionDispatchReceiptRegisterBody(submissionDispatchReceiptRegisterResult.submission_dispatch_receipt_register)
  ) {
    return null;
  }

  return submissionDispatchReceiptRegisterResult.submission_dispatch_receipt_register;
}

function submissionDispatchReceiptLedgerEntriesSatisfied(submissionDispatchReceiptRegister) {
  for (const entry of SUBMISSION_DISPATCH_RECEIPT_LEDGER_ENTRIES) {
    if (!isNonEmptyString(submissionDispatchReceiptRegister[entry.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptRegister) {
  return (
    isPlainObject(submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope) &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_REGISTER_ONLY === true &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_REGISTER === true &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptRegister) {
  return (
    submissionDispatchReceiptRegister.external_reviewer_appointed === false &&
    submissionDispatchReceiptRegister.external_review_execution_created === false &&
    submissionDispatchReceiptRegister.external_review_opinion_created === false &&
    submissionDispatchReceiptRegister.external_review_report_created === false &&
    submissionDispatchReceiptRegister.external_review_submission_created === false &&
    submissionDispatchReceiptRegister.external_review_publication_created === false &&
    submissionDispatchReceiptRegister.external_submission_dispatched === false &&
    submissionDispatchReceiptRegister.external_submission_transmitted === false &&
    submissionDispatchReceiptRegister.external_submission_accepted === false &&
    submissionDispatchReceiptRegister.external_submission_acknowledged === false &&
    submissionDispatchReceiptRegister.external_submission_receipt_created === false &&
    submissionDispatchReceiptRegister.external_submission_receipt_acknowledged === false &&
    submissionDispatchReceiptRegister.legal_certification_created === false &&
    submissionDispatchReceiptRegister.eidas_qualification_created === false &&
    submissionDispatchReceiptRegister.opc_allow_created === false &&
    submissionDispatchReceiptRegister.deployment_success_proven === false &&
    submissionDispatchReceiptRegister.production_deployment_proven === false &&
    submissionDispatchReceiptRegister.public_registry_mutated === false &&
    submissionDispatchReceiptRegister.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchReceiptLedger(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_ledger_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_LEDGER_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_LEDGER_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptRegister = resolveSubmissionDispatchReceiptRegister(source, context);

  if (!submissionDispatchReceiptRegister) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_LEDGER_SUBMISSION_DISPATCH_RECEIPT_REGISTER_INVALID'
    );
  }

  const entriesSatisfied = submissionDispatchReceiptLedgerEntriesSatisfied(submissionDispatchReceiptRegister);
  const preservedScope = scopePreserved(submissionDispatchReceiptRegister);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptRegister);
  const preservedBoundary = (
    entriesSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_records_satisfied === true &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_index_entries_satisfied === true &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_manifest_entries_satisfied === true &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_package_records_satisfied === true &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_candidate_records_satisfied === true &&
    submissionDispatchReceiptRegister.submission_dispatch_envelope_records_satisfied === true &&
    submissionDispatchReceiptRegister.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchReceiptRegister.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchReceiptRegister.submission_manifest_records_satisfied === true &&
    submissionDispatchReceiptRegister.submission_package_records_satisfied === true &&
    submissionDispatchReceiptRegister.submission_candidate_records_satisfied === true &&
    submissionDispatchReceiptRegister.reviewer_selection_records_satisfied === true &&
    submissionDispatchReceiptRegister.review_package_sections_satisfied === true &&
    submissionDispatchReceiptRegister.index_entries_satisfied === true &&
    submissionDispatchReceiptRegister.manifest_entries_satisfied === true &&
    submissionDispatchReceiptRegister.audit_sections_satisfied === true &&
    submissionDispatchReceiptRegister.claims_not_created_preserved === true &&
    submissionDispatchReceiptRegister.runtime_effects_preserved === true &&
    submissionDispatchReceiptRegister.submission_dispatch_receipt_register_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptLedgerBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_LEDGER_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_LEDGER_KIND,
    submission_dispatch_receipt_ledger_id: context.submission_dispatch_receipt_ledger_id,
    submission_dispatch_receipt_ledger_version: defaultString(context.submission_dispatch_receipt_ledger_version, '1.0'),
    submission_dispatch_receipt_ledger_state: SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_ledger_scope: SUBMISSION_DISPATCH_RECEIPT_LEDGER_SCOPE,
    submission_dispatch_receipt_ledger_ref: defaultString(context.submission_dispatch_receipt_ledger_ref, 'internal-submission-dispatch-receipt-ledger:pending'),
    submission_dispatch_receipt_ledger_method: defaultString(context.submission_dispatch_receipt_ledger_method, 'INTERNAL_TECHNICAL_RECEIPT_LEDGERING_ONLY'),
    submission_dispatch_receipt_ledger_material_state: defaultString(context.submission_dispatch_receipt_ledger_material_state, 'INTERNAL_APPEND_ONLY_HASHED_RECEIPT_REGISTER_REFERENCES_ONLY')
  };

  for (const field of PRESERVED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(submissionDispatchReceiptRegister, field)) {
      submissionDispatchReceiptLedgerBody[field] = submissionDispatchReceiptRegister[field];
    }
  }

  submissionDispatchReceiptLedgerBody.submission_dispatch_receipt_register_proto = submissionDispatchReceiptRegister.proto;
  submissionDispatchReceiptLedgerBody.submission_dispatch_receipt_register_kind = submissionDispatchReceiptRegister.kind;
  submissionDispatchReceiptLedgerBody.submission_dispatch_receipt_ledger_entries = SUBMISSION_DISPATCH_RECEIPT_LEDGER_ENTRIES;
  submissionDispatchReceiptLedgerBody.submission_dispatch_receipt_ledger_entry_count = SUBMISSION_DISPATCH_RECEIPT_LEDGER_ENTRIES.length;
  submissionDispatchReceiptLedgerBody.submission_dispatch_receipt_ledger_entries_satisfied = entriesSatisfied;
  submissionDispatchReceiptLedgerBody.submission_dispatch_receipt_ledger_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';
  submissionDispatchReceiptLedgerBody.external_reviewer_appointed = false;
  submissionDispatchReceiptLedgerBody.external_review_execution_created = false;
  submissionDispatchReceiptLedgerBody.external_review_opinion_created = false;
  submissionDispatchReceiptLedgerBody.external_review_report_created = false;
  submissionDispatchReceiptLedgerBody.external_review_submission_created = false;
  submissionDispatchReceiptLedgerBody.external_review_publication_created = false;
  submissionDispatchReceiptLedgerBody.external_submission_dispatched = false;
  submissionDispatchReceiptLedgerBody.external_submission_transmitted = false;
  submissionDispatchReceiptLedgerBody.external_submission_accepted = false;
  submissionDispatchReceiptLedgerBody.external_submission_acknowledged = false;
  submissionDispatchReceiptLedgerBody.external_submission_receipt_created = false;
  submissionDispatchReceiptLedgerBody.external_submission_receipt_acknowledged = false;
  submissionDispatchReceiptLedgerBody.legal_certification_created = false;
  submissionDispatchReceiptLedgerBody.eidas_qualification_created = false;
  submissionDispatchReceiptLedgerBody.opc_allow_created = false;
  submissionDispatchReceiptLedgerBody.deployment_success_proven = false;
  submissionDispatchReceiptLedgerBody.production_deployment_proven = false;
  submissionDispatchReceiptLedgerBody.public_registry_mutated = false;
  submissionDispatchReceiptLedgerBody.external_trust_registry_mutated = false;
  submissionDispatchReceiptLedgerBody.submission_dispatch_receipt_ledger_sha256 = sha256Canonical(submissionDispatchReceiptLedgerBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_LEDGER_RECORDED',
    deepFreeze(submissionDispatchReceiptLedgerBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_KIND,
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_ENTRIES,
  createExternalReviewCandidateSubmissionDispatchReceiptLedger
});
