'use strict';

const crypto = require('node:crypto');
const {
  BOUNDARY_FALSE_FIELDS,
  validateExternalReviewCandidate
} = require('./validate-external-review-candidate');

const EVIDENCE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const EVIDENCE_PROTO = 'HBCE-RPECRC-VALIDATION-EVIDENCE-v1';
const EVIDENCE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_VALIDATION_EVIDENCE';
const SOURCE_CONTRACT_REF = 'HBCE_RELEASE_CANDIDATE_PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_CONTRACT.md';
const DEFAULT_VALIDATOR_REF = 'runtime/external-review/validate-external-review-candidate.js';
const DEFAULT_VALIDATOR_VERSION = '1.0';

const CLAIMS_NOT_CREATED = Object.freeze([
  'external_review_execution',
  'external_review_acceptance',
  'external_review_approval',
  'external_review_opinion',
  'external_review_report_issued',
  'external_submission_execution',
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

function result(state, reason, evidence) {
  if (evidence) {
    return Object.freeze({ state, reason, evidence });
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

function canonicalize(value) {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return `[${value.map(item => canonicalize(item === undefined ? null : item)).join(',')}]`;
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value).filter(key => value[key] !== undefined).sort();
    return `{${keys.map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  }

  return JSON.stringify(value);
}

function sha256Canonical(value) {
  return crypto.createHash('sha256').update(canonicalize(value)).digest('hex');
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

function buildFalseMap(keys) {
  const out = {};

  for (const key of keys) {
    out[key] = false;
  }

  return out;
}

function createBoundarySnapshot(candidate) {
  const flags = isPlainObject(candidate) && isPlainObject(candidate.boundary_flags)
    ? candidate.boundary_flags
    : {};

  const snapshot = {};

  for (const field of BOUNDARY_FALSE_FIELDS) {
    snapshot[field] = flags[field] === false;
  }

  return snapshot;
}

function allBoundaryFlagsPreserved(snapshot) {
  return Object.values(snapshot).every(value => value === true);
}

function createExternalReviewCandidateValidationEvidence(candidate, context) {
  if (!isPlainObject(context)) {
    return result(EVIDENCE_STATE.INVALID, 'RPECRC_EVIDENCE_CONTEXT_INVALID');
  }

  if (!isNonEmptyString(context.evidence_id)) {
    return result(EVIDENCE_STATE.INVALID, 'RPECRC_EVIDENCE_ID_INVALID');
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(EVIDENCE_STATE.INVALID, 'RPECRC_EVIDENCE_GENERATED_AT_INVALID');
  }

  const validation = validateExternalReviewCandidate(candidate);
  const boundarySnapshot = createBoundarySnapshot(candidate);
  const boundaryFlagsPreserved = allBoundaryFlagsPreserved(boundarySnapshot);
  const claimsNotCreated = buildFalseMap(CLAIMS_NOT_CREATED);

  const evidenceBody = {
    proto: EVIDENCE_PROTO,
    kind: EVIDENCE_KIND,
    evidence_id: context.evidence_id,
    evidence_version: isNonEmptyString(context.evidence_version) ? context.evidence_version : '1.0',
    evidence_state: EVIDENCE_STATE.RECORDED,
    generated_at: context.generated_at,
    source_contract_ref: SOURCE_CONTRACT_REF,
    validator_ref: isNonEmptyString(context.validator_ref) ? context.validator_ref : DEFAULT_VALIDATOR_REF,
    validator_version: isNonEmptyString(context.validator_version) ? context.validator_version : DEFAULT_VALIDATOR_VERSION,
    request_id: isPlainObject(candidate) && isNonEmptyString(candidate.request_id) ? candidate.request_id : null,
    release_candidate_id: isPlainObject(candidate) && isNonEmptyString(candidate.release_candidate_id) ? candidate.release_candidate_id : null,
    external_review_candidate_ref: isPlainObject(candidate) && isNonEmptyString(candidate.external_review_candidate_ref) ? candidate.external_review_candidate_ref : null,
    production_readiness_execution_control_certification_candidate_ref: isPlainObject(candidate) && isNonEmptyString(candidate.production_readiness_execution_control_certification_candidate_ref)
      ? candidate.production_readiness_execution_control_certification_candidate_ref
      : null,
    human_execution_control_external_review_candidate_state: isPlainObject(candidate) && isNonEmptyString(candidate.human_execution_control_external_review_candidate_state)
      ? candidate.human_execution_control_external_review_candidate_state
      : null,
    lifecycle_state: isPlainObject(candidate) && isNonEmptyString(candidate.lifecycle_state) ? candidate.lifecycle_state : null,
    candidate_input_sha256: sha256Canonical(candidate),
    validation_output_sha256: sha256Canonical(validation),
    validation,
    boundary_guard_state: validation.reason === 'RPECRC_BOUNDARY_BLOCKED' ? 'BLOCKED' : 'PRESERVED',
    boundary_flags_preserved: boundaryFlagsPreserved,
    boundary_flag_snapshot: boundarySnapshot,
    claims_not_created: claimsNotCreated,
    runtime_effects: Object.freeze({
      external_review_executed: false,
      external_review_opinion_issued: false,
      external_review_report_issued: false,
      external_submission_executed: false,
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false,
      deployment_success_proven: false,
      production_deployment_proven: false,
      public_registry_mutated: false,
      external_trust_registry_mutated: false
    })
  };

  evidenceBody.evidence_sha256 = sha256Canonical(evidenceBody);

  return result(
    EVIDENCE_STATE.RECORDED,
    'RPECRC_VALIDATION_EVIDENCE_RECORDED',
    deepFreeze(evidenceBody)
  );
}

module.exports = Object.freeze({
  EVIDENCE_STATE,
  EVIDENCE_PROTO,
  EVIDENCE_KIND,
  SOURCE_CONTRACT_REF,
  CLAIMS_NOT_CREATED,
  canonicalize,
  sha256Canonical,
  createExternalReviewCandidateValidationEvidence
});
