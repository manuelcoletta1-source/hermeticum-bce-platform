# HBCE RELEASE CANDIDATE COMPLETION CONTRACT

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Release Candidate Completion Contract
Version: 1.0 Candidate
Target release: 2027-01-19
Baseline main: c9ad30e docs(main): record post HBCE consequence matrix checkpoint
Parent contract: HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
Parent matrix: HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
Authority boundary: HBCE_AUTHORITY_PROFILE_CONTRACT.md
Adapter boundary: HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
Evidence model: HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
Authorization decision boundary: HBCE_AUTHORIZATION_DECISION_CONTRACT.md
Execution boundary: HBCE_EXECUTION_BOUNDARY_CONTRACT.md
Consequence matrix boundary: HBCE_CONSEQUENCE_MATRIX_CONTRACT.md
Runtime schema baseline: P004_RUNTIME_EVIDENCE_SCHEMA.md
Acceptance gate baseline: P004_EVIDENCE_ACCEPTANCE_GATE.md
Human acceptance required: true

## 1. Purpose

This document defines the HBCE Release Candidate Completion Contract.

The Release Candidate Completion Contract defines when an HBCE Release Candidate may be marked complete at documentary, test, evidence and audit level.

Release Candidate completion is not production deployment.

Release Candidate completion is not production readiness.

Release Candidate completion is not deployment readiness.

Release Candidate completion is not L3 readiness.

Release Candidate completion is not OPC ALLOW.

Release Candidate completion is not legal certification.

Release Candidate completion is not eIDAS qualification.

Release Candidate completion is not regulated KYC or AML provider status.

Release Candidate completion requires requirement coverage.

Release Candidate completion requires test coverage.

Release Candidate completion requires evidence coverage.

Release Candidate completion requires audit references.

Release Candidate completion requires boundary preservation.

Release Candidate completion requires human acceptance.

Release Candidate completion requires fail-closed handling for incomplete, unknown, rejected or blocked states.

This contract is documentary and technical.

This contract does not implement runtime behavior.

## 2. Position in the HBCE chain

The canonical HBCE chain is:

Identity -> Mandate -> Authority -> Authorization -> Decision -> Execution -> Evidence -> Consequence -> MATRIX -> Release Candidate Completion

This contract governs the following segment:

Requirement -> Test -> Evidence -> Audit -> Human Acceptance -> Release Candidate Completion

The upstream inputs are:

- program contract reference
- requirement matrix reference
- authority profile contract reference
- business wallet adapter contract reference
- canonical evidence model contract reference
- authorization decision contract reference
- execution boundary contract reference
- consequence matrix contract reference
- P004 runtime evidence schema reference
- P004 evidence acceptance gate reference
- requirement coverage records
- test coverage records
- evidence coverage records
- audit reference records
- boundary preservation records
- Golden Demo records
- negative control records
- human acceptance record

The downstream outputs are:

- release candidate completion record
- release candidate evidence summary
- release candidate audit summary
- release candidate gap register
- release candidate non-completion record
- release candidate human acceptance state
- release candidate lifecycle state

This contract does not deploy.

This contract does not execute production operations.

This contract does not mutate external legal, identity, banking, trust-list, public-register or regulated systems.

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
- HBCE-REQ-800 - /matrix API contract
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

### Release Candidate

Release Candidate is a documentary program state showing that a defined set of requirements, tests, evidence artifacts, audit references and acceptance records has been assembled for review.

Release Candidate is not production.

Release Candidate is not deployment.

Release Candidate is not legal certification.

Release Candidate is not OPC ALLOW.

### Release Candidate completion

Release Candidate completion is the controlled state in which the repository can document that required contracts, requirements, tests, evidence, audit references, boundary flags and human acceptance have met the completion gate.

Completion is documentary.

Completion does not deploy.

Completion does not certify.

Completion does not override missing evidence.

Completion does not override rejected evidence.

Completion does not override boundary violations.

### Completion gate

Completion gate is the explicit evaluation process that classifies a Release Candidate as complete, complete with limitations, blocked, rejected or non-completed.

The completion gate must fail closed on unknown mandatory states.

The completion gate must preserve limitations.

The completion gate must preserve gaps.

### Requirement coverage

Requirement coverage is the mapped relationship between a requirement and its corresponding tests, evidence artifacts and audit references.

Requirement coverage is not evidence by itself.

Requirement coverage must be traceable.

### Test coverage

Test coverage is the documented relationship between a requirement and one or more tests that verify or challenge the requirement.

Test coverage must include positive tests.

Test coverage must include negative controls when applicable.

Test coverage is not evidence acceptance.

### Evidence coverage

Evidence coverage is the documented relationship between a requirement, a test and accepted canonical evidence.

Evidence coverage must include hash references.

Evidence coverage must include audit references.

Evidence coverage must include lifecycle state.

### Audit coverage

Audit coverage is the documented relationship between a requirement, a test, an evidence artifact and an audit reference.

Audit coverage is not approval.

Audit coverage is not completion by itself.

### Gap register

Gap register is the structured list of missing, partial, rejected, blocked, unknown or non-completed items preventing unqualified Release Candidate completion.

Gap register must be preserved.

Gap register must not be hidden by positive summary status.

### Human acceptance

Human acceptance is the explicit recorded acceptance state by the human authority for Release Candidate completion.

Human acceptance is required.

Human acceptance cannot override failed gates.

