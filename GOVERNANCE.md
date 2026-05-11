# GOVERNANCE — IPR / HBCE Platform

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

---

## 0. Purpose

This document defines the governance posture for the HBCE Platform.

HBCE Platform is an experimental R&D platform for operational identity, IPR Verified private verification, public proof minimization, audit-ready event records, fail-closed governance and responsibility-preserving AI workflows.

This governance is technical and audit-oriented. It is not political governance, public authority governance, regulated certification governance, eIDAS qualification, KYC / AML provider governance or institutional authorization.

---

## 1. Core governance model

The current platform hierarchy is:

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

The governance objective is to make system states reviewable, attributable, reconstructible and resistant to ambiguous validity, while preserving human responsibility and public/private data separation.

---

## 2. Primacy of human responsibility

HBCE Platform treats AI and cybernetic components as support layers.

IPR, JOKER-C2, EVT, OPC, registry tools, verification tools and evidence-pack tools are not autonomous authorities. They are technical instruments for attribution, verification, auditability and continuity.

AI-assisted workflows must remain connected to:

- human validation;
- responsibility ownership;
- policy constraints;
- audit metadata;
- event continuity;
- public/private data separation;
- fail-closed escalation when required conditions are missing.

If an AI-assisted workflow cannot preserve accountability, validation or auditability, it should block, escalate or require human review.

---

## 3. IPR Verified governance boundary

IPR Verified is the private-verification profile of IPR.

IPR Verified may use private identity verification based on:

- tax code / fiscal code;
- identity card / CIE;
- passport;
- driving license;
- private evidence package.

This material belongs only in the private verification layer.

The public layer must not contain:

- tax codes;
- fiscal codes;
- codice fiscale values;
- document numbers;
- identity document numbers;
- identity card / CIE numbers;
- passport numbers;
- driving license numbers;
- identity documents;
- identity document scans or photos;
- portrait images;
- biometric material;
- private evidence;
- personal data;
- personal payloads.

The public layer may contain only minimized proof references such as:

- `subject_label`;
- `operator_label`;
- `verification_level`;
- `payload_sha256`;
- `timestamp`;
- `status`;
- `evt_id`;
- `opc_id`.

Supported public verification levels are:

```text
IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
RND_ONLY
NOT_APPLICABLE
```

These labels are technical status indicators. They do not create legal identity, regulated KYC / AML compliance, eIDAS qualification, public authority approval or production authorization by themselves.

---

## 4. Non-sovereignty and non-public-authority status

HBCE Platform is not a public authority.

The platform does not:

- act as a public registry;
- assign civil rights;
- issue legal identity;
- replace SPID, CIE, EUDI Wallet or eIDAS schemes;
- replace public registries;
- issue regulated certifications;
- act as a qualified trust service;
- act as a regulated KYC / AML provider;
- authorize public-sector or critical-infrastructure operations;
- create legal, political or institutional recognition by itself.

HBCE Platform provides technical traceability, public proof minimization, append-only continuity and audit-oriented reconstruction.

---

## 5. Public proof governance

The public registry is a minimized proof-reference layer.

A public proof reference may show:

- that a public hash-oriented reference exists;
- that a payload hash matches an expected value;
- that a timestamped public record exists;
- that a public status field has been declared;
- that an EVT or OPC reference may support technical reconstruction.

A public proof reference does not show by itself:

- legal identity;
- civil identity;
- regulated KYC / AML compliance;
- eIDAS qualification;
- public authority approval;
- institutional validation;
- legal authorization;
- regulated certification;
- production compliance;
- cybersecurity assurance;
- truthfulness of private claims without supporting private evidence.

---

## 6. Territorial and organizational labels

Public records may use coarse labels for context, readability and audit continuity.

Acceptable public labels may include:

- country;
- region;
- city;
- public organization label;
- public subject label;
- public node label;
- public operator label.

Public records must not include:

- street addresses;
- precise geolocation;
- private residence data;
- identity document data;
- raw personal identifiers;
- sensitive territorial details;
- private infrastructure topology.

Any territorial or organizational label in the repository is a public R&D context label unless separately validated through a lawful production framework.

---

## 7. Roles

The platform uses the following governance roles.

### Subject

