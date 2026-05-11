# HERMETICUM B.C.E. — MANIFEST

**Hallmark:** HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA  
**Issuer:** HERMETICUM B.C.E. S.r.l.  
**Repository:** `hermeticum-bce-platform`  
**Public gateway:** `https://manuelcoletta1-source.github.io/hermeticum-bce-platform/`  
**Regime:** EU-first · audit-first · fail-closed · hash-only · append-only · no public data custody

---

## 1. Purpose

This repository documents and publishes an experimental public R&D gateway for verifiable operational identity, public proof references, audit-ready event records and fail-closed verification workflows.

The current platform is organized around an IPR-first model:

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

The technical question addressed by the platform is:

```text
Who or what operated, under which role, on which event, with which proof, with which responsibility and with which continuity?
```

The repository does not replace existing legal identity systems, public authorities, qualified trust services, regulated certification schemes or institutional validation.

---

## 2. Core principles

### IPR-first

IPR — Identity Primary Record — is the first operational product of the platform.

IPR connects:

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

### Private verification

IPR Verified may use tax-code and valid identity-document evidence only in a private, controlled verification layer.

Accepted private identity-document categories are:

```text
identity card / CIE
passport
driving license
```

This evidence must not be stored in the public repository, public registry, public demo pages, public issues or public proof records.

### Public proof minimization

The public layer may contain only minimized proof references such as:

```text
subject_label
operator_label
verification_level
payload_sha256
timestamp
status
evt_id
opc_id
audit_state
```

The public layer must not contain:

```text
tax_code
fiscal_code
codice_fiscale
document_number
identity_document_number
identity_document
identity_document_scan
passport_number
driving_license_number
portrait_image
biometric_payload
private_evidence
personal_data
customer_file
private_key
credential
secret
raw_prompt
raw_output
production_log
sensitive_operational_payload
```

### Fail-closed

Missing, malformed, ambiguous, inconsistent or unverifiable states must not produce validity.

Verification states should remain explicit:

```text
PUBLIC_REFERENCE_PRESENT
→ a matching public proof reference exists

NO_PUBLIC_RECORD
→ no matching public proof reference was found

INVALID
→ the input is missing, malformed, forbidden or rejected

NON_OPERATIONAL
→ the registry, source or verifier state is unavailable, malformed or inconsistent
```

### Audit-first

Relevant records, changes, validation steps and findings should remain reviewable, reconstructible and versioned.

### Append-only

Evidence history should be extended through new records, events, findings or commits, not silently rewritten.

---

## 3. Product and system hierarchy

The public platform must preserve the following hierarchy.

```text
IPR
→ base operational product

IPR AI Audit Trail
→ first MVP / pilot use case

HBCE
→ operational ecosystem where IPR works

JOKER-C2
→ runtime demonstrator

MATRIX
→ wider architectural framework
```

The first product to validate is not the entire MATRIX framework.

The first product to validate is IPR.

The first MVP derived from IPR is IPR AI Audit Trail.

---

## 4. What HBCE is

HBCE is the operational ecosystem where IPR works.

HBCE provides:

- governance rules;
- private verification boundaries;
- registry references;
- verification surfaces;
- EVT continuity;
- OPC proof;
- evidence-pack support;
- fail-closed behavior;
- public/private evidence separation.

HBCE is not the base product.

The base product is IPR.

---

## 5. What JOKER-C2 is

JOKER-C2 is the runtime demonstrator.

It shows how IPR can operate inside HBCE through:

- governed AI-assisted workflows;
- context classification;
- risk classification;
- governance decisioning;
- human validation;
- EVT event generation;
- OPC proof generation;
- audit-ready reporting.

JOKER-C2 is not the commercial product, not an autonomous authority, not a public authority system and not a production command system.

---

## 6. What MATRIX is

MATRIX is the wider architectural framework.

MATRIX connects:

- human IPRs;
- organizational IPRs;
- AI IPRs;
- derived IPRs;
- robotic IPRs;
- node IPRs;
- system IPRs;
- process IPRs.

MATRIX is not the first product to sell.

The first product is IPR.

The first MVP is IPR AI Audit Trail.

---

## 7. Operational model

The high-level operational model is:

```text
SUBJECT
↓
IPR / IPR VERIFIED
↓
ACTION
↓
EVT EVENT
↓
OPC PROOF
↓
REGISTRY REFERENCE
↓
VERIFY
↓
AUDIT-READY HISTORY
```