Human acceptance cannot override missing evidence.

Human acceptance cannot override legal or production boundaries.

### Documentary readiness

Documentary readiness is the internal state showing that a Release Candidate has complete documentation, tests, evidence references and audit references for review.

Documentary readiness is not production readiness.

Documentary readiness is not deployment readiness.

Documentary readiness is not L3 readiness.

## 6. Non-equivalence rules

The following equivalence shortcuts are forbidden:

Release Candidate = Production

Release Candidate = Production Readiness

Release Candidate = Deployment Readiness

Release Candidate = L3 Readiness

Release Candidate = OPC ALLOW

Release Candidate = Legal Certification

Release Candidate Completion = Production Deployment

Release Candidate Completion = Production Readiness

Release Candidate Completion = Deployment Readiness

Release Candidate Completion = L3 Readiness

Release Candidate Completion = OPC ALLOW

Release Candidate Completion = Legal Certification

Release Candidate Completion = eIDAS Qualification

Release Candidate Completion = Regulated KYC or AML Provider Status

Requirement Coverage = Completion

Test Coverage = Completion

Evidence Coverage = Completion

Audit Coverage = Completion

Human Acceptance = Completion

Positive Tests PASS = Completion

Golden Demo PASS = Completion

P004 Evidence Acceptance = Completion

MATRIX Update = Completion

Documentary Readiness = Production Readiness

Documentary Readiness = Deployment Readiness

Documentary Readiness = Legal Certification

No Known Gap = Accepted Completion

Missing Gap Register = Complete

Hash = Truth

Audit = Approval

Checklist = Evidence

Documentation = Implementation

Implementation = Production Readiness

## 7. Release Candidate Completion responsibilities

The Release Candidate Completion layer is responsible for:

- receiving Release Candidate completion requests
- verifying source contract references
- verifying requirement matrix references
- verifying requirement coverage
- verifying test coverage
- verifying evidence coverage
- verifying audit coverage
- verifying Golden Demo coverage
- verifying positive path coverage
- verifying negative control coverage
- verifying boundary preservation
- verifying human acceptance state
- verifying gap register state
- verifying canonical evidence compatibility
- verifying lifecycle state
- classifying completion result
- producing completion evidence
- producing audit summary
- preserving gaps
- preserving limitations
- failing closed on unknown mandatory states

The Release Candidate Completion layer is not responsible for:

- deploying production
- executing runtime
- promoting L3
- granting OPC ALLOW
- creating legal certification
- creating eIDAS qualification
- replacing regulated KYC or AML systems
- replacing external trust registers
- overriding failed evidence gates
- overriding human rejection

## 8. Release Candidate completion chain

The required completion chain is:

1. Program contract present.
2. Requirement matrix present.
3. Boundary contracts present.
4. Requirement coverage mapped.
5. Tests mapped.
6. Positive tests represented.
7. Negative controls represented.
8. Evidence artifacts mapped.
9. Evidence lifecycle states recorded.
10. Evidence hashes recorded.
11. Audit references recorded.
12. Boundary flags preserved.
13. Golden Demo obligations mapped.
14. Gap register generated.
15. Human acceptance recorded.
16. Completion result classified.
17. Completion evidence produced.
18. Completion audit summary produced.
19. Release Candidate lifecycle state recorded.

No step may be skipped silently.

Unknown mandatory state fails closed.

Missing mandatory field produces RELEASE_CANDIDATE_NON_COMPLETED.

## 9. Canonical Release Candidate completion fields

Every Release Candidate completion record must include:

- release_candidate_id
- release_candidate_version
- release_candidate_status
- release_candidate_result
- program_contract_ref
- requirement_matrix_ref
- authority_profile_contract_ref
- business_wallet_adapter_contract_ref
- canonical_evidence_model_contract_ref
- authorization_decision_contract_ref
- execution_boundary_contract_ref
- consequence_matrix_contract_ref
- p004_runtime_evidence_schema_ref
- p004_evidence_acceptance_gate_ref
- requirement_coverage_ref
- test_coverage_ref
- evidence_coverage_ref
- audit_coverage_ref
- golden_demo_coverage_ref
- negative_control_coverage_ref
- gap_register_ref
- completion_evidence_ref
- completion_hash
- audit_summary_ref
- human_acceptance_state
- boundary_flags
- created_at
- updated_at
- evaluated_at
- accepted_at
- lifecycle_state

No Release Candidate completion record is valid without:

- release_candidate_id
- release_candidate_version
- release_candidate_status
- release_candidate_result
- program_contract_ref
- requirement_matrix_ref
- requirement_coverage_ref
- test_coverage_ref
- evidence_coverage_ref
- audit_coverage_ref
- gap_register_ref
- completion_evidence_ref
- completion_hash
- audit_summary_ref
- human_acceptance_state
- boundary_flags
- lifecycle_state

## 10. Canonical requirement coverage fields

Every requirement coverage record must include:

- coverage_id
- coverage_version
- requirement_ref
- requirement_status
- requirement_source_ref
- mapped_test_refs
- mapped_evidence_refs
- mapped_audit_refs
- positive_test_refs
- negative_control_refs
- coverage_result
- coverage_gap_reason
- evidence_support_state
- audit_ref
- boundary_flags
- lifecycle_state

Requirement coverage must preserve requirements that are:

- covered
- covered with limitations
- not covered
- blocked
- rejected
- non-completed

A missing requirement coverage record blocks Release Candidate completion.

