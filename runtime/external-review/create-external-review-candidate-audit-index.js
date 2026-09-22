'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  AUDIT_MANIFEST_STATE,
  AUDIT_MANIFEST_PROTO,
  AUDIT_MANIFEST_KIND,
  createExternalReviewCandidateAuditManifest
} = require('./create-external-review-candidate-audit-manifest');

const AUDIT_INDEX_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const AUDIT_INDEX_PROTO = 'HBCE-RPECRC-INTERNAL-AUDIT-INDEX-v1';
const AUDIT_INDEX_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_AUDIT_INDEX';

const AUDIT_INDEX_SCOPE = Object.freeze({
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

const INDEX_ENTRIES = Object.freeze([
  Object.freeze({
    entry_id: 'HBCE-RPECRC-INDEX-ENTRY-001',
    entry_name: 'Source Contract',
    ref_field: 'source_contract_ref'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-INDEX-ENTRY-002',
    entry_name: 'Validator',
    ref_field: 'validator_ref'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-INDEX-ENTRY-003',
    entry_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-INDEX-ENTRY-004',
    entry_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-INDEX-ENTRY-005',
    entry_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-INDEX-ENTRY-006',
    entry_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    entry_id: 'HBCE-RPECRC-INDEX-ENTRY-007',
    entry_name: 'Boundary State',
    ref_field: 'manifest_boundary_state'
  })
]);

function result(state, reason, index) {
  if (index) {
    return Object.freeze({ state, reason, index });
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

function isAuditManifestBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === AUDIT_MANIFEST_PROTO &&
    value.kind === AUDIT_MANIFEST_KIND &&
    isNonEmptyString(value.audit_manifest_id) &&
    isNonEmptyString(value.audit_manifest_sha256)
  );
}

function resolveAuditManifest(source, context) {
  if (isPlainObject(source) && source.state === AUDIT_MANIFEST_STATE.RECORDED && isAuditManifestBody(source.manifest)) {
    return source.manifest;
  }

  if (isAuditManifestBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const manifestResult = createExternalReviewCandidateAuditManifest(
    source,
    isPlainObject(context.audit_manifest_context) ? context.audit_manifest_context : {}
  );

  if (
    manifestResult.state !== AUDIT_MANIFEST_STATE.RECORDED ||
    !isAuditManifestBody(manifestResult.manifest)
  ) {
    return null;
  }

  return manifestResult.manifest;
}

function indexEntriesSatisfied(manifest) {
  for (const entry of INDEX_ENTRIES) {
    if (!isNonEmptyString(manifest[entry.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(manifest) {
  return (
    isPlainObject(manifest.manifest_scope) &&
    manifest.manifest_scope.INTERNAL_TECHNICAL_INDEX_ONLY === true &&
    manifest.manifest_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    manifest.manifest_scope.EXTERNAL_REVIEW_OPINION === false &&
    manifest.manifest_scope.EXTERNAL_REVIEW_REPORT === false &&
    manifest.manifest_scope.LEGAL_CERTIFICATION === false &&
    manifest.manifest_scope.EIDAS_QUALIFICATION === false &&
    manifest.manifest_scope.OPC_ALLOW === false &&
    manifest.manifest_scope.DEPLOYMENT_SUCCESS === false &&
    manifest.manifest_scope.PRODUCTION_DEPLOYMENT === false &&
    manifest.manifest_scope.PUBLIC_REGISTRY_MUTATION === false &&
    manifest.manifest_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function createExternalReviewCandidateAuditIndex(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.audit_index_id)) {
    return result(
      AUDIT_INDEX_STATE.INVALID,
      'RPECRC_AUDIT_INDEX_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      AUDIT_INDEX_STATE.INVALID,
      'RPECRC_AUDIT_INDEX_GENERATED_AT_INVALID'
    );
  }

  const manifest = resolveAuditManifest(source, context);

  if (!manifest) {
    return result(
      AUDIT_INDEX_STATE.INVALID,
      'RPECRC_AUDIT_INDEX_AUDIT_MANIFEST_INVALID'
    );
  }

  const entriesSatisfied = indexEntriesSatisfied(manifest);
  const preservedScope = scopePreserved(manifest);
  const preservedBoundary = (
    entriesSatisfied &&
    preservedScope &&
    manifest.manifest_entries_satisfied === true &&
    manifest.audit_sections_satisfied === true &&
    manifest.claims_not_created_preserved === true &&
    manifest.runtime_effects_preserved === true &&
    manifest.manifest_boundary_state === 'PRESERVED'
  );

  const indexBody = {
    proto: AUDIT_INDEX_PROTO,
    kind: AUDIT_INDEX_KIND,
    audit_index_id: context.audit_index_id,
    audit_index_version: isNonEmptyString(context.audit_index_version) ? context.audit_index_version : '1.0',
    audit_index_state: AUDIT_INDEX_STATE.RECORDED,
    generated_at: context.generated_at,
    index_scope: AUDIT_INDEX_SCOPE,
    audit_manifest_id: manifest.audit_manifest_id,
    audit_manifest_sha256: manifest.audit_manifest_sha256,
    audit_manifest_ref: 'runtime/external-review/create-external-review-candidate-audit-manifest.js',
    audit_manifest_proto: manifest.proto,
    audit_manifest_kind: manifest.kind,
    audit_package_id: manifest.audit_package_id,
    audit_package_sha256: manifest.audit_package_sha256,
    audit_package_ref: manifest.audit_package_ref,
    matrix_binding_id: manifest.matrix_binding_id,
    matrix_binding_sha256: manifest.matrix_binding_sha256,
    evidence_id: manifest.evidence_id,
    evidence_sha256: manifest.evidence_sha256,
    candidate_input_sha256: manifest.candidate_input_sha256,
    validation_output_sha256: manifest.validation_output_sha256,
    validation_state: manifest.validation_state,
    validation_reason: manifest.validation_reason,
    human_execution_control_external_review_candidate_state: manifest.human_execution_control_external_review_candidate_state,
    lifecycle_state: manifest.lifecycle_state,
    requirement_binding_count: manifest.requirement_binding_count,
    audit_section_count: manifest.audit_section_count,
    manifest_entry_count: manifest.manifest_entry_count,
    validator_test_count: manifest.validator_test_count,
    evidence_test_count: manifest.evidence_test_count,
    index_entries: INDEX_ENTRIES,
    index_entry_count: INDEX_ENTRIES.length,
    index_entries_satisfied: entriesSatisfied,
    manifest_entries_satisfied: manifest.manifest_entries_satisfied,
    audit_sections_satisfied: manifest.audit_sections_satisfied,
    claims_not_created_preserved: manifest.claims_not_created_preserved,
    runtime_effects_preserved: manifest.runtime_effects_preserved,
    boundary_flags_preserved: manifest.boundary_flags_preserved,
    boundary_guard_state: manifest.boundary_guard_state,
    matrix_boundary_state: manifest.matrix_boundary_state,
    audit_boundary_state: manifest.audit_boundary_state,
    manifest_boundary_state: manifest.manifest_boundary_state,
    index_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: manifest.claims_not_created,
    runtime_effects: manifest.runtime_effects,
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

  indexBody.audit_index_sha256 = sha256Canonical(indexBody);

  return result(
    AUDIT_INDEX_STATE.RECORDED,
    'RPECRC_AUDIT_INDEX_RECORDED',
    deepFreeze(indexBody)
  );
}

module.exports = Object.freeze({
  AUDIT_INDEX_STATE,
  AUDIT_INDEX_PROTO,
  AUDIT_INDEX_KIND,
  AUDIT_INDEX_SCOPE,
  INDEX_ENTRIES,
  createExternalReviewCandidateAuditIndex
});
