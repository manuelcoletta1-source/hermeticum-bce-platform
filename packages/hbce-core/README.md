# hbce-core

Status: PROG-002 P0 helper module.

This package currently provides a deterministic local canonical JSON profile and SHA-256 digest helpers for P0 tests.

Boundary:

- not a full RFC 8785/JCS compliance claim
- not a signing implementation
- not a production cryptographic policy
- not a regulatory proof mechanism

Implemented helpers:

- `canonicalizeJson(value)`
- `sha256Hex(value)`
- `sha256Digest(value)`

The helper rejects unsupported JSON values such as `undefined`, functions, symbols, BigInt, non-finite numbers, sparse arrays and non-plain objects.
