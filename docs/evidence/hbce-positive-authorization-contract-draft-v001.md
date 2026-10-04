# HBCE Positive Authorization Contract Draft v001

Basis marker: `HBCE_RUNTIME_ACCESS_GATE_INTEGRATION_BOUNDARY_DRAFT_FINAL_AUDIT=1`

This document describes the HBCE Positive Authorization Contract Draft v001.

Contract object:

`HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001`

Expected marker:

`POSITIVE_AUTHORIZATION_CONTRACT_DRAFT=PASS`

Decision scope:

`ACCESS_AUTHORIZATION`

Authorization level:

`ACCESS_ONLY`

Contract mode:

`DRAFT_RECORD_ONLY`

Contract state:

`NOT_IMPLEMENTED_NOT_ISSUED_NOT_EXECUTABLE`

Source chain entry count: `10`

Contract binding count: `12`

Positive condition count: `13`

Allowed contract outcome count: `3`

Future runtime export field count: `14`

Required explicit non-claim count: `13`

Required no-execution boundary count: `14`

## Source chain

1. `HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001`
2. `HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V002`
3. `HBCE-RUNTIME-ACCESS-GATE-EVALUATION-HARNESS-V001`
4. `HBCE-RUNTIME-ACCESS-GATE-DRAFT-V001`
5. `HBCE-ACCESS-AUTHORIZATION-DECISION-RECORD-DRAFT-V001`
6. `HBCE-AUTHORIZATION-DECISION-RECORD-EVALUATION-HARNESS-V001`
7. `HBCE-ACCESS-AUTHORIZATION-PREDICATE-DRAFT-V001`
8. `HBCE-ACCESS-AUTHORIZATION-PREDICATE-EVALUATION-HARNESS-V001`
9. `HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-HARDENING-V001`
10. `HBCE-ACCESS-AUTHORIZATION-RECORD-SCHEMA-CONFORMANCE-HARNESS-V001`

## Contract bindings

1. `decision_scope_binding`
2. `authorization_level_binding`
3. `request_binding`
4. `authority_ref_binding`
5. `policy_evaluation_binding`
6. `access_authorization_predicate_binding`
7. `access_authorization_decision_record_binding`
8. `decision_actor_binding`
9. `scope_binding`
10. `boundary_state_binding`
11. `unknown_fail_closed_binding`
12. `no_execution_boundary_binding`

## Positive conditions

1. `PAC-001-DECISION-SCOPE-ACCESS-AUTHORIZATION`
2. `PAC-002-AUTHORIZATION-LEVEL-ACCESS-ONLY`
3. `PAC-003-REQUEST-BINDING-VALID`
4. `PAC-004-AUTHORITY-REF-VALID`
5. `PAC-005-POLICY-EVALUATION-APPROVES`
6. `PAC-006-PREDICATE-SATISFIED`
7. `PAC-007-DECISION-RECORD-APPROVED-RECORD-ONLY`
8. `PAC-008-DECISION-ACTOR-BOUND`
9. `PAC-009-SCOPE-BINDING-VALID`
10. `PAC-010-NO-UNKNOWN`
11. `PAC-011-NO-DENY`
12. `PAC-012-BOUNDARY-RULES-SATISFIED`
13. `PAC-013-NO-EXECUTION-BOUNDARY-PRESERVED`

## Failure precedence

1. `UNKNOWN_FAIL_CLOSED`
2. `DENY`
3. `NO_POSITIVE_CONTRACT`
4. `ALLOW_RECORD_ONLY`

## Allowed contract outcomes

1. `POSITIVE_AUTHORIZATION_CONTRACT_SATISFIED_RECORD_ONLY`
2. `POSITIVE_AUTHORIZATION_CONTRACT_DENIED_RECORD_ONLY`
3. `POSITIVE_AUTHORIZATION_CONTRACT_UNKNOWN_FAIL_CLOSED_RECORD_ONLY`

## Future runtime export fields

1. `contract_id`
2. `contract_version`
3. `decision_scope`
4. `authorization_level`
5. `request_binding_sha256`
6. `authority_ref_sha256`
7. `policy_evaluation_sha256`
8. `access_authorization_predicate_sha256`
9. `access_authorization_decision_record_sha256`
10. `decision_actor_ref`
11. `scope_binding_sha256`
12. `contract_outcome`
13. `created_at`
14. `created_by`

## Boundary

This draft does not implement a runtime gate.

It does not enable a runtime gate.

It does not issue a positive authorization contract.

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
