'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-capability-binding');

function bindingResult() {
  return createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding({
    generated_at: '2026-09-23T15:00:00.000Z',
    current_time: '2026-09-23T15:00:00.000Z',
    read_index_generated_at: '2026-09-23T14:45:00.000Z',
    read_surface_generated_at: '2026-09-23T14:30:00.000Z',
    adapter_generated_at: '2026-09-23T14:15:00.000Z',
    boundary_generated_at: '2026-09-23T14:00:00.000Z',
    boundary_current_time: '2026-09-23T14:00:00.000Z',
    binding_generated_at: '2026-09-23T13:45:00.000Z',
    binding_current_time: '2026-09-23T13:45:00.000Z',
    index_generated_at: '2026-09-23T13:30:00.000Z',
    export_surface_generated_at: '2026-09-23T13:15:00.000Z',
    export_generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = bindingResult();
  const body = actual.evidence_pack_runtime_read_capability_binding;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_KIND);
  assert.equal(body.binding_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-CAPABILITY-BINDING-2026-09-23');
  assert.match(body.evidence_pack_runtime_read_capability_binding_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_READY');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();

  assert.equal(body.binding_main_commit, 'a6b380c3bea006f2754d156252e6c7cf63a1a955');
  assert.equal(body.source_index_merge_commit, '528265deb4f868e9ab86c571d1e2e9ca19ef0547');
  assert.equal(body.source_index_checkpoint_commit, '4dc42a79dfc2f91e4438b10ba4ca2c8e4b7a986f');
  assert.equal(body.source_final_chain_audit_commit, 'a6b380c3bea006f2754d156252e6c7cf63a1a955');
  assert.equal(body.source_index_checkpoint_doc_sha256, 'f5fe83ec59900a1b77b53392c6d391722c15c434b3b121eec9a8378410b06290');
  assert.equal(body.source_final_chain_audit_doc_sha256, '76795336389665795482e19b45a2687321aab908d9a18c70d768de76b9bcca7b');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_SOURCE_INDEX');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();

  assert.equal(body.source_index_sha256, '0389e4a83329c0800d62100cf372dc526ddb07f312c49e24802b9f41a0fd5660');
  assert.equal(body.source_index_payload_sha256, 'd49885b93eb253a2d58c491a09e60c1e39bf0bfe706e0513e931e08ecd785f3a');
  assert.match(body.capability_binding_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_HASHES');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();
  const payload = body.capability_binding_payload;

  assert.equal(payload.capability.capability_id, 'CAP-HBCE-EXT-REVIEW-EVIDENCE-PACK-RUNTIME-READ-INTEGRATION-INDEX-2026-09-23');
  assert.equal(payload.capability.capability_version, 1);
  assert.equal(payload.capability.state, 'ACTIVE');
  assert.equal(payload.capability.evidence_state, 'PRESENT');
  assert.equal(payload.capability.evidence_reference, body.source_index_sha256);
  assert.equal(payload.capability.action_class, 'READ_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX');
  assert.equal(payload.capability.target_ref, payload.source_index_id);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_CAPABILITY');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();
  const payload = body.capability_binding_payload;

  assert.equal(payload.authority.capability_ref, payload.capability.capability_id);
  assert.equal(payload.authority.capability_version, payload.capability.capability_version);
  assert.equal(payload.authority.mandate_ref, payload.mandate.mandate_id);
  assert.equal(payload.authority.mandate_version, payload.mandate.mandate_version);
  assert.equal(payload.authority.principal_ref, 'HBCE_INTERNAL_RUNTIME');
  assert.equal(payload.authority.actor_ref, 'JOKER_C2');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_AUTHORITY_BINDING');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();
  const payload = body.capability_binding_payload;

  assert.equal(payload.request.target_ref, payload.source_index_id);
  assert.equal(payload.request.action_class, 'READ_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX');
  assert.equal(payload.request.iospace_ref, 'HBCE_INTERNAL_RUNTIME');
  assert.deepEqual(payload.authority.scope.target_refs, [payload.source_index_id]);
  assert.deepEqual(payload.authority.scope.action_classes, ['READ_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX']);
  assert.deepEqual(payload.authority.scope.iospace_refs, ['HBCE_INTERNAL_RUNTIME']);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_SCOPE');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();

  assert.equal(body.authority_resolution_state, 'VALID');
  assert.equal(body.authority_resolution_reason, 'AUTHORITY_VALID');
  assert.equal(body.capability_binding_payload.authority_resolution.state, 'VALID');
  assert.equal(body.capability_binding_payload.authority_resolution.reason, 'AUTHORITY_VALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_AUTHORITY_VALID');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();
  const payload = body.capability_binding_payload;

  assert.equal(payload.source_index_scope, 'INTERNAL_RUNTIME_READ_INTEGRATION_INDEX_ONLY');
  assert.equal(payload.source_index_consumer, 'JOKER_C2');
  assert.equal(payload.source_index_ready, true);
  assert.equal(payload.source_index_read_only, true);
  assert.equal(payload.source_fail_closed_view.policy_decision, 'UNEVALUATED');
  assert.equal(payload.source_fail_closed_view.authorization_state, 'UNRESOLVED');
  assert.equal(payload.source_fail_closed_view.access_granted, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_SOURCE_INDEX_VIEW');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();
  const contract = body.capability_binding_payload.binding_contract;

  assert.equal(body.binding_ready, true);
  assert.equal(body.read_model_available, true);
  assert.equal(body.read_capability_binding_only, true);
  assert.equal(contract.canonical_json_object, true);
  assert.equal(contract.deterministic_sha256_bound, true);
  assert.equal(contract.runtime_read_capability_binding_only, true);
  assert.equal(contract.binds_runtime_read_integration_index, true);
  assert.equal(contract.fail_closed_source_index_required, true);
  assert.equal(contract.valid_authority_does_not_authorize, true);
  assert.equal(contract.policy_allow_does_not_authorize, true);
  assert.equal(contract.unresolved_authorization_blocks_execution, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_ACCESS_CONTRACT');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();

  assert.equal(body.binding_scope, 'INTERNAL_RUNTIME_READ_CAPABILITY_BINDING_ONLY');
  assert.equal(body.binding_consumer, 'JOKER_C2');
  assert.equal(body.access_granted, false);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  assert.equal(body.executes_runtime_action, false);
  assert.equal(body.creates_dispatch, false);
  assert.equal(body.mutates_runtime_state, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_READ_ONLY');
}

{
  const { evidence_pack_runtime_read_capability_binding: body } = bindingResult();

  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_FALSE_EFFECTS');
}

{
  const first = bindingResult().evidence_pack_runtime_read_capability_binding.evidence_pack_runtime_read_capability_binding_sha256;
  const second = bindingResult().evidence_pack_runtime_read_capability_binding.evidence_pack_runtime_read_capability_binding_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding({
    generated_at: '2026-09-23',
    current_time: '2026-09-23T15:00:00.000Z'
  });

  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding({
    generated_at: '2026-09-23T15:00:00.000Z',
    current_time: 'not-a-date'
  });

  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_CURRENT_TIME_INVALID');

  const invalidSourceIndexGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadCapabilityBinding({
    generated_at: '2026-09-23T15:00:00.000Z',
    current_time: '2026-09-23T15:00:00.000Z',
    read_index_generated_at: 'not-a-date'
  });

  assert.equal(invalidSourceIndexGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_STATE.BLOCKED);
  assert.equal(invalidSourceIndexGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_SOURCE_INDEX_BLOCKED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_CAPABILITY_BINDING_INVALID_DATES');
}
