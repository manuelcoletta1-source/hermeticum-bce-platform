# HBCE Level 1 - V2.8 Design Baseline Alignment

Document ID: HBCE-L1-V2-8-DESIGN-BASELINE-ALIGNMENT
Specification baseline: V2.8 - 25 September 2026
Canonical document code: HBCE-B2B-L1-JC2-MATRIX-PROG-2027-0001
Repository baseline commit: `93260bdc8e0304c73b129f3a1e73523edf97169e`
Status: IN_PROGRESS / NOT_G0_READY
Gate impact: Does not satisfy G0, G1, G2 or G5 by itself.

## 1. Purpose

This record aligns the repository programming path to V2.8 DESIGN BASELINE / Execution Hardening Release.

It replaces the local PROG-019 V2.3/V2-001 draft as the active implementation alignment record.

The PDF specification does not attest implementation, gate completion, pilot readiness, production readiness, compliance certification, legal enforceability or physical truth.

Repository commits, tests, artifact hashes, MatrixRows and gate records remain the operational evidence source.

## 2. Freeze Rule

No further theory-only refactor.

Any later revision must be evidence-driven or caused by an approved C2/C3 trust/perimeter change.

Next allowed document revision: V2.9 only as evidence-driven revision or approved C2/C3 change-impact outcome.

## 3. Critical Invariants

- No authenticated principal, no operational proposal.
- No eligible reviewer, no real pilot.
- No required witness, no dispatch.
- JOKER-C2 is not an authority engine.
- HBCE Core retains authority, policy, dispatch and evidence.

## 4. V2.8 Execution Hardening Objects

- PreAuthSessionPolicy
- SessionAuthenticationTransition
- WitnessRequirementPolicy
- PilotSliceProfile
- ReviewerReadinessRecord
- NormativeDependencyEntry
- NonIdempotentRecoveryPolicy
- MatrixRow

## 5. V2.8 Backlog Critical Path

| Issue | Priority | Scope | Done when |
| --- | --- | --- | --- |
| V2-055 | P0 | PilotSliceProfile + MATRIX registry | Every P0 claim has gate/test/owner/evidence/descope. |
| V2-056 | P0 | PreAuthSessionPolicy | T113-T118 pass; default deny; prospective authentication transition. |
| V2-057 | P0_CONDITIONAL | WitnessRequirementPolicy | T119-T123 pass; W0/W1/W2 selected at G4. |
| V2-058 | P0_ORG | Reviewer Critical Path | T124-T127 pass; candidate, backup, deadline and eligibility recorded. |
| V2-059 | P0 | Normative Dependency Matrix | T128-T131 pass; source version/hash and local delta pinned. |
| V2-060 | P0_TARGET | NonIdempotentRecoveryPolicy | T132-T136 pass; no automatic retry after uncertainty. |
| V2-061 | P0 | Matrix completeness verifier | T137-T140 pass; unowned, untested or unevidenced rows block readiness. |

## 6. Minimum Level 1 Pilot Slice

| Capability | Status |
| --- | --- |
| JOKER activation + alias | P0 |
| PRE_AUTH boundary + authentication transition | P0 |
| Turn commitments | P0 |
| Proposal + ConfirmationView + human confirmation | P0 |
| Core authority/policy/precommit/dispatch/evidence | P0 |
| Offline verifier | P0 |
| One controlled target + one mutable action | P0_PILOT |
| Witness W1/W2 | CONDITIONAL_P0 |
| Commercial cutover automation | P1_OR_P0_FOR_LAUNCH_CONTINUITY |
| Voice/multilingual/advanced avatar | P1_P2 |
| Multi-system / robotics / advanced anchors | OUT_OF_CRITICAL_PATH |

## 7. Gate Extension

