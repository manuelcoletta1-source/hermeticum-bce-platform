# HBCE OperationEnvelope Durable Revision Repository Contract

Status: EXPERIMENTAL DRAFT / NOT IMPLEMENTED / NOT VERIFIED

## Scope

This draft specifies the proposed durable persistence boundary for
OperationEnvelope v1 revisions. It does not modify frozen SF-009 or SF-028,
the accepted documentary revision-identity profile, or the Platform Core
hash profile for its ten declared object kinds.

The STEP 173 experimental ingress verifier has 46/46 local tests PASS.
Those tests do not establish durable persistence, concurrency safety,
predecessor resolution, production authorization or L3 readiness.

## Durable domain record

Each independently queryable record contains:

- operation_id
- operation_revision
- envelope_payload_sha256
- envelope_payload

The unique key is exactly (operation_id, operation_revision).

operation_revision is a positive JavaScript safe integer and is not the
frozen Envelope field version, which remains v1.

envelope_payload_sha256 binds the verified complete Envelope commitment
to the unique revision key. It is not part of the uniqueness key.

The complete Envelope payload must be retained for independent
schema and commitment verification.

## Admission and verification

Before an insertion is accepted:

1. Admit bounded UTF-8 JSON through the defined experimental ingress.
2. Reject malformed or ambiguous JSON, including duplicate decoded
   member names at any nesting level.
3. Validate the complete Envelope against frozen SF-009, including formats.
4. Recompute the dedicated experimental Envelope commitment, excluding
   only the top-level payload_sha256.
5. Require equality with the Envelope-declared payload_sha256.
6. Require the record operation_id to equal the Envelope operation_id.
7. Require the record envelope_payload_sha256 to equal the independently
   recomputed commitment.
8. Check revision and genealogy invariants at the durable boundary.

The current experimental verifier implements only the ingress, schema
and experimental digest portions. It is not a durable-record verifier.

## Atomic revision rules

Genesis is revision 1 and has a null immediate-predecessor locator.
The repository must establish atomically that genesis is the first
revision for its operation_id.

A successor revision n must identify exactly revision n - 1 of the same
operation_id using:

HBCE-OER-v1:<operation_id>:<operation_revision>

The locator parser must split at the final colon. The predecessor must
be retrieved from durable storage and independently verified.

Predecessor verification and the insertion decision must occur within
a concurrency-safe atomic operation. An unguarded read followed by
a separate insert is insufficient.

The repository must atomically enforce uniqueness of
(operation_id, operation_revision). No conflicting payload may
silently overwrite or become an alternative accepted revision.

## Replay and conflict

An exact replay is permitted only after retrieving the actual durable
record and independently verifying:

- exact operation_id and operation_revision;
- complete stored Envelope against frozen SF-009;
- recomputed commitment against both stored digest fields;
- exact complete canonical Envelope payload equality with the incoming
  verified Envelope.

Equal declared or stored digest strings alone are insufficient.

A different payload or commitment under the same unique key is a
revision conflict and must fail closed.

Missing, unavailable, malformed, ambiguous or mismatched predecessor
material must not be treated as successful resolution.

## Proposed outcomes

INSERTED: a new revision was durably accepted under the atomic rules.

EXACT_REPLAY: the actual durable record was retrieved and independently
verified as exactly equivalent to the incoming revision.

REVISION_CONFLICT: the unique key is occupied by a non-equivalent
revision, or a conflicting insertion was detected.

PREDECESSOR_FAILURE: required predecessor or genesis invariants
cannot be established.

OUTCOME_UNKNOWN: an interruption or timeout prevents reliable
classification of the durable result.

OUTCOME_UNKNOWN must not be converted into INSERTED or EXACT_REPLAY
without a subsequent independent durable-record verification.

## Proposed persistence test matrix

P01: insert a valid genesis revision.

P02: replay the same genesis key and identical complete payload.

P03: reject a different payload under the same genesis key.

