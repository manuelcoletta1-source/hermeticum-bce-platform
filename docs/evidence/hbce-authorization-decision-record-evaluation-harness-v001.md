# HBCE Authorization Decision Record Evaluation Harness v001

Basis marker: `HBCE_ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT_FINAL_AUDIT=1`

This document describes a controlled local R&D evaluation harness for the HBCE Access Authorization Decision Record Draft.

Harness object:

`HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001`

Decision record under evaluation:

`HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001`

Expected marker:

`AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS`

Evaluation scope:

- decision scope: `ACCESS_AUTHORIZATION`
- authorization level: `ACCESS_ONLY`
- evaluation mode: `CONTROLLED_LOCAL_HARNESS_ONLY`

Evaluation summary:

- evaluation case count: `9`
- approved record-only case count: `1`
- denied record-only case count: `6`
- unknown fail-closed record-only case count: `2`

Evaluation cases:

- `CASE-001-ALL-APPROVAL-PRECONDITIONS-SATISFIED`
- `CASE-002-PREDICATE-DENY`
- `CASE-003-POLICY-FAIL`
- `CASE-004-AUTHORITY-REF-MISSING`
- `CASE-005-REQUEST-BINDING-MISSING`
- `CASE-006-POSITIVE-AUTHORIZATION-CONTRACT-MISSING`
- `CASE-007-DECISION-ACTOR-MISSING`
- `CASE-008-MANDATE-VALID-UNKNOWN`
- `CASE-009-PREDICATE-RESULT-UNKNOWN`

Expected decision outcomes:

- `ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY`
- `ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY`
- `ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY`

Source decision record marker:

`ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS`

Source predicate marker:

`ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS`

Source predicate evaluation marker:

`ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS`

Boundary:

This harness does not grant access.

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

Recommended next steps: `PROG-277`, `PROG-278`.
