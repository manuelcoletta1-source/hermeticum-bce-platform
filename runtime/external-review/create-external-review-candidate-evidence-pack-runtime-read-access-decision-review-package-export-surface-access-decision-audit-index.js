'use strict';

const crypto = require('crypto');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditManifest,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_STATE
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-audit-manifest');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T19:05:00.000Z';
const DEFAULT_CURRENT_TIME = '2026-09-23T19:05:00.000Z';

const EXPECTED_SOURCE_AUDIT_MANIFEST_SHA256 =
  '5ad5fcc305f928efda53c7e07cc2b6dc19c54a80d0b9e3eec96301342087ec5a';

const EXPECTED_SOURCE_AUDIT_MANIFEST_PAYLOAD_SHA256 =
  'c4a6aef21c78b0b198ac0e2396a2ca17bc5a4e220d1f7814fd278a8c7de522f0';

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
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED,
    reason,
    ...(details ? cloneJson(details) : {})
  };
}

function buildIndexEntries(sourceAuditManifest, sourcePayload) {
  return [
    {
      entry_type: 'SOURCE_AUDIT_MANIFEST',
      entry_id: sourceAuditManifest.audit_manifest_id,
      entry_sha256:
        sourceAuditManifest.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_sha256,
      entry_payload_sha256: sourceAuditManifest.audit_manifest_payload_sha256,
      entry_scope: sourceAuditManifest.audit_manifest_scope,
      entry_category: sourceAuditManifest.audit_manifest_category,
      entry_subcategory: sourceAuditManifest.audit_manifest_subcategory,
      entry_ready: sourceAuditManifest.audit_manifest_ready,
      entry_observe_only: true,
      entry_manifest_entries_satisfied: sourceAuditManifest.manifest_entries_satisfied,
      entry_access_granted: sourceAuditManifest.access_granted,
      entry_authorization_state: sourceAuditManifest.authorization_state,
      entry_policy_decision: sourceAuditManifest.policy_decision
    },
    {
      entry_type: 'SOURCE_AUDIT_EVENT',
      entry_sha256: sourceAuditManifest.source_audit_event_sha256,
      entry_payload_sha256: sourceAuditManifest.source_audit_event_payload_sha256,
      entry_scope: sourcePayload.source_audit_event_scope,
      entry_category: sourcePayload.source_audit_event_category,
      entry_subcategory: sourcePayload.source_audit_event_subcategory,
      entry_ready: sourcePayload.source_audit_event_ready,
      entry_observe_only: true,
      entry_append_only: sourcePayload.source_audit_event_append_only,
      entry_access_granted: sourcePayload.source_access_granted,
      entry_authorization_state: sourceAuditManifest.authorization_state,
      entry_policy_decision: sourceAuditManifest.policy_decision
    },
    {
      entry_type: 'SOURCE_BOUNDARY_SNAPSHOT',
      entry_sha256: sourceAuditManifest.source_boundary_sha256,
      entry_payload_sha256: sourceAuditManifest.source_boundary_payload_sha256,
      entry_observe_only: true,
      entry_access_granted: false,
      entry_authorization_state: sourceAuditManifest.authorization_state,
      entry_policy_decision: sourceAuditManifest.policy_decision
    },
    {
      entry_type: 'SOURCE_CAPABILITY_BINDING_SNAPSHOT',
      entry_sha256: sourceAuditManifest.source_binding_sha256,
      entry_payload_sha256: sourceAuditManifest.source_binding_payload_sha256,
      entry_observe_only: true,
      entry_access_granted: false,
      entry_authorization_state: sourceAuditManifest.authorization_state,
      entry_policy_decision: sourceAuditManifest.policy_decision
    }
  ];
}

