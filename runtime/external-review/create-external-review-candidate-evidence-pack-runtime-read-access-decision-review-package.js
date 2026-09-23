'use strict';

const crypto = require('crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-index');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_AUDIT_INDEX_SHA256 =
  'dac8349bc03ead91491efa69ba5341de5a9f4f710b35ee621719d873aaf76faa';

const EXPECTED_SOURCE_AUDIT_INDEX_PAYLOAD_SHA256 =
  'b879241dd8137acb51023e149e2d6b67c4d769c8e56aae3fe826765832caa129';

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

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T16:45:00.000Z';
  const currentTime = input.current_time || '2026-09-23T16:45:00.000Z';

  if (!isIsoDateTime(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoDateTime(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_CURRENT_TIME_INVALID'
    };
  }

  const sourceAuditIndexResult = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex(
    input.source_audit_index_input || {
      generated_at: '2026-09-23T16:30:00.000Z',
      current_time: '2026-09-23T16:30:00.000Z'
    }
  );

  if (
    sourceAuditIndexResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_BLOCKED',
      source_audit_index_result: cloneJson(sourceAuditIndexResult)
    };
  }

  const sourceAuditIndex =
    sourceAuditIndexResult.evidence_pack_runtime_read_access_decision_audit_index;

  if (
    sourceAuditIndex.evidence_pack_runtime_read_access_decision_audit_index_sha256 !== EXPECTED_SOURCE_AUDIT_INDEX_SHA256 ||
    sourceAuditIndex.audit_index_payload_sha256 !== EXPECTED_SOURCE_AUDIT_INDEX_PAYLOAD_SHA256
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_HASH_MISMATCH'
    };
  }

  if (
    sourceAuditIndex.access_granted !== false ||
    sourceAuditIndex.grants_authorization !== false ||
    sourceAuditIndex.creates_authorization_artifact !== false ||
    sourceAuditIndex.executes_runtime_action !== false ||
    sourceAuditIndex.creates_dispatch !== false ||
    sourceAuditIndex.mutates_runtime_state !== false ||
    sourceAuditIndex.runtime_audit_log_mutated !== false ||
    sourceAuditIndex.external_audit_log_mutated !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_NOT_OBSERVE_ONLY'
    };
  }

  const sourcePayload = sourceAuditIndex.audit_index_payload;

  const reviewPackageSections = [
    {
      section_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-SECTION-001',
      section_name: 'Runtime Read Access Decision Audit Index',
      section_type: 'SOURCE_AUDIT_INDEX',
      section_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-index.js',
      section_sha256: sourceAuditIndex.evidence_pack_runtime_read_access_decision_audit_index_sha256,
      section_payload_sha256: sourceAuditIndex.audit_index_payload_sha256,
      section_scope: sourceAuditIndex.audit_index_scope,
      section_ready: sourceAuditIndex.audit_index_ready,
      section_observe_only: true,
      section_access_granted: sourceAuditIndex.access_granted,
      section_authorization_state: sourceAuditIndex.authorization_state
    },
    {
      section_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-SECTION-002',
      section_name: 'Runtime Read Access Decision Audit Manifest',
      section_type: 'SOURCE_AUDIT_MANIFEST',
      section_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-manifest.js',
      section_sha256: sourceAuditIndex.source_audit_manifest_sha256,
      section_payload_sha256: sourceAuditIndex.source_audit_manifest_payload_sha256,
      section_scope: sourcePayload.source_audit_manifest_scope,
      section_ready: sourcePayload.source_audit_manifest_ready,
      section_observe_only: true,
      section_access_granted: sourcePayload.source_access_granted,
      section_authorization_state: sourceAuditIndex.authorization_state
    },
    {
      section_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-SECTION-003',
      section_name: 'Runtime Read Access Decision Audit Event',
      section_type: 'SOURCE_AUDIT_EVENT',
      section_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-event.js',
      section_sha256: sourceAuditIndex.source_audit_event_sha256,
      section_payload_sha256: sourceAuditIndex.source_audit_event_payload_sha256,
      section_ready: true,
      section_observe_only: true,
      section_access_granted: false,
      section_authorization_state: sourceAuditIndex.authorization_state
    },
    {
      section_id: 'HBCE-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-SECTION-004',
      section_name: 'Runtime Read Access Decision Boundary Snapshot',
      section_type: 'SOURCE_BOUNDARY_SNAPSHOT',
      section_ref: 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-boundary.js',
      section_sha256: sourceAuditIndex.source_boundary_sha256,
      section_payload_sha256: sourceAuditIndex.source_access_decision_payload_sha256,
      section_ready: true,
      section_observe_only: true,
      section_access_granted: false,
      section_authorization_state: sourceAuditIndex.authorization_state
    }
  ];

  const reviewPackagePayload = {
    source_audit_index_id: sourceAuditIndex.audit_index_id,
    source_audit_index_sha256: sourceAuditIndex.evidence_pack_runtime_read_access_decision_audit_index_sha256,
    source_audit_index_payload_sha256: sourceAuditIndex.audit_index_payload_sha256,
    source_audit_index_scope: sourceAuditIndex.audit_index_scope,
    source_audit_index_consumer: sourceAuditIndex.audit_index_consumer,
    source_audit_index_category: sourceAuditIndex.audit_index_category,
    source_audit_index_subcategory: sourceAuditIndex.audit_index_subcategory,
    source_audit_index_ready: sourceAuditIndex.audit_index_ready,
    source_audit_index_observe_only: true,
    source_index_entries_satisfied: sourceAuditIndex.index_entries_satisfied,
    source_index_entry_count: sourceAuditIndex.index_entry_count,
    source_manifest_entries_satisfied: sourceAuditIndex.manifest_entries_satisfied,
    source_audit_manifest_sha256: sourceAuditIndex.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceAuditIndex.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceAuditIndex.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditIndex.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditIndex.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceAuditIndex.source_access_decision_payload_sha256,
    source_runtime_audit_log_mutated: sourceAuditIndex.runtime_audit_log_mutated,
    source_external_audit_log_mutated: sourceAuditIndex.external_audit_log_mutated,
    source_access_granted: sourceAuditIndex.access_granted,
    source_grants_authorization: sourceAuditIndex.grants_authorization,
    source_creates_authorization_artifact: sourceAuditIndex.creates_authorization_artifact,
    source_executes_runtime_action: sourceAuditIndex.executes_runtime_action,
    source_creates_dispatch: sourceAuditIndex.creates_dispatch,
    source_mutates_runtime_state: sourceAuditIndex.mutates_runtime_state,
    source_authority_resolution_state: sourceAuditIndex.authority_resolution_state,
    source_policy_decision: sourceAuditIndex.policy_decision,
    source_authorization_state: sourceAuditIndex.authorization_state,
    source_positive_allow_probe_authorization_state: sourceAuditIndex.positive_allow_probe_authorization_state,
    review_package_sections: reviewPackageSections,
    review_package_section_count: reviewPackageSections.length,
    review_package_classification: {
      category: 'REVIEW_PACKAGE',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE',
      package_type: 'INTERNAL_REVIEW_PACKAGE',
      decision_effect: 'OBSERVE_ONLY',
      authority_effect: 'NONE',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      runtime_mutation_effect: 'NONE',
      audit_log_append_effect: 'NONE',
      external_submission_effect: 'NONE',
      certification_effect: 'NONE'
    },
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      runtime_read_access_decision_review_package_only: true,
      packages_runtime_read_access_decision_audit_index: true,
      source_audit_index_hash_bound: true,
      review_package_sections_satisfied: true,
      index_entries_satisfied: true,
      manifest_entries_satisfied: true,
      observe_only_review_package_semantics: true,
      no_runtime_audit_log_append_side_effect: true,
      review_package_does_not_authorize: true,
      audit_index_does_not_authorize: true,
      audit_manifest_does_not_authorize: true,
      audit_event_does_not_authorize: true,
      valid_authority_does_not_authorize: true,
      policy_allow_probe_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutation: true,
      no_external_review_submission_created: true,
      no_legal_certification_created: true,
      no_eidas_qualification_created: true
    }
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_KIND,
    review_package_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-2026-09-23',
    generated_at: generatedAt,
    current_time: currentTime,
    review_package_main_commit: '08b69806479568558210622913c9c0ab59dc3663',
    source_audit_index_feature_commit: '2e8939d1de47b09033ac77bd62c6c1666492cf7d',
    source_audit_index_merge_commit: '3d4dad256652a423221218b145fab01b5c8ab5dc',
    source_audit_index_checkpoint_commit: 'fbfdcb5a96be8d939c9d56daed8725321fb3984e',
    source_final_chain_audit_commit: '08b69806479568558210622913c9c0ab59dc3663',
    source_audit_index_checkpoint_doc_sha256: '2488672289b585ebeaf794e10d6c5a9cc13e7eaf3f3de89791d4e311c60c6c05',
    source_final_chain_audit_doc_sha256: '9cdcea5d6c20d941a30c3c5545b630852d975562e5ed77bd00555e1da1b35a69',
    source_audit_index_sha256: sourceAuditIndex.evidence_pack_runtime_read_access_decision_audit_index_sha256,
    source_audit_index_payload_sha256: sourceAuditIndex.audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceAuditIndex.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceAuditIndex.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceAuditIndex.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditIndex.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditIndex.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceAuditIndex.source_access_decision_payload_sha256,
    review_package_payload_sha256: sha256Hex(reviewPackagePayload),
    review_package_payload: reviewPackagePayload,
    review_package_ready: true,
    review_package_scope: 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_ONLY',
    review_package_consumer: 'JOKER_C2',
    review_package_category: 'REVIEW_PACKAGE',
    review_package_subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE',
    packages_access_decision_audit_index_only: true,
    review_package_section_count: reviewPackageSections.length,
    review_package_sections_satisfied: true,
    index_entries_satisfied: sourceAuditIndex.index_entries_satisfied,
    manifest_entries_satisfied: sourceAuditIndex.manifest_entries_satisfied,
    observe_only_review_package_semantics: true,
    runtime_audit_log_mutated: false,
    external_audit_log_mutated: false,
    authority_resolution_state: sourceAuditIndex.authority_resolution_state,
    policy_decision: sourceAuditIndex.policy_decision,
    authorization_state: sourceAuditIndex.authorization_state,
    positive_allow_probe_authorization_state: sourceAuditIndex.positive_allow_probe_authorization_state,
    access_granted: false,
    grants_authorization: false,
    creates_authorization_artifact: false,
    executes_runtime_action: false,
    creates_dispatch: false,
    mutates_runtime_state: false,
    external_review_execution_created: false,
    external_review_opinion_created: false,
    external_review_report_created: false,
    external_review_submission_created: false,
    external_review_publication_created: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_runtime_read_access_decision_review_package_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_READY',
    evidence_pack_runtime_read_access_decision_review_package: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage
};
