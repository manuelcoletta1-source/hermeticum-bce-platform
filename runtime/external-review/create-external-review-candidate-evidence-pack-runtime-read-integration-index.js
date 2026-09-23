'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadSurface
} = require('./create-external-review-candidate-evidence-pack-runtime-read-surface');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_integration_index.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_SURFACE_SHA =
  '71b48a5aa49e4ba0eef7544bcc7c225c4eda1801475498a5bda1f497336d00b7';

const EXPECTED_SOURCE_SURFACE_PAYLOAD_SHA =
  'c9076c1cdc1458a1fac8df3d137ba8ce51be4e0dd078d9c0df5b9b5d8ed6a628';

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

function createIntegrationEntries() {
  return [
    {
      sequence: 1,
      key: 'evidence_chain_manifest',
      role: 'CHAIN_MANIFEST',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-chain-manifest.js',
      function_name: 'createExternalReviewCandidateEvidenceChainManifest'
    },
    {
      sequence: 2,
      key: 'evidence_pack',
      role: 'PACK',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack.js',
      function_name: 'createExternalReviewCandidateEvidencePack'
    },
    {
      sequence: 3,
      key: 'evidence_pack_export',
      role: 'EXPORT',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-export.js',
      function_name: 'createExternalReviewCandidateEvidencePackExport'
    },
    {
      sequence: 4,
      key: 'evidence_pack_export_surface',
      role: 'EXPORT_SURFACE',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-export-surface.js',
      function_name: 'createExternalReviewCandidateEvidencePackExportSurface'
    },
    {
      sequence: 5,
      key: 'evidence_pack_integration_index',
      role: 'INTEGRATION_INDEX',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-integration-index.js',
      function_name: 'createExternalReviewCandidateEvidencePackIntegrationIndex'
    },
    {
      sequence: 6,
      key: 'evidence_pack_capability_binding',
      role: 'CAPABILITY_BINDING',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-capability-binding.js',
      function_name: 'createExternalReviewCandidateEvidencePackCapabilityBinding'
    },
    {
      sequence: 7,
      key: 'evidence_pack_access_decision_boundary',
      role: 'ACCESS_DECISION_BOUNDARY',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-access-decision-boundary.js',
      function_name: 'createExternalReviewCandidateEvidencePackAccessDecisionBoundary'
    },
    {
      sequence: 8,
      key: 'evidence_pack_runtime_read_adapter',
      role: 'RUNTIME_READ_ADAPTER',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-adapter.js',
      function_name: 'createExternalReviewCandidateEvidencePackRuntimeReadAdapter'
    },
    {
      sequence: 9,
      key: 'evidence_pack_runtime_read_surface',
      role: 'RUNTIME_READ_SURFACE',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-surface.js',
      function_name: 'createExternalReviewCandidateEvidencePackRuntimeReadSurface'
    }
  ];
}

