# HBCE MATRIX EG-T17 Checkpoint Store Rewrite

Program: `PROG-236-HBCE-MATRIX-EG-T17-CHECKPOINT-STORE-REWRITE`

This module implements the MATRIX EG-T17 runtime evidence artifact.

## EG-T17 Required Result

When a checkpoint store is rewritten after an external witness receipt, the system must produce:

`WITNESS_RECEIPT_MISMATCH; external receipt wins over local rewrite`

## Boundary

This artifact proves only the EG-T17 checkpoint-store-rewrite-after-witness-receipt harness.

It proves that a local checkpoint store rewrite after a witness receipt is detected, that violation evidence is emitted, and that the external witness receipt wins over the local rewrite.

It does not prove full MATRIX implementation, Level 1 pilot readiness, C16 completion, external validation, legal review, certification, commercial release authorization, Level 4 eligibility, dispatch, target receipt, execution trace or effect evidence.

It does not authorize dispatch execution, does not emit a dispatch command, does not perform dispatch, does not call an external connector, does not contact a target system, does not create a target receipt, does not bind an execution trace and does not create effect evidence.
