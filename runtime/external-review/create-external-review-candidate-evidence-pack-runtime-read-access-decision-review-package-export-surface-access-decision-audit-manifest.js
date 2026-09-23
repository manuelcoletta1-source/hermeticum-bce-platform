'use strict';

const crypto = require('crypto');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditEvent,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_STATE
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-audit-event');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T18:55:00.000Z';
const DEFAULT_CURRENT_TIME = '2026-09-23T18:55:00.000Z';

const EXPECTED_SOURCE_AUDIT_EVENT_SHA256 =
  '4fc422aca588cd1894fb089a0e2975c3404b2949da5855984b83aef0b5259c3e';

const EXPECTED_SOURCE_AUDIT_EVENT_PAYLOAD_SHA256 =
  'fca7ec5372660e985065eb16f8a3962e6dd2c9da9b187e3fd31d307c6099250d';

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
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED,
    reason,
    ...(details ? cloneJson(details) : {})
  };
}

function buildManifestEntries(sourceAuditEvent, sourcePayload) {
  return [
    {
      entry_type: 'SOURCE_AUDIT_EVENT',
      entry_id: sourceAuditEvent.audit_event_id,
      entry_sha256:
        sourceAuditEvent.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_event_sha256,
      entry_payload_sha256: sourceAuditEvent.audit_event_payload_sha256,
      entry_scope: sourceAuditEvent.audit_event_scope,
      entry_category: sourceAuditEvent.audit_event_category,
      entry_subcategory: sourceAuditEvent.audit_event_subcategory,
      entry_ready: sourceAuditEvent.audit_event_ready,
      entry_observe_only: true,
      entry_append_only: true,
      entry_access_granted: sourceAuditEvent.access_granted,
      entry_authorization_state: sourceAuditEvent.authorization_state,
      entry_policy_decision: sourceAuditEvent.policy_decision
    },
    {
      entry_type: 'SOURCE_BOUNDARY_SNAPSHOT',
      entry_id: sourcePayload.source_boundary_id,
      entry_sha256: sourceAuditEvent.source_boundary_sha256,
      entry_payload_sha256: sourceAuditEvent.source_boundary_payload_sha256,
      entry_scope: sourcePayload.source_boundary_scope,
      entry_category: sourcePayload.source_boundary_category,
      entry_subcategory: sourcePayload.source_boundary_subcategory,
      entry_ready: true,
      entry_observe_only: true,
      entry_append_only: false,
      entry_access_granted: false,
      entry_authorization_state: sourceAuditEvent.authorization_state,
      entry_policy_decision: sourceAuditEvent.policy_decision
    },
    {
      entry_type: 'SOURCE_CAPABILITY_BINDING_SNAPSHOT',
      entry_sha256: sourceAuditEvent.source_binding_sha256,
      entry_payload_sha256: sourceAuditEvent.source_binding_payload_sha256,
      entry_observe_only: true,
      entry_access_granted: false,
      entry_authorization_state: sourceAuditEvent.authorization_state,
      entry_policy_decision: sourceAuditEvent.policy_decision
    }
  ];
}

