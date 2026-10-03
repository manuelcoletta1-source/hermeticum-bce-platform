# HBCE Access Authorization Predicate Draft v001

Basis marker: `HBCE_EVIDENCE_OBJECT_MIGRATION_MAP_FINAL_AUDIT=1`

This document describes a local R&D access authorization predicate draft.

The predicate scope is `ACCESS_AUTHORIZATION`.

The authorization level is `ACCESS_ONLY`.

Dispatch, execution, and effect evidence scopes are excluded.

Required positive inputs:

- `ipr_status`: `verified`
- `ipr_card_status`: `issued`
- `certificate_status`: `active`
- `deny_state_absent`: `true`
- `mandate_present`: `true`
- `mandate_valid`: `true`
- `policy_evaluation_result`: `PASS`
- `authorization_record_present`: `true`
- `authority_ref_present`: `true`
- `request_binding_present`: `true`
- `decision_scope_explicit`: `true`
- `positive_authorization_contract_present`: `true`

Predicate result semantics:

- all required inputs satisfied: `ACCESS_AUTHORIZATION_PREDICATE_ELIGIBLE`
- any required input failed: `ACCESS_AUTHORIZATION_PREDICATE_DENY`
- any required input unknown: `ACCESS_AUTHORIZATION_PREDICATE_UNKNOWN_FAIL_CLOSED`

Expected marker:

`ACCESS_AUTHORIZATION_PREDICATE_DRAFT=PASS`

Boundary: eligible does not mean access granted, dispatch authorized, execution performed, or effect evidence created.

This draft does not grant access.

It does not create effect evidence.

Recommended next steps: `PROG-272`, `PROG-273`.
