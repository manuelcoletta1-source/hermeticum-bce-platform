# HBCE Network

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

---

## 0. Purpose

This document defines the HBCE Network as an R&D network architecture for operational traceability.

The HBCE Network is not presented as an active public infrastructure deployment, territorial coverage network, public authority network, regulated operator network, eIDAS trust network, KYC / AML network or production compliance infrastructure.

The current operational focus is:

```text
IPR Verified gateway
→ public proof minimization
→ Registry v3
→ Verify / Verify Pack
→ IPR AI Audit Trail MVP
→ JOKER-C2 runtime demonstration
```

---

## 1. Network concept

The HBCE Network represents the public-facing and R&D-facing infrastructure layer of the Reality Engineering framework.

It connects:

- IPR references;
- IPR Verified private-verification boundaries;
- EVT events;
- OPC proof records;
- registry references;
- verification surfaces;
- audit-ready outputs;
- runtime demonstration through JOKER-C2.

The network concept is technical and experimental. It does not imply active territorial deployment or production network coverage.

---

## 2. Network status

Current status:

```text
R&D_REFERENCE_NETWORK
PUBLIC_PROOF_NETWORK_ONLY
NO_PRODUCTION_INFRASTRUCTURE_CLAIM
NO_PUBLIC_AUTHORITY_NETWORK
NO_TERRITORIAL_COVERAGE_CLAIM
NO_REGULATED_CERTIFICATION_NETWORK
NO_EIDAS_QUALIFIED_TRUST_NETWORK
NO_KYC_AML_PROVIDER_NETWORK
```

The network supports documentation, proof-reference visibility and controlled pilot design.

It does not create:

- legal identity;
- civil registry status;
- public authority approval;
- public-sector adoption;
- production infrastructure;
- regulated certification;
- cybersecurity assurance;
- KYC / AML compliance;
- eIDAS qualification.

---

## 3. Core network components

The network is composed of several interacting components.

### IPR

IPR is the base operational product.

It connects:

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

### IPR Base

IPR Base is a technical R&D record. It can support testing, registry entries and verification experiments, but it does not create verified identity status.

### IPR Verified

IPR Verified is the private-verification profile. It may use tax-code and valid identity-document evidence only in the private verification layer.

Accepted private evidence categories are:

```text
tax code
identity card / CIE
passport
driving license
private evidence package
```

The public network must not expose those materials.

### IPR Professional

IPR Professional is a future business / audit profile based on IPR Verified.

It remains pilot-oriented and does not create production authorization or regulated certification by itself.

### EVT

EVT records operational events and continuity checkpoints.

### OPC

OPC records operational proof references connected to events, receipts, auditability and evidence continuity.

### Registry

Registry v3 exposes minimized public proof references.

### Verify

Verify checks public proof references and local controlled artifacts through deterministic comparison.

### JOKER-C2

JOKER-C2 is the runtime demonstrator used to show IPR / HBCE / EVT / OPC behavior in a controlled R&D environment.

---

## 4. Nodes

Nodes represent public or private operational points inside the HBCE architecture.

Node specification:

```text
protocol/hbce-node-spec-v1.md
registry/nodes.json
```

Public node entries are descriptive R&D metadata only.

They must not expose:

- private endpoints;
- internal hostnames;
- private IPs;
- internal topology;
- credentials;
- secrets;
- private keys;
- production logs;
- client files;
- tax codes;
- document numbers;
- identity documents;
- private evidence;
- sensitive infrastructure payloads.

A public node entry does not certify active deployment, territorial coverage, production status, security assurance, public authority approval or institutional mandate.

---

## 5. Identity layer

The identity layer associates actions with IPR references.

Identity specification:

```text
schemas/ipr.schema.json
protocol/ipr-event-v1.md
```

The identity layer supports:

- IPR Base;
- IPR Verified;
- IPR Professional;
- human IPRs;
- organizational IPRs;
- AI IPRs;
- node IPRs;
- process IPRs.

The identity layer must maintain a strict separation between private verification and public proof.

---

## 6. Event layer

Events represent actions performed by entities within the infrastructure.

