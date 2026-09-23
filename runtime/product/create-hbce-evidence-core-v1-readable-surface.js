'use strict';

const crypto = require('crypto');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionReviewPackage
} = require('../external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-review-package');

const HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_PROTO =
  'hbce.product.evidence_core_v1.readable_surface.v1';

const HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_KIND =
  'HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE';

const HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T22:10:00.000Z';

const EXPECTED = Object.freeze({
  evidence_core_v1_main_commit: '553650dcfb3d0c7c0bd29b220c03907adf5b6b18',
  pr129_merge_commit: '235948e82d692c0879e5a9ca0c519aca05c3ab50',
  pr129_checkpoint_commit: '553650dcfb3d0c7c0bd29b220c03907adf5b6b18',
  pr128_review_package_sha256: '7f1e8bfc3e07e73078aebb497e61ed20c0c75b112567a8cc4eaf89f9b6c98c6d',
  pr128_review_package_payload_sha256: '892f6605e54366fb9d9196fa03a27527dc1263a7e97fc4d1d2456c2d080059b0',
  final_chain_audit_doc_sha256: '8f4fb0f15f82529255fefdf67f1562d5ee39d2f8294c9847900685d52f29120e',
  evidence_core_v1_baseline_doc_sha256: 'b518699934f5283dab3a2065834cf91b5d04a28d2257bcff7af432918dfb0c12',
  product_launch_readiness_doc_sha256: '54d5c32c5e9e6db58d97a2d8d06288d057ae1ca0869145ac91201384f6c99e6d',
  banking_pilot_readiness_doc_sha256: '2f40d52225795263564f6025d2038173b9955fa6728433cbf6fd5849bb240b0f',
  pr129_checkpoint_doc_sha256: '60d97bea13fd5e51052afb5ac3b2473325efc62c12aaf52bec7598716281d8ad',
  chain_pass_total: 377,
  governance_pass_total: 95,
  policy_pass_total: 71,
  total_verified_pass: 543
});

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function deepFreeze(value) {
  if (Array.isArray(value)) {
    value.forEach(deepFreeze);
    return Object.freeze(value);
  }

  if (isPlainObject(value)) {
    Object.keys(value).forEach((key) => deepFreeze(value[key]));
    return Object.freeze(value);
  }

  return value;
}

