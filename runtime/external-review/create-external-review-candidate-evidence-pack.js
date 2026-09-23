'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE,
  createExternalReviewCandidateEvidenceChainManifest
} = require('./create-external-review-candidate-evidence-chain-manifest');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_PROTO =
  'hbce.external_review_candidate.evidence_pack.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const PACK_FALSE_RUNTIME_EFFECTS = Object.freeze({
  external_reviewer_appointed: false,
  external_review_execution_created: false,
  external_review_opinion_created: false,
  external_review_report_created: false,
  external_review_submission_created: false,
  external_review_publication_created: false,
  external_submission_dispatched: false,
  external_submission_transmitted: false,
  external_submission_accepted: false,
  external_submission_acknowledged: false,
  external_submission_receipt_created: false,
  external_submission_receipt_acknowledged: false,
  external_archive_storage_created: false,
  legal_certification_created: false,
  eidas_qualification_created: false,
  opc_allow_created: false,
  deployment_success_proven: false,
  production_deployment_proven: false,
  public_registry_mutated: false,
  external_trust_registry_mutated: false
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

function createExternalReviewCandidateEvidencePack(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T00:00:00.000Z';
  const manifestGeneratedAt = input.manifest_generated_at || '2026-09-23T12:30:00.000Z';

  if (!isIsoUtcMillis(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoUtcMillis(manifestGeneratedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_MANIFEST_GENERATED_AT_INVALID'
    };
  }

  const manifestResult = createExternalReviewCandidateEvidenceChainManifest({
    generated_at: manifestGeneratedAt
  });

  if (manifestResult.state !== HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE.PREPARED) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_SOURCE_MANIFEST_BLOCKED'
    };
  }

  const manifest = manifestResult.evidence_chain_manifest;
  const layers = manifest.layers;
  const firstLayer = layers[0];
  const lastLayer = layers[layers.length - 1];

  const evidenceItems = layers.map((layer) => ({
    evidence_item_id: `HBCE-ERC-LAYER-PR-${layer.pr_number}`,
    layer_key: layer.layer_key,
    pr_number: layer.pr_number,
    state: layer.state,
    feature_commit: layer.feature_commit,
    merge_commit: layer.merge_commit,
    checkpoint_commit: layer.checkpoint_commit,
    checkpoint_doc_sha256: layer.checkpoint_doc_sha256,
    runtime_sha256: layer.runtime_sha256,
    test_sha256: layer.test_sha256,
    component_count: layer.component_count
  }));

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_KIND,
    version: '1.0.0',
    evidence_pack_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    pack_scope: 'INTERNAL_TECHNICAL_EVIDENCE_PACK_ONLY',
    packaging_main_commit: 'e0fbe6a9c781c23c06563e0a4fe61d31f8e316a3',
    source_manifest_main_commit: manifest.current_main_commit,
    source_manifest_sha256: manifest.evidence_chain_manifest_sha256,
    source_manifest_id: manifest.manifest_id,
    source_manifest_proto: manifest.proto,
    source_manifest_kind: manifest.kind,
    source_manifest_layer_count: manifest.layer_count,
    source_manifest_checkpoint_commit: 'e0fbe6a9c781c23c06563e0a4fe61d31f8e316a3',
    source_manifest_checkpoint_doc_sha256: '7b4a7229793477939007be7fceb272eb521c3b17b4d24084d72c5f818b436ab5',
    evidence_summary: {
      pr_number_start: firstLayer.pr_number,
      pr_number_end: lastLayer.pr_number,
      layer_count: layers.length,
      upstream_boundary_pr_number: manifest.upstream_boundary.pr_number,
      upstream_boundary_component_count: manifest.upstream_boundary.component_count,
      component_count_start: manifest.component_count_start,
      component_count_end: manifest.component_count_end,
      component_counts_strictly_increase: manifest.component_counts_strictly_increase,
      checkpoint_chain_complete: manifest.checkpoint_chain_complete,
      sha256_chain_complete: manifest.sha256_chain_complete
    },
    evidence_items: evidenceItems,
    evidence_item_count: evidenceItems.length,
    policy_verification_summary: cloneJson(manifest.policy_verification_summary),
    runtime_access: {
      joker_c2_consumable: true,
      human_review_readable: true,
      deterministic_sha256_bound: true,
      fail_closed_source_manifest_required: true
    },
    export_boundary: {
      internal_runtime_export_ready: true,
      external_submission_ready: false,
      external_publication_ready: false,
      legal_certification_ready: false,
      eidas_qualification_ready: false,
      opc_allow_ready: false
    },
    explicit_false_runtime_effects: cloneJson(PACK_FALSE_RUNTIME_EFFECTS),
    public_registry_mutated: false,
    external_trust_registry_mutated: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_READY',
    evidence_pack: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE,
  createExternalReviewCandidateEvidencePack
};
