const { sha256Digest } = require('../hbce-core/canonical-json.js');
const { createSchemaRegistry } = require('../hbce-schemas/schema-registry.js');
const requestEnvelopeSchema = require('../hbce-schemas/request-envelope.v1.schema.json');
const { failClosed } = require('./errors.js');

const REQUEST_ENVELOPE_SCHEMA_ID = 'hbce.p0.request-envelope';
const REQUEST_ENVELOPE_SCHEMA_VERSION = 'hbce.p0.request-envelope.v1';

const REQUEST_ENVELOPE_SCHEMA_RECORD = createSchemaRegistry([
  {
    schema_id: REQUEST_ENVELOPE_SCHEMA_ID,
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    source: 'packages/hbce-schemas/request-envelope.v1.schema.json',
    schema: requestEnvelopeSchema
  }
]).requireSchemaRecord(REQUEST_ENVELOPE_SCHEMA_ID, REQUEST_ENVELOPE_SCHEMA_VERSION);

const DIGEST_RE = /^sha256:[a-f0-9]{64}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/;
const IDEMPOTENCY_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{15,199}$/;
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
    failClosed('REQUEST_ENVELOPE_NOT_OBJECT', `${path} must be a plain object`, { path });
  }
}

function assertAllowedKeys(value, allowedKeys, path) {
  const allowed = new Set(allowedKeys);

  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      failClosed('REQUEST_ENVELOPE_ADDITIONAL_PROPERTY', `${path}.${key} is not allowed`, { path, key });
    }
  }

  for (const key of allowedKeys) {
    if (!(key in value)) {
      failClosed('REQUEST_ENVELOPE_REQUIRED_FIELD_MISSING', `${path}.${key} is required`, { path, key });
    }
  }
}

function assertString(value, path) {
  if (typeof value !== 'string' || value.trim() === '') {
    failClosed('REQUEST_ENVELOPE_STRING_INVALID', `${path} must be a non-empty string`, { path });
  }
}

function assertPattern(value, pattern, code, path) {
  assertString(value, path);

  if (!pattern.test(value)) {
    failClosed(code, `${path} has invalid format`, { path });
  }
}

function assertEnum(value, allowed, path) {
  assertString(value, path);

  if (!allowed.includes(value)) {
    failClosed('REQUEST_ENVELOPE_ENUM_INVALID', `${path} is not an allowed value`, {
      path,
      allowed
    });
  }
}

function assertDigest(value, path) {
  assertPattern(value, DIGEST_RE, 'REQUEST_ENVELOPE_DIGEST_INVALID', path);
}

function assertIsoUtc(value, path) {
  assertPattern(value, ISO_UTC_RE, 'REQUEST_ENVELOPE_TIMESTAMP_INVALID', path);

  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    failClosed('REQUEST_ENVELOPE_TIMESTAMP_INVALID', `${path} is not parseable`, { path });
  }
}

function normalizeActorRef(actor_ref) {
  assertPlainObject(actor_ref, 'actor_ref');
  assertAllowedKeys(actor_ref, ['actor_id', 'actor_type', 'session_id'], 'actor_ref');

  assertPattern(actor_ref.actor_id, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'actor_ref.actor_id');
  assertEnum(actor_ref.actor_type, ['human', 'service', 'ai_agent'], 'actor_ref.actor_type');
  assertPattern(actor_ref.session_id, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'actor_ref.session_id');

  return {
    actor_id: actor_ref.actor_id,
    actor_type: actor_ref.actor_type,
    session_id: actor_ref.session_id
  };
}

function normalizeAuthorityRef(authority_ref) {
  assertPlainObject(authority_ref, 'authority_ref');
  assertAllowedKeys(authority_ref, ['authority_id', 'authority_version', 'authority_hash'], 'authority_ref');

  assertPattern(authority_ref.authority_id, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'authority_ref.authority_id');
  assertPattern(authority_ref.authority_version, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'authority_ref.authority_version');
  assertDigest(authority_ref.authority_hash, 'authority_ref.authority_hash');

  return {
    authority_id: authority_ref.authority_id,
    authority_version: authority_ref.authority_version,
    authority_hash: authority_ref.authority_hash
  };
}

