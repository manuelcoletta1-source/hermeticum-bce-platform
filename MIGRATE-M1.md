# MIGRATE-M1 — HBCE UI Migration Discipline (Golden Template)

Purpose: migrate legacy pages to the canonical HBCE infrastructure UI without incremental patching.
Rule: any change to a page is a full rewrite of that file (refactor-only, deterministic).

## Canonical UI baseline (must exist)
- `assets/hbce.css` (dark, institutional)
- `partials/header.html` (canonical navigation)
- `partials/footer.html` (canonical links + posture)
- `templates/page.html` (golden template skeleton)

If any of the above is missing or outdated, STOP and refactor that file first.

---

## M1 Migration goals
1. Remove white/legacy layouts.
2. Enforce canonical header/footer loader (`data-hbce="header"`, `data-hbce="footer"`).
3. Enforce canonical structure and CSS classes.
4. Ensure all pages route back to `/activate/` as the execution gateway.
5. Preserve fail-closed semantics (no “soft validity”, no “maybe”).

---

## Golden structure (required)
Every migrated page MUST follow this skeleton:

- `<link rel="stylesheet" href="/hermeticum-bce-platform/assets/hbce.css" />`
- `<div data-hbce="header"></div>`
- `<main class="hbce-container hbce-main">`
  - `.hbce-hero` block with:
    - `.hbce-hero__kicker`
    - `.hbce-hero__title`
    - `.hbce-hero__lead`
    - `.hbce-cta-group` with canonical exits
  - one or more `.hbce-section` blocks
  - optional `.hbce-section--dark` blocks for rules / constraints
- `</main>`
- `<div data-hbce="footer"></div>`

No other top-level wrappers are allowed.

---

## Canonical exits (required)
Every page MUST expose at least one canonical exit group:

- Primary: `/activate/`
- Secondary: `/operational-prerequisites/`
- Optional (1): `/protocol/` or `/verify/` depending on page role

Pages must NOT introduce alternative “entrypoints”.
Docs pages must route users back to execution.

---

## Content posture rules (required)
- Use deterministic language:
  - VALID / INVALID
  - PASS / FAIL
  - STOP (fail-closed)
- Avoid marketing tone:
  - no “best in class”, no “revolutionary”, no “easy”
- Avoid legal claims:
  - include the disclaimer: “does not replace eIDAS / EUDI Wallet schemes”
- Public custody rule must be repeated where relevant:
  - “hash-only public evidence”
  - “no public personal data custody”
  - “append-only registry”

---

## Migration procedure (per page)
For each target page:

### Step 1 — Identify page role
Classify as one:
- Gateway: operational execution (must route everything)
- Authority: operator/governance
- Evidence: registry/verify/audit
- Institutional: B2G/OEM/defense
- Documentation: standards/protocol/specs

### Step 2 — Full rewrite (no patching)
Rewrite the file fully using `templates/page.html` skeleton.
Copy only the semantic content that is still valid.

### Step 3 — Replace legacy classes
Replace any old/unknown classes with HBCE classes:
- `.hbce-grid`, `.hbce-grid--2`
- `.hbce-card`, `.hbce-card__kicker`, `.hbce-card__title`, `.hbce-card__text`, `.hbce-card__actions`
- `.hbce-cta-group`, `.hbce-button`, `.hbce-button--primary`, `.hbce-button--ghost`
- `.hbce-code`, `.hbce-list`, `.hbce-note`
- `.hbce-section`, `.hbce-section--dark`

### Step 4 — Verify canonical routing
Ensure the page includes:
- CTA to `/activate/`
- Reference to prerequisites or protocol (as appropriate)
- No dead links introduced by migration

### Step 5 — Integrity check (manual)
After commit:
- Open page and confirm:
  - dark UI renders correctly
  - header navigation visible
  - footer visible
  - no white background sections
  - typography readable (mobile + desktop)

---

## Suggested migration order (M1)
1. Gateways:
   - `/activate/`
   - `/operational-prerequisites/`
   - `/inevitability/`
2. Trust core:
   - `/protocol/`
   - `/what-is-ipr/`
3. Evidence:
   - `/verify/`
   - `/registry/`
   - `/audit/`
4. Authority:
   - `/operator/`
   - `/network/`
5. Institutional:
   - `/b2g/`
   - `/oem/`
   - `/defense/`

---

## Acceptance criteria (M1 PASS)
A page is M1-PASS only if:
- Golden structure is present
- Dark theme is consistent (no white surfaces)
- Canonical exits exist (Activate + Prerequisites)
- Language is deterministic (PASS/FAIL, VALID/INVALID)
- No new alternative entrypoints were created
- No public personal data custody claims are violated

Otherwise: M1-FAIL → refactor again.

---

## Commit discipline
Use one of:
- `refactor(<route>): migrate to golden template (M1)`
- `feat(<route>): publish canonical page (M1)`
- `chore(migrate): mark <route> as migrated (M1)`

No micro-commits. No patch commits.
