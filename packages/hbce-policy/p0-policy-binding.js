'use strict';

const { sha256Digest } = require('../hbce-core/canonical-json.js');
const { enrichRequestEnvelope } = require('../hbce-api-contract/request-envelope.js');
const { resolveAuthority } = require('../../runtime/authority/resolve-authority.js');
const { evaluatePolicy, DECISION } = require('../../runtime/opc/evaluate-policy.js');
const { resolveAuthorization } = require('../../runtime/authorization/resolve-authorization.js');

const P0_BINDING_STATE = Object.freeze({
  DENIED: 'DENIED',
  UNRESOLVED: 'UNRESOLVED'
});

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);

    for (const key of Object.keys(value)) {
      deepFreeze(value[key]);
    }
  }

  return value;
}

function sha256HexFromDigest(digest) {
  return digest.slice('sha256:'.length);
}

function bindingResult(state, reason, details = {}) {
  return deepFreeze({
    state,
    reason,
    details
  });
}

function verifyAuthorityReferenceBinding(enrichedRequestEnvelope, authority) {
  if (!isPlainObject(authority)) {
    return bindingResult('SKIPPED', 'AUTHORITY_OBJECT_NOT_AVAILABLE');
  }

  const mismatches = [];

  if (authority.authority_id !== enrichedRequestEnvelope.authority_ref.authority_id) {
    mismatches.push({
      field: 'authority_id',
      expected: enrichedRequestEnvelope.authority_ref.authority_id,
      actual: authority.authority_id
    });
  }

  if (String(authority.authority_version) !== enrichedRequestEnvelope.authority_ref.authority_version) {
    mismatches.push({
      field: 'authority_version',
      expected: enrichedRequestEnvelope.authority_ref.authority_version,
      actual: authority.authority_version
    });
  }

  const actualAuthorityHash = sha256Digest(authority);
  if (actualAuthorityHash !== enrichedRequestEnvelope.authority_ref.authority_hash) {
    mismatches.push({
      field: 'authority_hash',
      expected: enrichedRequestEnvelope.authority_ref.authority_hash,
      actual: actualAuthorityHash
    });
  }

  if (mismatches.length > 0) {
    return bindingResult('INVALID', 'AUTHORITY_REFERENCE_BINDING_MISMATCH', {
      mismatches
    });
  }

  return bindingResult('VALID', 'AUTHORITY_REFERENCE_BINDING_VALID');
}

function compareIfPresent(mismatches, field, actual, expected) {
  if (actual === undefined) {
    return;
  }

  if (String(actual) !== String(expected)) {
    mismatches.push({
      field,
      expected,
      actual
    });
  }
}

function verifyPolicyEvaluationBinding(enrichedRequestEnvelope, policyEvaluation) {
  if (policyEvaluation == null) {
    return bindingResult('SKIPPED', 'POLICY_EVALUATION_NOT_PROVIDED');
  }

  if (!isPlainObject(policyEvaluation)) {
    return bindingResult('INVALID', 'POLICY_EVALUATION_BINDING_INVALID');
  }

  const mismatches = [];

  compareIfPresent(
    mismatches,
    'authority_ref',
    policyEvaluation.authority_ref,
    enrichedRequestEnvelope.authority_ref.authority_id
  );

  compareIfPresent(
    mismatches,
    'authority_version',
    policyEvaluation.authority_version,
    enrichedRequestEnvelope.authority_ref.authority_version
  );

  compareIfPresent(
    mismatches,
    'authority_sha256',
    policyEvaluation.authority_sha256,
    sha256HexFromDigest(enrichedRequestEnvelope.authority_ref.authority_hash)
  );

  const actionBinding = policyEvaluation.action_binding;

  if (actionBinding !== undefined && !isPlainObject(actionBinding)) {
    return bindingResult('INVALID', 'POLICY_EVALUATION_ACTION_BINDING_INVALID');
  }

  if (isPlainObject(actionBinding)) {
    compareIfPresent(
      mismatches,
      'action_binding.action_class',
      actionBinding.action_class,
      enrichedRequestEnvelope.action_binding.action_class
    );

    compareIfPresent(
      mismatches,
      'action_binding.target_ref',
      actionBinding.target_ref,
      enrichedRequestEnvelope.target_ref.target_id
    );

    compareIfPresent(
      mismatches,
      'action_binding.action_sha256',
      actionBinding.action_sha256,
      sha256HexFromDigest(enrichedRequestEnvelope.action_binding.action_hash)
    );

    compareIfPresent(
      mismatches,
      'action_binding.request_sha256',
      actionBinding.request_sha256,
      sha256HexFromDigest(enrichedRequestEnvelope.request_hash)
    );
  }

  if (mismatches.length > 0) {
    return bindingResult('INVALID', 'POLICY_EVALUATION_BINDING_MISMATCH', {
      mismatches
    });
  }

  return bindingResult('VALID', 'POLICY_EVALUATION_BINDING_CONSISTENT');
}

