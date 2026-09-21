# MAIN POST HBCE CANONICAL EVIDENCE MODEL CONTRACT CHECKPOINT - 2026-09-21

## Status

Checkpoint prepared after integration of PR #19.

Integrated pull request:

- PR: #19
- Title: docs(hbce): add canonical evidence model contract
- Branch: hbce/canonical-evidence-model-contract
- Integrated file: HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md

Observed main state:

- MAIN_HEAD: 2310d85 Merge pull request #19 from manuelcoletta1-source/hbce/canonical-evidence-model-contract
- Integrated document commit: 98da0a4 docs(hbce): add canonical evidence model contract
- Previous main baseline: 05340ad docs(main): record post HBCE business wallet adapter checkpoint

## Integrated artifact

HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md defines the HBCE Canonical Evidence Model Contract.

It is the common evidence structure across adapter, authority, authorization, decision, execution, policy, audit and MATRIX-related flows.

The contract is derived from:

- HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
- HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
- HBCE_AUTHORITY_PROFILE_CONTRACT.md
- HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
- P004_RUNTIME_EVIDENCE_SCHEMA.md
- P004_EVIDENCE_ACCEPTANCE_GATE.md

## Operational purpose

The Canonical Evidence Model Contract defines how HBCE records evidence in a common, computable, lifecycle-aware, hash-bound, audit-bound and boundary-aware structure.

The model prevents each subsystem from producing incompatible evidence formats.

The model is a documentary and technical contract for future implementation.

The model is not legal certification.

The model is not authority.

The model is not authorization.

The model is not execution permission.

The model does not update MATRIX directly.

## Core rule

The contract prevents evidence from being treated as truth without validation.

Forbidden equivalence shortcuts include:

- Evidence = Truth
- Evidence = Legal Certification
- Evidence = Authority
- Evidence = Authorization
- Evidence = Execution Permission
- Evidence = Production Readiness
- Evidence = OPC ALLOW
- Hash = Truth
- Hash = Legal Validity
- Hash = Regulatory Acceptance
- Audit = Evidence Acceptance
- Audit = Legal Certification
- Source Material = Accepted Evidence
- External Credential = Accepted Evidence
- Wallet-Like Input = Accepted Evidence
- Business Wallet Adapter PASS = Accepted Evidence
- Authority Profile PASS = Evidence Acceptance
- Authorization PASS = Evidence Acceptance
- Decision PASS = Evidence Acceptance
- Execution Result = Accepted Evidence Without Validation
- Policy PASS = Production Readiness
- Human Acceptance = Legal Certification
- Human Acceptance = Boundary Override
- MATRIX Update = Evidence Acceptance
- Evidence Acceptance = Production Deployment
- Evidence Acceptance = L3 Readiness
- Evidence Acceptance = eIDAS Qualification
- Evidence Acceptance = Regulated KYC or AML Provider Status

## Canonical Evidence Model contents

The contract defines:

- canonical evidence purpose
- position across the HBCE canonical chain
- source requirement mapping
- boundary preservation
- evidence definitions
- non-equivalence rules
- canonical evidence responsibilities
- canonical evidence fields
- evidence type values
- evidence lifecycle states
- evidence acceptance states
- evidence source types
- canonicalization methods
- hash requirements
- audit requirements
- boundary flags
- human acceptance states
- minimum canonical evidence schema
- evidence validation rules
- lifecycle consistency rules
- evidence acceptance algorithm
- positive evidence path
- negative evidence paths
- adapter evidence mapping
- Authority Profile evidence mapping
- authorization evidence mapping
- decision evidence mapping
- execution evidence mapping
- MATRIX consequence evidence mapping
- policy evaluation evidence mapping
- required tests
- required evidence artifacts
- /evidence API minimum contract
- /evidence request minimum fields
- /evidence response minimum fields
- error model
- Golden Demo evidence obligations
- P004 relationship
- Business Wallet Adapter relationship
- Authority Profile relationship
- Authorization relationship
- Execution relationship
- MATRIX relationship
- completion rule
- immediate next derivations

## Required test family

The contract defines the initial Canonical Evidence Model test family:

- valid accepted evidence
- missing evidence id
- unsupported evidence type
- missing payload hash
- payload hash mismatch
- missing canonical evidence hash
- canonical evidence hash mismatch
- missing schema reference
- missing audit reference
- boundary flag violation
- human acceptance pending
- rejected evidence supports nothing
- revoked evidence supports nothing
- accepted with limitations enforces scope
- adapter PASS is not evidence acceptance
- authority PASS is not evidence acceptance
- authorization PASS is evidence-bound
- execution without evidence is non-completed
- MATRIX update requires accepted evidence
- policy UNKNOWN fails closed

## P004 relationship

P004 remains the evidence governance baseline.

The Canonical Evidence Model extends P004 into a cross-component contract.

P004 acceptance requirements remain binding.

P004 negative controls remain binding.

P004 documentary evidence chain remains binding.

Canonical evidence must be compatible with P004.

Canonical evidence must not weaken P004.

Canonical evidence must not bypass P004 acceptance gates.

## Business Wallet Adapter relationship

Business Wallet Adapter output must normalize into canonical evidence-compatible structures.

Adapter evidence must not be treated as accepted evidence without Canonical Evidence Model validation.

Adapter evidence must preserve external source provenance.

Adapter evidence must preserve disclosure and minimization context.

Adapter evidence must preserve non-wallet and non-issuer boundary flags.

## Authority Profile relationship

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

## Authorization and execution relationship

Authorization must produce or reference canonical evidence.

Authorization PASS must not exist without evidence.

Authorization FAIL must not be discarded.

Execution must produce canonical evidence.

Execution without evidence is NON_COMPLETED.

Execution evidence does not update MATRIX by itself.

## MATRIX relationship

MATRIX consequence requires accepted canonical evidence.

MATRIX consequence must reference source evidence.

MATRIX consequence must preserve source hashes.

MATRIX consequence must preserve audit reference.

MATRIX consequence must preserve limitation scope.

MATRIX consequence must not be created from rejected, revoked or non-completed evidence.

## Immediate next document

The contract identifies the recommended next repository document as:

HBCE_AUTHORIZATION_DECISION_CONTRACT.md

Reason:

After canonical evidence, the next missing program-level boundary is the authorization and decision contract that determines how bounded authority becomes a decision without bypassing evidence, policy or execution constraints.

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

- main is aligned with origin/main
- main head is 2310d85
- HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md exists on main
- line count: 1822
- source requirements section present
- non-equivalence rules section present
- canonical evidence fields section present
- minimum canonical evidence schema section present
- evidence acceptance algorithm section present
- adapter evidence mapping section present
- Authority Profile evidence mapping section present
- required tests section present
- /evidence API minimum contract section present
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
- HBCE Canonical Evidence Model Contract

The cross-component evidence structure is now documented at contract level.

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
