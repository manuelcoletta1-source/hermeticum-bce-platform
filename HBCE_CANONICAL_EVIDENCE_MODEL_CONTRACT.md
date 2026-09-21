# HBCE CANONICAL EVIDENCE MODEL CONTRACT

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Canonical Evidence Model Contract
Version: 1.0 Candidate
Target release: 2027-01-19
Baseline main: 05340ad docs(main): record post HBCE business wallet adapter checkpoint
Parent contract: HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
Parent matrix: HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
Authority boundary: HBCE_AUTHORITY_PROFILE_CONTRACT.md
Adapter boundary: HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
Runtime schema baseline: P004_RUNTIME_EVIDENCE_SCHEMA.md
Acceptance gate baseline: P004_EVIDENCE_ACCEPTANCE_GATE.md
Human acceptance required: true

## 1. Purpose

This document defines the HBCE Canonical Evidence Model Contract.

The Canonical Evidence Model is the common evidence structure used across HBCE.

It binds evidence produced by adapter, authority, authorization, decision, execution, policy, audit and MATRIX-related flows.

It makes evidence computable.

It makes evidence traceable.

It makes evidence lifecycle-aware.

It makes evidence hash-bound.

It makes evidence audit-bound.

It makes evidence compatible with P004.

It prevents each component from inventing incompatible evidence structures.

The Canonical Evidence Model does not certify legal truth.

The Canonical Evidence Model does not create authority.

The Canonical Evidence Model does not create authorization.

The Canonical Evidence Model does not execute.

The Canonical Evidence Model does not update MATRIX directly.

The Canonical Evidence Model does not authorize production deployment.

The Canonical Evidence Model is a documentary and technical contract for future implementation.

## 2. Position in the HBCE chain

The canonical HBCE chain is:

Identity -> Mandate -> Authority -> Authorization -> Decision -> Execution -> Evidence -> Consequence -> MATRIX

The Canonical Evidence Model sits across the chain.

It receives references from:

- Business Wallet Adapter
- Authority Profile
- Authorization Engine
- Decision Engine
- Execution Boundary
- Policy Evaluation
- Audit Trail
- MATRIX Consequence layer

It provides a common model for:

- evidence identity
- evidence source
- evidence payload
- evidence hash
- evidence lifecycle
- evidence acceptance
- evidence rejection
- evidence revocation
- evidence limitation
- evidence audit
- evidence boundary flags
- evidence traceability

The model is not a bypass.

Evidence does not replace Authority Profile.

Evidence does not replace Authorization Engine.

Evidence does not replace Decision Engine.

Evidence does not replace Execution Boundary.

Evidence does not replace human acceptance.

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
- HBCE-REQ-100 - WP-EBW adapter contract
- HBCE-REQ-101 - WP-EBW non-wallet boundary
- HBCE-REQ-200 - WP-VC canonical credential model
- HBCE-REQ-201 - WP-VC non-issuer boundary
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
- HBCE-REQ-780 - /business-wallet API contract
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

### Evidence

Evidence is a structured HBCE record that documents an observed, evaluated, generated, rejected, blocked, accepted or limited system fact.

Evidence is not truth by itself.

Evidence is not legal certification.

Evidence is not authority.

Evidence is not authorization.

Evidence is not execution permission.

Evidence must be traceable.

Evidence must be hash-bound.

Evidence must be audit-bound.

Evidence must have lifecycle state.

### Evidence artifact

An evidence artifact is a concrete file, object, event, record or payload associated with an evidence record.

An evidence artifact may be source material.

An evidence artifact may be generated by HBCE.

An evidence artifact may be imported from external systems.

An evidence artifact must not be accepted without lifecycle state.

### Evidence claim

An evidence claim is a statement recorded inside an evidence payload.

Evidence claims can be:

- observed
- computed
- asserted
- imported
- evaluated
- rejected
- blocked
- limited

Claims are not automatically true.

Claims require source, hash, audit and lifecycle context.

### Evidence lifecycle

Evidence lifecycle is the state progression of an evidence record.

Lifecycle state controls whether evidence may support downstream decisions.

Lifecycle state must be explicit.

Missing lifecycle state means NON_COMPLETED.

### Evidence acceptance

Evidence acceptance is the documentary state in which evidence is allowed to support a downstream HBCE evaluation.

Acceptance is not legal certification.

Acceptance is not production readiness.

Acceptance is not OPC ALLOW.

Acceptance must preserve limitations.

### Evidence rejection

Evidence rejection means the evidence record cannot support downstream evaluation.

Rejected evidence remains auditable.

Rejected evidence must preserve rejection reason.

Rejected evidence must not be deleted silently.

### Evidence revocation

Evidence revocation means evidence was previously accepted or usable but is no longer allowed to support downstream evaluation.

Revoked evidence must remain traceable.

Revoked evidence must not be used as positive support.

### Evidence limitation

Evidence limitation records a bounded acceptance condition.

Evidence accepted with limitations can support only the declared scope.

Evidence accepted with limitations cannot support broader authority, authorization or execution.

### Evidence hash

Evidence hash is the integrity reference for an evidence payload, evidence artifact or canonical evidence record.

