# HBCE BUSINESS WALLET ADAPTER CONTRACT

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Business Wallet Adapter Contract
Version: 1.0 Candidate
Target release: 2027-01-19
Baseline main: 08398a1 docs(main): record post HBCE authority profile checkpoint
Parent contract: HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
Parent matrix: HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
Authority boundary: HBCE_AUTHORITY_PROFILE_CONTRACT.md
Evidence baseline: P004 documentary evidence chain
Human acceptance required: true

## 1. Purpose

This document defines the HBCE Business Wallet Adapter Contract.

The Business Wallet Adapter is an ingestion, normalization, validation and evidence-preparation boundary for external business-wallet-like material.

The adapter receives external trust material.

The adapter normalizes external trust material.

The adapter validates external trust material against HBCE adapter rules.

The adapter prepares evidence-compatible output.

The adapter may provide source material for Authority Profile evaluation.

The adapter does not grant authority.

The adapter does not grant authorization.

The adapter does not execute.

The adapter does not update MATRIX directly.

The adapter does not make HBCE a European Business Wallet.

The adapter does not make HBCE an EUDI Wallet.

The adapter does not make HBCE a Verifiable Credential issuer.

The adapter does not make HBCE a Certification Authority.

The adapter does not make HBCE an Identity Provider.

The adapter does not make HBCE an eIDAS qualified trust service provider.

The adapter does not make HBCE a regulated KYC or AML provider.

The adapter exists to make external input computable, bounded, auditable and evidence-linked.

## 2. Position in the HBCE chain

The canonical HBCE chain is:

Identity -> Mandate -> Authority -> Authorization -> Decision -> Execution -> Evidence -> Consequence -> MATRIX

The Business Wallet Adapter sits before Authority Profile evaluation.

The adapter belongs to the external material normalization boundary.

The adapter may feed:

- subject references
- organization references
- mandate-like references
- recognition material
- capability-like material
- role-like material
- credential-like material
- wallet-like material
- source material references
- evidence references

The downstream path remains:

Business Wallet Adapter -> Canonical Input -> Authority Profile -> Authorization Engine -> Decision Engine -> Execution Boundary -> Evidence Engine -> Consequence -> MATRIX

The adapter does not bypass Authority Profile.

The adapter does not bypass Authorization Engine.

The adapter does not bypass Evidence Engine.

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
- HBCE-REQ-740 - /evidence API contract
- HBCE-REQ-760 - /events API contract
- HBCE-REQ-780 - /business-wallet API contract
- HBCE-REQ-900 - Golden Demo positive path

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

### External trust material

External trust material is any input produced outside HBCE that may contain identity-like, credential-like, wallet-like, mandate-like, capability-like, role-like, organization-like or recognition-like claims.

External trust material is source material.

External trust material is not authority.

External trust material is not authorization.

External trust material is not evidence acceptance.

### Business-wallet-like material

Business-wallet-like material is external material presented as a business, organization, representative, mandate, credential or capability record.

HBCE may ingest business-wallet-like material.

HBCE does not become a Business Wallet by ingesting it.

HBCE does not issue wallet material.

HBCE does not certify wallet material.

HBCE only normalizes, validates, records and routes it.

### EUDI-wallet-like material

EUDI-wallet-like material is external wallet-like material that may represent identity or credential-related input.

HBCE may normalize references to such material.

HBCE does not become an EUDI Wallet by processing such material.

### Credential-like material

Credential-like material is external source material that may contain claims, issuer-like references, subject references, validity metadata, disclosure metadata or proof-like fields.

Credential-like material is not automatically trusted.

Credential-like material must be normalized and evaluated.

Credential normalization is not credential issuance.

### Adapter

The adapter is the boundary component that receives external material and transforms it into HBCE canonical input.

The adapter does not make final authority decisions.

The adapter does not make final authorization decisions.

The adapter produces normalized records, validation outcomes, evidence references and audit references.

### Normalization

Normalization is the transformation of external material into HBCE canonical input form.

Normalization must preserve source references.

