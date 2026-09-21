# HBCE AUTHORIZATION DECISION CONTRACT

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Authorization Decision Contract
Version: 1.0 Candidate
Target release: 2027-01-19
Baseline main: 09bad1a docs(main): record post HBCE canonical evidence model checkpoint
Parent contract: HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
Parent matrix: HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
Authority boundary: HBCE_AUTHORITY_PROFILE_CONTRACT.md
Adapter boundary: HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
Evidence model: HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
Runtime schema baseline: P004_RUNTIME_EVIDENCE_SCHEMA.md
Acceptance gate baseline: P004_EVIDENCE_ACCEPTANCE_GATE.md
Human acceptance required: true

## 1. Purpose

This document defines the HBCE Authorization Decision Contract.

The Authorization Decision Contract defines how HBCE evaluates whether a bounded authority profile, a requested action, policy context and accepted evidence can produce an authorization result and a decision result.

The contract separates authority from authorization.

The contract separates authorization from decision.

The contract separates decision from execution.

The contract separates execution from MATRIX consequence.

The contract requires evidence before authorization can be accepted.

The contract requires policy evaluation before authorization can be accepted.

The contract requires a decision record before execution can be considered.

The contract requires canonical evidence for authorization and decision outcomes.

The contract is documentary and technical.

The contract does not implement runtime behavior.

The contract does not authorize production deployment.

The contract does not authorize L3 readiness.

The contract does not authorize PostgreSQL runtime readiness or execution.

The contract does not authorize P04/P05 concurrency execution.

The contract does not authorize OPC ALLOW.

The contract does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 2. Position in the HBCE chain

The canonical HBCE chain is:

Identity -> Mandate -> Authority -> Authorization -> Decision -> Execution -> Evidence -> Consequence -> MATRIX

This contract governs the following segment:

Authority -> Authorization -> Decision

The upstream inputs are:

- identity reference
- mandate reference
- Authority Profile
- source material
- policy references
- canonical evidence
- action request
- scope request
- constraint context
- temporal context
- audit context

The downstream outputs are:

- authorization record
- authorization evidence
- decision record
- decision evidence
- execution eligibility state
- denial evidence
- blocked evidence
- non-completed evidence

The contract does not govern execution implementation.

The contract does not update MATRIX.

The contract creates no production deployment approval.

## 3. Source requirements

This contract derives from the following requirement matrix entries:

- HBCE-REQ-000 - Program contract traceability
- HBCE-REQ-001 - HBCE product role
- HBCE-REQ-002 - External system non-replacement
- HBCE-REQ-003 - Canonical chain enforcement
- HBCE-REQ-004 - Identity is not authorization
- HBCE-REQ-005 - No authority without mandate
- HBCE-REQ-006 - Authorization must be bounded
- HBCE-REQ-007 - Policy evaluation fail-closed
- HBCE-REQ-008 - No execution without authority
- HBCE-REQ-009 - Execution must produce evidence
- HBCE-REQ-010 - Evidence immutability
- HBCE-REQ-011 - MATRIX consequence requires evidence
- HBCE-REQ-012 - Human acceptance required
- HBCE-REQ-300 - WP-TRUST recognized_by model
- HBCE-REQ-301 - WP-TRUST capability is not authority
- HBCE-REQ-400 - WP-CONFORMANCE chain
- HBCE-REQ-401 - Evidence hash required
- HBCE-REQ-500 - WP-PRIVACY minimum disclosure
- HBCE-REQ-501 - Disclosure is not authorization
- HBCE-REQ-700 - /ipr API contract
- HBCE-REQ-710 - /authority API contract
- HBCE-REQ-720 - /authorization API contract
- HBCE-REQ-730 - /decision API contract
- HBCE-REQ-740 - /evidence API contract
- HBCE-REQ-750 - /audit API contract
- HBCE-REQ-760 - /events API contract
- HBCE-REQ-900 - Golden Demo positive path
- HBCE-REQ-901 - Golden Demo negative path
- HBCE-REQ-902 - Release Candidate completion rule

## 4. Boundary preservation

This contract preserves the following boundary flags:

production_deployment: false
production_readiness: false
deployment_readiness: false
l3_promotion: false
l3_readiness: false
postgresql_runtime_readiness: false
postgresql_runtime_execution: false
p04_p05_concurrency_execution: false
opc_allow: false
legal_certification: false
eidas_qualification: false
regulated_kyc_aml_provider_status: false

This contract does not authorize production deployment.

This contract does not authorize deployment readiness.

This contract does not authorize L3 readiness.

This contract does not authorize PostgreSQL runtime readiness or PostgreSQL execution.

This contract does not authorize P04/P05 concurrency execution.

This contract does not authorize OPC ALLOW.

This contract does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 5. Definitions

### Authority

Authority is the bounded ability of a subject to be considered for action authorization under mandate, recognition, scope, constraints, policy and evidence.

Authority is not authorization.

Authority is not execution.

Authority is not final decision.

Authority must be represented by an Authority Profile.

### Authorization

Authorization is the evaluated permission state for a requested action under an Authority Profile, action binding, policy context, evidence context and constraints.

Authorization is bounded.

Authorization is evidence-bound.

Authorization is policy-bound.

Authorization is audit-bound.

Authorization is not execution.

Authorization is not MATRIX consequence.

Authorization does not create legal certification.

### Decision

Decision is the HBCE outcome produced after authorization evaluation.

Decision can allow, deny, block or mark non-completion.

Decision is not execution.

Decision is not external reality.

Decision is not MATRIX update.

Decision must produce canonical evidence.

### Action request

Action request is the requested operation, capability, transaction, workflow step or system action that requires authorization evaluation.

Action request must be bounded.

Action request must be hash-bound or reference-bound.

Action request must not be executed without decision.

### Action class

Action class is the category of requested action.

Action class must be checked against Authority Profile allowed_action_classes and denied_action_classes.

