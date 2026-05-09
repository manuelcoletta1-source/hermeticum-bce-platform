# I3P — IPR AI Audit Trail Pilot Note

## HERMETICUM B.C.E. S.r.l.

**Project:** IPR AI Audit Trail  
**Base product:** IPR — Identity Primary Record  
**Verified profile:** IPR Verified  
**MVP use case:** IPR AI Audit Trail  
**Runtime demonstrator:** JOKER-C2  
**Operational ecosystem:** HBCE  
**Architectural framework:** MATRiX  
**Issuer:** HERMETICUM B.C.E. S.r.l.  
**Current status:** R&D MVP / internal self-pilot  
**Primary repository:** `hermeticum-bce-platform`  
**Reference date:** 2026-05-09  
**Public route audit:** PASS  
**Reference files:** `README.md`, `STATUS.md`, `PUBLIC_ROUTE_AUDIT_PASS_2026-05-08.md`, `MATRIX_AI_AUDIT_TRAIL_MVP_BRIEF.md`

---

## 1. Purpose of this note

This note summarizes the current MVP proposed for incubation, technical review or pilot discussion.

The objective is to present **IPR AI Audit Trail** as the first concrete and testable MVP use case built around **IPR — Identity Primary Record**, the base operational product of the HERMETICUM B.C.E. platform.

The current positioning is:

- **IPR** is the first operational product.
- **IPR Base** is a technical R&D record, not verified identity.
- **IPR Verified** is the private-verification profile based on tax-code and valid identity-document evidence.
- **IPR Professional** is a future business / audit profile based on IPR Verified.
- **IPR AI Audit Trail** is the first MVP / pilot use case.
- **JOKER-C2** is the runtime demonstrator.
- **HBCE** is the operational ecosystem.
- **MATRiX** is the broader architectural framework.
- **HERMETICUM B.C.E. S.r.l.** is the R&D / operating vehicle for developing and presenting the project.

The current phase is an internal R&D self-pilot, with HERMETICUM B.C.E. S.r.l. as the first pilot client before any external customer pilot.

This page is prepared for possible I3P / incubation review. It does not state or imply that I3P has approved, validated, incubated, endorsed or adopted the project.

---

## 2. IPR Verified model

IPR Verified strengthens the professional startup-grade positioning of the platform.

The target model is:

