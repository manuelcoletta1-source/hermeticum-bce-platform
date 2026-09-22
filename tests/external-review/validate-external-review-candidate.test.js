'use strict';

const assert = require('node:assert/strict');
const {
  STATE,
  REQUIRED_STRING_FIELDS,
  HASH_FIELDS,
  BOUNDARY_FALSE_FIELDS,
  validateExternalReviewCandidate
} = require('../../runtime/external-review/validate-external-review-candidate');

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);

function boundaryFlags() {
  const flags = {};
  for (const field of BOUNDARY_FALSE_FIELDS) {
    flags[field] = false;
  }
  return flags;
}

function baseCandidate() {
  const candidate = {};

  for (const field of REQUIRED_STRING_FIELDS) {
    candidate[field] = `${field}:demo`;
  }

  for (const field of HASH_FIELDS) {
    candidate[field] = HASH_A;
  }

  candidate.request_id = 'rpecrc-request-001';
  candidate.production_readiness_execution_control_external_review_candidate_status = 'EXTERNAL_REVIEW_CANDIDATE_READY';
  candidate.production_readiness_execution_control_external_review_candidate_result = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_READY';
  candidate.production_readiness_execution_control_certification_candidate_result = 'PRODUCTION_READINESS_EXECUTION_CONTROL_CERTIFICATION_CANDIDATE_READY';
  candidate.production_readiness_execution_control_attestation_result = 'ATTESTED';
  candidate.production_readiness_execution_control_seal_result = 'SEALED';
  candidate.human_execution_control_external_review_candidate_state = 'READY';
  candidate.human_acceptance_state = 'ACCEPTED';
  candidate.lifecycle_state = 'EXTERNAL_REVIEW_CANDIDATE_READY';
  candidate.external_review_candidate_reason_code = 'RPECRC_VALID';
  candidate.external_review_candidate_reason_text = 'Valid external review candidate fixture';
  candidate.boundary_flags = boundaryFlags();

  return candidate;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expectValid(name, candidate) {
  assert.deepEqual(
    validateExternalReviewCandidate(candidate),
    { state: STATE.VALID, reason: 'RPECRC_VALID' }
  );
  console.log(`PASS ${name}`);
}

function expectInvalid(name, mutate, reason) {
  const candidate = baseCandidate();
  mutate(candidate);
  assert.deepEqual(
    validateExternalReviewCandidate(candidate),
    { state: STATE.INVALID, reason }
  );
  console.log(`PASS ${name}`);
}

assert.deepEqual(
  validateExternalReviewCandidate(undefined),
  { state: STATE.INVALID, reason: 'RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING' }
);
console.log('PASS RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING_UNDEFINED');

assert.deepEqual(
  validateExternalReviewCandidate(null),
  { state: STATE.INVALID, reason: 'RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING' }
);
console.log('PASS RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING_NULL');

assert.deepEqual(
  validateExternalReviewCandidate('invalid'),
  { state: STATE.INVALID, reason: 'RPECRC_REQUEST_INVALID' }
);
console.log('PASS RPECRC_REQUEST_INVALID_STRING');

expectValid('RPECRC_VALID_READY', baseCandidate());

{
  const candidate = baseCandidate();
  candidate.production_readiness_execution_control_external_review_candidate_status = 'EXTERNAL_REVIEW_CANDIDATE_READY_WITH_LIMITATIONS';
  candidate.production_readiness_execution_control_external_review_candidate_result = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_READY_WITH_LIMITATIONS';
  candidate.production_readiness_execution_control_certification_candidate_result = 'PRODUCTION_READINESS_EXECUTION_CONTROL_CERTIFICATION_CANDIDATE_READY_WITH_LIMITATIONS';
  candidate.human_execution_control_external_review_candidate_state = 'READY_WITH_LIMITATIONS';
  candidate.lifecycle_state = 'EXTERNAL_REVIEW_CANDIDATE_READY_WITH_LIMITATIONS';
  expectValid('RPECRC_VALID_READY_WITH_LIMITATIONS', candidate);
}

expectInvalid('RPECRC_REQUEST_INVALID_MISSING_REQUEST_ID', c => {
  delete c.request_id;
}, 'RPECRC_REQUEST_INVALID');

expectInvalid('RPECRC_CERTIFICATION_CANDIDATE_MISSING', c => {
  delete c.production_readiness_execution_control_certification_candidate_ref;
}, 'RPECRC_CERTIFICATION_CANDIDATE_MISSING');

expectInvalid('RPECRC_CERTIFICATION_CANDIDATE_HASH_MISSING', c => {
  delete c.production_readiness_execution_control_certification_candidate_hash;
}, 'RPECRC_CERTIFICATION_CANDIDATE_HASH_MISSING');

expectInvalid('RPECRC_CERTIFICATION_CANDIDATE_HASH_MISMATCH', c => {
  c.production_readiness_execution_control_certification_candidate_hash = 'not-a-sha256';
}, 'RPECRC_CERTIFICATION_CANDIDATE_HASH_MISMATCH');

expectInvalid('RPECRC_CERTIFICATION_CANDIDATE_NOT_READY', c => {
  c.production_readiness_execution_control_certification_candidate_result = 'PRODUCTION_READINESS_EXECUTION_CONTROL_CERTIFICATION_CANDIDATE_REJECTED';
}, 'RPECRC_CERTIFICATION_CANDIDATE_NOT_READY');

expectInvalid('RPECRC_ATTESTATION_MISSING', c => {
  delete c.production_readiness_execution_control_attestation_ref;
}, 'RPECRC_ATTESTATION_MISSING');

expectInvalid('RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING', c => {
  delete c.external_review_candidate_ref;
}, 'RPECRC_EXTERNAL_REVIEW_CANDIDATE_MISSING');

expectInvalid('RPECRC_EXTERNAL_REVIEW_CANDIDATE_HASH_MISMATCH', c => {
  c.external_review_candidate_hash = 'not-a-sha256';
}, 'RPECRC_EXTERNAL_REVIEW_CANDIDATE_HASH_MISMATCH');

expectInvalid('RPECRC_SCOPE_MISSING', c => {
  delete c.external_review_candidate_scope_ref;
}, 'RPECRC_SCOPE_MISSING');

expectInvalid('RPECRC_POLICY_MISSING', c => {
  delete c.external_review_candidate_policy_ref;
}, 'RPECRC_POLICY_MISSING');

expectInvalid('RPECRC_CRITERIA_MISSING', c => {
  delete c.external_review_candidate_criteria_ref;
}, 'RPECRC_CRITERIA_MISSING');

expectInvalid('RPECRC_AUTHORITY_MISSING', c => {
  delete c.external_review_candidate_authority_ref;
}, 'RPECRC_AUTHORITY_MISSING');

expectInvalid('RPECRC_MATERIAL_MISSING', c => {
  delete c.external_review_candidate_material_ref;
}, 'RPECRC_MATERIAL_MISSING');

expectInvalid('RPECRC_STATEMENT_MISSING', c => {
  delete c.external_review_candidate_statement_ref;
}, 'RPECRC_STATEMENT_MISSING');

expectInvalid('RPECRC_BINDING_MISSING', c => {
  delete c.external_review_candidate_binding_ref;
}, 'RPECRC_BINDING_MISSING');

expectInvalid('RPECRC_AUDIT_MISSING', c => {
  delete c.external_review_candidate_audit_ref;
}, 'RPECRC_AUDIT_MISSING');

expectInvalid('RPECRC_RISK_REGISTER_MISSING', c => {
  delete c.external_review_candidate_risk_ref;
}, 'RPECRC_RISK_REGISTER_MISSING');

expectInvalid('RPECRC_ROLLBACK_REF_MISSING', c => {
  delete c.external_review_candidate_rollback_ref;
}, 'RPECRC_ROLLBACK_REF_MISSING');

expectInvalid('RPECRC_DELTA_MISSING', c => {
  delete c.external_review_candidate_delta_ref;
}, 'RPECRC_DELTA_MISSING');

expectInvalid('RPECRC_PLAN_MISSING', c => {
  delete c.external_review_candidate_plan_ref;
}, 'RPECRC_PLAN_MISSING');

expectInvalid('RPECRC_MANIFEST_MISSING', c => {
  delete c.external_review_candidate_manifest_ref;
}, 'RPECRC_MANIFEST_MISSING');

expectInvalid('RPECRC_REVIEW_PACKAGE_CANDIDATE_MISSING', c => {
  delete c.external_review_package_candidate_ref;
}, 'RPECRC_REVIEW_PACKAGE_CANDIDATE_MISSING');

expectInvalid('RPECRC_REVIEWER_SELECTION_CANDIDATE_MISSING', c => {
  delete c.external_reviewer_selection_candidate_ref;
}, 'RPECRC_REVIEWER_SELECTION_CANDIDATE_MISSING');

expectInvalid('RPECRC_SUBMISSION_CANDIDATE_MISSING', c => {
  delete c.external_submission_candidate_ref;
}, 'RPECRC_SUBMISSION_CANDIDATE_MISSING');

expectInvalid('RPECRC_HASH_MISSING', c => {
  delete c.production_readiness_execution_control_external_review_candidate_hash;
}, 'RPECRC_HASH_MISSING');

expectInvalid('RPECRC_REGISTER_MISSING', c => {
  delete c.external_review_candidate_register_ref;
}, 'RPECRC_REGISTER_MISSING');

expectInvalid('RPECRC_HUMAN_CONTROL_PENDING', c => {
  c.human_execution_control_external_review_candidate_state = 'PENDING';
}, 'RPECRC_HUMAN_CONTROL_PENDING');

expectInvalid('RPECRC_HUMAN_CONTROL_REJECTED', c => {
  c.human_execution_control_external_review_candidate_state = 'REJECTED';
}, 'RPECRC_HUMAN_CONTROL_REJECTED');

expectInvalid('RPECRC_UNKNOWN_STATE_HUMAN', c => {
  c.human_execution_control_external_review_candidate_state = 'ALIEN_REVIEW_STATE';
}, 'RPECRC_UNKNOWN_STATE');

expectInvalid('RPECRC_UNKNOWN_STATE_LIFECYCLE', c => {
  c.lifecycle_state = 'ALIEN_LIFECYCLE';
}, 'RPECRC_UNKNOWN_STATE');

expectInvalid('RPECRC_OPEN_STATUS', c => {
  c.production_readiness_execution_control_external_review_candidate_status = 'EXTERNAL_REVIEW_CANDIDATE_PENDING';
}, 'RPECRC_OPEN');

expectInvalid('RPECRC_OPEN_RESULT', c => {
  c.production_readiness_execution_control_external_review_candidate_result = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_OPEN';
}, 'RPECRC_OPEN');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_MISSING_FLAGS', c => {
  delete c.boundary_flags;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_EXTERNAL_REVIEW_EXECUTION_FLAG', c => {
  c.boundary_flags.external_review_execution = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_LEGAL_CERTIFICATION_FLAG', c => {
  c.boundary_flags.legal_certification = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_EIDAS_QUALIFICATION_FLAG', c => {
  c.boundary_flags.eidas_qualification = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_OPC_ALLOW_FLAG', c => {
  c.boundary_flags.opc_allow = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_DEPLOYMENT_SUCCESS_FLAG', c => {
  c.boundary_flags.deployment_success = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_EXTERNAL_REVIEW_EXECUTED_TOP_LEVEL', c => {
  c.external_review_executed = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_EXTERNAL_REVIEW_OPINION_TOP_LEVEL', c => {
  c.external_review_opinion_issued = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_LEGAL_CERTIFICATION_TOP_LEVEL', c => {
  c.legal_certification = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_EIDAS_QUALIFICATION_TOP_LEVEL', c => {
  c.eidas_qualification = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_OPC_ALLOW_TOP_LEVEL', c => {
  c.opc_allow = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_DEPLOYMENT_SUCCESS_TOP_LEVEL', c => {
  c.deployment_success = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

expectInvalid('RPECRC_BOUNDARY_BLOCKED_PUBLIC_REGISTRY_MUTATION_TOP_LEVEL', c => {
  c.public_registry_mutation = true;
}, 'RPECRC_BOUNDARY_BLOCKED');

{
  const candidate = clone(baseCandidate());
  candidate.external_review_candidate_hash = HASH_B;
  expectValid('RPECRC_VALID_WITH_DIFFERENT_VALID_EXTERNAL_REVIEW_HASH', candidate);
}
