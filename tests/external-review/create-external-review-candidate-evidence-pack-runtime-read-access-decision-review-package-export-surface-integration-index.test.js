'use strict';

const assert = require('node:assert/strict');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-integration-index');

function indexResult(input = {}) {
  const actual =
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex(input);
  assert.equal(
    actual.state,
    HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE.READY
  );
  return actual;
}

const actual = indexResult();
const body = actual.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index;
const payload = body.index_payload;

assert.equal(
  actual.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_READY'
);
assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_PROTO);
assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_KIND);
assert.equal(
  body.index_id,
  'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-INTEGRATION-INDEX-2026-09-23'
);
assert.match(
  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256,
  /^[a-f0-9]{64}$/
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_READY');

assert.equal(body.index_main_commit, '08feb4ac562e945d947ac9dd95b869b3c7c4ad4b');
assert.equal(body.source_surface_feature_commit, '99746abf47c9eb2a90d5e1a84f81bbdb4b9a5674');
assert.equal(body.source_surface_merge_commit, '6848d39a64bbcebd3cf956cdf98c0e149a123cdb');
assert.equal(body.source_surface_checkpoint_commit, '273a1ff660cc7097e423db4e0a82de8281b2805d');
assert.equal(body.source_surface_final_chain_audit_commit, '08feb4ac562e945d947ac9dd95b869b3c7c4ad4b');
assert.equal(body.source_surface_checkpoint_doc_sha256, 'b32630115ad6162d2e76835563745ea3a78d6bcf27ff712b4d23fa456164e04d');
assert.equal(body.source_final_chain_audit_doc_sha256, '067d3ff2f569388203ca6ae5caa945e5506048328c03be667415299ab8ef7d83');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_SOURCE_SURFACE');

assert.equal(body.source_surface_sha256, '57b0e3db62fe5354acf23b7f394feaf1bbc5197b51f9d9267d4cfe2a5c44fc1f');
assert.equal(body.source_surface_payload_sha256, '88822ab7450d8c21eb8cc7d96ab1ee2659c597cf127f3246e89925c157923a40');
assert.equal(payload.source_surface_sha256, body.source_surface_sha256);
assert.equal(payload.source_surface_payload_sha256, body.source_surface_payload_sha256);
assert.match(body.index_payload_sha256, /^[a-f0-9]{64}$/);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_HASHES');

assert.equal(body.index_ready, true);
assert.equal(
  body.index_scope,
  'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_ONLY'
);
assert.equal(body.index_consumer, 'JOKER_C2');
assert.equal(body.index_category, 'INTEGRATION_INDEX');
assert.equal(body.index_subcategory, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX');
assert.equal(body.active_entrypoint_count, 1);
assert.equal(body.integration_entry_count, 7);
assert.equal(body.integration_entries_satisfied, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_RECORD');

assert.equal(body.source_export_sha256, 'aa63a1a9b35aba093831fd7938c323cef5830d893c215cd766c01a6fd8f4c0c4');
assert.equal(body.source_export_payload_sha256, 'df6aace8678182fd397ad5381cb916b358e60926253e46816eb2b98e681dbcb7');
assert.equal(body.source_review_package_sha256, '86a19d81199457ecd6bc8f7d787862675f0403ddb6b34d73f17e8c35cc5b0bb5');
assert.equal(body.source_review_package_payload_sha256, 'a35f536a15b968be11bccd8a298dbee92a0773e2df32aa1b56f7c6f7e65b525a');
assert.equal(payload.source_export_sha256, body.source_export_sha256);
assert.equal(payload.source_review_package_sha256, body.source_review_package_sha256);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_CHAIN');

assert.equal(payload.integration_entries.length, 7);
assert.equal(payload.integration_entries[0].entry_key, 'runtime_read_access_decision_review_package_export_surface');
assert.equal(payload.integration_entries[0].role, 'SOURCE_EXPORT_SURFACE');
assert.equal(payload.integration_entries[0].active_entrypoint, true);
assert.equal(payload.integration_entries[1].role, 'SOURCE_EXPORT');
assert.equal(payload.integration_entries[2].role, 'SOURCE_REVIEW_PACKAGE');
assert.equal(payload.integration_entries[3].role, 'SOURCE_AUDIT_INDEX');
assert.equal(payload.integration_entries[4].role, 'SOURCE_AUDIT_MANIFEST');
assert.equal(payload.integration_entries[5].role, 'SOURCE_AUDIT_EVENT');
assert.equal(payload.integration_entries[6].role, 'SOURCE_BOUNDARY');
assert.equal(payload.integration_entries_satisfied, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_ENTRIES');

assert.equal(
  body.active_runtime_entrypoint.module_path,
  'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface.js'
);
assert.equal(
  body.active_runtime_entrypoint.function_name,
  'createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurface'
);
assert.equal(body.active_runtime_entrypoint.consumer, 'JOKER_C2');
assert.equal(body.active_runtime_entrypoint.access_mode, 'READ_ONLY');
assert.equal(payload.active_runtime_entrypoint.function_name, body.active_runtime_entrypoint.function_name);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_ACTIVE_ENTRYPOINT');

assert.equal(payload.source_surface_scope, 'INTERNAL_RUNTIME_REVIEW_PACKAGE_EXPORT_SURFACE_ONLY');
assert.equal(payload.source_surface_consumer, 'JOKER_C2');
assert.equal(payload.source_surface_ready, true);
assert.equal(payload.source_surface_observe_only, true);
assert.equal(payload.source_surface_human_review_readable, true);
assert.equal(payload.index_payload_sha256, undefined);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_PAYLOAD');

assert.equal(body.stable_access_contract_satisfied, true);
assert.equal(payload.stable_access_contract.callable_by_joker_c2, true);
assert.equal(payload.stable_access_contract.human_review_readable, true);
assert.equal(payload.stable_access_contract.canonical_json_object, true);
assert.equal(payload.stable_access_contract.deterministic_sha256_bound, true);
assert.equal(payload.stable_access_contract.fail_closed_source_export_required, true);
assert.equal(payload.stable_access_contract.source_export_hash_bound, true);
assert.equal(payload.stable_access_contract.surface_does_not_authorize, true);
assert.equal(body.fail_closed_source_surface_required, true);
assert.equal(body.source_surface_hash_bound, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_ACCESS_CONTRACT');

assert.equal(body.authority_resolution_state, 'VALID');
assert.equal(body.policy_decision, 'UNEVALUATED');
assert.equal(body.authorization_state, 'UNRESOLVED');
assert.equal(body.positive_allow_probe_authorization_state, 'UNRESOLVED');
assert.equal(body.access_granted, false);
assert.equal(payload.readable_summary.access_granted, false);
assert.equal(payload.readable_summary.authorization_state, 'UNRESOLVED');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_DECISION_SNAPSHOT');

assert.equal(payload.fail_closed_view.source_surface_required, true);
assert.equal(payload.fail_closed_view.source_surface_hash_bound, true);
assert.equal(payload.fail_closed_view.source_export_hash_bound, true);
assert.equal(payload.fail_closed_view.source_review_package_hash_bound, true);
assert.equal(payload.fail_closed_view.authorization_required_for_execution, true);
assert.equal(payload.fail_closed_view.unresolved_authorization_blocks_execution, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_FAIL_CLOSED_VIEW');

assert.equal(payload.assertions.source_surface_hash_bound, true);
assert.equal(payload.assertions.source_export_hash_bound, true);
assert.equal(payload.assertions.source_review_package_hash_bound, true);
assert.equal(payload.assertions.stable_access_contract_satisfied, true);
assert.equal(payload.assertions.runtime_read_access_decision_review_package_export_surface_integration_index_only, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_LINKAGE');

assert.equal(payload.assertions.integration_index_does_not_authorize, true);
assert.equal(payload.assertions.source_surface_does_not_authorize, true);
assert.equal(payload.assertions.unresolved_authorization_blocks_execution, true);
assert.equal(payload.assertions.no_authorization_artifact_created, true);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_NON_AUTHORIZATION');

assert.equal(body.access_granted, false);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
assert.equal(body.executes_runtime_action, false);
assert.equal(body.creates_dispatch, false);
assert.equal(body.mutates_runtime_state, false);
assert.equal(body.runtime_audit_log_mutated, false);
assert.equal(body.external_audit_log_mutated, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_READ_ONLY');

assert.equal(body.public_registry_mutated, false);
assert.equal(body.external_trust_registry_mutated, false);
assert.equal(body.legal_certification_created, false);
assert.equal(body.eidas_qualification_created, false);
assert.equal(body.opc_allow_created, false);
assert.equal(body.deployment_success_proven, false);
assert.equal(body.production_deployment_proven, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_FALSE_EFFECTS');

assert.equal(body.external_review_execution_created, false);
assert.equal(body.external_review_opinion_created, false);
assert.equal(body.external_review_report_created, false);
assert.equal(body.external_review_submission_created, false);
assert.equal(body.external_review_publication_created, false);
assert.equal(payload.assertions.no_external_review_execution_created, true);
assert.equal(payload.assertions.no_external_review_submission_created, true);
assert.equal(payload.assertions.no_external_review_publication_created, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_NO_EXTERNAL_REVIEW');

assert.equal(body.observe_only_index_semantics, true);
assert.equal(payload.assertions.canonical_json_object, true);
assert.equal(payload.assertions.deterministic_sha256_bound, true);
assert.equal(payload.assertions.no_runtime_audit_log_append_side_effect, true);
assert.equal(payload.readable_summary.legal_certification_created, false);
assert.equal(payload.readable_summary.eidas_qualification_created, false);
assert.equal(payload.readable_summary.opc_allow_created, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_OBSERVE_ONLY_SEMANTICS');

const first =
  indexResult().evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256;
const second =
  indexResult().evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256;
assert.equal(first, second);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_DETERMINISTIC');

const invalidGeneratedAt =
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex({
    generated_at: 'not-a-date'
  });
assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE.BLOCKED);
assert.equal(
  invalidGeneratedAt.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_GENERATED_AT_INVALID'
);

const invalidCurrentTime =
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex({
    current_time: 'not-a-date'
  });
assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE.BLOCKED);
assert.equal(
  invalidCurrentTime.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_CURRENT_TIME_INVALID'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_INVALID_DATES');

const invalidSourceSurface =
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceIntegrationIndex({
    source_surface_result: {
      state: 'BLOCKED',
      reason: 'TEST_BLOCKED'
    }
  });
assert.equal(invalidSourceSurface.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_STATE.BLOCKED);
assert.equal(
  invalidSourceSurface.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_SOURCE_SURFACE_BLOCKED'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_INTEGRATION_INDEX_SOURCE_SURFACE_BLOCKED');
