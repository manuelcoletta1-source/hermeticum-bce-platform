# HBCE Runtime Access Gate Evaluation Harness v001

Basis marker: `HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1`

This document describes the controlled R&D evaluation harness for the HBCE Runtime Access Gate Draft.

Harness object:

`HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001`

Expected marker:

`RUNTIME_ACCESS_GATE_EVALUATION_HARNESS=PASS`

Decision scope:

`ACCESS_AUTHORIZATION`

Authorization level:

`ACCESS_ONLY`

Harness mode:

`CONTROLLED_RUNTIME_ACCESS_GATE_EVALUATION_HARNESS_ONLY`

Runtime gate draft:

`evidence/authorization/20261003_HBCE_RUNTIME_ACCESS_GATE_DRAFT_v001.json`

Schema conformance harness:

`evidence/authorization/20261003_HBCE_ACCESS_AUTHORIZATION_RECORD_SCHEMA_CONFORMANCE_HARNESS_v001.json`

Gate input count: `8`

Allowed gate outcome count: `3`

Evaluation case count: `12`

Allow case count: `1`

Deny case count: `8`

Unknown fail-closed case count: `3`

Required explicit non-claim count: `13`

Required no-execution boundary count: `13`

Source chain entry count: `4`

Gate precedence:

1. `RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY`
2. `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
3. `RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY`

Allowed gate outcomes:

1. `RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY`
2. `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
3. `RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY`

Evaluation cases:

1. `CASE-001-ALL-GATE-PRECONDITIONS-SATISFIED` expected `RUNTIME_ACCESS_GATE_ALLOW_RECORD_ONLY`
2. `CASE-002-SCOPE-BINDING-INVALID` expected `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
3. `CASE-003-REQUEST-BINDING-MISSING` expected `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
4. `CASE-004-AUTHORITY-REF-INVALID` expected `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
5. `CASE-005-POLICY-EVALUATION-DENY` expected `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
6. `CASE-006-PREDICATE-DENY` expected `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
7. `CASE-007-DECISION-RECORD-DENY` expected `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
8. `CASE-008-POSITIVE-AUTHORIZATION-CONTRACT-MISSING` expected `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
9. `CASE-009-DECISION-ACTOR-MISSING` expected `RUNTIME_ACCESS_GATE_DENY_RECORD_ONLY`
10. `CASE-010-AUTHORITY-REF-UNKNOWN` expected `RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY`
11. `CASE-011-PREDICATE-UNKNOWN` expected `RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY`
12. `CASE-012-UNKNOWN-PRECEDENCE-OVER-DENY` expected `RUNTIME_ACCESS_GATE_UNKNOWN_FAIL_CLOSED_RECORD_ONLY`

Boundary:

This runtime access gate evaluation harness does not implement a runtime gate.

It does not enable a runtime gate.

It does not grant access.

It does not authorize dispatch.

It does not authorize execution.

It does not enable a production authorization service.

It does not start onboarding.

It does not verify identity.

It does not issue certificates.

It does not create target receipts.

It does not create execution traces.

It does not create effect evidence.

It does not create legal certification.
