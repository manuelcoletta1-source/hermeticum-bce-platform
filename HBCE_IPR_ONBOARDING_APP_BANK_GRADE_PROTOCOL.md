# HBCE IPR ONBOARDING APP — BANK-GRADE REMOTE ONBOARDING PROTOCOL

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

Document status: `R&D_PROTOCOL_REFERENCE`  
Scope: IPR Onboarding App  
Version: `v1.0`  
Date: `2026-05-20`  
Language: English  
Maintainer: HBCE Research  
Boundary: This document defines an R&D protocol for bank-grade operational onboarding adapted to IPR issuance. It does not create banking authorization, regulated KYC/AML provider status, official European identity issuance, eIDAS qualification, public authority validation or production authorization by itself.

---

## 1. Executive definition

HBCE IPR Onboarding App is the private operational application used to register, verify and enable a subject before governed AI access.

The app applies a bank-grade European remote onboarding model to operational identity issuance.

It does not open a bank account.

It does not issue official European identity.

It does not replace identity card, passport, CIE, SPID, EUDI Wallet or qualified eIDAS certificates.

It issues an internal HBCE operational identity reference:

```text
IPR Verified
→ Identity Primary Record verified inside the HERMETICUM B.C.E. operational environment

The access rule is:

No verified IPR
→ no governed JOKER-C2 access

The user-facing formula is:

Verify who you are.
Receive your IPR Card.
Access governed AI.

The institutional formula is:

HBCE Platform applies a bank-grade remote onboarding model for operational subject registration, adapted to IPR Verified and IPR Card issuance. The process does not open a financial account, does not replace official European identity systems and does not constitute a regulated KYC/AML service by itself.


---

2. Core distinction

2.1 Classic AI access

email
→ password
→ payment
→ generic account
→ model access

2.2 HBCE / JOKER-C2 access

subject registration
→ identity evidence
→ national tax identifier / national identification number
→ document verification
→ selfie / video / liveness
→ private verification package
→ IPR_PENDING
→ review
→ IPR_ACTIVE
→ IPR Card
→ operational certificate
→ JOKER-C2 access gate
→ governed AI runtime

2.3 Market distinction

Classic AI sells access to a model.
HBCE scopes verified operational access to governed AI workflows.


---

3. Regulatory reference posture

This protocol is inspired by European bank-grade remote onboarding practices, especially remote customer onboarding models used by regulated financial institutions.

The relevant operational lessons are:

identity must be verified before high-trust access
document evidence must be checked
the person must be matched against the evidence
unattended flows require liveness controls
risk-based review must exist
private evidence must remain protected
public proof must be minimized

HBCE adopts these lessons for operational identity, not for financial account opening.

3.1 What HBCE adopts

bank-grade onboarding discipline
document-based subject verification
identity-evidence review
photo / video / liveness where applicable
manual escalation where required
risk classification
audit trail
private evidence protection
fail-closed review

3.2 What HBCE does not claim

banking service
payment service
electronic money service
regulated KYC / AML provider status
official identity provider status
qualified trust-service provider status
eIDAS qualification
public authority approval
official European identity issuance


---

4. Correct public wording

The following wording should remain stable across public documentation, pilot materials and institutional communication.

HBCE Platform does not issue official European identity.
HBCE Platform issues IPR Verified: a verifiable operational identity reference inside the HERMETICUM B.C.E. environment.

IPR Card is a digital operational card issued within the HERMETICUM B.C.E. environment.
It does not replace an identity card, passport, CIE, SPID, EUDI Wallet or qualified eIDAS certificate, unless future integrations with recognized identity or trust-service systems are separately established.

HBCE may in the future connect IPR Verified to official European identity systems through compliant integrations, but it must not claim to replace those systems.


---

5. Product architecture

HBCE Public Platform
→ public documentation, public proof, registry, verify, claims and pilot routes

IPR Onboarding App
→ private registration and verification layer

Private Evidence Layer
→ documents, identifiers, selfie, video, liveness, review records

IPR Engine
→ state machine, IPR-ID, IPR profile, IPR Card generation

EVT Layer
→ activation events and operational continuity

OPC Layer
→ operational proof receipts

Public Registry Layer
→ minimized public proof references only

JOKER-C2 Access Gate
→ governed AI runtime access only after IPR verification and policy checks


---

6. User journey

6.1 Initial account

The user creates a preliminary account.

Required fields:

email
phone number
password or passkey
country
language
subject type
privacy acknowledgment
terms acknowledgment

Subject type values:

NATURAL_PERSON
LEGAL_ENTITY
OPERATOR
COMPANY
INSTITUTION
PROFESSIONAL
RESEARCHER
AI_SYSTEM_REFERENCE
NODE_REFERENCE
PROCESS_REFERENCE

Initial state:

IPR_DRAFT


---

6.2 Subject profile

The user enters the subject profile.

For a natural person:

first name
last name
date of birth where legally required
country
nationality where legally required
residence country
subject role

For a legal entity:

legal name
registration country
company registration reference where applicable
authorized representative
representative role
organization email

Public layer rule:

No civil identity payload is written to the public registry.
Only minimized public references and hashes may be published.


---

6.3 Official document evidence

Accepted document categories for natural-person onboarding:

identity card / CIE
passport
driving license
residence permit where applicable

European-neutral wording:

national tax identifier / national identification number

Italian-specific wording where applicable:

codice fiscale

The app must support national variance across EU Member States.

The system must not assume every Member State uses the same tax identifier structure.


---

6.4 Document capture

Document capture should support:

front side
back side where applicable
MRZ where present
document expiry date
document issuing country
document category
document integrity check
document quality check

The app should detect:

blur
glare
partial capture
expired document
unsupported document category
manual review required

Document raw files must be stored only in the private evidence layer.


---

6.5 Face and liveness verification

The app should support:

selfie
short video
liveness check
face-to-document comparison
manual review where automated comparison is inconclusive

Liveness result states:

LIVENESS_PASS
LIVENESS_FAIL
LIVENESS_REVIEW_REQUIRED
LIVENESS_NOT_REQUIRED

The public registry must not contain:

selfie
portrait image
video
liveness video
biometric payload
face embedding
raw comparison data


---

7. IPR state machine

The onboarding state machine is:

IPR_DRAFT
→ account started, subject data incomplete or not submitted

IPR_PENDING
→ evidence submitted and waiting for review

IPR_REVIEW_REQUIRED
→ correction, escalation or human review required

IPR_ACTIVE
→ operational identity verified inside HBCE

IPR_SUSPENDED
→ temporary restriction due to policy, risk or review

IPR_REVOKED
→ no longer valid for operational access

IPR_EXPIRED
→ validity period ended and renewal required

Runtime access interpretation:

NO_IPR
→ ACCESS_DENIED

IPR_DRAFT
→ ACCESS_DENIED

IPR_PENDING
→ REVIEW_REQUIRED

IPR_REVIEW_REQUIRED
→ HUMAN_REVIEW_REQUIRED

IPR_ACTIVE + policy pass + acceptable risk + scope approval
→ ACCESS_ALLOWED

IPR_SUSPENDED
→ ACCESS_DENIED

IPR_REVOKED
→ ACCESS_DENIED

IPR_EXPIRED
→ RENEWAL_REQUIRED


---

8. Verification levels

The app should support progressive verification levels.

L0
→ local / technical R&D reference

L1
→ account and contact verification

L2
→ document-based private verification

L3
→ enhanced private verification with document, national identifier, selfie, video, liveness and manual review where required

Interpretation:

L0
→ not sufficient for governed JOKER-C2 access

L1
→ not sufficient for full IPR Verified

L2
→ suitable for IPR Verified where policy allows

L3
→ enhanced operational verification for higher-trust workflows

None of these levels creates official identity, public authority validation, eIDAS qualification or regulated KYC/AML status by itself.


---

9. IPR profiles

IPR Base
→ technical R&D profile

IPR Verified
→ private verification profile for operational identity

IPR Professional
→ future business / audit workflow profile based on IPR Verified

IPR Operator
→ controlled operational role profile

IPR Entity
→ company / institution / organization-linked profile

IPR AI
→ AI system or runtime-linked operational reference

IPR Process
→ workflow or audit process reference


---

10. Private evidence model

Private evidence may include:

account email
phone number
identity document image
identity document metadata
national tax identifier
national identification number
selfie
short video
liveness evidence
face comparison result
manual review notes
risk notes
review decision
IPR approval decision

This material must remain private or controlled.

It must not be published in:

GitHub Pages
public registry
public JSON files
public issues
public commits
public proof packs
public demo routes


---

11. Public proof model

The public proof layer may contain only:

IPR reference
IPR Card reference
subject_label
subject_type
verification_level
public status
proof_scope
payload_sha256
activation EVT
OPC receipt
timestamp
public non-sensitive label
revocation or suspension state where applicable

The public proof layer must not contain:

tax code
national tax identifier
national identification number
document number
identity document number
passport number
driving license number
residence permit number
identity document
identity document scan
selfie
liveness video
biometric payload
private evidence
manual review notes
personal data
client file
private prompt
private output
credentials
private key
secret
internal endpoint

Correct model:

private verification
→ private evidence package
→ hash-oriented proof reference
→ minimized registry entry
→ deterministic verification


---

12. IPR Card model

IPR Card is the visible operational access object.

It may contain:

IPR-ID
IPR Card ID
subject label
subject type
country
verification level
document verified: yes / no
national identifier verified: yes / no
issuer: HERMETICUM B.C.E. S.r.l.
activation EVT
OPC receipt
public hash reference
QR verification reference
issued at
expires at
status

Allowed card states:

PENDING
ACTIVE
REVIEW_REQUIRED
SUSPENDED
REVOKED
EXPIRED

The IPR Card must display a boundary statement:

IPR Card is a digital operational card issued within the HERMETICUM B.C.E. environment.
It does not replace an identity card, passport, CIE, SPID, EUDI Wallet or qualified eIDAS certificate.


---

13. EVT model

Activation should generate an EVT event.

Examples:

IPR_DRAFT_CREATED
IPR_PENDING_SUBMITTED
IPR_REVIEW_REQUIRED
IPR_ACTIVE_CONFIRMED
IPR_CARD_REQUESTED
IPR_CARD_ISSUED
JOKER_C2_ACCESS_REQUESTED
JOKER_C2_ACCESS_ALLOWED
JOKER_C2_ACCESS_DENIED
HUMAN_VALIDATION_REQUIRED
OPC_RECEIPT_CREATED

Minimum EVT fields:

evt_id
prev_evt
event_type
entity_type
ipr_id
ipr_card_id
subject_label
verification_level
ipr_status
card_status
runtime
operation
decision
risk_level
policy_state
human_review
payload_sha256
opc_receipt
chain_hash
timestamp
boundary


---

14. OPC receipt model

The OPC receipt proves the operational event.

Minimum OPC fields:

receipt_id
receipt_type
ipr_id
ipr_card_id
evt_id
opc_id
subject_label
verification_level
ipr_status
card_status
operation_type
decision_state
risk_level
policy_state
payload_sha256
output_sha256
event_hash
receipt_sha256
chain_hash
issued_at
issuer
boundary

OPC does not create legal certification by itself.

It creates an operational proof receipt inside HBCE.


---

15. JOKER-C2 access gate

JOKER-C2 must be protected by an access gate.

Access input:

user session
IPR-ID
IPR Card ID
IPR status
verification level
policy state
risk state
revocation state
scope

Access decision:

ACCESS_ALLOWED
ACCESS_DENIED
REVIEW_REQUIRED
HUMAN_REVIEW_REQUIRED
RENEWAL_REQUIRED
SUSPENDED
REVOKED

Access rule:

NO_IPR
→ ACCESS_DENIED

IPR_PENDING
→ REVIEW_REQUIRED

IPR_ACTIVE + policy pass
→ ACCESS_ALLOWED where scope allows

IPR_SUSPENDED
→ ACCESS_DENIED

IPR_REVOKED
→ ACCESS_DENIED

IPR_EXPIRED
→ RENEWAL_REQUIRED


---

16. Technical architecture

Recommended architecture:

Frontend
→ Next.js / React mobile-first onboarding interface

Backend API
→ user registration
→ identity workflow
→ IPR state machine
→ IPR Card issuance
→ EVT generation
→ OPC generation
→ access gate

Database
→ private user records
→ IPR records
→ IPR Card records
→ review decisions
→ access logs
→ audit logs

Private Object Storage
→ document files
→ selfie
→ video
→ private evidence packages

Public Registry
→ minimized public proof references only

JOKER-C2 Runtime
→ governed AI interface
→ access allowed only by IPR state and policy

Admin Console
→ review
→ approve
→ reject
→ request additional evidence
→ suspend
→ revoke
→ renew


---

17. Minimal data model

User

user_id
email
phone
auth_provider
country
language
created_at
updated_at
status

Subject

subject_id
user_id
subject_type
private_profile_reference
public_subject_label
country
status

IPR

ipr_id
subject_id
ipr_profile
ipr_status
verification_level
created_at
updated_at
activation_evt
opc_receipt
public_hash_reference

IPR Card

ipr_card_id
ipr_id
card_status
issued_at
expires_at
qr_verification_reference
public_hash_reference
activation_evt
opc_receipt

Evidence Package

evidence_package_id
subject_id
ipr_id
document_reference
selfie_reference
video_reference
liveness_reference
review_reference
storage_location
retention_policy
status

Review

review_id
ipr_id
reviewer_id
risk_level
decision
reason
created_at
updated_at

Access Decision

access_decision_id
ipr_id
ipr_card_id
runtime_id
policy_state
risk_state
decision
evt_id
opc_receipt
timestamp


---

18. Security requirements

Required controls:

TLS only
encryption at rest
private object storage
strict access control
role-based admin review
audit logs
rate limiting
session protection
MFA / passkey support
tamper-evident event logs
document retention policy
private evidence deletion workflow
breach reporting workflow

Forbidden:

public document upload on GitHub Pages
public storage of tax codes
public storage of national identifiers
public storage of document numbers
public storage of identity scans
public storage of selfies or liveness videos
public storage of private evidence


---

19. Review workflow

Review outcomes:

APPROVE
→ IPR_ACTIVE
→ IPR Card issued
→ EVT activation
→ OPC receipt
→ public proof hash

REQUEST_MORE_INFO
→ IPR_REVIEW_REQUIRED

REJECT
→ IPR_REVOKED or IPR_REJECTED

SUSPEND
→ IPR_SUSPENDED

EXPIRE
→ IPR_EXPIRED

Review must record:

decision
reason
risk level
reviewer reference
timestamp
EVT
OPC


---

20. Public registry publication

Only after approval:

IPR_ACTIVE
→ public proof reference may be generated

Registry entry may include:

ipr_id
ipr_card_id
subject_label
subject_type
verification_level
ipr_status
card_status
payload_sha256
activation_evt
opc_receipt
issued_at
expires_at
status
boundary

Registry entry must never include:

name
email
phone
tax_code
national_identifier
document_number
identity_document
identity_document_scan
selfie
liveness_video
private_evidence
manual_review_notes
personal_data


---

21. MVP phases

Phase 1 — Public architecture complete

Status: completed.

public platform
documentation
IPR model
IPR Card model
JOKER-C2 access model
registry model
verify model
legal / privacy / claims boundary
link audit pass

Phase 2 — Private onboarding prototype

Goal:

user account
subject profile
IPR_DRAFT
IPR_PENDING
manual review
IPR_ACTIVE
IPR Card demo
EVT / OPC demo
JOKER-C2 gated access demo

Phase 3 — Bank-grade verification integration

Goal:

document verification provider
selfie / video / liveness
review console
risk scoring
private evidence storage
retention policy

Phase 4 — Pilot production boundary

Goal:

legal review
privacy review
security review
DPIA where required
contractual scope
controlled beta
external pilot


---

22. Production readiness checklist

Before real users and real documents:

legal basis defined
privacy policy updated
terms updated
data processing roles defined
DPIA evaluated where required
document verification provider selected
liveness provider selected
data retention defined
deletion workflow defined
admin review console built
encryption verified
access control verified
JOKER-C2 gate integrated
EVT / OPC chain tested
public registry minimization tested
incident response policy ready
security review completed


---

23. Naming

Use these product names:

HBCE Platform
IPR Onboarding Gateway
IPR Verified
IPR Card
JOKER-C2
IPR AI Audit Trail
EVT
OPC
Registry v3
Verify
Verify Pack

Avoid:

official European identity
bank account
financial card
KYC provider
AML provider
eIDAS qualified certificate
public authority registry
certified operator
government identity


---

24. Final protocol statement

HBCE IPR Onboarding App must operate as follows:

Bank-grade remote onboarding discipline
→ adapted to operational identity
→ private evidence protected
→ public proof minimized
→ IPR state machine enforced
→ IPR Card issued only after approval
→ JOKER-C2 access allowed only through valid operational identity and policy gate

The final rule is:

First verify who you are.
Then receive your IPR Card.
Only then access governed AI.


---

25. Maintainer

Manuel Coletta
HBCE Research
HERMETICUM B.C.E. S.r.l.
Torino, Italy, European Union

