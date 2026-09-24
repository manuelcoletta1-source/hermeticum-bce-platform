'use strict';

const assert = require('node:assert/strict');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  enrichRequestEnvelope
} = require('../../../packages/hbce-api-contract/request-envelope.js');
const {
  evaluateP0PolicyBinding
} = require('../../../packages/hbce-policy/p0-policy-binding.js');
const {
  CRITICAL_ACTION_STATE,
  CRITICAL_ACTION_EVENT,
  createCriticalAction,
  transitionCriticalAction
} = require('../../../packages/hbce-ftel/p0-critical-action-fsm.js');

function baseAuthority() {
  return {
    authority_id: 'AUT-P0-FSM-001',
    authority_version: 1,
    principal_ref: 'PRINCIPAL-P0-FSM-001',
    actor_ref: 'ACTOR-P0-FSM-001',
    mandate_ref: 'MND-P0-FSM-001',
    mandate_version: 1,
    capability_ref: 'CAP-P0-FSM-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-AUTH-P0-FSM-001',
    scope: {
      action_classes: ['AI_TOOL_ACCESS'],
      target_refs: ['TARGET-P0-FSM-TOOL'],
      iospace_refs: [],
      constraint_refs: []
    },
    limits: {
      policy_refs: [],
      quantitative_limit_refs: [],
      condition_refs: []
    }
  };
}

function baseMandate() {
  return {
    mandate_id: 'MND-P0-FSM-001',
    mandate_version: 1,
    principal_ref: 'PRINCIPAL-P0-FSM-001',
    actor_ref: 'ACTOR-P0-FSM-001',
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null
  };
}

function baseCapability() {
  return {
    capability_id: 'CAP-P0-FSM-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-CAP-P0-FSM-001'
  };
}

function baseEnvelope(authority = baseAuthority()) {
  const actionBinding = {
    action_id: 'ACTION-P0-FSM-AI-TOOL-ACCESS',
    action_class: 'AI_TOOL_ACCESS',
    action_version: 'v1'
  };

  return {
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'REQ-P0-FSM-0001',
    idempotency_key: 'IDEM-P0-FSM-0001-REQUEST',
    created_at: '2026-09-24T10:30:00.000Z',
    actor_ref: {
      actor_id: 'ACTOR-P0-FSM-001',
      actor_type: 'human',
      session_id: 'SESSION-P0-FSM-001'
    },
    authority_ref: {
      authority_id: 'AUT-P0-FSM-001',
      authority_version: '1',
      authority_hash: sha256Digest(authority)
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: 'TARGET-P0-FSM-TOOL',
      target_type: 'tool'
    },
    request_payload_hash: sha256Digest({
      tool: 'hbce.p0.fsm.demo',
      operation: 'preview'
    })
  };
}

function basePolicyInput() {
  const authority = baseAuthority();

  return {
    requestEnvelope: baseEnvelope(authority),
    authority,
    mandate: baseMandate(),
    capability: baseCapability(),
    currentTime: '2026-09-24T10:31:00.000Z'
  };
}

const unresolvedPolicyInput = basePolicyInput();
const unresolvedPolicyBinding = evaluateP0PolicyBinding(unresolvedPolicyInput);

const unresolvedAction = createCriticalAction({
  critical_action_id: 'CA-P0-FSM-0001',
  created_at: '2026-09-24T10:32:00.000Z',
  requestEnvelope: unresolvedPolicyInput.requestEnvelope,
  policyBinding: unresolvedPolicyBinding
});

assert.equal(unresolvedAction.state, CRITICAL_ACTION_STATE.POLICY_UNRESOLVED);
assert.equal(unresolvedAction.execution_allowed, false);
assert.equal(unresolvedAction.dispatch_created, false);
assert.equal(unresolvedAction.physical_execution_performed, false);
assert.equal(unresolvedAction.target_receipt_recorded, false);
assert.match(unresolvedAction.critical_action_hash, /^sha256:[a-f0-9]{64}$/);

const blockedTransition = transitionCriticalAction(unresolvedAction, {
  event_type: CRITICAL_ACTION_EVENT.PRECOMMIT_RECORD,
  occurred_at: '2026-09-24T10:33:00.000Z',
  precommit_hash: sha256Digest({ precommit: true })
});

assert.equal(blockedTransition.state, CRITICAL_ACTION_STATE.FAILED_CLOSED);
assert.equal(blockedTransition.state_reason, 'CRITICAL_ACTION_TERMINAL_STATE_TRANSITION_BLOCKED');
assert.equal(blockedTransition.execution_allowed, false);
assert.equal(blockedTransition.dispatch_created, false);
assert.equal(blockedTransition.physical_execution_performed, false);

const deniedPolicyInput = basePolicyInput();
deniedPolicyInput.authority = null;

const deniedPolicyBinding = evaluateP0PolicyBinding(deniedPolicyInput);
const deniedAction = createCriticalAction({
  critical_action_id: 'CA-P0-FSM-0002',
  created_at: '2026-09-24T10:34:00.000Z',
  requestEnvelope: deniedPolicyInput.requestEnvelope,
  policyBinding: deniedPolicyBinding
});

