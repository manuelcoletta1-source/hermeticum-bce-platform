'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const Ajv2020 = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats');

const { parseDuplicateAwareUtf8 } = require('./duplicate-aware-json.cjs');
const { canonicalJson } = require(
  '../../runtime/policy/verify-policy-evaluation-payload.js'
);

const schema = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '../../schemas/hbce-operation-envelope.schema.json'),
  'utf8'
));

const ajv = new Ajv2020({
  strict: true,
  strictTypes: false,
  allErrors: true,
  validateFormats: true
});
addFormats(ajv);
const validate = ajv.compile(schema);

function load(name) {
  return parseDuplicateAwareUtf8(
    fs.readFileSync(path.join(__dirname, name))
  );
}

function experimentalDigest(envelope) {
  assert.ok(Object.hasOwn(envelope, 'payload_sha256'));

  const { payload_sha256, ...preimage } = envelope;

  return createHash('sha256')
    .update(canonicalJson(preimage), 'utf8')
    .digest('hex');
}

function digestMatches(envelope) {
  return experimentalDigest(envelope) === envelope.payload_sha256;
}

test('SF-009 synthetic fixture passes frozen schema', () => {
  const envelope = load('sf009-synthetic-digest-experimental.json');
  assert.equal(validate(envelope), true, JSON.stringify(validate.errors));
});

test('placeholder digest is rejected', () => {
  assert.equal(
    digestMatches(load('sf009-synthetic-unverified.json')),
    false
  );
});

test('experimental digest matches unchanged synthetic fixture', () => {
  const envelope = load('sf009-synthetic-digest-experimental.json');

  assert.equal(
    envelope.payload_sha256,
    '499f9fd7f9e58b7d8f134023c5441e30976f274a4e8fc50c88424ccce3297ea1'
  );
  assert.equal(digestMatches(envelope), true);
});

for (const [name, mutate] of [
  ['identity', envelope => {
    envelope.identity_binding.identity_ref = 'SYNTHETIC-IDENTITY-ALTERED';
  }],
  ['state', envelope => {
    envelope.state = 'IDENTIFIED';
  }],
  ['nested genealogy', envelope => {
    envelope.genealogy.supersedes = 'SYNTHETIC-REFERENCE';
  }]
]) {
  test(`experimental digest rejects altered ${name}`, () => {
    const envelope = load('sf009-synthetic-digest-experimental.json');
    mutate(envelope);
    assert.equal(digestMatches(envelope), false);
  });
}
