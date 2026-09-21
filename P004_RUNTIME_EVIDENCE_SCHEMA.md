# P004 RUNTIME EVIDENCE SCHEMA

## Status

This document is the next P004 operational deliverable after the Evidence Registry Index checkpoint.

Baseline:

MAIN_HEAD=f467095 docs(main): record post P004 evidence registry checkpoint
P004_PLAN=P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
P004_MAP=P004_OPERATIONAL_EVIDENCE_MAP.md
P004_LIFECYCLE=P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
P004_RUNTIME_ALIGNMENT=P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
P004_REGISTRY=P004_EVIDENCE_REGISTRY_INDEX.md
P004_REGISTRY_CHECKPOINT=MAIN_POST_P004_EVIDENCE_REGISTRY_CHECKPOINT_2026_09_21.md

## Purpose

The Runtime Evidence Schema defines a documentary structure for runtime-facing evidence records.

It provides field-level organization for reviewable runtime evidence without executing runtime behavior.

It does not create runtime authorization.

It does not certify production readiness.

It does not replace policy evaluation, OPC proof review, authority resolution, authorization resolution or human approval.

## Schema principle

A runtime evidence record may describe a runtime-facing event, operation request, policy evaluation, OPC boundary, authority reference, authorization reference, lifecycle state and boundary flags.

A runtime evidence record must not by itself authorize runtime execution.

A schema may structure evidence.

A schema must not transform evidence into operational permission.

## Canonical field groups

The schema is organized into the following field groups:

1. Record identity
2. Runtime event reference
3. Operation request reference
4. Policy evaluation reference
5. OPC proof boundary reference
6. Authority resolution reference
7. Authorization resolution reference
8. Evidence lifecycle state
9. Boundary flags
10. Review metadata
11. Decision boundary

## Record identity fields

### evidence_id

Purpose:

- identifies the runtime evidence record
- supports audit lookup
- supports registry indexing

Required:

- yes

Boundary:

- must not imply runtime authorization
- must not imply production readiness
- must not imply OPC ALLOW

### evidence_version

Purpose:

- identifies the version of the evidence record
- supports controlled updates
- supports supersession tracking

Required:

- yes

Boundary:

- must not silently expand reviewed scope
- must not overwrite previous evidence without traceability

### evidence_scope

Purpose:

- defines the declared scope of the evidence record

Required:

- yes

Boundary:

- must remain explicit
- must not expand into production scope unless explicitly approved
- must not imply regulated status

## Runtime event fields

### event_ref

Purpose:

- references a runtime-facing event or declared runtime occurrence

Required:

- yes when the evidence record is event-derived
- optional when the evidence record is policy-only or schema-only

Boundary:

- must not be treated as automatic proof
- must not authorize execution
- must not authorize deployment

### event_type

Purpose:

- classifies the runtime-facing event

Allowed values:

- observed_event
- declared_event
- simulated_event
- blocked_event
- denied_event
- prepared_event

Not allowed values:

- production_authorized_event
- opc_allow_event
- legal_certification_event

### event_timestamp

Purpose:

- records when the event was observed, declared or prepared

Boundary:

- timestamp supports ordering
- timestamp does not establish authorization

## Operation request fields

### operation_ref

Purpose:

- references the operation request related to the evidence record

Required:

- yes when an operation request exists
- optional for non-operation evidence

Boundary:

- must not imply execution approval
- must not imply PostgreSQL execution
- must not imply P04/P05 concurrency execution

### operation_class

Purpose:

- classifies the requested operation

Allowed values:

- documentation
- review
- evidence_preparation
- evidence_verification
- policy_evaluation
- authority_resolution
- authorization_resolution
- blocked_runtime_request
- denied_runtime_request

Not allowed values:

- production_deployment
- l3_promotion
- postgresql_runtime_execution
- p04_p05_concurrency_execution
- opc_allow

### operation_status

Purpose:

- records the handling status of the operation request

Allowed values:

- draft
- prepared
- reviewed
- denied
- blocked
- archived

Boundary:

- operation_status is documentary
- operation_status is not runtime permission

## Policy evaluation fields

### policy_eval_ref

Purpose:

- references the policy evaluation associated with the evidence record

Required:

- yes when policy evaluation exists
- optional when the record only indexes non-policy documentary evidence

Boundary:

- must not imply operational allow
- must not imply legal certification
- must not imply production certification

### policy_eval_result

Purpose:

- records the documentary result of policy evaluation

Allowed values:

- prepared
- structurally_valid
- structurally_invalid
- denied
- blocked
- inherited
- not_applicable

Not allowed values:

- opc_allow
- production_ready
- deployment_ready
- legally_certified

### policy_eval_scope

