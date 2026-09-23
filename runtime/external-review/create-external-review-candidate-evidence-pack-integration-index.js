'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE,
  createExternalReviewCandidateEvidencePackExportSurface
} = require('./create-external-review-candidate-evidence-pack-export-surface');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_PROTO =
  'hbce.external_review_candidate.evidence_pack_integration_index.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

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
      role: 'SURFACE',
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-export-surface.js',
      function_name: 'createExternalReviewCandidateEvidencePackExportSurface'
    }
  ];
}

function createExternalReviewCandidateEvidencePackIntegrationIndex(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T13:30:00.000Z';
  const surfaceGeneratedAt = input.surface_generated_at || '2026-09-23T13:15:00.000Z';
  const exportGeneratedAt = input.export_generated_at || '2026-09-23T13:00:00.000Z';
  const packGeneratedAt = input.pack_generated_at || '2026-09-23T12:45:00.000Z';
  const manifestGeneratedAt = input.manifest_generated_at || '2026-09-23T12:30:00.000Z';

  if (!isIsoUtcMillis(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_GENERATED_AT_INVALID'
    };
  }

  const surfaceResult = createExternalReviewCandidateEvidencePackExportSurface({
    generated_at: surfaceGeneratedAt,
    export_generated_at: exportGeneratedAt,
    pack_generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (surfaceResult.state !== HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE.READY) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_SOURCE_SURFACE_BLOCKED'
    };
  }

  const sourceSurface = surfaceResult.evidence_pack_export_surface;
  const entries = createIntegrationEntries();

  const integrationPayload = {
    source_surface_id: sourceSurface.surface_id,
    source_surface_sha256: sourceSurface.evidence_pack_export_surface_sha256,
    source_surface_payload_sha256: sourceSurface.surface_payload_sha256,
    source_export_sha256: sourceSurface.source_export_sha256,
    source_export_payload_sha256: sourceSurface.source_export_payload_sha256,
    source_pack_sha256: sourceSurface.surface_payload.source_pack_sha256,
    source_pack_checkpoint_commit: sourceSurface.surface_payload.source_pack_checkpoint_commit,
    source_pack_checkpoint_doc_sha256: sourceSurface.surface_payload.source_pack_checkpoint_doc_sha256,
    active_entrypoint: cloneJson(sourceSurface.runtime_entrypoint),
    stable_access_contract: cloneJson(sourceSurface.stable_access_contract),
    evidence_summary: cloneJson(sourceSurface.surface_payload.evidence_summary),
    runtime_entries: entries
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_KIND,
    version: '1.0.0',
    index_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-INTEGRATION-INDEX-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    index_scope: 'INTERNAL_RUNTIME_INTEGRATION_INDEX_ONLY',
    index_consumer: 'JOKER_C2',
    index_main_commit: '5bb7df53bf30632ac7213e19446a9b56ee7e2af7',
    source_surface_main_commit: 'abe2010c55e7af264ed72399b3829adfb0b7d870',
    source_surface_checkpoint_commit: '5bb7df53bf30632ac7213e19446a9b56ee7e2af7',
    source_surface_checkpoint_doc_sha256: '706cb0ce16f5e6ff718f6be05319a99b24945c5b3979fed642e5ab2c9d320717',
    source_surface_sha256: sourceSurface.evidence_pack_export_surface_sha256,
    source_surface_payload_sha256: sourceSurface.surface_payload_sha256,
    integration_chain: [
      'Evidence Chain Manifest',
      'Evidence Pack',
      'Evidence Pack Export',
      'Evidence Pack Export Surface',
      'Evidence Pack Integration Index'
    ],
    integration_entries: entries,
    active_runtime_entrypoint: {
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-export-surface.js',
      function_name: 'createExternalReviewCandidateEvidencePackExportSurface',
      consumer: 'JOKER_C2'
    },
    integration_payload_sha256: sha256Hex(integrationPayload),
    integration_payload: integrationPayload,
    index_ready: true,
    fail_closed_source_surface_required: true,
    public_registry_mutated: false,
    external_trust_registry_mutated: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_integration_index_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_READY',
    evidence_pack_integration_index: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE,
  createExternalReviewCandidateEvidencePackIntegrationIndex
};