Normalization must preserve provenance.

Normalization must preserve validation status.

Normalization must not create authority silently.

### Validation

Validation is the structured check of external input against the adapter contract.

Validation may produce pass, limited, blocked, rejected or non-completed states.

Validation does not imply production readiness.

Validation does not imply legal certification.

### Adapter evidence

Adapter evidence is the record produced to document ingestion, normalization, validation and routing of external material.

Adapter evidence must align with P004.

Adapter evidence must include hash and audit references.

### Canonical input

Canonical input is the HBCE-compatible representation produced by the adapter.

Canonical input may be used by Authority Profile evaluation, Evidence Engine, API contracts and Golden Demo fixtures.

Canonical input is not authority by itself.

## 6. Non-equivalence rules

The following equivalence shortcuts are forbidden:

Business Wallet Adapter = European Business Wallet

Business Wallet Adapter = EUDI Wallet

Business Wallet Adapter = Identity Provider

Business Wallet Adapter = Certification Authority

Business Wallet Adapter = eIDAS Qualified Trust Service Provider

Business Wallet Adapter = regulated KYC provider

Business Wallet Adapter = regulated AML provider

Credential normalization = Credential issuance

Credential validation = Legal certification

Wallet-like input = Authority

Wallet-like input = Authorization

Wallet-like input = Execution permission

External issuer reference = HBCE issuer role

External trust material = Accepted evidence

External recognition = Authority

External capability = Authority

External role = Authority

External mandate-like material = Valid mandate without evaluation

Adapter PASS = Production readiness

Adapter PASS = OPC ALLOW

Adapter evidence = Legal certification

## 7. Adapter responsibilities

The Business Wallet Adapter is responsible for:

- receiving external material
- classifying input type
- preserving raw input reference
- assigning adapter request id
- assigning source material references
- validating minimum required fields
- detecting unsupported material
- normalizing supported material
- preserving provenance
- preserving disclosure boundaries
- preparing canonical input
- producing validation outcome
- producing evidence reference
- producing audit reference
- producing hashes
- routing canonical input to downstream evaluation
- rejecting or blocking invalid material
- failing closed on unknown mandatory states

The adapter is not responsible for:

- issuing credentials
- issuing wallets
- identifying subjects as a legal identity provider
- certifying legal identity
- certifying mandate validity as a legal authority
- authorizing actions
- executing actions
- producing final decisions
- updating MATRIX
- claiming eIDAS qualification
- claiming regulated KYC or AML provider status

## 8. Adapter canonical fields

An adapter record must include:

- adapter_record_id
- adapter_record_version
- adapter_record_status
- adapter_request_id
- external_material_type
- external_material_ref
- external_material_hash
- source_system_ref
- source_system_type
- received_at
- normalized_at
- validation_state
- normalization_state
- supported_profile
- unsupported_reasons
- subject_ref
- organization_ref
- representative_ref
- mandate_like_refs
- credential_like_refs
- capability_like_refs
- role_like_refs
- recognition_refs
- disclosure_profile
- data_minimization_profile
- canonical_input_ref
- canonical_input_hash
- evidence_refs
- audit_ref
- downstream_target
- downstream_authority_profile_candidate_ref
- human_acceptance_state
- boundary_flags

No adapter record is valid without:

- adapter_record_id
- adapter_request_id
- external_material_type
- external_material_ref
- external_material_hash
- source_system_ref
- validation_state
- normalization_state
- evidence_refs
- audit_ref
- boundary_flags

## 9. Adapter status values

Allowed adapter record status values:

- DRAFT
- RECEIVED
- CLASSIFIED
- NORMALIZED
- VALIDATED_DOCUMENTARY
- ACCEPTED_WITH_LIMITATIONS
- BLOCKED
- REJECTED
- ROUTED
- ARCHIVED
- NON_COMPLETED

Default status:

DRAFT

No adapter status authorizes production deployment.

No adapter status authorizes regulated operation.

No adapter status authorizes OPC ALLOW.

No adapter status creates authority.

No adapter status creates authorization.