Unknown action class fails closed.

Unsupported action class fails closed.

### Policy context

Policy context is the set of policy references, policy versions, policy hashes, constraints and evaluation inputs used to determine authorization.

Unknown policy state fails closed.

Missing policy state fails closed.

Policy PASS is not production readiness.

### Constraint context

Constraint context is the set of limits that bind authorization.

Constraint context can include:

- scope limits
- temporal limits
- jurisdiction limits
- organization limits
- subject limits
- action limits
- amount limits
- data disclosure limits
- operational limits
- human acceptance limits

Constraint mismatch denies or blocks authorization.

### Authorization result

Authorization result is the structured outcome of an authorization evaluation.

Allowed high-level outcomes are:

- ALLOW_DOCUMENTARY
- ALLOW_WITH_LIMITATIONS
- DENY
- BLOCK
- NON_COMPLETED

Authorization result must not be converted directly into execution.

### Decision result

Decision result is the structured outcome delivered to the decision layer.

Allowed high-level outcomes are:

- DECISION_ALLOW
- DECISION_ALLOW_WITH_LIMITATIONS
- DECISION_DENY
- DECISION_BLOCK
- DECISION_NON_COMPLETED

Decision result must be evidence-bound.

Decision result must be audit-bound.

### Execution eligibility

Execution eligibility is the state indicating whether a decision may be considered by a separate execution boundary.

Execution eligibility is not execution.

Execution eligibility does not bypass execution controls.

Execution eligibility must be false unless authorization and decision requirements are satisfied.

### Denial

Denial means the requested action is not authorized.

Denial must produce evidence.

Denial must be auditable.

Denial must preserve reason codes.

### Block

Block means authorization or decision processing cannot continue because a mandatory condition failed, is unknown, is unsupported, or violates a boundary.

Block must produce evidence.

Block must be auditable.

Block must preserve reason codes.

### Non-completed

Non-completed means the authorization or decision record lacks required information, evidence, policy state, audit state or human acceptance state.

Non-completed cannot support execution.

Non-completed cannot support MATRIX consequence.

## 6. Non-equivalence rules

The following equivalence shortcuts are forbidden:

Identity = Authorization

Mandate = Authorization

Authority Profile = Authorization

Authority Profile PASS = Authorization PASS

Recognized_by = Authorization

Capability = Authorization

Role = Authorization

Policy PASS = Authorization

Policy PASS = Production Readiness

Evidence Acceptance = Authorization

Human Acceptance = Authorization

Authorization = Execution

Authorization PASS = Execution

Authorization PASS = MATRIX Update

Decision = Execution

Decision PASS = Execution

Decision PASS = MATRIX Update

Execution Eligibility = Execution

Audit = Authorization

Hash = Authorization

Action Request = Authorization

Action Class Allowed = Authorization

Authorization Evidence = Legal Certification

Decision Evidence = Legal Certification

Authorization PASS = Legal Certification

Decision PASS = Legal Certification

Authorization PASS = OPC ALLOW

Decision PASS = OPC ALLOW

Authorization PASS = L3 Readiness

Decision PASS = L3 Readiness

Authorization PASS = Production Deployment

Decision PASS = Production Deployment

## 7. Authorization responsibilities

The authorization layer is responsible for:

- receiving authorization requests
- binding action requests
- binding Authority Profile references
- verifying Authority Profile status
- verifying mandate-derived authority
- verifying action class
- verifying requested scope
- verifying denied action classes
- verifying constraints
- verifying temporal bounds
- verifying policy references
- evaluating policy context
- verifying canonical evidence references
- verifying evidence support status
- producing authorization result
- producing authorization evidence
- producing audit reference
- failing closed on unknown mandatory states

The authorization layer is not responsible for:

- creating identity
- creating mandate
- creating Authority Profile
- issuing credentials
- acting as wallet
- executing actions
- writing MATRIX consequences
- certifying legal validity
- declaring production readiness
- declaring OPC ALLOW

## 8. Decision responsibilities

The decision layer is responsible for:

- consuming authorization results
- verifying authorization result consistency
- binding decision request
- binding decision subject
- binding decision action
- binding decision scope
- binding decision evidence
- producing decision result
- producing decision evidence
- producing decision audit reference
- classifying execution eligibility
- preserving denial reason
- preserving block reason
- preserving limitation scope
- failing closed on unknown mandatory states

The decision layer is not responsible for:

- granting authority directly
- bypassing authorization
- executing actions
- writing MATRIX consequence directly
- certifying legal validity
- declaring production readiness
- declaring OPC ALLOW

## 9. Canonical authorization fields

Every authorization record must include:

- authorization_id
- authorization_version
- authorization_status
- authorization_result
- authorization_request_id
- subject_ref
- organization_ref
- authority_profile_ref
- action_ref
- action_hash
- action_class
- requested_scope
- evaluated_scope
- limitation_scope
- constraint_context_ref
- policy_refs
- policy_evaluation_refs
- evidence_refs
- evidence_support_state
- denied_reason
- blocked_reason
- non_completed_reason
- temporal_context
- jurisdiction_context
- decision_ref
- authorization_hash
- audit_ref
- created_at
- updated_at
- evaluated_at
- human_acceptance_state
- boundary_flags

No authorization record is valid without:

- authorization_id
- authorization_version
- authorization_status
- authorization_result
- authorization_request_id
- subject_ref
- authority_profile_ref
- action_ref
- action_hash
- action_class
- policy_refs
- evidence_refs
- evidence_support_state
- authorization_hash
- audit_ref
- human_acceptance_state
- boundary_flags

## 10. Canonical decision fields

Every decision record must include:

