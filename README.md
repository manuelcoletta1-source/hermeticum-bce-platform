# HBCE Platform

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

HBCE Platform is the public R&D gateway and documentation repository for the HERMETICUM B.C.E. research infrastructure.

The current product focus is:

```text
IPR — Identity Primary Record

IPR is the first operational product of the platform.

IPR is a verified operational identity record designed to connect a subject, a role, an operation, an event, a proof reference, responsibility and continuity into a verifiable operational trace.

In the current startup-grade model, IPR follows a private identity-verification workflow similar in structure to standard banking and fintech onboarding flows:

tax code
→ valid identity document
→ private verification package
→ IPR record
→ minimized public proof reference
→ verification / audit / EVT / OPC

Accepted valid identity-document categories for a human IPR are:

identity card / CIE
passport
driving license

The public registry does not store identity documents, tax codes, document numbers, scans, personal payloads or private evidence. It stores only minimized proof references.


---

1. Product hierarchy

The repository uses a strict distinction between product, ecosystem, runtime and framework.

IPR
→ first operational product

IPR AI Audit Trail
→ first MVP / pilot use case

HBCE
→ operational ecosystem where IPR works

JOKER-C2
→ runtime demonstrator

MATRiX
→ wider architectural framework

This distinction is central.

The first product to validate is not the whole MATRiX framework.

The first product to validate is IPR.

The first MVP derived from IPR is:

IPR AI Audit Trail


---

2. What IPR is

IPR — Identity Primary Record — is an operational identity, attribution and proof record.

It is not only a login, not only an account, not only a hash, not only a document signature and not only a registry entry.

An IPR connects:

verified subject reference
operational role
organization or context
operation
document or process
verifiable event
hash / proof reference
continuity of trace
responsibility ownership

In practical terms, IPR is designed to answer:

who operated
under which role
inside which system
on which document or process
with which responsibility
with which event
with which proof
with which verifiable continuity

A login says who entered a system.

A log says that something happened.

A signature says who signed.

A hash says whether data changed.

IPR connects identity, operation, event, proof, responsibility and continuity into one verifiable operational trace.


---

3. Private verification and public proof minimization

The platform separates private identity verification from public proof.

The private verification layer may use:

tax code
valid identity document
identity card / CIE
passport
driving license
controlled evidence package

The public proof layer must not contain:

tax code
identity document number
passport number
driving license number
identity document scan
portrait image
address
date of birth
raw personal identifier
private evidence
customer file
private prompt
private AI output
production log
sensitive operational payload

The public layer may contain minimized proof references such as:

IPR reference
verification level
proof scope
payload_sha256
EVT reference
OPC reference
timestamp
status
public non-sensitive label

The correct public model is:

private verification
→ private evidence package
→ hash-oriented proof reference
→ minimized registry entry
→ deterministic verification


---

4. IPR profiles

The current product model is organized into three profiles.

IPR Base

A technical R&D profile for local testing, internal proof flows, hash-oriented attribution and controlled demonstrations.

IPR Verified

A verified operational identity record created through private identity verification using tax-code and valid identity-document evidence.

IPR Professional

A future professional / business / audit workflow profile based on IPR Verified, intended for controlled B2B pilots, AI governance workflows and audit-ready evidence chains.

None of these profiles creates legal identity, regulated certification, eIDAS qualification, qualified trust-service status or public authority validation by itself.


---

5. Functional analogy

IPR can be understood through a functional analogy.

An IBAN identifies a bank account inside the financial system.

A tax code identifies a subject inside the administrative and fiscal system.

A digital signature validates an electronic act.

A digital credential allows access to a service.

IPR is different from all of these, but it plays a similar ordering role inside a governed digital ecosystem.

It identifies an operational subject inside HBCE and connects that subject not only to access, but to operations, events, proofs, responsibility and continuity.

IPR does not claim the current legal status of a tax code, the banking function of an IBAN, the official status of a public identity document or the regulated effect of a qualified digital signature.

The analogy is functional: complex systems require stable reference instruments to organize identity, operations and responsibility.

Inside HBCE, that operational reference instrument is IPR.


---

6. IPR creation model

The target operating model is that an IPR is created through the HERMETICUM B.C.E. Platform using private verification and hash-oriented public proof.

The intended flow is:

private subject verification
→ tax code + valid identity document
→ private evidence package
→ IPR generation
→ initial EVT event
→ OPC / hash / proof reference
→ minimized public registry reference
→ HBCE operating context
→ verifiable use in controlled workflows

The platform is not meant to be only a login surface.

Its target function is to create an operational reference that can be used inside HBCE to connect identity, role, operation, event, proof and responsibility.


---

7. IPR AI Audit Trail MVP

IPR AI Audit Trail is the first MVP extracted from the IPR / HBCE / JOKER-C2 / MATRiX architecture.

The route currently used for this MVP is:

matrix-audit-trail/

The route name remains for deployment continuity, but the product interpretation is now:

IPR AI Audit Trail

The MVP demonstrates a controlled AI-assisted document workflow where the following elements are connected:

IPR reference
→ document upload
→ document SHA-256
→ AI-assisted analysis
→ governance decision
→ human validation
→ EVT event
→ OPC proof
→ audit-ready report

The first pilot client is HERMETICUM B.C.E. S.r.l. itself, using the system as an internal R&D self-audit pilot before any external customer pilot.


---

8. JOKER-C2 runtime demonstrator

JOKER-C2 is not the commercial product.

JOKER-C2 is the runtime demonstrator showing how IPR can operate inside HBCE.

It demonstrates:

AI operational identity
IPR attribution
context classification
governance decisioning
fail-closed behavior
EVT event generation
OPC proof generation
audit-oriented traceability
continuity of state

JOKER-C2 is used to show the operational behavior of the architecture in a controlled R&D environment.

Public runtime:

https://hbce-ai-joker-c2.vercel.app/interface


---

9. Repository purpose

The purpose of this repository is to document and test a public-facing infrastructure model for systems whose actions, records, identities and governance states remain reconstructible, attributable and verifiable over time.

HBCE Platform does not present AI as an autonomous substitute for human or institutional responsibility.

It presents AI as a decision-support and audit-support layer that must remain connected to:

IPR identity reference
human validation
auditability
policy constraints
evidence continuity
responsibility ownership
fail-closed verification


---

10. Public platform spine

The current public spine is:

IPR
→ Create / Activate
→ IPR AI Audit Trail
→ Protocol
→ Registry v3
→ Verify
→ Verify Pack
→ Tools
→ Link Audit
→ Claims / Legal / Security / Compliance / Governance

Primary public routes:

/
ipr/
what-is-ipr/
create/
activate/
matrix-audit-trail/
joker-c2/
ai-joker-c2/
protocol/
registry/
verify/
verify-pack/
tools/
tools/link-audit/
claims/
legal/
privacy/
terms/
security/
compliance/
governance/

Some route names still contain MATRiX terminology for deployment continuity. Their current interpretation is governed by this README:

MATRiX = architectural framework
IPR = first operational product
IPR AI Audit Trail = first MVP


---

11. Governance posture

The platform follows these principles:

EU_FIRST
AUDIT_FIRST
FAIL_CLOSED
HASH_ORIENTED
APPEND_ONLY
GDPR_MIN
PRIVATE_VERIFICATION
PUBLIC_PROOF_MINIMIZATION
NO_PUBLIC_DATA_CUSTODY
NO_PRIVATE_KEY_CUSTODY
NO_FINANCIAL_CUSTODY
NO_REGULATED_CERTIFICATION_CLAIM
NO_PUBLIC_AUTHORITY_CLAIM

Operational interpretation:

missing source → NON_OPERATIONAL
malformed source → NON_OPERATIONAL
ambiguous state → NON_OPERATIONAL
invalid hash → INVALID
no public match → NO_PUBLIC_RECORD
public hash match → PUBLIC_REFERENCE_PRESENT

A public match means only that a public proof reference exists.

It does not certify legal validity, cybersecurity assurance, institutional approval, regulated compliance, operator qualification or production authorization.


---

12. Registry v3

The registry layer is aligned to the current R&D public proof boundary.

Current registry model:

hash-oriented public proof references
manual append-only discipline
privacy-minimal metadata
fail-closed verification
no public identity document custody
no public tax-code custody
no private key custody
no financial custody
no regulated certification claim
no public authority claim

The registry supports the IPR operating model by maintaining public proof references for selected R&D records.

Main registry files and routes:

registry/
registry/registry.json
registry/ledger.json
registry/ipr_registry.json
registry/operators.json
registry/nodes.json
registry/events.json
registry/append/
registry/publish/
registry/operators/
registry/operators/append/
registry/operators/receipt/
registry/operators/pack/
registry/operators/status/

The registry is not a public authority registry, not a regulated identity registry and not a qualified trust service.

It is an R&D reference surface for public proof references, append-only discipline and fail-closed verification behavior.


---

13. Protocol references

The protocol surface is maintained as an R&D reference layer.

Current interpretation:

RND_PROTOCOL_REFERENCE_BUNDLE
non-custodial R&D reference
IPR-first product hierarchy
IPR AI Audit Trail MVP boundary
not a legal standard
not a regulated certification scheme
not an eIDAS qualified trust service
not a public authority registry
not a production compliance framework by itself

Protocol files:

protocol/
protocol/hbce-protocol-v1.official.json
protocol/hbce-registry-ledger.example.json
protocol/hbce-sign.reference.js
protocol/hbce-verify.reference.js
protocol/hbce-network-architecture-v1.md
protocol/hbce-node-spec-v1.md
protocol/hbce-registry-spec-v1.md
protocol/ipr-event-v1.md


---

14. Verification surfaces

The verification layer is aligned to:

public proof reference lookup
local SHA-256 calculation
registry v3 source check
fail-closed validation
private evidence / public proof separation
no public data custody
no regulated certification claim
no public authority claim

Verification routes:

verify/
verify/verify.html
verify-pack/
verify/receipt/
verify/schema/evidence-bundle.schema.json
verify/demo-evidence.json
verify/baseline.md

Verification result interpretation:

PUBLIC_REFERENCE_PRESENT means a public proof reference exists.
NO_PUBLIC_RECORD means no matching public proof reference was found.
NON_OPERATIONAL means the registry or verifier state is invalid.
INVALID means the input is missing, malformed, ambiguous or rejected.


---

15. EVT and OPC

EVT is the verifiable event layer.

An EVT event can represent:

registration
update
AI operation
validation
audit
block
execution
proof
IPR derivation
state transition

OPC is the operational proof layer connected to events.

An OPC proof can include:

event hash
document hash
AI output hash
IPR reference
EVT reference
timestamp
verification state
signature reference
anchor reference
audit report reference

The role of OPC is to move from simple event logging to operational proof.


---

16. Tools and guardrails

The tools layer contains R&D verification utilities.

Current tools:

tools/
tools/link-audit/
tools/registry-guard.js

The link audit separates:

ACTIONABLE LEGACY TEXT REFERENCES
EXPECTED LEGACY / GUARDRAIL REFERENCES
BROKEN OR UNREACHABLE INTERNAL ROUTES
BAD ROUTE REFERENCES

This prevents false audit failure when legacy terms appear only in:

archival audit reports
schema forbidden-field lists
verification guardrails
registry guard code
link-audit pattern lists


---

17. Public data policy

The public repository must not contain:

API keys
private keys
passwords
authentication tokens
production secrets
tax codes
identity document numbers
private identity documents
identity document scans
confidential customer data
private communications
production logs containing personal data
raw AI prompts containing sensitive information
raw AI outputs containing sensitive information
client files
sensitive operational payloads

Public verification materials should use minimal metadata and hash-oriented references wherever possible.

If a verification workflow requires sensitive data, the public layer must fail closed and require private or manual review.


---

18. Security and audit baseline

This repository is subject to a defensive security and governance audit process.

The audit scope includes:

repository-owned code and documentation
GitHub Pages static deployment assumptions
registry integrity and hash-oriented verification logic
fail-closed behavior for missing or invalid registry matches
documentation consistency
environment, secret, dependency and deployment risk review
public route-layer consistency

The audit is strictly defensive, authorized, non-offensive and limited to repository-owned systems and materials.

It does not include exploitation, malware development, credential theft, evasion, unauthorized access, destructive testing, data exfiltration or offensive cybersecurity operations.


---

19. Boundary and non-claims

HBCE Platform is an R&D reference platform.

It does not claim:

legal certification
regulatory approval
eIDAS qualification
public authority approval
public-sector adoption
external audit certification
automated compliance
legally binding evidence status by itself
financial or banking authorization
production-grade enterprise SaaS readiness
qualified trust service status
regulated identity provider status
regulated KYC / AML provider status

Any production deployment, external customer pilot, public-sector use, regulated compliance positioning or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.


---

20. Public project gateway

Public gateway:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/

Primary product area:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/ipr/

Current MVP route:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/matrix-audit-trail/

Registry:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/registry/

Verify:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/verify/

Tools:

https://manuelcoletta1-source.github.io/hermeticum-bce-platform/tools/

JOKER-C2 runtime demonstrator:

https://hbce-ai-joker-c2.vercel.app/interface

GitHub profile:

https://github.com/manuelcoletta1-source


---

21. License and use

This repository is published for research, documentation and governance experimentation.

Any use of the materials should preserve the defensive, audit-oriented and responsibility-preserving nature of the project.

No part of this repository should be used to support unauthorized access, offensive cybersecurity activity, credential theft, malware development, evasion, data exfiltration or harmful automation.


---

22. Maintainer

Manuel Coletta
HBCE Research
HERMETICUM B.C.E. S.r.l.
Torino, Italy, European Union


