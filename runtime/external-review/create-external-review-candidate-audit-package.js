'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  MATRIX_BINDING_STATE,
  MATRIX_BINDING_PROTO,
  MATRIX_BINDING_KIND,
  MATRIX_VERSION,
  createExternalReviewCandidateMatrixBinding
} = require('./create-external-review-candidate-matrix-binding');

const AUDIT_PACKAGE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const AUDIT_PACKAGE_PROTO = 'HBCE-RPECRC-INTERNAL-AUDIT-PACKAGE-v1';
const AUDIT_PACKAGE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_AUDIT_PACKAGE';

const AUDIT_PACKAGE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_REVIEW_ONLY: true,
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

const AUDIT_SECTIONS = Object.freeze([
  Object.freeze({
    section_id: 'HBCE-RPECRC-AUDIT-SECTION-001',
    section_name: 'Source Contract',
    required_refs: Object.freeze([
      'source_contract_ref'
    ])
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-AUDIT-SECTION-002',
    section_name: 'Validator',
    required_refs: Object.freeze([
      'validator_ref',
      'validation_state',
      'validation_reason'
    ])
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-AUDIT-SECTION-003',
    section_name: 'Validation Evidence',
    required_refs: Object.freeze([
      'evidence_id',
      'evidence_sha256',
      'candidate_input_sha256',
      'validation_output_sha256'
    ])
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-AUDIT-SECTION-004',
    section_name: 'MATRIX Requirement Binding',
    required_refs: Object.freeze([
      'matrix_version',
      'requirement_bindings',
      'requirement_binding_count',
      'validator_test_count',
      'evidence_test_count'
    ])
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-AUDIT-SECTION-005',
    section_name: 'Boundary Preservation',
    required_refs: Object.freeze([
      'claims_not_created_preserved',
      'runtime_effects_preserved',
      'boundary_flags_preserved',
      'boundary_guard_state',
      'matrix_boundary_state'
    ])
  }),
  Object.freeze({
    section_id: 'HBCE-RPECRC-AUDIT-SECTION-006',
    section_name: 'Human Gate',
    required_refs: Object.freeze([
      'human_execution_control_external_review_candidate_state',
      'lifecycle_state'
    ])
  })
]);

