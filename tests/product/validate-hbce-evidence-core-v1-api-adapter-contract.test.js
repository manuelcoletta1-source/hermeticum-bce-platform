'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');

const CONTRACT =
  'artifacts/product/hbce-evidence-core-v1-api-adapter-contract-2026-09-24.md';

const MANIFEST =
  'artifacts/product/hbce-evidence-core-v1-banking-demo-manifest-2026-09-24.md';

const ARTIFACT =
  'artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json';

const EXPECTED = Object.freeze({
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
  pr133_checkpoint_main:
    '6945912d22fc91c2fa6c78425c3d1d8ed942497e',
  pr133_checkpoint_doc_sha256:
    '451cf28174d7fe58ad0965d112cfad2b63a6dc116c5c0d1f80ada1a46ac4b442'
});

function pass(name) {
  console.log(`PASS ${name}`);
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function text(path) {
  return fs.readFileSync(path, 'utf8');
}

function contractText() {
  return text(CONTRACT);
}

function artifactJson() {
  return JSON.parse(text(ARTIFACT));
}

(function contractExists() {
  assert.equal(fs.existsSync(CONTRACT), true);
  pass('HBCE_API_ADAPTER_CONTRACT_EXISTS');
})();

(function contractHeadings() {
  const doc = contractText();
  assert.match(doc, /^# HBCE Evidence Core v1 — API Adapter Contract/m);
  assert.match(doc, /^## Current repository constraint/m);
  assert.match(doc, /^## Proposed endpoint/m);
  assert.match(doc, /^## Request contract/m);
  assert.match(doc, /^## Successful response contract/m);
  assert.match(doc, /^## Error response contract/m);
  assert.match(doc, /^## Adapter responsibilities/m);
  assert.match(doc, /^## Adapter non-responsibilities/m);
  assert.match(doc, /^## Verification chain/m);
  assert.match(doc, /^## Integration gate/m);
  pass('HBCE_API_ADAPTER_CONTRACT_HEADINGS');
})();

(function repositoryConstraint() {
  const doc = contractText();
  assert.match(doc, /This is a contract only/);
  assert.match(doc, /not an implemented API route/);
  assert.match(doc, /no committed `package\.json`/);
  assert.match(doc, /no `app` route tree/);
  assert.match(doc, /no `pages` route tree/);
  assert.match(doc, /no `src` route tree/);
  assert.match(doc, /must not be interpreted as proof that a live API route exists/);
  pass('HBCE_API_ADAPTER_CONTRACT_REPOSITORY_CONSTRAINT');
})();

(function sourceReferences() {
  const doc = contractText();
  assert.ok(doc.includes(ARTIFACT));
  assert.ok(doc.includes(MANIFEST));
  assert.ok(doc.includes(EXPECTED.artifact_file_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_export_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_core_sha256));
  assert.ok(doc.includes(EXPECTED.manifest_sha256));
  pass('HBCE_API_ADAPTER_CONTRACT_SOURCE_REFERENCES');
})();

(function checkpointReferences() {
  const doc = contractText();
  assert.ok(doc.includes(EXPECTED.pr133_checkpoint_main));
  assert.ok(doc.includes(EXPECTED.pr133_checkpoint_doc_sha256));
  assert.ok(doc.includes(EXPECTED.manifest_test_sha256));
  assert.ok(doc.includes(EXPECTED.artifact_test_sha256));
  pass('HBCE_API_ADAPTER_CONTRACT_CHECKPOINT_REFERENCES');
})();

(function proposedEndpoint() {
  const doc = contractText();
  assert.match(doc, /GET \/api\/hbce\/evidence-core\/v1\/demo-payload/);
  assert.match(doc, /reserved for future implementation/);
  assert.match(doc, /real application route scaffold/);
  pass('HBCE_API_ADAPTER_CONTRACT_PROPOSED_ENDPOINT');
})();

(function requestContract() {
  const doc = contractText();
  assert.match(doc, /Method:\n\n`GET`/);
  assert.match(doc, /expected_artifact_file_sha256=/);
  assert.match(doc, /never accept a request that attempts to mutate runtime state/);
  assert.match(doc, /never accept a request that asks for authorization execution/);
  assert.match(doc, /never accept a request that asks for dispatch creation/);
  assert.match(doc, /never accept a request that asks for live banking operation approval/);
  pass('HBCE_API_ADAPTER_CONTRACT_REQUEST');
})();

(function successfulResponseContract() {
  const doc = contractText();
  assert.match(doc, /`200 OK`/);
  assert.match(doc, /`application\/json`/);
  assert.match(doc, /"status": "EXPORTED"/);
  assert.match(doc, /"kind": "HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT"/);
  assert.match(doc, /"grants_authorization": false/);
  assert.match(doc, /"executes_runtime_action": false/);
  assert.match(doc, /"authorizes_banking_operations": false/);
  pass('HBCE_API_ADAPTER_CONTRACT_SUCCESS_RESPONSE');
})();

(function errorContract() {
  const doc = contractText();
  assert.match(doc, /405 METHOD_NOT_ALLOWED/);
  assert.match(doc, /404 ARTIFACT_NOT_FOUND/);
  assert.match(doc, /409 ARTIFACT_HASH_MISMATCH/);
  assert.match(doc, /412 EXPECTED_HASH_MISMATCH/);
  assert.match(doc, /412 SOURCE_VERIFICATION_FAILED/);
  assert.match(doc, /500 ADAPTER_INTERNAL_ERROR_FAIL_CLOSED/);
  assert.match(doc, /access_granted=false/);
  pass('HBCE_API_ADAPTER_CONTRACT_ERRORS');
})();

(function adapterResponsibilities() {
  const doc = contractText();
  assert.match(doc, /load the committed JSON artifact/);
  assert.match(doc, /verify the JSON artifact file SHA-256/);
  assert.match(doc, /verify the demo payload export SHA-256/);
  assert.match(doc, /preserve read-only behavior/);
  assert.match(doc, /preserve fail-closed behavior/);
  assert.match(doc, /preserve non-authorizing behavior/);
  pass('HBCE_API_ADAPTER_CONTRACT_RESPONSIBILITIES');
})();

(function adapterNonResponsibilities() {
  const doc = contractText();
  assert.match(doc, /must not:\n\n- grant authorization/);
  assert.match(doc, /create authorization artifacts/);
  assert.match(doc, /execute runtime actions/);
  assert.match(doc, /create dispatch/);
  assert.match(doc, /mutate runtime state/);
  assert.match(doc, /create eIDAS qualification/);
  assert.match(doc, /authorize banking operations/);
  assert.match(doc, /approve live financial transactions/);
  pass('HBCE_API_ADAPTER_CONTRACT_NON_RESPONSIBILITIES');
})();

(function verificationChain() {
  const doc = contractText();
  assert.match(doc, /15\/15 PASS/);
  assert.match(doc, /13\/13 PASS/);
  assert.match(doc, /18\/18 PASS/);
  assert.match(doc, /19\/19 PASS/);
  assert.match(doc, /21\/21 PASS/);
  pass('HBCE_API_ADAPTER_CONTRACT_VERIFICATION_CHAIN');
})();

(function artifactHashMatches() {
  const artifactText = text(ARTIFACT);
  const artifact = artifactJson();
  assert.equal(sha256Text(artifactText), EXPECTED.artifact_file_sha256);
  assert.equal(artifact.evidence_core_v1_demo_payload_export_sha256, EXPECTED.artifact_export_sha256);
  assert.equal(artifact.demo_payload_core_sha256, EXPECTED.artifact_core_sha256);
  pass('HBCE_API_ADAPTER_CONTRACT_ARTIFACT_HASH_MATCHES');
})();

(function manifestHashMatches() {
  assert.equal(sha256Text(text(MANIFEST)), EXPECTED.manifest_sha256);
  pass('HBCE_API_ADAPTER_CONTRACT_MANIFEST_HASH_MATCHES');
})();

(function deterministicContractFileHash() {
  const hash = sha256Text(contractText());
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(contractText().endsWith('\n'), true);
  pass('HBCE_API_ADAPTER_CONTRACT_FILE_HASH_STABLE');
})();
