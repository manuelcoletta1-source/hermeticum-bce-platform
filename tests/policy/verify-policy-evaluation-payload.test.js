'use strict';

const assert = require('node:assert/strict');

const {
  STATE,
  canonicalJson,
  computePayloadSha256,
  verifyPolicyEvaluationPayload
} = require('../../runtime/policy/verify-policy-evaluation-payload');

let passed = 0;

function check(name, fn) {
  fn();
  passed += 1;
  console.log('PASS ' + name);
}

check('CANONICAL_KEY_ORDER', () => {
  assert.equal(
    canonicalJson({ z: 2, a: { y: true, b: null } }),
    '{"a":{"b":null,"y":true},"z":2}'
  );
});

check('CANONICAL_REJECTS_UNSAFE_NUMBER', () => {
  assert.throws(
    () => canonicalJson({ n: Number.MAX_SAFE_INTEGER + 1 }),
    /NON_CANONICAL_NUMBER/
  );
});

check('CANONICAL_REJECTS_UNDEFINED', () => {
  assert.throws(
    () => canonicalJson({ value: undefined }),
    /UNDEFINED_VALUE/
  );
});

const evaluation = {
  proto: 'HBCE-POLICY-EVALUATION-v1',
  policy_evaluation_id: 'PEV-SF-072A',
  genealogy: {
    hash: 'a'.repeat(64),
    new_state: 'FAIL'
  },
  state: 'FAIL',
  payload_sha256: '0'.repeat(64)
};

evaluation.payload_sha256 = computePayloadSha256(evaluation);

check('PAYLOAD_POSITIVE', () => {
  assert.deepEqual(
    verifyPolicyEvaluationPayload(evaluation),
    {
      state: STATE.VALID,
      reason: 'POLICY_EVALUATION_PAYLOAD_SHA256_VERIFIED'
    }
  );
});

check('PAYLOAD_MISMATCH', () => {
  assert.deepEqual(
    verifyPolicyEvaluationPayload({
      ...evaluation,
      state: 'PASS'
    }),
    {
      state: STATE.INVALID,
      reason: 'POLICY_EVALUATION_PAYLOAD_SHA256_MISMATCH'
    }
  );
});

check('GENEALOGY_HASH_IS_BOUND', () => {
  assert.equal(
    verifyPolicyEvaluationPayload({
      ...evaluation,
      genealogy: {
        ...evaluation.genealogy,
        hash: 'b'.repeat(64)
      }
    }).state,
    STATE.INVALID
  );
});

check('TOP_LEVEL_PAYLOAD_HASH_IS_EXCLUDED', () => {
  assert.equal(
    computePayloadSha256({
      ...evaluation,
      payload_sha256: 'f'.repeat(64)
    }),
    evaluation.payload_sha256
  );
});

check('NESTED_PAYLOAD_HASH_IS_NOT_EXCLUDED', () => {
  assert.notEqual(
    computePayloadSha256({
      ...evaluation,
      nested: { payload_sha256: 'f'.repeat(64) }
    }),
    evaluation.payload_sha256
  );
});

check('MALFORMED_DECLARED_HASH', () => {
  assert.equal(
    verifyPolicyEvaluationPayload({
      ...evaluation,
      payload_sha256: 'INVALID'
    }).state,
    STATE.INVALID
  );
});

check('INDEPENDENT_SHA256_VECTOR', () => {
  const { createHash } = require('node:crypto');

  const expected = createHash('sha256')
    .update('{"a":1,"z":2}', 'utf8')
    .digest('hex');

  assert.equal(
    expected,
    '99168216144c7fed5d4c54916cf98d9c66096280c04a499822a99b6658bd177a'
  );

  assert.equal(
    canonicalJson({ z: 2, a: 1 }),
    '{"a":1,"z":2}'
  );
});

check('REJECT_SPARSE_ARRAY', () => {
  const value = [];
  value.length = 1;
  assert.throws(() => canonicalJson(value), /SPARSE_ARRAY/);
});

check('REJECT_SYMBOL_KEY', () => {
  const value = { visible: true };
  value[Symbol('hidden')] = 'hidden';
  assert.throws(() => canonicalJson(value), /NON_JSON_OBJECT_PROPERTY/);
});

check('REJECT_NEGATIVE_ZERO', () => {
  assert.throws(() => canonicalJson(-0), /NON_CANONICAL_NUMBER/);
});

check('REJECT_LONE_SURROGATE', () => {
  assert.throws(() => canonicalJson(String.fromCharCode(0xD800)), /NON_CANONICAL_UNICODE/);
});


check('REJECT_TOP_LEVEL_NON_ENUMERABLE', () => {
  const value = { payload_sha256: '0'.repeat(64) };
  Object.defineProperty(value, 'hidden', { value: 'not-bound' });
  assert.throws(
    () => computePayloadSha256(value),
    /NON_JSON_OBJECT_PROPERTY/
  );
});

check('REJECT_TOP_LEVEL_SYMBOL_KEY', () => {
  const value = { payload_sha256: '0'.repeat(64) };
  value[Symbol('hidden')] = 'not-bound';
  assert.throws(
    () => computePayloadSha256(value),
    /NON_JSON_OBJECT_PROPERTY/
  );
});

check('REJECT_TOP_LEVEL_GETTER_WITHOUT_EXECUTION', () => {
  let reads = 0;
  const value = { payload_sha256: '0'.repeat(64) };

  Object.defineProperty(value, 'field', {
    enumerable: true,
    get() {
      reads += 1;
      return 1;
    }
  });

  assert.throws(
    () => computePayloadSha256(value),
    /NON_JSON_OBJECT_PROPERTY/
  );
  assert.equal(reads, 0);
});

check('REJECT_NESTED_GETTER_WITHOUT_EXECUTION', () => {
  let reads = 0;
  const value = {
    payload_sha256: '0'.repeat(64),
    child: {}
  };

  Object.defineProperty(value.child, 'field', {
    enumerable: true,
    get() {
      reads += 1;
      return 1;
    }
  });

  assert.throws(
    () => computePayloadSha256(value),
    /NON_JSON_OBJECT_PROPERTY/
  );
  assert.equal(reads, 0);
});

console.log(`SF_072A_PAYLOAD_VECTORS=${passed}/18 PASS`);
