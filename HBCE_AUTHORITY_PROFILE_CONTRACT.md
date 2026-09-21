# HBCE AUTHORITY PROFILE CONTRACT

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Authority Profile Contract
Version: 1.0 Candidate
Target release: 2027-01-19
Baseline main: 6166f2e docs(main): record post HBCE 2027 requirement matrix checkpoint
Parent contract: HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
Parent matrix: HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
Evidence baseline: P004 documentary evidence chain
Human acceptance required: true

## 1. Purpose

This document defines the HBCE Authority Profile Contract.

The Authority Profile is the canonical HBCE object used to evaluate whether a subject can hold a bounded authority under a mandate, recognition source, scope, constraints and policy context.

The Authority Profile does not grant execution by itself.

The Authority Profile does not replace authorization.

The Authority Profile does not replace identity.

The Authority Profile does not replace external wallet systems.

The Authority Profile does not act as legal certification.

The Authority Profile exists to make authority computable, bounded, auditable and evidence-linked.

## 2. Position in the HBCE chain

The canonical HBCE chain is:

Identity -> Mandate -> Authority -> Authorization -> Decision -> Execution -> Evidence -> Consequence -> MATRIX

The Authority Profile belongs to the Authority step.

It receives normalized identity, mandate and recognition material.

It produces an authority evaluation basis.

It does not produce execution.

It does not produce final authorization.

It does not update MATRIX directly.

The downstream path remains:

Authority Profile -> Authorization Engine -> Decision Engine -> Execution boundary -> Evidence Engine -> Consequence -> MATRIX

## 3. Source requirements

This contract derives from the following requirement matrix entries:

- HBCE-REQ-003 - Canonical chain enforcement
- HBCE-REQ-004 - Identity is not authorization
- HBCE-REQ-005 - No authority without mandate
- HBCE-REQ-006 - Authorization must be bounded
- HBCE-REQ-007 - Policy evaluation fail-closed
- HBCE-REQ-008 - No execution without authority
- HBCE-REQ-010 - Evidence immutability
- HBCE-REQ-011 - MATRIX consequence requires evidence
- HBCE-REQ-012 - Human acceptance required
- HBCE-REQ-300 - WP-TRUST recognized_by model
- HBCE-REQ-301 - WP-TRUST capability is not authority
- HBCE-REQ-400 - WP-CONFORMANCE chain
- HBCE-REQ-401 - Evidence hash required
- HBCE-REQ-710 - /authority API contract
- HBCE-REQ-720 - /authorization API contract
- HBCE-REQ-750 - /decision API contract
- HBCE-REQ-900 - Golden Demo positive path
- HBCE-REQ-901 - Golden Demo missing mandate negative
- HBCE-REQ-902 - Golden Demo invalid authority negative

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

### Subject

A subject is the entity being evaluated.

A subject may be a natural person, legal entity, organization, agent or technical actor.

A subject reference is not an authorization.

A subject reference is not authority.

A subject reference is only an input for evaluation.

### Identity

Identity is a reference used to identify or link a subject.

Identity may come from internal records, onboarding flow, wallet-like material or other external systems.

Identity does not imply authority.

Identity does not imply authorization.

Identity does not imply execution permission.

### Mandate

A mandate is a bounded source of authority.

A mandate must define who can act, for whom, under what scope, within which constraints and during which time window.

A mandate may support authority evaluation only when it is present, valid, bounded and evidence-linked.

No mandate means no authority.

### Recognition

Recognition identifies the party, source or system that recognizes a capability, mandate, role or authority claim.

Recognition does not automatically create authority.

Recognition must be evaluated with mandate, scope, constraints and policy.

### Capability

Capability describes what a subject may be technically or organizationally able to do.

Capability is not authority.

Capability is not authorization.

Capability can support authority evaluation only when combined with mandate, recognition, scope, constraints and policy.

### Role

Role describes a position, function or classification.

Role is not authority by itself.

Role is not authorization by itself.

Role can support authority evaluation only when connected to mandate and bounded scope.