## 11. Canonical test coverage fields

Every test coverage record must include:

- test_coverage_id
- test_coverage_version
- requirement_ref
- test_refs
- positive_test_refs
- negative_control_refs
- test_result_summary
- missing_test_reason
- failed_test_reason
- blocked_test_reason
- evidence_refs
- audit_ref
- boundary_flags
- lifecycle_state

Test coverage must preserve:

- passing tests
- failing tests
- blocked tests
- missing tests
- skipped tests
- non-completed tests

Passing tests do not create completion by themselves.

Failed tests must not be erased.

Skipped tests must be justified.

## 12. Canonical evidence coverage fields

Every evidence coverage record must include:

- evidence_coverage_id
- evidence_coverage_version
- requirement_ref
- test_ref
- evidence_refs
- evidence_hash_refs
- evidence_lifecycle_states
- evidence_acceptance_states
- missing_evidence_reason
- rejected_evidence_reason
- revoked_evidence_reason
- blocked_evidence_reason
- limitation_scope
- audit_ref
- boundary_flags
- lifecycle_state

Evidence coverage must preserve:

- accepted evidence
- accepted evidence with limitations
- missing evidence
- rejected evidence
- revoked evidence
- blocked evidence
- non-completed evidence

Only accepted evidence can support unqualified completion.

Accepted-with-limitations evidence can support only limited completion.

Rejected evidence cannot support completion.

Revoked evidence cannot support completion.

Blocked evidence cannot support completion.

Non-completed evidence cannot support completion.

## 13. Canonical audit coverage fields

Every audit coverage record must include:

- audit_coverage_id
- audit_coverage_version
- requirement_ref
- test_ref
- evidence_ref
- audit_ref
- audit_hash
- audit_lifecycle_state
- missing_audit_reason
- audit_boundary_flags
- human_acceptance_state
- lifecycle_state

Audit coverage must preserve:

- complete audit reference
- missing audit reference
- invalid audit reference
- blocked audit reference
- non-completed audit reference

Audit coverage does not imply approval.

Audit coverage does not imply legal certification.

Audit coverage does not imply production readiness.

## 14. Status values

Allowed release_candidate_status values:

- DRAFT
- RECEIVED
- EVALUATING
- REQUIREMENTS_CHECKED
- TESTS_CHECKED
- EVIDENCE_CHECKED
- AUDIT_CHECKED
- BOUNDARIES_CHECKED
- HUMAN_ACCEPTANCE_PENDING
- COMPLETED_DOCUMENTARY
- COMPLETED_WITH_LIMITATIONS
- BLOCKED
- REJECTED
- NON_COMPLETED
- ARCHIVED
- REVOKED

Default release_candidate_status:

DRAFT

No release_candidate_status authorizes production deployment.

No release_candidate_status authorizes OPC ALLOW.

No release_candidate_status creates legal certification.

## 15. Result values

Allowed release_candidate_result values:

- NOT_EVALUATED
- RELEASE_CANDIDATE_COMPLETED_DOCUMENTARY
- RELEASE_CANDIDATE_COMPLETED_WITH_LIMITATIONS
- RELEASE_CANDIDATE_DENY_REQUIREMENTS_MISSING
- RELEASE_CANDIDATE_DENY_TESTS_MISSING
- RELEASE_CANDIDATE_DENY_TESTS_FAILED
- RELEASE_CANDIDATE_DENY_EVIDENCE_MISSING
- RELEASE_CANDIDATE_DENY_EVIDENCE_REJECTED
- RELEASE_CANDIDATE_DENY_EVIDENCE_REVOKED
- RELEASE_CANDIDATE_DENY_AUDIT_MISSING
- RELEASE_CANDIDATE_DENY_GOLDEN_DEMO_MISSING
- RELEASE_CANDIDATE_DENY_NEGATIVE_CONTROLS_MISSING
- RELEASE_CANDIDATE_BLOCK_BOUNDARY_VIOLATION
- RELEASE_CANDIDATE_BLOCK_UNKNOWN_STATE
- RELEASE_CANDIDATE_REJECTED_BY_HUMAN
- RELEASE_CANDIDATE_NON_COMPLETED

Default release_candidate_result:

NOT_EVALUATED

Unknown requirement state fails closed.

Unknown test state fails closed.

Unknown evidence state fails closed.

Unknown audit state fails closed.

Unknown boundary state fails closed.

Unknown human acceptance state fails closed.

## 16. Evidence support states

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

Only SUPPORTED_BY_ACCEPTED_EVIDENCE can support unqualified Release Candidate completion.

SUPPORTED_WITH_LIMITATIONS can support only limited Release Candidate completion.

Every unsupported state denies, blocks or marks non-completion.

UNKNOWN fails closed.

## 17. Completion coverage states

Allowed coverage states:

- NOT_EVALUATED
- COVERED
- COVERED_WITH_LIMITATIONS
- PARTIALLY_COVERED
- NOT_COVERED
- BLOCKED
- REJECTED
- NON_COMPLETED
- UNKNOWN

Only COVERED can support unqualified completion.

COVERED_WITH_LIMITATIONS can support limited completion.

PARTIALLY_COVERED cannot support unqualified completion.

NOT_COVERED denies completion.

BLOCKED blocks completion.

REJECTED rejects completion.

NON_COMPLETED prevents completion.

UNKNOWN fails closed.

## 18. Mandatory boundary flags

