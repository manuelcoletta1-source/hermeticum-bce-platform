# MAIN POST HBCE AUTHORIZATION DECISION CONTRACT CHECKPOINT - 2026-09-21

## Status

Checkpoint prepared after integration of PR #20.

Integrated pull request:

- PR: #20
- Title: docs(hbce): add authorization decision contract
- Branch: hbce/authorization-decision-contract
- Integrated file: HBCE_AUTHORIZATION_DECISION_CONTRACT.md

Observed main state:

- MAIN_HEAD: 677f357 Merge pull request #20 from manuelcoletta1-source/hbce/authorization-decision-contract
- Integrated document commit: f415193 docs(hbce): add authorization decision contract
- Previous main baseline: 09bad1a docs(main): record post HBCE canonical evidence model checkpoint

## Integrated artifact

HBCE_AUTHORIZATION_DECISION_CONTRACT.md defines the HBCE Authorization Decision Contract.

It is the boundary that turns bounded authority, policy context, action request and canonical evidence into authorization and decision records.

The contract is derived from:

- HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
- HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
- HBCE_AUTHORITY_PROFILE_CONTRACT.md
- HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
- HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
- P004_RUNTIME_EVIDENCE_SCHEMA.md
- P004_EVIDENCE_ACCEPTANCE_GATE.md

## Operational purpose

The Authorization Decision Contract defines how HBCE evaluates whether bounded authority can support an authorization result and decision result.

The contract separates authority from authorization.

The contract separates authorization from decision.

The contract separates decision from execution.

The contract separates execution eligibility from execution.

The contract separates decision from MATRIX consequence.

The contract requires policy evaluation.

The contract requires canonical evidence.

The contract requires audit binding.

The contract preserves negative outcomes.

The contract preserves limitation scope.

## Core rule

The contract prevents Authority Profile PASS from being treated as authorization and prevents authorization or decision PASS from being treated as execution.

Forbidden equivalence shortcuts include:

- Identity = Authorization
- Mandate = Authorization
- Authority Profile = Authorization
- Authority Profile PASS = Authorization PASS
- Recognized_by = Authorization
- Capability = Authorization
- Role = Authorization
- Policy PASS = Authorization
- Policy PASS = Production Readiness
- Evidence Acceptance = Authorization
- Human Acceptance = Authorization
- Authorization = Execution
- Authorization PASS = Execution
- Authorization PASS = MATRIX Update
- Decision = Execution
- Decision PASS = Execution
- Decision PASS = MATRIX Update
- Execution Eligibility = Execution
- Audit = Authorization
- Hash = Authorization
- Action Request = Authorization
- Authorization Evidence = Legal Certification
- Decision Evidence = Legal Certification
- Authorization PASS = OPC ALLOW
- Decision PASS = OPC ALLOW
- Authorization PASS = L3 Readiness
- Decision PASS = L3 Readiness
- Authorization PASS = Production Deployment
- Decision PASS = Production Deployment

## Authorization Decision Contract contents

The contract defines:

- authorization and decision purpose
- position in the HBCE canonical chain
- source requirement mapping
- boundary preservation
- authority definition
- authorization definition
- decision definition
- action request definition
- action class definition
- policy context definition
- constraint context definition
- authorization result definition
- decision result definition
- execution eligibility definition
- denial definition
- block definition
- non-completed definition
- non-equivalence rules
- authorization responsibilities
- decision responsibilities
- canonical authorization fields
- canonical decision fields
- authorization status values
- authorization result values
- decision status values
- decision result values
- evidence support states
- execution eligibility states
- mandatory boundary flags
- human acceptance states
- minimum authorization schema
- minimum decision schema
- authorization evaluation prerequisites
- decision evaluation prerequisites
- authorization evaluation algorithm
- decision evaluation algorithm
- positive authorization path
- positive decision path
- negative authorization paths
- negative decision paths
- policy relationship
- evidence relationship
- audit relationship
- Authority Profile relationship
- Business Wallet Adapter relationship
- Execution Boundary relationship
- MATRIX relationship
- /authorization API minimum contract
- /authorization request minimum fields
- /authorization response minimum fields
- /decision API minimum contract
- /decision request minimum fields
- /decision response minimum fields
- error model
- required tests
- required evidence artifacts
- Golden Demo authorization and decision obligations
- completion rule
- immediate next derivations

