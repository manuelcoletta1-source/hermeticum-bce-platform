# HBCE PROG-062 - Level 3 Controller Receipt Contract

Status: LEVEL3_CONTROLLER_RECEIPT_CONTRACT_CREATED_NOT_EFFECT_PROOF

## Purpose

This artifact defines the Controller Receipt contract for Level 3.

It binds controller-side receipt, rejection or scoped acceptance to Level 3 action, safety and stop-envelope references.

It does not prove physical effect.

It does not authorize live control.

It does not permit physical actuation.

## Receipt Meaning

A controller receipt may prove that a controller interface received, rejected or accepted a request for simulation, observer mode or dry-run-no-actuation.

A controller receipt does not prove live physical effect.

A controller receipt does not prove physical deployment readiness.

A controller receipt does not clear Safe Hold or Emergency Stop.

## Required Boundary

A controller receipt must bind:

- controller_receipt_id
- controller_interface_ref
- physical_action_envelope_ref
- physical_safety_envelope_ref
- safe_hold_estop_ref
- receipt_status
- received_at
- controller_digest
- request_digest
- decision_code
- effect_claim
- evidence_refs
- fail_closed_rule

## Next Required Program

PROG-063-HBCE-LEVEL3-SENSOR-EVIDENCE-CONTRACT.