The IPR Verified private/public model is:

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
VERIFY / AUDIT / EVT / OPC
```

The IPR AI Audit Trail model is:

```text
IPR OPERATIONAL REFERENCE
↓
DOCUMENT UPLOAD
↓
DOCUMENT SHA-256
↓
AI-ASSISTED ANALYSIS
↓
GOVERNANCE DECISION
↓
HUMAN VALIDATION
↓
EVT EVENT
↓
OPC PROOF
↓
AUDIT-READY REPORT
```

---

## 8. Public platform spine

The current public platform spine is:

```text
/
ipr/
what-is-ipr/
create/
activate/
matrix-audit-trail/
joker-c2/
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
pricing/
buy/
enterprise/
b2g/
industry/
partners/
contact/
```

Some route names may retain historical MATRIX terminology for deployment continuity.

Current interpretation is governed by this manifest:

```text
MATRIX = architectural framework
IPR = first operational product
IPR AI Audit Trail = first MVP
```

---

## 9. Registry and verification

The public registry is a minimized public proof-reference layer.

It may expose:

- public labels;
- verification levels;
- payload hashes;
- timestamps;
- status fields;
- EVT references;
- OPC references;
- public-safe notes.

The public registry must not expose:

- identity documents;
- tax codes;
- document numbers;
- private evidence;
- customer files;
- private prompts;
- private outputs;
- production logs;
- credentials;
- secrets;
- private keys;
- sensitive operational payloads.

A public registry match means only that a public proof reference exists.

It does not certify legal identity, regulated KYC / AML compliance, eIDAS qualification, cybersecurity assurance, public authority approval, institutional adoption or production authorization.

---

## 10. Evidence, registry and tools

The repository includes surfaces and files for:

- public proof references;
- registry v3;
- verification;
- evidence-pack verification;
- link audit;
- registry guard;
- EVT and OPC references;
- IPR AI Audit Trail self-pilot.

Key areas:

```text
registry/
verify/
verify-pack/
tools/
tools/link-audit/
tools/registry-guard.js
protocol/
schemas/
```

The public layer must remain hash-oriented, minimized and non-custodial.

---

## 11. Governance and policy surfaces

The repository includes public governance and policy surfaces:

```text
claims/
legal/
privacy/
terms/
security/
compliance/
governance/
```

These pages define the public boundary of the platform.

They should be read together with:

```text
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
```

---

## 12. What this repository is not

This repository is not:

- a public authority registry;
- a civil identity registry;
- a public identity-document database;
- a legal certification system;
- a regulated certification scheme;
- an eIDAS qualified trust service;
- a regulated KYC / AML provider;
- a financial or banking service;
- a cybersecurity certification system;
- a production-grade enterprise SaaS platform by itself;
- an autonomous AI authority;
- a surveillance infrastructure;
- a replacement for legal, privacy, cybersecurity, compliance, procurement or institutional review.

---

## 13. Safe use boundary

Public demos, public tools and R&D pilots should use only:

- synthetic materials;
- public materials;
- owned non-sensitive materials;
- expressly authorized non-sensitive materials.

Do not use the public layer for:

- tax codes;
- identity documents;
- document numbers;
- customer data;
- confidential third-party data;
- secrets;
- credentials;
- private keys;
- production logs;
- private evidence;
- private prompts;
- private outputs;
- regulated evidence requiring protected handling;
- sensitive operational payloads.

If real identity verification or sensitive evidence is required, it must occur outside the public layer in a separate legal, privacy, security and operational framework.

---

## 14. Status

The current public route layer has passed the configured route audit.

Current audit interpretation:

```text
BAD ROUTE REFERENCES: OK
ACTIONABLE LEGACY TEXT REFERENCES: OK
BROKEN OR UNREACHABLE INTERNAL ROUTES: OK
AUDIT INTERPRETATION: PASS
```

Expected legacy or guardrail references may remain only in:

- archival audit reports;
- schema forbidden-field lists;
- verification guardrails;
- registry guard code;
- link-audit pattern lists;
- historical filenames.

Those expected references do not fail the public route audit.

---

## 15. Non-claims

This repository does not claim:

- legal certification;
- regulatory approval;
- eIDAS qualification;
- qualified trust-service status;
- regulated KYC / AML provider status;
- public authority approval;
- public-sector adoption;
- external audit certification;
- automated compliance;
- legally binding evidence status by itself;
- financial or banking authorization;
- production-grade enterprise SaaS readiness;
- cybersecurity certification;
- critical-infrastructure authorization;
- robotics or autonomous-system authorization.

Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.

---

## 16. Seal

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**
