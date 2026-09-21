# HBCE EXECUTION BOUNDARY CONTRACT

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Execution Boundary Contract
Version: 1.0 Candidate
Target release: 2027-01-19
Baseline main: 4dbbf37 docs(main): record post HBCE authorization decision checkpoint
Parent contract: HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
Parent matrix: HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
Authority boundary: HBCE_AUTHORITY_PROFILE_CONTRACT.md
Adapter boundary: HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
Evidence model: HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
Authorization decision boundary: HBCE_AUTHORIZATION_DECISION_CONTRACT.md
Runtime schema baseline: P004_RUNTIME_EVIDENCE_SCHEMA.md
Acceptance gate baseline: P004_EVIDENCE_ACCEPTANCE_GATE.md
Human acceptance required: true

## 1. Purpose

This document defines the HBCE Execution Boundary Contract.

The Execution Boundary Contract defines how HBCE separates decision eligibility from actual execution.

A decision may create execution eligibility.

Execution eligibility is not execution.

Execution requires a separate execution request.

Execution requires a valid decision reference.

Execution requires decision evidence.

Execution requires policy and constraint checks.

Execution requires canonical execution evidence.

Execution requires audit binding.

Execution produces evidence.

Execution may produce observed result.

Execution may produce blocked result.

Execution may produce denied result.

Execution may produce non-completed result.

Execution does not update MATRIX directly.

Execution does not create legal certification.

Execution does not authorize production deployment.

Execution does not authorize OPC ALLOW.

This contract is documentary and technical.

This contract does not implement runtime behavior.

## 2. Position in the HBCE chain

The canonical HBCE chain is:

Identity -> Mandate -> Authority -> Authorization -> Decision -> Execution -> Evidence -> Consequence -> MATRIX

This contract governs the following segment:

Decision -> Execution -> Evidence

The upstream inputs are:

- decision reference
- decision result
- execution eligibility state
- action reference
- action hash
- action class
- limitation scope
- policy evaluation references
- canonical evidence references
- execution request
- execution constraints
- execution boundary flags
- audit context

The downstream outputs are:

- execution record
- execution result
- execution evidence
- blocked execution evidence
- denied execution evidence
- failed execution evidence
- non-completed execution evidence
- observed output reference
- audit reference
- consequence candidate reference

The contract does not govern MATRIX consequence creation.

The contract does not govern production deployment.

The contract does not grant external legal authority.

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
- HBCE-REQ-790 - /execution API contract
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

### Execution Boundary

Execution Boundary is the HBCE boundary that evaluates whether a decision result may be converted into a controlled execution attempt.

Execution Boundary is not Authorization.

Execution Boundary is not Decision.

Execution Boundary is not MATRIX.

Execution Boundary must produce evidence.

### Execution request

Execution request is the bounded request to perform an action after a decision has created execution eligibility.

Execution request must reference a decision.

Execution request must reference an action.

Execution request must be hash-bound or reference-bound.

Execution request must preserve limitation scope.

Execution request must not bypass decision.

### Execution eligibility

Execution eligibility is the documentary state produced by the decision layer that says execution may be considered.

Execution eligibility is not execution.

Execution eligibility does not bypass Execution Boundary.

Execution eligibility does not create MATRIX consequence.

Execution eligibility does not create production deployment permission.

### Execution attempt

Execution attempt is the controlled attempt to perform an action under Execution Boundary checks.

Execution attempt must be evidence-bound.

Execution attempt must be audit-bound.

Execution attempt must preserve result status.

Execution attempt must not erase failures.

### Execution result

Execution result is the structured outcome of the execution boundary.

Allowed high-level outcomes are:

- EXECUTION_ALLOWED_DOCUMENTARY
- EXECUTION_ALLOWED_WITH_LIMITATIONS
- EXECUTION_DENIED
- EXECUTION_BLOCKED
- EXECUTION_FAILED
- EXECUTION_NON_COMPLETED

Execution result must not update MATRIX by itself.

### Observed output

Observed output is the measured, returned, produced or recorded output of an execution attempt.

Observed output is not automatically consequence.

Observed output must be evidence-bound.

Observed output must be hash-bound when material.

### Execution evidence

Execution evidence is canonical evidence documenting execution request, checks, attempt, result, observed output and audit context.

Execution evidence must comply with the Canonical Evidence Model.

Execution evidence must preserve negative outcomes.

Execution evidence must preserve limitations.

### Consequence candidate

Consequence candidate is a downstream reference that may be used by a future consequence or MATRIX layer.

