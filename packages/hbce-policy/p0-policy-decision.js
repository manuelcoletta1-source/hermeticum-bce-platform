'use strict';

const { sha256Digest } = require('../hbce-core/canonical-json.js');
const { failClosed } = require('../hbce-api-contract/errors.js');

const POLICY_DECISION = Object.freeze({
  ALLOW: 'ALLOW',
  DENY: 'DENY',
  SAFE_HOLD: 'SAFE_HOLD',
  DUAL_CONTROL_REQUIRED: 'DUAL_CONTROL_REQUIRED'
});

const REQUIRED_CONTROL = Object.freeze({
  HUMAN_APPROVAL: 'HUMAN_APPROVAL',
  PRECOMMIT: 'PRECOMMIT',
  TARGET_RECEIPT: 'TARGET_RECEIPT',
  DUAL_CONTROL: 'DUAL_CONTROL',
  REVOCATION_CHECK: 'REVOCATION_CHECK',
  POLICY_REVIEW: 'POLICY_REVIEW'
});

const POLICY_DECISION_STATE = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID'
});

const DIGEST_RE = /^sha256:[a-f0-9]{64}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,159}$/;
const TOKEN_RE = /^[A-Z0-9][A-Z0-9._:-]{1,119}$/;
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
    failClosed('POLICY_DECISION_OBJECT_INVALID', `${path} must be a plain object`, { path });
  }
}

function assertPattern(value, pattern, code, path) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    failClosed(code, `${path} has invalid format`, { path });
  }
}

function assertId(value, path) {
  assertPattern(value, ID_RE, 'POLICY_DECISION_ID_INVALID', path);
}

function assertToken(value, path) {
  assertPattern(value, TOKEN_RE, 'POLICY_DECISION_TOKEN_INVALID', path);
}

function assertDigest(value, path) {
  assertPattern(value, DIGEST_RE, 'POLICY_DECISION_DIGEST_INVALID', path);
}

function assertTimestamp(value, path) {
  assertPattern(value, ISO_UTC_RE, 'POLICY_DECISION_TIMESTAMP_INVALID', path);

  if (Number.isNaN(Date.parse(value))) {
    failClosed('POLICY_DECISION_TIMESTAMP_INVALID', `${path} is not parseable`, { path });
  }
}

function normalizeStringArray(value, path, options = {}) {
  const allowEmpty = options.allowEmpty === true;

  if (!Array.isArray(value)) {
    failClosed('POLICY_DECISION_ARRAY_INVALID', `${path} must be an array`, { path });
  }

  if (!allowEmpty && value.length === 0) {
    failClosed('POLICY_DECISION_ARRAY_EMPTY', `${path} must not be empty`, { path });
  }

  const seen = new Set();

  return value.map((item, index) => {
    assertToken(item, `${path}[${index}]`);

    if (seen.has(item)) {
      failClosed('POLICY_DECISION_ARRAY_DUPLICATE', `${path} contains duplicate value`, {
        path,
        value: item
      });
    }

    seen.add(item);
    return item;
  });
}

function assertDecision(value) {
  if (!Object.values(POLICY_DECISION).includes(value)) {
    failClosed('POLICY_DECISION_VALUE_INVALID', 'decision is invalid', { decision: value });
  }
}

function normalizeInputFactsHash(context) {
  if (typeof context.input_facts_hash === 'string') {
    assertDigest(context.input_facts_hash, 'input_facts_hash');
    return context.input_facts_hash;
  }

  if (!isPlainObject(context.input_facts)) {
    failClosed(
      'POLICY_DECISION_INPUT_FACTS_INVALID',
      'input_facts must be provided when input_facts_hash is absent'
    );
  }

  return sha256Digest(context.input_facts);
}

