# HBCE Access Authorization Record Public Index Refresh v001

Basis marker: `HBCE_AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS_FINAL_AUDIT=1`

This document describes a controlled public R&D index refresh for the HBCE access authorization record chain.

Refresh object:

`HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V001`

Index object:

`HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V001`

Expected markers:

`ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX_REFRESH=PASS`

`ACCESS_AUTHORIZATION_RECORD_PUBLIC_INDEX=PASS`

Scope:

- scope id: `ACCESS_AUTHORIZATION_RECORD_CHAIN`
- refresh mode: `CONTROLLED_PUBLIC_INDEX_REFRESH_ONLY`
- index mode: `CONTROLLED_PUBLIC_INDEX_ONLY`
- production registry: `false`

Indexed chain entry count: `4`

Indexed authorization objects:

1. `HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001`
2. `HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001`
3. `HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001`
4. `HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001`

Expected source markers:

- `ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS`
- `ACCESS_AUTHORIZATION_PREDICATE_EVALUATION_HARNESS=PASS`
- `ACCESS_AUTHORIZATION_DECISION_RECORD_DRAFT=PASS`
- `AUTHORIZATION_DECISION_RECORD_EVALUATION_HARNESS=PASS`

Boundary:

This refresh does not create a production registry.

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

Recommended next steps: `PROG-278`, `PROG-279`.
