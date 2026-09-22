'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  REVIEWER_SELECTION_STATE,
  REVIEWER_SELECTION_PROTO,
  REVIEWER_SELECTION_KIND,
  createExternalReviewCandidateReviewerSelection
} = require('./create-external-review-candidate-reviewer-selection');

const SUBMISSION_CANDIDATE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_CANDIDATE_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-CANDIDATE-v1';
const SUBMISSION_CANDIDATE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_CANDIDATE';

const SUBMISSION_CANDIDATE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_CANDIDATE_ONLY: true,
  INTERNAL_SUBMISSION_CANDIDATE: true,
  EXTERNAL_REVIEWER_APPOINTMENT: false,
  EXTERNAL_REVIEW_EXECUTION: false,
  EXTERNAL_REVIEW_OPINION: false,
  EXTERNAL_REVIEW_REPORT: false,
  EXTERNAL_REVIEW_SUBMISSION: false,
  EXTERNAL_REVIEW_PUBLICATION: false,
  LEGAL_CERTIFICATION: false,
  EIDAS_QUALIFICATION: false,
  OPC_ALLOW: false,
  DEPLOYMENT_SUCCESS: false,
  PRODUCTION_DEPLOYMENT: false,
  PUBLIC_REGISTRY_MUTATION: false,
  EXTERNAL_TRUST_REGISTRY_MUTATION: false
});

const SUBMISSION_CANDIDATE_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-CANDIDATE-RECORD-001',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-CANDIDATE-RECORD-002',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-CANDIDATE-RECORD-003',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-CANDIDATE-RECORD-004',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-CANDIDATE-RECORD-005',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-CANDIDATE-RECORD-006',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-CANDIDATE-RECORD-007',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-CANDIDATE-RECORD-008',
    record_name: 'Boundary State',
    ref_field: 'reviewer_selection_boundary_state'
  })
]);

function result(state, reason, submissionCandidate) {
  if (submissionCandidate) {
    return Object.freeze({ state, reason, submission_candidate: submissionCandidate });
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

function isReviewerSelectionBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === REVIEWER_SELECTION_PROTO &&
    value.kind === REVIEWER_SELECTION_KIND &&
    isNonEmptyString(value.reviewer_selection_id) &&
    isNonEmptyString(value.reviewer_selection_sha256)
  );
}

