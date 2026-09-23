'use strict';

const assert = require('assert');

const {
  createHbceEvidenceCoreV1ReadableSurface,
  HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_PROTO,
  HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_KIND,
  HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE
} = require('../../runtime/product/create-hbce-evidence-core-v1-readable-surface');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionReviewPackage
} = require('../../runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-review-package');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getBody(result) {
  return result.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package;
}

function pass(name) {
  console.log(`PASS ${name}`);
}

function baseResult() {
  return createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionReviewPackage();
}

function mutatedSource(mutator) {
  const source = clone(baseResult());
  mutator(source, getBody(source));
  return source;
}

(function ready() {
  const result = createHbceEvidenceCoreV1ReadableSurface();
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.READY);
  assert.equal(result.reason, 'HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_READY');
  assert.equal(result.evidence_core_v1_readable_surface.proto, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_PROTO);
  assert.equal(result.evidence_core_v1_readable_surface.kind, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_KIND);
  assert.equal(result.evidence_core_v1_readable_surface.state, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.READY);
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_READY');
})();

(function hashes() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.match(surface.evidence_core_v1_readable_surface_sha256, /^[a-f0-9]{64}$/);
  assert.equal(surface.source_review_package.sha256, '7f1e8bfc3e07e73078aebb497e61ed20c0c75b112567a8cc4eaf89f9b6c98c6d');
  assert.equal(surface.source_review_package.payload_sha256, '892f6605e54366fb9d9196fa03a27527dc1263a7e97fc4d1d2456c2d080059b0');
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_HASHES');
})();

(function baseline() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.equal(surface.product_name, 'HBCE Evidence Core v1');
  assert.equal(surface.baseline.main_commit, '553650dcfb3d0c7c0bd29b220c03907adf5b6b18');
  assert.equal(surface.baseline.chain_pass_total, 377);
  assert.equal(surface.baseline.governance_pass_total, 95);
  assert.equal(surface.baseline.policy_pass_total, 71);
  assert.equal(surface.baseline.total_verified_pass, 543);
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_BASELINE');
})();

(function technicalProofs() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.equal(surface.technical_proofs.final_chain_audit_doc_sha256, '8f4fb0f15f82529255fefdf67f1562d5ee39d2f8294c9847900685d52f29120e');
  assert.equal(surface.technical_proofs.evidence_core_v1_baseline_doc_sha256, 'b518699934f5283dab3a2065834cf91b5d04a28d2257bcff7af432918dfb0c12');
  assert.equal(surface.technical_proofs.product_launch_readiness_doc_sha256, '54d5c32c5e9e6db58d97a2d8d06288d057ae1ca0869145ac91201384f6c99e6d');
  assert.equal(surface.technical_proofs.banking_pilot_readiness_doc_sha256, '2f40d52225795263564f6025d2038173b9955fa6728433cbf6fd5849bb240b0f');
  assert.equal(surface.technical_proofs.pr129_checkpoint_doc_sha256, '60d97bea13fd5e51052afb5ac3b2473325efc62c12aaf52bec7598716281d8ad');
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_TECHNICAL_PROOFS');
})();

(function decisionStatus() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.equal(surface.decision_status.status, 'ACCESS_NOT_GRANTED');
  assert.equal(surface.decision_status.authority_resolution_state, 'VALID');
  assert.equal(surface.decision_status.policy_decision, 'UNEVALUATED');
  assert.equal(surface.decision_status.authorization_state, 'UNRESOLVED');
  assert.equal(surface.decision_status.access_granted, false);
  assert.equal(surface.decision_status.runtime_action_executed, false);
  assert.equal(surface.decision_status.dispatch_created, false);
  assert.equal(surface.decision_status.runtime_state_mutated, false);
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_DECISION_STATUS');
})();

(function productCards() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.equal(surface.product_cards.length, 5);
  assert.deepEqual(surface.product_cards.map((card) => card.card_id), [
    'DECISION_STATUS',
    'AUTHORIZATION_STATE',
    'POLICY_STATE',
    'RUNTIME_EFFECTS',
    'REVIEW_PACKAGE'
  ]);
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_PRODUCT_CARDS');
})();

(function bankingSummary() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.equal(
    surface.banking_pilot_summary.recommended_use_case,
    'AI-assisted internal access decision evidence pack for controlled banking workflow.'
  );
  assert.ok(surface.banking_pilot_summary.pilot_success_criteria.includes('reproducible SHA-256 verification path'));
  assert.ok(surface.banking_pilot_summary.pilot_success_criteria.includes('clear non-authorization and non-execution statement'));
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_BANKING_SUMMARY');
})();

(function allowedClaims() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.ok(surface.allowed_claims.includes('deterministic internal evidence chain'));
  assert.ok(surface.allowed_claims.includes('fail-closed access decision behavior'));
  assert.ok(surface.allowed_claims.includes('audit-oriented package structure'));
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_ALLOWED_CLAIMS');
})();

