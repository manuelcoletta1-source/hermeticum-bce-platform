# P004 OPERATIONAL EVIDENCE MAP

## Status

This document is the first operational deliverable after the P004 merge checkpoint.

Baseline:

MAIN_HEAD=808461f docs(main): record post P004 merge checkpoint
P004_PLAN=P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md

## Purpose

The Operational Evidence Map connects the verified P003 Evidence Kernel baseline to the P004 operational layer.

It defines how evidence, policy, OPC, authority, authorization, SF-009 ingress and runtime boundaries relate before any production, deployment or authorization promotion.

## Layer map

### 1. Evidence layer

The evidence layer contains structured evidence records, schemas, verification data and documented checkpoints.

Role:

- preserve factual traceability
- provide audit material
- support verification inheritance
- prevent undocumented operational promotion

### 2. Policy layer

The policy layer evaluates whether an action is structurally valid under the documented policy model.

Role:

- bind action intent to policy references
- preserve policy evaluation provenance
- reject invalid or incomplete evaluation structures
- maintain fail-closed behavior

### 3. OPC layer

The OPC layer provides operational proof control boundaries.

Role:

- verify whether a requested operation has sufficient proof context
- prevent implicit authorization
- preserve the difference between proof preparation and operational allow
- maintain OPC ALLOW as explicitly out of scope unless separately authorized

### 4. Authority layer

The authority layer resolves who or what has recognized decision authority inside the system model.

Role:

- bind authority references
- preserve authority versioning
- prevent authority ambiguity
- separate human authority, office authority and AI-system references

### 5. Authorization layer

The authorization layer resolves whether an action can proceed under the available authority, policy and proof context.

Role:

- connect requested action to authority and policy
- prevent missing authorization paths
- preserve denial states
- maintain fail-closed execution boundaries

### 6. SF-009 ingress layer

The SF-009 ingress layer represents the experimental OperationEnvelope ingress and durable revision design surface.

Role:

- define OperationEnvelope ingress boundaries
- preserve digest and revision logic
- prepare persistence design without executing PostgreSQL runtime readiness
- keep PostgreSQL execution explicitly outside this deliverable

### 7. Runtime boundary layer

The runtime boundary layer defines what the current repository state does not authorize.

Role:

- block production interpretation
- block deployment interpretation
- block L3 promotion
- block PostgreSQL runtime readiness
- block P04/P05 concurrency execution
- block OPC ALLOW

## Operational flow

The intended P004 map is:

Evidence -> Policy Evaluation -> OPC Proof Boundary -> Authority Resolution -> Authorization Resolution -> SF-009 Ingress Design -> Runtime Boundary

This flow describes review structure only.

It does not execute production runtime behavior.

## Allowed use

This map may be used to:

- plan the next P004 deliverables
- review evidence-to-runtime relationships
- identify missing operational documents
- prepare future test design
- support audit-oriented documentation

## Not allowed use

This map must not be used to claim:

- production readiness
- deployment readiness
- L3 readiness
- PostgreSQL readiness
- executed P04/P05 concurrency verification
- OPC ALLOW
- legal certification
- eIDAS qualification
- regulated KYC/AML provider status

## Next deliverables

The next P004 deliverables may include:

1. Evidence Lifecycle State Map
2. Runtime-to-Evidence Alignment
3. OPC Execution Boundary
4. SF-009 Next-Step Plan
5. PostgreSQL Readiness Boundary

## Decision rule

This document organizes operational evidence relationships only.

Any move into deployment, production, L3, PostgreSQL execution, P04/P05 concurrency execution or OPC ALLOW requires explicit human approval.
