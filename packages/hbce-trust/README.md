# hbce-trust

Status: PROG-008 P0 revocation linearization.

This package contains the initial P0 revocation linearization module.

Implemented behavior:

- create deterministic revocation ledger
- sort revocation records by effective_at, observed_at and revocation_id
- bind every revocation to one authority_ref
- hash every revocation record
- hash the ledger
- verify linear order
- verify record hashes
- verify ledger hash
- evaluate whether a revocation was effective before or at a decision time
- fail closed when revocation is effective at decision time

Boundary:

- no dispatch implementation
- no physical execution
- no external registry mutation
- no legal or regulatory certification claim
- no verifier completeness claim

P0 rule:

`REVOCATION MUST LINEARIZE`

A critical decision must be evaluated against an ordered revocation view.
