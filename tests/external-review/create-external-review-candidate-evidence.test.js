'use strict';

const assert = require('node:assert/strict');
const {
  REQUIRED_STRING_FIELDS,
  HASH_FIELDS,
  BOUNDARY_FALSE_FIELDS
} = require('../../runtime/external-review/validate-external-review-candidate');
const {
  EVIDENCE_STATE,
  EVIDENCE_PROTO,
  EVIDENCE_KIND,
  SOURCE_CONTRACT_REF,
  CLAIMS_NOT_CREATED,
  sha256Canonical,
  createExternalReviewCandidateValidationEvidence
} = require('../../runtime/external-review/create-external-review-candidate-evidence');

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

function context() {
  return {
    evidence_id: 'evidence:rpecrc:validation:001',
    evidence_version: '1.0',
    generated_at: '2026-09-22T12:40:00Z'
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSha256(value) {
  assert.equal(typeof value, 'string');
  assert.match(value, /^[a-f0-9]{64}$/);
}

{
  const actual = createExternalReviewCandidateValidationEvidence(baseCandidate(), context());

  assert.equal(actual.state, EVIDENCE_STATE.RECORDED);
  assert.equal(actual.reason, 'RPECRC_VALIDATION_EVIDENCE_RECORDED');
  assert.equal(actual.evidence.proto, EVIDENCE_PROTO);
  assert.equal(actual.evidence.kind, EVIDENCE_KIND);
  assert.equal(actual.evidence.source_contract_ref, SOURCE_CONTRACT_REF);
  assert.equal(actual.evidence.validator_ref, 'runtime/external-review/validate-external-review-candidate.js');
  assert.equal(actual.evidence.validation.state, 'VALID');
  assert.equal(actual.evidence.validation.reason, 'RPECRC_VALID');
  assert.equal(actual.evidence.boundary_guard_state, 'PRESERVED');
  assert.equal(actual.evidence.boundary_flags_preserved, true);
  assert.equal(actual.evidence.runtime_effects.external_review_executed, false);
  assert.equal(actual.evidence.runtime_effects.legal_certification_created, false);
  assert.equal(actual.evidence.runtime_effects.eidas_qualification_created, false);
  assert.equal(actual.evidence.runtime_effects.opc_allow_created, false);
  assert.equal(actual.evidence.runtime_effects.deployment_success_proven, false);
  assertSha256(actual.evidence.candidate_input_sha256);
  assertSha256(actual.evidence.validation_output_sha256);
  assertSha256(actual.evidence.evidence_sha256);
  console.log('PASS RPECRC_EVIDENCE_VALID_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.human_execution_control_external_review_candidate_state = 'PENDING';

  const actual = createExternalReviewCandidateValidationEvidence(candidate, context());

  assert.equal(actual.state, EVIDENCE_STATE.RECORDED);
  assert.equal(actual.evidence.validation.state, 'INVALID');
  assert.equal(actual.evidence.validation.reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.evidence.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.evidence.boundary_guard_state, 'PRESERVED');
  console.log('PASS RPECRC_EVIDENCE_HUMAN_PENDING_RECORDED');
}

{
  const candidate = baseCandidate();
  candidate.boundary_flags.legal_certification = true;

  const actual = createExternalReviewCandidateValidationEvidence(candidate, context());

  assert.equal(actual.state, EVIDENCE_STATE.RECORDED);
  assert.equal(actual.evidence.validation.state, 'INVALID');
  assert.equal(actual.evidence.validation.reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.evidence.boundary_guard_state, 'BLOCKED');
  assert.equal(actual.evidence.boundary_flags_preserved, false);
  assert.equal(actual.evidence.boundary_flag_snapshot.legal_certification, false);
  assert.equal(actual.evidence.claims_not_created.legal_certification, false);
  console.log('PASS RPECRC_EVIDENCE_BOUNDARY_BLOCKED_RECORDED');
}

{
  const actual = createExternalReviewCandidateValidationEvidence(baseCandidate(), { generated_at: '2026-09-22T12:40:00Z' });

  assert.deepEqual(actual, {
    state: EVIDENCE_STATE.INVALID,
    reason: 'RPECRC_EVIDENCE_ID_INVALID'
  });
  console.log('PASS RPECRC_EVIDENCE_ID_INVALID');
}

{
  const actual = createExternalReviewCandidateValidationEvidence(baseCandidate(), {
    evidence_id: 'evidence:rpecrc:validation:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: EVIDENCE_STATE.INVALID,
    reason: 'RPECRC_EVIDENCE_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_EVIDENCE_GENERATED_AT_INVALID');
}

{
  const first = createExternalReviewCandidateValidationEvidence(baseCandidate(), context());
  const second = createExternalReviewCandidateValidationEvidence(baseCandidate(), context());

  assert.equal(first.evidence.candidate_input_sha256, second.evidence.candidate_input_sha256);
  assert.equal(first.evidence.validation_output_sha256, second.evidence.validation_output_sha256);
  assert.equal(first.evidence.evidence_sha256, second.evidence.evidence_sha256);
  console.log('PASS RPECRC_EVIDENCE_DETERMINISTIC_HASHES');
}

{
  const firstCandidate = baseCandidate();
  const secondCandidate = baseCandidate();
  secondCandidate.external_review_candidate_ref = 'rpecrc:external-review-candidate:002';

  const first = createExternalReviewCandidateValidationEvidence(firstCandidate, context());
  const second = createExternalReviewCandidateValidationEvidence(secondCandidate, context());

  assert.notEqual(first.evidence.candidate_input_sha256, second.evidence.candidate_input_sha256);
  console.log('PASS RPECRC_EVIDENCE_INPUT_HASH_CHANGES_ON_INPUT_CHANGE');
}

{
  const candidate = baseCandidate();
  const original = clone(candidate);

  createExternalReviewCandidateValidationEvidence(candidate, context());

  assert.deepEqual(candidate, original);
  console.log('PASS RPECRC_EVIDENCE_INPUT_NOT_MUTATED');
}

{
  const actual = createExternalReviewCandidateValidationEvidence(baseCandidate(), context());

  for (const claim of CLAIMS_NOT_CREATED) {
    assert.equal(actual.evidence.claims_not_created[claim], false);
  }

  assert.equal(actual.evidence.claims_not_created.external_review_execution, false);
  assert.equal(actual.evidence.claims_not_created.legal_certification, false);
  assert.equal(actual.evidence.claims_not_created.eidas_qualification, false);
  assert.equal(actual.evidence.claims_not_created.opc_allow, false);
  assert.equal(actual.evidence.claims_not_created.deployment_success, false);
  assert.equal(actual.evidence.claims_not_created.production_deployment, false);
  console.log('PASS RPECRC_EVIDENCE_CLAIMS_NOT_CREATED');
}

{
  const canonicalA = sha256Canonical({ b: 2, a: 1 });
  const canonicalB = sha256Canonical({ a: 1, b: 2 });

  assert.equal(canonicalA, canonicalB);
  console.log('PASS RPECRC_EVIDENCE_CANONICAL_HASH_SORTS_KEYS');
}