## 10. External material types

Allowed external_material_type values:

- business_wallet_like
- eudi_wallet_like
- verifiable_credential_like
- sd_jwt_like
- mdoc_like
- organization_record_like
- mandate_record_like
- representation_record_like
- capability_record_like
- role_record_like
- procurement_record_like
- banking_review_record_like
- manual_documentary_record
- unknown
- unsupported

Unknown material must be blocked or rejected.

Unsupported material must be blocked or rejected.

Unknown material must not be normalized silently.

Unsupported material must not be routed to Authority Profile as valid input.

## 11. Source system types

Allowed source_system_type values:

- external_wallet_like_system
- external_credential_like_system
- internal_documentary_source
- organization_source
- procurement_source
- banking_review_source
- manual_review_source
- test_fixture
- unknown
- unsupported

Unknown source system type must not produce accepted output.

Unsupported source system type must not produce accepted output.

## 12. Validation states

Allowed validation_state values:

- NOT_VALIDATED
- PASS_DOCUMENTARY
- PASS_WITH_LIMITATIONS
- BLOCKED_UNSUPPORTED_TYPE
- BLOCKED_MISSING_REQUIRED_FIELD
- BLOCKED_HASH_MISSING
- BLOCKED_HASH_MISMATCH
- BLOCKED_PROVENANCE_MISSING
- BLOCKED_DISCLOSURE_OVERREACH
- BLOCKED_POLICY_UNKNOWN
- REJECTED_INVALID_FORMAT
- REJECTED_INVALID_SOURCE
- REJECTED_REVOKED_SOURCE
- NON_COMPLETED

Default validation state:

NOT_VALIDATED

Unknown mandatory state fails closed.

Missing required field blocks.

Missing provenance blocks.

Missing hash blocks.

Disclosure overreach blocks.

Revoked source rejects.

Invalid source rejects.

## 13. Normalization states

Allowed normalization_state values:

- NOT_NORMALIZED
- NORMALIZED_DOCUMENTARY
- NORMALIZED_WITH_LIMITATIONS
- NORMALIZATION_BLOCKED
- NORMALIZATION_REJECTED
- NON_COMPLETED

Default normalization state:

NOT_NORMALIZED

Normalization requires classification.

Normalization requires provenance.

Normalization requires input hash.

Normalization requires validation outcome.

Normalization must not erase unsupported states.

Normalization must not convert invalid input into valid authority.

## 14. Human acceptance states

Allowed human acceptance states:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Default human acceptance state:

PENDING

Adapter output with human_acceptance_state PENDING remains NON_COMPLETED for Release Candidate completion.

Human acceptance does not override missing provenance.

Human acceptance does not override missing evidence.

Human acceptance does not override hash mismatch.

Human acceptance does not override policy denial.

Human acceptance does not authorize production deployment.

## 15. Mandatory boundary flags inside every adapter record

Every adapter record must explicitly include:

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

If any boundary flag is missing, the adapter record is NON_COMPLETED.

If any boundary flag is true, the adapter record is BLOCKED unless separately approved by a future explicit document.

No such approval exists in this contract.

## 16. Minimum adapter schema

The minimum adapter structure is:

adapter_record_id:
  type: string
  required: true

adapter_record_version:
  type: string
  required: true

adapter_record_status:
  type: enum
  required: true
  allowed:
    - DRAFT
    - RECEIVED
    - CLASSIFIED
    - NORMALIZED
    - VALIDATED_DOCUMENTARY
    - ACCEPTED_WITH_LIMITATIONS
    - BLOCKED
    - REJECTED
    - ROUTED
    - ARCHIVED
    - NON_COMPLETED

adapter_request_id:
  type: string
  required: true

external_material_type:
  type: enum
  required: true

external_material_ref:
  type: string
  required: true

external_material_hash:
  type: string
  required: true

source_system_ref:
  type: string
  required: true

source_system_type:
  type: enum
  required: true

received_at:
  type: string
  required: true

normalized_at:
  type: string
  required: false

