# hbce-targets

Status: PROG-009 P0 target receipt profile.

This package contains the initial P0 TargetReceipt profile.

Implemented behavior:

- create deterministic target receipt evidence
- bind receipt to request hash
- bind receipt to CriticalAction hash
- bind receipt to precommit hash
- bind receipt to event chain hash and head event hash
- verify receipt hash
- verify receipt binding to CriticalAction
- verify receipt binding to event chain
- preserve the boundary between receipt evidence and physical effect

Boundary:

- no dispatch implementation
- no physical execution
- no target mutation
- no physical-effect proof
- no legal or regulatory certification claim
- no verifier completeness claim

P0 rule:

`RECEIPT != PHYSICAL EFFECT`

A TargetReceipt is evidence that a target-side receipt was recorded.
It does not prove that a physical effect occurred.