assert.equal(deniedAction.state, CRITICAL_ACTION_STATE.POLICY_DENIED);
assert.equal(deniedAction.execution_allowed, false);
assert.equal(deniedAction.dispatch_created, false);
assert.equal(deniedAction.physical_execution_performed, false);

const mismatchPolicyBinding = {
  ...unresolvedPolicyBinding,
  request_hash: sha256Digest({ forged: 'request' })
};

assert.throws(
  () => createCriticalAction({
    critical_action_id: 'CA-P0-FSM-0003',
    created_at: '2026-09-24T10:35:00.000Z',
    requestEnvelope: unresolvedPolicyInput.requestEnvelope,
    policyBinding: mismatchPolicyBinding
  }),
  /policyBinding.request_hash must match RequestEnvelope hash/
);

const enriched = enrichRequestEnvelope(unresolvedPolicyInput.requestEnvelope);

const syntheticAuthorizedBinding = {
  ...unresolvedPolicyBinding,
  request_hash: enriched.request_hash,
  p0_binding_state: 'AUTHORIZED',
  execution_allowed: true,
  authorization_resolution: {
    state: 'AUTHORIZED',
    reason: 'SYNTHETIC_TEST_ONLY'
  }
};

const precommitReadyAction = createCriticalAction({
  critical_action_id: 'CA-P0-FSM-0004',
  created_at: '2026-09-24T10:36:00.000Z',
  requestEnvelope: unresolvedPolicyInput.requestEnvelope,
  policyBinding: syntheticAuthorizedBinding
});

assert.equal(precommitReadyAction.state, CRITICAL_ACTION_STATE.PRECOMMIT_READY);
assert.equal(precommitReadyAction.execution_allowed, true);
assert.equal(precommitReadyAction.dispatch_created, false);
assert.equal(precommitReadyAction.physical_execution_performed, false);

const precommitted = transitionCriticalAction(precommitReadyAction, {
  event_type: CRITICAL_ACTION_EVENT.PRECOMMIT_RECORD,
  occurred_at: '2026-09-24T10:37:00.000Z',
  precommit_hash: sha256Digest({
    request_hash: enriched.request_hash,
    phase: 'precommit'
  })
});

assert.equal(precommitted.state, CRITICAL_ACTION_STATE.PRECOMMITTED);
assert.equal(precommitted.execution_allowed, false);
assert.equal(precommitted.dispatch_created, false);
assert.equal(precommitted.physical_execution_performed, false);
assert.match(precommitted.precommit_hash, /^sha256:[a-f0-9]{64}$/);

const receipted = transitionCriticalAction(precommitted, {
  event_type: CRITICAL_ACTION_EVENT.RECORD_TARGET_RECEIPT,
  occurred_at: '2026-09-24T10:38:00.000Z',
  target_receipt_hash: sha256Digest({
    request_hash: enriched.request_hash,
    target_state: 'ACKNOWLEDGED_TEST_ONLY'
  })
});

assert.equal(receipted.state, CRITICAL_ACTION_STATE.RECEIPT_RECORDED);
assert.equal(receipted.target_receipt_recorded, true);
assert.equal(receipted.execution_allowed, false);
assert.equal(receipted.dispatch_created, false);
assert.equal(receipted.physical_execution_performed, false);
assert.match(receipted.target_receipt_hash, /^sha256:[a-f0-9]{64}$/);

const badReceiptTransition = transitionCriticalAction(precommitReadyAction, {
  event_type: CRITICAL_ACTION_EVENT.RECORD_TARGET_RECEIPT,
  occurred_at: '2026-09-24T10:39:00.000Z',
  target_receipt_hash: sha256Digest({ premature: true })
});

assert.equal(badReceiptTransition.state, CRITICAL_ACTION_STATE.FAILED_CLOSED);
assert.equal(badReceiptTransition.state_reason, 'CRITICAL_ACTION_TRANSITION_NOT_ALLOWED');

assert.equal(Object.hasOwn(receipted, 'physical_effect_proven'), false);
assert.equal(Object.hasOwn(receipted, 'dispatch'), false);
assert.equal(Object.hasOwn(receipted, 'execution'), false);

console.log('PASS PROG-006-CRITICAL-ACTION-FSM-CREATES-FAIL-CLOSED-STATES');
console.log('PASS PROG-006-CRITICAL-ACTION-FSM-BLOCKS-ILLEGAL-TRANSITIONS');
console.log('PASS PROG-006-CRITICAL-ACTION-FSM-BINDS-REQUEST-AND-POLICY');
console.log('PASS PROG-006-CRITICAL-ACTION-FSM-PRECOMMIT-AND-RECEIPT-PATH');
console.log('PASS PROG-006-RECEIPT-DOES-NOT-PROVE-PHYSICAL-EFFECT');
