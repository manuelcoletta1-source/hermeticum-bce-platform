# HBCE Platform Core Data Model v1

Status: SPECIFICATION
Program: HBCE PLATFORM
Layer: PLATFORM CORE SEMANTIC MODEL
Version: 1.0-draft
Implementation state: NOT IMPLEMENTED
Validation state: NOT YET TESTED

## 1. Purpose

This specification defines the minimum canonical semantic model required by HBCE Platform to reconstruct why an operational action could occur, who or what acted, on whose behalf, under which mandate, with which capability, authority and authorization, inside which operational space, with which execution evidence, and with which resulting consequence and state transition.

This specification does not replace the existing IPR, EVT, OPC or public registry schemas.

It defines the semantic layer that connects identity and operational authority to execution, evidence and subsequent state.

The core sequence is:

SUBJECT
→ IDENTITY
→ PRINCIPAL
→ MANDATE
→ CAPABILITY
→ AUTHORITY
→ AUTHORIZATION
→ IOSPACE
→ EXCHANGE
→ EXECUTION
→ EVT
→ OPC
→ CONSEQUENCE
→ MATRIX STATE UPDATE
→ FEEDBACK

The corresponding HBCE operational grammar is:

IPR
→ MANDATE
→ CAPABILITY
→ AUTHORITY
→ AUTHORIZATION
→ IOSPACE
→ METAEXCHANGE
→ EXECUTION
→ EVT
→ OPC
→ MATRIX(t1)
→ NEUROLOOP

## 2. Architectural boundary

HBCE Platform uses one semantic core with domain adapters.

The core must not encode banking, enterprise, robotics, space, energy or public-sector assumptions directly.

Domain-specific semantics belong in adapters that map domain concepts onto the canonical core.

Examples:

Banking:

CUSTOMER
→ MANDATE
→ AGENT
→ PAYMENT CAPABILITY
→ AUTHORITY LIMIT
→ AUTHORIZATION
→ EXECUTION
→ EVT
→ OPC
→ OUTCOME

Enterprise:

EMPLOYEE / ORGANIZATION
→ DELEGATION
→ AGENT
→ WORKFLOW CAPABILITY
→ AUTHORITY
→ APPROVAL / AUTHORIZATION
→ EXECUTION
→ AUDITABLE CONSEQUENCE

Physical systems:

ORGANIZATION
→ SITE
→ FLEET
→ UNIT
→ MODEL / POLICY VERSION
→ TASK CAPABILITY
→ AUTHORITY
→ AUTHORIZATION
→ PHYSICAL EXECUTION
→ CONSEQUENCE

## 3. Mandatory semantic separations

The following distinctions are invariants of the Platform Core Data Model:

IDENTITY != PRINCIPAL

PRINCIPAL != ACTOR

MANDATE != CAPABILITY

CAPABILITY != AUTHORITY

AUTHORITY != AUTHORIZATION

MANDATE != AUTHORIZATION

DECISION != AUTHORIZATION

AUTHORIZATION != EXECUTION

EXECUTION != SUCCESS

EXECUTION != OUTCOME

OUTCOME != CONSEQUENCE

TRACE != TRUTH

OBSERVATION != INFERENCE

TECHNICAL VALIDATION != CERTIFICATION

CONTACT != BUYER INTENT

COMMERCIAL ACCEPTANCE != PAYMENT

Existing EVT `decision`, `human_review` and `policy_state` fields must not be reinterpreted as canonical AUTHORIZATION or AUTHORITY objects.

Existing OPC `decision_state`, `human_review`, `policy_state` and `verification_state` fields must not be reinterpreted as canonical AUTHORIZATION or AUTHORITY objects.

## 4. Fail-closed semantic rule

UNKNOWN must never be silently converted into TRUE, FALSE, ALLOW, DENY, AUTHORIZED or UNAUTHORIZED.

When an operation requires a semantic prerequisite and that prerequisite cannot be proven, the system must return one of the following classes of result:

STOP

DENY

REQUIRE_AUTHORIZATION

REVIEW_REQUIRED

ESCALATE

UNKNOWN

The exact runtime representation is implementation-specific and is not defined by this specification.

## 5. Canonical entities

### 5.1 SUBJECT

SUBJECT represents the entity associated with an identity or operational record.

