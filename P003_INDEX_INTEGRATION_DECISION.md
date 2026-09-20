# HBCE P003 Index Integration Decision

**Branch:** `p003/evidence-kernel-domain-model`
**Status date:** 2026-09-20
**Status class:** homepage integration decision / read-only merge analysis / not deployed

---

## Purpose

This document records the current decision around `index.html` integration between `origin/main` and the P003 Evidence Kernel branch.

It does not perform a merge, rebase, deployment or production promotion.

---

## Current branch state

P003 is clean and aligned with its remote branch.

Current P003 head:

`b236b4e docs(p003): clarify reference commit labels`

Divergence observed:

`origin/main` has 1 commit not incorporated into P003.

P003 has 43 commits not present on `origin/main`.

The missing `origin/main` commit is:

`162e5d7 feat(platform): refactor public index for operational trust layer`

Affected file:

`index.html`

---

## Merge-tree result

A read-only `git merge-tree` check reported no technical conflict markers.

Observed result:

`MERGE_TREE_NO_CONFLICT_MARKERS`

This means the merge is technically possible, but it does not mean the homepage integration is semantically correct.

---

## Homepage divergence

P003 `index.html` is centered on:

- IPR Onboarding Gateway;
- governed AI access;
- IPR Onboarding App;
- IPR Card;
- JOKER-C2 access through verified IPR identity;
- IPR AI Audit Trail;
- public verification flow.

`origin/main:index.html` is centered on:

- Operational Trust Layer;
- verifiable digital decisions;
- identity;
- authority;
- execution;
- observation;
- evidence;
- consequence.

The `origin/main` homepage is more aligned with the P003 launch spine.

The P003 homepage preserves useful product-specific sections that should not be lost.

---

## Recommended integration strategy

Use `origin/main:index.html` as the base.

Backport selected P003 product sections into the `origin/main` structure.

Do not auto-merge the entire homepage blindly.

Recommended preserved elements from P003:

- IPR Card;
- IPR AI Audit Trail;
- JOKER-C2 access through verified IPR identity;
- EVT / OPC evidence continuity;
- public verification flow;
- Verify Pack / Registry / Verify routing.

Do not preserve as primary homepage framing:

- platform as only IPR Onboarding Gateway;
- duplicated hub blocks;
- production, L3, legal certification or regulated-provider claims.

---

## Verified local routes

The following routes exist locally:

- `./ipr-card/`
- `./audit/`
- `./verify-pack/`

The route `./ipr-ai-audit-trail/` does not currently exist.

Therefore:

- IPR Card should link to `./ipr-card/`;
- IPR AI Audit Trail should link to `./audit/`;
- Verify Pack should link to `./verify-pack/`.

---

## Recommended patch target

Patch target section in `origin/main:index.html`:

`OPERATIONAL ENTRY POINTS`

Current cards in that section:

- ONBOARDING;
- IPR;
- JOKER-C2;
- REGISTRY / VERIFY.

Recommended additions:

- IPR CARD → `./ipr-card/`;
- IPR AI AUDIT TRAIL → `./audit/`;
- optional VERIFY PACK link → `./verify-pack/`.

Recommended text adjustment:

- strengthen JOKER-C2 as governed runtime accessed through verified IPR identity;
- strengthen Registry / Verify as EVT / OPC / public proof continuity.

---

## Current decision

Do not merge `origin/main` into P003 automatically.

Keep the P003 pull request review focused on the evidence-kernel branch.

Treat homepage integration as a separate reviewed patch or separate branch.

---

HERMETICUM B.C.E. — Homepage integration must preserve evidence meaning, not just pass Git.
