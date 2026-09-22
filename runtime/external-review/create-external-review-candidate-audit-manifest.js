'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  AUDIT_PACKAGE_STATE,
  AUDIT_PACKAGE_PROTO,
  AUDIT_PACKAGE_KIND,
  createExternalReviewCandidateAuditPackage
} = require('./create-external-review-candidate-audit-package');

const AUDIT_MANIFEST_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const AUDIT_MANIFEST_PROTO = 'HBCE-RPECRC-INTERNAL-AUDIT-MANIFEST-v1';
const AUDIT_MANIFEST_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_AUDIT_MANIFEST';

const AUDIT_MANIFEST_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_INDEX_ONLY: true,
  EXTERNAL_REVIEW_EXECUTION: false,
  EXTERNAL_REVIEW_OPINION: false,
  EXTERNAL_REVIEW_REPORT: false,
  LEGAL_CERTIFICATION: false,
  EIDAS_QUALIFICATION: false,
  OPC_ALLOW: false,
  DEPLOYMENT_SUCCESS: false,
  PRODUCTION_DEPLOYMENT: false,
  PUBLIC_REGISTRY_MUTATION: false,
  EXTERNAL_TRUST_REGISTRY_MUTATION: false
});

const MANIFEST_ENTRIES = Object.freeze([
  Object.freeze({
    entry_id: 'HBCE-RPECRC-MANIFEST-ENTRY-001',
    entry_name: 'Source Contract',
    ref_field: 'source_contract_ref'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-MANIFEST-ENTRY-002',
    entry_name: 'Validator',
    ref_field: 'validator_ref'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-MANIFEST-ENTRY-003',
    entry_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-MANIFEST-ENTRY-004',
    entry_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-MANIFEST-ENTRY-005',
    entry_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-MANIFEST-ENTRY-006',
    entry_name: 'Boundary State',
    ref_field: 'audit_boundary_state'
  })
]);

function result(state, reason, manifest) {
  if (manifest) {
    return Object.freeze({ state, reason, manifest });
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
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);

  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }

  return value;
}

function normalizeAuditPackageResult(candidateOrAuditPackageResult, auditPackageContext) {
  if (
    isPlainObject(candidateOrAuditPackageResult) &&
    candidateOrAuditPackageResult.state === AUDIT_PACKAGE_STATE.RECORDED &&
    candidateOrAuditPackageResult.reason === 'RPECRC_AUDIT_PACKAGE_RECORDED' &&
    isPlainObject(candidateOrAuditPackageResult.audit_package)
  ) {
    return candidateOrAuditPackageResult;
  }

  if (isPlainObject(auditPackageContext)) {
    return createExternalReviewCandidateAuditPackage(candidateOrAuditPackageResult, auditPackageContext);
  }

  return null;
}

function manifestEntriesSatisfied(auditPackage) {
  for (const entry of MANIFEST_ENTRIES) {
    if (!(entry.ref_field in auditPackage)) {
      return false;
    }
  }

  return true;
}

function scopePreserved(auditPackage) {
  return (
    auditPackage.external_review_execution_created === false &&
    auditPackage.external_review_opinion_created === false &&
    auditPackage.external_review_report_created === false &&
    auditPackage.legal_certification_created === false &&
    auditPackage.eidas_qualification_created === false &&
    auditPackage.opc_allow_created === false &&
    auditPackage.deployment_success_proven === false &&
    auditPackage.production_deployment_proven === false &&
    auditPackage.public_registry_mutated === false &&
    auditPackage.external_trust_registry_mutated === false &&
    auditPackage.claims_not_created.legal_certification === false &&
    auditPackage.claims_not_created.eidas_qualification === false &&
    auditPackage.claims_not_created.opc_allow === false &&
    auditPackage.claims_not_created.deployment_success === false &&
    auditPackage.claims_not_created.production_deployment === false &&
    auditPackage.claims_not_created.public_registry_mutation === false &&
    auditPackage.claims_not_created.external_trust_registry_mutation === false
  );
}

