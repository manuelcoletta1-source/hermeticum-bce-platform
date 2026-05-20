# PUBLIC ROUTE AUDIT PASS — 2026-05-20 — CLEAN RUN

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

The clean run confirms:

ACTIVE SPINE MISSING ROUTES
→ OK — all active spine routes reachable.

BAD ROUTE REFERENCES
→ OK — none detected.

ACTIONABLE LEGACY TEXT REFERENCES
→ OK — none detected.

CONTEXTUAL LEGACY TEXT REFERENCES
→ OK — none detected outside expected contexts.

BROKEN OR UNREACHABLE INTERNAL ROUTES
→ OK — none detected.


---

2. Active spine confirmed

The following operational spine is reachable:

Platform
→ Onboarding
→ IPR
→ IPR Card
→ JOKER-C2
→ IPR AI Audit Trail
→ Registry / Verify
→ Boundary / Pilot layers

The active spine includes:

onboarding/
ipr/
ipr-card/
joker-c2/
matrix-audit-trail/
registry/
verify/
verify-pack/
legal/
privacy/
terms/
claims/
compliance/
security/
governance/
pricing/
buy/
contact/
enterprise/
b2g/
partners/
company/
about/
hbce/
architecture/
docs/
protocol/
sitemap/
status/


---

3. Expected references classified correctly

Legacy or historical strings remain only where expected:

FORBIDDEN_FIELD_LIST_REFERENCE
GUARDRAIL_TOOL_REFERENCE
ARCHIVAL_AUDIT_REFERENCE
PROTOCOL_LEGACY_REFERENCE
MVP_ALIGNMENT_HISTORY_REFERENCE

Examples include strings such as:

nickname
territory
operator_sha256
MATRIX AI Audit Trail
OFFICIAL_PROTOCOL_BUNDLE
HBCE-REGISTRY-OPERATORS-v1

These are retained only as:

forbidden-field guardrails
schema guardrails
audit-history references
protocol legacy references
MVP alignment-history references

They do not constitute active product terminology, active route structure, public identity fields, operator certification claims or runtime authorization claims.


---

4. Platform architecture confirmed

The audit confirms the public route layer around the new architecture:

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

The platform is now positioned as:

R&D public gateway for operational identity, proof, audit and governed AI access.

The central public distinction remains:

Classic AI starts with an email.
JOKER-C2 starts with a verified IPR.


---

5. Proof and registry layer confirmed

The following proof and registry files are included in the route-audit surface:

registry/registry.json
registry/ledger.json
registry/ipr_registry.json
registry/events.json
registry/operators.json
registry/nodes.json
registry/append/
registry/publish/
registry/operators/
registry/operators/append/
registry/operators/receipt/
registry/operators/pack/
registry/operators/status/

The registry layer remains:

hash-oriented
append-only
GDPR-minimized
fail-closed
no public identity custody
no private evidence custody
no public document custody
no automatic JOKER-C2 access


---

6. Boundary layer confirmed

The public boundary layer is reachable and aligned:

legal/
privacy/
terms/
claims/
compliance/
security/
governance/

Core boundary interpretation:

Legal
→ IPR Card is operational, not official identity.

Privacy
→ private identity evidence stays private; public proof stays minimized.

Terms
→ governed JOKER-C2 access requires valid operational IPR state where policy allows it.

Claims
→ defines what HBCE claims and does not claim.

Compliance
→ EU-first posture, not automatic compliance or certification.

Security
→ no verified operational identity, no governed runtime access.

Governance
→ JOKER-C2 does not bypass HBCE governance.


---

7. Non-claims preserved

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

8. Final audit interpretation

The 2026-05-20 clean run confirms:

PASS

Final technical interpretation:

The public HBCE Platform route layer is clean for configured actionable findings.
The active spine is reachable.
No bad route references were detected.
No broken internal routes were detected.
No actionable legacy text references were detected.
Contextual legacy strings are now classified as expected guardrail, schema, archival or protocol references.


---

9. Maintainer

Manuel Coletta
HBCE Research
HERMETICUM B.C.E. S.r.l.
Torino, Italy, European Union

