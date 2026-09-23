'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE,
  createExternalReviewCandidateEvidencePack
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack');

function packResult() {
  return createExternalReviewCandidateEvidencePack({
    generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = packResult();
  const body = actual.evidence_pack;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE.READY);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_READY');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_KIND);
  assert.equal(body.evidence_pack_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-2026-09-23');
  assert.match(body.evidence_pack_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_READY');
}

{
  const { evidence_pack: body } = packResult();

  assert.equal(body.packaging_main_commit, 'e0fbe6a9c781c23c06563e0a4fe61d31f8e316a3');
  assert.equal(body.source_manifest_main_commit, '914e3e4a5100871449343f2e905ba5bff6592aac');
  assert.equal(body.source_manifest_sha256, 'c02ee9f588ecbc3676ff90ce251f7c8d4deb8f7b60ed7c9d54556193d042b594');
  assert.equal(body.source_manifest_checkpoint_commit, 'e0fbe6a9c781c23c06563e0a4fe61d31f8e316a3');
  assert.equal(body.source_manifest_checkpoint_doc_sha256, '7b4a7229793477939007be7fceb272eb521c3b17b4d24084d72c5f818b436ab5');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_SOURCE_MANIFEST');
}

{
  const { evidence_pack: body } = packResult();

  assert.equal(body.evidence_summary.pr_number_start, 99);
  assert.equal(body.evidence_summary.pr_number_end, 103);
  assert.equal(body.evidence_summary.layer_count, 5);
  assert.equal(body.evidence_summary.upstream_boundary_pr_number, 98);
  assert.equal(body.evidence_summary.upstream_boundary_component_count, 39);
  assert.equal(body.evidence_summary.component_count_start, 40);
  assert.equal(body.evidence_summary.component_count_end, 44);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_SUMMARY');
}

{
  const { evidence_pack: body } = packResult();

  assert.equal(body.evidence_item_count, 5);
  assert.deepEqual(body.evidence_items.map((item) => item.layer_key), [
    'closure_register',
    'closure_ledger',
    'closure_seal',
    'closure_closure',
    'closure_closure_register'
  ]);
  assert.deepEqual(body.evidence_items.map((item) => item.pr_number), [99, 100, 101, 102, 103]);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ITEMS');
}

{
  const { evidence_pack: body } = packResult();

  const first = body.evidence_items[0];
  const last = body.evidence_items[4];

  assert.equal(first.feature_commit, '1fa99a89aab9284ed413b6f5206983549cdcf061');
  assert.equal(first.component_count, 40);
  assert.equal(last.feature_commit, '0e50df145ca129370bab8cd8d2e3a3adf869e891');
  assert.equal(last.checkpoint_commit, '914e3e4a5100871449343f2e905ba5bff6592aac');
  assert.equal(last.component_count, 44);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_ITEM_ANCHORS');
}

{
  const { evidence_pack: body } = packResult();

  assert.equal(body.policy_verification_summary.node_version, 'v24.19.0');
  assert.equal(body.policy_verification_summary.native_string_is_well_formed, true);
  assert.equal(body.policy_verification_summary.policy_genealogy_pass, '11/11 PASS');
  assert.equal(body.policy_verification_summary.policy_payload_pass, '18/18 PASS');
  assert.equal(body.policy_verification_summary.policy_total_pass_count, 29);
  assert.equal(body.policy_verification_summary.node18_polyfill_required, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_POLICY_SUMMARY');
}

{
  const { evidence_pack: body } = packResult();

  assert.equal(body.runtime_access.joker_c2_consumable, true);
  assert.equal(body.runtime_access.human_review_readable, true);
  assert.equal(body.runtime_access.deterministic_sha256_bound, true);
  assert.equal(body.runtime_access.fail_closed_source_manifest_required, true);
  assert.equal(body.export_boundary.internal_runtime_export_ready, true);
  assert.equal(body.export_boundary.external_submission_ready, false);
  assert.equal(body.export_boundary.legal_certification_ready, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_ACCESS');
}

{
  const { evidence_pack: body } = packResult();

  assert.equal(body.explicit_false_runtime_effects.external_archive_storage_created, false);
  assert.equal(body.explicit_false_runtime_effects.public_registry_mutated, false);
  assert.equal(body.explicit_false_runtime_effects.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_FALSE_EFFECTS');
}

{
  const first = packResult().evidence_pack.evidence_pack_sha256;
  const second = packResult().evidence_pack.evidence_pack_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_DETERMINISTIC');
}

{
  const invalidPackDate = createExternalReviewCandidateEvidencePack({
    generated_at: '2026-09-23',
    manifest_generated_at: '2026-09-23T12:30:00.000Z'
  });

  const invalidManifestDate = createExternalReviewCandidateEvidencePack({
    generated_at: '2026-09-23T12:45:00.000Z',
    manifest_generated_at: '2026-09-23'
  });

  assert.equal(invalidPackDate.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE.BLOCKED);
  assert.equal(invalidPackDate.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_GENERATED_AT_INVALID');
  assert.equal(invalidManifestDate.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_STATE.BLOCKED);
  assert.equal(invalidManifestDate.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_MANIFEST_GENERATED_AT_INVALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_INVALID_DATES');
}
