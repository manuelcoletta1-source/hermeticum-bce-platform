# HBCE 2027 REQUIREMENT TO TEST EVIDENCE MATRIX

## Document status

Program: HERMETICUM B.C.E. S.r.l. - HBCE Platform
Document type: Requirement to Test to Evidence to Audit Matrix
Version: 1.0 Candidate
Target release: 2027-01-19
Baseline main: f727d73 docs(main): record post HBCE program realignment v3 checkpoint
Parent contract: HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md
Evidence baseline: P004 documentary evidence chain
Human acceptance required: true

## 1. Purpose

This document converts the HBCE Program Realignment V3 Technical Implementation Contract into a traceable requirement matrix.

The program rule is:

Requirement -> Test -> Evidence -> Audit

Every HBCE feature must map to:

- requirement id
- source reference
- implementation target
- positive test
- negative test
- evidence artifact
- hash requirement
- audit requirement
- human acceptance state
- completion state

A feature without evidence remains NON_COMPLETED.

A feature without negative tests remains NON_COMPLETED.

A feature without reproducible audit remains NON_COMPLETED.

A feature without human acceptance remains NON_COMPLETED.

## 2. Scope

This matrix applies to the 2027-01-19 Release Candidate path.

Release Candidate scope includes:

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

Out-of-scope items remain outside this matrix unless separately approved.

Out-of-scope items include:

- marketplace
- autonomous AI operations
- complete enterprise user management
- advanced analytics dashboard
- distributed cloud orchestration
- production deployment certification
- regulated KYC or AML provider operation
- eIDAS qualification
- legal certification

## 3. Boundary preservation

The following boundary flags must remain false for this matrix:

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

This matrix does not authorize production deployment.

This matrix does not authorize deployment readiness.

This matrix does not authorize L3 readiness.

This matrix does not authorize PostgreSQL runtime readiness or PostgreSQL execution.

This matrix does not authorize P04/P05 concurrency execution.

This matrix does not authorize OPC ALLOW.

This matrix does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 4. P004 evidence baseline

The matrix must align with the current P004 documentary evidence chain:

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

P004 provides the evidence lifecycle, registry, schema, validation and acceptance baseline.

This matrix defines what must produce evidence.

P004 defines how the evidence is structured, validated and accepted.

## 5. Matrix status values

Allowed requirement status values:

- PLANNED
- READY_FOR_IMPLEMENTATION
- IMPLEMENTED
- TESTED
- EVIDENCE_PREPARED
- EVIDENCE_ACCEPTED
- BLOCKED
- REJECTED
- NON_COMPLETED

Allowed test status values:

- NOT_STARTED
- PASS
- FAIL
- BLOCKED
- NOT_APPLICABLE

Allowed evidence status values:

- NOT_CREATED
- PREPARED
- VALIDATED
- ACCEPTED_DOCUMENTARY
- ACCEPTED_WITH_LIMITATIONS
- BLOCKED
- REJECTED
- REVOKED
- ARCHIVED

Allowed human acceptance values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Default state for new requirements:

- requirement_status: PLANNED
- positive_test_status: NOT_STARTED
- negative_test_status: NOT_STARTED
- evidence_status: NOT_CREATED
- human_acceptance_state: PENDING

## 6. Completion rule

A requirement may be considered complete only when:

- implementation target exists
- positive test PASS
- negative test PASS
- evidence artifact exists
- evidence hash exists
- audit reference exists
- documentation is updated
- integration is verified
- human acceptance is ACCEPTED

If any item is missing, the requirement remains NON_COMPLETED.

## 7. Requirement record format

Each requirement should use the following canonical record format:

```yaml
requirement_id: ""
requirement_title: ""
source_reference: ""
implementation_target: ""
positive_test_id: ""
positive_test_expected: ""
negative_test_id: ""
negative_test_expected: ""
evidence_id: ""
evidence_artifact: ""
hash_required: true
audit_required: true
documentation_required: true
integration_required: true
human_acceptance_state: "PENDING"
requirement_status: "PLANNED"
boundary_flags:
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
```

## 8. Program-level requirements

### HBCE-REQ-000 - Program contract traceability

Source reference:

HBCE_PROGRAM_REALIGNMENT_V3_TECHNICAL_IMPLEMENTATION_CONTRACT.md

Requirement:

Every software activity must be traceable to the V3 contract or to an approved derivative document.

Implementation target:

- program traceability index
- requirement references in future work packages
- evidence references in P004-compatible records

Positive test:

HBCE-TST-000-POS

Expected result:

A sample requirement references the parent contract, work package and evidence artifact.

Negative test:

HBCE-TST-000-NEG

Expected result:

A requirement without source reference is blocked.

Evidence:

HBCE-EVD-000-PROGRAM-TRACEABILITY

