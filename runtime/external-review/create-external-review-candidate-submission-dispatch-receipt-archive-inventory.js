'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchive
} = require('./create-external-review-candidate-submission-dispatch-receipt-archive');

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_STATE = Object.freeze({
  INVENTORIED: 'INVENTORIED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-v1';
const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY';

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY: true,
  INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY: true,
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
  LEGAL_CERTIFICATION: false,
  EIDAS_QUALIFICATION: false,
  OPC_ALLOW: false,
  DEPLOYMENT_SUCCESS: false,
  PRODUCTION_DEPLOYMENT: false,
  PUBLIC_REGISTRY_MUTATION: false,
  EXTERNAL_TRUST_REGISTRY_MUTATION: false
});

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_COMPONENTS = Object.freeze([
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-001',
    inventory_component_name: 'Internal Submission Dispatch Receipt Archive',
    ref_field: 'submission_dispatch_receipt_archive_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-002',
    inventory_component_name: 'Internal Submission Dispatch Receipt Closure',
    ref_field: 'submission_dispatch_receipt_closure_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-003',
    inventory_component_name: 'Internal Submission Dispatch Receipt Seal',
    ref_field: 'submission_dispatch_receipt_seal_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-004',
    inventory_component_name: 'Internal Submission Dispatch Receipt Ledger',
    ref_field: 'submission_dispatch_receipt_ledger_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-005',
    inventory_component_name: 'Internal Submission Dispatch Receipt Register',
    ref_field: 'submission_dispatch_receipt_register_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-006',
    inventory_component_name: 'Internal Submission Dispatch Receipt Index',
    ref_field: 'submission_dispatch_receipt_index_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-007',
    inventory_component_name: 'Internal Submission Dispatch Receipt Manifest',
    ref_field: 'submission_dispatch_receipt_manifest_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-008',
    inventory_component_name: 'Internal Submission Dispatch Receipt Package',
    ref_field: 'submission_dispatch_receipt_package_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-009',
    inventory_component_name: 'Internal Submission Dispatch Receipt Candidate',
    ref_field: 'submission_dispatch_receipt_candidate_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-010',
    inventory_component_name: 'Internal Submission Dispatch Envelope',
    ref_field: 'submission_dispatch_envelope_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-011',
    inventory_component_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-012',
    inventory_component_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-013',
    inventory_component_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-014',
    inventory_component_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-015',
    inventory_component_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-016',
    inventory_component_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-017',
    inventory_component_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-018',
    inventory_component_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-019',
    inventory_component_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-020',
    inventory_component_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-021',
    inventory_component_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-022',
    inventory_component_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-COMPONENT-023',
    inventory_component_name: 'Receipt Archive Boundary State',
    ref_field: 'submission_dispatch_receipt_archive_boundary_state'
  })
]);

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
  'legal_certification_created',
  'eidas_qualification_created',
  'opc_allow_created',
  'deployment_success_proven',
  'production_deployment_proven',
  'public_registry_mutated',
  'external_trust_registry_mutated'
]);

const REQUIRED_SATISFIED_FIELDS = Object.freeze([
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

function result(state, reason, submissionDispatchReceiptArchiveInventory) {
  if (submissionDispatchReceiptArchiveInventory) {
    return Object.freeze({ state, reason, submission_dispatch_receipt_archive_inventory: submissionDispatchReceiptArchiveInventory });
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
  if (!isPlainObject(value) && !Array.isArray(value)) {
    return value;
  }

  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }

  return Object.freeze(value);
}

function defaultString(value, fallback) {
  return isNonEmptyString(value) ? value : fallback;
}

function isSubmissionDispatchReceiptArchiveBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_sha256)
  );
}

function resolveSubmissionDispatchReceiptArchive(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE.ARCHIVED &&
    isSubmissionDispatchReceiptArchiveBody(source.submission_dispatch_receipt_archive)
  ) {
    return source.submission_dispatch_receipt_archive;
  }

  if (isSubmissionDispatchReceiptArchiveBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchReceiptArchiveResult = createExternalReviewCandidateSubmissionDispatchReceiptArchive(
    source,
    isPlainObject(context.submission_dispatch_receipt_archive_context)
      ? context.submission_dispatch_receipt_archive_context
      : {}
  );

  if (
    submissionDispatchReceiptArchiveResult.state !== SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_STATE.ARCHIVED ||
    !isSubmissionDispatchReceiptArchiveBody(submissionDispatchReceiptArchiveResult.submission_dispatch_receipt_archive)
  ) {
    return null;
  }

  return submissionDispatchReceiptArchiveResult.submission_dispatch_receipt_archive;
}

