'use strict';

const assert = require('assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-boundary');

const actual = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary();
const body = actual.evidence_pack_runtime_read_access_decision_boundary;
const payload = body.access_decision_payload;

{
  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_KIND);
  assert.equal(body.boundary_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-BOUNDARY-2026-09-23');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_READY');
}

{
  assert.equal(body.boundary_main_commit, 'f70973728ad4532569b7ecfa23d2bc4d3407eaad');
  assert.equal(body.source_binding_feature_commit, 'a207f426ac560cfd517cf7801b9657123df180da');
  assert.equal(body.source_binding_merge_commit, '49c9c3bba112bb7272898430828a82ed2f1bde8c');
  assert.equal(body.source_binding_checkpoint_commit, '83e5146fb0f4549a1efbc14f5be6be9a6666e031');
  assert.equal(body.source_final_chain_audit_commit, 'f70973728ad4532569b7ecfa23d2bc4d3407eaad');
  assert.equal(body.source_binding_checkpoint_doc_sha256, 'a3acf4fc70dfabd3dfecc9d07d91c4f939248f9d6eb8210c04f274277ecfb8e1');
  assert.equal(body.source_final_chain_audit_doc_sha256, '3a415132f3fda24ea3d3c68827915a60393760974750d5892e1196bb30c5981f');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING');
}

{
  assert.equal(body.source_binding_sha256, '649f326a533fef51f25f6c48733f740fea5804e07a292ee34731f5cfdeaba9c7');
  assert.equal(body.source_binding_payload_sha256, '8a43a7b7294554381589bd97862f88c0fafa27be5244dd9ef6c8334973b3a127');
  assert.equal(payload.source_binding_sha256, body.source_binding_sha256);
  assert.equal(payload.source_binding_payload_sha256, body.source_binding_payload_sha256);
  assert.match(body.access_decision_payload_sha256, /^[a-f0-9]{64}$/);
  assert.match(body.evidence_pack_runtime_read_access_decision_boundary_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_HASHES');
}

{
  assert.equal(body.authority_resolution_state, 'VALID');
  assert.equal(body.authority_resolution_reason, 'AUTHORITY_VALID');
  assert.equal(payload.source_authority_resolution.state, 'VALID');
  assert.equal(payload.source_authority_resolution.reason, 'AUTHORITY_VALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_AUTHORITY_VALID');
}

{
  assert.equal(body.policy_decision, 'UNEVALUATED');
  assert.equal(body.policy_decision_reason, 'POLICY_EVALUATION_DEFERRED');
  assert.equal(payload.policy_decision.decision, 'UNEVALUATED');
  assert.equal(payload.policy_decision.reason, 'POLICY_EVALUATION_DEFERRED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_POLICY_DEFERRED');
}

{
  assert.equal(body.authorization_state, 'UNRESOLVED');
  assert.equal(body.authorization_reason, 'POLICY_NOT_RESOLVED');
  assert.equal(payload.authorization_resolution.state, 'UNRESOLVED');
  assert.equal(payload.authorization_resolution.reason, 'POLICY_NOT_RESOLVED');
  assert.equal(body.access_granted, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_AUTHORIZATION_UNRESOLVED');
}

{
  assert.equal(body.positive_allow_probe_authorization_state, 'UNRESOLVED');
  assert.equal(body.positive_allow_probe_authorization_reason, 'POSITIVE_AUTHORIZATION_DEFERRED');
  assert.equal(payload.positive_allow_probe_authorization_resolution.state, 'UNRESOLVED');
  assert.equal(payload.positive_allow_probe_authorization_resolution.reason, 'POSITIVE_AUTHORIZATION_DEFERRED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_ALLOW_PROBE_FAIL_CLOSED');
}

{
  assert.equal(payload.source_binding_scope, 'INTERNAL_RUNTIME_READ_CAPABILITY_BINDING_ONLY');
  assert.equal(payload.source_binding_consumer, 'JOKER_C2');
  assert.equal(payload.source_binding_ready, true);
  assert.equal(payload.source_binding_read_only, true);
  assert.equal(payload.source_binding_access_granted, false);
  assert.equal(payload.source_binding_grants_authorization, false);
  assert.equal(payload.source_binding_creates_authorization_artifact, false);
  assert.equal(payload.source_binding_executes_runtime_action, false);
  assert.equal(payload.source_binding_creates_dispatch, false);
  assert.equal(payload.source_binding_mutates_runtime_state, false);
  assert.equal(payload.source_fail_closed_view.policy_decision, 'UNEVALUATED');
  assert.equal(payload.source_fail_closed_view.authorization_state, 'UNRESOLVED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_VIEW');
}

{
  const assertions = payload.assertions;
  assert.equal(body.boundary_ready, true);
  assert.equal(body.runtime_read_access_decision_boundary_only, true);
  assert.equal(body.boundary_scope, 'INTERNAL_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_ONLY');
  assert.equal(body.boundary_consumer, 'JOKER_C2');
  assert.equal(assertions.canonical_json_object, true);
  assert.equal(assertions.deterministic_sha256_bound, true);
  assert.equal(assertions.runtime_read_access_decision_boundary_only, true);
  assert.equal(assertions.binds_runtime_read_capability_binding, true);
  assert.equal(assertions.fail_closed_source_binding_required, true);
  assert.equal(assertions.valid_authority_does_not_authorize, true);
  assert.equal(assertions.policy_allow_does_not_authorize, true);
  assert.equal(assertions.unresolved_authorization_blocks_execution, true);
  assert.equal(assertions.no_authorization_artifact_created, true);
  assert.equal(assertions.no_dispatch_created, true);
  assert.equal(assertions.no_runtime_state_mutation, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_ASSERTIONS');
}

{
  assert.equal(body.access_granted, false);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  assert.equal(body.executes_runtime_action, false);
  assert.equal(body.creates_dispatch, false);
  assert.equal(body.mutates_runtime_state, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_READ_ONLY');
}

{
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_FALSE_EFFECTS');
}

{
  const first = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary());
  const second = JSON.stringify(createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary());
  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary({
    generated_at: 'invalid-date'
  });
  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary({
    current_time: 'invalid-date'
  });
  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_CURRENT_TIME_INVALID');

  const invalidSourceBinding = createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionBoundary({
    source_binding_input: {
      generated_at: 'invalid-date',
      current_time: '2026-09-23T15:00:00.000Z'
    }
  });
  assert.equal(invalidSourceBinding.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED);
  assert.equal(invalidSourceBinding.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_BLOCKED');

  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_BOUNDARY_INVALID_DATES');
}
