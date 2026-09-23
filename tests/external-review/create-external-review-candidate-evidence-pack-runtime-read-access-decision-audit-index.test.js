'use strict';

const assert = require('assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-index');

const actual = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex();
const body = actual.evidence_pack_runtime_read_access_decision_audit_index;
const payload = body.audit_index_payload;

{
  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_KIND);
  assert.equal(body.audit_index_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-AUDIT-INDEX-2026-09-23');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_READY');
}

{
  assert.equal(body.audit_index_main_commit, 'fe4f60731054d7f784b34e6502f42884546f5562');
  assert.equal(body.source_audit_manifest_feature_commit, '9d57501a6abe8fc8aa8af249d604f6c8d495bdaa');
  assert.equal(body.source_audit_manifest_merge_commit, 'c64a15a8926ebde21c2ac4cef87c2bdefe619e6a');
  assert.equal(body.source_audit_manifest_checkpoint_commit, 'b799d41cb09b2381389760c2d67548615fd41c68');
  assert.equal(body.source_final_chain_audit_commit, 'fe4f60731054d7f784b34e6502f42884546f5562');
  assert.equal(body.source_audit_manifest_checkpoint_doc_sha256, 'ebe06c4175ff76a19b8e65964b79f7e5d845aded7d820bf87d868d532cdd7a8d');
  assert.equal(body.source_final_chain_audit_doc_sha256, 'ed380f23da9dc75ba5603027f4027f211457ad63ef1cc1524a8172e94c71c60b');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST');
}

{
  assert.equal(body.source_audit_manifest_sha256, '214d524b3c871e5254d9a46acebaaa8ada429b649f800a4936e4df0d66b5d67c');
  assert.equal(body.source_audit_manifest_payload_sha256, 'dc09fa37542cf125b42e7419d455e854db0ca4f7b62238a1287ca05ac76e736f');
  assert.equal(payload.source_audit_manifest_sha256, body.source_audit_manifest_sha256);
  assert.equal(payload.source_audit_manifest_payload_sha256, body.source_audit_manifest_payload_sha256);
  assert.match(body.audit_index_payload_sha256, /^[a-f0-9]{64}$/);
  assert.match(body.evidence_pack_runtime_read_access_decision_audit_index_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_HASHES');
}

{
  assert.equal(body.audit_index_ready, true);
  assert.equal(body.audit_index_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_ONLY');
  assert.equal(body.audit_index_consumer, 'JOKER_C2');
  assert.equal(body.audit_index_category, 'AUDIT_INDEX');
  assert.equal(body.audit_index_subcategory, 'RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX');
  assert.equal(body.indexes_access_decision_audit_manifest_only, true);
  assert.equal(body.index_entry_count, 3);
  assert.equal(body.index_entries_satisfied, true);
  assert.equal(payload.index_classification.decision_effect, 'OBSERVE_ONLY');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_RECORD');
}

{
  assert.equal(payload.index_entry_count, 3);
  assert.equal(payload.index_entries.length, 3);
  assert.equal(payload.index_entries[0].entry_type, 'SOURCE_AUDIT_MANIFEST');
  assert.equal(payload.index_entries[0].entry_sha256, body.source_audit_manifest_sha256);
  assert.equal(payload.index_entries[0].entry_payload_sha256, body.source_audit_manifest_payload_sha256);
  assert.equal(payload.index_entries[1].entry_type, 'SOURCE_AUDIT_EVENT');
  assert.equal(payload.index_entries[1].entry_sha256, body.source_audit_event_sha256);
  assert.equal(payload.index_entries[1].entry_payload_sha256, body.source_audit_event_payload_sha256);
  assert.equal(payload.index_entries[2].entry_type, 'SOURCE_BOUNDARY_SNAPSHOT');
  assert.equal(payload.index_entries[2].entry_sha256, body.source_boundary_sha256);
  assert.equal(payload.index_entries[2].entry_payload_sha256, body.source_access_decision_payload_sha256);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_ENTRIES');
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_DECISION_SNAPSHOT');
}

{
  assert.equal(payload.source_audit_manifest_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_ONLY');
  assert.equal(payload.source_audit_manifest_consumer, 'JOKER_C2');
  assert.equal(payload.source_audit_manifest_ready, true);
  assert.equal(payload.source_audit_manifest_observe_only, true);
  assert.equal(payload.source_manifest_entries_satisfied, true);
  assert.equal(payload.source_manifest_entry_count, 2);
  assert.equal(payload.source_runtime_audit_log_mutated, false);
  assert.equal(payload.source_external_audit_log_mutated, false);
  assert.equal(payload.source_access_granted, false);
  assert.equal(payload.source_grants_authorization, false);
  assert.equal(payload.source_creates_authorization_artifact, false);
  assert.equal(payload.source_executes_runtime_action, false);
  assert.equal(payload.source_creates_dispatch, false);
  assert.equal(payload.source_mutates_runtime_state, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_VIEW');
}

{
  assert.equal(body.manifest_entries_satisfied, true);
  assert.equal(payload.assertions.index_entries_satisfied, true);
  assert.equal(payload.assertions.manifest_entries_satisfied, true);
  assert.equal(payload.assertions.source_audit_manifest_hash_bound, true);
  assert.equal(payload.assertions.indexes_runtime_read_access_decision_audit_manifest, true);
  assert.equal(payload.assertions.runtime_read_access_decision_audit_index_only, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_LINKAGE');
}

{
  const assertions = payload.assertions;
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_NON_AUTHORIZATION');
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_READ_ONLY');
}

{
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_FALSE_EFFECTS');
}

{
  assert.equal(body.observe_only_index_semantics, true);
  assert.equal(payload.assertions.observe_only_index_semantics, true);
  assert.equal(payload.assertions.no_runtime_audit_log_append_side_effect, true);
  assert.equal(payload.assertions.canonical_json_object, true);
  assert.equal(payload.assertions.deterministic_sha256_bound, true);
  assert.equal(payload.index_classification.audit_log_append_effect, 'NONE');
  assert.equal(payload.index_classification.runtime_mutation_effect, 'NONE');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_OBSERVE_ONLY_SEMANTICS');
}

{
  const first = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex());
  const second = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex());
  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex({
    generated_at: 'invalid-date'
  });
  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex({
    current_time: 'invalid-date'
  });
  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_CURRENT_TIME_INVALID');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_INVALID_DATES');
}

{
  const invalidSourceAuditManifest = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditIndex({
    source_audit_manifest_input: {
      generated_at: 'invalid-date',
      current_time: '2026-09-23T16:15:00.000Z'
    }
  });
  assert.equal(invalidSourceAuditManifest.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_STATE.BLOCKED);
  assert.equal(invalidSourceAuditManifest.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_BLOCKED');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_INDEX_SOURCE_AUDIT_MANIFEST_BLOCKED');
}
