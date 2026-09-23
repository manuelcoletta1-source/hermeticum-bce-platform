'use strict';

const crypto = require('crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-event');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_audit_manifest.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_AUDIT_EVENT_SHA256 =
  '9a8e78fe149706f82814dc55e2351ea79cbd3a57cbeb14c10fbe258fb521d6ce';

const EXPECTED_SOURCE_AUDIT_EVENT_PAYLOAD_SHA256 =
  '14c162869eeb3260c487e230101afef9be21ae0ffbb66ebd718a07e4b834a3c1';

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

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T16:15:00.000Z';
  const currentTime = input.current_time || '2026-09-23T16:15:00.000Z';

  if (!isIsoDateTime(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoDateTime(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_CURRENT_TIME_INVALID'
    };
  }

  const sourceAuditEventResult = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent(
    input.source_audit_event_input || {
      generated_at: '2026-09-23T16:00:00.000Z',
      current_time: '2026-09-23T16:00:00.000Z'
    }
  );

  if (
    sourceAuditEventResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_BLOCKED',
      source_audit_event_result: cloneJson(sourceAuditEventResult)
    };
  }

  const sourceAuditEvent =
    sourceAuditEventResult.evidence_pack_runtime_read_access_decision_audit_event;

  if (
    sourceAuditEvent.evidence_pack_runtime_read_access_decision_audit_event_sha256 !== EXPECTED_SOURCE_AUDIT_EVENT_SHA256 ||
    sourceAuditEvent.audit_event_payload_sha256 !== EXPECTED_SOURCE_AUDIT_EVENT_PAYLOAD_SHA256
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_HASH_MISMATCH'
    };
  }

  if (
    sourceAuditEvent.access_granted !== false ||
    sourceAuditEvent.grants_authorization !== false ||
    sourceAuditEvent.creates_authorization_artifact !== false ||
    sourceAuditEvent.executes_runtime_action !== false ||
    sourceAuditEvent.creates_dispatch !== false ||
    sourceAuditEvent.mutates_runtime_state !== false ||
    sourceAuditEvent.runtime_audit_log_mutated !== false ||
    sourceAuditEvent.external_audit_log_mutated !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_NOT_OBSERVE_ONLY'
    };
  }

  const manifestEntries = [
    {
      entry_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-AUDIT-MANIFEST-ENTRY-001',
      entry_name: 'Runtime Read Access Decision Audit Event',
      entry_type: 'SOURCE_AUDIT_EVENT',
      entry_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-event.js',
      entry_sha256: sourceAuditEvent.evidence_pack_runtime_read_access_decision_audit_event_sha256,
      entry_payload_sha256: sourceAuditEvent.audit_event_payload_sha256,
      entry_scope: sourceAuditEvent.audit_event_scope,
      entry_category: sourceAuditEvent.audit_event_category,
      entry_subcategory: sourceAuditEvent.audit_event_subcategory,
      entry_ready: sourceAuditEvent.audit_event_ready,
      entry_observe_only: true,
      entry_access_granted: sourceAuditEvent.access_granted,
      entry_authorization_state: sourceAuditEvent.authorization_state,
      entry_policy_decision: sourceAuditEvent.policy_decision
    },
    {
      entry_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-AUDIT-MANIFEST-ENTRY-002',
      entry_name: 'Source Boundary Snapshot',
      entry_type: 'SOURCE_BOUNDARY_SNAPSHOT',
      entry_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-boundary.js',
      entry_sha256: sourceAuditEvent.source_boundary_sha256,
      entry_payload_sha256: sourceAuditEvent.source_access_decision_payload_sha256,
      entry_scope: 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_ONLY',
      entry_ready: true,
      entry_observe_only: true,
      entry_access_granted: false,
      entry_authorization_state: sourceAuditEvent.authorization_state,
      entry_policy_decision: sourceAuditEvent.policy_decision
    }
  ];

  const auditManifestPayload = {
    source_audit_event_id: sourceAuditEvent.audit_event_id,
    source_audit_event_sha256: sourceAuditEvent.evidence_pack_runtime_read_access_decision_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditEvent.audit_event_payload_sha256,
    source_audit_event_scope: sourceAuditEvent.audit_event_scope,
    source_audit_event_consumer: sourceAuditEvent.audit_event_consumer,
    source_audit_event_category: sourceAuditEvent.audit_event_category,
    source_audit_event_subcategory: sourceAuditEvent.audit_event_subcategory,
    source_audit_event_ready: sourceAuditEvent.audit_event_ready,
    source_audit_event_observe_only: true,
    source_runtime_audit_log_mutated: sourceAuditEvent.runtime_audit_log_mutated,
    source_external_audit_log_mutated: sourceAuditEvent.external_audit_log_mutated,
    source_access_granted: sourceAuditEvent.access_granted,
    source_grants_authorization: sourceAuditEvent.grants_authorization,
    source_creates_authorization_artifact: sourceAuditEvent.creates_authorization_artifact,
    source_executes_runtime_action: sourceAuditEvent.executes_runtime_action,
    source_creates_dispatch: sourceAuditEvent.creates_dispatch,
    source_mutates_runtime_state: sourceAuditEvent.mutates_runtime_state,
    source_authority_resolution_state: sourceAuditEvent.authority_resolution_state,
    source_policy_decision: sourceAuditEvent.policy_decision,
    source_authorization_state: sourceAuditEvent.authorization_state,
    source_positive_allow_probe_authorization_state: sourceAuditEvent.positive_allow_probe_authorization_state,
    manifest_entries: manifestEntries,
    manifest_entry_count: manifestEntries.length,
    manifest_classification: {
      category: 'AUDIT_MANIFEST',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST',
      manifest_type: 'CANONICAL_AUDIT_EVENT_MANIFEST',
      decision_effect: 'OBSERVE_ONLY',
      authority_effect: 'NONE',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      runtime_mutation_effect: 'NONE',
      audit_log_append_effect: 'NONE'
    },
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      runtime_read_access_decision_audit_manifest_only: true,
      manifests_runtime_read_access_decision_audit_event: true,
      source_audit_event_hash_bound: true,
      manifest_entries_satisfied: true,
      observe_only_manifest_semantics: true,
      no_runtime_audit_log_append_side_effect: true,
      audit_manifest_does_not_authorize: true,
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
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_KIND,
    audit_manifest_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-AUDIT-MANIFEST-2026-09-23',
    generated_at: generatedAt,
    current_time: currentTime,
    audit_manifest_main_commit: '3e2bf50a40c6a77494f02b6b21fd45064d05badb',
    source_audit_event_feature_commit: 'f0ed0a1ec260a470162cd4c54d480dc810c8a876',
    source_audit_event_merge_commit: '906242e94cc3483d0083deda9477f8c425758e94',
    source_audit_event_checkpoint_commit: '292f7bd00ec6e83b076e3c30bf18af2d3c8598f6',
    source_final_chain_audit_commit: '3e2bf50a40c6a77494f02b6b21fd45064d05badb',
    source_audit_event_checkpoint_doc_sha256: 'dbf4885d49602d631bcf7b529a7668246612a3092651e0fb2c7084af4c41fe74',
    source_final_chain_audit_doc_sha256: 'bc44ec14e12c6950508bcafde71356d53e09e64d87beeade4bdf0a16a24f14c6',
    source_audit_event_sha256: sourceAuditEvent.evidence_pack_runtime_read_access_decision_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditEvent.audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditEvent.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceAuditEvent.source_access_decision_payload_sha256,
    audit_manifest_payload_sha256: sha256Hex(auditManifestPayload),
    audit_manifest_payload: auditManifestPayload,
    audit_manifest_ready: true,
    audit_manifest_scope: 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_ONLY',
    audit_manifest_consumer: 'JOKER_C2',
    audit_manifest_category: 'AUDIT_MANIFEST',
    audit_manifest_subcategory: 'RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST',
    manifests_access_decision_audit_event_only: true,
    manifest_entry_count: manifestEntries.length,
    manifest_entries_satisfied: true,
    observe_only_manifest_semantics: true,
    runtime_audit_log_mutated: false,
    external_audit_log_mutated: false,
    authority_resolution_state: sourceAuditEvent.authority_resolution_state,
    policy_decision: sourceAuditEvent.policy_decision,
    authorization_state: sourceAuditEvent.authorization_state,
    positive_allow_probe_authorization_state: sourceAuditEvent.positive_allow_probe_authorization_state,
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

  body.evidence_pack_runtime_read_access_decision_audit_manifest_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_READY',
    evidence_pack_runtime_read_access_decision_audit_manifest: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest
};
