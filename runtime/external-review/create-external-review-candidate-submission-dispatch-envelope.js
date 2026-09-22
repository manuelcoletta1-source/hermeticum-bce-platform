'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_PACKET_STATE,
  SUBMISSION_DISPATCH_PACKET_PROTO,
  SUBMISSION_DISPATCH_PACKET_KIND,
  createExternalReviewCandidateSubmissionDispatchPacket
} = require('./create-external-review-candidate-submission-dispatch-packet');

const SUBMISSION_DISPATCH_ENVELOPE_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_ENVELOPE_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-ENVELOPE-v1';
const SUBMISSION_DISPATCH_ENVELOPE_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_ENVELOPE';

const SUBMISSION_DISPATCH_ENVELOPE_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_ENVELOPE_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_ENVELOPE: true,
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
  LEGAL_CERTIFICATION: false,
  EIDAS_QUALIFICATION: false,
  OPC_ALLOW: false,
  DEPLOYMENT_SUCCESS: false,
  PRODUCTION_DEPLOYMENT: false,
  PUBLIC_REGISTRY_MUTATION: false,
  EXTERNAL_TRUST_REGISTRY_MUTATION: false
});

const SUBMISSION_DISPATCH_ENVELOPE_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-001',
    record_name: 'Internal Submission Dispatch Packet',
    ref_field: 'submission_dispatch_packet_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-002',
    record_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-003',
    record_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-004',
    record_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-005',
    record_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-006',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-007',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-008',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-009',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-010',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-011',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-012',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-ENVELOPE-RECORD-013',
    record_name: 'Boundary State',
    ref_field: 'submission_dispatch_packet_boundary_state'
  })
]);

function result(state, reason, submissionDispatchEnvelope) {
  if (submissionDispatchEnvelope) {
    return Object.freeze({ state, reason, submission_dispatch_envelope: submissionDispatchEnvelope });
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

function isSubmissionDispatchPacketBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_PACKET_PROTO &&
    value.kind === SUBMISSION_DISPATCH_PACKET_KIND &&
    isNonEmptyString(value.submission_dispatch_packet_id) &&
    isNonEmptyString(value.submission_dispatch_packet_sha256)
  );
}

function resolveSubmissionDispatchPacket(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_PACKET_STATE.RECORDED &&
    isSubmissionDispatchPacketBody(source.submission_dispatch_packet)
  ) {
    return source.submission_dispatch_packet;
  }

  if (isSubmissionDispatchPacketBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchPacketResult = createExternalReviewCandidateSubmissionDispatchPacket(
    source,
    isPlainObject(context.submission_dispatch_packet_context)
      ? context.submission_dispatch_packet_context
      : {}
  );

  if (
    submissionDispatchPacketResult.state !== SUBMISSION_DISPATCH_PACKET_STATE.RECORDED ||
    !isSubmissionDispatchPacketBody(submissionDispatchPacketResult.submission_dispatch_packet)
  ) {
    return null;
  }

  return submissionDispatchPacketResult.submission_dispatch_packet;
}

