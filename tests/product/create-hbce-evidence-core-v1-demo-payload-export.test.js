'use strict';

const assert = require('assert');

const {
  createHbceEvidenceCoreV1DemoPayloadExport,
  HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_PROTO,
  HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_KIND,
  HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE
} = require('../../runtime/product/create-hbce-evidence-core-v1-demo-payload-export');

const {
  createHbceEvidenceCoreV1ReadableSurface
} = require('../../runtime/product/create-hbce-evidence-core-v1-readable-surface');

function pass(name) {
  console.log(`PASS ${name}`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function surfaceBody(result) {
  return result.evidence_core_v1_readable_surface;
}

function mutatedSurface(mutator) {
  const source = clone(createHbceEvidenceCoreV1ReadableSurface());
  mutator(source, surfaceBody(source));
  return source;
}

(function exported() {
  const result = createHbceEvidenceCoreV1DemoPayloadExport();
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.EXPORTED);
  assert.equal(result.reason, 'HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_EXPORTED');
  assert.equal(result.evidence_core_v1_demo_payload_export.proto, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_PROTO);
  assert.equal(result.evidence_core_v1_demo_payload_export.kind, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_KIND);
  assert.equal(result.evidence_core_v1_demo_payload_export.state, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.EXPORTED);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_EXPORTED');
})();

(function hashes() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.match(payload.evidence_core_v1_demo_payload_export_sha256, /^[a-f0-9]{64}$/);
  assert.match(payload.demo_payload_core_sha256, /^[a-f0-9]{64}$/);
  assert.equal(payload.product_surface_sha256, '36a5809e224908ea11a8eccaf13afc1cc7fd303e506cea5d9191c0c9be5908c2');
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_HASHES');
})();

(function baseline() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.equal(payload.baseline.pr131_base_main_commit, 'af4fb450a50cd2cec564eded19d155fe7d6b4e2a');
  assert.equal(payload.baseline.pr130_merge_commit, '626c71350bd425f73674486c0a4331fd94be6512');
  assert.equal(payload.baseline.pr130_checkpoint_commit, 'af4fb450a50cd2cec564eded19d155fe7d6b4e2a');
  assert.equal(payload.baseline.total_verified_pass, 543);
  assert.equal(payload.baseline.readable_surface_test_pass, 19);
  assert.equal(payload.baseline.source_review_package_test_pass, 21);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_BASELINE');
})();

(function proofHashes() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.equal(payload.proof_hashes.readable_surface_sha256, '36a5809e224908ea11a8eccaf13afc1cc7fd303e506cea5d9191c0c9be5908c2');
  assert.equal(payload.proof_hashes.readable_surface_runtime_sha256, '59b4577024341ad4227ccfe42ba626fa2ae4edd7070835ec37a2b6daa68be37b');
  assert.equal(payload.proof_hashes.readable_surface_test_sha256, '1c0bbfa9b438df2dc5f7d08d939c43a17fb21fa39412d1db958109d013a78771');
  assert.equal(payload.proof_hashes.pr130_checkpoint_doc_sha256, '5717fbc87d1f959412df0e56d579cb0ff7a49dcaead6e32ef548da75f8b6f8de');
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_PROOF_HASHES');
})();

(function demoCards() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.equal(payload.demo_cards.length, 5);
  assert.deepEqual(payload.demo_cards.map((card) => card.id), [
    'DECISION',
    'AUTHORIZATION',
    'POLICY',
    'RUNTIME',
    'REVIEW_PACKAGE'
  ]);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_DEMO_CARDS');
})();

(function bankingDemo() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.equal(payload.banking_demo.title, 'AI-assisted internal access decision evidence pack');
  assert.match(payload.banking_demo.one_minute_explanation, /access decision remained controlled/);
  assert.ok(payload.banking_demo.success_criteria.includes('reproducible SHA-256 verification path'));
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_BANKING_DEMO');
})();

(function decisionSnapshot() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.equal(payload.decision_snapshot.status, 'ACCESS_NOT_GRANTED');
  assert.equal(payload.decision_snapshot.authority_resolution_state, 'VALID');
  assert.equal(payload.decision_snapshot.policy_decision, 'UNEVALUATED');
  assert.equal(payload.decision_snapshot.authorization_state, 'UNRESOLVED');
  assert.equal(payload.decision_snapshot.access_granted, false);
  assert.equal(payload.decision_snapshot.runtime_action_executed, false);
  assert.equal(payload.decision_snapshot.dispatch_created, false);
  assert.equal(payload.decision_snapshot.runtime_state_mutated, false);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_DECISION_SNAPSHOT');
})();