function buildAuditManifestPayload({ sourceAuditEvent, generatedAt, currentTime }) {
  const sourcePayload = sourceAuditEvent.audit_event_payload || {};
  const manifestEntries = buildManifestEntries(sourceAuditEvent, sourcePayload);

  const auditManifestPayload = {
    source_audit_event_id: sourceAuditEvent.audit_event_id,
    source_audit_event_sha256:
      sourceAuditEvent.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditEvent.audit_event_payload_sha256,
    source_audit_event_scope: sourceAuditEvent.audit_event_scope,
    source_audit_event_consumer: sourceAuditEvent.audit_event_consumer,
    source_audit_event_category: sourceAuditEvent.audit_event_category,
    source_audit_event_subcategory: sourceAuditEvent.audit_event_subcategory,
    source_audit_event_ready: sourceAuditEvent.audit_event_ready,
    source_audit_event_observe_only: true,
    source_audit_event_append_only: sourceAuditEvent.append_only_audit_event_semantics,

    source_boundary_sha256: sourceAuditEvent.source_boundary_sha256,
    source_boundary_payload_sha256: sourceAuditEvent.source_boundary_payload_sha256,
    source_binding_sha256: sourceAuditEvent.source_binding_sha256,
    source_binding_payload_sha256: sourceAuditEvent.source_binding_payload_sha256,
    source_index_sha256: sourceAuditEvent.source_index_sha256,
    source_index_payload_sha256: sourceAuditEvent.source_index_payload_sha256,
    source_surface_sha256: sourceAuditEvent.source_surface_sha256,
    source_surface_payload_sha256: sourceAuditEvent.source_surface_payload_sha256,
    source_export_sha256: sourceAuditEvent.source_export_sha256,
    source_export_payload_sha256: sourceAuditEvent.source_export_payload_sha256,
    source_review_package_sha256: sourceAuditEvent.source_review_package_sha256,
    source_review_package_payload_sha256: sourceAuditEvent.source_review_package_payload_sha256,

    source_access_granted: sourceAuditEvent.access_granted,
    source_grants_authorization: sourceAuditEvent.grants_authorization,
    source_creates_authorization_artifact: sourceAuditEvent.creates_authorization_artifact,
    source_executes_runtime_action: sourceAuditEvent.executes_runtime_action,
    source_creates_dispatch: sourceAuditEvent.creates_dispatch,
    source_mutates_runtime_state: sourceAuditEvent.mutates_runtime_state,

    source_authority_resolution_state: sourceAuditEvent.authority_resolution_state,
    source_authority_resolution_reason: sourceAuditEvent.authority_resolution_reason,
    source_policy_decision: sourceAuditEvent.policy_decision,
    source_policy_decision_reason: sourceAuditEvent.policy_decision_reason,
    source_authorization_state: sourceAuditEvent.authorization_state,
    source_authorization_reason: sourceAuditEvent.authorization_reason,
    source_positive_allow_probe_authorization_state: sourceAuditEvent.positive_allow_probe_authorization_state,
    source_positive_allow_probe_authorization_reason: sourceAuditEvent.positive_allow_probe_authorization_reason,

    manifest_entries: manifestEntries,

    manifest_classification: {
      category: 'AUDIT_MANIFEST',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST',
      decision_effect: 'OBSERVE_ONLY',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      runtime_mutation_effect: 'NONE',
      registry_mutation_effect: 'NONE',
      certification_effect: 'NONE'
    },

    stable_access_contract: {
      deterministic_sha256_bound: true,
      source_audit_event_hash_bound: true,
      source_audit_event_payload_hash_bound: true,
      source_boundary_hash_bound: true,
      source_binding_hash_bound: true,
      manifest_entries_satisfied: true,
      observe_only_manifest_semantics: true,
      append_only_source_event_preserved: true,
      audit_manifest_does_not_authorize: true,
      audit_manifest_does_not_dispatch: true,
      audit_manifest_does_not_execute: true,
      unresolved_authorization_blocks_execution: true
    },

    decision_snapshot: {
      authority_resolution_state: sourceAuditEvent.authority_resolution_state,
      authority_resolution_reason: sourceAuditEvent.authority_resolution_reason,
      policy_decision: sourceAuditEvent.policy_decision,
      policy_decision_reason: sourceAuditEvent.policy_decision_reason,
      authorization_state: sourceAuditEvent.authorization_state,
      authorization_reason: sourceAuditEvent.authorization_reason,
      positive_allow_probe_authorization_state: sourceAuditEvent.positive_allow_probe_authorization_state,
      positive_allow_probe_authorization_reason: sourceAuditEvent.positive_allow_probe_authorization_reason,
      access_granted: false,
      grants_authorization: false,
      creates_authorization_artifact: false,
      creates_dispatch: false,
      executes_runtime_action: false,
      mutates_runtime_state: false
    },

    manifest_view: {
      audit_manifest_generated_at: generatedAt,
      audit_manifest_current_time: currentTime,
      source_audit_event_required: true,
      source_audit_event_hash_bound: true,
      manifest_entries_count: manifestEntries.length,
      manifest_entries_satisfied: true,
      runtime_state_mutated_by_manifest: false,
      external_registry_mutated_by_manifest: false
    },

    readable_summary: {
      access_granted: false,
      grants_authorization: false,
      authority_resolution_state: sourceAuditEvent.authority_resolution_state,
      policy_decision: sourceAuditEvent.policy_decision,
      authorization_state: sourceAuditEvent.authorization_state,
      positive_allow_probe_authorization_state: sourceAuditEvent.positive_allow_probe_authorization_state,
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
      source_audit_event_hash_bound: true,
      source_audit_event_payload_hash_bound: true,
      source_boundary_hash_bound: true,
      source_binding_hash_bound: true,
      source_index_hash_bound: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,

      manifest_entries_satisfied: true,
      observe_only_manifest_semantics: true,
      append_only_source_event_preserved: true,
      runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_only: true,
      audit_manifest_does_not_authorize: true,
      audit_manifest_does_not_dispatch: true,
      audit_manifest_does_not_execute: true,
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

  auditManifestPayload.audit_manifest_payload_sha256 = sha256Hex(auditManifestPayload);

  return auditManifestPayload;
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditManifest(input = {}) {
  const generatedAt = input.generated_at || DEFAULT_GENERATED_AT;
  const currentTime = input.current_time || DEFAULT_CURRENT_TIME;

  if (!isValidIsoTimestamp(generatedAt)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_GENERATED_AT_INVALID'
    );
  }

  if (!isValidIsoTimestamp(currentTime)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_CURRENT_TIME_INVALID'
    );
  }

  const sourceAuditEventResult =
    input.source_audit_event_result ||
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditEvent(
      input.source_audit_event_input || {}
    );

  if (
    sourceAuditEventResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_STATE.READY
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_BLOCKED',
      { source_audit_event_result: cloneJson(sourceAuditEventResult) }
    );
  }

  const sourceAuditEvent =
    sourceAuditEventResult.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_event;

  if (
    sourceAuditEvent.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_event_sha256 !==
      EXPECTED_SOURCE_AUDIT_EVENT_SHA256 ||
    sourceAuditEvent.audit_event_payload_sha256 !== EXPECTED_SOURCE_AUDIT_EVENT_PAYLOAD_SHA256
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_HASH_MISMATCH',
      { source_audit_event: cloneJson(sourceAuditEvent) }
    );
  }

  if (
    sourceAuditEvent.access_granted !== false ||
    sourceAuditEvent.grants_authorization !== false ||
    sourceAuditEvent.creates_authorization_artifact !== false ||
    sourceAuditEvent.executes_runtime_action !== false ||
    sourceAuditEvent.creates_dispatch !== false ||
    sourceAuditEvent.mutates_runtime_state !== false ||
    sourceAuditEvent.audit_event_does_not_authorize !== true ||
    sourceAuditEvent.observe_only_audit_event_semantics !== true ||
    sourceAuditEvent.append_only_audit_event_semantics !== true
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_NOT_OBSERVE_ONLY',
      { source_audit_event: cloneJson(sourceAuditEvent) }
    );
  }

  if (
    sourceAuditEvent.external_review_execution_created !== false ||
    sourceAuditEvent.external_review_opinion_created !== false ||
    sourceAuditEvent.external_review_report_created !== false ||
    sourceAuditEvent.external_review_submission_created !== false ||
    sourceAuditEvent.external_review_publication_created !== false ||
    sourceAuditEvent.legal_certification_created !== false ||
    sourceAuditEvent.eidas_qualification_created !== false ||
    sourceAuditEvent.opc_allow_created !== false ||
    sourceAuditEvent.deployment_success_proven !== false ||
    sourceAuditEvent.production_deployment_proven !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_FALSE_EFFECTS_INVALID',
      { source_audit_event: cloneJson(sourceAuditEvent) }
    );
  }

  const auditManifestPayload = buildAuditManifestPayload({
    sourceAuditEvent,
    generatedAt,
    currentTime
  });

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_KIND,

    audit_manifest_id:
      'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-ACCESS-DECISION-AUDIT-MANIFEST-2026-09-23',
    audit_manifest_version: 1,
    audit_manifest_generated_at: generatedAt,
    audit_manifest_current_time: currentTime,

    audit_manifest_main_commit: '04445e9a07bc81ade7f6dca0408af1214f7babab',
    source_audit_event_feature_commit: 'b4850bf3d256f757ca3fe5ddac98f891108bed71',
    source_audit_event_merge_commit: '2cf17bc9e696800091892b3fc2383d50e7e747a8',
    source_audit_event_checkpoint_commit: 'b9abb6d22afd8da3d1e8fff7748175486eaedb4c',
    source_audit_event_final_chain_audit_commit: '04445e9a07bc81ade7f6dca0408af1214f7babab',
    source_audit_event_checkpoint_doc_sha256: 'a90ae92fde13b997730b481dd728fa2ffe45bbaf363846333cef01a6ecc49a70',
    source_final_chain_audit_doc_sha256: '8d4d64a25a746e18d6b73eec84c57525daea45afb31e7a3b714c9dc87ff8549b',

    source_audit_event_sha256:
      sourceAuditEvent.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditEvent.audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditEvent.source_boundary_sha256,
    source_boundary_payload_sha256: sourceAuditEvent.source_boundary_payload_sha256,
    source_binding_sha256: sourceAuditEvent.source_binding_sha256,
    source_binding_payload_sha256: sourceAuditEvent.source_binding_payload_sha256,
    source_index_sha256: sourceAuditEvent.source_index_sha256,
    source_index_payload_sha256: sourceAuditEvent.source_index_payload_sha256,
    source_surface_sha256: sourceAuditEvent.source_surface_sha256,
    source_surface_payload_sha256: sourceAuditEvent.source_surface_payload_sha256,
    source_export_sha256: sourceAuditEvent.source_export_sha256,
    source_export_payload_sha256: sourceAuditEvent.source_export_payload_sha256,
    source_review_package_sha256: sourceAuditEvent.source_review_package_sha256,
    source_review_package_payload_sha256: sourceAuditEvent.source_review_package_payload_sha256,

    audit_manifest_payload_sha256: auditManifestPayload.audit_manifest_payload_sha256,
    audit_manifest_payload: auditManifestPayload,

    audit_manifest_ready: true,
    audit_manifest_scope:
      'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_ONLY',
    audit_manifest_consumer: 'JOKER_C2',
    audit_manifest_category: 'AUDIT_MANIFEST',
    audit_manifest_subcategory:
      'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST',

    manifest_entries_satisfied: true,
    observe_only_manifest_semantics: true,
    append_only_source_event_preserved: true,
    audit_manifest_does_not_authorize: true,

    authority_resolution_state: sourceAuditEvent.authority_resolution_state,
    authority_resolution_reason: sourceAuditEvent.authority_resolution_reason,
    policy_decision: sourceAuditEvent.policy_decision,
    policy_decision_reason: sourceAuditEvent.policy_decision_reason,
    authorization_state: sourceAuditEvent.authorization_state,
    authorization_reason: sourceAuditEvent.authorization_reason,
    positive_allow_probe_authorization_state: sourceAuditEvent.positive_allow_probe_authorization_state,
    positive_allow_probe_authorization_reason: sourceAuditEvent.positive_allow_probe_authorization_reason,

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

  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_sha256 =
    sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_STATE.READY,
    reason:
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest: body
  };
}

module.exports = {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditManifest,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_STATE
};