validation_state:
  type: enum
  required: true

normalization_state:
  type: enum
  required: true

supported_profile:
  type: string
  required: false

unsupported_reasons:
  type: array
  required: false

subject_ref:
  type: string
  required: false

organization_ref:
  type: string
  required: false

representative_ref:
  type: string
  required: false

mandate_like_refs:
  type: array
  required: false

credential_like_refs:
  type: array
  required: false

capability_like_refs:
  type: array
  required: false

role_like_refs:
  type: array
  required: false

recognition_refs:
  type: array
  required: false

disclosure_profile:
  type: object
  required: true

data_minimization_profile:
  type: object
  required: true

canonical_input_ref:
  type: string
  required: false

canonical_input_hash:
  type: string
  required: false

evidence_refs:
  type: array
  required: true
  min_items: 1

audit_ref:
  type: string
  required: true

downstream_target:
  type: enum
  required: false
  allowed:
    - authority_profile_candidate
    - canonical_evidence_model
    - evidence_engine
    - manual_review
    - blocked
    - rejected

downstream_authority_profile_candidate_ref:
  type: string
  required: false

human_acceptance_state:
  type: enum
  required: true

boundary_flags:
  type: object
  required: true

## 17. Ingestion requirements

Ingestion must:

- assign adapter_request_id
- preserve external_material_ref
- compute or reference external_material_hash
- identify source_system_ref
- classify source_system_type
- record received_at
- create evidence reference
- create audit reference
- preserve boundary flags

Ingestion must not:

- infer authority
- infer authorization
- infer execution permission
- discard unsupported fields silently
- discard provenance
- accept unknown material as valid
- route directly to execution
- update MATRIX

## 18. Classification requirements

Classification must identify:

- material type
- source system type
- supported profile
- unsupported reasons when applicable
- expected canonical fields
- minimum required fields
- disclosure category
- downstream target

Classification output must be evidence-linked.

Classification output must be auditable.

Classification output must fail closed for unknown mandatory states.

## 19. Validation requirements

Validation must check:

- adapter_request_id exists
- external_material_ref exists
- external_material_hash exists
- source_system_ref exists
- source_system_type is supported
- external_material_type is supported
- provenance exists
- disclosure profile exists
- data minimization profile exists
- required fields exist for material type
- unsupported material is blocked or rejected
- revoked material is rejected
- hash mismatch is blocked
- policy unknown state is blocked or denied
- boundary flags are false

Validation must not:

- grant authority
- grant authorization
- mark evidence as legally certified
- mark system as production ready
- mark OPC ALLOW

## 20. Normalization requirements

Normalization must produce canonical input with:

- canonical_input_ref
- canonical_input_hash
- source material references
- subject references when available
- organization references when available
- representative references when available
- mandate-like references when available
- credential-like references when available
- capability-like references when available
- role-like references when available
- recognition references when available
- disclosure profile
- data minimization profile
- evidence references
- audit reference
- validation state
- normalization state

Normalization must preserve unsupported reason codes.

Normalization must preserve limitations.

Normalization must not elevate raw claims into authority.

Normalization must not create authorization.

## 21. Provenance requirements

Every adapter record must preserve provenance.

Provenance must include:

- external_material_ref
- source_system_ref
- source_system_type
- received_at
- source_material_refs
- external_material_hash
- canonical_input_hash when normalized
- audit_ref

Missing provenance blocks the record.

Unverifiable provenance produces ACCEPTED_WITH_LIMITATIONS or BLOCKED depending on downstream use.

Provenance does not imply truth.

Provenance supports traceability.

## 22. Disclosure and minimization requirements

The adapter must record:

- disclosed fields
- withheld fields when known
- purpose context
- downstream purpose
- minimum disclosure assessment
- over-disclosure status
- disclosure limitations

Over-disclosure must be blocked or flagged.

Disclosure must not be treated as authorization.

Disclosure must not be treated as authority.

Disclosure must not be used to bypass Authority Profile.

## 23. Evidence binding

Adapter output must bind to evidence.

