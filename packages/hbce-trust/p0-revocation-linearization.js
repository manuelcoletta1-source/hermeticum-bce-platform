'use strict';

const { sha256Digest } = require('../hbce-core/canonical-json.js');
const { failClosed } = require('../hbce-api-contract/errors.js');

const REVOCATION_LINEARIZATION_STATE = Object.freeze({
  CLEAR: 'CLEAR',
  REVOKED: 'REVOKED',
  INVALID: 'INVALID'
});

const DIGEST_RE = /^sha256:[a-f0-9]{64}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,159}$/;
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
    failClosed('REVOCATION_OBJECT_INVALID', `${path} must be a plain object`, { path });
  }
}

function assertPattern(value, pattern, code, path) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    failClosed(code, `${path} has invalid format`, { path });
  }
}

function assertId(value, path) {
  assertPattern(value, ID_RE, 'REVOCATION_ID_INVALID', path);
}

function assertDigest(value, path) {
  assertPattern(value, DIGEST_RE, 'REVOCATION_DIGEST_INVALID', path);
}

function assertTimestamp(value, path) {
  assertPattern(value, ISO_UTC_RE, 'REVOCATION_TIMESTAMP_INVALID', path);

  if (Number.isNaN(Date.parse(value))) {
    failClosed('REVOCATION_TIMESTAMP_INVALID', `${path} is not parseable`, { path });
  }
}

function compareIsoUtc(a, b) {
  return Date.parse(a) - Date.parse(b);
}

function assertAuthorityRef(authorityRef) {
  assertPlainObject(authorityRef, 'authority_ref');
  assertId(authorityRef.authority_id, 'authority_ref.authority_id');

  if (
    typeof authorityRef.authority_version !== 'string' ||
    authorityRef.authority_version.length === 0
  ) {
    failClosed('REVOCATION_AUTHORITY_VERSION_INVALID', 'authority_ref.authority_version is invalid');
  }

  assertDigest(authorityRef.authority_hash, 'authority_ref.authority_hash');

  return {
    authority_id: authorityRef.authority_id,
    authority_version: authorityRef.authority_version,
    authority_hash: authorityRef.authority_hash
  };
}

function normalizeRevocationRecord(record, authorityRef, linearizationIndex) {
  assertPlainObject(record, 'revocation');

  assertId(record.revocation_id, 'revocation.revocation_id');
  assertTimestamp(record.issued_at, 'revocation.issued_at');
  assertTimestamp(record.effective_at, 'revocation.effective_at');
  assertTimestamp(record.observed_at, 'revocation.observed_at');
  assertDigest(record.evidence_hash, 'revocation.evidence_hash');

  const recordAuthorityRef = assertAuthorityRef(record.authority_ref);

  if (
    recordAuthorityRef.authority_id !== authorityRef.authority_id ||
    recordAuthorityRef.authority_version !== authorityRef.authority_version ||
    recordAuthorityRef.authority_hash !== authorityRef.authority_hash
  ) {
    failClosed('REVOCATION_AUTHORITY_REF_MISMATCH', 'revocation authority_ref must match ledger authority_ref', {
      revocation_id: record.revocation_id
    });
  }

  if (compareIsoUtc(record.issued_at, record.observed_at) > 0) {
    failClosed('REVOCATION_ISSUED_AFTER_OBSERVED', 'issued_at must not be after observed_at', {
      revocation_id: record.revocation_id
    });
  }

  const body = {
    proto: 'HBCE-P0-REVOCATION-RECORD-v1',
    kind: 'HBCE_P0_REVOCATION_RECORD',
    version: 'v1',
    linearization_index: linearizationIndex,
    revocation_id: record.revocation_id,
    authority_ref: recordAuthorityRef,
    issued_at: record.issued_at,
    effective_at: record.effective_at,
    observed_at: record.observed_at,
    reason: typeof record.reason === 'string' && record.reason.length > 0
      ? record.reason
      : 'UNSPECIFIED_REVOCATION',
    evidence_hash: record.evidence_hash,
    dispatch_created: false,
    physical_execution_performed: false
  };

  return deepFreeze({
    ...body,
    revocation_hash: sha256Digest(body)
  });
}

function sortRevocationInputs(records) {
  return [...records].sort((a, b) => {
    const effectiveDelta = compareIsoUtc(a.effective_at, b.effective_at);
    if (effectiveDelta !== 0) {
      return effectiveDelta;
    }

    const observedDelta = compareIsoUtc(a.observed_at, b.observed_at);
    if (observedDelta !== 0) {
      return observedDelta;
    }

    return String(a.revocation_id).localeCompare(String(b.revocation_id));
  });
}