- decision_id
- decision_version
- decision_status
- decision_result
- decision_request_id
- authorization_ref
- subject_ref
- organization_ref
- authority_profile_ref
- action_ref
- action_hash
- action_class
- requested_scope
- evaluated_scope
- limitation_scope
- policy_evaluation_refs
- evidence_refs
- decision_evidence_ref
- execution_eligibility_state
- execution_boundary_ref
- denied_reason
- blocked_reason
- non_completed_reason
- decision_hash
- audit_ref
- created_at
- updated_at
- decided_at
- human_acceptance_state
- boundary_flags

No decision record is valid without:

- decision_id
- decision_version
- decision_status
- decision_result
- decision_request_id
- authorization_ref
- subject_ref
- authority_profile_ref
- action_ref
- action_hash
- action_class
- evidence_refs
- decision_evidence_ref
- execution_eligibility_state
- decision_hash
- audit_ref
- human_acceptance_state
- boundary_flags

## 11. Authorization status values

Allowed authorization_status values:

- DRAFT
- RECEIVED
- EVALUATING
- EVALUATED
- ALLOWED_DOCUMENTARY
- ALLOWED_WITH_LIMITATIONS
- DENIED
- BLOCKED
- NON_COMPLETED
- ARCHIVED
- REVOKED

Default authorization_status:

DRAFT

No authorization_status authorizes execution by itself.

No authorization_status authorizes production deployment.

No authorization_status authorizes OPC ALLOW.

## 12. Authorization result values

Allowed authorization_result values:

- NOT_EVALUATED
- ALLOW_DOCUMENTARY
- ALLOW_WITH_LIMITATIONS
- DENY_MISSING_AUTHORITY_PROFILE
- DENY_INVALID_AUTHORITY_PROFILE
- DENY_AUTHORITY_NOT_ACCEPTED
- DENY_ACTION_CLASS_NOT_ALLOWED
- DENY_ACTION_CLASS_EXPLICITLY_DENIED
- DENY_SCOPE_MISMATCH
- DENY_CONSTRAINT_MISMATCH
- DENY_TEMPORAL_MISMATCH
- DENY_JURISDICTION_MISMATCH
- DENY_POLICY_FAILED
- DENY_EVIDENCE_UNSUPPORTED
- BLOCK_POLICY_UNKNOWN
- BLOCK_EVIDENCE_MISSING
- BLOCK_EVIDENCE_REJECTED
- BLOCK_EVIDENCE_REVOKED
- BLOCK_HASH_MISMATCH
- BLOCK_AUDIT_MISSING
- BLOCK_BOUNDARY_VIOLATION
- NON_COMPLETED

Default authorization_result:

NOT_EVALUATED

Unknown authorization state fails closed.

Unknown policy state fails closed.

Unknown evidence support state fails closed.

## 13. Decision status values

Allowed decision_status values:

- DRAFT
- RECEIVED
- EVALUATING
- DECIDED
- ALLOWED_DOCUMENTARY
- ALLOWED_WITH_LIMITATIONS
- DENIED
- BLOCKED
- NON_COMPLETED
- ARCHIVED
- REVOKED

Default decision_status:

DRAFT

No decision_status executes an action by itself.

No decision_status updates MATRIX by itself.

No decision_status authorizes production deployment.

## 14. Decision result values

Allowed decision_result values:

- NOT_DECIDED
- DECISION_ALLOW
- DECISION_ALLOW_WITH_LIMITATIONS
- DECISION_DENY_AUTHORIZATION_FAILED
- DECISION_DENY_SCOPE_MISMATCH
- DECISION_DENY_CONSTRAINT_MISMATCH
- DECISION_DENY_POLICY_FAILED
- DECISION_DENY_EVIDENCE_UNSUPPORTED
- DECISION_BLOCK_POLICY_UNKNOWN
- DECISION_BLOCK_EVIDENCE_MISSING
- DECISION_BLOCK_EVIDENCE_REJECTED
- DECISION_BLOCK_EVIDENCE_REVOKED
- DECISION_BLOCK_HASH_MISMATCH
- DECISION_BLOCK_AUDIT_MISSING
- DECISION_BLOCK_BOUNDARY_VIOLATION
- DECISION_NON_COMPLETED

Default decision_result:

NOT_DECIDED

Unknown decision state fails closed.

Unknown authorization result fails closed.

## 15. Evidence support states

Allowed evidence_support_state values:

- NOT_EVALUATED
- SUPPORTED_BY_ACCEPTED_EVIDENCE
- SUPPORTED_WITH_LIMITATIONS
- UNSUPPORTED_MISSING_EVIDENCE
- UNSUPPORTED_REJECTED_EVIDENCE
- UNSUPPORTED_REVOKED_EVIDENCE
- UNSUPPORTED_BLOCKED_EVIDENCE
- UNSUPPORTED_NON_COMPLETED_EVIDENCE
- UNSUPPORTED_HASH_MISMATCH
- UNSUPPORTED_SCHEMA_MISMATCH
- UNKNOWN
- NON_COMPLETED

Default evidence_support_state:

NOT_EVALUATED

Only SUPPORTED_BY_ACCEPTED_EVIDENCE can support unqualified positive authorization.

SUPPORTED_WITH_LIMITATIONS can support only bounded positive authorization.

Every unsupported state denies, blocks or marks non-completion.

UNKNOWN fails closed.

## 16. Execution eligibility states

Allowed execution_eligibility_state values:

- NOT_ELIGIBLE
- ELIGIBLE_DOCUMENTARY
- ELIGIBLE_WITH_LIMITATIONS
- BLOCKED
- DENIED
- NON_COMPLETED

Default execution_eligibility_state:

NOT_ELIGIBLE

Execution eligibility is not execution.

Execution eligibility does not bypass Execution Boundary.

Execution eligibility does not update MATRIX.

Execution eligibility must be false for denied, blocked or non-completed decisions.

## 17. Mandatory boundary flags inside authorization and decision records

Every authorization record and decision record must include:

