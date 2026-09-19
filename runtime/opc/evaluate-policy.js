'use strict';

const {
  STATE: POLICY_VALIDATION_STATE,
  validatePolicyEvaluation
} = require('../policy/validate-policy-evaluation');

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

  const policyValidation = validatePolicyEvaluation(
    context.policyEvaluation
  );

  if (policyValidation.state !== POLICY_VALIDATION_STATE.VALID) {
    return decision(
      DECISION.UNEVALUATED,
      'POLICY_EVALUATION_DEFERRED'
    );
  }

  /*
   * Canonical structural validity alone cannot authorize execution.
   * Positive policy decisions remain fail-closed until the
   * authority, policy and action bindings are verified.
   */
  return decision(
    DECISION.UNEVALUATED,
    'POLICY_EVALUATION_DEFERRED'
  );
}

module.exports = Object.freeze({
  DECISION,
  evaluatePolicy
});
