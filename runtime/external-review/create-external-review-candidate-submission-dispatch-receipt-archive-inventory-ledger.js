'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryRegister
} = require('./create-external-review-candidate-submission-dispatch-receipt-archive-inventory-register');

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_STATE = Object.freeze({
  LEDGERED: 'LEDGERED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-LEDGER-v1';
const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER';

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER: true,
  INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_LEDGER: true,
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

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_COMPONENTS = Object.freeze([
  Object.freeze({
    ledger_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-LEDGER-COMPONENT-001',
    ledger_component_name: 'Internal Submission Dispatch Receipt Archive Inventory Register',
    ref_field: 'submission_dispatch_receipt_archive_inventory_register_sha256'
  }),
  ...SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_COMPONENTS.map((component, index) => Object.freeze({
    ledger_component_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-LEDGER-COMPONENT-${String(index + 2).padStart(3, '0')}`,
    ledger_component_name: component.register_component_name,
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
      submission_dispatch_receipt_archive_inventory_ledger: body
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

function isRegisterBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_inventory_register_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_inventory_register_sha256)
  );
}

function resolveRegister(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_STATE.REGISTERED &&
    isRegisterBody(source.submission_dispatch_receipt_archive_inventory_register)
  ) {
    return source.submission_dispatch_receipt_archive_inventory_register;
  }

  if (isRegisterBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const registerResult = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryRegister(
    source,
    isPlainObject(context.submission_dispatch_receipt_archive_inventory_register_context)
      ? context.submission_dispatch_receipt_archive_inventory_register_context
      : {}
  );

  if (
    registerResult.state !== SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_STATE.REGISTERED ||
    !isRegisterBody(registerResult.submission_dispatch_receipt_archive_inventory_register)
  ) {
    return null;
  }

  return registerResult.submission_dispatch_receipt_archive_inventory_register;
}

function ledgerComponentsSatisfied(register) {
  for (const component of SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_COMPONENTS) {
    if (!isNonEmptyString(register[component.ref_field])) {
      return false;
    }
  }

  return true;
}

function registerRecordsPreserved(register) {
  return (
    Array.isArray(register.submission_dispatch_receipt_archive_inventory_register_records) &&
    register.submission_dispatch_receipt_archive_inventory_register_record_count === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_COMPONENTS.length &&
    register.submission_dispatch_receipt_archive_inventory_register_records.length === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_COMPONENTS.length
  );
}

function scopePreserved(register) {
  const scope = register.submission_dispatch_receipt_archive_inventory_register_scope;

  return (
    isPlainObject(scope) &&
    scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_ONLY === true &&
    scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER === true &&
    scope.INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_REGISTER === true &&
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

function runtimeEffectsPreserved(register) {
  for (const field of FALSE_RUNTIME_FIELDS) {
    if (register[field] !== false) {
      return false;
    }
  }

  return true;
}

function satisfiedFieldsPreserved(register) {
  for (const field of REQUIRED_SATISFIED_FIELDS) {
    if (register[field] !== true) {
      return false;
    }
  }

  return true;
}

function createLedgerEntries(register) {
  return SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_COMPONENTS.map((component, index) => Object.freeze({
    ledger_entry_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-LEDGER-ENTRY-${String(index + 1).padStart(3, '0')}`,
    ledger_entry_name: component.ledger_component_name,
    ledger_component_ref: component.ledger_component_id,
    source_ref_field: component.ref_field,
    source_ref_value: register[component.ref_field]
  }));
}

function copyRegisterFields(target, register) {
  for (const [key, value] of Object.entries(register)) {
    if (key === 'proto' || key === 'kind' || key === 'generated_at') {
      continue;
    }

    target[key] = value;
  }
}

function createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryLedger(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_archive_inventory_ledger_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_GENERATED_AT_INVALID'
    );
  }

  const register = resolveRegister(source, context);

  if (!register) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_REGISTER_INVALID'
    );
  }

  const componentsOk = ledgerComponentsSatisfied(register);
  const recordsOk = registerRecordsPreserved(register);
  const scopeOk = scopePreserved(register);
  const runtimeOk = runtimeEffectsPreserved(register);
  const satisfiedOk = satisfiedFieldsPreserved(register);
  const preservedBoundary = (
    componentsOk &&
    recordsOk &&
    scopeOk &&
    runtimeOk &&
    satisfiedOk &&
    register.submission_dispatch_receipt_archive_inventory_register_boundary_state === 'PRESERVED'
  );

  const entries = createLedgerEntries(register);

  const body = {
    proto: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_KIND,
    submission_dispatch_receipt_archive_inventory_ledger_id: context.submission_dispatch_receipt_archive_inventory_ledger_id,
    submission_dispatch_receipt_archive_inventory_ledger_version: defaultString(context.submission_dispatch_receipt_archive_inventory_ledger_version, '1.0'),
    submission_dispatch_receipt_archive_inventory_ledger_state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_STATE.LEDGERED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_archive_inventory_ledger_scope: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_SCOPE,
    submission_dispatch_receipt_archive_inventory_ledger_ref: defaultString(context.submission_dispatch_receipt_archive_inventory_ledger_ref, 'internal-submission-dispatch-receipt-archive-inventory-ledger:pending'),
    submission_dispatch_receipt_archive_inventory_ledger_method: defaultString(context.submission_dispatch_receipt_archive_inventory_ledger_method, 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_LEDGER_ONLY'),
    submission_dispatch_receipt_archive_inventory_ledger_material_state: defaultString(context.submission_dispatch_receipt_archive_inventory_ledger_material_state, 'INTERNAL_LEDGERED_RECEIPT_ARCHIVE_INVENTORY_REGISTER_REFERENCES_ONLY')
  };

  copyRegisterFields(body, register);

  body.submission_dispatch_receipt_archive_inventory_register_proto = register.proto;
  body.submission_dispatch_receipt_archive_inventory_register_kind = register.kind;
  body.submission_dispatch_receipt_archive_inventory_ledger_components = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_COMPONENTS;
  body.submission_dispatch_receipt_archive_inventory_ledger_component_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_COMPONENTS.length;
  body.submission_dispatch_receipt_archive_inventory_ledger_entries = entries;
  body.submission_dispatch_receipt_archive_inventory_ledger_entry_count = entries.length;
  body.submission_dispatch_receipt_archive_inventory_ledger_entries_satisfied = componentsOk;
  body.submission_dispatch_receipt_archive_inventory_register_records_preserved = recordsOk;
  body.submission_dispatch_receipt_archive_inventory_ledger_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';

  for (const field of FALSE_RUNTIME_FIELDS) {
    body[field] = false;
  }

  body.submission_dispatch_receipt_archive_inventory_ledger_sha256 = sha256Canonical(body);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_STATE.LEDGERED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_LEDGERED',
    deepFreeze(body)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_LEDGER_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryLedger
});