production_deployment: false
production_readiness: false
deployment_readiness: false
l3_promotion: false
l3_readiness: false
postgresql_runtime_readiness: false
postgresql_runtime_execution: false
p04_p05_concurrency_execution: false
opc_allow: false
legal_certification: false
eidas_qualification: false
regulated_kyc_aml_provider_status: false

If any boundary flag is missing, the record is NON_COMPLETED.

If any boundary flag is true, the record is BLOCKED unless a future explicit contract permits it.

No such permission exists in this contract.

## 18. Human acceptance states

Allowed human_acceptance_state values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Default human_acceptance_state:

PENDING

Authorization or decision records with human_acceptance_state PENDING remain NON_COMPLETED for Release Candidate completion.

Human acceptance cannot override:

- missing Authority Profile
- invalid Authority Profile
- missing action hash
- policy failure
- unknown policy
- missing evidence
- rejected evidence
- revoked evidence
- hash mismatch
- missing audit
- boundary violation
- production deployment boundary
- OPC ALLOW boundary
- legal certification boundary

## 19. Minimum authorization schema

The minimum authorization structure is:

authorization_id:
  type: string
  required: true

authorization_version:
  type: string
  required: true

authorization_status:
  type: enum
  required: true

authorization_result:
  type: enum
  required: true

authorization_request_id:
  type: string
  required: true

subject_ref:
  type: string
  required: true

organization_ref:
  type: string
  required: false

authority_profile_ref:
  type: string
  required: true

action_ref:
  type: string
  required: true

action_hash:
  type: string
  required: true

action_class:
  type: string
  required: true

requested_scope:
  type: object
  required: true

evaluated_scope:
  type: object
  required: false

limitation_scope:
  type: object
  required: false

constraint_context_ref:
  type: string
  required: false

policy_refs:
  type: array
  required: true
  min_items: 1

policy_evaluation_refs:
  type: array
  required: true
  min_items: 1

evidence_refs:
  type: array
  required: true
  min_items: 1

evidence_support_state:
  type: enum
  required: true

denied_reason:
  type: string
  required: false

blocked_reason:
  type: string
  required: false

non_completed_reason:
  type: string
  required: false

temporal_context:
  type: object
  required: true

jurisdiction_context:
  type: object
  required: false

decision_ref:
  type: string
  required: false

authorization_hash:
  type: string
  required: true

audit_ref:
  type: string
  required: true

created_at:
  type: string
  required: true

updated_at:
  type: string
  required: false

evaluated_at:
  type: string
  required: false

human_acceptance_state:
  type: enum
  required: true

boundary_flags:
  type: object
  required: true

## 20. Minimum decision schema

The minimum decision structure is:

decision_id:
  type: string
  required: true

decision_version:
  type: string
  required: true

decision_status:
  type: enum
  required: true

decision_result:
  type: enum
  required: true

decision_request_id:
  type: string
  required: true

authorization_ref:
  type: string
  required: true

subject_ref:
  type: string
  required: true

organization_ref:
  type: string
  required: false

authority_profile_ref:
  type: string
  required: true

action_ref:
  type: string
  required: true

action_hash:
  type: string
  required: true

action_class:
  type: string
  required: true

requested_scope:
  type: object
  required: true

evaluated_scope:
  type: object
  required: false

limitation_scope:
  type: object
  required: false

policy_evaluation_refs:
  type: array
  required: true
  min_items: 1

evidence_refs:
  type: array
  required: true
  min_items: 1

decision_evidence_ref:
  type: string
  required: true

execution_eligibility_state:
  type: enum
  required: true

execution_boundary_ref:
  type: string
  required: false

denied_reason:
  type: string
  required: false

blocked_reason:
  type: string
  required: false

non_completed_reason:
  type: string
  required: false

decision_hash:
  type: string
  required: true

audit_ref:
  type: string
  required: true

created_at:
  type: string
  required: true

updated_at:
  type: string
  required: false

decided_at:
  type: string
  required: false

human_acceptance_state:
  type: enum
  required: true

boundary_flags:
  type: object
  required: true

## 21. Authorization evaluation prerequisites

Authorization evaluation requires:

- authorization request id
- subject reference
- Authority Profile reference
- action reference
- action hash
- action class
- requested scope
- policy references
- policy evaluation references
- accepted or limited canonical evidence references
- evidence support state
- temporal context
- audit reference
- boundary flags
- human acceptance state

If any mandatory prerequisite is missing, result is NON_COMPLETED.

If Authority Profile is missing, result is DENY_MISSING_AUTHORITY_PROFILE.

If Authority Profile is invalid, result is DENY_INVALID_AUTHORITY_PROFILE.

If Authority Profile is not accepted within its documentary boundary, result is DENY_AUTHORITY_NOT_ACCEPTED.

If policy state is unknown, result is BLOCK_POLICY_UNKNOWN.

If evidence is missing, result is BLOCK_EVIDENCE_MISSING.

If boundary flag is violated, result is BLOCK_BOUNDARY_VIOLATION.

## 22. Decision evaluation prerequisites

Decision evaluation requires:

- decision request id
- authorization reference
- authorization result
- subject reference
- Authority Profile reference
- action reference
- action hash
- action class
- evidence references
- decision evidence reference
- policy evaluation references
- execution eligibility state
- audit reference
- boundary flags
- human acceptance state

If authorization reference is missing, decision is NON_COMPLETED.

If authorization result is denied, decision must deny.

If authorization result is blocked, decision must block.

If authorization result is non-completed, decision must be non-completed.

If authorization result is allowed with limitations, decision must preserve limitations.

If decision evidence is missing, decision is NON_COMPLETED.

## 23. Authorization evaluation algorithm

Authorization evaluation must follow this order:

1. Receive authorization request.
2. Assign authorization_id.
3. Verify authorization_request_id.
4. Verify subject_ref.
5. Verify authority_profile_ref.
6. Load Authority Profile evaluation state.
7. Verify Authority Profile is eligible for authorization consideration.
8. Verify action_ref.
9. Verify action_hash.
10. Verify action_class.
11. Check action_class against allowed_action_classes.
12. Check action_class against denied_action_classes.
13. Verify requested_scope.
14. Evaluate scope against Authority Profile scope.
15. Evaluate constraints.
16. Evaluate temporal context.
17. Evaluate jurisdiction context when present.
18. Load policy_refs.
19. Evaluate policy_refs.
20. Fail closed on unknown policy state.
21. Load canonical evidence refs.
22. Evaluate evidence support state.
23. Fail closed on missing, rejected, revoked, blocked or non-completed evidence.
24. Verify boundary flags.
25. Verify audit_ref.
26. Compute authorization_hash.
27. Produce authorization_result.
28. Produce authorization evidence.
29. Produce audit update.
30. Preserve human_acceptance_state.

No step may be skipped silently.

Unknown mandatory state fails closed.

Missing mandatory field produces NON_COMPLETED.

## 24. Decision evaluation algorithm

Decision evaluation must follow this order:

1. Receive decision request.
2. Assign decision_id.
3. Verify decision_request_id.
4. Load authorization_ref.
5. Verify authorization_result.
6. Verify authorization_hash.
7. Verify subject_ref.
8. Verify authority_profile_ref.
9. Verify action_ref.
10. Verify action_hash.
11. Verify action_class.
12. Verify policy_evaluation_refs.
13. Verify evidence_refs.
14. Verify decision_evidence_ref.
15. Preserve authorization limitations.
16. Preserve denied reason when denied.
17. Preserve blocked reason when blocked.
18. Verify boundary flags.
19. Verify audit_ref.
20. Compute decision_hash.
21. Classify execution_eligibility_state.
22. Produce decision_result.
23. Produce decision evidence.
24. Produce audit update.
25. Preserve human_acceptance_state.

No step may be skipped silently.

Unknown mandatory state fails closed.

Missing mandatory field produces NON_COMPLETED.

## 25. Positive authorization path

A positive authorization path requires:

- accepted or accepted-with-limitations Authority Profile
- action class allowed
- action class not denied
- requested scope within authority scope
- constraints satisfied
- temporal context satisfied
- policy evaluation PASS
- canonical evidence accepted or accepted with limitations
- evidence support state valid
- authorization hash valid
- audit reference present
- boundary flags false
- human acceptance state recorded

Positive authorization may produce:

ALLOW_DOCUMENTARY

or:

ALLOW_WITH_LIMITATIONS

Positive authorization does not execute.

Positive authorization does not update MATRIX.

Positive authorization does not authorize production deployment.

## 26. Positive decision path

A positive decision path requires:

- authorization result ALLOW_DOCUMENTARY or ALLOW_WITH_LIMITATIONS
- authorization hash valid
- evidence references valid
- decision evidence reference valid
- policy evaluation references valid
- boundary flags false
- audit reference present
- human acceptance state recorded

Positive decision may produce:

DECISION_ALLOW

or:

DECISION_ALLOW_WITH_LIMITATIONS

Positive decision may produce:

ELIGIBLE_DOCUMENTARY

or:

ELIGIBLE_WITH_LIMITATIONS

Positive decision does not execute.

Positive decision does not update MATRIX.

Positive decision does not authorize production deployment.

## 27. Negative authorization paths

The following negative authorization paths must be supported:

- missing authorization request id
- missing subject reference
- missing Authority Profile
- invalid Authority Profile
- Authority Profile not accepted
- missing action reference
- missing action hash
- hash mismatch
- unsupported action class
- action class not allowed
- action class explicitly denied
- requested scope mismatch
- constraint mismatch
- temporal mismatch
- jurisdiction mismatch
- missing policy reference
- unknown policy
- policy failure
- missing evidence
- rejected evidence
- revoked evidence
- blocked evidence
- non-completed evidence
- missing audit reference
- boundary flag violation
- human acceptance pending

Each negative path must produce authorization evidence.

Each negative path must be auditable.

Each negative path must not produce execution eligibility.

## 28. Negative decision paths

The following negative decision paths must be supported:

- missing decision request id
- missing authorization reference
- invalid authorization reference
- authorization denied
- authorization blocked
- authorization non-completed
- authorization hash mismatch
- missing decision evidence reference
- missing evidence references
- rejected evidence
- revoked evidence
- blocked evidence
- non-completed evidence
- missing policy evaluation reference
- missing audit reference
- boundary flag violation
- human acceptance pending

Each negative path must produce decision evidence.

Each negative path must be auditable.

Each negative path must not execute.

Each negative path must not update MATRIX.

## 29. Policy relationship

Authorization and decision must be policy-bound.

Policy evaluation must include:

- policy_ref
- policy_version
- policy_hash
- evaluation_result
- evaluation_reason
- evaluation_trace_ref
- audit_ref

Policy UNKNOWN fails closed.

Policy missing fails closed.

Policy FAIL denies or blocks.

Policy PASS does not equal authorization by itself.

Policy PASS does not equal decision by itself.

Policy PASS does not equal production readiness.

Policy PASS does not equal OPC ALLOW.

## 30. Evidence relationship

Authorization and decision must produce or reference canonical evidence.

Evidence must comply with:

HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md

Authorization evidence must include:

- authorization_id
- authorization_result
- action_ref
- action_hash
- policy_evaluation_refs
- evidence_refs
- evidence_support_state
- authorization_hash
- audit_ref
- boundary_flags

Decision evidence must include:

- decision_id
- decision_result
- authorization_ref
- action_ref
- action_hash
- policy_evaluation_refs
- evidence_refs
- execution_eligibility_state
- decision_hash
- audit_ref
- boundary_flags

Rejected evidence cannot support authorization.

Revoked evidence cannot support authorization.

Blocked evidence cannot support authorization.

Non-completed evidence cannot support authorization.

Accepted-with-limitations evidence can support only within limitation scope.

