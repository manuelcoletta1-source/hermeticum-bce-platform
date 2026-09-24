'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');

const DOSSIER =
  'artifacts/product/hbce-evidence-core-v1-external-facing-dossier-2026-09-24.md';

const PACK_INDEX =
  'artifacts/product/hbce-evidence-core-v1-banking-demo-pack-index-2026-09-24.md';

const CONTRACT =
  'artifacts/product/hbce-evidence-core-v1-api-adapter-contract-2026-09-24.md';

const MANIFEST =
  'artifacts/product/hbce-evidence-core-v1-banking-demo-manifest-2026-09-24.md';

const ARTIFACT =
  'artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json';

const EXPECTED = Object.freeze({
  pack_index_sha256:
    '261131010e24687c1fe9f5be486cee9145ac8c8a931c67077b5c7fc4daab93c3',
  pack_index_test_sha256:
    '6172a61017d0de5665f17eb440abaa89a526af0fe6ccc8968a801ab982a66f6f',
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
  pr135_checkpoint_main:
    'dfe5b14cab6d0622b3dafc716b7054781ac6e0af',
  pr135_checkpoint_doc_sha256:
    '567f13688134f6b831a47028bf73ea32ac21f1281233079813d83e295c59a835'
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

function dossierText() {
  return text(DOSSIER);
}

function artifactJson() {
  return JSON.parse(text(ARTIFACT));
}

(function dossierExists() {
  assert.equal(fs.existsSync(DOSSIER), true);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_EXISTS');
})();

(function headings() {
  const doc = dossierText();
  assert.match(doc, /^# HBCE Evidence Core v1 — External-Facing Banking Review Dossier/m);
  assert.match(doc, /^## Dossier status/m);
  assert.match(doc, /^## Executive summary/m);
  assert.match(doc, /^## What HBCE Evidence Core v1 is/m);
  assert.match(doc, /^## What the banking demo pack contains/m);
  assert.match(doc, /^## Primary reviewer entrypoint/m);
  assert.match(doc, /^## Review procedure/m);
  assert.match(doc, /^## Verification chain/m);
  assert.match(doc, /^## Boundary statement/m);
  assert.match(doc, /^## Launch relevance/m);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_HEADINGS');
})();

(function statusAndAudience() {
  const doc = dossierText();
  assert.match(doc, /HBCE_EXTERNAL_FACING_DOSSIER_STATUS=READY_FOR_CONTROLLED_REVIEW/);
  assert.match(doc, /external-facing review narrative/);
  assert.match(doc, /banking, compliance, audit, security, innovation and procurement readers/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_STATUS_AND_AUDIENCE');
})();

(function checkpointReferences() {
  const doc = dossierText();
  assert.ok(doc.includes(EXPECTED.pr135_checkpoint_main));
  assert.ok(doc.includes(EXPECTED.pr135_checkpoint_doc_sha256));
  pass('HBCE_EXTERNAL_FACING_DOSSIER_CHECKPOINT_REFERENCES');
})();

(function executiveSummary() {
  const doc = dossierText();
  assert.match(doc, /controlled evidence layer/);
  assert.match(doc, /deterministic, read-only and fail-closed/);
  assert.match(doc, /suitable for evaluation of evidence structure/);
  assert.match(doc, /not suitable for production banking use/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_EXECUTIVE_SUMMARY');
})();

(function hbceDefinition() {
  const doc = dossierText();
  assert.match(doc, /evidence-oriented product layer/);
  assert.match(doc, /inspectable artifacts/);
  assert.match(doc, /deterministic hashes/);
  assert.match(doc, /validation tests/);
  assert.match(doc, /explicit operational boundaries/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_HBCE_DEFINITION');
})();

(function packContents() {
  const doc = dossierText();
  assert.match(doc, /single reviewer-facing pack index/);
  assert.match(doc, /committed static demo JSON artifact/);
  assert.match(doc, /human-readable banking demo manifest/);
  assert.match(doc, /future API adapter contract/);
  assert.match(doc, /non-regulatory boundaries/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_PACK_CONTENTS');
})();

(function artifactReferences() {
  const doc = dossierText();
  assert.ok(doc.includes(PACK_INDEX));
  assert.ok(doc.includes(CONTRACT));
  assert.ok(doc.includes(MANIFEST));
  assert.ok(doc.includes(ARTIFACT));
  pass('HBCE_EXTERNAL_FACING_DOSSIER_ARTIFACT_REFERENCES');
})();

(function sourceHashes() {
  const doc = dossierText();
  assert.ok(doc.includes(EXPECTED.pack_index_sha256));
  assert.ok(doc.includes(EXPECTED.pack_index_test_sha256));
  assert.ok(doc.includes(EXPECTED.contract_sha256));
  assert.ok(doc.includes(EXPECTED.contract_test_sha256));
  assert.ok(doc.includes(EXPECTED.manifest_sha256));
  assert.ok(doc.includes(EXPECTED.manifest_test_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_file_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_export_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_core_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_test_sha256));
  pass('HBCE_EXTERNAL_FACING_DOSSIER_SOURCE_HASHES');
})();

(function demonstratedClaims() {
  const doc = dossierText();
  assert.match(doc, /deterministic internal evidence packaging/);
  assert.match(doc, /reproducible SHA-256 verification/);
  assert.match(doc, /banking-review-ready explanation layer/);
  assert.match(doc, /controlled reviewer handoff/);
  assert.match(doc, /non-authorizing behavior/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_DEMONSTRATED_CLAIMS');
})();

(function prohibitedClaims() {
  const doc = dossierText();
  assert.match(doc, /production deployment/);
  assert.match(doc, /live API availability/);
  assert.match(doc, /legal certification/);
  assert.match(doc, /eIDAS qualification/);
  assert.match(doc, /regulatory approval/);
  assert.match(doc, /financial transaction approval/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_PROHIBITED_CLAIMS');
})();

(function correctAndIncorrectInterpretation() {
  const doc = dossierText();
  assert.match(doc, /deterministic internal banking demo evidence pack ready for controlled review/);
  assert.match(doc, /production authorization, regulatory approval, live banking execution or an active API endpoint/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_INTERPRETATION');
})();

(function reviewProcedure() {
  const doc = dossierText();
  assert.match(doc, /Read this dossier/);
  assert.match(doc, /Open the banking demo pack index/);
  assert.match(doc, /Inspect the committed demo JSON artifact/);
  assert.match(doc, /Run the validation tests/);
  assert.match(doc, /Compare the SHA-256 hashes/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_REVIEW_PROCEDURE');
})();

(function verificationChain() {
  const doc = dossierText();
  assert.match(doc, /19\/19 PASS/);
  assert.match(doc, /18\/18 PASS/);
  assert.match(doc, /16\/16 PASS/);
  assert.match(doc, /15\/15 PASS/);
  assert.match(doc, /13\/13 PASS/);
  assert.match(doc, /19\/19 PASS/);
  assert.match(doc, /21\/21 PASS/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_VERIFICATION_CHAIN');
})();

(function boundaryStatement() {
  const doc = dossierText();
  assert.match(doc, /does not grant authorization/);
  assert.match(doc, /does not create authorization artifacts/);
  assert.match(doc, /does not execute runtime actions/);
  assert.match(doc, /does not mutate runtime state/);
  assert.match(doc, /does not create eIDAS qualification/);
  assert.match(doc, /does not claim regulatory approval/);
  assert.match(doc, /does not authorize banking operations/);
  assert.match(doc, /does not approve live financial transactions/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_BOUNDARY_STATEMENT');
})();

(function intendedExternalUse() {
  const doc = dossierText();
  assert.match(doc, /controlled review document/);
  assert.match(doc, /request technical evaluation/);
  assert.match(doc, /request structured feedback/);
  assert.match(doc, /discuss pilot feasibility/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_INTENDED_EXTERNAL_USE');
})();

(function launchRelevance() {
  const doc = dossierText();
  assert.match(doc, /2027 HBCE product launch/);
  assert.match(doc, /external-facing review narrative/);
  assert.match(doc, /reviewer checklist/);
  assert.match(doc, /pilot evaluation protocol/);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_LAUNCH_RELEVANCE');
})();

(function sourceHashesMatchFiles() {
  const artifact = artifactJson();
  assert.equal(sha256Text(text(PACK_INDEX)), EXPECTED.pack_index_sha256);
  assert.equal(sha256Text(text(CONTRACT)), EXPECTED.contract_sha256);
  assert.equal(sha256Text(text(MANIFEST)), EXPECTED.manifest_sha256);
  assert.equal(sha256Text(text(ARTIFACT)), EXPECTED.artifact_file_sha256);
  assert.equal(artifact.evidence_core_v1_demo_payload_export_sha256, EXPECTED.artifact_export_sha256);
  assert.equal(artifact.demo_payload_core_sha256, EXPECTED.artifact_core_sha256);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_SOURCE_HASHES_MATCH_FILES');
})();

(function deterministicDossierFileHash() {
  const hash = sha256Text(dossierText());
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(dossierText().endsWith('\n'), true);
  pass('HBCE_EXTERNAL_FACING_DOSSIER_FILE_HASH_STABLE');
})();
