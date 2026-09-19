'use strict';

const { createHash } = require('node:crypto');

const STATE = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID'
});

function result(state, reason) {
  return Object.freeze({ state, reason });
}

function canonicalJson(value) {
  if (value === null) return 'null';

  if (typeof value === 'string') {
    if (!value.isWellFormed()) throw new TypeError('NON_CANONICAL_UNICODE');
    return JSON.stringify(value);
  }

  if (typeof value === 'boolean') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || Object.is(value, -0)) {
      throw new TypeError('NON_CANONICAL_NUMBER');
    }
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const items = [];

    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) {
        throw new TypeError('SPARSE_ARRAY');
      }

      items.push(canonicalJson(value[index]));
    }

    if (Reflect.ownKeys(value).some((key) =>
      typeof key === 'symbol' ||
      (key !== 'length' &&
        !(typeof key === 'string' &&
          /^(0|[1-9][0-9]*)$/.test(key) &&
          Number(key) < value.length))
    )) {
      throw new TypeError('NON_JSON_ARRAY_PROPERTY');
    }

    return '[' + items.join(',') + ']';
  }

  if (
    typeof value !== 'object' ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    throw new TypeError('NON_JSON_VALUE');
  }

  if (Reflect.ownKeys(value).some((key) =>
    typeof key === 'symbol' ||
    !Object.prototype.propertyIsEnumerable.call(value, key) ||
    !Object.prototype.hasOwnProperty.call(
      Object.getOwnPropertyDescriptor(value, key), 'value'
    )
  )) {
    throw new TypeError('NON_JSON_OBJECT_PROPERTY');
  }

  const keys = Object.keys(value).sort();

  return '{' + keys.map((key) => {
    const nested = value[key];

    if (nested === undefined) {
      throw new TypeError('UNDEFINED_VALUE');
    }

    return JSON.stringify(key) + ':' + canonicalJson(nested);
  }).join(',') + '}';
}

function computePayloadSha256(policyEvaluation) {
  if (
    policyEvaluation === null ||
    typeof policyEvaluation !== 'object' ||
    Array.isArray(policyEvaluation) ||
    Object.getPrototypeOf(policyEvaluation) !== Object.prototype
  ) {
    throw new TypeError('POLICY_EVALUATION_OBJECT_REQUIRED');
  }

  if (!Object.prototype.hasOwnProperty.call(
    policyEvaluation,
    'payload_sha256'
  )) {
    throw new TypeError('PAYLOAD_SHA256_REQUIRED');
  }

  if (Reflect.ownKeys(policyEvaluation).some((key) =>
    typeof key === "symbol" ||
    !Object.prototype.propertyIsEnumerable.call(policyEvaluation, key) ||
    !Object.prototype.hasOwnProperty.call(
      Object.getOwnPropertyDescriptor(policyEvaluation, key), 'value'
    )
  )) {
    throw new TypeError("NON_JSON_OBJECT_PROPERTY");
  }

  const payload = {};

  for (const key of Object.keys(policyEvaluation)) {
    if (key !== 'payload_sha256') {
      Object.defineProperty(payload, key, {
        value: policyEvaluation[key],
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
  }

  const canonical = canonicalJson(payload);

  return createHash('sha256')
    .update(canonical, 'utf8')
    .digest('hex');
}

function verifyPolicyEvaluationPayload(policyEvaluation) {
  if (
    policyEvaluation === null ||
    typeof policyEvaluation !== 'object' ||
    Array.isArray(policyEvaluation) ||
    typeof policyEvaluation.payload_sha256 !== 'string' ||
    !/^[a-f0-9]{64}$/.test(policyEvaluation.payload_sha256)
  ) {
    return result(STATE.INVALID, 'POLICY_EVALUATION_PAYLOAD_SHA256_INVALID');
  }

  let computed;

  try {
    computed = computePayloadSha256(policyEvaluation);
  } catch {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_PAYLOAD_CANONICALIZATION_INVALID'
    );
  }

  if (computed !== policyEvaluation.payload_sha256) {
    return result(
      STATE.INVALID,
      'POLICY_EVALUATION_PAYLOAD_SHA256_MISMATCH'
    );
  }

  return result(
    STATE.VALID,
    'POLICY_EVALUATION_PAYLOAD_SHA256_VERIFIED'
  );
}

module.exports = Object.freeze({
  STATE,
  canonicalJson,
  computePayloadSha256,
  verifyPolicyEvaluationPayload
});