function submissionDispatchEnvelopeRecordsSatisfied(submissionDispatchPacket) {
  for (const record of SUBMISSION_DISPATCH_ENVELOPE_RECORDS) {
    if (!isNonEmptyString(submissionDispatchPacket[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchPacket) {
  return (
    isPlainObject(submissionDispatchPacket.submission_dispatch_packet_scope) &&
    submissionDispatchPacket.submission_dispatch_packet_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_PACKET_ONLY === true &&
    submissionDispatchPacket.submission_dispatch_packet_scope.INTERNAL_SUBMISSION_DISPATCH_PACKET === true &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.OPC_ALLOW === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchPacket.submission_dispatch_packet_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchPacket) {
  return (
    submissionDispatchPacket.external_reviewer_appointed === false &&
    submissionDispatchPacket.external_review_execution_created === false &&
    submissionDispatchPacket.external_review_opinion_created === false &&
    submissionDispatchPacket.external_review_report_created === false &&
    submissionDispatchPacket.external_review_submission_created === false &&
    submissionDispatchPacket.external_review_publication_created === false &&
    submissionDispatchPacket.external_submission_dispatched === false &&
    submissionDispatchPacket.external_submission_transmitted === false &&
    submissionDispatchPacket.external_submission_accepted === false &&
    submissionDispatchPacket.external_submission_acknowledged === false &&
    submissionDispatchPacket.legal_certification_created === false &&
    submissionDispatchPacket.eidas_qualification_created === false &&
    submissionDispatchPacket.opc_allow_created === false &&
    submissionDispatchPacket.deployment_success_proven === false &&
    submissionDispatchPacket.production_deployment_proven === false &&
    submissionDispatchPacket.public_registry_mutated === false &&
    submissionDispatchPacket.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchEnvelope(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_envelope_id)) {
    return result(
      SUBMISSION_DISPATCH_ENVELOPE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_ENVELOPE_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_ENVELOPE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_ENVELOPE_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchPacket = resolveSubmissionDispatchPacket(source, context);

  if (!submissionDispatchPacket) {
    return result(
      SUBMISSION_DISPATCH_ENVELOPE_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_ENVELOPE_SUBMISSION_DISPATCH_PACKET_INVALID'
    );
  }

  const recordsSatisfied = submissionDispatchEnvelopeRecordsSatisfied(submissionDispatchPacket);
  const preservedScope = scopePreserved(submissionDispatchPacket);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchPacket);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchPacket.submission_dispatch_packet_records_satisfied === true &&
    submissionDispatchPacket.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchPacket.submission_manifest_records_satisfied === true &&
    submissionDispatchPacket.submission_package_records_satisfied === true &&
    submissionDispatchPacket.submission_candidate_records_satisfied === true &&
    submissionDispatchPacket.reviewer_selection_records_satisfied === true &&
    submissionDispatchPacket.review_package_sections_satisfied === true &&
    submissionDispatchPacket.index_entries_satisfied === true &&
    submissionDispatchPacket.manifest_entries_satisfied === true &&
    submissionDispatchPacket.audit_sections_satisfied === true &&
    submissionDispatchPacket.claims_not_created_preserved === true &&
    submissionDispatchPacket.runtime_effects_preserved === true &&
    submissionDispatchPacket.submission_dispatch_packet_boundary_state === 'PRESERVED'
  );

  const submissionDispatchEnvelopeBody = {
    proto: SUBMISSION_DISPATCH_ENVELOPE_PROTO,
    kind: SUBMISSION_DISPATCH_ENVELOPE_KIND,
    submission_dispatch_envelope_id: context.submission_dispatch_envelope_id,
    submission_dispatch_envelope_version: defaultString(context.submission_dispatch_envelope_version, '1.0'),
    submission_dispatch_envelope_state: SUBMISSION_DISPATCH_ENVELOPE_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_envelope_scope: SUBMISSION_DISPATCH_ENVELOPE_SCOPE,
    submission_dispatch_envelope_ref: defaultString(context.submission_dispatch_envelope_ref, 'internal-submission-dispatch-envelope:pending'),
    submission_dispatch_envelope_method: defaultString(context.submission_dispatch_envelope_method, 'INTERNAL_TECHNICAL_ENVELOPE_ASSEMBLY_ONLY'),
    submission_dispatch_envelope_material_state: defaultString(context.submission_dispatch_envelope_material_state, 'INTERNAL_HASHED_DISPATCH_PACKET_REFERENCES_ONLY'),
    submission_dispatch_route_state: defaultString(context.submission_dispatch_route_state, submissionDispatchPacket.submission_dispatch_route_state),
    submission_dispatch_authorization_state: defaultString(context.submission_dispatch_authorization_state, submissionDispatchPacket.submission_dispatch_authorization_state),
    submission_channel_state: defaultString(context.submission_channel_state, submissionDispatchPacket.submission_channel_state),
    submission_authorization_state: defaultString(context.submission_authorization_state, submissionDispatchPacket.submission_authorization_state),
    submission_dispatch_packet_id: submissionDispatchPacket.submission_dispatch_packet_id,
    submission_dispatch_packet_sha256: submissionDispatchPacket.submission_dispatch_packet_sha256,
    submission_dispatch_packet_ref: submissionDispatchPacket.submission_dispatch_packet_ref,
    submission_dispatch_packet_proto: submissionDispatchPacket.proto,
    submission_dispatch_packet_kind: submissionDispatchPacket.kind,
    submission_dispatch_packet_material_state: submissionDispatchPacket.submission_dispatch_packet_material_state,
    submission_dispatch_candidate_id: submissionDispatchPacket.submission_dispatch_candidate_id,
    submission_dispatch_candidate_sha256: submissionDispatchPacket.submission_dispatch_candidate_sha256,
    submission_dispatch_candidate_ref: submissionDispatchPacket.submission_dispatch_candidate_ref,
    submission_manifest_id: submissionDispatchPacket.submission_manifest_id,
    submission_manifest_sha256: submissionDispatchPacket.submission_manifest_sha256,
    submission_manifest_ref: submissionDispatchPacket.submission_manifest_ref,
    submission_package_id: submissionDispatchPacket.submission_package_id,
    submission_package_sha256: submissionDispatchPacket.submission_package_sha256,
    submission_package_ref: submissionDispatchPacket.submission_package_ref,
    submission_candidate_id: submissionDispatchPacket.submission_candidate_id,
    submission_candidate_sha256: submissionDispatchPacket.submission_candidate_sha256,
    submission_candidate_ref: submissionDispatchPacket.submission_candidate_ref,
    reviewer_selection_id: submissionDispatchPacket.reviewer_selection_id,
    reviewer_selection_sha256: submissionDispatchPacket.reviewer_selection_sha256,
    reviewer_selection_ref: submissionDispatchPacket.reviewer_selection_ref,
    reviewer_candidate_ref: submissionDispatchPacket.reviewer_candidate_ref,
    reviewer_selection_method: submissionDispatchPacket.reviewer_selection_method,
    reviewer_independence_basis: submissionDispatchPacket.reviewer_independence_basis,
    reviewer_conflict_check_state: submissionDispatchPacket.reviewer_conflict_check_state,
    review_package_id: submissionDispatchPacket.review_package_id,
    review_package_sha256: submissionDispatchPacket.review_package_sha256,
    review_package_ref: submissionDispatchPacket.review_package_ref,
    audit_index_id: submissionDispatchPacket.audit_index_id,
    audit_index_sha256: submissionDispatchPacket.audit_index_sha256,
    audit_index_ref: submissionDispatchPacket.audit_index_ref,
    audit_manifest_id: submissionDispatchPacket.audit_manifest_id,
    audit_manifest_sha256: submissionDispatchPacket.audit_manifest_sha256,
    audit_manifest_ref: submissionDispatchPacket.audit_manifest_ref,
    audit_package_id: submissionDispatchPacket.audit_package_id,
    audit_package_sha256: submissionDispatchPacket.audit_package_sha256,
    audit_package_ref: submissionDispatchPacket.audit_package_ref,
    matrix_binding_id: submissionDispatchPacket.matrix_binding_id,
    matrix_binding_sha256: submissionDispatchPacket.matrix_binding_sha256,
    evidence_id: submissionDispatchPacket.evidence_id,
    evidence_sha256: submissionDispatchPacket.evidence_sha256,
    candidate_input_sha256: submissionDispatchPacket.candidate_input_sha256,
    validation_output_sha256: submissionDispatchPacket.validation_output_sha256,
    validation_state: submissionDispatchPacket.validation_state,
    validation_reason: submissionDispatchPacket.validation_reason,
    human_execution_control_external_review_candidate_state: submissionDispatchPacket.human_execution_control_external_review_candidate_state,
    lifecycle_state: submissionDispatchPacket.lifecycle_state,
    requirement_binding_count: submissionDispatchPacket.requirement_binding_count,
    audit_section_count: submissionDispatchPacket.audit_section_count,
    manifest_entry_count: submissionDispatchPacket.manifest_entry_count,
    index_entry_count: submissionDispatchPacket.index_entry_count,
    review_package_section_count: submissionDispatchPacket.review_package_section_count,
    reviewer_selection_record_count: submissionDispatchPacket.reviewer_selection_record_count,
    submission_candidate_record_count: submissionDispatchPacket.submission_candidate_record_count,
    submission_package_record_count: submissionDispatchPacket.submission_package_record_count,
    submission_manifest_record_count: submissionDispatchPacket.submission_manifest_record_count,
    submission_dispatch_candidate_record_count: submissionDispatchPacket.submission_dispatch_candidate_record_count,
    submission_dispatch_packet_record_count: submissionDispatchPacket.submission_dispatch_packet_record_count,
    validator_test_count: submissionDispatchPacket.validator_test_count,
    evidence_test_count: submissionDispatchPacket.evidence_test_count,
    submission_dispatch_envelope_records: SUBMISSION_DISPATCH_ENVELOPE_RECORDS,
    submission_dispatch_envelope_record_count: SUBMISSION_DISPATCH_ENVELOPE_RECORDS.length,
    submission_dispatch_envelope_records_satisfied: recordsSatisfied,
    submission_dispatch_packet_records_satisfied: submissionDispatchPacket.submission_dispatch_packet_records_satisfied,
    submission_dispatch_candidate_records_satisfied: submissionDispatchPacket.submission_dispatch_candidate_records_satisfied,
    submission_manifest_records_satisfied: submissionDispatchPacket.submission_manifest_records_satisfied,
    submission_package_records_satisfied: submissionDispatchPacket.submission_package_records_satisfied,
    submission_candidate_records_satisfied: submissionDispatchPacket.submission_candidate_records_satisfied,
    reviewer_selection_records_satisfied: submissionDispatchPacket.reviewer_selection_records_satisfied,
    review_package_sections_satisfied: submissionDispatchPacket.review_package_sections_satisfied,
    index_entries_satisfied: submissionDispatchPacket.index_entries_satisfied,
    manifest_entries_satisfied: submissionDispatchPacket.manifest_entries_satisfied,
    audit_sections_satisfied: submissionDispatchPacket.audit_sections_satisfied,
    claims_not_created_preserved: submissionDispatchPacket.claims_not_created_preserved,
    runtime_effects_preserved: submissionDispatchPacket.runtime_effects_preserved,
    boundary_flags_preserved: submissionDispatchPacket.boundary_flags_preserved,
    boundary_guard_state: submissionDispatchPacket.boundary_guard_state,
    matrix_boundary_state: submissionDispatchPacket.matrix_boundary_state,
    audit_boundary_state: submissionDispatchPacket.audit_boundary_state,
    manifest_boundary_state: submissionDispatchPacket.manifest_boundary_state,
    index_boundary_state: submissionDispatchPacket.index_boundary_state,
    review_package_boundary_state: submissionDispatchPacket.review_package_boundary_state,
    reviewer_selection_boundary_state: submissionDispatchPacket.reviewer_selection_boundary_state,
    submission_candidate_boundary_state: submissionDispatchPacket.submission_candidate_boundary_state,
    submission_package_boundary_state: submissionDispatchPacket.submission_package_boundary_state,
    submission_manifest_boundary_state: submissionDispatchPacket.submission_manifest_boundary_state,
    submission_dispatch_candidate_boundary_state: submissionDispatchPacket.submission_dispatch_candidate_boundary_state,
    submission_dispatch_packet_boundary_state: submissionDispatchPacket.submission_dispatch_packet_boundary_state,
    submission_dispatch_envelope_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: submissionDispatchPacket.claims_not_created,
    runtime_effects: submissionDispatchPacket.runtime_effects,
    external_reviewer_appointed: false,
    external_review_execution_created: false,
    external_review_opinion_created: false,
    external_review_report_created: false,
    external_review_submission_created: false,
    external_review_publication_created: false,
    external_submission_dispatched: false,
    external_submission_transmitted: false,
    external_submission_accepted: false,
    external_submission_acknowledged: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false
  };

  submissionDispatchEnvelopeBody.submission_dispatch_envelope_sha256 = sha256Canonical(submissionDispatchEnvelopeBody);

  return result(
    SUBMISSION_DISPATCH_ENVELOPE_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_ENVELOPE_RECORDED',
    deepFreeze(submissionDispatchEnvelopeBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_ENVELOPE_STATE,
  SUBMISSION_DISPATCH_ENVELOPE_PROTO,
  SUBMISSION_DISPATCH_ENVELOPE_KIND,
  SUBMISSION_DISPATCH_ENVELOPE_SCOPE,
  SUBMISSION_DISPATCH_ENVELOPE_RECORDS,
  createExternalReviewCandidateSubmissionDispatchEnvelope
});