Evidence references must include:

- evidence_id
- evidence_type
- evidence_lifecycle_state
- evidence_hash
- evidence_registry_ref
- audit_ref

Adapter evidence must align with P004.

Evidence without hash is NON_COMPLETED.

Evidence without lifecycle state is NON_COMPLETED.

Evidence without audit reference is NON_COMPLETED.

Evidence marked REJECTED cannot support adapter acceptance.

Evidence marked REVOKED cannot support adapter acceptance.

Evidence marked BLOCKED cannot support adapter acceptance.

Evidence marked ACCEPTED_WITH_LIMITATIONS can support routing only inside its limitation boundary.

## 24. Audit binding

Adapter evaluation must produce or reference an audit record.

Audit record must include:

- audit_ref
- adapter_request_id
- adapter_record_id
- received_at
- normalized_at when available
- source material hash
- canonical input hash when available
- validation trace
- normalization trace
- negative control status
- boundary flags
- human acceptance state

A record without audit_ref remains NON_COMPLETED.

Audit does not imply production readiness.

Audit does not imply legal certification.

Audit does not imply OPC ALLOW.

## 25. Hash requirements

The following hashes are required:

- external_material_hash
- canonical_input_hash when normalized
- evidence_hash for every evidence reference
- source material hash or documented source material hash placeholder

A record without external_material_hash is NON_COMPLETED.

A normalized record without canonical_input_hash is NON_COMPLETED.

Hash mismatch must block the record.

Hash presence does not imply truth.

Hash presence only supports integrity and reproducibility.

## 26. Authority Profile relationship

The adapter may create an Authority Profile candidate input.

The adapter cannot create accepted authority.

The adapter cannot approve authority.

The adapter cannot authorize execution.

The adapter can provide:

- subject_ref
- organization_ref
- representative_ref
- mandate_like_refs
- recognition_refs
- capability_like_refs
- role_like_refs
- source_material_refs
- evidence_refs
- audit_ref

Authority Profile must still evaluate:

- mandate
- recognized_by
- scope
- constraints
- temporal bounds
- policy_refs
- evidence_refs
- hashes
- audit_ref
- boundary flags

Adapter PASS does not equal Authority Profile PASS.

Adapter ROUTED does not equal authority accepted.

## 27. Canonical adapter algorithm

The Business Wallet Adapter algorithm must follow this order:

1. Receive external material.
2. Assign adapter_request_id.
3. Preserve external_material_ref.
4. Compute or reference external_material_hash.
5. Identify source_system_ref.
6. Classify external_material_type.
7. Classify source_system_type.
8. Check boundary flags.
9. Check provenance.
10. Check disclosure profile.
11. Check data minimization profile.
12. Validate required fields.
13. Detect unsupported material.
14. Detect revoked or rejected material when known.
15. Normalize supported material.
16. Produce canonical_input_ref when normalized.
17. Produce canonical_input_hash when normalized.
18. Produce evidence reference.
19. Produce audit reference.
20. Produce validation_state.
21. Produce normalization_state.
22. Determine downstream_target.
23. Route only if allowed.
24. Preserve human_acceptance_state.

No step may be skipped silently.

Any unknown mandatory state fails closed.

Any missing mandatory field produces NON_COMPLETED, BLOCKED or REJECTED state.

## 28. Positive adapter path

A positive documentary adapter path requires:

- adapter_request_id present
- external_material_ref present
- external_material_hash present
- source_system_ref present
- supported external_material_type
- supported source_system_type
- provenance present
- disclosure profile present
- data minimization profile present
- validation state PASS_DOCUMENTARY or PASS_WITH_LIMITATIONS
- normalization state NORMALIZED_DOCUMENTARY or NORMALIZED_WITH_LIMITATIONS
- evidence_refs present
- audit_ref present
- boundary flags false
- human acceptance state recorded

Positive adapter result:

VALIDATED_DOCUMENTARY or ACCEPTED_WITH_LIMITATIONS

Positive adapter evaluation does not authorize production deployment.