Consequence candidate is not MATRIX update.

Consequence candidate requires accepted canonical execution evidence.

### Execution denial

Execution denial means Execution Boundary determined execution must not proceed.

Denial must produce evidence.

Denial must be auditable.

Denial must preserve reason codes.

### Execution block

Execution block means Execution Boundary cannot proceed because a mandatory condition failed, is unknown, is unsupported, or violates a boundary.

Block must produce evidence.

Block must be auditable.

Block must preserve reason codes.

### Execution failure

Execution failure means an execution attempt was allowed but did not complete as expected.

Failure must produce evidence.

Failure must preserve observed output when available.

Failure must not be erased.

Failure must not be converted into success.

### Non-completed execution

Non-completed execution means mandatory execution information, evidence, hash, audit, policy or human acceptance state is missing.

Non-completed execution cannot support MATRIX consequence.

## 6. Non-equivalence rules

The following equivalence shortcuts are forbidden:

Decision = Execution

Decision PASS = Execution

Decision PASS = MATRIX Update

Execution Eligibility = Execution

Execution Eligibility = Production Readiness

Execution Eligibility = OPC ALLOW

Authorization PASS = Execution

Authority Profile PASS = Execution

Policy PASS = Execution

Evidence Acceptance = Execution

Execution Request = Execution

Execution Attempt = Successful Execution

Execution Result = MATRIX Consequence

Execution Evidence = MATRIX Consequence

Execution Evidence = Legal Certification

Observed Output = MATRIX Consequence

Observed Output = Truth

Observed Output = Legal Certification

Audit = Execution Approval

Hash = Execution Approval

Human Acceptance = Execution Approval

Execution Allowed = Production Deployment

Execution Allowed = L3 Readiness

Execution Allowed = OPC ALLOW

Execution Allowed = Legal Certification

Execution Allowed = eIDAS Qualification

Execution Allowed = Regulated KYC or AML Provider Status

## 7. Execution Boundary responsibilities

The Execution Boundary is responsible for:

- receiving execution requests
- binding decision references
- verifying decision result
- verifying execution eligibility state
- verifying action reference
- verifying action hash
- verifying action class
- verifying limitation scope
- verifying policy evaluation references
- verifying canonical evidence references
- verifying execution constraints
- verifying temporal context
- verifying boundary flags
- verifying audit context
- classifying execution allow, deny, block, failure or non-completion
- producing execution evidence
- preserving observed output
- preserving negative outcomes
- preserving limitations
- producing audit reference
- failing closed on unknown mandatory states

The Execution Boundary is not responsible for:

- creating Authority Profile
- creating Authorization
- creating Decision
- bypassing policy
- bypassing evidence
- updating MATRIX
- certifying legal validity
- declaring production readiness
- declaring OPC ALLOW

## 8. Canonical execution fields

Every execution record must include:

- execution_id
- execution_version
- execution_status
- execution_result
- execution_request_id
- decision_ref
- decision_result
- execution_eligibility_state
- subject_ref
- organization_ref
- authority_profile_ref
- authorization_ref
- action_ref
- action_hash
- action_class
- requested_execution_scope
- evaluated_execution_scope
- limitation_scope
- execution_constraint_context_ref
- policy_evaluation_refs
- evidence_refs
- decision_evidence_ref
- execution_evidence_ref
- evidence_support_state
- execution_attempt_ref
- observed_output_ref
- observed_output_hash
- denied_reason
- blocked_reason
- failure_reason
- non_completed_reason
- consequence_candidate_ref
- execution_hash
- audit_ref
- created_at
- updated_at
- evaluated_at
- attempted_at
- completed_at
- human_acceptance_state
- boundary_flags

No execution record is valid without:

- execution_id
- execution_version
- execution_status
- execution_result
- execution_request_id
- decision_ref
- decision_result
- execution_eligibility_state
- action_ref
- action_hash
- action_class
- policy_evaluation_refs
- evidence_refs
- decision_evidence_ref
- execution_evidence_ref
- execution_hash
- audit_ref
- human_acceptance_state
- boundary_flags

## 9. Execution status values

Allowed execution_status values:

- DRAFT
- RECEIVED
- EVALUATING
- ELIGIBLE_CHECKED
- ATTEMPT_READY
- ATTEMPTED
- COMPLETED_DOCUMENTARY
- COMPLETED_WITH_LIMITATIONS
- DENIED
- BLOCKED
- FAILED
- NON_COMPLETED
- ARCHIVED
- REVOKED

Default execution_status:

DRAFT

No execution_status updates MATRIX by itself.

