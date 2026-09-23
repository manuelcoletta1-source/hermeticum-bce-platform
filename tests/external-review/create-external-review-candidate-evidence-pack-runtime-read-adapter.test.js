'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE,
  createExternalReviewCandidateEvidencePackRuntimeReadAdapter
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-adapter');

function adapterResult() {
  return createExternalReviewCandidateEvidencePackRuntimeReadAdapter({
    generated_at: '2026-09-23T14:15:00.000Z',
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
  const actual = adapterResult();
  const body = actual.evidence_pack_runtime_read_adapter;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_KIND);
  assert.equal(body.adapter_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ADAPTER-2026-09-23');
  assert.match(body.evidence_pack_runtime_read_adapter_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_READY');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();

  assert.equal(body.adapter_main_commit, 'ef9d54b7d90aaefa2753e6f15a55e7edddc7c56c');
  assert.equal(body.source_boundary_merge_commit, '0efe5bab789a5f310229d907eca4c6623aa901f9');
  assert.equal(body.source_boundary_checkpoint_commit, '8e5325184aa70186fb50ad99a338566213857990');
  assert.equal(body.source_final_chain_audit_commit, 'ef9d54b7d90aaefa2753e6f15a55e7edddc7c56c');
  assert.equal(body.source_boundary_checkpoint_doc_sha256, 'ff0aac5c359056ef6cfabd0743725af244d7ecdc0323369869614ec051311cff');
  assert.equal(body.source_final_chain_audit_doc_sha256, '8c20940aafd1f976f3f149535d772ac0109308461d55ffd554527f956e7b6fa1');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_SOURCE_COMMITS');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();

  assert.equal(body.source_boundary_sha256, 'ed2c2707286499622bcc5465012aaf2558eb520abf484f15e86463c3ddcf6003');
  assert.equal(body.source_boundary_payload_sha256, 'ad5e7fe4616baddff429f7e246dd6b739a5042f9e78aa5f3a74f81075415aa53');
  assert.match(body.read_adapter_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_HASHES');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();

  assert.equal(body.runtime_entrypoint.module_path, 'runtime/external-review/create-external-review-candidate-evidence-pack-access-decision-boundary.js');
  assert.equal(body.runtime_entrypoint.function_name, 'createExternalReviewCandidateEvidencePackAccessDecisionBoundary');
  assert.equal(body.runtime_entrypoint.default_boundary_generated_at, '2026-09-23T14:00:00.000Z');
  assert.equal(body.runtime_entrypoint.default_boundary_current_time, '2026-09-23T14:00:00.000Z');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_ENTRYPOINT');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();
  const request = body.read_adapter_payload.read_request;

  assert.equal(request.request_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-REQUEST-2026-09-23');
  assert.equal(request.requested_by, 'JOKER_C2');
  assert.equal(request.requested_action, 'READ_EVIDENCE_PACK_ACCESS_DECISION_BOUNDARY');
  assert.equal(request.requested_scope, 'INTERNAL_RUNTIME_READ_ONLY');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_REQUEST');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();
  const projection = body.read_adapter_payload.read_projection;

  assert.equal(projection.projection_type, 'BOUNDARY_READ_ONLY_PROJECTION');
  assert.equal(projection.chain.length, 7);
  assert.equal(projection.chain[0], 'Evidence Chain Manifest');
  assert.equal(projection.chain[6], 'Evidence Pack Access Decision Boundary');
  assert.equal(projection.authority_resolution_state, 'VALID');
  assert.equal(projection.policy_decision, 'UNEVALUATED');
  assert.equal(projection.authorization_state, 'UNRESOLVED');
  assert.equal(projection.positive_allow_probe_authorization_state, 'UNRESOLVED');
  assert.equal(projection.access_granted, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_PROJECTION');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();
  const contract = body.read_adapter_payload.read_contract;

  assert.equal(contract.canonical_json_object, true);
  assert.equal(contract.deterministic_sha256_bound, true);
  assert.equal(contract.read_only_adapter, true);
  assert.equal(contract.returns_internal_runtime_view, true);
  assert.equal(contract.fail_closed_source_boundary_required, true);
  assert.equal(contract.valid_authority_does_not_authorize, true);
  assert.equal(contract.policy_allow_does_not_authorize, true);
  assert.equal(contract.unresolved_authorization_blocks_execution, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_CONTRACT');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();
  const summary = body.read_adapter_payload.read_projection.source_boundary_summary;

  assert.equal(summary.boundary_scope, 'INTERNAL_RUNTIME_ACCESS_DECISION_BOUNDARY_ONLY');
  assert.equal(summary.boundary_consumer, 'JOKER_C2');
  assert.equal(summary.policy_decision_reason, 'POLICY_EVALUATION_DEFERRED');
  assert.equal(summary.authorization_reason, 'POLICY_NOT_RESOLVED');
  assert.equal(summary.positive_allow_probe_authorization_reason, 'POSITIVE_AUTHORIZATION_DEFERRED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_BOUNDARY_SUMMARY');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();

  assert.equal(body.adapter_scope, 'INTERNAL_RUNTIME_READ_ADAPTER_ONLY');
  assert.equal(body.adapter_consumer, 'JOKER_C2');
  assert.equal(body.read_adapter_ready, true);
  assert.equal(body.read_model_available, true);
  assert.equal(body.access_granted, false);
  assert.equal(body.grants_authorization, false);
  assert.equal(body.creates_authorization_artifact, false);
  assert.equal(body.executes_runtime_action, false);
  assert.equal(body.creates_dispatch, false);
  assert.equal(body.mutates_runtime_state, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_READ_ONLY');
}

{
  const { evidence_pack_runtime_read_adapter: body } = adapterResult();

  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_FALSE_EFFECTS');
}

{
  const first = adapterResult().evidence_pack_runtime_read_adapter.evidence_pack_runtime_read_adapter_sha256;
  const second = adapterResult().evidence_pack_runtime_read_adapter.evidence_pack_runtime_read_adapter_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_DETERMINISTIC');
}

{
  const invalidGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAdapter({
    generated_at: '2026-09-23'
  });

  assert.equal(invalidGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.BLOCKED);
  assert.equal(invalidGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_GENERATED_AT_INVALID');

  const invalidBoundaryGeneratedAt = createExternalReviewCandidateEvidencePackRuntimeReadAdapter({
    generated_at: '2026-09-23T14:15:00.000Z',
    boundary_generated_at: '2026-09-23'
  });

  assert.equal(invalidBoundaryGeneratedAt.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_STATE.BLOCKED);
  assert.equal(invalidBoundaryGeneratedAt.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_SOURCE_BOUNDARY_BLOCKED');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ADAPTER_INVALID_DATES');
}