function buildRuntimeAuthorityRequest(enrichedRequestEnvelope, context) {
  const request = {
    action_class: enrichedRequestEnvelope.action_binding.action_class,
    target_ref: enrichedRequestEnvelope.target_ref.target_id
  };

  const iospaceRef =
    typeof context.iospace_ref === 'string'
      ? context.iospace_ref
      : context.request && typeof context.request.iospace_ref === 'string'
        ? context.request.iospace_ref
        : null;

  if (iospaceRef) {
    request.iospace_ref = iospaceRef;
  }

  return request;
}

function p0Decision(decisionValue, reason) {
  return deepFreeze({
    decision: decisionValue,
    reason
  });
}

function toP0BindingState(authorizationResolution) {
  if (authorizationResolution.state === 'DENIED') {
    return P0_BINDING_STATE.DENIED;
  }

  return P0_BINDING_STATE.UNRESOLVED;
}

function evaluateP0PolicyBinding(input) {
  const context = input && typeof input === 'object' ? input : {};
  const enrichedRequestEnvelope = enrichRequestEnvelope(context.requestEnvelope);

  const authorityReferenceBinding = verifyAuthorityReferenceBinding(
    enrichedRequestEnvelope,
    context.authority
  );

  let authorityResolution;

  if (authorityReferenceBinding.state === 'INVALID') {
    authorityResolution = deepFreeze({
      state: 'INVALID',
      reason: 'AUTHORITY_REFERENCE_BINDING_MISMATCH'
    });
  } else {
    authorityResolution = resolveAuthority({
      authority: context.authority,
      mandate: context.mandate,
      capability: context.capability,
      currentTime: context.currentTime,
      request: buildRuntimeAuthorityRequest(enrichedRequestEnvelope, context)
    });
  }

  const policyEvaluationBinding = verifyPolicyEvaluationBinding(
    enrichedRequestEnvelope,
    context.policyEvaluation
  );

  let policyDecision;

  if (policyEvaluationBinding.state === 'INVALID') {
    policyDecision = p0Decision(
      DECISION.DENY,
      policyEvaluationBinding.reason
    );
  } else {
    policyDecision = evaluatePolicy({
      authorityResolution,
      policyEvaluation: context.policyEvaluation
    });
  }

  const authorizationResolution = resolveAuthorization({
    policyDecision
  });

  return deepFreeze({
    proto: 'HBCE-P0-POLICY-BINDING-v1',
    kind: 'HBCE_P0_POLICY_BINDING',
    version: 'v1',
    request_id: enrichedRequestEnvelope.request_id,
    request_hash: enrichedRequestEnvelope.request_hash,
    request_schema_hash: enrichedRequestEnvelope.schema_hash,
    authority_reference_binding: authorityReferenceBinding,
    policy_evaluation_binding: policyEvaluationBinding,
    authority_resolution: authorityResolution,
    policy_decision: policyDecision,
    authorization_resolution: authorizationResolution,
    p0_binding_state: toP0BindingState(authorizationResolution),
    execution_allowed: false,
    invariant_guard: {
      valid_login_is_not_authority: true,
      permission_is_not_mission: true,
      ai_output_is_not_authority: true
    }
  });
}

module.exports = Object.freeze({
  P0_BINDING_STATE,
  evaluateP0PolicyBinding,
  verifyAuthorityReferenceBinding,
  verifyPolicyEvaluationBinding
});