function attachLedgerHash(body) {
  const copy = deepCloneJson(body);
  delete copy.revocation_ledger_hash;

  return deepFreeze({
    ...body,
    revocation_ledger_hash: sha256Digest(copy)
  });
}

function createRevocationLedger(input) {
  const context = input && typeof input === 'object' ? input : {};

  assertId(context.ledger_id, 'ledger_id');
  assertTimestamp(context.created_at, 'created_at');

  const authorityRef = assertAuthorityRef(context.authority_ref);

  if (!Array.isArray(context.revocations)) {
    failClosed('REVOCATION_LIST_INVALID', 'revocations must be an array');
  }

  const seen = new Set();

  for (const record of context.revocations) {
    assertPlainObject(record, 'revocation');

    if (seen.has(record.revocation_id)) {
      failClosed('REVOCATION_DUPLICATE_ID', 'duplicate revocation_id detected', {
        revocation_id: record.revocation_id
      });
    }

    seen.add(record.revocation_id);
  }

  const sorted = sortRevocationInputs(context.revocations);
  const records = sorted.map((record, index) => normalizeRevocationRecord(record, authorityRef, index + 1));

  const body = {
    proto: 'HBCE-P0-REVOCATION-LEDGER-v1',
    kind: 'HBCE_P0_REVOCATION_LEDGER',
    version: 'v1',
    ledger_id: context.ledger_id,
    created_at: context.created_at,
    authority_ref: authorityRef,
    revocation_count: records.length,
    revocations: records,
    dispatch_created: false,
    physical_execution_performed: false
  };

  return attachLedgerHash(body);
}

function assertLedgerShape(ledger) {
  assertPlainObject(ledger, 'revocationLedger');

  if (ledger.proto !== 'HBCE-P0-REVOCATION-LEDGER-v1') {
    failClosed('REVOCATION_LEDGER_PROTO_INVALID', 'revocationLedger.proto is invalid');
  }

  if (ledger.kind !== 'HBCE_P0_REVOCATION_LEDGER') {
    failClosed('REVOCATION_LEDGER_KIND_INVALID', 'revocationLedger.kind is invalid');
  }

  assertId(ledger.ledger_id, 'ledger_id');
  assertTimestamp(ledger.created_at, 'created_at');
  assertAuthorityRef(ledger.authority_ref);
  assertDigest(ledger.revocation_ledger_hash, 'revocation_ledger_hash');

  if (!Array.isArray(ledger.revocations)) {
    failClosed('REVOCATION_LEDGER_RECORDS_INVALID', 'revocations must be an array');
  }

  if (!Number.isInteger(ledger.revocation_count) || ledger.revocation_count !== ledger.revocations.length) {
    failClosed('REVOCATION_LEDGER_COUNT_INVALID', 'revocation_count must match revocations.length');
  }

  if (ledger.dispatch_created !== false || ledger.physical_execution_performed !== false) {
    failClosed('REVOCATION_LEDGER_EFFECT_BOUNDARY_INVALID', 'revocation ledger must not create dispatch or physical execution');
  }
}