Every Release Candidate completion record must include:

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

If any boundary flag is missing, the completion record is NON_COMPLETED.

If any boundary flag is true, the completion record is BLOCKED unless a future explicit contract permits it.

No such permission exists in this contract.

## 19. Human acceptance states

Allowed human_acceptance_state values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Default human_acceptance_state:

PENDING

Release Candidate completion with human_acceptance_state PENDING remains NON_COMPLETED.

Release Candidate completion with human_acceptance_state REJECTED is REJECTED.

Human acceptance cannot override:

- missing requirements
- missing tests
- failing required tests
- missing evidence
- rejected evidence
- revoked evidence
- missing audit
- boundary violation
- production deployment boundary
- OPC ALLOW boundary
- legal certification boundary

## 20. Minimum Release Candidate completion schema

The minimum Release Candidate completion structure is:

release_candidate_id:
  type: string
  required: true

release_candidate_version:
  type: string
  required: true

release_candidate_status:
  type: enum
  required: true

release_candidate_result:
  type: enum
  required: true

program_contract_ref:
  type: string
  required: true

requirement_matrix_ref:
  type: string
  required: true

authority_profile_contract_ref:
  type: string
  required: true

business_wallet_adapter_contract_ref:
  type: string
  required: true

canonical_evidence_model_contract_ref:
  type: string
  required: true

authorization_decision_contract_ref:
  type: string
  required: true

execution_boundary_contract_ref:
  type: string
  required: true

consequence_matrix_contract_ref:
  type: string
  required: true

p004_runtime_evidence_schema_ref:
  type: string
  required: true

p004_evidence_acceptance_gate_ref:
  type: string
  required: true

requirement_coverage_ref:
  type: string
  required: true

test_coverage_ref:
  type: string
  required: true

evidence_coverage_ref:
  type: string
  required: true

audit_coverage_ref:
  type: string
  required: true

golden_demo_coverage_ref:
  type: string
  required: true

negative_control_coverage_ref:
  type: string
  required: true

gap_register_ref:
  type: string
  required: true

completion_evidence_ref:
  type: string
  required: true

completion_hash:
  type: string
  required: true

audit_summary_ref:
  type: string
  required: true

human_acceptance_state:
  type: enum
  required: true

boundary_flags:
  type: object
  required: true

lifecycle_state:
  type: enum
  required: true

## 21. Completion evaluation prerequisites

Release Candidate completion evaluation requires:

- program contract reference
- requirement matrix reference
- all required boundary contract references
- requirement coverage reference
- test coverage reference
- evidence coverage reference
- audit coverage reference
- Golden Demo coverage reference
- negative control coverage reference
- gap register reference
- completion evidence reference
- completion hash
- audit summary reference
- human acceptance state
- boundary flags
- lifecycle state

If any mandatory prerequisite is missing, result is RELEASE_CANDIDATE_NON_COMPLETED.

If requirement coverage is missing, result is RELEASE_CANDIDATE_DENY_REQUIREMENTS_MISSING.

If tests are missing, result is RELEASE_CANDIDATE_DENY_TESTS_MISSING.

If required tests failed, result is RELEASE_CANDIDATE_DENY_TESTS_FAILED.

If evidence is missing, result is RELEASE_CANDIDATE_DENY_EVIDENCE_MISSING.

If evidence is rejected, result is RELEASE_CANDIDATE_DENY_EVIDENCE_REJECTED.

If evidence is revoked, result is RELEASE_CANDIDATE_DENY_EVIDENCE_REVOKED.

If audit is missing, result is RELEASE_CANDIDATE_DENY_AUDIT_MISSING.

If Golden Demo coverage is missing, result is RELEASE_CANDIDATE_DENY_GOLDEN_DEMO_MISSING.

If negative controls are missing, result is RELEASE_CANDIDATE_DENY_NEGATIVE_CONTROLS_MISSING.

If boundary flag is violated, result is RELEASE_CANDIDATE_BLOCK_BOUNDARY_VIOLATION.

## 22. Completion evaluation algorithm

Release Candidate completion evaluation must follow this order:

1. Receive Release Candidate completion request.
2. Assign release_candidate_id.
3. Verify program_contract_ref.
4. Verify requirement_matrix_ref.
5. Verify authority_profile_contract_ref.
6. Verify business_wallet_adapter_contract_ref.
7. Verify canonical_evidence_model_contract_ref.
8. Verify authorization_decision_contract_ref.
9. Verify execution_boundary_contract_ref.
10. Verify consequence_matrix_contract_ref.
11. Verify p004_runtime_evidence_schema_ref.
12. Verify p004_evidence_acceptance_gate_ref.
13. Load requirement_coverage_ref.
14. Evaluate requirement coverage state.
15. Load test_coverage_ref.
16. Evaluate positive test coverage.
17. Evaluate negative control coverage.
18. Load evidence_coverage_ref.
19. Evaluate evidence support state.
20. Load audit_coverage_ref.
21. Evaluate audit coverage state.
22. Load golden_demo_coverage_ref.
23. Evaluate Golden Demo coverage state.
24. Load gap_register_ref.
25. Verify gap register completeness.
26. Verify boundary_flags.
27. Verify completion_evidence_ref.
28. Compute completion_hash.
29. Verify audit_summary_ref.
30. Verify human_acceptance_state.
31. Verify lifecycle_state.
32. Classify release_candidate_result.
33. Produce completion evidence.
34. Preserve gaps.
35. Preserve limitations.
36. Preserve negative outcomes.
37. Record documentary completion state.