## 31. Audit relationship

Authorization and decision must be audit-bound.

Authorization audit must preserve:

- request id
- subject reference
- Authority Profile reference
- action reference
- action hash
- action class
- requested scope
- evaluated scope
- policy evaluation refs
- evidence refs
- authorization result
- reason codes
- boundary flags
- human acceptance state

Decision audit must preserve:

- decision request id
- authorization reference
- authorization result
- decision result
- execution eligibility state
- evidence refs
- decision evidence ref
- reason codes
- boundary flags
- human acceptance state

Missing audit produces NON_COMPLETED.

Audit does not imply authorization.

Audit does not imply decision acceptance.

## 32. Authority Profile relationship

Authorization must consume Authority Profile as input.

Authorization must not create Authority Profile.

Authorization must verify Authority Profile status.

Authorization must verify Authority Profile scope.

Authorization must verify Authority Profile constraints.

Authorization must verify Authority Profile temporal bounds.

Authorization must verify Authority Profile evidence refs.

Authority Profile PASS does not automatically authorize action.

Authority Profile scope limits authorization scope.

Authority Profile denied action classes override requested action.

## 33. Business Wallet Adapter relationship

Business Wallet Adapter may provide upstream source material.

Business Wallet Adapter output cannot authorize an action.

Business Wallet Adapter PASS is not authorization.

Business Wallet Adapter ROUTED is not authorization.

Business Wallet Adapter evidence must pass Canonical Evidence Model validation before supporting authorization.

Wallet-like input cannot authorize execution.

External credential-like input cannot authorize execution.

## 34. Execution Boundary relationship

Authorization and decision may only create execution eligibility.

Execution Boundary must separately evaluate whether execution may occur.

Execution Boundary must verify:

- decision reference
- decision result
- execution eligibility state
- decision evidence
- execution constraints
- boundary flags
- audit reference

This contract does not implement Execution Boundary.

This contract does not execute.

Execution Boundary remains a future contract.

## 35. MATRIX relationship

Authorization does not update MATRIX.

Decision does not update MATRIX.

Execution eligibility does not update MATRIX.

MATRIX consequence requires:

- execution evidence
- accepted canonical evidence
- consequence evidence
- audit reference
- limitation preservation

Rejected, blocked, revoked or non-completed evidence cannot support MATRIX consequence.

## 36. /authorization API minimum contract

The /authorization API family must support the following conceptual operations:

- create authorization request
- evaluate authorization request
- retrieve authorization record
- retrieve authorization evidence
- retrieve authorization audit
- classify authorization support state
- deny authorization
- block authorization
- archive authorization
- revoke authorization documentary record when applicable

This document does not implement the API.

This document defines minimum API obligations for future implementation.

## 37. /authorization request minimum fields

A /authorization request must include:

- request_id
- subject_ref
- organization_ref when applicable
- authority_profile_ref
- action_ref
- action_hash
- action_class
- requested_scope
- policy_refs
- evidence_refs
- temporal_context
- boundary_flags
- human_acceptance_state

Missing request_id blocks the request.

Missing subject_ref blocks the request.

Missing authority_profile_ref denies or blocks the request.

Missing action_ref blocks the request.

Missing action_hash blocks the request.

Missing action_class blocks the request.

Missing policy_refs blocks the request.

Missing evidence_refs blocks the request.

Missing boundary_flags blocks the request.

## 38. /authorization response minimum fields

A /authorization response must include:

- request_id
- authorization_id
- authorization_status
- authorization_result
- subject_ref
- authority_profile_ref
- action_ref
- action_hash
- action_class
- evidence_support_state
- policy_evaluation_refs
- evidence_refs
- authorization_hash
- audit_ref
- human_acceptance_state
- boundary_flags

A response without authorization_result is invalid.

A response without authorization_hash is NON_COMPLETED.

A response without audit_ref is NON_COMPLETED.

A positive authorization response does not execute.

## 39. /decision API minimum contract

The /decision API family must support the following conceptual operations:

- create decision request
- evaluate decision request
- retrieve decision record
- retrieve decision evidence
- retrieve decision audit
- classify execution eligibility
- deny decision
- block decision
- archive decision
- revoke decision documentary record when applicable

This document does not implement the API.

This document defines minimum API obligations for future implementation.

## 40. /decision request minimum fields

A /decision request must include:

- request_id
- authorization_ref
- subject_ref
- authority_profile_ref
- action_ref
- action_hash
- action_class
- evidence_refs
- policy_evaluation_refs
- decision_evidence_ref or evidence creation context
- boundary_flags
- human_acceptance_state

Missing request_id blocks the request.

Missing authorization_ref blocks the request.

Missing subject_ref blocks the request.

Missing authority_profile_ref blocks the request.

Missing action_ref blocks the request.

Missing action_hash blocks the request.

Missing evidence_refs blocks the request.

Missing policy_evaluation_refs blocks the request.

Missing boundary_flags blocks the request.

## 41. /decision response minimum fields

A /decision response must include:

- request_id
- decision_id
- decision_status
- decision_result
- authorization_ref
- subject_ref
- authority_profile_ref
- action_ref
- action_hash
- action_class
- evidence_refs
- decision_evidence_ref
- execution_eligibility_state
- decision_hash
- audit_ref
- human_acceptance_state
- boundary_flags

A response without decision_result is invalid.

A response without decision_hash is NON_COMPLETED.

A response without decision_evidence_ref is NON_COMPLETED.

A response with execution eligibility does not execute.

## 42. Error model

Allowed Authorization Decision error classes:

