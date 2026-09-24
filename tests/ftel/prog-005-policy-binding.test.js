'use strict';

const assert = require('node:assert/strict');
const { sha256Digest } = require('../../packages/hbce-core/canonical-json.js');
const {
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  computeRequestEnvelopeHash
} = require('../../packages/hbce-api-contract/request-envelope.js');
const {
  P0_BINDING_STATE,
  evaluateP0PolicyBinding
} = require('../../packages/hbce-policy/p0-policy-binding.js');

function baseAuthority() {
  return {
    authority_id: 'AUT-P0-001',
    authority_version: 1,
    principal_ref: 'PRINCIPAL-P0-001',
    actor_ref: 'ACTOR-P0-001',
    mandate_ref: 'MND-P0-001',
    mandate_version: 1,
    capability_ref: 'CAP-P0-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-AUTH-P0-001',
    scope: {
      action_classes: ['AI_TOOL_ACCESS'],
      target_refs: ['TARGET-P0-TOOL'],
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
    mandate_id: 'MND-P0-001',
    mandate_version: 1,
    principal_ref: 'PRINCIPAL-P0-001',
    actor_ref: 'ACTOR-P0-001',
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null
  };
}

function baseCapability() {
  return {
    capability_id: 'CAP-P0-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-CAP-P0-001'
  };
}

function baseEnvelope(authority = baseAuthority()) {
  const actionBinding = {
    action_id: 'ACTION-P0-AI-TOOL-ACCESS',
    action_class: 'AI_TOOL_ACCESS',
    action_version: 'v1'
  };

  return {
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'REQ-P0-0001',
    idempotency_key: 'IDEM-P0-0001-REQUEST',
    created_at: '2026-09-24T10:30:00.000Z',
    actor_ref: {
      actor_id: 'ACTOR-P0-001',
      actor_type: 'human',
      session_id: 'SESSION-P0-001'
    },
    authority_ref: {
      authority_id: 'AUT-P0-001',
      authority_version: '1',
      authority_hash: sha256Digest(authority)
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: 'TARGET-P0-TOOL',
      target_type: 'tool'
    },
    request_payload_hash: sha256Digest({
      tool: 'hbce.p0.demo',
      operation: 'preview'
    })
  };
}

function baseInput() {
  const authority = baseAuthority();

  return {
    requestEnvelope: baseEnvelope(authority),
    authority,
    mandate: baseMandate(),
    capability: baseCapability(),
    currentTime: '2026-09-24T10:31:00.000Z'
  };
}

const valid = baseInput();
const result = evaluateP0PolicyBinding(valid);

assert.equal(result.proto, 'HBCE-P0-POLICY-BINDING-v1');
assert.equal(result.kind, 'HBCE_P0_POLICY_BINDING');
assert.equal(result.request_hash, computeRequestEnvelopeHash(valid.requestEnvelope));
assert.equal(result.authority_reference_binding.state, 'VALID');
assert.equal(result.authority_resolution.state, 'VALID');
assert.equal(result.authority_resolution.reason, 'AUTHORITY_VALID');
assert.equal(result.policy_decision.decision, 'UNEVALUATED');
assert.equal(result.policy_decision.reason, 'POLICY_EVALUATION_DEFERRED');
assert.equal(result.authorization_resolution.state, 'UNRESOLVED');
assert.equal(result.authorization_resolution.reason, 'POLICY_NOT_RESOLVED');
assert.equal(result.p0_binding_state, P0_BINDING_STATE.UNRESOLVED);
assert.equal(result.execution_allowed, false);

const loginOnly = baseInput();
loginOnly.authority = null;
loginOnly.login_session = {
  state: 'VALID',
  actor_ref: 'ACTOR-P0-001'
};

const loginOnlyResult = evaluateP0PolicyBinding(loginOnly);
assert.equal(loginOnlyResult.authority_resolution.state, 'MISSING');
assert.equal(loginOnlyResult.authority_resolution.reason, 'AUTHORITY_MISSING');
assert.equal(loginOnlyResult.policy_decision.decision, 'DENY');
assert.equal(loginOnlyResult.authorization_resolution.state, 'DENIED');
assert.equal(loginOnlyResult.execution_allowed, false);
assert.equal(loginOnlyResult.invariant_guard.valid_login_is_not_authority, true);

const mismatchedAuthority = baseInput();
mismatchedAuthority.requestEnvelope = {
  ...mismatchedAuthority.requestEnvelope,
  authority_ref: {
    ...mismatchedAuthority.requestEnvelope.authority_ref,
    authority_hash: sha256Digest({ forged: true })
  }
};

const mismatchedAuthorityResult = evaluateP0PolicyBinding(mismatchedAuthority);
assert.equal(mismatchedAuthorityResult.authority_reference_binding.state, 'INVALID');
assert.equal(mismatchedAuthorityResult.authority_resolution.state, 'INVALID');
assert.equal(mismatchedAuthorityResult.authority_resolution.reason, 'AUTHORITY_REFERENCE_BINDING_MISMATCH');
assert.equal(mismatchedAuthorityResult.policy_decision.decision, 'DENY');
assert.equal(mismatchedAuthorityResult.authorization_resolution.state, 'DENIED');

const outOfScope = baseInput();
outOfScope.requestEnvelope = {
  ...outOfScope.requestEnvelope,
  action_binding: {
    ...outOfScope.requestEnvelope.action_binding,
    action_class: 'BANK_CRITICAL_ACTION',
    action_hash: sha256Digest({
      action_id: 'ACTION-P0-AI-TOOL-ACCESS',
      action_class: 'BANK_CRITICAL_ACTION',
      action_version: 'v1'
    })
  }
};

const outOfScopeResult = evaluateP0PolicyBinding(outOfScope);
assert.equal(outOfScopeResult.authority_resolution.state, 'OUT_OF_SCOPE');
assert.equal(outOfScopeResult.authority_resolution.reason, 'ACTION_CLASS_OUT_OF_SCOPE');
assert.equal(outOfScopeResult.policy_decision.decision, 'DENY');
assert.equal(outOfScopeResult.authorization_resolution.state, 'DENIED');

const policyMismatch = baseInput();
policyMismatch.policyEvaluation = {
  authority_ref: 'AUT-P0-001',
  authority_version: 1,
  authority_sha256: policyMismatch.requestEnvelope.authority_ref.authority_hash.slice('sha256:'.length),
  action_binding: {
    action_class: 'AI_TOOL_ACCESS',
    target_ref: 'TARGET-P0-TOOL',
    action_sha256: policyMismatch.requestEnvelope.action_binding.action_hash.slice('sha256:'.length),
    request_sha256: '0'.repeat(64)
  }
};

const policyMismatchResult = evaluateP0PolicyBinding(policyMismatch);
assert.equal(policyMismatchResult.policy_evaluation_binding.state, 'INVALID');
assert.equal(policyMismatchResult.policy_evaluation_binding.reason, 'POLICY_EVALUATION_BINDING_MISMATCH');
assert.equal(policyMismatchResult.policy_decision.decision, 'DENY');
assert.equal(policyMismatchResult.authorization_resolution.state, 'DENIED');

assert.throws(
  () => evaluateP0PolicyBinding({
    ...baseInput(),
    requestEnvelope: {
      ...baseInput().requestEnvelope,
      request_payload_hash: 'sha256:BAD'
    }
  }),
  /request_payload_hash has invalid format/
);

assert.equal(Object.hasOwn(result, 'authorization'), false);
assert.equal(Object.hasOwn(result, 'dispatch'), false);
assert.equal(Object.hasOwn(result, 'execution'), false);

console.log('PASS PROG-005-POLICY-BINDING-ADAPTER-USES-RUNTIME');
console.log('PASS PROG-005-VALID-LOGIN-IS-NOT-AUTHORITY');
console.log('PASS PROG-005-AUTHORITY-REFERENCE-MISMATCH-FAILS-CLOSED');
console.log('PASS PROG-005-POLICY-EVALUATION-BINDING-MISMATCH-FAILS-CLOSED');
console.log('PASS PROG-005-NO-EXECUTION-AUTHORIZATION-EMITTED');