(function claims() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.ok(payload.claims.allowed.includes('deterministic internal evidence chain'));
  assert.ok(payload.claims.allowed.includes('audit-oriented package structure'));
  assert.ok(payload.claims.prohibited.includes('legal certification'));
  assert.ok(payload.claims.prohibited.includes('eIDAS qualification'));
  assert.ok(payload.claims.prohibited.includes('live transaction approval'));
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_CLAIMS');
})();

(function apiStatus() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.equal(payload.api_status.api_route_available_in_current_repo, false);
  assert.equal(payload.api_status.package_json_available, false);
  assert.equal(payload.api_status.app_pages_src_route_scaffold_available, false);
  assert.match(payload.api_status.recommendation, /real route scaffold/);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_API_STATUS');
})();

(function boundarySummary() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.equal(payload.boundary_summary.deterministic, true);
  assert.equal(payload.boundary_summary.read_only, true);
  assert.equal(payload.boundary_summary.observe_only, true);
  assert.equal(payload.boundary_summary.fail_closed, true);
  assert.equal(payload.boundary_summary.grants_authorization, false);
  assert.equal(payload.boundary_summary.access_granted, false);
  assert.equal(payload.boundary_summary.executes_runtime_action, false);
  assert.equal(payload.boundary_summary.creates_dispatch, false);
  assert.equal(payload.boundary_summary.mutates_runtime_state, false);
  assert.equal(payload.boundary_summary.legal_certification_created, false);
  assert.equal(payload.boundary_summary.eidas_qualification_created, false);
  assert.equal(payload.boundary_summary.production_deployment_proven, false);
  assert.equal(payload.boundary_summary.regulatory_approval_claimed, false);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_BOUNDARY_SUMMARY');
})();

(function exportLimitations() {
  const payload = createHbceEvidenceCoreV1DemoPayloadExport().evidence_core_v1_demo_payload_export;
  assert.ok(payload.export_limitations.includes('This payload is a product demo payload, not an API route.'));
  assert.ok(payload.export_limitations.includes('This payload does not create legal certification.'));
  assert.ok(payload.export_limitations.includes('This payload does not authorize banking operations.'));
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_LIMITATIONS');
})();

(function deterministic() {
  const first = createHbceEvidenceCoreV1DemoPayloadExport();
  const second = createHbceEvidenceCoreV1DemoPayloadExport();
  assert.deepEqual(first, second);
  assert.equal(
    first.evidence_core_v1_demo_payload_export.evidence_core_v1_demo_payload_export_sha256,
    second.evidence_core_v1_demo_payload_export.evidence_core_v1_demo_payload_export_sha256
  );
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_DETERMINISTIC');
})();

(function frozen() {
  const result = createHbceEvidenceCoreV1DemoPayloadExport();
  const payload = result.evidence_core_v1_demo_payload_export;
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(payload), true);
  assert.equal(Object.isFrozen(payload.banking_demo), true);
  assert.equal(Object.isFrozen(payload.boundary_summary), true);
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_FROZEN');
})();

(function invalidDate() {
  const result = createHbceEvidenceCoreV1DemoPayloadExport({ generated_at: 'bad-date' });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.BLOCKED);
  assert.equal(result.reason, 'GENERATED_AT_INVALID');
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_INVALID_DATE');
})();

(function sourceBlocked() {
  const result = createHbceEvidenceCoreV1DemoPayloadExport({
    source_readable_surface_result: {
      state: 'BLOCKED',
      reason: 'TEST_BLOCKED'
    }
  });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.BLOCKED);
  assert.equal(result.reason, 'SOURCE_READABLE_SURFACE_BLOCKED');
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_SOURCE_BLOCKED');
})();

(function sourceMissing() {
  const result = createHbceEvidenceCoreV1DemoPayloadExport({
    source_readable_surface_result: {
      state: 'READY'
    }
  });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.BLOCKED);
  assert.equal(result.reason, 'SOURCE_READABLE_SURFACE_MISSING');
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_SOURCE_MISSING');
})();

(function sourceHashMismatch() {
  const source = mutatedSurface((_, surface) => {
    surface.evidence_core_v1_readable_surface_sha256 =
      '0000000000000000000000000000000000000000000000000000000000000000';
  });

  const result = createHbceEvidenceCoreV1DemoPayloadExport({ source_readable_surface_result: source });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.BLOCKED);
  assert.equal(result.reason, 'SOURCE_READABLE_SURFACE_HASH_MISMATCH');
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_SOURCE_HASH_MISMATCH');
})();

(function sourceBoundaryInvalid() {
  const source = mutatedSurface((_, surface) => {
    surface.boundary_assertions.access_granted = true;
  });

  const result = createHbceEvidenceCoreV1DemoPayloadExport({ source_readable_surface_result: source });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.BLOCKED);
  assert.equal(result.reason, 'SOURCE_READABLE_SURFACE_BOUNDARY_INVALID');
  pass('HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_SOURCE_BOUNDARY_INVALID');
})();