Audit:

HBCE-AUD-000-PROGRAM-TRACEABILITY

Status:

PLANNED

### HBCE-REQ-001 - HBCE product role

Source reference:

V3 contract section 2

Requirement:

HBCE must be represented as a Decision & Authority Layer.

Implementation target:

- product definition documentation
- API family descriptions
- Golden Demo narrative
- Banking Evidence Pack description

Positive test:

HBCE-TST-001-POS

Expected result:

HBCE is described as Decision & Authority Layer.

Negative test:

HBCE-TST-001-NEG

Expected result:

Any claim that HBCE is a wallet, identity provider or certification authority is rejected.

Evidence:

HBCE-EVD-001-PRODUCT-ROLE

Audit:

HBCE-AUD-001-PRODUCT-ROLE

Status:

PLANNED

### HBCE-REQ-002 - External system non-replacement

Source reference:

V3 contract sections 2 and 6

Requirement:

HBCE must not claim to replace European Business Wallet, EUDI Wallet, Verifiable Credentials, Certification Authority or Identity Provider systems.

Implementation target:

- adapter boundary documentation
- API documentation
- external system mapping

Positive test:

HBCE-TST-002-POS

Expected result:

External systems are marked as Layer 0.

Negative test:

HBCE-TST-002-NEG

Expected result:

Any replacement claim is rejected or marked out of scope.

Evidence:

HBCE-EVD-002-EXTERNAL-NON-REPLACEMENT

Audit:

HBCE-AUD-002-EXTERNAL-NON-REPLACEMENT

Status:

PLANNED

### HBCE-REQ-003 - Canonical chain enforcement

Source reference:

V3 contract sections 2, 7 and 26

Requirement:

The canonical chain must be preserved:

Identity -> Mandate -> Authority -> Authorization -> Decision -> Execution -> Evidence -> Consequence -> MATRIX

Implementation target:

- chain model
- Golden Demo
- event model
- evidence model
- MATRIX consequence model

Positive test:

HBCE-TST-003-POS

Expected result:

A complete positive flow traverses the full chain in order.

Negative test:

HBCE-TST-003-NEG

Expected result:

A chain step cannot be skipped without fail-closed handling.

Evidence:

HBCE-EVD-003-CANONICAL-CHAIN

Audit:

HBCE-AUD-003-CANONICAL-CHAIN

Status:

PLANNED

### HBCE-REQ-004 - Identity is not authorization

Source reference:

V3 contract sections 7 and 8

Requirement:

Identity must not imply authorization.

Implementation target:

- identity model
- authorization engine
- negative controls

Positive test:

HBCE-TST-004-POS

Expected result:

Identity is accepted only as subject reference.

Negative test:

HBCE-TST-004-NEG

Expected result:

Identity without mandate and authority cannot authorize execution.

Evidence:

HBCE-EVD-004-IDENTITY-NOT-AUTHORIZATION

Audit:

HBCE-AUD-004-IDENTITY-NOT-AUTHORIZATION

Status:

PLANNED

### HBCE-REQ-005 - No authority without mandate

Source reference:

V3 contract sections 7, 8 and 25

Requirement:

Authority must not exist without mandate.

Implementation target:

- Authority Engine
- mandate reference model
- negative controls

Positive test:

HBCE-TST-005-POS

Expected result:

Valid mandate can support authority evaluation.

Negative test:

HBCE-TST-005-NEG

Expected result:

Missing mandate denies authority.

Evidence:

HBCE-EVD-005-NO-AUTHORITY-WITHOUT-MANDATE

Audit:

HBCE-AUD-005-NO-AUTHORITY-WITHOUT-MANDATE

Status:

PLANNED

### HBCE-REQ-006 - Authorization must be bounded

Source reference:

V3 contract sections 8, 14 and 18

Requirement:

Authorization must be bounded by scope, constraints and purpose.

Implementation target:

- Authorization Engine
- authorization schema
- bounded authorization test set

Positive test:

HBCE-TST-006-POS

Expected result:

Authorization passes only when scope, constraints and purpose are explicit.

Negative test:

HBCE-TST-006-NEG

Expected result:

Unbounded authorization is denied.

Evidence:

HBCE-EVD-006-BOUNDED-AUTHORIZATION

Audit:

HBCE-AUD-006-BOUNDED-AUTHORIZATION

Status:

PLANNED

### HBCE-REQ-007 - Policy evaluation fail-closed

Source reference:

V3 contract sections 8, 18 and 25

Requirement:

Policy evaluation must fail closed.

Implementation target:

- Policy Evaluation
- policy error model
- unknown state handling

Positive test:

HBCE-TST-007-POS

Expected result:

Known valid policy condition produces expected pass result.

Negative test:

HBCE-TST-007-NEG

