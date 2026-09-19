'use strict';

const assert = require('node:assert/strict');

const {
  computePayloadSha256
} = require('../../runtime/policy/verify-policy-evaluation-payload');

const {
  verifyPolicyEvaluationGenealogy
} = require('../../runtime/policy/verify-policy-evaluation-genealogy');

const {
  validatePolicyEvaluation
} = require('../../runtime/policy/validate-policy-evaluation');

let passed = 0;

function check(name, current, previous, state, reason) {
  assert.deepEqual(
    verifyPolicyEvaluationGenealogy(current, previous),
    { state, reason },
    name
  );
  console.log('PASS ' + name);
  passed += 1;
}

function seal(document) {
  const value = {
    ...document,
    genealogy: { ...document.genealogy }
  };
  value.payload_sha256 = computePayloadSha256(value);
  return value;
}

const base = {
  proto: 'HBCE-POLICY-EVALUATION-v1',
  kind: 'HBCE_CORE_POLICY_EVALUATION',
  version: 'v1',
  policy_evaluation_id: 'PEV-SF072B-001',
  policy_evaluation_version: 1,
  authority_ref: 'AUT-001',
  authority_version: 1,
  authority_sha256: 'a'.repeat(64),
  policy_ref: 'POLICY-001',
  policy_version: 1,
  policy_sha256: 'b'.repeat(64),
  action_binding: {
    action_class: 'READ',
    target_ref: 'TARGET-001',
    action_sha256: 'c'.repeat(64),
    request_sha256: 'd'.repeat(64)
  },
  state: 'FAIL',
  evaluated_at: '2026-09-19T09:45:00+02:00',
  evidence_state: 'MISSING',
  evidence_reference: null,
  payload_sha256: '0'.repeat(64),
  append_only: true
};

const previous = seal({
  ...base,
  genealogy: {
    derived_from: null,
    previous_state: null,
    new_state: 'FAIL',
    cause: 'INITIAL_EVALUATION',
    evidence_reference: null,
    timestamp: '2026-09-19T10:00:00+02:00',
    hash: 'a'.repeat(64)
  }
});

const current = seal({
  ...base,
  policy_evaluation_id: 'PEV-SF072B-002',
  policy_evaluation_version: 2,
  genealogy: {
    derived_from: previous.policy_evaluation_id,
    previous_state: previous.state,
    new_state: 'FAIL',
    cause: 'REVISION_EVALUATION',
    evidence_reference: null,
    timestamp: '2026-09-19T10:01:00+02:00',
    hash: previous.payload_sha256
  }
});

assert.equal(validatePolicyEvaluation(previous).state, 'VALID');
assert.equal(validatePolicyEvaluation(current).state, 'VALID');

check(
  'VALID_CONSECUTIVE_PAIR',
  current, previous,
  'VALID', 'POLICY_EVALUATION_GENEALOGY_PAIR_VERIFIED'
);

check(
  'GENESIS_DEFERRED',
  previous, null,
  'INVALID', 'POLICY_EVALUATION_GENESIS_ANCHOR_DEFERRED'
);

check(
  'PREVIOUS_MISSING',
  current, null,
  'INVALID', 'POLICY_EVALUATION_PREVIOUS_STRUCTURE_INVALID'
);

check(
  'CURRENT_STRUCTURE_INVALID',
  { ...current, proto: 'WRONG' }, previous,
  'INVALID', 'POLICY_EVALUATION_CURRENT_STRUCTURE_INVALID'
);

check(
  'CURRENT_PAYLOAD_MISMATCH',
  { ...current, cause: 'UNCOMMITTED_CHANGE' }, previous,
  'INVALID', 'POLICY_EVALUATION_CURRENT_PAYLOAD_INVALID'
);

check(
  'PREVIOUS_STRUCTURE_INVALID',
  current, { ...previous, proto: 'WRONG' },
  'INVALID', 'POLICY_EVALUATION_PREVIOUS_STRUCTURE_INVALID'
);

check(
  'PREVIOUS_PAYLOAD_MISMATCH',
  current, { ...previous, evaluated_at: '2026-09-19T09:46:00+02:00' },
  'INVALID', 'POLICY_EVALUATION_PREVIOUS_PAYLOAD_INVALID'
);

check(
  'VERSION_GAP',
  seal({ ...current, policy_evaluation_version: 3 }), previous,
  'INVALID', 'POLICY_EVALUATION_GENEALOGY_VERSION_MISMATCH'
);

check(
  'PREDECESSOR_ID_MISMATCH',
  seal({
    ...current,
    genealogy: { ...current.genealogy, derived_from: 'PEV-OTHER' }
  }),
  previous,
  'INVALID', 'POLICY_EVALUATION_GENEALOGY_PREDECESSOR_MISMATCH'
);

check(
  'PREVIOUS_STATE_MISMATCH',
  seal({
    ...current,
    genealogy: { ...current.genealogy, previous_state: 'PASS' }
  }),
  previous,
  'INVALID', 'POLICY_EVALUATION_GENEALOGY_PREVIOUS_STATE_MISMATCH'
);

check(
  'PREVIOUS_HASH_MISMATCH',
  seal({
    ...current,
    genealogy: { ...current.genealogy, hash: 'f'.repeat(64) }
  }),
  previous,
  'INVALID', 'POLICY_EVALUATION_GENEALOGY_PREVIOUS_HASH_MISMATCH'
);

console.log(`POLICY_EVALUATION_GENEALOGY=${passed}/11 PASS`);
