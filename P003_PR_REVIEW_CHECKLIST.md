# HBCE P003 PR Review Checklist

**Branch:** `p003/evidence-kernel-domain-model`
**Status date:** 2026-09-20
**Status class:** PR review checklist / evidence kernel / not production

---

## Purpose

This checklist supports review of the P003 Evidence Kernel pull request.

It is intended to help reviewers separate verified evidence, runtime code, schemas, tests, experimental persistence design and launch-positioning documents.

This checklist does not establish production authorization, L3 readiness, deployment approval, PostgreSQL runtime readiness, OPC ALLOW or legal certification.

---

## Pull request size

Observed PR scope against `origin/main`:

`69 files changed, 18117 insertions(+)`

The PR should be reviewed as an evidence-kernel branch, not as a homepage or deployment branch.

---

## Review domains

### 1. Evidence layer

Review files under:

`evidence/`

Expected scope:

- SF-009 OperationEnvelope;
- SF-017 Operation State;
- SF-028 State Transition;
- SF-041 Authority Runtime;
- SF-046 Capability Lifecycle;
- SF-047 Authority Dependency Resolution;
- SF-057 Authority Temporal Window;
- SF-069 Mandate Temporal Propagation;
- SF-070 Policy Evaluation Integration;
- SF-071 Policy Evaluation Structural Valid;
- SF-080 Capability Temporal Propagation;
- SF-089 Positive Authority Resolution;
- SF-096 OPC Authority Gate;
- SF-101 Authorization Resolution;
- SF-108 Positive Policy Boundary;
- SF-116 Policy Evaluation Identity Boundary;
- SF-125 Canonical Policy Evaluation Schema.

Check:

- evidence IDs are explicit;
- properties are explicit;
- verification totals are not overclaimed;
- human acceptance remains distinct from local verification;
- stale `commit_state` or `push_state` fields are not treated as current Git truth.

---

### 2. Runtime layer

Review files under:

`runtime/authority/`
`runtime/authorization/`
`runtime/opc/`
`runtime/policy/`

Check:

- authority resolution fails closed;
- authorization resolution fails closed;
- OPC policy evaluation is structurally validated;
- policy payload verification is deterministic;
- genealogy verification does not allow missing required relationships;
- no production authorization is implied.

---

### 3. Schema layer

Review files under:

`schemas/`

Check coverage for:

- authority;
- authorization;
- capability;
- consequence;
- evidence set;
- execution;
- feedback;
- mandate;
- matrix state;
- operation envelope;
- operation state;
- outcome;
- policy evaluation;
- state transition.

Check:

- schemas are explicit;
- required fields match runtime expectations;
- additional properties are controlled where required;
- schema naming remains stable.

---

### 4. Test layer

Review files under:

`tests/`

Check:

- authority tests;
- authorization tests;
- OPC policy evaluation tests;
- structural policy evaluation tests;
- payload hash profile tests;
- genealogy tests.

Expected behavior:

- invalid structures fail closed;
- missing required fields fail closed;
- positive cases remain explicit and bounded;
- tests do not imply production readiness.

---

### 5. SF-009 experimental package

Review files under:

`experiments/sf009-envelope-ingress/`

Check:

- duplicate-aware JSON parsing;
- SF-009 synthetic digest verification;
- experimental unverified fixture boundary;
- durable revision repository contract draft;
- PostgreSQL access, schema and genesis drafts;
- P01-P10 persistence test design;
- P04/P05 concurrency harness design.

Important boundary:

`pg-contention-observer.cjs` must not be executed without explicit authorization.

The SF-009 package is experimental and does not establish PostgreSQL runtime readiness.

---

### 6. P003 control documents

Review root P003 documents:

- `P003_EVIDENCE_KERNEL_STATUS.md`
- `P003_SF_COMPONENT_STATUS_MAP.md`
- `P003_LAUNCH_SPINE_2027.md`
- `P003_INDEX_INTEGRATION_DECISION.md`

Check:

- boundaries remain explicit;
- launch language does not overclaim;
- homepage integration remains separate from evidence-kernel review;
- reference commits are historical references, not claims of current HEAD.

---

## Explicit non-goals

This PR does not perform:

- production deployment;
- main branch merge;
- homepage integration;
- PostgreSQL application login;
- P04/P05 concurrency execution;
- OPC ALLOW;
- L3 promotion;
- legal certification;
- eIDAS qualification;
- regulated KYC / AML provider activation.

---

## Review recommendation

Review P003 as a controlled Evidence Kernel branch.

Do not auto-merge `origin/main` into P003 without semantic review of `index.html`.

Keep homepage integration as a separate reviewed patch or branch.

---

HERMETICUM B.C.E. — Review evidence boundaries before runtime claims.