Expected result:

Unknown policy state denies or blocks.

Evidence:

HBCE-EVD-007-POLICY-FAIL-CLOSED

Audit:

HBCE-AUD-007-POLICY-FAIL-CLOSED

Status:

PLANNED

### HBCE-REQ-008 - No execution without authority

Source reference:

V3 contract sections 8 and 25

Requirement:

Execution must not occur without authority.

Implementation target:

- execution boundary
- Authority Engine integration
- Authorization Engine integration

Positive test:

HBCE-TST-008-POS

Expected result:

Execution boundary passes only after authority and authorization pass.

Negative test:

HBCE-TST-008-NEG

Expected result:

Execution request without authority is denied.

Evidence:

HBCE-EVD-008-NO-EXECUTION-WITHOUT-AUTHORITY

Audit:

HBCE-AUD-008-NO-EXECUTION-WITHOUT-AUTHORITY

Status:

PLANNED

### HBCE-REQ-009 - Execution must produce evidence

Source reference:

V3 contract sections 8, 13, 19 and 25

Requirement:

Execution must produce evidence.

Implementation target:

- Evidence Engine
- event model
- execution result model

Positive test:

HBCE-TST-009-POS

Expected result:

Successful execution produces evidence artifact and audit reference.

Negative test:

HBCE-TST-009-NEG

Expected result:

Execution without evidence remains NON_COMPLETED.

Evidence:

HBCE-EVD-009-EXECUTION-PRODUCES-EVIDENCE

Audit:

HBCE-AUD-009-EXECUTION-PRODUCES-EVIDENCE

Status:

PLANNED

### HBCE-REQ-010 - Evidence immutability

Source reference:

V3 contract sections 8 and 16

Requirement:

Evidence must be immutable once accepted.

Implementation target:

- Evidence Engine
- evidence hash model
- evidence lifecycle state model
- P004 registry alignment

Positive test:

HBCE-TST-010-POS

Expected result:

Accepted evidence has stable hash and lifecycle state.

Negative test:

HBCE-TST-010-NEG

Expected result:

Mutation attempt after acceptance is rejected or creates supersession.

Evidence:

HBCE-EVD-010-EVIDENCE-IMMUTABILITY

Audit:

HBCE-AUD-010-EVIDENCE-IMMUTABILITY

Status:

PLANNED

### HBCE-REQ-011 - MATRIX consequence requires evidence

Source reference:

V3 contract sections 6, 7, 18 and 26

Requirement:

MATRIX must receive accepted consequences derived from evidence, not unsupported claims.

Implementation target:

- MATRIX API
- consequence model
- evidence reference model

Positive test:

HBCE-TST-011-POS

Expected result:

Accepted evidence produces a traceable consequence reference for MATRIX.

Negative test:

HBCE-TST-011-NEG

Expected result:

Unsupported claim is denied as MATRIX consequence.

Evidence:

HBCE-EVD-011-MATRIX-EVIDENCE-CONSEQUENCE

Audit:

HBCE-AUD-011-MATRIX-EVIDENCE-CONSEQUENCE

Status:

PLANNED

### HBCE-REQ-012 - Human acceptance required

Source reference:

V3 contract sections 19, 22 and 24

Requirement:

Human acceptance is required for completion.

Implementation target:

- acceptance metadata
- evidence gate
- release candidate checklist

Positive test:

HBCE-TST-012-POS

Expected result:

Human acceptance state ACCEPTED allows completion within scope.

Negative test:

HBCE-TST-012-NEG

Expected result:

PENDING human acceptance keeps requirement NON_COMPLETED.

Evidence:

HBCE-EVD-012-HUMAN-ACCEPTANCE

Audit:

HBCE-AUD-012-HUMAN-ACCEPTANCE

Status:

PLANNED

## 9. Work package requirements

### HBCE-REQ-100 - WP-EBW adapter contract

Source reference:

V3 contract section 10

Requirement:

Business Wallet Adapter must define adapter contract, mapping, parser, validator, negative cases, evidence output and audit event.

Implementation target:

- HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
- /business-wallet API contract
- parser plan
- validator plan

Positive test:

HBCE-TST-100-POS

Expected result:

Valid business-wallet-like input maps to canonical input representation.

Negative test:

HBCE-TST-100-NEG

Expected result:

Invalid or unsupported input fails closed.

Evidence:

HBCE-EVD-100-EBW-ADAPTER-CONTRACT

Audit:

HBCE-AUD-100-EBW-ADAPTER-CONTRACT

Status:

PLANNED

### HBCE-REQ-101 - WP-EBW non-wallet boundary

Source reference:

V3 contract sections 10 and 18

Requirement:

Business Wallet Adapter must not make HBCE a Business Wallet or EUDI Wallet.

