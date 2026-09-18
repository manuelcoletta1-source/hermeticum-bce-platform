'use strict';

const assert = require('node:assert/strict');
const {
  DECISION,
  evaluatePolicy
} = require('../../runtime/opc/evaluate-policy');

const negativeStates = [
  'INVALID',
  'EXPIRED',
  'REVOKED',
  'OUT_OF_SCOPE',
  'MISSING'
];

let passed = 0;

for (const state of negativeStates) {
  const result = evaluatePolicy({
    authorityResolution: {
      state,
      reason: `TEST_${state}`
    }
  });

  assert.deepEqual(result, {
    decision: DECISION.DENY,
    reason: 'AUTHORITY_NOT_VALID'
  });

  console.log(`PASS OPC-AUTH-${state}=>DENY`);
  passed += 1;
}

const validResult = evaluatePolicy({
  authorityResolution: {
    state: 'VALID',
    reason: 'AUTHORITY_VALID'
  }
});

assert.deepEqual(validResult, {
  decision: DECISION.UNEVALUATED,
  reason: 'POLICY_EVALUATION_DEFERRED'
});

console.log('PASS OPC-AUTH-VALID=>UNEVALUATED');
passed += 1;

const noInputResult = evaluatePolicy();
assert.deepEqual(noInputResult, {
  decision: DECISION.DENY,
  reason: 'AUTHORITY_NOT_VALID'
});
console.log('PASS OPC-AUTH-NO-INPUT=>DENY');
passed += 1;

const nullResult = evaluatePolicy({
  authorityResolution: null
});
assert.deepEqual(nullResult, {
  decision: DECISION.DENY,
  reason: 'AUTHORITY_NOT_VALID'
});
console.log('PASS OPC-AUTH-NULL=>DENY');
passed += 1;

const unknownResult = evaluatePolicy({
  authorityResolution: {
    state: 'UNKNOWN_FUTURE_STATE',
    reason: 'TEST_UNKNOWN'
  }
});
assert.deepEqual(unknownResult, {
  decision: DECISION.DENY,
  reason: 'AUTHORITY_NOT_VALID'
});
console.log('PASS OPC-AUTH-UNKNOWN=>DENY');
passed += 1;

const immutableInput = {
  authorityResolution: {
    state: 'VALID',
    reason: 'AUTHORITY_VALID'
  }
};
const before = JSON.stringify(immutableInput);
evaluatePolicy(immutableInput);
assert.equal(JSON.stringify(immutableInput), before);
console.log('PASS OPC-AUTH-INPUT=>NOT_MUTATED');
passed += 1;

console.log(`OPC_AUTHORITY_GATE=${passed}/10 PASS`);