Hash presence proves integrity reference.

Hash presence does not prove truth.

Hash presence does not prove legal validity.

### Audit reference

Audit reference is the pointer to the evaluation trail associated with evidence.

Evidence without audit reference is NON_COMPLETED.

Audit presence does not imply acceptance.

Audit presence supports traceability.

### Source material

Source material is the input material from which evidence is derived.

Source material can be internal or external.

Source material is not automatically evidence.

Source material becomes evidence only through canonical evidence modeling.

## 6. Non-equivalence rules

The following equivalence shortcuts are forbidden:

Evidence = Truth

Evidence = Legal Certification

Evidence = Authority

Evidence = Authorization

Evidence = Execution Permission

Evidence = Production Readiness

Evidence = OPC ALLOW

Evidence = MATRIX Consequence

Hash = Truth

Hash = Legal Validity

Hash = Regulatory Acceptance

Audit = Evidence Acceptance

Audit = Legal Certification

Source Material = Accepted Evidence

External Credential = Accepted Evidence

Wallet-Like Input = Accepted Evidence

Business Wallet Adapter PASS = Accepted Evidence

Authority Profile PASS = Evidence Acceptance

Authorization PASS = Evidence Acceptance

Decision PASS = Evidence Acceptance

Execution Result = Accepted Evidence Without Validation

Policy PASS = Production Readiness

Human Acceptance = Legal Certification

Human Acceptance = Hash Validity

Human Acceptance = Boundary Override

MATRIX Update = Evidence Acceptance

Evidence Acceptance = Production Deployment

Evidence Acceptance = L3 Readiness

Evidence Acceptance = eIDAS Qualification

Evidence Acceptance = Regulated KYC or AML Provider Status

## 7. Evidence responsibilities

The Canonical Evidence Model is responsible for defining:

- evidence identity
- evidence type
- evidence lifecycle
- evidence source references
- evidence payload references
- evidence payload hash
- canonical evidence hash
- evidence schema reference
- evidence producer reference
- evidence consumer reference
- policy references
- audit references
- validation references
- acceptance references
- rejection references
- revocation references
- limitation boundaries
- temporal bounds
- subject references
- authority references
- authorization references
- decision references
- execution references
- consequence references
- MATRIX references
- boundary flags
- human acceptance state

The Canonical Evidence Model is not responsible for:

- issuing identity
- issuing credentials
- granting authority
- granting authorization
- executing actions
- certifying legal validity
- acting as a trust service
- acting as a KYC or AML provider
- declaring production readiness
- declaring OPC ALLOW

## 8. Canonical evidence fields

Every canonical evidence record must include:

- evidence_id
- evidence_version
- evidence_type
- evidence_lifecycle_state
- evidence_acceptance_state
- evidence_source_type
- evidence_source_ref
- evidence_payload_ref
- evidence_payload_hash
- canonical_evidence_hash
- canonicalization_method
- schema_ref
- producer_ref
- consumer_refs
- subject_refs
- organization_refs
- adapter_record_refs
- authority_profile_refs
- authorization_refs
- decision_refs
- execution_refs
- policy_evaluation_refs
- consequence_refs
- matrix_refs
- source_material_refs
- validation_refs
- audit_ref
- created_at
- updated_at
- observed_at
- evaluated_at
- accepted_at
- rejected_at
- revoked_at
- limitation_scope
- rejection_reason
- revocation_reason
- boundary_flags
- human_acceptance_state

No canonical evidence record is valid without:

- evidence_id
- evidence_version
- evidence_type
- evidence_lifecycle_state
- evidence_acceptance_state
- evidence_source_type
- evidence_payload_hash
- canonical_evidence_hash
- canonicalization_method
- schema_ref
- audit_ref
- boundary_flags
- human_acceptance_state

## 9. Evidence type values

Allowed evidence_type values:

- adapter_ingestion_evidence
- adapter_validation_evidence
- adapter_normalization_evidence
- source_material_evidence
- authority_profile_evidence
- authority_evaluation_evidence
- authorization_evidence
- decision_evidence
- execution_evidence
- policy_evaluation_evidence
- negative_control_evidence
- audit_evidence
- event_evidence
- matrix_consequence_evidence
- manual_acceptance_evidence
- manual_rejection_evidence
- revocation_evidence
- boundary_violation_evidence
- hash_integrity_evidence
- schema_validation_evidence
- golden_demo_positive_evidence
- golden_demo_negative_evidence
- release_candidate_completion_evidence
- non_completed_evidence

Unknown evidence type must be rejected or blocked.

Unsupported evidence type must be rejected or blocked.

Evidence type must never be inferred silently.

## 10. Evidence lifecycle states

Allowed evidence_lifecycle_state values:

- DRAFT
- GENERATED
- IMPORTED
- HASHED
- SCHEMA_VALIDATED
- VALIDATED_DOCUMENTARY
- ACCEPTED
- ACCEPTED_WITH_LIMITATIONS
- REJECTED
- REVOKED
- BLOCKED
- ARCHIVED
- NON_COMPLETED

Default state:

DRAFT

Missing lifecycle state:

NON_COMPLETED

Only ACCEPTED or ACCEPTED_WITH_LIMITATIONS evidence may support downstream positive evaluation.

ACCEPTED_WITH_LIMITATIONS evidence may support only the declared limitation scope.

REJECTED evidence must not support downstream positive evaluation.

REVOKED evidence must not support downstream positive evaluation.

BLOCKED evidence must not support downstream positive evaluation.

NON_COMPLETED evidence must not support downstream positive evaluation.

## 11. Evidence acceptance states

Allowed evidence_acceptance_state values:

- NOT_REVIEWED
- ACCEPTED
- ACCEPTED_WITH_LIMITATIONS
- REJECTED
- REVOKED
- BLOCKED
- NON_COMPLETED

Default evidence acceptance state:

NOT_REVIEWED

Evidence acceptance requires:

- valid evidence_id
- valid evidence_type
- valid lifecycle state
- valid payload hash
- valid canonical evidence hash
- valid schema reference
- valid audit reference
- boundary flags present and false
- human acceptance state recorded
- rejection and revocation fields empty unless applicable

Evidence accepted with limitations requires:

- limitation_scope present
- limitation reason present
- downstream scope check required

## 12. Evidence source types

Allowed evidence_source_type values:

- internal_runtime
- internal_documentary_source
- external_material
- business_wallet_adapter
- authority_profile
- authorization_engine
- decision_engine
- execution_boundary
- policy_evaluation
- audit_system
- manual_review
- golden_demo_fixture
- test_fixture
- matrix_layer
- unknown
- unsupported

Unknown source type blocks the evidence.

Unsupported source type blocks the evidence.

External material source must preserve provenance.

Manual review source must preserve reviewer reference or manual audit reference.

## 13. Canonicalization method

Every canonical evidence record must declare canonicalization_method.

Allowed canonicalization_method values:

- hbce-canonical-json-v1
- hbce-canonical-text-v1
- hbce-canonical-markdown-v1
- hbce-canonical-event-v1
- hbce-canonical-documentary-v1
- unsupported

Unsupported canonicalization method blocks acceptance.

Missing canonicalization method produces NON_COMPLETED.

Canonicalization must be deterministic.

Canonicalization must be reproducible.

Canonicalization must not discard material evidence fields.

Canonicalization must not rewrite source truth claims.

Canonicalization must not erase rejection or limitation states.

## 14. Hash requirements

Canonical evidence requires:

- evidence_payload_hash
- canonical_evidence_hash
- source_material_hash when source material exists
- schema_hash when schema is bound
- audit_hash when audit record is hash-bound
- validation_hash when validation trace exists

A record without evidence_payload_hash is NON_COMPLETED.

A record without canonical_evidence_hash is NON_COMPLETED.

A record with hash mismatch is BLOCKED.

A record with missing source_material_hash for source-bound evidence is NON_COMPLETED.

Hash values must be stable.

Hash values must be reproducible.

Hash values do not certify truth.

Hash values do not create legal validity.

## 15. Audit requirements

Every canonical evidence record must include audit_ref.

Audit record must bind:

- evidence_id
- evidence_version
- evidence_type
- evidence_lifecycle_state
- evidence_acceptance_state
- producer_ref
- source material references
- payload hash
- canonical evidence hash
- schema reference
- validation outcome
- acceptance outcome
- rejection reason when applicable
- revocation reason when applicable
- limitation scope when applicable
- boundary flags
- human acceptance state

A record without audit_ref is NON_COMPLETED.

Audit must preserve negative outcomes.

Audit must preserve blocked outcomes.

Audit must preserve rejected outcomes.

Audit must preserve revoked outcomes.

Audit must preserve limitations.

## 16. Boundary flags inside every evidence record

Every evidence record must include:

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

If any boundary flag is missing, the evidence record is NON_COMPLETED.

If any boundary flag is true, the evidence record is BLOCKED unless a future explicit contract permits it.

No such permission exists in this contract.

## 17. Human acceptance states

Allowed human_acceptance_state values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Default state:

PENDING

Evidence with human_acceptance_state PENDING remains NON_COMPLETED for Release Candidate completion.

Human acceptance can accept documentary evidence only inside documented boundaries.

Human acceptance cannot override:

- missing hash
- hash mismatch
- missing audit
- missing schema reference
- rejected evidence
- revoked evidence
- boundary violation
- legal certification boundary
- production deployment boundary
- OPC ALLOW boundary

## 18. Minimum canonical evidence schema

The minimum evidence structure is:

evidence_id:
  type: string
  required: true

evidence_version:
  type: string
  required: true

evidence_type:
  type: enum
  required: true

evidence_lifecycle_state:
  type: enum
  required: true

evidence_acceptance_state:
  type: enum
  required: true

evidence_source_type:
  type: enum
  required: true

evidence_source_ref:
  type: string
  required: false

evidence_payload_ref:
  type: string
  required: false

evidence_payload_hash:
  type: string
  required: true

canonical_evidence_hash:
  type: string
  required: true

canonicalization_method:
  type: enum
  required: true

schema_ref:
  type: string
  required: true