No execution_status authorizes production deployment.

No execution_status authorizes OPC ALLOW.

## 10. Execution result values

Allowed execution_result values:

- NOT_EVALUATED
- EXECUTION_ALLOWED_DOCUMENTARY
- EXECUTION_ALLOWED_WITH_LIMITATIONS
- EXECUTION_DENY_DECISION_MISSING
- EXECUTION_DENY_DECISION_NOT_ALLOWED
- EXECUTION_DENY_ELIGIBILITY_MISSING
- EXECUTION_DENY_ELIGIBILITY_NOT_VALID
- EXECUTION_DENY_SCOPE_MISMATCH
- EXECUTION_DENY_CONSTRAINT_MISMATCH
- EXECUTION_DENY_TEMPORAL_MISMATCH
- EXECUTION_DENY_POLICY_FAILED
- EXECUTION_DENY_EVIDENCE_UNSUPPORTED
- EXECUTION_BLOCK_POLICY_UNKNOWN
- EXECUTION_BLOCK_EVIDENCE_MISSING
- EXECUTION_BLOCK_EVIDENCE_REJECTED
- EXECUTION_BLOCK_EVIDENCE_REVOKED
- EXECUTION_BLOCK_HASH_MISMATCH
- EXECUTION_BLOCK_AUDIT_MISSING
- EXECUTION_BLOCK_BOUNDARY_VIOLATION
- EXECUTION_FAILED_ATTEMPT
- EXECUTION_NON_COMPLETED

Default execution_result:

NOT_EVALUATED

Unknown execution state fails closed.

Unknown decision state fails closed.

Unknown evidence state fails closed.

Unknown policy state fails closed.

## 11. Execution eligibility input values

Execution Boundary may consume the following execution_eligibility_state values from decision records:

- ELIGIBLE_DOCUMENTARY
- ELIGIBLE_WITH_LIMITATIONS
- NOT_ELIGIBLE
- BLOCKED
- DENIED
- NON_COMPLETED

Only ELIGIBLE_DOCUMENTARY can support unqualified execution consideration.

ELIGIBLE_WITH_LIMITATIONS can support only bounded execution consideration.

NOT_ELIGIBLE denies execution.

BLOCKED blocks execution.

DENIED denies execution.

NON_COMPLETED prevents execution.

## 12. Execution evidence support states

Allowed execution evidence support states:

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

Only SUPPORTED_BY_ACCEPTED_EVIDENCE can support unqualified execution.

SUPPORTED_WITH_LIMITATIONS can support only bounded execution.

Every unsupported state denies, blocks or marks non-completion.

UNKNOWN fails closed.

## 13. Mandatory boundary flags inside execution records

Every execution record must include:

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

If any boundary flag is missing, the execution record is NON_COMPLETED.

If any boundary flag is true, the execution record is BLOCKED unless a future explicit contract permits it.

No such permission exists in this contract.

## 14. Human acceptance states

Allowed human_acceptance_state values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Default human_acceptance_state:

PENDING

Execution records with human_acceptance_state PENDING remain NON_COMPLETED for Release Candidate completion.

Human acceptance cannot override:

- missing decision
- invalid decision
- missing execution eligibility
- denied decision
- blocked decision
- non-completed decision
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

## 15. Minimum execution schema

The minimum execution structure is:

execution_id:
  type: string
  required: true

execution_version:
  type: string
  required: true

execution_status:
  type: enum
  required: true

execution_result:
  type: enum
  required: true

execution_request_id:
  type: string
  required: true

decision_ref:
  type: string
  required: true

decision_result:
  type: enum
  required: true

execution_eligibility_state:
  type: enum
  required: true

subject_ref:
  type: string
  required: false

organization_ref:
  type: string
  required: false

authority_profile_ref:
  type: string
  required: false

authorization_ref:
  type: string
  required: false

action_ref:
  type: string
  required: true

action_hash:
  type: string
  required: true

action_class:
  type: string
  required: true

requested_execution_scope:
  type: object
  required: true

evaluated_execution_scope:
  type: object
  required: false

limitation_scope:
  type: object
  required: false

execution_constraint_context_ref:
  type: string
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

execution_evidence_ref:
  type: string
  required: true

evidence_support_state:
  type: enum
  required: true

execution_attempt_ref:
  type: string
  required: false

observed_output_ref:
  type: string
  required: false

observed_output_hash:
  type: string
  required: false

denied_reason:
  type: string
  required: false

blocked_reason:
  type: string
  required: false

failure_reason:
  type: string
  required: false

