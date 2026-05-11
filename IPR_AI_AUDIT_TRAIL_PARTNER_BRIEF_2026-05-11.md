# IPR AI Audit Trail — Partner Brief

**Date:** 2026-05-11  
**Issuer:** HERMETICUM B.C.E. S.r.l.  
**Maintainer:** Manuel Coletta  
**Repository:** `hermeticum-bce-platform`  
**Public gateway:** `https://manuelcoletta1-source.github.io/hermeticum-bce-platform/`  
**Status:** R&D-stage MVP / internal self-pilot / partner-review material  
**Reference audit:** `PUBLIC_ROUTE_AUDIT_PASS_2026-05-11.md`

---

## 1. Executive summary

IPR AI Audit Trail is the first concrete MVP built around **IPR — Identity Primary Record**, the base operational product of the HERMETICUM B.C.E. platform.

The MVP addresses a practical problem: organizations increasingly use AI for document analysis, governance review, compliance support, cybersecurity documentation, legal operations and internal audit, but the operational trace of that AI use is often weak.

IPR AI Audit Trail converts AI-assisted document work into an IPR-linked, human-validated and audit-ready workflow.

The current product hierarchy is:

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

The MVP is narrow by design. It does not attempt to validate the whole MATRIX framework at once. It isolates one testable, reviewable and commercially understandable workflow.


---

2. Product positioning

The project should be presented externally as follows:

IPR is the product.
IPR AI Audit Trail is the first MVP.
HBCE is the governance ecosystem.
JOKER-C2 is the runtime demonstrator.
MATRIX is the architectural framework.

This distinction is central for partner, incubator and customer review.

The first product to validate is not the entire MATRIX framework.

The first product to validate is IPR.

The first MVP derived from IPR is IPR AI Audit Trail.


---

3. Problem

AI-assisted document workflows often lack durable auditability.

A team may use AI to summarize, classify, review or compare a document, but later may be unable to reconstruct:

which document was analyzed;

which hash identifies the input;

which operational identity was attached;

which AI action was requested;

which risk class or governance state was assigned;

whether a human validated the result;

which event was generated;

which proof was produced;

whether an audit-ready report exists.


This creates a gap between AI productivity and institutional accountability.

The problem is not only whether the AI output is useful.

The problem is whether the organization can later reconstruct the sequence that produced, reviewed and validated that output.


---

4. Solution

IPR AI Audit Trail creates a controlled workflow around AI-assisted document review.

Minimal flow:

IPR operational reference
→ document upload
→ document SHA-256
→ AI-assisted analysis
→ governance decision
→ human validation
→ EVT event
→ OPC proof
→ audit-ready report

The value of the MVP is not merely the AI response.

The value is the IPR-linked audit trail around the AI response.


---

5. What the MVP demonstrates

The MVP demonstrates:

operational identity linkage through IPR;

document hash generation;

AI-assisted document analysis;

governance decision recording;

human validation;

EVT continuity;

OPC proof reference;

audit-ready report generation;

fail-closed interpretation;

public proof minimization;

separation between private evidence and public proof.


The central value proposition is:

AI-assisted document work can become IPR-linked, traceable, attributable, human-validated and audit-reportable.


---

6. First internal self-pilot

The first pilot client is HERMETICUM B.C.E. S.r.l. itself.

This is intentional. Before proposing the model to external clients, HERMETICUM B.C.E. uses its own system as an internal R&D self-pilot.

The first successful MVP run was completed on 2026-05-07 using an internal U.S.E. — United States of Europe document.

Recorded internal run references:

document_sha256: 829084cb740c21c1cc5b59ffdb4c220169e05627a5f7abf469f4ede96e8aae32
final_state: AUDIT_READY
EVT: EVT-20260507121131-5ABF693B
OPC: OPC-20260507121131-9DF07633

This run demonstrates the ability to generate:

document hash;

governance decision;

human validation state;

EVT reference;

OPC proof reference;

audit-ready report state.



---

7. IPR Verified model

IPR Verified is the private-verification profile of the platform.

It may use private verification based on:

tax code
identity card / CIE
passport
driving license
private evidence package

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

The public layer may contain only minimized proof references such as:

subject_label
operator_label
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

8. Target partner profiles

The first partner discussions should focus on organizations that already understand auditability, governance or regulated workflows.

Potential partner profiles include:

compliance consultants;

AI governance advisors;

cybersecurity consultants;

legal operations teams;

internal audit teams;

technical due-diligence reviewers;

research centers;

incubators;

public-sector innovation units;

enterprise innovation teams.


The first target is not broad public-sector deployment.

The first target is controlled partner review and narrow pilot validation.


---

9. First customer hypothesis

The first commercial hypothesis is:

Compliance, AI governance and cybersecurity consulting providers may use IPR AI Audit Trail to offer clients a verifiable trace of AI-assisted document work.

This target is appropriate because these providers already need to show that AI is being used in a controlled, documentable and reviewable manner.

They can use IPR AI Audit Trail as an audit wrapper around existing AI-assisted document workflows.


---

10. 30-day external pilot proposal

A first external pilot should remain narrow.

Suggested pilot structure:

