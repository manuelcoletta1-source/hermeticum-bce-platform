# Homepage Integration — PR Review Comment

## Summary

This branch integrates selected P003 product entry points into the current `origin/main` homepage without changing the main Operational Trust Layer framing.

Branch:

- `p003/homepage-operational-trust-ipr-integration`

Current HEAD:

- `57e0dd6 docs(homepage): add integration PR comment`

Base:

- `origin/main`
- `162e5d7 feat(platform): refactor public index for operational trust layer`

## Scope

This patch changes:

- `index.html`
- `HOMEPAGE_INTEGRATION_PR_COMMENT_2026_09_20.md`

Patch size observed locally:

- 157 insertions
- 5 deletions

## What changed

The homepage section `OPERATIONAL ENTRY POINTS` was expanded from four cards to six cards.

Before:

- ONBOARDING
- IPR
- JOKER-C2
- REGISTRY / VERIFY

After:

- ONBOARDING
- IPR
- IPR CARD
- JOKER-C2
- AUDIT / VERIFY PACK
- REGISTRY / VERIFY

## Product concepts integrated

The patch adds selected P003 product concepts into the `origin/main` homepage:

- IPR Card as an operational access card;
- JOKER-C2 access connected to verified IPR identity;
- EVT continuity;
- OPC proof logic;
- Audit surface;
- Verify Pack surface.

## Verified links

The target routes exist in `origin/main`:

- `./ipr-card/`
- `./audit/`
- `./verify-pack/`
- `./joker-c2/`
- `./registry/`
- `./verify/`
- `./onboarding/`
- `./ipr/`

## Verification

Read-only verification confirmed:

- branch is based on `origin/main`;
- there are two commits over `origin/main`;
- `index.html` and this PR comment document changed;
- `git diff --check origin/main...HEAD` emitted no errors;
- required markers are present in `index.html`.

Observed markers:

- `IPR CARD`
- `AUDIT / VERIFY PACK`
- `verified IPR identity`
- `EVT continuity`
- `OPC proof logic`
- `./ipr-card/`
- `./audit/`
- `./verify-pack/`

## Explicit boundaries

This homepage patch does not perform or imply:

- deployment;
- merge into `main`;
- production authorization;
- L3 promotion;
- PostgreSQL runtime readiness;
- OPC ALLOW;
- legal certification;
- eIDAS qualification;
- changes to the P003 Evidence Kernel branch.

## Review interpretation

This is a small homepage integration patch.

It keeps the `origin/main` Operational Trust Layer homepage as the base and adds only selected IPR/JOKER-C2/Audit entry-point language from the P003 product framing.
