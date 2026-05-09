# IPR AI Audit Trail MVP Brief

## HERMETICUM B.C.E. Platform

**Issuer:** HERMETICUM B.C.E. S.r.l.  
**Project:** IPR AI Audit Trail  
**Base product:** IPR — Identity Primary Record  
**Verified profile:** IPR Verified  
**Runtime demonstrator:** JOKER-C2  
**Operational ecosystem:** HBCE  
**Architectural framework:** MATRiX  
**Repository:** `hermeticum-bce-platform`  
**Status:** R&D MVP / internal self-pilot  
**Primary pilot client:** HERMETICUM B.C.E. S.r.l.  
**Reference date:** 2026-05-09  
**Public route audit:** PASS  
**Reference files:** `README.md`, `STATUS.md`, `PUBLIC_ROUTE_AUDIT_PASS_2026-05-08.md`

---

## 1. Executive summary

IPR AI Audit Trail is the first MVP use case built around **IPR — Identity Primary Record**.

The MVP addresses a concrete operational problem: AI-assisted work often produces useful outputs, but organizations cannot always reconstruct what happened, which document was processed, which operational identity or runtime was attached, what the AI did, which governance decision was applied, whether a human validated the result, and whether an audit-ready trace exists.

The product hierarchy is now:

```text
IPR = base operational product
IPR Base = technical R&D record, not verified identity
IPR Verified = private verification with tax code + valid identity document
IPR Professional = business / audit profile based on IPR Verified
IPR AI Audit Trail = first MVP use case
JOKER-C2 = runtime demonstrator
HBCE = operational ecosystem
MATRiX = architectural framework
HERMETICUM B.C.E. S.r.l. = R&D / operating vehicle

IPR AI Audit Trail converts an AI-assisted document workflow into a structured technical trace.

The minimal flow is:

IPR operational reference
→ document upload
→ document SHA-256
→ AI-assisted analysis
→ governance decision
→ human validation
→ EVT event
→ OPC proof
→ audit-ready report

The current MVP is not presented as a production compliance system. It is an R&D self-pilot and demonstrator showing how AI work can become inspectable, attributable and exportable for audit review.


---

2. IPR profile model

The platform now distinguishes three IPR profiles.

IPR Base

IPR Base is a technical R&D record for proof flows, internal testing, controlled demonstrations and audit-oriented experiments.

It does not create verified identity status.

IPR Verified

IPR Verified is the private-verification profile.

It may use:

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

IPR Professional

IPR Professional is a future business / audit workflow profile based on IPR Verified.

It is intended for controlled B2B pilots, AI governance workflows, legal-operations documentation, cybersecurity documentation and audit-ready evidence chains.

It does not create regulated certification, public authority validation, eIDAS qualification, KYC / AML provider status or production SaaS readiness by itself.


---

3. Problem

AI-assisted document analysis is becoming common in compliance, cybersecurity, governance, legal operations, internal audit and institutional research.

However, many workflows remain operationally weak because they lack a clear technical trail.

Typical problems include:

no durable record of the document analyzed;

no stable hash of the input material;

no operational identity reference attached to the workflow;

no distinction between IPR Base and IPR Verified;

no clear distinction between AI output and human validation;

no governance decision recorded;

no event continuity;

no public or private proof reference;

no exportable audit report;

no fail-closed behavior when evidence is missing.


This creates a gap between AI productivity and institutional accountability.

The problem is not only whether the AI output is useful. The problem is whether the organization can later reconstruct the sequence that produced or validated that output.


---

4. MVP objective

The objective of IPR AI Audit Trail is to demonstrate a minimal, controlled and inspectable AI audit workflow.

The MVP demonstrates that an AI-assisted document analysis can be transformed into an audit-ready technical record containing:

IPR operational reference;

optional verification-level label;

document hash;

AI action;

risk class;

governance decision;

human validation state;

EVT identifier;

OPC proof;

audit state;

report output.


The MVP is designed to be understandable by:

compliance consultants;

cybersecurity reviewers;

AI governance advisors;

legal operations teams;

internal audit teams;

technical evaluators;

R&D partners;

institutional reviewers.



---

5. What the MVP does

The MVP performs a controlled AI-assisted document workflow.

At minimum, it can:

attach an IPR operational reference;

distinguish IPR Base, IPR Verified and IPR Professional when applicable;

accept a document or document-like input;

compute or record a SHA-256 hash;

send the content into an AI-assisted analysis flow;

classify the action and risk context;

apply a governance decision;

require human validation;

generate an EVT event;

generate an OPC proof reference;

produce an audit-ready report.


The resulting report is intended to be readable and exportable.

The report does not replace legal or regulatory review. It gives reviewers a structured technical trace to inspect.


---

6. What the MVP demonstrates

The MVP demonstrates that AI work can be moved from an untraceable chat-like interaction into a structured accountability flow.

It demonstrates:

operational identity linkage through IPR;

traceability of AI-assisted document processing;

separation between IPR Base and IPR Verified where relevant;

separation between AI output and human validation;

governance decision recording;

document-hash anchoring;

event continuity through EVT;

proof reference through OPC;

audit-ready reporting;

fail-closed interpretation.


The main claim is technical and operational:

AI-assisted work can be converted into an IPR-linked audit-ready sequence.


---

7. First internal self-pilot

The first pilot client is HERMETICUM B.C.E. S.r.l. itself.

This is intentional. Before proposing the model to external clients, the company uses its own system as an internal R&D self-pilot.

The internal self-pilot allows HERMETICUM B.C.E. S.r.l. to test:

IPR-linked workflow structure;

AI document analysis;

governance decision logic;

human validation;

event creation;

OPC proof generation;

report export;

registry and verification alignment;

public-route audit hygiene;

private/public evidence separation.


The first successful MVP run was completed on 2026-05-07 using an internal document from the U.S.E. — United States of Europe project.

Recorded internal run references:

document_sha256: 829084cb740c21c1cc5b59ffdb4c220169e05627a5f7abf469f4ede96e8aae32
final_state: AUDIT_READY
EVT: EVT-20260507121131-5ABF693B
OPC: OPC-20260507121131-9DF07633


---

8. Public platform alignment

The public HBCE platform has been aligned around the IPR-first MVP hierarchy and the IPR Verified private-verification model.

Current public status:

PUBLIC_ROUTE_LAYER_CLEAN
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
PROTOCOL_RND_ALIGNED
VERIFY_SURFACE_ALIGNED
VERIFY_PACK_SURFACE_ALIGNED
TOOLS_GUARDRAIL_ALIGNED
OPERATOR_REGISTRY_SURFACE_CLEAN
ROOT_REFERENCE_ALIGNED
CREATE_BASE_RND_ALIGNED
CLAIMS_NON_CLAIMS_ALIGNED
NO_BROKEN_INTERNAL_ROUTES
NO_DECLASSED_ROUTE_REFERENCES
NO_ACTIONABLE_LEGACY_TERMS
PUBLIC_ROUTE_AUDIT_PASS_2026-05-08

The latest public route audit returned:

BAD ROUTE REFERENCES: OK
ACTIONABLE LEGACY TEXT REFERENCES: OK
BROKEN OR UNREACHABLE INTERNAL ROUTES: OK
AUDIT INTERPRETATION: PASS

Reference audit file:

PUBLIC_ROUTE_AUDIT_PASS_2026-05-08.md

The previous phrase “MATRIX AI Audit Trail” may remain in historical filenames, but the current conceptual perimeter is IPR-first. MATRiX is the architectural framework, not the main product.


---

9. Public spine

The public platform spine is:

IPR
→ IPR Verified
→ IPR AI Audit Trail
→ JOKER-C2 runtime demonstrator
→ Registry v3
→ Verify
→ Verify Pack
→ Tools / Link Audit
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
/tools/
/tools/link-audit/
/claims/
/legal/
/privacy/
/terms/
/security/
/compliance/
/governance/


---

10. Registry and proof model

The registry layer uses a privacy-minimal public proof model.

The public registry is designed around:

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


Supported public verification levels are:

IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
RND_ONLY
NOT_APPLICABLE

The public registry should not store:

tax codes;

fiscal codes;

identity document numbers;

identity documents;

identity scans;

passport numbers;

driving license numbers;

private evidence;

credentials;

secrets;

private keys;

raw AI prompts;

raw AI outputs;

client files;

personal data;

production logs;

internal endpoints;

sensitive operational payloads.


A registry match means only that a public hash reference exists.

It does not certify legal validity, cybersecurity assurance, public authority approval, regulated compliance, KYC / AML compliance, eIDAS qualification, operator qualification or production authorization.


---

11. Verification model

The verification layer supports public hash lookup and local deterministic checks.

Verification result interpretation:

PUBLIC_REFERENCE_PRESENT
→ a public proof reference exists

NO_PUBLIC_RECORD
→ no matching public proof reference was found

NON_OPERATIONAL
→ registry or verifier state is invalid

INVALID
→ input is missing, malformed, ambiguous, forbidden or rejected

Verification can inspect public labels such as:

IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT

These are technical scope indicators, not legal certification.

The verification model is fail-closed.

Missing, malformed, ambiguous, forbidden or inconsistent state must not produce validity.


---

12. What the MVP does not claim

IPR AI Audit Trail is an R&D MVP and internal self-pilot.

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

13. Target users

The first external pilot targets are organizations or professionals that need to make AI-assisted work more auditable.

Potential users include:

compliance consultants;

AI governance advisors;

cybersecurity reviewers;

legal operations teams;

internal audit teams;

public-sector innovation units;

regulated-sector R&D teams;

technical due-diligence teams.


The MVP is especially relevant where AI is used to analyze documents, policies, reports, risk material, governance files or compliance evidence.


---

14. Example use cases

Potential use cases include:

AI-assisted compliance document review;

AI-assisted cybersecurity policy analysis;

AI-assisted internal audit support;

AI-assisted legal-operations document triage;

AI-assisted governance report review;

AI-assisted public-sector documentation review;

AI-assisted R&D evidence preparation;

AI-assisted vendor or procurement documentation review.


In each case, the value is not only the AI output.

The value is the IPR-linked audit trail around the AI output.


---

15. 30-day pilot outline

A first external pilot can be structured as a 30-day controlled R&D pilot.

Suggested pilot structure:

Week 1
→ define pilot scope
→ select document categories
→ define non-sensitive / authorized data boundary
→ define IPR Base or IPR Verified profile
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

Expected pilot output:

sample audit reports;

IPR-linked document hash records;

validation records;

EVT / OPC references;

risk and governance decision logs;

pilot summary;

recommendations for production hardening.



---

16. Pilot boundaries

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

17. Commercial interpretation

IPR AI Audit Trail can be positioned as:

IPR-linked AI audit-trail layer;

AI governance evidence layer;

AI-assisted document audit wrapper;

fail-closed verification layer for AI workflows;

R&D demonstrator for responsible AI operations.


It is not currently positioned as:

certification authority;

regulated compliance platform;

public authority registry;

eIDAS trust service;

regulated KYC / AML provider;

banking or financial system;

autonomous decision authority;

production-grade SaaS without further review.



---

18. Why this MVP matters

The MVP is important because AI governance needs operational proof, not only policy language.

A policy can say that human validation is required. IPR AI Audit Trail shows a workflow where human validation becomes part of the trace.

A policy can say that records must be auditable. IPR AI Audit Trail shows a workflow where the IPR reference, document hash, AI analysis, governance decision, validation and report output become inspectable.

A policy can say that AI use must be accountable. IPR AI Audit Trail shows how accountability can be structured as a technical sequence.


---

19. Current readiness

Current readiness level:

R&D MVP: active
internal self-pilot: active
IPR-first hierarchy: active
IPR Verified model: active
public documentation spine: aligned
public route audit: passed
registry v3: aligned
verification levels: aligned
verification surfaces: aligned
external production deployment: not yet claimed
regulated compliance status: not claimed

The platform is ready for:

internal self-pilot reporting;

controlled partner demo;

I3P / incubator review;

technical due-diligence discussion;

30-day external pilot preparation.


The platform is not yet claiming:

production enterprise SaaS readiness;

regulated compliance automation;

public-sector operational adoption;

external certification;

qualified trust-service status;

regulated KYC / AML provider status.



---

20. Reference links

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

Audit pass:

PUBLIC_ROUTE_AUDIT_PASS_2026-05-08.md

Status:

STATUS.md


---

21. Final statement

IPR AI Audit Trail is the first concrete MVP use case of the HBCE platform.

It converts AI-assisted document work into an IPR-linked, traceable, reviewable and audit-ready sequence.

The current public platform is clean for configured actionable findings and ready for internal self-pilot documentation, partner review and controlled external pilot preparation, while remaining inside the declared R&D/MVP boundary.

IPR Verified strengthens the professional positioning of the gateway by defining a private identity-verification model, but the public layer remains minimized, hash-oriented and non-custodial.

