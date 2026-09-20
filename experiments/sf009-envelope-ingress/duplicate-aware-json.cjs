'use strict';

const { parse } = require('@humanwhocodes/momoa');

const MAX_JSON_BYTES = 1024 * 1024;
const MAX_CONTAINER_DEPTH = 64;

function decimalIdentity(token) {
  const match = /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(token);

  if (!match) {
    throw new Error('UNEXPECTED_JSON_NUMBER_TOKEN');
  }

  const fractional = match[3] || '';
  let digits = match[2] + fractional;
  let scale = BigInt(match[4] || '0') - BigInt(fractional.length);

  digits = digits.replace(/^0+/, '');

  if (digits === '') {
    return '0:0:0';
  }

  const trailing = /0+$/.exec(digits);

  if (trailing) {
    digits = digits.slice(0, -trailing[0].length);
    scale += BigInt(trailing[0].length);
  }

  return `${match[1] === '-' ? '-' : '+'}:${digits}:${scale}`;
}

function assertWellFormedUnicode(value) {
  for (let i = 0; i < value.length; i++) {
    const unit = value.charCodeAt(i);

    if (unit >= 0xD800 && unit <= 0xDBFF) {
      const next = value.charCodeAt(i + 1);

      if (!(next >= 0xDC00 && next <= 0xDFFF)) {
        throw new Error('ILL_FORMED_UNICODE_STRING');
      }

      i++;
    } else if (unit >= 0xDC00 && unit <= 0xDFFF) {
      throw new Error('ILL_FORMED_UNICODE_STRING');
    }
  }
}

function rejectDuplicateMembers(node, source, depth = 0) {
  if (!node || typeof node.type !== 'string') {
    throw new Error('UNEXPECTED_JSON_AST_NODE');
  }

  if (node.type === 'Document' || node.type === 'Element') {
    rejectDuplicateMembers(
      node.type === 'Document' ? node.body : node.value,
      source,
      depth
    );
    return;
  }

  if (node.type === 'Object' || node.type === 'Array') {
    const nextDepth = depth + 1;

    if (nextDepth > MAX_CONTAINER_DEPTH) {
      throw new Error('JSON_NESTING_LIMIT_EXCEEDED');
    }

    if (node.type === 'Object') {
      const seen = new Set();

      for (const member of node.members) {
        if (
          !member ||
          member.type !== 'Member' ||
          !member.name ||
          member.name.type !== 'String' ||
          typeof member.name.value !== 'string'
        ) {
          throw new Error('UNEXPECTED_JSON_AST_NODE');
        }

        const name = member.name.value;
        assertWellFormedUnicode(name);

        if (seen.has(name)) {
          throw new Error('DUPLICATE_JSON_MEMBER');
        }

        seen.add(name);
        rejectDuplicateMembers(member.value, source, nextDepth);
      }
    } else {
      for (const element of node.elements) {
        rejectDuplicateMembers(element, source, nextDepth);
      }
    }

    return;
  }

  if (node.type === 'Number') {
    const value = node.value;

    if (
      !Number.isFinite(value) ||
      Object.is(value, -0) ||
      (Number.isInteger(value) && !Number.isSafeInteger(value))
    ) {
      throw new Error('NON_CANONICAL_JSON_NUMBER');
    }

    if (
      !node.loc ||
      !node.loc.start ||
      !node.loc.end ||
      !Number.isInteger(node.loc.start.offset) ||
      !Number.isInteger(node.loc.end.offset)
    ) {
      throw new Error('JSON_NUMBER_LOCATION_REQUIRED');
    }

    const raw = source.slice(
      node.loc.start.offset,
      node.loc.end.offset
    );

    if (decimalIdentity(raw) !== decimalIdentity(String(value))) {
      throw new Error('LOSSY_JSON_NUMBER');
    }

    return;
  }

  if (node.type === 'String') {
    if (typeof node.value !== 'string') {
      throw new Error('UNEXPECTED_JSON_AST_NODE');
    }

    assertWellFormedUnicode(node.value);
    return;
  }

  if (
    node.type === 'Null' ||
    node.type === 'Boolean'
  ) {
    return;
  }

  throw new Error('UNEXPECTED_JSON_AST_NODE');
}

function parseDuplicateAwareJson(source) {
  if (typeof source !== 'string') {
    throw new TypeError('RAW_JSON_STRING_REQUIRED');
  }

  if (Buffer.byteLength(source, 'utf8') > MAX_JSON_BYTES) {
    throw new Error('JSON_SIZE_LIMIT_EXCEEDED');
  }

  const ast = parse(source);
  rejectDuplicateMembers(ast, source);
  return JSON.parse(source);
}

function parseDuplicateAwareUtf8(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError('RAW_UTF8_BYTES_REQUIRED');
  }

  if (bytes.byteLength > MAX_JSON_BYTES) {
    throw new Error('JSON_SIZE_LIMIT_EXCEEDED');
  }

  let source;

  try {
    source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }

    throw new Error('INVALID_UTF8');
  }

  return parseDuplicateAwareJson(source);
}

module.exports = { parseDuplicateAwareJson, parseDuplicateAwareUtf8 };
