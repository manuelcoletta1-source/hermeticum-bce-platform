'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');

const {
  createHbceEvidenceCoreV1DemoPayloadExport
} = require('../../runtime/product/create-hbce-evidence-core-v1-demo-payload-export');

const ARTIFACT =
  'artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json';

const EXPECTED = Object.freeze({
  demo_payload_export_sha256:
    'a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd',
  demo_payload_core_sha256:
    'a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5',
  product_surface_sha256:
    '36a5809e224908ea11a8eccaf13afc1cc7fd303e506cea5d9191c0c9be5908c2',
  pr131_base_main_commit:
    'af4fb450a50cd2cec564eded19d155fe7d6b4e2a',
  pr130_merge_commit:
    '626c71350bd425f73674486c0a4331fd94be6512',
  total_verified_pass: 543
});

function pass(name) {
  console.log(`PASS ${name}`);
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function readArtifactText() {
  return fs.readFileSync(ARTIFACT, 'utf8');
}

function readArtifact() {
  return JSON.parse(readArtifactText());
}

function runtimePayload() {
  const result = createHbceEvidenceCoreV1DemoPayloadExport();
  assert.equal(result.state, 'EXPORTED');
  return result.evidence_core_v1_demo_payload_export;
}

(function artifactExists() {
  assert.equal(fs.existsSync(ARTIFACT), true);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_EXISTS');
})();

(function artifactIsJson() {
  const parsed = readArtifact();
  assert.equal(typeof parsed, 'object');
  assert.equal(parsed.kind, 'HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT');
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_PARSE');
})();

(function artifactMatchesRuntimePayload() {
  const artifact = readArtifact();
  const payload = runtimePayload();
  assert.deepEqual(artifact, payload);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_MATCHES_RUNTIME');
})();

(function artifactHashes() {
  const artifact = readArtifact();
  assert.equal(
    artifact.evidence_core_v1_demo_payload_export_sha256,
    EXPECTED.demo_payload_export_sha256
  );
  assert.equal(artifact.demo_payload_core_sha256, EXPECTED.demo_payload_core_sha256);
  assert.equal(artifact.product_surface_sha256, EXPECTED.product_surface_sha256);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_HASHES');
})();

(function artifactFileHashIsStable() {
  const fileSha = sha256Text(readArtifactText());
  assert.match(fileSha, /^[a-f0-9]{64}$/);
  assert.equal(readArtifactText().endsWith('\n'), true);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_FILE_HASH_STABLE');
})();

(function baseline() {
  const artifact = readArtifact();
  assert.equal(artifact.baseline.pr131_base_main_commit, EXPECTED.pr131_base_main_commit);
  assert.equal(artifact.baseline.pr130_merge_commit, EXPECTED.pr130_merge_commit);
  assert.equal(artifact.baseline.total_verified_pass, EXPECTED.total_verified_pass);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_BASELINE');
})();

(function decisionSnapshot() {
  const artifact = readArtifact();
  assert.equal(artifact.decision_snapshot.status, 'ACCESS_NOT_GRANTED');
  assert.equal(artifact.decision_snapshot.policy_decision, 'UNEVALUATED');
  assert.equal(artifact.decision_snapshot.authorization_state, 'UNRESOLVED');
  assert.equal(artifact.decision_snapshot.access_granted, false);
  assert.equal(artifact.decision_snapshot.runtime_action_executed, false);
  assert.equal(artifact.decision_snapshot.dispatch_created, false);
  assert.equal(artifact.decision_snapshot.runtime_state_mutated, false);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_DECISION_SNAPSHOT');
})();

(function bankingDemo() {
  const artifact = readArtifact();
  assert.equal(artifact.banking_demo.title, 'AI-assisted internal access decision evidence pack');
  assert.match(artifact.banking_demo.one_minute_explanation, /access decision remained controlled/);
  assert.ok(artifact.banking_demo.success_criteria.includes('reproducible SHA-256 verification path'));
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_BANKING_DEMO');
})();

(function claims() {
  const artifact = readArtifact();
  assert.ok(artifact.claims.allowed.includes('deterministic internal evidence chain'));
  assert.ok(artifact.claims.allowed.includes('audit-oriented package structure'));
  assert.ok(artifact.claims.prohibited.includes('legal certification'));
  assert.ok(artifact.claims.prohibited.includes('eIDAS qualification'));
  assert.ok(artifact.claims.prohibited.includes('live transaction approval'));
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_CLAIMS');
})();

(function apiStatus() {
  const artifact = readArtifact();
  assert.equal(artifact.api_status.api_route_available_in_current_repo, false);
  assert.equal(artifact.api_status.package_json_available, false);
  assert.equal(artifact.api_status.app_pages_src_route_scaffold_available, false);
  assert.match(artifact.api_status.recommendation, /real route scaffold/);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_API_STATUS');
})();

(function boundarySummary() {
  const artifact = readArtifact();
  assert.equal(artifact.boundary_summary.deterministic, true);
  assert.equal(artifact.boundary_summary.read_only, true);
  assert.equal(artifact.boundary_summary.observe_only, true);
  assert.equal(artifact.boundary_summary.fail_closed, true);
  assert.equal(artifact.boundary_summary.grants_authorization, false);
  assert.equal(artifact.boundary_summary.access_granted, false);
  assert.equal(artifact.boundary_summary.executes_runtime_action, false);
  assert.equal(artifact.boundary_summary.creates_dispatch, false);
  assert.equal(artifact.boundary_summary.mutates_runtime_state, false);
  assert.equal(artifact.boundary_summary.regulatory_approval_claimed, false);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_BOUNDARY_SUMMARY');
})();

(function limitations() {
  const artifact = readArtifact();
  assert.ok(artifact.export_limitations.includes('This payload is a product demo payload, not an API route.'));
  assert.ok(artifact.export_limitations.includes('This payload does not create legal certification.'));
  assert.ok(artifact.export_limitations.includes('This payload does not authorize banking operations.'));
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_LIMITATIONS');
})();

(function deterministicSerialization() {
  const artifact = readArtifact();
  const expectedText = `${JSON.stringify(runtimePayload(), null, 2)}\n`;
  assert.equal(readArtifactText(), expectedText);
  assert.deepEqual(artifact, JSON.parse(expectedText));
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_JSON_ARTIFACT_DETERMINISTIC_SERIALIZATION');
})();
