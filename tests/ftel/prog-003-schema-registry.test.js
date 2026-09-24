const assert = require('node:assert/strict');
const {
  createSchemaRegistry,
  loadSchemaFile,
  normalizeSchemaRecord
} = require('../../packages/hbce-schemas/schema-registry.js');

const schemaPath = 'tests/ftel/fixtures/prog-003/sample-action.schema.json';
const reorderedSchemaPath = 'tests/ftel/fixtures/prog-003/sample-action-reordered.schema.json';

const schema = loadSchemaFile(schemaPath);
const reorderedSchema = loadSchemaFile(reorderedSchemaPath);

const normalized = normalizeSchemaRecord({
  schema_id: 'hbce.test.sample-action',
  schema_version: 'hbce.test.sample-action.v1',
  source: schemaPath,
  schema
});

assert.equal(normalized.schema_id, 'hbce.test.sample-action');
assert.equal(normalized.schema_version, 'hbce.test.sample-action.v1');
assert.equal(normalized.registry_key, 'hbce.test.sample-action@hbce.test.sample-action.v1');
assert.match(normalized.schema_hash, /^sha256:[a-f0-9]{64}$/);

const reorderedNormalized = normalizeSchemaRecord({
  schema_id: 'hbce.test.sample-action',
  schema_version: 'hbce.test.sample-action.v1',
  source: reorderedSchemaPath,
  schema: reorderedSchema
});

assert.equal(normalized.schema_hash, reorderedNormalized.schema_hash);

const registry = createSchemaRegistry([
  {
    schema_id: 'hbce.test.sample-action',
    schema_version: 'hbce.test.sample-action.v1',
    source: schemaPath,
    schema
  }
]);

assert.equal(
  registry.getSchemaHash('hbce.test.sample-action', 'hbce.test.sample-action.v1'),
  normalized.schema_hash
);

assert.equal(registry.hasSchemaHash(normalized.schema_hash), true);
assert.equal(registry.hasSchemaHash('sha256:' + '0'.repeat(64)), false);

const record = registry.requireSchemaRecord('hbce.test.sample-action', 'hbce.test.sample-action.v1');
assert.equal(record.schema.properties.schema_version.const, 'hbce.test.sample-action.v1');

assert.deepEqual(registry.listSchemas(), [
  {
    schema_id: 'hbce.test.sample-action',
    schema_version: 'hbce.test.sample-action.v1',
    registry_key: 'hbce.test.sample-action@hbce.test.sample-action.v1',
    schema_hash: normalized.schema_hash,
    status: 'P0_DRAFT',
    source: schemaPath
  }
]);

assert.throws(
  () => registry.requireSchemaRecord('hbce.unknown', 'v1'),
  /unknown schema/
);

assert.throws(
  () => createSchemaRegistry([
    {
      schema_id: 'hbce.test.sample-action',
      schema_version: 'hbce.test.sample-action.v1',
      schema
    },
    {
      schema_id: 'hbce.test.sample-action',
      schema_version: 'hbce.test.sample-action.v1',
      schema
    }
  ]),
  /duplicate schema registry key/
);

assert.throws(
  () => normalizeSchemaRecord({
    schema_id: 'hbce.test.sample-action',
    schema_version: 'hbce.test.sample-action.v2',
    schema
  }),
  /schema_version mismatch/
);

assert.throws(
  () => normalizeSchemaRecord({
    schema_id: '',
    schema_version: 'hbce.test.sample-action.v1',
    schema
  }),
  /schema_id must be a non-empty string/
);

console.log('PASS PROG-003-SCHEMA-REGISTRY-LOADS-SCHEMAS');
console.log('PASS PROG-003-SCHEMA-REGISTRY-STABLE-HASHES');
console.log('PASS PROG-003-SCHEMA-REGISTRY-FAIL-CLOSED');
