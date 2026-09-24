'use strict';

const { sha256Digest } = require('../hbce-core/canonical-json.js');
const { failClosed } = require('../hbce-api-contract/errors.js');

const EVENT_CHAIN_STATE = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID'
});

const EVENT_TYPE = Object.freeze({
  CRITICAL_ACTION_CREATED: 'CRITICAL_ACTION_CREATED',
  PRECOMMIT_RECORD: 'PRECOMMIT_RECORD',
  FAIL_CLOSED: 'FAIL_CLOSED'
});

const DIGEST_RE = /^sha256:[a-f0-9]{64}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,159}$/;
const EVENT_TYPE_RE = /^[A-Z0-9_:.-]{3,100}$/;
const ISO_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);

    for (const key of Object.keys(value)) {
      deepFreeze(value[key]);
    }
  }

  return value;
}

function assertPlainObject(value, path) {
  if (!isPlainObject(value)) {
    failClosed('EVENT_CHAIN_OBJECT_INVALID', `${path} must be a plain object`, { path });
  }
}

function assertPattern(value, pattern, code, path) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    failClosed(code, `${path} has invalid format`, { path });
  }
}

function assertDigest(value, path) {
  assertPattern(value, DIGEST_RE, 'EVENT_CHAIN_DIGEST_INVALID', path);
}

function assertTimestamp(value, path) {
  assertPattern(value, ISO_UTC_RE, 'EVENT_CHAIN_TIMESTAMP_INVALID', path);

  if (Number.isNaN(Date.parse(value))) {
    failClosed('EVENT_CHAIN_TIMESTAMP_INVALID', `${path} is not parseable`, { path });
  }
}

function assertId(value, path) {
  assertPattern(value, ID_RE, 'EVENT_CHAIN_ID_INVALID', path);
}

function computeEventHash(eventWithoutHash) {
  return sha256Digest(eventWithoutHash);
}

function computeChainHash(chainWithoutHash) {
  return sha256Digest(chainWithoutHash);
}

function attachChainHash(body) {
  const copy = deepCloneJson(body);
  delete copy.chain_hash;

  return deepFreeze({
    ...body,
    chain_hash: computeChainHash(copy)
  });
}

function createEventChain(input) {
  const context = input && typeof input === 'object' ? input : {};

  assertId(context.chain_id, 'chain_id');
  assertTimestamp(context.created_at, 'created_at');
  assertDigest(context.request_hash, 'request_hash');
  assertDigest(context.subject_hash, 'subject_hash');

  const body = {
    proto: 'HBCE-P0-EVENT-CHAIN-v1',
    kind: 'HBCE_P0_EVENT_CHAIN',
    version: 'v1',
    chain_id: context.chain_id,
    created_at: context.created_at,
    updated_at: context.created_at,
    request_hash: context.request_hash,
    subject_type: context.subject_type || 'CRITICAL_ACTION',
    subject_hash: context.subject_hash,
    event_count: 0,
    head_event_hash: null,
    dispatch_created: false,
    physical_execution_performed: false,
    events: []
  };

  return attachChainHash(body);
}

function assertEventChainShape(chain) {
  assertPlainObject(chain, 'eventChain');

  if (chain.proto !== 'HBCE-P0-EVENT-CHAIN-v1') {
    failClosed('EVENT_CHAIN_PROTO_INVALID', 'eventChain.proto is invalid');
  }

  if (chain.kind !== 'HBCE_P0_EVENT_CHAIN') {
    failClosed('EVENT_CHAIN_KIND_INVALID', 'eventChain.kind is invalid');
  }

  assertId(chain.chain_id, 'chain_id');
  assertTimestamp(chain.created_at, 'created_at');
  assertTimestamp(chain.updated_at, 'updated_at');
  assertDigest(chain.request_hash, 'request_hash');
  assertDigest(chain.subject_hash, 'subject_hash');
  assertDigest(chain.chain_hash, 'chain_hash');

  if (!Array.isArray(chain.events)) {
    failClosed('EVENT_CHAIN_EVENTS_INVALID', 'eventChain.events must be an array');
  }

  if (!Number.isInteger(chain.event_count) || chain.event_count !== chain.events.length) {
    failClosed('EVENT_CHAIN_EVENT_COUNT_INVALID', 'event_count must match events.length');
  }

  if (chain.dispatch_created !== false || chain.physical_execution_performed !== false) {
    failClosed('EVENT_CHAIN_EFFECT_BOUNDARY_INVALID', 'event chain must not create dispatch or physical execution');
  }
}

function normalizeEventDraft(draft) {
  assertPlainObject(draft, 'eventDraft');

  assertId(draft.event_id, 'event_id');
  assertPattern(draft.event_type, EVENT_TYPE_RE, 'EVENT_CHAIN_EVENT_TYPE_INVALID', 'event_type');
  assertTimestamp(draft.occurred_at, 'occurred_at');

  if (draft.payload === undefined) {
    return {
      event_id: draft.event_id,
      event_type: draft.event_type,
      occurred_at: draft.occurred_at,
      payload: {}
    };
  }

  assertPlainObject(draft.payload, 'payload');

  return {
    event_id: draft.event_id,
    event_type: draft.event_type,
    occurred_at: draft.occurred_at,
    payload: deepCloneJson(draft.payload)
  };
}