Implementation target:

- adapter boundary
- API documentation
- negative claims check

Positive test:

HBCE-TST-101-POS

Expected result:

Adapter is documented as ingestion and normalization layer.

Negative test:

HBCE-TST-101-NEG

Expected result:

Wallet-provider claim is rejected.

Evidence:

HBCE-EVD-101-EBW-NON-WALLET-BOUNDARY

Audit:

HBCE-AUD-101-EBW-NON-WALLET-BOUNDARY

Status:

PLANNED

### HBCE-REQ-200 - WP-VC canonical credential model

Source reference:

V3 contract section 11

Requirement:

Credential-like inputs must normalize into the HBCE Canonical Evidence Model.

Implementation target:

- HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
- credential schema
- serializer
- validator

Positive test:

HBCE-TST-200-POS

Expected result:

Valid credential-like input serializes into canonical evidence-compatible structure.

Negative test:

HBCE-TST-200-NEG

Expected result:

Malformed credential-like input is rejected or blocked.

Evidence:

HBCE-EVD-200-CANONICAL-CREDENTIAL-MODEL

Audit:

HBCE-AUD-200-CANONICAL-CREDENTIAL-MODEL

Status:

PLANNED

### HBCE-REQ-201 - WP-VC non-issuer boundary

Source reference:

V3 contract section 11

Requirement:

Canonical Credential Model must not act as issuer, certification authority or identity provider.

Implementation target:

- model boundary documentation
- API documentation
- negative claim test

Positive test:

HBCE-TST-201-POS

Expected result:

Model is documented as normalization layer only.

Negative test:

HBCE-TST-201-NEG

Expected result:

Issuer or certification claim is rejected.

Evidence:

HBCE-EVD-201-VC-NON-ISSUER-BOUNDARY

Audit:

HBCE-AUD-201-VC-NON-ISSUER-BOUNDARY

Status:

PLANNED

### HBCE-REQ-300 - WP-TRUST recognized_by model

Source reference:

V3 contract section 12

Requirement:

Trust model must explicitly represent recognized_by, capability, scope and constraints.

Implementation target:

- trust model schema
- trust evaluation function
- Authority Engine input model

Positive test:

HBCE-TST-300-POS

Expected result:

Complete trust model passes structural validation.

Negative test:

HBCE-TST-300-NEG

Expected result:

Missing recognized_by, scope or constraints denies or blocks.

Evidence:

HBCE-EVD-300-TRUST-MODEL

Audit:

HBCE-AUD-300-TRUST-MODEL

Status:

PLANNED

### HBCE-REQ-301 - WP-TRUST capability is not authority

Source reference:

V3 contract sections 8 and 12

Requirement:

Capability must not automatically create authority.

Implementation target:

- Authority Engine
- trust evaluation
- negative controls

Positive test:

HBCE-TST-301-POS

Expected result:

Capability with mandate, scope and recognition may support authority evaluation.

Negative test:

HBCE-TST-301-NEG

Expected result:

Capability without mandate and recognition does not create authority.

Evidence:

HBCE-EVD-301-CAPABILITY-NOT-AUTHORITY

Audit:

HBCE-AUD-301-CAPABILITY-NOT-AUTHORITY

Status:

PLANNED

### HBCE-REQ-400 - WP-CONFORMANCE chain

Source reference:

V3 contract section 13

Requirement:

Every requirement must map to test, evidence and audit.

Implementation target:

- this matrix
- evidence registry linkage
- audit reference model

Positive test:

HBCE-TST-400-POS

Expected result:

Requirement has test id, evidence id and audit id.

Negative test:

HBCE-TST-400-NEG

Expected result:

Requirement without evidence or audit remains NON_COMPLETED.

Evidence:

HBCE-EVD-400-CONFORMANCE-CHAIN

Audit:

HBCE-AUD-400-CONFORMANCE-CHAIN

Status:

PLANNED

### HBCE-REQ-401 - Evidence hash required

Source reference:

V3 contract sections 13, 19 and 22

Requirement:

Every accepted evidence artifact must have a hash.

Implementation target:

- evidence hash model
- P004 registry alignment
- audit reference

Positive test:

HBCE-TST-401-POS

Expected result:

Evidence artifact contains hash reference.

Negative test:

HBCE-TST-401-NEG

Expected result:

Evidence without hash remains NON_COMPLETED.

Evidence:

HBCE-EVD-401-EVIDENCE-HASH-REQUIRED

Audit:

HBCE-AUD-401-EVIDENCE-HASH-REQUIRED

Status:

PLANNED

### HBCE-REQ-500 - WP-PRIVACY minimum disclosure

Source reference:

V3 contract section 14

Requirement:

HBCE must support minimum disclosure, data minimization and bounded authorization.

Implementation target:

