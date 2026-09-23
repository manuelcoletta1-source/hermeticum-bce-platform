'use strict';

const { createHash } = require('node:crypto');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_PROTO =
  'hbce.external_review_candidate.evidence_chain_manifest.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE = Object.freeze({
  PREPARED: 'PREPARED',
  BLOCKED: 'BLOCKED'
});

const EXPLICIT_FALSE_RUNTIME_EFFECTS = Object.freeze({
  external_reviewer_appointed: false,
  external_review_execution_created: false,
  external_review_opinion_created: false,
  external_review_report_created: false,
  external_review_submission_created: false,
  external_review_publication_created: false,
  external_submission_dispatched: false,
  external_submission_transmitted: false,
  external_submission_accepted: false,
  external_submission_acknowledged: false,
  external_submission_receipt_created: false,
  external_submission_receipt_acknowledged: false,
  external_archive_storage_created: false,
  legal_certification_created: false,
  eidas_qualification_created: false,
  opc_allow_created: false,
  deployment_success_proven: false,
  production_deployment_proven: false,
  public_registry_mutated: false,
  external_trust_registry_mutated: false
});

const UPSTREAM_BOUNDARY = Object.freeze({
  layer_key: 'closure',
  pr_number: 98,
  feature_commit: '024bab37446f475fa4eb77eb7aea54b8e11e250d',
  merge_commit: '1b7fc26fd06381b53738ace446b1caebca941561',
  checkpoint_commit: '0cc0f8a5082f04dac6eb4e7384dff330aaa45131',
  checkpoint_doc_sha256: '9ed72ae076e1bacb13d0540ad0dfcebf07a7e7a7ad187a84a6b7a585b7d3ca83',
  runtime_sha256: 'ae1d4e2fa1069dc8a54c39be88555edcbbb30588492411e9be1b38e738e38799',
  test_sha256: 'f4a31cedc69f6a45001abc05cfda936a92607ff544e2605387ab610b7ed7bbe4',
  component_count: 39,
  state: 'CLOSED'
});

const EVIDENCE_CHAIN_LAYERS = Object.freeze([
  Object.freeze({
    layer_key: 'closure_register',
    pr_number: 99,
    feature_commit: '1fa99a89aab9284ed413b6f5206983549cdcf061',
    merge_commit: '0bd16cf78653ab42ba7caa7e64bcb9e793eb0335',
    checkpoint_commit: '4f2b1b914d4c22536bf8c2e800ffbdba1db7b6fe',
    checkpoint_doc_sha256: '33eb1dc848dc839bd6b4b0ec15fe10d0def49a2f44e9fc5e58c6dcc75f68e75a',
    runtime_sha256: 'ede41ed2a271a0d2128af39dc974e1fd5463f4fb400c2a615c3f1f93e63b4fa5',
    test_sha256: 'cfa5c24a48a41d55e46590cfcc39e0a13be3fe54129023a6bdc5ab6e1b3326fb',
    component_count: 40,
    state: 'REGISTERED'
  }),
  Object.freeze({
    layer_key: 'closure_ledger',
    pr_number: 100,
    feature_commit: '7ee4c4fc689cc087ef0a37c47240dbf61cf28b44',
    merge_commit: '8294c74c62f83cf6ce9336342e908ab34eff8a23',
    checkpoint_commit: 'c06d28b2f6f73c303a4b66e33324cc5c889e0156',
    checkpoint_doc_sha256: '05fdadd9cddc35eb35a78541a54308990460d4e26aad0e8f3d07db1c3e6641b4',
    runtime_sha256: '4847b339338f444931dc2f912d504fb2d013f11982577b37002470eb22ff6710',
    test_sha256: '1e95bc310690294f63469d3442886f3d62c96247026a704d7cec26862965257a',
    component_count: 41,
    state: 'LEDGERED'
  }),
  Object.freeze({
    layer_key: 'closure_seal',
    pr_number: 101,
    feature_commit: 'e7fc63f6c56ae6d78b13f5946508b47973afb7b1',
    merge_commit: '91dc63fea58c06f2c2efeae08e2211ae8e8fbcf3',
    checkpoint_commit: '1bb80275cfd57e65329de75367da4a31be9bee52',
    checkpoint_doc_sha256: '2ef57ed699e3e3933eb923ad7462241c9529a2cb32bba94d156de45be774a284',
    runtime_sha256: 'ceb63af4b0cd6eafb94970618a3cd5def75bba724117a845869cf771d07330c3',
    test_sha256: '43b682472085accb8a993c710ad8d68cac6e3b39ff9dddfad0172e35f7d22e1f',
    component_count: 42,
    state: 'SEALED'
  }),
  Object.freeze({
    layer_key: 'closure_closure',
    pr_number: 102,
    feature_commit: 'b34ed6aca5341f52a4b0441e4ae8a39757dfb30e',
    merge_commit: '0063650d09a330e82df9ef18b41cc0a764eb3df4',
    checkpoint_commit: '8478fc73d55d11d49995ac1280e110de5041f3fa',
    checkpoint_doc_sha256: '2281071de12b6d07490a26d2b3a1422b916d08705f13fdc1421b38531a2a829c',
    runtime_sha256: '0007d70236af8bee4c520794f5b7830a188c36d87f91f057112ff3d05a71a1a1',
    test_sha256: '9ae19c94c5304b54ebd9ecc433d8feedda11c390ce3409d355258cfee1ce8194',
    component_count: 43,
    state: 'CLOSED'
  }),
  Object.freeze({
    layer_key: 'closure_closure_register',
    pr_number: 103,
    feature_commit: '0e50df145ca129370bab8cd8d2e3a3adf869e891',
    merge_commit: 'ab2e800a3465ff4fc1aa2f73ce6e42ca5834b547',
    checkpoint_commit: '914e3e4a5100871449343f2e905ba5bff6592aac',
    checkpoint_doc_sha256: '692fd1182979c55975509040c337906f1c4b2b9f9fcb5faa3075c821d3121c02',
    runtime_sha256: '6d4ad302e250621bc740b145fb951cd19dfd9c3cc00b96da55a6d4e94bd56986',
    test_sha256: '6a5562e5e0fcdefb14fd53ddfba7135bd8927e04c8bc95ebd750862e8cfac44f',
    component_count: 44,
    state: 'REGISTERED'
  })
]);