P04: resolve concurrent identical insertions under one unique key.

P05: reject or safely classify concurrent different payloads under
one unique key without overwrite.

P06: reject a successor with a missing, wrong or unverified immediate
predecessor.

P07: resolve concurrent successor attempts without competing accepted
payloads at the same revision.

P08: preserve OUTCOME_UNKNOWN after a timeout where durable completion
cannot be established.

P09: reject exact replay when the retrieved stored record is malformed,
corrupted or has a mismatched commitment.

P10: preserve atomicity and recoverability across a verification/write
race or interrupted insertion.

The exact test harness, fault-injection method and expected result
for each subcase must be specified before execution.

## Authorization boundary

This document authorizes no SQL writes, schema migration, runtime
integration, commit, push, deploy, OPC ALLOW, dispatch or L3 promotion.

Human acceptance: PENDING.

DURABLE_PERSISTENCE=NOT_EXECUTED
ATOMIC_UNIQUENESS=NOT_VERIFIED
DURABLE_PREDECESSOR_RESOLUTION=NOT_EXECUTED
P01_P10=NOT_EXECUTED


## STEP 174E clarification: durable classification

These clarifications refine the experimental draft. They do not
constitute implementation or human acceptance.

### Verified replay

EXACT_REPLAY requires independent verification of the retrieved
record's complete Envelope, commitment, revision identity and
applicable genealogy and predecessor invariants. Matching canonical
payloads alone do not repair an invalid durable revision chain.

### Gap-free advancement

Unique (operation_id, operation_revision) enforcement alone does not
prove gap-free revision history. Genesis must be established as the
first revision for its operation_id. A successor must be admitted only
when its exact verified immediate predecessor exists and the
advancement decision is concurrency-safe and atomic.

### Interrupted operations

A timeout or interrupted response must not be classified as INSERTED,
EXACT_REPLAY or a definite non-insertion without sufficient durable
evidence. A subsequent exact-record lookup may establish a verified
stored result or a conflict. A missing result from an inconclusive
lookup does not by itself prove that an in-flight transaction cannot
still commit.

The transaction and recovery design must define how an unresolved
operation is fenced, completed or otherwise conclusively classified.
Until then its outcome remains OUTCOME_UNKNOWN.


## STEP 175C proposed PostgreSQL transaction sequence

Status: DOCUMENTARY PROPOSAL / NOT IMPLEMENTED / NOT VERIFIED

### Coordination model

A durable coordination row uniquely identifies each operation_id.
The revision repository independently enforces uniqueness of
(operation_id, operation_revision).

Every repository path that can admit or classify a revision must
participate in the same per-operation coordination protocol.

The creation of the first coordination row must itself be safe under
concurrent genesis attempts. A unique operation_id constraint and
transactional conflict handling are required; the exact SQL mechanism
remains to be designed and tested.

### Candidate admission transaction

1. Begin a database transaction.
2. Establish or locate the durable coordination row for operation_id.
3. Acquire its transaction-scoped row lock.
4. Retrieve any existing record for the requested revision.
5. If one exists, independently verify its Envelope, commitment,
   revision identity and applicable genealogy. Classify as
   EXACT_REPLAY only after complete canonical payload equality;
   otherwise fail closed or classify a verified conflict.
6. If no record exists and the requested revision is genesis,
   establish that no revision already exists for operation_id and
   require the genesis genealogy invariant.
7. If no record exists and the requested revision is a successor,
   retrieve and independently verify the exact immediate predecessor
   under the same coordination. Reject missing, malformed, mismatched
   or unverifiable predecessor material.
8. Insert the complete verified Envelope and its verified commitment,
   retaining the independent unique revision constraint.
9. Commit. Report INSERTED only when durable completion is known.

No external dispatch, OPC ALLOW or L3 promotion follows from this
transaction proposal.

### Candidate recovery transaction

