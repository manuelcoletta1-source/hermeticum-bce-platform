# HBCE PostgreSQL Revision Schema Design

Status: EXPERIMENTAL DRAFT / NOT IMPLEMENTED / NOT VERIFIED

Source contract SHA-256: 8bb83444ead4054e81c55aa4f401b96552ace8b7c2eabf9a03697bee67992504
Source test design SHA-256: 195a88fe1dc83b2c69e7e8e4b862994c640ea979ec623291b72f846427347a0e

## Proposed structures

### operation_coordination

- operation_id: primary key, exact operation identity.
- One durable row per operation_id.
- Used as the transaction-scoped row-lock target.
- Must be established safely during concurrent genesis attempts.

No latest_revision field is proposed as a second source
of authority.

### operation_revisions

- operation_id: exact operation identity.
- operation_revision: positive JavaScript safe integer.
- envelope_payload_sha256: verified Envelope commitment.
- envelope_payload: complete retained admitted UTF-8 JSON bytes.

Primary key:
(operation_id, operation_revision)

Foreign key:
operation_id references operation_coordination(operation_id)

The foreign key does not replace predecessor verification.
The primary key does not by itself enforce gap-free history.

## Candidate SQL shape: NOT EXECUTABLE MIGRATION

The following is a design sketch, not authorized SQL for execution.

```sql
CREATE TABLE operation_coordination (
    operation_id text PRIMARY KEY
);

CREATE TABLE operation_revisions (
    operation_id text NOT NULL
        REFERENCES operation_coordination(operation_id),
    operation_revision bigint NOT NULL,
    envelope_payload_sha256 text NOT NULL,
    envelope_payload bytea NOT NULL,

    PRIMARY KEY (operation_id, operation_revision),

    CHECK (
        operation_revision >= 1
        AND operation_revision <= 9007199254740991
    )
);
```

The exact operation_id constraints, digest encoding constraints,
payload storage representation and schema namespace remain
OPEN DESIGN ITEMS.

Byte-preserving payload storage is proposed for evaluation.
The admitted UTF-8 JSON bytes are retained as the primary payload
evidence. At retrieval, those bytes must pass independent
duplicate-aware UTF-8 ingress, frozen SF-009 validation and
recomputation of the experimental Envelope commitment.

The stored digest is not trusted merely because it is present.
Canonical Envelope equality is distinct from raw byte equality.
The repository must not classify a replay from matching stored
digest strings or byte equality alone.

## Candidate coordination sequence

1. Begin a transaction.
2. Establish or locate the operation_coordination row.
3. Lock that row for the transaction.
4. Retrieve and verify any existing requested revision.
5. Otherwise verify genesis or exact immediate predecessor.
6. Insert the verified complete revision record.
7. Commit before reporting INSERTED.

The concrete first-row creation statement and conflict handling
remain OPEN DESIGN ITEMS.

Every admission and recovery path must follow the same
coordination protocol. Direct uncoordinated writes would violate
the proposed repository contract.

## Recovery boundary

The coordination row is not a commit receipt.

An interrupted client request remains OUTCOME_UNKNOWN until
the recovery protocol obtains conclusive durable evidence.

A verified exact stored record may establish EXACT_REPLAY.
A verified different record may establish REVISION_CONFLICT.
Corrupted material fails closed.

Absence is conclusive for the prior attempt only when the
transaction/fencing protocol excludes a late commit.

## Required review before any migration

- Exact operation_id and digest constraints.
- Byte-preserving storage and independent retrieval verification.
- First-row creation under concurrent genesis.
- Lock acquisition and transaction isolation.
- Predecessor-chain verification and gap-free advancement.
- Recovery and late-write exclusion.
- P01-P10 fault-injection and independent durable evidence.
- Human acceptance and separate SQL-write authorization.

Human acceptance: PENDING.
SCHEMA_MIGRATION=NOT_EXECUTED
POSTGRESQL_WRITES=NOT_AUTHORIZED
P01_P10=NOT_EXECUTED
L3_PROMOTION=NOT_AUTHORIZED
