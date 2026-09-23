'use strict';

const crypto = require('crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-boundary');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_audit_event.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_BOUNDARY_SHA256 =
  'c76d9015dd1eb70d3c6b8f0c62309855ef9b008ed3f6cb49612d3959a2dc57d8';

const EXPECTED_SOURCE_BOUNDARY_PAYLOAD_SHA256 =
  '171bc00f44608769d51e3fe892bf1b00ec98280ac00155a17eae135abe87787a';

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

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T16:00:00.000Z';
  const currentTime = input.current_time || '2026-09-23T16:00:00.000Z';

  if (!isIsoDateTime(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoDateTime(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_CURRENT_TIME_INVALID'
    };
  }

  const sourceBoundaryResult = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary(
    input.source_boundary_input || {
      generated_at: '2026-09-23T15:45:00.000Z',
      current_time: '2026-09-23T15:45:00.000Z'
    }
  );

  if (
    sourceBoundaryResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_BLOCKED',
      source_boundary_result: cloneJson(sourceBoundaryResult)
    };
  }

  const sourceBoundary = sourceBoundaryResult.evidence_pack_runtime_read_access_decision_boundary;

  if (
    sourceBoundary.evidence_pack_runtime_read_access_decision_boundary_sha256 !== EXPECTED_SOURCE_BOUNDARY_SHA256 ||
    sourceBoundary.access_decision_payload_sha256 !== EXPECTED_SOURCE_BOUNDARY_PAYLOAD_SHA256
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_HASH_MISMATCH'
    };
  }

  if (
    sourceBoundary.access_granted !== false ||
    sourceBoundary.grants_authorization !== false ||
    sourceBoundary.creates_authorization_artifact !== false ||
    sourceBoundary.executes_runtime_action !== false ||
    sourceBoundary.creates_dispatch !== false ||
    sourceBoundary.mutates_runtime_state !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_NOT_FAIL_CLOSED'
    };
  }

  const auditEventPayload = {
    source_boundary_id: sourceBoundary.boundary_id,
    source_boundary_sha256: sourceBoundary.evidence_pack_runtime_read_access_decision_boundary_sha256,
    source_access_decision_payload_sha256: sourceBoundary.access_decision_payload_sha256,
    source_boundary_scope: sourceBoundary.boundary_scope,
    source_boundary_consumer: sourceBoundary.boundary_consumer,
    source_boundary_ready: sourceBoundary.boundary_ready,
    source_boundary_access_granted: sourceBoundary.access_granted,
    source_boundary_grants_authorization: sourceBoundary.grants_authorization,
    source_boundary_creates_authorization_artifact: sourceBoundary.creates_authorization_artifact,
    source_boundary_executes_runtime_action: sourceBoundary.executes_runtime_action,
    source_boundary_creates_dispatch: sourceBoundary.creates_dispatch,
    source_boundary_mutates_runtime_state: sourceBoundary.mutates_runtime_state,
    source_authority_resolution_state: sourceBoundary.authority_resolution_state,
    source_authority_resolution_reason: sourceBoundary.authority_resolution_reason,
    source_policy_decision: sourceBoundary.policy_decision,
    source_policy_decision_reason: sourceBoundary.policy_decision_reason,
    source_authorization_state: sourceBoundary.authorization_state,
    source_authorization_reason: sourceBoundary.authorization_reason,
    source_positive_allow_probe_authorization_state: sourceBoundary.positive_allow_probe_authorization_state,
    source_positive_allow_probe_authorization_reason: sourceBoundary.positive_allow_probe_authorization_reason,
    source_access_decision_payload: cloneJson(sourceBoundary.access_decision_payload),
    audit_event_classification: {
      category: 'AUDIT_OBSERVABILITY',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT',
      event_type: 'CANONICAL_AUDIT_RECORD',
      decision_effect: 'OBSERVE_ONLY',
      authority_effect: 'NONE',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      runtime_mutation_effect: 'NONE'
    },
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      runtime_read_access_decision_audit_event_only: true,
      binds_runtime_read_access_decision_boundary: true,
      immutable_source_boundary_hash_binding: true,
      append_only_audit_event_semantics: true,
      no_runtime_audit_log_append_side_effect: true,
      audit_event_does_not_authorize: true,
      valid_authority_does_not_authorize: true,
      policy_allow_probe_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutation: true
    }
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_KIND,
    audit_event_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-AUDIT-EVENT-2026-09-23',
    generated_at: generatedAt,
    current_time: currentTime,
    audit_event_main_commit: '0f88cb0ae004d1223b84bcd0ce92467cf0310d29',
    source_boundary_feature_commit: '1270849865c5b85de01f95845a1c9da6f60461bb',
    source_boundary_merge_commit: 'ece89dd10a3db414a53ba343c243997c610e2958',
    source_boundary_checkpoint_commit: '42be617efe5f566ef2fdd2f6916480d06444696b',
    source_final_chain_audit_commit: '0f88cb0ae004d1223b84bcd0ce92467cf0310d29',
    source_boundary_checkpoint_doc_sha256: '72e3a613cfff3b2492d9ab8eedfb3311707de16b835e4c5380a47c70ad53365d',
    source_final_chain_audit_doc_sha256: '384a1a1e12db81d29e24c7f64c247f9453c866f7bad049a88cb79e6f35656fff',
    source_boundary_sha256: sourceBoundary.evidence_pack_runtime_read_access_decision_boundary_sha256,
    source_access_decision_payload_sha256: sourceBoundary.access_decision_payload_sha256,
    audit_event_payload_sha256: sha256Hex(auditEventPayload),
    audit_event_payload: auditEventPayload,
    audit_event_ready: true,
    audit_event_scope: 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_ONLY',
    audit_event_consumer: 'JOKER_C2',
    audit_event_category: 'AUDIT_OBSERVABILITY',
    audit_event_subcategory: 'RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT',
    records_access_decision_boundary_only: true,
    append_only_audit_event_semantics: true,
    runtime_audit_log_mutated: false,
    external_audit_log_mutated: false,
    authority_resolution_state: sourceBoundary.authority_resolution_state,
    policy_decision: sourceBoundary.policy_decision,
    authorization_state: sourceBoundary.authorization_state,
    positive_allow_probe_authorization_state: sourceBoundary.positive_allow_probe_authorization_state,
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

  body.evidence_pack_runtime_read_access_decision_audit_event_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_READY',
    evidence_pack_runtime_read_access_decision_audit_event: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent
};
