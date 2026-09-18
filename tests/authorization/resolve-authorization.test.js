'use strict';

const assert = require('node:assert/strict');
const {
  STATE,
  resolveAuthorization
} = require('../../runtime/authorization/resolve-authorization');

const vectors = [
  {
    name: 'AZN-001 POLICY_DENY=>DENIED',
    input: { policyDecision: { decision: 'DENY', reason: 'AUTHORITY_NOT_VALID' } },
    expected: { state: 'DENIED', reason: 'POLICY_DENIED' }
  },
  {
    name: 'AZN-002 POLICY_UNEVALUATED=>UNRESOLVED',
    input: { policyDecision: { decision: 'UNEVALUATED', reason: 'POLICY_EVALUATION_DEFERRED' } },
    expected: { state: 'UNRESOLVED', reason: 'POLICY_NOT_RESOLVED' }
  },
  {
    name: 'AZN-003 NO_INPUT=>UNRESOLVED',
    input: undefined,
    expected: { state: 'UNRESOLVED', reason: 'POLICY_DECISION_INVALID' }
  },
  {
    name: 'AZN-004 UNKNOWN_POLICY_DECISION=>UNRESOLVED',
    input: { policyDecision: { decision: 'FUTURE_UNKNOWN' } },
    expected: { state: 'UNRESOLVED', reason: 'POLICY_DECISION_INVALID' }
  }
];

let passed = 0;

for (const vector of vectors) {
  const actual = resolveAuthorization(vector.input);
  assert.deepEqual(actual, vector.expected);
  console.log(`PASS ${vector.name}`);
  passed += 1;
}

assert.equal(STATE.AUTHORIZED, undefined);
console.log('PASS AZN-005 AUTHORIZED_NOT_IMPLEMENTED');
passed += 1;

const adversarial = [
  { name: "AZN-006 NULL_POLICY_DECISION=>UNRESOLVED", input: { policyDecision: null } },
  { name: "AZN-007 STRING_POLICY_DECISION=>UNRESOLVED", input: { policyDecision: "DENY" } },
  { name: "AZN-008 EMPTY_POLICY_DECISION=>UNRESOLVED", input: { policyDecision: {} } }
];

for (const vector of adversarial) {
  const actual = resolveAuthorization(vector.input);
  assert.deepEqual(actual, {
    state: "UNRESOLVED",
    reason: "POLICY_DECISION_INVALID"
  });
  console.log(`PASS ${vector.name}`);
  passed += 1;
}

const immutableInput = {
  policyDecision: {
    decision: "DENY",
    reason: "AUTHORITY_NOT_VALID"
  }
};
const before = JSON.stringify(immutableInput);
resolveAuthorization(immutableInput);
assert.equal(JSON.stringify(immutableInput), before);
console.log("PASS AZN-009 INPUT_NOT_MUTATED");
passed += 1;

assert.equal(Object.hasOwn(resolveAuthorization({
  policyDecision: { decision: "DENY" }
}), "authorization"), false);
console.log("PASS AZN-010 NO_AUTHORIZATION_ARTIFACT_SIDE_EFFECT");
passed += 1;

const allowResult = resolveAuthorization({
  policyDecision: {
    decision: "ALLOW",
    reason: "POLICY_SATISFIED"
  }
});

assert.deepEqual(allowResult, {
  state: "UNRESOLVED",
  reason: "POSITIVE_AUTHORIZATION_DEFERRED"
});

assert.equal(STATE.AUTHORIZED, undefined);

console.log("PASS AZN-011 POLICY_ALLOW_DOES_NOT_AUTHORIZE");
passed += 1;

console.log(`AUTHORIZATION_RESOLUTION=${passed}/11 PASS`);
