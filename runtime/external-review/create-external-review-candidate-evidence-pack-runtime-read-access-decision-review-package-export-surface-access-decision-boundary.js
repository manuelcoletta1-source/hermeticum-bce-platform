'use strict';

const crypto = require('crypto');

const {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceCapabilityBinding,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE
} = require('./create-external-review-candidate-evidence-pack-runtime-read-access-decision-review-package-export-surface-capability-binding');

const { evaluatePolicy } = require('../opc/evaluate-policy');

const { resolveAuthorization } = require('../authorization/resolve-authorization');

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_PROTO =
  'hbce.external_review_candidate.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary.v1';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_KIND =
  'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY';

const HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE = Object.freeze({
  READY: 'READY',
  BLOCKED: 'BLOCKED'
});

const DEFAULT_GENERATED_AT = '2026-09-23T18:05:00.000Z';
const DEFAULT_CURRENT_TIME = '2026-09-23T18:05:00.000Z';

const EXPECTED_SOURCE_BINDING_SHA256 =
  'cb0e03f17c9f144e284d2b5fbfb265617893991c7c7ecefef2294825f2eb2f4f';

const EXPECTED_SOURCE_BINDING_PAYLOAD_SHA256 =
  '09fd3d302e21a9117823d8f365b57b256b65a86c49cd77450a83e01adee6d5e2';

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256Hex(value) {
  const payload = typeof value === 'string' ? value : JSON.stringify(value);
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function isIsoDateTime(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const parsed = new Date(value);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function blocked(reason, details = {}) {
  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.BLOCKED,
    reason,
    ...details
  };
}

function createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionBoundary(input = {}) {
  const generatedAt = input.generated_at || DEFAULT_GENERATED_AT;
  const currentTime = input.current_time || DEFAULT_CURRENT_TIME;

  if (!isIsoDateTime(generatedAt)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_GENERATED_AT_INVALID'
    );
  }

  if (!isIsoDateTime(currentTime)) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_CURRENT_TIME_INVALID'
    );
  }

  const sourceBindingResult =
    input.source_binding_result ||
    createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceCapabilityBinding(
      input.source_binding_input || {}
    );

  if (
    sourceBindingResult.state !==
      HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_CAPABILITY_BINDING_STATE.READY ||
    !sourceBindingResult.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_BLOCKED',
      { source_binding_result: cloneJson(sourceBindingResult) }
    );
  }

  const sourceBinding =
    sourceBindingResult.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding;

  if (
    sourceBinding.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256 !==
      EXPECTED_SOURCE_BINDING_SHA256 ||
    sourceBinding.capability_binding_payload_sha256 !== EXPECTED_SOURCE_BINDING_PAYLOAD_SHA256
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_HASH_MISMATCH',
      { source_binding: cloneJson(sourceBinding) }
    );
  }

  if (
    sourceBinding.access_granted !== false ||
    sourceBinding.grants_authorization !== false ||
    sourceBinding.creates_authorization_artifact !== false ||
    sourceBinding.executes_runtime_action !== false ||
    sourceBinding.creates_dispatch !== false ||
    sourceBinding.mutates_runtime_state !== false ||
    sourceBinding.read_capability_binding_only !== true
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_NOT_READ_ONLY',
      { source_binding: cloneJson(sourceBinding) }
    );
  }

  if (
    sourceBinding.external_review_execution_created !== false ||
    sourceBinding.external_review_submission_created !== false ||
    sourceBinding.external_review_publication_created !== false ||
    sourceBinding.legal_certification_created !== false ||
    sourceBinding.eidas_qualification_created !== false ||
    sourceBinding.opc_allow_created !== false
  ) {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_SOURCE_BINDING_FALSE_EFFECTS_INVALID',
      { source_binding: cloneJson(sourceBinding) }
    );
  }

  const sourcePayload = sourceBinding.capability_binding_payload;
  const authorityResolution = sourcePayload.authority_resolution;

  const policyDecision = evaluatePolicy({
    authorityResolution,
    authority_resolution: authorityResolution,
    policyEvaluation: input.policy_evaluation || null
  });

  const authorizationResolution = resolveAuthorization({
    policyDecision
  });

  const positiveAllowProbeAuthorizationResolution = resolveAuthorization({
    policyDecision: {
      decision: 'ALLOW',
      reason: 'POSITIVE_ALLOW_PROBE',
      evaluated_at: currentTime,
      evidence_state: 'ABSENT'
    }
  });

  if (authorizationResolution.state !== 'UNRESOLVED') {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_AUTHORIZATION_NOT_FAIL_CLOSED',
      { authorization_resolution: cloneJson(authorizationResolution) }
    );
  }

  if (positiveAllowProbeAuthorizationResolution.state !== 'UNRESOLVED') {
    return blocked(
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_ALLOW_PROBE_NOT_FAIL_CLOSED',
      { authorization_resolution: cloneJson(positiveAllowProbeAuthorizationResolution) }
    );
  }

  const accessDecisionPayload = {
    source_binding_id: sourceBinding.binding_id,
    source_binding_sha256:
      sourceBinding.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256,
    source_binding_payload_sha256: sourceBinding.capability_binding_payload_sha256,
    source_binding_scope: sourceBinding.binding_scope,
    source_binding_consumer: sourceBinding.binding_consumer,
    source_binding_read_only: sourceBinding.read_capability_binding_only,
    source_binding_access_granted: sourceBinding.access_granted,
    source_binding_grants_authorization: sourceBinding.grants_authorization,
    source_binding_creates_authorization_artifact: sourceBinding.creates_authorization_artifact,
    source_binding_executes_runtime_action: sourceBinding.executes_runtime_action,
    source_binding_creates_dispatch: sourceBinding.creates_dispatch,
    source_binding_mutates_runtime_state: sourceBinding.mutates_runtime_state,
    source_index_sha256: sourceBinding.source_index_sha256,
    source_index_payload_sha256: sourceBinding.source_index_payload_sha256,
    source_surface_sha256: sourceBinding.source_surface_sha256,
    source_surface_payload_sha256: sourceBinding.source_surface_payload_sha256,
    source_export_sha256: sourceBinding.source_export_sha256,
    source_export_payload_sha256: sourceBinding.source_export_payload_sha256,
    source_review_package_sha256: sourceBinding.source_review_package_sha256,
    source_review_package_payload_sha256: sourceBinding.source_review_package_payload_sha256,
    source_authority_resolution: cloneJson(authorityResolution),
    source_capability: cloneJson(sourcePayload.capability),
    source_authority: cloneJson(sourcePayload.authority),
    source_fail_closed_view: cloneJson(sourcePayload.fail_closed_view),
    policy_decision: cloneJson(policyDecision),
    authorization_resolution: cloneJson(authorizationResolution),
    positive_allow_probe_authorization_resolution: cloneJson(positiveAllowProbeAuthorizationResolution),
    decision_snapshot: {
      authority_resolution_state: authorityResolution.state,
      authority_resolution_reason: authorityResolution.reason,
      policy_decision: policyDecision.decision,
      policy_decision_reason: policyDecision.reason,
      authorization_state: authorizationResolution.state,
      authorization_reason: authorizationResolution.reason,
      positive_allow_probe_authorization_state: positiveAllowProbeAuthorizationResolution.state,
      positive_allow_probe_authorization_reason: positiveAllowProbeAuthorizationResolution.reason,
      access_granted: false,
      grants_authorization: false
    },
    stable_access_contract: {
      deterministic_sha256_bound: true,
      source_binding_hash_bound: true,
      source_index_hash_bound: true,
      source_surface_hash_bound: true,
      access_decision_boundary_only: true,
      runtime_read_access_decision_review_package_export_surface_access_decision_boundary_only: true,
      fail_closed_source_binding_required: true,
      valid_authority_does_not_authorize: true,
      policy_allow_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutated: true
    },
    fail_closed_view: {
      source_binding_required: true,
      source_binding_hash_bound: true,
      authority_resolution_required: true,
      policy_evaluation_required_for_authorization: true,
      policy_unevaluated_blocks_authorization: true,
      authorization_required_for_execution: true,
      unresolved_authorization_blocks_execution: true,
      positive_allow_probe_does_not_authorize: true,
      no_dispatch_without_authorization: true
    },
    readable_summary: {
      authority_resolution_state: authorityResolution.state,
      policy_decision: policyDecision.decision,
      authorization_state: authorizationResolution.state,
      positive_allow_probe_authorization_state: positiveAllowProbeAuthorizationResolution.state,
      access_granted: false,
      grants_authorization: false,
      creates_dispatch: false,
      executes_runtime_action: false,
      legal_certification_created: false,
      eidas_qualification_created: false,
      opc_allow_created: false
    },
    assertions: {
      canonical_json_object: true,
      deterministic_sha256_bound: true,
      source_binding_hash_bound: true,
      source_index_hash_bound: true,
      source_surface_hash_bound: true,
      source_export_hash_bound: true,
      source_review_package_hash_bound: true,
      access_decision_boundary_only: true,
      runtime_read_access_decision_review_package_export_surface_access_decision_boundary_only: true,
      valid_authority_does_not_authorize: true,
      policy_allow_does_not_authorize: true,
      positive_allow_probe_does_not_authorize: true,
      unresolved_authorization_blocks_execution: true,
      no_authorization_artifact_created: true,
      no_dispatch_created: true,
      no_runtime_state_mutated: true,
      no_external_review_execution_created: true,
      no_external_review_submission_created: true,
      no_external_review_publication_created: true,
      no_legal_certification_created: true,
      no_eidas_qualification_created: true,
      no_opc_allow_created: true,
      no_deployment_proof_created: true,
      no_production_proof_created: true
    }
  };

  accessDecisionPayload.access_decision_payload_sha256 = sha256Hex(accessDecisionPayload);

  const body = {
    proto: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_PROTO,
    kind: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_KIND,
    boundary_id:
      'HBCE-EXTERNAL-REVIEW-CANDIDATE-EVIDENCE-PACK-RUNTIME-READ-ACCESS-DECISION-REVIEW-PACKAGE-EXPORT-SURFACE-ACCESS-DECISION-BOUNDARY-2026-09-23',
    boundary_version: 1,
    boundary_generated_at: generatedAt,
    boundary_main_commit: '57d34db0295b1b8bcc905c72eef990d778398c33',
    source_binding_feature_commit: '14c27a11489a49cc748c8df988768283820c7877',
    source_binding_merge_commit: 'a24277e42da8cacb5746c7e1a91eb5dce6995820',
    source_binding_checkpoint_commit: '64f24d602ebac3fb76cac315ce71a3583797c5c3',
    source_binding_final_chain_audit_commit: '57d34db0295b1b8bcc905c72eef990d778398c33',
    source_binding_checkpoint_doc_sha256: '55bbd129b92c1380677966bb18c79898925cf00c39c822ea2299e70df55fe91a',
    source_final_chain_audit_doc_sha256: '1f42bb1336ed288195a7111c5d4b73e5c917105f5e23d97f9744622383b59a8a',
    authority: 'HBCE_INTERNAL_RUNTIME',
    boundary_scope:
      'INTERNAL_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_ONLY',
    boundary_consumer: 'JOKER_C2',
    boundary_category: 'ACCESS_DECISION_BOUNDARY',
    boundary_subcategory:
      'RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY',
    source_binding_sha256:
      sourceBinding.evidence_pack_runtime_read_access_decision_review_package_export_surface_capability_binding_sha256,
    source_binding_payload_sha256: sourceBinding.capability_binding_payload_sha256,
    source_index_sha256: sourceBinding.source_index_sha256,
    source_index_payload_sha256: sourceBinding.source_index_payload_sha256,
    source_surface_sha256: sourceBinding.source_surface_sha256,
    source_surface_payload_sha256: sourceBinding.source_surface_payload_sha256,
    source_export_sha256: sourceBinding.source_export_sha256,
    source_export_payload_sha256: sourceBinding.source_export_payload_sha256,
    source_review_package_sha256: sourceBinding.source_review_package_sha256,
    source_review_package_payload_sha256: sourceBinding.source_review_package_payload_sha256,
    access_decision_payload_sha256: accessDecisionPayload.access_decision_payload_sha256,
    access_decision_payload: accessDecisionPayload,
    authority_resolution_state: authorityResolution.state,
    authority_resolution_reason: authorityResolution.reason,
    policy_decision: policyDecision.decision,
    policy_decision_reason: policyDecision.reason,
    authorization_state: authorizationResolution.state,
    authorization_reason: authorizationResolution.reason,
    positive_allow_probe_authorization_state: positiveAllowProbeAuthorizationResolution.state,
    positive_allow_probe_authorization_reason: positiveAllowProbeAuthorizationResolution.reason,
    stable_access_contract_satisfied: true,
    fail_closed_source_binding_required: true,
    source_binding_hash_bound: true,
    valid_authority_does_not_authorize: true,
    policy_allow_does_not_authorize: true,
    access_decision_boundary_only: true,
    runtime_read_access_decision_review_package_export_surface_access_decision_boundary_only: true,
    access_granted: false,
    grants_authorization: false,
    creates_authorization_artifact: false,
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
  };

  body.evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary_sha256 =
    sha256Hex(body);

  return {
    state: HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE.READY,
    reason:
      'HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_READY',
    evidence_pack_runtime_read_access_decision_review_package_export_surface_access_decision_boundary: body
  };
}

module.exports = {
  createExternalReviewCandidateEvidencePackRuntimeReadAccessDecisionReviewPackageExportSurfaceAccessDecisionBoundary,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_PROTO,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_KIND,
  HBCE_EXTERNAL_REVIEW_CANDIDATE_EVIDENCE_PACK_RUNTIME_READ_ACCESS_DECISION_REVIEW_PACKAGE_EXPORT_SURFACE_ACCESS_DECISION_BOUNDARY_STATE
};
