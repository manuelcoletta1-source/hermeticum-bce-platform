'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE,
  createExternalReviewCandidateEvidencePackExport
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-export');

function exportResult() {
  return createExternalReviewCandidateEvidencePackExport({
    generated_at: '2026-09-23T13:00:00.000Z',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = exportResult();
  const body = actual.evidence_pack_export;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE.EXPORTED);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_EXPORTED');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_KIND);
  assert.equal(body.export_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-EXPORT-2026-09-23');
  assert.match(body.evidence_pack_export_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_EXPORTED');
}

{
  const { evidence_pack_export: body } = exportResult();

  assert.equal(body.export_main_commit, 'd8c5e5f4326827ff5acc5c5bc9970a58b63fb66d');
  assert.equal(body.source_pack_main_commit, 'a505fc1054c710ddc9341c684bdff1be5c148613');
  assert.equal(body.source_pack_checkpoint_commit, 'd8c5e5f4326827ff5acc5c5bc9970a58b63fb66d');
  assert.equal(body.source_pack_checkpoint_doc_sha256, 'c3f45323fd7b7ab263b45f57f4959c8f7f49ed08da5e10843c88e0491f93037f');
  assert.equal(body.source_pack_sha256, '519ef4ea5961b2f6df141a5bdfab5c7c7ad4180897f7abcfdfbdf70fc611898d');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SOURCE_PACK');
}

{
  const { evidence_pack_export: body } = exportResult();

  assert.equal(body.export_format, 'CANONICAL_JSON_OBJECT');
  assert.equal(body.export_consumer, 'JOKER_C2');
  assert.equal(body.export_scope, 'INTERNAL_RUNTIME_EXPORT_ONLY');
  assert.equal(body.export_ready, true);
  assert.equal(body.fail_closed_source_pack_required, true);
  assert.match(body.export_payload_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_BOUNDARY');
}

{
  const { evidence_pack_export: body } = exportResult();
  const payload = body.export_payload;

  assert.equal(payload.evidence_pack_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-2026-09-23');
  assert.equal(payload.evidence_pack_sha256, body.source_pack_sha256);
  assert.equal(payload.source_manifest_sha256, 'c02ee9f588ecbc3676ff90ce251f7c8d4deb8f7b60ed7c9d54556193d042b594');
  assert.equal(payload.packaging_main_commit, 'e0fbe6a9c781c23c06563e0a4fe61d31f8e316a3');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_PAYLOAD_ANCHORS');
}

{
  const { evidence_pack_export: body } = exportResult();
  const summary = body.export_payload.evidence_summary;

  assert.equal(summary.pr_number_start, 99);
  assert.equal(summary.pr_number_end, 103);
  assert.equal(summary.layer_count, 5);
  assert.equal(summary.upstream_boundary_pr_number, 98);
  assert.equal(summary.component_count_start, 40);
  assert.equal(summary.component_count_end, 44);
  assert.equal(summary.checkpoint_chain_complete, true);
  assert.equal(summary.sha256_chain_complete, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_SUMMARY');
}

{
  const { evidence_pack_export: body } = exportResult();
  const items = body.export_payload.evidence_items;

  assert.equal(items.length, 5);
  assert.deepEqual(items.map((item) => item.pr_number), [99, 100, 101, 102, 103]);
  assert.deepEqual(items.map((item) => item.layer_key), [
    'closure_register',
    'closure_ledger',
    'closure_seal',
    'closure_closure',
    'closure_closure_register'
  ]);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_ITEMS');
}

{
  const { evidence_pack_export: body } = exportResult();
  const runtimeAccess = body.export_payload.runtime_access;
  const exportBoundary = body.export_payload.export_boundary;

  assert.equal(runtimeAccess.joker_c2_consumable, true);
  assert.equal(runtimeAccess.human_review_readable, true);
  assert.equal(runtimeAccess.deterministic_sha256_bound, true);
  assert.equal(runtimeAccess.fail_closed_source_manifest_required, true);
  assert.equal(exportBoundary.internal_runtime_export_ready, true);
  assert.equal(exportBoundary.external_submission_ready, false);
  assert.equal(exportBoundary.external_publication_ready, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_RUNTIME_ACCESS');
}

{
  const { evidence_pack_export: body } = exportResult();

  assert.equal(body.export_payload.explicit_false_runtime_effects.external_archive_storage_created, false);
  assert.equal(body.export_payload.explicit_false_runtime_effects.public_registry_mutated, false);
  assert.equal(body.export_payload.explicit_false_runtime_effects.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_FALSE_EFFECTS');
}

{
  const first = exportResult().evidence_pack_export.evidence_pack_export_sha256;
  const second = exportResult().evidence_pack_export.evidence_pack_export_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_DETERMINISTIC');
}

{
  const invalid = createExternalReviewCandidateEvidencePackExport({
    generated_at: '2026-09-23',
    pack_generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });

  assert.equal(invalid.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_STATE.BLOCKED);
  assert.equal(invalid.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_GENERATED_AT_INVALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_EXPORT_GENERATED_AT_INVALID');
}
