'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadIntegrationIndex
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-integration-index');

function indexResult() {
  return createExternalReviewCandidateEvidencePackRuntimeReadIntegrationIndex({
    generated_at: '2026-09-23T14:45:00.000Z',
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
  const actual = indexResult();
  const body = actual.evidence_pack_runtime_read_integration_index;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_KIND);
  assert.equal(body.index_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-INTEGRATION-INDEX-2026-09-23');
  assert.match(body.evidence_pack_runtime_read_integration_index_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_READY');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();

  assert.equal(body.index_main_commit, 'b778e50f2b6c89064862ac8040124fd2cfa9cc46');
  assert.equal(body.source_surface_merge_commit, 'e080175b678c2fa7907738788db36568d3cf088b');
  assert.equal(body.source_surface_checkpoint_commit, 'c2c95958be32465d41194665ff75a42ce332e763');
  assert.equal(body.source_final_chain_audit_commit, 'b778e50f2b6c89064862ac8040124fd2cfa9cc46');
  assert.equal(body.source_surface_checkpoint_doc_sha256, '89cfadee0083bf706efc1a24660448c68bf0a3374a63044df86be2776c35d7f4');
  assert.equal(body.source_final_chain_audit_doc_sha256, 'b65ef7ba4d599a5f86606320eeae67530b7d8d19787aacbbd585b0a70599fbaf');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_SOURCE_SURFACE');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();

  assert.equal(body.source_surface_sha256, '71b48a5aa49e4ba0eef7544bcc7c225c4eda1801475498a5bda1f497336d00b7');
  assert.equal(body.source_surface_payload_sha256, 'c9076c1cdc1458a1fac8df3d137ba8ce51be4e0dd078d9c0df5b9b5d8ed6a628');
  assert.match(body.read_integration_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_HASHES');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();

  assert.equal(body.integration_chain.length, 10);
  assert.equal(body.integration_chain[0], 'Evidence Chain Manifest');
  assert.equal(body.integration_chain[7], 'Evidence Pack Runtime Read Adapter');
  assert.equal(body.integration_chain[8], 'Evidence Pack Runtime Read Surface');
  assert.equal(body.integration_chain[9], 'Evidence Pack Runtime Read Integration Index');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_CHAIN');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();

  assert.deepEqual(body.integration_entries.map((entry) => entry.sequence), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(body.integration_entries.map((entry) => entry.key), [
    'evidence_chain_manifest',
    'evidence_pack',
    'evidence_pack_export',
    'evidence_pack_export_surface',
    'evidence_pack_integration_index',
    'evidence_pack_capability_binding',
    'evidence_pack_access_decision_boundary',
    'evidence_pack_runtime_read_adapter',
    'evidence_pack_runtime_read_surface'
  ]);
  assert.deepEqual(body.integration_entries.map((entry) => entry.role), [
    'CHAIN_MANIFEST',
    'PACK',
    'EXPORT',
    'EXPORT_SURFACE',
    'INTEGRATION_INDEX',
    'CAPABILITY_BINDING',
    'ACCESS_DECISION_BOUNDARY',
    'RUNTIME_READ_ADAPTER',
    'RUNTIME_READ_SURFACE'
  ]);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_ENTRIES');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();

  assert.equal(body.active_runtime_entrypoint.module_path, 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-surface.js');
  assert.equal(body.active_runtime_entrypoint.function_name, 'createExternalReviewCandidateEvidencePackRuntimeReadSurface');
  assert.equal(body.active_runtime_entrypoint.consumer, 'JOKER_C2');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_ACTIVE_ENTRYPOINT');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();
  const payload = body.read_integration_payload;

  assert.equal(payload.source_surface_sha256, body.source_surface_sha256);
  assert.equal(payload.source_surface_payload_sha256, body.source_surface_payload_sha256);
  assert.equal(payload.source_adapter_sha256, '0a1f3decd9d1a2d9fd18fcf1e09ec1152464d909f6d0933a2fb219476f59c4d5');
  assert.equal(payload.source_adapter_payload_sha256, 'aca27fae5c84dfcccd6a1a69f8132c06705a4e6451c86e0554beea0f89b6213d');
  assert.equal(payload.surface_projection.chain.length, 8);
  assert.equal(payload.integration_chain.length, 10);
  assert.equal(payload.integration_entries.length, 9);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_PAYLOAD');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();
  const failClosed = body.read_integration_payload.fail_closed_view;

  assert.equal(failClosed.authority_resolution_state, 'VALID');
  assert.equal(failClosed.policy_decision, 'UNEVALUATED');
  assert.equal(failClosed.authorization_state, 'UNRESOLVED');
  assert.equal(failClosed.positive_allow_probe_authorization_state, 'UNRESOLVED');
  assert.equal(failClosed.access_granted, false);
  assert.equal(failClosed.authorization_reason, 'POLICY_NOT_RESOLVED');
  assert.equal(failClosed.policy_decision_reason, 'POLICY_EVALUATION_DEFERRED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_FAIL_CLOSED_VIEW');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();
  const contract = body.read_integration_payload.integration_contract;

  assert.equal(body.index_ready, true);
  assert.equal(body.read_model_available, true);
  assert.equal(body.read_surface_index_only, true);
  assert.equal(body.fail_closed_source_surface_required, true);
  assert.equal(contract.canonical_json_object, true);
  assert.equal(contract.deterministic_sha256_bound, true);
  assert.equal(contract.runtime_read_integration_index_only, true);
  assert.equal(contract.indexes_runtime_read_surface, true);
  assert.equal(contract.fail_closed_source_surface_required, true);
  assert.equal(contract.valid_authority_does_not_authorize, true);
  assert.equal(contract.policy_allow_does_not_authorize, true);
  assert.equal(contract.unresolved_authorization_blocks_execution, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_ACCESS_CONTRACT');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();

  assert.equal(body.index_scope, 'INTERNAL_RUNTIME_READ_INTEGRATION_INDEX_ONLY');
  assert.equal(body.index_consumer, 'JOKER_C2');
  assert.equal(body.access_granted, false);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  assert.equal(body.executes_runtime_action, false);
  assert.equal(body.creates_dispatch, false);
  assert.equal(body.mutates_runtime_state, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_READ_ONLY');
}

{
  const { evidence_pack_runtime_read_integration_index: body } = indexResult();

  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_FALSE_EFFECTS');
}

{
  const first = indexResult().evidence_pack_runtime_read_integration_index.evidence_pack_runtime_read_integration_index_sha256;
  const second = indexResult().evidence_pack_runtime_read_integration_index.evidence_pack_runtime_read_integration_index_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadIntegrationIndex({
    generated_at: '2026-09-23'
  });

  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_GENERATED_AT_INVALID');

  const invalidSurfaceGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadIntegrationIndex({
    generated_at: '2026-09-23T14:45:00.000Z',
    read_surface_generated_at: '2026-09-23'
  });

  assert.equal(invalidSurfaceGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_STATE.BLOCKED);
  assert.equal(invalidSurfaceGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_SOURCE_SURFACE_BLOCKED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_INTEGRATION_INDEX_INVALID_DATES');
}
