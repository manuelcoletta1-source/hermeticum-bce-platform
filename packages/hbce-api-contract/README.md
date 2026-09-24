# hbce-api-contract

Status: PROG-004 P0 RequestEnvelope and base error contract.

Implemented behavior:

- RequestEnvelope normalization
- RequestEnvelope deterministic hash
- schema hash exposure through the P0 schema registry
- fail-closed validation errors
- idempotency key conflict detection

Boundary:

- no HTTP server implementation
- no enterprise IAM replacement
- no production authentication layer
- no complete JSON Schema 2020-12 runtime validation engine
- no legal or regulatory certification claim

P0 idempotency rule:

The same `idempotency_key` may replay only the same normalized RequestEnvelope hash.
The same `idempotency_key` with a different RequestEnvelope hash fails closed.
