'use strict';

const { sha256Digest } = require('../hbce-core/canonical-json.js');
const { failClosed } = require('../hbce-api-contract/errors.js');

const TARGET_RECEIPT_STATE = Object.freeze({
  RECORDED: 'RECORDED',
  INVALID: 'INVALID'
});

const TARGET_RECEIPT_STATUS = Object.freeze({
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  REJECTED: 'REJECTED',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN'
});

const DIGEST_RE = /^sha256:[a-f0-9]{64}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,159}$/;
const TYPE_RE = /^[A-Z0-9_:-]{2,80}$/;
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
    failClosed('TARGET_RECEIPT_OBJECT_INVALID', `${path} must be a plain object`, { path });
  }
}

function assertPattern(value, pattern, code, path) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    failClosed(code, `${path} has invalid format`, { path });
  }
}

function assertId(value, path) {
  assertPattern(value, ID_RE, 'TARGET_RECEIPT_ID_INVALID', path);
}

function assertDigest(value, path) {
  assertPattern(value, DIGEST_RE, 'TARGET_RECEIPT_DIGEST_INVALID', path);
}

function assertTimestamp(value, path) {
  assertPattern(value, ISO_UTC_RE, 'TARGET_RECEIPT_TIMESTAMP_INVALID', path);

  if (Number.isNaN(Date.parse(value))) {
    failClosed('TARGET_RECEIPT_TIMESTAMP_INVALID', `${path} is not parseable`, { path });
  }
}

function normalizeTargetRef(targetRef) {
  assertPlainObject(targetRef, 'target_ref');
  assertId(targetRef.target_id, 'target_ref.target_id');

  if (typeof targetRef.target_type !== 'string' || targetRef.target_type.length === 0) {
    failClosed('TARGET_RECEIPT_TARGET_TYPE_INVALID', 'target_ref.target_type is invalid');
  }

  return {
    target_id: targetRef.target_id,
    target_type: targetRef.target_type
  };
}

function normalizeReceiverRef(receiverRef) {
  if (receiverRef === undefined || receiverRef === null) {
    return null;
  }

  assertPlainObject(receiverRef, 'receiver_ref');
  assertId(receiverRef.receiver_id, 'receiver_ref.receiver_id');

  if (typeof receiverRef.receiver_type !== 'string' || receiverRef.receiver_type.length === 0) {
    failClosed('TARGET_RECEIPT_RECEIVER_TYPE_INVALID', 'receiver_ref.receiver_type is invalid');
  }

  return {
    receiver_id: receiverRef.receiver_id,
    receiver_type: receiverRef.receiver_type
  };
}

function assertReceiptStatus(status) {
  if (!Object.values(TARGET_RECEIPT_STATUS).includes(status)) {
    failClosed('TARGET_RECEIPT_STATUS_INVALID', 'target_status is invalid', {
      target_status: status
    });
  }
}

function attachReceiptHash(body) {
  const copy = deepCloneJson(body);
  delete copy.target_receipt_hash;

  return deepFreeze({
    ...body,
    target_receipt_hash: sha256Digest(copy)
  });
}

function createTargetReceipt(input) {
  const context = input && typeof input === 'object' ? input : {};

  assertId(context.receipt_id, 'receipt_id');
  assertTimestamp(context.received_at, 'received_at');
  assertDigest(context.request_hash, 'request_hash');
  assertDigest(context.critical_action_hash, 'critical_action_hash');
  assertDigest(context.precommit_hash, 'precommit_hash');
  assertDigest(context.event_chain_hash, 'event_chain_hash');
  assertDigest(context.event_head_hash, 'event_head_hash');
  assertDigest(context.target_observation_hash, 'target_observation_hash');
  assertDigest(context.raw_receipt_hash, 'raw_receipt_hash');

  const target_ref = normalizeTargetRef(context.target_ref);
  const receiver_ref = normalizeReceiverRef(context.receiver_ref);
  const target_status = context.target_status;

  assertReceiptStatus(target_status);

  const body = {
    proto: 'HBCE-P0-TARGET-RECEIPT-v1',
    kind: 'HBCE_P0_TARGET_RECEIPT',
    version: 'v1',
    receipt_id: context.receipt_id,
    receipt_state: TARGET_RECEIPT_STATE.RECORDED,
    received_at: context.received_at,
    request_hash: context.request_hash,
    critical_action_hash: context.critical_action_hash,
    precommit_hash: context.precommit_hash,
    event_chain_hash: context.event_chain_hash,
    event_head_hash: context.event_head_hash,
    target_ref,
    receiver_ref,
    target_status,
    target_observation_hash: context.target_observation_hash,
    raw_receipt_hash: context.raw_receipt_hash,
    receipt_semantics: {
      receipt_is_evidence: true,
      receipt_proves_physical_effect: false,
      receipt_authorizes_execution: false
    },
    dispatch_created: false,
    physical_execution_performed: false,
    physical_effect_proven: false
  };

  return attachReceiptHash(body);
}

