# HBCE Banking Pilot Readiness Baseline

Date: 2026-09-23

## Positioning

HBCE Evidence Core v1 provides a deterministic evidence chain for AI/runtime access decision governance.

The banking pilot should focus on controlled access decisions, auditability, fail-closed behavior, policy-deferred states and non-authorizing evidence packages.

## Banking problem fit

Banks need controlled systems that can prove:

- who or what had authority context
- whether policy was evaluated
- whether authorization was resolved
- whether access was granted
- whether a runtime action was dispatched
- whether state was mutated
- whether audit evidence exists
- whether a decision remained fail-closed

HBCE Evidence Core v1 already demonstrates these internal properties.

## Banking pilot use case

Recommended pilot:

"AI-assisted internal access decision evidence pack for controlled banking workflow."

Example workflow:

1. A request asks whether a runtime operation may be accessed.
2. HBCE resolves authority context.
3. Policy remains unevaluated or unresolved unless explicitly satisfied.
4. Authorization remains unresolved.
5. Access remains false.
6. HBCE generates deterministic evidence.
7. The evidence is exported as a reviewable package.
8. An auditor can verify that no action, dispatch, mutation, certification or external claim was created.

## Claims allowed

HBCE may claim:

- deterministic internal evidence chain
- fail-closed access decision behavior
- observe-only review package generation
- non-authorizing positive ALLOW probe handling
- no dispatch without authorization
- no runtime mutation from evidence generation
- audit-oriented package structure

## Claims not allowed yet

HBCE must not claim:

- legal certification
- eIDAS qualification
- production deployment proof
- external review completion
- regulatory approval
- OPC ALLOW creation
- autonomous banking authorization
- live transaction approval

## Pilot success criteria

A banking pilot is successful when HBCE can demonstrate:

- one controlled access decision flow
- one denied/unresolved case
- one evidence package export
- one review package
- one human-readable audit summary
- one reproducible SHA-256 verification path
- one clear statement of non-authorization and non-execution

## Next commercial artifact

Create a short banking-facing deck or dossier with:

- problem
- HBCE control model
- evidence flow
- demo scenario
- risk reduction
- integration boundary
- what HBCE does not claim
- pilot proposal
