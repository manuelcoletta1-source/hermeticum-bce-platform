'use strict';

const assert = require('node:assert/strict');
const {
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_LEDGER_KIND
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-receipt-ledger');
const {
  SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_KIND,
  SUBMISSION_DISPATCH_RECEIPT_SEAL_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptSeal
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-receipt-seal');

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);

const FALSE_RUNTIME_FIELDS = Object.freeze([
  'external_reviewer_appointed',
  'external_review_execution_created',
  'external_review_opinion_created',
  'external_review_report_created',
  'external_review_submission_created',
  'external_review_publication_created',
  'external_submission_dispatched',
  'external_submission_transmitted',
  'external_submission_accepted',
  'external_submission_acknowledged',
  'external_submission_receipt_created',
  'external_submission_receipt_acknowledged',
  'legal_certification_created',
  'eidas_qualification_created',
  'opc_allow_created',
  'deployment_success_proven',
  'production_deployment_proven',
  'public_registry_mutated',
  'external_trust_registry_mutated'
]);

const SATISFIED_FIELDS = Object.freeze([
  'submission_dispatch_receipt_ledger_entries_satisfied',
  'submission_dispatch_receipt_register_records_satisfied',
  'submission_dispatch_receipt_index_entries_satisfied',
  'submission_dispatch_receipt_manifest_entries_satisfied',
  'submission_dispatch_receipt_package_records_satisfied',
  'submission_dispatch_receipt_candidate_records_satisfied',
  'submission_dispatch_envelope_records_satisfied',
  'submission_dispatch_packet_records_satisfied',
  'submission_dispatch_candidate_records_satisfied',
  'submission_manifest_records_satisfied',
  'submission_package_records_satisfied',
  'submission_candidate_records_satisfied',
  'reviewer_selection_records_satisfied',
  'review_package_sections_satisfied',
  'index_entries_satisfied',
  'manifest_entries_satisfied',
  'audit_sections_satisfied',
  'claims_not_created_preserved',
  'runtime_effects_preserved',
  'boundary_flags_preserved'
]);

function ledgerScope() {
  return {
    INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER_ONLY: true,
    INTERNAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER: true,
    APPEND_ONLY_INTERNAL_LEDGER: true,
    EXTERNAL_REVIEWER_APPOINTMENT: false,
    EXTERNAL_REVIEW_EXECUTION: false,
    EXTERNAL_REVIEW_OPINION: false,
    EXTERNAL_REVIEW_REPORT: false,
    EXTERNAL_REVIEW_SUBMISSION: false,
    EXTERNAL_REVIEW_PUBLICATION: false,
    EXTERNAL_SUBMISSION_DISPATCH: false,
    EXTERNAL_SUBMISSION_TRANSMISSION: false,
    EXTERNAL_SUBMISSION_ACCEPTANCE: false,
    EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT: false,
    EXTERNAL_SUBMISSION_RECEIPT: false,
    LEGAL_CERTIFICATION: false,
    EIDAS_QUALIFICATION: false,
    OPC_ALLOW: false,
    DEPLOYMENT_SUCCESS: false,
    PRODUCTION_DEPLOYMENT: false,
    PUBLIC_REGISTRY_MUTATION: false,
    EXTERNAL_TRUST_REGISTRY_MUTATION: false
  };
}

function runtimeEffects() {
  const effects = {};
  for (const field of FALSE_RUNTIME_FIELDS) {
    effects[field] = false;
  }
  return effects;
}

function claimsNotCreated() {
  return {
    external_reviewer_appointment: false,
    external_review_execution: false,
    external_review_opinion: false,
    external_review_report: false,
    external_review_submission: false,
    external_review_publication: false,
    external_submission_dispatch: false,
    external_submission_transmission: false,
    external_submission_acceptance: false,
    external_submission_acknowledgement: false,
    external_submission_receipt: false,
    external_submission_receipt_acknowledgement: false,
    legal_certification: false,
    eidas_qualification: false,
    opc_allow: false,
    deployment_success: false,
    production_deployment: false,
    public_registry_mutation: false,
    external_trust_registry_mutation: false
  };
}

function validLedger(overrides = {}) {
  const ledger = {
    proto: SUBMISSION_DISPATCH_RECEIPT_LEDGER_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_LEDGER_KIND,
    submission_dispatch_receipt_ledger_id: 'submission:rpecrc:dispatch-receipt-ledger:001',
    submission_dispatch_receipt_ledger_version: '1.0',
    submission_dispatch_receipt_ledger_state: SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.RECORDED,
    generated_at: '2026-09-22T14:50:00Z',
    submission_dispatch_receipt_ledger_scope: ledgerScope(),
    submission_dispatch_receipt_ledger_ref: 'submission:dispatch-receipt-ledger:internal:001',
    submission_dispatch_receipt_ledger_method: 'INTERNAL_TECHNICAL_RECEIPT_LEDGERING_ONLY',
    submission_dispatch_receipt_ledger_material_state: 'INTERNAL_APPEND_ONLY_HASHED_RECEIPT_REGISTER_REFERENCES_ONLY',
    submission_dispatch_receipt_ledger_sha256: HASH_B,
    submission_dispatch_receipt_register_id: 'submission:rpecrc:dispatch-receipt-register:001',
    submission_dispatch_receipt_register_sha256: HASH_A,
    submission_dispatch_receipt_register_ref: 'submission:dispatch-receipt-register:internal:001',
    submission_dispatch_receipt_index_id: 'submission:rpecrc:dispatch-receipt-index:001',
    submission_dispatch_receipt_index_sha256: HASH_A,
    submission_dispatch_receipt_index_ref: 'submission:dispatch-receipt-index:internal:001',
    submission_dispatch_receipt_manifest_id: 'submission:rpecrc:dispatch-receipt-manifest:001',
    submission_dispatch_receipt_manifest_sha256: HASH_A,
    submission_dispatch_receipt_manifest_ref: 'submission:dispatch-receipt-manifest:internal:001',
    submission_dispatch_receipt_package_id: 'submission:rpecrc:dispatch-receipt-package:001',
    submission_dispatch_receipt_package_sha256: HASH_A,
    submission_dispatch_receipt_package_ref: 'submission:dispatch-receipt-package:internal:001',
    submission_dispatch_receipt_candidate_id: 'submission:rpecrc:dispatch-receipt-candidate:001',
    submission_dispatch_receipt_candidate_sha256: HASH_A,
    submission_dispatch_receipt_candidate_ref: 'submission:dispatch-receipt-candidate:internal:001',
    submission_dispatch_envelope_sha256: HASH_A,
    submission_dispatch_packet_sha256: HASH_A,
    submission_dispatch_candidate_sha256: HASH_A,
    submission_manifest_sha256: HASH_A,
    submission_package_sha256: HASH_A,
    submission_candidate_sha256: HASH_A,
    reviewer_selection_sha256: HASH_A,
    review_package_sha256: HASH_A,
    audit_index_sha256: HASH_A,
    audit_manifest_sha256: HASH_A,
    audit_package_sha256: HASH_A,
    matrix_binding_sha256: HASH_A,
    evidence_sha256: HASH_A,
    candidate_input_sha256: HASH_A,
    validation_output_sha256: HASH_A,
    validation_state: 'VALID',
    validation_reason: 'RPECRC_VALID',
    human_execution_control_external_review_candidate_state: 'READY',
    lifecycle_state: 'EXTERNAL_REVIEW_CANDIDATE_READY',
    requirement_binding_count: 9,
    audit_section_count: 8,
    manifest_entry_count: 9,
    index_entry_count: 10,
    review_package_section_count: 10,
    reviewer_selection_record_count: 10,
    submission_candidate_record_count: 11,
    submission_package_record_count: 12,
    submission_manifest_record_count: 13,
    submission_dispatch_candidate_record_count: 14,
    submission_dispatch_packet_record_count: 15,
    submission_dispatch_envelope_record_count: 16,
    submission_dispatch_receipt_candidate_record_count: 17,
    submission_dispatch_receipt_package_record_count: 18,
    submission_dispatch_receipt_manifest_entry_count: 18,
    submission_dispatch_receipt_index_entry_count: 18,
    submission_dispatch_receipt_register_record_count: 18,
    submission_dispatch_receipt_ledger_entry_count: 19,
    validator_test_count: 43,
    evidence_test_count: 10,
    boundary_guard_state: 'PRESERVED',
    matrix_boundary_state: 'PRESERVED',
    audit_boundary_state: 'PRESERVED',
    manifest_boundary_state: 'PRESERVED',
    index_boundary_state: 'PRESERVED',
    review_package_boundary_state: 'PRESERVED',
    reviewer_selection_boundary_state: 'PRESERVED',
    submission_candidate_boundary_state: 'PRESERVED',
    submission_package_boundary_state: 'PRESERVED',
    submission_manifest_boundary_state: 'PRESERVED',
    submission_dispatch_candidate_boundary_state: 'PRESERVED',
    submission_dispatch_packet_boundary_state: 'PRESERVED',
    submission_dispatch_envelope_boundary_state: 'PRESERVED',
    submission_dispatch_receipt_candidate_boundary_state: 'PRESERVED',
    submission_dispatch_receipt_package_boundary_state: 'PRESERVED',
    submission_dispatch_receipt_manifest_boundary_state: 'PRESERVED',
    submission_dispatch_receipt_index_boundary_state: 'PRESERVED',
    submission_dispatch_receipt_register_boundary_state: 'PRESERVED',
    submission_dispatch_receipt_ledger_boundary_state: 'PRESERVED',
    claims_not_created: claimsNotCreated(),
    runtime_effects: runtimeEffects()
  };

  for (const field of SATISFIED_FIELDS) {
    ledger[field] = true;
  }

  for (const field of FALSE_RUNTIME_FIELDS) {
    ledger[field] = false;
  }

  return Object.assign(ledger, overrides);
}

function ledgerResult(overrides = {}) {
  return {
    state: SUBMISSION_DISPATCH_RECEIPT_LEDGER_STATE.RECORDED,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_LEDGER_RECORDED',
    submission_dispatch_receipt_ledger: validLedger(overrides)
  };
}

function sealContext() {
  return {
    submission_dispatch_receipt_seal_id: 'submission:rpecrc:dispatch-receipt-seal:001',
    submission_dispatch_receipt_seal_version: '1.0',
    generated_at: '2026-09-22T14:55:00Z',
    submission_dispatch_receipt_seal_ref: 'submission:dispatch-receipt-seal:internal:001',
    submission_dispatch_receipt_seal_method: 'INTERNAL_TECHNICAL_RECEIPT_HASH_SEAL_ONLY',
    submission_dispatch_receipt_seal_material_state: 'INTERNAL_HASH_SEALED_RECEIPT_LEDGER_REFERENCES_ONLY'
  };
}

{
  const source = ledgerResult();
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(source, sealContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.SEALED);
  assert.equal(actual.reason, 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_SEALED');
  assert.equal(actual.submission_dispatch_receipt_seal.proto, SUBMISSION_DISPATCH_RECEIPT_SEAL_PROTO);
  assert.equal(actual.submission_dispatch_receipt_seal.kind, SUBMISSION_DISPATCH_RECEIPT_SEAL_KIND);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_id, 'submission:rpecrc:dispatch-receipt-seal:001');
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_ref, 'submission:dispatch-receipt-seal:internal:001');
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_ledger_id, source.submission_dispatch_receipt_ledger.submission_dispatch_receipt_ledger_id);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_ledger_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_receipt_ledger_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_register_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_receipt_register_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_index_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_receipt_index_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_manifest_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_receipt_manifest_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_package_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_receipt_package_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_candidate_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_receipt_candidate_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_envelope_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_envelope_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_packet_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_packet_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_candidate_sha256, source.submission_dispatch_receipt_ledger.submission_dispatch_candidate_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_manifest_sha256, source.submission_dispatch_receipt_ledger.submission_manifest_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_package_sha256, source.submission_dispatch_receipt_ledger.submission_package_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_candidate_sha256, source.submission_dispatch_receipt_ledger.submission_candidate_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.reviewer_selection_sha256, source.submission_dispatch_receipt_ledger.reviewer_selection_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.review_package_sha256, source.submission_dispatch_receipt_ledger.review_package_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.audit_index_sha256, source.submission_dispatch_receipt_ledger.audit_index_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.audit_manifest_sha256, source.submission_dispatch_receipt_ledger.audit_manifest_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.audit_package_sha256, source.submission_dispatch_receipt_ledger.audit_package_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.matrix_binding_sha256, source.submission_dispatch_receipt_ledger.matrix_binding_sha256);
  assert.equal(actual.submission_dispatch_receipt_seal.evidence_sha256, source.submission_dispatch_receipt_ledger.evidence_sha256);
  assert.match(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_sha256, /^[a-f0-9]{64}$/);
  assert.equal(actual.submission_dispatch_receipt_seal.validation_state, 'VALID');
  assert.equal(actual.submission_dispatch_receipt_seal.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_components_satisfied, true);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_boundary_state, 'PRESERVED');
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_receipt_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.public_registry_mutated, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_SEALED_FROM_RECEIPT_LEDGER');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(validLedger(), sealContext());

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.SEALED);
  assert.equal(actual.submission_dispatch_receipt_seal.validation_state, 'VALID');
  assert.equal(actual.submission_dispatch_receipt_seal.validation_reason, 'RPECRC_VALID');
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_SEALED_FROM_LEDGER_BODY');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(
    ledgerResult({
      validation_state: 'INVALID',
      validation_reason: 'RPECRC_HUMAN_CONTROL_PENDING',
      human_execution_control_external_review_candidate_state: 'PENDING'
    }),
    sealContext()
  );

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.SEALED);
  assert.equal(actual.submission_dispatch_receipt_seal.validation_state, 'INVALID');
  assert.equal(actual.submission_dispatch_receipt_seal.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.submission_dispatch_receipt_seal.human_execution_control_external_review_candidate_state, 'PENDING');
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_HUMAN_PENDING_SEALED');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(
    ledgerResult({
      validation_state: 'INVALID',
      validation_reason: 'RPECRC_BOUNDARY_BLOCKED',
      submission_dispatch_receipt_ledger_boundary_state: 'BLOCKED',
      claims_not_created_preserved: false,
      runtime_effects_preserved: false
    }),
    sealContext()
  );

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.SEALED);
  assert.equal(actual.submission_dispatch_receipt_seal.validation_state, 'INVALID');
  assert.equal(actual.submission_dispatch_receipt_seal.validation_reason, 'RPECRC_BOUNDARY_BLOCKED');
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_ledger_boundary_state, 'BLOCKED');
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_boundary_state, 'BLOCKED');
  assert.equal(actual.submission_dispatch_receipt_seal.external_review_submission_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_dispatched, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_receipt_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.legal_certification_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.eidas_qualification_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.opc_allow_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.public_registry_mutated, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_BOUNDARY_BLOCKED_SEALED');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(ledgerResult(), {
    generated_at: '2026-09-22T14:55:00Z'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_ID_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_ID_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(ledgerResult(), {
    submission_dispatch_receipt_seal_id: 'submission:rpecrc:dispatch-receipt-seal:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal({ state: 'INVALID' }, sealContext());

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_SEAL_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_SUBMISSION_DISPATCH_RECEIPT_LEDGER_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(ledgerResult(), sealContext());

  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_component_count, SUBMISSION_DISPATCH_RECEIPT_SEAL_COMPONENTS.length);
  assert.deepEqual(
    actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_components.map(component => component.seal_component_id),
    [
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-001',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-002',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-003',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-004',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-005',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-006',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-007',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-008',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-009',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-010',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-011',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-012',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-013',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-014',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-015',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-016',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-017',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-018',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-019',
      'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-SEAL-COMPONENT-020'
    ]
  );
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_COMPONENTS');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(ledgerResult(), sealContext());

  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_SEAL_ONLY, true);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_SEAL, true);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.INTERNAL_HASH_SEAL, true);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEWER_APPOINTMENT, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.EXTERNAL_REVIEW_SUBMISSION, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.EXTERNAL_SUBMISSION_DISPATCH, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.EXTERNAL_SUBMISSION_RECEIPT, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.LEGAL_CERTIFICATION, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.EIDAS_QUALIFICATION, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.OPC_ALLOW, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.DEPLOYMENT_SUCCESS, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.PUBLIC_REGISTRY_MUTATION, false);
  assert.equal(actual.submission_dispatch_receipt_seal.submission_dispatch_receipt_seal_scope.EXTERNAL_TRUST_REGISTRY_MUTATION, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_SCOPE_FALSE');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptSeal(ledgerResult(), sealContext());

  assert.equal(actual.submission_dispatch_receipt_seal.external_reviewer_appointed, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_review_execution_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_review_opinion_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_review_report_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_review_submission_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_review_publication_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_dispatched, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_transmitted, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_accepted, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_acknowledged, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_receipt_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_submission_receipt_acknowledged, false);
  assert.equal(actual.submission_dispatch_receipt_seal.legal_certification_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.eidas_qualification_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.opc_allow_created, false);
  assert.equal(actual.submission_dispatch_receipt_seal.deployment_success_proven, false);
  assert.equal(actual.submission_dispatch_receipt_seal.production_deployment_proven, false);
  assert.equal(actual.submission_dispatch_receipt_seal.public_registry_mutated, false);
  assert.equal(actual.submission_dispatch_receipt_seal.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_SEAL_RUNTIME_EFFECTS_FALSE');
}
