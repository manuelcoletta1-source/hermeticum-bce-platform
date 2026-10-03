# HBCE Access Authorization Predicate Evaluation Harness v001

Basis marker: `HBCE_EVIDENCE_REGISTRY_CONSISTENCY_HARNESS_FINAL_AUDIT=1`

This document describes a local R&D evaluation harness for the HBCE Access Authorization Predicate Draft.

Predicate under evaluation:

`HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001`

Expected marker:

`ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS`

Evaluation scope:

- decision scope: `ACCESS_AUTHORIZATION`
- authorization level: `ACCESS_ONLY`
- evaluation mode: `CONTROLLED_LOCAL_HARNESS_ONLY`
- production authorization service: `false`
- grant access: `false`
- authorize dispatch: `false`
- create execution trace: `false`
- create effect evidence: `false`

Evaluation cases:

- `CASE-001-ALL-REQUIRED-INPUTS-SATISFIED` -> `ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE`
- `CASE-002-IPR-STATUS-REVOKED` -> `ACCESS_AUTHORIZATION_PREDICATE_DENY`
- `CASE-003-IPR-CARD-NOT-ISSUED` -> `ACCESS_AUTHORIZATION_PREDICATE_DENY`
- `CASE-004-CERTIFICATE-EXPIRED` -> `ACCESS_AUTHORIZATION_PREDICATE_DENY`
- `CASE-005-MANDATE-MISSING` -> `ACCESS_AUTHORIZATION_PREDICATE_DENY`
- `CASE-006-POLICY-FAIL` -> `ACCESS_AUTHORIZATION_PREDICATE_DENY`
- `CASE-007-AUTHORIZATION-RECORD-MISSING` -> `ACCESS_AUTHORIZATION_PREDICATE_DENY`
- `CASE-008-MANDATE-VALID-UNKNOWN` -> `ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED`
- `CASE-009-POSITIVE-AUTHORIZATION-CONTRACT-UNKNOWN` -> `ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED`

Expected aggregate result:

- evaluation case count: `9`
- eligible case count: `1`
- deny case count: `6`
- unknown fail-closed case count: `2`

Boundary:

This harness does not grant access.

It does not authorize dispatch.

It does not enable a production authorization service.

It does not start onboarding.

It does not verify identity.

It does not issue certificates.

It does not create target receipts.

It does not create execution traces.

It does not create effect evidence.

Recommended next steps: `PROG-274`, `PROG-275`.
