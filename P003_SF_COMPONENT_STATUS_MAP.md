# HBCE P003 SF Component Status Map

**Branch:** `p003/evidence-kernel-domain-model`
**Reference commit:** `674828f docs(p003): add evidence kernel status`
**Status date:** 2026-09-20
**Status class:** R&D component map / evidence kernel / not L3 / not production

---

## Purpose

This document maps the current SF evidence components and experimental P003 components into operational status classes.

It separates documentary reference, local verification, experimental design, blocked execution and not-yet-verified production claims.

This document does not establish production authorization, legal certification, L3 readiness, OPC ALLOW, PostgreSQL runtime readiness or deployment approval.

---

## Status classes

ACCEPTED_REFERENCE = evidence artifact exists and is part of the current reference line, but no numeric verification total was observed in the evidence JSON.

VERIFIED_LOCAL_PENDING_HUMAN = evidence JSON reports a numeric PASS total, but human acceptance remains pending.

EXPERIMENTAL = design, scaffold or local experiment, not production and not L3.

BLOCKED = must not be executed or promoted without explicit authorization.

NOT_IMPLEMENTED_OR_NOT_VERIFIED = planned or implied capability not yet validated as production evidence.

---

## Accepted reference components

SF-009  CANONICAL_OPERATION_IDENTITY
SF-017  EXPLICIT_OPERATION_LIFECYCLE
SF-028  EXPLICIT_RECONSTRUCTABLE_STATE_TRANSITION
SF-041  DETERMINISTIC_SCOPE_BOUND_AUTHORITY_RESOLUTION
SF-046  CAPABILITY_LIFECYCLE_PROPAGATION_FAIL_CLOSED
SF-047  REQUIRED_AUTHORITY_DEPENDENCY_RESOLUTION_FAIL_CLOSED
SF-057  AUTHORITY_TEMPORAL_WINDOW_FAIL_CLOSED

These components are reference evidence in the current repository line. They must not be described as locally verified by numeric PASS total unless a verification total is present and checked.

---

## Verified local pending human acceptance

SF-069  MANDATE_TEMPORAL_PROPAGATION_FAIL_CLOSED              59/59 PASS
SF-070  CANONICAL_POLICY_EVALUATION_FAIL_CLOSED               72/72 PASS
SF-071  CANONICAL_STRUCTURE_VALID_OPC_FAIL_CLOSED             76/76 PASS
SF-080  CAPABILITY_TEMPORAL_PROPAGATION_FAIL_CLOSED           67/67 PASS
SF-089  POSITIVE_AUTHORITY_RESOLUTION                         67/67 PASS
SF-096  OPC_AUTHORITY_GATE_FAIL_CLOSED                        77/77 PASS
SF-101  AUTHORIZATION_RESOLUTION_FAIL_CLOSED                  87/87 PASS
SF-108  POSITIVE_POLICY_BOUNDARY_FAIL_CLOSED                  94/94 PASS
SF-116  POLICY_EVALUATION_IDENTITY_REQUIRED_FOR_ALLOW         95/95 PASS
SF-125  CANONICAL_POLICY_EVALUATION_SCHEMA                    95/95 PASS

These components have local numeric PASS evidence, but human acceptance is still pending in the evidence artifacts.

Where evidence JSON still reports `commit_state=NOT_COMMITTED` or `push_state=NOT_PUSHED`, treat that field as evidence-declared state at generation time, not as current Git truth.

Current Git truth must be checked separately with `git log`, `git status` and remote tracking state.

---

## Experimental P003 components

SF-009 envelope ingress package:
experiments/sf009-envelope-ingress/

OperationEnvelope revision identity profile:
protocol/HBCE_OPERATION_ENVELOPE_REVISION_IDENTITY_PROFILE_v1.md

Experimental design/scaffold components:
experiments/sf009-envelope-ingress/DURABLE_REVISION_REPOSITORY_CONTRACT_DRAFT.md
experiments/sf009-envelope-ingress/POSTGRESQL_EXPERIMENTAL_ACCESS_DESIGN_DRAFT.md
experiments/sf009-envelope-ingress/POSTGRESQL_REVISION_SCHEMA_DESIGN_DRAFT.md
experiments/sf009-envelope-ingress/POSTGRESQL_GENESIS_COORDINATION_DESIGN_DRAFT.md
experiments/sf009-envelope-ingress/P01_P10_PERSISTENCE_TEST_DESIGN_DRAFT.md
experiments/sf009-envelope-ingress/P04_P05_CONCURRENCY_HARNESS_DESIGN_DRAFT.md
experiments/sf009-envelope-ingress/pg-contention-observer.cjs

These components are experimental. They are not production runtime claims.

---

## Blocked execution or promotion

P04_P05_CONCURRENCY_EXECUTION=BLOCKED
POSTGRESQL_APPLICATION_LOGIN=BLOCKED
OPC_ALLOW=BLOCKED
L3_PROMOTION=BLOCKED
RUNTIME_DEPLOYMENT=BLOCKED
MAIN_MERGE=BLOCKED_UNTIL_REVIEW
INDEX_HTML_INTEGRATION=SEPARATE_DECISION

These actions require explicit authorization.

---

## Not implemented or not verified as production

DURABLE_PERSISTENCE_VERIFICATION=NOT_VERIFIED
POSTGRESQL_PRODUCTION_RUNTIME=NOT_IMPLEMENTED
CUSTOMER_FACING_PRODUCTION_AUDIT_CLAIM=NOT_VERIFIED
LEGAL_CERTIFICATION=NOT_ESTABLISHED
EIDAS_QUALIFICATION=NOT_ESTABLISHED
REGULATED_KYC_AML_PROVIDER_STATUS=NOT_ESTABLISHED

---

## Launch interpretation

For the 2027-01-19 launch path, the useful statement is:

HBCE has an evidence-kernel line for governed digital and AI actions, with locally verified fail-closed policy and authority components, plus an experimental persistence and revision repository track.

The unsafe statement is:

HBCE is production-ready, L3-certified, legally certified, or PostgreSQL-runtime verified.

The unsafe statement must not be used.

---

## Next step

The next controlled step is to review this map, then decide whether to stage, commit and push it to the P003 pull request.

HERMETICUM B.C.E. — Evidence map before runtime claims.
