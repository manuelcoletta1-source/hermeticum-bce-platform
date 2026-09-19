'use strict';

const {
  validatePolicyEvaluation
} = require('./validate-policy-evaluation');

const {
  verifyPolicyEvaluationPayload
} = require('./verify-policy-evaluation-payload');

const STATE = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID'
});

function result(state, reason) {
  return Object.freeze({ state, reason });
}

function verifyPolicyEvaluationGenealogy(current, previous) {
  if (validatePolicyEvaluation(current).state !== STATE.VALID) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_CURRENT_STRUCTURE_INVALID'
    );
  }

  if (verifyPolicyEvaluationPayload(current).state !== STATE.VALID) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_CURRENT_PAYLOAD_INVALID'
    );
  }

  if (current.policy_evaluation_version === 1) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENESIS_ANCHOR_DEFERRED'
    );
  }

  if (validatePolicyEvaluation(previous).state !== STATE.VALID) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_PREVIOUS_STRUCTURE_INVALID'
    );
  }

  if (verifyPolicyEvaluationPayload(previous).state !== STATE.VALID) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_PREVIOUS_PAYLOAD_INVALID'
    );
  }

  if (
    !Number.isSafeInteger(current.policy_evaluation_version) ||
    !Number.isSafeInteger(previous.policy_evaluation_version) ||
    current.policy_evaluation_version !==
      previous.policy_evaluation_version + 1
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_VERSION_MISMATCH'
    );
  }

  if (
    current.genealogy.derived_from !==
    previous.policy_evaluation_id
  ) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_PREDECESSOR_MISMATCH'
    );
  }

  if (current.genealogy.previous_state !== previous.state) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_PREVIOUS_STATE_MISMATCH'
    );
  }

  if (current.genealogy.hash !== previous.payload_sha256) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_GENEALOGY_PREVIOUS_HASH_MISMATCH'
    );
  }

  return result(
    STATE.VALID,
    'POLICY_EVALUATION_GENEALOGY_PAIR_VERIFIED'
  );
}

module.exports = Object.freeze({
  STATE,
  verifyPolicyEvaluationGenealogy
});
