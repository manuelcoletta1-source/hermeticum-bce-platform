'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE,
  createExternalReviewCandidateEvidencePackExport
} = require('./create-external-review-candidate-evidence-pack-export');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_PROTO =
  'hbce.external_review_candidate.evidence_pack_export_surface.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE = Object.freeze({
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

function createExternalReviewCandidateEvidencePackExportSurface(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T13:15:00.000Z';
  const exportGeneratedAt = input.export_generated_at || '2026-09-23T13:00:00.000Z';
  const packGeneratedAt = input.pack_generated_at || '2026-09-23T12:45:00.000Z';
  const manifestGeneratedAt = input.manifest_generated_at || '2026-09-23T12:30:00.000Z';

  if (!isIsoUtcMillis(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_GENERATED_AT_INVALID'
    };
  }

  const exportResult = createExternalReviewCandidateEvidencePackExport({
    generated_at: exportGeneratedAt,
    pack_generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (exportResult.state !== HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE.EXPORTED) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_SOURCE_EXPORT_BLOCKED'
    };
  }

  const sourceExport = exportResult.evidence_pack_export;

  const surfacePayload = {
    export_id: sourceExport.export_id,
    export_sha256: sourceExport.evidence_pack_export_sha256,
    export_payload_sha256: sourceExport.export_payload_sha256,
    source_pack_id: sourceExport.source_pack_id,
    source_pack_sha256: sourceExport.source_pack_sha256,
    source_pack_checkpoint_commit: sourceExport.source_pack_checkpoint_commit,
    source_pack_checkpoint_doc_sha256: sourceExport.source_pack_checkpoint_doc_sha256,
    export_consumer: sourceExport.export_consumer,
    export_scope: sourceExport.export_scope,
    export_format: sourceExport.export_format,
    export_ready: sourceExport.export_ready,
    fail_closed_source_pack_required: sourceExport.fail_closed_source_pack_required,
    evidence_summary: cloneJson(sourceExport.export_payload.evidence_summary),
    runtime_access: cloneJson(sourceExport.export_payload.runtime_access),
    export_boundary: cloneJson(sourceExport.export_payload.export_boundary),
    explicit_false_runtime_effects: cloneJson(sourceExport.export_payload.explicit_false_runtime_effects)
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_KIND,
    version: '1.0.0',
    surface_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-EXPORT-SURFACE-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    surface_scope: 'INTERNAL_RUNTIME_ACCESS_SURFACE_ONLY',
    surface_consumer: 'JOKER_C2',
    surface_main_commit: 'b920ca9ca3300994ed967a81d1c488dbdfcf949a',
    source_export_main_commit: 'a8352e1e7e3b57cdec1fa8859ecd06b465c8208d',
    source_export_checkpoint_commit: 'b920ca9ca3300994ed967a81d1c488dbdfcf949a',
    source_export_checkpoint_doc_sha256: 'ddad749c3dfcb17b5ac4c434a4497b44a48a0589462643e58244ce1cbabd0191',
    source_export_sha256: sourceExport.evidence_pack_export_sha256,
    source_export_payload_sha256: sourceExport.export_payload_sha256,
    runtime_entrypoint: {
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-export.js',
      function_name: 'createExternalReviewCandidateEvidencePackExport',
      default_export_generated_at: exportGeneratedAt,
      default_pack_generated_at: packGeneratedAt,
      default_manifest_generated_at: manifestGeneratedAt
    },
    stable_access_contract: {
      callable_by_joker_c2: true,
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      fail_closed_source_export_required: true,
      human_review_readable: true
    },
    surface_payload_sha256: sha256Hex(surfacePayload),
    surface_payload: surfacePayload,
    public_registry_mutated: false,
    external_trust_registry_mutated: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_export_surface_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_READY',
    evidence_pack_export_surface: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE,
  createExternalReviewCandidateEvidencePackExportSurface
};
