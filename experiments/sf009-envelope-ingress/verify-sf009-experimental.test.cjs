'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  verifySf009Experimental
} = require('./verify-sf009-experimental.cjs');

const dir = __dirname;

function fixture(name) {
  return fs.readFileSync(path.join(dir, name));
}

test('accepts schema-valid fixture with matching experimental digest', () => {
  const result = verifySf009Experimental(
    fixture('sf009-synthetic-digest-experimental.json')
  );

  assert.deepEqual(result, {
    state: 'VALID',
    reason: 'SF009_EXPERIMENTAL_DIGEST_VERIFIED'
  });
});

test('rejects schema-valid fixture with placeholder digest', () => {
  const result = verifySf009Experimental(
    fixture('sf009-synthetic-unverified.json')
  );

  assert.deepEqual(result, {
    state: 'INVALID',
    reason: 'SF009_EXPERIMENTAL_DIGEST_MISMATCH'
  });
});

test('rejects JavaScript object input at the byte boundary', () => {
  const result = verifySf009Experimental({ payload_sha256: '0'.repeat(64) });

  assert.deepEqual(result, {
    state: 'INVALID',
    reason: 'SF009_EXPERIMENTAL_INGRESS_INVALID'
  });
});

test('rejects malformed UTF-8 at the byte boundary', () => {
  const result = verifySf009Experimental(Buffer.from([0x80]));

  assert.deepEqual(result, {
    state: 'INVALID',
    reason: 'SF009_EXPERIMENTAL_INGRESS_INVALID'
  });
});

test('rejects duplicate JSON member names', () => {
  const result = verifySf009Experimental(
    Buffer.from('{"a":1,"a":2}', 'utf8')
  );

  assert.deepEqual(result, {
    state: 'INVALID',
    reason: 'SF009_EXPERIMENTAL_INGRESS_INVALID'
  });
});
