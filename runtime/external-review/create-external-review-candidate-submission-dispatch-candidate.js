'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_MANIFEST_STATE,
  SUBMISSION_MANIFEST_PROTO,
  SUBMISSION_MANIFEST_KIND,
  createExternalReviewCandidateSubmissionManifest
} = require('./create-external-review-candidate-submission-manifest');

const SUBMISSION_DISPATCH_CANDIDATE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_CANDIDATE_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-CANDIDATE-v1';
const SUBMISSION_DISPATCH_CANDIDATE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_CANDIDATE';

const SUBMISSION_DISPATCH_CANDIDATE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_CANDIDATE_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_CANDIDATE: true,
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
  LEGAL_CERTIFICATION: false,
  EIDAS_QUALIFICATION: false,
  OPC_ALLOW: false,
  DEPLOYMENT_SUCCESS: false,
  PRODUCTION_DEPLOYMENT: false,
  PUBLIC_REGISTRY_MUTATION: false,
  EXTERNAL_TRUST_REGISTRY_MUTATION: false
});

const SUBMISSION_DISPATCH_CANDIDATE_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-001',
    record_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-002',
    record_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-003',
    record_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-004',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-005',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-006',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-007',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-008',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-009',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-010',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-CANDIDATE-RECORD-011',
    record_name: 'Boundary State',
    ref_field: 'submission_manifest_boundary_state'
  })
]);

function result(state, reason, submissionDispatchCandidate) {
  if (submissionDispatchCandidate) {
    return Object.freeze({ state, reason, submission_dispatch_candidate: submissionDispatchCandidate });
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

function isSubmissionManifestBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_MANIFEST_PROTO &&
    value.kind === SUBMISSION_MANIFEST_KIND &&
    isNonEmptyString(value.submission_manifest_id) &&
    isNonEmptyString(value.submission_manifest_sha256)
  );
}

function resolveSubmissionManifest(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_MANIFEST_STATE.RECORDED &&
    isSubmissionManifestBody(source.submission_manifest)
  ) {
    return source.submission_manifest;
  }

  if (isSubmissionManifestBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionManifestResult = createExternalReviewCandidateSubmissionManifest(
    source,
    isPlainObject(context.submission_manifest_context) ? context.submission_manifest_context : {}
  );

  if (
    submissionManifestResult.state !== SUBMISSION_MANIFEST_STATE.RECORDED ||
    !isSubmissionManifestBody(submissionManifestResult.submission_manifest)
  ) {
    return null;
  }

  return submissionManifestResult.submission_manifest;
}

