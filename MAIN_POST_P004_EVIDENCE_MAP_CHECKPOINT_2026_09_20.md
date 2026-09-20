# MAIN POST P004 EVIDENCE MAP CHECKPOINT — 2026-09-20

## Status

P004 Operational Evidence Map has been merged into main.

## Main baseline

MAIN_HEAD=f01c8d3 Merge pull request #6 from manuelcoletta1-source/p004/operational-evidence-map
PREVIOUS_MAIN_HEAD=808461f docs(main): record post P004 merge checkpoint

## Integrated PR

PR #6: docs(p004): add operational evidence map

Merged file:

- P004_OPERATIONAL_EVIDENCE_MAP.md

## P004 map content

The merged map defines the operational relationship between:

- evidence
- policy evaluation
- OPC proof boundary
- authority resolution
- authorization resolution
- SF-009 ingress design
- runtime boundary

## Operational flow

Evidence -> Policy Evaluation -> OPC Proof Boundary -> Authority Resolution -> Authorization Resolution -> SF-009 Ingress Design -> Runtime Boundary

This flow describes review structure only.

It does not execute production runtime behavior.

## Current integrated baseline

- PR #4 Homepage Integration: merged
- PR #3 P003 Evidence Kernel: merged
- PR #5 P004 Operational Evidence Layer Plan: merged
- PR #6 P004 Operational Evidence Map: merged

## Verification inheritance

The previous verified main checkpoint remains:

CORE_MAIN=180 PASS / 0 FAIL
SF009_EXPERIMENTAL=46 PASS / 0 FAIL
TOTAL_MAIN_POST_MERGE=226 PASS / 0 FAIL
HBCE_MAIN_POST_MERGE_VERIFICATION=226/226 PASS

PR #6 adds documentation/mapping only and does not alter runtime behavior.

## Explicit boundaries preserved

This checkpoint does not perform or imply:

- production readiness
- deployment readiness
- L3 readiness
- PostgreSQL readiness
- PostgreSQL execution
- P04/P05 concurrency execution
- OPC ALLOW
- legal certification
- eIDAS qualification
- regulated KYC/AML provider status

## Decision rule

The main branch is now ready for the next P004 deliverable branch.

Further work must remain below production, deployment, L3, PostgreSQL execution, P04/P05 execution and OPC ALLOW unless explicitly authorized by human decision.
