const assert = require('node:assert/strict');
const {
  canonicalizeJson,
  sha256Hex,
  sha256Digest
} = require('../../packages/hbce-core/canonical-json.js');

const left = {
  zeta: true,
  alpha: 'HBCE',
  nested: {
    b: 2,
    a: 1
  },
  list: [
    { y: 'second', x: 'first' },
    false,
    null
  ]
};

const right = {
  list: [
    { x: 'first', y: 'second' },
    false,
    null
  ],
  nested: {
    a: 1,
    b: 2
  },
  alpha: 'HBCE',
  zeta: true
};

const expectedCanonical = '{"alpha":"HBCE","list":[{"x":"first","y":"second"},false,null],"nested":{"a":1,"b":2},"zeta":true}';

assert.equal(canonicalizeJson(left), expectedCanonical);
assert.equal(canonicalizeJson(right), expectedCanonical);

assert.equal(sha256Hex(left), sha256Hex(right));
assert.equal(sha256Digest(left), sha256Digest(right));
assert.match(sha256Digest(left), /^sha256:[a-f0-9]{64}$/);

const altered = {
  ...right,
  nested: {
    ...right.nested,
    b: 3
  }
};

assert.notEqual(sha256Digest(left), sha256Digest(altered));

assert.throws(() => canonicalizeJson({ bad: undefined }), /unsupported JSON value type/);
assert.throws(() => canonicalizeJson({ bad: Number.NaN }), /non-finite number/);
assert.throws(() => canonicalizeJson({ bad: Infinity }), /non-finite number/);
assert.throws(() => canonicalizeJson({ bad: BigInt(1) }), /unsupported JSON value type/);
assert.throws(() => canonicalizeJson(new Date('2026-09-24T00:00:00Z')), /only plain JSON objects/);

const sparse = [];
sparse[1] = 'hole';
assert.throws(() => canonicalizeJson(sparse), /sparse arrays are not allowed/);

console.log('PASS PROG-002-CANONICAL-JSON-STABLE-ORDER');
console.log('PASS PROG-002-SHA256-DIGEST-STABLE');
console.log('PASS PROG-002-CANONICAL-JSON-FAIL-CLOSED');