function submissionDispatchCandidateRecordsSatisfied(submissionManifest) {
  for (const record of SUBMISSION_DISPATCH_CANDIDATE_RECORDS) {
    if (!isNonEmptyString(submissionManifest[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionManifest) {
  return (
    isPlainObject(submissionManifest.submission_manifest_scope) &&
    submissionManifest.submission_manifest_scope.INTERNAL_TECHNICAL_SUBMISSION_MANIFEST_ONLY === true &&
    submissionManifest.submission_manifest_scope.INTERNAL_SUBMISSION_MANIFEST === true &&
    submissionManifest.submission_manifest_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionManifest.submission_manifest_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionManifest.submission_manifest_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionManifest.submission_manifest_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionManifest.submission_manifest_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionManifest.submission_manifest_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionManifest.submission_manifest_scope.LEGAL_CERTIFICATION === false &&
    submissionManifest.submission_manifest_scope.EIDAS_QUALIFICATION === false &&
    submissionManifest.submission_manifest_scope.OPC_ALLOW === false &&
    submissionManifest.submission_manifest_scope.DEPLOYMENT_SUCCESS === false &&
    submissionManifest.submission_manifest_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionManifest.submission_manifest_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionManifest.submission_manifest_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionManifest) {
  return (
    submissionManifest.external_reviewer_appointed === false &&
    submissionManifest.external_review_execution_created === false &&
    submissionManifest.external_review_opinion_created === false &&
    submissionManifest.external_review_report_created === false &&
    submissionManifest.external_review_submission_created === false &&
    submissionManifest.external_review_publication_created === false &&
    submissionManifest.external_submission_dispatched === false &&
    submissionManifest.external_submission_transmitted === false &&
    submissionManifest.external_submission_accepted === false &&
    submissionManifest.external_submission_acknowledged === false &&
    submissionManifest.legal_certification_created === false &&
    submissionManifest.eidas_qualification_created === false &&
    submissionManifest.opc_allow_created === false &&
    submissionManifest.deployment_success_proven === false &&
    submissionManifest.production_deployment_proven === false &&
    submissionManifest.public_registry_mutated === false &&
    submissionManifest.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchCandidate(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_candidate_id)) {
    return result(
      SUBMISSION_DISPATCH_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_CANDIDATE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_CANDIDATE_GENERATED_AT_INVALID'
    );
  }

  const submissionManifest = resolveSubmissionManifest(source, context);

  if (!submissionManifest) {
    return result(
      SUBMISSION_DISPATCH_CANDIDATE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_CANDIDATE_SUBMISSION_MANIFEST_INVALID'
    );
  }

  const recordsSatisfied = submissionDispatchCandidateRecordsSatisfied(submissionManifest);
  const preservedScope = scopePreserved(submissionManifest);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionManifest);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionManifest.submission_manifest_records_satisfied === true &&
    submissionManifest.submission_package_records_satisfied === true &&
    submissionManifest.submission_candidate_records_satisfied === true &&
    submissionManifest.reviewer_selection_records_satisfied === true &&
    submissionManifest.review_package_sections_satisfied === true &&
    submissionManifest.index_entries_satisfied === true &&
    submissionManifest.manifest_entries_satisfied === true &&
    submissionManifest.audit_sections_satisfied === true &&
    submissionManifest.claims_not_created_preserved === true &&
    submissionManifest.runtime_effects_preserved === true &&
    submissionManifest.submission_manifest_boundary_state === 'PRESERVED'
  );

  const submissionDispatchCandidateBody = {
    proto: SUBMISSION_DISPATCH_CANDIDATE_PROTO,
    kind: SUBMISSION_DISPATCH_CANDIDATE_KIND,
    submission_dispatch_candidate_id: context.submission_dispatch_candidate_id,
    submission_dispatch_candidate_version: defaultString(context.submission_dispatch_candidate_version, '1.0'),
    submission_dispatch_candidate_state: SUBMISSION_DISPATCH_CANDIDATE_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_candidate_scope: SUBMISSION_DISPATCH_CANDIDATE_SCOPE,
    submission_dispatch_candidate_ref: defaultString(context.submission_dispatch_candidate_ref, 'internal-submission-dispatch-candidate:pending'),
    submission_dispatch_candidate_method: defaultString(context.submission_dispatch_candidate_method, 'INTERNAL_TECHNICAL_DISPATCH_CANDIDATE_ONLY'),
    submission_dispatch_route_state: defaultString(context.submission_dispatch_route_state, 'NOT_SELECTED'),
    submission_dispatch_authorization_state: defaultString(context.submission_dispatch_authorization_state, 'NOT_AUTHORIZED'),
    submission_channel_state: defaultString(context.submission_channel_state, submissionManifest.submission_channel_state),
    submission_authorization_state: defaultString(context.submission_authorization_state, submissionManifest.submission_authorization_state),
    submission_manifest_id: submissionManifest.submission_manifest_id,
    submission_manifest_sha256: submissionManifest.submission_manifest_sha256,
    submission_manifest_ref: submissionManifest.submission_manifest_ref,
    submission_manifest_proto: submissionManifest.proto,
    submission_manifest_kind: submissionManifest.kind,
    submission_manifest_material_state: submissionManifest.submission_manifest_material_state,
    submission_package_id: submissionManifest.submission_package_id,
    submission_package_sha256: submissionManifest.submission_package_sha256,
    submission_package_ref: submissionManifest.submission_package_ref,
    submission_candidate_id: submissionManifest.submission_candidate_id,
    submission_candidate_sha256: submissionManifest.submission_candidate_sha256,
    submission_candidate_ref: submissionManifest.submission_candidate_ref,
    reviewer_selection_id: submissionManifest.reviewer_selection_id,
    reviewer_selection_sha256: submissionManifest.reviewer_selection_sha256,
    reviewer_selection_ref: submissionManifest.reviewer_selection_ref,
    reviewer_candidate_ref: submissionManifest.reviewer_candidate_ref,
    reviewer_selection_method: submissionManifest.reviewer_selection_method,
    reviewer_independence_basis: submissionManifest.reviewer_independence_basis,
    reviewer_conflict_check_state: submissionManifest.reviewer_conflict_check_state,
    review_package_id: submissionManifest.review_package_id,
    review_package_sha256: submissionManifest.review_package_sha256,
    review_package_ref: submissionManifest.review_package_ref,
    audit_index_id: submissionManifest.audit_index_id,
    audit_index_sha256: submissionManifest.audit_index_sha256,
    audit_index_ref: submissionManifest.audit_index_ref,
    audit_manifest_id: submissionManifest.audit_manifest_id,
    audit_manifest_sha256: submissionManifest.audit_manifest_sha256,
    audit_manifest_ref: submissionManifest.audit_manifest_ref,
    audit_package_id: submissionManifest.audit_package_id,
    audit_package_sha256: submissionManifest.audit_package_sha256,
    audit_package_ref: submissionManifest.audit_package_ref,
    matrix_binding_id: submissionManifest.matrix_binding_id,
    matrix_binding_sha256: submissionManifest.matrix_binding_sha256,
    evidence_id: submissionManifest.evidence_id,
    evidence_sha256: submissionManifest.evidence_sha256,
    candidate_input_sha256: submissionManifest.candidate_input_sha256,
    validation_output_sha256: submissionManifest.validation_output_sha256,
    validation_state: submissionManifest.validation_state,
    validation_reason: submissionManifest.validation_reason,
    human_execution_control_external_review_candidate_state: submissionManifest.human_execution_control_external_review_candidate_state,
    lifecycle_state: submissionManifest.lifecycle_state,
    requirement_binding_count: submissionManifest.requirement_binding_count,
    audit_section_count: submissionManifest.audit_section_count,
    manifest_entry_count: submissionManifest.manifest_entry_count,
    index_entry_count: submissionManifest.index_entry_count,
    review_package_section_count: submissionManifest.review_package_section_count,
    reviewer_selection_record_count: submissionManifest.reviewer_selection_record_count,
    submission_candidate_record_count: submissionManifest.submission_candidate_record_count,
    submission_package_record_count: submissionManifest.submission_package_record_count,
    submission_manifest_record_count: submissionManifest.submission_manifest_record_count,
    validator_test_count: submissionManifest.validator_test_count,
    evidence_test_count: submissionManifest.evidence_test_count,
    submission_dispatch_candidate_records: SUBMISSION_DISPATCH_CANDIDATE_RECORDS,
    submission_dispatch_candidate_record_count: SUBMISSION_DISPATCH_CANDIDATE_RECORDS.length,
    submission_dispatch_candidate_records_satisfied: recordsSatisfied,
    submission_manifest_records_satisfied: submissionManifest.submission_manifest_records_satisfied,
    submission_package_records_satisfied: submissionManifest.submission_package_records_satisfied,
    submission_candidate_records_satisfied: submissionManifest.submission_candidate_records_satisfied,
    reviewer_selection_records_satisfied: submissionManifest.reviewer_selection_records_satisfied,
    review_package_sections_satisfied: submissionManifest.review_package_sections_satisfied,
    index_entries_satisfied: submissionManifest.index_entries_satisfied,
    manifest_entries_satisfied: submissionManifest.manifest_entries_satisfied,
    audit_sections_satisfied: submissionManifest.audit_sections_satisfied,
    claims_not_created_preserved: submissionManifest.claims_not_created_preserved,
    runtime_effects_preserved: submissionManifest.runtime_effects_preserved,
    boundary_flags_preserved: submissionManifest.boundary_flags_preserved,
    boundary_guard_state: submissionManifest.boundary_guard_state,
    matrix_boundary_state: submissionManifest.matrix_boundary_state,
    audit_boundary_state: submissionManifest.audit_boundary_state,
    manifest_boundary_state: submissionManifest.manifest_boundary_state,
    index_boundary_state: submissionManifest.index_boundary_state,
    review_package_boundary_state: submissionManifest.review_package_boundary_state,
    reviewer_selection_boundary_state: submissionManifest.reviewer_selection_boundary_state,
    submission_candidate_boundary_state: submissionManifest.submission_candidate_boundary_state,
    submission_package_boundary_state: submissionManifest.submission_package_boundary_state,
    submission_manifest_boundary_state: submissionManifest.submission_manifest_boundary_state,
    submission_dispatch_candidate_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: submissionManifest.claims_not_created,
    runtime_effects: submissionManifest.runtime_effects,
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

  submissionDispatchCandidateBody.submission_dispatch_candidate_sha256 = sha256Canonical(submissionDispatchCandidateBody);

  return result(
    SUBMISSION_DISPATCH_CANDIDATE_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_CANDIDATE_RECORDED',
    deepFreeze(submissionDispatchCandidateBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_CANDIDATE_STATE,
  SUBMISSION_DISPATCH_CANDIDATE_PROTO,
  SUBMISSION_DISPATCH_CANDIDATE_KIND,
  SUBMISSION_DISPATCH_CANDIDATE_SCOPE,
  SUBMISSION_DISPATCH_CANDIDATE_RECORDS,
  createExternalReviewCandidateSubmissionDispatchCandidate
});
