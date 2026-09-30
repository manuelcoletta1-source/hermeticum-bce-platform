# HBCE-EG-001 Append-Only Transition Log and State Projection

Program: `PROG-199-HBCE-EG-001-APPEND-ONLY-TRANSITION-LOG-STATE-PROJECTION`

This module binds HBCE-EG-001 to an append-only lineage model.

## Rule

The authoritative protected state is derived from replaying `TransitionEvent` lineage.

The projection cache is not authoritative. If projection cache differs from replay, replay wins and reconciliation records the mismatch.

## Event classes

- `TransitionEvent`: authoritative state transition event.
- `RejectedTransitionEvent`: evidence of rejected mutation or unsupported transition.
- `AppendOnlyReplayRecord`: replay/projection verification artifact.

## Boundary

This is Shared Core runtime plumbing for protected-state lineage.

It does not create external validation, legal validity, certification, procurement eligibility or Level 4 eligibility.
