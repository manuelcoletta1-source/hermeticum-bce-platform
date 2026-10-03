# HBCE Access Authorization Decision Record Draft v001

Basis marker: `HBCE_EVIDENCE_REGISTRY_PUBLIC_INDEX_REFRESH_FINAL_AUDIT=1`

This document describes a controlled R&D draft for recording an explicit access authorization decision.

Decision record object:

`HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001`

Expected marker:

`ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS`

Decision scope:

- decision scope: `ACCESS_AUTHORIZATION`
- authorization level: `ACCESS_ONLY`
- dispatch scope: `EXCLUDED`
- execution scope: `EXCLUDED`
- effect scope: `EXCLUDED`
- decision record mode: `CONTROLLED_R_AND_D_DRAFT_ONLY`

Source predicate:

`HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001`

Source predicate marker:

`ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS`

Source predicate evaluation harness:

`HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001`

Source predicate evaluation marker:

`ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS`

Evaluation source summary:

- eligible case count: `1`
- deny case count: `6`
- unknown fail-closed case count: `2`

Required record field count: `26`

Allowed decision outcomes:

- `ACCESS_AUTHORIZATION_APPROVED_RECORD_ONLY`
- `ACCESS_AUTHORIZATION_DENIED_RECORD_ONLY`
- `ACCESS_AUTHORIZATION_UNKNOWN_FAIL_CLOSED_RECORD_ONLY`

Fail-closed condition count: `12`

Approval preconditions include:

- predicate result must equal `ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE`
- policy evaluation result must equal `PASS`
- decision scope must equal `ACCESS_AUTHORIZATION`
- authorization level must equal `ACCESS_ONLY`
- authority reference must be present
- request binding must be present
- positive authorization contract must be present
- explicit decision actor must be present
- boundary assertions must be present

Boundary:

This draft does not grant access.

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

Recommended next steps: `PROG-276`, `PROG-277`.