non_completed_reason:
  type: string
  required: false

consequence_candidate_ref:
  type: string
  required: false

execution_hash:
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

attempted_at:
  type: string
  required: false

completed_at:
  type: string
  required: false

human_acceptance_state:
  type: enum
  required: true

boundary_flags:
  type: object
  required: true

## 16. Execution evaluation prerequisites

Execution evaluation requires:

- execution request id
- decision reference
- decision result
- execution eligibility state
- action reference
- action hash
- action class
- requested execution scope
- policy evaluation references
- canonical evidence references
- decision evidence reference
- execution evidence reference or evidence creation context
- evidence support state
- audit reference
- boundary flags
- human acceptance state

If any mandatory prerequisite is missing, result is EXECUTION_NON_COMPLETED.

If decision reference is missing, result is EXECUTION_DENY_DECISION_MISSING.

If decision result is not allowed, result is EXECUTION_DENY_DECISION_NOT_ALLOWED.

If execution eligibility is missing, result is EXECUTION_DENY_ELIGIBILITY_MISSING.

If execution eligibility is not valid, result is EXECUTION_DENY_ELIGIBILITY_NOT_VALID.

If policy state is unknown, result is EXECUTION_BLOCK_POLICY_UNKNOWN.

If evidence is missing, result is EXECUTION_BLOCK_EVIDENCE_MISSING.

If boundary flag is violated, result is EXECUTION_BLOCK_BOUNDARY_VIOLATION.

## 17. Execution evaluation algorithm

Execution evaluation must follow this order:

1. Receive execution request.
2. Assign execution_id.
3. Verify execution_request_id.
4. Verify decision_ref.
5. Load decision result.
6. Verify decision_result.
7. Verify execution_eligibility_state.
8. Verify action_ref.
9. Verify action_hash.
10. Verify action_class.
11. Verify requested_execution_scope.
12. Verify limitation_scope when decision is limited.
13. Evaluate execution constraints.
14. Evaluate temporal context.
15. Load policy_evaluation_refs.
16. Fail closed on unknown policy state.
17. Load canonical evidence refs.
18. Verify decision_evidence_ref.
19. Prepare or bind execution_evidence_ref.
20. Evaluate evidence_support_state.
21. Fail closed on missing, rejected, revoked, blocked or non-completed evidence.
22. Verify boundary flags.
23. Verify audit_ref.
24. Compute execution_hash.
25. Classify execution_result.
26. Create execution evidence.
27. If allowed, create execution_attempt_ref.
28. Preserve observed_output_ref when available.
29. Preserve observed_output_hash when available.
30. Produce audit update.
31. Preserve human_acceptance_state.
32. Produce consequence_candidate_ref only when eligible and evidence-bound.

No step may be skipped silently.

Unknown mandatory state fails closed.

Missing mandatory field produces EXECUTION_NON_COMPLETED.

Boundary violation produces EXECUTION_BLOCK_BOUNDARY_VIOLATION.

## 18. Positive execution path

A positive execution path requires:

- decision result DECISION_ALLOW or DECISION_ALLOW_WITH_LIMITATIONS
- execution eligibility ELIGIBLE_DOCUMENTARY or ELIGIBLE_WITH_LIMITATIONS
- action hash valid
- action class consistent
- requested execution scope within decision scope
- constraints satisfied
- temporal context satisfied
- policy evaluation PASS
- canonical evidence accepted or accepted with limitations
- decision evidence valid
- execution evidence prepared
- evidence support state valid
- execution hash valid
- audit reference present
- boundary flags false
- human acceptance state recorded

Positive execution may produce:

EXECUTION_ALLOWED_DOCUMENTARY

or:

EXECUTION_ALLOWED_WITH_LIMITATIONS

Positive execution must produce execution evidence.

Positive execution may produce observed output.

Positive execution may produce consequence candidate.

Positive execution does not update MATRIX directly.

Positive execution does not authorize production deployment.

## 19. Negative execution paths

The following negative execution paths must be supported:

- missing execution request id
- missing decision reference
- invalid decision reference
- decision denied
- decision blocked
- decision non-completed
- missing execution eligibility
- execution eligibility denied
- execution eligibility blocked
- execution eligibility non-completed
- missing action reference
- missing action hash
- action hash mismatch
- action class mismatch
- requested scope mismatch
- limitation scope violation
- constraint mismatch
- temporal mismatch
- missing policy reference
- unknown policy
- policy failure
- missing evidence
- rejected evidence
- revoked evidence
- blocked evidence
- non-completed evidence
- missing decision evidence
- missing execution evidence
- missing audit reference
- boundary flag violation
- human acceptance pending
- execution attempt failure
- observed output hash mismatch

