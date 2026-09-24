const crypto = require('node:crypto');

function assertJsonCompatible(value, path = '$') {
  if (value === null) return;

  const kind = typeof value;

  if (kind === 'string' || kind === 'boolean') return;

  if (kind === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError(`${path}: non-finite number is not JSON-compatible`);
    }
    return;
  }

  if (kind === 'undefined' || kind === 'function' || kind === 'symbol' || kind === 'bigint') {
    throw new TypeError(`${path}: unsupported JSON value type: ${kind}`);
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      if (!(index in value)) {
        throw new TypeError(`${path}[${index}]: sparse arrays are not allowed`);
      }
      assertJsonCompatible(value[index], `${path}[${index}]`);
    }
    return;
  }

  if (kind === 'object') {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
      throw new TypeError(`${path}: only plain JSON objects are allowed`);
    }

    for (const key of Object.keys(value)) {
      assertJsonCompatible(value[key], `${path}.${key}`);
    }

    return;
  }

  throw new TypeError(`${path}: unsupported value`);
}

function canonicalizeJson(value) {
  assertJsonCompatible(value);

  if (value === null) return 'null';

  const kind = typeof value;

  if (kind === 'string' || kind === 'number' || kind === 'boolean') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalizeJson(item)).join(',')}]`;
  }

  const keys = Object.keys(value).sort();

  const body = keys
    .map((key) => `${JSON.stringify(key)}:${canonicalizeJson(value[key])}`)
    .join(',');

  return `{${body}}`;
}

function sha256Hex(value) {
  return crypto
    .createHash('sha256')
    .update(canonicalizeJson(value), 'utf8')
    .digest('hex');
}

function sha256Digest(value) {
  return `sha256:${sha256Hex(value)}`;
}

module.exports = {
  canonicalizeJson,
  sha256Hex,
  sha256Digest
};