producer_ref:
  type: string
  required: true

consumer_refs:
  type: array
  required: false

subject_refs:
  type: array
  required: false

organization_refs:
  type: array
  required: false

adapter_record_refs:
  type: array
  required: false

authority_profile_refs:
  type: array
  required: false

authorization_refs:
  type: array
  required: false

decision_refs:
  type: array
  required: false

execution_refs:
  type: array
  required: false

policy_evaluation_refs:
  type: array
  required: false

consequence_refs:
  type: array
  required: false

matrix_refs:
  type: array
  required: false

source_material_refs:
  type: array
  required: false

validation_refs:
  type: array
  required: false

audit_ref:
  type: string
  required: true

created_at:
  type: string
  required: true

updated_at:
  type: string
  required: false

observed_at:
  type: string
  required: false

evaluated_at:
  type: string
  required: false

accepted_at:
  type: string
  required: false

rejected_at:
  type: string
  required: false

revoked_at:
  type: string
  required: false

limitation_scope:
  type: object
  required: false

rejection_reason:
  type: string
  required: false

revocation_reason:
  type: string
  required: false

boundary_flags:
  type: object
  required: true

human_acceptance_state:
  type: enum
  required: true

## 19. Evidence validation rules

Evidence validation must check:

- evidence_id exists
- evidence_version exists
- evidence_type is supported
- evidence_lifecycle_state is supported
- evidence_acceptance_state is supported
- evidence_source_type is supported
- evidence_payload_hash exists
- canonical_evidence_hash exists
- canonicalization_method is supported
- schema_ref exists
- producer_ref exists
- audit_ref exists
- boundary_flags exist
- human_acceptance_state exists
- lifecycle and acceptance state are consistent
- rejected evidence has rejection_reason
- revoked evidence has revocation_reason
- accepted with limitations has limitation_scope
- payload hash matches payload
- canonical evidence hash matches canonical form

Unknown mandatory state fails closed.

Missing mandatory field produces NON_COMPLETED.

Hash mismatch produces BLOCKED.

Unsupported enum value produces BLOCKED.

## 20. Lifecycle consistency rules

Lifecycle consistency rules:

DRAFT evidence cannot be ACCEPTED.

GENERATED evidence cannot be ACCEPTED without hash validation.

IMPORTED evidence cannot be ACCEPTED without provenance validation.

HASHED evidence cannot be ACCEPTED without schema validation.

SCHEMA_VALIDATED evidence cannot support downstream positive evaluation unless acceptance state is ACCEPTED or ACCEPTED_WITH_LIMITATIONS.

VALIDATED_DOCUMENTARY evidence cannot support downstream positive evaluation unless acceptance state is ACCEPTED or ACCEPTED_WITH_LIMITATIONS.

ACCEPTED evidence requires acceptance state ACCEPTED.

ACCEPTED_WITH_LIMITATIONS evidence requires acceptance state ACCEPTED_WITH_LIMITATIONS.

REJECTED evidence requires acceptance state REJECTED.

REVOKED evidence requires acceptance state REVOKED.

BLOCKED evidence requires acceptance state BLOCKED.

NON_COMPLETED evidence requires acceptance state NON_COMPLETED or NOT_REVIEWED.

## 21. Evidence acceptance algorithm

Canonical evidence acceptance must follow this order:

1. Load evidence record.
2. Verify evidence_id.
3. Verify evidence_version.
4. Verify evidence_type.
5. Verify evidence_lifecycle_state.
6. Verify evidence_acceptance_state.
7. Verify evidence_source_type.
8. Verify payload reference when required.
9. Verify payload hash.
10. Verify canonicalization method.
11. Recompute or verify canonical evidence hash.
12. Verify schema_ref.
13. Verify producer_ref.
14. Verify audit_ref.
15. Verify source material references when present.
16. Verify validation references when present.
17. Verify boundary flags.
18. Verify human_acceptance_state.
19. Verify lifecycle consistency.
20. Verify rejection fields when rejected.
21. Verify revocation fields when revoked.
22. Verify limitation scope when accepted with limitations.
23. Produce acceptance result.
24. Produce audit update.

No step may be skipped silently.

Any unknown mandatory state fails closed.

Any missing mandatory field produces NON_COMPLETED.

Any boundary violation produces BLOCKED.

## 22. Positive evidence path

A positive evidence path requires:

- supported evidence_type
- supported evidence_source_type
- supported lifecycle state
- supported acceptance state
- valid payload hash
- valid canonical evidence hash
- valid canonicalization method
- valid schema_ref
- valid producer_ref
- valid audit_ref
- lifecycle consistency
- boundary flags false
- human_acceptance_state recorded

Positive evidence may result in:

ACCEPTED

or:

ACCEPTED_WITH_LIMITATIONS

Positive evidence does not authorize production deployment.

Positive evidence does not create authority.

Positive evidence does not create authorization.

Positive evidence does not execute.

Positive evidence does not update MATRIX by itself.

## 23. Negative evidence paths

The following negative paths must be supported:

- missing evidence id
- missing evidence version
- unsupported evidence type
- unsupported evidence source type
- missing payload hash
- payload hash mismatch
- missing canonical evidence hash
- canonical evidence hash mismatch
- missing canonicalization method
- unsupported canonicalization method
- missing schema reference
- missing producer reference
- missing audit reference
- missing boundary flags
- boundary flag violation
- missing human acceptance state
- human acceptance pending
- rejected evidence without rejection reason
- revoked evidence without revocation reason
- accepted with limitations without limitation scope
- lifecycle and acceptance mismatch
- source material missing when required
- validation reference missing when required

Each negative path must produce an auditable result.

Each negative path must not create positive support.

Each negative path must not authorize execution.

## 24. Adapter evidence mapping

Business Wallet Adapter evidence must map into Canonical Evidence Model.

Adapter fields map as follows:

- adapter_record_id -> adapter_record_refs
- adapter_request_id -> source_material_refs or validation_refs
- external_material_ref -> source_material_refs
- external_material_hash -> evidence_payload_hash or source_material_hash
- validation_state -> validation_refs
- normalization_state -> validation_refs
- canonical_input_ref -> evidence_payload_ref
- canonical_input_hash -> evidence_payload_hash
- evidence_refs -> evidence dependency references
- audit_ref -> audit_ref
- human_acceptance_state -> human_acceptance_state
- boundary_flags -> boundary_flags

Adapter PASS is not evidence acceptance.

Adapter ROUTED is not evidence acceptance.

Adapter normalized output must still satisfy canonical evidence validation.

## 25. Authority Profile evidence mapping

Authority Profile evidence must map into Canonical Evidence Model.

Authority fields map as follows:

- authority_profile_id -> authority_profile_refs
- subject_ref -> subject_refs
- organization_ref -> organization_refs
- mandate_ref -> source_material_refs
- recognized_by -> source_material_refs or validation_refs
- authority_scope -> limitation_scope when bounded
- policy_refs -> validation_refs
- evidence_refs -> evidence dependency references
- profile_hash -> evidence_payload_hash or canonical_evidence_hash depending on artifact
- audit_ref -> audit_ref
- human_acceptance_state -> human_acceptance_state
- boundary_flags -> boundary_flags

Authority Profile PASS is not automatic evidence acceptance.

Authority Profile evidence must preserve evaluation outcome.

Rejected or blocked authority profile evidence must remain auditable.

## 26. Authorization evidence mapping

Authorization evidence must map into Canonical Evidence Model.

Authorization fields map as follows:

- authorization_id -> authorization_refs
- authority_profile_ref -> authority_profile_refs
- action_ref -> source_material_refs
- policy_evaluation_ref -> policy_evaluation_refs
- decision_ref -> decision_refs when present
- authorization_hash -> evidence_payload_hash
- audit_ref -> audit_ref
- boundary_flags -> boundary_flags

Authorization PASS is not production readiness.

Authorization PASS is not execution result.

Authorization PASS must still be bound to evidence.

Authorization denial must also produce evidence.

## 27. Decision evidence mapping

Decision evidence must map into Canonical Evidence Model.

Decision fields map as follows:

- decision_id -> decision_refs
- authorization_ref -> authorization_refs
- policy_evaluation_refs -> policy_evaluation_refs
- decision_payload_ref -> evidence_payload_ref
- decision_hash -> evidence_payload_hash
- audit_ref -> audit_ref
- boundary_flags -> boundary_flags

Decision evidence must preserve:

- allowed decision
- denied decision
- blocked decision
- non-completed decision
- reason codes
- constraints
- policy context

Decision PASS is not execution result.

Decision PASS does not update MATRIX by itself.

## 28. Execution evidence mapping

Execution evidence must map into Canonical Evidence Model.

Execution fields map as follows:

- execution_id -> execution_refs
- decision_ref -> decision_refs
- execution_payload_ref -> evidence_payload_ref
- execution_result_hash -> evidence_payload_hash
- audit_ref -> audit_ref
- consequence_ref -> consequence_refs when produced
- boundary_flags -> boundary_flags

Execution must produce evidence.

Execution without evidence is NON_COMPLETED.

Execution evidence must preserve:

- executed action
- denied execution
- blocked execution
- execution result
- failure reason
- observed result
- measured output
- audit reference

Execution evidence does not certify external reality.

Execution evidence records HBCE observed or produced state.

## 29. MATRIX consequence evidence mapping

MATRIX consequence evidence must map into Canonical Evidence Model.

MATRIX fields map as follows:

- matrix_event_id -> matrix_refs
- consequence_ref -> consequence_refs
- source_evidence_refs -> evidence dependency references
- consequence_hash -> evidence_payload_hash
- audit_ref -> audit_ref
- boundary_flags -> boundary_flags

MATRIX consequence requires evidence.

MATRIX update without accepted evidence is blocked.

MATRIX evidence must preserve source traceability.

MATRIX evidence must not erase negative outcomes.

## 30. Policy evaluation evidence mapping

Policy evaluation evidence must map into Canonical Evidence Model.

Policy fields map as follows:

- policy_evaluation_id -> policy_evaluation_refs
- policy_ref -> validation_refs
- policy_version -> validation_refs
- policy_hash -> source_material_refs
- evaluation_result -> evidence payload
- evaluation_hash -> evidence_payload_hash
- audit_ref -> audit_ref
- boundary_flags -> boundary_flags

Policy PASS is not production readiness.

Policy PASS is not legal certification.

Policy FAIL must be evidence-linked.

Policy UNKNOWN must fail closed.

## 31. Required tests

### HBCE-CEM-TST-001 - Valid accepted evidence

Expected result:

A complete evidence record with valid hashes, schema reference, audit reference, boundary flags and accepted state is accepted.

### HBCE-CEM-TST-002 - Missing evidence id

Expected result:

Evidence remains NON_COMPLETED.

### HBCE-CEM-TST-003 - Unsupported evidence type

Expected result:

Evidence is BLOCKED.

### HBCE-CEM-TST-004 - Missing payload hash

Expected result:

Evidence remains NON_COMPLETED.

### HBCE-CEM-TST-005 - Payload hash mismatch

Expected result:

Evidence is BLOCKED.

### HBCE-CEM-TST-006 - Missing canonical evidence hash

Expected result:

Evidence remains NON_COMPLETED.

### HBCE-CEM-TST-007 - Canonical evidence hash mismatch

Expected result:

Evidence is BLOCKED.

### HBCE-CEM-TST-008 - Missing schema reference

Expected result:

Evidence remains NON_COMPLETED.

### HBCE-CEM-TST-009 - Missing audit reference

Expected result:

Evidence remains NON_COMPLETED.

### HBCE-CEM-TST-010 - Boundary flag violation

Expected result:

Evidence is BLOCKED.

### HBCE-CEM-TST-011 - Human acceptance pending

Expected result:

Evidence remains NON_COMPLETED for Release Candidate completion.

### HBCE-CEM-TST-012 - Rejected evidence supports nothing

Expected result:

Rejected evidence cannot support downstream positive evaluation.

### HBCE-CEM-TST-013 - Revoked evidence supports nothing

Expected result:

Revoked evidence cannot support downstream positive evaluation.

### HBCE-CEM-TST-014 - Accepted with limitations enforces scope

Expected result:

Evidence accepted with limitations supports only its declared limitation scope.

### HBCE-CEM-TST-015 - Adapter PASS is not evidence acceptance

Expected result:

Adapter PASS requires canonical evidence validation before acceptance.

### HBCE-CEM-TST-016 - Authority PASS is not evidence acceptance

Expected result:

Authority Profile PASS requires canonical evidence validation before evidence acceptance.

### HBCE-CEM-TST-017 - Authorization PASS is evidence-bound

Expected result:

Authorization PASS must produce or reference canonical evidence.

### HBCE-CEM-TST-018 - Execution without evidence is non-completed

Expected result:

Execution without canonical evidence is NON_COMPLETED.

### HBCE-CEM-TST-019 - MATRIX update requires accepted evidence

Expected result:

MATRIX consequence update is blocked without accepted evidence.

### HBCE-CEM-TST-020 - Policy UNKNOWN fails closed

Expected result:

Policy UNKNOWN produces blocked or non-completed evidence.

## 32. Required evidence artifacts

The following evidence artifacts must be produced or planned:

- HBCE-EVD-CEM-001-VALID-ACCEPTED-EVIDENCE
- HBCE-EVD-CEM-002-MISSING-EVIDENCE-ID
- HBCE-EVD-CEM-003-UNSUPPORTED-EVIDENCE-TYPE
- HBCE-EVD-CEM-004-MISSING-PAYLOAD-HASH
- HBCE-EVD-CEM-005-PAYLOAD-HASH-MISMATCH
- HBCE-EVD-CEM-006-MISSING-CANONICAL-EVIDENCE-HASH
- HBCE-EVD-CEM-007-CANONICAL-EVIDENCE-HASH-MISMATCH
- HBCE-EVD-CEM-008-MISSING-SCHEMA-REFERENCE
- HBCE-EVD-CEM-009-MISSING-AUDIT-REFERENCE
- HBCE-EVD-CEM-010-BOUNDARY-FLAG-VIOLATION
- HBCE-EVD-CEM-011-HUMAN-ACCEPTANCE-PENDING
- HBCE-EVD-CEM-012-REJECTED-EVIDENCE-SUPPORTS-NOTHING
- HBCE-EVD-CEM-013-REVOKED-EVIDENCE-SUPPORTS-NOTHING
- HBCE-EVD-CEM-014-ACCEPTED-WITH-LIMITATIONS-SCOPE
- HBCE-EVD-CEM-015-ADAPTER-PASS-NOT-EVIDENCE-ACCEPTANCE
- HBCE-EVD-CEM-016-AUTHORITY-PASS-NOT-EVIDENCE-ACCEPTANCE
- HBCE-EVD-CEM-017-AUTHORIZATION-PASS-EVIDENCE-BOUND
- HBCE-EVD-CEM-018-EXECUTION-WITHOUT-EVIDENCE-NON-COMPLETED
- HBCE-EVD-CEM-019-MATRIX-UPDATE-REQUIRES-ACCEPTED-EVIDENCE
- HBCE-EVD-CEM-020-POLICY-UNKNOWN-FAILS-CLOSED

