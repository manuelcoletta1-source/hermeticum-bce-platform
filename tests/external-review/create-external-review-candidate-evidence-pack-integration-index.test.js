'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE,
  createExternalReviewCandidateEvidencePackIntegrationIndex
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-integration-index');

function indexResult() {
  return createExternalReviewCandidateEvidencePackIntegrationIndex({
    generated_at: '2026-09-23T13:30:00.000Z',
    surface_generated_at: '2026-09-23T13:15:00.000Z',
    export_generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = indexResult();
  const body = actual.evidence_pack_integration_index;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_KIND);
  assert.equal(body.index_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-INTEGRATION-INDEX-2026-09-23');
  assert.match(body.evidence_pack_integration_index_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_READY');
}

{
  const { evidence_pack_integration_index: body } = indexResult();

  assert.equal(body.index_main_commit, '5bb7df53bf30632ac7213e19446a9b56ee7e2af7');
  assert.equal(body.source_surface_main_commit, 'abe2010c55e7af264ed72399b3829adfb0b7d870');
  assert.equal(body.source_surface_checkpoint_commit, '5bb7df53bf30632ac7213e19446a9b56ee7e2af7');
  assert.equal(body.source_surface_checkpoint_doc_sha256, '706cb0ce16f5e6ff718f6be05319a99b24945c5b3979fed642e5ab2c9d320717');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_SOURCE_SURFACE');
}

{
  const { evidence_pack_integration_index: body } = indexResult();

  assert.equal(body.source_surface_sha256, '695e645993c3599321c08b72df8500afdf656e375fff1629b6d2d143531b1c18');
  assert.equal(body.source_surface_payload_sha256, 'c14644847b66ffc03fecd44861bdeb23003ff2d928e1e5ff9fd6dda4cbfef0ca');
  assert.match(body.integration_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_HASHES');
}

{
  const { evidence_pack_integration_index: body } = indexResult();

  assert.deepEqual(body.integration_entries.map((entry) => entry.sequence), [1, 2, 3, 4]);
  assert.deepEqual(body.integration_entries.map((entry) => entry.key), [
    'evidence_chain_manifest',
    'evidence_pack',
    'evidence_pack_export',
    'evidence_pack_export_surface'
  ]);
  assert.deepEqual(body.integration_entries.map((entry) => entry.role), [
    'CHAIN_MANIFEST',
    'PACK',
    'EXPORT',
    'SURFACE'
  ]);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_ENTRIES');
}

{
  const { evidence_pack_integration_index: body } = indexResult();

  assert.equal(body.active_runtime_entrypoint.module_path, 'runtime/external-review/create-external-review-candidate-evidence-pack-export-surface.js');
  assert.equal(body.active_runtime_entrypoint.function_name, 'createExternalReviewCandidateEvidencePackExportSurface');
  assert.equal(body.active_runtime_entrypoint.consumer, 'JOKER_C2');
  assert.equal(body.integration_payload.active_entrypoint.function_name, 'createExternalReviewCandidateEvidencePackExport');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_ACTIVE_ENTRYPOINT');
}

{
  const { evidence_pack_integration_index: body } = indexResult();
  const payload = body.integration_payload;

  assert.equal(payload.source_surface_sha256, body.source_surface_sha256);
  assert.equal(payload.source_surface_payload_sha256, body.source_surface_payload_sha256);
  assert.equal(payload.source_export_sha256, '66bbbf6a997c6227c59719f1baeb00a108ca79b82d20049cb37ac3118c0d0fad');
  assert.equal(payload.source_export_payload_sha256, '59369451a4b63e5525520710422404b5df5d4d586896a35cd2dcb7f676a1bcf4');
  assert.equal(payload.source_pack_sha256, '519ef4ea5961b2f6df141a5bdfab5c7c7ad4180897f7abcfdfbdf70fc611898d');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_PAYLOAD');
}

{
  const { evidence_pack_integration_index: body } = indexResult();
  const contract = body.integration_payload.stable_access_contract;

  assert.equal(contract.callable_by_joker_c2, true);
  assert.equal(contract.canonical_json_object, true);
  assert.equal(contract.deterministic_sha256_bound, true);
  assert.equal(contract.fail_closed_source_export_required, true);
  assert.equal(contract.human_review_readable, true);
  assert.equal(body.index_ready, true);
  assert.equal(body.fail_closed_source_surface_required, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_ACCESS_CONTRACT');
}

{
  const { evidence_pack_integration_index: body } = indexResult();

  assert.equal(body.index_scope, 'INTERNAL_RUNTIME_INTEGRATION_INDEX_ONLY');
  assert.equal(body.index_consumer, 'JOKER_C2');
  assert.equal(body.public_registry_mutated, false);
  assert.equal(body.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_FALSE_EFFECTS');
}

{
  const first = indexResult().evidence_pack_integration_index.evidence_pack_integration_index_sha256;
  const second = indexResult().evidence_pack_integration_index.evidence_pack_integration_index_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_DETERMINISTIC');
}

{
  const invalid = createExternalReviewCandidateEvidencePackIntegrationIndex({
    generated_at: '2026-09-23',
    surface_generated_at: '2026-09-23T13:15:00.000Z',
    export_generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });

  assert.equal(invalid.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_STATE.BLOCKED);
  assert.equal(invalid.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_GENERATED_AT_INVALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INTEGRATION_INDEX_GENERATED_AT_INVALID');
}
