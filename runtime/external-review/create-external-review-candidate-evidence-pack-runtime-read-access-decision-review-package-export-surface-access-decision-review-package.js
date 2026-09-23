'use strict';

const crypto = require('crypto');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditIndex,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-audit-index');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T20:20:00.000Z';
const DEFAULT_CURRENT_TIME = '2026-09-23T20:20:00.000Z';

const EXPECTED_SOURCE_AUDIT_INDEX_SHA256 =
  '6ed9890b47a6b94109ba4b657770e4f89cb2baa077bb22df535c168e8fb3e0e4';

const EXPECTED_SOURCE_AUDIT_INDEX_PAYLOAD_SHA256 =
  'e3b7b88886ff62ecaeac87e2c7c02341bc6e99c1d08123a7828cfba094e185ee';

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isIsoDateString(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && !Number.isNaN(Date.parse(value));
}

function canonicalize(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError('UNSAFE_NUMBER');
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (isPlainObject(value)) {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        const item = value[key];
        if (typeof item === 'undefined' || typeof item === 'symbol' || typeof item === 'function') {
          throw new TypeError('UNSUPPORTED_CANONICAL_VALUE');
        }
        accumulator[key] = canonicalize(item);
        return accumulator;
      }, {});
  }

  throw new TypeError('UNSUPPORTED_CANONICAL_VALUE');
}

