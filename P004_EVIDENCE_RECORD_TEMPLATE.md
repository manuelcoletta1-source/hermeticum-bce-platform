# P004 EVIDENCE RECORD TEMPLATE

## Status

This document is a P004 operational-documentary template derived from the Runtime Evidence Schema.

Baseline:

MAIN_HEAD=6e17e76 docs(main): record post P004 runtime evidence schema checkpoint
P004_SCHEMA=P004_RUNTIME_EVIDENCE_SCHEMA.md
P004_REGISTRY=P004_EVIDENCE_REGISTRY_INDEX.md
P004_LIFECYCLE=P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
P004_RUNTIME_ALIGNMENT=P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md

## Purpose

The Evidence Record Template defines how a single P004 evidence record should be written for documentary review.

It converts the schema fields into a repeatable record form.

It does not create runtime authorization.

It does not certify production readiness.

It does not authorize deployment, L3, PostgreSQL execution, P04/P05 concurrency execution, OPC ALLOW, legal certification, eIDAS qualification or regulated KYC/AML provider status.

## Template use

Use this template when preparing a P004 evidence record that needs to connect:

- a record identity
- a runtime-facing event reference
- an operation request reference
- a policy evaluation reference
- an OPC proof boundary reference
- an authority resolution reference
- an authorization resolution reference
- a lifecycle state
- boundary flags
- review metadata
- a decision boundary

If a field is not applicable, it must be explicitly marked as `not_applicable` or `null`.

A missing field must not be interpreted as approval.

## Record template

### 1. Record identity

```yaml
evidence_id: ""
evidence_version: "0.1"
evidence_scope: "documentation_only"
record_title: ""
record_summary: ""
created_at: ""
created_by_ref: ""
supersedes: null
superseded_by: null
```

Rules:

- `evidence_id` must be unique within the P004 evidence set.
- `evidence_version` must change when the record content changes.
- `evidence_scope` must remain explicit.
- `supersedes` must be null unless the record replaces a previous record.
- `superseded_by` must be null unless a later record replaces this record.

Boundary:

- record identity does not authorize runtime execution
- versioning does not expand scope
- title and summary are documentary only

### 2. Runtime event reference

```yaml
event_ref: null
event_type: "not_applicable"
event_timestamp: null
event_source: "not_applicable"
event_observation_basis: "not_applicable"
```

Allowed `event_type` values:

- observed_event
- declared_event
- simulated_event
- blocked_event
- denied_event
- prepared_event
- not_applicable

Rules:

- use `not_applicable` when no runtime-facing event exists
- use `blocked_event` when event progression was blocked
- use `denied_event` when event progression was denied
- do not use this section to declare execution permission

Boundary:

- event reference is not automatic proof
- event timestamp is not authorization
- simulated event is not production evidence

### 3. Operation request reference

```yaml
operation_ref: null
operation_class: "documentation"
operation_status: "prepared"
operation_requested_by_ref: null
operation_timestamp: null
operation_summary: ""
```

Allowed `operation_class` values:

- documentation
- review
- evidence_preparation
- evidence_verification
- policy_evaluation
- authority_resolution
- authorization_resolution
- blocked_runtime_request
- denied_runtime_request

Allowed `operation_status` values:

- draft
- prepared
- reviewed
- denied
- blocked
- archived

Rules:

- the operation class must describe the request, not a desired outcome
- blocked or denied runtime requests must stay blocked or denied unless a later approved record supersedes them
- a prepared operation is not an executed operation

Boundary:

- no production deployment
- no PostgreSQL runtime execution
- no P04/P05 concurrency execution
- no OPC ALLOW

### 4. Policy evaluation reference

```yaml
policy_eval_ref: null
policy_eval_result: "not_applicable"
policy_eval_scope: "P004 evidence documentation"
policy_eval_basis: "not_applicable"
policy_eval_timestamp: null
```

Allowed `policy_eval_result` values:

- prepared
- structurally_valid
- structurally_invalid
- denied
- blocked
- inherited
- not_applicable

Rules:

- policy scope must be explicit
- inherited policy evaluation must identify the source record
- structurally valid does not mean operationally allowed
- blocked and denied states must prevent progression

Boundary:

- no implicit allow
- no legal certification
- no production certification

### 5. OPC proof boundary reference

```yaml
opc_boundary_ref: null
opc_boundary_state: "not_applicable"
opc_boundary_basis: "not_applicable"
opc_review_required: false
```

Allowed `opc_boundary_state` values:

- not_applicable
- proof_not_present
- proof_prepared
- proof_reviewed
- proof_blocked
- proof_denied

Rules:

- use `proof_not_present` when OPC proof is required but absent
- use `proof_prepared` only for prepared documentary proof
- do not use `proof_reviewed` as OPC ALLOW

Boundary:

- OPC proof boundary is not OPC ALLOW
- proof preparation is not runtime authorization
- proof review does not bypass human decision

### 6. Authority resolution reference

```yaml
authority_ref: null
authority_type: "not_applicable"
authority_resolution_state: "not_applicable"
authority_basis: "not_applicable"
authority_timestamp: null
```

Allowed `authority_type` values:

- human
- office
- system
- ai_system
- unresolved
- not_applicable

Allowed `authority_resolution_state` values:

- resolved
- unresolved
- blocked
- denied
- not_applicable

Rules:

- unresolved authority must remain blocked for operational progression
- AI-system output must not substitute for human approval
- authority must not be invented from context

Boundary:

- no silent authority promotion
- no AI-as-human authority substitution
- no implicit regulated authority

### 7. Authorization resolution reference