Each negative path must produce execution evidence when possible.

Each negative path must be auditable.

Each negative path must not produce MATRIX consequence.

Each negative path must not authorize production deployment.

## 20. Execution attempt rules

Execution attempt may occur only after Execution Boundary checks pass.

Execution attempt must bind:

- execution_id
- decision_ref
- action_ref
- action_hash
- execution_result
- execution_evidence_ref
- audit_ref
- boundary_flags

Execution attempt must not occur when:

- decision is denied
- decision is blocked
- decision is non-completed
- execution eligibility is not valid
- policy is unknown
- policy failed
- evidence is missing
- evidence is rejected
- evidence is revoked
- evidence is blocked
- evidence is non-completed
- audit is missing
- boundary flag is violated

Execution attempt failure must remain evidence-bound.

Execution attempt failure must not be converted into success.

## 21. Observed output rules

Observed output must be recorded when available.

Observed output must be hash-bound when material.

Observed output must be associated with execution evidence.

Observed output must not be treated as MATRIX consequence.

Observed output must not be treated as legal certification.

Observed output must not erase execution failure.

Observed output must preserve limitations.

Missing observed output may be valid for denied or blocked execution.

Missing observed output after attempted execution must be explained.

## 22. Evidence relationship

Execution must produce or reference canonical evidence.

Execution evidence must comply with:

HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md

Execution evidence must include:

- execution_id
- execution_result
- decision_ref
- action_ref
- action_hash
- policy_evaluation_refs
- evidence_refs
- decision_evidence_ref
- execution_evidence_ref
- execution_hash
- audit_ref
- boundary_flags
- observed_output_ref when available
- observed_output_hash when available
- failure_reason when failed
- blocked_reason when blocked
- denied_reason when denied

Rejected evidence cannot support execution.

Revoked evidence cannot support execution.

Blocked evidence cannot support execution.

Non-completed evidence cannot support execution.

Accepted-with-limitations evidence can support only within limitation scope.

## 23. Audit relationship

Execution must be audit-bound.

Execution audit must preserve:

- execution request id
- decision reference
- decision result
- execution eligibility state
- action reference
- action hash
- action class
- requested execution scope
- evaluated execution scope
- limitation scope
- policy evaluation refs
- evidence refs
- decision evidence ref
- execution evidence ref
- execution result
- observed output ref
- observed output hash
- reason codes
- boundary flags
- human acceptance state

Missing audit produces EXECUTION_NON_COMPLETED.

Audit does not imply execution approval.

Audit does not imply success.

Audit does not imply MATRIX consequence.

## 24. Authorization Decision relationship

Execution must consume decision records from:

HBCE_AUTHORIZATION_DECISION_CONTRACT.md

Execution must not create authorization.

Execution must not create decision.

Execution must verify:

- decision result
- execution eligibility state
- decision evidence
- decision hash when available
- limitation scope
- boundary flags
- audit reference

Decision PASS does not automatically execute.

Execution eligibility does not automatically execute.

## 25. Authority Profile relationship

Execution must preserve Authority Profile references when supplied by decision records.

Execution must not create Authority Profile.

Execution must not expand Authority Profile scope.

Execution must not override denied action classes.

Execution must not bypass authority constraints.

Execution must remain downstream of authorization and decision.

## 26. Business Wallet Adapter relationship

Business Wallet Adapter output cannot execute an action.

Business Wallet Adapter PASS is not execution.

Business Wallet Adapter ROUTED is not execution.

Wallet-like input cannot execute.

External credential-like input cannot execute.

Adapter evidence may support execution only if accepted through the Canonical Evidence Model and decision chain.

## 27. MATRIX relationship

Execution does not update MATRIX directly.

Execution may produce a consequence candidate.

MATRIX consequence requires a future consequence boundary.

MATRIX consequence requires:

- accepted execution evidence
- consequence candidate
- source evidence references
- audit reference
- limitation preservation
- boundary flags

Rejected, blocked, revoked or non-completed execution evidence cannot support MATRIX consequence.

Failed execution evidence may support negative consequence only if future consequence contract permits it.

This contract does not implement MATRIX consequence.

## 28. /execution API minimum contract

The /execution API family must support the following conceptual operations:

- create execution request
- evaluate execution request
- retrieve execution record
- retrieve execution evidence
- retrieve execution audit
- classify execution result
- classify consequence candidate state
- deny execution
- block execution
- record execution failure
- record observed output
- archive execution
- revoke execution documentary record when applicable