function buildAuditIndexPayload({ sourceAuditManifest, generatedAt, currentTime }) {
  const sourcePayload = sourceAuditManifest.audit_manifest_payload || {};
  const indexEntries = buildIndexEntries(sourceAuditManifest, sourcePayload);

  const auditIndexPayload = {
    source_audit_manifest_id: sourceAuditManifest.audit_manifest_id,
    source_audit_manifest_sha256:
      sourceAuditManifest.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceAuditManifest.audit_manifest_payload_sha256,
    source_audit_manifest_scope: sourceAuditManifest.audit_manifest_scope,
    source_audit_manifest_consumer: sourceAuditManifest.audit_manifest_consumer,
    source_audit_manifest_category: sourceAuditManifest.audit_manifest_category,
    source_audit_manifest_subcategory: sourceAuditManifest.audit_manifest_subcategory,
    source_audit_manifest_ready: sourceAuditManifest.audit_manifest_ready,
    source_audit_manifest_observe_only: true,
    source_manifest_entries_satisfied: sourceAuditManifest.manifest_entries_satisfied,

    source_audit_event_sha256: sourceAuditManifest.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditManifest.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditManifest.source_boundary_sha256,
    source_boundary_payload_sha256: sourceAuditManifest.source_boundary_payload_sha256,
    source_binding_sha256: sourceAuditManifest.source_binding_sha256,
    source_binding_payload_sha256: sourceAuditManifest.source_binding_payload_sha256,
    source_index_sha256: sourceAuditManifest.source_index_sha256,
    source_index_payload_sha256: sourceAuditManifest.source_index_payload_sha256,
    source_surface_sha256: sourceAuditManifest.source_surface_sha256,
    source_surface_payload_sha256: sourceAuditManifest.source_surface_payload_sha256,
    source_export_sha256: sourceAuditManifest.source_export_sha256,
    source_export_payload_sha256: sourceAuditManifest.source_export_payload_sha256,
    source_review_package_sha256: sourceAuditManifest.source_review_package_sha256,
    source_review_package_payload_sha256: sourceAuditManifest.source_review_package_payload_sha256,

    source_access_granted: sourceAuditManifest.access_granted,
    source_grants_authorization: sourceAuditManifest.grants_authorization,
    source_creates_authorization_artifact: sourceAuditManifest.creates_authorization_artifact,
    source_executes_runtime_action: sourceAuditManifest.executes_runtime_action,
    source_creates_dispatch: sourceAuditManifest.creates_dispatch,
    source_mutates_runtime_state: sourceAuditManifest.mutates_runtime_state,

    source_authority_resolution_state: sourceAuditManifest.authority_resolution_state,
    source_authority_resolution_reason: sourceAuditManifest.authority_resolution_reason,
    source_policy_decision: sourceAuditManifest.policy_decision,
    source_policy_decision_reason: sourceAuditManifest.policy_decision_reason,
    source_authorization_state: sourceAuditManifest.authorization_state,
    source_authorization_reason: sourceAuditManifest.authorization_reason,
    source_positive_allow_probe_authorization_state: sourceAuditManifest.positive_allow_probe_authorization_state,
    source_positive_allow_probe_authorization_reason: sourceAuditManifest.positive_allow_probe_authorization_reason,

    index_entries: indexEntries,

    index_classification: {
      category: 'AUDIT_INDEX',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX',
      decision_effect: 'OBSERVE_ONLY',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      runtime_mutation_effect: 'NONE',
      registry_mutation_effect: 'NONE',
      certification_effect: 'NONE'
    },

    stable_access_contract: {
      deterministic_sha256_bound: true,
      source_audit_manifest_hash_bound: true,
      source_audit_manifest_payload_hash_bound: true,
      source_audit_event_hash_bound: true,
      source_boundary_hash_bound: true,
      source_binding_hash_bound: true,
      index_entries_satisfied: true,
      manifest_entries_satisfied: true,
      observe_only_index_semantics: true,
      observe_only_manifest_semantics_preserved: true,
      append_only_source_event_preserved: sourceAuditManifest.append_only_source_event_preserved,
      audit_index_does_not_authorize: true,
      audit_index_does_not_dispatch: true,
      audit_index_does_not_execute: true,
      unresolved_authorization_blocks_execution: true
    },

    decision_snapshot: {
      authority_resolution_state: sourceAuditManifest.authority_resolution_state,
      authority_resolution_reason: sourceAuditManifest.authority_resolution_reason,
      policy_decision: sourceAuditManifest.policy_decision,
      policy_decision_reason: sourceAuditManifest.policy_decision_reason,
      authorization_state: sourceAuditManifest.authorization_state,
      authorization_reason: sourceAuditManifest.authorization_reason,
      positive_allow_probe_authorization_state: sourceAuditManifest.positive_allow_probe_authorization_state,
      positive_allow_probe_authorization_reason: sourceAuditManifest.positive_allow_probe_authorization_reason,
      access_granted: false,
      grants_authorization: false,
      creates_authorization_artifact: false,
      creates_dispatch: false,
      executes_runtime_action: false,
      mutates_runtime_state: false
    },

    index_view: {
      audit_index_generated_at: generatedAt,
      audit_index_current_time: currentTime,
      source_audit_manifest_required: true,
      source_audit_manifest_hash_bound: true,
      index_entries_count: indexEntries.length,
      index_entries_satisfied: true,
      manifest_entries_satisfied: sourceAuditManifest.manifest_entries_satisfied,
      runtime_state_mutated_by_index: false,
      external_registry_mutated_by_index: false
    },

    readable_summary: {
      access_granted: false,
      grants_authorization: false,
      authority_resolution_state: sourceAuditManifest.authority_resolution_state,
      policy_decision: sourceAuditManifest.policy_decision,
      authorization_state: sourceAuditManifest.authorization_state,
      positive_allow_probe_authorization_state: sourceAuditManifest.positive_allow_probe_authorization_state,
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
      source_audit_manifest_hash_bound: true,
      source_audit_manifest_payload_hash_bound: true,
      source_audit_event_hash_bound: true,
      source_audit_event_payload_hash_bound: true,
      source_boundary_hash_bound: true,
      source_binding_hash_bound: true,
      source_index_hash_bound: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,

      index_entries_satisfied: true,
      manifest_entries_satisfied: true,
      observe_only_index_semantics: true,
      observe_only_manifest_semantics_preserved: true,
      append_only_source_event_preserved: sourceAuditManifest.append_only_source_event_preserved,
      runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_only: true,
      audit_index_does_not_authorize: true,
      audit_index_does_not_dispatch: true,
      audit_index_does_not_execute: true,
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

  auditIndexPayload.audit_index_payload_sha256 = sha256Hex(auditIndexPayload);

  return auditIndexPayload;
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditIndex(input = {}) {
  const generatedAt = input.generated_at || DEFAULT_GENERATED_AT;
  const currentTime = input.current_time || DEFAULT_CURRENT_TIME;

  if (!isValidIsoTimestamp(generatedAt)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_GENERATED_AT_INVALID'
    );
  }

  if (!isValidIsoTimestamp(currentTime)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_CURRENT_TIME_INVALID'
    );
  }

  const sourceAuditManifestResult =
    input.source_audit_manifest_result ||
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditManifest(
      input.source_audit_manifest_input || {}
    );

  if (
    sourceAuditManifestResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_STATE.READY
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_BLOCKED',
      { source_audit_manifest_result: cloneJson(sourceAuditManifestResult) }
    );
  }

  const sourceAuditManifest =
    sourceAuditManifestResult.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest;

  if (
    sourceAuditManifest.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_sha256 !==
      EXPECTED_SOURCE_AUDIT_MANIFEST_SHA256 ||
    sourceAuditManifest.audit_manifest_payload_sha256 !== EXPECTED_SOURCE_AUDIT_MANIFEST_PAYLOAD_SHA256
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_HASH_MISMATCH',
      { source_audit_manifest: cloneJson(sourceAuditManifest) }
    );
  }

  if (
    sourceAuditManifest.access_granted !== false ||
    sourceAuditManifest.grants_authorization !== false ||
    sourceAuditManifest.creates_authorization_artifact !== false ||
    sourceAuditManifest.executes_runtime_action !== false ||
    sourceAuditManifest.creates_dispatch !== false ||
    sourceAuditManifest.mutates_runtime_state !== false ||
    sourceAuditManifest.audit_manifest_does_not_authorize !== true ||
    sourceAuditManifest.observe_only_manifest_semantics !== true ||
    sourceAuditManifest.manifest_entries_satisfied !== true
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_NOT_OBSERVE_ONLY',
      { source_audit_manifest: cloneJson(sourceAuditManifest) }
    );
  }

  if (
    sourceAuditManifest.external_review_execution_created !== false ||
    sourceAuditManifest.external_review_opinion_created !== false ||
    sourceAuditManifest.external_review_report_created !== false ||
    sourceAuditManifest.external_review_submission_created !== false ||
    sourceAuditManifest.external_review_publication_created !== false ||
    sourceAuditManifest.legal_certification_created !== false ||
    sourceAuditManifest.eidas_qualification_created !== false ||
    sourceAuditManifest.opc_allow_created !== false ||
    sourceAuditManifest.deployment_success_proven !== false ||
    sourceAuditManifest.production_deployment_proven !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_FALSE_EFFECTS_INVALID',
      { source_audit_manifest: cloneJson(sourceAuditManifest) }
    );
  }

  const auditIndexPayload = buildAuditIndexPayload({
    sourceAuditManifest,
    generatedAt,
    currentTime
  });

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_KIND,

    audit_index_id:
      'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-ACCESS-DECISION-AUDIT-INDEX-2026-09-23',
    audit_index_version: 1,
    audit_index_generated_at: generatedAt,
    audit_index_current_time: currentTime,

    audit_index_main_commit: '4c0532290efec9b081cce0f97b08dfdd3f931d66',
    source_audit_manifest_feature_commit: '06af1c2ed9905143514a0cd3d7049f7bd8e7d7f3',
    source_audit_manifest_merge_commit: '8b1069119e100e096f25f4548caa3bf9c3debf00',
    source_audit_manifest_checkpoint_commit: '26986da947e37f4105c9bf6ee1c4e48847975d62',
    source_audit_manifest_final_chain_audit_commit: '4c0532290efec9b081cce0f97b08dfdd3f931d66',
    source_audit_manifest_checkpoint_doc_sha256: '9552afd62a64a77debe63d595ed013a8262a492346ea058ad60c58194cab8b78',
    source_final_chain_audit_doc_sha256: '5cf0507f08df39fe253d0630e358cf9e1a41f6fc4a29aebea9df6becde00fb9c',

    source_audit_manifest_sha256:
      sourceAuditManifest.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceAuditManifest.audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceAuditManifest.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditManifest.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditManifest.source_boundary_sha256,
    source_boundary_payload_sha256: sourceAuditManifest.source_boundary_payload_sha256,
    source_binding_sha256: sourceAuditManifest.source_binding_sha256,
    source_binding_payload_sha256: sourceAuditManifest.source_binding_payload_sha256,
    source_index_sha256: sourceAuditManifest.source_index_sha256,
    source_index_payload_sha256: sourceAuditManifest.source_index_payload_sha256,
    source_surface_sha256: sourceAuditManifest.source_surface_sha256,
    source_surface_payload_sha256: sourceAuditManifest.source_surface_payload_sha256,
    source_export_sha256: sourceAuditManifest.source_export_sha256,
    source_export_payload_sha256: sourceAuditManifest.source_export_payload_sha256,
    source_review_package_sha256: sourceAuditManifest.source_review_package_sha256,
    source_review_package_payload_sha256: sourceAuditManifest.source_review_package_payload_sha256,

    audit_index_payload_sha256: auditIndexPayload.audit_index_payload_sha256,
    audit_index_payload: auditIndexPayload,

    audit_index_ready: true,
    audit_index_scope:
      'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_ONLY',
    audit_index_consumer: 'JOKER_C2',
    audit_index_category: 'AUDIT_INDEX',
    audit_index_subcategory:
      'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX',

    index_entries_satisfied: true,
    manifest_entries_satisfied: sourceAuditManifest.manifest_entries_satisfied,
    observe_only_index_semantics: true,
    audit_index_does_not_authorize: true,

    authority_resolution_state: sourceAuditManifest.authority_resolution_state,
    authority_resolution_reason: sourceAuditManifest.authority_resolution_reason,
    policy_decision: sourceAuditManifest.policy_decision,
    policy_decision_reason: sourceAuditManifest.policy_decision_reason,
    authorization_state: sourceAuditManifest.authorization_state,
    authorization_reason: sourceAuditManifest.authorization_reason,
    positive_allow_probe_authorization_state: sourceAuditManifest.positive_allow_probe_authorization_state,
    positive_allow_probe_authorization_reason: sourceAuditManifest.positive_allow_probe_authorization_reason,

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

  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_sha256 =
    sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.READY,
    reason:
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index: body
  };
}

module.exports = {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditIndex,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE
};
