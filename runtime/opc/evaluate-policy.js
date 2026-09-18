'use strict';

const DECISION = Object.freeze({
  UNEVALUATED: 'UNEVALUATED',
  DENY: 'DENY'
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

  return decision(
    DECISION.UNEVALUATED,
    'POLICY_EVALUATION_DEFERRED'
  );
}

module.exports = Object.freeze({
  DECISION,
  evaluatePolicy
});
