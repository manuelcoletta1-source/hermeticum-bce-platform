'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE,
  createExternalReviewCandidateEvidencePackIntegrationIndex
} = require('./create-external-review-candidate-evidence-pack-integration-index');

const {
  RESULT,
  resolveAuthority
} = require('../authority/resolve-authority');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_PROTO =
  'hbce.external_review_candidate.evidence_pack_capability_binding.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE = Object.freeze({
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

function createCapabilityBindingFixtures(sourceIndex, currentTime) {
  const targetRef = sourceIndex.index_id;
  const actionClass = 'READ_EVIDENCE_PACK_INTEGRATION_INDEX';
  const iospaceRef = 'HBCE_INTERNAL_RUNTIME';

  const mandate = {
    mandate_id: 'MND-HBCE-EXT-REVIEW-EVIDENCE-PACK-INTERNAL-RUNTIME-2026-09-23',
    mandate_version: 1,
    principal_ref: 'HBCE_INTERNAL_RUNTIME',
    actor_ref: 'JOKER_C2',
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null
  };

  const capability = {
    capability_id: 'CAP-HBCE-EXT-REVIEW-EVIDENCE-PACK-INTEGRATION-INDEX-2026-09-23',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: sourceIndex.evidence_pack_integration_index_sha256
  };

  const authority = {
    authority_id: 'AUT-HBCE-EXT-REVIEW-EVIDENCE-PACK-INTEGRATION-INDEX-READ-2026-09-23',
    authority_version: 1,
    principal_ref: mandate.principal_ref,
    actor_ref: mandate.actor_ref,
    mandate_ref: mandate.mandate_id,
    mandate_version: mandate.mandate_version,
    capability_ref: capability.capability_id,
    capability_version: capability.capability_version,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: sourceIndex.evidence_pack_integration_index_sha256,
    scope: {
      action_classes: [actionClass],
      target_refs: [targetRef],
      iospace_refs: [iospaceRef],
      constraint_refs: []
    },
    limits: {
      policy_refs: [],
      quantitative_limit_refs: [],
      condition_refs: []
    }
  };

  const request = {
    action_class: actionClass,
    target_ref: targetRef,
    iospace_ref: iospaceRef
  };

  return {
    authority,
    mandate,
    capability,
    request,
    currentTime
  };
}

function createExternalReviewCandidateEvidencePackCapabilityBinding(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T13:45:00.000Z';
  const currentTime = input.current_time || '2026-09-23T13:45:00.000Z';
  const indexGeneratedAt = input.index_generated_at || '2026-09-23T13:30:00.000Z';
  const surfaceGeneratedAt = input.surface_generated_at || '2026-09-23T13:15:00.000Z';
  const exportGeneratedAt = input.export_generated_at || '2026-09-23T13:00:00.000Z';
  const packGeneratedAt = input.pack_generated_at || '2026-09-23T12:45:00.000Z';
  const manifestGeneratedAt = input.manifest_generated_at || '2026-09-23T12:30:00.000Z';

  if (!isIsoUtcMillis(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoUtcMillis(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_CURRENT_TIME_INVALID'
    };
  }

  const indexResult = createExternalReviewCandidateEvidencePackIntegrationIndex({
    generated_at: indexGeneratedAt,
    surface_generated_at: surfaceGeneratedAt,
    export_generated_at: exportGeneratedAt,
    pack_generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (indexResult.state !== HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE.READY) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_SOURCE_INDEX_BLOCKED'
    };
  }

  const sourceIndex = indexResult.evidence_pack_integration_index;
  const fixtures = createCapabilityBindingFixtures(sourceIndex, currentTime);
  const authorityResolution = resolveAuthority(fixtures);

  if (authorityResolution.state !== RESULT.VALID) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_AUTHORITY_INVALID',
      authority_resolution: authorityResolution
    };
  }

  const capabilityBindingPayload = {
    source_index_id: sourceIndex.index_id,
    source_index_sha256: sourceIndex.evidence_pack_integration_index_sha256,
    source_index_payload_sha256: sourceIndex.integration_payload_sha256,
    source_surface_sha256: sourceIndex.source_surface_sha256,
    source_surface_payload_sha256: sourceIndex.source_surface_payload_sha256,
    authority: cloneJson(fixtures.authority),
    mandate: cloneJson(fixtures.mandate),
    capability: cloneJson(fixtures.capability),
    request: cloneJson(fixtures.request),
    current_time: currentTime,
    authority_resolution: cloneJson(authorityResolution),
    active_runtime_entrypoint: cloneJson(sourceIndex.active_runtime_entrypoint),
    stable_access_contract: cloneJson(sourceIndex.integration_payload.stable_access_contract)
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_KIND,
    version: '1.0.0',
    binding_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-CAPABILITY-BINDING-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    binding_scope: 'INTERNAL_RUNTIME_CAPABILITY_BINDING_ONLY',
    binding_consumer: 'JOKER_C2',
    binding_main_commit: 'd981cc93ca6dd7b1f226539c49d66902629f8f1a',
    source_index_main_commit: '390e5958ed606c8ffc3e1d287f9ed3b472869aec',
    source_index_checkpoint_commit: 'd981cc93ca6dd7b1f226539c49d66902629f8f1a',
    source_index_checkpoint_doc_sha256: 'b440bcba9a79978a9a06360e5c3f36be38d1d4711222f84d4aa27df3926ee403',
    source_index_sha256: sourceIndex.evidence_pack_integration_index_sha256,
    source_index_payload_sha256: sourceIndex.integration_payload_sha256,
    capability_binding_payload_sha256: sha256Hex(capabilityBindingPayload),
    capability_binding_payload: capabilityBindingPayload,
    authority_resolution_state: authorityResolution.state,
    authority_resolution_reason: authorityResolution.reason,
    binding_ready: true,
    grants_authorization: false,
    executes_runtime_action: false,
    mutates_runtime_state: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_capability_binding_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_READY',
    evidence_pack_capability_binding: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE,
  createExternalReviewCandidateEvidencePackCapabilityBinding
};