Evidence artifacts must be compatible with P004.

Evidence artifacts must include hash references.

Evidence artifacts must include audit references.

Evidence artifacts must include boundary flags.

Evidence artifacts must include lifecycle state.

## 33. /evidence API minimum contract

The /evidence API family must support the following conceptual operations:

- create evidence draft
- import evidence material
- canonicalize evidence
- hash evidence payload
- hash canonical evidence
- validate evidence schema
- validate evidence lifecycle
- accept evidence
- accept evidence with limitations
- reject evidence
- revoke evidence
- retrieve evidence
- retrieve evidence audit
- retrieve evidence dependencies
- list evidence by subject
- list evidence by authority profile
- list evidence by authorization
- list evidence by decision
- list evidence by execution
- list evidence by MATRIX consequence
- classify evidence support status

This document does not implement the API.

This document defines minimum API obligations for future implementation.

## 34. /evidence request minimum fields

A /evidence create or validate request must include:

- request_id
- evidence_type
- evidence_source_type
- evidence_payload_ref or evidence_payload
- evidence_payload_hash when payload is external
- canonicalization_method
- schema_ref
- producer_ref
- audit_ref or audit request context
- boundary_flags
- human_acceptance_state

Missing request_id blocks the request.

Missing evidence_type blocks the request.

Missing evidence_source_type blocks the request.

Missing payload or payload reference blocks the request.

Missing canonicalization method blocks the request.

Missing schema_ref blocks the request.

Missing producer_ref blocks the request.

Missing boundary_flags blocks the request.

## 35. /evidence response minimum fields

A /evidence response must include:

- request_id
- evidence_id
- evidence_version
- evidence_type
- evidence_lifecycle_state
- evidence_acceptance_state
- evidence_payload_hash
- canonical_evidence_hash
- canonicalization_method
- schema_ref
- audit_ref
- validation_result
- support_status
- boundary_flags
- human_acceptance_state

A response without evidence_id is invalid.

A response without lifecycle state is invalid.

A response without payload hash is NON_COMPLETED.

A response without canonical evidence hash is NON_COMPLETED.

A response without audit_ref is NON_COMPLETED.

A positive response does not authorize execution.

## 36. Error model

Allowed Canonical Evidence Model error classes:

- CEM_REQUEST_INVALID
- CEM_EVIDENCE_ID_MISSING
- CEM_EVIDENCE_VERSION_MISSING
- CEM_EVIDENCE_TYPE_UNKNOWN
- CEM_EVIDENCE_TYPE_UNSUPPORTED
- CEM_SOURCE_TYPE_UNKNOWN
- CEM_SOURCE_TYPE_UNSUPPORTED
- CEM_PAYLOAD_MISSING
- CEM_PAYLOAD_HASH_MISSING
- CEM_PAYLOAD_HASH_MISMATCH
- CEM_CANONICAL_HASH_MISSING
- CEM_CANONICAL_HASH_MISMATCH
- CEM_CANONICALIZATION_METHOD_MISSING
- CEM_CANONICALIZATION_METHOD_UNSUPPORTED
- CEM_SCHEMA_REF_MISSING
- CEM_PRODUCER_REF_MISSING
- CEM_AUDIT_REF_MISSING
- CEM_BOUNDARY_FLAGS_MISSING
- CEM_BOUNDARY_BLOCKED
- CEM_HUMAN_ACCEPTANCE_PENDING
- CEM_REJECTION_REASON_MISSING
- CEM_REVOCATION_REASON_MISSING
- CEM_LIMITATION_SCOPE_MISSING
- CEM_LIFECYCLE_ACCEPTANCE_MISMATCH
- CEM_REJECTED_EVIDENCE_SUPPORT_BLOCKED
- CEM_REVOKED_EVIDENCE_SUPPORT_BLOCKED
- CEM_NON_COMPLETED

Error responses must be evidence-linked when possible.

Error responses must be auditable.

Error responses must not create positive support.

Error responses must not authorize execution.

## 37. Golden Demo evidence obligations

Golden Demo must demonstrate:

- valid accepted evidence
- accepted evidence with limitations
- rejected evidence support blocked
- revoked evidence support blocked
- missing hash blocked
- hash mismatch blocked
- missing schema blocked
- missing audit blocked
- boundary violation blocked
- adapter PASS not evidence acceptance
- authority PASS not evidence acceptance
- authorization PASS evidence-bound
- execution without evidence non-completed
- MATRIX update requires accepted evidence
- policy UNKNOWN fails closed

Golden Demo evidence must be canonical.

Golden Demo evidence must be hash-bound.

Golden Demo evidence must be audit-bound.

Golden Demo evidence must preserve negative outcomes.

Golden Demo evidence must not claim production readiness.

## 38. P004 relationship

P004 remains the evidence governance baseline.

The Canonical Evidence Model extends P004 into a cross-component contract.

P004 acceptance requirements remain binding.

P004 negative controls remain binding.

P004 documentary evidence chain remains binding.