Positive adapter evaluation does not create Authority Profile PASS.

Positive adapter evaluation does not create final action authorization.

Positive adapter evaluation does not authorize execution.

## 29. Negative adapter paths

The following negative paths must be supported:

- missing adapter request id
- missing external material reference
- missing external material hash
- hash mismatch
- missing source system reference
- unknown source system type
- unsupported source system type
- unknown external material type
- unsupported external material type
- invalid input format
- missing provenance
- revoked source material
- missing disclosure profile
- over-disclosure
- missing data minimization profile
- missing evidence
- rejected evidence
- revoked evidence
- missing audit
- policy unknown
- boundary flag violation
- human acceptance pending
- wallet-provider claim
- issuer claim
- certification authority claim
- identity provider claim
- eIDAS qualification claim
- regulated KYC or AML provider claim

Each negative path must produce evidence.

Each negative path must be auditable.

Each negative path must not create authority.

Each negative path must not authorize execution.

## 30. Required tests

### HBCE-BWA-TST-001 - Valid business-wallet-like input

Expected result:

A supported business-wallet-like input normalizes into canonical input and produces evidence and audit references.

### HBCE-BWA-TST-002 - Missing external material hash

Expected result:

Adapter returns BLOCKED_HASH_MISSING or NON_COMPLETED.

### HBCE-BWA-TST-003 - Hash mismatch

Expected result:

Adapter returns BLOCKED_HASH_MISMATCH.

### HBCE-BWA-TST-004 - Missing provenance

Expected result:

Adapter returns BLOCKED_PROVENANCE_MISSING.

### HBCE-BWA-TST-005 - Unsupported material type

Expected result:

Adapter returns BLOCKED_UNSUPPORTED_TYPE or REJECTED_INVALID_FORMAT.

### HBCE-BWA-TST-006 - Unknown source system

Expected result:

Adapter blocks or rejects the input.

### HBCE-BWA-TST-007 - Revoked source material

Expected result:

Adapter returns REJECTED_REVOKED_SOURCE.

### HBCE-BWA-TST-008 - Over-disclosure

Expected result:

Adapter returns BLOCKED_DISCLOSURE_OVERREACH.

### HBCE-BWA-TST-009 - Missing evidence

Expected result:

Adapter remains NON_COMPLETED.

### HBCE-BWA-TST-010 - Missing audit

Expected result:

Adapter remains NON_COMPLETED.

### HBCE-BWA-TST-011 - Wallet-provider claim

Expected result:

Adapter rejects or blocks any claim that HBCE is a wallet provider.

### HBCE-BWA-TST-012 - Credential issuer claim

Expected result:

Adapter rejects or blocks any claim that HBCE issues credentials.

### HBCE-BWA-TST-013 - Identity provider claim

Expected result:

Adapter rejects or blocks any claim that HBCE is an identity provider.

### HBCE-BWA-TST-014 - eIDAS qualification claim

Expected result:

Adapter rejects or blocks any eIDAS qualification claim.

### HBCE-BWA-TST-015 - Regulated KYC or AML provider claim

Expected result:

Adapter rejects or blocks any regulated KYC or AML provider claim.

### HBCE-BWA-TST-016 - Adapter PASS is not authority PASS

Expected result:

Adapter PASS can route to Authority Profile candidate but cannot create accepted authority.

### HBCE-BWA-TST-017 - Adapter PASS is not authorization

Expected result:

Adapter PASS cannot authorize execution.

### HBCE-BWA-TST-018 - Boundary flag violation

Expected result:

Adapter returns blocked state.

### HBCE-BWA-TST-019 - Human acceptance pending

Expected result:

Adapter output can be prepared but remains NON_COMPLETED for Release Candidate completion.

## 31. Required evidence artifacts

The following evidence artifacts must be produced or planned:

