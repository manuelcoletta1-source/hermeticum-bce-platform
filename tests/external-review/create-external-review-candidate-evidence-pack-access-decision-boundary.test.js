'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE,
  createExternalReviewCandidateEvidencePackAccessDecisionBoundary
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-access-decision-boundary');

function boundaryResult() {
  return createExternalReviewCandidateEvidencePackAccessDecisionBoundary({
    generated_at: '2026-09-23T14:00:00.000Z',
    current_time: '2026-09-23T14:00:00.000Z',
    binding_generated_at: '2026-09-23T13:45:00.000Z',
    index_generated_at: '2026-09-23T13:30:00.000Z',
    surface_generated_at: '2026-09-23T13:15:00.000Z',
    export_generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = boundaryResult();
  const body = actual.evidence_pack_access_decision_boundary;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_KIND);
  assert.equal(body.boundary_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-ACCESS-DECISION-BOUNDARY-2026-09-23');
  assert.match(body.evidence_pack_access_decision_boundary_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_READY');
}

{
  const { evidence_pack_access_decision_boundary: body } = boundaryResult();

  assert.equal(body.boundary_main_commit, 'c834a5c2c7a9f42b5b964ecc4657bcd17b117a3e');
  assert.equal(body.source_binding_main_commit, '36ea9a23b4a664d7e1e7afc641d44838cfbb1219');
  assert.equal(body.source_binding_checkpoint_commit, 'c834a5c2c7a9f42b5b964ecc4657bcd17b117a3e');
  assert.equal(body.source_binding_checkpoint_doc_sha256, 'affc4acb869f9fd6dcbdf8b6fc0d1c7c073aff382e9b36ffbf53f94e62e3ac12');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING');
}

{
  const { evidence_pack_access_decision_boundary: body } = boundaryResult();

  assert.equal(body.source_binding_sha256, '5c7f3dc2d170540de11e07f509f12a897ea460a98cec01929a75e7f697c13a2e');
  assert.equal(body.source_binding_payload_sha256, 'f99fe4a41bd4280e1a9fd64cf952d1e5dfc2b4c49d9de28d9acad273920cf65a');
  assert.match(body.access_decision_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_HASHES');
}

{
  const { evidence_pack_access_decision_boundary: body } = boundaryResult();
  const payload = body.access_decision_payload;

  assert.equal(body.authority_resolution_state, 'VALID');
  assert.equal(payload.authority_resolution.state, 'VALID');
  assert.equal(payload.authority_resolution.reason, 'AUTHORITY_VALID');
  assert.equal(payload.access_subject.principal_ref, 'HBCE_INTERNAL_RUNTIME');
  assert.equal(payload.access_subject.actor_ref, 'JOKER_C2');
  assert.equal(payload.access_subject.action_class, 'READ_EVIDENCE_PACK_INTEGRATION_INDEX');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_AUTHORITY_VALID');
}

{
  const { evidence_pack_access_decision_boundary: body } = boundaryResult();
  const payload = body.access_decision_payload;

  assert.equal(body.policy_decision, 'UNEVALUATED');
  assert.equal(body.policy_decision_reason, 'POLICY_EVALUATION_DEFERRED');
  assert.equal(payload.policy_decision.decision, 'UNEVALUATED');
  assert.equal(payload.policy_decision.reason, 'POLICY_EVALUATION_DEFERRED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_POLICY_DEFERRED');
}

{
  const { evidence_pack_access_decision_boundary: body } = boundaryResult();
  const payload = body.access_decision_payload;

  assert.equal(body.authorization_state, 'UNRESOLVED');
  assert.equal(body.authorization_reason, 'POLICY_NOT_RESOLVED');
  assert.equal(payload.authorization_resolution.state, 'UNRESOLVED');
  assert.equal(payload.authorization_resolution.reason, 'POLICY_NOT_RESOLVED');
  assert.equal(body.access_granted, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_AUTHORIZATION_UNRESOLVED');
}

{
  const { evidence_pack_access_decision_boundary: body } = boundaryResult();
  const probe = body.access_decision_payload.positive_allow_probe_authorization_resolution;

  assert.equal(body.positive_allow_probe_authorization_state, 'UNRESOLVED');
  assert.equal(body.positive_allow_probe_authorization_reason, 'POSITIVE_AUTHORIZATION_DEFERRED');
  assert.equal(probe.state, 'UNRESOLVED');
  assert.equal(probe.reason, 'POSITIVE_AUTHORIZATION_DEFERRED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_ALLOW_PROBE_FAIL_CLOSED');
}

{
  const { evidence_pack_access_decision_boundary: body } = boundaryResult();
  const assertions = body.access_decision_payload.boundary_assertions;

  assert.equal(body.boundary_scope, 'INTERNAL_RUNTIME_ACCESS_DECISION_BOUNDARY_ONLY');
  assert.equal(body.boundary_consumer, 'JOKER_C2');
  assert.equal(assertions.valid_authority_does_not_authorize, true);
  assert.equal(assertions.policy_allow_does_not_authorize, true);
  assert.equal(assertions.unresolved_authorization_blocks_execution, true);
  assert.equal(assertions.no_authorization_artifact_created, true);
  assert.equal(assertions.no_runtime_action_executed, true);
  assert.equal(assertions.no_dispatch_created, true);
  assert.equal(assertions.no_state_mutated, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_ASSERTIONS');
}

{
  const { evidence_pack_access_decision_boundary: body } = boundaryResult();

  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  assert.equal(body.executes_runtime_action, false);
  assert.equal(body.creates_dispatch, false);
  assert.equal(body.mutates_runtime_state, false);
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_FALSE_EFFECTS');
}

{
  const first = boundaryResult().evidence_pack_access_decision_boundary.evidence_pack_access_decision_boundary_sha256;
  const second = boundaryResult().evidence_pack_access_decision_boundary.evidence_pack_access_decision_boundary_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackAccessDecisionBoundary({
    generated_at: '2026-09-23',
    current_time: '2026-09-23T14:00:00.000Z'
  });

  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackAccessDecisionBoundary({
    generated_at: '2026-09-23T14:00:00.000Z',
    current_time: '2026-09-23'
  });

  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_CURRENT_TIME_INVALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY_INVALID_DATES');
}
