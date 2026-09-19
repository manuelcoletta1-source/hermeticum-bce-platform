'use strict';

const assert = require('node:assert/strict');

const validatorPath = require.resolve(
  '../../runtime/policy/validate-policy-evaluation'
);

const opcPath = require.resolve(
  '../../runtime/opc/evaluate-policy'
);

const validator = require(validatorPath);
const originalValidatorModule = require.cache[validatorPath];

let calls = 0;

try {
  require.cache[validatorPath].exports = Object.freeze({
    STATE: validator.STATE,
    validatePolicyEvaluation(value) {
      calls += 1;

      return validator.validatePolicyEvaluation(value);
    }
  });

  delete require.cache[opcPath];

  const {
    DECISION,
    evaluatePolicy
  } = require(opcPath);

  const invalidAuthority = evaluatePolicy({
    authorityResolution: {
      state: 'INVALID'
    },
    policyEvaluation: {
      state: 'SATISFIED'
    }
  });

  assert.equal(invalidAuthority.decision, DECISION.DENY);
  assert.equal(calls, 0);

  console.log(
    'PASS OPC_CANONICAL_INVALID_AUTHORITY_NO_VALIDATOR_CALL'
  );

  const validAuthority = evaluatePolicy({
    authorityResolution: {
      state: 'VALID'
    },
    policyEvaluation: {
      state: 'SATISFIED'
    }
  });

  assert.equal(validAuthority.decision, DECISION.UNEVALUATED);
  assert.equal(calls, 1);

  console.log(
    'PASS OPC_CANONICAL_VALID_AUTHORITY_VALIDATOR_CALLED'
  );

  assert.notEqual(validAuthority.decision, DECISION.ALLOW);

  console.log(
    'PASS OPC_CANONICAL_LEGACY_NO_ALLOW'
  );

  console.log(
    'OPC_CANONICAL_INTEGRATION=3/3 PASS'
  );

} finally {
  delete require.cache[opcPath];
  require.cache[validatorPath] = originalValidatorModule;
}
