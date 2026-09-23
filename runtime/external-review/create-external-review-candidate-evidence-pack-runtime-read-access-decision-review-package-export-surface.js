'use strict';

const crypto = require('crypto');
const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export_surface.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T16:45:00.000Z';
const DEFAULT_CURRENT_TIME = '2026-09-23T16:45:00.000Z';

const EXPECTED_SOURCE_EXPORT_SHA256 =
  'aa63a1a9b35aba093831fd7938c323cef5830d893c215cd766c01a6fd8f4c0c4';

const EXPECTED_SOURCE_EXPORT_PAYLOAD_SHA256 =
  'df6aace8678182fd397ad5381cb916b358e60926253e46816eb2b98e681dbcb7';

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function assertCanonicalSafe(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || Object.is(value, -0)) {
      throw new TypeError('Unsafe number for canonical JSON');
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      assertCanonicalSafe(item);
    }
    return;
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      assertCanonicalSafe(value[key]);
    }
  }
}

function canonicalize(value) {
  assertCanonicalSafe(value);

  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
}

function sha256Hex(value) {
  const payload = typeof value === 'string' ? value : canonicalize(value);
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function isValidIsoDate(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function blocked(reason, extra = {}) {
  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE.BLOCKED,
    reason,
    ...extra
  };
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface(input = {}) {
  const generatedAt = input.generated_at || DEFAULT_GENERATED_AT;
  const currentTime = input.current_time || DEFAULT_CURRENT_TIME;

  if (!isValidIsoDate(generatedAt)) {
    return blocked('HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_GENERATED_AT_INVALID');
  }

  if (!isValidIsoDate(currentTime)) {
    return blocked('HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CURRENT_TIME_INVALID');
  }

  const sourceExportResult =
    input.source_export_result ||
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport(
      input.source_export_input || {}
    );

  if (
    !sourceExportResult ||
    sourceExportResult.state !==
      HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.EXPORTED
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_SOURCE_EXPORT_BLOCKED',
      { source_export_result: cloneJson(sourceExportResult) }
    );
  }

  const sourceExport =
    sourceExportResult.evidence_pack_runtime_read_access_decision_review_package_export;

  if (
    !sourceExport ||
    sourceExport.evidence_pack_runtime_read_access_decision_review_package_export_sha256 !== EXPECTED_SOURCE_EXPORT_SHA256 ||
    sourceExport.export_payload_sha256 !== EXPECTED_SOURCE_EXPORT_PAYLOAD_SHA256
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_SOURCE_EXPORT_HASH_MISMATCH',
      { source_export: cloneJson(sourceExport) }
    );
  }

  if (
    sourceExport.access_granted !== false ||
    sourceExport.grants_authorization !== false ||
    sourceExport.creates_authorization_artifact !== false ||
    sourceExport.executes_runtime_action !== false ||
    sourceExport.creates_dispatch !== false ||
    sourceExport.mutates_runtime_state !== false ||
    sourceExport.external_review_execution_created !== false ||
    sourceExport.external_review_submission_created !== false ||
    sourceExport.external_review_publication_created !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_SOURCE_EXPORT_EFFECT_INVALID',
      { source_export: cloneJson(sourceExport) }
    );
  }

  const exportPayload = sourceExport.export_payload;

  const surfacePayload = {
    source_export_id: sourceExport.export_id,
    source_export_sha256: sourceExport.evidence_pack_runtime_read_access_decision_review_package_export_sha256,
    source_export_payload_sha256: sourceExport.export_payload_sha256,
    source_export_scope: sourceExport.export_scope,
    source_export_consumer: sourceExport.export_consumer,
    source_export_category: sourceExport.export_category,
    source_export_subcategory: sourceExport.export_subcategory,
    source_export_ready: sourceExport.export_ready,
    source_export_observe_only: true,
    source_exported_section_count: sourceExport.exported_section_count,
    source_exported_sections_satisfied: sourceExport.exported_sections_satisfied,
    source_review_package_sha256: sourceExport.source_review_package_sha256,
    source_review_package_payload_sha256: sourceExport.source_review_package_payload_sha256,
    source_audit_index_sha256: sourceExport.source_audit_index_sha256,
    source_audit_index_payload_sha256: sourceExport.source_audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceExport.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceExport.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceExport.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceExport.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceExport.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceExport.source_access_decision_payload_sha256,
    source_authority_resolution_state: sourceExport.authority_resolution_state,
    source_policy_decision: sourceExport.policy_decision,
    source_authorization_state: sourceExport.authorization_state,
    source_positive_allow_probe_authorization_state: sourceExport.positive_allow_probe_authorization_state,
    source_access_granted: sourceExport.access_granted,
    source_grants_authorization: sourceExport.grants_authorization,
    source_creates_authorization_artifact: sourceExport.creates_authorization_artifact,
    source_executes_runtime_action: sourceExport.executes_runtime_action,
    source_creates_dispatch: sourceExport.creates_dispatch,
    source_mutates_runtime_state: sourceExport.mutates_runtime_state,
    source_runtime_audit_log_mutated: sourceExport.runtime_audit_log_mutated,
    source_external_audit_log_mutated: sourceExport.external_audit_log_mutated,
    surface_classification: {
      decision_effect: 'OBSERVE_ONLY',
      surface_type: 'INTERNAL_RUNTIME_EXPORT_SURFACE_ONLY',
      authorization_effect: 'NONE',
      runtime_execution_effect: 'NONE',
      dispatch_effect: 'NONE',
      mutation_effect: 'NONE',
      audit_log_append_effect: 'NONE',
      external_review_execution_effect: 'NONE',
      external_submission_effect: 'NONE',
      publication_effect: 'NONE',
      certification_effect: 'NONE'
    },
    stable_access_contract: {
      callable_by_joker_c2: true,
      human_review_readable: true,
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      fail_closed_source_export_required: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,
      surface_does_not_authorize: true,
      surface_does_not_submit: true,
      surface_does_not_publish: true,
      surface_does_not_certify: true
    },
    readable_summary: {
      layer: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE',
      source_layer: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT',
      source_export_id: sourceExport.export_id,
      source_export_scope: sourceExport.export_scope,
      authority_resolution_state: sourceExport.authority_resolution_state,
      policy_decision: sourceExport.policy_decision,
      authorization_state: sourceExport.authorization_state,
      access_granted: false,
      external_review_submission_created: false,
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false
    },
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,
      exports_surface_is_read_only: true,
      stable_access_contract_satisfied: true,
      exported_sections_satisfied: sourceExport.exported_sections_satisfied,
      runtime_read_access_decision_review_package_export_surface_only: true,
      observe_only_surface_semantics: true,
      surface_does_not_authorize: true,
      export_does_not_authorize: true,
      review_package_does_not_authorize: true,
      valid_authority_does_not_authorize: true,
      policy_allow_probe_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutation: true,
      no_runtime_audit_log_append_side_effect: true,
      no_external_review_execution_created: true,
      no_external_review_submission_created: true,
      no_external_review_publication_created: true,
      no_legal_certification_created: true,
      no_eidas_qualification_created: true,
      no_opc_allow_created: true,
      no_deployment_proof_created: true,
      no_production_proof_created: true
    }
  };

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_KIND,
    surface_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-2026-09-23',
    generated_at: generatedAt,
    current_time: currentTime,
    surface_main_commit: '60f3f1d283e903121b7a2245b6b4966efb4e5164',
    source_export_feature_commit: 'fe01ba74376ffdb050f28ae6432059d2a9df141f',
    source_export_merge_commit: '567c7be497b5441899d0a204cfbcfe3b9ddf953b',
    source_export_checkpoint_commit: '60f3f1d283e903121b7a2245b6b4966efb4e5164',
    source_final_chain_audit_commit: 'd99dc3a4269eb7fb3a04acccbd3d910b89546f1f',
    source_export_checkpoint_doc_sha256: '459cd8646910678b70e0ab1707f9644982c695cae157d8fbff680174c8035cd3',
    source_final_chain_audit_doc_sha256: '6a9f1c8893f22c2b756d3c09fd340c1f2cea432822beacbc6d122e5235e11ccc',
    source_export_sha256: sourceExport.evidence_pack_runtime_read_access_decision_review_package_export_sha256,
    source_export_payload_sha256: sourceExport.export_payload_sha256,
    source_review_package_sha256: sourceExport.source_review_package_sha256,
    source_review_package_payload_sha256: sourceExport.source_review_package_payload_sha256,
    source_audit_index_sha256: sourceExport.source_audit_index_sha256,
    source_audit_index_payload_sha256: sourceExport.source_audit_index_payload_sha256,
    source_audit_manifest_sha256: sourceExport.source_audit_manifest_sha256,
    source_audit_manifest_payload_sha256: sourceExport.source_audit_manifest_payload_sha256,
    source_audit_event_sha256: sourceExport.source_audit_event_sha256,
    source_audit_event_payload_sha256: sourceExport.source_audit_event_payload_sha256,
    source_boundary_sha256: sourceExport.source_boundary_sha256,
    source_access_decision_payload_sha256: sourceExport.source_access_decision_payload_sha256,
    surface_payload_sha256: sha256Hex(surfacePayload),
    surface_payload: surfacePayload,
    surface_ready: true,
    surface_scope: 'INTERNAL_RUNTIME_REVIEW_PACKAGE_EXPORT_SURFACE_ONLY',
    surface_consumer: 'JOKER_C2',
    surface_category: 'SURFACE',
    surface_subcategory: 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE',
    exposes_export_only: true,
    exported_section_count: sourceExport.exported_section_count,
    exported_sections_satisfied: sourceExport.exported_sections_satisfied,
    stable_access_contract_satisfied: true,
    observe_only_surface_semantics: true,
    authority_resolution_state: sourceExport.authority_resolution_state,
    policy_decision: sourceExport.policy_decision,
    authorization_state: sourceExport.authorization_state,
    positive_allow_probe_authorization_state: sourceExport.positive_allow_probe_authorization_state,
    access_granted: false,
    grants_authorization: false,
    creates_authorization_artifact: false,
    executes_runtime_action: false,
    creates_dispatch: false,
    mutates_runtime_state: false,
    runtime_audit_log_mutated: false,
    external_audit_log_mutated: false,
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

  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE.READY,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface
};