Canonical evidence must be compatible with P004.

Canonical evidence must not weaken P004.

Canonical evidence must not bypass P004 acceptance gates.

## 39. Business Wallet Adapter relationship

Business Wallet Adapter output must normalize into canonical evidence-compatible structures.

Adapter evidence must not be treated as accepted evidence without Canonical Evidence Model validation.

Adapter evidence must preserve external source provenance.

Adapter evidence must preserve disclosure and minimization context.

Adapter evidence must preserve non-wallet boundary flags.

Adapter evidence must preserve non-issuer boundary flags.

## 40. Authority Profile relationship

Authority Profile evaluation must produce or reference canonical evidence.

Authority Profile evidence must preserve:

- mandate references
- recognized_by references
- scope
- constraints
- policy references
- evidence references
- audit reference
- profile hash
- boundary flags

Authority Profile PASS does not replace evidence acceptance.

Evidence accepted for authority support does not authorize execution by itself.

## 41. Authorization relationship

Authorization must produce or reference canonical evidence.

Authorization evidence must preserve:

- authority profile reference
- action reference
- policy evaluation
- authorization result
- denial result when denied
- audit reference
- boundary flags

Authorization PASS must not exist without evidence.

Authorization FAIL must not be discarded.

Authorization BLOCKED must remain auditable.

## 42. Execution relationship

Execution must produce canonical evidence.

Execution evidence must preserve:

- decision reference
- execution request
- execution result
- failure state
- blocked state
- observed output
- audit reference
- evidence hash
- boundary flags

Execution without evidence is NON_COMPLETED.

Execution evidence does not update MATRIX by itself.

## 43. MATRIX relationship

MATRIX consequence requires accepted canonical evidence.

MATRIX consequence must reference source evidence.

MATRIX consequence must preserve source hashes.

MATRIX consequence must preserve audit reference.

MATRIX consequence must preserve limitation scope.

MATRIX consequence must not be created from rejected evidence.

MATRIX consequence must not be created from revoked evidence.

MATRIX consequence must not be created from non-completed evidence.

## 44. Completion rule

The Canonical Evidence Model Contract remains PREPARED_FOR_REVIEW until:

- human review is completed
- requirement matrix references are confirmed
- P004 relationship is confirmed
- Business Wallet Adapter mapping is confirmed
- Authority Profile mapping is confirmed
- Authorization mapping is confirmed
- Decision mapping is confirmed
- Execution mapping is confirmed
- MATRIX mapping is confirmed
- tests are derived
- evidence artifacts are planned
- API contract alignment is prepared
- Golden Demo alignment is prepared
- human acceptance is recorded

A future implementation is complete only when:

- implementation exists
- positive tests PASS
- negative tests PASS
- schema validation exists
- hash validation exists
- audit validation exists
- lifecycle validation exists
- support classification exists
- evidence artifacts exist
- documentation is updated
- integration is verified
- human acceptance is ACCEPTED

Until then:

NON_COMPLETED

## 45. Immediate next derivations

This document requires the following future derivations:

1. Canonical evidence JSON schema
2. Evidence lifecycle validation tests
3. Evidence acceptance gate tests
4. Evidence rejection and revocation fixtures
5. Adapter-to-evidence mapping fixtures
6. Authority-to-evidence mapping fixtures
7. Authorization-to-evidence mapping fixtures
8. Decision-to-evidence mapping fixtures
9. Execution-to-evidence mapping fixtures
10. MATRIX consequence evidence fixtures
11. /evidence API contract section
12. Golden Demo evidence scenario

Recommended next repository document:

HBCE_AUTHORIZATION_DECISION_CONTRACT.md

Reason:

After canonical evidence, the next missing program-level boundary is the authorization and decision contract that determines how bounded authority becomes a decision without bypassing evidence, policy or execution constraints.

## 46. Operational meaning

This document defines the common evidence structure for HBCE.

It makes evidence cross-component.

It makes evidence lifecycle-aware.

It makes evidence hash-bound.

It makes evidence audit-bound.

It makes evidence boundary-aware.

It links Business Wallet Adapter output to evidence.

It links Authority Profile evaluation to evidence.

It links Authorization to evidence.

It links Decision to evidence.

It links Execution to evidence.

It links MATRIX consequence to evidence.

It prevents evidence from being treated as truth without validation.

It prevents hash from being treated as truth.

It prevents audit from being treated as acceptance.

It prevents adapter pass from being treated as evidence acceptance.

It prevents authority pass from being treated as evidence acceptance.

It preserves P004 as the evidence governance baseline.

It preserves the V3 contract as the program-level contract.

It preserves the 2027 matrix as the requirement-to-test-to-evidence control layer.

It preserves the Authority Profile Contract as the authority evaluation boundary.

It preserves the Business Wallet Adapter Contract as the external material ingestion boundary.

It does not implement runtime behavior.

It does not authorize production deployment.

It does not authorize deployment readiness.

It does not authorize L3 readiness.

It does not authorize PostgreSQL runtime readiness or execution.

It does not authorize P04/P05 concurrency execution.

It does not authorize OPC ALLOW.

It does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 47. Document state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