- privacy rules
- disclosure model
- authorization scope model

Positive test:

HBCE-TST-500-POS

Expected result:

Only required fields are disclosed for a bounded purpose.

Negative test:

HBCE-TST-500-NEG

Expected result:

Over-disclosure is blocked or rejected.

Evidence:

HBCE-EVD-500-MINIMUM-DISCLOSURE

Audit:

HBCE-AUD-500-MINIMUM-DISCLOSURE

Status:

PLANNED

### HBCE-REQ-501 - Disclosure is not authorization

Source reference:

V3 contract section 14

Requirement:

Disclosure must not be treated as authorization.

Implementation target:

- privacy model
- authorization engine
- negative controls

Positive test:

HBCE-TST-501-POS

Expected result:

Disclosure supports evaluation only.

Negative test:

HBCE-TST-501-NEG

Expected result:

Disclosure alone cannot authorize execution.

Evidence:

HBCE-EVD-501-DISCLOSURE-NOT-AUTHORIZATION

Audit:

HBCE-AUD-501-DISCLOSURE-NOT-AUTHORIZATION

Status:

PLANNED

### HBCE-REQ-600 - WP-B2G evidence pack

Source reference:

V3 contract section 15

Requirement:

Banking and B2G procurement readiness must be supported through evidence pack, documentation pack, API contract pack, compliance mapping, negative controls and audit summary.

Implementation target:

- HBCE_BANKING_EVIDENCE_PACK_INDEX.md
- procurement mapping
- compliance mapping
- evidence index

Positive test:

HBCE-TST-600-POS

Expected result:

Evidence pack links requirements, tests, evidence and audit references.

Negative test:

HBCE-TST-600-NEG

Expected result:

Pack without evidence or audit remains NON_COMPLETED.

Evidence:

HBCE-EVD-600-B2G-EVIDENCE-PACK

Audit:

HBCE-AUD-600-B2G-EVIDENCE-PACK

Status:

PLANNED

### HBCE-REQ-601 - Procurement readiness is not production readiness

Source reference:

V3 contract section 15

Requirement:

Procurement readiness must not imply production readiness, banking certification or legal certification.

Implementation target:

- Banking Evidence Pack boundary
- procurement documentation
- negative claim checks

Positive test:

HBCE-TST-601-POS

Expected result:

Procurement pack is presented as evidence for review.

Negative test:

HBCE-TST-601-NEG

Expected result:

Production readiness or certification claim is rejected.

Evidence:

HBCE-EVD-601-PROCUREMENT-NON-PRODUCTION-BOUNDARY

Audit:

HBCE-AUD-601-PROCUREMENT-NON-PRODUCTION-BOUNDARY

Status:

PLANNED

## 10. API family requirements

### HBCE-REQ-700 - /ipr API contract

Source reference:

V3 contract sections 17 and 18

Requirement:

The /ipr API family must represent identity-participation references and subject linkage.

Implementation target:

- HBCE_PUBLIC_API_CONTRACTS_2027.md
- /ipr request schema
- /ipr response schema
- /ipr error model

Positive test:

HBCE-TST-700-POS

Expected result:

Valid IPR reference returns subject linkage representation.

Negative test:

HBCE-TST-700-NEG

Expected result:

IPR reference does not imply authority or authorization.

Evidence:

HBCE-EVD-700-IPR-API

Audit:

HBCE-AUD-700-IPR-API

Status:

PLANNED

### HBCE-REQ-710 - /authority API contract

Source reference:

V3 contract sections 17 and 18

Requirement:

The /authority API family must evaluate authority derived from mandate, recognition, scope and constraints.

Implementation target:

- HBCE_PUBLIC_API_CONTRACTS_2027.md
- Authority Engine contract
- authority request schema
- authority response schema

Positive test:

HBCE-TST-710-POS

Expected result:

Valid mandate and constraints support authority result.

Negative test:

HBCE-TST-710-NEG

Expected result:

Missing mandate denies authority.

Evidence:

HBCE-EVD-710-AUTHORITY-API

Audit:

HBCE-AUD-710-AUTHORITY-API

Status:

PLANNED

### HBCE-REQ-720 - /authorization API contract

Source reference:

V3 contract sections 17 and 18

Requirement:

The /authorization API family must evaluate bounded action authorization under authority and policy.

Implementation target:

- authorization request schema
- authorization response schema
- bounded action model

Positive test:

HBCE-TST-720-POS

Expected result:

Bounded action with authority and policy passes.

Negative test:

HBCE-TST-720-NEG

Expected result:

Unbounded action denies.

Evidence:

HBCE-EVD-720-AUTHORIZATION-API

Audit:

HBCE-AUD-720-AUTHORIZATION-API

Status:

PLANNED

### HBCE-REQ-730 - /policy API contract

