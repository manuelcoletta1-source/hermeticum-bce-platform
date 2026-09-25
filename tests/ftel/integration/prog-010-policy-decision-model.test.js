'use strict';

const assert = require('node:assert/strict');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  enrichRequestEnvelope
} = require('../../../packages/hbce-api-contract/request-envelope.js');
const {
  POLICY_DECISION,
  REQUIRED_CONTROL,
  POLICY_DECISION_STATE,
  createPolicyDecision,
  verifyPolicyDecision,
  assertPolicyDecisionBoundToRequest
} = require('../../../packages/hbce-policy/p0-policy-decision.js');

function requestEnvelope() {
  const actionBinding = {
    action_id: 'ACTION-P0-PD-AI-TOOL-ACCESS',
    action_class: 'AI_TOOL_ACCESS',
    action_version: 'v1'
  };

  return {
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'REQ-P0-PD-0001',
    idempotency_key: 'IDEM-P0-PD-0001-REQUEST',
    created_at: '2026-09-25T11:00:00.000Z',
    actor_ref: {
      actor_id: 'ACTOR-P0-PD-001',
      actor_type: 'human',
      session_id: 'SESSION-P0-PD-001'
    },
    authority_ref: {
      authority_id: 'AUT-P0-PD-001',
      authority_version: '1',
      authority_hash: sha256Digest({
        authority_id: 'AUT-P0-PD-001',
        authority_version: 1,
        state: 'ACTIVE'
      })
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: 'TARGET-P0-PD-TOOL',
      target_type: 'tool'
    },
    request_payload_hash: sha256Digest({
      tool: 'hbce.p0.policy.decision.demo',
      operation: 'preview'
    })
  };
}

const enriched = enrichRequestEnvelope(requestEnvelope());

const allowDecision = createPolicyDecision({
  decision_id: 'POLDEC-P0-0001',
  action_id: 'ACTION-P0-PD-AI-TOOL-ACCESS',
  policy_version: 'POLICY-P0-DEMO-2026-09-25',
  evaluated_at: '2026-09-25T11:01:00.000Z',
  request_hash: enriched.request_hash,
  input_facts: {
    action_class: 'AI_TOOL_ACCESS',
    target_id: 'TARGET-P0-PD-TOOL',
    risk_class: 'MEDIUM'
  },
  decision: POLICY_DECISION.ALLOW,
  rule_ids: ['AI_TOOL_SCOPE_MATCH', 'TARGET_ALLOWED', 'RISK_CLASS_ACCEPTED'],
  denial_reasons: [],
  required_controls: [
    REQUIRED_CONTROL.HUMAN_APPROVAL,
    REQUIRED_CONTROL.PRECOMMIT,
    REQUIRED_CONTROL.TARGET_RECEIPT,
    REQUIRED_CONTROL.REVOCATION_CHECK
  ]
});

assert.equal(allowDecision.decision, POLICY_DECISION.ALLOW);
assert.match(allowDecision.policy_decision_hash, /^sha256:[a-f0-9]{64}$/);
assert.equal(allowDecision.policy_semantics.policy_decision_is_authorization, false);
assert.equal(allowDecision.policy_semantics.policy_decision_authorizes_execution, false);
assert.equal(allowDecision.policy_semantics.requires_separate_authorization, true);
assert.equal(allowDecision.dispatch_created, false);
assert.equal(allowDecision.physical_execution_performed, false);

const allowDecisionReorderedFacts = createPolicyDecision({
  decision_id: 'POLDEC-P0-0001',
  action_id: 'ACTION-P0-PD-AI-TOOL-ACCESS',
  policy_version: 'POLICY-P0-DEMO-2026-09-25',
  evaluated_at: '2026-09-25T11:01:00.000Z',
  request_hash: enriched.request_hash,
  input_facts: {
    risk_class: 'MEDIUM',
    target_id: 'TARGET-P0-PD-TOOL',
    action_class: 'AI_TOOL_ACCESS'
  },
  decision: POLICY_DECISION.ALLOW,
  rule_ids: ['AI_TOOL_SCOPE_MATCH', 'TARGET_ALLOWED', 'RISK_CLASS_ACCEPTED'],
  denial_reasons: [],
  required_controls: [
    REQUIRED_CONTROL.HUMAN_APPROVAL,
    REQUIRED_CONTROL.PRECOMMIT,
    REQUIRED_CONTROL.TARGET_RECEIPT,
    REQUIRED_CONTROL.REVOCATION_CHECK
  ]
});

assert.equal(allowDecisionReorderedFacts.input_facts_hash, allowDecision.input_facts_hash);
assert.equal(allowDecisionReorderedFacts.policy_decision_hash, allowDecision.policy_decision_hash);

const verifiedAllow = verifyPolicyDecision(allowDecision);
assert.equal(verifiedAllow.state, POLICY_DECISION_STATE.VALID);
assert.equal(verifiedAllow.reason, 'POLICY_DECISION_VALID');
assert.equal(verifiedAllow.policy_decision_authorizes_execution, false);

const requestBinding = assertPolicyDecisionBoundToRequest(allowDecision, enriched.request_hash);
assert.equal(requestBinding.reason, 'POLICY_DECISION_BOUND_TO_REQUEST');

