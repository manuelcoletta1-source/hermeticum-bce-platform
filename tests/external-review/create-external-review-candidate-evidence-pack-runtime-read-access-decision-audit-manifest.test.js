'use strict';

const assert = require('assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-manifest');

const actual = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest();
const body = actual.evidence_pack_runtime_read_access_decision_audit_manifest;
const payload = body.audit_manifest_payload;

{
  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_KIND);
  assert.equal(body.audit_manifest_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-AUDIT-MANIFEST-2026-09-23');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_READY');
}

{
  assert.equal(body.audit_manifest_main_commit, '3e2bf50a40c6a77494f02b6b21fd45064d05badb');
  assert.equal(body.source_audit_event_feature_commit, 'f0ed0a1ec260a470162cd4c54d480dc810c8a876');
  assert.equal(body.source_audit_event_merge_commit, '906242e94cc3483d0083deda9477f8c425758e94');
  assert.equal(body.source_audit_event_checkpoint_commit, '292f7bd00ec6e83b076e3c30bf18af2d3c8598f6');
  assert.equal(body.source_final_chain_audit_commit, '3e2bf50a40c6a77494f02b6b21fd45064d05badb');
  assert.equal(body.source_audit_event_checkpoint_doc_sha256, 'dbf4885d49602d631bcf7b529a7668246612a3092651e0fb2c7084af4c41fe74');
  assert.equal(body.source_final_chain_audit_doc_sha256, 'bc44ec14e12c6950508bcafde71356d53e09e64d87beeade4bdf0a16a24f14c6');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT');
}

{
  assert.equal(body.source_audit_event_sha256, '9a8e78fe149706f82814dc55e2351ea79cbd3a57cbeb14c10fbe258fb521d6ce');
  assert.equal(body.source_audit_event_payload_sha256, '14c162869eeb3260c487e230101afef9be21ae0ffbb66ebd718a07e4b834a3c1');
  assert.equal(payload.source_audit_event_sha256, body.source_audit_event_sha256);
  assert.equal(payload.source_audit_event_payload_sha256, body.source_audit_event_payload_sha256);
  assert.match(body.audit_manifest_payload_sha256, /^[a-f0-9]{64}$/);
  assert.match(body.evidence_pack_runtime_read_access_decision_audit_manifest_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_HASHES');
}

{
  assert.equal(body.audit_manifest_ready, true);
  assert.equal(body.audit_manifest_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_ONLY');
  assert.equal(body.audit_manifest_consumer, 'JOKER_C2');
  assert.equal(body.audit_manifest_category, 'AUDIT_MANIFEST');
  assert.equal(body.audit_manifest_subcategory, 'RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST');
  assert.equal(body.manifests_access_decision_audit_event_only, true);
  assert.equal(body.manifest_entry_count, 2);
  assert.equal(body.manifest_entries_satisfied, true);
  assert.equal(payload.manifest_classification.decision_effect, 'OBSERVE_ONLY');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_RECORD');
}

{
  assert.equal(payload.manifest_entry_count, 2);
  assert.equal(payload.manifest_entries.length, 2);
  assert.equal(payload.manifest_entries[0].entry_type, 'SOURCE_AUDIT_EVENT');
  assert.equal(payload.manifest_entries[0].entry_sha256, body.source_audit_event_sha256);
  assert.equal(payload.manifest_entries[0].entry_payload_sha256, body.source_audit_event_payload_sha256);
  assert.equal(payload.manifest_entries[1].entry_type, 'SOURCE_BOUNDARY_SNAPSHOT');
  assert.equal(payload.manifest_entries[1].entry_sha256, body.source_boundary_sha256);
  assert.equal(payload.manifest_entries[1].entry_payload_sha256, body.source_access_decision_payload_sha256);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_ENTRIES');
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_DECISION_SNAPSHOT');
}

{
  assert.equal(payload.source_audit_event_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_ONLY');
  assert.equal(payload.source_audit_event_consumer, 'JOKER_C2');
  assert.equal(payload.source_audit_event_ready, true);
  assert.equal(payload.source_audit_event_observe_only, true);
  assert.equal(payload.source_runtime_audit_log_mutated, false);
  assert.equal(payload.source_external_audit_log_mutated, false);
  assert.equal(payload.source_access_granted, false);
  assert.equal(payload.source_grants_authorization, false);
  assert.equal(payload.source_creates_authorization_artifact, false);
  assert.equal(payload.source_executes_runtime_action, false);
  assert.equal(payload.source_creates_dispatch, false);
  assert.equal(payload.source_mutates_runtime_state, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_VIEW');
}

{
  const assertions = payload.assertions;
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_NON_AUTHORIZATION');
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_READ_ONLY');
}

{
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_FALSE_EFFECTS');
}

{
  assert.equal(body.observe_only_manifest_semantics, true);
  assert.equal(payload.assertions.observe_only_manifest_semantics, true);
  assert.equal(payload.assertions.source_audit_event_hash_bound, true);
  assert.equal(payload.assertions.manifest_entries_satisfied, true);
  assert.equal(payload.assertions.no_runtime_audit_log_append_side_effect, true);
  assert.equal(payload.assertions.canonical_json_object, true);
  assert.equal(payload.assertions.deterministic_sha256_bound, true);
  assert.equal(payload.assertions.runtime_read_access_decision_audit_manifest_only, true);
  assert.equal(payload.assertions.manifests_runtime_read_access_decision_audit_event, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_OBSERVE_ONLY_SEMANTICS');
}

{
  const first = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest());
  const second = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest());
  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest({
    generated_at: 'invalid-date'
  });
  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest({
    current_time: 'invalid-date'
  });
  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_CURRENT_TIME_INVALID');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_INVALID_DATES');
}

{
  const invalidSourceAuditEvent = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditManifest({
    source_audit_event_input: {
      generated_at: 'invalid-date',
      current_time: '2026-09-23T16:00:00.000Z'
    }
  });
  assert.equal(invalidSourceAuditEvent.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_STATE.BLOCKED);
  assert.equal(invalidSourceAuditEvent.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_BLOCKED');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_MANIFEST_SOURCE_AUDIT_EVENT_BLOCKED');
}