This document does not implement the API.

This document defines minimum API obligations for future implementation.

## 29. /execution request minimum fields

An /execution request must include:

- request_id
- decision_ref
- decision_result
- execution_eligibility_state
- action_ref
- action_hash
- action_class
- requested_execution_scope
- policy_evaluation_refs
- evidence_refs
- decision_evidence_ref
- execution_evidence_ref or evidence creation context
- boundary_flags
- human_acceptance_state

Missing request_id blocks the request.

Missing decision_ref blocks the request.

Missing decision_result blocks the request.

Missing execution_eligibility_state blocks the request.

Missing action_ref blocks the request.

Missing action_hash blocks the request.

Missing action_class blocks the request.

Missing policy_evaluation_refs blocks the request.

Missing evidence_refs blocks the request.

Missing decision_evidence_ref blocks the request.

Missing boundary_flags blocks the request.

## 30. /execution response minimum fields

An /execution response must include:

- request_id
- execution_id
- execution_status
- execution_result
- decision_ref
- decision_result
- execution_eligibility_state
- action_ref
- action_hash
- action_class
- evidence_refs
- decision_evidence_ref
- execution_evidence_ref
- execution_hash
- audit_ref
- observed_output_ref when available
- observed_output_hash when available
- consequence_candidate_ref when produced
- human_acceptance_state
- boundary_flags

A response without execution_result is invalid.

A response without execution_hash is NON_COMPLETED.

A response without execution_evidence_ref is NON_COMPLETED.

A response with consequence_candidate_ref does not update MATRIX.

## 31. Error model

Allowed Execution Boundary error classes:

- EB_REQUEST_INVALID
- EB_EXECUTION_REQUEST_ID_MISSING
- EB_DECISION_REF_MISSING
- EB_DECISION_REF_INVALID
- EB_DECISION_DENIED
- EB_DECISION_BLOCKED
- EB_DECISION_NON_COMPLETED
- EB_ELIGIBILITY_MISSING
- EB_ELIGIBILITY_INVALID
- EB_ACTION_REF_MISSING
- EB_ACTION_HASH_MISSING
- EB_ACTION_HASH_MISMATCH
- EB_ACTION_CLASS_MISSING
- EB_ACTION_CLASS_MISMATCH
- EB_SCOPE_MISMATCH
- EB_LIMITATION_SCOPE_VIOLATION
- EB_CONSTRAINT_MISMATCH
- EB_TEMPORAL_MISMATCH
- EB_POLICY_REF_MISSING
- EB_POLICY_UNKNOWN
- EB_POLICY_FAILED
- EB_EVIDENCE_MISSING
- EB_EVIDENCE_REJECTED
- EB_EVIDENCE_REVOKED
- EB_EVIDENCE_BLOCKED
- EB_EVIDENCE_NON_COMPLETED
- EB_DECISION_EVIDENCE_MISSING
- EB_EXECUTION_EVIDENCE_MISSING
- EB_EXECUTION_HASH_MISMATCH
- EB_AUDIT_REF_MISSING
- EB_BOUNDARY_FLAGS_MISSING
- EB_BOUNDARY_BLOCKED
- EB_HUMAN_ACCEPTANCE_PENDING
- EB_EXECUTION_ATTEMPT_FAILED
- EB_OBSERVED_OUTPUT_HASH_MISMATCH
- EB_NON_COMPLETED

Error responses must be evidence-linked when possible.

Error responses must be auditable.

Error responses must not create MATRIX consequence.

Error responses must not authorize production deployment.

## 32. Required tests

### HBCE-EB-TST-001 - Valid bounded execution

Expected result:

A valid decision, valid execution eligibility, passing policy, accepted evidence and valid boundary flags produce EXECUTION_ALLOWED_DOCUMENTARY.

### HBCE-EB-TST-002 - Valid bounded execution with limitations

Expected result:

A limited decision produces EXECUTION_ALLOWED_WITH_LIMITATIONS and preserves limitation_scope.

### HBCE-EB-TST-003 - Missing decision reference

Expected result:

Execution returns EXECUTION_DENY_DECISION_MISSING or EXECUTION_NON_COMPLETED.

### HBCE-EB-TST-004 - Decision denied

Expected result:

Execution returns EXECUTION_DENY_DECISION_NOT_ALLOWED.

### HBCE-EB-TST-005 - Decision blocked

Expected result:

Execution is blocked or non-completed.

