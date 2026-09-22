'use strict';

const {
  EVIDENCE_STATE,
  SOURCE_CONTRACT_REF,
  createExternalReviewCandidateValidationEvidence
} = require('./create-external-review-candidate-evidence');

const MATRIX_BINDING_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const MATRIX_BINDING_PROTO = 'HBCE-RPECRC-MATRIX-BINDING-v1';
const MATRIX_BINDING_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_MATRIX_BINDING';
const MATRIX_VERSION = 'HBCE-2027-REQUIREMENT-TEST-EVIDENCE-MATRIX-v1';
const VALIDATOR_REF = 'runtime/external-review/validate-external-review-candidate.js';
const EVIDENCE_CREATOR_REF = 'runtime/external-review/create-external-review-candidate-evidence.js';

const REQUIREMENT_BINDINGS = Object.freeze([
  Object.freeze({
    requirement_id: 'HBCE-RPECRC-REQ-001',
    requirement_name: 'External Review Candidate request must be structurally validated',
    source_contract_ref: SOURCE_CONTRACT_REF,
    validator_test_ids: Object.freeze([
      'RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING_UNDEFINED',
      'RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING_NULL',
      'RPECRC_REQUEST_INVALID_STRING',
      'RPECRC_REQUEST_INVALID_MISSING_REQUEST_ID',
      'RPECRC_VALID_READY',
      'RPECRC_VALID_READY_WITH_LIMITATIONS'
    ]),
    evidence_test_ids: Object.freeze([
      'RPECRC_EVIDENCE_VALID_RECORDED',
      'RPECRC_EVIDENCE_DETERMINISTIC_HASHES',
      'RPECRC_EVIDENCE_INPUT_HASH_CHANGES_ON_INPUT_CHANGE',
      'RPECRC_EVIDENCE_INPUT_NOT_MUTATED'
    ]),
    evidence_field_refs: Object.freeze([
      'validation.state',
      'validation.reason',
      'candidate_input_sha256',
      'validation_output_sha256',
      'evidence_sha256'
    ])
  }),
  Object.freeze({
    requirement_id: 'HBCE-RPECRC-REQ-002',
    requirement_name: 'Certification candidate dependency must be present and ready',
    source_contract_ref: SOURCE_CONTRACT_REF,
    validator_test_ids: Object.freeze([
      'RPECRC_CERTIFICATION_CANDIDATE_MISSING',
      'RPECRC_CERTIFICATION_CANDIDATE_HASH_MISSING',
      'RPECRC_CERTIFICATION_CANDIDATE_HASH_MISMATCH',
      'RPECRC_CERTIFICATION_CANDIDATE_NOT_READY'
    ]),
    evidence_test_ids: Object.freeze([
      'RPECRC_EVIDENCE_VALID_RECORDED'
    ]),
    evidence_field_refs: Object.freeze([
      'production_readiness_execution_control_certification_candidate_ref',
      'validation.reason'
    ])
  }),
  Object.freeze({
    requirement_id: 'HBCE-RPECRC-REQ-003',
    requirement_name: 'External Review Candidate references must be present and hashable',
    source_contract_ref: SOURCE_CONTRACT_REF,
    validator_test_ids: Object.freeze([
      'RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING',
      'RPECRC_EXTERNAL_REVIEW_CANDIDATE_HASH_MISMATCH',
      'RPECRC_SCOPE_MISSING',
      'RPECRC_POLICY_MISSING',
      'RPECRC_CRITERIA_MISSING',
      'RPECRC_AUTHORITY_MISSING',
      'RPECRC_MATERIAL_MISSING',
      'RPECRC_STATEMENT_MISSING',
      'RPECRC_BINDING_MISSING',
      'RPECRC_AUDIT_MISSING',
      'RPECRC_RISK_REGISTER_MISSING',
      'RPECRC_ROLLBACK_REF_MISSING',
      'RPECRC_DELTA_MISSING',
      'RPECRC_PLAN_MISSING',
      'RPECRC_MANIFEST_MISSING',
      'RPECRC_REVIEW_PACKAGE_CANDIDATE_MISSING',
      'RPECRC_REVIEWER_SELECTION_CANDIDATE_MISSING',
      'RPECRC_SUBMISSION_CANDIDATE_MISSING',
      'RPECRC_HASH_MISSING',
      'RPECRC_REGISTER_MISSING'
    ]),
    evidence_test_ids: Object.freeze([
      'RPECRC_EVIDENCE_VALID_RECORDED',
      'RPECRC_EVIDENCE_DETERMINISTIC_HASHES'
    ]),
    evidence_field_refs: Object.freeze([
      'external_review_candidate_ref',
      'candidate_input_sha256',
      'evidence_sha256'
    ])
  }),
  Object.freeze({
    requirement_id: 'HBCE-RPECRC-REQ-004',
    requirement_name: 'Human execution control must remain explicit',
    source_contract_ref: SOURCE_CONTRACT_REF,
    validator_test_ids: Object.freeze([
      'RPECRC_HUMAN_CONTROL_PENDING',
      'RPECRC_HUMAN_CONTROL_REJECTED',
      'RPECRC_UNKNOWN_STATE_HUMAN',
      'RPECRC_UNKNOWN_STATE_LIFECYCLE',
      'RPECRC_OPEN_STATUS',
      'RPECRC_OPEN_RESULT'
    ]),
    evidence_test_ids: Object.freeze([
      'RPECRC_EVIDENCE_HUMAN_PENDING_RECORDED'
    ]),
    evidence_field_refs: Object.freeze([
      'human_execution_control_external_review_candidate_state',
      'lifecycle_state',
      'validation.state',
      'validation.reason'
    ])
  }),
  Object.freeze({
    requirement_id: 'HBCE-RPECRC-REQ-005',
    requirement_name: 'External Review Candidate must not create prohibited outcomes',
    source_contract_ref: SOURCE_CONTRACT_REF,
    validator_test_ids: Object.freeze([
      'RPECRC_BOUNDARY_BLOCKED_MISSING_FLAGS',
      'RPECRC_BOUNDARY_BLOCKED_EXTERNAL_REVIEW_EXECUTION_FLAG',
      'RPECRC_BOUNDARY_BLOCKED_LEGAL_CERTIFICATION_FLAG',
      'RPECRC_BOUNDARY_BLOCKED_EIDAS_QUALIFICATION_FLAG',
      'RPECRC_BOUNDARY_BLOCKED_OPC_ALLOW_FLAG',
      'RPECRC_BOUNDARY_BLOCKED_DEPLOYMENT_SUCCESS_FLAG',
      'RPECRC_BOUNDARY_BLOCKED_EXTERNAL_REVIEW_EXECUTED_TOP_LEVEL',
      'RPECRC_BOUNDARY_BLOCKED_EXTERNAL_REVIEW_OPINION_TOP_LEVEL',
      'RPECRC_BOUNDARY_BLOCKED_LEGAL_CERTIFICATION_TOP_LEVEL',
      'RPECRC_BOUNDARY_BLOCKED_EIDAS_QUALIFICATION_TOP_LEVEL',
      'RPECRC_BOUNDARY_BLOCKED_OPC_ALLOW_TOP_LEVEL',
      'RPECRC_BOUNDARY_BLOCKED_DEPLOYMENT_SUCCESS_TOP_LEVEL',
      'RPECRC_BOUNDARY_BLOCKED_PUBLIC_REGISTRY_MUTATION_TOP_LEVEL'
    ]),
    evidence_test_ids: Object.freeze([
      'RPECRC_EVIDENCE_BOUNDARY_BLOCKED_RECORDED',
      'RPECRC_EVIDENCE_CLAIMS_NOT_CREATED'
    ]),
    evidence_field_refs: Object.freeze([
      'boundary_guard_state',
      'boundary_flags_preserved',
      'boundary_flag_snapshot',
      'claims_not_created',
      'runtime_effects'
    ])
  })
]);

