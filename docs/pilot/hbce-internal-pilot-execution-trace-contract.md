# HBCE Internal Pilot Execution Trace Contract

Program: `PROG-208-HBCE-INTERNAL-PILOT-EXECUTION-TRACE-CONTRACT`

This module defines and verifies the execution trace contract for the internal pilot.

## Scope

The contract defines the required correlation chain:

`request_id -> authorization_evaluation_id -> action_digest -> dispatch_id -> attempt_id -> target_receipt_id -> execution_trace_ref -> effect_evidence_ref`

## Boundary

This artifact defines the trace contract only.

It does not perform dispatch, does not create an execution trace, does not create a target receipt, does not create effect evidence, does not enable customer execution, and does not create external validation, legal review, certification, commercial release authorization or Level 4 eligibility.
