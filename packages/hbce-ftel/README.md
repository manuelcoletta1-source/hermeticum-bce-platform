# hbce-ftel

Status: PROG-006 P0 CriticalAction FSM.

This package contains the initial P0 CriticalAction finite-state machine.

Implemented behavior:

- creates a CriticalAction from RequestEnvelope and P0 policy binding
- checks request hash binding between RequestEnvelope and policy binding
- classifies policy-denied, policy-unresolved and precommit-ready states
- blocks illegal transitions fail-closed
- records precommit transition when allowed by an already-authorized binding
- records target receipt transition after precommit
- never creates dispatch
- never performs physical execution

Boundary:

- no physical execution
- no dispatch implementation
- no external target mutation
- no positive authorization implementation
- no legal or regulatory certification claim
- no verifier completeness claim

P0 rule:

`RECEIPT != PHYSICAL EFFECT`

A target receipt may be recorded as evidence, but it does not prove physical effect by itself.
