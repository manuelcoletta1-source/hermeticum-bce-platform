'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadIntegrationIndex
} = require('./create-external-review-candidate-evidence-pack-runtime-read-integration-index');

const {
  resolveAuthority
} = require('../authority/resolve-authority');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_capability_binding.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_INDEX_SHA =
  '0389e4a83329c0800d62100cf372dc526ddb07f312c49e24802b9f41a0fd5660';

const EXPECTED_SOURCE_INDEX_PAYLOAD_SHA =
  'd49885b93eb253a2d58c491a09e60c1e39bf0bfe706e0513e931e08ecd785f3a';

function stableStringify(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || !Number.isSafeInteger(value)) {
      throw new TypeError('UNSAFE_NUMBER');
    }
    return String(value);
  }

  if (Array.isArray(value)) {
    return '[' + value.map((item) => stableStringify(item)).join(',') + ']';
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return '{' + keys.map((key) => JSON.stringify(key) + ':' + stableStringify(value[key])).join(',') + '}';
  }

  throw new TypeError('UNSUPPORTED_VALUE');
}

function sha256Hex(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function isIsoUtcMillis(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value);
}

function createAuthorityFixtures(sourceIndex, currentTime) {
  const targetRef = sourceIndex.index_id;
  const actionClass = 'READ_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX';

  const mandate = {
    mandate_id: 'MND-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-INTERNAL-RUNTIME-2026-09-23',
    mandate_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-09-23T14:55:00.000Z',
    valid_until: null,
    principal_ref: 'HBCE_INTERNAL_RUNTIME',
    actor_ref: 'JOKER_C2',
    iospace_ref: 'HBCE_INTERNAL_RUNTIME'
  };

  const capability = {
    capability_id: 'CAP-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-INTEGRATION-INDEX-2026-09-23',
    capability_version: 1,
    state: 'ACTIVE',
    evidence_state: 'PRESENT',
    evidence_reference: sourceIndex.evidence_pack_runtime_read_integration_index_sha256,
    valid_from: '2026-09-23T14:55:00.000Z',
    valid_until: null,
    action_class: actionClass,
    target_ref: targetRef,
    iospace_ref: 'HBCE_INTERNAL_RUNTIME'
  };

  const authority = {
    authority_id: 'AUT-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-INTEGRATION-INDEX-READ-2026-09-23',
    authority_version: 1,
    state: 'ACTIVE',
    evidence_state: 'PRESENT',
    evidence_reference: sourceIndex.evidence_pack_runtime_read_integration_index_sha256,
    valid_from: '2026-09-23T14:55:00.000Z',
    valid_until: null,
    mandate_ref: mandate.mandate_id,
    mandate_version: mandate.mandate_version,
    capability_ref: capability.capability_id,
    capability_version: capability.capability_version,
    principal_ref: mandate.principal_ref,
    actor_ref: mandate.actor_ref,
    iospace_ref: mandate.iospace_ref,
    scope: {
      target_refs: [targetRef],
      action_classes: [actionClass],
      iospace_refs: ['HBCE_INTERNAL_RUNTIME'],
      constraint_refs: []
    },
    limits: {
      policy_refs: [],
      quantitative_limit_refs: [],
      condition_refs: []
    }
  };

  const request = {
    request_id: 'REQ-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-INTEGRATION-INDEX-READ-2026-09-23',
    principal_ref: mandate.principal_ref,
    actor_ref: mandate.actor_ref,
    target_ref: targetRef,
    action_class: actionClass,
    iospace_ref: mandate.iospace_ref,
    current_time: currentTime,
    currentTime
  };

  return {
    authority,
    mandate,
    capability,
    request,
    current_time: currentTime,
    currentTime
  };
}

function createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T15:00:00.000Z';
  const currentTime = input.current_time || '2026-09-23T15:00:00.000Z';

  const readIndexGeneratedAt = input.read_index_generated_at || '2026-09-23T14:45:00.000Z';
  const readSurfaceGeneratedAt = input.read_surface_generated_at || '2026-09-23T14:30:00.000Z';
  const adapterGeneratedAt = input.adapter_generated_at || '2026-09-23T14:15:00.000Z';
  const boundaryGeneratedAt = input.boundary_generated_at || '2026-09-23T14:00:00.000Z';
  const boundaryCurrentTime = input.boundary_current_time || '2026-09-23T14:00:00.000Z';
  const bindingGeneratedAt = input.binding_generated_at || '2026-09-23T13:45:00.000Z';
  const bindingCurrentTime = input.binding_current_time || '2026-09-23T13:45:00.000Z';
  const indexGeneratedAt = input.index_generated_at || '2026-09-23T13:30:00.000Z';
  const exportSurfaceGeneratedAt = input.export_surface_generated_at || '2026-09-23T13:15:00.000Z';
  const exportGeneratedAt = input.export_generated_at || '2026-09-23T13:00:00.000Z';
  const packGeneratedAt = input.pack_generated_at || '2026-09-23T12:45:00.000Z';
  const manifestGeneratedAt = input.manifest_generated_at || '2026-09-23T12:30:00.000Z';

  if (!isIsoUtcMillis(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoUtcMillis(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_CURRENT_TIME_INVALID'
    };
  }

  const indexResult = createExternalReviewCandidateEvidencePackRuntimeReadIntegrationIndex({
    generated_at: readIndexGeneratedAt,
    read_surface_generated_at: readSurfaceGeneratedAt,
    adapter_generated_at: adapterGeneratedAt,
    boundary_generated_at: boundaryGeneratedAt,
    boundary_current_time: boundaryCurrentTime,
    binding_generated_at: bindingGeneratedAt,
    binding_current_time: bindingCurrentTime,
    index_generated_at: indexGeneratedAt,
    export_surface_generated_at: exportSurfaceGeneratedAt,
    export_generated_at: exportGeneratedAt,
    pack_generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (
    indexResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_SOURCE_INDEX_BLOCKED'
    };
  }

  const sourceIndex = indexResult.evidence_pack_runtime_read_integration_index;

  if (
    sourceIndex.evidence_pack_runtime_read_integration_index_sha256 !== EXPECTED_SOURCE_INDEX_SHA ||
    sourceIndex.read_integration_payload_sha256 !== EXPECTED_SOURCE_INDEX_PAYLOAD_SHA
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_SOURCE_INDEX_HASH_MISMATCH'
    };
  }

  if (
    sourceIndex.index_ready !== true ||
    sourceIndex.read_model_available !== true ||
    sourceIndex.read_surface_index_only !== true ||
    sourceIndex.access_granted !== false ||
    sourceIndex.grants_authorization !== false ||
    sourceIndex.executes_runtime_action !== false ||
    sourceIndex.mutates_runtime_state !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_SOURCE_INDEX_NOT_READ_ONLY'
    };
  }

  const fixtures = createAuthorityFixtures(sourceIndex, currentTime);
  const authorityResolution = resolveAuthority(fixtures);

  if (authorityResolution.state !== 'VALID') {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_AUTHORITY_INVALID',
      authority_resolution: authorityResolution
    };
  }

  const capabilityBindingPayload = {
    source_index_id: sourceIndex.index_id,
    source_index_sha256: sourceIndex.evidence_pack_runtime_read_integration_index_sha256,
    source_index_payload_sha256: sourceIndex.read_integration_payload_sha256,
    source_index_scope: sourceIndex.index_scope,
    source_index_consumer: sourceIndex.index_consumer,
    source_index_ready: sourceIndex.index_ready,
    source_index_read_only: sourceIndex.read_surface_index_only,
    source_fail_closed_view: cloneJson(sourceIndex.read_integration_payload.fail_closed_view),
    capability: cloneJson(fixtures.capability),
    authority: cloneJson(fixtures.authority),
    mandate: cloneJson(fixtures.mandate),
    request: cloneJson(fixtures.request),
    authority_resolution: cloneJson(authorityResolution),
    binding_contract: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      runtime_read_capability_binding_only: true,
      binds_runtime_read_integration_index: true,
      fail_closed_source_index_required: true,
      valid_authority_does_not_authorize: true,
      policy_allow_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      does_not_create_authorization: true,
      does_not_execute_action: true,
      does_not_dispatch: true,
      does_not_mutate_state: true
    },
    source_read_integration_payload: cloneJson(sourceIndex.read_integration_payload)
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_KIND,
    version: '1.0.0',
    binding_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-CAPABILITY-BINDING-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    binding_scope: 'INTERNAL_RUNTIME_READ_CAPABILITY_BINDING_ONLY',
    binding_consumer: 'JOKER_C2',
    binding_main_commit: 'a6b380c3bea006f2754d156252e6c7cf63a1a955',
    source_index_merge_commit: '528265deb4f868e9ab86c571d1e2e9ca19ef0547',
    source_index_checkpoint_commit: '4dc42a79dfc2f91e4438b10ba4ca2c8e4b7a986f',
    source_final_chain_audit_commit: 'a6b380c3bea006f2754d156252e6c7cf63a1a955',
    source_index_checkpoint_doc_sha256: 'f5fe83ec59900a1b77b53392c6d391722c15c434b3b121eec9a8378410b06290',
    source_final_chain_audit_doc_sha256: '76795336389665795482e19b45a2687321aab908d9a18c70d768de76b9bcca7b',
    source_index_sha256: sourceIndex.evidence_pack_runtime_read_integration_index_sha256,
    source_index_payload_sha256: sourceIndex.read_integration_payload_sha256,
    capability_binding_payload_sha256: sha256Hex(capabilityBindingPayload),
    capability_binding_payload: capabilityBindingPayload,
    authority_resolution_state: authorityResolution.state,
    authority_resolution_reason: authorityResolution.reason,
    binding_ready: true,
    read_model_available: true,
    read_capability_binding_only: true,
    access_granted: false,
    grants_authorization: false,
    creates_authorization_artifact: false,
    executes_runtime_action: false,
    creates_dispatch: false,
    mutates_runtime_state: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_runtime_read_capability_binding_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_READY',
    evidence_pack_runtime_read_capability_binding: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding
};
