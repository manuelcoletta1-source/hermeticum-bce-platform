# MAIN POST HBCE AUTHORITY PROFILE CONTRACT CHECKPOINT - 2026-09-21

## Status

Checkpoint prepared after integration of PR #17.

Integrated pull request:

- PR: #17
- Title: docs(hbce): add authority profile contract
- Branch: hbce/authority-profile-contract
- Integrated file: HBCE_AUTHORITY_PROFILE_CONTRACT.md

Observed main state:

- MAIN_HEAD: 420946a Merge pull request #17 from manuelcoletta1-source/hbce/authority-profile-contract
- Integrated document commit: 5e4a5a1 docs(hbce): add authority profile contract
- Previous main baseline: 6166f2e docs(main): record post HBCE 2027 requirement matrix checkpoint

## Integrated artifact

HBCE_AUTHORITY_PROFILE_CONTRACT.md defines the HBCE Authority Profile Contract.

It is the first operational authority boundary derived from:

- HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
- HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
- P004 documentary evidence chain

## Operational purpose

The Authority Profile Contract defines authority as a bounded, evidence-linked, policy-bound, hashable and auditable object.

It separates:

- identity
- role
- capability
- recognition
- mandate
- authority
- authorization
- execution
- evidence
- consequence
- MATRIX

## Core rule

The contract prevents silent authority inference.

Forbidden equivalence shortcuts include:

- Identity = Authority
- Role = Authority
- Capability = Authority
- Recognition = Authority
- Authority = Authorization
- Authorization = Execution
- Evidence = Legal Certification
- Health PASS = Production Readiness
- Procurement Readiness = Production Readiness
- Banking Evidence Pack = Banking Certification
- Business Wallet Adapter = European Business Wallet
- Credential Normalization = Credential Issuance

## Authority Profile contents

The contract defines:

- Authority Profile purpose
- position in the HBCE canonical chain
- source requirement mapping
- boundary preservation
- subject, identity, mandate, recognition, capability, role, authority, authorization, decision and evidence definitions
- non-equivalence rules
- canonical fields
- status values
- evaluation states
- minimum schema
- mandatory boundary flags
- mandate requirements
- recognition requirements
- capability handling
- role handling
- authority scope
- constraint model
- temporal bounds
- policy binding
- evidence binding
- audit binding
- hash requirements
- external material normalization
- Business Wallet Adapter relationship
- canonical evaluation algorithm
- positive evaluation path
- negative evaluation paths
- required tests
- required evidence artifacts
- /authority API minimum contract
- /authority request minimum fields
- /authority response minimum fields
- error model
- Golden Demo authority obligations
- Banking Evidence Pack relationship
- completion rule
- immediate next derivations

## Required test family

The contract defines the initial Authority Profile test family:

- valid documentary authority profile
- missing mandate
- identity-only claim
- role-only claim
- capability-only claim
- missing recognition
- scope mismatch
- constraint mismatch
- unknown policy
- missing evidence
- rejected evidence
- revoked evidence
- hash mismatch
- boundary flag violation
- human acceptance pending

## P004 relationship

P004 remains the evidence governance baseline.

Authority Profile evidence must be compatible with P004.

Authority evidence artifacts must include:

- evidence references
- hash references
- audit references
- boundary flags
- lifecycle state

## Matrix relationship

The contract derives from the HBCE 2027 Requirement to Test to Evidence Matrix.

Relevant requirement families include:

- canonical chain enforcement
- identity is not authorization
- no authority without mandate
- bounded authorization
- policy fail-closed
- no execution without authority
- evidence immutability
- MATRIX consequence requires evidence
- human acceptance required
- WP-TRUST recognized_by model
- capability is not authority
- /authority API contract
- Golden Demo authority negative controls

## Immediate next document

The contract identifies the recommended next repository document as:

HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md

Reason:

The Business Wallet Adapter provides one of the external input paths that must normalize into Authority Profile evaluation without becoming authority automatically.

## Boundary preservation

This checkpoint preserves the following boundaries:

- production_deployment: false
- production_readiness: false
- deployment_readiness: false
- l3_promotion: false
- l3_readiness: false
- postgresql_runtime_readiness: false
- postgresql_runtime_execution: false
- p04_p05_concurrency_execution: false
- opc_allow: false
- legal_certification: false
- eidas_qualification: false
- regulated_kyc_aml_provider_status: false

## Verification basis

Local verification after merge confirmed:

- main pulled from origin/main
- main fast-forwarded to 420946a
- HBCE_AUTHORITY_PROFILE_CONTRACT.md exists on main
- line count: 1322
- source requirements section present
- non-equivalence rules section present
- canonical fields section present
- canonical evaluation algorithm section present
- required tests section present
- operational meaning section present
- production deployment boundary present
- local feature branch deleted

## Operational meaning

The repository now has:

- P004 evidence governance baseline
- HBCE Program Realignment V3 Technical Implementation Contract
- HBCE 2027 Requirement to Test to Evidence to Audit Matrix
- HBCE Authority Profile Contract

The authority layer is now bounded at documentary contract level.

This checkpoint does not authorize production deployment.

This checkpoint does not authorize deployment readiness.

This checkpoint does not authorize L3 readiness.

This checkpoint does not authorize PostgreSQL runtime readiness or execution.

This checkpoint does not authorize P04/P05 concurrency execution.

This checkpoint does not authorize OPC ALLOW.

This checkpoint does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## Human acceptance

Human acceptance state:

PENDING

## Checkpoint state

PREPARED_FOR_COMMIT
