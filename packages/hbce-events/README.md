# hbce-events

Status: PROG-007 P0 precommit event chain.

This package contains the initial append-only P0 event chain.

Implemented behavior:

- create event chain
- append deterministic hash-linked events
- bind events to request hash and CriticalAction hash
- preserve previous event hash
- verify event sequence, head hash and chain hash
- keep dispatch and physical execution flags false

Boundary:

- no external anchoring
- no public registry mutation
- no dispatch implementation
- no physical execution
- no target mutation
- no legal or regulatory certification claim
- no verifier completeness claim

P0 rule:

Events are evidence records only.
A precommit event does not dispatch.
A receipt event does not prove physical effect.
