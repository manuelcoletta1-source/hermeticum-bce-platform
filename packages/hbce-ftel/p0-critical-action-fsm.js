'use strict';

const { sha256Digest } = require('../hbce-core/canonical-json.js');
const { enrichRequestEnvelope } = require('../hbce-api-contract/request-envelope.js');
const { failClosed } = require('../hbce-api-contract/errors.js');

const CRITICAL_ACTION_STATE = Object.freeze({
  POLICY_DENIED: 'POLICY_DENIED',
  POLICY_UNRESOLVED: 'POLICY_UNRESOLVED',
  PRECOMMIT_READY: 'PRECOMMIT_READY',
  PRECOMMITTED: 'PRECOMMITTED',
  RECEIPT_RECORDED: 'RECEIPT_RECORDED',
  FAILED_CLOSED: 'FAILED_CLOSED'
});

const CRITICAL_ACTION_EVENT = Object.freeze({
  PRECOMMIT_RECORD: 'PRECOMMIT_RECORD',
  RECORD_TARGET_RECEIPT: 'RECORD_TARGET_RECEIPT',
  FAIL_CLOSED: 'FAIL_CLOSED'
});

const TERMINAL_STATES = Object.freeze([
  CRITICAL_ACTION_STATE.POLICY_DENIED,
  CRITICAL_ACTION_STATE.POLICY_UNRESOLVED,
  CRITICAL_ACTION_STATE.RECEIPT_RECORDED,
  CRITICAL_ACTION_STATE.FAILED_CLOSED
]);

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
    failClosed('CRITICAL_ACTION_OBJECT_INVALID', `${path} must be a plain object`, { path });
  }
}

function assertStringPattern(value, pattern, code, path) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    failClosed(code, `${path} has invalid format`, { path });
  }
}

function assertDigest(value, path) {
  assertStringPattern(value, DIGEST_RE, 'CRITICAL_ACTION_DIGEST_INVALID', path);
}

function assertTimestamp(value, path) {
  assertStringPattern(value, ISO_UTC_RE, 'CRITICAL_ACTION_TIMESTAMP_INVALID', path);

  if (Number.isNaN(Date.parse(value))) {
    failClosed('CRITICAL_ACTION_TIMESTAMP_INVALID', `${path} is not parseable`, { path });
  }
}

function normalizeCreatedAt(value) {
  assertTimestamp(value, 'created_at');
  return value;
}

function withoutCurrentHash(action) {
  const copy = deepCloneJson(action);
  delete copy.critical_action_hash;
  return copy;
}

function attachCriticalActionHash(body) {
  return deepFreeze({
    ...body,
    critical_action_hash: sha256Digest(withoutCurrentHash(body))
  });
}

function transitionRecord(from_state, to_state, event_type, reason, occurred_at, extra = {}) {
  return deepFreeze({
    from_state,
    to_state,
    event_type,
    reason,
    occurred_at,
    ...extra
  });
}

function classifyPolicyBinding(policyBinding) {
  assertPlainObject(policyBinding, 'policyBinding');

  if (policyBinding.execution_allowed === true) {
    if (
      policyBinding.authorization_resolution &&
      policyBinding.authorization_resolution.state === 'AUTHORIZED'
    ) {
      return {
        state: CRITICAL_ACTION_STATE.PRECOMMIT_READY,
        reason: 'POLICY_BINDING_AUTHORIZED_PRECOMMIT_READY'
      };
    }

    failClosed(
      'CRITICAL_ACTION_EXECUTION_FLAG_INCONSISTENT',
      'execution_allowed true requires authorization_resolution.state AUTHORIZED',
      {
        authorization_state:
          policyBinding.authorization_resolution &&
          policyBinding.authorization_resolution.state
      }
    );
  }

  if (
    policyBinding.p0_binding_state === 'DENIED' ||
    (
      policyBinding.authorization_resolution &&
      policyBinding.authorization_resolution.state === 'DENIED'
    )
  ) {
    return {
      state: CRITICAL_ACTION_STATE.POLICY_DENIED,
      reason: 'POLICY_BINDING_DENIED'
    };
  }

  return {
    state: CRITICAL_ACTION_STATE.POLICY_UNRESOLVED,
    reason: 'POLICY_BINDING_UNRESOLVED'
  };
}

