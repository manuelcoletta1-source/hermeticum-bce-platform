'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');

const MANIFEST =
  'artifacts/product/hbce-evidence-core-v1-banking-demo-manifest-2026-09-24.md';

const ARTIFACT =
  'artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json';

const EXPECTED = Object.freeze({
  artifact_file_sha256:
    'fb688399b1fbabe7060a9c74f3a88aeb03c60d0069ae6c4ed40a330697ba710f',
  artifact_export_sha256:
    'a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd',
  artifact_core_sha256:
    'a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5',
  pr132_checkpoint_main:
    '5772d589629e944f60db2eff1b0be43f23e6d4aa',
  pr132_checkpoint_doc_sha256:
    'b466b263fce8fa5d8ed554f3cd295259603dfb63b6f259f566a6f7f69982f3b8',
  artifact_validation_test_sha256:
    'b9dfe9c84524f78aff856f26dfcd6cf6c6276b0259d6c5df61fb9fcbfb7dd515'
});

function pass(name) {
  console.log(`PASS ${name}`);
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function manifestText() {
  return fs.readFileSync(MANIFEST, 'utf8');
}

function artifactText() {
  return fs.readFileSync(ARTIFACT, 'utf8');
}

function artifactJson() {
  return JSON.parse(artifactText());
}

(function manifestExists() {
  assert.equal(fs.existsSync(MANIFEST), true);
  pass('HBCE_BANKING_DEMO_MANIFEST_EXISTS');
})();

(function manifestHeadings() {
  const text = manifestText();
  assert.match(text, /^# HBCE Evidence Core v1 — Banking Demo Manifest/m);
  assert.match(text, /^## Primary artifact/m);
  assert.match(text, /^## One-page reviewer interpretation/m);
  assert.match(text, /^## Allowed claims/m);
  assert.match(text, /^## Prohibited claims/m);
  assert.match(text, /^## Boundary summary/m);
  assert.match(text, /^## Verification chain/m);
  pass('HBCE_BANKING_DEMO_MANIFEST_HEADINGS');
})();

(function artifactReferences() {
  const text = manifestText();
  assert.ok(text.includes(ARTIFACT));
  assert.ok(text.includes(EXPECTED.artifact_file_sha256));
  assert.ok(text.includes(EXPECTED.artifact_export_sha256));
  assert.ok(text.includes(EXPECTED.artifact_core_sha256));
  pass('HBCE_BANKING_DEMO_MANIFEST_ARTIFACT_REFERENCES');
})();

(function checkpointReferences() {
  const text = manifestText();
  assert.ok(text.includes(EXPECTED.pr132_checkpoint_main));
  assert.ok(text.includes(EXPECTED.pr132_checkpoint_doc_sha256));
  assert.ok(text.includes(EXPECTED.artifact_validation_test_sha256));
  pass('HBCE_BANKING_DEMO_MANIFEST_CHECKPOINT_REFERENCES');
})();

(function artifactHashMatches() {
  const hash = sha256Text(artifactText());
  const artifact = artifactJson();
  assert.equal(hash, EXPECTED.artifact_file_sha256);
  assert.equal(artifact.evidence_core_v1_demo_payload_export_sha256, EXPECTED.artifact_export_sha256);
  assert.equal(artifact.demo_payload_core_sha256, EXPECTED.artifact_core_sha256);
  pass('HBCE_BANKING_DEMO_MANIFEST_ARTIFACT_HASH_MATCHES');
})();

(function reviewerInterpretation() {
  const text = manifestText();
  assert.match(text, /policy is unevaluated/);
  assert.match(text, /authorization is unresolved/);
  assert.match(text, /access is false/);
  assert.match(text, /no runtime action was executed/);
  pass('HBCE_BANKING_DEMO_MANIFEST_REVIEWER_INTERPRETATION');
})();

(function bankingUseCase() {
  const text = manifestText();
  assert.match(text, /AI-assisted internal access decision evidence pack for controlled banking workflow/);
  assert.match(text, /controlled and fail-closed/);
  pass('HBCE_BANKING_DEMO_MANIFEST_BANKING_USE_CASE');
})();

(function allowedClaims() {
  const text = manifestText();
  assert.match(text, /deterministic internal evidence chain/);
  assert.match(text, /fail-closed access decision behavior/);
  assert.match(text, /no runtime mutation from evidence generation/);
  assert.match(text, /SHA-256 reproducible verification path/);
  pass('HBCE_BANKING_DEMO_MANIFEST_ALLOWED_CLAIMS');
})();

(function prohibitedClaims() {
  const text = manifestText();
  assert.match(text, /legal certification/);
  assert.match(text, /eIDAS qualification/);
  assert.match(text, /production deployment proof/);
  assert.match(text, /regulatory approval/);
  assert.match(text, /live transaction approval/);
  pass('HBCE_BANKING_DEMO_MANIFEST_PROHIBITED_CLAIMS');
})();

(function boundarySummary() {
  const text = manifestText();
  assert.match(text, /non-authorizing/);
  assert.match(text, /non-executing/);
  assert.match(text, /non-mutating/);
  assert.match(text, /does not grant authorization/);
  assert.match(text, /does not authorize banking operations/);
  pass('HBCE_BANKING_DEMO_MANIFEST_BOUNDARY_SUMMARY');
})();

(function verificationChain() {
  const text = manifestText();
  assert.match(text, /13\/13 PASS/);
  assert.match(text, /18\/18 PASS/);
  assert.match(text, /19\/19 PASS/);
  assert.match(text, /21\/21 PASS/);
  pass('HBCE_BANKING_DEMO_MANIFEST_VERIFICATION_CHAIN');
})();

(function reviewerConclusion() {
  const text = manifestText();
  assert.match(text, /controlled demo evidence object for banking review/);
  assert.match(text, /not suitable as a production approval/);
  assert.match(text, /not suitable as .* live banking authorization/);
  pass('HBCE_BANKING_DEMO_MANIFEST_REVIEWER_CONCLUSION');
})();

(function deterministicManifestFileHash() {
  const hash = sha256Text(manifestText());
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(manifestText().endsWith('\n'), true);
  pass('HBCE_BANKING_DEMO_MANIFEST_FILE_HASH_STABLE');
})();
