'use strict';

const crypto = require('crypto');

const {
  createHbceEvidenceCoreV1ReadableSurface
} = require('./create-hbce-evidence-core-v1-readable-surface');

const HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_PROTO =
  'hbce.product.evidence_core_v1.demo_payload_export.v1';

const HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_KIND =
  'HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT';

const HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE = Object.freeze({
  EXPORTED: 'EXPORTED',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T22:40:00.000Z';

const EXPECTED = Object.freeze({
  pr131_base_main_commit: 'af4fb450a50cd2cec564eded19d155fe7d6b4e2a',
  pr130_merge_commit: '626c71350bd425f73674486c0a4331fd94be6512',
  pr130_checkpoint_commit: 'af4fb450a50cd2cec564eded19d155fe7d6b4e2a',
  readable_surface_sha256: '36a5809e224908ea11a8eccaf13afc1cc7fd303e506cea5d9191c0c9be5908c2',
  readable_surface_runtime_sha256: '59b4577024341ad4227ccfe42ba626fa2ae4edd7070835ec37a2b6daa68be37b',
  readable_surface_test_sha256: '1c0bbfa9b438df2dc5f7d08d939c43a17fb21fa39412d1db958109d013a78771',
  pr130_checkpoint_doc_sha256: '5717fbc87d1f959412df0e56d579cb0ff7a49dcaead6e32ef548da75f8b6f8de',
  total_verified_pass: 543,
  readable_surface_test_pass: 19,
  source_review_package_test_pass: 21
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

function arrayOr(value) {
  return Array.isArray(value) ? value : [];
}

function blocked(reason) {
  return deepFreeze({
    state: HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.BLOCKED,
    reason,
    evidence_core_v1_demo_payload_export: null
  });
}

function getReadableSurfaceResult(context) {
  if (isPlainObject(context) && isPlainObject(context.source_readable_surface_result)) {
    return context.source_readable_surface_result;
  }

  return createHbceEvidenceCoreV1ReadableSurface();
}

function sourceSurfaceFrom(result) {
  if (!isPlainObject(result)) {
    return null;
  }

  return result.evidence_core_v1_readable_surface || null;
}

function sourceIsSafe(surface) {
  if (!isPlainObject(surface)) {
    return false;
  }

  const boundary = surface.boundary_assertions;
  const decision = surface.decision_status;

  return (
    surface.evidence_core_v1_readable_surface_sha256 === EXPECTED.readable_surface_sha256 &&
    isPlainObject(boundary) &&
    isPlainObject(decision) &&
    boundary.deterministic === true &&
    boundary.read_only === true &&
    boundary.observe_only === true &&
    boundary.fail_closed === true &&
    boundary.grants_authorization === false &&
    boundary.creates_authorization_artifact === false &&
    boundary.access_granted === false &&
    boundary.executes_runtime_action === false &&
    boundary.creates_dispatch === false &&
    boundary.mutates_runtime_state === false &&
    boundary.legal_certification_created === false &&
    boundary.eidas_qualification_created === false &&
    boundary.opc_allow_created === false &&
    boundary.production_deployment_proven === false &&
    decision.status === 'ACCESS_NOT_GRANTED' &&
    decision.policy_decision === 'UNEVALUATED' &&
    decision.authorization_state === 'UNRESOLVED' &&
    decision.access_granted === false
  );
}

function buildDemoPayload(surface, generatedAt) {
  const payload = {
    proto: HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_PROTO,
    kind: HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_KIND,
    version: '1.0',
    generated_at: generatedAt,
    demo_payload_export_id: 'HBCE-EVIDENCE-CORE-V1-DEMO-PAYLOAD-EXPORT-2026-09-23',
    state: HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.EXPORTED,

    export_scope: 'INTERNAL_PRODUCT_DEMO_PAYLOAD_ONLY',
    product_name: 'HBCE Evidence Core v1',
    product_surface_ref: 'runtime/product/create-hbce-evidence-core-v1-readable-surface.js',
    product_surface_sha256: surface.evidence_core_v1_readable_surface_sha256,

    baseline: {
      pr131_base_main_commit: EXPECTED.pr131_base_main_commit,
      pr130_merge_commit: EXPECTED.pr130_merge_commit,
      pr130_checkpoint_commit: EXPECTED.pr130_checkpoint_commit,
      total_verified_pass: EXPECTED.total_verified_pass,
      readable_surface_test_pass: EXPECTED.readable_surface_test_pass,
      source_review_package_test_pass: EXPECTED.source_review_package_test_pass
    },

    proof_hashes: {
      readable_surface_sha256: surface.evidence_core_v1_readable_surface_sha256,
      readable_surface_runtime_sha256: EXPECTED.readable_surface_runtime_sha256,
      readable_surface_test_sha256: EXPECTED.readable_surface_test_sha256,
      pr130_checkpoint_doc_sha256: EXPECTED.pr130_checkpoint_doc_sha256,
      final_chain_audit_doc_sha256: surface.technical_proofs.final_chain_audit_doc_sha256,
      evidence_core_v1_baseline_doc_sha256:
        surface.technical_proofs.evidence_core_v1_baseline_doc_sha256,
      product_launch_readiness_doc_sha256:
        surface.technical_proofs.product_launch_readiness_doc_sha256,
      banking_pilot_readiness_doc_sha256:
        surface.technical_proofs.banking_pilot_readiness_doc_sha256
    },

    demo_cards: [
      {
        id: 'DECISION',
        label: 'Decision',
        value: 'Access not granted',
        detail: surface.decision_status.human_readable_summary
      },
      {
        id: 'AUTHORIZATION',
        label: 'Authorization',
        value: 'Unresolved',
        detail: 'No authorization artifact is created.'
      },
      {
        id: 'POLICY',
        label: 'Policy',
        value: 'Unevaluated',
        detail: 'Policy has not produced an authorizing decision.'
      },
      {
        id: 'RUNTIME',
        label: 'Runtime effects',
        value: 'No runtime effects',
        detail: 'No dispatch, execution or runtime mutation is created.'
      },
      {
        id: 'REVIEW_PACKAGE',
        label: 'Review package',
        value: 'Internal observe-only package',
        detail: 'The package supports review without claiming external review completion.'
      }
    ],

    banking_demo: {
      title: 'AI-assisted internal access decision evidence pack',
      use_case: surface.banking_pilot_summary.recommended_use_case,
      reviewer_summary: surface.banking_pilot_summary.reader_summary,
      success_criteria: arrayOr(surface.banking_pilot_summary.pilot_success_criteria),
      one_minute_explanation:
        'HBCE Evidence Core v1 shows that an access decision remained controlled: policy is unevaluated, authorization is unresolved, access is false, and no runtime action was executed.'
    },

    decision_snapshot: {
      status: surface.decision_status.status,
      authority_resolution_state: surface.decision_status.authority_resolution_state,
      policy_decision: surface.decision_status.policy_decision,
      authorization_state: surface.decision_status.authorization_state,
      access_granted: false,
      runtime_action_executed: false,
      dispatch_created: false,
      runtime_state_mutated: false
    },

    claims: {
      allowed: arrayOr(surface.allowed_claims),
      prohibited: arrayOr(surface.prohibited_claims)
    },

    api_status: {
      api_route_available_in_current_repo:
        surface.api_route_discovery.api_route_available_in_current_repo === true,
      package_json_available: surface.api_route_discovery.package_json_available === true,
      app_pages_src_route_scaffold_available:
        surface.api_route_discovery.app_pages_src_route_scaffold_available === true,
      recommendation: stringOr(
        surface.api_route_discovery.next_adapter_recommendation,
        'Expose through a real route scaffold later.'
      )
    },

    boundary_summary: {
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
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false,
      production_deployment_proven: false,
      external_review_completion_claimed: false,
      regulatory_approval_claimed: false
    },

    export_limitations: [
      'This payload is a product demo payload, not an API route.',
      'This payload does not create legal certification.',
      'This payload does not create eIDAS qualification.',
      'This payload does not prove production deployment.',
      'This payload does not claim regulatory approval.',
      'This payload does not authorize banking operations.'
    ]
  };

  payload.demo_payload_core_sha256 = sha256Canonical({
    banking_demo: payload.banking_demo,
    decision_snapshot: payload.decision_snapshot,
    proof_hashes: payload.proof_hashes,
    boundary_summary: payload.boundary_summary
  });

  payload.evidence_core_v1_demo_payload_export_sha256 = sha256Canonical(payload);

  return payload;
}

function createHbceEvidenceCoreV1DemoPayloadExport(context = {}) {
  if (!isPlainObject(context)) {
    return blocked('CONTEXT_INVALID');
  }

  const generatedAt = stringOr(context.generated_at, DEFAULT_GENERATED_AT);

  if (!isIsoDate(generatedAt)) {
    return blocked('GENERATED_AT_INVALID');
  }

  const source = getReadableSurfaceResult(context);

  if (!isPlainObject(source) || source.state !== 'READY') {
    return blocked('SOURCE_READABLE_SURFACE_BLOCKED');
  }

  const surface = sourceSurfaceFrom(source);

  if (!isPlainObject(surface)) {
    return blocked('SOURCE_READABLE_SURFACE_MISSING');
  }

  if (surface.evidence_core_v1_readable_surface_sha256 !== EXPECTED.readable_surface_sha256) {
    return blocked('SOURCE_READABLE_SURFACE_HASH_MISMATCH');
  }

  if (!sourceIsSafe(surface)) {
    return blocked('SOURCE_READABLE_SURFACE_BOUNDARY_INVALID');
  }

  return deepFreeze({
    state: HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE.EXPORTED,
    reason: 'HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_EXPORTED',
    evidence_core_v1_demo_payload_export: buildDemoPayload(surface, generatedAt)
  });
}

module.exports = {
  createHbceEvidenceCoreV1DemoPayloadExport,
  HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_PROTO,
  HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_KIND,
  HBCE_EVIDENCE_CORE_V1_DEMO_PAYLOAD_EXPORT_STATE
};