### HBCE-EB-TST-006 - Decision non-completed

Expected result:

Execution returns EXECUTION_NON_COMPLETED.

### HBCE-EB-TST-007 - Missing execution eligibility

Expected result:

Execution returns EXECUTION_DENY_ELIGIBILITY_MISSING.

### HBCE-EB-TST-008 - Invalid execution eligibility

Expected result:

Execution returns EXECUTION_DENY_ELIGIBILITY_NOT_VALID.

### HBCE-EB-TST-009 - Missing action hash

Expected result:

Execution returns EXECUTION_NON_COMPLETED.

### HBCE-EB-TST-010 - Action hash mismatch

Expected result:

Execution returns EXECUTION_BLOCK_HASH_MISMATCH.

### HBCE-EB-TST-011 - Scope mismatch

Expected result:

Execution returns EXECUTION_DENY_SCOPE_MISMATCH.

### HBCE-EB-TST-012 - Limitation scope violation

Expected result:

Execution denies or blocks.

### HBCE-EB-TST-013 - Constraint mismatch

Expected result:

Execution returns EXECUTION_DENY_CONSTRAINT_MISMATCH.

### HBCE-EB-TST-014 - Unknown policy

Expected result:

Execution returns EXECUTION_BLOCK_POLICY_UNKNOWN.

### HBCE-EB-TST-015 - Policy failed

Expected result:

Execution returns EXECUTION_DENY_POLICY_FAILED.

### HBCE-EB-TST-016 - Missing evidence

Expected result:

Execution returns EXECUTION_BLOCK_EVIDENCE_MISSING.

### HBCE-EB-TST-017 - Rejected evidence

Expected result:

Execution returns EXECUTION_BLOCK_EVIDENCE_REJECTED.

### HBCE-EB-TST-018 - Revoked evidence

Expected result:

Execution returns EXECUTION_BLOCK_EVIDENCE_REVOKED.

### HBCE-EB-TST-019 - Missing audit

Expected result:

Execution remains EXECUTION_NON_COMPLETED.

### HBCE-EB-TST-020 - Boundary flag violation

Expected result:

Execution returns EXECUTION_BLOCK_BOUNDARY_VIOLATION.

### HBCE-EB-TST-021 - Human acceptance pending

Expected result:

Execution remains EXECUTION_NON_COMPLETED for Release Candidate completion.

### HBCE-EB-TST-022 - Execution attempt failure

Expected result:

Execution returns EXECUTION_FAILED_ATTEMPT and preserves failure evidence.

### HBCE-EB-TST-023 - Observed output hash mismatch

Expected result:

Execution blocks or records failure with evidence.

### HBCE-EB-TST-024 - Execution does not update MATRIX

Expected result:

Execution produces no MATRIX consequence.

### HBCE-EB-TST-025 - Consequence candidate is not MATRIX update

Expected result:

consequence_candidate_ref does not update MATRIX.

## 33. Required evidence artifacts

The following evidence artifacts must be produced or planned:

- HBCE-EVD-EB-001-VALID-BOUNDED-EXECUTION
- HBCE-EVD-EB-002-VALID-BOUNDED-EXECUTION-WITH-LIMITATIONS
- HBCE-EVD-EB-003-MISSING-DECISION-REFERENCE
- HBCE-EVD-EB-004-DECISION-DENIED
- HBCE-EVD-EB-005-DECISION-BLOCKED
- HBCE-EVD-EB-006-DECISION-NON-COMPLETED
- HBCE-EVD-EB-007-MISSING-EXECUTION-ELIGIBILITY
- HBCE-EVD-EB-008-INVALID-EXECUTION-ELIGIBILITY
- HBCE-EVD-EB-009-MISSING-ACTION-HASH
- HBCE-EVD-EB-010-ACTION-HASH-MISMATCH
- HBCE-EVD-EB-011-SCOPE-MISMATCH
- HBCE-EVD-EB-012-LIMITATION-SCOPE-VIOLATION
- HBCE-EVD-EB-013-CONSTRAINT-MISMATCH
- HBCE-EVD-EB-014-POLICY-UNKNOWN
- HBCE-EVD-EB-015-POLICY-FAILED
- HBCE-EVD-EB-016-MISSING-EVIDENCE
- HBCE-EVD-EB-017-REJECTED-EVIDENCE
- HBCE-EVD-EB-018-REVOKED-EVIDENCE
- HBCE-EVD-EB-019-MISSING-AUDIT
- HBCE-EVD-EB-020-BOUNDARY-FLAG-VIOLATION
- HBCE-EVD-EB-021-HUMAN-ACCEPTANCE-PENDING
- HBCE-EVD-EB-022-EXECUTION-ATTEMPT-FAILURE
- HBCE-EVD-EB-023-OBSERVED-OUTPUT-HASH-MISMATCH
- HBCE-EVD-EB-024-EXECUTION-DOES-NOT-UPDATE-MATRIX
- HBCE-EVD-EB-025-CONSEQUENCE-CANDIDATE-NOT-MATRIX-UPDATE