function sha256Hex(value) {
  const payload = typeof value === 'string' ? value : JSON.stringify(canonicalize(value));
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function blocked(reason, extra) {
  return Object.freeze({
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED,
    reason,
    ...(extra || {})
  });
}

function buildReviewPackageSections(sourceAuditIndex, sourcePayload) {
  return [
    {
      section_type: 'SOURCE_AUDIT_INDEX',
      section_ref:
        'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-audit-index.js',
      section_sha256:
        sourceAuditIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_sha256,
      section_payload_sha256: sourceAuditIndex.audit_index_payload_sha256,
      section_scope: sourceAuditIndex.audit_index_scope,
      section_category: sourceAuditIndex.audit_index_category,
      section_subcategory: sourceAuditIndex.audit_index_subcategory,
      section_ready: sourceAuditIndex.audit_index_ready,
      section_observe_only: true,
      section_access_granted: sourceAuditIndex.access_granted,
      section_authorization_state: sourceAuditIndex.authorization_state,
      section_policy_decision: sourceAuditIndex.policy_decision
    },
    {
      section_type: 'SOURCE_AUDIT_MANIFEST',
      section_ref:
        'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-audit-manifest.js',
      section_sha256: sourceAuditIndex.source_audit_manifest_sha256,
      section_payload_sha256: sourceAuditIndex.source_audit_manifest_payload_sha256,
      section_scope:
        sourcePayload.source_audit_manifest_scope ||
        'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_ONLY',
      section_ready:
        typeof sourcePayload.source_audit_manifest_ready === 'boolean'
          ? sourcePayload.source_audit_manifest_ready
          : true,
      section_observe_only: true,
      section_access_granted: sourcePayload.source_access_granted,
      section_authorization_state: sourceAuditIndex.authorization_state,
      section_policy_decision: sourceAuditIndex.policy_decision
    },
    {
      section_type: 'SOURCE_AUDIT_EVENT',
      section_ref:
        'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-audit-event.js',
      section_sha256: sourceAuditIndex.source_audit_event_sha256,
      section_payload_sha256: sourceAuditIndex.source_audit_event_payload_sha256,
      section_scope:
        sourcePayload.source_audit_event_scope ||
        'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_EVENT_ONLY',
      section_ready:
        typeof sourcePayload.source_audit_event_ready === 'boolean'
          ? sourcePayload.source_audit_event_ready
          : true,
      section_observe_only: true,
      section_access_granted: false,
      section_authorization_state: sourceAuditIndex.authorization_state,
      section_policy_decision: sourceAuditIndex.policy_decision
    },
    {
      section_type: 'SOURCE_BOUNDARY_SNAPSHOT',
      section_ref:
        'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-boundary.js',
      section_sha256: sourceAuditIndex.source_boundary_sha256,
      section_payload_sha256: sourceAuditIndex.source_boundary_payload_sha256,
      section_observe_only: true,
      section_access_granted: false,
      section_authorization_state: sourceAuditIndex.authorization_state,
      section_policy_decision: sourceAuditIndex.policy_decision
    },
    {
      section_type: 'SOURCE_CAPABILITY_BINDING_SNAPSHOT',
      section_ref:
        'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-capability-binding.js',
      section_sha256: sourceAuditIndex.source_binding_sha256,
      section_payload_sha256: sourceAuditIndex.source_binding_payload_sha256,
      section_observe_only: true,
      section_access_granted: false,
      section_authorization_state: sourceAuditIndex.authorization_state,
      section_policy_decision: sourceAuditIndex.policy_decision
    }
  ];
}

function buildReviewPackagePayload(sourceAuditIndex, generatedAt, currentTime) {
  const sourcePayload = sourceAuditIndex.audit_index_payload || {};
  const reviewPackageSections = buildReviewPackageSections(sourceAuditIndex, sourcePayload);

  const reviewPackagePayload = {
    source_audit_index_id: sourceAuditIndex.audit_index_id,
    source_audit_index_sha256:
      sourceAuditIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_sha256,
    source_audit_index_payload_sha256: sourceAuditIndex.audit_index_payload_sha256,
    source_audit_index_scope: sourceAuditIndex.audit_index_scope,
    source_audit_index_consumer: sourceAuditIndex.audit_index_consumer,
    source_audit_index_category: sourceAuditIndex.audit_index_category,
    source_audit_index_subcategory: sourceAuditIndex.audit_index_subcategory,
    source_audit_index_ready: sourceAuditIndex.audit_index_ready,
    source_audit_index_observe_only: true,
    source_index_entries_satisfied: sourceAuditIndex.index_entries_satisfied,
    source_manifest_entries_satisfied: sourceAuditIndex.manifest_entries_satisfied,

    source_audit_manifest_sha256: sourceAuditIndex.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceAuditIndex.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceAuditIndex.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditIndex.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditIndex.source_boundary_sha256,
    source_boundary_payload_sha256: sourceAuditIndex.source_boundary_payload_sha256,
    source_binding_sha256: sourceAuditIndex.source_binding_sha256,
    source_binding_payload_sha256: sourceAuditIndex.source_binding_payload_sha256,
    source_index_sha256: sourceAuditIndex.source_index_sha256,
    source_index_payload_sha256: sourceAuditIndex.source_index_payload_sha256,
    source_surface_sha256: sourceAuditIndex.source_surface_sha256,
    source_surface_payload_sha256: sourceAuditIndex.source_surface_payload_sha256,
    source_export_sha256: sourceAuditIndex.source_export_sha256,
    source_export_payload_sha256: sourceAuditIndex.source_export_payload_sha256,
    source_review_package_sha256: sourceAuditIndex.source_review_package_sha256,
    source_review_package_payload_sha256: sourceAuditIndex.source_review_package_payload_sha256,

    source_access_granted: sourceAuditIndex.access_granted,
    source_grants_authorization: sourceAuditIndex.grants_authorization,
    source_creates_authorization_artifact: sourceAuditIndex.creates_authorization_artifact,
    source_executes_runtime_action: sourceAuditIndex.executes_runtime_action,
    source_creates_dispatch: sourceAuditIndex.creates_dispatch,
    source_mutates_runtime_state: sourceAuditIndex.mutates_runtime_state,

    source_authority_resolution_state: sourceAuditIndex.authority_resolution_state,
    source_authority_resolution_reason: sourceAuditIndex.authority_resolution_reason,
    source_policy_decision: sourceAuditIndex.policy_decision,
    source_policy_decision_reason: sourceAuditIndex.policy_decision_reason,
    source_authorization_state: sourceAuditIndex.authorization_state,
    source_authorization_reason: sourceAuditIndex.authorization_reason,
    source_positive_allow_probe_authorization_state: sourceAuditIndex.positive_allow_probe_authorization_state,
    source_positive_allow_probe_authorization_reason: sourceAuditIndex.positive_allow_probe_authorization_reason,

    review_package_sections: reviewPackageSections,

    review_package_classification: {
      category: 'REVIEW_PACKAGE',
      subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE',
      decision_effect: 'OBSERVE_ONLY',
      authorization_effect: 'NONE',
      dispatch_effect: 'NONE',
      execution_effect: 'NONE',
      external_review_effect: 'NONE'
    },

    stable_access_contract: {
      deterministic_sha256_bound: true,
      source_audit_index_hash_bound: true,
      source_audit_index_payload_hash_bound: true,
      source_audit_manifest_hash_bound: true,
      source_audit_event_hash_bound: true,
      source_boundary_hash_bound: true,
      review_package_sections_satisfied: true,
      index_entries_satisfied: true,
      manifest_entries_satisfied: true,
      observe_only_review_package_semantics: true,
      observe_only_index_semantics_preserved: true,
      review_package_does_not_authorize: true,
      review_package_does_not_dispatch: true,
      review_package_does_not_execute: true,
      unresolved_authorization_blocks_execution: true
    },

    decision_snapshot: {
      authority_resolution_state: sourceAuditIndex.authority_resolution_state,
      authority_resolution_reason: sourceAuditIndex.authority_resolution_reason,
      policy_decision: sourceAuditIndex.policy_decision,
      policy_decision_reason: sourceAuditIndex.policy_decision_reason,
      authorization_state: sourceAuditIndex.authorization_state,
      authorization_reason: sourceAuditIndex.authorization_reason,
      positive_allow_probe_authorization_state: sourceAuditIndex.positive_allow_probe_authorization_state,
      positive_allow_probe_authorization_reason: sourceAuditIndex.positive_allow_probe_authorization_reason,
      access_granted: false,
      grants_authorization: false,
      creates_authorization_artifact: false,
      creates_dispatch: false,
      executes_runtime_action: false,
      mutates_runtime_state: false
    },

    review_package_view: {
      review_package_generated_at: generatedAt,
      review_package_current_time: currentTime,
      source_audit_index_required: true,
      source_audit_index_hash_bound: true,
      review_package_sections_count: reviewPackageSections.length,
      review_package_sections_satisfied: true,
      index_entries_satisfied: true,
      manifest_entries_satisfied: true,
      runtime_state_mutated_by_review_package: false,
      external_registry_mutated_by_review_package: false,
      external_review_triggered_by_review_package: false
    },

    readable_summary: {
      access_granted: false,
      grants_authorization: false,
      authority_resolution_state: sourceAuditIndex.authority_resolution_state,
      policy_decision: sourceAuditIndex.policy_decision,
      authorization_state: sourceAuditIndex.authorization_state,
      positive_allow_probe_authorization_state: sourceAuditIndex.positive_allow_probe_authorization_state,
      creates_dispatch: false,
      executes_runtime_action: false,
      mutates_runtime_state: false,
      external_review_execution_created: false,
      external_review_opinion_created: false,
      external_review_report_created: false,
      external_review_submission_created: false,
      external_review_publication_created: false,
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false
    },

    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      source_audit_index_hash_bound: true,
      source_audit_index_payload_hash_bound: true,
      source_audit_manifest_hash_bound: true,
      source_audit_manifest_payload_hash_bound: true,
      source_audit_event_hash_bound: true,
      source_audit_event_payload_hash_bound: true,
      source_boundary_hash_bound: true,
      source_binding_hash_bound: true,
      source_index_hash_bound: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,
      review_package_sections_satisfied: true,
      index_entries_satisfied: true,
      manifest_entries_satisfied: true,
      observe_only_review_package_semantics: true,
      observe_only_index_semantics_preserved: true,
      observe_only_manifest_semantics_preserved: true,
      append_only_source_event_preserved: true,
      runtime_read_access_decision_review_package_export_surface_access_decision_review_package_only: true,
      review_package_does_not_authorize: true,
      review_package_does_not_dispatch: true,
      review_package_does_not_execute: true,
      no_authorization_artifact_created: true,
      no_runtime_state_mutation: true,
      no_runtime_audit_log_mutation: true,
      no_external_audit_log_mutation: true,
      no_public_registry_mutation: true,
      no_external_trust_registry_mutation: true,
      no_external_review_execution_created: true,
      no_external_review_opinion_created: true,
      no_external_review_report_created: true,
      no_external_review_submission_created: true,
      no_external_review_publication_created: true,
      no_legal_certification_created: true,
      no_eidas_qualification_created: true,
      no_opc_allow_created: true,
      no_deployment_proof_created: true,
      no_production_proof_created: true
    }
  };

  reviewPackagePayload.review_package_payload_sha256 = sha256Hex(reviewPackagePayload);
  return reviewPackagePayload;
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionReviewPackage(input = {}) {
  const generatedAt = input.generated_at || DEFAULT_GENERATED_AT;
  const currentTime = input.current_time || DEFAULT_CURRENT_TIME;

  if (!isIsoDateString(generatedAt)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_GENERATED_AT_INVALID'
    );
  }

  if (!isIsoDateString(currentTime)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_CURRENT_TIME_INVALID'
    );
  }

  const sourceAuditIndexResult =
    input.source_audit_index_result ||
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditIndex(
      input.source_audit_index_input || {}
    );

  if (
    !sourceAuditIndexResult ||
    sourceAuditIndexResult.state !==
      HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.READY
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_BLOCKED',
      { source_audit_index_result: cloneJson(sourceAuditIndexResult) }
    );
  }

  const sourceAuditIndex =
    sourceAuditIndexResult.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index;

  if (
    sourceAuditIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_sha256 !==
      EXPECTED_SOURCE_AUDIT_INDEX_SHA256 ||
    sourceAuditIndex.audit_index_payload_sha256 !== EXPECTED_SOURCE_AUDIT_INDEX_PAYLOAD_SHA256
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_HASH_MISMATCH',
      { source_audit_index: cloneJson(sourceAuditIndex) }
    );
  }

  if (
    sourceAuditIndex.access_granted !== false ||
    sourceAuditIndex.grants_authorization !== false ||
    sourceAuditIndex.creates_authorization_artifact !== false ||
    sourceAuditIndex.executes_runtime_action !== false ||
    sourceAuditIndex.creates_dispatch !== false ||
    sourceAuditIndex.mutates_runtime_state !== false ||
    sourceAuditIndex.index_entries_satisfied !== true ||
    sourceAuditIndex.manifest_entries_satisfied !== true ||
    sourceAuditIndex.observe_only_index_semantics !== true
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_NOT_OBSERVE_ONLY',
      { source_audit_index: cloneJson(sourceAuditIndex) }
    );
  }

  if (
    sourceAuditIndex.external_review_execution_created !== false ||
    sourceAuditIndex.external_review_opinion_created !== false ||
    sourceAuditIndex.external_review_report_created !== false ||
    sourceAuditIndex.external_review_submission_created !== false ||
    sourceAuditIndex.external_review_publication_created !== false ||
    sourceAuditIndex.legal_certification_created !== false ||
    sourceAuditIndex.eidas_qualification_created !== false ||
    sourceAuditIndex.opc_allow_created !== false ||
    sourceAuditIndex.deployment_success_proven !== false ||
    sourceAuditIndex.production_deployment_proven !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_FALSE_EFFECTS_INVALID',
      { source_audit_index: cloneJson(sourceAuditIndex) }
    );
  }

  const reviewPackagePayload = buildReviewPackagePayload(sourceAuditIndex, generatedAt, currentTime);

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_KIND,

    review_package_id:
      'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-ACCESS-DECISION-REVIEW-PACKAGE-2026-09-23',
    review_package_version: 1,
    review_package_generated_at: generatedAt,
    review_package_current_time: currentTime,

    review_package_main_commit: '2d6c590d918bc4875075d93590d02bbe8bff5671',
    source_audit_index_feature_commit: '4791b9cc796cf3570460f7e2af08872530608666',
    source_audit_index_merge_commit: 'fa516944b045ec3916422bfed6eb0202659048ea',
    source_audit_index_checkpoint_commit: '77637de6f9bd6e8969fd334257ffaaae8405d3cb',
    source_audit_index_final_chain_audit_commit: '2d6c590d918bc4875075d93590d02bbe8bff5671',
    source_audit_index_checkpoint_doc_sha256: 'dd97f1ecde32c6641c50c3f7c21de7e5baa57f4617aee3fbb1ea5d3b0362ff10',
    source_final_chain_audit_doc_sha256: 'd119fd0bd1e8cae79696b463b3cc5ba0c86e41c279622c5fe9cf1ad09e189b9e',

    source_audit_index_sha256:
      sourceAuditIndex.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_sha256,
    source_audit_index_payload_sha256: sourceAuditIndex.audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceAuditIndex.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceAuditIndex.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceAuditIndex.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceAuditIndex.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceAuditIndex.source_boundary_sha256,
    source_boundary_payload_sha256: sourceAuditIndex.source_boundary_payload_sha256,
    source_binding_sha256: sourceAuditIndex.source_binding_sha256,
    source_binding_payload_sha256: sourceAuditIndex.source_binding_payload_sha256,
    source_index_sha256: sourceAuditIndex.source_index_sha256,
    source_index_payload_sha256: sourceAuditIndex.source_index_payload_sha256,
    source_surface_sha256: sourceAuditIndex.source_surface_sha256,
    source_surface_payload_sha256: sourceAuditIndex.source_surface_payload_sha256,
    source_export_sha256: sourceAuditIndex.source_export_sha256,
    source_export_payload_sha256: sourceAuditIndex.source_export_payload_sha256,
    source_review_package_sha256: sourceAuditIndex.source_review_package_sha256,
    source_review_package_payload_sha256: sourceAuditIndex.source_review_package_payload_sha256,

    review_package_payload_sha256: reviewPackagePayload.review_package_payload_sha256,
    review_package_payload: reviewPackagePayload,

    review_package_ready: true,
    review_package_scope:
      'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_ONLY',
    review_package_consumer: 'JOKER_C2',
    review_package_category: 'REVIEW_PACKAGE',
    review_package_subcategory:
      'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE',

    review_package_sections_satisfied: true,
    index_entries_satisfied: sourceAuditIndex.index_entries_satisfied,
    manifest_entries_satisfied: sourceAuditIndex.manifest_entries_satisfied,
    observe_only_review_package_semantics: true,
    review_package_does_not_authorize: true,

    authority_resolution_state: sourceAuditIndex.authority_resolution_state,
    authority_resolution_reason: sourceAuditIndex.authority_resolution_reason,
    policy_decision: sourceAuditIndex.policy_decision,
    policy_decision_reason: sourceAuditIndex.policy_decision_reason,
    authorization_state: sourceAuditIndex.authorization_state,
    authorization_reason: sourceAuditIndex.authorization_reason,
    positive_allow_probe_authorization_state: sourceAuditIndex.positive_allow_probe_authorization_state,
    positive_allow_probe_authorization_reason: sourceAuditIndex.positive_allow_probe_authorization_reason,

    access_granted: false,
    grants_authorization: false,
    creates_authorization_artifact: false,
    executes_runtime_action: false,
    creates_dispatch: false,
    mutates_runtime_state: false,
    runtime_audit_log_mutated: false,
    external_audit_log_mutated: false,
    public_registry_mutated: false,
    external_trust_registry_mutated: false,

    external_review_execution_created: false,
    external_review_opinion_created: false,
    external_review_report_created: false,
    external_review_submission_created: false,
    external_review_publication_created: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package_sha256 =
    sha256Hex(body);

  return Object.freeze({
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_STATE.READY,
    reason:
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package: body
  });
}

module.exports = {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionReviewPackage,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_REVIEW_PACKAGE_STATE
};
