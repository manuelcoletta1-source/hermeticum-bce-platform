# HBCE PROGRAM REALIGNMENT V3 - TECHNICAL IMPLEMENTATION CONTRACT

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Technical Implementation Contract
Version: 3.0 Candidate
Target release: 2027-01-19
Baseline main: f3c3086 docs(main): record post P004 evidence acceptance gate checkpoint
Scope: Release Candidate planning and implementation reference
Authority: Human acceptance required

## 1. Objective

This document is the technical implementation reference for HBCE Platform programming until the Release Candidate targeted for 19 January 2027.

Every software activity must be traceable to the requirements, boundaries and work packages defined in this document.

Every implementation must produce verifiable evidence.

Every completed feature must satisfy the HBCE Definition of Done.

Any feature without implementation, tests, evidence, audit trace, documentation, integration verification and human acceptance remains NON_COMPLETED.

## 2. Product definition

HBCE is a Decision & Authority Layer.

HBCE is not:

- European Business Wallet
- EUDI Wallet
- Verifiable Credential provider
- Certification Authority
- Identity Provider
- regulated KYC or AML provider
- legal certification provider
- eIDAS qualified trust service provider

HBCE coordinates the following chain:

Identity
-> Mandate
-> Authority
-> Authorization
-> Decision
-> Execution
-> Evidence
-> Consequence
-> MATRIX

HBCE determines whether a subject, through a mandate and within explicit constraints, has authority to authorize a bounded decision, execute an operation and produce verifiable evidence of the result.

HBCE does not treat identity as authorization.

HBCE does not treat capability as authority.

HBCE does not treat delegation as automatic authority.

HBCE does not treat execution as success without evidence.

## 3. Strategic realignment

This realignment changes the program from a broad platform concept to a verifiable release candidate.

Previous risk:

- excessive conceptual expansion
- unclear boundary between identity, authority and authorization
- risk of confusing wallet, credential, evidence and decision layers
- risk of treating documentation as implementation
- risk of treating validation as runtime authorization

New direction:

- HBCE is a Decision & Authority Layer
- external identity and wallet systems remain external
- adapters ingest external trust material
- canonical evidence normalizes inputs
- engines evaluate policy, authority, authorization and decision
- every execution must produce evidence
- every evidence artifact must be validated and gated
- every result must remain fail-closed
- MATRIX receives consequences, not unsupported claims

## 4. Product scope 2027

The 2027 Release Candidate includes only:

- Decision Engine
- Policy Evaluation
- Authority Engine
- Authorization Engine
- Evidence Engine
- Canonical Evidence Model
- Business Wallet Adapter
- public API contracts
- Golden Demo
- Banking Evidence Pack

The following are outside the 2027 Release Candidate scope:

- marketplace
- autonomous AI operations
- complete enterprise user management
- advanced analytics dashboard
- distributed cloud orchestration
- production deployment certification
- regulated KYC or AML provider operation
- eIDAS qualification
- legal certification

Out-of-scope items may be documented as future work but must not be treated as Release Candidate obligations.

## 5. Boundary preservation

The following boundary flags remain false for this program contract:

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

This document does not authorize production deployment.

This document does not authorize deployment readiness.

This document does not authorize L3 readiness.

This document does not authorize PostgreSQL runtime readiness or PostgreSQL execution.

This document does not authorize P04/P05 concurrency execution.

This document does not authorize OPC ALLOW.

This document does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 6. Layer architecture

### Layer 0 - External Systems

External systems may include:

- EUDI Wallet
- European Business Wallet
- W3C Verifiable Credentials
- SD-JWT
- mdoc
- organizational registries
- mandate sources
- external trust material

Layer 0 systems are not owned by HBCE unless explicitly implemented in a separate approved scope.

HBCE must not claim to replace Layer 0 systems.

### Layer 1 - HBCE Adapters

Layer 1 converts external trust material into HBCE-compatible inputs.

Required adapter direction for 2027:

- Business Wallet Adapter
- VC input mapping
- SD-JWT input mapping
- mdoc input mapping where applicable
- mandate input mapping
- organization input mapping

Adapters must produce:

- parsed input
- normalized representation
- validation result
- negative-case evidence
- audit event

Adapters must not create authority by themselves.

### Layer 2 - Canonical Evidence Model

Layer 2 defines the canonical structure used by HBCE to represent evidence.

Required functions:

- canonical schema
- serializer
- validator
- hash generation
- evidence state
- source reference
- boundary flags
- audit reference
- immutable record reference

The Canonical Evidence Model must align with P004.

### Layer 3 - Decision and Authority Engines

Layer 3 in this document means the architectural layer containing:

- Decision Engine
- Policy Evaluation
- Authority Engine
- Authorization Engine
- Execution boundary
- Evidence production trigger

