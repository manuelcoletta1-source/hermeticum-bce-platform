# P004 EVIDENCE REGISTRY INDEX

## Status

This document is the next P004 operational deliverable after the runtime-to-evidence alignment checkpoint.

Baseline:

MAIN_HEAD=11d28b6 docs(main): record post P004 runtime alignment checkpoint
P004_PLAN=P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
P004_MAP=P004_OPERATIONAL_EVIDENCE_MAP.md
P004_LIFECYCLE=P004_EVIDENCE_LIFECYCLE_STATE_MAP.md
P004_RUNTIME_ALIGNMENT=P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md
P004_RUNTIME_ALIGNMENT_CHECKPOINT=MAIN_POST_P004_RUNTIME_ALIGNMENT_CHECKPOINT_2026_09_21.md

## Purpose

The Evidence Registry Index provides a canonical documentary index for the P004 evidence layer.

It does not create runtime authorization.

It does not certify production readiness.

It does not replace evidence records, tests, policy evaluations, OPC proofs, authority decisions or human approval.

## Registry principle

An evidence registry may organize references.

An evidence registry must not transform references into operational permission.

A listed document may support review.

A listed document must not be treated as automatic authorization.

## Indexed P004 documents

### 1. Operational Evidence Layer Plan

Document:

- P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md

Role:

- defines the initial operational evidence layer plan
- establishes the review-oriented documentation baseline
- frames the evidence layer without production authorization

Registry classification:

- type: plan
- scope: P004 evidence layer
- runtime effect: none
- authorization effect: none

Boundary:

- does not authorize deployment
- does not authorize L3 promotion
- does not authorize OPC ALLOW
- does not certify legal or regulated status

### 2. Operational Evidence Map

Document:

- P004_OPERATIONAL_EVIDENCE_MAP.md

Role:

- maps operational evidence concepts
- connects evidence categories to review needs
- supports traceability across P004 evidence documentation

Registry classification:

- type: map
- scope: P004 evidence structure
- runtime effect: none
- authorization effect: none

Boundary:

- does not execute tests
- does not execute runtime operations
- does not authorize production use
- does not certify compliance status

### 3. Evidence Lifecycle State Map

Document:

- P004_EVIDENCE_LIFECYCLE_STATE_MAP.md

Role:

- defines evidence lifecycle states
- distinguishes draft, prepared, verified, inherited, superseded, blocked, revoked and archived evidence states
- supports fail-closed review and evidence state control

Registry classification:

- type: lifecycle map
- scope: evidence state control
- runtime effect: none
- authorization effect: none

Boundary:

- lifecycle state is not runtime authorization
- verified evidence is not production approval
- inherited evidence does not expand scope
- blocked or revoked evidence must not support operational progression

### 4. Runtime-to-Evidence Alignment

Document:

- P004_RUNTIME_TO_EVIDENCE_ALIGNMENT.md

Role:

- defines the documentary alignment between runtime-facing concepts and evidence records
- connects runtime events, operation requests, policy evaluation, OPC proof boundary, authority resolution, authorization resolution, evidence lifecycle state and runtime boundary
- preserves the separation between evidence and authorization

Registry classification:

- type: alignment
- scope: runtime-facing evidence documentation
- runtime effect: none
- authorization effect: none

Boundary:

- does not execute runtime operations
- does not authorize PostgreSQL runtime execution
- does not authorize P04/P05 concurrency execution
- does not authorize OPC ALLOW
- does not authorize production deployment

## Indexed P004 checkpoints

### 1. P004 merge checkpoint

Document:

- MAIN_POST_P004_MERGE_CHECKPOINT_2026_09_20.md

Role:

- records the post-merge state after the initial P004 operational evidence layer integration

Registry classification:

- type: checkpoint
- scope: main branch documentary baseline
- runtime effect: none
- authorization effect: none

### 2. P004 evidence map checkpoint

Document:

- MAIN_POST_P004_EVIDENCE_MAP_CHECKPOINT_2026_09_20.md

Role:

- records the main branch state after the P004 operational evidence map integration

Registry classification:

- type: checkpoint
- scope: main branch documentary baseline
- runtime effect: none
- authorization effect: none

### 3. P004 lifecycle checkpoint

Document:

- MAIN_POST_P004_LIFECYCLE_CHECKPOINT_2026_09_21.md

Role:

- records the main branch state after the P004 evidence lifecycle state map integration

Registry classification:

- type: checkpoint
- scope: main branch documentary baseline
- runtime effect: none
- authorization effect: none

### 4. P004 runtime alignment checkpoint

Document:

- MAIN_POST_P004_RUNTIME_ALIGNMENT_CHECKPOINT_2026_09_21.md

Role:

- records the main branch state after PR #8 and the runtime-to-evidence alignment integration

Registry classification:

- type: checkpoint
- scope: main branch documentary baseline
- runtime effect: none
- authorization effect: none

## Registry reference chain

The current P004 evidence registry chain is:

Operational Evidence Layer Plan
-> Operational Evidence Map
-> Evidence Lifecycle State Map
-> Runtime-to-Evidence Alignment
-> Evidence Registry Index

The checkpoint chain is:

P004 Merge Checkpoint
-> P004 Evidence Map Checkpoint
-> P004 Lifecycle Checkpoint
-> P004 Runtime Alignment Checkpoint

## Review use

This registry may be used to:

- locate P004 evidence-layer documents
- distinguish document role and scope
- support future audit review
- prepare future evidence schema work
- identify missing evidence links
- preserve boundary statements across P004 documents

## Not allowed use

This registry must not be used to claim:

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

## Boundary flags

The registry preserves the following boundary flags:

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

## Decision rule

The Evidence Registry Index may organize P004 evidence references.

It must not be treated as evidence execution, runtime authorization, production approval, legal certification or regulated status.
