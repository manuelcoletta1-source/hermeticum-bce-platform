'use strict';

const { createHash } = require('node:crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE,
  createExternalReviewCandidateEvidencePackCapabilityBinding
} = require('./create-external-review-candidate-evidence-pack-capability-binding');

const {
  DECISION,
  evaluatePolicy
} = require('../opc/evaluate-policy');

const {
  STATE: AUTHORIZATION_STATE,
  resolveAuthorization
} = require('../authorization/resolve-authorization');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_PROTO =
  'hbce.external_review_candidate.evidence_pack_access_decision_boundary.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE = Object.freeze({
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

function createExternalReviewCandidateEvidencePackAccessDecisionBoundary(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T14:00:00.000Z';
  const currentTime = input.current_time || '2026-09-23T14:00:00.000Z';
  const bindingGeneratedAt = input.binding_generated_at || '2026-09-23T13:45:00.000Z';
  const bindingCurrentTime = input.binding_current_time || '2026-09-23T13:45:00.000Z';
  const indexGeneratedAt = input.index_generated_at || '2026-09-23T13:30:00.000Z';
  const surfaceGeneratedAt = input.surface_generated_at || '2026-09-23T13:15:00.000Z';
  const exportGeneratedAt = input.export_generated_at || '2026-09-23T13:00:00.000Z';
  const packGeneratedAt = input.pack_generated_at || '2026-09-23T12:45:00.000Z';
  const manifestGeneratedAt = input.manifest_generated_at || '2026-09-23T12:30:00.000Z';

  if (!isIsoUtcMillis(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoUtcMillis(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_CURRENT_TIME_INVALID'
    };
  }

  if (!isIsoUtcMillis(bindingCurrentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_BINDING_CURRENT_TIME_INVALID'
    };
  }

  const bindingResult = createExternalReviewCandidateEvidencePackCapabilityBinding({
    generated_at: bindingGeneratedAt,
    current_time: bindingCurrentTime,
    index_generated_at: indexGeneratedAt,
    surface_generated_at: surfaceGeneratedAt,
    export_generated_at: exportGeneratedAt,
    pack_generated_at: packGeneratedAt,
    manifest_generated_at: manifestGeneratedAt
  });

  if (bindingResult.state !== HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.READY) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_BLOCKED'
    };
  }

  const sourceBinding = bindingResult.evidence_pack_capability_binding;
  const authorityResolution = sourceBinding.capability_binding_payload.authority_resolution;

  const policyDecision = evaluatePolicy({
    authorityResolution,
    policyEvaluation: input.policy_evaluation || null
  });

  const authorizationResolution = resolveAuthorization({
    policyDecision
  });

  const positiveAllowProbeAuthorizationResolution = resolveAuthorization({
    policyDecision: {
      decision: DECISION.ALLOW,
      reason: 'POLICY_ALLOW_PROBE'
    }
  });

  if (authorizationResolution.state !== AUTHORIZATION_STATE.UNRESOLVED) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_AUTHORIZATION_NOT_FAIL_CLOSED',
      authorization_resolution: authorizationResolution
    };
  }

  if (positiveAllowProbeAuthorizationResolution.state !== AUTHORIZATION_STATE.UNRESOLVED) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_ALLOW_PROBE_NOT_FAIL_CLOSED',
      authorization_resolution: positiveAllowProbeAuthorizationResolution
    };
  }

  const accessDecisionPayload = {
    source_binding_id: sourceBinding.binding_id,
    source_binding_sha256: sourceBinding.evidence_pack_capability_binding_sha256,
    source_binding_payload_sha256: sourceBinding.capability_binding_payload_sha256,
    source_index_sha256: sourceBinding.source_index_sha256,
    source_index_payload_sha256: sourceBinding.source_index_payload_sha256,
    authority_resolution: cloneJson(authorityResolution),
    policy_decision: cloneJson(policyDecision),
    authorization_resolution: cloneJson(authorizationResolution),
    positive_allow_probe_authorization_resolution: cloneJson(positiveAllowProbeAuthorizationResolution),
    boundary_current_time: currentTime,
    binding_current_time: bindingCurrentTime,
    access_subject: {
      principal_ref: sourceBinding.capability_binding_payload.authority.principal_ref,
      actor_ref: sourceBinding.capability_binding_payload.authority.actor_ref,
      action_class: sourceBinding.capability_binding_payload.request.action_class,
      target_ref: sourceBinding.capability_binding_payload.request.target_ref,
      iospace_ref: sourceBinding.capability_binding_payload.request.iospace_ref
    },
    boundary_assertions: {
      valid_authority_does_not_authorize: true,
      policy_allow_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_runtime_action_executed: true,
      no_dispatch_created: true,
      no_state_mutated: true
    }
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_KIND,
    version: '1.0.0',
    boundary_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-ACCESS-DECISION-BOUNDARY-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    boundary_scope: 'INTERNAL_RUNTIME_ACCESS_DECISION_BOUNDARY_ONLY',
    boundary_consumer: 'JOKER_C2',
    boundary_main_commit: 'c834a5c2c7a9f42b5b964ecc4657bcd17b117a3e',
    source_binding_main_commit: '36ea9a23b4a664d7e1e7afc641d44838cfbb1219',
    source_binding_checkpoint_commit: 'c834a5c2c7a9f42b5b964ecc4657bcd17b117a3e',
    source_binding_checkpoint_doc_sha256: 'affc4acb869f9fd6dcbdf8b6fc0d1c7c073aff382e9b36ffbf53f94e62e3ac12',
    source_binding_sha256: sourceBinding.evidence_pack_capability_binding_sha256,
    source_binding_payload_sha256: sourceBinding.capability_binding_payload_sha256,
    access_decision_payload_sha256: sha256Hex(accessDecisionPayload),
    access_decision_payload: accessDecisionPayload,
    authority_resolution_state: authorityResolution.state,
    policy_decision: policyDecision.decision,
    policy_decision_reason: policyDecision.reason,
    authorization_state: authorizationResolution.state,
    authorization_reason: authorizationResolution.reason,
    positive_allow_probe_authorization_state: positiveAllowProbeAuthorizationResolution.state,
    positive_allow_probe_authorization_reason: positiveAllowProbeAuthorizationResolution.reason,
    boundary_ready: true,
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

  body.evidence_pack_access_decision_boundary_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_READY',
    evidence_pack_access_decision_boundary: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE,
  createExternalReviewCandidateEvidencePackAccessDecisionBoundary
};