A SUBJECT may represent, depending on the applicable profile:

- a human;
- an organization;
- an AI system;
- an operational agent;
- a device;
- a vehicle;
- a robot;
- a node;
- a workflow;
- another explicitly modelled entity.

SUBJECT does not by itself establish operational authority.

### 5.2 IDENTITY

IDENTITY establishes an operational identity reference for a SUBJECT.

Within the existing HBCE architecture, IPR is the primary identity mechanism.

IDENTITY answers:

WHO OR WHAT IS THIS?

IDENTITY does not answer:

WHAT MAY IT DO?

FOR WHOM MAY IT ACT?

WHO AUTHORIZED THE ACTION?

### 5.3 PRINCIPAL

PRINCIPAL is the entity on whose behalf an ACTOR performs an operation.

A PRINCIPAL may be identical to the ACTOR, but the model must never assume this implicitly.

Examples include:

- a person acting for themselves;
- an AI agent acting for a customer;
- an employee acting for an organization;
- a robot acting for an operator;
- a service acting for another system.

PRINCIPAL must be explicitly reconstructible when delegation exists.

### 5.4 MANDATE

MANDATE represents the relationship that permits an ACTOR to act for a PRINCIPAL within declared boundaries.

MANDATE must support at least:

- mandate reference;
- principal reference;
- actor reference;
- scope;
- constraints;
- validity interval;
- issuing source;
- current state;
- version;
- revocation reference where applicable.

MANDATE establishes delegated relationship.

MANDATE does not itself authorize every individual action.

### 5.5 CAPABILITY

CAPABILITY represents an operation class that an ACTOR or component is technically or logically able to perform.

Examples:

- submit a payment request;
- analyze a document;
- generate a draft;
- approve a workflow;
- operate a robotic unit;
- update a registry;
- invoke an external service.

CAPABILITY answers:

WHAT OPERATION CLASS CAN THIS ENTITY PERFORM?

CAPABILITY does not establish that the entity is currently authorized to perform it.

### 5.6 AUTHORITY

AUTHORITY represents the bounded power under which an action may be authorized.

AUTHORITY must be derived from an identifiable source.

AUTHORITY must support at least:

- authority reference;
- authority source;
- principal reference;
- mandate reference where applicable;
- capability reference;
- scope;
- target constraints;
- temporal constraints;
- quantitative or policy limits where applicable;
- version;
- state;
- revocation reference.

AUTHORITY must be versioned.

A stale or revoked authority must not support a new AUTHORIZATION.

### 5.7 AUTHORIZATION

AUTHORIZATION represents the specific approval permitting a defined action under a valid AUTHORITY.

AUTHORIZATION must bind at least:

- authorization reference;
- authority reference;
- authority version;
- mandate reference where applicable;
- actor reference;
- principal reference;
- IOSPACE reference;
- action;
- target;
- constraints;
- validity;
- decision time;
- authorizer reference or policy reference;
- authorization digest;
- state.

AUTHORIZATION is action-specific or explicitly scope-specific.

An AUTHORIZATION must not remain valid when a prerequisite authority or mandate has been revoked, superseded, expired or otherwise rendered invalid.

### 5.8 IOSPACE

IOSPACE represents the bounded operational environment in which an authorized action may occur.

IOSPACE may describe:

- logical environment;
- organizational environment;
- territorial environment;
- infrastructure boundary;
- device or fleet boundary;
- application boundary;
- transaction environment;
- physical operational space.

IOSPACE must not be interpreted merely as a UI route or product module.

The canonical IOSPACE object defines an operational boundary.

### 5.9 EXCHANGE

EXCHANGE represents a controlled interaction between operational entities, systems or domains.

MetaExchange may implement or support EXCHANGE semantics, but the canonical semantic object is EXCHANGE.

EXCHANGE may bind:

- sender;
- receiver;
- exchanged capability;
- action reference;
- data or proof reference;
- protocol;
- authorization reference;
- IOSPACE reference;
- timestamp;
- execution reference.

### 5.10 EXECUTION

EXECUTION represents the attempted or completed performance of an authorized action.

EXECUTION must be distinguishable from AUTHORIZATION.

An authorization may exist without execution.

An execution may fail.

An execution may complete technically without achieving the intended outcome.