Evidence artifacts must be compatible with P004.

Evidence artifacts must comply with the Canonical Evidence Model.

Evidence artifacts must include hash references.

Evidence artifacts must include audit references.

Evidence artifacts must include boundary flags.

Evidence artifacts must include lifecycle state.

## 34. Golden Demo execution obligations

Golden Demo must demonstrate:

- valid bounded execution
- valid bounded execution with limitations
- missing decision reference block
- decision denied block
- decision blocked block
- decision non-completed block
- missing execution eligibility block
- invalid execution eligibility block
- missing action hash block
- action hash mismatch block
- scope mismatch denial
- limitation scope violation
- constraint mismatch denial
- unknown policy block
- policy failure denial
- missing evidence block
- rejected evidence block
- revoked evidence block
- missing audit non-completion
- boundary violation block
- human acceptance pending non-completion
- execution attempt failure preserved
- observed output hash mismatch
- execution does not update MATRIX
- consequence candidate is not MATRIX update

Golden Demo must preserve:

- Authorization Decision boundary
- Canonical Evidence Model boundary
- P004 evidence governance boundary
- Execution Boundary separation
- MATRIX consequence separation

## 35. Completion rule

The Execution Boundary Contract remains PREPARED_FOR_REVIEW until:

- human review is completed
- requirement matrix references are confirmed
- Authorization Decision relationship is confirmed
- Canonical Evidence Model relationship is confirmed
- P004 relationship is confirmed
- MATRIX relationship is confirmed
- tests are derived
- evidence artifacts are planned
- API contract alignment is prepared
- Golden Demo alignment is prepared
- human acceptance is recorded

A future implementation is complete only when:

- implementation exists
- positive execution tests PASS
- negative execution tests PASS
- evidence support tests PASS
- boundary tests PASS
- failure preservation tests PASS
- observed output hash tests PASS
- MATRIX separation tests PASS
- consequence candidate separation tests PASS
- evidence artifacts exist
- evidence hashes exist
- audit references exist
- documentation is updated
- integration is verified
- human acceptance is ACCEPTED

Until then:

NON_COMPLETED

## 36. Immediate next derivations

This document requires the following future derivations:

1. Execution JSON schema
2. Execution evaluation tests
3. Execution negative controls fixtures
4. Execution attempt failure fixtures
5. Observed output hash fixtures
6. Decision-to-execution eligibility fixtures
7. Execution evidence fixtures
8. Consequence candidate fixtures
9. /execution API contract section
10. Golden Demo execution scenario

Recommended next repository document:

HBCE_CONSEQUENCE_MATRIX_CONTRACT.md

Reason:

After Execution Boundary, the next missing program-level boundary is the consequence and MATRIX contract that determines how execution evidence can become a consequence without treating execution output as MATRIX update directly.

## 37. Operational meaning

This document defines how HBCE separates decision eligibility from execution.

It prevents decision from being treated as execution.

It prevents execution eligibility from being treated as execution.

It prevents execution from being treated as MATRIX consequence.

It requires canonical evidence.

It requires audit binding.

It requires boundary flags.

It preserves negative outcomes.

It preserves failed execution attempts.

It preserves observed output.

It preserves limitation scope.

It creates consequence candidate only as a downstream input.

It preserves P004 as the evidence governance baseline.

It preserves the V3 contract as the program-level contract.

It preserves the 2027 matrix as the requirement-to-test-to-evidence control layer.

It preserves the Authority Profile Contract as the authority evaluation boundary.

It preserves the Business Wallet Adapter Contract as the external material ingestion boundary.

It preserves the Canonical Evidence Model Contract as the cross-component evidence structure.

It preserves the Authorization Decision Contract as the authority-to-decision boundary.

It does not implement runtime behavior.

It does not update MATRIX.

It does not authorize production deployment.

It does not authorize deployment readiness.

It does not authorize L3 readiness.

It does not authorize PostgreSQL runtime readiness or execution.

It does not authorize P04/P05 concurrency execution.

It does not authorize OPC ALLOW.

It does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 38. Document state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
