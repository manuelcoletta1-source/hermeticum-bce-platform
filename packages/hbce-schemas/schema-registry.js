const fs = require('node:fs');
const { sha256Digest } = require('../hbce-core/canonical-json.js');

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

function assertNonEmptyString(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${fieldName} must be a non-empty string`);
  }
}

function extractSchemaVersionConst(schema) {
  return schema
    && schema.properties
    && schema.properties.schema_version
    && schema.properties.schema_version.const;
}

function normalizeSchemaRecord(record) {
  if (!isPlainObject(record)) {
    throw new TypeError('schema record must be a plain object');
  }

  const {
    schema_id,
    schema_version,
    schema,
    status = 'P0_DRAFT',
    source = 'local'
  } = record;

  assertNonEmptyString(schema_id, 'schema_id');
  assertNonEmptyString(schema_version, 'schema_version');
  assertNonEmptyString(status, 'status');
  assertNonEmptyString(source, 'source');

  if (!isPlainObject(schema)) {
    throw new TypeError('schema must be a plain JSON object');
  }

  const embeddedVersion = extractSchemaVersionConst(schema);
  if (embeddedVersion !== undefined && embeddedVersion !== schema_version) {
    throw new Error(`schema_version mismatch: record=${schema_version} embedded=${embeddedVersion}`);
  }

  const normalizedSchema = deepCloneJson(schema);
  const schema_hash = sha256Digest(normalizedSchema);
  const registry_key = `${schema_id}@${schema_version}`;

  return deepFreeze({
    schema_id,
    schema_version,
    registry_key,
    schema_hash,
    status,
    source,
    schema: normalizedSchema
  });
}

function loadSchemaFile(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function createSchemaRegistry(records = []) {
  if (!Array.isArray(records)) {
    throw new TypeError('records must be an array');
  }

  const byKey = new Map();
  const byHash = new Map();

  function register(record) {
    const normalized = normalizeSchemaRecord(record);

    if (byKey.has(normalized.registry_key)) {
      throw new Error(`duplicate schema registry key: ${normalized.registry_key}`);
    }

    byKey.set(normalized.registry_key, normalized);
    byHash.set(normalized.schema_hash, normalized);

    return normalized;
  }

  for (const record of records) {
    register(record);
  }

  function getSchemaRecord(schema_id, schema_version) {
    assertNonEmptyString(schema_id, 'schema_id');
    assertNonEmptyString(schema_version, 'schema_version');

    return byKey.get(`${schema_id}@${schema_version}`) || null;
  }

  function requireSchemaRecord(schema_id, schema_version) {
    const record = getSchemaRecord(schema_id, schema_version);

    if (!record) {
      throw new Error(`unknown schema: ${schema_id}@${schema_version}`);
    }

    return record;
  }

  function getSchemaHash(schema_id, schema_version) {
    return requireSchemaRecord(schema_id, schema_version).schema_hash;
  }

  function hasSchemaHash(schema_hash) {
    assertNonEmptyString(schema_hash, 'schema_hash');
    return byHash.has(schema_hash);
  }

  function listSchemas() {
    return Array.from(byKey.values())
      .map((record) => ({
        schema_id: record.schema_id,
        schema_version: record.schema_version,
        registry_key: record.registry_key,
        schema_hash: record.schema_hash,
        status: record.status,
        source: record.source
      }))
      .sort((left, right) => left.registry_key.localeCompare(right.registry_key));
  }

  return Object.freeze({
    register,
    getSchemaRecord,
    requireSchemaRecord,
    getSchemaHash,
    hasSchemaHash,
    listSchemas
  });
}

module.exports = {
  createSchemaRegistry,
  loadSchemaFile,
  normalizeSchemaRecord
};
