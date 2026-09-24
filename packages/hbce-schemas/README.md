# hbce-schemas

Status: PROG-003 P0 schema registry module.

This package provides the initial local schema registry for the HBCE P0 implementation path.

Implemented behavior:

- load JSON schema files
- normalize schema records
- expose deterministic schema hashes
- reject duplicate schema registry keys
- reject schema version mismatches
- expose stable registry summaries

Boundary:

- no full JSON Schema 2020-12 validation engine
- no production schema migration policy
- no regulatory certification claim
- no external trust-anchor claim
- no verifier completeness claim

Next:

- PROG-004 RequestEnvelope schema and validator