| Gate | V2.8 requirement |
| --- | --- |
| G0 | PilotSliceProfile, dependency matrix, owners, reviewer candidate+backup, buffer and W0/W1/W2 decision owner. |
| G1 | Minimum demo slice + PRE_AUTH boundary + JOKER activation/alias/turn commitments + offline CLI. |
| G2 | Mandatory MatrixRows PROVEN; reviewer VALIDATED; normative dependencies pinned; target recovery proven. |
| G3 | Buyer artifacts show slice claim set, limits, evidence and deferred scope. |
| G4 | Customer scope fixes auth boundary, witness level, target idempotency, data/custody, alias/provider and cutover. |
| G5 | G2+G4; reviewer readiness current; IPR-PILOT ACTIVE; time TRUSTED; required witness/recovery available. |
| G6 | Acceptance pack with final MatrixRows; blocker/UNKNOWN and risk acceptance remain separate. |
| G7 | Production review readiness. |
| G8 | Commercial access readiness. |

## 8. MATRIX Status Semantics

| Status | Meaning |
| --- | --- |
| PROVEN | Test/evidence satisfy claim for build/profile/scope. |
| NOT_PROVEN | Evidence missing or insufficient. |
| BLOCKED | Active P0 blocker; claim unusable in pilot. |
| DEFERRED | Outside Minimum Pilot Slice with rationale and future milestone. |
| DEMO_ONLY | Demonstrable in declared environment, not pilot claim. |

## 9. Repository Component Inventory

| Component | Path | Current status | Current limitation |
| --- | --- | --- | --- |
| canonical-json | `packages/hbce-core/canonical-json.js` | TESTED_LOCAL_P0 | V2.8 still requires full JCS/RFC8785 interoperability evidence for pilot profiles. |
| schema-registry | `packages/hbce-schemas` | TESTED_LOCAL_P0 | V2.8 objects and MATRIX schemas are not fully implemented yet. |
| request-envelope | `packages/hbce-api-contract` | TESTED_LOCAL_P0 | V2.8 PreAuthSessionPolicy and SessionAuthenticationTransition are not implemented yet. |
| policy-binding | `packages/hbce-policy` | TESTED_LOCAL_P0 | Policy binding does not create authority or dispatch. |
| critical-action-fsm | `packages/hbce-ftel/p0-critical-action-fsm.js` | TESTED_LOCAL_P0 | V2.8 witness gate and non-idempotent recovery are not implemented yet. |
| event-chain | `packages/hbce-events` | TESTED_LOCAL_P0 | Independent witness/custody integration not implemented yet. |
| revocation | `packages/hbce-trust` | TESTED_LOCAL_P0 | V2.8 target recovery and no-retry policy remain to implement. |
| target-receipt | `packages/hbce-targets` | TESTED_LOCAL_P0 | Current receipts are demo/mock; pilot signing/trust remains incomplete. |
| evidence-bundle | `packages/hbce-evidence` | TESTED_LOCAL_P0 | V2.8 MatrixRow evidence binding and multidimensional verification remain incomplete. |
| verifier-cli | `apps/hbce-verifier-cli` | TESTED_LOCAL_P0 | V2.8 T113-T140 readiness and MatrixRow evaluation not implemented yet. |
| demo-adapters | `apps/hbce-demo` | DEMO_VALIDATED_LOCAL | Demo-only; no real target dispatch. |
| level1-delivery-index | `docs/launch/level1/delivery-index.json` | TESTED_LOCAL_P0 | V2.3-aligned delivery index remains valid as demo package index, but V2.8 governs execution hardening from this record onward. |

## 10. Explicit Non-Claims

This V2.8 alignment record does not claim:

- G0 SPEC_CAPACITY_READY
- G1 DEMO_READY
- G2 PILOT_CANDIDATE
- G5 PILOT_START_READY
- real pilot readiness
- production readiness
- compliance certification
- legal liability proof
- physical truth proof
- independent review completed
- required witness available
- customer scope ready

## 11. Next Implementation Step

Implement V2-055 through V2-061 as repository artifacts and tests.

The next useful sequence is:

1. PilotSliceProfile + MATRIX registry
2. PreAuthSessionPolicy
3. SessionAuthenticationTransition
4. WitnessRequirementPolicy
5. ReviewerReadinessRecord
6. NormativeDependencyEntry
7. NonIdempotentRecoveryPolicy
8. Matrix completeness verifier
9. T113-T140 fixture coverage
10. Minimum Pilot Slice evidence pack