function assertPolicyBindingMatchesRequest(enrichedRequestEnvelope, policyBinding) {
  assertPlainObject(policyBinding, 'policyBinding');

  if (policyBinding.request_hash !== enrichedRequestEnvelope.request_hash) {
    failClosed(
      'CRITICAL_ACTION_REQUEST_POLICY_BINDING_MISMATCH',
      'policyBinding.request_hash must match RequestEnvelope hash',
      {
        request_hash: enrichedRequestEnvelope.request_hash,
        policy_binding_request_hash: policyBinding.request_hash
      }
    );
  }
}

function createCriticalAction(input) {
  const context = input && typeof input === 'object' ? input : {};

  assertStringPattern(
    context.critical_action_id,
    ID_RE,
    'CRITICAL_ACTION_ID_INVALID',
    'critical_action_id'
  );

  const created_at = normalizeCreatedAt(context.created_at);
  const enrichedRequestEnvelope = enrichRequestEnvelope(context.requestEnvelope);
  const policyBinding = context.policyBinding;

  assertPolicyBindingMatchesRequest(enrichedRequestEnvelope, policyBinding);

  const classification = classifyPolicyBinding(policyBinding);

  const body = {
    proto: 'HBCE-P0-CRITICAL-ACTION-v1',
    kind: 'HBCE_P0_CRITICAL_ACTION',
    version: 'v1',
    critical_action_id: context.critical_action_id,
    state: classification.state,
    state_reason: classification.reason,
    created_at,
    updated_at: created_at,
    request_id: enrichedRequestEnvelope.request_id,
    request_hash: enrichedRequestEnvelope.request_hash,
    request_schema_hash: enrichedRequestEnvelope.schema_hash,
    policy_binding_hash: sha256Digest(policyBinding),
    action_class: enrichedRequestEnvelope.action_binding.action_class,
    target_ref: enrichedRequestEnvelope.target_ref.target_id,
    execution_allowed: policyBinding.execution_allowed === true,
    dispatch_created: false,
    physical_execution_performed: false,
    target_receipt_recorded: false,
    precommit_hash: null,
    target_receipt_hash: null,
    transition_log: [
      transitionRecord(
        null,
        classification.state,
        'CREATE_CRITICAL_ACTION',
        classification.reason,
        created_at
      )
    ]
  };

  return attachCriticalActionHash(body);
}

function assertCriticalAction(action) {
  assertPlainObject(action, 'criticalAction');

  if (action.proto !== 'HBCE-P0-CRITICAL-ACTION-v1') {
    failClosed('CRITICAL_ACTION_PROTO_INVALID', 'criticalAction.proto is invalid');
  }

  if (action.kind !== 'HBCE_P0_CRITICAL_ACTION') {
    failClosed('CRITICAL_ACTION_KIND_INVALID', 'criticalAction.kind is invalid');
  }

  if (!Object.values(CRITICAL_ACTION_STATE).includes(action.state)) {
    failClosed('CRITICAL_ACTION_STATE_INVALID', 'criticalAction.state is invalid', {
      state: action.state
    });
  }

  assertDigest(action.critical_action_hash, 'critical_action_hash');

  return action;
}

function failClosedTransition(action, event, reason, details = {}) {
  const occurred_at = event && typeof event.occurred_at === 'string'
    ? event.occurred_at
    : new Date(0).toISOString();

  assertTimestamp(occurred_at, 'event.occurred_at');

  const next = {
    ...deepCloneJson(action),
    state: CRITICAL_ACTION_STATE.FAILED_CLOSED,
    state_reason: reason,
    updated_at: occurred_at,
    execution_allowed: false,
    dispatch_created: false,
    physical_execution_performed: false,
    transition_log: [
      ...action.transition_log,
      transitionRecord(
        action.state,
        CRITICAL_ACTION_STATE.FAILED_CLOSED,
        event && event.event_type ? event.event_type : CRITICAL_ACTION_EVENT.FAIL_CLOSED,
        reason,
        occurred_at,
        { details }
      )
    ]
  };

  return attachCriticalActionHash(next);
}

