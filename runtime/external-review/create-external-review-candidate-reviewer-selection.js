'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  REVIEW_PACKAGE_STATE,
  REVIEW_PACKAGE_PROTO,
  REVIEW_PACKAGE_KIND,
  createExternalReviewCandidateReviewPackage
} = require('./create-external-review-candidate-review-package');

const REVIEWER_SELECTION_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const REVIEWER_SELECTION_PROTO = 'HBCE-RPECRC-INTERNAL-REVIEWER-SELECTION-v1';
const REVIEWER_SELECTION_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_REVIEWER_SELECTION';

const REVIEWER_SELECTION_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SELECTION_ONLY: true,
  INTERNAL_REVIEWER_SELECTION_CANDIDATE: true,
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

const REVIEWER_SELECTION_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-001',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-002',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-003',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-004',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-005',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-006',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-REVIEWER-SELECTION-RECORD-007',
    record_name: 'Boundary State',
    ref_field: 'review_package_boundary_state'
  })
]);

function result(state, reason, reviewerSelection) {
  if (reviewerSelection) {
    return Object.freeze({ state, reason, reviewer_selection: reviewerSelection });
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

function isReviewPackageBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === REVIEW_PACKAGE_PROTO &&
    value.kind === REVIEW_PACKAGE_KIND &&
    isNonEmptyString(value.review_package_id) &&
    isNonEmptyString(value.review_package_sha256)
  );
}

