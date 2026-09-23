'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventoryClosureLedger
} = require('./create-external-review-candidate-submission-dispatch-receipt-archive-inventory-archive-inventory-archive-inventory-closure-ledger');

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_STATE = Object.freeze({
  SEALED: 'SEALED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-ARCHIVE-v1';
const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL';

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL: true,
  INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE: true,
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

const SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_COMPONENTS = Object.freeze([
  Object.freeze({
    closure_seal_component_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-ARCHIVE-COMPONENT-001',
    closure_seal_component_name: 'Internal Submission Dispatch Receipt Archive Inventory Archive Inventory Archive',
    ref_field: 'submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_sha256'
  }),
  ...SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_COMPONENTS.map((component, index) => Object.freeze({
    closure_seal_component_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-ARCHIVE-COMPONENT-${String(index + 2).padStart(3, '0')}`,
    closure_seal_component_name: component.closure_seal_component_name,
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
  'submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_components_satisfied',
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

function result(state, reason, body) {
  if (body) {
    return Object.freeze({
      state,
      reason,
      submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal: body
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

function isClosureBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_PROTO &&
    value.kind === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_KIND &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_id) &&
    isNonEmptyString(value.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_sha256)
  );
}

function resolveClosure(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_STATE.LEDGERED &&
    isClosureBody(source.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger)
  ) {
    return source.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger;
  }

  if (isClosureBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const closureResult = createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventoryClosureLedger(
    source,
    isPlainObject(context.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_context)
      ? context.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_context
      : {}
  );

  if (
    closureResult.state !== SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_STATE.LEDGERED ||
    !isClosureBody(closureResult.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger)
  ) {
    return null;
  }

  return closureResult.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger;
}

function archiveComponentsSatisfied(closure) {
  for (const component of SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_COMPONENTS) {
    if (!isNonEmptyString(closure[component.ref_field])) {
      return false;
    }
  }

  return true;
}

function closureRecordsPreserved(closure) {
  return (
    Array.isArray(closure.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_components) &&
    closure.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_component_count === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_COMPONENTS.length &&
    closure.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_components.length === SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_COMPONENTS.length
  );
}

function scopePreserved(closure) {
  const scope = closure.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_scope;

  return (
    isPlainObject(scope) &&
    scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_ONLY === true &&
    scope.INTERNAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER === true &&
    scope.INTERNAL_RECEIPT_CHAIN_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE === true &&
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

function runtimeEffectsPreserved(closure) {
  for (const field of FALSE_RUNTIME_FIELDS) {
    if (closure[field] !== false) {
      return false;
    }
  }

  return true;
}

function satisfiedFieldsPreserved(closure) {
  for (const field of REQUIRED_SATISFIED_FIELDS) {
    if (closure[field] !== true) {
      return false;
    }
  }

  return true;
}

function createClosureSealComponents(closure) {
  return SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_COMPONENTS.map((component, index) => Object.freeze({
    closure_seal_component_id: `HBCE-RPECRC-SUBMISSION-DISPATCH-RECEIPT-ARCHIVE-INVENTORY-ARCHIVE-INVENTORY-ARCHIVE-RECORD-${String(index + 1).padStart(3, '0')}`,
    closure_seal_component_name: component.closure_seal_component_name,
    closure_seal_component_ref: component.closure_seal_component_id,
    source_ref_field: component.ref_field,
    source_ref_value: closure[component.ref_field]
  }));
}

function copyClosureFields(target, closure) {
  for (const [key, value] of Object.entries(closure)) {
    if (key === 'proto' || key === 'kind' || key === 'generated_at') {
      continue;
    }

    target[key] = value;
  }
}

function createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventoryClosureSeal(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_id)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_GENERATED_AT_INVALID'
    );
  }

  const closure = resolveClosure(source, context);

  if (!closure) {
    return result(
      SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_LEDGER_INVALID'
    );
  }

  const componentsOk = archiveComponentsSatisfied(closure);
  const recordsOk = closureRecordsPreserved(closure);
  const scopeOk = scopePreserved(closure);
  const runtimeOk = runtimeEffectsPreserved(closure);
  const satisfiedOk = satisfiedFieldsPreserved(closure);
  const preservedBoundary = (
    componentsOk &&
    recordsOk &&
    scopeOk &&
    runtimeOk &&
    satisfiedOk &&
    closure.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_boundary_state === 'PRESERVED'
  );

  const closureSealComponents = createClosureSealComponents(closure);

  const body = {
    proto: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_PROTO,
    kind: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_KIND,
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_id: context.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_id,
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_version: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_version, '1.0'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_state: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_STATE.SEALED,
    generated_at: context.generated_at,
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_scope: SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_SCOPE,
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_ref: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_ref, 'internal-submission-dispatch-receipt-archive-inventory-archive-inventory-archive-inventory-closure-seal:pending'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_method: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_method, 'INTERNAL_TECHNICAL_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_ONLY'),
    submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_material_state: defaultString(context.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_material_state, 'INTERNAL_ARCHIVED_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_REFERENCES_ONLY')
  };

  copyClosureFields(body, closure);

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_proto = closure.proto;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_kind = closure.kind;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_components = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_COMPONENTS;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_component_count = SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_COMPONENTS.length;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_components = closureSealComponents;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_component_count = closureSealComponents.length;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_components_satisfied = componentsOk;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_ledger_components_preserved = recordsOk;
  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_boundary_state = preservedBoundary ? 'PRESERVED' : 'BLOCKED';

  for (const field of FALSE_RUNTIME_FIELDS) {
    body[field] = false;
  }

  body.submission_dispatch_receipt_archive_inventory_archive_inventory_archive_inventory_closure_seal_sha256 = sha256Canonical(body);

  return result(
    SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_STATE.SEALED,
    'RPECRC_SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_SEALED',
    deepFreeze(body)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_STATE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_PROTO,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_KIND,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_SCOPE,
  SUBMISSION_DISPATCH_RECEIPT_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_ARCHIVE_INVENTORY_CLOSURE_SEAL_COMPONENTS,
  createExternalReviewCandidateSubmissionDispatchReceiptArchiveInventoryArchiveInventoryArchiveInventoryClosureSeal
});
