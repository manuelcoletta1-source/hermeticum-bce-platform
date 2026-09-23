'use strict';

const crypto = require('crypto');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE = Object.freeze({
  EXPORTED: 'EXPORTED',
  BLOCKED: 'BLOCKED'
});

const EXPECTED_SOURCE_REVIEW_PACKAGE_SHA256 =
  '86a19d81199457ecd6bc8f7d787862675f0403ddb6b34d73f17e8c35cc5b0bb5';

const EXPECTED_SOURCE_REVIEW_PACKAGE_PAYLOAD_SHA256 =
  'a35f536a15b968be11bccd8a298dbee92a0773e2df32aa1b56f7c6f7e65b525a';

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

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T17:00:00.000Z';
  const currentTime = input.current_time || '2026-09-23T17:00:00.000Z';

  if (!isIsoDateTime(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_GENERATED_AT_INVALID'
    };
  }

  if (!isIsoDateTime(currentTime)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_CURRENT_TIME_INVALID'
    };
  }

  const sourceReviewPackageResult = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage(
    input.source_review_package_input || {
      generated_at: '2026-09-23T16:45:00.000Z',
      current_time: '2026-09-23T16:45:00.000Z'
    }
  );

  if (
    sourceReviewPackageResult.state !==
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.READY
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SOURCE_REVIEW_PACKAGE_BLOCKED',
      source_review_package_result: cloneJson(sourceReviewPackageResult)
    };
  }

  const sourceReviewPackage =
    sourceReviewPackageResult.evidence_pack_runtime_read_access_decision_review_package;

  if (
    sourceReviewPackage.evidence_pack_runtime_read_access_decision_review_package_sha256 !== EXPECTED_SOURCE_REVIEW_PACKAGE_SHA256 ||
    sourceReviewPackage.review_package_payload_sha256 !== EXPECTED_SOURCE_REVIEW_PACKAGE_PAYLOAD_SHA256
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SOURCE_REVIEW_PACKAGE_HASH_MISMATCH'
    };
  }

  if (
    sourceReviewPackage.access_granted !== false ||
    sourceReviewPackage.grants_authorization !== false ||
    sourceReviewPackage.creates_authorization_artifact !== false ||
    sourceReviewPackage.executes_runtime_action !== false ||
    sourceReviewPackage.creates_dispatch !== false ||
    sourceReviewPackage.mutates_runtime_state !== false ||
    sourceReviewPackage.runtime_audit_log_mutated !== false ||
    sourceReviewPackage.external_audit_log_mutated !== false ||
    sourceReviewPackage.external_review_submission_created !== false ||
    sourceReviewPackage.external_review_publication_created !== false
  ) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SOURCE_REVIEW_PACKAGE_NOT_INTERNAL_ONLY'
    };
  }

  const sourcePayload = sourceReviewPackage.review_package_payload;

  const exportPayload = {
    source_review_package_id: sourceReviewPackage.review_package_id,
    source_review_package_sha256: sourceReviewPackage.evidence_pack_runtime_read_access_decision_review_package_sha256,
    source_review_package_payload_sha256: sourceReviewPackage.review_package_payload_sha256,
    source_review_package_scope: sourceReviewPackage.review_package_scope,
    source_review_package_consumer: sourceReviewPackage.review_package_consumer,
    source_review_package_category: sourceReviewPackage.review_package_category,
    source_review_package_subcategory: sourceReviewPackage.review_package_subcategory,
    source_review_package_ready: sourceReviewPackage.review_package_ready,
    source_review_package_observe_only: true,
    source_review_package_sections_satisfied: sourceReviewPackage.review_package_sections_satisfied,
    source_review_package_section_count: sourceReviewPackage.review_package_section_count,
    source_index_entries_satisfied: sourceReviewPackage.index_entries_satisfied,
    source_manifest_entries_satisfied: sourceReviewPackage.manifest_entries_satisfied,
    source_audit_index_sha256: sourceReviewPackage.source_audit_index_sha256,
    source_audit_index_payload_sha256: sourceReviewPackage.source_audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceReviewPackage.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceReviewPackage.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceReviewPackage.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceReviewPackage.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceReviewPackage.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceReviewPackage.source_access_decision_payload_sha256,
    exported_sections: sourcePayload.review_package_sections.map((section) => ({
      exported_section_id: section.section_id,
      exported_section_type: section.section_type,
      exported_section_ref: section.section_ref,
      exported_section_sha256: section.section_sha256,
      exported_section_payload_sha256: section.section_payload_sha256,
      exported_section_ready: section.section_ready,
      exported_section_observe_only: section.section_observe_only,
      exported_section_access_granted: section.section_access_granted,
      exported_section_authorization_state: section.section_authorization_state
    })),
    export_classification: {
      category: 'EXPORT',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT',
      export_type: 'INTERNAL_RUNTIME_EXPORT_ONLY',
      decision_effect: 'OBSERVE_ONLY',
      authority_effect: 'NONE',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      runtime_mutation_effect: 'NONE',
      audit_log_append_effect: 'NONE',
      external_review_execution_effect: 'NONE',
      external_submission_effect: 'NONE',
      publication_effect: 'NONE',
      certification_effect: 'NONE'
    },
    export_boundary: {
      internal_runtime_export_only: true,
      source_review_package_required: true,
      source_review_package_hash_bound: true,
      review_package_sections_preserved: true,
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
    },
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      runtime_read_access_decision_review_package_export_only: true,
      exports_runtime_read_access_decision_review_package: true,
      source_review_package_hash_bound: true,
      review_package_sections_satisfied: true,
      index_entries_satisfied: true,
      manifest_entries_satisfied: true,
      observe_only_export_semantics: true,
      no_runtime_audit_log_append_side_effect: true,
      export_does_not_authorize: true,
      review_package_does_not_authorize: true,
      audit_index_does_not_authorize: true,
      valid_authority_does_not_authorize: true,
      policy_allow_probe_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutation: true,
      no_external_review_submission_created: true,
      no_external_review_publication_created: true,
      no_legal_certification_created: true,
      no_eidas_qualification_created: true
    }
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_KIND,
    export_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-2026-09-23',
    generated_at: generatedAt,
    current_time: currentTime,
    export_main_commit: 'deaf4d32ac7abb839cb2b785ff42e2609965daf7',
    source_review_package_feature_commit: '39b09692531e364dd784ac4444076097044eb3c4',
    source_review_package_merge_commit: '053f7b6ef8539553f6c72de222bfb22b63ba6177',
    source_review_package_checkpoint_commit: 'f62608bf03c4d5b6711a1546f171b48c27882471',
    source_final_chain_audit_commit: 'deaf4d32ac7abb839cb2b785ff42e2609965daf7',
    source_review_package_checkpoint_doc_sha256: 'a97cf41cefc8fef381235ce0973c5819229e56097c0bf9accc5086f59acffa79',
    source_final_chain_audit_doc_sha256: '7de639c2c079fa2dc1e7e8f0458a498b8d126d1ff76d855da17c5e740bbc616d',
    source_review_package_sha256: sourceReviewPackage.evidence_pack_runtime_read_access_decision_review_package_sha256,
    source_review_package_payload_sha256: sourceReviewPackage.review_package_payload_sha256,
    source_audit_index_sha256: sourceReviewPackage.source_audit_index_sha256,
    source_audit_index_payload_sha256: sourceReviewPackage.source_audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceReviewPackage.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceReviewPackage.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceReviewPackage.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceReviewPackage.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceReviewPackage.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceReviewPackage.source_access_decision_payload_sha256,
    export_payload_sha256: sha256Hex(exportPayload),
    export_payload: exportPayload,
    export_ready: true,
    export_scope: 'INTERNAL_RUNTIME_REVIEW_PACKAGE_EXPORT_ONLY',
    export_consumer: 'JOKER_C2',
    export_category: 'EXPORT',
    export_subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT',
    exports_review_package_only: true,
    exported_section_count: exportPayload.exported_sections.length,
    exported_sections_satisfied: true,
    review_package_sections_satisfied: sourceReviewPackage.review_package_sections_satisfied,
    index_entries_satisfied: sourceReviewPackage.index_entries_satisfied,
    manifest_entries_satisfied: sourceReviewPackage.manifest_entries_satisfied,
    observe_only_export_semantics: true,
    runtime_audit_log_mutated: false,
    external_audit_log_mutated: false,
    authority_resolution_state: sourceReviewPackage.authority_resolution_state,
    policy_decision: sourceReviewPackage.policy_decision,
    authorization_state: sourceReviewPackage.authorization_state,
    positive_allow_probe_authorization_state: sourceReviewPackage.positive_allow_probe_authorization_state,
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

  body.evidence_pack_runtime_read_access_decision_review_package_export_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.EXPORTED,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_EXPORTED',
    evidence_pack_runtime_read_access_decision_review_package_export: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport
};
