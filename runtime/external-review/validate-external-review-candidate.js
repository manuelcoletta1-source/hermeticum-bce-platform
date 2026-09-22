'use strict';

const STATE = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID'
});

const READY_CERTIFICATION_RESULTS = new Set([
  'PRODUCTION_READINESS_EXECUTION_CONTROL_CERTIFICATION_CANDIDATE_READY',
  'PRODUCTION_READINESS_EXECUTION_CONTROL_CERTIFICATION_CANDIDATE_READY_WITH_LIMITATIONS'
]);

const READY_EXTERNAL_REVIEW_STATUSES = new Set([
  'EXTERNAL_REVIEW_CANDIDATE_READY',
  'EXTERNAL_REVIEW_CANDIDATE_READY_WITH_LIMITATIONS'
]);

const READY_EXTERNAL_REVIEW_RESULTS = new Set([
  'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_READY',
  'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_READY_WITH_LIMITATIONS'
]);

const READY_HUMAN_STATES = new Set([
  'READY',
  'READY_WITH_LIMITATIONS'
]);

const READY_LIFECYCLE_STATES = new Set([
  'EXTERNAL_REVIEW_CANDIDATE_READY',
  'EXTERNAL_REVIEW_CANDIDATE_READY_WITH_LIMITATIONS'
]);

const REQUIRED_STRING_FIELDS = Object.freeze([
  'request_id',
  'production_readiness_execution_control_external_review_candidate_id',
  'production_readiness_execution_control_external_review_candidate_version',
  'production_readiness_execution_control_external_review_candidate_status',
  'production_readiness_execution_control_external_review_candidate_result',
  'release_candidate_id',
  'release_candidate_version',
  'production_readiness_execution_control_certification_candidate_ref',
  'production_readiness_execution_control_certification_candidate_hash',
  'production_readiness_execution_control_certification_candidate_result',
  'production_readiness_execution_control_attestation_ref',
  'production_readiness_execution_control_attestation_hash',
  'production_readiness_execution_control_attestation_result',
  'production_readiness_execution_control_seal_ref',
  'production_readiness_execution_control_seal_hash',
  'production_readiness_execution_control_seal_result',
  'production_readiness_execution_control_finalization_ref',
  'production_readiness_execution_control_finalization_hash',
  'production_readiness_execution_control_destruction_ref',
  'production_readiness_execution_control_destruction_hash',
  'production_readiness_execution_control_disposition_ref',
  'production_readiness_execution_control_disposition_hash',
  'production_readiness_execution_control_retention_ref',
  'production_readiness_execution_control_retention_hash',
  'production_readiness_execution_control_archive_ref',
  'production_readiness_execution_control_archive_hash',
  'production_readiness_execution_control_closure_ref',
  'production_readiness_execution_control_closure_hash',
  'production_readiness_execution_control_signoff_ref',
  'production_readiness_execution_control_signoff_hash',
  'production_readiness_execution_control_completion_ref',
  'production_readiness_execution_control_completion_hash',
  'production_readiness_execution_control_matrix_publication_ref',
  'production_readiness_execution_control_matrix_publication_hash',
  'production_readiness_execution_control_matrix_acceptance_ref',
  'production_readiness_execution_control_matrix_acceptance_hash',
  'production_readiness_execution_control_matrix_update_ref',
  'production_readiness_execution_control_matrix_update_hash',
  'production_readiness_execution_control_consequence_ref',
  'production_readiness_execution_control_consequence_hash',
  'production_readiness_execution_control_evidence_ref',
  'production_readiness_execution_control_evidence_hash',
  'external_review_candidate_ref',
  'external_review_candidate_hash',
  'external_review_candidate_scope_ref',
  'external_review_candidate_scope_hash',
  'external_review_candidate_policy_ref',
  'external_review_candidate_policy_hash',
  'external_review_candidate_criteria_ref',
  'external_review_candidate_criteria_hash',
  'external_review_candidate_authority_ref',
  'external_review_candidate_authority_hash',
  'external_review_candidate_material_ref',
  'external_review_candidate_material_hash',
  'external_review_candidate_statement_ref',
  'external_review_candidate_statement_hash',
  'external_review_candidate_binding_ref',
  'external_review_candidate_audit_ref',
  'external_review_candidate_risk_ref',
  'external_review_candidate_rollback_ref',
  'external_review_candidate_delta_ref',
  'external_review_candidate_delta_hash',
  'external_review_candidate_register_ref',
  'external_review_candidate_register_hash',
  'external_review_candidate_plan_ref',
  'external_review_candidate_plan_hash',
  'external_review_candidate_manifest_ref',
  'external_review_candidate_manifest_hash',
  'external_review_package_candidate_ref',
  'external_review_package_candidate_hash',
  'external_reviewer_selection_candidate_ref',
  'external_reviewer_selection_candidate_hash',
  'external_submission_candidate_ref',
  'external_submission_candidate_hash',
  'external_review_candidate_limitations',
  'external_review_candidate_residual_risk_refs',
  'external_review_candidate_reason_code',
  'external_review_candidate_reason_text',
  'production_readiness_execution_control_external_review_candidate_hash',
  'human_execution_control_external_review_candidate_state',
  'human_acceptance_state',
  'lifecycle_state'
]);