const denyDecision = createPolicyDecision({
  decision_id: 'POLDEC-P0-0002',
  action_id: 'ACTION-P0-PD-AI-TOOL-ACCESS',
  policy_version: 'POLICY-P0-DEMO-2026-09-25',
  evaluated_at: '2026-09-25T11:02:00.000Z',
  request_hash: enriched.request_hash,
  input_facts_hash: sha256Digest({
    action_class: 'AI_TOOL_ACCESS',
    target_id: 'FORBIDDEN-TARGET'
  }),
  decision: POLICY_DECISION.DENY,
  rule_ids: ['TARGET_NOT_ALLOWED'],
  denial_reasons: ['TARGET_NOT_IN_SCOPE'],
  required_controls: []
});

assert.equal(verifyPolicyDecision(denyDecision).decision, POLICY_DECISION.DENY);

const safeHoldDecision = createPolicyDecision({
  decision_id: 'POLDEC-P0-0003',
  action_id: 'ACTION-P0-PD-AI-TOOL-ACCESS',
  policy_version: 'POLICY-P0-DEMO-2026-09-25',
  evaluated_at: '2026-09-25T11:03:00.000Z',
  request_hash: enriched.request_hash,
  input_facts_hash: sha256Digest({
    revocation_status: 'TEMPORAL_ORDER_UNPROVEN'
  }),
  decision: POLICY_DECISION.SAFE_HOLD,
  rule_ids: ['TEMPORAL_ORDER_UNPROVEN'],
  denial_reasons: ['REVOCATION_ORDER_UNPROVEN'],
  required_controls: [REQUIRED_CONTROL.POLICY_REVIEW]
});

assert.equal(verifyPolicyDecision(safeHoldDecision).decision, POLICY_DECISION.SAFE_HOLD);

const dualControlDecision = createPolicyDecision({
  decision_id: 'POLDEC-P0-0004',
  action_id: 'ACTION-P0-PD-BANK-CRITICAL-ACTION',
  policy_version: 'POLICY-P0-BANK-2026-09-25',
  evaluated_at: '2026-09-25T11:04:00.000Z',
  request_hash: enriched.request_hash,
  input_facts_hash: sha256Digest({
    action_class: 'BANK_CRITICAL_ACTION',
    risk_class: 'HIGH'
  }),
  decision: POLICY_DECISION.DUAL_CONTROL_REQUIRED,
  rule_ids: ['HIGH_RISK_REQUIRES_DUAL_CONTROL'],
  denial_reasons: [],
  required_controls: [
    REQUIRED_CONTROL.DUAL_CONTROL,
    REQUIRED_CONTROL.PRECOMMIT,
    REQUIRED_CONTROL.TARGET_RECEIPT
  ]
});

assert.equal(verifyPolicyDecision(dualControlDecision).decision, POLICY_DECISION.DUAL_CONTROL_REQUIRED);

assert.throws(
  () => createPolicyDecision({
    decision_id: 'POLDEC-P0-BAD-DENY',
    action_id: 'ACTION-P0-PD-AI-TOOL-ACCESS',
    policy_version: 'POLICY-P0-DEMO-2026-09-25',
    evaluated_at: '2026-09-25T11:05:00.000Z',
    request_hash: enriched.request_hash,
    input_facts_hash: sha256Digest({ denied: true }),
    decision: POLICY_DECISION.DENY,
    rule_ids: ['TARGET_NOT_ALLOWED'],
    denial_reasons: [],
    required_controls: []
  }),
  /DENY decisions require denial_reasons/
);

assert.throws(
  () => createPolicyDecision({
    decision_id: 'POLDEC-P0-BAD-DUAL',
    action_id: 'ACTION-P0-PD-BANK-CRITICAL-ACTION',
    policy_version: 'POLICY-P0-BANK-2026-09-25',
    evaluated_at: '2026-09-25T11:06:00.000Z',
    request_hash: enriched.request_hash,
    input_facts_hash: sha256Digest({ high_risk: true }),
    decision: POLICY_DECISION.DUAL_CONTROL_REQUIRED,
    rule_ids: ['HIGH_RISK_REQUIRES_DUAL_CONTROL'],
    denial_reasons: [],
    required_controls: [REQUIRED_CONTROL.PRECOMMIT]
  }),
  /DUAL_CONTROL_REQUIRED decisions must include DUAL_CONTROL/
);

const tamperedDecision = {
  ...allowDecision,
  required_controls: [
    REQUIRED_CONTROL.HUMAN_APPROVAL,
    REQUIRED_CONTROL.PRECOMMIT,
    REQUIRED_CONTROL.TARGET_RECEIPT
  ]
};

assert.throws(
  () => verifyPolicyDecision(tamperedDecision),
  /policy decision hash mismatch/
);

assert.throws(
  () => assertPolicyDecisionBoundToRequest(
    allowDecision,
    sha256Digest({ forged: 'request' })
  ),
  /policy decision request_hash mismatch/
);

assert.equal(Object.hasOwn(allowDecision, 'authorization'), false);
assert.equal(Object.hasOwn(allowDecision, 'dispatch'), false);
assert.equal(Object.hasOwn(allowDecision, 'execution'), false);

console.log('PASS PROG-010-POLICY-DECISION-CREATES-DETERMINISTIC-ALLOW');
console.log('PASS PROG-010-POLICY-DECISION-SUPPORTS-DENY-SAFE-HOLD-DUAL-CONTROL');
console.log('PASS PROG-010-POLICY-DECISION-BINDS-TO-REQUEST');
console.log('PASS PROG-010-POLICY-DECISION-VERIFY-DETECTS-TAMPERING');
console.log('PASS PROG-010-POLICY-DECISION-DOES-NOT-AUTHORIZE-OR-EXECUTE');
