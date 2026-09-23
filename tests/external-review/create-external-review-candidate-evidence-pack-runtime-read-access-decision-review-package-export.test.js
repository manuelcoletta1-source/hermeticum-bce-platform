'use strict';

const assert = require('assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export');

const actual = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport();
const body = actual.evidence_pack_runtime_read_access_decision_review_package_export;
const payload = body.export_payload;

{
  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.EXPORTED);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_EXPORTED');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_KIND);
  assert.equal(body.export_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-2026-09-23');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_EXPORTED');
}

{
  assert.equal(body.export_main_commit, 'deaf4d32ac7abb839cb2b785ff42e2609965daf7');
  assert.equal(body.source_review_package_feature_commit, '39b09692531e364dd784ac4444076097044eb3c4');
  assert.equal(body.source_review_package_merge_commit, '053f7b6ef8539553f6c72de222bfb22b63ba6177');
  assert.equal(body.source_review_package_checkpoint_commit, 'f62608bf03c4d5b6711a1546f171b48c27882471');
  assert.equal(body.source_final_chain_audit_commit, 'deaf4d32ac7abb839cb2b785ff42e2609965daf7');
  assert.equal(body.source_review_package_checkpoint_doc_sha256, 'a97cf41cefc8fef381235ce0973c5819229e56097c0bf9accc5086f59acffa79');
  assert.equal(body.source_final_chain_audit_doc_sha256, '7de639c2c079fa2dc1e7e8f0458a498b8d126d1ff76d855da17c5e740bbc616d');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SOURCE_REVIEW_PACKAGE');
}

