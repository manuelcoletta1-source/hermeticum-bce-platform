# MAIN POST HBCE BUSINESS WALLET ADAPTER CONTRACT CHECKPOINT - 2026-09-21

## Status

Checkpoint prepared after integration of PR #18.

Integrated pull request:

- PR: #18
- Title: docs(hbce): add business wallet adapter contract
- Branch: hbce/business-wallet-adapter-contract
- Integrated file: HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md

Observed main state:

- MAIN_HEAD: e69c127 Merge pull request #18 from manuelcoletta1-source/hbce/business-wallet-adapter-contract
- Integrated document commit: d1ee664 docs(hbce): add business wallet adapter contract
- Previous main baseline: 08398a1 docs(main): record post HBCE authority profile checkpoint

## Integrated artifact

HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md defines the HBCE Business Wallet Adapter Contract.

It is the external material ingestion, normalization, validation and evidence-preparation boundary for HBCE.

The contract is derived from:

- HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
- HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
- HBCE_AUTHORITY_PROFILE_CONTRACT.md
- P004 documentary evidence chain

## Operational purpose

The Business Wallet Adapter Contract defines how HBCE can receive, normalize, validate and prepare evidence for external business-wallet-like material without becoming a wallet, issuer, identity provider, certification authority, eIDAS qualified trust service provider or regulated KYC/AML provider.

The adapter is an input boundary.

The adapter is not an authority engine.

The adapter is not an authorization engine.

The adapter is not an execution engine.

The adapter does not update MATRIX directly.

## Core rule

The contract prevents external material from becoming authority silently.

Forbidden equivalence shortcuts include:

- Business Wallet Adapter = European Business Wallet
- Business Wallet Adapter = EUDI Wallet
- Business Wallet Adapter = Identity Provider
- Business Wallet Adapter = Certification Authority
- Business Wallet Adapter = eIDAS Qualified Trust Service Provider
- Business Wallet Adapter = regulated KYC provider
- Business Wallet Adapter = regulated AML provider
- Credential normalization = Credential issuance
- Credential validation = Legal certification
- Wallet-like input = Authority
- Wallet-like input = Authorization
- Wallet-like input = Execution permission
- External issuer reference = HBCE issuer role
- External trust material = Accepted evidence
- External recognition = Authority
- External capability = Authority
- External role = Authority
- Adapter PASS = Production readiness
- Adapter PASS = OPC ALLOW
- Adapter evidence = Legal certification

## Business Wallet Adapter contents

The contract defines:

- Business Wallet Adapter purpose
- position in the HBCE canonical chain
- source requirement mapping
- boundary preservation
- external trust material definition
- business-wallet-like material definition
- EUDI-wallet-like material definition
- credential-like material definition
- adapter responsibilities
- non-equivalence rules
- adapter canonical fields
- adapter status values
- external material types
- source system types
- validation states
- normalization states
- human acceptance states
- mandatory boundary flags
- minimum adapter schema
- ingestion requirements
- classification requirements
- validation requirements
- normalization requirements
- provenance requirements
- disclosure and minimization requirements
- evidence binding
- audit binding
- hash requirements
- Authority Profile relationship
- canonical adapter algorithm
- positive adapter path
- negative adapter paths
- required tests
- required evidence artifacts
- /business-wallet API minimum contract
- /business-wallet request minimum fields
- /business-wallet response minimum fields
- error model
- Golden Demo adapter obligations
- Banking Evidence Pack relationship
- completion rule
- immediate next derivations

## Required test family

The contract defines the initial Business Wallet Adapter test family:

- valid business-wallet-like input
- missing external material hash
- hash mismatch
- missing provenance
- unsupported material type
- unknown source system
- revoked source material
- over-disclosure
- missing evidence
- missing audit
- wallet-provider claim
- credential issuer claim
- identity provider claim
- eIDAS qualification claim
- regulated KYC or AML provider claim
- adapter PASS is not authority PASS
- adapter PASS is not authorization
- boundary flag violation
- human acceptance pending

## P004 relationship

P004 remains the evidence governance baseline.

Business Wallet Adapter evidence must be compatible with P004.

Adapter evidence artifacts must include:

- evidence references
- hash references
- audit references
- boundary flags
- lifecycle state

## Authority Profile relationship

The adapter may produce Authority Profile candidate input.

The adapter cannot create accepted authority.

The adapter cannot approve authority.

The adapter cannot authorize execution.

Adapter PASS does not equal Authority Profile PASS.

Adapter ROUTED does not equal accepted authority.

## Matrix relationship

The contract derives from the HBCE 2027 Requirement to Test to Evidence Matrix.

Relevant requirement families include:

- external system non-replacement
- canonical chain enforcement
- identity is not authorization
- no authority without mandate
- no execution without authority
- evidence immutability
- WP-EBW adapter contract
- WP-EBW non-wallet boundary
- WP-VC canonical credential model
- WP-VC non-issuer boundary
- WP-TRUST recognized_by model
- capability is not authority
- WP-PRIVACY minimum disclosure
- disclosure is not authorization
- /business-wallet API contract
- Golden Demo positive path

## Immediate next document

The contract identifies the recommended next repository document as:

HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md

Reason:

Business Wallet Adapter output must normalize into canonical evidence-compatible structures before downstream authority and decision flows can be completed coherently.

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
- main fast-forwarded to e69c127
- HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md exists on main
- line count: 1502
- source requirements section present
- non-equivalence rules section present
- adapter canonical fields section present
- minimum adapter schema section present
- Authority Profile relationship section present
- canonical adapter algorithm section present
- required tests section present
- operational meaning section present
- production deployment boundary present
- working tree clean

## Operational meaning

The repository now has:

- P004 evidence governance baseline
- HBCE Program Realignment V3 Technical Implementation Contract
- HBCE 2027 Requirement to Test to Evidence to Audit Matrix
- HBCE Authority Profile Contract
- HBCE Business Wallet Adapter Contract

The external-material ingestion boundary is now documented at contract level.

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
