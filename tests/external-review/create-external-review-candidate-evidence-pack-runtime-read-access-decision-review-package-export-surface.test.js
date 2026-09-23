'use strict';

const assert = require('assert');
const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface');

const actual = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface();
const body = actual.evidence_pack_runtime_read_access_decision_review_package_export_surface;
const payload = body.surface_payload;

assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE.READY);
assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_READY');
assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_PROTO);
assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_KIND);
assert.equal(body.surface_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-2026-09-23');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_READY');

assert.equal(body.surface_main_commit, '60f3f1d283e903121b7a2245b6b4966efb4e5164');
assert.equal(body.source_export_feature_commit, 'fe01ba74376ffdb050f28ae6432059d2a9df141f');
assert.equal(body.source_export_merge_commit, '567c7be497b5441899d0a204cfbcfe3b9ddf953b');
assert.equal(body.source_export_checkpoint_commit, '60f3f1d283e903121b7a2245b6b4966efb4e5164');
assert.equal(body.source_final_chain_audit_commit, 'd99dc3a4269eb7fb3a04acccbd3d910b89546f1f');
assert.equal(body.source_export_checkpoint_doc_sha256, '459cd8646910678b70e0ab1707f9644982c695cae157d8fbff680174c8035cd3');
assert.equal(body.source_final_chain_audit_doc_sha256, '6a9f1c8893f22c2b756d3c09fd340c1f2cea432822beacbc6d122e5235e11ccc');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_SOURCE_EXPORT');

assert.equal(body.source_export_sha256, 'aa63a1a9b35aba093831fd7938c323cef5830d893c215cd766c01a6fd8f4c0c4');
assert.equal(body.source_export_payload_sha256, 'df6aace8678182fd397ad5381cb916b358e60926253e46816eb2b98e681dbcb7');
assert.equal(payload.source_export_sha256, body.source_export_sha256);
assert.equal(payload.source_export_payload_sha256, body.source_export_payload_sha256);
assert.match(body.surface_payload_sha256, /^[a-f0-9]{64}$/);
assert.match(body.evidence_pack_runtime_read_access_decision_review_package_export_surface_sha256, /^[a-f0-9]{64}$/);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_HASHES');

