'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  AUDIT_INDEX_STATE,
  AUDIT_INDEX_PROTO,
  AUDIT_INDEX_KIND,
  createExternalReviewCandidateAuditIndex
} = require('./create-external-review-candidate-audit-index');

const REVIEW_PACKAGE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const REVIEW_PACKAGE_PROTO = 'HBCE-RPECRC-INTERNAL-REVIEW-PACKAGE-v1';
const REVIEW_PACKAGE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_REVIEW_PACKAGE';

const REVIEW_PACKAGE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_PACKAGE_ONLY: true,
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

const REVIEW_PACKAGE_SECTIONS = Object.freeze([
  Object.freeze({
    section_id: 'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-001',
    section_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-002',
    section_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-003',
    section_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-004',
    section_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-005',
    section_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-006',
    section_name: 'Human Execution Control',
    ref_field: 'human_execution_control_external_review_candidate_state'
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-REVIEW-PACKAGE-SECTION-007',
    section_name: 'Boundary State',
    ref_field: 'index_boundary_state'
  })
]);

function result(state, reason, reviewPackage) {
  if (reviewPackage) {
    return Object.freeze({ state, reason, review_package: reviewPackage });
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

function isAuditIndexBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === AUDIT_INDEX_PROTO &&
    value.kind === AUDIT_INDEX_KIND &&
    isNonEmptyString(value.audit_index_id) &&
    isNonEmptyString(value.audit_index_sha256)
  );
}

function resolveAuditIndex(source, context) {
  if (isPlainObject(source) && source.state === AUDIT_INDEX_STATE.RECORDED && isAuditIndexBody(source.index)) {
    return source.index;
  }

  if (isAuditIndexBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const indexResult = createExternalReviewCandidateAuditIndex(
    source,
    isPlainObject(context.audit_index_context) ? context.audit_index_context : {}
  );

  if (
    indexResult.state !== AUDIT_INDEX_STATE.RECORDED ||
    !isAuditIndexBody(indexResult.index)
  ) {
    return null;
  }

  return indexResult.index;
}

function reviewPackageSectionsSatisfied(index) {
  for (const section of REVIEW_PACKAGE_SECTIONS) {
    if (!isNonEmptyString(index[section.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(index) {
  return (
    isPlainObject(index.index_scope) &&
    index.index_scope.INTERNAL_TECHNICAL_INDEX_ONLY === true &&
    index.index_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    index.index_scope.EXTERNAL_REVIEW_OPINION === false &&
    index.index_scope.EXTERNAL_REVIEW_REPORT === false &&
    index.index_scope.LEGAL_CERTIFICATION === false &&
    index.index_scope.EIDAS_QUALIFICATION === false &&
    index.index_scope.OPC_ALLOW === false &&
    index.index_scope.DEPLOYMENT_SUCCESS === false &&
    index.index_scope.PRODUCTION_DEPLOYMENT === false &&
    index.index_scope.PUBLIC_REGISTRY_MUTATION === false &&
    index.index_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function createExternalReviewCandidateReviewPackage(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.review_package_id)) {
    return result(
      REVIEW_PACKAGE_STATE.INVALID,
      'RPECRC_REVIEW_PACKAGE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      REVIEW_PACKAGE_STATE.INVALID,
      'RPECRC_REVIEW_PACKAGE_GENERATED_AT_INVALID'
    );
  }

  const index = resolveAuditIndex(source, context);

  if (!index) {
    return result(
      REVIEW_PACKAGE_STATE.INVALID,
      'RPECRC_REVIEW_PACKAGE_AUDIT_INDEX_INVALID'
    );
  }

  const sectionsSatisfied = reviewPackageSectionsSatisfied(index);
  const preservedScope = scopePreserved(index);
  const preservedBoundary = (
    sectionsSatisfied &&
    preservedScope &&
    index.index_entries_satisfied === true &&
    index.manifest_entries_satisfied === true &&
    index.audit_sections_satisfied === true &&
    index.claims_not_created_preserved === true &&
    index.runtime_effects_preserved === true &&
    index.index_boundary_state === 'PRESERVED'
  );

  const reviewPackageBody = {
    proto: REVIEW_PACKAGE_PROTO,
    kind: REVIEW_PACKAGE_KIND,
    review_package_id: context.review_package_id,
    review_package_version: isNonEmptyString(context.review_package_version) ? context.review_package_version : '1.0',
    review_package_state: REVIEW_PACKAGE_STATE.RECORDED,
    generated_at: context.generated_at,
    review_package_scope: REVIEW_PACKAGE_SCOPE,
    audit_index_id: index.audit_index_id,
    audit_index_sha256: index.audit_index_sha256,
    audit_index_ref: 'runtime/external-review/create-external-review-candidate-audit-index.js',
    audit_index_proto: index.proto,
    audit_index_kind: index.kind,
    audit_manifest_id: index.audit_manifest_id,
    audit_manifest_sha256: index.audit_manifest_sha256,
    audit_manifest_ref: index.audit_manifest_ref,
    audit_package_id: index.audit_package_id,
    audit_package_sha256: index.audit_package_sha256,
    audit_package_ref: index.audit_package_ref,
    matrix_binding_id: index.matrix_binding_id,
    matrix_binding_sha256: index.matrix_binding_sha256,
    evidence_id: index.evidence_id,
    evidence_sha256: index.evidence_sha256,
    candidate_input_sha256: index.candidate_input_sha256,
    validation_output_sha256: index.validation_output_sha256,
    validation_state: index.validation_state,
    validation_reason: index.validation_reason,
    human_execution_control_external_review_candidate_state: index.human_execution_control_external_review_candidate_state,
    lifecycle_state: index.lifecycle_state,
    requirement_binding_count: index.requirement_binding_count,
    audit_section_count: index.audit_section_count,
    manifest_entry_count: index.manifest_entry_count,
    index_entry_count: index.index_entry_count,
    validator_test_count: index.validator_test_count,
    evidence_test_count: index.evidence_test_count,
    review_package_sections: REVIEW_PACKAGE_SECTIONS,
    review_package_section_count: REVIEW_PACKAGE_SECTIONS.length,
    review_package_sections_satisfied: sectionsSatisfied,
    index_entries_satisfied: index.index_entries_satisfied,
    manifest_entries_satisfied: index.manifest_entries_satisfied,
    audit_sections_satisfied: index.audit_sections_satisfied,
    claims_not_created_preserved: index.claims_not_created_preserved,
    runtime_effects_preserved: index.runtime_effects_preserved,
    boundary_flags_preserved: index.boundary_flags_preserved,
    boundary_guard_state: index.boundary_guard_state,
    matrix_boundary_state: index.matrix_boundary_state,
    audit_boundary_state: index.audit_boundary_state,
    manifest_boundary_state: index.manifest_boundary_state,
    index_boundary_state: index.index_boundary_state,
    review_package_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: index.claims_not_created,
    runtime_effects: index.runtime_effects,
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

  reviewPackageBody.review_package_sha256 = sha256Canonical(reviewPackageBody);

  return result(
    REVIEW_PACKAGE_STATE.RECORDED,
    'RPECRC_REVIEW_PACKAGE_RECORDED',
    deepFreeze(reviewPackageBody)
  );
}

module.exports = Object.freeze({
  REVIEW_PACKAGE_STATE,
  REVIEW_PACKAGE_PROTO,
  REVIEW_PACKAGE_KIND,
  REVIEW_PACKAGE_SCOPE,
  REVIEW_PACKAGE_SECTIONS,
  createExternalReviewCandidateReviewPackage
});
