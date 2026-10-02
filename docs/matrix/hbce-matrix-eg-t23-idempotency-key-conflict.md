# HBCE MATRIX EG-T23 Idempotency Key Conflict

Program: `PROG-242-HBCE-MATRIX-EG-T23-IDEMPOTENCY-KEY-CONFLICT`

This module implements the MATRIX EG-T23 runtime evidence artifact.

## EG-T23 Required Result

When the same idempotency key is reused with a different payload digest, the system must produce:

`REJECT + IDEMPOTENCY_KEY_CONFLICT`

## Boundary

This artifact proves only the EG-T23 idempotency-key-conflict harness.

It proves that the same idempotency key with a different payload digest is rejected with `IDEMPOTENCY_KEY_CONFLICT`, while preserving the original authoritative result and creating no second effect.

It does not prove full MATRIX implementation, Level 1 pilot readiness, C16 completion, external validation, legal review, certification, commercial release authorization, Level 4 eligibility, dispatch, target receipt, execution trace or effect evidence.

It does not authorize dispatch execution, does not emit a dispatch command, does not perform dispatch, does not call an external connector, does not contact a target system, does not create a target receipt, does not bind an execution trace and does not create effect evidence.
