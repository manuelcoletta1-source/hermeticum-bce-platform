'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_KIND,
  createExternalReviewCandidateSubmissionDispatchReceiptSeal
} = require('./create-external-review-candidate-submission-dispatch-receipt-seal');

const SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE = Object.freeze({
  CLOSED: 'CLOSED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_CLOSURE_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-v1';
const SUBMISSION_DISPATCH_RECEIPT_CLOSURE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_CLOSURE';

const SUBMISSION_DISPATCH_RECEIPT_CLOSURE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_CLOSURE_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_CLOSURE: true,
  INTERNAL_RECEIPT_CHAIN_CLOSURE: true,
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

const SUBMISSION_DISPATCH_RECEIPT_CLOSURE_COMPONENTS = Object.freeze([
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-001',
    closure_component_name: 'Internal Submission Dispatch Receipt Seal',
    ref_field: 'submission_dispatch_receipt_seal_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-002',
    closure_component_name: 'Internal Submission Dispatch Receipt Ledger',
    ref_field: 'submission_dispatch_receipt_ledger_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-003',
    closure_component_name: 'Internal Submission Dispatch Receipt Register',
    ref_field: 'submission_dispatch_receipt_register_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-004',
    closure_component_name: 'Internal Submission Dispatch Receipt Index',
    ref_field: 'submission_dispatch_receipt_index_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-005',
    closure_component_name: 'Internal Submission Dispatch Receipt Manifest',
    ref_field: 'submission_dispatch_receipt_manifest_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-006',
    closure_component_name: 'Internal Submission Dispatch Receipt Package',
    ref_field: 'submission_dispatch_receipt_package_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-007',
    closure_component_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-008',
    closure_component_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-009',
    closure_component_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-010',
    closure_component_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-011',
    closure_component_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-012',
    closure_component_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-013',
    closure_component_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-014',
    closure_component_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-015',
    closure_component_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-016',
    closure_component_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-017',
    closure_component_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-018',
    closure_component_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-019',
    closure_component_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-020',
    closure_component_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    closure_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-CLOSURE-COMPONENT-021',
    closure_component_name: 'Receipt Seal Boundary State',
    ref_field: 'submission_dispatch_receipt_seal_boundary_state'
  })
]);

const PRESERVED_FIELDS = Object.freeze([
  'submission_dispatch_receipt_seal_id',
  'submission_dispatch_receipt_seal_sha256',
  'submission_dispatch_receipt_seal_ref',
  'submission_dispatch_receipt_seal_material_state',
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
  'submission_dispatch_receipt_seal_component_count',
  'validator_test_count',
  'evidence_test_count',
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
  'submission_dispatch_receipt_seal_boundary_state',
  'claims_not_created',
  'runtime_effects'
]);

function result(state, reason, submissionDispatchReceiptClosure) {
  if (submissionDispatchReceiptClosure) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_closure: submissionDispatchReceiptClosure });
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

function isSubmissionDispatchReceiptSealBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_SEAL_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_SEAL_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_seal_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_seal_sha256)
  );
}

function resolveSubmissionDispatchReceiptSeal(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.SEALED &&
    isSubmissionDispatchReceiptSealBody(source.submission_dispatch_receipt_seal)
  ) {
    return source.submission_dispatch_receipt_seal;
  }

  if (isSubmissionDispatchReceiptSealBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptSealResult = createExternalReviewCandidateSubmissionDispatchReceiptSeal(
    source,
    isPlainObject(context.submission_dispatch_receipt_seal_context)
      ? context.submission_dispatch_receipt_seal_context
      : {}
  );

  if (
    submissionDispatchReceiptSealResult.state !== SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.SEALED ||
    !isSubmissionDispatchReceiptSealBody(submissionDispatchReceiptSealResult.submission_dispatch_receipt_seal)
  ) {
    return null;
  }

  return submissionDispatchReceiptSealResult.submission_dispatch_receipt_seal;
}

