'use strict';

const assert = require('assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package');

const actual = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage();
const body = actual.evidence_pack_runtime_read_access_decision_review_package;
const payload = body.review_package_payload;

{
  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_KIND);
  assert.equal(body.review_package_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-2026-09-23');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_READY');
}

{
  assert.equal(body.review_package_main_commit, '08b69806479568558210622913c9c0ab59dc3663');
  assert.equal(body.source_audit_index_feature_commit, '2e8939d1de47b09033ac77bd62c6c1666492cf7d');
  assert.equal(body.source_audit_index_merge_commit, '3d4dad256652a423221218b145fab01b5c8ab5dc');
  assert.equal(body.source_audit_index_checkpoint_commit, 'fbfdcb5a96be8d939c9d56daed8725321fb3984e');
  assert.equal(body.source_final_chain_audit_commit, '08b69806479568558210622913c9c0ab59dc3663');
  assert.equal(body.source_audit_index_checkpoint_doc_sha256, '2488672289b585ebeaf794e10d6c5a9cc13e7eaf3f3de89791d4e311c60c6c05');
  assert.equal(body.source_final_chain_audit_doc_sha256, '9cdcea5d6c20d941a30c3c5545b630852d975562e5ed77bd00555e1da1b35a69');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX');
}

{
  assert.equal(body.source_audit_index_sha256, 'dac8349bc03ead91491efa69ba5341de5a9f4f710b35ee621719d873aaf76faa');
  assert.equal(body.source_audit_index_payload_sha256, 'b879241dd8137acb51023e149e2d6b67c4d769c8e56aae3fe826765832caa129');
  assert.equal(payload.source_audit_index_sha256, body.source_audit_index_sha256);
  assert.equal(payload.source_audit_index_payload_sha256, body.source_audit_index_payload_sha256);
  assert.match(body.review_package_payload_sha256, /^[a-f0-9]{64}$/);
  assert.match(body.evidence_pack_runtime_read_access_decision_review_package_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_HASHES');
}

{
  assert.equal(body.review_package_ready, true);
  assert.equal(body.review_package_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_ONLY');
  assert.equal(body.review_package_consumer, 'JOKER_C2');
  assert.equal(body.review_package_category, 'REVIEW_PACKAGE');
  assert.equal(body.review_package_subcategory, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE');
  assert.equal(body.packages_access_decision_audit_index_only, true);
  assert.equal(body.review_package_section_count, 4);
  assert.equal(body.review_package_sections_satisfied, true);
  assert.equal(payload.review_package_classification.decision_effect, 'OBSERVE_ONLY');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_RECORD');
}

{
  assert.equal(payload.review_package_section_count, 4);
  assert.equal(payload.review_package_sections.length, 4);
  assert.equal(payload.review_package_sections[0].section_type, 'SOURCE_AUDIT_INDEX');
  assert.equal(payload.review_package_sections[0].section_sha256, body.source_audit_index_sha256);
  assert.equal(payload.review_package_sections[0].section_payload_sha256, body.source_audit_index_payload_sha256);
  assert.equal(payload.review_package_sections[1].section_type, 'SOURCE_AUDIT_MANIFEST');
  assert.equal(payload.review_package_sections[1].section_sha256, body.source_audit_manifest_sha256);
  assert.equal(payload.review_package_sections[1].section_payload_sha256, body.source_audit_manifest_payload_sha256);
  assert.equal(payload.review_package_sections[2].section_type, 'SOURCE_AUDIT_EVENT');
  assert.equal(payload.review_package_sections[2].section_sha256, body.source_audit_event_sha256);
  assert.equal(payload.review_package_sections[3].section_type, 'SOURCE_BOUNDARY_SNAPSHOT');
  assert.equal(payload.review_package_sections[3].section_sha256, body.source_boundary_sha256);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_SECTIONS');
}

{
  assert.equal(body.authority_resolution_state, 'VALID');
  assert.equal(body.policy_decision, 'UNEVALUATED');
  assert.equal(body.authorization_state, 'UNRESOLVED');
  assert.equal(body.positive_allow_probe_authorization_state, 'UNRESOLVED');
  assert.equal(body.access_granted, false);
  assert.equal(payload.source_authority_resolution_state, 'VALID');
  assert.equal(payload.source_policy_decision, 'UNEVALUATED');
  assert.equal(payload.source_authorization_state, 'UNRESOLVED');
  assert.equal(payload.source_positive_allow_probe_authorization_state, 'UNRESOLVED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_DECISION_SNAPSHOT');
}

{
  assert.equal(payload.source_audit_index_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_ONLY');
  assert.equal(payload.source_audit_index_consumer, 'JOKER_C2');
  assert.equal(payload.source_audit_index_ready, true);
  assert.equal(payload.source_audit_index_observe_only, true);
  assert.equal(payload.source_index_entries_satisfied, true);
  assert.equal(payload.source_index_entry_count, 3);
  assert.equal(payload.source_manifest_entries_satisfied, true);
  assert.equal(payload.source_runtime_audit_log_mutated, false);
  assert.equal(payload.source_external_audit_log_mutated, false);
  assert.equal(payload.source_access_granted, false);
  assert.equal(payload.source_grants_authorization, false);
  assert.equal(payload.source_creates_authorization_artifact, false);
  assert.equal(payload.source_executes_runtime_action, false);
  assert.equal(payload.source_creates_dispatch, false);
  assert.equal(payload.source_mutates_runtime_state, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_VIEW');
}

{
  assert.equal(body.index_entries_satisfied, true);
  assert.equal(body.manifest_entries_satisfied, true);
  assert.equal(payload.assertions.review_package_sections_satisfied, true);
  assert.equal(payload.assertions.index_entries_satisfied, true);
  assert.equal(payload.assertions.manifest_entries_satisfied, true);
  assert.equal(payload.assertions.source_audit_index_hash_bound, true);
  assert.equal(payload.assertions.packages_runtime_read_access_decision_audit_index, true);
  assert.equal(payload.assertions.runtime_read_access_decision_review_package_only, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_LINKAGE');
}

{
  const assertions = payload.assertions;
  assert.equal(assertions.review_package_does_not_authorize, true);
  assert.equal(assertions.audit_index_does_not_authorize, true);
  assert.equal(assertions.audit_manifest_does_not_authorize, true);
  assert.equal(assertions.audit_event_does_not_authorize, true);
  assert.equal(assertions.valid_authority_does_not_authorize, true);
  assert.equal(assertions.policy_allow_probe_does_not_authorize, true);
  assert.equal(assertions.unresolved_authorization_blocks_execution, true);
  assert.equal(assertions.no_authorization_artifact_created, true);
  assert.equal(assertions.no_dispatch_created, true);
  assert.equal(assertions.no_runtime_state_mutation, true);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_NON_AUTHORIZATION');
}

{
  assert.equal(body.access_granted, false);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  assert.equal(body.executes_runtime_action, false);
  assert.equal(body.creates_dispatch, false);
  assert.equal(body.mutates_runtime_state, false);
  assert.equal(body.runtime_audit_log_mutated, false);
  assert.equal(body.external_audit_log_mutated, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_READ_ONLY');
}

{
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_FALSE_EFFECTS');
}

{
  assert.equal(body.external_review_execution_created, false);
  assert.equal(body.external_review_opinion_created, false);
  assert.equal(body.external_review_report_created, false);
  assert.equal(body.external_review_submission_created, false);
  assert.equal(body.external_review_publication_created, false);
  assert.equal(payload.assertions.no_external_review_submission_created, true);
  assert.equal(payload.assertions.no_legal_certification_created, true);
  assert.equal(payload.assertions.no_eidas_qualification_created, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_NO_EXTERNAL_REVIEW');
}

{
  assert.equal(body.observe_only_review_package_semantics, true);
  assert.equal(payload.assertions.observe_only_review_package_semantics, true);
  assert.equal(payload.assertions.no_runtime_audit_log_append_side_effect, true);
  assert.equal(payload.assertions.canonical_json_object, true);
  assert.equal(payload.assertions.deterministic_sha256_bound, true);
  assert.equal(payload.review_package_classification.audit_log_append_effect, 'NONE');
  assert.equal(payload.review_package_classification.external_submission_effect, 'NONE');
  assert.equal(payload.review_package_classification.certification_effect, 'NONE');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_OBSERVE_ONLY_SEMANTICS');
}

{
  const first = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage());
  const second = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage());
  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage({
    generated_at: 'invalid-date'
  });
  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage({
    current_time: 'invalid-date'
  });
  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_CURRENT_TIME_INVALID');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_INVALID_DATES');
}

{
  const invalidSourceAuditIndex = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackage({
    source_audit_index_input: {
      generated_at: 'invalid-date',
      current_time: '2026-09-23T16:30:00.000Z'
    }
  });
  assert.equal(invalidSourceAuditIndex.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_STATE.BLOCKED);
  assert.equal(invalidSourceAuditIndex.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_BLOCKED');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_SOURCE_AUDIT_INDEX_BLOCKED');
}
