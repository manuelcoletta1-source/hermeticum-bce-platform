'use strict';

const assert = require('node:assert/strict');

const {
  RESULT,
  resolveAuthority
} = require('../../runtime/authority/resolve-authority.js');

function baseFixture() {
  return {
    authority: {
      authority_id: 'AUT-TEST-001',
      authority_version: 1,
      principal_ref: 'PRINCIPAL-001',
      actor_ref: 'ACTOR-001',
      mandate_ref: 'MND-TEST-001',
      mandate_version: 1,
      capability_ref: 'CAP-TEST-001',
      capability_version: 1,
      state: 'ACTIVE',
      evidence_state: 'PRESENT',
      evidence_reference: 'EVT-AUTH-001',
      scope: {
        action_classes: ['READ'],
        target_refs: ['TARGET-001'],
        iospace_refs: ['IOSPACE-001'],
        constraint_refs: []
      },
      limits: {
        policy_refs: [],
        quantitative_limit_refs: [],
        condition_refs: []
      }
    },
    mandate: {
      mandate_id: 'MND-TEST-001',
      mandate_version: 1,
      principal_ref: 'PRINCIPAL-001',
      actor_ref: 'ACTOR-001',
      state: 'ACTIVE'
    },
    capability: {
      capability_id: 'CAP-TEST-001',
      capability_version: 1,
      state: 'ACTIVE',
      evidence_state: 'PRESENT',
      evidence_reference: 'EVT-CAP-001'
    },
    request: {
      action_class: 'READ',
      target_ref: 'TARGET-001',
      iospace_ref: 'IOSPACE-001'
    },
    currentTime: '2026-09-17T12:00:00Z'
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const vectors = [];

function test(name, fn) {
  vectors.push({ name, fn });
}

test('TV-AUTH-001 AUTHORITY_MISSING=>MISSING', () => {
  const x = baseFixture();
  x.authority = null;
  assert.equal(resolveAuthority(x).state, RESULT.MISSING);
});

test('TV-AUTH-002 AUTHORITY_REVOKED=>REVOKED', () => {
  const x = baseFixture();
  x.authority.state = 'REVOKED';
  assert.equal(resolveAuthority(x).state, RESULT.REVOKED);
});

test('TV-AUTH-003 AUTHORITY_EXPIRED=>EXPIRED', () => {
  const x = baseFixture();
  x.authority.state = 'EXPIRED';
  assert.equal(resolveAuthority(x).state, RESULT.EXPIRED);
});

test('TV-AUTH-004 TARGET_MISMATCH=>OUT_OF_SCOPE', () => {
  const x = baseFixture();
  x.request.target_ref = 'TARGET-OTHER';
  assert.equal(resolveAuthority(x).state, RESULT.OUT_OF_SCOPE);
});

test('TV-AUTH-005 ACTION_MISMATCH=>OUT_OF_SCOPE', () => {
  const x = baseFixture();
  x.request.action_class = 'WRITE';
  assert.equal(resolveAuthority(x).state, RESULT.OUT_OF_SCOPE);
});

test('TV-AUTH-006 IOSPACE_MISMATCH=>OUT_OF_SCOPE', () => {
  const x = baseFixture();
  x.request.iospace_ref = 'IOSPACE-OTHER';
  assert.equal(resolveAuthority(x).state, RESULT.OUT_OF_SCOPE);
});

test('TV-AUTH-007 MANDATE_REVOKED=>INVALID', () => {
  const x = baseFixture();
  x.mandate.state = 'REVOKED';
  assert.equal(resolveAuthority(x).state, RESULT.INVALID);
});

test('TV-AUTH-008 MANDATE_VERSION_MISMATCH=>INVALID', () => {
  const x = baseFixture();
  x.mandate.mandate_version = 2;
  assert.equal(resolveAuthority(x).state, RESULT.INVALID);
});

test('TV-AUTH-009 CAPABILITY_MISSING=>INVALID', () => {
  const x = baseFixture();
  x.capability = null;
  assert.equal(resolveAuthority(x).state, RESULT.INVALID);
});

test('TV-AUTH-010 CAPABILITY_VERSION_MISMATCH=>INVALID', () => {
  const x = baseFixture();
  x.capability.capability_version = 2;
  assert.equal(resolveAuthority(x).state, RESULT.INVALID);
});

test('TV-AUTH-011 AUTHORITY_EVIDENCE_MISSING=>INVALID', () => {
  const x = baseFixture();
  x.authority.evidence_state = 'MISSING';
  assert.equal(resolveAuthority(x).state, RESULT.INVALID);
});

test('TV-AUTH-012 ACTOR_MISMATCH=>INVALID', () => {
  const x = baseFixture();
  x.mandate.actor_ref = 'ACTOR-OTHER';
  assert.equal(resolveAuthority(x).state, RESULT.INVALID);
});

test('TV-AUTH-013 PRINCIPAL_MISMATCH=>INVALID', () => {
  const x = baseFixture();
  x.mandate.principal_ref = 'PRINCIPAL-OTHER';
  assert.equal(resolveAuthority(x).state, RESULT.INVALID);
});

test('TV-AUTH-014 UNRESOLVED_LIMIT=>INVALID', () => {
  const x = baseFixture();
  x.authority.limits.policy_refs = ['POLICY-001'];
  const r = resolveAuthority(x);
  assert.equal(r.state, RESULT.INVALID);
  assert.equal(r.reason, 'UNRESOLVED_REQUIRED_AUTHORITY_DEPENDENCY');
});

test('TV-AUTH-015 POSITIVE_CASE_REMAINS_FAIL_CLOSED', () => {
  const x = baseFixture();
  const r = resolveAuthority(x);
  assert.equal(r.state, RESULT.INVALID);
  assert.equal(r.reason, 'POSITIVE_AUTHORITY_RESOLUTION_DEFERRED');
});

test('TV-AUTH-016 NO_AUTHORIZATION_SIDE_EFFECT', () => {
  const x = baseFixture();
  const r = resolveAuthority(x);
  assert.equal(Object.hasOwn(r, 'authorization'), false);
});

test('TV-AUTH-017 NO_DISPATCH_SIDE_EFFECT', () => {
  const x = baseFixture();
  const r = resolveAuthority(x);
  assert.equal(Object.hasOwn(r, 'dispatch'), false);
});

test('TV-AUTH-018 INPUTS_NOT_MUTATED', () => {
  const x = baseFixture();
  const before = clone(x);
  resolveAuthority(x);
  assert.deepEqual(x, before);
});

let passed = 0;

for (const vector of vectors) {
  try {
    vector.fn();
    passed += 1;
    console.log(`PASS ${vector.name}`);
  } catch (error) {
    console.error(`FAIL ${vector.name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

console.log(`VECTOR_COUNT=${vectors.length}`);
console.log(`VECTOR_PASS=${passed}`);
console.log(`VECTOR_FAIL=${vectors.length - passed}`);

if (passed !== vectors.length) {
  process.exit(1);
}

/*
 * HBCE-SF-045 human-accepted Capability lifecycle propagation.
 * These vectors must not enable positive Authority VALID emission.
 */
{
  const base = baseFixture();

  const vectors = [
    ['TV-CAP-001 ACTIVE+PRESENT+EXACT_BINDING=>CONTINUE_FAIL_CLOSED',
      {},
      'INVALID',
      'POSITIVE_AUTHORITY_RESOLUTION_DEFERRED'],

    ['TV-CAP-002 REVOKED=>INVALID',
      { state: 'REVOKED' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-003 EXPIRED=>INVALID',
      { state: 'EXPIRED' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-004 SUPERSEDED=>INVALID',
      { state: 'SUPERSEDED' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-005 DRAFT=>INVALID',
      { state: 'DRAFT' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-006 PENDING=>INVALID',
      { state: 'PENDING' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-007 SUSPENDED=>INVALID',
      { state: 'SUSPENDED' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-008 CONTESTED=>INVALID',
      { state: 'CONTESTED' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-009 COMPROMISED=>INVALID',
      { state: 'COMPROMISED' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-010 UNKNOWN=>INVALID',
      { state: 'UNKNOWN' },
      'INVALID',
      'CAPABILITY_STATE_INVALID'],

    ['TV-CAP-011 LIMITED=>INVALID_FAIL_CLOSED',
      { state: 'LIMITED' },
      'INVALID',
      'CAPABILITY_LIMITED_SEMANTICS_DEFERRED'],

    ['TV-CAP-012 EVIDENCE_MISSING=>INVALID',
      { evidence_state: 'MISSING' },
      'INVALID',
      'CAPABILITY_EVIDENCE_INVALID'],

    ['TV-CAP-013 EVIDENCE_UNKNOWN=>INVALID',
      { evidence_state: 'UNKNOWN' },
      'INVALID',
      'CAPABILITY_EVIDENCE_INVALID'],

    ['TV-CAP-014 EVIDENCE_NOT_APPLICABLE_WITHOUT_JUSTIFICATION=>INVALID',
      { evidence_state: 'NOT_APPLICABLE' },
      'INVALID',
      'CAPABILITY_EVIDENCE_NOT_APPLICABLE_REQUIRES_JUSTIFICATION']
  ];

  let capPass = 0;

  for (const [name, patch, expectedState, expectedReason] of vectors) {
    const context = baseFixture();
    context.capability = {
      ...context.capability,
      ...patch
    };

    const actual = resolveAuthority(context);

    if (
      actual.state !== expectedState ||
      actual.reason !== expectedReason
    ) {
      console.error(
        `FAIL ${name} expected=${expectedState}/${expectedReason} actual=${actual.state}/${actual.reason}`
      );
      process.exit(1);
    }

    console.log(`PASS ${name}`);
    capPass += 1;
  }

  const activeContext = baseFixture();
  const activeSnapshot = JSON.stringify(activeContext.capability);
  const activeResult = resolveAuthority(activeContext);

  if (activeResult.state === 'VALID') {
    console.error('FAIL TV-CAP-015 ACTIVE_MUST_NOT_ENABLE_VALID');
    process.exit(1);
  }
  console.log('PASS TV-CAP-015 ACTIVE_MUST_NOT_ENABLE_VALID');
  capPass += 1;

  if (
    Object.prototype.hasOwnProperty.call(activeResult, 'authorization') ||
    Object.prototype.hasOwnProperty.call(activeResult, 'authorized')
  ) {
    console.error('FAIL TV-CAP-016 ACTIVE_DOES_NOT_EMIT_AUTHORIZATION');
    process.exit(1);
  }
  console.log('PASS TV-CAP-016 ACTIVE_DOES_NOT_EMIT_AUTHORIZATION');
  capPass += 1;

  if (
    Object.prototype.hasOwnProperty.call(activeResult, 'dispatch') ||
    Object.prototype.hasOwnProperty.call(activeResult, 'dispatched')
  ) {
    console.error('FAIL TV-CAP-017 ACTIVE_DOES_NOT_EMIT_DISPATCH');
    process.exit(1);
  }
  console.log('PASS TV-CAP-017 ACTIVE_DOES_NOT_EMIT_DISPATCH');
  capPass += 1;

  if (JSON.stringify(activeContext.capability) !== activeSnapshot) {
    console.error('FAIL TV-CAP-018 CAPABILITY_INPUT_NOT_MUTATED');
    process.exit(1);
  }
  console.log('PASS TV-CAP-018 CAPABILITY_INPUT_NOT_MUTATED');
  capPass += 1;

  console.log(`CAP_VECTOR_COUNT=${capPass}`);
  console.log(`CAP_VECTOR_PASS=${capPass}`);
  console.log('CAP_VECTOR_FAIL=0');
}