function enforceDecisionSemantics(decision, denialReasons, requiredControls) {
  if (decision === POLICY_DECISION.ALLOW && denialReasons.length !== 0) {
    failClosed('POLICY_DECISION_ALLOW_WITH_DENIAL_REASONS', 'ALLOW decisions must not include denial_reasons');
  }

  if (decision === POLICY_DECISION.DENY && denialReasons.length === 0) {
    failClosed('POLICY_DECISION_DENY_WITHOUT_REASONS', 'DENY decisions require denial_reasons');
  }

  if (
    decision === POLICY_DECISION.SAFE_HOLD &&
    denialReasons.length === 0 &&
    requiredControls.length === 0
  ) {
    failClosed(
      'POLICY_DECISION_SAFE_HOLD_WITHOUT_CONTEXT',
      'SAFE_HOLD decisions require denial_reasons or required_controls'
    );
  }

  if (
    decision === POLICY_DECISION.DUAL_CONTROL_REQUIRED &&
    !requiredControls.includes(REQUIRED_CONTROL.DUAL_CONTROL)
  ) {
    failClosed(
      'POLICY_DECISION_DUAL_CONTROL_REQUIRED_MISSING_CONTROL',
      'DUAL_CONTROL_REQUIRED decisions must include DUAL_CONTROL in required_controls'
    );
  }
}

function attachPolicyDecisionHash(body) {
  const copy = deepCloneJson(body);
  delete copy.policy_decision_hash;

  return deepFreeze({
    ...body,
    policy_decision_hash: sha256Digest(copy)
  });
}

function createPolicyDecision(input) {
  const context = input && typeof input === 'object' ? input : {};

  assertId(context.decision_id, 'decision_id');
  assertId(context.action_id, 'action_id');
  assertId(context.policy_version, 'policy_version');
  assertTimestamp(context.evaluated_at, 'evaluated_at');
  assertDigest(context.request_hash, 'request_hash');

  const input_facts_hash = normalizeInputFactsHash(context);
  const decision = context.decision;

  assertDecision(decision);

  const rule_ids = normalizeStringArray(context.rule_ids, 'rule_ids');
  const denial_reasons = normalizeStringArray(
    Array.isArray(context.denial_reasons) ? context.denial_reasons : [],
    'denial_reasons',
    { allowEmpty: true }
  );
  const required_controls = normalizeStringArray(
    Array.isArray(context.required_controls) ? context.required_controls : [],
    'required_controls',
    { allowEmpty: true }
  );

  enforceDecisionSemantics(decision, denial_reasons, required_controls);

  const body = {
    proto: 'HBCE-P0-POLICY-DECISION-v1',
    kind: 'HBCE_P0_POLICY_DECISION',
    version: 'v1',
    decision_id: context.decision_id,
    action_id: context.action_id,
    policy_version: context.policy_version,
    evaluated_at: context.evaluated_at,
    request_hash: context.request_hash,
    input_facts_hash,
    decision,
    rule_ids,
    denial_reasons,
    required_controls,
    policy_semantics: {
      policy_decision_is_authorization: false,
      policy_decision_authorizes_execution: false,
      requires_separate_authorization: true,
      requires_precommit_before_execution: true
    },
    dispatch_created: false,
    physical_execution_performed: false
  };

  return attachPolicyDecisionHash(body);
}