const REQUIRED_CLAIMS_NOT_CREATED = Object.freeze([
  'external_review_execution',
  'external_review_opinion',
  'external_review_report_issued',
  'external_submission_execution',
  'legal_certification',
  'eidas_qualification',
  'qualified_trust_service',
  'trust_service_provider_status',
  'conformity_assessment_body_status',
  'opc_allow',
  'regulated_kyc_aml_provider_status',
  'deployment_success',
  'production_deployment',
  'public_registry_mutation',
  'external_trust_registry_mutation'
]);

function result(state, reason, binding) {
  if (binding) {
    return Object.freeze({ state, reason, binding });
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

function normalizeEvidenceResult(candidateOrEvidenceResult, evidenceContext) {
  if (
    isPlainObject(candidateOrEvidenceResult) &&
    candidateOrEvidenceResult.state === EVIDENCE_STATE.RECORDED &&
    candidateOrEvidenceResult.reason === 'RPECRC_VALIDATION_EVIDENCE_RECORDED' &&
    isPlainObject(candidateOrEvidenceResult.evidence)
  ) {
    return candidateOrEvidenceResult;
  }

  if (isPlainObject(evidenceContext)) {
    return createExternalReviewCandidateValidationEvidence(candidateOrEvidenceResult, evidenceContext);
  }

  return null;
}

function claimsNotCreatedPreserved(evidence) {
  if (!isPlainObject(evidence.claims_not_created)) {
    return false;
  }

  for (const claim of REQUIRED_CLAIMS_NOT_CREATED) {
    if (evidence.claims_not_created[claim] !== false) {
      return false;
    }
  }

  return true;
}

function runtimeEffectsPreserved(evidence) {
  if (!isPlainObject(evidence.runtime_effects)) {
    return false;
  }

  const requiredRuntimeEffects = [
    'external_review_executed',
    'external_review_opinion_issued',
    'external_review_report_issued',
    'external_submission_executed',
    'legal_certification_created',
    'eidas_qualification_created',
    'opc_allow_created',
    'deployment_success_proven',
    'production_deployment_proven',
    'public_registry_mutated',
    'external_trust_registry_mutated'
  ];

  for (const effect of requiredRuntimeEffects) {
    if (evidence.runtime_effects[effect] !== false) {
      return false;
    }
  }

  return true;
}

function createExternalReviewCandidateMatrixBinding(candidateOrEvidenceResult, context) {
  if (!isPlainObject(context)) {
    return result(MATRIX_BINDING_STATE.INVALID, 'RPECRC_MATRIX_BINDING_CONTEXT_INVALID');
  }

  if (!isNonEmptyString(context.binding_id)) {
    return result(MATRIX_BINDING_STATE.INVALID, 'RPECRC_MATRIX_BINDING_ID_INVALID');
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(MATRIX_BINDING_STATE.INVALID, 'RPECRC_MATRIX_BINDING_GENERATED_AT_INVALID');
  }

  const evidenceResult = normalizeEvidenceResult(candidateOrEvidenceResult, context.evidence_context);

  if (!evidenceResult || evidenceResult.state !== EVIDENCE_STATE.RECORDED || !isPlainObject(evidenceResult.evidence)) {
    return result(MATRIX_BINDING_STATE.INVALID, 'RPECRC_MATRIX_BINDING_EVIDENCE_INVALID');
  }

  const evidence = evidenceResult.evidence;
  const claimsPreserved = claimsNotCreatedPreserved(evidence);
  const runtimePreserved = runtimeEffectsPreserved(evidence);
  const boundaryPreserved = claimsPreserved && runtimePreserved && evidence.boundary_flags_preserved === true;

  const binding = {
    proto: MATRIX_BINDING_PROTO,
    kind: MATRIX_BINDING_KIND,
    binding_id: context.binding_id,
    binding_version: isNonEmptyString(context.binding_version) ? context.binding_version : '1.0',
    binding_state: MATRIX_BINDING_STATE.RECORDED,
    generated_at: context.generated_at,
    matrix_version: isNonEmptyString(context.matrix_version) ? context.matrix_version : MATRIX_VERSION,
    source_contract_ref: SOURCE_CONTRACT_REF,
    validator_ref: VALIDATOR_REF,
    evidence_creator_ref: EVIDENCE_CREATOR_REF,
    evidence_id: evidence.evidence_id,
    evidence_sha256: evidence.evidence_sha256,
    candidate_input_sha256: evidence.candidate_input_sha256,
    validation_output_sha256: evidence.validation_output_sha256,
    validation_state: evidence.validation.state,
    validation_reason: evidence.validation.reason,
    human_execution_control_external_review_candidate_state: evidence.human_execution_control_external_review_candidate_state,
    lifecycle_state: evidence.lifecycle_state,
    requirement_bindings: REQUIREMENT_BINDINGS,
    requirement_binding_count: REQUIREMENT_BINDINGS.length,
    validator_test_count: REQUIREMENT_BINDINGS.reduce((count, item) => count + item.validator_test_ids.length, 0),
    evidence_test_count: REQUIREMENT_BINDINGS.reduce((count, item) => count + item.evidence_test_ids.length, 0),
    claims_not_created_preserved: claimsPreserved,
    runtime_effects_preserved: runtimePreserved,
    boundary_flags_preserved: evidence.boundary_flags_preserved,
    boundary_guard_state: evidence.boundary_guard_state,
    matrix_boundary_state: boundaryPreserved ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: evidence.claims_not_created,
    runtime_effects: evidence.runtime_effects
  };

  return result(
    MATRIX_BINDING_STATE.RECORDED,
    'RPECRC_MATRIX_BINDING_RECORDED',
    deepFreeze(binding)
  );
}

module.exports = Object.freeze({
  MATRIX_BINDING_STATE,
  MATRIX_BINDING_PROTO,
  MATRIX_BINDING_KIND,
  MATRIX_VERSION,
  VALIDATOR_REF,
  EVIDENCE_CREATOR_REF,
  REQUIREMENT_BINDINGS,
  REQUIRED_CLAIMS_NOT_CREATED,
  createExternalReviewCandidateMatrixBinding
});
