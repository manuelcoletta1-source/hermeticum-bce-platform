'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadSurface
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-surface');

function surfaceResult() {
  return createExternalReviewCandidateEvidencePackRuntimeReadSurface({
    generated_at: '2026-09-23T14:30:00.000Z',
    adapter_generated_at: '2026-09-23T14:15:00.000Z',
    boundary_generated_at: '2026-09-23T14:00:00.000Z',
    boundary_current_time: '2026-09-23T14:00:00.000Z',
    binding_generated_at: '2026-09-23T13:45:00.000Z',
    binding_current_time: '2026-09-23T13:45:00.000Z',
    index_generated_at: '2026-09-23T13:30:00.000Z',
    surface_generated_at: '2026-09-23T13:15:00.000Z',
    export_generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = surfaceResult();
  const body = actual.evidence_pack_runtime_read_surface;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_KIND);
  assert.equal(body.surface_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-SURFACE-2026-09-23');
  assert.match(body.evidence_pack_runtime_read_surface_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_READY');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();

  assert.equal(body.surface_main_commit, '2a7fdc35e38a7e2087998839d52a9480b685ea9f');
  assert.equal(body.source_adapter_merge_commit, 'de93ee3cd491efab51964f8fbe31d0d086766a41');
  assert.equal(body.source_adapter_checkpoint_commit, 'b51751742f48e5fb48e18331fc7c0809cc1ccfe9');
  assert.equal(body.source_final_chain_audit_commit, '2a7fdc35e38a7e2087998839d52a9480b685ea9f');
  assert.equal(body.source_adapter_checkpoint_doc_sha256, 'e502c41079fe604b053fc11b650fc304560649ec799d111d9228cf938752e307');
  assert.equal(body.source_final_chain_audit_doc_sha256, 'd80d555e19f6ff29fae6a905dbe23b76177478692641e3709f08297e9d78697b');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_SOURCE_COMMITS');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();

  assert.equal(body.source_adapter_sha256, '0a1f3decd9d1a2d9fd18fcf1e09ec1152464d909f6d0933a2fb219476f59c4d5');
  assert.equal(body.source_adapter_payload_sha256, 'aca27fae5c84dfcccd6a1a69f8132c06705a4e6451c86e0554beea0f89b6213d');
  assert.match(body.read_surface_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_HASHES');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();

  assert.equal(body.runtime_entrypoint.module_path, 'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-adapter.js');
  assert.equal(body.runtime_entrypoint.function_name, 'createExternalReviewCandidateEvidencePackRuntimeReadAdapter');
  assert.equal(body.runtime_entrypoint.default_adapter_generated_at, '2026-09-23T14:15:00.000Z');
  assert.equal(body.runtime_entrypoint.default_boundary_generated_at, '2026-09-23T14:00:00.000Z');
  assert.equal(body.runtime_entrypoint.default_boundary_current_time, '2026-09-23T14:00:00.000Z');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_ENTRYPOINT');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();
  const request = body.read_surface_payload.surface_request;

  assert.equal(request.request_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-SURFACE-REQUEST-2026-09-23');
  assert.equal(request.requested_by, 'JOKER_C2');
  assert.equal(request.requested_action, 'READ_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_SURFACE');
  assert.equal(request.requested_scope, 'INTERNAL_RUNTIME_READ_SURFACE_ONLY');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_REQUEST');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();
  const projection = body.read_surface_payload.surface_projection;

  assert.equal(projection.projection_type, 'RUNTIME_READ_SURFACE_PROJECTION');
  assert.equal(projection.chain.length, 8);
  assert.equal(projection.chain[0], 'Evidence Chain Manifest');
  assert.equal(projection.chain[6], 'Evidence Pack Access Decision Boundary');
  assert.equal(projection.chain[7], 'Evidence Pack Runtime Read Adapter');
  assert.equal(projection.read_model_available, true);
  assert.equal(projection.source_adapter_scope, 'INTERNAL_RUNTIME_READ_ADAPTER_ONLY');
  assert.equal(projection.source_adapter_consumer, 'JOKER_C2');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_PROJECTION');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();
  const projection = body.read_surface_payload.surface_projection;

  assert.equal(projection.authority_resolution_state, 'VALID');
  assert.equal(projection.policy_decision, 'UNEVALUATED');
  assert.equal(projection.authorization_state, 'UNRESOLVED');
  assert.equal(projection.positive_allow_probe_authorization_state, 'UNRESOLVED');
  assert.equal(projection.access_granted, false);
  assert.equal(projection.source_boundary_summary.authorization_reason, 'POLICY_NOT_RESOLVED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_FAIL_CLOSED_VIEW');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();
  const contract = body.read_surface_payload.surface_contract;

  assert.equal(contract.canonical_json_object, true);
  assert.equal(contract.deterministic_sha256_bound, true);
  assert.equal(contract.read_surface_only, true);
  assert.equal(contract.exposes_read_adapter_projection, true);
  assert.equal(contract.fail_closed_source_adapter_required, true);
  assert.equal(contract.valid_authority_does_not_authorize, true);
  assert.equal(contract.policy_allow_does_not_authorize, true);
  assert.equal(contract.unresolved_authorization_blocks_execution, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_CONTRACT');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();

  assert.equal(body.surface_scope, 'INTERNAL_RUNTIME_READ_SURFACE_ONLY');
  assert.equal(body.surface_consumer, 'JOKER_C2');
  assert.equal(body.read_surface_ready, true);
  assert.equal(body.read_model_available, true);
  assert.equal(body.read_only_surface, true);
  assert.equal(body.access_granted, false);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  assert.equal(body.executes_runtime_action, false);
  assert.equal(body.creates_dispatch, false);
  assert.equal(body.mutates_runtime_state, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_READ_ONLY');
}

{
  const { evidence_pack_runtime_read_surface: body } = surfaceResult();

  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_FALSE_EFFECTS');
}

{
  const first = surfaceResult().evidence_pack_runtime_read_surface.evidence_pack_runtime_read_surface_sha256;
  const second = surfaceResult().evidence_pack_runtime_read_surface.evidence_pack_runtime_read_surface_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadSurface({
    generated_at: '2026-09-23'
  });

  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_GENERATED_AT_INVALID');

  const invalidAdapterGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadSurface({
    generated_at: '2026-09-23T14:30:00.000Z',
    adapter_generated_at: '2026-09-23'
  });

  assert.equal(invalidAdapterGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_STATE.BLOCKED);
  assert.equal(invalidAdapterGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_SOURCE_ADAPTER_BLOCKED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_SURFACE_INVALID_DATES');
}