function stableStringify(value) {
  if (value === null) return 'null';

  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || !Number.isSafeInteger(value)) {
      throw new TypeError('UNSAFE_NUMBER');
    }
    return String(value);
  }

  if (Array.isArray(value)) {
    return '[' + value.map((item) => stableStringify(item)).join(',') + ']';
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return '{' + keys.map((key) => JSON.stringify(key) + ':' + stableStringify(value[key])).join(',') + '}';
  }

  throw new TypeError('UNSUPPORTED_VALUE');
}

function sha256Hex(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function createExternalReviewCandidateEvidenceChainManifest(input = {}) {
  const generatedAt = input.generated_at || '2026-09-23T00:00:00.000Z';

  if (typeof generatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(generatedAt)) {
    return {
      state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE.BLOCKED,
      reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_GENERATED_AT_INVALID'
    };
  }

  const layers = cloneJson(EVIDENCE_CHAIN_LAYERS);
  const componentCounts = layers.map((layer) => layer.component_count);
  const prNumbers = layers.map((layer) => layer.pr_number);

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_KIND,
    version: '1.0.0',
    manifest_id: 'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-CHAIN-MANIFEST-2026-09-23',
    generated_at: generatedAt,
    authority: 'HBCE_INTERNAL_RUNTIME',
    chain_scope: 'INTERNAL_TECHNICAL_EVIDENCE_ONLY',
    current_main_commit: '914e3e4a5100871449343f2e905ba5bff6592aac',
    upstream_boundary: cloneJson(UPSTREAM_BOUNDARY),
    layers,
    layer_count: layers.length,
    pr_number_start: prNumbers[0],
    pr_number_end: prNumbers[prNumbers.length - 1],
    component_count_start: componentCounts[0],
    component_count_end: componentCounts[componentCounts.length - 1],
    component_counts_strictly_increase: componentCounts.every((count, index) => index === 0 || count === componentCounts[index - 1] + 1),
    checkpoint_chain_complete: layers.every((layer) => /^[a-f0-9]{40}$/.test(layer.checkpoint_commit)),
    sha256_chain_complete: layers.every((layer) =>
      /^[a-f0-9]{64}$/.test(layer.runtime_sha256) &&
      /^[a-f0-9]{64}$/.test(layer.test_sha256) &&
      /^[a-f0-9]{64}$/.test(layer.checkpoint_doc_sha256)
    ),
    policy_verification_summary: {
      node_version: 'v24.19.0',
      native_string_is_well_formed: true,
      policy_genealogy_pass: '11/11 PASS',
      policy_payload_pass: '18/18 PASS',
      policy_total_pass_count: 29,
      node18_polyfill_required: false
    },
    explicit_false_runtime_effects: cloneJson(EXPLICIT_FALSE_RUNTIME_EFFECTS),
    public_registry_mutated: false,
    external_trust_registry_mutated: false,
    legal_certification_created: false,
    eidas_qualification_created: false,
    opc_allow_created: false,
    deployment_success_proven: false,
    production_deployment_proven: false
  };

  body.evidence_chain_manifest_sha256 = sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE.PREPARED,
    reason: 'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_PREPARED',
    evidence_chain_manifest: body
  };
}

module.exports = {
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_CHAIN_MANIFEST_STATE,
  createExternalReviewCandidateEvidenceChainManifest
};