function submissionDispatchReceiptArchiveInventoryComponentsSatisfied(submissionDispatchReceiptArchive) {
  for (const component of SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_COMPONENTS) {
    if (!isNonEmptyString(submissionDispatchReceiptArchive[component.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchReceiptArchive) {
  return (
    isPlainObject(submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope) &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_ONLY === true &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE === true &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.INTERNAL_RECEIPT_CHAIN_ARCHIVE === true &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.OPC_ALLOW === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchReceiptArchive) {
  for (const field of FALSE_RUNTIME_FIELDS) {
    if (field === 'external_archive_storage_created') {
      continue;
    }

    if (submissionDispatchReceiptArchive[field] !== false) {
      return false;
    }
  }

  return true;
}

function requiredSatisfiedFieldsPreserved(submissionDispatchReceiptArchive) {
  for (const field of REQUIRED_SATISFIED_FIELDS) {
    if (submissionDispatchReceiptArchive[field] !== true) {
      return false;
    }
  }

  return true;
}

function createInventoryItems(submissionDispatchReceiptArchive) {
  return SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_COMPONENTS.map((component, index) => Object.freeze({
    inventory_item_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ITEM-${String(index + 1).padStart(3, '0')}`,
    inventory_item_name: component.inventory_component_name,
    inventory_component_ref: component.inventory_component_id,
    source_ref_field: component.ref_field,
    source_ref_value: submissionDispatchReceiptArchive[component.ref_field]
  }));
}

function copyArchiveFields(submissionDispatchReceiptArchiveInventoryBody, submissionDispatchReceiptArchive) {
  for (const [key, value] of Object.entries(submissionDispatchReceiptArchive)) {
    if (key === 'proto' || key === 'kind' || key === 'generated_at') {
      continue;
    }

    submissionDispatchReceiptArchiveInventoryBody[key] = value;
  }
}

function createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventory(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_archive_inventory_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchReceiptArchive = resolveSubmissionDispatchReceiptArchive(source, context);

  if (!submissionDispatchReceiptArchive) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVALID'
    );
  }

  const componentsSatisfied = submissionDispatchReceiptArchiveInventoryComponentsSatisfied(submissionDispatchReceiptArchive);
  const preservedScope = scopePreserved(submissionDispatchReceiptArchive);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchReceiptArchive);
  const preservedSatisfiedFields = requiredSatisfiedFieldsPreserved(submissionDispatchReceiptArchive);
  const inventoryItems = createInventoryItems(submissionDispatchReceiptArchive);
  const preservedBoundary = (
    componentsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    preservedSatisfiedFields &&
    submissionDispatchReceiptArchive.submission_dispatch_receipt_archive_boundary_state === 'PRESERVED'
  );

  const submissionDispatchReceiptArchiveInventoryBody = {
    proto: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_KIND,
    submission_dispatch_receipt_archive_inventory_id: context.submission_dispatch_receipt_archive_inventory_id,
    submission_dispatch_receipt_archive_inventory_version: defaultString(context.submission_dispatch_receipt_archive_inventory_version, '1.0'),
    submission_dispatch_receipt_archive_inventory_state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_STATE.INVENTORIED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_archive_inventory_scope: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_SCOPE,
    submission_dispatch_receipt_archive_inventory_ref: defaultString(context.submission_dispatch_receipt_archive_inventory_ref, 'internal-submission-dispatch-receipt-archive-inventory:pending'),
    submission_dispatch_receipt_archive_inventory_method: defaultString(context.submission_dispatch_receipt_archive_inventory_method, 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_ONLY'),
    submission_dispatch_receipt_archive_inventory_material_state: defaultString(context.submission_dispatch_receipt_archive_inventory_material_state, 'INTERNAL_INVENTORIED_RECEIPT_ARCHIVE_REFERENCES_ONLY')
  };

  copyArchiveFields(submissionDispatchReceiptArchiveInventoryBody, submissionDispatchReceiptArchive);

  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_proto = submissionDispatchReceiptArchive.proto;
  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_kind = submissionDispatchReceiptArchive.kind;
  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_inventory_components = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_COMPONENTS;
  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_inventory_component_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_COMPONENTS.length;
  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_inventory_items = inventoryItems;
  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_inventory_item_count = inventoryItems.length;
  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_inventory_components_satisfied = componentsSatisfied;
  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_inventory_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';

  for (const field of FALSE_RUNTIME_FIELDS) {
    submissionDispatchReceiptArchiveInventoryBody[field] = false;
  }

  submissionDispatchReceiptArchiveInventoryBody.submission_dispatch_receipt_archive_inventory_sha256 = sha256Canonical(submissionDispatchReceiptArchiveInventoryBody);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_STATE.INVENTORIED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_INVENTORIED',
    deepFreeze(submissionDispatchReceiptArchiveInventoryBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventory
});
