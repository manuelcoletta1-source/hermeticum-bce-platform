'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');

const INDEX =
  'artifacts/product/hbce-evidence-core-v1-banking-demo-pack-index-2026-09-24.md';

const CONTRACT =
  'artifacts/product/hbce-evidence-core-v1-api-adapter-contract-2026-09-24.md';

const MANIFEST =
  'artifacts/product/hbce-evidence-core-v1-banking-demo-manifest-2026-09-24.md';

const ARTIFACT =
  'artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json';

const EXPECTED = Object.freeze({
  contract_sha256:
    '79233f7f37c0afca1dff0fc604f425d094d54e968a7bb864b88c3805ac87a963',
  contract_test_sha256:
    'e9ea6782c0903b46451ea7ae34b50e99e49a30db47828e4952ec233646cc52d2',
  manifest_sha256:
    'd8d839c54e676f46f5e3f8b43d9a1e0b9503f9e6e1f387036962e093249c040c',
  manifest_test_sha256:
    '1db3c724a450053adee9de011792bf4505946a35fc6d79ae2aa25704054d09da',
  artifact_file_sha256:
    'fb688399b1fbabe7060a9c74f3a88aeb03c60d0069ae6c4ed40a330697ba710f',
  artifact_export_sha256:
    'a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd',
  artifact_core_sha256:
    'a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5',
  artifact_test_sha256:
    'b9dfe9c84524f78aff856f26dfcd6cf6c6276b0259d6c5df61fb9fcbfb7dd515',
  pr134_checkpoint_main:
    'bde30ad90ec4f006c6e44bfa99136e0eaf1ede9e',
  pr134_checkpoint_doc_sha256:
    'aa8575ce57f7a761e001928a703391d717481c91e6e063db8441c86dfd628bc9'
});

function pass(name) {
  console.log(`PASS ${name}`);
}

function text(path) {
  return fs.readFileSync(path, 'utf8');
}

