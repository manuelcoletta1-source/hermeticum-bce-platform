# HBCE-EG-001 Protected State Mutation Adapter

Program: `PROG-198-HBCE-EG-001-PROTECTED-STATE-MUTATION-ADAPTER`

This adapter is the operational entry point for protected-state mutation attempts.

## Rule

Protected states must not be written directly.

Direct writes to protected states produce `RejectedTransitionEvent` evidence through `HBCE-EG-001`.

Valid changes must use:

`guardedStateWriter(mode=GOVERNED_TRANSITION)`

which routes to:

`TransitionRequest -> DecisionRecord -> TransitionEvent -> StateProjectionRecord`.

## Protected states

- `PASS`
- `CLOSED`
- `RELEASE_CLEAN_ELIGIBLE`
- `EXTERNALLY_VALIDATED`
- `LEVEL_4_ELIGIBLE`

## Boundary

This adapter is enforcement plumbing for the Shared Core.

It does not create external validation, legal validity, certification, procurement eligibility or Level 4 eligibility.
