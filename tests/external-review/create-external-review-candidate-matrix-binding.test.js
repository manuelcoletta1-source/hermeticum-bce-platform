'use strict';

const assert = require('node:assert/strict');
const {
  REQUIRED_STRING_FIELDS,
  HASH_FIELDS,
  BOUNDARY_FALSE_FIELDS
} = require('../../runtime/external-review/validate-external-review-candidate');
const {
  createExternalReviewCandidateValidationEvidence
} = require('../../runtime/external-review/create-external-review-candidate-evidence');
const {
  MATRIX_BINDING_STATE,
  MATRIX_BINDING_PROTO,
  MATRIX_BINDING_KIND,
  MATRIX_VERSION,
  REQUIREMENT_BINDINGS,
  REQUIRED_CLAIMS_NOT_CREATED,
  createExternalReviewCandidateMatrixBinding
} = require('../../runtime/external-review/create-external-review-candidate-matrix-binding');

const HASH_A = 'a'.repeat(64);

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
  candidate.release_candidate_id = 'HBCE-RC-2027-0001';
  candidate.external_review_candidate_ref = 'rpecrc:external-review-candidate:001';
  candidate.production_readiness_execution_control_certification_candidate_ref = 'rpecrc:certification-candidate:001';
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

function evidenceContext() {
  return {
    evidence_id: 'evidence:rpecrc:validation:001',
    evidence_version: '1.0',
    generated_at: '2026-09-22T12:50:00Z'
  };
}

function bindingContext() {
  return {
    binding_id: 'matrix:rpecrc:binding:001',
    binding_version: '1.0',
    generated_at: '2026-09-22T12:55:00Z'
  };
}