- AD_REQUEST_INVALID
- AD_AUTHORIZATION_REQUEST_ID_MISSING
- AD_DECISION_REQUEST_ID_MISSING
- AD_SUBJECT_REF_MISSING
- AD_AUTHORITY_PROFILE_MISSING
- AD_AUTHORITY_PROFILE_INVALID
- AD_AUTHORITY_PROFILE_NOT_ACCEPTED
- AD_ACTION_REF_MISSING
- AD_ACTION_HASH_MISSING
- AD_ACTION_HASH_MISMATCH
- AD_ACTION_CLASS_MISSING
- AD_ACTION_CLASS_UNSUPPORTED
- AD_ACTION_CLASS_NOT_ALLOWED
- AD_ACTION_CLASS_EXPLICITLY_DENIED
- AD_SCOPE_MISMATCH
- AD_CONSTRAINT_MISMATCH
- AD_TEMPORAL_MISMATCH
- AD_JURISDICTION_MISMATCH
- AD_POLICY_REF_MISSING
- AD_POLICY_UNKNOWN
- AD_POLICY_FAILED
- AD_EVIDENCE_MISSING
- AD_EVIDENCE_REJECTED
- AD_EVIDENCE_REVOKED
- AD_EVIDENCE_BLOCKED
- AD_EVIDENCE_NON_COMPLETED
- AD_EVIDENCE_HASH_MISMATCH
- AD_AUDIT_REF_MISSING
- AD_BOUNDARY_FLAGS_MISSING
- AD_BOUNDARY_BLOCKED
- AD_HUMAN_ACCEPTANCE_PENDING
- AD_AUTHORIZATION_REF_MISSING
- AD_AUTHORIZATION_HASH_MISMATCH
- AD_DECISION_EVIDENCE_MISSING
- AD_NON_COMPLETED

Error responses must be evidence-linked when possible.

Error responses must be auditable.

Error responses must not create execution eligibility.

Error responses must not update MATRIX.

## 43. Required tests

### HBCE-AD-TST-001 - Valid bounded authorization

Expected result:

A valid Authority Profile, supported action class, valid scope, passing policy evaluation and accepted canonical evidence produce ALLOW_DOCUMENTARY.

### HBCE-AD-TST-002 - Valid bounded decision

Expected result:

A valid authorization result produces DECISION_ALLOW and ELIGIBLE_DOCUMENTARY without execution.

### HBCE-AD-TST-003 - Missing Authority Profile

Expected result:

Authorization returns DENY_MISSING_AUTHORITY_PROFILE.

### HBCE-AD-TST-004 - Invalid Authority Profile

Expected result:

Authorization returns DENY_INVALID_AUTHORITY_PROFILE.

### HBCE-AD-TST-005 - Authority Profile not accepted

Expected result:

Authorization returns DENY_AUTHORITY_NOT_ACCEPTED.

### HBCE-AD-TST-006 - Action class not allowed

Expected result:

Authorization returns DENY_ACTION_CLASS_NOT_ALLOWED.

### HBCE-AD-TST-007 - Action class explicitly denied

Expected result:

Authorization returns DENY_ACTION_CLASS_EXPLICITLY_DENIED.

### HBCE-AD-TST-008 - Scope mismatch

Expected result:

Authorization returns DENY_SCOPE_MISMATCH.

### HBCE-AD-TST-009 - Constraint mismatch

Expected result:

Authorization returns DENY_CONSTRAINT_MISMATCH.

### HBCE-AD-TST-010 - Temporal mismatch

Expected result:

Authorization returns DENY_TEMPORAL_MISMATCH.

### HBCE-AD-TST-011 - Unknown policy

Expected result:

Authorization returns BLOCK_POLICY_UNKNOWN.

### HBCE-AD-TST-012 - Policy failed

Expected result:

Authorization returns DENY_POLICY_FAILED.

### HBCE-AD-TST-013 - Missing evidence

Expected result:

Authorization returns BLOCK_EVIDENCE_MISSING.

### HBCE-AD-TST-014 - Rejected evidence

Expected result:

Authorization returns BLOCK_EVIDENCE_REJECTED.

### HBCE-AD-TST-015 - Revoked evidence

Expected result:

Authorization returns BLOCK_EVIDENCE_REVOKED.

### HBCE-AD-TST-016 - Hash mismatch

Expected result:

Authorization returns BLOCK_HASH_MISMATCH.

### HBCE-AD-TST-017 - Missing audit

Expected result:

Authorization or decision remains NON_COMPLETED.

### HBCE-AD-TST-018 - Boundary flag violation

Expected result:

Authorization and decision are BLOCKED.

### HBCE-AD-TST-019 - Human acceptance pending

Expected result:

Authorization and decision remain NON_COMPLETED for Release Candidate completion.

### HBCE-AD-TST-020 - Authorization denied drives decision deny

Expected result:

Decision returns DECISION_DENY_AUTHORIZATION_FAILED and NOT_ELIGIBLE.

### HBCE-AD-TST-021 - Authorization blocked drives decision block

Expected result:

Decision returns block state and execution eligibility BLOCKED.

### HBCE-AD-TST-022 - Authorization non-completed drives decision non-completed

Expected result:

Decision returns DECISION_NON_COMPLETED.

### HBCE-AD-TST-023 - Allow with limitations preserves limitations

Expected result:

Authorization and decision preserve limitation_scope.

### HBCE-AD-TST-024 - Authorization does not execute

Expected result:

Authorization PASS produces no execution artifact.

### HBCE-AD-TST-025 - Decision does not execute

Expected result:

Decision PASS produces execution eligibility only, not execution.

### HBCE-AD-TST-026 - Decision does not update MATRIX

Expected result:

Decision PASS produces no MATRIX consequence.

## 44. Required evidence artifacts

The following evidence artifacts must be produced or planned:

- HBCE-EVD-AD-001-VALID-BOUNDED-AUTHORIZATION
- HBCE-EVD-AD-002-VALID-BOUNDED-DECISION
- HBCE-EVD-AD-003-MISSING-AUTHORITY-PROFILE
- HBCE-EVD-AD-004-INVALID-AUTHORITY-PROFILE
- HBCE-EVD-AD-005-AUTHORITY-PROFILE-NOT-ACCEPTED
- HBCE-EVD-AD-006-ACTION-CLASS-NOT-ALLOWED
- HBCE-EVD-AD-007-ACTION-CLASS-EXPLICITLY-DENIED
- HBCE-EVD-AD-008-SCOPE-MISMATCH
- HBCE-EVD-AD-009-CONSTRAINT-MISMATCH
- HBCE-EVD-AD-010-TEMPORAL-MISMATCH
- HBCE-EVD-AD-011-POLICY-UNKNOWN
- HBCE-EVD-AD-012-POLICY-FAILED
- HBCE-EVD-AD-013-MISSING-EVIDENCE
- HBCE-EVD-AD-014-REJECTED-EVIDENCE
- HBCE-EVD-AD-015-REVOKED-EVIDENCE
- HBCE-EVD-AD-016-HASH-MISMATCH
- HBCE-EVD-AD-017-MISSING-AUDIT
- HBCE-EVD-AD-018-BOUNDARY-FLAG-VIOLATION
- HBCE-EVD-AD-019-HUMAN-ACCEPTANCE-PENDING
- HBCE-EVD-AD-020-AUTHORIZATION-DENIED-DECISION-DENY
- HBCE-EVD-AD-021-AUTHORIZATION-BLOCKED-DECISION-BLOCK
- HBCE-EVD-AD-022-AUTHORIZATION-NON-COMPLETED-DECISION-NON-COMPLETED
- HBCE-EVD-AD-023-LIMITATION-SCOPE-PRESERVED
- HBCE-EVD-AD-024-AUTHORIZATION-DOES-NOT-EXECUTE
- HBCE-EVD-AD-025-DECISION-DOES-NOT-EXECUTE
- HBCE-EVD-AD-026-DECISION-DOES-NOT-UPDATE-MATRIX

Evidence artifacts must be compatible with P004.

Evidence artifacts must comply with the Canonical Evidence Model.

Evidence artifacts must include hash references.

Evidence artifacts must include audit references.

Evidence artifacts must include boundary flags.

Evidence artifacts must include lifecycle state.

## 45. Golden Demo authorization and decision obligations

Golden Demo must demonstrate:

- valid bounded authorization
- valid bounded decision
- missing Authority Profile denial
- invalid Authority Profile denial
- action class not allowed denial
- explicit denied action class denial
- scope mismatch denial
- constraint mismatch denial
- unknown policy block
- policy failure denial
- missing evidence block
- rejected evidence block
- revoked evidence block
- hash mismatch block
- boundary violation block
- human acceptance pending non-completion
- allow with limitations preservation
- authorization does not execute
- decision does not execute
- decision does not update MATRIX

Golden Demo must preserve:

- Authority Profile boundary
- Canonical Evidence Model boundary
- P004 evidence governance boundary
- Execution Boundary separation
- MATRIX consequence separation

## 46. Completion rule

The Authorization Decision Contract remains PREPARED_FOR_REVIEW until:

- human review is completed
- requirement matrix references are confirmed
- Authority Profile relationship is confirmed
- Canonical Evidence Model relationship is confirmed
- Business Wallet Adapter relationship is confirmed
- Execution Boundary relationship is confirmed
- MATRIX relationship is confirmed
- tests are derived
- evidence artifacts are planned
- API contract alignment is prepared
- Golden Demo alignment is prepared
- human acceptance is recorded

A future implementation is complete only when:

- implementation exists
- positive authorization tests PASS
- negative authorization tests PASS
- positive decision tests PASS
- negative decision tests PASS
- policy fail-closed tests PASS
- evidence support tests PASS
- boundary tests PASS
- execution separation tests PASS
- MATRIX separation tests PASS
- evidence artifacts exist
- evidence hashes exist
- audit references exist
- documentation is updated
- integration is verified
- human acceptance is ACCEPTED

Until then:

NON_COMPLETED

## 47. Immediate next derivations

This document requires the following future derivations:

1. Authorization JSON schema
2. Decision JSON schema
3. Authorization evaluation tests
4. Decision evaluation tests
5. Policy fail-closed fixtures
6. Evidence support fixtures
7. Action class fixtures
8. Scope mismatch fixtures
9. Constraint mismatch fixtures
10. Decision-to-execution eligibility fixtures
11. /authorization API contract section
12. /decision API contract section
13. Golden Demo authorization and decision scenario

Recommended next repository document:

HBCE_EXECUTION_BOUNDARY_CONTRACT.md

Reason:

After authorization and decision, the next missing program-level boundary is execution separation: a decision may create execution eligibility, but execution must remain a separate controlled, evidence-producing boundary.

## 48. Operational meaning

This document defines how HBCE turns bounded authority into authorization and decision.

It prevents Authority Profile from being treated as authorization.

It prevents authorization from being treated as execution.

It prevents decision from being treated as execution.

It prevents decision from being treated as MATRIX consequence.

It requires policy evaluation.

It requires canonical evidence.

It requires audit binding.

It requires boundary flags.

It preserves negative outcomes.

It preserves limitation scope.

It creates execution eligibility only as a downstream input.

It preserves P004 as the evidence governance baseline.

It preserves the V3 contract as the program-level contract.

It preserves the 2027 matrix as the requirement-to-test-to-evidence control layer.

It preserves the Authority Profile Contract as the authority evaluation boundary.

It preserves the Business Wallet Adapter Contract as the external material ingestion boundary.

It preserves the Canonical Evidence Model Contract as the cross-component evidence structure.

It does not implement runtime behavior.

It does not execute.

It does not update MATRIX.

It does not authorize production deployment.

It does not authorize deployment readiness.

It does not authorize L3 readiness.

It does not authorize PostgreSQL runtime readiness or execution.

It does not authorize P04/P05 concurrency execution.

It does not authorize OPC ALLOW.

It does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 49. Document state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