function resolveReviewerSelection(source, context) {
  if (
    isPlainObject(source) &&
    source.state === REVIEWER_SELECTION_STATE.RECORDED &&
    isReviewerSelectionBody(source.reviewer_selection)
  ) {
    return source.reviewer_selection;
  }

  if (isReviewerSelectionBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const reviewerSelectionResult = createExternalReviewCandidateReviewerSelection(
    source,
    isPlainObject(context.reviewer_selection_context) ? context.reviewer_selection_context : {}
  );

  if (
    reviewerSelectionResult.state !== REVIEWER_SELECTION_STATE.RECORDED ||
    !isReviewerSelectionBody(reviewerSelectionResult.reviewer_selection)
  ) {
    return null;
  }

  return reviewerSelectionResult.reviewer_selection;
}

function submissionCandidateRecordsSatisfied(reviewerSelection) {
  for (const record of SUBMISSION_CANDIDATE_RECORDS) {
    if (!isNonEmptyString(reviewerSelection[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(reviewerSelection) {
  return (
    isPlainObject(reviewerSelection.reviewer_selection_scope) &&
    reviewerSelection.reviewer_selection_scope.INTERNAL_TECHNICAL_SELECTION_ONLY === true &&
    reviewerSelection.reviewer_selection_scope.INTERNAL_REVIEWER_SELECTION_CANDIDATE === true &&
    reviewerSelection.reviewer_selection_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    reviewerSelection.reviewer_selection_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    reviewerSelection.reviewer_selection_scope.EXTERNAL_REVIEW_OPINION === false &&
    reviewerSelection.reviewer_selection_scope.EXTERNAL_REVIEW_REPORT === false &&
    reviewerSelection.reviewer_selection_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    reviewerSelection.reviewer_selection_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    reviewerSelection.reviewer_selection_scope.LEGAL_CERTIFICATION === false &&
    reviewerSelection.reviewer_selection_scope.EIDAS_QUALIFICATION === false &&
    reviewerSelection.reviewer_selection_scope.OPC_ALLOW === false &&
    reviewerSelection.reviewer_selection_scope.DEPLOYMENT_SUCCESS === false &&
    reviewerSelection.reviewer_selection_scope.PRODUCTION_DEPLOYMENT === false &&
    reviewerSelection.reviewer_selection_scope.PUBLIC_REGISTRY_MUTATION === false &&
    reviewerSelection.reviewer_selection_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(reviewerSelection) {
  return (
    reviewerSelection.external_reviewer_appointed === false &&
    reviewerSelection.external_review_execution_created === false &&
    reviewerSelection.external_review_opinion_created === false &&
    reviewerSelection.external_review_report_created === false &&
    reviewerSelection.external_review_submission_created === false &&
    reviewerSelection.external_review_publication_created === false &&
    reviewerSelection.legal_certification_created === false &&
    reviewerSelection.eidas_qualification_created === false &&
    reviewerSelection.opc_allow_created === false &&
    reviewerSelection.deployment_success_proven === false &&
    reviewerSelection.production_deployment_proven === false &&
    reviewerSelection.public_registry_mutated === false &&
    reviewerSelection.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionCandidate(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_candidate_id)) {
    return result(
      SUBMISSION_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_CANDIDATE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_CANDIDATE_GENERATED_AT_INVALID'
    );
  }

  const reviewerSelection = resolveReviewerSelection(source, context);

  if (!reviewerSelection) {
    return result(
      SUBMISSION_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_CANDIDATE_REVIEWER_SELECTION_INVALID'
    );
  }

  const recordsSatisfied = submissionCandidateRecordsSatisfied(reviewerSelection);
  const preservedScope = scopePreserved(reviewerSelection);
  const preservedRuntimeEffects = runtimeEffectsPreserved(reviewerSelection);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    reviewerSelection.reviewer_selection_records_satisfied === true &&
    reviewerSelection.review_package_sections_satisfied === true &&
    reviewerSelection.index_entries_satisfied === true &&
    reviewerSelection.manifest_entries_satisfied === true &&
    reviewerSelection.audit_sections_satisfied === true &&
    reviewerSelection.claims_not_created_preserved === true &&
    reviewerSelection.runtime_effects_preserved === true &&
    reviewerSelection.reviewer_selection_boundary_state === 'PRESERVED'
  );

  const submissionCandidateBody = {
    proto: SUBMISSION_CANDIDATE_PROTO,
    kind: SUBMISSION_CANDIDATE_KIND,
    submission_candidate_id: context.submission_candidate_id,
    submission_candidate_version: defaultString(context.submission_candidate_version, '1.0'),
    submission_candidate_state: SUBMISSION_CANDIDATE_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_candidate_scope: SUBMISSION_CANDIDATE_SCOPE,
    submission_candidate_ref: defaultString(context.submission_candidate_ref, 'internal-submission-candidate:pending'),
    submission_candidate_method: defaultString(context.submission_candidate_method, 'INTERNAL_TECHNICAL_PREPARATION_ONLY'),
    submission_channel_state: defaultString(context.submission_channel_state, 'NOT_SELECTED'),
    submission_authorization_state: defaultString(context.submission_authorization_state, 'NOT_AUTHORIZED'),
    reviewer_selection_id: reviewerSelection.reviewer_selection_id,
    reviewer_selection_sha256: reviewerSelection.reviewer_selection_sha256,
    reviewer_selection_ref: 'runtime/external-review/create-external-review-candidate-reviewer-selection.js',
    reviewer_selection_proto: reviewerSelection.proto,
    reviewer_selection_kind: reviewerSelection.kind,
    reviewer_candidate_ref: reviewerSelection.reviewer_candidate_ref,
    reviewer_selection_method: reviewerSelection.reviewer_selection_method,
    reviewer_independence_basis: reviewerSelection.reviewer_independence_basis,
    reviewer_conflict_check_state: reviewerSelection.reviewer_conflict_check_state,
    review_package_id: reviewerSelection.review_package_id,
    review_package_sha256: reviewerSelection.review_package_sha256,
    review_package_ref: reviewerSelection.review_package_ref,
    audit_index_id: reviewerSelection.audit_index_id,
    audit_index_sha256: reviewerSelection.audit_index_sha256,
    audit_index_ref: reviewerSelection.audit_index_ref,
    audit_manifest_id: reviewerSelection.audit_manifest_id,
    audit_manifest_sha256: reviewerSelection.audit_manifest_sha256,
    audit_manifest_ref: reviewerSelection.audit_manifest_ref,
    audit_package_id: reviewerSelection.audit_package_id,
    audit_package_sha256: reviewerSelection.audit_package_sha256,
    audit_package_ref: reviewerSelection.audit_package_ref,
    matrix_binding_id: reviewerSelection.matrix_binding_id,
    matrix_binding_sha256: reviewerSelection.matrix_binding_sha256,
    evidence_id: reviewerSelection.evidence_id,
    evidence_sha256: reviewerSelection.evidence_sha256,
    candidate_input_sha256: reviewerSelection.candidate_input_sha256,
    validation_output_sha256: reviewerSelection.validation_output_sha256,
    validation_state: reviewerSelection.validation_state,
    validation_reason: reviewerSelection.validation_reason,
    human_execution_control_external_review_candidate_state: reviewerSelection.human_execution_control_external_review_candidate_state,
    lifecycle_state: reviewerSelection.lifecycle_state,
    requirement_binding_count: reviewerSelection.requirement_binding_count,
    audit_section_count: reviewerSelection.audit_section_count,
    manifest_entry_count: reviewerSelection.manifest_entry_count,
    index_entry_count: reviewerSelection.index_entry_count,
    review_package_section_count: reviewerSelection.review_package_section_count,
    reviewer_selection_record_count: reviewerSelection.reviewer_selection_record_count,
    validator_test_count: reviewerSelection.validator_test_count,
    evidence_test_count: reviewerSelection.evidence_test_count,
    submission_candidate_records: SUBMISSION_CANDIDATE_RECORDS,
    submission_candidate_record_count: SUBMISSION_CANDIDATE_RECORDS.length,
    submission_candidate_records_satisfied: recordsSatisfied,
    reviewer_selection_records_satisfied: reviewerSelection.reviewer_selection_records_satisfied,
    review_package_sections_satisfied: reviewerSelection.review_package_sections_satisfied,
    index_entries_satisfied: reviewerSelection.index_entries_satisfied,
    manifest_entries_satisfied: reviewerSelection.manifest_entries_satisfied,
    audit_sections_satisfied: reviewerSelection.audit_sections_satisfied,
    claims_not_created_preserved: reviewerSelection.claims_not_created_preserved,
    runtime_effects_preserved: reviewerSelection.runtime_effects_preserved,
    boundary_flags_preserved: reviewerSelection.boundary_flags_preserved,
    boundary_guard_state: reviewerSelection.boundary_guard_state,
    matrix_boundary_state: reviewerSelection.matrix_boundary_state,
    audit_boundary_state: reviewerSelection.audit_boundary_state,
    manifest_boundary_state: reviewerSelection.manifest_boundary_state,
    index_boundary_state: reviewerSelection.index_boundary_state,
    review_package_boundary_state: reviewerSelection.review_package_boundary_state,
    reviewer_selection_boundary_state: reviewerSelection.reviewer_selection_boundary_state,
    submission_candidate_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: reviewerSelection.claims_not_created,
    runtime_effects: reviewerSelection.runtime_effects,
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
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false
  };

  submissionCandidateBody.submission_candidate_sha256 = sha256Canonical(submissionCandidateBody);

  return result(
    SUBMISSION_CANDIDATE_STATE.RECORDED,
    'RPECRC_SUBMISSION_CANDIDATE_RECORDED',
    deepFreeze(submissionCandidateBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_CANDIDATE_STATE,
  SUBMISSION_CANDIDATE_PROTO,
  SUBMISSION_CANDIDATE_KIND,
  SUBMISSION_CANDIDATE_SCOPE,
  SUBMISSION_CANDIDATE_RECORDS,
  createExternalReviewCandidateSubmissionCandidate
});
