# PRIVACY — GDPR-MIN / IPR VERIFIED

**HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA**  
**HERMETICUM B.C.E. S.r.l.**

---

## 0. Purpose

This document defines the privacy posture of the HBCE Platform and the IPR Verified gateway model.

The platform follows a GDPR-minimized design: private identity verification may occur only in a controlled private layer, while the public layer must expose only minimized proof references.

---

## 1. Core principle

HBCE Platform does not publish personal data in clear text.

The platform operates through:

- minimized public metadata;
- hash-oriented proof references;
- append-only public records;
- fail-closed verification;
- strict separation between private evidence and public proof.

The public registry is not an identity database, not a public data vault, not a KYC/AML register and not an eIDAS qualified trust service.

---

## 2. IPR Verified private verification

IPR Verified may use private identity verification based on:

- tax code / fiscal code;
- valid identity card / CIE;
- valid passport;
- valid driving license;
- private evidence package.

This material belongs only in the private verification layer.

It must not be stored in:

- the public repository;
- public registry files;
- public GitHub issues;
- public commits;
- public pages;
- public demo tools;
- public proof records.

---

## 3. Data never allowed in the public layer

The public layer must not contain:

- tax codes or fiscal codes;
- document numbers;
- identity card / CIE numbers;
- passport numbers;
- driving license numbers;
- identity documents;
- document scans or photographs;
- portrait images;
- biometric material;
- street addresses;
- dates of birth;
- raw personal identifiers;
- private evidence;
- customer files;
- confidential third-party material;
- private prompts;
- private AI outputs;
- production logs;
- secrets, credentials, tokens or private keys;
- sensitive operational payloads.

---

## 4. Public data allowed

The public layer may contain only minimized technical fields such as:

- `subject_label`;
- `operator_label`;
- `entity_type`;
- `record_scope`;
- `verification_level`;
- `payload_sha256`;
- `evt_id`;
- `opc_id`;
- `timestamp`;
- `status`;
- public-safe notes.

Supported public verification levels include:

```text
IPR_BASE_NOT_VERIFIED
IPR_VERIFIED_PRIVATE_CHECK
IPR_PROFESSIONAL_PILOT
RND_ONLY
NOT_APPLICABLE

These labels are technical status indicators. They do not create legal identity, regulated KYC/AML compliance, eIDAS qualification, public authority approval or production authorization.


---

5. Off-chain / private evidence model

The real evidence remains off-chain and outside the public layer.

The public registry may contain only a hash-oriented commitment or minimized proof reference.

The hash allows later verification without exposing the underlying private evidence.

private evidence
→ controlled private layer
→ hash-oriented commitment
→ minimized public proof reference
→ deterministic verification


---

6. Transfers and third parties

HBCE Platform does not require commercial transfer of personal data.

HBCE Platform does not require extra-EU transfer as a protocol condition.

Any future external pilot, customer workflow, private verification process or production deployment must define a separate legal basis, data-processing boundary, security boundary, retention model, access-control model and responsibility owner.


---

7. Security

The privacy model is supported by:

absence of sensitive personal data in the public layer;

separation between private evidence and public proof;

hash-oriented public verification;

append-only public records;

fail-closed behavior;

no public custody of tax codes, document numbers or identity documents;

no public custody of private keys, credentials or secrets.


If private or sensitive data is accidentally discovered in the public layer, it must be reported according to SECURITY.md.

Do not copy, redistribute, index, reuse or amplify exposed sensitive material.


---

8. Non-claims

HBCE Platform does not claim:

legal identity certification;

regulated KYC/AML provider status;

eIDAS qualification;

qualified trust-service status;

public authority validation;

public-sector adoption;

automated compliance;

production-grade enterprise SaaS readiness.


IPR Verified strengthens the professional identity-verification model, but it remains separate from legal identity schemes and regulated certification systems unless a future lawful production framework is independently established.


---

9. Changes

Changes to this privacy posture should be:

additive where possible;

public;

versioned;

audit-readable;

consistent with GDPR minimization;

consistent with the public/private evidence separation model.