## Required test family

The contract defines the initial Authorization Decision test family:

- valid bounded authorization
- valid bounded decision
- missing Authority Profile
- invalid Authority Profile
- Authority Profile not accepted
- action class not allowed
- action class explicitly denied
- scope mismatch
- constraint mismatch
- temporal mismatch
- unknown policy
- policy failed
- missing evidence
- rejected evidence
- revoked evidence
- hash mismatch
- missing audit
- boundary flag violation
- human acceptance pending
- authorization denied drives decision deny
- authorization blocked drives decision block
- authorization non-completed drives decision non-completed
- allow with limitations preserves limitations
- authorization does not execute
- decision does not execute
- decision does not update MATRIX

## P004 relationship

P004 remains the evidence governance baseline.

Authorization and decision evidence must be compatible with P004.

Authorization and decision evidence must comply with the Canonical Evidence Model.

Evidence artifacts must include:

- evidence references
- hash references
- audit references
- boundary flags
- lifecycle state

## Authority Profile relationship

Authorization must consume Authority Profile as input.

Authorization must not create Authority Profile.

Authorization must verify Authority Profile status.

Authorization must verify Authority Profile scope.

Authorization must verify Authority Profile constraints.

Authorization must verify Authority Profile temporal bounds.

Authorization must verify Authority Profile evidence references.

Authority Profile PASS does not automatically authorize action.

Authority Profile scope limits authorization scope.

Authority Profile denied action classes override requested action.

## Business Wallet Adapter relationship

Business Wallet Adapter may provide upstream source material.

Business Wallet Adapter output cannot authorize an action.

Business Wallet Adapter PASS is not authorization.

Business Wallet Adapter ROUTED is not authorization.

Business Wallet Adapter evidence must pass Canonical Evidence Model validation before supporting authorization.

Wallet-like input cannot authorize execution.

External credential-like input cannot authorize execution.

## Canonical Evidence Model relationship

Authorization and decision must produce or reference canonical evidence.

Rejected evidence cannot support authorization.

Revoked evidence cannot support authorization.

Blocked evidence cannot support authorization.

Non-completed evidence cannot support authorization.

Accepted-with-limitations evidence can support only within limitation scope.

## Execution Boundary relationship

Authorization and decision may only create execution eligibility.

Execution eligibility is not execution.

Execution Boundary must separately evaluate whether execution may occur.

This contract does not implement Execution Boundary.

This contract does not execute.

Execution Boundary remains a future contract.

## MATRIX relationship

Authorization does not update MATRIX.

Decision does not update MATRIX.

Execution eligibility does not update MATRIX.

MATRIX consequence requires execution evidence, accepted canonical evidence, consequence evidence, audit reference and limitation preservation.

Rejected, blocked, revoked or non-completed evidence cannot support MATRIX consequence.

## Immediate next document

The contract identifies the recommended next repository document as:

HBCE_EXECUTION_BOUNDARY_CONTRACT.md

Reason:

After authorization and decision, the next missing program-level boundary is execution separation: a decision may create execution eligibility, but execution must remain a separate controlled, evidence-producing boundary.

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
- main fast-forwarded to 677f357
- HBCE_AUTHORIZATION_DECISION_CONTRACT.md exists on main
- line count: 2109
- source requirements section present
- non-equivalence rules section present
- canonical authorization fields section present
- canonical decision fields section present
- minimum authorization schema section present
- minimum decision schema section present
- authorization evaluation algorithm section present
- decision evaluation algorithm section present
- evidence relationship section present
- /authorization API minimum contract section present
- /decision API minimum contract section present
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
- HBCE Canonical Evidence Model Contract
- HBCE Authorization Decision Contract

The authorization and decision boundary is now documented at contract level.

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
