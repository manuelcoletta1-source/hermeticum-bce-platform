'use strict';

const assert = require('node:assert/strict');

const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-receipt-archive-inventory-archive-inventory-archive');

const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory
} = require('../../runtime/external-review/create-external-review-candidate-submission-dispatch-receipt-archive-inventory-archive-inventory-archive-inventory');

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
  'submission_dispatch_receipt_archive_inventory_archive_inventory_archive_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_archive_inventory_sealed_components_preserved',
  'submission_dispatch_receipt_archive_inventory_archive_inventory_seal_components_satisfied',
  'submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_entries_preserved',
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

function closureScope() {
  return {
    INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_ONLY: true,
    INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE: true,
    INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE: true,
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

function validClosure(overrides = {}) {
  const body = {
    proto: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_KIND,
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_id: 'submission:rpecrc:dispatch-receipt-archive-inventory-archive-inventory-archive:001',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_version: '1.0',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_STATE.ARCHIVED,
    generated_at: '2026-09-23T10:05:00Z',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_scope: closureScope(),
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_ref: 'submission:dispatch-receipt-archive-inventory-archive-inventory-archive:internal:001',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_method: 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_ONLY',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_material_state: 'INTERNAL_CLOSED_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_REFERENCES_ONLY',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_sha256: hash('f'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_boundary_state: 'PRESERVED',
    validation_state: 'VALID',
    validation_reason: 'RPECRC_VALID',
    human_execution_control_external_review_candidate_state: 'READY',
    lifecycle_state: 'EXTERNAL_REVIEW_CANDIDATE_READY'
  };

  for (const component of SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS) {
    body[component.ref_field] = component.ref_field.endsWith('_boundary_state') ? 'PRESERVED' : hash('a');
  }

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_records = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS.map((component, index) => ({
    archive_record_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-ARCHIVE-RECORD-${String(index + 1).padStart(3, '0')}`,
    archive_record_name: component.archive_component_name,
    archive_component_ref: component.closure_component_id,
    source_ref_field: component.ref_field,
    source_ref_value: body[component.ref_field]
  }));

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_record_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS.length;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_component_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS.length;

  for (const field of SATISFIED_FIELDS) {
    body[field] = true;
  }

  for (const field of FALSE_RUNTIME_FIELDS) {
    body[field] = false;
  }

  return Object.assign(body, overrides);
}

function closureResult(overrides = {}) {
  return {
    state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_STATE.ARCHIVED,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_CLOSED',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive: validClosure(overrides)
  };
}

function context() {
  return {
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_id: 'submission:rpecrc:dispatch-receipt-archive-inventory-archive-inventory-archive-inventory:001',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_version: '1.0',
    generated_at: '2026-09-23T10:35:00Z',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_ref: 'submission:dispatch-receipt-archive-inventory-archive-inventory-archive-inventory:internal:001',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_method: 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_ONLY',
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_material_state: 'INTERNAL_ARCHIVED_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_REFERENCES_ONLY'
  };
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(closureResult(), context());
  const body = actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory;

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVENTORIED);
  assert.equal(actual.reason, 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_INVENTORIED');
  assert.equal(body.proto, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_PROTO);
  assert.equal(body.kind, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_KIND);
  assert.match(body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_sha256, /^[a-f0-9]{64}$/);
  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_components_satisfied, true);
  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_records_preserved, true);
  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_boundary_state, 'PRESERVED');
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_INVENTORIED_FROM_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(validClosure(), context());
  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVENTORIED);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_INVENTORIED_FROM_CLOSURE_BODY');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(
    closureResult({
      validation_state: 'INVALID',
      validation_reason: 'RPECRC_HUMAN_CONTROL_PENDING',
      human_execution_control_external_review_candidate_state: 'PENDING'
    }),
    context()
  );

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVENTORIED);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory.validation_reason, 'RPECRC_HUMAN_CONTROL_PENDING');
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_boundary_state, 'PRESERVED');
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_HUMAN_PENDING_INVENTORIED');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(
    closureResult({
      validation_state: 'INVALID',
      validation_reason: 'RPECRC_BOUNDARY_BLOCKED',
      submission_dispatch_receipt_archive_inventory_archive_inventory_archive_boundary_state: 'BLOCKED',
      claims_not_created_preserved: false,
      runtime_effects_preserved: false
    }),
    context()
  );

  assert.equal(actual.state, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVENTORIED);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_boundary_state, 'BLOCKED');
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory.external_submission_dispatched, false);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory.external_archive_storage_created, false);
  assert.equal(actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory.public_registry_mutated, false);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_BOUNDARY_BLOCKED_INVENTORIED');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(closureResult(), {
    generated_at: '2026-09-23T10:35:00Z'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ID_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ID_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(closureResult(), {
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_id: 'submission:rpecrc:dispatch-receipt-archive-inventory-archive-inventory-archive-inventory:001',
    generated_at: 'not-a-date'
  });

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_GENERATED_AT_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_GENERATED_AT_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory({ state: 'INVALID' }, context());

  assert.deepEqual(actual, {
    state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVALID,
    reason: 'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVALID'
  });
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVALID');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(closureResult(), context());
  const body = actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory;

  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_component_count, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS.length);
  assert.equal(body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_item_count, SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS.length);
  assert.deepEqual(
    body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_items.map(record => record.source_ref_field),
    SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS.map(component => component.ref_field)
  );
  assert.equal(SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS.length, 35);
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(closureResult(), context());
  const scope = actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_scope;

  assert.equal(scope.INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE, true);
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
  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SCOPE_FALSE');
}

{
  const actual = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventory(closureResult(), context());
  const body = actual.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory;

  for (const field of FALSE_RUNTIME_FIELDS) {
    assert.equal(body[field], false, field);
  }

  console.log('PASS RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_RUNTIME_EFFECTS_FALSE');
}
