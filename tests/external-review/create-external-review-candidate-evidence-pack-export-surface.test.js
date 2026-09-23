'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE,
  createExternalReviewCandidateEvidencePackExportSurface
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-export-surface');

function surfaceResult() {
  return createExternalReviewCandidateEvidencePackExportSurface({
    generated_at: '2026-09-23T13:15:00.000Z',
    export_generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = surfaceResult();
  const body = actual.evidence_pack_export_surface;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_KIND);
  assert.equal(body.surface_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-EXPORT-SURFACE-2026-09-23');
  assert.match(body.evidence_pack_export_surface_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_READY');
}

{
  const { evidence_pack_export_surface: body } = surfaceResult();

  assert.equal(body.surface_main_commit, 'b920ca9ca3300994ed967a81d1c488dbdfcf949a');
  assert.equal(body.source_export_main_commit, 'a8352e1e7e3b57cdec1fa8859ecd06b465c8208d');
  assert.equal(body.source_export_checkpoint_commit, 'b920ca9ca3300994ed967a81d1c488dbdfcf949a');
  assert.equal(body.source_export_checkpoint_doc_sha256, 'ddad749c3dfcb17b5ac4c434a4497b44a48a0589462643e58244ce1cbabd0191');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_SOURCE_EXPORT');
}

{
  const { evidence_pack_export_surface: body } = surfaceResult();

  assert.equal(body.source_export_sha256, '66bbbf6a997c6227c59719f1baeb00a108ca79b82d20049cb37ac3118c0d0fad');
  assert.equal(body.source_export_payload_sha256, '59369451a4b63e5525520710422404b5df5d4d586896a35cd2dcb7f676a1bcf4');
  assert.match(body.surface_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_HASHES');
}

{
  const { evidence_pack_export_surface: body } = surfaceResult();

  assert.equal(body.runtime_entrypoint.module_path, 'runtime/external-review/create-external-review-candidate-evidence-pack-export.js');
  assert.equal(body.runtime_entrypoint.function_name, 'createExternalReviewCandidateEvidencePackExport');
  assert.equal(body.runtime_entrypoint.default_export_generated_at, '2026-09-23T13:00:00.000Z');
  assert.equal(body.runtime_entrypoint.default_pack_generated_at, '2026-09-23T12:45:00.000Z');
  assert.equal(body.runtime_entrypoint.default_manifest_generated_at, '2026-09-23T12:30:00.000Z');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_ENTRYPOINT');
}

{
  const { evidence_pack_export_surface: body } = surfaceResult();

  assert.equal(body.stable_access_contract.callable_by_joker_c2, true);
  assert.equal(body.stable_access_contract.canonical_json_object, true);
  assert.equal(body.stable_access_contract.deterministic_sha256_bound, true);
  assert.equal(body.stable_access_contract.fail_closed_source_export_required, true);
  assert.equal(body.stable_access_contract.human_review_readable, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_ACCESS_CONTRACT');
}

{
  const { evidence_pack_export_surface: body } = surfaceResult();
  const payload = body.surface_payload;

  assert.equal(payload.export_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-EXPORT-2026-09-23');
  assert.equal(payload.export_sha256, body.source_export_sha256);
  assert.equal(payload.export_payload_sha256, body.source_export_payload_sha256);
  assert.equal(payload.export_consumer, 'JOKER_C2');
  assert.equal(payload.export_scope, 'INTERNAL_RUNTIME_EXPORT_ONLY');
  assert.equal(payload.export_ready, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_PAYLOAD');
}

{
  const { evidence_pack_export_surface: body } = surfaceResult();
  const summary = body.surface_payload.evidence_summary;

  assert.equal(summary.pr_number_start, 99);
  assert.equal(summary.pr_number_end, 103);
  assert.equal(summary.layer_count, 5);
  assert.equal(summary.component_count_start, 40);
  assert.equal(summary.component_count_end, 44);
  assert.equal(summary.checkpoint_chain_complete, true);
  assert.equal(summary.sha256_chain_complete, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_SUMMARY');
}

{
  const { evidence_pack_export_surface: body } = surfaceResult();

  assert.equal(body.surface_payload.explicit_false_runtime_effects.external_archive_storage_created, false);
  assert.equal(body.surface_payload.explicit_false_runtime_effects.public_registry_mutated, false);
  assert.equal(body.surface_payload.explicit_false_runtime_effects.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_FALSE_EFFECTS');
}

{
  const first = surfaceResult().evidence_pack_export_surface.evidence_pack_export_surface_sha256;
  const second = surfaceResult().evidence_pack_export_surface.evidence_pack_export_surface_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_DETERMINISTIC');
}

{
  const invalid = createExternalReviewCandidateEvidencePackExportSurface({
    generated_at: '2026-09-23',
    export_generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });

  assert.equal(invalid.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_STATE.BLOCKED);
  assert.equal(invalid.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_GENERATED_AT_INVALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SURFACE_GENERATED_AT_INVALID');
}
