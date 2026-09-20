# HBCE PostgreSQL Genesis Coordination Design

Status: EXPERIMENTAL DRAFT / NOT IMPLEMENTED / NOT VERIFIED

Source schema design SHA-256: 91ee524062d740f2939a46e7c8b7af68259ce4ceea9d7f088dd652c730b2444f

## Objective

Serialize revision admission for one operation_id, including
concurrent genesis when no coordination row initially exists.

The coordination row is not a commit receipt or a substitute
for independently verifying durable revision records.

## Candidate transaction sequence

The following SQL is illustrative and MUST NOT be executed
as a migration or production procedure.

```sql
BEGIN;

INSERT INTO operation_coordination (operation_id)
VALUES ($1)
ON CONFLICT (operation_id) DO NOTHING;

SELECT operation_id
FROM operation_coordination
WHERE operation_id = $1
FOR UPDATE;

-- Require exactly one locked row; otherwise stop admission.
-- Under this lock, retrieve and independently verify the
-- requested revision and applicable predecessor history.
-- Admit genesis only if no revision exists for operation_id.
-- Insert only the verified complete Envelope and commitment.

COMMIT;
```

The illustrative statements do not themselves implement
Envelope verification, genesis admission or recovery.

## Concurrent first-row creation

Client A and client B request genesis for the same operation_id.

Both begin transactions. The unique operation_id constraint
arbitrates concurrent coordination-row creation.

A transaction that does not create the row must not proceed
to revision admission until it can locate and lock the
committed coordination row.

Whether the row was newly created or already present, the
client must obtain exactly one row from SELECT ... FOR UPDATE
within the same transaction before any admission decision.

Zero rows, timeout, query error or connection loss must stop
admission. An uncertain result must not be interpreted as
absence of coordination or absence of a revision.

Once coordination is acquired, the client must reread the
durable revision state rather than rely on a pre-lock snapshot.

The INSERT row count is not evidence that a revision committed.

Under READ COMMITTED, each statement receives its own
statement-level snapshot. The proposed sequence depends
on the revision-state read occurring after coordination.

## Candidate genesis decision

While holding the coordination-row lock:

1. If the requested revision already exists, independently
   verify it and classify exact replay or verified conflict.
2. Otherwise require revision 1 and null predecessor.
3. Establish that no revision exists for operation_id.
4. Insert the verified revision under the independent
   (operation_id, operation_revision) primary key.
5. Commit before reporting INSERTED.

An unverifiable existing record fails closed.
It is not automatically REVISION_CONFLICT.

## Interruption and recovery

A client timeout does not establish whether COMMIT occurred.

Distinguish a known transaction rollback from a lost response
whose durable result remains unknown. A failed or inconclusive
coordination attempt must never fall through to admission.

A recovery transaction must reacquire the same coordination,
retrieve and independently verify the durable revision state,
and classify only what its evidence supports.

The design must prove that an earlier transaction cannot
perform a late uncoordinated write after recovery concludes.

The precise connection-loss, fencing and commit-
acknowledgement behavior remains OPEN DESIGN.

## Required experimental tests

P04: concurrent identical genesis and exact replay.
P05: concurrent different genesis and verified conflict.
P08: interruption before/after commit and recovery in flight.
P10: first-row race, atomicity and late-write exclusion.

The test harness must control synchronization points and
independently verify the resulting durable records.

Human acceptance: PENDING.
GENESIS_COORDINATION=NOT_EXECUTED
POSTGRESQL_WRITES=NOT_AUTHORIZED
P01_P10=NOT_EXECUTED
L3_PROMOTION=NOT_AUTHORIZED
