'use strict';

const assert = require('assert');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceCapabilityBinding,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-capability-binding');

function bindingResult(input) {
  return createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceCapabilityBinding(input);
}

const actual = bindingResult();
const body =
  actual.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding;
const payload = body.capability_binding_payload;

assert.equal(
  actual.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE.READY
);
assert.equal(
  actual.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_READY'
);
assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_PROTO);
assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_KIND);
assert.equal(
  body.binding_id,
  'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-CAPABILITY-BINDING-2026-09-23'
);
assert.match(
  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256,
  /^[a-f0-9]{64}$/
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_READY');

assert.equal(body.binding_main_commit, 'f3392a071e3b31a37718f3a2c25ed2c3c45bb4a0');
assert.equal(body.source_index_feature_commit, '5e5509f8d34a88fbddffa176634d206d7d24e231');
assert.equal(body.source_index_merge_commit, 'b0bfb2a8d5fd89e7587b638f429212d53694adab');
assert.equal(body.source_index_checkpoint_commit, '4effd9e23cb6ece7c5c9cce9e504063ae54518bc');
assert.equal(body.source_index_final_chain_audit_commit, 'f3392a071e3b31a37718f3a2c25ed2c3c45bb4a0');
assert.equal(body.source_index_checkpoint_doc_sha256, '14088b4bd94c28f7405d228dc4665bdcc13e02d6afe395099caa9b668427e49e');
assert.equal(body.source_final_chain_audit_doc_sha256, '38cab57ea2fe4b7320eb440353e3025133ea33d6eb8e87234d6125ab01085270');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX');

assert.equal(body.source_index_sha256, '3f7c9aa821aac9f53e0ab0652a2cc235795059d55c9797ab32295508e7c7ed68');
assert.equal(body.source_index_payload_sha256, 'b2a72f0cd85873c154a9bf511d0d7882c7972eb278459dc230492563187ea26a');
assert.equal(payload.source_index_sha256, body.source_index_sha256);
assert.equal(payload.source_index_payload_sha256, body.source_index_payload_sha256);
assert.match(body.capability_binding_payload_sha256, /^[a-f0-9]{64}$/);
assert.equal(payload.capability_binding_payload_sha256, body.capability_binding_payload_sha256);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_HASHES');

assert.equal(body.binding_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_ONLY');
assert.equal(body.binding_consumer, 'JOKER_C2');
assert.equal(body.binding_category, 'CAPABILITY_BINDING');
assert.equal(body.binding_subcategory, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING');
assert.equal(body.runtime_read_access_decision_review_package_export_surface_capability_binding_only, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_RECORD');

assert.equal(
  body.capability_id,
  'CAP-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-INTEGRATION-INDEX-2026-09-23'
);
assert.equal(payload.capability.capability_version, 1);
assert.equal(payload.capability.capability_status, 'ACTIVE');
assert.equal(payload.capability.consumer, 'JOKER_C2');
assert.equal(payload.capability.read_only, true);
assert.equal(payload.capability.observe_only, true);
assert.equal(payload.capability.grants_authorization, false);
assert.equal(payload.capability.grants_dispatch, false);
assert.equal(payload.capability.grants_execution, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_CAPABILITY');

assert.equal(
  body.authority_id,
  'AUT-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-INTEGRATION-INDEX-READ-2026-09-23'
);
assert.equal(payload.authority.authority_status, 'ACTIVE');
assert.equal(payload.authority.actor_ref, 'JOKER_C2');
assert.equal(payload.authority.principal_ref, 'HBCE_INTERNAL_RUNTIME');
assert.equal(payload.authority.capability_ref, payload.capability.capability_id);
assert.equal(payload.authority.capability_version, payload.capability.capability_version);
assert.equal(payload.authority.mandate.mandate_status, 'ACTIVE');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_AUTHORITY_BINDING');

assert.equal(payload.authority.scope.consumer, 'JOKER_C2');
assert.equal(payload.authority.scope.access_mode, 'READ_ONLY');
assert.equal(payload.authority.scope.authorization_effect, 'NONE');
assert.equal(payload.authority.scope.dispatch_effect, 'NONE');
assert.equal(payload.authority.scope.runtime_mutation_effect, 'NONE');
assert.equal(payload.capability.target_sha256, body.source_index_sha256);
assert.equal(payload.capability.target_payload_sha256, body.source_index_payload_sha256);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SCOPE');

assert.equal(body.authority_resolution_state, 'VALID');
assert.equal(body.authority_resolution_reason, 'AUTHORITY_VALID');
assert.equal(payload.authority_resolution.state, 'VALID');
assert.equal(payload.authority_resolution.reason, 'AUTHORITY_VALID');
assert.equal(payload.authority_resolution.emits_authorization, false);
assert.equal(payload.authority_resolution.emits_dispatch, false);
assert.equal(payload.authority_resolution.grants_runtime_execution, false);
assert.equal(payload.authority_resolution.valid_authority_does_not_authorize, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_AUTHORITY_VALID');

assert.equal(payload.source_index_ready, true);
assert.equal(payload.source_index_observe_only, true);
assert.equal(payload.source_surface_sha256, '57b0e3db62fe5354acf23b7f394feaf1bbc5197b51f9d9267d4cfe2a5c44fc1f');
assert.equal(payload.source_surface_payload_sha256, '88822ab7450d8c21eb8cc7d96ab1ee2659c597cf127f3246e89925c157923a40');
assert.equal(payload.source_export_sha256, 'aa63a1a9b35aba093831fd7938c323cef5830d893c215cd766c01a6fd8f4c0c4');
assert.equal(payload.source_review_package_sha256, '86a19d81199457ecd6bc8f7d787862675f0403ddb6b34d73f17e8c35cc5b0bb5');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_VIEW');

assert.equal(body.stable_access_contract_satisfied, true);
assert.equal(payload.stable_access_contract.callable_by_joker_c2, true);
assert.equal(payload.stable_access_contract.human_review_readable, true);
assert.equal(payload.stable_access_contract.canonical_json_object, true);
assert.equal(payload.stable_access_contract.deterministic_sha256_bound, true);
assert.equal(payload.stable_access_contract.fail_closed_source_index_required, true);
assert.equal(payload.stable_access_contract.source_index_hash_bound, true);
assert.equal(payload.stable_access_contract.valid_authority_does_not_authorize, true);
assert.equal(payload.stable_access_contract.capability_binding_does_not_authorize, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_ACCESS_CONTRACT');

assert.equal(body.access_granted, false);
assert.equal(body.grants_authorization, false);
assert.equal(payload.readable_summary.access_granted, false);
assert.equal(payload.readable_summary.grants_authorization, false);
assert.equal(payload.readable_summary.authority_resolution_state, 'VALID');
assert.equal(payload.readable_summary.creates_dispatch, false);
assert.equal(payload.readable_summary.executes_runtime_action, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_DECISION_SNAPSHOT');

assert.equal(body.fail_closed_source_index_required, true);
assert.equal(body.source_index_hash_bound, true);
assert.equal(payload.fail_closed_view.source_index_required, true);
assert.equal(payload.fail_closed_view.source_index_hash_bound, true);
assert.equal(payload.fail_closed_view.source_surface_hash_bound, true);
assert.equal(payload.fail_closed_view.source_export_hash_bound, true);
assert.equal(payload.fail_closed_view.source_review_package_hash_bound, true);
assert.equal(payload.fail_closed_view.valid_authority_does_not_authorize, true);
assert.equal(payload.fail_closed_view.authorization_required_for_execution, true);
assert.equal(payload.fail_closed_view.no_dispatch_without_authorization, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_FAIL_CLOSED_VIEW');

assert.equal(payload.assertions.source_index_hash_bound, true);
assert.equal(payload.assertions.source_surface_hash_bound, true);
assert.equal(payload.assertions.source_export_hash_bound, true);
assert.equal(payload.assertions.source_review_package_hash_bound, true);
assert.equal(payload.assertions.stable_access_contract_satisfied, true);
assert.equal(payload.assertions.capability_binding_only, true);
assert.equal(payload.assertions.runtime_read_access_decision_review_package_export_surface_capability_binding_only, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_LINKAGE');

assert.equal(payload.assertions.valid_authority_does_not_authorize, true);
assert.equal(payload.assertions.capability_binding_does_not_authorize, true);
assert.equal(payload.assertions.capability_binding_does_not_dispatch, true);
assert.equal(payload.assertions.capability_binding_does_not_execute, true);
assert.equal(payload.assertions.no_authorization_artifact_created, true);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_NON_AUTHORIZATION');

assert.equal(body.access_granted, false);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
assert.equal(body.executes_runtime_action, false);
assert.equal(body.creates_dispatch, false);
assert.equal(body.mutates_runtime_state, false);
assert.equal(body.runtime_audit_log_mutated, false);
assert.equal(body.external_audit_log_mutated, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_READ_ONLY');

assert.equal(body.public_registry_mutated, false);
assert.equal(body.external_trust_registry_mutated, false);
assert.equal(body.legal_certification_created, false);
assert.equal(body.eidas_qualification_created, false);
assert.equal(body.opc_allow_created, false);
assert.equal(body.deployment_success_proven, false);
assert.equal(body.production_deployment_proven, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_FALSE_EFFECTS');

assert.equal(body.external_review_execution_created, false);
assert.equal(body.external_review_opinion_created, false);
assert.equal(body.external_review_report_created, false);
assert.equal(body.external_review_submission_created, false);
assert.equal(body.external_review_publication_created, false);
assert.equal(payload.assertions.no_external_review_execution_created, true);
assert.equal(payload.assertions.no_external_review_submission_created, true);
assert.equal(payload.assertions.no_external_review_publication_created, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_NO_EXTERNAL_REVIEW');

assert.equal(body.read_capability_binding_only, true);
assert.equal(body.runtime_read_access_decision_review_package_export_surface_capability_binding_only, true);
assert.equal(payload.assertions.canonical_json_object, true);
assert.equal(payload.assertions.deterministic_sha256_bound, true);
assert.equal(payload.readable_summary.legal_certification_created, false);
assert.equal(payload.readable_summary.eidas_qualification_created, false);
assert.equal(payload.readable_summary.opc_allow_created, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_OBSERVE_ONLY_SEMANTICS');

const first =
  bindingResult().evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256;
const second =
  bindingResult().evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256;
assert.equal(first, second);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_DETERMINISTIC');

const invalidGeneratedAt = bindingResult({ generated_at: 'not-a-date' });
assert.equal(
  invalidGeneratedAt.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE.BLOCKED
);
assert.equal(
  invalidGeneratedAt.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_GENERATED_AT_INVALID'
);

const invalidCurrentTime = bindingResult({ current_time: 'not-a-date' });
assert.equal(
  invalidCurrentTime.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE.BLOCKED
);
assert.equal(
  invalidCurrentTime.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_CURRENT_TIME_INVALID'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_INVALID_DATES');

const invalidSourceIndex = bindingResult({
  source_index_result: {
    state: 'BLOCKED',
    reason: 'TEST_BLOCKED'
  }
});
assert.equal(
  invalidSourceIndex.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE.BLOCKED
);
assert.equal(
  invalidSourceIndex.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_BLOCKED'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_BLOCKED');

const invalidHash = bindingResult({
  source_index_result: {
    state: 'READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index: {
      ...body,
      evidence_pack_runtime_read_access_decision_review_package_export_surface_integration_index_sha256:
        '0'.repeat(64),
      index_payload_sha256: '1'.repeat(64)
    }
  }
});
assert.equal(
  invalidHash.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE.BLOCKED
);
assert.equal(
  invalidHash.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_HASH_MISMATCH'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_SOURCE_INDEX_HASH_MISMATCH');
