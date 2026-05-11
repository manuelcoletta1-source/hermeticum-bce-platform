# IPR — Identity Primary Record
## European R&D Technical Reference v1.1

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

---

## 0. Status

Status: R&D technical reference  
Mode: Public proof reference model  
Policy: Hash-only · Fail-closed · No public data custody · Private verification separation  
Scope: IPR Base · IPR Verified · IPR Professional · IPR AI Audit Trail

This document defines a proposed European-oriented technical reference for IPR — Identity Primary Record — inside the HBCE Platform.

It is not an official European Union standard, not a legal standard, not an eIDAS qualified trust-service standard, not a regulated certification scheme, not a public authority registry, not a civil identity registry and not a regulated KYC / AML provider standard.

It is an R&D technical reference for operational identity, attribution, proof continuity and public proof minimization.

---

## 1. Purpose

The purpose of IPR is to provide an operational identity and proof reference for verifiable digital workflows.

An IPR is designed to connect:

```text
subject
→ role
→ operation
→ event
→ proof
→ responsibility
→ continuity
→ verification
```

IPR does not create legal identity by itself.

IPR does not replace SPID, CIE, EUDI Wallet, eIDAS schemes, public registries, digital signatures or qualified trust services.

IPR creates an operational reference that can be used inside HBCE to connect identity-linked activity, proof material and audit-ready continuity.

---

## 2. Product hierarchy

The IPR technical reference follows the current HBCE product hierarchy:

```text
IPR = base operational product
IPR Base = technical R&D record, not verified identity
IPR Verified = private verification with tax code + valid identity document
IPR Professional = business / audit profile based on IPR Verified
IPR AI Audit Trail = first MVP use case
HBCE = operational ecosystem
JOKER-C2 = runtime demonstrator
MATRIX = architectural framework
```

This distinction is mandatory.

The first operational product is IPR.

The first MVP is IPR AI Audit Trail.

MATRIX is the wider architectural framework, not the first product to sell or validate.

---

## 3. Core components

A minimal IPR implementation may include the following components:

1. private or controlled identity / operational payload;
2. deterministic hash of the payload;
3. receipt or proof object binding the payload hash;
4. public proof reference;
5. registry entry or controlled reference;
6. verification mechanism;
7. append-only trace capability;
8. fail-closed validation rule.

If a required component is missing, malformed, ambiguous or unverifiable, the system must not infer validity.

---

## 4. IPR profiles

### IPR Base

IPR Base is a technical R&D profile.

It may be used for:

- local testing;
- internal proof flows;
- hash-oriented attribution;
- controlled demonstrations;
- IPR AI Audit Trail MVP testing.

IPR Base does not create verified identity status.

Recommended public verification level:

```text
IPR_BASE_NOT_VERIFIED
```

### IPR Verified

IPR Verified is the private-verification profile.

It may use private identity verification based on:

```text
tax code
valid identity document
private evidence package
```

Accepted valid identity-document categories are:

```text
identity card / CIE
passport
driving license
```

This evidence belongs only in the private verification layer.

The public layer must expose only minimized proof references.

Recommended public verification level:

```text
IPR_VERIFIED_PRIVATE_CHECK
```

### IPR Professional

IPR Professional is a future business / audit workflow profile based on IPR Verified.

It is intended for:

- controlled B2B pilots;
- AI governance workflows;
- legal-operations documentation;
- cybersecurity documentation;
- audit-ready evidence chains.

It does not create regulated certification, public authority validation, eIDAS qualification, KYC / AML provider status or production SaaS readiness by itself.

Recommended public verification level:

```text
IPR_PROFESSIONAL_PILOT
```

---

## 5. Private verification model

The private verification layer may include:

- tax code / fiscal code;
- identity card / CIE;
- passport;
- driving license;
- private evidence package;
- controlled verification status.

This material must remain outside:

- public repository files;
- public registry files;
- public GitHub issues;
- public commits;
- public demo pages;
- public proof records;
- public audit artifacts.

Private verification may generate a hash-oriented proof reference.

The underlying evidence must not be published in the public layer.

Recommended flow:

```text
PRIVATE VERIFICATION
↓
TAX CODE + VALID IDENTITY DOCUMENT
↓
PRIVATE EVIDENCE PACKAGE
↓
IPR VERIFIED RECORD
↓
HASH-ORIENTED PUBLIC PROOF REFERENCE
↓
REGISTRY / VERIFY
```

---

## 6. Public proof model

The public proof layer may contain only minimized technical fields.

Allowed public fields may include:

```text
entity_type
subject_label
operator_label
record_scope
verification_level
payload_sha256
evt_id
opc_id
timestamp
status
public_payload_policy
public-safe note
```

The central public proof field is:

```text
payload_sha256
```

The public layer must not contain:

```text
tax_code
fiscal_code
codice_fiscale
document_number
identity_document_number
identity_card_number
cie_number
passport_number
driving_license_number
identity_document
identity_document_scan
portrait_image
biometric_payload
private_evidence
personal_data
personal_payload
customer_file
private_key
credential
secret
raw_prompt
raw_output
production_log
sensitive_operational_payload
```

A public proof reference means only that a public hash-oriented proof reference exists.

It does not certify legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority approval, cybersecurity assurance or production authorization.

---

## 7. Registry model

The registry model is based on Registry v3.

A registry entry should be:

- minimized;
- hash-oriented;
- append-only;
- fail-closed;
- public-proof-only;
- non-custodial.

Recommended registry fields:

```text
entity_type
subject_label
record_scope
verification_level
payload_sha256
timestamp
status
public_payload_policy
```

The registry must not act as:

- a public authority registry;
- a civil identity registry;
- a public identity-document database;
- a KYC / AML register;
- a qualified trust-service registry;
- a legal certification register;
- a production authorization register.

---

## 8. Verification model

Verification must be deterministic and fail-closed.

Recommended verification states are:

```text
PUBLIC_REFERENCE_PRESENT
→ a matching public proof reference exists

NO_PUBLIC_RECORD
→ no matching public proof reference was found

INVALID
→ input is missing, malformed, forbidden or rejected

NON_OPERATIONAL
→ registry, source or verifier state is unavailable, malformed or inconsistent
```

Older binary labels such as `AUTHORIZED` and `DENIED` should not be used as the primary public verification model because they may imply legal or institutional authorization.

The preferred interpretation is proof-reference status, not legal authorization.

---

## 9. Receipt model

A receipt or proof object may contain:

```text
payload_sha256
receipt_sha256
issued_at
issuer_label
subject_label
verification_level
public_payload_policy
status
```

A receipt should be:

- deterministic;
- recomputable;
- verifiable without exposing private evidence;
- compatible with fail-closed verification.

A receipt must not contain:

- tax code;
- document number;
- identity document;
- scan;
- portrait image;
- private evidence;
- credential;
- secret;
- private key.

If hash mismatch occurs, the verifier must fail closed.

---

## 10. Event and proof continuity

IPR may be connected to EVT and OPC.

EVT provides event continuity.

OPC provides operational proof.

An IPR-linked event may connect:

```text
IPR_REFERENCE
→ ACTION
→ EVT_EVENT
→ OPC_PROOF
→ REGISTRY_REFERENCE
→ VERIFY
```

This allows a workflow to move from isolated records to audit-ready operational continuity.

EVT and OPC do not create legal certification, eIDAS qualification, public authority approval or production authorization by themselves.

---

## 11. IPR AI Audit Trail profile

The first MVP profile is IPR AI Audit Trail.

It demonstrates the following workflow:

```text
IPR operational reference
→ document upload
→ document SHA-256
→ AI-assisted analysis
→ governance decision
→ human validation
→ EVT event
→ OPC proof
→ audit-ready report
```

This profile may be used for controlled R&D pilots involving synthetic, public, owned or expressly authorized documents.

It must not be used in public demo mode with:

- tax codes;
- identity documents;
- secrets;
- private keys;
- credentials;
- customer data;
- confidential third-party material;
- production logs;
- private prompts;
- private outputs;
- sensitive operational payloads.

---

## 12. Independence and interoperability principle

Any entity may study or implement this technical reference in an R&D context, provided that the implementation preserves:

- public/private evidence separation;
- fail-closed validation;
- no public data custody;
- no public identity-document custody;
- no false legal certification claim;
- no false public authority claim;
- no regulated KYC / AML claim;
- no eIDAS qualification claim.

Multiple compatible implementations may exist.

Compatibility does not imply official recognition, public authority approval, legal certification or regulated status.

---

## 13. Non-claims

This technical reference does not claim:

- legal identity status;
- legal certification;
- regulatory approval;
- public authority approval;
- public-sector adoption;
- eIDAS qualification;
- qualified trust-service status;
- regulated KYC / AML provider status;
- cybersecurity certification;
- financial or banking authorization;
- production-grade enterprise SaaS readiness;
- legally binding evidence status by itself.

Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.

---

## 14. Versioning

Version: v1.1 R&D technical reference.

Original v1.0 concept retained as historical basis.

Current alignment:

```text
IPR-first product hierarchy
IPR Base / IPR Verified / IPR Professional
IPR AI Audit Trail MVP
Registry v3
payload_sha256
verification_level
private verification separation
public proof minimization
fail-closed verification
no public data custody
```

Future revisions should be:

- additive where possible;
- public;
- versioned;
- audit-readable;
- consistent with public/private evidence separation;
- consistent with fail-closed behavior;
- consistent with no public identity custody.

No retroactive modification should silently rewrite prior evidence or prior public proof interpretation.