No step may be skipped silently.

Unknown mandatory state fails closed.

Missing mandatory field produces RELEASE_CANDIDATE_NON_COMPLETED.

Boundary violation produces RELEASE_CANDIDATE_BLOCK_BOUNDARY_VIOLATION.

## 23. Positive completion path

A positive Release Candidate completion path requires:

- program contract present
- requirement matrix present
- all required boundary contracts present
- requirement coverage complete
- test coverage complete
- positive tests represented
- negative controls represented
- evidence coverage complete
- accepted canonical evidence
- evidence hashes recorded
- audit coverage complete
- audit references recorded
- Golden Demo coverage complete
- gap register present
- no blocking gaps
- boundary flags false
- completion evidence prepared
- completion hash valid
- audit summary prepared
- human acceptance ACCEPTED
- lifecycle state complete

Positive completion may produce:

RELEASE_CANDIDATE_COMPLETED_DOCUMENTARY

or:

RELEASE_CANDIDATE_COMPLETED_WITH_LIMITATIONS

Positive completion remains documentary.

Positive completion does not authorize production deployment.

Positive completion does not authorize deployment readiness.

Positive completion does not authorize OPC ALLOW.

Positive completion does not create legal certification.

## 24. Limited completion path

Release Candidate completion may be limited when:

- all mandatory gates are present
- evidence is accepted with limitations
- scope limitations are documented
- limitations do not violate boundaries
- limitations are preserved in the completion record
- human acceptance explicitly accepts the limited state

Limited completion produces:

RELEASE_CANDIDATE_COMPLETED_WITH_LIMITATIONS

Limited completion must preserve limitation_scope.

Limited completion must preserve gap_register_ref.

Limited completion does not authorize production deployment.

Limited completion does not erase known limitations.

## 25. Negative completion paths

The following negative completion paths must be supported:

- missing program contract
- missing requirement matrix
- missing boundary contract
- missing requirement coverage
- incomplete requirement coverage
- missing test coverage
- failed required tests
- missing positive tests
- missing negative controls
- missing evidence coverage
- missing evidence
- rejected evidence
- revoked evidence
- blocked evidence
- non-completed evidence
- evidence hash mismatch
- missing audit coverage
- missing audit reference
- missing Golden Demo coverage
- missing gap register
- hidden gap
- boundary flag violation
- human acceptance pending
- human acceptance rejected
- unknown mandatory state
- lifecycle state missing

Each negative path must produce or reference completion evidence when possible.

Each negative path must be auditable.

Each negative path must preserve the gap register.

Each negative path must not authorize production deployment.

## 26. Gap register rules

Gap register must include:

- gap_id
- gap_type
- affected_requirement_ref
- affected_test_ref
- affected_evidence_ref
- affected_audit_ref
- severity
- blocking_state
- gap_reason
- remediation_required
- limitation_scope
- lifecycle_state

Allowed gap_type values:

- REQUIREMENT_GAP
- TEST_GAP
- EVIDENCE_GAP
- AUDIT_GAP
- GOLDEN_DEMO_GAP
- NEGATIVE_CONTROL_GAP
- BOUNDARY_GAP
- HUMAN_ACCEPTANCE_GAP
- LIFECYCLE_GAP
- UNKNOWN_STATE_GAP

A blocking gap prevents unqualified completion.

A hidden gap invalidates completion.

A gap cannot be erased by summary status.

A gap cannot be erased by human acceptance.

## 27. Evidence relationship

Release Candidate completion must produce or reference canonical evidence.

Completion evidence must comply with:

HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md

Completion evidence must include:

- release_candidate_id
- release_candidate_result
- requirement_coverage_ref
- test_coverage_ref
- evidence_coverage_ref
- audit_coverage_ref
- golden_demo_coverage_ref
- negative_control_coverage_ref
- gap_register_ref
- completion_hash
- audit_summary_ref
- boundary_flags
- human_acceptance_state
- lifecycle_state

Rejected evidence cannot support Release Candidate completion.

Revoked evidence cannot support Release Candidate completion.

Blocked evidence cannot support Release Candidate completion.

Non-completed evidence cannot support Release Candidate completion.

Accepted-with-limitations evidence can support only limited completion.

## 28. Audit relationship

Release Candidate completion must be audit-bound.

Completion audit must preserve:

- release candidate id
- program contract reference
- requirement matrix reference
- boundary contract references
- requirement coverage reference
- test coverage reference
- evidence coverage reference
- audit coverage reference
- Golden Demo coverage reference
- negative control coverage reference
- gap register reference
- completion result
- completion evidence reference
- completion hash
- boundary flags
- human acceptance state
- lifecycle state

Missing audit produces RELEASE_CANDIDATE_NON_COMPLETED.

Audit does not imply approval.

Audit does not imply production readiness.

Audit does not imply legal certification.

## 29. Program contract relationship

Release Candidate completion must preserve the V3 program-level contract.

Release Candidate completion must not reinterpret the program contract as production readiness.

Release Candidate completion must not create deployment authority.

Release Candidate completion must not bypass the 2027 requirement matrix.

## 30. Requirement matrix relationship

Release Candidate completion must consume:

HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md

The requirement matrix defines the requirement-to-test-to-evidence-to-audit control layer.

Release Candidate completion must preserve requirement traceability.

