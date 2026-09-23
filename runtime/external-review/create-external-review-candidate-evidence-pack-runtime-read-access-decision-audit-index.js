'use strict';

const crypto = require('crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-manifest');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_audit_index.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_AUDIT_MANIFEST_SHA256 =
  '214d524b3c871e5254d9a46acebaaa8ada429b649f800a4936e4df0d66b5d67c';

const EXPECTED_SOURCE_AUDIT_MANIFEST_PAYLOAD_SHA256 =
  'dc09fa37542cf125b42e7419d455e854db0ca4f7b62238a1287ca05ac76e736f';

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

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T16:30:00.000Z';
  const currentTime = input.current_time || '2026-09-23T16:30:00.000Z';

  if (!isIsoDateTime(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoDateTime(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_CURRENT_TIME_INVALID'
    };
  }

  const sourceAuditManifestResult = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest(
    input.source_audit_manifest_input || {
      generated_at: '2026-09-23T16:15:00.000Z',
      current_time: '2026-09-23T16:15:00.000Z'
    }
  );

  if (
    sourceAuditManifestResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_BLOCKED',
      source_audit_manifest_result: cloneJson(sourceAuditManifestResult)
    };
  }

  const sourceAuditManifest =
    sourceAuditManifestResult.evidence_pack_runtime_read_access_decision_audit_manifest;

  if (
    sourceAuditManifest.evidence_pack_runtime_read_access_decision_audit_manifest_sha256 !== EXPECTED_SOURCE_AUDIT_MANIFEST_SHA256 ||
    sourceAuditManifest.audit_manifest_payload_sha256 !== EXPECTED_SOURCE_AUDIT_MANIFEST_PAYLOAD_SHA256
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_HASH_MISMATCH'
    };
  }

  if (
    sourceAuditManifest.access_granted !== false ||
    sourceAuditManifest.grants_authorization !== false ||
    sourceAuditManifest.creates_authorization_artifact !== false ||
    sourceAuditManifest.executes_runtime_action !== false ||
    sourceAuditManifest.creates_dispatch !== false ||
    sourceAuditManifest.mutates_runtime_state !== false ||
    sourceAuditManifest.runtime_audit_log_mutated !== false ||
    sourceAuditManifest.external_audit_log_mutated !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_NOT_OBSERVE_ONLY'
    };
  }

  const sourcePayload = sourceAuditManifest.audit_manifest_payload;

  const indexEntries = [
    {
      entry_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-AUDIT-INDEX-ENTRY-001',
      entry_name: 'Runtime Read Access Decision Audit Manifest',
      entry_type: 'SOURCE_AUDIT_MANIFEST',
      entry_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-manifest.js',
      entry_sha256: sourceAuditManifest.evidence_pack_runtime_read_access_decision_audit_manifest_sha256,
      entry_payload_sha256: sourceAuditManifest.audit_manifest_payload_sha256,
      entry_scope: sourceAuditManifest.audit_manifest_scope,
      entry_category: sourceAuditManifest.audit_manifest_category,
      entry_subcategory: sourceAuditManifest.audit_manifest_subcategory,
      entry_ready: sourceAuditManifest.audit_manifest_ready,
      entry_observe_only: true,
      entry_access_granted: sourceAuditManifest.access_granted,
      entry_authorization_state: sourceAuditManifest.authorization_state,
      entry_policy_decision: sourceAuditManifest.policy_decision
    },
    {
      entry_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-AUDIT-INDEX-ENTRY-002',
      entry_name: 'Runtime Read Access Decision Audit Event',
      entry_type: 'SOURCE_AUDIT_EVENT',
      entry_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-event.js',
      entry_sha256: sourceAuditManifest.source_audit_event_sha256,
      entry_payload_sha256: sourceAuditManifest.source_audit_event_payload_sha256,
      entry_scope: sourcePayload.source_audit_event_scope,
      entry_category: sourcePayload.source_audit_event_category,
      entry_subcategory: sourcePayload.source_audit_event_subcategory,
      entry_ready: sourcePayload.source_audit_event_ready,
      entry_observe_only: true,
      entry_access_granted: sourcePayload.source_access_granted,
      entry_authorization_state: sourceAuditManifest.authorization_state,
      entry_policy_decision: sourceAuditManifest.policy_decision
    },
    {
      entry_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-AUDIT-INDEX-ENTRY-003',
      entry_name: 'Runtime Read Access Decision Boundary Snapshot',
      entry_type: 'SOURCE_BOUNDARY_SNAPSHOT',
      entry_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-boundary.js',
      entry_sha256: sourceAuditManifest.source_boundary_sha256,
      entry_payload_sha256: sourceAuditManifest.source_access_decision_payload_sha256,
      entry_scope: 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_ONLY',
      entry_ready: true,
      entry_observe_only: true,
      entry_access_granted: false,
      entry_authorization_state: sourceAuditManifest.authorization_state,
      entry_policy_decision: sourceAuditManifest.policy_decision
    }
  ];

  const auditIndexPayload = {
    source_audit_manifest_id: sourceAuditManifest.audit_manifest_id,
    source_audit_manifest_sha256: sourceAuditManifest.evidence_pack_runtime_read_access_decision_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceAuditManifest.audit_manifest_payload_sha256,
    source_audit_manifest_scope: sourceAuditManifest.audit_manifest_scope,
    source_audit_manifest_consumer: sourceAuditManifest.audit_manifest_consumer,
    source_audit_manifest_category: sourceAuditManifest.audit_manifest_category,
    source_audit_manifest_subcategory: sourceAuditManifest.audit_manifest_subcategory,
    source_audit_manifest_ready: sourceAuditManifest.audit_manifest_ready,
    source_audit_manifest_observe_only: true,
    source_manifest_entries_satisfied: sourceAuditManifest.manifest_entries_satisfied,
    source_manifest_entry_count: sourceAuditManifest.manifest_entry_count,
    source_audit_event_sha256: sourceAuditManifest.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditManifest.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditManifest.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceAuditManifest.source_access_decision_payload_sha256,
    source_runtime_audit_log_mutated: sourceAuditManifest.runtime_audit_log_mutated,
    source_external_audit_log_mutated: sourceAuditManifest.external_audit_log_mutated,
    source_access_granted: sourceAuditManifest.access_granted,
    source_grants_authorization: sourceAuditManifest.grants_authorization,
    source_creates_authorization_artifact: sourceAuditManifest.creates_authorization_artifact,
    source_executes_runtime_action: sourceAuditManifest.executes_runtime_action,
    source_creates_dispatch: sourceAuditManifest.creates_dispatch,
    source_mutates_runtime_state: sourceAuditManifest.mutates_runtime_state,
    source_authority_resolution_state: sourceAuditManifest.authority_resolution_state,
    source_policy_decision: sourceAuditManifest.policy_decision,
    source_authorization_state: sourceAuditManifest.authorization_state,
    source_positive_allow_probe_authorization_state: sourceAuditManifest.positive_allow_probe_authorization_state,
    index_entries: indexEntries,
    index_entry_count: indexEntries.length,
    index_classification: {
      category: 'AUDIT_INDEX',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX',
      index_type: 'CANONICAL_AUDIT_MANIFEST_INDEX',
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
      runtime_read_access_decision_audit_index_only: true,
      indexes_runtime_read_access_decision_audit_manifest: true,
      source_audit_manifest_hash_bound: true,
      index_entries_satisfied: true,
      manifest_entries_satisfied: true,
      observe_only_index_semantics: true,
      no_runtime_audit_log_append_side_effect: true,
      audit_index_does_not_authorize: true,
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
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_KIND,
    audit_index_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-AUDIT-INDEX-2026-09-23',
    generated_at: generatedAt,
    current_time: currentTime,
    audit_index_main_commit: 'fe4f60731054d7f784b34e6502f42884546f5562',
    source_audit_manifest_feature_commit: '9d57501a6abe8fc8aa8af249d604f6c8d495bdaa',
    source_audit_manifest_merge_commit: 'c64a15a8926ebde21c2ac4cef87c2bdefe619e6a',
    source_audit_manifest_checkpoint_commit: 'b799d41cb09b2381389760c2d67548615fd41c68',
    source_final_chain_audit_commit: 'fe4f60731054d7f784b34e6502f42884546f5562',
    source_audit_manifest_checkpoint_doc_sha256: 'ebe06c4175ff76a19b8e65964b79f7e5d845aded7d820bf87d868d532cdd7a8d',
    source_final_chain_audit_doc_sha256: 'ed380f23da9dc75ba5603027f4027f211457ad63ef1cc1524a8172e94c71c60b',
    source_audit_manifest_sha256: sourceAuditManifest.evidence_pack_runtime_read_access_decision_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceAuditManifest.audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceAuditManifest.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditManifest.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditManifest.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceAuditManifest.source_access_decision_payload_sha256,
    audit_index_payload_sha256: sha256Hex(auditIndexPayload),
    audit_index_payload: auditIndexPayload,
    audit_index_ready: true,
    audit_index_scope: 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_ONLY',
    audit_index_consumer: 'JOKER_C2',
    audit_index_category: 'AUDIT_INDEX',
    audit_index_subcategory: 'RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX',
    indexes_access_decision_audit_manifest_only: true,
    index_entry_count: indexEntries.length,
    index_entries_satisfied: true,
    manifest_entries_satisfied: sourceAuditManifest.manifest_entries_satisfied,
    observe_only_index_semantics: true,
    runtime_audit_log_mutated: false,
    external_audit_log_mutated: false,
    authority_resolution_state: sourceAuditManifest.authority_resolution_state,
    policy_decision: sourceAuditManifest.policy_decision,
    authorization_state: sourceAuditManifest.authorization_state,
    positive_allow_probe_authorization_state: sourceAuditManifest.positive_allow_probe_authorization_state,
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

  body.evidence_pack_runtime_read_access_decision_audit_index_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_READY',
    evidence_pack_runtime_read_access_decision_audit_index: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex
};