function normalizeActionBinding(action_binding) {
  assertPlainObject(action_binding, 'action_binding');
  assertAllowedKeys(action_binding, ['action_id', 'action_class', 'action_version', 'action_hash'], 'action_binding');

  assertPattern(action_binding.action_id, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'action_binding.action_id');
  assertEnum(
    action_binding.action_class,
    ['AI_TOOL_ACCESS', 'BANK_CRITICAL_ACTION', 'P0_TEST_ACTION'],
    'action_binding.action_class'
  );
  assertPattern(action_binding.action_version, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'action_binding.action_version');
  assertDigest(action_binding.action_hash, 'action_binding.action_hash');

  return {
    action_id: action_binding.action_id,
    action_class: action_binding.action_class,
    action_version: action_binding.action_version,
    action_hash: action_binding.action_hash
  };
}

function normalizeTargetRef(target_ref) {
  assertPlainObject(target_ref, 'target_ref');
  assertAllowedKeys(target_ref, ['target_id', 'target_type'], 'target_ref');

  assertPattern(target_ref.target_id, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'target_ref.target_id');
  assertPattern(target_ref.target_type, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'target_ref.target_type');

  return {
    target_id: target_ref.target_id,
    target_type: target_ref.target_type
  };
}

function normalizeRequestEnvelope(input) {
  assertPlainObject(input, 'RequestEnvelope');

  assertAllowedKeys(
    input,
    [
      'schema_version',
      'request_id',
      'idempotency_key',
      'created_at',
      'actor_ref',
      'authority_ref',
      'action_binding',
      'target_ref',
      'request_payload_hash'
    ],
    'RequestEnvelope'
  );

  if (input.schema_version !== REQUEST_ENVELOPE_SCHEMA_VERSION) {
    failClosed('REQUEST_ENVELOPE_SCHEMA_VERSION_INVALID', 'unsupported RequestEnvelope schema_version', {
      expected: REQUEST_ENVELOPE_SCHEMA_VERSION,
      actual: input.schema_version
    });
  }

  assertPattern(input.request_id, ID_RE, 'REQUEST_ENVELOPE_ID_INVALID', 'request_id');
  assertPattern(input.idempotency_key, IDEMPOTENCY_RE, 'REQUEST_ENVELOPE_IDEMPOTENCY_KEY_INVALID', 'idempotency_key');
  assertIsoUtc(input.created_at, 'created_at');
  assertDigest(input.request_payload_hash, 'request_payload_hash');

  return deepFreeze({
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: input.request_id,
    idempotency_key: input.idempotency_key,
    created_at: input.created_at,
    actor_ref: normalizeActorRef(input.actor_ref),
    authority_ref: normalizeAuthorityRef(input.authority_ref),
    action_binding: normalizeActionBinding(input.action_binding),
    target_ref: normalizeTargetRef(input.target_ref),
    request_payload_hash: input.request_payload_hash
  });
}

function computeRequestEnvelopeHash(input) {
  return sha256Digest(normalizeRequestEnvelope(input));
}

function enrichRequestEnvelope(input) {
  const normalized = normalizeRequestEnvelope(input);
  const request_hash = sha256Digest(normalized);

  return deepFreeze({
    ...deepCloneJson(normalized),
    schema_hash: REQUEST_ENVELOPE_SCHEMA_RECORD.schema_hash,
    request_hash
  });
}

function assertIdempotencyKeyBinding(previousEnvelope, nextEnvelope) {
  const previous = enrichRequestEnvelope(previousEnvelope);
  const next = enrichRequestEnvelope(nextEnvelope);

  if (previous.idempotency_key !== next.idempotency_key) {
    return deepFreeze({
      idempotency_key: next.idempotency_key,
      status: 'NEW_IDEMPOTENCY_KEY'
    });
  }

  if (previous.request_hash !== next.request_hash) {
    failClosed('REQUEST_ENVELOPE_IDEMPOTENCY_CONFLICT', 'idempotency_key cannot bind to two different request hashes', {
      idempotency_key: next.idempotency_key,
      previous_request_hash: previous.request_hash,
      next_request_hash: next.request_hash
    });
  }

  return deepFreeze({
    idempotency_key: next.idempotency_key,
    status: 'IDEMPOTENT_REPLAY',
    request_hash: next.request_hash
  });
}

module.exports = {
  REQUEST_ENVELOPE_SCHEMA_ID,
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  REQUEST_ENVELOPE_SCHEMA_RECORD,
  normalizeRequestEnvelope,
  computeRequestEnvelopeHash,
  enrichRequestEnvelope,
  assertIdempotencyKeyBinding
};
