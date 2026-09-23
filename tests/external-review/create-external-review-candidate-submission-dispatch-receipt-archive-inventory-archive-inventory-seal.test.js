'use strict';

const assert = require('node:assert/strict');

const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-receipt-archive-inventory-archive-inventory-ledger');

const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-receipt-archive-inventory-archive-inventory-seal');

const hash = char => char.repeat(64);

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
  'external_archive_storage_created',
  'public_registry_mutated',
  'external_trust_registry_mutated',
  'legal_certification_created',
  'eidas_qualification_created',
  'opc_allow_created',
  'deployment_success_proven',
  'production_deployment_proven'
]);

const SATISFIED_FIELDS = Object.freeze([
  'submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_archive_inventory_register_records_preserved',
  'submission_dispatch_receipt_archive_inventory_archive_inventory_register_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_archive_inventory_items_preserved',
  'submission_dispatch_receipt_archive_inventory_archive_inventory_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_archive_records_preserved',
  'submission_dispatch_receipt_archive_inventory_archive_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_closure_records_preserved',
  'submission_dispatch_receipt_archive_inventory_closure_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_sealed_components_preserved',
  'submission_dispatch_receipt_archive_inventory_seal_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_ledger_entries_preserved',
  'submission_dispatch_receipt_archive_inventory_ledger_entries_satisfied',
  'submission_dispatch_receipt_archive_inventory_register_records_preserved',
  'submission_dispatch_receipt_archive_inventory_register_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_items_preserved',
  'submission_dispatch_receipt_archive_inventory_components_satisfied',
  'submission_dispatch_receipt_archive_components_satisfied',
  'submission_dispatch_receipt_closure_components_satisfied',
  'submission_dispatch_receipt_seal_components_satisfied',
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
  'runtime_effects_preserved'
]);

function ledgerScope() {
  return {
    INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_ONLY: true,
    INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER: true,
    INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER: true,
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
    EXTERNAL_ARCHIVE_STORAGE: false,
    PUBLIC_REGISTRY_MUTATION: false,
    EXTERNAL_TRUST_REGISTRY_MUTATION: false,
    LEGAL_CERTIFICATION: false,
    EIDAS_QUALIFICATION: false,
    OPC_ALLOW: false,
    DEPLOYMENT_SUCCESS: false,
    PRODUCTION_DEPLOYMENT: false
  };
}

