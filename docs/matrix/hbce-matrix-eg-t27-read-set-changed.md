# HBCE MATRIX EG-T27 Read Set Changed

Program: `PROG-246-HBCE-MATRIX-EG-T27-READ-SET-CHANGED`

This module implements the MATRIX EG-T27 runtime evidence artifact.

## EG-T27 Required Result

When an authority, mandate, policy, evidence or checkpoint input changes after evaluation and before commit, the system must produce:

`REJECT + READ_SET_CHANGED; no authoritative transition`

A typed `*_CHANGED` reason may be recorded, but the commit is rejected and no authoritative transition is created.

## Boundary

This artifact proves only the EG-T27 read-set changed pre-commit rejection harness.

It proves that a changed input set after evaluation and before commit is rejected with `READ_SET_CHANGED`, while no authoritative transition, transition event, projection update or effect evidence is created.

It does not prove full MATRIX implementation, Level 1 pilot readiness, C16 completion, external validation, legal review, certification, commercial release authorization, Level 4 eligibility, dispatch, target receipt, execution trace or effect evidence.

It does not authorize dispatch execution, does not emit a dispatch command, does not perform dispatch, does not call an external connector, does not contact a target system, does not create a target receipt, does not bind an execution trace and does not create effect evidence.
