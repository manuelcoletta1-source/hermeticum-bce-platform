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
  createPolicyDecision
} = require('../../../packages/hbce-policy/p0-policy-decision.js');
const {
  TARGET_RECEIPT_STATUS,
  createTargetReceipt
} = require('../../../packages/hbce-targets/p0-target-receipt.js');
const {
  EVIDENCE_BUNDLE_STATE,
  VERIFICATION_RESULT,
  createEvidenceBundle,
  verifyEvidenceBundle
} = require('../../../packages/hbce-evidence/p0-evidence-bundle.js');

function makeRequestEnvelope() {
  const actionBinding = {
    action_id: 'ACTION-P0-BUNDLE-AI-TOOL-ACCESS',
    action_class: 'AI_TOOL_ACCESS',
    action_version: 'v1'
  };

  return enrichRequestEnvelope({
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'REQ-P0-BUNDLE-0001',
    idempotency_key: 'IDEM-P0-BUNDLE-0001',
    created_at: '2026-09-25T12:00:00.000Z',
    actor_ref: {
      actor_id: 'ACTOR-P0-BUNDLE-001',
      actor_type: 'human',
      session_id: 'SESSION-P0-BUNDLE-001'
    },
    authority_ref: {
      authority_id: 'AUT-P0-BUNDLE-001',
      authority_version: '1',
      authority_hash: sha256Digest({
        authority_id: 'AUT-P0-BUNDLE-001',
        authority_version: 1,
        state: 'ACTIVE'
      })
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: 'TARGET-P0-BUNDLE-TOOL',
      target_type: 'mock_tool'
    },
    request_payload_hash: sha256Digest({
      tool: 'repo.read',
      path: 'README.md'
    })
  });
}

const requestEnvelope = makeRequestEnvelope();