Requirement traceability does not imply completion without tests, evidence and audit references.

## 31. Boundary contract relationships

Release Candidate completion must preserve the following boundary contracts:

- HBCE_AUTHORITY_PROFILE_CONTRACT.md
- HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
- HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
- HBCE_AUTHORIZATION_DECISION_CONTRACT.md
- HBCE_EXECUTION_BOUNDARY_CONTRACT.md
- HBCE_CONSEQUENCE_MATRIX_CONTRACT.md

Release Candidate completion must not collapse boundaries.

Authority Profile PASS is not Release Candidate completion.

Business Wallet Adapter PASS is not Release Candidate completion.

Evidence Acceptance is not Release Candidate completion.

Authorization PASS is not Release Candidate completion.

Decision PASS is not Release Candidate completion.

Execution PASS is not Release Candidate completion.

MATRIX update is not Release Candidate completion.

## 32. P004 relationship

P004 remains the evidence governance baseline.

Release Candidate completion evidence must be compatible with P004.

P004 acceptance gate must not be treated as full Release Candidate completion.

P004 evidence acceptance must remain an input to completion, not completion itself.

P004 non-completion blocks Release Candidate completion when mandatory evidence depends on it.

## 33. Golden Demo relationship

Golden Demo must demonstrate:

- positive chain path
- negative chain path
- evidence acceptance path
- evidence rejection path
- boundary preservation
- human acceptance handling
- non-completion handling
- no production deployment claim
- no OPC ALLOW claim
- no legal certification claim

Golden Demo PASS does not create Release Candidate completion by itself.

Golden Demo missing blocks Release Candidate completion.

Golden Demo limitations must be preserved.

## 34. /release-candidate API minimum contract

The /release-candidate API family must support the following conceptual operations:

- create Release Candidate completion request
- evaluate Release Candidate completion
- retrieve completion record
- retrieve completion evidence
- retrieve completion audit summary
- retrieve gap register
- classify completion result
- classify limited completion
- classify blocked completion
- classify rejected completion
- mark non-completed completion
- archive completion record
- revoke completion documentary record when applicable

This document does not implement the API.

This document defines minimum API obligations for future implementation.

## 35. /release-candidate request minimum fields

A /release-candidate completion request must include:

- request_id
- release_candidate_version
- program_contract_ref
- requirement_matrix_ref
- boundary_contract_refs
- requirement_coverage_ref
- test_coverage_ref
- evidence_coverage_ref
- audit_coverage_ref
- golden_demo_coverage_ref
- negative_control_coverage_ref
- gap_register_ref
- completion_evidence_ref or evidence creation context
- boundary_flags
- human_acceptance_state
- lifecycle_state

Missing request_id blocks the request.

Missing requirement_matrix_ref blocks the request.

Missing boundary_contract_refs blocks the request.

Missing test_coverage_ref blocks the request.

Missing evidence_coverage_ref blocks the request.

Missing audit_coverage_ref blocks the request.

Missing gap_register_ref blocks the request.

Missing human_acceptance_state blocks the request.

Missing boundary_flags blocks the request.

## 36. /release-candidate response minimum fields

A /release-candidate completion response must include:

- request_id
- release_candidate_id
- release_candidate_status
- release_candidate_result
- requirement_coverage_ref
- test_coverage_ref
- evidence_coverage_ref
- audit_coverage_ref
- golden_demo_coverage_ref
- negative_control_coverage_ref
- gap_register_ref
- completion_evidence_ref
- completion_hash
- audit_summary_ref
- human_acceptance_state
- boundary_flags
- lifecycle_state

A response without release_candidate_result is invalid.

A response without completion_hash is NON_COMPLETED.

A response without completion_evidence_ref is NON_COMPLETED.

A response with release_candidate_result RELEASE_CANDIDATE_COMPLETED_DOCUMENTARY does not authorize production deployment.

## 37. Error model

Allowed Release Candidate Completion error classes:

- RCC_REQUEST_INVALID
- RCC_PROGRAM_CONTRACT_MISSING
- RCC_REQUIREMENT_MATRIX_MISSING
- RCC_BOUNDARY_CONTRACT_MISSING
- RCC_REQUIREMENT_COVERAGE_MISSING
- RCC_REQUIREMENT_COVERAGE_INCOMPLETE
- RCC_TEST_COVERAGE_MISSING
- RCC_TEST_FAILED
- RCC_POSITIVE_TEST_MISSING
- RCC_NEGATIVE_CONTROL_MISSING
- RCC_EVIDENCE_COVERAGE_MISSING
- RCC_EVIDENCE_MISSING
- RCC_EVIDENCE_REJECTED
- RCC_EVIDENCE_REVOKED
- RCC_EVIDENCE_BLOCKED
- RCC_EVIDENCE_NON_COMPLETED
- RCC_EVIDENCE_HASH_MISMATCH
- RCC_AUDIT_COVERAGE_MISSING
- RCC_AUDIT_REF_MISSING
- RCC_GOLDEN_DEMO_MISSING
- RCC_GAP_REGISTER_MISSING
- RCC_GAP_HIDDEN
- RCC_BOUNDARY_FLAGS_MISSING
- RCC_BOUNDARY_BLOCKED
- RCC_HUMAN_ACCEPTANCE_PENDING
- RCC_HUMAN_ACCEPTANCE_REJECTED
- RCC_LIFECYCLE_STATE_MISSING
- RCC_UNKNOWN_STATE
- RCC_NON_COMPLETED

