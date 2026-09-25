'use strict';

const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');
const {
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  enrichRequestEnvelope
} = require('../../packages/hbce-api-contract/request-envelope.js');
const {
  POLICY_DECISION,
  REQUIRED_CONTROL,
  createPolicyDecision
} = require('../../packages/hbce-policy/p0-policy-decision.js');
const {
  TARGET_RECEIPT_STATUS,
  createTargetReceipt
} = require('../../packages/hbce-targets/p0-target-receipt.js');
const {
  createEvidenceBundle,
  verifyEvidenceBundle
} = require('../../packages/hbce-evidence/p0-evidence-bundle.js');

const DEMO_PROTO = 'HBCE-P0-BANK-CYBER-CRITICAL-ACTION-DEMO-v1';

const DEFAULT_DEMO_CLOCK = Object.freeze({
  request_created_at: '2026-09-25T15:10:00.000Z',
  policy_evaluated_at: '2026-09-25T15:11:00.000Z',
  event_one_at: '2026-09-25T15:11:10.000Z',
  event_two_at: '2026-09-25T15:11:20.000Z',
  event_three_at: '2026-09-25T15:11:30.000Z',
  receipt_received_at: '2026-09-25T15:12:00.000Z',
  bundle_created_at: '2026-09-25T15:13:00.000Z'
});

const DEFAULT_INPUT = Object.freeze({
  demo_id: 'DEMO-L1-BANK-CYBER-CRITICAL-001',
  action_id: 'ACTION-L1-BANK-CRITICAL-DEMO-001',
  request_id: 'REQ-L1-BANK-CRITICAL-DEMO-001',
  idempotency_key: 'IDEM-L1-BANK-CRITICAL-DEMO-001',
  primary_actor_id: 'ACTOR-L1-RISK-OPERATOR-DEMO-001',
  secondary_actor_id: 'ACTOR-L1-CYBER-APPROVER-DEMO-001',
  session_id: 'SESSION-L1-BANK-CRITICAL-DEMO-001',
  authority_id: 'AUT-L1-BANK-CRITICAL-DEMO-001',
  target_id: 'TARGET-L1-MOCK-BANK-RISK-ENGINE-001',
  operation_name: 'risk.threshold.update',
  operation_scope: 'demo-risk-policy',
  risk_class: 'HIGH',
  control_window: 'DEMO_CHANGE_WINDOW_001'
});

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function schemaSet() {
  return [
    {
      schema_id: 'hbce.request_envelope',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'request_envelope', version: 'v1' })
    },
    {
      schema_id: 'hbce.policy_decision',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'policy_decision', version: 'v1' })
    },
    {
      schema_id: 'hbce.target_receipt',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'target_receipt', version: 'v1' })
    },
    {
      schema_id: 'hbce.evidence_bundle',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'evidence_bundle', version: 'v1' })
    },
    {
      schema_id: 'hbce.bank_cyber_demo',
      schema_version: 'v1',
      schema_hash: sha256Digest({ schema: 'bank_cyber_demo', version: 'v1' })
    }
  ];
}

function createRequestEnvelope(input, clock) {
  const actionBinding = {
    action_id: input.action_id,
    action_class: 'BANK_CRITICAL_ACTION',
    action_version: 'v1'
  };

  return enrichRequestEnvelope({
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: input.request_id,
    idempotency_key: input.idempotency_key,
    created_at: clock.request_created_at,
    actor_ref: {
      actor_id: input.primary_actor_id,
      actor_type: 'human',
      session_id: input.session_id
    },
    authority_ref: {
      authority_id: input.authority_id,
      authority_version: '1',
      authority_hash: sha256Digest({
        authority_id: input.authority_id,
        authority_version: 1,
        state: 'ACTIVE'
      })
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: input.target_id,
      target_type: 'mock_bank_risk_engine'
    },
    request_payload_hash: sha256Digest({
      operation_name: input.operation_name,
      operation_scope: input.operation_scope,
      risk_class: input.risk_class,
      control_window: input.control_window
    })
  });
}

