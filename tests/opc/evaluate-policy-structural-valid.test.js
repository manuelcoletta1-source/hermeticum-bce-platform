'use strict';

const assert = require('node:assert/strict');

const validatorPath = require.resolve(
  '../../runtime/policy/validate-policy-evaluation'
);

const opcPath = require.resolve(
  '../../runtime/opc/evaluate-policy'
);

const originalValidatorModule = require.cache[validatorPath];

try {
  const validator = require(validatorPath);

  require.cache[validatorPath].exports = Object.freeze({
    STATE: validator.STATE,
    validatePolicyEvaluation() {
      return Object.freeze({
        state: validator.STATE.VALID,
        reason: 'POLICY_EVALUATION_CANONICAL_STRUCTURE_VALID'
      });
    }
  });

  delete require.cache[opcPath];

  const { DECISION, evaluatePolicy } = require(opcPath);

  const actual = evaluatePolicy({
    authorityResolution: { state: 'VALID' },
    policyEvaluation: { proto: 'TEST_DOUBLE' }
  });

  assert.deepEqual(actual, {
    decision: DECISION.UNEVALUATED,
    reason: 'POLICY_EVALUATION_DEFERRED'
  });

  assert.notEqual(actual.decision, DECISION.ALLOW);

  console.log('PASS OPC_STRUCTURAL_VALID_REMAINS_UNEVALUATED');
  console.log('OPC_STRUCTURAL_VALID=1/1 PASS');
} finally {
  delete require.cache[opcPath];

  if (originalValidatorModule) {
    require.cache[validatorPath] = originalValidatorModule;
  } else {
    delete require.cache[validatorPath];
  }
}