function validLedger(overrides = {}) {
  const body = {
    proto: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_KIND,
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_id: 'submission:rpecrc:dispatch-receipt-archive-inventory-archive-inventory-ledger:001',
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_version: '1.0',
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_STATE.LEDGERED,
    generated_at: '2026-09-23T09:05:00Z',
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_scope: ledgerScope(),
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_ref: 'submission:dispatch-receipt-archive-inventory-archive-inventory-ledger:internal:001',
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_method: 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_ONLY',
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_material_state: 'INTERNAL_LEDGERED_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_REFERENCES_ONLY',
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_sha256: hash('f'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_boundary_state: 'PRESERVED',
    validation_state: 'VALID',
    validation_reason: 'RPECRC_VALID',
    human_execution_control_external_review_candidate_state: 'READY',
    lifecycle_state: 'EXTERNAL_REVIEW_CANDIDATE_READY'
  };

  for (const component of SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS) {
    body[component.ref_field] = component.ref_field.endsWith('_boundary_state') ? 'PRESERVED' : hash('a');
  }

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_entries = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS.map((component, index) => ({
    ledger_entry_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-LEDGER-ENTRY-${String(index + 1).padStart(3, '0')}`,
    ledger_entry_name: component.ledger_component_name,
    ledger_component_ref: component.ledger_component_id,
    source_ref_field: component.ref_field,
    source_ref_value: body[component.ref_field]
  }));

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_entry_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS.length;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_component_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS.length;

  for (const field of SATISFIED_FIELDS) {
    body[field] = true;
  }

  for (const field of FALSE_RUNTIME_FIELDS) {
    body[field] = false;
  }

  return Object.assign(body, overrides);
}

function ledgerResult(overrides = {}) {
  return {
    state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_STATE.LEDGERED,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_LEDGERED',
    submission_dispatch_receipt_archive_inventory_archive_inventory_ledger: validLedger(overrides)
  };
}

function context() {
  return {
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_id: 'submission:rpecrc:dispatch-receipt-archive-inventory-archive-inventory-seal:001',
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_version: '1.0',
    generated_at: '2026-09-23T09:35:00Z',
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_ref: 'submission:dispatch-receipt-archive-inventory-archive-inventory-seal:internal:001',
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_method: 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_ONLY',
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_material_state: 'INTERNAL_SEALED_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_REFERENCES_ONLY'
  };
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(ledgerResult(), context());
  const body = actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal;

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.SEALED);
  assert.equal(actual.reason, 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SEALED');
  assert.equal(body.proto, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_PROTO);
  assert.equal(body.kind, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_KIND);
  assert.match(body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_sha256, /^[a-f0-9]{64}$/);
  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_components_satisfied, true);
  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_entries_preserved, true);
  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_boundary_state, 'PRESERVED');
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SEALED_FROM_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(validLedger(), context());
  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.SEALED);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SEALED_FROM_LEDGER_BODY');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(
    ledgerResult({
      validation_state: 'INVALID',
      validation_reason: 'RPECRC_HUMAN_CONTROL_PENDING',
      human_execution_control_external_review_candidate_state: 'PENDING'
    }),
    context()
  );

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.SEALED);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_HUMAN_PENDING_SEALED');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(
    ledgerResult({
      validation_state: 'INVALID',
      validation_reason: 'RPECRC_BOUNDARY_BLOCKED',
      submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_boundary_state: 'BLOCKED',
      claims_not_created_preserved: false,
      runtime_effects_preserved: false
    }),
    context()
  );

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.SEALED);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_boundary_state, 'BLOCKED');
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal.external_submission_dispatched, false);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal.external_archive_storage_created, false);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal.public_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_BOUNDARY_BLOCKED_SEALED');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(ledgerResult(), {
    generated_at: '2026-09-23T09:35:00Z'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_ID_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_ID_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(ledgerResult(), {
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_id: 'submission:rpecrc:dispatch-receipt-archive-inventory-archive-inventory-seal:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal({ state: 'INVALID' }, context());

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(ledgerResult(), context());
  const body = actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal;

  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_component_count, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS.length);
  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_sealed_component_count, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS.length);
  assert.deepEqual(
    body.submission_dispatch_receipt_archive_inventory_archive_inventory_sealed_components.map(component => component.source_ref_field),
    SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS.map(component => component.ref_field)
  );
  assert.equal(SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS.length, 32);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(ledgerResult(), context());
  const scope = actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_scope;

  assert.equal(scope.INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL, true);
  assert.equal(scope.EXTERNAL_REVIEW_EXECUTION, false);
  assert.equal(scope.EXTERNAL_SUBMISSION_DISPATCH, false);
  assert.equal(scope.EXTERNAL_SUBMISSION_RECEIPT, false);
  assert.equal(scope.EXTERNAL_ARCHIVE_STORAGE, false);
  assert.equal(scope.PUBLIC_REGISTRY_MUTATION, false);
  assert.equal(scope.EXTERNAL_TRUST_REGISTRY_MUTATION, false);
  assert.equal(scope.LEGAL_CERTIFICATION, false);
  assert.equal(scope.EIDAS_QUALIFICATION, false);
  assert.equal(scope.OPC_ALLOW, false);
  assert.equal(scope.DEPLOYMENT_SUCCESS, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SCOPE_FALSE');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(ledgerResult(), context());
  const body = actual.submission_dispatch_receipt_archive_inventory_archive_inventory_seal;

  for (const field of FALSE_RUNTIME_FIELDS) {
    assert.equal(body[field], false, field);
  }

  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_RUNTIME_EFFECTS_FALSE');
}