duration: 30 days
users: 1–3 authorized operators
documents: 10–20 synthetic, public, owned or expressly authorized documents
workflow: one AI-assisted document analysis process
output: audit-ready report package
final deliverable: pilot evaluation and productization roadmap

Pilot phases:

Week 1

define scope;

select document categories;

define non-sensitive / authorized data boundary;

define IPR profile: IPR Base, IPR Verified or IPR Professional;

configure audit report format.


Week 2

run controlled AI-assisted document analyses;

generate document hashes;

record governance decisions;

apply human validation.


Week 3

generate EVT / OPC proof references;

export audit-ready reports;

inspect verification and evidence consistency.


Week 4

review results;

identify gaps;

produce pilot summary;

define production-readiness requirements.



---

11. Pilot boundaries

The pilot must use only:

synthetic documents;

public documents;

authorized internal documents;

non-sensitive test material;

documents approved for R&D review.


The public pilot must not use:

secrets;

private keys;

credentials;

identity documents;

tax codes;

document numbers;

customer personal data;

confidential third-party data;

production logs containing sensitive data;

private communications;

regulated evidence requiring protected handling.


If sensitive data or real identity verification is required for a real deployment, the public R&D setup is insufficient and a dedicated legal, security, privacy and compliance environment is required.


---

12. Current public platform status

The public HBCE Platform has been aligned around the IPR-first product hierarchy and the IPR Verified private-verification model.

Current state:

PUBLIC_ROUTE_LAYER_CLEAN
IPR_PRODUCT_FIRST
IPR_BASE_RND_PROFILE_DEFINED
IPR_VERIFIED_PRIVATE_VERIFICATION_MODEL_ACTIVE
IPR_PROFESSIONAL_PROFILE_DEFINED_AS_FUTURE_BUSINESS_AUDIT_PROFILE
IPR_AI_AUDIT_TRAIL_MVP_ACTIVE
HBCE_ECOSYSTEM_ALIGNED
JOKER_C2_RUNTIME_DEMONSTRATOR_ALIGNED
MATRIX_ARCHITECTURAL_FRAMEWORK_ALIGNED
REGISTRY_V3_ALIGNED
REGISTRY_VERIFICATION_LEVELS_ACTIVE
PUBLIC_IDENTITY_GUARDRAILS_ACTIVE
SCHEMA_PUBLIC_IDENTITY_MINIMIZATION_ACTIVE
PROTOCOL_RND_ALIGNED
VERIFY_SURFACE_ALIGNED
VERIFY_PACK_SURFACE_ALIGNED
TOOLS_GUARDRAIL_ALIGNED
OPERATOR_REGISTRY_SURFACE_CLEAN
ROOT_REFERENCE_ALIGNED
CREATE_BASE_RND_ALIGNED
CLAIMS_NON_CLAIMS_ALIGNED
LEGAL_PRIVACY_TERMS_SECURITY_COMPLIANCE_GOVERNANCE_ALIGNED
COMMERCIAL_PILOT_PAGES_ALIGNED
ROOT_MARKDOWN_CORE_ALIGNED
NO_BROKEN_INTERNAL_ROUTES
NO_DECLASSED_ROUTE_REFERENCES
NO_ACTIONABLE_LEGACY_TERMS
PUBLIC_ROUTE_AUDIT_PASS_2026-05-11

Latest route-audit interpretation:

BAD ROUTE REFERENCES: OK
ACTIONABLE LEGACY TEXT REFERENCES: OK
BROKEN OR UNREACHABLE INTERNAL ROUTES: OK
AUDIT INTERPRETATION: PASS

Reference audit file:

PUBLIC_ROUTE_AUDIT_PASS_2026-05-11.md


---

13. Partner-review questions

A partner review should focus on the following questions:

1. Is the MVP narrow enough for a first pilot?


2. Is the buyer segment clear?


3. Is the audit report valuable for compliance, cybersecurity or AI governance teams?


4. Is the IPR distinction understandable?


5. Is the IPR Verified private-verification boundary clear?


6. Is the public proof / private evidence separation credible?


7. Which integrations would be required for a controlled external pilot?


8. Which legal, privacy and security reviews are needed before real data use?


9. What would make the MVP commercially repeatable?


10. What should be removed, simplified or hardened before first external pilot?




---

14. What the MVP does not claim

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

15. Public links

Public gateway:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/

IPR:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/ipr/

What is IPR:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/what-is-ipr/

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

Pricing:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/pricing/

Request pilot:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/buy/

Contact:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/contact/


---

16. Contact

Manuel Coletta
HBCE Research
HERMETICUM B.C.E. S.r.l.
Torino, Italy, European Union

Email: manuelcoletta1@gmail.com
PEC: hermeticum@pec.it
Phone: +39 351 572 4982


---

17. Final statement

IPR AI Audit Trail is the first partner-reviewable MVP of the HBCE Platform.

It converts AI-assisted document work into an IPR-linked, traceable, human-validated and audit-ready sequence.

The correct external message is:

IPR is the product.
IPR AI Audit Trail is the MVP.
HBCE is the ecosystem.
JOKER-C2 is the runtime demonstrator.
MATRIX is the framework.
HERMETICUM B.C.E. S.r.l. is the R&D / operating vehicle.

The project is ready for partner review, incubation review and controlled external pilot discussion, while remaining inside the declared R&D/MVP boundary.

