# HBCE MATRIX EG-T21 Time Source Untrusted

Program: `PROG-240-HBCE-MATRIX-EG-T21-TIME-SOURCE-UNTRUSTED`

This module implements the MATRIX EG-T21 runtime evidence artifact.

## EG-T21 Required Result

When clock drift or rollback exceeds the configured profile, the system must produce:

`TIME_SOURCE_UNTRUSTED; time-dependent guard becomes UNVERIFIED`

## Boundary

This artifact proves only the EG-T21 time-source-trust harness.

It proves that clock drift or rollback beyond profile makes the time source untrusted, and that a time-dependent guard becomes UNVERIFIED.

It does not prove full MATRIX implementation, Level 1 pilot readiness, C16 completion, external validation, legal review, certification, commercial release authorization, Level 4 eligibility, dispatch, target receipt, execution trace or effect evidence.

It does not authorize dispatch execution, does not emit a dispatch command, does not perform dispatch, does not call an external connector, does not contact a target system, does not create a target receipt, does not bind an execution trace and does not create effect evidence.
