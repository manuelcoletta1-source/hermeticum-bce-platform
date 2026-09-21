# P004 RUNTIME-TO-EVIDENCE ALIGNMENT

## Status

This document is the third operational deliverable after the P004 merge checkpoint.

Baseline:

MAIN_HEAD=0008262 docs(main): record post P004 lifecycle checkpoint
P004_PLAN=P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
P004_MAP=P004_OPERATIONAL_EVIDENCE_MAP.md
P004_LIFECYCLE=P004_EVIDENCE_LIFECYCLE_STATE_MAP.md

## Purpose

The Runtime-to-Evidence Alignment defines how runtime-facing concepts may be related to evidence records without implying deployment, production readiness or operational authorization.

It connects runtime events, operation requests, policy evaluation, OPC proof boundaries, authority resolution, authorization resolution and evidence lifecycle states.

## Alignment principle

Runtime activity must not be treated as evidence unless it is captured, structured, referenced and reviewed under an explicit evidence lifecycle state.

Evidence may describe runtime behavior.

Evidence must not by itself authorize runtime behavior.

## Alignment layers

### 1. Runtime event

A runtime event is an observed or declared system occurrence.

Allowed relationship to evidence:

- may generate an evidence candidate
- may be referenced by an evidence record
- may support audit review if captured with sufficient context
- may remain non-authoritative until verified

Not allowed relationship:

- automatic proof
- automatic authorization
- automatic production readiness
- automatic OPC ALLOW

### 2. Operation request

An operation request is a proposed action or system-level intent.

Allowed relationship to evidence:

- may be bound to policy evaluation material
- may reference authority and authorization context
- may produce evidence of request handling
- may be denied, blocked or prepared without execution

Not allowed relationship:

- implicit execution approval
- implicit PostgreSQL execution
- implicit deployment
- implicit L3 promotion

### 3. Policy evaluation

A policy evaluation describes whether the requested action is structurally valid under the policy model.

Allowed relationship to evidence:

- may be recorded as PREPARED or VERIFIED evidence
- may support denial or fail-closed reasoning
- may provide reviewable policy provenance
- may be inherited by later checkpoints without expanding scope

Not allowed relationship:

- automatic operational allow
- legal certification
- production certification

### 4. OPC proof boundary

The OPC proof boundary separates proof preparation from operational permission.

Allowed relationship to evidence:

- may record whether proof context exists
- may preserve blocked or denied states
- may document why OPC ALLOW is unavailable
- may support review of proof completeness

Not allowed relationship:

- implicit OPC ALLOW
- bypass of human decision
- runtime execution authorization

### 5. Authority resolution

Authority resolution identifies the declared authority reference for a requested action or evidence claim.

Allowed relationship to evidence:

- may bind authority reference, version and scope
- may distinguish human, office and AI-system references
- may support reviewable decision provenance
- may preserve authority ambiguity as BLOCKED

Not allowed relationship:

- invented authority
- silent authority promotion
- substitution of human approval

### 6. Authorization resolution

Authorization resolution determines whether the request may proceed under available policy, proof and authority context.

Allowed relationship to evidence:

- may document allow, deny, blocked or prepared states
- may support fail-closed behavior
- may become verified evidence for the declared review scope
- may be inherited by later checkpoints without expanding scope

Not allowed relationship:

- implicit production deployment
- implicit regulated status
- implicit PostgreSQL execution

### 7. Evidence lifecycle state

The evidence lifecycle state controls whether an evidence record is draft, prepared, verified, inherited, superseded, blocked, revoked or archived.

Allowed relationship to runtime:

- DRAFT may describe incomplete runtime evidence
- PREPARED may be ready for validation
- VERIFIED may support review within declared scope
- INHERITED may preserve previous verified baseline
- BLOCKED may stop operational progression
- REVOKED may stop active reliance
- ARCHIVED may preserve traceability without active use

Not allowed relationship:

- lifecycle state as runtime authorization
- lifecycle state as deployment approval
- lifecycle state as OPC ALLOW

## Alignment flow

The intended alignment flow is:

Runtime Event -> Operation Request -> Policy Evaluation -> OPC Proof Boundary -> Authority Resolution -> Authorization Resolution -> Evidence Lifecycle State -> Runtime Boundary

This flow is documentary and review-oriented.

It does not execute runtime operations.

## Runtime boundary

The current repository state may support documentation, review, evidence mapping and lifecycle control.

The current repository state does not authorize:

- production deployment
- L3 promotion
- PostgreSQL runtime execution
- P04/P05 concurrency execution
- OPC ALLOW
- legal certification
- eIDAS qualification
- regulated KYC/AML provider status

## Allowed use

This alignment may be used to:

- structure future runtime-facing evidence
- prepare audit-oriented documentation
- identify missing runtime-to-evidence links
- support review of event, operation, policy, OPC, authority and authorization chains
- prepare future tests without executing production behavior

## Not allowed use

This alignment must not be used to claim:

- runtime readiness
- production readiness
- deployment readiness
- L3 readiness
- PostgreSQL readiness
- executed concurrency verification
- OPC ALLOW

## Decision rule

Runtime-to-evidence alignment may organize review and verification work.

It must not be treated as runtime authorization, production approval or operational execution without explicit human approval.
