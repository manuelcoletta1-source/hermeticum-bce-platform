'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAdapter
} = require('./create-external-review-candidate-evidence-pack-runtime-read-adapter');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_surface.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_ADAPTER_SHA =
  '0a1f3decd9d1a2d9fd18fcf1e09ec1152464d909f6d0933a2fb219476f59c4d5';

const EXPECTED_SOURCE_ADAPTER_PAYLOAD_SHA =
  'aca27fae5c84dfcccd6a1a69f8132c06705a4e6451c86e0554beea0f89b6213d';

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

function createExternalReviewCandidateEvidencePackRuntimeReadSurface(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T14:30:00.000Z';
  const adapterGeneratedAt = input.adapter_generated_at || '2026-09-23T14:15:00.000Z';
  const boundaryGeneratedAt = input.boundary_generated_at || '2026-09-23T14:00:00.000Z';
  const boundaryCurrentTime = input.boundary_current_time || '2026-09-23T14:00:00.000Z';
  const bindingGeneratedAt = input.binding_generated_at || '2026-09-23T13:45:00.000Z';
  const bindingCurrentTime = input.binding_current_time || '2026-09-23T13:45:00.000Z';
  const indexGeneratedAt = input.index_generated_at || '2026-09-23T13:30:00.000Z';
  const surfaceGeneratedAt = input.surface_generated_at || '2026-09-23T13:15:00.000Z';
  const exportGeneratedAt = input.export_generated_at || '2026-09-23T13:00:00.000Z';
  const packGeneratedAt = input.pack_generated_at || '2026-09-23T12:45:00.000Z';
  const manifestGeneratedAt = input.manifest_generated_at || '2026-09-23T12:30:00.000Z';

  if (!isIsoUtcMillis(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_GENERATED_AT_INVALID'
    };
  }

  const adapterResult = createExternalReviewCandidateEvidencePackRuntimeReadAdapter({
    generated_at: adapterGeneratedAt,
    boundary_generated_at: boundaryGeneratedAt,
    boundary_current_time: boundaryCurrentTime,
    binding_generated_at: bindingGeneratedAt,
    binding_current_time: bindingCurrentTime,
    index_generated_at: indexGeneratedAt,
    surface_generated_at: surfaceGeneratedAt,
    export_generated_at: exportGeneratedAt,
    pack_generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (
    adapterResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_SOURCE_ADAPTER_BLOCKED'
    };
  }

  const sourceAdapter = adapterResult.evidence_pack_runtime_read_adapter;

  if (
    sourceAdapter.evidence_pack_runtime_read_adapter_sha256 !== EXPECTED_SOURCE_ADAPTER_SHA ||
    sourceAdapter.read_adapter_payload_sha256 !== EXPECTED_SOURCE_ADAPTER_PAYLOAD_SHA
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_SOURCE_ADAPTER_HASH_MISMATCH'
    };
  }

  if (
    sourceAdapter.read_adapter_ready !== true ||
    sourceAdapter.read_model_available !== true ||
    sourceAdapter.access_granted !== false ||
    sourceAdapter.grants_authorization !== false ||
    sourceAdapter.creates_authorization_artifact !== false ||
    sourceAdapter.executes_runtime_action !== false ||
    sourceAdapter.creates_dispatch !== false ||
    sourceAdapter.mutates_runtime_state !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_SOURCE_ADAPTER_NOT_READ_ONLY'
    };
  }

  const adapterPayload = sourceAdapter.read_adapter_payload;
  const adapterProjection = adapterPayload.read_projection;

  const readSurfacePayload = {
    source_adapter_id: sourceAdapter.adapter_id,
    source_adapter_sha256: sourceAdapter.evidence_pack_runtime_read_adapter_sha256,
    source_adapter_payload_sha256: sourceAdapter.read_adapter_payload_sha256,
    source_boundary_sha256: sourceAdapter.source_boundary_sha256,
    source_boundary_payload_sha256: sourceAdapter.source_boundary_payload_sha256,
    surface_request: {
      request_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-SURFACE-REQUEST-2026-09-23',
      requested_at: generatedAt,
      requested_by: 'JOKER_C2',
      requested_action: 'READ_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_SURFACE',
      requested_scope: 'INTERNAL_RUNTIME_READ_SURFACE_ONLY'
    },
    surface_projection: {
      projection_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-SURFACE-PROJECTION-2026-09-23',
      projection_type: 'RUNTIME_READ_SURFACE_PROJECTION',
      chain: adapterProjection.chain.concat(['Evidence Pack Runtime Read Adapter']),
      read_model_available: sourceAdapter.read_model_available,
      source_adapter_scope: sourceAdapter.adapter_scope,
      source_adapter_consumer: sourceAdapter.adapter_consumer,
      authority_resolution_state: adapterProjection.authority_resolution_state,
      policy_decision: adapterProjection.policy_decision,
      authorization_state: adapterProjection.authorization_state,
      positive_allow_probe_authorization_state: adapterProjection.positive_allow_probe_authorization_state,
      access_granted: adapterProjection.access_granted,
      source_boundary_summary: cloneJson(adapterProjection.source_boundary_summary)
    },
    surface_contract: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      read_surface_only: true,
      exposes_read_adapter_projection: true,
      fail_closed_source_adapter_required: true,
      valid_authority_does_not_authorize: true,
      policy_allow_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      does_not_create_authorization: true,
      does_not_execute_action: true,
      does_not_dispatch: true,
      does_not_mutate_state: true
    },
    source_adapter_read_adapter_payload: cloneJson(adapterPayload)
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_KIND,
    version: '1.0.0',
    surface_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-SURFACE-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    surface_scope: 'INTERNAL_RUNTIME_READ_SURFACE_ONLY',
    surface_consumer: 'JOKER_C2',
    surface_main_commit: '2a7fdc35e38a7e2087998839d52a9480b685ea9f',
    source_adapter_merge_commit: 'de93ee3cd491efab51964f8fbe31d0d086766a41',
    source_adapter_checkpoint_commit: 'b51751742f48e5fb48e18331fc7c0809cc1ccfe9',
    source_final_chain_audit_commit: '2a7fdc35e38a7e2087998839d52a9480b685ea9f',
    source_adapter_checkpoint_doc_sha256: 'e502c41079fe604b053fc11b650fc304560649ec799d111d9228cf938752e307',
    source_final_chain_audit_doc_sha256: 'd80d555e19f6ff29fae6a905dbe23b76177478692641e3709f08297e9d78697b',
    source_adapter_sha256: sourceAdapter.evidence_pack_runtime_read_adapter_sha256,
    source_adapter_payload_sha256: sourceAdapter.read_adapter_payload_sha256,
    runtime_entrypoint: {
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-adapter.js',
      function_name: 'createExternalReviewCandidateEvidencePackRuntimeReadAdapter',
      default_adapter_generated_at: '2026-09-23T14:15:00.000Z',
      default_boundary_generated_at: '2026-09-23T14:00:00.000Z',
      default_boundary_current_time: '2026-09-23T14:00:00.000Z'
    },
    read_surface_payload_sha256: sha256Hex(readSurfacePayload),
    read_surface_payload: readSurfacePayload,
    read_surface_ready: true,
    read_model_available: true,
    read_only_surface: true,
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

  body.evidence_pack_runtime_read_surface_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_READY',
    evidence_pack_runtime_read_surface: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadSurface
};