Purpose:

- defines the reviewed policy scope

Boundary:

- scope must be explicit
- inherited scope must not expand automatically

## OPC proof boundary fields

### opc_boundary_ref

Purpose:

- references the OPC proof boundary associated with the evidence record

Required:

- yes when OPC proof context exists
- optional otherwise

Boundary:

- must not imply OPC ALLOW
- must not bypass human decision
- must not authorize runtime execution

### opc_boundary_state

Purpose:

- records the OPC boundary state

Allowed values:

- not_applicable
- proof_not_present
- proof_prepared
- proof_reviewed
- proof_blocked
- proof_denied

Not allowed values:

- opc_allow
- implicit_allow
- runtime_authorized

## Authority resolution fields

### authority_ref

Purpose:

- references the declared authority relevant to the evidence record

Required:

- yes when a decision, approval, denial or authority claim exists

Boundary:

- must not invent authority
- must not silently promote authority
- must not substitute AI output for human approval

### authority_type

Purpose:

- classifies the declared authority source

Allowed values:

- human
- office
- system
- ai_system
- unresolved
- not_applicable

Boundary:

- ai_system is not human authority
- unresolved authority must remain blocked for operational progression

### authority_resolution_state

Purpose:

- records the resolution state of authority

Allowed values:

- resolved
- unresolved
- blocked
- denied
- not_applicable

## Authorization resolution fields

### authorization_ref

Purpose:

- references the authorization resolution associated with the evidence record

Required:

- yes when authorization evaluation exists

Boundary:

- must not imply production deployment
- must not imply regulated status
- must not imply PostgreSQL execution
- must not imply OPC ALLOW

### authorization_state

Purpose:

- records the documentary authorization state

Allowed values:

- not_requested
- prepared
- denied
- blocked
- review_only

Not allowed values:

- production_authorized
- deployment_authorized
- l3_authorized
- opc_allow
- regulated_provider_authorized

## Evidence lifecycle fields

### lifecycle_state

Purpose:

- records the lifecycle state of the evidence record

Required:

- yes

Allowed values:

- DRAFT
- PREPARED
- VERIFIED
- INHERITED
- SUPERSEDED
- BLOCKED
- REVOKED
- ARCHIVED

Boundary:

- lifecycle state is not runtime authorization
- VERIFIED does not mean production approval
- INHERITED does not expand scope
- BLOCKED and REVOKED must prevent active reliance

### lifecycle_reason

Purpose:

- records why the lifecycle state was assigned

Required:

- yes

Boundary:

- reason must be reviewable
- reason must not be implied silently

## Boundary flags

### boundary_flags

Purpose:

- records explicit negative authorization boundaries for the evidence record

Required:

- yes

Canonical flags:

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

Boundary:

- any change to a boundary flag requires explicit human-approved scope change
- this schema does not authorize such a change

## Review metadata fields

### reviewer_ref

Purpose:

- records the reviewer or review authority reference when available

Required:

- optional

Boundary:

- reviewer_ref is not automatic approval
- reviewer_ref must not substitute for explicit authorization

### review_timestamp

Purpose:

- records when review occurred

Required:

- optional

Boundary:

- timestamp supports ordering
- timestamp does not authorize runtime behavior

### source_documents

Purpose:

- lists source documents used by the evidence record

Required:

- yes

Expected references:

- P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
- P004_OPERATIONAL_EVIDENCE_MAP.md
- P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
- P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
- P004_EVIDENCE_REGISTRY_INDEX.md

## Decision boundary fields

### human_acceptance_state

Purpose:

- records human acceptance status

Allowed values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Boundary:

- PENDING does not authorize execution
- ACCEPTED must remain scoped
- REJECTED and BLOCKED must prevent progression

### runtime_boundary_state

Purpose:

- records the runtime boundary status

Allowed values:

- documentation_only
- review_only
- blocked
- denied
- not_applicable

Not allowed values:

- production_ready
- runtime_authorized
- l3_ready
- opc_allow

## Review use

This schema may be used to:

- prepare future runtime-facing evidence records
- structure documentary review
- align evidence records with P004 lifecycle states
- preserve runtime-to-evidence boundaries
- support future tests without executing production behavior

## Not allowed use

This schema must not be used to claim:

- runtime readiness
- production readiness
- deployment readiness
- L3 readiness
- PostgreSQL readiness
- PostgreSQL execution
- P04/P05 concurrency verification
- OPC ALLOW
- legal certification
- eIDAS qualification
- regulated KYC/AML provider status

## Decision rule

The Runtime Evidence Schema may organize evidence fields.

It must not be treated as evidence execution, runtime authorization, production approval, legal certification, eIDAS qualification or regulated provider status.