function canonicalize(value) {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    if (/[\uD800-\uDFFF]/u.test(value)) {
      throw new TypeError('UNSUPPORTED_CANONICAL_VALUE');
    }

    return JSON.stringify(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || Object.is(value, -0)) {
      throw new TypeError('UNSUPPORTED_CANONICAL_VALUE');
    }

    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    if (Object.keys(value).length !== value.length) {
      throw new TypeError('UNSUPPORTED_CANONICAL_VALUE');
    }

    return `[${value.map(canonicalize).join(',')}]`;
  }

  if (isPlainObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => {
        const item = value[key];

        if (typeof item === 'undefined' || typeof item === 'function' || typeof item === 'symbol') {
          throw new TypeError('UNSUPPORTED_CANONICAL_VALUE');
        }

        return `${JSON.stringify(key)}:${canonicalize(item)}`;
      })
      .join(',')}}`;
  }

  throw new TypeError('UNSUPPORTED_CANONICAL_VALUE');
}

function sha256Canonical(value) {
  return crypto.createHash('sha256').update(canonicalize(value)).digest('hex');
}

function isIsoDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;
}

function stringOr(value, fallback) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function booleanFalse(value) {
  return value === false;
}

function blocked(reason) {
  return deepFreeze({
    state: HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.BLOCKED,
    reason,
    evidence_core_v1_readable_surface: null
  });
}

function getSourceReviewPackage(context) {
  if (
    isPlainObject(context) &&
    isPlainObject(context.source_review_package_result)
  ) {
    return context.source_review_package_result;
  }

  return createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionReviewPackage();
}

function sourceBodyFrom(result) {
  if (!isPlainObject(result)) {
    return null;
  }

  return result.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package || null;
}

function sourceIsSafe(body) {
  return (
    body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package_sha256 ===
      EXPECTED.pr128_review_package_sha256 &&
    body.review_package_payload_sha256 === EXPECTED.pr128_review_package_payload_sha256 &&
    booleanFalse(body.access_granted) &&
    booleanFalse(body.grants_authorization) &&
    booleanFalse(body.creates_authorization_artifact) &&
    booleanFalse(body.executes_runtime_action) &&
    booleanFalse(body.creates_dispatch) &&
    booleanFalse(body.mutates_runtime_state) &&
    booleanFalse(body.runtime_audit_log_mutated) &&
    booleanFalse(body.external_audit_log_mutated) &&
    booleanFalse(body.public_registry_mutated) &&
    booleanFalse(body.external_trust_registry_mutated) &&
    booleanFalse(body.external_review_execution_created) &&
    booleanFalse(body.external_review_opinion_created) &&
    booleanFalse(body.external_review_report_created) &&
    booleanFalse(body.external_review_submission_created) &&
    booleanFalse(body.external_review_publication_created) &&
    booleanFalse(body.legal_certification_created) &&
    booleanFalse(body.eidas_qualification_created) &&
    booleanFalse(body.opc_allow_created) &&
    booleanFalse(body.deployment_success_proven) &&
    booleanFalse(body.production_deployment_proven)
  );
}

function buildReadableSurface(body, generatedAt) {
  const readableBody = {
    proto: HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_PROTO,
    kind: HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_KIND,
    version: '1.0',
    generated_at: generatedAt,
    evidence_core_v1_surface_id: 'HBCE-EVIDENCE-CORE-V1-READABLE-SURFACE-2026-09-23',
    state: HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.READY,

    product_surface_scope: 'INTERNAL_PRODUCT_READABLE_SURFACE_ONLY',
    product_phase: 'LAUNCH_BASELINE_PRODUCTIZATION',
    product_name: 'HBCE Evidence Core v1',
    product_role: 'READABLE_EVIDENCE_SURFACE',
    intended_consumers: [
      'INTERNAL_PRODUCT_TEAM',
      'BANKING_PILOT_REVIEWER',
      'AUDIT_READER',
      'TECHNICAL_REVIEWER'
    ],

    baseline: {
      main_commit: EXPECTED.evidence_core_v1_main_commit,
      pr129_merge_commit: EXPECTED.pr129_merge_commit,
      pr129_checkpoint_commit: EXPECTED.pr129_checkpoint_commit,
      chain_pass_total: EXPECTED.chain_pass_total,
      governance_pass_total: EXPECTED.governance_pass_total,
      policy_pass_total: EXPECTED.policy_pass_total,
      total_verified_pass: EXPECTED.total_verified_pass
    },

    source_review_package: {
      ref:
        'runtime/external-review/create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-access-decision-review-package.js',
      sha256:
        body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package_sha256,
      payload_sha256: body.review_package_payload_sha256,
      state: stringOr(body.state, 'READY'),
      ready: body.review_package_ready === true
    },

    technical_proofs: {
      final_chain_audit_doc:
        'MAIN_POST_HBCE_EVIDENCE_PACK_PR104_PR128_FINAL_CHAIN_AUDIT_2026_09_23.md',
      final_chain_audit_doc_sha256: EXPECTED.final_chain_audit_doc_sha256,
      evidence_core_v1_baseline_doc:
        'HBCE_EVIDENCE_CORE_V1_LAUNCH_BASELINE_2026_09_23.md',
      evidence_core_v1_baseline_doc_sha256: EXPECTED.evidence_core_v1_baseline_doc_sha256,
      product_launch_readiness_doc:
        'HBCE_PRODUCT_LAUNCH_READINESS_MATRIX_2026_09_23.md',
      product_launch_readiness_doc_sha256: EXPECTED.product_launch_readiness_doc_sha256,
      banking_pilot_readiness_doc:
        'HBCE_BANKING_PILOT_READINESS_BASELINE_2026_09_23.md',
      banking_pilot_readiness_doc_sha256: EXPECTED.banking_pilot_readiness_doc_sha256,
      pr129_checkpoint_doc:
        'MAIN_POST_HBCE_EVIDENCE_CORE_V1_LAUNCH_BASELINE_CHECKPOINT_2026_09_23.md',
      pr129_checkpoint_doc_sha256: EXPECTED.pr129_checkpoint_doc_sha256
    },

    decision_status: {
      status: 'ACCESS_NOT_GRANTED',
      authority_resolution_state: stringOr(body.authority_resolution_state, 'VALID'),
      policy_decision: stringOr(body.policy_decision, 'UNEVALUATED'),
      authorization_state: stringOr(body.authorization_state, 'UNRESOLVED'),
      access_granted: false,
      runtime_action_executed: false,
      dispatch_created: false,
      runtime_state_mutated: false,
      human_readable_summary:
        'HBCE Evidence Core v1 shows an unresolved/non-authorizing access decision: policy is not evaluated, authorization is unresolved and access remains false.'
    },

    product_cards: [
      {
        card_id: 'DECISION_STATUS',
        title: 'Decision status',
        readable_value: 'Access not granted',
        machine_value: 'ACCESS_NOT_GRANTED'
      },
      {
        card_id: 'AUTHORIZATION_STATE',
        title: 'Authorization state',
        readable_value: 'Unresolved',
        machine_value: 'UNRESOLVED'
      },
      {
        card_id: 'POLICY_STATE',
        title: 'Policy state',
        readable_value: 'Unevaluated',
        machine_value: 'UNEVALUATED'
      },
      {
        card_id: 'RUNTIME_EFFECTS',
        title: 'Runtime effects',
        readable_value: 'No dispatch, no execution and no mutation',
        machine_value: 'NO_RUNTIME_EFFECTS'
      },
      {
        card_id: 'REVIEW_PACKAGE',
        title: 'Review package',
        readable_value: 'Internal observe-only review package available',
        machine_value: 'INTERNAL_OBSERVE_ONLY_REVIEW_PACKAGE'
      }
    ],

    banking_pilot_summary: {
      recommended_use_case:
        'AI-assisted internal access decision evidence pack for controlled banking workflow.',
      reader_summary:
        'A banking reviewer can inspect whether authority, policy, authorization, access, dispatch and mutation remained controlled and fail-closed.',
      pilot_success_criteria: [
        'controlled access decision flow',
        'denied or unresolved case',
        'evidence package reference',
        'audit proof reference',
        'review package reference',
        'human-readable audit summary',
        'reproducible SHA-256 verification path',
        'clear non-authorization and non-execution statement'
      ]
    },

    allowed_claims: [
      'deterministic internal evidence chain',
      'fail-closed access decision behavior',
      'observe-only review package generation',
      'non-authorizing positive ALLOW probe handling',
      'no dispatch without authorization',
      'no runtime mutation from evidence generation',
      'audit-oriented package structure'
    ],

    prohibited_claims: [
      'legal certification',
      'eIDAS qualification',
      'production deployment proof',
      'external review completion',
      'regulatory approval',
      'OPC ALLOW creation',
      'autonomous banking authorization',
      'live transaction approval'
    ],

    api_route_discovery: {
      api_route_available_in_current_repo: false,
      package_json_available: false,
      app_pages_src_route_scaffold_available: false,
      reason:
        'Discovery found no package.json, app, pages or src product route scaffold in this repository.',
      next_adapter_recommendation:
        'Expose this readable surface through an HTTP/API adapter only after selecting a repository or package with a real route scaffold.'
    },

    boundary_assertions: {
      deterministic: true,
      read_only: true,
      observe_only: true,
      fail_closed: true,
      grants_authorization: false,
      creates_authorization_artifact: false,
      access_granted: false,
      executes_runtime_action: false,
      creates_dispatch: false,
      mutates_runtime_state: false,
      runtime_audit_log_mutated: false,
      external_audit_log_mutated: false,
      public_registry_mutated: false,
      external_trust_registry_mutated: false,
      external_review_execution_created: false,
      external_review_opinion_created: false,
      external_review_report_created: false,
      external_review_submission_created: false,
      external_review_publication_created: false,
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false,
      deployment_success_proven: false,
      production_deployment_proven: false
    }
  };

  readableBody.evidence_core_v1_readable_surface_sha256 = sha256Canonical(readableBody);

  return readableBody;
}

function createHbceEvidenceCoreV1ReadableSurface(context = {}) {
  if (!isPlainObject(context)) {
    return blocked('CONTEXT_INVALID');
  }

  const generatedAt = stringOr(context.generated_at, DEFAULT_GENERATED_AT);

  if (!isIsoDate(generatedAt)) {
    return blocked('GENERATED_AT_INVALID');
  }

  const source = getSourceReviewPackage(context);

  if (!isPlainObject(source) || source.state !== 'READY') {
    return blocked('SOURCE_REVIEW_PACKAGE_BLOCKED');
  }

  const body = sourceBodyFrom(source);

  if (!isPlainObject(body)) {
    return blocked('SOURCE_REVIEW_PACKAGE_MISSING');
  }

  if (
    body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_review_package_sha256 !==
    EXPECTED.pr128_review_package_sha256
  ) {
    return blocked('SOURCE_REVIEW_PACKAGE_HASH_MISMATCH');
  }

  if (body.review_package_payload_sha256 !== EXPECTED.pr128_review_package_payload_sha256) {
    return blocked('SOURCE_REVIEW_PACKAGE_PAYLOAD_HASH_MISMATCH');
  }

  if (!sourceIsSafe(body)) {
    return blocked('SOURCE_REVIEW_PACKAGE_BOUNDARY_INVALID');
  }

  return deepFreeze({
    state: HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE.READY,
    reason: 'HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_READY',
    evidence_core_v1_readable_surface: buildReadableSurface(body, generatedAt)
  });
}

module.exports = {
  createHbceEvidenceCoreV1ReadableSurface,
  HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_PROTO,
  HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_KIND,
  HBCE_EVIDENCE_CORE_V1_READABLE_SURFACE_STATE
};