function result(state, reason, auditPackage) {
  if (auditPackage) {
    return Object.freeze({ state, reason, audit_package: auditPackage });
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

function normalizeMatrixBindingResult(candidateOrMatrixBindingResult, matrixBindingContext) {
  if (
    isPlainObject(candidateOrMatrixBindingResult) &&
    candidateOrMatrixBindingResult.state === MATRIX_BINDING_STATE.RECORDED &&
    candidateOrMatrixBindingResult.reason === 'RPECRC_MATRIX_BINDING_RECORDED' &&
    isPlainObject(candidateOrMatrixBindingResult.binding)
  ) {
    return candidateOrMatrixBindingResult;
  }

  if (isPlainObject(matrixBindingContext)) {
    return createExternalReviewCandidateMatrixBinding(candidateOrMatrixBindingResult, matrixBindingContext);
  }

  return null;
}

function sectionRefsSatisfied(binding, section) {
  for (const ref of section.required_refs) {
    if (!(ref in binding)) {
      return false;
    }
  }

  return true;
}

function auditSectionsSatisfied(binding) {
  return AUDIT_SECTIONS.every(section => sectionRefsSatisfied(binding, section));
}

function boundaryScopePreserved(binding) {
  return (
    binding.claims_not_created_preserved === true &&
    binding.runtime_effects_preserved === true &&
    binding.boundary_flags_preserved === true &&
    binding.boundary_guard_state === 'PRESERVED' &&
    binding.matrix_boundary_state === 'PRESERVED' &&
    binding.claims_not_created.legal_certification === false &&
    binding.claims_not_created.eidas_qualification === false &&
    binding.claims_not_created.opc_allow === false &&
    binding.claims_not_created.deployment_success === false &&
    binding.claims_not_created.production_deployment === false &&
    binding.claims_not_created.public_registry_mutation === false &&
    binding.claims_not_created.external_trust_registry_mutation === false &&
    binding.runtime_effects.legal_certification_created === false &&
    binding.runtime_effects.eidas_qualification_created === false &&
    binding.runtime_effects.opc_allow_created === false &&
    binding.runtime_effects.deployment_success_proven === false &&
    binding.runtime_effects.production_deployment_proven === false &&
    binding.runtime_effects.public_registry_mutated === false &&
    binding.runtime_effects.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateAuditPackage(candidateOrMatrixBindingResult, context) {
  if (!isPlainObject(context)) {
    return result(AUDIT_PACKAGE_STATE.INVALID, 'RPECRC_AUDIT_PACKAGE_CONTEXT_INVALID');
  }

  if (!isNonEmptyString(context.audit_package_id)) {
    return result(AUDIT_PACKAGE_STATE.INVALID, 'RPECRC_AUDIT_PACKAGE_ID_INVALID');
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(AUDIT_PACKAGE_STATE.INVALID, 'RPECRC_AUDIT_PACKAGE_GENERATED_AT_INVALID');
  }

  const matrixBindingResult = normalizeMatrixBindingResult(
    candidateOrMatrixBindingResult,
    context.matrix_binding_context
  );

  if (
    !matrixBindingResult ||
    matrixBindingResult.state !== MATRIX_BINDING_STATE.RECORDED ||
    !isPlainObject(matrixBindingResult.binding)
  ) {
    return result(AUDIT_PACKAGE_STATE.INVALID, 'RPECRC_AUDIT_PACKAGE_MATRIX_BINDING_INVALID');
  }

  const binding = matrixBindingResult.binding;

  if (binding.proto !== MATRIX_BINDING_PROTO || binding.kind !== MATRIX_BINDING_KIND) {
    return result(AUDIT_PACKAGE_STATE.INVALID, 'RPECRC_AUDIT_PACKAGE_MATRIX_BINDING_PROTO_INVALID');
  }

  const sectionsSatisfied = auditSectionsSatisfied(binding);
  const boundaryPreserved = boundaryScopePreserved(binding);

  const auditPackageBody = {
    proto: AUDIT_PACKAGE_PROTO,
    kind: AUDIT_PACKAGE_KIND,
    audit_package_id: context.audit_package_id,
    audit_package_version: isNonEmptyString(context.audit_package_version) ? context.audit_package_version : '1.0',
    audit_package_state: AUDIT_PACKAGE_STATE.RECORDED,
    generated_at: context.generated_at,
    audit_scope: AUDIT_PACKAGE_SCOPE,
    matrix_binding_id: binding.binding_id,
    matrix_binding_sha256: sha256Canonical(binding),
    matrix_version: isNonEmptyString(binding.matrix_version) ? binding.matrix_version : MATRIX_VERSION,
    source_contract_ref: binding.source_contract_ref,
    validator_ref: binding.validator_ref,
    evidence_creator_ref: binding.evidence_creator_ref,
    evidence_id: binding.evidence_id,
    evidence_sha256: binding.evidence_sha256,
    candidate_input_sha256: binding.candidate_input_sha256,
    validation_output_sha256: binding.validation_output_sha256,
    validation_state: binding.validation_state,
    validation_reason: binding.validation_reason,
    human_execution_control_external_review_candidate_state: binding.human_execution_control_external_review_candidate_state,
    lifecycle_state: binding.lifecycle_state,
    requirement_binding_count: binding.requirement_binding_count,
    validator_test_count: binding.validator_test_count,
    evidence_test_count: binding.evidence_test_count,
    requirement_bindings: binding.requirement_bindings,
    audit_sections: AUDIT_SECTIONS,
    audit_section_count: AUDIT_SECTIONS.length,
    audit_sections_satisfied: sectionsSatisfied,
    claims_not_created_preserved: binding.claims_not_created_preserved,
    runtime_effects_preserved: binding.runtime_effects_preserved,
    boundary_flags_preserved: binding.boundary_flags_preserved,
    boundary_guard_state: binding.boundary_guard_state,
    matrix_boundary_state: binding.matrix_boundary_state,
    audit_boundary_state: boundaryPreserved && sectionsSatisfied ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: binding.claims_not_created,
    runtime_effects: binding.runtime_effects,
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

  auditPackageBody.audit_package_sha256 = sha256Canonical(auditPackageBody);

  return result(
    AUDIT_PACKAGE_STATE.RECORDED,
    'RPECRC_AUDIT_PACKAGE_RECORDED',
    deepFreeze(auditPackageBody)
  );
}

module.exports = Object.freeze({
  AUDIT_PACKAGE_STATE,
  AUDIT_PACKAGE_PROTO,
  AUDIT_PACKAGE_KIND,
  AUDIT_PACKAGE_SCOPE,
  AUDIT_SECTIONS,
  createExternalReviewCandidateAuditPackage
});
