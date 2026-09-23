'use strict';

const assert = require('node:assert/strict');

const {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE,
  createExternalReviewCandidateEvidenceChainManifest
} = require('../../runtime/external-review/create-external-review-candidate-evidence-chain-manifest');

function manifestResult() {
  return createExternalReviewCandidateEvidenceChainManifest({
    generated_at: '2026-09-23T12:30:00.000Z'
  });
}

{
  const actual = manifestResult();
  const body = actual.evidence_chain_manifest;

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE.PREPARED);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_PREPARED');
  assert.equal(body.proto, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_PROTO);
  assert.equal(body.kind, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_KIND);
  assert.equal(body.manifest_id, 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-CHAIN-MANIFEST-2026-09-23');
  assert.match(body.evidence_chain_manifest_sha256, /^[a-f0-9]{64}$/);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_PREPARED');
}

{
  const { evidence_chain_manifest: body } = manifestResult();

  assert.equal(body.current_main_commit, '914e3e4a5100871449343f2e905ba5bff6592aac');
  assert.equal(body.layer_count, 5);
  assert.equal(body.pr_number_start, 99);
  assert.equal(body.pr_number_end, 103);
  assert.deepEqual(body.layers.map((layer) => layer.pr_number), [99, 100, 101, 102, 103]);
  assert.deepEqual(body.layers.map((layer) => layer.layer_key), [
    'closure_register',
    'closure_ledger',
    'closure_seal',
    'closure_closure',
    'closure_closure_register'
  ]);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_LAYER_ORDER');
}

{
  const { evidence_chain_manifest: body } = manifestResult();

  assert.equal(body.upstream_boundary.layer_key, 'closure');
  assert.equal(body.upstream_boundary.pr_number, 98);
  assert.equal(body.upstream_boundary.component_count, 39);
  assert.equal(body.upstream_boundary.state, 'CLOSED');
  assert.equal(body.layers[0].component_count, 40);
  assert.equal(body.layers[4].component_count, 44);
  assert.equal(body.component_counts_strictly_increase, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_COMPONENT_COUNTS');
}

{
  const { evidence_chain_manifest: body } = manifestResult();

  assert.equal(body.layers[0].feature_commit, '1fa99a89aab9284ed413b6f5206983549cdcf061');
  assert.equal(body.layers[1].feature_commit, '7ee4c4fc689cc087ef0a37c47240dbf61cf28b44');
  assert.equal(body.layers[2].feature_commit, 'e7fc63f6c56ae6d78b13f5946508b47973afb7b1');
  assert.equal(body.layers[3].feature_commit, 'b34ed6aca5341f52a4b0441e4ae8a39757dfb30e');
  assert.equal(body.layers[4].feature_commit, '0e50df145ca129370bab8cd8d2e3a3adf869e891');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_FEATURE_COMMITS');
}

{
  const { evidence_chain_manifest: body } = manifestResult();

  assert.equal(body.layers[0].checkpoint_commit, '4f2b1b914d4c22536bf8c2e800ffbdba1db7b6fe');
  assert.equal(body.layers[1].checkpoint_commit, 'c06d28b2f6f73c303a4b66e33324cc5c889e0156');
  assert.equal(body.layers[2].checkpoint_commit, '1bb80275cfd57e65329de75367da4a31be9bee52');
  assert.equal(body.layers[3].checkpoint_commit, '8478fc73d55d11d49995ac1280e110de5041f3fa');
  assert.equal(body.layers[4].checkpoint_commit, '914e3e4a5100871449343f2e905ba5bff6592aac');
  assert.equal(body.checkpoint_chain_complete, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_CHECKPOINTS');
}

{
  const { evidence_chain_manifest: body } = manifestResult();

  assert.equal(body.layers[0].runtime_sha256, 'ede41ed2a271a0d2128af39dc974e1fd5463f4fb400c2a615c3f1f93e63b4fa5');
  assert.equal(body.layers[4].runtime_sha256, '6d4ad302e250621bc740b145fb951cd19dfd9c3cc00b96da55a6d4e94bd56986');
  assert.equal(body.layers[4].test_sha256, '6a5562e5e0fcdefb14fd53ddfba7135bd8927e04c8bc95ebd750862e8cfac44f');
  assert.equal(body.sha256_chain_complete, true);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_SHA256_CHAIN');
}

{
  const { evidence_chain_manifest: body } = manifestResult();

  assert.equal(body.policy_verification_summary.node_version, 'v24.19.0');
  assert.equal(body.policy_verification_summary.native_string_is_well_formed, true);
  assert.equal(body.policy_verification_summary.policy_genealogy_pass, '11/11 PASS');
  assert.equal(body.policy_verification_summary.policy_payload_pass, '18/18 PASS');
  assert.equal(body.policy_verification_summary.policy_total_pass_count, 29);
  assert.equal(body.policy_verification_summary.node18_polyfill_required, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_POLICY_SUMMARY');
}

{
  const { evidence_chain_manifest: body } = manifestResult();

  assert.equal(body.explicit_false_runtime_effects.external_archive_storage_created, false);
  assert.equal(body.explicit_false_runtime_effects.public_registry_mutated, false);
  assert.equal(body.explicit_false_runtime_effects.external_trust_registry_mutated, false);
  assert.equal(body.legal_certification_created, false);
  assert.equal(body.eidas_qualification_created, false);
  assert.equal(body.opc_allow_created, false);
  assert.equal(body.deployment_success_proven, false);
  assert.equal(body.production_deployment_proven, false);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_FALSE_EFFECTS');
}

{
  const first = manifestResult().evidence_chain_manifest.evidence_chain_manifest_sha256;
  const second = manifestResult().evidence_chain_manifest.evidence_chain_manifest_sha256;

  assert.equal(first, second);
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_DETERMINISTIC');
}

{
  const actual = createExternalReviewCandidateEvidenceChainManifest({
    generated_at: '2026-09-23'
  });

  assert.equal(actual.state, HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE.BLOCKED);
  assert.equal(actual.reason, 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_GENERATED_AT_INVALID');
  console.log('PASS HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_GENERATED_AT_INVALID');
}
