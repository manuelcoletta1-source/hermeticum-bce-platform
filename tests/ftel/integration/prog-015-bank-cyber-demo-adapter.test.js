'use strict';

const assert = require('node:assert/strict');

const {
  DEFAULT_INPUT,
  runBankCyberCriticalActionDemo
} = require('../../../apps/hbce-demo/bank-cyber-critical-action-demo-adapter.js');
const {
  REQUIRED_CONTROL
} = require('../../../packages/hbce-policy/p0-policy-decision.js');
const {
  verifyEvidenceBundle
} = require('../../../packages/hbce-evidence/p0-evidence-bundle.js');

function semanticFlag(object, directKey) {
  if (!object || typeof object !== 'object') {
    return undefined;
  }

  if (Object.hasOwn(object, directKey)) {
    return object[directKey];
  }

  for (const nestedKey of [
    'semantics',
    'policy_decision_semantics',
    'execution_semantics',
    'runtime_semantics',
    'receipt_semantics',
    'target_receipt_semantics',
    'bundle_semantics',
    'commercial_semantics'
  ]) {
    if (
      object[nestedKey] &&
      typeof object[nestedKey] === 'object' &&
      Object.hasOwn(object[nestedKey], directKey)
    ) {
      return object[nestedKey][directKey];
    }
  }

  for (const value of Object.values(object)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.hasOwn(value, directKey)
    ) {
      return value[directKey];
    }
  }

  return undefined;
}

const demo = runBankCyberCriticalActionDemo();

assert.equal(demo.proto, 'HBCE-P0-BANK-CYBER-CRITICAL-ACTION-DEMO-v1');
assert.equal(demo.kind, 'HBCE_P0_BANK_CYBER_CRITICAL_ACTION_DEMO');
assert.equal(demo.demo_id, DEFAULT_INPUT.demo_id);
assert.equal(demo.result, 'PASS');
assert.equal(demo.reason, 'EVIDENCE_BUNDLE_VALID');

assert.equal(demo.request_envelope.action_binding.action_class, 'BANK_CRITICAL_ACTION');
assert.equal(demo.policy_decision.decision, 'DUAL_CONTROL_REQUIRED');
assert.equal(demo.policy_decision.required_controls.includes(REQUIRED_CONTROL.DUAL_CONTROL), true);
assert.equal(demo.policy_decision.required_controls.includes(REQUIRED_CONTROL.PRECOMMIT), true);
assert.equal(demo.policy_decision.required_controls.includes(REQUIRED_CONTROL.TARGET_RECEIPT), true);
assert.equal(semanticFlag(demo.policy_decision, 'policy_decision_authorizes_execution'), false);
assert.notEqual(semanticFlag(demo.policy_decision, 'dispatch_created'), true);
assert.notEqual(semanticFlag(demo.policy_decision, 'physical_execution_performed'), true);

assert.equal(demo.critical_action.state, 'PRECOMMITTED');
assert.equal(demo.critical_action.dual_control_required, true);
assert.equal(demo.critical_action.dual_control_observed, true);
assert.equal(demo.critical_action.dispatch_created, false);
assert.equal(demo.critical_action.physical_execution_performed, false);
assert.match(demo.critical_action.dual_control_hash, /^sha256:[a-f0-9]{64}$/);
assert.match(demo.critical_action.precommit_hash, /^sha256:[a-f0-9]{64}$/);

assert.equal(demo.event_chain.events.length, 3);
assert.equal(demo.event_chain.events[0].event_type, 'REQUEST_RECORDED');
assert.equal(demo.event_chain.events[1].event_type, 'DUAL_CONTROL_RECORDED');
assert.equal(demo.event_chain.events[2].event_type, 'PRECOMMIT_RECORDED');
assert.equal(demo.event_chain.dispatch_created, false);
assert.equal(demo.event_chain.physical_execution_performed, false);

assert.equal(semanticFlag(demo.target_receipt, 'receipt_proves_physical_effect'), false);
assert.equal(semanticFlag(demo.target_receipt, 'receipt_authorizes_execution'), false);
assert.notEqual(semanticFlag(demo.target_receipt, 'dispatch_created'), true);
assert.notEqual(semanticFlag(demo.target_receipt, 'physical_execution_performed'), true);

