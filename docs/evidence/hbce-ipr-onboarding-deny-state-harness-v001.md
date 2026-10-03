# HBCE IPR Onboarding Deny-State Harness v001

Basis marker: `HBCE_EVIDENCE_SCHEMA_CONFORMANCE_HARNESS_FINAL_AUDIT=1`

This document describes a local R&D deny-state harness for IPR onboarding states.

Canonical deny-state groups:

- `ipr_status`: `pending`, `rejected`, `revoked`, `suspended`, `expired`
- `ipr_card_status`: `pending`, `not_issued`, `revoked`, `expired`
- `certificate_status`: `pending`, `not_created`, `revoked`, `expired`

Expected marker:

`IPR_ONBOARDING_DENY_STATE_HARNESS=PASS`

Boundary: this harness does not claim onboarding implementation, identity verification, certificate issuance, access authorization, dispatch authorization, target receipt, execution trace or effect evidence.

It does not create effect evidence.

Recommended next steps: `PROG-270`, `PROG-271`.
