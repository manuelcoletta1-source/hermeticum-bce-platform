const assert = require('node:assert/strict');
const { sha256Digest } = require('../..//packages/hbce-core/canonical-json.js');
const {
  REQUEST_ENVELOPE_SCHEMA_ID,
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  REQUEST_ENVELOPE_SCHEMA_RECORD,
  normalizeRequestEnvelope,
  computeRequestEnvelopeHash,
  enrichRequestEnvelope,
  assertIdempotencyKeyBinding
} = require('../../packages/hbce-api-contract/request-envelope.js');
const { HBCEValidationError } = require('../../packages/hbce-api-contract/errors.js');

const payloadHash = sha256Digest({
  tool: 'hbce.demo.transfer-preview',
  amount: '100.00',
  currency: 'EUR'
});

const authorityHash = sha256Digest({
  authority_id: 'authority.demo.human-approval',
  scope: 'p0-demo'
});

const actionHash = sha256Digest({
  action_id: 'action.demo.ai-tool-access',
  action_class: 'AI_TOOL_ACCESS'
});

function baseEnvelope() {
  return {
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'req_demo_20260924_0001',
    idempotency_key: 'idem_demo_20260924_0001',
    created_at: '2026-09-24T10:30:00.000Z',
    actor_ref: {
      actor_id: 'actor.manuel',
      actor_type: 'human',
      session_id: 'session.demo.0001'
    },
    authority_ref: {
      authority_id: 'authority.demo.human-approval',
      authority_version: 'v1',
      authority_hash: authorityHash
    },
    action_binding: {
      action_id: 'action.demo.ai-tool-access',
      action_class: 'AI_TOOL_ACCESS',
      action_version: 'v1',
      action_hash: actionHash
    },
    target_ref: {
      target_id: 'target.demo.local-tool',
      target_type: 'tool'
    },
    request_payload_hash: payloadHash
  };
}

const envelope = baseEnvelope();
const normalized = normalizeRequestEnvelope(envelope);

assert.equal(normalized.schema_version, REQUEST_ENVELOPE_SCHEMA_VERSION);
assert.equal(normalized.request_payload_hash, payloadHash);
assert.equal(REQUEST_ENVELOPE_SCHEMA_ID, 'hbce.p0.request-envelope');
assert.equal(REQUEST_ENVELOPE_SCHEMA_RECORD.schema_id, REQUEST_ENVELOPE_SCHEMA_ID);
assert.equal(REQUEST_ENVELOPE_SCHEMA_RECORD.schema_version, REQUEST_ENVELOPE_SCHEMA_VERSION);
assert.match(REQUEST_ENVELOPE_SCHEMA_RECORD.schema_hash, /^sha256:[a-f0-9]{64}$/);

const enriched = enrichRequestEnvelope(envelope);
assert.equal(enriched.schema_hash, REQUEST_ENVELOPE_SCHEMA_RECORD.schema_hash);
assert.match(enriched.request_hash, /^sha256:[a-f0-9]{64}$/);
assert.equal(enriched.request_hash, computeRequestEnvelopeHash(envelope));

const reorderedEnvelope = {
  request_payload_hash: payloadHash,
  target_ref: {
    target_type: 'tool',
    target_id: 'target.demo.local-tool'
  },
  action_binding: {
    action_hash: actionHash,
    action_version: 'v1',
    action_class: 'AI_TOOL_ACCESS',
    action_id: 'action.demo.ai-tool-access'
  },
  authority_ref: {
    authority_hash: authorityHash,
    authority_version: 'v1',
    authority_id: 'authority.demo.human-approval'
  },
  actor_ref: {
    session_id: 'session.demo.0001',
    actor_type: 'human',
    actor_id: 'actor.manuel'
  },
  created_at: '2026-09-24T10:30:00.000Z',
  idempotency_key: 'idem_demo_20260924_0001',
  request_id: 'req_demo_20260924_0001',
  schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION
};

assert.equal(computeRequestEnvelopeHash(envelope), computeRequestEnvelopeHash(reorderedEnvelope));

assert.deepEqual(assertIdempotencyKeyBinding(envelope, reorderedEnvelope), {
  idempotency_key: 'idem_demo_20260924_0001',
  status: 'IDEMPOTENT_REPLAY',
  request_hash: computeRequestEnvelopeHash(envelope)
});

const nextIdempotency = {
  ...baseEnvelope(),
  idempotency_key: 'idem_demo_20260924_0002',
  request_id: 'req_demo_20260924_0002'
};

assert.deepEqual(assertIdempotencyKeyBinding(envelope, nextIdempotency), {
  idempotency_key: 'idem_demo_20260924_0002',
  status: 'NEW_IDEMPOTENCY_KEY'
});

const conflictingReplay = {
  ...baseEnvelope(),
  request_payload_hash: sha256Digest({ tool: 'hbce.demo.transfer-preview', amount: '999.00', currency: 'EUR' })
};

assert.throws(
  () => assertIdempotencyKeyBinding(envelope, conflictingReplay),
  (error) => error instanceof HBCEValidationError && error.code === 'REQUEST_ENVELOPE_IDEMPOTENCY_CONFLICT'
);

assert.throws(
  () => normalizeRequestEnvelope({ ...baseEnvelope(), schema_version: 'hbce.p0.request-envelope.v2' }),
  /unsupported RequestEnvelope schema_version/
);

assert.throws(
  () => normalizeRequestEnvelope({ ...baseEnvelope(), request_payload_hash: 'sha256:BAD' }),
  /request_payload_hash has invalid format/
);

assert.throws(
  () => normalizeRequestEnvelope({ ...baseEnvelope(), created_at: '2026-09-24 10:30:00' }),
  /created_at has invalid format/
);

assert.throws(
  () => normalizeRequestEnvelope({
    ...baseEnvelope(),
    actor_ref: {
      ...baseEnvelope().actor_ref,
      actor_type: 'robot-overlord'
    }
  }),
  /actor_ref.actor_type is not an allowed value/
);

assert.throws(
  () => normalizeRequestEnvelope({
    ...baseEnvelope(),
    unexpected: true
  }),
  /RequestEnvelope.unexpected is not allowed/
);

assert.throws(
  () => normalizeRequestEnvelope({
    ...baseEnvelope(),
    authority_ref: {
      ...baseEnvelope().authority_ref,
      extra: 'nope'
    }
  }),
  /authority_ref.extra is not allowed/
);

console.log('PASS PROG-004-REQUEST-ENVELOPE-NORMALIZES');
console.log('PASS PROG-004-REQUEST-ENVELOPE-STABLE-HASH');
console.log('PASS PROG-004-IDEMPOTENCY-FAIL-CLOSED');
console.log('PASS PROG-004-MALFORMED-REQUESTS-FAIL-CLOSED');