function createPolicy(requestEnvelope, input, clock) {
  return createPolicyDecision({
    decision_id: `POLDEC-${input.demo_id}`,
    action_id: input.action_id,
    policy_version: 'POLICY-L1-BANK-CYBER-DEMO-2026-09-25',
    evaluated_at: clock.policy_evaluated_at,
    request_hash: requestEnvelope.request_hash,
    input_facts: {
      action_class: 'BANK_CRITICAL_ACTION',
      target_id: input.target_id,
      operation_name: input.operation_name,
      operation_scope: input.operation_scope,
      risk_class: input.risk_class,
      control_window: input.control_window
    },
    decision: POLICY_DECISION.DUAL_CONTROL_REQUIRED,
    rule_ids: [
      'BANK_CRITICAL_ACTION_REQUIRES_DUAL_CONTROL',
      'RISK_CLASS_HIGH_REQUIRES_PRECOMMIT',
      'TARGET_RECEIPT_REQUIRED',
      'REVOCATION_CHECK_REQUIRED'
    ],
    denial_reasons: [],
    required_controls: [
      REQUIRED_CONTROL.DUAL_CONTROL,
      REQUIRED_CONTROL.PRECOMMIT,
      REQUIRED_CONTROL.TARGET_RECEIPT,
      REQUIRED_CONTROL.REVOCATION_CHECK
    ]
  });
}

function createCriticalAction(requestEnvelope, policyDecision, input) {
  const dualControlHash = sha256Digest({
    primary_actor_id: input.primary_actor_id,
    secondary_actor_id: input.secondary_actor_id,
    authority_id: input.authority_id,
    control_window: input.control_window
  });

  const precommitPayload = {
    action_id: input.action_id,
    request_hash: requestEnvelope.request_hash,
    policy_decision_hash: policyDecision.policy_decision_hash,
    dual_control_hash: dualControlHash,
    scope_hash: sha256Digest({
      allowed_targets: [input.target_id],
      allowed_operations: [input.operation_name],
      allowed_scopes: [input.operation_scope],
      risk_class: input.risk_class
    })
  };

  const precommitHash = sha256Digest(precommitPayload);

  const criticalActionBody = {
    proto: 'HBCE-P0-CRITICAL-ACTION-v1',
    kind: 'HBCE_P0_CRITICAL_ACTION',
    action_id: input.action_id,
    state: 'PRECOMMITTED',
    request_hash: requestEnvelope.request_hash,
    policy_decision_hash: policyDecision.policy_decision_hash,
    dual_control_hash: dualControlHash,
    dual_control_required: true,
    dual_control_observed: true,
    precommit_hash: precommitHash,
    dispatch_created: false,
    physical_execution_performed: false,
    demo_only: true
  };

  return {
    ...criticalActionBody,
    critical_action_hash: sha256Digest(criticalActionBody)
  };
}

function createEventChain(requestEnvelope, criticalAction, input, clock) {
  const eventOneBody = {
    event_id: `EVT-${input.demo_id}-0001`,
    event_type: 'REQUEST_RECORDED',
    sequence_number: 1,
    previous_event_hash: null,
    payload_hash: requestEnvelope.request_hash,
    emitted_at: clock.event_one_at,
    dispatch_created: false,
    physical_execution_performed: false
  };

  const eventOne = {
    ...eventOneBody,
    event_hash: sha256Digest(eventOneBody)
  };

  const eventTwoBody = {
    event_id: `EVT-${input.demo_id}-0002`,
    event_type: 'DUAL_CONTROL_RECORDED',
    sequence_number: 2,
    previous_event_hash: eventOne.event_hash,
    payload_hash: criticalAction.dual_control_hash,
    emitted_at: clock.event_two_at,
    dispatch_created: false,
    physical_execution_performed: false
  };

  const eventTwo = {
    ...eventTwoBody,
    event_hash: sha256Digest(eventTwoBody)
  };

  const eventThreeBody = {
    event_id: `EVT-${input.demo_id}-0003`,
    event_type: 'PRECOMMIT_RECORDED',
    sequence_number: 3,
    previous_event_hash: eventTwo.event_hash,
    payload_hash: criticalAction.precommit_hash,
    emitted_at: clock.event_three_at,
    dispatch_created: false,
    physical_execution_performed: false
  };

  const eventThree = {
    ...eventThreeBody,
    event_hash: sha256Digest(eventThreeBody)
  };

  const chainBody = {
    proto: 'HBCE-P0-EVENT-CHAIN-v1',
    kind: 'HBCE_P0_EVENT_CHAIN',
    chain_id: `CHAIN-${input.demo_id}`,
    action_id: input.action_id,
    events: [eventOne, eventTwo, eventThree],
    event_head_hash: eventThree.event_hash,
    dispatch_created: false,
    physical_execution_performed: false
  };

  return {
    ...chainBody,
    event_chain_hash: sha256Digest(chainBody)
  };
}

