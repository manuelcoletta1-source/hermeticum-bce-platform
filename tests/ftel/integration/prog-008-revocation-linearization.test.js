'use strict';

const assert = require('node:assert/strict');
const { sha256Digest } = require('../../../packages/hbce-core/canonical-json.js');
const {
  REQUEST_ENVELOPE_SCHEMA_VERSION,
  enrichRequestEnvelope
} = require('../../../packages/hbce-api-contract/request-envelope.js');
const {
  REVOCATION_LINEARIZATION_STATE,
  createRevocationLedger,
  verifyRevocationLedger,
  evaluateRevocationAt
} = require('../../../packages/hbce-trust/p0-revocation-linearization.js');

function baseAuthority() {
  return {
    authority_id: 'AUT-P0-REV-001',
    authority_version: 1,
    principal_ref: 'PRINCIPAL-P0-REV-001',
    actor_ref: 'ACTOR-P0-REV-001',
    mandate_ref: 'MND-P0-REV-001',
    mandate_version: 1,
    capability_ref: 'CAP-P0-REV-001',
    capability_version: 1,
    state: 'ACTIVE',
    valid_from: '2026-01-19T15:30:00Z',
    valid_until: null,
    evidence_state: 'PRESENT',
    evidence_reference: 'EVT-AUTH-P0-REV-001',
    scope: {
      action_classes: ['AI_TOOL_ACCESS'],
      target_refs: ['TARGET-P0-REV-TOOL'],
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

function envelope(authority = baseAuthority()) {
  const actionBinding = {
    action_id: 'ACTION-P0-REV-AI-TOOL-ACCESS',
    action_class: 'AI_TOOL_ACCESS',
    action_version: 'v1'
  };

  return {
    schema_version: REQUEST_ENVELOPE_SCHEMA_VERSION,
    request_id: 'REQ-P0-REV-0001',
    idempotency_key: 'IDEM-P0-REV-0001-REQUEST',
    created_at: '2026-09-24T11:00:00.000Z',
    actor_ref: {
      actor_id: 'ACTOR-P0-REV-001',
      actor_type: 'human',
      session_id: 'SESSION-P0-REV-001'
    },
    authority_ref: {
      authority_id: 'AUT-P0-REV-001',
      authority_version: '1',
      authority_hash: sha256Digest(authority)
    },
    action_binding: {
      ...actionBinding,
      action_hash: sha256Digest(actionBinding)
    },
    target_ref: {
      target_id: 'TARGET-P0-REV-TOOL',
      target_type: 'tool'
    },
    request_payload_hash: sha256Digest({
      tool: 'hbce.p0.revocation.demo',
      operation: 'preview'
    })
  };
}

function revocation(authorityRef, patch = {}) {
  return {
    revocation_id: 'REV-P0-REV-001',
    authority_ref: authorityRef,
    issued_at: '2026-09-24T10:50:00.000Z',
    effective_at: '2026-09-24T10:55:00.000Z',
    observed_at: '2026-09-24T10:56:00.000Z',
    reason: 'P0_TEST_REVOCATION',
    evidence_hash: sha256Digest({
      source: 'p0-revocation-test',
      record: '001'
    }),
    ...patch
  };
}

const authority = baseAuthority();
const enriched = enrichRequestEnvelope(envelope(authority));
const authorityRef = enriched.authority_ref;

const futureLedger = createRevocationLedger({
  ledger_id: 'LEDGER-P0-REV-0001',
  created_at: '2026-09-24T11:01:00.000Z',
  authority_ref: authorityRef,
  revocations: [
    revocation(authorityRef, {
      revocation_id: 'REV-P0-REV-FUTURE',
      effective_at: '2026-09-24T11:30:00.000Z',
      observed_at: '2026-09-24T11:31:00.000Z'
    })
  ]
});

const futureVerify = verifyRevocationLedger(futureLedger);
assert.equal(futureVerify.state, REVOCATION_LINEARIZATION_STATE.CLEAR);
assert.equal(futureVerify.reason, 'REVOCATION_LEDGER_VALID');
assert.match(futureLedger.revocation_ledger_hash, /^sha256:[a-f0-9]{64}$/);
assert.equal(futureLedger.dispatch_created, false);
assert.equal(futureLedger.physical_execution_performed, false);

const futureDecision = evaluateRevocationAt(futureLedger, '2026-09-24T11:05:00.000Z');
assert.equal(futureDecision.state, REVOCATION_LINEARIZATION_STATE.CLEAR);
assert.equal(futureDecision.fail_closed, false);

const revokedLedger = createRevocationLedger({
  ledger_id: 'LEDGER-P0-REV-0002',
  created_at: '2026-09-24T11:02:00.000Z',
  authority_ref: authorityRef,
  revocations: [
    revocation(authorityRef, {
      revocation_id: 'REV-P0-REV-LATE',
      effective_at: '2026-09-24T11:30:00.000Z',
      observed_at: '2026-09-24T11:31:00.000Z'
    }),
    revocation(authorityRef, {
      revocation_id: 'REV-P0-REV-EARLY',
      effective_at: '2026-09-24T10:59:00.000Z',
      observed_at: '2026-09-24T11:00:00.000Z'
    })
  ]
});

assert.equal(revokedLedger.revocations[0].revocation_id, 'REV-P0-REV-EARLY');
assert.equal(revokedLedger.revocations[1].revocation_id, 'REV-P0-REV-LATE');

const revokedDecision = evaluateRevocationAt(revokedLedger, '2026-09-24T11:05:00.000Z');
assert.equal(revokedDecision.state, REVOCATION_LINEARIZATION_STATE.REVOKED);
assert.equal(revokedDecision.reason, 'REVOCATION_EFFECTIVE_BEFORE_OR_AT_DECISION');
assert.equal(revokedDecision.fail_closed, true);
assert.equal(revokedDecision.revocation_id, 'REV-P0-REV-EARLY');

const tamperedOrderLedger = {
  ...revokedLedger,
  revocations: [
    revokedLedger.revocations[1],
    revokedLedger.revocations[0]
  ],
  revocation_ledger_hash: sha256Digest({
    forged: 'ledger-order'
  })
};

assert.throws(
  () => verifyRevocationLedger(tamperedOrderLedger),
  /linearization_index is invalid|revocation records are not linearly ordered|revocation ledger hash mismatch/
);

const tamperedRecordLedger = {
  ...revokedLedger,
  revocations: [
    {
      ...revokedLedger.revocations[0],
      effective_at: '2026-09-24T09:00:00.000Z'
    },
    revokedLedger.revocations[1]
  ]
};

assert.throws(
  () => verifyRevocationLedger(tamperedRecordLedger),
  /revocation record hash mismatch/
);

const tamperedLedgerHash = {
  ...revokedLedger,
  revocation_ledger_hash: sha256Digest({ forged: 'ledger-hash' })
};

assert.throws(
  () => verifyRevocationLedger(tamperedLedgerHash),
  /revocation ledger hash mismatch/
);

const mismatchedAuthorityRef = {
  ...authorityRef,
  authority_id: 'AUT-P0-REV-OTHER'
};

assert.throws(
  () => createRevocationLedger({
    ledger_id: 'LEDGER-P0-REV-0003',
    created_at: '2026-09-24T11:03:00.000Z',
    authority_ref: authorityRef,
    revocations: [
      revocation(mismatchedAuthorityRef, {
        revocation_id: 'REV-P0-REV-MISMATCH'
      })
    ]
  }),
  /revocation authority_ref must match ledger authority_ref/
);

const duplicateRevocation = revocation(authorityRef, {
  revocation_id: 'REV-P0-REV-DUPLICATE'
});

assert.throws(
  () => createRevocationLedger({
    ledger_id: 'LEDGER-P0-REV-0004',
    created_at: '2026-09-24T11:04:00.000Z',
    authority_ref: authorityRef,
    revocations: [
      duplicateRevocation,
      {
        ...duplicateRevocation,
        evidence_hash: sha256Digest({ duplicate: true })
      }
    ]
  }),
  /duplicate revocation_id detected/
);

assert.equal(Object.hasOwn(revokedLedger, 'dispatch'), false);
assert.equal(Object.hasOwn(revokedLedger, 'execution'), false);
assert.equal(Object.hasOwn(revokedLedger, 'physical_effect_proven'), false);

console.log('PASS PROG-008-REVOCATION-LEDGER-CREATES-LINEAR-ORDER');
console.log('PASS PROG-008-REVOCATION-EVALUATION-FAILS-CLOSED-WHEN-EFFECTIVE');
console.log('PASS PROG-008-REVOCATION-VERIFY-DETECTS-TAMPERING');
console.log('PASS PROG-008-REVOCATION-AUTHORITY-BINDING-IS-ENFORCED');
console.log('PASS PROG-008-REVOCATION-DOES-NOT-DISPATCH-OR-EXECUTE');
