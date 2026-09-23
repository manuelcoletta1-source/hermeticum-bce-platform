'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE,
  createExternalReviewCandidateEvidencePack
} = require('./create-external-review-candidate-evidence-pack');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_PROTO =
  'hbce.external_review_candidate.evidence_pack_export.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE = Object.freeze({
  EXPORTED: 'EXPORTED',
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

function createExternalReviewCandidateEvidencePackExport(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T00:00:00.000Z';
  const packGeneratedAt = input.pack_generated_at || '2026-09-23T12:45:00.000Z';
  const manifestGeneratedAt = input.manifest_generated_at || '2026-09-23T12:30:00.000Z';

  if (!isIsoUtcMillis(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_GENERATED_AT_INVALID'
    };
  }

  const packResult = createExternalReviewCandidateEvidencePack({
    generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (packResult.state !== HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE.READY) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SOURCE_PACK_BLOCKED'
    };
  }

  const pack = packResult.evidence_pack;

  const exportPayload = {
    evidence_pack_id: pack.evidence_pack_id,
    evidence_pack_sha256: pack.evidence_pack_sha256,
    source_manifest_id: pack.source_manifest_id,
    source_manifest_sha256: pack.source_manifest_sha256,
    packaging_main_commit: pack.packaging_main_commit,
    source_manifest_checkpoint_commit: pack.source_manifest_checkpoint_commit,
    source_manifest_checkpoint_doc_sha256: pack.source_manifest_checkpoint_doc_sha256,
    evidence_summary: cloneJson(pack.evidence_summary),
    evidence_items: cloneJson(pack.evidence_items),
    runtime_access: cloneJson(pack.runtime_access),
    export_boundary: cloneJson(pack.export_boundary),
    policy_verification_summary: cloneJson(pack.policy_verification_summary),
    explicit_false_runtime_effects: cloneJson(pack.explicit_false_runtime_effects)
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_KIND,
    version: '1.0.0',
    export_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-EXPORT-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    export_scope: 'INTERNAL_RUNTIME_EXPORT_ONLY',
    export_format: 'CANONICAL_JSON_OBJECT',
    export_consumer: 'JOKER_C2',
    export_main_commit: 'd8c5e5f4326827ff5acc5c5bc9970a58b63fb66d',
    source_pack_main_commit: 'a505fc1054c710ddc9341c684bdff1be5c148613',
    source_pack_checkpoint_commit: 'd8c5e5f4326827ff5acc5c5bc9970a58b63fb66d',
    source_pack_checkpoint_doc_sha256: 'c3f45323fd7b7ab263b45f57f4959c8f7f49ed08da5e10843c88e0491f93037f',
    source_pack_sha256: pack.evidence_pack_sha256,
    source_pack_id: pack.evidence_pack_id,
    export_payload_sha256: sha256Hex(exportPayload),
    export_payload: exportPayload,
    export_ready: true,
    fail_closed_source_pack_required: true,
    public_registry_mutated: false,
    external_trust_registry_mutated: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_export_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE.EXPORTED,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_EXPORTED',
    evidence_pack_export: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE,
  createExternalReviewCandidateEvidencePackExport
};
