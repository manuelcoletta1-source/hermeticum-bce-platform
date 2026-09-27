# HBCE PROG-061 - Level 3 Safe Hold and E-Stop Contract

Status: LEVEL3_SAFE_HOLD_ESTOP_CONTRACT_CREATED_NOT_LIVE_CONTROL_READY

## Purpose

This artifact defines fail-closed Safe Hold and Emergency Stop semantics for Level 3.

It applies to representation, simulation, observer mode and dry-run-no-actuation phases.

It does not authorize live control.

It does not permit physical actuation.

It does not certify machine safety.

## Rules

Safe Hold is required on boundary uncertainty, missing sensor evidence, lost human supervision, missing controller receipt, safety mismatch, action mismatch or expired time window.

Emergency Stop is required on manual or system stop request.

Emergency Stop dominates Safe Hold.

Reset requires human authorization.

Return to scope requires new evaluation.

AI models may report state.

AI models may not clear Safe Hold.

AI models may not clear Emergency Stop.

## Next Required Program

PROG-062-HBCE-LEVEL3-CONTROLLER-RECEIPT-CONTRACT.