Source reference:

V3 contract sections 17 and 18

Requirement:

The /policy API family must evaluate rules in a fail-closed way.

Implementation target:

- policy request schema
- policy response schema
- policy error model
- unknown state model

Positive test:

HBCE-TST-730-POS

Expected result:

Known valid rule evaluates predictably.

Negative test:

HBCE-TST-730-NEG

Expected result:

Unknown state denies.

Evidence:

HBCE-EVD-730-POLICY-API

Audit:

HBCE-AUD-730-POLICY-API

Status:

PLANNED

### HBCE-REQ-740 - /evidence API contract

Source reference:

V3 contract sections 16, 17 and 18

Requirement:

The /evidence API family must produce, validate, register and classify evidence.

Implementation target:

- evidence request schema
- evidence response schema
- evidence lifecycle model
- P004 registry alignment

Positive test:

HBCE-TST-740-POS

Expected result:

Evidence artifact is created with hash and lifecycle state.

Negative test:

HBCE-TST-740-NEG

Expected result:

Evidence without required fields is blocked.

Evidence:

HBCE-EVD-740-EVIDENCE-API

Audit:

HBCE-AUD-740-EVIDENCE-API

Status:

PLANNED

### HBCE-REQ-750 - /decision API contract

Source reference:

V3 contract sections 17 and 18

Requirement:

The /decision API family must create traceable decisions derived from authority, authorization and policy.

Implementation target:

- decision request schema
- decision response schema
- decision evidence link

Positive test:

HBCE-TST-750-POS

Expected result:

Decision is traceable to authority, authorization and policy references.

Negative test:

HBCE-TST-750-NEG

Expected result:

Decision without authority is denied.

Evidence:

HBCE-EVD-750-DECISION-API

Audit:

HBCE-AUD-750-DECISION-API

Status:

PLANNED

### HBCE-REQ-760 - /events API contract

Source reference:

V3 contract sections 17 and 18

Requirement:

The /events API family must emit traceable events for audit and evidence linkage.

Implementation target:

- event schema
- event id model
- event to evidence mapping

Positive test:

HBCE-TST-760-POS

Expected result:

Event links to evidence and audit reference.

Negative test:

HBCE-TST-760-NEG

Expected result:

Event presence alone does not imply success.

Evidence:

HBCE-EVD-760-EVENTS-API

Audit:

HBCE-AUD-760-EVENTS-API

Status:

PLANNED

### HBCE-REQ-770 - /matrix API contract

Source reference:

V3 contract sections 6, 17 and 18

Requirement:

The /matrix API family must record accepted consequences derived from evidence.

Implementation target:

- MATRIX consequence schema
- evidence-to-consequence mapping
- MATRIX state update rules

Positive test:

HBCE-TST-770-POS

Expected result:

Accepted evidence can produce traceable MATRIX consequence.

Negative test:

HBCE-TST-770-NEG

Expected result:

Unsupported claim cannot update MATRIX.

Evidence:

HBCE-EVD-770-MATRIX-API

Audit:

HBCE-AUD-770-MATRIX-API

Status:

PLANNED

### HBCE-REQ-780 - /business-wallet API contract

Source reference:

V3 contract sections 10, 17 and 18

Requirement:

The /business-wallet API family must receive and normalize business-wallet-like external trust material.

Implementation target:

- /business-wallet request schema
- adapter validation model
- canonical mapping

Positive test:

HBCE-TST-780-POS

Expected result:

Valid external trust material normalizes into canonical representation.

Negative test:

HBCE-TST-780-NEG

Expected result:

Invalid input fails closed.

Evidence:

HBCE-EVD-780-BUSINESS-WALLET-API

Audit:

HBCE-AUD-780-BUSINESS-WALLET-API

Status:

PLANNED

### HBCE-REQ-790 - /health API contract

Source reference:

V3 contract sections 17 and 18

Requirement:

The /health API family must expose non-production diagnostic system health.

Implementation target:

- health endpoint contract
- diagnostic output model

Positive test:

HBCE-TST-790-POS

Expected result:

Health endpoint returns diagnostic state.

Negative test:

HBCE-TST-790-NEG

Expected result:

Health PASS is not interpreted as production readiness.

Evidence:

HBCE-EVD-790-HEALTH-API

Audit:

HBCE-AUD-790-HEALTH-API

Status:

PLANNED

## 11. Golden Demo requirements

### HBCE-REQ-900 - Golden Demo positive path

Source reference:

V3 contract section 20

Requirement:

Golden Demo must demonstrate:

Subject -> Organisation -> Mandate -> Authority -> Authorization -> Execution -> Evidence -> Consequence -> MATRIX(t1)

Implementation target:

