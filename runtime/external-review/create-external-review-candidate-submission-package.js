'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_CANDIDATE_STATE,
  SUBMISSION_CANDIDATE_PROTO,
  SUBMISSION_CANDIDATE_KIND,
  createExternalReviewCandidateSubmissionCandidate
} = require('./create-external-review-candidate-submission-candidate');

const SUBMISSION_PACKAGE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_PACKAGE_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-PACKAGE-v1';
const SUBMISSION_PACKAGE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_PACKAGE';

const SUBMISSION_PACKAGE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_PACKAGE_ONLY: true,
  INTERNAL_SUBMISSION_PACKAGE: true,
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

const SUBMISSION_PACKAGE_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-001',
    record_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-002',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-003',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-004',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-005',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-006',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-007',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-008',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-PACKAGE-RECORD-009',
    record_name: 'Boundary State',
    ref_field: 'submission_candidate_boundary_state'
  })
]);

function result(state, reason, submissionPackage) {
  if (submissionPackage) {
    return Object.freeze({ state, reason, submission_package: submissionPackage });
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

function isSubmissionCandidateBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_CANDIDATE_PROTO &&
    value.kind === SUBMISSION_CANDIDATE_KIND &&
    isNonEmptyString(value.submission_candidate_id) &&
    isNonEmptyString(value.submission_candidate_sha256)
  );
}

function resolveSubmissionCandidate(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_CANDIDATE_STATE.RECORDED &&
    isSubmissionCandidateBody(source.submission_candidate)
  ) {
    return source.submission_candidate;
  }

  if (isSubmissionCandidateBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionCandidateResult = createExternalReviewCandidateSubmissionCandidate(
    source,
    isPlainObject(context.submission_candidate_context) ? context.submission_candidate_context : {}
  );

  if (
    submissionCandidateResult.state !== SUBMISSION_CANDIDATE_STATE.RECORDED ||
    !isSubmissionCandidateBody(submissionCandidateResult.submission_candidate)
  ) {
    return null;
  }

  return submissionCandidateResult.submission_candidate;
}

