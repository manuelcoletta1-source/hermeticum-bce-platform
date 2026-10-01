# HBCE MATRIX EG-T18 Invalid Checkpoint Signing Key

Program: `PROG-237-HBCE-MATRIX-EG-T18-INVALID-CHECKPOINT-SIGNING-KEY`

This module implements the MATRIX EG-T18 runtime evidence artifact.

## EG-T18 Required Result

When a checkpoint is signed by an invalid, revoked or disallowed checkpoint signing key, the system must produce:

`CHECKPOINT_INVALID/SIGNER_KEY_NOT_ALLOWED; checkpoint not trusted`

## Boundary

This artifact proves only the EG-T18 invalid-checkpoint-signing-key harness.

It proves that an invalid, revoked or disallowed checkpoint signing key causes the checkpoint to be rejected as not trusted, with violation evidence emitted.

It does not prove full MATRIX implementation, Level 1 pilot readiness, C16 completion, external validation, legal review, certification, commercial release authorization, Level 4 eligibility, dispatch, target receipt, execution trace or effect evidence.

It does not authorize dispatch execution, does not emit a dispatch command, does not perform dispatch, does not call an external connector, does not contact a target system, does not create a target receipt, does not bind an execution trace and does not create effect evidence.
