'use strict';

const crypto = require('crypto');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionBoundary,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-boundary');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_event.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T18:40:00.000Z';
const DEFAULT_CURRENT_TIME = '2026-09-23T18:40:00.000Z';

const EXPECTED_SOURCE_BOUNDARY_SHA256 =
  'bf75c55f1a4cc1ffcc3d0e634426ccb9b2f2ce72983070002da569791fdb0274';

const EXPECTED_SOURCE_BOUNDARY_PAYLOAD_SHA256 =
  '6da4f545dbae6a25e7ed8f30b2ed08f65e1c73ef56bf6594affa6388d8f27a11';

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(value[key]);
        return acc;
      }, {});
  }

  return value;
}

function sha256Hex(value) {
  const payload = typeof value === 'string' ? value : JSON.stringify(canonicalize(value));
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function isValidIsoTimestamp(value) {
  return (
    typeof value === 'string' &&
    value.length >= 20 &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}

function blocked(reason, details) {
  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED,
    reason,
    ...(details ? cloneJson(details) : {})
  };
}

function buildAuditEventPayload({ sourceBoundary, generatedAt, currentTime }) {
  const sourcePayload = sourceBoundary.access_decision_payload || {};

  const auditEventPayload = {
    source_boundary_id: sourceBoundary.boundary_id,
    source_boundary_sha256:
      sourceBoundary.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary_sha256,
    source_boundary_payload_sha256: sourceBoundary.access_decision_payload_sha256,
    source_boundary_scope: sourceBoundary.boundary_scope,
    source_boundary_consumer: sourceBoundary.boundary_consumer,
    source_boundary_category: sourceBoundary.boundary_category,
    source_boundary_subcategory: sourceBoundary.boundary_subcategory,
    source_boundary_access_granted: sourceBoundary.access_granted,
    source_boundary_grants_authorization: sourceBoundary.grants_authorization,
    source_boundary_creates_authorization_artifact: sourceBoundary.creates_authorization_artifact,
    source_boundary_executes_runtime_action: sourceBoundary.executes_runtime_action,
    source_boundary_creates_dispatch: sourceBoundary.creates_dispatch,
    source_boundary_mutates_runtime_state: sourceBoundary.mutates_runtime_state,

    source_binding_sha256: sourceBoundary.source_binding_sha256,
    source_binding_payload_sha256: sourceBoundary.source_binding_payload_sha256,
    source_index_sha256: sourceBoundary.source_index_sha256,
    source_index_payload_sha256: sourceBoundary.source_index_payload_sha256,
    source_surface_sha256: sourceBoundary.source_surface_sha256,
    source_surface_payload_sha256: sourceBoundary.source_surface_payload_sha256,
    source_export_sha256: sourceBoundary.source_export_sha256,
    source_export_payload_sha256: sourceBoundary.source_export_payload_sha256,
    source_review_package_sha256: sourceBoundary.source_review_package_sha256,
    source_review_package_payload_sha256: sourceBoundary.source_review_package_payload_sha256,

    source_authority_resolution_state: sourceBoundary.authority_resolution_state,
    source_authority_resolution_reason: sourceBoundary.authority_resolution_reason,
    source_policy_decision: sourceBoundary.policy_decision,
    source_policy_decision_reason: sourceBoundary.policy_decision_reason,
    source_authorization_state: sourceBoundary.authorization_state,
    source_authorization_reason: sourceBoundary.authorization_reason,
    source_positive_allow_probe_authorization_state: sourceBoundary.positive_allow_probe_authorization_state,
    source_positive_allow_probe_authorization_reason: sourceBoundary.positive_allow_probe_authorization_reason,

    source_decision_snapshot: cloneJson(sourcePayload.decision_snapshot || {}),
    source_fail_closed_view: cloneJson(sourcePayload.fail_closed_view || {}),
    source_assertions: cloneJson(sourcePayload.assertions || {}),

    audit_event_classification: {
      category: 'AUDIT_OBSERVABILITY',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT',
      decision_effect: 'OBSERVE_ONLY',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      runtime_mutation_effect: 'NONE',
      registry_mutation_effect: 'NONE',
      certification_effect: 'NONE'
    },

    stable_access_contract: {
      deterministic_sha256_bound: true,
      source_boundary_hash_bound: true,
      source_boundary_payload_hash_bound: true,
      append_only_audit_event_semantics: true,
      observe_only_audit_event_semantics: true,
      audit_event_does_not_authorize: true,
      audit_event_does_not_dispatch: true,
      audit_event_does_not_execute: true,
      unresolved_authorization_blocks_execution: true
    },

    decision_snapshot: {
      authority_resolution_state: sourceBoundary.authority_resolution_state,
      authority_resolution_reason: sourceBoundary.authority_resolution_reason,
      policy_decision: sourceBoundary.policy_decision,
      policy_decision_reason: sourceBoundary.policy_decision_reason,
      authorization_state: sourceBoundary.authorization_state,
      authorization_reason: sourceBoundary.authorization_reason,
      positive_allow_probe_authorization_state: sourceBoundary.positive_allow_probe_authorization_state,
      positive_allow_probe_authorization_reason: sourceBoundary.positive_allow_probe_authorization_reason,
      access_granted: false,
      grants_authorization: false,
      creates_authorization_artifact: false,
      creates_dispatch: false,
      executes_runtime_action: false,
      mutates_runtime_state: false
    },

    append_only_view: {
      audit_event_generated_at: generatedAt,
      audit_event_current_time: currentTime,
      append_only: true,
      source_boundary_required: true,
      source_boundary_hash_bound: true,
      previous_runtime_state_mutated: false,
      runtime_state_mutated_by_audit_event: false,
      external_registry_mutated_by_audit_event: false
    },

    readable_summary: {
      access_granted: false,
      grants_authorization: false,
      authority_resolution_state: sourceBoundary.authority_resolution_state,
      policy_decision: sourceBoundary.policy_decision,
      authorization_state: sourceBoundary.authorization_state,
      positive_allow_probe_authorization_state: sourceBoundary.positive_allow_probe_authorization_state,
      creates_dispatch: false,
      executes_runtime_action: false,
      mutates_runtime_state: false,
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false
    },

    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      source_boundary_hash_bound: true,
      source_boundary_payload_hash_bound: true,
      source_binding_hash_bound: true,
      source_index_hash_bound: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,

      append_only_audit_event_semantics: true,
      observe_only_audit_event_semantics: true,
      runtime_read_access_decision_review_package_export_surface_access_decision_audit_event_only: true,
      audit_event_does_not_authorize: true,
      audit_event_does_not_dispatch: true,
      audit_event_does_not_execute: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutated: true,
      no_registry_mutated: true,

      no_external_review_execution_created: true,
      no_external_review_opinion_created: true,
      no_external_review_report_created: true,
      no_external_review_submission_created: true,
      no_external_review_publication_created: true,
      no_legal_certification_created: true,
      no_eidas_qualification_created: true,
      no_opc_allow_created: true,
      no_deployment_proof_created: true,
      no_production_proof_created: true
    }
  };

  auditEventPayload.audit_event_payload_sha256 = sha256Hex(auditEventPayload);

  return auditEventPayload;
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditEvent(input = {}) {
  const generatedAt = input.generated_at || DEFAULT_GENERATED_AT;
  const currentTime = input.current_time || DEFAULT_CURRENT_TIME;

  if (!isValidIsoTimestamp(generatedAt)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_GENERATED_AT_INVALID'
    );
  }

  if (!isValidIsoTimestamp(currentTime)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_CURRENT_TIME_INVALID'
    );
  }

  const sourceBoundaryResult =
    input.source_boundary_result ||
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionBoundary(
      input.source_boundary_input || {}
    );

  if (
    sourceBoundaryResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.READY
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_BLOCKED',
      { source_boundary_result: cloneJson(sourceBoundaryResult) }
    );
  }

  const sourceBoundary =
    sourceBoundaryResult.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary;

  if (
    sourceBoundary.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary_sha256 !==
      EXPECTED_SOURCE_BOUNDARY_SHA256 ||
    sourceBoundary.access_decision_payload_sha256 !== EXPECTED_SOURCE_BOUNDARY_PAYLOAD_SHA256
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_HASH_MISMATCH',
      { source_boundary: cloneJson(sourceBoundary) }
    );
  }

  if (
    sourceBoundary.access_granted !== false ||
    sourceBoundary.grants_authorization !== false ||
    sourceBoundary.creates_authorization_artifact !== false ||
    sourceBoundary.executes_runtime_action !== false ||
    sourceBoundary.creates_dispatch !== false ||
    sourceBoundary.mutates_runtime_state !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_NOT_FAIL_CLOSED',
      { source_boundary: cloneJson(sourceBoundary) }
    );
  }

  if (
    sourceBoundary.external_review_execution_created !== false ||
    sourceBoundary.external_review_opinion_created !== false ||
    sourceBoundary.external_review_report_created !== false ||
    sourceBoundary.external_review_submission_created !== false ||
    sourceBoundary.external_review_publication_created !== false ||
    sourceBoundary.legal_certification_created !== false ||
    sourceBoundary.eidas_qualification_created !== false ||
    sourceBoundary.opc_allow_created !== false ||
    sourceBoundary.deployment_success_proven !== false ||
    sourceBoundary.production_deployment_proven !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_FALSE_EFFECTS_INVALID',
      { source_boundary: cloneJson(sourceBoundary) }
    );
  }

  const auditEventPayload = buildAuditEventPayload({
    sourceBoundary,
    generatedAt,
    currentTime
  });

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_KIND,

    audit_event_id:
      'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-ACCESS-DECISION-AUDIT-EVENT-2026-09-23',
    audit_event_version: 1,
    audit_event_generated_at: generatedAt,
    audit_event_current_time: currentTime,

    audit_event_main_commit: 'f5ca975116eb7889f1d97904673930e163099ffc',
    source_boundary_feature_commit: '4e750ab8da1c58fe51cd2d485ac7ca021dcf87b0',
    source_boundary_merge_commit: '6e028b8f507ea08028c2d59ea671590fdb7ca6e3',
    source_boundary_checkpoint_commit: '2a16282afdc5d543d9060475ad59e2a8e7245557',
    source_boundary_final_chain_audit_commit: 'f5ca975116eb7889f1d97904673930e163099ffc',
    source_boundary_checkpoint_doc_sha256: '39f46556db0fdd2ac066828ae410b449eaa019787ae9623ec7619cd933d960ed',
    source_final_chain_audit_doc_sha256: '4e4c3e938eedfa4e38f176bae839035a1df552a08d83d5269ae304f6ffb618fc',

    source_boundary_sha256:
      sourceBoundary.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary_sha256,
    source_boundary_payload_sha256: sourceBoundary.access_decision_payload_sha256,
    source_binding_sha256: sourceBoundary.source_binding_sha256,
    source_binding_payload_sha256: sourceBoundary.source_binding_payload_sha256,
    source_index_sha256: sourceBoundary.source_index_sha256,
    source_index_payload_sha256: sourceBoundary.source_index_payload_sha256,
    source_surface_sha256: sourceBoundary.source_surface_sha256,
    source_surface_payload_sha256: sourceBoundary.source_surface_payload_sha256,
    source_export_sha256: sourceBoundary.source_export_sha256,
    source_export_payload_sha256: sourceBoundary.source_export_payload_sha256,
    source_review_package_sha256: sourceBoundary.source_review_package_sha256,
    source_review_package_payload_sha256: sourceBoundary.source_review_package_payload_sha256,

    audit_event_payload_sha256: auditEventPayload.audit_event_payload_sha256,
    audit_event_payload: auditEventPayload,

    audit_event_ready: true,
    audit_event_scope:
      'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_ONLY',
    audit_event_consumer: 'JOKER_C2',
    audit_event_category: 'AUDIT_OBSERVABILITY',
    audit_event_subcategory:
      'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT',

    append_only_audit_event_semantics: true,
    observe_only_audit_event_semantics: true,
    audit_event_does_not_authorize: true,

    authority_resolution_state: sourceBoundary.authority_resolution_state,
    authority_resolution_reason: sourceBoundary.authority_resolution_reason,
    policy_decision: sourceBoundary.policy_decision,
    policy_decision_reason: sourceBoundary.policy_decision_reason,
    authorization_state: sourceBoundary.authorization_state,
    authorization_reason: sourceBoundary.authorization_reason,
    positive_allow_probe_authorization_state: sourceBoundary.positive_allow_probe_authorization_state,
    positive_allow_probe_authorization_reason: sourceBoundary.positive_allow_probe_authorization_reason,

    access_granted: false,
    grants_authorization: false,
    creates_authorization_artifact: false,
    executes_runtime_action: false,
    creates_dispatch: false,
    mutates_runtime_state: false,
    runtime_audit_log_mutated: false,
    external_audit_log_mutated: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false,

    external_review_execution_created: false,
    external_review_opinion_created: false,
    external_review_report_created: false,
    external_review_submission_created: false,
    external_review_publication_created: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_event_sha256 =
    sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_STATE.READY,
    reason:
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_event: body
  };
}

module.exports = {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditEvent,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_STATE
};