assert.equal(body.surface_ready, true);
assert.equal(body.surface_scope, 'INTERNAL_RUNTIME_REVIEW_PACKAGE_EXPORT_SURFACE_ONLY');
assert.equal(body.surface_consumer, 'JOKER_C2');
assert.equal(body.surface_category, 'SURFACE');
assert.equal(body.surface_subcategory, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE');
assert.equal(body.exposes_export_only, true);
assert.equal(body.exported_section_count, 4);
assert.equal(body.exported_sections_satisfied, true);
assert.equal(payload.surface_classification.decision_effect, 'OBSERVE_ONLY');
assert.equal(payload.surface_classification.publication_effect, 'NONE');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_RECORD');

assert.equal(body.stable_access_contract_satisfied, true);
assert.equal(payload.stable_access_contract.callable_by_joker_c2, true);
assert.equal(payload.stable_access_contract.human_review_readable, true);
assert.equal(payload.stable_access_contract.canonical_json_object, true);
assert.equal(payload.stable_access_contract.deterministic_sha256_bound, true);
assert.equal(payload.stable_access_contract.fail_closed_source_export_required, true);
assert.equal(payload.stable_access_contract.source_export_hash_bound, true);
assert.equal(payload.stable_access_contract.surface_does_not_authorize, true);
assert.equal(payload.stable_access_contract.surface_does_not_submit, true);
assert.equal(payload.stable_access_contract.surface_does_not_publish, true);
assert.equal(payload.stable_access_contract.surface_does_not_certify, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_CONTRACT');

assert.equal(body.authority_resolution_state, 'VALID');
assert.equal(body.policy_decision, 'UNEVALUATED');
assert.equal(body.authorization_state, 'UNRESOLVED');
assert.equal(body.positive_allow_probe_authorization_state, 'UNRESOLVED');
assert.equal(body.access_granted, false);
assert.equal(payload.readable_summary.authority_resolution_state, 'VALID');
assert.equal(payload.readable_summary.policy_decision, 'UNEVALUATED');
assert.equal(payload.readable_summary.authorization_state, 'UNRESOLVED');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_DECISION_SNAPSHOT');

assert.equal(payload.source_export_scope, 'INTERNAL_RUNTIME_REVIEW_PACKAGE_EXPORT_ONLY');
assert.equal(payload.source_export_consumer, 'JOKER_C2');
assert.equal(payload.source_export_ready, true);
assert.equal(payload.source_export_observe_only, true);
assert.equal(payload.source_exported_section_count, 4);
assert.equal(payload.source_exported_sections_satisfied, true);
assert.equal(payload.source_access_granted, false);
assert.equal(payload.source_grants_authorization, false);
assert.equal(payload.source_creates_authorization_artifact, false);
assert.equal(payload.source_executes_runtime_action, false);
assert.equal(payload.source_creates_dispatch, false);
assert.equal(payload.source_mutates_runtime_state, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_SOURCE_EXPORT_VIEW');

assert.equal(payload.source_review_package_sha256, body.source_review_package_sha256);
assert.equal(payload.source_review_package_payload_sha256, body.source_review_package_payload_sha256);
assert.equal(payload.source_audit_index_sha256, body.source_audit_index_sha256);
assert.equal(payload.source_audit_manifest_sha256, body.source_audit_manifest_sha256);
assert.equal(payload.source_audit_event_sha256, body.source_audit_event_sha256);
assert.equal(payload.source_boundary_sha256, body.source_boundary_sha256);
assert.equal(payload.assertions.source_export_hash_bound, true);
assert.equal(payload.assertions.source_review_package_hash_bound, true);
assert.equal(payload.assertions.exported_sections_satisfied, true);
assert.equal(payload.assertions.runtime_read_access_decision_review_package_export_surface_only, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_LINKAGE');

assert.equal(payload.readable_summary.layer, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE');
assert.equal(payload.readable_summary.source_layer, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT');
assert.equal(payload.readable_summary.access_granted, false);
assert.equal(payload.readable_summary.external_review_submission_created, false);
assert.equal(payload.readable_summary.legal_certification_created, false);
assert.equal(payload.readable_summary.eidas_qualification_created, false);
assert.equal(payload.readable_summary.opc_allow_created, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_READABLE_SUMMARY');

assert.equal(payload.assertions.surface_does_not_authorize, true);
assert.equal(payload.assertions.export_does_not_authorize, true);
assert.equal(payload.assertions.review_package_does_not_authorize, true);
assert.equal(payload.assertions.valid_authority_does_not_authorize, true);
assert.equal(payload.assertions.policy_allow_probe_does_not_authorize, true);
assert.equal(payload.assertions.unresolved_authorization_blocks_execution, true);
assert.equal(payload.assertions.no_authorization_artifact_created, true);
assert.equal(payload.assertions.no_dispatch_created, true);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_NON_AUTHORIZATION');

assert.equal(body.access_granted, false);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
assert.equal(body.executes_runtime_action, false);
assert.equal(body.creates_dispatch, false);
assert.equal(body.mutates_runtime_state, false);
assert.equal(body.runtime_audit_log_mutated, false);
assert.equal(body.external_audit_log_mutated, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_READ_ONLY');

assert.equal(body.public_registry_mutated, false);
assert.equal(body.external_trust_registry_mutated, false);
assert.equal(body.legal_certification_created, false);
assert.equal(body.eidas_qualification_created, false);
assert.equal(body.opc_allow_created, false);
assert.equal(body.deployment_success_proven, false);
assert.equal(body.production_deployment_proven, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_FALSE_EFFECTS');

assert.equal(body.external_review_execution_created, false);
assert.equal(body.external_review_opinion_created, false);
assert.equal(body.external_review_report_created, false);
assert.equal(body.external_review_submission_created, false);
assert.equal(body.external_review_publication_created, false);
assert.equal(payload.assertions.no_external_review_execution_created, true);
assert.equal(payload.assertions.no_external_review_submission_created, true);
assert.equal(payload.assertions.no_external_review_publication_created, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_NO_EXTERNAL_REVIEW');

assert.equal(body.observe_only_surface_semantics, true);
assert.equal(payload.assertions.observe_only_surface_semantics, true);
assert.equal(payload.assertions.no_runtime_audit_log_append_side_effect, true);
assert.equal(payload.assertions.canonical_json_object, true);
assert.equal(payload.assertions.deterministic_sha256_bound, true);
assert.equal(payload.surface_classification.audit_log_append_effect, 'NONE');
assert.equal(payload.surface_classification.external_submission_effect, 'NONE');
assert.equal(payload.surface_classification.certification_effect, 'NONE');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_OBSERVE_ONLY_SEMANTICS');

assert.equal(payload.surface_classification.surface_type, 'INTERNAL_RUNTIME_EXPORT_SURFACE_ONLY');
assert.equal(payload.stable_access_contract.fail_closed_source_export_required, true);
assert.equal(payload.stable_access_contract.source_export_hash_bound, true);
assert.equal(payload.stable_access_contract.source_review_package_hash_bound, true);
assert.equal(payload.assertions.exports_surface_is_read_only, true);
assert.equal(payload.assertions.stable_access_contract_satisfied, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_BOUNDARY');

const first = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface());
const second = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface());
assert.equal(first, second);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_DETERMINISTIC');

const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface({
  generated_at: 'invalid-date'
});
assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE.BLOCKED);
assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_GENERATED_AT_INVALID');

const invalidCurrentTime = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface({
  current_time: 'invalid-date'
});
assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE.BLOCKED);
assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CURRENT_TIME_INVALID');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INVALID_DATES');

const invalidSourceExport = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface({
  source_export_result: {
    state: 'BLOCKED',
    reason: 'TEST_BLOCKED'
  }
});
assert.equal(invalidSourceExport.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_STATE.BLOCKED);
assert.equal(invalidSourceExport.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_SOURCE_EXPORT_BLOCKED');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_SOURCE_EXPORT_BLOCKED');