EXECUTION must support at least:

- execution reference;
- authorization reference;
- actor reference;
- action;
- target;
- start time;
- completion time where applicable;
- execution state;
- output reference where applicable;
- evidence reference;
- error reference where applicable.

Execution without a valid required AUTHORIZATION must fail closed.

### 5.11 EVT

EVT remains the HBCE operational event representation.

The existing EVT schema is not replaced by this specification.

EVT records what happened or what operational state was observed.

Future integration may add references from EVT to Platform Core objects, but existing historical EVT records must remain valid under their original schema and interpretation.

### 5.12 OPC

OPC remains the HBCE operational proof layer.

The existing OPC receipt schema is not replaced by this specification.

OPC provides evidence-oriented operational proof references linked to events and workflows.

OPC does not create authority or authorization.

### 5.13 OUTCOME

OUTCOME represents the direct result of an EXECUTION.

Examples:

- request accepted;
- request rejected;
- document generated;
- transaction submitted;
- transaction failed;
- robotic task completed;
- robotic task interrupted.

OUTCOME does not necessarily represent the wider consequence of the action.

### 5.14 CONSEQUENCE

CONSEQUENCE represents the observed or attributable effect following an execution or outcome.

CONSEQUENCE must remain distinguishable from prediction and intention.

A consequence may be:

- immediate;
- delayed;
- technical;
- operational;
- financial;
- organizational;
- physical;
- regulatory;
- human-observed;
- machine-observed.

Where consequence cannot yet be established, its state must remain UNKNOWN rather than inferred as true.

### 5.15 MATRIX STATE

MATRIX represents a declared operational state model.

MATRIX(t0) is the relevant state before the governed action.

MATRIX(t1) is the relevant state after the governed action and consequence processing.

MATRIX is not identical to reality.

MATRIX(t0) != MATRIX(t1)

A state update must preserve the relationship between prior state, action, evidence, consequence and new state.

### 5.16 FEEDBACK

FEEDBACK represents information derived from observed outcome, consequence or state transition that may influence subsequent policy, capability, authority, authorization, prediction or execution.

NeuroLoop may implement or support feedback processing.

FEEDBACK must never retroactively alter historical events or evidence.

## 6. Universal Act Model

A governed HBCE act must be reconstructible through the following minimum semantic dimensions:

ACTOR

PRINCIPAL

MANDATE

CAPABILITY

AUTHORITY

AUTHORIZATION

IOSPACE

ACTION

TARGET

TIME

EXECUTION

EVIDENCE

OUTCOME

CONSEQUENCE

STATE_BEFORE

STATE_AFTER

Not every field must contain a positive value.

When a field is not applicable, the implementation must represent that explicitly.

When a required field cannot be established, the result must remain UNKNOWN or fail closed according to policy.

## 7. Minimum lifecycle state vocabulary

The Platform Core Data Model defines the following generic state vocabulary:

DRAFT

PENDING

ACTIVE

LIMITED

AUTHORIZED

DENIED

EXECUTING

EXECUTED

FAILED

SUSPENDED

CONTESTED

COMPROMISED

EXPIRED

REVOKED

SUPERSEDED

UNKNOWN

Domain objects may use constrained subsets.

Existing IPR, EVT, OPC and registry status vocabularies remain valid and must not be rewritten retroactively merely to match this generic vocabulary.

## 8. Genealogy

Core objects must support append-only genealogy where applicable.

The minimum genealogy model is:

DERIVED_FROM

PREVIOUS_STATE

NEW_STATE

CAUSE

EVIDENCE

TIMESTAMP

HASH

Permitted evolution operations are:

APPEND

DERIVE

SUPERSEDE

REVOKE

Historical records must not be overwritten or retrodated.

## 9. Revocation propagation

Revocation must be explicit and reconstructible.

If a MANDATE becomes revoked, expired or superseded, dependent AUTHORITY and AUTHORIZATION objects must not be silently treated as valid.

If an AUTHORITY becomes revoked, expired or superseded, dependent AUTHORIZATION objects must not authorize new execution.

If an AUTHORIZATION becomes revoked, expired or superseded before execution, the corresponding operation must fail closed.

Historical EXECUTION, EVT and OPC records remain historical facts and must not be deleted merely because their prerequisite authority later changes state.