### Authority

Authority is a validated and bounded evaluation result stating that a subject may be considered authoritative for a defined purpose, scope and constraint set.

Authority is not execution.

Authority is not final authorization.

Authority is a prerequisite for authorization.

### Authorization

Authorization is the bounded approval of a specific action under authority and policy.

Authorization must be action-specific.

Authorization must be scope-specific.

Authorization must be time-aware.

Authorization must produce evidence when used in the canonical chain.

### Decision

Decision is the computed outcome derived from identity, mandate, authority, authorization and policy inputs.

Decision must be traceable.

Decision must not exist without source references.

### Evidence

Evidence is the structured, hashable and auditable record produced during evaluation.

Evidence follows the P004 evidence baseline.

Evidence may be documentary at this stage.

Evidence does not imply production readiness.

## 6. Non-equivalence rules

The following equivalence shortcuts are forbidden:

Identity = Authority

Identity = Authorization

Identity = Execution

Role = Authority

Role = Authorization

Capability = Authority

Capability = Authorization

Recognition = Authority

Recognition = Authorization

Mandate = Execution

Authority = Execution

Authority = Final Authorization

Authorization = Evidence Acceptance

Evidence = Legal Certification

Health PASS = Production Readiness

Procurement Readiness = Production Readiness

Banking Evidence Pack = Banking Certification

EUDI compatibility = eIDAS Qualification

Business Wallet Adapter = European Business Wallet

Credential Normalization = Credential Issuance

## 7. Authority Profile canonical fields

An Authority Profile must include the following canonical fields:

- authority_profile_id
- authority_profile_version
- authority_profile_status
- subject_ref
- subject_type
- organization_ref
- mandate_ref
- mandate_type
- mandate_issuer_ref
- recognized_by
- recognition_basis
- authority_kind
- authority_scope
- allowed_action_classes
- denied_action_classes
- constraints
- jurisdiction_context
- temporal_bounds
- policy_refs
- evidence_refs
- source_material_refs
- evaluation_inputs_hash
- profile_hash
- audit_ref
- created_at
- updated_at
- evaluated_at
- human_acceptance_state
- boundary_flags

No Authority Profile is valid without:

- subject_ref
- mandate_ref
- recognized_by
- authority_scope
- constraints
- policy_refs
- evidence_refs
- profile_hash
- audit_ref

## 8. Authority Profile status values

Allowed Authority Profile status values:

- DRAFT
- CANDIDATE
- EVALUATED
- ACTIVE_DOCUMENTARY
- ACCEPTED_DOCUMENTARY
- ACCEPTED_WITH_LIMITATIONS
- BLOCKED
- REJECTED
- REVOKED
- ARCHIVED
- NON_COMPLETED

Default status:

DRAFT

No status in this document authorizes production deployment.

No status in this document authorizes regulated operation.

No status in this document authorizes OPC ALLOW.

## 9. Human acceptance states

Allowed human acceptance states:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Default human acceptance state:

PENDING

An Authority Profile with human_acceptance_state PENDING remains NON_COMPLETED for Release Candidate completion.

Human acceptance does not override missing mandate.

Human acceptance does not override missing evidence.

Human acceptance does not override policy denial.

Human acceptance does not authorize production deployment.

## 10. Authority Profile evaluation states

Allowed evaluation states:

- NOT_EVALUATED
- PASS_DOCUMENTARY
- PASS_WITH_LIMITATIONS
- DENY_MISSING_MANDATE
- DENY_INVALID_MANDATE
- DENY_MISSING_RECOGNITION
- DENY_SCOPE_MISMATCH
- DENY_CONSTRAINT_MISMATCH
- DENY_POLICY_UNKNOWN
- DENY_POLICY_FAILED
- DENY_EVIDENCE_MISSING
- BLOCKED_BY_BOUNDARY
- NON_COMPLETED

Default evaluation state:

NOT_EVALUATED

Unknown states must fail closed.

Missing mandate must deny.

Missing recognition must deny or block.