const HASH_FIELDS = Object.freeze([
  'production_readiness_execution_control_certification_candidate_hash',
  'production_readiness_execution_control_attestation_hash',
  'production_readiness_execution_control_seal_hash',
  'production_readiness_execution_control_finalization_hash',
  'production_readiness_execution_control_destruction_hash',
  'production_readiness_execution_control_disposition_hash',
  'production_readiness_execution_control_retention_hash',
  'production_readiness_execution_control_archive_hash',
  'production_readiness_execution_control_closure_hash',
  'production_readiness_execution_control_signoff_hash',
  'production_readiness_execution_control_completion_hash',
  'production_readiness_execution_control_matrix_publication_hash',
  'production_readiness_execution_control_matrix_acceptance_hash',
  'production_readiness_execution_control_matrix_update_hash',
  'production_readiness_execution_control_consequence_hash',
  'production_readiness_execution_control_evidence_hash',
  'external_review_candidate_hash',
  'external_review_candidate_scope_hash',
  'external_review_candidate_policy_hash',
  'external_review_candidate_criteria_hash',
  'external_review_candidate_authority_hash',
  'external_review_candidate_material_hash',
  'external_review_candidate_statement_hash',
  'external_review_candidate_delta_hash',
  'external_review_candidate_register_hash',
  'external_review_candidate_plan_hash',
  'external_review_candidate_manifest_hash',
  'external_review_package_candidate_hash',
  'external_reviewer_selection_candidate_hash',
  'external_submission_candidate_hash',
  'production_readiness_execution_control_external_review_candidate_hash'
]);