- HBCE_GOLDEN_DEMO_SPECIFICATION.md
- Golden Demo fixtures
- positive test
- evidence output

Positive test:

HBCE-TST-900-POS

Expected result:

Complete Golden Demo positive flow PASS with evidence and audit.

Negative test:

HBCE-TST-900-NEG

Expected result:

Positive flow without evidence remains NON_COMPLETED.

Evidence:

HBCE-EVD-900-GOLDEN-DEMO-POSITIVE

Audit:

HBCE-AUD-900-GOLDEN-DEMO-POSITIVE

Status:

PLANNED

### HBCE-REQ-901 - Golden Demo missing mandate negative

Source reference:

V3 contract section 20

Requirement:

Golden Demo must show fail-closed behavior when mandate is missing.

Implementation target:

- Golden Demo negative fixture
- Authority Engine negative test

Positive test:

HBCE-TST-901-POS

Expected result:

Valid mandate supports authority.

Negative test:

HBCE-TST-901-NEG

Expected result:

Missing mandate denies authority and blocks execution.

Evidence:

HBCE-EVD-901-GOLDEN-DEMO-MISSING-MANDATE

Audit:

HBCE-AUD-901-GOLDEN-DEMO-MISSING-MANDATE

Status:

PLANNED

### HBCE-REQ-902 - Golden Demo invalid authority negative

Source reference:

V3 contract section 20

Requirement:

Golden Demo must show fail-closed behavior when authority is invalid.

Implementation target:

- Golden Demo invalid authority fixture
- Authority Engine negative test

Positive test:

HBCE-TST-902-POS

Expected result:

Valid authority allows authorization evaluation.

Negative test:

HBCE-TST-902-NEG

Expected result:

Invalid authority denies authorization and execution.

Evidence:

HBCE-EVD-902-GOLDEN-DEMO-INVALID-AUTHORITY

Audit:

HBCE-AUD-902-GOLDEN-DEMO-INVALID-AUTHORITY

Status:

PLANNED

### HBCE-REQ-903 - Golden Demo unbounded authorization negative

Source reference:

V3 contract section 20

Requirement:

Golden Demo must show fail-closed behavior when authorization is unbounded.

Implementation target:

- unbounded authorization fixture
- Authorization Engine negative test

Positive test:

HBCE-TST-903-POS

Expected result:

Bounded authorization passes.

Negative test:

HBCE-TST-903-NEG

Expected result:

Unbounded authorization denies execution.

Evidence:

HBCE-EVD-903-GOLDEN-DEMO-UNBOUNDED-AUTHORIZATION

Audit:

HBCE-AUD-903-GOLDEN-DEMO-UNBOUNDED-AUTHORIZATION

Status:

PLANNED

### HBCE-REQ-904 - Golden Demo unknown policy negative

Source reference:

V3 contract section 20

Requirement:

Golden Demo must show fail-closed behavior for unknown policy state.

Implementation target:

- unknown policy fixture
- Policy Evaluation negative test

Positive test:

HBCE-TST-904-POS

Expected result:

Known policy state evaluates predictably.

Negative test:

HBCE-TST-904-NEG

Expected result:

Unknown policy state denies or blocks.

Evidence:

HBCE-EVD-904-GOLDEN-DEMO-UNKNOWN-POLICY

Audit:

HBCE-AUD-904-GOLDEN-DEMO-UNKNOWN-POLICY

Status:

PLANNED

### HBCE-REQ-905 - Golden Demo blocked execution negative

Source reference:

V3 contract section 20

Requirement:

Golden Demo must show blocked execution negative case.

Implementation target:

- execution boundary fixture
- execution block test

Positive test:

HBCE-TST-905-POS

Expected result:

Authorized execution produces evidence.

Negative test:

HBCE-TST-905-NEG

Expected result:

Blocked execution produces denial or block evidence.

Evidence:

HBCE-EVD-905-GOLDEN-DEMO-BLOCKED-EXECUTION

Audit:

HBCE-AUD-905-GOLDEN-DEMO-BLOCKED-EXECUTION

Status:

PLANNED

### HBCE-REQ-906 - Golden Demo missing evidence negative

Source reference:

V3 contract section 20

Requirement:

Golden Demo must show that missing evidence prevents success.

Implementation target:

- evidence absence fixture
- Evidence Engine negative test

Positive test:

HBCE-TST-906-POS

Expected result:

Execution with evidence may complete.

Negative test:

HBCE-TST-906-NEG

Expected result:

Execution without evidence remains NON_COMPLETED.

Evidence:

HBCE-EVD-906-GOLDEN-DEMO-MISSING-EVIDENCE

Audit:

HBCE-AUD-906-GOLDEN-DEMO-MISSING-EVIDENCE

Status:

PLANNED

### HBCE-REQ-907 - Golden Demo unsupported MATRIX consequence negative

