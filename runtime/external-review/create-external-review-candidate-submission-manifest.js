'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_PACKAGE_STATE,
  SUBMISSION_PACKAGE_PROTO,
  SUBMISSION_PACKAGE_KIND,
  createExternalReviewCandidateSubmissionPackage
} = require('./create-external-review-candidate-submission-package');

const SUBMISSION_MANIFEST_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_MANIFEST_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-MANIFEST-v1';
const SUBMISSION_MANIFEST_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_MANIFEST';

const SUBMISSION_MANIFEST_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_MANIFEST_ONLY: true,
  INTERNAL_SUBMISSION_MANIFEST: true,
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

const SUBMISSION_MANIFEST_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-001',
    record_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-002',
    record_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-003',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-004',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-005',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-006',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-007',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-008',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-009',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-MANIFEST-RECORD-010',
    record_name: 'Boundary State',
    ref_field: 'submission_package_boundary_state'
  })
]);

function result(state, reason, submissionManifest) {
  if (submissionManifest) {
    return Object.freeze({ state, reason, submission_manifest: submissionManifest });
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

function isSubmissionPackageBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_PACKAGE_PROTO &&
    value.kind === SUBMISSION_PACKAGE_KIND &&
    isNonEmptyString(value.submission_package_id) &&
    isNonEmptyString(value.submission_package_sha256)
  );
}

function resolveSubmissionPackage(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_PACKAGE_STATE.RECORDED &&
    isSubmissionPackageBody(source.submission_package)
  ) {
    return source.submission_package;
  }

  if (isSubmissionPackageBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionPackageResult = createExternalReviewCandidateSubmissionPackage(
    source,
    isPlainObject(context.submission_package_context) ? context.submission_package_context : {}
  );

  if (
    submissionPackageResult.state !== SUBMISSION_PACKAGE_STATE.RECORDED ||
    !isSubmissionPackageBody(submissionPackageResult.submission_package)
  ) {
    return null;
  }

  return submissionPackageResult.submission_package;
}

