'use strict';

const DECISION = Object.freeze({
  UNEVALUATED: 'UNEVALUATED',
  DENY: 'DENY',
  ALLOW: 'ALLOW'
});

function decision(decisionValue, reason) {
  return Object.freeze({
    decision: decisionValue,
    reason
  });
}

function evaluatePolicy(input) {
  const context = input && typeof input === 'object' ? input : {};
  const authorityResolution = context.authorityResolution;

  if (
    authorityResolution == null ||
    typeof authorityResolution !== 'object' ||
    authorityResolution.state !== 'VALID'
  ) {
    return decision(DECISION.DENY, 'AUTHORITY_NOT_VALID');
  }

  const policyEvaluation = context.policyEvaluation;
  const sha256Pattern = /^[a-f0-9]{64}$/;

  if (
    policyEvaluation != null &&
    typeof policyEvaluation === 'object' &&
    policyEvaluation.state === 'SATISFIED' &&
    typeof policyEvaluation.policy_ref === 'string' &&
    policyEvaluation.policy_ref.length > 0 &&
    Number.isInteger(policyEvaluation.policy_version) &&
    policyEvaluation.policy_version >= 1 &&
    typeof policyEvaluation.policy_sha256 === 'string' &&
    sha256Pattern.test(policyEvaluation.policy_sha256) &&
    typeof policyEvaluation.request_sha256 === 'string' &&
    sha256Pattern.test(policyEvaluation.request_sha256)
  ) {
    return decision(
      DECISION.ALLOW,
      'POLICY_SATISFIED'
    );
  }

  return decision(
    DECISION.UNEVALUATED,
    'POLICY_EVALUATION_DEFERRED'
  );
}

module.exports = Object.freeze({
  DECISION,
  evaluatePolicy
});
