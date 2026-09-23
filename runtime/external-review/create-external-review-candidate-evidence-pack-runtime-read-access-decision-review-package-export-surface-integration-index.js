'use strict';

const crypto = require('node:crypto');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T18:00:00.000Z';

const EXPECTED_SOURCE_SURFACE_SHA256 =
  '57b0e3db62fe5354acf23b7f394feaf1bbc5197b51f9d9267d4cfe2a5c44fc1f';

const EXPECTED_SOURCE_SURFACE_PAYLOAD_SHA256 =
  '88822ab7450d8c21eb8cc7d96ab1ee2659c597cf127f3246e89925c157923a40';

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256Hex(value) {
  const payload = typeof value === 'string' ? value : JSON.stringify(value);
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function isStrictIsoDate(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toISOString() === value;
}

function blocked(reason, extra = {}) {
  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE.BLOCKED,
    reason,
    ...extra
  };
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex(input = {}) {
  const generatedAt = input.generated_at || DEFAULT_GENERATED_AT;
  const currentTime = input.current_time || generatedAt;

  if (!isStrictIsoDate(generatedAt)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_GENERATED_AT_INVALID'
    );
  }

  if (!isStrictIsoDate(currentTime)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_CURRENT_TIME_INVALID'
    );
  }

  const sourceSurfaceResult =
    input.source_surface_result ||
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface(
      input.source_surface_input || {}
    );

  if (
    !sourceSurfaceResult ||
    sourceSurfaceResult.state !==
      HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE.READY ||
    !sourceSurfaceResult.evidence_pack_runtime_read_access_decision_review_package_export_surface
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_SOURCE_SURFACE_BLOCKED',
      { source_surface_result: cloneJson(sourceSurfaceResult) }
    );
  }

  const sourceSurface =
    sourceSurfaceResult.evidence_pack_runtime_read_access_decision_review_package_export_surface;

  if (
    sourceSurface.evidence_pack_runtime_read_access_decision_review_package_export_surface_sha256 !==
      EXPECTED_SOURCE_SURFACE_SHA256 ||
    sourceSurface.surface_payload_sha256 !== EXPECTED_SOURCE_SURFACE_PAYLOAD_SHA256
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_SOURCE_SURFACE_HASH_MISMATCH',
      { source_surface: cloneJson(sourceSurface) }
    );
  }

  if (
    sourceSurface.access_granted !== false ||
    sourceSurface.grants_authorization !== false ||
    sourceSurface.creates_authorization_artifact !== false ||
    sourceSurface.executes_runtime_action !== false ||
    sourceSurface.creates_dispatch !== false ||
    sourceSurface.mutates_runtime_state !== false ||
    sourceSurface.runtime_audit_log_mutated !== false ||
    sourceSurface.external_audit_log_mutated !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_SOURCE_SURFACE_NOT_READ_ONLY',
      { source_surface: cloneJson(sourceSurface) }
    );
  }

  if (
    sourceSurface.external_review_execution_created !== false ||
    sourceSurface.external_review_submission_created !== false ||
    sourceSurface.external_review_publication_created !== false ||
    sourceSurface.legal_certification_created !== false ||
    sourceSurface.eidas_qualification_created !== false ||
    sourceSurface.opc_allow_created !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_SOURCE_SURFACE_FALSE_EFFECTS_INVALID',
      { source_surface: cloneJson(sourceSurface) }
    );
  }

  const sourceSurfacePayload = sourceSurface.surface_payload;

  const activeRuntimeEntrypoint = {
    module_path:
      'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface.js',
    function_name:
      'createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface',
    consumer: 'JOKER_C2',
    entrypoint_type: 'INTERNAL_RUNTIME_READABLE_SURFACE',
    access_mode: 'READ_ONLY',
    invokes_runtime_action: false,
    creates_dispatch: false,
    grants_authorization: false,
    requires_source_surface: true,
    fail_closed_on_missing_source_surface: true
  };

  const integrationEntries = [
    {
      entry_key: 'runtime_read_access_decision_review_package_export_surface',
      role: 'SOURCE_EXPORT_SURFACE',
      source_id: sourceSurface.surface_id,
      source_sha256: sourceSurface.evidence_pack_runtime_read_access_decision_review_package_export_surface_sha256,
      source_payload_sha256: sourceSurface.surface_payload_sha256,
      ready: true,
      hash_bound: true,
      active_entrypoint: true
    },
    {
      entry_key: 'runtime_read_access_decision_review_package_export',
      role: 'SOURCE_EXPORT',
      source_id: sourceSurfacePayload.source_export_id,
      source_sha256: sourceSurface.source_export_sha256,
      source_payload_sha256: sourceSurface.source_export_payload_sha256,
      ready: sourceSurfacePayload.source_export_ready,
      hash_bound: true,
      active_entrypoint: false
    },
    {
      entry_key: 'runtime_read_access_decision_review_package',
      role: 'SOURCE_REVIEW_PACKAGE',
      source_sha256: sourceSurface.source_review_package_sha256,
      source_payload_sha256: sourceSurface.source_review_package_payload_sha256,
      ready: true,
      hash_bound: true,
      active_entrypoint: false
    },
    {
      entry_key: 'runtime_read_access_decision_audit_index',
      role: 'SOURCE_AUDIT_INDEX',
      source_sha256: sourceSurface.source_audit_index_sha256,
      source_payload_sha256: sourceSurface.source_audit_index_payload_sha256,
      ready: true,
      hash_bound: true,
      active_entrypoint: false
    },
    {
      entry_key: 'runtime_read_access_decision_audit_manifest',
      role: 'SOURCE_AUDIT_MANIFEST',
      source_sha256: sourceSurface.source_audit_manifest_sha256,
      source_payload_sha256: sourceSurface.source_audit_manifest_payload_sha256,
      ready: true,
      hash_bound: true,
      active_entrypoint: false
    },
    {
      entry_key: 'runtime_read_access_decision_audit_event',
      role: 'SOURCE_AUDIT_EVENT',
      source_sha256: sourceSurface.source_audit_event_sha256,
      source_payload_sha256: sourceSurface.source_audit_event_payload_sha256,
      ready: true,
      hash_bound: true,
      active_entrypoint: false
    },
    {
      entry_key: 'runtime_read_access_decision_boundary',
      role: 'SOURCE_BOUNDARY',
      source_sha256: sourceSurface.source_boundary_sha256,
      source_payload_sha256: sourceSurface.source_access_decision_payload_sha256,
      ready: true,
      hash_bound: true,
      active_entrypoint: false
    }
  ];

  const indexPayload = {
    source_surface_id: sourceSurface.surface_id,
    source_surface_sha256: sourceSurface.evidence_pack_runtime_read_access_decision_review_package_export_surface_sha256,
    source_surface_payload_sha256: sourceSurface.surface_payload_sha256,
    source_surface_scope: sourceSurface.surface_scope,
    source_surface_consumer: sourceSurface.surface_consumer,
    source_surface_ready: true,
    source_surface_observe_only: true,
    source_surface_human_review_readable: sourceSurfacePayload.stable_access_contract.human_review_readable,
    source_export_sha256: sourceSurface.source_export_sha256,
    source_export_payload_sha256: sourceSurface.source_export_payload_sha256,
    source_review_package_sha256: sourceSurface.source_review_package_sha256,
    source_review_package_payload_sha256: sourceSurface.source_review_package_payload_sha256,
    source_audit_index_sha256: sourceSurface.source_audit_index_sha256,
    source_audit_index_payload_sha256: sourceSurface.source_audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceSurface.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceSurface.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceSurface.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceSurface.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceSurface.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceSurface.source_access_decision_payload_sha256,
    active_runtime_entrypoint: activeRuntimeEntrypoint,
    integration_entries: integrationEntries,
    integration_entry_count: integrationEntries.length,
    integration_entries_satisfied: integrationEntries.every((entry) => entry.ready === true && entry.hash_bound === true),
    stable_access_contract: cloneJson(sourceSurfacePayload.stable_access_contract),
    fail_closed_view: {
      source_surface_required: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,
      authorization_required_for_execution: true,
      authorization_state: sourceSurface.authorization_state,
      access_granted: false,
      unresolved_authorization_blocks_execution: true
    },
    readable_summary: {
      index_type: 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX',
      active_entrypoint: activeRuntimeEntrypoint.function_name,
      consumer: 'JOKER_C2',
      access_granted: false,
      authority_resolution_state: sourceSurface.authority_resolution_state,
      policy_decision: sourceSurface.policy_decision,
      authorization_state: sourceSurface.authorization_state,
      external_review_submission_created: false,
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false
    },
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,
      stable_access_contract_satisfied: true,
      runtime_read_access_decision_review_package_export_surface_integration_index_only: true,
      integration_index_does_not_authorize: true,
      source_surface_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutation: true,
      no_runtime_audit_log_append_side_effect: true,
      no_external_review_execution_created: true,
      no_external_review_submission_created: true,
      no_external_review_publication_created: true,
      no_legal_certification_created: true,
      no_eidas_qualification_created: true,
      no_opc_allow_created: true,
      no_deployment_proof_created: true,
      no_production_proof_created: true
    }
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_KIND,
    generated_at: generatedAt,
    current_time: currentTime,
    index_id:
      'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-INTEGRATION-INDEX-2026-09-23',
    index_main_commit: '08feb4ac562e945d947ac9dd95b869b3c7c4ad4b',
    source_surface_feature_commit: '99746abf47c9eb2a90d5e1a84f81bbdb4b9a5674',
    source_surface_merge_commit: '6848d39a64bbcebd3cf956cdf98c0e149a123cdb',
    source_surface_checkpoint_commit: '273a1ff660cc7097e423db4e0a82de8281b2805d',
    source_surface_final_chain_audit_commit: '08feb4ac562e945d947ac9dd95b869b3c7c4ad4b',
    source_surface_checkpoint_doc_sha256: 'b32630115ad6162d2e76835563745ea3a78d6bcf27ff712b4d23fa456164e04d',
    source_final_chain_audit_doc_sha256: '067d3ff2f569388203ca6ae5caa945e5506048328c03be667415299ab8ef7d83',
    source_surface_sha256: sourceSurface.evidence_pack_runtime_read_access_decision_review_package_export_surface_sha256,
    source_surface_payload_sha256: sourceSurface.surface_payload_sha256,
    source_export_sha256: sourceSurface.source_export_sha256,
    source_export_payload_sha256: sourceSurface.source_export_payload_sha256,
    source_review_package_sha256: sourceSurface.source_review_package_sha256,
    source_review_package_payload_sha256: sourceSurface.source_review_package_payload_sha256,
    source_audit_index_sha256: sourceSurface.source_audit_index_sha256,
    source_audit_index_payload_sha256: sourceSurface.source_audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceSurface.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceSurface.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceSurface.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceSurface.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceSurface.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceSurface.source_access_decision_payload_sha256,
    index_payload_sha256: sha256Hex(indexPayload),
    index_payload: indexPayload,
    index_ready: true,
    index_scope:
      'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_ONLY',
    index_consumer: 'JOKER_C2',
    index_category: 'INTEGRATION_INDEX',
    index_subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX',
    active_entrypoint_count: 1,
    integration_entry_count: integrationEntries.length,
    integration_entries_satisfied: indexPayload.integration_entries_satisfied,
    stable_access_contract_satisfied: true,
    fail_closed_source_surface_required: true,
    source_surface_hash_bound: true,
    active_runtime_entrypoint: activeRuntimeEntrypoint,
    authority_resolution_state: sourceSurface.authority_resolution_state,
    policy_decision: sourceSurface.policy_decision,
    authorization_state: sourceSurface.authorization_state,
    positive_allow_probe_authorization_state: sourceSurface.positive_allow_probe_authorization_state,
    observe_only_index_semantics: true,
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

  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256 =
    sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE.READY,
    reason:
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex
};
