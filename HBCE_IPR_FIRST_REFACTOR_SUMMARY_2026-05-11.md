# HBCE IPR-First Refactor Summary — 2026-05-11

**Issuer:** HERMETICUM B.C.E. S.r.l.  
**Maintainer:** Manuel Coletta  
**Repository:** `hermeticum-bce-platform`  
**Public gateway:** `https://manuelcoletta1-source.github.io/hermeticum-bce-platform/`  
**Refactor date:** 2026-05-11  
**Refactor class:** Public platform alignment / IPR-first product hierarchy / MVP and governance cleanup  
**Final public route audit:** PASS  
**Reference audit file:** `PUBLIC_ROUTE_AUDIT_PASS_2026-05-11.md`

---

## 1. Purpose

This document records the completed IPR-first refactor cycle of the HBCE Platform.

The purpose of the refactor was to align the public repository, public pages, root documentation, commercial pilot material, legal/security/compliance/governance pages, registry/verification surfaces and partner-facing MVP documents around one coherent product hierarchy:

```text
IPR = base operational product
IPR Base = technical R&D record, not verified identity
IPR Verified = private verification with tax code + valid identity document
IPR Professional = business / audit profile based on IPR Verified
IPR AI Audit Trail = first MVP / pilot use case
HBCE = operational ecosystem
JOKER-C2 = runtime demonstrator
MATRIX = architectural framework
HERMETICUM B.C.E. S.r.l. = R&D / operating vehicle

The refactor clarifies that the first product to validate is IPR, not the whole MATRIX framework, and that the first practical MVP is IPR AI Audit Trail.


---

2. Final audit result

After the refactor cycle, the curated public route audit returned:

BAD ROUTE REFERENCES: OK
ACTIONABLE LEGACY TEXT REFERENCES: OK
BROKEN OR UNREACHABLE INTERNAL ROUTES: OK
AUDIT INTERPRETATION: PASS

Final interpretation:

PASS
→ public route layer clean for configured actionable findings

PASS_SCOPE
→ broken routes, deprecated routes and actionable legacy terms were not detected

EXPECTED_REFERENCES
→ legacy strings remain only in archival audits, schema / forbidden-field lists, verification guardrails or tool guardrails

This confirms that the public route layer is clean for configured actionable findings.

This audit result is defensive and route-level only. It is not legal validation, cybersecurity certification, regulated compliance, public authority approval, operator qualification, production authorization or institutional adoption.


---

3. Main correction

Before the refactor, the public platform could be interpreted as if the whole MATRIX framework were the first product.

The corrected interpretation is:

IPR is the product.
IPR AI Audit Trail is the MVP.
HBCE is the ecosystem.
JOKER-C2 is the runtime demonstrator.
MATRIX is the framework.

This correction was applied across the public platform, markdown documentation, protocol surfaces, registry tools, partner-facing material and commercial pilot pages.


---

4. Public route layer refactored

The following public route layer was aligned:

index.html
NAV.html
tools/index.html
tools/link-audit/index.html
tools/registry-guard.js
root/index.html
sitemap/index.html
defense/index.html
horizon/index.html
io-space/index.html
banca-cibernetica-europea/index.html

The public route layer now consistently presents:

IPR as the first operational product;

IPR AI Audit Trail as the first MVP;

HBCE as the governance ecosystem;

JOKER-C2 as the runtime demonstrator;

MATRIX as the wider architectural framework;

registry / verify / tools as public proof and audit utilities.



---

5. Product pages refactored

The following product and MVP pages were aligned:

ipr/index.html
what-is-ipr/index.html
matrix-audit-trail/index.html
verify/index.html
registry/index.html
claims/index.html

These pages now define:

IPR as an operational identity and proof record;

IPR Verified as a private-verification profile;

IPR AI Audit Trail as the first MVP use case;

Registry v3 as a public proof-reference layer;

Verify as a fail-closed public proof verification gateway;

Claims as the central scope-boundary and non-claim page.



---

6. Commercial and pilot pages refactored

The following commercial, B2B, B2G and partner pages were aligned:

pricing/index.html
buy/index.html
enterprise/index.html
b2g/index.html
industry/index.html
partners/index.html
contact/index.html
i3p/index.html

The commercial flow is now:

IPR Base
→ IPR Verified
→ IPR AI Audit Trail pilot
→ sample audit-ready reports
→ EVT / OPC references
→ verification review
→ production-readiness assessment
→ optional follow-up scope

The public commercial pages do not create:

automatic purchase
binding public offer
software license issuance
regulated certification
eIDAS qualification
regulated KYC / AML provider relationship
public authority approval
production deployment
production-grade enterprise SaaS readiness


---

7. Legal, privacy, security, compliance and governance pages refactored

The following policy pages were aligned:

legal/index.html
privacy/index.html
terms/index.html
security/index.html
compliance/index.html
governance/index.html

The shared boundary is now:

R&D / MVP reference platform
private verification separated from public proof
no public data custody
no legal certification claim
no eIDAS qualification claim
no regulated KYC / AML provider claim
no public authority claim
no cybersecurity certification claim
no production SaaS readiness claim
fail-closed verification
audit-first documentation
human responsibility


---

8. Root markdown documentation refactored

The following root markdown files were aligned:

README.md
ARCHITECTURE.md
SPEC.md
WHITEPAPER.md
GOVERNANCE.md
PRIVACY.md
SECURITY.md
RESPONSIBLE_USE.md
CONTRIBUTING.md
ROADMAP.md
STATUS.md
HBCE.md
NETWORK.md
MANIFEST.md
STANDARD-IPR-EU.md

A recurring structural problem was corrected across several markdown files: unclosed code fences that caused entire sections to render as code instead of normal markdown.

The affected root documentation is now readable as structured markdown and aligned with the IPR-first public platform model.


---

9. Protocol files refactored

The following protocol reference files were aligned:

protocol/hbce-network-architecture-v1.md
protocol/hbce-node-spec-v1.md
protocol/hbce-registry-spec-v1.md
protocol/ipr-event-v1.md
protocol/hbce-protocol-v1.official.json
protocol/hbce-sign.reference.js
protocol/hbce-verify.reference.js

The protocol layer now reflects:

IPR-first product hierarchy
IPR AI Audit Trail MVP boundary
Registry v3 public proof model
payload_sha256 as central public proof field
verification_level support
EVT event continuity
OPC operational proof
fail-closed verification
no public data custody
no legal / regulatory certification claim


---

10. Registry and operator surfaces refactored

The following registry and operator pages were aligned:

registry/index.html
registry/append/index.html
registry/publish/index.html
registry/operators/index.html
registry/operators/append/index.html
registry/operators/receipt/index.html
registry/operators/pack/index.html
registry/operators/status/index.html

The registry layer is now consistently framed as:

public proof-reference surface
hash-only or minimized metadata
manual append-only discipline
payload_sha256 lookup
verification_level support
fail-closed behavior
no public data custody

Operator references are now clearly defined as public proof references only.

They do not create:

certified-operator status
operator license
public authority approval
regulated qualification
professional licensing
production authorization


---

11. Tooling and audit guardrails refactored

The following tooling surfaces were aligned:

tools/index.html
tools/link-audit/index.html
tools/registry-guard.js

The link audit now separates:

ACTIONABLE LEGACY TEXT REFERENCES
EXPECTED LEGACY / GUARDRAIL REFERENCES
BROKEN OR UNREACHABLE INTERNAL ROUTES
BAD ROUTE REFERENCES

Schema files and verification files may retain legacy strings such as nickname, territory, operator_sha256, MATRIX Audit or MATRIX AI Audit Trail only in guardrail, forbidden-field or archival contexts.

Those references are not actionable public-surface errors.


---

12. Partner and MVP documents refactored

The following partner-facing MVP materials were aligned:

MATRIX_AI_AUDIT_TRAIL_MVP_BRIEF.md
MATRIX_AI_AUDIT_TRAIL_MVP_ALIGNMENT_2026-05-08.md
I3P_MATRIX_AUDIT_TRAIL_PILOT_NOTE.md
IPR_AI_AUDIT_TRAIL_PARTNER_BRIEF_2026-05-11.md
OPENAI_OUTREACH_STATUS_2026-05-06.md
i3p/index.html

The partner-facing message is now:

IPR is the base operational product.
IPR Base is a technical R&D record.
IPR Verified is the private-verification profile.
IPR AI Audit Trail is the first MVP use case.
JOKER-C2 is the runtime demonstrator.
HBCE is the operational ecosystem.
MATRIX is the architectural framework.
HERMETICUM B.C.E. S.r.l. is the R&D / operating vehicle.

These materials are ready for partner review, incubation review and controlled external pilot discussion, while remaining inside the declared R&D/MVP boundary.


---

13. IPR Verified boundary established

The refactor established IPR Verified as a private-verification profile.

The private verification model is:

tax code
→ valid identity document
→ private evidence package
→ IPR Verified record
→ hash-oriented public proof reference
→ verification / audit / EVT / OPC

Accepted valid identity-document categories:

identity card / CIE
passport
driving license

This evidence belongs only in the private verification layer.

The public layer must not contain:

tax code
fiscal code
codice fiscale
document number
identity document number
identity card / CIE number
passport number
driving license number
identity document
identity document scan
portrait image
biometric payload
private evidence
personal data
personal payload


---

14. Public proof boundary established

The public layer may contain only minimized proof references such as:

entity_type
subject_label
operator_label
record_scope
verification_level
payload_sha256
timestamp
status
evt_id
opc_id
audit_state
public-safe note

Supported public verification levels:

IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
RND_ONLY
NOT_APPLICABLE

A public proof reference means only that a public hash-oriented proof reference exists.

It does not certify legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority approval, cybersecurity assurance, operator qualification, institutional validation or production authorization.


---

15. Verification state model established

The public verification model now uses explicit states:

PUBLIC_REFERENCE_PRESENT
→ a matching public proof reference exists

NO_PUBLIC_RECORD
→ no matching public proof reference was found

INVALID
→ input is missing, malformed, forbidden or rejected

NON_OPERATIONAL
→ registry, source or verifier state is unavailable, malformed or inconsistent

Older authorization-style labels such as AUTHORIZED and DENIED are not the primary public verification model because they may imply legal or institutional authorization.


---

16. Public data policy reinforced

The public repository, public registry, public pages, public demos and public issues must not contain:

tax codes
fiscal codes
codice fiscale values
document numbers
identity document numbers
identity documents
identity document scans
portrait images
biometric material
private evidence
customer files
private prompts
private AI outputs
credentials
secrets
private keys
production logs
sensitive operational payloads

Public demos and R&D tests should use only:

synthetic materials
public materials
owned non-sensitive materials
expressly authorized non-sensitive materials


---

17. Commercial posture after refactor

The commercial posture is now pilot-first and R&D-scoped.

Recommended commercial path:

IPR Base
→ IPR Verified
→ IPR AI Audit Trail pilot
→ sample audit-ready reports
→ EVT / OPC references
→ verification review
→ production-readiness assessment
→ optional follow-up scope

Target first external pilot profiles:

compliance consultants
AI governance advisors
cybersecurity reviewers
legal operations teams
internal audit teams
technical due-diligence reviewers
public-sector innovation units
regulated-sector R&D teams

The commercial pages do not create:

automatic purchase
binding public offer
software license issuance
regulated certification
eIDAS qualification
regulated KYC / AML provider relationship
public authority approval
production deployment
production-grade enterprise SaaS readiness


---

18. OpenAI outreach status aligned

OPENAI_OUTREACH_STATUS_2026-05-06.md was aligned with the IPR AI Audit Trail MVP.

Current interpretation:

Submitted outreach and access-status record only.
No OpenAI approval claim.
No OpenAI partnership claim.
No OpenAI funding claim.
No OpenAI endorsement claim.
No OpenAI adoption claim.
No OpenAI production deployment claim.

Trusted Access for Cyber remains interpreted as individual defensive cybersecurity access only, not OpenAI approval of the project.


---

19. I3P / incubation status aligned

The I3P-related material was aligned as incubation-review material only.

Current interpretation:

Prepared for possible I3P / incubation review.
No I3P approval claim.
No I3P endorsement claim.
No I3P incubation claim.
No I3P adoption claim.
No I3P funding claim.

The I3P page and note now present IPR AI Audit Trail as the first incubatable MVP, not the whole MATRIX framework.


---

20. Non-claims

The refactored platform does not claim:

legal certification
regulatory approval
eIDAS qualification
qualified trust-service status
regulated KYC / AML provider status
public-sector adoption
external audit certification
automated compliance
legally binding evidence status by itself
production-grade enterprise SaaS readiness
public authority approval
financial or banking authorization
cybersecurity certification
operator certification
critical-infrastructure authorization
robotics or autonomous-system authorization
replacement of SPID / CIE / EUDI Wallet / eIDAS / public registries / qualified trust services

Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.


---

21. Final state

The refactor cycle produced the following final platform state:

PUBLIC_ROUTE_LAYER_CLEAN
IPR_FIRST_PUBLIC_SPINE_CONFIRMED
IPR_PRODUCT_FIRST
IPR_AI_AUDIT_TRAIL_MVP_CONFIRMED
IPR_VERIFIED_PRIVATE_VERIFICATION_BOUNDARY_CONFIRMED
HBCE_ECOSYSTEM_ROLE_CONFIRMED
JOKER_C2_RUNTIME_DEMONSTRATOR_ROLE_CONFIRMED
MATRIX_FRAMEWORK_ROLE_CONFIRMED
REGISTRY_V3_PUBLIC_PROOF_MODEL_CONFIRMED
VERIFY_FAIL_CLOSED_STATE_MODEL_CONFIRMED
ROOT_MARKDOWN_DOCUMENTATION_ALIGNED
COMMERCIAL_PILOT_FLOW_ALIGNED
LEGAL_SECURITY_COMPLIANCE_GOVERNANCE_ALIGNED
PARTNER_AND_I3P_MATERIAL_ALIGNED
OPENAI_OUTREACH_STATUS_ALIGNED
NO_BROKEN_INTERNAL_ROUTES
NO_ACTIONABLE_LEGACY_TERMS
AUDIT_PASS


---

22. Maintainer statement

This document records the IPR-first refactor cycle of the HBCE Platform as of 2026-05-11.

The platform is now suitable for:

internal self-pilot documentation;

partner review;

incubation review;

controlled external pilot preparation;

IPR AI Audit Trail partner-facing discussion;

continued R&D hardening.


The platform remains inside the declared R&D/MVP boundary.

It is not a production-grade enterprise SaaS platform, not a legal certification system, not an eIDAS qualified trust service, not a regulated KYC / AML provider, not a public authority registry and not an institutional deployment.


---

23. Seal

HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA
HERMETICUM B.C.E. S.r.l.

HBCE Research
Torino, Italy, European Union