```text
tax code
→ valid identity document
→ private evidence package
→ IPR Verified record
→ minimized public proof reference
→ verification / audit / EVT / OPC

Accepted valid identity-document categories are:

identity card / CIE
passport
driving license

This material belongs only in the private verification layer.

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
identity scan
portrait image
biometric material
private evidence
personal data
personal payload

The public layer may contain only minimized technical references such as:

subject_label
verification_level
payload_sha256
timestamp
status
evt_id
opc_id
audit_state

Supported public verification levels are:

IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
RND_ONLY
NOT_APPLICABLE

A public proof reference does not certify legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority validation or production authorization.


---

3. Problem

Organizations increasingly use AI for document analysis, compliance support, governance review, cybersecurity documentation, legal operations and internal audit.

However, many AI-assisted workflows remain weak from an audit perspective because the organization cannot always reconstruct:

which document was analyzed;

which hash identifies the input;

which operational identity or runtime was attached;

whether the record was only IPR Base or part of an IPR Verified workflow;

what the AI did;

which governance decision was applied;

whether a human validated the result;

which event was generated;

which proof was produced;

whether an audit-ready report exists.


The result is a gap between AI productivity and operational accountability.


---

4. MVP solution

IPR AI Audit Trail converts an AI-assisted document workflow into a structured technical trace.

The minimal workflow is:

IPR operational reference
→ document upload
→ document SHA-256
→ AI-assisted analysis
→ governance decision
→ human validation
→ EVT event
→ OPC proof
→ audit-ready report

The MVP is designed to show that AI-assisted work can move from an untraceable chat-like interaction to a reviewable, exportable and audit-ready sequence.

The key correction is that the MVP is not presented as “MATRiX as product”. MATRiX remains the architectural framework. The operational product is IPR, and the first demonstrable use case is IPR AI Audit Trail.


---

5. What the MVP currently demonstrates

The current MVP demonstrates:

IPR-linked operational reference;

document hash generation;

AI-assisted document analysis;

risk classification;

governance decision recording;

human validation;

EVT continuity;

OPC proof reference;

audit-ready report generation;

fail-closed interpretation;

public proof minimization;

compatibility with IPR Base / IPR Verified / IPR Professional terminology.


The first successful internal run was completed on 2026-05-07 using an internal document from the U.S.E. — United States of Europe project.

Recorded internal run references:

document_sha256: 829084cb740c21c1cc5b59ffdb4c220169e05627a5f7abf469f4ede96e8aae32
final_state: AUDIT_READY
EVT: EVT-20260507121131-5ABF693B
OPC: OPC-20260507121131-9DF07633


---

6. Current platform status

The public HBCE platform is being aligned around an IPR-first product hierarchy and an IPR Verified private-verification model.

Current target positioning:

IPR_PRODUCT_FIRST
IPR_VERIFIED_PRIVATE_VERIFICATION_MODEL_ACTIVE
IPR_AI_AUDIT_TRAIL_MVP_ACTIVE
HBCE_ECOSYSTEM_ALIGNED
JOKER_C2_RUNTIME_DEMONSTRATOR_ALIGNED
MATRIX_ARCHITECTURAL_FRAMEWORK_ALIGNED
REGISTRY_V3_ALIGNED
REGISTRY_VERIFICATION_LEVELS_ACTIVE
PUBLIC_IDENTITY_GUARDRAILS_ACTIVE
SCHEMA_PUBLIC_IDENTITY_MINIMIZATION_ACTIVE
VERIFY_SURFACE_ALIGNED
VERIFY_PACK_SURFACE_ALIGNED
CLAIMS_NON_CLAIMS_ALIGNED
PUBLIC_ROUTE_AUDIT_PASS_2026-05-08

Latest public route audit result:

BAD ROUTE REFERENCES: OK
ACTIONABLE LEGACY TEXT REFERENCES: OK
BROKEN OR UNREACHABLE INTERNAL ROUTES: OK
AUDIT INTERPRETATION: PASS

Some repository filenames may still contain the previous MATRIX_AI_AUDIT_TRAIL naming while the content is being refactored. The conceptual perimeter is now IPR-first.


---

7. Public platform spine

The current public spine is:

IPR
→ IPR Verified
→ IPR AI Audit Trail
→ JOKER-C2 runtime demonstrator
→ Registry
→ Verify
→ Verify Pack
→ Claims / Legal / Privacy / Terms / Security / Compliance / Governance
→ MATRiX as architectural framework

Main public routes:

/ipr/
/what-is-ipr/
/create/
/activate/
/matrix-audit-trail/
/joker-c2/
/registry/
/verify/
/verify-pack/
/claims/
/legal/
/privacy/
/terms/
/security/
/compliance/
/governance/


---

8. Registry and verification model

The public registry uses a privacy-minimal, hash-oriented model.

The registry layer is based on:

hash-oriented public proof references;

manual append-only discipline;

privacy-minimal metadata;

verification-level support;

fail-closed verification;

no public data custody;

no public tax-code custody;

no public document-number custody;

no public identity-document custody;

no private key custody;

no financial custody;

no regulated certification claim;

no public authority claim;

no eIDAS qualification claim;

no KYC / AML provider claim.


Verification interpretation:

PUBLIC_REFERENCE_PRESENT
→ a public proof reference exists

NO_PUBLIC_RECORD
→ no matching public proof reference was found

NON_OPERATIONAL
→ registry or verifier state is invalid

INVALID
→ input is missing, malformed, ambiguous, forbidden or rejected

A public registry match does not certify legal validity, cybersecurity assurance, institutional approval, regulated compliance, KYC / AML compliance, eIDAS qualification, operator qualification or production authorization.


---

9. Target pilot users

The first external pilot can be relevant for:

compliance consultants;

AI governance advisors;

cybersecurity reviewers;

legal operations teams;

internal audit teams;

public-sector innovation units;

regulated-sector R&D teams;

technical due-diligence teams.


The MVP is especially relevant where AI is used to analyze documents, policies, risk material, governance files, compliance evidence or technical reports.


---

10. 30-day pilot hypothesis

A first external pilot can be structured as a controlled 30-day R&D pilot.

Suggested structure:

Week 1
→ define pilot scope
→ select document categories
→ define authorized / non-sensitive data boundary
→ define IPR profile: IPR Base / IPR Verified / IPR Professional
→ configure audit report format

Week 2
→ run controlled AI-assisted document analyses
→ generate document hashes
→ record governance decisions
→ apply human validation

Week 3
→ generate EVT / OPC proof references
→ export audit-ready reports
→ inspect verification and evidence consistency

Week 4
→ review results
→ identify gaps
→ produce pilot summary
→ define production-readiness requirements

Expected output:

sample audit reports;

IPR-linked document hash records;

validation records;

EVT / OPC references;

risk and governance decision logs;

pilot summary;

production-readiness requirements.



---

11. Boundaries and non-claims

IPR AI Audit Trail is currently an R&D MVP and internal self-pilot.

It does not claim:

legal certification;

regulatory approval;

eIDAS qualification;

qualified trust-service status;

regulated KYC / AML provider status;

public-sector adoption;

external audit certification;

automated compliance;

legally binding evidence status by itself;

production-grade enterprise SaaS readiness;

public authority approval;

financial or banking authorization;

replacement of SPID, CIE, EUDI Wallet, eIDAS schemes, public registries or qualified trust services.


Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.


---

12. Why this may fit an incubation path

The project is suitable for incubation or technical advisory review because it has moved from broad architecture into a concrete MVP boundary.

Current strengths:

IPR-first product hierarchy;

IPR Verified private-verification model;

defined first MVP use case;

internal self-pilot already identified;

first successful internal R&D run completed;

public documentation spine aligned;

registry v3 proof model available;

verification levels implemented in registry and schema posture;

verification surfaces available;

route audit passed;

clear non-claims and R&D boundary;

pilot structure definable in 30 days.


The incubation need is to help transform the R&D MVP into a clearer pilot-ready offer, including product scope, customer discovery, legal/compliance review, pricing, packaging and technical roadmap.


---

13. Request for discussion

HERMETICUM B.C.E. S.r.l. is seeking a technical and business-oriented review of the IPR AI Audit Trail MVP.

The requested discussion concerns:

MVP clarity;

pilot feasibility;

incubation fit;

B2B/B2G positioning;

first customer discovery;

technical roadmap;

legal and compliance boundary;

private verification boundary for IPR Verified;

30-day pilot package.


The immediate objective is not to claim production readiness, but to evaluate whether the current R&D MVP can become a controlled external pilot for organizations that need auditable AI-assisted document workflows.


---

14. Public links

Public gateway:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/

IPR:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/ipr/

IPR Verified:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/activate/

IPR AI Audit Trail:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/matrix-audit-trail/

JOKER-C2:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/joker-c2/

Registry:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/registry/

Verify:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/verify/

Tools:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/tools/

Reference files:

README.md
STATUS.md
PUBLIC_ROUTE_AUDIT_PASS_2026-05-08.md
MATRIX_AI_AUDIT_TRAIL_MVP_BRIEF.md
MATRIX_AI_AUDIT_TRAIL_MVP_ALIGNMENT_2026-05-08.md


---

15. Contact

Manuel Coletta
HBCE Research
HERMETICUM B.C.E. S.r.l.
Torino, Italy, European Union

Email: manuelcoletta1@gmail.com
PEC: hermeticum@pec.it
Phone: +39 351 572 4982




