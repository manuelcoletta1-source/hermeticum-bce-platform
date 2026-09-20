# P004 OPERATIONAL EVIDENCE LAYER PLAN

## Status

P004 starts after the verified merge of PR #4 Homepage Integration and PR #3 P003 Evidence Kernel.

Current baseline:

MAIN_HEAD=fe907e7 docs(main): record post-merge verification checkpoint
HBCE_MAIN_POST_MERGE_VERIFICATION=226/226 PASS

## Purpose

P004 defines the next operational layer above the P003 Evidence Kernel.

P003 established the verified evidence, schema, policy, OPC, authority, authorization and SF-009 experimental ingress baseline.

P004 must organize how those verified components become an operational evidence surface without implying production readiness.

## P004 scope

P004 may include:

- operational evidence entry map
- evidence lifecycle state map
- runtime-to-evidence alignment document
- policy and OPC execution boundary document
- SF-009 next-step plan
- PostgreSQL readiness boundary document
- P04/P05 concurrency test preparation notes
- updated README or index references if needed

## P004 non-scope

P004 must not perform or imply:

- deployment
- production authorization
- L3 promotion
- PostgreSQL runtime readiness
- PostgreSQL application login
- P04/P05 concurrency execution
- OPC ALLOW
- legal certification
- eIDAS qualification
- regulated KYC/AML provider status

## Starting baseline

CORE_MAIN=180 PASS / 0 FAIL
SF009_EXPERIMENTAL=46 PASS / 0 FAIL
TOTAL_MAIN_POST_MERGE=226 PASS / 0 FAIL
HBCE_MAIN_POST_MERGE_VERIFICATION=226/226 PASS

## Operational interpretation

P004 treats the current main branch as an R&D evidence-kernel baseline.

The purpose is to make the baseline operable, reviewable and extensible without promoting it to production.

## Initial deliverables

P004 initial deliverables:

1. P004_OPERATIONAL_EVIDENCE_LAYER_PLAN.md
2. operational evidence map
3. evidence lifecycle map
4. next verification checklist
5. explicit boundary statement for PostgreSQL, OPC ALLOW and L3

## Decision rule

P004 may prepare operational structure.

P004 may not cross into runtime production, deployment, PostgreSQL execution, P04/P05 concurrency execution or authorization promotion without explicit human approval.