{
  const evidence = createExternalReviewCandidateValidationEvidence(baseCandidate(), evidenceContext());
  const actual = createExternalReviewCandidateMatrixBinding(evidence, bindingContext());

  assert.equal(actual.state, MATRIX_BINDING_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_MATRIX_BINDING_RECORDED');
  assert.equal(actual.binding.proto, MATRIX_BINDING_PROTO);
  assert.equal(actual.binding.kind, MATRIX_BINDING_KIND);
  assert.equal(actual.binding.matrix_version, MATRIX_VERSION);
  assert.equal(actual.binding.validation_state, 'VALID');
  assert.equal(actual.binding.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.binding.evidence_id, evidence.evidence.evidence_id);
  assert.equal(actual.binding.evidence_sha256, evidence.evidence.evidence_sha256);
  assert.equal(actual.binding.candidate_input_sha256, evidence.evidence.candidate_input_sha256);
  assert.equal(actual.binding.validation_output_sha256, evidence.evidence.validation_output_sha256);
  assert.equal(actual.binding.requirement_binding_count, REQUIREMENT_BINDINGS.length);
  assert.equal(actual.binding.claims_not_created_preserved, true);
  assert.equal(actual.binding.runtime_effects_preserved, true);
  assert.equal(actual.binding.boundary_flags_preserved, true);
  assert.equal(actual.binding.matrix_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_MATRIX_BINDING_RECORDED_FROM_EVIDENCE');
}

{
  const actual = createExternalReviewCandidateMatrixBinding(baseCandidate(), {
    ...bindingContext(),
    evidence_context: evidenceContext()
  });

  assert.equal(actual.state, MATRIX_BINDING_STATE.RECORDED);
  assert.equal(actual.binding.validation_state, 'VALID');
  assert.equal(actual.binding.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.binding.matrix_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_MATRIX_BINDING_RECORDED_FROM_CANDIDATE');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const evidence = createExternalReviewCandidateValidationEvidence(candidate, evidenceContext());
  const actual = createExternalReviewCandidateMatrixBinding(evidence, bindingContext());

  assert.equal(actual.state, MATRIX_BINDING_STATE.RECORDED);
  assert.equal(actual.binding.validation_state, 'INVALID');
  assert.equal(actual.binding.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.binding.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.binding.matrix_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_MATRIX_BINDING_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const evidence = createExternalReviewCandidateValidationEvidence(candidate, evidenceContext());
  const actual = createExternalReviewCandidateMatrixBinding(evidence, bindingContext());

  assert.equal(actual.state, MATRIX_BINDING_STATE.RECORDED);
  assert.equal(actual.binding.validation_state, 'INVALID');
  assert.equal(actual.binding.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.binding.boundary_flags_preserved, false);
  assert.equal(actual.binding.matrix_boundary_state, 'BLOCKED');
  assert.equal(actual.binding.claims_not_created.legal_certification, false);
  assert.equal(actual.binding.runtime_effects.legal_certification_created, false);
  console.log('PASS RPECRC_MATRIX_BINDING_BOUNDARY_BLOCKED_RECORDED');
}

{
  const actual = createExternalReviewCandidateMatrixBinding(
    createExternalReviewCandidateValidationEvidence(baseCandidate(), evidenceContext()),
    { generated_at: '2026-09-22T12:55:00Z' }
  );

  assert.deepEqual(actual, {
    state: MATRIX_BINDING_STATE.INVALID,
    reason: 'RPECRC_MATRIX_BINDING_ID_INVALID'
  });
  console.log('PASS RPECRC_MATRIX_BINDING_ID_INVALID');
}

{
  const actual = createExternalReviewCandidateMatrixBinding(
    createExternalReviewCandidateValidationEvidence(baseCandidate(), evidenceContext()),
    {
      binding_id: 'matrix:rpecrc:binding:001',
      generated_at: 'not-a-date'
    }
  );

  assert.deepEqual(actual, {
    state: MATRIX_BINDING_STATE.INVALID,
    reason: 'RPECRC_MATRIX_BINDING_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_MATRIX_BINDING_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateMatrixBinding({ state: 'INVALID' }, bindingContext());

  assert.deepEqual(actual, {
    state: MATRIX_BINDING_STATE.INVALID,
    reason: 'RPECRC_MATRIX_BINDING_EVIDENCE_INVALID'
  });
  console.log('PASS RPECRC_MATRIX_BINDING_EVIDENCE_INVALID');
}

{
  const evidence = createExternalReviewCandidateValidationEvidence(baseCandidate(), evidenceContext());
  const actual = createExternalReviewCandidateMatrixBinding(evidence, bindingContext());

  const requirementIds = actual.binding.requirement_bindings.map(item => item.requirement_id);

  assert.deepEqual(requirementIds, [
    'HBCE-RPECRC-REQ-001',
    'HBCE-RPECRC-REQ-002',
    'HBCE-RPECRC-REQ-003',
    'HBCE-RPECRC-REQ-004',
    'HBCE-RPECRC-REQ-005'
  ]);

  assert.ok(actual.binding.validator_test_count > 0);
  assert.ok(actual.binding.evidence_test_count > 0);
  console.log('PASS RPECRC_MATRIX_BINDING_REQUIREMENT_IDS');
}

{
  const evidence = createExternalReviewCandidateValidationEvidence(baseCandidate(), evidenceContext());
  const actual = createExternalReviewCandidateMatrixBinding(evidence, bindingContext());

  for (const claim of REQUIRED_CLAIMS_NOT_CREATED) {
    assert.equal(actual.binding.claims_not_created[claim], false);
  }

  assert.equal(actual.binding.claims_not_created.legal_certification, false);
  assert.equal(actual.binding.claims_not_created.eidas_qualification, false);
  assert.equal(actual.binding.claims_not_created.opc_allow, false);
  assert.equal(actual.binding.claims_not_created.deployment_success, false);
  assert.equal(actual.binding.claims_not_created.production_deployment, false);
  console.log('PASS RPECRC_MATRIX_BINDING_CLAIMS_NOT_CREATED');
}

{
  const evidence = createExternalReviewCandidateValidationEvidence(baseCandidate(), evidenceContext());
  const actual = createExternalReviewCandidateMatrixBinding(evidence, bindingContext());

  assert.equal(actual.binding.runtime_effects.legal_certification_created, false);
  assert.equal(actual.binding.runtime_effects.eidas_qualification_created, false);
  assert.equal(actual.binding.runtime_effects.opc_allow_created, false);
  assert.equal(actual.binding.runtime_effects.deployment_success_proven, false);
  assert.equal(actual.binding.runtime_effects.production_deployment_proven, false);
  assert.equal(actual.binding.runtime_effects.public_registry_mutated, false);
  assert.equal(actual.binding.runtime_effects.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_MATRIX_BINDING_RUNTIME_EFFECTS_FALSE');
}