function createEventRecord(chain, draft, sequence, previousEventHash) {
  const normalizedDraft = normalizeEventDraft(draft);
  const payload_hash = sha256Digest(normalizedDraft.payload);

  const eventBody = {
    proto: 'HBCE-P0-EVENT-v1',
    kind: 'HBCE_P0_EVENT',
    version: 'v1',
    event_id: normalizedDraft.event_id,
    event_type: normalizedDraft.event_type,
    sequence,
    occurred_at: normalizedDraft.occurred_at,
    chain_id: chain.chain_id,
    previous_event_hash: previousEventHash,
    request_hash: chain.request_hash,
    subject_type: chain.subject_type,
    subject_hash: chain.subject_hash,
    payload_hash,
    dispatch_created: false,
    physical_execution_performed: false
  };

  return deepFreeze({
    ...eventBody,
    event_hash: computeEventHash(eventBody)
  });
}

function appendEvent(chainInput, draft) {
  assertEventChainShape(chainInput);

  const chain = deepCloneJson(chainInput);
  const previousEventHash = chain.head_event_hash;

  if (previousEventHash !== null) {
    assertDigest(previousEventHash, 'head_event_hash');
  }

  const nextSequence = chain.event_count + 1;
  const event = createEventRecord(chain, draft, nextSequence, previousEventHash);

  const body = {
    ...chain,
    updated_at: event.occurred_at,
    event_count: nextSequence,
    head_event_hash: event.event_hash,
    dispatch_created: false,
    physical_execution_performed: false,
    events: [
      ...chain.events,
      event
    ]
  };

  return attachChainHash(body);
}

function verifyEventChain(chainInput) {
  assertEventChainShape(chainInput);

  let previousEventHash = null;

  for (let index = 0; index < chainInput.events.length; index += 1) {
    const event = chainInput.events[index];

    assertPlainObject(event, `events[${index}]`);

    if (event.proto !== 'HBCE-P0-EVENT-v1') {
      failClosed('EVENT_CHAIN_EVENT_PROTO_INVALID', 'event.proto is invalid', { index });
    }

    if (event.kind !== 'HBCE_P0_EVENT') {
      failClosed('EVENT_CHAIN_EVENT_KIND_INVALID', 'event.kind is invalid', { index });
    }

    if (event.sequence !== index + 1) {
      failClosed('EVENT_CHAIN_SEQUENCE_INVALID', 'event sequence is invalid', { index });
    }

    if (event.previous_event_hash !== previousEventHash) {
      failClosed('EVENT_CHAIN_PREVIOUS_HASH_INVALID', 'event previous hash does not match chain head', {
        index,
        expected: previousEventHash,
        actual: event.previous_event_hash
      });
    }

    if (event.chain_id !== chainInput.chain_id) {
      failClosed('EVENT_CHAIN_EVENT_CHAIN_ID_MISMATCH', 'event.chain_id does not match chain.chain_id', { index });
    }

    if (event.request_hash !== chainInput.request_hash) {
      failClosed('EVENT_CHAIN_EVENT_REQUEST_HASH_MISMATCH', 'event.request_hash does not match chain.request_hash', { index });
    }

    if (event.subject_hash !== chainInput.subject_hash) {
      failClosed('EVENT_CHAIN_EVENT_SUBJECT_HASH_MISMATCH', 'event.subject_hash does not match chain.subject_hash', { index });
    }

    if (event.dispatch_created !== false || event.physical_execution_performed !== false) {
      failClosed('EVENT_CHAIN_EVENT_EFFECT_BOUNDARY_INVALID', 'event must not create dispatch or physical execution', { index });
    }

    assertDigest(event.payload_hash, `events[${index}].payload_hash`);
    assertDigest(event.event_hash, `events[${index}].event_hash`);

    const withoutHash = deepCloneJson(event);
    delete withoutHash.event_hash;

    const recomputed = computeEventHash(withoutHash);

    if (recomputed !== event.event_hash) {
      failClosed('EVENT_CHAIN_EVENT_HASH_MISMATCH', 'event hash mismatch', {
        index,
        expected: recomputed,
        actual: event.event_hash
      });
    }

    previousEventHash = event.event_hash;
  }

  if (chainInput.head_event_hash !== previousEventHash) {
    failClosed('EVENT_CHAIN_HEAD_HASH_INVALID', 'head_event_hash does not match last event hash', {
      expected: previousEventHash,
      actual: chainInput.head_event_hash
    });
  }

  const withoutChainHash = deepCloneJson(chainInput);
  delete withoutChainHash.chain_hash;

  const recomputedChainHash = computeChainHash(withoutChainHash);

  if (recomputedChainHash !== chainInput.chain_hash) {
    failClosed('EVENT_CHAIN_HASH_MISMATCH', 'chain hash mismatch', {
      expected: recomputedChainHash,
      actual: chainInput.chain_hash
    });
  }

  return deepFreeze({
    state: EVENT_CHAIN_STATE.VALID,
    reason: 'EVENT_CHAIN_VALID',
    event_count: chainInput.event_count,
    head_event_hash: chainInput.head_event_hash,
    chain_hash: chainInput.chain_hash
  });
}

module.exports = Object.freeze({
  EVENT_CHAIN_STATE,
  EVENT_TYPE,
  createEventChain,
  appendEvent,
  verifyEventChain
});
