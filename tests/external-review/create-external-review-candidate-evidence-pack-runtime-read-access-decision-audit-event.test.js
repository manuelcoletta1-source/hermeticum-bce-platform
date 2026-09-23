'use strict';

const assert = require('assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-audit-event');

const actual = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent();
const body = actual.evidence_pack_runtime_read_access_decision_audit_event;
const payload = body.audit_event_payload;

{
  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_KIND);
  assert.equal(body.audit_event_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-AUDIT-EVENT-2026-09-23');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_READY');
}

{
  assert.equal(body.audit_event_main_commit, '0f88cb0ae004d1223b84bcd0ce92467cf0310d29');
  assert.equal(body.source_boundary_feature_commit, '1270849865c5b85de01f95845a1c9da6f60461bb');
  assert.equal(body.source_boundary_merge_commit, 'ece89dd10a3db414a53ba343c243997c610e2958');
  assert.equal(body.source_boundary_checkpoint_commit, '42be617efe5f566ef2fdd2f6916480d06444696b');
  assert.equal(body.source_final_chain_audit_commit, '0f88cb0ae004d1223b84bcd0ce92467cf0310d29');
  assert.equal(body.source_boundary_checkpoint_doc_sha256, '72e3a613cfff3b2492d9ab8eedfb3311707de16b835e4c5380a47c70ad53365d');
  assert.equal(body.source_final_chain_audit_doc_sha256, '384a1a1e12db81d29e24c7f64c247f9453c866f7bad049a88cb79e6f35656fff');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY');
}

{
  assert.equal(body.source_boundary_sha256, 'c76d9015dd1eb70d3c6b8f0c62309855ef9b008ed3f6cb49612d3959a2dc57d8');
  assert.equal(body.source_access_decision_payload_sha256, '171bc00f44608769d51e3fe892bf1b00ec98280ac00155a17eae135abe87787a');
  assert.equal(payload.source_boundary_sha256, body.source_boundary_sha256);
  assert.equal(payload.source_access_decision_payload_sha256, body.source_access_decision_payload_sha256);
  assert.match(body.audit_event_payload_sha256, /^[a-f0-9]{64}$/);
  assert.match(body.evidence_pack_runtime_read_access_decision_audit_event_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_HASHES');
}

{
  assert.equal(body.audit_event_ready, true);
  assert.equal(body.audit_event_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_ONLY');
  assert.equal(body.audit_event_consumer, 'JOKER_C2');
  assert.equal(body.audit_event_category, 'AUDIT_OBSERVABILITY');
  assert.equal(body.audit_event_subcategory, 'RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT');
  assert.equal(body.records_access_decision_boundary_only, true);
  assert.equal(payload.audit_event_classification.category, 'AUDIT_OBSERVABILITY');
  assert.equal(payload.audit_event_classification.decision_effect, 'OBSERVE_ONLY');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_RECORD');
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_DECISION_SNAPSHOT');
}

{
  assert.equal(payload.source_boundary_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_ONLY');
  assert.equal(payload.source_boundary_consumer, 'JOKER_C2');
  assert.equal(payload.source_boundary_ready, true);
  assert.equal(payload.source_boundary_access_granted, false);
  assert.equal(payload.source_boundary_grants_authorization, false);
  assert.equal(payload.source_boundary_creates_authorization_artifact, false);
  assert.equal(payload.source_boundary_executes_runtime_action, false);
  assert.equal(payload.source_boundary_creates_dispatch, false);
  assert.equal(payload.source_boundary_mutates_runtime_state, false);
  assert.equal(payload.source_access_decision_payload.authorization_resolution.state, 'UNRESOLVED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_VIEW');
}

{
  const assertions = payload.assertions;
  assert.equal(assertions.audit_event_does_not_authorize, true);
  assert.equal(assertions.valid_authority_does_not_authorize, true);
  assert.equal(assertions.policy_allow_probe_does_not_authorize, true);
  assert.equal(assertions.unresolved_authorization_blocks_execution, true);
  assert.equal(assertions.no_authorization_artifact_created, true);
  assert.equal(assertions.no_dispatch_created, true);
  assert.equal(assertions.no_runtime_state_mutation, true);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_NON_AUTHORIZATION');
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
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_READ_ONLY');
}

{
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_FALSE_EFFECTS');
}

{
  assert.equal(body.append_only_audit_event_semantics, true);
  assert.equal(payload.assertions.append_only_audit_event_semantics, true);
  assert.equal(payload.assertions.immutable_source_boundary_hash_binding, true);
  assert.equal(payload.assertions.no_runtime_audit_log_append_side_effect, true);
  assert.equal(payload.assertions.canonical_json_object, true);
  assert.equal(payload.assertions.deterministic_sha256_bound, true);
  assert.equal(payload.assertions.runtime_read_access_decision_audit_event_only, true);
  assert.equal(payload.assertions.binds_runtime_read_access_decision_boundary, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_APPEND_ONLY_SEMANTICS');
}

{
  const first = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent());
  const second = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent());
  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent({
    generated_at: 'invalid-date'
  });
  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent({
    current_time: 'invalid-date'
  });
  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_CURRENT_TIME_INVALID');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_INVALID_DATES');
}

{
  const invalidSourceBoundary = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionAuditEvent({
    source_boundary_input: {
      generated_at: 'invalid-date',
      current_time: '2026-09-23T15:45:00.000Z'
    }
  });
  assert.equal(invalidSourceBoundary.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_STATE.BLOCKED);
  assert.equal(invalidSourceBoundary.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_BLOCKED');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_AUDIT_EVENT_SOURCE_BOUNDARY_BLOCKED');
}