function createExternalReviewCandidateAuditManifest(candidateOrAuditPackageResult, context) {
  if (!isPlainObject(context)) {
    return result(AUDIT_MANIFEST_STATE.INVALID, 'RPECRC_AUDIT_MANIFEST_CONTEXT_INVALID');
  }

  if (!isNonEmptyString(context.audit_manifest_id)) {
    return result(AUDIT_MANIFEST_STATE.INVALID, 'RPECRC_AUDIT_MANIFEST_ID_INVALID');
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(AUDIT_MANIFEST_STATE.INVALID, 'RPECRC_AUDIT_MANIFEST_GENERATED_AT_INVALID');
  }

  const auditPackageResult = normalizeAuditPackageResult(
    candidateOrAuditPackageResult,
    context.audit_package_context
  );

  if (
    !auditPackageResult ||
    auditPackageResult.state !== AUDIT_PACKAGE_STATE.RECORDED ||
    !isPlainObject(auditPackageResult.audit_package)
  ) {
    return result(AUDIT_MANIFEST_STATE.INVALID, 'RPECRC_AUDIT_MANIFEST_AUDIT_PACKAGE_INVALID');
  }

  const auditPackage = auditPackageResult.audit_package;

  if (auditPackage.proto !== AUDIT_PACKAGE_PROTO || auditPackage.kind !== AUDIT_PACKAGE_KIND) {
    return result(AUDIT_MANIFEST_STATE.INVALID, 'RPECRC_AUDIT_MANIFEST_AUDIT_PACKAGE_PROTO_INVALID');
  }

  const entriesSatisfied = manifestEntriesSatisfied(auditPackage);
  const preservedScope = scopePreserved(auditPackage);
  const preservedBoundary = (
    entriesSatisfied &&
    preservedScope &&
    auditPackage.audit_sections_satisfied === true &&
    auditPackage.claims_not_created_preserved === true &&
    auditPackage.runtime_effects_preserved === true &&
    auditPackage.audit_boundary_state === 'PRESERVED'
  );

  const manifestBody = {
    proto: AUDIT_MANIFEST_PROTO,
    kind: AUDIT_MANIFEST_KIND,
    audit_manifest_id: context.audit_manifest_id,
    audit_manifest_version: isNonEmptyString(context.audit_manifest_version) ? context.audit_manifest_version : '1.0',
    audit_manifest_state: AUDIT_MANIFEST_STATE.RECORDED,
    generated_at: context.generated_at,
    manifest_scope: AUDIT_MANIFEST_SCOPE,
    audit_package_id: auditPackage.audit_package_id,
    audit_package_sha256: auditPackage.audit_package_sha256,
    audit_package_ref: 'runtime/external-review/create-external-review-candidate-audit-package.js',
    audit_package_proto: auditPackage.proto,
    audit_package_kind: auditPackage.kind,
    matrix_binding_id: auditPackage.matrix_binding_id,
    matrix_binding_sha256: auditPackage.matrix_binding_sha256,
    matrix_version: auditPackage.matrix_version,
    source_contract_ref: auditPackage.source_contract_ref,
    validator_ref: auditPackage.validator_ref,
    evidence_creator_ref: auditPackage.evidence_creator_ref,
    evidence_id: auditPackage.evidence_id,
    evidence_sha256: auditPackage.evidence_sha256,
    candidate_input_sha256: auditPackage.candidate_input_sha256,
    validation_output_sha256: auditPackage.validation_output_sha256,
    validation_state: auditPackage.validation_state,
    validation_reason: auditPackage.validation_reason,
    human_execution_control_external_review_candidate_state: auditPackage.human_execution_control_external_review_candidate_state,
    lifecycle_state: auditPackage.lifecycle_state,
    requirement_binding_count: auditPackage.requirement_binding_count,
    audit_section_count: auditPackage.audit_section_count,
    validator_test_count: auditPackage.validator_test_count,
    evidence_test_count: auditPackage.evidence_test_count,
    manifest_entries: MANIFEST_ENTRIES,
    manifest_entry_count: MANIFEST_ENTRIES.length,
    manifest_entries_satisfied: entriesSatisfied,
    audit_sections_satisfied: auditPackage.audit_sections_satisfied,
    claims_not_created_preserved: auditPackage.claims_not_created_preserved,
    runtime_effects_preserved: auditPackage.runtime_effects_preserved,
    boundary_flags_preserved: auditPackage.boundary_flags_preserved,
    boundary_guard_state: auditPackage.boundary_guard_state,
    matrix_boundary_state: auditPackage.matrix_boundary_state,
    audit_boundary_state: auditPackage.audit_boundary_state,
    manifest_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: auditPackage.claims_not_created,
    runtime_effects: auditPackage.runtime_effects,
    external_review_execution_created: false,
    external_review_opinion_created: false,
    external_review_report_created: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false
  };

  manifestBody.audit_manifest_sha256 = sha256Canonical(manifestBody);

  return result(
    AUDIT_MANIFEST_STATE.RECORDED,
    'RPECRC_AUDIT_MANIFEST_RECORDED',
    deepFreeze(manifestBody)
  );
}

module.exports = Object.freeze({
  AUDIT_MANIFEST_STATE,
  AUDIT_MANIFEST_PROTO,
  AUDIT_MANIFEST_KIND,
  AUDIT_MANIFEST_SCOPE,
  MANIFEST_ENTRIES,
  createExternalReviewCandidateAuditManifest
});