function transitionCriticalAction(actionInput, eventInput) {
  const action = assertCriticalAction(actionInput);
  const event = eventInput && typeof eventInput === 'object' ? eventInput : {};

  assertStringPattern(
    event.event_type,
    /^[A-Z0-9_:.-]{3,80}$/,
    'CRITICAL_ACTION_EVENT_TYPE_INVALID',
    'event.event_type'
  );

  assertTimestamp(event.occurred_at, 'event.occurred_at');

  if (event.event_type === CRITICAL_ACTION_EVENT.FAIL_CLOSED) {
    return failClosedTransition(
      action,
      event,
      event.reason || 'EXPLICIT_FAIL_CLOSED',
      {
        explicit: true
      }
    );
  }

  if (TERMINAL_STATES.includes(action.state)) {
    return failClosedTransition(
      action,
      event,
      'CRITICAL_ACTION_TERMINAL_STATE_TRANSITION_BLOCKED',
      {
        from_state: action.state,
        event_type: event.event_type
      }
    );
  }

  if (
    action.state === CRITICAL_ACTION_STATE.PRECOMMIT_READY &&
    event.event_type === CRITICAL_ACTION_EVENT.PRECOMMIT_RECORD
  ) {
    assertDigest(event.precommit_hash, 'event.precommit_hash');

    const next = {
      ...deepCloneJson(action),
      state: CRITICAL_ACTION_STATE.PRECOMMITTED,
      state_reason: 'PRECOMMIT_RECORDED',
      updated_at: event.occurred_at,
      precommit_hash: event.precommit_hash,
      execution_allowed: false,
      dispatch_created: false,
      physical_execution_performed: false,
      transition_log: [
        ...action.transition_log,
        transitionRecord(
          CRITICAL_ACTION_STATE.PRECOMMIT_READY,
          CRITICAL_ACTION_STATE.PRECOMMITTED,
          CRITICAL_ACTION_EVENT.PRECOMMIT_RECORD,
          'PRECOMMIT_RECORDED',
          event.occurred_at,
          {
            precommit_hash: event.precommit_hash
          }
        )
      ]
    };

    return attachCriticalActionHash(next);
  }

  if (
    action.state === CRITICAL_ACTION_STATE.PRECOMMITTED &&
    event.event_type === CRITICAL_ACTION_EVENT.RECORD_TARGET_RECEIPT
  ) {
    assertDigest(event.target_receipt_hash, 'event.target_receipt_hash');

    const next = {
      ...deepCloneJson(action),
      state: CRITICAL_ACTION_STATE.RECEIPT_RECORDED,
      state_reason: 'TARGET_RECEIPT_RECORDED',
      updated_at: event.occurred_at,
      target_receipt_hash: event.target_receipt_hash,
      target_receipt_recorded: true,
      execution_allowed: false,
      dispatch_created: false,
      physical_execution_performed: false,
      transition_log: [
        ...action.transition_log,
        transitionRecord(
          CRITICAL_ACTION_STATE.PRECOMMITTED,
          CRITICAL_ACTION_STATE.RECEIPT_RECORDED,
          CRITICAL_ACTION_EVENT.RECORD_TARGET_RECEIPT,
          'TARGET_RECEIPT_RECORDED',
          event.occurred_at,
          {
            target_receipt_hash: event.target_receipt_hash
          }
        )
      ]
    };

    return attachCriticalActionHash(next);
  }

  return failClosedTransition(
    action,
    event,
    'CRITICAL_ACTION_TRANSITION_NOT_ALLOWED',
    {
      from_state: action.state,
      event_type: event.event_type
    }
  );
}

module.exports = Object.freeze({
  CRITICAL_ACTION_STATE,
  CRITICAL_ACTION_EVENT,
  createCriticalAction,
  transitionCriticalAction,
  classifyPolicyBinding
});