```yaml
authorization_ref: null
authorization_state: "review_only"
authorization_basis: "documentation_only"
authorization_timestamp: null
```

Allowed `authorization_state` values:

- not_requested
- prepared
- denied
- blocked
- review_only

Rules:

- use `review_only` for documentary evidence records
- use `blocked` when authorization cannot proceed
- use `denied` when authorization was explicitly denied
- do not use this field to create production authorization

Boundary:

- no production authorization
- no deployment authorization
- no L3 authorization
- no OPC ALLOW
- no regulated provider authorization

### 8. Evidence lifecycle state

```yaml
lifecycle_state: "PREPARED"
lifecycle_reason: ""
lifecycle_previous_state: null
lifecycle_next_expected_state: "PENDING_REVIEW"
lifecycle_timestamp: ""
```

Allowed `lifecycle_state` values:

- DRAFT
- PREPARED
- VERIFIED
- INHERITED
- SUPERSEDED
- BLOCKED
- REVOKED
- ARCHIVED

Rules:

- lifecycle state must be explicit
- lifecycle reason must be reviewable
- VERIFIED does not mean production approval
- INHERITED does not expand scope
- SUPERSEDED must identify replacement record where available
- BLOCKED and REVOKED must prevent active reliance

Boundary:

- lifecycle state is not runtime authorization
- verification is not deployment readiness
- inheritance is not scope expansion

### 9. Boundary flags

```yaml
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

Rules:

- all canonical boundary flags must be present
- all canonical boundary flags must remain false in this template
- any future boundary change requires explicit human-approved scope change outside this template

Boundary:

- this template cannot authorize a boundary change
- false flags must not be interpreted as pending approval
- absent approval remains absent approval

### 10. Review metadata

```yaml
reviewer_ref: null
review_timestamp: null
review_status: "pending"
review_notes: ""
source_documents:
  - P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
  - P004_OPERATIONAL_EVIDENCE_MAP.md
  - P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
  - P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
  - P004_EVIDENCE_REGISTRY_INDEX.md
  - P004_RUNTIME_EVIDENCE_SCHEMA.md
```

Allowed `review_status` values:

- pending
- reviewed
- blocked
- rejected
- archived

Rules:

- reviewer reference does not imply approval
- review timestamp only records timing
- review notes must not create authorization
- source documents must be listed when used

Boundary:

- review is not runtime execution
- review is not production approval
- review is not legal certification

### 11. Decision boundary

```yaml
human_acceptance_state: "PENDING"
runtime_boundary_state: "documentation_only"
decision_summary: ""
decision_limitations: ""
```

Allowed `human_acceptance_state` values:

- PENDING
- ACCEPTED
- REJECTED
- BLOCKED

Allowed `runtime_boundary_state` values:

- documentation_only
- review_only
- blocked
- denied
- not_applicable

Rules:

- PENDING does not authorize execution
- ACCEPTED must remain scoped
- REJECTED and BLOCKED must prevent progression
- documentation_only must remain non-executive

Boundary:

- no runtime authorization
- no production readiness
- no L3 readiness
- no OPC ALLOW

## Complete blank template

```yaml
evidence_id: ""
evidence_version: "0.1"
evidence_scope: "documentation_only"
record_title: ""
record_summary: ""
created_at: ""
created_by_ref: ""
supersedes: null
superseded_by: null

event_ref: null
event_type: "not_applicable"
event_timestamp: null
event_source: "not_applicable"
event_observation_basis: "not_applicable"

operation_ref: null
operation_class: "documentation"
operation_status: "prepared"
operation_requested_by_ref: null
operation_timestamp: null
operation_summary: ""

policy_eval_ref: null
policy_eval_result: "not_applicable"
policy_eval_scope: "P004 evidence documentation"
policy_eval_basis: "not_applicable"
policy_eval_timestamp: null

opc_boundary_ref: null
opc_boundary_state: "not_applicable"
opc_boundary_basis: "not_applicable"
opc_review_required: false

authority_ref: null
authority_type: "not_applicable"
authority_resolution_state: "not_applicable"
authority_basis: "not_applicable"
authority_timestamp: null

authorization_ref: null
authorization_state: "review_only"
authorization_basis: "documentation_only"
authorization_timestamp: null

lifecycle_state: "PREPARED"
lifecycle_reason: ""
lifecycle_previous_state: null
lifecycle_next_expected_state: "PENDING_REVIEW"
lifecycle_timestamp: ""

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

reviewer_ref: null
review_timestamp: null
review_status: "pending"
review_notes: ""
source_documents:
  - P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
  - P004_OPERATIONAL_EVIDENCE_MAP.md
  - P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
  - P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
  - P004_EVIDENCE_REGISTRY_INDEX.md
  - P004_RUNTIME_EVIDENCE_SCHEMA.md

human_acceptance_state: "PENDING"
runtime_boundary_state: "documentation_only"
decision_summary: ""
decision_limitations: ""
```

## Completion checklist

Before a record is committed, verify:

- evidence_id is present
- evidence_version is present
- evidence_scope is explicit
- lifecycle_state is present
- lifecycle_reason is present
- boundary_flags are complete
- production flags remain false
- OPC ALLOW remains false
- legal and regulated claims remain false
- source documents are listed
- human_acceptance_state is explicit
- runtime_boundary_state is explicit

## Decision rule

This template may be used to prepare a P004 evidence record.

It must not be used as runtime authorization, production approval, deployment readiness, L3 readiness, PostgreSQL runtime readiness, PostgreSQL execution, P04/P05 concurrency execution, OPC ALLOW, legal certification, eIDAS qualification or regulated KYC/AML provider status.
