'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { parseDuplicateAwareJson } = require('./duplicate-aware-json.cjs');

test('accepts distinct members', () => {
  assert.deepEqual(parseDuplicateAwareJson('{"a":1,"b":2}'), { a: 1, b: 2 });
});

test('rejects literal duplicate', () => {
  assert.throws(
    () => parseDuplicateAwareJson('{"a":1,"a":2}'),
    /DUPLICATE_JSON_MEMBER/
  );
});

test('rejects decoded Unicode-escape duplicate', () => {
  assert.throws(
    () => parseDuplicateAwareJson('{"operation_id":1,"operation\\u005fid":2}'),
    /DUPLICATE_JSON_MEMBER/
  );
});

test('rejects nested duplicate', () => {
  assert.throws(
    () => parseDuplicateAwareJson('{"outer":{"x":1,"x":2}}'),
    /DUPLICATE_JSON_MEMBER/
  );
});

test('rejects duplicate inside an array element', () => {
  assert.throws(
    () => parseDuplicateAwareJson('[{"x":1,"x":2}]'),
    /DUPLICATE_JSON_MEMBER/
  );
});

test('allows the same name in separate objects', () => {
  assert.deepEqual(
    parseDuplicateAwareJson('[{"x":1},{"x":2}]'),
    [{ x: 1 }, { x: 2 }]
  );
});

test('rejects non-string input', () => {
  assert.throws(
    () => parseDuplicateAwareJson({ a: 1 }),
    /RAW_JSON_STRING_REQUIRED/
  );
});

test('rejects malformed JSON', () => {
  assert.throws(() => parseDuplicateAwareJson('{"a":}'));
});

test('accepts exactly 64 nested containers', () => {
  const source = '['.repeat(64) + 'null' + ']'.repeat(64);
  assert.doesNotThrow(() => parseDuplicateAwareJson(source));
});

test('rejects 65 nested containers', () => {
  const source = '['.repeat(65) + 'null' + ']'.repeat(65);
  assert.throws(
    () => parseDuplicateAwareJson(source),
    /JSON_NESTING_LIMIT_EXCEEDED/
  );
});

test('rejects 65 mixed object and array containers', () => {
  const source = '{"a":'.repeat(33) +
    '['.repeat(32) + 'null' +
    ']'.repeat(32) + '}'.repeat(33);
  assert.throws(
    () => parseDuplicateAwareJson(source),
    /JSON_NESTING_LIMIT_EXCEEDED/
  );
});

test('accepts exactly 1 MiB of UTF-8 JSON', () => {
  const source = '"' + 'a'.repeat(1024 * 1024 - 2) + '"';
  assert.equal(Buffer.byteLength(source, 'utf8'), 1024 * 1024);
  assert.equal(parseDuplicateAwareJson(source).length, 1024 * 1024 - 2);
});

test('rejects 1 MiB plus one byte', () => {
  const source = '"' + 'a'.repeat(1024 * 1024 - 1) + '"';
  assert.equal(Buffer.byteLength(source, 'utf8'), 1024 * 1024 + 1);
  assert.throws(
    () => parseDuplicateAwareJson(source),
    /JSON_SIZE_LIMIT_EXCEEDED/
  );
});

test('measures UTF-8 bytes rather than JavaScript string length', () => {
  const source = '"' + '€'.repeat(350000) + '"';
  assert.ok(source.length < 1024 * 1024);
  assert.ok(Buffer.byteLength(source, 'utf8') > 1024 * 1024);
  assert.throws(
    () => parseDuplicateAwareJson(source),
    /JSON_SIZE_LIMIT_EXCEEDED/
  );
});

test('does not mistake string content for duplicate member names', () => {
  const source = '{"a":"\\"a\\":1","b":"operation_id operation_id"}';
  assert.deepEqual(
    parseDuplicateAwareJson(source),
    { a: '"a":1', b: 'operation_id operation_id' }
  );
});

test('rejects integer above JavaScript safe range', () => {
  assert.throws(
    () => parseDuplicateAwareJson('9007199254740993'),
    /NON_CANONICAL_JSON_NUMBER/
  );
});