function createMockTargetReceipt(requestEnvelope, criticalAction, eventChain, input, clock) {
  return createTargetReceipt({
    receipt_id: `RCPT-${input.demo_id}`,
    received_at: clock.receipt_received_at,
    request_hash: requestEnvelope.request_hash,
    critical_action_hash: criticalAction.critical_action_hash,
    precommit_hash: criticalAction.precommit_hash,
    event_chain_hash: eventChain.event_chain_hash,
    event_head_hash: eventChain.event_head_hash,
    target_observation_hash: sha256Digest({
      target_id: input.target_id,
      operation_name: input.operation_name,
      operation_scope: input.operation_scope,
      observed_state: 'mock_acknowledged',
      dual_control_observed: true
    }),
    raw_receipt_hash: sha256Digest({
      demo_target_transaction_id: `TXN-${input.demo_id}`,
      status: 'mock_acknowledged',
      note: 'No real bank/cyber system dispatch occurred.'
    }),
    target_ref: {
      target_id: input.target_id,
      target_type: 'mock_bank_risk_engine'
    },
    target_status: TARGET_RECEIPT_STATUS.ACKNOWLEDGED
  });
}

function runBankCyberCriticalActionDemo(overrides = {}) {
  const input = {
    ...deepClone(DEFAULT_INPUT),
    ...deepClone(overrides)
  };

  const clock = {
    ...deepClone(DEFAULT_DEMO_CLOCK),
    ...(overrides.clock ? deepClone(overrides.clock) : {})
  };

  const requestEnvelope = createRequestEnvelope(input, clock);
  const policyDecision = createPolicy(requestEnvelope, input, clock);
  const criticalAction = createCriticalAction(requestEnvelope, policyDecision, input);
  const eventChain = createEventChain(requestEnvelope, criticalAction, input, clock);
  const targetReceipt = createMockTargetReceipt(
    requestEnvelope,
    criticalAction,
    eventChain,
    input,
    clock
  );

  const evidenceBundle = createEvidenceBundle({
    bundle_id: `BUNDLE-${input.demo_id}`,
    action_id: input.action_id,
    created_at: clock.bundle_created_at,
    request_envelope: requestEnvelope,
    policy_decision: policyDecision,
    critical_action: criticalAction,
    event_chain: eventChain,
    target_receipts: [targetReceipt],
    schema_set: schemaSet(),
    verification_profile: {
      profile_id: 'LEVEL1-B2B-BANK-CYBER-CRITICAL-DEMO',
      profile_version: 'v1',
      result_policy: 'PASS_FAIL_WARN',
      requires_verifier_cli: true
    },
    redaction_profile: {
      profile_id: 'DEMO-MINIMAL',
      profile_version: 'v1',
      mode: 'hashes_and_operational_identifiers_only'
    }
  });

  const verification = verifyEvidenceBundle(evidenceBundle);

  return Object.freeze({
    proto: DEMO_PROTO,
    kind: 'HBCE_P0_BANK_CYBER_CRITICAL_ACTION_DEMO',
    version: 'v1',
    demo_id: input.demo_id,
    result: verification.result,
    reason: verification.reason,
    request_envelope: requestEnvelope,
    policy_decision: policyDecision,
    critical_action: criticalAction,
    event_chain: eventChain,
    target_receipt: targetReceipt,
    evidence_bundle: evidenceBundle,
    verification,
    transcript: [
      {
        step: 'REQUEST_ENVELOPE_CREATED',
        hash: requestEnvelope.request_hash
      },
      {
        step: 'POLICY_DECISION_CREATED',
        decision: policyDecision.decision,
        hash: policyDecision.policy_decision_hash
      },
      {
        step: 'DUAL_CONTROL_RECORDED',
        primary_actor_id: input.primary_actor_id,
        secondary_actor_id: input.secondary_actor_id,
        hash: criticalAction.dual_control_hash
      },
      {
        step: 'PRECOMMIT_CREATED',
        hash: criticalAction.precommit_hash
      },
      {
        step: 'MOCK_BANK_CYBER_RECEIPT_RECORDED',
        hash: targetReceipt.target_receipt_hash
      },
      {
        step: 'EVIDENCE_BUNDLE_EXPORTED',
        hash: evidenceBundle.evidence_bundle_hash
      },
      {
        step: 'VERIFIER_RESULT',
        result: verification.result,
        reason: verification.reason
      }
    ],
    boundary: {
      demo_only: true,
      dispatch_created: false,
      physical_execution_performed: false,
      real_bank_system_called: false,
      real_cyber_system_called: false,
      certifies_compliance: false,
      proves_legal_liability: false,
      proves_physical_truth: false,
      production_ready: false
    }
  });
}

module.exports = Object.freeze({
  DEMO_PROTO,
  DEFAULT_DEMO_CLOCK,
  DEFAULT_INPUT,
  runBankCyberCriticalActionDemo
});
