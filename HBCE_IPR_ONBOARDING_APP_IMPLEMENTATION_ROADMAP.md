# HBCE IPR ONBOARDING APP — IMPLEMENTATION ROADMAP

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

Document status: `R&D_IMPLEMENTATION_ROADMAP`  
Scope: IPR Onboarding App  
Version: `v1.0`  
Date: `2026-05-20`  
Language: English  
Maintainer: HBCE Research  
Boundary: This roadmap translates the HBCE IPR Onboarding App protocol and software architecture into executable implementation phases. It does not create banking authorization, regulated KYC/AML provider status, official European identity issuance, eIDAS qualification, public authority validation or production authorization by itself.

---

## 1. Executive objective

The objective is to transform HBCE Platform from a public static R&D gateway into a real private onboarding application for IPR issuance.

The final product must support:

```text
user registration
→ subject profile
→ private verification boundary
→ document evidence
→ selfie / video / liveness
→ IPR_DRAFT
→ IPR_PENDING
→ manual or assisted review
→ IPR_ACTIVE
→ IPR Card
→ activation EVT
→ OPC receipt
→ minimized public registry reference
→ JOKER-C2 access gate

The product rule is:

First verify who you are.
Then receive your IPR Card.
Only then access governed AI.


---

2. Implementation principle

The implementation must follow this separation:

Public HBCE Platform
→ documentation
→ public proof
→ registry
→ verify
→ claims / legal / privacy / terms

Private IPR Onboarding App
→ user account
→ identity evidence
→ document upload
→ selfie / video / liveness
→ review
→ IPR state machine
→ IPR Card issuance
→ JOKER-C2 access gate

The public GitHub Pages layer must never collect or store real identity documents, tax identifiers, document numbers, selfies, liveness videos, private evidence or client files.


---

3. Phase 0 — Current state

Status: COMPLETED

The public platform has already been aligned around:

HBCE Platform
→ IPR Onboarding Gateway

IPR
→ first operational product

IPR Card
→ operational access key

JOKER-C2
→ governed AI runtime demonstrator

IPR AI Audit Trail
→ first MVP

Registry / Verify / Verify Pack
→ public proof layer

Legal / Privacy / Claims
→ boundary layer

Current completed assets:

public platform routes
registry v3 model
IPR schema
IPR Card model
EVT schema
OPC receipt schema
JOKER-C2 access model
legal / privacy / claims boundary
public route audit PASS
bank-grade onboarding protocol
software architecture document

Phase 0 result:

PUBLIC_PLATFORM_READY


---

4. Phase 1 — Private mock onboarding app

Goal: create a controlled private MVP that simulates the onboarding flow without processing real identity documents.

Status target: PRIVATE_MOCK_MVP

4.1 Deliverables

private app shell
registration screen
subject profile screen
IPR_DRAFT creation
IPR_PENDING simulation
manual approval simulation
IPR_ACTIVE simulation
IPR Card demo
JOKER-C2 access simulation

4.2 Technical tasks

create private app repository or protected app folder
build Next.js / React onboarding UI
create mock authentication
create local or private test database
create mock IPR state machine
create mock IPR Card renderer
create mock EVT generator
create mock OPC receipt generator
create mock JOKER-C2 access gate

4.3 Required screens

/start
/register
/verify-email
/subject-type
/subject-profile
/ipr/create
/ipr/status
/ipr-card
/joker-c2/access

4.4 Forbidden in Phase 1

no real identity documents
no real tax codes
no real national identifiers
no real selfies
no real liveness video
no customer files
no production data

4.5 Phase 1 completion condition

A test user can move from registration to IPR_ACTIVE simulation and see a demo IPR Card.


---

5. Phase 2 — Backend and database

Goal: replace mock state with a real private backend and database.

Status target: PRIVATE_BACKEND_MVP

5.1 Core services

Auth Service
Subject Service
IPR Service
IPR Card Service
EVT Service
OPC Service
Access Decision Service
Audit Log Service

5.2 Database tables

users
subjects
ipr_records
ipr_cards
review_cases
evt_events
opc_receipts
access_decisions
audit_logs
admin_users

5.3 Minimum backend APIs

POST /api/auth/register
POST /api/auth/login
POST /api/subjects
GET /api/subjects/me
POST /api/ipr/create-draft
POST /api/ipr/:iprId/submit
GET /api/ipr/:iprId
POST /api/ipr-card/issue
GET /api/ipr-card/:cardId
POST /api/evt/create
POST /api/opc/create
POST /api/joker-c2/access-check

5.4 Phase 2 completion condition

The app persists user, subject, IPR, IPR Card, EVT, OPC and access-decision data in a private database.


---

6. Phase 3 — Private evidence storage

Goal: introduce private evidence storage for controlled uploads.

Status target: PRIVATE_EVIDENCE_LAYER

6.1 Evidence objects

document_front
document_back
passport_page
driving_license_front
driving_license_back
residence_permit
selfie
short_video
liveness_artifact
manual_review_attachment

6.2 Storage requirements

private bucket
no public URLs
short-lived signed URLs
encryption at rest
access logs
retention policy
deletion workflow
role-based access control

6.3 Evidence table

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
created_at
updated_at

6.4 Phase 3 completion condition

A user can upload controlled test evidence into private storage, and an admin can review it through a protected console.


---

7. Phase 4 — Admin review console

Goal: build the operational review layer.

Status target: ADMIN_REVIEW_MVP

7.1 Admin roles

SUPER_ADMIN
IPR_REVIEWER
DOCUMENT_REVIEWER
LIVENESS_REVIEWER
SECURITY_REVIEWER
COMPLIANCE_REVIEWER
SUPPORT_OPERATOR
READ_ONLY_AUDITOR

7.2 Admin actions

view pending IPR
open evidence package
approve
reject
request more info
suspend
revoke
renew
issue IPR Card
generate EVT
generate OPC
prepare public proof reference

7.3 Mandatory admin controls

MFA
role-based permissions
audit logs
least privilege
session timeout
manual override logging

7.4 Phase 4 completion condition

An admin can move an IPR from IPR_PENDING to IPR_ACTIVE through a logged review action.


---

8. Phase 5 — IPR Card issuance

Goal: generate a real operational IPR Card after approval.

Status target: IPR_CARD_MVP

8.1 IPR Card formats

dashboard card
PDF certificate
JSON credential
QR verification reference
public hash reference

8.2 IPR Card fields

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

8.3 Required card boundary statement

IPR Card is a digital operational card issued within the HERMETICUM B.C.E. environment.
It does not replace an identity card, passport, CIE, SPID, EUDI Wallet or qualified eIDAS certificate.

8.4 Phase 5 completion condition

An approved IPR_ACTIVE user receives an IPR Card with PDF, JSON and QR reference.


---

9. Phase 6 — EVT and OPC integration

Goal: make every critical state transition traceable and receipted.

Status target: EVT_OPC_CHAIN_MVP

9.1 EVT events

USER_REGISTERED
SUBJECT_PROFILE_CREATED
IPR_DRAFT_CREATED
IPR_PENDING_SUBMITTED
IPR_REVIEW_REQUIRED
IPR_ACTIVE_CONFIRMED
IPR_CARD_ISSUED
JOKER_C2_ACCESS_REQUESTED
JOKER_C2_ACCESS_ALLOWED
JOKER_C2_ACCESS_DENIED
OPC_RECEIPT_CREATED

9.2 OPC receipts

Each OPC receipt must connect:

IPR
→ IPR Card
→ EVT
→ operation
→ decision
→ policy
→ risk
→ payload hash
→ event hash
→ receipt hash
→ chain hash

9.3 Phase 6 completion condition

Every approval, card issuance and JOKER-C2 access decision generates EVT and OPC references.


---

10. Phase 7 — Public registry bridge

Goal: publish only minimized public proof references.

Status target: PUBLIC_PROOF_BRIDGE

10.1 Allowed public fields

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

10.2 Forbidden public fields

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
biometric_payload
private_evidence
manual_review_notes
personal_data
client_file
private_prompt
private_output
credential
private_key
secret
internal_endpoint

10.3 Registry Bridge API

POST /api/registry/prepare-public-reference
POST /api/registry/publish-request
GET /api/registry/public/:hash

10.4 Phase 7 completion condition

The backend can generate a public proof entry without exposing private evidence.


---

11. Phase 8 — JOKER-C2 access gate

Goal: enforce runtime access through verified operational identity.

Status target: JOKER_C2_GATED_ACCESS

11.1 Access gate inputs

user_id
session_id
ipr_id
ipr_card_id
ipr_status
card_status
verification_level
policy_state
risk_state
revocation_state
scope

11.2 Access decisions

ACCESS_ALLOWED
ACCESS_DENIED
REVIEW_REQUIRED
HUMAN_REVIEW_REQUIRED
RENEWAL_REQUIRED
SUSPENDED
REVOKED

11.3 Runtime gate rule

NO_IPR
→ ACCESS_DENIED

IPR_DRAFT
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

11.4 Phase 8 completion condition

A user cannot open governed JOKER-C2 unless the access gate returns ACCESS_ALLOWED.


---

12. Phase 9 — Bank-grade verification provider integration

Goal: integrate document verification and liveness checks.

Status target: BANK_GRADE_VERIFICATION_INTEGRATION

12.1 Required integration categories

document verification
document quality check
document expiry check
document authenticity signals
selfie capture
video capture
liveness detection
face-document comparison
manual review escalation
risk score

12.2 Provider assessment criteria

EU data processing compatibility
GDPR readiness
data retention controls
DPA availability
security documentation
API reliability
webhook support
manual review support
liveness quality
document country coverage
auditability

12.3 Phase 9 completion condition

The app can process a document + selfie/liveness test through a selected verification provider in a controlled test environment.


---

13. Phase 10 — External pilot

Goal: run a controlled external pilot.

Status target: CONTROLLED_EXTERNAL_PILOT

13.1 Pilot scope

1 organization
1 document workflow
1 to 3 authorized users
10 to 20 synthetic, public or authorized documents
IPR Card scope where required
JOKER-C2 access boundary where approved
30 days

13.2 Before pilot

Required:

written scope
legal review
privacy review
security review
data boundary
retention policy
incident response process
no sensitive data unless explicitly approved

13.3 Phase 10 completion condition

An external pilot produces IPR-linked, EVT/OPC-backed, audit-ready reports without exposing private evidence publicly.


---

14. Technical stack recommendation

14.1 MVP stack

Next.js
TypeScript
PostgreSQL
Supabase or equivalent private storage
Passkey / email auth
Admin console
Server-side API routes
Private object storage
JOKER-C2 API integration

14.2 Later production stack

dedicated backend
dedicated database
object storage with encryption
document verification provider
liveness provider
admin RBAC
central audit logging
monitoring
incident response
legal / privacy production controls


---

15. Repository strategy

The current GitHub Pages repository should remain:

public documentation
public proof layer
public registry
public verify
public claims
public pilot communication

The real app should be separated as:

private app repository
or
protected app deployment

Recommended repo name:

hbce-ipr-onboarding-app

Alternative:

hbce-ipr-gateway-app


---

16. Definition of done

The IPR Onboarding App is minimally functional when:

a user can register
a subject profile can be created
an IPR_DRAFT can be generated
evidence can be submitted privately
a review case can be opened
an admin can approve
IPR_ACTIVE can be created
an IPR Card can be issued
EVT and OPC are generated
a public proof reference can be prepared
JOKER-C2 access can be denied or allowed based on IPR state


---

17. Final implementation rule

The application must enforce:

no private evidence in public layer
no IPR_ACTIVE without review
no IPR Card without activation
no JOKER-C2 governed access without valid IPR state
no public proof without minimization
no production use without legal / privacy / security review

Final operating formula:

First verify who you are.
Then receive your IPR Card.
Only then access governed AI.


---

18. Maintainer

Manuel Coletta
HBCE Research
HERMETICUM B.C.E. S.r.l.
Torino, Italy, European Union

