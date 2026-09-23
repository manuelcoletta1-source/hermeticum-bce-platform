'use strict';

const crypto = require('crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding
} = require('./create-external-review-candidate-evidence-pack-runtime-read-capability-binding');

const {
  evaluatePolicy,
  DECISION
} = require('../opc/evaluate-policy');

const {
  resolveAuthorization,
  STATE: AUTHORIZATION_STATE
} = require('../authorization/resolve-authorization');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_boundary.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_BINDING_SHA256 =
  '649f326a533fef51f25f6c48733f740fea5804e07a292ee34731f5cfdeaba9c7';

const EXPECTED_SOURCE_BINDING_PAYLOAD_SHA256 =
  '8a43a7b7294554381589bd97862f88c0fafa27be5244dd9ef6c8334973b3a127';

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function assertCanonicalValue(value, path = '$') {
  if (value === null) {
    return;
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return;
  }

  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new TypeError(`Non-canonical number at ${path}`);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) {
        throw new TypeError(`Sparse array at ${path}`);
      }
      assertCanonicalValue(value[index], `${path}[${index}]`);
    }
    return;
  }

  if (isPlainObject(value)) {
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') {
        throw new TypeError(`Non-string key at ${path}`);
      }
      assertCanonicalValue(value[key], `${path}.${key}`);
    }
    return;
  }

  throw new TypeError(`Unsupported canonical value at ${path}`);
}

function stableStringify(value) {
  assertCanonicalValue(value);

  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
}