test('rejects unsafe integer inside an object', () => {
  assert.throws(
    () => parseDuplicateAwareJson('{"n":9007199254740993}'),
    /NON_CANONICAL_JSON_NUMBER/
  );
});

test('rejects numeric overflow', () => {
  assert.throws(
    () => parseDuplicateAwareJson('{"n":1e400}'),
    /NON_CANONICAL_JSON_NUMBER/
  );
});

test('rejects negative zero', () => {
  assert.throws(
    () => parseDuplicateAwareJson('{"n":-0}'),
    /NON_CANONICAL_JSON_NUMBER/
  );
});

test('accepts a finite decimal', () => {
  assert.deepEqual(
    parseDuplicateAwareJson('{"n":0.1}'),
    { n: 0.1 }
  );
});

test('rejects decimal rounded to integer', () => {
  assert.throws(
    () => parseDuplicateAwareJson('1.0000000000000001'),
    /LOSSY_JSON_NUMBER/
  );
});

test('rejects decimal rounded to another decimal', () => {
  assert.throws(
    () => parseDuplicateAwareJson('0.10000000000000001'),
    /LOSSY_JSON_NUMBER/
  );
});

test('rejects numeric underflow to zero', () => {
  assert.throws(
    () => parseDuplicateAwareJson('1e-400'),
    /LOSSY_JSON_NUMBER/
  );
});

test('rejects decimal rounded to a safe integer', () => {
  assert.throws(
    () => parseDuplicateAwareJson('9007199254740991.1'),
    /LOSSY_JSON_NUMBER/
  );
});

test('accepts a valid Unicode surrogate pair', () => {
  assert.equal(
    parseDuplicateAwareJson('"\\uD83D\\uDE00"'),
    '😀'
  );
});

test('rejects an isolated high surrogate in a value', () => {
  assert.throws(
    () => parseDuplicateAwareJson('"\\uD800"'),
    /ILL_FORMED_UNICODE_STRING/
  );
});

test('rejects an isolated low surrogate in a value', () => {
  assert.throws(
    () => parseDuplicateAwareJson('"\\uDC00"'),
    /ILL_FORMED_UNICODE_STRING/
  );
});

test('rejects an isolated surrogate in a member name', () => {
  assert.throws(
    () => parseDuplicateAwareJson('{"\\uD800":1}'),
    /ILL_FORMED_UNICODE_STRING/
  );
});

test('rejects a literal isolated surrogate in the source', () => {
  assert.throws(
    () => parseDuplicateAwareJson(JSON.stringify('\uD800')),
    /ILL_FORMED_UNICODE_STRING/
  );
});

test('UTF-8 ingress accepts valid ASCII JSON bytes', () => {
  const { parseDuplicateAwareUtf8 } = require('./duplicate-aware-json.cjs');
  assert.deepEqual(
    parseDuplicateAwareUtf8(Buffer.from('{"n":1}', 'utf8')),
    { n: 1 }
  );
});

test('UTF-8 ingress accepts valid multibyte JSON bytes', () => {
  const { parseDuplicateAwareUtf8 } = require('./duplicate-aware-json.cjs');
  assert.deepEqual(
    parseDuplicateAwareUtf8(Buffer.from('{"s":"😀"}', 'utf8')),
    { s: '😀' }
  );
});

for (const [name, bytes] of [
  ['isolated continuation', [0x22, 0x80, 0x22]],
  ['truncated sequence', [0x22, 0xE2, 0x82, 0x22]],
  ['encoded surrogate', [0x22, 0xED, 0xA0, 0x80, 0x22]]
]) {
  test(`UTF-8 ingress rejects ${name}`, () => {
    const { parseDuplicateAwareUtf8 } = require('./duplicate-aware-json.cjs');
    assert.throws(
      () => parseDuplicateAwareUtf8(Buffer.from(bytes)),
      /INVALID_UTF8/
    );
  });
}

test('UTF-8 ingress preserves duplicate-member rejection', () => {
  const { parseDuplicateAwareUtf8 } = require('./duplicate-aware-json.cjs');
  assert.throws(
    () => parseDuplicateAwareUtf8(Buffer.from('{"a":1,"a":2}', 'utf8')),
    /DUPLICATE_JSON_MEMBER/
  );
});