- HBCE-EVD-BWA-001-VALID-BUSINESS-WALLET-LIKE-INPUT
- HBCE-EVD-BWA-002-MISSING-EXTERNAL-MATERIAL-HASH
- HBCE-EVD-BWA-003-HASH-MISMATCH
- HBCE-EVD-BWA-004-MISSING-PROVENANCE
- HBCE-EVD-BWA-005-UNSUPPORTED-MATERIAL-TYPE
- HBCE-EVD-BWA-006-UNKNOWN-SOURCE-SYSTEM
- HBCE-EVD-BWA-007-REVOKED-SOURCE-MATERIAL
- HBCE-EVD-BWA-008-OVER-DISCLOSURE
- HBCE-EVD-BWA-009-MISSING-EVIDENCE
- HBCE-EVD-BWA-010-MISSING-AUDIT
- HBCE-EVD-BWA-011-WALLET-PROVIDER-CLAIM-BLOCKED
- HBCE-EVD-BWA-012-CREDENTIAL-ISSUER-CLAIM-BLOCKED
- HBCE-EVD-BWA-013-IDENTITY-PROVIDER-CLAIM-BLOCKED
- HBCE-EVD-BWA-014-EIDAS-QUALIFICATION-CLAIM-BLOCKED
- HBCE-EVD-BWA-015-REGULATED-KYC-AML-CLAIM-BLOCKED
- HBCE-EVD-BWA-016-ADAPTER-PASS-NOT-AUTHORITY-PASS
- HBCE-EVD-BWA-017-ADAPTER-PASS-NOT-AUTHORIZATION
- HBCE-EVD-BWA-018-BOUNDARY-FLAG-VIOLATION
- HBCE-EVD-BWA-019-HUMAN-ACCEPTANCE-PENDING

Evidence artifacts must be compatible with P004.

Evidence artifacts must include hash references.

Evidence artifacts must include audit references.

Evidence artifacts must include boundary flags.

## 32. /business-wallet API minimum contract

The /business-wallet API family must support the following conceptual operations:

- receive external material
- classify external material
- validate external material
- normalize external material
- retrieve adapter record
- retrieve validation trace
- retrieve normalization trace
- retrieve evidence reference
- retrieve audit reference
- route canonical input to Authority Profile candidate when allowed

This document does not implement the API.

This document defines minimum API obligations for the future public API contract.

## 33. /business-wallet request minimum fields

A /business-wallet request must include:

- request_id
- external_material_type
- external_material_ref
- external_material_hash
- source_system_ref
- source_system_type
- purpose_context
- disclosure_profile
- data_minimization_profile
- policy_refs
- evidence_refs when available
- boundary_flags

Missing request_id blocks the request.

Missing external_material_ref blocks the request.

Missing external_material_hash blocks the request.

Missing source_system_ref blocks the request.

Missing source_system_type blocks the request.

Missing disclosure_profile blocks the request.

Missing data_minimization_profile blocks the request.

Missing boundary_flags blocks the request.

## 34. /business-wallet response minimum fields

A /business-wallet response must include:

- request_id
- adapter_record_id
- adapter_record_status
- validation_state
- normalization_state
- external_material_type
- source_system_type
- canonical_input_ref when normalized
- canonical_input_hash when normalized
- evidence_refs
- audit_ref
- downstream_target
- human_acceptance_state
- boundary_flags

A response without validation_state is invalid.

A response without evidence_refs is NON_COMPLETED.

A response without audit_ref is NON_COMPLETED.

A response with downstream_target authority_profile_candidate does not mean authority accepted.

## 35. Error model

Allowed adapter error classes:

- BWA_REQUEST_INVALID
- BWA_EXTERNAL_MATERIAL_REF_MISSING
- BWA_EXTERNAL_MATERIAL_HASH_MISSING
- BWA_EXTERNAL_MATERIAL_HASH_MISMATCH
- BWA_SOURCE_SYSTEM_REF_MISSING
- BWA_SOURCE_SYSTEM_TYPE_UNKNOWN
- BWA_SOURCE_SYSTEM_TYPE_UNSUPPORTED
- BWA_EXTERNAL_MATERIAL_TYPE_UNKNOWN
- BWA_EXTERNAL_MATERIAL_TYPE_UNSUPPORTED
- BWA_PROVENANCE_MISSING
- BWA_DISCLOSURE_PROFILE_MISSING
- BWA_DISCLOSURE_OVERREACH
- BWA_DATA_MINIMIZATION_PROFILE_MISSING
- BWA_POLICY_MISSING
- BWA_POLICY_UNKNOWN
- BWA_EVIDENCE_MISSING
- BWA_EVIDENCE_REJECTED
- BWA_EVIDENCE_REVOKED
- BWA_AUDIT_MISSING
- BWA_WALLET_PROVIDER_CLAIM_BLOCKED
- BWA_CREDENTIAL_ISSUER_CLAIM_BLOCKED
- BWA_IDENTITY_PROVIDER_CLAIM_BLOCKED
- BWA_CERTIFICATION_AUTHORITY_CLAIM_BLOCKED
- BWA_EIDAS_QUALIFICATION_CLAIM_BLOCKED
- BWA_REGULATED_KYC_AML_CLAIM_BLOCKED
- BWA_BOUNDARY_BLOCKED
- BWA_HUMAN_ACCEPTANCE_PENDING
- BWA_NON_COMPLETED

Error responses must be evidence-linked.

Error responses must be auditable.

Error responses must not create authority.

Error responses must not authorize execution.

## 36. Golden Demo adapter obligations

Golden Demo must demonstrate:

- valid business-wallet-like input ingestion
- canonical input creation
- adapter evidence creation
- adapter audit creation
- routing to Authority Profile candidate
- missing hash block
- missing provenance block
- unsupported material block
- over-disclosure block
- wallet-provider claim block
- issuer claim block
- adapter PASS not equal to authority PASS
- adapter PASS not equal to authorization
- no MATRIX update from adapter alone

Golden Demo adapter output must feed Authority Profile only as candidate input.

Golden Demo must not bypass Authority Profile.

Golden Demo must not bypass Authorization Engine.

Golden Demo must not update MATRIX from adapter alone.

## 37. Banking Evidence Pack relationship

The Banking Evidence Pack may include Business Wallet Adapter evidence.

The Banking Evidence Pack may use adapter outputs to demonstrate ingestion, normalization, validation, evidence and audit traceability.

The Banking Evidence Pack does not transform adapter validation into banking certification.

The Banking Evidence Pack does not transform HBCE into a regulated KYC or AML provider.

The Banking Evidence Pack does not authorize production deployment.

## 38. Completion rule

The Business Wallet Adapter Contract remains PREPARED_FOR_REVIEW until:

- human review is completed
- requirement matrix references are confirmed
- Authority Profile relationship is confirmed
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

## 39. Immediate next derivations

This document requires the following future derivations:

1. Business Wallet Adapter schema
2. Business Wallet Adapter validation test plan
3. Business Wallet Adapter negative controls fixture set
4. /business-wallet API contract section
5. Golden Demo adapter scenario
6. Adapter evidence record examples
7. Adapter audit checklist
8. Canonical input mapping table

Recommended next repository document:

HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md

Reason:

Business Wallet Adapter output must normalize into canonical evidence-compatible structures before downstream authority and decision flows can be completed coherently.

## 40. Operational meaning

This document defines the external material ingestion boundary for HBCE.

It separates external trust material from HBCE authority.

It separates normalization from issuance.

It separates validation from legal certification.

It separates adapter pass from authority pass.

It separates adapter pass from authorization.

It prevents external wallet-like material from becoming authority silently.

It preserves P004 as the evidence governance baseline.

It preserves the V3 contract as the program-level contract.

It preserves the 2027 matrix as the requirement-to-test-to-evidence control layer.

It preserves the Authority Profile Contract as the authority evaluation boundary.

It does not implement runtime behavior.

It does not authorize production deployment.

It does not authorize deployment readiness.

It does not authorize L3 readiness.

It does not authorize PostgreSQL runtime readiness or execution.

It does not authorize P04/P05 concurrency execution.

It does not authorize OPC ALLOW.

It does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 41. Document state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
