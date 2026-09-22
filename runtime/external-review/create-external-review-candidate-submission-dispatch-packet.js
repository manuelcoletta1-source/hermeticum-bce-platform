'use strict';

const {
  sha256Canonical
} = require('./create-external-review-candidate-evidence');
const {
  SUBMISSION_DISPATCH_CANDIDATE_STATE,
  SUBMISSION_DISPATCH_CANDIDATE_PROTO,
  SUBMISSION_DISPATCH_CANDIDATE_KIND,
  createExternalReviewCandidateSubmissionDispatchCandidate
} = require('./create-external-review-candidate-submission-dispatch-candidate');

const SUBMISSION_DISPATCH_PACKET_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const SUBMISSION_DISPATCH_PACKET_PROTO = 'HBCE-RPECRC-INTERNAL-SUBMISSION-DISPATCH-PACKET-v1';
const SUBMISSION_DISPATCH_PACKET_KIND = 'PRODUCTION_READINESS_EXECUTION_CONTROL_EXTERNAL_REVIEW_CANDIDATE_INTERNAL_SUBMISSION_DISPATCH_PACKET';

const SUBMISSION_DISPATCH_PACKET_SCOPE = Object.freeze({
  INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_PACKET_ONLY: true,
  INTERNAL_SUBMISSION_DISPATCH_PACKET: true,
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

const SUBMISSION_DISPATCH_PACKET_RECORDS = Object.freeze([
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-001',
    record_name: 'Internal Submission Dispatch Candidate',
    ref_field: 'submission_dispatch_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-002',
    record_name: 'Internal Submission Manifest',
    ref_field: 'submission_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-003',
    record_name: 'Internal Submission Package',
    ref_field: 'submission_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-004',
    record_name: 'Internal Submission Candidate',
    ref_field: 'submission_candidate_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-005',
    record_name: 'Internal Reviewer Selection',
    ref_field: 'reviewer_selection_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-006',
    record_name: 'Internal Review Package',
    ref_field: 'review_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-007',
    record_name: 'Internal Audit Index',
    ref_field: 'audit_index_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-008',
    record_name: 'Internal Audit Manifest',
    ref_field: 'audit_manifest_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-009',
    record_name: 'Internal Audit Package',
    ref_field: 'audit_package_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-010',
    record_name: 'MATRIX Binding',
    ref_field: 'matrix_binding_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-011',
    record_name: 'Validation Evidence',
    ref_field: 'evidence_sha256'
  }),
  Object.freeze({
    record_id: 'HBCE-RPECRC-SUBMISSION-DISPATCH-PACKET-RECORD-012',
    record_name: 'Boundary State',
    ref_field: 'submission_dispatch_candidate_boundary_state'
  })
]);