The subject is the human, organization, AI system, workflow, node or process associated with an IPR-linked event or record.

The subject or authorized process is responsible for controlling private evidence outside the public layer.

### IPR

IPR is the operational identity record linking subject, role, event, proof, responsibility and continuity.

### IPR Verified

IPR Verified is the private-verification profile. It may rely on tax-code and valid identity-document evidence only in a private, controlled verification layer.

### HBCE

HBCE is the operational ecosystem that organizes policy, verification, registry references, EVT continuity, OPC proof, evidence packs and fail-closed governance.

### JOKER-C2

JOKER-C2 is the runtime demonstrator. It supports governed AI-assisted workflows but does not replace human responsibility or institutional validation.

### MATRIX

MATRIX is the broader architectural framework. It is not the first commercial product and should not be presented as a regulated authority or certification system.

### EVT

EVT records operational events and continuity checkpoints.

### OPC

OPC records operational proof references connected to events, auditability and continuity.

### Registry

The public registry stores minimized proof references only. It must not store private evidence or identity documents.

---

## 8. Validation and fail-closed governance

An event, registry entry or proof reference is technically valid only when the required structure can be verified under the relevant schema and policy.

A public event or registry entry should include, where applicable:

- parseable JSON;
- valid public labels;
- valid `payload_sha256`;
- valid timestamp;
- public payload policy;
- verification level;
- status;
- fail-closed boundary;
- no forbidden public fields.

Fail-closed means that the workflow should block, escalate or require human review when:

- evidence is missing;
- JSON is malformed;
- a required field is absent;
- a hash is invalid;
- the registry is unreachable;
- a proof mismatch occurs;
- private evidence is required but unavailable;
- identity data appears in the public layer;
- responsibility ownership is unclear;
- human validation is missing;
- the system cannot distinguish authorized and unauthorized use.

Technical validity does not equal legal recognition.

---

## 9. Public data restrictions

The public repository, public registry, public pages, public issues and public demo tools must not contain:

- API keys;
- private keys;
- passwords;
- authentication tokens;
- wallet private keys;
- signing keys;
- production secrets;
- tax codes;
- fiscal codes;
- codice fiscale values;
- document numbers;
- identity document numbers;
- identity card / CIE numbers;
- passport numbers;
- driving license numbers;
- identity documents;
- identity document scans or photos;
- biometric material;
- customer data;
- private communications;
- private prompts;
- private AI outputs;
- production logs containing personal data;
- sensitive operational payloads;
- private endpoints;
- internal infrastructure topology.

If any such material is discovered in the public layer, the correct governance response is removal, review and fail-closed remediation.

---

## 10. Conflict handling

HBCE Platform does not arbitrate legal, political, contractual or institutional disputes.

The system records technical traces and proof references.

Any dispute involving legal rights, institutional status, identity validity, contractual claims, regulatory obligations or public authority decisions must be resolved outside the platform through the applicable lawful process.

---

## 11. AI governance and human responsibility

AI-assisted outputs must be treated as decision-support unless a separate lawful, validated and accountable process establishes otherwise.

The platform does not authorize AI systems to replace:

- human responsibility;
- legal responsibility;
- professional judgment;
- institutional responsibility;
- contractual acceptance;
- external audit;
- regulated certification;
- compliance programs;
- cybersecurity assurance;
- public authority approval.

The governance function of HBCE is to preserve traceability, responsibility and auditability, not to remove responsibility from humans or institutions.

---

## 12. Evolution

Governance changes should be:

- additive where possible;
- documented;
- public;
- versioned;
- audit-readable;
- consistent with public/private evidence separation;
- consistent with fail-closed behavior;
- consistent with no public identity custody;
- consistent with IPR Base / IPR Verified / IPR Professional distinctions.

Breaking changes should be clearly documented and should not silently rewrite prior evidence.

---

## 13. Maintainer statement

HBCE Platform is maintained as part of the HBCE Research / HERMETICUM B.C.E. R&D initiative.

The platform is designed to explore verifiable technological infrastructure where actions, records, identities and governance states remain attributable, reconstructible and auditable over time.

IPR Verified strengthens the professional identity-verification model of the platform, but public proof remains minimized, hash-oriented, non-custodial and non-certifying.