function assertPolicyDecisionShape(policyDecision) {
  assertPlainObject(policyDecision, 'policyDecision');

  if (policyDecision.proto !== 'HBCE-P0-POLICY-DECISION-v1') {
    failClosed('POLICY_DECISION_PROTO_INVALID', 'policyDecision.proto is invalid');
  }

  if (policyDecision.kind !== 'HBCE_P0_POLICY_DECISION') {
    failClosed('POLICY_DECISION_KIND_INVALID', 'policyDecision.kind is invalid');
  }

  assertId(policyDecision.decision_id, 'decision_id');
  assertId(policyDecision.action_id, 'action_id');
  assertId(policyDecision.policy_version, 'policy_version');
  assertTimestamp(policyDecision.evaluated_at, 'evaluated_at');
  assertDigest(policyDecision.request_hash, 'request_hash');
  assertDigest(policyDecision.input_facts_hash, 'input_facts_hash');
  assertDigest(policyDecision.policy_decision_hash, 'policy_decision_hash');
  assertDecision(policyDecision.decision);

  const rule_ids = normalizeStringArray(policyDecision.rule_ids, 'rule_ids');
  const denial_reasons = normalizeStringArray(policyDecision.denial_reasons, 'denial_reasons', {
    allowEmpty: true
  });
  const required_controls = normalizeStringArray(policyDecision.required_controls, 'required_controls', {
    allowEmpty: true
  });

  enforceDecisionSemantics(policyDecision.decision, denial_reasons, required_controls);

  if (!isPlainObject(policyDecision.policy_semantics)) {
    failClosed('POLICY_DECISION_SEMANTICS_INVALID', 'policy_semantics must be an object');
  }

  if (
    policyDecision.policy_semantics.policy_decision_is_authorization !== false ||
    policyDecision.policy_semantics.policy_decision_authorizes_execution !== false ||
    policyDecision.policy_semantics.requires_separate_authorization !== true ||
    policyDecision.policy_semantics.requires_precommit_before_execution !== true
  ) {
    failClosed('POLICY_DECISION_SEMANTICS_INVALID', 'policy decision semantics are invalid');
  }

  if (
    policyDecision.dispatch_created !== false ||
    policyDecision.physical_execution_performed !== false
  ) {
    failClosed(
      'POLICY_DECISION_EFFECT_BOUNDARY_INVALID',
      'policy decision must not create dispatch or physical execution'
    );
  }

  return {
    rule_ids,
    denial_reasons,
    required_controls
  };
}

function verifyPolicyDecision(policyDecisionInput) {
  assertPolicyDecisionShape(policyDecisionInput);

  const withoutHash = deepCloneJson(policyDecisionInput);
  delete withoutHash.policy_decision_hash;

  const recomputed = sha256Digest(withoutHash);

  if (recomputed !== policyDecisionInput.policy_decision_hash) {
    failClosed('POLICY_DECISION_HASH_MISMATCH', 'policy decision hash mismatch', {
      expected: recomputed,
      actual: policyDecisionInput.policy_decision_hash
    });
  }

  return deepFreeze({
    state: POLICY_DECISION_STATE.VALID,
    reason: 'POLICY_DECISION_VALID',
    decision_id: policyDecisionInput.decision_id,
    action_id: policyDecisionInput.action_id,
    policy_version: policyDecisionInput.policy_version,
    request_hash: policyDecisionInput.request_hash,
    decision: policyDecisionInput.decision,
    policy_decision_hash: policyDecisionInput.policy_decision_hash,
    policy_decision_authorizes_execution: false
  });
}

function assertPolicyDecisionBoundToRequest(policyDecisionInput, requestHash) {
  const verified = verifyPolicyDecision(policyDecisionInput);
  assertDigest(requestHash, 'request_hash');

  if (policyDecisionInput.request_hash !== requestHash) {
    failClosed('POLICY_DECISION_REQUEST_HASH_MISMATCH', 'policy decision request_hash mismatch', {
      expected: requestHash,
      actual: policyDecisionInput.request_hash
    });
  }

  return deepFreeze({
    state: POLICY_DECISION_STATE.VALID,
    reason: 'POLICY_DECISION_BOUND_TO_REQUEST',
    decision_id: verified.decision_id,
    action_id: verified.action_id,
    request_hash: verified.request_hash,
    policy_decision_hash: verified.policy_decision_hash,
    policy_decision_authorizes_execution: false
  });
}

module.exports = Object.freeze({
  POLICY_DECISION,
  REQUIRED_CONTROL,
  POLICY_DECISION_STATE,
  createPolicyDecision,
  verifyPolicyDecision,
  assertPolicyDecisionBoundToRequest
});