{
  assert.equal(body.source_review_package_sha256, '86a19d81199457ecd6bc8f7d787862675f0403ddb6b34d73f17e8c35cc5b0bb5');
  assert.equal(body.source_review_package_payload_sha256, 'a35f536a15b968be11bccd8a298dbee92a0773e2df32aa1b56f7c6f7e65b525a');
  assert.equal(payload.source_review_package_sha256, body.source_review_package_sha256);
  assert.equal(payload.source_review_package_payload_sha256, body.source_review_package_payload_sha256);
  assert.match(body.export_payload_sha256, /^[a-f0-9]{64}$/);
  assert.match(body.evidence_pack_runtime_read_access_decision_review_package_export_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_HASHES');
}

{
  assert.equal(body.export_ready, true);
  assert.equal(body.export_scope, 'INTERNAL_RUNTIME_REVIEW_PACKAGE_EXPORT_ONLY');
  assert.equal(body.export_consumer, 'JOKER_C2');
  assert.equal(body.export_category, 'EXPORT');
  assert.equal(body.export_subcategory, 'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT');
  assert.equal(body.exports_review_package_only, true);
  assert.equal(body.exported_section_count, 4);
  assert.equal(body.exported_sections_satisfied, true);
  assert.equal(payload.export_classification.decision_effect, 'OBSERVE_ONLY');
  assert.equal(payload.export_classification.external_submission_effect, 'NONE');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_RECORD');
}

{
  assert.equal(payload.exported_sections.length, 4);
  assert.equal(payload.exported_sections[0].exported_section_type, 'SOURCE_AUDIT_INDEX');
  assert.equal(payload.exported_sections[0].exported_section_sha256, body.source_audit_index_sha256);
  assert.equal(payload.exported_sections[1].exported_section_type, 'SOURCE_AUDIT_MANIFEST');
  assert.equal(payload.exported_sections[1].exported_section_sha256, body.source_audit_manifest_sha256);
  assert.equal(payload.exported_sections[2].exported_section_type, 'SOURCE_AUDIT_EVENT');
  assert.equal(payload.exported_sections[2].exported_section_sha256, body.source_audit_event_sha256);
  assert.equal(payload.exported_sections[3].exported_section_type, 'SOURCE_BOUNDARY_SNAPSHOT');
  assert.equal(payload.exported_sections[3].exported_section_sha256, body.source_boundary_sha256);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SECTIONS');
}

{
  assert.equal(body.authority_resolution_state, 'VALID');
  assert.equal(body.policy_decision, 'UNEVALUATED');
  assert.equal(body.authorization_state, 'UNRESOLVED');
  assert.equal(body.positive_allow_probe_authorization_state, 'UNRESOLVED');
  assert.equal(body.access_granted, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_DECISION_SNAPSHOT');
}

{
  assert.equal(payload.source_review_package_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_ONLY');
  assert.equal(payload.source_review_package_consumer, 'JOKER_C2');
  assert.equal(payload.source_review_package_ready, true);
  assert.equal(payload.source_review_package_observe_only, true);
  assert.equal(payload.source_review_package_sections_satisfied, true);
  assert.equal(payload.source_review_package_section_count, 4);
  assert.equal(payload.source_index_entries_satisfied, true);
  assert.equal(payload.source_manifest_entries_satisfied, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SOURCE_REVIEW_PACKAGE_VIEW');
}

{
  assert.equal(body.review_package_sections_satisfied, true);
  assert.equal(body.index_entries_satisfied, true);
  assert.equal(body.manifest_entries_satisfied, true);
  assert.equal(payload.assertions.review_package_sections_satisfied, true);
  assert.equal(payload.assertions.index_entries_satisfied, true);
  assert.equal(payload.assertions.manifest_entries_satisfied, true);
  assert.equal(payload.assertions.source_review_package_hash_bound, true);
  assert.equal(payload.assertions.exports_runtime_read_access_decision_review_package, true);
  assert.equal(payload.assertions.runtime_read_access_decision_review_package_export_only, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_LINKAGE');
}

{
  const assertions = payload.assertions;
  assert.equal(assertions.export_does_not_authorize, true);
  assert.equal(assertions.review_package_does_not_authorize, true);
  assert.equal(assertions.audit_index_does_not_authorize, true);
  assert.equal(assertions.valid_authority_does_not_authorize, true);
  assert.equal(assertions.policy_allow_probe_does_not_authorize, true);
  assert.equal(assertions.unresolved_authorization_blocks_execution, true);
  assert.equal(assertions.no_authorization_artifact_created, true);
  assert.equal(assertions.no_dispatch_created, true);
  assert.equal(assertions.no_runtime_state_mutation, true);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_NON_AUTHORIZATION');
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_READ_ONLY');
}

{
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_FALSE_EFFECTS');
}

{
  assert.equal(body.external_review_execution_created, false);
  assert.equal(body.external_review_opinion_created, false);
  assert.equal(body.external_review_report_created, false);
  assert.equal(body.external_review_submission_created, false);
  assert.equal(body.external_review_publication_created, false);
  assert.equal(payload.export_boundary.external_review_submission_created, false);
  assert.equal(payload.export_boundary.external_review_publication_created, false);
  assert.equal(payload.assertions.no_external_review_submission_created, true);
  assert.equal(payload.assertions.no_external_review_publication_created, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_NO_EXTERNAL_REVIEW');
}

{
  assert.equal(body.observe_only_export_semantics, true);
  assert.equal(payload.assertions.observe_only_export_semantics, true);
  assert.equal(payload.assertions.no_runtime_audit_log_append_side_effect, true);
  assert.equal(payload.assertions.canonical_json_object, true);
  assert.equal(payload.assertions.deterministic_sha256_bound, true);
  assert.equal(payload.export_classification.audit_log_append_effect, 'NONE');
  assert.equal(payload.export_classification.publication_effect, 'NONE');
  assert.equal(payload.export_classification.certification_effect, 'NONE');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_OBSERVE_ONLY_SEMANTICS');
}

{
  assert.equal(payload.export_boundary.internal_runtime_export_only, true);
  assert.equal(payload.export_boundary.source_review_package_required, true);
  assert.equal(payload.export_boundary.source_review_package_hash_bound, true);
  assert.equal(payload.export_boundary.review_package_sections_preserved, true);
  assert.equal(payload.export_classification.export_type, 'INTERNAL_RUNTIME_EXPORT_ONLY');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_BOUNDARY');
}

{
  const first = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport());
  const second = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport());
  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport({
    generated_at: 'invalid-date'
  });
  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport({
    current_time: 'invalid-date'
  });
  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_CURRENT_TIME_INVALID');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_INVALID_DATES');
}

{
  const invalidSourceReviewPackage = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExport({
    source_review_package_input: {
      generated_at: 'invalid-date',
      current_time: '2026-09-23T16:45:00.000Z'
    }
  });
  assert.equal(invalidSourceReviewPackage.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_STATE.BLOCKED);
  assert.equal(invalidSourceReviewPackage.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SOURCE_REVIEW_PACKAGE_BLOCKED');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SOURCE_REVIEW_PACKAGE_BLOCKED');
}
