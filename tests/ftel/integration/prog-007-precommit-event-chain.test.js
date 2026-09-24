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

function baseAuthority() {
  return {
    authority_id: 'AUT-P0-EVT-001',
    authority_version: 1,
    principal_ref: 'PRINCIPAL-P0-EVT-001',
    actor_ref: 'ACTOR-P0-EVT-001',
    mandate_ref: 'MND-P0-EVT-001',
    mandate_version: 1,
    capability_ref: 'CAP-P0-EVT-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-AUTH-P0-EVT-001',
    scope: {
      action_classes: ['AI_TOOL_ACCESS'],
      target_refs: ['TARGET-P0-EVT-TOOL'],
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
    mandate_id: 'MND-P0-EVT-001',
    mandate_version: 1,
    principal_ref: 'PRINCIPAL-P0-EVT-001',
    actor_ref: 'ACTOR-P0-EVT-001',
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null
  };
}

function baseCapability() {
  return {
    capability_id: 'CAP-P0-EVT-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-CAP-P0-EVT-001'
  };
}

function baseEnvelope(authority = baseAuthority()) {
  const actionBinding = {
    action_id: 'ACTION-P0-EVT-AI-TOOL-ACCESS',
    action_class: 'AI_TOOL_ACCESS',
    action_version: 'v1'
  };

  return {
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'REQ-P0-EVT-0001',
    idempotency_key: 'IDEM-P0-EVT-0001-REQUEST',
    created_at: '2026-09-24T10:40:00.000Z',
    actor_ref: {
      actor_id: 'ACTOR-P0-EVT-001',
      actor_type: 'human',
      session_id: 'SESSION-P0-EVT-001'
    },
    authority_ref: {
      authority_id: 'AUT-P0-EVT-001',
      authority_version: '1',
      authority_hash: sha256Digest(authority)
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: 'TARGET-P0-EVT-TOOL',
      target_type: 'tool'
    },
    request_payload_hash: sha256Digest({
      tool: 'hbce.p0.event.demo',
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
    currentTime: '2026-09-24T10:41:00.000Z'
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
  critical_action_id: 'CA-P0-EVT-0001',
  created_at: '2026-09-24T10:42:00.000Z',
  requestEnvelope: input.requestEnvelope,
  policyBinding: syntheticAuthorizedBinding
});

assert.equal(criticalAction.state, CRITICAL_ACTION_STATE.PRECOMMIT_READY);
assert.equal(criticalAction.dispatch_created, false);
assert.equal(criticalAction.physical_execution_performed, false);

let chain = createEventChain({
  chain_id: 'CHAIN-P0-EVT-0001',
  created_at: '2026-09-24T10:43:00.000Z',
  request_hash: criticalAction.request_hash,
  subject_type: 'CRITICAL_ACTION',
  subject_hash: criticalAction.critical_action_hash
});

assert.equal(chain.event_count, 0);
assert.equal(chain.head_event_hash, null);
assert.equal(chain.dispatch_created, false);
assert.equal(chain.physical_execution_performed, false);

chain = appendEvent(chain, {
  event_id: 'EVT-P0-EVT-0001',
  event_type: EVENT_TYPE.CRITICAL_ACTION_CREATED,
  occurred_at: '2026-09-24T10:44:00.000Z',
  payload: {
    critical_action_id: criticalAction.critical_action_id,
    state: criticalAction.state,
    critical_action_hash: criticalAction.critical_action_hash
  }
});

assert.equal(chain.event_count, 1);
assert.equal(chain.events[0].sequence, 1);
assert.equal(chain.events[0].previous_event_hash, null);
assert.match(chain.events[0].event_hash, /^sha256:[a-f0-9]{64}$/);

chain = appendEvent(chain, {
  event_id: 'EVT-P0-EVT-0002',
  event_type: EVENT_TYPE.PRECOMMIT_RECORD,
  occurred_at: '2026-09-24T10:45:00.000Z',
  payload: {
    critical_action_hash: criticalAction.critical_action_hash,
    request_hash: criticalAction.request_hash,
    precommit_subject: 'CRITICAL_ACTION'
  }
});

assert.equal(chain.event_count, 2);
assert.equal(chain.events[1].sequence, 2);
assert.equal(chain.events[1].previous_event_hash, chain.events[0].event_hash);
assert.equal(chain.head_event_hash, chain.events[1].event_hash);

const verified = verifyEventChain(chain);
assert.equal(verified.state, 'VALID');
assert.equal(verified.reason, 'EVENT_CHAIN_VALID');
assert.equal(verified.event_count, 2);
assert.equal(verified.head_event_hash, chain.head_event_hash);

const precommittedAction = transitionCriticalAction(criticalAction, {
  event_type: CRITICAL_ACTION_EVENT.PRECOMMIT_RECORD,
  occurred_at: '2026-09-24T10:46:00.000Z',
  precommit_hash: chain.events[1].event_hash
});

assert.equal(precommittedAction.state, CRITICAL_ACTION_STATE.PRECOMMITTED);
assert.equal(precommittedAction.precommit_hash, chain.events[1].event_hash);
assert.equal(precommittedAction.dispatch_created, false);
assert.equal(precommittedAction.physical_execution_performed, false);

const tamperedPreviousHash = {
  ...chain,
  events: [
    chain.events[0],
    {
      ...chain.events[1],
      previous_event_hash: sha256Digest({ forged: 'previous' })
    }
  ]
};

assert.throws(
  () => verifyEventChain(tamperedPreviousHash),
  /event previous hash does not match chain head/
);

const tamperedEventHash = {
  ...chain,
  events: [
    chain.events[0],
    {
      ...chain.events[1],
      payload_hash: sha256Digest({ forged: 'payload' })
    }
  ]
};

assert.throws(
  () => verifyEventChain(tamperedEventHash),
  /event hash mismatch/
);

const tamperedChainHash = {
  ...chain,
  chain_hash: sha256Digest({ forged: 'chain' })
};

assert.throws(
  () => verifyEventChain(tamperedChainHash),
  /chain hash mismatch/
);

const badEffectChain = {
  ...chain,
  dispatch_created: true
};

assert.throws(
  () => verifyEventChain(badEffectChain),
  /must not create dispatch or physical execution/
);

assert.equal(Object.hasOwn(chain, 'dispatch'), false);
assert.equal(Object.hasOwn(chain, 'execution'), false);
assert.equal(Object.hasOwn(chain, 'physical_effect_proven'), false);

console.log('PASS PROG-007-EVENT-CHAIN-CREATES-APPEND-ONLY-HASH-LINKS');
console.log('PASS PROG-007-PRECOMMIT-EVENT-BINDS-TO-CRITICAL-ACTION-FSM');
console.log('PASS PROG-007-EVENT-CHAIN-VERIFY-DETECTS-TAMPERING');
console.log('PASS PROG-007-EVENT-CHAIN-BLOCKS-DISPATCH-AND-PHYSICAL-EFFECT');
console.log('PASS PROG-007-PRECOMMIT-EVENT-DOES-NOT-DISPATCH');