Error responses must be evidence-linked when possible.

Error responses must be auditable.

Error responses must preserve the gap register.

Error responses must not authorize production deployment.

## 38. Required tests

### HBCE-RCC-TST-001 - Valid documentary completion

Expected result:

Complete requirements, tests, evidence, audit references, boundary flags and accepted human state produce RELEASE_CANDIDATE_COMPLETED_DOCUMENTARY.

### HBCE-RCC-TST-002 - Valid limited completion

Expected result:

Accepted evidence with documented limitations produces RELEASE_CANDIDATE_COMPLETED_WITH_LIMITATIONS.

### HBCE-RCC-TST-003 - Missing requirement matrix

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_REQUIREMENTS_MISSING or RELEASE_CANDIDATE_NON_COMPLETED.

### HBCE-RCC-TST-004 - Missing boundary contract

Expected result:

Completion remains NON_COMPLETED.

### HBCE-RCC-TST-005 - Requirement coverage incomplete

Expected result:

Completion denies or marks non-completed.

### HBCE-RCC-TST-006 - Missing test coverage

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_TESTS_MISSING.

### HBCE-RCC-TST-007 - Failed required tests

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_TESTS_FAILED.

### HBCE-RCC-TST-008 - Missing negative controls

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_NEGATIVE_CONTROLS_MISSING.

### HBCE-RCC-TST-009 - Missing evidence

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_EVIDENCE_MISSING.

### HBCE-RCC-TST-010 - Rejected evidence

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_EVIDENCE_REJECTED.

### HBCE-RCC-TST-011 - Revoked evidence

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_EVIDENCE_REVOKED.

### HBCE-RCC-TST-012 - Evidence hash mismatch

Expected result:

Completion blocks or marks non-completed.

### HBCE-RCC-TST-013 - Missing audit

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_AUDIT_MISSING.

### HBCE-RCC-TST-014 - Missing Golden Demo coverage

Expected result:

Completion returns RELEASE_CANDIDATE_DENY_GOLDEN_DEMO_MISSING.

### HBCE-RCC-TST-015 - Missing gap register

Expected result:

Completion remains NON_COMPLETED.

### HBCE-RCC-TST-016 - Hidden gap

Expected result:

Completion blocks or rejects.

### HBCE-RCC-TST-017 - Boundary flag violation

Expected result:

Completion returns RELEASE_CANDIDATE_BLOCK_BOUNDARY_VIOLATION.

### HBCE-RCC-TST-018 - Human acceptance pending

Expected result:

Completion remains RELEASE_CANDIDATE_NON_COMPLETED.

### HBCE-RCC-TST-019 - Human acceptance rejected

Expected result:

Completion returns RELEASE_CANDIDATE_REJECTED_BY_HUMAN.

### HBCE-RCC-TST-020 - Unknown mandatory state

Expected result:

Completion returns RELEASE_CANDIDATE_BLOCK_UNKNOWN_STATE.

### HBCE-RCC-TST-021 - Documentary completion does not authorize production deployment

Expected result:

production_deployment remains false.

### HBCE-RCC-TST-022 - Documentary completion does not authorize OPC ALLOW

Expected result:

opc_allow remains false.

### HBCE-RCC-TST-023 - Documentary completion does not create legal certification

Expected result:

legal_certification remains false.

### HBCE-RCC-TST-024 - Documentary completion does not imply L3 readiness

Expected result:

l3_readiness remains false.

## 39. Required evidence artifacts

The following evidence artifacts must be produced or planned:

- HBCE-EVD-RCC-001-VALID-DOCUMENTARY-COMPLETION
- HBCE-EVD-RCC-002-VALID-LIMITED-COMPLETION
- HBCE-EVD-RCC-003-MISSING-REQUIREMENT-MATRIX
- HBCE-EVD-RCC-004-MISSING-BOUNDARY-CONTRACT
- HBCE-EVD-RCC-005-REQUIREMENT-COVERAGE-INCOMPLETE
- HBCE-EVD-RCC-006-MISSING-TEST-COVERAGE
- HBCE-EVD-RCC-007-FAILED-REQUIRED-TESTS
- HBCE-EVD-RCC-008-MISSING-NEGATIVE-CONTROLS
- HBCE-EVD-RCC-009-MISSING-EVIDENCE
- HBCE-EVD-RCC-010-REJECTED-EVIDENCE
- HBCE-EVD-RCC-011-REVOKED-EVIDENCE
- HBCE-EVD-RCC-012-EVIDENCE-HASH-MISMATCH
- HBCE-EVD-RCC-013-MISSING-AUDIT
- HBCE-EVD-RCC-014-MISSING-GOLDEN-DEMO
- HBCE-EVD-RCC-015-MISSING-GAP-REGISTER
- HBCE-EVD-RCC-016-HIDDEN-GAP
- HBCE-EVD-RCC-017-BOUNDARY-FLAG-VIOLATION
- HBCE-EVD-RCC-018-HUMAN-ACCEPTANCE-PENDING
- HBCE-EVD-RCC-019-HUMAN-ACCEPTANCE-REJECTED
- HBCE-EVD-RCC-020-UNKNOWN-MANDATORY-STATE
- HBCE-EVD-RCC-021-NO-PRODUCTION-DEPLOYMENT
- HBCE-EVD-RCC-022-NO-OPC-ALLOW
- HBCE-EVD-RCC-023-NO-LEGAL-CERTIFICATION
- HBCE-EVD-RCC-024-NO-L3-READINESS