Source reference:

V3 contract section 20

Requirement:

Golden Demo must show that unsupported MATRIX consequence is denied.

Implementation target:

- MATRIX unsupported consequence fixture
- MATRIX negative test

Positive test:

HBCE-TST-907-POS

Expected result:

Accepted evidence can create consequence.

Negative test:

HBCE-TST-907-NEG

Expected result:

Unsupported claim cannot update MATRIX.

Evidence:

HBCE-EVD-907-GOLDEN-DEMO-UNSUPPORTED-MATRIX-CONSEQUENCE

Audit:

HBCE-AUD-907-GOLDEN-DEMO-UNSUPPORTED-MATRIX-CONSEQUENCE

Status:

PLANNED

## 12. Release Candidate completion requirements

### HBCE-REQ-1000 - Release Candidate scope freeze

Source reference:

V3 contract sections 21, 22 and 26

Requirement:

Release Candidate scope must be frozen before 2027-01-19.

Implementation target:

- release candidate package
- final evidence pack
- final audit report
- human acceptance record

Positive test:

HBCE-TST-1000-POS

Expected result:

Frozen scope references completed or explicitly blocked requirements.

Negative test:

HBCE-TST-1000-NEG

Expected result:

Untracked scope item blocks release candidate acceptance.

Evidence:

HBCE-EVD-1000-RC-SCOPE-FREEZE

Audit:

HBCE-AUD-1000-RC-SCOPE-FREEZE

Status:

PLANNED

### HBCE-REQ-1001 - Release Candidate evidence pack

Source reference:

V3 contract sections 19, 21, 22 and 26

Requirement:

Release Candidate must include a final evidence pack.

Implementation target:

- final evidence pack
- P004 evidence registry alignment
- audit summary

Positive test:

HBCE-TST-1001-POS

Expected result:

Release Candidate evidence pack contains requirement, test, evidence and audit references.

Negative test:

HBCE-TST-1001-NEG

Expected result:

Missing evidence pack blocks release candidate acceptance.

Evidence:

HBCE-EVD-1001-RC-EVIDENCE-PACK

Audit:

HBCE-AUD-1001-RC-EVIDENCE-PACK

Status:

PLANNED

### HBCE-REQ-1002 - Release Candidate human acceptance

Source reference:

V3 contract sections 24 and 26

Requirement:

Release Candidate requires human acceptance.

Implementation target:

- human acceptance record
- final release checkpoint
- acceptance evidence

Positive test:

HBCE-TST-1002-POS

Expected result:

Human acceptance ACCEPTED allows release candidate classification within boundary.

Negative test:

HBCE-TST-1002-NEG

Expected result:

Human acceptance PENDING keeps release candidate NON_COMPLETED.

Evidence:

HBCE-EVD-1002-RC-HUMAN-ACCEPTANCE

Audit:

HBCE-AUD-1002-RC-HUMAN-ACCEPTANCE

Status:

PLANNED

## 13. Matrix summary

Initial matrix contains:

- 12 program-level requirements
- 12 work-package requirements
- 10 API family requirements
- 8 Golden Demo requirements
- 3 Release Candidate completion requirements

Total initial requirements:

45

All requirements are initially PLANNED.

All human acceptance states are initially PENDING.

All implementation targets require future work.

This matrix does not mark any feature complete.

## 14. Immediate next documents

This matrix requires the following next documents:

1. HBCE_AUTHORITY_PROFILE_CONTRACT.md
2. HBCE_BUSINESS_WALLET_ADAPTER_CONTRACT.md
3. HBCE_CANONICAL_EVIDENCE_MODEL_CONTRACT.md
4. HBCE_GOLDEN_DEMO_SPECIFICATION.md
5. HBCE_PUBLIC_API_CONTRACTS_2027.md
6. HBCE_BANKING_EVIDENCE_PACK_INDEX.md

Recommended next document:

HBCE_AUTHORITY_PROFILE_CONTRACT.md

Reason:

Authority Profile is the first September 2026 roadmap item and is required before bounded authorization, execution and Golden Demo can be made coherent.

## 15. Decision rule

This matrix is the first operational derivation of the HBCE Program Realignment V3 Technical Implementation Contract.

It converts program direction into requirement, test, evidence and audit obligations.

It does not implement runtime behavior.

It does not authorize production deployment.

It does not authorize deployment readiness.

It does not authorize L3 readiness.

It does not authorize PostgreSQL runtime readiness or execution.

It does not authorize P04/P05 concurrency execution.

It does not authorize OPC ALLOW.

It does not provide legal certification, eIDAS qualification or regulated KYC/AML provider status.

## 16. Checkpoint state

Document state:

PREPARED_FOR_REVIEW

Human acceptance state:

PENDING