const REQUIRED_FIELD_REASONS = Object.freeze({
  request_id: 'RPECRC_REQUEST_INVALID',
  production_readiness_execution_control_certification_candidate_ref: 'RPECRC_CERTIFICATION_CANDIDATE_MISSING',
  production_readiness_execution_control_certification_candidate_hash: 'RPECRC_CERTIFICATION_CANDIDATE_HASH_MISSING',
  production_readiness_execution_control_attestation_ref: 'RPECRC_ATTESTATION_MISSING',
  external_review_candidate_ref: 'RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING',
  external_review_candidate_scope_ref: 'RPECRC_SCOPE_MISSING',
  external_review_candidate_policy_ref: 'RPECRC_POLICY_MISSING',
  external_review_candidate_criteria_ref: 'RPECRC_CRITERIA_MISSING',
  external_review_candidate_authority_ref: 'RPECRC_AUTHORITY_MISSING',
  external_review_candidate_material_ref: 'RPECRC_MATERIAL_MISSING',
  external_review_candidate_statement_ref: 'RPECRC_STATEMENT_MISSING',
  external_review_candidate_binding_ref: 'RPECRC_BINDING_MISSING',
  external_review_candidate_audit_ref: 'RPECRC_AUDIT_MISSING',
  external_review_candidate_risk_ref: 'RPECRC_RISK_REGISTER_MISSING',
  external_review_candidate_rollback_ref: 'RPECRC_ROLLBACK_REF_MISSING',
  external_review_candidate_delta_ref: 'RPECRC_DELTA_MISSING',
  external_review_candidate_plan_ref: 'RPECRC_PLAN_MISSING',
  external_review_candidate_manifest_ref: 'RPECRC_MANIFEST_MISSING',
  external_review_package_candidate_ref: 'RPECRC_REVIEW_PACKAGE_CANDIDATE_MISSING',
  external_reviewer_selection_candidate_ref: 'RPECRC_REVIEWER_SELECTION_CANDIDATE_MISSING',
  external_submission_candidate_ref: 'RPECRC_SUBMISSION_CANDIDATE_MISSING',
  production_readiness_execution_control_external_review_candidate_hash: 'RPECRC_HASH_MISSING',
  external_review_candidate_register_ref: 'RPECRC_REGISTER_MISSING'
});

const HASH_FIELD_REASONS = Object.freeze({
  production_readiness_execution_control_certification_candidate_hash: 'RPECRC_CERTIFICATION_CANDIDATE_HASH_MISMATCH',
  external_review_candidate_hash: 'RPECRC_EXTERNAL_REVIEW_CANDIDATE_HASH_MISMATCH'
});

const BOUNDARY_FALSE_FIELDS = Object.freeze([
  'production_deployment',
  'deployment_authorization',
  'deployment_execution',
  'deployment_readiness',
  'deployment_completion',
  'deployment_success',
  'deployment_signoff',
  'deployment_approval',
  'deployment_closure',
  'deployment_archive',
  'deployment_retention',
  'deployment_disposition',
  'deployment_destruction',
  'deployment_finalization',
  'deployment_seal',
  'deployment_attestation',
  'deployment_certification',
  'deployment_execution_gate_open',
  'deployment_evidence_creation',
  'deployment_consequence_creation',
  'deployment_matrix_update_execution',
  'deployment_matrix_acceptance_execution',
  'deployment_matrix_publication_execution',
  'runtime_mutation',
  'runtime_deletion',
  'runtime_destruction',
  'data_destruction_execution',
  'data_erasure_execution',
  'external_publication_execution',
  'external_submission_execution',
  'external_review_execution',
  'external_review_acceptance',
  'external_review_approval',
  'external_review_opinion',
  'external_review_report_issued',
  'public_registry_mutation',
  'external_trust_registry_mutation',
  'l3_promotion',
  'l3_readiness',
  'postgresql_runtime_readiness',
  'postgresql_runtime_execution',
  'p04_p05_concurrency_execution',
  'opc_allow',
  'legal_certification',
  'eidas_qualification',
  'qualified_electronic_attestation',
  'qualified_electronic_seal',
  'qualified_trust_service',
  'trust_service_provider_status',
  'conformity_assessment_body_status',
  'regulated_kyc_aml_provider_status'
]);

const FORBIDDEN_TOP_LEVEL_TRUE_FIELDS = Object.freeze([
  'external_review_execution',
  'external_review_executed',
  'external_review_acceptance',
  'external_review_approval',
  'external_review_opinion',
  'external_review_opinion_issued',
  'external_review_report',
  'external_review_report_issued',
  'external_submission_execution',
  'external_submission_executed',
  'external_publication_execution',
  'legal_certification',
  'eidas_qualification',
  'qualified_electronic_attestation',
  'qualified_electronic_seal',
  'qualified_trust_service',
  'trust_service_provider_status',
  'conformity_assessment_body_status',
  'opc_allow',
  'regulated_kyc_aml_provider_status',
  'deployment_certification',
  'deployment_success',
  'production_deployment',
  'deployment_authorization',
  'deployment_execution',
  'deployment_execution_gate_open',
  'public_registry_mutation',
  'external_trust_registry_mutation'
]);

