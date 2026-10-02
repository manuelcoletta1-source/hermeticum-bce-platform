# HBCE MATRIX EG-T30 Fork / Sequence Gap Rejected

Program: `PROG-249-HBCE-MATRIX-EG-T30-FORK-SEQUENCE-GAP-REJECTED`

This module implements the MATRIX EG-T30 runtime evidence artifact.

## EG-T30 Required Result

When a fork or sequence gap is inserted into authoritative event history, the system must produce:

`CHECKPOINT_MISMATCH/TAIL_TRUNCATION_DETECTED; fork not accepted as canonical history`

## Boundary

This artifact proves only the EG-T30 authoritative-history fork/sequence-gap rejection harness.

It proves that a candidate fork/gap history fails checkpoint/head/sequence integrity checks, emits violation evidence, preserves canonical history and blocks affected promotion and dispatch.

It does not prove full MATRIX implementation, Level 1 pilot readiness, C16 completion, external validation, legal review, certification, commercial release authorization, Level 4 eligibility, dispatch, target receipt, execution trace or effect evidence.

It does not authorize dispatch execution, does not emit a dispatch command, does not perform dispatch, does not call an external connector, does not contact a target system, does not create a target receipt, does not bind an execution trace and does not create effect evidence.