(function prohibitedClaims() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.ok(surface.prohibited_claims.includes('legal certification'));
  assert.ok(surface.prohibited_claims.includes('eIDAS qualification'));
  assert.ok(surface.prohibited_claims.includes('live transaction approval'));
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_PROHIBITED_CLAIMS');
})();

(function apiDiscovery() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.equal(surface.api_route_discovery.api_route_available_in_current_repo, false);
  assert.equal(surface.api_route_discovery.package_json_available, false);
  assert.equal(surface.api_route_discovery.app_pages_src_route_scaffold_available, false);
  assert.match(surface.api_route_discovery.reason, /no package\.json, app, pages or src/);
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_API_DISCOVERY');
})();

(function boundaryAssertions() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.equal(surface.boundary_assertions.deterministic, true);
  assert.equal(surface.boundary_assertions.read_only, true);
  assert.equal(surface.boundary_assertions.observe_only, true);
  assert.equal(surface.boundary_assertions.fail_closed, true);
  assert.equal(surface.boundary_assertions.grants_authorization, false);
  assert.equal(surface.boundary_assertions.access_granted, false);
  assert.equal(surface.boundary_assertions.executes_runtime_action, false);
  assert.equal(surface.boundary_assertions.creates_dispatch, false);
  assert.equal(surface.boundary_assertions.mutates_runtime_state, false);
  assert.equal(surface.boundary_assertions.legal_certification_created, false);
  assert.equal(surface.boundary_assertions.eidas_qualification_created, false);
  assert.equal(surface.boundary_assertions.production_deployment_proven, false);
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_BOUNDARY_ASSERTIONS');
})();

(function nonAuthorization() {
  const surface = createHbceEvidenceCoreV1ReadableSurface().evidence_core_v1_readable_surface;
  assert.equal(surface.boundary_assertions.grants_authorization, false);
  assert.equal(surface.boundary_assertions.creates_authorization_artifact, false);
  assert.equal(surface.decision_status.access_granted, false);
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_NON_AUTHORIZATION');
})();

(function deterministic() {
  const first = createHbceEvidenceCoreV1ReadableSurface();
  const second = createHbceEvidenceCoreV1ReadableSurface();
  assert.deepEqual(first, second);
  assert.equal(
    first.evidence_core_v1_readable_surface.evidence_core_v1_readable_surface_sha256,
    second.evidence_core_v1_readable_surface.evidence_core_v1_readable_surface_sha256
  );
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_DETERMINISTIC');
})();

(function frozen() {
  const result = createHbceEvidenceCoreV1ReadableSurface();
  const surface = result.evidence_core_v1_readable_surface;
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(surface), true);
  assert.equal(Object.isFrozen(surface.decision_status), true);
  assert.equal(Object.isFrozen(surface.boundary_assertions), true);
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_FROZEN');
})();

(function invalidDate() {
  const result = createHbceEvidenceCoreV1ReadableSurface({ generated_at: 'not-a-date' });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.BLOCKED);
  assert.equal(result.reason, 'GENERATED_AT_INVALID');
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_INVALID_DATE');
})();

(function sourceBlocked() {
  const result = createHbceEvidenceCoreV1ReadableSurface({
    source_review_package_result: {
      state: 'BLOCKED',
      reason: 'TEST_BLOCKED'
    }
  });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.BLOCKED);
  assert.equal(result.reason, 'SOURCE_REVIEW_PACKAGE_BLOCKED');
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_SOURCE_BLOCKED');
})();

(function sourceHashMismatch() {
  const source = mutatedSource((_, body) => {
    body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package_sha256 =
      '0000000000000000000000000000000000000000000000000000000000000000';
  });

  const result = createHbceEvidenceCoreV1ReadableSurface({ source_review_package_result: source });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.BLOCKED);
  assert.equal(result.reason, 'SOURCE_REVIEW_PACKAGE_HASH_MISMATCH');
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_SOURCE_HASH_MISMATCH');
})();

(function sourcePayloadHashMismatch() {
  const source = mutatedSource((_, body) => {
    body.review_package_payload_sha256 =
      '0000000000000000000000000000000000000000000000000000000000000000';
  });

  const result = createHbceEvidenceCoreV1ReadableSurface({ source_review_package_result: source });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.BLOCKED);
  assert.equal(result.reason, 'SOURCE_REVIEW_PACKAGE_PAYLOAD_HASH_MISMATCH');
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_SOURCE_PAYLOAD_HASH_MISMATCH');
})();

(function sourceBoundaryInvalid() {
  const source = mutatedSource((_, body) => {
    body.access_granted = true;
  });

  const result = createHbceEvidenceCoreV1ReadableSurface({ source_review_package_result: source });
  assert.equal(result.state, HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.BLOCKED);
  assert.equal(result.reason, 'SOURCE_REVIEW_PACKAGE_BOUNDARY_INVALID');
  pass('HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_SOURCE_BOUNDARY_INVALID');
})();