Missing evidence must prevent completion.

Scope mismatch must deny.

Constraint mismatch must deny.

Policy unknown must deny or block.

## 11. Authority Profile minimum schema

The minimum Authority Profile structure is:

authority_profile_id:
  type: string
  required: true

authority_profile_version:
  type: string
  required: true

authority_profile_status:
  type: enum
  required: true
  allowed:
    - DRAFT
    - CANDIDATE
    - EVALUATED
    - ACTIVE_DOCUMENTARY
    - ACCEPTED_DOCUMENTARY
    - ACCEPTED_WITH_LIMITATIONS
    - BLOCKED
    - REJECTED
    - REVOKED
    - ARCHIVED
    - NON_COMPLETED

subject_ref:
  type: string
  required: true

subject_type:
  type: enum
  required: true
  allowed:
    - natural_person
    - legal_entity
    - organization
    - agent
    - technical_actor
    - unknown

organization_ref:
  type: string
  required: false

mandate_ref:
  type: string
  required: true

mandate_type:
  type: enum
  required: true
  allowed:
    - internal_mandate
    - organizational_mandate
    - delegated_mandate
    - contractual_mandate
    - documentary_mandate
    - external_reference
    - unknown

mandate_issuer_ref:
  type: string
  required: true

recognized_by:
  type: array
  required: true
  min_items: 1

recognition_basis:
  type: array
  required: true
  min_items: 1

authority_kind:
  type: enum
  required: true
  allowed:
    - decision_authority
    - review_authority
    - approval_authority
    - delegation_authority
    - evidence_acceptance_authority
    - technical_operation_authority
    - procurement_review_authority
    - unknown

authority_scope:
  type: object
  required: true

allowed_action_classes:
  type: array
  required: true

denied_action_classes:
  type: array
  required: true

constraints:
  type: object
  required: true

jurisdiction_context:
  type: object
  required: false

temporal_bounds:
  type: object
  required: true

policy_refs:
  type: array
  required: true
  min_items: 1

evidence_refs:
  type: array
  required: true
  min_items: 1

source_material_refs:
  type: array
  required: true
  min_items: 1

evaluation_inputs_hash:
  type: string
  required: true

profile_hash:
  type: string
  required: true

audit_ref:
  type: string
  required: true

human_acceptance_state:
  type: enum
  required: true
  allowed:
    - PENDING
    - ACCEPTED
    - REJECTED
    - BLOCKED

boundary_flags:
  type: object
  required: true

## 12. Mandatory boundary flags inside every profile

Every Authority Profile must explicitly include:

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

If any boundary flag is missing, the profile is NON_COMPLETED.

If any boundary flag is true, the profile is BLOCKED unless separately approved by a future explicit document.

No such approval exists in this contract.

## 13. Mandate requirements

A mandate used by an Authority Profile must provide:

- mandate_ref
- mandate_issuer_ref
- subject_ref
- beneficiary_ref or organization_ref
- scope
- allowed action classes
- denied action classes
- constraints
- temporal bounds
- source material reference
- evidence reference
- hash reference
- audit reference

A mandate without scope is invalid.

A mandate without issuer is invalid.

A mandate without subject is invalid.

A mandate without evidence is NON_COMPLETED.

A mandate outside temporal bounds is denied.

A mandate with unknown policy state fails closed.

## 14. Recognition requirements

The recognized_by field must identify who or what recognizes the mandate, capability, role or authority basis.

Recognition may come from:

- internal HBCE documentary source
- organizational record
- delegated record
- external wallet-like material
- credential-like material
- procurement review material
- banking evidence pack material
- manually accepted documentary evidence

Recognition must not be treated as automatic authority.

Recognition must be evaluated with:

- mandate
- scope
- constraints
- policy
- evidence
- audit

Recognition without mandate is insufficient.

Recognition without evidence is NON_COMPLETED.

Recognition without scope is blocked.

## 15. Capability handling

Capability may describe:

- technical capability
- organizational capability
- documentary capability
- operational capability
- review capability
- approval capability