This architectural Layer 3 is not L3 readiness.

Layer 3 naming must not be interpreted as L3 promotion, L3 readiness, production readiness or deployment readiness.

### Layer 4 - MATRIX

Layer 4 receives consequences derived from evidence.

MATRIX must not receive unsupported claims as facts.

MATRIX should receive:

- consequence reference
- evidence reference
- decision reference
- authorization reference
- authority reference
- timestamp
- hash
- state
- causal relation

MATRIX is the consequence memory layer of HBCE.

## 7. Core chain

The canonical HBCE chain is:

Identity
-> Mandate
-> Authority
-> Authorization
-> Decision
-> Execution
-> Evidence
-> Consequence
-> MATRIX

Each step must have explicit input, output, test, failure mode and evidence.

No step may silently imply the next step.

Identity does not imply mandate.

Mandate does not imply authority unless recognized and bounded.

Authority does not imply authorization unless evaluated.

Authorization does not imply execution unless the execution boundary passes.

Execution does not imply success unless evidence is produced.

Evidence does not imply consequence unless accepted through the evidence path.

Consequence does not update MATRIX without traceable evidence.

## 8. Program invariants

The following invariants must not be violated:

- Identity is not Admission
- Admission is not Authorization
- Capability is not Authority
- Delegation must not create Authority
- Authorization must be bounded
- Execution must produce Evidence
- Evidence must be immutable
- Policy evaluation is fail-closed
- Unknown state is deny
- No execution without authority
- No authority without mandate
- No evidence, no success

Any violation of these invariants blocks the affected feature.

Any implementation that bypasses these invariants must be rejected.

## 9. Work package model

Each work package must produce:

- requirement identifiers
- implementation references
- automatic tests
- negative tests
- evidence artifacts
- hashes
- audit trail
- documentation update
- integration verification
- human acceptance record

No work package may be marked complete without evidence.

## 10. WP-EBW - Business Wallet Adapter

Purpose:

Define and implement the adapter boundary for European Business Wallet or business-wallet-like external inputs.

Output:

- adapter contract
- input mapping
- parser
- validator
- negative-case handling
- evidence output
- audit event
- test set

Done when:

- adapter contract exists
- parser implemented
- validator implemented
- valid input test PASS
- invalid input tests PASS
- unsupported input denies or blocks fail-closed
- evidence produced
- hash generated
- audit trace generated
- documentation updated
- human acceptance recorded

Boundary:

The adapter does not make HBCE a Business Wallet.

The adapter does not make HBCE an EUDI Wallet.

The adapter does not create authority by ingestion.

## 11. WP-VC - Canonical Credential Model

Purpose:

Normalize credential-like inputs into the HBCE Canonical Evidence Model.

Output:

- canonical credential schema
- serializer
- validator
- sample valid records
- sample invalid records
- evidence mapping
- hash strategy
- audit mapping

Done when:

- canonical schema exists
- serializer test PASS
- validator test PASS
- interoperability examples are documented
- negative tests PASS
- evidence produced
- documentation updated

Boundary:

The Canonical Credential Model is not a credential issuer.

The Canonical Credential Model is not a certification authority.

The Canonical Credential Model is not an identity provider.

## 12. WP-TRUST - Trust Model

Purpose:

Define how HBCE represents recognition, capability, scope and constraints.

Required fields:

- recognized_by
- capability
- scope
- constraints
- mandate_ref
- authority_ref
- validity_window
- source_ref
- evidence_ref

Output:

- trust model schema
- trust evaluation function
- negative cases
- fail-closed rules
- evidence output

Done when:

- recognized_by is explicit
- capability is explicit
- scope is explicit
- constraints are explicit
- trust evaluation PASS for valid cases
- invalid recognition denies
- missing scope denies
- missing constraints deny
- evidence produced

Boundary:

Recognition does not automatically create authority.

Capability does not automatically create authority.

Delegation does not automatically create authority.

## 13. WP-CONFORMANCE - Requirement to Test to Evidence to Audit

Purpose:

Create the program-wide conformance chain.

Every requirement must produce:

Requirement
-> Test
-> Evidence
-> Audit

Required artifacts:

- requirement identifier
- test identifier
- test result
- evidence identifier
- evidence hash
- audit reference
- status
- human acceptance state

Done when:

- each requirement has at least one test
- each test has a result
- each result produces evidence
- each evidence artifact has hash
- each evidence artifact has audit reference
- missing evidence blocks success
- documentation updated

Boundary:

A requirement without evidence is incomplete.

A test without evidence is incomplete.

Evidence without audit is incomplete.

Audit without human acceptance remains pending.

## 14. WP-PRIVACY - Minimum Disclosure

