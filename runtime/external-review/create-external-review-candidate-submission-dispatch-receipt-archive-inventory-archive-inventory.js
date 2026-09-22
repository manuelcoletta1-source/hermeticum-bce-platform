'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchive
} = require('./create-external-review-candidate-submission-dispatch-receipt-archive-inventory-archive');

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE = Object.freeze({
  INVENTORIED: 'INVENTORIED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-v1';
const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY';

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY: true,
  INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY: true,
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
});

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS = Object.freeze([
  Object.freeze({
    inventory_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-COMPONENT-001',
    inventory_component_name: 'Internal Submission Dispatch Receipt Archive Inventory Archive',
    ref_field: 'submission_dispatch_receipt_archive_inventory_archive_sha256'
  }),
  ...SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS.map((component, index) => Object.freeze({
    inventory_component_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-COMPONENT-${String(index + 2).padStart(3, '0')}`,
    inventory_component_name: component.archive_component_name,
    ref_field: component.ref_field
  }))
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
  'public_registry_mutated',
  'external_trust_registry_mutated',
  'legal_certification_created',
  'eidas_qualification_created',
  'opc_allow_created',
  'deployment_success_proven',
  'production_deployment_proven'
]);

const REQUIRED_SATISFIED_FIELDS = Object.freeze([
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

function result(state, reason, body) {
  if (body) {
    return Object.freeze({
      state,
      reason,
      submission_dispatch_receipt_archive_inventory_archive_inventory: body
    });
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
  return (
    isNonEmptyString(value) &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
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

function isArchiveBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_inventory_archive_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_inventory_archive_sha256)
  );
}

function resolveArchive(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_STATE.ARCHIVED &&
    isArchiveBody(source.submission_dispatch_receipt_archive_inventory_archive)
  ) {
    return source.submission_dispatch_receipt_archive_inventory_archive;
  }

  if (isArchiveBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const archiveResult = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchive(
    source,
    isPlainObject(context.submission_dispatch_receipt_archive_inventory_archive_context)
      ? context.submission_dispatch_receipt_archive_inventory_archive_context
      : {}
  );

  if (
    archiveResult.state !== SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_STATE.ARCHIVED ||
    !isArchiveBody(archiveResult.submission_dispatch_receipt_archive_inventory_archive)
  ) {
    return null;
  }

  return archiveResult.submission_dispatch_receipt_archive_inventory_archive;
}

function inventoryComponentsSatisfied(archive) {
  for (const component of SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS) {
    if (!isNonEmptyString(archive[component.ref_field])) {
      return false;
    }
  }

  return true;
}

function archiveRecordsPreserved(archive) {
  return (
    Array.isArray(archive.submission_dispatch_receipt_archive_inventory_archive_records) &&
    archive.submission_dispatch_receipt_archive_inventory_archive_record_count === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS.length &&
    archive.submission_dispatch_receipt_archive_inventory_archive_records.length === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_COMPONENTS.length
  );
}

function scopePreserved(archive) {
  const scope = archive.submission_dispatch_receipt_archive_inventory_archive_scope;

  return (
    isPlainObject(scope) &&
    scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_ONLY === true &&
    scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE === true &&
    scope.INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE === true &&
    scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    scope.EXTERNAL_REVIEW_EXECUTION === false &&
    scope.EXTERNAL_REVIEW_OPINION === false &&
    scope.EXTERNAL_REVIEW_REPORT === false &&
    scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    scope.EXTERNAL_SUBMISSION_RECEIPT === false &&
    scope.EXTERNAL_ARCHIVE_STORAGE === false &&
    scope.PUBLIC_REGISTRY_MUTATION === false &&
    scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false &&
    scope.LEGAL_CERTIFICATION === false &&
    scope.EIDAS_QUALIFICATION === false &&
    scope.OPC_ALLOW === false &&
    scope.DEPLOYMENT_SUCCESS === false &&
    scope.PRODUCTION_DEPLOYMENT === false
  );
}

function runtimeEffectsPreserved(archive) {
  for (const field of FALSE_RUNTIME_FIELDS) {
    if (archive[field] !== false) {
      return false;
    }
  }

  return true;
}

function satisfiedFieldsPreserved(archive) {
  for (const field of REQUIRED_SATISFIED_FIELDS) {
    if (archive[field] !== true) {
      return false;
    }
  }

  return true;
}

function createInventoryItems(archive) {
  return SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS.map((component, index) => Object.freeze({
    inventory_item_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-ITEM-${String(index + 1).padStart(3, '0')}`,
    inventory_item_name: component.inventory_component_name,
    inventory_component_ref: component.inventory_component_id,
    source_ref_field: component.ref_field,
    source_ref_value: archive[component.ref_field]
  }));
}

function copyArchiveFields(target, archive) {
  for (const [key, value] of Object.entries(archive)) {
    if (key === 'proto' || key === 'kind' || key === 'generated_at') {
      continue;
    }

    target[key] = value;
  }
}

function createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventory(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_GENERATED_AT_INVALID'
    );
  }

  const archive = resolveArchive(source, context);

  if (!archive) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVALID'
    );
  }

  const componentsOk = inventoryComponentsSatisfied(archive);
  const recordsOk = archiveRecordsPreserved(archive);
  const scopeOk = scopePreserved(archive);
  const runtimeOk = runtimeEffectsPreserved(archive);
  const satisfiedOk = satisfiedFieldsPreserved(archive);
  const preservedBoundary = (
    componentsOk &&
    recordsOk &&
    scopeOk &&
    runtimeOk &&
    satisfiedOk &&
    archive.submission_dispatch_receipt_archive_inventory_archive_boundary_state === 'PRESERVED'
  );

  const items = createInventoryItems(archive);

  const body = {
    proto: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_KIND,
    submission_dispatch_receipt_archive_inventory_archive_inventory_id: context.submission_dispatch_receipt_archive_inventory_archive_inventory_id,
    submission_dispatch_receipt_archive_inventory_archive_inventory_version: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_version, '1.0'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVENTORIED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_archive_inventory_archive_inventory_scope: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SCOPE,
    submission_dispatch_receipt_archive_inventory_archive_inventory_ref: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_ref, 'internal-submission-dispatch-receipt-archive-inventory-archive-inventory:pending'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_method: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_method, 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ONLY'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_material_state: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_material_state, 'INTERNAL_INVENTORIED_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_REFERENCES_ONLY')
  };

  copyArchiveFields(body, archive);

  body.submission_dispatch_receipt_archive_inventory_archive_proto = archive.proto;
  body.submission_dispatch_receipt_archive_inventory_archive_kind = archive.kind;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_components = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_component_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS.length;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_items = items;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_item_count = items.length;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_components_satisfied = componentsOk;
  body.submission_dispatch_receipt_archive_inventory_archive_records_preserved = recordsOk;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';

  for (const field of FALSE_RUNTIME_FIELDS) {
    body[field] = false;
  }

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_sha256 = sha256Canonical(body);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE.INVENTORIED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_INVENTORIED',
    deepFreeze(body)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventory
});