function resolveReviewPackage(source, context) {
  if (
    isPlainObject(source) &&
    source.state === REVIEW_PACKAGE_STATE.RECORDED &&
    isReviewPackageBody(source.review_package)
  ) {
    return source.review_package;
  }

  if (isReviewPackageBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const reviewPackageResult = createExternalReviewCandidateReviewPackage(
    source,
    isPlainObject(context.review_package_context) ? context.review_package_context : {}
  );

  if (
    reviewPackageResult.state !== REVIEW_PACKAGE_STATE.RECORDED ||
    !isReviewPackageBody(reviewPackageResult.review_package)
  ) {
    return null;
  }

  return reviewPackageResult.review_package;
}

function reviewerSelectionRecordsSatisfied(reviewPackage) {
  for (const record of REVIEWER_SELECTION_RECORDS) {
    if (!isNonEmptyString(reviewPackage[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(reviewPackage) {
  return (
    isPlainObject(reviewPackage.review_package_scope) &&
    reviewPackage.review_package_scope.INTERNAL_TECHNICAL_PACKAGE_ONLY === true &&
    reviewPackage.review_package_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    reviewPackage.review_package_scope.EXTERNAL_REVIEW_OPINION === false &&
    reviewPackage.review_package_scope.EXTERNAL_REVIEW_REPORT === false &&
    reviewPackage.review_package_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    reviewPackage.review_package_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    reviewPackage.review_package_scope.LEGAL_CERTIFICATION === false &&
    reviewPackage.review_package_scope.EIDAS_QUALIFICATION === false &&
    reviewPackage.review_package_scope.OPC_ALLOW === false &&
    reviewPackage.review_package_scope.DEPLOYMENT_SUCCESS === false &&
    reviewPackage.review_package_scope.PRODUCTION_DEPLOYMENT === false &&
    reviewPackage.review_package_scope.PUBLIC_REGISTRY_MUTATION === false &&
    reviewPackage.review_package_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function createExternalReviewCandidateReviewerSelection(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.reviewer_selection_id)) {
    return result(
      REVIEWER_SELECTION_STATE.INVALID,
      'RPECRC_REVIEWER_SELECTION_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      REVIEWER_SELECTION_STATE.INVALID,
      'RPECRC_REVIEWER_SELECTION_GENERATED_AT_INVALID'
    );
  }

  const reviewPackage = resolveReviewPackage(source, context);

  if (!reviewPackage) {
    return result(
      REVIEWER_SELECTION_STATE.INVALID,
      'RPECRC_REVIEWER_SELECTION_REVIEW_PACKAGE_INVALID'
    );
  }

  const recordsSatisfied = reviewerSelectionRecordsSatisfied(reviewPackage);
  const preservedScope = scopePreserved(reviewPackage);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    reviewPackage.review_package_sections_satisfied === true &&
    reviewPackage.index_entries_satisfied === true &&
    reviewPackage.manifest_entries_satisfied === true &&
    reviewPackage.audit_sections_satisfied === true &&
    reviewPackage.claims_not_created_preserved === true &&
    reviewPackage.runtime_effects_preserved === true &&
    reviewPackage.review_package_boundary_state === 'PRESERVED'
  );

  const reviewerSelectionBody = {
    proto: REVIEWER_SELECTION_PROTO,
    kind: REVIEWER_SELECTION_KIND,
    reviewer_selection_id: context.reviewer_selection_id,
    reviewer_selection_version: defaultString(context.reviewer_selection_version, '1.0'),
    reviewer_selection_state: REVIEWER_SELECTION_STATE.RECORDED,
    generated_at: context.generated_at,
    reviewer_selection_scope: REVIEWER_SELECTION_SCOPE,
    reviewer_candidate_ref: defaultString(context.reviewer_candidate_ref, 'internal-reviewer-candidate:pending'),
    reviewer_selection_method: defaultString(context.reviewer_selection_method, 'INTERNAL_TECHNICAL_PRESELECTION'),
    reviewer_independence_basis: defaultString(context.reviewer_independence_basis, 'NOT_EXTERNALLY_ASSERTED'),
    reviewer_conflict_check_state: defaultString(context.reviewer_conflict_check_state, 'INTERNAL_PRECHECK_ONLY'),
    review_package_id: reviewPackage.review_package_id,
    review_package_sha256: reviewPackage.review_package_sha256,
    review_package_ref: 'runtime/external-review/create-external-review-candidate-review-package.js',
    review_package_proto: reviewPackage.proto,
    review_package_kind: reviewPackage.kind,
    audit_index_id: reviewPackage.audit_index_id,
    audit_index_sha256: reviewPackage.audit_index_sha256,
    audit_index_ref: reviewPackage.audit_index_ref,
    audit_manifest_id: reviewPackage.audit_manifest_id,
    audit_manifest_sha256: reviewPackage.audit_manifest_sha256,
    audit_manifest_ref: reviewPackage.audit_manifest_ref,
    audit_package_id: reviewPackage.audit_package_id,
    audit_package_sha256: reviewPackage.audit_package_sha256,
    audit_package_ref: reviewPackage.audit_package_ref,
    matrix_binding_id: reviewPackage.matrix_binding_id,
    matrix_binding_sha256: reviewPackage.matrix_binding_sha256,
    evidence_id: reviewPackage.evidence_id,
    evidence_sha256: reviewPackage.evidence_sha256,
    candidate_input_sha256: reviewPackage.candidate_input_sha256,
    validation_output_sha256: reviewPackage.validation_output_sha256,
    validation_state: reviewPackage.validation_state,
    validation_reason: reviewPackage.validation_reason,
    human_execution_control_external_review_candidate_state: reviewPackage.human_execution_control_external_review_candidate_state,
    lifecycle_state: reviewPackage.lifecycle_state,
    requirement_binding_count: reviewPackage.requirement_binding_count,
    audit_section_count: reviewPackage.audit_section_count,
    manifest_entry_count: reviewPackage.manifest_entry_count,
    index_entry_count: reviewPackage.index_entry_count,
    review_package_section_count: reviewPackage.review_package_section_count,
    validator_test_count: reviewPackage.validator_test_count,
    evidence_test_count: reviewPackage.evidence_test_count,
    reviewer_selection_records: REVIEWER_SELECTION_RECORDS,
    reviewer_selection_record_count: REVIEWER_SELECTION_RECORDS.length,
    reviewer_selection_records_satisfied: recordsSatisfied,
    review_package_sections_satisfied: reviewPackage.review_package_sections_satisfied,
    index_entries_satisfied: reviewPackage.index_entries_satisfied,
    manifest_entries_satisfied: reviewPackage.manifest_entries_satisfied,
    audit_sections_satisfied: reviewPackage.audit_sections_satisfied,
    claims_not_created_preserved: reviewPackage.claims_not_created_preserved,
    runtime_effects_preserved: reviewPackage.runtime_effects_preserved,
    boundary_flags_preserved: reviewPackage.boundary_flags_preserved,
    boundary_guard_state: reviewPackage.boundary_guard_state,
    matrix_boundary_state: reviewPackage.matrix_boundary_state,
    audit_boundary_state: reviewPackage.audit_boundary_state,
    manifest_boundary_state: reviewPackage.manifest_boundary_state,
    index_boundary_state: reviewPackage.index_boundary_state,
    review_package_boundary_state: reviewPackage.review_package_boundary_state,
    reviewer_selection_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: reviewPackage.claims_not_created,
    runtime_effects: reviewPackage.runtime_effects,
    external_reviewer_appointed: false,
    external_review_execution_created: false,
    external_review_opinion_created: false,
    external_review_report_created: false,
    external_review_submission_created: false,
    external_review_publication_created: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false
  };

  reviewerSelectionBody.reviewer_selection_sha256 = sha256Canonical(reviewerSelectionBody);

  return result(
    REVIEWER_SELECTION_STATE.RECORDED,
    'RPECRC_REVIEWER_SELECTION_RECORDED',
    deepFreeze(reviewerSelectionBody)
  );
}

module.exports = Object.freeze({
  REVIEWER_SELECTION_STATE,
  REVIEWER_SELECTION_PROTO,
  REVIEWER_SELECTION_KIND,
  REVIEWER_SELECTION_SCOPE,
  REVIEWER_SELECTION_RECORDS,
  createExternalReviewCandidateReviewerSelection
});