function result(state, reason, submissionDispatchPacket) {
  if (submissionDispatchPacket) {
    return Object.freeze({ state, reason, submission_dispatch_packet: submissionDispatchPacket });
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

function isSubmissionDispatchCandidateBody(value) {
  return (
    isPlainObject(value) &&
    value.proto === SUBMISSION_DISPATCH_CANDIDATE_PROTO &&
    value.kind === SUBMISSION_DISPATCH_CANDIDATE_KIND &&
    isNonEmptyString(value.submission_dispatch_candidate_id) &&
    isNonEmptyString(value.submission_dispatch_candidate_sha256)
  );
}

function resolveSubmissionDispatchCandidate(source, context) {
  if (
    isPlainObject(source) &&
    source.state === SUBMISSION_DISPATCH_CANDIDATE_STATE.RECORDED &&
    isSubmissionDispatchCandidateBody(source.submission_dispatch_candidate)
  ) {
    return source.submission_dispatch_candidate;
  }

  if (isSubmissionDispatchCandidateBody(source)) {
    return source;
  }

  if (isPlainObject(source) && Object.prototype.hasOwnProperty.call(source, 'state')) {
    return null;
  }

  const submissionDispatchCandidateResult = createExternalReviewCandidateSubmissionDispatchCandidate(
    source,
    isPlainObject(context.submission_dispatch_candidate_context)
      ? context.submission_dispatch_candidate_context
      : {}
  );

  if (
    submissionDispatchCandidateResult.state !== SUBMISSION_DISPATCH_CANDIDATE_STATE.RECORDED ||
    !isSubmissionDispatchCandidateBody(submissionDispatchCandidateResult.submission_dispatch_candidate)
  ) {
    return null;
  }

  return submissionDispatchCandidateResult.submission_dispatch_candidate;
}

function submissionDispatchPacketRecordsSatisfied(submissionDispatchCandidate) {
  for (const record of SUBMISSION_DISPATCH_PACKET_RECORDS) {
    if (!isNonEmptyString(submissionDispatchCandidate[record.ref_field])) {
      return false;
    }
  }

  return true;
}

function scopePreserved(submissionDispatchCandidate) {
  return (
    isPlainObject(submissionDispatchCandidate.submission_dispatch_candidate_scope) &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.INTERNAL_TECHNICAL_SUBMISSION_DISPATCH_CANDIDATE_ONLY === true &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.INTERNAL_SUBMISSION_DISPATCH_CANDIDATE === true &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEWER_APPOINTMENT === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEW_EXECUTION === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEW_OPINION === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEW_REPORT === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEW_SUBMISSION === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_REVIEW_PUBLICATION === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_SUBMISSION_DISPATCH === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_SUBMISSION_TRANSMISSION === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_SUBMISSION_ACCEPTANCE === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_SUBMISSION_ACKNOWLEDGEMENT === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.LEGAL_CERTIFICATION === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EIDAS_QUALIFICATION === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.OPC_ALLOW === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.DEPLOYMENT_SUCCESS === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.PRODUCTION_DEPLOYMENT === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.PUBLIC_REGISTRY_MUTATION === false &&
    submissionDispatchCandidate.submission_dispatch_candidate_scope.EXTERNAL_TRUST_REGISTRY_MUTATION === false
  );
}

function runtimeEffectsPreserved(submissionDispatchCandidate) {
  return (
    submissionDispatchCandidate.external_reviewer_appointed === false &&
    submissionDispatchCandidate.external_review_execution_created === false &&
    submissionDispatchCandidate.external_review_opinion_created === false &&
    submissionDispatchCandidate.external_review_report_created === false &&
    submissionDispatchCandidate.external_review_submission_created === false &&
    submissionDispatchCandidate.external_review_publication_created === false &&
    submissionDispatchCandidate.external_submission_dispatched === false &&
    submissionDispatchCandidate.external_submission_transmitted === false &&
    submissionDispatchCandidate.external_submission_accepted === false &&
    submissionDispatchCandidate.external_submission_acknowledged === false &&
    submissionDispatchCandidate.legal_certification_created === false &&
    submissionDispatchCandidate.eidas_qualification_created === false &&
    submissionDispatchCandidate.opc_allow_created === false &&
    submissionDispatchCandidate.deployment_success_proven === false &&
    submissionDispatchCandidate.production_deployment_proven === false &&
    submissionDispatchCandidate.public_registry_mutated === false &&
    submissionDispatchCandidate.external_trust_registry_mutated === false
  );
}

function createExternalReviewCandidateSubmissionDispatchPacket(source, context = {}) {
  if (!isPlainObject(context) || !isNonEmptyString(context.submission_dispatch_packet_id)) {
    return result(
      SUBMISSION_DISPATCH_PACKET_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_PACKET_ID_INVALID'
    );
  }

  if (!isIsoDateTime(context.generated_at)) {
    return result(
      SUBMISSION_DISPATCH_PACKET_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_PACKET_GENERATED_AT_INVALID'
    );
  }

  const submissionDispatchCandidate = resolveSubmissionDispatchCandidate(source, context);

  if (!submissionDispatchCandidate) {
    return result(
      SUBMISSION_DISPATCH_PACKET_STATE.INVALID,
      'RPECRC_SUBMISSION_DISPATCH_PACKET_SUBMISSION_DISPATCH_CANDIDATE_INVALID'
    );
  }

  const recordsSatisfied = submissionDispatchPacketRecordsSatisfied(submissionDispatchCandidate);
  const preservedScope = scopePreserved(submissionDispatchCandidate);
  const preservedRuntimeEffects = runtimeEffectsPreserved(submissionDispatchCandidate);
  const preservedBoundary = (
    recordsSatisfied &&
    preservedScope &&
    preservedRuntimeEffects &&
    submissionDispatchCandidate.submission_dispatch_candidate_records_satisfied === true &&
    submissionDispatchCandidate.submission_manifest_records_satisfied === true &&
    submissionDispatchCandidate.submission_package_records_satisfied === true &&
    submissionDispatchCandidate.submission_candidate_records_satisfied === true &&
    submissionDispatchCandidate.reviewer_selection_records_satisfied === true &&
    submissionDispatchCandidate.review_package_sections_satisfied === true &&
    submissionDispatchCandidate.index_entries_satisfied === true &&
    submissionDispatchCandidate.manifest_entries_satisfied === true &&
    submissionDispatchCandidate.audit_sections_satisfied === true &&
    submissionDispatchCandidate.claims_not_created_preserved === true &&
    submissionDispatchCandidate.runtime_effects_preserved === true &&
    submissionDispatchCandidate.submission_dispatch_candidate_boundary_state === 'PRESERVED'
  );

  const submissionDispatchPacketBody = {
    proto: SUBMISSION_DISPATCH_PACKET_PROTO,
    kind: SUBMISSION_DISPATCH_PACKET_KIND,
    submission_dispatch_packet_id: context.submission_dispatch_packet_id,
    submission_dispatch_packet_version: defaultString(context.submission_dispatch_packet_version, '1.0'),
    submission_dispatch_packet_state: SUBMISSION_DISPATCH_PACKET_STATE.RECORDED,
    generated_at: context.generated_at,
    submission_dispatch_packet_scope: SUBMISSION_DISPATCH_PACKET_SCOPE,
    submission_dispatch_packet_ref: defaultString(context.submission_dispatch_packet_ref, 'internal-submission-dispatch-packet:pending'),
    submission_dispatch_packet_method: defaultString(context.submission_dispatch_packet_method, 'INTERNAL_TECHNICAL_PACKET_ASSEMBLY_ONLY'),
    submission_dispatch_packet_material_state: defaultString(context.submission_dispatch_packet_material_state, 'INTERNAL_HASHED_DISPATCH_CANDIDATE_REFERENCES_ONLY'),
    submission_dispatch_route_state: defaultString(context.submission_dispatch_route_state, submissionDispatchCandidate.submission_dispatch_route_state),
    submission_dispatch_authorization_state: defaultString(context.submission_dispatch_authorization_state, submissionDispatchCandidate.submission_dispatch_authorization_state),
    submission_channel_state: defaultString(context.submission_channel_state, submissionDispatchCandidate.submission_channel_state),
    submission_authorization_state: defaultString(context.submission_authorization_state, submissionDispatchCandidate.submission_authorization_state),
    submission_dispatch_candidate_id: submissionDispatchCandidate.submission_dispatch_candidate_id,
    submission_dispatch_candidate_sha256: submissionDispatchCandidate.submission_dispatch_candidate_sha256,
    submission_dispatch_candidate_ref: submissionDispatchCandidate.submission_dispatch_candidate_ref,
    submission_dispatch_candidate_proto: submissionDispatchCandidate.proto,
    submission_dispatch_candidate_kind: submissionDispatchCandidate.kind,
    submission_manifest_id: submissionDispatchCandidate.submission_manifest_id,
    submission_manifest_sha256: submissionDispatchCandidate.submission_manifest_sha256,
    submission_manifest_ref: submissionDispatchCandidate.submission_manifest_ref,
    submission_package_id: submissionDispatchCandidate.submission_package_id,
    submission_package_sha256: submissionDispatchCandidate.submission_package_sha256,
    submission_package_ref: submissionDispatchCandidate.submission_package_ref,
    submission_candidate_id: submissionDispatchCandidate.submission_candidate_id,
    submission_candidate_sha256: submissionDispatchCandidate.submission_candidate_sha256,
    submission_candidate_ref: submissionDispatchCandidate.submission_candidate_ref,
    reviewer_selection_id: submissionDispatchCandidate.reviewer_selection_id,
    reviewer_selection_sha256: submissionDispatchCandidate.reviewer_selection_sha256,
    reviewer_selection_ref: submissionDispatchCandidate.reviewer_selection_ref,
    reviewer_candidate_ref: submissionDispatchCandidate.reviewer_candidate_ref,
    reviewer_selection_method: submissionDispatchCandidate.reviewer_selection_method,
    reviewer_independence_basis: submissionDispatchCandidate.reviewer_independence_basis,
    reviewer_conflict_check_state: submissionDispatchCandidate.reviewer_conflict_check_state,
    review_package_id: submissionDispatchCandidate.review_package_id,
    review_package_sha256: submissionDispatchCandidate.review_package_sha256,
    review_package_ref: submissionDispatchCandidate.review_package_ref,
    audit_index_id: submissionDispatchCandidate.audit_index_id,
    audit_index_sha256: submissionDispatchCandidate.audit_index_sha256,
    audit_index_ref: submissionDispatchCandidate.audit_index_ref,
    audit_manifest_id: submissionDispatchCandidate.audit_manifest_id,
    audit_manifest_sha256: submissionDispatchCandidate.audit_manifest_sha256,
    audit_manifest_ref: submissionDispatchCandidate.audit_manifest_ref,
    audit_package_id: submissionDispatchCandidate.audit_package_id,
    audit_package_sha256: submissionDispatchCandidate.audit_package_sha256,
    audit_package_ref: submissionDispatchCandidate.audit_package_ref,
    matrix_binding_id: submissionDispatchCandidate.matrix_binding_id,
    matrix_binding_sha256: submissionDispatchCandidate.matrix_binding_sha256,
    evidence_id: submissionDispatchCandidate.evidence_id,
    evidence_sha256: submissionDispatchCandidate.evidence_sha256,
    candidate_input_sha256: submissionDispatchCandidate.candidate_input_sha256,
    validation_output_sha256: submissionDispatchCandidate.validation_output_sha256,
    validation_state: submissionDispatchCandidate.validation_state,
    validation_reason: submissionDispatchCandidate.validation_reason,
    human_execution_control_external_review_candidate_state: submissionDispatchCandidate.human_execution_control_external_review_candidate_state,
    lifecycle_state: submissionDispatchCandidate.lifecycle_state,
    requirement_binding_count: submissionDispatchCandidate.requirement_binding_count,
    audit_section_count: submissionDispatchCandidate.audit_section_count,
    manifest_entry_count: submissionDispatchCandidate.manifest_entry_count,
    index_entry_count: submissionDispatchCandidate.index_entry_count,
    review_package_section_count: submissionDispatchCandidate.review_package_section_count,
    reviewer_selection_record_count: submissionDispatchCandidate.reviewer_selection_record_count,
    submission_candidate_record_count: submissionDispatchCandidate.submission_candidate_record_count,
    submission_package_record_count: submissionDispatchCandidate.submission_package_record_count,
    submission_manifest_record_count: submissionDispatchCandidate.submission_manifest_record_count,
    submission_dispatch_candidate_record_count: submissionDispatchCandidate.submission_dispatch_candidate_record_count,
    validator_test_count: submissionDispatchCandidate.validator_test_count,
    evidence_test_count: submissionDispatchCandidate.evidence_test_count,
    submission_dispatch_packet_records: SUBMISSION_DISPATCH_PACKET_RECORDS,
    submission_dispatch_packet_record_count: SUBMISSION_DISPATCH_PACKET_RECORDS.length,
    submission_dispatch_packet_records_satisfied: recordsSatisfied,
    submission_dispatch_candidate_records_satisfied: submissionDispatchCandidate.submission_dispatch_candidate_records_satisfied,
    submission_manifest_records_satisfied: submissionDispatchCandidate.submission_manifest_records_satisfied,
    submission_package_records_satisfied: submissionDispatchCandidate.submission_package_records_satisfied,
    submission_candidate_records_satisfied: submissionDispatchCandidate.submission_candidate_records_satisfied,
    reviewer_selection_records_satisfied: submissionDispatchCandidate.reviewer_selection_records_satisfied,
    review_package_sections_satisfied: submissionDispatchCandidate.review_package_sections_satisfied,
    index_entries_satisfied: submissionDispatchCandidate.index_entries_satisfied,
    manifest_entries_satisfied: submissionDispatchCandidate.manifest_entries_satisfied,
    audit_sections_satisfied: submissionDispatchCandidate.audit_sections_satisfied,
    claims_not_created_preserved: submissionDispatchCandidate.claims_not_created_preserved,
    runtime_effects_preserved: submissionDispatchCandidate.runtime_effects_preserved,
    boundary_flags_preserved: submissionDispatchCandidate.boundary_flags_preserved,
    boundary_guard_state: submissionDispatchCandidate.boundary_guard_state,
    matrix_boundary_state: submissionDispatchCandidate.matrix_boundary_state,
    audit_boundary_state: submissionDispatchCandidate.audit_boundary_state,
    manifest_boundary_state: submissionDispatchCandidate.manifest_boundary_state,
    index_boundary_state: submissionDispatchCandidate.index_boundary_state,
    review_package_boundary_state: submissionDispatchCandidate.review_package_boundary_state,
    reviewer_selection_boundary_state: submissionDispatchCandidate.reviewer_selection_boundary_state,
    submission_candidate_boundary_state: submissionDispatchCandidate.submission_candidate_boundary_state,
    submission_package_boundary_state: submissionDispatchCandidate.submission_package_boundary_state,
    submission_manifest_boundary_state: submissionDispatchCandidate.submission_manifest_boundary_state,
    submission_dispatch_candidate_boundary_state: submissionDispatchCandidate.submission_dispatch_candidate_boundary_state,
    submission_dispatch_packet_boundary_state: preservedBoundary ? 'PRESERVED' : 'BLOCKED',
    claims_not_created: submissionDispatchCandidate.claims_not_created,
    runtime_effects: submissionDispatchCandidate.runtime_effects,
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

  submissionDispatchPacketBody.submission_dispatch_packet_sha256 = sha256Canonical(submissionDispatchPacketBody);

  return result(
    SUBMISSION_DISPATCH_PACKET_STATE.RECORDED,
    'RPECRC_SUBMISSION_DISPATCH_PACKET_RECORDED',
    deepFreeze(submissionDispatchPacketBody)
  );
}

module.exports = Object.freeze({
  SUBMISSION_DISPATCH_PACKET_STATE,
  SUBMISSION_DISPATCH_PACKET_PROTO,
  SUBMISSION_DISPATCH_PACKET_KIND,
  SUBMISSION_DISPATCH_PACKET_SCOPE,
  SUBMISSION_DISPATCH_PACKET_RECORDS,
  createExternalReviewCandidateSubmissionDispatchPacket
});