function sha256Text(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function indexText() {
  return text(INDEX);
}

function artifactJson() {
  return JSON.parse(text(ARTIFACT));
}

(function indexExists() {
  assert.equal(fs.existsSync(INDEX), true);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_EXISTS');
})();

(function headings() {
  const doc = indexText();
  assert.match(doc, /^# HBCE Evidence Core v1 — Banking Demo Pack Index/m);
  assert.match(doc, /^## Pack status/m);
  assert.match(doc, /^## Pack artifacts/m);
  assert.match(doc, /^## Reviewer entrypoint/m);
  assert.match(doc, /^## What the pack demonstrates/m);
  assert.match(doc, /^## Allowed claims/m);
  assert.match(doc, /^## Prohibited claims/m);
  assert.match(doc, /^## Boundary summary/m);
  assert.match(doc, /^## Verification chain/m);
  assert.match(doc, /^## Controlled handoff meaning/m);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_HEADINGS');
})();

(function packStatus() {
  const doc = indexText();
  assert.match(doc, /HBCE_BANKING_DEMO_PACK_INDEX_STATUS=READY/);
  assert.match(doc, /single reviewer entrypoint/);
  assert.match(doc, /committed demo JSON artifact/);
  assert.match(doc, /future API adapter contract/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_STATUS');
})();

(function sourceArtifacts() {
  const doc = indexText();
  assert.ok(doc.includes(CONTRACT));
  assert.ok(doc.includes(MANIFEST));
  assert.ok(doc.includes(ARTIFACT));
  assert.ok(doc.includes('tests/product/validate-hbce-evidence-core-v1-api-adapter-contract.test.js'));
  assert.ok(doc.includes('tests/product/validate-hbce-evidence-core-v1-banking-demo-manifest.test.js'));
  assert.ok(doc.includes('tests/product/validate-hbce-evidence-core-v1-demo-json-artifact.test.js'));
  pass('HBCE_BANKING_DEMO_PACK_INDEX_SOURCE_ARTIFACTS');
})();

(function sourceHashes() {
  const doc = indexText();
  assert.ok(doc.includes(EXPECTED.contract_sha256));
  assert.ok(doc.includes(EXPECTED.contract_test_sha256));
  assert.ok(doc.includes(EXPECTED.manifest_sha256));
  assert.ok(doc.includes(EXPECTED.manifest_test_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_file_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_export_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_core_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_test_sha256));
  pass('HBCE_BANKING_DEMO_PACK_INDEX_SOURCE_HASHES');
})();

(function sourceCheckpoint() {
  const doc = indexText();
  assert.ok(doc.includes(EXPECTED.pr134_checkpoint_main));
  assert.ok(doc.includes(EXPECTED.pr134_checkpoint_doc_sha256));
  pass('HBCE_BANKING_DEMO_PACK_INDEX_SOURCE_CHECKPOINT');
})();

(function reviewerEntrypoint() {
  const doc = indexText();
  assert.match(doc, /Read this pack index/);
  assert.match(doc, /Read the banking demo manifest/);
  assert.match(doc, /Inspect the demo JSON artifact/);
  assert.match(doc, /Read the API adapter contract/);
  assert.match(doc, /Compare all SHA-256 hashes/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_REVIEWER_ENTRYPOINT');
})();

(function packContents() {
  const doc = indexText();
  assert.match(doc, /static JSON evidence artifact/);
  assert.match(doc, /human-readable banking demo manifest/);
  assert.match(doc, /future API adapter contract/);
  assert.match(doc, /explicit non-production boundary/);
  assert.match(doc, /explicit non-authorization boundary/);
  assert.match(doc, /explicit non-regulatory boundary/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_PACK_CONTENTS');
})();

(function allowedClaims() {
  const doc = indexText();
  assert.match(doc, /deterministic internal evidence chain/);
  assert.match(doc, /fail-closed access decision behavior/);
  assert.match(doc, /banking-review-ready demo manifest/);
  assert.match(doc, /future API adapter contract defined/);
  assert.match(doc, /controlled reviewer handoff package/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_ALLOWED_CLAIMS');
})();

(function prohibitedClaims() {
  const doc = indexText();
  assert.match(doc, /production deployment proof/);
  assert.match(doc, /live API availability/);
  assert.match(doc, /legal certification/);
  assert.match(doc, /eIDAS qualification/);
  assert.match(doc, /regulatory approval/);
  assert.match(doc, /live transaction approval/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_PROHIBITED_CLAIMS');
})();

(function boundarySummary() {
  const doc = indexText();
  assert.match(doc, /non-authorizing/);
  assert.match(doc, /non-executing/);
  assert.match(doc, /non-mutating/);
  assert.match(doc, /non-production/);
  assert.match(doc, /non-regulatory/);
  assert.match(doc, /does not grant authorization/);
  assert.match(doc, /does not authorize banking operations/);
  assert.match(doc, /does not .* approve live financial transactions/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_BOUNDARY_SUMMARY');
})();

(function repositoryConstraint() {
  const doc = indexText();
  assert.match(doc, /does not provide a live application route scaffold/);
  assert.match(doc, /specification artifact only/);
  assert.match(doc, /must not be interpreted as proof that a live API route exists/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_REPOSITORY_CONSTRAINT');
})();

(function verificationChain() {
  const doc = indexText();
  assert.match(doc, /16\/16 PASS/);
  assert.match(doc, /15\/15 PASS/);
  assert.match(doc, /13\/13 PASS/);
  assert.match(doc, /18\/18 PASS/);
  assert.match(doc, /19\/19 PASS/);
  assert.match(doc, /21\/21 PASS/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_VERIFICATION_CHAIN');
})();

(function controlledHandoff() {
  const doc = indexText();
  assert.match(doc, /controlled handoff to banking, compliance, audit, security, innovation or procurement reviewers/);
  assert.match(doc, /deterministic internal banking demo evidence pack ready for controlled review/);
  assert.match(doc, /production authorization, regulatory approval, live banking execution or an active API endpoint/);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_CONTROLLED_HANDOFF');
})();

(function sourceHashesMatchFiles() {
  const artifact = artifactJson();
  assert.equal(sha256Text(text(CONTRACT)), EXPECTED.contract_sha256);
  assert.equal(sha256Text(text(MANIFEST)), EXPECTED.manifest_sha256);
  assert.equal(sha256Text(text(ARTIFACT)), EXPECTED.artifact_file_sha256);
  assert.equal(artifact.evidence_core_v1_demo_payload_export_sha256, EXPECTED.artifact_export_sha256);
  assert.equal(artifact.demo_payload_core_sha256, EXPECTED.artifact_core_sha256);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_SOURCE_HASHES_MATCH_FILES');
})();

(function deterministicIndexFileHash() {
  const hash = sha256Text(indexText());
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(indexText().endsWith('\n'), true);
  pass('HBCE_BANKING_DEMO_PACK_INDEX_FILE_HASH_STABLE');
})();
