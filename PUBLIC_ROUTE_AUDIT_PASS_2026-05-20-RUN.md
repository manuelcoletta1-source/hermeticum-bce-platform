# PUBLIC ROUTE AUDIT PASS — 2026-05-20 — RUN RESULT

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

Status: `PASS`  
Date: `2026-05-20`  
Audit tool: `/tools/link-audit/`  
Scope: HBCE Platform public route audit after IPR Onboarding Gateway / IPR Card / JOKER-C2 refactor  
Mode: Browser-side defensive public route audit  
Boundary: This result is a defensive public-route audit result only. It is not legal validation, cybersecurity certification, regulated compliance, public authority approval, operator qualification or production authorization.

---

## 1. Executive result

The HBCE Link Audit was executed against the updated public platform spine.

The audit returned:

```text
PASS — public route layer clean for configured actionable findings.
PASS_SCOPE — active spine, broken routes, deprecated routes and actionable legacy terms were not detected.

The current public route layer is therefore considered structurally clean for the configured actionable audit checks.


---

2. Active spine result

The audit checked the active HBCE Platform spine:

Platform
→ Onboarding
→ IPR
→ IPR Card
→ JOKER-C2
→ IPR AI Audit Trail
→ Registry / Verify
→ Boundary / Pilot layers

The result was:

ACTIVE SPINE MISSING ROUTES
→ OK — all active spine routes reachable.

No missing active-spine routes were detected.


---

3. Broken route result

The audit checked curated internal links across the public platform route set.

The result was:

BROKEN OR UNREACHABLE INTERNAL ROUTES
→ OK — none detected.

No broken or unreachable internal routes were detected.


---

4. Bad route references result

The audit checked configured deprecated route patterns:

/hermeticum-bce-platform/entry/
/hermeticum-bce-platform/register/
/hermeticum-bce-platform/phase-1/
/hermeticum-bce-platform/gate/
/hermeticum-bce-platform/operator-license/
/hermeticum-bce-platform/operator-console/
/hermeticum-bce-platform/join-operator/
/hermeticum-bce-platform/approve-operator/

The result was:

BAD ROUTE REFERENCES
→ OK — none detected.

No configured deprecated-route references were detected.


---

5. Actionable legacy text result

The audit checked configured actionable legacy text patterns.

The result was:

ACTIONABLE LEGACY TEXT REFERENCES
→ OK — none detected.

No actionable legacy text references were detected in active public product surfaces.


---

6. Expected legacy / guardrail references

The audit found expected legacy references in archival, forbidden-field, guardrail, protocol legacy or MVP alignment contexts.

These references are not blocking because they occur in expected locations such as:

FORBIDDEN_FIELD_LIST_REFERENCE
GUARDRAIL_TOOL_REFERENCE
ARCHIVAL_AUDIT_REFERENCE
MVP_ALIGNMENT_HISTORY_REFERENCE
PROTOCOL_LEGACY_REFERENCE

Examples include historical or guardrail strings such as:

MATRIX AI Audit Trail
operator_sha256
nickname
territory
OFFICIAL_PROTOCOL_BUNDLE
HBCE-REGISTRY-OPERATORS-v1

These references remain acceptable when they appear only in archival, schema, audit, forbidden-field, protocol legacy or guardrail contexts.


---

7. Contextual advisory references

The audit reported contextual legacy strings outside the expected archival contexts:

registry/operators.json
→ nickname

registry/append/
→ nickname

registry/publish/
→ nickname

registry/operators/
→ nickname

registry/operators/status/
→ nickname

Audit interpretation:

CONTEXTUAL_REFERENCES — legacy strings appear outside expected archival contexts. Review whether these are still needed.

These findings are advisory, not blocking, because the overall audit still returned PASS and no actionable legacy references were detected.

Operational interpretation:

The string nickname appears as a forbidden-field / sensitive-field guardrail.
It does not appear as an active data model claim.
It does not create an operator identity field.
It does not expose personal data.

Recommended optional cleanup:

Either keep nickname as a forbidden public field guardrail,
or classify the operator registry and registry tools as expected forbidden-field contexts in link-audit.

No immediate route-blocking remediation is required.


---

8. Public route layer status

The audit confirms that the updated public spine is reachable and coherent:

Home
Onboarding
IPR
IPR Card
JOKER-C2
IPR AI Audit Trail
Registry
Verify
Verify Pack
Legal
Privacy
Terms
Claims
Compliance
Security
Governance
Pricing
Pilot Access
Contact
Enterprise
B2G
Partners
Company
About
HBCE
Architecture
Docs
Protocol
Sitemap
Status

Status:

REACHABLE
NO BROKEN INTERNAL ROUTES
NO BAD ROUTE REFERENCES
NO ACTIONABLE LEGACY TEXT
PASS


---

9. Architecture confirmed by audit

The public route layer now supports the canonical HBCE Platform architecture:

HBCE Platform
→ IPR Onboarding Gateway
→ IPR
→ IPR Card
→ JOKER-C2
→ IPR AI Audit Trail
→ Registry / Verify / Verify Pack
→ EVT / OPC / Receipt
→ Legal / Privacy / Claims boundary
→ Compliance / Security / Governance
→ Pilot / Enterprise / B2G / Partner review

The audit confirms that this spine is publicly reachable.


---

10. Current public positioning

The public platform now expresses the corrected market distinction:

Classic AI starts with an email.
JOKER-C2 starts with a verified IPR.

The platform does not present JOKER-C2 as generic AI access.

The platform presents JOKER-C2 as:

AI Operational Runtime
→ governed by IPR state
→ connected to IPR Card where applicable
→ constrained by policy and risk
→ traced through EVT
→ evidenced through OPC
→ bounded by Legal / Privacy / Claims


---

11. Registry and proof layer status

The proof layer has been aligned with the new architecture:

registry/registry.json
registry/events.json
registry/ipr_registry.json
registry/ledger.json
registry/operators.json
registry/nodes.json
schemas/hbce-registry-entry.schema.json
schemas/ipr.schema.json
schemas/hbce-evt.schema.json
schemas/receipt.schema.json

Public proof interpretation remains:

PUBLIC_REFERENCE_PRESENT
→ public proof reference exists only

NO_PUBLIC_RECORD
→ no matching public proof record was found

INVALID
→ input is missing, malformed, forbidden or rejected

NON_OPERATIONAL
→ registry or verifier source is unavailable, malformed or inconsistent


---

12. Non-claims preserved

This audit result does not claim:

legal certification
regulatory approval
eIDAS qualification
qualified trust-service status
public authority approval
public-sector adoption
external audit certification
automated compliance
legally binding evidence status by itself
financial or banking authorization
payment institution status
electronic money institution status
production-grade enterprise SaaS readiness
regulated identity provider status
regulated KYC / AML provider status
cybersecurity certification
operator certification
public authority registry status
official European identity issuance
replacement of identity card, passport, CIE, SPID, EUDI Wallet or qualified eIDAS certificate
automatic JOKER-C2 runtime access


---

13. Final audit interpretation

The 2026-05-20 browser-side link audit produced a valid PASS for the configured actionable checks.

Final route status:

PASS

Final advisory status:

CONTEXTUAL_REFERENCES_REVIEW_OPTIONAL

Final operational interpretation:

The public HBCE Platform route layer is clean for configured actionable findings.
The active spine is reachable.
No bad route references were detected.
No broken internal routes were detected.
No actionable legacy text references were detected.
Contextual guardrail references remain review-only.


---

14. Recommended follow-up

Optional follow-up:

Update tools/link-audit/ expected contexts so operator registry and registry tools classify nickname as FORBIDDEN_FIELD_LIST_REFERENCE.

This would remove the non-blocking contextual advisory.

Suggested follow-up file if performed:

PUBLIC_ROUTE_AUDIT_PASS_2026-05-20-RUN-CLEAN.md

Current result remains valid:

PUBLIC_ROUTE_AUDIT_PASS_2026-05-20-RUN.md
→ PASS with contextual review advisory


---

15. Maintainer

Manuel Coletta
HBCE Research
HERMETICUM B.C.E. S.r.l.
Torino, Italy, European Union