function submissionManifestRecordsSatisfied(submissionPackage) {
  for (const record of SUBMISSION_MANIFEST_RECORDS) {
    if (!isNonEmptyString(submissionPackage[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionPackage) {
  return (
    isPlainObject(submissionPackage.submission_package_scope) &&
    submissionPackage.submission_package_scope.INTERNAL_TECHNICAL_SUBMISSION_PACKAGE_ONLY === true &&
    submissionPackage.submission_package_scope.INTERNAL_SUBMISSION_PACKAGE === true &&
    submissionPackage.submission_package_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionPackage.submission_package_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionPackage.submission_package_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionPackage.submission_package_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionPackage.submission_package_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionPackage.submission_package_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionPackage.submission_package_scope.LEGAL_CERTIFICATION === false &&
    submissionPackage.submission_package_scope.EIDAS_QUALIFICATION === false &&
    submissionPackage.submission_package_scope.OPC_ALLOW === false &&
    submissionPackage.submission_package_scope.DEPLOYMENT_SUCCESS === false &&
    submissionPackage.submission_package_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionPackage.submission_package_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionPackage.submission_package_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionPackage) {
  return (
    submissionPackage.external_reviewer_appointed === false &&
    submissionPackage.external_review_execution_created === false &&
    submissionPackage.external_review_opinion_created === false &&
    submissionPackage.external_review_report_created === false &&
    submissionPackage.external_review_submission_created === false &&
    submissionPackage.external_review_publication_created === false &&
    submissionPackage.external_submission_dispatched === false &&
    submissionPackage.external_submission_transmitted === false &&
    submissionPackage.external_submission_accepted === false &&
    submissionPackage.external_submission_acknowledged === false &&
    submissionPackage.legal_certification_created === false &&
    submissionPackage.eidas_qualification_created === false &&
    submissionPackage.opc_allow_created === false &&
    submissionPackage.deployment_success_proven === false &&
    submissionPackage.production_deployment_proven === false &&
    submissionPackage.public_registry_mutated === false &&
    submissionPackage.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionManifest(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_manifest_id)) {
    return result(
      SUBMISSION_MANIFEST_STATE.INVALID,
      'RPECRC_SUBMISSION_MANIFEST_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_MANIFEST_STATE.INVALID,
      'RPECRC_SUBMISSION_MANIFEST_GENERATED_AT_INVALID'
    );
  }

  const submissionPackage = resolveSubmissionPackage(source, context);

  if (!submissionPackage) {
    return result(
      SUBMISSION_MANIFEST_STATE.INVALID,
      'RPECRC_SUBMISSION_MANIFEST_SUBMISSION_PACKAGE_INVALID'
    );
  }

  const recordsSatisfied = submissionManifestRecordsSatisfied(submissionPackage);
  const preservedScope = scopePreserved(submissionPackage);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionPackage);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionPackage.submission_package_records_satisfied === true &&
    submissionPackage.submission_candidate_records_satisfied === true &&
    submissionPackage.reviewer_selection_records_satisfied === true &&
    submissionPackage.review_package_sections_satisfied === true &&
    submissionPackage.index_entries_satisfied === true &&
    submissionPackage.manifest_entries_satisfied === true &&
    submissionPackage.audit_sections_satisfied === true &&
    submissionPackage.claims_not_created_preserved === true &&
    submissionPackage.runtime_effects_preserved === true &&
    submissionPackage.submission_package_boundary_state === 'PRESERVED'
  );

  const submissionManifestBody = {
    proto: SUBMISSION_MANIFEST_PROTO,
    kind: SUBMISSION_MANIFEST_KIND,
    submission_manifest_id: context.submission_manifest_id,
    submission_manifest_version: defaultString(context.submission_manifest_version, '1.0'),
    submission_manifest_state: SUBMISSION_MANIFEST_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_manifest_scope: SUBMISSION_MANIFEST_SCOPE,
    submission_manifest_ref: defaultString(context.submission_manifest_ref, 'internal-submission-manifest:pending'),
    submission_manifest_method: defaultString(context.submission_manifest_method, 'INTERNAL_TECHNICAL_MANIFESTING_ONLY'),
    submission_manifest_material_state: defaultString(context.submission_manifest_material_state, 'INTERNAL_HASHED_PACKAGE_REFERENCES_ONLY'),
    submission_channel_state: defaultString(context.submission_channel_state, submissionPackage.submission_channel_state),
    submission_authorization_state: defaultString(context.submission_authorization_state, submissionPackage.submission_authorization_state),
    submission_package_id: submissionPackage.submission_package_id,
    submission_package_sha256: submissionPackage.submission_package_sha256,
    submission_package_ref: submissionPackage.submission_package_ref,
    submission_package_proto: submissionPackage.proto,
    submission_package_kind: submissionPackage.kind,
    submission_candidate_id: submissionPackage.submission_candidate_id,
    submission_candidate_sha256: submissionPackage.submission_candidate_sha256,
    submission_candidate_ref: submissionPackage.submission_candidate_ref,
    reviewer_selection_id: submissionPackage.reviewer_selection_id,
    reviewer_selection_sha256: submissionPackage.reviewer_selection_sha256,
    reviewer_selection_ref: submissionPackage.reviewer_selection_ref,
    reviewer_candidate_ref: submissionPackage.reviewer_candidate_ref,
    reviewer_selection_method: submissionPackage.reviewer_selection_method,
    reviewer_independence_basis: submissionPackage.reviewer_independence_basis,
    reviewer_conflict_check_state: submissionPackage.reviewer_conflict_check_state,
    review_package_id: submissionPackage.review_package_id,
    review_package_sha256: submissionPackage.review_package_sha256,
    review_package_ref: submissionPackage.review_package_ref,
    audit_index_id: submissionPackage.audit_index_id,
    audit_index_sha256: submissionPackage.audit_index_sha256,
    audit_index_ref: submissionPackage.audit_index_ref,
    audit_manifest_id: submissionPackage.audit_manifest_id,
    audit_manifest_sha256: submissionPackage.audit_manifest_sha256,
    audit_manifest_ref: submissionPackage.audit_manifest_ref,
    audit_package_id: submissionPackage.audit_package_id,
    audit_package_sha256: submissionPackage.audit_package_sha256,
    audit_package_ref: submissionPackage.audit_package_ref,
    matrix_binding_id: submissionPackage.matrix_binding_id,
    matrix_binding_sha256: submissionPackage.matrix_binding_sha256,
    evidence_id: submissionPackage.evidence_id,
    evidence_sha256: submissionPackage.evidence_sha256,
    candidate_input_sha256: submissionPackage.candidate_input_sha256,
    validation_output_sha256: submissionPackage.validation_output_sha256,
    validation_state: submissionPackage.validation_state,
    validation_reason: submissionPackage.validation_reason,
    human_execution_control_external_review_candidate_state: submissionPackage.human_execution_control_external_review_candidate_state,
    lifecycle_state: submissionPackage.lifecycle_state,
    requirement_binding_count: submissionPackage.requirement_binding_count,
    audit_section_count: submissionPackage.audit_section_count,
    manifest_entry_count: submissionPackage.manifest_entry_count,
    index_entry_count: submissionPackage.index_entry_count,
    review_package_section_count: submissionPackage.review_package_section_count,
    reviewer_selection_record_count: submissionPackage.reviewer_selection_record_count,
    submission_candidate_record_count: submissionPackage.submission_candidate_record_count,
    submission_package_record_count: submissionPackage.submission_package_record_count,
    validator_test_count: submissionPackage.validator_test_count,
    evidence_test_count: submissionPackage.evidence_test_count,
    submission_manifest_records: SUBMISSION_MANIFEST_RECORDS,
    submission_manifest_record_count: SUBMISSION_MANIFEST_RECORDS.length,
    submission_manifest_records_satisfied: recordsSatisfied,
    submission_package_records_satisfied: submissionPackage.submission_package_records_satisfied,
    submission_candidate_records_satisfied: submissionPackage.submission_candidate_records_satisfied,
    reviewer_selection_records_satisfied: submissionPackage.reviewer_selection_records_satisfied,
    review_package_sections_satisfied: submissionPackage.review_package_sections_satisfied,
    index_entries_satisfied: submissionPackage.index_entries_satisfied,
    manifest_entries_satisfied: submissionPackage.manifest_entries_satisfied,
    audit_sections_satisfied: submissionPackage.audit_sections_satisfied,
    claims_not_created_preserved: submissionPackage.claims_not_created_preserved,
    runtime_effects_preserved: submissionPackage.runtime_effects_preserved,
    boundary_flags_preserved: submissionPackage.boundary_flags_preserved,
    boundary_guard_state: submissionPackage.boundary_guard_state,
    matrix_boundary_state: submissionPackage.matrix_boundary_state,
    audit_boundary_state: submissionPackage.audit_boundary_state,
    manifest_boundary_state: submissionPackage.manifest_boundary_state,
    index_boundary_state: submissionPackage.index_boundary_state,
    review_package_boundary_state: submissionPackage.review_package_boundary_state,
    reviewer_selection_boundary_state: submissionPackage.reviewer_selection_boundary_state,
    submission_candidate_boundary_state: submissionPackage.submission_candidate_boundary_state,
    submission_package_boundary_state: submissionPackage.submission_package_boundary_state,
    submission_manifest_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: submissionPackage.claims_not_created,
    runtime_effects: submissionPackage.runtime_effects,
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

  submissionManifestBody.submission_manifest_sha256 = sha256Canonical(submissionManifestBody);

  return result(
    SUBMISSION_MANIFEST_STATE.RECORDED,
    'RPECRC_SUBMISSION_MANIFEST_RECORDED',
    deepFreeze(submissionManifestBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_MANIFEST_STATE,
  SUBMISSION_MANIFEST_PROTO,
  SUBMISSION_MANIFEST_KIND,
  SUBMISSION_MANIFEST_SCOPE,
  SUBMISSION_MANIFEST_RECORDS,
  createExternalReviewCandidateSubmissionManifest
});
