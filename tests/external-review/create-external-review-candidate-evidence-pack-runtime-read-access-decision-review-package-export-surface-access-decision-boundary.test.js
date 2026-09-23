'use strict';

const assert = require('assert');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionBoundary,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-boundary');

function boundaryResult(input) {
  return createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionBoundary(input);
}

const actual = boundaryResult();
const body =
  actual.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary;
const payload = body.access_decision_payload;

assert.equal(
  actual.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.READY
);
assert.equal(
  actual.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_READY'
);
assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_PROTO);
assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_KIND);
assert.equal(
  body.boundary_id,
  'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-ACCESS-DECISION-BOUNDARY-2026-09-23'
);
assert.match(
  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary_sha256,
  /^[a-f0-9]{64}$/
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_READY');

assert.equal(body.boundary_main_commit, '57d34db0295b1b8bcc905c72eef990d778398c33');
assert.equal(body.source_binding_feature_commit, '14c27a11489a49cc748c8df988768283820c7877');
assert.equal(body.source_binding_merge_commit, 'a24277e42da8cacb5746c7e1a91eb5dce6995820');
assert.equal(body.source_binding_checkpoint_commit, '64f24d602ebac3fb76cac315ce71a3583797c5c3');
assert.equal(body.source_binding_final_chain_audit_commit, '57d34db0295b1b8bcc905c72eef990d778398c33');
assert.equal(body.source_binding_checkpoint_doc_sha256, '55bbd129b92c1380677966bb18c79898925cf00c39c822ea2299e70df55fe91a');
assert.equal(body.source_final_chain_audit_doc_sha256, '1f42bb1336ed288195a7111c5d4b73e5c917105f5e23d97f9744622383b59a8a');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING');

assert.equal(body.source_binding_sha256, 'cb0e03f17c9f144e284d2b5fbfb265617893991c7c7ecefef2294825f2eb2f4f');
assert.equal(body.source_binding_payload_sha256, '09fd3d302e21a9117823d8f365b57b256b65a86c49cd77450a83e01adee6d5e2');
assert.equal(payload.source_binding_sha256, body.source_binding_sha256);
assert.equal(payload.source_binding_payload_sha256, body.source_binding_payload_sha256);
assert.match(body.access_decision_payload_sha256, /^[a-f0-9]{64}$/);
assert.equal(payload.access_decision_payload_sha256, body.access_decision_payload_sha256);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_HASHES');

assert.equal(body.boundary_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_ONLY');
assert.equal(body.boundary_consumer, 'JOKER_C2');
assert.equal(body.boundary_category, 'ACCESS_DECISION_BOUNDARY');
assert.equal(body.boundary_subcategory, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY');
assert.equal(body.runtime_read_access_decision_review_package_export_surface_access_decision_boundary_only, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_RECORD');

assert.equal(body.authority_resolution_state, 'VALID');
assert.equal(body.authority_resolution_reason, 'AUTHORITY_VALID');
assert.equal(payload.source_authority_resolution.state, 'VALID');
assert.equal(payload.source_authority_resolution.reason, 'AUTHORITY_VALID');
assert.equal(payload.source_authority_resolution.emits_authorization, false);
assert.equal(payload.source_authority_resolution.emits_dispatch, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_AUTHORITY_VALID');

assert.equal(body.policy_decision, 'UNEVALUATED');
assert.equal(body.policy_decision_reason, 'POLICY_EVALUATION_DEFERRED');
assert.equal(payload.policy_decision.decision, 'UNEVALUATED');
assert.equal(payload.policy_decision.reason, 'POLICY_EVALUATION_DEFERRED');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_POLICY_DEFERRED');

assert.equal(body.authorization_state, 'UNRESOLVED');
assert.equal(body.authorization_reason, 'POLICY_NOT_RESOLVED');
assert.equal(payload.authorization_resolution.state, 'UNRESOLVED');
assert.equal(payload.authorization_resolution.reason, 'POLICY_NOT_RESOLVED');
assert.equal(payload.decision_snapshot.access_granted, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_AUTHORIZATION_UNRESOLVED');

assert.equal(body.positive_allow_probe_authorization_state, 'UNRESOLVED');
assert.equal(body.positive_allow_probe_authorization_reason, 'POSITIVE_AUTHORIZATION_DEFERRED');
assert.equal(payload.positive_allow_probe_authorization_resolution.state, 'UNRESOLVED');
assert.equal(payload.positive_allow_probe_authorization_resolution.reason, 'POSITIVE_AUTHORIZATION_DEFERRED');
assert.equal(payload.assertions.positive_allow_probe_does_not_authorize, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_ALLOW_PROBE_FAIL_CLOSED');

assert.equal(payload.source_binding_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_ONLY');
assert.equal(payload.source_binding_consumer, 'JOKER_C2');
assert.equal(payload.source_binding_read_only, true);
assert.equal(payload.source_binding_access_granted, false);
assert.equal(payload.source_binding_grants_authorization, false);
assert.equal(payload.source_binding_creates_dispatch, false);
assert.equal(payload.source_binding_executes_runtime_action, false);
assert.equal(payload.source_binding_mutates_runtime_state, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_VIEW');

assert.equal(payload.source_index_sha256, '3f7c9aa821aac9f53e0ab0652a2cc235795059d55c9797ab32295508e7c7ed68');
assert.equal(payload.source_index_payload_sha256, 'b2a72f0cd85873c154a9bf511d0d7882c7972eb278459dc230492563187ea26a');
assert.equal(payload.source_surface_sha256, '57b0e3db62fe5354acf23b7f394feaf1bbc5197b51f9d9267d4cfe2a5c44fc1f');
assert.equal(payload.source_surface_payload_sha256, '88822ab7450d8c21eb8cc7d96ab1ee2659c597cf127f3246e89925c157923a40');
assert.equal(payload.source_export_sha256, 'aa63a1a9b35aba093831fd7938c323cef5830d893c215cd766c01a6fd8f4c0c4');
assert.equal(payload.source_review_package_sha256, '86a19d81199457ecd6bc8f7d787862675f0403ddb6b34d73f17e8c35cc5b0bb5');
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_CHAIN_LINKAGE');

assert.equal(body.stable_access_contract_satisfied, true);
assert.equal(payload.stable_access_contract.deterministic_sha256_bound, true);
assert.equal(payload.stable_access_contract.source_binding_hash_bound, true);
assert.equal(payload.stable_access_contract.access_decision_boundary_only, true);
assert.equal(payload.stable_access_contract.fail_closed_source_binding_required, true);
assert.equal(payload.stable_access_contract.valid_authority_does_not_authorize, true);
assert.equal(payload.stable_access_contract.policy_allow_does_not_authorize, true);
assert.equal(payload.stable_access_contract.unresolved_authorization_blocks_execution, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_ACCESS_CONTRACT');

assert.equal(body.access_granted, false);
assert.equal(body.grants_authorization, false);
assert.equal(payload.readable_summary.access_granted, false);
assert.equal(payload.readable_summary.grants_authorization, false);
assert.equal(payload.readable_summary.policy_decision, 'UNEVALUATED');
assert.equal(payload.readable_summary.authorization_state, 'UNRESOLVED');
assert.equal(payload.readable_summary.creates_dispatch, false);
assert.equal(payload.readable_summary.executes_runtime_action, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_DECISION_SNAPSHOT');

assert.equal(body.fail_closed_source_binding_required, true);
assert.equal(body.source_binding_hash_bound, true);
assert.equal(payload.fail_closed_view.source_binding_required, true);
assert.equal(payload.fail_closed_view.source_binding_hash_bound, true);
assert.equal(payload.fail_closed_view.policy_unevaluated_blocks_authorization, true);
assert.equal(payload.fail_closed_view.authorization_required_for_execution, true);
assert.equal(payload.fail_closed_view.unresolved_authorization_blocks_execution, true);
assert.equal(payload.fail_closed_view.positive_allow_probe_does_not_authorize, true);
assert.equal(payload.fail_closed_view.no_dispatch_without_authorization, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_FAIL_CLOSED_VIEW');

assert.equal(payload.assertions.source_binding_hash_bound, true);
assert.equal(payload.assertions.source_index_hash_bound, true);
assert.equal(payload.assertions.source_surface_hash_bound, true);
assert.equal(payload.assertions.source_export_hash_bound, true);
assert.equal(payload.assertions.source_review_package_hash_bound, true);
assert.equal(payload.assertions.access_decision_boundary_only, true);
assert.equal(payload.assertions.runtime_read_access_decision_review_package_export_surface_access_decision_boundary_only, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_LINKAGE');

assert.equal(payload.assertions.valid_authority_does_not_authorize, true);
assert.equal(payload.assertions.policy_allow_does_not_authorize, true);
assert.equal(payload.assertions.unresolved_authorization_blocks_execution, true);
assert.equal(payload.assertions.no_authorization_artifact_created, true);
assert.equal(payload.assertions.no_dispatch_created, true);
assert.equal(payload.assertions.no_runtime_state_mutated, true);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_NON_AUTHORIZATION');

assert.equal(body.access_granted, false);
assert.equal(body.grants_authorization, false);
assert.equal(body.creates_authorization_artifact, false);
assert.equal(body.executes_runtime_action, false);
assert.equal(body.creates_dispatch, false);
assert.equal(body.mutates_runtime_state, false);
assert.equal(body.runtime_audit_log_mutated, false);
assert.equal(body.external_audit_log_mutated, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_READ_ONLY');

assert.equal(body.public_registry_mutated, false);
assert.equal(body.external_trust_registry_mutated, false);
assert.equal(body.legal_certification_created, false);
assert.equal(body.eidas_qualification_created, false);
assert.equal(body.opc_allow_created, false);
assert.equal(body.deployment_success_proven, false);
assert.equal(body.production_deployment_proven, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_FALSE_EFFECTS');

assert.equal(body.external_review_execution_created, false);
assert.equal(body.external_review_opinion_created, false);
assert.equal(body.external_review_report_created, false);
assert.equal(body.external_review_submission_created, false);
assert.equal(body.external_review_publication_created, false);
assert.equal(payload.assertions.no_external_review_execution_created, true);
assert.equal(payload.assertions.no_external_review_submission_created, true);
assert.equal(payload.assertions.no_external_review_publication_created, true);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_NO_EXTERNAL_REVIEW');

assert.equal(body.access_decision_boundary_only, true);
assert.equal(body.runtime_read_access_decision_review_package_export_surface_access_decision_boundary_only, true);
assert.equal(payload.assertions.canonical_json_object, true);
assert.equal(payload.assertions.deterministic_sha256_bound, true);
assert.equal(payload.readable_summary.legal_certification_created, false);
assert.equal(payload.readable_summary.eidas_qualification_created, false);
assert.equal(payload.readable_summary.opc_allow_created, false);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_OBSERVE_ONLY_SEMANTICS');

const first =
  boundaryResult().evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary_sha256;
const second =
  boundaryResult().evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary
    .evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary_sha256;
assert.equal(first, second);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_DETERMINISTIC');

const invalidGeneratedAt = boundaryResult({ generated_at: 'not-a-date' });
assert.equal(
  invalidGeneratedAt.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED
);
assert.equal(
  invalidGeneratedAt.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_GENERATED_AT_INVALID'
);

const invalidCurrentTime = boundaryResult({ current_time: 'not-a-date' });
assert.equal(
  invalidCurrentTime.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED
);
assert.equal(
  invalidCurrentTime.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_CURRENT_TIME_INVALID'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_INVALID_DATES');

const invalidSourceBinding = boundaryResult({
  source_binding_result: {
    state: 'BLOCKED',
    reason: 'TEST_BLOCKED'
  }
});
assert.equal(
  invalidSourceBinding.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED
);
assert.equal(
  invalidSourceBinding.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_BLOCKED'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_BLOCKED');

const invalidHash = boundaryResult({
  source_binding_result: {
    state: 'READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding: {
      ...body,
      evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256:
        '0'.repeat(64),
      capability_binding_payload_sha256: '1'.repeat(64)
    }
  }
});
assert.equal(
  invalidHash.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED
);
assert.equal(
  invalidHash.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_HASH_MISMATCH'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_HASH_MISMATCH');

const invalidReadOnly = boundaryResult({
  source_binding_result: {
    state: 'READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding: {
      ...body,
      evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256:
        'cb0e03f17c9f144e284d2b5fbfb265617893991c7c7ecefef2294825f2eb2f4f',
      capability_binding_payload_sha256: '09fd3d302e21a9117823d8f365b57b256b65a86c49cd77450a83e01adee6d5e2',
      access_granted: true
    }
  }
});
assert.equal(
  invalidReadOnly.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED
);
assert.equal(
  invalidReadOnly.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_NOT_READ_ONLY'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_NOT_READ_ONLY');

const invalidFalseEffects = boundaryResult({
  source_binding_result: {
    state: 'READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding: {
      ...body,
      evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256:
        'cb0e03f17c9f144e284d2b5fbfb265617893991c7c7ecefef2294825f2eb2f4f',
      capability_binding_payload_sha256: '09fd3d302e21a9117823d8f365b57b256b65a86c49cd77450a83e01adee6d5e2',
      read_capability_binding_only: true,
      external_review_execution_created: true
    }
  }
});
assert.equal(
  invalidFalseEffects.state,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED
);
assert.equal(
  invalidFalseEffects.reason,
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_FALSE_EFFECTS_INVALID'
);
console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_FALSE_EFFECTS_INVALID');