1. Treat an interrupted or timed-out insertion as OUTCOME_UNKNOWN.
2. Establish a new reliable database connection and reacquire the
   same per-operation coordination.
3. Independently retrieve and verify the requested durable record.
4. Classify a verified exact record as EXACT_REPLAY, or a verified
   non-equivalent record as REVISION_CONFLICT.
5. Do not treat an inconclusive lookup or unproven absence as proof
   that the previous transaction cannot still commit.
6. Retain OUTCOME_UNKNOWN until the transaction/fencing protocol
   establishes a conclusive durable state.

The precise fencing, connection-loss and commit-acknowledgement
semantics remain OPEN DESIGN ITEMS, not verified guarantees.

### Required pre-implementation review

Map this sequence to P01-P10, including concurrent first-row
creation, successor races, corrupted durable records, timeout after
commit, timeout before commit and recovery while the original
transaction remains in flight.

Human acceptance: PENDING.
POSTGRESQL_TRANSACTION_SEQUENCE=NOT_EXECUTED


## STEP 176A recovery classification matrix

Status: DOCUMENTARY PROPOSAL / NOT IMPLEMENTED / NOT VERIFIED

This matrix refines P08, P09 and P10. It does not establish
PostgreSQL transaction, fencing or recovery guarantees.

### Classification rules

| Observed durable state | Required evidence | Permitted classification |
| --- | --- | --- |
| Exact record present | Independently verified complete Envelope, commitment, revision identity, genealogy and canonical payload equality under per-operation coordination | EXACT_REPLAY |
| Different record present and independently verifiable | Verified non-equivalence under the same unique revision key | REVISION_CONFLICT |
| Record absent while prior transaction may still complete | No conclusive exclusion of the prior transaction | OUTCOME_UNKNOWN |
| Record absent after prior transaction is conclusively completed or excluded | Reliable coordination and a protocol preventing late writes outside that coordination | Conclusive absence for that attempt; not INSERTED |
| Record present but malformed, corrupted or unverifiable | Independent verification fails | FAIL_CLOSED_UNVERIFIABLE_RECORD: proposed diagnostic, not an implemented repository outcome |
| Database lookup or coordination inconclusive | Durable state cannot be reliably established | OUTCOME_UNKNOWN |

FAIL_CLOSED_UNVERIFIABLE_RECORD is a proposed diagnostic name,
not an addition to the implemented outcome vocabulary. Its final
representation requires human acceptance before implementation.

Conclusive absence does not itself prove that a new insertion is
authorized. A new admission decision must independently recheck
genesis or successor invariants under coordination.

### P08: unknown completion

Test separately:

- timeout before a transaction reaches commit;
- timeout after commit but before acknowledgement;
- recovery while the original transaction remains in flight;
- recovery when coordination cannot be reacquired reliably.

No timeout alone establishes INSERTED, EXACT_REPLAY or non-insertion.

### P09: corrupted durable replay

Test independently:

- malformed stored Envelope;
- stored commitment mismatch;
- Envelope-declared commitment mismatch;
- invalid revision identity or genealogy;
- unavailable or unverifiable required predecessor.

No corrupted record may be classified as EXACT_REPLAY solely
because its unique key or declared digest matches.

### P10: verification/write race and interruption

Test separately:

- concurrent genesis coordination-row creation;
- successor verification racing with another admission;
- interruption before commit;
- interruption after commit before acknowledgement;
- recovery while the previous transaction is still active.

The implementation design must identify a reliable coordination
and transaction-completion boundary for each subcase.

### Open design items

- Exact SQL for concurrent first coordination-row creation.
- Exact transaction isolation and row-lock acquisition sequence.
- Fencing or equivalent proof against late writes.
- Final representation of an unverifiable durable record.
- Fault-injection method and expected result for every subcase.

Human acceptance: PENDING.
P08_P09_P10_RECOVERY_MATRIX=NOT_EXECUTED
POSTGRESQL_RECOVERY_SEMANTICS=NOT_VERIFIED
