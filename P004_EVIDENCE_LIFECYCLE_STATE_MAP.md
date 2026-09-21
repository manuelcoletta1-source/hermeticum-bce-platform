# P004 EVIDENCE LIFECYCLE STATE MAP

## Status

This document is the second operational deliverable after the P004 merge checkpoint.

Baseline:

MAIN_HEAD=84271c2 docs(main): record post P004 evidence map checkpoint
P004_PLAN=P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
P004_MAP=P004_OPERATIONAL_EVIDENCE_MAP.md

## Purpose

The Evidence Lifecycle State Map defines the allowed documentary and operational states for HBCE evidence records.

It connects evidence preparation, verification, inheritance, blocking, revocation and archival behavior without implying runtime production readiness.

## Lifecycle states

### 1. DRAFT

DRAFT means the evidence record is being prepared and is not yet suitable for verification inheritance.

Allowed meaning:

- content exists
- structure may still change
- references may be incomplete
- no verification inheritance is allowed

Not allowed meaning:

- production proof
- runtime authorization
- OPC ALLOW
- legal certification

### 2. PREPARED

PREPARED means the evidence record has an intended structure and is ready for validation or review.

Allowed meaning:

- structure is intentionally formed
- required fields are expected to be present
- review can begin
- validation may be executed

Not allowed meaning:

- verified result
- inherited proof
- execution approval

### 3. VERIFIED

VERIFIED means the evidence record has passed the applicable validation or review process for its declared scope.

Allowed meaning:

- validation result is recorded
- scope is explicit
- hash or reference material may be used as evidence support
- downstream documentation may cite the verified result

Not allowed meaning:

- automatic production readiness
- automatic deployment readiness
- automatic legal status
- automatic OPC ALLOW

### 4. INHERITED

INHERITED means a later checkpoint or document references a previous verified result without re-executing the underlying verification.

Allowed meaning:

- previous verified baseline remains referenced
- later documentation may preserve the earlier result
- inheritance must name the source baseline
- inheritance does not expand scope

Not allowed meaning:

- new verification by implication
- broader runtime approval
- production promotion

### 5. SUPERSEDED

SUPERSEDED means the evidence record has been replaced by a newer record or checkpoint.

Allowed meaning:

- previous record remains historically valid for its time
- newer record becomes the active reference
- audit history is preserved
- supersession must not delete traceability

Not allowed meaning:

- silent deletion
- retroactive invalidation unless explicitly stated
- unexplained authority replacement

### 6. BLOCKED

BLOCKED means the evidence record cannot progress because a required condition, validation, authority or boundary is missing.

Allowed meaning:

- progression is stopped
- reason must be documented
- fail-closed behavior is preserved
- blocked state may be revisited after correction

Not allowed meaning:

- partial approval
- implicit allow
- bypass of missing validation

### 7. REVOKED

REVOKED means the evidence record must no longer be used as an active support for the declared purpose.

Allowed meaning:

- active use is stopped
- revocation reason must be recorded
- downstream dependency should be reviewed
- audit trail remains preserved

Not allowed meaning:

- erasing historical trace
- silent replacement
- continued active reliance

### 8. ARCHIVED

ARCHIVED means the evidence record is preserved for historical, audit or traceability purposes but is not active for current operational decisions.

Allowed meaning:

- historical record is retained
- active use is ended
- audit reference remains possible
- archival state must be explicit

Not allowed meaning:

- current operational proof
- active authorization input
- runtime approval

## State transition map

Allowed transitions:

- DRAFT -> PREPARED
- PREPARED -> VERIFIED
- PREPARED -> BLOCKED
- VERIFIED -> INHERITED
- VERIFIED -> SUPERSEDED
- VERIFIED -> REVOKED
- INHERITED -> SUPERSEDED
- INHERITED -> REVOKED
- BLOCKED -> PREPARED
- BLOCKED -> ARCHIVED
- SUPERSEDED -> ARCHIVED
- REVOKED -> ARCHIVED

Disallowed implicit transitions:

- DRAFT -> VERIFIED without validation
- PREPARED -> INHERITED without verified source
- BLOCKED -> VERIFIED without correction and validation
- REVOKED -> VERIFIED without new evidence process
- ARCHIVED -> ACTIVE without explicit new review

## Operational rule

Evidence state changes must be explicit, documented and reviewable.

No evidence lifecycle state may imply production readiness, deployment readiness, L3 readiness, PostgreSQL execution, P04/P05 concurrency execution or OPC ALLOW.

## Relationship to P004 Operational Evidence Map

The Evidence Lifecycle State Map supports the Evidence layer of the P004 Operational Evidence Map.

It defines how evidence objects move through controlled documentary states before they can support policy, OPC, authority, authorization or runtime-boundary review.

## Explicit boundaries

This document does not perform or imply:

- production readiness
- deployment readiness
- L3 readiness
- PostgreSQL readiness
- PostgreSQL execution
- P04/P05 concurrency execution
- OPC ALLOW
- legal certification
- eIDAS qualification
- regulated KYC/AML provider status

## Decision rule

Evidence lifecycle state control may support future review and verification work.

It must not be treated as runtime authorization or operational execution without explicit human approval.