const policyDecision = createPolicyDecision({
  decision_id: 'POLDEC-P0-BUNDLE-0001',
  action_id: 'ACTION-P0-BUNDLE-AI-TOOL-ACCESS',
  policy_version: 'POLICY-P0-BUNDLE-2026-09-25',
  evaluated_at: '2026-09-25T12:01:00.000Z',
  request_hash: requestEnvelope.request_hash,
  input_facts: {
    action_class: 'AI_TOOL_ACCESS',
    target_id: 'TARGET-P0-BUNDLE-TOOL',
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

const precommitPayload = {
  action_id: 'ACTION-P0-BUNDLE-AI-TOOL-ACCESS',
  request_hash: requestEnvelope.request_hash,
  policy_decision_hash: policyDecision.policy_decision_hash,
  scope_hash: sha256Digest({
    allowed_targets: ['TARGET-P0-BUNDLE-TOOL'],
    allowed_actions: ['repo.read']
  })
};

const precommitHash = sha256Digest(precommitPayload);

const criticalActionBody = {
  proto: 'HBCE-P0-CRITICAL-ACTION-v1',
  kind: 'HBCE_P0_CRITICAL_ACTION',
  action_id: 'ACTION-P0-BUNDLE-AI-TOOL-ACCESS',
  state: 'PRECOMMITTED',
  request_hash: requestEnvelope.request_hash,
  policy_decision_hash: policyDecision.policy_decision_hash,
  precommit_hash: precommitHash,
  dispatch_created: false,
  physical_execution_performed: false
};

const criticalAction = {
  ...criticalActionBody,
  critical_action_hash: sha256Digest(criticalActionBody)
};

const eventOneBody = {
  event_id: 'EVT-P0-BUNDLE-0001',
  event_type: 'REQUEST_RECORDED',
  sequence_number: 1,
  previous_event_hash: null,
  payload_hash: requestEnvelope.request_hash,
  emitted_at: '2026-09-25T12:01:10.000Z'
};

const eventOne = {
  ...eventOneBody,
  event_hash: sha256Digest(eventOneBody)
};

const eventTwoBody = {
  event_id: 'EVT-P0-BUNDLE-0002',
  event_type: 'PRECOMMIT_RECORDED',
  sequence_number: 2,
  previous_event_hash: eventOne.event_hash,
  payload_hash: precommitHash,
  emitted_at: '2026-09-25T12:01:20.000Z'
};

const eventTwo = {
  ...eventTwoBody,
  event_hash: sha256Digest(eventTwoBody)
};

const eventChainBody = {
  proto: 'HBCE-P0-EVENT-CHAIN-v1',
  kind: 'HBCE_P0_EVENT_CHAIN',
  chain_id: 'CHAIN-P0-BUNDLE-0001',
  action_id: 'ACTION-P0-BUNDLE-AI-TOOL-ACCESS',
  events: [eventOne, eventTwo],
  event_head_hash: eventTwo.event_hash
};

const eventChain = {
  ...eventChainBody,
  event_chain_hash: sha256Digest(eventChainBody)
};

const targetReceipt = createTargetReceipt({
  receipt_id: 'RCPT-P0-BUNDLE-0001',
  received_at: '2026-09-25T12:02:00.000Z',
  request_hash: requestEnvelope.request_hash,
  critical_action_hash: criticalAction.critical_action_hash,
  precommit_hash: criticalAction.precommit_hash,
  event_chain_hash: eventChain.event_chain_hash,
  event_head_hash: eventChain.event_head_hash,
  target_observation_hash: sha256Digest({
    target_id: 'TARGET-P0-BUNDLE-TOOL',
    observed_state: 'completed'
  }),
  raw_receipt_hash: sha256Digest({
    target_transaction_id: 'TXN-P0-BUNDLE-0001',
    status: 'completed'
  }),
  target_ref: {
    target_id: 'TARGET-P0-BUNDLE-TOOL',
    target_type: 'mock_tool'
  },
  target_status: TARGET_RECEIPT_STATUS.ACKNOWLEDGED
});

const schemaSet = [
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
  }
];

const verificationProfile = {
  profile_id: 'LEVEL1-B2B-DEMO',
  profile_version: 'v1',
  result_policy: 'PASS_FAIL_WARN',
  requires_verifier_cli: true
};

const redactionProfile = {
  profile_id: 'DEMO-MINIMAL',
  profile_version: 'v1',
  mode: 'hashes_and_operational_identifiers_only'
};

const bundle = createEvidenceBundle({
  bundle_id: 'BUNDLE-P0-0001',
  action_id: 'ACTION-P0-BUNDLE-AI-TOOL-ACCESS',
  created_at: '2026-09-25T12:03:00.000Z',
  request_envelope: requestEnvelope,
  policy_decision: policyDecision,
  critical_action: criticalAction,
  event_chain: eventChain,
  target_receipts: [targetReceipt],
  schema_set: schemaSet,
  verification_profile: verificationProfile,
  redaction_profile: redactionProfile
});

assert.equal(bundle.proto, 'HBCE-P0-EVIDENCE-BUNDLE-v1');
assert.equal(bundle.kind, 'HBCE_P0_EVIDENCE_BUNDLE');
assert.match(bundle.manifest_hash, /^sha256:[a-f0-9]{64}$/);
assert.match(bundle.evidence_bundle_hash, /^sha256:[a-f0-9]{64}$/);
assert.equal(bundle.manifest.request_hash, requestEnvelope.request_hash);
assert.equal(bundle.manifest.policy_decision_hash, policyDecision.policy_decision_hash);
assert.equal(bundle.manifest.critical_action_hash, criticalAction.critical_action_hash);
assert.equal(bundle.manifest.target_receipt_hashes[0], targetReceipt.target_receipt_hash);
assert.equal(bundle.verification_summary.result, VERIFICATION_RESULT.UNVERIFIED_EXPORT);

const bundleAgain = createEvidenceBundle({
  bundle_id: 'BUNDLE-P0-0001',
  action_id: 'ACTION-P0-BUNDLE-AI-TOOL-ACCESS',
  created_at: '2026-09-25T12:03:00.000Z',
  request_envelope: requestEnvelope,
  policy_decision: policyDecision,
  critical_action: criticalAction,
  event_chain: eventChain,
  target_receipts: [targetReceipt],
  schema_set: schemaSet,
  verification_profile: verificationProfile,
  redaction_profile: redactionProfile
});

assert.equal(bundleAgain.manifest_hash, bundle.manifest_hash);
assert.equal(bundleAgain.evidence_bundle_hash, bundle.evidence_bundle_hash);

const verified = verifyEvidenceBundle(bundle);
assert.equal(verified.state, EVIDENCE_BUNDLE_STATE.VALID);
assert.equal(verified.result, VERIFICATION_RESULT.PASS);
assert.equal(verified.reason, 'EVIDENCE_BUNDLE_VALID');
assert.equal(verified.target_receipt_count, 1);
assert.equal(verified.evidence_bundle_certifies_compliance, false);
assert.equal(verified.evidence_bundle_proves_legal_liability, false);
assert.equal(verified.evidence_bundle_proves_physical_truth, false);

const tamperedPolicyBundle = {
  ...bundle,
  policy_decision: {
    ...bundle.policy_decision,
    required_controls: [REQUIRED_CONTROL.HUMAN_APPROVAL, REQUIRED_CONTROL.PRECOMMIT]
  }
};

assert.throws(
  () => verifyEvidenceBundle(tamperedPolicyBundle),
  /policy decision hash mismatch|evidence bundle hash mismatch|manifest/
);

const tamperedReceiptBundle = {
  ...bundle,
  target_receipts: [
    {
      ...targetReceipt,
      request_hash: sha256Digest({ forged: 'request' })
    }
  ]
};

assert.throws(
  () => verifyEvidenceBundle(tamperedReceiptBundle),
  /TargetReceipt|receipt|hash mismatch|request hash mismatch/i
);

assert.throws(
  () => createEvidenceBundle({
    bundle_id: 'BUNDLE-P0-BAD-NO-RECEIPT',
    action_id: 'ACTION-P0-BUNDLE-AI-TOOL-ACCESS',
    created_at: '2026-09-25T12:04:00.000Z',
    request_envelope: requestEnvelope,
    policy_decision: policyDecision,
    critical_action: criticalAction,
    event_chain: eventChain,
    target_receipts: [],
    schema_set: schemaSet,
    verification_profile: verificationProfile,
    redaction_profile: redactionProfile
  }),
  /target_receipts must be a non-empty array/
);

assert.equal(bundle.bundle_semantics.evidence_bundle_certifies_compliance, false);
assert.equal(bundle.bundle_semantics.evidence_bundle_proves_legal_liability, false);
assert.equal(bundle.bundle_semantics.evidence_bundle_proves_physical_truth, false);
assert.equal(bundle.commercial_semantics.contains_pricing_logic, false);
assert.equal(bundle.commercial_semantics.contains_quotation, false);
assert.equal(bundle.commercial_semantics.contains_procurement_offer, false);
assert.equal(Object.hasOwn(bundle, 'price'), false);
assert.equal(Object.hasOwn(bundle, 'quote'), false);
assert.equal(Object.hasOwn(bundle, 'procurement_offer'), false);

console.log('PASS PROG-011-EVIDENCE-BUNDLE-CREATES-PORTABLE-BUNDLE');
console.log('PASS PROG-011-EVIDENCE-BUNDLE-BINDS-REQUEST-POLICY-RECEIPT');
console.log('PASS PROG-011-EVIDENCE-BUNDLE-VERIFY-DETECTS-TAMPERING');
console.log('PASS PROG-011-EVIDENCE-BUNDLE-REJECTS-MISSING-RECEIPTS');
console.log('PASS PROG-011-EVIDENCE-BUNDLE-DOES-NOT-CERTIFY-LEGAL-OR-COMPLIANCE');
