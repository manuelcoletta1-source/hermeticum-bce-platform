# HBCE System Specification

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

---

## 0. Purpose

This document provides the general system specification of the HBCE Platform.

HBCE Platform is an experimental R&D infrastructure designed to explore verifiable technological environments where identity, events, proof references, registries, runtime execution and governance states remain attributable, reconstructible and auditable over time.

The system is organized around an IPR-first model:

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

This specification is an R&D system reference. It is not a legal standard, not a regulated certification scheme, not an eIDAS qualified trust service, not a regulated KYC / AML provider, not a public authority registry and not a production compliance framework by itself.

---

## 1. System components

The HBCE system is composed of the following interacting components:

- IPR identity layer;
- IPR Verified private verification layer;
- EVT event layer;
- OPC proof layer;
- Registry layer;
- Verification layer;
- Evidence-pack layer;
- JOKER-C2 runtime demonstrator;
- HBCE governance ecosystem;
- MATRIX architectural framework.

These components form the operational structure of the system.

---

## 2. IPR identity layer

The identity layer associates actions with operational identity references.

IPR — Identity Primary Record — is the base operational product.

An IPR is designed to connect:

- subject reference;
- role;
- operation;
- event;
- proof;
- responsibility;
- continuity;
- verification.

Entities may include:

- human operators;
- organizations;
- artificial intelligence systems;
- AI agents;
- machines;
- process records;
- infrastructure nodes;
- audit workflows.

The IPR layer does not replace legal identity systems, public registries, SPID, CIE, EUDI Wallet, eIDAS schemes, digital signatures or qualified trust services.

Reference files:

```text
schemas/ipr.schema.json
protocol/ipr-event-v1.md
ipr.json
IPR_RELEASE.json
```

---

## 3. IPR profile model

The platform distinguishes three IPR profiles.

### IPR Base

IPR Base is a technical R&D record.

It can be used for:

- local testing;
- internal proof flows;
- controlled demonstrations;
- registry and verification experiments;
- IPR AI Audit Trail MVP testing.

IPR Base does not create verified identity status.

### IPR Verified

IPR Verified is the private-verification profile.

The target model may use:

```text
tax code
identity card / CIE
passport
driving license
private evidence package
```

This evidence belongs only in the private verification layer.

The public layer must not contain:

```text
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
biometric material
private evidence
personal data
personal payload
```

The public layer may contain only minimized proof references such as:

```text
subject_label
verification_level
payload_sha256
timestamp
status
evt_id
opc_id
```

### IPR Professional

IPR Professional is a future professional / business / audit profile based on IPR Verified.

It is intended for:

- controlled B2B pilots;
- audit-ready workflows;
- AI governance workflows;
- legal-operations documentation;
- cybersecurity documentation;
- regulated-sector R&D testing.

IPR Professional does not create regulated certification, public authority validation, eIDAS qualification, KYC / AML provider status or production SaaS readiness by itself.

---

## 4. Private verification layer

The private verification layer exists only for controlled IPR Verified workflows.

It may include private evidence such as:

- tax code / fiscal code;
- identity card / CIE;
- passport;
- driving license;
- private evidence package;
- private verification status.

This evidence must remain outside:

- public repository files;
- public registry files;
- public GitHub issues;
- public commits;
- public demo pages;
- public proof records;
- public audit artifacts.

The private verification layer may generate hash-oriented proof references, but the underlying evidence must not be published.

---

## 5. EVT event layer

Operational activity is represented through structured events.

EVT records may represent:

- IPR Base creation;
- IPR Verified private-check reference;
- AI output recording;
- policy check;
- risk assessment;
- governance decision;
- human validation;
- evidence-pack creation;
- registry status update;
- verification request;
- verification result;
- continuity checkpoint;
- audit event.

EVT records should remain append-only and fail-closed.

Reference files:

```text
schemas/hbce-evt.schema.json
protocol/ipr-event-v1.md
registry/events.json
```

---

## 6. OPC proof layer

OPC is the operational proof layer connected to EVT events and IPR-linked workflows.

An OPC proof may reference:

- IPR reference;
- EVT reference;
- document hash;
- evidence-pack hash;
- AI output hash;
- verification state;
- timestamp;
- signature reference;
- audit report reference.

OPC moves the system from simple event logging to operational proof.

OPC does not create legal certification, eIDAS qualification, public authority approval or production authorization by itself.

---

## 7. Registry layer

The registry layer exposes minimized public proof references.

The registry must not act as a public identity database or evidence custody system.

Registry entries may include:

- `entity_type`;
- `subject_label`;
- `operator_label`;
- `record_scope`;
- `verification_level`;
- `payload_sha256`;
- `evt_id`;
- `opc_id`;
- `timestamp`;
- `status`;
- `public_payload_policy`.

Registry entries must not include:

- `tax_code`;
- `fiscal_code`;
- `codice_fiscale`;
- `document_number`;
- `identity_document_number`;
- `identity_card_number`;
- `cie_number`;
- `passport_number`;
- `driving_license_number`;
- `identity_document`;
- `identity_document_scan`;
- `portrait_image`;
- `biometric_payload`;
- `private_evidence`;
- `personal_data`;
- `private_key`;
- `credential`;
- `secret`;
- `raw_prompt`;
- `raw_output`;
- `client_file`;
- `production_log`.

Reference files:

```text
registry/registry.json
registry/ledger.json
registry/ipr_registry.json
registry/operators.json
registry/nodes.json
registry/events.json
schemas/hbce-registry-entry.schema.json
```

---

## 8. Verification layer

The verification layer checks public proof references and local controlled artifacts.

Verification may include:

- SHA-256 comparison;
- registry lookup;
- proof-reference inspection;
- verification-level inspection;
- schema validation;
- evidence-pack consistency check;
- fail-closed state handling.

Verification result interpretation:

```text
PUBLIC_REFERENCE_PRESENT
→ a public proof reference exists

NO_PUBLIC_RECORD
→ no matching public proof reference was found

NON_OPERATIONAL
→ registry or verifier state is invalid

INVALID
→ input is missing, malformed, ambiguous, forbidden or rejected
```

A match does not certify legal identity, regulated KYC / AML compliance, eIDAS qualification, cybersecurity assurance, public authority approval, operator qualification or production authorization.

Reference routes:

```text
verify/
verify-pack/
registry/
```

---

## 9. Evidence-pack layer

Evidence packs are technical artifacts used to support proof continuity and audit reconstruction.

Evidence packs may include:

- `PACK_MANIFEST`;
- `RESULT`;
- `CHAIN_ENTRY`;
- EVT reference;
- OPC reference;
- payload hashes;
- proof hashes;
- verification-level metadata.

Evidence packs must not be used as public containers for:

- tax codes;
- identity documents;
- document numbers;
- private evidence;
- private prompts;
- private AI outputs;
- customer files;
- personal payloads.

The evidence-pack layer supports auditability. It does not create legal certification or regulated compliance by itself.

Reference route:

```text
verify-pack/
```

---

## 10. JOKER-C2 runtime demonstrator

JOKER-C2 is the runtime demonstrator.

It shows how IPR can operate inside HBCE through:

- runtime interaction;
- context classification;
- governance decisioning;
- risk classification;
- human validation;
- EVT event generation;
- OPC proof generation;
- audit-oriented reporting.

JOKER-C2 is not the base commercial product.

The base product is IPR.

JOKER-C2 does not replace legal review, institutional validation, security certification, human responsibility or production governance.

Reference routes:

```text
joker-c2/
ai-joker-c2/
```

Runtime:

```text
https://hbce-ai-joker-c2.vercel.app/interface
```

---

## 11. IPR AI Audit Trail MVP

IPR AI Audit Trail is the first MVP use case.

It demonstrates how AI-assisted document workflows can become:

- attributable;
- traceable;
- human-validated;
- event-linked;
- proof-linked;
- audit-ready;
- fail-closed.

Minimal MVP flow:

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

The current deployed route is:

```text
matrix-audit-trail/
```

The route name remains for deployment continuity, but the product interpretation is:

```text
IPR AI Audit Trail
```

---

## 12. HBCE governance ecosystem

HBCE is the operational ecosystem where IPR works.

HBCE provides:

- governance rules;
- policy boundaries;
- registry references;
- verification surfaces;
- EVT continuity;
- OPC proof;
- evidence-pack support;
- fail-closed behavior;
- public/private evidence separation.

HBCE is not the base product. The base product is IPR.

HBCE is not a public authority infrastructure, civil registry, eIDAS trust service, regulated certification system or KYC / AML provider.

Reference route:

```text
hbce/
```

---

## 13. MATRIX architectural framework

MATRIX is the broader architectural framework.

MATRIX connects:

- human IPRs;
- organizational IPRs;
- AI IPRs;
- derived IPRs;
- robotic IPRs;
- node IPRs;
- system IPRs;
- process IPRs.

MATRIX should not be presented as the first product to sell.

The first product is IPR.

The first MVP is IPR AI Audit Trail.

---

## 14. Conceptual system flow

General system flow:

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

IPR AI Audit Trail flow:

```text
IPR OPERATIONAL REFERENCE
↓
DOCUMENT
↓
DOCUMENT HASH
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
AUDIT REPORT
```

IPR Verified private/public flow:

```text
PRIVATE VERIFICATION
↓
TAX CODE + VALID IDENTITY DOCUMENT
↓
PRIVATE EVIDENCE PACKAGE
↓
IPR VERIFIED RECORD
↓
MINIMIZED PUBLIC PROOF REFERENCE
↓
VERIFY / AUDIT / EVT / OPC
```

---

## 15. Repository structure

The repository is organized as follows:

```text
docs/
→ conceptual documentation

protocol/
→ technical specifications and R&D references

schemas/
→ JSON schemas for IPR, registry, EVT and evidence structures

registry/
→ public proof-reference state

verify/
→ verification surfaces

verify-pack/
→ evidence-pack verification

ipr/
→ IPR product page

activate/
→ IPR Verified private verification gateway

matrix-audit-trail/
→ IPR AI Audit Trail MVP

joker-c2/
→ JOKER-C2 runtime demonstrator page
```

---

## 16. Governance and non-claims

HBCE Platform is an R&D reference platform.

It does not claim:

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
- production-grade enterprise SaaS readiness.

Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.

---

## 17. Purpose

The purpose of HBCE is to explore infrastructures where operational actions remain attributable and reconstructible over time.

Within the Reality Engineering framework, the system serves as an experimental environment for verifiable technological infrastructures.

The current operational focus is the development of an IPR Verified gateway and the IPR AI Audit Trail MVP.