Event records are exposed through the public event registry only as minimized metadata and hash-oriented references.

Event registry:

```text
registry/events.json
schemas/hbce-evt.schema.json
```

Public event entries may show that a public event reference exists.

They do not prove legal identity, KYC / AML compliance, production status, public authority approval or regulatory compliance by themselves.

---

## 7. Registry layer

The registry provides the observable public proof-reference state of the network.

Registry files:

```text
registry/ledger.json
registry/registry.json
registry/ipr_registry.json
registry/events.json
registry/nodes.json
registry/operators.json
```

The registry may expose:

- public labels;
- verification level;
- payload hash;
- timestamp;
- status;
- EVT reference;
- OPC reference;
- public-safe note.

The registry must not expose:

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
private_key
credential
secret
raw_prompt
raw_output
client_file
production_log
internal_endpoint
private_ip
internal_hostname
database_url
admin_url
```

---

## 8. Verification layer

The verification layer provides deterministic checks for public proof references and controlled local artifacts.

Verification may return:

```text
PUBLIC_REFERENCE_PRESENT
NO_PUBLIC_RECORD
INVALID
NON_OPERATIONAL
```

These states are technical verification states.

A public match does not certify:

- legal identity;
- civil identity;
- KYC / AML compliance;
- eIDAS qualification;
- public authority approval;
- cybersecurity assurance;
- production authorization;
- institutional adoption.

---

## 9. Coordination engine

Operational coordination across the demonstration environment is performed by JOKER-C2.

JOKER-C2 demonstrates:

- AI-assisted workflow execution;
- context classification;
- risk classification;
- policy decisioning;
- human validation;
- EVT event generation;
- OPC proof generation;
- audit-oriented reporting.

JOKER-C2 is not the commercial product.

JOKER-C2 is not a production authority, autonomous decision authority, security certification system or public-sector control system.

---

## 10. Network flow

The operational flow of the network can be represented as:

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
NETWORK HISTORY
```

For IPR Verified:

```text
PRIVATE VERIFICATION
↓
TAX CODE + VALID IDENTITY DOCUMENT
↓
PRIVATE EVIDENCE PACKAGE
↓
IPR VERIFIED RECORD
↓
HASH-ORIENTED PUBLIC PROOF
↓
REGISTRY REFERENCE
↓
VERIFY
↓
AUDIT / EVT / OPC
```

For IPR AI Audit Trail:

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

---

## 11. Network role

Within the Reality Engineering framework, the HBCE Network provides the experimental infrastructure layer supporting operational traceability.

```text
REALITY ENGINEERING
↓
MATRiX ARCHITECTURAL FRAMEWORK
↓
HBCE NETWORK / OPERATIONAL ECOSYSTEM
↓
IPR / EVT / OPC / REGISTRY / VERIFY
↓
JOKER-C2 RUNTIME DEMONSTRATION
```

The current network role is to support:

- public proof-reference visibility;
- verification experiments;
- IPR AI Audit Trail MVP;
- controlled R&D pilot design;
- audit-ready reconstruction;
- fail-closed governance.

---

## 12. Network non-claims

The HBCE Network does not claim:

- active public infrastructure deployment;
- territorial coverage;
- public authority approval;
- public-sector adoption;
- production network status;
- regulated certification;
- cybersecurity assurance;
- eIDAS qualification;
- qualified trust-service status;
- KYC / AML provider status;
- legal identity certification;
- financial or banking authorization.

Any production deployment, external customer pilot, public-sector use, regulated compliance positioning, real identity-verification operation or institutional integration requires independent legal, cybersecurity, privacy, compliance and operational review.

---

## 13. Public/private boundary

The HBCE Network is designed around a strict public/private boundary.

The private layer may contain:

- tax-code evidence;
- valid identity-document evidence;
- private evidence package;
- private operational evidence;
- private review records.

The public layer may contain only:

- public labels;
- verification levels;
- payload hashes;
- timestamps;
- statuses;
- EVT / OPC references;
- public-safe notes.

This separation is mandatory for the IPR Verified gateway model.
