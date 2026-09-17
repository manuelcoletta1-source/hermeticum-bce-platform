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
      state: 'ACTIVE'
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