function assertTargetReceiptShape(receipt) {
  assertPlainObject(receipt, 'targetReceipt');

  if (receipt.proto !== 'HBCE-P0-TARGET-RECEIPT-v1') {
    failClosed('TARGET_RECEIPT_PROTO_INVALID', 'targetReceipt.proto is invalid');
  }

  if (receipt.kind !== 'HBCE_P0_TARGET_RECEIPT') {
    failClosed('TARGET_RECEIPT_KIND_INVALID', 'targetReceipt.kind is invalid');
  }

  if (receipt.receipt_state !== TARGET_RECEIPT_STATE.RECORDED) {
    failClosed('TARGET_RECEIPT_STATE_INVALID', 'receipt_state is invalid');
  }

  assertId(receipt.receipt_id, 'receipt_id');
  assertTimestamp(receipt.received_at, 'received_at');
  assertDigest(receipt.request_hash, 'request_hash');
  assertDigest(receipt.critical_action_hash, 'critical_action_hash');
  assertDigest(receipt.precommit_hash, 'precommit_hash');
  assertDigest(receipt.event_chain_hash, 'event_chain_hash');
  assertDigest(receipt.event_head_hash, 'event_head_hash');
  assertDigest(receipt.target_observation_hash, 'target_observation_hash');
  assertDigest(receipt.raw_receipt_hash, 'raw_receipt_hash');
  assertDigest(receipt.target_receipt_hash, 'target_receipt_hash');
  normalizeTargetRef(receipt.target_ref);
  normalizeReceiverRef(receipt.receiver_ref);
  assertReceiptStatus(receipt.target_status);

  if (!isPlainObject(receipt.receipt_semantics)) {
    failClosed('TARGET_RECEIPT_SEMANTICS_INVALID', 'receipt_semantics must be an object');
  }

  if (
    receipt.receipt_semantics.receipt_is_evidence !== true ||
    receipt.receipt_semantics.receipt_proves_physical_effect !== false ||
    receipt.receipt_semantics.receipt_authorizes_execution !== false
  ) {
    failClosed('TARGET_RECEIPT_SEMANTICS_INVALID', 'receipt semantics are invalid');
  }

  if (
    receipt.dispatch_created !== false ||
    receipt.physical_execution_performed !== false ||
    receipt.physical_effect_proven !== false
  ) {
    failClosed(
      'TARGET_RECEIPT_EFFECT_BOUNDARY_INVALID',
      'target receipt must not create dispatch, physical execution or physical-effect proof'
    );
  }
}

function verifyTargetReceipt(receiptInput) {
  assertTargetReceiptShape(receiptInput);

  const withoutHash = deepCloneJson(receiptInput);
  delete withoutHash.target_receipt_hash;

  const recomputed = sha256Digest(withoutHash);

  if (recomputed !== receiptInput.target_receipt_hash) {
    failClosed('TARGET_RECEIPT_HASH_MISMATCH', 'target receipt hash mismatch', {
      expected: recomputed,
      actual: receiptInput.target_receipt_hash
    });
  }

  return deepFreeze({
    state: TARGET_RECEIPT_STATE.RECORDED,
    reason: 'TARGET_RECEIPT_VALID',
    receipt_id: receiptInput.receipt_id,
    request_hash: receiptInput.request_hash,
    critical_action_hash: receiptInput.critical_action_hash,
    precommit_hash: receiptInput.precommit_hash,
    target_receipt_hash: receiptInput.target_receipt_hash,
    physical_effect_proven: false
  });
}