function submissionPackageRecordsSatisfied(submissionCandidate) {
  for (const record of SUBMISSION_PACKAGE_RECORDS) {
    if (!isNonEmptyString(submissionCandidate[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionCandidate) {
  return (
    isPlainObject(submissionCandidate.submission_candidate_scope) &&
    submissionCandidate.submission_candidate_scope.INTERNAL_TECHNICAL_SUBMISSION_CANDIDATE_ONLY === true &&
    submissionCandidate.submission_candidate_scope.INTERNAL_SUBMISSION_CANDIDATE === true &&
    submissionCandidate.submission_candidate_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionCandidate.submission_candidate_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionCandidate.submission_candidate_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionCandidate.submission_candidate_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionCandidate.submission_candidate_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionCandidate.submission_candidate_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionCandidate.submission_candidate_scope.LEGAL_CERTIFICATION === false &&
    submissionCandidate.submission_candidate_scope.EIDAS_QUALIFICATION === false &&
    submissionCandidate.submission_candidate_scope.OPC_ALLOW === false &&
    submissionCandidate.submission_candidate_scope.DEPLOYMENT_SUCCESS === false &&
    submissionCandidate.submission_candidate_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionCandidate.submission_candidate_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionCandidate.submission_candidate_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionCandidate) {
  return (
    submissionCandidate.external_reviewer_appointed === false &&
    submissionCandidate.external_review_execution_created === false &&
    submissionCandidate.external_review_opinion_created === false &&
    submissionCandidate.external_review_report_created === false &&
    submissionCandidate.external_review_submission_created === false &&
    submissionCandidate.external_review_publication_created === false &&
    submissionCandidate.external_submission_dispatched === false &&
    submissionCandidate.external_submission_transmitted === false &&
    submissionCandidate.external_submission_accepted === false &&
    submissionCandidate.external_submission_acknowledged === false &&
    submissionCandidate.legal_certification_created === false &&
    submissionCandidate.eidas_qualification_created === false &&
    submissionCandidate.opc_allow_created === false &&
    submissionCandidate.deployment_success_proven === false &&
    submissionCandidate.production_deployment_proven === false &&
    submissionCandidate.public_registry_mutated === false &&
    submissionCandidate.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionPackage(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_package_id)) {
    return result(
      SUBMISSION_PACKAGE_STATE.INVALID,
      'RPECRC_SUBMISSION_PACKAGE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_PACKAGE_STATE.INVALID,
      'RPECRC_SUBMISSION_PACKAGE_GENERATED_AT_INVALID'
    );
  }

  const submissionCandidate = resolveSubmissionCandidate(source, context);

  if (!submissionCandidate) {
    return result(
      SUBMISSION_PACKAGE_STATE.INVALID,
      'RPECRC_SUBMISSION_PACKAGE_SUBMISSION_CANDIDATE_INVALID'
    );
  }

  const recordsSatisfied = submissionPackageRecordsSatisfied(submissionCandidate);
  const preservedScope = scopePreserved(submissionCandidate);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionCandidate);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionCandidate.submission_candidate_records_satisfied === true &&
    submissionCandidate.reviewer_selection_records_satisfied === true &&
    submissionCandidate.review_package_sections_satisfied === true &&
    submissionCandidate.index_entries_satisfied === true &&
    submissionCandidate.manifest_entries_satisfied === true &&
    submissionCandidate.audit_sections_satisfied === true &&
    submissionCandidate.claims_not_created_preserved === true &&
    submissionCandidate.runtime_effects_preserved === true &&
    submissionCandidate.submission_candidate_boundary_state === 'PRESERVED'
  );

  const submissionPackageBody = {
    proto: SUBMISSION_PACKAGE_PROTO,
    kind: SUBMISSION_PACKAGE_KIND,
    submission_package_id: context.submission_package_id,
    submission_package_version: defaultString(context.submission_package_version, '1.0'),
    submission_package_state: SUBMISSION_PACKAGE_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_package_scope: SUBMISSION_PACKAGE_SCOPE,
    submission_package_ref: defaultString(context.submission_package_ref, 'internal-submission-package:pending'),
    submission_package_method: defaultString(context.submission_package_method, 'INTERNAL_TECHNICAL_PACKAGING_ONLY'),
    submission_channel_state: defaultString(context.submission_channel_state, submissionCandidate.submission_channel_state),
    submission_authorization_state: defaultString(context.submission_authorization_state, submissionCandidate.submission_authorization_state),
    submission_candidate_id: submissionCandidate.submission_candidate_id,
    submission_candidate_sha256: submissionCandidate.submission_candidate_sha256,
    submission_candidate_ref: submissionCandidate.submission_candidate_ref,
    submission_candidate_proto: submissionCandidate.proto,
    submission_candidate_kind: submissionCandidate.kind,
    reviewer_selection_id: submissionCandidate.reviewer_selection_id,
    reviewer_selection_sha256: submissionCandidate.reviewer_selection_sha256,
    reviewer_selection_ref: submissionCandidate.reviewer_selection_ref,
    reviewer_candidate_ref: submissionCandidate.reviewer_candidate_ref,
    reviewer_selection_method: submissionCandidate.reviewer_selection_method,
    reviewer_independence_basis: submissionCandidate.reviewer_independence_basis,
    reviewer_conflict_check_state: submissionCandidate.reviewer_conflict_check_state,
    review_package_id: submissionCandidate.review_package_id,
    review_package_sha256: submissionCandidate.review_package_sha256,
    review_package_ref: submissionCandidate.review_package_ref,
    audit_index_id: submissionCandidate.audit_index_id,
    audit_index_sha256: submissionCandidate.audit_index_sha256,
    audit_index_ref: submissionCandidate.audit_index_ref,
    audit_manifest_id: submissionCandidate.audit_manifest_id,
    audit_manifest_sha256: submissionCandidate.audit_manifest_sha256,
    audit_manifest_ref: submissionCandidate.audit_manifest_ref,
    audit_package_id: submissionCandidate.audit_package_id,
    audit_package_sha256: submissionCandidate.audit_package_sha256,
    audit_package_ref: submissionCandidate.audit_package_ref,
    matrix_binding_id: submissionCandidate.matrix_binding_id,
    matrix_binding_sha256: submissionCandidate.matrix_binding_sha256,
    evidence_id: submissionCandidate.evidence_id,
    evidence_sha256: submissionCandidate.evidence_sha256,
    candidate_input_sha256: submissionCandidate.candidate_input_sha256,
    validation_output_sha256: submissionCandidate.validation_output_sha256,
    validation_state: submissionCandidate.validation_state,
    validation_reason: submissionCandidate.validation_reason,
    human_execution_control_external_review_candidate_state: submissionCandidate.human_execution_control_external_review_candidate_state,
    lifecycle_state: submissionCandidate.lifecycle_state,
    requirement_binding_count: submissionCandidate.requirement_binding_count,
    audit_section_count: submissionCandidate.audit_section_count,
    manifest_entry_count: submissionCandidate.manifest_entry_count,
    index_entry_count: submissionCandidate.index_entry_count,
    review_package_section_count: submissionCandidate.review_package_section_count,
    reviewer_selection_record_count: submissionCandidate.reviewer_selection_record_count,
    submission_candidate_record_count: submissionCandidate.submission_candidate_record_count,
    validator_test_count: submissionCandidate.validator_test_count,
    evidence_test_count: submissionCandidate.evidence_test_count,
    submission_package_records: SUBMISSION_PACKAGE_RECORDS,
    submission_package_record_count: SUBMISSION_PACKAGE_RECORDS.length,
    submission_package_records_satisfied: recordsSatisfied,
    submission_candidate_records_satisfied: submissionCandidate.submission_candidate_records_satisfied,
    reviewer_selection_records_satisfied: submissionCandidate.reviewer_selection_records_satisfied,
    review_package_sections_satisfied: submissionCandidate.review_package_sections_satisfied,
    index_entries_satisfied: submissionCandidate.index_entries_satisfied,
    manifest_entries_satisfied: submissionCandidate.manifest_entries_satisfied,
    audit_sections_satisfied: submissionCandidate.audit_sections_satisfied,
    claims_not_created_preserved: submissionCandidate.claims_not_created_preserved,
    runtime_effects_preserved: submissionCandidate.runtime_effects_preserved,
    boundary_flags_preserved: submissionCandidate.boundary_flags_preserved,
    boundary_guard_state: submissionCandidate.boundary_guard_state,
    matrix_boundary_state: submissionCandidate.matrix_boundary_state,
    audit_boundary_state: submissionCandidate.audit_boundary_state,
    manifest_boundary_state: submissionCandidate.manifest_boundary_state,
    index_boundary_state: submissionCandidate.index_boundary_state,
    review_package_boundary_state: submissionCandidate.review_package_boundary_state,
    reviewer_selection_boundary_state: submissionCandidate.reviewer_selection_boundary_state,
    submission_candidate_boundary_state: submissionCandidate.submission_candidate_boundary_state,
    submission_package_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: submissionCandidate.claims_not_created,
    runtime_effects: submissionCandidate.runtime_effects,
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

  submissionPackageBody.submission_package_sha256 = sha256Canonical(submissionPackageBody);

  return result(
    SUBMISSION_PACKAGE_STATE.RECORDED,
    'RPECRC_SUBMISSION_PACKAGE_RECORDED',
    deepFreeze(submissionPackageBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_PACKAGE_STATE,
  SUBMISSION_PACKAGE_PROTO,
  SUBMISSION_PACKAGE_KIND,
  SUBMISSION_PACKAGE_SCOPE,
  SUBMISSION_PACKAGE_RECORDS,
  createExternalReviewCandidateSubmissionPackage
});
