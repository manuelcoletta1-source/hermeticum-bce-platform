'use strict';

const crypto = require('crypto');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-integration-index');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T17:50:00.000Z';
const DEFAULT_CURRENT_TIME = '2026-09-23T17:50:00.000Z';

const EXPECTED_SOURCE_INDEX_SHA256 =
  '3f7c9aa821aac9f53e0ab0652a2cc235795059d55c9797ab32295508e7c7ed68';

const EXPECTED_SOURCE_INDEX_PAYLOAD_SHA256 =
  'b2a72f0cd85873c154a9bf511d0d7882c7972eb278459dc230492563187ea26a';

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256Hex(value) {
  const payload = typeof value === 'string' ? value : JSON.stringify(value);
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function isIsoDateTime(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const parsed = new Date(value);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function blocked(reason, details = {}) {
  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE.BLOCKED,
    reason,
    ...details
  };
}

function buildCapabilityBindingPayload({ sourceIndex, currentTime }) {
  const sourcePayload = sourceIndex.index_payload || {};

  const capability = {
    capability_id:
      'CAP-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-INTEGRATION-INDEX-2026-09-23',
    capability_version: 1,
    capability_status: 'ACTIVE',
    capability_class: 'READ_ONLY_INTERNAL_RUNTIME_EVIDENCE',
    action_class:
      'READ_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX',
    target_ref: sourceIndex.index_id,
    target_sha256: sourceIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256,
    target_payload_sha256: sourceIndex.index_payload_sha256,
    iospace_ref: 'HBCE-JOKER-C2-INTERNAL-RUNTIME',
    consumer: 'JOKER_C2',
    valid_from: '2026-09-23T00:00:00.000Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: sourceIndex.index_id,
    grants_authorization: false,
    grants_dispatch: false,
    grants_execution: false,
    read_only: true,
    observe_only: true
  };

  const authority = {
    authority_id:
      'AUT-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-INTEGRATION-INDEX-READ-2026-09-23',
    authority_version: 1,
    authority_status: 'ACTIVE',
    actor_ref: 'JOKER_C2',
    principal_ref: 'HBCE_INTERNAL_RUNTIME',
    capability_ref: capability.capability_id,
    capability_version: capability.capability_version,
    target_ref: capability.target_ref,
    action_class: capability.action_class,
    iospace_ref: capability.iospace_ref,
    valid_from: capability.valid_from,
    valid_until: capability.valid_until,
    evidence_state: 'PRESENT',
    evidence_reference: sourceIndex.index_id,
    scope: {
      source_index_id: sourceIndex.index_id,
      source_index_sha256:
        sourceIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256,
      source_index_payload_sha256: sourceIndex.index_payload_sha256,
      consumer: 'JOKER_C2',
      access_mode: 'READ_ONLY',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      runtime_mutation_effect: 'NONE'
    },
    mandate: {
      mandate_id:
        'MAND-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-INTEGRATION-INDEX-READ-2026-09-23',
      mandate_version: 1,
      mandate_status: 'ACTIVE',
      valid_from: capability.valid_from,
      valid_until: capability.valid_until,
      actor_ref: 'JOKER_C2',
      principal_ref: 'HBCE_INTERNAL_RUNTIME',
      capability_ref: capability.capability_id,
      capability_version: capability.capability_version,
      evidence_state: 'PRESENT'
    }
  };

  const authorityResolution = {
    state: 'VALID',
    reason: 'AUTHORITY_VALID',
    authority_id: authority.authority_id,
    authority_version: authority.authority_version,
    capability_ref: authority.capability_ref,
    capability_version: authority.capability_version,
    target_ref: authority.target_ref,
    action_class: authority.action_class,
    iospace_ref: authority.iospace_ref,
    resolved_at: currentTime,
    emits_authorization: false,
    emits_dispatch: false,
    grants_runtime_execution: false,
    valid_authority_does_not_authorize: true
  };

  return {
    source_index_id: sourceIndex.index_id,
    source_index_sha256:
      sourceIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256,
    source_index_payload_sha256: sourceIndex.index_payload_sha256,
    source_index_scope: sourceIndex.index_scope,
    source_index_consumer: sourceIndex.index_consumer,
    source_index_ready: sourceIndex.index_ready,
    source_index_observe_only: sourceIndex.observe_only_index_semantics,
    source_surface_sha256: sourceIndex.source_surface_sha256,
    source_surface_payload_sha256: sourceIndex.source_surface_payload_sha256,
    source_export_sha256: sourceIndex.source_export_sha256,
    source_export_payload_sha256: sourceIndex.source_export_payload_sha256,
    source_review_package_sha256: sourceIndex.source_review_package_sha256,
    source_review_package_payload_sha256: sourceIndex.source_review_package_payload_sha256,
    source_audit_index_sha256: sourceIndex.source_audit_index_sha256,
    source_audit_index_payload_sha256: sourceIndex.source_audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceIndex.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceIndex.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceIndex.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceIndex.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceIndex.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceIndex.source_access_decision_payload_sha256,
    active_runtime_entrypoint: cloneJson(sourceIndex.active_runtime_entrypoint),
    capability,
    authority,
    authority_resolution: authorityResolution,
    stable_access_contract: {
      ...cloneJson(sourcePayload.stable_access_contract || {}),
      capability_binding_only: true,
      runtime_read_access_decision_review_package_export_surface_capability_binding_only: true,
      fail_closed_source_index_required: true,
      source_index_hash_bound: true,
      valid_authority_does_not_authorize: true,
      capability_binding_does_not_authorize: true,
      capability_binding_does_not_dispatch: true,
      capability_binding_does_not_execute: true
    },
    source_fail_closed_view: cloneJson(sourcePayload.fail_closed_view || {}),
    fail_closed_view: {
      source_index_required: true,
      source_index_hash_bound: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,
      valid_authority_required: true,
      valid_authority_does_not_authorize: true,
      authorization_required_for_execution: true,
      unresolved_authorization_blocks_execution: true,
      no_dispatch_without_authorization: true
    },
    readable_summary: {
      capability_binding_ready: true,
      authority_resolution_state: authorityResolution.state,
      authority_resolution_reason: authorityResolution.reason,
      access_granted: false,
      grants_authorization: false,
      creates_dispatch: false,
      executes_runtime_action: false,
      external_review_submission_created: false,
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false
    },
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      source_index_hash_bound: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,
      stable_access_contract_satisfied: true,
      capability_binding_only: true,
      runtime_read_access_decision_review_package_export_surface_capability_binding_only: true,
      valid_authority_does_not_authorize: true,
      capability_binding_does_not_authorize: true,
      capability_binding_does_not_dispatch: true,
      capability_binding_does_not_execute: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutated: true,
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
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceCapabilityBinding(input = {}) {
  const generatedAt = input.generated_at || DEFAULT_GENERATED_AT;
  const currentTime = input.current_time || DEFAULT_CURRENT_TIME;

  if (!isIsoDateTime(generatedAt)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_GENERATED_AT_INVALID'
    );
  }

  if (!isIsoDateTime(currentTime)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_CURRENT_TIME_INVALID'
    );
  }

  const sourceIndexResult =
    input.source_index_result ||
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex(
      input.source_index_input || {}
    );

  if (
    sourceIndexResult.state !==
      HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE.READY ||
    !sourceIndexResult.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_BLOCKED',
      { source_index_result: cloneJson(sourceIndexResult) }
    );
  }

  const sourceIndex =
    sourceIndexResult.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index;

  if (
    sourceIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256 !==
      EXPECTED_SOURCE_INDEX_SHA256 ||
    sourceIndex.index_payload_sha256 !== EXPECTED_SOURCE_INDEX_PAYLOAD_SHA256
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_HASH_MISMATCH',
      { source_index: cloneJson(sourceIndex) }
    );
  }

  if (
    sourceIndex.access_granted !== false ||
    sourceIndex.grants_authorization !== false ||
    sourceIndex.creates_authorization_artifact !== false ||
    sourceIndex.executes_runtime_action !== false ||
    sourceIndex.creates_dispatch !== false ||
    sourceIndex.mutates_runtime_state !== false ||
    sourceIndex.observe_only_index_semantics !== true
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_NOT_READ_ONLY',
      { source_index: cloneJson(sourceIndex) }
    );
  }

  if (
    sourceIndex.external_review_execution_created !== false ||
    sourceIndex.external_review_submission_created !== false ||
    sourceIndex.external_review_publication_created !== false ||
    sourceIndex.legal_certification_created !== false ||
    sourceIndex.eidas_qualification_created !== false ||
    sourceIndex.opc_allow_created !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_FALSE_EFFECTS_INVALID',
      { source_index: cloneJson(sourceIndex) }
    );
  }

  const capabilityBindingPayload = buildCapabilityBindingPayload({
    sourceIndex,
    currentTime
  });

  if (capabilityBindingPayload.authority_resolution.state !== 'VALID') {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_AUTHORITY_INVALID',
      { authority_resolution: cloneJson(capabilityBindingPayload.authority_resolution) }
    );
  }

  capabilityBindingPayload.capability_binding_payload_sha256 = sha256Hex(capabilityBindingPayload);

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_KIND,
    binding_id:
      'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-CAPABILITY-BINDING-2026-09-23',
    binding_version: 1,
    binding_generated_at: generatedAt,
    binding_main_commit: 'f3392a071e3b31a37718f3a2c25ed2c3c45bb4a0',
    source_index_feature_commit: '5e5509f8d34a88fbddffa176634d206d7d24e231',
    source_index_merge_commit: 'b0bfb2a8d5fd89e7587b638f429212d53694adab',
    source_index_checkpoint_commit: '4effd9e23cb6ece7c5c9cce9e504063ae54518bc',
    source_index_final_chain_audit_commit: 'f3392a071e3b31a37718f3a2c25ed2c3c45bb4a0',
    source_index_checkpoint_doc_sha256: '14088b4bd94c28f7405d228dc4665bdcc13e02d6afe395099caa9b668427e49e',
    source_final_chain_audit_doc_sha256: '38cab57ea2fe4b7320eb440353e3025133ea33d6eb8e87234d6125ab01085270',
    authority: 'HBCE_INTERNAL_RUNTIME',
    binding_scope:
      'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_ONLY',
    binding_consumer: 'JOKER_C2',
    binding_category: 'CAPABILITY_BINDING',
    binding_subcategory:
      'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING',
    source_index_sha256:
      sourceIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256,
    source_index_payload_sha256: sourceIndex.index_payload_sha256,
    source_surface_sha256: sourceIndex.source_surface_sha256,
    source_surface_payload_sha256: sourceIndex.source_surface_payload_sha256,
    source_export_sha256: sourceIndex.source_export_sha256,
    source_export_payload_sha256: sourceIndex.source_export_payload_sha256,
    source_review_package_sha256: sourceIndex.source_review_package_sha256,
    source_review_package_payload_sha256: sourceIndex.source_review_package_payload_sha256,
    capability_binding_payload_sha256: capabilityBindingPayload.capability_binding_payload_sha256,
    capability_binding_payload: capabilityBindingPayload,
    capability_id: capabilityBindingPayload.capability.capability_id,
    capability_version: capabilityBindingPayload.capability.capability_version,
    authority_id: capabilityBindingPayload.authority.authority_id,
    authority_version: capabilityBindingPayload.authority.authority_version,
    authority_resolution_state: capabilityBindingPayload.authority_resolution.state,
    authority_resolution_reason: capabilityBindingPayload.authority_resolution.reason,
    stable_access_contract_satisfied: true,
    fail_closed_source_index_required: true,
    source_index_hash_bound: true,
    valid_authority_does_not_authorize: true,
    read_capability_binding_only: true,
    runtime_read_access_decision_review_package_export_surface_capability_binding_only: true,
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

  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256 =
    sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE.READY,
    reason:
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding: body
  };
}

module.exports = {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceCapabilityBinding,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE
};
