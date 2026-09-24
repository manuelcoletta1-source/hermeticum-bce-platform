# HBCE Evidence Core v1 — Banking Demo Manifest

Date: 2026-09-24

## Manifest status

HBCE_BANKING_DEMO_MANIFEST_STATUS=READY

This manifest describes the HBCE Evidence Core v1 demo JSON artifact for banking review, technical review and controlled product demonstration.

## Primary artifact

- Artifact path: `artifacts/product/hbce-evidence-core-v1-demo-payload-export-2026-09-24.json`
- Artifact file SHA-256: `fb688399b1fbabe7060a9c74f3a88aeb03c60d0069ae6c4ed40a330697ba710f`
- Demo payload export SHA-256: `a6c90405c01f96079dc3f1883b81b22340fac7df60c5bd0a6c6b897d43f27cfd`
- Demo payload core SHA-256: `a62615e28a2a0514a4c88025d6dcb8d90d45824960337e88e9aef8797b0ffee5`

## Source checkpoint

- PR132 checkpoint main: `5772d589629e944f60db2eff1b0be43f23e6d4aa`
- PR132 checkpoint document SHA-256: `b466b263fce8fa5d8ed554f3cd295259603dfb63b6f259f566a6f7f69982f3b8`
- Artifact validation test SHA-256: `b9dfe9c84524f78aff856f26dfcd6cf6c6276b0259d6c5df61fb9fcbfb7dd515`

## What this artifact demonstrates

The artifact demonstrates that HBCE Evidence Core v1 can produce a compact, inspectable and reproducible banking demo payload.

The artifact shows:

- a controlled access decision snapshot
- proof hashes
- banking demo summary
- demo cards
- allowed claims
- prohibited claims
- API status
- explicit boundary summary
- export limitations

## One-page reviewer interpretation

A reviewer should interpret this artifact as an internal product demo object.

The artifact shows that the HBCE Evidence Core v1 decision path remained controlled: policy is unevaluated, authorization is unresolved, access is false, and no runtime action was executed.

The artifact is suitable for internal banking review, audit preparation, product demonstration and future API adapter design.

The artifact is not a production authorization, not a legal certificate, not an eIDAS qualification, not an OPC ALLOW, not an external review completion, and not regulatory approval.

## Banking use case

Use case:

`AI-assisted internal access decision evidence pack for controlled banking workflow.`

The banking reviewer can inspect whether authority, policy, authorization, access, dispatch and mutation remained controlled and fail-closed.

## Allowed claims

The artifact supports the following claims:

- deterministic internal evidence chain
- fail-closed access decision behavior
- observe-only review package generation
- non-authorizing positive ALLOW probe handling
- no dispatch without authorization
- no runtime mutation from evidence generation
- audit-oriented package structure
- static JSON artifact available for inspection
- SHA-256 reproducible verification path

## Prohibited claims

The artifact does not support the following claims:

- legal certification
- eIDAS qualification
- production deployment proof
- external review completion
- regulatory approval
- OPC ALLOW creation
- autonomous banking authorization
- live transaction approval
- customer-facing production approval
- financial transaction approval

## Boundary summary

The artifact remains:

- deterministic
- read-only
- observe-only
- fail-closed
- non-authorizing
- non-executing
- non-mutating
- internal product demo material

The artifact does not:

- does not grant authorization
- does not create authorization artifacts
- does not grant access
- does not execute runtime actions
- does not create dispatch
- does not mutate runtime state
- does not create legal certification
- does not create eIDAS qualification
- does not create OPC ALLOW
- does not prove production deployment
- does not complete external review
- does not claim regulatory approval
- does not authorize banking operations

## Verification chain

Minimum verification chain:

1. Validate the JSON artifact file hash.
2. Validate the demo payload export hash.
3. Validate the demo payload core hash.
4. Run the artifact validation test.
5. Run the demo payload export test.
6. Run the readable surface test.
7. Run the PR128 source review package test.

Expected verification results:

- PR132 JSON artifact validation: `13/13 PASS`
- PR131 demo payload export: `18/18 PASS`
- PR130 readable surface: `19/19 PASS`
- PR128 source review package: `21/21 PASS`

## Reviewer conclusion

This artifact is suitable as a controlled demo evidence object for banking review.

It is not suitable as a production approval, regulatory approval, legal certification, eIDAS qualification, external review completion or live banking authorization.

## Next step

The next product step is to expose this artifact through a real product/API adapter only in a repository that actually contains an application route scaffold.
