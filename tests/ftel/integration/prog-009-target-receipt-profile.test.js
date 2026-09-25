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
const {
  EVENT_TYPE,
  createEventChain,
  appendEvent,
  verifyEventChain
} = require('../../../packages/hbce-events/p0-event-chain.js');
const {
  TARGET_RECEIPT_STATE,
  TARGET_RECEIPT_STATUS,
  createTargetReceipt,
  verifyTargetReceipt,
  assertReceiptBoundToCriticalAction,
  assertReceiptBoundToEventChain
} = require('../../../packages/hbce-targets/p0-target-receipt.js');

function baseAuthority() {
  return {
    authority_id: 'AUT-P0-TR-001',
    authority_version: 1,
    principal_ref: 'PRINCIPAL-P0-TR-001',
    actor_ref: 'ACTOR-P0-TR-001',
    mandate_ref: 'MND-P0-TR-001',
    mandate_version: 1,
    capability_ref: 'CAP-P0-TR-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-AUTH-P0-TR-001',
    scope: {
      action_classes: ['AI_TOOL_ACCESS'],
      target_refs: ['TARGET-P0-TR-TOOL'],
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
    mandate_id: 'MND-P0-TR-001',
    mandate_version: 1,
    principal_ref: 'PRINCIPAL-P0-TR-001',
    actor_ref: 'ACTOR-P0-TR-001',
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null
  };
}

function baseCapability() {
  return {
    capability_id: 'CAP-P0-TR-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-CAP-P0-TR-001'
  };
}

function baseEnvelope(authority = baseAuthority()) {
  const actionBinding = {
    action_id: 'ACTION-P0-TR-AI-TOOL-ACCESS',
    action_class: 'AI_TOOL_ACCESS',
    action_version: 'v1'
  };

  return {
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'REQ-P0-TR-0001',
    idempotency_key: 'IDEM-P0-TR-0001-REQUEST',
    created_at: '2026-09-24T11:20:00.000Z',
    actor_ref: {
      actor_id: 'ACTOR-P0-TR-001',
      actor_type: 'human',
      session_id: 'SESSION-P0-TR-001'
    },
    authority_ref: {
      authority_id: 'AUT-P0-TR-001',
      authority_version: '1',
      authority_hash: sha256Digest(authority)
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: 'TARGET-P0-TR-TOOL',
      target_type: 'tool'
    },
    request_payload_hash: sha256Digest({
      tool: 'hbce.p0.target.receipt.demo',
      operation: 'preview'
    })
  };
}

function policyInput() {
  const authority = baseAuthority();

  return {
    requestEnvelope: baseEnvelope(authority),
    authority,
    mandate: baseMandate(),
    capability: baseCapability(),
    currentTime: '2026-09-24T11:21:00.000Z'
  };
}

const input = policyInput();
const unresolvedBinding = evaluateP0PolicyBinding(input);
const enriched = enrichRequestEnvelope(input.requestEnvelope);

const syntheticAuthorizedBinding = {
  ...unresolvedBinding,
  request_hash: enriched.request_hash,
  p0_binding_state: 'AUTHORIZED',
  execution_allowed: true,
  authorization_resolution: {
    state: 'AUTHORIZED',
    reason: 'SYNTHETIC_TEST_ONLY'
  }
};

const criticalAction = createCriticalAction({
  critical_action_id: 'CA-P0-TR-0001',
  created_at: '2026-09-24T11:22:00.000Z',
  requestEnvelope: input.requestEnvelope,
  policyBinding: syntheticAuthorizedBinding
});

assert.equal(criticalAction.state, CRITICAL_ACTION_STATE.PRECOMMIT_READY);

let chain = createEventChain({
  chain_id: 'CHAIN-P0-TR-0001',
  created_at: '2026-09-24T11:23:00.000Z',
  request_hash: criticalAction.request_hash,
  subject_type: 'CRITICAL_ACTION',
  subject_hash: criticalAction.critical_action_hash
});

chain = appendEvent(chain, {
  event_id: 'EVT-P0-TR-0001',
  event_type: EVENT_TYPE.CRITICAL_ACTION_CREATED,
  occurred_at: '2026-09-24T11:24:00.000Z',
  payload: {
    critical_action_id: criticalAction.critical_action_id,
    critical_action_hash: criticalAction.critical_action_hash
  }
});

chain = appendEvent(chain, {
  event_id: 'EVT-P0-TR-0002',
  event_type: EVENT_TYPE.PRECOMMIT_RECORD,
  occurred_at: '2026-09-24T11:25:00.000Z',
  payload: {
    request_hash: criticalAction.request_hash,
    critical_action_hash: criticalAction.critical_action_hash
  }
});

assert.equal(verifyEventChain(chain).state, 'VALID');

const precommittedAction = transitionCriticalAction(criticalAction, {
  event_type: CRITICAL_ACTION_EVENT.PRECOMMIT_RECORD,
  occurred_at: '2026-09-24T11:26:00.000Z',
  precommit_hash: chain.events[1].event_hash
});

assert.equal(precommittedAction.state, CRITICAL_ACTION_STATE.PRECOMMITTED);
assert.equal(precommittedAction.precommit_hash, chain.events[1].event_hash);

const targetReceipt = createTargetReceipt({
  receipt_id: 'TR-P0-0001',
  received_at: '2026-09-24T11:27:00.000Z',
  request_hash: precommittedAction.request_hash,
  critical_action_hash: precommittedAction.critical_action_hash,
  precommit_hash: precommittedAction.precommit_hash,
  event_chain_hash: chain.chain_hash,
  event_head_hash: chain.head_event_hash,
  target_ref: {
    target_id: 'TARGET-P0-TR-TOOL',
    target_type: 'tool'
  },
  receiver_ref: {
    receiver_id: 'TARGET-ADAPTER-P0-TR-001',
    receiver_type: 'adapter'
  },
  target_status: TARGET_RECEIPT_STATUS.ACKNOWLEDGED,
  target_observation_hash: sha256Digest({
    observed: 'target-side acknowledgement recorded',
    physical_effect_claimed: false
  }),
  raw_receipt_hash: sha256Digest({
    raw: 'opaque-target-receipt',
    status: 'ACKNOWLEDGED'
  })
});

const verifiedReceipt = verifyTargetReceipt(targetReceipt);
assert.equal(verifiedReceipt.state, TARGET_RECEIPT_STATE.RECORDED);
assert.equal(verifiedReceipt.reason, 'TARGET_RECEIPT_VALID');
assert.equal(verifiedReceipt.physical_effect_proven, false);
assert.match(targetReceipt.target_receipt_hash, /^sha256:[a-f0-9]{64}$/);

const criticalActionBinding = assertReceiptBoundToCriticalAction(targetReceipt, precommittedAction);
assert.equal(criticalActionBinding.reason, 'TARGET_RECEIPT_BOUND_TO_CRITICAL_ACTION');
assert.equal(criticalActionBinding.physical_effect_proven, false);

const eventChainBinding = assertReceiptBoundToEventChain(targetReceipt, chain);
assert.equal(eventChainBinding.reason, 'TARGET_RECEIPT_BOUND_TO_EVENT_CHAIN');
assert.equal(eventChainBinding.physical_effect_proven, false);

const receiptedAction = transitionCriticalAction(precommittedAction, {
  event_type: CRITICAL_ACTION_EVENT.RECORD_TARGET_RECEIPT,
  occurred_at: '2026-09-24T11:28:00.000Z',
  target_receipt_hash: targetReceipt.target_receipt_hash
});

assert.equal(receiptedAction.state, CRITICAL_ACTION_STATE.RECEIPT_RECORDED);
assert.equal(receiptedAction.target_receipt_recorded, true);
assert.equal(receiptedAction.target_receipt_hash, targetReceipt.target_receipt_hash);
assert.equal(receiptedAction.physical_execution_performed, false);

const tamperedReceipt = {
  ...targetReceipt,
  target_status: TARGET_RECEIPT_STATUS.REJECTED
};

assert.throws(
  () => verifyTargetReceipt(tamperedReceipt),
  /target receipt hash mismatch/
);

const mismatchedCriticalActionReceipt = {
  ...targetReceipt,
  critical_action_hash: sha256Digest({ forged: 'critical-action' })
};

assert.throws(
  () => assertReceiptBoundToCriticalAction(mismatchedCriticalActionReceipt, precommittedAction),
  /target receipt hash mismatch|receipt critical_action_hash does not match critical action/
);

const mismatchedEventChainReceipt = createTargetReceipt({
  ...targetReceipt,
  receipt_id: 'TR-P0-0002',
  event_head_hash: sha256Digest({ forged: 'event-head' })
});

assert.throws(
  () => assertReceiptBoundToEventChain(mismatchedEventChainReceipt, chain),
  /receipt event_head_hash does not match event chain head/
);

const physicalEffectReceipt = {
  ...targetReceipt,
  physical_effect_proven: true
};

assert.throws(
  () => verifyTargetReceipt(physicalEffectReceipt),
  /target receipt must not create dispatch, physical execution or physical-effect proof|target receipt hash mismatch/
);

assert.throws(
  () => createTargetReceipt({
    ...targetReceipt,
    receipt_id: 'TR-P0-0003',
    target_status: 'PHYSICAL_EFFECT_PROVEN'
  }),
  /target_status is invalid/
);

assert.equal(Object.hasOwn(targetReceipt, 'dispatch'), false);
assert.equal(Object.hasOwn(targetReceipt, 'execution'), false);
assert.equal(targetReceipt.receipt_semantics.receipt_proves_physical_effect, false);
assert.equal(targetReceipt.receipt_semantics.receipt_authorizes_execution, false);

console.log('PASS PROG-009-TARGET-RECEIPT-CREATES-DETERMINISTIC-EVIDENCE');
console.log('PASS PROG-009-TARGET-RECEIPT-BINDS-TO-CRITICAL-ACTION');
console.log('PASS PROG-009-TARGET-RECEIPT-BINDS-TO-EVENT-CHAIN');
console.log('PASS PROG-009-TARGET-RECEIPT-VERIFY-DETECTS-TAMPERING');
console.log('PASS PROG-009-RECEIPT-DOES-NOT-PROVE-PHYSICAL-EFFECT');
