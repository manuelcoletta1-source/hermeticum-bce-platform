'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const Ajv2020 = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats');

const {
  parseDuplicateAwareUtf8
} = require('./duplicate-aware-json.cjs');

const {
  canonicalJson
} = require('../../runtime/policy/verify-policy-evaluation-payload.js');

const schema = JSON.parse(fs.readFileSync(
  path.resolve(
    __dirname,
    '../../schemas/hbce-operation-envelope.schema.json'
  ),
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

function verifySf009Experimental(bytes) {
  let envelope;

  try {
    envelope = parseDuplicateAwareUtf8(bytes);
  } catch {
    return {
      state: 'INVALID',
      reason: 'SF009_EXPERIMENTAL_INGRESS_INVALID'
    };
  }

  if (!validate(envelope)) {
    return {
      state: 'INVALID',
      reason: 'SF009_EXPERIMENTAL_SCHEMA_INVALID'
    };
  }

  try {
    const { payload_sha256, ...preimage } = envelope;

    const computed = createHash('sha256')
      .update(canonicalJson(preimage), 'utf8')
      .digest('hex');

    if (computed !== payload_sha256) {
      return {
        state: 'INVALID',
        reason: 'SF009_EXPERIMENTAL_DIGEST_MISMATCH'
      };
    }
  } catch {
    return {
      state: 'INVALID',
      reason: 'SF009_EXPERIMENTAL_CANONICALIZATION_INVALID'
    };
  }

  return {
    state: 'VALID',
    reason: 'SF009_EXPERIMENTAL_DIGEST_VERIFIED'
  };
}

module.exports = { verifySf009Experimental };
