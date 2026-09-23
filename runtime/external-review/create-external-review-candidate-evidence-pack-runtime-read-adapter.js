'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE,
  createExternalReviewCandidateEvidencePackAccessDecisionBoundary
} = require('./create-external-review-candidate-evidence-pack-access-decision-boundary');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_adapter.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_BOUNDARY_SHA =
  'ed2c2707286499622bcc5465012aaf2558eb520abf484f15e86463c3ddcf6003';

const EXPECTED_SOURCE_BOUNDARY_PAYLOAD_SHA =
  'ad5e7fe4616baddff429f7e246dd6b739a5042f9e78aa5f3a74f81075415aa53';

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

function createExternalReviewCandidateEvidencePackRuntimeReadAdapter(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T14:15:00.000Z';
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
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_GENERATED_AT_INVALID'
    };
  }

  const boundaryResult = createExternalReviewCandidateEvidencePackAccessDecisionBoundary({
    generated_at: boundaryGeneratedAt,
    current_time: boundaryCurrentTime,
    binding_generated_at: bindingGeneratedAt,
    binding_current_time: bindingCurrentTime,
    index_generated_at: indexGeneratedAt,
    surface_generated_at: surfaceGeneratedAt,
    export_generated_at: exportGeneratedAt,
    pack_generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (
    boundaryResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_SOURCE_BOUNDARY_BLOCKED'
    };
  }

  const sourceBoundary = boundaryResult.evidence_pack_access_decision_boundary;

  if (
    sourceBoundary.evidence_pack_access_decision_boundary_sha256 !== EXPECTED_SOURCE_BOUNDARY_SHA ||
    sourceBoundary.access_decision_payload_sha256 !== EXPECTED_SOURCE_BOUNDARY_PAYLOAD_SHA
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_SOURCE_BOUNDARY_HASH_MISMATCH'
    };
  }

  if (
    sourceBoundary.authorization_state !== 'UNRESOLVED' ||
    sourceBoundary.access_granted !== false ||
    sourceBoundary.grants_authorization !== false ||
    sourceBoundary.executes_runtime_action !== false ||
    sourceBoundary.creates_dispatch !== false ||
    sourceBoundary.mutates_runtime_state !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_SOURCE_BOUNDARY_NOT_FAIL_CLOSED'
    };
  }

  const readAdapterPayload = {
    source_boundary_id: sourceBoundary.boundary_id,
    source_boundary_sha256: sourceBoundary.evidence_pack_access_decision_boundary_sha256,
    source_boundary_payload_sha256: sourceBoundary.access_decision_payload_sha256,
    read_request: {
      request_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-REQUEST-2026-09-23',
      requested_at: generatedAt,
      requested_by: 'JOKER_C2',
      requested_action: 'READ_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY',
      requested_scope: 'INTERNAL_RUNTIME_READ_ONLY'
    },
    read_projection: {
      projection_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-PROJECTION-2026-09-23',
      projection_type: 'BOUNDARY_READ_ONLY_PROJECTION',
      chain: [
        'Evidence Chain Manifest',
        'Evidence Pack',
        'Evidence Pack Export',
        'Evidence Pack Export Surface',
        'Evidence Pack Integration Index',
        'Evidence Pack Capability Binding',
        'Evidence Pack Access Decision Boundary'
      ],
      authority_resolution_state: sourceBoundary.authority_resolution_state,
      policy_decision: sourceBoundary.policy_decision,
      authorization_state: sourceBoundary.authorization_state,
      positive_allow_probe_authorization_state: sourceBoundary.positive_allow_probe_authorization_state,
      access_granted: sourceBoundary.access_granted,
      source_boundary_summary: {
        boundary_scope: sourceBoundary.boundary_scope,
        boundary_consumer: sourceBoundary.boundary_consumer,
        policy_decision_reason: sourceBoundary.policy_decision_reason,
        authorization_reason: sourceBoundary.authorization_reason,
        positive_allow_probe_authorization_reason: sourceBoundary.positive_allow_probe_authorization_reason
      }
    },
    read_contract: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      read_only_adapter: true,
      returns_internal_runtime_view: true,
      fail_closed_source_boundary_required: true,
      valid_authority_does_not_authorize: true,
      policy_allow_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      does_not_create_authorization: true,
      does_not_execute_action: true,
      does_not_dispatch: true,
      does_not_mutate_state: true
    },
    source_boundary_access_decision_payload: cloneJson(sourceBoundary.access_decision_payload)
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_KIND,
    version: '1.0.0',
    adapter_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ADAPTER-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    adapter_scope: 'INTERNAL_RUNTIME_READ_ADAPTER_ONLY',
    adapter_consumer: 'JOKER_C2',
    adapter_main_commit: 'ef9d54b7d90aaefa2753e6f15a55e7edddc7c56c',
    source_boundary_merge_commit: '0efe5bab789a5f310229d907eca4c6623aa901f9',
    source_boundary_checkpoint_commit: '8e5325184aa70186fb50ad99a338566213857990',
    source_final_chain_audit_commit: 'ef9d54b7d90aaefa2753e6f15a55e7edddc7c56c',
    source_boundary_checkpoint_doc_sha256: 'ff0aac5c359056ef6cfabd0743725af244d7ecdc0323369869614ec051311cff',
    source_final_chain_audit_doc_sha256: '8c20940aafd1f976f3f149535d772ac0109308461d55ffd554527f956e7b6fa1',
    source_boundary_sha256: sourceBoundary.evidence_pack_access_decision_boundary_sha256,
    source_boundary_payload_sha256: sourceBoundary.access_decision_payload_sha256,
    runtime_entrypoint: {
      module_path: 'runtime/external-review/create-external-review-candidate-evidence-pack-access-decision-boundary.js',
      function_name: 'createExternalReviewCandidateEvidencePackAccessDecisionBoundary',
      default_boundary_generated_at: '2026-09-23T14:00:00.000Z',
      default_boundary_current_time: '2026-09-23T14:00:00.000Z'
    },
    read_adapter_payload_sha256: sha256Hex(readAdapterPayload),
    read_adapter_payload: readAdapterPayload,
    read_adapter_ready: true,
    read_model_available: true,
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

  body.evidence_pack_runtime_read_adapter_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_READY',
    evidence_pack_runtime_read_adapter: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAdapter
};
