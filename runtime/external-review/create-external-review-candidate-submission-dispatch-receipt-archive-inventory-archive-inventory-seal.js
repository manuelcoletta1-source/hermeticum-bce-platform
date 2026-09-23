'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryLedger
} = require('./create-external-review-candidate-submission-dispatch-receipt-archive-inventory-archive-inventory-ledger');

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE = Object.freeze({
  SEALED: 'SEALED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-SEAL-v1';
const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL';

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL: true,
  INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL: true,
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

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS = Object.freeze([
  Object.freeze({
    seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-SEAL-COMPONENT-001',
    seal_component_name: 'Internal Submission Dispatch Receipt Archive Inventory Archive Inventory Ledger',
    ref_field: 'submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_sha256'
  }),
  ...SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS.map((component, index) => Object.freeze({
    seal_component_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-SEAL-COMPONENT-${String(index + 2).padStart(3, '0')}`,
    seal_component_name: component.ledger_component_name,
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

function result(state, reason, body) {
  if (body) {
    return Object.freeze({
      state,
      reason,
      submission_dispatch_receipt_archive_inventory_archive_inventory_seal: body
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

function isLedgerBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_sha256)
  );
}

function resolveLedger(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_STATE.LEDGERED &&
    isLedgerBody(source.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger)
  ) {
    return source.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger;
  }

  if (isLedgerBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const ledgerResult = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryLedger(
    source,
    isPlainObject(context.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_context)
      ? context.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_context
      : {}
  );

  if (
    ledgerResult.state !== SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_STATE.LEDGERED ||
    !isLedgerBody(ledgerResult.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger)
  ) {
    return null;
  }

  return ledgerResult.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger;
}

function sealComponentsSatisfied(ledger) {
  for (const component of SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS) {
    if (!isNonEmptyString(ledger[component.ref_field])) {
      return false;
    }
  }

  return true;
}

function ledgerEntriesPreserved(ledger) {
  return (
    Array.isArray(ledger.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_entries) &&
    ledger.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_entry_count === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS.length &&
    ledger.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_entries.length === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_COMPONENTS.length
  );
}

function scopePreserved(ledger) {
  const scope = ledger.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_scope;

  return (
    isPlainObject(scope) &&
    scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_ONLY === true &&
    scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER === true &&
    scope.INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER === true &&
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

function runtimeEffectsPreserved(ledger) {
  for (const field of FALSE_RUNTIME_FIELDS) {
    if (ledger[field] !== false) {
      return false;
    }
  }

  return true;
}

function satisfiedFieldsPreserved(ledger) {
  for (const field of REQUIRED_SATISFIED_FIELDS) {
    if (ledger[field] !== true) {
      return false;
    }
  }

  return true;
}

function createSealedComponents(ledger) {
  return SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS.map((component, index) => Object.freeze({
    sealed_component_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-SEALED-COMPONENT-${String(index + 1).padStart(3, '0')}`,
    sealed_component_name: component.seal_component_name,
    seal_component_ref: component.seal_component_id,
    source_ref_field: component.ref_field,
    source_ref_value: ledger[component.ref_field]
  }));
}

function copyLedgerFields(target, ledger) {
  for (const [key, value] of Object.entries(ledger)) {
    if (key === 'proto' || key === 'kind' || key === 'generated_at') {
      continue;
    }

    target[key] = value;
  }
}

function createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_GENERATED_AT_INVALID'
    );
  }

  const ledger = resolveLedger(source, context);

  if (!ledger) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_LEDGER_INVALID'
    );
  }

  const componentsOk = sealComponentsSatisfied(ledger);
  const entriesOk = ledgerEntriesPreserved(ledger);
  const scopeOk = scopePreserved(ledger);
  const runtimeOk = runtimeEffectsPreserved(ledger);
  const satisfiedOk = satisfiedFieldsPreserved(ledger);
  const preservedBoundary = (
    componentsOk &&
    entriesOk &&
    scopeOk &&
    runtimeOk &&
    satisfiedOk &&
    ledger.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_boundary_state === 'PRESERVED'
  );

  const sealedComponents = createSealedComponents(ledger);

  const body = {
    proto: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_KIND,
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_id: context.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_id,
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_version: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_version, '1.0'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.SEALED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_scope: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SCOPE,
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_ref: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_ref, 'internal-submission-dispatch-receipt-archive-inventory-archive-inventory-seal:pending'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_method: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_method, 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_ONLY'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_seal_material_state: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_material_state, 'INTERNAL_SEALED_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_REFERENCES_ONLY')
  };

  copyLedgerFields(body, ledger);

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_proto = ledger.proto;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_kind = ledger.kind;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_components = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_component_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS.length;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_sealed_components = sealedComponents;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_sealed_component_count = sealedComponents.length;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_components_satisfied = componentsOk;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_ledger_entries_preserved = entriesOk;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';

  for (const field of FALSE_RUNTIME_FIELDS) {
    body[field] = false;
  }

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_seal_sha256 = sha256Canonical(body);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE.SEALED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SEALED',
    deepFreeze(body)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_SEAL_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventorySeal
});