function assertReceiptBoundToCriticalAction(receiptInput, criticalAction) {
  const verified = verifyTargetReceipt(receiptInput);

  assertPlainObject(criticalAction, 'criticalAction');

  if (criticalAction.proto !== 'HBCE-P0-CRITICAL-ACTION-v1') {
    failClosed('TARGET_RECEIPT_CRITICAL_ACTION_PROTO_INVALID', 'criticalAction.proto is invalid');
  }

  assertDigest(criticalAction.critical_action_hash, 'criticalAction.critical_action_hash');
  assertDigest(criticalAction.request_hash, 'criticalAction.request_hash');
  assertDigest(criticalAction.precommit_hash, 'criticalAction.precommit_hash');

  if (receiptInput.request_hash !== criticalAction.request_hash) {
    failClosed('TARGET_RECEIPT_REQUEST_HASH_MISMATCH', 'receipt request_hash does not match critical action');
  }

  if (receiptInput.critical_action_hash !== criticalAction.critical_action_hash) {
    failClosed('TARGET_RECEIPT_CRITICAL_ACTION_HASH_MISMATCH', 'receipt critical_action_hash does not match critical action');
  }

  if (receiptInput.precommit_hash !== criticalAction.precommit_hash) {
    failClosed('TARGET_RECEIPT_PRECOMMIT_HASH_MISMATCH', 'receipt precommit_hash does not match critical action');
  }

  return deepFreeze({
    state: TARGET_RECEIPT_STATE.RECORDED,
    reason: 'TARGET_RECEIPT_BOUND_TO_CRITICAL_ACTION',
    target_receipt_hash: verified.target_receipt_hash,
    critical_action_hash: criticalAction.critical_action_hash,
    request_hash: criticalAction.request_hash,
    physical_effect_proven: false
  });
}

function assertReceiptBoundToEventChain(receiptInput, eventChain) {
  verifyTargetReceipt(receiptInput);
  assertPlainObject(eventChain, 'eventChain');

  if (eventChain.proto !== 'HBCE-P0-EVENT-CHAIN-v1') {
    failClosed('TARGET_RECEIPT_EVENT_CHAIN_PROTO_INVALID', 'eventChain.proto is invalid');
  }

  assertDigest(eventChain.chain_hash, 'eventChain.chain_hash');
  assertDigest(eventChain.head_event_hash, 'eventChain.head_event_hash');
  assertDigest(eventChain.request_hash, 'eventChain.request_hash');

  if (receiptInput.event_chain_hash !== eventChain.chain_hash) {
    failClosed('TARGET_RECEIPT_EVENT_CHAIN_HASH_MISMATCH', 'receipt event_chain_hash does not match event chain');
  }

  if (receiptInput.event_head_hash !== eventChain.head_event_hash) {
    failClosed('TARGET_RECEIPT_EVENT_HEAD_HASH_MISMATCH', 'receipt event_head_hash does not match event chain head');
  }

  if (receiptInput.request_hash !== eventChain.request_hash) {
    failClosed('TARGET_RECEIPT_EVENT_CHAIN_REQUEST_HASH_MISMATCH', 'receipt request_hash does not match event chain');
  }

  return deepFreeze({
    state: TARGET_RECEIPT_STATE.RECORDED,
    reason: 'TARGET_RECEIPT_BOUND_TO_EVENT_CHAIN',
    target_receipt_hash: receiptInput.target_receipt_hash,
    event_chain_hash: eventChain.chain_hash,
    event_head_hash: eventChain.head_event_hash,
    physical_effect_proven: false
  });
}

module.exports = Object.freeze({
  TARGET_RECEIPT_STATE,
  TARGET_RECEIPT_STATUS,
  createTargetReceipt,
  verifyTargetReceipt,
  assertReceiptBoundToCriticalAction,
  assertReceiptBoundToEventChain
});