## 10. Evidence model

The Platform Core must prefer references over unnecessary data custody.

Preferred representations include:

REFERENCE

DIGEST

CLAIM

ATTESTATION

SELECTIVE_DISCLOSURE

VERIFIABLE_RELATIONSHIP

Raw sensitive evidence should remain outside public proof layers unless a separate controlled architecture explicitly permits custody.

TRACE != TRUTH

A hash proves correspondence with a referenced payload when correctly verified.

A hash does not independently prove the truth, legality or correctness of the underlying claim.

## 11. Existing schema compatibility

The following existing schemas remain independently canonical within their current scopes:

schemas/ipr.schema.json

schemas/hbce-evt.schema.json

schemas/receipt.schema.json

schemas/hbce-registry-entry.schema.json

This specification must not introduce breaking reinterpretation of those schemas.

Future Platform Core schemas should reference existing objects where appropriate instead of duplicating them.

## 12. Implementation classification

At publication of this specification:

IPR: IMPLEMENTED / EXISTING SCOPE

EVT: IMPLEMENTED / EXISTING SCOPE

OPC: IMPLEMENTED / EXISTING SCOPE

REGISTRY: IMPLEMENTED / EXISTING PUBLIC PROOF SCOPE

PRINCIPAL: SPECIFIED / NOT IMPLEMENTED

MANDATE: SPECIFIED / NOT IMPLEMENTED

CAPABILITY: SPECIFIED / NOT IMPLEMENTED AS CORE OBJECT

AUTHORITY: SPECIFIED / NOT IMPLEMENTED AS CORE OBJECT

AUTHORIZATION: SPECIFIED / NOT IMPLEMENTED AS CORE OBJECT

IOSPACE: SPECIFIED / EXISTING MODULE, NOT IMPLEMENTED AS CORE OBJECT

EXCHANGE: SPECIFIED / EXISTING CONCEPT, NOT IMPLEMENTED AS CORE OBJECT

EXECUTION: SPECIFIED / PARTIAL EXISTING CONCEPT, NOT IMPLEMENTED AS CORE OBJECT

OUTCOME: SPECIFIED / PARTIAL EXISTING CONCEPT

CONSEQUENCE: SPECIFIED / NOT IMPLEMENTED AS CORE OBJECT

MATRIX STATE: SPECIFIED / FRAMEWORK EXISTS, CANONICAL STATE ENGINE NOT IMPLEMENTED

FEEDBACK: SPECIFIED / EXISTING CONCEPT, CANONICAL CORE OBJECT NOT IMPLEMENTED

## 13. Golden Flow target

The first Platform Core implementation must be capable of representing the following governed action without semantic collapse:

MANUEL
→ IPR
→ MANDATE
→ JOKER-C2 PROPOSES ACTION
→ DRAFT
→ HASH
→ HUMAN AUTHORIZATION
→ EXECUTION
→ EVT
→ OPC
→ MATRIX STATE UPDATE

The model must prove at minimum:

who acted;

on whose behalf;

under which mandate;

with which capability;

under which authority;

under which authorization;

inside which operational boundary;

what action was executed;

when it was executed;

which evidence exists;

what outcome occurred;

what consequence was observed;

what state existed before;

what state exists after.

## 14. Security requirements

The Platform Core must explicitly account for:

privilege escalation;

confused deputy conditions;

delegation chains;

stale authorization;

revoked mandates;

cross-domain authority confusion;

identity / authority conflation;

authorization replay;

tampering;

execution without authorization;

authorization without matching execution;

race conditions;

compromised agents or devices;

human override;

emergency authority;

revocation propagation;

audit reconstruction.

Security implementation is outside the scope of this semantic specification, but future schemas and runtime controls must preserve these distinctions.

## 15. Non-claims

This specification is an R&D architecture specification.

It does not by itself constitute:

legal authorization;

legal identity certification;

regulated KYC / AML;

eIDAS qualification;

public authority approval;

banking authorization;

cybersecurity certification;

production readiness;

external market validation.

## 16. Next implementation step

The next implementation step after semantic verification of this document is to define JSON Schema objects for the minimum Platform Core primitives.

No runtime enforcement should be claimed until schemas, validators, tests and execution controls are separately implemented and verified.
