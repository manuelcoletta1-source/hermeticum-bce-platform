# HBCE Authority Reference Binding Draft v001

Classification: `R_AND_D_AUTHORITY_REFERENCE_BINDING_DRAFT_ONLY`

Canonical marker:

`AUTHORITY_REFERENCE_BINDING_DRAFT=PASS`

## Record identity

Object ID: `HBCE-AUTHORITY-REFERENCE-BINDING-DRAFT-V001`

Status: `ACTIVE_AUTHORITY_REFERENCE_BINDING_DRAFT`

Basis marker: `HBCE_ACCESS_AUTHORIZATION_REQUEST_BINDING_DRAFT_FINAL_AUDIT=1`

Basis main commit: `5b7f430c1f4e2103e013ee6d9ec78b8843cb6ab6`

Basis request binding: `HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001`

Decision scope: `ACCESS_AUTHORIZATION`

Authorization level: `ACCESS_ONLY`

Binding scope: `AUTHORITY_REFERENCE_BINDING`

Binding mode: `RECORD_ONLY_NOT_EXECUTABLE`

Authority binding state: `NOT_IMPLEMENTED_NOT_EXECUTABLE_NOT_BOUND_TO_RUNTIME`

## Source chain

Source chain entry count: `7`

1. `HBCE-ACCESS-AUTHORIZATION-REQUEST-BINDING-DRAFT-V001`
2. `HBCE-ACCESS-AUTHORIZATION-CHAIN-NEXT-STEP-DISCOVERY-V001`
3. `HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-V003`
4. `HBCE-ACCESS-AUTHORIZATION-RECORD-PUBLIC-INDEX-REFRESH-V003`
5. `HBCE-RUNTIME-ACCESS-GATE-INTEGRATION-BOUNDARY-DRAFT-V001`
6. `HBCE-POSITIVE-AUTHORIZATION-CONTRACT-DRAFT-V001`
7. `HBCE-POSITIVE-AUTHORIZATION-CONTRACT-EVALUATION-HARNESS-V001`

## Required authority fields

Required authority field count: `14`

1. `authority_ref`
2. `authority_type`
3. `authority_issuer_ref`
4. `authority_subject_ref`
5. `authority_scope`
6. `authority_validity`
7. `authority_source_ref`
8. `authority_evidence_ref`
9. `authority_policy_binding_ref`
10. `request_binding_ref`
11. `request_id`
12. `decision_scope`
13. `authorization_level`
14. `authority_resolution_state`

## Binding rules

Binding rule count: `10`

1. `AB-001-RECORD-ONLY`
2. `AB-002-NO-AUTHORITY-ASSERTION`
3. `AB-003-NO-AUTHORIZATION-DECISION`
4. `AB-004-NO-RUNTIME-GATE`
5. `AB-005-NO-ACCESS-GRANT`
6. `AB-006-NO-DISPATCH`
7. `AB-007-NO-EXECUTION`
8. `AB-008-NO-LEGAL-CERTIFICATION`
9. `AB-009-FUTURE-VALIDATION-ONLY`
10. `AB-010-UNKNOWN-FAIL-CLOSED`

## Future resolution

Future resolution requirement count: `14`

The resolution set includes canonical authority reference, authority type, issuer, subject, scope, validity, source reference, evidence reference, policy binding reference, request binding reference, request id, decision scope, authorization level, and authority resolution state.

## Future evaluation precedence

1. `MISSING_OR_MALFORMED_AUTHORITY_REFERENCE_FAIL_CLOSED`
2. `AUTHORITY_REFERENCE_EXPIRED_OR_UNTRUSTED_FAIL_CLOSED`
3. `AUTHORITY_SCOPE_MISMATCH_FAIL_CLOSED`
4. `AUTHORITY_REFERENCE_VALID_BUT_NOT_AUTHORIZING`
5. `FUTURE_POLICY_SCOPE_ACTOR_AND_DECISION_EVALUATION_REQUIRED`

## Recommended next step

Program: `PROG-290`

Title: `HBCE Policy Evaluation Binding Draft v001`

Object ID: `HBCE-POLICY-EVALUATION-BINDING-DRAFT-V001`

## Boundary

This record does not implement a runtime gate.

It does not enable a runtime gate.

It does not issue a positive authorization contract.

It does not validate authority.

It does not make authority effective.

It does not create an authorization decision.

It does not approve a request.

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

Required explicit non-claim count: `18`

Required no-execution boundary count: `18`

## Result

Expected result: `PASS_AUTHORITY_REFERENCE_BINDING_DRAFT`

Record result: `PASS_AUTHORITY_REFERENCE_BINDING_DRAFT_CREATED`
