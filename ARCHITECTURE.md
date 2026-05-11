# HBCE System Architecture

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

---

## 0. Purpose

This document provides a high-level architecture overview of the HBCE Platform.

HBCE is an experimental R&D infrastructure designed to support verifiable technological environments within the Reality Engineering framework.

The current architecture is organized around an IPR-first model:

```text
IPR = base operational product
IPR Base = technical R&D record, not verified identity
IPR Verified = private verification with tax code + valid identity document
IPR Professional = business / audit profile based on IPR Verified
IPR AI Audit Trail = first MVP use case
HBCE = operational ecosystem
JOKER-C2 = runtime demonstrator
MATRIX = architectural framework

This architecture is not a public authority system, not an eIDAS qualified trust service, not a regulated KYC / AML provider, not a civil identity registry, not a legal certification system and not a production compliance framework by itself.


---

1. Architectural layers

The system is organized into several interacting layers.

IPR identity layer
IPR Verified private verification layer
EVT event layer
OPC proof layer
Registry v3 public proof layer
Verify / Verify Pack layer
JOKER-C2 runtime demonstrator
HBCE governance ecosystem
MATRIX architectural framework

These layers together form the operational architecture of the system.

The architecture is designed to keep private verification, public proof, runtime execution, registry state and verification logic separated but interoperable.


---

2. IPR identity layer

The identity layer is implemented through IPR — Identity Primary Record.

The purpose of IPR is to associate actions, workflows, events and proof references with operational identity.

Entities may include:

human operators;

organizations;

artificial intelligence systems;

AI agents;

machines;

infrastructure nodes;

document workflows;

audit processes.


IPR is not only a login, account, signature or hash. It is an operational reference designed to connect identity, event, proof, responsibility and continuity.


---

3. IPR profile model

The architecture distinguishes three IPR profiles.

IPR Base

IPR Base is a technical R&D record.

It is useful for:

local testing;

internal proof flows;

controlled demonstrations;

registry and verification experiments;

IPR AI Audit Trail MVP testing.


IPR Base does not create verified identity status.

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
identity document scan
portrait image
biometric material
private evidence
personal data
personal payload

The public layer may contain only minimized proof references such as:

subject_label
verification_level
payload_sha256
timestamp
status
evt_id
opc_id

IPR Professional

IPR Professional is a future professional / business / audit workflow profile based on IPR Verified.

It is intended for:

B2B pilots;

audit-ready workflows;

AI governance workflows;

legal-operations documentation;

cybersecurity documentation;

regulated-sector R&D review.


It does not create regulated certification, public authority validation, eIDAS qualification, KYC / AML provider status or production SaaS readiness by itself.


---

4. Private verification layer

The private verification layer exists only for controlled IPR Verified workflows.

It separates sensitive evidence from public proof.

Private verification may include:

tax code / fiscal code;

identity card / CIE;

passport;

driving license;

private evidence package;

controlled verification status.


This layer must remain outside:

public repository files;

public registry files;

public GitHub issues;

public commits;

public demo pages;

public proof records;

public audit artifacts.


The private verification layer may generate hash-oriented proof references, but the underlying evidence must not be published.


---

5. EVT event layer

Operational activity is represented through EVT records.

EVT records can describe:

IPR Base creation;

IPR Verified private-check reference;

AI output recording;

policy check;

risk assessment;

governance decision;

human validation;

evidence-pack creation;

registry status update;

verification request;

verification result;

continuity checkpoint;

audit event.


Reference specification:

schemas/hbce-evt.schema.json
protocol/ipr-event-v1.md
registry/events.json

EVT records must remain privacy-minimal when exposed publicly.


---

6. OPC proof layer

OPC is the operational proof layer connected to EVT events and IPR-linked workflows.

An OPC proof may reference:

IPR reference;

EVT reference;

document hash;

evidence-pack hash;

AI output hash;

verification state;

timestamp;

signature reference;

audit report reference.


OPC moves the architecture from simple event logging to operational proof.

OPC does not create legal certification, eIDAS qualification, public authority approval or production authorization by itself.


---

7. Registry layer

The registry exposes the observable public proof state of the infrastructure.

The registry layer is based on:

Registry v3
append-only public references
verification_level support
payload_sha256
fail-closed validation
public proof minimization
no public identity custody

Registry files include:

registry/registry.json
registry/ledger.json
registry/ipr_registry.json
registry/operators.json
registry/nodes.json
registry/events.json

The registry may publish:

public labels;

verification level;

payload hash;

timestamp;

status;

EVT reference;

OPC reference;

public-safe note.


The registry must not publish:

tax codes;

document numbers;

identity documents;

document scans;

biometric data;

private evidence;

private keys;

credentials;

secrets;

raw prompts;

raw AI outputs;

customer files;

production logs;

sensitive operational payloads.


A registry match means only that a public proof reference exists.

It does not certify legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority approval, cybersecurity assurance or production authorization.


---

8. Verification layer

The verification layer checks public proof references and local controlled artifacts.

Verification may include:

SHA-256 comparison;

registry lookup;

verification-level inspection;

proof-reference inspection;

schema validation;

evidence-pack consistency check;

fail-closed state handling.


Verification result interpretation:

PUBLIC_REFERENCE_PRESENT
→ a public proof reference exists

NO_PUBLIC_RECORD
→ no matching public proof reference was found

NON_OPERATIONAL
→ registry or verifier state is invalid

INVALID
→ input is missing, malformed, ambiguous, forbidden or rejected

Verification does not create legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority approval or production authorization.


---

9. Evidence-pack layer

Evidence packs support technical proof continuity and audit reconstruction.

Evidence packs may include:

PACK_MANIFEST;

RESULT;

CHAIN_ENTRY;

EVT reference;

OPC reference;

payload hashes;

proof hashes;

verification-level metadata.


Evidence packs must not be used as public containers for:

tax codes;

identity documents;

document numbers;

private evidence;

private prompts;

private AI outputs;

customer files;

personal payloads.


Reference route:

verify-pack/


---

10. Infrastructure nodes

Nodes represent public or private operational points within the HBCE architecture.

Node specification:

protocol/hbce-node-spec-v1.md
registry/nodes.json

Public node records are descriptive R&D metadata.

They must not expose:

private endpoints;

internal hostnames;

private IPs;

secrets;

credentials;

production topology;

customer data;

sensitive infrastructure information.


Public node records do not prove production deployment, territorial coverage, public authority approval or infrastructure activation by themselves.


---

11. JOKER-C2 runtime demonstrator

Operational coordination across the demonstration environment is handled through JOKER-C2.

JOKER-C2 demonstrates:

AI-assisted workflow execution;

context classification;

policy and risk evaluation;

governance decisioning;

human validation;

EVT event generation;

OPC proof generation;

audit-oriented reporting.


JOKER-C2 is the runtime demonstrator. It is not the base product.

The base product is IPR.

JOKER-C2 does not replace legal review, institutional validation, security certification, human responsibility or production governance.

Reference route:

joker-c2/

Runtime:

https://hbce-ai-joker-c2.vercel.app/interface


---

12. IPR AI Audit Trail MVP

IPR AI Audit Trail is the first MVP use case of the architecture.

It demonstrates how AI-assisted document workflows can become:

attributable;

traceable;

human-validated;

event-linked;

proof-linked;

audit-ready;

fail-closed.


Minimal flow:

IPR operational reference
↓
document upload
↓
document SHA-256
↓
AI-assisted analysis
↓
governance decision
↓
human validation
↓
EVT event
↓
OPC proof
↓
audit-ready report

The deployed route may still be named matrix-audit-trail/ for continuity, but the product interpretation is IPR AI Audit Trail.


---

13. MATRIX framework context

MATRIX is the broader architectural framework.

MATRIX connects:

human IPRs;

organizational IPRs;

AI IPRs;

derived IPRs;

robotic IPRs;

node IPRs;

system IPRs;

process IPRs.


MATRIX is not the first product to sell.

The first product is IPR.

The first MVP is IPR AI Audit Trail.


---

14. Conceptual flow

General architecture flow:

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

IPR Verified flow:

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

IPR AI Audit Trail flow:

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


---

15. Repository structure

The repository is organized as follows:

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


---

16. Governance and non-claims

HBCE Platform is an R&D reference platform.

It does not claim:

legal certification;

regulatory approval;

eIDAS qualification;

qualified trust-service status;

regulated KYC / AML provider status;

public authority approval;

public-sector adoption;

external audit certification;

automated compliance;

legally binding evidence status by itself;

financial or banking authorization;

production-grade enterprise SaaS readiness;

cybersecurity certification;

operator certification.


Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.


---

17. Security and privacy boundaries

The public architecture must not custody sensitive identity or operational material.

The public layer must not contain:

tax codes;

fiscal codes;

document numbers;

identity documents;

document scans;

portrait images;

biometric material;

private evidence;

private keys;

credentials;

secrets;

customer files;

private prompts;

private AI outputs;

production logs;

sensitive operational payloads.


The public layer may contain:

minimized public labels;

payload_sha256;

verification level;

timestamp;

status;

EVT reference;

OPC reference;

non-sensitive public notes.


When the evidence required for validation is private or sensitive, verification must occur in a controlled private layer and the public layer must fail closed.


---

18. Framework context

HBCE operates as the operational ecosystem layer inside the Reality Engineering framework.

REALITY ENGINEERING
↓
MATRIX ARCHITECTURAL FRAMEWORK
↓
HBCE OPERATIONAL ECOSYSTEM
↓
IPR / EVT / OPC / REGISTRY / VERIFY
↓
JOKER-C2 RUNTIME DEMONSTRATION

The architecture is designed to make technological activity more attributable, reconstructible and verifiable over time.

