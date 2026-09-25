'use strict';

const assert = require('node:assert/strict');

const {
  DEFAULT_INPUT,
  runAiToolAccessDemo
} = require('../../../apps/hbce-demo/ai-tool-access-demo-adapter.js');
const {
  verifyEvidenceBundle
} = require('../../../packages/hbce-evidence/p0-evidence-bundle.js');

const demo = runAiToolAccessDemo();

assert.equal(demo.proto, 'HBCE-P0-AI-TOOL-ACCESS-DEMO-v1');
assert.equal(demo.kind, 'HBCE_P0_AI_TOOL_ACCESS_DEMO');
assert.equal(demo.demo_id, DEFAULT_INPUT.demo_id);
assert.equal(demo.result, 'PASS');
assert.equal(demo.reason, 'EVIDENCE_BUNDLE_VALID');

assert.equal(demo.request_envelope.action_binding.action_class, 'AI_TOOL_ACCESS');
assert.equal(demo.policy_decision.decision, 'ALLOW');
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

assert.equal(semanticFlag(demo.policy_decision, 'policy_decision_authorizes_execution'), false);
assert.equal(semanticFlag(demo.policy_decision, 'dispatch_created'), false);
assert.equal(semanticFlag(demo.policy_decision, 'physical_execution_performed'), false);

assert.equal(demo.critical_action.state, 'PRECOMMITTED');
assert.equal(demo.critical_action.dispatch_created, false);
assert.equal(demo.critical_action.physical_execution_performed, false);
assert.match(demo.critical_action.precommit_hash, /^sha256:[a-f0-9]{64}$/);

assert.equal(demo.event_chain.events.length, 2);
assert.equal(demo.event_chain.events[0].event_type, 'REQUEST_RECORDED');
assert.equal(demo.event_chain.events[1].event_type, 'PRECOMMIT_RECORDED');
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
    'PRECOMMIT_CREATED',
    'MOCK_TARGET_RECEIPT_RECORDED',
    'EVIDENCE_BUNDLE_EXPORTED',
    'VERIFIER_RESULT'
  ]
);

assert.equal(demo.boundary.demo_only, true);
assert.equal(demo.boundary.dispatch_created, false);
assert.equal(demo.boundary.physical_execution_performed, false);
assert.equal(demo.boundary.real_tool_called, false);
assert.equal(demo.boundary.certifies_compliance, false);
assert.equal(demo.boundary.proves_legal_liability, false);
assert.equal(demo.boundary.proves_physical_truth, false);
assert.equal(demo.boundary.production_ready, false);

const customDemo = runAiToolAccessDemo({
  demo_id: 'DEMO-L1-AI-TOOL-ACCESS-CUSTOM',
  action_id: 'ACTION-L1-AI-TOOL-DEMO-CUSTOM',
  request_id: 'REQ-L1-AI-TOOL-DEMO-CUSTOM',
  idempotency_key: 'IDEM-L1-AI-TOOL-DEMO-CUSTOM',
  actor_id: 'ACTOR-L1-AI-REVIEWER-CUSTOM',
  session_id: 'SESSION-L1-AI-TOOL-DEMO-CUSTOM',
  authority_id: 'AUT-L1-AI-TOOL-DEMO-CUSTOM',
  target_id: 'TARGET-L1-MOCK-AI-TOOL-CUSTOM',
  tool_name: 'repo.diff',
  tool_scope: 'demo.patch',
  risk_class: 'LOW'
});

assert.equal(customDemo.demo_id, 'DEMO-L1-AI-TOOL-ACCESS-CUSTOM');
assert.equal(customDemo.result, 'PASS');
assert.equal(customDemo.request_envelope.action_binding.action_class, 'AI_TOOL_ACCESS');
assert.equal(customDemo.boundary.real_tool_called, false);

console.log('PASS PROG-014-AI-TOOL-DEMO-CREATES-FULL-EVIDENCE-FLOW');
console.log('PASS PROG-014-AI-TOOL-DEMO-VERIFIES-EVIDENCE-BUNDLE');
console.log('PASS PROG-014-AI-TOOL-DEMO-DOES-NOT-DISPATCH-OR-EXECUTE');
console.log('PASS PROG-014-AI-TOOL-DEMO-TRANSCRIPT-IS-DETERMINISTIC');
console.log('PASS PROG-014-AI-TOOL-DEMO-SUPPORTS-CUSTOM_INPUT');
