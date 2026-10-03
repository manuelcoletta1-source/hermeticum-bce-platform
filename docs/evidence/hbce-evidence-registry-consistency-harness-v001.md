# HBCE Evidence Registry Consistency Harness v001

Basis marker: `HBCE_ACCESS_AUTHORIZATION_PREDICATE_DRAFT_FINAL_AUDIT=1`

This document describes a local R&D evidence registry consistency harness.

The harness verifies controlled evidence registry consistency across six public evidence objects.

Controlled inputs:

- `HBCE-EVIDENCE-OBJECT-SCHEMA-DRAFT-V001`
- `HBCE-IPR-ONBOARDING-EVIDENCE-RECORD-DRAFT-V001`
- `HBCE-EVIDENCE-SCHEMA-CONFORMANCE-HARNESS-V001`
- `HBCE-IPR-ONBOARDING-DENY-STATE-HARNESS-V001`
- `HBCE-EVIDENCE-OBJECT-MIGRATION-MAP-V001`
- `HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001`

Expected marker:

`EVIDENCE_REGISTRY_CONSISTENCY_HARNESS=PASS`

Marker embedding policy:

- registry-declared expected markers are required;
- historical artifact marker embedding is not required;
- embedded marker presence is reported;
- legacy artifact rewrite is not required.

Boundary:

This harness does not enable a production registry.

It does not rewrite the registry.

It does not rewrite history.

It does not change existing URLs.

It does not grant access.

It does not authorize dispatch.

It does not create execution traces.

It does not create effect evidence.

Recommended next steps: `PROG-273`, `PROG-274`.
