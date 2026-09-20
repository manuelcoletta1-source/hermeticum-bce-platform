# HBCE OperationEnvelope P01-P10 Persistence Test Design

Status: EXPERIMENTAL DRAFT / NOT EXECUTED / NOT VERIFIED
Source contract SHA-256: 8bb83444ead4054e81c55aa4f401b96552ace8b7c2eabf9a03697bee67992504

This document proposes tests for the durable revision repository.
It does not establish implementation, PostgreSQL safety, production
authorization or L3 readiness.

## Shared test requirements

Each case must record its initial durable state, participating actors,
transaction boundary, expected classification and independently
retrieved durable evidence.

Tests must use isolated experimental data. A returned success value
without independent durable verification is insufficient.

A corrupted or unverifiable stored record must fail closed.
FAIL_CLOSED_UNVERIFIABLE_RECORD remains a proposed diagnostic,
not an accepted or implemented repository outcome.

## P01: valid genesis insertion

Initial state: no coordination or revision record for operation_id.
Actors: one admission client.
Action: admit verified revision 1 with null predecessor.
Permitted result: INSERTED after known durable commit.
Evidence: one verified revision 1 and no competing revision history.

## P02: exact genesis replay

Initial state: verified genesis durably present.
Actors: one replay client.
Action: resubmit identical complete Envelope and revision identity.
Permitted result: EXACT_REPLAY after independent durable verification.
Evidence: same complete canonical payload and unchanged record count.

## P03: conflicting genesis payload

Initial state: verified genesis durably present.
Actors: one conflicting client.
Action: submit different verified payload under the same revision key.
Permitted result: REVISION_CONFLICT.
Evidence: original verified record unchanged; no overwrite.

## P04: concurrent identical genesis

Initial state: no record for operation_id.
Actors: two concurrent clients with identical verified revision 1.
Action: race coordination-row creation and admission.
Permitted results: one INSERTED and one EXACT_REPLAY after verification;
an inconclusive interrupted response remains OUTCOME_UNKNOWN.
Evidence: exactly one verified revision 1 and one coordination identity.

## P05: concurrent different genesis payloads

Initial state: no record for operation_id.
Actors: two concurrent clients with different verified revision 1 payloads.
Action: race admission under the same unique revision key.
Permitted results: one INSERTED and one REVISION_CONFLICT when
both outcomes are conclusively observed.
Evidence: one verified winner, no overwrite or alternative accepted row.

## P06: invalid successor predecessor

Initial state: genesis present, absent or deliberately corrupted,
according to the subcase.
Actors: one successor client.
Action: request revision n with missing, wrong, mismatched or
unverifiable immediate predecessor.
Permitted result: PREDECESSOR_FAILURE or explicit fail-closed
diagnostic for unverifiable durable material, pending outcome design.
Evidence: no new accepted successor and unchanged prior records.

## P07: concurrent successor attempts

Initial state: verified revision n-1 present.
Actors: two clients requesting revision n, with identical and
different-payload subcases.
Action: race predecessor verification and admission.
Permitted results: INSERTED plus verified EXACT_REPLAY for identical
payloads; INSERTED plus REVISION_CONFLICT for different payloads,
when both responses are conclusive.
Evidence: exactly one verified revision n; no gap or overwrite.

## P08: unknown completion and recovery

Initial state: valid admission candidate and known prior history.
Actors: admission client, database transaction and recovery client.
Action subcases: timeout before commit; timeout after commit before
acknowledgement; recovery while original transaction remains active;
coordination unavailable during recovery.
Permitted result: OUTCOME_UNKNOWN until conclusive durable evidence;
EXACT_REPLAY only for a verified exact persisted record.
Evidence: recorded interruption point, transaction completion or
fencing evidence, and independently verified durable lookup.

## P09: corrupted durable replay

Initial state: a stored record deliberately corrupted in isolated
experimental storage.
Actors: replay client and independent verifier.
Action subcases: malformed Envelope, stored digest mismatch,
declared digest mismatch, invalid genealogy, unverifiable predecessor.
Permitted result: fail-closed; never EXACT_REPLAY solely from key
or digest-string equality.
Evidence: precise verification failure and no accepted mutation.

## P10: verification/write race and interruption

Initial state: controlled genesis or successor setup.
Actors: two admission clients and an independent recovery client.
Action subcases: concurrent first coordination-row creation;
successor race; interruption before commit; interruption after commit
before acknowledgement; recovery during an in-flight transaction.
Permitted result: only classifications supported by conclusive
transaction and durable-record evidence; otherwise OUTCOME_UNKNOWN.
Evidence: transaction boundaries, final verified records, uniqueness,
gap-free genealogy and proof against late uncoordinated writes.

## Execution prerequisites

- Human acceptance of the experimental test design.
- Concrete SQL schema and transaction protocol reviewed separately.
- Explicit fault-injection and synchronization method for each race.
- Defined treatment of unverifiable durable records.
- Defined recovery/fencing evidence for interrupted transactions.
- Independent verification of stored Envelope and predecessor chain.

Human acceptance: PENDING.
P01_P10=NOT_EXECUTED
POSTGRESQL_WRITES=NOT_AUTHORIZED
L3_PROMOTION=NOT_AUTHORIZED


## STEP 177C test-boundary clarifications

Status: DOCUMENTARY CLARIFICATION / NOT EXECUTED / NOT VERIFIED

### P06: distinguish predecessor failures

P06-A: the incoming predecessor locator identifies the wrong
operation_id or revision, or does not identify exactly n - 1.

P06-B: the incoming locator identifies the expected predecessor,
but the retrieved durable record fails independent verification
of its Envelope, commitment, revision identity or genealogy.

Both cases must reject successor admission. The test report must
preserve which failure occurred. A corrupted durable predecessor
must not be misreported as a verified revision conflict.

### P08: recovery classification

P08 tests when an interrupted admission may be classified using
independent durable evidence. Record separately the original
transaction state, coordination acquisition, retrieved record
verification and resulting classification.

If the original transaction may still complete, an inconclusive
lookup remains OUTCOME_UNKNOWN. A conclusive absence is not
INSERTED and does not itself authorize a new admission.

### P10: atomicity and late-write exclusion

P10 tests the transaction protocol rather than merely repeating
P08 outcome classification. Verify uniqueness, gap-free revision
history, atomic predecessor verification and insertion, and
exclusion of late writes outside per-operation coordination.

A P08 recovery result cannot substitute for P10 atomicity evidence.
Shared fault-injection runs may be referenced by both families
only when their distinct assertions and evidence are recorded.

### Outcome vocabulary

FAIL_CLOSED_UNVERIFIABLE_RECORD remains a proposed diagnostic,
not an accepted sixth repository outcome. Its final representation
is an open design item requiring human acceptance.

Human acceptance: PENDING.
STEP_177C_CLARIFICATIONS=NOT_EXECUTED
P01_P10=NOT_EXECUTED