Capability must be represented as input material.

Capability must not be elevated into authority without:

- mandate_ref
- recognized_by
- authority_scope
- constraints
- policy_refs
- evidence_refs
- audit_ref

Capability alone cannot authorize execution.

Capability alone cannot update MATRIX.

Capability alone cannot create consequence.

## 16. Role handling

Role may describe:

- officer
- reviewer
- approver
- operator
- auditor
- administrator
- external representative
- technical agent
- procurement contact
- compliance contact

Role must be treated as descriptive input.

Role must not imply authority.

Role must not imply authorization.

Role must be evaluated through mandate and policy.

A role without mandate is not authority.

A role without evidence is NON_COMPLETED.

## 17. Authority scope

Authority scope must define:

- domain
- purpose
- permitted action classes
- denied action classes
- resource bounds
- organizational bounds
- temporal bounds
- data bounds
- jurisdiction context when applicable
- evidence requirements
- downstream authorization requirements

Authority scope must be explicit.

Unbounded authority is invalid.

Wildcard authority is invalid unless blocked and marked NON_COMPLETED.

Authority scope cannot be inferred silently.

## 18. Constraint model

Constraints must include:

- time constraints
- purpose constraints
- action constraints
- resource constraints
- data constraints
- organizational constraints
- evidence constraints
- policy constraints
- audit constraints

A missing constraint set blocks the profile.

An empty constraint set blocks the profile.

Contradictory constraints block the profile.

Unknown constraints fail closed.

## 19. Temporal bounds

Temporal bounds must include:

- valid_from
- valid_until
- evaluated_at
- time_zone_context
- expiry_rule

A profile outside valid temporal bounds must be denied.

A profile without valid_from is blocked.

A profile without valid_until is blocked unless explicitly classified as documentary draft.

A profile with invalid time format is blocked.

A profile with expired mandate is denied.

## 20. Policy binding

Authority Profile evaluation must bind to policy references.

Policy references must include:

- policy_ref
- policy_version
- policy_hash or documentary hash placeholder
- policy_scope
- policy_evaluation_mode

If policy is missing, the profile is NON_COMPLETED.

If policy state is unknown, the profile fails closed.

If policy contradicts mandate, the profile is denied.

If policy contradicts requested action class, downstream authorization must deny.

## 21. Evidence binding

Authority Profile evaluation must bind to evidence references.

Evidence references must include:

- evidence_id
- evidence_type
- evidence_lifecycle_state
- evidence_hash
- evidence_registry_ref
- audit_ref

Evidence must align with P004.

Evidence without hash is NON_COMPLETED.

Evidence without lifecycle state is NON_COMPLETED.

Evidence without audit reference is NON_COMPLETED.

Evidence marked REJECTED cannot support authority.

Evidence marked REVOKED cannot support authority.

Evidence marked BLOCKED cannot support authority.

Evidence marked ACCEPTED_WITH_LIMITATIONS can support authority only inside its limitation boundary.

## 22. Audit binding

Authority Profile evaluation must produce or reference an audit record.

Audit record must include:

- audit_ref
- evaluated_at
- evaluator_ref or system_ref
- source inputs hash
- profile hash
- decision trace
- negative control status
- boundary flags
- human acceptance state

A profile without audit reference remains NON_COMPLETED.

Audit does not imply production readiness.

Audit does not imply legal certification.

Audit does not imply OPC ALLOW.

## 23. Hash requirements

The following hashes are required:

- evaluation_inputs_hash
- profile_hash
- evidence_hash for every evidence reference
- policy_hash or documented policy hash placeholder
- source material hash or documented source material hash placeholder

A profile without profile_hash is NON_COMPLETED.

A profile without evaluation_inputs_hash is NON_COMPLETED.

A profile with changed inputs must receive a new hash.

Hash mismatch must block the profile.

Hash presence does not imply truth.

Hash presence only supports integrity and reproducibility.

## 24. External material normalization

External material may include:

- European Business Wallet-like material
- EUDI Wallet-like material
- Verifiable Credential-like material
- SD-JWT-like material
- mdoc-like material
- organizational records
- procurement records
- banking review records

HBCE does not become any of these external systems by accepting normalized references.

External material must be normalized before authority evaluation.

Normalization must preserve source references.

Normalization must preserve evidence references.

Normalization must not create authority automatically.

## 25. Business Wallet Adapter relationship

Business Wallet Adapter may provide normalized input to Authority Profile.

Business Wallet Adapter cannot issue authority.

Business Wallet Adapter cannot authorize execution.

Business Wallet Adapter cannot certify legal status.

Business Wallet Adapter cannot make HBCE a European Business Wallet.

Business Wallet Adapter output must be treated as source material requiring evaluation.

## 26. Canonical evaluation algorithm

The Authority Profile evaluation algorithm must follow this order:

1. Validate subject_ref exists.
2. Validate mandate_ref exists.
3. Validate mandate source material exists.
4. Validate recognized_by exists.
5. Validate authority_scope exists.
6. Validate constraints exist.
7. Validate temporal bounds.
8. Validate policy_refs exist.
9. Validate evidence_refs exist.
10. Validate evidence lifecycle states.
11. Validate hash references.
12. Validate audit reference.
13. Evaluate non-equivalence rules.
14. Evaluate boundary flags.
15. Produce evaluation state.
16. Produce documentary evidence output.
17. Preserve human acceptance state.

No step may be skipped silently.

Any unknown mandatory input fails closed.

Any missing mandatory input produces NON_COMPLETED, BLOCKED or DENY state.

## 27. Positive evaluation path

A positive documentary authority evaluation requires:

- subject_ref present
- mandate_ref present
- mandate valid
- recognized_by present
- authority_scope explicit
- constraints explicit
- temporal bounds valid
- policy_refs valid
- evidence_refs present
- evidence hash present
- profile hash present
- audit_ref present
- boundary flags false
- human acceptance state recorded

Positive documentary evaluation result:

PASS_DOCUMENTARY or PASS_WITH_LIMITATIONS

Positive evaluation does not authorize production deployment.

Positive evaluation does not create final action authorization.

Positive evaluation does not authorize execution by itself.

## 28. Negative evaluation paths

The following negative paths must be supported:

- missing subject
- missing mandate
- invalid mandate
- missing recognized_by
- missing scope
- unbounded scope
- missing constraints
- temporal expiry
- policy missing
- policy unknown
- policy failed
- evidence missing
- evidence rejected
- evidence revoked
- evidence hash missing
- audit missing
- boundary flag violation
- human acceptance rejected
- unsupported external material
- role-only authority claim
- capability-only authority claim
- identity-only authority claim

Each negative path must produce evidence.

Each negative path must be auditable.

Each negative path must not execute.

## 29. Required tests

### HBCE-AUTH-TST-001 - Valid documentary authority profile

Expected result:

A complete Authority Profile with mandate, recognition, scope, constraints, evidence, hash and audit produces PASS_DOCUMENTARY.

### HBCE-AUTH-TST-002 - Missing mandate

Expected result:

Authority evaluation returns DENY_MISSING_MANDATE.

### HBCE-AUTH-TST-003 - Identity-only claim

Expected result:

Authority evaluation denies identity-only authority claim.

### HBCE-AUTH-TST-004 - Role-only claim

Expected result:

Authority evaluation denies role-only authority claim.

### HBCE-AUTH-TST-005 - Capability-only claim

Expected result:

Authority evaluation denies capability-only authority claim.

### HBCE-AUTH-TST-006 - Missing recognition

Expected result:

Authority evaluation returns DENY_MISSING_RECOGNITION.

### HBCE-AUTH-TST-007 - Scope mismatch

Expected result:

Authority evaluation returns DENY_SCOPE_MISMATCH.

### HBCE-AUTH-TST-008 - Constraint mismatch

Expected result:

Authority evaluation returns DENY_CONSTRAINT_MISMATCH.