Evidence artifacts must be compatible with P004.

Evidence artifacts must comply with the Canonical Evidence Model.

Evidence artifacts must include hash references.

Evidence artifacts must include audit references.

Evidence artifacts must include boundary flags.

Evidence artifacts must include lifecycle state.

## 40. Golden Demo Release Candidate obligations

Golden Demo must demonstrate:

- valid documentary completion
- valid limited completion
- missing requirement matrix block
- missing boundary contract block
- incomplete requirement coverage block
- missing test coverage block
- failed test denial
- missing negative controls block
- missing evidence denial
- rejected evidence denial
- revoked evidence denial
- evidence hash mismatch
- missing audit denial
- missing Golden Demo coverage denial
- missing gap register non-completion
- hidden gap block
- boundary violation block
- human acceptance pending non-completion
- human acceptance rejected
- unknown mandatory state block
- documentary completion does not authorize production deployment
- documentary completion does not authorize OPC ALLOW
- documentary completion does not create legal certification
- documentary completion does not imply L3 readiness

Golden Demo must preserve:

- Authority Profile boundary
- Business Wallet Adapter boundary
- Canonical Evidence Model boundary
- Authorization Decision boundary
- Execution Boundary separation
- Consequence Matrix separation
- Release Candidate Completion boundary
- P004 evidence governance boundary
- human acceptance boundary

## 41. Completion rule

The Release Candidate Completion Contract remains PREPARED_FOR_REVIEW until:

- human review is completed
- requirement matrix references are confirmed
- boundary contract references are confirmed
- P004 relationship is confirmed
- Canonical Evidence Model relationship is confirmed
- requirement coverage rules are confirmed
- test coverage rules are confirmed
- evidence coverage rules are confirmed
- audit coverage rules are confirmed
- Golden Demo obligations are confirmed
- gap register rules are confirmed
- tests are derived
- evidence artifacts are planned
- API contract alignment is prepared
- human acceptance is recorded

A future implementation is complete only when:

- implementation exists
- completion schema tests PASS
- requirement coverage tests PASS
- test coverage tests PASS
- evidence coverage tests PASS
- audit coverage tests PASS
- Golden Demo completion tests PASS
- negative control tests PASS
- boundary tests PASS
- human acceptance tests PASS
- gap register tests PASS
- evidence artifacts exist
- evidence hashes exist
- audit references exist
- documentation is updated
- integration is verified
- human acceptance is ACCEPTED

Until then:

NON_COMPLETED

## 42. Immediate next derivations

This document requires the following future derivations:

1. Release Candidate completion JSON schema
2. Release Candidate completion evaluation tests
3. Requirement coverage fixtures
4. Test coverage fixtures
5. Evidence coverage fixtures
6. Audit coverage fixtures
7. Gap register fixtures
8. Human acceptance fixtures
9. Boundary preservation fixtures
10. Golden Demo Release Candidate scenario
11. /release-candidate API contract section
12. Release Candidate evidence pack structure

Recommended next repository document:

HBCE_RELEASE_CANDIDATE_EVIDENCE_PACK_CONTRACT.md

Reason:

After Release Candidate completion is defined, the next missing program-level boundary is the evidence pack contract that packages the complete requirement, test, evidence, audit, gap and acceptance material without claiming production deployment or legal certification.

## 43. Operational meaning

This document defines how HBCE decides whether a Release Candidate is complete at documentary, test, evidence and audit level.

It prevents Release Candidate completion from being treated as production deployment.

It prevents Release Candidate completion from being treated as production readiness.

It prevents Release Candidate completion from being treated as deployment readiness.

It prevents Release Candidate completion from being treated as L3 readiness.

It prevents Release Candidate completion from being treated as OPC ALLOW.

It prevents Release Candidate completion from being treated as legal certification.

It prevents requirement coverage from being treated as completion.

It prevents test coverage from being treated as completion.

It prevents evidence coverage from being treated as completion.

It prevents audit coverage from being treated as completion.

It prevents Golden Demo PASS from being treated as completion.

It requires canonical evidence.

It requires audit binding.

It requires boundary flags.

It requires human acceptance.

It preserves negative outcomes.

It preserves failed tests.

It preserves missing evidence.

It preserves rejected evidence.

It preserves revoked evidence.

It preserves hidden gaps.

It preserves limitation scope.

It preserves P004 as the evidence governance baseline.

It preserves the V3 contract as the program-level contract.

It preserves the 2027 matrix as the requirement-to-test-to-evidence control layer.

It preserves the Authority Profile Contract as the authority evaluation boundary.

It preserves the Business Wallet Adapter Contract as the external material ingestion boundary.

It preserves the Canonical Evidence Model Contract as the cross-component evidence structure.

It preserves the Authorization Decision Contract as the authority-to-decision boundary.

It preserves the Execution Boundary Contract as the decision-to-execution boundary.

It preserves the Consequence Matrix Contract as the execution-evidence-to-MATRIX boundary.

It does not implement runtime behavior.

It does not authorize production deployment.

It does not authorize deployment readiness.

It does not authorize L3 readiness.

It does not authorize PostgreSQL runtime readiness or execution.

It does not authorize P04/P05 concurrency execution.

It does not authorize OPC ALLOW.

It does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 44. Document state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