function createExternalReviewCandidateEvidencePackRuntimeReadIntegrationIndex(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T14:45:00.000Z';
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
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_GENERATED_AT_INVALID'
    };
  }

  const surfaceResult = createExternalReviewCandidateEvidencePackRuntimeReadSurface({
    generated_at: readSurfaceGeneratedAt,
    adapter_generated_at: adapterGeneratedAt,
    boundary_generated_at: boundaryGeneratedAt,
    boundary_current_time: boundaryCurrentTime,
    binding_generated_at: bindingGeneratedAt,
    binding_current_time: bindingCurrentTime,
    index_generated_at: indexGeneratedAt,
    surface_generated_at: exportSurfaceGeneratedAt,
    export_generated_at: exportGeneratedAt,
    pack_generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (
    surfaceResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_SOURCE_SURFACE_BLOCKED'
    };
  }

  const sourceSurface = surfaceResult.evidence_pack_runtime_read_surface;

  if (
    sourceSurface.evidence_pack_runtime_read_surface_sha256 !== EXPECTED_SOURCE_SURFACE_SHA ||
    sourceSurface.read_surface_payload_sha256 !== EXPECTED_SOURCE_SURFACE_PAYLOAD_SHA
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_SOURCE_SURFACE_HASH_MISMATCH'
    };
  }

  if (
    sourceSurface.read_surface_ready !== true ||
    sourceSurface.read_model_available !== true ||
    sourceSurface.read_only_surface !== true ||
    sourceSurface.access_granted !== false ||
    sourceSurface.grants_authorization !== false ||
    sourceSurface.creates_authorization_artifact !== false ||
    sourceSurface.executes_runtime_action !== false ||
    sourceSurface.creates_dispatch !== false ||
    sourceSurface.mutates_runtime_state !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_SOURCE_SURFACE_NOT_READ_ONLY'
    };
  }

  const sourcePayload = sourceSurface.read_surface_payload;
  const sourceProjection = sourcePayload.surface_projection;
  const entries = createIntegrationEntries();
  const integrationChain = sourceProjection.chain.concat([
    'Evidence Pack Runtime Read Surface',
    'Evidence Pack Runtime Read Integration Index'
  ]);

  const activeRuntimeEntrypoint = {
    module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-surface.js',
    function_name: 'createExternalReviewCandidateEvidencePackRuntimeReadSurface',
    consumer: 'JOKER_C2'
  };

  const readIntegrationPayload = {
    source_surface_id: sourceSurface.surface_id,
    source_surface_sha256: sourceSurface.evidence_pack_runtime_read_surface_sha256,
    source_surface_payload_sha256: sourceSurface.read_surface_payload_sha256,
    source_adapter_sha256: sourceSurface.source_adapter_sha256,
    source_adapter_payload_sha256: sourceSurface.source_adapter_payload_sha256,
    surface_projection: cloneJson(sourceProjection),
    integration_chain: cloneJson(integrationChain),
    integration_entries: cloneJson(entries),
    active_runtime_entrypoint: cloneJson(activeRuntimeEntrypoint),
    fail_closed_view: {
      authority_resolution_state: sourceProjection.authority_resolution_state,
      policy_decision: sourceProjection.policy_decision,
      authorization_state: sourceProjection.authorization_state,
      positive_allow_probe_authorization_state: sourceProjection.positive_allow_probe_authorization_state,
      access_granted: sourceProjection.access_granted,
      authorization_reason: sourceProjection.source_boundary_summary.authorization_reason,
      policy_decision_reason: sourceProjection.source_boundary_summary.policy_decision_reason
    },
    integration_contract: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      runtime_read_integration_index_only: true,
      indexes_runtime_read_surface: true,
      fail_closed_source_surface_required: true,
      valid_authority_does_not_authorize: true,
      policy_allow_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      does_not_create_authorization: true,
      does_not_execute_action: true,
      does_not_dispatch: true,
      does_not_mutate_state: true
    },
    source_read_surface_payload: cloneJson(sourcePayload)
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_KIND,
    version: '1.0.0',
    index_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-INTEGRATION-INDEX-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    index_scope: 'INTERNAL_RUNTIME_READ_INTEGRATION_INDEX_ONLY',
    index_consumer: 'JOKER_C2',
    index_main_commit: 'b778e50f2b6c89064862ac8040124fd2cfa9cc46',
    source_surface_merge_commit: 'e080175b678c2fa7907738788db36568d3cf088b',
    source_surface_checkpoint_commit: 'c2c95958be32465d41194665ff75a42ce332e763',
    source_final_chain_audit_commit: 'b778e50f2b6c89064862ac8040124fd2cfa9cc46',
    source_surface_checkpoint_doc_sha256: '89cfadee0083bf706efc1a24660448c68bf0a3374a63044df86be2776c35d7f4',
    source_final_chain_audit_doc_sha256: 'b65ef7ba4d599a5f86606320eeae67530b7d8d19787aacbbd585b0a70599fbaf',
    source_surface_sha256: sourceSurface.evidence_pack_runtime_read_surface_sha256,
    source_surface_payload_sha256: sourceSurface.read_surface_payload_sha256,
    integration_chain: integrationChain,
    integration_entries: entries,
    active_runtime_entrypoint: activeRuntimeEntrypoint,
    read_integration_payload_sha256: sha256Hex(readIntegrationPayload),
    read_integration_payload: readIntegrationPayload,
    index_ready: true,
    read_model_available: true,
    read_surface_index_only: true,
    fail_closed_source_surface_required: true,
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

  body.evidence_pack_runtime_read_integration_index_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_READY',
    evidence_pack_runtime_read_integration_index: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadIntegrationIndex
};
