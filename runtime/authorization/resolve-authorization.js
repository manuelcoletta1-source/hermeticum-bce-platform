'use strict';

const STATE = Object.freeze({
  DENIED: 'DENIED',
  UNRESOLVED: 'UNRESOLVED'
});

function resolution(state, reason) {
  return Object.freeze({
    state,
    reason
  });
}

function resolveAuthorization(input) {
  const context = input && typeof input === 'object' ? input : {};
  const policyDecision = context.policyDecision;

  if (
    policyDecision == null ||
    typeof policyDecision !== 'object'
  ) {
    return resolution(
      STATE.UNRESOLVED,
      'POLICY_DECISION_INVALID'
    );
  }

  if (policyDecision.decision === 'DENY') {
    return resolution(
      STATE.DENIED,
      'POLICY_DENIED'
    );
  }

  if (policyDecision.decision === 'UNEVALUATED') {
    return resolution(
      STATE.UNRESOLVED,
      'POLICY_NOT_RESOLVED'
    );
  }

  return resolution(
    STATE.UNRESOLVED,
    'POLICY_DECISION_INVALID'
  );
}

module.exports = Object.freeze({
  STATE,
  resolveAuthorization
});
