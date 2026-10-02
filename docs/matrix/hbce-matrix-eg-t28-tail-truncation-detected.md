# HBCE MATRIX EG-T28 Tail Truncation Detected

Program: `PROG-247-HBCE-MATRIX-EG-T28-TAIL-TRUNCATION-DETECTED`

This module implements the MATRIX EG-T28 runtime evidence artifact.

## EG-T28 Required Result

When an unwitnessed tail is truncated or suppressed before checkpoint, the system must produce:

`TAIL_TRUNCATION_DETECTED; head/gap check fails; affected promotion/dispatch blocked`

## Boundary

This artifact proves only the EG-T28 tail truncation detection harness.

It proves that a missing tail event causes head and sequence-gap checks to fail, emits a tail-truncation violation evidence event, and blocks affected promotion and dispatch.

It does not prove full MATRIX implementation, Level 1 pilot readiness, C16 completion, external validation, legal review, certification, commercial release authorization, Level 4 eligibility, dispatch, target receipt, execution trace or effect evidence.

It does not authorize dispatch execution, does not emit a dispatch command, does not perform dispatch, does not call an external connector, does not contact a target system, does not create a target receipt, does not bind an execution trace and does not create effect evidence.
