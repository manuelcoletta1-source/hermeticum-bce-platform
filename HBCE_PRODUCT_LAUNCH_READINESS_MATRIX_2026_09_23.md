# HBCE Product Launch Readiness Matrix

Date: 2026-09-23

Launch target: 2027-01-19

## Overall status

HBCE is technically strong but not yet fully productized.

The Evidence Core v1 baseline is ready.

The launch work must now prioritize product usability, demo flow, banking pilot readiness and external-facing documentation.

## Readiness matrix

| Area | Status | Notes |
|---|---:|---|
| Evidence Core v1 | GREEN | PR104–PR128 final audit complete with 543 verified PASS. |
| Fail-closed access decision boundary | GREEN | Authorization remains unresolved unless policy and authority requirements are satisfied. |
| Governance and policy validation | GREEN | Governance total 95 PASS, policy total 71 PASS. |
| Runtime execution safety | GREEN | No dispatch, no execution, no runtime mutation. |
| External review execution | YELLOW | Internal review packages exist, but no real external review execution is created. |
| Legal certification | RED-CONTROLLED | No legal certification is created. Correct for current baseline, but not sufficient as a market claim. |
| eIDAS qualification | RED-CONTROLLED | No eIDAS qualification is created. Must remain explicit. |
| Product UX | YELLOW-ORANGE | Evidence exists, but must become readable and usable through interface/API. |
| Banking pilot pack | YELLOW | Technical fit is strong, but commercial packaging must be completed. |
| Deployment proof | RED-CONTROLLED | No production deployment proof is created by Evidence Core v1. |
| Launch readiness | YELLOW | Technically credible, commercially incomplete. |

## Launch priorities

1. Freeze Evidence Core v1 as the technical baseline.
2. Build a human-readable evidence dashboard.
3. Create an API route that exposes decision status, evidence package, audit proof and review package.
4. Create a banking pilot dossier.
5. Separate internal technical proof from external legal/certification claims.
6. Prepare a launch demo that a non-developer can understand in under 10 minutes.

## Product rule

Do not add more deep evidence-chain layers before the product surface exists.

New technical layers are allowed only if they directly serve launch usability, banking pilot readiness, or audit readability.