function submissionDispatchReceiptClosureComponentsSatisfied(submissionDispatchReceiptSeal) {
  for (const component of SUBMISSION_DISPATCH_RECEIPT_CLOSURE_COMPONENTS) {
    if (!isNonEmptyString(submissionDispatchReceiptSeal[component.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptSeal) {
  return (
    isPlainObject(submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope) &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_SEAL_ONLY === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_SEAL === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.INTERNAL_HASH_SEAL === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptSeal) {
  return (
    submissionDispatchReceiptSeal.external_reviewer_appointed === false &&
    submissionDispatchReceiptSeal.external_review_execution_created === false &&
    submissionDispatchReceiptSeal.external_review_opinion_created === false &&
    submissionDispatchReceiptSeal.external_review_report_created === false &&
    submissionDispatchReceiptSeal.external_review_submission_created === false &&
    submissionDispatchReceiptSeal.external_review_publication_created === false &&
    submissionDispatchReceiptSeal.external_submission_dispatched === false &&
    submissionDispatchReceiptSeal.external_submission_transmitted === false &&
    submissionDispatchReceiptSeal.external_submission_accepted === false &&
    submissionDispatchReceiptSeal.external_submission_acknowledged === false &&
    submissionDispatchReceiptSeal.external_submission_receipt_created === false &&
    submissionDispatchReceiptSeal.external_submission_receipt_acknowledged === false &&
    submissionDispatchReceiptSeal.legal_certification_created === false &&
    submissionDispatchReceiptSeal.eidas_qualification_created === false &&
    submissionDispatchReceiptSeal.opc_allow_created === false &&
    submissionDispatchReceiptSeal.deployment_success_proven === false &&
    submissionDispatchReceiptSeal.production_deployment_proven === false &&
    submissionDispatchReceiptSeal.public_registry_mutated === false &&
    submissionDispatchReceiptSeal.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchReceiptClosure(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_closure_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_CLOSURE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_CLOSURE_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptSeal = resolveSubmissionDispatchReceiptSeal(source, context);

  if (!submissionDispatchReceiptSeal) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_CLOSURE_SUBMISSION_DISPATCH_RECEIPT_SEAL_INVALID'
    );
  }

  const componentsSatisfied = submissionDispatchReceiptClosureComponentsSatisfied(submissionDispatchReceiptSeal);
  const preservedScope = scopePreserved(submissionDispatchReceiptSeal);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptSeal);
  const preservedBoundary = (
    componentsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_components_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_ledger_entries_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_register_records_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_index_entries_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_manifest_entries_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_package_records_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_candidate_records_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_envelope_records_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchReceiptSeal.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchReceiptSeal.submission_manifest_records_satisfied === true &&
    submissionDispatchReceiptSeal.submission_package_records_satisfied === true &&
    submissionDispatchReceiptSeal.submission_candidate_records_satisfied === true &&
    submissionDispatchReceiptSeal.reviewer_selection_records_satisfied === true &&
    submissionDispatchReceiptSeal.review_package_sections_satisfied === true &&
    submissionDispatchReceiptSeal.index_entries_satisfied === true &&
    submissionDispatchReceiptSeal.manifest_entries_satisfied === true &&
    submissionDispatchReceiptSeal.audit_sections_satisfied === true &&
    submissionDispatchReceiptSeal.claims_not_created_preserved === true &&
    submissionDispatchReceiptSeal.runtime_effects_preserved === true &&
    submissionDispatchReceiptSeal.submission_dispatch_receipt_seal_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptClosureBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_CLOSURE_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_CLOSURE_KIND,
    submission_dispatch_receipt_closure_id: context.submission_dispatch_receipt_closure_id,
    submission_dispatch_receipt_closure_version: defaultString(context.submission_dispatch_receipt_closure_version, '1.0'),
    submission_dispatch_receipt_closure_state: SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE.CLOSED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_closure_scope: SUBMISSION_DISPATCH_RECEIPT_CLOSURE_SCOPE,
    submission_dispatch_receipt_closure_ref: defaultString(context.submission_dispatch_receipt_closure_ref, 'internal-submission-dispatch-receipt-closure:pending'),
    submission_dispatch_receipt_closure_method: defaultString(context.submission_dispatch_receipt_closure_method, 'INTERNAL_TECHNICAL_RECEIPT_CHAIN_CLOSURE_ONLY'),
    submission_dispatch_receipt_closure_material_state: defaultString(context.submission_dispatch_receipt_closure_material_state, 'INTERNAL_CLOSED_RECEIPT_SEAL_REFERENCES_ONLY')
  };

  for (const field of PRESERVED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(submissionDispatchReceiptSeal, field)) {
      submissionDispatchReceiptClosureBody[field] = submissionDispatchReceiptSeal[field];
    }
  }

  submissionDispatchReceiptClosureBody.submission_dispatch_receipt_seal_proto = submissionDispatchReceiptSeal.proto;
  submissionDispatchReceiptClosureBody.submission_dispatch_receipt_seal_kind = submissionDispatchReceiptSeal.kind;
  submissionDispatchReceiptClosureBody.submission_dispatch_receipt_closure_components = SUBMISSION_DISPATCH_RECEIPT_CLOSURE_COMPONENTS;
  submissionDispatchReceiptClosureBody.submission_dispatch_receipt_closure_component_count = SUBMISSION_DISPATCH_RECEIPT_CLOSURE_COMPONENTS.length;
  submissionDispatchReceiptClosureBody.submission_dispatch_receipt_closure_components_satisfied = componentsSatisfied;
  submissionDispatchReceiptClosureBody.submission_dispatch_receipt_closure_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';
  submissionDispatchReceiptClosureBody.external_reviewer_appointed = false;
  submissionDispatchReceiptClosureBody.external_review_execution_created = false;
  submissionDispatchReceiptClosureBody.external_review_opinion_created = false;
  submissionDispatchReceiptClosureBody.external_review_report_created = false;
  submissionDispatchReceiptClosureBody.external_review_submission_created = false;
  submissionDispatchReceiptClosureBody.external_review_publication_created = false;
  submissionDispatchReceiptClosureBody.external_submission_dispatched = false;
  submissionDispatchReceiptClosureBody.external_submission_transmitted = false;
  submissionDispatchReceiptClosureBody.external_submission_accepted = false;
  submissionDispatchReceiptClosureBody.external_submission_acknowledged = false;
  submissionDispatchReceiptClosureBody.external_submission_receipt_created = false;
  submissionDispatchReceiptClosureBody.external_submission_receipt_acknowledged = false;
  submissionDispatchReceiptClosureBody.legal_certification_created = false;
  submissionDispatchReceiptClosureBody.eidas_qualification_created = false;
  submissionDispatchReceiptClosureBody.opc_allow_created = false;
  submissionDispatchReceiptClosureBody.deployment_success_proven = false;
  submissionDispatchReceiptClosureBody.production_deployment_proven = false;
  submissionDispatchReceiptClosureBody.public_registry_mutated = false;
  submissionDispatchReceiptClosureBody.external_trust_registry_mutated = false;
  submissionDispatchReceiptClosureBody.submission_dispatch_receipt_closure_sha256 = sha256Canonical(submissionDispatchReceiptClosureBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE.CLOSED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_CLOSURE_CLOSED',
    deepFreeze(submissionDispatchReceiptClosureBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_CLOSURE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_CLOSURE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_CLOSURE_KIND,
  SUBMISSION_DISPATCH_RECEIPT_CLOSURE_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_CLOSURE_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptClosure
});
