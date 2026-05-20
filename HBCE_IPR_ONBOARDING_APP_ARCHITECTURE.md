# HBCE IPR ONBOARDING APP — SOFTWARE ARCHITECTURE

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

Document status: `R&D_ARCHITECTURE_REFERENCE`  
Scope: IPR Onboarding App  
Version: `v1.0`  
Date: `2026-05-20`  
Language: English  
Maintainer: HBCE Research  
Boundary: This document defines the software architecture for an IPR Onboarding App using bank-grade remote onboarding discipline adapted to operational identity. It does not create banking authorization, regulated KYC/AML provider status, official European identity issuance, eIDAS qualification, public authority validation or production authorization by itself.

---

## 1. Executive architecture

HBCE IPR Onboarding App is the private software application that transforms a subject from an unauthenticated visitor into a verified operational identity inside the HBCE environment.

The architecture is:

```text
Frontend App
→ user onboarding interface

Backend API
→ registration, workflow, state machine and access control

Private Database
→ users, subjects, IPR records, IPR Card records, review records and audit logs

Private Evidence Storage
→ documents, selfie, video, liveness material and private evidence package

Admin Console
→ review, approve, reject, suspend, revoke and renew

IPR Engine
→ IPR-ID, IPR state, verification level and IPR Card issuance

EVT Engine
→ activation and operational event continuity

OPC Engine
→ operational proof receipts

Registry Bridge
→ minimized public hash references only

JOKER-C2 Access Gate
→ governed runtime access only where IPR state and policy allow

The architecture is not:

email
→ payment
→ generic AI access

The architecture is:

verified operational identity
→ IPR Card
→ governed AI runtime


---

2. Product boundary

The public HBCE Platform and the private IPR Onboarding App are different layers.

HBCE Public Platform
→ documentation
→ public proof references
→ registry
→ verify
→ legal / privacy / claims boundaries
→ pilot communication

IPR Onboarding App
→ real private registration
→ document capture
→ liveness
→ private evidence
→ review
→ IPR state machine
→ IPR Card issuance
→ JOKER-C2 access control

GitHub Pages must not collect real identity documents or private evidence.

The real onboarding app must run in a private backend-controlled environment with secure storage, access control, audit logs and legal/privacy/security review.


---

3. System components

3.1 Frontend App

The frontend is the user-facing application.

Recommended stack:

Next.js / React
mobile-first interface
responsive web app
passkey-ready authentication UX
multi-step onboarding wizard
document capture interface
selfie / video / liveness interface
IPR Card dashboard
JOKER-C2 access state page

Frontend responsibilities:

collect account data
collect subject profile
collect document category
trigger document upload
trigger selfie / video / liveness step
show IPR state
show review status
show IPR Card after approval
show access state for JOKER-C2
never expose private evidence publicly

The frontend must not directly publish identity data to public registry.


---

3.2 Backend API

The backend is the controlled operational layer.

Recommended stack:

Node.js / Next.js API routes
or
FastAPI / Python backend
or
NestJS / TypeScript backend

Backend responsibilities:

user registration
authentication
session management
IPR state machine
subject profile management
document upload authorization
private evidence package creation
review workflow
IPR generation
IPR Card generation
EVT generation
OPC receipt generation
registry bridge
JOKER-C2 access decision
audit logging

The backend must enforce all state transitions.

The frontend must never decide alone that an IPR is active.


---

3.3 Private Database

The database stores operational records, not public proof files.

Recommended options:

PostgreSQL
Supabase
Neon
Cloud SQL
self-hosted PostgreSQL

Core tables:

users
subjects
ipr_records
ipr_cards
evidence_packages
review_cases
evt_events
opc_receipts
access_decisions
audit_logs
admin_users

The database must be private.

No tax code, document number, document image or biometric data may be copied to public registry.


---

3.4 Private Evidence Storage

Private evidence storage contains identity documents and sensitive verification material.

Recommended options:

S3-compatible private bucket
Supabase Storage private bucket
Google Cloud Storage private bucket
Azure Blob private container
encrypted object storage

Stored objects may include:

identity document front
identity document back
passport image
driving license image
residence permit where applicable
selfie
short video
liveness artifact
private evidence package
manual review attachment

Required controls:

private bucket
no public URLs by default
short-lived signed URLs only
encryption at rest
access logs
retention rules
deletion workflow
role-based access control


---

3.5 Admin Console

The admin console is the reviewer interface.

It must allow:

view pending IPR requests
view subject profile
view document category
view document verification status
view liveness result
view risk state
request additional evidence
approve
reject
suspend
revoke
renew
generate activation EVT
generate OPC receipt
issue IPR Card

The admin console must not be public.

It must require:

admin authentication
multi-factor authentication
role-based permissions
audit logs
least privilege
manual override logging


---

3.6 IPR Engine

The IPR Engine creates and manages the Identity Primary Record.

Responsibilities:

generate IPR-ID
assign IPR profile
assign IPR state
assign verification level
link subject
link review case
link activation event
link OPC receipt
link IPR Card
emit public proof reference

IPR states:

IPR_DRAFT
IPR_PENDING
IPR_REVIEW_REQUIRED
IPR_ACTIVE
IPR_SUSPENDED
IPR_REVOKED
IPR_EXPIRED

IPR profiles:

IPR_BASE
IPR_VERIFIED
IPR_PROFESSIONAL
IPR_OPERATOR
IPR_ENTITY
IPR_AI
IPR_PROCESS
IPR_DOCUMENT_WORKFLOW


---

3.7 IPR Card Engine

The IPR Card Engine creates the operational access object.

The IPR Card may be represented as:

dashboard card
PDF certificate
JSON credential
QR verification reference
public hash reference

Minimum card fields:

ipr_card_id
ipr_id
subject_label
subject_type
verification_level
card_status
issuer
activation_evt
opc_receipt
public_hash_reference
qr_verification_reference
issued_at
expires_at

Card states:

PENDING
ACTIVE
REVIEW_REQUIRED
SUSPENDED
REVOKED
EXPIRED

The card must always include the legal boundary:

IPR Card is a digital operational card issued within the HERMETICUM B.C.E. environment.
It does not replace an identity card, passport, CIE, SPID, EUDI Wallet or qualified eIDAS certificate.


---

3.8 EVT Engine

The EVT Engine records operational event continuity.

Event examples:

USER_REGISTERED
SUBJECT_PROFILE_CREATED
DOCUMENT_SUBMITTED
LIVENESS_SUBMITTED
IPR_DRAFT_CREATED
IPR_PENDING_SUBMITTED
IPR_REVIEW_REQUIRED
IPR_ACTIVE_CONFIRMED
IPR_CARD_ISSUED
JOKER_C2_ACCESS_REQUESTED
JOKER_C2_ACCESS_ALLOWED
JOKER_C2_ACCESS_DENIED
AI_OPERATION_RECORDED
HUMAN_VALIDATION_APPROVED
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

EVT is the event chain.

It does not certify legal truth by itself.


---

3.9 OPC Engine

The OPC Engine produces operational proof receipts.

OPC links:

IPR
→ IPR Card
→ EVT
→ operation
→ decision
→ policy
→ risk
→ payload hash
→ output hash
→ event hash
→ receipt hash
→ chain hash
→ registry reference
→ verification state

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

OPC is the operational proof receipt.

It is not legal certification by itself.


---

3.10 Registry Bridge

The Registry Bridge publishes only minimized proof references.

It must never publish:

tax code
national identifier
document number
identity document
identity document scan
selfie
liveness video
biometric payload
private evidence
manual review notes
personal data
client files
private prompts
private outputs
credentials
private keys

Allowed public fields:

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
timestamp
status
boundary

Registry publication happens only after review and approval.


---

3.11 JOKER-C2 Access Gate

The JOKER-C2 Access Gate controls runtime access.

Input:

user_id
session_id
ipr_id
ipr_card_id
ipr_status
card_status
verification_level
risk_state
policy_state
revocation_state
scope

Output:

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

IPR_ACTIVE + policy pass + acceptable risk + scope approval
→ ACCESS_ALLOWED

IPR_SUSPENDED
→ ACCESS_DENIED

IPR_REVOKED
→ ACCESS_DENIED

IPR_EXPIRED
→ RENEWAL_REQUIRED


---

4. Application flow

4.1 Registration

user visits app
→ enters email
→ verifies email
→ enters phone
→ verifies phone
→ creates password or passkey
→ accepts privacy policy
→ accepts terms
→ account created
→ user_id created

Initial user state:

USER_REGISTERED


---

4.2 Subject creation

select subject type
→ natural person / legal entity / operator / company / institution / professional / researcher
→ create subject profile
→ assign public subject_label
→ create private subject record

State:

SUBJECT_PROFILE_CREATED


---

4.3 IPR draft

subject profile exists
→ IPR Engine creates IPR_DRAFT
→ IPR-ID assigned
→ user sees onboarding checklist

State:

IPR_DRAFT


---

4.4 Evidence submission

select document type
→ upload document
→ submit national tax identifier / national identification number where applicable
→ capture selfie
→ capture video / liveness where applicable
→ private evidence package created

State:

IPR_PENDING


---

4.5 Review

automatic checks
→ document validity
→ liveness result
→ data consistency
→ risk score
→ manual review where required

Possible outcomes:

APPROVE
REQUEST_MORE_INFO
REJECT
SUSPEND


---

4.6 Activation

If approved:

IPR_PENDING
→ IPR_ACTIVE
→ activation EVT
→ OPC receipt
→ IPR Card issued
→ public proof reference generated

Activation must record:

review decision
reviewer label
risk level
policy state
EVT
OPC
timestamp


---

4.7 JOKER-C2 access

user opens JOKER-C2
→ Access Gate checks IPR
→ checks IPR Card
→ checks policy
→ checks risk
→ checks revocation
→ creates access decision

If allowed:

JOKER-C2 runtime session created

If not allowed:

ACCESS_DENIED
REVIEW_REQUIRED
RENEWAL_REQUIRED


---

5. Database schema

5.1 users

id
email
email_verified
phone
phone_verified
password_hash / passkey_reference
country
language
status
created_at
updated_at

5.2 subjects

id
user_id
subject_type
public_subject_label
private_profile_reference
country
status
created_at
updated_at

5.3 ipr_records

id
ipr_id
subject_id
ipr_profile
ipr_status
verification_level
activation_evt
opc_receipt
public_hash_reference
created_at
updated_at

5.4 ipr_cards

id
ipr_card_id
ipr_id
card_status
verification_level
issuer_label
activation_evt
opc_receipt
public_hash_reference
qr_verification_reference
issued_at
expires_at
created_at
updated_at

5.5 evidence_packages

id
subject_id
ipr_id
document_reference
national_identifier_reference
selfie_reference
video_reference
liveness_reference
review_reference
storage_location
retention_policy
status
created_at
updated_at

5.6 review_cases

id
ipr_id
reviewer_id
risk_level
decision
decision_reason
review_state
created_at
updated_at

5.7 evt_events

id
evt_id
prev_evt
event_type
entity_type
ipr_id
ipr_card_id
payload_sha256
chain_hash
timestamp
created_at

5.8 opc_receipts

id
receipt_id
ipr_id
ipr_card_id
evt_id
operation_type
decision_state
risk_level
policy_state
payload_sha256
event_hash
receipt_sha256
chain_hash
issued_at
created_at

5.9 access_decisions

id
user_id
ipr_id
ipr_card_id
runtime_id
policy_state
risk_state
decision
evt_id
opc_receipt
timestamp
created_at

5.10 audit_logs

id
actor_id
actor_role
action
target_type
target_id
event_reference
ip_address_hash
user_agent_hash
created_at


---

6. API architecture

6.1 Auth API

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/verify-email
POST /api/auth/verify-phone
POST /api/auth/passkey/register
POST /api/auth/passkey/login

6.2 Subject API

POST /api/subjects
GET /api/subjects/me
PATCH /api/subjects/:id

6.3 IPR API

POST /api/ipr/create-draft
GET /api/ipr/:iprId
POST /api/ipr/:iprId/submit
POST /api/ipr/:iprId/renew

6.4 Evidence API

POST /api/evidence/document-upload-url
POST /api/evidence/selfie-upload-url
POST /api/evidence/video-upload-url
POST /api/evidence/submit
GET /api/evidence/:packageId/status

6.5 Review API

GET /api/admin/review/pending
GET /api/admin/review/:caseId
POST /api/admin/review/:caseId/approve
POST /api/admin/review/:caseId/reject
POST /api/admin/review/:caseId/request-more-info
POST /api/admin/review/:caseId/suspend
POST /api/admin/review/:caseId/revoke

6.6 IPR Card API

POST /api/ipr-card/issue
GET /api/ipr-card/:cardId
GET /api/ipr-card/:cardId/pdf
GET /api/ipr-card/:cardId/json
GET /api/ipr-card/:cardId/qr

6.7 EVT / OPC API

POST /api/evt/create
GET /api/evt/:evtId

POST /api/opc/create
GET /api/opc/:receiptId

6.8 Registry Bridge API

POST /api/registry/prepare-public-reference
POST /api/registry/publish-request
GET /api/registry/public/:hash

6.9 JOKER-C2 Access API

POST /api/joker-c2/access-check
POST /api/joker-c2/start-session
GET /api/joker-c2/session/:sessionId


---

7. Frontend screens

7.1 Public entry

Welcome
→ explain IPR
→ explain bank-grade onboarding
→ explain IPR Card
→ explain JOKER-C2 access
→ start onboarding

7.2 Account registration

email
phone
password / passkey
privacy agreement
terms agreement

7.3 Subject type

natural person
legal entity
operator
company
institution
professional
researcher

7.4 Identity data

first name
last name
country
nationality where applicable
national tax identifier / national identification number

7.5 Document capture

document type
front image
back image
passport image
expiry date
issuing country

7.6 Selfie / liveness

selfie capture
short video
liveness check
face-document comparison

7.7 Review status

IPR_PENDING
review in progress
more information required
approved
rejected

7.8 IPR Card dashboard

IPR-ID
IPR Card ID
status
verification level
issuer
issued at
expires at
QR
download PDF
download JSON
open JOKER-C2

7.9 JOKER-C2 access state

ACCESS_ALLOWED
ACCESS_DENIED
REVIEW_REQUIRED
RENEWAL_REQUIRED


---

8. Security architecture

Required controls:

HTTPS / TLS only
secure authentication
password hashing
passkey support
MFA for admin console
encrypted database
encrypted object storage
private bucket
signed URL expiration
role-based access control
audit logging
rate limiting
input validation
CSRF protection where applicable
session rotation
admin action logging
data retention policy
evidence deletion workflow
incident response workflow

Forbidden:

public document uploads
public document URLs
public tax-code storage
public national-identifier storage
public document-number storage
public selfie / liveness storage
public private-evidence storage
public client-file storage
public private-prompt storage
public private-output storage


---

9. Privacy architecture

Privacy design:

data minimization
purpose limitation
private evidence separation
public proof minimization
retention rules
deletion workflow
access control
review logging
no public identity custody

Public proof never contains:

identity document
document number
tax code
national identifier
address
date of birth
selfie
liveness video
biometric payload
private evidence
manual review notes


---

10. Runtime access architecture

JOKER-C2 must never receive direct access from an unverified account in governed mode.

Access sequence:

frontend asks access
→ backend checks session
→ backend checks IPR
→ backend checks IPR Card
→ backend checks policy
→ backend checks risk
→ backend checks revocation
→ backend creates EVT
→ backend creates OPC
→ runtime session starts only if allowed

Access failure states:

NO_IPR
IPR_DRAFT
IPR_PENDING
IPR_REVIEW_REQUIRED
IPR_SUSPENDED
IPR_REVOKED
IPR_EXPIRED
POLICY_FAIL
RISK_FAIL
SCOPE_DENIED


---

11. Admin architecture

Admin roles:

SUPER_ADMIN
IPR_REVIEWER
DOCUMENT_REVIEWER
LIVENESS_REVIEWER
SECURITY_REVIEWER
COMPLIANCE_REVIEWER
SUPPORT_OPERATOR
READ_ONLY_AUDITOR

Admin functions:

view pending review
view private evidence through controlled access
approve
reject
request more info
suspend
revoke
renew
issue IPR Card
generate EVT
generate OPC
prepare registry proof
view audit logs

Admin console must log every action.


---

12. Public registry bridge

Registry Bridge must produce only minimized public entries.

Example public entry:

{
  "proto": "HBCE-REGISTRY-v3",
  "kind": "IPR_CARD_PUBLIC_REFERENCE",
  "version": "v3",
  "entity_type": "IPR_CARD",
  "ipr_id": "IPR-BASE-HBCE-001",
  "ipr_card_id": "IPR-CARD-HBCE-RND-001",
  "subject_label": "HBCE_IPR_CARD_PUBLIC_001",
  "subject_type": "NATURAL_PERSON_REFERENCE",
  "proof_scope": "IPR_CARD_OPERATIONAL_REFERENCE",
  "verification_level": "L2",
  "payload_sha256": "5656565656565656565656565656565656565656565656565656565656565656",
  "timestamp": "2026-05-20T00:00:00+02:00",
  "status": "RND_ONLY",
  "ipr_status": "IPR_ACTIVE",
  "card_status": "ACTIVE",
  "activation_evt": "EVT-20260520-IPR-CARD-RND-001",
  "opc_receipt": "OPC-20260520-IPR-CARD-RND-001",
  "public_payload_policy": "HASH_ORIENTED_REFERENCE_ONLY"
}


---

13. MVP implementation phases

Phase 1 — Private mock onboarding

account
subject profile
IPR_DRAFT
IPR_PENDING
manual approval
IPR_ACTIVE
IPR Card demo
JOKER-C2 access simulation

Phase 2 — Private evidence storage

document upload
private storage
manual review
secure admin console
event logs

Phase 3 — Liveness and verification provider

document verification integration
selfie / video
liveness
risk check
review escalation

Phase 4 — Real gated JOKER-C2

JOKER-C2 access API
runtime session gate
EVT / OPC generation
audit dashboard

Phase 5 — External pilot

legal scope
privacy scope
security scope
DPIA where needed
controlled beta
non-sensitive pilot first


---

14. Production readiness gates

Production must not begin until:

legal basis defined
privacy policy updated
terms updated
DPIA assessed where required
processor roles defined
data retention defined
deletion flow implemented
document verification vendor assessed
liveness vendor assessed
database encryption confirmed
object storage access control confirmed
admin MFA enforced
audit logs tested
JOKER-C2 gate tested
EVT / OPC chain tested
registry minimization tested
incident response ready
security review completed


---

15. Non-claims

This architecture does not claim:

banking authorization
payment service authorization
electronic money authorization
regulated KYC / AML provider status
official identity provider status
official European identity issuance
eIDAS qualification
qualified trust-service status
public authority approval
legal certification
cybersecurity certification
production readiness by itself
automatic JOKER-C2 access


---

16. Final architecture rule

The software architecture must enforce:

no private evidence in public layer
no IPR_ACTIVE without review
no IPR Card without activation
no JOKER-C2 governed access without valid IPR state
no public proof without minimization
no production use without legal / privacy / security review

Final rule:

First verify who you are.
Then receive your IPR Card.
Only then access governed AI.


---

17. Maintainer

Manuel Coletta
HBCE Research
HERMETICUM B.C.E. S.r.l.
Torino, Italy, European Union