assert.equal(demo.evidence_bundle.bundle_semantics.evidence_bundle_certifies_compliance, false);
assert.equal(demo.evidence_bundle.bundle_semantics.evidence_bundle_proves_legal_liability, false);
assert.equal(demo.evidence_bundle.bundle_semantics.evidence_bundle_proves_physical_truth, false);
assert.equal(demo.evidence_bundle.commercial_semantics.contains_pricing_logic, false);
assert.equal(demo.evidence_bundle.commercial_semantics.contains_procurement_offer, false);

const verifiedAgain = verifyEvidenceBundle(demo.evidence_bundle);
assert.equal(verifiedAgain.result, 'PASS');
assert.equal(verifiedAgain.reason, 'EVIDENCE_BUNDLE_VALID');

assert.deepEqual(
  demo.transcript.map((entry) => entry.step),
  [
    'REQUEST_ENVELOPE_CREATED',
    'POLICY_DECISION_CREATED',
    'DUAL_CONTROL_RECORDED',
    'PRECOMMIT_CREATED',
    'MOCK_BANK_CYBER_RECEIPT_RECORDED',
    'EVIDENCE_BUNDLE_EXPORTED',
    'VERIFIER_RESULT'
  ]
);

assert.equal(demo.boundary.demo_only, true);
assert.equal(demo.boundary.dispatch_created, false);
assert.equal(demo.boundary.physical_execution_performed, false);
assert.equal(demo.boundary.real_bank_system_called, false);
assert.equal(demo.boundary.real_cyber_system_called, false);
assert.equal(demo.boundary.certifies_compliance, false);
assert.equal(demo.boundary.proves_legal_liability, false);
assert.equal(demo.boundary.proves_physical_truth, false);
assert.equal(demo.boundary.production_ready, false);

const customDemo = runBankCyberCriticalActionDemo({
  demo_id: 'DEMO-L1-BANK-CYBER-CRITICAL-CUSTOM',
  action_id: 'ACTION-L1-BANK-CRITICAL-DEMO-CUSTOM',
  request_id: 'REQ-L1-BANK-CRITICAL-DEMO-CUSTOM',
  idempotency_key: 'IDEM-L1-BANK-CRITICAL-DEMO-CUSTOM',
  primary_actor_id: 'ACTOR-L1-RISK-OPERATOR-CUSTOM',
  secondary_actor_id: 'ACTOR-L1-CYBER-APPROVER-CUSTOM',
  session_id: 'SESSION-L1-BANK-CRITICAL-DEMO-CUSTOM',
  authority_id: 'AUT-L1-BANK-CRITICAL-DEMO-CUSTOM',
  target_id: 'TARGET-L1-MOCK-BANK-RISK-ENGINE-CUSTOM',
  operation_name: 'cyber.exception.review',
  operation_scope: 'demo-exception-policy',
  risk_class: 'HIGH',
  control_window: 'DEMO_CHANGE_WINDOW_CUSTOM'
});

assert.equal(customDemo.demo_id, 'DEMO-L1-BANK-CYBER-CRITICAL-CUSTOM');
assert.equal(customDemo.result, 'PASS');
assert.equal(customDemo.request_envelope.action_binding.action_class, 'BANK_CRITICAL_ACTION');
assert.equal(customDemo.policy_decision.decision, 'DUAL_CONTROL_REQUIRED');
assert.equal(customDemo.boundary.real_bank_system_called, false);
assert.equal(customDemo.boundary.real_cyber_system_called, false);

console.log('PASS PROG-015-BANK-CYBER-DEMO-CREATES-DUAL-CONTROL-FLOW');
console.log('PASS PROG-015-BANK-CYBER-DEMO-VERIFIES-EVIDENCE-BUNDLE');
console.log('PASS PROG-015-BANK-CYBER-DEMO-DOES-NOT-DISPATCH-OR-EXECUTE');
console.log('PASS PROG-015-BANK-CYBER-DEMO-TRANSCRIPT-IS-DETERMINISTIC');
console.log('PASS PROG-015-BANK-CYBER-DEMO-SUPPORTS-CUSTOM_INPUT');