function verifyRevocationLedger(ledgerInput) {
  assertLedgerShape(ledgerInput);

  let previous = null;
  const seen = new Set();

  for (let index = 0; index < ledgerInput.revocations.length; index += 1) {
    const record = ledgerInput.revocations[index];

    assertPlainObject(record, `revocations[${index}]`);

    if (record.proto !== 'HBCE-P0-REVOCATION-RECORD-v1') {
      failClosed('REVOCATION_RECORD_PROTO_INVALID', 'revocation record proto is invalid', { index });
    }

    if (record.kind !== 'HBCE_P0_REVOCATION_RECORD') {
      failClosed('REVOCATION_RECORD_KIND_INVALID', 'revocation record kind is invalid', { index });
    }

    if (record.linearization_index !== index + 1) {
      failClosed('REVOCATION_LINEARIZATION_INDEX_INVALID', 'linearization_index is invalid', { index });
    }

    if (seen.has(record.revocation_id)) {
      failClosed('REVOCATION_DUPLICATE_ID', 'duplicate revocation_id detected', {
        revocation_id: record.revocation_id
      });
    }

    seen.add(record.revocation_id);

    const normalizedAuthority = assertAuthorityRef(record.authority_ref);

    if (
      normalizedAuthority.authority_id !== ledgerInput.authority_ref.authority_id ||
      normalizedAuthority.authority_version !== ledgerInput.authority_ref.authority_version ||
      normalizedAuthority.authority_hash !== ledgerInput.authority_ref.authority_hash
    ) {
      failClosed('REVOCATION_AUTHORITY_REF_MISMATCH', 'record authority_ref does not match ledger authority_ref', {
        index
      });
    }

    assertTimestamp(record.issued_at, `revocations[${index}].issued_at`);
    assertTimestamp(record.effective_at, `revocations[${index}].effective_at`);
    assertTimestamp(record.observed_at, `revocations[${index}].observed_at`);
    assertDigest(record.evidence_hash, `revocations[${index}].evidence_hash`);
    assertDigest(record.revocation_hash, `revocations[${index}].revocation_hash`);

    if (record.dispatch_created !== false || record.physical_execution_performed !== false) {
      failClosed('REVOCATION_RECORD_EFFECT_BOUNDARY_INVALID', 'revocation record must not create dispatch or physical execution', {
        index
      });
    }

    if (previous) {
      const effectiveDelta = compareIsoUtc(previous.effective_at, record.effective_at);
      const observedDelta = compareIsoUtc(previous.observed_at, record.observed_at);
      const idDelta = String(previous.revocation_id).localeCompare(String(record.revocation_id));

      if (
        effectiveDelta > 0 ||
        (effectiveDelta === 0 && observedDelta > 0) ||
        (effectiveDelta === 0 && observedDelta === 0 && idDelta > 0)
      ) {
        failClosed('REVOCATION_LINEARIZATION_ORDER_INVALID', 'revocation records are not linearly ordered', {
          index
        });
      }
    }

    const withoutHash = deepCloneJson(record);
    delete withoutHash.revocation_hash;

    const recomputed = sha256Digest(withoutHash);

    if (recomputed !== record.revocation_hash) {
      failClosed('REVOCATION_RECORD_HASH_MISMATCH', 'revocation record hash mismatch', {
        index,
        expected: recomputed,
        actual: record.revocation_hash
      });
    }

    previous = record;
  }

  const withoutLedgerHash = deepCloneJson(ledgerInput);
  delete withoutLedgerHash.revocation_ledger_hash;

  const recomputedLedgerHash = sha256Digest(withoutLedgerHash);

  if (recomputedLedgerHash !== ledgerInput.revocation_ledger_hash) {
    failClosed('REVOCATION_LEDGER_HASH_MISMATCH', 'revocation ledger hash mismatch', {
      expected: recomputedLedgerHash,
      actual: ledgerInput.revocation_ledger_hash
    });
  }

  return deepFreeze({
    state: REVOCATION_LINEARIZATION_STATE.CLEAR,
    reason: 'REVOCATION_LEDGER_VALID',
    revocation_count: ledgerInput.revocation_count,
    revocation_ledger_hash: ledgerInput.revocation_ledger_hash
  });
}

function evaluateRevocationAt(ledgerInput, decisionTime) {
  verifyRevocationLedger(ledgerInput);
  assertTimestamp(decisionTime, 'decision_time');

  const effective = ledgerInput.revocations.find((record) => (
    compareIsoUtc(record.effective_at, decisionTime) <= 0
  ));

  if (effective) {
    return deepFreeze({
      state: REVOCATION_LINEARIZATION_STATE.REVOKED,
      reason: 'REVOCATION_EFFECTIVE_BEFORE_OR_AT_DECISION',
      fail_closed: true,
      decision_time: decisionTime,
      revocation_id: effective.revocation_id,
      revocation_hash: effective.revocation_hash,
      effective_at: effective.effective_at,
      observed_at: effective.observed_at,
      authority_ref: ledgerInput.authority_ref,
      revocation_ledger_hash: ledgerInput.revocation_ledger_hash
    });
  }

  return deepFreeze({
    state: REVOCATION_LINEARIZATION_STATE.CLEAR,
    reason: 'NO_EFFECTIVE_REVOCATION_AT_DECISION',
    fail_closed: false,
    decision_time: decisionTime,
    authority_ref: ledgerInput.authority_ref,
    revocation_ledger_hash: ledgerInput.revocation_ledger_hash
  });
}

module.exports = Object.freeze({
  REVOCATION_LINEARIZATION_STATE,
  createRevocationLedger,
  verifyRevocationLedger,
  evaluateRevocationAt
});
