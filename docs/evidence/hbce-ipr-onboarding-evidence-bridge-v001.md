# HBCE IPR Onboarding Evidence Bridge v001

Program: `PROG-265-HBCE-IPR-ONBOARDING-EVIDENCE-BRIDGE`

## Purpose

This document defines the first bridge between HBCE public evidence objects and IPR onboarding state concepts.

It connects the public Evidence Viewer surface to identity ingress and onboarding state semantics.

It does not implement onboarding.

It does not grant access authorization.

It does not issue certificates.

It does not authorize dispatch.

## Basis

Final viewer prototype audit marker:

`HBCE_EVIDENCE_VIEWER_STATIC_PROTOTYPE_FINAL_AUDIT=1`

Current viewer prototype baseline commit:

`c00b775ada5ed0e9df30df13b1ca1c7e6f1e6873`

## Bridge Is

- A public R&D bridge baseline
- A mapping between evidence objects and IPR onboarding state concepts
- A read-only planning artifact
- A preparation layer for future IPR onboarding evidence records

## Bridge Is Not

- An onboarding implementation
- An access authorization service
- A certificate issuer
- A legal certification mechanism
- A dispatch console
- A production customer portal
- A Level 1 pilot readiness claim

## IPR State Model

IPR status values:

- `verified`
- `pending`
- `rejected`
- `revoked`
- `suspended`
- `expired`

IPR card status values:

- `issued`
- `pending`
- `not_issued`
- `revoked`
- `expired`

Certificate status values:

- `active`
- `pending`
- `not_created`
- `revoked`
- `expired`

Deny-state principle:

Any non-conforming onboarding, card or certificate state must be treated as non-authorizing until a governed authority path explicitly resolves it.

## Onboarding Surface Candidates

- `/api/onboarding/start`
- `/api/onboarding/review`
- `/api/ipr/verify`
- `/api/access/joker-c2`
- `/api/certificate/status`
- `/api/ipr-card/status`
- `/api/opc/proof`
- `/api/revocation`
- `/api/events`

## Bridge Records To Define Next

- `IPRIdentityIngressEvidenceRecord`
- `IPROnboardingStateEvidenceRecord`
- `IPRAccessDenyEvidenceRecord`
- `IPRPositiveAuthorizationPredicateRecord`
- `IPRRevocationEvidenceRecord`
- `OPCProofEvidenceBridgeRecord`

## Minimum Bridge Requirements

- Evidence visibility must not imply access authorization.
- Verified identity state must not imply dispatch authorization.
- OPC proof must remain a technical verification receipt, not a legal certificate.
- Pending, rejected, revoked, suspended and expired states must remain fail-closed for access claims.
- Positive authorization must remain dependent on explicit governed predicates.
- The bridge must preserve no-dispatch and no-effect boundaries.
- The bridge must not imply pilot readiness or commercial release authorization.

## Boundary

This bridge does not claim onboarding implementation, access authorization service, certificate issuance, legal certification, full MATRIX implementation, Level 1 pilot readiness, current C16 validity, current external validation acceptance, commercial release authorization, current Level 4 eligibility, dispatch, target receipt, execution trace or effect evidence.

It does not grant access authorization, issue a certificate, mutate an IPR state, authorize dispatch execution, emit a dispatch command, perform dispatch, call an external connector, contact a target system, create a target receipt, bind an execution trace or create effect evidence.

## Recommended Next Steps

1. `PROG-266 Evidence Object Schema Draft`
2. `PROG-267 IPR Onboarding Evidence Record Draft`