function sha256Hex(value) {
  return crypto
    .createHash('sha256')
    .update(stableStringify(value))
    .digest('hex');
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function isIsoDateTime(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.000Z$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T15:45:00.000Z';
  const currentTime = input.current_time || '2026-09-23T15:45:00.000Z';

  if (!isIsoDateTime(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoDateTime(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_CURRENT_TIME_INVALID'
    };
  }

  const sourceBindingResult = createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding(
    input.source_binding_input || {
      generated_at: '2026-09-23T15:00:00.000Z',
      current_time: '2026-09-23T15:00:00.000Z'
    }
  );

  if (
    sourceBindingResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_BLOCKED',
      source_binding_result: cloneJson(sourceBindingResult)
    };
  }

  const sourceBinding = sourceBindingResult.evidence_pack_runtime_read_capability_binding;

  if (
    sourceBinding.evidence_pack_runtime_read_capability_binding_sha256 !== EXPECTED_SOURCE_BINDING_SHA256 ||
    sourceBinding.capability_binding_payload_sha256 !== EXPECTED_SOURCE_BINDING_PAYLOAD_SHA256
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_HASH_MISMATCH'
    };
  }

  if (
    sourceBinding.access_granted !== false ||
    sourceBinding.grants_authorization !== false ||
    sourceBinding.creates_authorization_artifact !== false ||
    sourceBinding.executes_runtime_action !== false ||
    sourceBinding.creates_dispatch !== false ||
    sourceBinding.mutates_runtime_state !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_NOT_READ_ONLY'
    };
  }

  const authorityResolution = sourceBinding.capability_binding_payload.authority_resolution;

  const policyDecision = evaluatePolicy({
    authorityResolution,
    authority_resolution: authorityResolution
  });

  const authorizationResolution = resolveAuthorization({
    policyDecision
  });

  const positiveAllowProbeAuthorizationResolution = resolveAuthorization({
    policyDecision: {
      decision: DECISION.ALLOW,
      reason: 'POSITIVE_ALLOW_PROBE'
    }
  });

  if (authorizationResolution.state !== AUTHORIZATION_STATE.UNRESOLVED) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_AUTHORIZATION_NOT_FAIL_CLOSED',
      authorization_resolution: cloneJson(authorizationResolution)
    };
  }

  if (positiveAllowProbeAuthorizationResolution.state !== AUTHORIZATION_STATE.UNRESOLVED) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_ALLOW_PROBE_NOT_FAIL_CLOSED',
      authorization_resolution: cloneJson(positiveAllowProbeAuthorizationResolution)
    };
  }

  const accessDecisionPayload = {
    source_binding_id: sourceBinding.binding_id,
    source_binding_sha256: sourceBinding.evidence_pack_runtime_read_capability_binding_sha256,
    source_binding_payload_sha256: sourceBinding.capability_binding_payload_sha256,
    source_binding_scope: sourceBinding.binding_scope,
    source_binding_consumer: sourceBinding.binding_consumer,
    source_binding_ready: sourceBinding.binding_ready,
    source_binding_read_only: sourceBinding.read_capability_binding_only,
    source_binding_access_granted: sourceBinding.access_granted,
    source_binding_grants_authorization: sourceBinding.grants_authorization,
    source_binding_creates_authorization_artifact: sourceBinding.creates_authorization_artifact,
    source_binding_executes_runtime_action: sourceBinding.executes_runtime_action,
    source_binding_creates_dispatch: sourceBinding.creates_dispatch,
    source_binding_mutates_runtime_state: sourceBinding.mutates_runtime_state,
    source_authority_resolution: cloneJson(authorityResolution),
    source_fail_closed_view: cloneJson(sourceBinding.capability_binding_payload.source_fail_closed_view),
    policy_decision: cloneJson(policyDecision),
    authorization_resolution: cloneJson(authorizationResolution),
    positive_allow_probe_authorization_resolution: cloneJson(positiveAllowProbeAuthorizationResolution),
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      runtime_read_access_decision_boundary_only: true,
      binds_runtime_read_capability_binding: true,
      fail_closed_source_binding_required: true,
      valid_authority_does_not_authorize: true,
      policy_allow_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutation: true
    }
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_KIND,
    boundary_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-BOUNDARY-2026-09-23',
    generated_at: generatedAt,
    current_time: currentTime,
    boundary_main_commit: 'f70973728ad4532569b7ecfa23d2bc4d3407eaad',
    source_binding_feature_commit: 'a207f426ac560cfd517cf7801b9657123df180da',
    source_binding_merge_commit: '49c9c3bba112bb7272898430828a82ed2f1bde8c',
    source_binding_checkpoint_commit: '83e5146fb0f4549a1efbc14f5be6be9a6666e031',
    source_final_chain_audit_commit: 'f70973728ad4532569b7ecfa23d2bc4d3407eaad',
    source_binding_checkpoint_doc_sha256: 'a3acf4fc70dfabd3dfecc9d07d91c4f939248f9d6eb8210c04f274277ecfb8e1',
    source_final_chain_audit_doc_sha256: '3a415132f3fda24ea3d3c68827915a60393760974750d5892e1196bb30c5981f',
    source_binding_sha256: sourceBinding.evidence_pack_runtime_read_capability_binding_sha256,
    source_binding_payload_sha256: sourceBinding.capability_binding_payload_sha256,
    access_decision_payload_sha256: sha256Hex(accessDecisionPayload),
    access_decision_payload: accessDecisionPayload,
    authority_resolution_state: authorityResolution.state,
    authority_resolution_reason: authorityResolution.reason,
    policy_decision: policyDecision.decision,
    policy_decision_reason: policyDecision.reason,
    authorization_state: authorizationResolution.state,
    authorization_reason: authorizationResolution.reason,
    positive_allow_probe_authorization_state: positiveAllowProbeAuthorizationResolution.state,
    positive_allow_probe_authorization_reason: positiveAllowProbeAuthorizationResolution.reason,
    boundary_ready: true,
    runtime_read_access_decision_boundary_only: true,
    boundary_scope: 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_ONLY',
    boundary_consumer: 'JOKER_C2',
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

  body.evidence_pack_runtime_read_access_decision_boundary_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_READY',
    evidence_pack_runtime_read_access_decision_boundary: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary
};