### HBCE-AUTH-TST-009 - Unknown policy

Expected result:

Authority evaluation returns DENY_POLICY_UNKNOWN or BLOCKED_BY_BOUNDARY.

### HBCE-AUTH-TST-010 - Missing evidence

Expected result:

Authority evaluation returns DENY_EVIDENCE_MISSING or NON_COMPLETED.

### HBCE-AUTH-TST-011 - Rejected evidence

Expected result:

Authority evaluation denies rejected evidence.

### HBCE-AUTH-TST-012 - Revoked evidence

Expected result:

Authority evaluation denies revoked evidence.

### HBCE-AUTH-TST-013 - Hash mismatch

Expected result:

Authority evaluation blocks hash mismatch.

### HBCE-AUTH-TST-014 - Boundary flag violation

Expected result:

Authority evaluation returns BLOCKED_BY_BOUNDARY.

### HBCE-AUTH-TST-015 - Human acceptance pending

Expected result:

Authority evaluation can be prepared but remains NON_COMPLETED for RC completion.

## 30. Required evidence artifacts

The following evidence artifacts must be produced or planned:

- HBCE-EVD-AUTH-001-VALID-DOCUMENTARY-AUTHORITY
- HBCE-EVD-AUTH-002-MISSING-MANDATE
- HBCE-EVD-AUTH-003-IDENTITY-ONLY-DENIAL
- HBCE-EVD-AUTH-004-ROLE-ONLY-DENIAL
- HBCE-EVD-AUTH-005-CAPABILITY-ONLY-DENIAL
- HBCE-EVD-AUTH-006-MISSING-RECOGNITION
- HBCE-EVD-AUTH-007-SCOPE-MISMATCH
- HBCE-EVD-AUTH-008-CONSTRAINT-MISMATCH
- HBCE-EVD-AUTH-009-UNKNOWN-POLICY
- HBCE-EVD-AUTH-010-MISSING-EVIDENCE
- HBCE-EVD-AUTH-011-REJECTED-EVIDENCE
- HBCE-EVD-AUTH-012-REVOKED-EVIDENCE
- HBCE-EVD-AUTH-013-HASH-MISMATCH
- HBCE-EVD-AUTH-014-BOUNDARY-FLAG-VIOLATION
- HBCE-EVD-AUTH-015-HUMAN-ACCEPTANCE-PENDING

Evidence artifacts must be compatible with P004.

Evidence artifacts must include hash references.

Evidence artifacts must include audit references.

Evidence artifacts must include boundary flags.

## 31. /authority API minimum contract

The /authority API family must support the following conceptual operations:

- create authority profile candidate
- evaluate authority profile candidate
- retrieve authority profile
- retrieve authority evaluation trace
- retrieve authority evidence reference
- classify authority profile status

This document does not implement the API.

This document defines minimum API obligations for the future public API contract.

## 32. /authority request minimum fields

A /authority request must include:

- request_id
- subject_ref
- mandate_ref
- recognized_by
- requested_authority_kind
- requested_scope
- requested_action_classes
- constraints
- policy_refs
- source_material_refs
- evidence_refs
- boundary_flags

Missing request_id blocks the request.

Missing subject_ref blocks the request.

Missing mandate_ref denies authority.

Missing recognized_by denies or blocks authority.

Missing requested_scope blocks the request.

Missing constraints blocks the request.

Missing policy_refs fails closed.

Missing evidence_refs prevents completion.

## 33. /authority response minimum fields

A /authority response must include:

- request_id
- authority_profile_id
- evaluation_state
- authority_profile_status
- subject_ref
- mandate_ref
- recognized_by
- authority_scope
- constraints
- policy_refs
- evidence_refs
- evaluation_inputs_hash
- profile_hash
- audit_ref
- human_acceptance_state
- boundary_flags

A response without evaluation_state is invalid.

A response without evidence_refs is NON_COMPLETED.

A response without audit_ref is NON_COMPLETED.

## 34. Error model

Allowed authority error classes:

- AUTHORITY_PROFILE_INVALID
- AUTHORITY_SUBJECT_MISSING
- AUTHORITY_MANDATE_MISSING
- AUTHORITY_MANDATE_INVALID
- AUTHORITY_RECOGNITION_MISSING
- AUTHORITY_SCOPE_MISSING
- AUTHORITY_SCOPE_UNBOUNDED
- AUTHORITY_SCOPE_MISMATCH
- AUTHORITY_CONSTRAINTS_MISSING
- AUTHORITY_CONSTRAINTS_INVALID
- AUTHORITY_TEMPORAL_BOUNDS_INVALID
- AUTHORITY_POLICY_MISSING
- AUTHORITY_POLICY_UNKNOWN
- AUTHORITY_POLICY_FAILED
- AUTHORITY_EVIDENCE_MISSING
- AUTHORITY_EVIDENCE_REJECTED
- AUTHORITY_EVIDENCE_REVOKED
- AUTHORITY_HASH_MISSING
- AUTHORITY_HASH_MISMATCH
- AUTHORITY_AUDIT_MISSING
- AUTHORITY_BOUNDARY_BLOCKED
- AUTHORITY_HUMAN_ACCEPTANCE_PENDING
- AUTHORITY_NON_COMPLETED

Error responses must be evidence-linked.

Error responses must be auditable.

Error responses must not execute.

## 35. Golden Demo authority obligations

Golden Demo must demonstrate:

- valid documentary Authority Profile
- missing mandate denial
- invalid authority denial
- unbounded scope denial
- role-only claim denial
- capability-only claim denial
- identity-only claim denial
- unknown policy fail-closed
- missing evidence NON_COMPLETED
- boundary flag block

Golden Demo authority output must feed Authorization Engine only after authority evaluation.

Golden Demo must not bypass authorization.

Golden Demo must not update MATRIX from authority alone.

## 36. Banking Evidence Pack relationship

The Banking Evidence Pack may include Authority Profile evidence.

The Banking Evidence Pack may use Authority Profile outputs for review.

The Banking Evidence Pack does not transform Authority Profile into banking certification.

The Banking Evidence Pack does not transform HBCE into a regulated KYC or AML provider.

The Banking Evidence Pack does not authorize production deployment.

## 37. Completion rule

The Authority Profile Contract remains PREPARED_FOR_REVIEW until:

- human review is completed
- requirement matrix references are confirmed
- tests are derived
- evidence artifacts are planned
- API contract alignment is prepared
- Golden Demo alignment is prepared
- human acceptance is recorded

A future implementation is complete only when:

- implementation exists
- positive tests PASS
- negative tests PASS
- evidence artifacts exist
- evidence hashes exist
- audit references exist
- documentation is updated
- integration is verified
- human acceptance is ACCEPTED

Until then:

NON_COMPLETED

## 38. Immediate next derivations

This document requires the following future derivations:

1. Authority Profile schema
2. Authority evaluation test plan
3. Authority negative controls fixture set
4. /authority API contract section
5. Golden Demo authority scenario
6. Authority evidence record examples
7. Authority profile audit checklist

Recommended next repository document:

HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md

Reason:

The Business Wallet Adapter provides one of the external input paths that must normalize into Authority Profile evaluation without becoming authority automatically.

## 39. Operational meaning

This document defines the first operational authority boundary for HBCE.

It separates identity, role, capability, recognition, mandate, authority, authorization and execution.

It prevents authority from being inferred silently.

It requires authority to be bounded, evidence-linked, policy-bound, hashable and auditable.

It preserves P004 as the evidence governance baseline.

It preserves the V3 contract as the program-level contract.

It preserves the 2027 matrix as the requirement-to-test-to-evidence control layer.

It does not implement runtime behavior.

It does not authorize production deployment.

It does not authorize deployment readiness.

It does not authorize L3 readiness.

It does not authorize PostgreSQL runtime readiness or execution.

It does not authorize P04/P05 concurrency execution.

It does not authorize OPC ALLOW.

It does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 40. Document state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