function result(state, reason) {
  return Object.freeze({ state, reason });
}

function invalid(reason) {
  return result(STATE.INVALID, reason);
}

function valid(reason) {
  return result(STATE.VALID, reason);
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isSha256(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function requiredReason(field) {
  return REQUIRED_FIELD_REASONS[field] || 'RPECRC_REQUEST_INVALID';
}

function hashReason(field) {
  return HASH_FIELD_REASONS[field] || 'RPECRC_EXTERNAL_REVIEW_CANDIDATE_HASH_MISMATCH';
}

function forbiddenTruth(value) {
  return value === true || value === 'true' || value === 'TRUE' || value === '1' || value === 1;
}

function validateRequiredStrings(candidate) {
  for (const field of REQUIRED_STRING_FIELDS) {
    if (!isNonEmptyString(candidate[field])) {
      return invalid(requiredReason(field));
    }
  }

  return null;
}

function validateHashes(candidate) {
  for (const field of HASH_FIELDS) {
    if (!isSha256(candidate[field])) {
      return invalid(hashReason(field));
    }
  }

  return null;
}

function validateBoundaryFlags(candidate) {
  if (!isPlainObject(candidate.boundary_flags)) {
    return invalid('RPECRC_BOUNDARY_BLOCKED');
  }

  for (const field of BOUNDARY_FALSE_FIELDS) {
    if (candidate.boundary_flags[field] !== false) {
      return invalid('RPECRC_BOUNDARY_BLOCKED');
    }
  }

  for (const field of FORBIDDEN_TOP_LEVEL_TRUE_FIELDS) {
    if (forbiddenTruth(candidate[field])) {
      return invalid('RPECRC_BOUNDARY_BLOCKED');
    }
  }

  return null;
}

function validateExternalReviewCandidate(candidate) {
  if (candidate === undefined || candidate === null) {
    return invalid('RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING');
  }

  if (!isPlainObject(candidate)) {
    return invalid('RPECRC_REQUEST_INVALID');
  }

  const requiredStringError = validateRequiredStrings(candidate);
  if (requiredStringError) {
    return requiredStringError;
  }

  const hashError = validateHashes(candidate);
  if (hashError) {
    return hashError;
  }

  if (!READY_CERTIFICATION_RESULTS.has(candidate.production_readiness_execution_control_certification_candidate_result)) {
    return invalid('RPECRC_CERTIFICATION_CANDIDATE_NOT_READY');
  }

  if (!READY_EXTERNAL_REVIEW_STATUSES.has(candidate.production_readiness_execution_control_external_review_candidate_status)) {
    return invalid('RPECRC_OPEN');
  }

  if (!READY_EXTERNAL_REVIEW_RESULTS.has(candidate.production_readiness_execution_control_external_review_candidate_result)) {
    return invalid('RPECRC_OPEN');
  }

  if (candidate.human_execution_control_external_review_candidate_state === 'PENDING') {
    return invalid('RPECRC_HUMAN_CONTROL_PENDING');
  }

  if (candidate.human_execution_control_external_review_candidate_state === 'REJECTED') {
    return invalid('RPECRC_HUMAN_CONTROL_REJECTED');
  }

  if (!READY_HUMAN_STATES.has(candidate.human_execution_control_external_review_candidate_state)) {
    return invalid('RPECRC_UNKNOWN_STATE');
  }

  if (!READY_LIFECYCLE_STATES.has(candidate.lifecycle_state)) {
    return invalid('RPECRC_UNKNOWN_STATE');
  }

  const boundaryError = validateBoundaryFlags(candidate);
  if (boundaryError) {
    return boundaryError;
  }

  return valid('RPECRC_VALID');
}

module.exports = Object.freeze({
  STATE,
  REQUIRED_STRING_FIELDS,
  HASH_FIELDS,
  BOUNDARY_FALSE_FIELDS,
  validateExternalReviewCandidate
});
