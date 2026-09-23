'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE,
  createExternalReviewCandidateEvidencePackCapabilityBinding
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-capability-binding');

function bindingResult() {
  return createExternalReviewCandidateEvidencePackCapabilityBinding({
    generated_at: '2026-09-23T13:45:00.000Z',
    current_time: '2026-09-23T13:45:00.000Z',
    index_generated_at: '2026-09-23T13:30:00.000Z',
    surface_generated_at: '2026-09-23T13:15:00.000Z',
    export_generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = bindingResult();
  const body = actual.evidence_pack_capability_binding;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_KIND);
  assert.equal(body.binding_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-CAPABILITY-BINDING-2026-09-23');
  assert.match(body.evidence_pack_capability_binding_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_READY');
}

{
  const { evidence_pack_capability_binding: body } = bindingResult();

  assert.equal(body.binding_main_commit, 'd981cc93ca6dd7b1f226539c49d66902629f8f1a');
  assert.equal(body.source_index_main_commit, '390e5958ed606c8ffc3e1d287f9ed3b472869aec');
  assert.equal(body.source_index_checkpoint_commit, 'd981cc93ca6dd7b1f226539c49d66902629f8f1a');
  assert.equal(body.source_index_checkpoint_doc_sha256, 'b440bcba9a79978a9a06360e5c3f36be38d1d4711222f84d4aa27df3926ee403');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_SOURCE_INDEX');
}

{
  const { evidence_pack_capability_binding: body } = bindingResult();

  assert.equal(body.source_index_sha256, '0e1371ed24cd3e39c6f9db337c971b303227a91f24dae71caa15fbc8f7b2f17a');
  assert.equal(body.source_index_payload_sha256, 'b46aa0f01e19699abcbf75fc5e9f8aef1d0a0072fd388268f339b3faafc25d59');
  assert.match(body.capability_binding_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_HASHES');
}

{
  const { evidence_pack_capability_binding: body } = bindingResult();
  const payload = body.capability_binding_payload;

  assert.equal(payload.capability.capability_id, 'CAP-HBCE-EXT-REVIEW-EVIDENCE-PACK-INTEGRATION-INDEX-2026-09-23');
  assert.equal(payload.capability.capability_version, 1);
  assert.equal(payload.capability.state, 'ACTIVE');
  assert.equal(payload.capability.evidence_state, 'PRESENT');
  assert.equal(payload.capability.evidence_reference, body.source_index_sha256);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_CAPABILITY');
}

{
  const { evidence_pack_capability_binding: body } = bindingResult();
  const payload = body.capability_binding_payload;

  assert.equal(payload.authority.capability_ref, payload.capability.capability_id);
  assert.equal(payload.authority.capability_version, payload.capability.capability_version);
  assert.equal(payload.authority.mandate_ref, payload.mandate.mandate_id);
  assert.equal(payload.authority.mandate_version, payload.mandate.mandate_version);
  assert.equal(payload.authority.actor_ref, 'JOKER_C2');
  assert.equal(payload.authority.principal_ref, 'HBCE_INTERNAL_RUNTIME');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_AUTHORITY_BINDING');
}

{
  const { evidence_pack_capability_binding: body } = bindingResult();
  const payload = body.capability_binding_payload;

  assert.equal(payload.request.action_class, 'READ_EVIDENCE_PACK_INTEGRATION_INDEX');
  assert.equal(payload.request.target_ref, payload.source_index_id);
  assert.equal(payload.request.iospace_ref, 'HBCE_INTERNAL_RUNTIME');
  assert.deepEqual(payload.authority.scope.action_classes, ['READ_EVIDENCE_PACK_INTEGRATION_INDEX']);
  assert.deepEqual(payload.authority.scope.target_refs, [payload.source_index_id]);
  assert.deepEqual(payload.authority.scope.iospace_refs, ['HBCE_INTERNAL_RUNTIME']);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_SCOPE');
}

{
  const { evidence_pack_capability_binding: body } = bindingResult();

  assert.equal(body.authority_resolution_state, 'VALID');
  assert.equal(body.authority_resolution_reason, 'AUTHORITY_VALID');
  assert.equal(body.capability_binding_payload.authority_resolution.state, 'VALID');
  assert.equal(body.capability_binding_payload.authority_resolution.reason, 'AUTHORITY_VALID');
  assert.equal(body.binding_ready, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_AUTHORITY_VALID');
}

{
  const { evidence_pack_capability_binding: body } = bindingResult();

  assert.equal(body.binding_scope, 'INTERNAL_RUNTIME_CAPABILITY_BINDING_ONLY');
  assert.equal(body.binding_consumer, 'JOKER_C2');
  assert.equal(body.grants_authorization, false);
  assert.equal(body.executes_runtime_action, false);
  assert.equal(body.mutates_runtime_state, false);
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_FALSE_EFFECTS');
}

{
  const first = bindingResult().evidence_pack_capability_binding.evidence_pack_capability_binding_sha256;
  const second = bindingResult().evidence_pack_capability_binding.evidence_pack_capability_binding_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackCapabilityBinding({
    generated_at: '2026-09-23',
    current_time: '2026-09-23T13:45:00.000Z'
  });

  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_GENERATED_AT_INVALID');

  const invalidCurrentTime = createExternalReviewCandidateEvidencePackCapabilityBinding({
    generated_at: '2026-09-23T13:45:00.000Z',
    current_time: '2026-09-23'
  });

  assert.equal(invalidCurrentTime.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_STATE.BLOCKED);
  assert.equal(invalidCurrentTime.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_CURRENT_TIME_INVALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_CAPABILITY_BINDING_INVALID_DATES');
}
