# HBCE P04/P05 Concurrency Harness Design

Status: EXPERIMENTAL DRAFT / NOT IMPLEMENTED / NOT EXECUTED
Source genesis design SHA-256: dcbcfec40a748d5dcb496c7b9711e5e421326c69bf35ca6e8d151b9f8c24f9c2

## Scope

Two independent PostgreSQL connections test concurrent genesis
for one isolated operation_id. No production repository or
frozen schema is modified by this design.

P04 uses identical verified Envelope payloads.
P05 uses different verified Envelope payloads under the same
(operation_id, operation_revision) key.

## Controlled execution

1. Establish isolated initial state with no coordination or
   revision row for the selected operation_id.
2. Start client A and client B on independent connections.
3. Let A establish and lock the coordination row.
4. Hold A's transaction open at an explicit barrier.
5. Let B attempt coordination for the same operation_id.
6. Observe and record B's actual waiting point.
7. Release A to insert the verified genesis and commit.
8. Require B to acquire coordination and reread the
   committed revision before classifying its request.
9. Independently retrieve and verify the final durable state.

Elapsed time or sleep alone is not proof of lock contention.
A failed or inconclusive observation must not be reported
as a verified concurrency PASS.

## Contention observation protocol

Use three independent connections:

- A: genesis transaction and explicit hold barrier.
- B: competing genesis transaction.
- O: read-only observer, never an admission participant.

Record the PostgreSQL backend PID of A and B before the race.
Record the current statement phase in the harness itself.

While A holds its uncommitted coordination-row insertion,
B may wait inside INSERT ... ON CONFLICT DO NOTHING.
The harness must not assume B has reached SELECT ... FOR UPDATE.

Observer O may inspect pg_stat_activity and
pg_blocking_pids(B_pid) to record observed blocking
relationships, wait_event_type and wait_event.

The observation must be correlated with B's statement phase.
A blocking PID alone does not establish which SQL statement
B is executing or prove the final admission result.

Release A only after the required observation is captured.
If the expected contention cannot be observed, report
INCONCLUSIVE rather than an experimental PASS.

After A commits, B must finish coordination, obtain exactly
one locked row and reread the durable revision state.

Independent post-run verification must establish the final
record, digest, genealogy and uniqueness constraints.

Do not use fixed sleep duration as a substitute for an
observed synchronization condition.

## Observation limitations

pg_stat_activity and pg_blocking_pids() are diagnostic
observations, not durable evidence of a committed revision.

Observer permissions and visibility must be established
before the test. Missing visibility is INCONCLUSIVE.

A connection failure or lost COMMIT acknowledgement remains
OUTCOME_UNKNOWN until recovery establishes a supported result.

## P04 assertions

- One verified genesis record under the unique revision key.
- One coordination identity for operation_id.
- No overwrite or alternative accepted revision.
- Conclusive responses: one INSERTED and one independently
  verified EXACT_REPLAY.
- Interrupted responses retain OUTCOME_UNKNOWN until recovery.

## P05 assertions

- One verified genesis record under the unique revision key.
- One coordination identity for operation_id.
- The stored payload is the independently verified payload
  accepted by the transaction that committed.
- Conclusive responses: one INSERTED and one verified
  REVISION_CONFLICT.
- No overwrite or alternative accepted revision.

## Required instrumentation

- Distinct connection and transaction identifiers.
- Explicit barriers for A-lock-held and A-commit-complete.
- Observed B waiting state, not an inferred delay.
- Recorded commit acknowledgement or uncertain completion.
- Independent post-transaction durable-record verification.
- Cleanup confined to separately authorized experimental data.

## Fail-closed conditions

- B proceeds without obtaining exactly one coordination row.
- B classifies using a snapshot taken before coordination.
- Either client reports INSERTED without known durable commit.
- A corrupted record is treated as EXACT_REPLAY or as a
  verified REVISION_CONFLICT.
- An interrupted result is silently converted into success.

## Open implementation decisions

- Concrete PostgreSQL driver and dependency version.
- Synchronization and lock-observation mechanism.
- Isolated schema/database and test identity namespace.
- Fixture construction for two independently verified
  but different genesis payloads.
- Fault-injection and cleanup protocol.
- Separate human authorization for PostgreSQL writes.

Human acceptance: PENDING.
HARNESS_IMPLEMENTATION=NOT_STARTED
P04_P05=NOT_EXECUTED
POSTGRESQL_WRITES=NOT_AUTHORIZED
L3_PROMOTION=NOT_AUTHORIZED