Purpose:

Ensure bounded data disclosure and bounded authorization.

Support:

- selective disclosure
- data minimization
- bounded authorization
- explicit purpose
- scope limitation
- evidence minimization

Output:

- privacy rules
- disclosure model
- minimized evidence examples
- negative tests
- audit mapping

Done when:

- selective disclosure rules exist
- minimization rules exist
- over-disclosure negative test PASS
- unbounded authorization negative test PASS
- evidence produced
- documentation updated

Boundary:

HBCE must not request unnecessary data.

HBCE must not treat more data as more authority.

HBCE must not treat disclosure as authorization.

## 15. WP-B2G - Procurement Readiness

Purpose:

Prepare HBCE evidence for B2G or banking procurement review.

Output:

- evidence pack
- documentation pack
- API contract pack
- compliance mapping
- negative control summary
- audit summary
- human acceptance state

Done when:

- evidence pack exists
- API contracts documented
- compliance mapping documented
- negative controls documented
- audit trail documented
- boundaries preserved
- no regulated status is claimed

Boundary:

Procurement readiness does not mean production readiness.

Banking Evidence Pack does not mean banking certification.

Compliance mapping does not mean legal certification.

## 16. Evidence alignment with P004

P004 is the documentary evidence layer already integrated into main.

Current P004 chain:

1. P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
2. P004_OPERATIONAL_EVIDENCE_MAP.md
3. P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
4. P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
5. P004_EVIDENCE_REGISTRY_INDEX.md
6. P004_RUNTIME_EVIDENCE_SCHEMA.md
7. P004_EVIDENCE_RECORD_TEMPLATE.md
8. P004_EVIDENCE_RECORD_EXAMPLE.md
9. P004_EVIDENCE_VALIDATION_CHECKLIST.md
10. P004_EVIDENCE_ACCEPTANCE_GATE.md

P004 provides the documentary backbone for:

- evidence planning
- evidence mapping
- lifecycle state
- runtime alignment
- registry indexing
- schema definition
- record template
- record example
- validation checklist
- acceptance gate

This contract incorporates P004 as the evidence governance baseline.

Future implementation must map technical evidence into the P004 chain.

## 17. API minimum set

The following API families are mandatory for the 2027 Release Candidate:

- /ipr
- /authority
- /authorization
- /policy
- /evidence
- /decision
- /events
- /matrix
- /business-wallet
- /health

Each API family must define:

- endpoint path
- method
- request schema
- response schema
- error model
- authorization boundary
- evidence produced
- event emitted
- negative tests
- audit record
- human acceptance state

No API is complete without tests and evidence.

## 18. API family purpose

### /ipr

Purpose:

Represent identity-participation references and HBCE subject linkage.

Boundary:

IPR does not imply authority.

IPR does not imply authorization.

### /authority

Purpose:

Evaluate authority derived from mandate, recognition, scope and constraints.

Boundary:

Authority cannot exist without mandate.

Authority cannot be invented from identity.

### /authorization

Purpose:

Evaluate whether a bounded action is authorized under authority and policy.

Boundary:

Authorization must be bounded.

Prepared authorization is not execution.

### /policy

Purpose:

Evaluate rules in a fail-closed way.

Boundary:

Unknown state is deny.

Policy PASS is not OPC ALLOW.

### /evidence

Purpose:

Produce, validate, register and classify evidence.

Boundary:

Evidence does not authorize runtime.

Evidence must be immutable once accepted.

### /decision

Purpose:

Create traceable decisions derived from authority, authorization and policy.

Boundary:

Decision without authority is denied.

Decision without evidence remains incomplete.

### /events

Purpose:

Emit traceable events for audit and evidence linkage.

Boundary:

Event presence is not success.

### /matrix

Purpose:

Record accepted consequences derived from evidence.

Boundary:

MATRIX must not ingest unsupported claims as accepted consequence.

### /business-wallet

Purpose:

Receive and normalize business-wallet-like external trust material.

Boundary:

This endpoint does not make HBCE a Business Wallet.

### /health

Purpose:

Expose system health and readiness for non-production diagnostic use.

Boundary:

Health PASS is not production readiness.

## 19. Acceptance criteria

Every module is complete only when:

- code compiles
- automatic tests PASS
- negative tests PASS
- evidence is produced
- hash is generated
- audit is verifiable
- documentation is updated
- integration is verified
- human acceptance is recorded

If one of these elements is missing, the module remains NON_COMPLETED.

## 20. Golden Demo

The mandatory Golden Demo scenario is:

Subject
-> Organisation
-> Mandate
-> Authority
-> Authorization
-> Execution
-> Evidence
-> Consequence
-> MATRIX(t1)

The Golden Demo must demonstrate:

- positive case
- missing mandate negative case
- invalid authority negative case
- unbounded authorization negative case
- unknown policy negative case
- blocked execution negative case
- missing evidence negative case
- unsupported MATRIX consequence negative case

Golden Demo success requires:

- positive case PASS
- all negative cases fail-closed
- evidence produced for each case
- hashes generated
- audit trail produced
- documentation updated
- human acceptance recorded

## 21. Roadmap

### September 2026

Focus:

- Authority Profile
- Business Wallet Adapter

Outputs:

- Authority Profile contract
- authority fields
- mandate dependency model
- Business Wallet Adapter contract
- input mapping draft
- validation rules
- negative cases

### October 2026

Focus:

- API Contracts
- Canonical Evidence Model
- Golden Demo

Outputs:

- API contract documents
- request and response schemas
- error model
- canonical evidence schema
- serializer and validator plan
- Golden Demo scenario specification

### November 2026

Focus:

- Stress Test
- Negative Controls
- Policy Validation

Outputs:

- stress test plan
- negative controls
- policy validation evidence
- fail-closed verification
- audit reproducibility checks

### December 2026

Focus:

- Banking Evidence Pack
- Procurement Readiness
- Final Audit

Outputs:

- Banking Evidence Pack
- procurement mapping
- compliance mapping
- audit summary
- evidence index
- release candidate readiness review

### January 2027

Focus:

- Release Candidate
- Freeze
- Release 2027-01-19

Outputs:

- Release Candidate package
- frozen scope
- final evidence pack
- final audit report
- human acceptance record

## 22. Definition of Done

A HBCE functionality is complete only when all of the following are present:

- implementation completed
- automatic tests PASS
- negative tests PASS
- evidence generated
- hash generated
- audit reproducible
- documentation updated
- integration verified
- human approval recorded

In absence of one or more elements, the functionality remains NON_COMPLETED.

## 23. Non-completion rule

The following states must be treated as NON_COMPLETED:

- implementation without tests
- tests without evidence
- evidence without hash
- hash without audit reference
- audit without documentation
- documentation without integration verification
- integration without human acceptance
- human acceptance without preserved boundary flags

NON_COMPLETED does not mean failed.

NON_COMPLETED means not accepted for Release Candidate completion.

## 24. Human acceptance

Human acceptance is required for:

- work package completion
- release candidate readiness
- gate acceptance
- evidence acceptance
- scope changes
- boundary changes
- final freeze

Human acceptance must be recorded as evidence.

AI output does not substitute human acceptance.

Tool output does not substitute human acceptance.

Passing tests do not substitute human acceptance.

## 25. Failure model

The HBCE failure model is fail-closed.

Default behavior:

- unknown identity state denies admission
- missing mandate denies authority
- missing authority denies authorization
- missing authorization denies decision
- missing decision denies execution
- missing execution denies success
- missing evidence denies completion
- missing consequence denies MATRIX update
- missing audit denies acceptance

Unknown state is deny.

Ambiguous state is review required or blocked.

Contradictory state is rejected.

Previously accepted state that violates boundaries is revoked.

## 26. Release Candidate target

The 2027-01-19 Release Candidate must demonstrate that HBCE can determine, verify and trace the complete cycle:

Identity
-> Mandate
-> Authority
-> Authorization
-> Decision
-> Execution
-> Evidence
-> Consequence
-> MATRIX

The demonstration must use one coherent architecture.

The demonstration must be interoperable with external trust material through adapters.

The demonstration must be verifiable through evidence.

The demonstration must fail closed on negative cases.

The demonstration must remain within the boundaries of this contract.

## 27. Immediate next derivations

This contract requires the following next technical documents:

1. HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md
2. HBCE_AUTHORITY_PROFILE_CONTRACT.md
3. HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
4. HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
5. HBCE_GOLDEN_DEMO_SPECIFICATION.md
6. HBCE_PUBLIC_API_CONTRACTS_2027.md
7. HBCE_BANKING_EVIDENCE_PACK_INDEX.md

The first derivation should be:

HBCE_2027_REQUIREMENT_TO_TEST_EVIDENCE_MATRIX.md

Reason:

The program must convert this realignment into a traceable Requirement -> Test -> Evidence -> Audit matrix before implementation expands.

## 28. Decision rule

This contract is the program realignment reference for HBCE Release Candidate work toward 2027-01-19.

It defines technical direction, scope, work packages, boundaries, acceptance criteria and documentary obligations.

It does not authorize production deployment, production readiness, deployment readiness, L3 promotion, L3 readiness, PostgreSQL runtime readiness, PostgreSQL execution, P04/P05 concurrency execution, OPC ALLOW, legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 29. Checkpoint state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
