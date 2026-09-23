'use strict';

const assert = require('assert');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditIndex,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-audit-index');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditManifest
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-audit-manifest');

function indexResult(input) {
  return createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditIndex(input);
}

function sourceAuditManifestBody() {
  return createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionAuditManifest()
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest;
}

const actual = indexResult();
const body =
  actual.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index;
const payload = body.audit_index_payload;

assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.READY);
assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_READY');
assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_PROTO);
assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_KIND);
assert.equal(
  body.audit_index_id,
  'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-ACCESS-DECISION-AUDIT-INDEX-2026-09-23'
);
assert.match(body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_sha256, /^[a-f0-9]{64}$/);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_READY');

assert.equal(body.audit_index_main_commit, '4c0532290efec9b081cce0f97b08dfdd3f931d66');
assert.equal(body.source_audit_manifest_feature_commit, '06af1c2ed9905143514a0cd3d7049f7bd8e7d7f3');
assert.equal(body.source_audit_manifest_merge_commit, '8b1069119e100e096f25f4548caa3bf9c3debf00');
assert.equal(body.source_audit_manifest_checkpoint_commit, '26986da947e37f4105c9bf6ee1c4e48847975d62');
assert.equal(body.source_audit_manifest_final_chain_audit_commit, '4c0532290efec9b081cce0f97b08dfdd3f931d66');
assert.equal(body.source_audit_manifest_checkpoint_doc_sha256, '9552afd62a64a77debe63d595ed013a8262a492346ea058ad60c58194cab8b78');
assert.equal(body.source_final_chain_audit_doc_sha256, '5cf0507f08df39fe253d0630e358cf9e1a41f6fc4a29aebea9df6becde00fb9c');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST');

assert.equal(body.source_audit_manifest_sha256, '5ad5fcc305f928efda53c7e07cc2b6dc19c54a80d0b9e3eec96301342087ec5a');
assert.equal(body.source_audit_manifest_payload_sha256, 'c4a6aef21c78b0b198ac0e2396a2ca17bc5a4e220d1f7814fd278a8c7de522f0');
assert.equal(payload.source_audit_manifest_sha256, body.source_audit_manifest_sha256);
assert.equal(payload.source_audit_manifest_payload_sha256, body.source_audit_manifest_payload_sha256);
assert.equal(payload.audit_index_payload_sha256, body.audit_index_payload_sha256);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_HASHES');

