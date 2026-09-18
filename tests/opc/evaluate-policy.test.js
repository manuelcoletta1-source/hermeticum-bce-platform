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

const positivePolicyInput = {
  authorityResolution: {
    state: "VALID",
    reason: "AUTHORITY_VALID"
  },
  policyEvaluation: {
    policy_evaluation_id: "PEV-001",
    policy_evaluation_version: 1,
    state: "SATISFIED",
    policy_ref: "POLICY-001",
    policy_version: 1,
    policy_sha256: "a".repeat(64),
    request_sha256: "b".repeat(64),
    payload_sha256: "c".repeat(64)
  }
};

const positivePolicyResult = evaluatePolicy(positivePolicyInput);

assert.deepEqual(positivePolicyResult, {
  decision: "ALLOW",
  reason: "POLICY_SATISFIED"
});

console.log("PASS OPC-POLICY-001 VALID+SATISFIED=>ALLOW");
passed += 1;

const invalidPositivePolicies = [
  {
    name: "OPC-POLICY-002 SATISFIED+MISSING_REF=>UNEVALUATED",
    policyEvaluation: {
      state: "SATISFIED",
      policy_version: 1,
      policy_sha256: "a".repeat(64),
      request_sha256: "b".repeat(64)
    }
  },
  {
    name: "OPC-POLICY-003 SATISFIED+VERSION_ZERO=>UNEVALUATED",
    policyEvaluation: {
      state: "SATISFIED",
      policy_ref: "POLICY-001",
      policy_version: 0,
      policy_sha256: "a".repeat(64),
      request_sha256: "b".repeat(64)
    }
  },
  {
    name: "OPC-POLICY-004 SATISFIED+BAD_POLICY_HASH=>UNEVALUATED",
    policyEvaluation: {
      state: "SATISFIED",
      policy_ref: "POLICY-001",
      policy_version: 1,
      policy_sha256: "INVALID",
      request_sha256: "b".repeat(64)
    }
  },
  {
    name: "OPC-POLICY-005 SATISFIED+BAD_REQUEST_HASH=>UNEVALUATED",
    policyEvaluation: {
      state: "SATISFIED",
      policy_ref: "POLICY-001",
      policy_version: 1,
      policy_sha256: "a".repeat(64),
      request_sha256: "INVALID"
    }
  },
  {
    name: "OPC-POLICY-006 UNKNOWN_STATE=>UNEVALUATED",
    policyEvaluation: {
      state: "FUTURE_UNKNOWN",
      policy_ref: "POLICY-001",
      policy_version: 1,
      policy_sha256: "a".repeat(64),
      request_sha256: "b".repeat(64)
    }
  }
];

for (const vector of invalidPositivePolicies) {
  const actual = evaluatePolicy({
    authorityResolution: {
      state: "VALID",
      reason: "AUTHORITY_VALID"
    },
    policyEvaluation: vector.policyEvaluation
  });

  assert.deepEqual(actual, {
    decision: DECISION.UNEVALUATED,
    reason: "POLICY_EVALUATION_DEFERRED"
  });

  console.log(`PASS ${vector.name}`);
  passed += 1;
}


const anonymousPolicyEvaluationResult = evaluatePolicy({
  authorityResolution: {
    state: "VALID",
    reason: "AUTHORITY_VALID"
  },
  policyEvaluation: {
    state: "SATISFIED",
    policy_ref: "POLICY-001",
    policy_version: 1,
    policy_sha256: "a".repeat(64),
    request_sha256: "b".repeat(64)
  }
});

assert.deepEqual(anonymousPolicyEvaluationResult, {
  decision: DECISION.UNEVALUATED,
  reason: "POLICY_EVALUATION_DEFERRED"
});

console.log("PASS OPC-POLICY-007 ANONYMOUS_EVALUATION=>UNEVALUATED");
passed += 1;

console.log(`OPC_AUTHORITY_GATE=${passed}/17 PASS`);