assert.equal(body.audit_index_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_ONLY');
assert.equal(body.audit_index_consumer, 'JOKER_C2');
assert.equal(body.audit_index_category, 'AUDIT_INDEX');
assert.equal(body.audit_index_subcategory, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX');
assert.equal(body.index_entries_satisfied, true);
assert.equal(body.manifest_entries_satisfied, true);
assert.equal(body.observe_only_index_semantics, true);
assert.equal(payload.index_classification.decision_effect, 'OBSERVE_ONLY');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_RECORD');

assert.equal(payload.index_entries.length, 4);
assert.equal(payload.index_entries[0].entry_type, 'SOURCE_AUDIT_MANIFEST');
assert.equal(payload.index_entries[1].entry_type, 'SOURCE_AUDIT_EVENT');
assert.equal(payload.index_entries[2].entry_type, 'SOURCE_BOUNDARY_SNAPSHOT');
assert.equal(payload.index_entries[3].entry_type, 'SOURCE_CAPABILITY_BINDING_SNAPSHOT');
assert.equal(payload.index_entries[0].entry_observe_only, true);
assert.equal(payload.index_entries[1].entry_append_only, true);
assert.equal(payload.index_entries[2].entry_access_granted, false);
assert.equal(payload.index_entries[3].entry_access_granted, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_ENTRIES');

assert.equal(body.authority_resolution_state, 'VALID');
assert.equal(body.policy_decision, 'UNEVALUATED');
assert.equal(body.policy_decision_reason, 'POLICY_EVALUATION_DEFERRED');
assert.equal(body.authorization_state, 'UNRESOLVED');
assert.equal(body.authorization_reason, 'POLICY_NOT_RESOLVED');
assert.equal(body.positive_allow_probe_authorization_state, 'UNRESOLVED');
assert.equal(payload.decision_snapshot.access_granted, false);
assert.equal(payload.decision_snapshot.creates_dispatch, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_DECISION_SNAPSHOT');

assert.equal(payload.source_audit_manifest_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_MANIFEST_ONLY');
assert.equal(payload.source_audit_manifest_consumer, 'JOKER_C2');
assert.equal(payload.source_audit_manifest_observe_only, true);
assert.equal(payload.source_manifest_entries_satisfied, true);
assert.equal(payload.source_access_granted, false);
assert.equal(payload.source_grants_authorization, false);
assert.equal(payload.source_executes_runtime_action, false);
assert.equal(payload.source_creates_dispatch, false);
assert.equal(payload.source_mutates_runtime_state, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_VIEW');

assert.equal(body.source_audit_event_sha256, '4fc422aca588cd1894fb089a0e2975c3404b2949da5855984b83aef0b5259c3e');
assert.equal(body.source_audit_event_payload_sha256, 'fca7ec5372660e985065eb16f8a3962e6dd2c9da9b187e3fd31d307c6099250d');
assert.equal(body.source_boundary_sha256, 'bf75c55f1a4cc1ffcc3d0e634426ccb9b2f2ce72983070002da569791fdb0274');
assert.equal(body.source_boundary_payload_sha256, '6da4f545dbae6a25e7ed8f30b2ed08f65e1c73ef56bf6594affa6388d8f27a11');
assert.equal(body.source_binding_sha256, 'cb0e03f17c9f144e284d2b5fbfb265617893991c7c7ecefef2294825f2eb2f4f');
assert.equal(body.source_index_sha256, '3f7c9aa821aac9f53e0ab0652a2cc235795059d55c9797ab32295508e7c7ed68');
assert.equal(body.source_surface_sha256, '57b0e3db62fe5354acf23b7f394feaf1bbc5197b51f9d9267d4cfe2a5c44fc1f');
assert.equal(body.source_export_sha256, 'aa63a1a9b35aba093831fd7938c323cef5830d893c215cd766c01a6fd8f4c0c4');
assert.equal(body.source_review_package_sha256, '86a19d81199457ecd6bc8f7d787862675f0403ddb6b34d73f17e8c35cc5b0bb5');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_LINKAGE');

assert.equal(payload.stable_access_contract.deterministic_sha256_bound, true);
assert.equal(payload.stable_access_contract.source_audit_manifest_hash_bound, true);
assert.equal(payload.stable_access_contract.index_entries_satisfied, true);
assert.equal(payload.stable_access_contract.manifest_entries_satisfied, true);
assert.equal(payload.stable_access_contract.observe_only_index_semantics, true);
assert.equal(payload.stable_access_contract.audit_index_does_not_authorize, true);
assert.equal(payload.stable_access_contract.audit_index_does_not_dispatch, true);
assert.equal(payload.stable_access_contract.audit_index_does_not_execute, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_ACCESS_CONTRACT');

assert.equal(payload.assertions.audit_index_does_not_authorize, true);
assert.equal(payload.assertions.audit_index_does_not_dispatch, true);
assert.equal(payload.assertions.audit_index_does_not_execute, true);
assert.equal(payload.assertions.no_authorization_artifact_created, true);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
assert.equal(body.creates_dispatch, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_NON_AUTHORIZATION');

assert.equal(body.access_granted, false);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
assert.equal(body.executes_runtime_action, false);
assert.equal(body.creates_dispatch, false);
assert.equal(body.mutates_runtime_state, false);
assert.equal(body.runtime_audit_log_mutated, false);
assert.equal(body.external_audit_log_mutated, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_READ_ONLY');

assert.equal(body.public_registry_mutated, false);
assert.equal(body.external_trust_registry_mutated, false);
assert.equal(body.legal_certification_created, false);
assert.equal(body.eidas_qualification_created, false);
assert.equal(body.opc_allow_created, false);
assert.equal(body.deployment_success_proven, false);
assert.equal(body.production_deployment_proven, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_FALSE_EFFECTS');

assert.equal(body.external_review_execution_created, false);
assert.equal(body.external_review_opinion_created, false);
assert.equal(body.external_review_report_created, false);
assert.equal(body.external_review_submission_created, false);
assert.equal(body.external_review_publication_created, false);
assert.equal(payload.assertions.no_external_review_execution_created, true);
assert.equal(payload.assertions.no_external_review_submission_created, true);
assert.equal(payload.assertions.no_external_review_publication_created, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_NO_EXTERNAL_REVIEW');

assert.equal(payload.index_view.source_audit_manifest_required, true);
assert.equal(payload.index_view.source_audit_manifest_hash_bound, true);
assert.equal(payload.index_view.index_entries_count, 4);
assert.equal(payload.index_view.index_entries_satisfied, true);
assert.equal(payload.index_view.manifest_entries_satisfied, true);
assert.equal(payload.index_view.runtime_state_mutated_by_index, false);
assert.equal(payload.index_view.external_registry_mutated_by_index, false);
assert.equal(payload.assertions.index_entries_satisfied, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_INDEX_SEMANTICS');

assert.equal(body.audit_index_does_not_authorize, true);
assert.equal(body.observe_only_index_semantics, true);
assert.equal(payload.assertions.observe_only_index_semantics, true);
assert.equal(payload.assertions.observe_only_manifest_semantics_preserved, true);
assert.equal(payload.assertions.append_only_source_event_preserved, true);
assert.equal(payload.assertions.canonical_json_object, true);
assert.equal(payload.assertions.deterministic_sha256_bound, true);
assert.equal(payload.readable_summary.legal_certification_created, false);
assert.equal(payload.readable_summary.eidas_qualification_created, false);
assert.equal(payload.readable_summary.opc_allow_created, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_OBSERVE_ONLY_SEMANTICS');

const first =
  indexResult().evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_sha256;
const second =
  indexResult().evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_index_sha256;
assert.equal(first, second);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_DETERMINISTIC');

const invalidGeneratedAt = indexResult({ generated_at: 'not-a-date' });
assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
assert.equal(
  invalidGeneratedAt.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_GENERATED_AT_INVALID'
);
const invalidCurrentTime = indexResult({ current_time: 'not-a-date' });
assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
assert.equal(
  invalidCurrentTime.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_CURRENT_TIME_INVALID'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_INVALID_DATES');

const invalidSourceAuditManifest = indexResult({
  source_audit_manifest_result: {
    state: 'BLOCKED',
    reason: 'SOURCE_AUDIT_MANIFEST_BLOCKED_FOR_TEST'
  }
});
assert.equal(invalidSourceAuditManifest.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
assert.equal(
  invalidSourceAuditManifest.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_BLOCKED'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_BLOCKED');

const invalidHashBody = {
  ...sourceAuditManifestBody(),
  evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_sha256: '0'.repeat(64),
  audit_manifest_payload_sha256: 'c4a6aef21c78b0b198ac0e2396a2ca17bc5a4e220d1f7814fd278a8c7de522f0'
};
const invalidHash = indexResult({
  source_audit_manifest_result: {
    state: 'READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest: invalidHashBody
  }
});
assert.equal(invalidHash.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
assert.equal(
  invalidHash.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_HASH_MISMATCH'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_HASH_MISMATCH');

const invalidObserveOnlyBody = {
  ...sourceAuditManifestBody(),
  evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_sha256: '5ad5fcc305f928efda53c7e07cc2b6dc19c54a80d0b9e3eec96301342087ec5a',
  audit_manifest_payload_sha256: 'c4a6aef21c78b0b198ac0e2396a2ca17bc5a4e220d1f7814fd278a8c7de522f0',
  audit_manifest_does_not_authorize: false
};
const invalidObserveOnly = indexResult({
  source_audit_manifest_result: {
    state: 'READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest: invalidObserveOnlyBody
  }
});
assert.equal(invalidObserveOnly.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
assert.equal(
  invalidObserveOnly.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_NOT_OBSERVE_ONLY'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_NOT_OBSERVE_ONLY');

const invalidFalseEffectsBody = {
  ...sourceAuditManifestBody(),
  evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest_sha256: '5ad5fcc305f928efda53c7e07cc2b6dc19c54a80d0b9e3eec96301342087ec5a',
  audit_manifest_payload_sha256: 'c4a6aef21c78b0b198ac0e2396a2ca17bc5a4e220d1f7814fd278a8c7de522f0',
  external_review_execution_created: true
};
const invalidFalseEffects = indexResult({
  source_audit_manifest_result: {
    state: 'READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_audit_manifest: invalidFalseEffectsBody
  }
});
assert.equal(invalidFalseEffects.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
assert.equal(
  invalidFalseEffects.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_FALSE_EFFECTS_INVALID'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_FALSE_EFFECTS_INVALID');
